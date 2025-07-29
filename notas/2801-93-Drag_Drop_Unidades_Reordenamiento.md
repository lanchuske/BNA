# 2801-93: Drag and Drop de Unidades - Reordenamiento Jerárquico

## 📋 **Resumen**
Implementación de funcionalidad de drag and drop para reordenar y mover unidades dentro de la jerarquía organizacional en modo edición.

## 🎯 **Objetivos**
- Permitir reordenar unidades arrastrándolas visualmente
- Actualizar automáticamente la jerarquía en el JSON
- Mantener la integridad de las relaciones padre-hijo
- Actualizar niveles de reporte automáticamente
- Proporcionar indicadores visuales claros durante el drag

## 🔧 **Implementación Técnica**

### **Estilos CSS Agregados**
```css
/* Indicadores visuales para drag and drop */
.tree-node.draggable {
    cursor: grab;
    transition: all 0.2s ease;
    border: 2px solid transparent;
}

.tree-node.dragging {
    opacity: 0.5;
    transform: rotate(2deg);
    box-shadow: 0 4px 8px rgba(0,123,255,0.3);
}

.tree-node.drag-over-before {
    border-top: 3px solid #28a745;
}

.tree-node.drag-over-after {
    border-bottom: 3px solid #28a745;
}

.tree-node.drag-over-child {
    border-left: 3px solid #28a745;
    background-color: #f8fff8;
}
```

### **Variables de Estado Nuevas**
```javascript
STATE = {
    // ... existentes
    draggedUnit: null,
    dragOverUnit: null,
    dragOverPosition: null // 'before', 'after', 'child'
};
```

### **Funciones Principales Implementadas**

#### **1. setupUnitDragAndDrop()**
- Configura event listeners para drag and drop
- Maneja eventos: dragstart, dragend, dragover, dragleave, drop
- Determina posición de drop basada en posición del mouse
- Actualiza indicadores visuales en tiempo real

#### **2. moveUnit(draggedKey, targetKey, position)**
- Valida que no se mueva una unidad dentro de sí misma
- Remueve la unidad de su posición actual
- Inserta en la nueva posición según el tipo:
  - `child`: Como hijo del target
  - `before/after`: Como hermano del target
- Actualiza relaciones `reportaA`
- Recalcula niveles de reporte automáticamente

#### **3. updateAllReportLevels()**
- Recalcula niveles de reporte para todas las unidades
- Mantiene consistencia después de movimientos

## 🎨 **Indicadores Visuales**

### **Durante el Drag**
- **Unidad arrastrada**: Opacidad reducida, rotación ligera, sombra azul
- **Área de destino**: Bordes verdes según posición
  - `before`: Borde superior verde
  - `after`: Borde inferior verde  
  - `child`: Borde izquierdo verde + fondo verde claro

### **Posiciones de Drop**
- **Arriba del elemento**: Insertar antes
- **Abajo del elemento**: Insertar después
- **Centro del elemento**: Hacer hijo

## 🔄 **Flujo de Operación**

1. **Activación**: Solo disponible en modo edición
2. **Inicio**: Click en ícono ⋮⋮ y arrastrar
3. **Navegación**: Indicadores visuales en tiempo real
4. **Drop**: Validación y reordenamiento
5. **Actualización**: JSON, jerarquía y niveles de reporte
6. **Re-renderizado**: Árbol actualizado visualmente

## ✅ **Validaciones Implementadas**

### **Prevención de Errores**
- No mover unidad dentro de sí misma
- Verificar existencia de unidades origen y destino
- Validar relaciones padre-hijo
- Prevenir ciclos en la jerarquía

### **Actualizaciones Automáticas**
- Relaciones `reportaA` actualizadas
- Niveles de reporte recalculados
- Metadata actualizada
- Árbol re-renderizado

## 📊 **Impacto en el JSON**

### **Estructura Mantenida**
```json
{
  "hierarchy": {
    "tree": [
      {
        "key": "unit_1",
        "nombre": "Unidad A",
        "reportaA": "Unidad Padre",
        "nivelReporte": 2,
        "children": [...]
      }
    ]
  }
}
```

### **Campos Actualizados**
- `reportaA`: Relación padre-hijo
- `nivelReporte`: Calculado automáticamente
- `jerarquia`: Mantenida según tipo de unidad

## 🎯 **Beneficios**

### **Para el Usuario**
- Reordenamiento visual intuitivo
- Feedback visual inmediato
- Validaciones preventivas
- Actualización automática de datos

### **Para el Sistema**
- Integridad de datos mantenida
- Consistencia en jerarquía
- Exportaciones actualizadas
- Rendimiento optimizado

## 🔮 **Próximas Mejoras Posibles**

1. **Undo/Redo**: Historial de movimientos
2. **Multi-select**: Mover múltiples unidades
3. **Atajos de teclado**: Navegación por teclado
4. **Animaciones**: Transiciones suaves
5. **Validación avanzada**: Reglas de negocio específicas

## 📝 **Notas de Implementación**

- **Compatibilidad**: Funciona con estructura JSON existente
- **Rendimiento**: Event listeners optimizados
- **Accesibilidad**: Indicadores visuales claros
- **Mantenibilidad**: Código modular y documentado

## ✅ **Estado Final**
- ✅ Drag and drop funcional
- ✅ Indicadores visuales implementados
- ✅ Validaciones de integridad
- ✅ Actualización automática de datos
- ✅ Documentación completa 