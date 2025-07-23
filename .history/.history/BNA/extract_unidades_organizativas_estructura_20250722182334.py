import json
import re
import subprocess

# Extract text from page 7 onwards
subprocess.run(["pdftotext", "-f", "7", "BNA - Misiones y Funciones.pdf", "unidades_organizativas_p7.txt"])

with open('unidades_organizativas_p7.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Split by 'Unidad Organizativa' (with possible leading spaces)
blocks = re.split(r'\n\s*Unidad Organizativa', text)

unidades = []

for block in blocks[1:]:
    unidad = {}
    lines = [l.strip() for l in block.strip().split('\n') if l.strip()]
    
    # Nombre
    nombre = lines[0] if lines else ''
    unidad['unidad_organizativa'] = nombre

    # Jerarquía, nivel, fecha
    jerarquia = ''
    nivel_reporte = ''
    fecha_aprobacion = ''
    for l in lines[:10]:
        if 'jerarqu' in l.lower():
            jerarquia = l
        if 'nivel' in l.lower():
            nivel_reporte = re.sub(r'[^0-9]', '', l)
        if 'aprobacion' in l.lower() or 'aprobación' in l.lower():
            fecha_aprobacion = re.sub(r'[^0-9/]', '', l)
    unidad['jerarquia_implicita'] = jerarquia
    unidad['nivel_reporte'] = nivel_reporte
    unidad['fecha_aprobacion'] = fecha_aprobacion

    # Misión (buscar línea que empiece con 'Misión' y unir líneas siguientes hasta sección)
    mision = ''
    for i, l in enumerate(lines):
        if l.lower().startswith('mision'):
            mision_lines = []
            for ml in lines[i+1:]:
                if re.search(r'funciones|producto|jerarqu|nivel|aprobacion', ml.lower()):
                    break
                mision_lines.append(ml)
            mision = ' '.join(mision_lines).strip()
            break
    unidad['mision'] = mision

    # Funciones Genéricas
    funciones_genericas = []
    if 'Funciones Genéricas' in block:
        gen_lines = block.split('Funciones Genéricas',1)[1].split('\n')
        current_func = []
        for l in gen_lines[1:]:
            l = l.strip()
            if not l or 'funciones específicas' in l.lower():
                break
            # Detect product final (right column)
            if re.match(r'^[A-ZÁÉÍÓÚÑ][A-Za-zÁÉÍÓÚÑ/ ]{2,}$', l) and len(l) < 50:
                # Save previous function if exists
                if current_func:
                    funciones_genericas.append({
                        'descripcion': ' '.join(current_func).strip(),
                        'producto_final': l
                    })
                    current_func = []
            else:
                current_func.append(l)
        # If any function left without product_final
        if current_func:
            funciones_genericas.append({
                'descripcion': ' '.join(current_func).strip(),
                'producto_final': ''
            })
    unidad['funciones_genericas'] = funciones_genericas

    # Funciones Específicas
    funciones_especificas = []
    if 'Funciones Específicas' in block:
        esp_lines = block.split('Funciones Específicas',1)[1].split('\n')
        current_func = []
        current_producto = ''
        current_pct = ''
        for l in esp_lines[1:]:
            l = l.strip()
            if not l or re.search(r'unidad organizativa|mision|jerarqu|nivel|aprobacion', l.lower()):
                break
            # Detect % dedicación
            pct_match = re.match(r'^(\d{1,3})$', l)
            if pct_match:
                current_pct = int(pct_match.group(1))
                continue
            # Detect product final (right column)
            if re.match(r'^[A-ZÁÉÍÓÚÑ][A-Za-zÁÉÍÓÚÑ/ ]{2,}$', l) and len(l) < 50:
                current_producto = l
                continue
            # If line is a function description
            if l:
                current_func.append(l)
            # If we have description, product and pct, save
            if current_func and current_producto and current_pct:
                funciones_especificas.append({
                    'descripcion': ' '.join(current_func).strip(),
                    'producto_final': current_producto,
                    'porcentaje_dedicacion': current_pct
                })
                current_func = []
                current_producto = ''
                current_pct = ''
        # If any function left without product_final or pct
        if current_func:
            funciones_especificas.append({
                'descripcion': ' '.join(current_func).strip(),
                'producto_final': current_producto,
                'porcentaje_dedicacion': current_pct
            })
    unidad['funciones_especificas'] = funciones_especificas

    unidades.append(unidad)

with open('unidades_organizativas_estructura.json', 'w', encoding='utf-8') as f:
    json.dump(unidades, f, ensure_ascii=False, indent=2)

print(f'Archivo generado: unidades_organizativas_estructura.json') 