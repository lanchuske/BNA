import json
import csv

with open('unidades_organizativas_completo.json', 'r', encoding='utf-8') as f:
    unidades = json.load(f)

with open('unidades_organizativas_completo.csv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['nombre', 'mision', 'funciones', 'productos', 'porcentajes'])
    for u in unidades:
        writer.writerow([
            u.get('nombre', ''),
            u.get('mision', ''),
            '\n'.join(u.get('funciones', [])),
            ', '.join(u.get('productos', [])),
            ', '.join(str(p) for p in u.get('porcentajes', []))
        ]) 