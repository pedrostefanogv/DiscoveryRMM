import assert from 'node:assert/strict';
import path from 'node:path';
import { describe, it } from 'node:test';
import {
  AGENT_ROOT,
  API_ROOT,
  SITE_ROOT,
  WORKSPACE_ROOT,
  fileExists,
  findFilesByBasename,
  parseCSharpEnumValues,
  parseGoConstValues,
  parseJsonc,
  readProdFilesNoComments,
  readText,
  stripComments,
  walkFiles,
  walkProdFiles,
} from './helpers.ts';

function lookupGoConst(consts: Map<string, number>, candidates: string[]): number | undefined {
  for (const key of candidates) {
    if (consts.has(key)) {
      return consts.get(key);
    }
  }
  return undefined;
}

describe('F25 Tier 2 — Cross-Repo Contract & Hygiene Boundary Tests', () => {
  it('F25-T2-01: UUID hyphenation boundary (:N for remote sessions vs consistent fanout/support-chat UUIDs)', () => {
    const handlerFiles = findFilesByBasename(path.join(API_ROOT, 'src'), 'RemoteSessionCommandHandlers.cs');
    assert.ok(handlerFiles.length >= 1, 'Expected RemoteSessionCommandHandlers.cs in DiscoveryRMM_API/src');
    const apiHandlers = handlerFiles.map((f) => stripComments(readText(f), 'cs')).join('\n');
    const apiCreds = stripComments(
      readText(path.join(API_ROOT, 'src', 'Discovery.Infrastructure', 'Services', 'NatsCredentialsService.cs')),
      'cs',
    );
    const agentNatsStreamFiles = findFilesByBasename(path.join(AGENT_ROOT, 'src', 'app'), 'nats_stream.go');
    assert.ok(agentNatsStreamFiles.length >= 1, 'Expected nats_stream.go in Discovery/src/app');
    const agentNatsStream = agentNatsStreamFiles.map((f) => stripComments(readText(f), 'go')).join('\n');
    const siteModulesSrc = readProdFilesNoComments(path.join(SITE_ROOT, 'src', 'modules'), ['.ts', '.tsx'], 'ts');

    assert.match(apiHandlers, /tenant\.\{[^}]*:N\}\.site\.\{[^}]*:N\}\.agent\.\{[^}]*:N\}\.remote\.session\.\{[^}]*:N\}/);
    assert.match(apiCreds, /tenant\.\{[^}]*:N\}\.site\.\{[^}]*:N\}\.agent\.\{[^}]*:N\}\.remote\.session/);
    assert.match(agentNatsStream, /stripHyphens\(/, 'Agent nats_stream.go must strip hyphens for remote session subjects');
    assert.match(
      siteModulesSrc,
      /\.replace\(\/-\/g,\s*['"]['"]\)/,
      'Site remote session hooks must strip hyphens from UUIDs for .remote.session.{sid}',
    );

    const subjectBuilderCs = stripComments(
      readText(path.join(API_ROOT, 'src', 'Discovery.Core', 'Helpers', 'NatsSubjectBuilder.cs')),
      'cs',
    );
    const agentRuntimeGo = stripComments(
      readText(path.join(AGENT_ROOT, 'src', 'app', 'core', 'agentconn', 'runtime_nats.go')),
      'go',
    );

    // Stream names must consistently use compact (no-hyphen) clientId on both sides
    const fanoutNameMatch = subjectBuilderCs.match(/TenantFanoutStreamName\s*\([^)]*\)\s*=>\s*([^;]+);/);
    assert.ok(fanoutNameMatch, 'Expected NatsSubjectBuilder.TenantFanoutStreamName');
    assert.match(
      fanoutNameMatch[1],
      /DISCOVERY_FANOUT_COMMANDS_\{clientId:N\}/,
      'API NatsSubjectBuilder.TenantFanoutStreamName must use compact {clientId:N}',
    );
    const fanoutCandidatesMatch = agentRuntimeGo.match(/func\s+natsFanoutStreamCandidates\b[\s\S]*?\n\}/);
    assert.ok(fanoutCandidatesMatch, 'Expected natsFanoutStreamCandidates in runtime_nats.go');
    assert.match(
      fanoutCandidatesMatch[0],
      /normalizeCompactGUID\(cfg\.ClientID\)/,
      'Agent runtime_nats.natsFanoutStreamCandidates must use normalizeCompactGUID(cfg.ClientID)',
    );

    // Fan-out subjects in NatsSubjectBuilder must match resolveNATSSubjects in runtime_nats.go (both hyphenated Guid)
    const clientSubjMatch = subjectBuilderCs.match(/TenantClientAgentsCommandStreamSubject\s*\([^)]*\)\s*=>\s*([^;]+);/);
    const siteSubjMatch = subjectBuilderCs.match(/TenantSiteAgentsCommandStreamSubject\s*\([^)]*\)\s*=>\s*([^;]+);/);
    assert.ok(clientSubjMatch && siteSubjMatch, 'Expected TenantClient/SiteAgentsCommandStreamSubject in NatsSubjectBuilder.cs');
    assert.match(
      clientSubjMatch[1],
      /tenant\.\{clientId\}\.agents\.command/,
      'API TenantClientAgentsCommandStreamSubject must use hyphenated {clientId}',
    );
    assert.match(
      siteSubjMatch[1],
      /tenant\.\{clientId\}\.site\.\*\.agents\.command/,
      'API TenantSiteAgentsCommandStreamSubject must use hyphenated {clientId}',
    );
    assert.equal(
      /\{clientId:N\}/.test(clientSubjMatch[1]) || /\{clientId:N\}/.test(siteSubjMatch[1]),
      false,
      'API fan-out stream subjects must not switch to :N without matching Agent resolveNATSSubjects',
    );

    const resolveSubjectsMatch = agentRuntimeGo.match(/func\s+resolveNATSSubjects\b[\s\S]*?\n\}/);
    assert.ok(resolveSubjectsMatch, 'Expected resolveNATSSubjects in runtime_nats.go');
    assert.match(
      resolveSubjectsMatch[0],
      /tenant\.%s\.agents\.command/,
      'Agent resolveNATSSubjects must subscribe to tenant.%s.agents.command',
    );
    assert.match(
      resolveSubjectsMatch[0],
      /tenant\.%s\.site\.%s\.agents\.command/,
      'Agent resolveNATSSubjects must subscribe to tenant.%s.site.%s.agents.command',
    );
    assert.equal(
      /stripSubjectHyphens|normalizeCompactGUID/.test(resolveSubjectsMatch[0]),
      false,
      'Agent resolveNATSSubjects must keep hyphenated clientId/siteId matching NatsSubjectBuilder',
    );
  });

  it('F25-T2-02: Enum numeric & bitmask boundary (0..6 and single-bit powers of 2 across API & Agent)', () => {
    const kindCs = readText(path.join(API_ROOT, 'src', 'Discovery.Core', 'Enums', 'RemoteSessionKind.cs'));
    const rightsCs = readText(path.join(API_ROOT, 'src', 'Discovery.Core', 'Enums', 'RemoteSessionRights.cs'));
    const policyGo = readText(
      path.join(AGENT_ROOT, 'src', 'app', 'core', 'remotesession', 'session_tunnel_policy.go'),
    );

    const apiKinds = parseCSharpEnumValues(kindCs, 'RemoteSessionKind');
    const apiRights = parseCSharpEnumValues(rightsCs, 'RemoteSessionRights');
    const goConsts = parseGoConstValues(policyGo);

    const expectedKinds: Array<[string, number]> = [
      ['Screen', 0],
      ['Terminal', 1],
      ['Files', 2],
      ['Proxy', 3],
      ['All', 4],
      ['Processes', 5],
      ['Rdp', 6],
    ];
    for (const [name, num] of expectedKinds) {
      assert.equal(apiKinds.get(name), num, `API RemoteSessionKind.${name} must equal ${num}`);
      const goVal = lookupGoConst(goConsts, [
        `RemoteSessionKind${name}`,
        `SessionKind${name}`,
        name,
      ]);
      assert.equal(
        goVal,
        num,
        `Agent session_tunnel_policy.go must define RemoteSessionKind${name} = ${num} (got ${goVal})`,
      );
    }

    const expectedRights: Array<[string, number]> = [
      ['None', 0],
      ['ViewOnly', 1],
      ['NoTerminal', 2],
      ['NoFiles', 4],
      ['LimitedInput', 8],
      ['NoDesktop', 16],
      ['NoEvents', 32],
      ['NoProxy', 64],
      ['NoRdp', 128],
    ];
    const goRightsValues: number[] = [];
    for (const [name, mask] of expectedRights) {
      assert.equal(apiRights.get(name), mask, `API RemoteSessionRights.${name} must equal ${mask}`);
      const goVal = lookupGoConst(goConsts, [`Rights${name}`, name]);
      assert.equal(
        goVal,
        mask,
        `Agent session_tunnel_policy.go must define Rights${name}/${name} = ${mask} (got ${goVal})`,
      );
      if (goVal !== undefined && goVal > 0) {
        goRightsValues.push(goVal);
      }
    }

    // Verify all non-zero rights are single-bit powers of 2 and pairwise bitwise disjoint
    for (const [label, masks] of [
      ['API RemoteSessionRights', [...apiRights.values()].filter((v) => v > 0)],
      ['Agent RemoteSessionRights', goRightsValues],
    ] as const) {
      let unionMask = 0;
      for (const v of masks) {
        assert.equal(
          v > 0 && (v & (v - 1)) === 0,
          true,
          `${label} bitmask ${v} must be a single-bit power of 2`,
        );
        assert.equal(
          (unionMask & v) === 0,
          true,
          `${label} bitmask ${v} overlaps with another flag (union=${unionMask})`,
        );
        unionMask |= v;
      }
    }
  });

  it('F25-T2-03: Tunnel binary header (0x01) & JSON (0x7B) wire spec boundary across Agent & Site', () => {
    const codecGo = stripComments(
      readText(path.join(AGENT_ROOT, 'src', 'app', 'core', 'remotesession', 'session_tunnel_codec.go')),
      'go',
    );
    const goConsts = parseGoConstValues(codecGo);
    const versionConst = goConsts.get('TunnelFrameVersion1') ?? goConsts.get('TunnelFrameVersion');
    const opDataConst = goConsts.get('TunnelOpData') ?? goConsts.get('TunnelBinaryOpData');
    const opCloseConst = goConsts.get('TunnelOpClose') ?? goConsts.get('TunnelBinaryOpClose');
    const headerLenConst = goConsts.get('TunnelBinaryHeaderLen') ?? goConsts.get('TunnelBinaryHeaderSize');

    assert.equal(versionConst, 1, 'Agent session_tunnel_codec.go must define TunnelFrameVersion1 = 0x01');
    assert.equal(opDataConst, 1, 'Agent session_tunnel_codec.go must define TunnelOpData = 0x01');
    assert.equal(opCloseConst, 2, 'Agent session_tunnel_codec.go must define TunnelOpClose = 0x02');
    assert.equal(headerLenConst, 6, 'Agent session_tunnel_codec.go must define TunnelBinaryHeaderLen = 6');
    assert.match(codecGo, /TunnelJSONLeadingByte\s*(?:byte\s*)?=\s*(?:'\{'|0x7[bB]|123)/);
    assert.match(codecGo, /binary\.BigEndian\.PutUint32\s*\(\s*hdr\[2:6\]/, 'Agent tunnel encoder must write 4B BigEndian streamId at [2:6]');
    assert.match(codecGo, /binary\.BigEndian\.Uint32\s*\(\s*raw\[2:6\]\s*\)/, 'Agent tunnel decoder must read 4B BigEndian streamId at [2:6]');

    // Scope Site tunnel codec checks to tunnel-relevant directories ONLY (never remote-screen)
    const siteTunnelSrc = [
      readProdFilesNoComments(path.join(SITE_ROOT, 'src', 'modules', 'remote-proxy'), ['.ts', '.tsx'], 'ts'),
      readProdFilesNoComments(path.join(SITE_ROOT, 'src', 'modules', 'remote-rdp'), ['.ts', '.tsx'], 'ts'),
      readProdFilesNoComments(path.join(SITE_ROOT, 'src', 'api'), ['.ts', '.tsx'], 'ts'),
      readProdFilesNoComments(path.join(SITE_ROOT, 'src', 'utils'), ['.ts', '.tsx'], 'ts'),
    ].join('\n');

    assert.match(
      siteTunnelSrc,
      /0x0?1\b|(?:TUNNEL|FRAME)_(?:VERSION|OP_DATA)\s*=\s*1\b|\[0\]\s*(?:===?|!==?)\s*(?:0x0?1|1)\b/,
      'Site tunnel client (remote-proxy/remote-rdp/api/utils) must implement binary frame version/op 0x01 (or 1)',
    );
    assert.match(
      siteTunnelSrc,
      /0x0?2\b|(?:TUNNEL|FRAME)_OP_CLOSE\s*=\s*2\b|\[1\]\s*(?:===?|!==?)\s*(?:0x0?2|2)\b/,
      'Site tunnel client (remote-proxy/remote-rdp/api/utils) must implement binary close op 0x02 (or 2)',
    );
    assert.match(
      siteTunnelSrc,
      /(?:setUint32|getUint32)\s*\(\s*2\b/,
      'Site tunnel client must encode/decode 4-byte BigEndian streamId at byte offset 2',
    );
  });

  it('F25-T2-04: Proxy SSRF & loopback fail-closed policy boundary (API + Agent)', () => {
    const remoteAccessOptsCs = stripComments(
      readText(path.join(API_ROOT, 'src', 'Discovery.Core', 'Configuration', 'RemoteAccessOptions.cs')),
      'cs',
    );
    const appSettings = parseJsonc<{
      RemoteAccess?: {
        Proxy?: {
          DefaultAllowlist?: unknown[];
          AllowedPorts?: unknown[];
          MaxResponseBytes?: number;
        };
      };
    }>(readText(path.join(API_ROOT, 'src', 'Discovery.Api', 'appsettings.json')));

    assert.match(remoteAccessOptsCs, /Proxy\s*\{/, 'RemoteAccessOptions.cs must expose Proxy options');
    assert.deepEqual(appSettings.RemoteAccess?.Proxy?.DefaultAllowlist, [], 'DefaultAllowlist must fail closed ([])');
    assert.deepEqual(appSettings.RemoteAccess?.Proxy?.AllowedPorts, [], 'AllowedPorts must fail closed ([])');
    assert.equal(
      appSettings.RemoteAccess?.Proxy?.MaxResponseBytes,
      10485760,
      'MaxResponseBytes default must be 10 MiB (10485760)',
    );

    const policyGo = stripComments(
      readText(path.join(AGENT_ROOT, 'src', 'app', 'core', 'remotesession', 'session_tunnel_policy.go')),
      'go',
    );
    const allowlistGo = stripComments(
      readText(path.join(AGENT_ROOT, 'src', 'app', 'core', 'netproxy', 'allowlist.go')),
      'go',
    );

    assert.match(policyGo, /AllowLoopback\s+bool/, 'ProxyPolicy must define AllowLoopback bool (default false zero-value)');
    assert.equal(
      /AllowLoopback:\s*true/.test(policyGo),
      false,
      'Agent ProxyPolicy default must NOT set AllowLoopback: true',
    );
    assert.match(
      policyGo,
      /SetAllowLoopback\s*\(\s*policy\.AllowLoopback\s*\)/,
      'BuildProxyAllowlist must enforce policy.AllowLoopback for proxy sessions',
    );
    assert.match(policyGo, /AllowRDPEndpoint/, 'Agent RDP policy must lock exclusively to loopback RDP endpoint');
    assert.match(`${policyGo}\n${allowlistGo}`, /127\.0\.0\.1/, 'Agent RDP/allowlist policy must reference 127.0.0.1');
    assert.match(allowlistGo, /0\.0\.0\.0\/8/, 'Agent netproxy allowlist must block 0.0.0.0/8');
    assert.match(
      allowlistGo,
      /IsLinkLocalUnicast|169\.254\.0\.0\/16/,
      'Agent netproxy allowlist must block link-local / IMDS 169.254.0.0/16',
    );
    assert.match(allowlistGo, /fd00:ec2::254/, 'Agent netproxy allowlist must block AWS IPv6 IMDS fd00:ec2::254');
  });

  it('F25-T2-05: Dev port & transport boundary consistency (5288, 4222, no :7001, no /hubs proxy)', () => {
    const launchSettings = readText(
      path.join(API_ROOT, 'src', 'Discovery.Api', 'Properties', 'launchSettings.json'),
    );
    assert.match(launchSettings, /:5288\b/, 'API launchSettings.json must bind port 5288');

    const siteViteConfig = stripComments(readText(path.join(SITE_ROOT, 'vite.config.ts')), 'ts');
    assert.match(siteViteConfig, /:5288\b/, 'Site vite.config.ts /api proxy must target port 5288');
    assert.equal(
      /['"]\/hubs['"]/.test(siteViteConfig),
      false,
      'Site vite.config.ts must not keep dead /hubs SignalR proxy',
    );

    const apiReadme = readText(path.join(API_ROOT, 'README.md'));
    const mapeamento = readText(path.join(WORKSPACE_ROOT, 'MAPEAMENTO_PROJETO.md'));
    const siteEnvExample = readText(path.join(SITE_ROOT, '.env.example'));

    assert.equal(/https:\/\/localhost:7001/.test(apiReadme), false, 'API README must not cite stale :7001 port');
    assert.equal(/localhost:7001/.test(mapeamento), false, 'MAPEAMENTO_PROJETO.md must not cite stale :7001 port');
    assert.equal(
      /localhost:5000/.test(siteEnvExample) && !/5288/.test(siteEnvExample),
      false,
      'Site .env.example must not advertise stale :5000 without :5288',
    );
  });

  it('F25-T2-06: API inventory counts boundary & zero unscoped JetStream wildcards in prod code', () => {
    const migrationCount = walkFiles(
      path.join(API_ROOT, 'src', 'Discovery.Migrations', 'Migrations'),
      ['.cs'],
    ).length;
    const controllerCount = walkFiles(
      path.join(API_ROOT, 'src', 'Discovery.Api', 'Controllers'),
      ['.cs'],
    ).filter((f) => f.endsWith('Controller.cs')).length;

    assert.ok(migrationCount >= 286, `Expected >= 286 migrations on disk, found ${migrationCount}`);
    assert.ok(controllerCount >= 72, `Expected >= 72 controllers on disk, found ${controllerCount}`);

    const mapeamento = readText(path.join(WORKSPACE_ROOT, 'MAPEAMENTO_PROJETO.md'));
    assert.equal(/\b151\s+migrations\b/i.test(mapeamento), false, 'MAPEAMENTO_PROJETO.md has stale 151 migrations');
    assert.equal(/\b50\s+controllers\b/i.test(mapeamento), false, 'MAPEAMENTO_PROJETO.md has stale 50 controllers');
    assert.match(
      mapeamento,
      /2026-1[12]|1[78]\/11\/2026/,
      'MAPEAMENTO_PROJETO.md must carry updated 2026-11/12 verification date',
    );

    const apiProdCs = walkProdFiles(path.join(API_ROOT, 'src'), ['.cs']);
    for (const filePath of apiProdCs) {
      const content = stripComments(readText(filePath), 'cs');
      assert.equal(
        content.includes('$JS.API.CONSUMER.*.DISCOVERY_FANOUT_COMMANDS.>'),
        false,
        `Unscoped global fanout ACL remains in ${path.relative(API_ROOT, filePath)}`,
      );
      assert.equal(
        content.includes('$JS.API.CONSUMER.*.DISCOVERY_SUPPORT_CHAT.>'),
        false,
        `Unscoped global support-chat ACL remains in ${path.relative(API_ROOT, filePath)}`,
      );
    }

    const agentProdGo = walkProdFiles(path.join(AGENT_ROOT, 'src'), ['.go']);
    assert.ok(
      fileExists(path.join(AGENT_ROOT, 'src', 'cmd', 'discovery-service')) && agentProdGo.length > 0,
      'Agent must have decoupled discovery-service entrypoint and Go sources',
    );
  });
});
