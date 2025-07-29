const fs = require('fs');

// Función para corregir porcentajes de 4% a 5%
function corregirPorcentajes4a5() {
    try {
        // Leer el archivo JSON
        const jsonData = fs.readFileSync('organigrama_bna_2025-07-29.json', 'utf8');
        const data = JSON.parse(jsonData);
        
        let funcionesCorregidas = 0;
        
        // Función recursiva para recorrer todas las unidades
        function recorrerUnidades(unidades) {
            unidades.forEach(unidad => {
                if (unidad.funciones) {
                    const funcionesEspecificas = unidad.funciones.filter(f => f.tipo === 'Específica');
                    
                    funcionesEspecificas.forEach(funcion => {
                        if (funcion.porcentajeDedicacion && 
                            funcion.porcentajeDedicacion !== '' && 
                            funcion.porcentajeDedicacion !== null) {
                            
                            const porcentaje = parseFloat(funcion.porcentajeDedicacion);
                            
                            // Si el porcentaje es 4%, cambiarlo a 5%
                            if (porcentaje === 4) {
                                const porcentajeAnterior = funcion.porcentajeDedicacion;
                                funcion.porcentajeDedicacion = "5";
                                funcionesCorregidas++;
                                
                                console.log(`✅ Corregida función en "${unidad.nombre}":`);
                                console.log(`   Función ${funcion.orden}: ${porcentajeAnterior}% → 5%`);
                            }
                        }
                    });
                }
                
                // Recorrer unidades hijas
                if (unidad.children && unidad.children.length > 0) {
                    recorrerUnidades(unidad.children);
                }
            });
        }
        
        // Iniciar el recorrido
        recorrerUnidades(data.hierarchy.tree);
        
        // Ahora necesitamos ajustar la suma para que sea 100%
        // Buscar la unidad Coordinación Del Negocio Y Datos y ajustar
        function ajustarSuma(unidades) {
            unidades.forEach(unidad => {
                if (unidad.nombre === 'Coordinación Del Negocio Y Datos') {
                    console.log(`🔧 Ajustando suma en: ${unidad.nombre}`);
                    
                    if (unidad.funciones) {
                        const funcionesEspecificas = unidad.funciones.filter(f => f.tipo === 'Específica');
                        const funcionesConPorcentaje = funcionesEspecificas.filter(f => 
                            f.porcentajeDedicacion && 
                            f.porcentajeDedicacion !== '' && 
                            f.porcentajeDedicacion !== null
                        );
                        
                        // Calcular nueva suma
                        let nuevaSuma = 0;
                        funcionesConPorcentaje.forEach(funcion => {
                            nuevaSuma += parseFloat(funcion.porcentajeDedicacion);
                        });
                        
                        console.log(`   Nueva suma después de correcciones: ${nuevaSuma}%`);
                        
                        // Si la suma es mayor a 100%, reducir algunos porcentajes
                        if (nuevaSuma > 100) {
                            const exceso = nuevaSuma - 100;
                            console.log(`   Exceso: ${exceso}%`);
                            
                            // Reducir las primeras funciones para compensar
                            let reduccionRestante = exceso;
                            for (let i = 0; i < funcionesConPorcentaje.length && reduccionRestante > 0; i++) {
                                const funcion = funcionesConPorcentaje[i];
                                const porcentajeActual = parseFloat(funcion.porcentajeDedicacion);
                                
                                if (porcentajeActual > 5) {
                                    const reduccion = Math.min(reduccionRestante, porcentajeActual - 5);
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
                    ajustarSuma(unidad.children);
                }
            });
        }
        
        // Ajustar la suma
        ajustarSuma(data.hierarchy.tree);
        
        // Actualizar metadata
        if (funcionesCorregidas > 0) {
            data.metadata.version += "-porcentajes-4-a-5-corregidos";
            data.metadata.actualizado = new Date().toISOString();
            data.metadata.notes.push(`Corregidos ${funcionesCorregidas} porcentajes de 4% a 5%`);
        }
        
        // Guardar el archivo corregido
        fs.writeFileSync('organigrama_bna_2025-07-29.json', JSON.stringify(data, null, 2), 'utf8');
        
        // Mostrar resultados
        console.log('\n🔧 CORRECCIÓN DE PORCENTAJES 4% A 5%');
        console.log('=' .repeat(80));
        
        console.log(`✅ Funciones específicas corregidas: ${funcionesCorregidas}`);
        
        if (funcionesCorregidas > 0) {
            console.log('\n📝 Archivo actualizado: organigrama_bna_2025-07-29.json');
            console.log('📝 Metadata actualizada con nueva versión y notas');
            return true;
        } else {
            console.log('\n✅ No se encontraron porcentajes de 4% que requieran corrección.');
            return false;
        }
        
    } catch (error) {
        console.error('❌ Error al procesar el archivo:', error.message);
        return false;
    }
}

// Ejecutar la corrección
console.log('Iniciando corrección de porcentajes 4% a 5%...\n');
const resultado = corregirPorcentajes4a5();

if (resultado) {
    console.log('\n🎉 Corrección completada exitosamente.');
} else {
    console.log('\n✅ No se requirieron correcciones.');
} 