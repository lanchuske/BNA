const fs = require('fs');

// Función para corregir los porcentajes finales
function corregirPorcentajesFinales() {
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
                            
                            // Si el porcentaje no es múltiplo de 5, corregirlo
                            if (porcentaje % 5 !== 0) {
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
        
        // Actualizar metadata
        if (funcionesCorregidas > 0) {
            data.metadata.version += "-porcentajes-finales-corregidos";
            data.metadata.actualizado = new Date().toISOString();
            data.metadata.notes.push(`Corregidos ${funcionesCorregidas} porcentajes a múltiplos de 5%`);
        }
        
        // Guardar el archivo corregido
        fs.writeFileSync('organigrama_bna_2025-07-29.json', JSON.stringify(data, null, 2), 'utf8');
        
        // Mostrar resultados
        console.log('\n🔧 CORRECCIÓN FINAL DE PORCENTAJES');
        console.log('=' .repeat(80));
        
        console.log(`✅ Funciones específicas corregidas: ${funcionesCorregidas}`);
        
        if (funcionesCorregidas > 0) {
            console.log('\n📝 Archivo actualizado: organigrama_bna_2025-07-29.json');
            console.log('📝 Metadata actualizada con nueva versión y notas');
            return true;
        } else {
            console.log('\n✅ No se encontraron porcentajes que requieran corrección.');
            return false;
        }
        
    } catch (error) {
        console.error('❌ Error al procesar el archivo:', error.message);
        return false;
    }
}

// Ejecutar la corrección
console.log('Iniciando corrección final de porcentajes...\n');
const resultado = corregirPorcentajesFinales();

if (resultado) {
    console.log('\n🎉 Corrección completada exitosamente.');
} else {
    console.log('\n✅ No se requirieron correcciones.');
} 