import fs from 'node:fs';
import http from 'node:http';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { build, createServer } from 'vite';

function realpathOrResolve(targetPath: string): string {
  const resolved = path.resolve(targetPath);
  try {
    return fs.realpathSync.native(resolved);
  } catch {
    return resolved;
  }
}

export const LANDING_ROOT = realpathOrResolve(path.join(import.meta.dirname, '..', '..'));
export const WORKSPACE_ROOT = realpathOrResolve(path.join(LANDING_ROOT, '..'));
export const API_ROOT = realpathOrResolve(path.join(WORKSPACE_ROOT, 'DiscoveryRMM_API'));
export const AGENT_ROOT = realpathOrResolve(path.join(WORKSPACE_ROOT, 'Discovery'));
export const SITE_ROOT = realpathOrResolve(path.join(WORKSPACE_ROOT, 'DiscoveryRMM_Site'));

export const CANONICAL_WORKSPACE_ENTRIES = [
  'Discovery',
  'DiscoveryRMM',
  'DiscoveryRMM_API',
  'DiscoveryRMM_Site',
  'MAPEAMENTO_PROJETO.md',
] as const;

export type RenderLandingOptions = {
  storedLang?: string | null;
  navigatorLanguages?: string[];
  throwStorage?: boolean;
  hash?: string;
};

export type BuiltLandingResult = {
  outDir: string;
  files: string[];
  builtHtml: string;
  builtCss: string;
  builtJs: string;
  cleanup: () => void;
};

export type StaticServerHandle = {
  port: number;
  origin: string;
  baseUrl: string;
  close: () => Promise<void>;
};

export type PngDimensions = {
  width: number;
  height: number;
};

export type MarkdownLink = {
  label: string;
  target: string;
};

export function readText(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

export function parseJsonc<T = unknown>(jsoncText: string): T {
  const outChars: string[] = [];
  let inString = false;
  let escaped = false;
  let inLineComment = false;
  let inBlockComment = false;
  let lastNonWsWasComma = false;
  let lastCommaIndex = -1;

  for (let i = 0; i < jsoncText.length; i++) {
    const ch = jsoncText[i];
    const next = jsoncText[i + 1];

    if (inLineComment) {
      if (ch === '\n' || ch === '\r') {
        inLineComment = false;
        outChars.push(ch);
      }
      continue;
    }

    if (inBlockComment) {
      if (ch === '*' && next === '/') {
        inBlockComment = false;
        i++;
      }
      continue;
    }

    if (inString) {
      outChars.push(ch);
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
      lastNonWsWasComma = false;
      lastCommaIndex = -1;
      outChars.push(ch);
      continue;
    }

    if (ch === '/' && next === '/') {
      inLineComment = true;
      i++;
      continue;
    }

    if (ch === '/' && next === '*') {
      inBlockComment = true;
      i++;
      continue;
    }

    if (ch === ',') {
      lastCommaIndex = outChars.length;
      lastNonWsWasComma = true;
      outChars.push(ch);
      continue;
    }

    if (ch === '}' || ch === ']') {
      if (lastNonWsWasComma && lastCommaIndex >= 0) {
        outChars[lastCommaIndex] = '';
      }
      lastNonWsWasComma = false;
      lastCommaIndex = -1;
      outChars.push(ch);
      continue;
    }

    if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
      outChars.push(ch);
      continue;
    }

    lastNonWsWasComma = false;
    lastCommaIndex = -1;
    outChars.push(ch);
  }

  return JSON.parse(outChars.join('')) as T;
}

export function findFilesByBasename(dirPath: string, basename: string): string[] {
  return walkFiles(dirPath).filter((f) => path.basename(f) === basename);
}

export function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

