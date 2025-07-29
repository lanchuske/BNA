// Script para unificar las dos áreas Head De Segmentos bajo Segmento Personas
const fs = require('fs');

function unificarHeadSegmentos() {
    try {
        // Leer el JSON actual
        const jsonContent = fs.readFileSync('estructura_organizativa_completa.json', 'utf8');
        const json = JSON.parse(jsonContent);
        
        console.log('=== UNIFICANDO HEAD DE SEGMENTOS ===\n');
        
        let unidadesEncontradas = 0;
        let funcionesUnificadas = 0;
        let indicadoresUnificados = 0;
        
        // Función para procesar nodos recursivamente
        function procesarNodos(nodos) {
            for (let i = 0; i < nodos.length; i++) {
                const nodo = nodos[i];
                
                // Buscar Segmento Personas
                if (nodo.nombre === 'Segmento Personas' && nodo.children) {
                    console.log('📍 Encontrado Segmento Personas');
                    
                    // Buscar las dos unidades Head De Segmentos
                    let headCompleto = null;
                    let headSimple = null;
                    let indexHeadCompleto = -1;
                    let indexHeadSimple = -1;
                    
                    for (let j = 0; j < nodo.children.length; j++) {
                        const child = nodo.children[j];
                        if (child.nombre === 'Head De Segmentos (Haberes, Profesionales e Independientes, Renta Alta, Joven, Jubilados y Renta Masiva)') {
                            headCompleto = child;
                            indexHeadCompleto = j;
                            console.log('   ✅ Encontrado Head De Segmentos (completo)');
                        } else if (child.nombre === 'Head De Segmentos') {
                            headSimple = child;
                            indexHeadSimple = j;
                            console.log('   ✅ Encontrado Head De Segmentos (simple)');
                        }
                    }
                    
                    // Si encontramos ambas unidades, proceder con la unificación
                    if (headCompleto && headSimple) {
                        console.log('\n🔄 Iniciando unificación...');
                        
                        // 1. Unificar funciones
                        if (headSimple.funciones && headSimple.funciones.length > 0) {
                            if (!headCompleto.funciones) {
                                headCompleto.funciones = [];
                            }
                            
                            console.log(`   📋 Unificando ${headSimple.funciones.length} funciones...`);
                            
                            headSimple.funciones.forEach(func => {
                                // Verificar si la función ya existe (por descripción)
                                const existe = headCompleto.funciones.some(f => 
                                    f.descripcion === func.descripcion && f.tipo === func.tipo
                                );
                                
                                if (!existe) {
                                    // Ajustar el orden para evitar conflictos
                                    const maxOrden = Math.max(...headCompleto.funciones.map(f => f.orden || 0), 0);
                                    func.orden = maxOrden + 1;
                                    headCompleto.funciones.push(func);
                                    funcionesUnificadas++;
                                } else {
                                    console.log(`      ⚠️ Función duplicada encontrada: ${func.descripcion.substring(0, 50)}...`);
                                }
                            });
                        }
                        
                        // 2. Unificar children (subunidades)
                        if (headSimple.children && headSimple.children.length > 0) {
                            if (!headCompleto.children) {
                                headCompleto.children = [];
                            }
                            
                            console.log(`   📁 Unificando ${headSimple.children.length} subunidades...`);
                            
                            headSimple.children.forEach(child => {
                                // Verificar si la subunidad ya existe
                                const existe = headCompleto.children.some(c => c.nombre === child.nombre);
                                
                                if (!existe) {
                                    headCompleto.children.push(child);
                                    console.log(`      ✅ Agregada subunidad: ${child.nombre}`);
                                } else {
                                    console.log(`      ⚠️ Subunidad duplicada encontrada: ${child.nombre}`);
                                }
                            });
                        }
                        
                        // 3. Unificar misiones si existen
                        if (headSimple.mision && !headCompleto.mision) {
                            headCompleto.mision = headSimple.mision;
                            console.log('   📝 Unificada misión');
                        }
                        
                        // 4. Eliminar la unidad simple
                        nodo.children.splice(indexHeadSimple, 1);
                        console.log('   🗑️ Eliminada unidad Head De Segmentos (simple)');
                        
                        unidadesEncontradas = 2;
                        
                    } else {
                        console.log('   ⚠️ No se encontraron ambas unidades para unificar');
                        if (!headCompleto) console.log('      - Falta: Head De Segmentos (completo)');
                        if (!headSimple) console.log('      - Falta: Head De Segmentos (simple)');
                    }
                }
                
                // Procesar hijos recursivamente
                if (nodo.children && nodo.children.length > 0) {
                    procesarNodos(nodo.children);
                }
            }
        }
        
        // Procesar todo el árbol
        if (json.hierarchy && json.hierarchy.tree) {
            procesarNodos(json.hierarchy.tree);
        }
        
        // Actualizar metadata
        if (json.metadata) {
            json.metadata.version = json.metadata.version + "-head-segmentos-unificado";
            json.metadata.exportDate = new Date().toISOString();
            
            // Actualizar estadísticas
            if (json.metadata.stats) {
                json.metadata.stats.totalUnits = json.metadata.stats.totalUnits - 1; // Una unidad menos
            }
        }
        
        // Guardar el JSON actualizado
        const jsonActualizado = JSON.stringify(json, null, 2);
        fs.writeFileSync('estructura_organizativa_completa.json', jsonActualizado);
        
        console.log('\n📊 RESUMEN DE UNIFICACIÓN:');
        console.log(`   Unidades encontradas: ${unidadesEncontradas}`);
        console.log(`   Funciones unificadas: ${funcionesUnificadas}`);
        console.log(`   Indicadores unificados: ${indicadoresUnificados}`);
        
        if (unidadesEncontradas === 2) {
            console.log('\n✅ Unificación completada exitosamente');
            console.log('   - Head De Segmentos (completo) mantiene su nombre');
            console.log('   - Head De Segmentos (simple) fue eliminada');
            console.log('   - Funciones y subunidades fueron unificadas');
        } else {
            console.log('\n⚠️ No se pudo completar la unificación');
        }
        
    } catch (error) {
        console.error('❌ Error al unificar Head De Segmentos:', error.message);
    }
}

// Ejecutar el script
unificarHeadSegmentos(); 