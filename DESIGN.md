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
| `--sombra` | `0 10px 30px rgb(18 58 85 / 0.14)` | Topo fixo, barra do celular, cartão de prova e botão ao passar o mouse |
| `--textura` | `0.06` | Opacidade da textura do painel sobre azul |

Regras:

- O laranja não aparece em título, ícone, borda decorativa nem fundo de seção. Se algo é laranja, é clicável ou está em foco. A logo é a exceção.
- O âmbar nunca é texto sobre branco (contraste de 2,1:1). Como texto, só sobre azul (5,6:1). Sobre branco ele aparece só como forma: o traço dos rótulos, os blocos de anos, o topo do cartão de prova e o topo da ficha do formulário.
- Texto do botão é azul sobre laranja (3,9:1), não branco (3,1:1). Por isso o rótulo do botão é sempre negrito e com 17px ou mais.
- Sem gradiente. Sem vermelho para erro: erro e bloqueio usam o azul, com borda grossa à esquerda.
- Não entram `#1d8f7e`, `#0d2c42` nem `#155a7a`, que são do site de 2021 e não da marca.

## Tipografia

Uma família só, a mesma da logo: `"Helvetica Neue", Helvetica, Arial, sans-serif` (`--fonte`). É fonte do sistema: nada é baixado.

A voz vem da própria logo, que escreve "RAVENA" em negrito e "SOLAR" leve, com as letras bem espaçadas:

- **Pesos:** 700 para número, título e botão; 400 para texto; `--leve` (300) para a frase da promessa. Onde o sistema não tem o peso leve (Arial, no Windows e no Android), o navegador usa o 400.
- **Rótulos:** caixa alta, `--t-rotulo`, com `--rastro` (0,2em) entre as letras. Valem para o rótulo de seção, o sobretítulo, o rótulo do caso, "Garantias", os títulos das colunas de preço e os campos da ficha do caso.

| Token | Celular (base 390px) | A partir de 760px | Uso |
|---|---|---|---|
| `--t-monumental` | 15vw, entre 46 e 60px (58,5px em 390) / 0,95 | 12vw, entre 88 e 136px / 0,95 | "75% a 90%" e os dois valores do caso. O maior texto da página |
| `--t-numero` | 56px / 0,95 | 8,2vw, entre 60 e 96px / 0,95 | Número de destaque da objeção ("11 pessoas", "5 anos") |
| `--t-prova` | 36px / 0,95 | 5vw, entre 48 e 64px / 0,95 | Os três números do cartão de prova, em `--azul`. Teto de 64px: a 88px o número ficava mais de cinco vezes maior que a legenda e a prova competia com "75% a 90%" |
| `--t-h2` | 30px / 1,08 | 5vw, entre 40 e 56px / 1,08 | A pergunta de cada seção |
| `--t-h1` | 24px / 1,2 | 40px / 1,15 | A frase da promessa, em peso leve, acima do número. No computador tem até 14em por linha, para quebrar depois de "clientes," (antes, "nossos / clientes" ficava separado) |
| `--t-h3` | 19px / 1,3 | 20px / 1,3 | Título de item |
| `--t-corpo` | 17px / 1,55 | 18px / 1,6 | Texto |
| `--t-pequeno` | 15px / 1,45 | 15px / 1,45 | Legenda e ajuda de campo |
| `--t-rotulo` | 12px / 1,4 | 12px / 1,4 | Rótulos em caixa alta |

Hierarquia: o maior texto da página é sempre um número (`--t-monumental`), e a diferença para o resto é grande de propósito. Título de seção é a pergunta do cliente, com as palavras dele, com a aspa de abertura pendurada para fora do alinhamento. Números usam algarismos de largura fixa (`tabular-nums`) e letras mais juntas (de -0,035em a -0,045em).

## Espaço e medidas

- Escala (`--e-1` a `--e-8`): 4, 8, 16, 24, 32, 48, 72, 96 px.
- Seção: 56px em cima e embaixo no celular (`--secao`), 96px a partir de 760px.
- Largura do conteúdo: 1080px no máximo (`--largura`). Margem lateral: 20px no celular, 32px a partir de 760px (`--margem`).
- Linha de texto: 62 caracteres no máximo (`--medida`).
- Quebra única: 760px. Abaixo disso tudo é uma coluna.
- Canto: 6px em botão e campo (`--raio`), 12px no cartão de prova, na ficha do formulário e no quadro do crédito (`--raio-cartao`), 2px em barras e blocos. As colunas de preço não têm canto arredondado.
- Topo fixo: 64px de altura no celular, 76px a partir de 760px (`--topo`).
- Botão: 56px de altura mínima, largura total no celular (44px na versão do topo). Campo de formulário: 52px.
- Foco: contorno de 3px em `--laranja`, afastado 2px.

