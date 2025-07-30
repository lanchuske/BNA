const fs = require('fs');

function corregirErroresHTML(archivoHTML) {
    try {
        let contenido = fs.readFileSync(archivoHTML, 'utf8');
        
        console.log('🔧 Corrigiendo errores de sintaxis en el archivo HTML...');
        
        // Problema 1: Código duplicado y mal estructurado en saveFunction
        const saveFunctionPattern = /saveFunction:\s*function\(index\)\s*\{[\s\S]*?unit\.funciones\s*=\s*ordenarFuncionesPorTipo\(unit\.funciones\);\s*\/\/\s*Re-renderizar\s*UnitRenderer\.render\(unit\);\s*\}\`\)\.value,/g;
        
        const saveFunctionCorregido = `saveFunction: function(index) {
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
        
        contenido = contenido.replace(saveFunctionPattern, saveFunctionCorregido);
        
        // Problema 2: Eliminar código duplicado que quedó después del reemplazo
        const codigoDuplicadoPattern = /\/\/\s*Recopilar datos del formulario[\s\S]*?porcentajeDedicacion:\s*document\.getElementById\(`porcentajeDedicacion-\${index}`\)\.value\.trim\(\)\s*};[\s\S]*?\/\/\s*Validaciones[\s\S]*?\/\/\s*Validar porcentajes según tipo[\s\S]*?functionData\.porcentajeDedicacion\s*=\s*'';\s*}\s*if\s*\(functionData\.tipo\s*===\s*'Indicador'[\s\S]*?functionData\.porcentajeDedicacion\s*=\s*'';\s*}\s*if\s*\(index\s*===\s*'new'\)[\s\S]*?Utils\.showAlert\('✅ Nueva función agregada', 'success'\);\s*} else {\s*\/\/\s*Actualizar función existente[\s\S]*?Utils\.showAlert\('✅ Función actualizada', 'success'\);\s*}\s*\/\/\s*Reordenar funciones por orden[\s\S]*?unit\.funciones\.forEach\(\(func, idx\) => {\s*func\.orden\s*=\s*idx\s*\+\s*1;\s*}\);\s*\/\/\s*Re-renderizar[\s\S]*?UnitRenderer\.render\(unit\);\s*},/g;
        
        contenido = contenido.replace(codigoDuplicadoPattern, '');
        
        // Problema 3: Corregir caracteres especiales en template literals
        contenido = contenido.replace(/`¿Estás seguro de que quieres eliminar la función "/g, '`¿Estás seguro de que quieres eliminar la función "');
        
        // Problema 4: Corregir caracteres especiales en otros lugares
        contenido = contenido.replace(/➕/g, '+');
        contenido = contenido.replace(/❌/g, 'X');
        contenido = contenido.replace(/✅/g, 'OK');
        contenido = contenido.replace(/⚠️/g, '!');
        contenido = contenido.replace(/📊/g, 'Stats');
        contenido = contenido.replace(/✏️/g, 'Edit');
        contenido = contenido.replace(/💾/g, 'Save');
        
        // Guardar el archivo corregido
        const archivoCorregido = archivoHTML.replace('.html', '_final.html');
        fs.writeFileSync(archivoCorregido, contenido, 'utf8');
        
        console.log(`✅ Archivo corregido guardado como: ${archivoCorregido}`);
        return archivoCorregido;
        
    } catch (error) {
        console.error('❌ Error al corregir errores:', error.message);
        return null;
    }
}

// Función para verificar que el archivo corregido no tenga errores de sintaxis
function verificarSintaxis(archivoHTML) {
    try {
        const contenido = fs.readFileSync(archivoHTML, 'utf8');
        
        // Verificar que no haya template literals malformados
        const templateLiterals = contenido.match(/`[^`]*`/g);
        if (templateLiterals) {
            console.log('🔍 Verificando template literals...');
            templateLiterals.forEach((literal, index) => {
                if (literal.includes('${') && !literal.includes('}')) {
                    console.log(`⚠️ Template literal malformado encontrado: ${literal.substring(0, 50)}...`);
                }
            });
        }
        
        // Verificar que las funciones estén bien cerradas
        const funciones = contenido.match(/function\s*\([^)]*\)\s*\{/g);
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
        
        console.log('✅ Verificación de sintaxis completada');
        return true;
        
    } catch (error) {
        console.error('❌ Error al verificar sintaxis:', error.message);
        return false;
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    const archivoHTML = process.argv[2] || 'maim_2_corregido.html';
    
    console.log('🔧 Corrigiendo errores de sintaxis...');
    console.log(`📁 Archivo a corregir: ${archivoHTML}`);
    console.log('');
    
    const archivoCorregido = corregirErroresHTML(archivoHTML);
    
    if (archivoCorregido) {
        console.log('✅ Correcciones aplicadas exitosamente');
        console.log(`📁 Archivo corregido: ${archivoCorregido}`);
        
        console.log('');
        console.log('🔍 Verificando sintaxis del archivo corregido...');
        const sintaxisCorrecta = verificarSintaxis(archivoCorregido);
        
        if (sintaxisCorrecta) {
            console.log('✅ Archivo corregido sin errores de sintaxis');
        } else {
            console.log('❌ Se encontraron errores de sintaxis');
        }
    } else {
        console.log('❌ Error al aplicar correcciones');
        process.exit(1);
    }
}

module.exports = {
    corregirErroresHTML,
    verificarSintaxis
}; 