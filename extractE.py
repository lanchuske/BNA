#!/usr/bin/env python3
import os
import re
import csv
from PyPDF2 import PdfReader
import camelot

HEADER_RE = re.compile(
    r'Unidad Organizativa\s*[\r\n]+'
    r'(?P<unidad>[^\r\n]+)\s*[\r\n]+'
    r'Jerarquía\s*(?P<jerarquia>[\s\S]*?)\s*Nivel de\s*(?P<nivel>\d+)\s*'
    r'Fecha Aprobación\s*(?P<fecha>\d{2}/\d{2}/\d{4})'
    r'[\r\n]+'
    r'(?:(?P<mision>[\s\S]*?))(?=Funciones Genéricas|Funciones Específicas|\Z)',
    re.IGNORECASE
)

def extract_unit_names(pdf_path):
    reader = PdfReader(pdf_path)
    names = []
    for page in reader.pages:
        text = page.extract_text() or ""
        # Buscar todos los encabezados de Unidad Organizativa en esta página
        for match in HEADER_RE.finditer(text):
            unidad = match.group("unidad").strip()
            if unidad and unidad not in names:
                names.append(unidad)
    return names

def main():
    # Solicitar ruta al usuario
    while True:
        pdf_path = input("Ingrese la ruta del archivo PDF: ").strip(' "\'')
        if not pdf_path:
            print("Error: Debe ingresar la ruta de un archivo.")
            continue
        if not os.path.exists(pdf_path):
            print(f"Error: El archivo no existe: {pdf_path}")
            continue
        if not pdf_path.lower().endswith(".pdf"):
            print("Error: El archivo debe tener extensión .pdf")
            continue
        break

    # === DUMP DE MÉTODOS DE EXTRACCIÓN ===
    os.makedirs("output", exist_ok=True)

    # 1. PyPDF2 raw text por página
    reader = PdfReader(pdf_path)
    with open("output/dump_pypdf2.txt", "w", encoding="utf-8") as f:
        for i, page in enumerate(reader.pages, start=1):
            text = page.extract_text() or ""
            f.write(f"===== PyPDF2 Page {i} =====\n{text}\n\n")
    print("Dump PyPDF2 to output/dump_pypdf2.txt")

    # 2. pdfplumber raw text por página
    import pdfplumber
    with pdfplumber.open(pdf_path) as pdf:
        with open("output/dump_pdfplumber.txt", "w", encoding="utf-8") as f:
            for i, page in enumerate(pdf.pages, start=1):
                text = page.extract_text() or ""
                f.write(f"===== pdfplumber Page {i} =====\n{text}\n\n")
    print("Dump pdfplumber to output/dump_pdfplumber.txt")

    # 3. Camelot tables (if any)
    try:
        tables = camelot.read_pdf(pdf_path, pages='all', flavor='stream')
        with open("output/dump_camelot.txt", "w", encoding="utf-8") as f:
            if tables:
                for idx, table in enumerate(tables, start=1):
                    f.write(f"===== Camelot Table {idx} =====\n")
                    f.write(table.df.to_csv(index=False))
                    f.write("\n")
            else:
                f.write("No tables detected by Camelot.\n")
        print("Dump Camelot to output/dump_camelot.txt")
    except Exception as e:
        print(f"Camelot dump failed: {e}")
    # === FIN DUMPS ===

    print("\nUnidades Organizativas y sus rangos de línea:")
    with pdfplumber.open(pdf_path) as pdf:
        # Leer todas las líneas del documento para tener un contador global
        all_lines = []
        for page in pdf.pages:
            text = page.extract_text() or ""
            page_lines = text.splitlines()
            all_lines.extend(page_lines)
        # Volcar líneas crudas numeradas para análisis de patrones
        raw_output_path = "output/raw_lines.txt"
        os.makedirs(os.path.dirname(raw_output_path), exist_ok=True)
        with open(raw_output_path, "w", encoding="utf-8") as raw_file:
            for idx, line in enumerate(all_lines, start=1):
                # Escribimos número de línea y contenido crudo
                raw_file.write(f"{idx:04d}: {line}\n")
        print(f"Raw lines dumped to {raw_output_path}")
        total_lines = len(all_lines)
        # Recorrer líneas globalmente para detectar headers
        unit_positions = []
        for idx, line in enumerate(all_lines, start=1):
            if "unidad organizativa" in line.lower():
                start_line = idx
                buffer = line.strip()
                header_end = None
                for j in range(idx, total_lines):
                    buffer += ' ' + all_lines[j]
                    if re.search(r'Funciones Genéricas|Funciones Específicas', all_lines[j], re.IGNORECASE):
                        header_end = j + 1
                        break
                if header_end is None:
                    header_end = total_lines
                # Use the full next line as unit name
                if start_line < len(all_lines):
                    nombre = all_lines[start_line].strip()
                else:
                    nombre = "NA"
                unit_positions.append((nombre, start_line, header_end))
        unit_ranges = [(start, end) for (_, start, end) in unit_positions]
        # Imprimir rangos de contenido de cada unidad
        print("\nUnidades Organizativas y sus rangos de contenido:")
        for idx, (nombre, header_start, header_end) in enumerate(unit_positions):
            # Content starts the line after header_end
            content_start = header_end + 1
            # Determine end: two lines before next header_start or end of document
            if idx + 1 < len(unit_positions):
                next_header_start = unit_positions[idx+1][1]
                content_end = max(content_start, next_header_start - 2)
            else:
                content_end = len(all_lines)
            print(f"  - {nombre}: líneas {content_start} a {content_end}")

        print("\nDetalles de encabezado por Unidad:")
        for nombre, start_line, header_end in unit_positions:
            # Construir bloque de header desde start_line hasta header_end
            buffer = ""
            for line in all_lines[start_line-1:header_end]:
                buffer += line + "\n"
            print(f"DEBUG HeaderBuffer for '{nombre}':")
            print(buffer)
            m = HEADER_RE.search(buffer)
            if m:
                gd = m.groupdict()
                jerarquia = gd.get("jerarquia","NA").strip()
                nivel     = gd.get("nivel","NA").strip()
                fecha     = gd.get("fecha","NA").strip()
                mision    = gd.get("mision","NA").strip()
            else:
                jerarquia = nivel = fecha = mision = "NA"
            print(f"\nUnidad: {nombre}")
            print(f"  Jerarquía     : {jerarquia}")
            print(f"  Nivel Reporte : {nivel}")
            print(f"  Fecha Aprob.  : {fecha}")
            print(f"  Misión        : {mision}")

if __name__ == "__main__":
    main()