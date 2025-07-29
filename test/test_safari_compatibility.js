// Test de compatibilidad con Safari para el organigrama
console.log('🍎 Test de compatibilidad con Safari');

// Función para verificar características específicas de Safari
function detectSafari() {
    const userAgent = navigator.userAgent;
    const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
    console.log('- Detectado Safari:', isSafari);
    console.log('- User Agent:', userAgent);
    return isSafari;
}

// Función para agregar event listeners compatibles con Safari
function addSafariCompatibleListeners() {
    console.log('🔧 Agregando event listeners compatibles con Safari...');
    
    const treeNodes = document.querySelectorAll('.tree-node');
    console.log('- Nodos encontrados:', treeNodes.length);
    
    treeNodes.forEach(function(node) {
        const nodeKey = node.getAttribute('data-key');
        const hasChildren = node.querySelector('.tree-children') !== null;
        
        if (hasChildren) {
            // Ocultar hijos por defecto
            const childrenContainer = node.querySelector('.tree-children');
            childrenContainer.style.display = 'none';
            
            // Event listener compatible con Safari
            node.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleNodeSafari(nodeKey);
            });
            
            // Cambiar cursor
            node.style.cursor = 'pointer';
            
            // Efectos hover para Safari
            node.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#f0f0f0';
            });
            
            node.addEventListener('mouseleave', function() {
                this.style.backgroundColor = '';
            });
            
            console.log('- Event listener agregado a:', nodeKey);
        }
    });
}

// Función de toggle específica para Safari
function toggleNodeSafari(nodeKey) {
    console.log('- Toggleando nodo:', nodeKey);
    const isExpanded = STATE.expandedNodes[nodeKey];
    STATE.expandedNodes[nodeKey] = !isExpanded;
    
    const nodeElement = document.querySelector('[data-key="' + nodeKey + '"]');
    if (nodeElement) {
        const childrenContainer = nodeElement.querySelector('.tree-children');
        if (childrenContainer) {
            childrenContainer.style.display = STATE.expandedNodes[nodeKey] ? 'block' : 'none';
            console.log('- Estado actualizado:', STATE.expandedNodes[nodeKey] ? 'expandido' : 'colapsado');
        }
    }
}

// Función para probar la funcionalidad
function testSafariFunctionality() {
    console.log('🧪 Probando funcionalidad en Safari...');
    
    // Verificar que los nodos existen
    const treeNodes = document.querySelectorAll('.tree-node');
    console.log('- Nodos disponibles:', treeNodes.length);
    
    if (treeNodes.length > 0) {
        const firstNode = treeNodes[0];
        const nodeKey = firstNode.getAttribute('data-key');
        console.log('- Primer nodo:', nodeKey);
        
        // Simular clic en el primer nodo
        console.log('- Simulando clic en:', nodeKey);
        toggleNodeSafari(nodeKey);
        
        // Verificar resultado
        const isExpanded = STATE.expandedNodes[nodeKey];
        console.log('- Nodo expandido:', isExpanded);
    }
}

// Ejecutar test
if (typeof STATE !== 'undefined' && STATE.treeRoots && STATE.treeRoots.length > 0) {
    console.log('✅ Estado disponible, ejecutando test de Safari...');
    detectSafari();
    addSafariCompatibleListeners();
    testSafariFunctionality();
} else {
    console.log('❌ Estado no disponible para test de Safari');
} 