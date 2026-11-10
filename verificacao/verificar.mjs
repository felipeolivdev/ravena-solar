// Verificação da página da Ravena Solar.
// Uso:  node verificar.mjs            (confere o index.html local)
//       node verificar.mjs <URL>      (confere a página no ar)
// Gera as capturas e o resultado.txt nesta pasta. Sai com código 1 se algo falhar.

import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const raiz = path.resolve(aqui, '..');
const alvo = process.argv[2] || pathToFileURL(path.join(raiz, 'index.html')).href;
const noAr = Boolean(process.argv[2]);
const sufixo = noAr ? '-no-ar' : '';

const linhas = [];
let falhas = 0;
function titulo(t) { linhas.push('', `## ${t}`); }
function conferir(ok, descricao, detalhe = '') {
  if (!ok) falhas++;
  linhas.push(`${ok ? 'OK   ' : 'FALHA'}  ${descricao}${detalhe ? `  ->  ${detalhe}` : ''}`);
}

// Todo número que pode aparecer na página, com a origem no brief.
const NUMEROS_DO_BRIEF = {
  '75': 'conta cai entre 75% e 90%', '90': 'conta cai entre 75% e 90%',
  '3': 'retorno de três a quatro anos', '4': 'retorno de três a quatro anos',
  '450': 'conta acima de R$ 450', '412': '412 sistemas residenciais',
  '4,8': 'nota 4,8 no Google', '137': '137 avaliações',
  '6': 'seis anos de empresa', '25': '25 anos de performance / dura mais de 25',
  '10': '10 anos do inversor', '5': '5 anos da instalação / 5 a 8 kWp',
  '8': '5 a 8 kWp', '14.300': 'Lei 14.300', '6,4': 'sistema de 6,4 kWp',
  '2025': 'instalado em março de 2025', '780': 'conta de R$ 780',
  '118': 'conta média de R$ 118', '14': 'R$ 14 mil a R$ 19 mil',
  '19': 'R$ 14 mil a R$ 19 mil', '45': 'de 45 a 60 dias', '60': 'de 45 a 60 dias',
  '80': 'raio de 80 km',
};
const PROIBIDAS = ['futuro', 'sustentab', 'revoluç', 'grátis', 'gratuito', '95%', 'zera',
  '+300', 'indústria', 'manutenção', 'missão', '99000-0000'];