## Componentes

- **Botão de ação:** fundo `--laranja`, texto `--azul` em negrito. É o único elemento laranja preenchido da página. O rótulo é sempre "Pedir simulação" (no formulário, "Pedir simulação pelo WhatsApp"). Ao passar o mouse sobe 1px e ganha `--sombra`.
- **Topo fixo:** fundo `--branco`, logo à esquerda. A logo é link para o início da página (`#inicio`). No computador traz o botão à direita. Ganha `--sombra` quando a página rola.
- **Navegação do topo:** a partir de 1024px, entre a logo e o botão, seis links de texto para as seções: A empresa, Telhado, Lei 14.300, Caso, Preço e Dúvidas. Em `--t-pequeno`, peso 400 e `--texto-suave`; ao passar o mouse, `--azul`. A seção que está na tela fica em `--azul` (sem negrito, para os links não mudarem de largura), com um traço de 2px em `--ambar` embaixo (âmbar como forma, não como texto). Abaixo de 1024px os links somem: no celular a barra do pé já leva à ação, e seis links não cabem ao lado do botão. *Por quê:* a página é longa (SPEC, item 8). Os links não são laranja nem botão, para não competir com "Pedir simulação".
- **Barra de ação do celular:** fundo `--branco`, presa ao pé da tela, com o botão. Aparece depois que o botão da primeira tela sai de vista e some quando o formulário ou o rodapé aparecem.
- **Primeira tela:** fundo `--azul`. A promessa tem duas partes: a frase em `--t-h1`, peso leve e `--branco`; e o intervalo "75% a 90%" em `--t-monumental`, negrito e `--ambar`, numa linha só. Ao fundo, a textura do painel. Depois vêm o campo da conta e a régua (abaixo). O pé da tela repete a composição da logo: o sol nasce por trás do cartão de prova.
  - **Escala da primeira tela:** só cinco tamanhos acima da dobra: rótulo (`--t-rotulo`), pequeno (`--t-pequeno`, na régua e na nota), corpo (`--t-corpo`, no texto e no rótulo do campo), frase (`--t-h1`) e número (`--t-monumental`). O sobretítulo fica em `--branco-suave`, numa linha só no computador, porque o âmbar acima da dobra é só do número. *Por quê:* a primeira tela tinha nove tamanhos e um sobretítulo âmbar em duas linhas disputando com "75% a 90%", o que deixava a dobra com aspecto desarrumado.
  - **Ritmo:** o da sexta versão. 16px do sobretítulo à frase, 8px da frase ao número, 24px do número ao texto, 32px do texto ao campo, 16px entre a régua e a nota. Respiro de 32px em cima no celular e 72px no computador. Embaixo, 96px no celular (a altura do sol que aparece acima do cartão) e 72px no computador, mais os 56px em que o cartão avança.
  - **Coluna (computador):** o texto ocupa até 720px. A primeira tela tem a altura do conteúdo, não a da janela. *Por quê:* na oitava versão a tela ganhou a altura da janela para a dobra cair na borda do painel, e o espaço vazio entre o formulário e a prova ficou grande demais. Voltou o espaçamento compacto da sexta versão.
