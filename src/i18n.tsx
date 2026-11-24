import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useHashLocation, type ActiveRoute, type DocSectionId } from './hooks/useHashRoute';

export type Language = 'pt-BR' | 'en-US';

type LanguageOption = {
  code: Language;
  label: string;
};

const DEFAULT_LANGUAGE: Language = 'pt-BR';
const STORAGE_KEY = 'discoveryrmm-language';
const LINUX_BOOTSTRAP_COMMAND = 'bash -c "$(curl -fsSL https://raw.githubusercontent.com/pedrostefanogv/DiscoveryRMM_API/release/scripts/linux/bootstrap_install_discovery.sh)"';

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'pt-BR', label: 'Português' },
  { code: 'en-US', label: 'English' },
];

const translations = {
  'pt-BR': {
    meta: {
      title: 'DiscoveryRMM — RMM open source para operações de TI',
      privacyTitle: 'Política de Privacidade (LGPD) — DiscoveryRMM',
      termsTitle: 'Termos de Uso — DiscoveryRMM',
      docsTitle: 'Documentação Completa — DiscoveryRMM',
      description:
        'DiscoveryRMM é uma plataforma RMM open source para operações de TI: inventário de endpoints, monitoramento, acesso remoto, proxy LAN, RDP/WebRDP, automação e chamados com SLA, com suporte assistido por IA.',
    },
    common: {
      skipToContent: 'Pular para o conteúdo principal',
      backToTop: 'Voltar ao topo',
    },
    navbar: {
      navAriaLabel: 'Principal',
      links: [
        { label: 'Funcionalidades', href: '#features' },
        { label: 'Interface', href: '#showcase' },
        { label: 'Arquitetura', href: '#architecture' },
        { label: 'Instalação', href: '#quickstart' },
        { label: 'Fluxo', href: '#how-it-works' },
        { label: 'GitHub', href: 'https://github.com/pedrostefanogv/DiscoveryRMM_API', external: true },
      ],
      docsLink: 'Documentação',
      cta: 'Comece Agora',
      openMenuLabel: 'Abrir menu de navegação',
      closeMenuLabel: 'Fechar menu de navegação',
      languageSwitcherLabel: 'Selecionar idioma',
      languageOptionLabel: 'Ativar idioma',
      switchToLightLabel: 'Alternar para tema claro',
      switchToDarkLabel: 'Alternar para tema escuro',
    },
    hero: {
      rotatingItems: ['Windows 10/11', 'Windows Server', 'estações', 'servidores'],
      badge: 'Plataforma RMM open source para times de TI',
      titlePrefix: 'Gerencie endpoints com',
      titleAccentPrimary: 'velocidade',
      titleMiddle: 'e',
      titleAccentSecondary: 'controle total',
      subtitlePrefix: 'DiscoveryRMM é um servidor open source de Remote Monitoring & Management que oferece visibilidade completa sobre seus',
      subtitleSuffix:
        ', com API REST + SSE, mensageria NATS/JetStream, agent leve para Windows, console web, chat com IA e automação inteligente de chamados.',
      noticeAriaLabel: 'Aviso sobre o estado do projeto',
      noticeBadge: 'Aviso',
      noticeText:
        'Projeto em desenvolvimento ativo. Parte da interface e de alguns fluxos foi acelerada com apoio de IA e vibe coding, então telas, nomenclaturas e comportamentos ainda podem evoluir antes da estabilização. Homologação acompanha a branch dev; produção recebe apenas a release.',
      primaryCta: 'Instalar Agora',
      docsCta: 'Ler Documentação',
      secondaryCta: 'Ver no GitHub',
      copyLabel: 'Copiar comando',
      copiedLabel: 'Copiado',
      copyErrorLabel: 'Falha ao copiar',
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
      filterLabel: 'Filtrar módulos por área',
      filters: [
        { id: 'all', label: 'Todos (12)' },
        { id: 'security', label: 'Segurança & IAM' },
        { id: 'remote', label: 'Operação & Remoto' },
        { id: 'itsm', label: 'IA & ITSM' },
        { id: 'automation', label: 'Automação & Deploy' },
      ],
      docsCta: 'Ver configuração e integração entre módulos',
      items: [
        {
          title: 'Autenticação Robusta',
          description: 'JWT + API Keys + MFA com suporte a TOTP, FIDO2 e WebAuthn. Hashing Argon2 para senhas e rate limiting nos endpoints críticos.',
        },
        {
          title: 'Inventário Completo',
          description: 'Coleta automática de hardware, software e rede de cada endpoint (coletores nativos + osquery/PowerShell), com relatórios e auditoria de ativos.',
        },
        {
          title: 'Suporte com IA',
          description: 'IA como primeiro nível de atendimento via OpenRouter (ou Ollama local): triagem, sugestão de respostas com busca semântica e chat com ferramentas MCP, com guardrails e controle de custo por modelo.',
        },
        {
          title: 'Chamados & SLA',
          description: 'Filas, templates e campos customizados para tickets, calendários de SLA, escalonamento automático, macros, pesquisa de satisfação (CSAT) e notificações por e-mail, webhook e push no navegador.',
        },
        {
          title: 'Auto-Tickets',
          description: 'Motor automático de abertura de chamados baseado em eventos e thresholds. Dispare scripts e notificações sem intervenção manual.',
        },
        {
          title: 'Acesso Remoto',
          description: 'Suporte remoto nativo transportado por NATS: tela em tempo real (WebP/JPEG), RDP/WebRDP, terminal interativo (ConPTY), transferência binária de arquivos, processos, proxy LAN (HTTP/TCP), debug remoto e gravação de sessão.',
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
          description: 'Catálogo com fontes Chocolatey e Winget, aprovações, deploy automatizado e self-update do agent. No servidor, a atualização é sempre manual pelo instalador.',
        },
        {
          title: 'Relatórios & Auditoria',
          description: 'Relatórios em XLSX, CSV e Markdown com agendamento, histórico de execuções, presets de filtro e auditoria de configuração.',
        },
        {
          title: 'Base de Conhecimento & MCP',
          description: 'Artigos versionados com busca semântica por embeddings (pgvector, habilitável) e execução de ferramentas MCP com políticas de permissão para a IA.',
        },
        {
          title: 'Multi-tenant & IAM',
          description: 'Modelo Client → Site → Agent, departamentos, grupos, papéis e permissões granulares, campos customizados e tokens de implantação por escopo.',
        },
      ],
    },
    showcase: {
      label: 'Interface Real',
      titlePrefix: 'Conheça o',
      titleAccent: 'produto em operação',
      description:
        'Capturas reais do Console Web (React 19) e do Discovery Agent (Windows / Wails v3), renderizadas diretamente das interfaces oficiais do ecossistema.',
      tablistLabel: 'Capturas de tela do DiscoveryRMM',
      expandLabel: 'Ampliar imagem',
      closeLightboxLabel: 'Fechar visualização ampliada',
      lightboxLabel: 'Visualização ampliada da captura de tela',
      sourceBadges: {
        console: 'Console Web · React 19',
        agent: 'Windows Agent · Wails v3',
      },
      items: [
        {
          id: 'console-login',
          tabLabel: 'Login & MFA',
          title: 'Console Web — Autenticação Segura',
          caption: 'Fluxo de login com suporte a MFA (TOTP, FIDO2 e WebAuthn), primeiro acesso guiado e seleção de tema claro/escuro.',
          alt: 'Tela de autenticação do Console Web DiscoveryRMM com campos de login, senha e orientações de MFA.',
          file: 'console-login.png',
          sourceType: 'console',
        },
        {
          id: 'console-modules',
          tabLabel: 'Módulos & Automação',
          title: 'Console Web — Navegação & Automação',
          caption: 'Estrutura modular completa com Clientes, Service Board, Agentes, Sensores, Patches, Softwares e Automação com Scripts, Tarefas e Auditoria.',
          alt: 'Painel de Automação do Console Web DiscoveryRMM exibindo menu lateral de módulos e cartões de Scripts, Tarefas, Operações e Auditoria.',
          file: 'console-modules.png',
          sourceType: 'console',
        },
        {
          id: 'agent-chat',
          tabLabel: 'Agent Chat IA',
          title: 'Discovery Agent — Chat IA no Endpoint',
          caption: 'Interface desktop nativa em Wails v3 para atendimento assistido por IA, visualização de ferramentas MCP, controles de privacidade e anexos de tela.',
          alt: 'Interface do Discovery Agent para Windows exibindo a aba Chat IA com menu lateral e controles de ferramentas e privacidade.',
          file: 'agent-chat.png',
          sourceType: 'agent',
        },
        {
          id: 'agent-debug',
          tabLabel: 'Agent Diagnóstico',
          title: 'Discovery Agent — Identidade TPM & Debug',
          caption: 'Inspeção local de status do serviço, identidade de hardware via TPM 2.0 EK e UUID SMBIOS, além de configuração de API, NATS e TLS.',
          alt: 'Interface do Discovery Agent para Windows exibindo a aba Debug com status do agente, identidade TPM 2.0 e parâmetros de conexão API e NATS.',
          file: 'agent-debug.png',
          sourceType: 'agent',
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
          description: 'Agente leve instalado nos endpoints Windows. Coleta inventário de hardware/software (coletores nativos + osquery/PowerShell), executa scripts remotamente, participa da malha P2P e mantém heartbeat com o servidor via NATS (com fallback REST/SSE). Auto-update integrado.',
          tech: ['Go 1.26', 'Wails v3', 'NATS', 'libp2p'],
        },
        {
          name: 'DiscoveryRMM Server',
          description: 'Backend em .NET 10 / ASP.NET Core. Expõe API REST versionada documentada via Scalar, SSE para streams HTTP em tempo real, NATS/JetStream para mensageria e jobs agendados (Quartz.NET), chat com IA (OpenAI/Ollama + pgvector) e motor de auto-tickets.',
          tech: ['.NET 10', 'ASP.NET Core', 'NATS/JetStream', 'REST + SSE'],
        },
        {
          name: 'Console Web',
          description: 'SPA administrativa e operacional em React 19 para dashboards, inventário, tickets, automação, relatórios e sessões remotas (tela, ConPTY, arquivos, proxy LAN e RDP/WebRDP). Consome a API REST e o realtime via NATS over WebSocket e SSE, com fallback offline para leitura.',
          tech: ['React 19', 'TypeScript 7', 'Vite 8', 'Tailwind 4'],
        },
        {
          name: 'Infraestrutura',
          description: 'PostgreSQL 15+ com pgvector para embeddings de IA e NATS 2.x com JetStream para mensageria assíncrona. Redis para cache, storage local, MinIO ou S3-compatible e OpenTelemetry opcional para observabilidade.',
          tech: ['PostgreSQL', 'Redis', 'NATS', 'MinIO/S3'],
        },
      ],
      stackTitle: 'Stack Tecnológica',
      stackGroups: [
        {
          title: 'Agente Windows',
          items: [
            { label: 'Go 1.26', layer: 'Runtime' },
            { label: 'Wails v3', layer: 'UI desktop' },
            { label: 'Win32 / osquery', layer: 'Inventário' },
            { label: 'libp2p', layer: 'Malha P2P' },
            { label: 'modernc SQLite', layer: 'Cache local' },
          ],
        },
        {
          title: 'Servidor',
          items: [
            { label: '.NET 10', layer: 'Runtime' },
            { label: 'ASP.NET Core', layer: 'API REST v1' },
            { label: 'MediatR', layer: 'CQRS' },
            { label: 'FluentValidation', layer: 'Validação' },
            { label: 'SSE + REST', layer: 'Streaming HTTP' },
            { label: 'NATS.NET + JetStream', layer: 'Mensageria' },
            { label: 'Quartz.NET', layer: 'Jobs agendados' },
            { label: 'Scalar', layer: 'Docs de API' },
            { label: 'Argon2 + FIDO2', layer: 'Autenticação' },
          ],
        },
        {
          title: 'Console Web',
          items: [
            { label: 'React 19', layer: 'Interface' },
            { label: 'TypeScript 7', layer: 'Tipagem' },
            { label: 'Vite 8', layer: 'Build' },
            { label: 'Tailwind 4', layer: 'Estilo' },
            { label: 'TanStack Query', layer: 'Dados' },
            { label: 'xterm.js', layer: 'Terminal' },
            { label: 'PWA + Web Push', layer: 'App instalável' },
          ],
        },
        {
          title: 'Dados, IA e Infraestrutura',
          items: [
            { label: 'PostgreSQL 15+', layer: 'Banco de dados' },
            { label: 'pgvector', layer: 'Embeddings' },
            { label: 'Redis', layer: 'Cache' },
            { label: 'FluentMigrator', layer: 'Migrações' },
            { label: 'EF Core 10', layer: 'ORM' },
            { label: 'OpenRouter / OpenAI-compat.', layer: 'IA' },
            { label: 'MinIO / S3', layer: 'Storage' },
            { label: 'OpenTelemetry', layer: 'Observabilidade (opcional)' },
          ],
        },
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
      channelSelectedHint: 'Clique em um canal para atualizar o comando acima:',
      channels: [
        'DISCOVERY_RELEASE_CHANNEL=lts',
        'DISCOVERY_RELEASE_CHANNEL=beta',
        'DISCOVERY_RELEASE_CHANNEL=dev',
        '--branch release',
        'install_discovery_server.sh --mode update',
      ],
      docsInstallLink: 'Guia completo de instalação do servidor',
      docsRequirementsLink: 'Requisitos e matriz de portas',
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
          description: 'O agent estabelece conexão com o servidor via NATS 2.x com JetStream. Fallback automático via HTTPS REST/SSE. Autenticação com auth callout e credenciais dedicadas.',
        },
        {
          step: '03',
          title: 'Coleta & Monitoramento',
          description: 'Inventário completo de hardware (CPU, RAM, disco, rede), software instalado e métricas de sistema são coletados e enviados em tempo real, alimentando os dashboards do console web.',
        },
        {
          step: '04',
          title: 'Ação & Automação',
          description: 'Execute scripts PowerShell/CMD e pacotes remotamente, abra sessões de acesso remoto (tela, terminal, proxy LAN ou RDP/WebRDP) e deixe o motor de auto-tickets e a IA cuidarem da triagem inicial.',
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
      docsButton: 'Documentação Completa',
      links: ['Servidor (API)', 'Discovery Agent', 'Documentação'],
    },
    footer: {
      tagline:
        'Plataforma open source de Remote Monitoring & Management. .NET 10 · PostgreSQL · NATS · Redis · IA integrada.',
      projectTitle: 'Projeto',
      projectLinks: ['Servidor (API)', 'Agent Windows', 'Configuração'],
      docsLink: 'Portal de Documentação',
      resourcesTitle: 'Recursos',
      resourcesLinks: ['Funcionalidades', 'Interface', 'Arquitetura', 'Instalação', 'Fluxo de Trabalho'],
      channelsTitle: 'Canais',
      channels: {
        dev: 'dev · Ativo',
        beta: 'beta · Pré-release',
        release: 'release · Estável',
        lts: 'lts · Long-Term Support',
      },
      copyright: 'Open source sob licença MIT.',
      legalNavLabel: 'Documentos legais',
      privacyLink: 'Política de Privacidade (LGPD)',
      termsLink: 'Termos de Uso',
      authorPrefix: 'Desenvolvido por',
    },
    legal: {
      backToHome: 'Voltar à página inicial',
      lastUpdatedLabel: 'Última atualização:',
      lastUpdatedDate: 'Novembro de 2026',
      privacy: {
        badge: 'LGPD · Privacidade',
        title: 'Política de Privacidade e LGPD',
        lead: 'Esta política descreve como este site estático trata informações e esclarece as responsabilidades sobre dados pessoais em instâncias self-hosted do ecossistema DiscoveryRMM conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).',
        sections: [
          {
            heading: '1. Escopo desta página institucional',
            paragraphs: [
              'Este endereço (pedrostefanogv.github.io/DiscoveryRMM/) é uma landing page estática e informativa de código aberto. Ela não opera servidores de aplicação, não cria contas de usuário e não coleta telemetria de uso.',
            ],
          },
          {
            heading: '2. Dados tratados durante a navegação neste site',
            paragraphs: [
              'Não utilizamos cookies de rastreamento, pixels de publicidade ou ferramentas de analytics de terceiros.',
              'Armazenamos exclusivamente a preferência de idioma da interface (chave "discoveryrmm-language" no localStorage do navegador) para preservar sua escolha entre visitas.',
              'A hospedagem estática no GitHub Pages e o carregamento de fontes via Google Fonts podem gerar logs técnicos padrão de acesso (como endereço IP e User-Agent) diretamente junto aos respectivos provedores de infraestrutura.',
            ],
          },
          {
            heading: '3. Instâncias Self-Hosted e Controlador de Dados (LGPD Art. 5º, VI)',
            paragraphs: [
              'Quando uma organização implanta o servidor DiscoveryRMM_API, o Console Web e o Discovery Agent em sua própria infraestrutura, essa organização atua como Controladora dos dados pessoais e operacionais tratados.',
              'Os mantenedores do projeto DiscoveryRMM não recebem telemetria, inventário, credenciais ou gravações de sessões remotas de instâncias de terceiros. Em ambientes self-hosted, o sistema pode tratar dados de endpoints (hostname, endereço IP, inventário de hardware e software, logs, sessões de usuário, suporte remoto e prompts opcionais enviados a provedores de IA configurados como OpenRouter, OpenAI ou Ollama).',
            ],
          },
          {
            heading: '4. Direitos dos Titulares e Contato (LGPD Art. 18)',
            paragraphs: [
              'Solicitações de acesso, correção, anonimização ou eliminação de dados tratados em uma instância self-hosted — incluindo registros de auditoria e gravações de suporte remoto — devem ser direcionadas diretamente ao administrador/Controlador da respectiva organização.',
              'Dúvidas sobre este site institucional ou sobre o código-fonte do projeto podem ser encaminhadas pelos repositórios oficiais no GitHub (@pedrostefanogv).',
            ],
          },
        ],
      },
      terms: {
        badge: 'Licença & Uso',
        title: 'Termos de Uso',
        lead: 'Ao acessar este site ou utilizar os componentes open source do ecossistema DiscoveryRMM, você concorda com as condições de licenciamento, uso autorizado e limitações descritas abaixo.',
        sections: [
          {
            heading: '1. Licença Open Source (MIT)',
            paragraphs: [
              'O DiscoveryRMM e esta landing page são distribuídos sob a licença MIT. O software é fornecido "NO ESTADO EM QUE SE ENCONTRA" ("AS IS"), sem garantias expressas ou implícitas de comercialização, adequação a um propósito específico ou não violação.',
            ],
          },
          {
            heading: '2. Uso Autorizado e Responsabilidade Operacional',
            paragraphs: [
              'Recursos de gerenciamento remoto — incluindo execução de scripts PowerShell/CMD, acesso remoto de tela, RDP/WebRDP, transferência de arquivos e proxy LAN (HTTP/TCP) — só devem ser utilizados em dispositivos, redes e ambientes para os quais você possua autorização expressa.',
              'O operador da instância é integralmente responsável pela segurança de credenciais, chaves NATS, certificados TLS, políticas de consentimento remoto e conformidade legal aplicável.',
            ],
          },
          {
            heading: '3. Estado Pré-Estável e Recursos com IA',
            paragraphs: [
              'O ecossistema encontra-se em desenvolvimento ativo. Valide atualizações em ambiente de homologação (branch dev/beta) antes de implantar em produção.',
              'Ao habilitar provedores externos de IA (como OpenRouter ou APIs compatíveis com OpenAI), revise os termos, políticas de retenção e custos do provedor escolhido antes de enviar dados operacionais.',
            ],
          },
          {
            heading: '4. Links e Serviços de Terceiros',
            paragraphs: [
              'Este site contém links para repositórios no GitHub, documentação técnica e catálogos externos (como Chocolatey e Winget). Não nos responsabilizamos pelo conteúdo ou disponibilidade de serviços mantidos por terceiros.',
            ],
          },
        ],
      },
    },
  },
  'en-US': {
    meta: {
      title: 'DiscoveryRMM — Open source RMM for IT operations',
      privacyTitle: 'Privacy Policy (LGPD) — DiscoveryRMM',
      termsTitle: 'Terms of Use — DiscoveryRMM',
      docsTitle: 'Complete Documentation — DiscoveryRMM',
      description:
        'DiscoveryRMM is an open source RMM platform for IT operations: endpoint inventory, monitoring, remote access, LAN proxy, RDP/WebRDP, automation, and SLA-driven ticketing with AI-assisted support.',
    },
    common: {
      skipToContent: 'Skip to main content',
      backToTop: 'Back to top',
    },
    navbar: {
      navAriaLabel: 'Primary',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Showcase', href: '#showcase' },
        { label: 'Architecture', href: '#architecture' },
        { label: 'Install', href: '#quickstart' },
        { label: 'Workflow', href: '#how-it-works' },
        { label: 'GitHub', href: 'https://github.com/pedrostefanogv/DiscoveryRMM_API', external: true },
      ],
      docsLink: 'Docs',
      cta: 'Get Started',
      openMenuLabel: 'Open navigation menu',
      closeMenuLabel: 'Close navigation menu',
      languageSwitcherLabel: 'Select language',
      languageOptionLabel: 'Switch language to',
      switchToLightLabel: 'Switch to light theme',
      switchToDarkLabel: 'Switch to dark theme',
    },
    hero: {
      rotatingItems: ['Windows 10/11', 'Windows Server', 'workstations', 'servers'],
      badge: 'Open source RMM platform for IT teams',
      titlePrefix: 'Run endpoint operations with',
      titleAccentPrimary: 'speed',
      titleMiddle: 'and',
      titleAccentSecondary: 'confidence',
      subtitlePrefix: 'DiscoveryRMM is an open source Remote Monitoring & Management server that gives you full visibility across your',
      subtitleSuffix:
        ', with REST/SSE APIs, NATS/JetStream messaging, a lightweight Windows agent, a web console, AI-assisted support, and automated ticketing.',
      noticeAriaLabel: 'Project status notice',
      noticeBadge: 'Notice',
      noticeText:
        'The platform is evolving quickly. Parts of the interface and some flows were accelerated with AI support and vibe coding, so screens, terminology, and behavior may still change before the product settles. Staging tracks the dev branch; production only ships the release branch.',
      primaryCta: 'Install Now',
      docsCta: 'Read Documentation',
      secondaryCta: 'View on GitHub',
      copyLabel: 'Copy command',
      copiedLabel: 'Copied',
      copyErrorLabel: 'Copy failed',
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
      filterLabel: 'Filter modules by area',
      filters: [
        { id: 'all', label: 'All (12)' },
        { id: 'security', label: 'Security & IAM' },
        { id: 'remote', label: 'Operations & Remote' },
        { id: 'itsm', label: 'AI & ITSM' },
        { id: 'automation', label: 'Automation & Deploy' },
      ],
      docsCta: 'See module configuration & integration guide',
      items: [
        {
          title: 'Robust Authentication',
          description: 'JWT, API keys, and MFA with TOTP, FIDO2, and WebAuthn protect privileged access. Argon2 hashing and rate limits harden sensitive endpoints.',
        },
        {
          title: 'Full Inventory',
          description: 'Continuously collect hardware, software, and network data from every endpoint (native collectors + osquery/PowerShell) and turn raw telemetry into auditable asset visibility.',
        },
        {
          title: 'AI-Powered Support',
          description: 'AI as your first support line through OpenRouter (or a local Ollama): triage, reply suggestions backed by semantic search, and tool-using chat over MCP, with guardrails and per-model cost control.',
        },
        {
          title: 'Tickets & SLA',
          description: 'Queues, templates, and custom fields for tickets, SLA calendars, automatic escalation, macros, CSAT surveys, and notifications over email, webhooks, and browser push.',
        },
        {
          title: 'Auto Tickets',
          description: 'Generate tickets automatically from events and thresholds. Trigger scripts and notifications before issues become outages.',
        },
        {
          title: 'Remote Access',
          description: 'Native remote support carried over NATS: real-time screen (WebP/JPEG), RDP/WebRDP, interactive terminal (ConPTY), binary file transfer, processes, LAN proxy (HTTP/TCP), remote debugging, and session recording.',
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
          description: 'Curated catalog backed by Chocolatey and Winget, with approvals, automated rollout, and agent self-update. Server updates are always manual through the installer.',
        },
        {
          title: 'Reports & Audit',
          description: 'Reports in XLSX, CSV, and Markdown with scheduling, execution history, filter presets, and configuration audit trails.',
        },
        {
          title: 'Knowledge Base & MCP',
          description: 'Versioned articles with semantic search over embeddings (pgvector, opt-in) and MCP tool execution guarded by AI permission policies.',
        },
        {
          title: 'Multi-tenant & IAM',
          description: 'Client → Site → Agent hierarchy, departments, groups, roles, granular permissions, custom fields, and scoped deployment tokens.',
        },
      ],
    },
    showcase: {
      label: 'Real Interface',
      titlePrefix: 'See the',
      titleAccent: 'platform in action',
      description:
        'Authentic screenshots captured directly from the Web Console (React 19) and the Windows Discovery Agent (Wails v3) UI.',
      tablistLabel: 'DiscoveryRMM product screenshots',
      expandLabel: 'Expand image',
      closeLightboxLabel: 'Close enlarged view',
      lightboxLabel: 'Enlarged screenshot preview',
      sourceBadges: {
        console: 'Web Console · React 19',
        agent: 'Windows Agent · Wails v3',
      },
      items: [
        {
          id: 'console-login',
          tabLabel: 'Login & MFA',
          title: 'Web Console — Secure Authentication',
          caption: 'Sign-in flow supporting MFA (TOTP, FIDO2, and WebAuthn), guided first-access setup, and light/dark theme toggle.',
          alt: 'DiscoveryRMM Web Console login screen showing username/email, password fields, and two-step verification guidance.',
          file: 'console-login.png',
          sourceType: 'console',
        },
        {
          id: 'console-modules',
          tabLabel: 'Modules & Automation',
          title: 'Web Console — Navigation & Automation',
          caption: 'Full modular workspace covering Clients, Service Board, Agents, Sensors, Patches, Software, and Automation with Scripts, Tasks, Operations, and Audit.',
          alt: 'DiscoveryRMM Web Console Automation page showing the sidebar navigation modules and cards for Scripts, Tasks, Operations, and Audit.',
          file: 'console-modules.png',
          sourceType: 'console',
        },
        {
          id: 'agent-chat',
          tabLabel: 'Agent AI Chat',
          title: 'Discovery Agent — Endpoint AI Chat',
          caption: 'Native Wails v3 desktop UI for AI-assisted support, MCP tool inspection, privacy controls, and screen attachment capture.',
          alt: 'Discovery Windows Agent UI showing the AI Chat view with sidebar modules and tool/privacy controls.',
          file: 'agent-chat.png',
          sourceType: 'agent',
        },
        {
          id: 'agent-debug',
          tabLabel: 'Agent Diagnostics',
          title: 'Discovery Agent — TPM Identity & Debug',
          caption: 'Local diagnostics for service status, hardware identity (TPM 2.0 EK and SMBIOS UUID), and API, NATS, and TLS connection settings.',
          alt: 'Discovery Windows Agent UI showing the Debug view with agent status, TPM 2.0 hardware identity, and API/NATS configuration.',
          file: 'agent-debug.png',
          sourceType: 'agent',
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
          description: 'A lightweight agent for Windows endpoints. It collects hardware and software inventory (native collectors + osquery/PowerShell), runs remote scripts, joins the P2P mesh, and keeps a heartbeat with the server over NATS with HTTPS REST/SSE fallback. Auto-update is included.',
          tech: ['Go 1.26', 'Wails v3', 'NATS', 'libp2p'],
        },
        {
          name: 'DiscoveryRMM Server',
          description: 'A .NET 10 / ASP.NET Core backend that exposes a versioned REST API documented with Scalar, SSE streaming for real-time HTTP updates, NATS/JetStream messaging, Quartz.NET scheduled jobs, AI chat (OpenAI/Ollama + pgvector), and an automated ticket engine.',
          tech: ['.NET 10', 'ASP.NET Core', 'NATS/JetStream', 'REST + SSE'],
        },
        {
          name: 'Web Console',
          description: 'A React 19 SPA for dashboards, inventory, ticketing, automation, reports, and remote sessions (screen, ConPTY, files, LAN proxy, and RDP/WebRDP). It consumes the REST API plus realtime over NATS WebSocket and SSE, with offline read caching.',
          tech: ['React 19', 'TypeScript 7', 'Vite 8', 'Tailwind 4'],
        },
        {
          name: 'Infrastructure',
          description: 'PostgreSQL 15+ with pgvector powers AI embeddings, while NATS 2.x with JetStream handles asynchronous messaging. Redis accelerates cache access, and local, MinIO, or S3-compatible storage covers assets. OpenTelemetry observability is optional.',
          tech: ['PostgreSQL', 'Redis', 'NATS', 'MinIO/S3'],
        },
      ],
      stackTitle: 'Technology Stack',
      stackGroups: [
        {
          title: 'Windows Agent',
          items: [
            { label: 'Go 1.26', layer: 'Runtime' },
            { label: 'Wails v3', layer: 'Desktop UI' },
            { label: 'Win32 / osquery', layer: 'Inventory' },
            { label: 'libp2p', layer: 'P2P mesh' },
            { label: 'modernc SQLite', layer: 'Local cache' },
          ],
        },
        {
          title: 'Server',
          items: [
            { label: '.NET 10', layer: 'Runtime' },
            { label: 'ASP.NET Core', layer: 'REST API v1' },
            { label: 'MediatR', layer: 'CQRS' },
            { label: 'FluentValidation', layer: 'Validation' },
            { label: 'SSE + REST', layer: 'HTTP Streaming' },
            { label: 'NATS.NET + JetStream', layer: 'Messaging' },
            { label: 'Quartz.NET', layer: 'Scheduled jobs' },
            { label: 'Scalar', layer: 'API docs' },
            { label: 'Argon2 + FIDO2', layer: 'Authentication' },
          ],
        },
        {
          title: 'Web Console',
          items: [
            { label: 'React 19', layer: 'Interface' },
            { label: 'TypeScript 7', layer: 'Types' },
            { label: 'Vite 8', layer: 'Build' },
            { label: 'Tailwind 4', layer: 'Styling' },
            { label: 'TanStack Query', layer: 'Data' },
            { label: 'xterm.js', layer: 'Terminal' },
            { label: 'PWA + Web Push', layer: 'Installable app' },
          ],
        },
        {
          title: 'Data, AI & Infrastructure',
          items: [
            { label: 'PostgreSQL 15+', layer: 'Database' },
            { label: 'pgvector', layer: 'Embeddings' },
            { label: 'Redis', layer: 'Cache' },
            { label: 'FluentMigrator', layer: 'Migrations' },
            { label: 'EF Core 10', layer: 'ORM' },
            { label: 'OpenRouter / OpenAI-compat.', layer: 'AI' },
            { label: 'MinIO / S3', layer: 'Storage' },
            { label: 'OpenTelemetry', layer: 'Observability (optional)' },
          ],
        },
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
      channelSelectedHint: 'Click a channel to update the command above:',
      channels: [
        'DISCOVERY_RELEASE_CHANNEL=lts',
        'DISCOVERY_RELEASE_CHANNEL=beta',
        'DISCOVERY_RELEASE_CHANNEL=dev',
        '--branch release',
        'install_discovery_server.sh --mode update',
      ],
      docsInstallLink: 'Full server installation guide',
      docsRequirementsLink: 'Requirements & port matrix',
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
          description: 'The agent connects through NATS 2.x with JetStream and automatically falls back via HTTPS REST/SSE when needed. Auth callout and dedicated credentials keep transport access controlled.',
        },
        {
          step: '03',
          title: 'Collection & Monitoring',
          description: 'Hardware inventory, installed software, and live system metrics are collected continuously to feed the web console dashboards and operational visibility.',
        },
        {
          step: '04',
          title: 'Action & Automation',
          description: 'Run remote PowerShell/CMD scripts and packages, open remote sessions (screen, terminal, LAN proxy, or RDP/WebRDP), and let auto-ticket rules and AI handle the first triage pass.',
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
      docsButton: 'Full Documentation',
      links: ['Server (API)', 'Discovery Agent', 'Documentation'],
    },
    footer: {
      tagline:
        'Open source Remote Monitoring & Management platform. .NET 10 · PostgreSQL · NATS · Redis · built-in AI.',
      projectTitle: 'Project',
      projectLinks: ['Server (API)', 'Windows Agent', 'Configuration'],
      docsLink: 'Documentation Portal',
      resourcesTitle: 'Resources',
      resourcesLinks: ['Features', 'Showcase', 'Architecture', 'Installation', 'Workflow'],
      channelsTitle: 'Channels',
      channels: {
        dev: 'dev · Active',
        beta: 'beta · Pre-release',
        release: 'release · Stable',
        lts: 'lts · Long-Term Support',
      },
      copyright: 'Open source under the MIT license.',
      legalNavLabel: 'Legal documents',
      privacyLink: 'Privacy Policy (LGPD)',
      termsLink: 'Terms of Use',
      authorPrefix: 'Built by',
    },
    legal: {
      backToHome: 'Back to home',
      lastUpdatedLabel: 'Last updated:',
      lastUpdatedDate: 'November 2026',
      privacy: {
        badge: 'LGPD · Privacy',
        title: 'Privacy Policy & LGPD Notice',
        lead: 'This policy explains how this static website handles information and clarifies personal-data controller responsibilities for self-hosted DiscoveryRMM deployments, aligned with Brazil’s General Data Protection Law (LGPD — Law No. 13.709/2018).',
        sections: [
          {
            heading: '1. Scope of this institutional website',
            paragraphs: [
              'This site (pedrostefanogv.github.io/DiscoveryRMM/) is a static, open-source informational landing page. It does not run application servers, create user accounts, or collect usage telemetry.',
            ],
          },
          {
            heading: '2. Data processed while browsing this website',
            paragraphs: [
              'We do not use tracking cookies, advertising pixels, or third-party analytics scripts.',
              'We store only your UI language preference ("discoveryrmm-language" in browser localStorage) to remember your selection across visits.',
              'Static hosting on GitHub Pages and font delivery via Google Fonts may generate standard infrastructure access logs (such as IP address and User-Agent) governed by those providers.',
            ],
          },
          {
            heading: '3. Self-Hosted Deployments & Data Controller (LGPD Art. 5, VI)',
            paragraphs: [
              'Organizations deploying DiscoveryRMM_API, the Web Console, and the Discovery Agent on their own infrastructure act as the sole Data Controller for all operational and personal data processed.',
              'DiscoveryRMM maintainers receive zero telemetry, inventory, credentials, or remote session recordings from third-party deployments. Self-hosted deployments may process endpoint data (hostname, IP address, hardware/software inventory, logs, user sessions, remote support recordings, and optional AI prompts sent to configured providers such as OpenRouter, OpenAI, or Ollama).',
            ],
          },
          {
            heading: '4. Data Subject Rights & Contact (LGPD Art. 18)',
            paragraphs: [
              'Requests to access, correct, anonymize, or delete data processed inside a self-hosted deployment — including audit logs and remote session recordings — must be directed to that deployment’s administrator/Data Controller.',
              'Questions regarding this project website or source code may be submitted through the official GitHub repositories (@pedrostefanogv).',
            ],
          },
        ],
      },
      terms: {
        badge: 'License & Terms',
        title: 'Terms of Use',
        lead: 'By accessing this website or using the open-source components of the DiscoveryRMM ecosystem, you agree to the licensing, authorized use, and liability terms below.',
        sections: [
          {
            heading: '1. Open Source License (MIT)',
            paragraphs: [
              'DiscoveryRMM and this landing page are distributed under the MIT License. The software is provided "AS IS", without warranty of any kind, express or implied, including merchantability, fitness for a particular purpose, or non-infringement.',
            ],
          },
          {
            heading: '2. Authorized Use & Operational Responsibility',
            paragraphs: [
              'Remote management capabilities — including PowerShell/CMD script execution, remote screen control, RDP/WebRDP, file transfer, and LAN proxy (HTTP/TCP) — must only be used on endpoints, networks, and environments where you hold explicit authorization.',
              'Deployment operators are solely responsible for securing credentials, NATS keys, TLS certificates, remote consent policies, and compliance with applicable laws.',
            ],
          },
          {
            heading: '3. Pre-Stable Status & AI Features',
            paragraphs: [
              'The ecosystem is under active development. Validate updates in a staging environment (dev/beta branches) before rolling out to production.',
              'When enabling external AI providers (such as OpenRouter or OpenAI-compatible APIs), review the provider’s terms, data-retention rules, and billing limits before sending operational data.',
            ],
          },
          {
            heading: '4. Third-Party Links & Services',
            paragraphs: [
              'This website links to GitHub repositories, technical documentation, and external package catalogs (such as Chocolatey and Winget). We are not responsible for the availability or content of third-party services.',
            ],
          },
        ],
      },
    },
  },
} as const;

type Translation = (typeof translations)[Language];

type I18nContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  text: Translation;
  languageOptions: LanguageOption[];
  route: ActiveRoute;
  docSection: DocSectionId;
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

function syncDocumentMetadata(language: Language, route: ActiveRoute) {
  const meta = translations[language].meta;
  document.documentElement.lang = language;
  document.title =
    route === 'privacy'
      ? meta.privacyTitle
      : route === 'terms'
        ? meta.termsTitle
        : route === 'docs'
          ? meta.docsTitle
          : meta.title;

  const descriptionTag = document.querySelector('meta[name="description"]');
  if (descriptionTag) {
    descriptionTag.setAttribute('content', meta.description);
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const { route, docSection } = useHashLocation();

  useEffect(() => {
    syncDocumentMetadata(language, route);

    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Ignore persistence failures and keep the in-memory language.
    }
  }, [language, route]);

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        text: translations[language],
        languageOptions: LANGUAGE_OPTIONS,
        route,
        docSection,
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
