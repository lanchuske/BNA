#!/usr/bin/env python3
import csv
import json
import re
from collections import defaultdict

def leer_csv(csv_file):
    """Lee el CSV y retorna los datos organizados por unidad"""
    unidades_data = defaultdict(list)
    
    with open(csv_file, 'r', encoding='utf-8-sig') as file:
        reader = csv.DictReader(file, delimiter=';')
        for row in reader:
            unidad = row['Unidad Organizativa'].strip()
            if unidad:
                unidades_data[unidad].append(row)
    
    return unidades_data

def extraer_json_del_html(html_file):
    """Extrae el JSON embebido del HTML"""
    with open(html_file, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Buscar el patrón del JSON
    pattern = r'const unidades = (\[[\s\S]*?\]);'
    match = re.search(pattern, content)
    
    if match:
        json_str = match.group(1)
        return json.loads(json_str)
    else:
        raise ValueError("No se encontró el JSON en el HTML")

def validar_integridad(csv_data, html_data):
    """Valida la integridad entre CSV y HTML"""
    
    # Organizar datos del HTML por unidad
    html_unidades = defaultdict(list)
    for item in html_data:
        unidad = item.get('Unidad Organizativa', '').strip()
        if unidad:
            html_unidades[unidad].append(item)
    
    print("=== VALIDACIÓN COMPLETA DE INTEGRIDAD ===")
    print(f"Unidades en CSV: {len(csv_data)}")
    print(f"Unidades en HTML: {len(html_unidades)}")
    print()
    
    # Verificar unidades faltantes
    csv_unidades = set(csv_data.keys())
    html_unidades_set = set(html_unidades.keys())
    
    faltantes_en_html = csv_unidades - html_unidades_set
    faltantes_en_csv = html_unidades_set - csv_unidades
    
    if faltantes_en_html:
        print(f"❌ UNIDADES FALTANTES EN HTML ({len(faltantes_en_html)}):")
        for unidad in sorted(faltantes_en_html):
            print(f"   - {unidad}")
        print()
    
    if faltantes_en_csv:
        print(f"❌ UNIDADES FALTANTES EN CSV ({len(faltantes_en_csv)}):")
        for unidad in sorted(faltantes_en_csv):
            print(f"   - {unidad}")
        print()
    
    # Validar datos de cada unidad
    errores = []
    unidades_validadas = 0
    
    for unidad in sorted(csv_unidades & html_unidades_set):
        print(f"🔍 Validando: {unidad}")
        
        csv_items = csv_data[unidad]
        html_items = html_unidades[unidad]
        
        # Verificar cantidad de registros
        if len(csv_items) != len(html_items):
            error = f"  ❌ Cantidad de registros diferente: CSV={len(csv_items)}, HTML={len(html_items)}"
            errores.append(error)
            print(error)
            continue
        
        # Validar cada registro
        csv_sorted = sorted(csv_items, key=lambda x: (x['Tipo de Función'], x['Descripción']))
        html_sorted = sorted(html_items, key=lambda x: (x['Tipo de Función'], x['Descripción']))
        
        for i, (csv_item, html_item) in enumerate(zip(csv_sorted, html_sorted)):
            # Campos a validar
            campos = ['Misión', 'Tipo de Función', 'Descripción', 'Producto Final', 'Porcentaje Dedicación']
            
            for campo in campos:
                csv_valor = csv_item.get(campo, '').strip()
                html_valor = html_item.get(campo, '').strip()
                
                if csv_valor != html_valor:
                    error = f"  ❌ Diferencia en {campo} (registro {i+1}):"
                    error += f"\n     CSV:  '{csv_valor}'"
                    error += f"\n     HTML: '{html_valor}'"
                    errores.append(error)
                    print(error)
        
        unidades_validadas += 1
        print(f"  ✅ {unidad} - {len(csv_items)} registros validados")
        print()
    
    # Resumen final
    print("=== RESUMEN DE VALIDACIÓN ===")
    print(f"✅ Unidades validadas correctamente: {unidades_validadas}")
    print(f"❌ Errores encontrados: {len(errores)}")
    
    if not errores and not faltantes_en_html and not faltantes_en_csv:
        print("🎉 ¡VALIDACIÓN EXITOSA! Todos los datos coinciden perfectamente.")
    else:
        print("⚠️  Se encontraron diferencias entre CSV y HTML.")
    
    return len(errores) == 0 and len(faltantes_en_html) == 0 and len(faltantes_en_csv) == 0

if __name__ == "__main__":
    try:
        # Leer datos
        print("Leyendo CSV...")
        csv_data = leer_csv("Compilado.csv")
        
        print("Extrayendo JSON del HTML...")
        html_data = extraer_json_del_html("unidades_organizativas_embebido.html")
        
        # Validar
        print("Iniciando validación...")
        print()
        es_valido = validar_integridad(csv_data, html_data)
        
        exit(0 if es_valido else 1)
        
    except Exception as e:
        print(f"❌ Error durante la validación: {e}")
        exit(1) 