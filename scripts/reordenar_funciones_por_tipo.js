const fs = require('fs');

// Leer el archivo JSON final
const jsonData = JSON.parse(fs.readFileSync('ia_complete_hierarchy_final.json', 'utf8'));

console.log('🔄 REORDENANDO FUNCIONES POR TIPO\n');

// Orden de prioridad para los tipos de función
const tipoOrder = {
    'Genérica': 1,
    'Específica': 2,
    'Indicador': 3
};

// Función para reordenar funciones de una unidad
function reordenarFuncionesUnidad(unit) {
    if (!unit.funciones || unit.funciones.length === 0) {
        return;
    }
    
    // Ordenar funciones por tipo
    unit.funciones.sort((a, b) => {
        const orderA = tipoOrder[a.tipo] || 999;
        const orderB = tipoOrder[b.tipo] || 999;
        
        if (orderA !== orderB) {
            return orderA - orderB;
        }
        
        // Si son del mismo tipo, mantener el orden original
        return (a.orden || 0) - (b.orden || 0);
    });
    
    // Actualizar números de orden
    unit.funciones.forEach((func, index) => {
        func.orden = index + 1;
    });
}

// Función recursiva para procesar toda la jerarquía
function reordenarJerarquia(nodes) {
    nodes.forEach(node => {
        // Reordenar funciones de este nodo
        reordenarFuncionesUnidad(node);
        
        // Procesar hijos recursivamente
        if (node.children && node.children.length > 0) {
            reordenarJerarquia(node.children);
        }
    });
}

console.log('📊 ESTADÍSTICAS ANTES DEL REORDENAMIENTO:');
console.log('=====================================');

// Contar funciones por tipo antes del reordenamiento
let statsBefore = {
    genericas: 0,
    especificas: 0,
    indicadores: 0,
    total: 0
};

function contarFunciones(nodes) {
    nodes.forEach(node => {
        if (node.funciones) {
            node.funciones.forEach(func => {
                statsBefore.total++;
                switch(func.tipo) {
                    case 'Genérica':
                        statsBefore.genericas++;
                        break;
                    case 'Específica':
                        statsBefore.especificas++;
                        break;
                    case 'Indicador':
                        statsBefore.indicadores++;
                        break;
                }
            });
        }
        
        if (node.children) {
            contarFunciones(node.children);
        }
    });
}

contarFunciones(jsonData.hierarchy.tree);

console.log(`• Total de funciones: ${statsBefore.total}`);
console.log(`• Genéricas: ${statsBefore.genericas}`);
console.log(`• Específicas: ${statsBefore.especificas}`);
console.log(`• Indicadores: ${statsBefore.indicadores}`);

// Reordenar toda la jerarquía
console.log('\n🔄 REORDENANDO FUNCIONES...');
reordenarJerarquia(jsonData.hierarchy.tree);

// Actualizar metadata
jsonData.metadata.version = "2.15-funciones-ordenadas-" + new Date().toISOString().split('T')[0];
jsonData.metadata.actualizado = new Date().toISOString();
jsonData.metadata.notes = [
    ...(jsonData.metadata.notes || []),
    "Funciones reordenadas por tipo: Genéricas, Específicas, Indicadores"
];

// Guardar el archivo reordenado
fs.writeFileSync('ia_complete_hierarchy_final_ordenado.json', JSON.stringify(jsonData, null, 2));

console.log('\n✅ REORDENAMIENTO COMPLETADO:');
console.log('=====================================');
console.log('📄 Archivo guardado: ia_complete_hierarchy_final_ordenado.json');
console.log(`📊 Nueva versión: ${jsonData.metadata.version}`);

// Mostrar ejemplos de unidades reordenadas
console.log('\n📋 EJEMPLOS DE UNIDADES REORDENADAS:');
console.log('=====================================');

function mostrarEjemplosUnidades(nodes, maxEjemplos = 3) {
    let ejemplosMostrados = 0;
    
    function mostrarUnidad(node) {
        if (ejemplosMostrados >= maxEjemplos) return;
        
        if (node.funciones && node.funciones.length > 0) {
            console.log(`\n🏢 "${node.nombre}":`);
            console.log(`   Total funciones: ${node.funciones.length}`);
            
            // Agrupar por tipo
            const porTipo = {
                'Genérica': node.funciones.filter(f => f.tipo === 'Genérica').length,
                'Específica': node.funciones.filter(f => f.tipo === 'Específica').length,
                'Indicador': node.funciones.filter(f => f.tipo === 'Indicador').length
            };
            
            console.log(`   • Genéricas: ${porTipo['Genérica']}`);
            console.log(`   • Específicas: ${porTipo['Específica']}`);
            console.log(`   • Indicadores: ${porTipo['Indicador']}`);
            
            // Mostrar primeros 3 elementos de cada tipo
            console.log(`   📋 Orden final:`);
            node.funciones.slice(0, 6).forEach((func, index) => {
                console.log(`      ${index + 1}. [${func.tipo}] ${func.descripcion.substring(0, 50)}...`);
            });
            
            ejemplosMostrados++;
        }
        
        if (node.children) {
            node.children.forEach(child => mostrarUnidad(child));
        }
    }
    
    nodes.forEach(node => mostrarUnidad(node));
}

mostrarEjemplosUnidades(jsonData.hierarchy.tree);

console.log('\n🎯 BENEFICIOS DEL REORDENAMIENTO:');
console.log('=====================================');
console.log('✅ Funciones organizadas por tipo de manera consistente');
console.log('✅ Genéricas primero (funciones base)');
console.log('✅ Específicas segundo (implementación)');
console.log('✅ Indicadores tercero (medición)');
console.log('✅ Orden secuencial mantenido dentro de cada tipo');
console.log('✅ Números de orden actualizados');

console.log('\n📋 PRÓXIMOS PASOS:');
console.log('=====================================');
console.log('1. Probar el archivo reordenado en el HTML');
console.log('2. Verificar que el orden sea consistente');
console.log('3. Actualizar referencias si es necesario');
console.log('4. Considerar este formato como estándar');