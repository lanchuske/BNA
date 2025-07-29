// Script para actualizar la información de la Gerencia de Productos Financieros
const fs = require('fs');

// Leer el archivo JSON original
const originalData = JSON.parse(fs.readFileSync('magna_partners_organigrama_2025-07-29-03-47.json', 'utf8'));

// Nueva información de la Gerencia de Productos Financieros
const nuevaGerenciaProductos = {
  "nombre": "Gerencia de Productos Financieros",
  "reportaA": "Productos",
  "mision": "Diseñar, desarrollar, gestionar y evolucionar el portafolio de productos crediticios del Banco, asegurando su alineación con las necesidades de los distintos segmentos de clientes, la sostenibilidad financiera, el cumplimiento normativo y la eficiencia operativa. Promover productos activos accesibles, competitivos, digitalizados y con impacto productivo y social.",
  "funciones": [
    {
      "orden": 1,
      "tipo": "Genérica",
      "descripcion": "Diseñar y actualizar productos crediticios del Banco. Crear y gestionar líneas de préstamos personales, hipotecarios, prendarios, consumo, productivos, con garantía o sin ella, adaptadas a los distintos perfiles de clientes (personas y empresas).",
      "productoFinal": "Portafolio de Productos Crediticios Actualizado",
      "porcentajeDedicacion": ""
    },
    {
      "orden": 2,
      "tipo": "Genérica",
      "descripcion": "Monitorear la rentabilidad, riesgos y desempeño del portafolio. Analizar márgenes, tasas, condiciones, plazos, riesgos crediticios y comportamiento de la cartera para tomar decisiones informadas sobre ajustes y rediseños.",
      "productoFinal": "Análisis de Rentabilidad y Riesgos del Portafolio",
      "porcentajeDedicacion": ""
    },
    {
      "orden": 3,
      "tipo": "Genérica",
      "descripcion": "Coordinar la implementación funcional de los productos. Trabajar transversalmente con Riesgos, Tecnología, Operaciones, Comercial, Jurídico y Compliance para garantizar la correcta instrumentación y operación de los productos.",
      "productoFinal": "Implementación Coordinada de Productos",
      "porcentajeDedicacion": ""
    },
    {
      "orden": 4,
      "tipo": "Genérica",
      "descripcion": "Impulsar la digitalización y simplificación de procesos crediticios. Promover soluciones ágiles, precalificadas, 100% digitales o con onboarding simplificado para aumentar la eficiencia y accesibilidad de las líneas activas.",
      "productoFinal": "Procesos Crediticios Digitalizados",
      "porcentajeDedicacion": ""
    },
    {
      "orden": 5,
      "tipo": "Genérica",
      "descripcion": "Acompañar el desarrollo comercial y la formación técnica de la red. Brindar especificaciones funcionales, simuladores, documentación y capacitaciones a la red para asegurar una gestión homogénea, segura y efectiva de los productos activos.",
      "productoFinal": "Capacitación y Documentación Técnica",
      "porcentajeDedicacion": ""
    },
    {
      "orden": 6,
      "tipo": "Específica",
      "descripcion": "Diseño y gestión del portafolio de préstamos. Préstamos personales, de consumo, hipotecarios, prendarios, para profesionales, programas sociales, estudios, mejoras del hogar, etc. Créditos con afectación de haberes, con garantía, tasa fija/variable, o líneas subsidiadas.",
      "productoFinal": "Portafolio de Préstamos Diversificado",
      "porcentajeDedicacion": "20"
    },
    {
      "orden": 7,
      "tipo": "Específica",
      "descripcion": "Relación con políticas públicas y programas especiales. Diseño y adecuación de líneas bajo convenios con organismos públicos, subsidios de tasa, créditos productivos, acceso a vivienda, inclusión financiera. Coordinación con Segmentos y Banca Internacional en casos de programas combinados.",
      "productoFinal": "Programas Especiales y Convenios Públicos",
      "porcentajeDedicacion": "20"
    },
    {
      "orden": 8,
      "tipo": "Específica",
      "descripcion": "Gestión integral del ciclo de vida del producto. Definición de pricing, plazos, condiciones, documentación, canales de solicitud, modelo operativo. Evaluación periódica y ajuste funcional del producto.",
      "productoFinal": "Ciclo de Vida de Productos Optimizado",
      "porcentajeDedicacion": "20"
    },
    {
      "orden": 9,
      "tipo": "Específica",
      "descripcion": "Automatización y transformación digital del crédito. Requerimientos para preevaluación automatizada, scoring, simuladores, onboarding digital, firma electrónica. Mejora de tiempos y experiencia en aprobación y desembolso.",
      "productoFinal": "Procesos Crediticios Automatizados",
      "porcentajeDedicacion": "20"
    },
    {
      "orden": 10,
      "tipo": "Específica",
      "descripcion": "Seguimiento de KPI's y desempeño del producto. Volumen, número de operaciones, ticket promedio, tasa de mora, margen, tasa de rechazo, canal de originación, NPS asociado.",
      "productoFinal": "Dashboard de KPI's y Desempeño",
      "porcentajeDedicacion": "20"
    }
  ]
};

// Buscar y reemplazar la unidad "Activos" con la nueva "Gerencia de Productos Financieros"
let encontrado = false;
for (let i = 0; i < originalData.data.unidades.length; i++) {
  if (originalData.data.unidades[i].nombre === "Activos") {
    originalData.data.unidades[i] = nuevaGerenciaProductos;
    encontrado = true;
    console.log(`✅ Unidad "Activos" reemplazada con "Gerencia de Productos Financieros"`);
    break;
  }
}

if (!encontrado) {
  console.log("❌ No se encontró la unidad 'Activos' en el archivo");
  process.exit(1);
}

// Actualizar metadatos
originalData.metadata.exportDate = new Date().toISOString();
originalData.metadata.totalRecords = originalData.data.unidades.reduce((total, unidad) => total + unidad.funciones.length, 0);
originalData.metadata.totalUnits = originalData.data.unidades.length;

// Actualizar jerarquía si existe
if (originalData.hierarchy && originalData.hierarchy.tree) {
  for (let i = 0; i < originalData.hierarchy.tree.length; i++) {
    if (originalData.hierarchy.tree[i].nombre === "Activos") {
      originalData.hierarchy.tree[i].nombre = "Gerencia de Productos Financieros";
      originalData.hierarchy.tree[i].mision = nuevaGerenciaProductos.mision;
      console.log(`✅ Jerarquía actualizada`);
      break;
    }
  }
}

// Guardar el archivo actualizado
const nombreArchivo = `magna_partners_organigrama_actualizado_${new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-')}.json`;
fs.writeFileSync(nombreArchivo, JSON.stringify(originalData, null, 2));

console.log(`✅ Archivo actualizado guardado como: ${nombreArchivo}`);
console.log(`📊 Estadísticas actualizadas:`);
console.log(`   - Total de registros: ${originalData.metadata.totalRecords}`);
console.log(`   - Total de unidades: ${originalData.metadata.totalUnits}`);
console.log(`   - Funciones en Gerencia de Productos Financieros: ${nuevaGerenciaProductos.funciones.length}`);