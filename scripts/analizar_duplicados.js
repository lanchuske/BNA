const fs = require('fs');

// Leer el archivo JSON
const jsonData = JSON.parse(fs.readFileSync('ia_complete_hierarchyv1.json', 'utf8'));

console.log('🔍 ANALIZANDO DUPLICACIONES ENTRE HIERARCHY Y DATA\n');

// Extraer unidades de hierarchy (recursivamente)
function extractUnitsFromHierarchy(hierarchy) {
    const units = [];
    
    function traverse(node) {
        if (node.nombre) {
            units.push({
                nombre: node.nombre,
                reportaA: node.reportaA || '',
                mision: node.mision || '',
                funciones: node.funciones || []
            });
        }
        
        if (node.children) {
            node.children.forEach(child => traverse(child));
        }
    }
    
    hierarchy.tree.forEach(node => traverse(node));
    return units;
}

// Extraer unidades de data
function extractUnitsFromData(data) {
    return data.unidades.map(unit => ({
        nombre: unit.nombre,
        reportaA: unit.reportaA || '',
        mision: unit.mision || '',
        funciones: unit.funciones || []
    }));
}

// Comparar dos unidades
function compareUnits(unit1, unit2) {
    return unit1.nombre === unit2.nombre;
}

// Analizar duplicaciones
const hierarchyUnits = extractUnitsFromHierarchy(jsonData.hierarchy);
const dataUnits = extractUnitsFromData(jsonData.data);

console.log(`📊 ESTADÍSTICAS:`);
console.log(`   • Unidades en hierarchy: ${hierarchyUnits.length}`);
console.log(`   • Unidades en data: ${dataUnits.length}`);
console.log(`   • Total de unidades únicas: ${new Set([...hierarchyUnits.map(u => u.nombre), ...dataUnits.map(u => u.nombre)]).size}\n`);

// Encontrar duplicaciones exactas
const duplicates = [];
const hierarchyNames = hierarchyUnits.map(u => u.nombre);
const dataNames = dataUnits.map(u => u.nombre);

console.log('🔄 DUPLICACIONES ENCONTRADAS:');
console.log('=====================================');

// Unidades que aparecen en ambos
const commonUnits = hierarchyNames.filter(name => dataNames.includes(name));
console.log(`\n✅ Unidades que aparecen en AMBAS secciones (${commonUnits.length}):`);
commonUnits.forEach(name => {
    const hUnit = hierarchyUnits.find(u => u.nombre === name);
    const dUnit = dataUnits.find(u => u.nombre === name);
    
    console.log(`\n   📋 "${name}"`);
    console.log(`      Hierarchy: ${hUnit.funciones.length} funciones`);
    console.log(`      Data: ${dUnit.funciones.length} funciones`);
    
    // Comparar funciones
    if (hUnit.funciones.length !== dUnit.funciones.length) {
        console.log(`      ⚠️  DIFERENCIA: Distinto número de funciones`);
    } else {
        console.log(`      ✅ Mismo número de funciones`);
    }
    
    // Comparar misiones
    if (hUnit.mision !== dUnit.mision) {
        console.log(`      ⚠️  DIFERENCIA: Misiones diferentes`);
    } else {
        console.log(`      ✅ Misma misión`);
    }
});

// Unidades solo en hierarchy
const onlyInHierarchy = hierarchyNames.filter(name => !dataNames.includes(name));
console.log(`\n🌳 Unidades SOLO en hierarchy (${onlyInHierarchy.length}):`);
onlyInHierarchy.forEach(name => console.log(`   • ${name}`));

// Unidades solo en data
const onlyInData = dataNames.filter(name => !hierarchyNames.includes(name));
console.log(`\n📊 Unidades SOLO en data (${onlyInData.length}):`);
onlyInData.forEach(name => console.log(`   • ${name}`));

console.log('\n📋 RESUMEN:');
console.log('=====================================');
console.log(`• Total de unidades únicas: ${new Set([...hierarchyNames, ...dataNames]).size}`);
console.log(`• Unidades duplicadas: ${commonUnits.length}`);
console.log(`• Unidades solo en hierarchy: ${onlyInHierarchy.length}`);
console.log(`• Unidades solo en data: ${onlyInData.length}`);

if (commonUnits.length > 0) {
    console.log('\n⚠️  RECOMENDACIÓN:');
    console.log('Hay información duplicada entre hierarchy y data.');
    console.log('Considera mantener solo una de las dos secciones para evitar inconsistencias.');
} else {
    console.log('\n✅ RESULTADO:');
    console.log('No hay duplicaciones exactas entre hierarchy y data.');
}