# Funcionalidad: Mostrar Archivo Actual en Menú Admin

**Fecha:** 28 de enero de 2025  
**Archivo modificado:** `organigrama_interactivo_2.html`  
**Funcionalidad agregada:** Mostrar qué archivo CSV está actualmente cargado en el menú Admin

## Funcionalidad Implementada

Se agregó una nueva sección en el menú Admin que muestra qué archivo CSV está actualmente cargado en la aplicación, proporcionando transparencia al usuario sobre qué datos está visualizando.

### **Vista del Usuario**

En el menú Admin ahora aparece una caja informativa en la parte superior:

```
┌─────────────────────────────────┐
│ Archivo actual:                 │
│ unidades_organizativas_final.csv│
└─────────────────────────────────┘
```

### **Estados Posibles**

1. **Archivo cargado via Browse:** Muestra el nombre completo del archivo
2. **Archivo cargado via ruta:** Muestra el nombre extraído de la ruta
3. **Datos desde localStorage:** Muestra "Datos desde localStorage" 
4. **No hay archivo:** Muestra "Ningún archivo cargado"

## Implementación Técnica

### 1. **Variable Global**
```javascript
let currentFileName = 'Ningún archivo cargado';
```

### 2. **Elemento HTML en el Menú Admin**
```html
<div id="currentFileInfo" style="margin-bottom:0.8em;padding:0.5em;background:#f8f9fa;border:1px solid #e9ecef;border-radius:4px;font-size:0.9em;">
  <div style="font-weight:bold;color:#495057;margin-bottom:0.2em;">Archivo actual:</div>
  <div id="currentFileName" style="color:#6c757d;font-style:italic;">Ningún archivo cargado</div>
</div>
```

### 3. **Función de Actualización**
```javascript
function updateCurrentFileName(fileName) {
  currentFileName = fileName;
  const fileNameElement = document.getElementById('currentFileName');
  if (fileNameElement) {
    if (fileName && fileName !== 'Ningún archivo cargado') {
      fileNameElement.textContent = fileName;
      fileNameElement.style.color = '#28a745';
      fileNameElement.style.fontStyle = 'normal';
      fileNameElement.style.fontWeight = '500';
    } else {
      fileNameElement.textContent = 'Ningún archivo cargado';
      fileNameElement.style.color = '#6c757d';
      fileNameElement.style.fontStyle = 'italic';
      fileNameElement.style.fontWeight = 'normal';
    }
  }
}
```

### 4. **Integración con Carga de Archivos**

#### **Via Browse (File Input):**
```javascript
reader.onload = function(evt) {
  console.log('File read successfully, processing CSV...');
  procesarCSV(evt.target.result, file.name);
};
```

#### **Via Ruta Manual:**
```javascript
const fileName = filePath.split('/').pop() || filePath.split('\\').pop() || filePath;
procesarCSV(csvText, fileName);
```

#### **Desde localStorage:**
```javascript
const savedFileName = localStorage.getItem('csvFileName');
if (savedFileName) {
  updateCurrentFileName(savedFileName);
} else {
  updateCurrentFileName('Datos desde localStorage');
}
```

### 5. **Persistencia del Nombre**
```javascript
// Guardar nombre en localStorage
if (fileName) {
  localStorage.setItem('csvFileName', fileName);
}
```

## Estilos y UX

### **Estados Visuales:**

1. **Archivo cargado:**
   - Color: Verde (#28a745)
   - Peso: 500 (semi-bold)
   - Estilo: normal

2. **Sin archivo:**
   - Color: Gris (#6c757d)
   - Peso: normal
   - Estilo: itálico

### **Diseño:**
- Fondo gris claro (#f8f9fa)
- Borde sutil (#e9ecef)
- Esquinas redondeadas
- Posicionado en la parte superior del menú
- Separación visual clara de otros controles

## Flujo de Funcionamiento

```
┌─ Usuario carga archivo ─┐
│                        │
│ ┌─ Via Browse ─────────┐│
│ │ • file.name         ││
│ └────────────────────┘│
│                        │
│ ┌─ Via Ruta ──────────┐│
│ │ • Extraer de path   ││
│ └────────────────────┘│
│                        │
│ ┌─ Desde localStorage ┐│
│ │ • Usar guardado     ││
│ │ • O "desde storage" ││
│ └────────────────────┘│
└────────────────────────┘
           │
           ▼
    procesarCSV(data, fileName)
           │
           ▼
    updateCurrentFileName(fileName)
           │
           ▼
    localStorage.setItem('csvFileName', fileName)
           │
           ▼
    ✅ Usuario ve archivo actual
```

## Beneficios

1. **Transparencia:** El usuario siempre sabe qué archivo está viendo
2. **Confianza:** Reduce incertidumbre sobre los datos mostrados
3. **Debug:** Facilita diagnóstico de problemas de carga
4. **UX:** Mejora la experiencia de usuario con información clara
5. **Persistencia:** Mantiene información entre sesiones

## Casos de Uso

### **Escenario 1: Comparar múltiples archivos**
- Usuario carga `archivo_v1.csv`
- Ve "Archivo actual: archivo_v1.csv"
- Carga `archivo_v2.csv`
- Ve "Archivo actual: archivo_v2.csv"
- Claridad sobre qué versión está viendo

### **Escenario 2: Trabajo interrumpido**
- Usuario carga archivo y cierra navegador
- Al reopenir, ve "Datos desde localStorage"
- Sabe que tiene datos previos cargados

### **Escenario 3: Trabajo en equipo**
- Un colega abre la aplicación
- Ve inmediatamente qué archivo está cargado
- Puede decidir si cargar su propio archivo

## Estado Final

✅ **Implementado:** Información de archivo actual visible en menú Admin  
✅ **Persistente:** Nombre se guarda en localStorage  
✅ **Adaptativo:** Diferentes mensajes según origen de los datos  
✅ **Estilizado:** Diseño coherente con el resto de la aplicación  
✅ **Probado:** Funcionamiento verificado en browser  

Esta funcionalidad mejora significativamente la transparencia y usabilidad de la aplicación al mostrar claramente qué archivo CSV está siendo visualizado. 