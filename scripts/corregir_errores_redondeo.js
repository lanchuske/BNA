// Script para corregir manualmente los errores de redondeo
const fs = require('fs');

function corregirErroresRedondeo() {
    try {
        // Leer el JSON actual
        const jsonContent = fs.readFileSync('estructura_organizativa_completa.json', 'utf8');
        const json = JSON.parse(jsonContent);
        
        console.log('=== CORRIGIENDO ERRORES DE REDONDEO ===\n');
        
        let correccionesRealizadas = 0;
        
        // Función para procesar nodos recursivamente
        function procesarNodos(nodos) {
            nodos.forEach(nodo => {
                if (nodo.funciones && nodo.funciones.length > 0) {
                    // Filtrar solo funciones específicas
                    const funcionesEspecificas = nodo.funciones.filter(f => f.tipo === 'Específica');
                    
                    if (funcionesEspecificas.length > 0) {
                        let sumaPorcentajes = 0;
                        funcionesEspecificas.forEach(func => {
                            sumaPorcentajes += parseFloat(func.porcentajeDedicacion) || 0;
                        });
                        
                        // Corregir solo los casos específicos con errores
                        if (nodo.nombre === 'Canales' && Math.abs(sumaPorcentajes - 100) < 1) {
                            console.log(`🔧 Corrigiendo Canales (suma actual: ${sumaPorcentajes}%)`);
                            
                            // Ajustar el primer porcentaje para que sume exactamente 100
                            if (funcionesEspecificas.length > 0) {
                                const diferencia = 100 - sumaPorcentajes;
                                const primerPorcentaje = parseFloat(funcionesEspecificas[0].porcentajeDedicacion) || 0;
                                const nuevoPorcentaje = Math.round((primerPorcentaje + diferencia) * 10) / 10;
                                
                                funcionesEspecificas[0].porcentajeDedicacion = nuevoPorcentaje.toString();
                                correccionesRealizadas++;
                                
                                console.log(`   ✅ Ajustado primer porcentaje: ${primerPorcentaje}% → ${nuevoPorcentaje}%`);
                                console.log(`   ✅ Nueva suma: ${(sumaPorcentajes + diferencia).toFixed(1)}%`);
                            }
                            
                        } else if (nodo.nombre === 'Coordinación Del Negocio Y Datos' && Math.abs(sumaPorcentajes - 100) < 1) {
                            console.log(`🔧 Corrigiendo Coordinación Del Negocio Y Datos (suma actual: ${sumaPorcentajes}%)`);
                            
                            // Ajustar el primer porcentaje para que sume exactamente 100
                            if (funcionesEspecificas.length > 0) {
                                const diferencia = 100 - sumaPorcentajes;
                                const primerPorcentaje = parseFloat(funcionesEspecificas[0].porcentajeDedicacion) || 0;
                                const nuevoPorcentaje = Math.round((primerPorcentaje + diferencia) * 10) / 10;
                                
                                funcionesEspecificas[0].porcentajeDedicacion = nuevoPorcentaje.toString();
                                correccionesRealizadas++;
                                
                                console.log(`   ✅ Ajustado primer porcentaje: ${primerPorcentaje}% → ${nuevoPorcentaje}%`);
                                console.log(`   ✅ Nueva suma: ${(sumaPorcentajes + diferencia).toFixed(1)}%`);
                            }
                        }
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
        
        // Actualizar metadata
        if (json.metadata) {
            json.metadata.version = json.metadata.version + "-errores-redondeo-corregidos";
            json.metadata.exportDate = new Date().toISOString();
        }
        
        // Guardar el JSON actualizado
        const jsonActualizado = JSON.stringify(json, null, 2);
        fs.writeFileSync('estructura_organizativa_completa.json', jsonActualizado);
        
        console.log('\n📊 RESUMEN DE CORRECCIONES:');
        console.log(`   Correcciones realizadas: ${correccionesRealizadas}`);
        
        if (correccionesRealizadas > 0) {
            console.log('\n✅ Errores de redondeo corregidos manualmente');
        } else {
            console.log('\nℹ️ No se encontraron errores de redondeo para corregir');
        }
        
    } catch (error) {
        console.error('❌ Error al corregir errores de redondeo:', error.message);
    }
}

// Ejecutar el script
corregirErroresRedondeo(); 