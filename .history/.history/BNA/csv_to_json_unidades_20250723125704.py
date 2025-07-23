import csv
import json

input_file = 'Diseño_Organizativo_Propuesto_BNA.csv'
output_file = 'unidades_organizativas.json'

with open(input_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f, delimiter=';')
    data = [row for row in reader]

with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f'Archivo generado: {output_file}') 