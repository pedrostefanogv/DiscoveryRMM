# DiscoveryRMM

Landing page oficial do projeto DiscoveryRMM, desenvolvida em React + TypeScript + Vite e publicada no GitHub Pages.

O DiscoveryRMM e um projeto open source de Remote Monitoring & Management voltado para operacoes de TI, com foco em inventario, automacao, observabilidade, atendimento com IA e gerenciamento remoto de endpoints.

## Sobre o projeto

Esta aplicacao apresenta o produto DiscoveryRMM de forma institucional e tecnica, reunindo:

- proposta de valor do projeto
- funcionalidades principais
- visao de arquitetura
- stack tecnologica
- canais de release
- orientacoes iniciais de instalacao
- links para o servidor principal, agente e documentacao

## O que existe neste repositorio

Este repositorio contem o frontend estatico da landing page. O produto principal esta distribuido em outros repositorios do ecossistema DiscoveryRMM.

Links uteis:

- Servidor/API: https://github.com/pedrostefanogv/DiscoveryRMM_API
- Agent Windows: https://github.com/pedrostefanogv/DiscoveryRMM_Agent/releases
- Guia de configuracao: https://github.com/pedrostefanogv/DiscoveryRMM_API/blob/release/CONFIGURATION.md

## Stack utilizada

- React 18
- TypeScript
- Vite
- CSS modular por componente

## Secoes da landing page

- Hero com posicionamento do projeto e chamadas principais
- Grade de funcionalidades com modulos e capacidades do ecossistema
- Secao de arquitetura com fluxo, stack e canais de release
- Quickstart com onboarding inicial e requisitos do servidor
- Secao explicativa do fluxo operacional
- Bloco de estatisticas e CTA final

## Estrutura do projeto

```text
.
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── src
    ├── App.tsx
    ├── App.css
    ├── index.tsx
    ├── vite-env.d.ts
    ├── components
    │   ├── Architecture
    │   ├── CTABanner
    │   ├── Features
    │   ├── Footer
    │   ├── Hero
    │   ├── HowItWorks
    │   ├── Navbar
    │   ├── Quickstart
    │   └── Stats
    └── utils
        └── persistence.ts
```

## Como executar localmente

### Pre-requisitos

- Node.js 20 ou superior
- npm

### Instalar dependencias

```bash
npm install
```

### Rodar em desenvolvimento

```bash
npm run dev
```

### Gerar build de producao

```bash
npm run build
```

### Visualizar build localmente

```bash
npm run preview
```

## Scripts disponiveis

- `npm run dev`: inicia o servidor de desenvolvimento com Vite
- `npm run build`: compila TypeScript e gera a pasta `dist`
- `npm run preview`: sobe a build gerada localmente para validacao

## Publicacao

O deploy e feito automaticamente via GitHub Actions sempre que ha push na branch `main`.

Fluxo atual:

1. instala dependencias com `npm ci`
2. executa `npm run build`
3. publica o conteudo da pasta `dist` no GitHub Pages

Este projeto usa o base path `/DiscoveryRMM/` em [vite.config.ts](vite.config.ts), o que e importante para funcionar corretamente no GitHub Pages.

## Observacoes

- A pasta `dist` contem a build gerada para publicacao.
- O layout foi organizado em componentes independentes para facilitar manutencao e evolucao da landing page.
- O conteudo do site reflete o estado atual do ecossistema DiscoveryRMM e pode evoluir junto com o projeto principal.

## Licenca

O site apresenta o DiscoveryRMM como projeto open source sob licenca MIT. Se desejar, vale manter o arquivo de licenca do repositorio alinhado com essa informacao.