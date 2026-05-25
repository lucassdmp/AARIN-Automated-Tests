# AARIN Automated Tests

Projeto de automação de testes E2E para a loja [EBAC Shop](http://lojaebac.ebaconline.art.br/), construído com [Playwright](https://playwright.dev/) e TypeScript.

## Stack

- [Playwright](https://playwright.dev/) 
- [TypeScript](https://www.typescriptlang.org/) 
- [Node.js](https://nodejs.org/)

## Pré-requisitos

- Node.js 24.15.0+
- npm 11.12.1+

## Instalação

```bash
# Instalar dependências
npm install

# Instalar dependências do Playwright
npx playwright install
```

## Executando os testes

```bash
# Rodar todos os testes (headless)
npm test

# Rodar com browser visível
npm run test:headed

# Rodar em modo UI interativo
npm run test:ui

# Rodar em modo debug
npm run test:debug
```

## Relatório

Após a execução, o relatório HTML é gerado em `reports/html/`.

```bash
# Abrir o relatório no browser
npm run report
```

## Configuração

As principais opções de execução ficam em `configs/environments.ts` e podem ser sobrescritas via variáveis de ambiente:

| Variável | Descrição | Padrão |
|---|---|---|
| `BASE_URL` | URL base da aplicação | `http://lojaebac.ebaconline.art.br` |
| `WORKERS` | Número de workers paralelos | `2` |
| `FULLY_PARALLEL` | Paralelismo total entre testes | `true` |

**Exemplo:**

```bash
$env:WORKERS=4; npm test
$env:FULLY_PARALLEL=false; npm test
```

