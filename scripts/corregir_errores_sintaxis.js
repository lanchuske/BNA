const fs = require('fs');

function corregirErroresSintaxis(archivoHTML) {
    try {
        console.log('🔧 Corrigiendo errores de sintaxis...');
        
        let contenido = fs.readFileSync(archivoHTML, 'utf8');
        
        // 1. Corregir el try-catch block roto
        const tryCatchRoto = /if \(ordenamientoGuardado\) \{[\s\S]*?try \{[\s\S]*?const ordenamientoData = JSON\.parse\(ordenamientoGuardado\);[\s\S]*?STATE\.currentData = ordenamientoData\.data;[\s\S]*?console\.log\('Ordenamiento cargado desde localStorage'\);[\s\S]*?return true;[\s\S]*?\}[\s\S]*?\/\/ Botón para validar porcentajes[\s\S]*?function agregarBotonValidacion\(\) \{[\s\S]*?validarYMostrarPorcentajes\(\);[\s\S]*?\} catch \(error\) \{[\s\S]*?console\.error\('Error al cargar ordenamiento desde localStorage:', error\);[\s\S]*?\}[\s\S]*?\}[\s\S]*?return false;[\s\S]*?\}/;
        
        const tryCatchCorregido = `if (ordenamientoGuardado) {
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
        }`;
        
        contenido = contenido.replace(tryCatchRoto, tryCatchCorregido);
        
        // 2. Corregir la función ordenarFuncionesPorTipo que está mal ubicada
        const funcionDesubicada = /\/\/ Definir el orden de prioridad de los tipos[\s\S]*?const ordenTipos = \{[\s\S]*?'Genérica': 1,[\s\S]*?'Específica': 2,[\s\S]*?'Indicador': 3[\s\S]*?\};[\s\S]*?\/\/ Ordenar las funciones por tipo primero, luego por porcentaje de dedicación \(descendente\)[\s\S]*?const funcionesOrdenadas = funciones\.sort\(\(a, b\) => \{[\s\S]*?const ordenA = ordenTipos\[a\.tipo\] \|\| 999;[\s\S]*?const ordenB = ordenTipos\[b\.tipo\] \|\| 999;[\s\S]*?if \(ordenA !== ordenB\) \{[\s\S]*?return ordenA - ordenB;[\s\S]*?\}[\s\S]*?\/\/ Si son del mismo tipo, ordenar por porcentaje de dedicación \(descendente\)[\s\S]*?if \(a\.tipo === 'Específica' && b\.tipo === 'Específica'\) \{[\s\S]*?const porcentajeA = parseInt\(a\.porcentajeDedicacion\) \|\| 0;[\s\S]*?const porcentajeB = parseInt\(b\.porcentajeDedicacion\) \|\| 0;[\s\S]*?return porcentajeB - porcentajeA; \/\/ Descendente: mayor a menor[\s\S]*?\}[\s\S]*?\/\/ Para otros tipos, mantener el orden original[\s\S]*?return \(a\.orden \|\| 0\) - \(b\.orden \|\| 0\);[\s\S]*?\}\);[\s\S]*?\/\/ Renumerar el campo orden dentro de cada tipo[\s\S]*?let contadorGenericas = 1;[\s\S]*?let contadorEspecificas = 1;[\s\S]*?let contadorIndicadores = 1;[\s\S]*?return funcionesOrdenadas\.map\(funcion => \{[\s\S]*?const funcionOrdenada = \{ \.\.\.funcion \};[\s\S]*?switch \(funcion\.tipo\) \{[\s\S]*?case 'Genérica':[\s\S]*?funcionOrdenada\.orden = contadorGenericas\+\+;[\s\S]*?break;[\s\S]*?case 'Específica':[\s\S]*?funcionOrdenada\.orden = contadorEspecificas\+\+;[\s\S]*?break;[\s\S]*?case 'Indicador':[\s\S]*?funcionOrdenada\.orden = contadorIndicadores\+\+;[\s\S]*?break;[\s\S]*?\}[\s\S]*?return funcionOrdenada;[\s\S]*?\}\);[\s\S]*?\}/;
        
        // Eliminar la función desubicada
        contenido = contenido.replace(funcionDesubicada, '');
        
        // Guardar el archivo corregido
        const archivoCorregido = archivoHTML.replace('.html', '_corregido.html');
        fs.writeFileSync(archivoCorregido, contenido, 'utf8');
        
        console.log(`✅ Archivo corregido guardado como: ${archivoCorregido}`);
        return archivoCorregido;
        
    } catch (error) {
        console.error('❌ Error al corregir sintaxis:', error.message);
        return null;
    }
}

// Función para verificar que no hay errores de sintaxis
function verificarSintaxis(archivoHTML) {
    try {
        const contenido = fs.readFileSync(archivoHTML, 'utf8');
        
        console.log('🔍 Verificando sintaxis...');
        
        // Verificar que no hay try sin catch
        const trySinCatch = contenido.match(/try\s*\{/g);
        const catchSinTry = contenido.match(/catch\s*\(/g);
        
        if (trySinCatch && catchSinTry) {
            if (trySinCatch.length === catchSinTry.length) {
                console.log('✅ Try-catch blocks balanceados');
            } else {
                console.log('❌ Try-catch blocks desbalanceados');
                return false;
            }
        }
        
        // Verificar que no hay funciones mal ubicadas
        const funcionDesubicada = contenido.includes('const ordenTipos = {');
        if (funcionDesubicada) {
            console.log('❌ Función desubicada encontrada');
            return false;
        }
        
        console.log('✅ Sintaxis verificada correctamente');
        return true;
        
    } catch (error) {
        console.error('❌ Error al verificar sintaxis:', error.message);
        return false;
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    const archivoHTML = process.argv[2] || 'maim_2_simple_corregido_con_funcionalidades.html';
    
    console.log('🔧 Corrigiendo errores de sintaxis...');
    console.log(`📁 Archivo a corregir: ${archivoHTML}`);
    console.log('');
    
    const archivoCorregido = corregirErroresSintaxis(archivoHTML);
    
    if (archivoCorregido) {
        console.log('✅ Errores de sintaxis corregidos');
        console.log(`📁 Archivo corregido: ${archivoCorregido}`);
        
        console.log('');
        console.log('🔍 Verificando sintaxis corregida...');
        const sintaxisCorrecta = verificarSintaxis(archivoCorregido);
        
        if (sintaxisCorrecta) {
            console.log('✅ Sintaxis verificada correctamente');
        } else {
            console.log('❌ Aún hay errores de sintaxis');
        }
    } else {
        console.log('❌ Error al corregir sintaxis');
        process.exit(1);
    }
}

module.exports = {
    corregirErroresSintaxis,
    verificarSintaxis
}; 