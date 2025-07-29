# 2801-39: Drag & Drop para Unidades con Orden Persistente

## Fecha: 2025-01-28

## Problema Identificado
En modo edición, el árbol no permitía reordenar las unidades mediante drag & drop, y el orden no se persistía en localStorage ni se reflejaba en las exportaciones JSON y PDF.

## Solución Implementada

### **1. Funcionalidad de Drag & Drop Mejorada**

#### **Lógica de Drop Inteligente**
```javascript
li.addEventListener('drop', (e) => {
    e.preventDefault();
    li.classList.remove('drag-over');
    const draggedKey = e.dataTransfer.getData('text/plain');
    if (draggedKey !== node.key) {
        // Determinar si es reordenamiento o movimiento
        const [draggedName] = draggedKey.split('|');
        const [targetName] = node.key.split('|');
        
        // Verificar si están en el mismo nivel
        const draggedParent = draggedKey.includes('|') ? draggedKey.split('|')[1] : null;
        const targetParent = node.key.includes('|') ? node.key.split('|')[1] : null;
        
        if (draggedParent === targetParent) {
            // Reordenamiento en el mismo nivel
            Editor.reorderUnit(draggedKey, node.key, 'after');
        } else {
            // Movimiento a diferente nivel
            Editor.moveUnit(draggedKey, node.key);
        }
    }
});
```

#### **Nueva Función de Reordenamiento**
```javascript
reorderUnit(draggedKey, targetKey, position = 'after') {
    // Verificar que estén en el mismo nivel (mismo padre)
    if (draggedNodeInfo.parent !== targetNodeInfo.parent) {
        return;
    }
    
    // Obtener la lista de nodos del mismo nivel
    const siblings = draggedNodeInfo.parent ? 
        draggedNodeInfo.parent.children : STATE.treeRoots;
    
    // Remover el nodo arrastrado
    siblings.splice(draggedNodeInfo.index, 1);
    
    // Calcular nueva posición
    let newIndex = targetNodeInfo.index;
    if (position === 'after') {
        newIndex++;
    }
    if (draggedNodeInfo.index < targetNodeInfo.index) {
        newIndex--;
    }
    
    // Insertar en nueva posición
    siblings.splice(newIndex, 0, draggedNodeInfo.node);
}
```

### **2. Persistencia en localStorage**

#### **Guardar Orden Personalizado**
```javascript
saveCustomUnitOrder() {
    const customOrder = this.generateCurrentUnitOrder();
    localStorage.setItem('customUnitOrder', JSON.stringify(customOrder));
    console.log('Orden personalizado de unidades guardado:', customOrder);
}
```

#### **Generar Orden Actual del Árbol**
```javascript
generateCurrentUnitOrder() {
    const order = [];
    
    function traverseTree(nodes) {
        nodes.forEach(node => {
            order.push(node.nombre);
            if (node.children && node.children.length > 0) {
                traverseTree(node.children);
            }
        });
    }
    
    if (STATE.treeRoots && STATE.treeRoots.length > 0) {
        traverseTree(STATE.treeRoots);
    }
    
    return order;
}
```

### **3. Respetar Orden en Exportaciones**

#### **Exportación PDF**
```javascript
getHierarchicalOrder() {
    // Verificar si hay orden personalizado guardado
    const customOrder = JSON.parse(localStorage.getItem('customUnitOrder') || '[]');
    
    if (customOrder.length > 0) {
        // Usar orden personalizado
        customOrder.forEach((unitName, index) => {
            const unitData = STATE.groupedData[unitName];
            if (unitData && unitData.length > 0) {
                orderedUnits.push(unitData);
                console.log(`${index + 1}. Agregando unidad al PDF (orden personalizado): ${unitName}`);
            }
        });
    } else {
        // Usar orden del DOM o árbol en memoria
        // ... lógica de fallback
    }
}
```

