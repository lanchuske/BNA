# Problema de Diseño: Sección de Indicadores

## Fecha: 28/01/2025

## Problema Identificado

La sección "Indicadores sugeridos para seguimiento (KPI's)" no se está renderizando en la interfaz porque solo aparece cuando ya existen indicadores en la unidad. Esto crea un problema de diseño: **no hay forma de agregar el primer indicador**.

### Análisis del Problema

1. **Renderizado condicional**: La sección de indicadores solo se renderiza si `indicadores.length > 0`
2. **Botones disponibles**: Solo hay 2 botones de agregar:
   - `window.addFuncRow('gen')` - Funciones genéricas
   - `window.addFuncRow('espec')` - Funciones específicas
3. **Falta botón para indicadores**: No hay botón `window.addFuncRow('indicador')` visible
4. **Ciclo sin salida**: No se puede agregar indicadores porque no hay botón, y no hay botón porque no hay indicadores

### Estado Actual

- **Total de unidades**: 42
- **Unidades con indicadores**: 13
- **Unidades sin indicadores**: 29
- **Función addFuncRow**: Funciona correctamente para indicadores
- **Problema**: No hay botón visible para agregar indicadores

### Solución Temporal

1. **Usar JavaScript directo**: Llamar `window.addFuncRow('indicador')` directamente desde la consola
2. **Verificar guardado**: Confirmar que los indicadores se guarden correctamente
3. **Continuar carga**: Agregar indicadores para las 29 unidades restantes
4. **Exportar datos**: Generar CSV con todos los indicadores

### Próximos Pasos

1. Agregar indicadores usando JavaScript directo
2. Verificar que se guarden correctamente en localStorage
3. Confirmar que la sección de indicadores aparezca después del primer indicador
4. Continuar con la carga sistemática de indicadores
5. Exportar datos actualizados

### Notas Técnicas

- La función `addFuncRow('indicador')` está correctamente implementada
- El problema es de diseño de UI, no de funcionalidad
- Los indicadores se agregan como registros con `'Tipo de Función': 'Indicador'`
- Una vez que hay al menos un indicador, la sección se renderiza correctamente