// Script para validar porcentajes de dedicación
const fs = require('fs');

function validarPorcentajesDedicacion() {
    try {
        // Leer el JSON actual
        const jsonContent = fs.readFileSync('estructura_organizativa_completa.json', 'utf8');
        const json = JSON.parse(jsonContent);
        
        console.log('=== VALIDANDO PORCENTAJES DE DEDICACIÓN ===\n');
        
        let unidadesConProblemas = [];
        let unidadesValidadas = 0;
        let totalUnidades = 0;
        
        // Función para procesar nodos recursivamente
        function procesarNodos(nodos) {
            nodos.forEach(nodo => {
                if (nodo.funciones && nodo.funciones.length > 0) {
                    totalUnidades++;
                    
                    // Filtrar solo funciones específicas (que deben tener porcentaje)
                    const funcionesEspecificas = nodo.funciones.filter(f => f.tipo === 'Específica');
                    
                    // Solo validar si hay funciones específicas
                    if (funcionesEspecificas.length === 0) {
                        console.log(`ℹ️ Unidad: ${nodo.nombre} - No tiene funciones específicas, no requiere validación de porcentajes`);
                        return;
                    }
                    
                    if (funcionesEspecificas.length > 0) {
                        let sumaPorcentajes = 0;
                        let funcionesSinPorcentaje = [];
                        let funcionesConPorcentaje = [];
                        
                        funcionesEspecificas.forEach(func => {
                            const porcentaje = parseFloat(func.porcentajeDedicacion) || 0;
                            
                            if (porcentaje > 0) {
                                sumaPorcentajes += porcentaje;
                                funcionesConPorcentaje.push({
                                    descripcion: func.descripcion,
                                    porcentaje: porcentaje
                                });
                            } else {
                                funcionesSinPorcentaje.push(func.descripcion);
                            }
                        });
                        
                        // Validar que sumen 100%
                        const diferencia = Math.abs(100 - sumaPorcentajes);
                        const esValido = diferencia <= 1; // Tolerancia de 1%
                        
                        if (!esValido || funcionesSinPorcentaje.length > 0) {
                            unidadesConProblemas.push({
                                unidad: nodo.nombre,
                                sumaPorcentajes: sumaPorcentajes,
                                diferencia: diferencia,
                                funcionesSinPorcentaje: funcionesSinPorcentaje,
                                funcionesConPorcentaje: funcionesConPorcentaje,
                                totalFuncionesEspecificas: funcionesEspecificas.length
                            });
                        } else {
                            unidadesValidadas++;
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
        
        // Mostrar resultados
        console.log('📊 RESULTADOS DE VALIDACIÓN:');
        console.log(`   Total de unidades con funciones específicas: ${totalUnidades}`);
        console.log(`   Unidades validadas correctamente: ${unidadesValidadas}`);
        console.log(`   Unidades con problemas: ${unidadesConProblemas.length}`);
        
        if (unidadesConProblemas.length > 0) {
            console.log('\n❌ UNIDADES CON PROBLEMAS:');
            unidadesConProblemas.forEach((problema, index) => {
                console.log(`\n${index + 1}. ${problema.unidad}`);
                console.log(`   Suma de porcentajes: ${problema.sumaPorcentajes}%`);
                console.log(`   Diferencia con 100%: ${problema.diferencia}%`);
                console.log(`   Total funciones específicas: ${problema.totalFuncionesEspecificas}`);
                
                if (problema.funcionesSinPorcentaje.length > 0) {
                    console.log(`   ❌ Funciones sin porcentaje (${problema.funcionesSinPorcentaje.length}):`);
                    problema.funcionesSinPorcentaje.forEach(func => {
                        console.log(`      - ${func}`);
                    });
                }
                
                if (problema.funcionesConPorcentaje.length > 0) {
                    console.log(`   ✅ Funciones con porcentaje (${problema.funcionesConPorcentaje.length}):`);
                    problema.funcionesConPorcentaje.forEach(func => {
                        console.log(`      - ${func.porcentaje}%: ${func.descripcion}`);
                    });
                }
            });
            
            // Generar recomendaciones de corrección
            console.log('\n💡 RECOMENDACIONES DE CORRECCIÓN:');
            unidadesConProblemas.forEach(problema => {
                console.log(`\n🔧 Para "${problema.unidad}":`);
                
                if (problema.funcionesSinPorcentaje.length > 0) {
                    const porcentajePorFuncion = (100 - problema.sumaPorcentajes) / problema.funcionesSinPorcentaje.length;
                    console.log(`   - Asignar ${porcentajePorFuncion.toFixed(1)}% a cada función sin porcentaje`);
                }
                
                if (problema.diferencia > 1) {
                    console.log(`   - Ajustar porcentajes para que sumen exactamente 100%`);
                }
            });
        } else {
            console.log('\n✅ Todas las unidades tienen porcentajes válidos');
        }
        
        // Calcular estadísticas generales
        const porcentajeValidas = ((unidadesValidadas / totalUnidades) * 100).toFixed(2);
        console.log(`\n📈 Porcentaje de unidades validadas: ${porcentajeValidas}%`);
        
        if (unidadesConProblemas.length > 0) {
            console.log('\n⚠️ Se encontraron problemas que requieren corrección manual');
        } else {
            console.log('\n✅ Validación completada exitosamente');
        }
        
    } catch (error) {
        console.error('❌ Error al validar porcentajes:', error.message);
    }
}

// Ejecutar el script
validarPorcentajesDedicacion(); 