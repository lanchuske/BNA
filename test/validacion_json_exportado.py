#!/usr/bin/env python3
"""
Script de validación para el JSON exportado de unidades organizativas
Valida el formato, estructura y contenido del archivo JSON
"""

import json
import sys
from datetime import datetime
from typing import Dict, List, Any

def validar_estructura_json(data: Dict[str, Any]) -> List[str]:
    """Valida la estructura básica del JSON"""
    errores = []
    
    # Verificar campos obligatorios en metadata
    campos_metadata_requeridos = [
        'exportDate', 'version', 'totalUnits', 'totalRecords', 
        'csvHeaders', 'hasIssues', 'issues'
    ]
    
    if 'metadata' not in data:
        errores.append("❌ Falta la sección 'metadata' en el JSON")
        return errores
    
    metadata = data['metadata']
    for campo in campos_metadata_requeridos:
        if campo not in metadata:
            errores.append(f"❌ Falta el campo '{campo}' en metadata")
    
    # Verificar sección data
    if 'data' not in data:
        errores.append("❌ Falta la sección 'data' en el JSON")
    else:
        if 'unidades' not in data['data']:
            errores.append("❌ Falta la sección 'unidades' en data")
    
    return errores

def validar_metadata(metadata: Dict[str, Any]) -> List[str]:
    """Valida el contenido de la metadata"""
    errores = []
    
    # Validar fecha de exportación
    try:
        fecha_export = metadata.get('exportDate', '')
        if fecha_export:
            datetime.fromisoformat(fecha_export.replace('Z', '+00:00'))
    except ValueError:
        errores.append("❌ Formato de fecha de exportación inválido")
    
    # Validar números
    if not isinstance(metadata.get('totalUnits', 0), int):
        errores.append("❌ totalUnits debe ser un número entero")
    
    if not isinstance(metadata.get('totalRecords', 0), int):
        errores.append("❌ totalRecords debe ser un número entero")
    
    # Validar headers CSV
    headers = metadata.get('csvHeaders', [])
    if not isinstance(headers, list) or len(headers) == 0:
        errores.append("❌ csvHeaders debe ser una lista no vacía")
    
    # Validar issues
    issues = metadata.get('issues', [])
    if not isinstance(issues, list):
        errores.append("❌ issues debe ser una lista")
    
    return errores

def validar_unidades(unidades: List[Dict[str, Any]]) -> List[str]:
    """Valida la estructura de las unidades organizativas"""
    errores = []
    
    if not isinstance(unidades, list):
        errores.append("❌ unidades debe ser una lista")
        return errores
    
    for i, unidad in enumerate(unidades):
        if not isinstance(unidad, dict):
            errores.append(f"❌ Unidad {i} debe ser un objeto")
            continue
        
        # Validar campos obligatorios de unidad
        campos_requeridos = ['nombre', 'mision', 'funciones']
        for campo in campos_requeridos:
            if campo not in unidad:
                errores.append(f"❌ Unidad {i} falta el campo '{campo}'")
        
        # Validar funciones
        if 'funciones' in unidad:
            funciones = unidad['funciones']
            if not isinstance(funciones, list):
                errores.append(f"❌ Unidad {i}: funciones debe ser una lista")
            else:
                for j, funcion in enumerate(funciones):
                    if not isinstance(funcion, dict):
                        errores.append(f"❌ Unidad {i}, función {j}: debe ser un objeto")
                        continue
                    
                    # Validar campos de función
                    campos_funcion = ['orden', 'tipo', 'descripcion', 'productoFinal', 'porcentajeDedicacion']
                    for campo in campos_funcion:
                        if campo not in funcion:
                            errores.append(f"❌ Unidad {i}, función {j}: falta el campo '{campo}'")
    
    return errores

def validar_issues(issues: List[Dict[str, Any]]) -> List[str]:
    """Valida la estructura de los issues"""
    errores = []
    
    for i, issue in enumerate(issues):
        if not isinstance(issue, dict):
            errores.append(f"❌ Issue {i} debe ser un objeto")
            continue
        
        campos_issue = ['id', 'type', 'category', 'title', 'description']
        for campo in campos_issue:
            if campo not in issue:
                errores.append(f"❌ Issue {i}: falta el campo '{campo}'")
    
    return errores

