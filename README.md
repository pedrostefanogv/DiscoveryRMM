# DiscoveryRMM

Landing page oficial do projeto DiscoveryRMM, desenvolvida em React + TypeScript + Vite e publicada no GitHub Pages.

O DiscoveryRMM é um projeto open source de Remote Monitoring & Management voltado para operações de TI, com foco em inventário de endpoints Windows, automação, observabilidade, acesso remoto (tela WebP/JPEG, ConPTY, arquivos binários, proxy LAN HTTP/TCP e RDP/WebRDP), atendimento com IA e mensageria NATS/JetStream + REST/SSE.

## Sobre o projeto

Esta aplicação apresenta o produto DiscoveryRMM de forma institucional e técnica, reunindo:

- proposta de valor do projeto
- funcionalidades principais
- vitrine visual (`Showcase`) com capturas reais do Console Web e do Agent Windows
- visão de arquitetura e stack tecnológica (.NET 10, PostgreSQL, NATS JetStream, Go/Wails v3, React 19)
- canais de release e orientações iniciais de instalação (Linux Server)
- páginas legais bilíngues (`#/privacy` — LGPD e `#/terms` — Termos de Uso)
- links para o servidor principal, agente e documentação

## O que existe neste repositório

Este repositório contém o frontend estático da landing page. O produto principal está distribuído em outros repositórios do ecossistema DiscoveryRMM.

Links úteis:

- Servidor/API: https://github.com/pedrostefanogv/DiscoveryRMM_API
- Agent Windows: https://github.com/pedrostefanogv/DiscoveryRMM_Agent/releases
- Guia de configuração: https://github.com/pedrostefanogv/DiscoveryRMM_API/blob/release/docs/CONFIGURATION.md

## Stack utilizada

- React 19
- TypeScript 7 (`noUnusedLocals` e `noUnusedParameters` habilitados)
- Vite 8 (com `@vitejs/plugin-react`)
- CSS modular por componente (sem framework de UI)
- i18n próprio em `src/i18n.tsx` (PT-BR / EN-US) e roteamento por hash em `src/hooks/useHashRoute.ts`

## Seções da landing page

- Hero com posicionamento do projeto, terminal do bootstrap Linux e aviso de status
- Grade com 12 módulos/capacidades do ecossistema
- Showcase interativo com abas (`role="tablist"`), capturas reais em `public/screenshots/` e lightbox modal nativo (`<dialog>`)
- Seção de arquitetura com fluxo em quatro camadas, stack tecnológica e canais de release
- Quickstart com o one-liner Linux, canais/atualização e pré-requisitos do host
- Seção explicativa do fluxo operacional
- Bloco de estatísticas, CTA final e rodapé com links para Política de Privacidade (LGPD) e Termos de Uso

Toda a página é bilíngue (PT-BR / EN-US), com detecção do idioma do navegador, troca manual pelo
navbar (com bandeiras SVG inline) e persistência da escolha em `localStorage`. O título e a meta description do documento são
atualizados junto com o idioma e a rota ativa.

## Estrutura do projeto

```text
.
├── .github/workflows
│   ├── ci.yml            <- verificação de PRs (tsc --noEmit, npm test e npm run build)
│   └── deploy.yml        <- publicação automática no GitHub Pages
├── LICENSE               <- licença MIT
├── index.html            <- SEO, Open Graph (1200x630), hreflang e JSON-LD
├── package.json
├── vite.config.ts
├── tsconfig.json
├── public
│   ├── apple-touch-icon.png
│   ├── favicon-32x32.png
│   ├── og-image.png      <- card Open Graph 1200x630
│   ├── robots.txt
│   ├── sitemap.xml
│   └── screenshots       <- capturas reais (1280x800) do Console Web e Agent Windows
├── tests
│   └── e2e               <- suíte E2E (helpers.ts + Tiers 1–4 para landing F24 e contratos F25)
└── src
    ├── App.tsx
    ├── App.css
    ├── i18n.tsx          <- conteúdo PT-BR / EN-US + provider de idioma
    ├── index.tsx
    ├── vite-env.d.ts
    ├── hooks
    │   └── useHashRoute.ts
    └── components
        ├── Architecture
        ├── CTABanner
        ├── Features
        ├── Footer
        ├── Hero
        ├── HowItWorks
        ├── LegalPage
        ├── Navbar
        ├── Quickstart
        ├── Showcase
        └── Stats
```

## Como executar localmente

### Pré-requisitos

- Node.js 22+ (`22.6+` para `--experimental-strip-types` ou `22.18+` para execução nativa sem flag nos testes TypeScript via `node --test`, compatível com Vite 8)
- npm 10 ou superior

### Instalar dependências

```bash
npm install
```

### Rodar em desenvolvimento

```bash
npm run dev
```

### Executar testes

```bash
npm test
```

### Gerar build de produção

```bash
npm run build
```

### Visualizar build localmente

```bash
npm run preview
```

## Scripts disponíveis

- `npm run dev`: inicia o servidor de desenvolvimento com Vite
- `npm run build`: compila TypeScript e gera a pasta `dist`
- `npm run preview`: sobe a build gerada localmente para validação
- `npm test`: executa a suíte E2E standalone da landing page (`^F24-` em `tests/e2e/`) com `node --experimental-strip-types --test`
- `npm run test:e2e`: executa todos os 6 arquivos da suíte E2E em `tests/e2e/` (F24 + validações cross-repo F25 no workspace completo)

## Publicação e CI

- O workflow `.github/workflows/ci.yml` executa `npm ci`, `npx tsc --noEmit`, `npm test` e `npm run build` em pull requests para `main` e pushes em outras branches.
- O workflow `.github/workflows/deploy.yml` publica automaticamente o conteúdo da pasta `dist` no GitHub Pages a cada push na branch `main` (Node 22).

Este projeto usa o base path `/DiscoveryRMM/` em [vite.config.ts](vite.config.ts), o que é importante para funcionar corretamente no GitHub Pages.

## Observações

- A pasta `dist` contém a build gerada para publicação.
- O layout foi organizado em componentes independentes para facilitar manutenção e evolução da landing page.
- O conteudo textual fica centralizado em `src/i18n.tsx`; ao adicionar um item em `text.features.items`, adicione também um visual correspondente em `src/components/Features/Features.tsx`.
- As fontes (Inter / JetBrains Mono) são carregadas por `<link>` no `index.html` com `preconnect`, evitando `@import` bloqueante no CSS.
- Meta tags de SEO/Open Graph, JSON-LD (`WebSite` + `SoftwareApplication`) e o `<noscript>` ficam no `index.html`.
- O conteúdo do site reflete o estado atual do ecossistema DiscoveryRMM e pode evoluir junto com o projeto principal.

## Licença

Distribuído sob a licença [MIT](LICENSE).
