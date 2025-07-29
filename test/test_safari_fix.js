// Fix específico para Safari - Múltiples enfoques
console.log('🍎 Aplicando fix específico para Safari...');

// Enfoque 1: Event listeners con múltiples tipos de eventos
function addSafariEventListeners() {
    console.log('🔧 Enfoque 1: Event listeners múltiples para Safari');
    
    const treeNodes = document.querySelectorAll('.tree-node');
    console.log('- Nodos encontrados:', treeNodes.length);
    
    treeNodes.forEach(function(node) {
        const nodeKey = node.getAttribute('data-key');
        const hasChildren = node.querySelector('.tree-children');
        
        if (hasChildren) {
            console.log('- Agregando listeners a:', nodeKey);
            
            // Múltiples tipos de eventos para Safari
            node.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Click en Safari:', nodeKey);
                toggleNodeSafari(nodeKey);
            });
            
            node.addEventListener('touchstart', function(e) {
                e.preventDefault();
                console.log('Touch en Safari:', nodeKey);
                toggleNodeSafari(nodeKey);
            });
            
            // Agregar cursor pointer
            node.style.cursor = 'pointer';
        }
    });
}

// Enfoque 2: Función de toggle mejorada para Safari
function toggleNodeSafari(nodeKey) {
    console.log('🔄 Toggleando en Safari:', nodeKey);
    
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
    
    // Actualizar ícono
    const iconElement = nodeElement.querySelector('.node-icon');
    if (iconElement) {
        iconElement.textContent = newState ? '📂' : '📂';
    }
    
    // Actualizar STATE
    if (!STATE.expandedNodes) STATE.expandedNodes = {};
    STATE.expandedNodes[nodeKey] = newState;
    
    console.log('✅ Estado actualizado:', newState ? 'expandido' : 'colapsado');
}

// Enfoque 3: Re-renderizar con funcionalidad Safari integrada
function renderTreeSafariCompatible() {
    console.log('🔄 Re-renderizando con compatibilidad Safari...');
    
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
    
    // Función recursiva con compatibilidad Safari
    function renderNodeSafari(node, parentElement, level = 0) {
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
                const childLi = renderNodeSafari(child, childrenUl, level + 1);
                childrenUl.appendChild(childLi);
            });
            
            childrenContainer.appendChild(childrenUl);
            li.appendChild(childrenContainer);
            
            // Agregar event listener directamente
            li.style.cursor = 'pointer';
            li.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Click directo en Safari:', node.key);
                toggleNodeSafari(node.key);
            });
        }
        
        parentElement.appendChild(li);
        return li;
    }
    
    // Renderizar todas las raíces
    STATE.treeRoots.forEach(root => {
        renderNodeSafari(root, ul);
    });
    
    treeContainer.appendChild(ul);
    console.log('✅ Árbol renderizado con compatibilidad Safari');
}

// Ejecutar todos los enfoques
console.log('🚀 Aplicando fixes para Safari...');
renderTreeSafariCompatible();
addSafariEventListeners();

console.log('✅ Fixes para Safari aplicados'); 