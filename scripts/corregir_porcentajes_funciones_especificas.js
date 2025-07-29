const fs = require('fs');

// Función para redondear a múltiplos de 5%
function redondearAMultiplosDe5(porcentaje) {
    return Math.round(porcentaje / 5) * 5;
}

// Función para corregir porcentajes de funciones específicas
function corregirPorcentajesFuncionesEspecificas() {
    try {
        // Leer el archivo JSON
        const jsonData = fs.readFileSync('organigrama_bna_2025-07-29.json', 'utf8');
        const data = JSON.parse(jsonData);
        
        let unidadesCorregidas = 0;
        let funcionesCorregidas = 0;
        
        // Función recursiva para recorrer todas las unidades
        function recorrerUnidades(unidades) {
            unidades.forEach(unidad => {
                if (unidad.funciones) {
                    const funcionesEspecificas = unidad.funciones.filter(f => f.tipo === 'Específica');
                    
                    if (funcionesEspecificas.length > 0) {
                        let funcionesConPorcentaje = funcionesEspecificas.filter(f => 
                            f.porcentajeDedicacion && 
                            f.porcentajeDedicacion !== '' && 
                            f.porcentajeDedicacion !== null
                        );
                        
                        if (funcionesConPorcentaje.length > 0) {
                            let sumaOriginal = 0;
                            let porcentajesOriginales = [];
                            
                            // Calcular suma original y guardar porcentajes originales
                            funcionesConPorcentaje.forEach(funcion => {
                                const porcentaje = parseFloat(funcion.porcentajeDedicacion);
                                sumaOriginal += porcentaje;
                                porcentajesOriginales.push({
                                    funcion: funcion,
                                    porcentajeOriginal: porcentaje
                                });
                            });
                            
                            // Redondear todos los porcentajes a múltiplos de 5%
                            let porcentajesRedondeados = porcentajesOriginales.map(item => {
                                const redondeado = redondearAMultiplosDe5(item.porcentajeOriginal);
                                return {
                                    funcion: item.funcion,
                                    porcentajeOriginal: item.porcentajeOriginal,
                                    porcentajeRedondeado: redondeado
                                };
                            });
                            
                            // Calcular nueva suma
                            let nuevaSuma = porcentajesRedondeados.reduce((sum, item) => sum + item.porcentajeRedondeado, 0);
                            
                            // Ajustar para que sume exactamente 100%
                            if (nuevaSuma !== 100) {
                                // Encontrar la función con mayor diferencia para ajustar
                                let diferencias = porcentajesRedondeados.map(item => ({
                                    ...item,
                                    diferencia: Math.abs(item.porcentajeRedondeado - item.porcentajeOriginal)
                                }));
                                
                                // Ordenar por diferencia (mayor a menor)
                                diferencias.sort((a, b) => b.diferencia - a.diferencia);
                                
                                // Ajustar la primera función para que la suma sea 100
                                const ajuste = 100 - nuevaSuma;
                                diferencias[0].porcentajeRedondeado += ajuste;
                                
                                // Asegurar que no sea negativo
                                if (diferencias[0].porcentajeRedondeado < 5) {
                                    diferencias[0].porcentajeRedondeado = 5;
                                }
                                
                                // Recalcular suma
                                nuevaSuma = diferencias.reduce((sum, item) => sum + item.porcentajeRedondeado, 0);
                                
                                // Si aún no suma 100, ajustar la segunda función
                                if (nuevaSuma !== 100 && diferencias.length > 1) {
                                    const ajuste2 = 100 - nuevaSuma;
                                    diferencias[1].porcentajeRedondeado += ajuste2;
                                    
                                    if (diferencias[1].porcentajeRedondeado < 5) {
                                        diferencias[1].porcentajeRedondeado = 5;
                                    }
                                }
                                
                                // Aplicar los cambios
                                diferencias.forEach(item => {
                                    item.funcion.porcentajeDedicacion = item.porcentajeRedondeado.toString();
                                    funcionesCorregidas++;
                                });
                                
                                console.log(`✅ Corregida unidad "${unidad.nombre}":`);
                                console.log(`   Suma original: ${sumaOriginal.toFixed(1)}% → Nueva suma: ${nuevaSuma}%`);
                                porcentajesOriginales.forEach((item, index) => {
                                    const redondeado = diferencias.find(d => d.funcion === item.funcion);
                                    console.log(`   Función ${item.funcion.orden}: ${item.porcentajeOriginal.toFixed(1)}% → ${redondeado.porcentajeRedondeado}%`);
                                });
                                
                                unidadesCorregidas++;
                            } else {
                                // Solo aplicar redondeo sin ajustes adicionales
                                porcentajesRedondeados.forEach(item => {
                                    if (item.porcentajeRedondeado !== item.porcentajeOriginal) {
                                        item.funcion.porcentajeDedicacion = item.porcentajeRedondeado.toString();
                                        funcionesCorregidas++;
                                    }
                                });
                                
                                if (porcentajesRedondeados.some(item => item.porcentajeRedondeado !== item.porcentajeOriginal)) {
                                    console.log(`✅ Corregida unidad "${unidad.nombre}": Solo redondeo a múltiplos de 5%`);
                                    unidadesCorregidas++;
                                }
                            }
                        }
                    }
                }
                
                // Recorrer unidades hijas
                if (unidad.children && unidad.children.length > 0) {
                    recorrerUnidades(unidad.children);
                }
            });
        }
        
        // Iniciar el recorrido
        recorrerUnidades(data.hierarchy.tree);
        
        // Actualizar metadata
        if (unidadesCorregidas > 0) {
            data.metadata.version += "-porcentajes-funciones-especificas-corregidos";
            data.metadata.actualizado = new Date().toISOString();
            data.metadata.notes.push(`Corregidos porcentajes en ${unidadesCorregidas} unidades`);
            data.metadata.notes.push(`Ajustados ${funcionesCorregidas} funciones específicas a múltiplos de 5%`);
        }
        
        // Guardar el archivo corregido
        fs.writeFileSync('organigrama_bna_2025-07-29.json', JSON.stringify(data, null, 2), 'utf8');
        
        // Mostrar resultados
        console.log('\n🔧 CORRECCIÓN DE PORCENTAJES DE FUNCIONES ESPECÍFICAS');
        console.log('=' .repeat(80));
        
        console.log(`✅ Unidades corregidas: ${unidadesCorregidas}`);
        console.log(`✅ Funciones específicas ajustadas: ${funcionesCorregidas}`);
        
        if (unidadesCorregidas > 0) {
            console.log('\n📝 Archivo actualizado: organigrama_bna_2025-07-29.json');
            console.log('📝 Metadata actualizada con nueva versión y notas');
            return true;
        } else {
            console.log('\n✅ No se encontraron unidades que requieran corrección.');
            return false;
        }
        
    } catch (error) {
        console.error('❌ Error al procesar el archivo:', error.message);
        return false;
    }
}

// Ejecutar la corrección
console.log('Iniciando corrección de porcentajes de funciones específicas...\n');
const resultado = corregirPorcentajesFuncionesEspecificas();

if (resultado) {
    console.log('\n🎉 Corrección completada exitosamente.');
} else {
    console.log('\n✅ No se requirieron correcciones.');
} 