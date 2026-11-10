# Ravena Solar — página de simulação

Página única para o dono de casa de Sorocaba e região pedir uma simulação de energia solar. Prática P1 da 202; o cliente é fictício.

**No ar:** https://ravena-solar-lp.vercel.app/ (Vercel, publicada a partir da `main`)

## Onde está cada coisa

| Arquivo | O que é |
|---|---|
| [`SPEC.md`](SPEC.md) | O que a página faz, o que ficou de fora e por quê |
| [`DESIGN.md`](DESIGN.md) | Cores (lidas da logo), tipografia, espaços e componentes |
| [`CLAUDE.md`](CLAUDE.md) | Instruções que o agente lê ao abrir o projeto |
| [`verificacao/`](verificacao/) | Capturas de celular e computador, e o teste do filtro de R$ 450 |
| `index.html`, `styles.css`, `script.js` | A página. Sem build e sem dependência |

## Rodar

Abra o `index.html` no navegador. Para repetir a verificação, veja [`verificacao/README.md`](verificacao/README.md).

## Pendente com o cliente

Número do WhatsApp (constante `WHATSAPP_NUMERO` em `script.js`), fotos e vídeos, link do Google, endereço e CNPJ.
