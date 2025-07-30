const fs = require('fs');
const path = require('path');

const INPUT = 'organigrama_bna_2025-07-30-4.json';
const OUTPUT = 'organigrama_bna_2025-07-30-4_CORREGIDO.json';

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function isEmpty(val) {
  return val === undefined || val === null || (typeof val === 'string' && val.trim() === '');
}

function normalizarTexto(txt) {
  if (!txt) return '';
  return txt.replace(/\s+/g, ' ').replace(/\s+([.,;:])/g, '$1').trim();
}

function productoFinalConcreto(desc) {
  if (!desc) return 'Producto concreto del área';
  let palabras = desc.split(' ');
  if (palabras.length > 6) return palabras.slice(-6).join(' ');
  return desc;
}

function fusionarFunciones(funcs) {
  let seen = new Set();
  let out = [];
  for (let f of funcs) {
    let key = (f.productoFinal||'') + '|' + (f.descripcion||'');
    key = key.toLowerCase().replace(/\s+/g, '');
    if (!seen.has(key)) {
      out.push(f);
      seen.add(key);
    }
  }
  return out;
}

function validarYCorregirFunciones(funcs, tipo, resumen, versionAnterior) {
  let cambios = false;
  let nuevos = [];
  let sumaPorcentaje = 0;
  for (let f of funcs) {
    let f0 = deepClone(f);
    if (tipo === 'Genérica') {
      if (isEmpty(f.descripcion) || isEmpty(f.productoFinal)) {
        resumen.camposFaltantes++;
        cambios = true;
      }
      if (f.porcentajeDedicacion !== undefined) {
        delete f.porcentajeDedicacion;
        resumen.camposEliminados++;
        cambios = true;
      }
      if (/producto concreto|informe|producto/i.test(f.productoFinal)) {
        f.productoFinal = productoFinalConcreto(f.descripcion);
        resumen.productosFinalesConcretos++;
        cambios = true;
      }
    } else if (tipo === 'Específica') {
      if (isEmpty(f.descripcion) || isEmpty(f.productoFinal) || f.porcentajeDedicacion === undefined) {
        resumen.camposFaltantes++;
        cambios = true;
      }
      if (typeof f.porcentajeDedicacion === 'string') {
        let val = f.porcentajeDedicacion.replace(/"/g, '').replace(/\.0$/, '');
        f.porcentajeDedicacion = parseInt(val);
        resumen.porcentajesCorregidos++;
        cambios = true;
      }
      if (f.porcentajeDedicacion % 5 !== 0) {
        f.porcentajeDedicacion = Math.round(f.porcentajeDedicacion / 5) * 5;
        resumen.porcentajesCorregidos++;
        cambios = true;
      }
      sumaPorcentaje += f.porcentajeDedicacion;
      if (/producto concreto|informe|producto/i.test(f.productoFinal)) {
        f.productoFinal = productoFinalConcreto(f.descripcion);
        resumen.productosFinalesConcretos++;
        cambios = true;
      }
    } else if (tipo === 'Indicador') {
      if (f.productoFinal !== undefined) { delete f.productoFinal; resumen.camposEliminados++; cambios = true; }
      if (f.porcentajeDedicacion !== undefined) { delete f.porcentajeDedicacion; resumen.camposEliminados++; cambios = true; }
      if (isEmpty(f.descripcion)) { resumen.camposFaltantes++; cambios = true; }
    }
    f.descripcion = normalizarTexto(f.descripcion);
    if (f.productoFinal) f.productoFinal = normalizarTexto(f.productoFinal);
    if (JSON.stringify(f) !== JSON.stringify(f0)) {
      f.versionAnterior = f0;
      cambios = true;
    }
    nuevos.push(f);
  }
  let fusionados = fusionarFunciones(nuevos);
  if (fusionados.length !== nuevos.length) {
    resumen.funcionesFusionadas += (nuevos.length - fusionados.length);
    cambios = true;
  }
  fusionados.forEach((f, i) => f.orden = i + 1);
  return {funcs: fusionados, sumaPorcentaje, cambios};
}

function procesarUnidad(unidad, resumen) {
  let versionAnterior = deepClone(unidad);
  let cambios = false;
  if (isEmpty(unidad.mision)) { resumen.camposFaltantes++; cambios = true; }
  else if (unidad.mision.length > 250) { unidad.mision = unidad.mision.split('.')[0] + '.'; cambios = true; resumen.misionesSintetizadas++; }
  unidad.mision = normalizarTexto(unidad.mision);
  if (isEmpty(unidad.jerarquia)) { resumen.camposFaltantes++; cambios = true; }
  if (unidad.nivelReporte === undefined) { resumen.camposFaltantes++; cambios = true; }
  if (!Array.isArray(unidad.funciones)) unidad.funciones = [];
  let gen = unidad.funciones.filter(f => f.tipo === 'Genérica');
  let esp = unidad.funciones.filter(f => f.tipo === 'Específica');
  let ind = unidad.funciones.filter(f => f.tipo === 'Indicador');
  let rGen = validarYCorregirFunciones(gen, 'Genérica', resumen, versionAnterior);
  let rEsp = validarYCorregirFunciones(esp, 'Específica', resumen, versionAnterior);
  let rInd = validarYCorregirFunciones(ind, 'Indicador', resumen, versionAnterior);
  if (esp.length > 0 && rEsp.sumaPorcentaje !== 100) {
    let base = Math.floor(100 / esp.length);
    let resto = 100 % esp.length;
    esp.forEach((f, i) => f.porcentajeDedicacion = base + (i < resto ? 1 : 0));
    resumen.porcentajesCorregidos++;
    cambios = true;
  }
  let nuevas = [...rGen.funcs, ...rEsp.funcs, ...rInd.funcs];
  if (JSON.stringify(unidad.funciones) !== JSON.stringify(nuevas)) {
    unidad.versionAnterior = versionAnterior;
    unidad.funciones = nuevas;
    cambios = true;
  }
  if (unidad.children && Array.isArray(unidad.children)) {
    unidad.children.forEach(child => {
      if (procesarUnidad(child, resumen)) cambios = true;
    });
  }
  return cambios;
}

function main() {
  const data = JSON.parse(fs.readFileSync(INPUT, 'utf8'));
  let resumen = {
    camposFaltantes: 0,
    camposEliminados: 0,
    productosFinalesConcretos: 0,
    funcionesFusionadas: 0,
    porcentajesCorregidos: 0,
    misionesSintetizadas: 0,
    unidadesCorregidas: 0
  };
  let tree = data.hierarchy.tree;
  tree.forEach(unidad => {
    if (procesarUnidad(unidad, resumen)) resumen.unidadesCorregidas++;
  });
  data.resumenCorrecciones = {
    ...resumen,
    observaciones: 'Se aplicaron los criterios de MD/gpts.md: misiones sintéticas, productos finales concretos, fusión de funciones redundantes, porcentajes corregidos, campos eliminados, orden correlativo, versionAnterior en cada bloque modificado.'
  };
  fs.writeFileSync(OUTPUT, JSON.stringify(data, null, 2));
  console.log('Archivo corregido guardado en', OUTPUT);
}

if (require.main === module) main(); 