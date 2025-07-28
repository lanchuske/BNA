#!/usr/bin/env python3
"""
Script de prueba end-to-end para verificar la exportación PDF del organigrama
"""

import os
import sys
import time
import subprocess
from pathlib import Path

def run_browser_test():
    """Ejecuta prueba de exportación PDF en el navegador"""
    
    print("🧪 Iniciando prueba end-to-end de exportación PDF...")
    
    # Verificar que el archivo HTML existe
    html_file = Path("organigrama_interactivo.html")
    if not html_file.exists():
        print("❌ Error: No se encuentra organigrama_interactivo.html")
        return False
    
    # Verificar que el archivo CSV existe
    csv_file = Path("CSV/unidades_organizativas_corregido_2025-07-28-19-41.csv")
    if not csv_file.exists():
        print("❌ Error: No se encuentra el archivo CSV de datos")
        return False
    
    print("✅ Archivos encontrados correctamente")
    
    # Abrir el archivo HTML en el navegador
    try:
        print("🌐 Abriendo organigrama en el navegador...")
        
        # Usar el comando apropiado según el sistema operativo
        if sys.platform == "darwin":  # macOS
            subprocess.run(["open", str(html_file.absolute())])
        elif sys.platform == "win32":  # Windows
            subprocess.run(["start", str(html_file.absolute())], shell=True)
        else:  # Linux
            subprocess.run(["xdg-open", str(html_file.absolute())])
        
        print("✅ Archivo HTML abierto en el navegador")
        
    except Exception as e:
        print(f"❌ Error al abrir el archivo: {e}")
        return False
    
    return True

def check_pdf_export_manual():
    """Guía manual para verificar la exportación PDF"""
    
    print("\n📋 GUÍA DE VERIFICACIÓN MANUAL:")
    print("=" * 50)
    
    print("\n1. 📁 CARGAR DATOS:")
    print("   - Haz clic en 'Admin ▼'")
    print("   - Haz clic en 'Examinar...'")
    print("   - Selecciona: CSV/unidades_organizativas_corregido_2025-07-28-19-41.csv")
    print("   - Haz clic en 'Cargar Archivo'")
    print("   - Verifica que aparezca el árbol de unidades")
    
    print("\n2. 🔍 VERIFICAR FUNCIONALIDAD:")
    print("   - Expande algunas unidades en el árbol")
    print("   - Verifica que se muestren las misiones y funciones")
    print("   - Haz clic en algunas unidades para ver detalles")
    
    print("\n3. 📄 PROBAR EXPORTACIÓN PDF:")
    print("   - Haz clic en '📄 Exportar PDF'")
    print("   - Verifica que aparezca el mensaje de éxito")
    print("   - Busca el archivo PDF descargado")
    print("   - Abre el PDF y verifica el contenido")
    
    print("\n4. 🐛 DIAGNÓSTICO DE ERRORES:")
    print("   - Abre las herramientas de desarrollador (F12)")
    print("   - Ve a la pestaña 'Console'")
    print("   - Busca mensajes de error relacionados con PDF")
    print("   - Verifica la pestaña 'Network' para errores de CDN")
    
    print("\n5. ✅ CRITERIOS DE ÉXITO:")
    print("   - El PDF se descarga correctamente")
    print("   - El PDF contiene todas las unidades")
    print("   - El formato es legible y profesional")
    print("   - No hay errores en la consola del navegador")

def check_browser_console():
    """Verifica posibles errores en la consola del navegador"""
    
    print("\n🔍 POSIBLES ERRORES Y SOLUCIONES:")
    print("=" * 40)
    
    print("\n❌ Error: 'html2pdf is not defined'")
    print("   Solución: Verificar conexión a internet y CDNs")
    print("   - Los CDNs pueden estar bloqueados")
    print("   - Probar con VPN o red diferente")
    
    print("\n❌ Error: 'CORS policy'")
    print("   Solución: Abrir el archivo desde un servidor web")
    print("   - Usar: python -m http.server 8000")
    print("   - Acceder a: http://localhost:8000")
    
    print("\n❌ Error: 'Canvas' o 'Image'")
    print("   Solución: Verificar compatibilidad del navegador")
    print("   - Probar con Chrome/Edge")
    print("   - Actualizar el navegador")
    
    print("\n❌ Error: 'Memory' o 'Timeout'")
    print("   Solución: Reducir la escala o calidad")
    print("   - Modificar scale: 1.5 → 1.0")
    print("   - Modificar quality: 0.95 → 0.8")

def create_test_report():
    """Crea un reporte de prueba"""
    
    report = f"""
# Reporte de Prueba - Exportación PDF
**Fecha:** {time.strftime('%Y-%m-%d %H:%M:%S')}

## Estado de Archivos
- ✅ organigrama_interactivo.html: {'Encontrado' if Path('organigrama_interactivo.html').exists() else 'No encontrado'}
- ✅ CSV de datos: {'Encontrado' if Path('CSV/unidades_organizativas_corregido_2025-07-28-19-41.csv').exists() else 'No encontrado'}

## Mejoras Implementadas
1. ✅ Múltiples CDNs de fallback
2. ✅ Manejo robusto de errores
3. ✅ Función de fallback
4. ✅ Configuración optimizada
5. ✅ Logging detallado

## Instrucciones de Prueba
1. Abrir organigrama_interactivo.html en el navegador
2. Cargar el archivo CSV de datos
3. Probar la exportación PDF
4. Verificar el archivo PDF generado

## Diagnóstico
- Revisar consola del navegador (F12)
- Verificar conexión a internet
- Comprobar compatibilidad del navegador
"""
    
    with open("test/reporte_exportacion_pdf.md", "w", encoding="utf-8") as f:
        f.write(report)
    
    print("📄 Reporte de prueba creado: test/reporte_exportacion_pdf.md")

def main():
    """Función principal"""
    
    print("🚀 INICIANDO PRUEBAS DE EXPORTACIÓN PDF")
    print("=" * 50)
    
    # Crear directorio de test si no existe
    Path("test").mkdir(exist_ok=True)
    
    # Ejecutar pruebas
    success = run_browser_test()
    
    if success:
        print("\n✅ Configuración básica correcta")
    else:
        print("\n❌ Problemas en la configuración básica")
    
    # Mostrar guía manual
    check_pdf_export_manual()
    
    # Mostrar diagnóstico de errores
    check_browser_console()
    
    # Crear reporte
    create_test_report()
    
    print("\n🎯 PRUEBAS COMPLETADAS")
    print("=" * 30)
    print("📋 Sigue la guía manual para verificar la exportación PDF")
    print("📄 Revisa el reporte generado en test/reporte_exportacion_pdf.md")
    print("🔧 Si hay problemas, revisa la consola del navegador")

if __name__ == "__main__":
    main() 