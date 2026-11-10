// Peças comuns dos modelos 3D: cores da logo, sombreado chapado em três tons,
// contorno, câmeras e render. Regras em DESIGN.md, seção "Modelos 3D".
import * as THREE from 'three';
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';

// As cores entram e saem como estão no arquivo (sRGB), sem conversão de espaço de cor.
THREE.ColorManagement.enabled = false;

// Lidas de material/logo.svg (cópia em assets/logo.svg). Laranja não entra: é só da ação.
export const AZUL = '#123A55';
export const AMBAR = '#F2A03D';
export const BRANCO = '#FFFFFF';

// Imagem em 2x da medida de desenho.
export const ESCALA = 2;

// Uma cor da logo com outra da logo por cima, com transparência (como os neutros do DESIGN.md).
export function mistura(base, cobre, alfa) {
  return new THREE.Color(base).lerp(new THREE.Color(cobre), alfa);
}

// Três tons por cor: topo, lado iluminado e lado na sombra.
export function tons(base) {
  if (base === AZUL) {
    return { topo: mistura(AZUL, BRANCO, 0.14), luz: mistura(AZUL, BRANCO, 0.06), sombra: new THREE.Color(AZUL) };
  }
  return { topo: new THREE.Color(base), luz: mistura(base, AZUL, 0.16), sombra: mistura(base, AZUL, 0.32) };
}

let materiaisDeLinha = [];
export function novaCena() {
  materiaisDeLinha = [];
  return new THREE.Scene();
}

function materialDeLinha(cor, largura, tracejado) {
  const m = new LineMaterial({ color: new THREE.Color(cor), linewidth: largura * ESCALA, worldUnits: false });
  if (tracejado) { m.dashed = true; m.dashSize = tracejado[0]; m.gapSize = tracejado[1]; }
  materiaisDeLinha.push(m);
  return m;
}

const CIMA = new THREE.Vector3(0, 1, 0);

// Sólido com cor por face (vertex colors) e contorno nas arestas.
// opcoes: luz e sombra (direções das faces de lado), limiarTopo, contorno, largura, limiarAresta.
export function solido(geometria, t, opcoes = {}) {
  const {
    luz = new THREE.Vector3(0, 0, 1), sombra = new THREE.Vector3(1, 0, 0), cima = CIMA,
    limiarTopo = 0.55, contorno = AZUL, largura = 2, limiarAresta = 30, semContorno = false,
  } = opcoes;
  const g = geometria.index ? geometria.toNonIndexed() : geometria.clone();
  const pos = g.attributes.position;
  const cores = new Float32Array(pos.count * 3);
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  const ab = new THREE.Vector3(), ac = new THREE.Vector3(), n = new THREE.Vector3();
  for (let i = 0; i < pos.count; i += 3) {
    a.fromBufferAttribute(pos, i); b.fromBufferAttribute(pos, i + 1); c.fromBufferAttribute(pos, i + 2);
    n.crossVectors(ab.subVectors(b, a), ac.subVectors(c, a)).normalize();
    let cor;
    if (n.dot(cima) > limiarTopo) cor = t.topo;
    else cor = n.dot(luz) >= n.dot(sombra) ? t.luz : t.sombra;
    for (let k = 0; k < 3; k++) cor.toArray(cores, (i + k) * 3);
  }
  g.setAttribute('color', new THREE.BufferAttribute(cores, 3));
  const malha = new THREE.Mesh(g, new THREE.MeshBasicMaterial({
    vertexColors: true, side: THREE.DoubleSide,
    polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1,
  }));
  const grupo = new THREE.Group();
  grupo.add(malha);
  if (!semContorno) {
    const arestas = new LineSegmentsGeometry().fromEdgesGeometry(new THREE.EdgesGeometry(geometria, limiarAresta));
    grupo.add(new LineSegments2(arestas, materialDeLinha(contorno, largura)));
  }
  return grupo;
}

// Linha (aberta) por uma lista de pontos [x, y, z].
export function linha(pontos, cor, largura = 2, tracejado = null) {
  const g = new LineGeometry();
  g.setPositions(pontos.flat());
  const l = new Line2(g, materialDeLinha(cor, largura, tracejado));
  if (tracejado) l.computeLineDistances();
  return l;
}

// Segmentos soltos: lista de pares de pontos.
export function segmentos(pares, cor, largura = 2) {
  const g = new LineSegmentsGeometry();
  g.setPositions(pares.flat(2));
  return new LineSegments2(g, materialDeLinha(cor, largura));
}

// Câmera isométrica que enquadra a cena dentro de uma região [x, y, largura, altura] do desenho W x H.
export function cameraIso(direcao, cena, W, H, regiao) {
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 4000);
  cam.position.copy(direcao).normalize().multiplyScalar(1500);
  cam.lookAt(0, 0, 0);
  cam.updateMatrixWorld(true);
  cena.updateMatrixWorld(true);
  const v = new THREE.Vector3();
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  cena.traverse((o) => {
    if (!o.isMesh || !o.visible) return;
    const p = o.geometry.attributes.position;
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i).applyMatrix4(o.matrixWorld).applyMatrix4(cam.matrixWorldInverse);
      x0 = Math.min(x0, v.x); x1 = Math.max(x1, v.x); y0 = Math.min(y0, v.y); y1 = Math.max(y1, v.y);
    }
  });
  const [rx, ry, rw, rh] = regiao;
  const s = Math.max((x1 - x0) / rw, (y1 - y0) / rh);
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const mx = rx + rw / 2, my = ry + rh / 2;
  cam.left = cx - mx * s; cam.right = cx + (W - mx) * s;
  cam.top = cy + my * s; cam.bottom = cy - (H - my) * s;
  cam.updateProjectionMatrix();
  cam.userData.desenho = [0, 0, W, H];
  return cam;
}

// Onde um ponto do modelo cai no desenho (unidades do viewBox da camada de texto).
export function projetar(cam, [x, y, z]) {
  const [vx, vy, vw, vh] = cam.userData.desenho;
  const p = new THREE.Vector3(x, y, z).project(cam);
  const r = (n) => Math.round(n * 10) / 10;
  return [r(vx + (p.x + 1) / 2 * vw), r(vy + (1 - p.y) / 2 * vh)];
}

export function renderizar(cena, cam) {
  const [, , W, H] = cam.userData.desenho;
  const largura = Math.round(W * ESCALA), altura = Math.round(H * ESCALA);
  const r = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  r.outputColorSpace = THREE.LinearSRGBColorSpace;
  r.setPixelRatio(1);
  r.setSize(largura, altura, false);
  r.setClearColor(0x000000, 0);
  for (const m of materiaisDeLinha) m.resolution.set(largura, altura);
  r.render(cena, cam);
  const png = r.domElement.toDataURL('image/png');
  r.dispose();
  return { png, largura, altura };
}

export { THREE };
