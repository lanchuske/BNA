# Organigrama Local (s1)

Este módulo permite cargar un archivo JSON de unidades organizativas, visualizarlo en el navegador y exportar el resultado a PDF con control total de estilos y formato.

## Requisitos
- Node.js >= 16

## Instalación
```bash
npm install
```

## Uso
1. Inicia el servidor local:
   ```bash
   node server.js
   ```
2. Abre tu navegador en [http://localhost:3000](http://localhost:3000)
3. Sube tu archivo JSON usando el formulario.
4. Visualiza el organigrama y usa el botón "Exportar a PDF" para generar el PDF profesional.

## Estructura
- `server.js`: Servidor Express, maneja carga de JSON y exportación a PDF.
- `views/index.ejs`: Plantilla principal para renderizado.
- `public/styles.css`: Estilos para pantalla e impresión.
- `uploads/`: Carpeta temporal para archivos subidos.

## Exportar a PDF
El botón "Exportar a PDF" genera un PDF usando Playwright, respetando todos los estilos de impresión definidos en el CSS.

---

Puedes personalizar la plantilla y los estilos según tus necesidades. 