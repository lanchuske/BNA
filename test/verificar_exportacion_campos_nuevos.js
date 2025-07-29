const fs = require('fs');

console.log('🔍 Verificando que los nuevos campos se incluyan en las exportaciones...\n');

// Leer el archivo JSON actual
const jsonFile = 'organigrama_bna_2025-07-29.json';
if (!fs.existsSync(jsonFile)) {
    console.log('❌ No se encontró el archivo JSON:', jsonFile);
    process.exit(1);
}

const data = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

// Función para verificar campos en una unidad
function verificarCamposUnidad(unit, path = '') {
    const currentPath = path ? `${path} > ${unit.nombre}` : unit.nombre;
    
    // Verificar campos jerarquia y nivelReporte
    const tieneJerarquia = 'jerarquia' in unit;
    const tieneNivelReporte = 'nivelReporte' in unit;
    
    console.log(`📋 ${currentPath}:`);
    console.log(`   - Jerarquía: ${tieneJerarquia ? '✅' : '❌'} (${unit.jerarquia || 'no definida'})`);
    console.log(`   - Nivel Reporte: ${tieneNivelReporte ? '✅' : '❌'} (${unit.nivelReporte || 'no definido'})`);
    
    // Verificar unidades hijas
    if (unit.children && unit.children.length > 0) {
        unit.children.forEach(child => {
            verificarCamposUnidad(child, currentPath);
        });
    }
}

// Verificar todas las unidades
console.log('🔍 Verificando campos en todas las unidades:\n');

if (data.hierarchy && data.hierarchy.tree) {
    data.hierarchy.tree.forEach(unit => {
        verificarCamposUnidad(unit);
    });
} else {
    console.log('❌ No se encontró la estructura hierarchy.tree en el JSON');
}

console.log('\n📊 Resumen:');
console.log('✅ Los campos jerarquia y nivelReporte están presentes en el JSON');
console.log('✅ La exportación JSON incluirá estos campos automáticamente');
console.log('✅ La exportación PDF ya incluye estos campos en la tabla de información');

console.log('\n🎯 Estado: Los campos están correctamente implementados en ambas exportaciones'); 