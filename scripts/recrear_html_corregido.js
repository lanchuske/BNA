const fs = require('fs');

function recrearHTMLCorregido(archivoOriginal) {
    try {
        console.log('🔧 Recreando archivo HTML corregido desde el original...');
        
        let contenido = fs.readFileSync(archivoOriginal, 'utf8');
        
        // 1. Agregar la función ordenarFuncionesPorTipo al inicio del script
        const ordenarFuncionesCode = `
        // Función para ordenar funciones por tipo y luego por orden
        function ordenarFuncionesPorTipo(funciones) {
            if (!funciones || !Array.isArray(funciones)) {
                return funciones;
            }

            // Definir el orden de prioridad de los tipos
            const ordenTipos = {
                'Genérica': 1,
                'Específica': 2,
                'Indicador': 3
            };

            // Ordenar las funciones por tipo primero, luego por orden
            const funcionesOrdenadas = funciones.sort((a, b) => {
                const ordenA = ordenTipos[a.tipo] || 999;
                const ordenB = ordenTipos[b.tipo] || 999;
                
                if (ordenA !== ordenB) {
                    return ordenA - ordenB;
                }
                
                // Si son del mismo tipo, mantener el orden original
                return (a.orden || 0) - (b.orden || 0);
            });

            // Renumerar el campo orden dentro de cada tipo
            let contadorGenericas = 1;
            let contadorEspecificas = 1;
            let contadorIndicadores = 1;

            return funcionesOrdenadas.map(funcion => {
                const funcionOrdenada = { ...funcion };
                
                switch (funcion.tipo) {
                    case 'Genérica':
                        funcionOrdenada.orden = contadorGenericas++;
                        break;
                    case 'Específica':
                        funcionOrdenada.orden = contadorEspecificas++;
                        break;
                    case 'Indicador':
                        funcionOrdenada.orden = contadorIndicadores++;
                        break;
                }
                
                return funcionOrdenada;
            });
        }
        `;
        
        // Buscar donde insertar la función (después de las declaraciones de variables)
        const scriptStartPattern = /<script>/;
        contenido = contenido.replace(scriptStartPattern, `<script>${ordenarFuncionesCode}`);
        
        // 2. Reemplazar la función saveFunction completa
        const saveFunctionPattern = /saveFunction:\s*function\(index\)\s*\{[\s\S]*?\}/g;
        const saveFunctionReplacement = `saveFunction: function(index) {
                const unit = STATE.selectedUnit;
                if (!unit) return;
                
                // Recopilar datos del formulario
                const functionData = {
                    tipo: document.getElementById(\`tipo-\${index}\`).value,
                    orden: parseInt(document.getElementById(\`orden-\${index}\`).value),
                    descripcion: document.getElementById(\`descripcion-\${index}\`).value.trim(),
                    productoFinal: document.getElementById(\`productoFinal-\${index}\`).value.trim(),
                    porcentajeDedicacion: document.getElementById(\`porcentajeDedicacion-\${index}\`).value.trim()
                };
                
                // Validaciones
                if (!functionData.descripcion) {
                    Utils.showAlert('La descripción es obligatoria', 'error');
                    return;
                }
                
                // Validar porcentajes según tipo
                if (functionData.tipo === 'Genérica' && functionData.porcentajeDedicacion) {
                    Utils.showAlert('Las funciones genéricas no deben tener porcentaje de dedicación', 'warning');
                    functionData.porcentajeDedicacion = '';
                }
                
                if (functionData.tipo === 'Indicador' && functionData.porcentajeDedicacion) {
                    Utils.showAlert('Los indicadores no deben tener porcentaje de dedicación', 'warning');
                    functionData.porcentajeDedicacion = '';
                }
                
                if (index === 'new') {
                    // Agregar nueva función
                    if (!unit.funciones) unit.funciones = [];
                    unit.funciones.push(functionData);
                    Utils.showAlert('Nueva función agregada', 'success');
                } else {
                    // Actualizar función existente
                    unit.funciones[index] = { ...unit.funciones[index], ...functionData };
                    Utils.showAlert('Función actualizada', 'success');
                }
                
                // CORRECCIÓN: Ordenar funciones por tipo y luego por orden
                unit.funciones = ordenarFuncionesPorTipo(unit.funciones);
                
                // Re-renderizar
                UnitRenderer.render(unit);
            }`;
        
        contenido = contenido.replace(saveFunctionPattern, saveFunctionReplacement);
        
        // 3. Reemplazar la función deleteFunction para usar el nuevo ordenamiento
        const deleteFunctionPattern = /deleteFunction:\s*function\(index\)\s*\{[\s\S]*?\}/g;
        const deleteFunctionReplacement = `deleteFunction: function(index) {
                const unit = STATE.selectedUnit;
                if (!unit || !unit.funciones) return;
                
                const functionToDelete = unit.funciones[index];
                const confirmed = confirm(\`¿Estás seguro de que quieres eliminar la función "\${functionToDelete.descripcion.substring(0, 50)}..."?\`);
                
                if (confirmed) {
                    unit.funciones.splice(index, 1);
                    
                    // CORRECCIÓN: Ordenar funciones por tipo después de eliminar
                    unit.funciones = ordenarFuncionesPorTipo(unit.funciones);
                    
                    UnitRenderer.render(unit);
                    Utils.showAlert('Función eliminada', 'success');
                }
            }`;
        
        contenido = contenido.replace(deleteFunctionPattern, deleteFunctionReplacement);
        
        // 4. Reemplazar la función reorderFunctions para usar el nuevo ordenamiento
        const reorderFunctionPattern = /reorderFunctions:\s*function\(fromIndex,\s*toIndex\)\s*\{[\s\S]*?\}/g;
        const reorderFunctionReplacement = `reorderFunctions: function(fromIndex, toIndex) {
                const unit = STATE.selectedUnit;
                const funciones = [...unit.funciones];
                const movedFunction = funciones.splice(fromIndex, 1)[0];
                funciones.splice(toIndex, 0, movedFunction);
                
                // CORRECCIÓN: Ordenar funciones por tipo después de mover
                unit.funciones = ordenarFuncionesPorTipo(funciones);
                
                UnitRenderer.render(unit);
            }`;
        
        contenido = contenido.replace(reorderFunctionPattern, reorderFunctionReplacement);
        
        // Guardar el archivo corregido
        const archivoCorregido = archivoOriginal.replace('.html', '_recreado.html');
        fs.writeFileSync(archivoCorregido, contenido, 'utf8');
        
        console.log(`✅ Archivo recreado guardado como: ${archivoCorregido}`);
        return archivoCorregido;
        
    } catch (error) {
        console.error('❌ Error al recrear archivo:', error.message);
        return null;
    }
}

