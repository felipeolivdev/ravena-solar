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
  '80': 'raio de 80 km', '11': 'onze pessoas',
};
const PROIBIDAS = ['futuro', 'sustentab', 'revoluç', 'grátis', 'gratuito', '95%', 'zera',
  '+300', 'indústria', 'manutenção', 'missão', '99000-0000'];
const CORES_DA_LOGO = [...new Set(
  readFileSync(path.join(raiz, 'assets/logo.svg'), 'utf8').match(/#[0-9a-fA-F]{6}/g).map(c => c.toUpperCase())
)];

const navegador = await chromium.launch({ channel: 'msedge' });

// As capturas e medições usam "menos movimento", para pegar a página já assentada.
async function abrir(largura, altura, opcoes = {}) {
  const contexto = await navegador.newContext({ viewport: { width: largura, height: altura }, deviceScaleFactor: 1, reducedMotion: 'reduce', ...opcoes });
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
conferir(await estilo(celular, '.hero', 'backgroundColor') === rgb('#123A55'), 'Primeira tela tem fundo #123A55');
conferir(await estilo(celular, 'h1', 'color') === rgb('#FFFFFF'), 'Promessa em #FFFFFF sobre o azul');
conferir(await estilo(celular, '.destaque-ambar', 'color') === rgb('#F2A03D'), 'Intervalo "75% a 90%" em #F2A03D');
conferir(await estilo(celular, '.prova-lista', 'backgroundColor') === rgb('#FFFFFF'), 'Cartão de prova tem fundo #FFFFFF');
conferir(await estilo(celular, '.prova .numero', 'color') === rgb('#123A55'), 'Número do cartão de prova é #123A55 (âmbar não é texto sobre branco)');
conferir(await estilo(celular, '.caso .numero:not(.numero-branco)', 'color') === rgb('#F2A03D'), 'Valor de depois, no caso, em #F2A03D sobre azul');
conferir(await estilo(celular, '.prova-lista', 'borderTopLeftRadius') === '12px', 'Cartão com canto de 12px', await estilo(celular, '.prova-lista', 'borderTopLeftRadius'));
const trilho = await celular.locator('.barra-antes').boundingBox();
const depois = await celular.locator('.barra-depois').boundingBox();
conferir(Math.abs(depois.width / trilho.width - 118 / 780) < 0.01, 'Barras do caso na proporção de R$ 118 para R$ 780', `${Math.round(depois.width)}px de ${Math.round(trilho.width)}px`);
const larguraBarra = (s) => celular.evaluate((sel) => {
  const b = document.querySelector(sel);
  return b.getBoundingClientRect().width / b.parentElement.getBoundingClientRect().width;
}, s);
const g25 = await larguraBarra('.garantia-25'), g10 = await larguraBarra('.garantia-10'), g5 = await larguraBarra('.garantia-5');
conferir(Math.abs(g25 - 1) < 0.01 && Math.abs(g10 - 10 / 25) < 0.01 && Math.abs(g5 - 5 / 25) < 0.01,
  'Barras das garantias na proporção de 25, 10 e 5 anos sobre 25', `${g25.toFixed(2)} / ${g10.toFixed(2)} / ${g5.toFixed(2)}`);
conferir(await estilo(celular, '.texto .ancora .numero', 'color') === rgb('#123A55'), 'Número de destaque do telhado ("5 anos") em #123A55');
conferir((await celular.locator('.texto .ancora .numero').innerText()) === '5 anos', 'O número de destaque do telhado é a garantia de 5 anos da instalação');
const pseudo = (s, p, prop) => celular.evaluate(([a, b, c]) => getComputedStyle(document.querySelector(a), b)[c], [s, p, prop]);
conferir(await pseudo('.etapa-cpfl', '::before', 'backgroundColor') === rgb('#FFFFFF')
  && await pseudo('.etapas li:first-child', '::before', 'backgroundColor') === rgb('#123A55'),
  'Etapa da CPFL com ponto vazado; as outras com ponto cheio');
conferir((await pseudo('.etapa-obra', '::before', 'boxShadow')).includes(rgb('#F2A03D')), 'Etapa da instalação com anel #F2A03D');
for (const s of ['.hero', '.secao-azul']) {
  const ok = await pseudo(s, '::before', 'backgroundColor') === rgb('#FFFFFF')
    && await pseudo(s, '::before', 'opacity') === '0.06'
    && await pseudo(s, '::before', 'backgroundImage') === 'none';
  conferir(ok, `Textura do painel em ${s}: #FFFFFF com opacidade 0,06, sem imagem de fundo`);
}
conferir(Math.round((await celular.locator('section.caso').boundingBox()).width) === 390, 'Caso de Sorocaba em faixa de ponta a ponta (390px no celular)');
const ambarEmBranco = await celular.evaluate((cor) => [...document.querySelectorAll('body *')]
  .filter(e => getComputedStyle(e).color === cor && e.textContent.trim() && !e.closest('.hero, .secao-azul, .caso'))
  .map(e => e.tagName.toLowerCase() + '.' + e.className), rgb('#F2A03D'));
conferir(ambarEmBranco.length === 0, 'Nenhum texto âmbar fora de fundo azul', ambarEmBranco.join(', '));
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

// ---------- Mecânica: topo fixo, barra do celular, sem JavaScript
titulo('Mecânica');
conferir(!(await celular.locator('#barra-fixa').evaluate(e => e.classList.contains('ativa'))), 'Celular, primeira tela: a barra de ação fica escondida (o botão já está à vista)');
await celular.locator('.caso').scrollIntoViewIfNeeded();
await celular.waitForFunction(() => document.getElementById('barra-fixa').classList.contains('ativa'));
conferir(true, 'Celular, meio da página: a barra de ação aparece');
conferir((await celular.evaluate(() => getComputedStyle(document.getElementById('topo')).position)) === 'sticky'
  && (await celular.locator('#topo').boundingBox()).y === 0, 'O topo com a logo fica preso no alto ao rolar');
await celular.screenshot({ path: path.join(aqui, `celular-390-meio-barra-de-acao${sufixo}.png`) });
await celular.locator('#simulacao').scrollIntoViewIfNeeded();
await celular.waitForFunction(() => !document.getElementById('barra-fixa').classList.contains('ativa'));
conferir(true, 'Celular, formulário à vista: a barra de ação some');
await celular.evaluate(() => window.scrollTo(0, 0));
conferir(await computador.locator('.botao-topo').isVisible() && !(await computador.locator('#barra-fixa').isVisible()), 'Computador: botão no topo fixo, sem barra no pé');
conferir(await computador.locator('.hero-arte svg').isVisible(), 'Computador: a marca da logo aparece ampliada na primeira tela');

const comMovimento = await abrir(390, 844, { reducedMotion: 'no-preference' });
const altura = await comMovimento.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < altura; y += 500) { await comMovimento.evaluate((v) => window.scrollTo(0, v), y); await comMovimento.waitForTimeout(120); }
await comMovimento.waitForTimeout(900);
const escondidos = await comMovimento.evaluate(() => [...document.querySelectorAll('[data-revelar]')].filter(e => getComputedStyle(e).opacity !== '1').length);
conferir(escondidos === 0, 'Com movimento ligado, toda seção termina visível depois de rolar a página', `ainda escondidas: ${escondidos}`);

const semJs = await abrir(390, 844, { javaScriptEnabled: false });
const escondidosSemJs = await semJs.locator('[data-revelar]').evaluateAll(els => els.filter(e => getComputedStyle(e).opacity !== '1').length);
conferir(escondidosSemJs === 0, 'Sem JavaScript, todo o conteúdo nasce visível');
conferir(await semJs.locator('noscript').count() === 1 && !(await semJs.locator('#barra-fixa').isVisible()), 'Sem JavaScript, o formulário avisa que precisa dele e não há atalho de envio');

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
conferir(!/usamos esses dados/i.test(texto), 'Sem promessa sobre uso dos dados que o cliente ainda não confirmou');
linhas.push('', 'Número na página -> trecho do brief');
for (const n of numeros) linhas.push(`  ${n.padEnd(7)} ${NUMEROS_DO_BRIEF[n] || '(SEM ORIGEM)'}`);

// ---------- 4. Ação única e filtro de R$ 450
titulo('Ação única e caminhos até o WhatsApp');
await celular.reload();
const links = await celular.evaluate(() => [...document.querySelectorAll('a')].map(a => a.getAttribute('href')));
conferir(links.every(h => h === '#simulacao'), 'Todo link da página leva ao formulário', links.join(', '));
const html = await celular.content();
conferir(!/wa\.me|whatsapp\.com|tel:/i.test(html), 'Nenhum link de WhatsApp ou telefone no HTML');
conferir(await celular.locator('#form-simulacao').getAttribute('action') === null, 'O formulário não tem action (sem JavaScript, nada é enviado)');
conferir(await celular.locator('#form-conta-hero').getAttribute('action') === '#simulacao', 'O campo da primeira tela, sem JavaScript, só leva ao formulário');
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
  await pagina.click('#form-simulacao .botao');
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

// Resposta enquanto a pessoa preenche
await celular.reload();
await celular.locator('#whatsapp').pressSequentially('15912345678');
conferir(await celular.inputValue('#whatsapp') === '(15) 91234-5678', 'Máscara do WhatsApp: 15912345678 vira (15) 91234-5678', await celular.inputValue('#whatsapp'));
await celular.locator('#conta').pressSequentially('R$ 780 reais');
conferir(await celular.inputValue('#conta') === '780', 'Campo da conta só aceita número', await celular.inputValue('#conta'));
conferir(await celular.locator('#confere-conta').isVisible(), 'Conta de 780: mostra "dá para simular" ao digitar');
await celular.fill('#conta', '200');
await celular.locator('#nome').focus();
conferir(await celular.locator('#aviso-bloqueio').isVisible() && !(await celular.locator('#confere-conta').isVisible()), 'Conta de 200: o aviso dos R$ 450 aparece ao sair do campo, antes de enviar');
await celular.fill('#conta', '600');
conferir(!(await celular.locator('#aviso-bloqueio').isVisible()), 'Corrigindo para 600, o aviso some');

// Teclado: Enter dentro do campo também passa pelo filtro.
await celular.reload();
await celular.fill('#nome', 'Marta Teste');
await celular.fill('#whatsapp', '15912345678');
await celular.selectOption('#cidade', { label: 'Itu' });
await celular.fill('#conta', '200');
await celular.press('#conta', 'Enter');
conferir((await celular.evaluate(() => window.__abertos)).length === 0, 'Enter no campo com conta de R$ 200: também bloqueia');

// Primeira tela: a conta como primeiro passo. Nunca abre o WhatsApp.
titulo('Primeira tela: campo da conta');
async function hero(pagina, valor) {
  await pagina.reload();
  await pagina.evaluate(() => window.scrollTo(0, 0));
  if (valor !== null) await pagina.locator('#conta-hero').pressSequentially(valor);
  await pagina.click('#botao-hero');
  await pagina.waitForTimeout(300);
  return {
    abertos: await pagina.evaluate(() => window.__abertos),
    aviso: await pagina.locator('#aviso-hero').isVisible(),
    conta: await pagina.inputValue('#conta'),
    foco: await pagina.evaluate(() => document.activeElement && document.activeElement.id),
    formNaTela: await pagina.evaluate(() => { const r = document.getElementById('simulacao').getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; }),
  };
}
for (const v of ['200', '449,99']) {
  const r = await hero(celular, v);
  conferir(r.aviso && r.abertos.length === 0 && r.conta === '' && !r.formNaTela, `Primeira tela, conta "${v}": avisa ali mesmo, não leva ao formulário e não abre o WhatsApp`);
  if (v === '200') {
    await celular.locator('#aviso-hero').scrollIntoViewIfNeeded();
    await celular.screenshot({ path: path.join(aqui, `celular-390-primeira-tela-bloqueio-200${sufixo}.png`) });
  }
}
for (const v of ['450', '780']) {
  const r = await hero(celular, v);
  conferir(!r.aviso && r.abertos.length === 0 && r.conta === v && r.foco === 'nome' && r.formNaTela,
    `Primeira tela, conta "${v}": leva ao formulário com a conta preenchida e o cursor no nome, sem abrir o WhatsApp`, `conta=${r.conta} foco=${r.foco}`);
}
const heroVazio = await hero(celular, null);
conferir(!heroVazio.aviso && heroVazio.abertos.length === 0 && heroVazio.formNaTela, 'Primeira tela em branco: o botão só leva ao formulário');
// O valor trazido da primeira tela ainda passa pelo filtro do formulário.
await celular.reload();
await celular.locator('#conta-hero').pressSequentially('780');
await celular.click('#botao-hero');
await celular.fill('#nome', 'Marta Teste');
await celular.fill('#whatsapp', '15912345678');
await celular.selectOption('#cidade', { label: 'Salto' });
await celular.fill('#conta', '300');
await celular.click('#form-simulacao .botao');
conferir((await celular.evaluate(() => window.__abertos)).length === 0, 'Valor trazido da primeira tela e trocado para 300 no formulário: bloqueia');
await celular.reload();
await celular.locator('#conta-hero').pressSequentially('780');
await celular.click('#botao-hero');
await celular.fill('#nome', 'Marta Teste');
await celular.fill('#whatsapp', '15912345678');
await celular.selectOption('#cidade', { label: 'Salto' });
await celular.click('#form-simulacao .botao');
const heroEnvio = await celular.evaluate(() => window.__abertos);
conferir(heroEnvio.length === 1 && decodeURIComponent(heroEnvio[0]).includes('Conta média de luz: R$ 780'), 'Valor de 780 trazido da primeira tela chega à mensagem do WhatsApp');

titulo('Quarta versão: diagramas, blocos de anos e ação do caso');
const blocos = await celular.evaluate(() => [...document.querySelectorAll('.anos .ano')].map(e => getComputedStyle(e).backgroundColor + '|' + getComputedStyle(e).opacity));
conferir(blocos.length === 25 && blocos.slice(0, 3).every(b => b === `${rgb('#F2A03D')}|1`) && blocos[3] === `${rgb('#F2A03D')}|0.45`
  && blocos.slice(4).every(b => b === `${rgb('#123A55')}|1`), 'Blocos de anos: 25 blocos, 3 âmbar, o quarto âmbar claro, o resto azul');
conferir(await celular.locator('.caso .botao').getAttribute('href') === '#simulacao', 'O caso de Sorocaba termina com o botão que leva ao formulário');
conferir(await celular.locator('.ancora-objecao .numero').innerText() === '11 pessoas', 'Objeção 1 tem "11 pessoas" como número de destaque');
const diagramasVisiveis = (pagina) => pagina.evaluate(() => [...document.querySelectorAll('figure.diagrama')]
  .filter(f => getComputedStyle(f).display !== 'none')
  .map(f => {
    const img = f.querySelector('.render img'); const r = img.getBoundingClientRect();
    return { classe: f.className, legenda: !!f.querySelector('figcaption').textContent.trim(), rotulo: !!img.getAttribute('alt').trim() && img.complete && img.naturalWidth > 0, altura: r.height };
  }));
for (const [pagina, nome, classeMapa] of [[celular, 'celular', 'mapa-compacto'], [computador, 'computador', 'diagrama-mapa']]) {
  const d = await diagramasVisiveis(pagina);
  conferir(d.length === 4 && d.every(x => x.legenda && x.rotulo && x.altura > 50) && d.some(x => x.classe.includes(classeMapa)),
    `${nome}: os quatro modelos 3D (telhado, crédito de dia e de noite, mapa) carregam e aparecem, com legenda e texto alternativo`, d.map(x => Math.round(x.altura)).join(' / '));
}
const coresSvg = await celular.evaluate(() => {
  const s = new Set();
  document.querySelectorAll('.diagrama .render-texto *').forEach(e => { const c = getComputedStyle(e); [c.fill, c.stroke].forEach(v => { if (v && v !== 'none') s.add(v); }); });
  return [...s];
});
const permitidas = ['#123A55', '#F2A03D', '#FFFFFF'].map(rgb).concat(['rgba(18, 58, 85, 0.76)', 'rgba(18, 58, 85, 0.18)', 'rgba(18, 58, 85, 0.05)', 'rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.24)']);
conferir(coresSvg.every(c => permitidas.includes(c)), 'Camada de texto dos diagramas só com cores da logo (e sem laranja, que é só da ação)', coresSvg.join(' | '));
await semJs.waitForFunction(() => [...document.querySelectorAll('.render img')].every(i => i.complete));
conferir(await semJs.locator('figure.diagrama:not(.so-computador) .render img').evaluateAll(els => els.every(e => e.naturalWidth > 0 && e.getBoundingClientRect().height > 50)), 'Sem JavaScript, os modelos 3D aparecem');

titulo('Modelos 3D (assets/3d)');
// Cada imagem: só as cores da logo e os tons do DESIGN.md ("Modelos 3D"), em 2x, dentro do peso.
if (!noAr) {
  const hexRgb = (h) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
  const [AZ, AM, BR] = ['#123A55', '#F2A03D', '#FFFFFF'].map(hexRgb);
  const tres = (c) => c === AZ ? [mix(AZ, BR, 0.14), mix(AZ, BR, 0.06), AZ] : [c, mix(c, AZ, 0.16), mix(c, AZ, 0.32)];
  const madeira = mix(BR, AZ, 0.10);
  const paleta = [...tres(AZ), ...tres(AM), ...tres(BR), ...tres(madeira),
    ...[0.06, 0.10, 0.12, 0.14, 0.16, 0.20, 0.24].map(t => mix(AZ, BR, t))];
  const pontosDoModelo = JSON.parse(readFileSync(path.join(raiz, 'modelos/pontos.json'), 'utf8'));
  for (const nome of ['telhado', 'credito-dia', 'credito-noite', 'mapa', 'mapa-compacto']) {
    const arquivo = path.join(raiz, 'assets/3d', `${nome}.png`);
    const bytes = readFileSync(arquivo);
    const r = await celular.evaluate(async ([dados, pal]) => {
      const img = new Image(); img.src = dados; await img.decode();
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
      const g = c.getContext('2d'); g.drawImage(img, 0, 0);
      const d = g.getImageData(0, 0, c.width, c.height).data;
      // Um pixel vale se é um tom da paleta ou a mistura de dois deles (borda suavizada entre duas faces).
      const perto = (px, q) => Math.abs(q[0] - px[0]) + Math.abs(q[1] - px[1]) + Math.abs(q[2] - px[2]) <= 6;
      const entre = (px, a, b) => {
        const ab = [0, 1, 2].map(k => b[k] - a[k]), len = ab.reduce((s, v) => s + v * v, 0);
        if (!len) return false;
        const t = Math.max(0, Math.min(1, [0, 1, 2].reduce((s, k) => s + (px[k] - a[k]) * ab[k], 0) / len));
        return perto(px, [0, 1, 2].map(k => a[k] + ab[k] * t));
      };
      const memo = new Map();
      const vale = (px) => {
        const chave = px.join();
        if (!memo.has(chave)) {
          let ok = pal.some(p => perto(px, p)), tipo = ok ? 'tom' : 'fora';
          for (let i = 0; !ok && i < pal.length; i++) for (let j = i + 1; !ok && j < pal.length; j++) if (entre(px, pal[i], pal[j])) { ok = true; tipo = 'borda'; }
          memo.set(chave, tipo);
        }
        return memo.get(chave);
      };
      let opacos = 0, fora = 0, tom = 0; const laranja = [232, 114, 28]; let laranjas = 0;
      for (let i = 0; i < d.length; i += 4) {
        if (d[i + 3] < 255) continue;
        opacos++;
        const px = [d[i], d[i + 1], d[i + 2]];
        const v = vale(px);
        if (v === 'fora') fora++; else if (v === 'tom') tom++;
        if (Math.abs(px[0] - laranja[0]) + Math.abs(px[1] - laranja[1]) + Math.abs(px[2] - laranja[2]) <= 6) laranjas++;
      }
      return { largura: img.width, altura: img.height, opacos, fora, tom, laranjas };
    }, ['data:image/png;base64,' + bytes.toString('base64'), paleta]);
    const [, , w, h] = pontosDoModelo[nome].desenho;
    const naPaleta = 1 - r.fora / r.opacos;
    conferir(naPaleta >= 0.995 && r.laranjas === 0, `${nome}.png: pixels opacos nas cores da logo e nos tons do DESIGN.md (ou borda entre dois deles), sem laranja`,
      `${(r.tom / r.opacos * 100).toFixed(1)}% tons da paleta, ${((naPaleta - r.tom / r.opacos) * 100).toFixed(1)}% borda entre dois tons, ${(r.fora / r.opacos * 100).toFixed(2)}% fora`);
    conferir(r.largura === w * 2 && r.altura === h * 2 && bytes.length <= 120 * 1024, `${nome}.png: em 2x (${w * 2}x${h * 2}) e com até 120 KB`, `${r.largura}x${r.altura}, ${Math.round(bytes.length / 1024)} KB`);
  }
  // A camada de texto do mapa fica exatamente sobre os pinos do modelo.
  const desvios = await computador.evaluate((pts) => {
    const saida = [];
    for (const [sel, nome] of [['.diagrama-mapa', 'mapa'], ['.mapa-compacto', 'mapa-compacto']]) {
      for (const g of document.querySelectorAll(`${sel} .m-local`)) {
        const p = pts[nome].pontos[g.dataset.cidade];
        const a = g.querySelector('.m-anel');
        saida.push(Math.hypot(parseFloat(a.getAttribute('cx')) - p[0], parseFloat(a.getAttribute('cy')) - p[1]));
      }
    }
    for (const c of document.querySelectorAll('.diagrama-mapa [data-cidade-geral]')) {
      const p = pts.mapa.pontos['geral-' + c.dataset.cidadeGeral];
      saida.push(Math.hypot(parseFloat(c.getAttribute('cx')) - p[0], parseFloat(c.getAttribute('cy')) - p[1]));
    }
    return saida;
  }, pontosDoModelo);
  conferir(desvios.length === 12 && desvios.every(d => d < 0.6), 'Mapa: anéis e pontos da camada de texto caem sobre o topo dos pinos do modelo', `maior desvio: ${Math.max(...desvios).toFixed(2)} unidades`);
}

titulo('Mapa do raio');
// Proporção: no quadro ampliado, cada cidade fica na mesma direção e a 5/1,5 da distância da visão geral.
const proporcoes = await computador.evaluate(() => {
  // Posição no chão da maquete (data-chao), antes de o pino subir na projeção.
  const ponto = (sel) => document.querySelector(sel).dataset.chao.split(' ').map(Number);
  const geralSede = ponto('.diagrama-mapa [data-cidade-geral="Sorocaba"]');
  const lupaSede = ponto('.diagrama-mapa [data-cidade="Sorocaba"]');
  return ['Votorantim', 'Itu', 'Salto'].map(c => {
    const g = ponto(`.diagrama-mapa [data-cidade-geral="${c}"]`), l = ponto(`.diagrama-mapa [data-cidade="${c}"]`);
    return [c, (l[0] - lupaSede[0]) / (g[0] - geralSede[0]), (l[1] - lupaSede[1]) / (g[1] - geralSede[1])];
  });
});
conferir(proporcoes.every(([, x, y]) => Math.abs(x - 5 / 1.5) < 0.1 && Math.abs(y - 5 / 1.5) < 0.1),
  'Quadro ampliado mantém as posições da visão geral (escala 5 para 1,5)', proporcoes.map(([c, x, y]) => `${c} ${x.toFixed(2)}/${y.toFixed(2)}`).join(', '));
const iguais = await celular.evaluate(() => {
  const pos = (m) => [...document.querySelectorAll(`${m} .m-local`)].map(g => g.dataset.cidade + g.querySelector('circle:not(.m-anel)').getAttribute('cx')).join();
  return pos('.mapa-compacto') === pos('.diagrama-mapa');
});
conferir(iguais, 'O mapa do celular e o do computador têm as mesmas posições');
conferir(await celular.locator('.mapa-compacto').isVisible() && !(await celular.locator('.diagrama-mapa').isVisible()), 'Celular: o mapa fica no fim do formulário, só com o quadro ampliado');
conferir(await computador.locator('.diagrama-mapa').isVisible() && !(await computador.locator('.mapa-compacto').isVisible()), 'Computador: o mapa fica na coluna da esquerda, com as duas escalas');
const caixa = (sel) => celular.locator(sel).boundingBox();
const [campoCidade, campoConta, botaoForm, mapaCel] = await Promise.all(['#cidade', '#conta', '#form-simulacao .botao', '.mapa-compacto'].map(caixa));
conferir(mapaCel.y > botaoForm.y + botaoForm.height, 'Celular: o mapa fica depois do botão do formulário');
conferir(campoConta.y - (campoCidade.y + campoCidade.height) < 120, 'Celular: nada de grande entre o campo "Cidade" e o da conta', `${Math.round(campoConta.y - (campoCidade.y + campoCidade.height))}px`);

for (const pagina of [celular, computador]) await pagina.reload();
const estadoMapa = (pagina, sel) => pagina.evaluate((s) => ({
  escolhidas: [...document.querySelectorAll(`${s} .m-local.escolhida`)].map(g => g.dataset.cidade),
  outra: document.querySelector(`${s} .mapa`).classList.contains('outra-escolhida'),
  anel: (() => { const a = document.querySelector(`${s} .m-local.escolhida .m-anel`); return a ? getComputedStyle(a).opacity : null; })(),
}), sel);
for (const cidade of ['Sorocaba', 'Votorantim', 'Itu', 'Salto']) {
  await celular.selectOption('#cidade', { label: cidade });
  await computador.selectOption('#cidade', { label: cidade });
  const c = await estadoMapa(celular, '.mapa-compacto'), pc = await estadoMapa(computador, '.diagrama-mapa');
  conferir(c.escolhidas.join() === cidade && pc.escolhidas.join() === cidade && !c.outra && c.anel === '1',
    `Escolher ${cidade} no formulário marca só ${cidade} no mapa (celular e computador)`);
  if (cidade === 'Itu') {
    await celular.locator('.mapa-compacto').scrollIntoViewIfNeeded();
    await celular.screenshot({ path: path.join(aqui, `celular-390-mapa-cidade-itu${sufixo}.png`) });
    await computador.evaluate(() => document.querySelectorAll('[data-revelar]').forEach(e => e.classList.add('visivel')));
    await computador.evaluate(() => document.querySelector('.diagrama-mapa').scrollIntoView({ block: 'center' }));
    await computador.screenshot({ path: path.join(aqui, `computador-1440-mapa-cidade-itu${sufixo}.png`) });
  }
}
await celular.selectOption('#cidade', 'outra');
const outra = await estadoMapa(celular, '.mapa-compacto');
conferir(outra.outra && outra.escolhidas.length === 0, '"Outra cidade" acende o raio e não marca nenhuma das quatro');
await celular.selectOption('#cidade', '');
const nenhuma = await estadoMapa(celular, '.mapa-compacto');
conferir(!nenhuma.outra && nenhuma.escolhidas.length === 0, 'Sem cidade escolhida, o mapa fica sem destaque');
const ambarNome = await computador.evaluate(() => { const t = document.querySelector('.diagrama-mapa .m-local.escolhida text'); return t ? getComputedStyle(t).fill : ''; });
conferir(ambarNome === '' || ambarNome === 'rgb(242, 160, 61)', 'Nome da cidade escolhida em âmbar, sobre o azul do mapa');

await computador.evaluate(() => document.querySelectorAll('[data-revelar]').forEach(e => e.classList.add('visivel')));
for (const [seletor, nome] of [['.diagrama-telhado', 'telhado'], ['.credito', 'credito'], ['.caso-acao', 'caso-acao'], ['.retorno', 'retorno']]) {
  await computador.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center' }), seletor);
  await computador.screenshot({ path: path.join(aqui, `computador-1440-${nome}${sufixo}.png`) });
}

await navegador.close();

linhas.push('', falhas === 0 ? 'RESULTADO: tudo conferido, nenhuma falha.' : `RESULTADO: ${falhas} falha(s).`);
const saida = linhas.join('\n') + '\n';
writeFileSync(path.join(aqui, `resultado${sufixo}.txt`), saida);
console.log(saida);
process.exit(falhas === 0 ? 0 : 1);
