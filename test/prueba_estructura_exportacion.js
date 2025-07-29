// Script para analizar y optimizar la estructura de exportación JSON
// Basado en organigrama_optimizado.html

// Simular datos de prueba basados en la estructura real
const testData = [
    {
        'Unidad Organizativa': 'SGP Clientes',
        'Reporta A': '',
        'Misión': 'Liderar la estrategia del negocio de Personas...',
        'Tipo de Función': 'Genérica',
        'Descripción': 'Definir y liderar la ejecución de la estrategia...',
        'Producto Final': 'Ejecución Plan de Negocio',
        'Porcentaje Dedicación': ''
    },
    {
        'Unidad Organizativa': 'Segmento Personas',
        'Reporta A': 'SGP Clientes',
        'Misión': 'Liderar la estrategia del negocio de Personas...',
        'Tipo de Función': 'Específica',
        'Descripción': 'Definir e implementar la propuesta de valor...',
        'Producto Final': 'Propuesta de Valor Segmento Personas',
        'Porcentaje Dedicación': '20'
    },
    {
        'Unidad Organizativa': 'Segmento Personas',
        'Reporta A': 'SGP Clientes',
        'Tipo de Función': 'Indicador',
        'Descripción': 'Penetración de productos por subsegmento',
        'Producto Final': '',
        'Porcentaje Dedicación': ''
    }
];

// Función para agrupar datos por unidad (como en el código real)
function groupByUnidad(data) {
    const grouped = {};
    data.forEach(item => {
        const unidad = item['Unidad Organizativa'];
        if (!grouped[unidad]) {
            grouped[unidad] = [];
        }
        grouped[unidad].push(item);
    });
    return grouped;
}

// Función para construir árbol jerárquico
function buildTree(data) {
    const grouped = groupByUnidad(data);
    const tree = [];
    
    Object.entries(grouped).forEach(([nombre, funciones]) => {
        const unidad = {
            key: nombre,
            nombre: nombre,
            funciones: funciones,
            children: []
        };
        
        // Buscar unidades hijas
        funciones.forEach(func => {
            const reportaA = func['Reporta A'];
            if (reportaA && reportaA.trim() && grouped[reportaA]) {
                // Esta unidad reporta a otra
                const parent = tree.find(u => u.nombre === reportaA);
                if (parent) {
                    parent.children.push(unidad);
                    return;
                }
            }
        });
        
        // Si no tiene padre o es raíz
        if (!funciones.some(f => f['Reporta A'] && f['Reporta A'].trim())) {
            tree.push(unidad);
        }
    });
    
    return tree;
}

// Función de exportación optimizada
function exportJSONOptimized(data) {
    const grouped = groupByUnidad(data);
    const tree = buildTree(data);
    
    // Generar estadísticas
    const stats = {
        totalRecords: data.length,
        totalUnits: Object.keys(grouped).length,
        byType: {
            generica: data.filter(d => d['Tipo de Función'].includes('Genérica')).length,
            especifica: data.filter(d => d['Tipo de Función'].includes('Específica')).length,
            indicador: data.filter(d => d['Tipo de Función'].includes('Indicador')).length
        }
    };
    
    // Estructura JSON optimizada
    const jsonData = {
        metadata: {
            exportDate: new Date().toISOString(),
            version: '2.0',
            stats: stats,
            format: 'optimized'
        },
        hierarchy: {
            tree: tree.map(node => ({
                key: node.key,
                nombre: node.nombre,
                reportaA: node.funciones[0]?.['Reporta A'] || '',
                mision: node.funciones[0]?.['Misión'] || '',
                children: node.children.map(child => ({
                    key: child.key,
                    nombre: child.nombre,
                    reportaA: child.funciones[0]?.['Reporta A'] || ''
                }))
            }))
        },
        data: {
            unidades: Object.entries(grouped).map(([nombre, funciones]) => ({
                nombre,
                reportaA: funciones[0]?.['Reporta A'] || '',
                mision: funciones[0]?.['Misión'] || '',
                funciones: funciones.map(func => ({
                    tipo: func['Tipo de Función'] || 'Genérica',
                    descripcion: func['Descripción'] || '',
                    productoFinal: func['Producto Final'] || '',
                    porcentajeDedicacion: func['Porcentaje Dedicación'] || ''
                }))
            }))
        }
    };
    
    return jsonData;
}

// Función de importación optimizada
function importJSONOptimized(jsonContent) {
    try {
        const jsonData = JSON.parse(jsonContent);
        
        if (jsonData.data && jsonData.data.unidades) {
            // Convertir de formato optimizado a datos planos
            const data = [];
            jsonData.data.unidades.forEach(unidad => {
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
            });
            
            return {
                success: true,
                data: data,
                stats: jsonData.metadata?.stats || {},
                hierarchy: jsonData.hierarchy || {}
            };
        } else {
            return { success: false, error: 'Formato JSON no válido' };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Probar las funciones
console.log('=== PRUEBA DE ESTRUCTURA DE EXPORTACIÓN ===');

const grouped = groupByUnidad(testData);
console.log('Datos agrupados:', grouped);

const tree = buildTree(testData);
console.log('Árbol jerárquico:', tree);

const exported = exportJSONOptimized(testData);
console.log('JSON exportado:', JSON.stringify(exported, null, 2));

const imported = importJSONOptimized(JSON.stringify(exported));
console.log('JSON importado:', imported);

// Verificar integridad de datos
console.log('=== VERIFICACIÓN DE INTEGRIDAD ===');
console.log('Datos originales:', testData.length, 'registros');
console.log('Datos importados:', imported.data.length, 'registros');
console.log('Integridad:', testData.length === imported.data.length ? '✅ OK' : '❌ ERROR');

// Verificar campos críticos
const originalFields = testData.map(d => ({
    unidad: d['Unidad Organizativa'],
    tipo: d['Tipo de Función'],
    descripcion: d['Descripción']
}));

const importedFields = imported.data.map(d => ({
    unidad: d['Unidad Organizativa'],
    tipo: d['Tipo de Función'],
    descripcion: d['Descripción']
}));

console.log('Campos críticos preservados:', 
    JSON.stringify(originalFields) === JSON.stringify(importedFields) ? '✅ OK' : '❌ ERROR'
);

console.log('=== PRUEBA COMPLETADA ===');