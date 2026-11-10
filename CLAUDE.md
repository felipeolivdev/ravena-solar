# Ravena Solar — landing page de simulação

Cliente fictício (prática P1 da 202). Trate os números do brief como reais. O mesmo cliente volta na P2.

## Fontes e precedência

`SPEC.md` > `brief.md` > nada mais. Decisão nova ou mudança de escopo: atualize a SPEC (com o "por quê") antes de mexer no código.

`material/site-antigo/` não é fonte de nada: não tire dele texto, número, telefone, CNPJ nem cor. O telefone `(15) 99000-0000` e o CNPJ que aparecem lá são placeholders. As cores `#1d8f7e`, `#0d2c42` e `#155a7a` não são da marca.

## Regras que não podem quebrar

- **Cor:** só as da `material/logo.svg`, lidas do arquivo. Os tokens ficam em `DESIGN.md` e o código consome dele. Não invente cor de marca. O laranja aparece só na ação (botão e foco do formulário); a logo é a exceção.
- **Número:** toda cifra, prazo e percentual sai do brief. Se não está lá, não entra, nem "aproximado".
- **Pendências do cliente** (WhatsApp, fotos, vídeos, link do Google, endereço, CNPJ): não invente. O número do WhatsApp fica em uma constante só, marcada `TODO cliente`. Foto e vídeo não entram nem como placeholder.
- **Filtro de R$ 450:** nenhum caminho até o WhatsApp pode pular a validação da conta. Isso inclui link direto, botão flutuante e `wa.me` solto.
- **Mensagem do WhatsApp:** começa com `[Simulação site]`. O cliente conta os leads por essa etiqueta, então não altere o texto.
- **Tom:** antes de entregar, procure no texto por "futuro", "sustentab", "revoluç", "grátis", "gratuito", "95%", "zera". A visita é "sem custo e sem compromisso", não "grátis". A conta não zera.
- Idioma pt-BR, com moeda no formato "R$ 16.300".

## Entregáveis (o avaliador confere)

Página publicada e repositório público no GitHub, contendo: `SPEC.md`, este `CLAUDE.md`, `DESIGN.md` (tokens e decisões visuais) e evidência de verificação em `verificacao/`. Nessa pasta ficam capturas de mobile e desktop e o teste do bloqueio abaixo de R$ 450 e do envio acima disso. Sem evidência, a tarefa não está pronta.
