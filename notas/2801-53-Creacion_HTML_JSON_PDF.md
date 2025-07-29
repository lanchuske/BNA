# Creación HTML JSON & PDF - 28/01/2025

## 🎯 **OBJETIVO**

Crear un nuevo archivo HTML simplificado que solo maneje carga de archivos JSON y exportación a PDF, basado en la funcionalidad del archivo original pero enfocado únicamente en estas dos operaciones.

## 📁 **ARCHIVO CREADO**

### **Nombre:** `organigrama_interactivo_JSON_PDF.html`
### **Funcionalidad:** Carga JSON + Exportación PDF
### **Tamaño:** ~800 líneas (versión simplificada)

## 🛠️ **CARACTERÍSTICAS IMPLEMENTADAS**

### **1. Interfaz Simplificada**
- **Header limpio** - Título y descripción clara
- **Controles centralizados** - Solo botones necesarios
- **Estado visible** - Información de carga y exportación
- **Diseño moderno** - Cards con sombras y bordes redondeados

### **2. Carga de Archivos JSON**
- **📁 Examinar JSON...** - Seleccionar archivo desde explorador
- **📥 Cargar Archivo** - Cargar por ruta manual
- **Validación automática** - Verifica formato JSON y estructura
- **Conversión interna** - JSON → CSV para compatibilidad

### **3. Visualización de Datos**
- **Árbol organizacional** - Estructura jerárquica interactiva
- **Navegación por clic** - Seleccionar unidades
- **Contenido detallado** - Misión, funciones genéricas y específicas
- **Tablas estructuradas** - Información clara y organizada

### **4. Exportación PDF**
- **📄 Exportar PDF** - Genera PDF profesional
- **Formato A4** - Optimizado para impresión
- **Saltos de página** - Cada unidad en página separada
- **Estilos profesionales** - Tablas y tipografía optimizadas

## 📋 **FUNCIONES PRINCIPALES**

### **Carga de Datos:**
```javascript
// Procesar archivos JSON
async function procesarJSON(jsonText, fileName = '')

// Convertir JSON a CSV interno
function convertirJSONaCSV(jsonData)

// Parsear datos CSV
function parseCSV(csvText)

// Agrupar por unidad organizativa
function groupByUnidad(data)
```

### **Visualización:**
```javascript
// Construir árbol jerárquico
function buildTree(data)

// Renderizar árbol interactivo
function renderTree(nodes, container, onSelect, selectedKey)

// Mostrar detalles de unidad
function showUnidad(unidadData)

// Alternar expansión de nodos
function toggleNode(node, toggle)
```

### **Exportación PDF:**
```javascript
// Exportar a PDF
function exportToPDF()

// Generar contenido HTML para PDF
function generatePDFContent()
```

## 🎨 **DISEÑO Y UX**

### **Colores y Estilos:**
- **Primario:** `#3498db` (Azul)
- **Éxito:** `#27ae60` (Verde)
- **Error:** `#e74c3c` (Rojo)
- **Fondo:** `#f8f9fa` (Gris claro)
- **Cards:** Blanco con sombras suaves

### **Componentes:**
- **Header** - Título y descripción
- **Controls** - Botones de carga y exportación
- **Status** - Estado de datos y archivos
- **Tree** - Árbol organizacional
- **Content** - Detalles de unidad seleccionada
- **Alerts** - Notificaciones de estado

### **Responsive:**
- **Flexbox** - Layout adaptable
- **Cards** - Diseño modular
- **Espaciado** - Márgenes y padding consistentes
- **Tipografía** - Jerarquía visual clara

## 📊 **FORMATO JSON SOPORTADO**

### **Estructura Requerida:**
```json
{
  "unidades": [
    {
      "Unidad Organizativa": "Nombre de la unidad",
      "Jerarquía": "1",
      "Reporta a": "",
      "Misión": "Descripción de la misión",
      "Tipo de Función": "Genérica",
      "Descripción": "Descripción de la función",
      "Producto Final": "Resultado esperado",
      "Porcentaje Dedicación": ""
    }
  ]
}
```

### **Campos Opcionales:**
- `Jerarquía` - Nivel en la estructura
- `Reporta a` - Unidad superior
- `Misión` - Descripción de la misión
- `Tipo de Función` - "Genérica" o "Específica"
- `Descripción` - Detalle de la función
- `Producto Final` - Resultado esperado
- `Porcentaje Dedicación` - Solo para funciones específicas

## 📄 **EXPORTACIÓN PDF**

### **Características:**
- **Formato:** A4, orientación vertical
- **Márgenes:** 10mm en todos los lados
- **Calidad:** JPEG 98%
- **Escala:** 2x para mejor resolución
- **Saltos:** Página por unidad organizacional

### **Contenido del PDF:**
1. **Header** - Título y fecha
2. **Unidad por página** - Información completa
3. **Misión** - Descripción de la misión
4. **Funciones Genéricas** - Tabla con descripción y producto final
5. **Funciones Específicas** - Tabla con descripción, producto final y dedicación

### **Estilos PDF:**
- **Tipografía:** Arial, sans-serif
- **Colores:** Profesionales y legibles
- **Tablas:** Bordes y espaciado optimizados
- **Headers:** Títulos destacados
- **Contenido:** Estructura clara y organizada

## ✅ **VENTAJAS DEL NUEVO ARCHIVO**

### **Simplicidad:**
- **Enfoque único** - Solo JSON y PDF
- **Interfaz limpia** - Sin funcionalidades innecesarias
- **Código optimizado** - Sin funciones no utilizadas
- **Carga rápida** - Menos dependencias

### **Usabilidad:**
- **Flujo claro** - Cargar → Visualizar → Exportar
- **Feedback visual** - Alertas y estados claros
- **Navegación intuitiva** - Árbol interactivo
- **Exportación directa** - Un clic para PDF

### **Mantenibilidad:**
- **Código modular** - Funciones bien separadas
- **Comentarios claros** - Documentación inline
- **Estructura lógica** - Organización coherente
- **Fácil extensión** - Base sólida para mejoras

## 🎯 **CASOS DE USO**

### **Ideal para:**
- **Presentaciones ejecutivas** - PDF profesional
- **Documentación organizacional** - Estructura clara
- **Análisis de estructura** - Visualización jerárquica
- **Reportes gerenciales** - Formato estándar

### **Flujo típico:**
1. **Cargar JSON** - Seleccionar archivo de datos
2. **Revisar estructura** - Navegar por el árbol
3. **Verificar contenido** - Revisar detalles de unidades
4. **Exportar PDF** - Generar documento final

**El nuevo archivo proporciona una solución enfocada y eficiente para la carga de datos JSON y la generación de PDFs profesionales del organigrama.**