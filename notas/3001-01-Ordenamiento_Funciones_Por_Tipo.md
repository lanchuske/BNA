# 3001-01 - Ordenamiento de Funciones por Tipo

**Fecha:** 30/01/2025  
**Hora:** 14:06  
**Archivo:** organigrama_bna_2025-07-30-4.json  

## Objetivo
Reordenar las funciones dentro de cada unidad del organigrama según el criterio:
1. **Funciones Genéricas** (primero)
2. **Funciones Específicas** (segundo)
3. **Indicadores** (tercero)

## Proceso Realizado

### 1. Análisis del Archivo Original
- **Archivo de entrada:** `organigrama_bna_2025-07-30-4.json`
- **Total de unidades:** 41
- **Total de funciones:** 834
  - Funciones Genéricas: 213
  - Funciones Específicas: 276
  - Indicadores: 345

### 2. Desarrollo del Script
Se creó el script `scripts/ordenar_funciones_por_tipo.js` con las siguientes funcionalidades:

#### Funciones Principales:
- `ordenarFuncionesPorTipo()`: Ordena las funciones por tipo y renumeración
- `procesarArbol()`: Procesa recursivamente todo el árbol de unidades
- `ordenarFuncionesEnOrganigrama()`: Función principal de procesamiento
- `contarFuncionesPorTipo()`: Genera estadísticas de funciones por tipo

#### Lógica de Ordenamiento:
```javascript
const ordenTipos = {
    'Genérica': 1,
    'Específica': 2,
    'Indicador': 3
};
```

### 3. Ejecución del Script
```bash
node scripts/ordenar_funciones_por_tipo.js organigrama_bna_2025-07-30-4.json organigrama_bna_2025-07-30-4_ordenado.json
```

### 4. Resultados
- **Archivo de salida:** `organigrama_bna_2025-07-30-4_ordenado.json`
- **Procesamiento exitoso:** ✅
- **Funciones procesadas:** 834 funciones en 41 unidades

### 5. Verificación del Ordenamiento
Se confirmó que las funciones están correctamente ordenadas:

#### Ejemplo de ordenamiento en "Segmento Personas":
1. **Funciones Genéricas** (orden 1-6)
   - Definir y liderar la ejecución de la estrategia
   - Diseñar, implementar y coordinar la estrategia
   - Definición de Políticas y Directrices
   - Planificación Estratégica y Presupuestaria
   - Evaluar los recursos del área
   - Transformación y mejora continua

2. **Funciones Específicas** (orden 1-5)
   - Definir e implementar la propuesta de valor
   - Ejecutar y coordinar el desarrollo del plan de negocios
   - Supervisar ejecución de las áreas bajo su órbita
   - Proponer mejoras en la oferta de valor
   - Monitorear resultados comerciales

3. **Indicadores** (orden 1-7)
   - Penetración de productos por subsegmento
   - Vinculación promedio
   - Rentabilidad por subsegmento
   - NPS y relative NPS del segmento
   - Tasa de migración entre perfiles
   - % digitalización y uso de canales digitales
   - Tasa de abandono y recuperación

## Mejoras Implementadas

### 1. Renumeración Automática
- Las funciones mantienen su orden original dentro de cada tipo
- Se renumeran automáticamente los campos `orden` para cada tipo

### 2. Actualización de Metadata
- Se actualizó `lastModified` con la fecha de procesamiento
- Se agregó nota en `metadata.notes` sobre el reordenamiento

### 3. Estadísticas Generadas
```
📊 Estadísticas de funciones por tipo:
  Genérica: 213
  Específica: 276
  Indicador: 345
```

## Beneficios del Ordenamiento

1. **Consistencia:** Todas las unidades siguen el mismo patrón de ordenamiento
2. **Legibilidad:** Facilita la lectura y comprensión de las funciones
3. **Mantenimiento:** Estructura más clara para futuras actualizaciones
4. **Análisis:** Permite análisis más eficientes por tipo de función

## Archivos Generados

- `organigrama_bna_2025-07-30-4_ordenado.json`: Archivo principal con funciones ordenadas
- `scripts/ordenar_funciones_por_tipo.js`: Script reutilizable para futuros ordenamientos

## Notas Técnicas

- El script preserva toda la información original
- Mantiene la estructura jerárquica intacta
- Conserva campos adicionales como `versionAnterior`, `jerarquia`, `nivelReporte`
- Es compatible con el formato JSON existente

## Próximos Pasos

1. Validar el archivo ordenado en la aplicación web
2. Verificar que no se hayan perdido datos durante el proceso
3. Considerar aplicar este ordenamiento a futuras versiones del organigrama 