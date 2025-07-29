const fs = require('fs');

// Función para verificar funciones específicas con porcentajes correctos
function verificarFuncionesEspecificasPorcentajes() {
    try {
        // Leer el archivo JSON
        const jsonData = fs.readFileSync('organigrama_bna_2025-07-29.json', 'utf8');
        const data = JSON.parse(jsonData);
        
        let errores = [];
        let unidadesCorrectas = 0;
        let totalUnidades = 0;
        
        // Función recursiva para recorrer todas las unidades
        function recorrerUnidades(unidades, ruta = '') {
            unidades.forEach(unidad => {
                if (unidad.funciones) {
                    const funcionesEspecificas = unidad.funciones.filter(f => f.tipo === 'Específica');
                    
                    if (funcionesEspecificas.length > 0) {
                        totalUnidades++;
                        
                        let sumaPorcentajes = 0;
                        let porcentajesInvalidos = [];
                        let funcionesConPorcentaje = [];
                        
                        funcionesEspecificas.forEach(funcion => {
                            if (funcion.porcentajeDedicacion && 
                                funcion.porcentajeDedicacion !== '' && 
                                funcion.porcentajeDedicacion !== null) {
                                
                                const porcentaje = parseFloat(funcion.porcentajeDedicacion);
                                sumaPorcentajes += porcentaje;
                                
                                funcionesConPorcentaje.push({
                                    orden: funcion.orden,
                                    descripcion: funcion.descripcion,
                                    porcentaje: porcentaje
                                });
                                
                                // Verificar si el porcentaje está en intervalos de 5%
                                if (porcentaje % 5 !== 0) {
                                    porcentajesInvalidos.push({
                                        orden: funcion.orden,
                                        descripcion: funcion.descripcion,
                                        porcentaje: porcentaje
                                    });
                                }
                            }
                        });
                        
                        // Verificar si la suma es 100%
                        const sumaRedondeada = Math.round(sumaPorcentajes * 100) / 100;
                        const esSumaCorrecta = Math.abs(sumaRedondeada - 100) < 0.01;
                        
                        // Verificar si hay porcentajes inválidos
                        const tienePorcentajesInvalidos = porcentajesInvalidos.length > 0;
                        
                        if (!esSumaCorrecta || tienePorcentajesInvalidos) {
                            errores.push({
                                unidad: unidad.nombre,
                                ruta: ruta + ' > ' + unidad.nombre,
                                sumaPorcentajes: sumaRedondeada,
                                esSumaCorrecta: esSumaCorrecta,
                                porcentajesInvalidos: porcentajesInvalidos,
                                funcionesConPorcentaje: funcionesConPorcentaje
                            });
                        } else {
                            unidadesCorrectas++;
                        }
                    }
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
        console.log('🔍 VERIFICACIÓN DE FUNCIONES ESPECÍFICAS - PORCENTAJES');
        console.log('=' .repeat(80));
        
        console.log(`📊 Total de unidades con funciones específicas: ${totalUnidades}`);
        console.log(`✅ Unidades correctas (suma 100% y porcentajes válidos): ${unidadesCorrectas}`);
        console.log(`❌ Unidades con errores: ${errores.length}`);
        
        if (errores.length > 0) {
            console.log('\n🚨 ERRORES ENCONTRADOS:');
            console.log('=' .repeat(80));
            
            errores.forEach((error, index) => {
                console.log(`\n${index + 1}. Unidad: ${error.unidad}`);
                console.log(`   Ruta: ${error.ruta}`);
                console.log(`   Suma de porcentajes: ${error.sumaPorcentajes}%`);
                console.log(`   ¿Suma 100%?: ${error.esSumaCorrecta ? '✅ Sí' : '❌ No'}`);
                
                if (error.porcentajesInvalidos.length > 0) {
                    console.log(`   Porcentajes inválidos (no múltiplos de 5%):`);
                    error.porcentajesInvalidos.forEach(porcentaje => {
                        console.log(`     - Orden ${porcentaje.orden}: ${porcentaje.porcentaje}% - "${porcentaje.descripcion.substring(0, 50)}..."`);
                    });
                }
                
                console.log(`   Funciones con porcentaje:`);
                error.funcionesConPorcentaje.forEach(funcion => {
                    console.log(`     - Orden ${funcion.orden}: ${funcion.porcentaje}% - "${funcion.descripcion.substring(0, 50)}..."`);
                });
            });
            
            console.log('\n💡 REGLAS A CUMPLIR:');
            console.log('1. La suma de porcentajes debe ser exactamente 100%');
            console.log('2. Los porcentajes deben ser múltiplos de 5% (5%, 10%, 15%, etc.)');
            console.log('3. No se permiten porcentajes como 4.3%, 7.2%, etc.');
            
            return false;
        } else {
            console.log('\n✅ ¡EXCELENTE! Todas las unidades están correctas.');
            console.log('Todas las funciones específicas suman 100% y tienen porcentajes válidos.');
            return true;
        }
        
    } catch (error) {
        console.error('❌ Error al procesar el archivo:', error.message);
        return false;
    }
}

// Ejecutar la verificación
console.log('Iniciando verificación de funciones específicas...\n');
const resultado = verificarFuncionesEspecificasPorcentajes();

if (resultado) {
    console.log('\n🎉 Verificación completada exitosamente.');
} else {
    console.log('\n⚠️  Se encontraron errores que requieren corrección.');
} 