// Script de diagnóstico para áreas no visibles
// Ejecutar en la consola del navegador

console.log('🔍 DIAGNÓSTICO: Áreas no visibles');

// 1. Verificar estado de datos
console.log('📊 Estado de datos:');
console.log('- STATE.data.length:', STATE.data ? STATE.data.length : 'undefined');
console.log('- STATE.treeRoots:', STATE.treeRoots);
console.log('- STATE.groupedData:', STATE.groupedData);

// 2. Verificar contenedor del árbol
const treeContainer = document.getElementById('tree-container');
console.log('🌳 Contenedor del árbol:');
console.log('- tree-container existe:', !!treeContainer);
console.log('- tree-container.innerHTML:', treeContainer ? treeContainer.innerHTML.substring(0, 200) + '...' : 'no existe');

// 3. Verificar función renderTree
console.log('🎨 Función renderTree:');
console.log('- Renderer.renderTree existe:', typeof Renderer.renderTree === 'function');
if (typeof Renderer.renderTree === 'function') {
    console.log('- Renderer.renderTree.toString():', Renderer.renderTree.toString().substring(0, 200) + '...');
}

// 4. Verificar función buildTree
console.log('🏗️ Función buildTree:');
console.log('- DataProcessor.buildTree existe:', typeof DataProcessor.buildTree === 'function');
if (typeof DataProcessor.buildTree === 'function') {
    console.log('- DataProcessor.buildTree.toString():', DataProcessor.buildTree.toString().substring(0, 200) + '...');
}

// 5. Verificar datos de ejemplo
if (STATE.data && STATE.data.length > 0) {
    console.log('📋 Primeros 3 registros de datos:');
    console.log(STATE.data.slice(0, 3));
}

// 6. Verificar estructura del árbol
if (STATE.treeRoots && STATE.treeRoots.length > 0) {
    console.log('🌿 Primeros 3 nodos del árbol:');
    console.log(STATE.treeRoots.slice(0, 3));
}

// 7. Verificar CSS y estilos
console.log('🎨 Estilos del contenedor:');
if (treeContainer) {
    const styles = window.getComputedStyle(treeContainer);
    console.log('- display:', styles.display);
    console.log('- visibility:', styles.visibility);
    console.log('- height:', styles.height);
    console.log('- width:', styles.width);
    console.log('- overflow:', styles.overflow);
}

// 8. Intentar re-renderizar manualmente
console.log('🔄 Intentando re-renderizar...');
if (STATE.treeRoots && treeContainer) {
    try {
        Renderer.renderTree(STATE.treeRoots, treeContainer);
        console.log('✅ Re-renderizado completado');
        console.log('- Nuevo contenido:', treeContainer.innerHTML.substring(0, 200) + '...');
    } catch (error) {
        console.error('❌ Error al re-renderizar:', error);
    }
}

// 9. Verificar si hay errores en la consola
console.log('🚨 Verificando errores...');
// Los errores deberían aparecer automáticamente en la consola

console.log('🏁 Diagnóstico completado'); 