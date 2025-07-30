const fs = require('fs');

const inputFile = 'organigrama_bna_2025-07-30_3.json';
const outputFile = 'organigrama_bna_2025-07-30_3_CORREGIDO.json';

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

function isEmpty(val) {
  return val === undefined || val === null || (typeof val === 'string' && val.trim() === '');
}

function isMultipleOf5(n) {
  return n % 5 === 0;
}

function normalizarTexto(texto) {
  if (!texto) return '';
  // Homogeneizar sintaxis, puntuación, verbos y estilo
  let t = texto.trim();
  t = t.replace(/\s+/g, ' ');
  t = t.charAt(0).toUpperCase() + t.slice(1);
  if (!/[.!?]$/.test(t)) t += '.';
  return t;
}

function corregirUnidad(unit, resumen) {
  let errores = {
    porcentajeInvalido: 0,
    funcionesDuplicadas: 0,
    camposFaltantes: 0,
    ordenIncorrecto: 0,
    indicadoresMalformados: 0,
    lenguajeNormalizado: 0
  };
  let unidadConErrores = false;

  // Validar campos obligatorios
  ['nombre', 'mision', 'jerarquia', 'nivelReporte'].forEach(campo => {
    if (isEmpty(unit[campo])) {
      unit[campo] = campo === 'nivelReporte' ? 4 : `FALTA_${campo.toUpperCase()}`;
      errores.camposFaltantes++;
      unidadConErrores = true;
    }
  });

  // Normalizar textos
  ['mision'].forEach(campo => {
    if (unit[campo]) {
      const norm = normalizarTexto(unit[campo]);
      if (norm !== unit[campo]) {
        unit[campo] = norm;
        errores.lenguajeNormalizado++;
        unidadConErrores = true;
      }
    }
  });

  // Validar estructura mínima de funciones
  if (!unit.funciones) unit.funciones = [];
  let genericas = unit.funciones.filter(f => f.tipo === 'Genérica');
  let especificas = unit.funciones.filter(f => f.tipo === 'Específica');
  let indicadores = unit.funciones.filter(f => f.tipo === 'Indicador');

  // Reclasificar funciones si hay menos de las mínimas sugeridas
  if (genericas.length < 2 && especificas.length > 2) {
    // Reclasificar la más transversal como genérica
    let moved = false;
    for (let i = 0; i < especificas.length; i++) {
      if (especificas[i].descripcion && especificas[i].descripcion.match(/coordinar|supervisar|planificar|asistir|gestionar/i)) {
        especificas[i].tipo = 'Genérica';
        moved = true;
        break;
      }
    }
    if (moved) {
      genericas = unit.funciones.filter(f => f.tipo === 'Genérica');
      especificas = unit.funciones.filter(f => f.tipo === 'Específica');
    }
  }

  // Validar y corregir funciones genéricas
  genericas.forEach(f => {
    if (isEmpty(f.descripcion)) {
      f.descripcion = 'Descripción pendiente.';
      errores.camposFaltantes++;
      unidadConErrores = true;
    }
    if (isEmpty(f.productoFinal)) {
      f.productoFinal = 'Producto específico del área';
      errores.camposFaltantes++;
      unidadConErrores = true;
    }
    if (f.porcentajeDedicacion !== undefined) {
      delete f.porcentajeDedicacion;
      errores.camposFaltantes++;
      unidadConErrores = true;
    }
    // Normalizar textos
    ['descripcion', 'productoFinal'].forEach(campo => {
      if (f[campo]) {
        const norm = normalizarTexto(f[campo]);
        if (norm !== f[campo]) {
          f[campo] = norm;
          errores.lenguajeNormalizado++;
          unidadConErrores = true;
        }
      }
    });
  });

  // Validar y corregir funciones específicas
  let sumaPorcentaje = 0;
  especificas.forEach(f => {
    if (isEmpty(f.descripcion)) {
      f.descripcion = 'Descripción pendiente.';
      errores.camposFaltantes++;
      unidadConErrores = true;
    }
    if (isEmpty(f.productoFinal)) {
      f.productoFinal = 'Producto específico del área';
      errores.camposFaltantes++;
      unidadConErrores = true;
    }
    // Corregir tipo de porcentaje
    if (typeof f.porcentajeDedicacion === 'string') {
      let val = f.porcentajeDedicacion.replace(/\"/g, '').replace(/\.0$/, '');
      f.porcentajeDedicacion = parseInt(val);
    }
    if (!isMultipleOf5(f.porcentajeDedicacion)) {
      f.porcentajeDedicacion = Math.round(f.porcentajeDedicacion / 5) * 5;
      errores.porcentajeInvalido++;
      unidadConErrores = true;
    }
    sumaPorcentaje += f.porcentajeDedicacion;
    // Normalizar textos
    ['descripcion', 'productoFinal'].forEach(campo => {
      if (f[campo]) {
        const norm = normalizarTexto(f[campo]);
        if (norm !== f[campo]) {
          f[campo] = norm;
          errores.lenguajeNormalizado++;
          unidadConErrores = true;
        }
      }
    });
  });
  // Redistribuir si no suma 100
  if (especificas.length > 0 && sumaPorcentaje !== 100) {
    let base = Math.floor(100 / especificas.length);
    let resto = 100 % especificas.length;
    especificas.forEach((f, i) => {
      f.porcentajeDedicacion = base + (i < resto ? 1 : 0);
    });
    errores.porcentajeInvalido++;
    unidadConErrores = true;
  }

  // Detectar y fusionar duplicados semánticos (simplificado: por igualdad de productoFinal y similitud de descripción)
  let descs = new Set();
  let duplicadas = [];
  especificas.forEach((f, i) => {
    let key = f.productoFinal + '|' + f.descripcion.toLowerCase().replace(/\s+/g, '');
    if (descs.has(key)) {
      duplicadas.push(i);
    } else {
      descs.add(key);
    }
  });
  if (duplicadas.length > 0) {
    duplicadas.reverse().forEach(idx => especificas.splice(idx, 1));
    errores.funcionesDuplicadas += duplicadas.length;
    unidadConErrores = true;
  }

  // Validar y corregir indicadores
  indicadores.forEach(f => {
    if (isEmpty(f.descripcion)) {
      f.descripcion = 'Descripción pendiente.';
      errores.camposFaltantes++;
      unidadConErrores = true;
    }
    if (f.productoFinal !== undefined) {
      delete f.productoFinal;
      errores.indicadoresMalformados++;
      unidadConErrores = true;
    }
    if (f.porcentajeDedicacion !== undefined) {
      delete f.porcentajeDedicacion;
      errores.indicadoresMalformados++;
      unidadConErrores = true;
    }
    // Normalizar textos
    if (f.descripcion) {
      const norm = normalizarTexto(f.descripcion);
      if (norm !== f.descripcion) {
        f.descripcion = norm;
        errores.lenguajeNormalizado++;
        unidadConErrores = true;
      }
    }
  });

  // Reordenar y renumerar funciones
  let all = [...genericas, ...especificas, ...indicadores];
  let orden = 1;
  genericas.forEach(f => f.orden = orden++);
  especificas.forEach(f => f.orden = orden++);
  indicadores.forEach(f => f.orden = orden++);
  unit.funciones = all;

  // Validar orden correlativo
  let ordenes = all.map(f => f.orden);
  let ordenSet = new Set(ordenes);
  if (ordenes.length !== ordenSet.size || Math.min(...ordenes) !== 1 || Math.max(...ordenes) !== all.length) {
    all.forEach((f, idx) => f.orden = idx + 1);
    errores.ordenIncorrecto++;
    unidadConErrores = true;
  }

  // Limpieza final: eliminar campos vacíos/null
  all.forEach(f => {
    Object.keys(f).forEach(k => {
      if (isEmpty(f[k])) delete f[k];
    });
  });

  // Recursividad en hijos
  if (unit.children && Array.isArray(unit.children)) {
    unit.children.forEach(child => {
      const childRes = corregirUnidad(child, resumen);
      Object.keys(errores).forEach(k => errores[k] += childRes.errores[k]);
      if (childRes.unidadConErrores) resumen.unidadesConErrores.push(child.nombre);
    });
  }

  return { errores, unidadConErrores };
}

function main() {
  const data = loadJSON(inputFile);
  if (!data) return;
  let resumen = {
    totalUnidadesRevisadas: 0,
    erroresCorregidos: {
      porcentajeInvalido: 0,
      funcionesDuplicadas: 0,
      camposFaltantes: 0,
      ordenIncorrecto: 0,
      indicadoresMalformados: 0,
      lenguajeNormalizado: 0
    },
    unidadesConErrores: []
  };
  function recorrer(units) {
    units.forEach(unit => {
      resumen.totalUnidadesRevisadas++;
      const res = corregirUnidad(unit, resumen);
      Object.keys(res.errores).forEach(k => resumen.erroresCorregidos[k] += res.errores[k]);
      if (res.unidadConErrores) resumen.unidadesConErrores.push(unit.nombre);
      if (unit.children) recorrer(unit.children);
    });
  }
  if (data.hierarchy && data.hierarchy.tree) recorrer(data.hierarchy.tree);
  data.resumenCorrecciones = resumen;
  saveJSON(outputFile, data);
}

main(); 