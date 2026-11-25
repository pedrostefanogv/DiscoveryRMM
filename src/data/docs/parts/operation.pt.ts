import type { DocSection } from '../types';

/**
 * Parte 2 — Operação do Parque (pt-BR).
 * Capítulos 2.1 a 2.14.
 */
export const operationPtSections: DocSection[] = [
  {
    id: 'interface',
    part: 'operation',
    navLabel: '2.1. Interface e navegação',
    badge: 'Parte 2 · Capítulo 1 · Interfaces',
    title: 'Mapa da interface: onde cada coisa vive',
    lead: 'O Console Web concentra a operação e a administração; o Agent Desktop concentra a experiência do colaborador no endpoint.',
    blocks: [
      {
        type: 'paragraphs',
        items: [
          'O Console Web é uma SPA com carregamento lazy por rota, menu lateral fixo, busca global e notificações em tempo real. O acesso é controlado por permissões por rota: se o seu papel não permite o módulo, o link nem aparece.',
          'O Discovery Agent é a aplicação de bandeja instalada no Windows. Ela não é uma cópia do Console: ela existe para o colaborador falar com a TI (chat, chamados, loja, conhecimento) e para o técnico diagnosticar o endpoint localmente.',
        ],
      },
      {
        type: 'table',
        caption: 'Módulos do Console Web e rotas principais',
        headers: ['Módulo', 'Rotas', 'O que você faz'],
        rows: [
          ['Dashboard', '/', 'Visão executiva de saúde da frota, alertas e tendências'],
          ['Clientes e Sites', '/clients · /sites · /clients/:id · /clients/:id/sites/:siteId', 'Estrutura do parque por tenant e unidade'],
          ['Agentes', '/agents · /agents/:id', 'Frota, inventário, sensores, aplicativos, políticas e ações'],
          ['Sessões', '/agents/remote-session · /agents/remote-debug-console', 'Acesso remoto e console de diagnóstico'],
          ['Service Board', '/service-board', 'Painel operacional de fila, alertas e saúde dos clientes'],
          ['Chamados', '/tickets · /tickets/:id · /tickets/alerts · /tickets/sla · /tickets/csat', 'Atendimento, SLA, alertas e satisfação'],
          ['Chamados automáticos', '/tickets/auto-policy · /tickets/auto-rules', 'Política hierárquica e regras de abertura automática'],
          ['Templates e macros', '/tickets/templates · /tickets/macros', 'Padronização da abertura e da resposta'],
          ['Departamentos', '/tickets/departments', 'Roteamento e visibilidade do atendimento'],
          ['Sensores', '/sensors · /sensors/manage · /sensors/script', 'Frota monitorada, definições e editor de sensor por script'],
          ['Patches', '/patches · /patches/updates · /patches/inventory · /patches/pending · /patches/approvals · /patches/compliance · /patches/policy', 'Windows Update ponta a ponta'],
          ['Software e loja', '/software · /software/inventory · /software/store · /software/store/custom/new', 'Inventário, catálogo e pacotes próprios'],
          ['Automação', '/automation/scripts · /automation/tasks · /automation/operations · /automation/audit · /automation/agent-labels', 'Biblioteca de scripts, tarefas, execuções, auditoria e labels'],
          ['Conhecimento e IA', '/knowledge · /settings/ai-cost · /settings/mcp-tools', 'Base de conhecimento, custos de IA e ferramentas MCP'],
          ['Relatórios', '/reports/templates · /reports/run · /reports/schedules · /reports/executions', 'Modelos, execução, agendamento e histórico'],
          ['Deploy', '/deploy', 'Deploy Tokens e provisionamento'],
          ['Configurações', '/settings · /settings/effective · /settings/remote-access · /settings/custom-fields · /settings/notifications', 'Herança, acesso remoto, campos, notificações e manutenção'],
          ['Identidade', '/identity/authentication · /identity/access · /identity/users · /identity/groups · /identity/roles', 'Perfil, MFA, usuários, grupos e papéis'],
          ['Logs e auditoria', '/logs · /settings/audit', 'Logs operacionais e trilha de mudanças de configuração'],
        ],
      },
      {
        type: 'image',
        file: 'console-modules.png',
        alt: 'Menu de módulos do Console Web com clientes, sites, agentes, chamados, sensores, patches e relatórios',
        caption: 'O menu lateral é filtrado pelas suas permissões: se um módulo não aparece, o seu papel não tem acesso.',
      },
      {
        type: 'cards',
        title: 'Discovery Agent (Wails v3 Desktop)',
        items: [
          { title: 'Chat IA de 1º nível', badge: 'Assistente', description: 'Conversa no endpoint com ferramentas MCP autorizadas, controles de privacidade e anexo opcional de captura de tela.' },
          { title: 'Suporte e chamados', badge: 'ITSM', description: 'Abertura de solicitações vinculadas ao equipamento e chat ao vivo com o técnico responsável.' },
          { title: 'App Store self-service', badge: 'Software', description: 'Catálogo aprovado pela TI para instalar com um clique, sem senha de administrador.' },
          { title: 'Diagnóstico e identidade TPM', badge: 'Debug', description: 'Status do serviço, transporte ativo (NATS/REST), SMBIOS UUID, TPM 2.0 EK e logs em tempo real.' },
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Três partes, um só fluxo',
        text: 'A Parte 1 entrega o parque estruturado; a Parte 2 opera esse parque; a Parte 3 atende as pessoas. Se um módulo não aparece para você, verifique primeiro as permissões do seu papel em /identity/roles.',
      },
    ],
  },
  {
    id: 'agents-fleet',
    part: 'operation',
    navLabel: '2.2. Operação da frota',
    badge: 'Parte 2 · Capítulo 2 · Frota',
    title: 'Operar a frota de agentes no dia a dia',
    lead: 'Filtrar, agrupar, agir em massa e investigar um endpoint específico com todo o contexto: inventário, sensores, aplicativos, políticas e logs.',
    blocks: [
      {
        type: 'steps',
        title: 'Fluxo diário de operação da frota',
        items: [
          {
            title: '1. Abra a lista de agentes e filtre',
            description: 'Filtre por status (online/offline/manutenção), Cliente, Site, label automática ou valor de campo personalizado. A busca textual também casa com nome, IP e valor de campo.',
            route: 'Console Web → Agentes (/agents)',
          },
          {
            title: '2. Use as colunas para priorizar',
            description: 'Ordene por último check-in, uso de disco, versão do agent ou quantidade de alertas. Máquinas offline há muito tempo e disco cheio são as primeiras da fila.',
          },
          {
            title: '3. Execute ações rápidas em lote',
            description: 'Selecione vários agentes e dispare sincronização, execução de script, reinício ou desligamento. Ações destrutivas pedem confirmação e ficam registradas na auditoria.',
          },
          {
            title: '4. Abra o detalhe do endpoint',
            description: 'No detalhe você encontra Info/Extras, Inventário, Sensores, Aplicativos, Rede, Políticas e Logs, além do console de debug remoto e do chat com o usuário.',
            route: 'Console Web → Agentes → Detalhe (/agents/:id)',
          },
          {
            title: '5. Registre o que fez',
            description: 'Use notas do agente (ou o campo personalizado de histórico) para deixar rastro do atendimento, inclusive para o próximo técnico.',
          },
        ],
      },
      {
        type: 'table',
        caption: 'Abas do detalhe do agente',
        headers: ['Aba', 'Conteúdo', 'Uso típico'],
        rows: [
          ['Info / Extras', 'Hardware, SO, usuário, IP, últimos check-ins e campos personalizados', 'Identificar a máquina e consultar AnyDesk/TeamViewer ID'],
          ['Inventário', 'Hardware detalhado, discos, rede, impressoras e software instalado', 'Auditoria e planejamento de upgrade'],
          ['Sensores', 'Estado atual, sparklines, limiares, falhas e histórico', 'Diagnóstico proativo e validação de correção'],
          ['Aplicativos', 'Software instalado, pacotes do catálogo e da loja', 'Conferir versões e remover softwares não autorizados'],
          ['Rede', 'Interfaces, latência, DNS, proxy LAN e P2P', 'Investigar conectividade e banda'],
          ['Políticas', 'Configuração efetiva aplicada ao agente', 'Entender por que uma política está valendo'],
          ['Logs', 'Eventos do agente, execuções e erros', 'Investigar falhas pontuais'],
        ],
      },
      {
        type: 'table',
        caption: 'Ações de manutenção disponíveis',
        headers: ['Ação', 'Efeito', 'Cuidado'],
        rows: [
          ['Sincronizar agora', 'Força check-in e atualização de políticas e inventário', 'Sem risco'],
          ['Executar script', 'Roda um script da biblioteca no contexto escolhido', 'Valide o script em um agent de teste'],
          ['Reiniciar / desligar', 'Ação de energia no endpoint', 'Avisar o usuário e respeitar janela de manutenção'],
          ['Modo manutenção', 'Silencia alertas durante intervenção', 'Lembre de sair do modo ao terminar'],
          ['Remover agente', 'Desinstala o agent e encerra o vínculo', 'Irreversível para histórico local do endpoint'],
          ['Registrar em lote / Transferir', 'Move o endpoint para outro Cliente/Site (individual ou em lote, com validação do destino)', 'Valide antes: a transferência muda escopo de políticas, sensores e chamados'],
          ['Wake-on-LAN e energia avançada', 'Liga máquina desligada na LAN e executa verbos de energia, incluindo reiniciar em BIOS/UEFI', 'WOL exige a mesma rede; reinício em firmware exige boot UEFI'],
          ['Coleta sob demanda', 'Atualiza na hora portas em escuta, conexões, software, impressoras e hardware', 'Use pontualmente: consome banda e CPU do endpoint'],
          ['Enviar aviso ao usuário', 'Toast (fecha sozinho) ou Modal (exige interação) na tela do endpoint', 'Ideal para pedir que o usuário salve o trabalho'],
          ['Aprovar zero-touch', 'Libera um endpoint que se registrou em provisionamento automático e aguarda aprovação', 'Útil quando o rollout exige aval humano por máquina'],
          ['Lixeira / Restaurar / Remover definitivamente', 'Remoção em duas etapas, com reenvio da desinstalação remota', 'Detalhes e cuidados no capítulo 2.15'],
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Console de debug remoto',
        text: 'Em /agents/remote-debug-console você abre um terminal de diagnóstico no endpoint com verbos controlados (status do serviço, transporte ativo, filas, identidade de hardware) — sem abrir uma sessão remota completa.',
      },
    ],
  },
  {
    id: 'agent-labels',
    part: 'operation',
    navLabel: '2.3. Labels automáticas',
    badge: 'Parte 2 · Capítulo 3 · Segmentação',
    title: 'Labels automáticas: taguear a frota por regra, não na mão',
    lead: 'Labels são etiquetas aplicadas automaticamente a máquinas que satisfazem uma expressão. Elas viram filtro na frota e, principalmente, escopo de tarefas de automação e políticas.',
    blocks: [
      {
        type: 'paragraphs',
        items: [
          'Uma regra de label tem um NOME, uma LABEL (a etiqueta que será aplicada), um MODO de aplicação e uma EXPRESSÃO com condições combinadas por E/OU.',
          'A avaliação usa o inventário que o agent já envia (SO, hardware, software, discos e campos personalizados), então a label se mantém correta sozinha quando a máquina muda.',
        ],
      },
      {
        type: 'table',
        caption: 'Modos de aplicação de uma regra',
        headers: ['Modo', 'O que faz', 'Cuidado'],
        rows: [
          ['Aplicar apenas', 'Adiciona a label quando a condição é verdadeira; nunca remove', 'A label pode ficar presa se a máquina deixar de casar'],
          ['Aplicar e remover', 'Adiciona quando casa e remove quando deixa de casar (só labels automáticas)', 'Não toca em labels manuais'],
          ['Manual', 'A regra não age sozinha: a label fica disponível para aplicação manual no detalhe do agente', 'Útil para tags de processo (ex.: "Em auditoria")'],
          ['Remover labels manuais', 'Remove labels MANUAIS enquanto a condição for verdadeira, com alvo Exata, Prefixo ou Regex', 'Não remove labels protegidas'],
        ],
      },
      {
        type: 'table',
        caption: 'Campos disponíveis na expressão',
        headers: ['Grupo', 'Campos'],
        rows: [
          ['Identificação', 'Hostname, Display Name, IP Address, Sistema Operacional, Versão do SO, Status'],
          ['Software', 'Nome do Software, Fabricante, Versão, Quantidade de Softwares instalados'],
          ['Hardware', 'Processador, Núcleos, Threads, Memória Total, GPU, VRAM, Quantidade de Discos, MachineScore'],
          ['Discos (dentro de nó DiskGroup)', 'Letra da Unidade, % Livre, Espaço Livre, Capacidade Total, Sistema de Arquivos, Tipo de Mídia'],
          ['Metadados', 'Custom Field do Agente, Custom Field do Cliente, Custom Field do Site'],
        ],
      },
      {
        type: 'paragraphs',
        items: [
          'Operadores de texto: contém, não contém, começa com, termina com, igual, diferente e regex. Operadores numéricos: igual, diferente, maior, maior ou igual, menor, menor ou igual. O campo Status aceita apenas igual/diferente.',
          'Limites de segurança da expressão: profundidade máxima 8, no máximo 128 nós, 20 filhos por grupo e regex de até 256 caracteres. Labels protegidas não podem ser alvo de nenhuma regra de remoção.',
        ],
      },
      {
        type: 'steps',
        title: 'Como criar e validar uma regra',
        items: [
          {
            title: '1. Crie a regra',
            description: 'Em Automação → Labels de agentes, clique em Nova regra. Informe nome, label, descrição, modo de aplicação e monte a expressão no construtor visual.',
            route: 'Automação → Labels de agentes (/automation/agent-labels)',
          },
          {
            title: '2. Simule em um agente (dry-run)',
            description: 'Antes de ativar, rode a simulação em um endpoint real. O retorno mostra se casou, quais labels automáticas e manuais ele tem hoje, o que seria adicionado/removido e quais condições falharam.',
          },
          {
            title: '3. Meça o impacto na frota',
            description: 'Rode a análise de impacto em lote para estimar quantas máquinas casariam, com amostra de agentes. Isso evita aplicar uma label em 2.000 máquinas por engano.',
          },
          {
            title: '4. Ative e (se necessário) reprocesse',
            description: 'Ative a regra. Em frotas grandes, dispare o reprocessamento e acompanhe o progresso por percentual até concluir.',
          },
          {
            title: '5. Acompanhe o histórico',
            description: 'Cada aplicação/remoção fica registrada com origem (automática/manual), ação, regra responsável, ator e data — auditável por agente.',
          },
        ],
      },
      {
        type: 'code',
        title: 'Exemplos de expressão (exportável por regra)',
        language: 'json',
        snippet: `// 1) Notebooks corporativos: Windows 11 E com qualquer disco abaixo de 15% livre
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

// 2) Máquinas com AutoCAD instalado -> label "AutoCAD"
{
  "nodeType": "Group",
  "logicalOperator": "Or",
  "children": [
    { "nodeType": "Condition", "field": "SoftwareName", "operator": "Contains", "value": "AutoCAD" },
    { "nodeType": "Condition", "field": "SoftwarePublisher", "operator": "Contains", "value": "Autodesk" }
  ]
}

// 3) Departamento Financeiro por campo personalizado (exige customFieldDefinitionId)
{
  "nodeType": "Group",
  "logicalOperator": "And",
  "children": [
    {
      "nodeType": "Condition",
      "field": "AgentCustomField",
      "customFieldDefinitionId": "00000000-0000-0000-0000-000000000000",
      "operator": "Equals",
      "value": "Financeiro"
    }
  ]
}`,
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Para que serve na prática',
        text: 'Depois de criada, a label vira escopo de tarefa de automação (Tags Incluídas/Excluídas), filtro na lista de agentes e agrupamento em relatórios. É o jeito mais barato de aplicar uma política só no parque certo.',
      },
    ],
  },
  {
    id: 'remote-access',
    part: 'operation',
    navLabel: '2.4. Acesso remoto',
    badge: 'Parte 2 · Capítulo 4 · Sessões',
    title: 'Acesso remoto: tela, terminal, arquivos, registro e WebRDP',
    lead: 'Sessões remotas acontecem sobre NATS, com consentimento configurável, banner fora da captura e guardas fail-closed no endpoint.',
    blocks: [
      {
        type: 'table',
        caption: 'Recursos de sessão remota',
        headers: ['Recurso', 'Como funciona', 'Configuração'],
        rows: [
          ['Tela remota', 'DXGI Desktop Duplication com fallback GDI; dirty rects e tone-mapping HDR', 'Limites de sessão e gravação em /settings/remote-access'],
          ['Terminal remoto', 'ConPTY isolado; runAs=user é fail-closed (nunca degrada para SYSTEM)', 'Direito por papel; auditoria de comandos'],
          ['Arquivos remotos', 'Protocolo binário DF com handle cache e chunks de 256 KB', 'Sem token na URL; acesso por sessão NATS'],
          ['Processos', 'Listar, encerrar e iniciar processos com guard', 'Ações destrutivas exigem confirmação'],
          ['Registro', 'Editor de registro com bloqueio de SAM/SECURITY/LSA e Run/RunOnce', 'Guard fail-closed no agent'],
          ['Proxy LAN HTTP/WS', 'Encaminha requisições da LAN pelo endpoint (ex.: acessar painel de impressora)', 'Allowlist em /settings/proxy-policy'],
          ['WebRDP / túnel RDP', 'Túnel multiplexado para o TermService, porta efêmera em 127.0.0.1', '/settings/remote-webrtc e direito NoRdp=128'],
          ['Tela via WebRTC', 'Transporte WebRTC negociado pelo servidor, com fallback para o caminho NATS', '/settings/remote-webrtc (transporte preferencial e limites)'],
          ['Nível de log do debug remoto', 'Ajuste ao vivo do nível de log (ex.: info → debug) durante uma sessão de diagnóstico', 'Console de debug remoto (/agents/remote-debug-console)'],
        ],
      },
      {
        type: 'steps',
        title: 'Abrindo uma sessão com segurança',
        items: [
          {
            title: '1. Verifique a política de consentimento',
            description: 'Se o consentimento estiver exigido, o usuário vê uma solicitação com contagem regressiva na tela antes de qualquer captura.',
            route: 'Configurações → Consentimento (/settings/remote-consent)',
          },
          {
            title: '2. Inicie a sessão pelo detalhe do agente',
            description: 'Escolha o tipo de sessão (tela, terminal, arquivos, registro, proxy ou WebRDP). O direito do seu papel define o que aparece.',
            route: '/agents/:id · /agents/remote-session',
          },
          {
            title: '3. Avise e acompanhe o banner',
            description: 'Durante a sessão um banner flutuante permanece visível para o usuário e é excluído da captura — o colaborador sempre sabe que está sendo atendido.',
          },
          {
            title: '4. Encerre limpo',
            description: 'Finalize a sessão, confirme se a gravação (quando habilitada) foi salva e registre o atendimento no chamado.',
          },
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Proxy LAN é fail-closed',
        text: 'Se a allowlist de destinos estiver vazia, nenhuma requisição LAN é encaminhada. Configure RemoteAccess:Proxy:DefaultAllowlist e AllowedPorts e mantenha a lista o mais curta possível.',
      },
      {
        type: 'accordion',
        title: 'Direitos, limites e transparência',
        items: [
          {
            summary: 'Direitos por papel (NoProxy, NoRdp)',
            paragraphs: [
              'Os direitos viram ACL na sessão NATS e ticket efêmero: NoProxy=64 bloqueia o proxy LAN e NoRdp=128 bloqueia o WebRDP para aquele técnico.',
              'Sem o direito, o recurso não aparece na interface e o servidor recusa a emissão do ticket.',
            ],
            route: '/identity/roles',
          },
          {
            summary: 'Limites simultâneos e banda',
            paragraphs: [
              'O padrão é 5 sessões simultâneas por tipo. Ajuste conforme a sua operação para não saturar o link do cliente.',
              'A tela remota usa dirty rects e compressão para reduzir banda; links ruins podem ser atendidos por terminal, que é muito mais leve.',
            ],
            route: '/settings/remote-access',
          },
          {
            summary: 'Gravação de sessão',
            paragraphs: [
              'A gravação é opcional e fica no object storage. Ative apenas onde houver exigência de auditoria e comunique o usuário.',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'automation-scripts',
    part: 'operation',
    navLabel: '2.5. Biblioteca de scripts',
    badge: 'Parte 2 · Capítulo 5 · Scripts',
    title: 'Biblioteca de scripts: escrever uma vez, usar em toda a frota',
    lead: 'Scripts versionados e parametrizados substituem o famoso "comando que só o fulano sabe". Eles podem ler campos personalizados, gravar resultados e virar sensores.',
    blocks: [
      {
        type: 'steps',
        title: 'Como cadastrar um script',
        items: [
          {
            title: '1. Crie o script',
            description: 'Informe nome, descrição, shell (PowerShell ou CMD/Batch) e o conteúdo. Cada edição gera uma nova revisão com histórico.',
            route: 'Automação → Scripts (/automation/scripts)',
          },
          {
            title: '2. Declare parâmetros e variáveis',
            description: 'Parâmetros viram argumentos na execução; variáveis de ambiente entregam contexto sem interpolar na linha de comando.',
          },
          {
            title: '3. Escolha o destino da saída',
            description: 'A saída pode virar nota do agente (com tarefa, exit code, erro e até 4000 caracteres) ou alimentar um campo personalizado coletor.',
            route: 'Script → Saída',
          },
          {
            title: '4. Execute em um agente de teste',
            description: 'Rode pela tarefa de automação em um endpoint piloto antes de aplicar na frota. Acompanhe em Operações.',
            route: 'Operações (/automation/operations)',
          },
          {
            title: '5. Reaproveite',
            description: 'O mesmo script pode ser usado por várias tarefas, por sensores de script e pela visão reversa de campos personalizados.',
          },
        ],
      },
      {
        type: 'code',
        title: 'Exemplo: script parametrizado que lê campo personalizado e grava resultado',
        language: 'powershell',
        snippet: `param(
  [string]$CaminhoLog = 'C:\\Windows\\Temp\\discovery-limpeza.log'
)

$campos = $null
if ($env:MDZ_CUSTOM_FIELDS) { $campos = $env:MDZ_CUSTOM_FIELDS | ConvertFrom-Json }

# Usa um campo personalizado como contexto (interpolação [[campo:chave]] também funciona)
$dias = if ($campos.dias_retencao_log) { [int]$campos.dias_retencao_log } else { 30 }
$limite = (Get-Date).AddDays(-$dias)

$alvos = Get-ChildItem 'C:\\Windows\\Temp' -File -ErrorAction SilentlyContinue |
         Where-Object { $_.LastWriteTime -lt $limite }

$bytes = ($alvos | Measure-Object Length -Sum).Sum
$alvos | Remove-Item -Force -ErrorAction SilentlyContinue

Write-Output "Removidos $($alvos.Count) arquivos com mais de $dias dias ($bytes bytes)."

# Última linha não vazia pode alimentar um campo coletor (ex.: espaco_liberado_mb)
Write-Output ('MDZ_COLLECT: {"name":"limpeza_ultima_mb","value":"' + [math]::Round($bytes / 1MB, 2) + '"}')
exit 0`,
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Campos personalizados no runtime do script',
        text: 'MDZ_CUSTOM_FIELDS é um JSON com os campos liberados para leitura (segredos e valores nulos são omitidos). Já [[campo:chave]] é expandido no comando, nos argumentos e no conteúdo do script, mantendo o hash de integridade do conteúdo original.',
      },
      {
        type: 'table',
        caption: 'Boas práticas obrigatórias',
        headers: ['Prática', 'Por quê'],
        rows: [
          ['Tratar erros e sair com exit code correto', 'A tarefa coletora só grava em caso de sucesso'],
          ['Escrever saída curta e objetiva', 'O resultado é truncado e fica no histórico do atendimento'],
          ['Não interpolar dados sensíveis na linha de comando', 'Campos secretos nunca aparecem em claro'],
          ['Testar em um endpoint piloto', 'Evita surpresa em 2.000 máquinas'],
          ['Versionar em vez de sobrescrever', 'Permite auditoria e rollback'],
        ],
      },
    ],
  },
  {
    id: 'automation-tasks',
    part: 'operation',
    navLabel: '2.6. Tarefas de automação',
    badge: 'Parte 2 · Capítulo 6 · Automação',
    title: 'Tarefas de automação: instalar, atualizar, remover e executar em escala',
    lead: 'A tarefa é a unidade de execução: uma ação, um alvo definido por escopo e tags, gatilhos configuráveis e uma experiência de usuário controlada.',
    blocks: [
      {
        type: 'table',
        caption: 'Tipos de ação',
        headers: ['Ação', 'O que faz', 'Origens'],
        rows: [
          ['InstallPackage', 'Instala um aplicativo em modo silencioso', 'Winget, Chocolatey ou pacote customizado'],
          ['UpdatePackage', 'Atualiza se já estiver instalado', 'Winget, Chocolatey ou customizado'],
          ['UpdateOrInstallPackage', 'Garante o estado desejado (instala ou atualiza)', 'Winget, Chocolatey ou customizado'],
          ['RemovePackage', 'Desinstala silenciosamente', 'Winget, Chocolatey ou customizado'],
          ['RunScript', 'Executa um script versionado da biblioteca', 'PowerShell, Batch/CMD'],
          ['CustomCommand', 'Executa um comando pontual sem script reutilizável', 'Shell/CLI do Windows'],
        ],
      },
      {
        type: 'steps',
        title: 'Montando uma tarefa de ponta a ponta',
        items: [
          {
            title: '1. Escolha a ação e o pacote',
            description: 'Em Automação → Tarefas, clique em Nova Tarefa e selecione a ação e a origem do pacote no seletor integrado.',
            route: 'Automação → Tarefas (/automation/tasks)',
          },
          {
            title: '2. Defina escopo e tags',
            description: 'Global, Cliente, Site ou agente específico — e refine com Tags Incluídas/Excluídas (por exemplo, aplicar só em "Financeiro" e excluir "Servidores").',
          },
          {
            title: '3. Configure gatilhos e ordem',
            description: 'Combine execução imediata, recorrente (com assistente cron visual), no logon do usuário ou no check-in do agente. O executionOrder encadeia pré-requisitos.',
          },
          {
            title: '4. Ajuste a experiência do usuário',
            description: 'Silencioso ou aviso Toast antes/depois, com opção de adiar (allowDefer), tempo limite e fechamento controlado de processos (chrome.exe, outlook.exe).',
          },
          {
            title: '5. Respeite a janela e monitore',
            description: 'Marque se a tarefa deve respeitar a janela de manutenção do Site e acompanhe status (pendente, em execução, sucesso, erro, adiado) em Operações e Auditoria.',
            route: 'Operações (/automation/operations) · Auditoria (/automation/audit)',
          },
        ],
      },
      {
        type: 'code',
        title: 'Exemplo prático: garantir o agente de backup em todas as máquinas de um site',
        language: 'text',
        snippet: `Tarefa: "Garantir Backup Agent"
  Ação:            UpdateOrInstallPackage
  Origem:          Chocolatey
  Pacote:          backup-agent
  Escopo:          Site "acme-datacenter"
  Tags excluídas:  Servidores-Legado
  Gatilho:         No check-in do agente (recorrente)
  Janela:          Respeitar janela de manutenção do site (01:00-05:00)
  UX:              Silencioso
  Ordem:           1) Instalar runtime  2) Instalar backup agent
  Pós-execução:    RunScript "validar-servico-backup" -> grava campo personalizado`,
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Distribuição P2P dentro do Site',
        text: 'Pacotes grandes são replicados entre os próprios agentes do Site por libp2p: o primeiro endpoint baixa da WAN e os demais copiam na LAN, validados por SHA-256. Isso reduz drasticamente o consumo do link do cliente.',
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Comece pequeno',
        text: 'Sempre teste a tarefa em um agente piloto e depois em um Site pequeno. Ações de remoção e comandos personalizados não têm "desfazer" automático.',
      },
    ],
  },
  {
    id: 'software-store',
    part: 'operation',
    navLabel: '2.7. Software e App Store',
    badge: 'Parte 2 · Capítulo 7 · Software',
    title: 'Inventário de software, catálogo e App Store self-service',
    lead: 'Enxergue o que está instalado na frota, publique pacotes aprovados e deixe o colaborador instalar sozinho o que a TI liberou.',
    blocks: [
      {
        type: 'table',
        caption: 'Telas de software',
        headers: ['Tela', 'Rota', 'O que faz'],
        rows: [
          ['Visão geral', '/software', 'Resumo de inventário, catálogo e pacotes próprios'],
          ['Inventário detalhado', '/software/inventory', 'Todos os aplicativos instalados, versões e por endpoint'],
          ['Loja / catálogo', '/software/store', 'Catálogo Winget e Chocolatey, aprovação e publicação'],
          ['Pacote customizado', '/software/store/custom/new', 'Editor de pacote próprio com instalador enviado ao servidor'],
          ['Tarefas e scripts', '/automation', 'Execução e automação por trás dos pacotes'],
        ],
      },
      {
        type: 'steps',
        title: 'Publicar um aplicativo na App Store',
        items: [
          {
            title: '1. Escolha a origem',
            description: 'Winget ou Chocolatey para software público; pacote customizado quando o instalador é interno ou exige parâmetros próprios.',
          },
          {
            title: '2. Configure o pacote',
            description: 'Defina nome, versão, ícone, comandos de instalação/desinstalação, argumentos silenciosos e requisitos (SO, arquitetura).',
            route: '/software/store/custom/new',
          },
          {
            title: '3. Defina o escopo de publicação',
            description: 'Publique para Global, Cliente, Site ou grupo de agentes por label. O colaborador só vê o que foi liberado para ele.',
          },
          {
            title: '4. Aprove e teste',
            description: 'Instale em um endpoint piloto pela tarefa de automação e confirme o resultado em Operações antes de abrir para a frota.',
          },
          {
            title: '5. Acompanhe o inventário',
            description: 'Use o inventário para medir adoção e versões, e remova softwares não autorizados com uma tarefa RemovePackage.',
            route: '/software/inventory',
          },
          {
            title: '6. Opere o ciclo de aprovação e a limpeza do catálogo',
            description: 'A loja tem abas de Aprovações e Auditoria: aprove pacotes, acompanhe quem aprovou, o que mudou e quando. Pacotes próprios removidos vão para uma lixeira, e a tela ainda oferece a limpeza de pacotes órfãos (sem vínculo) — evitando lixo no object storage. A sincronização do catálogo (Winget) roda em segundo plano e o status aparece na própria tela.',
            route: '/software/store (abas Aprovações, Auditoria e Lixeira)',
          },
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Instalação sem senha de administrador',
        text: 'A App Store existe justamente para isso: o colaborador clica em Instalar e o serviço SYSTEM executa a instalação. Ninguém precisa de credencial administrativa para colocar o software aprovado.',
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Pacote customizado é código executado como SYSTEM',
        text: 'Trate cada pacote como código privilegiado: valide a origem do instalador, prefira assinatura Authenticode e teste sempre em piloto antes de publicar.',
      },
    ],
  },
  {
    id: 'patches',
    part: 'operation',
    navLabel: '2.8. Patches e Windows Update',
    badge: 'Parte 2 · Capítulo 8 · Patches',
    title: 'Gestão de patches: política, aprovação, conformidade e exceções',
    lead: 'O DiscoveryRMM inventaria, aprova e instala atualizações do Windows respeitando janelas de manutenção e severidade.',
    blocks: [
      {
        type: 'table',
        caption: 'Telas de patch',
        headers: ['Tela', 'Rota', 'O que faz'],
        rows: [
          ['Visão geral', '/patches', 'Painel de conformidade e risco do parque'],
          ['Atualizações', '/patches/updates', 'Atualizações detectadas por endpoint e status'],
          ['Inventário', '/patches/inventory', 'Catálogo de atualizações conhecidas'],
          ['Pendências', '/patches/pending', 'O que falta instalar e há quanto tempo'],
          ['Aprovações', '/patches/approvals', 'Aprovar, bloquear ou instalar fora da janela'],
          ['Conformidade', '/patches/compliance', 'Percentual da frota atualizada por classificação'],
          ['Política', '/patches/policy', 'Aprovação automática por severidade, carência e janelas'],
        ],
      },
      {
        type: 'steps',
        title: 'Configuração recomendada da política',
        items: [
          {
            title: '1. Defina a janela de manutenção por Site',
            description: 'Use o fuso IANA do Site para instalar fora do expediente. Sites de datacenter podem ter janelas mais agressivas.',
          },
          {
            title: '2. Aprove por severidade',
            description: 'Aprovação automática para Crítico e Segurança; manual para Drivers e opcional, que costumam quebrar periféricos.',
          },
          {
            title: '3. Configure carência e adiamento',
            description: 'Dias de carência para validar em piloto e limite de adiamentos do usuário, sem permitir adiar indefinidamente.',
          },
          {
            title: '4. Trate exceções com tarefa',
            description: 'Para urgência de segurança, dispare a instalação fora da janela por tarefa de automação direcionada a uma label específica.',
          },
          {
            title: '5. Meça toda semana',
            description: 'Acompanhe conformidade por Cliente e Site e trate as máquinas fora da política como incidente.',
          },
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Como a coleta funciona',
        text: 'No Windows, o agent usa a API do Windows Update Agent (WUA) via COM para inventariar e instalar. Isso significa que o mesmo mecanismo do WSUS/Windows Update é usado, sem agente de terceiros.',
      },
    ],
  },
  {
    id: 'sensors',
    part: 'operation',
    navLabel: '2.9. Sensores e limiares',
    badge: 'Parte 2 · Capítulo 9 · Monitoramento',
    title: 'Sensores: o agente mede, o servidor decide',
    lead: 'Sensores coletam métricas no intervalo configurado e o servidor aplica os limiares. Editar um limiar não exige re-sync do endpoint.',
    blocks: [
      {
        type: 'table',
        caption: 'Catálogo dos 20 tipos de sensor: canal primário e regra de avaliação',
        headers: ['Tipo', 'Canal primário', 'Regra'],
        rows: [
          ['DiskSpace', 'free_percent', 'Livre abaixo do crítico → Failing; abaixo da atenção → Warning; volume inexistente → Failing'],
          ['Cpu', 'used_percent', 'Uso acima do crítico → Failing; acima da atenção → Warning'],
          ['Memory', 'used_percent', 'Uso acima do crítico → Failing; acima da atenção → Warning'],
          ['Uptime', 'uptime_seconds', 'Tempo ligado abaixo da atenção → Warning (detecta reinícios inesperados)'],
          ['Service', 'running', 'Serviço parado → Failing com a severidade configurada'],
          ['Process', 'running', 'Processo ausente → Failing'],
          ['Ping', 'latency_avg_ms', 'Perda acima de zero ou nenhuma resposta → Failing; senão, limiares de latência'],
          ['TcpPort', 'open', 'Porta fechada → Failing; aberta → limiar opcional de connect_ms'],
          ['HttpProbe', 'total_ms', 'Status fora de 2xx/3xx → Failing; senão, limiar de tempo'],
          ['HttpThroughput', 'download_mbps', 'Abaixo do limiar → Failing/Warning (menor é pior)'],
          ['DnsLatency', 'resolve_ms', 'Acima do limiar → Failing/Warning'],
          ['EventLogRate', 'event_count', 'Eventos contados na janela consultada (window_minutes) acima do limiar → Warning/Failing'],
          ['SmartStatus', 'smart_ok', 'SMART não saudável → Failing; temperature_c e reallocated_sectors alimentam o diagnóstico'],
          ['CertificateExpiry', 'days_to_expiry', 'Dias para expirar abaixo do limiar → Warning/Failing'],
          ['DefenderStatus', 'defender_ok', 'Proteção em tempo real desligada → Failing; signature_age_days acompanha a idade da assinatura'],
          ['BitLocker', 'bitlocker_on', 'Volume não protegido → Failing; encryption_percent mostra o progresso da criptografia'],
          ['DiskIo', 'busy_percent', 'Ocupação do disco acima do limiar → Warning/Failing; expõe também read_bps, write_bps e latency_ms'],
          ['Bandwidth', 'rx_bps', 'Tráfego recebido acima do limiar → Warning/Failing; tx_bps mostra o envio'],
          ['ADConsistency', 'replication_failures', 'Somente em controlador de domínio: falhas de replicação, dcdiag ou desvio de relógio → Failing; fora de um DC a coleta volta vazia (Unknown)'],
          ['Script', 'canal declarado', 'MDZ_STATUS > mapa de exit codes > limiar do canal primário'],
        ],
      },
      {
        type: 'paragraphs',
        items: [
          'Estados possíveis: Passing (OK), Warning (Atenção), Failing (Crítico), Unknown (erro de coleta), Pending (aguardando primeira leitura) e Stale (sem dado recente). Um estado Crítico nunca é mascarado por Stale.',
          'Os coletores de Bandwidth, DiskIo, EventLogRate, SmartStatus, CertificateExpiry, DefenderStatus, BitLocker e ADConsistency são nativos do agent Windows; em plataformas sem coletor o tipo responde Unknown com RunError em vez de inventar valor.',
          'A comparação é estrita e em ponto flutuante, sem arredondar antes: 15,0% livre com atenção em 15% ainda passa. FailsBeforeAlert (padrão 2) controla apenas o ALERTA — a interface mostra o estado real já na primeira falha. Durante a janela de manutenção, o estado atualiza mas o alerta não é disparado.',
          'Duas opções do formulário merecem atenção: sustainSamples (histerese) exige N leituras consecutivas na mesma condição antes de mudar o estado, evitando alerta por pico isolado; e restartIfStopped, disponível para sensores de Serviço, manda o agent tentar reiniciar o serviço parado — a tentativa vira evidência (restartAttempted / restartSucceeded) e o estado final continua sendo decidido pelo servidor.',
        ],
      },
      {
        type: 'steps',
        title: 'Cadastrando um sensor nativo',
        items: [
          {
            title: '1. Abra o gerenciamento de sensores',
            description: 'Crie a definição com tipo, escopo (Global, Cliente, Site ou Agente), alvo, intervalo e limiares de Atenção e Crítico.',
            route: 'Sensores → Gerenciar (/sensors/manage)',
          },
          {
            title: '2. Use os sensores recomendados no primeiro acesso',
            description: 'No detalhe de um agente sem sensores, o botão "Adicionar sensores recomendados" cria disco, CPU, memória e uptime de uma vez.',
            route: '/agents/:id?tab=sensores',
          },
          {
            title: '3. Valide a coleta',
            description: 'Rode "Executar agora" e confira valor atual, sparkline e última execução. Ajuste limiares errados antes de gerar alertas em massa.',
          },
          {
            title: '4. Acompanhe a frota',
            description: 'A visão de frota mostra quantos equipamentos estão em Atenção/Crítico por tipo, com gráficos históricos por canal.',
            route: 'Sensores → Frota (/sensors)',
          },
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Retenção',
        text: 'Amostras brutas ficam 7 dias, eventos 90 dias e rollups (hora/dia) 400 dias. O estado corrente nunca é apagado, então o histórico longo continua legível mesmo depois do descarte das amostras.',
      },
    ],
  },
  {
    id: 'sensor-script',
    part: 'operation',
    navLabel: '2.10. Sensores por script',
    badge: 'Parte 2 · Capítulo 10 · Sensor de script',
    title: 'Sensores por script: monitorar o que só existe no seu ambiente',
    lead: 'Quando nenhum tipo nativo cobre a métrica, um script PowerShell vira sensor: ele emite status e canais, e o servidor aplica limiares, alertas e Auto-Tickets.',
    blocks: [
      {
        type: 'paragraphs',
        items: [
          'O script roda no endpoint (como o serviço, sem contexto de usuário) com timeout e truncamento de saída. Ele conversa com o agente por um protocolo de linhas no stdout, consumido antes de o resto da saída virar log.',
        ],
      },
      {
        type: 'code',
        title: 'Protocolo MDZ lido do stdout',
        language: 'text',
        snippet: [
          'MDZ_STATUS: OK | WARNING | CRITICAL | UNKNOWN   # sobrescreve o estado avaliado pelos limiares',
          'MDZ_MESSAGE: texto curto exibido no alerta e no histórico',
          'MDZ_METRIC: chave=valor,outra_chave=valor          # várias métricas por linha',
          'MDZ_METRIC_JSON: {"chave": 12.4, "outra": 2.1}     # métricas em JSON (uma linha)',
        ].join(String.fromCharCode(10)),
      },
      {
        type: 'table',
        caption: 'Extratores: como ler a saída do script',
        headers: ['Tipo', 'Para que serve', 'Exemplo'],
        rows: [
          ['mdz', 'O caminho mais simples: o script já emite MDZ_METRIC', '{ "type": "mdz", "channel": "anydesk_installed" }'],
          ['regex', 'Aproveita scripts existentes e captura um grupo', '{ "type": "regex", "channel": "livre_gb", "regex": "Livre: ([0-9.]+) GB", "scale": 1, "aggregate": "last" }'],
          ['json', 'Lê um valor por caminho no JSON de saída', '{ "type": "json", "channel": "download_mbps", "jsonPath": "download.bandwidth", "scale": 8e-6, "aggregate": "avg" }'],
        ],
      },
      {
        type: 'paragraphs',
        items: [
          'O agregador (last, first, min, max, avg, sum) define o que fazer quando o script devolve várias amostras — o padrão é last. O scale multiplica o valor lido (útil para converter bytes em Mbps, por exemplo).',
          'O mapa de exit codes traduz o código de saída em estado: presets prontos são Tactical RMM (0 = ok, 1 = falha), Comunidade (0 = ok, 1 = atenção, 2 = crítico) e Simples (só 0 passa). Códigos fora das regras seguem a entrada unlistedNonZero.',
        ],
      },
      {
        type: 'steps',
        title: 'Criando um sensor por script',
        items: [
          {
            title: '1. Abra o editor completo de sensor de script',
            description: 'Informe nome, escopo, alvo, intervalo, os canais que o sensor expõe, o script, os extratores e o mapa de exit codes.',
            route: 'Sensores → Editor de script (/sensors/script)',
          },
          {
            title: '2. Declare os canais e defina limiares',
            description: 'Cada canal tem unidade e direção (maior é pior ou menor é pior). O limiar vale por canal, com níveis de Atenção e Crítico.',
          },
          {
            title: '3. Aproveite o esqueleto de extratores',
            description: 'O editor gera automaticamente um extrator tipo mdz para cada canal declarado — é o caminho mais simples e menos sujeito a erro.',
          },
          {
            title: '4. Teste em um endpoint e force sync',
            description: 'Execute "Executar agora" no agente e confira valor, estado e mensagem. Se o canal ficar vazio, revise o nome da chave no MDZ_METRIC.',
          },
          {
            title: '5. Conecte alertas e Auto-Ticket',
            description: 'Ao entrar em Crítico por N coletas consecutivas, o sensor pode abrir chamado automaticamente e comentar/fechar quando normalizar.',
            route: '/tickets/auto-rules',
          },
        ],
      },
      {
        type: 'code',
        title: 'EXEMPLO 1 — Sensor de conformidade: AnyDesk e TeamViewer instalados? Qual o ID?',
        language: 'powershell',
        snippet: `# Canais declarados no sensor: anydesk_installed, teamviewer_installed
# Limiares sugeridos: qualquer canal = 1 é Passing; 0 é Failing crítico
# Exit codes: Comunidade (0 = ok, 1 = atenção, 2 = crítico)
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

$anydesk   = Get-AnyDeskId
$teamviewer = Get-TeamViewerId
$faltando = @()
if (-not $anydesk)    { $faltando += 'AnyDesk' }
if (-not $teamviewer) { $faltando += 'TeamViewer' }

# Canais numéricos: 1 = instalado, 0 = ausente
Write-Output ('MDZ_METRIC: anydesk_installed=' + $(if ($anydesk) { 1 } else { 0 }) + ',teamviewer_installed=' + $(if ($teamviewer) { 1 } else { 0 }))

# Identificadores para leitura humana (aparecem na mensagem do sensor)
Write-Output ("MDZ_MESSAGE: AnyDesk=" + $(if ($anydesk) { $anydesk } else { 'ausente' }) + " | TeamViewer=" + $(if ($teamviewer) { $teamviewer } else { 'ausente' }))

if ($faltando.Count -gt 0) {
  Write-Output 'MDZ_STATUS: CRITICAL'
  exit 2
}
Write-Output 'MDZ_STATUS: OK'
exit 0`,
      },
      {
        type: 'code',
        title: 'EXEMPLO 1 — Extratores e mapa de exit codes para colar no editor',
        language: 'json',
        snippet: `// Extratores (ExtractorsJson): um extrator mdz por canal declarado
[
  { "type": "mdz", "channel": "anydesk_installed" },
  { "type": "mdz", "channel": "teamviewer_installed" }
]

// Mapa de exit codes (ExitCodeMapJson)
[
  { "codes": [0], "status": "Passing", "message": "Ferramentas de acesso remoto presentes." },
  { "codes": [2], "status": "Failing", "severity": "Critical", "message": "Ferramenta de acesso remoto ausente no endpoint." },
  { "unlistedNonZero": { "status": "Failing", "severity": "Critical" } }
]`,
      },
      {
        type: 'code',
        title: 'EXEMPLO 2 — Sensor de saúde do backup e da fila de logs',
        language: 'powershell',
        snippet: `# Canais declarados: backup_service (1/0), log_mb (numérico), erros_ultima_hora (numérico)
$ErrorActionPreference = 'SilentlyContinue'

# 1) Serviço do agente de backup (ajuste o nome do seu fornecedor)
$servico = Get-Service -Name 'BackupAgentSvc'
$servicoOk = if ($servico -and $servico.Status -eq 'Running') { 1 } else { 0 }

# 2) Tamanho da pasta de logs do backup
$pasta = 'C:\\ProgramData\\BackupAgent\\logs'
$logMb = 0
if (Test-Path $pasta) {
  $logMb = [math]::Round(((Get-ChildItem $pasta -File | Measure-Object Length -Sum).Sum / 1MB), 1)
}

# 3) Erros nas últimas 1 hora no log de aplicação
$desde = (Get-Date).AddHours(-1)
$erros = (Get-WinEvent -FilterHashtable @{ LogName='Application'; Level=2; StartTime=$desde } -ErrorAction SilentlyContinue | Measure-Object).Count
if (-not $erros) { $erros = 0 }

Write-Output ('MDZ_METRIC: backup_service=' + $servicoOk + ',log_mb=' + $logMb + ',erros_ultima_hora=' + $erros)
Write-Output ("MDZ_MESSAGE: servico=$servicoOk log_mb=$logMb erros_1h=$erros")

if ($servicoOk -eq 0) { Write-Output 'MDZ_STATUS: CRITICAL'; exit 2 }
if ($logMb -gt 500 -or $erros -gt 50) { Write-Output 'MDZ_STATUS: WARNING'; exit 1 }
Write-Output 'MDZ_STATUS: OK'
exit 0`,
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Sensor ou campo personalizado?',
        text: 'Use SENSOR quando você quer estado, limiar, histórico, gráfico e alerta (por exemplo: qualquer ferramenta de acesso remoto ausente). Use CAMPO PERSONALIZADO com tarefa coletora quando quer GUARDAR um valor textual para consulta e filtro (por exemplo: o ID do AnyDesk daquela máquina). O exemplo do capítulo 1.8 mostra a coleta gravando em campo personalizado.',
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Nome do canal é contrato',
        text: 'A chave emitida em MDZ_METRIC precisa ser exatamente a chave declarada no sensor e no extrator. Chave errada não gera erro visível: o canal simplesmente fica sem valor.',
      },
    ],
  },
  {
    id: 'monitoring-reports',
    part: 'operation',
    navLabel: '2.11. Alertas, notificações e relatórios',
    badge: 'Parte 2 · Capítulo 11 · Monitoramento e relatórios',
    title: 'Da coleta ao relatório: alertas, notificações e evidências',
    lead: 'Um sensor que falha gera transição de estado, evento, notificação e — quando configurado — chamado automático. Tudo isso vira dado de relatório.',
    blocks: [
      {
        type: 'paragraphs',
        items: [
          'A ingestão de amostras avalia o estado e, quando há transição (abertura, escalada ou resolução), grava um evento de monitoramento e dispara as integrações habilitadas: Auto-Ticket, notificação in-app e canais externos (e-mail e webhook).',
          'Tudo é best-effort: se o envio de e-mail falhar, a amostra e o estado continuam válidos. Os interruptores ficam na configuração de sensores e a notificação externa depende de AutoTicket:Enabled no servidor.',
        ],
      },
      {
        type: 'table',
        caption: 'Canais de notificação',
        headers: ['Canal', 'Configuração', 'Uso típico'],
        rows: [
          ['In-app', '/settings/notifications', 'Aviso imediato para quem está no Console'],
          ['E-mail (SMTP)', '/settings/notifications', 'Escalada para o plantão e resumo diário'],
          ['Webhook', '/settings/notifications', 'Integração com Slack/Teams ou sistemas internos'],
          ['Web Push', '/settings/notifications', 'Notificação no navegador do técnico'],
          ['Toast no Windows', 'Tarefa de automação', 'Aviso ao usuário durante instalação/remoção'],
        ],
      },
      {
        type: 'steps',
        title: 'Gerando relatórios',
        items: [
          {
            title: '1. Escolha um template pronto ou crie o seu',
            description: 'O catálogo traz modelos de saúde da frota, patches, inventário e SLA. O wizard cria modelos personalizados escolhendo datasets, colunas, filtros e agrupamentos.',
            route: 'Relatórios → Templates (/reports/templates) · Catálogo (/reports/templates/catalog)',
          },
          {
            title: '2. Execute sob demanda',
            description: 'Parametrize cliente, site, período e formato e gere na hora para conferir o resultado.',
            route: 'Relatórios → Executar (/reports/run)',
          },
          {
            title: '3. Agende a entrega',
            description: 'Crie agendamentos recorrentes com destinatários e formato (XLSX, CSV ou Markdown) usando o fuso horário do Site. A geração de PDF saiu do servidor: use o preview HTML do relatório e a impressão do navegador quando precisar de PDF.',
            route: 'Relatórios → Agendamentos (/reports/schedules)',
          },
          {
            title: '4. Audite o histórico',
            description: 'Cada execução fica registrada com status, tamanho e destino, permitindo comprovar a entrega ao cliente.',
            route: 'Relatórios → Execuções (/reports/executions)',
          },
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Dataset de sensores',
        text: 'O dataset AgentSensors entrega uma linha por agente/sensor/alvo com status, severidade, canal, valor, limites, falhas e última coleta. É a base ideal para o relatório mensal de monitoramento entregue ao cliente.',
      },
    ],
  },
  {
    id: 'tickets',
    part: 'operation',
    navLabel: '2.12. Chamados e Service Board',
    badge: 'Parte 2 · Capítulo 12 · Service Desk',
    title: 'Chamados: fila, contexto do dispositivo, SLA e abertura automática',
    lead: 'O Service Desk do DiscoveryRMM nasce dentro do RMM: o chamado já sabe qual é a máquina, o que os sensores dizem e qual técnico pode agir.',
    blocks: [
      {
        type: 'table',
        caption: 'Telas de atendimento',
        headers: ['Tela', 'Rota', 'O que faz'],
        rows: [
          ['Service Board', '/service-board', 'Visão operacional unificada de fila, alertas e saúde dos clientes'],
          ['Chamados (lista/Kanban)', '/tickets', 'Fila com filtros por departamento, prioridade, status, técnico e risco de SLA'],
          ['Detalhe do chamado', '/tickets/:id', 'Contexto do dispositivo, timeline, chat ao vivo e ações'],
          ['Alertas de chamado', '/tickets/alerts', 'Regras de alerta por tempo/condição'],
          ['SLA', '/tickets/sla', 'Metas, calendários e perfis de atendimento'],
          ['CSAT', '/tickets/csat', 'Pesquisa de satisfação e indicadores'],
          ['Macros', '/tickets/macros', 'Resposta + status + atribuição em um clique'],
          ['Templates', '/tickets/templates', 'Coleta estruturada na abertura'],
          ['Workflow', '/settings/workflow · /settings/workflow-profiles', 'Estados, transições e perfis por cliente'],
          ['Auto-Tickets', '/tickets/auto-policy · /tickets/auto-rules', 'Abertura automática a partir de sensores/eventos'],
          ['Alertas interativos', '/tickets/alerts', 'Aviso Toast ou Modal na tela do endpoint em estados específicos do workflow, com ações e timeout'],
          ['Views salvas e KPI', '/tickets', 'Filtros salvos por técnico e indicadores de fila/atendimento'],
          ['Escalonamento', '/tickets/sla · /settings/workflow-profiles', 'Regras de escalonamento por perfil de workflow e metas de SLA'],
        ],
      },
      {
        type: 'steps',
        title: 'Ciclo de atendimento',
        items: [
          {
            title: '1. Triagem',
            description: 'Comece pelo Service Board ou pela lista/Kanban. Priorize por risco de SLA, severidade do sensor e criticidade do cliente.',
          },
          {
            title: '2. Atendimento com contexto',
            description: 'No detalhe do chamado você vê o equipamento vinculado, sensores recentes, inventário e histórico. Use Chat ao Vivo ou abra uma sessão remota sem trocar de ferramenta.',
          },
          {
            title: '3. Acelere com macros e runbooks',
            description: 'Aplique macros para responder e mudar status de uma vez; siga runbooks vinculados para incidentes recorrentes.',
          },
          {
            title: '4. Cumpra o SLA',
            description: 'Metas de primeira resposta e resolução dentro do horário comercial do cliente, com calendários por região.',
          },
          {
            title: '5. Feche e meça',
            description: 'Encerre no estado final do workflow e acompanhe CSAT. Um chamado fechado por sensor normalizado deve sair do estado IsFinal configurado.',
          },
        ],
      },
      {
        type: 'accordion',
        title: 'Auto-Tickets: como funciona',
        items: [
          {
            summary: 'Pré-requisito bloqueante',
            paragraphs: [
              'Cada Cliente (ou o escopo Global) precisa ter ao menos um Workflow State com IsFinal igual a true. Sem isso, o motor abre chamados mas não consegue fechá-los quando o sensor normaliza.',
            ],
            route: '/settings/workflow',
          },
          {
            summary: 'Política e modo de IA',
            paragraphs: [
              'Em /tickets/auto-policy há um kill switch por Cliente/Site e o modo da IA: Off, Suggest (sugere a ação) ou AutoApply (aplica automaticamente).',
              'Comece em Suggest, acompanhe a qualidade das sugestões e só então mude para AutoApply.',
            ],
            route: '/tickets/auto-policy',
          },
          {
            summary: 'Regras, deduplicação e dry-run',
            paragraphs: [
              'As regras em /tickets/auto-rules definem qual alerta abre chamado, com deduplicação e cooldown para não criar dez chamados do mesmo sensor.',
              'Sempre rode a simulação (dry-run) antes de ativar: ela mostra exatamente o que teria acontecido.',
            ],
            route: '/tickets/auto-rules',
          },
          {
            summary: 'Auto-atribuição, aprendizado da IA e dificuldade do chamado',
            paragraphs: [
              'A atribuição automática parte do departamento: quem já veio com responsável explícito não é reatribuído, e departamento sem estratégia definida também não gera atribuição automática.',
              'Quando a estratégia do departamento é triagem por IA, o chamado entra na fila de triagem (opcionalmente já na abertura) em vez de receber um responsável imediato. O modo do departamento define se a IA apenas sugere (um humano confirma) ou se atribui sozinha.',
              'O aprendizado tem dois eixos independentes — competências dos técnicos e recalibração de pesos — e três modos cada: Off, Suggest (gera sugestões que o gestor aprova; padrão) e Auto (aplica respeitando os limites). Trocas manuais de responsável alimentam esse aprendizado.',
              'A dificuldade do chamado é estimada por heurística a partir dos sinais do próprio chamado e de chamados semelhantes, com a justificativa registrada — é insumo da triagem, não uma promessa de tempo de resolução.',
            ],
            route: '/tickets · /tickets/departments · /settings/workflow-profiles',
          },
          {
            summary: 'Alertas interativos, KPI e respostas assistidas',
            paragraphs: [
              'Regras de /tickets/alerts definem, por estado do workflow, um alerta na tela do usuário: Toast (fecha sozinho) ou Modal (exige interação), com título, mensagem, ícone, timeout, ações e ação padrão.',
              'Na lista de chamados você salva filtros (views) por técnico e acompanha KPIs da fila. A busca de respostas assistidas usa embeddings: descreva o caso e o sistema sugere respostas já usadas, além do runbook vinculado.',
              'O escalonamento é configurado por perfil de workflow/SLA: quando o tempo aperta, a regra eleva prioridade, troca responsável ou avisa a liderança.',
              'Quem vê e quem atua em cada chamado segue o departamento: o modelo de permissão de chamados por departamento é aplicado na API (guard) e não apenas no filtro da lista.',
            ],
            route: '/tickets/alerts · /settings/workflow-profiles',
          },
        ],
      },
      {
        type: 'table',
        caption: 'Origens de decisão registradas na atribuição automática',
        headers: ['Origem', 'O que significa'],
        rows: [
          ['ai', 'A IA escolheu o responsável e a escolha foi validada'],
          ['fallback_score', 'A IA respondeu algo inválido ou ambíguo; usou-se o topo do score determinístico'],
          ['fallback_strategy', 'IA indisponível ou com erro; aplicou-se a estratégia determinística de fallback'],
          ['ai_unavailable', 'Integração de IA desabilitada ou sem credencial'],
          ['no_candidates', 'Departamento sem candidatos elegíveis'],
          ['ai_budget_exceeded', 'Rate limit ou orçamento diário de IA atingido: degrada para o fallback, com o motivo auditável'],
          ['error', 'Falha inesperada durante a triagem'],
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Chat em janela dedicada',
        text: 'A conversa do chamado abre em janela própria (/tickets/:id/chat), então continua viva mesmo se você navegar para outra tela do Console — igual ao acesso remoto.',
      },
    ],
  },
  {
    id: 'knowledge-ai',
    part: 'operation',
    navLabel: '2.13. Conhecimento, IA e MCP',
    badge: 'Parte 2 · Capítulo 13 · Conhecimento e IA',
    title: 'Base de conhecimento, IA de 1º nível e governança de ferramentas',
    lead: 'A IA do DiscoveryRMM não é um chatbot solto: ela responde com a sua base de conhecimento e só usa as ferramentas MCP que você autoriza.',
    blocks: [
      {
        type: 'steps',
        title: 'Operando a base de conhecimento',
        items: [
          {
            title: '1. Crie artigos com estrutura',
            description: 'Editor estruturado com imagens e subpáginas em árvore para manuais extensos.',
            route: 'Suporte → Conhecimento (/knowledge)',
          },
          {
            title: '2. Defina a visibilidade',
            description: 'Artigos internos ficam para técnicos (e viram runbooks); artigos públicos aparecem na aba de conhecimento do Agent para o colaborador.',
          },
          {
            title: '3. Enriqueça a busca',
            description: 'Com embeddings pgvector habilitados, a busca é semântica: "impressora não imprime" encontra o artigo certo mesmo com palavras diferentes.',
          },
        ],
      },
      {
        type: 'table',
        caption: 'Configurações de IA',
        headers: ['Item', 'Rota', 'Descrição'],
        rows: [
          ['Provedor de IA', '/settings', 'OpenRouter, endpoint compatível com OpenAI ou Ollama local'],
          ['Custos por modelo', '/settings/ai-cost', 'Cockpit de consumo e limites por período'],
          ['Ferramentas MCP', '/settings/mcp-tools', 'Quais ferramentas a IA pode acionar no endpoint'],
          ['Base de conhecimento', '/knowledge', 'Fonte principal das respostas de 1º nível'],
          ['Chat IA no endpoint', 'Discovery Agent', 'Conversa com anexo opcional de captura, no contexto do usuário'],
          ['Ferramentas MCP de Sensores', '/settings/mcp-tools', 'A IA consulta quais sensores a máquina tem, o estado atual e a série histórica de um sensor'],
          ['Ferramentas MCP de Conhecimento', '/settings/mcp-tools', 'A IA lista e lê artigos da base para responder com o conteúdo da empresa'],
          ['Triagem de IA e orçamento', '/settings/ai-cost · Configurações do Servidor', 'Triagem automática de chamados em segundo plano, com cota por cliente e limite de gasto'],
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Governança primeiro',
        text: 'Habilite só as ferramentas MCP que a IA realmente precisa. Ferramenta habilitada é capacidade de ação no endpoint: trate a lista como permissão administrativa, não como catálogo.',
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'IA com contenção de custo',
        text: 'Acompanhe /settings/ai-cost por modelo e por período. Um modelo local (Ollama) resolve ambientes com dado sensível que não pode sair da rede.',
      },
      {
        type: 'accordion',
        title: 'Guardrails, cartões e auditoria da IA',
        items: [
          {
            summary: 'Guardrails de entrada e saída (DLP)',
            paragraphs: [
              'Na entrada, a mensagem é limitada (4.096 bytes por padrão) e padrões perigosos são recusados: script/iframe/object/embed, javascript:, eval( e atributos de evento como onclick=.',
              'Na saída, a resposta do modelo passa por sanitização que detecta e redige PII e segredos antes de chegar ao usuário ou ao Console.',
            ],
          },
          {
            summary: 'Cartões ricos (A2UI) validados',
            paragraphs: [
              'As respostas da IA podem trazer cartões interativos montados a partir de um catálogo fixo de componentes embarcado no renderer do agent (Card, Divider, Slider, CheckBox, AudioPlayer e outros).',
              'Um validador recusa componentes desconhecidos e referências órfãs antes do envio — é o que evita o usuário ver \"Component not found\" em vez da resposta.',
            ],
          },
          {
            summary: 'Auditoria de ferramentas MCP',
            paragraphs: [
              'Cada execução de ferramenta pelo chat fica registrada e pode ser consultada na aba Auditoria da tela de MCP, com filtro por ferramenta e por status e paginação.',
              'A gravação é best-effort: falha de auditoria nunca derruba a execução da ferramenta nem a conversa.',
            ],
            route: '/settings/mcp-tools (aba Auditoria)',
          },
        ],
      },
    ],
  },
  {
    id: 'integrations',
    part: 'operation',
    navLabel: '2.14. Integrações entre módulos',
    badge: 'Parte 2 · Capítulo 14 · Integrações',
    title: 'Como os módulos conversam (e por que isso importa)',
    lead: 'O valor do DiscoveryRMM está na automação entre domínios. Veja os fluxos que atravessam módulos e um incidente real narrado ponta a ponta.',
    blocks: [
      {
        type: 'table',
        caption: 'Fluxos de integração interna',
        headers: ['Fluxo', 'Módulos envolvidos', 'O que acontece'],
        rows: [
          ['Alerta → Auto-Ticket → IA → Resolução', 'Sensores + Auto-Tickets + Workflow + IA/KB + Notificações', 'Sensor falha além do limite → regra valida deduplicação → abre chamado no workflow do cliente → IA sugere a solução → sensor normaliza e o chamado fecha no estado IsFinal'],
          ['Multi-tenancy → Deploy → ACL NATS', 'Clientes/Sites + Deploy Tokens + Auth Callout + JetStream', 'O token vincula o agent ao Cliente/Site → o Auth Callout emite JWT restrito aos subjects do tenant'],
          ['IAM → Sessão remota → guardas do agent', 'IAM/RBAC + RemoteSessions + Consentimento + Agent Core', 'Direitos (NoProxy=64, NoRdp=128) viram ACL na sessão; o agent aplica consentimento e guardas fail-closed'],
          ['App Store / Automação → Malha P2P', 'Software + Automação + P2P', 'Pacote grande distribuído no Site é replicado entre agentes por SHA-256, economizando WAN'],
          ['Herança de config → runtime do agente', 'Server/Client/Site Config + Effective + /me/configuration', 'Mudança no Console recalcula a política efetiva; o agent sincroniza e ativa/oculta módulos sem reiniciar'],
          ['Labels → escopo de automação', 'Agent Labels + Automação + Políticas', 'A label calculada vira Tags Incluídas numa tarefa, aplicando software/política só no parque certo'],
          ['Campos personalizados → script/sensor', 'Custom Fields + Scripts + Sensores + Labels', 'O campo alimenta o script (MDZ_CUSTOM_FIELDS), o script grava de volta e o valor vira condição de label'],
        ],
      },
      {
        type: 'steps',
        title: 'Exemplo narrado: disco cheio em uma filial',
        items: [
          {
            title: '1. O sensor dispara',
            description: 'DiskSpace da máquina FIN-042 atinge 8% livre. O agente mede e envia a amostra; o servidor aplica o limiar e marca Failing.',
          },
          {
            title: '2. O alerta vira chamado',
            description: 'Após 2 coletas consecutivas, a regra de Auto-Ticket abre um chamado no workflow do cliente com o payload do sensor (canal, valor e limite).',
          },
          {
            title: '3. A IA contextualiza',
            description: 'A IA consulta a base de conhecimento (pgvector) e sugere o procedimento de limpeza, anexando o histórico do sensor e o inventário de discos.',
          },
          {
            title: '4. O técnico age',
            description: 'No chamado, o técnico abre o terminal remoto e executa o script de limpeza da biblioteca. O script grava o espaço liberado em um campo personalizado coletor.',
          },
          {
            title: '5. O ciclo fecha sozinho',
            description: 'Na coleta seguinte o sensor volta a Passing, o evento de resolução é gravado e o chamado é movido para o estado final. O CSAT é enviado ao colaborador.',
          },
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Um só banco de contexto',
        text: 'Como inventário, sensores, chamados e automações vivem no mesmo servidor, cada ação humana tem o contexto técnico ao lado. É isso que separa um RMM com ITSM acoplado de duas ferramentas coladas por integração.',
      },
    ],
  },
  {
    id: 'endpoint-lifecycle',
    part: 'operation',
    navLabel: '2.15. Ciclo de vida do endpoint',
    badge: 'Parte 2 · Capítulo 15 · Ciclo de vida',
    title: 'Ciclo de vida: aprovar, mover, energizar, notificar e remover endpoints',
    lead: 'Depois que o agente entra, a operação real envolve aprovar zero-touch, transferir entre clientes/sites, ligar e desligar, coletar sob demanda e remover com segurança — sem deixar máquina fantasma.',
    blocks: [
      {
        type: 'paragraphs',
        items: [
          'O Console expõe um conjunto de operações de ciclo de vida além do simples "reiniciar": aprovação de provisionamento zero-touch, energia avançada (incluindo reinício em BIOS/UEFI e Wake-on-LAN), transferência de agente entre escopos, coleta sob demanda de dados voláteis e um fluxo de remoção em duas etapas (lixeira → remoção definitiva) com desinstalação remota reenviável.',
          'O princípio é não perder rastro: nada é apagado direto. Primeiro o endpoint sai da listagem normal (lixeira), depois você decide restaurar ou remover de vez — e a desinstalação remota é um comando rastreável, com desfecho visível (enviado agora ou em fila).',
        ],
      },
      {
        type: 'table',
        caption: 'Operações de ciclo de vida no Console',
        headers: ['Operação', 'O que faz', 'Quando usar'],
        rows: [
          ['Aprovar zero-touch', 'Libera um endpoint que se registrou em provisionamento automático e está aguardando aprovação', 'Rollout controlado: o agent instala, mas só entra na frota depois do seu aval'],
          ['Reiniciar / Desligar', 'Ação de energia imediata ou agendada no endpoint', 'Manutenção rápida com o usuário avisado'],
          ['Reiniciar em BIOS/UEFI (restart-firmware)', 'Verbo de energia que reinicia o equipamento na firmware — exige boot UEFI', 'Trocar configuração de BIOS, atualizar firmware, ajustar virtualização'],
          ['Wake-on-LAN', 'Liga a máquina por pacote mágico na LAN', 'Manutenção em máquinas desligadas dentro da mesma rede'],
          ['Transferir agente', 'Move o endpoint para outro Cliente/Site (individual ou em lote, com validação prévia)', 'Mudança de contrato, realocação de equipamento, correção de provisionamento'],
          ['Coleta sob demanda', 'Atualiza na hora portas em escuta, conexões abertas, software, impressoras e hardware', 'Diagnóstico pontual sem esperar o ciclo de inventário'],
          ['Notificar usuário', 'Envia aviso Toast (fecha sozinho) ou Modal (exige interação) para a tela do endpoint', 'Comunicar manutenção, pedir para salvar trabalho ou confirmar algo'],
          ['Remover agente', 'Fluxo em duas etapas: lixeira (restaurável) e remoção definitiva', 'Descomissionar máquina vendida, devolvida ou substituída'],
        ],
      },
      {
        type: 'steps',
        title: 'Fluxo seguro de remoção de um endpoint',
        items: [
          {
            title: '1. Coloque na lixeira',
            description: 'A exclusão normal tira o agente da listagem, mas preserva o registro. A máquina continua instalada e pode ser restaurada a qualquer momento.',
            route: 'Agentes → ação Excluir (/agents)',
          },
          {
            title: '2. Desinstale remotamente (decommission)',
            description: 'O comando de descomissionamento faz o serviço SYSTEM localizar o desinstalador NSIS e executá-lo elevado, removendo o agent da máquina. O pedido fica persistido no endpoint por 30 dias, então uma reentrega não duplica a ação.',
            route: 'Agentes → Lixeira → Reenviar desinstalação',
          },
          {
            title: '3. Confirme o desfecho',
            description: 'A resposta distingue "enviado agora" (publicado no transporte) de "em fila" (agente sem conexão; será entregue quando reconectar). Tratar os dois como sucesso prometeria uma desinstalação que talvez não aconteça.',
          },
          {
            title: '4. Restaure se foi engano',
            description: 'Se a máquina voltar para a operação, restaure o agente: ele retorna à listagem normal com o mesmo histórico, sensores, campos e labels.',
            route: 'Agentes → Lixeira → Restaurar',
          },
          {
            title: '5. Remova em definitivo só no fim',
            description: 'A remoção definitiva (hard delete) é irreversível. Quando o agente tem chamados vinculados, é preciso confirmar a força: o histórico de atendimento é preservado, apenas sem o vínculo com o equipamento.',
            route: 'Agentes → Lixeira → Remover definitivamente',
          },
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Reentrega de desinstalação tem dois desfechos possíveis',
        text: 'Use o reenvio sempre que o primeiro comando não chegou (agente offline no momento da exclusão ou NATS indisponível) e a máquina continuar com o agent instalado. Só considere a desinstalação concluída quando o endpoint parar de enviar heartbeat.',
      },
      {
        type: 'table',
        caption: 'Lixeira x remoção definitiva',
        headers: ['Ação', 'Reversível?', 'O que acontece'],
        rows: [
          ['Excluir (lixeira)', 'Sim', 'Sai da listagem normal; inventário, sensores e histórico permanecem'],
          ['Restaurar', 'Sim', 'Volta para a frota ativa no mesmo Cliente/Site'],
          ['Remover definitivamente', 'Não', 'Apaga o registro do agente e seus dados de runtime'],
          ['Remover com força', 'Não', 'Permitido mesmo com chamados vinculados; o histórico fica sem vínculo com a máquina'],
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Máquina formatada e agente órfão',
        text: 'Se o Windows foi reinstalado, instale o agent com zero-touch: em máquinas com TPM 2.0 a reassociação por EK + SMBIOS UUID devolve o vínculo ao registro existente, em vez de criar um endpoint duplicado. Se o registro antigo já está na lixeira, restaure-o antes de provisionar novamente.',
      },
    ],
  },
  {
    id: 'governance-admin',
    part: 'operation',
    navLabel: '2.16. Governança e administração',
    badge: 'Parte 2 · Capítulo 16 · Governança',
    title: 'Governança: tokens de API, auditoria à prova de adulteração e processamento em segundo plano',
    lead: 'Recursos administrativos que sustentam integrações, conformidade e desempenho do servidor — e que quase sempre ficam invisíveis na operação diária.',
    blocks: [
      {
        type: 'paragraphs',
        items: [
          'Integrações externas não devem usar a senha de um técnico. Para isso existem os Tokens de API: credenciais de máquina vinculadas a um usuário e sujeitas às permissões dele, com prefixo público, segredo e revogação.',
          'Do lado de conformidade, as tabelas de auditoria usam uma cadeia de hash encadeada (prev_hash → entry_hash), ou seja, alterar uma linha antiga quebra a prova. E do lado de desempenho, os ciclos de métricas por atendente e de triagem de chamados por IA rodam em segundo plano, em lotes e com cota por cliente, em vez de calcular tudo dentro da requisição.',
        ],
      },
      {
        type: 'table',
        caption: 'Recursos de governança e onde ficam',
        headers: ['Recurso', 'Onde', 'Para que serve'],
        rows: [
          ['Tokens de API', 'API: /api/v1/api-tokens (sem tela dedicada)', 'Autenticar integrações e automações externas com credencial de máquina'],
          ['Trilha de auditoria encadeada', '/settings/audit e /logs', 'Provar que o registro de auditoria não foi editado depois'],
          ['Auditoria de configuração', '/settings/audit', 'Ver quem mudou cada parâmetro, quando e em qual escopo'],
          ['Atividade do usuário', '/identity/access (modal de atividade)', 'Investigar o que um usuário fez e quando'],
          ['Processamento em segundo plano', 'Configurações do Servidor e do Cliente', 'Ajustar ciclos de métricas e triagem de IA, com herança'],
          ['Sanitização de banco', '/settings/database-maintenance', 'Corrigir inconsistências que impedem a operação, com checagem prévia'],
          ['Sanitização de object storage', '/settings/database-maintenance', 'Encontrar e limpar objetos órfãos ou divergentes do banco'],
          ['Custos e limites de IA', '/settings/ai-cost', 'Acompanhar gasto por modelo e conter orçamento'],
        ],
      },
      {
        type: 'code',
        title: 'Usando um Token de API (formato recomendado)',
        language: 'bash',
        snippet: `# Crie o token em /api/v1/api-tokens e guarde o par (prefixo público + segredo).
# As duas cabeçalhos são obrigatórios; o token herda as permissões do usuário dono.
curl -sS https://rmm.empresa.com/api/v1/clients \\
  -H "X-Api-Key: tok_publico_exemplo" \\
  -H "X-Api-Secret: segredo_exemplo_nao_commitar"

# O token pode ser revogado sem afetar a senha do usuário que o criou.
# Sem os cabeçalhos, a API responde 401 com a mensagem esperada:
# "Missing API key headers. Expected X-Api-Key and X-Api-Secret."`,
      },
      {
        type: 'table',
        caption: 'Processamento em segundo plano: parâmetros que você pode ajustar',
        headers: ['Ciclo', 'Parâmetro', 'Padrão'],
        rows: [
          ['Métricas por atendente', 'Enabled', 'true'],
          ['Métricas por atendente', 'IntervalMinutes', '15 (piso 10)'],
          ['Métricas por atendente', 'StaleThresholdMinutes / WindowDays', '15 / 90'],
          ['Métricas por atendente', 'BatchSize / MaxBatchesPerRun / MaxRunSeconds', '200 / 4 / 120'],
          ['Triagem de chamados (IA)', 'Enabled / EnqueueOnCreate', 'true / true (fila na abertura)'],
          ['Triagem de chamados (IA)', 'IntervalSeconds', '20 (piso 10)'],
          ['Triagem de chamados (IA)', 'BatchSize / MaxPerClientPerRun', '25 / 10 (cota por cliente)'],
          ['Triagem de chamados (IA)', 'MaxAttempts / RetryAfterMinutes', '3 / 5'],
        ],
      },
      {
        type: 'steps',
        title: 'Rotina mensal de governança',
        items: [
          {
            title: '1. Revise tokens de API',
            description: 'Liste os tokens, confirme quem criou, qual escopo usa e revogue o que não é mais necessário.',
            route: 'API: GET /api/v1/api-tokens',
          },
          {
            title: '2. Valide a auditoria',
            description: 'Percorra /settings/audit por período e confira as mudanças de configuração relevantes. Entradas antigas fora da cadeia de hash não fazem parte da prova — o que importa é a cadeia das entradas atuais.',
            route: 'Configurações → Auditoria (/settings/audit)',
          },
          {
            title: '3. Ajuste os ciclos de segundo plano',
            description: 'Se as métricas por atendente demorarem a atualizar, reduza IntervalMinutes ou aumente MaxBatchesPerRun; se a triagem de IA consumir demais, reduza BatchSize ou MaxPerClientPerRun.',
            route: 'Configurações → Servidor e → Cliente',
          },
          {
            title: '4. Rode as checagens de sanitização',
            description: 'Execute primeiro as checagens (banco e object storage) para ver o relatório; só depois aplique a sanitização. Registros inconsistentes podem bloquear listagens e relatórios.',
            route: 'Configurações → Manutenção do banco (/settings/database-maintenance)',
          },
          {
            title: '5. Confira custos e limites de IA',
            description: 'Acompanhe o consumo por modelo e ajuste orçamento/limites antes que o custo saia da curva.',
            route: 'Configurações → Custos de IA (/settings/ai-cost)',
          },
        ],
      },
      {
        type: 'accordion',
        title: 'Orçamento de IA na prática',
        items: [
          {
            summary: 'Orçamento de tokens por requisição, modelo e departamento',
            paragraphs: [
              'Cada chamada de IA recebe um orçamento calculado no servidor: o valor pedido é limitado ao máximo de tokens por requisição, respeitando um piso mínimo e um teto de saída, e ainda um teto específico do departamento. Quando o modelo configurado não é adequado, o resolvedor aplica o modelo de fallback do escopo.',
              'Os números de referência: 1.200 tokens de saída por departamento (mínimo de 200), estimativa de 3,5 caracteres por token, margem de segurança de 0,85 no prompt, uso de até 90% do contexto do modelo e 8.000 caracteres de prompt quando o contexto do modelo é desconhecido.',
            ],
          },
          {
            summary: 'Quando o orçamento estoura',
            paragraphs: [
              'Rate limit ou orçamento diário atingido não é falha do provedor: a triagem degrada para o fallback determinístico e registra o motivo como ai_budget_exceeded na decisão de atribuição.',
              'O efeito é auditar depois por que a IA não decidiu, em vez de descobrir por acaso que os chamados pararam de ser classificados.',
            ],
            route: '/settings/ai-cost · decisão de atribuição do chamado',
          },
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Sanitização só depois da checagem',
        text: 'A tela sempre oferece a checagem antes da execução. Rodar a sanitização sem ler o relatório pode remover dados que você ainda precisava investigar — trate a execução como uma operação de manutenção, com janela e backup do dia.',
      },
    ],
  },
  {
    id: 'ticket-access',
    part: 'operation',
    navLabel: '2.17. Permissão de chamados por departamento',
    badge: 'Parte 2 · Capítulo 17 · Visibilidade',
    title: 'Quem vê e quem trata cada chamado: o modelo por departamento',
    lead: 'Ver um chamado e tratá-lo são decisões diferentes. A política cruza ACL de Cliente/Site com o time do departamento do chamado — e tem um modo sombra para você medir antes de bloquear.',
    blocks: [
      {
        type: 'paragraphs',
        items: [
          'As regras são avaliadas nesta ordem: (1) quem tem acesso global a Chamados passa por tudo; (2) VER depende da ACL de Cliente/Site (comportamento legado, preservado); (3) TRATAR exige ser membro ativo do time do departamento do chamado; (4) FECHAR exige poder tratar, ou ser o solicitante quando o destino é um estado final.',
          'O departamento do chamado é resolvido com herança de um salto a partir do departamento GLOBAL pai, pelo mesmo resolvedor usado no restante da plataforma. Chamados sem departamento são tratados como "sem time": apenas quem tem acesso global consegue tratá-los.',
        ],
      },
      {
        type: 'table',
        caption: 'Regras de acesso na ordem de avaliação',
        headers: ['#', 'Regra', 'Efeito'],
        rows: [
          ['1', 'Acesso global a Chamados', 'Permite ver, tratar e fechar qualquer chamado (não regride o comportamento anterior)'],
          ['2', 'ACL de Cliente/Site (VER)', 'Define quem enxerga o chamado no escopo do cliente ou da unidade'],
          ['3', 'Time do departamento (TRATAR)', 'Só membro ativo do time do departamento trata o chamado (com herança do departamento pai)'],
          ['4', 'Solicitante em estado final (FECHAR)', 'Quem abriu o chamado pode fechá-lo se o destino for um estado final'],
          ['—', 'Chamado sem departamento', 'Sem time: apenas acesso global consegue tratar'],
        ],
      },
      {
        type: 'table',
        caption: 'Códigos de recusa e o que eles significam',
        headers: ['Código', 'Significado', 'O que fazer'],
        rows: [
          ['TICKET_NOT_IN_YOUR_TEAM', 'Você não é membro ativo do time do departamento do chamado', 'Inclua o técnico no time do departamento (ou use um perfil com acesso global)'],
          ['TICKET_HAS_NO_DEPARTMENT', 'O chamado não tem departamento definido', 'Defina o departamento na abertura/triagem ou trate com acesso global'],
          ['CANNOT_CLOSE_OTHERS_TICKET', 'Você não pode fechar chamado de outra pessoa', 'Trate o chamado ou peça ao solicitante/ao time para fechar'],
          ['TICKET_OUT_OF_SCOPE', 'O chamado está fora do seu escopo de Cliente/Site', 'Confira o escopo do seu papel'],
          ['NO_MACHINE_EXECUTE_PERMISSION', 'Sem permissão para executar ações na máquina vinculada', 'Ajuste o papel IAM do técnico'],
          ['DEPARTMENT_CANNOT_EXECUTE_ON_MACHINES', 'O departamento não pode executar ações em máquinas', 'Use um departamento/perfil autorizado a atuar no endpoint'],
        ],
      },
      {
        type: 'steps',
        title: 'Ativando a política com segurança (modo sombra)',
        items: [
          {
            title: '1. Popule os times dos departamentos',
            description: 'Crie os departamentos e adicione os técnicos que realmente atuam em cada um. Sem isso, "tratar" fica restrito a quem tem acesso global.',
            route: '/tickets/departments',
          },
          {
            title: '2. Ligue o modo sombra',
            description: 'Em modo sombra a decisão é registrada, mas o acesso é concedido. É a fase de medição: você vê no log quem seria barrado sem travar o atendimento.',
            route: 'Configuração do servidor (Tickets:DepartmentAuth:ShadowMode)',
          },
          {
            title: '3. Meça e ajuste',
            description: 'Acompanhe as recusas registradas e corrija times/escopos antes de exigir a política de verdade.',
          },
          {
            title: '4. Saia do modo sombra',
            description: 'Com os times populados e as recusas explicadas, a política passa a bloquear de fato. O chat e as ações na máquina usam a mesma decisão (o guard do chat não reimplementa a regra).',
            route: '/tickets · janelas de chat',
          },
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Precedência da configuração',
        text: 'O modo sombra é lido da configuração do servidor no banco; o valor em appsettings (Tickets:DepartmentAuth:ShadowMode) é apenas o fallback enquanto essa leitura não aconteceu. Em dúvida, confie no banco.',
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Uma regra só, três portas',
        text: 'A mesma política decide lista, detalhe, chat e ações na máquina. O guard do chat é apenas a porta booleana: ele mapeia Ver/Excluir para "pode ver" e Editar/Executar para "pode tratar" — evitando duas implementações que divergem com o tempo.',
      },
    ],
  },
  {
    id: 'platform-reliability',
    part: 'operation',
    navLabel: '2.18. Confiabilidade e internos',
    badge: 'Parte 2 · Capítulo 18 · Confiabilidade',
    title: 'Confiabilidade: comandos, filas, P2P e limites da plataforma',
    lead: 'Por que às vezes um comando demora, por que uma ação aparece como não entregue e por que a coleta tem tetos — sem isso, o comportamento parece aleatório.',
    blocks: [
      {
        type: 'paragraphs',
        items: [
          'O caminho de um comando é durável de ponta a ponta: o servidor publica, o agente executa e o resultado volta por um outbox persistente. Se a rede cair no meio, o resultado não se perde — ele fica na fila local e é reenviado quando a conexão volta.',
          'Do lado do agente existe dedupe de comandos: a mesma ordem recebida duas vezes (reentrega do transporte, reconexão) não executa de novo. Cada entrada vive 24 horas e o registro guarda até 500 entradas, com folga para rajadas.',
        ],
      },
      {
        type: 'table',
        caption: 'Mecanismos que sustentam a operação',
        headers: ['Mecanismo', 'O que garante', 'Onde você percebe'],
        rows: [
          ['Outbox de resultado de comando', 'Resultado de execução sobrevive a queda de rede e reinício do agente', 'O resultado aparece no histórico mesmo depois de um período offline'],
          ['Dedupe de comandos (24h, 500 entradas)', 'A mesma ordem não executa duas vezes', 'Nenhuma instalação/ação repetida após reconexão'],
          ['Política de reentrega', 'Reenvio só quando faz sentido; convite de chat sem sessão válida é bloqueado', 'Comandos repetidos não geram efeitos duplicados'],
          ['Encerramento por retenção', 'Comando antigo com agente offline vira Timeout em vez de ficar eterno', 'Status "não entregue: agente offline além da retenção"'],
          ['Runtime stale → HTTP 503', 'Estado de runtime vencido retorna erro de domínio, não 500 genérico', 'Erro claro (RuntimeStale) quando cache/runtime está desatualizado'],
          ['Lock de P2P no Redis', 'Um agente baixa o artefato por vez, com fallback se o Redis cair', 'Sem download duplicado do mesmo pacote no site'],
          ['Outbox de telemetria P2P', 'Métricas de P2P não se perdem quando o link oscila', 'Painel de P2P deixa de ter buracos'],
        ],
      },
      {
        type: 'steps',
        title: 'O que fazer quando um comando "não chegou"',
        items: [
          {
            title: '1. Confira o histórico do comando',
            description: 'O desfecho real (publicado, entregue, executado, falhou ou expirou por retenção) está no histórico do comando — não no toast da interface.',
            route: 'Agentes → histórico do comando · Operações (/automation/operations)',
          },
          {
            title: '2. Verifique se o agente está online',
            description: 'Agente offline significa comando em fila: ele será entregue na reconexão. Se ficou offline além da retenção, o comando é encerrado como Timeout.',
            route: '/agents',
          },
          {
            title: '3. Reenvie quando o comando tem reentrega permitida',
            description: 'Ações de energia e desinstalação têm tratamento específico de reentrega. Convites de chat sem sessão válida são bloqueados de propósito — reabra o convite pela tela.',
          },
          {
            title: '4. Se o erro é de runtime, trate a causa',
            description: 'Erros RuntimeStale indicam estado vencido (por exemplo presença/cache). Aguarde o ciclo de sincronização ou force um sync antes de insistir na ação.',
            route: '/agents → Sincronizar agora',
          },
        ],
      },
      {
        type: 'table',
        caption: 'Limites de coleta e o que eles afetam',
        headers: ['Limite', 'Valor', 'Impacto prático'],
        rows: [
          ['Portas em escuta por agente', '200', 'Lista paginada; o restante não é enviado — priorize ao investigar'],
          ['Conexões abertas por agente', '5.000', 'Snapshot limitado; use a coleta sob demanda no momento do diagnóstico'],
          ['Coleta sob demanda (refresh)', 'Consome banda/CPU do endpoint', 'Use pontualmente, não como rotina'],
        ],
      },
      {
        type: 'accordion',
        title: 'Observabilidade e P2P: o que existe por baixo',
        items: [
          {
            summary: 'Status dos serviços de segundo plano',
            paragraphs: [
              'Além de configurar os jobs, o servidor expõe o estado de cada serviço de segundo plano pela API administrativa (/api/v1/admin/background-services): nome, nome de exibição, descrição, grupo e nome do job, status, se está executando, se está habilitado, último início, próxima execução e último erro.',
              'É a fonte de verdade para responder perguntas como \"o ciclo está habilitado?\", \"quando roda de novo?\" e \"falhou na última execução?\" — em vez de inferir pelo comportamento da tela.',
            ],
            route: 'API: GET /api/v1/admin/background-services (e /{nome})',
          },
          {
            summary: 'Bootstrap e pré-carga do P2P',
            paragraphs: [
              'Um nó novo entra na malha pelo onboarding (/p2p/config/onboard): o agent obtém credenciais com chave de implantação de 30 minutos, tenta quantas vezes precisar enquanto não tiver credencial (uma tentativa por vez, com 40 s de orçamento) e recheca os pares a cada 60 s.',
              'A pré-carga (comando p2ppreload e PreloadPackages do policy-sync) faz TODOS os agentes do escopo receberem o pedido, mas só o de MAIOR SCORE baixa primeiro: cada um espera um atraso proporcional à sua posição no score local (máquina com mais CPU/RAM livre espera menos). Uma trava em memória impede que o mesmo pacote seja pré-carregado duas vezes por caminhos diferentes.',
            ],
            route: 'API P2P /p2p/config/onboard · comando p2ppreload',
          },
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Jobs de segundo plano do servidor',
        text: 'Além dos ciclos de métricas e triagem, o servidor tem jobs periódicos controlados por configuração (BackgroundJobs). Eles vêm desabilitados por padrão e o intervalo é escolhido em dias (1, 5, 10, 15 ou 30) — se o job estiver desabilitado, ele sequer é registrado no agendador.',
      },
    ],
  },
];
