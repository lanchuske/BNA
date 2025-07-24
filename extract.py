import csv
import re
import os
from PyPDF2 import PdfReader
import unicodedata
import pdfplumber
import camelot

from collections import defaultdict

# Mapeo manual de productos por unidad para extracción forzada
MANUAL_PRODUCTS = {
    "AUDITORÍA GENERAL": [
        "Plan de Acción y Presupuesto",
        "Políticas y Pautas",
        "Coordinación",
        "Criterios Metodológicos y Alcance",
        "Política/Procedimientos/Solución de problemas"
    ],
    "AUDITORÍA DE PROCESOS EN SUCURSALES": [
        "Organización",
        "Coordinación",
        "Gestión",
        "Solución de problemas"
    ],
    "AUDITORÍA DE PROCESOS CENTRALES": [
        "Organización",
        "Coordinación",
        "Gestión",
        "Solución de problemas"
    ]
}

def clean_text(text):
    """
    Limpia el texto eliminando espacios múltiples, normalizando saltos de línea.
    Diseñado para preservar saltos de línea internos en campos citados antes de un parsing más detallado.
    """
    text = text.strip()
    text = unicodedata.normalize("NFKC", text)
    # Elimina espacios/tabs múltiples, reemplazándolos con un solo espacio.
    text = re.sub(r'[ \t]+', ' ', text)
    # Normaliza múltiples saltos de línea a uno solo, eliminando espacios alrededor.
    text = re.sub(r'(\s*\n\s*){2,}', '\n', text)
    return text

def clean_text_for_field(text):
    """
    Limpia el texto de un campo individual, eliminando el exceso de espacios internos.
    Esto se aplica después de que el campo ha sido extraído, por ejemplo, de una cadena entrecomillada.
    """
    # Reemplaza múltiples espacios (incluyendo saltos de línea y tabs) dentro del texto
    # con un solo espacio, y luego elimina espacios iniciales/finales.
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def parse_csv_like_line(line):
    """
    Analiza una sola línea similar a CSV que podría contener campos entrecomillados.
    Utiliza csv.reader para un análisis robusto de campos citados.
    """
    try:
        # csv.reader espera un iterable, por eso envolvemos la línea en una lista.
        reader = csv.reader([line], delimiter=',')
        for row in reader:
            # Limpiamos cada campo después de que csv.reader lo haya parseado correctamente.
            return [clean_text_for_field(field) for field in row]
    except csv.Error:
        # Retorna None si la línea no puede ser parseada como CSV (e.g., línea en blanco o formato incorrecto).
        return None

def extract_text_from_pdf(pdf_path):
    """
    Extrae texto de un archivo PDF, conservando la estructura básica de la página.
    Cada página se prefija con "===== Page X =====\n".
    """
    text = ""
    try:
        reader = PdfReader(pdf_path)
        for i, page in enumerate(reader.pages):
            page_text = page.extract_text()
            text += f"===== Page {i+1} =====\n{page_text}\n"
    except Exception as e:
        print(f"Error al leer el PDF: {str(e)}")
        return None
    return text

def extract_units(text, pdf_path):
    """
    Extrae todas las unidades organizativas y sus funciones del texto del PDF.
    Implementa reglas específicas para la extracción de encabezados, funciones genéricas y específicas.
    """
    units = []
    # Para evitar duplicados en Funciones Específicas
    seen_spec = defaultdict(set)
    # Eliminar encabezados de página que se añaden durante la extracción de texto.
    text = re.sub(r'^=+ Page \d+ =+$', '', text, flags=re.MULTILINE)
    
    # Dividir el texto completo en secciones, donde cada sección comienza con "Unidad Organizativa".
    sections = re.split(
        re.compile(r'(?=Unidad Organizativa)', re.IGNORECASE),
        text
    )

    # Expresión regular para extraer los campos del encabezado de cada unidad organizativa.
    # Se asegura de que la Misión termine antes de las secciones de funciones o el final del documento.
    header_re = re.compile(
        r'Unidad Organizativa\s*(?P<unidad>[\s\S]*?)\s*'
        r'Jerarquía\s*(?P<jerarquia>[\s\S]*?)\s*'
        r'Nivel de\s*Reporte\s*(?P<nivel>\d*)\s*'
        r'Fecha\s*Aprobación\s*(?P<fecha>\d{2}/\d{2}/\d{4})\s*'
        r'Misión\s*(?P<mision>[\s\S]*?)(?=Funciones Genéricas|Funciones Específicas|\Z)',
        re.IGNORECASE
    )

    for section in sections:
        header_match = header_re.search(section)
        if not header_match:
            continue # Si no se encuentra un encabezado, se salta esta sección.

        raw_jerarquia = clean_text_for_field(header_match.group("jerarquia"))
        # Eliminar prefijos "Implícita" o "Explícita" de la jerarquía, con o sin espacio posterior.
        jerarquia = re.sub(r'^(Implícita|Explícita)\b\s*', '', raw_jerarquia, flags=re.IGNORECASE).strip()
        if not jerarquia:
            jerarquia = "NA"

        nivel = clean_text_for_field(header_match.group("nivel"))
        if not nivel:
            nivel = "NA"
        unit_data = {
            "Nombre": clean_text_for_field(header_match.group("unidad")),
            "Jerarquía": jerarquia,
            "Nivel Reporte": nivel,
            "Fecha": clean_text_for_field(header_match.group("fecha")),
            "Misión": clean_text_for_field(header_match.group("mision")),
            "Funciones": []
        }
        print(f"DEBUG: Unidad='{unit_data['Nombre']}', Jerarquía='{unit_data['Jerarquía']}', Nivel='{unit_data['Nivel Reporte']}', Fecha='{unit_data['Fecha']}', Misión='{unit_data['Misión']}'")

        # Extracción manual basada en MANUAL_PRODUCTS si existe entrada
        # Determinar lista manual coincidente por clave parcial (ignorar mayúsculas/minúsculas)
        manual_list = None
        for key, products in MANUAL_PRODUCTS.items():
            if key.lower() in unit_data["Nombre"].lower():
                manual_list = products
                print(f"DEBUG: Coincidencia manual para clave '{key}'")
                break
 
        if manual_list:
            print(f"DEBUG: Usando extracción manual para {unit_data['Nombre']}")
            gen_block = re.search(r'Funciones Genéricas[\s\S]*?Funciones Específicas', section)
            if gen_block:
                gen_text_block = gen_block.group(0)
                for prod in manual_list:
                    parts = gen_text_block.split(prod, 1)
                    if len(parts) == 2:
                        desc = clean_text_for_field(
                            parts[0]
                            .replace("Funciones Genéricas", "")
                            .replace("Producto Final", "")
                        )
                        unit_data["Funciones"].append({
                            "Tipo Función": "Genérica",
                            "Descripción": desc,
                            "Producto Final": prod,
                            "% Dedicación": "NA"
                        })
                        print(f"DEBUG Manual: Extrajo Genérica -> Descripción: {desc!r}, Producto: {prod!r}")
                        gen_text_block = parts[1]
            print(f"DEBUG: Total manual funciones genéricas: {len(unit_data['Funciones'])}")

        # Eliminar posibles entradas de encabezado de Funciones Genéricas
        unit_data["Funciones"] = [
            f for f in unit_data["Funciones"]
            if not (f.get("Tipo Función") == "Genérica" and "Producto Final" in f.get("Descripción", ""))
        ]
        units.append(unit_data) # Añade la unidad y sus funciones a la lista final.
    return units

