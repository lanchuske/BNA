const fs = require('fs');

function corregirSimple(archivoOriginal) {
    try {
        console.log('🔧 Aplicando corrección simple al ordenamiento de funciones...');
        
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
        
        // 2. Reemplazar solo la línea problemática en saveFunction
        const lineaProblematica = /\/\/\s*Reordenar funciones por orden[\s\S]*?unit\.funciones\.forEach\(\(func, idx\) => \{[\s\S]*?func\.orden = idx \+ 1;[\s\S]*?\}\);[\s\S]*?\/\/\s*Re-renderizar/g;
        const lineaCorregida = `// CORRECCIÓN: Ordenar funciones por tipo y luego por orden
                unit.funciones = ordenarFuncionesPorTipo(unit.funciones);
                
                // Re-renderizar`;
        
        contenido = contenido.replace(lineaProblematica, lineaCorregida);
        
        // Guardar el archivo corregido
        const archivoCorregido = archivoOriginal.replace('.html', '_simple_corregido.html');
        fs.writeFileSync(archivoCorregido, contenido, 'utf8');
        
        console.log(`✅ Archivo corregido guardado como: ${archivoCorregido}`);
        return archivoCorregido;
        
    } catch (error) {
        console.error('❌ Error al aplicar corrección simple:', error.message);
        return null;
    }
}

// Función para verificar que el archivo corregido no tenga errores de sintaxis
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
    
    console.log('🔧 Aplicando corrección simple...');
    console.log(`📁 Archivo original: ${archivoOriginal}`);
    console.log('');
    
    const archivoCorregido = corregirSimple(archivoOriginal);
    
    if (archivoCorregido) {
        console.log('✅ Corrección aplicada exitosamente');
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
        console.log('❌ Error al aplicar corrección');
        process.exit(1);
    }
}

module.exports = {
    corregirSimple,
    verificarSintaxis
}; 