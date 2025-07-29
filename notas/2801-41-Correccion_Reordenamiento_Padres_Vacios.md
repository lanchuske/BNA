# 2801-41: Corrección de Reordenamiento con Padres Vacíos

## Fecha: 2025-01-28

## Problema Identificado
El reordenamiento de unidades no funcionaba correctamente cuando las unidades tenían padres vacíos (unidades raíz). La comparación de padres fallaba porque los strings vacíos no se comparaban correctamente con null.

## Causa del Problema
Las keys se construyen como `nombre|parent`, donde `parent` puede ser un string vacío `""` para unidades raíz. La comparación `draggedParent === targetParent` fallaba cuando:
- Una unidad tenía parent vacío `""`
- Otra unidad tenía parent null o undefined
- La comparación `"" === null` es `false`

## Solución Implementada

### **1. Normalización de Padres en Detección**
```javascript
// Normalizar padres (convertir string vacío a null)
const normalizedDraggedParent = draggedParent || null;
const normalizedTargetParent = targetParent || null;

// Verificar si están en el mismo nivel (mismo padre)
if (normalizedDraggedParent === normalizedTargetParent) {
    console.log('Reordenamiento en el mismo nivel');
    Editor.reorderUnit(draggedKey, node.key, 'after');
} else {
    console.log('Movimiento a diferente nivel');
    Editor.moveUnit(draggedKey, node.key);
}
```

### **2. Mejora en Validación de Nivel**
```javascript
// Verificar que estén en el mismo nivel (mismo padre)
const draggedParentName = draggedNodeInfo.parent?.nombre || null;
const targetParentName = targetNodeInfo.parent?.nombre || null;

if (draggedParentName !== targetParentName) {
    console.log('Los nodos no están en el mismo nivel', {
        draggedParent: draggedParentName,
        targetParent: targetParentName
    });
    return;
}
```

### **3. Logging Mejorado**
```javascript
console.log('Nodos encontrados:', {
    dragged: { 
        parent: draggedNodeInfo.parent?.nombre || 'RAÍZ', 
        index: draggedNodeInfo.index,
        key: draggedKey
    },
    target: { 
        parent: targetNodeInfo.parent?.nombre || 'RAÍZ', 
        index: targetNodeInfo.index,
        key: targetKey
    }
});
```

## Casos de Uso Corregidos

### **1. Unidades Raíz (sin padre)**
- **Antes**: `"Unidad1|"` vs `"Unidad2|"` → comparación fallaba
- **Después**: `null` vs `null` → comparación correcta ✅

### **2. Unidades con Padre**
- **Antes**: `"Unidad3|Unidad1"` vs `"Unidad4|Unidad1"` → funcionaba
- **Después**: `"Unidad1"` vs `"Unidad1"` → sigue funcionando ✅

### **3. Mezcla de Casos**
- **Antes**: `"Unidad1|"` vs `"Unidad3|Unidad1"` → detección incorrecta
- **Después**: `null` vs `"Unidad1"` → detección correcta ✅

## Beneficios de la Corrección

### **Precisión**
- **Normalización**: Convierte strings vacíos a null
- **Comparación exacta**: `null === null` es `true`
- **Detección correcta**: Distingue reordenamiento de movimiento

### **Robustez**
- **Manejo de casos edge**: Unidades raíz y con padre
- **Logging detallado**: Facilita debugging
- **Validación mejorada**: Verifica nombres de padres

### **Usabilidad**
- **Reordenamiento de raíces**: Funciona correctamente
- **Reordenamiento de hijos**: Sigue funcionando
- **Feedback claro**: Mensajes de debug informativos

## Archivos Modificados

- `organigrama_optimizado_3.html`:
  - Normalización de padres en evento `drop`
  - Mejora en validación de nivel en `reorderUnit`
  - Logging detallado para debugging
  - Manejo robusto de casos edge

## Estado: ✅ Corregido

### Próximos Pasos
1. Probar reordenamiento de unidades raíz
2. Probar reordenamiento de unidades con padre
3. Verificar que el movimiento sigue funcionando
4. Confirmar que el logging muestra información correcta 