import { useEffect, useState } from 'react';

export type LegalRoute = 'privacy' | 'terms';
export type ActiveRoute = 'home' | LegalRoute | 'docs';

/**
 * Capítulos da documentação, agrupados em 3 partes:
 *  - install   → Instalação e Implantação
 *  - operation → Operação do Parque
 *  - support   → Suporte e Usuário Final
 */
export type DocSectionId =
  // Parte 1 · Instalação e Implantação
  | 'overview'
  | 'requirements'
  | 'server-install'
  | 'server-maintenance'
  | 'console-access'
  | 'client-setup'
  | 'site-setup'
  | 'custom-fields'
  | 'deploy-tokens'
  | 'agent-install'
  | 'zero-touch'
  | 'agent'
  // Parte 2 · Operação do Parque
  | 'interface'
  | 'agents-fleet'
  | 'agent-labels'
  | 'remote-access'
  | 'automation-scripts'
  | 'automation-tasks'
  | 'software-store'
  | 'patches'
  | 'sensors'
  | 'sensor-script'
  | 'monitoring-reports'
  | 'tickets'
  | 'knowledge-ai'
  | 'integrations'
  | 'endpoint-lifecycle'
  | 'governance-admin'
  | 'ticket-access'
  | 'platform-reliability'
  // Parte 3 · Suporte e Usuário Final
  | 'support-chat'
  | 'enduser-agent'
  | 'module-config'
  | 'troubleshooting'
  | 'guides';

export const DOC_SECTION_IDS: readonly DocSectionId[] = [
  'overview',
  'requirements',
  'server-install',
  'server-maintenance',
  'console-access',
  'client-setup',
  'site-setup',
  'custom-fields',
  'deploy-tokens',
  'agent-install',
  'zero-touch',
  'agent',
  'interface',
  'agents-fleet',
  'agent-labels',
  'remote-access',
  'automation-scripts',
  'automation-tasks',
  'software-store',
  'patches',
  'sensors',
  'sensor-script',
  'monitoring-reports',
  'tickets',
  'knowledge-ai',
  'integrations',
  'endpoint-lifecycle',
  'governance-admin',
  'ticket-access',
  'platform-reliability',
  'support-chat',
  'enduser-agent',
  'module-config',
  'troubleshooting',
  'guides',
];

/**
 * Ids antigos (links externos, favoritos e versões anteriores da documentação).
 * São redirecionados para o capítulo equivalente na estrutura em 3 partes, para
 * que nenhum endereço publicado passe a abrir a documentação no lugar errado.
 */
const DOC_SECTION_LEGACY_IDS: Record<string, DocSectionId> = {
  'clients-deploy': 'client-setup',
  'automation-software': 'automation-tasks',
  'sensors-monitoring': 'sensors',
  'servicedesk-kb': 'tickets',
  'modules': 'module-config',
  'agent-install-minimal': 'agent-install',
  'fleet': 'agents-fleet',
  'sensors-script': 'sensor-script',
  'reports': 'monitoring-reports',
};

export type HashLocation = {
  route: ActiveRoute;
  docSection: DocSectionId;
};

const DOC_SECTION_SET = new Set<string>(DOC_SECTION_IDS);

export function parseHashLocation(hash: string): HashLocation {
  const normalized = hash.trim().toLowerCase().replace(/\/+$/, '');

  if (normalized === '#/privacy' || normalized === '#/privacidade') {
    return { route: 'privacy', docSection: 'overview' };
  }

  if (normalized === '#/terms' || normalized === '#/termos') {
    return { route: 'terms', docSection: 'overview' };
  }

  if (normalized === '#/docs' || normalized === '#/documentacao') {
    return { route: 'docs', docSection: 'overview' };
  }

  const docMatch = normalized.match(/^#\/(?:docs|documentacao)\/([a-z0-9-]+)$/);
  if (docMatch) {
    const candidate = docMatch[1];
    const resolved = DOC_SECTION_SET.has(candidate)
      ? (candidate as DocSectionId)
      : (DOC_SECTION_LEGACY_IDS[candidate] ?? 'overview');
    return { route: 'docs', docSection: resolved };
  }

  return { route: 'home', docSection: 'overview' };
}

export function parseHashRoute(hash: string): ActiveRoute {
  return parseHashLocation(hash).route;
}

export function useHashLocation(): HashLocation {
  const [location, setLocation] = useState<HashLocation>(() =>
    typeof window === 'undefined'
      ? { route: 'home', docSection: 'overview' }
      : parseHashLocation(window.location.hash),
  );

  useEffect(() => {
    const syncRoute = () => {
      const next = parseHashLocation(window.location.hash);
      setLocation(next);

      if (next.route !== 'home') {
        window.scrollTo({ top: 0, behavior: 'auto' });
      } else {
        const hash = window.location.hash;
        if (hash && !hash.startsWith('#/')) {
          const targetId = hash.slice(1);
          window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
              if (targetId === 'top') {
                window.scrollTo({ top: 0, behavior: 'auto' });
              } else {
                document.getElementById(targetId)?.scrollIntoView();
              }
            });
          });
        }
      }
    };

    window.addEventListener('hashchange', syncRoute);
    return () => window.removeEventListener('hashchange', syncRoute);
  }, []);

  return location;
}

export function useHashRoute(): ActiveRoute {
  return useHashLocation().route;
}
