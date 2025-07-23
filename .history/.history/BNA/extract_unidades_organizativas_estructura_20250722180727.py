import json
import re

with open('unidades_organizativas_completo.json', 'r', encoding='utf-8') as f:
    unidades = json.load(f)

restructured = []

for u in unidades:
    # Extract fields with fallback to empty string
    nombre = u.get('nombre', '')
    mision = u.get('mision', '')
    funciones = u.get('funciones', [])
    productos = u.get('productos', [])
    porcentajes = u.get('porcentajes', [])

    # Try to extract jerarquía, nivel, fecha (if present in nombre or funciones)
    jerarquia = ''
    nivel_reporte = ''
    fecha_aprobacion = ''
    for line in [nombre] + funciones:
        if 'jerarqu' in line.lower():
            jerarquia = line
        if 'nivel' in line.lower():
            nivel_reporte = re.sub(r'[^0-9]', '', line)
        if 'aprobacion' in line.lower() or 'aprobación' in line.lower():
            fecha_aprobacion = re.sub(r'[^0-9/]', '', line)

    # Split funciones into genericas and especificas by heuristics
    funciones_genericas = []
    funciones_especificas = []
    for i, desc in enumerate(funciones):
        # Heuristic: if porcentaje exists for this index, it's especifica
        if i < len(porcentajes):
            funciones_especificas.append({
                'descripcion': desc,
                'producto_final': productos[i] if i < len(productos) else '',
                'porcentaje_dedicacion': porcentajes[i]
            })
        else:
            funciones_genericas.append({
                'descripcion': desc,
                'producto_final': productos[i] if i < len(productos) else ''
            })

    restructured.append({
        'unidad_organizativa': nombre,
        'jerarquia_implicita': jerarquia,
        'nivel_reporte': nivel_reporte,
        'fecha_aprobacion': fecha_aprobacion,
        'mision': mision,
        'funciones_genericas': funciones_genericas,
        'funciones_especificas': funciones_especificas
    })

with open('unidades_organizativas_estructura.json', 'w', encoding='utf-8') as f:
    json.dump(restructured, f, ensure_ascii=False, indent=2)

print(f'Archivo generado: unidades_organizativas_estructura.json') 