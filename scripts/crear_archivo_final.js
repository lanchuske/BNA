const fs = require('fs');

// Leer el archivo JSON migrado
const jsonData = JSON.parse(fs.readFileSync('ia_complete_hierarchyv1_migrado.json', 'utf8'));

console.log('🎯 CREANDO ARCHIVO FINAL SIN DUPLICACIONES\n');

// Crear el nuevo objeto sin la sección data
const archivoFinal = {
    metadata: jsonData.metadata,
    hierarchy: jsonData.hierarchy
};

// Actualizar metadata para reflejar los cambios
archivoFinal.metadata.version = "2.14-sin-duplicaciones-" + new Date().toISOString().split('T')[0];
archivoFinal.metadata.actualizado = new Date().toISOString();
archivoFinal.metadata.format = "hierarchy-only";
archivoFinal.metadata.notes = [
    "Archivo optimizado eliminando duplicaciones entre hierarchy y data",
    "Migradas 36 funciones adicionales de Canales desde data a hierarchy",
    "Mantenidas las misiones más detalladas de hierarchy",
    "Eliminada sección data para evitar inconsistencias"
];

// Guardar el archivo final
fs.writeFileSync('ia_complete_hierarchy_final.json', JSON.stringify(archivoFinal, null, 2));

console.log('✅ ARCHIVO FINAL CREADO:');
console.log('=====================================');
console.log('📄 Archivo: ia_complete_hierarchy_final.json');
console.log(`📊 Versión: ${archivoFinal.metadata.version}`);
console.log(`📅 Actualizado: ${archivoFinal.metadata.actualizado}`);
console.log(`📋 Formato: ${archivoFinal.metadata.format}`);

// Estadísticas del archivo final
const totalUnidades = countUnitsInHierarchy(archivoFinal.hierarchy);
const totalFunciones = countFunctionsInHierarchy(archivoFinal.hierarchy);

console.log('\n📊 ESTADÍSTICAS DEL ARCHIVO FINAL:');
console.log('=====================================');
console.log(`• Total de unidades: ${totalUnidades}`);
console.log(`• Total de funciones: ${totalFunciones}`);
console.log(`• Tamaño del archivo: ${(JSON.stringify(archivoFinal).length / 1024 / 1024).toFixed(2)} MB`);

// Comparar con el archivo original
const archivoOriginal = JSON.parse(fs.readFileSync('ia_complete_hierarchyv1.json', 'utf8'));
const totalUnidadesOriginal = countUnitsInHierarchy(archivoOriginal.hierarchy) + archivoOriginal.data.unidades.length;
const totalFuncionesOriginal = countFunctionsInHierarchy(archivoOriginal.hierarchy) + 
    archivoOriginal.data.unidades.reduce((sum, unit) => sum + unit.funciones.length, 0);

console.log('\n📈 COMPARACIÓN CON ARCHIVO ORIGINAL:');
console.log('=====================================');
console.log(`• Unidades originales: ${totalUnidadesOriginal}`);
console.log(`• Unidades finales: ${totalUnidades}`);
console.log(`• Funciones originales: ${totalFuncionesOriginal}`);
console.log(`• Funciones finales: ${totalFunciones}`);
console.log(`• Reducción de tamaño: ${((1 - JSON.stringify(archivoFinal).length / JSON.stringify(archivoOriginal).length) * 100).toFixed(1)}%`);

console.log('\n🎉 MIGRACIÓN COMPLETADA EXITOSAMENTE!');
console.log('=====================================');
console.log('✅ Eliminadas duplicaciones entre hierarchy y data');
console.log('✅ Migradas funciones adicionales de Canales');
console.log('✅ Mantenidas las misiones más detalladas');
console.log('✅ Archivo optimizado y sin inconsistencias');
console.log('✅ Hierarchy como fuente única de verdad');

// Funciones auxiliares
function countUnitsInHierarchy(hierarchy) {
    let count = 0;
    
    function traverse(node) {
        if (node.nombre) {
            count++;
        }
        
        if (node.children) {
            node.children.forEach(child => traverse(child));
        }
    }
    
    hierarchy.tree.forEach(node => traverse(node));
    return count;
}

function countFunctionsInHierarchy(hierarchy) {
    let count = 0;
    
    function traverse(node) {
        if (node.funciones) {
            count += node.funciones.length;
        }
        
        if (node.children) {
            node.children.forEach(child => traverse(child));
        }
    }
    
    hierarchy.tree.forEach(node => traverse(node));
    return count;
}