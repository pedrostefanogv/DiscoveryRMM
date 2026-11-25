import type { DocSection } from '../types';

/**
 * Part 3 — Support & End User (en-US).
 * Chapters 3.1 to 3.5.
 */
export const supportEnSections: DocSection[] = [
  {
    id: 'support-chat',
    part: 'support',
    navLabel: '3.1. Support chat & live assistance',
    badge: 'Part 3 · Chapter 1 · Real-time service',
    title: 'Support chat: talk to the user and the technician in real time',
    lead: 'There are two different chats: the MACHINE chat (no ticket, for quick support) and the TICKET chat (linked to the service request). Both use consent and are recorded.',
    blocks: [
      {
        type: 'table',
        caption: 'The two chats',
        headers: ['Chat', 'Route', 'When to use'],
        rows: [
          ['Machine support chat', '/agents/:id/support-chat', 'Quick support without opening a ticket; the conversation stays linked to the device'],
          ['Ticket chat', '/tickets/:id/chat', 'Formal service; the conversation stays in the ticket and serves as evidence'],
          ['Tier-1 AI Chat', 'Discovery Agent (assistant tab)', 'The employee resolves simple questions before contacting IT'],
        ],
      },
      {
        type: 'steps',
        title: 'Flow of a chat service session',
        items: [
          {
            title: '1. The technician sends the invite',
            description: 'From the agent or ticket detail, the technician starts the invite. The employee receives a native Windows notification (even with the window closed).',
          },
          {
            title: '2. The employee accepts or declines',
            description: 'The invite requires explicit acceptance. If declined, the technician is informed and the invite does not loop.',
          },
          {
            title: '3. The conversation happens',
            description: 'The chat window is dedicated: it stays alive even if you navigate to another Console screen. Presence shows who is online.',
          },
          {
            title: '4. The history is preserved',
            description: 'At the end, the transcript stays with the device or the ticket, depending on the chat type, and can be reviewed later.',
          },
          {
            title: '5. The cycle can be reopened',
            description: 'Closed conversations can be reopened when the subject returns, without losing the previous history.',
          },
        ],
      },
      {
        type: 'table',
        caption: 'Conversation states and what to do',
        headers: ['State', 'Meaning', 'Technician action'],
        rows: [
          ['Inviting', 'Invite sent, awaiting a response', 'Wait; the user may be away from the machine'],
          ['Open', 'The user accepted and the conversation is active', 'Conduct the service session'],
          ['Closed', 'Conversation finished', 'Record the outcome in the ticket'],
          ['Reopened', 'Subject resumed', 'Continue from where it stopped'],
          ['Invite failure', 'Delivery error or refusal', 'Check the agent connection and try again'],
        ],
      },
      {
        type: 'image',
        file: 'agent-support-chat.png',
        alt: 'Discovery Agent support chat window talking to the technician',
        caption: 'The machine chat opens in its own window on the endpoint and stays alive even if the technician navigates to another Console screen.',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Transparency by default',
        text: 'The user always knows they are being assisted: invite notification, explicit acceptance and a notice during the session. The same principle applies to remote access, with a fixed on-screen banner.',
      },
    ],
  },
  {
    id: 'enduser-agent',
    part: 'support',
    navLabel: '3.2. End-user guide (Agent)',
    badge: 'Part 3 · Chapter 2 · Employee',
    title: 'Employee guide: the Discovery Agent on your workstation',
    lead: 'A simple guide for people who use the computer every day — with no infrastructure jargon.',
    blocks: [
      {
        type: 'paragraphs',
        items: [
          'The Discovery Agent is the icon next to the Windows clock. It is the direct channel between you and the IT team: ask questions, open tickets, install approved software and follow a service session.',
          'You remain in control of your computer: nothing is installed without a company-approved policy, and any remote access requires your awareness.',
        ],
      },
      {
        type: 'steps',
        title: 'What you can do',
        items: [
          {
            title: '1. Check that everything is connected',
            description: 'Click the tray icon to see the status. If it shows disconnected, your computer still works normally — the agent reconnects on its own.',
          },
          {
            title: '2. Ask the assistant (AI Chat)',
            description: 'Describe the problem in plain language. If you want, attach a screenshot. The assistant searches your company manuals and suggests the fix.',
          },
          {
            title: '3. Open a ticket',
            description: 'In the Support tab, open the request. The ticket already carries your machine information, which speeds up service a lot.',
          },
          {
            title: '4. Install approved software',
            description: 'In the App Store, install the applications released by IT with one click, with no administrator password.',
          },
          {
            title: '5. Browse the knowledge base',
            description: 'Released articles provide step-by-step answers to common questions: VPN, printer, e-mail, system access.',
          },
        ],
      },
      {
        type: 'image',
        file: 'agent-chat.png',
        alt: 'Discovery Agent AI Chat answering the employee on the workstation',
        caption: 'Tier-1 AI Chat: the employee describes the problem and can attach a screenshot.',
      },
      {
        type: 'image',
        file: 'agent-tickets.png',
        alt: 'Discovery Agent tickets tab with request creation and tracking',
        caption: 'Tickets opened from the Agent already carry the device information linked to them.',
      },
      {
        type: 'image',
        file: 'agent-store.png',
        alt: 'Discovery Agent self-service App Store with IT-approved applications',
        caption: 'In the App Store the employee installs approved software with one click, no administrator password.',
      },
      {
        type: 'accordion',
        title: 'Employee FAQ',
        items: [
          {
            summary: 'Can IT see my screen at any time?',
            paragraphs: [
              'No. When the policy requires consent, a request appears on your screen with a countdown and you choose to accept or decline.',
              'During an authorised session a visible banner stays on screen and it does not appear in screenshots.',
            ],
          },
          {
            summary: 'Will the agent slow down my computer?',
            paragraphs: [
              'The agent is designed to consume little: collection is incremental and the interface enters economy mode when minimised.',
              'If you notice slowness, open a ticket with the time — IT can see CPU, memory and disk of your device in the Console.',
            ],
          },
          {
            summary: 'What was that task notice that appeared?',
            paragraphs: [
              'It is an installation, update or removal scheduled by IT. Some notices can be deferred for a while; others are silent by policy.',
              'Save your work when the notice indicates the computer may restart.',
            ],
          },
          {
            summary: 'Do I need to log in to any website?',
            paragraphs: [
              'No. Console access belongs to the IT team. You only use the tray application on the computer.',
            ],
          },
          {
            summary: 'How do I get help if the agent does not open?',
            paragraphs: [
              'Use the company normal service channel (phone/e-mail) and provide the machine name, which is on the equipment label.',
              'IT can reinstall or repair the agent remotely.',
            ],
          },
        ],
      },
      {
        type: 'image',
        file: 'agent-consent-prompts.png',
        alt: 'Remote access consent prompt shown on the employee screen',
        caption: 'When policy requires consent, the user accepts or declines before any screen capture.',
      },
      {
        type: 'image',
        file: 'agent-remote-banner.png',
        alt: 'Floating banner showing an active remote access session, excluded from capture',
        caption: 'During the session a visible banner stays on screen and is excluded from capture.',
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'If you are in IT: Debug Mode',
        text: 'Close the agent from the tray icon and open it again while holding Shift. Debug Mode shows local logs, hardware identity (TPM/SMBIOS) and every diagnostics tab, even those hidden by policy.',
      },
    ],
  },
  {
    id: 'module-config',
    part: 'support',
    navLabel: '3.3. Per-module configuration & inheritance',
    badge: 'Part 3 · Chapter 3 · Configuration',
    title: 'Configure each module and understand scope inheritance',
    lead: 'Every configuration follows the chain Global → Client → Site → Agent. The Effective screen shows the applied value and where it came from; Audit shows who changed it.',
    blocks: [
      {
        type: 'callout',
        tone: 'tip',
        title: 'Inheritance and Effective Configuration',
        text: 'In Settings → Effective (/settings/effective) you see each parameter with its origin (Server, Client, Site or Locked). A blank field inherits from the level above — and a parameter locked at a higher level cannot be overridden below.',
      },
      {
        type: 'accordion',
        title: 'Module-by-module configuration guide',
        items: [
          {
            summary: '1. IAM, authentication and MFA (FIDO2 / TOTP)',
            paragraphs: [
              'Define roles, granular permissions by ResourceType/ActionType and scope (Global, Client, Site or Agent).',
              'The default password policy requires 12+ characters, uppercase, a number and a symbol. FIDO2/WebAuthn or TOTP is mandatory for administrative accounts.',
            ],
            route: '/identity/authentication · /identity/roles · /identity/users',
          },
          {
            summary: '2. Deploy Tokens and provisioning',
            paragraphs: [
              'Create the token linking Client and Site (and department, if applicable), with validity and usage limit.',
              'Use the generated command in the NSIS installer, the zero-touch script or Intune.',
            ],
            route: '/deploy',
          },
          {
            summary: '3. Remote access, consent and LAN proxy',
            paragraphs: [
              'Define concurrent limits per session type (default 5), recording and the end-user consent policy.',
              'The LAN proxy is fail-closed: an empty allowlist means no forwarded request. Configure allowed destinations and ports.',
            ],
            route: '/settings/remote-access · /settings/remote-consent · /settings/proxy-policy · /settings/remote-webrtc',
          },
          {
            summary: '4. Sensors and the Auto-Ticket engine',
            paragraphs: [
              'Each Client (or the Global scope) needs at least one Workflow State with IsFinal = true, otherwise Auto-Ticket cannot close resolved tickets.',
              'Configure the policy (kill switch and AI mode Off/Suggest/AutoApply) and always run the dry-run before enabling rules.',
            ],
            route: '/sensors/manage · /tickets/auto-policy · /tickets/auto-rules',
          },
          {
            summary: '5. AI, knowledge base and MCP',
            paragraphs: [
              'Choose the provider (OpenRouter, an OpenAI-compatible endpoint or local Ollama) and track spend per model.',
              'Enable only the MCP tools the AI may use on the endpoint and turn on pgvector embeddings for semantic search.',
            ],
            route: '/settings/ai-cost · /settings/mcp-tools',
          },
          {
            summary: '6. Patches, App Store, automation and custom fields',
            paragraphs: [
              'Define maintenance windows (IANA time zone) and automatic approval by severity. Configure Winget/Chocolatey sources and custom packages.',
              'Custom fields marked as secret are never exposed in clear text in the Console or in the script runtime.',
            ],
            route: '/patches/policy · /software/store · /settings/custom-fields',
          },
          {
            summary: '7. Notifications, branding and database maintenance',
            paragraphs: [
              'Register e-mail (SMTP), webhook and web push channels; customise logo and colours in branding.',
              'Define log retention, sensor series retention and periodic cleanup.',
              'The Agent auto-update policy (channel, window and rollout) lives in /settings/agent-updates; the global server and scope parameters live in /settings/server and /settings/scope.',
            ],
            route: '/settings/notifications · /settings/branding · /settings/database-maintenance · /settings/agent-updates · /settings/server · /settings/scope',
          },
          {
            summary: '8. Workflow, SLA and departments',
            paragraphs: [
              'Adjust states and transitions, per-client profiles, SLA targets with calendars and routing departments.',
              'Workflow changes directly affect Auto-Ticket and the service reports.',
            ],
            route: '/settings/workflow · /settings/workflow-profiles · /tickets/sla · /tickets/departments',
          },
          {
            summary: '9. Governance: background jobs, sanitization and API tokens',
            paragraphs: [
              'The "Background Processing" field (on the Server and as a per-Client override) controls the technician metrics and AI ticket triage cycles, with a floor of 10 and a per-client quota.',
              'Database and object storage sanitization live under Database maintenance: run the check first, read the report and only then apply.',
              'API tokens are created through the API (/api/v1/api-tokens) and are bound to a user: use them in integrations, never a technician password.',
            ],
            route: '/settings/database-maintenance · /settings/ai-cost · API /api/v1/api-tokens',
          },
        ],
      },
      {
        type: 'table',
        caption: 'Where to check the result of a change',
        headers: ['Goal', 'Screen'],
        rows: [
          ['See the effective value and its origin', '/settings/effective'],
          ['See who changed what and when', '/settings/audit'],
          ['See what the agent received', '/agents/:id (Policies tab)'],
          ['See operational logs', '/logs'],
        ],
      },
    ],
  },
  {
    id: 'troubleshooting',
    part: 'support',
    navLabel: '3.4. Troubleshooting',
    badge: 'Part 3 · Chapter 4 · Diagnostics',
    title: 'Troubleshooting: what to look at when something breaks',
    lead: 'A playbook per symptom, with the right command and the right screen — no trial and error.',
    blocks: [
      {
        type: 'accordion',
        title: 'Symptoms and how to fix them',
        items: [
          {
            summary: 'The agent never shows up online in the Console',
            paragraphs: [
              'Confirm the service: Get-Service discovery-service must be Running with StartType Automatic.',
              'Check the local log at %ProgramData%\\Discovery and validate connectivity to the server (curl https://your-domain/health).',
              'If the endpoint was registered with the wrong Site token, generate a new Deploy Token and reinstall.',
            ],
            code: 'Get-Service discovery-service | Select-Object Name,Status,StartType\nGet-Content "$env:ProgramData\\Discovery\\install.log" -Tail 60',
          },
          {
            summary: 'The Console does not update in real time',
            paragraphs: [
              'In most cases the NATS WebSocket (/nats) is blocked on the reverse proxy. Ensure Upgrade/Connection: upgrade and a long timeout.',
              'Check the real-time connection indicator at the top of the Console and the NATS health on the server.',
            ],
            route: '/settings (Server settings)',
          },
          {
            summary: 'Sensor stuck in Stale (no recent data)',
            paragraphs: [
              'Stale means the collection interval expired without a new reading — usually the agent is offline or the sensor was disabled.',
              'Run "Run now" and force a sensor sync to confirm. A Failing state is never masked by Stale.',
            ],
            route: '/agents/:id?tab=sensores · /sensors',
          },
          {
            summary: 'Automation script does not run or fails',
            paragraphs: [
              'Open the execution in Operations and read the recorded exit code, stdout and stderr.',
              'Validate the script on a test agent; confirm the shell, the parameters and that the output destination exists (note or Agent-scope collector field).',
            ],
            route: '/automation/operations · /automation/audit',
          },
          {
            summary: 'Collector custom field stays empty',
            paragraphs: [
              'Writing only happens when the script succeeds. If the exit code is non-zero, the value is intentionally not overwritten.',
              'Confirm that the key in MDZ_COLLECT is identical to the field key and that the field has agentWrite enabled in the Agent scope.',
            ],
            route: '/settings/custom-fields',
          },
          {
            summary: 'Remote session does not open or is denied',
            paragraphs: [
              'Check whether your role has the required right (NoProxy=64 blocks the LAN proxy; NoRdp=128 blocks WebRDP).',
              'If the policy requires consent, the user must accept the request on the endpoint screen.',
            ],
            route: '/identity/roles · /settings/remote-consent',
          },
          {
            summary: 'I lost administrative access / lost MFA',
            paragraphs: [
              'On the server host run --recover-admin: the password is reset, the next login requires a change, sessions are revoked and MFA factors are cleared.',
              'Do this preferably in a maintenance window and record the event.',
            ],
            code: 'dotnet run --project src/Discovery.Api -- --recover-admin\n# or, without writing the password to history:\necho "NewStrongPassword@2026" | dotnet run --project src/Discovery.Api -- --recover-admin --password-stdin',
          },
          {
            summary: 'Database error: vector extension not found',
            paragraphs: [
              'Install the pgvector package on the database host and run CREATE EXTENSION IF NOT EXISTS vector; on the configured database.',
              'SQLite is not accepted at runtime — do not try to work around the provider.',
            ],
          },
          {
            summary: 'High CPU or memory usage on the endpoint',
            paragraphs: [
              'Use the remote debug console to see queues, active transport and the state of the agent loops.',
              'Check sensors with a very short interval and recurring automation scripts; increase intervals on low-end machines.',
            ],
            route: '/agents/remote-debug-console',
          },
          {
            summary: 'The agent cannot connect because of the server TLS certificate',
            paragraphs: [
              'When the server certificate is expired, has an incomplete chain or a mismatched name, the agent fails the TLS handshake before it even talks to the API.',
              'The server probes the certificates presented by the API and NATS endpoints (Security:AgentConnection:TlsCertificateProbeUrl and NatsTlsCertificateProbeUrl) and stores the captured certificate, letting you compare what the server expects with what it actually presents — useful when only the agents complain and the browser works.',
              'Fix the chain on the reverse proxy (including the intermediate certificate), confirm the host name and revalidate with a pilot endpoint install.',
            ],
          },
          {
            summary: 'Orphan agent after a manual uninstall',
            paragraphs: [
              'Remove the agent from the Console itself (removal action) so the binding, policies and inventory are properly closed.',
              'If the machine was reinstalled, zero-touch with TPM 2.0 re-associates the endpoint with the existing record instead of duplicating it.',
            ],
            route: '/agents/:id',
          },
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Local Debug Mode',
        text: 'Close the agent from the tray and open it while holding Shift: local logs, hardware identity (TPM 2.0 EK and SMBIOS UUID) and diagnostics tabs become available even if server policy hides them.',
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Collect evidence before opening an incident',
        text: 'Note the time, machine name, Console screen, exit code and log excerpts. It cuts diagnosis time and avoids back-and-forth with the client.',
      },
    ],
  },
  {
    id: 'guides',
    part: 'support',
    navLabel: '3.5. End-to-end guides & FAQ',
    badge: 'Part 3 · Chapter 5 · Guides',
    title: 'End-to-end guides, minimal installer checklist and FAQ',
    lead: 'Three complete playbooks (installer, operator and end user), the minimal installer checklist and the questions that show up in every deployment.',
    blocks: [
      {
        type: 'steps',
        title: 'Guide 1 — For whoever installs (SysAdmin / Infrastructure)',
        items: [
          { title: '1. Bring up the Linux server with the bootstrap', description: 'Run it on the release channel and validate PostgreSQL + pgvector, NATS JetStream and Redis.' },
          { title: '2. Configure HTTPS and WSS on the reverse proxy', description: 'Expose API/Console on 443 and ensure WebSocket forwarding to /nats.' },
          { title: '3. Do the first login and enrol MFA', description: 'Sign in with admin / Mudar@123, set a strong password and register FIDO2 or TOTP.' },
          { title: '4. Structure Clients and Sites', description: 'Register tenants, units, departments and check the effective configuration.' },
          { title: '5. Generate Deploy Tokens and deploy', description: 'Use the minimal installer (/S /MINIMAL /URL /KEY /AP=1) or zero-touch through unattend/GPO/Intune.' },
          { title: '6. Configure backup and recovery', description: 'Schedule pg_dump, define retention and test --recover-admin in staging.' },
        ],
      },
      {
        type: 'steps',
        title: 'Guide 2 — For whoever operates (Technician / NOC / Service Desk)',
        items: [
          { title: '1. Organise the fleet with labels', description: 'Create label rules to separate laptops, servers, finance and critical machines.' },
          { title: '2. Enable sensors sensibly', description: 'Start with disk, CPU, memory, uptime and essential services; tune thresholds before enabling alerts.' },
          { title: '3. Turn on Auto-Ticket in dry-run', description: 'Simulate the rules, validate deduplication and only then enable — starting with a pilot client.' },
          { title: '4. Standardise software and patches', description: 'Publish only approved software in the App Store and define patch policy by severity and window.' },
          { title: '5. Serve with context', description: 'Use Service Board, macros, live chat, remote terminal and library scripts without leaving the ticket.' },
          { title: '6. Publish results', description: 'Schedule health, patch compliance, inventory and SLA reports for the client.' },
        ],
      },
      {
        type: 'steps',
        title: 'Guide 3 — For the end user and the minimal installer checklist',
        items: [
          { title: '1. Get to know the tray icon', description: 'It is how you talk to IT, open tickets, install released software and follow service sessions.' },
          { title: '2. Ask for help through the right channel', description: 'Simple questions go to the AI Chat; work-stopping problems become a ticket through Support.' },
          { title: '3. Accept or decline remote access', description: 'You decide; the on-screen banner shows when a technician is connected.' },
          { title: '4. Minimal installer checklist', description: 'Confirm: parameters /S /MINIMAL /URL /KEY /AP=1; discovery-service running; endpoint appearing online within 15 seconds; install log free of errors.' },
          { title: '5. Zero-touch checklist', description: 'Confirm: script in System scripts (.ps1), autounattend.xml at the media root, server reachable during setup and /URL= usage (never /PU= over HTTP).' },
        ],
      },
      {
        type: 'accordion',
        title: 'FAQ — questions that show up in every deployment',
        items: [
          {
            summary: 'Does the agent need internet access?',
            paragraphs: [
              'It needs to reach the DiscoveryRMM server (API + NATS). Free internet access is not required: a route to your server is enough, and that server can be internal.',
            ],
          },
          {
            summary: 'Does it work without the server?',
            paragraphs: [
              'No. The server is the brain: it decides thresholds, policies, tickets and reports. The agent keeps collecting locally and syncs when connectivity returns.',
            ],
          },
          {
            summary: 'Can I use SQLite on the server?',
            paragraphs: [
              'No. The server requires PostgreSQL 15+ with pgvector. SQLite exists only locally on the endpoint, as the agent cache.',
            ],
          },
          {
            summary: 'What is the difference between an automatic label and a custom field?',
            paragraphs: [
              'A label is a tag computed by a rule, used to segment and as automation scope. A custom field is a stored value (text, number, date) that support can fill in or a script can collect.',
            ],
          },
          {
            summary: 'What is the minimal installer?',
            paragraphs: [
              'It is installation with no wizard and no interface: /S (silent) + /MINIMAL (skip the wizard) with /URL and /KEY provided. At scale it can be compiled with the default values already embedded.',
            ],
          },
          {
            summary: 'How does zero-touch work?',
            paragraphs: [
              'The installer runs as SYSTEM at the end of Windows setup (System scripts/SetupComplete.cmd), with no logon, and the endpoint is born registered in the Client/Site of the Deploy Token.',
            ],
          },
          {
            summary: 'Does the server update itself?',
            paragraphs: [
              'No. Server updates are always manual and planned (--mode update). Only the Windows agent self-updates, validated by hash and signature.',
            ],
          },
          {
            summary: 'Do I need third-party licences to monitor?',
            paragraphs: [
              'You do not need to license a third-party agent: collection is native (WMI/CIM, WUA, DXGI, ConPTY) and osquery is optional, used only when the environment already runs it. Remote access tools such as AnyDesk or TeamViewer are optional and can simply be audited by script.',
            ],
          },
        ],
      },
      {
        type: 'table',
        caption: 'Quick glossary',
        headers: ['Term', 'Meaning'],
        rows: [
          ['Agent', 'Service + application installed on the Windows endpoint'],
          ['Client', 'Tenant: the data isolation boundary'],
          ['Site', 'Physical or logical unit inside a Client'],
          ['Deploy Token', 'Key that binds the endpoint to the Client/Site at registration'],
          ['Zero-Touch', 'Provisioning with no human interaction, at the end of Windows setup'],
          ['Minimal installer', 'Silent installation without a wizard (/S /MINIMAL)'],
          ['Sensor', 'Periodic collection with state, thresholds and history'],
          ['Script sensor', 'Sensor whose value comes from a PowerShell/Batch script'],
          ['Custom Field', 'Custom field: metadata per Client, Site or Agent'],
          ['Automatic label', 'Tag applied by a rule over the inventory'],
          ['Collector task', 'Script execution that writes its result into a custom field'],
          ['Auto-Ticket', 'Automatic ticket creation from a sensor/event'],
          ['Auth Callout', 'Ed25519 validation that issues a per-tenant NATS JWT'],
          ['JetStream', 'NATS message persistence and fan-out'],
          ['App Store', 'Self-service catalogue of IT-approved software'],
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Go back to the start when you need to',
        text: 'If you are deploying from scratch, follow Part 1 in order. If the fleet is already running, use Part 2 as your operations reference and Part 3 to configure, serve and troubleshoot.',
      },
    ],
  },
];
