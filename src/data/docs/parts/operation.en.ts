import type { DocSection } from '../types';

/**
 * Part 2 — Fleet Operations (en-US).
 * Chapters 2.1 to 2.14.
 */
export const operationEnSections: DocSection[] = [
  {
    id: 'interface',
    part: 'operation',
    navLabel: '2.1. Interface & navigation',
    badge: 'Part 2 · Chapter 1 · Interfaces',
    title: 'Interface map: where everything lives',
    lead: 'The Web Console concentrates operations and administration; the Agent Desktop concentrates the employee experience on the endpoint.',
    blocks: [
      {
        type: 'paragraphs',
        items: [
          'The Web Console is a SPA with lazy-loaded routes, a fixed side menu, global search and real-time notifications. Access is controlled per route: if your role does not allow a module, the link does not even appear.',
          'The Discovery Agent is the tray application installed on Windows. It is not a copy of the Console: it exists so the employee can talk to IT (chat, tickets, store, knowledge) and so a technician can diagnose the endpoint locally.',
        ],
      },
      {
        type: 'table',
        caption: 'Web Console modules and main routes',
        headers: ['Module', 'Routes', 'What you do'],
        rows: [
          ['Dashboard', '/', 'Executive view of fleet health, alerts and trends'],
          ['Clients and Sites', '/clients · /sites · /clients/:id · /clients/:id/sites/:siteId', 'Fleet structure by tenant and location'],
          ['Agents', '/agents · /agents/:id', 'Fleet, inventory, sensors, applications, policies and actions'],
          ['Sessions', '/agents/remote-session · /agents/remote-debug-console', 'Remote access and diagnostics console'],
          ['Service Board', '/service-board', 'Operational panel for queue, alerts and client health'],
          ['Tickets', '/tickets · /tickets/:id · /tickets/alerts · /tickets/sla · /tickets/csat', 'Service, SLA, alerts and satisfaction'],
          ['Automatic tickets', '/tickets/auto-policy · /tickets/auto-rules', 'Hierarchical policy and automatic creation rules'],
          ['Templates and macros', '/tickets/templates · /tickets/macros', 'Standardising intake and responses'],
          ['Departments', '/tickets/departments', 'Ticket routing and visibility'],
          ['Sensors', '/sensors · /sensors/manage · /sensors/script', 'Monitored fleet, definitions and the script sensor editor'],
          ['Patches', '/patches · /patches/updates · /patches/inventory · /patches/pending · /patches/approvals · /patches/compliance · /patches/policy', 'Windows Update end to end'],
          ['Software and store', '/software · /software/inventory · /software/store · /software/store/custom/new', 'Inventory, catalogue and in-house packages'],
          ['Automation', '/automation/scripts · /automation/tasks · /automation/operations · /automation/audit · /automation/agent-labels', 'Script library, tasks, executions, audit and labels'],
          ['Knowledge and AI', '/knowledge · /settings/ai-cost · /settings/mcp-tools', 'Knowledge base, AI spend and MCP tools'],
          ['Reports', '/reports/templates · /reports/run · /reports/schedules · /reports/executions', 'Templates, execution, scheduling and history'],
          ['Deploy', '/deploy', 'Deploy Tokens and provisioning'],
          ['Settings', '/settings · /settings/effective · /settings/remote-access · /settings/custom-fields · /settings/notifications', 'Inheritance, remote access, fields, notifications and maintenance'],
          ['Identity', '/identity/authentication · /identity/access · /identity/users · /identity/groups · /identity/roles', 'Profile, MFA, users, groups and roles'],
          ['Logs and audit', '/logs · /settings/audit', 'Operational logs and configuration change trail'],
        ],
      },
      {
        type: 'image',
        file: 'console-modules.png',
        alt: 'Web Console module menu with clients, sites, agents, tickets, sensors, patches and reports',
        caption: 'The side menu is filtered by your permissions: if a module is missing, your role has no access to it.',
      },
      {
        type: 'cards',
        title: 'Discovery Agent (Wails v3 Desktop)',
        items: [
          { title: 'Tier-1 AI Chat', badge: 'Assistant', description: 'Conversation on the endpoint using authorised MCP tools, with privacy controls and optional screenshot attachment.' },
          { title: 'Support and tickets', badge: 'ITSM', description: 'Opening requests linked to the device and live chat with the assigned technician.' },
          { title: 'Self-service App Store', badge: 'Software', description: 'IT-approved catalogue installable with one click, no administrator password.' },
          { title: 'Diagnostics and TPM identity', badge: 'Debug', description: 'Service status, active transport (NATS/REST), SMBIOS UUID, TPM 2.0 EK and real-time logs.' },
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Three parts, one flow',
        text: 'Part 1 delivers the structured fleet; Part 2 operates that fleet; Part 3 serves the people. If a module is missing for you, check your role permissions first in /identity/roles.',
      },
    ],
  },
  {
    id: 'agents-fleet',
    part: 'operation',
    navLabel: '2.2. Fleet operations',
    badge: 'Part 2 · Chapter 2 · Fleet',
    title: 'Running the agent fleet day to day',
    lead: 'Filter, group, act in bulk and investigate a specific endpoint with full context: inventory, sensors, applications, policies and logs.',
    blocks: [
      {
        type: 'steps',
        title: 'Daily fleet operations flow',
        items: [
          {
            title: '1. Open the agent list and filter',
            description: 'Filter by status (online/offline/maintenance), Client, Site, automatic label or custom field value. Text search also matches name, IP and field value.',
            route: 'Web Console → Agents (/agents)',
          },
          {
            title: '2. Use the columns to prioritise',
            description: 'Sort by last check-in, disk usage, agent version or alert count. Machines offline for a long time and full disks come first.',
          },
          {
            title: '3. Run bulk quick actions',
            description: 'Select several agents and trigger sync, script execution, restart or shutdown. Destructive actions ask for confirmation and are recorded in the audit trail.',
          },
          {
            title: '4. Open the endpoint detail',
            description: 'The detail page holds Info/Extras, Inventory, Sensors, Applications, Network, Policies and Logs, plus the remote debug console and the chat with the user.',
            route: 'Web Console → Agents → Detail (/agents/:id)',
          },
          {
            title: '5. Record what you did',
            description: 'Use agent notes (or a history custom field) so the next technician knows what happened.',
          },
        ],
      },
      {
        type: 'table',
        caption: 'Agent detail tabs',
        headers: ['Tab', 'Content', 'Typical use'],
        rows: [
          ['Info / Extras', 'Hardware, OS, user, IP, last check-ins and custom fields', 'Identify the machine and look up AnyDesk/TeamViewer IDs'],
          ['Inventory', 'Detailed hardware, disks, network, printers and installed software', 'Audits and upgrade planning'],
          ['Sensors', 'Current state, sparklines, thresholds, failures and history', 'Proactive diagnosis and fix validation'],
          ['Applications', 'Installed software, catalogue and store packages', 'Check versions and remove unauthorised software'],
          ['Network', 'Interfaces, latency, DNS, LAN proxy and P2P', 'Investigate connectivity and bandwidth'],
          ['Policies', 'Effective configuration applied to the agent', 'Understand why a policy is in effect'],
          ['Logs', 'Agent events, executions and errors', 'Investigate isolated failures'],
        ],
      },
      {
        type: 'table',
        caption: 'Available maintenance actions',
        headers: ['Action', 'Effect', 'Caution'],
        rows: [
          ['Sync now', 'Forces check-in and refreshes policies and inventory', 'No risk'],
          ['Run script', 'Runs a library script in the chosen context', 'Validate the script on a test agent'],
          ['Restart / shutdown', 'Power action on the endpoint', 'Warn the user and respect the maintenance window'],
          ['Maintenance mode', 'Silences alerts during an intervention', 'Remember to leave maintenance mode when done'],
          ['Remove agent', 'Uninstalls the agent and ends the binding', 'Irreversible for the endpoint local history'],
          ['Bulk register / Transfer', 'Moves the endpoint to another Client/Site (single or bulk, with target validation)', 'Validate first: transfer changes policy, sensor and ticket scope'],
          ['Wake-on-LAN and advanced power', 'Powers on a machine on the LAN and runs power verbs, including restarting into BIOS/UEFI', 'WOL needs the same network; firmware restart needs UEFI boot'],
          ['On-demand collection', 'Refreshes listening ports, connections, software, printers and hardware right away', 'Use sparingly: it consumes endpoint bandwidth and CPU'],
          ['Send user notice', 'Toast (closes itself) or Modal (requires interaction) on the endpoint screen', 'Ideal to ask the user to save their work'],
          ['Approve zero-touch', 'Releases an endpoint that registered through automatic provisioning and awaits approval', 'Useful when the rollout requires human approval per machine'],
          ['Trash / Restore / Remove permanently', 'Two-step removal with re-sendable remote uninstall', 'Details and cautions in chapter 2.15'],
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Remote debug console',
        text: 'At /agents/remote-debug-console you open a diagnostics terminal on the endpoint with controlled verbs (service status, active transport, queues, hardware identity) — without starting a full remote session.',
      },
    ],
  },
  {
    id: 'agent-labels',
    part: 'operation',
    navLabel: '2.3. Automatic labels',
    badge: 'Part 2 · Chapter 3 · Segmentation',
    title: 'Automatic labels: tag the fleet by rule, not by hand',
    lead: 'Labels are tags applied automatically to machines that satisfy an expression. They become a fleet filter and, above all, the scope of automation tasks and policies.',
    blocks: [
      {
        type: 'paragraphs',
        items: [
          'A label rule has a NAME, a LABEL (the tag to be applied), an application MODE and an EXPRESSION combining conditions with AND/OR.',
          'Evaluation uses the inventory the agent already sends (OS, hardware, software, disks and custom fields), so the label stays correct on its own as machines change.',
        ],
      },
      {
        type: 'table',
        caption: 'Rule application modes',
        headers: ['Mode', 'What it does', 'Caution'],
        rows: [
          ['Apply only', 'Adds the label when the condition is true; never removes it', 'The label may stick if the machine stops matching'],
          ['Apply and remove', 'Adds when it matches and removes when it stops matching (automatic labels only)', 'Never touches manual labels'],
          ['Manual', 'The rule does not act on its own: the label is available for manual application on the agent detail', 'Useful for process tags (e.g. "Under audit")'],
          ['Remove manual labels', 'Removes MANUAL labels while the condition is true, with an Exact, Prefix or Regex target', 'Never removes protected labels'],
        ],
      },
      {
        type: 'table',
        caption: 'Fields available in the expression',
        headers: ['Group', 'Fields'],
        rows: [
          ['Identification', 'Hostname, Display Name, IP Address, Operating System, OS Version, Status'],
          ['Software', 'Software Name, Publisher, Version, Installed Software Count'],
          ['Hardware', 'Processor, Cores, Threads, Total Memory, GPU, VRAM, Disk Count, MachineScore'],
          ['Disks (inside a DiskGroup node)', 'Drive Letter, % Free, Free Space, Total Capacity, File System, Media Type'],
          ['Metadata', 'Agent Custom Field, Client Custom Field, Site Custom Field'],
        ],
      },
      {
        type: 'paragraphs',
        items: [
          'Text operators: contains, not contains, starts with, ends with, equals, not equals and regex. Numeric operators: equals, not equals, greater than, greater than or equal, less than, less than or equal. The Status field accepts equals/not equals only.',
          'Expression safety limits: maximum depth 8, at most 128 nodes, 20 children per group and regex up to 256 characters. Protected labels can never be the target of a removal rule.',
        ],
      },
      {
        type: 'steps',
        title: 'How to create and validate a rule',
        items: [
          {
            title: '1. Create the rule',
            description: 'In Automation → Agent labels, click New rule. Provide name, label, description, application mode and build the expression in the visual builder.',
            route: 'Automation → Agent labels (/automation/agent-labels)',
          },
          {
            title: '2. Simulate on one agent (dry-run)',
            description: 'Before enabling it, run the simulation on a real endpoint. The result shows whether it matched, which automatic and manual labels the agent has today, what would be added/removed and which conditions failed.',
          },
          {
            title: '3. Measure fleet impact',
            description: 'Run the batch impact analysis to estimate how many machines would match, with an agent sample. That prevents applying a label to 2,000 machines by mistake.',
          },
          {
            title: '4. Enable and, if needed, reprocess',
            description: 'Enable the rule. On large fleets, trigger the reprocessing job and follow progress by percentage until it completes.',
          },
          {
            title: '5. Follow the history',
            description: 'Every application/removal is logged with origin (automatic/manual), action, responsible rule, actor and date — auditable per agent.',
          },
        ],
      },
      {
        type: 'code',
        title: 'Expression examples (exportable per rule)',
        language: 'json',
        snippet: `// 1) Corporate laptops: Windows 11 AND any disk below 15% free
{
  "nodeType": "Group",
  "logicalOperator": "And",
  "children": [
    { "nodeType": "Condition", "field": "OperatingSystem", "operator": "Contains", "value": "Windows 11" },
    {
      "nodeType": "DiskGroup",
      "logicalOperator": "Or",
      "children": [
        { "nodeType": "Condition", "field": "DiskFreeSpacePercent", "operator": "LessThan", "value": "15" }
      ]
    }
  ]
}

// 2) Machines with AutoCAD installed -> label "AutoCAD"
{
  "nodeType": "Group",
  "logicalOperator": "Or",
  "children": [
    { "nodeType": "Condition", "field": "SoftwareName", "operator": "Contains", "value": "AutoCAD" },
    { "nodeType": "Condition", "field": "SoftwarePublisher", "operator": "Contains", "value": "Autodesk" }
  ]
}

// 3) Finance department by custom field (requires customFieldDefinitionId)
{
  "nodeType": "Group",
  "logicalOperator": "And",
  "children": [
    {
      "nodeType": "Condition",
      "field": "AgentCustomField",
      "customFieldDefinitionId": "00000000-0000-0000-0000-000000000000",
      "operator": "Equals",
      "value": "Finance"
    }
  ]
}`,
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'What it is for in practice',
        text: 'Once created, the label becomes a task scope (Included/Excluded Tags), a filter in the agent list and a grouping in reports. It is the cheapest way to apply a policy only to the right part of the fleet.',
      },
    ],
  },
  {
    id: 'remote-access',
    part: 'operation',
    navLabel: '2.4. Remote access',
    badge: 'Part 2 · Chapter 4 · Sessions',
    title: 'Remote access: screen, terminal, files, registry and WebRDP',
    lead: 'Remote sessions run over NATS, with configurable consent, a banner excluded from capture and fail-closed guards on the endpoint.',
    blocks: [
      {
        type: 'table',
        caption: 'Remote session capabilities',
        headers: ['Capability', 'How it works', 'Configuration'],
        rows: [
          ['Remote screen', 'DXGI Desktop Duplication with GDI fallback; dirty rects and HDR tone mapping', 'Session limits and recording in /settings/remote-access'],
          ['Remote terminal', 'Isolated ConPTY; runAs=user is fail-closed (never degrades to SYSTEM)', 'Right per role; command auditing'],
          ['Remote files', 'DF binary protocol with handle cache and 256 KB chunks', 'No token in the URL; access through the NATS session'],
          ['Processes', 'List, terminate and start processes with a guard', 'Destructive actions require confirmation'],
          ['Registry', 'Registry editor blocking SAM/SECURITY/LSA and Run/RunOnce', 'Fail-closed guard on the agent'],
          ['LAN HTTP/WS proxy', 'Forwards LAN requests through the endpoint (e.g. reach a printer panel)', 'Allowlist in /settings/proxy-policy'],
          ['WebRDP / RDP tunnel', 'Multiplexed tunnel to TermService, ephemeral port on 127.0.0.1', '/settings/remote-webrtc and the NoRdp=128 right'],
          ['Screen over WebRTC', 'WebRTC transport negotiated by the server, with fallback to the NATS path', '/settings/remote-webrtc (preferred transport and limits)'],
          ['Remote debug log level', 'Live log level change (e.g. info → debug) during a diagnostics session', 'Remote debug console (/agents/remote-debug-console)'],
        ],
      },
      {
        type: 'steps',
        title: 'Opening a session safely',
        items: [
          {
            title: '1. Check the consent policy',
            description: 'If consent is required, the user sees a request with a countdown on screen before any capture starts.',
            route: 'Settings → Consent (/settings/remote-consent)',
          },
          {
            title: '2. Start the session from the agent detail',
            description: 'Choose the session type (screen, terminal, files, registry, proxy or WebRDP). Your role rights define what is available.',
            route: '/agents/:id · /agents/remote-session',
          },
          {
            title: '3. Announce it and keep the banner visible',
            description: 'During the session a floating banner stays visible to the user and is excluded from capture — the employee always knows they are being assisted.',
          },
          {
            title: '4. Close cleanly',
            description: 'End the session, confirm that the recording (when enabled) was saved and log the service in the ticket.',
          },
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'The LAN proxy is fail-closed',
        text: 'If the destination allowlist is empty, no LAN request is forwarded. Configure RemoteAccess:Proxy:DefaultAllowlist and AllowedPorts and keep the list as short as possible.',
      },
      {
        type: 'accordion',
        title: 'Rights, limits and transparency',
        items: [
          {
            summary: 'Rights per role (NoProxy, NoRdp)',
            paragraphs: [
              'Rights become ACLs in the NATS session and an ephemeral ticket: NoProxy=64 blocks the LAN proxy and NoRdp=128 blocks WebRDP for that technician.',
              'Without the right, the capability is not shown in the interface and the server refuses to issue the ticket.',
            ],
            route: '/identity/roles',
          },
          {
            summary: 'Concurrent limits and bandwidth',
            paragraphs: [
              'The default is 5 concurrent sessions per type. Tune it to your operation so you do not saturate the client link.',
              'The remote screen uses dirty rects and compression to reduce bandwidth; poor links can be served through the terminal, which is far lighter.',
            ],
            route: '/settings/remote-access',
          },
          {
            summary: 'Session recording',
            paragraphs: [
              'Recording is optional and stored in object storage. Enable it only where audit is required and inform the user.',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'automation-scripts',
    part: 'operation',
    navLabel: '2.5. Script library',
    badge: 'Part 2 · Chapter 5 · Scripts',
    title: 'Script library: write once, use across the whole fleet',
    lead: 'Versioned, parameterised scripts replace the famous "command only one person knows". They can read custom fields, write results back and become sensors.',
    blocks: [
      {
        type: 'steps',
        title: 'How to register a script',
        items: [
          {
            title: '1. Create the script',
            description: 'Provide name, description, shell (PowerShell or CMD/Batch) and the body. Every edit creates a new revision with history.',
            route: 'Automation → Scripts (/automation/scripts)',
          },
          {
            title: '2. Declare parameters and variables',
            description: 'Parameters become arguments at execution time; environment variables deliver context without interpolating on the command line.',
          },
          {
            title: '3. Choose the output destination',
            description: 'Output can become an agent note (with task, exit code, error and up to 4000 characters) or feed a collector custom field.',
            route: 'Script → Output',
          },
          {
            title: '4. Run it on a test agent',
            description: 'Run it through an automation task on a pilot endpoint before applying it to the fleet. Follow it in Operations.',
            route: 'Operations (/automation/operations)',
          },
          {
            title: '5. Reuse it',
            description: 'The same script can be used by several tasks, by script sensors and by the reverse view of custom fields.',
          },
        ],
      },
      {
        type: 'code',
        title: 'Example: parameterised script that reads a custom field and writes a result',
        language: 'powershell',
        snippet: `param(
  [string]$LogPath = 'C:\\Windows\\Temp\\discovery-cleanup.log'
)

$fields = $null
if ($env:MDZ_CUSTOM_FIELDS) { $fields = $env:MDZ_CUSTOM_FIELDS | ConvertFrom-Json }

# Uses a custom field as context ([[campo:key]] interpolation also works)
$days = if ($fields.log_retention_days) { [int]$fields.log_retention_days } else { 30 }
$limit = (Get-Date).AddDays(-$days)

$targets = Get-ChildItem 'C:\\Windows\\Temp' -File -ErrorAction SilentlyContinue |
           Where-Object { $_.LastWriteTime -lt $limit }

$bytes = ($targets | Measure-Object Length -Sum).Sum
$targets | Remove-Item -Force -ErrorAction SilentlyContinue

Write-Output "Removed $($targets.Count) files older than $days days ($bytes bytes)."

# The last non-empty line can feed a collector field (e.g. freed_space_mb)
Write-Output ('MDZ_COLLECT: {"name":"last_cleanup_mb","value":"' + [math]::Round($bytes / 1MB, 2) + '"}')
exit 0`,
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Custom fields in the script runtime',
        text: 'MDZ_CUSTOM_FIELDS is a JSON object with the fields enabled for reading (secrets and null values are omitted). [[campo:key]] is expanded in the command, the arguments and the script body, keeping the integrity hash of the original content.',
      },
      {
        type: 'table',
        caption: 'Mandatory best practices',
        headers: ['Practice', 'Why'],
        rows: [
          ['Handle errors and exit with the correct code', 'A collector task only writes on success'],
          ['Keep output short and objective', 'The result is truncated and kept in the service history'],
          ['Never interpolate sensitive data on the command line', 'Secret fields never appear in clear text'],
          ['Test on a pilot endpoint', 'Avoids surprises on 2,000 machines'],
          ['Version instead of overwriting', 'Enables auditing and rollback'],
        ],
      },
    ],
  },
  {
    id: 'automation-tasks',
    part: 'operation',
    navLabel: '2.6. Automation tasks',
    badge: 'Part 2 · Chapter 6 · Automation',
    title: 'Automation tasks: install, update, remove and run at scale',
    lead: 'The task is the unit of execution: one action, a target defined by scope and tags, configurable triggers and a controlled user experience.',
    blocks: [
      {
        type: 'table',
        caption: 'Action types',
        headers: ['Action', 'What it does', 'Sources'],
        rows: [
          ['InstallPackage', 'Installs an application silently', 'Winget, Chocolatey or a custom package'],
          ['UpdatePackage', 'Updates when already installed', 'Winget, Chocolatey or custom'],
          ['UpdateOrInstallPackage', 'Guarantees the desired state (install or update)', 'Winget, Chocolatey or custom'],
          ['RemovePackage', 'Uninstalls silently', 'Winget, Chocolatey or custom'],
          ['RunScript', 'Runs a versioned script from the library', 'PowerShell, Batch/CMD'],
          ['CustomCommand', 'Runs a one-off command with no reusable script', 'Windows shell/CLI'],
        ],
      },
      {
        type: 'steps',
        title: 'Building an end-to-end task',
        items: [
          {
            title: '1. Choose the action and package',
            description: 'In Automation → Tasks, click New Task and select the action and package source in the integrated selector.',
            route: 'Automation → Tasks (/automation/tasks)',
          },
          {
            title: '2. Define scope and tags',
            description: 'Global, Client, Site or a specific agent — and refine with Included/Excluded Tags (for example, apply only to "Finance" and exclude "Servers").',
          },
          {
            title: '3. Configure triggers and order',
            description: 'Combine immediate execution, recurring (with the visual cron assistant), at user logon or at agent check-in. executionOrder chains prerequisites.',
          },
          {
            title: '4. Tune the user experience',
            description: 'Silent or Toast notice before/after, with optional defer (allowDefer), a time limit and controlled process closing (chrome.exe, outlook.exe).',
          },
          {
            title: '5. Respect the window and monitor',
            description: 'Mark whether the task must respect the Site maintenance window and follow status (pending, running, success, error, deferred) in Operations and Audit.',
            route: 'Operations (/automation/operations) · Audit (/automation/audit)',
          },
        ],
      },
      {
        type: 'code',
        title: 'Practical example: guarantee the backup agent on every machine of a site',
        language: 'text',
        snippet: `Task: "Ensure Backup Agent"
  Action:           UpdateOrInstallPackage
  Source:           Chocolatey
  Package:          backup-agent
  Scope:            Site "acme-datacenter"
  Excluded tags:    Legacy-Servers
  Trigger:          At agent check-in (recurring)
  Window:           Respect the site maintenance window (01:00-05:00)
  UX:               Silent
  Order:            1) Install runtime  2) Install backup agent
  Post-execution:   RunScript "validate-backup-service" -> writes a custom field`,
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'P2P distribution inside the Site',
        text: 'Large packages are replicated between the site agents themselves over libp2p: the first endpoint downloads from the WAN and the rest copy over the LAN, verified by SHA-256. This drastically reduces the client link consumption.',
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Start small',
        text: 'Always test the task on a pilot agent and then on a small site. Removal actions and custom commands have no automatic undo.',
      },
    ],
  },
  {
    id: 'software-store',
    part: 'operation',
    navLabel: '2.7. Software & App Store',
    badge: 'Part 2 · Chapter 7 · Software',
    title: 'Software inventory, catalogue and self-service App Store',
    lead: 'See what is installed across the fleet, publish approved packages and let employees install what IT has released on their own.',
    blocks: [
      {
        type: 'table',
        caption: 'Software screens',
        headers: ['Screen', 'Route', 'What it does'],
        rows: [
          ['Overview', '/software', 'Summary of inventory, catalogue and in-house packages'],
          ['Detailed inventory', '/software/inventory', 'Every installed application, versions and per endpoint'],
          ['Store / catalogue', '/software/store', 'Winget and Chocolatey catalogue, approval and publication'],
          ['Custom package', '/software/store/custom/new', 'Editor for an in-house package with the installer uploaded to the server'],
          ['Tasks and scripts', '/automation', 'Execution and automation behind the packages'],
        ],
      },
      {
        type: 'steps',
        title: 'Publishing an application in the App Store',
        items: [
          {
            title: '1. Choose the source',
            description: 'Winget or Chocolatey for public software; a custom package when the installer is internal or needs its own parameters.',
          },
          {
            title: '2. Configure the package',
            description: 'Define name, version, icon, install/uninstall commands, silent arguments and requirements (OS, architecture).',
            route: '/software/store/custom/new',
          },
          {
            title: '3. Define the publication scope',
            description: 'Publish to Global, Client, Site or a group of agents by label. The employee only sees what was released for them.',
          },
          {
            title: '4. Approve and test',
            description: 'Install on a pilot endpoint through an automation task and confirm the result in Operations before opening it to the fleet.',
          },
          {
            title: '5. Track the inventory',
            description: 'Use the inventory to measure adoption and versions, and remove unauthorised software with a RemovePackage task.',
            route: '/software/inventory',
          },
          {
            title: '6. Operate the approval cycle and catalogue cleanup',
            description: 'The store has Approvals and Audit tabs: approve packages and track who approved what, and when. Removed in-house packages go to a trash panel, and the screen also offers orphan package cleanup (no binding) — keeping object storage clean. Catalogue synchronization (Winget) runs in the background and its status shows on the same screen.',
            route: '/software/store (Approvals, Audit and Trash tabs)',
          },
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Installation without an administrator password',
        text: 'The App Store exists exactly for this: the employee clicks Install and the SYSTEM service performs the installation. Nobody needs administrative credentials to get approved software.',
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'A custom package is code running as SYSTEM',
        text: 'Treat every package as privileged code: validate the installer origin, prefer an Authenticode signature and always test on a pilot before publishing.',
      },
    ],
  },
  {
    id: 'patches',
    part: 'operation',
    navLabel: '2.8. Patches & Windows Update',
    badge: 'Part 2 · Chapter 8 · Patches',
    title: 'Patch management: policy, approval, compliance and exceptions',
    lead: 'DiscoveryRMM inventories, approves and installs Windows updates while respecting maintenance windows and severity.',
    blocks: [
      {
        type: 'table',
        caption: 'Patch screens',
        headers: ['Screen', 'Route', 'What it does'],
        rows: [
          ['Overview', '/patches', 'Fleet compliance and risk panel'],
          ['Updates', '/patches/updates', 'Detected updates per endpoint and their status'],
          ['Inventory', '/patches/inventory', 'Catalogue of known updates'],
          ['Pending', '/patches/pending', 'What is missing and for how long'],
          ['Approvals', '/patches/approvals', 'Approve, block or install outside the window'],
          ['Compliance', '/patches/compliance', 'Percentage of the fleet up to date by classification'],
          ['Policy', '/patches/policy', 'Automatic approval by severity, grace period and windows'],
        ],
      },
      {
        type: 'steps',
        title: 'Recommended policy configuration',
        items: [
          {
            title: '1. Define the maintenance window per Site',
            description: 'Use the Site IANA time zone to install outside business hours. Datacenter sites can have more aggressive windows.',
          },
          {
            title: '2. Approve by severity',
            description: 'Automatic approval for Critical and Security; manual for Drivers and optional updates, which often break peripherals.',
          },
          {
            title: '3. Configure grace period and deferral',
            description: 'Grace days to validate on a pilot and a limit to user deferrals, without allowing indefinite postponement.',
          },
          {
            title: '4. Handle exceptions with a task',
            description: 'For a security emergency, trigger the installation outside the window with an automation task targeted at a specific label.',
          },
          {
            title: '5. Measure weekly',
            description: 'Track compliance per Client and Site and treat machines outside policy as an incident.',
          },
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'How collection works',
        text: 'On Windows the agent uses the Windows Update Agent (WUA) COM API to inventory and install updates. That means the same mechanism as WSUS/Windows Update is used, with no third-party agent.',
      },
    ],
  },
  {
    id: 'sensors',
    part: 'operation',
    navLabel: '2.9. Sensors & thresholds',
    badge: 'Part 2 · Chapter 9 · Monitoring',
    title: 'Sensors: the agent measures, the server decides',
    lead: 'Sensors collect metrics at the configured interval and the server applies thresholds. Editing a threshold does not require re-syncing the endpoint.',
    blocks: [
      {
        type: 'table',
        caption: 'Catalogue of the 20 sensor types: primary channel and evaluation rule',
        headers: ['Type', 'Primary channel', 'Rule'],
        rows: [
          ['DiskSpace', 'free_percent', 'Free below critical → Failing; below warning → Warning; missing volume → Failing'],
          ['Cpu', 'used_percent', 'Usage above critical → Failing; above warning → Warning'],
          ['Memory', 'used_percent', 'Usage above critical → Failing; above warning → Warning'],
          ['Uptime', 'uptime_seconds', 'Uptime below warning → Warning (detects unexpected reboots)'],
          ['Service', 'running', 'Service stopped → Failing with the configured severity'],
          ['Process', 'running', 'Process missing → Failing'],
          ['Ping', 'latency_avg_ms', 'Loss above zero or no reply → Failing; otherwise latency thresholds'],
          ['TcpPort', 'open', 'Port closed → Failing; open → optional connect_ms threshold'],
          ['HttpProbe', 'total_ms', 'Status outside 2xx/3xx → Failing; otherwise the time threshold'],
          ['HttpThroughput', 'download_mbps', 'Below the threshold → Failing/Warning (lower is worse)'],
          ['DnsLatency', 'resolve_ms', 'Above the threshold → Failing/Warning'],
          ['EventLogRate', 'event_count', 'Events counted in the queried window (window_minutes) above the threshold → Warning/Failing'],
          ['SmartStatus', 'smart_ok', 'SMART not healthy → Failing; temperature_c and reallocated_sectors feed the diagnosis'],
          ['CertificateExpiry', 'days_to_expiry', 'Days to expiry below the threshold → Warning/Failing'],
          ['DefenderStatus', 'defender_ok', 'Real-time protection disabled → Failing; signature_age_days tracks signature age'],
          ['BitLocker', 'bitlocker_on', 'Volume not protected → Failing; encryption_percent shows encryption progress'],
          ['DiskIo', 'busy_percent', 'Disk busy above the threshold → Warning/Failing; also exposes read_bps, write_bps and latency_ms'],
          ['Bandwidth', 'rx_bps', 'Received traffic above the threshold → Warning/Failing; tx_bps shows the outbound side'],
          ['ADConsistency', 'replication_failures', 'Domain controllers only: replication, dcdiag or clock drift failures → Failing; outside a DC collection returns empty (Unknown)'],
          ['Script', 'declared channel', 'MDZ_STATUS > exit code map > primary channel threshold'],
        ],
      },
      {
        type: 'paragraphs',
        items: [
          'Possible states: Passing, Warning, Failing, Unknown (collection error), Pending (awaiting the first reading) and Stale (no recent data). A Failing state is never masked by Stale.',
          'The Bandwidth, DiskIo, EventLogRate, SmartStatus, CertificateExpiry, DefenderStatus, BitLocker and ADConsistency collectors are native to the Windows agent; on platforms without a collector the type returns Unknown with RunError instead of inventing a value.',
          'Comparison is strict and in floating point, without rounding first: 15.0% free with a 15% warning threshold still passes. FailsBeforeAlert (default 2) controls only the ALERT — the interface shows the real state on the first failure. During the maintenance window the state updates but the alert is not triggered.',
          'Two form options deserve attention: sustainSamples (hysteresis) requires N consecutive readings in the same condition before the state changes, preventing alerts from isolated spikes; and restartIfStopped, available for Service sensors, tells the agent to try restarting a stopped service — the attempt becomes evidence (restartAttempted / restartSucceeded) while the server still decides the final state.',
        ],
      },
      {
        type: 'steps',
        title: 'Registering a native sensor',
        items: [
          {
            title: '1. Open sensor management',
            description: 'Create the definition with type, scope (Global, Client, Site or Agent), target, interval and Warning/Critical thresholds.',
            route: 'Sensors → Manage (/sensors/manage)',
          },
          {
            title: '2. Use the recommended sensors on first access',
            description: 'On the detail of an agent without sensors, the "Add recommended sensors" button creates disk, CPU, memory and uptime at once.',
            route: '/agents/:id?tab=sensores',
          },
          {
            title: '3. Validate collection',
            description: 'Run "Run now" and check current value, sparkline and last execution. Fix wrong thresholds before generating alerts in bulk.',
          },
          {
            title: '4. Watch the fleet',
            description: 'The fleet view shows how many devices are in Warning/Failing per type, with historical charts per channel.',
            route: 'Sensors → Fleet (/sensors)',
          },
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Retention',
        text: 'Raw samples are kept for 7 days, events for 90 days and rollups (hour/day) for 400 days. The current state is never deleted, so long history stays readable after raw samples are discarded.',
      },
    ],
  },
  {
    id: 'sensor-script',
    part: 'operation',
    navLabel: '2.10. Script sensors',
    badge: 'Part 2 · Chapter 10 · Script sensor',
    title: 'Script sensors: monitor what only exists in your environment',
    lead: 'When no native type covers the metric, a PowerShell script becomes a sensor: it emits status and channels, and the server applies thresholds, alerts and Auto-Tickets.',
    blocks: [
      {
        type: 'paragraphs',
        items: [
          'The script runs on the endpoint (as the service, with no user context) under a timeout and with output truncation. It talks to the agent through a line protocol on stdout, consumed before the rest of the output becomes a log.',
        ],
      },
      {
        type: 'code',
        title: 'MDZ protocol read from stdout',
        language: 'text',
        snippet: [
          'MDZ_STATUS: OK | WARNING | CRITICAL | UNKNOWN   # overrides the state evaluated from thresholds',
          'MDZ_MESSAGE: short text shown in the alert and the history',
          'MDZ_METRIC: key=value,other_key=value          # several metrics per line',
          'MDZ_METRIC_JSON: {"key": 12.4, "other": 2.1}    # metrics as JSON (single line)',
        ].join(String.fromCharCode(10)),
      },
      {
        type: 'table',
        caption: 'Extractors: how to read the script output',
        headers: ['Type', 'Purpose', 'Example'],
        rows: [
          ['mdz', 'The simplest path: the script already emits MDZ_METRIC', '{ "type": "mdz", "channel": "anydesk_installed" }'],
          ['regex', 'Reuses existing scripts and captures one group', '{ "type": "regex", "channel": "free_gb", "regex": "Free: ([0-9.]+) GB", "scale": 1, "aggregate": "last" }'],
          ['json', 'Reads a value by path in the JSON output', '{ "type": "json", "channel": "download_mbps", "jsonPath": "download.bandwidth", "scale": 8e-6, "aggregate": "avg" }'],
        ],
      },
      {
        type: 'paragraphs',
        items: [
          'The aggregator (last, first, min, max, avg, sum) decides what to do when the script returns several samples — the default is last. The scale multiplier converts the read value (useful to turn bytes into Mbps, for example).',
          'The exit code map translates the exit code into a state: ready-made presets are Tactical RMM (0 = ok, 1 = failure), Community (0 = ok, 1 = warning, 2 = critical) and Simple (only 0 passes). Codes outside the rules follow the unlistedNonZero entry.',
        ],
      },
      {
        type: 'steps',
        title: 'Creating a script sensor',
        items: [
          {
            title: '1. Open the full script sensor editor',
            description: 'Provide name, scope, target, interval, the channels the sensor exposes, the script, the extractors and the exit code map.',
            route: 'Sensors → Script editor (/sensors/script)',
          },
          {
            title: '2. Declare the channels and set thresholds',
            description: 'Each channel has a unit and a direction (higher is worse or lower is worse). The threshold is per channel, with Warning and Critical levels.',
          },
          {
            title: '3. Use the extractor skeleton',
            description: 'The editor automatically generates an mdz extractor for each declared channel — the simplest and least error-prone path.',
          },
          {
            title: '4. Test on an endpoint and force sync',
            description: 'Run "Run now" on the agent and check value, state and message. If the channel stays empty, review the key name in MDZ_METRIC.',
          },
          {
            title: '5. Wire alerts and Auto-Ticket',
            description: 'When it reaches Critical for N consecutive samples, the sensor can open a ticket automatically and comment/close when it recovers.',
            route: '/tickets/auto-rules',
          },
        ],
      },
      {
        type: 'code',
        title: 'EXAMPLE 1 — Compliance sensor: are AnyDesk and TeamViewer installed? What is the ID?',
        language: 'powershell',
        snippet: `# Channels declared on the sensor: anydesk_installed, teamviewer_installed
# Suggested thresholds: either channel = 1 is Passing; 0 is Critical/Failing
# Exit codes: Community (0 = ok, 1 = warning, 2 = critical)
$ErrorActionPreference = 'SilentlyContinue'

function Get-AnyDeskId {
  $exe = @(
    "$env:ProgramFiles\\AnyDesk\\AnyDesk.exe",
    "$env:ProgramW6432\\AnyDesk\\AnyDesk.exe",
    "C:\\Program Files (x86)\\AnyDesk\\AnyDesk.exe"
  ) | Where-Object { Test-Path $_ } | Select-Object -First 1

  if ($exe) { return ((& $exe --get-id) -join '').Trim() }

  $conf = Join-Path $env:ProgramData 'AnyDesk\\system.conf'
  if (Test-Path $conf) {
    $m = Select-String -Path $conf -Pattern '^ad\\.anynet\\.id=(.+)$' | Select-Object -First 1
    if ($m) { return $m.Matches.Groups[1].Value.Trim() }
  }
  return $null
}

function Get-TeamViewerId {
  $tv = (Get-ItemProperty 'HKLM:\\SOFTWARE\\WOW6432Node\\TeamViewer' -Name ClientID).ClientID
  if (-not $tv) { $tv = (Get-ItemProperty 'HKLM:\\SOFTWARE\\TeamViewer' -Name ClientID).ClientID }
  if (-not $tv) {
    $exe = 'C:\\Program Files (x86)\\TeamViewer\\TeamViewer.exe'
    if (Test-Path $exe) { $tv = ((& $exe --id) -join '').Trim() }
  }
  return ($tv -replace '\\s', '').Trim()
}

$anydesk    = Get-AnyDeskId
$teamviewer = Get-TeamViewerId
$missing = @()
if (-not $anydesk)    { $missing += 'AnyDesk' }
if (-not $teamviewer) { $missing += 'TeamViewer' }

# Numeric channels: 1 = installed, 0 = missing
Write-Output ('MDZ_METRIC: anydesk_installed=' + $(if ($anydesk) { 1 } else { 0 }) + ',teamviewer_installed=' + $(if ($teamviewer) { 1 } else { 0 }))

# Identifiers for human reading (they appear in the sensor message)
Write-Output ("MDZ_MESSAGE: AnyDesk=" + $(if ($anydesk) { $anydesk } else { 'missing' }) + " | TeamViewer=" + $(if ($teamviewer) { $teamviewer } else { 'missing' }))

if ($missing.Count -gt 0) {
  Write-Output 'MDZ_STATUS: CRITICAL'
  exit 2
}
Write-Output 'MDZ_STATUS: OK'
exit 0`,
      },
      {
        type: 'code',
        title: 'EXAMPLE 1 — Extractors and exit code map to paste into the editor',
        language: 'json',
        snippet: `// Extractors (ExtractorsJson): one mdz extractor per declared channel
[
  { "type": "mdz", "channel": "anydesk_installed" },
  { "type": "mdz", "channel": "teamviewer_installed" }
]

// Exit code map (ExitCodeMapJson)
[
  { "codes": [0], "status": "Passing", "message": "Remote access tools present." },
  { "codes": [2], "status": "Failing", "severity": "Critical", "message": "Remote access tool missing on the endpoint." },
  { "unlistedNonZero": { "status": "Failing", "severity": "Critical" } }
]`,
      },
      {
        type: 'code',
        title: 'EXAMPLE 2 — Backup health and log queue sensor',
        language: 'powershell',
        snippet: `# Declared channels: backup_service (1/0), log_mb (numeric), errors_last_hour (numeric)
$ErrorActionPreference = 'SilentlyContinue'

# 1) Backup agent service (adjust to your vendor name)
$service = Get-Service -Name 'BackupAgentSvc'
$serviceOk = if ($service -and $service.Status -eq 'Running') { 1 } else { 0 }

# 2) Backup log folder size
$folder = 'C:\\ProgramData\\BackupAgent\\logs'
$logMb = 0
if (Test-Path $folder) {
  $logMb = [math]::Round(((Get-ChildItem $folder -File | Measure-Object Length -Sum).Sum / 1MB), 1)
}

# 3) Application log errors in the last hour
$since = (Get-Date).AddHours(-1)
$errors = (Get-WinEvent -FilterHashtable @{ LogName='Application'; Level=2; StartTime=$since } -ErrorAction SilentlyContinue | Measure-Object).Count
if (-not $errors) { $errors = 0 }

Write-Output ('MDZ_METRIC: backup_service=' + $serviceOk + ',log_mb=' + $logMb + ',errors_last_hour=' + $errors)
Write-Output ("MDZ_MESSAGE: service=$serviceOk log_mb=$logMb errors_1h=$errors")

if ($serviceOk -eq 0) { Write-Output 'MDZ_STATUS: CRITICAL'; exit 2 }
if ($logMb -gt 500 -or $errors -gt 50) { Write-Output 'MDZ_STATUS: WARNING'; exit 1 }
Write-Output 'MDZ_STATUS: OK'
exit 0`,
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Sensor or custom field?',
        text: 'Use a SENSOR when you want state, threshold, history, chart and alert (for example: any remote access tool missing). Use a CUSTOM FIELD with a collector task when you want to STORE a textual value for lookup and filtering (for example: that machine AnyDesk ID). The example in chapter 1.8 shows collection writing into a custom field.',
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'The channel name is a contract',
        text: 'The key emitted in MDZ_METRIC must be exactly the key declared on the sensor and in the extractor. A wrong key raises no visible error: the channel simply stays empty.',
      },
    ],
  },
  {
    id: 'monitoring-reports',
    part: 'operation',
    navLabel: '2.11. Alerts, notifications & reports',
    badge: 'Part 2 · Chapter 11 · Monitoring and reports',
    title: 'From collection to report: alerts, notifications and evidence',
    lead: 'A failing sensor produces a state transition, an event, a notification and — when configured — an automatic ticket. All of it becomes report data.',
    blocks: [
      {
        type: 'paragraphs',
        items: [
          'Sample ingestion evaluates the state and, on a transition (opened, escalated or resolved), records a monitoring event and fires the enabled integrations: Auto-Ticket, in-app notification and external channels (e-mail and webhook).',
          'Everything is best-effort: if the e-mail fails, the sample and the state remain valid. The switches live in the sensor configuration, and external notification depends on AutoTicket:Enabled on the server.',
        ],
      },
      {
        type: 'table',
        caption: 'Notification channels',
        headers: ['Channel', 'Configuration', 'Typical use'],
        rows: [
          ['In-app', '/settings/notifications', 'Immediate notice for whoever is in the Console'],
          ['E-mail (SMTP)', '/settings/notifications', 'Escalation to on-call and the daily digest'],
          ['Webhook', '/settings/notifications', 'Integration with Slack/Teams or internal systems'],
          ['Web Push', '/settings/notifications', 'Browser notification for the technician'],
          ['Windows toast', 'Automation task', 'User notice during install/remove'],
        ],
      },
      {
        type: 'steps',
        title: 'Generating reports',
        items: [
          {
            title: '1. Pick a ready template or create your own',
            description: 'The catalogue ships models for fleet health, patches, inventory and SLA. The wizard creates custom models by choosing datasets, columns, filters and groupings.',
            route: 'Reports → Templates (/reports/templates) · Catalogue (/reports/templates/catalog)',
          },
          {
            title: '2. Run on demand',
            description: 'Parameterise client, site, period and format and generate it on the spot to check the result.',
            route: 'Reports → Run (/reports/run)',
          },
          {
            title: '3. Schedule delivery',
            description: 'Create recurring schedules with recipients and format (XLSX, CSV or Markdown) using the Site time zone. PDF generation no longer runs on the server: use the HTML report preview and browser printing when you need a PDF.',
            route: 'Reports → Schedules (/reports/schedules)',
          },
          {
            title: '4. Audit the history',
            description: 'Every execution is recorded with status, size and destination, letting you prove delivery to the client.',
            route: 'Reports → Executions (/reports/executions)',
          },
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Sensor dataset',
        text: 'The AgentSensors dataset returns one row per agent/sensor/target with status, severity, channel, value, limits, failures and last collection. It is the ideal base for the monthly monitoring report delivered to the client.',
      },
    ],
  },
  {
    id: 'tickets',
    part: 'operation',
    navLabel: '2.12. Tickets & Service Board',
    badge: 'Part 2 · Chapter 12 · Service Desk',
    title: 'Tickets: queue, device context, SLA and automatic creation',
    lead: 'The DiscoveryRMM Service Desk is born inside the RMM: the ticket already knows which machine it is, what the sensors say and which technician can act.',
    blocks: [
      {
        type: 'table',
        caption: 'Service screens',
        headers: ['Screen', 'Route', 'What it does'],
        rows: [
          ['Service Board', '/service-board', 'Unified operational view of queue, alerts and client health'],
          ['Tickets (list/Kanban)', '/tickets', 'Queue with filters by department, priority, status, technician and SLA risk'],
          ['Ticket detail', '/tickets/:id', 'Device context, timeline, live chat and actions'],
          ['Ticket alerts', '/tickets/alerts', 'Alert rules by time/condition'],
          ['SLA', '/tickets/sla', 'Targets, calendars and service profiles'],
          ['CSAT', '/tickets/csat', 'Satisfaction surveys and indicators'],
          ['Macros', '/tickets/macros', 'Response + status + assignment in one click'],
          ['Templates', '/tickets/templates', 'Structured intake'],
          ['Workflow', '/settings/workflow · /settings/workflow-profiles', 'States, transitions and per-client profiles'],
          ['Auto-Tickets', '/tickets/auto-policy · /tickets/auto-rules', 'Automatic creation from sensors/events'],
          ['Interactive alerts', '/tickets/alerts', 'Toast or Modal notice on the endpoint screen for specific workflow states, with actions and timeout'],
          ['Saved views and KPI', '/tickets', 'Saved filters per technician plus queue and service indicators'],
          ['Escalation', '/tickets/sla · /settings/workflow-profiles', 'Escalation rules per workflow profile and SLA targets'],
        ],
      },
      {
        type: 'steps',
        title: 'Service cycle',
        items: [
          {
            title: '1. Triage',
            description: 'Start from the Service Board or the list/Kanban. Prioritise by SLA risk, sensor severity and client criticality.',
          },
          {
            title: '2. Serve with context',
            description: 'On the ticket detail you see the linked device, recent sensors, inventory and history. Use Live Chat or open a remote session without switching tools.',
          },
          {
            title: '3. Accelerate with macros and runbooks',
            description: 'Apply macros to reply and change status at once; follow linked runbooks for recurring incidents.',
          },
          {
            title: '4. Meet the SLA',
            description: 'First response and resolution targets inside the client business hours, with calendars per region.',
          },
          {
            title: '5. Close and measure',
            description: 'Close in the workflow final state and track CSAT. A ticket closed by a recovered sensor must leave through the configured IsFinal state.',
          },
        ],
      },
      {
        type: 'accordion',
        title: 'Auto-Tickets: how it works',
        items: [
          {
            summary: 'Blocking prerequisite',
            paragraphs: [
              'Each Client (or the Global scope) must have at least one Workflow State with IsFinal equal to true. Without it the engine opens tickets but cannot close them when a sensor recovers.',
            ],
            route: '/settings/workflow',
          },
          {
            summary: 'Policy and AI mode',
            paragraphs: [
              'At /tickets/auto-policy there is a kill switch per Client/Site and the AI mode: Off, Suggest (suggests the action) or AutoApply (applies automatically).',
              'Start with Suggest, follow the quality of the suggestions and only then move to AutoApply.',
            ],
            route: '/tickets/auto-policy',
          },
          {
            summary: 'Rules, deduplication and dry-run',
            paragraphs: [
              'Rules at /tickets/auto-rules define which alert opens a ticket, with deduplication and cooldown so you do not create ten tickets from the same sensor.',
              'Always run the dry-run before enabling: it shows exactly what would have happened.',
            ],
            route: '/tickets/auto-rules',
          },
          {
            summary: 'Auto-assignment, AI learning and ticket difficulty',
            paragraphs: [
              'Automatic assignment starts from the department: tickets that already arrived with an explicit assignee are not reassigned, and a department without a configured strategy does not trigger automatic assignment either.',
              'When the department strategy is AI triage, the ticket enters the triage queue (optionally on creation) instead of receiving an immediate assignee. The department mode defines whether the AI only suggests (a human confirms) or assigns on its own.',
              'Learning has two independent axes — technician skills and weight recalibration — each with three modes: Off, Suggest (generates suggestions the manager approves; default) and Auto (applies within the configured limits). Manual assignee changes feed that learning.',
              'Ticket difficulty is estimated heuristically from the ticket signals and similar tickets, with the rationale recorded — it is triage input, not a promise of resolution time.',
            ],
            route: '/tickets · /tickets/departments · /settings/workflow-profiles',
          },
          {
            summary: 'Interactive alerts, KPI and assisted answers',
            paragraphs: [
              'Rules in /tickets/alerts define, per workflow state, an alert on the user screen: Toast (closes itself) or Modal (requires interaction), with title, message, icon, timeout, actions and a default action.',
              'In the ticket list you save filters (views) per technician and track queue KPIs. The assisted answer search uses embeddings: describe the case and the system suggests answers already used, plus the linked runbook.',
              'Escalation is configured per workflow/SLA profile: when time runs short, the rule raises priority, switches assignee or warns the leadership.',
              'Who can see and act on each ticket follows the department: the per-department ticket permission model is enforced by the API (guard), not only by the list filter.',
            ],
            route: '/tickets/alerts · /settings/workflow-profiles',
          },
        ],
      },
      {
        type: 'table',
        caption: 'Decision sources recorded on automatic assignment',
        headers: ['Source', 'What it means'],
        rows: [
          ['ai', 'The AI picked the assignee and the pick was validated'],
          ['fallback_score', 'The AI answered something invalid or ambiguous; the top of the deterministic score was used'],
          ['fallback_strategy', 'AI unavailable or errored; the deterministic fallback strategy was applied'],
          ['ai_unavailable', 'AI integration disabled or without credentials'],
          ['no_candidates', 'Department without eligible candidates'],
          ['ai_budget_exceeded', 'Rate limit or daily AI budget reached: degrades to fallback, with the reason auditable'],
          ['error', 'Unexpected failure during triage'],
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Chat in a dedicated window',
        text: 'The ticket conversation opens in its own window (/tickets/:id/chat), so it stays alive even if you navigate to another Console screen — just like remote access.',
      },
    ],
  },
  {
    id: 'knowledge-ai',
    part: 'operation',
    navLabel: '2.13. Knowledge, AI & MCP',
    badge: 'Part 2 · Chapter 13 · Knowledge and AI',
    title: 'Knowledge base, tier-1 AI and tool governance',
    lead: 'The DiscoveryRMM AI is not a loose chatbot: it answers from your knowledge base and only uses the MCP tools you authorise.',
    blocks: [
      {
        type: 'steps',
        title: 'Running the knowledge base',
        items: [
          {
            title: '1. Create structured articles',
            description: 'Structured editor with images and hierarchical subpages for long manuals.',
            route: 'Support → Knowledge (/knowledge)',
          },
          {
            title: '2. Set the visibility',
            description: 'Internal articles stay with technicians (and become runbooks); public articles appear in the Agent knowledge tab for the employee.',
          },
          {
            title: '3. Enrich the search',
            description: 'With pgvector embeddings enabled, search is semantic: "printer will not print" finds the right article even with different words.',
          },
        ],
      },
      {
        type: 'table',
        caption: 'AI settings',
        headers: ['Item', 'Route', 'Description'],
        rows: [
          ['AI provider', '/settings', 'OpenRouter, an OpenAI-compatible endpoint or a local Ollama'],
          ['Cost per model', '/settings/ai-cost', 'Consumption cockpit and limits per period'],
          ['MCP tools', '/settings/mcp-tools', 'Which tools the AI may use on the endpoint'],
          ['Knowledge base', '/knowledge', 'Main source of tier-1 answers'],
          ['AI Chat on the endpoint', 'Discovery Agent', 'Conversation with optional screenshot attachment, in the user context'],
          ['Sensor MCP tools', '/settings/mcp-tools', 'The AI checks which sensors a machine has, their current state and the historical series of one sensor'],
          ['Knowledge MCP tools', '/settings/mcp-tools', 'The AI lists and reads knowledge base articles to answer with your company content'],
          ['AI triage and budget', '/settings/ai-cost · Server settings', 'Background automatic ticket triage with a per-client quota and a spend limit'],
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Governance first',
        text: 'Enable only the MCP tools the AI really needs. An enabled tool is the ability to act on the endpoint: treat the list as an administrative permission, not as a catalogue.',
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'AI with cost containment',
        text: 'Track /settings/ai-cost per model and per period. A local model (Ollama) solves environments with sensitive data that cannot leave the network.',
      },
      {
        type: 'accordion',
        title: 'AI guardrails, cards and audit',
        items: [
          {
            summary: 'Input and output guardrails (DLP)',
            paragraphs: [
              'On input, the message is bounded (4,096 bytes by default) and dangerous patterns are refused: script/iframe/object/embed, javascript:, eval( and event attributes such as onclick=.',
              'On output, the model response goes through sanitization that detects and redacts PII and secrets before reaching the user or the Console.',
            ],
          },
          {
            summary: 'Validated rich cards (A2UI)',
            paragraphs: [
              'AI answers can carry interactive cards built from a fixed component catalogue embedded in the agent renderer (Card, Divider, Slider, CheckBox, AudioPlayer and others).',
              'A validator refuses unknown components and dangling references before sending — that is what prevents the user from seeing \\"Component not found\\" instead of the answer.',
            ],
          },
          {
            summary: 'MCP tool audit',
            paragraphs: [
              'Every tool execution triggered by the chat is recorded and can be reviewed in the Audit tab of the MCP screen, with filters by tool and status plus paging.',
              'Recording is best-effort: an audit failure never breaks tool execution or the conversation.',
            ],
            route: '/settings/mcp-tools (Audit tab)',
          },
        ],
      },
    ],
  },
  {
    id: 'integrations',
    part: 'operation',
    navLabel: '2.14. Cross-module integrations',
    badge: 'Part 2 · Chapter 14 · Integrations',
    title: 'How modules talk to each other (and why it matters)',
    lead: 'DiscoveryRMM value lies in cross-domain automation. See the flows that span modules and a real incident narrated end to end.',
    blocks: [
      {
        type: 'table',
        caption: 'Internal integration flows',
        headers: ['Flow', 'Modules involved', 'What happens'],
        rows: [
          ['Alert → Auto-Ticket → AI → Resolution', 'Sensors + Auto-Tickets + Workflow + AI/KB + Notifications', 'A sensor fails past the limit → the rule validates deduplication → opens a ticket in the client workflow → the AI suggests the fix → the sensor recovers and the ticket closes in the IsFinal state'],
          ['Multi-tenancy → Deploy → NATS ACL', 'Clients/Sites + Deploy Tokens + Auth Callout + JetStream', 'The token binds the agent to the Client/Site → the Auth Callout issues a JWT restricted to the tenant subjects'],
          ['IAM → Remote session → agent guards', 'IAM/RBAC + RemoteSessions + Consent + Agent Core', 'Rights (NoProxy=64, NoRdp=128) become ACLs in the session; the agent applies consent and fail-closed guards'],
          ['App Store / Automation → P2P mesh', 'Software + Automation + P2P', 'A large package distributed in the Site is replicated between agents by SHA-256, saving WAN'],
          ['Config inheritance → agent runtime', 'Server/Client/Site Config + Effective + /me/configuration', 'A Console change recalculates the effective policy; the agent syncs and enables/hides modules without restarting'],
          ['Labels → automation scope', 'Agent Labels + Automation + Policies', 'The computed label becomes Included Tags in a task, applying software/policy only to the right fleet'],
          ['Custom fields → script/sensor', 'Custom Fields + Scripts + Sensors + Labels', 'The field feeds the script (MDZ_CUSTOM_FIELDS), the script writes back and the value becomes a label condition'],
        ],
      },
      {
        type: 'steps',
        title: 'Narrated example: full disk at a branch office',
        items: [
          {
            title: '1. The sensor fires',
            description: 'The DiskSpace sensor on machine FIN-042 reaches 8% free. The agent measures and sends the sample; the server applies the threshold and marks it Failing.',
          },
          {
            title: '2. The alert becomes a ticket',
            description: 'After 2 consecutive samples the Auto-Ticket rule opens a ticket in the client workflow with the sensor payload (channel, value and limit).',
          },
          {
            title: '3. The AI adds context',
            description: 'The AI queries the knowledge base (pgvector) and suggests the cleanup procedure, attaching the sensor history and the disk inventory.',
          },
          {
            title: '4. The technician acts',
            description: 'In the ticket, the technician opens the remote terminal and runs the cleanup script from the library. The script writes the freed space into a collector custom field.',
          },
          {
            title: '5. The loop closes by itself',
            description: 'On the next collection the sensor is Passing again, the resolution event is recorded and the ticket moves to the final state. CSAT is sent to the employee.',
          },
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'One context store',
        text: 'Because inventory, sensors, tickets and automation live on the same server, every human action has the technical context right next to it. That is what separates an RMM with coupled ITSM from two tools glued together by an integration.',
      },
    ],
  },
  {
    id: 'endpoint-lifecycle',
    part: 'operation',
    navLabel: '2.15. Endpoint lifecycle',
    badge: 'Part 2 · Chapter 15 · Lifecycle',
    title: 'Lifecycle: approve, move, power, notify and remove endpoints',
    lead: 'Once the agent is in, real operations involve approving zero-touch, transferring across clients/sites, powering on and off, collecting on demand and removing safely — with no ghost machines left behind.',
    blocks: [
      {
        type: 'paragraphs',
        items: [
          'The Console exposes lifecycle operations beyond a simple "restart": zero-touch provisioning approval, advanced power (including firmware/BIOS restart and Wake-on-LAN), agent transfer across scopes, on-demand collection of volatile data and a two-step removal flow (trash → permanent delete) with a re-sendable remote uninstall.',
          'The principle is to never lose the trail: nothing is deleted outright. First the endpoint leaves the normal listing (trash), then you decide whether to restore it or remove it for good — and the remote uninstall is a trackable command with a visible outcome (sent now or queued).',
        ],
      },
      {
        type: 'table',
        caption: 'Lifecycle operations in the Console',
        headers: ['Operation', 'What it does', 'When to use it'],
        rows: [
          ['Approve zero-touch', 'Releases an endpoint that registered through automatic provisioning and is awaiting approval', 'Controlled rollout: the agent installs, but only joins the fleet after your approval'],
          ['Restart / Shutdown', 'Immediate or scheduled power action on the endpoint', 'Quick maintenance with the user warned'],
          ['Restart into BIOS/UEFI (restart-firmware)', 'Power verb that reboots the machine into firmware — requires UEFI boot', 'Changing BIOS settings, updating firmware, adjusting virtualisation'],
          ['Wake-on-LAN', 'Powers the machine on with a magic packet on the LAN', 'Maintenance on powered-off machines inside the same network'],
          ['Transfer agent', 'Moves the endpoint to another Client/Site (single or bulk, with pre-validation)', 'Contract changes, equipment relocation, fixing a wrong provisioning'],
          ['On-demand collection', 'Refreshes now: listening ports, open connections, software, printers and hardware', 'Point-in-time diagnosis without waiting for the inventory cycle'],
          ['Notify user', 'Sends a Toast (closes itself) or Modal (requires interaction) notice to the endpoint screen', 'Announce maintenance, ask the user to save work or confirm something'],
          ['Remove agent', 'Two-step flow: trash (restorable) and permanent removal', 'Decommissioning a sold, returned or replaced machine'],
        ],
      },
      {
        type: 'steps',
        title: 'Safe endpoint removal flow',
        items: [
          {
            title: '1. Move it to the trash',
            description: 'A normal delete removes the agent from the listing but keeps the record. The machine is still installed and can be restored at any time.',
            route: 'Agents → Delete action (/agents)',
          },
          {
            title: '2. Uninstall remotely (decommission)',
            description: 'The decommission command makes the local SYSTEM service locate the NSIS uninstaller and run it elevated, removing the agent from the machine. The request is persisted on the endpoint for 30 days, so redelivery does not duplicate the action.',
            route: 'Agents → Trash → Re-send uninstall',
          },
          {
            title: '3. Confirm the outcome',
            description: 'The response distinguishes "sent now" (published to the transport) from "queued" (agent offline; delivered when it reconnects). Treating both as success would promise an uninstall that may never happen.',
          },
          {
            title: '4. Restore if it was a mistake',
            description: 'If the machine comes back into service, restore the agent: it returns to the normal listing with the same history, sensors, fields and labels.',
            route: 'Agents → Trash → Restore',
          },
          {
            title: '5. Delete permanently only at the end',
            description: 'Permanent removal (hard delete) is irreversible. When the agent has linked tickets you must confirm with force: the service history is preserved, just without the link to the device.',
            route: 'Agents → Trash → Remove permanently',
          },
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Uninstall redelivery has two possible outcomes',
        text: 'Use the re-send whenever the first command did not arrive (agent offline at deletion time or NATS unavailable) and the machine still has the agent installed. Only consider the uninstall complete when the endpoint stops sending heartbeats.',
      },
      {
        type: 'table',
        caption: 'Trash vs permanent removal',
        headers: ['Action', 'Reversible?', 'What happens'],
        rows: [
          ['Delete (trash)', 'Yes', 'Leaves the normal listing; inventory, sensors and history remain'],
          ['Restore', 'Yes', 'Returns to the active fleet in the same Client/Site'],
          ['Remove permanently', 'No', 'Deletes the agent record and its runtime data'],
          ['Force remove', 'No', 'Allowed even with linked tickets; history stays without the device link'],
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Reinstalled machine and orphan agent',
        text: 'If Windows was reinstalled, install the agent with zero-touch: on machines with TPM 2.0, reassociation through EK + SMBIOS UUID returns the binding to the existing record instead of creating a duplicate endpoint. If the old record is already in the trash, restore it before provisioning again.',
      },
    ],
  },
  {
    id: 'governance-admin',
    part: 'operation',
    navLabel: '2.16. Governance & administration',
    badge: 'Part 2 · Chapter 16 · Governance',
    title: 'Governance: API tokens, tamper-evident audit and background processing',
    lead: 'Administrative capabilities that sustain integrations, compliance and server performance — and that are almost always invisible in day-to-day operations.',
    blocks: [
      {
        type: 'paragraphs',
        items: [
          'External integrations must not use a technician password. That is what API Tokens are for: machine credentials bound to a user and subject to that user permissions, with a public prefix, a secret and revocation.',
          'On the compliance side, the audit tables use a hash chain (prev_hash → entry_hash), so editing an old row breaks the proof. On the performance side, the technician metrics and the AI ticket triage cycles run in the background, in batches and with a per-client quota, instead of computing everything inside the request.',
        ],
      },
      {
        type: 'table',
        caption: 'Governance capabilities and where they live',
        headers: ['Capability', 'Where', 'Purpose'],
        rows: [
          ['API Tokens', 'API: /api/v1/api-tokens (no dedicated screen)', 'Authenticate external integrations and automations with machine credentials'],
          ['Chained audit trail', '/settings/audit and /logs', 'Prove the audit record was not edited afterwards'],
          ['Configuration audit', '/settings/audit', 'See who changed each parameter, when and in which scope'],
          ['User activity', '/identity/access (activity modal)', 'Investigate what a user did and when'],
          ['Background processing', 'Server and Client settings', 'Tune the metrics and AI triage cycles, with inheritance'],
          ['Database sanitization', '/settings/database-maintenance', 'Fix inconsistencies that block operations, with a prior check'],
          ['Object storage sanitization', '/settings/database-maintenance', 'Find and clean orphaned or divergent objects'],
          ['AI cost and limits', '/settings/ai-cost', 'Track spend per model and hold the budget'],
        ],
      },
      {
        type: 'code',
        title: 'Using an API Token (recommended format)',
        language: 'bash',
        snippet: `# Create the token at /api/v1/api-tokens and keep the pair (public prefix + secret).
# Both headers are required; the token inherits the permissions of its owning user.
curl -sS https://rmm.company.com/api/v1/clients \\
  -H "X-Api-Key: tok_public_example" \\
  -H "X-Api-Secret: secret_example_do_not_commit"

# The token can be revoked without touching the password of the user who created it.
# Without the headers the API answers 401 with the expected message:
# "Missing API key headers. Expected X-Api-Key and X-Api-Secret."`,
      },
      {
        type: 'table',
        caption: 'Background processing: parameters you can tune',
        headers: ['Cycle', 'Parameter', 'Default'],
        rows: [
          ['Technician metrics', 'Enabled', 'true'],
          ['Technician metrics', 'IntervalMinutes', '15 (floor 10)'],
          ['Technician metrics', 'StaleThresholdMinutes / WindowDays', '15 / 90'],
          ['Technician metrics', 'BatchSize / MaxBatchesPerRun / MaxRunSeconds', '200 / 4 / 120'],
          ['Ticket triage (AI)', 'Enabled / EnqueueOnCreate', 'true / true (enqueue on create)'],
          ['Ticket triage (AI)', 'IntervalSeconds', '20 (floor 10)'],
          ['Ticket triage (AI)', 'BatchSize / MaxPerClientPerRun', '25 / 10 (per-client quota)'],
          ['Ticket triage (AI)', 'MaxAttempts / RetryAfterMinutes', '3 / 5'],
        ],
      },
      {
        type: 'steps',
        title: 'Monthly governance routine',
        items: [
          {
            title: '1. Review API tokens',
            description: 'List tokens, confirm who created them and which scope they use, and revoke whatever is no longer needed.',
            route: 'API: GET /api/v1/api-tokens',
          },
          {
            title: '2. Validate the audit trail',
            description: 'Walk through /settings/audit by period and review relevant configuration changes. Legacy entries outside the hash chain are not part of the proof — what matters is the chain of current entries.',
            route: 'Settings → Audit (/settings/audit)',
          },
          {
            title: '3. Tune the background cycles',
            description: 'If technician metrics update too slowly, lower IntervalMinutes or raise MaxBatchesPerRun; if AI triage consumes too much, lower BatchSize or MaxPerClientPerRun.',
            route: 'Settings → Server and → Client',
          },
          {
            title: '4. Run the sanitization checks',
            description: 'Run the checks first (database and object storage) to see the report; only then apply sanitization. Inconsistent records can block listings and reports.',
            route: 'Settings → Database maintenance (/settings/database-maintenance)',
          },
          {
            title: '5. Review AI costs and limits',
            description: 'Track consumption per model and adjust budget/limits before cost leaves the curve.',
            route: 'Settings → AI cost (/settings/ai-cost)',
          },
        ],
      },
      {
        type: 'accordion',
        title: 'AI budgeting in practice',
        items: [
          {
            summary: 'Token budget per request, model and department',
            paragraphs: [
              'Every AI call receives a budget computed on the server: the requested amount is clamped to the maximum tokens per request, respecting a minimum floor and an output ceiling, plus a department-specific cap. When the configured model is not suitable, the resolver applies the fallback model for the scope.',
              'Reference numbers: 1,200 output tokens per department (minimum 200), an estimate of 3.5 characters per token, a 0.85 prompt safety margin, up to 90% of the model context and an 8,000-character prompt when the model context is unknown.',
            ],
          },
          {
            summary: 'When the budget runs out',
            paragraphs: [
              'A rate limit or a reached daily budget is not a provider failure: triage degrades to the deterministic fallback and records the reason as ai_budget_exceeded on the assignment decision.',
              'The effect is being able to audit later why the AI did not decide, instead of discovering by accident that tickets stopped being classified.',
            ],
            route: '/settings/ai-cost · ticket assignment decision',
          },
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Sanitize only after checking',
        text: 'The screen always offers the check before execution. Running sanitization without reading the report may remove data you still needed to investigate — treat execution as a maintenance operation, with a window and the same-day backup.',
      },
    ],
  },
  {
    id: 'ticket-access',
    part: 'operation',
    navLabel: '2.17. Ticket permission by department',
    badge: 'Part 2 · Chapter 17 · Visibility',
    title: 'Who sees and who handles each ticket: the department model',
    lead: 'Seeing a ticket and handling it are different decisions. The policy combines the Client/Site ACL with the ticket department team — and ships with a shadow mode so you can measure before blocking.',
    blocks: [
      {
        type: 'paragraphs',
        items: [
          'Rules are evaluated in this order: (1) anyone with global Tickets access passes everything; (2) VIEW depends on the Client/Site ACL (legacy behaviour, preserved); (3) HANDLE requires being an active member of the ticket department team; (4) CLOSE requires being able to handle it, or being the requester when the destination is a final state.',
          'The ticket department is resolved with one-hop inheritance from the parent GLOBAL department, using the same resolver as the rest of the platform. Tickets without a department are treated as having no team: only global access can handle them.',
        ],
      },
      {
        type: 'table',
        caption: 'Access rules in evaluation order',
        headers: ['#', 'Rule', 'Effect'],
        rows: [
          ['1', 'Global Tickets access', 'Allows viewing, handling and closing any ticket (does not regress previous behaviour)'],
          ['2', 'Client/Site ACL (VIEW)', 'Defines who sees the ticket within the client or site scope'],
          ['3', 'Department team (HANDLE)', 'Only an active member of the ticket department team can handle it (with parent department inheritance)'],
          ['4', 'Requester on a final state (CLOSE)', 'Whoever opened the ticket may close it when the destination is a final state'],
          ['—', 'Ticket without department', 'No team: only global access can handle it'],
        ],
      },
      {
        type: 'table',
        caption: 'Denial codes and what they mean',
        headers: ['Code', 'Meaning', 'What to do'],
        rows: [
          ['TICKET_NOT_IN_YOUR_TEAM', 'You are not an active member of the ticket department team', 'Add the technician to the department team (or use a profile with global access)'],
          ['TICKET_HAS_NO_DEPARTMENT', 'The ticket has no department defined', 'Set the department during intake/triage or handle it with global access'],
          ['CANNOT_CLOSE_OTHERS_TICKET', 'You cannot close someone else ticket', 'Handle the ticket or ask the requester/the team to close it'],
          ['TICKET_OUT_OF_SCOPE', 'The ticket is outside your Client/Site scope', 'Review your role scope'],
          ['NO_MACHINE_EXECUTE_PERMISSION', 'No permission to run actions on the linked machine', 'Adjust the technician IAM role'],
          ['DEPARTMENT_CANNOT_EXECUTE_ON_MACHINES', 'The department cannot run actions on machines', 'Use a department/profile authorised to act on the endpoint'],
        ],
      },
      {
        type: 'steps',
        title: 'Enabling the policy safely (shadow mode)',
        items: [
          {
            title: '1. Populate the department teams',
            description: 'Create the departments and add the technicians who really work in each one. Without that, handling is restricted to whoever has global access.',
            route: '/tickets/departments',
          },
          {
            title: '2. Turn on shadow mode',
            description: 'In shadow mode the decision is logged but access is granted. It is the measurement phase: you see who would be blocked in the log without blocking service.',
            route: 'Server configuration (Tickets:DepartmentAuth:ShadowMode)',
          },
          {
            title: '3. Measure and adjust',
            description: 'Follow the recorded denials and fix teams/scopes before enforcing the policy for real.',
          },
          {
            title: '4. Leave shadow mode',
            description: 'With teams populated and denials explained, the policy starts blocking. Chat and machine actions use the same decision (the chat guard does not reimplement the rule).',
            route: '/tickets · chat windows',
          },
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Configuration precedence',
        text: 'Shadow mode is read from the server configuration in the database; the appsettings value (Tickets:DepartmentAuth:ShadowMode) is only the fallback while that read has not happened. When in doubt, trust the database.',
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'One rule, three doors',
        text: 'The same policy decides list, detail, chat and machine actions. The chat guard is merely the boolean gate: it maps View/Delete to can-view and Edit/Execute to can-handle — avoiding two implementations that drift apart over time.',
      },
    ],
  },
  {
    id: 'platform-reliability',
    part: 'operation',
    navLabel: '2.18. Reliability & internals',
    badge: 'Part 2 · Chapter 18 · Reliability',
    title: 'Reliability: commands, queues, P2P and platform limits',
    lead: 'Why a command sometimes takes a while, why an action shows as not delivered and why collection has ceilings — without this, the behaviour looks random.',
    blocks: [
      {
        type: 'paragraphs',
        items: [
          'The command path is durable end to end: the server publishes, the agent executes and the result returns through a persistent outbox. If the network drops midway, the result is not lost — it stays in the local queue and is resent when connectivity returns.',
          'On the agent side there is command deduplication: the same order received twice (transport redelivery, reconnection) does not run again. Each entry lives for 24 hours and the registry holds up to 500 entries, leaving headroom for bursts.',
        ],
      },
      {
        type: 'table',
        caption: 'Mechanisms that keep operations reliable',
        headers: ['Mechanism', 'What it guarantees', 'Where you notice it'],
        rows: [
          ['Command result outbox', 'Execution result survives network loss and agent restart', 'The result appears in history even after an offline period'],
          ['Command dedupe (24h, 500 entries)', 'The same order does not execute twice', 'No duplicated installs or actions after reconnection'],
          ['Redelivery policy', 'Resend only when it makes sense; a chat invite without a valid session is blocked', 'Repeated commands do not produce duplicate effects'],
          ['Expiry by retention', 'An old command with an offline agent becomes a Timeout instead of hanging forever', 'Status shows not delivered because the agent was offline past retention'],
          ['Runtime stale → HTTP 503', 'A stale runtime state returns a domain error, not a generic 500', 'Clear error (RuntimeStale) when cache/runtime is out of date'],
          ['Redis P2P lock', 'One agent downloads an artefact at a time, with fallback if Redis is down', 'No duplicated download of the same package in the site'],
          ['P2P telemetry outbox', 'P2P metrics are not lost when the link flaps', 'The P2P view stops having gaps'],
        ],
      },
      {
        type: 'steps',
        title: 'What to do when a command did not arrive',
        items: [
          {
            title: '1. Check the command history',
            description: 'The real outcome (published, delivered, executed, failed or expired by retention) is in the command history — not in the interface toast.',
            route: 'Agents → command history · Operations (/automation/operations)',
          },
          {
            title: '2. Check whether the agent is online',
            description: 'An offline agent means the command is queued: it will be delivered on reconnection. If it stayed offline past retention, the command ends as a Timeout.',
            route: '/agents',
          },
          {
            title: '3. Re-send when redelivery is allowed',
            description: 'Power actions and uninstalls have specific redelivery handling. Chat invites without a valid session are blocked on purpose — reopen the invite from the screen.',
          },
          {
            title: '4. If the error is a runtime error, fix the cause',
            description: 'RuntimeStale errors indicate an expired state (presence/cache, for example). Wait for the sync cycle or force a sync before insisting on the action.',
            route: '/agents → Sync now',
          },
        ],
      },
      {
        type: 'table',
        caption: 'Collection limits and what they affect',
        headers: ['Limit', 'Value', 'Practical impact'],
        rows: [
          ['Listening ports per agent', '200', 'Paged list; the rest is not sent — prioritise when investigating'],
          ['Open connections per agent', '5,000', 'Bounded snapshot; use on-demand collection at diagnosis time'],
          ['On-demand collection (refresh)', 'Consumes endpoint bandwidth/CPU', 'Use it sparingly, not as a routine'],
        ],
      },
      {
        type: 'accordion',
        title: 'Observability and P2P: what runs underneath',
        items: [
          {
            summary: 'Background service status',
            paragraphs: [
              'Beyond configuring the jobs, the server exposes the state of each background service through the admin API (/api/v1/admin/background-services): name, display name, description, job group and job name, status, whether it is running, whether it is enabled, last run, next run and last error.',
              'It is the source of truth for questions such as \"is the cycle enabled?\", \"when does it run again?\" and \"did it fail last time?\" — instead of guessing from screen behaviour.',
            ],
            route: 'API: GET /api/v1/admin/background-services (and /{name})',
          },
          {
            summary: 'P2P bootstrap and preload',
            paragraphs: [
              'A new node joins the mesh through onboarding (/p2p/config/onboard): the agent obtains credentials with a 30-minute deploy key, retries as often as needed while it has no credentials (one attempt at a time, with a 40 s budget) and rechecks peers every 60 s.',
              'Preload (the p2ppreload command and the policy-sync PreloadPackages) makes ALL agents in the scope receive the request, but only the HIGHEST-SCORE one downloads first: each waits a delay proportional to its position in the local score (a machine with more free CPU/RAM waits less). An in-memory lock prevents the same package from being preloaded twice through different paths.',
            ],
            route: 'P2P API /p2p/config/onboard · p2ppreload command',
          },
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Server background jobs',
        text: 'Besides the metrics and triage cycles, the server has periodic jobs controlled by configuration (BackgroundJobs). They ship disabled by default and the interval is chosen in days (1, 5, 10, 15 or 30) — when a job is disabled it is not even registered in the scheduler.',
      },
    ],
  },
];
