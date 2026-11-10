# Evidência de verificação

Tudo aqui é gerado por `verificar.mjs`, que abre a página no Edge, mede, preenche o formulário e grava o que encontrou. Nada foi escrito à mão.

```
cd verificacao
npm install
node verificar.mjs                 # confere o index.html local
node verificar.mjs <URL no ar>     # confere a página publicada (arquivos com sufixo -no-ar)
```

## O que cada arquivo prova

| Arquivo | O que mostra |
|---|---|
| `resultado.txt` | Saída do script na página local: cada item com OK ou FALHA |
| `resultado-no-ar.txt` | A mesma conferência, rodada contra a URL publicada |
| `celular-390-primeira-tela.png` | Celular (390x844): a primeira tela, com a promessa e o botão visíveis sem rolar |
| `celular-390-pagina-inteira.png` | Celular (390px): a página inteira, em uma coluna |
| `computador-1440-primeira-tela.png` | Computador (1440x900): a primeira tela |
| `computador-1440-pagina-inteira.png` | Computador (1440px): a página inteira |
| `celular-390-meio-barra-de-acao.png` | Celular: meio da página (o caso de Sorocaba), com o topo fixo e a barra de ação no pé da tela |
| `celular-390-bloqueio-conta-200.png` | Celular: formulário enviado com conta de R$ 200, mostrando o aviso de bloqueio |
| `celular-390-envio-conta-780.png` | Celular: formulário enviado com conta de R$ 780, mostrando a confirmação |
| `celular-390-primeira-tela-bloqueio-200.png` | Celular: conta de R$ 200 digitada na primeira tela, com o aviso ali mesmo |
| `computador-1440-telhado.png` | Computador: objeção do telhado, com o corte do telhado em 3D sob a pergunta |
| `computador-1440-credito.png` | Computador: Lei 14.300 com o crédito de dia e de noite em 3D |
| `computador-1440-caso-acao.png` | Computador: caso de Sorocaba terminando com o botão |
| `computador-1440-retorno.png` | Computador: os 25 blocos de anos, do retorno à vida útil |

Os arquivos com `-no-ar` no nome são as mesmas capturas, tiradas da página publicada.

## O que o script confere

1. **Layout:** em 390px não há rolagem horizontal nem elemento passando da borda; o botão aparece na primeira tela.
2. **Design:** as cores, os tamanhos e os cantos que o navegador renderiza são os do `DESIGN.md`; há uma família de fonte só; o laranja só aparece nos botões; nenhum texto âmbar fora de fundo azul; as barras do caso estão na proporção de R$ 118 para R$ 780; as barras das garantias estão na proporção de 25, 10 e 5 anos sobre 25; o "5 anos" do telhado é azul; a etapa da CPFL tem ponto vazado e a da instalação, anel âmbar; a textura do painel é branca, com opacidade 0,06 e sem imagem de fundo; o caso ocupa a largura toda da tela; todo hex do CSS existe na `logo.svg`; não há gradiente nem cor ou fonte do site de 2021.
3. **Mecânica:** o topo fica preso ao rolar; no celular a barra de ação aparece no meio da página e some na primeira tela e no formulário; com movimento ligado toda seção termina visível; sem JavaScript o conteúdo nasce visível e nada é enviado.
4. **Texto:** nenhuma das palavras proibidas pelo cliente (inclusive nos avisos escondidos); todo número da página está na tabela de origem no brief, impressa no resultado.
5. **Ação única:** todo link leva ao formulário; não existe link de WhatsApp ou telefone no HTML; o formulário não tem `action`.
6. **Filtro de R$ 450:** contas de 200, 449, 449,99 e 300,00 bloqueiam e não abrem link nenhum; 450, 780 e 1.200,50 abrem um link cuja mensagem começa com `[Simulação site]`; formulário vazio, valor sem número e Enter no campo também não passam. A máscara do WhatsApp, o campo da conta só com número e o aviso ao sair do campo também são testados.

7. **Primeira tela (quarta versão):** contas de 200 e 449,99 digitadas ali mostram o aviso, não descem ao formulário e não abrem link; 450 e 780 descem ao formulário com a conta preenchida e o cursor no nome, também sem abrir link; em branco, o botão só leva ao formulário; sem JavaScript, o campo é um formulário com `action="#simulacao"`. O valor trazido ainda passa pelo filtro: trocado para 300 bloqueia, e 780 chega à mensagem do WhatsApp.
8. **Diagramas e blocos (quarta versão):** 25 blocos de anos nas cores certas; botão no fim do caso; "11 pessoas" na objeção 1; os diagramas aparecem com legenda e nome acessível, inclusive sem JavaScript, e a camada de texto só usa cores da logo, sem laranja.

9. **Sem mapa (sexta versão):** o mapa do raio não existe mais na página, no celular nem no computador, e o campo "Cidade" continua com "Outra cidade a até 80 km de Sorocaba".

10. **Modelos 3D (quinta versão):** as três imagens de `assets/3d/` (geradas por `modelos/renderizar.mjs`) carregam, têm texto alternativo e aparecem sem JavaScript. Cada pixel opaco é um tom do `DESIGN.md` (cor da logo, ou cor da logo com azul ou branco transparente por cima) ou a borda suavizada entre dois desses tons; o script imprime a porcentagem de cada caso e falha se houver qualquer laranja. Cada imagem está em 2x e tem até 120 KB.

As capturas são tiradas com "menos movimento" ligado, para registrar a página já assentada.

## O que o script não confere

- O envio real pelo WhatsApp: o script intercepta o link em vez de abrir o aplicativo, e o número do cliente ainda não chegou.
- Leitura por leitor de tela e navegadores além do Edge.
