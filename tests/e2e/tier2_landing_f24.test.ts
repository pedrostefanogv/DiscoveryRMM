import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';
import {
  API_ROOT,
  LANDING_ROOT,
  buildLandingToTemp,
  contrastRatio,
  extractAllIds,
  extractCssRootVars,
  extractHtmlAttributes,
  fileExists,
  readPngDimensions,
  readText,
  renderLandingSsr,
  serveSubpath,
  walkFiles,
  type BuiltLandingResult,
} from './helpers.ts';

describe('F24 Tier 2 — Landing Page Boundary Value Analysis Tests', () => {
  let built: BuiltLandingResult;

  before(async () => {
    built = await buildLandingToTemp();
  });

  after(() => {
    built?.cleanup();
  });

  it('F24-T2-01: I18nProvider language selection & error fallback boundaries', async () => {
    const enByStored = await renderLandingSsr({ storedLang: 'en-US' });
    assert.ok(enByStored.includes('Get Started'), 'storedLang=en-US must select English');

    const enByNav = await renderLandingSsr({ storedLang: null, navigatorLanguages: ['en-GB'] });
    assert.ok(enByNav.includes('Get Started'), 'navigator en-GB must resolve to English');

    const ptByInvalidStored = await renderLandingSsr({
      storedLang: 'fr-FR',
      navigatorLanguages: ['fr-FR'],
    });
    assert.ok(ptByInvalidStored.includes('Comece Agora'), 'Unsupported language fr-FR must fall back to pt-BR');

    const ptByThrow = await renderLandingSsr({
      throwStorage: true,
      navigatorLanguages: ['es-ES'],
    });
    assert.ok(ptByThrow.includes('Comece Agora'), 'Throwing localStorage must gracefully fall back to pt-BR');
  });

  it('F24-T2-02: WCAG AA strict 4.50:1 boundary across dark surfaces incl. #0d1117 terminal', () => {
    const vars = extractCssRootVars(built.builtCss);
    const bgPrimary = vars.get('--bg-primary')!;
    const bgSecondary = vars.get('--bg-secondary')!;
    const bgCard = vars.get('--bg-card')!;
    const textMuted = vars.get('--text-muted')!;

    assert.ok(bgPrimary && bgSecondary && bgCard && textMuted, 'Expected root color tokens');

    for (const [surfaceName, surfaceHex] of [
      ['--bg-primary', bgPrimary],
      ['--bg-secondary', bgSecondary],
      ['--bg-card', bgCard],
      ['#0d1117 (terminal)', '#0d1117'],
    ] as const) {
      const ratio = contrastRatio(textMuted, surfaceHex);
      assert.ok(
        ratio >= 4.5,
        `Strict 4.50:1 boundary failed: --text-muted (${textMuted}) on ${surfaceName} (${surfaceHex}) = ${ratio.toFixed(4)}:1`,
      );
    }

    const componentCss = walkFiles(path.join(LANDING_ROOT, 'src', 'components'), ['.css'])
      .map((f) => `${path.basename(f)}:\n${readText(f)}`)
      .join('\n');
    assert.equal(componentCss.includes('#64748b'), false, 'Legacy low-contrast #64748b must not remain in component CSS');
    assert.equal(componentCss.includes('#546e7a'), false, 'Legacy low-contrast #546e7a must not remain in component CSS');
  });

  it('F24-T2-03: og:image exact dimensions boundary (1200x630, aspect 1.90:1, valid size)', () => {
    const ogMeta = built.builtHtml.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/);
    assert.ok(ogMeta, 'og:image meta tag required');
    const relPath = ogMeta[1].replace('https://pedrostefanogv.github.io/DiscoveryRMM/', '');
    const ogPath = path.join(built.outDir, relPath);
    assert.ok(fileExists(ogPath), `og:image missing at ${ogPath}`);

    const stats = fs.statSync(ogPath);
    assert.ok(stats.size > 1024 && stats.size <= 5_000_000, `Unexpected og:image byte size: ${stats.size}`);

    const dims = readPngDimensions(ogPath);
    assert.equal(dims.width, 1200, `Expected og:image width 1200, got ${dims.width}`);
    assert.equal(dims.height, 630, `Expected og:image height 630, got ${dims.height}`);
    const aspect = dims.width / dims.height;
    assert.ok(aspect >= 1.89 && aspect <= 1.92, `Unexpected aspect ratio ${aspect.toFixed(3)}`);
  });

  it('F24-T2-04: base /DiscoveryRMM/ HTTP serving boundary (200 valid assets vs 404 missing)', async () => {
    const srv = await serveSubpath(built.outDir, '/DiscoveryRMM/');
    try {
      const rootRes = await fetch(srv.baseUrl);
      assert.equal(rootRes.status, 200, 'GET /DiscoveryRMM/ must return 200');
      const html = await rootRes.text();

      const assetUrls = new Set<string>();
      for (const match of html.matchAll(/(?:src|href)="(\/DiscoveryRMM\/[^"]+)"/g)) {
        assetUrls.add(match[1]);
      }
      for (const match of html.matchAll(/(?:src|href)="\.\/([^"]+)"/g)) {
        assetUrls.add(`/DiscoveryRMM/${match[1]}`);
      }
      assetUrls.add('/DiscoveryRMM/robots.txt');
      assetUrls.add('/DiscoveryRMM/sitemap.xml');
      assetUrls.add('/DiscoveryRMM/og-image.png');

      assert.ok(assetUrls.size >= 5, `Expected >= 5 /DiscoveryRMM/ assets in built HTML, got ${assetUrls.size}`);

      for (const assetPath of assetUrls) {
        const res = await fetch(`${srv.origin}${assetPath}`);
        assert.equal(res.status, 200, `Expected 200 for ${assetPath}, got ${res.status}`);
        const buf = await res.arrayBuffer();
        assert.ok(buf.byteLength > 0, `Asset ${assetPath} must be non-empty`);
      }

      const missingRes = await fetch(`${srv.baseUrl}__nonexistent__.png`);
      assert.equal(missingRes.status, 404, 'Missing asset under /DiscoveryRMM/ must return 404');

      const unprefixedRes = await fetch(`${srv.origin}/index.html`);
      assert.equal(unprefixedRes.status, 404, 'Unprefixed /index.html must return 404 when served at /DiscoveryRMM/');
    } finally {
      await srv.close();
    }
  });

  it('F24-T2-05: Link array parity & external rel="noopener noreferrer" boundary', async () => {
    for (const lang of ['pt-BR', 'en-US'] as const) {
      const html = await renderLandingSsr({ storedLang: lang });
      const anchors = extractHtmlAttributes(html, 'a');
      assert.ok(anchors.length >= 10, `${lang}: expected >= 10 rendered anchors`);

      for (const anchor of anchors) {
        assert.ok(anchor.href && anchor.href.trim().length > 0, `${lang}: anchor missing href`);
        assert.notEqual(anchor.href, '#', `${lang}: placeholder href="#" is not allowed`);
        assert.equal(anchor.href.includes('undefined'), false, `${lang}: anchor href contains undefined: ${anchor.href}`);

        if (anchor.target === '_blank') {
          const relTokens = new Set((anchor.rel ?? '').split(/\s+/).filter(Boolean));
          assert.ok(
            relTokens.has('noopener') && relTokens.has('noreferrer'),
            `${lang}: external link ${anchor.href} must include rel="noopener noreferrer" (got "${anchor.rel ?? ''}")`,
          );
        }
      }
    }
  });

  it('F24-T2-06: Internal #anchor target uniqueness & resolution boundary', async () => {
    for (const lang of ['pt-BR', 'en-US'] as const) {
      const html = await renderLandingSsr({ storedLang: lang });
      const ids = extractAllIds(html);
      const idCounts = new Map<string, number>();
      for (const id of ids) {
        idCounts.set(id, (idCounts.get(id) ?? 0) + 1);
      }

      for (const [id, count] of idCounts) {
        assert.equal(count, 1, `${lang}: duplicate id="${id}" found (${count} times)`);
      }

      const anchors = extractHtmlAttributes(html, 'a');
      for (const anchor of anchors) {
        const href = anchor.href ?? '';
        if (href.startsWith('#') && !href.startsWith('#/')) {
          const targetId = href.slice(1);
          assert.ok(
            idCounts.has(targetId),
            `${lang}: internal anchor href="${href}" has no matching id="${targetId}"`,
          );
        }
      }
    }
  });

  it('F24-T2-07: Features visual array bounds, title uniqueness & bootstrap script path boundary', async () => {
    for (const lang of ['pt-BR', 'en-US'] as const) {
      const html = await renderLandingSsr({ storedLang: lang });
      const titles = [...html.matchAll(/<h3 class="features__card-title">([^<]+)<\/h3>/g)].map((m) =>
        m[1].trim(),
      );
      assert.equal(titles.length, 12, `${lang}: expected 12 feature titles`);
      assert.equal(new Set(titles).size, 12, `${lang}: feature titles must all be unique`);
    }

    const i18nSrc = readText(path.join(LANDING_ROOT, 'src', 'i18n.tsx'));
    const bootstrapMatch = i18nSrc.match(
      /https:\/\/raw\.githubusercontent\.com\/pedrostefanogv\/DiscoveryRMM_API\/[^/]+\/([^\s"')]+)/,
    );
    assert.ok(bootstrapMatch, 'Expected LINUX_BOOTSTRAP_COMMAND raw GitHub script URL in src/i18n.tsx');

    if (fileExists(API_ROOT)) {
      assert.ok(
        fileExists(path.join(API_ROOT, bootstrapMatch[1])),
        `Bootstrap script ${bootstrapMatch[1]} missing in DiscoveryRMM_API`,
      );
    }
  });

  it('F24-T2-08: Uncommitted CSS hover-lift removal & prefers-reduced-motion preservation', () => {
    const cssFiles = walkFiles(path.join(LANDING_ROOT, 'src', 'components'), ['.css']);
    assert.ok(cssFiles.length >= 7, 'Expected component CSS files');

    for (const cssFile of cssFiles) {
      const content = readText(cssFile);
      const hoverBlocks = [...content.matchAll(/:hover[^{]*\{([^}]*)\}/g)];
      for (const block of hoverBlocks) {
        assert.equal(
          /translateY\s*\(\s*-/.test(block[1]),
          false,
          `${path.basename(cssFile)}: hover rule must not reintroduce translateY(-...) lift`,
        );
        assert.equal(
          /scale\s*\(\s*1\.08\s*\)/.test(block[1]),
          false,
          `${path.basename(cssFile)}: hover rule must not reintroduce scale(1.08)`,
        );
      }
    }

    const appCss = readText(path.join(LANDING_ROOT, 'src', 'App.css'));
    assert.match(
      appCss,
      /@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)/,
      'App.css must preserve @media (prefers-reduced-motion: reduce)',
    );
  });
});
