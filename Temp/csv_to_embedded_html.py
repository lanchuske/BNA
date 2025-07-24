import csv
import json

csv_file = 'Diseño_Organizativo_Propuesto_BNA.csv'
html_file = 'unidades_organizativas_embebido.html'

# Leer CSV y convertir a lista de dicts
with open(csv_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f, delimiter=';')
    data = [row for row in reader]

# Generar el bloque JS
js_array = json.dumps(data, ensure_ascii=False, indent=2)

# Plantilla HTML (escapar llaves dobles para f-string)
html = f'''<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Unidades Organizativas BNA (Embebido)</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 2em; }}
        select {{ font-size: 1.1em; }}
        .section {{ margin-top: 2em; }}
        table {{ border-collapse: collapse; width: 100%; margin-top: 1em; }}
        th, td {{ border: 1px solid #ccc; padding: 0.5em; }}
        th {{ background: #e0eaf3; }}
        .title {{ font-size: 1.3em; font-weight: bold; margin-bottom: 0.5em; }}
        .subtitle {{ font-weight: bold; margin-top: 1em; }}
    </style>
</head>
<body>
    <h1>Unidades Organizativas BNA (Embebido)</h1>
    <label for="unidad-select">Selecciona una Unidad Organizativa:</label>
    <select id="unidad-select">
        <option value="">-- Selecciona --</option>
    </select>

    <div id="unidad-content" class="section"></div>

    <script>
    // JSON embebido generado desde el CSV
    const unidades = {js_array};
    function getUnidad(u) {{
      return u['Unidad Organizativa'] || '';
    }}
    const nombres = [];
    unidades.forEach(u => {{
      const nombre = getUnidad(u);
      if (nombre && !nombres.includes(nombre)) {{
        nombres.push(nombre);
      }}
    }});
    const select = document.getElementById('unidad-select');
    nombres.forEach(n => {{
        const opt = document.createElement('option');
        opt.value = n;
        opt.textContent = n;
        select.appendChild(opt);
    }});
    document.getElementById('unidad-select').addEventListener('change', function() {{
        const unidad = this.value;
        const content = document.getElementById('unidad-content');
        if (!unidad) {{ content.innerHTML = ''; return; }}
        const rows = unidades.filter(u => getUnidad(u) === unidad);
        if (!rows.length) {{ content.innerHTML = '<b>Unidad no encontrada</b>'; return; }}
        let html = '';
        html += `<div class='title'>${{unidad}}</div>`;
        html += `<div><b>Misión:</b> ${{rows[0]['Misión'] ? rows[0]['Misión'] : ''}}</div>`;
        const gen = rows.filter(r => r['Tipo de Función'] && r['Tipo de Función'].toLowerCase() === 'genérica');
        if (gen.length) {{
            html += `<div class='subtitle'>Funciones Genéricas</div><table><tr><th>Descripción</th><th>Producto Final</th></tr>`;
            gen.forEach(f => {{
                html += `<tr><td>${{f['Descripción']}}</td><td>${{f['Producto Final']}}</td></tr>`;
            }});
            html += '</table>';
        }}
        const esp = rows.filter(r => r['Tipo de Función'] && r['Tipo de Función'].toLowerCase() === 'específica');
        if (esp.length) {{
            html += `<div class='subtitle'>Funciones Específicas</div><table><tr><th>Descripción</th><th>Producto Final</th><th>% Dedicación</th></tr>`;
            esp.forEach(f => {{
                html += `<tr><td>${{f['Descripción']}}</td><td>${{f['Producto Final']}}</td><td>${{f['Porcentaje Dedicación']}}</td></tr>`;
            }});
            html += '</table>';
        }}
        content.innerHTML = html;
    }});
    </script>
</body>
</html>
'''

with open(html_file, 'w', encoding='utf-8') as f:
    f.write(html)

print(f'Archivo generado: {html_file}') 