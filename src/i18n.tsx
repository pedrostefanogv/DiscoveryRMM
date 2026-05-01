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
      title: 'DiscoveryRMM',
    },
    navbar: {
      links: [
        { label: 'Funcionalidades', href: '#features' },
        { label: 'Arquitetura', href: '#architecture' },
        { label: 'Instalação', href: '#quickstart' },
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
      badge: 'Open Source RMM — .NET 10 · MIT License',
      titlePrefix: 'Gerencie endpoints com',
      titleAccentPrimary: 'velocidade',
      titleMiddle: 'e',
      titleAccentSecondary: 'controle total',
      subtitlePrefix: 'DiscoveryRMM é um servidor open source de Remote Monitoring & Management que oferece visibilidade completa sobre seus',
      subtitleSuffix: ', com API REST + WebSocket, agent leve, chat com IA e automação inteligente de chamados.',
      noticeAriaLabel: 'Aviso sobre o estado do projeto',
      noticeBadge: 'Aviso',
      noticeText: 'Projeto em desenvolvimento ativo. Parte da interface e de alguns fluxos foi acelerada com apoio de IA e vibe coding, então telas, nomenclaturas e comportamentos ainda podem evoluir antes da estabilização.',
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
      description: 'Do inventário à automação inteligente, o DiscoveryRMM oferece 12+ módulos integrados para equipes de TI que exigem o máximo.',
      items: [
        {
          title: 'Autenticação Robusta',
          description: 'JWT + API Keys + MFA com suporte a TOTP e FIDO2. Hashing Argon2 para senhas. Rate limiting em endpoints críticos.',
          badge: '🧪 Pré-estável',
        },
        {
          title: 'Inventário Completo',
          description: 'Coleta automática de hardware, software e rede de cada endpoint. Relatórios detalhados com auditoria de ativos.',
          badge: '🧪 Pré-estável',
        },
        {
          title: 'Suporte com IA',
          description: 'A IA atua como primeiro nível de atendimento, faz a triagem inicial, sugere respostas e encaminha tickets com mais contexto para a equipe.',
          badge: '🧪 Pré-estável',
        },
        {
          title: 'Auto-Tickets',
          description: 'Motor automático de geração de chamados baseado em eventos e thresholds. Dispare scripts e notificações sem intervenção manual.',
          badge: '🧪 Pré-estável',
        },
        {
          title: 'Acesso Remoto',
          description: 'MeshCentral integrado para controle remoto de endpoints. Debug remoto, terminal interativo e transferência de arquivos.',
          badge: '🧪 Pré-estável',
        },
        {
          title: 'Distribuição P2P',
          description: 'Os agents distribuem arquivos e artefatos entre si para acelerar instalações, reduzir a carga concentrada no servidor e economizar banda durante deploys e atualizações.',
          badge: '🧪 Pré-estável',
        },
        {
          title: 'OpenTelemetry',
          description: 'Rastreamento distribuído e métricas com OpenTelemetry. Visualize latência, throughput e saúde de cada componente do sistema.',
          badge: '🧪 Pré-estável',
        },
        {
          title: 'App Store + Updates',
          description: 'Catálogo de apps com deploy automatizado. Self-update do servidor e agentes com canais beta, LTS e release.',
          badge: '🧪 Pré-estável',
        },
      ],
    },
    architecture: {
      label: 'Arquitetura',
      titlePrefix: 'Três camadas,',
      titleAccent: 'domínio total',
      description: 'O DiscoveryRMM segue uma arquitetura limpa com separação de responsabilidades, garantindo escalabilidade horizontal e segurança em cada camada.',
      components: [
        {
          name: 'Discovery Agent',
          description: 'Agente leve instalado nos endpoints Windows. Coleta inventário de hardware/software, executa scripts PowerShell/CMD remotamente e mantém heartbeat contínuo com o servidor via NATS (fallback SignalR). Auto-update integrado.',
          tech: ['Go', 'NATS', 'SignalR', 'PowerShell'],
        },
        {
          name: 'DiscoveryRMM Server',
          description: 'Backend em .NET 10 / ASP.NET Core. Expõe API REST documentada via Scalar, SignalR Hub para comunicação em tempo real, integração NATS para mensageria, chat com IA (OpenAI/Ollama + pgvector) e sistema de auto-tickets.',
          tech: ['.NET 10', 'ASP.NET Core', 'SignalR', 'Scalar'],
        },
        {
          name: 'Infraestrutura',
          description: 'PostgreSQL 15+ com pgvector para embeddings de IA. NATS 2.x com JetStream para mensageria assíncrona. Redis para cache. Storage local, MinIO ou S3-compatible. OpenTelemetry para observabilidade completa.',
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
        { label: 'OpenAI / Ollama', layer: 'IA' },
        { label: 'OpenTelemetry', layer: 'Observabilidade' },
        { label: 'MeshCentral', layer: 'Acesso Remoto' },
        { label: 'Scalar', layer: 'Docs de API' },
        { label: 'Argon2', layer: 'Segurança' },
        { label: 'FluentMigrator', layer: 'Migrações' },
        { label: 'EF Core 10', layer: 'ORM' },
        { label: 'MinIO / S3', layer: 'Storage' },
        { label: 'NUnit', layer: 'Testes' },
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
      description: 'Siga os passos abaixo para ter o servidor DiscoveryRMM rodando localmente. Para produção em Linux, utilize o script bootstrap de instalação rápida.',
      bootstrapTitle: 'Linux One-Liner',
      bootstrapDescription: 'Instalação completa em produção com um único comando. O script clona o repositório e executa todo o processo automaticamente.',
      terminalLabel: 'Linux · Bash',
      command: LINUX_BOOTSTRAP_COMMAND,
      copyLabel: 'Copiar comando',
      copiedLabel: 'Copiado',
      copyErrorLabel: 'Falha ao copiar',
      copyAriaLabel: 'Copiar comando completo de bootstrap Linux',
      channelsLabel: 'Canais disponíveis:',
      channels: [
        'DISCOVERY_RELEASE_CHANNEL=lts',
        'DISCOVERY_RELEASE_CHANNEL=beta',
        'DISCOVERY_RELEASE_CHANNEL=dev',
        '--branch release',
      ],
      prerequisitesTitle: 'Pré-requisitos',
      prerequisites: [
        { name: '.NET 10 SDK', icon: '⚡' },
        { name: 'PostgreSQL 15+', icon: '🐘', extra: 'com pgvector' },
        { name: 'NATS Server 2.x', icon: '📡' },
        { name: 'Redis', icon: '⚙️', extra: 'opcional, para cache' },
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
          description: 'Inventário completo de hardware (CPU, RAM, disco, rede), software instalado e métricas de sistema são coletados e enviados em tempo real, alimentando os dashboards.',
        },
        {
          step: '04',
          title: 'Ação & Automação',
          description: 'Execute scripts PowerShell/CMD remotamente. O motor de auto-tickets gera chamados automaticamente. A IA analisa e sugere soluções baseadas no histórico de tickets.',
        },
      ],
    },
    stats: {
      items: [
        { value: '.NET 10', label: 'Runtime', icon: '⚡' },
        { value: '4', label: 'Canais de Release', icon: '🔄' },
        { value: '12+', label: 'Módulos Integrados', icon: '📦' },
        { value: '100%', label: 'Open Source (MIT)', icon: '🔓' },
      ],
    },
    cta: {
      title: 'Pronto para transformar sua gestão de TI?',
      description: 'O DiscoveryRMM é open source, está em evolução ativa e conta com canais stable, beta, LTS e dev. Explore o repositório, contribua ou implante sua instância hoje.',
      primaryButton: 'Ver no GitHub',
      secondaryButton: 'Guia de Instalação',
      links: ['Servidor (API)', 'Discovery Agent', 'Documentação'],
    },
    footer: {
      tagline: 'Servidor open source de Remote Monitoring & Management. .NET 10 · PostgreSQL · NATS · Redis · IA integrada.',
      projectTitle: 'Projeto',
      projectLinks: ['Servidor (API)', 'Agent Windows', 'Configuração'],
      resourcesTitle: 'Recursos',
      resourcesLinks: ['Funcionalidades', 'Arquitetura', 'Instalação'],
      channelsTitle: 'Canais',
      channels: [
        'release · Estável',
        'beta · Pré-release',
        'lts · Long-Term Support',
        'dev · Ativo',
      ],
      copyright: 'Open source sob licença MIT.',
      authorPrefix: 'Desenvolvido por',
    },
  },
  'en-US': {
    meta: {
      title: 'DiscoveryRMM',
    },
    navbar: {
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Architecture', href: '#architecture' },
        { label: 'Install', href: '#quickstart' },
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
      badge: 'Open Source RMM — .NET 10 · MIT License',
      titlePrefix: 'Manage endpoints with',
      titleAccentPrimary: 'speed',
      titleMiddle: 'and',
      titleAccentSecondary: 'full control',
      subtitlePrefix: 'DiscoveryRMM is an open source Remote Monitoring & Management server that gives you complete visibility over your',
      subtitleSuffix: ', with REST API + WebSocket, a lightweight agent, AI chat, and intelligent ticket automation.',
      noticeAriaLabel: 'Project status notice',
      noticeBadge: 'Notice',
      noticeText: 'The project is under active development. Parts of the interface and some flows were accelerated with AI support and vibe coding, so screens, naming, and behavior may still evolve before stabilization.',
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
      titleSuffix: 'platform for your operation',
      description: 'From inventory to smart automation, DiscoveryRMM delivers 12+ integrated modules for IT teams that expect full control.',
      items: [
        {
          title: 'Robust Authentication',
          description: 'JWT + API Keys + MFA with TOTP and FIDO2 support. Argon2 password hashing. Rate limiting on critical endpoints.',
          badge: '🧪 Pre-stable',
        },
        {
          title: 'Full Inventory',
          description: 'Automatic hardware, software, and network collection on every endpoint. Detailed reports with asset audit trails.',
          badge: '🧪 Pre-stable',
        },
        {
          title: 'AI-Powered Support',
          description: 'AI acts as the first support layer, triages incoming requests, suggests responses, and forwards tickets with more context to the team.',
          badge: '🧪 Pre-stable',
        },
        {
          title: 'Auto Tickets',
          description: 'Automatic ticket generation engine based on events and thresholds. Trigger scripts and notifications without manual intervention.',
          badge: '🧪 Pre-stable',
        },
        {
          title: 'Remote Access',
          description: 'Integrated MeshCentral for remote endpoint control. Remote debugging, interactive terminal, and file transfer.',
          badge: '🧪 Pre-stable',
        },
        {
          title: 'P2P Distribution',
          description: 'Agents distribute files and artifacts among themselves to accelerate installs, reduce centralized server load, and save bandwidth during deployments and updates.',
          badge: '🧪 Pre-stable',
        },
        {
          title: 'OpenTelemetry',
          description: 'Distributed tracing and metrics with OpenTelemetry. Visualize latency, throughput, and the health of each system component.',
          badge: '🧪 Pre-stable',
        },
        {
          title: 'App Store + Updates',
          description: 'App catalog with automated deployment. Self-update for server and agents with beta, LTS, and release channels.',
          badge: '🧪 Pre-stable',
        },
      ],
    },
    architecture: {
      label: 'Architecture',
      titlePrefix: 'Three layers,',
      titleAccent: 'total ownership',
      description: 'DiscoveryRMM follows a clean architecture with clear separation of concerns, ensuring horizontal scalability and security at every layer.',
      components: [
        {
          name: 'Discovery Agent',
          description: 'A lightweight agent installed on Windows endpoints. It collects hardware/software inventory, runs remote PowerShell/CMD scripts, and keeps a continuous heartbeat with the server through NATS (SignalR fallback). Built-in auto-update included.',
          tech: ['Go', 'NATS', 'SignalR', 'PowerShell'],
        },
        {
          name: 'DiscoveryRMM Server',
          description: 'Backend built with .NET 10 / ASP.NET Core. It exposes a REST API documented through Scalar, a SignalR Hub for real-time communication, NATS integration for messaging, AI chat (OpenAI/Ollama + pgvector), and an auto-ticket engine.',
          tech: ['.NET 10', 'ASP.NET Core', 'SignalR', 'Scalar'],
        },
        {
          name: 'Infrastructure',
          description: 'PostgreSQL 15+ with pgvector for AI embeddings. NATS 2.x with JetStream for asynchronous messaging. Redis for cache. Local storage, MinIO, or S3-compatible backends. OpenTelemetry for full observability.',
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
        { label: 'OpenAI / Ollama', layer: 'AI' },
        { label: 'OpenTelemetry', layer: 'Observability' },
        { label: 'MeshCentral', layer: 'Remote Access' },
        { label: 'Scalar', layer: 'API Docs' },
        { label: 'Argon2', layer: 'Security' },
        { label: 'FluentMigrator', layer: 'Migrations' },
        { label: 'EF Core 10', layer: 'ORM' },
        { label: 'MinIO / S3', layer: 'Storage' },
        { label: 'NUnit', layer: 'Testing' },
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
      description: 'Follow the steps below to get the DiscoveryRMM server running locally. For Linux production environments, use the quick-install bootstrap script.',
      bootstrapTitle: 'Linux One-Liner',
      bootstrapDescription: 'Complete production installation with a single command. The script clones the repository and runs the whole process automatically.',
      terminalLabel: 'Linux · Bash',
      command: LINUX_BOOTSTRAP_COMMAND,
      copyLabel: 'Copy command',
      copiedLabel: 'Copied',
      copyErrorLabel: 'Copy failed',
      copyAriaLabel: 'Copy the full Linux bootstrap command',
      channelsLabel: 'Available channels:',
      channels: [
        'DISCOVERY_RELEASE_CHANNEL=lts',
        'DISCOVERY_RELEASE_CHANNEL=beta',
        'DISCOVERY_RELEASE_CHANNEL=dev',
        '--branch release',
      ],
      prerequisitesTitle: 'Prerequisites',
      prerequisites: [
        { name: '.NET 10 SDK', icon: '⚡' },
        { name: 'PostgreSQL 15+', icon: '🐘', extra: 'with pgvector' },
        { name: 'NATS Server 2.x', icon: '📡' },
        { name: 'Redis', icon: '⚙️', extra: 'optional, for cache' },
      ],
    },
    howItWorks: {
      label: 'Workflow',
      titlePrefix: 'Simple, fast, and',
      titleAccent: 'powerful',
      description: 'In just four steps, your infrastructure becomes fully monitored and under control, with AI built in.',
      steps: [
        {
          step: '01',
          title: 'Agent Deployment',
          description: 'Install the .exe agent on Windows endpoints in seconds. Compatible with Windows 10/11 and Windows Server. Mutual authentication with the server through JWT + API Key.',
        },
        {
          step: '02',
          title: 'Secure NATS Connection',
          description: 'The agent connects to the server through NATS 2.x with JetStream. Automatic fallback to SignalR WebSocket. Authentication with auth callout and dedicated credentials.',
        },
        {
          step: '03',
          title: 'Collection & Monitoring',
          description: 'Complete hardware inventory (CPU, RAM, disk, network), installed software, and system metrics are collected and streamed in real time to power dashboards.',
        },
        {
          step: '04',
          title: 'Action & Automation',
          description: 'Run remote PowerShell/CMD scripts. The auto-ticket engine opens tickets automatically. AI analyzes history and suggests next steps based on prior tickets.',
        },
      ],
    },
    stats: {
      items: [
        { value: '.NET 10', label: 'Runtime', icon: '⚡' },
        { value: '4', label: 'Release Channels', icon: '🔄' },
        { value: '12+', label: 'Integrated Modules', icon: '📦' },
        { value: '100%', label: 'Open Source (MIT)', icon: '🔓' },
      ],
    },
    cta: {
      title: 'Ready to transform your IT operations?',
      description: 'DiscoveryRMM is open source, under active evolution, and ships with stable, beta, LTS, and dev channels. Explore the repository, contribute, or deploy your own instance today.',
      primaryButton: 'View on GitHub',
      secondaryButton: 'Installation Guide',
      links: ['Server (API)', 'Discovery Agent', 'Documentation'],
    },
    footer: {
      tagline: 'Open source Remote Monitoring & Management server. .NET 10 · PostgreSQL · NATS · Redis · Built-in AI.',
      projectTitle: 'Project',
      projectLinks: ['Server (API)', 'Windows Agent', 'Configuration'],
      resourcesTitle: 'Resources',
      resourcesLinks: ['Features', 'Architecture', 'Installation'],
      channelsTitle: 'Channels',
      channels: [
        'release · Stable',
        'beta · Pre-release',
        'lts · Long-Term Support',
        'dev · Active',
      ],
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

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE;
  }

  const savedLanguage = window.localStorage.getItem(STORAGE_KEY);
  return isSupportedLanguage(savedLanguage) ? savedLanguage : DEFAULT_LANGUAGE;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = translations[language].meta.title;
    window.localStorage.setItem(STORAGE_KEY, language);
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