const CORES_DA_LOGO = [...new Set(
  readFileSync(path.join(raiz, 'material/logo.svg'), 'utf8').match(/#[0-9a-fA-F]{6}/g).map(c => c.toUpperCase())
)];

const navegador = await chromium.launch({ channel: 'msedge' });

async function abrir(largura, altura) {
  const contexto = await navegador.newContext({ viewport: { width: largura, height: altura }, deviceScaleFactor: 1 });
  // Captura o link que a página tentaria abrir, sem abrir o WhatsApp de verdade.
  await contexto.addInitScript(() => {
    window.__abertos = [];
    window.open = (url) => { window.__abertos.push(String(url)); return {}; };
  });
  const pagina = await contexto.newPage();
  await pagina.goto(alvo, { waitUntil: 'load' });
  return pagina;
}

linhas.push(`# Verificação — ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC`, `Alvo: ${alvo}`);

// ---------- 1. Celular (390px) e computador (1440px)
titulo('Layout');
const celular = await abrir(390, 844);
const larguraCelular = await celular.evaluate(() => document.documentElement.scrollWidth);
conferir(larguraCelular <= 390, 'Em 390px não há rolagem horizontal', `largura do documento: ${larguraCelular}px`);
const estouros = await celular.evaluate(() =>
  [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > 390.5)
    .map(e => e.tagName.toLowerCase() + (e.className ? '.' + e.className : '')));
conferir(estouros.length === 0, 'Em 390px nenhum elemento passa da borda direita', estouros.join(', '));
const botaoCelular = await celular.locator('.hero .botao').boundingBox();
conferir(botaoCelular.y + botaoCelular.height <= 844, 'Em 390x844 o botão aparece sem rolar', `base do botão em ${Math.round(botaoCelular.y + botaoCelular.height)}px`);
await celular.screenshot({ path: path.join(aqui, `celular-390-primeira-tela${sufixo}.png`) });
await celular.screenshot({ path: path.join(aqui, `celular-390-pagina-inteira${sufixo}.png`), fullPage: true });

const computador = await abrir(1440, 900);
const larguraPc = await computador.evaluate(() => document.documentElement.scrollWidth);
conferir(larguraPc <= 1440, 'Em 1440px não há rolagem horizontal', `largura do documento: ${larguraPc}px`);
await computador.screenshot({ path: path.join(aqui, `computador-1440-primeira-tela${sufixo}.png`) });
await computador.screenshot({ path: path.join(aqui, `computador-1440-pagina-inteira${sufixo}.png`), fullPage: true });

// ---------- 2. Design: o que a página renderiza bate com o DESIGN.md
titulo('Design (valores renderizados x DESIGN.md)');
const rgb = (hex) => `rgb(${parseInt(hex.slice(1, 3), 16)}, ${parseInt(hex.slice(3, 5), 16)}, ${parseInt(hex.slice(5, 7), 16)})`;
const estilo = (pagina, seletor, prop) => pagina.evaluate(([s, p]) => getComputedStyle(document.querySelector(s))[p], [seletor, prop]);
conferir(await estilo(celular, '.botao', 'backgroundColor') === rgb('#E8721C'), 'Fundo do botão é #E8721C');
conferir(await estilo(celular, '.botao', 'color') === rgb('#123A55'), 'Texto do botão é #123A55');
conferir(await estilo(celular, 'body', 'color') === rgb('#123A55'), 'Texto da página é #123A55');
conferir(await estilo(celular, '.prova', 'backgroundColor') === rgb('#123A55'), 'Faixa de prova tem fundo #123A55');
conferir(await estilo(celular, '.prova .numero', 'color') === rgb('#F2A03D'), 'Número da faixa de prova é #F2A03D');
conferir(await estilo(celular, 'h1', 'fontSize') === '34px', 'h1 tem 34px no celular', await estilo(celular, 'h1', 'fontSize'));
conferir(await estilo(computador, 'h1', 'fontSize') === '56px', 'h1 tem 56px no computador', await estilo(computador, 'h1', 'fontSize'));
const familias = await celular.evaluate(() => [...new Set([...document.querySelectorAll('body *')].map(e => getComputedStyle(e).fontFamily))]);
conferir(familias.length === 1 && familias[0].includes('Helvetica Neue'), 'Uma família de fonte só, a da logo', familias.join(' | '));
const laranjas = await celular.evaluate((cor) => {
  const usa = (e) => { const s = getComputedStyle(e); return [s.backgroundColor, s.color, s.borderTopColor, s.borderLeftColor].includes(cor); };
  return [...document.querySelectorAll('body *')].filter(usa).map(e => e.tagName.toLowerCase() + '.' + e.className);
}, rgb('#E8721C'));
conferir(laranjas.every(e => e.includes('botao')), 'O laranja só aparece nos botões', laranjas.join(', '));

if (!noAr) {
  const css = readFileSync(path.join(raiz, 'styles.css'), 'utf8');
  const hexes = [...new Set((css.match(/#[0-9a-fA-F]{3,8}\b/g) || []).map(c => c.toUpperCase()))];
  conferir(hexes.every(c => CORES_DA_LOGO.includes(c)), 'Todo hex do styles.css existe na logo.svg', `css: ${hexes.join(' ')}  |  logo: ${CORES_DA_LOGO.join(' ')}`);
  conferir(!/gradient/i.test(css), 'Nenhum gradiente no styles.css');
  conferir(!/1d8f7e|0d2c42|155a7a|poppins/i.test(css + readFileSync(path.join(raiz, 'index.html'), 'utf8')), 'Nenhuma cor ou fonte do site de 2021');
}

// ---------- 3. Texto: tom e números
titulo('Texto (tom e origem dos números)');
const texto = await celular.evaluate(() => {
  document.querySelectorAll('[hidden]').forEach(e => e.hidden = false); // inclui avisos e erros
  return document.body.innerText + ' ' + document.title + ' ' + document.querySelector('meta[name=description]').content;
});
await celular.reload();
for (const palavra of PROIBIDAS) {
  conferir(!texto.toLowerCase().includes(palavra), `Não contém "${palavra}"`);
}
const numeros = [...new Set(texto.match(/\d+(?:[.,]\d+)*/g))];
const semOrigem = numeros.filter(n => !(n in NUMEROS_DO_BRIEF));
conferir(semOrigem.length === 0, 'Todo número da página tem origem no brief', semOrigem.join(', '));
linhas.push('', 'Número na página -> trecho do brief');
for (const n of numeros) linhas.push(`  ${n.padEnd(7)} ${NUMEROS_DO_BRIEF[n] || '(SEM ORIGEM)'}`);

// ---------- 4. Ação única e filtro de R$ 450
titulo('Ação única e caminhos até o WhatsApp');
const links = await celular.evaluate(() => [...document.querySelectorAll('a')].map(a => a.getAttribute('href')));
conferir(links.every(h => h === '#simulacao'), 'Todo link da página leva ao formulário', links.join(', '));
const html = await celular.content();
conferir(!/wa\.me|whatsapp\.com|tel:/i.test(html), 'Nenhum link de WhatsApp ou telefone no HTML');
conferir(await celular.locator('form').getAttribute('action') === null, 'O formulário não tem action (sem JavaScript, nada é enviado)');
if (!noAr) {
  const js = readFileSync(path.join(raiz, 'script.js'), 'utf8');
  conferir((js.match(/wa\.me/g) || []).length === 1, 'script.js monta o link do WhatsApp em um lugar só');
  conferir(/var WHATSAPP_NUMERO = '';/.test(js) && /TODO cliente/.test(js), 'Número do WhatsApp em uma constante, vazia e marcada TODO cliente');
}

titulo('Formulário: bloqueio abaixo de R$ 450 e envio a partir disso');
async function enviar(pagina, { nome = 'Marta Teste', whatsapp = '(15) 91234-5678', cidade = 'Sorocaba', conta }) {
  await pagina.reload();
  await pagina.fill('#nome', nome);
  await pagina.fill('#whatsapp', whatsapp);
  if (cidade) await pagina.selectOption('#cidade', { label: cidade });
  await pagina.fill('#conta', conta);
  await pagina.click('form .botao');
  return {
    abertos: await pagina.evaluate(() => window.__abertos),
    bloqueio: await pagina.locator('#aviso-bloqueio').isVisible(),
    enviado: await pagina.locator('#aviso-enviado').isVisible(),
    erros: await pagina.locator('.erro:visible').allInnerTexts(),
  };
}

for (const conta of ['200', '449', '449,99', 'R$ 300,00']) {
  const r = await enviar(celular, { conta });
  conferir(r.abertos.length === 0 && r.bloqueio && !r.enviado, `Conta "${conta}": bloqueia, mostra o aviso e não abre o WhatsApp`, `links abertos: ${r.abertos.length}`);
  if (conta === '200') {
    await celular.locator('#aviso-bloqueio').scrollIntoViewIfNeeded();
    await celular.screenshot({ path: path.join(aqui, `celular-390-bloqueio-conta-200${sufixo}.png`) });
    linhas.push(`       aviso exibido: "${(await celular.locator('#aviso-bloqueio').innerText()).replace(/\s+/g, ' ')}"`);
  }
}

let mensagem780 = '';
for (const conta of ['450', '780', 'R$ 1.200,50']) {
  const r = await enviar(celular, { conta });
  const url = r.abertos[0] || '';
  const mensagem = url ? decodeURIComponent(url.split('?text=')[1] || '') : '';
  conferir(r.abertos.length === 1 && !r.bloqueio && r.enviado, `Conta "${conta}": envia e abre um link do WhatsApp`, url.slice(0, 60) + '…');
  conferir(url.startsWith('https://wa.me/?text=') && mensagem.startsWith('[Simulação site]'), `Conta "${conta}": a mensagem começa com [Simulação site]`);
  if (conta === '780') {
    mensagem780 = mensagem;
    await celular.locator('#aviso-enviado').scrollIntoViewIfNeeded();
    await celular.screenshot({ path: path.join(aqui, `celular-390-envio-conta-780${sufixo}.png`) });
  }
}
linhas.push('', 'Mensagem gerada para a conta de R$ 780:', ...mensagem780.split('\n').map(l => '  | ' + l));

const vazio = await enviar(celular, { nome: '', whatsapp: '', cidade: null, conta: '' });
conferir(vazio.abertos.length === 0 && vazio.erros.length === 4, 'Formulário vazio: quatro erros e nenhum link aberto', vazio.erros.join(' / '));
const texto2 = await enviar(celular, { conta: 'uns quinhentos' });
conferir(texto2.abertos.length === 0, 'Conta sem número: não envia', texto2.erros.join(' / '));

await celular.reload();
await celular.selectOption('#cidade', 'outra');
conferir(await celular.locator('#outra-cidade').isVisible(), '"Outra cidade" mostra o campo para o nome da cidade');

// Teclado: Enter dentro do campo também passa pelo filtro.
await celular.reload();
await celular.fill('#nome', 'Marta Teste');
await celular.fill('#whatsapp', '15912345678');
await celular.selectOption('#cidade', { label: 'Itu' });
await celular.fill('#conta', '200');
await celular.press('#conta', 'Enter');
conferir((await celular.evaluate(() => window.__abertos)).length === 0, 'Enter no campo com conta de R$ 200: também bloqueia');

await navegador.close();

linhas.push('', falhas === 0 ? 'RESULTADO: tudo conferido, nenhuma falha.' : `RESULTADO: ${falhas} falha(s).`);
const saida = linhas.join('\n') + '\n';
writeFileSync(path.join(aqui, `resultado${sufixo}.txt`), saida);
console.log(saida);
process.exit(falhas === 0 ? 0 : 1);