export function isTestOrE2EFile(filePath: string): boolean {
  const normalized = filePath.replace(/\//g, path.sep);
  const lower = normalized.toLowerCase();
  return (
    lower.endsWith('_test.go') ||
    lower.includes(`${path.sep}e2e${path.sep}`) ||
    /\.(?:test|spec)\.(?:ts|tsx|js|jsx|mts|cts)$/i.test(lower) ||
    normalized.includes(`${path.sep}Discovery.Tests${path.sep}`) ||
    normalized.includes(`${path.sep}Discovery.IntegrationTests${path.sep}`) ||
    lower.includes(`${path.sep}__tests__${path.sep}`)
  );
}

export function walkFiles(dirPath: string, extensions?: string[]): string[] {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const results: string[] = [];
  const stack: string[] = [dirPath];

  while (stack.length > 0) {
    const current = stack.pop()!;
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      if (
        entry.name === 'node_modules' ||
        entry.name === '.git' ||
        entry.name === 'dist' ||
        entry.name === 'bin' ||
        entry.name === 'obj'
      ) {
        continue;
      }
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.isFile()) {
        if (!extensions || extensions.some((ext) => entry.name.endsWith(ext))) {
          results.push(fullPath);
        }
      }
    }
  }

  return results.sort();
}

export function walkProdFiles(dirPath: string, extensions?: string[]): string[] {
  return walkFiles(dirPath, extensions).filter((f) => !isTestOrE2EFile(f));
}

export function stripComments(source: string, lang: 'cs' | 'go' | 'ts' = 'ts'): string {
  const out: string[] = [];
  let inDouble = false;
  let inSingle = false;
  let inBacktick = false;
  let inVerbatimCs = false;
  let inLineComment = false;
  let inBlockComment = false;
  let escaped = false;

  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    const next = source[i + 1];

    if (inLineComment) {
      if (ch === '\n' || ch === '\r') {
        inLineComment = false;
        out.push(ch);
      }
      continue;
    }

    if (inBlockComment) {
      if (ch === '*' && next === '/') {
        inBlockComment = false;
        out.push(' ');
        i++;
      } else if (ch === '\n' || ch === '\r') {
        out.push(ch);
      }
      continue;
    }

    if (inVerbatimCs) {
      out.push(ch);
      if (ch === '"') {
        if (next === '"') {
          out.push(next);
          i++;
        } else {
          inVerbatimCs = false;
        }
      }
      continue;
    }

    if (inDouble) {
      out.push(ch);
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === '"') {
        inDouble = false;
      }
      continue;
    }

    if (inSingle) {
      out.push(ch);
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === "'") {
        inSingle = false;
      }
      continue;
    }

    if (inBacktick) {
      out.push(ch);
      if (lang === 'go') {
        if (ch === '`') {
          inBacktick = false;
        }
      } else {
        if (escaped) {
          escaped = false;
        } else if (ch === '\\') {
          escaped = true;
        } else if (ch === '`') {
          inBacktick = false;
        }
      }
      continue;
    }

    if (lang === 'cs' && ch === '@' && next === '"') {
      inVerbatimCs = true;
      out.push(ch, next);
      i++;
      continue;
    }

    if (ch === '"') {
      inDouble = true;
      out.push(ch);
      continue;
    }

    if (ch === "'") {
      inSingle = true;
      out.push(ch);
      continue;
    }

    if ((lang === 'go' || lang === 'ts') && ch === '`') {
      inBacktick = true;
      out.push(ch);
      continue;
    }

    if (ch === '/' && next === '/' && (i === 0 || source[i - 1] !== '\\')) {
      inLineComment = true;
      i++;
      continue;
    }

    if (ch === '/' && next === '*' && (i === 0 || source[i - 1] !== '\\')) {
      inBlockComment = true;
      i++;
      continue;
    }

    out.push(ch);
  }

  return out.join('');
}

export function readProdFilesNoComments(
  dirPath: string,
  extensions: string[],
  lang: 'cs' | 'go' | 'ts',
): string {
  return walkProdFiles(dirPath, extensions)
    .map((f) => stripComments(readText(f), lang))
    .join('\n');
}

export function hasNatsSubjectSuffix(src: string, suffix: string): boolean {
  const esc = suffix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(
    `(?:subscribePattern|publishSubject)\\([^,]+,\\s*"${esc}"\\)|\\.${esc}\\b|["']${esc}["']`,
  );
  return re.test(src);
}

