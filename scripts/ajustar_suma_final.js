const fs = require('fs');

// Función para ajustar la suma final
function ajustarSumaFinal() {
    try {
        // Leer el archivo JSON
        const jsonData = fs.readFileSync('organigrama_bna_2025-07-29.json', 'utf8');
        const data = JSON.parse(jsonData);
        
        // Función recursiva para encontrar la unidad específica
        function encontrarYCorregirUnidad(unidades) {
            unidades.forEach(unidad => {
                if (unidad.nombre === 'Coordinación Del Negocio Y Datos') {
                    console.log(`🔧 Ajustando suma final en: ${unidad.nombre}`);
                    
                    if (unidad.funciones) {
                        const funcionesEspecificas = unidad.funciones.filter(f => f.tipo === 'Específica');
                        const funcionesConPorcentaje = funcionesEspecificas.filter(f => 
                            f.porcentajeDedicacion && 
                            f.porcentajeDedicacion !== '' && 
                            f.porcentajeDedicacion !== null
                        );
                        
                        // Calcular suma actual
                        let sumaActual = 0;
                        funcionesConPorcentaje.forEach(funcion => {
                            sumaActual += parseFloat(funcion.porcentajeDedicacion);
                        });
                        
                        console.log(`   Suma actual: ${sumaActual}%`);
                        
                        // Si la suma es mayor a 100%, reducir algunos porcentajes
                        if (sumaActual > 100) {
                            const exceso = sumaActual - 100;
                            console.log(`   Exceso: ${exceso}%`);
                            
                            // Reducir las últimas funciones para compensar
                            let reduccionRestante = exceso;
                            for (let i = funcionesConPorcentaje.length - 1; i >= 0 && reduccionRestante > 0; i--) {
                                const funcion = funcionesConPorcentaje[i];
                                const porcentajeActual = parseFloat(funcion.porcentajeDedicacion);
                                
                                if (porcentajeActual > 0) {
                                    const reduccion = Math.min(reduccionRestante, porcentajeActual);
                                    funcion.porcentajeDedicacion = (porcentajeActual - reduccion).toString();
                                    reduccionRestante -= reduccion;
                                    
                                    console.log(`   Función ${funcion.orden}: ${porcentajeActual}% → ${funcion.porcentajeDedicacion}%`);
                                }
                            }
                        }
                        
                        // Verificar suma final
                        let sumaFinal = 0;
                        funcionesConPorcentaje.forEach(funcion => {
                            sumaFinal += parseFloat(funcion.porcentajeDedicacion);
                        });
                        
                        console.log(`   Suma final: ${sumaFinal}%`);
                        
                        if (sumaFinal === 100) {
                            console.log(`   ✅ Ajuste exitoso`);
                        } else {
                            console.log(`   ❌ Error en el ajuste`);
                        }
                    }
                }
                
                // Recorrer unidades hijas
                if (unidad.children && unidad.children.length > 0) {
                    encontrarYCorregirUnidad(unidad.children);
                }
            });
        }
        
        // Iniciar la búsqueda y corrección
        encontrarYCorregirUnidad(data.hierarchy.tree);
        
        // Actualizar metadata
        data.metadata.version += "-suma-final-ajustada";
        data.metadata.actualizado = new Date().toISOString();
        data.metadata.notes.push(`Ajuste final de suma en Coordinación Del Negocio Y Datos`);
        
        // Guardar el archivo corregido
        fs.writeFileSync('organigrama_bna_2025-07-29.json', JSON.stringify(data, null, 2), 'utf8');
        
        console.log('\n📝 Archivo actualizado: organigrama_bna_2025-07-29.json');
        console.log('📝 Metadata actualizada con nueva versión y notas');
        
        return true;
        
    } catch (error) {
        console.error('❌ Error al procesar el archivo:', error.message);
        return false;
    }
}

// Ejecutar el ajuste
console.log('Iniciando ajuste final de suma...\n');
const resultado = ajustarSumaFinal();

if (resultado) {
    console.log('\n🎉 Ajuste completado exitosamente.');
} else {
    console.log('\n❌ Error en el ajuste.');
} 