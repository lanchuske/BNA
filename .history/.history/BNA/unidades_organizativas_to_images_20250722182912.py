import re
import os
import subprocess

# Read the text with page breaks
with open('unidades_organizativas_p7.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Find all page breaks (form feed character \f)
pages = text.split('\f')

# Find the start of each Unidad Organizativa
unidad_indices = []
unidad_names = []
for i, page in enumerate(pages):
    for match in re.finditer(r'Unidad Organizativa\s*\n?([A-ZÁÉÍÓÚÑ ]+)', page):
        unidad_indices.append(i)
        name = match.group(1).strip().replace(' ', '_')
        unidad_names.append(name)

# Add the end page (last page + 1)
unidad_indices.append(len(pages))

# For each unit, determine the page range and merge images
for idx in range(len(unidad_names)):
    start_page = unidad_indices[idx] + 7  # page_0007.pdf is the first
    end_page = unidad_indices[idx+1] + 7  # not inclusive
    name = unidad_names[idx]
    # Build list of image filenames
    imgs = [f"page_{p:04d}.png" for p in range(start_page, end_page)]
    imgs_exist = [img for img in imgs if os.path.exists(img)]
    if not imgs_exist:
        continue
    out_img = f"unidad_{idx+1:03d}_{name}.png"
    # Merge vertically
    subprocess.run(["convert"] + imgs_exist + ["-append", out_img])
    print(f"Created {out_img} from pages {start_page} to {end_page-1}") 