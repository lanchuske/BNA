const fs = require('fs');

// Leer el archivo JSON
const jsonData = JSON.parse(fs.readFileSync('ia_complete_hierarchyv1.json', 'utf8'));

console.log('🔄 ANALIZANDO MIGRACIÓN DE DATA A HIERARCHY\n');

// Función para extraer unidades de hierarchy (recursivamente)
function extractUnitsFromHierarchy(hierarchy) {
    const units = [];
    
    function traverse(node) {
        if (node.nombre) {
            units.push({
                nombre: node.nombre,
                reportaA: node.reportaA || '',
                mision: node.mision || '',
                funciones: node.funciones || [],
                key: node.key || '',
                children: node.children || []
            });
        }
        
        if (node.children) {
            node.children.forEach(child => traverse(child));
        }
    }
    
    hierarchy.tree.forEach(node => traverse(node));
    return units;
}

// Función para extraer unidades de data
function extractUnitsFromData(data) {
    return data.unidades.map(unit => ({
        nombre: unit.nombre,
        reportaA: unit.reportaA || '',
        mision: unit.mision || '',
        funciones: unit.funciones || []
    }));
}

const hierarchyUnits = extractUnitsFromHierarchy(jsonData.hierarchy);
const dataUnits = extractUnitsFromData(jsonData.data);

console.log('📊 ANÁLISIS DETALLADO DE DIFERENCIAS:');
console.log('=====================================\n');

// Analizar cada unidad
const analysis = [];

hierarchyUnits.forEach(hUnit => {
    const dUnit = dataUnits.find(d => d.nombre === hUnit.nombre);
    
    if (dUnit) {
        const analysisItem = {
            nombre: hUnit.nombre,
            hierarchy: {
                funciones: hUnit.funciones.length,
                mision: hUnit.mision,
                reportaA: hUnit.reportaA
            },
            data: {
                funciones: dUnit.funciones.length,
                mision: dUnit.mision,
                reportaA: dUnit.reportaA
            },
            diferencias: {
                funciones: hUnit.funciones.length !== dUnit.funciones.length,
                mision: hUnit.mision !== dUnit.mision,
                reportaA: hUnit.reportaA !== dUnit.reportaA
            }
        };
        
        analysis.push(analysisItem);
    }
});

// Categorizar unidades
const unidadesIdenticas = analysis.filter(item => 
    !item.diferencias.funciones && 
    !item.diferencias.mision && 
    !item.diferencias.reportaA
);

const unidadesConDiferencias = analysis.filter(item => 
    item.diferencias.funciones || 
    item.diferencias.mision || 
    item.diferencias.reportaA
);

console.log(`✅ UNIDADES IDÉNTICAS (${unidadesIdenticas.length}):`);
unidadesIdenticas.forEach(item => {
    console.log(`   • ${item.nombre} (${item.hierarchy.funciones} funciones)`);
});

console.log(`\n⚠️  UNIDADES CON DIFERENCIAS (${unidadesConDiferencias.length}):`);
console.log('=====================================');

unidadesConDiferencias.forEach(item => {
    console.log(`\n📋 "${item.nombre}":`);
    
    if (item.diferencias.funciones) {
        console.log(`   🔄 Funciones: ${item.hierarchy.funciones} vs ${item.data.funciones}`);
        
        // Analizar funciones específicas que faltan
        const hFunciones = item.hierarchy.funciones;
        const dFunciones = item.data.funciones;
        
        if (hFunciones > dFunciones) {
            console.log(`      ⚠️  Hierarchy tiene ${hFunciones - dFunciones} funciones más que Data`);
        } else {
            console.log(`      ⚠️  Data tiene ${dFunciones - hFunciones} funciones más que Hierarchy`);
        }
    }
    
    if (item.diferencias.mision) {
        console.log(`   📝 Misiones diferentes:`);
        console.log(`      Hierarchy: "${item.hierarchy.mision.substring(0, 100)}..."`);
        console.log(`      Data: "${item.data.mision.substring(0, 100)}..."`);
    }
    
    if (item.diferencias.reportaA) {
        console.log(`   📊 ReportaA diferentes:`);
        console.log(`      Hierarchy: "${item.hierarchy.reportaA}"`);
        console.log(`      Data: "${item.data.reportaA}"`);
    }
});

// Identificar información única en data que debe migrarse
console.log('\n🔍 INFORMACIÓN ÚNICA EN DATA QUE DEBE MIGRARSE:');
console.log('=====================================');

const unidadesConMasFuncionesEnData = unidadesConDiferencias.filter(item => 
    item.data.funciones > item.hierarchy.funciones
);

console.log(`\n📈 Unidades con MÁS funciones en Data (${unidadesConMasFuncionesEnData.length}):`);
unidadesConMasFuncionesEnData.forEach(item => {
    const diferencia = item.data.funciones - item.hierarchy.funciones;
    console.log(`   • ${item.nombre}: +${diferencia} funciones en Data`);
});

// Identificar unidades con misiones diferentes
const unidadesConMisionesDiferentes = unidadesConDiferencias.filter(item => 
    item.diferencias.mision
);

console.log(`\n📝 Unidades con misiones diferentes (${unidadesConMisionesDiferentes.length}):`);
unidadesConMisionesDiferentes.forEach(item => {
    console.log(`   • ${item.nombre}`);
});

// Recomendaciones
console.log('\n💡 RECOMENDACIONES DE MIGRACIÓN:');
console.log('=====================================');

if (unidadesConMasFuncionesEnData.length > 0) {
    console.log('\n🔄 FUNCIONES A MIGRAR:');
    console.log('Las siguientes unidades tienen funciones adicionales en Data que deben migrarse a Hierarchy:');
    unidadesConMasFuncionesEnData.forEach(item => {
        console.log(`   • ${item.nombre}: ${item.data.funciones - item.hierarchy.funciones} funciones adicionales`);
    });
}

if (unidadesConMisionesDiferentes.length > 0) {
    console.log('\n📝 MISIONES A REVISAR:');
    console.log('Las siguientes unidades tienen misiones diferentes. Revisar cuál es la más actualizada:');
    unidadesConMisionesDiferentes.forEach(item => {
        console.log(`   • ${item.nombre}`);
    });
}

console.log('\n🎯 PLAN DE ACCIÓN:');
console.log('=====================================');
console.log('1. Migrar funciones adicionales de Data a Hierarchy');
console.log('2. Revisar y actualizar misiones inconsistentes');
console.log('3. Verificar reportaA inconsistentes');
console.log('4. Eliminar sección Data después de la migración');
console.log('5. Mantener solo Hierarchy como fuente única de verdad');

// Estadísticas finales
console.log('\n📊 ESTADÍSTICAS FINALES:');
console.log('=====================================');
console.log(`• Total de unidades: ${analysis.length}`);
console.log(`• Unidades idénticas: ${unidadesIdenticas.length}`);
console.log(`• Unidades con diferencias: ${unidadesConDiferencias.length}`);
console.log(`• Unidades con más funciones en Data: ${unidadesConMasFuncionesEnData.length}`);
console.log(`• Unidades con misiones diferentes: ${unidadesConMisionesDiferentes.length}`);