#!/usr/bin/env python3
"""
Test script to verify that the code fixes in organigrama_interactivo.html are working correctly.
"""

import re
import json
from datetime import datetime

def test_html_file():
    """Test that the HTML file has been fixed correctly."""
    
    print("🧪 Iniciando pruebas de corrección de código...")
    
    # Read the HTML file
    try:
        with open('../organigrama_interactivo.html', 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print("❌ ERROR: No se pudo encontrar el archivo organigrama_interactivo.html")
        return False
    
    test_results = []
    
    # Test 1: Check that eliminarUnidad function exists
    eliminar_unidad_pattern = r'function\s+eliminarUnidad\s*\('
    if re.search(eliminar_unidad_pattern, content):
        test_results.append(("✅ Función eliminarUnidad definida", True))
    else:
        test_results.append(("❌ Función eliminarUnidad NO definida", False))
    
    # Test 2: Check that redundant function calls are fixed
    redundant_pattern = r'compararCSVActualConOriginal\s*&&\s*compararCSVActualConOriginal\(\)'
    redundant_matches = re.findall(redundant_pattern, content)
    if len(redundant_matches) == 0:
        test_results.append(("✅ Llamadas redundantes eliminadas", True))
    else:
        test_results.append((f"❌ Encontradas {len(redundant_matches)} llamadas redundantes", False))
    
    # Test 3: Check that eliminarUnidad function is properly implemented
    eliminar_implementation_checks = [
        r'tieneHijos.*=.*Object\.values\(unidadesMap\)',  # Check for children validation
        r'delete\s+unidadesMap\[key\]',  # Check for deletion logic
        r'mostrarAlerta.*eliminada.*correctamente',  # Check for success message
    ]
    
    implementation_found = all(re.search(pattern, content) for pattern in eliminar_implementation_checks)
    if implementation_found:
        test_results.append(("✅ Función eliminarUnidad implementada correctamente", True))
    else:
        test_results.append(("❌ Función eliminarUnidad implementación incompleta", False))
    
    # Test 4: Check for basic syntax validation
    script_match = re.search(r'<script>(.*?)</script>', content, re.DOTALL)
    if script_match:
        js_content = script_match.group(1)
        # Basic syntax checks
        open_braces = js_content.count('{')
        close_braces = js_content.count('}')
        if open_braces == close_braces:
            test_results.append(("✅ Llaves balanceadas en JavaScript", True))
        else:
            test_results.append((f"❌ Llaves desbalanceadas: {open_braces} abiertas, {close_braces} cerradas", False))
    
    # Test 5: Check for proper function definitions
    function_patterns = [
        r'function\s+eliminarUnidad',
        r'function\s+parseCSV',
        r'function\s+buildTree',
        r'function\s+showUnidad',
        r'function\s+exportCSV'
    ]
    
    missing_functions = []
    for pattern in function_patterns:
        if not re.search(pattern, content):
            missing_functions.append(pattern.replace(r'function\s+', '').replace('\\', ''))
    
    if not missing_functions:
        test_results.append(("✅ Todas las funciones principales están definidas", True))
    else:
        test_results.append((f"❌ Funciones faltantes: {', '.join(missing_functions)}", False))
    
    # Print results
    print("\n📊 Resultados de las pruebas:")
    print("=" * 60)
    
    passed = 0
    total = len(test_results)
    
    for test_name, result in test_results:
        print(f"{test_name}")
        if result:
            passed += 1
    
    print("=" * 60)
    print(f"✅ Pruebas pasadas: {passed}/{total}")
    
    if passed == total:
        print("🎉 ¡Todas las correcciones fueron aplicadas exitosamente!")
        return True
    else:
        print("⚠️  Algunas correcciones pueden necesitar revisión adicional.")
        return False

def generate_report():
    """Generate a detailed test report."""
    
    report = {
        "timestamp": datetime.now().isoformat(),
        "test_type": "code_fixes_validation",
        "description": "Validación de correcciones en organigrama_interactivo.html",
        "fixes_applied": [
            "Agregada función eliminarUnidad faltante",
            "Eliminadas llamadas redundantes a compararCSVActualConOriginal",
            "Validación de sintaxis JavaScript"
        ]
    }
    
    success = test_html_file()
    report["success"] = success
    report["status"] = "PASSED" if success else "FAILED"
    
    # Save report
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    report_filename = f"report_code_fixes_{timestamp}.json"
    
    with open(report_filename, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    
    print(f"\n📋 Reporte guardado en: {report_filename}")
    return success

if __name__ == "__main__":
    generate_report()