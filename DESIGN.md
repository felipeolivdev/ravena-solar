# Design — Página de simulação da Ravena Solar

Os valores daqui são a fonte. O `styles.css` declara cada um como variável em `:root`, com o mesmo nome, e o resto do CSS só usa as variáveis. Mudou aqui, muda lá.

## Cores

Lidas de `material/logo.svg` (atributos `fill` e `stroke`), o arquivo do cliente. A página serve uma cópia idêntica em `assets/logo.svg`, porque a pasta `material/` não vai para o repositório. Não há outra cor de marca.

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
| `--textura` | `0.06` | Opacidade da textura do painel sobre azul |

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
- **Primeira tela:** fundo `--azul`, promessa em `--branco` com o intervalo "75% a 90%" em `--ambar`. No computador, a marca da logo (sol e painel) ampliada à direita. Ao fundo, a textura do painel. No lugar do botão sozinho, o campo da conta (abaixo).
- **Textura do painel:** a grade das células do painel da logo (células de 72x48px, linha de 1px), em `--branco` com opacidade `--textura` (0,06). Só sobre `--azul`: primeira tela e seção do formulário. É desenhada por máscara SVG, não por gradiente, e fica atrás do conteúdo.
- **Cartão de prova:** `--branco`, `--raio-cartao`, `--sombra`, traço de 4px em `--ambar` no topo; avança 56px sobre a primeira tela. Números em `--azul`.
- **Título de seção:** traço de 40x4px em `--ambar` acima do texto. No computador a pergunta fica presa à esquerda enquanto a resposta rola à direita.
- **Lista de fatos:** marca de conferido em `--azul` à esquerda de cada item (em `--ambar` sobre fundo azul).
- **Número de destaque da objeção:** o número que responde à pergunta, em `--t-numero` e `--azul` (nunca âmbar, que seria texto sobre branco), com a frase que o completa logo abaixo, em `--t-h3` negrito.
- **Garantias:** uma linha por garantia, com o número à esquerda e, à direita, o que ela cobre e uma barra. A barra é `--azul` sobre trilho `--linha`, com largura proporcional aos anos sobre os 25 da maior (`25/25`, `10/25`, `5/25`), calculada no CSS.
- **Caso:** faixa `--azul` de ponta a ponta da tela, entre a objeção da Lei 14.300 e o preço, com os dois valores lado a lado, cada um com uma barra. A barra de antes ocupa o trilho inteiro, em `--branco`; a de depois é `--ambar` e tem largura `118 / 780` do trilho. A proporção é calculada no CSS a partir dos dois valores do brief.
- **Etapas:** linha do tempo com oito pontos numerados (`--azul`, número `--branco`) ligados por uma linha `--linha`. Vertical no celular; quatro por linha no computador. A etapa da CPFL tem o ponto vazado (`--branco` com contorno `--azul`) e a da instalação tem um anel de 3px em `--ambar` (forma, não texto); cada uma traz uma nota curta em `--t-pequeno`.
- **Cartão de conteúdo** (preço, prazo e financiamento): `--branco`, borda `--linha`, `--raio-cartao`.
- **Perguntas curtas:** lista sem cartão, cada pergunta separada por uma divisória `--linha` em cima. Três colunas no computador.
- **Aviso** (erro e bloqueio): fundo `--fundo-suave`, borda esquerda de 4px em `--azul`, texto em `--azul`.
- **Aviso sobre azul** (bloqueio na primeira tela): fundo `--branco`, texto `--azul` e borda esquerda de 4px em `--ambar`. A borda azul sumiria contra o fundo azul; o âmbar aqui é forma, não texto.
- **Campo da conta na primeira tela:** rótulo em `--branco` negrito; campo `--branco` de 56px, sem borda, com "R$" fixo em `--texto-suave` e foco em `--laranja`. O botão "Pedir simulação" fica embaixo no celular e ao lado no computador.
- **Ação do caso:** no fim da faixa azul do caso, uma frase em `--branco` e o botão de ação, separados dos valores por uma divisória `--linha-clara`.
- **Blocos de anos** (retorno contra vida útil): 25 blocos iguais de 28px de altura e 3px de vão, um por ano, em grade. Os 3 primeiros em `--ambar`, o quarto em `--ambar` com 45% de opacidade (o "a 4"), o resto em `--azul`. Legenda com amostras do mesmo tamanho. É forma, então o âmbar sobre branco vale.
- **Diagramas** (crédito, corte do telhado, raio de atendimento): desde a quinta versão, modelos 3D (ver "Modelos 3D" abaixo). O que segue vale para a camada de texto e para as escolhas de cor e forma, que o 3D mantém. Antes: SVG desenhado no próprio HTML, só com as cores da logo. Traço de 2px em `--azul` sobre branco ou `--branco` sobre azul, cantos e pontas arredondados. Sol e setas da sobra em `--ambar`, sede no mapa em `--ambar`. Painel como na logo: `--azul` com linhas `--branco`. Texto dentro do desenho só para nomes curtos, em `--t-pequeno`. A explicação fica na legenda (`figcaption`), em HTML. Sem animação e sem gente.
  - **Crédito:** dois quadros lado a lado no computador (empilhados no celular), "De dia" e "À noite", com a mesma casa e o poste da rede.
  - **Telhado:** corte com painel, trilho, ganchos, telhas onduladas e a madeira, com os nomes à direita.
  - **Raio:** duas escalas no mesmo desenho, sobre `--azul`.
    - *Visão geral* (1,5px por km): círculo de 80 km com área em `--branco` a 0,06 (o mesmo valor de `--textura`) e borda tracejada em `--branco` a 0,4; dois anéis internos sem número em `--branco` a 0,1; uma linha do centro à borda com "80 km" em cima, que faz as vezes de escala. A região das cidades fica num retângulo tracejado em `--ambar`, ligado ao quadro ampliado por duas linhas finas.
    - *Quadro ampliado* (5px por km): moldura em `--ambar`, as cidades na mesma posição relativa, nomes à direita do ponto e "N ↑" no canto. A sede é o sol da logo (círculo e raios em `--ambar`); as outras cidades são pontos `--branco` de 5px.
    - *Cidade escolhida:* anel de 3px em `--ambar` em volta do ponto e nome em `--ambar` (texto âmbar só sobre azul). "Outra cidade" acende a borda do raio em `--ambar`.
    - Texto do mapa em 18 unidades do desenho no computador (o mapa é reduzido para caber na coluna) e `--t-pequeno` no celular.
    - *No celular:* só o quadro ampliado, no fim do formulário, depois do botão e da nota do Google, num bloco `--azul` com `--raio-cartao`. A visão geral aparece só a partir de 760px.

