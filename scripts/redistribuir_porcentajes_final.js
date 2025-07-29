const fs = require('fs');

// Función para redistribuir porcentajes correctamente
function redistribuirPorcentajesFinal() {
    try {
        // Leer el archivo JSON
        const jsonData = fs.readFileSync('organigrama_bna_2025-07-29.json', 'utf8');
        const data = JSON.parse(jsonData);
        
        // Función recursiva para encontrar la unidad específica
        function encontrarYCorregirUnidad(unidades) {
            unidades.forEach(unidad => {
                if (unidad.nombre === 'Coordinación Del Negocio Y Datos') {
                    console.log(`🔧 Redistribuyendo porcentajes en: ${unidad.nombre}`);
                    
                    if (unidad.funciones) {
                        const funcionesEspecificas = unidad.funciones.filter(f => f.tipo === 'Específica');
                        const funcionesConPorcentaje = funcionesEspecificas.filter(f => 
                            f.porcentajeDedicacion && 
                            f.porcentajeDedicacion !== '' && 
                            f.porcentajeDedicacion !== null
                        );
                        
                        console.log(`   Total de funciones específicas: ${funcionesEspecificas.length}`);
                        console.log(`   Funciones con porcentaje: ${funcionesConPorcentaje.length}`);
                        
                        // Calcular suma actual
                        let sumaActual = 0;
                        funcionesConPorcentaje.forEach(funcion => {
                            sumaActual += parseFloat(funcion.porcentajeDedicacion);
                        });
                        
                        console.log(`   Suma actual: ${sumaActual}%`);
                        
                        // Redistribuir porcentajes de manera más inteligente
                        // Asignar 5% a la mayoría y ajustar algunas para que sumen 100%
                        const numFunciones = funcionesConPorcentaje.length;
                        const porcentajeBase = Math.floor(100 / numFunciones);
                        const resto = 100 % numFunciones;
                        
                        console.log(`   Porcentaje base: ${porcentajeBase}%`);
                        console.log(`   Resto a distribuir: ${resto}%`);
                        
                        // Aplicar la redistribución
                        funcionesConPorcentaje.forEach((funcion, index) => {
                            let nuevoPorcentaje = porcentajeBase;
                            
                            // Distribuir el resto entre las primeras funciones
                            if (index < resto) {
                                nuevoPorcentaje += 1;
                            }
                            
                            const porcentajeAnterior = funcion.porcentajeDedicacion;
                            funcion.porcentajeDedicacion = nuevoPorcentaje.toString();
                            
                            console.log(`   Función ${funcion.orden}: ${porcentajeAnterior}% → ${nuevoPorcentaje}%`);
                        });
                        
                        // Verificar suma final
                        let sumaFinal = 0;
                        funcionesConPorcentaje.forEach(funcion => {
                            sumaFinal += parseFloat(funcion.porcentajeDedicacion);
                        });
                        
                        console.log(`   Suma final: ${sumaFinal}%`);
                        
                        if (sumaFinal === 100) {
                            console.log(`   ✅ Redistribución exitosa`);
                        } else {
                            console.log(`   ❌ Error en la redistribución`);
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
        data.metadata.version += "-redistribucion-final";
        data.metadata.actualizado = new Date().toISOString();
        data.metadata.notes.push(`Redistribución final de porcentajes en Coordinación Del Negocio Y Datos`);
        
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

// Ejecutar la redistribución
console.log('Iniciando redistribución final de porcentajes...\n');
const resultado = redistribuirPorcentajesFinal();

if (resultado) {
    console.log('\n🎉 Redistribución completada exitosamente.');
} else {
    console.log('\n❌ Error en la redistribución.');
} 