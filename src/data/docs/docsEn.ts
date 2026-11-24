import type { DocsContent } from './types';

export const docsEn: DocsContent = {
  ui: {
    portalBadge: 'Official Documentation · DiscoveryRMM Ecosystem',
    portalTitle: 'Guides & Reference',
    backToHome: 'Back to home',
    searchPlaceholder: 'Search chapter or topic...',
    searchLabel: 'Filter documentation chapters',
    searchEmpty: 'No chapters match your search.',
    mobileMenuSummary: 'Browse chapters',
    copyLabel: 'Copy code',
    copiedLabel: 'Copied',
    copyErrorLabel: 'Copy failed',
    previousLabel: 'Previous chapter',
    nextLabel: 'Next chapter',
    repoLinksTitle: 'Repositories & References',
    repoLinks: [
      { label: 'Server (DiscoveryRMM_API)', href: 'https://github.com/pedrostefanogv/DiscoveryRMM_API' },
      { label: 'Windows Agent (Releases)', href: 'https://github.com/pedrostefanogv/DiscoveryRMM_Agent/releases' },
      {
        label: 'Configuration Guide (API)',
        href: 'https://github.com/pedrostefanogv/DiscoveryRMM_API/blob/release/docs/CONFIGURATION.md',
      },
    ],
  },
  sections: [
    {
      id: 'overview',
      navLabel: '1. Overview & Architecture',
      badge: 'Chapter 01 · Architecture',
      title: 'How DiscoveryRMM works end-to-end',
      lead: 'Understand the four ecosystem layers, the canonical real-time transport (NATS 2.x + JetStream + REST/SSE), and where to start based on your role.',
      blocks: [
        {
          type: 'cards',
          title: 'Choose your starting point',
          items: [
            {
              title: 'Installer / SysAdmin',
              badge: 'Infrastructure',
              description: 'Server prerequisites, Linux bootstrap wizard, PostgreSQL + pgvector, NATS, TLS/WSS proxy, and admin recovery.',
              meta: 'Go to Server Installation →',
              href: '#/docs/server-install',
            },
            {
              title: 'IT Operator / NOC',
              badge: 'Operations',
              description: 'Client/Site onboarding, Deploy Tokens, sensors, Auto-Tickets, PowerShell scripts, patches, and remote access.',
              meta: 'Go to Fleet Operations →',
              href: '#/docs/clients-deploy',
            },
            {
              title: 'End User (Windows Endpoint)',
              badge: 'Workstation',
              description: 'Using the system tray icon, Tier-1 AI Chat, opening support tickets, App Store, and remote consent prompts.',
              meta: 'Go to User Guide →',
              href: '#/docs/guides',
            },
          ],
        },
        {
          type: 'paragraphs',
          items: [
            'DiscoveryRMM separates four decoupled layers: the Central Server (.NET 10 / ASP.NET Core), the Web Console (React 19 + TypeScript 7 + Vite 8 PWA), the Windows Discovery Agent (Go 1.26 + Wails v3), and Data/Messaging Infrastructure (PostgreSQL 15+ with pgvector, NATS 2.x with JetStream, Redis, and local/MinIO/S3 storage).',
            'All asynchronous messaging and remote sessions run over NATS 2.x with JetStream over TLS/WSS (or internal TCP), with HTTPS REST and Server-Sent Events (SSE) fallback. Agent identity is cryptographically verified via Ed25519 Auth Callout and always derived from the authenticated NATS subject — never from the payload.',
          ],
        },
        {
          type: 'code',
          title: 'Communication topology & canonical subjects',
          language: 'text',
          snippet: `Discovery Agent (Windows) ──► POST /api/v1/agent-install/register (Deploy Token)
                           ◄── { agentId, token: "mdz_...", clientId, siteId }
                           ──► GET  /api/v1/agent-auth/me/configuration
                           ◄── { natsServerHost, natsUseWssExternal, policies }
                           ──► NATS Auth Callout ($SYS.REQ.USER.AUTH · Ed25519)
                           ◄── Dynamic JWT with tenant-isolated ACL

Canonical subjects:
  tenant.{clientId}.site.{siteId}.agent.{agentId}.{command|heartbeat|result|...}
  tenant.{clientId}.site.{siteId}.agent.{agentId}.remote.session.{sessionId}.{frame|event|control|proxy.*|tunnel.*}

Per-tenant JetStream streams:
  DISCOVERY_FANOUT_COMMANDS_{clientId}   ·   DISCOVERY_SUPPORT_CHAT_{clientId}`,
        },
        {
          type: 'table',
          caption: 'Release channels & environment policy',
          headers: ['Channel / Branch', 'Target Audience', 'Behavior', 'Recommendation'],
          rows: [
            ['release (Stable)', 'Production', 'Ships only validated and tested builds', 'Default for production servers and agents'],
            ['beta', 'Pre-production', 'Upcoming features in final validation', 'Validate in a pilot group before rollout'],
            ['lts', 'Long-Term Support', 'Stability focus and critical fixes', 'Environments with strict change windows'],
            ['dev', 'Staging / Devs', 'Active development and CI integration', 'Never deploy directly to production'],
          ],
        },
      ],
    },
    {
      id: 'requirements',
      navLabel: '2. Requirements & Ports',
      badge: 'Chapter 02 · Prerequisites',
      title: 'System requirements, dependencies & port matrix',
      lead: 'Verify Linux server prerequisites, Windows endpoint requirements, and network ports before starting deployment.',
      blocks: [
        {
          type: 'table',
          caption: 'Central Server & Infrastructure Requirements',
          headers: ['Component', 'Requirement / Version', 'Notes'],
          rows: [
            ['Operating System', 'Ubuntu 22.04/24.04 or Debian 12+ (x64 / arm64)', 'Supported by the Linux bootstrap script with root or sudo'],
            ['API Runtime', '.NET 10 SDK / ASP.NET Core', 'Installed automatically by the bootstrap wizard'],
            ['Database', 'PostgreSQL 15+ with pgvector extension', 'Mandatory single provider in production; pgvector enables 1536-dim semantic search'],
            ['Messaging', 'NATS Server 2.x with JetStream enabled', 'TCP 4222 internal and WebSocket TLS (wss://host/nats) for Web Console / external agents'],
            ['Cache', 'Redis 7+ (optional in dev, recommended in prod)', 'Agent presence, RBAC cache, and FIDO2/WebAuthn state'],
            ['Object Storage', 'Local disk, MinIO, or S3-compatible', 'Stores attachments, custom packages, recordings, and reports'],
          ],
        },
        {
          type: 'table',
          caption: 'Windows Endpoint Requirements (Discovery Agent)',
          headers: ['Item', 'Specification', 'Details'],
          rows: [
            ['Operating System', 'Windows 10, Windows 11, or Windows Server (x86/x64)', 'Installed via NSIS (.exe) or Zero-Touch (unattend / GPO / Intune)'],
            ['UI Runtime', 'Microsoft Edge WebView2 Runtime', 'Handled by the NSIS installer; used only by discovery-agent.exe'],
            ['Hardware Identity', 'TPM 2.0 + SMBIOS UUID (recommended)', 'Used for endpoint hardware identity and local diagnostics'],
            ['Privileges', 'Installer requires Admin; service runs as SYSTEM', 'Companion UI runs in the interactive user session (LeastPrivilege)'],
            ['Windows Firewall', 'Automatic rules for domain,private profiles', 'Required only when LAN P2P sharing (mDNS/UDP) is enabled'],
          ],
        },
        {
          type: 'table',
          caption: 'Network ports & endpoints matrix',
          headers: ['Service', 'Default Port / URL', 'Direction', 'Purpose'],
          rows: [
            ['API Dev (Kestrel)', 'http://0.0.0.0:5288', 'Console / Agent → API', 'Default development port (launchSettings.json)'],
            ['Web Console Dev', 'http://localhost:5173', 'Browser → Vite', 'Proxies /api to :5288 automatically'],
            ['Production HTTPS', 'https://your-domain (443)', 'External → Reverse Proxy', 'Terminates TLS for API, Web Console, and wss://your-domain/nats'],
            ['NATS Server', '4222 (TCP) / wss /nats', 'Agent & Console → NATS', 'Real-time messaging and remote sessions'],
            ['PostgreSQL', '5432', 'API → Database', 'Relational persistence + pgvector embeddings'],
            ['Redis', '6379', 'API → Cache', 'Presence, RBAC, and FIDO2 state'],
            ['Local RDP Tunnel', '127.0.0.1:{ephemeral port}', 'Loopback on Agent / Viewer', 'RDP locked strictly to loopback over NATS'],
          ],
        },
      ],
    },
    {
      id: 'server-install',
      navLabel: '3. Server Installation',
      badge: 'Chapter 03 · Server Setup',
      title: 'How to install, migrate, update & recover the server',
      lead: 'Complete walkthrough to deploy DiscoveryRMM in production via the Linux bootstrap or manually from source.',
      blocks: [
        {
          type: 'callout',
          tone: 'warning',
          title: 'Server updates are always manual',
          text: 'Unlike the Windows Agent (which supports self-update), the central server never auto-updates. To upgrade production, run the installer with --mode update after validating the release in staging.',
        },
        {
          type: 'steps',
          title: 'Method A — Production quick install (Linux Bootstrap)',
          items: [
            {
              title: '1. Prepare the Ubuntu/Debian host',
              description: 'Sign in as root or a sudo-enabled user and ensure outbound HTTPS access to GitHub and OS package repositories.',
            },
            {
              title: '2. Run the Bootstrap Wizard',
              description: 'The script clones DiscoveryRMM_API, installs .NET 10, PostgreSQL + pgvector, NATS 2.x, Redis, and configures systemd services.',
              code: 'bash -c "$(curl -fsSL https://raw.githubusercontent.com/pedrostefanogv/DiscoveryRMM_API/release/scripts/linux/bootstrap_install_discovery.sh)"',
            },
            {
              title: '3. Choose the release channel (or pass an env var)',
              description: 'Select option 2 (release — stable) for production, or set DISCOVERY_RELEASE_CHANNEL for non-interactive automation.',
              code: 'DISCOVERY_RELEASE_CHANNEL=release bash -c "$(curl -fsSL https://raw.githubusercontent.com/pedrostefanogv/DiscoveryRMM_API/release/scripts/linux/bootstrap_install_discovery.sh)"',
            },
            {
              title: '4. Verify health & Scalar API docs',
              description: 'Confirm GET /health returns 200 OK and open /scalar/v1 to inspect REST API endpoints.',
            },
          ],
        },
        {
          type: 'steps',
          title: 'Method B — Manual / source installation',
          items: [
            {
              title: '1. Clone and restore the .NET 10 solution',
              description: 'Clone the official repository and restore Discovery.slnx packages.',
              code: 'git clone https://github.com/pedrostefanogv/DiscoveryRMM_API.git\ncd DiscoveryRMM_API\ndotnet restore Discovery.slnx',
            },
            {
              title: '2. Configure appsettings.Development.json',
              description: 'Copy the example config and fill in PostgreSQL (with pgvector), NATS URL/NKeys, and Redis credentials.',
              code: 'cp src/Discovery.Api/appsettings.Development.json.example src/Discovery.Api/appsettings.Development.json',
            },
            {
              title: '3. Run database migrations',
              description: 'FluentMigrator creates the schema, pgvector indexes, default workflow states, and the initial admin user.',
              code: 'dotnet run --project src/Discovery.Api -- --migrate',
            },
            {
              title: '4. Start the API and Web Console',
              description: 'The API listens on port 5288 and the Web Console (DiscoveryRMM_Site) runs on Vite port 5173 proxying /api.',
              code: 'dotnet run --project src/Discovery.Api\n# In a second terminal (DiscoveryRMM_Site):\nnpm install && npm run dev',
            },
          ],
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Mandatory first-access onboarding',
          text: 'After migrations, sign in to the Web Console with username "admin" and default password "Mudar@123". On first login the system enforces: (1) password change (12+ chars, uppercase, number, symbol), (2) profile update, and (3) MFA enrollment (FIDO2/WebAuthn or TOTP).',
        },
        {
          type: 'code',
          title: 'Manual update & admin recovery (Local Shell)',
          language: 'bash',
          snippet: `# Update a script-installed server:
./scripts/linux/install_discovery_server.sh --mode update

# Recover admin access (resets password, forces change, revokes sessions & clears MFA):
dotnet run --project src/Discovery.Api -- --recover-admin

# Safer stdin mode (avoids shell history):
echo "NewStrongPass@2026" | dotnet run --project src/Discovery.Api -- --recover-admin --password-stdin`,
        },
        {
          type: 'accordion',
          title: 'Common installation troubleshooting',
          items: [
            {
              summary: 'API startup fails: vector / pgvector extension not found',
              paragraphs: [
                'DiscoveryRMM refuses SQLite at runtime and requires PostgreSQL 15+ with the pgvector extension installed.',
                'Install postgresql-<version>-pgvector on the database host and run CREATE EXTENSION IF NOT EXISTS vector; on the target database.',
              ],
            },
            {
              summary: 'Web Console or external Agent cannot connect to NATS over WSS',
              paragraphs: [
                'Ensure your reverse proxy (Nginx/Caddy/Traefik) forwards Upgrade and Connection: upgrade headers on /nats with an extended WebSocket timeout.',
                'Check Nats:ServerPublicKey (Ed25519 trust list) in appsettings.json so Auth Callout validates requests signed by NATS Server.',
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'agent',
      navLabel: '4. How the Agent Works',
      badge: 'Chapter 04 · Discovery Agent',
      title: 'Dual-Binary architecture, lifecycle & agent capabilities',
      lead: 'Learn how the SYSTEM service (discovery-service.exe) and the Wails v3 companion UI (discovery-agent.exe) collaborate on Windows endpoints.',
      blocks: [
        {
          type: 'cards',
          title: 'Dual-Binary Separation & IPC',
          items: [
            {
              title: 'discovery-service.exe (Session 0 · SYSTEM)',
              badge: 'Headless Core',
              description: 'Windows service with zero Wails or WebView2 dependencies. Runs NATS/JetStream, inventory, automation, P2P, self-update, remote session workers, and the Dual-Pipe IPC server.',
            },
            {
              title: 'discovery-agent.exe (User Session · Wails v3)',
              badge: 'Companion UI',
              description: 'Lightweight desktop app with system tray, AI Chat, support tickets, self-service store, and diagnostics. Connects to the service over authenticated named pipes (read + admin) and enters idle memory-saving mode when minimized.',
            },
          ],
        },
        {
          type: 'steps',
          title: '4-Phase Staged Startup & Local Security',
          items: [
            {
              title: 'Deploy Token Registration & DPAPI Protection',
              description: 'On first boot, the agent posts hostname, OS, and hardware identifiers to POST /api/v1/agent-install/register using a Deploy Token. The returned mdz_* token is encrypted via Windows DPAPI (dpapi:v1:) with ACLs restricted to SYSTEM and Administrators.',
            },
            {
              title: 'Phase 1 (2s) — Initial Inventory & SQLite WAL',
              description: 'Opens the local SQLite WAL store and captures initial hardware/software inventory for immediate availability.',
            },
            {
              title: 'Phase 2 (1s svc) — DPAPI Bootstrap & NATS/WSS',
              description: 'Fetches GET /api/v1/agent-auth/me/configuration and connects to NATS using Ed25519 Auth Callout, subscribing to its Client/Site/Agent subjects.',
            },
            {
              title: 'Phases 3 & 4 (10s–12s) — Automation, P2P, Sync & Self-Update',
              description: 'Starts automation cron, P2P mesh (go-libp2p + mDNS/UDP), API health probes, outbox cleanup, and SHA-256 + Authenticode verified self-update.',
            },
          ],
        },
        {
          type: 'table',
          caption: 'Native Discovery Agent Capabilities',
          headers: ['Capability', 'Technical Implementation', 'Security Controls'],
          rows: [
            ['Inventory', 'Native WMI/CIM collectors + osquery Thrift + PowerShell fallback + WUA (COM)', 'Incremental sync manifest avoids redundant transfers'],
            ['Remote Screen', 'DXGI Desktop Duplication (HDR tone-mapping & dirty rects) + GDI fallback', 'Privacy banner excluded from capture, configurable consent & optional recording'],
            ['Remote Terminal', 'ConPTY (Windows pseudo-console) with isolated dispatcher', 'runAs=user is fail-closed: never silently degrades to SYSTEM'],
            ['Remote Files', 'Binary DF framing protocol with handle cache and 256 KB chunks', 'No JWT in WebSocket URLs; per-session NATS ACL enforcement'],
            ['Processes & Registry', 'sysctrl and winregistry with fail-closed guards', 'SAM/SECURITY/LSA blocked even for read; Run/RunOnce blocked for writes'],
            ['LAN Proxy HTTP/WS', 'core/netproxy over NATS', 'Fail-closed allowlist when empty, SSRF protection, and anti-TOCTOU DNS resolution'],
            ['RDP / WebRDP Tunnel', 'Multiplexed session_tunnel (64 streams, 6B codec) + TermService preflight', 'Ephemeral port bound strictly to 127.0.0.1; enforces NoRdp=128 right'],
            ['Automation', 'PowerShell, CMD, and custom packages with IANA maintenance windows', 'Custom fields passed via MDZ_CUSTOM_FIELDS env (no command-line interpolation)'],
            ['Zero-Touch & Recovery', 'Unattend / GPO / Intune + hardware rebinding via TPM 2.0 EK & SMBIOS UUID', 'After Windows reinstallation, the endpoint automatically restores its record, policies, and apps'],
            ['Remote Transparency', 'Interactive Chat/Remote Access consent prompts + floating active banner', 'Countdown-guarded approval and always-visible top banner excluded from capture (WDA_EXCLUDEFROMCAPTURE)'],
            ['P2P Mesh', 'go-libp2p + mDNS/UDP per-Site local discovery', 'Relays only SHA-256 verified artifacts to save WAN bandwidth'],
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'How to launch local Debug Mode on the Agent',
          text: 'Right-click the system tray icon → Exit, then reopen the agent while holding the Shift key. Debug Mode exposes local logs, TPM 2.0 EK / SMBIOS UUID identity, and all diagnostic views even if hidden by server policy.',
        },
      ],
    },
    {
      id: 'interface',
      navLabel: '5. Web & Agent Interface',
      badge: 'Chapter 05 · Interfaces',
      title: 'Interface Features (Web Console & Agent Desktop)',
      lead: 'Complete map of screens, routes, and tools available to operators in the Web Console (PWA) and to end users on Windows.',
      blocks: [
        {
          type: 'table',
          caption: 'Web Console Modules (DiscoveryRMM_Site)',
          headers: ['Module', 'Main Routes', 'What you can do'],
          rows: [
            ['Dashboard & Fleet', '/ · /clients · /sites', 'Executive health overview, clients, sites, departments, and consolidated inventory'],
            ['Agents & Remote Session', '/agents · /agents/:id · /agents/remote-session', 'Endpoint details, sensors, apps, registry, screen, terminal, files, processes, LAN proxy & WebRDP'],
            ['Service Board & Tickets', '/service-board · /tickets · /tickets/sla · /tickets/csat', 'Kanban/queue board, SLA timers, macros, templates, dedicated chat windows, and CSAT'],
            ['Auto-Tickets', '/tickets/auto-policy · /tickets/auto-rules', 'Hierarchical scope policy, automated rules, dry-run simulation, and dedup metrics'],
            ['Sensors', '/sensors · /sensors/manage · /sensors/script', 'Fleet monitoring, thresholds, definitions, and full script sensor editor'],
            ['Patches & Updates', '/patches · /patches/approvals · /patches/compliance · /patches/policy', 'Windows Update inventory, approvals, compliance tracking, and patch policies'],
            ['Software & App Store', '/software · /software/inventory · /software/store', 'Installed software inventory, Winget/Chocolatey catalog, and custom package editor'],
            ['Automation', '/automation/scripts · /automation/tasks · /automation/operations · /automation/audit', 'Versioned script library, scheduled tasks, agent labels, and execution audit'],
            ['AI, Knowledge & MCP', '/knowledge · /settings/ai-cost · /settings/mcp-tools', 'Semantic pgvector Knowledge Base, per-model AI cost cockpit, and MCP tool governance'],
            ['Reports & Settings', '/reports/* · /settings/* · /deploy', 'Scheduled XLSX/CSV/MD reports, Server→Client→Site inheritance, IAM/MFA & Deploy Tokens'],
          ],
        },
        {
          type: 'cards',
          title: 'Discovery Agent Desktop UI (Wails v3)',
          items: [
            {
              title: 'Tier-1 AI Chat',
              badge: 'Assistant',
              description: 'Endpoint chat powered by authorized MCP tools, explicit privacy controls, and optional screenshot attachment.',
            },
            {
              title: 'Support & Tickets',
              badge: 'ITSM',
              description: 'Quickly open tickets automatically linked to the machine and chat live with the assigned technician.',
            },
            {
              title: 'Self-Service App Store',
              badge: 'Software',
              description: 'IT-approved software catalog allowing one-click installs without requiring local admin credentials.',
            },
            {
              title: 'Diagnostics & TPM Identity',
              badge: 'Debug',
              description: 'Inspect SYSTEM service health, active NATS/REST transport, SMBIOS UUID, TPM 2.0 Endorsement Key, and live logs.',
            },
          ],
        },
      ],
    },
    {
      id: 'clients-deploy',
      navLabel: '6. Clients, Sites & Deploy',
      badge: 'Chapter 06 · Fleet Operations',
      title: 'How to register Clients, Sites, Departments, and deploy Agents',
      lead: 'Before monitoring machines or automating apps, structure your multi-tenant hierarchy (Global → Client → Site → Agent), generate Deploy Tokens, and operate endpoints in production.',
      blocks: [
        {
          type: 'callout',
          tone: 'info',
          title: 'Why the Client → Site → Agent hierarchy matters',
          text: 'Everything in DiscoveryRMM inherits from this tree: technician RBAC permissions, patch policies, sensors, automation tasks, App Store approvals, maintenance windows, and SLA/Auto-Ticket rules. A clean Client and Site structure prevents rework at scale.',
        },
        {
          type: 'steps',
          title: 'Step-by-step: structuring tenants, locations, and deploying Agents',
          items: [
            {
              title: '1. Register the Client',
              description: 'Open Clients → New Client. Enter company name, internal identifier, primary contacts, and client-level defaults (config inheritance, optional branding, and default SLA).',
              route: 'Web Console → Clients (/clients)',
            },
            {
              title: '2. Register Sites (branches / locations)',
              description: 'Inside the Client or via Sites → New Site, create each physical or logical location (e.g., HQ, Branch Office, Remote). Configure timezone, LAN subnets for P2P caching, and local maintenance windows.',
              route: 'Web Console → Sites (/sites)',
            },
            {
              title: '3. Set up Departments, Custom Fields & Automatic Labels',
              description: 'Create Departments for ticket and AI Chat routing, Custom Fields to store asset metadata (asset tag, cost center, collector script output), and Automatic Labels to dynamically tag machines by OS, hardware, or installed software.',
              route: 'Departments (/tickets/departments) · Custom Fields (/settings/custom-fields) · Labels (/automation/agent-labels)',
            },
            {
              title: '4. Generate a Deploy Token and install on Windows endpoints',
              description: 'Under Deploy → New Token, select Client, Site, expiration, and usage limit (or unlimited for GPO/Intune). Copy the silent install command for fleet rollout. Devices with TPM 2.0 get hardware-bound identity (EK + SMBIOS UUID), enabling Zero-Touch Provisioning and automatic Post-Format Recovery.',
              route: 'Web Console → Deploy (/deploy)',
            },
            {
              title: '5. Operate the fleet from the Agents view',
              description: 'In Agents, filter by status (online/offline), client, site, or labels. Open any endpoint to inspect hardware/software inventory, real-time sensors, execution logs, quick maintenance actions, live user chat, remote debug console, and remote desktop.',
              route: 'Web Console → Agents (/agents) · Logs (/logs)',
            },
          ],
        },
      ],
    },
    {
      id: 'automation-software',
      navLabel: '7. Automation, Apps & Patches',
      badge: 'Chapter 07 · Automation & Software',
      title: 'How to install/remove apps, build automation tasks, and manage patches',
      lead: 'Automate the full software lifecycle on Windows endpoints using Winget, Chocolatey, private Custom packages, PowerShell/Batch scripts, and Windows Update policies.',
      blocks: [
        {
          type: 'table',
          caption: 'Available action types in Automation Tasks (/automation/tasks)',
          headers: ['Action Type', 'What it does on the endpoint', 'Supported sources / capabilities'],
          rows: [
            ['InstallPackage', 'Silently installs a target application on Windows (Session 0 SYSTEM or configured context).', 'Winget, Chocolatey, or corporate Custom package'],
            ['UpdatePackage', 'Updates the application if an earlier version is already installed on the device.', 'Winget, Chocolatey, or Custom package'],
            ['UpdateOrInstallPackage', 'Enforces desired state: installs if missing or upgrades if outdated.', 'Winget, Chocolatey, or Custom package'],
            ['RemovePackage', 'Silently uninstalls unauthorized or legacy software across the selected fleet.', 'Winget, Chocolatey, or Custom package'],
            ['RunScript', 'Runs a versioned script from the Library (/automation/scripts), optionally saving output to notes or a collector custom field.', 'PowerShell, Batch / CMD'],
            ['CustomCommand', 'Executes a one-off command directly without creating a reusable library script.', 'Windows Shell / CLI'],
          ],
        },
        {
          type: 'steps',
          title: 'How to create a task to install, update, or remove apps',
          items: [
            {
              title: '1. Open Automation Tasks and pick the action',
              description: 'Go to Automation → Tasks and click New Task. Enter name and description, choose the action (Install package, Update/Install, Remove package, or Run script) and source (Winget, Chocolatey, or Custom), then pick the package in the integrated picker.',
              route: 'Web Console → Automation → Tasks (/automation/tasks)',
            },
            {
              title: '2. Define Scope and Tag Targeting',
              description: 'Select the scope (Global, Client, Site, or specific Agent) and optionally refine targets with Include Tags and Exclude Tags (e.g., target "Finance" and exclude "Servers").',
              route: 'Task Modal → Scope & Tags',
            },
            {
              title: '3. Configure Triggers, Execution Order & Maintenance Window',
              description: 'Combine triggers: Immediate, Recurring (with visual Cron assistant), On User Login, or On Agent Check-In. Set executionOrder to chain prerequisites and choose whether to respect Maintenance Windows.',
              route: 'Task Modal → Triggers & Schedule',
            },
            {
              title: '4. Tune User Experience & Running Processes',
              description: 'Choose Silent execution or Toast notification (before/after) with optional defer (allowDefer), prompt timeout, and controlled closing of open processes before install/removal (e.g., chrome.exe, outlook.exe).',
              route: 'Task Modal → User Experience',
            },
            {
              title: '5. Track live runs and audit history',
              description: 'Monitor real-time status (pending, running, succeeded, failed, or user-deferred) under Operations, and inspect the full change/trigger trail under Audit.',
              route: 'Operations (/automation/operations) · Audit (/automation/audit)',
            },
          ],
        },
        {
          type: 'accordion',
          title: 'Operating related Software & Patch modules',
          items: [
            {
              summary: 'Script Library & Custom Field Collectors (/automation/scripts)',
              paragraphs: [
                'Store versioned PowerShell or Batch scripts with parameters and revision history. When attaching a script to a task, you can write stdout to the agent note or directly into a collector Custom Field (ideal for auditing licenses, local backup health, or specific registry values).',
              ],
            },
            {
              summary: 'Self-Service App Store & Custom Packages (/software/store · /software/inventory)',
              paragraphs: [
                'Software → Detailed Inventory shows all installed apps and versions across the fleet. Under Software → App Store, approve packages (Winget, Chocolatey, or private Custom installers uploaded to the server and distributed via LAN P2P) so employees can install them with one click in the Discovery Agent without local admin rights.',
              ],
            },
            {
              summary: 'Windows Patch Management (/patches)',
              paragraphs: [
                'Use Patches → Overview and Compliance to track fleet update percentage. In Policy (/patches/policy), configure auto-approval by severity (Critical, Security, Drivers) and deferral days; in Approvals (/patches/approvals) and Updates (/patches/updates), approve, block, or trigger out-of-window emergency installs.',
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'sensors-monitoring',
      navLabel: '8. Sensors, Monitoring & Reports',
      badge: 'Chapter 08 · Proactive Monitoring',
      title: 'How Sensors work, how to register them, and how to generate Reports',
      lead: 'Sensors turn the Agent into a continuous collector for health, performance, services, network, and security — evaluating thresholds locally and triggering alerts or Auto-Tickets before users notice an outage.',
      blocks: [
        {
          type: 'paragraphs',
          items: [
            'Every sensor defined on the server syncs to Agents in its scope (Global, Client, Site, or Agent). The Windows service collects metrics at the configured interval, streams readings to the server (with time-series retention and sparklines), and evaluates Warning and Critical thresholds.',
            'Possible sensor states are: OK (Passing), Warning, Critical (Failing), Unknown (No data), Pending, and Stale (no recent data when collection is overdue — never masking an existing Critical failure).',
          ],
        },
        {
          type: 'table',
          caption: 'Complete catalog of the 19 built-in and script sensor types (/sensors)',
          headers: ['Category', 'Available Sensor Types', 'Operational examples'],
          rows: [
            ['System & Hardware', 'DiskSpace, Cpu, Memory, Uptime, DiskIo, SmartStatus', 'Alert when C: exceeds 85% / 95%, detect imminent SMART disk failure, or flag servers with > 45 days uptime.'],
            ['Windows & Apps', 'Service (Windows Service), Process, EventLogRate', 'Ensure Spooler, SQL Server, or backup services stay running; watch Event Viewer error spikes.'],
            ['Network & Connectivity', 'Ping (ICMP), TcpPort, HttpProbe, HttpThroughput, DnsLatency, Bandwidth', 'Verify internal ERP responds on port 443/8443 from branch offices, track DNS latency and packet loss.'],
            ['Security & Compliance', 'CertificateExpiry, DefenderStatus, BitLocker', 'Verify BitLocker encryption on laptops, Microsoft Defender real-time protection, and expiring TLS certificates.'],
            ['Custom', 'Script (multi-channel metrics)', 'Run a PowerShell script returning numeric or boolean channels (e.g., print queue depth, profile size, VPN state).'],
          ],
        },
        {
          type: 'steps',
          title: 'Step-by-step: registering and operating Sensors',
          items: [
            {
              title: '1. Register a Built-in Sensor',
              description: 'Go to Sensors → Manage and click New Sensor. Pick the type (e.g., DiskSpace or Windows Service), select scope (Global, Client, Site, or Agent), set target (such as "C:" or "Spooler"), collection interval, and Warning/Critical thresholds.',
              route: 'Web Console → Sensors (/sensors)',
            },
            {
              title: '2. Build Script Sensors for custom metrics',
              description: 'To monitor environment-specific metrics, choose Script and open the Script Sensor Editor. Write a PowerShell script returning one or more named channels, set unit (%, MB, ms, boolean) and comparison operator per threshold.',
              route: 'Sensors → Script Sensor Editor',
            },
            {
              title: '3. Connect Notification Channels & Auto-Ticket Rules',
              description: 'Under Notifications (/settings/notifications), configure webhooks, email, or in-app alerts. Under Support → Auto-Ticket (/tickets/auto-rules), create rules to automatically open a ticket when a sensor stays Critical for N consecutive checks and auto-close/comment when it recovers.',
              route: 'Notifications (/settings/notifications) · Auto-Ticket (/tickets/auto-rules)',
            },
            {
              title: '4. Monitor the fleet and schedule executive Reports',
              description: 'Use the Sensors Fleet view to filter devices in Warning/Critical with historical sparklines. In Reports, run built-in templates (fleet health, patches, inventory, ticket SLA) or create custom templates with scheduled email delivery.',
              route: 'Reports → Templates (/reports/templates) · Schedules (/reports/schedules)',
            },
          ],
        },
      ],
    },
    {
      id: 'servicedesk-kb',
      navLabel: '9. Service Desk & Knowledge Base',
      badge: 'Chapter 09 · Service Desk & KB',
      title: 'How to operate Tickets, Service Board, SLAs & Knowledge Base',
      lead: 'DiscoveryRMM Service Desk connects your support queue directly to endpoint telemetry, live chat, remote access, and the Knowledge Base shared across technicians and Tier-1 AI Chat.',
      blocks: [
        {
          type: 'steps',
          title: 'Daily ticket handling workflow',
          items: [
            {
              title: '1. Triage on Service Board and Ticket List / Kanban',
              description: 'Open Service Board (/service-board) for a unified operational view of queues, alerts, and client health, or go to Support → Tickets (/tickets) in List or Kanban mode. Filter by department, priority, status, assignee, or SLA risk.',
              route: 'Service Board (/service-board) · Tickets (/tickets)',
            },
            {
              title: '2. Troubleshoot with full device context & Live Chat',
              description: 'Inside a ticket, immediately see the linked endpoint, recent sensors, logs, and inventory. Click Start Live Chat to message the user in real time (with Windows consent prompt and transcript saved to the ticket) or launch a Remote Access session.',
              route: 'Ticket Detail → Live Chat / Remote Access',
            },
            {
              title: '3. Speed up resolution with Macros, Templates & Runbooks',
              description: 'Apply Macros (/tickets/macros) for one-click standardized replies + status updates + assignment. Configure Ticket Templates (/tickets/templates) for structured intake and attach Runbooks to guide L1/L2 technicians.',
              route: 'Templates (/tickets/templates) · Macros (/tickets/macros)',
            },
            {
              title: '4. Configure SLAs, Business Calendars, Workflow Profiles & CSAT',
              description: 'Under SLA, Calendars & Profiles (/tickets/sla), set first-response and resolution targets aligned with each client’s business hours. Customize states in Workflow Profiles (/settings/workflow-profiles) and track user ratings under CSAT (/tickets/csat).',
              route: 'SLA (/tickets/sla) · Workflow (/settings/workflow-profiles) · CSAT (/tickets/csat)',
            },
          ],
        },
        {
          type: 'steps',
          title: 'How to operate the Knowledge Base (/knowledge)',
          items: [
            {
              title: '1. Author articles and nested page trees',
              description: 'Open Support → Knowledge (/knowledge) to write operational manuals, troubleshooting guides, and FAQs. Articles support structured editing, attached images, and hierarchical subpage trees.',
              route: 'Web Console → Knowledge (/knowledge)',
            },
            {
              title: '2. Control visibility and link to Runbooks & AI Chat',
              description: 'Separate internal articles (technician-only runbooks linked to tickets) from end-user articles (visible in the Discovery Agent Knowledge Base tab and indexed to ground Tier-1 AI Chat answers).',
              route: 'Article Editor → Visibility & Categories',
            },
          ],
        },
      ],
    },
    {
      id: 'modules',
      navLabel: '10. Module Configuration',
      badge: 'Chapter 10 · Configuration',
      title: 'How to configure each module & scope inheritance',
      lead: 'DiscoveryRMM uses hierarchical Server → Client → Site inheritance with provenance tracking. Learn how to configure every module.',
      blocks: [
        {
          type: 'callout',
          tone: 'tip',
          title: 'Inheritance & Effective Configuration',
          text: 'Open Settings → Effective (/settings/effective) to inspect the exact provenance of every setting (Server, Client, Site, or Locked). Blank fields automatically inherit from the parent level.',
        },
        {
          type: 'accordion',
          title: 'Module-by-module configuration guide',
          items: [
            {
              summary: '1. IAM, Authentication & MFA (FIDO2 / TOTP)',
              paragraphs: [
                'Go to Settings → Authentication & IAM to manage Roles, granular permissions (ResourceType/ActionType), and scopes (Global, Client, Site, or Agent).',
                'Enforce FIDO2/WebAuthn or TOTP for admin accounts. Default password policy requires 12+ characters with uppercase, number, and symbol.',
              ],
              route: '/identity/authentication',
            },
            {
              summary: '2. Deploy Tokens & Agent Rollout',
              paragraphs: [
                'Create a Deploy Token at /deploy bound to a specific Client and Site (and optional Department).',
                'Set expiration and usage limits, then pass the generated command to the NSIS installer or Zero-Touch script.',
              ],
              route: '/deploy',
            },
            {
              summary: '3. Remote Access, Consent & LAN Proxy Policy',
              paragraphs: [
                'In Settings → Remote Access, configure per-kind concurrency caps (default 5), session recording, and end-user consent rules.',
                'In the LAN Proxy tab (/settings/proxy-policy), configure RemoteAccess:Proxy:DefaultAllowlist and AllowedPorts. Proxy is fail-closed when the allowlist is empty.',
              ],
              route: '/settings/remote-access',
            },
            {
              summary: '4. Sensors & Auto-Ticket Engine',
              paragraphs: [
                'Blocking prerequisite: ensure every Client (or global scope) has at least one Workflow State with IsFinal = true so AutoTicketResolutionService can close resolved tickets.',
                'Configure scope policy at /tickets/auto-policy (per-client kill switch, AI mode Off/Suggest/AutoApply) and rules at /tickets/auto-rules. Always run "Simulate (dry-run)" before enabling.',
              ],
              route: '/tickets/auto-policy',
            },
            {
              summary: '5. AI Providers, Knowledge Base & MCP Tools',
              paragraphs: [
                'Configure your AI provider (OpenRouter, OpenAI-compatible API, or local Ollama) and track per-model spend in /settings/ai-cost.',
                'In /settings/mcp-tools, allowlist only the MCP tools AI may invoke on endpoints and enable pgvector embeddings for Knowledge Base semantic search.',
              ],
              route: '/settings/mcp-tools',
            },
            {
              summary: '6. Patches, App Store, Automation & Custom Fields',
              paragraphs: [
                'Set IANA maintenance windows and patch approval policies at /patches/policy. Manage Winget/Chocolatey catalogs and custom packages at /software/store.',
                'Custom fields (/settings/custom-fields) flagged as secret are excluded from the MDZ_CUSTOM_FIELDS environment variable during script execution.',
              ],
              route: '/patches/policy',
            },
            {
              summary: '7. Notifications, Branding & Database Maintenance',
              paragraphs: [
                'Configure Email (SMTP), Webhooks, and Web Push channels at /settings/notifications, and customize tenant branding at /settings/branding.',
                'Set log/telemetry retention and cleanup schedules at /settings/database-maintenance.',
              ],
              route: '/settings/notifications',
            },
          ],
        },
      ],
    },
    {
      id: 'integrations',
      navLabel: '11. Internal Integrations',
      badge: 'Chapter 11 · Internal Integrations',
      title: 'How internal modules integrate with one another',
      lead: 'DiscoveryRMM connects telemetry, ticketing, AI, automation, and security into automated cross-module pipelines.',
      blocks: [
        {
          type: 'table',
          caption: 'Core cross-module integration pipelines',
          headers: ['Pipeline', 'Participating Modules', 'How it works'],
          rows: [
            [
              'Alert → Auto-Ticket → AI → Resolution',
              'Sensors + Auto-Tickets + Workflow + AI/KB + Notifications',
              'A sensor breaches its minimum failure duration → rule checks deduplication → opens a ticket in the client Workflow → AI queries KB (pgvector) to suggest/apply a fix → when the sensor recovers, the ticket closes in IsFinal state.',
            ],
            [
              'Multi-tenancy → Deploy → NATS ACL',
              'Clients/Sites + Deploy Tokens + Auth Callout + JetStream',
              'Deploy Token binds the agent to a Client/Site → Ed25519 Auth Callout issues a NATS JWT scoped strictly to that tenant’s subjects and JetStream streams.',
            ],
            [
              'IAM → Remote Session → Agent Guards',
              'IAM/RBAC + RemoteSessions + Consent + Agent Core',
              'Rights such as NoProxy=64 and NoRdp=128 translate into NATS session ACLs and 60s tunnel tickets; the agent enforces consent, SSRF allowlists, and fail-closed Registry/Terminal guards.',
            ],
            [
              'App Store / Automation → P2P Mesh',
              'Software Store + Automation + P2P Bootstrap + libp2p',
              'When deploying large packages across a Site, agents exchange manifests via /p2p/bootstrap and replicate SHA-256 verified chunks over the LAN.',
            ],
            [
              'Config Inheritance → Agent Runtime',
              'Server/Client/Site Config + Effective + Agent /me/configuration',
              'Console updates recompute effective policy; agents sync via /me/configuration and enable or hide UI capabilities without restarting the service.',
            ],
          ],
        },
      ],
    },
    {
      id: 'guides',
      navLabel: '12. End-to-End Guides',
      badge: 'Chapter 12 · User Manuals',
      title: 'End-to-End Guides: Installer, Operator & End User',
      lead: 'Step-by-step operational playbooks for the infrastructure installer, the daily IT operator, and the Windows workstation user.',
      blocks: [
        {
          type: 'steps',
          title: 'Guide 1 — For the Installer (SysAdmin / Infrastructure)',
          items: [
            {
              title: '1. Provision the Linux server with Bootstrap',
              description: 'Run the bootstrap script on the release channel and verify PostgreSQL + pgvector, NATS JetStream, and Redis.',
            },
            {
              title: '2. Configure HTTPS & WSS on your Reverse Proxy',
              description: 'Serve the Web Console/API over HTTPS (443) and proxy WebSocket upgrades on /nats (wss://).',
            },
            {
              title: '3. Complete first login and MFA enrollment',
              description: 'Sign in with admin / Mudar@123, set a strong 12+ char password, and register a FIDO2 key or TOTP app.',
            },
            {
              title: '4. Configure backups, storage & recovery',
              description: 'Schedule PostgreSQL backups, set retention in /settings/database-maintenance, and test --recover-admin in staging.',
            },
          ],
        },
        {
          type: 'steps',
          title: 'Guide 2 — For the Operator (IT Technician / NOC / Service Desk)',
          items: [
            {
              title: '1. Structure Clients, Sites & Departments',
              description: 'Create clients and sites in /clients and configure departments plus Workflow states (including at least one IsFinal = true state).',
            },
            {
              title: '2. Generate Deploy Tokens & roll out Windows Agents',
              description: 'Create per-Site tokens in /deploy, deploy the .exe installer to endpoints, and verify online heartbeats in /agents.',
            },
            {
              title: '3. Enable Sensors, Patches & Auto-Tickets safely',
              description: 'Attach disk/CPU/service sensors, define patch policies, and run Auto-Ticket dry-run simulations before going live.',
            },
            {
              title: '4. Resolve incidents from the Service Board',
              description: 'Review AI triage suggestions, run remediation scripts from Automation, or launch a Remote Session (Screen, ConPTY, Files, Registry, LAN Proxy, or WebRDP).',
            },
          ],
        },
        {
          type: 'steps',
          title: 'Guide 3 — For the End User (Employee on Windows)',
          items: [
            {
              title: '1. Find Discovery Agent in the system tray',
              description: 'The tray icon near the Windows clock shows connection health and gives one-click access to IT support.',
            },
            {
              title: '2. Ask Tier-1 AI Chat first',
              description: 'Describe your issue in AI Chat. You control whether to attach a screenshot and can see whenever diagnostic MCP tools are used.',
            },
            {
              title: '3. Track tickets & install approved apps',
              description: 'Open a support ticket with live technician chat when needed, or install IT-approved software from the App Store without admin passwords.',
            },
            {
              title: '4. Approve or decline Remote Access requests',
              description: 'When consent policy is active, a prompt asks for your approval before a technician can view or control your screen, with a visible active-session banner.',
            },
          ],
        },
      ],
    },
  ],
};
