const fs = require('fs');

// Leer el archivo JSON
const jsonData = JSON.parse(fs.readFileSync('ia_complete_hierarchyv1.json', 'utf8'));

console.log('🔄 MIGRANDO FUNCIONES ADICIONALES DE CANALES\n');

// Función para encontrar una unidad en hierarchy (recursivamente)
function findUnitInHierarchy(hierarchy, unitName) {
    function traverse(node) {
        if (node.nombre === unitName) {
            return node;
        }
        
        if (node.children) {
            for (let child of node.children) {
                const result = traverse(child);
                if (result) return result;
            }
        }
        
        return null;
    }
    
    for (let node of hierarchy.tree) {
        const result = traverse(node);
        if (result) return result;
    }
    
    return null;
}

// Encontrar la unidad Canales en data
const canalesData = jsonData.data.unidades.find(unit => unit.nombre === 'Canales');
const canalesHierarchy = findUnitInHierarchy(jsonData.hierarchy, 'Canales');

if (!canalesData || !canalesHierarchy) {
    console.log('❌ No se encontró la unidad Canales en una de las secciones');
    process.exit(1);
}

console.log(`📊 ESTADO ACTUAL:`);
console.log(`   • Funciones en Hierarchy: ${canalesHierarchy.funciones.length}`);
console.log(`   • Funciones en Data: ${canalesData.funciones.length}`);
console.log(`   • Diferencia: ${canalesData.funciones.length - canalesHierarchy.funciones.length} funciones adicionales en Data\n`);

// Identificar funciones que están en data pero no en hierarchy
const hierarchyFunctionIds = canalesHierarchy.funciones.map(f => `${f.orden}-${f.tipo}-${f.descripcion.substring(0, 50)}`);
const dataFunctionIds = canalesData.funciones.map(f => `${f.orden}-${f.tipo}-${f.descripcion.substring(0, 50)}`);

const funcionesAdicionales = canalesData.funciones.filter(dataFunc => {
    const dataFuncId = `${dataFunc.orden}-${dataFunc.tipo}-${dataFunc.descripcion.substring(0, 50)}`;
    return !hierarchyFunctionIds.includes(dataFuncId);
});

console.log(`🔄 FUNCIONES ADICIONALES ENCONTRADAS (${funcionesAdicionales.length}):`);
funcionesAdicionales.forEach((func, index) => {
    console.log(`\n   ${index + 1}. Orden: ${func.orden}, Tipo: ${func.tipo}`);
    console.log(`      Descripción: ${func.descripcion.substring(0, 100)}...`);
    console.log(`      Producto Final: ${func.productoFinal || 'N/A'}`);
    console.log(`      Dedicación: ${func.porcentajeDedicacion || 'N/A'}%`);
});

// Migrar las funciones adicionales a hierarchy
if (funcionesAdicionales.length > 0) {
    console.log(`\n✅ MIGRANDO ${funcionesAdicionales.length} FUNCIONES A HIERARCHY...`);
    
    // Agregar las funciones adicionales al final de la lista en hierarchy
    const maxOrden = Math.max(...canalesHierarchy.funciones.map(f => f.orden));
    
    funcionesAdicionales.forEach((func, index) => {
        const nuevaFuncion = {
            ...func,
            orden: maxOrden + index + 1 // Asignar orden secuencial
        };
        
        canalesHierarchy.funciones.push(nuevaFuncion);
        console.log(`   ✅ Migrada función: ${nuevaFuncion.descripcion.substring(0, 50)}...`);
    });
    
    // Guardar el archivo actualizado
    fs.writeFileSync('ia_complete_hierarchyv1_migrado.json', JSON.stringify(jsonData, null, 2));
    
    console.log(`\n🎉 MIGRACIÓN COMPLETADA:`);
    console.log(`   • Funciones migradas: ${funcionesAdicionales.length}`);
    console.log(`   • Nuevo total en Hierarchy: ${canalesHierarchy.funciones.length}`);
    console.log(`   • Archivo guardado: ia_complete_hierarchyv1_migrado.json`);
} else {
    console.log('\n✅ No hay funciones adicionales para migrar');
}

console.log('\n📋 PRÓXIMOS PASOS:');
console.log('1. Revisar las misiones diferentes entre hierarchy y data');
console.log('2. Decidir cuál misión es la más actualizada');
console.log('3. Actualizar hierarchy con las misiones correctas');
console.log('4. Eliminar la sección data');
console.log('5. Mantener solo hierarchy como fuente única de verdad');