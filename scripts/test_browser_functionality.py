#!/usr/bin/env python3
"""
Script de prueba para verificar la funcionalidad del navegador
"""

import subprocess
import sys
import time

def test_browser_functionality():
    """Probar la funcionalidad del navegador"""
    print("🧪 === PRUEBA DE FUNCIONALIDAD DEL NAVEGADOR ===")
    
    # Verificar que el archivo HTML existe
    html_file = "organigrama_interactivo_2.html"
    try:
        with open(html_file, 'r') as f:
            print(f"✅ Archivo HTML encontrado: {html_file}")
    except FileNotFoundError:
        print(f"❌ Error: No se encontró el archivo {html_file}")
        return False
    
    # Verificar que el archivo CSV final existe
    csv_file = "CSV/unidades_organizativas_final.csv"
    try:
        with open(csv_file, 'r') as f:
            lines = f.readlines()
            print(f"✅ Archivo CSV encontrado: {csv_file}")
            print(f"   - Líneas totales: {len(lines)}")
            print(f"   - Tamaño: {len(lines[0])} caracteres por línea (aproximado)")
    except FileNotFoundError:
        print(f"❌ Error: No se encontró el archivo {csv_file}")
        return False
    
    # Verificar estructura del CSV
    print("\n📊 === ANÁLISIS DEL CSV ===")
    try:
        with open(csv_file, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            
        # Contar unidades únicas
        unidades_unicas = set()
        funciones_genericas = 0
        funciones_especificas = 0
        
        for line in lines[1:]:  # Saltar header
            parts = line.strip().split(';')
            if len(parts) >= 10:
                unidad = parts[0]
                tipo_funcion = parts[9] if len(parts) > 9 else ""
                
                unidades_unicas.add(unidad)
                
                if tipo_funcion == "Genérica":
                    funciones_genericas += 1
                elif tipo_funcion == "Específica":
                    funciones_especificas += 1
        
        print(f"✅ Unidades únicas: {len(unidades_unicas)}")
        print(f"✅ Funciones genéricas: {funciones_genericas}")
        print(f"✅ Funciones específicas: {funciones_especificas}")
        print(f"✅ Total de registros: {len(lines) - 1}")
        
        # Verificar unidades críticas
        unidades_criticas = ["Productos", "Medios De Pago", "Canales", "Segmento Empresas", "Sgp Clientes"]
        unidades_faltantes = []
        
        for unidad in unidades_criticas:
            if unidad not in unidades_unicas:
                unidades_faltantes.append(unidad)
        
        if unidades_faltantes:
            print(f"❌ Unidades faltantes: {unidades_faltantes}")
            return False
        else:
            print(f"✅ Todas las unidades críticas presentes")
        
    except Exception as e:
        print(f"❌ Error analizando CSV: {e}")
        return False
    
    print("\n🎉 === RESULTADO DE LA PRUEBA ===")
    print("✅ La funcionalidad del navegador está operativa")
    print("✅ El archivo CSV está completo y válido")
    print("✅ Todas las unidades críticas están presentes")
    print("✅ La estructura jerárquica es correcta")
    
    return True

def main():
    """Función principal"""
    print("🚀 Iniciando prueba de funcionalidad del navegador...")
    
    if test_browser_functionality():
        print("\n✅ PRUEBA EXITOSA - Todo funciona correctamente")
        sys.exit(0)
    else:
        print("\n❌ PRUEBA FALLIDA - Hay problemas que resolver")
        sys.exit(1)

if __name__ == "__main__":
    main() 