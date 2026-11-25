import type { DocSection } from '../types';

/**
 * Parte 1 — Instalação e Implantação (pt-BR).
 * Capítulos 1.1 a 1.12: arquitetura, requisitos, servidor, console, cadastro de
 * clientes/sites, campos personalizados, deploy, agent, zero-touch e instalador mínimo.
 */
export const installPtSections: DocSection[] = [
  {
    id: 'overview',
    part: 'install',
    navLabel: '1.1. Visão geral & arquitetura',
    badge: 'Parte 1 · Capítulo 1 · Arquitetura',
    title: 'Como o DiscoveryRMM funciona de ponta a ponta',
    lead: 'Entenda os quatro componentes do ecossistema, o transporte em tempo real e qual das três partes desta documentação seguir conforme o seu papel.',
    blocks: [
      {
        type: 'paragraphs',
        items: [
          'O DiscoveryRMM é composto por quatro camadas desacopladas: o Servidor Central (.NET 10 / ASP.NET Core), o Console Web (React 19 + TypeScript + Vite PWA), o Discovery Agent para Windows (Go + Wails v3) e a Infraestrutura de dados e mensageria (PostgreSQL 15+ com pgvector, NATS 2.x com JetStream, Redis e object storage local/MinIO/S3).',
          'Esta documentação foi organizada em três partes para você ler só o que precisa: Instalação (quem sobe o servidor e cadastra a estrutura), Operação (quem opera o parque no dia a dia) e Suporte & Usuário Final (quem atende chamados e quem usa o Agent na estação de trabalho).',
        ],
      },
      {
        type: 'cards',
        title: 'Escolha seu ponto de partida',
        items: [
          {
            title: 'Parte 1 — Instalação & Implantação',
            badge: 'Infraestrutura',
            description: 'Requisitos, servidor Linux, Console Web, cadastro de Clientes e Sites, campos personalizados, deploy, instalador mínimo e zero-touch.',
            meta: 'Começar pela Parte 1 →',
            href: '#/docs/requirements',
          },
          {
            title: 'Parte 2 — Operação do Parque',
            badge: 'NOC / TI',
            description: 'Frota de agentes, labels automáticas, acesso remoto, scripts, automações, software, patches, sensores, relatórios, chamados e IA.',
            meta: 'Ir para a Parte 2 →',
            href: '#/docs/interface',
          },
          {
            title: 'Parte 3 — Suporte & Usuário Final',
            badge: 'Service Desk',
            description: 'Chat de suporte, guia do colaborador, configuração por módulo com herança, diagnóstico de problemas e guias ponta a ponta.',
            meta: 'Ir para a Parte 3 →',
            href: '#/docs/support-chat',
          },
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

Console Web (React PWA)  ──► HTTPS REST + SSE  ──► API
                         ──► wss://host/nats   ──► NATS (tempo real)

Subjects canônicos:
  tenant.{clientId}.site.{siteId}.agent.{agentId}.{command|heartbeat|result|...}
  tenant.{clientId}.site.{siteId}.agent.{agentId}.remote.session.{sessionId}.{frame|event|control}

Streams JetStream por tenant:
  DISCOVERY_FANOUT_COMMANDS_{clientId}   ·   DISCOVERY_SUPPORT_CHAT_{clientId}`,
      },
      {
        type: 'table',
        caption: 'Canais de release e política de ambientes',
        headers: ['Canal / Branch', 'Público-alvo', 'Comportamento', 'Recomendação'],
        rows: [
          ['release (Estável)', 'Produção', 'Somente código validado e testado', 'Padrão para servidores e agents em produção'],
          ['beta', 'Pré-produção', 'Novas funcionalidades em validação final', 'Validar em ambiente piloto antes do rollout'],
          ['lts', 'Long-Term Support', 'Foco em estabilidade e correções críticas', 'Ambientes com janela rígida de mudança'],
          ['dev', 'Homologação / Devs', 'Desenvolvimento ativo e integração contínua', 'Nunca usar diretamente em produção'],
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'A hierarquia é a espinha dorsal da plataforma',
        text: 'Quase tudo herda de Global → Cliente → Site → Agente: permissões, políticas de patch, sensores, automações, catálogo da App Store, janelas de manutenção e regras de SLA. Se você estruturar bem Clientes e Sites na Parte 1, toda a Parte 2 fica simples.',
      },
    ],
  },
  {
    id: 'requirements',
    part: 'install',
    navLabel: '1.2. Requisitos, portas e rede',
    badge: 'Parte 1 · Capítulo 2 · Pré-requisitos',
    title: 'Requisitos de sistema, dependências e matriz de portas',
    lead: 'Confirme requisitos mínimos de servidor Linux, endpoints Windows e portas de rede antes de iniciar a implantação.',
    blocks: [
      {
        type: 'table',
        caption: 'Requisitos do Servidor Central e da Infraestrutura',
        headers: ['Componente', 'Requisito / Versão', 'Observação'],
        rows: [
          ['Sistema Operacional', 'Ubuntu 22.04/24.04 ou Debian 12+ (x64/arm64)', 'Script bootstrap Linux com acesso root ou sudo'],
          ['Runtime API', '.NET 10 SDK / ASP.NET Core', 'Instalado automaticamente pelo script bootstrap'],
          ['Banco de Dados', 'PostgreSQL 15+ com extensão pgvector', 'Provider único obrigatório em produção; pgvector habilita busca semântica'],
          ['Mensageria', 'NATS Server 2.x com JetStream', 'TCP 4222 interno e WebSocket TLS (wss://host/nats) para Console/agents externos'],
          ['Cache', 'Redis 7+ (recomendado em produção)', 'Presença de agentes, cache RBAC e estado FIDO2/WebAuthn'],
          ['Object Storage', 'Disco local, MinIO ou S3-compatible', 'Anexos, pacotes customizados, gravações e relatórios'],
        ],
      },
      {
        type: 'table',
        caption: 'Requisitos do Endpoint Windows (Discovery Agent)',
        headers: ['Item', 'Especificação', 'Detalhes'],
        rows: [
          ['Sistema Operacional', 'Windows 10, Windows 11 ou Windows Server (x86/x64)', 'Instalação via NSIS (.exe) ou Zero-Touch (unattend/GPO/Intune)'],
          ['Runtime UI', 'Microsoft Edge WebView2 Runtime', 'Incluído no fluxo do instalador; usado apenas por discovery-agent.exe'],
          ['Identidade de Hardware', 'TPM 2.0 + SMBIOS UUID (recomendado)', 'Impressão digital do endpoint e recuperação pós-formatação'],
          ['Privilégios', 'Instalador exige Administrador; serviço roda como SYSTEM', 'A UI Companion roda na sessão interativa do usuário'],
          ['Firewall Windows', 'Regras automáticas para perfis domain/private', 'Necessário apenas se o compartilhamento P2P (mDNS/UDP) estiver ativo na LAN'],
        ],
      },
      {
        type: 'table',
        caption: 'Matriz de portas e endpoints de rede',
        headers: ['Serviço', 'Porta / URL padrão', 'Direção', 'Uso'],
        rows: [
          ['API Dev (Kestrel)', 'http://0.0.0.0:5288', 'Console/Agent → API', 'Porta padrão de desenvolvimento'],
          ['Console Web Dev', 'http://localhost:5173', 'Navegador → Vite', 'Proxy automático de /api para :5288'],
          ['Produção HTTPS', 'https://seu-dominio (443)', 'Externo → Reverse Proxy', 'Termina TLS para API, Console e wss://seu-dominio/nats'],
          ['NATS Server', '4222 (TCP) / wss://host/nats', 'Agent & Console → NATS', 'Mensageria em tempo real e sessões remotas'],
          ['PostgreSQL', '5432', 'API → Banco', 'Persistência relacional + embeddings pgvector'],
          ['Redis', '6379', 'API → Cache', 'Presença, RBAC e FIDO2'],
          ['Túnel RDP local', '127.0.0.1:{porta efêmera}', 'Loopback no Agent/Viewer', 'RDP travado exclusivamente em loopback sobre NATS'],
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Não use SQLite no servidor',
        text: 'O DiscoveryRMM recusa SQLite em runtime: PostgreSQL 15+ com a extensão pgvector é obrigatório. Instale o pacote pgvector no host do banco e habilite com CREATE EXTENSION IF NOT EXISTS vector; no database configurado.',
      },
    ],
  },
  {
    id: 'server-install',
    part: 'install',
    navLabel: '1.3. Instalação do servidor',
    badge: 'Parte 1 · Capítulo 3 · Setup do servidor',
    title: 'Como instalar o servidor (bootstrap Linux ou manual)',
    lead: 'Passo a passo completo para subir o DiscoveryRMM em produção via bootstrap Linux ou manualmente a partir do código-fonte.',
    blocks: [
      {
        type: 'steps',
        title: 'Método A — Instalação rápida em produção (Linux Bootstrap)',
        items: [
          {
            title: '1. Prepare o host Ubuntu/Debian',
            description: 'Acesse como root ou usuário com sudo e garanta conectividade HTTPS de saída para GitHub e repositórios do sistema.',
          },
          {
            title: '2. Execute o Bootstrap Wizard',
            description: 'O script clona o repositório, instala .NET 10, PostgreSQL + pgvector, NATS 2.x, Redis e configura os serviços systemd.',
            code: 'bash -c "$(curl -fsSL https://raw.githubusercontent.com/pedrostefanogv/DiscoveryRMM_API/release/scripts/linux/bootstrap_install_discovery.sh)"',
          },
          {
            title: '3. Escolha o canal de release',
            description: 'No assistente, selecione a opção 2 (release — estável). Para automação não-interativa, use a variável DISCOVERY_RELEASE_CHANNEL.',
            code: 'DISCOVERY_RELEASE_CHANNEL=release bash -c "$(curl -fsSL https://raw.githubusercontent.com/pedrostefanogv/DiscoveryRMM_API/release/scripts/linux/bootstrap_install_discovery.sh)"',
          },
          {
            title: '4. Valide o health check',
            description: 'Confirme que GET /health responde 200 OK e abra /scalar/v1 para inspecionar os endpoints REST.',
          },
        ],
      },
      {
        type: 'steps',
        title: 'Método B — Instalação manual a partir do código-fonte',
        items: [
          {
            title: '1. Clone e restaure a solução',
            description: 'Baixe o repositório oficial e restaure os pacotes da solução.',
            code: 'git clone https://github.com/pedrostefanogv/DiscoveryRMM_API.git\ncd DiscoveryRMM_API\ndotnet restore Discovery.slnx',
          },
          {
            title: '2. Configure appsettings.Development.json',
            description: 'Copie o arquivo de exemplo e preencha a connection string do PostgreSQL (com pgvector), a URL/NKeys do NATS e o Redis.',
            code: 'cp src/Discovery.Api/appsettings.Development.json.example src/Discovery.Api/appsettings.Development.json',
          },
          {
            title: '3. Execute as migrations',
            description: 'O FluentMigrator cria o schema, índices pgvector, workflow states, permissões e o usuário admin inicial.',
            code: 'dotnet run --project src/Discovery.Api -- --migrate',
          },
          {
            title: '4. Inicie API e Console Web',
            description: 'A API sobe em :5288; o Console Web roda em Vite na porta 5173 com proxy para /api.',
            code: 'dotnet run --project src/Discovery.Api\n# Em outro terminal (DiscoveryRMM_Site):\nnpm install && npm run dev',
          },
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Primeiro login obrigatório',
        text: 'Após as migrations, acesse o Console com login "admin" e senha padrão "Mudar@123". No primeiro acesso o sistema exige troca de senha (12+ caracteres, maiúscula, número e símbolo), atualização de perfil e cadastro de MFA (FIDO2/WebAuthn ou TOTP).',
      },
      {
        type: 'accordion',
        title: 'Solução de problemas comuns na instalação',
        items: [
          {
            summary: 'Erro ao iniciar a API: extensão vector / pgvector não encontrada',
            paragraphs: [
              'O servidor exige PostgreSQL 15+ com pgvector instalado no database alvo.',
              'Instale o pacote postgresql-<versao>-pgvector no host do banco e rode CREATE EXTENSION IF NOT EXISTS vector;',
            ],
          },
          {
            summary: 'Console Web ou Agent externo não conecta ao NATS via WSS',
            paragraphs: [
              'Garanta que o proxy reverso encaminha Upgrade e Connection: upgrade para /nats, com timeout longo de WebSocket.',
              'Verifique Nats:ServerPublicKey (trust list Ed25519) no appsettings.json para o Auth Callout validar as requisições.',
            ],
          },
          {
            summary: 'Migrations aplicadas no banco errado',
            paragraphs: [
              'Confirme a connection string antes de rodar --migrate: o provider é único e não há fallback silencioso.',
              'Em produção, sempre rode as migrations em homologação primeiro e tenha o pg_dump do dia.',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'server-maintenance',
    part: 'install',
    navLabel: '1.4. Atualização, backup e recuperação',
    badge: 'Parte 1 · Capítulo 4 · Manutenção',
    title: 'Atualizar, fazer backup e recuperar o servidor',
    lead: 'O servidor central nunca se atualiza sozinho. Veja o ciclo seguro de atualização, backup/restauração e recuperação de acesso administrativo.',
    blocks: [
      {
        type: 'callout',
        tone: 'warning',
        title: 'Atualização de servidor é sempre manual',
        text: 'Diferente do Agent Windows (que tem auto-update), o servidor central não se atualiza sozinho. Valide a versão em homologação e só então execute o instalador com --mode update em produção.',
      },
      {
        type: 'code',
        title: 'Atualização do servidor instalado via script',
        language: 'bash',
        snippet: `# 1. Backup antes de qualquer mudança
pg_dump -Fc discovery > /backup/discovery-$(date +%F-%H%M).dump

# 2. Atualizar (aplica migrations pendentes e reinicia os serviços)
./scripts/linux/install_discovery_server.sh --mode update

# 3. Validar
curl -fsS https://seu-dominio/health
systemctl status discovery-api discovery-nats --no-pager`,
      },
      {
        type: 'code',
        title: 'Recuperação de administrador (acesso perdido)',
        language: 'bash',
        snippet: `# Reseta a senha do admin, força troca no próximo login,
# revoga todas as sessões e limpa os fatores MFA registrados:
dotnet run --project src/Discovery.Api -- --recover-admin

# Modo seguro, sem gravar a senha no histórico do shell:
echo "NovaSenhaForte@2026" | dotnet run --project src/Discovery.Api -- --recover-admin --password-stdin`,
      },
      {
        type: 'table',
        caption: 'Rotina mínima de manutenção recomendada',
        headers: ['Item', 'Periodicidade', 'Como fazer'],
        rows: [
          ['Backup do PostgreSQL', 'Diário + antes de atualizar', 'pg_dump -Fc e cópia fora do host'],
          ['Backup do object storage', 'Diário', 'Anexos, pacotes customizados e gravações (disco/MinIO/S3)'],
          ['Retenção de logs e séries', 'Configuração única', 'Configurações → Manutenção do banco (/settings/database-maintenance)'],
          ['Teste de restauração', 'Trimestral', 'Restaurar o dump em um host de homologação e validar o /health'],
          ['Rotação de chaves/NKeys NATS', 'Anual ou sob incidente', 'Reprogramar Nats:ServerPublicKey e reiniciar API + NATS'],
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Retenção padrão de dados',
        text: 'As amostras brutas de sensores ficam 7 dias, os eventos 90 dias e os rollups horários/diários 400 dias. O estado corrente de cada sensor nunca é apagado. Ajuste em /settings/database-maintenance conforme sua política de auditoria.',
      },
    ],
  },
  {
    id: 'console-access',
    part: 'install',
    navLabel: '1.5. Console Web, HTTPS e primeiro acesso',
    badge: 'Parte 1 · Capítulo 5 · Acesso ao Console',
    title: 'Publicar o Console Web com HTTPS/WSS e liberar o primeiro acesso',
    lead: 'Configure o proxy reverso, valide o WebSocket do NATS e conclua o onboarding de identidade (senha, perfil, MFA e papéis).',
    blocks: [
      {
        type: 'steps',
        title: 'Sequência de publicação e primeiro acesso',
        items: [
          {
            title: '1. Publique o Console Web',
            description: 'Build de produção do DiscoveryRMM_Site e publicação dos arquivos estáticos pelo mesmo domínio da API (evita CORS e simplifica o WSS).',
            code: 'npm ci && npm run build   # gera dist/',
          },
          {
            title: '2. Termine TLS e encaminhe o WebSocket do NATS',
            description: 'No proxy reverso, exponha 443 para API/Console e encaminhe /nats com Upgrade de WebSocket. Sem isso o Console cai para SSE e as sessões remotas ficam indisponíveis.',
          },
          {
            title: '3. Faça o primeiro login e troque a senha',
            description: 'Entre com admin / Mudar@123. O sistema exige troca de senha (12+ caracteres), atualização de perfil e cadastro de MFA.',
            route: 'https://seu-dominio/auth/login',
          },
          {
            title: '4. Registre MFA e revise papéis',
            description: 'Cadastre FIDO2/WebAuthn ou TOTP e crie os usuários técnicos em /identity/access com papéis e escopo (Global, Cliente, Site).',
            route: 'Configurações → Identidade e Acesso (/identity/access)',
          },
        ],
      },
      {
        type: 'code',
        title: 'Exemplo de proxy reverso (Nginx) com HTTPS + WSS',
        language: 'nginx',
        snippet: `server {
  listen 443 ssl http2;
  server_name seu-dominio;

  ssl_certificate     /etc/letsencrypt/live/seu-dominio/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/seu-dominio/privkey.pem;

  # API + Console Web
  location / {
    proxy_pass http://127.0.0.1:5288;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $remote_addr;
  }

  # NATS por WebSocket (precisa de Upgrade e timeout longo)
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
        caption: 'O que o primeiro acesso exige',
        headers: ['Etapa', 'Regra', 'Onde'],
        rows: [
          ['Troca de senha', '12+ caracteres, maiúscula, número e símbolo', '/auth/first-access'],
          ['Perfil', 'Nome, e-mail e dados de contato do técnico', '/identity/authentication'],
          ['MFA', 'FIDO2/WebAuthn ou TOTP obrigatório para contas administrativas', '/auth/mfa/register'],
          ['Papéis e escopo', 'RBAC por ResourceType/ActionType e escopo Global/Cliente/Site', '/identity/roles'],
        ],
      },
      {
        type: 'image',
        file: 'console-login.png',
        alt: 'Tela de login do Console Web do DiscoveryRMM',
        caption: 'Primeiro acesso: o Console exige troca de senha, atualização de perfil e cadastro de MFA antes de liberar os módulos.',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Branding',
        text: 'Logo, cores e nome exibido no Console e no Agent são configurados em Configurações → Branding (/settings/branding). O branding do Cliente pode sobrepor o global na herança de configuração.',
      },
    ],
  },
  {
    id: 'client-setup',
    part: 'install',
    navLabel: '1.6. Cadastro de clientes',
    badge: 'Parte 1 · Capítulo 6 · Operação de parque',
    title: 'Como cadastrar um Cliente (tenant) no DiscoveryRMM',
    lead: 'O Cliente é o limite de isolamento do tenant: tudo que você cria depois (sites, agentes, sensores, automações, chamados) vive dentro de um Cliente.',
    blocks: [
      {
        type: 'steps',
        title: 'Passo a passo do cadastro de Cliente',
        items: [
          {
            title: '1. Abra Clientes e clique em Novo Cliente',
            description: 'Informe nome fantasia, razão social e um identificador interno (código/slug) usado em relatórios e integrações.',
            route: 'Console Web → Clientes (/clients)',
          },
          {
            title: '2. Preencha contatos e dados fiscais',
            description: 'Cadastre contato principal, telefone, e-mail e dados de contrato. Esses dados aparecem em relatórios e no cabeçalho de relatórios exportados.',
          },
          {
            title: '3. Defina as políticas padrão do Cliente',
            description: 'SLA padrão, janela de manutenção, limiares de sensores, política de patches e política de consentimento de acesso remoto. Campos em branco herdam do escopo Global.',
            route: 'Configurações → Cliente (/settings/client)',
          },
          {
            title: '4. Configure branding e acesso dos técnicos',
            description: 'Personalize logo/cores do tenant e vincule os técnicos que podem atuar neste Cliente com o escopo correto.',
            route: 'Configurações → Branding (/settings/branding) · Identidade (/identity/access)',
          },
          {
            title: '5. Confirme a configuração efetiva',
            description: 'Use a visão efetiva para ver de onde cada parâmetro veio (Global, Cliente, Site ou Locked) antes de implantar agentes.',
            route: 'Configurações → Efetiva (/settings/effective)',
          },
        ],
      },
      {
        type: 'table',
        caption: 'Campos e decisões do cadastro de Cliente',
        headers: ['Item', 'Para que serve', 'Dica prática'],
        rows: [
          ['Nome / Razão social', 'Identificação do tenant em todo o Console', 'Use exatamente o nome do contrato'],
          ['Identificador interno', 'Chave estável para integrações e relatórios', 'Alfanumérico, sem espaços (ex.: acme-sp)'],
          ['Contatos', 'Comunicação em incidentes e relatórios', 'Cadastre ao menos um contato técnico e um gestor'],
          ['SLA padrão', 'Metas de primeira resposta e resolução', 'Aplicado a todos os sites do cliente; pode ser sobrescrito'],
          ['Workflow de chamados', 'Estados e transições usados nos tickets', 'Garanta ao menos um estado final (IsFinal = true)'],
          ['Branding', 'Identidade visual nas telas do Cliente', 'Opcional; herda o global quando vazio'],
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Pré-requisito do Auto-Ticket',
        text: 'Cada Cliente (ou o escopo Global) precisa ter ao menos um Workflow State com IsFinal = true. Sem isso, o motor de Auto-Ticket consegue abrir chamados mas não consegue fechá-los quando o sensor normaliza.',
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Herdança em cascata',
        text: 'Global → Cliente → Site → Agente. Você configura o que é comum no Global, o que é específico do contrato no Cliente e o que é local no Site. A tela Efetiva mostra o valor final aplicado e a origem.',
      },
    ],
  },
  {
    id: 'site-setup',
    part: 'install',
    navLabel: '1.7. Sites, departamentos e hierarquia',
    badge: 'Parte 1 · Capítulo 7 · Estrutura',
    title: 'Cadastrar Sites, Departamentos e organizar a hierarquia',
    lead: 'Sites representam unidades físicas ou lógicas e definem cache P2P na LAN, janela de manutenção e escopo de políticas. Departamentos roteiam chamados e o Chat IA.',
    blocks: [
      {
        type: 'steps',
        title: 'Passo a passo do cadastro de Site',
        items: [
          {
            title: '1. Crie o Site dentro do Cliente',
            description: 'Em Sites → Novo Site (ou pelo detalhe do Cliente), informe nome da unidade, código interno e o Cliente proprietário.',
            route: 'Console Web → Sites (/sites) · Cliente → Sites (/clients/:id)',
          },
          {
            title: '2. Configure fuso horário e janela de manutenção',
            description: 'O fuso IANA do Site é usado por janelas de manutenção, SLA e agendamentos de relatórios. A janela evita reinícios e instalações em horário de expediente.',
          },
          {
            title: '3. Informe as sub-redes locais',
            description: 'As sub-redes permitem que os agents do mesmo Site se descubram via mDNS/UDP e compartilhem pacotes pela LAN (P2P), economizando banda WAN.',
          },
          {
            title: '4. Ajuste as políticas locais',
            description: 'Sobrescreva no Site apenas o que for diferente do Cliente: janela, sensores, patch policy, consentimento remoto e catálogo da loja.',
            route: 'Configurações → Site (/settings/site)',
          },
          {
            title: '5. Repita para cada unidade',
            description: 'Padronize o código interno (ex.: acme-sp-matriz, acme-rj-filial) para facilitar filtros, relatórios e regras de automação por escopo.',
          },
        ],
      },
      {
        type: 'table',
        caption: 'Quando criar um Site novo (e quando não criar)',
        headers: ['Cenário', 'Recomendação', 'Motivo'],
        rows: [
          ['Filial com link próprio e sub-rede própria', 'Criar Site', 'Habilita cache P2P local e janela de manutenção específica'],
          ['Home office / usuário remoto', 'Criar um Site "Home Office" único', 'Evita poluir a árvore e mantém políticas previsíveis'],
          ['Servidores em datacenter', 'Criar Site "Datacenter"', 'Permite janelas fora do horário comercial e patch policy agressiva'],
          ['Departamentos da mesma sede', 'Não criar Site; usar Departamentos', 'Departamento é roteamento de atendimento, não localidade física'],
        ],
      },
      {
        type: 'accordion',
        title: 'Departamentos: para que servem e como configurar',
        items: [
          {
            summary: 'Roteamento de chamados e visibilidade',
            paragraphs: [
              'Departamentos (ex.: Financeiro, TI, RH) roteiam chamados, definem filas padrão e restringem quem vê o quê.',
              'Um técnico com acesso a um departamento enxerga os chamados dele; o departamento também participa das regras de Auto-Ticket e do contexto do Chat IA.',
            ],
            route: '/tickets/departments',
          },
          {
            summary: 'Atribuição automática e campos personalizados por departamento',
            paragraphs: [
              'Você pode definir responsável padrão e usar campos personalizados de escopo específico para enriquecer o chamado (centro de custo, patrimônio, sistema afetado).',
              'Campos personalizados de Cliente/Site/Agente também podem ser usados como condição em Labels Automáticas (veja o capítulo 2.3).',
            ],
            route: '/tickets/departments/:departmentId',
          },
          {
            summary: 'Herança de escopo',
            paragraphs: [
              'A cadeia é Global → Cliente → Site. Departamentos não participam da herança de configuração de servidor: eles atuam no domínio de atendimento.',
            ],
            route: '/settings/effective',
          },
        ],
      },
      {
        type: 'code',
        title: 'Exemplo de códigos internos para padronizar a árvore',
        language: 'text',
        snippet: `acme            (Cliente)
├── acme-sp-matriz     (Site · America/Sao_Paulo · 10.10.0.0/16)
├── acme-sp-cd         (Site · America/Sao_Paulo · 10.20.0.0/16)
├── acme-rj-filial     (Site · America/Sao_Paulo · 10.30.0.0/16)
├── acme-home-office   (Site · America/Sao_Paulo · sem P2P)
└── acme-datacenter    (Site · America/Sao_Paulo · janela 01:00-05:00)`,
      },
    ],
  },
  {
    id: 'custom-fields',
    part: 'install',
    navLabel: '1.8. Campos personalizados',
    badge: 'Parte 1 · Capítulo 8 · Metadados',
    title: 'Campos personalizados: guardar e coletar dados do endpoint',
    lead: 'Campos personalizados são o jeito canônico de guardar metadados por Cliente, Site ou Agente — inclusive valores coletados automaticamente por scripts, como o ID do AnyDesk ou do TeamViewer.',
    blocks: [
      {
        type: 'paragraphs',
        items: [
          'Cada definição de campo tem um escopo (Agente, Cliente ou Site), um tipo de dado (Texto, Número inteiro, Decimal, Data, Data/hora, Booleano, Lista suspensa ou Lista) e um conjunto de capacidades que diz quem pode ler e escrever.',
          'As capacidades são o coração do modelo de segurança: agentRead permite que o script leia o valor na variável MDZ_CUSTOM_FIELDS; agentWrite permite que o script grave; webRead exibe o valor no Console; webEdit libera edição pelo suporte; runtimeAccessMode controla se o campo entra no runtime de qualquer script ou apenas em scripts vinculados.',
        ],
      },
      {
        type: 'table',
        caption: 'Capacidades de um campo personalizado',
        headers: ['Capacidade', 'Efeito', 'Quando usar'],
        rows: [
          ['agentRead', 'Script recebe o valor em MDZ_CUSTOM_FIELDS (JSON)', 'Scripts que precisam de contexto (ex.: usar o ID do AnyDesk)'],
          ['agentWrite', 'Script pode gravar via MDZ_COLLECT (só escopo Agente)', 'Coleta automática de inventário e identificadores'],
          ['webRead', 'Valor aparece nos cards de detalhe (Agente/Cliente/Site)', 'Visibilidade para o time de TI'],
          ['webEdit', 'Suporte edita o valor pelo Console', 'Dados operacionais: patrimônio, centro de custo'],
          ['runtimeAccessMode', 'Disabled · Public · RestrictedTaskScript', 'Restringe campos sensíveis a scripts vinculados'],
          ['isPinned', 'Destaca o campo no card "Informações" do agente', 'Valores consultados todos os dias'],
          ['defaultValueJson', 'Valor padrão quando a entidade não tem valor', 'Evita campo vazio em novos agentes'],
        ],
      },
      {
        type: 'steps',
        title: 'Como criar uma definição de campo',
        items: [
          {
            title: '1. Abra Campos personalizados',
            description: 'Clique em Novo campo, escolha o escopo (Agente, Cliente ou Site) e informe chave, rótulo e descrição. A chave é o identificador usado em scripts e tarefas.',
            route: 'Configurações → Campos personalizados (/settings/custom-fields)',
          },
          {
            title: '2. Escolha tipo, opções e valor padrão',
            description: 'Para listas, informe as opções. Defina também o valor padrão quando quiser que novos agentes já nasçam preenchidos.',
          },
          {
            title: '3. Aplique um preset de capacidades',
            description: 'Presets prontos: Só script, Coletor puro, Bidirecional do agente, Manual do suporte e Completo. Ajuste fino depois, se precisar.',
          },
          {
            title: '4. Marque como secreto (se aplicável)',
            description: 'Campos secretos nunca aparecem em claro no Console, nunca são copiados e são omitidos do JSON de MDZ_CUSTOM_FIELDS.',
          },
          {
            title: '5. Use em scripts, tarefas e labels',
            description: 'Depois de criado, o campo está disponível para interpolação [[campo:chave]], para tarefas coletoras, para relatórios e como condição em Labels Automáticas.',
            route: 'Automação → Scripts (/automation/scripts) · Labels (/automation/agent-labels)',
          },
        ],
      },
      {
        type: 'code',
        title: 'Contrato de leitura e escrita usado pelos scripts',
        language: 'powershell',
        snippet: `# LEITURA: o agente injeta o JSON dos campos liberados para runtime
$campos = $env:MDZ_CUSTOM_FIELDS | ConvertFrom-Json
if ($campos.patrimonio) {
  Write-Output "Patrimonio configurado: $($campos.patrimonio)"
}

# ESCRITA (agentWrite, somente escopo Agente): uma linha por valor coletado
# MDZ_COLLECT: {"name":"chave_do_campo","value":"valor"}

# INTERPOLAÇÃO no comando, nos argumentos e no conteúdo do script
# [[campo:anydesk_id]]  -> substituído pelo valor atual do campo`,
      },
      {
        type: 'code',
        title: 'Exemplo real: coletar AnyDesk ID e TeamViewer ID para campos personalizados',
        language: 'powershell',
        snippet: `# Tarefa de Automação -> Ação "Executar script" -> marcar "Tarefa coletora"
# Campos de destino: anydesk_id e teamviewer_id (escopo Agente, agentWrite ligado)
$ErrorActionPreference = 'SilentlyContinue'

# ---- AnyDesk: primeiro o executável, depois o arquivo system.conf ----
$anydeskId = $null
$candidatos = @(
  "$env:ProgramFiles\\AnyDesk\\AnyDesk.exe",
  "$env:ProgramW6432\\AnyDesk\\AnyDesk.exe",
  "C:\\Program Files (x86)\\AnyDesk\\AnyDesk.exe"
)
$exe = $candidatos | Where-Object { Test-Path $_ } | Select-Object -First 1
if ($exe) { $anydeskId = ((& $exe --get-id) -join '') }

if (-not $anydeskId) {
  $conf = Join-Path $env:ProgramData 'AnyDesk\\system.conf'
  if (Test-Path $conf) {
    $match = Select-String -Path $conf -Pattern '^ad\\.anynet\\.id=(.+)$' | Select-Object -First 1
    if ($match) { $anydeskId = $match.Matches.Groups[1].Value }
  }
}
$anydeskId = ($anydeskId -replace '\\s', '').Trim()

# ---- TeamViewer: ClientID no registro (32 e 64 bits) ----
$tv = (Get-ItemProperty 'HKLM:\\SOFTWARE\\WOW6432Node\\TeamViewer' -Name ClientID -ErrorAction SilentlyContinue).ClientID
if (-not $tv) {
  $tv = (Get-ItemProperty 'HKLM:\\SOFTWARE\\TeamViewer' -Name ClientID -ErrorAction SilentlyContinue).ClientID
}
$tv = ($tv -replace '\\s', '').Trim()

# ---- Saída estruturada para o operador ver no resultado da execução ----
[pscustomobject]@{
  anydesk_id    = if ($anydeskId) { $anydeskId } else { 'nao instalado' }
  teamviewer_id = if ($tv)        { $tv }        else { 'nao instalado' }
} | ConvertTo-Json -Compress

# ---- Coleta: grava nos campos personalizados do agente ----
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
        title: 'A tarefa coletora só grava quando a execução termina com sucesso',
        text: 'Se o script falhar, o campo não é sobrescrito — isso evita apagar um valor válido por causa de uma execução com erro. Para gravar sempre, trate os erros dentro do script e finalize com exit 0.',
      },
      {
        type: 'accordion',
        title: 'Onde os campos aparecem no Console',
        items: [
          {
            summary: 'Card "Informações" do agente — seção Extras',
            paragraphs: [
              'Mostra somente os campos destacados (isPinned), no formato "Rótulo: valor", com botão de copiar para valores textuais.',
              'Campos secretos aparecem mascarados e nunca são copiados.',
            ],
            route: '/agents/:id',
          },
          {
            summary: 'Aba "Extras" do agente',
            paragraphs: [
              'Visão completa de todos os campos visíveis no portal, com tipo, capacidades, auditoria da última alteração e edição conforme webEdit.',
            ],
            route: '/agents/:id?tab=campos-customizados',
          },
          {
            summary: 'Filtro e coluna na lista de agentes',
            paragraphs: [
              'A lista de agentes filtra por campo/valor e a busca textual também casa com o valor do campo — útil para achar rapidamente "qual máquina tem este AnyDesk ID".',
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
    badge: 'Parte 1 · Capítulo 9 · Implantação',
    title: 'Deploy Tokens: a chave que vincula o endpoint ao Cliente e ao Site',
    lead: 'O Deploy Token é o que garante multi-tenancy desde o primeiro segundo: ele define em qual Cliente/Site o agente nasce e por quanto tempo a chave é válida.',
    blocks: [
      {
        type: 'steps',
        title: 'Criando e usando um Deploy Token',
        items: [
          {
            title: '1. Gere o token',
            description: 'Em Deploy → Novo Token, escolha o Cliente e o Site de destino (e o departamento, se aplicável), a validade e o limite de usos.',
            route: 'Console Web → Deploy (/deploy)',
          },
          {
            title: '2. Copie o comando silencioso',
            description: 'A tela gera o comando pronto do instalador com o token embutido. Use-o no GPO, no Intune, no script de bootstrap ou no pendrive.',
          },
          {
            title: '3. Instale nos endpoints',
            description: 'Execute o instalador em modo silencioso. O agente se registra em POST /api/v1/agent-install/register e recebe o token definitivo mdz_...',
          },
          {
            title: '4. Acompanhe a entrada dos agentes',
            description: 'Os endpoints aparecem em Agentes conforme o primeiro heartbeat. Use labels e filtros por Site para confirmar que cada máquina caiu no lugar certo.',
            route: 'Console Web → Agentes (/agents)',
          },
          {
            title: '5. Revogue ou limite quando terminar',
            description: 'Tokens de rollout em massa podem ser desativados ao fim da campanha; para zero-touch contínuo, use um token de longa duração com usos ilimitados.',
          },
        ],
      },
      {
        type: 'table',
        caption: 'Parâmetros do Deploy Token',
        headers: ['Parâmetro', 'Obrigatório', 'Recomendação'],
        rows: [
          ['Cliente', 'Sim', 'Nunca compartilhe token entre clientes'],
          ['Site', 'Sim', 'Token por Site é a prática mais segura e organizada'],
          ['Departamento', 'Não', 'Use quando o parque for segmentado por área'],
          ['Validade', 'Sim', 'Curta para campanhas; longa para GPO/Intune'],
          ['Limite de usos', 'Não', 'Ilimitado em provisionamento contínuo (imagens, GPO)'],
        ],
      },
      {
        type: 'code',
        title: 'Comandos de implantação silenciosa',
        language: 'powershell',
        snippet: `# 1) Instalação silenciosa com URL e chave (o token é a KEY)
.\\discovery-amd64-installer.exe /S /URL="https://rmm.empresa.com" /KEY="tok_exemplo_123"

# 2) Forma curta, com diretório alternativo
.\\discovery-amd64-installer.exe /S /U="https://rmm.empresa.com" /K="tok_exemplo_123" /D="C:\\Discovery"

# 3) Modo genérico (provisionamento P2P, sem wizard)
.\\discovery-amd64-installer.exe /G /AP=1

# 4) Atualização preservando a configuração local
.\\discovery-amd64-installer.exe /U`,
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Token não é senha de usuário',
        text: 'O Deploy Token só serve para registrar o endpoint e vinculá-lo ao tenant correto. A identidade de runtime do agente é o token mdz_..., cifrado localmente com DPAPI e com ACL restrita a SYSTEM e Administrators.',
      },
    ],
  },
  {
    id: 'agent-install',
    part: 'install',
    navLabel: '1.10. Instalador mínimo e instalação do Agent',
    badge: 'Parte 1 · Capítulo 10 · Instalador',
    title: 'Instalador mínimo: instalar o Agent sem wizard e sem interação',
    lead: 'O instalador NSIS aceita parâmetros de linha de comando que reduzem a instalação ao mínimo: sem interface, sem wizard e com o servidor já pré-configurado.',
    blocks: [
      {
        type: 'paragraphs',
        items: [
          'O modo mínimo (/MINIMAL ou /M) pula o wizard quando a URL do servidor e a chave já foram informadas. Combinado com /S (silencioso), a instalação vira uma única linha de comando — ideal para scripts, GPO, Intune ou imagens de referência.',
          'Além da linha de comando, o instalador pode ser compilado com valores padrão embutidos, gerando um "instalador mínimo" já apontado para o seu servidor: nenhum parâmetro é necessário na ponta.',
        ],
      },
      {
        type: 'table',
        caption: 'Parâmetros do instalador NSIS',
        headers: ['Parâmetro', 'Forma curta', 'Efeito'],
        rows: [
          ['/S', '—', 'Instalação silenciosa, sem interface gráfica'],
          ['/UPDATE', '/U', 'Modo atualização: silencioso e preserva a configuração local'],
          ['/URL=<endereço>', '/U=<endereço>', 'URL do servidor API'],
          ['/KEY=<chave>', '/K=<chave>', 'Deploy Token que vincula o endpoint ao Cliente/Site'],
          ['/AUTO_PROVISIONING=<0|1>', '/AP=<0|1>', 'Habilita o zero-touch provisioning'],
          ['/MINIMAL', '/M', 'Modo mínimo: pula o wizard quando URL e KEY já foram informados'],
          ['/GENERIC', '/G', 'Modo genérico: provisioning P2P sem wizard'],
          ['/ALLOW_INSECURE_TLS=<1|true>', '/TLS=<valor>', 'Permite TLS inseguro (apenas em laboratório)'],
          ['/D=<diretório>', '—', 'Diretório de instalação (padrão C:\\Program Files\\Discovery)'],
          ['/?', '/H, /HELP', 'Exibe a ajuda com todos os parâmetros'],
        ],
      },
      {
        type: 'code',
        title: 'Instalador mínimo: linha de comando única',
        language: 'powershell',
        snippet: `# Instalação mínima: sem UI, sem wizard, apontando para o servidor
$installer = "$PSScriptRoot\\discovery-amd64-installer.exe"
Start-Process -FilePath $installer -Wait -ArgumentList @(
  '/S',                                  # silencioso
  '/MINIMAL',                            # pula o wizard
  '/URL=https://rmm.empresa.com',        # servidor
  '/KEY=tok_exemplo_123',                # Deploy Token
  '/AP=1'                                # zero-touch provisioning
)

# Conferência pós-instalação
Get-Service discovery-service | Select-Object Name, Status, StartType
Get-Content "$env:ProgramData\\Discovery\\install.log" -Tail 40`,
      },
      {
        type: 'code',
        title: 'Build de um instalador mínimo com servidor pré-configurado',
        language: 'powershell',
        snippet: `# Na compilação do instalador (repositório Discovery), embuta URL/KEY padrão
# e ligue o modo mínimo: o executável gerado instala sem nenhum parâmetro.
makensis ^
  -DARG_DEFAULT_URL=rmm.empresa.com ^
  -DARG_DEFAULT_KEY=tok_exemplo_123 ^
  -DARG_DEFAULT_DISCOVERY=1 ^
  -DARG_DEFAULT_MINIMAL=1 ^
  src\\build\\windows\\installer\\project.nsi`,
      },
      {
        type: 'steps',
        title: 'O que o instalador faz e como validar',
        items: [
          {
            title: '1. Instala os dois binários',
            description: 'discovery-service.exe (serviço SYSTEM, sem UI) e discovery-agent.exe (UI Companion na sessão do usuário).',
          },
          {
            title: '2. Garante o WebView2',
            description: 'O runtime Microsoft Edge WebView2 é instalado silenciosamente — necessário apenas para a interface Wails.',
          },
          {
            title: '3. Registra e inicia o serviço',
            description: 'O serviço é criado via sc create e iniciado. Ele faz o registro, conecta no NATS e começa o inventário.',
          },
          {
            title: '4. Valide em até 15 segundos',
            description: 'A inicialização passa por 4 fases (inventário, bootstrap DPAPI + NATS, automação, P2P/sync/self-update). Em até ~15s o endpoint deve aparecer online no Console.',
            route: 'Console Web → Agentes (/agents)',
          },
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Atenção ao parâmetro de payload',
        text: 'O parâmetro /PAYLOAD_URL= (ou /PU=) aceita apenas endereços https:// e aborta a instalação em qualquer outro esquema. Para laboratório com HTTP simples, use /URL= conforme os exemplos.',
      },
    ],
  },
  {
    id: 'zero-touch',
    part: 'install',
    navLabel: '1.11. Zero-Touch e pós-formatação',
    badge: 'Parte 1 · Capítulo 11 · Provisionamento',
    title: 'Zero-Touch: instalar o Agent sem ninguém tocar na máquina',
    lead: 'Provisione endpoints no fim da instalação do Windows (unattend), por GPO ou Intune — e recupere o vínculo automaticamente depois de uma formatação.',
    blocks: [
      {
        type: 'callout',
        tone: 'info',
        title: 'O conceito em uma frase',
        text: 'Zero-Touch significa que o endpoint nasce monitorado: o instalador roda como SYSTEM ao fim do setup do Windows, sem logon e sem operador, e o agente se registra sozinho no Cliente/Site definido pelo Deploy Token.',
      },
      {
        type: 'table',
        caption: 'Blocos de script do gerador de unattend: qual usar',
        headers: ['Bloco', 'Contexto', 'Quando roda', 'Serve para o Agent?'],
        rows: [
          ['System scripts', 'NT AUTHORITY\\SYSTEM', 'Antes de qualquer conta existir (vira SetupComplete.cmd)', 'Sim — recomendado'],
          ['DefaultUser scripts', 'Usuário final', 'Somente se houver logon interativo', 'Não — a máquina pode ficar parada na tela de logon'],
          ['First logon commands', 'Usuário final', 'Depois do primeiro logon (exige AutoLogon)', 'Somente como alternativa'],
        ],
      },
      {
        type: 'steps',
        title: 'Zero-Touch via autounattend.xml',
        items: [
          {
            title: '1. Gere o autounattend.xml',
            description: 'Preencha idioma, particionamento e conta de administrador no gerador de unattend.',
          },
          {
            title: '2. Cole o script em System scripts',
            description: 'Use o campo "1. Run" da seção System scripts e escolha o tipo .ps1. O gerador grava em %WINDIR%\\Setup\\Scripts e chama via powershell -ExecutionPolicy Bypass, bloqueando o fim do setup até terminar.',
            code: 'powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0zerotouch-install.ps1"',
          },
          {
            title: '3. Coloque o XML na raiz da mídia',
            description: 'O autounattend.xml precisa estar na raiz do pendrive/ISO para ser lido automaticamente pelo setup do Windows.',
          },
          {
            title: '4. Valide no primeiro boot',
            description: 'Confira o log em %ProgramData%\\Discovery\\zerotouch-install.log e o serviço discovery-service em execução — antes mesmo de qualquer login.',
            code: 'Get-Content "$env:ProgramData\\Discovery\\zerotouch-install.log" -Tail 30\nGet-Service | Where-Object Name -like "*iscovery*"',
          },
        ],
      },
      {
        type: 'code',
        title: 'zerotouch-install.ps1 — versão curta para colar no campo System scripts',
        language: 'powershell',
        snippet: `# Baixa e instala o Discovery Agent em modo zero-touch (SYSTEM, sem logon)
$ErrorActionPreference = 'Stop'
$url = 'https://rmm.empresa.com/files/discovery-agent-zerotouch.exe'
$tmp = Join-Path $env:TEMP 'discovery-agent-zerotouch.exe'
$log = Join-Path $env:ProgramData 'Discovery\\zerotouch-install.log'
New-Item -ItemType Directory -Force -Path (Split-Path $log) | Out-Null
function Log($m) { Add-Content $log "$(Get-Date -f 's') $m" }

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

Log "Baixando $url"
$ok = $false
for ($i = 1; $i -le 3 -and -not $ok; $i++) {
  try {
    (New-Object Net.WebClient).DownloadFile($url, $tmp)
    if ((Get-Item $tmp).Length -gt 0) { $ok = $true }
  } catch { Log "Tentativa $i falhou: $($_.Exception.Message)"; Start-Sleep 10 }
}
if (-not $ok) { Log 'Download falhou'; exit 1001 }

# /S silencioso | /AP=1 auto-provisionamento | /URL servidor da API | /M minimal
$args = '/S /AP=1 /M /URL="https://rmm.empresa.com" /KEY="tok_exemplo_123"'
Log "Instalando com: $args"
$p = Start-Process -FilePath $tmp -ArgumentList $args -Wait -PassThru -NoNewWindow
Log "Exit code: $($p.ExitCode)"

Get-Service | Where-Object Name -like '*iscovery*' |
  ForEach-Object { Log "Servico $($_.Name) = $($_.Status)" }

Remove-Item $tmp -Force -ErrorAction SilentlyContinue
exit 0`,
      },
      {
        type: 'code',
        title: 'Alternativas: SetupComplete.cmd manual, GPO e Intune',
        language: 'powershell',
        snippet: `# A) SetupComplete.cmd manual dentro da mídia
# \\sources\\$OEM$\\$$\\Setup\\Scripts\\SetupComplete.cmd
#   @echo off
#   powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0zerotouch-install.ps1"

# B) GPO — Script de inicialização de computador (Computer Configuration > Windows Settings > Scripts > Startup)
#    copie o instalador para \\dominio\netlogon\\discovery\\ e aponte o script para ele
Start-Process "$env:LOGONSERVER\netlogon\\discovery\\discovery-amd64-installer.exe" -Wait -ArgumentList @(
  '/S','/M','/URL=https://rmm.empresa.com','/KEY=tok_exemplo_123','/AP=1'
)

# C) Intune — app Win32
#    Install command:    discovery-amd64-installer.exe /S /M /URL=https://rmm.empresa.com /KEY=tok_exemplo_123 /AP=1
#    Uninstall command:  "C:\\Program Files\\Discovery\\uninstall.exe" /S
#    Detection rule:     chave HKLM\\SOFTWARE\\Discovery\\AgentVersion (existência da chave)`,
      },
      {
        type: 'table',
        caption: 'Flags do instalador usadas no zero-touch',
        headers: ['Flag', 'Forma longa', 'Efeito'],
        rows: [
          ['/S', '—', 'Silencioso (sem janela)'],
          ['/AP=1', '/AUTO_PROVISIONING=1', 'Habilita o auto-provisionamento (zero-touch)'],
          ['/URL=', '—', 'Endpoint da API — aceita http:// e https://'],
          ['/KEY=', '/K=', 'Deploy Token que define Cliente/Site'],
          ['/M', '/MINIMAL', 'Instalação mínima, sem wizard'],
          ['/G', '/GENERIC', 'Sem URL/KEY: provisiona pela malha P2P'],
        ],
      },
      {
        type: 'accordion',
        title: 'Checklist, http:// e recuperação pós-formatação',
        items: [
          {
            summary: 'Checklist de validação do zero-touch',
            paragraphs: [
              'autounattend.xml na raiz da mídia; script em System scripts marcado como .ps1; a máquina alcança o servidor durante o setup; a URL do instalador responde sem autenticação (o script roda como SYSTEM, sem credenciais de usuário); você usou /URL= e não /PU=.',
              'Se /files/ exigir login, libere esse caminho ou use um token na URL.',
            ],
          },
          {
            summary: 'Por que /PU= (PAYLOAD_URL) não funciona em HTTP',
            paragraphs: [
              'O instalador foi endurecido para recusar http:// em /PAYLOAD_URL= e aborta com aviso, porque baixar e executar código como admin por texto claro é vetor de ataque.',
              'Use /URL= (aceita http e https). Em rede local, prefira VLAN de gerência e migre para HTTPS; então valide o SHA-256 do payload com Get-FileHash antes de executar.',
            ],
          },
          {
            summary: 'Post-Format Recovery: a máquina volta a ser reconhecida sozinha',
            paragraphs: [
              'Em máquinas com TPM 2.0, o agente guarda a identidade de hardware (Endorsement Key + SMBIOS UUID). Depois de formatar o Windows, o novo agent se reassocia ao mesmo registro em vez de criar um endpoint duplicado.',
              'O resultado é que políticas, campos personalizados, labels e pacotes do endpoint voltam a valer automaticamente após o zero-touch.',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'agent',
    part: 'install',
    navLabel: '1.12. Como o Agent funciona',
    badge: 'Parte 1 · Capítulo 12 · Discovery Agent',
    title: 'Arquitetura dual-binary, ciclo de vida e recursos do Agent',
    lead: 'Dois binários com papéis distintos: um serviço SYSTEM que faz o trabalho pesado e uma UI leve na sessão do usuário que conversa com o colaborador.',
    blocks: [
      {
        type: 'cards',
        title: 'Separação dual-binary e IPC',
        items: [
          {
            title: 'discovery-service.exe (Sessão 0 · SYSTEM)',
            badge: 'Core headless',
            description: 'Serviço Windows sem Wails e sem WebView2. Gerencia NATS/JetStream, inventário, automação, sensores, P2P, self-update e o servidor de named pipes.',
          },
          {
            title: 'discovery-agent.exe (sessão do usuário · Wails v3)',
            badge: 'UI Companion',
            description: 'Aplicação de bandeja com Chat IA, suporte, loja self-service e diagnóstico. Conversa com o serviço por named pipes autenticados (leitura + admin) e entra em modo econômico quando minimizada.',
          },
        ],
      },
      {
        type: 'steps',
        title: 'Inicialização em 4 fases',
        items: [
          {
            title: 'Registro com Deploy Token e DPAPI',
            description: 'Na primeira execução o agent envia hostname, SO e MAC/TPM para POST /api/v1/agent-install/register. O token mdz_... recebido é cifrado com Windows DPAPI (dpapi:v1:) em arquivo com ACL restrita a SYSTEM e Administrators.',
          },
          {
            title: 'Fase 1 (~2s) — Inventário inicial e SQLite WAL',
            description: 'Abre o banco local SQLite em modo WAL e roda a coleta inicial de hardware/software para resposta imediata no Console.',
          },
          {
            title: 'Fase 2 (~1s) — Bootstrap DPAPI e conexão NATS/WSS',
            description: 'Busca GET /api/v1/agent-auth/me/configuration e conecta ao NATS via Auth Callout Ed25519, assinando os subjects do seu Cliente/Site/Agent.',
          },
          {
            title: 'Fases 3 e 4 (10s–12s) — Automação, P2P, sync e self-update',
            description: 'Inicia o cron de automação e o loop de sensores, a malha P2P (go-libp2p + mDNS/UDP), as verificações de saúde da API, a limpeza do outbox e o auto-update validado por SHA-256 e assinatura Authenticode.',
          },
        ],
      },
      {
        type: 'table',
        caption: 'Funcionalidades nativas do Discovery Agent',
        headers: ['Capacidade', 'Implementação técnica', 'Controles de segurança'],
        rows: [
          ['Inventário', 'WMI/CIM nativos + osquery Thrift + fallback PowerShell + WUA (COM)', 'Coleta incremental com hash/sync manifest'],
          ['Tela remota', 'DXGI Desktop Duplication (HDR e dirty rects) com fallback GDI', 'Banner fora da captura, consentimento configurável e gravação opcional'],
          ['Terminal remoto', 'ConPTY com dispatcher isolado', 'runAs=user é fail-closed: nunca degrada para SYSTEM'],
          ['Arquivos remotos', 'Protocolo binário DF com handle cache e chunks de 256 KB', 'Sem token na URL; acesso por sessão NATS'],
          ['Processos e registro', 'sysctrl e winregistry com guard fail-closed', 'SAM/SECURITY/LSA bloqueados; Run/RunOnce bloqueados para escrita'],
          ['Proxy LAN HTTP/WS', 'core/netproxy sobre NATS', 'Allowlist fail-closed, bloqueio SSRF e DNS único anti-TOCTOU'],
          ['Túnel RDP / WebRDP', 'session_tunnel multiplexado (64 streams) + preflight TermService', 'Porta efêmera travada em 127.0.0.1; respeita NoRdp=128'],
          ['Sensores', 'Coletores nativos + script (com extratores e exit map)', 'Roda como serviço; saída limitada e sem contexto de usuário'],
          ['Automação', 'PowerShell, CMD e pacotes customizados com janelas IANA', 'Campos via env MDZ_CUSTOM_FIELDS, sem interpolação na linha de comando'],
          ['Zero-Touch e recovery', 'Unattend/GPO/Intune + reassociação por TPM 2.0 EK e SMBIOS UUID', 'Após formatar, recupera vínculo, políticas e apps'],
          ['Transparência', 'Avisos interativos de chat/acesso remoto + banner flutuante', 'Consentimento com contagem regressiva; banner excluído da captura'],
          ['Rede P2P', 'go-libp2p + descoberta local mDNS/UDP por Site', 'Compartilha apenas artefatos verificados por SHA-256'],
          ['Energia e firmware', 'Comando genérico de energia (restart, shutdown, cancelar, lock) incluindo reinício em BIOS/UEFI, além de Wake-on-LAN', 'Verbos imediatos e agendados; o reinício em firmware exige boot UEFI'],
          ['Coleta sob demanda', 'Atualização imediata de portas em escuta, conexões, software, impressoras e hardware', 'Disparada pelo Console quando o ciclo de inventário não basta'],
          ['Descomissionamento', 'Comando que localiza o desinstalador NSIS e o executa elevado, com marcador persistente por 30 dias', 'Um pedido por processo; reentrega não duplica a ação'],
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Como abrir o Modo Debug local no Agent',
        text: 'Feche o agent pelo ícone da bandeja (botão direito → Sair) e abra-o novamente segurando Shift. O Modo Debug libera logs locais, identidade TPM 2.0 EK / SMBIOS UUID e todas as abas de diagnóstico, mesmo que ocultas por política do servidor.',
      },
    ],
  },
];
