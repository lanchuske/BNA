from flask import Flask, render_template, request, jsonify
import json
import os

app = Flask(__name__)

# Load the JSON data (generated from CSV)
with open('unidades_organizativas.json', 'r', encoding='utf-8') as f:
    unidades = json.load(f)

# Get unique Unidad Organizativa names for dropdown
unidad_names = sorted(set(u['Unidad Organizativa'] for u in unidades))

@app.route('/')
def index():
    return render_template('index.html', unidades=unidad_names)

@app.route('/unidad/<unidad_name>')
def unidad(unidad_name):
    # Find all rows for this unidad
    rows = [u for u in unidades if u['Unidad Organizativa'] == unidad_name]
    if not rows:
        return jsonify({'error': 'Unidad no encontrada'}), 404
    # Structure data for display
    data = {
        'nombre': unidad_name,
        'mision': rows[0]['Misión'],
        'funciones_genericas': [
            {
                'descripcion': r['Descripción'],
                'producto_final': r['Producto Final']
            }
            for r in rows if r['Tipo de Función'].lower() == 'genérica'
        ],
        'funciones_especificas': [
            {
                'descripcion': r['Descripción'],
                'producto_final': r['Producto Final'],
                'porcentaje_dedicacion': r['Porcentaje Dedicación']
            }
            for r in rows if r['Tipo de Función'].lower() == 'específica'
        ]
    }
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True) 