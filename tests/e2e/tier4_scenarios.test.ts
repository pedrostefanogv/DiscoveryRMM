import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';
import {
  AGENT_ROOT,
  API_ROOT,
  CANONICAL_WORKSPACE_ENTRIES,
  LANDING_ROOT,
  SITE_ROOT,
  WORKSPACE_ROOT,
  buildLandingToTemp,
  contrastRatio,
  extractCssRootVars,
  extractHtmlAttributes,
  extractMarkdownRelativeLinks,
  fileExists,
  findFilesByBasename,
  hasBinaryDfMagic,
  hasNatsSubjectSuffix,
  isTestOrE2EFile,
  readPngDimensions,
  readProdFilesNoComments,
  readText,
  renderLandingSsr,
  runTscCheck,
  serveSubpath,
  stripComments,
  walkFiles,
  type BuiltLandingResult,
} from './helpers.ts';

describe('Tier 4 — Real-World Ecosystem Scenarios (Scenarios 13 & 14)', () => {
  let built: BuiltLandingResult;

  before(async () => {
    built = await buildLandingToTemp();
  });

  after(() => {
    built?.cleanup();
  });

  it('F24-T4-01: Scenario 13a — Unauthenticated Visitor Production Site, A11y, SEO & Legal Journey', async () => {
    const srv = await serveSubpath(built.outDir, '/DiscoveryRMM/');
    try {
      // 1. Visitor loads landing page and crawlers inspect SEO endpoints
      const [indexRes, robotsRes, sitemapRes] = await Promise.all([
        fetch(srv.baseUrl),
        fetch(`${srv.baseUrl}robots.txt`),
        fetch(`${srv.baseUrl}sitemap.xml`),
      ]);
      assert.equal(indexRes.status, 200);
      assert.equal(robotsRes.status, 200);
      assert.equal(sitemapRes.status, 200);

      const indexHtml = await indexRes.text();
      const ogMatch = indexHtml.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/);
      assert.ok(ogMatch, 'og:image required');
      const ogRel = ogMatch[1].replace('https://pedrostefanogv.github.io/DiscoveryRMM/', '');
      const ogRes = await fetch(`${srv.baseUrl}${ogRel}`);
      assert.equal(ogRes.status, 200);
      assert.deepEqual(readPngDimensions(path.join(built.outDir, ogRel)), { width: 1200, height: 630 });

      // 2. Dual-language journey (pt-BR -> en-US) + legal pages
      const htmlPt = await renderLandingSsr({ storedLang: 'pt-BR' });
      const htmlEn = await renderLandingSsr({ storedLang: 'en-US' });
      const htmlPrivacy = await renderLandingSsr({ storedLang: 'pt-BR', hash: '#/privacidade' });
      const htmlTerms = await renderLandingSsr({ storedLang: 'en-US', hash: '#/terms' });

      assert.ok(htmlPt.includes('Comece Agora'));
      assert.ok(htmlEn.includes('Get Started'));
      assert.match(htmlPrivacy, /LGPD/i);
      assert.match(htmlTerms, /MIT/i);

      // 3. No emojis, no SignalR/H.264/broken CONFIGURATION.md, screenshots present and served 200
      const emojiRegex = /[\u{1F1E6}-\u{1F1FF}]/u;
      for (const html of [htmlPt, htmlEn]) {
        assert.equal(emojiRegex.test(html), false, 'Emoji flags must not appear');
        assert.equal(/\bSignalR\b/i.test(html), false, 'SignalR must not appear');
        assert.equal(/\bH\.?264\b/i.test(html), false, 'H.264 must not appear');
        assert.equal(html.includes('/blob/release/CONFIGURATION.md'), false, 'Broken CONFIGURATION.md link');
      }

      const mainMatch = htmlPt.match(/<main>([\s\S]*?)<\/main>/);
      assert.ok(mainMatch);
      const imgs = extractHtmlAttributes(mainMatch[1], 'img');
      assert.ok(imgs.length >= 1, 'Showcase screenshots must render inside <main>');
      for (const img of imgs) {
        const res = await fetch(`${srv.origin}${img.src}`);
        assert.equal(res.status, 200, `Screenshot ${img.src} must return 200`);
      }

      // 4. WCAG AA contrast & Navbar scrolled/a11y wiring
      const vars = extractCssRootVars(built.builtCss);
      assert.ok(contrastRatio(vars.get('--text-muted')!, vars.get('--bg-primary')!) >= 4.5);
      assert.ok(contrastRatio(vars.get('--text-muted')!, vars.get('--bg-card')!) >= 4.5);
      const navbarTsx = readText(path.join(LANDING_ROOT, 'src', 'components', 'Navbar', 'Navbar.tsx'));
      assert.match(navbarTsx, /<nav[^>]*className=\{[^}]*navbar--scrolled/);
      assert.match(navbarTsx, /inert=/);
    } finally {
      await srv.close();
    }
  });

  it('F24-T4-02: Scenario 13b — Landing Page PR CI & Strict Production Release Gate', () => {
    const tsconfig = JSON.parse(readText(path.join(LANDING_ROOT, 'tsconfig.json'))) as {
      compilerOptions?: { noUnusedLocals?: boolean };
    };
    assert.equal(tsconfig.compilerOptions?.noUnusedLocals, true);

    const tscRes = runTscCheck();
    assert.equal(tscRes.status, 0, `tsc --noEmit must exit 0:\n${tscRes.output}`);

    const workflows = walkFiles(path.join(LANDING_ROOT, '.github', 'workflows'), ['.yml', '.yaml']).map((f) =>
      readText(f),
    );
    assert.ok(
      workflows.some((w) => /\bpull_request\b/.test(w) && /npm\s+run\s+build|vite\s+build|tsc/.test(w)),
      'PR CI workflow required',
    );

    assert.ok(fileExists(path.join(LANDING_ROOT, 'LICENSE')), 'MIT LICENSE file required');
    assert.equal(fileExists(path.join(LANDING_ROOT, 'appicon.png')), false, 'Orphaned appicon.png must not exist');

    const quickstartCss = readText(path.join(LANDING_ROOT, 'src', 'components', 'Quickstart', 'Quickstart.css'));
    const quickstartTsx = readText(path.join(LANDING_ROOT, 'src', 'components', 'Quickstart', 'Quickstart.tsx'));
    for (const m of quickstartCss.matchAll(/\.(quickstart__[a-z0-9-]+(?:--[a-z0-9-]+)?)/gi)) {
      assert.ok(quickstartTsx.includes(m[1]), `Unused CSS class in Quickstart.css: .${m[1]}`);
    }
  });

  it('F25-T4-01: Scenario 14a — Full Ecosystem Security, Wire Interop & Realtime Contract Audit', () => {
    // 1. API Ed25519 NATS Auth Callout + per-tenant JetStream isolation + subject authority
    const authCalloutFiles = findFilesByBasename(
      path.join(API_ROOT, 'src'),
      'NatsAuthCalloutBackgroundService.cs',
    ).filter((f) => !isTestOrE2EFile(f));
    assert.ok(authCalloutFiles.length >= 1, 'Expected NatsAuthCalloutBackgroundService.cs in DiscoveryRMM_API/src');
    const authCalloutCs = authCalloutFiles.map((f) => stripComments(readText(f), 'cs')).join('\n');
    assert.match(
      authCalloutCs,
      /accountKeyPair\.Verify\(|TryValidatePreIssuedNatsJwt[\s\S]*?\.Verify\(/,
      'API Auth Callout must cryptographically verify account Ed25519 JWT signatures',
    );
    assert.match(
      authCalloutCs,
      /serverKeyPair\.Verify\(|ParseAuthRequest[\s\S]*?\.Verify\(/,
      'API Auth Callout must cryptographically verify NATS server Ed25519 request signatures',
    );

    const credsCs = stripComments(
      readText(path.join(API_ROOT, 'src', 'Discovery.Infrastructure', 'Services', 'NatsCredentialsService.cs')),
      'cs',
    );
    const subjectBuilderCs = stripComments(
      readText(path.join(API_ROOT, 'src', 'Discovery.Core', 'Helpers', 'NatsSubjectBuilder.cs')),
      'cs',
    );
    assert.equal(credsCs.includes('$JS.API.CONSUMER.*.DISCOVERY_FANOUT_COMMANDS.>'), false);
    assert.match(credsCs, /TenantFanoutStreamName/);
    assert.match(subjectBuilderCs, /DISCOVERY_FANOUT_COMMANDS_\{/);

    const messagingSrc = [
      subjectBuilderCs,
      readProdFilesNoComments(path.join(API_ROOT, 'src', 'Discovery.Infrastructure', 'Messaging'), ['.cs'], 'cs'),
    ].join('\n');
    assert.match(messagingSrc, /TryParseAgentSubject|ExtractClientId|TryExtractSubjectIdentity|ParseSubjectIdentity/);

    // 2. Agent DPAPI + ACL + IPC redaction (prod files only, comments stripped)
    const agentGo = readProdFilesNoComments(path.join(AGENT_ROOT, 'src'), ['.go'], 'go');
    assert.match(agentGo, /CryptProtectData/);
    assert.match(agentGo, /HardenSecretFileACL/);
    assert.match(agentGo, /hasAuthToken|HasAuthToken/);

    // 3. Site WS URL JWT removal + Proxy/RDP UI + Binary 'DF' alignment (prod files only, comments stripped)
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
    assert.equal(/\?access_token=/.test(siteSrc), false, 'Site must not leak JWT in WS query string');
    assert.ok(
      hasNatsSubjectSuffix(siteProxySrc, 'proxy.req') || hasNatsSubjectSuffix(siteProxySrc, 'tunnel.in'),
      'Site remote-proxy must wire .proxy.req or .tunnel.in',
    );
    assert.ok(
      (siteRdpSrc.length > 0 || /RemoteRdp|remote-rdp/i.test(siteSrc)) &&
        (hasNatsSubjectSuffix(siteSrc, 'tunnel.in') ||
          hasNatsSubjectSuffix(siteSrc, 'tunnel.out') ||
          /tunnel\/ws/.test(siteSrc)),
      'Site must implement remote-rdp UI and tunnel/WS transport',
    );

    // 4. Cross-repo binary framing contract alignment (Agent session_tunnel_codec/fileserver <-> Site codecs)
    const agentFilesAndSessionSrc = [
      readProdFilesNoComments(path.join(AGENT_ROOT, 'src', 'app', 'core', 'fileserver'), ['.go'], 'go'),
      readProdFilesNoComments(path.join(AGENT_ROOT, 'src', 'app', 'core', 'remotesession'), ['.go'], 'go'),
    ].join('\n');
    const siteTunnelSrc = [
      siteProxySrc,
      siteRdpSrc,
      readProdFilesNoComments(path.join(SITE_ROOT, 'src', 'api'), ['.ts', '.tsx'], 'ts'),
      readProdFilesNoComments(path.join(SITE_ROOT, 'src', 'utils'), ['.ts', '.tsx'], 'ts'),
    ].join('\n');

    assert.ok(
      hasBinaryDfMagic(agentFilesAndSessionSrc),
      'Agent fileserver/remotesession must implement binary DF (0x44, 0x46 / 0x4446) header magic',
    );
    assert.ok(
      hasBinaryDfMagic(siteFilesSrc),
      'Site remote-files must implement binary DF (0x44, 0x46 / 0x4446) header magic',
    );
    assert.match(
      agentFilesAndSessionSrc,
      /binary\.BigEndian\.PutUint32\s*\(\s*hdr\[2:6\]/,
      'Agent tunnel codec must encode 4-byte BigEndian streamId at offset 2',
    );
    assert.match(
      siteTunnelSrc,
      /(?:setUint32|getUint32)\s*\(\s*2\b/,
      'Site tunnel client must encode/decode 4-byte BigEndian streamId at offset 2',
    );
  });

  it('F25-T4-02: Scenario 14b — Fresh Contributor Onboarding & Workspace Hygiene Journey', () => {
    // 1. Clean workspace root
    const entries = fs.readdirSync(WORKSPACE_ROOT).sort();
    assert.deepEqual(entries, [...CANONICAL_WORKSPACE_ENTRIES].sort());

    // 2. Ground-truth ports & docs alignment
    const launchSettings = readText(
      path.join(API_ROOT, 'src', 'Discovery.Api', 'Properties', 'launchSettings.json'),
    );
    assert.match(launchSettings, /:5288\b/);

    const mapeamento = readText(path.join(WORKSPACE_ROOT, 'MAPEAMENTO_PROJETO.md'));
    assert.match(mapeamento, /5288/);
    assert.match(mapeamento, /4222/);
    assert.match(mapeamento, /5173/);
    assert.equal(/\/hubs\/agent/.test(mapeamento), false);
    assert.equal(/localhost:7001/.test(mapeamento), false);

    // 3. Every local relative Markdown link across all onboarding docs resolves cleanly
    const onboardingDocs = [
      path.join(WORKSPACE_ROOT, 'MAPEAMENTO_PROJETO.md'),
      path.join(API_ROOT, 'README.md'),
      path.join(AGENT_ROOT, 'README.md'),
      path.join(AGENT_ROOT, 'ARCHITECTURE.md'),
      path.join(SITE_ROOT, 'README.md'),
      path.join(LANDING_ROOT, 'README.md'),
    ];
    for (const docPath of onboardingDocs) {
      const links = extractMarkdownRelativeLinks(readText(docPath));
      const baseDir = path.dirname(docPath);
      for (const link of links) {
        assert.ok(
          fileExists(path.resolve(baseDir, link.target)),
          `Onboarding doc ${path.relative(WORKSPACE_ROOT, docPath)} has broken link ${link.target}`,
        );
      }
    }
  });
});
