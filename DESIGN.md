# Design — Página de simulação da Ravena Solar

Os valores daqui são a fonte. O `styles.css` declara cada um como variável em `:root`, com o mesmo nome, e o resto do CSS só usa as variáveis. Mudou aqui, muda lá.

## Cores

Lidas de `material/logo.svg` (atributos `fill` e `stroke`). Não há outra cor de marca.

| Token | Valor | Onde está na logo | Uso na página |
|---|---|---|---|
| `--azul` | `#123A55` | painel e a palavra RAVENA | Texto, títulos, fundo da primeira tela e da seção do formulário |
| `--laranja` | `#E8721C` | a palavra SOLAR | **Só a ação:** fundo do botão e contorno de foco |
| `--ambar` | `#F2A03D` | o sol | Destaque: texto só sobre azul; sobre branco, só forma (traço, sol) |
| `--branco` | `#FFFFFF` | linhas do painel | Fundo da página, cartões e texto sobre azul |

Neutros: não são cores novas, são o azul e o branco da logo com transparência.

| Token | Valor | Uso |
|---|---|---|
| `--texto-suave` | `rgb(18 58 85 / 0.76)` | Texto de apoio sobre branco |
| `--linha` | `rgb(18 58 85 / 0.18)` | Bordas e divisórias |
| `--fundo-suave` | `rgb(18 58 85 / 0.05)` | Fundo de seção alternada |
| `--branco-suave` | `rgb(255 255 255 / 0.80)` | Texto de apoio sobre azul |
| `--linha-clara` | `rgb(255 255 255 / 0.24)` | Divisórias e trilhos sobre azul |
| `--sombra` | `0 10px 30px rgb(18 58 85 / 0.14)` | Cartão elevado e topo fixo |

Regras:

- O laranja não aparece em título, ícone, borda decorativa nem fundo de seção. Se algo é laranja, é clicável ou está em foco. A logo é a exceção.
- O âmbar nunca é texto sobre branco (contraste de 2,1:1). Como texto, só sobre azul (5,6:1). Sobre branco ele aparece só como forma: o traço acima dos títulos e o topo do cartão de prova.
- Texto do botão é azul sobre laranja (3,9:1), não branco (3,1:1). Por isso o rótulo do botão é sempre negrito e com 17px ou mais.
- Sem gradiente. Sem vermelho para erro: erro e bloqueio usam o azul, com borda grossa à esquerda.
- Não entram `#1d8f7e`, `#0d2c42` nem `#155a7a`, que são do site de 2021 e não da marca.

## Tipografia

Uma família só, a mesma da logo: `"Helvetica Neue", Helvetica, Arial, sans-serif` (`--fonte`). É fonte do sistema: nada é baixado. Dois pesos: 400 e 700.

| Token | Celular (base 390px) | A partir de 760px | Uso |
|---|---|---|---|
| `--t-h1` | 34px / 1,12 | 56px / 1,08 | A promessa. Só um por página |
| `--t-h2` | 26px / 1,2 | 36px / 1,15 | A pergunta de cada seção |
| `--t-numero` | 40px / 1 | 52px / 1 | Números de prova e do caso |
| `--t-h3` | 19px / 1,3 | 20px / 1,3 | Título de item |
| `--t-corpo` | 17px / 1,55 | 18px / 1,6 | Texto |
| `--t-pequeno` | 15px / 1,45 | 15px / 1,45 | Legenda e ajuda de campo |

Hierarquia: o maior texto da tela é sempre o número ou a promessa. Título de seção é a pergunta do cliente, com as palavras dele. Números usam algarismos de largura fixa (`tabular-nums`).

## Espaço e medidas

- Escala (`--e-1` a `--e-8`): 4, 8, 16, 24, 32, 48, 72, 96 px.
- Seção: 56px em cima e embaixo no celular (`--secao`), 96px a partir de 760px.
- Largura do conteúdo: 1080px no máximo (`--largura`). Margem lateral: 20px no celular, 32px a partir de 760px (`--margem`).
- Linha de texto: 62 caracteres no máximo (`--medida`).
- Quebra única: 760px. Abaixo disso tudo é uma coluna.
- Canto: 6px em botão e campo (`--raio`), 12px em cartão (`--raio-cartao`).
- Topo fixo: 64px de altura no celular, 76px a partir de 760px (`--topo`).
- Botão: 56px de altura mínima, largura total no celular (44px na versão do topo). Campo de formulário: 52px.
- Foco: contorno de 3px em `--laranja`, afastado 2px.

## Componentes

- **Botão de ação:** fundo `--laranja`, texto `--azul` em negrito. É o único elemento laranja preenchido da página. O rótulo é sempre "Pedir simulação" (no formulário, "Pedir simulação pelo WhatsApp"). Ao passar o mouse sobe 1px e ganha `--sombra`.
- **Topo fixo:** fundo `--branco`, logo à esquerda. No computador traz o botão à direita. Ganha `--sombra` quando a página rola.
- **Barra de ação do celular:** fundo `--branco`, presa ao pé da tela, com o botão. Aparece depois que o botão da primeira tela sai de vista e some quando o formulário ou o rodapé aparecem.
- **Primeira tela:** fundo `--azul`, promessa em `--branco` com o intervalo "75% a 90%" em `--ambar`. No computador, a marca da logo (sol e painel) ampliada à direita.
- **Cartão de prova:** `--branco`, `--raio-cartao`, `--sombra`, traço de 4px em `--ambar` no topo; avança 56px sobre a primeira tela. Números em `--azul`.
- **Título de seção:** traço de 40x4px em `--ambar` acima do texto. No computador a pergunta fica presa à esquerda enquanto a resposta rola à direita.
- **Lista de fatos:** marca de conferido em `--azul` à esquerda de cada item (em `--ambar` sobre fundo azul).
- **Caso:** bloco `--azul` com os dois valores lado a lado, cada um com uma barra. A barra de antes ocupa o trilho inteiro, em `--branco`; a de depois é `--ambar` e tem largura `118 / 780` do trilho. A proporção é calculada no CSS a partir dos dois valores do brief.
- **Etapas:** linha do tempo com oito pontos numerados (`--azul`, número `--branco`) ligados por uma linha `--linha`. Vertical no celular; quatro por linha no computador.
- **Cartão de conteúdo** (preço, prazo, financiamento, perguntas): `--branco`, borda `--linha`, `--raio-cartao`.
- **Aviso** (erro e bloqueio): fundo `--fundo-suave`, borda esquerda de 4px em `--azul`, texto em `--azul`.

## Movimento

- Seções entram com opacidade e 20px de deslocamento, em 0,6s, uma vez só.
- As barras do caso crescem da esquerda em 0,9s quando o bloco aparece.
- Com `prefers-reduced-motion`, nada disso acontece e a rolagem deixa de ser suave.
- Sem JavaScript, todo o conteúdo já nasce visível.

## O que não vem do site de 2021

Fonte Poppins, gradientes no topo e nas faixas, botão em gradiente, cards de Missão/Visão/Valores com ícone em círculo, menu de navegação e botão flutuante de WhatsApp. Nenhum texto, número ou cor foi tirado dele.
