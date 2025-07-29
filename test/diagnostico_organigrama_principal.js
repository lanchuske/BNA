// Script de diagnóstico para organigrama_optimizado_3.html
// Ejecutar en la consola del navegador después de cargar la página

console.log('🔍 DIAGNÓSTICO: Organigrama Principal');

// 1. Verificar si las funciones principales existen
console.log('📋 Verificando funciones principales:');
console.log('- STATE existe:', typeof STATE !== 'undefined');
console.log('- DataProcessor existe:', typeof DataProcessor !== 'undefined');
console.log('- Renderer existe:', typeof Renderer !== 'undefined');
console.log('- Importer existe:', typeof Importer !== 'undefined');

// 2. Verificar estado actual
if (typeof STATE !== 'undefined') {
    console.log('📊 Estado actual:');
    console.log('- STATE.data.length:', STATE.data ? STATE.data.length : 'undefined');
    console.log('- STATE.treeRoots:', STATE.treeRoots);
    console.log('- STATE.groupedData:', STATE.groupedData);
    console.log('- STATE.expandedNodes:', STATE.expandedNodes);
    console.log('- STATE.lastSelected:', STATE.lastSelected);
}

// 3. Verificar contenedores
console.log('🌳 Verificando contenedores:');
const treeContainer = document.getElementById('tree-container');
const contentArea = document.getElementById('unidad-content');
console.log('- tree-container existe:', !!treeContainer);
console.log('- unidad-content existe:', !!contentArea);

if (treeContainer) {
    console.log('- tree-container.innerHTML:', treeContainer.innerHTML.substring(0, 200) + '...');
    console.log('- tree-container.children.length:', treeContainer.children.length);
}

// 4. Verificar funciones de construcción de árbol
if (typeof DataProcessor !== 'undefined') {
    console.log('🏗️ Verificando DataProcessor:');
    console.log('- DataProcessor.buildTree existe:', typeof DataProcessor.buildTree === 'function');
    console.log('- DataProcessor.groupByUnidad existe:', typeof DataProcessor.groupByUnidad === 'function');
}

// 5. Verificar funciones de renderizado
if (typeof Renderer !== 'undefined') {
    console.log('🎨 Verificando Renderer:');
    console.log('- Renderer.renderTree existe:', typeof Renderer.renderTree === 'function');
    console.log('- Renderer.renderNode existe:', typeof Renderer.renderNode === 'function');
}

// 6. Verificar datos de ejemplo si existen
if (typeof STATE !== 'undefined' && STATE.data && STATE.data.length > 0) {
    console.log('📋 Verificando datos:');
    console.log('- Primeros 3 registros:', STATE.data.slice(0, 3));
    
    // Verificar estructura de datos
    const firstRecord = STATE.data[0];
    console.log('- Campos del primer registro:', Object.keys(firstRecord));
    console.log('- Unidad Organizativa:', firstRecord['Unidad Organizativa']);
    console.log('- Reporta A:', firstRecord['Reporta A']);
}

// 7. Verificar árbol construido
if (typeof STATE !== 'undefined' && STATE.treeRoots && STATE.treeRoots.length > 0) {
    console.log('🌿 Verificando árbol:');
    console.log('- Número de raíces:', STATE.treeRoots.length);
    console.log('- Primera raíz:', STATE.treeRoots[0]);
    
    if (STATE.treeRoots[0]) {
        console.log('- Hijos de la primera raíz:', STATE.treeRoots[0].children ? STATE.treeRoots[0].children.length : 0);
    }
}

// 8. Intentar re-construir el árbol
if (typeof STATE !== 'undefined' && STATE.data && STATE.data.length > 0 && typeof DataProcessor !== 'undefined') {
    console.log('🔄 Re-construyendo árbol...');
    try {
        const newTreeRoots = DataProcessor.buildTree(STATE.data);
        console.log('- Nuevo árbol construido:', newTreeRoots);
        console.log('- Número de raíces en nuevo árbol:', newTreeRoots.length);
        
        // Actualizar STATE
        STATE.treeRoots = newTreeRoots;
        console.log('✅ Árbol re-construido y actualizado en STATE');
    } catch (error) {
        console.error('❌ Error al re-construir árbol:', error);
    }
}

// 9. Intentar re-renderizar
if (typeof Renderer !== 'undefined' && treeContainer && STATE.treeRoots && STATE.treeRoots.length > 0) {
    console.log('🎨 Re-renderizando árbol...');
    try {
        Renderer.renderTree(STATE.treeRoots, treeContainer);
        console.log('✅ Árbol re-renderizado');
        console.log('- Nuevo contenido del contenedor:', treeContainer.innerHTML.substring(0, 200) + '...');
    } catch (error) {
        console.error('❌ Error al re-renderizar:', error);
    }
}

// 10. Verificar CSS y estilos
if (treeContainer) {
    console.log('🎨 Verificando estilos:');
    const styles = window.getComputedStyle(treeContainer);
    console.log('- display:', styles.display);
    console.log('- visibility:', styles.visibility);
    console.log('- height:', styles.height);
    console.log('- width:', styles.width);
    console.log('- overflow:', styles.overflow);
    console.log('- position:', styles.position);
}

// 11. Verificar si hay errores en la consola
console.log('🚨 Verificando errores...');
// Los errores deberían aparecer automáticamente en la consola

// 12. Función de prueba manual
window.testRenderTree = function() {
    console.log('🧪 Prueba manual de renderizado...');
    
    if (!STATE.data || STATE.data.length === 0) {
        console.log('❌ No hay datos para renderizar');
        return;
    }
    
    if (!treeContainer) {
        console.log('❌ No se encontró el contenedor tree-container');
        return;
    }
    
    try {
        // Limpiar contenedor
        treeContainer.innerHTML = '';
        
        // Crear un árbol simple de prueba
        const testTree = [
            {
                key: 'test-root',
                nombre: 'Unidad de Prueba',
                children: [],
                funciones: []
            }
        ];
        
        // Renderizar árbol de prueba
        if (typeof Renderer !== 'undefined' && typeof Renderer.renderTree === 'function') {
            Renderer.renderTree(testTree, treeContainer);
            console.log('✅ Árbol de prueba renderizado');
        } else {
            // Renderizado manual simple
            const ul = document.createElement('ul');
            ul.innerHTML = '<li>Unidad de Prueba (renderizado manual)</li>';
            treeContainer.appendChild(ul);
            console.log('✅ Renderizado manual completado');
        }
    } catch (error) {
        console.error('❌ Error en prueba manual:', error);
    }
};

console.log('🏁 Diagnóstico completado');
console.log('💡 Para probar renderizado manual, ejecuta: testRenderTree()'); 