const fs = require('fs');
const path = require('path');

// Función para leer el JSON original
function leerJSONOriginal() {
    try {
        const contenido = fs.readFileSync('ia copy.json', 'utf8');
        return JSON.parse(contenido);
    } catch (error) {
        console.error('Error leyendo el archivo JSON:', error);
        return null;
    }
}

// Función para construir la jerarquía completa
function construirJerarquiaCompleta(jsonData) {
    const { hierarchy, data } = jsonData;
    
    // Crear un mapa de unidades para acceso rápido
    const unidadesMap = new Map();
    data.unidades.forEach(unidad => {
        unidadesMap.set(unidad.nombre, unidad);
    });
    
    // Función recursiva para agregar hijos a un nodo
    function agregarHijos(nodo) {
        const unidad = unidadesMap.get(nodo.nombre);
        if (unidad) {
            // Agregar funciones al nodo
            nodo.funciones = unidad.funciones || [];
        }
        
        // Buscar hijos que reportan a este nodo
        const hijos = data.unidades.filter(u => u.reportaA === nodo.nombre);
        
        if (hijos.length > 0) {
            nodo.children = hijos.map(hijo => ({
                key: `${hijo.nombre}|${nodo.nombre}`,
                nombre: hijo.nombre,
                reportaA: hijo.reportaA,
                mision: hijo.mision || '',
                funciones: hijo.funciones || []
            }));
            
            // Recursivamente agregar hijos a los hijos
            nodo.children.forEach(hijo => {
                agregarHijos(hijo);
            });
        }
    }
    
    // Procesar cada nodo raíz de la jerarquía
    hierarchy.tree.forEach(nodoRaiz => {
        agregarHijos(nodoRaiz);
    });
    
    return hierarchy.tree;
}

// Función para actualizar el JSON
function actualizarJSON() {
    console.log('🔄 Iniciando actualización del JSON...');
    
    // Leer el JSON original
    const jsonOriginal = leerJSONOriginal();
    if (!jsonOriginal) {
        console.error('❌ No se pudo leer el JSON original');
        return;
    }
    
    console.log('📊 JSON original cargado:', {
        unidades: jsonOriginal.data?.unidades?.length || 0,
        jerarquia: jsonOriginal.hierarchy?.tree?.length || 0
    });
    
    // Construir la jerarquía completa
    const jerarquiaCompleta = construirJerarquiaCompleta(jsonOriginal);
    
    // Crear el nuevo JSON con la estructura completa
    const jsonActualizado = {
        metadata: {
            ...jsonOriginal.metadata,
            actualizado: new Date().toISOString(),
            version: "2.1-complete-hierarchy"
        },
        hierarchy: {
            tree: jerarquiaCompleta
        },
        data: {
            unidades: jsonOriginal.data.unidades
        }
    };
    
    // Guardar el JSON actualizado
    const nombreArchivo = 'ia_complete_hierarchy.json';
    fs.writeFileSync(nombreArchivo, JSON.stringify(jsonActualizado, null, 2));
    
    console.log('✅ JSON actualizado guardado como:', nombreArchivo);
    
    // Mostrar estadísticas
    const totalUnidades = jsonActualizado.data.unidades.length;
    const totalFunciones = jsonActualizado.data.unidades.reduce((sum, u) => sum + (u.funciones?.length || 0), 0);
    
    console.log('📊 Estadísticas del JSON actualizado:');
    console.log(`   - Total unidades: ${totalUnidades}`);
    console.log(`   - Total funciones: ${totalFunciones}`);
    console.log(`   - Nodos raíz: ${jerarquiaCompleta.length}`);
    
    // Mostrar la estructura jerárquica
    console.log('🌳 Estructura jerárquica:');
    function mostrarJerarquia(nodos, nivel = 0) {
        nodos.forEach(nodo => {
            const indent = '  '.repeat(nivel);
            const funciones = nodo.funciones?.length || 0;
            const hijos = nodo.children?.length || 0;
            console.log(`${indent}${nodo.nombre} (${funciones} func., ${hijos} hijos)`);
            
            if (nodo.children && nodo.children.length > 0) {
                mostrarJerarquia(nodo.children, nivel + 1);
            }
        });
    }
    
    mostrarJerarquia(jerarquiaCompleta);
}

// Ejecutar la actualización
if (require.main === module) {
    actualizarJSON();
}

module.exports = { actualizarJSON, construirJerarquiaCompleta };