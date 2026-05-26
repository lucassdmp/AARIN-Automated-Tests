# AARIN Automated Tests

Projeto de automação de testes E2E para a loja [EBAC Shop](http://lojaebac.ebaconline.art.br/), construído com Playwright e TypeScript seguindo arquitetura de Page Objects.

## Stack

| Tecnologia | Finalidade |
|---|---|
| [Playwright](https://playwright.dev/) | Automação E2E |
| [TypeScript](https://www.typescriptlang.org/) | Tipagem e escalabilidade |
| [Node.js](https://nodejs.org/) | Runtime |
| [dotenv](https://github.com/motdotla/dotenv) | Variáveis de ambiente |

## Pré-requisitos

- Node.js 24.15.0+
- npm 11.12.1+

## Instalação

```bash
# Instalar dependências
npm install

# Instalar browsers do Playwright
npx playwright install
```

Copie o arquivo de variáveis de ambiente e preencha os valores:

```bash
cp .env.example .env
```

## Executando os testes

```bash
# Rodar todos os testes (headless)
npm test

# Rodar com browser visível
npm run test:headed

# Rodar em modo UI interativo (com retries ativos)
npm run test:ui

# Rodar em modo debug
npm run test:debug
```

## Relatório

Após a execução, o relatório HTML é gerado em `reports/html/`.

```bash
npm run report
```

## Configuração

As opções de execução ficam em `configs/environments.ts` e podem ser sobrescritas via variáveis de ambiente:

| Variável | Descrição | Padrão |
|---|---|---|
| `BASE_URL` | URL base da aplicação | `http://lojaebac.ebaconline.art.br` |
| `WORKERS` | Número de workers paralelos | `5` |
| `FULLY_PARALLEL` | Paralelismo total entre testes | `true` |
| `EXISTING_ACCOUNT_PASSWORD` | Senha da conta de teste existente | — |

**Exemplo:**

```bash
$env:WORKERS=4; npm test
$env:FULLY_PARALLEL=false; npm test
```

## Estrutura do projeto

```
├── configs/
│   └── environments.ts        # Configuração de ambiente e execução
├── data/
│   ├── billingDetails.ts      # Dados de cobrança para checkout
│   ├── existingAccount.ts     # Conta de teste pré-existente
│   └── productVariation.ts    # Variações de produto (tamanho, cor)
├── pages/
│   ├── BasePage.ts            # Classe base com locators do header
│   ├── HomePage.ts            # Vitrine de produtos
│   ├── ProductPage.ts         # Página de produto e variações
│   ├── CartPage.ts            # Carrinho de compras
│   ├── CheckoutPage.ts        # Checkout e finalização de pedido
│   └── LoginPage.ts           # Login e registro de conta
├── tests/
│   ├── purchaseFlow.spec.ts   # Fluxo de compra (CT-01 a CT-12)
│   └── loginFlow.spec.ts      # Login e registro (CT-01 a CT-09)
├── types/
│   └── checkout.ts            # Tipos e enums do checkout
├── utils/
│   ├── fixtures.ts            # Extensão dos fixtures do Playwright
│   └── randomData.ts          # Geração de dados aleatórios
├── .env.example               # Modelo de variáveis de ambiente
├── playwright.config.ts
└── tsconfig.json
```

## Cenários automatizados

### Fluxo de Compra (`purchaseFlow.spec.ts`)

| ID | Cenário |
|---|---|
| CT-01 | Dado que a loja está acessível, quando o usuário acessa a página inicial, então os produtos devem ser exibidos na vitrine |
| CT-02 | Dado que o usuário seleciona um produto, quando adiciona ao carrinho, então a mensagem de confirmação deve conter o nome do produto |
| CT-03 | Dado que um produto foi adicionado ao carrinho, quando o usuário acessa o carrinho, então o item deve aparecer na listagem |
| CT-04 | Dado que há um item no carrinho, quando a quantidade é alterada, então o carrinho deve refletir a nova quantidade |
| CT-05 | Dado que há itens no carrinho, quando o usuário clica em concluir compra, então deve ser redirecionado para a página de checkout |
| CT-06 | Dado que o usuário preencheu os dados e aceitou os termos, quando finaliza o pedido como convidado, então deve ver a confirmação com número do pedido |
| CT-07 | Dado que o usuário não tem conta, quando finaliza o pedido criando uma conta, então deve ser redirecionado para o painel logado |
| CT-08 | Dado que o e-mail já está cadastrado, quando tenta criar conta no checkout, então deve ver mensagem de e-mail já registrado |
| CT-09 | Dado que um produto foi adicionado ao carrinho, quando o usuário visualiza o site, então o contador do header deve refletir os itens adicionados |
| CT-10 | Dado que uma variação está fora de estoque, quando o usuário a seleciona, então deve ver a mensagem de fora de estoque |
| CT-11 | Dado que uma variação está em estoque, quando o usuário adiciona exatamente o limite disponível, então o produto deve ser adicionado ao carrinho |
| CT-12 | Dado que uma variação está em estoque, quando o usuário informa uma quantidade acima do limite disponível, então o formulário deve rejeitar a quantidade |

### Login e Registro (`loginFlow.spec.ts`)

| ID | Cenário |
|---|---|
| CT-01 | Dado que o usuário tem uma conta, quando faz login com credenciais válidas, então deve ver o painel da conta |
| CT-02 | Dado que o usuário informa credenciais inválidas, quando tenta fazer login, então deve ver mensagem de erro |
| CT-03 | Dado que o e-mail ainda não está cadastrado, quando realiza o registro, então deve ser redirecionado para o painel da conta |
| CT-04 | Dado que o usuário tem uma conta, quando tenta fazer login com senha incorreta, então deve ver mensagem de erro com o e-mail informado |
| CT-05 | Dado que o e-mail já está cadastrado, quando tenta registrar uma nova conta, então deve ver mensagem de e-mail já registrado |
| CT-06 | Dado que o formulário de login está vazio, quando o usuário tenta fazer login, então deve ver erro de nome de usuário obrigatório |
| CT-07 | Dado que o usuário informou apenas o nome de usuário, quando tenta fazer login sem senha, então deve ver erro de senha vazia |
| CT-08 | Dado que o usuário informou apenas o e-mail no registro, quando tenta criar conta sem senha, então deve ver erro de senha obrigatória |
| CT-09 | Dado que o formulário de registro está vazio, quando o usuário tenta criar conta, então deve ver erro de e-mail obrigatório |

## Desafio de Investigação

Eu começaria investigando o se o pedido está sendo realmente criado. Para isso, análisaria os dados do cliente que abriu a reclamação, verificando o e-mail/usuario utilizados, a data e hora da tentativa de compra, e os dados do pedido. Se o pedido foi processado pelo meio de pagamento e debitado do cliente, isso indicaria um problema de comunicação entre o sistema de pagamento e a loja, ou um bug no processo de finalização do pedido. Se o pedido não foi criado, isso sugeriria um problema na etapa de criação do pedido, possivelmente relacionado a validações ou erros no código que processa o checkout. Analisaria os logs do servidor para identificar erros ou falhas durante o processo de compra, e tentaria reproduzir o cenário com os mesmos dados para entender melhor o comportamento do sistema.
