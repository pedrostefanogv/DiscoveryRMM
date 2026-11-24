import type { Language } from '../../i18n';
import { docsEn } from './docsEn';
import { docsPt } from './docsPt';
import type { DocsContent } from './types';

export type {
  DocAccordionItem,
  DocBlock,
  DocCalloutTone,
  DocCard,
  DocSection,
  DocStep,
  DocsContent,
  DocsUiCopy,
} from './types';

export function getDocsContent(language: Language): DocsContent {
  return language === 'en-US' ? docsEn : docsPt;
}
