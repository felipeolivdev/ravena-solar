// Os modelos: corte do telhado e crédito (dia e noite).
// Cada função devolve { cena, camera, pontos }: pontos são as âncoras da camada de texto.
import {
  THREE, AZUL, AMBAR, BRANCO, mistura, tons, novaCena, solido, linha, segmentos,
  cameraIso, projetar,
} from './comum.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const caixa = (x0, x1, y0, y1, z0, z1) =>
  new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0).translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);

const MADEIRA = '#' + mistura(BRANCO, AZUL, 0.10).getHexString().toUpperCase();

/* ---------- Corte do telhado ---------- */
export function telhado() {
  const cena = novaCena();
  const iso = { luz: V(0, 0, 1), sombra: V(1, 0, 0) };
  const tMadeira = tons(MADEIRA), tBranco = tons(BRANCO), tAzul = tons(AZUL);

  // Caibros (ao longo da descida do telhado) e ripas (atravessadas).
  for (const x of [40, 100]) cena.add(solido(caixa(x - 3, x + 3, -9, -3, -30, 30), tMadeira, iso));
  for (const z of [-20, 24]) cena.add(solido(caixa(0, 140, -3, 0, z - 2, z + 2), tMadeira, iso));

  // Telha ondulada: perfil em x, corte na frente (z = 12). Cavas em x = 0, 20, 40...
  const ONDA = 20, AMPL = 6, ESP = 1.4;
  const fundo = (x) => AMPL * (1 - Math.cos(2 * Math.PI * x / ONDA)) / 2;
  const perfil = new THREE.Shape();
  perfil.moveTo(0, fundo(0));
  for (let i = 1; i <= 280; i++) perfil.lineTo(i / 2, fundo(i / 2));
  for (let i = 280; i >= 0; i--) perfil.lineTo(i / 2, fundo(i / 2) + ESP);
  const telha = new THREE.ExtrudeGeometry(perfil, { depth: 42, bevelEnabled: false }).translate(0, 0, -30);
  cena.add(solido(telha, tBranco, { ...iso, limiarTopo: 0.9, limiarAresta: 40 }));

  // Ganchos: presos no caibro, passam por baixo da telha e sobem pela cava até o trilho.
  const gancho = (x, trechos) => {
    for (const [z0, z1, y0, y1] of trechos) {
      cena.add(solido(caixa(x - 1.6, x + 1.6, y0, y1, z0, z1), tAzul, { ...iso, largura: 1.5 }));
    }
  };
  for (const x of [40, 100]) {
    gancho(x, [[4, 20, -3, -2], [3, 5, -3, 3.4], [-1, 5, 2.4, 3.4], [-1, 1, 2.4, 10]]);
    gancho(x, [[-29, -27, ESP, 10]]);
  }

  // Trilhos e painel (afastado para cima, para mostrar a estrutura).
  for (const z of [0, -28]) cena.add(solido(caixa(4, 136, 10, 14, z - 2, z + 2), tAzul, iso));
  const PAINEL_Y = 22;
  cena.add(solido(caixa(-2, 142, PAINEL_Y, PAINEL_Y + 2.5, -40, 3), tAzul, { ...iso, contorno: AZUL }));
  const topo = PAINEL_Y + 2.6, celulas = [];
  for (let i = 1; i < 6; i++) celulas.push([[-2 + i * 24, topo, -40], [-2 + i * 24, topo, 3]]);
  for (let j = 1; j < 3; j++) celulas.push([[-2, topo, -40 + j * 43 / 3], [142, topo, -40 + j * 43 / 3]]);
  cena.add(segmentos(celulas, BRANCO, 1.5));
  for (const x of [6, 134]) cena.add(linha([[x, 14, 0], [x, PAINEL_Y, 0]], AZUL, 1.5, [1.2, 1.4]));

  const W = 420, H = 250;
  const camera = cameraIso(V(0.95, 0.9, 1.35), cena, W, H, [6, 8, 288, 234]);
  const pontos = {
    painel: projetar(camera, [142, PAINEL_Y + 1.2, -18]),
    estrutura: projetar(camera, [136, 12, 0]),
    telhado: projetar(camera, [140, 2, 0]),
  };
  return { cena, camera, pontos };
}

