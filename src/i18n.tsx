import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Language = 'pt-BR' | 'en-US';

type LanguageOption = {
  code: Language;
  label: string;
  flag: string;
};

const DEFAULT_LANGUAGE: Language = 'pt-BR';
const STORAGE_KEY = 'discoveryrmm-language';
const LINUX_BOOTSTRAP_COMMAND = 'bash -c "$(curl -fsSL https://raw.githubusercontent.com/pedrostefanogv/DiscoveryRMM_API/release/scripts/linux/bootstrap_install_discovery.sh)"';

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'pt-BR', label: 'Português', flag: '🇧🇷' },
  { code: 'en-US', label: 'English', flag: '🇺🇸' },
];

const translations = {
  'pt-BR': {
    meta: {
      title: 'DiscoveryRMM — RMM open source para operações de TI',
      description:
        'DiscoveryRMM é uma plataforma RMM open source para operações de TI: inventário de endpoints, monitoramento, acesso remoto, automação e chamados com SLA, com suporte assistido por IA.',
    },
    navbar: {
      links: [
        { label: 'Funcionalidades', href: '#features' },
        { label: 'Arquitetura', href: '#architecture' },
        { label: 'Instalação', href: '#quickstart' },
        { label: 'Fluxo', href: '#how-it-works' },
        { label: 'GitHub', href: 'https://github.com/pedrostefanogv/DiscoveryRMM_API', external: true },
      ],
      cta: 'Comece Agora',
      openMenuLabel: 'Abrir menu de navegação',
      closeMenuLabel: 'Fechar menu de navegação',
      languageSwitcherLabel: 'Selecionar idioma',
      languageOptionLabel: 'Ativar idioma',
    },
    hero: {
      rotatingItems: ['Windows', 'Linux', 'servidores', 'estações'],
      badge: 'Plataforma RMM open source para times de TI',
      titlePrefix: 'Gerencie endpoints com',
      titleAccentPrimary: 'velocidade',
      titleMiddle: 'e',
      titleAccentSecondary: 'controle total',
      subtitlePrefix: 'DiscoveryRMM é um servidor open source de Remote Monitoring & Management que oferece visibilidade completa sobre seus',
      subtitleSuffix:
        ', com API REST + SignalR, agent leve para Windows, console web, chat com IA e automação inteligente de chamados.',
      noticeAriaLabel: 'Aviso sobre o estado do projeto',
      noticeBadge: 'Aviso',
      noticeText:
        'Projeto em desenvolvimento ativo. Parte da interface e de alguns fluxos foi acelerada com apoio de IA e vibe coding, então telas, nomenclaturas e comportamentos ainda podem evoluir antes da estabilização. Homologação acompanha a branch dev; produção recebe apenas a release.',
      primaryCta: 'Instalar Agora',
      secondaryCta: 'Ver no GitHub',
      terminalTitle: 'DiscoveryRMM — Linux Bootstrap',
      terminalCommand: LINUX_BOOTSTRAP_COMMAND,
      terminalLines: [
        { value: '========================================' },
        { value: 'Discovery RMM - Bootstrap Wizard' },
        { value: '----------------------------------------' },
        { value: 'Selecione o canal/branch:' },
        { value: '1) lts - suporte longo prazo' },
        { prefix: '2) ', highlight: 'release', suffix: ' - canal estavel' },
        { value: '3) beta - novidades em teste' },
        { value: '4) dev - desenvolvimento' },
        { value: '5) custom - informar branch manualmente' },
        { value: '----------------------------------------' },
        { value: 'Opcao [2]:' },
      ],
    },
    features: {
      label: 'Funcionalidades',
      titlePrefix: 'Uma plataforma',
      titleAccent: 'completa',
      titleSuffix: 'para sua operação',
      statusBadge: '🧪 Pré-estável',
      description:
        'Do inventário ao atendimento com IA, o DiscoveryRMM reúne 12+ módulos integrados: RMM, ITSM, automação, distribuição de software e observabilidade no mesmo servidor.',
      items: [
        {
          title: 'Autenticação Robusta',
          description: 'JWT + API Keys + MFA com suporte a TOTP, FIDO2 e WebAuthn. Hashing Argon2 para senhas e rate limiting nos endpoints críticos.',
        },
        {
          title: 'Inventário Completo',
          description: 'Coleta automática de hardware, software e rede de cada endpoint (osquery + PowerShell), com relatórios e auditoria de ativos.',
        },
        {
          title: 'Suporte com IA',
          description: 'A IA atua como primeiro nível de atendimento: faz a triagem, sugere respostas com base no histórico (pgvector) e encaminha o ticket com contexto.',
        },
        {
          title: 'Chamados & SLA',
          description: 'Filas, templates e campos customizados para tickets, calendários de SLA, escalonamento automático, macros e pesquisa de satisfação (CSAT).',
        },
        {
          title: 'Auto-Tickets',
          description: 'Motor automático de abertura de chamados baseado em eventos e thresholds. Dispare scripts e notificações sem intervenção manual.',
        },
        {
          title: 'Acesso Remoto',
          description: 'Suporte remoto nativo: tela em tempo real (H.264/WebRTC), terminal interativo, transferência de arquivos, debug remoto e gravação de sessão.',
        },
        {
          title: 'Automação de Scripts',
          description: 'Execute PowerShell/CMD e pacotes PSADT sob demanda ou agendados, com biblioteca versionada, gatilhos e trilha de auditoria por execução.',
        },
        {
          title: 'Distribuição P2P',
          description: 'Os agents distribuem arquivos e artefatos entre si (libp2p) para acelerar instalações, reduzir a carga no servidor e economizar banda.',
        },
        {
          title: 'App Store + Updates',
          description: 'Catálogo de aplicativos com deploy e aprovações automatizadas e self-update do agent. No servidor, a atualização é sempre manual pelo instalador.',
        },
        {
          title: 'Relatórios & Auditoria',
          description: 'Relatórios em XLSX, CSV, Markdown e PDF com agendamento, histórico de execuções, presets de filtro e auditoria de configuração.',
        },
        {
          title: 'Base de Conhecimento & MCP',
          description: 'Artigos versionados com busca semântica por embeddings e execução de ferramentas MCP com políticas de permissão para a IA.',
        },
        {
          title: 'Multi-tenant & IAM',
          description: 'Modelo Client → Site → Agent, departamentos, grupos, papéis e permissões granulares, campos customizados e tokens de implantação por escopo.',
        },
      ],
    },
    architecture: {
      label: 'Arquitetura',
      titlePrefix: 'Quatro camadas,',
      titleAccent: 'domínio total',
      description:
        'O DiscoveryRMM separa claramente agent, servidor, console web e infraestrutura, garantindo escalabilidade horizontal e segurança em cada camada.',
      components: [
        {
          name: 'Discovery Agent',
          description: 'Agente leve instalado nos endpoints Windows. Coleta inventário de hardware/software (osquery + PowerShell), executa scripts remotamente, participa da malha P2P e mantém heartbeat com o servidor via NATS (fallback SignalR). Auto-update integrado.',
          tech: ['Go 1.26', 'Wails v3', 'NATS', 'osquery'],
        },
        {
          name: 'DiscoveryRMM Server',
          description: 'Backend em .NET 10 / ASP.NET Core. Expõe API REST versionada documentada via Scalar, SignalR Hub para tempo real, NATS/JetStream para mensageria e jobs agendados (Quartz.NET), chat com IA (OpenAI/Ollama + pgvector) e motor de auto-tickets.',
          tech: ['.NET 10', 'PostgreSQL', 'NATS/JetStream', 'SignalR'],
        },
        {
          name: 'Console Web',
          description: 'SPA administrativa e operacional em React 19 para dashboards, inventário, tickets, automação, relatórios e sessões remotas. Consome a API REST e o realtime via SignalR/NATS, com fallback offline para leitura.',
          tech: ['React 19', 'TypeScript', 'Vite 8', 'Tailwind 4'],
        },
        {
          name: 'Infraestrutura',
          description: 'PostgreSQL 15+ com pgvector para embeddings de IA e NATS 2.x com JetStream para mensageria assíncrona. Redis para cache, storage local, MinIO ou S3-compatible e OpenTelemetry opcional para observabilidade.',
          tech: ['PostgreSQL', 'Redis', 'NATS', 'MinIO/S3'],
        },
      ],
      stackTitle: 'Stack Tecnológica',
      stack: [
        { label: '.NET 10', layer: 'Runtime' },
        { label: 'PostgreSQL 15+', layer: 'Banco de Dados' },
        { label: 'pgvector', layer: 'IA' },
        { label: 'NATS 2.x', layer: 'Mensageria' },
        { label: 'JetStream', layer: 'Streaming' },
        { label: 'Redis', layer: 'Cache' },
        { label: 'SignalR', layer: 'Tempo Real' },
        { label: 'Quartz.NET', layer: 'Jobs' },
        { label: 'FluentMigrator', layer: 'Migrações' },
        { label: 'EF Core 10', layer: 'ORM' },
        { label: 'Scalar', layer: 'Docs de API' },
        { label: 'Argon2', layer: 'Segurança' },
        { label: 'MinIO / S3', layer: 'Storage' },
        { label: 'OpenAI / Ollama', layer: 'IA' },
        { label: 'WebRTC / H.264', layer: 'Acesso Remoto' },
        { label: 'Go 1.26', layer: 'Agent' },
        { label: 'Wails v3', layer: 'Agent UI' },
        { label: 'osquery', layer: 'Inventário' },
        { label: 'React 19', layer: 'Console Web' },
        { label: 'Tailwind 4', layer: 'Console Web' },
      ],
      channelsTitle: 'Canais de Release',
      channels: [
        { name: 'Estável', branch: 'release', description: 'Produção' },
        { name: 'Beta', branch: 'beta', description: 'Pré-release' },
        { name: 'LTS', branch: 'lts', description: 'Long-Term Support' },
        { name: 'Dev', branch: 'dev', description: 'Ativo' },
      ],
    },
    quickstart: {
      label: 'Instalação',
      titlePrefix: 'Do clone ao primeiro',
      titleAccent: 'deploy',
      titleSuffix: 'em minutos',
      description:
        'O bootstrap abaixo prepara o servidor Linux em um único comando. Para rodar a partir do código-fonte, clone o repositório e use o .NET 10 SDK; as atualizações de servidor são sempre manuais.',
      bootstrapTitle: 'Linux One-Liner',
      bootstrapDescription:
        'Instalação completa em produção com um único comando em Ubuntu/Debian. O script clona o repositório, instala dependências e provisiona os serviços automaticamente.',
      terminalLabel: 'Linux · Bash',
      command: LINUX_BOOTSTRAP_COMMAND,
      copyLabel: 'Copiar comando',
      copiedLabel: 'Copiado',
      copyErrorLabel: 'Falha ao copiar',
      copyAriaLabel: 'Copiar comando completo de bootstrap Linux',
      channelsLabel: 'Canais e atualização:',
      channels: [
        'DISCOVERY_RELEASE_CHANNEL=lts',
        'DISCOVERY_RELEASE_CHANNEL=beta',
        'DISCOVERY_RELEASE_CHANNEL=dev',
        '--branch release',
        'install_discovery_server.sh --mode update',
      ],
      prerequisitesTitle: 'Pré-requisitos',
      prerequisites: [
        { name: 'Ubuntu / Debian', icon: '🐧', extra: 'x64 ou arm64' },
        { name: 'Acesso root ou sudo', icon: '🔐', extra: 'instala serviços' },
        { name: '.NET 10 SDK', icon: '⚡', extra: 'instalado pelo bootstrap' },
        { name: 'PostgreSQL 15+', icon: '🐘', extra: 'com pgvector' },
        { name: 'NATS Server 2.x', icon: '📡', extra: 'com JetStream' },
        { name: 'Redis', icon: '⚙️', extra: 'cache, opcional' },
      ],
    },
    howItWorks: {
      label: 'Fluxo de Trabalho',
      titlePrefix: 'Simples, rápido e',
      titleAccent: 'poderoso',
      description: 'Em apenas quatro passos, sua infraestrutura estará totalmente monitorada e sob controle, com IA integrada.',
      steps: [
        {
          step: '01',
          title: 'Deploy do Agent',
          description: 'Instale o agente .exe nos endpoints Windows em segundos. Compatível com Windows 10/11 e Windows Server. Autenticação mútua com o servidor via JWT + API Key.',
        },
        {
          step: '02',
          title: 'Conexão Segura via NATS',
          description: 'O agent estabelece conexão com o servidor via NATS 2.x com JetStream. Fallback automático para SignalR WebSocket. Autenticação com auth callout e credenciais dedicadas.',
        },
        {
          step: '03',
          title: 'Coleta & Monitoramento',
          description: 'Inventário completo de hardware (CPU, RAM, disco, rede), software instalado e métricas de sistema são coletados e enviados em tempo real, alimentando os dashboards do console web.',
        },
        {
          step: '04',
          title: 'Ação & Automação',
          description: 'Execute scripts PowerShell/CMD e pacotes remotamente, abra sessões de acesso remoto e deixe o motor de auto-tickets e a IA cuidarem da triagem inicial.',
        },
      ],
    },
    stats: {
      items: [
        { value: '12+', label: 'Módulos Integrados', icon: '📦' },
        { value: '4', label: 'Canais de Release', icon: '🔄' },
        { value: '100%', label: 'Open Source (MIT)', icon: '🔓' },
        { value: '.NET 10', label: 'Runtime do Servidor', icon: '⚡' },
      ],
    },
    cta: {
      title: 'Pronto para transformar sua gestão de TI?',
      description:
        'O DiscoveryRMM é open source, está em evolução ativa e conta com canais stable, beta, LTS e dev. Explore o repositório, contribua ou implante sua instância hoje.',
      primaryButton: 'Ver no GitHub',
      secondaryButton: 'Guia de Instalação',
      links: ['Servidor (API)', 'Discovery Agent', 'Documentação'],
    },
    footer: {
      tagline:
        'Plataforma open source de Remote Monitoring & Management. .NET 10 · PostgreSQL · NATS · Redis · IA integrada.',
      projectTitle: 'Projeto',
      projectLinks: ['Servidor (API)', 'Agent Windows', 'Configuração'],
      resourcesTitle: 'Recursos',
      resourcesLinks: ['Funcionalidades', 'Arquitetura', 'Instalação', 'Fluxo de Trabalho'],
      channelsTitle: 'Canais',
      channels: {
        dev: 'dev · Ativo',
        beta: 'beta · Pré-release',
        release: 'release · Estável',
        lts: 'lts · Long-Term Support',
      },
      copyright: 'Open source sob licença MIT.',
      authorPrefix: 'Desenvolvido por',
    },
  },
  'en-US': {
    meta: {
      title: 'DiscoveryRMM — Open source RMM for IT operations',
      description:
        'DiscoveryRMM is an open source RMM platform for IT operations: endpoint inventory, monitoring, remote access, automation, and SLA-driven ticketing with AI-assisted support.',
    },
    navbar: {
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Architecture', href: '#architecture' },
        { label: 'Install', href: '#quickstart' },
        { label: 'Workflow', href: '#how-it-works' },
        { label: 'GitHub', href: 'https://github.com/pedrostefanogv/DiscoveryRMM_API', external: true },
      ],
      cta: 'Get Started',
      openMenuLabel: 'Open navigation menu',
      closeMenuLabel: 'Close navigation menu',
      languageSwitcherLabel: 'Select language',
      languageOptionLabel: 'Switch language to',
    },
    hero: {
      rotatingItems: ['Windows', 'Linux', 'servers', 'workstations'],
      badge: 'Open source RMM platform for IT teams',
      titlePrefix: 'Run endpoint operations with',
      titleAccentPrimary: 'speed',
      titleMiddle: 'and',
      titleAccentSecondary: 'confidence',
      subtitlePrefix: 'DiscoveryRMM is an open source Remote Monitoring & Management server that gives you full visibility across your',
      subtitleSuffix:
        ', with REST APIs, SignalR, a lightweight Windows agent, a web console, AI-assisted support and automated ticketing.',
      noticeAriaLabel: 'Project status notice',
      noticeBadge: 'Notice',
      noticeText:
        'The platform is evolving quickly. Parts of the interface and some flows were accelerated with AI support and vibe coding, so screens, terminology, and behavior may still change before the product settles. Staging tracks the dev branch; production only ships the release branch.',
      primaryCta: 'Install Now',
      secondaryCta: 'View on GitHub',
      terminalTitle: 'DiscoveryRMM — Linux Bootstrap',
      terminalCommand: LINUX_BOOTSTRAP_COMMAND,
      terminalLines: [
        { value: '========================================' },
        { value: 'Discovery RMM - Bootstrap Wizard' },
        { value: '----------------------------------------' },
        { value: 'Select the release channel/branch:' },
        { value: '1) lts - long-term support' },
        { prefix: '2) ', highlight: 'release', suffix: ' - stable channel' },
        { value: '3) beta - upcoming changes under test' },
        { value: '4) dev - active development' },
        { value: '5) custom - enter a branch manually' },
        { value: '----------------------------------------' },
        { value: 'Option [2]:' },
      ],
    },
    features: {
      label: 'Features',
      titlePrefix: 'A',
      titleAccent: 'complete',
      titleSuffix: 'platform for modern IT operations',
      statusBadge: '🧪 Pre-stable',
      description:
        'From inventory to AI-assisted support, DiscoveryRMM bundles 12+ integrated modules: RMM, ITSM, automation, software distribution, and observability on a single server.',
      items: [
        {
          title: 'Robust Authentication',
          description: 'JWT, API keys, and MFA with TOTP, FIDO2, and WebAuthn protect privileged access. Argon2 hashing and rate limits harden sensitive endpoints.',
        },
        {
          title: 'Full Inventory',
          description: 'Continuously collect hardware, software, and network data from every endpoint (osquery + PowerShell) and turn raw telemetry into auditable asset visibility.',
        },
        {
          title: 'AI-Powered Support',
          description: 'AI acts as your first support line: it triages requests, suggests replies from historical context (pgvector), and routes tickets with better context for technicians.',
        },
        {
          title: 'Tickets & SLA',
          description: 'Queues, templates, and custom fields for tickets, SLA calendars, automatic escalation, macros, and customer satisfaction surveys (CSAT).',
        },
        {
          title: 'Auto Tickets',
          description: 'Generate tickets automatically from events and thresholds. Trigger scripts and notifications before issues become outages.',
        },
        {
          title: 'Remote Access',
          description: 'Native remote support: real-time screen (H.264/WebRTC), interactive terminal, file transfer, remote debugging, and session recording.',
        },
        {
          title: 'Script Automation',
          description: 'Run PowerShell/CMD scripts and PSADT packages on demand or on a schedule, with a versioned library, triggers, and a per-execution audit trail.',
        },
        {
          title: 'P2P Distribution',
          description: 'Agents relay packages and artifacts across the fleet (libp2p) to speed up installs, reduce server bottlenecks, and save bandwidth during updates.',
        },
        {
          title: 'App Store + Updates',
          description: 'Publish curated apps with automated approval and rollout flows, plus agent self-update. Server updates are always manual through the installer.',
        },
        {
          title: 'Reports & Audit',
          description: 'Reports in XLSX, CSV, Markdown, and PDF with scheduling, execution history, filter presets, and configuration audit trails.',
        },
        {
          title: 'Knowledge Base & MCP',
          description: 'Versioned articles with semantic search over embeddings and MCP tool execution guarded by permission policies for the AI.',
        },
        {
          title: 'Multi-tenant & IAM',
          description: 'Client → Site → Agent hierarchy, departments, groups, roles, granular permissions, custom fields, and scoped deployment tokens.',
        },
      ],
    },
    architecture: {
      label: 'Architecture',
      titlePrefix: 'Four layers,',
      titleAccent: 'total ownership',
      description:
        'DiscoveryRMM keeps the agent, server, web console, and infrastructure responsibilities clearly separated for safer scaling and simpler operations.',
      components: [
        {
          name: 'Discovery Agent',
          description: 'A lightweight agent for Windows endpoints. It collects hardware and software inventory (osquery + PowerShell), runs remote scripts, joins the P2P mesh, and keeps a heartbeat with the server over NATS with SignalR fallback. Auto-update is included.',
          tech: ['Go 1.26', 'Wails v3', 'NATS', 'osquery'],
        },
        {
          name: 'DiscoveryRMM Server',
          description: 'A .NET 10 / ASP.NET Core backend that exposes a versioned REST API documented with Scalar, a SignalR hub for real-time, NATS/JetStream messaging, Quartz.NET scheduled jobs, AI chat (OpenAI/Ollama + pgvector), and an automated ticket engine.',
          tech: ['.NET 10', 'PostgreSQL', 'NATS/JetStream', 'SignalR'],
        },
        {
          name: 'Web Console',
          description: 'A React 19 SPA for dashboards, inventory, ticketing, automation, reports, and remote sessions. It consumes the REST API plus realtime over SignalR/NATS, with offline read caching.',
          tech: ['React 19', 'TypeScript', 'Vite 8', 'Tailwind 4'],
        },
        {
          name: 'Infrastructure',
          description: 'PostgreSQL 15+ with pgvector powers AI embeddings, while NATS 2.x with JetStream handles asynchronous messaging. Redis accelerates cache access, and local, MinIO, or S3-compatible storage covers assets. OpenTelemetry observability is optional.',
          tech: ['PostgreSQL', 'Redis', 'NATS', 'MinIO/S3'],
        },
      ],
      stackTitle: 'Technology Stack',
      stack: [
        { label: '.NET 10', layer: 'Runtime' },
        { label: 'PostgreSQL 15+', layer: 'Database' },
        { label: 'pgvector', layer: 'AI' },
        { label: 'NATS 2.x', layer: 'Messaging' },
        { label: 'JetStream', layer: 'Streaming' },
        { label: 'Redis', layer: 'Cache' },
        { label: 'SignalR', layer: 'Realtime' },
        { label: 'Quartz.NET', layer: 'Jobs' },
        { label: 'FluentMigrator', layer: 'Migrations' },
        { label: 'EF Core 10', layer: 'ORM' },
        { label: 'Scalar', layer: 'API Docs' },
        { label: 'Argon2', layer: 'Security' },
        { label: 'MinIO / S3', layer: 'Storage' },
        { label: 'OpenAI / Ollama', layer: 'AI' },
        { label: 'WebRTC / H.264', layer: 'Remote Access' },
        { label: 'Go 1.26', layer: 'Agent' },
        { label: 'Wails v3', layer: 'Agent UI' },
        { label: 'osquery', layer: 'Inventory' },
        { label: 'React 19', layer: 'Web Console' },
        { label: 'Tailwind 4', layer: 'Web Console' },
      ],
      channelsTitle: 'Release Channels',
      channels: [
        { name: 'Stable', branch: 'release', description: 'Production' },
        { name: 'Beta', branch: 'beta', description: 'Pre-release' },
        { name: 'LTS', branch: 'lts', description: 'Long-Term Support' },
        { name: 'Dev', branch: 'dev', description: 'Active' },
      ],
    },
    quickstart: {
      label: 'Installation',
      titlePrefix: 'From clone to first',
      titleAccent: 'deploy',
      titleSuffix: 'in minutes',
      description:
        'The bootstrap below provisions a Linux server in a single command. To run from source, clone the repository and use the .NET 10 SDK; server updates are always manual.',
      bootstrapTitle: 'Linux One-Liner',
      bootstrapDescription:
        'Production-ready installation with a single command on Ubuntu/Debian. The script clones the repository, installs dependencies, and provisions the services for you.',
      terminalLabel: 'Linux · Bash',
      command: LINUX_BOOTSTRAP_COMMAND,
      copyLabel: 'Copy command',
      copiedLabel: 'Copied',
      copyErrorLabel: 'Copy failed',
      copyAriaLabel: 'Copy the full Linux bootstrap command',
      channelsLabel: 'Channels and updates:',
      channels: [
        'DISCOVERY_RELEASE_CHANNEL=lts',
        'DISCOVERY_RELEASE_CHANNEL=beta',
        'DISCOVERY_RELEASE_CHANNEL=dev',
        '--branch release',
        'install_discovery_server.sh --mode update',
      ],
      prerequisitesTitle: 'Prerequisites',
      prerequisites: [
        { name: 'Ubuntu / Debian', icon: '🐧', extra: 'x64 or arm64' },
        { name: 'root or sudo access', icon: '🔐', extra: 'installs services' },
        { name: '.NET 10 SDK', icon: '⚡', extra: 'installed by the bootstrap' },
        { name: 'PostgreSQL 15+', icon: '🐘', extra: 'with pgvector' },
        { name: 'NATS Server 2.x', icon: '📡', extra: 'with JetStream' },
        { name: 'Redis', icon: '⚙️', extra: 'cache, optional' },
      ],
    },
    howItWorks: {
      label: 'Workflow',
      titlePrefix: 'Simple, fast, and',
      titleAccent: 'powerful',
      description: 'Four steps take you from deployment to observability, remote action, and automated support workflows.',
      steps: [
        {
          step: '01',
          title: 'Agent Deployment',
          description: 'Install the .exe agent on Windows endpoints in seconds. It supports Windows 10, Windows 11, and Windows Server, with mutual authentication through JWT and API keys.',
        },
        {
          step: '02',
          title: 'Secure NATS Connection',
          description: 'The agent connects through NATS 2.x with JetStream and automatically falls back to SignalR WebSocket when needed. Auth callout and dedicated credentials keep transport access controlled.',
        },
        {
          step: '03',
          title: 'Collection & Monitoring',
          description: 'Hardware inventory, installed software, and live system metrics are collected continuously to feed the web console dashboards and operational visibility.',
        },
        {
          step: '04',
          title: 'Action & Automation',
          description: 'Run remote PowerShell/CMD scripts and packages, open remote sessions, and let auto-ticket rules and AI handle the first triage pass.',
        },
      ],
    },
    stats: {
      items: [
        { value: '12+', label: 'Integrated Modules', icon: '📦' },
        { value: '4', label: 'Release Channels', icon: '🔄' },
        { value: '100%', label: 'Open Source (MIT)', icon: '🔓' },
        { value: '.NET 10', label: 'Server Runtime', icon: '⚡' },
      ],
    },
    cta: {
      title: 'Ready to modernize endpoint operations?',
      description:
        'DiscoveryRMM gives you an open source foundation for monitoring, automation, and AI-assisted support. Explore the repository, contribute, or deploy your own environment today.',
      primaryButton: 'View on GitHub',
      secondaryButton: 'Installation Guide',
      links: ['Server (API)', 'Discovery Agent', 'Documentation'],
    },
    footer: {
      tagline:
        'Open source Remote Monitoring & Management platform. .NET 10 · PostgreSQL · NATS · Redis · built-in AI.',
      projectTitle: 'Project',
      projectLinks: ['Server (API)', 'Windows Agent', 'Configuration'],
      resourcesTitle: 'Resources',
      resourcesLinks: ['Features', 'Architecture', 'Installation', 'Workflow'],
      channelsTitle: 'Channels',
      channels: {
        dev: 'dev · Active',
        beta: 'beta · Pre-release',
        release: 'release · Stable',
        lts: 'lts · Long-Term Support',
      },
      copyright: 'Open source under the MIT license.',
      authorPrefix: 'Built by',
    },
  },
} as const;