- **Sol:** o sol da logo (círculo e cinco raios, mesma geometria de `assets/logo.svg`), em `--ambar`, encostado à direita. Fica atrás do cartão de prova, que cobre 30% da altura dele. Largura de 168px no celular; no computador, o que sobra à direita da coluna de texto (720px), até 360px. Os raios têm traço fixo de 9px na tela (`vector-effect: non-scaling-stroke`), seja qual for o tamanho do sol. *Por quê:* com 520px e o traço escalando junto, os raios passavam de 20px de espessura e pareciam pílulas soltas, não raios.
- **Cartão de prova:** como na sexta versão. Cartão `--branco` com `--raio-cartao`, `--sombra` e traço de 4px em `--ambar` no topo; avança 56px (`--avanco`) da primeira tela sobre a seção branca. Divisórias de 1px em `--linha` entre as três células. Números em `--t-prova` e `--azul`, legenda em `--texto-suave` (16px no celular, 18px no computador, até 24ch por linha). Três colunas no computador, três linhas no celular. *Por quê:* o painel azul de linhas brancas (sétima e oitava versões) ficou pesado e bruto. O cartão branco separa a prova da promessa, e o sol continua nascendo por trás da borda de cima dele.
- **Régua dos R$ 450:** sob o campo da conta. Trilho de 8px: à esquerda da marca, `--linha-clara`; à direita, `--branco`. A marca fica a 40% da largura (`--limite`), com 2px e 20px de altura, e é o único número escrito: "R$ 450". Legendas em 13px (15px no computador): "não fecha" e "fazemos a simulação". O valor digitado é um ponto de 18px em `--ambar` com contorno `--azul`, na posição `valor / 450 x 40%`, parando nas pontas. Nada é laranja: a régua não é ação.
- **Textura do painel:** a grade das células do painel da logo (células de 72x48px, linha de 1px), em `--branco` com opacidade `--textura` (0,06). Só sobre `--azul`: primeira tela e seção do formulário. É desenhada por máscara SVG, não por gradiente, e fica atrás do conteúdo.
- **Rótulo de seção:** fio de 1px em `--linha` de ponta a ponta do conteúdo, com um traço de 40x4px em `--ambar` no começo. Abaixo, o número da folha (01 a 06, em negrito e `--azul`) e o rótulo em caixa alta. O número é desenhado pelo CSS (`counter`): é ordem, não cifra, e não entra no texto da página.
- **Título de seção:** a pergunta do cliente em `--t-h2`, na largura toda, com até 17em por linha. Vem logo abaixo do rótulo; a resposta vem embaixo, não ao lado.
- **Lista de fatos:** marca de conferido em `--azul` à esquerda de cada item (em `--ambar` sobre fundo azul).
- **Número de destaque da objeção:** o número que responde à pergunta, em `--t-numero` e `--azul` (nunca âmbar, que seria texto sobre branco), com a frase que o completa em `--t-h3` negrito (22px no computador). Na objeção 1 a frase fica ao lado do número quando cabe, e os quatro fatos vêm embaixo, em duas colunas, depois de um fio.
- **Garantias:** uma linha por garantia, na largura toda, com o número à esquerda (26px no celular, 44px no computador) e, à direita, o que ela cobre e uma barra. A barra é `--azul` sobre trilho `--linha`, com largura proporcional aos anos sobre os 25 da maior (`25/25`, `10/25`, `5/25`), calculada no CSS.
- **Caso:** faixa `--azul` de ponta a ponta da tela, entre a objeção da Lei 14.300 e o preço, com os dois valores lado a lado em `--t-monumental`, cada um com uma barra. Abaixo, a ficha da casa: três campos (onde, sistema, instalado em), com o nome do campo em rótulo e o dado em negrito, separados por fios `--linha-clara`. A barra de antes ocupa o trilho inteiro, em `--branco`; a de depois é `--ambar` e tem largura `118 / 780` do trilho. A proporção é calculada no CSS a partir dos dois valores do brief.
- **Etapas:** linha do tempo com oito pontos numerados (`--azul`, número `--branco`) ligados por uma linha `--linha`. Vertical no celular; quatro por linha no computador. A etapa da CPFL tem o ponto vazado (`--branco` com contorno `--azul`) e a da instalação tem um anel de 3px em `--ambar` (forma, não texto); cada uma traz uma nota curta em `--t-pequeno`.
- **Coluna de ficha** (preço, prazo e financiamento): sem fundo e sem canto, com um fio de 3px em `--azul` no topo, o nome em rótulo e o valor em 30px (40px no computador).
- **Dúvidas antes do pedido:** uma coluna centrada no eixo da página, de até 720px, com o rótulo e o título em cima e as cinco perguntas embaixo, uma por linha. Lista sem cartão, cada pergunta separada por uma divisória `--linha` em cima; respostas sempre abertas, sem acordeão. *Por quê:* com cinco perguntas, qualquer grade deixava um buraco ou pedia um item inventado. Em coluna, o número ímpar deixa de importar e a leitura segue de cima para baixo, como uma conversa.
  - **Nota de fechamento:** depois da última pergunta, "Ficou outra dúvida?" num bloco com fundo `--fundo-suave`, borda esquerda de 4px em `--ambar` (forma, não texto) e canto `--raio` à direita. Sem botão. A borda é âmbar, e não azul, para não ser lida como o aviso de erro ou bloqueio.
