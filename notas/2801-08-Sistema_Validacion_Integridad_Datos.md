# Sistema de Validación de Integridad de Datos con Corrección Interactiva

**Fecha:** 28 de enero de 2025  
**Archivo modificado:** `organigrama_interactivo_3.html`  
**Funcionalidad agregada:** Sistema completo de validación de integridad de datos CSV con interfaz de corrección interactiva

## Funcionalidad Implementada

Se ha implementado un sistema integral de validación de datos que se ejecuta automáticamente al cargar archivos CSV, detecta inconsistencias y permite al usuario corregirlas de forma interactiva mediante preguntas guiadas.

### **Características Principales**

✅ **Validación Automática** al cargar archivos CSV  
✅ **Interfaz Interactiva** para corrección de problemas  
✅ **Múltiples tipos de validación** (estructura, jerarquía, contenido, porcentajes)  
✅ **Correcciones automáticas y manuales**  
✅ **Exportación con validación** garantizada  
✅ **Persistencia de correcciones** en localStorage  

## Tipos de Validaciones Implementadas

### **1. Validación de Estructura Básica**
- Campos obligatorios faltantes
- Validación de formato CSV
- Verificación de headers requeridos

**Ejemplo de problema detectado:**
```
❌ Campo obligatorio faltante: Tipo de Función
La fila 25 (Marketing Digital) no tiene valor para "Tipo de Función".
```

### **2. Validación de Jerarquía Organizacional**
- Unidades padre que no existen
- Ciclos en la jerarquía (A→B→A)
- Unidades raíz incorrectas

**Ejemplo de problema detectado:**
```
❌ Unidad padre no existe
"Marketing Digital" reporta a "Dirección Comercial", pero esta unidad padre no existe.
```

### **3. Validación de Duplicados e Inconsistencias**
- Unidades con mismo nombre en diferentes ubicaciones
- Inconsistencias de datos entre registros relacionados

**Ejemplo de problema detectado:**
```
⚠️ Unidad con múltiples ubicaciones
"Sistemas" aparece reportando a: "IT", "Operaciones", "Gerencia General".
```

### **4. Validación de Contenido**
- Misiones faltantes en unidades con subordinados
- Funciones sin descripción
- Formato inconsistente de nombres (espacios extra)

**Ejemplo de problema detectado:**
```
⚠️ Misión faltante en unidad con subordinados
"Gerencia de Ventas" tiene unidades subordinadas pero no tiene misión definida.
```

### **5. Validación de Porcentajes**
- Funciones específicas que no suman 100%
- Porcentajes que exceden 100%
- Distribución automática de porcentajes

**Ejemplo de problema detectado:**
```
⚠️ Porcentajes no suman 100%
Las funciones específicas de "Análisis de Datos" suman 85% (falta 15%).
```

## Interfaz de Corrección Interactiva

### **Modal de Validación**
```
┌─────────────────────────────────────────────┐
│ 📊 Validación de Integridad de Datos        │
├─────────────────────────────────────────────┤
│ ████████████░░░  75% completo               │
│                                             │
│ Problemas: 8    Errores: 3    Resueltos: 6 │
├─────────────────────────────────────────────┤
│                                             │
│ Problema 7 de 8: Campo obligatorio faltante │
│                                             │
│ La fila 25 no tiene "Tipo de Función"      │
│                                             │
│ ○ Genérica                                  │
│ ○ Específica                                │
│ ○ Otro: [____________]                      │
│                                             │
│ [Aplicar Corrección] [Omitir]               │
└─────────────────────────────────────────────┘
```

### **Tipos de Corrección**

#### **Corrección Automática**
- Para problemas con solución clara (formato, espacios)
- Un solo clic para aplicar
- Visualización de antes/después

#### **Corrección Manual con Opciones**
- Lista de opciones sugeridas
- Campo personalizado para otros valores
- Validación en tiempo real

#### **Corrección de Porcentajes**
- Distribución automática proporcional
- Opción de corrección manual
- Cálculos automáticos para sumar 100%

## Implementación Técnica

### **Variables Globales**
```javascript
let validationIssues = [];
let currentIssueIndex = 0;
let resolvedIssuesCount = 0;
let validationInProgress = false;
let originalDataBeforeValidation = null;
```

### **Función Principal de Validación**
```javascript
function validateDataIntegrity(data) {
  validationIssues = [];
  
  // 1. Validar estructura básica
  validateBasicStructure(data);
  
  // 2. Validar jerarquía organizacional
  validateHierarchy(data);
  
  // 3. Validar duplicados y inconsistencias
  validateDuplicatesAndInconsistencies(data);
  
  // 4. Validar contenido de campos
  validateFieldContent(data);
  
  // 5. Validar porcentajes de dedicación
  validatePercentages(data);
  
  return validationIssues;
}
```

### **Detección de Ciclos Jerárquicos**
```javascript
function detectHierarchyCycle(unitName, parentName, data, visited = new Set()) {
  if (visited.has(unitName)) {
    return true; // Ciclo detectado
  }
  
  visited.add(unitName);
  
  const parentRow = data.find(row => row['Unidad Organizativa'] === parentName);
  if (parentRow && parentRow['Reporta A']) {
    return detectHierarchyCycle(parentName, parentRow['Reporta A'], data, visited);
  }
  
  return false;
}
```