def save_to_csv(units, output_dir="output"):
    """
    Guarda los datos extraídos en un único archivo CSV consolidado.
    Cada fila representa una función individual con todos los datos del encabezado de su unidad.
    """
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # Lista para almacenar todas las funciones de todas las unidades.
    all_functions = []
    for unit in units:
        for func in unit["Funciones"]:
            all_functions.append({
                "Unidad Organizativa": unit["Nombre"],
                "Jerarquía": unit["Jerarquía"],
                "Nivel Reporte": unit["Nivel Reporte"],
                "Fecha": unit["Fecha"],
                "Misión": unit["Misión"],
                "Tipo Función": func["Tipo Función"] if "Tipo Función" in func else func.get("Tipo", ""),
                "Descripción": func["Descripción"],
                "Producto Final": func["Producto Final"] if "Producto Final" in func else func.get("Producto", ""),
                "% Dedicación": func["% Dedicación"] if "% Dedicación" in func else func.get("Dedicación", "")
            })

    # Guarda todas las funciones en un único archivo CSV consolidado.
    consolidated_filename = os.path.join(output_dir, "FUNCIONES_CONSOLIDADO.csv")
    with open(consolidated_filename, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = [
            "Unidad Organizativa", "Jerarquía", "Nivel Reporte", "Fecha", "Misión",
            "Tipo Función", "Descripción", "Producto Final", "% Dedicación"
        ]
        # Usa DictWriter para escribir filas de diccionario, y cita todos los campos.
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames, quoting=csv.QUOTE_ALL)
        writer.writeheader() # Escribe los encabezados de las columnas.
        writer.writerows(all_functions) # Escribe todas las filas de datos.
    
    print(f"Archivo CSV consolidado generado: {consolidated_filename}")


def process_pdf_file(pdf_path):
    """
    Función principal para procesar un archivo PDF:
    1. Extrae el texto.
    2. Extrae las unidades organizativas y sus funciones.
    3. Guarda los datos en un archivo CSV.
    """
    print(f"\nProcesando archivo: {pdf_path}")
    
    pdf_text = extract_text_from_pdf(pdf_path)
    if not pdf_text:
        return
    
    units = extract_units(pdf_text, pdf_path)
    if not units:
        print("No se encontraron unidades organizativas en el documento")
        return
    
    print(f"\nUnidades encontradas: {len(units)}")
    for i, unit in enumerate(units, 1):
        print(f"{i}. {unit['Nombre']} ({len(unit['Funciones'])} funciones)")
    
    save_to_csv(units)
    
    print("\nProceso completado exitosamente")

if __name__ == "__main__":
    print("=== PROCESADOR DE MANUALES ORGANIZACIONALES ===")
    while True:
        pdf_path = input("Ingrese la ruta del archivo PDF: ").strip(' "\'')
        if not pdf_path:
            print("Error: Debe ingresar la ruta de un archivo.")
            continue
        if not os.path.exists(pdf_path):
            print(f"Error: El archivo no existe: {pdf_path}")
            continue
        if not pdf_path.lower().endswith('.pdf'):
            print("Error: El archivo debe tener extensión .pdf")
            continue
        # Ruta válida
        break
    process_pdf_file(pdf_path)