# 2801-35: Encabezado Fijo en Exportación PDF

## Fecha: 2025-01-28

## Resumen
Se implementó un encabezado fijo en la exportación a PDF para que cuando una unidad ocupe más de una página, mantenga su encabezado visible en todas las páginas.

## Problema Identificado
Cuando una unidad organizacional tiene muchas funciones y ocupa múltiples páginas en el PDF, el encabezado (nombre de la unidad, reporta a, fecha) solo aparecía en la primera página, dificultando la identificación de la unidad en páginas subsiguientes.

## Solución Implementada

### 1. **Encabezado Fijo con CSS**
```css
.unit-header {
    position: fixed;
    top: 15mm;
    left: 15mm;
    right: 15mm;
    text-align: center;
    background-color: white;
    border-bottom: 2px solid #2c3e50;
    padding-bottom: 8px;
    z-index: 1000;
}
```

### 2. **Espaciado del Contenido**
```css
.unit-page {
    page-break-after: auto;
    margin-bottom: 15px;
    padding: 10px;
    padding-top: 60mm; /* Espacio para el encabezado fijo */
}
```

## Características del Encabezado Fijo

### **Posicionamiento**
- **Posición**: Fija en la parte superior de cada página
- **Margen superior**: 15mm desde el borde de la página
- **Margen lateral**: 15mm desde los bordes izquierdo y derecho
- **Z-index**: 1000 para asegurar que esté por encima del contenido

### **Estilo Visual**
- **Fondo**: Blanco para contrastar con el contenido
- **Borde inferior**: Línea sólida de 2px en color #2c3e50
- **Alineación**: Centrada
- **Padding**: 8px en la parte inferior

### **Contenido del Encabezado**
- **Nombre de la unidad**: Título principal en negrita
- **Reporta a**: Información de jerarquía
- **Fecha**: Fecha de generación del reporte

## Beneficios

### **Legibilidad Mejorada**
- El usuario siempre sabe qué unidad está visualizando
- Facilita la navegación en documentos largos
- Reduce la confusión al revisar múltiples páginas

### **Profesionalismo**
- Formato consistente en todas las páginas
- Mejor presentación visual
- Cumple con estándares de documentación profesional

### **Usabilidad**
- No es necesario volver a la primera página para identificar la unidad
- Mejor experiencia de lectura
- Facilita la impresión y revisión de documentos

## Estructura Visual Resultante

```
┌─────────────────────────────────────┐
│        [ENCABEZADO FIJO]           │ ← Siempre visible
│    Nombre de la Unidad             │
│    Reporta a: Padre | Fecha        │
├─────────────────────────────────────┤
│                                     │
│    [CONTENIDO DE LA UNIDAD]        │
│    • Misión                         │
│    • Funciones Genéricas            │
│    • Funciones Específicas          │
│    • Indicadores                    │
│                                     │
│    [CONTINÚA EN SIGUIENTE PÁGINA]  │
└─────────────────────────────────────┘
```

## Archivos Modificados

- `organigrama_optimizado_3.html`: 
  - Estilos CSS para `.unit-header` actualizados
  - Estilos CSS para `.unit-page` con padding superior

## Estado: ✅ Completado

### Próximos Pasos
1. Probar la exportación a PDF con unidades que ocupen múltiples páginas
2. Verificar que el encabezado aparece correctamente en todas las páginas
3. Confirmar que el espaciado es adecuado y no afecta la legibilidad 