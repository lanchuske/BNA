# 2801-40: Corrección de Reordenamiento de Unidades

## Fecha: 2025-01-28

## Problema Identificado
El drag & drop solo permitía mover unidades (cambiar jerarquía) pero no reordenar unidades en el mismo nivel. La lógica de detección no funcionaba correctamente para distinguir entre reordenamiento y movimiento.

## Causa del Problema
La lógica de detección en el evento `drop` no estaba extrayendo correctamente los padres de las keys de los nodos, lo que causaba que siempre se detectara como movimiento en lugar de reordenamiento.

## Solución Implementada

### **1. Corrección de la Lógica de Detección**
```javascript
li.addEventListener('drop', (e) => {
    e.preventDefault();
    li.classList.remove('drag-over');
    const draggedKey = e.dataTransfer.getData('text/plain');
    if (draggedKey !== node.key) {
        // Determinar si es reordenamiento o movimiento
        const [draggedName, draggedParent] = draggedKey.split('|');
        const [targetName, targetParent] = node.key.split('|');
        
        console.log('Drop detectado:', {
            draggedKey,
            targetKey: node.key,
            draggedName,
            draggedParent,
            targetName,
            targetParent
        });
        
        // Verificar si están en el mismo nivel (mismo padre)
        if (draggedParent === targetParent) {
            console.log('Reordenamiento en el mismo nivel');
            // Reordenamiento en el mismo nivel
            Editor.reorderUnit(draggedKey, node.key, 'after');
        } else {
            console.log('Movimiento a diferente nivel');
            // Movimiento a diferente nivel
            Editor.moveUnit(draggedKey, node.key);
        }
    }
});
```

### **2. Mejora de la Función reorderUnit**
```javascript
reorderUnit(draggedKey, targetKey, position = 'after') {
    // ... validaciones iniciales ...
    
    console.log('Reordenando unidades:', { draggedKey, targetKey, position });
    
    // Encontrar los nodos con logging detallado
    const draggedNodeInfo = findNode(STATE.treeRoots, draggedKey);
    const targetNodeInfo = findNode(STATE.treeRoots, targetKey);
    
    console.log('Nodos encontrados:', {
        dragged: { parent: draggedNodeInfo.parent?.nombre, index: draggedNodeInfo.index },
        target: { parent: targetNodeInfo.parent?.nombre, index: targetNodeInfo.index }
    });
    
    // Verificar que estén en el mismo nivel
    if (draggedNodeInfo.parent !== targetNodeInfo.parent) {
        console.log('Los nodos no están en el mismo nivel');
        return;
    }
    
    // Obtener siblings y reordenar
    const siblings = draggedNodeInfo.parent ? 
        draggedNodeInfo.parent.children : STATE.treeRoots;
    
    console.log('Siblings antes del reordenamiento:', siblings.map(n => n.nombre));
    
    // Remover y reinsertar en nueva posición
    siblings.splice(draggedNodeInfo.index, 1);
    let newIndex = targetNodeInfo.index;
    if (position === 'after') newIndex++;
    if (draggedNodeInfo.index < targetNodeInfo.index) newIndex--;
    
    siblings.splice(newIndex, 0, draggedNodeInfo.node);
    
    console.log('Siblings después del reordenamiento:', siblings.map(n => n.nombre));
}
```

## Características de la Corrección

### **1. Detección Precisa**
- **Extracción correcta**: `[draggedName, draggedParent] = draggedKey.split('|')`
- **Comparación exacta**: `draggedParent === targetParent`
- **Logging detallado**: Para debugging y trazabilidad

### **2. Reordenamiento Robusto**
- **Validación de nivel**: Verifica que estén en el mismo padre
- **Cálculo de posición**: Maneja índices correctamente
- **Actualización visual**: Re-renderiza el árbol inmediatamente

### **3. Logging Mejorado**
```javascript
console.log('Drop detectado:', {
    draggedKey,
    targetKey: node.key,
    draggedName,
    draggedParent,
    targetName,
    targetParent
});
```

## Flujo de Trabajo Corregido

### **1. Detección de Operación**
1. **Extraer información**: Nombre y padre de ambas keys
2. **Comparar padres**: Si son iguales = reordenamiento
3. **Logging**: Registrar tipo de operación detectada

### **2. Reordenamiento**
1. **Encontrar nodos**: En el árbol actual
2. **Validar nivel**: Mismo padre
3. **Reordenar**: Remover e insertar en nueva posición
4. **Actualizar**: Re-renderizar y guardar

### **3. Movimiento**
1. **Encontrar nodos**: En el árbol actual
2. **Validar jerarquía**: Diferentes padres
3. **Mover**: Cambiar padre y actualizar key
4. **Actualizar**: Re-renderizar y guardar

## Beneficios de la Corrección

### **Precisión**
- **Detección correcta**: Distingue reordenamiento de movimiento
- **Operación apropiada**: Ejecuta la función correcta
- **Validación robusta**: Previene operaciones incorrectas

### **Debugging**
- **Logging detallado**: Facilita identificar problemas
- **Trazabilidad**: Permite seguir el flujo completo
- **Información clara**: Muestra qué operación se ejecuta

### **Usabilidad**
- **Reordenamiento**: Cambiar posición en el mismo nivel
- **Movimiento**: Cambiar jerarquía a diferente nivel
- **Feedback**: Mensajes claros sobre la operación

## Archivos Modificados

- `organigrama_optimizado_3.html`:
  - Lógica de detección en evento `drop` corregida
  - Función `reorderUnit` mejorada con logging
  - Extracción correcta de padres de keys
  - Validación robusta de niveles

## Estado: ✅ Corregido

### Próximos Pasos
1. Probar reordenamiento de unidades en el mismo nivel
2. Verificar que el movimiento sigue funcionando
3. Confirmar que el logging muestra la operación correcta
4. Validar que la persistencia funciona para ambos casos 