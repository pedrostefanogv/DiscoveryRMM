import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import {
  AGENT_ROOT,
  API_ROOT,
  CANONICAL_WORKSPACE_ENTRIES,
  LANDING_ROOT,
  SITE_ROOT,
  WORKSPACE_ROOT,
  extractMarkdownRelativeLinks,
  fileExists,
  findFilesByBasename,
  hasBinaryDfMagic,
  hasNatsSubjectSuffix,
  hasTenantFanoutBinding,
  parseCSharpEnumValues,
  readProdFilesNoComments,
  readText,
  stripComments,
  walkProdFiles,
} from './helpers.ts';

describe('F25 Tier 1 — Cross-Repo Contracts, Hygiene & Docs Category-Partition Tests', () => {
  it('F25-T1-01: Workspace root canonical hygiene (only 4 repos + MAPEAMENTO_PROJETO.md)', () => {
    const entries = fs.readdirSync(WORKSPACE_ROOT).sort();
    assert.deepEqual(
      entries,
      [...CANONICAL_WORKSPACE_ENTRIES].sort(),
      `Workspace root ${WORKSPACE_ROOT} contains unexpected orphaned entries: ${entries
        .filter((e) => !(CANONICAL_WORKSPACE_ENTRIES as readonly string[]).includes(e))
        .join(', ')}`,
    );
  });

  it('F25-T1-02: Contract 4 Cross-repo LAN Proxy & RDP/WebRDP alignment (API <-> Agent <-> Site)', () => {
    // 1. API Contract
    const kindCs = readText(path.join(API_ROOT, 'src', 'Discovery.Core', 'Enums', 'RemoteSessionKind.cs'));
    const kindValues = parseCSharpEnumValues(kindCs, 'RemoteSessionKind');
    assert.equal(kindValues.get('Proxy'), 3, 'API RemoteSessionKind.Proxy must be 3');
    assert.ok(kindValues.has('Rdp'), 'API RemoteSessionKind must define Rdp');
    assert.equal(kindValues.get('All'), 4, 'API RemoteSessionKind.All must remain 4');
    assert.equal(kindValues.get('Processes'), 5, 'API RemoteSessionKind.Processes must remain 5');

    const rightsCs = readText(path.join(API_ROOT, 'src', 'Discovery.Core', 'Enums', 'RemoteSessionRights.cs'));
    const rightsValues = parseCSharpEnumValues(rightsCs, 'RemoteSessionRights');
    assert.equal(rightsValues.get('NoProxy'), 64, 'API RemoteSessionRights.NoProxy must be 64');
    assert.equal(rightsValues.get('NoRdp'), 128, 'API RemoteSessionRights.NoRdp must be 128');

    const apiInfraSrc = [
      readProdFilesNoComments(path.join(API_ROOT, 'src', 'Discovery.Api', 'Services'), ['.cs'], 'cs'),
      readProdFilesNoComments(path.join(API_ROOT, 'src', 'Discovery.Api', 'Cqrs'), ['.cs'], 'cs'),
      readProdFilesNoComments(path.join(API_ROOT, 'src', 'Discovery.Infrastructure'), ['.cs'], 'cs'),
    ].join('\n');
    assert.match(apiInfraSrc, /\.proxy\.req/, 'API must grant .proxy.req permission');
    assert.match(apiInfraSrc, /\.proxy\.resp/, 'API must grant .proxy.resp permission');
    assert.match(apiInfraSrc, /\.proxy\.ready/, 'API must grant .proxy.ready permission');
    assert.match(apiInfraSrc, /\.tunnel\.in/, 'API must grant .tunnel.in permission');
    assert.match(apiInfraSrc, /\.tunnel\.out/, 'API must grant .tunnel.out permission');
    assert.match(apiInfraSrc, /NoProxy/, 'API viewer permissions must gate proxy subjects on NoProxy');
    assert.match(apiInfraSrc, /NoRdp/, 'API viewer permissions must gate RDP/tunnel subjects on NoRdp');
    assert.match(apiInfraSrc, /allowLoopback|allowedPorts|maxResponseBytes/i, 'API StartRemoteSession must include proxy policy');

    const apiControllersSrc = readProdFilesNoComments(
      path.join(API_ROOT, 'src', 'Discovery.Api', 'Controllers'),
      ['.cs'],
      'cs',
    );
    assert.match(apiControllersSrc, /rdp-file/, 'API RemoteSessionsController must expose /rdp-file endpoint');
    assert.match(apiControllersSrc, /tunnel\/ws/, 'API RemoteSessionsController must expose /tunnel/ws WebSocket relay endpoint');

    // 2. Agent Contract (prod files only, comments stripped)
    const agentRaw = walkProdFiles(path.join(AGENT_ROOT, 'src', 'app'), ['.go'])
      .map((f) => readText(f))
      .join('\n');
    const agentSrc = readProdFilesNoComments(path.join(AGENT_ROOT, 'src', 'app'), ['.go'], 'go');
    const agentCmdSrc = readProdFilesNoComments(path.join(AGENT_ROOT, 'src', 'cmd'), ['.go'], 'go');
    const allAgentGo = `${agentSrc}\n${agentCmdSrc}`;

    assert.match(
      allAgentGo,
      /RightsNoProxy\s*(?:RemoteSessionRights)?\s*=\s*64|NoProxy\s*(?:RemoteSessionRights)?\s*=\s*64/,
      'Agent must define RightsNoProxy = 64',
    );
    assert.match(
      allAgentGo,
      /RightsNoRdp\s*(?:RemoteSessionRights)?\s*=\s*128|NoRdp\s*(?:RemoteSessionRights)?\s*=\s*128/,
      'Agent must define RightsNoRdp = 128',
    );
    assert.match(allAgentGo, /case\s+(?:"rdp"|KindRdp)\s*:/, 'Agent session manager must accept "rdp" session kind');
    assert.ok(hasNatsSubjectSuffix(allAgentGo, 'proxy.req'), 'Agent must subscribe to .proxy.req');
    assert.ok(hasNatsSubjectSuffix(allAgentGo, 'proxy.resp'), 'Agent must publish to .proxy.resp');
    assert.ok(hasNatsSubjectSuffix(allAgentGo, 'proxy.ready'), 'Agent must publish to .proxy.ready');
    assert.ok(hasNatsSubjectSuffix(allAgentGo, 'tunnel.in'), 'Agent must subscribe to .tunnel.in');
    assert.ok(hasNatsSubjectSuffix(allAgentGo, 'tunnel.out'), 'Agent must publish to .tunnel.out');
    assert.equal(
      /func\s+\([^)]*\)\s+runProxySession\([^)]*\)[^{]*\{[\s\S]{0,200}TODO/m.test(agentRaw),
      false,
      'Agent runProxySession must be genuinely wired (not a TODO stub)',
    );

    // 3. Site Contract (prod files only, comments stripped)
    const siteApiSrc = readProdFilesNoComments(path.join(SITE_ROOT, 'src', 'api'), ['.ts'], 'ts');
    assert.match(siteApiSrc, /['"]rdp['"]/, 'Site API types must support "rdp" RemoteSessionKind');

    const remoteProxyTsx = stripComments(
      readText(path.join(SITE_ROOT, 'src', 'modules', 'remote-proxy', 'RemoteProxy.tsx')),
      'ts',
    );
    assert.equal(
      /<iframe[^>]+src=\{proxyUrl\}/.test(remoteProxyTsx),
      false,
      'Site RemoteProxy.tsx must use NATS proxy/tunnel rather than placeholder <iframe src={proxyUrl}>',
    );
    const siteModulesSrc = readProdFilesNoComments(
      path.join(SITE_ROOT, 'src', 'modules'),
      ['.ts', '.tsx'],
      'ts',
    );
    const siteRdpSrc = readProdFilesNoComments(
      path.join(SITE_ROOT, 'src', 'modules', 'remote-rdp'),
      ['.ts', '.tsx'],
      'ts',
    );
    assert.ok(
      hasNatsSubjectSuffix(siteModulesSrc, 'proxy.req') || hasNatsSubjectSuffix(siteModulesSrc, 'tunnel.in'),
      'Site remote-proxy must wire NATS .proxy.req / .tunnel.in',
    );
    assert.ok(
      (siteRdpSrc.length > 0 || /RemoteRdp|remote-rdp/i.test(siteModulesSrc)) &&
        (hasNatsSubjectSuffix(siteModulesSrc, 'tunnel.in') ||
          hasNatsSubjectSuffix(siteModulesSrc, 'tunnel.out') ||
          /rdp-file|tunnel\/ws/.test(siteModulesSrc)),
      'Site must implement remote-rdp UI and tunnel/WS/.rdp transport',
    );
  });

  it('F25-T1-03: Contract 1 Per-tenant JetStream fan-out isolation & msg.Subject identity authority', () => {
    const credsCs = stripComments(
      readText(path.join(API_ROOT, 'src', 'Discovery.Infrastructure', 'Services', 'NatsCredentialsService.cs')),
      'cs',
    );
    assert.equal(
      credsCs.includes('$JS.API.CONSUMER.*.DISCOVERY_FANOUT_COMMANDS.>'),
      false,
      'API NatsCredentialsService.cs must NOT grant global wildcard $JS.API.CONSUMER.*.DISCOVERY_FANOUT_COMMANDS.>',
    );
    assert.equal(
      credsCs.includes('$JS.API.CONSUMER.*.DISCOVERY_SUPPORT_CHAT.>'),
      false,
      'API NatsCredentialsService.cs must NOT grant global wildcard $JS.API.CONSUMER.*.DISCOVERY_SUPPORT_CHAT.>',
    );
    const subjectBuilderCs = stripComments(
      readText(path.join(API_ROOT, 'src', 'Discovery.Core', 'Helpers', 'NatsSubjectBuilder.cs')),
      'cs',
    );
    assert.match(
      `${credsCs}\n${subjectBuilderCs}`,
      /TenantFanoutStreamName[\s\S]*DISCOVERY_FANOUT_COMMANDS_\{|DISCOVERY_FANOUT_COMMANDS_\{|\$JS\.API\.CONSUMER\.CREATE\.DISCOVERY_FANOUT_COMMANDS\./,
      'API must scope JetStream fan-out consumer ACLs per tenant (DISCOVERY_FANOUT_COMMANDS_{...} or filtered consumer)',
    );

    const messagingSrc = [
      subjectBuilderCs,
      readProdFilesNoComments(path.join(API_ROOT, 'src', 'Discovery.Infrastructure', 'Messaging'), ['.cs'], 'cs'),
    ].join('\n');
    assert.match(
      messagingSrc,
      /TryParseAgentSubject|ExtractClientId|TryExtractSubjectIdentity|ParseSubjectIdentity/,
      'API NatsAgentMessaging must extract ClientId/SiteId authoritatively from msg.Subject',
    );

    const agentConnSrc = readProdFilesNoComments(
      path.join(AGENT_ROOT, 'src', 'app', 'core', 'agentconn'),
      ['.go'],
      'go',
    );
    assert.equal(
      /BindStream\(\s*[^,]+,\s*"DISCOVERY_FANOUT_COMMANDS"\s*\)/.test(agentConnSrc),
      false,
      'Agent runtime_nats must NOT bind directly to legacy unscoped DISCOVERY_FANOUT_COMMANDS stream',
    );
    assert.ok(
      hasTenantFanoutBinding(agentConnSrc),
      'Agent runtime_nats must bind to tenant-scoped JetStream fan-out stream/consumer',
    );
  });

  it('F25-T1-04: Contract 5 Binary DF file transfer, WS URL JWT removal & Agent DPAPI/IPC redaction', () => {
    const agentFilesSrc = [
      readProdFilesNoComments(path.join(AGENT_ROOT, 'src', 'app', 'core', 'fileserver'), ['.go'], 'go'),
      readProdFilesNoComments(path.join(AGENT_ROOT, 'src', 'app', 'core', 'remotesession'), ['.go'], 'go'),
    ].join('\n');
    const siteFilesSrc = readProdFilesNoComments(
      path.join(SITE_ROOT, 'src', 'modules', 'remote-files'),
      ['.ts', '.tsx'],
      'ts',
    );
    const apiViewerPermFiles = findFilesByBasename(
      path.join(API_ROOT, 'src'),
      'RemoteSessionViewerPermissions.cs',
    ).filter((f) => !f.includes(`${path.sep}Discovery.Tests${path.sep}`));
    assert.ok(apiViewerPermFiles.length >= 1, 'Expected RemoteSessionViewerPermissions.cs in DiscoveryRMM_API/src');
    const apiPermsCs = apiViewerPermFiles.map((f) => stripComments(readText(f), 'cs')).join('\n');

    assert.ok(
      hasBinaryDfMagic(agentFilesSrc),
      'Agent fileserver/remotesession must implement binary DF (0x44, 0x46 / 0x4446) remote file transfer framing',
    );
    assert.ok(
      hasBinaryDfMagic(siteFilesSrc),
      'Site remote-files must implement binary DF (0x44, 0x46 / 0x4446) file transfer framing',
    );

    if (agentFilesSrc.includes('.files.data') || siteFilesSrc.includes('.files.data')) {
      assert.match(
        apiPermsCs,
        /\.files\.data/,
        'API RemoteSessionViewerPermissions.cs must grant .files.data when .files.data subject is used',
      );
    }

    const siteSrc = readProdFilesNoComments(path.join(SITE_ROOT, 'src'), ['.ts', '.tsx'], 'ts');
    assert.equal(
      /\?access_token=/.test(siteSrc),
      false,
      'Site must NOT expose JWT via ?access_token= query string in WebSocket URLs',
    );

    const agentAllGo = readProdFilesNoComments(path.join(AGENT_ROOT, 'src'), ['.go'], 'go');
    assert.match(agentAllGo, /CryptProtectData/, 'Agent must protect authToken/deployToken using Windows DPAPI CryptProtectData');
    assert.match(agentAllGo, /HardenSecretFileACL/, 'Agent must restrict config.json/debug_config.json ACLs to SYSTEM + Administrators');
    assert.match(agentAllGo, /hasAuthToken|HasAuthToken/, 'Agent IPC must return redacted hasAuthToken instead of plaintext secret');
  });

  it('F25-T1-05: MAPEAMENTO_PROJETO.md ecosystem accuracy (stacks, port 5288, features, no active SignalR/MeshCentral)', () => {
    const doc = readText(path.join(WORKSPACE_ROOT, 'MAPEAMENTO_PROJETO.md'));

    for (const expected of [
      /\.NET 10/i,
      /Quartz(?:\.NET)?\s+4\.\d+/i,
      /React 19/i,
      /TypeScript 7/i,
      /Vite 8/i,
      /Vitest 5/i,
      /Wails\s+v?3\.[1-9]/i,
      /5288/,
      /DPAPI/i,
      /WebRDP|RDP/i,
      /Proxy/i,
      /SSE/i,
    ]) {
      assert.match(doc, expected, `MAPEAMENTO_PROJETO.md missing accurate current detail: ${expected}`);
    }

    assert.equal(/\/hubs\/agent/.test(doc), false, 'MAPEAMENTO_PROJETO.md must not claim active /hubs/agent SignalR hub');
    assert.equal(/NatsSignalRBridge/.test(doc), false, 'MAPEAMENTO_PROJETO.md must not claim active NatsSignalRBridge');
    assert.equal(/localhost:7001/.test(doc), false, 'MAPEAMENTO_PROJETO.md must not claim stale localhost:7001 API port');
    assert.equal(/151 migrations/i.test(doc), false, 'MAPEAMENTO_PROJETO.md must not claim stale 151 migrations');
    assert.equal(/50 controllers/i.test(doc), false, 'MAPEAMENTO_PROJETO.md must not claim stale 50 controllers');
  });

  it('F25-T1-06: All 4 README.md files + Discovery/ARCHITECTURE.md accuracy & relative Markdown link integrity', () => {
    const apiReadme = readText(path.join(API_ROOT, 'README.md'));
    assert.equal(/https:\/\/localhost:7001/.test(apiReadme), false, 'DiscoveryRMM_API/README.md must not list stale :7001 URL');
    assert.equal(/SignalR\s*\((?:Realtime|WebSocket)\)/i.test(apiReadme), false, 'DiscoveryRMM_API/README.md must not claim active SignalR');
    assert.equal(/MeshCentral\s+embed/i.test(apiReadme), false, 'DiscoveryRMM_API/README.md must not claim MeshCentral embed');

    const siteReadme = readText(path.join(SITE_ROOT, 'README.md'));
    assert.match(siteReadme, /TypeScript 7/i, 'DiscoveryRMM_Site/README.md must reflect TypeScript 7');
    assert.match(siteReadme, /Vite 8/i, 'DiscoveryRMM_Site/README.md must reflect Vite 8');
    assert.match(siteReadme, /Vitest/i, 'DiscoveryRMM_Site/README.md must document Vitest');

    const agentArch = readText(path.join(AGENT_ROOT, 'ARCHITECTURE.md'));
    assert.equal(agentArch.includes('v3.0.0-beta.34'), false, 'Discovery/ARCHITECTURE.md must not cite stale Wails v3.0.0-beta.34');
    assert.match(agentArch, /v?3\.[1-9]\.\d+/, 'Discovery/ARCHITECTURE.md must reflect Wails v3.1+');
    assert.match(agentArch, /wails3 build/, 'Discovery/ARCHITECTURE.md must document wails3 build');
    assert.match(agentArch, /netproxy/, 'Discovery/ARCHITECTURE.md must document netproxy');
    assert.equal(
      (agentArch.match(/WATCHDOG_SYSTEM\.md/g) ?? []).length <= 1,
      true,
      'Discovery/ARCHITECTURE.md must not duplicate WATCHDOG_SYSTEM.md',
    );

    const docFiles = [
      path.join(WORKSPACE_ROOT, 'MAPEAMENTO_PROJETO.md'),
      path.join(API_ROOT, 'README.md'),
      path.join(AGENT_ROOT, 'README.md'),
      path.join(AGENT_ROOT, 'ARCHITECTURE.md'),
      path.join(SITE_ROOT, 'README.md'),
      path.join(LANDING_ROOT, 'README.md'),
    ];

    for (const docPath of docFiles) {
      const content = readText(docPath);
      const links = extractMarkdownRelativeLinks(content);
      const docDir = path.dirname(docPath);
      for (const link of links) {
        const resolved = path.resolve(docDir, link.target);
        assert.ok(
          fileExists(resolved),
          `Broken relative Markdown link in ${path.relative(WORKSPACE_ROOT, docPath)}: [${link.label}](${link.target}) -> ${resolved} does not exist`,
        );
      }
    }
  });
});
