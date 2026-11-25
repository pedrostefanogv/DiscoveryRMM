import type { DocSectionId } from '../../hooks/useHashRoute';

export type DocCalloutTone = 'info' | 'warning' | 'tip';

/** As três grandes partes da documentação. */
export type DocPartId = 'install' | 'operation' | 'support';

export type DocPart = {
  id: DocPartId;
  /** Rótulo longo usado na navegação lateral (ex.: "Parte 1 · Instalação & Implantação"). */
  label: string;
  /** Rótulo curto usado em resumos e no menu móvel. */
  shortLabel: string;
  /** Uma frase explicando o que o leitor encontra nesta parte. */
  description: string;
};

export type DocStep = {
  title: string;
  description: string;
  code?: string;
  route?: string;
};

export type DocCard = {
  title: string;
  badge?: string;
  description: string;
  meta?: string;
  href?: string;
};

export type DocAccordionItem = {
  summary: string;
  paragraphs: string[];
  code?: string;
  route?: string;
};

export type DocBlock =
  | { type: 'paragraphs'; items: string[] }
  | { type: 'callout'; tone: DocCalloutTone; title: string; text: string }
  | { type: 'code'; title: string; language: string; snippet: string }
  | { type: 'table'; caption: string; headers: string[]; rows: string[][] }
  | { type: 'cards'; title?: string; items: DocCard[] }
  | { type: 'steps'; title?: string; items: DocStep[] }
  | { type: 'accordion'; title?: string; items: DocAccordionItem[] }
  /** Imagem de produto: `file` é relativo a `screenshots/` no public/. */
  | { type: 'image'; file: string; alt: string; caption?: string };

export type DocSection = {
  id: DocSectionId;
  /** Parte à qual o capítulo pertence — define o agrupamento na navegação. */
  part: DocPartId;
  navLabel: string;
  badge: string;
  title: string;
  lead: string;
  blocks: DocBlock[];
};

export type DocsUiCopy = {
  portalBadge: string;
  portalTitle: string;
  backToHome: string;
  searchPlaceholder: string;
  searchLabel: string;
  searchEmpty: string;
  mobileMenuSummary: string;
  copyLabel: string;
  copiedLabel: string;
  copyErrorLabel: string;
  previousLabel: string;
  nextLabel: string;
  repoLinksTitle: string;
  repoLinks: { label: string; href: string }[];
};

export type DocsContent = {
  ui: DocsUiCopy;
  parts: DocPart[];
  sections: DocSection[];
};
