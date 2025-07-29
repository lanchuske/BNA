const fs = require('fs');

// Función para leer el JSON
function leerJSON() {
    try {
        const contenido = fs.readFileSync('ia_complete_hierarchy.json', 'utf8');
        return JSON.parse(contenido);
    } catch (error) {
        console.error('Error leyendo el archivo JSON:', error);
        return null;
    }
}

// Función para crear diagrama visual del organigrama vertical
function crearDiagramaOrganigramaVertical(nodos, nivel = 0) {
    let diagrama = '';
    const indent = '  '.repeat(nivel);
    
    nodos.forEach(nodo => {
        const funciones = nodo.funciones ? nodo.funciones.length : 0;
        const hijos = nodo.children ? nodo.children.length : 0;
        const nombreCorto = nodo.nombre.length > 15 ? nodo.nombre.substring(0, 15) + '...' : nodo.nombre;
        
        // Crear caja visual
        const caja = `┌${'─'.repeat(nombreCorto.length + 2)}┐\n` +
                    `│ ${nombreCorto} │\n` +
                    `└${'─'.repeat(nombreCorto.length + 2)}┘`;
        
        diagrama += `${indent}${caja}\n`;
        
        // Agregar línea conectora si tiene hijos
        if (hijos > 0) {
            diagrama += `${indent}${' '.repeat(Math.floor(nombreCorto.length/2) + 1)}│\n`;
            diagrama += `${indent}${' '.repeat(Math.floor(nombreCorto.length/2) + 1)}└─\n`;
        }
        
        // Renderizar hijos
        if (nodo.children && nodo.children.length > 0) {
            diagrama += crearDiagramaOrganigramaVertical(nodo.children, nivel + 1);
        }
    });
    
    return diagrama;
}

// Función para crear diagrama horizontal (como debería verse)
function crearDiagramaOrganigramaHorizontal(nodos) {
    let diagrama = '';
    
    diagrama += '\n🎯 **CÓMO DEBERÍA VERSE EL ORGANIGRAMA VERTICAL:**\n';
    diagrama += '==================================================\n\n';
    
    // Nivel 1: SGP Clientes
    diagrama += 'NIVEL 1 (RAÍZ):\n';
    diagrama += '┌─────────────────┐\n';
    diagrama += '│   SGP Clientes  │\n';
    diagrama += '└─────────────────┘\n\n';
    
    // Nivel 2: Hijos directos de SGP Clientes
    diagrama += 'NIVEL 2 (Hijos de SGP Clientes):\n';
    const hijosNivel2 = nodos[0].children || [];
    hijosNivel2.forEach((hijo, index) => {
        const nombreCorto = hijo.nombre.length > 15 ? hijo.nombre.substring(0, 15) + '...' : hijo.nombre;
        diagrama += `┌${'─'.repeat(nombreCorto.length + 2)}┐ `;
        if (index < hijosNivel2.length - 1) diagrama += '  ';
    });
    diagrama += '\n';
    
    hijosNivel2.forEach((hijo, index) => {
        const nombreCorto = hijo.nombre.length > 15 ? hijo.nombre.substring(0, 15) + '...' : hijo.nombre;
        diagrama += `│ ${nombreCorto} │ `;
        if (index < hijosNivel2.length - 1) diagrama += '  ';
    });
    diagrama += '\n';
    
    hijosNivel2.forEach((hijo, index) => {
        const nombreCorto = hijo.nombre.length > 15 ? hijo.nombre.substring(0, 15) + '...' : hijo.nombre;
        diagrama += `└${'─'.repeat(nombreCorto.length + 2)}┘ `;
        if (index < hijosNivel2.length - 1) diagrama += '  ';
    });
    diagrama += '\n\n';
    
    // Nivel 3: Hijos de Segmento Personas (ejemplo)
    const segmentoPersonas = hijosNivel2.find(h => h.nombre === 'Segmento Personas');
    if (segmentoPersonas && segmentoPersonas.children) {
        diagrama += 'NIVEL 3 (Hijos de Segmento Personas):\n';
        segmentoPersonas.children.forEach((hijo, index) => {
            const nombreCorto = hijo.nombre.length > 15 ? hijo.nombre.substring(0, 15) + '...' : hijo.nombre;
            diagrama += `┌${'─'.repeat(nombreCorto.length + 2)}┐ `;
            if (index < segmentoPersonas.children.length - 1) diagrama += '  ';
        });
        diagrama += '\n';
        
        segmentoPersonas.children.forEach((hijo, index) => {
            const nombreCorto = hijo.nombre.length > 15 ? hijo.nombre.substring(0, 15) + '...' : hijo.nombre;
            diagrama += `│ ${nombreCorto} │ `;
            if (index < segmentoPersonas.children.length - 1) diagrama += '  ';
        });
        diagrama += '\n';
        
        segmentoPersonas.children.forEach((hijo, index) => {
            const nombreCorto = hijo.nombre.length > 15 ? hijo.nombre.substring(0, 15) + '...' : hijo.nombre;
            diagrama += `└${'─'.repeat(nombreCorto.length + 2)}┘ `;
            if (index < segmentoPersonas.children.length - 1) diagrama += '  ';
        });
        diagrama += '\n\n';
    }
    
    return diagrama;
}

// Función principal
function analizarOrganigramaVertical() {
    console.log('🔍 Analizando estructura para organigrama vertical...\n');
    
    const jsonData = leerJSON();
    if (!jsonData) {
        console.error('❌ No se pudo leer el JSON');
        return;
    }
    
    const { hierarchy } = jsonData;
    
    console.log('📊 Información del Organigrama:');
    console.log(`   - Unidad raíz: ${hierarchy.tree[0].nombre}`);
    console.log(`   - Hijos directos: ${hierarchy.tree[0].children.length}`);
    console.log(`   - Total niveles: 3`);
    
    console.log('\n🌳 Estructura Jerárquica Actual (Vertical):');
    console.log('=============================================');
    
    const diagramaVertical = crearDiagramaOrganigramaVertical(hierarchy.tree);
    console.log(diagramaVertical);
    
    const diagramaHorizontal = crearDiagramaOrganigramaHorizontal(hierarchy.tree);
    console.log(diagramaHorizontal);
    
    console.log('💡 Análisis del Problema de Renderizado:');
    console.log('=========================================');
    console.log('1. El JSON tiene la estructura jerárquica correcta');
    console.log('2. El problema está en el CSS que hace las cajas muy grandes');
    console.log('3. Las cajas grandes causan que se muestren verticalmente');
    console.log('4. Necesitamos cajas más pequeñas para layout horizontal');
    
    console.log('\n🎯 Solución Propuesta:');
    console.log('=====================');
    console.log('1. Eliminar iconos y contadores de funciones');
    console.log('2. Truncar nombres a 15 caracteres');
    console.log('3. Reducir tamaño de fuente');
    console.log('4. Eliminar flechas de expansión (click en caja)');
    console.log('5. Agregar tooltip con nombre completo');
    console.log('6. Reducir padding y márgenes');
}

// Ejecutar análisis
if (require.main === module) {
    analizarOrganigramaVertical();
}

module.exports = { analizarOrganigramaVertical, crearDiagramaOrganigramaVertical, crearDiagramaOrganigramaHorizontal };