// Script para corregir automáticamente los problemas identificados
const fs = require('fs');

function corregirProblemasIdentificados() {
    try {
        // Leer el JSON actual
        const jsonContent = fs.readFileSync('estructura_organizativa_completa.json', 'utf8');
        const json = JSON.parse(jsonContent);
        
        console.log('=== CORRIGIENDO PROBLEMAS IDENTIFICADOS ===\n');
        
        let funcionesCorregidas = 0;
        let indicadoresCorregidos = 0;
        
        // Función para procesar nodos recursivamente
        function procesarNodos(nodos) {
            nodos.forEach(nodo => {
                if (nodo.funciones && nodo.funciones.length > 0) {
                    // 1. Corregir porcentajes de dedicación (solo funciones específicas)
                    const funcionesEspecificas = nodo.funciones.filter(f => f.tipo === 'Específica');
                    
                    if (funcionesEspecificas.length > 0) {
                        let sumaPorcentajes = 0;
                        let funcionesConPorcentaje = [];
                        let funcionesSinPorcentaje = [];
                        
                        funcionesEspecificas.forEach(func => {
                            const porcentaje = parseFloat(func.porcentajeDedicacion) || 0;
                            if (porcentaje > 0) {
                                sumaPorcentajes += porcentaje;
                                funcionesConPorcentaje.push(func);
                            } else {
                                funcionesSinPorcentaje.push(func);
                            }
                        });
                        
                        // Si hay problemas de porcentajes, corregir
                        if (sumaPorcentajes !== 100) {
                            console.log(`🔧 Corrigiendo porcentajes en: ${nodo.nombre}`);
                            console.log(`   Suma actual: ${sumaPorcentajes}%`);
                            
                            if (sumaPorcentajes > 100) {
                                // Redistribuir porcentajes proporcionalmente
                                const factor = 100 / sumaPorcentajes;
                                funcionesConPorcentaje.forEach(func => {
                                    const nuevoPorcentaje = Math.round((parseFloat(func.porcentajeDedicacion) * factor) * 10) / 10;
                                    func.porcentajeDedicacion = nuevoPorcentaje.toString();
                                    funcionesCorregidas++;
                                });
                                console.log(`   ✅ Redistribuidos proporcionalmente a 100%`);
                            } else if (sumaPorcentajes < 100 && funcionesSinPorcentaje.length > 0) {
                                // Asignar porcentaje faltante a funciones sin porcentaje
                                const porcentajePorFuncion = (100 - sumaPorcentajes) / funcionesSinPorcentaje.length;
                                funcionesSinPorcentaje.forEach(func => {
                                    func.porcentajeDedicacion = porcentajePorFuncion.toFixed(1);
                                    funcionesCorregidas++;
                                });
                                console.log(`   ✅ Asignado ${porcentajePorFuncion.toFixed(1)}% a ${funcionesSinPorcentaje.length} funciones`);
                            }
                        }
                    }
                    
                    // 2. Eliminar productos finales de indicadores
                    const indicadores = nodo.funciones.filter(f => f.tipo === 'Indicador');
                    indicadores.forEach(indicador => {
                        if (indicador.productoFinal && indicador.productoFinal.trim() !== '') {
                            console.log(`🗑️ Eliminando producto final de indicador: ${indicador.descripcion.substring(0, 50)}...`);
                            delete indicador.productoFinal;
                            indicadoresCorregidos++;
                        }
                    });
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
            json.metadata.version = json.metadata.version + "-correcciones-automaticas";
            json.metadata.exportDate = new Date().toISOString();
            
            // Limpiar issues anteriores si existen
            if (json.metadata.issues) {
                json.metadata.issues = [];
            }
        }
        
        // Guardar el JSON actualizado
        const jsonActualizado = JSON.stringify(json, null, 2);
        fs.writeFileSync('estructura_organizativa_completa.json', jsonActualizado);
        
        console.log('\n📊 RESUMEN DE CORRECCIONES:');
        console.log(`   Funciones específicas corregidas: ${funcionesCorregidas}`);
        console.log(`   Indicadores corregidos: ${indicadoresCorregidos}`);
        console.log(`   Total de correcciones: ${funcionesCorregidas + indicadoresCorregidos}`);
        
        console.log('\n✅ Correcciones automáticas completadas');
        
    } catch (error) {
        console.error('❌ Error al corregir problemas:', error.message);
    }
}

// Ejecutar el script
corregirProblemasIdentificados(); 