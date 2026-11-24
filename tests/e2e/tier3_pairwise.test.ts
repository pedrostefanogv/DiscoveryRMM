import assert from 'node:assert/strict';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';
import {
  AGENT_ROOT,
  API_ROOT,
  LANDING_ROOT,
  SITE_ROOT,
  WORKSPACE_ROOT,
  buildLandingToTemp,
  extractHtmlAttributes,
  fileExists,
  hasBinaryDfMagic,
  hasNatsSubjectSuffix,
  hasTenantFanoutBinding,
  readPngDimensions,
  readProdFilesNoComments,
  readText,
  renderLandingSsr,
  runTscCheck,
  serveSubpath,
  walkFiles,
  type BuiltLandingResult,
} from './helpers.ts';

describe('Tier 3 — Pairwise Combinatorial Tests (F24 + F25)', () => {
  let built: BuiltLandingResult;

  before(async () => {
    built = await buildLandingToTemp();
  });

  after(() => {
    built?.cleanup();
  });

  it('F24-T3-01: Language (pt-BR, en-US) x Section Accuracy, Flags, Links & Legal Pairwise', async () => {
    const emojiRegex = /[\u{1F1E6}-\u{1F1FF}]/u;
    const matrix: Array<{ lang: 'pt-BR' | 'en-US'; legalPrivacyHash: string; legalTermsHash: string; expectedNavLabel: RegExp }> = [
      { lang: 'pt-BR', legalPrivacyHash: '#/privacidade', legalTermsHash: '#/termos', expectedNavLabel: /Principal/i },
      { lang: 'en-US', legalPrivacyHash: '#/privacy', legalTermsHash: '#/terms', expectedNavLabel: /Primary|Main/i },
    ];

    for (const row of matrix) {
      const html = await renderLandingSsr({ storedLang: row.lang });
      assert.equal(emojiRegex.test(html), false, `${row.lang}: emoji flags forbidden`);
      assert.equal(/\bSignalR\b/i.test(html), false, `${row.lang}: SignalR claim forbidden`);
      assert.equal(/\bH\.?264\b/i.test(html), false, `${row.lang}: H.264 claim forbidden`);
      assert.equal(
        html.includes('/blob/release/CONFIGURATION.md'),
        false,
        `${row.lang}: broken /blob/release/CONFIGURATION.md link forbidden`,
      );
      assert.ok(
        html.includes('/blob/release/docs/CONFIGURATION.md'),
        `${row.lang}: must link to /blob/release/docs/CONFIGURATION.md`,
      );

      const navAttrs = extractHtmlAttributes(html, 'nav')[0];
      assert.ok(navAttrs?.['aria-label'], `${row.lang}: <nav> must have aria-label`);
      assert.match(navAttrs['aria-label'], row.expectedNavLabel, `${row.lang}: <nav aria-label> mismatch`);

      const privacyHtml = await renderLandingSsr({ storedLang: row.lang, hash: row.legalPrivacyHash });
      const termsHtml = await renderLandingSsr({ storedLang: row.lang, hash: row.legalTermsHash });
      assert.match(privacyHtml, /LGPD/i, `${row.lang}: privacy route must render LGPD section`);
      assert.match(termsHtml, /MIT/i, `${row.lang}: terms route must mention MIT license`);
    }
  });

  it('F24-T3-02: Prod Build (vite build) x Subpath HTTP Serving (/DiscoveryRMM/) x SEO/Asset Contract', async () => {
    const srv = await serveSubpath(built.outDir, '/DiscoveryRMM/');
    try {
      const robotsRes = await fetch(`${srv.baseUrl}robots.txt`);
      assert.equal(robotsRes.status, 200, 'GET /DiscoveryRMM/robots.txt must return 200');
      const robotsText = await robotsRes.text();
      const sitemapLine = robotsText.match(/Sitemap:\s*(\S+)/i);
      assert.ok(sitemapLine, 'robots.txt must declare Sitemap URL');
      assert.ok(sitemapLine[1].endsWith('/DiscoveryRMM/sitemap.xml'));

      const sitemapRes = await fetch(`${srv.baseUrl}sitemap.xml`);
      assert.equal(sitemapRes.status, 200, 'GET /DiscoveryRMM/sitemap.xml must return 200');
      const sitemapText = await sitemapRes.text();
      assert.match(sitemapText, /https:\/\/pedrostefanogv\.github\.io\/DiscoveryRMM\//);

      const indexRes = await fetch(srv.baseUrl);
      assert.equal(indexRes.status, 200, 'GET /DiscoveryRMM/ must return 200');
      const indexHtml = await indexRes.text();

      const jsonLdMatch = indexHtml.match(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
      assert.ok(jsonLdMatch, 'index.html must include JSON-LD');
      const parsedLd = JSON.parse(jsonLdMatch[1]) as { '@context'?: string; url?: string };
      assert.equal(parsedLd['@context'], 'https://schema.org');

      const ogMatch = indexHtml.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/);
      assert.ok(ogMatch, 'index.html must include og:image');
      const ogRel = ogMatch[1].replace('https://pedrostefanogv.github.io/DiscoveryRMM/', '');
      const ogRes = await fetch(`${srv.baseUrl}${ogRel}`);
      assert.equal(ogRes.status, 200, `og:image ${ogRel} must return HTTP 200`);
      const dims = readPngDimensions(path.join(built.outDir, ogRel));
      assert.deepEqual(dims, { width: 1200, height: 630 });

      for (const ref of indexHtml.matchAll(/(?:src|href)="(\/DiscoveryRMM\/[^"]+)"/g)) {
        const res = await fetch(`${srv.origin}${ref[1]}`);
        assert.equal(res.status, 200, `Asset ${ref[1]} must return 200`);
      }
    } finally {
      await srv.close();
    }
  });

  it('F24-T3-03: TypeScript Strictness (noUnusedLocals) x CSS/Asset Hygiene x PR CI', () => {
    const tsconfig = JSON.parse(readText(path.join(LANDING_ROOT, 'tsconfig.json'))) as {
      compilerOptions?: { noUnusedLocals?: boolean; strict?: boolean };
    };
    assert.equal(tsconfig.compilerOptions?.strict, true);
    assert.equal(tsconfig.compilerOptions?.noUnusedLocals, true);

    const tscRes = runTscCheck();
    assert.equal(tscRes.status, 0, `Strict tsc --noEmit failed:\n${tscRes.output}`);

    const quickstartCss = readText(path.join(LANDING_ROOT, 'src', 'components', 'Quickstart', 'Quickstart.css'));
    const quickstartTsx = readText(path.join(LANDING_ROOT, 'src', 'components', 'Quickstart', 'Quickstart.tsx'));
    const cssClasses = new Set(
      [...quickstartCss.matchAll(/\.(quickstart__[a-z0-9-]+(?:--[a-z0-9-]+)?)/gi)].map((m) => m[1]),
    );
    const dead = [...cssClasses].filter((c) => !quickstartTsx.includes(c));
    assert.deepEqual(dead, [], `Dead CSS selectors remain in Quickstart.css: ${dead.join(', ')}`);

    assert.equal(fileExists(path.join(LANDING_ROOT, 'appicon.png')), false, 'Orphaned appicon.png must be removed');

    const workflows = walkFiles(path.join(LANDING_ROOT, '.github', 'workflows'), ['.yml', '.yaml']).map((f) =>
      readText(f),
    );
    assert.ok(
      workflows.some((w) => /\bpull_request\b/.test(w)),
      'Landing repo must have a pull_request CI workflow',
    );
  });

  it('F25-T3-01: Pairwise Contract Conformance Matrix (5 Channels x 3 Repos: API, Agent, Site)', () => {
    const apiInfra = [
      readProdFilesNoComments(path.join(API_ROOT, 'src', 'Discovery.Core', 'Helpers'), ['.cs'], 'cs'),
      readProdFilesNoComments(path.join(API_ROOT, 'src', 'Discovery.Api', 'Services'), ['.cs'], 'cs'),
      readProdFilesNoComments(path.join(API_ROOT, 'src', 'Discovery.Api', 'Cqrs'), ['.cs'], 'cs'),
      readProdFilesNoComments(path.join(API_ROOT, 'src', 'Discovery.Infrastructure'), ['.cs'], 'cs'),
    ].join('\n');
    const apiControllers = readProdFilesNoComments(
      path.join(API_ROOT, 'src', 'Discovery.Api', 'Controllers'),
      ['.cs'],
      'cs',
    );
    const agentSrc = readProdFilesNoComments(path.join(AGENT_ROOT, 'src', 'app'), ['.go'], 'go');
    const agentConnSrc = readProdFilesNoComments(
      path.join(AGENT_ROOT, 'src', 'app', 'core', 'agentconn'),
      ['.go'],
      'go',
    );
    const agentFilesAndSessionSrc = [
      readProdFilesNoComments(path.join(AGENT_ROOT, 'src', 'app', 'core', 'fileserver'), ['.go'], 'go'),
      readProdFilesNoComments(path.join(AGENT_ROOT, 'src', 'app', 'core', 'remotesession'), ['.go'], 'go'),
    ].join('\n');

    const siteSrc = readProdFilesNoComments(path.join(SITE_ROOT, 'src'), ['.ts', '.tsx'], 'ts');
    const siteProxySrc = readProdFilesNoComments(
      path.join(SITE_ROOT, 'src', 'modules', 'remote-proxy'),
      ['.ts', '.tsx'],
      'ts',
    );
    const siteRdpSrc = readProdFilesNoComments(
      path.join(SITE_ROOT, 'src', 'modules', 'remote-rdp'),
      ['.ts', '.tsx'],
      'ts',
    );
    const siteFilesSrc = readProdFilesNoComments(
      path.join(SITE_ROOT, 'src', 'modules', 'remote-files'),
      ['.ts', '.tsx'],
      'ts',
    );

    const channelPairs: Array<{ channel: string; apiOk: boolean; agentOk: boolean; siteOk: boolean }> = [
      {
        channel: 'Fanout (Tenant-Scoped JetStream)',
        apiOk:
          !apiInfra.includes('$JS.API.CONSUMER.*.DISCOVERY_FANOUT_COMMANDS.>') &&
          ((/DISCOVERY_FANOUT_COMMANDS_\{/.test(apiInfra) && /TenantFanoutStreamName/.test(apiInfra)) ||
            /\$JS\.API\.CONSUMER\.CREATE\.DISCOVERY_FANOUT_COMMANDS\./.test(apiInfra)),
        agentOk:
          !/BindStream\(\s*[^,]+,\s*"DISCOVERY_FANOUT_COMMANDS"\s*\)/.test(agentConnSrc) &&
          hasTenantFanoutBinding(agentConnSrc),
        siteOk: true, // Admin fanout triggers via REST -> API -> NATS
      },
      {
        channel: 'SupportChat (Tenant-Scoped)',
        apiOk:
          !apiInfra.includes('$JS.API.CONSUMER.*.DISCOVERY_SUPPORT_CHAT.>') &&
          (/TenantSupportChatStreamName/.test(apiInfra) || /DISCOVERY_SUPPORT_CHAT_\{/.test(apiInfra)),
        agentOk: hasNatsSubjectSuffix(agentSrc, 'supportchat.server'),
        siteOk: /supportchat|SupportChat/i.test(siteSrc),
      },
      {
        channel: 'ProxyHTTP (.proxy.req/.resp/.ready)',
        apiOk:
          /\.proxy\.req/.test(apiInfra) &&
          /\.proxy\.resp/.test(apiInfra) &&
          /\.proxy\.ready/.test(apiInfra) &&
          /NoProxy/.test(apiInfra),
        agentOk:
          hasNatsSubjectSuffix(agentSrc, 'proxy.req') &&
          hasNatsSubjectSuffix(agentSrc, 'proxy.resp') &&
          hasNatsSubjectSuffix(agentSrc, 'proxy.ready') &&
          /netproxy/.test(agentSrc),
        siteOk:
          hasNatsSubjectSuffix(siteProxySrc, 'proxy.req') &&
          !/<iframe[^>]+src=\{proxyUrl\}/.test(siteProxySrc),
      },
      {
        channel: 'TunnelTCPRDP (.tunnel.in/.out + /rdp-file + /tunnel/ws)',
        apiOk:
          /\.tunnel\.in/.test(apiInfra) &&
          /\.tunnel\.out/.test(apiInfra) &&
          /rdp-file/.test(apiControllers) &&
          /tunnel\/ws/.test(apiControllers),
        agentOk:
          hasNatsSubjectSuffix(agentSrc, 'tunnel.in') &&
          hasNatsSubjectSuffix(agentSrc, 'tunnel.out') &&
          /AllowRDPEndpoint/.test(agentSrc),
        siteOk:
          (siteRdpSrc.length > 0 || /RemoteRdp|remote-rdp/i.test(siteSrc)) &&
          (hasNatsSubjectSuffix(siteSrc, 'tunnel.in') ||
            hasNatsSubjectSuffix(siteSrc, 'tunnel.out') ||
            /tunnel\/ws/.test(siteSrc)) &&
          /['"]rdp['"]/.test(siteSrc),
      },
      {
        channel: 'FilesBinaryDF (0x44 0x46 + ACL)',
        apiOk: /\.files\.req/.test(apiInfra) && /\.files\.resp/.test(apiInfra),
        agentOk: hasBinaryDfMagic(agentFilesAndSessionSrc),
        siteOk: hasBinaryDfMagic(siteFilesSrc),
      },
    ];

    const failures: string[] = [];
    for (const pair of channelPairs) {
      if (!pair.apiOk) failures.push(`${pair.channel} x API`);
      if (!pair.agentOk) failures.push(`${pair.channel} x Agent`);
      if (!pair.siteOk) failures.push(`${pair.channel} x Site`);
    }

    assert.deepEqual(
      failures,
      [],
      `Pairwise Contract Conformance Matrix failures: ${failures.join('; ')}`,
    );
  });

  it('F25-T3-02: Pairwise Documentation Set x Live Toolchain & CI Matrix', () => {
    const mapeamento = readText(path.join(WORKSPACE_ROOT, 'MAPEAMENTO_PROJETO.md'));
    const apiReadme = readText(path.join(API_ROOT, 'README.md'));
    const agentReadme = readText(path.join(AGENT_ROOT, 'README.md'));
    const siteReadme = readText(path.join(SITE_ROOT, 'README.md'));
    const landingReadme = readText(path.join(LANDING_ROOT, 'README.md'));

    const allDocs = [
      ['MAPEAMENTO_PROJETO.md', mapeamento],
      ['DiscoveryRMM_API/README.md', apiReadme],
      ['Discovery/README.md', agentReadme],
      ['DiscoveryRMM_Site/README.md', siteReadme],
      ['DiscoveryRMM/README.md', landingReadme],
    ] as const;

    for (const [name, content] of allDocs) {
      assert.equal(/https:\/\/localhost:7001/.test(content), false, `${name}: stale :7001 port`);
      assert.equal(/\/blob\/release\/CONFIGURATION\.md\b/.test(content), false, `${name}: broken CONFIGURATION.md link`);
    }

    // Check PR CI workflows exist in all 4 repos
    for (const [repoName, repoPath] of [
      ['DiscoveryRMM_API', API_ROOT],
      ['Discovery', AGENT_ROOT],
      ['DiscoveryRMM_Site', SITE_ROOT],
      ['DiscoveryRMM', LANDING_ROOT],
    ] as const) {
      const wfContents = walkFiles(path.join(repoPath, '.github', 'workflows'), ['.yml', '.yaml']).map((f) =>
        readText(f),
      );
      assert.ok(
        wfContents.some((w) => /\bpull_request\b/.test(w)),
        `${repoName}: missing pull_request CI workflow`,
      );
    }

    // Verify ground-truth versions in Site & Landing package.json match docs
    const sitePkg = JSON.parse(readText(path.join(SITE_ROOT, 'package.json'))) as {
      devDependencies?: Record<string, string>;
    };
    assert.match(sitePkg.devDependencies?.typescript ?? '', /\^?7\./);
    assert.match(sitePkg.devDependencies?.vite ?? '', /\^?8\./);
    assert.match(siteReadme, /TypeScript 7/i);
    assert.match(siteReadme, /Vite 8/i);
  });
});
