#!/usr/bin/env python3
"""
Script para revertir la estructura jerárquica y mantener las unidades
Productos, Medios De Pago y Canales directamente bajo Sgp Clientes
"""

import csv
import sys

def leer_csv(archivo):
    """Leer el CSV y retornar los datos"""
    datos = []
    with open(archivo, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f, delimiter=';')
        for row in reader:
            datos.append(row)
    return datos

def revertir_estructura_jerarquica(datos):
    """Revertir la estructura jerárquica moviendo unidades de vuelta a Sgp Clientes"""
    print("=== REVIRTIENDO ESTRUCTURA JERÁRQUICA ===")
    
    # Unidades que deberían reportar directamente a Sgp Clientes
    unidades_que_deberian_estar_en_sgp_clientes = [
        'Productos',
        'Medios De Pago', 
        'Canales'
    ]
    
    datos_corregidos = []
    cambios_realizados = 0
    
    for row in datos:
        row_corregido = row.copy()
        unidad = row['Unidad Organizativa']
        padre_actual = row['Reporta A']
        
        # Si la unidad debería estar bajo Sgp Clientes y actualmente reporta a Segmento Empresas
        if unidad in unidades_que_deberian_estar_en_sgp_clientes and padre_actual == 'Segmento Empresas':
            row_corregido['Reporta A'] = 'Sgp Clientes'
            print(f"🔄 Movido: '{unidad}' ahora reporta a 'Sgp Clientes' (antes reportaba a 'Segmento Empresas')")
            cambios_realizados += 1
        
        datos_corregidos.append(row_corregido)
    
    print(f"✅ Cambios realizados: {cambios_realizados}")
    return datos_corregidos

def validar_estructura_corregida(datos):
    """Validar que la estructura corregida sea válida"""
    print("\n=== VALIDACIÓN DE ESTRUCTURA ===")
    
    # Verificar que todas las referencias a padres sean válidas
    unidades_existentes = {row['Unidad Organizativa'] for row in datos}
    referencias_invalidas = []
    
    for row in datos:
        padre = row['Reporta A']
        if padre and padre not in unidades_existentes:
            referencias_invalidas.append((row['Unidad Organizativa'], padre))
    
    if referencias_invalidas:
        print("❌ Aún hay referencias inválidas:")
        for unidad, padre in referencias_invalidas:
            print(f"   - '{unidad}' reporta a '{padre}' (inexistente)")
    else:
        print("✅ Todas las referencias a padres son válidas")
    
    # Verificar la estructura jerárquica específica
    unidades_bajo_sgp_clientes = []
    for row in datos:
        if row['Reporta A'] == 'Sgp Clientes':
            unidades_bajo_sgp_clientes.append(row['Unidad Organizativa'])
    
    print(f"✅ Unidades bajo 'Sgp Clientes': {unidades_bajo_sgp_clientes}")
    
    return len(referencias_invalidas) == 0

def escribir_csv_corregido(datos, archivo_salida):
    """Escribir el CSV corregido"""
    if not datos:
        print("❌ No hay datos para escribir")
        return
    
    campos = datos[0].keys()
    
    with open(archivo_salida, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=campos, delimiter=';')
        writer.writeheader()
        writer.writerows(datos)
    
    print(f"✅ CSV corregido guardado en: {archivo_salida}")

def main():
    archivo_entrada = "CSV/unidades_organizativas_estructura_corregida.csv"
    archivo_salida = "CSV/unidades_organizativas_final.csv"
    
    try:
        # Leer datos
        print("📖 Leyendo archivo CSV...")
        datos = leer_csv(archivo_entrada)
        print(f"✅ Leídos {len(datos)} registros")
        
        # Revertir estructura jerárquica
        datos_corregidos = revertir_estructura_jerarquica(datos)
        
        # Validar estructura corregida
        if validar_estructura_corregida(datos_corregidos):
            # Escribir archivo corregido
            escribir_csv_corregido(datos_corregidos, archivo_salida)
            print("\n🎉 Reversión de estructura jerárquica completada exitosamente!")
        else:
            print("\n❌ La reversión no fue exitosa")
            sys.exit(1)
            
    except FileNotFoundError:
        print(f"❌ No se encontró el archivo: {archivo_entrada}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 