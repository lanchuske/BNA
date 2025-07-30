// Script para corregir el problema de pérdida de ordenamiento por tipo en la aplicación web
// El problema está en que la función saveFunction solo ordena por número de orden, no por tipo

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

// Función para aplicar el ordenamiento correcto en la aplicación web
function aplicarOrdenamientoCorrecto() {
    // Buscar la función saveFunction en el código
    const saveFunctionCode = `
            saveFunction: function(index) {
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
                    Utils.showAlert('❌ La descripción es obligatoria', 'error');
                    return;
                }
                
                // Validar porcentajes según tipo
                if (functionData.tipo === 'Genérica' && functionData.porcentajeDedicacion) {
                    Utils.showAlert('⚠️ Las funciones genéricas no deben tener porcentaje de dedicación', 'warning');
                    functionData.porcentajeDedicacion = '';
                }
                
                if (functionData.tipo === 'Indicador' && functionData.porcentajeDedicacion) {
                    Utils.showAlert('⚠️ Los indicadores no deben tener porcentaje de dedicación', 'warning');
                    functionData.porcentajeDedicacion = '';
                }
                
                if (index === 'new') {
                    // Agregar nueva función
                    if (!unit.funciones) unit.funciones = [];
                    unit.funciones.push(functionData);
                    Utils.showAlert('✅ Nueva función agregada', 'success');
                } else {
                    // Actualizar función existente
                    unit.funciones[index] = { ...unit.funciones[index], ...functionData };
                    Utils.showAlert('✅ Función actualizada', 'success');
                }
                
                // CORRECCIÓN: Ordenar funciones por tipo y luego por orden
                unit.funciones = ordenarFuncionesPorTipo(unit.funciones);
                
                // Re-renderizar
                UnitRenderer.render(unit);
            },
    `;

    return saveFunctionCode;
}

// Función para generar el código corregido completo
function generarCodigoCorregido() {
    return `
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

// Función corregida para guardar funciones
function saveFunctionCorregida(index) {
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
        Utils.showAlert('❌ La descripción es obligatoria', 'error');
        return;
    }
    
    // Validar porcentajes según tipo
    if (functionData.tipo === 'Genérica' && functionData.porcentajeDedicacion) {
        Utils.showAlert('⚠️ Las funciones genéricas no deben tener porcentaje de dedicación', 'warning');
        functionData.porcentajeDedicacion = '';
    }
    
    if (functionData.tipo === 'Indicador' && functionData.porcentajeDedicacion) {
        Utils.showAlert('⚠️ Los indicadores no deben tener porcentaje de dedicación', 'warning');
        functionData.porcentajeDedicacion = '';
    }
    
    if (index === 'new') {
        // Agregar nueva función
        if (!unit.funciones) unit.funciones = [];
        unit.funciones.push(functionData);
        Utils.showAlert('✅ Nueva función agregada', 'success');
    } else {
        // Actualizar función existente
        unit.funciones[index] = { ...unit.funciones[index], ...functionData };
        Utils.showAlert('✅ Función actualizada', 'success');
    }
    
    // CORRECCIÓN: Ordenar funciones por tipo y luego por orden
    unit.funciones = ordenarFuncionesPorTipo(unit.funciones);
    
    // Re-renderizar
    UnitRenderer.render(unit);
}

// Función corregida para eliminar funciones
function deleteFunctionCorregida(index) {
    const unit = STATE.selectedUnit;
    if (!unit || !unit.funciones) return;
    
    const functionToDelete = unit.funciones[index];
    const confirmed = confirm(\`¿Estás seguro de que quieres eliminar la función "\${functionToDelete.descripcion.substring(0, 50)}..."?\`);
    
    if (confirmed) {
        unit.funciones.splice(index, 1);
        
        // CORRECCIÓN: Ordenar funciones por tipo después de eliminar
        unit.funciones = ordenarFuncionesPorTipo(unit.funciones);
        
        UnitRenderer.render(unit);
        Utils.showAlert('✅ Función eliminada', 'success');
    }
}

// Función corregida para reordenar funciones
function reorderFunctionsCorregida(fromIndex, toIndex) {
    const unit = STATE.selectedUnit;
    const funciones = [...unit.funciones];
    const movedFunction = funciones.splice(fromIndex, 1)[0];
    funciones.splice(toIndex, 0, movedFunction);
    
    // CORRECCIÓN: Ordenar funciones por tipo después de mover
    unit.funciones = ordenarFuncionesPorTipo(funciones);
    
    UnitRenderer.render(unit);
}
`;
}

// Función para aplicar las correcciones al archivo HTML
function aplicarCorreccionesAlHTML(archivoHTML) {
    const fs = require('fs');
    
    try {
        let contenido = fs.readFileSync(archivoHTML, 'utf8');
        
        // Buscar y reemplazar la función saveFunction
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
                    Utils.showAlert('❌ La descripción es obligatoria', 'error');
                    return;
                }
                
                // Validar porcentajes según tipo
                if (functionData.tipo === 'Genérica' && functionData.porcentajeDedicacion) {
                    Utils.showAlert('⚠️ Las funciones genéricas no deben tener porcentaje de dedicación', 'warning');
                    functionData.porcentajeDedicacion = '';
                }
                
                if (functionData.tipo === 'Indicador' && functionData.porcentajeDedicacion) {
                    Utils.showAlert('⚠️ Los indicadores no deben tener porcentaje de dedicación', 'warning');
                    functionData.porcentajeDedicacion = '';
                }
                
                if (index === 'new') {
                    // Agregar nueva función
                    if (!unit.funciones) unit.funciones = [];
                    unit.funciones.push(functionData);
                    Utils.showAlert('✅ Nueva función agregada', 'success');
                } else {
                    // Actualizar función existente
                    unit.funciones[index] = { ...unit.funciones[index], ...functionData };
                    Utils.showAlert('✅ Función actualizada', 'success');
                }
                
                // CORRECCIÓN: Ordenar funciones por tipo y luego por orden
                unit.funciones = ordenarFuncionesPorTipo(unit.funciones);
                
                // Re-renderizar
                UnitRenderer.render(unit);
            }`;
        
        contenido = contenido.replace(saveFunctionPattern, saveFunctionReplacement);
        
        // Agregar la función ordenarFuncionesPorTipo al inicio del script
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
        
        // Guardar el archivo corregido
        const archivoCorregido = archivoHTML.replace('.html', '_corregido.html');
        fs.writeFileSync(archivoCorregido, contenido, 'utf8');
        
        console.log(`✅ Archivo corregido guardado como: ${archivoCorregido}`);
        return archivoCorregido;
        
    } catch (error) {
        console.error('❌ Error al aplicar correcciones:', error.message);
        return null;
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    const archivoHTML = process.argv[2] || 'maim_2.html';
    
    console.log('🔧 Aplicando correcciones al ordenamiento de funciones...');
    console.log(`📁 Archivo a corregir: ${archivoHTML}`);
    console.log('');
    
    const archivoCorregido = aplicarCorreccionesAlHTML(archivoHTML);
    
    if (archivoCorregido) {
        console.log('✅ Correcciones aplicadas exitosamente');
        console.log(`📁 Archivo corregido: ${archivoCorregido}`);
    } else {
        console.log('❌ Error al aplicar correcciones');
        process.exit(1);
    }
}

module.exports = {
    ordenarFuncionesPorTipo,
    aplicarOrdenamientoCorrecto,
    generarCodigoCorregido,
    aplicarCorreccionesAlHTML
}; 