- **Aviso** (erro e bloqueio): fundo `--fundo-suave`, borda esquerda de 4px em `--azul`, texto em `--azul`.
- **Aviso sobre azul** (bloqueio na primeira tela): fundo `--branco`, texto `--azul` e borda esquerda de 4px em `--ambar`. A borda azul sumiria contra o fundo azul; o âmbar aqui é forma, não texto.
- **Campo da conta na primeira tela:** rótulo em `--branco` negrito; campo `--branco` de 56px, sem borda, com "R$" fixo em `--texto-suave` e foco em `--laranja`. O botão "Pedir simulação" fica embaixo no celular e ao lado no computador.
- **Ação do caso:** no fim da faixa azul do caso, depois da ficha, uma frase em `--branco` e o botão de ação.
- **Blocos de anos** (retorno contra vida útil): 25 blocos iguais de 28px de altura e 3px de vão, um por ano, em grade. Os 3 primeiros em `--ambar`, o quarto em `--ambar` com 45% de opacidade (o "a 4"), o resto em `--azul`. Legenda com amostras do mesmo tamanho. É forma, então o âmbar sobre branco vale.
- **Diagramas** (crédito e corte do telhado; o mapa do raio saiu na sexta versão): desde a quinta versão, modelos 3D (ver "Modelos 3D" abaixo). O que segue vale para a camada de texto e para as escolhas de cor e forma, que o 3D mantém. Antes: SVG desenhado no próprio HTML, só com as cores da logo. Traço de 2px em `--azul` sobre branco ou `--branco` sobre azul, cantos e pontas arredondados. Sol e setas da sobra em `--ambar`. Painel como na logo: `--azul` com linhas `--branco`. Texto dentro do desenho só para nomes curtos, em `--t-pequeno`. A explicação fica na legenda (`figcaption`), em HTML. Sem animação e sem gente.
  - **Crédito:** dois quadros lado a lado no computador (empilhados no celular), "De dia" e "À noite", com a mesma casa e o poste da rede. Os dois ficam num quadro só, com borda `--linha` e `--raio-cartao`: o do dia sobre `--branco`, o da noite sobre `--azul`, com legenda em `--branco-suave` e nomes em `--branco`.
  - **Telhado:** corte com painel, trilho, ganchos, telhas onduladas e a madeira, com os nomes à direita.

## Modelos 3D (desde a quinta versão)

Os dois diagramas são modelos em Three.js na pasta `modelos/`, renderizados para `assets/3d/` por `modelos/renderizar.mjs`. A página recebe a imagem (PNG em 2x, fundo transparente) e, por cima, um SVG com o mesmo enquadramento para texto e destaques.

- **Sombreado chapado, em três tons por cor.** Sem luz realista, sem reflexo, sem gradiente. A orientação da face escolhe o tom:

  | Face | Cor clara (branco, âmbar) | Azul |
  |---|---|---|
  | Topo | a cor | `--azul` + `--branco` a 0,14 |
  | Lado iluminado | a cor + `--azul` a 0,16 | `--azul` + `--branco` a 0,06 |
  | Lado na sombra | a cor + `--azul` a 0,32 | `--azul` |

  É a mesma lógica dos neutros: cores da logo com transparência, nada novo.
- **Contorno:** 2px em `--azul` nas arestas, como o traço dos diagramas planos.
- **Laranja:** nunca. É só da ação.
- **Câmera:** isométrica fixa no telhado e no crédito (mesma câmera nos quadros de dia e de noite).
- **Telhado:** corte isométrico com madeira (`--branco` + `--azul` a 0,10 no topo), telhas onduladas em `--branco`, ganchos e trilho em `--azul`, painel em `--azul` com as linhas das células em `--branco`. O corte fica na face da frente.
- **Crédito:** base fina de chão, casa em `--branco` com telhado de duas águas, painel na água da frente, poste da rede em `--azul`. De dia, sol em `--ambar` e seta da sobra em `--ambar`, da casa para o poste. À noite, o quadro fica sobre fundo `--azul`: a lua, o poste e o fio passam a `--branco`, e a seta continua em `--azul`, do poste para a casa, sobre o chão claro.
- **Camada de texto (SVG):** nomes em `--t-pequeno`/negrito como antes; guias em `--texto-suave`.
- **Peso:** até 120 KB por imagem.

## Formulário como ficha

A ficha é `--branco`, com `--raio-cartao` e traço de 4px em `--ambar` no topo. Abre com o cabeçalho "Pedido de simulação" em rótulo, sobre um fio `--linha`. Cada um dos quatro campos tem o número (1 a 4) numa célula de 24px com contorno de 1,5px em `--azul`, antes do nome. O número vem do CSS, como o das folhas. O campo "Qual cidade?", que só aparece em "Outra cidade", não é numerado.

## Movimento

- Seções entram com opacidade e 20px de deslocamento, em 0,6s, uma vez só.
- As barras do caso e das garantias crescem da esquerda em 0,9s quando o bloco aparece.
- O ponto da régua desliza até a posição em 0,3s.
- Com `prefers-reduced-motion`, nada disso acontece e a rolagem deixa de ser suave.
- Sem JavaScript, todo o conteúdo já nasce visível.

## O que não vem do site de 2021

Fonte Poppins, gradientes no topo e nas faixas, botão em gradiente, cards de Missão/Visão/Valores com ícone em círculo, menu de navegação e botão flutuante de WhatsApp. Nenhum texto, número ou cor foi tirado dele.
