# Spec — Página de simulação da Ravena Solar

**Objetivo:** fazer o dono de casa com conta acima de R$ 450 pedir uma simulação, e fazer quem está abaixo disso desistir antes de ocupar o vendedor. A meta é passar de ~12 para 25 pedidos por mês, com menos pedidos de conta baixa.

**Regra:** todo número da página vem do brief. O que só o site de 2021 diz não entra.

## Parte 1 — O que a página faz e por quê

1. **A promessa usa número e já filtra.**
   "Na média dos nossos clientes, a conta de luz cai de 75% a 90%. O retorno do investimento tem levado de 3 a 4 anos. Para casas com conta acima de R$ 450 em Sorocaba, Votorantim, Itu e Salto. 412 sistemas instalados por equipe própria."
   *Por quê:* com esses números, a frase só serve para a Ravena. E quem paga R$ 200 já percebe na primeira tela que não é o público.
   *Por que "na média" e "tem levado":* é como o brief diz. Sem essas palavras, a média vira promessa individual, e o brief avisa que o Procon da região é ativo.

2. **Tem uma ação só.** Todos os botões levam ao formulário de simulação. A página não tem menu nem chamada concorrente.
   *Por quê:* duas chamadas com o mesmo peso dividem a atenção.

3. **As objeções seguem a ordem do brief, e cada uma traz a prova ao lado.**
   - *"Vocês vão sumir?"* — 6 anos de empresa, equipe com carteira assinada, 412 sistemas, assistência autorizada do inversor, acompanhamento no primeiro ano e as três garantias (25 anos do painel, 10 do inversor, 5 da instalação).
   - *Telhado* — 5 anos de garantia da instalação, incluindo infiltração causada pela obra.
   - *Lei 14.300* — explicação honesta e o caso de Sorocaba: conta de R$ 780 virou R$ 118, num sistema ligado em 2025, já com a regra nova. A página também avisa que a conta não zera.
   - *Mudança de casa, dia nublado e bateria* — perguntas curtas, logo antes do formulário.

   *Por quê:* a primeira objeção é a que mais decide, porque três empresas da região sumiram. A prova convence mais quando aparece onde a dúvida aparece.
   *Por que as três garantias ficam na primeira objeção:* garantia de 25 anos só vale se a empresa existir; é ali que a pessoa está fazendo essa conta.

4. **Preço, prazo e financiamento ficam abertos.** R$ 14 a 19 mil; 45 a 60 dias, com a CPFL como a parte que não depende da Ravena; entrada zero; parcela próxima da conta de luz. As etapas do trabalho ("como trabalhamos", no brief) entram resumidas neste bloco.
   *Por quê:* o preço é o segundo filtro. E prazo explicado não vira prazo prometido — as etapas mostram onde os 45 a 60 dias são gastos.

5. **O formulário qualifica sozinho.** São quatro campos: nome, WhatsApp, cidade e valor da conta. Com conta abaixo de R$ 450, a página mostra uma mensagem franca e não envia. O envio abre o WhatsApp com os dados preenchidos e a etiqueta "[Simulação site]". Junto do botão ficam a nota 4,8 no Google, "resposta no mesmo dia útil, por WhatsApp" e "visita técnica sem custo e sem compromisso".
   *Por quê:* esse bloqueio é a metade da meta que uma página só de economia ignora. A etiqueta permite contar quantos pedidos vieram da página. As três frases junto do botão respondem "e depois que eu enviar?" no momento em que a pessoa hesita.

   Detalhes fechados na construção:
   - **Limite:** conta de exatamente R$ 450 passa. O brief diz "abaixo disso a conta não fecha"; então só abaixo bloqueia.
   - **Cidade:** lista com Sorocaba, Votorantim, Itu e Salto, mais "Outra cidade a até 80 km de Sorocaba" com campo para o nome. *Por quê:* o brief atende um raio de 80 km, não só as quatro; a lista deixa o raio explícito sem prometer atendimento fora dele.
   - **Texto da mensagem** (fixo; o cliente conta os leads pela primeira linha):
     ```
     [Simulação site]
     Nome: …
     WhatsApp: …
     Cidade: …
     Conta média de luz: R$ …
     ```
   - **Número do WhatsApp:** pendente com o cliente. Fica numa constante só, vazia e marcada `TODO cliente`. Enquanto estiver vazia, o link é `wa.me/?text=…`, que abre o WhatsApp com a mensagem pronta e sem destinatário. *Por quê:* dá para testar o envio de verdade sem inventar número.
   - **Caminho único:** só uma função monta o link do WhatsApp, e ela roda depois da validação. Não existe link de WhatsApp no HTML e o formulário não tem `action`; sem JavaScript, nada é enviado.

6. **O tom e o visual seguem o cliente.** Nada de "energia do futuro", "grátis", promessa acima de 90% ou prazo inventado. As cores vêm da logo e o laranja fica só na ação. Os valores ficam no arquivo de design.

## Parte 2 — O que fica de fora

| Corte | Motivo |
|---|---|
| "Até 95%", "energia do futuro", "+300 clientes" | Herança de 2021 que o brief contradiz ou proíbe. |
| Comercial, indústria, rural, manutenção de terceiros | A empresa não faz isso ou não é o público desta página. |
| Quem somos, missão, visão, valores | É o que a página não pode continuar sendo. Os fatos que importam foram para a objeção 1. |
| Parceiros, blog, mapa, redes, banner de cookies | Não ajudam a pedir a simulação. |
| Menu e botão flutuante de WhatsApp | São saídas, e o botão flutuante pularia o filtro dos R$ 450. |
| Calculadora de economia | Depois da Lei 14.300 o cálculo é individual. A simulação é o produto. |
| Percentual de economia do caso de Sorocaba | O brief dá R$ 780 e R$ 118, não o percentual. Número calculado por nós não é número do brief. |
| E-mail, assunto e mensagem no formulário | O cliente pediu só quatro dados. Cada campo a mais perde pedido. |
| **Anexo da conta** (pedido no brief) | O WhatsApp com mensagem preenchida não leva arquivo. A foto é pedida na própria conversa. |
| Fotos e vídeos | Não vieram no material. Entram quando chegarem, sem placeholder. |
| Endereço completo e CNPJ | Não estão no brief. A página diz "sede em Sorocaba". |
| Link para as avaliações do Google | O endereço não veio. A nota aparece como texto. |
| Fonte Poppins, gradientes e cards com ícone do site de 2021 | O visual antigo é o da página que "quase não traz cliente". A fonte passa a ser a da própria logo. |

**Pendente com o cliente:** WhatsApp real, fotos e vídeos, link do Google, endereço e CNPJ.
