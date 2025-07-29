const fs = require('fs');

// Leer el archivo JSON ordenado
const jsonData = JSON.parse(fs.readFileSync('ia_complete_hierarchy_final_ordenado.json', 'utf8'));

console.log('🔍 REVISANDO FUNCIONES GENÉRICAS CON PORCENTAJES\n');

// Función para revisar funciones genéricas recursivamente
function revisarFuncionesGenericas(nodes) {
    let problemas = [];
    let unidadesRevisadas = 0;
    
    function revisarNodo(node) {
        if (node.funciones) {
            unidadesRevisadas++;
            let problemasUnidad = [];
            
            node.funciones.forEach((func, index) => {
                if (func.tipo === 'Genérica' && func.porcentajeDedicacion) {
                    problemasUnidad.push({
                        orden: func.orden,
                        descripcion: func.descripcion.substring(0, 100) + '...',
                        porcentaje: func.porcentajeDedicacion
                    });
                }
            });
            
            if (problemasUnidad.length > 0) {
                problemas.push({
                    unidad: node.nombre,
                    problemas: problemasUnidad
                });
            }
        }
        
        if (node.children) {
            node.children.forEach(child => revisarNodo(child));
        }
    }
    
    nodes.forEach(node => revisarNodo(node));
    
    return { problemas, unidadesRevisadas };
}

// Revisar el archivo
const resultado = revisarFuncionesGenericas(jsonData.hierarchy.tree);

console.log('📊 ESTADÍSTICAS DE REVISIÓN:');
console.log('=====================================');
console.log(`• Unidades revisadas: ${resultado.unidadesRevisadas}`);
console.log(`• Unidades con problemas: ${resultado.problemas.length}`);

if (resultado.problemas.length === 0) {
    console.log('\n✅ EXCELENTE: No se encontraron funciones genéricas con porcentajes');
    console.log('El archivo está correcto según las reglas de validación.');
} else {
    console.log('\n⚠️  PROBLEMAS ENCONTRADOS:');
    console.log('=====================================');
    
    resultado.problemas.forEach((problema, index) => {
        console.log(`\n🏢 "${problema.unidad}":`);
        problema.problemas.forEach(prob => {
            console.log(`   • Orden ${prob.orden}: ${prob.porcentaje}%`);
            console.log(`     "${prob.descripcion}"`);
        });
    });
    
    console.log('\n🔄 CORRIGIENDO PROBLEMAS...');
    
    // Función para corregir funciones genéricas recursivamente
    function corregirFuncionesGenericas(nodes) {
        let correcciones = 0;
        
        function corregirNodo(node) {
            if (node.funciones) {
                node.funciones.forEach(func => {
                    if (func.tipo === 'Genérica' && func.porcentajeDedicacion) {
                        console.log(`   ✅ Corregida: "${func.descripcion.substring(0, 50)}..."`);
                        console.log(`      Eliminado porcentaje: ${func.porcentajeDedicacion}%`);
                        delete func.porcentajeDedicacion;
                        correcciones++;
                    }
                });
            }
            
            if (node.children) {
                node.children.forEach(child => corregirNodo(child));
            }
        }
        
        nodes.forEach(node => corregirNodo(node));
        return correcciones;
    }
    
    const totalCorrecciones = corregirFuncionesGenericas(jsonData.hierarchy.tree);
    
    // Actualizar metadata
    jsonData.metadata.version = "2.16-funciones-genericas-corregidas-" + new Date().toISOString().split('T')[0];
    jsonData.metadata.actualizado = new Date().toISOString();
    jsonData.metadata.notes = [
        ...(jsonData.metadata.notes || []),
        `Corregidas ${totalCorrecciones} funciones genéricas que tenían porcentajes de dedicación`
    ];
    
    // Guardar archivo corregido
    fs.writeFileSync('ia_complete_hierarchy_final_corregido.json', JSON.stringify(jsonData, null, 2));
    
    console.log('\n✅ CORRECCIÓN COMPLETADA:');
    console.log('=====================================');
    console.log(`• Total de correcciones: ${totalCorrecciones}`);
    console.log('• Porcentajes eliminados de funciones genéricas');
    console.log('• Archivo guardado: ia_complete_hierarchy_final_corregido.json');
    console.log(`• Nueva versión: ${jsonData.metadata.version}`);
}

// Verificación final
console.log('\n🔍 VERIFICACIÓN FINAL:');
console.log('=====================================');

function verificarCorreccion(nodes) {
    let funcionesGenericas = 0;
    let funcionesConPorcentaje = 0;
    
    function verificarNodo(node) {
        if (node.funciones) {
            node.funciones.forEach(func => {
                if (func.tipo === 'Genérica') {
                    funcionesGenericas++;
                    if (func.porcentajeDedicacion) {
                        funcionesConPorcentaje++;
                    }
                }
            });
        }
        
        if (node.children) {
            node.children.forEach(child => verificarNodo(child));
        }
    }
    
    nodes.forEach(node => verificarNodo(node));
    
    return { funcionesGenericas, funcionesConPorcentaje };
}

const verificacion = verificarCorreccion(jsonData.hierarchy.tree);

console.log(`• Total funciones genéricas: ${verificacion.funcionesGenericas}`);
console.log(`• Funciones genéricas con porcentaje: ${verificacion.funcionesConPorcentaje}`);

if (verificacion.funcionesConPorcentaje === 0) {
    console.log('✅ VERIFICACIÓN EXITOSA: Todas las funciones genéricas están correctas');
} else {
    console.log(`⚠️  ADVERTENCIA: Aún hay ${verificacion.funcionesConPorcentaje} funciones genéricas con porcentaje`);
}

console.log('\n📋 REGLAS DE VALIDACIÓN:');
console.log('=====================================');
console.log('✅ Funciones Genéricas: NO deben tener porcentaje de dedicación');
console.log('✅ Funciones Específicas: SÍ pueden tener porcentaje de dedicación');
console.log('✅ Funciones Indicador: NO deben tener porcentaje de dedicación');

console.log('\n🎯 PRÓXIMOS PASOS:');
console.log('=====================================');
console.log('1. Usar el archivo corregido como estándar');
console.log('2. Verificar que las correcciones sean correctas');
console.log('3. Actualizar documentación si es necesario');
console.log('4. Implementar validación automática en futuras actualizaciones');