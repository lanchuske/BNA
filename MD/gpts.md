


### Revisión y Mejora del Organigrama JSON


Para cada unidad:

1. **Misión**: Reformulá la misión para que sea clara, sintética y estratégica. Debe explicar qué hace la unidad, cómo lo hace y con qué impacto institucional.
  
2. **Funciones Genéricas y Específicas**:
   - Verificá que cada función tenga `descripcion` y `productoFinal`.
   - Si el producto final es genérico (ej. “Producto del área”, “Informe”), reemplazalo por algo concreto, medible y verificable.
   - Fusioná funciones redundantes o que tengan el mismo propósito. Redistribuí los porcentajes si aplica.
   - Asegurate de que las funciones específicas sumen 100%, en múltiplos de 5, sin decimales.

3. **Indicadores**:
   - Asegurate de que sean medibles y concretos. Reformulá los vagos o redundantes.
   - Si hay duplicación de indicadores, consolidalos.

4. **Campo `orden`**:
   - Verificá que sea numérico, secuencial y sin saltos dentro de cada grupo (genéricas, específicas, indicadores).


6. **Revisión de calidad y homogeneidad final**:
   - Verificá que todas las misiones tengan el mismo nivel de redacción: claras, institucionales y enfocadas en el impacto.
   - Unificá el estilo de redacción entre unidades, funciones e indicadores.
   - Validá que los productos finales sean concretos, verificables y alineados al propósito de la función.
   - Si no aplicás mejoras directamente, agregá esas oportunidades bajo el campo `mejorasSugeridas`.
