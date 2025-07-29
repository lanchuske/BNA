// Fix ultra específico para Safari - Abordar todas las posibles causas
console.log('🍎 Aplicando fix ultra específico para Safari...');

// Detectar Safari específicamente
function detectSafari() {
    const userAgent = navigator.userAgent;
    const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
    console.log('- Detectado Safari:', isSafari);
    console.log('- User Agent:', userAgent);
    return isSafari;
}

// Función de toggle ultra compatible con Safari
function toggleNodeSafariUltra(nodeKey) {
    console.log('🔄 Toggleando en Safari (ultra):', nodeKey);
    
    // Verificar si el nodo existe
    const nodeElement = document.querySelector('[data-key="' + nodeKey + '"]');
    if (!nodeElement) {
        console.log('❌ Nodo no encontrado:', nodeKey);
        return;
    }
    
    // Buscar contenedor de hijos
    const childrenContainer = nodeElement.querySelector('.tree-children');
    if (!childrenContainer) {
        console.log('❌ Contenedor de hijos no encontrado para:', nodeKey);
        return;
    }
    
    // Toggle estado con múltiples métodos
    const isCurrentlyExpanded = childrenContainer.style.display !== 'none' && 
                               childrenContainer.style.display !== '' &&
                               childrenContainer.style.visibility !== 'hidden';
    const newState = !isCurrentlyExpanded;
    
    // Aplicar cambio visual con múltiples métodos para Safari
    if (newState) {
        childrenContainer.style.display = 'block';
        childrenContainer.style.visibility = 'visible';
        childrenContainer.style.opacity = '1';
    } else {
        childrenContainer.style.display = 'none';
        childrenContainer.style.visibility = 'hidden';
        childrenContainer.style.opacity = '0';
    }
    
    // Actualizar STATE
    if (!STATE.expandedNodes) STATE.expandedNodes = {};
    STATE.expandedNodes[nodeKey] = newState;
    
    console.log('✅ Estado ultra actualizado:', newState ? 'expandido' : 'colapsado');
    
    // Forzar reflow en Safari
    if (detectSafari()) {
        childrenContainer.offsetHeight; // Forzar reflow
    }
}

// Re-renderizar con compatibilidad ultra para Safari
function renderTreeSafariUltra() {
    console.log('🔄 Re-renderizando con compatibilidad ultra para Safari...');
    
    const treeContainer = document.getElementById('tree-container');
    if (!treeContainer || !STATE.treeRoots) {
        console.log('❌ Contenedor o datos no disponibles');
        return;
    }
    
    // Limpiar contenedor completamente
    treeContainer.innerHTML = '';
    
    // Crear ul
    const ul = document.createElement('ul');
    ul.className = 'tree-list';
    
    // Función recursiva con compatibilidad ultra para Safari
    function renderNodeSafariUltra(node, parentElement, level = 0) {
        const li = document.createElement('li');
        li.className = 'tree-node';
        li.setAttribute('data-key', node.key);
        
        const hasChildren = node.children && node.children.length > 0;
        const icon = hasChildren ? '📂' : '📄';
        
        li.innerHTML = `
            <span class="node-icon">${icon}</span>
            <span class="node-name">${node.nombre}</span>
            <span style="color: #666; font-size: 12px;">(${node.funciones.length} funciones)</span>
        `;
        
        // Agregar contenedor de hijos si tiene hijos
        if (hasChildren) {
            const childrenContainer = document.createElement('div');
            childrenContainer.className = 'tree-children';
            childrenContainer.style.display = 'none';
            childrenContainer.style.visibility = 'hidden';
            childrenContainer.style.marginLeft = '20px';
            childrenContainer.style.transition = 'all 0.2s ease';
            
            const childrenUl = document.createElement('ul');
            childrenUl.className = 'tree-list';
            
            node.children.forEach(child => {
                const childLi = renderNodeSafariUltra(child, childrenUl, level + 1);
                childrenUl.appendChild(childLi);
            });
            
            childrenContainer.appendChild(childrenUl);
            li.appendChild(childrenContainer);
            
            // Agregar múltiples tipos de event listeners para Safari
            li.style.cursor = 'pointer';
            
            // Event listener principal
            li.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Click principal en Safari:', node.key);
                toggleNodeSafariUltra(node.key);
            });
            
            // Event listener de mousedown para Safari
            li.addEventListener('mousedown', function(e) {
                e.preventDefault();
                console.log('MouseDown en Safari:', node.key);
                toggleNodeSafariUltra(node.key);
            });
            
            // Event listener de touchstart para dispositivos táctiles
            li.addEventListener('touchstart', function(e) {
                e.preventDefault();
                console.log('TouchStart en Safari:', node.key);
                toggleNodeSafariUltra(node.key);
            });
            
            // Agregar estilos específicos para Safari
            li.style.userSelect = 'none';
            li.style.webkitUserSelect = 'none';
            li.style.mozUserSelect = 'none';
            li.style.msUserSelect = 'none';
        }
        
        parentElement.appendChild(li);
        return li;
    }
    
    // Renderizar todas las raíces
    STATE.treeRoots.forEach(root => {
        renderNodeSafariUltra(root, ul);
    });
    
    treeContainer.appendChild(ul);
    console.log('✅ Árbol renderizado con compatibilidad ultra para Safari');
}

// Función para forzar la expansión manual
function forceExpandNode(nodeKey) {
    console.log('🔧 Forzando expansión manual:', nodeKey);
    
    const nodeElement = document.querySelector('[data-key="' + nodeKey + '"]');
    if (nodeElement) {
        const childrenContainer = nodeElement.querySelector('.tree-children');
        if (childrenContainer) {
            childrenContainer.style.display = 'block';
            childrenContainer.style.visibility = 'visible';
            childrenContainer.style.opacity = '1';
            
            if (!STATE.expandedNodes) STATE.expandedNodes = {};
            STATE.expandedNodes[nodeKey] = true;
            
            console.log('✅ Expansión forzada exitosa');
        }
    }
}

// Ejecutar fix ultra
console.log('🚀 Aplicando fix ultra para Safari...');
renderTreeSafariUltra();

// Forzar expansión del primer nodo para prueba
setTimeout(() => {
    if (STATE.treeRoots && STATE.treeRoots.length > 0) {
        const firstNodeKey = STATE.treeRoots[0].key;
        console.log('🧪 Forzando expansión del primer nodo:', firstNodeKey);
        forceExpandNode(firstNodeKey);
    }
}, 1000);

console.log('✅ Fix ultra para Safari aplicado'); 