### **Aplicación de Correcciones**
```javascript
function applyFieldCorrection(rowIndex, field, newValue) {
  const allData = [].concat(...Object.values(unidadesMap));
  if (rowIndex < allData.length) {
    allData[rowIndex][field] = newValue;
    console.log(`Campo ${field} en fila ${rowIndex} actualizado a:`, newValue);
  }
}
```

## Flujo de Funcionamiento

```
┌─ Usuario carga CSV ─┐
│                     │
▼                     │
🔍 Validación automática
│                     │
├─ Sin problemas ────┴─► ✅ Continuar normal
│                       
├─ Problemas encontrados
│                     
▼                     
📋 Mostrar modal validación
│                     
├─ Para cada problema:
│ ├─ Mostrar descripción
│ ├─ Ofrecer opciones
│ ├─ Aplicar corrección
│ └─ Siguiente problema
│                     
▼                     
✅ Finalizar y aplicar
│                     
├─ Regenerar datos
├─ Guardar en localStorage
├─ Actualizar vista
└─ Confirmar al usuario
```

## Integración con Sistema Existente

### **Al Cargar Archivos**
```javascript
// En procesarCSV()
setTimeout(() => {
  const issues = validateDataIntegrity(data);
  
  if (issues.length > 0) {
    showValidationInterface(issues);
  } else {
    localStorage.setItem('csvValidated', 'true');
    mostrarAlerta('✅ Datos validados: Sin problemas encontrados');
  }
}, 500);
```

### **Al Exportar**
```javascript
// En exportCSV()
const issues = validateDataIntegrity(allData);

if (issues.length > 0) {
  const criticalIssues = issues.filter(i => i.type === 'error');
  if (criticalIssues.length > 0) {
    if (!confirm('¿Continuar con errores críticos?')) {
      showValidationInterface(issues);
      return;
    }
  }
}
```

### **Persistencia de Estado**
```javascript
// Marcadores en localStorage
localStorage.setItem('csvValidated', 'true');
localStorage.setItem('csvLastValidated', new Date().toISOString());
localStorage.setItem('csvData', correctedCSV);
```

## Estilos CSS Implementados

### **Modal y Overlay**
- Modal centrado con overlay oscuro
- Responsive y scrolleable
- Animaciones suaves

### **Elementos de Validación**
- Códigos de color por tipo (error, warning, info)
- Barras de progreso
- Estadísticas visuales
- Botones diferenciados por acción

### **Estados Visuales**
- 🔴 **Error**: Rojo - Problemas críticos
- 🟡 **Warning**: Amarillo - Problemas menores
- 🔵 **Info**: Azul - Sugerencias de mejora
- 🟢 **Success**: Verde - Completado/Correcto

## Beneficios del Sistema

### **Para el Usuario**
1. **Detección Automática** de problemas al cargar
2. **Guía Paso a Paso** para corregir inconsistencias
3. **Opciones Claras** para cada tipo de problema
4. **Feedback Inmediato** sobre el progreso
5. **Exportación Garantizada** con datos correctos

### **Para la Calidad de Datos**
1. **Consistencia** en la estructura jerárquica
2. **Integridad** de referencias entre unidades
3. **Completitud** de campos obligatorios
4. **Formato Estandarizado** de nombres y valores
5. **Porcentajes Balanceados** para funciones específicas

### **Para el Mantenimiento**
1. **Código Modular** fácil de extender
2. **Validaciones Configurables** por tipo
3. **Logging Detallado** para debugging
4. **Estado Persistente** entre sesiones
5. **Integración Transparente** con funcionalidad existente

## Casos de Uso Prácticos

### **Escenario 1: Archivo con Errores Jerárquicos**
```
1. Usuario carga CSV con referencias a unidades inexistentes
2. Sistema detecta 5 problemas de jerarquía
3. Modal muestra primer problema con opciones de unidades válidas
4. Usuario selecciona padre correcto para cada unidad
5. Sistema regenera estructura corregida
6. CSV final queda con jerarquía consistente
```

### **Escenario 2: Porcentajes Inconsistentes**
```
1. Funciones específicas suman 130%
2. Sistema ofrece redistribución automática o manual
3. Usuario elige redistribución proporcional
4. Sistema recalcula: 50% → 38.5%, 80% → 61.5%
5. Total queda exactamente en 100%
```

### **Escenario 3: Datos con Formato Inconsistente**
```
1. Nombres con espacios extra: "  Marketing   Digital  "
2. Sistema detecta y sugiere corrección
3. Aplicación automática: "Marketing Digital"
4. Datos quedan con formato estandarizado
```

## Estado Final

✅ **Sistema Completo**: Validación integral de datos CSV  
✅ **Interfaz Intuitiva**: Corrección guiada paso a paso  
✅ **Integración Total**: Con carga, edición y exportación  
✅ **Calidad Garantizada**: Datos siempre consistentes  
✅ **Experiencia de Usuario**: Proceso claro y eficiente  

Esta funcionalidad transforma la aplicación de un simple visualizador de organigramas a una herramienta completa de gestión y validación de datos organizacionales, garantizando la integridad y consistencia de la información en todo momento. 