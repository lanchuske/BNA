const fs = require('fs');

// Función para corregir indicadores que tienen porcentaje de dedicación
function corregirIndicadoresConPorcentaje() {
    try {
        // Leer el archivo JSON
        const jsonData = fs.readFileSync('organigrama_bna_2025-07-29.json', 'utf8');
        const data = JSON.parse(jsonData);
        
        let indicadoresCorregidos = 0;
        let indicadoresConProductoFinal = 0;
        
        // Función recursiva para recorrer todas las unidades
        function recorrerUnidades(unidades) {
            unidades.forEach(unidad => {
                if (unidad.funciones) {
                    unidad.funciones.forEach(funcion => {
                        if (funcion.tipo === 'Indicador') {
                            let corregido = false;
                            
                            // Verificar si tiene porcentaje de dedicación
                            if (funcion.porcentajeDedicacion && 
                                funcion.porcentajeDedicacion !== '' && 
                                funcion.porcentajeDedicacion !== null) {
                                
                                // Eliminar el porcentaje de dedicación
                                delete funcion.porcentajeDedicacion;
                                indicadoresCorregidos++;
                                corregido = true;
                            }
                            
                            // Verificar si tiene producto final
                            if (funcion.productoFinal && 
                                funcion.productoFinal !== '' && 
                                funcion.productoFinal !== null) {
                                
                                // Eliminar el producto final
                                delete funcion.productoFinal;
                                indicadoresConProductoFinal++;
                                corregido = true;
                            }
                            
                            if (corregido) {
                                console.log(`✅ Corregido indicador en "${unidad.nombre}": ${funcion.descripcion.substring(0, 50)}...`);
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
        if (indicadoresCorregidos > 0 || indicadoresConProductoFinal > 0) {
            data.metadata.version += "-indicadores-corregidos";
            data.metadata.actualizado = new Date().toISOString();
            data.metadata.notes.push(`Corregidos ${indicadoresCorregidos} indicadores con porcentaje de dedicación`);
            data.metadata.notes.push(`Corregidos ${indicadoresConProductoFinal} indicadores con producto final`);
        }
        
        // Guardar el archivo corregido
        fs.writeFileSync('organigrama_bna_2025-07-29.json', JSON.stringify(data, null, 2), 'utf8');
        
        // Mostrar resultados
        console.log('\n🔧 CORRECCIÓN DE INDICADORES CON PORCENTAJE DE DEDICACIÓN');
        console.log('=' .repeat(80));
        
        console.log(`✅ Indicadores corregidos (porcentaje eliminado): ${indicadoresCorregidos}`);
        console.log(`✅ Indicadores corregidos (producto final eliminado): ${indicadoresConProductoFinal}`);
        
        if (indicadoresCorregidos > 0 || indicadoresConProductoFinal > 0) {
            console.log('\n📝 Archivo actualizado: organigrama_bna_2025-07-29.json');
            console.log('📝 Metadata actualizada con nueva versión y notas');
            return true;
        } else {
            console.log('\n✅ No se encontraron indicadores que requieran corrección.');
            return false;
        }
        
    } catch (error) {
        console.error('❌ Error al procesar el archivo:', error.message);
        return false;
    }
}

// Ejecutar la corrección
console.log('Iniciando corrección de indicadores...\n');
const resultado = corregirIndicadoresConPorcentaje();

if (resultado) {
    console.log('\n🎉 Corrección completada exitosamente.');
} else {
    console.log('\n✅ No se requirieron correcciones.');
} 