export function hasBinaryDfMagic(src: string): boolean {
  return (
    /0x4446\b/i.test(src) ||
    /0x44\s*,\s*0x46/i.test(src) ||
    /0x44\b[\s\S]{0,60}0x46\b/i.test(src) ||
    /'D'[\s\S]{0,40}'F'/.test(src) ||
    /['"]DF['"]/.test(src)
  );
}

export function hasTenantFanoutBinding(agentSrc: string): boolean {
  const hasBind = /\bBindStream\b|\bBindDurable\b/.test(agentSrc);
  const hasTenantScopedName =
    /DISCOVERY_FANOUT_COMMANDS_/.test(agentSrc) ||
    (/DISCOVERY_FANOUT_COMMANDS/.test(agentSrc) &&
      (/\+\s*"_"\s*\+/.test(agentSrc) || /fmt\.Sprintf\([^)]*DISCOVERY_FANOUT_COMMANDS_/.test(agentSrc))) ||
    /FilterSubject/.test(agentSrc);
  return hasBind && hasTenantScopedName;
}

export async function renderLandingSsr(options: RenderLandingOptions = {}): Promise<string> {
  const prevWindowDesc = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const prevNavigatorDesc = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  const prevDocumentDesc = Object.getOwnPropertyDescriptor(globalThis, 'document');

  const stubWindow = {
    localStorage: {
      getItem: (key: string): string | null => {
        if (options.throwStorage) {
          throw new Error('localStorage unavailable');
        }
        if (key === 'discoveryrmm-language') {
          return options.storedLang ?? null;
        }
        return null;
      },
      setItem: () => {},
    },
    location: {
      hash: options.hash ?? '',
    },
    scrollY: 0,
    addEventListener: () => {},
    removeEventListener: () => {},
    scrollTo: () => {},
    matchMedia: () => ({
      matches: false,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
    requestAnimationFrame: () => 0,
    cancelAnimationFrame: () => {},
  };

  const stubNavigator = {
    languages: options.navigatorLanguages ?? [],
    language: options.navigatorLanguages?.[0] ?? '',
  };

  const stubDocument = {
    documentElement: { lang: 'pt-BR' },
    title: '',
    body: { style: { overflow: '' } },
    activeElement: null,
    querySelector: () => null,
    getElementById: () => null,
    addEventListener: () => {},
    removeEventListener: () => {},
  };

  const server = await createServer({
    root: LANDING_ROOT,
    server: { middlewareMode: true },
    appType: 'custom',
    optimizeDeps: { noDiscovery: true },
    logLevel: 'silent',
  });

  try {
    Object.defineProperty(globalThis, 'window', {
      value: stubWindow,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(globalThis, 'navigator', {
      value: stubNavigator,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(globalThis, 'document', {
      value: stubDocument,
      configurable: true,
      writable: true,
    });

    const landingRequire = createRequire(path.join(LANDING_ROOT, 'package.json'));
    const reactUrl = pathToFileURL(realpathOrResolve(landingRequire.resolve('react'))).href;
    const reactDomServerUrl = pathToFileURL(realpathOrResolve(landingRequire.resolve('react-dom/server'))).href;
    const reactMod = (await import(reactUrl)) as {
      createElement?: (type: unknown, props: unknown, ...children: unknown[]) => unknown;
      default?: {
        createElement?: (type: unknown, props: unknown, ...children: unknown[]) => unknown;
      };
    };
    const reactDomServerMod = (await import(reactDomServerUrl)) as {
      renderToString?: (element: unknown) => string;
      default?: {
        renderToString?: (element: unknown) => string;
      };
    };
    const createElementFn = reactMod.createElement ?? reactMod.default?.createElement;
    const renderToStringFn = reactDomServerMod.renderToString ?? reactDomServerMod.default?.renderToString;
    if (typeof createElementFn !== 'function' || typeof renderToStringFn !== 'function') {
      throw new Error('Failed to resolve createElement / renderToString from canonical React modules');
    }

    const i18nMod = (await server.ssrLoadModule('/src/i18n.tsx')) as {
      I18nProvider: (props: { children: unknown }) => unknown;
    };
    const appMod = (await server.ssrLoadModule('/src/App.tsx')) as {
      default: () => unknown;
    };

    const element = createElementFn(
      i18nMod.I18nProvider,
      null,
      createElementFn(appMod.default, null),
    );
    return renderToStringFn(element);
  } finally {
    if (prevWindowDesc) {
      Object.defineProperty(globalThis, 'window', prevWindowDesc);
    } else {
      delete (globalThis as Record<string, unknown>).window;
    }

    if (prevNavigatorDesc) {
      Object.defineProperty(globalThis, 'navigator', prevNavigatorDesc);
    } else {
      delete (globalThis as Record<string, unknown>).navigator;
    }

    if (prevDocumentDesc) {
      Object.defineProperty(globalThis, 'document', prevDocumentDesc);
    } else {
      delete (globalThis as Record<string, unknown>).document;
    }

    await server.close();
  }
}

export async function buildLandingToTemp(): Promise<BuiltLandingResult> {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'discoveryrmm-e2e-'));
  const hadNodeEnv = Object.prototype.hasOwnProperty.call(process.env, 'NODE_ENV');
  const prevNodeEnv = process.env.NODE_ENV;
  try {
    await build({
      root: LANDING_ROOT,
      configFile: path.join(LANDING_ROOT, 'vite.config.ts'),
      build: { outDir, emptyOutDir: true },
      logLevel: 'silent',
    });

    const absFiles = walkFiles(outDir);
    const files = absFiles.map((f) => path.relative(outDir, f).replace(/\\/g, '/'));
    const builtHtml = readText(path.join(outDir, 'index.html'));
    const cssFiles = absFiles.filter((f) => f.endsWith('.css'));
    const jsFiles = absFiles.filter((f) => f.endsWith('.js'));
    const builtCss = cssFiles.map((f) => readText(f)).join('\n');
    const builtJs = jsFiles.map((f) => readText(f)).join('\n');

    return {
      outDir,
      files,
      builtHtml,
      builtCss,
      builtJs,
      cleanup: () => {
        fs.rmSync(outDir, { recursive: true, force: true });
      },
    };
  } catch (error) {
    fs.rmSync(outDir, { recursive: true, force: true });
    throw error;
  } finally {
    if (hadNodeEnv) {
      process.env.NODE_ENV = prevNodeEnv;
    } else {
      delete process.env.NODE_ENV;
    }
  }
}

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon',
};

export async function serveSubpath(
  rootDir: string,
  basePath = '/DiscoveryRMM/',
): Promise<StaticServerHandle> {
  const resolvedRoot = path.resolve(rootDir);
  const server = http.createServer((req, res) => {
    const reqUrl = new URL(req.url ?? '/', 'http://127.0.0.1');
    const pathname = decodeURIComponent(reqUrl.pathname);

    if (!pathname.startsWith(basePath)) {
      res.statusCode = 404;
      res.end('Not Found');
      return;
    }

    let relPath = pathname.slice(basePath.length);
    if (relPath === '' || relPath.endsWith('/')) {
      relPath += 'index.html';
    }

    const candidate = path.resolve(resolvedRoot, relPath);
    if (!candidate.startsWith(resolvedRoot + path.sep) && candidate !== resolvedRoot) {
      res.statusCode = 403;
      res.end('Forbidden');
      return;
    }

    if (!fs.existsSync(candidate) || !fs.statSync(candidate).isFile()) {
      res.statusCode = 404;
      res.end('Not Found');
      return;
    }

    const ext = path.extname(candidate).toLowerCase();
    res.setHeader('Content-Type', MIME_TYPES[ext] ?? 'application/octet-stream');
    res.statusCode = 200;
    fs.createReadStream(candidate).pipe(res);
  });

  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolve());
  });

  const addr = server.address();
  if (!addr || typeof addr === 'string') {
    server.close();
    throw new Error('Failed to bind static test server');
  }

  return {
    port: addr.port,
    origin: `http://127.0.0.1:${addr.port}`,
    baseUrl: `http://127.0.0.1:${addr.port}${basePath}`,
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.close((err) => (err ? reject(err) : resolve()));
      }),
  };
}

