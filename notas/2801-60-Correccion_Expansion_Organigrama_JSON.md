# Corrección de Expansión del Organigrama con JSON

## 📅 Fecha: 28/01/2025

## 🎯 **Problema Identificado**

El usuario reportó que al cargar el archivo `ia copy.json` en `organigrama_safari_fix.html`, no lograba expandir el organigrama para ver las unidades subordinadas.

## 🔍 **Análisis del Problema**

### **Estructura del JSON**
El archivo `ia copy.json` tiene una estructura específica diferente a la esperada:

```json
{
  "hierarchy": {
    "tree": [
      {
        "key": "SGP Clientes|",
        "nombre": "SGP Clientes",
        "reportaA": "",
        "children": [...]
      }
    ]
  },
  "data": {
    "unidades": [
      {
        "nombre": "Estrategia Comercial Y Propuesta De Valor",
        "reportaA": "Segmento Personas",
        "funciones": [...]
      }
    ]
  }
}
```

### **Problemas Identificados:**

1. **Formato JSON no soportado**: El código solo manejaba formatos CSV y JSON plano
2. **Jerarquía separada de datos**: La estructura jerárquica estaba en `hierarchy.tree` y las funciones en `data.unidades`
3. **Funcionalidad de expansión eliminada**: El rediseño vertical había eliminado los botones de expansión
4. **Falta de integración**: No había conexión entre la jerarquía y los datos de funciones

## ✅ **Soluciones Implementadas**

### **1. Soporte para Formato JSON Complejo**

```javascript
// Verificar si es el formato específico con hierarchy y data
if (jsonData.hierarchy && jsonData.data && jsonData.data.unidades) {
    console.log('📊 Procesando formato JSON con jerarquía y datos separados...');
    
    // Procesar las unidades desde data.unidades
    jsonData.data.unidades.forEach(unidad => {
        if (unidad.funciones && Array.isArray(unidad.funciones)) {
            unidad.funciones.forEach(func => {
                data.push({
                    'Unidad Organizativa': unidad.nombre,
                    'Reporta A': unidad.reportaA || '',
                    'Misión': unidad.mision || '',
                    'Tipo de Función': func.tipo || 'Genérica',
                    'Descripción': func.descripcion || '',
                    'Producto Final': func.productoFinal || '',
                    'Porcentaje Dedicación': func.porcentajeDedicacion || ''
                });
            });
        }
    });
    
    // Si hay jerarquía, usarla para construir el árbol
    if (jsonData.hierarchy.tree && Array.isArray(jsonData.hierarchy.tree)) {
        console.log('🌳 Jerarquía encontrada, construyendo árbol desde hierarchy.tree...');
        
        // Convertir la jerarquía a formato de datos plano para compatibilidad
        const processHierarchyNode = (node, parentName = '') => {
            const nodeData = {
                'Unidad Organizativa': node.nombre,
                'Reporta A': node.reportaA || parentName,
                'Misión': node.mision || '',
                'Tipo de Función': 'Genérica', // Nodo organizativo
                'Descripción': `Unidad organizativa: ${node.nombre}`,
                'Producto Final': '',
                'Porcentaje Dedicación': ''
            };
            
            data.push(nodeData);
            
            // Procesar hijos recursivamente
            if (node.children && Array.isArray(node.children)) {
                node.children.forEach(child => {
                    processHierarchyNode(child, node.nombre);
                });
            }
        };
        
        // Procesar cada nodo raíz de la jerarquía
        jsonData.hierarchy.tree.forEach(rootNode => {
            processHierarchyNode(rootNode);
        });
    }
}
```

### **2. Restauración de Funcionalidad de Expansión**

#### **Botones de Expansión**
```javascript
// Agregar botón de expansión si tiene hijos
const expandButton = hasChildren ? 
    `<button class="expand-btn" onclick="event.stopPropagation(); Renderer.toggleNode('${node.key}')">
        ${isExpanded ? '▼' : '▶'}
    </button>` : '';
```

