// Script para diagnosticar el problema de exportación JSON
// Simular el estado actual del organigrama

// Simular datos de prueba
const testData = [
    {
        'Unidad Organizativa': 'SGP Clientes',
        'Reporta A': '',
        'Misión': 'Liderar la estrategia del negocio...',
        'Tipo de Función': 'Genérica',
        'Descripción': 'Definir y liderar la ejecución...',
        'Producto Final': 'Ejecución Plan de Negocio',
        'Porcentaje Dedicación': ''
    },
    {
        'Unidad Organizativa': 'Segmento Personas',
        'Reporta A': 'SGP Clientes',
        'Misión': 'Liderar la estrategia del negocio...',
        'Tipo de Función': 'Específica',
        'Descripción': 'Definir e implementar la propuesta...',
        'Producto Final': 'Propuesta de Valor',
        'Porcentaje Dedicación': '20'
    }
];

// Simular funciones del organigrama
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

function validateData(data) {
    const issues = [];
    let totalRecords = 0;
    let completeRecords = 0;
    let validationByType = {
        'Genérica': { total: 0, complete: 0 },
        'Específica': { total: 0, complete: 0 },
        'Indicador': { total: 0, complete: 0 }
    };

    data.forEach((row, index) => {
        totalRecords++;
        let rowIssues = [];
        let isComplete = true;

        // Validar campos obligatorios
        if (!row['Unidad Organizativa'] || row['Unidad Organizativa'].trim() === '') {
            rowIssues.push('Unidad Organizativa vacía');
            isComplete = false;
        }

        if (!row['Descripción'] || row['Descripción'].trim() === '') {
            rowIssues.push('Descripción vacía');
            isComplete = false;
        }

        if (!row['Tipo de Función'] || row['Tipo de Función'].trim() === '') {
            rowIssues.push('Tipo de Función vacío');
            isComplete = false;
        }

        // Validación específica por tipo
        const tipo = row['Tipo de Función'] || '';
        
        if (tipo.includes('Genérica')) {
            validationByType['Genérica'].total++;
            
            if (!row['Producto Final'] || row['Producto Final'].trim() === '') {
                rowIssues.push('Genérica: Producto Final requerido');
                isComplete = false;
            }
            
            if (row['Porcentaje Dedicación'] && row['Porcentaje Dedicación'].trim() !== '') {
                rowIssues.push('Genérica: No requiere Porcentaje Dedicación');
            }
            
            if (isComplete) validationByType['Genérica'].complete++;
            
        } else if (tipo.includes('Específica')) {
            validationByType['Específica'].total++;
            
            if (!row['Producto Final'] || row['Producto Final'].trim() === '') {
                rowIssues.push('Específica: Producto Final requerido');
                isComplete = false;
            }
            
            if (!row['Porcentaje Dedicación'] || row['Porcentaje Dedicación'].trim() === '') {
                rowIssues.push('Específica: Porcentaje Dedicación requerido');
                isComplete = false;
            }
            
            if (isComplete) validationByType['Específica'].complete++;
            
        } else if (tipo.includes('Indicador')) {
            validationByType['Indicador'].total++;
            
            if (row['Producto Final'] && row['Producto Final'].trim() !== '') {
                rowIssues.push('Indicador: No requiere Producto Final');
            }
            
            if (row['Porcentaje Dedicación'] && row['Porcentaje Dedicación'].trim() !== '') {
                rowIssues.push('Indicador: No requiere Porcentaje Dedicación');
            }
            
            if (isComplete) validationByType['Indicador'].complete++;
        }

        if (rowIssues.length > 0) {
            issues.push({
                row: index + 1,
                unidad: row['Unidad Organizativa'] || 'Sin unidad',
                tipo: row['Tipo de Función'] || 'Sin tipo',
                issues: rowIssues
            });
        }

        if (isComplete) completeRecords++;
    });

    const qualityScore = totalRecords > 0 ? Math.round((completeRecords / totalRecords) * 100) : 0;

    return {
        issues,
        stats: {
            totalRecords,
            completeRecords,
            qualityScore,
            validationByType
        }
    };
}

// Probar la exportación
console.log('=== DIAGNÓSTICO DE EXPORTACIÓN JSON ===');

const grouped = groupByUnidad(testData);
console.log('Datos agrupados:', grouped);

const tree = buildTree(testData);
console.log('Árbol jerárquico:', tree);

const validation = validateData(testData);
console.log('Validación:', validation);

// Simular la función de exportación
function exportJSONOptimized() {
    try {
        console.log('Iniciando exportación JSON optimizada...');
        
        const allData = [].concat(...Object.values(grouped));
        const validation = validateData(allData);
        const issues = validation.issues || [];
        const stats = validation.stats || {};

        console.log('Issues:', issues);
        console.log('Stats:', stats);
        console.log('Issues es array?', Array.isArray(issues));

        // Confirmar si hay issues críticos
        const criticalIssues = issues.filter(i => i.issues && i.issues.some(issue => issue.includes('requerido')));
        console.log('Issues críticos:', criticalIssues);

        // Estructura JSON optimizada
        const jsonData = {
            metadata: {
                exportDate: new Date().toISOString(),
                version: '2.0',
                format: 'optimized',
                totalRecords: allData.length,
                totalUnits: Object.keys(grouped).length,
                stats: stats,
                issues: issues,
                qualityScore: stats.qualityScore || 0
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
                        reportaA: child.funciones[0]?.['Reporta A'] || '',
                        mision: child.funciones[0]?.['Misión'] || ''
                    }))
                }))
            },
            data: {
                unidades: Object.entries(grouped).map(([nombre, funciones]) => ({
                    nombre,
                    reportaA: funciones[0]?.['Reporta A'] || '',
                    mision: funciones[0]?.['Misión'] || '',
                    funciones: funciones.map((func, index) => ({
                        orden: index + 1,
                        tipo: func['Tipo de Función'] || 'Genérica',
                        descripcion: func['Descripción'] || '',
                        productoFinal: func['Producto Final'] || '',
                        porcentajeDedicacion: func['Porcentaje Dedicación'] || ''
                    }))
                }))
            }
        };

        console.log('JSON generado:', JSON.stringify(jsonData, null, 2));
        console.log('✅ Exportación exitosa');
        
        return jsonData;

    } catch (error) {
        console.error('❌ Error en exportación:', error);
        throw error;
    }
}

// Ejecutar la prueba
try {
    const result = exportJSONOptimized();
    console.log('=== PRUEBA EXITOSA ===');
} catch (error) {
    console.error('=== PRUEBA FALLIDA ===');
    console.error('Error:', error.message);
}