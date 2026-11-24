import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';
import {
  API_ROOT,
  LANDING_ROOT,
  buildLandingToTemp,
  contrastRatio,
  extractCssRootVars,
  extractHtmlAttributes,
  fileExists,
  gitLsTree,
  readPngDimensions,
  readText,
  renderLandingSsr,
  runTscCheck,
  walkFiles,
  type BuiltLandingResult,
} from './helpers.ts';

function parseMinSemver(range: string): [number, number, number] {
  const match = range.match(/(\d+)\.(\d+)\.(\d+)/);
  assert.ok(match, `Expected semver version in "${range}"`);
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function isVersionAtLeast(actual: string, min: [number, number, number]): boolean {
  const [aMaj, aMin, aPatch] = parseMinSemver(actual);
  if (aMaj !== min[0]) return aMaj > min[0];
  if (aMin !== min[1]) return aMin > min[1];
  return aPatch >= min[2];
}

function isSemverCompatibleWithRange(resolvedVersion: string, range: string): boolean {
  const trimmed = range.trim();
  const [resMaj, resMin, resPatch] = parseMinSemver(resolvedVersion);
  const [minMaj, minMin, minPatch] = parseMinSemver(trimmed);

  if (!isVersionAtLeast(resolvedVersion, [minMaj, minMin, minPatch])) {
    return false;
  }
  if (trimmed.startsWith('^')) {
    if (minMaj > 0) return resMaj === minMaj;
    if (minMin > 0) return resMaj === 0 && resMin === minMin;
    return resMaj === 0 && resMin === 0 && resPatch === minPatch;
  }
  if (trimmed.startsWith('~')) {
    return resMaj === minMaj && resMin === minMin;
  }
  if (trimmed.startsWith('>=')) {
    return true;
  }
  return resMaj === minMaj && resMin === minMin && resPatch === minPatch;
}

describe('F24 Tier 1 — Landing Page Category-Partition Tests', () => {
  let built: BuiltLandingResult;

  before(async () => {
    built = await buildLandingToTemp();
  });

  after(() => {
    built?.cleanup();
  });

  it('F24-T1-01: Dual-language SSR structure parity (pt-BR & en-US)', async () => {
    const htmlPt = await renderLandingSsr({ storedLang: 'pt-BR' });
    const htmlEn = await renderLandingSsr({ storedLang: 'en-US' });

    for (const [label, html] of [
      ['pt-BR', htmlPt],
      ['en-US', htmlEn],
    ] as const) {
      assert.match(html, /<nav\b/, `${label}: missing <nav>`);
      assert.match(html, /<main>/, `${label}: missing <main>`);
      assert.match(html, /<footer\b/, `${label}: missing <footer>`);

      for (const sectionId of ['features', 'architecture', 'quickstart', 'how-it-works', 'cta']) {
        assert.match(html, new RegExp(`id="${sectionId}"`), `${label}: missing section #${sectionId}`);
      }

      const featureCards = html.match(/class="features__card"/g) ?? [];
      assert.equal(featureCards.length, 12, `${label}: expected 12 feature cards`);

      const archCards = html.match(/class="architecture__card"/g) ?? [];
      assert.equal(archCards.length, 4, `${label}: expected 4 architecture cards`);

      const archChannels = html.match(/class="architecture__channel"/g) ?? [];
      assert.equal(archChannels.length, 4, `${label}: expected 4 release channels`);

      const howSteps = html.match(/class="how__step-card"/g) ?? [];
      assert.equal(howSteps.length, 4, `${label}: expected 4 how-it-works steps`);

      const statsCards = html.match(/class="stats__item"/g) ?? [];
      assert.equal(statsCards.length, 4, `${label}: expected 4 stats items`);

      assert.equal(html.includes('undefined'), false, `${label}: contains literal "undefined"`);
      assert.equal(html.includes('NaN'), false, `${label}: contains literal "NaN"`);
      assert.equal(html.includes('[object Object]'), false, `${label}: contains "[object Object]"`);
    }

    assert.ok(htmlPt.includes('Comece Agora'), 'pt-BR should render "Comece Agora"');
    assert.ok(htmlEn.includes('Get Started'), 'en-US should render "Get Started"');
  });

  it('F24-T1-02: Navbar navbar--scrolled & mobile menu inert/a11y/focus', async () => {
    const navbarCss = readText(path.join(LANDING_ROOT, 'src', 'components', 'Navbar', 'Navbar.css'));
    const navbarTsx = readText(path.join(LANDING_ROOT, 'src', 'components', 'Navbar', 'Navbar.tsx'));
    const htmlEn = await renderLandingSsr({ storedLang: 'en-US' });

    assert.match(navbarCss, /\.navbar--scrolled\b/, 'Navbar.css must define .navbar--scrolled');
    assert.match(
      navbarTsx,
      /<nav[^>]*className=\{[^}]*navbar--scrolled/,
      'Navbar.tsx must conditionally bind navbar--scrolled to <nav className={...}>',
    );
    assert.match(
      built.builtJs,
      /navbar--scrolled/,
      'Built JS bundle must contain navbar--scrolled',
    );

    assert.match(
      navbarTsx,
      /inert=\{[^}]*\}|focusTrap|Tab/,
      'Navbar.tsx must apply inert to closed mobile menu or implement focus-trap handling',
    );

    const navMatches = extractHtmlAttributes(htmlEn, 'nav');
    assert.ok(navMatches.length >= 1, 'Expected <nav> element in en-US SSR output');
    assert.notEqual(
      navMatches[0]['aria-label'],
      'Principal',
      'en-US <nav aria-label> must be localized rather than hardcoded "Principal"',
    );
  });

  it('F24-T1-03: External documentation & repository links (zero 404 targets)', async () => {
    const htmlPt = await renderLandingSsr({ storedLang: 'pt-BR' });
    const htmlEn = await renderLandingSsr({ storedLang: 'en-US' });
    const readme = readText(path.join(LANDING_ROOT, 'README.md'));
    const srcFiles = walkFiles(path.join(LANDING_ROOT, 'src'), ['.ts', '.tsx']).map((f) => readText(f));
    const corpus = [htmlPt, htmlEn, readme, ...srcFiles].join('\n');

    const extractedUrls = (corpus.match(/https:\/\/[^\s"'<>`)]+/g) ?? []).flatMap((raw) => {
      try {
        return [new URL(raw)];
      } catch {
        return [];
      }
    });

    assert.equal(
      extractedUrls.some(
        (u) =>
          u.protocol === 'https:' &&
          u.hostname === 'github.com' &&
          u.pathname === '/pedrostefanogv/DiscoveryRMM_API/blob/release/CONFIGURATION.md',
      ),
      false,
      'Found broken 404 link /blob/release/CONFIGURATION.md (must be /blob/release/docs/CONFIGURATION.md)',
    );
    assert.ok(
      extractedUrls.some(
        (u) =>
          u.protocol === 'https:' &&
          u.hostname === 'github.com' &&
          u.pathname === '/pedrostefanogv/DiscoveryRMM_API/blob/release/docs/CONFIGURATION.md',
      ),
      'Expected documentation link to target /blob/release/docs/CONFIGURATION.md',
    );
    assert.ok(
      extractedUrls.some(
        (u) =>
          u.protocol === 'https:' &&
          u.hostname === 'github.com' &&
          u.pathname === '/pedrostefanogv/DiscoveryRMM_Agent/releases',
      ),
      'Expected agent download link to target DiscoveryRMM_Agent/releases',
    );

    if (fileExists(API_ROOT)) {
      const releaseTree = gitLsTree(API_ROOT, 'origin/release');
      assert.ok(
        releaseTree.includes('docs/CONFIGURATION.md'),
        'Offline git check: DiscoveryRMM_API origin/release must contain docs/CONFIGURATION.md',
      );
      assert.ok(
        fileExists(path.join(API_ROOT, 'scripts', 'linux', 'bootstrap_install_discovery.sh')),
        'Offline check: DiscoveryRMM_API must contain scripts/linux/bootstrap_install_discovery.sh',
      );
    }
  });

  it('F24-T1-04: SVG language flags (no emoji flags)', async () => {
    const htmlPt = await renderLandingSsr({ storedLang: 'pt-BR' });
    const htmlEn = await renderLandingSsr({ storedLang: 'en-US' });
    const i18nSrc = readText(path.join(LANDING_ROOT, 'src', 'i18n.tsx'));
    const emojiRegex = /[\u{1F1E6}-\u{1F1FF}]/u;

    assert.equal(emojiRegex.test(i18nSrc), false, 'src/i18n.tsx must not contain regional-indicator emoji flags');

    for (const [label, html] of [
      ['pt-BR', htmlPt],
      ['en-US', htmlEn],
    ] as const) {
      assert.equal(emojiRegex.test(html), false, `${label} SSR HTML must not contain emoji flags`);

      const flagSpans = [...html.matchAll(/<span[^>]*class="navbar__language-flag"[^>]*>([\s\S]*?)<\/span>/g)];
      assert.ok(flagSpans.length >= 2, `${label}: expected .navbar__language-flag spans in SSR HTML`);
      for (const span of flagSpans) {
        assert.match(span[1], /<svg\b/, `${label}: every .navbar__language-flag must render an inline <svg>`);
      }
    }
  });

  it('F24-T1-05: WCAG AA contrast ratio (>= 4.5:1) for --text-muted & --text-secondary', () => {
    const vars = extractCssRootVars(built.builtCss);
    const bgPrimary = vars.get('--bg-primary');
    const bgSecondary = vars.get('--bg-secondary');
    const bgCard = vars.get('--bg-card');
    const textMuted = vars.get('--text-muted');
    const textSecondary = vars.get('--text-secondary');

    assert.ok(bgPrimary && bgSecondary && bgCard && textMuted && textSecondary, 'Expected theme color CSS variables in built CSS');

    for (const [fgName, fgVal] of [
      ['--text-muted', textMuted],
      ['--text-secondary', textSecondary],
    ] as const) {
      for (const [bgName, bgVal] of [
        ['--bg-primary', bgPrimary],
        ['--bg-secondary', bgSecondary],
        ['--bg-card', bgCard],
      ] as const) {
        const ratio = contrastRatio(fgVal, bgVal);
        assert.ok(
          ratio >= 4.5,
          `WCAG AA violation: ${fgName} (${fgVal}) on ${bgName} (${bgVal}) has contrast ${ratio.toFixed(2)}:1 (< 4.5:1)`,
        );
      }
    }
  });

  it('F24-T1-06: SEO metadata (og:image 1200x630, robots.txt, sitemap.xml, JSON-LD), LICENSE & /DiscoveryRMM/ assets', () => {
    const html = built.builtHtml;
    assert.match(html, /<link[^>]+rel="canonical"[^>]+href="https:\/\/pedrostefanogv\.github\.io\/DiscoveryRMM\/"/);
    for (const hreflang of ['pt-BR', 'en-US', 'x-default']) {
      assert.match(
        html,
        new RegExp(`<link[^>]+rel="alternate"[^>]+hreflang="${hreflang}"[^>]+href="https:\\/\\/pedrostefanogv\\.github\\.io\\/DiscoveryRMM\\/"`),
        `Built index.html must include <link rel="alternate" hreflang="${hreflang}" ...> pointing to canonical URL`,
      );
    }

    const ogImgMatch = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/);
    assert.ok(ogImgMatch, 'Built index.html must contain og:image meta tag');
    const twImgMatch = html.match(/<meta[^>]+name="twitter:image"[^>]+content="([^"]+)"/);
    assert.ok(twImgMatch, 'Built index.html must contain twitter:image meta tag');

    const jsonLdMatch = html.match(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
    assert.ok(jsonLdMatch, 'Built index.html must include <script type="application/ld+json">');
    const jsonLd = JSON.parse(jsonLdMatch[1]) as Record<string, unknown>;
    assert.equal(jsonLd['@context'], 'https://schema.org', 'JSON-LD @context must be https://schema.org');

    const ogRelPath = ogImgMatch[1].replace('https://pedrostefanogv.github.io/DiscoveryRMM/', '');
    const ogDiskPath = path.join(built.outDir, ogRelPath);
    assert.ok(fileExists(ogDiskPath), `og:image target missing in dist/: ${ogRelPath}`);
    const ogDims = readPngDimensions(ogDiskPath);
    assert.deepEqual(ogDims, { width: 1200, height: 630 }, `og:image must be 1200x630, got ${ogDims.width}x${ogDims.height}`);

    const robotsPath = path.join(built.outDir, 'robots.txt');
    assert.ok(fileExists(robotsPath), 'dist/robots.txt must exist');
    const robotsTxt = readText(robotsPath);
    assert.match(robotsTxt, /User-agent:\s*\*/i);
    assert.match(robotsTxt, /Sitemap:\s*https:\/\/pedrostefanogv\.github\.io\/DiscoveryRMM\/sitemap\.xml/i);

    const sitemapPath = path.join(built.outDir, 'sitemap.xml');
    assert.ok(fileExists(sitemapPath), 'dist/sitemap.xml must exist');
    const sitemapXml = readText(sitemapPath);
    assert.match(sitemapXml, /https:\/\/pedrostefanogv\.github\.io\/DiscoveryRMM\//);

    const licensePath = path.join(LANDING_ROOT, 'LICENSE');
    assert.ok(fileExists(licensePath), 'DiscoveryRMM/LICENSE must exist');
    assert.match(readText(licensePath), /\bMIT\b/, 'LICENSE must specify MIT License');

    for (const refMatch of html.matchAll(/(?:src|href)="(\/DiscoveryRMM\/[^"]+)"/g)) {
      const relAsset = refMatch[1].slice('/DiscoveryRMM/'.length);
      assert.ok(
        relAsset === '' || fileExists(path.join(built.outDir, relAsset)),
        `Referenced asset missing from dist/: ${refMatch[1]}`,
      );
    }
  });

  it('F24-T1-07: Legal pages / compliance (Privacy, LGPD, Terms)', async () => {
    const homePt = await renderLandingSsr({ storedLang: 'pt-BR' });
    const homeEn = await renderLandingSsr({ storedLang: 'en-US' });

    assert.match(homePt, /privacidade|privacy/i, 'pt-BR Footer must expose Privacy/LGPD link');
    assert.match(homePt, /termos|terms/i, 'pt-BR Footer must expose Terms link');
    assert.match(homeEn, /privacy/i, 'en-US Footer must expose Privacy link');
    assert.match(homeEn, /terms/i, 'en-US Footer must expose Terms link');

    const privacyPt = await renderLandingSsr({ storedLang: 'pt-BR', hash: '#/privacidade' });
    const termsPt = await renderLandingSsr({ storedLang: 'pt-BR', hash: '#/termos' });
    const privacyEn = await renderLandingSsr({ storedLang: 'en-US', hash: '#/privacy' });
    const termsEn = await renderLandingSsr({ storedLang: 'en-US', hash: '#/terms' });

    assert.match(privacyPt, /LGPD/i, 'pt-BR privacy route must render LGPD legal view');
    assert.match(privacyEn, /LGPD|Privacy Policy/i, 'en-US privacy route must render Privacy/LGPD view');
    assert.match(termsPt, /Termos de Uso/i, 'pt-BR terms route must render Terms of Use view');
    assert.match(termsEn, /Terms of Use/i, 'en-US terms route must render Terms of Use view');
  });

  it('F24-T1-08: Technical copy accuracy (no Linux agent claim, no SignalR, no H.264)', async () => {
    const htmlPt = await renderLandingSsr({ storedLang: 'pt-BR' });
    const htmlEn = await renderLandingSsr({ storedLang: 'en-US' });
    const i18nSrc = readText(path.join(LANDING_ROOT, 'src', 'i18n.tsx'));

    for (const [label, content] of [
      ['pt-BR SSR', htmlPt],
      ['en-US SSR', htmlEn],
      ['src/i18n.tsx', i18nSrc],
    ] as const) {
      assert.equal(/\bSignalR\b/i.test(content), false, `${label}: must not claim SignalR`);
      assert.equal(/\bH\.?264\b/i.test(content), false, `${label}: must not claim H.264`);
    }

    for (const rotMatch of i18nSrc.matchAll(/rotatingItems:\s*\[([^\]]+)\]/g)) {
      assert.equal(
        /['"]Linux['"]/i.test(rotMatch[1]),
        false,
        `hero.rotatingItems must not list Linux as an endpoint agent OS: ${rotMatch[1]}`,
      );
    }
  });

  it('F24-T1-09: Product screenshots presence & usage in <main>', async () => {
    const htmlPt = await renderLandingSsr({ storedLang: 'pt-BR' });
    const mainMatch = htmlPt.match(/<main>([\s\S]*?)<\/main>/);
    assert.ok(mainMatch, 'SSR output must contain <main>');

    const imgsInMain = extractHtmlAttributes(mainMatch[1], 'img');
    assert.ok(imgsInMain.length >= 1, 'Expected at least 1 screenshot <img> inside <main>');

    const screenshotFiles = built.files.filter(
      (f) =>
        /\.(png|jpe?g|webp)$/i.test(f) &&
        f !== 'apple-touch-icon.png' &&
        f !== 'favicon-32x32.png' &&
        f !== 'og-image.png',
    );
    assert.ok(screenshotFiles.length >= 1, 'Expected at least 1 product screenshot asset in dist/');

    for (const img of imgsInMain) {
      assert.ok(img.src && img.src.length > 0, 'Screenshot <img> must have non-empty src');
      assert.ok(img.alt && img.alt.trim().length > 0, 'Screenshot <img> must have descriptive alt text');
    }
  });

  it('F24-T1-10: Dead CSS removal (Quickstart.css), no orphaned appicon.png, noUnusedLocals, PR CI & dep currency', () => {
    const quickstartCss = readText(path.join(LANDING_ROOT, 'src', 'components', 'Quickstart', 'Quickstart.css'));
    const quickstartTsx = readText(path.join(LANDING_ROOT, 'src', 'components', 'Quickstart', 'Quickstart.tsx'));

    const cssClasses = new Set(
      [...quickstartCss.matchAll(/\.(quickstart__[a-z0-9-]+(?:--[a-z0-9-]+)?)/gi)].map((m) => m[1]),
    );
    const unusedClasses = [...cssClasses].filter((cls) => !quickstartTsx.includes(cls));
    assert.deepEqual(
      unusedClasses,
      [],
      `Quickstart.css contains unused class selectors: ${unusedClasses.join(', ')}`,
    );

    assert.equal(
      fileExists(path.join(LANDING_ROOT, 'appicon.png')),
      false,
      'Orphaned 1MB DiscoveryRMM/appicon.png must not remain at repo root',
    );

    const tsconfig = JSON.parse(readText(path.join(LANDING_ROOT, 'tsconfig.json'))) as {
      compilerOptions?: { noUnusedLocals?: boolean };
    };
    assert.equal(tsconfig.compilerOptions?.noUnusedLocals, true, 'tsconfig.json must enable noUnusedLocals: true');

    const tscRes = runTscCheck();
    assert.equal(tscRes.status, 0, `tsc --noEmit failed:\n${tscRes.output}`);

    const workflowsDir = path.join(LANDING_ROOT, '.github', 'workflows');
    const workflowFiles = walkFiles(workflowsDir, ['.yml', '.yaml']).map((f) => readText(f));
    assert.ok(
      workflowFiles.some((wf) => /\bpull_request\b/.test(wf) && /npm\s+run\s+build|vite\s+build|tsc/.test(wf)),
      'Expected a GitHub Actions workflow triggered on pull_request running build/typecheck',
    );
    const ciWorkflow = readText(path.join(workflowsDir, 'ci.yml'));
    assert.match(ciWorkflow, /\bnpm\s+test\b/, '.github/workflows/ci.yml must run npm test');

    const pkg = JSON.parse(readText(path.join(LANDING_ROOT, 'package.json'))) as {
      scripts?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    assert.ok(pkg.scripts?.test && pkg.scripts.test.trim().length > 0, 'package.json must define a "test" script');
    const lock = JSON.parse(readText(path.join(LANDING_ROOT, 'package-lock.json'))) as {
      packages?: Record<string, { version?: string }>;
    };

    const viteRange = pkg.devDependencies?.vite ?? '0.0.0';
    const pluginReactRange = pkg.devDependencies?.['@vitejs/plugin-react'] ?? '0.0.0';
    const lockedVite = lock.packages?.['node_modules/vite']?.version ?? '0.0.0';
    const lockedPluginReact = lock.packages?.['node_modules/@vitejs/plugin-react']?.version ?? '0.0.0';

    assert.ok(
      isVersionAtLeast(lockedVite, [8, 3, 8]),
      `package-lock.json node_modules/vite must be >= 8.3.8, found ${lockedVite}`,
    );
    assert.ok(
      isVersionAtLeast(lockedPluginReact, [6, 3, 0]),
      `package-lock.json node_modules/@vitejs/plugin-react must be >= 6.3.0, found ${lockedPluginReact}`,
    );
    assert.ok(
      isSemverCompatibleWithRange(lockedVite, viteRange),
      `package.json vite range (${viteRange}) must be semver-compatible with locked version ${lockedVite}`,
    );
    assert.ok(
      isSemverCompatibleWithRange(lockedPluginReact, pluginReactRange),
      `package.json @vitejs/plugin-react range (${pluginReactRange}) must be semver-compatible with locked version ${lockedPluginReact}`,
    );

    const installedVitePkgPath = path.join(LANDING_ROOT, 'node_modules', 'vite', 'package.json');
    if (fileExists(installedVitePkgPath)) {
      const installedVite = (JSON.parse(readText(installedVitePkgPath)) as { version?: string }).version ?? '0.0.0';
      assert.ok(
        isVersionAtLeast(installedVite, [8, 3, 8]),
        `Installed node_modules/vite must be >= 8.3.8, found ${installedVite}`,
      );
    }
  });
});
