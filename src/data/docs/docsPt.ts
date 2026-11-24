import type { DocsContent } from './types';

export const docsPt: DocsContent = {
  ui: {
    portalBadge: 'Documentação Oficial · Ecossistema DiscoveryRMM',
    portalTitle: 'Guias & Referência',
    backToHome: 'Voltar à página inicial',
    searchPlaceholder: 'Buscar capítulo ou tópico...',
    searchLabel: 'Filtrar capítulos da documentação',
    searchEmpty: 'Nenhum capítulo corresponde à busca.',
    mobileMenuSummary: 'Navegar pelos capítulos',
    copyLabel: 'Copiar código',
    copiedLabel: 'Copiado',
    copyErrorLabel: 'Falha ao copiar',
    previousLabel: 'Capítulo anterior',
    nextLabel: 'Próximo capítulo',
    repoLinksTitle: 'Repositórios & Referências',
    repoLinks: [
      { label: 'Servidor (DiscoveryRMM_API)', href: 'https://github.com/pedrostefanogv/DiscoveryRMM_API' },
      { label: 'Agent Windows (Releases)', href: 'https://github.com/pedrostefanogv/DiscoveryRMM_Agent/releases' },
      {
        label: 'Guia de Configuração (API)',
        href: 'https://github.com/pedrostefanogv/DiscoveryRMM_API/blob/release/docs/CONFIGURATION.md',
      },
    ],
  },
  sections: [
    {
      id: 'overview',
      navLabel: '1. Visão Geral & Arquitetura',
      badge: 'Capítulo 01 · Arquitetura',
      title: 'Como o DiscoveryRMM funciona de ponta a ponta',
      lead: 'Entenda os quatro componentes do ecossistema, o transporte canônico em tempo real (NATS 2.x + JetStream + REST/SSE) e por onde começar conforme seu papel.',
      blocks: [
        {
          type: 'cards',
          title: 'Escolha seu ponto de partida',
          items: [
            {
              title: 'Quem vai instalar (SysAdmin)',
              badge: 'Infraestrutura',
              description: 'Requisitos de servidor, script bootstrap Linux, banco PostgreSQL + pgvector, NATS, TLS/WSS e recuperação de admin.',
              meta: 'Ir para Instalação do Servidor →',
              href: '#/docs/server-install',
            },
            {
              title: 'Quem vai operar (Técnico / NOC)',
              badge: 'Operação',
              description: 'Cadastro de Clientes/Sites, Deploy Tokens, sensores, Auto-Tickets, scripts PowerShell, patches e acesso remoto.',
              meta: 'Ir para Guias Ponta a Ponta →',
              href: '#/docs/guides',
            },
            {
              title: 'Usuário final (Endpoint Windows)',
              badge: 'Colaborador',
              description: 'Uso da bandeja do sistema, Chat IA de 1º nível, abertura de chamados, App Store e consentimento de acesso remoto.',
              meta: 'Ir para Guia do Usuário →',
              href: '#/docs/guides',
            },
          ],
        },
        {
          type: 'paragraphs',
          items: [
            'O DiscoveryRMM é composto por quatro camadas desacopladas: o Servidor Central (.NET 10 / ASP.NET Core), o Console Web (React 19 + TypeScript 7 + Vite 8 PWA), o Discovery Agent para Windows (Go 1.26 + Wails v3) e a Infraestrutura de dados e mensageria (PostgreSQL 15+ com pgvector, NATS 2.x com JetStream, Redis e storage local/MinIO/S3).',
            'Toda a comunicação assíncrona e de sessões remotas utiliza NATS 2.x com JetStream sobre TLS/WSS (ou TCP interno), com fallback HTTPS REST e Server-Sent Events (SSE). A identidade do agente é validada criptograficamente via Auth Callout Ed25519 e derivada sempre do subject NATS autenticado — nunca do payload.',
          ],
        },
        {
          type: 'code',
          title: 'Topologia de comunicação e subjects canônicos',
          language: 'text',
          snippet: `Discovery Agent (Windows) ──► POST /api/v1/agent-install/register (Deploy Token)
                           ◄── { agentId, token: "mdz_...", clientId, siteId }
                           ──► GET  /api/v1/agent-auth/me/configuration
                           ◄── { natsServerHost, natsUseWssExternal, policies }
                           ──► NATS Auth Callout ($SYS.REQ.USER.AUTH · Ed25519)
                           ◄── JWT dinâmico com ACL isolada por tenant

Subjects canônicos:
  tenant.{clientId}.site.{siteId}.agent.{agentId}.{command|heartbeat|result|...}
  tenant.{clientId}.site.{siteId}.agent.{agentId}.remote.session.{sessionId}.{frame|event|control|proxy.*|tunnel.*}

Streams JetStream por tenant:
  DISCOVERY_FANOUT_COMMANDS_{clientId}   ·   DISCOVERY_SUPPORT_CHAT_{clientId}`,
        },
        {
          type: 'table',
          caption: 'Canais de release e política de ambientes',
          headers: ['Canal / Branch', 'Público-alvo', 'Comportamento', 'Recomendação'],
          rows: [
            ['release (Estável)', 'Produção', 'Recebe apenas código validado e testado', 'Padrão para servidores e agents em produção'],
            ['beta', 'Pré-produção', 'Novas funcionalidades em validação final', 'Validar em ambiente piloto antes do rollout'],
            ['lts', 'Long-Term Support', 'Foco em estabilidade e correções críticas', 'Ambientes com janela rígida de mudança'],
            ['dev', 'Homologação / Devs', 'Desenvolvimento ativo e integração contínua', 'Nunca usar diretamente em produção'],
          ],
        },
      ],
    },
    {
      id: 'requirements',
      navLabel: '2. Requisitos & Portas',
      badge: 'Capítulo 02 · Pré-requisitos',
      title: 'Requisitos de sistema, dependências e matriz de portas',
      lead: 'Verifique os requisitos mínimos de servidor Linux, endpoints Windows e portas de rede antes de iniciar a implantação.',
      blocks: [
        {
          type: 'table',
          caption: 'Requisitos do Servidor Central e Infraestrutura',
          headers: ['Componente', 'Requisito / Versão', 'Observação'],
          rows: [
            ['Sistema Operacional', 'Ubuntu 22.04/24.04 ou Debian 12+ (x64 / arm64)', 'Suporte ao script bootstrap Linux com acesso root ou sudo'],
            ['Runtime API', '.NET 10 SDK / ASP.NET Core', 'Instalado automaticamente pelo script bootstrap'],
            ['Banco de Dados', 'PostgreSQL 15+ com extensão pgvector', 'Provider único obrigatório em produção; pgvector habilita busca semântica (1536 dims)'],
            ['Mensageria', 'NATS Server 2.x com JetStream habilitado', 'TCP 4222 interno e WebSocket TLS (wss://host/nats) para Console Web / agents externos'],
            ['Cache', 'Redis 7+ (opcional em dev, recomendado em prod)', 'Presença de agentes, cache RBAC e estado FIDO2/WebAuthn'],
            ['Object Storage', 'Disco local, MinIO ou S3-compatible', 'Armazenamento de anexos, pacotes customizados, gravações e relatórios'],
          ],
        },
        {
          type: 'table',
          caption: 'Requisitos do Endpoint Windows (Discovery Agent)',
          headers: ['Item', 'Especificação', 'Detalhes'],
          rows: [
            ['Sistema Operacional', 'Windows 10, Windows 11 ou Windows Server (x86/x64)', 'Instalação via NSIS (.exe) ou Zero-Touch (unattend / GPO / Intune)'],
            ['Runtime UI', 'Microsoft Edge WebView2 Runtime', 'Incluído no fluxo do instalador NSIS; usado apenas por discovery-agent.exe'],
            ['Identidade de Hardware', 'TPM 2.0 + SMBIOS UUID (recomendado)', 'Usado na impressão digital e painel de diagnóstico do endpoint'],
            ['Privilégios', 'Instalador requer Administrador; serviço roda como SYSTEM', 'UI Companion roda na sessão interativa do usuário (LeastPrivilege)'],
            ['Firewall Windows', 'Regras automáticas para perfil domain,private', 'Necessário apenas se o compartilhamento P2P (mDNS/UDP) estiver ativo na LAN'],
          ],
        },
        {
          type: 'table',
          caption: 'Matriz de portas e endpoints de rede',
          headers: ['Serviço', 'Porta / URL padrão', 'Direção', 'Uso'],
          rows: [
            ['API Dev (Kestrel)', 'http://0.0.0.0:5288', 'Console / Agent → API', 'Porta padrão de desenvolvimento (launchSettings.json)'],
            ['Console Web Dev', 'http://localhost:5173', 'Navegador → Vite', 'Proxy automático de /api para :5288'],
            ['Produção HTTPS', 'https://seu-dominio (443)', 'Externo → Reverse Proxy', 'Termina TLS para API, Console Web e wss://seu-dominio/nats'],
            ['NATS Server', '4222 (TCP) /wss /nats', 'Agent & Console → NATS', 'Mensageria em tempo real e sessões remotas'],
            ['PostgreSQL', '5432', 'API → Banco', 'Persistência relacional + embeddings pgvector'],
            ['Redis', '6379', 'API → Cache', 'Presença, RBAC e FIDO2'],
            ['Túnel RDP local', '127.0.0.1:{porta efêmera}', 'Loopback no Agent / Viewer', 'RDP travado exclusivamente em loopback sobre NATS'],
          ],
        },
      ],
    },
    {
      id: 'server-install',
      navLabel: '3. Instalação do Servidor',
      badge: 'Capítulo 03 · Setup do Servidor',
      title: 'Como instalar, migrar, atualizar e recuperar o servidor',
      lead: 'Passo a passo completo para subir o DiscoveryRMM em produção via bootstrap Linux ou manualmente a partir do código-fonte.',
      blocks: [
        {
          type: 'callout',
          tone: 'warning',
          title: 'Atualizações de servidor são sempre manuais',
          text: 'Diferente do Agent Windows (que possui auto-update), o servidor central nunca se atualiza sozinho. Para atualizar em produção, execute o instalador com --mode update após validar a versão em homologação.',
        },
        {
          type: 'steps',
          title: 'Método A — Instalação rápida em produção (Linux Bootstrap)',
          items: [
            {
              title: '1. Prepare o servidor Ubuntu/Debian',
              description: 'Acesse o host como root ou usuário com sudo. Garanta conectividade HTTPS de saída para GitHub e pacotes do sistema.',
            },
            {
              title: '2. Execute o Bootstrap Wizard',
              description: 'O script clona o repositório DiscoveryRMM_API, instala .NET 10, PostgreSQL + pgvector, NATS 2.x, Redis e configura os serviços systemd.',
              code: 'bash -c "$(curl -fsSL https://raw.githubusercontent.com/pedrostefanogv/DiscoveryRMM_API/release/scripts/linux/bootstrap_install_discovery.sh)"',
            },
            {
              title: '3. Escolha o canal de release (ou passe via variável)',
              description: 'No assistente interativo, selecione a opção 2 (release — estável) para produção. Para automação não-interativa, defina DISCOVERY_RELEASE_CHANNEL.',
              code: 'DISCOVERY_RELEASE_CHANNEL=release bash -c "$(curl -fsSL https://raw.githubusercontent.com/pedrostefanogv/DiscoveryRMM_API/release/scripts/linux/bootstrap_install_discovery.sh)"',
            },
            {
              title: '4. Valide o health check e a documentação Scalar',
              description: 'Verifique se GET /health responde 200 OK e acesse /scalar/v1 para inspecionar os endpoints REST.',
            },
          ],
        },
        {
          type: 'steps',
          title: 'Método B — Instalação manual / desenvolvimento a partir do código-fonte',
          items: [
            {
              title: '1. Clone e restaure a solução .NET 10',
              description: 'Baixe o repositório oficial e restaure os pacotes da solução Discovery.slnx.',
              code: 'git clone https://github.com/pedrostefanogv/DiscoveryRMM_API.git\ncd DiscoveryRMM_API\ndotnet restore Discovery.slnx',
            },
            {
              title: '2. Configure appsettings.Development.json',
              description: 'Copie o arquivo de exemplo e preencha a connection string do PostgreSQL (com pgvector), URL/NKeys do NATS e Redis.',
              code: 'cp src/Discovery.Api/appsettings.Development.json.example src/Discovery.Api/appsettings.Development.json',
            },
            {
              title: '3. Execute as migrations do banco',
              description: 'O FluentMigrator cria todo o schema, índices pgvector, workflow states padrão e o usuário admin inicial.',
              code: 'dotnet run --project src/Discovery.Api -- --migrate',
            },
            {
              title: '4. Inicie a API e o Console Web',
              description: 'A API sobe na porta 5288 e o Console Web (DiscoveryRMM_Site) roda em Vite na porta 5173 com proxy para /api.',
              code: 'dotnet run --project src/Discovery.Api\n# Em outro terminal (DiscoveryRMM_Site):\nnpm install && npm run dev',
            },
          ],
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Primeiro login obrigatório',
          text: 'Após as migrations, acesse o Console Web com login "admin" e senha padrão "Mudar@123". No primeiro acesso o sistema exige obrigatoriamente: (1) troca de senha (mínimo 12 caracteres, maiúscula, número e símbolo), (2) atualização do perfil e (3) cadastro de MFA (FIDO2/WebAuthn ou TOTP).',
        },
        {
          type: 'code',
          title: 'Atualização manual e recuperação de administrador (Shell local)',
          language: 'bash',
          snippet: `# Atualizar servidor instalado via script:
./scripts/linux/install_discovery_server.sh --mode update

# Recuperar acesso admin (reseta senha, força troca, revoga sessões e limpa MFA):
dotnet run --project src/Discovery.Api -- --recover-admin

# Modo seguro sem gravar senha no histórico do shell:
echo "NovaSenhaForte@2026" | dotnet run --project src/Discovery.Api -- --recover-admin --password-stdin`,
        },
        {
          type: 'accordion',
          title: 'Solução de problemas comuns na instalação',
          items: [
            {
              summary: 'Erro ao iniciar API: extensão vector / pgvector não encontrada',
              paragraphs: [
                'O DiscoveryRMM recusa SQLite em runtime e exige PostgreSQL 15+ com a extensão pgvector instalada no banco alvo.',
                'Instale o pacote postgresql-<versao>-pgvector no host do banco e execute CREATE EXTENSION IF NOT EXISTS vector; no database configurado.',
              ],
            },
            {
              summary: 'Console Web ou Agent externo não conecta ao NATS via WSS',
              paragraphs: [
                'Garanta que o proxy reverso (Nginx/Caddy/Traefik) encaminha Upgrade e Connection: upgrade para o endpoint /nats com timeout longo de WebSocket.',
                'No appsettings.json, verifique Nats:ServerPublicKey (trust list Ed25519) para que o Auth Callout valide as requisições assinadas pelo NATS Server.',
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'agent',
      navLabel: '4. Como o Agent Funciona',
      badge: 'Capítulo 04 · Discovery Agent',
      title: 'Arquitetura Dual-Binary, ciclo de vida e funcionalidades do Agent',
      lead: 'Entenda como o serviço SYSTEM (discovery-service.exe) e a interface desktop Wails v3 (discovery-agent.exe) operam juntos nos endpoints Windows.',
      blocks: [
        {
          type: 'cards',
          title: 'Separação Dual-Binary e IPC',
          items: [
            {
              title: 'discovery-service.exe (Sessão 0 · SYSTEM)',
              badge: 'Core Headless',
              description: 'Serviço Windows sem Wails e sem WebView2. Gerencia NATS/JetStream, inventário, automação, P2P, self-update, workers de sessão remota e servidor Dual-Pipe IPC.',
            },
            {
              title: 'discovery-agent.exe (Sessão do Usuário · Wails v3)',
              badge: 'UI Companion',
              description: 'Aplicação desktop leve com ícone na bandeja (systray), Chat IA, suporte, loja self-service e diagnóstico. Comunica-se com o serviço via named pipes autenticados (leitura + admin) e entra em modo econômico quando minimizada.',
            },
          ],
        },
        {
          type: 'steps',
          title: 'Inicialização em 4 fases e segurança local',
          items: [
            {
              title: 'Registro com Deploy Token e proteção DPAPI',
              description: 'Na primeira execução, o agent envia hostname, SO e MAC/TPM para POST /api/v1/agent-install/register usando o Deploy Token. O token recebido (mdz_...) é cifrado com Windows DPAPI (dpapi:v1:) em arquivo com ACL restrita a SYSTEM e Administrators.',
            },
            {
              title: 'Fase 1 (2s) — Inventário inicial & SQLite WAL',
              description: 'Abre o banco local SQLite em modo WAL e executa a coleta inicial de hardware/software para resposta imediata.',
            },
            {
              title: 'Fase 2 (1s svc) — Bootstrap DPAPI & Conexão NATS/WSS',
              description: 'Busca GET /api/v1/agent-auth/me/configuration e conecta ao NATS via Auth Callout Ed25519, assinando os subjects do seu Client/Site/Agent.',
            },
            {
              title: 'Fases 3 e 4 (10s–12s) — Automação, P2P, Sync & Self-Update',
              description: 'Inicia cron de automação, malha P2P (go-libp2p + mDNS/UDP), verificações de saúde da API, limpeza de outbox e auto-atualização validada por SHA-256 e assinatura Authenticode.',
            },
          ],
        },
        {
          type: 'table',
          caption: 'Funcionalidades nativas do Discovery Agent',
          headers: ['Capacidade', 'Implementação técnica', 'Controles de segurança'],
          rows: [
            ['Inventário', 'Coletores nativos WMI/CIM + osquery Thrift + fallback PowerShell + WUA (COM)', 'Coleta incremental com hash/sync manifest para evitar tráfego redundante'],
            ['Tela Remota', 'DXGI Desktop Duplication (com tone-mapping HDR e dirty rects) + fallback GDI', 'Banner fora da captura, consentimento configurável e gravação opcional'],
            ['Terminal Remoto', 'ConPTY (pseudo-console Windows) com dispatcher isolado', 'Modo runAs=user é fail-closed: nunca degrada silenciosamente para SYSTEM'],
            ['Arquivos Remotos', 'Protocolo binário DF com handle cache e chunks de 256 KB', 'Sem token JWT na URL; controle de acesso por sessão NATS'],
            ['Processos & Registro', 'sysctrl e winregistry com guard fail-closed', 'SAM/SECURITY/LSA bloqueados até para leitura; Run/RunOnce bloqueados para escrita'],
            ['Proxy LAN HTTP/WS', 'core/netproxy sobre NATS', 'Allowlist fail-closed quando vazia, bloqueio SSRF e DNS único anti-TOCTOU'],
            ['Túnel RDP / WebRDP', 'session_tunnel multiplexado (64 streams, codec 6B) + preflight TermService', 'Porta efêmera travada em 127.0.0.1; respeita direito NoRdp=128'],
            ['Automação', 'PowerShell, CMD e PSADT com janelas de manutenção IANA', 'Campos customizados via env MDZ_CUSTOM_FIELDS (sem interpolação na linha de comando)'],
            ['Rede P2P', 'go-libp2p + descoberta local mDNS/UDP por Site', 'Compartilha apenas artefatos verificados por SHA-256 para economizar banda WAN'],
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'Como abrir o Modo Debug local no Agent',
          text: 'Feche o agent pelo ícone da bandeja (botão direito → Sair), depois abra-o novamente segurando a tecla Shift. O Modo Debug libera logs locais, identidade TPM 2.0 EK / SMBIOS UUID e todas as abas de diagnóstico mesmo se ocultadas pela política do servidor.',
        },
      ],
    },
    {
      id: 'interface',
      navLabel: '5. Interface Web & Agent',
      badge: 'Capítulo 05 · Interfaces',
      title: 'Funcionalidades da Interface (Console Web e Agent Desktop)',
      lead: 'Mapa completo das telas, rotas e recursos disponíveis para operadores no Console Web (PWA) e para colaboradores no aplicativo Windows.',
      blocks: [
        {
          type: 'table',
          caption: 'Módulos do Console Web (DiscoveryRMM_Site)',
          headers: ['Módulo', 'Rotas principais', 'O que você faz'],
          rows: [
            ['Dashboard & Frota', '/ · /clients · /sites', 'Visão executiva de saúde, clientes, sites, departamentos e inventário consolidado'],
            ['Agentes & Sessão Remota', '/agents · /agents/:id · /agents/remote-session', 'Detalhe do endpoint, sensores, aplicativos, registro, tela, terminal, arquivos, processos, proxy LAN e WebRDP'],
            ['Service Board & Chamados', '/service-board · /tickets · /tickets/sla · /tickets/csat', 'Quadro de atendimento, filas, SLA, macros, templates, chat em janela dedicada e pesquisa CSAT'],
            ['Auto-Tickets', '/tickets/auto-policy · /tickets/auto-rules', 'Política hierárquica por escopo, regras automáticas, simulação dry-run e métricas de deduplicação'],
            ['Sensores', '/sensors · /sensors/manage · /sensors/script', 'Monitoramento de frota, thresholds, definições e editor completo de sensores por script'],
            ['Patches & Updates', '/patches · /patches/approvals · /patches/compliance · /patches/policy', 'Inventário Windows Update, aprovações, conformidade e políticas de janelas'],
            ['Softwares & Loja', '/software · /software/inventory · /software/store', 'Inventário de apps, catálogo Winget/Chocolatey e editor de pacotes customizados'],
            ['Automação', '/automation/scripts · /automation/tasks · /automation/operations · /automation/audit', 'Biblioteca versionada de scripts, tarefas agendadas, etiquetas de agentes e auditoria'],
            ['IA, Conhecimento & MCP', '/knowledge · /settings/ai-cost · /settings/mcp-tools', 'Base de conhecimento com busca semântica pgvector, cockpit de custos por modelo e governança MCP'],
            ['Relatórios & Config', '/reports/* · /settings/* · /deploy', 'Relatórios XLSX/CSV/MD agendados, herança Server→Client→Site, IAM/MFA e Deploy Tokens'],
          ],
        },
        {
          type: 'cards',
          title: 'Interface do Discovery Agent (Wails v3 Desktop)',
          items: [
            {
              title: 'Chat IA de 1º Nível',
              badge: 'Assistente',
              description: 'Conversa direta no endpoint com ferramentas MCP autorizadas, controles explícitos de privacidade e anexo opcional de captura de tela.',
            },
            {
              title: 'Suporte & Chamados',
              badge: 'ITSM',
              description: 'Abertura rápida de solicitações vinculadas automaticamente ao equipamento e chat ao vivo com o técnico responsável.',
            },
            {
              title: 'App Store Self-Service',
              badge: 'Software',
              description: 'Catálogo de softwares pré-aprovados pela TI para instalação com um clique sem exigir senha de administrador do usuário.',
            },
            {
              title: 'Diagnóstico & Identidade TPM',
              badge: 'Debug',
              description: 'Status do serviço SYSTEM, transporte NATS/REST ativo, UUID SMBIOS, TPM 2.0 Endorsement Key e logs em tempo real.',
            },
          ],
        },
      ],
    },
    {
      id: 'modules',
      navLabel: '6. Configuração por Módulo',
      badge: 'Capítulo 06 · Configuração',
      title: 'Como configurar cada módulo e usar herança de escopo',
      lead: 'O DiscoveryRMM usa herança hierárquica Server → Client → Site (com visualização da configuração efetiva e proveniência). Veja como configurar cada área.',
      blocks: [
        {
          type: 'callout',
          tone: 'tip',
          title: 'Herança e Configuração Efetiva',
          text: 'Em Configurações → Efetiva (/settings/effective), você visualiza exatamente de onde veio cada parâmetro (Server, Client, Site ou Locked). Campos deixados em branco herdam automaticamente do nível superior.',
        },
        {
          type: 'accordion',
          title: 'Guia de configuração módulo a módulo',
          items: [
            {
              summary: '1. IAM, Autenticação e MFA (FIDO2 / TOTP)',
              paragraphs: [
                'Acesse Configurações → Autenticação e IAM para definir papéis (Roles), permissões granulares por ResourceType/ActionType e escopo (Global, Client, Site ou Agent).',
                'Habilite FIDO2/WebAuthn ou TOTP como obrigatório para contas administrativas. A política de senha padrão exige 12+ caracteres, maiúscula, número e caractere especial.',
              ],
              route: '/identity/authentication',
            },
            {
              summary: '2. Deploy Tokens & Implantação de Agents',
              paragraphs: [
                'Crie um Deploy Token em /deploy vinculando obrigatoriamente o Cliente e o Site de destino (e departamento, se aplicável).',
                'Defina validade e limite de usos. Use o comando gerado no instalador NSIS ou no script Zero-Touch para provisionar dezenas de máquinas sem interação.',
              ],
              route: '/deploy',
            },
            {
              summary: '3. Acesso Remoto, Consentimento e Proxy LAN',
              paragraphs: [
                'Em Configurações → Acesso Remoto, defina os limites simultâneos por tipo de sessão (padrão 5), gravação e política de consentimento do usuário final.',
                'Na aba Proxy LAN (/settings/proxy-policy), configure RemoteAccess:Proxy:DefaultAllowlist e AllowedPorts. Por segurança, o proxy é fail-closed: se a allowlist estiver vazia, nenhuma requisição LAN é encaminhada.',
              ],
              route: '/settings/remote-access',
            },
            {
              summary: '4. Sensores e Motor de Auto-Tickets',
              paragraphs: [
                'Pré-requisito bloqueante: garanta que cada Cliente (ou o escopo global) possua ao menos um Workflow State com IsFinal = true para que o AutoTicketResolutionService consiga fechar chamados resolvidos.',
                'Configure a Política em /tickets/auto-policy (kill switch por cliente/site, modo de IA Off/Suggest/AutoApply) e crie as Regras em /tickets/auto-rules. Sempre execute "Simular (dry-run)" antes de ativar.',
              ],
              route: '/tickets/auto-policy',
            },
            {
              summary: '5. Inteligência Artificial, Base de Conhecimento e MCP',
              paragraphs: [
                'Configure o provedor de IA (OpenRouter, API compatível com OpenAI ou Ollama local) e monitore gastos por modelo em /settings/ai-cost.',
                'Em /settings/mcp-tools, habilite apenas as ferramentas MCP que a IA pode acionar no endpoint e ative embeddings pgvector para busca semântica na Base de Conhecimento.',
              ],
              route: '/settings/mcp-tools',
            },
            {
              summary: '6. Patches, App Store, Automação e Campos Customizados',
              paragraphs: [
                'Defina janelas de manutenção (fuso IANA) e aprovações automáticas de patches em /patches/policy. Configure fontes Winget/Chocolatey e pacotes PSADT em /software/store.',
                'Campos customizados (/settings/custom-fields) marcados como segredo nunca são expostos na variável de ambiente MDZ_CUSTOM_FIELDS durante a execução de scripts.',
              ],
              route: '/patches/policy',
            },
            {
              summary: '7. Notificações, Branding e Manutenção do Banco',
              paragraphs: [
                'Cadastre canais de E-mail (SMTP), Webhooks e Web Push em /settings/notifications. Personalize logotipo e cores em /settings/branding.',
                'Configure retenção de logs, históricos de sensores e limpeza periódica em /settings/database-maintenance.',
              ],
              route: '/settings/notifications',
            },
          ],
        },
      ],
    },
    {
      id: 'integrations',
      navLabel: '7. Integração entre Módulos',
      badge: 'Capítulo 07 · Integrações Internas',
      title: 'Como os módulos internos se integram entre si',
      lead: 'O valor do DiscoveryRMM está na automação entre domínios: um alerta de sensor vira chamado, aciona a IA com a Base de Conhecimento, roda um script no agent e fecha o ticket automaticamente.',
      blocks: [
        {
          type: 'table',
          caption: 'Principais fluxos de integração interna do ecossistema',
          headers: ['Fluxo integrado', 'Módulos participantes', 'Como acontece na prática'],
          rows: [
            [
              'Alerta → Auto-Ticket → IA → Resolução',
              'Sensores + Auto-Tickets + Workflow + IA/KB + Notificações',
              'Um sensor falha além da duração mínima → regra valida deduplicação → abre ticket no Workflow do cliente → IA consulta KB (pgvector) e sugere/aplica resposta → quando o sensor normaliza, o ticket fecha no estado IsFinal.',
            ],
            [
              'Multi-tenancy → Deploy → NATS ACL',
              'Clientes/Sites + Deploy Tokens + Auth Callout + JetStream',
              'O Deploy Token vincula o agent ao Client/Site → o Auth Callout Ed25519 emite JWT NATS restrito aos subjects e streams do respectivo tenant.',
            ],
            [
              'IAM → Sessão Remota → Guardas do Agent',
              'IAM/RBAC + RemoteSessions + Consentimento + Agent Core',
              'Direitos como NoProxy=64 e NoRdp=128 viram ACL NATS na sessão e ticket efêmero de 60s; o agent aplica consentimento, allowlist SSRF e guard fail-closed de Registro/Terminal.',
            ],
            [
              'App Store / Automação → Malha P2P',
              'Software Store + Automação + P2P Bootstrap + libp2p',
              'Ao distribuir um pacote grande para um Site, os agents trocam o manifesto via /p2p/bootstrap e replicam chunks na LAN validados por SHA-256.',
            ],
            [
              'Herança de Config → Runtime do Agent',
              'Server/Client/Site Config + Effective + Agent /me/configuration',
              'Alterações no Console recalculam a política efetiva; o agent sincroniza via /me/configuration e ativa/oculta módulos da UI sem reiniciar o serviço.',
            ],
          ],
        },
      ],
    },
    {
      id: 'guides',
      navLabel: '8. Guias Ponta a Ponta (Uso)',
      badge: 'Capítulo 08 · Manuais de Uso',
      title: 'Guias práticos: Instalador, Operador e Usuário Final',
      lead: 'Roteiros passo a passo para quem implanta a plataforma, quem opera a TI no dia a dia e quem utiliza o Discovery Agent na estação de trabalho.',
      blocks: [
        {
          type: 'steps',
          title: 'Guia 1 — Para quem instala (SysAdmin / Infraestrutura)',
          items: [
            {
              title: '1. Suba o servidor Linux com o Bootstrap',
              description: 'Execute o script de instalação no canal release, valide PostgreSQL + pgvector, NATS JetStream e Redis.',
            },
            {
              title: '2. Configure HTTPS e WSS no Proxy Reverso',
              description: 'Exponha o Console Web/API em HTTPS (443) e garanta o encaminhamento WebSocket para /nats (wss://).',
            },
            {
              title: '3. Faça o primeiro acesso e cadastre MFA',
              description: 'Entre com admin / Mudar@123, defina uma senha forte (12+ chars) e registre sua chave FIDO2 ou aplicativo TOTP.',
            },
            {
              title: '4. Configure backups, storage e recuperação',
              description: 'Agende backup do PostgreSQL, defina retenção em /settings/database-maintenance e teste o comando --recover-admin em homologação.',
            },
          ],
        },
        {
          type: 'steps',
          title: 'Guia 2 — Para quem opera (Técnico de TI / NOC / Service Desk)',
          items: [
            {
              title: '1. Estruture Clientes, Sites e Departamentos',
              description: 'Cadastre seus clientes e filiais em /clients e defina departamentos e estados de Workflow (incluindo ao menos um estado final IsFinal = true).',
            },
            {
              title: '2. Gere Deploy Tokens e instale os Agents Windows',
              description: 'Em /deploy, gere tokens por Site e implante o instalador .exe nas máquinas. Acompanhe o heartbeat online em /agents.',
            },
            {
              title: '3. Ative Sensores, Patches e Auto-Tickets com segurança',
              description: 'Aplique sensores de disco/CPU/serviços, defina políticas de patches e simule regras de Auto-Ticket em dry-run antes de ligar em produção.',
            },
            {
              title: '4. Atenda incidentes no Service Board',
              description: 'Use as sugestões da IA, execute scripts corretivos pela biblioteca de Automação ou abra uma Sessão Remota (Tela, ConPTY, Arquivos, Registro, Proxy LAN ou WebRDP).',
            },
          ],
        },
        {
          type: 'steps',
          title: 'Guia 3 — Para o usuário final (Colaborador no Windows)',
          items: [
            {
              title: '1. Localize o Discovery Agent na bandeja do sistema',
              description: 'O ícone próximo ao relógio do Windows mostra o status da conexão e dá acesso rápido ao suporte da TI.',
            },
            {
              title: '2. Tire dúvidas primeiro no Chat IA',
              description: 'Descreva o problema no Chat IA. Você controla se deseja anexar uma captura de tela e acompanha quando o assistente usa alguma ferramenta de diagnóstico.',
            },
            {
              title: '3. Abra ou acompanhe chamados e instale softwares aprovados',
              description: 'Se precisar de atendimento humano, abra um chamado pela aba Suporte ou instale aplicativos liberados pela empresa na App Store sem precisar de senha de administrador.',
            },
            {
              title: '4. Aprove ou recuse sessões de Acesso Remoto',
              description: 'Quando a política exigir consentimento, uma solicitação aparecerá na tela antes que o técnico visualize ou controle seu computador. Um banner visível indica enquanto a sessão estiver ativa.',
            },
          ],
        },
      ],
    },
  ],
};
