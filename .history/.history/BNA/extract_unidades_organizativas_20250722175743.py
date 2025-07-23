import re
import json

# Read the full text
with open('unidades_organizativas.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Split by 'Unidad Organizativa' (with possible leading spaces)
blocks = re.split(r'\n\s*Unidad Organizativa', text)

unidades = []

for block in blocks[1:]:  # skip the first block (before first unit)
    unidad = {}
    # Try to extract the name (first non-empty line)
    lines = block.strip().split('\n')
    nombre = next((l.strip() for l in lines if l.strip()), None)
    unidad['nombre'] = nombre

    # Extract misión
    mision = None
    for i, l in enumerate(lines):
        if l.strip().lower().startswith('mision'):
            mision = ' '.join(lines[i+1:i+4]).strip()  # Take a few lines after
            break
    unidad['mision'] = mision

    # Extract funciones (look for 'Funciones Específicas' and grab lines until next section)
    funciones = []
    if 'Funciones Específicas' in block:
        func_lines = block.split('Funciones Específicas',1)[1].split('\n')
        for l in func_lines:
            l = l.strip()
            if not l or l.lower().startswith('producto') or l.lower().startswith('%') or l.lower().startswith('unidad'):
                continue
            if l.lower().startswith('mision') or l.lower().startswith('jerarqu'):
                break
            funciones.append(l)
    unidad['funciones'] = funciones

    # Extract productos finales and porcentajes (if present)
    productos = []
    porcentajes = []
    for l in lines:
        if re.match(r'^[A-Za-z ]+$', l.strip()) and len(l.strip()) < 40:
            productos.append(l.strip())
        if re.match(r'^\d{1,3}$', l.strip()):
            porcentajes.append(int(l.strip()))
    unidad['productos'] = productos
    unidad['porcentajes'] = porcentajes

    unidades.append(unidad)

# Write to JSON
with open('unidades_organizativas_completo.json', 'w', encoding='utf-8') as f:
    json.dump(unidades, f, ensure_ascii=False, indent=2)

print(f'Extraídas {len(unidades)} unidades organizativas.') 