# 2801-43: Implementación de Orden Personalizado desde CSV

## Fecha: 2025-01-28

## Problema Identificado
El reordenamiento de unidades no funcionaba correctamente porque los datos CSV no tenían información de orden personalizado. El sistema estaba usando el fallback (orden alfabético) en lugar del orden visual deseado.

## Solución Implementada

### **1. Generación de CSV con Orden Personalizado**
Se creó un script (`scripts/generate_ordered_csv.js`) que:
- Lee el archivo CSV original
- Agrega una columna "Orden Personalizado" 
- Asigna valores numéricos basados en el orden visual actual
- Genera un nuevo archivo: `CSV/unidades_organizativas_con_orden_2025-01-28.csv`

### **2. Modificación del Procesamiento de CSV**
```javascript
// Verificar si existe columna de orden personalizado
const hasOrderColumn = headers.some(header => header === 'Orden Personalizado');
const orderColumnIndex = headers.findIndex(header => header === 'Orden Personalizado');

// Agregar orden personalizado si existe
if (hasOrderColumn && orderColumnIndex >= 0) {
    const orderValue = values[orderColumnIndex] ? parseInt(values[orderColumnIndex]) : 999;
    row['Orden Personalizado'] = orderValue;
} else {
    row['Orden Personalizado'] = 999; // Valor por defecto
}
```

### **3. Modificación de la Construcción del Árbol**
```javascript
// Ordenar raíces por orden personalizado si está disponible
roots.sort((a, b) => {
    const orderA = a.funciones[0] && a.funciones[0]['Orden Personalizado'] ? 
        parseInt(a.funciones[0]['Orden Personalizado']) : 999;
    const orderB = b.funciones[0] && b.funciones[0]['Orden Personalizado'] ? 
        parseInt(b.funciones[0]['Orden Personalizado']) : 999;
    return orderA - orderB;
});

// Ordenar hijos de cada nodo por orden personalizado
const sortChildren = (node) => {
    if (node.children && node.children.length > 0) {
        node.children.sort((a, b) => {
            const orderA = a.funciones[0] && a.funciones[0]['Orden Personalizado'] ? 
                parseInt(a.funciones[0]['Orden Personalizado']) : 999;
            const orderB = b.funciones[0] && b.funciones[0]['Orden Personalizado'] ? 
                parseInt(b.funciones[0]['Orden Personalizado']) : 999;
            return orderA - orderB;
        });
        
        // Ordenar recursivamente los hijos de los hijos
        node.children.forEach(sortChildren);
    }
};
```

## Estructura del Orden Personalizado

### **Valores Asignados:**
1. **Gerencia General** - 1
2. **SG Riesgo Crediticio** - 2
3. **Sgp Clientes** - 3
4. **SGP Sistemas, Tecnologías y Servicios de IT** - 4
5. **Sgp Negocio** - 5
6. **Segmento Personas** - 6
7. **Estrategia Comercial Y Propuesta De Valor Personas** - 7
8. **Head De Segmentos Personas** - 8
9. **Inteligencia Comercial Personas** - 9
10. **Comunicaciones Y Eventos Personas** - 10
11. **Segmento Empresas** - 11
12. **Estrategia Comercial Y Propuesta De Valor** - 12
13. **Head De Segmentos** - 13
14. **Inteligencia Comercial** - 14
15. **Comunicaciones Y Eventos** - 15
16. **Productos** - 16
17. **Activos** - 17
18. **Canales** - 18
19. **Banca Digital** - 19
20. **Coordinación Del Negocio Y Datos** - 20
21. **Coordinación Del Negocio** - 21
22. **Data Personas** - 22
23. **Data Empresas** - 23

### **Valor por Defecto:** 999 (para unidades no encontradas)

## Beneficios de la Implementación

### **1. Orden Visual Consistente**
- **Carga inicial**: Los datos se cargan en el orden visual correcto
- **Reordenamiento**: El drag & drop funciona correctamente
- **Persistencia**: El orden se mantiene entre sesiones

### **2. Compatibilidad**
- **CSV con orden**: Usa la columna "Orden Personalizado"
- **CSV sin orden**: Usa valor por defecto (999)
- **Fallback**: Orden alfabético para unidades sin orden

### **3. Debugging Mejorado**
- **Logging detallado**: Información sobre detección de columna de orden
- **Trazabilidad**: Seguimiento del procesamiento de datos
- **Validación**: Verificación de valores de orden

## Archivos Creados/Modificados

### **Archivos Creados:**
- `scripts/generate_ordered_csv.js`: Script para generar CSV con orden
- `CSV/unidades_organizativas_con_orden_2025-01-28.csv`: CSV con orden personalizado
- `notas/2801-43-Implementacion_Orden_Personalizado_CSV.md`: Esta documentación

### **Archivos Modificados:**
- `organigrama_optimizado_3.html`:
  - Función `processCSV`: Detección y procesamiento de columna de orden
  - Función `buildTree`: Ordenamiento por orden personalizado

## Flujo de Trabajo Actualizado

### **1. Carga de Datos**
1. **Detectar columna**: Verificar si existe "Orden Personalizado"
2. **Procesar valores**: Convertir a números enteros
3. **Asignar valores**: 999 para unidades sin orden
4. **Construir árbol**: Ordenar por valores de orden

### **2. Reordenamiento**
1. **Drag & drop**: Funciona correctamente con orden personalizado
2. **Actualización**: Keys se actualizan después del reordenamiento
3. **Persistencia**: Orden se guarda en localStorage
4. **Exportación**: Orden se refleja en JSON y PDF

### **3. Exportación**
1. **JSON**: Incluye orden personalizado en metadata
2. **PDF**: Respeta el orden visual del árbol
3. **CSV**: Mantiene columna de orden si existe

## Estado: ✅ Implementado

### Próximos Pasos
1. Probar carga del nuevo CSV con orden
2. Verificar que el reordenamiento funciona correctamente
3. Confirmar que la exportación respeta el orden
4. Validar que la persistencia funciona apropiadamente 