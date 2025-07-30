const fs = require('fs');

function agregarFuncionalidadesOrdenamiento(archivoHTML) {
    try {
        console.log('🔧 Agregando nuevas funcionalidades de ordenamiento...');
        
        let contenido = fs.readFileSync(archivoHTML, 'utf8');
        
        // 1. Reemplazar la función ordenarFuncionesPorTipo con la nueva versión
        const ordenarFuncionesPattern = /function ordenarFuncionesPorTipo\(funciones\) \{[\s\S]*?\}/;
        const nuevaFuncionOrdenar = `function ordenarFuncionesPorTipo(funciones) {
            if (!funciones || !Array.isArray(funciones)) {
                return funciones;
            }

            // Definir el orden de prioridad de los tipos
            const ordenTipos = {
                'Genérica': 1,
                'Específica': 2,
                'Indicador': 3
            };

            // Ordenar las funciones por tipo primero, luego por porcentaje de dedicación (descendente)
            const funcionesOrdenadas = funciones.sort((a, b) => {
                const ordenA = ordenTipos[a.tipo] || 999;
                const ordenB = ordenTipos[b.tipo] || 999;
                
                if (ordenA !== ordenB) {
                    return ordenA - ordenB;
                }
                
                // Si son del mismo tipo, ordenar por porcentaje de dedicación (descendente)
                if (a.tipo === 'Específica' && b.tipo === 'Específica') {
                    const porcentajeA = parseInt(a.porcentajeDedicacion) || 0;
                    const porcentajeB = parseInt(b.porcentajeDedicacion) || 0;
                    return porcentajeB - porcentajeA; // Descendente: mayor a menor
                }
                
                // Para otros tipos, mantener el orden original
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
        }`;
        
        contenido = contenido.replace(ordenarFuncionesPattern, nuevaFuncionOrdenar);
        
        // 2. Agregar función de validación de porcentajes
        const validacionPorcentajesCode = `
        // Función para validar y ajustar porcentajes de dedicación
        function validarPorcentajesDedicacion(unit) {
            if (!unit || !unit.funciones) return { valido: true, mensaje: 'No hay funciones para validar' };
            
            const funcionesEspecificas = unit.funciones.filter(f => f.tipo === 'Específica');
            const totalPorcentaje = funcionesEspecificas.reduce((sum, f) => sum + (parseInt(f.porcentajeDedicacion) || 0), 0);
            
            // Validar que el total sea 100%
            if (totalPorcentaje !== 100) {
                return { 
                    valido: false, 
                    mensaje: \`El total de porcentajes debe ser 100%. Actual: \${totalPorcentaje}%\` 
                };
            }
            
            // Validar que no haya porcentajes menores al 5%
            const porcentajesInvalidos = funcionesEspecificas.filter(f => {
                const porcentaje = parseInt(f.porcentajeDedicacion) || 0;
                return porcentaje > 0 && porcentaje < 5;
            });
            
            if (porcentajesInvalidos.length > 0) {
                return { 
                    valido: false, 
                    mensaje: 'No puede haber porcentajes menores al 5%' 
                };
            }
            
            // Validar que todos los porcentajes sean múltiplos de 5
            const porcentajesNoMultiplos = funcionesEspecificas.filter(f => {
                const porcentaje = parseInt(f.porcentajeDedicacion) || 0;
                return porcentaje > 0 && porcentaje % 5 !== 0;
            });
            
            if (porcentajesNoMultiplos.length > 0) {
                return { 
                    valido: false, 
                    mensaje: 'Todos los porcentajes deben ser múltiplos de 5 (5, 10, 15, 20, etc.)' 
                };
            }
            
            return { valido: true, mensaje: 'Porcentajes válidos' };
        }
        
        // Función para ajustar automáticamente porcentajes
        function ajustarPorcentajesAutomaticamente(unit) {
            if (!unit || !unit.funciones) return false;
            
            const funcionesEspecificas = unit.funciones.filter(f => f.tipo === 'Específica');
            if (funcionesEspecificas.length === 0) return true;
            
            // Calcular porcentaje base (mínimo 5%)
            const porcentajeBase = Math.max(5, Math.floor(100 / funcionesEspecificas.length));
            
            // Ajustar a múltiplos de 5
            const porcentajeAjustado = Math.floor(porcentajeBase / 5) * 5;
            
            // Distribuir porcentajes
            let porcentajeRestante = 100;
            funcionesEspecificas.forEach((funcion, index) => {
                if (index === funcionesEspecificas.length - 1) {
                    // Última función: asignar el porcentaje restante
                    funcion.porcentajeDedicacion = porcentajeRestante.toString();
                } else {
                    // Otras funciones: asignar porcentaje base
                    const porcentajeAsignar = Math.min(porcentajeAjustado, porcentajeRestante - (funcionesEspecificas.length - index - 1) * 5);
                    funcion.porcentajeDedicacion = porcentajeAsignar.toString();
                    porcentajeRestante -= porcentajeAsignar;
                }
            });
            
            return true;
        }
        
        // Función para guardar ordenamiento en localStorage
        function guardarOrdenamientoEnLocalStorage() {
            if (STATE.currentData) {
                const ordenamientoData = {
                    timestamp: new Date().toISOString(),
                    data: STATE.currentData
                };
                localStorage.setItem('organigrama_ordenamiento', JSON.stringify(ordenamientoData));
                console.log('Ordenamiento guardado en localStorage');
            }
        }
        
        // Función para cargar ordenamiento desde localStorage
        function cargarOrdenamientoDesdeLocalStorage() {
            const ordenamientoGuardado = localStorage.getItem('organigrama_ordenamiento');
            if (ordenamientoGuardado) {
                try {
                    const ordenamientoData = JSON.parse(ordenamientoGuardado);
                    STATE.currentData = ordenamientoData.data;
                    console.log('Ordenamiento cargado desde localStorage');
                    return true;
                } catch (error) {
                    console.error('Error al cargar ordenamiento desde localStorage:', error);
                }
            }
            return false;
        }`;
        
        // Buscar donde insertar las nuevas funciones (después de ordenarFuncionesPorTipo)
        const insertAfterPattern = /function ordenarFuncionesPorTipo\(funciones\) \{[\s\S]*?\}/;
        const match = contenido.match(insertAfterPattern);
        if (match) {
            const insertPosition = contenido.indexOf(match[0]) + match[0].length;
            contenido = contenido.slice(0, insertPosition) + validacionPorcentajesCode + contenido.slice(insertPosition);
        }
        
        // 3. Modificar la función saveFunction para incluir validación y guardado en localStorage
        const saveFunctionPattern = /saveFunction:\s*function\(index\)\s*\{[\s\S]*?unit\.funciones\s*=\s*ordenarFuncionesPorTipo\(unit\.funciones\);[\s\S]*?UnitRenderer\.render\(unit\);[\s\S]*?\}/;
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
                
                // Validar porcentajes de dedicación
                const validacion = validarPorcentajesDedicacion(unit);
                if (!validacion.valido) {
                    Utils.showAlert(\`⚠️ \${validacion.mensaje}\`, 'warning');
                }
                
                // Guardar en localStorage
                guardarOrdenamientoEnLocalStorage();
                
                // Re-renderizar
                UnitRenderer.render(unit);
            }`;
        
        contenido = contenido.replace(saveFunctionPattern, saveFunctionReplacement);
        
        // 4. Agregar botón de validación de porcentajes en la interfaz
        const botonValidacionCode = `
        // Botón para validar porcentajes
        function agregarBotonValidacion() {
            const contentArea = document.querySelector('.content-area');
            if (contentArea && STATE.selectedUnit) {
                // Buscar si ya existe el botón
                let botonExistente = document.getElementById('btn-validar-porcentajes');
                if (!botonExistente) {
                    botonExistente = document.createElement('button');
                    botonExistente.id = 'btn-validar-porcentajes';
                    botonExistente.className = 'btn btn-warning';
                    botonExistente.innerHTML = '🔍 Validar Porcentajes';
                    botonExistente.onclick = validarYMostrarPorcentajes;
                    
                    // Insertar después del título de la unidad
                    const tituloUnidad = contentArea.querySelector('h3');
                    if (tituloUnidad) {
                        tituloUnidad.parentNode.insertBefore(botonExistente, tituloUnidad.nextSibling);
                    }
                }
            }
        }
        
        // Función para validar y mostrar porcentajes
        function validarYMostrarPorcentajes() {
            if (!STATE.selectedUnit) return;
            
            const validacion = validarPorcentajesDedicacion(STATE.selectedUnit);
            
            if (validacion.valido) {
                Utils.showAlert('✅ ' + validacion.mensaje, 'success');
            } else {
                Utils.showAlert('❌ ' + validacion.mensaje, 'error');
                
                // Ofrecer ajuste automático
                if (confirm('¿Desea ajustar automáticamente los porcentajes?')) {
                    if (ajustarPorcentajesAutomaticamente(STATE.selectedUnit)) {
                        guardarOrdenamientoEnLocalStorage();
                        UnitRenderer.render(STATE.selectedUnit);
                        Utils.showAlert('✅ Porcentajes ajustados automáticamente', 'success');
                    }
                }
            }
        }`;
        
        // Insertar el código del botón después de las funciones de validación
        const insertBotonPattern = /function cargarOrdenamientoDesdeLocalStorage\(\) \{[\s\S]*?\}/;
        const matchBoton = contenido.match(insertBotonPattern);
        if (matchBoton) {
            const insertPosition = contenido.indexOf(matchBoton[0]) + matchBoton[0].length;
            contenido = contenido.slice(0, insertPosition) + botonValidacionCode + contenido.slice(insertPosition);
        }
        
        // 5. Modificar la función de renderizado para incluir el botón de validación
        const renderPattern = /render:\s*function\(unit\)\s*\{[\s\S]*?\/\/\s*Agregar botón de edición[\s\S]*?\}/;
        const renderReplacement = `render: function(unit) {
                if (!unit) return;
                
                STATE.selectedUnit = unit;
                
                const contentArea = document.querySelector('.content-area');
                if (!contentArea) return;
                
                // Limpiar área de contenido
                contentArea.innerHTML = '';
                
                // Crear encabezado de la unidad
                const header = document.createElement('div');
                header.className = 'unit-info';
                header.innerHTML = \`
                    <h3>🏢 \${unit.nombre}</h3>
                    <p><strong>Reporta a:</strong> \${unit.reportaA || 'N/A'}</p>
                    <p><strong>Jerarquía:</strong> \${unit.jerarquia || 'N/A'}</p>
                    <p><strong>Nivel de Reporte:</strong> \${unit.nivelReporte || 'N/A'}</p>
                    <p><strong>Misión:</strong> \${unit.mision || 'No especificada'}</p>
                \`;
                
                contentArea.appendChild(header);
                
                // Agregar botón de edición
                const editButton = document.createElement('button');
                editButton.className = 'btn btn-warning';
                editButton.innerHTML = '✏️ Editar Unidad';
                editButton.onclick = () => this.editUnit(unit);
                header.appendChild(editButton);
                
                // Agregar botón de validación de porcentajes
                agregarBotonValidacion();
                
                // Renderizar funciones
                this.renderFunctions(unit);
            }`;
        
        contenido = contenido.replace(renderPattern, renderReplacement);
        
        // Guardar el archivo modificado
        const archivoModificado = archivoHTML.replace('.html', '_con_funcionalidades.html');
        fs.writeFileSync(archivoModificado, contenido, 'utf8');
        
        console.log(`✅ Archivo modificado guardado como: ${archivoModificado}`);
        return archivoModificado;
        
    } catch (error) {
        console.error('❌ Error al agregar funcionalidades:', error.message);
        return null;
    }
}

// Función para verificar que las nuevas funcionalidades se agregaron correctamente
function verificarFuncionalidades(archivoHTML) {
    try {
        const contenido = fs.readFileSync(archivoHTML, 'utf8');
        
        console.log('🔍 Verificando nuevas funcionalidades...');
        
        // Verificar funciones agregadas
        const funcionesVerificadas = {
            'ordenarFuncionesPorTipo mejorada': contenido.includes('porcentajeB - porcentajeA'),
            'validarPorcentajesDedicacion': contenido.includes('validarPorcentajesDedicacion'),
            'ajustarPorcentajesAutomaticamente': contenido.includes('ajustarPorcentajesAutomaticamente'),
            'guardarOrdenamientoEnLocalStorage': contenido.includes('guardarOrdenamientoEnLocalStorage'),
            'cargarOrdenamientoDesdeLocalStorage': contenido.includes('cargarOrdenamientoDesdeLocalStorage'),
            'agregarBotonValidacion': contenido.includes('agregarBotonValidacion'),
            'validarYMostrarPorcentajes': contenido.includes('validarYMostrarPorcentajes')
        };
        
        let todasCorrectas = true;
        Object.entries(funcionesVerificadas).forEach(([funcion, encontrada]) => {
            const estado = encontrada ? '✅' : '❌';
            console.log(`${estado} ${funcion}`);
            if (!encontrada) todasCorrectas = false;
        });
        
        if (todasCorrectas) {
            console.log('✅ Todas las funcionalidades agregadas correctamente');
        } else {
            console.log('❌ Algunas funcionalidades no se agregaron');
        }
        
        return todasCorrectas;
        
    } catch (error) {
        console.error('❌ Error al verificar funcionalidades:', error.message);
        return false;
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    const archivoHTML = process.argv[2] || 'maim_2_simple_corregido.html';
    
    console.log('🔧 Agregando nuevas funcionalidades...');
    console.log(`📁 Archivo a modificar: ${archivoHTML}`);
    console.log('');
    
    const archivoModificado = agregarFuncionalidadesOrdenamiento(archivoHTML);
    
    if (archivoModificado) {
        console.log('✅ Funcionalidades agregadas exitosamente');
        console.log(`📁 Archivo modificado: ${archivoModificado}`);
        
        console.log('');
        console.log('🔍 Verificando funcionalidades agregadas...');
        const verificacionExitosa = verificarFuncionalidades(archivoModificado);
        
        if (verificacionExitosa) {
            console.log('✅ Todas las funcionalidades verificadas correctamente');
        } else {
            console.log('❌ Algunas funcionalidades no se verificaron correctamente');
        }
    } else {
        console.log('❌ Error al agregar funcionalidades');
        process.exit(1);
    }
}

module.exports = {
    agregarFuncionalidadesOrdenamiento,
    verificarFuncionalidades
}; 