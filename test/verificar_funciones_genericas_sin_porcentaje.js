const fs = require('fs');

// Función para verificar que las funciones genéricas no tengan porcentaje de dedicación
function verificarFuncionesGenericasSinPorcentaje() {
    try {
        // Leer el archivo JSON
        const jsonData = fs.readFileSync('organigrama_bna_2025-07-29.json', 'utf8');
        const data = JSON.parse(jsonData);
        
        let errores = [];
        let totalFuncionesGenericas = 0;
        let funcionesGenericasConPorcentaje = 0;
        
        // Función recursiva para recorrer todas las unidades
        function recorrerUnidades(unidades, ruta = '') {
            unidades.forEach(unidad => {
                if (unidad.funciones) {
                    unidad.funciones.forEach(funcion => {
                        if (funcion.tipo === 'Genérica') {
                            totalFuncionesGenericas++;
                            
                            // Verificar si tiene porcentaje de dedicación
                            if (funcion.porcentajeDedicacion && 
                                funcion.porcentajeDedicacion !== '' && 
                                funcion.porcentajeDedicacion !== null) {
                                
                                funcionesGenericasConPorcentaje++;
                                errores.push({
                                    unidad: unidad.nombre,
                                    ruta: ruta + ' > ' + unidad.nombre,
                                    funcion: funcion.descripcion,
                                    porcentaje: funcion.porcentajeDedicacion,
                                    orden: funcion.orden
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
        console.log('🔍 VERIFICACIÓN DE FUNCIONES GENÉRICAS SIN PORCENTAJE DE DEDICACIÓN');
        console.log('=' .repeat(80));
        
        console.log(`📊 Total de funciones genéricas encontradas: ${totalFuncionesGenericas}`);
        console.log(`❌ Funciones genéricas con porcentaje de dedicación: ${funcionesGenericasConPorcentaje}`);
        console.log(`✅ Funciones genéricas correctas (sin porcentaje): ${totalFuncionesGenericas - funcionesGenericasConPorcentaje}`);
        
        if (errores.length > 0) {
            console.log('\n🚨 ERRORES ENCONTRADOS:');
            console.log('=' .repeat(80));
            
            errores.forEach((error, index) => {
                console.log(`\n${index + 1}. Unidad: ${error.unidad}`);
                console.log(`   Ruta: ${error.ruta}`);
                console.log(`   Función (Orden ${error.orden}): ${error.funcion}`);
                console.log(`   Porcentaje incorrecto: ${error.porcentaje}`);
            });
            
            console.log('\n💡 RECOMENDACIÓN:');
            console.log('Las funciones genéricas NO deben tener porcentaje de dedicación.');
            console.log('Solo las funciones específicas deben tener este campo.');
            
            return false;
        } else {
            console.log('\n✅ ¡EXCELENTE! Todas las funciones genéricas están correctas.');
            console.log('No se encontraron funciones genéricas con porcentaje de dedicación.');
            return true;
        }
        
    } catch (error) {
        console.error('❌ Error al procesar el archivo:', error.message);
        return false;
    }
}

// Ejecutar la verificación
console.log('Iniciando verificación de funciones genéricas...\n');
const resultado = verificarFuncionesGenericasSinPorcentaje();

if (resultado) {
    console.log('\n🎉 Verificación completada exitosamente.');
} else {
    console.log('\n⚠️  Se encontraron errores que requieren corrección.');
} 