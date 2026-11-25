import type { DocPart, DocsContent, DocsUiCopy } from './types';
import { installPtSections } from './parts/install.pt';
import { operationPtSections } from './parts/operation.pt';
import { supportPtSections } from './parts/support.pt';

export const docsPtParts: DocPart[] = [
  {
    id: 'install',
    label: 'Parte 1 · Instalação & Implantação',
    shortLabel: 'Instalação',
    description: 'Do servidor Linux ao endpoint provisionado: requisitos, console, cadastro de clientes e sites, campos personalizados, deploy, agent, zero-touch e instalador mínimo.',
  },
  {
    id: 'operation',
    label: 'Parte 2 · Operação do Parque',
    shortLabel: 'Operação',
    description: 'O dia a dia do NOC e da TI: frota, labels automáticas, acesso remoto, scripts, automações, software, patches, sensores, alertas, relatórios e chamados.',
  },
  {
    id: 'support',
    label: 'Parte 3 · Suporte & Usuário Final',
    shortLabel: 'Suporte',
    description: 'Atendimento e colaborador: chat de suporte, guia do usuário final, configuração por módulo, diagnóstico de problemas e guias ponta a ponta.',
  },
];

const ui: DocsUiCopy = {
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
};

export const docsPt: DocsContent = {
  ui,
  parts: docsPtParts,
  sections: [...installPtSections, ...operationPtSections, ...supportPtSections],
};
