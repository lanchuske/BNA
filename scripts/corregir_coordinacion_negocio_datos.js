const fs = require('fs');

// Función para corregir específicamente la unidad Coordinación Del Negocio Y Datos
function corregirCoordinacionNegocioDatos() {
    try {
        // Leer el archivo JSON
        const jsonData = fs.readFileSync('organigrama_bna_2025-07-29.json', 'utf8');
        const data = JSON.parse(jsonData);
        
        // Función recursiva para encontrar la unidad específica
        function encontrarYCorregirUnidad(unidades) {
            unidades.forEach(unidad => {
                if (unidad.nombre === 'Coordinación Del Negocio Y Datos') {
                    console.log(`🔧 Corrigiendo unidad: ${unidad.nombre}`);
                    
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
                        
                        // Redistribuir porcentajes para que sumen 100%
                        const porcentajePorFuncion = Math.floor(100 / funcionesConPorcentaje.length);
                        const resto = 100 % funcionesConPorcentaje.length;
                        
                        console.log(`   Porcentaje por función: ${porcentajePorFuncion}%`);
                        console.log(`   Resto a distribuir: ${resto}%`);
                        
                        // Aplicar la redistribución
                        funcionesConPorcentaje.forEach((funcion, index) => {
                            let nuevoPorcentaje = porcentajePorFuncion;
                            
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
                            console.log(`   ✅ Corrección exitosa`);
                        } else {
                            console.log(`   ❌ Error en la corrección`);
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
        data.metadata.version += "-coordinacion-negocio-datos-corregida";
        data.metadata.actualizado = new Date().toISOString();
        data.metadata.notes.push(`Corregida unidad Coordinación Del Negocio Y Datos - porcentajes redistribuidos`);
        
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

// Ejecutar la corrección
console.log('Iniciando corrección específica de Coordinación Del Negocio Y Datos...\n');
const resultado = corregirCoordinacionNegocioDatos();

if (resultado) {
    console.log('\n🎉 Corrección completada exitosamente.');
} else {
    console.log('\n❌ Error en la corrección.');
} 