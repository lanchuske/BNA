const fs = require('fs');

// Función para verificar que los indicadores no tengan ni producto final ni porcentaje de dedicación
function verificarIndicadoresSinProductoFinalNiPorcentaje() {
    try {
        // Leer el archivo JSON
        const jsonData = fs.readFileSync('organigrama_bna_2025-07-29.json', 'utf8');
        const data = JSON.parse(jsonData);
        
        let errores = [];
        let totalIndicadores = 0;
        let indicadoresConProductoFinal = 0;
        let indicadoresConPorcentaje = 0;
        
        // Función recursiva para recorrer todas las unidades
        function recorrerUnidades(unidades, ruta = '') {
            unidades.forEach(unidad => {
                if (unidad.funciones) {
                    unidad.funciones.forEach(funcion => {
                        if (funcion.tipo === 'Indicador') {
                            totalIndicadores++;
                            
                            let erroresFuncion = [];
                            
                            // Verificar si tiene producto final
                            if (funcion.productoFinal && 
                                funcion.productoFinal !== '' && 
                                funcion.productoFinal !== null) {
                                
                                indicadoresConProductoFinal++;
                                erroresFuncion.push(`Tiene producto final: "${funcion.productoFinal}"`);
                            }
                            
                            // Verificar si tiene porcentaje de dedicación
                            if (funcion.porcentajeDedicacion && 
                                funcion.porcentajeDedicacion !== '' && 
                                funcion.porcentajeDedicacion !== null) {
                                
                                indicadoresConPorcentaje++;
                                erroresFuncion.push(`Tiene porcentaje de dedicación: "${funcion.porcentajeDedicacion}"`);
                            }
                            
                            // Si hay errores, agregar a la lista
                            if (erroresFuncion.length > 0) {
                                errores.push({
                                    unidad: unidad.nombre,
                                    ruta: ruta + ' > ' + unidad.nombre,
                                    funcion: funcion.descripcion,
                                    orden: funcion.orden,
                                    errores: erroresFuncion
                                });
                            }
                        }
                    });
                }
                
                // Recorrer unidades hijas
                if (unidad.children && unidad.children.length > 0) {
                    const nuevaRuta = ruta ? ruta + ' > ' + unidad.nombre : unidad.nombre;
                    recorrerUnidades(unidad.children, nuevaRuta);
                }
            });
        }
        
        // Iniciar el recorrido
        recorrerUnidades(data.hierarchy.tree);
        
        // Mostrar resultados
        console.log('🔍 VERIFICACIÓN DE INDICADORES SIN PRODUCTO FINAL NI PORCENTAJE DE DEDICACIÓN');
        console.log('=' .repeat(80));
        
        console.log(`📊 Total de indicadores encontrados: ${totalIndicadores}`);
        console.log(`❌ Indicadores con producto final: ${indicadoresConProductoFinal}`);
        console.log(`❌ Indicadores con porcentaje de dedicación: ${indicadoresConPorcentaje}`);
        console.log(`✅ Indicadores correctos (sin producto final ni porcentaje): ${totalIndicadores - Math.max(indicadoresConProductoFinal, indicadoresConPorcentaje)}`);
        
        if (errores.length > 0) {
            console.log('\n🚨 ERRORES ENCONTRADOS:');
            console.log('=' .repeat(80));
            
            errores.forEach((error, index) => {
                console.log(`\n${index + 1}. Unidad: ${error.unidad}`);
                console.log(`   Ruta: ${error.ruta}`);
                console.log(`   Indicador (Orden ${error.orden}): ${error.funcion}`);
                console.log(`   Errores:`);
                error.errores.forEach(erro => {
                    console.log(`     - ${erro}`);
                });
            });
            
            console.log('\n💡 RECOMENDACIÓN:');
            console.log('Los indicadores NO deben tener:');
            console.log('- Producto final');
            console.log('- Porcentaje de dedicación');
            console.log('Solo deben tener: descripción y tipo "Indicador"');
            
            return false;
        } else {
            console.log('\n✅ ¡EXCELENTE! Todos los indicadores están correctos.');
            console.log('No se encontraron indicadores con producto final o porcentaje de dedicación.');
            return true;
        }
        
    } catch (error) {
        console.error('❌ Error al procesar el archivo:', error.message);
        return false;
    }
}

// Ejecutar la verificación
console.log('Iniciando verificación de indicadores...\n');
const resultado = verificarIndicadoresSinProductoFinalNiPorcentaje();

if (resultado) {
    console.log('\n🎉 Verificación completada exitosamente.');
} else {
    console.log('\n⚠️  Se encontraron errores que requieren corrección.');
} 