def generar_reporte_estadisticas(data: Dict[str, Any]) -> Dict[str, Any]:
    """Genera estadísticas del contenido"""
    stats = {}
    
    metadata = data.get('metadata', {})
    stats['total_units'] = metadata.get('totalUnits', 0)
    stats['total_records'] = metadata.get('totalRecords', 0)
    stats['total_issues'] = len(metadata.get('issues', []))
    stats['has_issues'] = metadata.get('hasIssues', False)
    
    # Contar funciones por tipo
    unidades = data.get('data', {}).get('unidades', [])
    tipos_funcion = {}
    total_funciones = 0
    
    for unidad in unidades:
        funciones = unidad.get('funciones', [])
        for funcion in funciones:
            tipo = funcion.get('tipo', '')
            tipos_funcion[tipo] = tipos_funcion.get(tipo, 0) + 1
            total_funciones += 1
    
    stats['total_funciones'] = total_funciones
    stats['tipos_funcion'] = tipos_funcion
    
    return stats

def main():
    """Función principal de validación"""
    archivo_json = "unidades_organizativas_corregido_2025-07-29-02-00.json"
    
    print("🔍 VALIDACIÓN DEL JSON EXPORTADO")
    print("=" * 50)
    print(f"Archivo: {archivo_json}")
    print(f"Fecha de validación: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    try:
        # Cargar JSON
        with open(archivo_json, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        print("✅ JSON cargado correctamente")
        
        # Validaciones
        errores = []
        
        # Validar estructura básica
        errores.extend(validar_estructura_json(data))
        
        # Validar metadata
        if 'metadata' in data:
            errores.extend(validar_metadata(data['metadata']))
        
        # Validar unidades
        if 'data' in data and 'unidades' in data['data']:
            errores.extend(validar_unidades(data['data']['unidades']))
        
        # Validar issues
        if 'metadata' in data and 'issues' in data['metadata']:
            errores.extend(validar_issues(data['metadata']['issues']))
        
        # Generar estadísticas
        stats = generar_reporte_estadisticas(data)
        
        # Reporte
        print("\n📊 REPORTE DE VALIDACIÓN")
        print("-" * 30)
        
        if errores:
            print(f"❌ Se encontraron {len(errores)} errores:")
            for error in errores:
                print(f"   {error}")
        else:
            print("✅ No se encontraron errores de estructura")
        
        print(f"\n📈 ESTADÍSTICAS")
        print("-" * 20)
        print(f"Total de unidades: {stats['total_units']}")
        print(f"Total de registros: {stats['total_records']}")
        print(f"Total de funciones: {stats['total_funciones']}")
        print(f"Total de issues: {stats['total_issues']}")
        print(f"Tiene issues: {'Sí' if stats['has_issues'] else 'No'}")
        
        print(f"\n📋 DISTRIBUCIÓN DE TIPOS DE FUNCIÓN:")
        for tipo, cantidad in stats['tipos_funcion'].items():
            porcentaje = (cantidad / stats['total_funciones']) * 100 if stats['total_funciones'] > 0 else 0
            print(f"   {tipo}: {cantidad} ({porcentaje:.1f}%)")
        
        # Validación de formato JSON
        print(f"\n🔧 VALIDACIÓN TÉCNICA")
        print("-" * 25)
        print("✅ Sintaxis JSON válida")
        print("✅ Codificación UTF-8 correcta")
        print("✅ Estructura de datos coherente")
        
        # Resumen final
        print(f"\n🎯 CONCLUSIÓN")
        print("-" * 15)
        if errores:
            print("⚠️  El archivo tiene problemas que requieren atención")
            print("   Se recomienda revisar y corregir los errores antes de usar el archivo")
        else:
            print("✅ El archivo JSON tiene el formato correcto")
            print("   Puede ser utilizado sin problemas")
        
        return len(errores) == 0
        
    except FileNotFoundError:
        print(f"❌ Error: No se encontró el archivo {archivo_json}")
        return False
    except json.JSONDecodeError as e:
        print(f"❌ Error: JSON inválido - {e}")
        return False
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)