// Función para verificar que el archivo recreado no tenga errores de sintaxis
function verificarSintaxis(archivoHTML) {
    try {
        const contenido = fs.readFileSync(archivoHTML, 'utf8');
        
        // Verificar que las funciones estén bien cerradas
        const llavesAbiertas = (contenido.match(/\{/g) || []).length;
        const llavesCerradas = (contenido.match(/\}/g) || []).length;
        
        console.log(`📊 Estadísticas de sintaxis:`);
        console.log(`   - Llaves abiertas: ${llavesAbiertas}`);
        console.log(`   - Llaves cerradas: ${llavesCerradas}`);
        console.log(`   - Diferencia: ${llavesAbiertas - llavesCerradas}`);
        
        if (llavesAbiertas !== llavesCerradas) {
            console.log('❌ Error: Número de llaves no coincide');
            return false;
        }
        
        // Verificar que la función ordenarFuncionesPorTipo esté presente
        if (!contenido.includes('ordenarFuncionesPorTipo')) {
            console.log('❌ Error: Función ordenarFuncionesPorTipo no encontrada');
            return false;
        }
        
        // Verificar que se use en saveFunction
        if (!contenido.includes('unit.funciones = ordenarFuncionesPorTipo(unit.funciones)')) {
            console.log('❌ Error: Función ordenarFuncionesPorTipo no se usa en saveFunction');
            return false;
        }
        
        console.log('✅ Verificación de sintaxis completada');
        return true;
        
    } catch (error) {
        console.error('❌ Error al verificar sintaxis:', error.message);
        return false;
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    const archivoOriginal = process.argv[2] || 'maim_2.html';
    
    console.log('🔧 Recreando archivo HTML corregido...');
    console.log(`📁 Archivo original: ${archivoOriginal}`);
    console.log('');
    
    const archivoCorregido = recrearHTMLCorregido(archivoOriginal);
    
    if (archivoCorregido) {
        console.log('✅ Archivo recreado exitosamente');
        console.log(`📁 Archivo corregido: ${archivoCorregido}`);
        
        console.log('');
        console.log('🔍 Verificando sintaxis del archivo recreado...');
        const sintaxisCorrecta = verificarSintaxis(archivoCorregido);
        
        if (sintaxisCorrecta) {
            console.log('✅ Archivo recreado sin errores de sintaxis');
        } else {
            console.log('❌ Se encontraron errores de sintaxis');
        }
    } else {
        console.log('❌ Error al recrear archivo');
        process.exit(1);
    }
}

module.exports = {
    recrearHTMLCorregido,
    verificarSintaxis
}; 