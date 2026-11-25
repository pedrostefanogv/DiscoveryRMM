import type { DocSection } from '../types';

/**
 * Parte 3 — Suporte e Usuário Final (pt-BR).
 * Capítulos 3.1 a 3.5.
 */
export const supportPtSections: DocSection[] = [
  {
    id: 'support-chat',
    part: 'support',
    navLabel: '3.1. Chat de suporte e atendimento',
    badge: 'Parte 3 · Capítulo 1 · Atendimento em tempo real',
    title: 'Chat de suporte: falar com o usuário e com o técnico em tempo real',
    lead: 'Há dois chats diferentes: o chat da MÁQUINA (sem chamado, para suporte rápido) e o chat do CHAMADO (vinculado ao atendimento). Os dois usam consentimento e ficam registrados.',
    blocks: [
      {
        type: 'table',
        caption: 'Os dois chats',
        headers: ['Chat', 'Rota', 'Quando usar'],
        rows: [
          ['Chat de suporte da máquina', '/agents/:id/support-chat', 'Suporte rápido sem abrir chamado; a conversa fica vinculada ao equipamento'],
          ['Chat do chamado', '/tickets/:id/chat', 'Atendimento formal; a conversa fica no chamado e serve de evidência'],
          ['Chat IA de 1º nível', 'Discovery Agent (aba do assistente)', 'O próprio colaborador resolve dúvidas simples antes de acionar a TI'],
        ],
      },
      {
        type: 'steps',
        title: 'Fluxo de um atendimento por chat',
        items: [
          {
            title: '1. O técnico envia o convite',
            description: 'Pelo detalhe do agente ou do chamado, o técnico inicia o convite. O colaborador recebe uma notificação nativa no Windows (mesmo com a janela fechada).',
          },
          {
            title: '2. O colaborador aceita ou recusa',
            description: 'O convite tem aceite explícito. Se for recusado, o técnico é informado com o motivo e o convite não insiste em loop.',
          },
          {
            title: '3. A conversa acontece',
            description: 'A janela de chat é dedicada: continua viva mesmo que você navegue para outra tela do Console. A presença mostra quem está online.',
          },
          {
            title: '4. O histórico é preservado',
            description: 'Ao final, a transcrição fica no equipamento ou no chamado, conforme o tipo de chat, e pode ser consultada depois.',
          },
          {
            title: '5. O ciclo pode ser reaberto',
            description: 'Conversas encerradas podem ser reabertas quando o assunto volta, sem perder o histórico anterior.',
          },
        ],
      },
      {
        type: 'table',
        caption: 'Estados de uma conversa e o que fazer',
        headers: ['Estado', 'Significado', 'Ação do técnico'],
        rows: [
          ['Convidando', 'Convite enviado, aguardando resposta', 'Aguardar; o usuário pode estar ausente da máquina'],
          ['Aberto', 'Usuário aceitou e a conversa está ativa', 'Conduzir o atendimento'],
          ['Encerrado', 'Conversa finalizada', 'Registrar o resultado no chamado'],
          ['Reaberto', 'Assunto retomado', 'Continuar do ponto em que parou'],
          ['Falha de convite', 'Erro de entrega ou recusa', 'Verificar conexão do agent e tentar novamente'],
        ],
      },
      {
        type: 'image',
        file: 'agent-support-chat.png',
        alt: 'Janela de chat de suporte do Discovery Agent conversando com o técnico',
        caption: 'O chat da máquina abre em janela própria no endpoint e continua vivo mesmo que o técnico navegue para outra tela do Console.',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Transparência por padrão',
        text: 'O usuário sempre sabe quando está sendo atendido: notificação de convite, aceite explícito e aviso durante o atendimento. O mesmo princípio vale para o acesso remoto, com banner fixo na tela.',
      },
    ],
  },
  {
    id: 'enduser-agent',
    part: 'support',
    navLabel: '3.2. Guia do usuário final (Agent)',
    badge: 'Parte 3 · Capítulo 2 · Colaborador',
    title: 'Guia do colaborador: o Discovery Agent na sua estação de trabalho',
    lead: 'Um guia simples para quem usa o computador no dia a dia — sem jargão de infraestrutura.',
    blocks: [
      {
        type: 'paragraphs',
        items: [
          'O Discovery Agent é o ícone que fica perto do relógio do Windows. Ele é o canal direto entre você e a equipe de TI: tirar dúvidas, abrir chamados, instalar softwares liberados e acompanhar um atendimento.',
          'Você continua dono do seu computador: nada é instalado sem política aprovada pela empresa, e qualquer acesso remoto precisa do seu conhecimento.',
        ],
      },
      {
        type: 'steps',
        title: 'O que você pode fazer',
        items: [
          {
            title: '1. Verificar se está tudo conectado',
            description: 'Clique no ícone da bandeja para ver o status. Se aparecer desconectado, o computador continua funcionando normalmente — o agent volta a sincronizar sozinho.',
          },
          {
            title: '2. Perguntar ao assistente (Chat IA)',
            description: 'Descreva o problema em linguagem comum. Se quiser, anexe uma captura de tela. O assistente consulta os manuais da sua empresa e sugere a solução.',
          },
          {
            title: '3. Abrir um chamado',
            description: 'Na aba Suporte, abra a solicitação. O chamado já vai com as informações da sua máquina, o que acelera muito o atendimento.',
          },
          {
            title: '4. Instalar um software aprovado',
            description: 'Na App Store, instale os aplicativos liberados pela TI com um clique, sem precisar de senha de administrador.',
          },
          {
            title: '5. Consultar a base de conhecimento',
            description: 'Os artigos liberados trazem o passo a passo das dúvidas mais comuns: VPN, impressora, e-mail, acesso a sistemas.',
          },
        ],
      },
      {
        type: 'image',
        file: 'agent-chat.png',
        alt: 'Chat de IA do Discovery Agent respondendo ao colaborador na estação de trabalho',
        caption: 'Chat IA de 1º nível: o colaborador descreve o problema e pode anexar uma captura de tela.',
      },
      {
        type: 'image',
        file: 'agent-tickets.png',
        alt: 'Aba de chamados do Discovery Agent com abertura e acompanhamento de solicitações',
        caption: 'Chamados abertos pelo Agent já chegam com as informações do equipamento vinculadas.',
      },
      {
        type: 'image',
        file: 'agent-store.png',
        alt: 'App Store self-service do Discovery Agent com aplicativos liberados pela TI',
        caption: 'Na App Store o colaborador instala o software aprovado com um clique, sem senha de administrador.',
      },
      {
        type: 'accordion',
        title: 'Perguntas frequentes do colaborador',
        items: [
          {
            summary: 'A TI consegue ver minha tela a qualquer momento?',
            paragraphs: [
              'Não. Quando a política exige consentimento, aparece uma solicitação na sua tela com contagem regressiva e você escolhe aceitar ou recusar.',
              'Durante uma sessão autorizada, um banner visível permanece na tela e ele não aparece em capturas de tela.',
            ],
          },
          {
            summary: 'Meu computador fica lento por causa do agent?',
            paragraphs: [
              'O agent foi projetado para consumir pouco: a coleta é incremental e a interface entra em modo econômico quando minimizada.',
              'Se notar lentidão, abra um chamado informando o horário — a TI consegue ver CPU, memória e disco do seu equipamento pelo Console.',
            ],
          },
          {
            summary: 'O que é o aviso de tarefa que apareceu?',
            paragraphs: [
              'É uma instalação, atualização ou remoção programada pela TI. Alguns avisos permitem adiar por um tempo; outros são silenciosos por política.',
              'Salve seu trabalho quando o aviso indicar que o computador pode reiniciar.',
            ],
          },
          {
            summary: 'Preciso fazer login em algum site?',
            paragraphs: [
              'Não. O acesso ao Console é da equipe de TI. Você usa apenas o aplicativo da bandeja no computador.',
            ],
          },
          {
            summary: 'Como peço ajuda se o agent não abre?',
            paragraphs: [
              'Use o canal normal de atendimento da empresa (telefone/e-mail) e informe o nome da máquina, que aparece na etiqueta do equipamento.',
              'A TI consegue reinstalar ou reparar o agent remotamente.',
            ],
          },
        ],
      },
      {
        type: 'image',
        file: 'agent-consent-prompts.png',
        alt: 'Solicitação de consentimento de acesso remoto exibida na tela do colaborador',
        caption: 'Quando a política exige consentimento, o usuário aceita ou recusa antes de qualquer captura de tela.',
      },
      {
        type: 'image',
        file: 'agent-remote-banner.png',
        alt: 'Banner flutuante indicando sessão de acesso remoto ativa, excluído da captura de tela',
        caption: 'Durante a sessão um banner visível permanece na tela e é excluído da captura.',
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Se você é da TI: Modo Debug',
        text: 'Feche o agent pelo ícone da bandeja e abra novamente segurando Shift. O Modo Debug mostra logs locais, identidade de hardware (TPM/SMBIOS) e todas as abas de diagnóstico, mesmo que ocultas por política.',
      },
    ],
  },
  {
    id: 'module-config',
    part: 'support',
    navLabel: '3.3. Configuração por módulo e herança',
    badge: 'Parte 3 · Capítulo 3 · Configuração',
    title: 'Configurar cada módulo e entender a herança de escopo',
    lead: 'Toda configuração segue a cadeia Global → Cliente → Site → Agente. A tela Efetiva mostra o valor aplicado e de onde ele veio; a Auditoria mostra quem mudou.',
    blocks: [
      {
        type: 'callout',
        tone: 'tip',
        title: 'Herança e Configuração Efetiva',
        text: 'Em Configurações → Efetiva (/settings/effective) você vê cada parâmetro com a origem (Server, Client, Site ou Locked). Campo em branco herda do nível superior — e um parâmetro travado no nível acima não pode ser sobrescrito abaixo.',
      },
      {
        type: 'accordion',
        title: 'Guia de configuração módulo a módulo',
        items: [
          {
            summary: '1. IAM, autenticação e MFA (FIDO2 / TOTP)',
            paragraphs: [
              'Defina papéis, permissões granulares por ResourceType/ActionType e escopo (Global, Cliente, Site ou Agente).',
              'A política de senha padrão exige 12+ caracteres, maiúscula, número e símbolo. FIDO2/WebAuthn ou TOTP é obrigatório para contas administrativas.',
            ],
            route: '/identity/authentication · /identity/roles · /identity/users',
          },
          {
            summary: '2. Deploy Tokens e implantação',
            paragraphs: [
              'Crie o token vinculando Cliente e Site (e departamento, se aplicável), com validade e limite de usos.',
              'Use o comando gerado no instalador NSIS, no script zero-touch ou no Intune.',
            ],
            route: '/deploy',
          },
          {
            summary: '3. Acesso remoto, consentimento e proxy LAN',
            paragraphs: [
              'Defina limites simultâneos por tipo de sessão (padrão 5), gravação e política de consentimento do usuário.',
              'O proxy LAN é fail-closed: allowlist vazia significa nenhuma requisição encaminhada. Configure destinos e portas permitidos.',
            ],
            route: '/settings/remote-access · /settings/remote-consent · /settings/proxy-policy · /settings/remote-webrtc',
          },
          {
            summary: '4. Sensores e motor de Auto-Ticket',
            paragraphs: [
              'Cada Cliente (ou o escopo Global) precisa de ao menos um Workflow State com IsFinal = true, senão o Auto-Ticket não fecha chamados resolvidos.',
              'Configure a política (kill switch e modo de IA Off/Suggest/AutoApply) e sempre rode o dry-run antes de ativar as regras.',
            ],
            route: '/sensors/manage · /tickets/auto-policy · /tickets/auto-rules',
          },
          {
            summary: '5. IA, base de conhecimento e MCP',
            paragraphs: [
              'Escolha o provedor (OpenRouter, endpoint compatível com OpenAI ou Ollama local) e acompanhe gastos por modelo.',
              'Habilite apenas as ferramentas MCP que a IA pode acionar no endpoint e ative os embeddings pgvector para busca semântica.',
            ],
            route: '/settings/ai-cost · /settings/mcp-tools',
          },
          {
            summary: '6. Patches, App Store, automação e campos personalizados',
            paragraphs: [
              'Defina janelas de manutenção (fuso IANA) e aprovação automática por severidade. Configure fontes Winget/Chocolatey e pacotes customizados.',
              'Campos personalizados marcados como segredo nunca são expostos em claro no Console nem no runtime dos scripts.',
            ],
            route: '/patches/policy · /software/store · /settings/custom-fields',
          },
          {
            summary: '7. Notificações, branding e manutenção do banco',
            paragraphs: [
              'Cadastre canais de e-mail (SMTP), webhooks e web push; personalize logo e cores no branding.',
              'Defina retenção de logs, séries de sensores e limpeza periódica.',
              'A política de atualização automática do Agent (canal, janela e rollout) fica em /settings/agent-updates; os parâmetros globais do servidor e do escopo ficam em /settings/server e /settings/scope.',
            ],
            route: '/settings/notifications · /settings/branding · /settings/database-maintenance · /settings/agent-updates · /settings/server · /settings/scope',
          },
          {
            summary: '8. Workflow, SLA e departamentos',
            paragraphs: [
              'Ajuste estados e transições, perfis por cliente, metas de SLA com calendários e departamentos de roteamento.',
              'Mudanças de workflow afetam diretamente o Auto-Ticket e os relatórios de atendimento.',
            ],
            route: '/settings/workflow · /settings/workflow-profiles · /tickets/sla · /tickets/departments',
          },
          {
            summary: '9. Governança: segundo plano, sanitização e tokens de API',
            paragraphs: [
              'O campo "Processamento em Segundo Plano" (no Servidor e como override por Cliente) controla os ciclos de métricas por atendente e de triagem de chamados por IA, com piso de 10 e cota por cliente.',
              'A sanitização de banco e de object storage fica em Manutenção do banco: rode primeiro a checagem, leia o relatório e só então aplique.',
              'Tokens de API são criados pela API (/api/v1/api-tokens) e ficam vinculados a um usuário: use-os em integrações, nunca a senha de um técnico.',
            ],
            route: '/settings/database-maintenance · /settings/ai-cost · API /api/v1/api-tokens',
          },
        ],
      },
      {
        type: 'table',
        caption: 'Onde conferir o resultado de uma mudança',
        headers: ['Objetivo', 'Tela'],
        rows: [
          ['Ver o valor efetivo e a origem', '/settings/effective'],
          ['Ver quem mudou o quê e quando', '/settings/audit'],
          ['Ver o que o agente recebeu', '/agents/:id (aba Políticas)'],
          ['Ver logs operacionais', '/logs'],
        ],
      },
    ],
  },
  {
    id: 'troubleshooting',
    part: 'support',
    navLabel: '3.4. Diagnóstico e problemas comuns',
    badge: 'Parte 3 · Capítulo 4 · Diagnóstico',
    title: 'Diagnóstico: o que olhar quando algo não funciona',
    lead: 'Um roteiro por sintoma, com o comando e a tela certa — sem tentativa e erro.',
    blocks: [
      {
        type: 'accordion',
        title: 'Sintomas e como resolver',
        items: [
          {
            summary: 'O agente não aparece online no Console',
            paragraphs: [
              'Confirme o serviço: Get-Service discovery-service deve estar Running, com StartType Automatic.',
              'Veja o log local em %ProgramData%\\Discovery e valide a conectividade com o servidor (curl https://seu-dominio/health).',
              'Se o endpoint foi registrado com token de Site errado, gere um novo Deploy Token e reinstale.',
            ],
            code: 'Get-Service discovery-service | Select-Object Name,Status,StartType\nGet-Content "$env:ProgramData\\Discovery\\install.log" -Tail 60',
          },
          {
            summary: 'O Console não atualiza em tempo real',
            paragraphs: [
              'Na maioria dos casos é o WebSocket do NATS (/nats) bloqueado no proxy reverso. Garanta Upgrade/Connection: upgrade e timeout longo.',
              'Verifique o indicador de conexão em tempo real no topo do Console e a saúde do NATS no servidor.',
            ],
            route: '/settings (Configurações do servidor)',
          },
          {
            summary: 'Sensor em estado Stale (sem dado recente)',
            paragraphs: [
              'Stale significa que o intervalo de coleta expirou sem nova leitura — normalmente o agente está offline ou o sensor foi desativado.',
              'Rode "Executar agora" e force um sync de sensores para confirmar. Um estado Crítico nunca é mascarado por Stale.',
            ],
            route: '/agents/:id?tab=sensores · /sensors',
          },
          {
            summary: 'Script de automação não executa ou falha',
            paragraphs: [
              'Abra a execução em Operações e leia o exit code, o stdout e o stderr registrados.',
              'Valide o script em um agente de teste; confirme shell, parâmetros e se o destino da saída existe (nota ou campo coletor de escopo Agente).',
            ],
            route: '/automation/operations · /automation/audit',
          },
          {
            summary: 'Campo personalizado coletor fica vazio',
            paragraphs: [
              'A gravação só acontece quando o script termina com sucesso. Se o exit code for diferente de zero, o valor não é sobrescrito de propósito.',
              'Confirme que a chave em MDZ_COLLECT é idêntica à chave do campo e que o campo tem agentWrite ligado no escopo Agente.',
            ],
            route: '/settings/custom-fields',
          },
          {
            summary: 'Sessão remota não abre ou é negada',
            paragraphs: [
              'Verifique se o seu papel tem o direito exigido (NoProxy=64 bloqueia proxy LAN; NoRdp=128 bloqueia WebRDP).',
              'Se a política exige consentimento, o usuário precisa aceitar a solicitação na tela do endpoint.',
            ],
            route: '/identity/roles · /settings/remote-consent',
          },
          {
            summary: 'Perdi o acesso administrativo / perdi o MFA',
            paragraphs: [
              'No host do servidor, rode --recover-admin: a senha é redefinida, o próximo login exige troca, as sessões são revogadas e os fatores MFA são limpos.',
              'Faça isso preferencialmente em janela de manutenção e registre o ocorrido.',
            ],
            code: 'dotnet run --project src/Discovery.Api -- --recover-admin\n# ou, sem gravar a senha no histórico:\necho "NovaSenhaForte@2026" | dotnet run --project src/Discovery.Api -- --recover-admin --password-stdin',
          },
          {
            summary: 'Erro de banco: extensão vector não encontrada',
            paragraphs: [
              'Instale o pacote pgvector no host do banco e rode CREATE EXTENSION IF NOT EXISTS vector; no database configurado.',
              'SQLite não é aceito em runtime — não tente contornar o provider.',
            ],
          },
          {
            summary: 'Alto uso de CPU ou memória no endpoint',
            paragraphs: [
              'Use o console de debug remoto para ver filas, transporte ativo e estado dos loops do agente.',
              'Verifique sensores com intervalo muito curto e scripts de automação recorrentes; ajuste para intervalos maiores em máquinas fracas.',
            ],
            route: '/agents/remote-debug-console',
          },
          {
            summary: 'O agente não conecta por causa do certificado TLS do servidor',
            paragraphs: [
              'Quando o certificado do servidor está expirado, com cadeia incompleta ou nome divergente, o agent falha na conexão TLS antes mesmo de falar com a API.',
              'O servidor sonda os certificados apresentados pelos endpoints de API e de NATS (Security:AgentConnection:TlsCertificateProbeUrl e NatsTlsCertificateProbeUrl) e guarda o certificado capturado, o que permite comparar o que o servidor espera com o que ele realmente apresenta — útil quando só os agentes reclamam e o navegador funciona.',
              'Corrija a cadeia no proxy reverso (certificado intermediário incluído), confirme o nome do host e revalide com a instalação de um endpoint piloto.',
            ],
          },
          {
            summary: 'Agente órfão após desinstalação manual',
            paragraphs: [
              'Remova o agente pelo próprio Console (ação de remoção) para que o vínculo, as políticas e o inventário sejam encerrados corretamente.',
              'Se a máquina foi formatada, o zero-touch com TPM 2.0 reassocia o endpoint ao registro existente em vez de duplicar.',
            ],
            route: '/agents/:id',
          },
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Modo Debug local',
        text: 'Feche o agent pela bandeja e abra segurando Shift: logs locais, identidade de hardware (TPM 2.0 EK e SMBIOS UUID) e abas de diagnóstico ficam disponíveis mesmo que a política do servidor as oculte.',
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Antes de abrir incidente, colete evidências',
        text: 'Anote horário, nome da máquina, tela do Console, exit code e trechos de log. Isso reduz o tempo de diagnóstico e evita idas e voltas com o cliente.',
      },
    ],
  },
  {
    id: 'guides',
    part: 'support',
    navLabel: '3.5. Guias ponta a ponta e FAQ',
    badge: 'Parte 3 · Capítulo 5 · Guias',
    title: 'Guias ponta a ponta, checklist do instalador mínimo e FAQ',
    lead: 'Três roteiros completos (instalador, operador e usuário final), o checklist do instalador mínimo e as perguntas que aparecem em toda implantação.',
    blocks: [
      {
        type: 'steps',
        title: 'Guia 1 — Para quem instala (SysAdmin / Infraestrutura)',
        items: [
          { title: '1. Suba o servidor Linux com o bootstrap', description: 'Execute no canal release e valide PostgreSQL + pgvector, NATS JetStream e Redis.' },
          { title: '2. Configure HTTPS e WSS no proxy reverso', description: 'Exponha API/Console em 443 e garanta o encaminhamento WebSocket para /nats.' },
          { title: '3. Faça o primeiro acesso e cadastre MFA', description: 'Entre com admin / Mudar@123, defina senha forte e registre FIDO2 ou TOTP.' },
          { title: '4. Estruture Clientes e Sites', description: 'Cadastre tenants, unidades, departamentos e confira a configuração efetiva.' },
          { title: '5. Gere Deploy Tokens e implante', description: 'Use o instalador mínimo (/S /MINIMAL /URL /KEY /AP=1) ou o zero-touch via unattend/GPO/Intune.' },
          { title: '6. Configure backup e recuperação', description: 'Agende pg_dump, defina retenção e teste --recover-admin em homologação.' },
        ],
      },
      {
        type: 'steps',
        title: 'Guia 2 — Para quem opera (Técnico / NOC / Service Desk)',
        items: [
          { title: '1. Organize a frota com labels', description: 'Crie regras de label para separar notebooks, servidores, financeiro e máquinas críticas.' },
          { title: '2. Ative sensores com bom senso', description: 'Comece por disco, CPU, memória, uptime e os serviços essenciais; ajuste limiares antes de ligar alertas.' },
          { title: '3. Ligue o Auto-Ticket em dry-run', description: 'Simule as regras, valide deduplicação e só então ative — começando por um cliente piloto.' },
          { title: '4. Padronize software e patches', description: 'Publique na App Store só o que foi aprovado e defina política de patch por severidade e janela.' },
          { title: '5. Atenda com contexto', description: 'Use Service Board, macros, chat ao vivo, terminal remoto e scripts da biblioteca sem sair do chamado.' },
          { title: '6. Publique resultados', description: 'Agende relatórios de saúde, conformidade de patches, inventário e SLA para o cliente.' },
        ],
      },
      {
        type: 'steps',
        title: 'Guia 3 — Para o usuário final e checklist do instalador mínimo',
        items: [
          { title: '1. Conheça o ícone da bandeja', description: 'É por ele que você fala com a TI, abre chamados, instala softwares liberados e acompanha atendimentos.' },
          { title: '2. Peça ajuda pelo canal certo', description: 'Dúvida simples vai para o Chat IA; problema que travou o trabalho vira chamado pelo Suporte.' },
          { title: '3. Aceite ou recuse o acesso remoto', description: 'Você decide; o banner na tela mostra quando um técnico está conectado.' },
          { title: '4. Checklist do instalador mínimo', description: 'Confirme: parâmetros /S /MINIMAL /URL /KEY /AP=1; serviço discovery-service em Running; endpoint aparecendo online em até 15 segundos; log de instalação sem erro.' },
          { title: '5. Checklist do zero-touch', description: 'Confirme: script em System scripts (.ps1), autounattend.xml na raiz da mídia, servidor alcançável durante o setup e uso de /URL= (nunca /PU= em HTTP).' },
        ],
      },
      {
        type: 'accordion',
        title: 'FAQ — perguntas que aparecem em toda implantação',
        items: [
          {
            summary: 'O agent precisa de internet?',
            paragraphs: [
              'Precisa alcançar o servidor do DiscoveryRMM (API + NATS). Não é necessário acesso livre à internet: basta rota para o seu servidor, que pode ser interno.',
            ],
          },
          {
            summary: 'Funciona sem o servidor?',
            paragraphs: [
              'Não. O servidor é o cérebro: ele decide limiares, políticas, chamados e relatórios. O agent continua coletando localmente e sincroniza quando a conexão volta.',
            ],
          },
          {
            summary: 'Posso usar SQLite no servidor?',
            paragraphs: [
              'Não. O servidor exige PostgreSQL 15+ com pgvector. O SQLite existe apenas localmente no endpoint, como cache do agent.',
            ],
          },
          {
            summary: 'Qual a diferença entre label automática e campo personalizado?',
            paragraphs: [
              'Label é uma etiqueta calculada por regra, usada para segmentar e como escopo de automação. Campo personalizado é um valor guardado (texto, número, data), que pode ser preenchido pelo suporte ou coletado por script.',
            ],
          },
          {
            summary: 'O que é o instalador mínimo?',
            paragraphs: [
              'É a instalação sem wizard e sem interface: /S (silencioso) + /MINIMAL (pula o wizard) com /URL e /KEY informados. Em escala, pode ser compilado já com os valores padrão embutidos.',
            ],
          },
          {
            summary: 'Como funciona o zero-touch?',
            paragraphs: [
              'O instalador roda como SYSTEM ao final do setup do Windows (System scripts/SetupComplete.cmd), sem logon, e o endpoint já nasce registrado no Cliente/Site do Deploy Token.',
            ],
          },
          {
            summary: 'O servidor se atualiza sozinho?',
            paragraphs: [
              'Não. Atualização de servidor é sempre manual e planejada (--mode update). Apenas o agent Windows possui auto-update validado por hash e assinatura.',
            ],
          },
          {
            summary: 'Preciso de licença de terceiros para monitorar?',
            paragraphs: [
              'Não é preciso contratar um agente de terceiros: a coleta é nativa (WMI/CIM, WUA, DXGI, ConPTY) e o osquery é opcional, usado apenas quando já existe no ambiente. Ferramentas de acesso remoto como AnyDesk ou TeamViewer são opcionais e podem ser apenas auditadas por script.',
            ],
          },
        ],
      },
      {
        type: 'table',
        caption: 'Glossário rápido',
        headers: ['Termo', 'Significado'],
        rows: [
          ['Agent', 'Serviço + aplicativo instalado no endpoint Windows'],
          ['Client (Cliente)', 'Tenant: o limite de isolamento dos dados'],
          ['Site', 'Unidade física ou lógica dentro de um Cliente'],
          ['Deploy Token', 'Chave que vincula o endpoint ao Cliente/Site no registro'],
          ['Zero-Touch', 'Provisionamento sem interação humana, ao fim do setup do Windows'],
          ['Instalador mínimo', 'Instalação silenciosa sem wizard (/S /MINIMAL)'],
          ['Sensor', 'Coleta periódica com estado, limiares e histórico'],
          ['Sensor de script', 'Sensor cujo valor vem de um script PowerShell/Batch'],
          ['Custom Field', 'Campo personalizado: metadado por Cliente, Site ou Agente'],
          ['Label automática', 'Etiqueta aplicada por regra sobre o inventário'],
          ['Tarefa coletora', 'Execução de script que grava o resultado em campo personalizado'],
          ['Auto-Ticket', 'Abertura automática de chamado a partir de sensor/evento'],
          ['Auth Callout', 'Validação Ed25519 que emite JWT NATS por tenant'],
          ['JetStream', 'Persistência e fan-out de mensagens do NATS'],
          ['App Store', 'Catálogo self-service de software aprovado pela TI'],
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Volte ao começo quando precisar',
        text: 'Se você está implantando do zero, siga a Parte 1 na ordem. Se já tem o parque rodando, use a Parte 2 como referência de operação e a Parte 3 para configurar, atender e resolver problemas.',
      },
    ],
  },
];
