// Fix final para Safari - Evitar doble eventos
console.log('🍎 Aplicando fix final para Safari...');

// Función de toggle mejorada con debounce
let lastToggleTime = 0;
function toggleNodeSafariFinal(nodeKey) {
    const now = Date.now();
    if (now - lastToggleTime < 300) {
        console.log('⏱️ Ignorando clic muy rápido');
        return;
    }
    lastToggleTime = now;
    
    console.log('🔄 Toggleando en Safari (final):', nodeKey);
    
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
    
    // Toggle estado
    const isCurrentlyExpanded = childrenContainer.style.display !== 'none';
    const newState = !isCurrentlyExpanded;
    
    // Aplicar cambio visual
    childrenContainer.style.display = newState ? 'block' : 'none';
    
    // Actualizar STATE
    if (!STATE.expandedNodes) STATE.expandedNodes = {};
    STATE.expandedNodes[nodeKey] = newState;
    
    console.log('✅ Estado final actualizado:', newState ? 'expandido' : 'colapsado');
}

// Re-renderizar con event listeners únicos
function renderTreeSafariFinal() {
    console.log('🔄 Re-renderizando con fix final para Safari...');
    
    const treeContainer = document.getElementById('tree-container');
    if (!treeContainer || !STATE.treeRoots) {
        console.log('❌ Contenedor o datos no disponibles');
        return;
    }
    
    // Limpiar contenedor
    treeContainer.innerHTML = '';
    
    // Crear ul
    const ul = document.createElement('ul');
    ul.className = 'tree-list';
    
    // Función recursiva con event listener único
    function renderNodeSafariFinal(node, parentElement, level = 0) {
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
            childrenContainer.style.marginLeft = '20px';
            
            const childrenUl = document.createElement('ul');
            childrenUl.className = 'tree-list';
            
            node.children.forEach(child => {
                const childLi = renderNodeSafariFinal(child, childrenUl, level + 1);
                childrenUl.appendChild(childLi);
            });
            
            childrenContainer.appendChild(childrenUl);
            li.appendChild(childrenContainer);
            
            // Agregar UN SOLO event listener
            li.style.cursor = 'pointer';
            li.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Click único en Safari:', node.key);
                toggleNodeSafariFinal(node.key);
            });
        }
        
        parentElement.appendChild(li);
        return li;
    }
    
    // Renderizar todas las raíces
    STATE.treeRoots.forEach(root => {
        renderNodeSafariFinal(root, ul);
    });
    
    treeContainer.appendChild(ul);
    console.log('✅ Árbol renderizado con fix final para Safari');
}

// Ejecutar fix final
console.log('🚀 Aplicando fix final para Safari...');
renderTreeSafariFinal();

console.log('✅ Fix final para Safari aplicado'); 