## Modelos 3D (desde a quinta versão)

Os três diagramas são modelos em Three.js na pasta `modelos/`, renderizados para `assets/3d/` por `modelos/renderizar.mjs`. A página recebe a imagem (PNG em 2x, fundo transparente) e, por cima, um SVG com o mesmo enquadramento para texto e destaques.

- **Sombreado chapado, em três tons por cor.** Sem luz realista, sem reflexo, sem gradiente. A orientação da face escolhe o tom:

  | Face | Cor clara (branco, âmbar) | Azul |
  |---|---|---|
  | Topo | a cor | `--azul` + `--branco` a 0,14 |
  | Lado iluminado | a cor + `--azul` a 0,16 | `--azul` + `--branco` a 0,06 |
  | Lado na sombra | a cor + `--azul` a 0,32 | `--azul` |

  É a mesma lógica dos neutros: cores da logo com transparência, nada novo.
- **Contorno:** 2px em `--azul` nas arestas, como o traço dos diagramas planos.
- **Laranja:** nunca. É só da ação.
- **Câmera:** isométrica fixa no telhado e no crédito (mesma câmera nos quadros de dia e de noite). O mapa usa projeção oblíqua de planta: chão visto de cima, norte para cima, altura sobe na vertical da tela. As posições no chão são as mesmas da quarta versão.
- **Telhado:** corte isométrico com madeira (`--branco` + `--azul` a 0,10 no topo), telhas onduladas em `--branco`, ganchos e trilho em `--azul`, painel em `--azul` com as linhas das células em `--branco`. O corte fica na face da frente.
- **Crédito:** base fina de chão, casa em `--branco` com telhado de duas águas, painel na água da frente, poste da rede em `--azul`. De dia, sol em `--ambar` e seta da sobra em `--ambar`, da casa para o poste. À noite, lua em `--azul` e seta em `--azul`, do poste para a casa.
- **Mapa:** disco do raio de 80 km como placa de `--branco` a 0,06 sobre o azul (o mesmo `--textura`), quadro ampliado como placa de `--branco` a 0,10. Cidades são pinos baixos em `--branco`, todos da mesma altura; a sede é um pino em `--ambar` com o sol da logo no topo. A visão geral e o quadro ampliado estão no mesmo modelo, cada um na sua escala.
- **Camada de texto (SVG):** nomes em `--t-pequeno`/negrito como antes; guias em `--texto-suave`. No mapa, o anel de 3px em `--ambar` da cidade escolhida, a borda tracejada do raio (que acende em `--ambar` com "Outra cidade"), o recorte, as ligações, "80 km" e "N ↑".
- **Peso:** até 120 KB por imagem.

## Movimento

- Seções entram com opacidade e 20px de deslocamento, em 0,6s, uma vez só.
- As barras do caso e das garantias crescem da esquerda em 0,9s quando o bloco aparece.
- Com `prefers-reduced-motion`, nada disso acontece e a rolagem deixa de ser suave.
- Sem JavaScript, todo o conteúdo já nasce visível.

## O que não vem do site de 2021

Fonte Poppins, gradientes no topo e nas faixas, botão em gradiente, cards de Missão/Visão/Valores com ícone em círculo, menu de navegação e botão flutuante de WhatsApp. Nenhum texto, número ou cor foi tirado dele.
