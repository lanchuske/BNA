// Script para validar productos finales de indicadores
const fs = require('fs');

function validarProductosFinales() {
    try {
        // Leer el JSON actual
        const jsonContent = fs.readFileSync('estructura_organizativa_completa.json', 'utf8');
        const json = JSON.parse(jsonContent);
        
        console.log('=== VALIDANDO PRODUCTOS FINALES DE INDICADORES ===\n');
        
        let indicadoresConProductoFinalIncorrecto = [];
        let indicadoresCorrectos = 0;
        let totalIndicadores = 0;
        
        // Función para procesar nodos recursivamente
        function procesarNodos(nodos) {
            nodos.forEach(nodo => {
                if (nodo.funciones && nodo.funciones.length > 0) {
                    // Filtrar solo indicadores
                    const indicadores = nodo.funciones.filter(f => f.tipo === 'Indicador');
                    
                    if (indicadores.length > 0) {
                        totalIndicadores += indicadores.length;
                        
                        // Los indicadores NO requieren producto final
                        indicadores.forEach(indicador => {
                            if (indicador.productoFinal && indicador.productoFinal.trim() !== '') {
                                indicadoresConProductoFinalIncorrecto.push({
                                    unidad: nodo.nombre,
                                    descripcion: indicador.descripcion,
                                    orden: indicador.orden,
                                    productoFinal: indicador.productoFinal
                                });
                            } else {
                                indicadoresCorrectos++;
                            }
                        });
                    }
                }
                
                // Procesar hijos recursivamente
                if (nodo.children && nodo.children.length > 0) {
                    procesarNodos(nodo.children);
                }
            });
        }
        
        // Procesar todo el árbol
        if (json.hierarchy && json.hierarchy.tree) {
            procesarNodos(json.hierarchy.tree);
        }
        
        // Mostrar resultados
        console.log('📊 RESULTADOS DE VALIDACIÓN:');
        console.log(`   Total de indicadores: ${totalIndicadores}`);
        console.log(`   Indicadores correctos (sin producto final): ${indicadoresCorrectos}`);
        console.log(`   Indicadores incorrectos (con producto final): ${indicadoresConProductoFinalIncorrecto.length}`);
        
        if (indicadoresConProductoFinalIncorrecto.length > 0) {
            console.log('\n❌ INDICADORES CON PRODUCTO FINAL INCORRECTO:');
            indicadoresConProductoFinalIncorrecto.forEach((indicador, index) => {
                console.log(`\n${index + 1}. Unidad: ${indicador.unidad}`);
                console.log(`   Orden: ${indicador.orden}`);
                console.log(`   Descripción: ${indicador.descripcion}`);
                console.log(`   Producto Final (debe eliminarse): ${indicador.productoFinal}`);
            });
            
            // Generar recomendaciones
            console.log('\n💡 RECOMENDACIONES:');
            console.log('   - Los indicadores NO deben tener producto final');
            console.log('   - Eliminar el campo productoFinal de todos los indicadores');
            console.log('   - Los indicadores solo deben tener descripción y orden');
        } else {
            console.log('\n✅ Todos los indicadores están correctos (sin producto final)');
        }
        
        // Calcular estadísticas
        const porcentajeCorrectos = ((indicadoresCorrectos / totalIndicadores) * 100).toFixed(2);
        console.log(`\n📈 Porcentaje de indicadores correctos: ${porcentajeCorrectos}%`);
        
        if (indicadoresConProductoFinalIncorrecto.length > 0) {
            console.log('\n⚠️ Se encontraron indicadores con producto final que debe eliminarse');
        } else {
            console.log('\n✅ Validación completada exitosamente');
        }
        
        // Actualizar metadata si hay problemas
        if (indicadoresConProductoFinalIncorrecto.length > 0 && json.metadata) {
            json.metadata.version = json.metadata.version + "-productos-finales-incorrectos";
            json.metadata.exportDate = new Date().toISOString();
            
            // Agregar información sobre productos finales incorrectos
            if (!json.metadata.issues) {
                json.metadata.issues = [];
            }
            
            indicadoresConProductoFinalIncorrecto.forEach(indicador => {
                json.metadata.issues.push({
                    row: indicador.orden,
                    unidad: indicador.unidad,
                    tipo: "Indicador",
                    issues: [
                        "Indicador: No debe tener Producto Final"
                    ]
                });
            });
            
            // Guardar el JSON actualizado
            const jsonActualizado = JSON.stringify(json, null, 2);
            fs.writeFileSync('estructura_organizativa_completa.json', jsonActualizado);
            
            console.log('\n📝 Metadata actualizada con información de productos finales incorrectos');
        }
        
    } catch (error) {
        console.error('❌ Error al validar productos finales:', error.message);
    }
}

// Ejecutar el script
validarProductosFinales(); 