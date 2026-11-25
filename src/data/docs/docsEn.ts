import type { DocPart, DocsContent, DocsUiCopy } from './types';
import { installEnSections } from './parts/install.en';
import { operationEnSections } from './parts/operation.en';
import { supportEnSections } from './parts/support.en';

export const docsEnParts: DocPart[] = [
  {
    id: 'install',
    label: 'Part 1 · Installation & Deployment',
    shortLabel: 'Installation',
    description: 'From the Linux server to a provisioned endpoint: requirements, console, client and site setup, custom fields, deploy, agent, zero-touch and minimal installer.',
  },
  {
    id: 'operation',
    label: 'Part 2 · Fleet Operations',
    shortLabel: 'Operations',
    description: 'The daily work of NOC and IT: fleet, automatic labels, remote access, scripts, automation, software, patches, sensors, alerts, reports and tickets.',
  },
  {
    id: 'support',
    label: 'Part 3 · Support & End User',
    shortLabel: 'Support',
    description: 'Service desk and end user: support chat, end-user guide, per-module configuration, troubleshooting and end-to-end guides.',
  },
];

const ui: DocsUiCopy = {
  portalBadge: 'Official Documentation · DiscoveryRMM Ecosystem',
  portalTitle: 'Guides & Reference',
  backToHome: 'Back to home',
  searchPlaceholder: 'Search chapter or topic...',
  searchLabel: 'Filter documentation chapters',
  searchEmpty: 'No chapters match your search.',
  mobileMenuSummary: 'Browse chapters',
  copyLabel: 'Copy code',
  copiedLabel: 'Copied',
  copyErrorLabel: 'Copy failed',
  previousLabel: 'Previous chapter',
  nextLabel: 'Next chapter',
  repoLinksTitle: 'Repositories & References',
  repoLinks: [
    { label: 'Server (DiscoveryRMM_API)', href: 'https://github.com/pedrostefanogv/DiscoveryRMM_API' },
    { label: 'Windows Agent (Releases)', href: 'https://github.com/pedrostefanogv/DiscoveryRMM_Agent/releases' },
    {
      label: 'Configuration Guide (API)',
      href: 'https://github.com/pedrostefanogv/DiscoveryRMM_API/blob/release/docs/CONFIGURATION.md',
    },
  ],
};

export const docsEn: DocsContent = {
  ui,
  parts: docsEnParts,
  sections: [...installEnSections, ...operationEnSections, ...supportEnSections],
};
