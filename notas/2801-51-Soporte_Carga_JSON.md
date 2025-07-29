# Soporte Carga JSON - 28/01/2025

## 🎯 **OBJETIVO**

Agregar soporte para cargar archivos JSON además de CSV en el organigrama interactivo, manteniendo la compatibilidad con el sistema existente.

## 🛠️ **MODIFICACIONES REALIZADAS**

### **1. Input File Actualizado (Línea 1344)**
```html
<!-- ANTES -->
<input type="file" id="fileInput" accept=".csv" style="display:none">

<!-- DESPUÉS -->
<input type="file" id="fileInput" accept=".csv,.json" style="display:none">
```

### **2. Placeholder Actualizado (Línea 1346)**
```html
<!-- ANTES -->
<input type="text" id="filePath" placeholder="Ruta del archivo CSV">

<!-- DESPUÉS -->
<input type="text" id="filePath" placeholder="Ruta del archivo CSV o JSON">
```

### **3. Etiqueta Actualizada (Línea 1342)**
```html
<!-- ANTES -->
<label style="font-weight:bold;">Cargar CSV:</label>

<!-- DESPUÉS -->
<label style="font-weight:bold;">Cargar Archivo:</label>
```

### **4. Validación de Extensión (Línea 5566)**
```javascript
// ANTES
if (!filePath.toLowerCase().endsWith('.csv')) {
  mostrarAlerta('La ruta debe ser de un archivo CSV', 2000, '#e74c3c');
  return;
}

// DESPUÉS
if (!filePath.toLowerCase().endsWith('.csv') && !filePath.toLowerCase().endsWith('.json')) {
  mostrarAlerta('La ruta debe ser de un archivo CSV o JSON', 2000, '#e74c3c');
  return;
}
```

### **5. Validación File Input (Línea 5512)**
```javascript
// ANTES
if (!file.name.toLowerCase().endsWith('.csv')) {
  console.error('Invalid file type:', file.name);
  mostrarAlerta('Por favor seleccione un archivo CSV', 2000, '#e74c3c');
  return;
}

// DESPUÉS
if (!file.name.toLowerCase().endsWith('.csv') && !file.name.toLowerCase().endsWith('.json')) {
  console.error('Invalid file type:', file.name);
  mostrarAlerta('Por favor seleccione un archivo CSV o JSON', 2000, '#e74c3c');
  return;
}
```

### **6. Procesamiento de Archivos (Línea 5575)**
```javascript
// ANTES
procesarCSV(evt.target.result, file.name);

// DESPUÉS
if (file.name.toLowerCase().endsWith('.json')) {
  procesarJSON(evt.target.result, file.name);
} else {
  procesarCSV(evt.target.result, file.name);
}
```

### **7. Nueva Función procesarJSON (Líneas 5505-5580)**
```javascript
async function procesarJSON(jsonText, fileName = '', source = 'file') {
  try {
    mostrarAlerta('Procesando archivo JSON...', 1000);
    
    // Validación de JSON
    let jsonData = JSON.parse(jsonText);
    
    // Verificar estructura
    if (!jsonData.unidades || !Array.isArray(jsonData.unidades)) {
      throw new Error('El JSON debe contener un array "unidades"');
    }
    
    // Convertir JSON a CSV para compatibilidad
    const csvData = convertirJSONaCSV(jsonData);
    
    // Procesar como CSV normal
    // ... resto del procesamiento
  } catch (error) {
    console.error('Error al procesar JSON:', error);
    mostrarAlerta('Error: ' + error.message, 2500, '#e74c3c');
  }
}
```

### **8. Nueva Función convertirJSONaCSV (Líneas 5582-5610)**
```javascript
function convertirJSONaCSV(jsonData) {
  try {
    const unidades = jsonData.unidades;
    
    // Obtener headers
    let headers = [];
    if (unidades.length > 0 && unidades[0]) {
      headers = Object.keys(unidades[0]);
    } else {
      headers = ['Unidad Organizativa', 'Misión', 'Tipo de Función', 'Descripción de la Función'];
    }
    
    // Crear CSV
    const csvRows = [headers.join(';')];
    
    unidades.forEach(unidad => {
      const row = headers.map(header => {
        const value = unidad[header] || '';
        return `"${String(value).replace(/"/g, '""')}"`;
      });
      csvRows.push(row.join(';'));
    });
    
    return csvRows.join('\n');
  } catch (error) {
    throw new Error('Error al procesar estructura JSON: ' + error.message);
  }
}
```

### **9. Documentación Actualizada (Líneas 1442-1480)**
- Agregada sección sobre formato JSON
- Actualizada información de carga de archivos
- Incluido ejemplo de estructura JSON

## ✅ **FUNCIONALIDADES AGREGADAS**

### **Soporte para JSON:**
- ✅ **Carga de archivos JSON** mediante botón "Examinar..."
- ✅ **Carga de archivos JSON** mediante ruta manual
- ✅ **Validación de estructura JSON**
- ✅ **Conversión automática JSON → CSV**
- ✅ **Compatibilidad total** con sistema existente
- ✅ **Validación de integridad** para archivos JSON
- ✅ **Documentación actualizada** en sistema de ayuda

### **Formato JSON Soportado:**
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

## 🔄 **FLUJO DE PROCESAMIENTO**

### **Para archivos JSON:**
1. **Validación de extensión** - Verificar que sea `.json`
2. **Lectura del archivo** - Usar FileReader
3. **Parsing JSON** - Validar sintaxis JSON
4. **Validación de estructura** - Verificar array "unidades"
5. **Conversión a CSV** - Usar `convertirJSONaCSV()`
6. **Procesamiento normal** - Usar sistema CSV existente
7. **Validación de integridad** - Aplicar validaciones existentes

### **Compatibilidad:**
- ✅ **Archivos CSV** - Funcionan exactamente igual
- ✅ **Archivos JSON** - Nuevo soporte agregado
- ✅ **Sistema de validación** - Funciona para ambos formatos
- ✅ **Exportación** - Mantiene funcionalidad existente
- ✅ **localStorage** - Compatible con ambos formatos

## 📊 **VENTAJAS**

### **Para Usuarios:**
- **Flexibilidad** - Pueden usar CSV o JSON según preferencia
- **Interoperabilidad** - Fácil integración con otros sistemas
- **Estructura clara** - JSON es más legible para datos complejos

### **Para Desarrollo:**
- **Reutilización** - Aprovecha sistema CSV existente
- **Mantenibilidad** - Código modular y extensible
- **Compatibilidad** - No rompe funcionalidad existente

**El sistema ahora soporta tanto archivos CSV como JSON, manteniendo toda la funcionalidad existente y agregando flexibilidad para los usuarios.**