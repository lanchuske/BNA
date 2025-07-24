# Navegación eficiente en organigrama_interactivo con MCP

Estas notas recogen las mejores prácticas aprendidas para interactuar con `organigrama_interactivo.html` mediante las herramientas MCP. Úsalas antes de cada nueva sesión de pruebas para ahorrar tiempo.

## 1. Carga de datos
- Antes de cualquier acción, asegúrate de que el CSV esté cargado y el árbol renderizado.
- Dos opciones disponibles:
  1. **Browse…**: selecciona el archivo desde el sistema.
  2. **Ruta + Cargar Archivo**: pega la ruta completa en `#filePath` y pulsa **Cargar Archivo**.  
     - Si la página corre en `file://`, anteponer `file://` automáticamente.

## 2. Alternar modo edición
- Pulsa **Entrar en modo edición** para mostrar botones **+ / ×** en todos los nodos.
- Al alternar el modo, el árbol se re-renderiza para reflejar los cambios.

## 3. Expansión de ramas
- Para expandir un nodo concreto: `.tree li:has(span:text('Nombre')) > .toggle`.
- Para expandir todo un sub-árbol (ej. *Gerencia General*):
  ```javascript
  const root = Array.from(document.querySelectorAll('.tree li'))
      .find(li => li.querySelector('span.node-content')?.textContent.trim() === 'Gerencia General');
  root.querySelector('.toggle').click();
  let again=true;
  while (again){
    again=false;
    root.querySelectorAll('.toggle').forEach(t=>{
      if(t.textContent.includes('[+]')){t.click();again=true;}
    });
  }
  ```

## 4. Selección de unidades
- Usa `browser_click_text` sobre el nombre del área: evita conflictos con los botones laterales.
- El nodo se identifica por `node.key`; esto garantiza resalte y panel de detalle correctos.

## 5. Estado persistente
- Los nodos expandidos se guardan en `localStorage.expandedNodes`; se restauran al recargar.
- Cambios en CSV se guardan automáticamente en `localStorage.csvData` cuando estás en modo edición.

## 6. Feedback y depuración
- Utiliza `mostrarAlerta()` para mensajes rápidos en UI.
- Toma capturas (`browser_screenshot`) tras acciones clave para validar el estado.

Mantén este archivo actualizado con nuevos aprendizajes que faciliten futuras pruebas. 