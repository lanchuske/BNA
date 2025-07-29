// Script para identificar y eliminar funciones duplicadas
const fs = require('fs');

function eliminarFuncionesDuplicadas() {
    try {
        // Leer el JSON actual
        const jsonContent = fs.readFileSync('estructura_organizativa_completa.json', 'utf8');
        const json = JSON.parse(jsonContent);
        
        console.log('=== ELIMINANDO FUNCIONES DUPLICADAS ===\n');
        
        let totalFunciones = 0;
        let funcionesDuplicadas = 0;
        let funcionesEliminadas = 0;
        
        // Función para procesar nodos recursivamente
        function procesarNodos(nodos) {
            nodos.forEach(nodo => {
                if (nodo.funciones && nodo.funciones.length > 0) {
                    totalFunciones += nodo.funciones.length;
                    
                    // Crear un mapa para identificar duplicados
                    const funcionesUnicas = [];
                    const duplicadosEncontrados = [];
                    
                    nodo.funciones.forEach((funcion, index) => {
                        const clave = `${funcion.tipo}|${funcion.descripcion}|${funcion.productoFinal}`;
                        
                        const duplicado = funcionesUnicas.find(f => 
                            f.tipo === funcion.tipo &&
                            f.descripcion === funcion.descripcion &&
                            f.productoFinal === funcion.productoFinal
                        );
                        
                        if (duplicado) {
                            duplicadosEncontrados.push({
                                original: duplicado,
                                duplicado: funcion,
                                index: index
                            });
                            funcionesDuplicadas++;
                        } else {
                            funcionesUnicas.push(funcion);
                        }
                    });
                    
                    // Eliminar duplicados (mantener el primero, eliminar los demás)
                    if (duplicadosEncontrados.length > 0) {
                        console.log(`🔍 Unidad: ${nodo.nombre}`);
                        console.log(`   Funciones originales: ${nodo.funciones.length}`);
                        
                        // Ordenar duplicados por índice descendente para eliminar desde el final
                        duplicadosEncontrados.sort((a, b) => b.index - a.index);
                        
                        duplicadosEncontrados.forEach(dup => {
                            console.log(`   ❌ Eliminando duplicado: "${dup.duplicado.descripcion}"`);
                            nodo.funciones.splice(dup.index, 1);
                            funcionesEliminadas++;
                        });
                        
                        console.log(`   ✅ Funciones después de limpieza: ${nodo.funciones.length}\n`);
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
            json.metadata.totalRecords = json.metadata.totalRecords - funcionesEliminadas;
            json.metadata.version = json.metadata.version + "-duplicados-eliminados";
            json.metadata.exportDate = new Date().toISOString();
            
            // Actualizar estadísticas por tipo
            if (json.metadata.stats && json.metadata.stats.validationByType) {
                // Recalcular estadísticas
                let totalGenericas = 0;
                let totalEspecificas = 0;
                let totalIndicadores = 0;
                
                function contarFunciones(nodos) {
                    nodos.forEach(nodo => {
                        if (nodo.funciones) {
                            nodo.funciones.forEach(func => {
                                switch (func.tipo) {
                                    case 'Genérica':
                                        totalGenericas++;
                                        break;
                                    case 'Específica':
                                        totalEspecificas++;
                                        break;
                                    case 'Indicador':
                                        totalIndicadores++;
                                        break;
                                }
                            });
                        }
                        if (nodo.children) {
                            contarFunciones(nodo.children);
                        }
                    });
                }
                
                contarFunciones(json.hierarchy.tree);
                
                if (json.metadata.stats.validationByType.Generica) {
                    json.metadata.stats.validationByType.Generica.total = totalGenericas;
                    json.metadata.stats.validationByType.Generica.complete = totalGenericas;
                }
                if (json.metadata.stats.validationByType.Específica) {
                    json.metadata.stats.validationByType.Específica.total = totalEspecificas;
                    json.metadata.stats.validationByType.Específica.complete = totalEspecificas;
                }
                if (json.metadata.stats.validationByType.Indicador) {
                    json.metadata.stats.validationByType.Indicador.total = totalIndicadores;
                    json.metadata.stats.validationByType.Indicador.complete = totalIndicadores;
                }
                
                json.metadata.stats.totalRecords = totalGenericas + totalEspecificas + totalIndicadores;
                json.metadata.stats.completeRecords = json.metadata.stats.totalRecords;
            }
        }
        
        // Guardar el JSON actualizado
        const jsonActualizado = JSON.stringify(json, null, 2);
        fs.writeFileSync('estructura_organizativa_completa.json', jsonActualizado);
        
        console.log('📊 RESUMEN DE LIMPIEZA:');
        console.log(`   Total de funciones procesadas: ${totalFunciones}`);
        console.log(`   Funciones duplicadas encontradas: ${funcionesDuplicadas}`);
        console.log(`   Funciones eliminadas: ${funcionesEliminadas}`);
        console.log(`   Funciones restantes: ${totalFunciones - funcionesEliminadas}`);
        console.log(`   Porcentaje de reducción: ${((funcionesEliminadas / totalFunciones) * 100).toFixed(2)}%`);
        
        console.log('\n✅ Limpieza de funciones duplicadas completada');
        
    } catch (error) {
        console.error('❌ Error al eliminar funciones duplicadas:', error.message);
    }
}

// Ejecutar el script
eliminarFuncionesDuplicadas(); 