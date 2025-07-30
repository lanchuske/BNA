const fs = require('fs');

function corregirSintaxisFinal(archivoHTML) {
    try {
        console.log('🔧 Corrigiendo sintaxis final...');
        
        let contenido = fs.readFileSync(archivoHTML, 'utf8');
        
        // Buscar y eliminar el código duplicado/mal ubicado
        const codigoMalUbicado = /\/\/ Definir el orden de prioridad de los tipos[\s\S]*?const ordenTipos = \{[\s\S]*?'Genérica': 1,[\s\S]*?'Específica': 2,[\s\S]*?'Indicador': 3[\s\S]*?\};[\s\S]*?\/\/ Ordenar las funciones por tipo primero, luego por porcentaje de dedicación \(descendente\)[\s\S]*?const funcionesOrdenadas = funciones\.sort\(\(a, b\) => \{[\s\S]*?const ordenA = ordenTipos\[a\.tipo\] \|\| 999;[\s\S]*?const ordenB = ordenTipos\[b\.tipo\] \|\| 999;[\s\S]*?if \(ordenA !== ordenB\) \{[\s\S]*?return ordenA - ordenB;[\s\S]*?\}[\s\S]*?\/\/ Si son del mismo tipo, ordenar por porcentaje de dedicación \(descendente\)[\s\S]*?if \(a\.tipo === 'Específica' && b\.tipo === 'Específica'\) \{[\s\S]*?const porcentajeA = parseInt\(a\.porcentajeDedicacion\) \|\| 0;[\s\S]*?const porcentajeB = parseInt\(b\.porcentajeDedicacion\) \|\| 0;[\s\S]*?return porcentajeB - porcentajeA; \/\/ Descendente: mayor a menor[\s\S]*?\}[\s\S]*?\/\/ Para otros tipos, mantener el orden original[\s\S]*?return \(a\.orden \|\| 0\) - \(b\.orden \|\| 0\);[\s\S]*?\}\);[\s\S]*?\/\/ Renumerar el campo orden dentro de cada tipo[\s\S]*?let contadorGenericas = 1;[\s\S]*?let contadorEspecificas = 1;[\s\S]*?let contadorIndicadores = 1;[\s\S]*?return funcionesOrdenadas\.map\(funcion => \{[\s\S]*?const funcionOrdenada = \{ \.\.\.funcion \};[\s\S]*?switch \(funcion\.tipo\) \{[\s\S]*?case 'Genérica':[\s\S]*?funcionOrdenada\.orden = contadorGenericas\+\+;[\s\S]*?break;[\s\S]*?case 'Específica':[\s\S]*?funcionOrdenada\.orden = contadorEspecificas\+\+;[\s\S]*?break;[\s\S]*?case 'Indicador':[\s\S]*?funcionOrdenada\.orden = contadorIndicadores\+\+;[\s\S]*?break;[\s\S]*?\}[\s\S]*?return funcionOrdenada;[\s\S]*?\}\);[\s\S]*?\}/;
        
        contenido = contenido.replace(codigoMalUbicado, '');
        
        // Guardar el archivo corregido
        const archivoCorregido = archivoHTML.replace('.html', '_final.html');
        fs.writeFileSync(archivoCorregido, contenido, 'utf8');
        
        console.log(`✅ Archivo corregido guardado como: ${archivoCorregido}`);
        return archivoCorregido;
        
    } catch (error) {
        console.error('❌ Error al corregir sintaxis:', error.message);
        return null;
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    const archivoHTML = process.argv[2] || 'maim_2_simple_corregido_con_funcionalidades_corregido.html';
    
    console.log('🔧 Corrigiendo sintaxis final...');
    console.log(`📁 Archivo a corregir: ${archivoHTML}`);
    console.log('');
    
    const archivoCorregido = corregirSintaxisFinal(archivoHTML);
    
    if (archivoCorregido) {
        console.log('✅ Sintaxis corregida exitosamente');
        console.log(`📁 Archivo final: ${archivoCorregido}`);
    } else {
        console.log('❌ Error al corregir sintaxis');
        process.exit(1);
    }
}

module.exports = { corregirSintaxisFinal }; 