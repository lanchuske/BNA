import csv
import pydot

# Read the CSV and build the hierarchy
nodes = {}
relations = []

with open('Unidades.csv', 'r', encoding='latin1') as f:
    reader = csv.DictReader(f, delimiter=';')
    for row in reader:
        unidad = row['Unidad'].strip()
        reporta = row['Reporta a (NEG)'].strip()
        if unidad:
            nodes[unidad] = True
        if reporta and reporta != '#N/A':
            relations.append((reporta, unidad))

# Create the graph
graph = pydot.Dot(graph_type='digraph', rankdir='TB')

for unidad in nodes:
    graph.add_node(pydot.Node(unidad, shape='box'))

for parent, child in relations:
    if parent in nodes and child in nodes:
        graph.add_edge(pydot.Edge(parent, child))

# Save as PNG
graph.write_png('organigrama.png')
print('Organigrama generado: organigrama.png') 