export function readPngDimensions(filePath: string): PngDimensions {
  const buf = fs.readFileSync(filePath);
  if (buf.length < 24) {
    throw new Error(`PNG file too small: ${filePath}`);
  }
  const pngMagic = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (!buf.subarray(0, 8).equals(pngMagic)) {
    throw new Error(`Invalid PNG signature in ${filePath}`);
  }
  const chunkLength = buf.readUInt32BE(8);
  if (chunkLength !== 13) {
    throw new Error(`Invalid IHDR chunk length in ${filePath}: expected 13, got ${chunkLength}`);
  }
  const chunkType = buf.subarray(12, 16).toString('ascii');
  if (chunkType !== 'IHDR') {
    throw new Error(`Expected IHDR chunk first in ${filePath}, got ${chunkType}`);
  }
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  if (width <= 0 || height <= 0) {
    throw new Error(`Invalid PNG dimensions in ${filePath}: ${width}x${height}`);
  }
  return { width, height };
}

export function parseHexColor(hex: string): [number, number, number] {
  const cleaned = hex.trim().replace(/^#/, '');
  if (!/^(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(cleaned)) {
    throw new Error(`Unsupported hex color: ${hex}`);
  }
  if (cleaned.length === 3) {
    const r = parseInt(cleaned[0] + cleaned[0], 16);
    const g = parseInt(cleaned[1] + cleaned[1], 16);
    const b = parseInt(cleaned[2] + cleaned[2], 16);
    return [r, g, b];
  }
  const r = parseInt(cleaned.slice(0, 2), 16);
  const g = parseInt(cleaned.slice(2, 4), 16);
  const b = parseInt(cleaned.slice(4, 6), 16);
  return [r, g, b];
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = parseHexColor(hex).map((channel) => {
    const srgb = channel / 255;
    return srgb <= 0.04045 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(fgHex: string, bgHex: string): number {
  const l1 = relativeLuminance(fgHex);
  const l2 = relativeLuminance(bgHex);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function extractCssRootVars(cssText: string): Map<string, string> {
  const vars = new Map<string, string>();
  const regex = /(--[a-z0-9-]+)\s*:\s*([^;}{]+?)\s*(?:;|(?=\}))/gi;
  for (const match of cssText.matchAll(regex)) {
    vars.set(match[1].trim(), match[2].trim());
  }
  return vars;
}

export function gitLsTree(repoPath: string, ref: string): string[] {
  const out = execFileSync('git', ['-C', repoPath, 'ls-tree', '-r', '--name-only', ref], {
    encoding: 'utf8',
  });
  return out
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function runTscCheck(extraArgs: string[] = []): { status: number; output: string } {
  const tscBin = path.join(LANDING_ROOT, 'node_modules', 'typescript', 'bin', 'tsc');
  try {
    const stdout = execFileSync(
      process.execPath,
      [tscBin, '-p', path.join(LANDING_ROOT, 'tsconfig.json'), '--noEmit', ...extraArgs],
      { cwd: LANDING_ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
    );
    return { status: 0, output: stdout };
  } catch (err) {
    const execErr = err as { status?: number; stdout?: string; stderr?: string };
    return {
      status: execErr.status ?? 1,
      output: `${execErr.stdout ?? ''}\n${execErr.stderr ?? ''}`.trim(),
    };
  }
}

function cleanMarkdownTarget(rawTarget: string): string {
  let target = rawTarget.trim();
  if (target.startsWith('<')) {
    const closeIdx = target.indexOf('>');
    if (closeIdx > 0) {
      target = target.slice(1, closeIdx).trim();
    }
  } else {
    target = target.replace(/\s+(?:"[^"]*"|'[^']*'|\([^)]*\))\s*$/, '').trim();
  }
  return target;
}

function isExternalOrHashTarget(target: string): boolean {
  const lower = target.toLowerCase();
  return (
    !target ||
    lower.startsWith('http://') ||
    lower.startsWith('https://') ||
    lower.startsWith('mailto:') ||
    lower.startsWith('tel:') ||
    lower.startsWith('data:') ||
    target.startsWith('#')
  );
}

export function extractMarkdownRelativeLinks(mdText: string): MarkdownLink[] {
  const links: MarkdownLink[] = [];
  // Strip fenced code blocks (``` or ~~~) and inline code spans before scanning Markdown links
  const withoutFences = mdText.replace(/```[\s\S]*?```|~~~[\s\S]*?~~~/g, '');
  const withoutCode = withoutFences.replace(/`+[^`\n]*`+/g, '');

  // Extract inline images first (and unwrap nested [![alt](img)](target) -> [alt](target))
  const flattened = withoutCode.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m, altRaw: string, targetRaw: string) => {
    const label = altRaw.trim();
    let target = cleanMarkdownTarget(targetRaw);
    if (!isExternalOrHashTarget(target)) {
      const hashIdx = target.indexOf('#');
      if (hashIdx >= 0) {
        target = target.slice(0, hashIdx);
      }
      if (target) {
        links.push({ label, target });
      }
    }
    return label || 'image';
  });

  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  for (const match of flattened.matchAll(regex)) {
    const label = match[1].trim();
    let target = cleanMarkdownTarget(match[2]);
    if (isExternalOrHashTarget(target)) {
      continue;
    }
    const hashIdx = target.indexOf('#');
    if (hashIdx >= 0) {
      target = target.slice(0, hashIdx);
    }
    if (target) {
      links.push({ label, target });
    }
  }
  return links;
}

function parseCSharpIntegralExpr(rawExpr: string): number | null {
  let expr = rawExpr.replace(/[\s_]+/g, '');
  expr = expr.replace(/\b(0x[0-9a-f]+|0b[01]+|\d+)[ul]+\b/gi, '$1');
  while (expr.startsWith('(') && expr.endsWith(')')) {
    expr = expr.slice(1, -1);
  }
  const shiftMatch = expr.match(/^(\d+)\s*<<\s*(\d+)$/);
  if (shiftMatch) {
    const base = parseInt(shiftMatch[1], 10);
    const shift = parseInt(shiftMatch[2], 10);
    return (base << shift) >>> 0;
  }
  if (/^0x[0-9a-f]+$/i.test(expr)) {
    return parseInt(expr.slice(2), 16);
  }
  if (/^0b[01]+$/i.test(expr)) {
    return parseInt(expr.slice(2), 2);
  }
  if (/^-?\d+$/.test(expr)) {
    return parseInt(expr, 10);
  }
  return null;
}

export function parseCSharpEnumValues(csSource: string, enumName: string): Map<string, number> {
  const stripped = stripComments(csSource, 'cs');
  const enumRegex = new RegExp(
    `\\benum\\s+${enumName}(?:\\s*:\\s*[A-Za-z_][A-Za-z0-9_.]*)?\\s*\\{([\\s\\S]*?)\\}`,
    'm',
  );
  const match = stripped.match(enumRegex);
  const map = new Map<string, number>();
  if (!match) {
    return map;
  }

  const body = match[1].replace(/\[[^\]]*\]/g, '');
  let nextVal = 0;
  for (const rawEntry of body.split(',')) {
    const entry = rawEntry.trim();
    if (!entry) {
      continue;
    }
    const entryMatch = entry.match(/^([A-Za-z_][A-Za-z0-9_]*)(?:\s*=\s*([\s\S]+))?$/);
    if (!entryMatch) {
      continue;
    }
    const name = entryMatch[1];
    let val = nextVal;
    if (entryMatch[2]) {
      const parsed = parseCSharpIntegralExpr(entryMatch[2]);
      if (parsed === null) {
        continue;
      }
      val = parsed;
    }
    map.set(name, val);
    nextVal = val + 1;
  }
  return map;
}

function evalGoConstExpr(rawExpr: string, iotaIdx: number): number | null {
  const normalized = rawExpr
    .replace(/\biota\b/g, String(iotaIdx))
    .replace(/[\s_]+/g, '');
  let expr = normalized;
  while (expr.startsWith('(') && expr.endsWith(')')) {
    expr = expr.slice(1, -1);
  }
  const shiftParenMatch = expr.match(/^(\d+)<<\(([^)]+)\)$/);
  if (shiftParenMatch) {
    const base = parseInt(shiftParenMatch[1], 10);
    const inner = shiftParenMatch[2];
    const addSub = inner.match(/^(\d+)([+-])(\d+)$/);
    if (addSub) {
      const a = parseInt(addSub[1], 10);
      const b = parseInt(addSub[3], 10);
      const shift = addSub[2] === '+' ? a + b : a - b;
      return (base << shift) >>> 0;
    }
    if (/^\d+$/.test(inner)) {
      return (base << parseInt(inner, 10)) >>> 0;
    }
  }
  const shiftMatch = expr.match(/^(\d+)<<(\d+)$/);
  if (shiftMatch) {
    return (parseInt(shiftMatch[1], 10) << parseInt(shiftMatch[2], 10)) >>> 0;
  }
  const addSubMatch = expr.match(/^(\d+)([+-])(\d+)$/);
  if (addSubMatch) {
    const a = parseInt(addSubMatch[1], 10);
    const b = parseInt(addSubMatch[3], 10);
    return addSubMatch[2] === '+' ? a + b : a - b;
  }
  if (/^0x[0-9a-f]+$/i.test(expr)) {
    return parseInt(expr.slice(2), 16);
  }
  if (/^0b[01]+$/i.test(expr)) {
    return parseInt(expr.slice(2), 2);
  }
  if (/^-?\d+$/.test(expr)) {
    return parseInt(expr, 10);
  }
  return null;
}

export function parseGoConstValues(goSource: string): Map<string, number> {
  const stripped = stripComments(goSource, 'go');
  const map = new Map<string, number>();

  for (const blockMatch of stripped.matchAll(/\bconst\s*\(([\s\S]*?)\)/g)) {
    let iotaIdx = 0;
    let lastExpr: string | null = null;
    for (const rawLine of blockMatch[1].split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line) {
        continue;
      }
      const eqMatch = line.match(/^([A-Za-z_][A-Za-z0-9_]*)(?:\s+[A-Za-z_][A-Za-z0-9_.]*)?\s*=\s*(.+)$/);
      if (eqMatch) {
        lastExpr = eqMatch[2].trim();
        const val = evalGoConstExpr(lastExpr, iotaIdx);
        if (val !== null) {
          map.set(eqMatch[1], val);
        }
        iotaIdx++;
      } else if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(line) && lastExpr !== null) {
        const val = evalGoConstExpr(lastExpr, iotaIdx);
        if (val !== null) {
          map.set(line, val);
        }
        iotaIdx++;
      }
    }
  }

  for (const singleMatch of stripped.matchAll(
    /^\s*const\s+([A-Za-z_][A-Za-z0-9_]*)(?:\s+[A-Za-z_][A-Za-z0-9_.]*)?\s*=\s*(.+)$/gm,
  )) {
    const val = evalGoConstExpr(singleMatch[2].trim(), 0);
    if (val !== null) {
      map.set(singleMatch[1], val);
    }
  }

  return map;
}

export function extractHtmlAttributes(html: string, tagName: string): Array<Record<string, string>> {
  const results: Array<Record<string, string>> = [];
  const tagRegex = new RegExp(`<${tagName}\\b([^>]*)>`, 'gi');
  for (const match of html.matchAll(tagRegex)) {
    const attrs: Record<string, string> = {};
    const attrRegex = /([a-zA-Z_:][a-zA-Z0-9_.:-]*)\s*=\s*"([^"]*)"/g;
    for (const attrMatch of match[1].matchAll(attrRegex)) {
      attrs[attrMatch[1].toLowerCase()] = attrMatch[2];
    }
    results.push(attrs);
  }
  return results;
}

export function extractAllIds(html: string): string[] {
  const ids: string[] = [];
  const regex = /\sid="([^"]+)"/g;
  for (const match of html.matchAll(regex)) {
    ids.push(match[1]);
  }
  return ids;
}