/* ---------- Crédito: a mesma casa e o mesmo poste, de dia e de noite ---------- */
function seta(x0, x1, y, z, cor) {
  // Seta chata, de pé, de x0 para x1.
  const d = Math.sign(x1 - x0), ponta = 7 * d;
  const s = new THREE.Shape();
  s.moveTo(x0, y - 1.6); s.lineTo(x1 - ponta, y - 1.6); s.lineTo(x1 - ponta, y - 4.5); s.lineTo(x1, y);
  s.lineTo(x1 - ponta, y + 4.5); s.lineTo(x1 - ponta, y + 1.6); s.lineTo(x0, y + 1.6); s.closePath();
  return solido(new THREE.ExtrudeGeometry(s, { depth: 2, bevelEnabled: false }).translate(0, 0, z - 1), tons(cor), { contorno: cor === AZUL ? AZUL : AZUL, largura: 1.5 });
}

export function credito(momento) {
  const cena = novaCena();
  const iso = { luz: V(0, 0, 1), sombra: V(1, 0, 0) };
  const tAzul = tons(AZUL), tBranco = tons(BRANCO);

  cena.add(solido(caixa(-62, 84, -3, 0, -34, 34), tons(MADEIRA), iso));
  // Casa
  cena.add(solido(caixa(-42, 0, 0, 26, -20, 20), tBranco, iso));
  const empena = new THREE.Shape();
  empena.moveTo(-25, 26); empena.lineTo(25, 26); empena.lineTo(0, 45); empena.closePath();
  const telhado = new THREE.ExtrudeGeometry(empena, { depth: 48, bevelEnabled: false })
    .rotateY(Math.PI / 2).translate(-45, 0, 0);
  cena.add(solido(telhado, tBranco, { ...iso, limiarTopo: 0.6 }));
  // Painel na água da frente
  const inclinacao = Math.atan2(19, 25);
  const painel = new THREE.BoxGeometry(30, 1.4, 16).rotateX(inclinacao)
    .translate(-21, 26 + 19 * 0.5 + 1.3, 12.5 - 0.6);
  cena.add(solido(painel, tAzul, iso));
  const porta = caixa(-14, -6, 0, 14, 20, 21);
  cena.add(solido(porta, tAzul, iso));
  // Poste da rede e fio até a casa
  cena.add(solido(new THREE.CylinderGeometry(1.6, 1.6, 54, 16).translate(62, 27, 0), tAzul, { ...iso, limiarAresta: 60 }));
  cena.add(solido(caixa(53, 71, 46, 48, -1.2, 1.2), tAzul, iso));
  cena.add(solido(caixa(56, 68, 39, 41, -1.2, 1.2), tAzul, iso));
  const fio = [];
  for (let i = 0; i <= 16; i++) { const t = i / 16; fio.push([62 - t * 62, 47 - t * 25 - Math.sin(Math.PI * t) * 3, 0]); }
  cena.add(linha(fio, AZUL, 1.5));

  // Céu: sol ou lua, no mesmo lugar dos dois quadros.
  const CEU = [-58, 64, -24];
  if (momento === 'dia') {
    // Sol da logo: disco de frente para quem olha.
    const sol = solido(new THREE.CylinderGeometry(9, 9, 2, 48).rotateX(Math.PI / 2), { topo: new THREE.Color(AMBAR), luz: new THREE.Color(AMBAR), sombra: mistura(AMBAR, AZUL, 0.16) }, { semContorno: true });
    sol.position.set(...CEU);
    sol.lookAt(V(...CEU).add(V(0.95, 0.9, 1.35)));
    cena.add(sol);
    cena.add(linha([[CEU[0] + 9, CEU[1] - 8, CEU[2] + 10], [-28, 40, 10]], AMBAR, 2, [2.5, 3]));
    cena.add(seta(4, 50, 15, 8, AMBAR));
  } else {
    const lua = new THREE.Shape();
    lua.absarc(0, 0, 9, Math.PI * 0.35, Math.PI * 1.65, false);
    lua.absarc(4.5, 0, 7.2, Math.PI * 1.75, Math.PI * 0.25, true);
    const g = new THREE.ExtrudeGeometry(lua, { depth: 2, bevelEnabled: false });
    const m = solido(g, tAzul, { semContorno: true });
    m.position.set(...CEU);
    m.lookAt(V(...CEU).add(V(0.95, 0.9, 1.35)));
    cena.add(m);
    cena.add(seta(50, 4, 15, 8, AZUL));
  }

  // O enquadramento é o mesmo nos dois quadros: calculado com sol e lua no mesmo lugar.
  const W = 340, H = 210;
  const molde = novaCena();
  molde.add(cena.clone());
  molde.add(solido(new THREE.SphereGeometry(9, 8, 8).translate(...CEU), tBranco, { semContorno: true }));
  const camera = cameraIso(V(0.95, 0.9, 1.35), molde, W, H, [6, 6, 328, 182]);
  const pontos = { rede: projetar(camera, [62, -3, 34]) };
  return { cena, camera, pontos };
}
