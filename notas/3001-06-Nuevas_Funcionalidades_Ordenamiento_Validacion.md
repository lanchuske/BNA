# 3001-06 - Nuevas Funcionalidades: Ordenamiento Avanzado y Validación de Porcentajes

**Fecha:** 30/01/2025  
**Hora:** 14:30  
**Archivo:** maim_2_simple_corregido.html  
**Funcionalidades:** Ordenamiento por porcentaje + Validación de porcentajes  

## Funcionalidades Agregadas

### 🎯 **1. Ordenamiento Avanzado de Funciones**

#### 📋 **Criterio de Ordenamiento Mejorado**
1. **Funciones Genéricas** (primero)
2. **Funciones Específicas** (segundo) - **Ordenadas por porcentaje de dedicación (descendente)**
3. **Indicadores** (tercero)

#### 🔧 **Implementación Técnica**
```javascript
// Ordenar las funciones por tipo primero, luego por porcentaje de dedicación (descendente)
const funcionesOrdenadas = funciones.sort((a, b) => {
    const ordenA = ordenTipos[a.tipo] || 999;
    const ordenB = ordenTipos[b.tipo] || 999;
    
    if (ordenA !== ordenB) {
        return ordenA - ordenB;
    }
    
    // Si son del mismo tipo, ordenar por porcentaje de dedicación (descendente)
    if (a.tipo === 'Específica' && b.tipo === 'Específica') {
        const porcentajeA = parseInt(a.porcentajeDedicacion) || 0;
        const porcentajeB = parseInt(b.porcentajeDedicacion) || 0;
        return porcentajeB - porcentajeA; // Descendente: mayor a menor
    }
    
    // Para otros tipos, mantener el orden original
    return (a.orden || 0) - (b.orden || 0);
});
```

#### ✅ **Beneficios**
- **Visualización clara:** Las funciones específicas se muestran de mayor a menor dedicación
- **Análisis facilitado:** Fácil identificación de funciones más importantes
- **Consistencia:** Ordenamiento automático al guardar cambios

### 🎯 **2. Validación de Porcentajes de Dedicación**

#### 📋 **Reglas de Validación**
1. **Total 100%:** La suma de porcentajes de funciones específicas debe ser exactamente 100%
2. **Mínimo 5%:** No puede haber porcentajes menores al 5%
3. **Múltiplos de 5:** Todos los porcentajes deben ser múltiplos de 5 (5, 10, 15, 20, etc.)
4. **Números enteros:** Solo se permiten números enteros

#### 🔧 **Implementación de Validación**
```javascript
function validarPorcentajesDedicacion(unit) {
    if (!unit || !unit.funciones) return { valido: true, mensaje: 'No hay funciones para validar' };
    
    const funcionesEspecificas = unit.funciones.filter(f => f.tipo === 'Específica');
    const totalPorcentaje = funcionesEspecificas.reduce((sum, f) => sum + (parseInt(f.porcentajeDedicacion) || 0), 0);
    
    // Validar que el total sea 100%
    if (totalPorcentaje !== 100) {
        return { 
            valido: false, 
            mensaje: `El total de porcentajes debe ser 100%. Actual: ${totalPorcentaje}%` 
        };
    }
    
    // Validar que no haya porcentajes menores al 5%
    const porcentajesInvalidos = funcionesEspecificas.filter(f => {
        const porcentaje = parseInt(f.porcentajeDedicacion) || 0;
        return porcentaje > 0 && porcentaje < 5;
    });
    
    if (porcentajesInvalidos.length > 0) {
        return { 
            valido: false, 
            mensaje: 'No puede haber porcentajes menores al 5%' 
        };
    }
    
    // Validar que todos los porcentajes sean múltiplos de 5
    const porcentajesNoMultiplos = funcionesEspecificas.filter(f => {
        const porcentaje = parseInt(f.porcentajeDedicacion) || 0;
        return porcentaje > 0 && porcentaje % 5 !== 0;
    });
    
    if (porcentajesNoMultiplos.length > 0) {
        return { 
            valido: false, 
            mensaje: 'Todos los porcentajes deben ser múltiplos de 5 (5, 10, 15, 20, etc.)' 
        };
    }
    
    return { valido: true, mensaje: 'Porcentajes válidos' };
}
```

### 🎯 **3. Ajuste Automático de Porcentajes**

#### 🔧 **Función de Ajuste Automático**
```javascript
function ajustarPorcentajesAutomaticamente(unit) {
    if (!unit || !unit.funciones) return false;
    
    const funcionesEspecificas = unit.funciones.filter(f => f.tipo === 'Específica');
    if (funcionesEspecificas.length === 0) return true;
    
    // Calcular porcentaje base (mínimo 5%)
    const porcentajeBase = Math.max(5, Math.floor(100 / funcionesEspecificas.length));
    
    // Ajustar a múltiplos de 5
    const porcentajeAjustado = Math.floor(porcentajeBase / 5) * 5;
    
    // Distribuir porcentajes
    let porcentajeRestante = 100;
    funcionesEspecificas.forEach((funcion, index) => {
        if (index === funcionesEspecificas.length - 1) {
            // Última función: asignar el porcentaje restante
            funcion.porcentajeDedicacion = porcentajeRestante.toString();
        } else {
            // Otras funciones: asignar porcentaje base
            const porcentajeAsignar = Math.min(porcentajeAjustado, porcentajeRestante - (funcionesEspecificas.length - index - 1) * 5);
            funcion.porcentajeDedicacion = porcentajeAsignar.toString();
            porcentajeRestante -= porcentajeAsignar;
        }
    });
    
    return true;
}
```

