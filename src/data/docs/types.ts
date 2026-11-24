import type { DocSectionId } from '../../hooks/useHashRoute';

export type DocCalloutTone = 'info' | 'warning' | 'tip';

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
  | { type: 'accordion'; title?: string; items: DocAccordionItem[] };

export type DocSection = {
  id: DocSectionId;
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
  sections: DocSection[];
};
