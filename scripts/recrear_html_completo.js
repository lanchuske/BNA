const fs = require('fs');

function recrearHTMLCompleto(archivoOriginal) {
    try {
        console.log('🔧 Recreando HTML completo con funcionalidades...');
        
        let contenido = fs.readFileSync(archivoOriginal, 'utf8');
        
        // 1. Reemplazar completamente la función ordenarFuncionesPorTipo
        const funcionOrdenarPattern = /function ordenarFuncionesPorTipo\(funciones\) \{[\s\S]*?function validarPorcentajesDedicacion\(unit\) \{[\s\S]*?\}/;
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
        }
        
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
        }
        
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
        
        contenido = contenido.replace(funcionOrdenarPattern, nuevaFuncionOrdenar);
        
        // 2. Eliminar cualquier código duplicado que pueda haber quedado
        const codigoDuplicado = /\/\/ Definir el orden de prioridad de los tipos[\s\S]*?const ordenTipos = \{[\s\S]*?'Genérica': 1,[\s\S]*?'Específica': 2,[\s\S]*?'Indicador': 3[\s\S]*?\};[\s\S]*?\/\/ Ordenar las funciones por tipo primero, luego por orden[\s\S]*?const funcionesOrdenadas = funciones\.sort\(\(a, b\) => \{[\s\S]*?const ordenA = ordenTipos\[a\.tipo\] \|\| 999;[\s\S]*?const ordenB = ordenTipos\[b\.tipo\] \|\| 999;[\s\S]*?if \(ordenA !== ordenB\) \{[\s\S]*?return ordenA - ordenB;[\s\S]*?\}[\s\S]*?\/\/ Si son del mismo tipo, mantener el orden original[\s\S]*?return \(a\.orden \|\| 0\) - \(b\.orden \|\| 0\);[\s\S]*?\}\);[\s\S]*?\/\/ Renumerar el campo orden dentro de cada tipo[\s\S]*?let contadorGenericas = 1;[\s\S]*?let contadorEspecificas = 1;[\s\S]*?let contadorIndicadores = 1;[\s\S]*?return funcionesOrdenadas\.map\(funcion => \{[\s\S]*?const funcionOrdenada = \{ \.\.\.funcion \};[\s\S]*?switch \(funcion\.tipo\) \{[\s\S]*?case 'Genérica':[\s\S]*?funcionOrdenada\.orden = contadorGenericas\+\+;[\s\S]*?break;[\s\S]*?case 'Específica':[\s\S]*?funcionOrdenada\.orden = contadorEspecificas\+\+;[\s\S]*?break;[\s\S]*?case 'Indicador':[\s\S]*?funcionOrdenada\.orden = contadorIndicadores\+\+;[\s\S]*?break;[\s\S]*?\}[\s\S]*?return funcionOrdenada;[\s\S]*?\}\);[\s\S]*?\}/;
        
        contenido = contenido.replace(codigoDuplicado, '');
        
        // Guardar el archivo recreado
        const archivoRecreado = archivoOriginal.replace('.html', '_recreado.html');
        fs.writeFileSync(archivoRecreado, contenido, 'utf8');
        
        console.log(`✅ Archivo recreado guardado como: ${archivoRecreado}`);
        return archivoRecreado;
        
    } catch (error) {
        console.error('❌ Error al recrear HTML:', error.message);
        return null;
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    const archivoOriginal = process.argv[2] || 'maim_2_simple_corregido.html';
    
    console.log('🔧 Recreando HTML completo...');
    console.log(`📁 Archivo original: ${archivoOriginal}`);
    console.log('');
    
    const archivoRecreado = recrearHTMLCompleto(archivoOriginal);
    
    if (archivoRecreado) {
        console.log('✅ HTML recreado exitosamente');
        console.log(`📁 Archivo final: ${archivoRecreado}`);
    } else {
        console.log('❌ Error al recrear HTML');
        process.exit(1);
    }
}

module.exports = { recrearHTMLCompleto }; 