#### **Renderizado de Hijos Expandidos**
```javascript
// Renderizar hijos si está expandido
if (isExpanded && hasChildren) {
    const childrenContainer = Utils.createElementSafari('div', 'tree-children-expanded');
    if (childrenContainer) {
        node.children.forEach(child => {
            const childLi = this.renderNode(child, childrenContainer, level + 1);
            if (childLi) {
                Utils.appendChildSafari(childrenContainer, childLi);
            }
        });
        Utils.appendChildSafari(li, childrenContainer);
    }
}
```

#### **Función toggleNode**
```javascript
toggleNode(nodeKey) {
    try {
        // Toggle el estado de expansión
        STATE.expandedNodes[nodeKey] = !STATE.expandedNodes[nodeKey];
        
        // Guardar en localStorage
        localStorage.setItem('expandedNodes', JSON.stringify(STATE.expandedNodes));
        
        // Re-renderizar el árbol para mostrar los cambios
        if (STATE.treeRoots && STATE.treeRoots.length > 0) {
            this.renderTree(STATE.treeRoots, document.getElementById('tree-container'));
        }
        
        console.log(`🌳 Nodo ${nodeKey} ${STATE.expandedNodes[nodeKey] ? 'expandido' : 'colapsado'}`);
        
    } catch (error) {
        console.error('Error toggling node:', error);
    }
}
```

### **3. Estilos CSS para Expansión**

```css
/* Estilos para expansión en diseño vertical */
.expand-btn {
    background: none;
    border: none;
    font-size: 12px;
    color: #007bff;
    cursor: pointer;
    padding: 2px 4px;
    border-radius: 3px;
    margin-right: 5px;
    -webkit-transition: all 0.2s ease;
    transition: all 0.2s ease;
}

.expand-btn:hover {
    background: #e3f2fd;
    color: #0056b3;
}

.tree-children-expanded {
    margin-top: 10px;
    padding-left: 20px;
    border-left: 2px solid #e9ecef;
}

.tree-children-expanded .tree-node {
    margin: 5px 0;
    min-width: 150px;
    max-width: 200px;
}

.tree-node.expanded {
    background: #f8f9fa;
    border-color: #007bff;
}

.tree-node.expanded .node-content {
    background-color: #e3f2fd;
}
```

## 🎯 **Resultados**

### **Funcionalidades Restauradas:**

1. ✅ **Carga de JSON complejo**: Soporte para archivos con estructura `hierarchy.tree` y `data.unidades`
2. ✅ **Expansión de nodos**: Botones ▶/▼ para expandir/colapsar unidades
3. ✅ **Persistencia de estado**: El estado de expansión se guarda en localStorage
4. ✅ **Visualización jerárquica**: Los nodos expandidos muestran sus subunidades
5. ✅ **Compatibilidad Safari**: Mantiene las optimizaciones para Safari

### **Mejoras Adicionales:**

- **Integración de datos**: Combina la jerarquía organizativa con las funciones específicas
- **Feedback visual**: Nodos expandidos tienen estilos diferenciados
- **Logging detallado**: Console logs para debugging
- **Manejo de errores**: Try-catch en todas las operaciones críticas

## 📊 **Pruebas Realizadas**

1. **Carga de archivo**: ✅ `ia copy.json` se carga correctamente
2. **Visualización inicial**: ✅ Se muestra "SGP Clientes" como unidad principal
3. **Expansión de nodos**: ✅ Botones de expansión funcionan
4. **Persistencia**: ✅ Estado de expansión se mantiene entre sesiones
5. **Compatibilidad**: ✅ Funciona en Safari sin errores

## 🔧 **Archivos Modificados**

- `organigrama_safari_fix.html`: Funciones `processJSON`, `renderNode`, `toggleNode` y estilos CSS

## 📝 **Notas Técnicas**

- La solución mantiene la compatibilidad con formatos anteriores (CSV, JSON plano)
- El estado de expansión se sincroniza automáticamente con localStorage
- Los estilos están optimizados para el diseño vertical existente
- Se mantienen todas las optimizaciones para Safari

## 🚀 **Estado Final**

El organigrama ahora permite:
- Cargar archivos JSON con estructura compleja
- Expandir/colapsar unidades organizativas
- Ver la jerarquía completa del banco
- Mantener el estado de expansión entre sesiones
- Funcionar correctamente en Safari