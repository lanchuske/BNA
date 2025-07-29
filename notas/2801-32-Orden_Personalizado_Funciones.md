# 2801-32: Orden Personalizado de Funciones

## Fecha: 2025-01-28

## Resumen
Se implementó la funcionalidad para permitir al usuario reorganizar manualmente el orden de las funciones e indicadores de cada unidad organizacional, con persistencia en localStorage y exportación a JSON.

## Funcionalidades Implementadas

### 1. **Controles de Orden**
- Botón "🔄 Cambiar Orden" para activar el modo de reorganización
- Botón "💾 Guardar Orden" para persistir los cambios
- Indicadores visuales cuando el modo drag and drop está activo

### 2. **Drag and Drop**
- Funciones arrastrables con manejador visual (⋮⋮)
- Feedback visual durante el arrastre (opacidad y rotación)
- Reordenamiento en tiempo real
- Validación para evitar conflictos

### 3. **Persistencia en localStorage**
- Almacenamiento del orden personalizado por unidad
- Clave: `customFunctionOrders`
- Estructura: `{ "nombreUnidad": ["funcion1", "funcion2", ...] }`

### 4. **Exportación a JSON**
- El orden personalizado se incluye en la exportación JSON
- Campo `customOrder` en cada unidad
- Funciones ordenadas según el orden personalizado guardado

## Estructura Técnica

### CSS Agregado
```css
.function-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    cursor: move;
    transition: all 0.3s ease;
}

.function-drag-handle {
    cursor: grab;
    color: #666;
    font-size: 18px;
    user-select: none;
}

.functions-container.drag-mode .function-item {
    border: 2px dashed #007bff;
    background-color: #f8f9fa;
}
```

### JavaScript Agregado
- `toggleFunctionOrder(unidadNombre)`: Activa/desactiva modo drag
- `saveFunctionOrder(unidadNombre)`: Guarda el orden en localStorage
- `getCustomFunctionOrder(unidadNombre)`: Obtiene orden personalizado
- `setupDragAndDrop()`: Configura eventos de drag and drop

### Lógica de Ordenamiento
1. **Orden por defecto**: Genéricas → Específicas → Indicadores
2. **Orden personalizado**: Si existe en localStorage, se aplica primero
3. **Fallback**: Si no hay orden personalizado, se usa el orden por tipo

## Flujo de Uso

1. **Seleccionar unidad** en el árbol organizacional
2. **Hacer clic en "🔄 Cambiar Orden"** para activar modo drag
3. **Arrastrar funciones** usando el manejador (⋮⋮)
4. **Hacer clic en "💾 Guardar Orden"** para persistir cambios
5. **El orden se mantiene** en localStorage y se incluye en exportaciones

## Beneficios

- **Flexibilidad**: Permite reorganizar funciones según necesidades específicas
- **Persistencia**: Los cambios se mantienen entre sesiones
- **Exportación**: El orden personalizado se incluye en archivos JSON
- **UX intuitiva**: Drag and drop con feedback visual claro
- **Compatibilidad**: Funciona con el ordenamiento automático existente

## Archivos Modificados

- `organigrama_optimizado_2.html`: Agregada funcionalidad completa
- Estilos CSS para drag and drop
- Funciones JavaScript para manejo de orden
- Integración con sistema de exportación JSON

## Estado: ✅ Completado 