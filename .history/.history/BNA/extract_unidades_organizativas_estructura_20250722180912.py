import json
import re

# Extract text from page 7 onwards
import subprocess
subprocess.run(["pdftotext", "-f", "7", "BNA - Misiones y Funciones.pdf", "unidades_organizativas_p7.txt"])

with open('unidades_organizativas_p7.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Split by 'Unidad Organizativa' (with possible leading spaces)
blocks = re.split(r'\n\s*Unidad Organizativa', text)

unidades = []

for block in blocks[1:]:  # skip the first block (before first unit)
    unidad = {}
    lines = block.strip().split('\n')
    nombre = next((l.strip() for l in lines if l.strip()), None)
    unidad['unidad_organizativa'] = nombre

    # Jerarquía, nivel, fecha
    jerarquia = ''
    nivel_reporte = ''
    fecha_aprobacion = ''
    for l in lines:
        if 'jerarqu' in l.lower():
            jerarquia = l.strip()
        if 'nivel' in l.lower():
            nivel_reporte = re.sub(r'[^0-9]', '', l)
        if 'aprobacion' in l.lower() or 'aprobación' in l.lower():
            fecha_aprobacion = re.sub(r'[^0-9/]', '', l)
    unidad['jerarquia_implicita'] = jerarquia
    unidad['nivel_reporte'] = nivel_reporte
    unidad['fecha_aprobacion'] = fecha_aprobacion

    # Misión
    mision = None
    for i, l in enumerate(lines):
        if l.strip().lower().startswith('mision'):
            # Tomar líneas siguientes hasta encontrar una línea vacía o sección
            mision_lines = []
            for ml in lines[i+1:]:
                if not ml.strip() or 'funcion' in ml.lower() or 'producto' in ml.lower():
                    break
                mision_lines.append(ml.strip())
            mision = ' '.join(mision_lines).strip()
            break
    unidad['mision'] = mision

    # Funciones genéricas
    funciones_genericas = []
    if 'Funciones Genéricas' in block:
        gen_start = block.index('Funciones Genéricas')
        gen_block = block[gen_start:]
        # Stop at next section or end
        gen_lines = gen_block.split('\n')
        for l in gen_lines[1:]:
            if 'funcion' in l.lower() and 'especifica' in l.lower():
                break
            if 'producto' in l.lower() or '%' in l or not l.strip():
                continue
            funciones_genericas.append({'descripcion': l.strip(), 'producto_final': ''})
    unidad['funciones_genericas'] = funciones_genericas

    # Funciones específicas
    funciones_especificas = []
    if 'Funciones Específicas' in block:
        esp_start = block.index('Funciones Específicas')
        esp_block = block[esp_start:]
        esp_lines = esp_block.split('\n')
        for l in esp_lines[1:]:
            if 'producto' in l.lower() or '%' in l or not l.strip():
                continue
            if 'unidad organizativa' in l.lower() or 'mision' in l.lower() or 'jerarqu' in l.lower():
                break
            funciones_especificas.append({'descripcion': l.strip(), 'producto_final': '', 'porcentaje_dedicacion': ''})
    unidad['funciones_especificas'] = funciones_especificas

    unidades.append(unidad)

with open('unidades_organizativas_estructura.json', 'w', encoding='utf-8') as f:
    json.dump(unidades, f, ensure_ascii=False, indent=2)

print(f'Archivo generado: unidades_organizativas_estructura.json') 