const fs = require('fs');

const inputFile = 'organigrama_bna_2025-07-30_5.json';
const outputFile = 'organigrama_bna_2025-07-30_5_CORREGIDO.json';

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

function productoFinalConcreto(desc) {
  // Heurística simple para mejorar productos finales genéricos
  if (/informe|report/i.test(desc)) return 'Informe mensual de gestión.';
  if (/protocolo|manual|procedimiento/i.test(desc)) return 'Manual de protocolos actualizado.';
  if (/capacita|desarrolla|entrena/i.test(desc)) return 'Plan anual de capacitación.';
  if (/mejora|optimiza|digitaliza/i.test(desc)) return 'Reporte de iniciativas de mejora.';
  if (/atención|servicio/i.test(desc)) return 'Reporte de calidad de atención.';
  return 'Producto concreto del área.';
}

function isEmpty(val) {
  return val === undefined || val === null || (typeof val === 'string' && val.trim() === '');
}

function isMultipleOf5(n) {
  return n % 5 === 0;
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

  // Sintetizar misión si es muy larga o redundante
  if (unit.mision && unit.mision.length > 250) {
    unit.mision = unit.mision.split('.')[0] + '.';
    errores.lenguajeNormalizado++;
    unidadConErrores = true;
  }
  if (unit.mision) unit.mision = normalizarTexto(unit.mision);

  // Validar estructura mínima de funciones
  if (!unit.funciones) unit.funciones = [];
  let genericas = unit.funciones.filter(f => f.tipo === 'Genérica');
  let especificas = unit.funciones.filter(f => f.tipo === 'Específica');
  let indicadores = unit.funciones.filter(f => f.tipo === 'Indicador');

  // Mejorar productos finales genéricos
  genericas.forEach(f => {
    if (isEmpty(f.productoFinal) || /espec[ií]fico|informe|producto/i.test(f.productoFinal)) {
      f.productoFinal = productoFinalConcreto(f.descripcion || '');
      errores.lenguajeNormalizado++;
      unidadConErrores = true;
    }
    if (f.porcentajeDedicacion !== undefined) {
      delete f.porcentajeDedicacion;
      errores.camposFaltantes++;
      unidadConErrores = true;
    }
    if (f.descripcion) f.descripcion = normalizarTexto(f.descripcion);
    if (f.productoFinal) f.productoFinal = normalizarTexto(f.productoFinal);
  });

  // Fusión de funciones genéricas redundantes (por productoFinal+descripcion)
  let seen = new Set();
  let duplicadas = [];
  genericas.forEach((f, i) => {
    let key = (f.productoFinal||'') + '|' + (f.descripcion||'').toLowerCase().replace(/\s+/g, '');
    if (seen.has(key)) duplicadas.push(i);
    else seen.add(key);
  });
  if (duplicadas.length > 0) {
    duplicadas.reverse().forEach(idx => genericas.splice(idx, 1));
    errores.funcionesDuplicadas += duplicadas.length;
    unidadConErrores = true;
  }

  // Validar y corregir funciones específicas
  let sumaPorcentaje = 0;
  especificas.forEach(f => {
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
    if (f.descripcion) f.descripcion = normalizarTexto(f.descripcion);
    if (f.productoFinal) f.productoFinal = normalizarTexto(f.productoFinal);
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
  // Fusión de funciones específicas redundantes
  let seenEsp = new Set();
  let duplicadasEsp = [];
  especificas.forEach((f, i) => {
    let key = (f.productoFinal||'') + '|' + (f.descripcion||'').toLowerCase().replace(/\s+/g, '');
    if (seenEsp.has(key)) duplicadasEsp.push(i);
    else seenEsp.add(key);
  });
  if (duplicadasEsp.length > 0) {
    duplicadasEsp.reverse().forEach(idx => especificas.splice(idx, 1));
    errores.funcionesDuplicadas += duplicadasEsp.length;
    unidadConErrores = true;
  }

  // Indicadores: solo descripcion
  indicadores.forEach(f => {
    if (f.productoFinal !== undefined) { delete f.productoFinal; errores.indicadoresMalformados++; unidadConErrores = true; }
    if (f.porcentajeDedicacion !== undefined) { delete f.porcentajeDedicacion; errores.indicadoresMalformados++; unidadConErrores = true; }
    if (f.descripcion) f.descripcion = normalizarTexto(f.descripcion);
  });
  // Consolidar indicadores duplicados
  let seenInd = new Set();
  let duplicadasInd = [];
  indicadores.forEach((f, i) => {
    let key = (f.descripcion||'').toLowerCase().replace(/\s+/g, '');
    if (seenInd.has(key)) duplicadasInd.push(i);
    else seenInd.add(key);
  });
  if (duplicadasInd.length > 0) {
    duplicadasInd.reverse().forEach(idx => indicadores.splice(idx, 1));
    errores.funcionesDuplicadas += duplicadasInd.length;
    unidadConErrores = true;
  }

  // Reordenar y renumerar funciones por tipo
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
  if (!data || !data.hierarchy || !data.hierarchy.tree) return;
  let resumen = {
    totalUnidadesRevisadas: 0,
    funcionesDuplicadas: 0,
    ajustesPorcentajes: 0,
    camposNormalizados: 0,
    unidadesConErrores: []
  };
  function recorrer(units) {
    units.forEach(unit => {
      resumen.totalUnidadesRevisadas++;
      const res = corregirUnidad(unit, resumen);
      resumen.funcionesDuplicadas += res.errores.funcionesDuplicadas;
      resumen.ajustesPorcentajes += res.errores.porcentajeInvalido;
      resumen.camposNormalizados += res.errores.lenguajeNormalizado + res.errores.camposFaltantes + res.errores.indicadoresMalformados;
      if (res.unidadConErrores) resumen.unidadesConErrores.push(unit.nombre);
      if (unit.children) recorrer(unit.children);
    });
  }
  if (data.hierarchy && data.hierarchy.tree) recorrer(data.hierarchy.tree);
  data.resumenCorrecciones = {
    cantidadUnidadesRevisadas: resumen.totalUnidadesRevisadas,
    funcionesDuplicadasEliminadas: resumen.funcionesDuplicadas,
    ajustesPorcentajesRealizados: resumen.ajustesPorcentajes,
    camposEliminadosONormalizados: resumen.camposNormalizados,
    unidadesConErrores: Array.from(new Set(resumen.unidadesConErrores)),
    observaciones: "Se aplicaron los criterios de MD/gpts.md: productos finales concretos, fusión de funciones redundantes, síntesis de misiones, homogeneización de estilo, validación de porcentajes, consolidación de indicadores duplicados, limpieza de campos vacíos."
  };
  saveJSON(outputFile, data);
}

main(); 