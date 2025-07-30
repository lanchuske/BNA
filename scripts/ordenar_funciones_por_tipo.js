const fs = require('fs');
const path = require('path');

// Función para ordenar funciones por tipo
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

    // Ordenar las funciones por tipo
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

// Función recursiva para procesar el árbol de unidades
function procesarArbol(arbol) {
    if (!arbol) return arbol;

    // Si es un array, procesar cada elemento
    if (Array.isArray(arbol)) {
        return arbol.map(item => procesarArbol(item));
    }

    // Si es un objeto, procesar sus propiedades
    if (typeof arbol === 'object') {
        const resultado = { ...arbol };

        // Ordenar funciones si existen
        if (resultado.funciones) {
            resultado.funciones = ordenarFuncionesPorTipo(resultado.funciones);
        }

        // Procesar recursivamente los children
        if (resultado.children) {
            resultado.children = procesarArbol(resultado.children);
        }

        return resultado;
    }

    return arbol;
}

// Función principal
function ordenarFuncionesEnOrganigrama(archivoEntrada, archivoSalida) {
    try {
        console.log(`Leyendo archivo: ${archivoEntrada}`);
        const contenido = fs.readFileSync(archivoEntrada, 'utf8');
        const organigrama = JSON.parse(contenido);

        console.log('Procesando organigrama...');
        
        // Procesar el árbol de unidades
        if (organigrama.hierarchy && organigrama.hierarchy.tree) {
            organigrama.hierarchy.tree = procesarArbol(organigrama.hierarchy.tree);
        }

        // Actualizar metadata
        if (organigrama.metadata) {
            organigrama.metadata.lastModified = new Date().toISOString();
            organigrama.metadata.notes = (organigrama.metadata.notes || '') + 
                '\n- Funciones reordenadas por tipo: Genéricas, Específicas, Indicadores';
        }

        console.log('Guardando archivo ordenado...');
        fs.writeFileSync(archivoSalida, JSON.stringify(organigrama, null, 2), 'utf8');
        
        console.log(`✅ Archivo procesado exitosamente: ${archivoSalida}`);
        
        // Mostrar estadísticas
        const estadisticas = contarFuncionesPorTipo(organigrama);
        console.log('\n📊 Estadísticas de funciones por tipo:');
        Object.entries(estadisticas).forEach(([tipo, cantidad]) => {
            console.log(`  ${tipo}: ${cantidad}`);
        });

    } catch (error) {
        console.error('❌ Error al procesar el archivo:', error.message);
        process.exit(1);
    }
}

// Función para contar funciones por tipo
function contarFuncionesPorTipo(organigrama) {
    const contadores = { 'Genérica': 0, 'Específica': 0, 'Indicador': 0 };
    
    function contarEnArbol(arbol) {
        if (!arbol) return;
        
        if (Array.isArray(arbol)) {
            arbol.forEach(item => contarEnArbol(item));
            return;
        }
        
        if (typeof arbol === 'object') {
            if (arbol.funciones && Array.isArray(arbol.funciones)) {
                arbol.funciones.forEach(funcion => {
                    if (funcion.tipo && contadores.hasOwnProperty(funcion.tipo)) {
                        contadores[funcion.tipo]++;
                    }
                });
            }
            
            if (arbol.children) {
                contarEnArbol(arbol.children);
            }
        }
    }
    
    if (organigrama.hierarchy && organigrama.hierarchy.tree) {
        contarEnArbol(organigrama.hierarchy.tree);
    }
    
    return contadores;
}

// Ejecutar si se llama directamente
if (require.main === module) {
    const archivoEntrada = process.argv[2] || 'organigrama_bna_2025-07-30-4.json';
    const archivoSalida = process.argv[3] || 'organigrama_bna_2025-07-30-4_ordenado.json';
    
    console.log('🔄 Iniciando ordenamiento de funciones por tipo...');
    console.log(`📁 Archivo de entrada: ${archivoEntrada}`);
    console.log(`📁 Archivo de salida: ${archivoSalida}`);
    console.log('');
    
    ordenarFuncionesEnOrganigrama(archivoEntrada, archivoSalida);
}

module.exports = {
    ordenarFuncionesPorTipo,
    procesarArbol,
    ordenarFuncionesEnOrganigrama
}; 