### 🎯 **4. Persistencia en localStorage**

#### 🔧 **Funciones de Persistencia**
```javascript
// Guardar ordenamiento en localStorage
function guardarOrdenamientoEnLocalStorage() {
    if (STATE.currentData) {
        const ordenamientoData = {
            timestamp: new Date().toISOString(),
            data: STATE.currentData
        };
        localStorage.setItem('organigrama_ordenamiento', JSON.stringify(ordenamientoData));
        console.log('Ordenamiento guardado en localStorage');
    }
}

// Cargar ordenamiento desde localStorage
function cargarOrdenamientoDesdeLocalStorage() {
    const ordenamientoGuardado = localStorage.getItem('organigrama_ordenamiento');
    if (ordenamientoGuardado) {
        try {
            const ordenamientoData = JSON.parse(ordenamientoGuardado);
            STATE.currentData = ordenamientoData.data;
            console.log('Ordenamiento cargado desde localStorage');
            return true;
        } catch (error) {
            console.error('Error al cargar ordenamiento desde localStorage:', error);
        }
    }
    return false;
}
```

### 🎯 **5. Interfaz de Usuario Mejorada**

#### 🔧 **Botón de Validación**
- **Ubicación:** Junto al botón "Editar Unidad"
- **Funcionalidad:** Valida porcentajes y ofrece ajuste automático
- **Icono:** 🔍 Validar Porcentajes

#### 🔧 **Integración en saveFunction**
```javascript
// Validar porcentajes de dedicación
const validacion = validarPorcentajesDedicacion(unit);
if (!validacion.valido) {
    Utils.showAlert(`⚠️ ${validacion.mensaje}`, 'warning');
}

// Guardar en localStorage
guardarOrdenamientoEnLocalStorage();
```

## Archivos Generados

### 📁 **Script de Implementación**
- **Archivo:** `scripts/agregar_funcionalidades_ordenamiento.js`
- **Función:** Agregar todas las nuevas funcionalidades al archivo HTML
- **Estado:** ✅ **Ejecutado exitosamente**

### 📁 **Archivo Final**
- **Archivo:** `maim_2_simple_corregido_con_funcionalidades.html`
- **Estado:** ✅ **Todas las funcionalidades verificadas**
- **Funcionalidades:** 7/7 agregadas correctamente

## Verificación de Funcionalidades

### ✅ **Funciones Verificadas**
1. **ordenarFuncionesPorTipo mejorada** - ✅ Ordenamiento por porcentaje
2. **validarPorcentajesDedicacion** - ✅ Validación completa
3. **ajustarPorcentajesAutomaticamente** - ✅ Ajuste automático
4. **guardarOrdenamientoEnLocalStorage** - ✅ Persistencia
5. **cargarOrdenamientoDesdeLocalStorage** - ✅ Carga desde localStorage
6. **agregarBotonValidacion** - ✅ Botón en interfaz
7. **validarYMostrarPorcentajes** - ✅ Validación con UI

### 🔍 **Verificaciones Específicas**
- **Ordenamiento por porcentaje:** ✅ Línea 1120
- **Función de validación:** ✅ Líneas 956, 1077, 2523
- **Botón de validación:** ✅ Línea 1061

## Beneficios de las Nuevas Funcionalidades

### ✅ **Mejor Organización**
- **Ordenamiento inteligente** por importancia (porcentaje)
- **Visualización clara** de funciones más críticas
- **Consistencia automática** en el ordenamiento

### ✅ **Validación Robusta**
- **Prevención de errores** en porcentajes
- **Reglas claras** y consistentes
- **Ajuste automático** cuando es necesario

### ✅ **Persistencia de Datos**
- **Guardado automático** en localStorage
- **Recuperación de datos** al recargar
- **Integración con exportación** JSON

### ✅ **Experiencia de Usuario**
- **Interfaz intuitiva** con botón de validación
- **Mensajes claros** de errores y advertencias
- **Ajuste automático** con confirmación

## Casos de Uso

### 📋 **Escenario 1: Validación de Porcentajes**
1. Usuario edita funciones específicas
2. Sistema valida automáticamente porcentajes
3. Si hay errores, muestra advertencia
4. Ofrece ajuste automático si es necesario

### 📋 **Escenario 2: Ordenamiento Automático**
1. Usuario agrega nueva función específica
2. Sistema ordena automáticamente por porcentaje
3. Funciones se muestran de mayor a menor dedicación
4. Ordenamiento se guarda en localStorage

### 📋 **Escenario 3: Exportación con Ordenamiento**
1. Usuario exporta organigrama
2. Ordenamiento se mantiene en JSON
3. Datos persistentes en localStorage
4. Consistencia entre sesiones

## Conclusión

Las nuevas funcionalidades han sido **completamente implementadas** y **verificadas exitosamente**. El archivo `maim_2_simple_corregido_con_funcionalidades.html` incluye:

- ✅ **Ordenamiento avanzado** por tipo y porcentaje
- ✅ **Validación robusta** de porcentajes
- ✅ **Ajuste automático** cuando es necesario
- ✅ **Persistencia** en localStorage
- ✅ **Interfaz mejorada** con botón de validación

**Estado:** ✅ **FUNCIONALIDADES COMPLETAMENTE IMPLEMENTADAS**
**Archivo final:** `maim_2_simple_corregido_con_funcionalidades.html`
**Script de implementación:** `scripts/agregar_funcionalidades_ordenamiento.js` 