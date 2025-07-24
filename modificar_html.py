#!/usr/bin/env python3
import csv
import json

def leer_csv(csv_file):
    """Lee el CSV y retorna los datos como lista plana"""
    unidades_data = []
    
    with open(csv_file, 'r', encoding='utf-8-sig') as file:
        reader = csv.DictReader(file, delimiter=';')
        for row in reader:
            unidad = row['Unidad Organizativa'].strip()
            if unidad:
                unidades_data.append(row)
    
    return unidades_data

def generar_html_original(csv_data, output_file):
    """Genera el HTML con el diseño original del archivo embebido"""
    
    # Convertir datos a JSON
    json_data = json.dumps(csv_data, ensure_ascii=False, indent=2)
    
    html_content = f'''<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Unidades Organizativas BNA</title>
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
    <h1>Unidades Organizativas BNA</h1>
    <label for="unidad-select">Selecciona una Unidad Organizativa:</label>
    <select id="unidad-select">
        <option value="">-- Selecciona --</option>
    </select>

    <div id="unidad-content" class="section"></div>

    <script>
    // JSON embebido generado desde el CSV A_Corregido_Unificado.csv
    const unidades = {json_data};
    function getUnidad(u) {{
      return u['Unidad Organizativa'] || u['﻿Unidad Organizativa'] || '';
    }}
    const nombres = [];
    unidades.forEach(u => {{
      const nombre = getUnidad(u);
      if (nombre && !nombres.includes(nombre)) {{
        nombres.push(nombre);
      }}
    }});
    const select = document.getElementById('unidad-select');
    select.innerHTML = '<option value="">-- Selecciona --</option>';
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
</html>'''
    
    # Guardar archivo
    with open(output_file, 'w', encoding='utf-8') as file:
        file.write(html_content)
    
    print(f"✅ HTML modificado exitosamente: {output_file}")
    print(f"📊 Total de registros: {len(csv_data)}")
    print(f"📋 Unidades únicas: {len(set(item['Unidad Organizativa'] for item in csv_data))}")

if __name__ == "__main__":
    try:
        # Leer CSV
        print("📖 Leyendo CSV A_Corregido_Unificado.csv...")
        csv_data = leer_csv("A_Corregido_Unificado.csv")
        
        # Generar HTML con diseño original
        print("🔨 Generando HTML con diseño original...")
        generar_html_original(csv_data, "unidades_organizativas_completo.html")
        
        print("🎉 ¡Proceso completado exitosamente!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        exit(1) 