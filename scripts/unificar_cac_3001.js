const fs = require('fs');

const inputFile = 'organigrama_bna_2025-07-30_3_CORREGIDO.json';
const outputFile = 'organigrama_bna_2025-07-30_3_CAC_UNIFICADO.json';

function loadJSON(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error al cargar el archivo: ${error.message}`);
    return null;
  }
}

function saveJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log('Archivo guardado correctamente');
  } catch (error) {
    console.error(`Error al guardar el archivo: ${error.message}`);
  }
}

function normalizarTexto(texto) {
  if (!texto) return '';
  let t = texto.trim();
  t = t.replace(/\s+/g, ' ');
  t = t.charAt(0).toUpperCase() + t.slice(1);
  if (!/[.!?]$/.test(t)) t += '.';
  return t;
}

function unificarCAC(tree) {
  let cacNodes = [];
  let parent = null;
  // Buscar ambas áreas y su padre
  function buscar(nodes, padre) {
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      if (n.nombre === 'CAC' || n.nombre === 'CAC – Atención Telefónica') {
        cacNodes.push(n);
        parent = padre;
      }
      if (n.children) buscar(n.children, n);
    }
  }
  buscar(tree, null);
  if (cacNodes.length < 2) {
    console.error('No se encontraron ambas áreas CAC para unificar.');
    return;
  }
  // Unificar funciones y misiones
  let nuevaMision = cacNodes.map(n => n.mision).filter(Boolean).join(' | ');
  let funciones = [];
  cacNodes.forEach(n => {
    if (n.funciones) funciones = funciones.concat(n.funciones);
  });
  // Eliminar duplicados semánticos (por productoFinal+descripcion)
  let seen = new Set();
  funciones = funciones.filter(f => {
    let key = (f.productoFinal||'') + '|' + (f.descripcion||'').toLowerCase().replace(/\s+/g, '');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  // Reordenar y renumerar funciones por tipo
  let genericas = funciones.filter(f => f.tipo === 'Genérica');
  let especificas = funciones.filter(f => f.tipo === 'Específica');
  let indicadores = funciones.filter(f => f.tipo === 'Indicador');
  let orden = 1;
  genericas.forEach(f => f.orden = orden++);
  especificas.forEach(f => f.orden = orden++);
  indicadores.forEach(f => f.orden = orden++);
  let funcionesUnificadas = [...genericas, ...especificas, ...indicadores];
  // Normalizar textos
  funcionesUnificadas.forEach(f => {
    if (f.descripcion) f.descripcion = normalizarTexto(f.descripcion);
    if (f.productoFinal) f.productoFinal = normalizarTexto(f.productoFinal);
  });
  // Crear nueva unidad CAC
  let nuevaCAC = {
    nombre: 'CAC',
    mision: normalizarTexto(nuevaMision),
    jerarquia: cacNodes[0].jerarquia || 'SG',
    nivelReporte: cacNodes[0].nivelReporte || 4,
    funciones: funcionesUnificadas
  };
  // Eliminar las dos áreas originales
  if (parent && parent.children) {
    parent.children = parent.children.filter(n => n.nombre !== 'CAC' && n.nombre !== 'CAC – Atención Telefónica');
    parent.children.push(nuevaCAC);
  }
}

function main() {
  const data = loadJSON(inputFile);
  if (!data || !data.hierarchy || !data.hierarchy.tree) return;
  unificarCAC(data.hierarchy.tree);
  // Actualizar resumenCorrecciones
  data.resumenCorrecciones = data.resumenCorrecciones || {};
  data.resumenCorrecciones.unificacionCAC = 'Se unificaron las áreas CAC y CAC – Atención Telefónica bajo una sola unidad CAC, aplicando criterios de MD/gpts.md.';
  saveJSON(outputFile, data);
}

main(); 