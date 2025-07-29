const fs = require('fs');

console.log('🔧 Agregando campos jerarquia y nivelReporte a todas las unidades...\n');

// Leer el archivo JSON actual
const jsonFile = 'organigrama_bna_2025-07-29.json';
if (!fs.existsSync(jsonFile)) {
    console.log('❌ No se encontró el archivo JSON:', jsonFile);
    process.exit(1);
}

const data = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

// Función para calcular nivel de reporte
function calcularNivelReporte(unit, allUnits) {
    // Si es SGP Clientes, nivel 2
    if (unit.nombre === 'SGP Clientes') {
        return 2;
    }
    
    // Si no tiene reportaA, es nivel 1
    if (!unit.reportaA) {
        return 1;
    }
    
    // Buscar la unidad superior
    const unidadSuperior = allUnits.find(u => u.nombre === unit.reportaA);
    if (!unidadSuperior) {
        return 1;
    }
    
    // Calcular recursivamente el nivel de la unidad superior
    const nivelSuperior = calcularNivelReporte(unidadSuperior, allUnits);
    return nivelSuperior + 1;
}

// Función para determinar jerarquía basada en el nombre
function determinarJerarquia(unit) {
    const nombre = unit.nombre.toLowerCase();
    
    // Reglas para determinar jerarquía
    if (nombre.includes('sgp')) return 'SGP';
    if (nombre.includes('sg')) return 'SG';
    if (nombre.includes('gd')) return 'GD';
    if (nombre.includes('gg')) return 'GG';
    if (nombre.includes('sgd')) return 'SGD';
    
    // Por defecto, basado en la posición en la jerarquía
    if (unit.nombre === 'SGP Clientes') return 'SGP';
    if (unit.reportaA === 'SGP Clientes') return 'SG';
    
    return 'SG'; // Por defecto
}

// Función para obtener todas las unidades en una lista plana
function getAllUnitsFlat(nodes, units = []) {
    nodes.forEach(node => {
        units.push(node);
        if (node.children && node.children.length > 0) {
            getAllUnitsFlat(node.children, units);
        }
    });
    return units;
}

// Función para agregar campos a una unidad
function agregarCamposUnidad(unit, allUnits) {
    // Agregar campo jerarquia
    if (!unit.jerarquia) {
        unit.jerarquia = determinarJerarquia(unit);
    }
    
    // Agregar campo nivelReporte
    if (!unit.nivelReporte) {
        unit.nivelReporte = calcularNivelReporte(unit, allUnits);
    }
    
    console.log(`📋 ${unit.nombre}:`);
    console.log(`   - Jerarquía: ${unit.jerarquia}`);
    console.log(`   - Nivel Reporte: ${unit.nivelReporte}`);
    
    // Procesar unidades hijas
    if (unit.children && unit.children.length > 0) {
        unit.children.forEach(child => {
            agregarCamposUnidad(child, allUnits);
        });
    }
}

// Obtener todas las unidades en una lista plana para el cálculo
const allUnits = getAllUnitsFlat(data.hierarchy.tree);

console.log('🔍 Agregando campos a todas las unidades:\n');

// Procesar todas las unidades
data.hierarchy.tree.forEach(unit => {
    agregarCamposUnidad(unit, allUnits);
});

// Actualizar metadata
if (!data.metadata) {
    data.metadata = {};
}

data.metadata.lastUpdate = new Date().toISOString();
data.metadata.version = (data.metadata.version || '1.0') + '-with-hierarchy-fields';
data.metadata.notes = (data.metadata.notes || '') + '\n- Agregados campos jerarquia y nivelReporte a todas las unidades';

// Guardar el archivo actualizado
fs.writeFileSync(jsonFile, JSON.stringify(data, null, 2));

console.log('\n✅ Campos agregados exitosamente:');
console.log('✅ Campo jerarquia agregado a todas las unidades');
console.log('✅ Campo nivelReporte calculado y agregado a todas las unidades');
console.log('✅ Metadata actualizada');
console.log('✅ Archivo JSON guardado');

console.log('\n📊 Resumen de cambios:');
console.log(`📁 Archivo: ${jsonFile}`);
console.log(`📋 Unidades procesadas: ${allUnits.length}`);
console.log(`🔄 Versión actualizada: ${data.metadata.version}`); 