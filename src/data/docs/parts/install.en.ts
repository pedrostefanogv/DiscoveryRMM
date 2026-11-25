import type { DocSection } from '../types';

/**
 * Part 1 — Installation & Deployment (en-US).
 * Chapters 1.1 to 1.12.
 */
export const installEnSections: DocSection[] = [
  {
    id: 'overview',
    part: 'install',
    navLabel: '1.1. Overview & architecture',
    badge: 'Part 1 · Chapter 1 · Architecture',
    title: 'How DiscoveryRMM works end to end',
    lead: 'Meet the four components of the ecosystem, the real-time transport, and which of the three documentation parts to follow for your role.',
    blocks: [
      {
        type: 'paragraphs',
        items: [
          'DiscoveryRMM is built from four decoupled layers: the Central Server (.NET 10 / ASP.NET Core), the Web Console (React 19 + TypeScript + Vite PWA), the Windows Discovery Agent (Go + Wails v3) and the data and messaging infrastructure (PostgreSQL 15+ with pgvector, NATS 2.x with JetStream, Redis and local/MinIO/S3 object storage).',
          'This documentation is organized in three parts so you read only what you need: Installation (whoever brings up the server and registers the structure), Operations (whoever runs the fleet day to day) and Support & End User (whoever handles tickets and whoever uses the Agent on the workstation).',
        ],
      },
      {
        type: 'cards',
        title: 'Pick your starting point',
        items: [
          {
            title: 'Part 1 — Installation & Deployment',
            badge: 'Infrastructure',
            description: 'Requirements, Linux server, Web Console, client and site setup, custom fields, deploy, minimal installer and zero-touch.',
            meta: 'Start with Part 1 →',
            href: '#/docs/requirements',
          },
          {
            title: 'Part 2 — Fleet Operations',
            badge: 'NOC / IT',
            description: 'Agent fleet, automatic labels, remote access, scripts, automation, software, patches, sensors, reports, tickets and AI.',
            meta: 'Go to Part 2 →',
            href: '#/docs/interface',
          },
          {
            title: 'Part 3 — Support & End User',
            badge: 'Service Desk',
            description: 'Support chat, the end-user guide, per-module configuration with scope inheritance, troubleshooting and end-to-end guides.',
            meta: 'Go to Part 3 →',
            href: '#/docs/support-chat',
          },
        ],
      },
      {
        type: 'code',
        title: 'Communication topology and canonical subjects',
        language: 'text',
        snippet: `Discovery Agent (Windows) ──► POST /api/v1/agent-install/register (Deploy Token)
                           ◄── { agentId, token: "mdz_...", clientId, siteId }
                           ──► GET  /api/v1/agent-auth/me/configuration
                           ◄── { natsServerHost, natsUseWssExternal, policies }
                           ──► NATS Auth Callout ($SYS.REQ.USER.AUTH · Ed25519)
                           ◄── dynamic JWT with tenant-scoped ACL

Web Console (React PWA)  ──► HTTPS REST + SSE  ──► API
                         ──► wss://host/nats   ──► NATS (real time)

Canonical subjects:
  tenant.{clientId}.site.{siteId}.agent.{agentId}.{command|heartbeat|result|...}
  tenant.{clientId}.site.{siteId}.agent.{agentId}.remote.session.{sessionId}.{frame|event|control}

JetStream streams per tenant:
  DISCOVERY_FANOUT_COMMANDS_{clientId}   ·   DISCOVERY_SUPPORT_CHAT_{clientId}`,
      },
      {
        type: 'table',
        caption: 'Release channels and environment policy',
        headers: ['Channel / Branch', 'Audience', 'Behaviour', 'Recommendation'],
        rows: [
          ['release (Stable)', 'Production', 'Only validated, tested code', 'Default for production servers and agents'],
          ['beta', 'Pre-production', 'New features in final validation', 'Validate in a pilot environment before rollout'],
          ['lts', 'Long-Term Support', 'Stability and critical fixes only', 'Environments with strict change windows'],
          ['dev', 'Staging / Developers', 'Active development and CI', 'Never use it directly in production'],
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Hierarchy is the backbone of the platform',
        text: 'Almost everything inherits from Global → Client → Site → Agent: permissions, patch policies, sensors, automation, App Store catalogue, maintenance windows and SLA rules. Structure Clients and Sites well in Part 1 and all of Part 2 becomes simple.',
      },
    ],
  },
  {
    id: 'requirements',
    part: 'install',
    navLabel: '1.2. Requirements, ports & network',
    badge: 'Part 1 · Chapter 2 · Prerequisites',
    title: 'System requirements, dependencies and port matrix',
    lead: 'Confirm minimum requirements for the Linux server and Windows endpoints, plus the network ports, before you start deploying.',
    blocks: [
      {
        type: 'table',
        caption: 'Central Server and infrastructure requirements',
        headers: ['Component', 'Requirement / Version', 'Notes'],
        rows: [
          ['Operating System', 'Ubuntu 22.04/24.04 or Debian 12+ (x64/arm64)', 'Linux bootstrap script with root or sudo access'],
          ['API Runtime', '.NET 10 SDK / ASP.NET Core', 'Installed automatically by the bootstrap script'],
          ['Database', 'PostgreSQL 15+ with the pgvector extension', 'Single mandatory provider in production; pgvector enables semantic search'],
          ['Messaging', 'NATS Server 2.x with JetStream', 'Internal TCP 4222 and WebSocket TLS (wss://host/nats) for Console/external agents'],
          ['Cache', 'Redis 7+ (recommended in production)', 'Agent presence, RBAC cache and FIDO2/WebAuthn state'],
          ['Object Storage', 'Local disk, MinIO or S3-compatible', 'Attachments, custom packages, recordings and reports'],
        ],
      },
      {
        type: 'table',
        caption: 'Windows endpoint requirements (Discovery Agent)',
        headers: ['Item', 'Specification', 'Details'],
        rows: [
          ['Operating System', 'Windows 10, Windows 11 or Windows Server (x86/x64)', 'Install via NSIS (.exe) or Zero-Touch (unattend/GPO/Intune)'],
          ['UI Runtime', 'Microsoft Edge WebView2 Runtime', 'Included in the installer flow; used only by discovery-agent.exe'],
          ['Hardware Identity', 'TPM 2.0 + SMBIOS UUID (recommended)', 'Endpoint fingerprint and post-format recovery'],
          ['Privileges', 'Installer requires Administrator; service runs as SYSTEM', 'The UI Companion runs in the interactive user session'],
          ['Windows Firewall', 'Automatic rules for domain/private profiles', 'Only needed when P2P sharing (mDNS/UDP) is enabled on the LAN'],
        ],
      },
      {
        type: 'table',
        caption: 'Port and network endpoint matrix',
        headers: ['Service', 'Default port / URL', 'Direction', 'Purpose'],
        rows: [
          ['API Dev (Kestrel)', 'http://0.0.0.0:5288', 'Console/Agent → API', 'Default development port'],
          ['Web Console Dev', 'http://localhost:5173', 'Browser → Vite', 'Automatic /api proxy to :5288'],
          ['Production HTTPS', 'https://your-domain (443)', 'External → Reverse Proxy', 'Terminates TLS for API, Console and wss://your-domain/nats'],
          ['NATS Server', '4222 (TCP) / wss://host/nats', 'Agent & Console → NATS', 'Real-time messaging and remote sessions'],
          ['PostgreSQL', '5432', 'API → Database', 'Relational persistence + pgvector embeddings'],
          ['Redis', '6379', 'API → Cache', 'Presence, RBAC and FIDO2'],
          ['Local RDP tunnel', '127.0.0.1:{ephemeral port}', 'Loopback on Agent/Viewer', 'RDP locked to loopback over NATS'],
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Do not use SQLite on the server',
        text: 'DiscoveryRMM refuses SQLite at runtime: PostgreSQL 15+ with the pgvector extension is mandatory. Install the pgvector package on the database host and enable it with CREATE EXTENSION IF NOT EXISTS vector; on the configured database.',
      },
    ],
  },
  {
    id: 'server-install',
    part: 'install',
    navLabel: '1.3. Server installation',
    badge: 'Part 1 · Chapter 3 · Server setup',
    title: 'How to install the server (Linux bootstrap or manual)',
    lead: 'A complete walkthrough to bring DiscoveryRMM up in production using the Linux bootstrap or manually from source.',
    blocks: [
      {
        type: 'steps',
        title: 'Method A — Fast production install (Linux Bootstrap)',
        items: [
          {
            title: '1. Prepare the Ubuntu/Debian host',
            description: 'Log in as root or a user with sudo and make sure outbound HTTPS to GitHub and the distribution repositories works.',
          },
          {
            title: '2. Run the Bootstrap Wizard',
            description: 'The script clones the repository, installs .NET 10, PostgreSQL + pgvector, NATS 2.x and Redis, and configures the systemd services.',
            code: 'bash -c "$(curl -fsSL https://raw.githubusercontent.com/pedrostefanogv/DiscoveryRMM_API/release/scripts/linux/bootstrap_install_discovery.sh)"',
          },
          {
            title: '3. Choose the release channel',
            description: 'In the wizard select option 2 (release — stable). For unattended automation, use the DISCOVERY_RELEASE_CHANNEL variable.',
            code: 'DISCOVERY_RELEASE_CHANNEL=release bash -c "$(curl -fsSL https://raw.githubusercontent.com/pedrostefanogv/DiscoveryRMM_API/release/scripts/linux/bootstrap_install_discovery.sh)"',
          },
          {
            title: '4. Validate the health check',
            description: 'Confirm that GET /health returns 200 OK and open /scalar/v1 to inspect the REST endpoints.',
          },
        ],
      },
      {
        type: 'steps',
        title: 'Method B — Manual install from source',
        items: [
          {
            title: '1. Clone and restore the solution',
            description: 'Download the official repository and restore the solution packages.',
            code: 'git clone https://github.com/pedrostefanogv/DiscoveryRMM_API.git\ncd DiscoveryRMM_API\ndotnet restore Discovery.slnx',
          },
          {
            title: '2. Configure appsettings.Development.json',
            description: 'Copy the example file and fill in the PostgreSQL connection string (with pgvector), the NATS URL/NKeys and Redis.',
            code: 'cp src/Discovery.Api/appsettings.Development.json.example src/Discovery.Api/appsettings.Development.json',
          },
          {
            title: '3. Run the migrations',
            description: 'FluentMigrator creates the schema, pgvector indexes, workflow states, permissions and the initial admin user.',
            code: 'dotnet run --project src/Discovery.Api -- --migrate',
          },
          {
            title: '4. Start the API and the Web Console',
            description: 'The API listens on :5288; the Web Console runs on Vite at port 5173 with a proxy to /api.',
            code: 'dotnet run --project src/Discovery.Api\n# In another terminal (DiscoveryRMM_Site):\nnpm install && npm run dev',
          },
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Mandatory first login',
        text: 'After the migrations, sign in to the Console with user "admin" and the default password "Mudar@123". On first access the system requires a password change (12+ characters, uppercase, number and symbol), a profile update and MFA enrolment (FIDO2/WebAuthn or TOTP).',
      },
      {
        type: 'accordion',
        title: 'Common installation troubleshooting',
        items: [
          {
            summary: 'API fails to start: vector / pgvector extension not found',
            paragraphs: [
              'The server requires PostgreSQL 15+ with pgvector installed on the target database.',
              'Install the postgresql-<version>-pgvector package on the database host and run CREATE EXTENSION IF NOT EXISTS vector;',
            ],
          },
          {
            summary: 'Web Console or external Agent cannot reach NATS over WSS',
            paragraphs: [
              'Make sure the reverse proxy forwards Upgrade and Connection: upgrade to /nats, with a long WebSocket timeout.',
              'Check Nats:ServerPublicKey (Ed25519 trust list) in appsettings.json so the Auth Callout can validate the requests.',
            ],
          },
          {
            summary: 'Migrations applied to the wrong database',
            paragraphs: [
              'Confirm the connection string before running --migrate: there is a single provider and no silent fallback.',
              'In production, always run migrations in staging first and keep the same-day pg_dump.',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'server-maintenance',
    part: 'install',
    navLabel: '1.4. Update, backup & recovery',
    badge: 'Part 1 · Chapter 4 · Maintenance',
    title: 'Update, back up and recover the server',
    lead: 'The central server never updates itself. Here is the safe cycle for updates, backup/restore and administrative access recovery.',
    blocks: [
      {
        type: 'callout',
        tone: 'warning',
        title: 'Server updates are always manual',
        text: 'Unlike the Windows Agent (which self-updates), the central server never updates on its own. Validate the version in staging and only then run the installer with --mode update in production.',
      },
      {
        type: 'code',
        title: 'Updating a server installed by the script',
        language: 'bash',
        snippet: `# 1. Backup before any change
pg_dump -Fc discovery > /backup/discovery-$(date +%F-%H%M).dump

# 2. Update (applies pending migrations and restarts the services)
./scripts/linux/install_discovery_server.sh --mode update

# 3. Validate
curl -fsS https://your-domain/health
systemctl status discovery-api discovery-nats --no-pager`,
      },
      {
        type: 'code',
        title: 'Administrator recovery (lost access)',
        language: 'bash',
        snippet: `# Resets the admin password, forces a change on next login,
# revokes every session and clears registered MFA factors:
dotnet run --project src/Discovery.Api -- --recover-admin

# Safe mode, without writing the password to shell history:
echo "NewStrongPassword@2026" | dotnet run --project src/Discovery.Api -- --recover-admin --password-stdin`,
      },
      {
        type: 'table',
        caption: 'Recommended minimum maintenance routine',
        headers: ['Item', 'Frequency', 'How'],
        rows: [
          ['PostgreSQL backup', 'Daily + before updates', 'pg_dump -Fc and a copy outside the host'],
          ['Object storage backup', 'Daily', 'Attachments, custom packages and recordings (disk/MinIO/S3)'],
          ['Log and series retention', 'One-time setup', 'Settings → Database maintenance (/settings/database-maintenance)'],
          ['Restore drill', 'Quarterly', 'Restore the dump in a staging host and validate /health'],
          ['Key/NKey rotation', 'Yearly or after an incident', 'Update Nats:ServerPublicKey and restart API + NATS'],
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Default data retention',
        text: 'Raw sensor samples are kept for 7 days, events for 90 days and hourly/daily rollups for 400 days. The current state of each sensor is never deleted. Adjust this in /settings/database-maintenance according to your audit policy.',
      },
    ],
  },
  {
    id: 'console-access',
    part: 'install',
    navLabel: '1.5. Web Console, HTTPS & first access',
    badge: 'Part 1 · Chapter 5 · Console access',
    title: 'Publish the Web Console over HTTPS/WSS and unlock the first access',
    lead: 'Configure the reverse proxy, validate the NATS WebSocket and complete identity onboarding (password, profile, MFA and roles).',
    blocks: [
      {
        type: 'steps',
        title: 'Publication and first access sequence',
        items: [
          {
            title: '1. Publish the Web Console',
            description: 'Build the DiscoveryRMM_Site production bundle and serve the static files through the same domain as the API (avoids CORS and simplifies WSS).',
            code: 'npm ci && npm run build   # generates dist/',
          },
          {
            title: '2. Terminate TLS and forward the NATS WebSocket',
            description: 'On the reverse proxy, expose 443 for API/Console and forward /nats with WebSocket Upgrade. Without it the Console falls back to SSE and remote sessions become unavailable.',
          },
          {
            title: '3. First login and password change',
            description: 'Sign in with admin / Mudar@123. The system requires a password change (12+ characters), a profile update and MFA enrolment.',
            route: 'https://your-domain/auth/login',
          },
          {
            title: '4. Register MFA and review roles',
            description: 'Enrol FIDO2/WebAuthn or TOTP and create the technician accounts in /identity/access with roles and scope (Global, Client, Site).',
            route: 'Settings → Identity and Access (/identity/access)',
          },
        ],
      },
      {
        type: 'code',
        title: 'Reverse proxy example (Nginx) with HTTPS + WSS',
        language: 'nginx',
        snippet: `server {
  listen 443 ssl http2;
  server_name your-domain;

  ssl_certificate     /etc/letsencrypt/live/your-domain/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/your-domain/privkey.pem;

  # API + Web Console
  location / {
    proxy_pass http://127.0.0.1:5288;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $remote_addr;
  }

  # NATS over WebSocket (needs Upgrade and a long timeout)
  location /nats {
    proxy_pass http://127.0.0.1:8222;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_read_timeout 3600s;
    proxy_send_timeout 3600s;
  }
}`,
      },
      {
        type: 'table',
        caption: 'What the first access requires',
        headers: ['Step', 'Rule', 'Where'],
        rows: [
          ['Password change', '12+ characters, uppercase, number and symbol', '/auth/first-access'],
          ['Profile', 'Technician name, e-mail and contact details', '/identity/authentication'],
          ['MFA', 'FIDO2/WebAuthn or TOTP mandatory for administrative accounts', '/auth/mfa/register'],
          ['Roles and scope', 'RBAC by ResourceType/ActionType with Global/Client/Site scope', '/identity/roles'],
        ],
      },
      {
        type: 'image',
        file: 'console-login.png',
        alt: 'DiscoveryRMM Web Console sign-in screen',
        caption: 'First access: the Console requires a password change, a profile update and MFA enrolment before unlocking the modules.',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Branding',
        text: 'Logo, colours and display name in the Console and the Agent are configured in Settings → Branding (/settings/branding). Client branding can override the global value through configuration inheritance.',
      },
    ],
  },
  {
    id: 'client-setup',
    part: 'install',
    navLabel: '1.6. Client setup',
    badge: 'Part 1 · Chapter 6 · Fleet operations',
    title: 'How to register a Client (tenant) in DiscoveryRMM',
    lead: 'The Client is the tenant isolation boundary: everything you create later (sites, agents, sensors, automation, tickets) lives inside a Client.',
    blocks: [
      {
        type: 'steps',
        title: 'Client registration walkthrough',
        items: [
          {
            title: '1. Open Clients and click New Client',
            description: 'Provide the trading name, legal name and an internal identifier (code/slug) used in reports and integrations.',
            route: 'Web Console → Clients (/clients)',
          },
          {
            title: '2. Fill in contacts and billing data',
            description: 'Register the primary contact, phone, e-mail and contract data. This information appears in reports and in exported report headers.',
          },
          {
            title: '3. Define the Client default policies',
            description: 'Default SLA, maintenance window, sensor thresholds, patch policy and remote access consent policy. Blank fields inherit from the Global scope.',
            route: 'Settings → Client (/settings/client)',
          },
          {
            title: '4. Configure branding and technician access',
            description: 'Customise the tenant logo/colours and link the technicians who may work on this Client with the correct scope.',
            route: 'Settings → Branding (/settings/branding) · Identity (/identity/access)',
          },
          {
            title: '5. Confirm the effective configuration',
            description: 'Use the effective view to see where each parameter came from (Global, Client, Site or Locked) before deploying agents.',
            route: 'Settings → Effective (/settings/effective)',
          },
        ],
      },
      {
        type: 'table',
        caption: 'Client registration fields and decisions',
        headers: ['Item', 'Purpose', 'Practical tip'],
        rows: [
          ['Name / Legal name', 'Tenant identification across the Console', 'Use exactly the contract name'],
          ['Internal identifier', 'Stable key for integrations and reports', 'Alphanumeric, no spaces (e.g. acme-sp)'],
          ['Contacts', 'Communication during incidents and reports', 'Register at least one technical and one management contact'],
          ['Default SLA', 'First response and resolution targets', 'Applies to every site of the client; can be overridden'],
          ['Ticket workflow', 'States and transitions used by tickets', 'Make sure there is at least one final state (IsFinal = true)'],
          ['Branding', 'Visual identity in the Client screens', 'Optional; inherits the global value when empty'],
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Auto-Ticket prerequisite',
        text: 'Each Client (or the Global scope) must have at least one Workflow State with IsFinal = true. Without it, the Auto-Ticket engine can open tickets but cannot close them when the sensor recovers.',
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Cascading inheritance',
        text: 'Global → Client → Site → Agent. Configure what is common in Global, what is contract-specific in the Client and what is local in the Site. The Effective screen shows the final applied value and its origin.',
      },
    ],
  },
  {
    id: 'site-setup',
    part: 'install',
    navLabel: '1.7. Sites, departments & hierarchy',
    badge: 'Part 1 · Chapter 7 · Structure',
    title: 'Register Sites, Departments and organise the hierarchy',
    lead: 'Sites represent physical or logical locations and define LAN P2P caching, maintenance windows and policy scope. Departments route tickets and the AI Chat.',
    blocks: [
      {
        type: 'steps',
        title: 'Site registration walkthrough',
        items: [
          {
            title: '1. Create the Site inside the Client',
            description: 'In Sites → New Site (or from the Client detail), provide the unit name, internal code and owning Client.',
            route: 'Web Console → Sites (/sites) · Client → Sites (/clients/:id)',
          },
          {
            title: '2. Configure time zone and maintenance window',
            description: 'The Site IANA time zone drives maintenance windows, SLA and report schedules. The window keeps restarts and installs out of business hours.',
          },
          {
            title: '3. Provide the local subnets',
            description: 'Subnets let agents in the same Site discover each other over mDNS/UDP and share packages on the LAN (P2P), saving WAN bandwidth.',
          },
          {
            title: '4. Adjust local policies',
            description: 'Override in the Site only what differs from the Client: window, sensors, patch policy, remote consent and store catalogue.',
            route: 'Settings → Site (/settings/site)',
          },
          {
            title: '5. Repeat for every unit',
            description: 'Standardise the internal code (e.g. acme-sp-hq, acme-rj-branch) to make filters, reports and automation scoping easier.',
          },
        ],
      },
      {
        type: 'table',
        caption: 'When to create a new Site (and when not to)',
        headers: ['Scenario', 'Recommendation', 'Reason'],
        rows: [
          ['Branch with its own link and subnet', 'Create a Site', 'Enables local P2P cache and a dedicated maintenance window'],
          ['Home office / remote user', 'Create a single "Home Office" Site', 'Keeps the tree clean and policies predictable'],
          ['Servers in a datacenter', 'Create a "Datacenter" Site', 'Allows off-hours windows and a stricter patch policy'],
          ['Departments inside the same headquarters', 'Do not create a Site; use Departments', 'A Department is ticket routing, not a physical location'],
        ],
      },
      {
        type: 'accordion',
        title: 'Departments: purpose and configuration',
        items: [
          {
            summary: 'Ticket routing and visibility',
            paragraphs: [
              'Departments (e.g. Finance, IT, HR) route tickets, define default queues and restrict who sees what.',
              'A technician with access to a department sees its tickets; the department also participates in Auto-Ticket rules and in the AI Chat context.',
            ],
            route: '/tickets/departments',
          },
          {
            summary: 'Default assignment and department custom fields',
            paragraphs: [
              'You can set a default assignee and use scope-specific custom fields to enrich the ticket (cost centre, asset tag, affected system).',
              'Client/Site/Agent custom fields can also be used as conditions in Automatic Labels (see chapter 2.3).',
            ],
            route: '/tickets/departments/:departmentId',
          },
          {
            summary: 'Scope inheritance',
            paragraphs: [
              'The chain is Global → Client → Site. Departments do not take part in server configuration inheritance: they act in the service desk domain.',
            ],
            route: '/settings/effective',
          },
        ],
      },
      {
        type: 'code',
        title: 'Example of internal codes to standardise the tree',
        language: 'text',
        snippet: `acme                 (Client)
├── acme-sp-hq           (Site · America/Sao_Paulo · 10.10.0.0/16)
├── acme-sp-dc           (Site · America/Sao_Paulo · 10.20.0.0/16)
├── acme-rj-branch       (Site · America/Sao_Paulo · 10.30.0.0/16)
├── acme-home-office     (Site · America/Sao_Paulo · no P2P)
└── acme-datacenter      (Site · America/Sao_Paulo · window 01:00-05:00)`,
      },
    ],
  },
  {
    id: 'custom-fields',
    part: 'install',
    navLabel: '1.8. Custom fields',
    badge: 'Part 1 · Chapter 8 · Metadata',
    title: 'Custom fields: store and collect endpoint data',
    lead: 'Custom fields are the canonical way to store metadata per Client, Site or Agent — including values collected automatically by scripts, such as the AnyDesk or TeamViewer ID.',
    blocks: [
      {
        type: 'paragraphs',
        items: [
          'Each field definition has a scope (Agent, Client or Site), a data type (Text, Integer, Decimal, Date, DateTime, Boolean, Dropdown or List) and a set of capabilities that define who may read and write it.',
          'Capabilities are the heart of the security model: agentRead lets a script read the value from the MDZ_CUSTOM_FIELDS variable; agentWrite lets a script write it back; webRead shows the value in the Console; webEdit allows support to edit it; runtimeAccessMode controls whether the field is available to any script runtime or only to linked scripts.',
        ],
      },
      {
        type: 'table',
        caption: 'Custom field capabilities',
        headers: ['Capability', 'Effect', 'When to use'],
        rows: [
          ['agentRead', 'Script receives the value in MDZ_CUSTOM_FIELDS (JSON)', 'Scripts that need context (e.g. reuse the AnyDesk ID)'],
          ['agentWrite', 'Script may write via MDZ_COLLECT (Agent scope only)', 'Automatic collection of inventory and identifiers'],
          ['webRead', 'Value appears in the detail cards (Agent/Client/Site)', 'Visibility for the IT team'],
          ['webEdit', 'Support edits the value in the Console', 'Operational data: asset tag, cost centre'],
          ['runtimeAccessMode', 'Disabled · Public · RestrictedTaskScript', 'Restrict sensitive fields to linked scripts only'],
          ['isPinned', 'Highlights the field in the agent "Information" card', 'Values looked up every day'],
          ['defaultValueJson', 'Default value when the entity has no value', 'Avoids empty fields on new agents'],
        ],
      },
      {
        type: 'steps',
        title: 'Creating a field definition',
        items: [
          {
            title: '1. Open Custom fields',
            description: 'Click New field, choose the scope (Agent, Client or Site) and provide the key, label and description. The key is the identifier used in scripts and tasks.',
            route: 'Settings → Custom fields (/settings/custom-fields)',
          },
          {
            title: '2. Choose type, options and default value',
            description: 'For lists, provide the options. Also set the default value when you want new agents to be created already populated.',
          },
          {
            title: '3. Apply a capability preset',
            description: 'Ready-made presets: Script only, Pure collector, Agent bidirectional, Support manual and Complete. Fine-tune afterwards if needed.',
          },
          {
            title: '4. Mark it as secret (if applicable)',
            description: 'Secret fields never appear in clear text in the Console, are never copied and are omitted from the MDZ_CUSTOM_FIELDS JSON.',
          },
          {
            title: '5. Use it in scripts, tasks and labels',
            description: 'Once created, the field is available for [[campo:key]] interpolation, collector tasks, reports and as a condition in Automatic Labels.',
            route: 'Automation → Scripts (/automation/scripts) · Labels (/automation/agent-labels)',
          },
        ],
      },
      {
        type: 'code',
        title: 'Read and write contract used by scripts',
        language: 'powershell',
        snippet: `# READ: the agent injects the JSON of runtime-enabled fields
$fields = $env:MDZ_CUSTOM_FIELDS | ConvertFrom-Json
if ($fields.asset_tag) {
  Write-Output "Asset tag configured: $($fields.asset_tag)"
}

# WRITE (agentWrite, Agent scope only): one line per collected value
# MDZ_COLLECT: {"name":"field_key","value":"value"}

# INTERPOLATION in the command, the arguments and the script body
# [[campo:anydesk_id]]  -> replaced by the current field value`,
      },
      {
        type: 'code',
        title: 'Real example: collect the AnyDesk ID and TeamViewer ID into custom fields',
        language: 'powershell',
        snippet: `# Automation task -> Action "Run script" -> enable "Collector task"
# Destination fields: anydesk_id and teamviewer_id (Agent scope, agentWrite enabled)
$ErrorActionPreference = 'SilentlyContinue'

# ---- AnyDesk: first the executable, then the system.conf file ----
$anydeskId = $null
$candidates = @(
  "$env:ProgramFiles\\AnyDesk\\AnyDesk.exe",
  "$env:ProgramW6432\\AnyDesk\\AnyDesk.exe",
  "C:\\Program Files (x86)\\AnyDesk\\AnyDesk.exe"
)
$exe = $candidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if ($exe) { $anydeskId = ((& $exe --get-id) -join '') }

if (-not $anydeskId) {
  $conf = Join-Path $env:ProgramData 'AnyDesk\\system.conf'
  if (Test-Path $conf) {
    $match = Select-String -Path $conf -Pattern '^ad\\.anynet\\.id=(.+)$' | Select-Object -First 1
    if ($match) { $anydeskId = $match.Matches.Groups[1].Value }
  }
}
$anydeskId = ($anydeskId -replace '\\s', '').Trim()

# ---- TeamViewer: ClientID in the registry (32 and 64 bit) ----
$tv = (Get-ItemProperty 'HKLM:\\SOFTWARE\\WOW6432Node\\TeamViewer' -Name ClientID -ErrorAction SilentlyContinue).ClientID
if (-not $tv) {
  $tv = (Get-ItemProperty 'HKLM:\\SOFTWARE\\TeamViewer' -Name ClientID -ErrorAction SilentlyContinue).ClientID
}
$tv = ($tv -replace '\\s', '').Trim()

# ---- Structured output for the operator to see in the execution result ----
[pscustomobject]@{
  anydesk_id    = if ($anydeskId) { $anydeskId } else { 'not installed' }
  teamviewer_id = if ($tv)        { $tv }        else { 'not installed' }
} | ConvertTo-Json -Compress

# ---- Collection: write into the agent custom fields ----
if ($anydeskId) {
  Write-Output ('MDZ_COLLECT: {"name":"anydesk_id","value":"' + $anydeskId + '"}')
}
if ($tv) {
  Write-Output ('MDZ_COLLECT: {"name":"teamviewer_id","value":"' + $tv + '"}')
}
exit 0`,
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'A collector task only writes when the execution succeeds',
        text: 'If the script fails, the field is not overwritten — that prevents wiping a valid value because of an errored run. To always write, handle errors inside the script and finish with exit 0.',
      },
      {
        type: 'accordion',
        title: 'Where fields appear in the Console',
        items: [
          {
            summary: 'Agent "Information" card — Extras section',
            paragraphs: [
              'Shows only pinned fields (isPinned), in "Label: value" format, with a copy button for textual values.',
              'Secret fields appear masked and are never copied.',
            ],
            route: '/agents/:id',
          },
          {
            summary: 'Agent "Extras" tab',
            paragraphs: [
              'Complete view of every field visible in the portal, with type, capabilities, last-change audit and editing according to webEdit.',
            ],
            route: '/agents/:id?tab=campos-customizados',
          },
          {
            summary: 'Filter and column in the agent list',
            paragraphs: [
              'The agent list filters by field/value and the text search also matches the field value — handy to quickly find "which machine has this AnyDesk ID".',
            ],
            route: '/agents',
          },
        ],
      },
    ],
  },
  {
    id: 'deploy-tokens',
    part: 'install',
    navLabel: '1.9. Deploy Tokens',
    badge: 'Part 1 · Chapter 9 · Deployment',
    title: 'Deploy Tokens: the key that binds an endpoint to a Client and Site',
    lead: 'The Deploy Token guarantees multi-tenancy from the very first second: it defines which Client/Site the agent is born into and how long the key stays valid.',
    blocks: [
      {
        type: 'steps',
        title: 'Creating and using a Deploy Token',
        items: [
          {
            title: '1. Generate the token',
            description: 'In Deploy → New Token, choose the target Client and Site (and department, if applicable), the validity and the usage limit.',
            route: 'Web Console → Deploy (/deploy)',
          },
          {
            title: '2. Copy the silent command',
            description: 'The screen generates the ready-to-run installer command with the token embedded. Use it in GPO, Intune, the bootstrap script or the USB drive.',
          },
          {
            title: '3. Install on the endpoints',
            description: 'Run the installer silently. The agent registers at POST /api/v1/agent-install/register and receives the definitive mdz_... token.',
          },
          {
            title: '4. Follow the agents coming in',
            description: 'Endpoints appear in Agents as the first heartbeat arrives. Use labels and Site filters to confirm each machine landed in the right place.',
            route: 'Web Console → Agents (/agents)',
          },
          {
            title: '5. Revoke or limit when done',
            description: 'Tokens used for a mass rollout can be disabled once the campaign ends; for continuous zero-touch use a long-lived token with unlimited uses.',
          },
        ],
      },
      {
        type: 'table',
        caption: 'Deploy Token parameters',
        headers: ['Parameter', 'Required', 'Recommendation'],
        rows: [
          ['Client', 'Yes', 'Never share a token between clients'],
          ['Site', 'Yes', 'One token per Site is the safest, most organised practice'],
          ['Department', 'No', 'Use it when the fleet is segmented by area'],
          ['Validity', 'Yes', 'Short for campaigns; long for GPO/Intune'],
          ['Usage limit', 'No', 'Unlimited for continuous provisioning (images, GPO)'],
        ],
      },
      {
        type: 'code',
        title: 'Silent deployment commands',
        language: 'powershell',
        snippet: `# 1) Silent install with URL and key (the token is the KEY)
.\\discovery-amd64-installer.exe /S /URL="https://rmm.company.com" /KEY="tok_example_123"

# 2) Short form, with an alternative directory
.\\discovery-amd64-installer.exe /S /U="https://rmm.company.com" /K="tok_example_123" /D="C:\\Discovery"

# 3) Generic mode (P2P provisioning, no wizard)
.\\discovery-amd64-installer.exe /G /AP=1

# 4) Update preserving the local configuration
.\\discovery-amd64-installer.exe /U`,
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'A token is not a user password',
        text: 'The Deploy Token only registers the endpoint and binds it to the correct tenant. The agent runtime identity is the mdz_... token, encrypted locally with DPAPI and with an ACL restricted to SYSTEM and Administrators.',
      },
    ],
  },
  {
    id: 'agent-install',
    part: 'install',
    navLabel: '1.10. Minimal installer & Agent install',
    badge: 'Part 1 · Chapter 10 · Installer',
    title: 'Minimal installer: install the Agent with no wizard and no interaction',
    lead: 'The NSIS installer accepts command-line parameters that reduce installation to the bare minimum: no interface, no wizard and the server already pre-configured.',
    blocks: [
      {
        type: 'paragraphs',
        items: [
          'Minimal mode (/MINIMAL or /M) skips the wizard when the server URL and the key were already provided. Combined with /S (silent), installation becomes a single command line — ideal for scripts, GPO, Intune or reference images.',
          'Beyond the command line, the installer can be compiled with built-in default values, producing a "minimal installer" already pointed at your server: no parameter is needed on the endpoint.',
        ],
      },
      {
        type: 'table',
        caption: 'NSIS installer parameters',
        headers: ['Parameter', 'Short form', 'Effect'],
        rows: [
          ['/S', '—', 'Silent install, no graphical interface'],
          ['/UPDATE', '/U', 'Update mode: silent and preserves the local configuration'],
          ['/URL=<address>', '/U=<address>', 'API server URL'],
          ['/KEY=<key>', '/K=<key>', 'Deploy Token that binds the endpoint to the Client/Site'],
          ['/AUTO_PROVISIONING=<0|1>', '/AP=<0|1>', 'Enables zero-touch provisioning'],
          ['/MINIMAL', '/M', 'Minimal mode: skips the wizard when URL and KEY were provided'],
          ['/GENERIC', '/G', 'Generic mode: P2P provisioning with no wizard'],
          ['/ALLOW_INSECURE_TLS=<1|true>', '/TLS=<value>', 'Allows insecure TLS (lab only)'],
          ['/D=<directory>', '—', 'Install directory (default C:\\Program Files\\Discovery)'],
          ['/?', '/H, /HELP', 'Shows the help with every parameter'],
        ],
      },
      {
        type: 'code',
        title: 'Minimal installer: a single command line',
        language: 'powershell',
        snippet: `# Minimal install: no UI, no wizard, pointing at the server
$installer = "$PSScriptRoot\\discovery-amd64-installer.exe"
Start-Process -FilePath $installer -Wait -ArgumentList @(
  '/S',                                  # silent
  '/MINIMAL',                            # skip the wizard
  '/URL=https://rmm.company.com',        # server
  '/KEY=tok_example_123',                # Deploy Token
  '/AP=1'                                # zero-touch provisioning
)

# Post-install checks
Get-Service discovery-service | Select-Object Name, Status, StartType
Get-Content "$env:ProgramData\\Discovery\\install.log" -Tail 40`,
      },
      {
        type: 'code',
        title: 'Building a minimal installer with a pre-configured server',
        language: 'powershell',
        snippet: `# When compiling the installer (Discovery repository), embed default URL/KEY
# and enable minimal mode: the resulting binary installs with no parameter.
makensis ^
  -DARG_DEFAULT_URL=rmm.company.com ^
  -DARG_DEFAULT_KEY=tok_example_123 ^
  -DARG_DEFAULT_DISCOVERY=1 ^
  -DARG_DEFAULT_MINIMAL=1 ^
  src\\build\\windows\\installer\\project.nsi`,
      },
      {
        type: 'steps',
        title: 'What the installer does and how to validate it',
        items: [
          {
            title: '1. Installs both binaries',
            description: 'discovery-service.exe (SYSTEM service, no UI) and discovery-agent.exe (UI Companion in the user session).',
          },
          {
            title: '2. Ensures WebView2',
            description: 'The Microsoft Edge WebView2 runtime is installed silently — only required by the Wails interface.',
          },
          {
            title: '3. Registers and starts the service',
            description: 'The service is created with sc create and started. It registers, connects to NATS and begins the inventory.',
          },
          {
            title: '4. Validate within 15 seconds',
            description: 'Startup goes through 4 phases (inventory, DPAPI + NATS bootstrap, automation, P2P/sync/self-update). Within ~15s the endpoint should appear online in the Console.',
            route: 'Web Console → Agents (/agents)',
          },
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Mind the payload parameter',
        text: 'The /PAYLOAD_URL= parameter (or /PU=) only accepts https:// addresses and aborts the installation on any other scheme. For lab environments over plain HTTP, use /URL= as in the examples.',
      },
    ],
  },
  {
    id: 'zero-touch',
    part: 'install',
    navLabel: '1.11. Zero-Touch & post-format recovery',
    badge: 'Part 1 · Chapter 11 · Provisioning',
    title: 'Zero-Touch: install the Agent with nobody touching the machine',
    lead: 'Provision endpoints at the end of the Windows installation (unattend), through GPO or Intune — and recover the binding automatically after a reinstall.',
    blocks: [
      {
        type: 'callout',
        tone: 'info',
        title: 'The concept in one sentence',
        text: 'Zero-Touch means the endpoint is born monitored: the installer runs as SYSTEM at the end of Windows setup, with no logon and no operator, and the agent registers itself into the Client/Site defined by the Deploy Token.',
      },
      {
        type: 'table',
        caption: 'Unattend generator script blocks: which one to use',
        headers: ['Block', 'Context', 'When it runs', 'Suitable for the Agent?'],
        rows: [
          ['System scripts', 'NT AUTHORITY\\SYSTEM', 'Before any account exists (becomes SetupComplete.cmd)', 'Yes — recommended'],
          ['DefaultUser scripts', 'End user', 'Only if there is an interactive logon', 'No — the machine may sit at the logon screen'],
          ['First logon commands', 'End user', 'After the first logon (requires AutoLogon)', 'Alternative only'],
        ],
      },
      {
        type: 'steps',
        title: 'Zero-Touch via autounattend.xml',
        items: [
          {
            title: '1. Generate the autounattend.xml',
            description: 'Fill in language, partitioning and the administrator account in the unattend generator.',
          },
          {
            title: '2. Paste the script into System scripts',
            description: 'Use the "1. Run" field of the System scripts section and choose the .ps1 type. The generator writes it to %WINDIR%\\Setup\\Scripts and calls it through powershell -ExecutionPolicy Bypass, blocking the end of setup until it finishes.',
            code: 'powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0zerotouch-install.ps1"',
          },
          {
            title: '3. Put the XML at the root of the media',
            description: 'The autounattend.xml must be at the root of the USB drive/ISO to be read automatically by Windows setup.',
          },
          {
            title: '4. Validate on the first boot',
            description: 'Check the log at %ProgramData%\\Discovery\\zerotouch-install.log and the discovery-service service — before any login.',
            code: 'Get-Content "$env:ProgramData\\Discovery\\zerotouch-install.log" -Tail 30\nGet-Service | Where-Object Name -like "*iscovery*"',
          },
        ],
      },
      {
        type: 'code',
        title: 'zerotouch-install.ps1 — short version to paste into the System scripts field',
        language: 'powershell',
        snippet: `# Downloads and installs the Discovery Agent in zero-touch mode (SYSTEM, no logon)
$ErrorActionPreference = 'Stop'
$url = 'https://rmm.company.com/files/discovery-agent-zerotouch.exe'
$tmp = Join-Path $env:TEMP 'discovery-agent-zerotouch.exe'
$log = Join-Path $env:ProgramData 'Discovery\\zerotouch-install.log'
New-Item -ItemType Directory -Force -Path (Split-Path $log) | Out-Null
function Log($m) { Add-Content $log "$(Get-Date -f 's') $m" }

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

Log "Downloading $url"
$ok = $false
for ($i = 1; $i -le 3 -and -not $ok; $i++) {
  try {
    (New-Object Net.WebClient).DownloadFile($url, $tmp)
    if ((Get-Item $tmp).Length -gt 0) { $ok = $true }
  } catch { Log "Attempt $i failed: $($_.Exception.Message)"; Start-Sleep 10 }
}
if (-not $ok) { Log 'Download failed'; exit 1001 }

# /S silent | /AP=1 auto-provisioning | /URL API server | /M minimal
$args = '/S /AP=1 /M /URL="https://rmm.company.com" /KEY="tok_example_123"'
Log "Installing with: $args"
$p = Start-Process -FilePath $tmp -ArgumentList $args -Wait -PassThru -NoNewWindow
Log "Exit code: $($p.ExitCode)"

Get-Service | Where-Object Name -like '*iscovery*' |
  ForEach-Object { Log "Service $($_.Name) = $($_.Status)" }

Remove-Item $tmp -Force -ErrorAction SilentlyContinue
exit 0`,
      },
      {
        type: 'code',
        title: 'Alternatives: manual SetupComplete.cmd, GPO and Intune',
        language: 'powershell',
        snippet: `# A) Manual SetupComplete.cmd inside the media
# \\sources\\$OEM$\\$$\\Setup\\Scripts\\SetupComplete.cmd
#   @echo off
#   powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0zerotouch-install.ps1"

# B) GPO — Computer startup script (Computer Configuration > Windows Settings > Scripts > Startup)
#    copy the installer to \\domain\netlogon\\discovery\\ and point the script at it
Start-Process "$env:LOGONSERVER\netlogon\\discovery\\discovery-amd64-installer.exe" -Wait -ArgumentList @(
  '/S','/M','/URL=https://rmm.company.com','/KEY=tok_example_123','/AP=1'
)

# C) Intune — Win32 app
#    Install command:    discovery-amd64-installer.exe /S /M /URL=https://rmm.company.com /KEY=tok_example_123 /AP=1
#    Uninstall command:  "C:\\Program Files\\Discovery\\uninstall.exe" /S
#    Detection rule:     registry key HKLM\\SOFTWARE\\Discovery\\AgentVersion (key exists)`,
      },
      {
        type: 'table',
        caption: 'Installer flags used by zero-touch',
        headers: ['Flag', 'Long form', 'Effect'],
        rows: [
          ['/S', '—', 'Silent (no window)'],
          ['/AP=1', '/AUTO_PROVISIONING=1', 'Enables auto-provisioning (zero-touch)'],
          ['/URL=', '—', 'API endpoint — accepts http:// and https://'],
          ['/KEY=', '/K=', 'Deploy Token that defines Client/Site'],
          ['/M', '/MINIMAL', 'Minimal install, no wizard'],
          ['/G', '/GENERIC', 'No URL/KEY: provisions through the P2P mesh'],
        ],
      },
      {
        type: 'accordion',
        title: 'Checklist, http:// and post-format recovery',
        items: [
          {
            summary: 'Zero-touch validation checklist',
            paragraphs: [
              'autounattend.xml at the media root; script in System scripts marked as .ps1; the machine can reach the server during setup; the installer URL responds without authentication (the script runs as SYSTEM, with no user credentials); you used /URL= and not /PU=.',
              'If /files/ requires login, expose that path or use a token in the URL.',
            ],
          },
          {
            summary: 'Why /PU= (PAYLOAD_URL) does not work over HTTP',
            paragraphs: [
              'The installer was hardened to refuse http:// in /PAYLOAD_URL= and aborts with a warning, because downloading and executing code as admin over plain text is an attack vector.',
              'Use /URL= (accepts http and https). On a local network, prefer a management VLAN and migrate to HTTPS; then validate the payload SHA-256 with Get-FileHash before running it.',
            ],
          },
          {
            summary: 'Post-Format Recovery: the machine is recognised again by itself',
            paragraphs: [
              'On machines with TPM 2.0, the agent stores the hardware identity (Endorsement Key + SMBIOS UUID). After reinstalling Windows, the new agent re-associates with the same record instead of creating a duplicate endpoint.',
              'As a result, policies, custom fields, labels and endpoint packages apply again automatically after zero-touch.',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'agent',
    part: 'install',
    navLabel: '1.12. How the Agent works',
    badge: 'Part 1 · Chapter 12 · Discovery Agent',
    title: 'Dual-binary architecture, lifecycle and Agent capabilities',
    lead: 'Two binaries with distinct roles: a SYSTEM service doing the heavy lifting and a light UI in the user session talking to the employee.',
    blocks: [
      {
        type: 'cards',
        title: 'Dual-binary separation and IPC',
        items: [
          {
            title: 'discovery-service.exe (Session 0 · SYSTEM)',
            badge: 'Headless core',
            description: 'Windows service with no Wails and no WebView2. It manages NATS/JetStream, inventory, automation, sensors, P2P, self-update and the named-pipe server.',
          },
          {
            title: 'discovery-agent.exe (user session · Wails v3)',
            badge: 'UI Companion',
            description: 'Tray application with AI Chat, support, self-service store and diagnostics. It talks to the service over authenticated named pipes (read + admin) and enters economy mode when minimised.',
          },
        ],
      },
      {
        type: 'steps',
        title: 'Startup in 4 phases',
        items: [
          {
            title: 'Registration with Deploy Token and DPAPI',
            description: 'On first run the agent sends hostname, OS and MAC/TPM to POST /api/v1/agent-install/register. The returned mdz_... token is encrypted with Windows DPAPI (dpapi:v1:) in a file with an ACL restricted to SYSTEM and Administrators.',
          },
          {
            title: 'Phase 1 (~2s) — initial inventory and SQLite WAL',
            description: 'Opens the local SQLite database in WAL mode and runs the initial hardware/software collection for an immediate response in the Console.',
          },
          {
            title: 'Phase 2 (~1s) — DPAPI bootstrap and NATS/WSS connection',
            description: 'Fetches GET /api/v1/agent-auth/me/configuration and connects to NATS through the Ed25519 Auth Callout, subscribing to its Client/Site/Agent subjects.',
          },
          {
            title: 'Phases 3 and 4 (10s–12s) — automation, P2P, sync and self-update',
            description: 'Starts the automation cron and the sensor loop, the P2P mesh (go-libp2p + mDNS/UDP), API health checks, outbox cleanup and self-update validated by SHA-256 and Authenticode signature.',
          },
        ],
      },
      {
        type: 'table',
        caption: 'Native Discovery Agent capabilities',
        headers: ['Capability', 'Technical implementation', 'Security controls'],
        rows: [
          ['Inventory', 'Native WMI/CIM + osquery Thrift + PowerShell fallback + WUA (COM)', 'Incremental collection with hash/sync manifest'],
          ['Remote screen', 'DXGI Desktop Duplication (HDR and dirty rects) with GDI fallback', 'Banner excluded from capture, configurable consent and optional recording'],
          ['Remote terminal', 'ConPTY with an isolated dispatcher', 'runAs=user is fail-closed: never degrades to SYSTEM'],
          ['Remote files', 'DF binary protocol with handle cache and 256 KB chunks', 'No token in the URL; access through the NATS session'],
          ['Processes and registry', 'sysctrl and winregistry with a fail-closed guard', 'SAM/SECURITY/LSA blocked; Run/RunOnce blocked for writes'],
          ['LAN HTTP/WS proxy', 'core/netproxy over NATS', 'Fail-closed allowlist, SSRF blocking and single anti-TOCTOU DNS'],
          ['RDP tunnel / WebRDP', 'Multiplexed session_tunnel (64 streams) + TermService preflight', 'Ephemeral port locked to 127.0.0.1; honours NoRdp=128'],
          ['Sensors', 'Native collectors + script (with extractors and exit map)', 'Runs as the service; bounded output and no user context'],
          ['Automation', 'PowerShell, CMD and custom packages with IANA windows', 'Fields through the MDZ_CUSTOM_FIELDS env, no command-line interpolation'],
          ['Zero-Touch and recovery', 'Unattend/GPO/Intune + reassociation by TPM 2.0 EK and SMBIOS UUID', 'After reinstalling, it recovers binding, policies and apps'],
          ['Transparency', 'Interactive chat/remote access notices + floating banner', 'Consent with countdown; banner excluded from capture'],
          ['P2P network', 'go-libp2p + local mDNS/UDP discovery per Site', 'Shares only SHA-256 verified artefacts'],
          ['Power and firmware', 'Generic power command (restart, shutdown, cancel, lock) including restart into BIOS/UEFI, plus Wake-on-LAN', 'Immediate and scheduled verbs; the firmware restart requires UEFI boot'],
          ['On-demand collection', 'Immediate refresh of listening ports, connections, software, printers and hardware', 'Triggered from the Console when the inventory cycle is not enough'],
          ['Decommission', 'Command that locates the NSIS uninstaller and runs it elevated, with a persistent 30-day marker', 'One request per process; redelivery does not duplicate the action'],
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'How to open local Debug Mode in the Agent',
        text: 'Close the agent from the tray icon (right-click → Exit) and open it again while holding Shift. Debug Mode unlocks local logs, TPM 2.0 EK / SMBIOS UUID identity and every diagnostics tab, even those hidden by server policy.',
      },
    ],
  },
];
