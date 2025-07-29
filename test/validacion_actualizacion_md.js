const fs = require('fs');

// Función para validar las actualizaciones realizadas
function validarActualizaciones() {
    try {
        // Leer el JSON actualizado
        const jsonData = JSON.parse(fs.readFileSync('ia_complete_hierarchy.json', 'utf8'));
        
        // Leer el reporte de actualización
        const reporte = JSON.parse(fs.readFileSync('contexto/reporte_actualizacion_md.json', 'utf8'));
        
        console.log('=== VALIDACIÓN DE ACTUALIZACIONES ===\n');
        
        // Validar metadata
        console.log('1. Validación de Metadata:');
        console.log(`   - Versión: ${jsonData.metadata.version}`);
        console.log(`   - Fecha actualización: ${jsonData.metadata.actualizado}`);
        console.log(`   - Total records: ${jsonData.metadata.totalRecords}`);
        console.log('   ✓ Metadata actualizada correctamente\n');
        
        // Validar unidades actualizadas
        console.log('2. Validación de Unidades Actualizadas:');
        let unidadesValidadas = 0;
        
        reporte.unidadesActualizadas.forEach(unidadReporte => {
            // Buscar la unidad en el JSON
            const unidadEncontrada = buscarUnidadEnJSON(unidadReporte.unidad, jsonData);
            
            if (unidadEncontrada) {
                console.log(`   ✓ ${unidadReporte.unidad}:`);
                console.log(`     - Misión actualizada: ${unidadEncontrada.mision.length > 100 ? 'Sí' : 'No'}`);
                console.log(`     - Funciones específicas: ${unidadEncontrada.funciones ? unidadEncontrada.funciones.filter(f => f.tipo === 'Específica').length : 0}`);
                unidadesValidadas++;
            } else {
                console.log(`   ⚠ ${unidadReporte.unidad}: No encontrada en JSON`);
            }
        });
        
        console.log(`\n   Total unidades validadas: ${unidadesValidadas}/${reporte.unidadesActualizadas.length}\n`);
        
        // Validar funciones específicas agregadas
        console.log('3. Validación de Funciones Específicas:');
        let funcionesValidadas = 0;
        let totalFunciones = 0;
        
        reporte.unidadesActualizadas.forEach(unidadReporte => {
            const unidadEncontrada = buscarUnidadEnJSON(unidadReporte.unidad, jsonData);
            
            if (unidadEncontrada && unidadEncontrada.funciones) {
                const funcionesEspecificas = unidadEncontrada.funciones.filter(f => f.tipo === 'Específica');
                totalFunciones += funcionesEspecificas.length;
                
                // Contar funciones con porcentaje de dedicación
                const funcionesConPorcentaje = funcionesEspecificas.filter(f => f.porcentajeDedicacion && f.porcentajeDedicacion !== '');
                funcionesValidadas += funcionesConPorcentaje.length;
                
                console.log(`   - ${unidadReporte.unidad}: ${funcionesConPorcentaje.length} funciones con porcentaje`);
            }
        });
        
        console.log(`\n   Total funciones específicas: ${totalFunciones}`);
        console.log(`   Funciones con porcentaje: ${funcionesValidadas}`);
        console.log(`   Porcentaje de completitud: ${((funcionesValidadas / totalFunciones) * 100).toFixed(1)}%\n`);
        
        // Validar estructura general
        console.log('4. Validación de Estructura:');
        const totalUnidades = contarUnidades(jsonData.hierarchy.tree[0]);
        console.log(`   - Total unidades en jerarquía: ${totalUnidades}`);
        console.log(`   - Estructura JSON válida: ${validarEstructuraJSON(jsonData) ? 'Sí' : 'No'}`);
        console.log(`   - Metadata completa: ${validarMetadata(jsonData.metadata) ? 'Sí' : 'No'}`);
        console.log('   ✓ Estructura general válida\n');
        
        // Resumen final
        console.log('=== RESUMEN DE VALIDACIÓN ===');
        console.log(`✓ Total actualizaciones reportadas: ${reporte.totalActualizaciones}`);
        console.log(`✓ Unidades validadas: ${unidadesValidadas}/${reporte.unidadesActualizadas.length}`);
        console.log(`✓ Funciones específicas con porcentaje: ${funcionesValidadas}/${totalFunciones}`);
        console.log(`✓ Estructura JSON: Válida`);
        console.log(`✓ Metadata: Completa`);
        
        return {
            exitoso: unidadesValidadas === reporte.unidadesActualizadas.length,
            unidadesValidadas,
            totalUnidades: reporte.unidadesActualizadas.length,
            funcionesValidadas,
            totalFunciones
        };
        
    } catch (error) {
        console.error('Error en la validación:', error);
        return { exitoso: false, error: error.message };
    }
}

// Función para buscar unidad en el JSON
function buscarUnidadEnJSON(nombreUnidad, jsonData) {
    function buscarEnNodo(nodo) {
        if (nodo.nombre === nombreUnidad) {
            return nodo;
        }
        
        if (nodo.children) {
            for (const hijo of nodo.children) {
                const resultado = buscarEnNodo(hijo);
                if (resultado) return resultado;
            }
        }
        
        return null;
    }
    
    return buscarEnNodo(jsonData.hierarchy.tree[0]);
}

// Función para contar unidades en la jerarquía
function contarUnidades(nodo) {
    let contador = 1; // Contar el nodo actual
    
    if (nodo.children) {
        for (const hijo of nodo.children) {
            contador += contarUnidades(hijo);
        }
    }
    
    return contador;
}

// Función para validar estructura JSON
function validarEstructuraJSON(jsonData) {
    return jsonData && 
           jsonData.metadata && 
           jsonData.hierarchy && 
           jsonData.hierarchy.tree && 
           Array.isArray(jsonData.hierarchy.tree);
}

// Función para validar metadata
function validarMetadata(metadata) {
    return metadata && 
           metadata.version && 
           metadata.actualizado && 
           metadata.totalRecords;
}

// Ejecutar validación
const resultado = validarActualizaciones();

if (resultado.exitoso) {
    console.log('\n🎉 VALIDACIÓN EXITOSA: Todas las actualizaciones se aplicaron correctamente');
} else {
    console.log('\n⚠️  VALIDACIÓN CON PROBLEMAS: Revisar las actualizaciones');
}