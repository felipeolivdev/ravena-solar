// Renderiza os modelos 3D para assets/3d/ e grava as âncoras da camada de texto em pontos.json.
// Uso:  cd modelos && npm install && node renderizar.mjs
import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const saida = path.resolve(aqui, '..', 'assets', '3d');
const TIPOS = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json' };

// Módulos ES não carregam por file://; um servidor local só para esta pasta.
const servidor = createServer(async (req, res) => {
  const alvo = path.join(aqui, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!alvo.startsWith(aqui)) { res.writeHead(403).end(); return; }
  let corpo;
  try { corpo = await readFile(alvo); } catch { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'Content-Type': TIPOS[path.extname(alvo)] || 'application/octet-stream' });
  res.end(corpo);
}).listen(0, '127.0.0.1');
await new Promise((ok) => servidor.once('listening', ok));
const porta = servidor.address().port;

const navegador = await chromium.launch({ channel: 'msedge', args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] });
const pagina = await navegador.newPage();
pagina.on('console', (m) => { if (m.type() === 'error') console.error('[página]', m.text()); });
pagina.on('pageerror', (e) => console.error('[página]', e.message));
await pagina.goto(`http://127.0.0.1:${porta}/render.html`);
await pagina.waitForFunction(() => window.pronto === true);

await mkdir(saida, { recursive: true });
const nomes = process.argv.slice(2).length ? process.argv.slice(2) : await pagina.evaluate(() => window.nomes);
const pontos = {};
for (const nome of nomes) {
  const r = await pagina.evaluate((n) => window.gerar(n), nome);
  const bytes = Buffer.from(r.png.split(',')[1], 'base64');
  await writeFile(path.join(saida, `${nome}.png`), bytes);
  pontos[nome] = { desenho: r.desenho, largura: r.largura, altura: r.altura, pontos: r.pontos };
  console.log(`${nome}.png  ${r.largura}x${r.altura}  ${Math.round(bytes.length / 1024)} KB`);
}
const arquivoPontos = path.join(aqui, 'pontos.json');
let anteriores = {};
try { anteriores = JSON.parse(await readFile(arquivoPontos, 'utf8')); } catch {}
await writeFile(arquivoPontos, JSON.stringify({ ...anteriores, ...pontos }, null, 2) + '\n');

await navegador.close();
servidor.close();
