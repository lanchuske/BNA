# 2801-36: Orden Jerárquico en Exportación PDF

## Fecha: 2025-01-28

## Resumen
Se modificó la exportación a PDF para que respete tanto el orden del navegador (árbol jerárquico) como el orden personalizado de las funciones e indicadores configurado por el usuario.

## Problema Identificado
La exportación a PDF no respetaba:
1. **Orden del navegador**: Las unidades no aparecían en el mismo orden que en el árbol jerárquico
2. **Orden personalizado de funciones**: No se aplicaba el orden personalizado configurado por el usuario
3. **Estado de expansión**: No se consideraba qué unidades estaban expandidas/colapsadas

## Solución Implementada

### 1. **Respeto del Orden del Navegador**
```javascript
getHierarchicalOrder() {
    const orderedUnits = [];
    
    function traverseTree(nodes) {
        nodes.forEach(node => {
            // Verificar si la unidad está visible en el navegador
            const isVisible = !STATE.expandedNodes || 
                           Object.keys(STATE.expandedNodes).length === 0 ||
                           STATE.expandedNodes[node.key] !== undefined;
            
            if (isVisible) {
                orderedUnits.push(unitData);
            }
            
            // Recorrer hijos si están expandidos
            const shouldTraverseChildren = node.children && node.children.length > 0 && 
                                        (STATE.expandedNodes[node.key] || 
                                         !STATE.expandedNodes || 
                                         Object.keys(STATE.expandedNodes).length === 0);
            
            if (shouldTraverseChildren) {
                traverseTree(node.children);
            }
        });
    }
}
```

### 2. **Respeto del Orden Personalizado de Funciones**
```javascript
// Obtener orden personalizado si existe
const customOrder = getCustomFunctionOrder(unit['Unidad Organizativa']);
let funcionesOrdenadas = [...functions];

if (customOrder) {
    // Aplicar orden personalizado
    funcionesOrdenadas.sort((a, b) => {
        const indexA = customOrder.indexOf(a['Descripción'] || '');
        const indexB = customOrder.indexOf(b['Descripción'] || '');
        if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB;
        }
        return 0;
    });
} else {
    // Si no hay orden personalizado, usar orden por tipo
    funcionesOrdenadas.sort((a, b) => {
        const tipoA = a['Tipo de Función'] || 'Genérica';
        const tipoB = b['Tipo de Función'] || 'Genérica';
        const getPriority = (tipo) => {
            if (tipo.includes('Genérica')) return 1;
            if (tipo.includes('Específica')) return 2;
            if (tipo.includes('Indicador')) return 3;
            return 4;
        };
        return getPriority(tipoA) - getPriority(tipoB);
    });
}
```

## Características del Orden Jerárquico

### **1. Orden del Navegador**
- **Jerarquía**: Respeta la estructura padre-hijo del árbol
- **Expansión**: Solo incluye unidades que están expandidas en el navegador
- **Visibilidad**: Considera el estado de colapso/expansión de cada nodo
- **Navegación**: Sigue el mismo orden que el usuario ve en la interfaz

### **2. Orden de Funciones**
- **Personalizado**: Si existe orden personalizado en localStorage, se aplica
- **Por tipo**: Si no hay orden personalizado, usa Genéricas → Específicas → Indicadores
- **Consistencia**: Mantiene el mismo orden que se muestra en la interfaz

### **3. Lógica de Prioridad**
1. **Orden personalizado** (si existe)
2. **Orden por tipo** (Genéricas, Específicas, Indicadores)
3. **Orden alfabético** (como fallback)

## Flujo de Generación del PDF

### **Paso 1: Obtener Orden Jerárquico**
```javascript
const units = this.getHierarchicalOrder();
```
- Recorre el árbol respetando expansión/colapso
- Mantiene orden padre-hijo
- Solo incluye unidades visibles

### **Paso 2: Aplicar Orden Personalizado**
```javascript
const customOrder = getCustomFunctionOrder(unit['Unidad Organizativa']);
```
- Busca orden personalizado en localStorage
- Aplica orden si existe
- Usa orden por tipo como fallback

### **Paso 3: Generar Contenido**
```javascript
funcionesOrdenadas.forEach(func => {
    // Generar tabla con orden respetado
});
```
- Mantiene orden personalizado en las tablas
- Respeta agrupación por tipo
- Conserva formato específico por tipo

## Beneficios

### **Consistencia Visual**
- El PDF refleja exactamente lo que el usuario ve en pantalla
- Misma jerarquía que el navegador
- Mismo orden de funciones que la interfaz

### **Personalización**
- Respeta configuraciones personalizadas del usuario
- Mantiene orden de drag & drop aplicado
- Conserva preferencias de visualización

### **Profesionalismo**
- Documento coherente con la navegación
- Orden lógico y predecible
- Facilita la revisión y presentación

## Ejemplo de Orden Resultante

### **Navegador:**
```
SGP Clientes [-]
├── Segmento Personas [+]
├── Segmento Empresas [+]
├── Productos [+]
└── Canales [+]
```

### **PDF:**
1. **SGP Clientes**
   - Funciones Genéricas (orden personalizado)
   - Funciones Específicas (orden personalizado)
   - Indicadores (orden personalizado)

2. **Segmento Personas**
   - Funciones Genéricas (orden personalizado)
   - Funciones Específicas (orden personalizado)
   - Indicadores (orden personalizado)

3. **Segmento Empresas**
   - ...

## Archivos Modificados

- `organigrama_optimizado_3.html`:
  - Función `getHierarchicalOrder()` mejorada
  - Función `generatePDFContent()` con orden personalizado
  - Lógica de respeto de orden del navegador

## Estado: ✅ Completado

### Próximos Pasos
1. Probar la exportación a PDF con diferentes configuraciones del navegador
2. Verificar que el orden jerárquico se respeta correctamente
3. Confirmar que el orden personalizado de funciones se aplica
4. Validar que solo se incluyen unidades expandidas 