#### **Exportación JSON**
```javascript
data: {
    unidades: (() => {
        // Obtener orden personalizado de unidades
        const customUnitOrder = JSON.parse(localStorage.getItem('customUnitOrder') || '[]');
        let unidadesOrdenadas = Object.entries(STATE.groupedData);
        
        if (customUnitOrder.length > 0) {
            // Aplicar orden personalizado de unidades
            unidadesOrdenadas.sort((a, b) => {
                const indexA = customUnitOrder.indexOf(a[0]);
                const indexB = customUnitOrder.indexOf(b[0]);
                if (indexA !== -1 && indexB !== -1) {
                    return indexA - indexB;
                }
                return 0;
            });
        }
        
        return unidadesOrdenadas.map(([nombre, funciones]) => {
            // ... procesamiento de funciones
        });
    })()
}
```

## Características de la Implementación

### **1. Drag & Drop Inteligente**
- **Detección automática**: Distingue entre reordenamiento y movimiento
- **Mismo nivel**: Reordenamiento cuando están en el mismo padre
- **Diferente nivel**: Movimiento cuando cambian de jerarquía
- **Validación**: Previene referencias circulares

### **2. Persistencia Robusta**
- **localStorage**: Guarda orden personalizado automáticamente
- **Generación automática**: Captura orden actual del árbol
- **Recuperación**: Restaura orden al cargar la página
- **Limpieza**: Función para resetear orden personalizado

### **3. Exportaciones Consistentes**
- **PDF**: Respeta orden personalizado en generación
- **JSON**: Incluye orden personalizado en estructura
- **Logging**: Trazabilidad completa de cambios
- **Fallback**: Usa orden original si no hay personalizado

## Flujo de Trabajo

### **1. Modo Edición**
1. **Activar**: Botón "✏️ Modo Edición"
2. **Visualizar**: Controles de drag & drop aparecen
3. **Arrastrar**: Usar handle "⋮⋮" para mover unidades
4. **Soltar**: En posición deseada

### **2. Persistencia Automática**
1. **Cambio detectado**: Al mover/reordenar unidad
2. **Guardar orden**: `saveCustomUnitOrder()` se ejecuta
3. **localStorage**: Orden se guarda automáticamente
4. **Confirmación**: Mensaje de éxito mostrado

### **3. Exportación Respetuosa**
1. **PDF**: `getHierarchicalOrder()` usa orden personalizado
2. **JSON**: `exportJSON()` ordena unidades según personalización
3. **Logs**: Trazabilidad completa en consola
4. **Resultado**: Exportaciones reflejan orden personalizado

## Beneficios de la Implementación

### **Flexibilidad**
- **Reordenamiento**: Cambiar posición de unidades
- **Movimiento**: Cambiar jerarquía de unidades
- **Persistencia**: Orden se mantiene entre sesiones
- **Exportación**: Orden se refleja en todos los formatos

### **Usabilidad**
- **Visual**: Indicadores claros durante drag & drop
- **Feedback**: Mensajes de confirmación
- **Intuitivo**: Comportamiento esperado
- **Seguro**: Validaciones previenen errores

### **Confiabilidad**
- **Validación**: Previene referencias circulares
- **Fallback**: Funciona sin orden personalizado
- **Logging**: Trazabilidad completa
- **Recuperación**: Restaura estado automáticamente

## Archivos Modificados

- `organigrama_optimizado_3.html`:
  - Función `moveUnit()` actualizada con persistencia
  - Nueva función `reorderUnit()` para reordenamiento
  - Nuevas funciones `saveCustomUnitOrder()`, `getCustomUnitOrder()`, `clearCustomUnitOrder()`
  - Función `generateCurrentUnitOrder()` para capturar orden
  - `getHierarchicalOrder()` actualizada para respetar orden personalizado
  - `exportJSON()` actualizada para incluir orden personalizado
  - Lógica de drop mejorada para detectar tipo de operación

## Estado: ✅ Implementado

### Próximos Pasos
1. Probar drag & drop en modo edición
2. Verificar persistencia en localStorage
3. Confirmar que exportaciones respetan orden personalizado
4. Validar que funciona tanto reordenamiento como movimiento 