type Translation = (typeof translations)[Language];

type I18nContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  text: Translation;
  languageOptions: LanguageOption[];
};

const I18nContext = createContext<I18nContextValue | null>(null);

function isSupportedLanguage(value: string | null): value is Language {
  return value === 'pt-BR' || value === 'en-US';
}

function detectBrowserLanguage(): Language {
  if (typeof navigator === 'undefined') {
    return DEFAULT_LANGUAGE;
  }

  const requestedLanguages = navigator.languages?.length ? navigator.languages : [navigator.language];

  for (const requestedLanguage of requestedLanguages) {
    const normalizedLanguage = requestedLanguage.toLowerCase();

    if (normalizedLanguage.startsWith('pt')) {
      return 'pt-BR';
    }

    if (normalizedLanguage.startsWith('en')) {
      return 'en-US';
    }
  }

  return DEFAULT_LANGUAGE;
}

function getStoredLanguage(): Language | null {
  try {
    const savedLanguage = window.localStorage.getItem(STORAGE_KEY);
    return isSupportedLanguage(savedLanguage) ? savedLanguage : null;
  } catch {
    return null;
  }
}

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE;
  }

  return getStoredLanguage() ?? detectBrowserLanguage();
}

function syncDocumentMetadata(language: Language) {
  const meta = translations[language].meta;
  document.documentElement.lang = language;
  document.title = meta.title;

  const descriptionTag = document.querySelector('meta[name="description"]');
  if (descriptionTag) {
    descriptionTag.setAttribute('content', meta.description);
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    syncDocumentMetadata(language);

    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Ignore persistence failures and keep the in-memory language.
    }
  }, [language]);

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        text: translations[language],
        languageOptions: LANGUAGE_OPTIONS,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }

  return context;
}
