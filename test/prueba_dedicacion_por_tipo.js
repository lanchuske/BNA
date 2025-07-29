// Prueba de validación de porcentaje de dedicación por tipo de función
console.log('=== PRUEBA: DEDICACIÓN POR TIPO DE FUNCIÓN ===');

// Datos de prueba
const testData = [
    {
        'Unidad Organizativa': 'Test Unit',
        'Tipo de Función': 'Genérica',
        'Descripción': 'Función genérica de prueba',
        'Producto Final': 'Producto de prueba',
        'Porcentaje Dedicación': '20' // NO debería requerirse
    },
    {
        'Unidad Organizativa': 'Test Unit',
        'Tipo de Función': 'Específica',
        'Descripción': 'Función específica de prueba',
        'Producto Final': 'Producto de prueba',
        'Porcentaje Dedicación': '30' // SÍ debería requerirse
    },
    {
        'Unidad Organizativa': 'Test Unit',
        'Tipo de Función': 'Indicador',
        'Descripción': 'Función indicador de prueba',
        'Producto Final': '', // NO debería requerirse
        'Porcentaje Dedicación': '' // NO debería requerirse
    },
    {
        'Unidad Organizativa': 'Test Unit',
        'Tipo de Función': 'Genérica',
        'Descripción': 'Función genérica sin dedicación',
        'Producto Final': 'Producto de prueba',
        'Porcentaje Dedicación': '' // NO debería requerirse
    },
    {
        'Unidad Organizativa': 'Test Unit',
        'Tipo de Función': 'Específica',
        'Descripción': 'Función específica sin dedicación',
        'Producto Final': 'Producto de prueba',
        'Porcentaje Dedicación': '' // SÍ debería requerirse (ERROR)
    }
];

// Simular la función de validación
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
            
            // Genéricas requieren Producto Final pero NO Dedicación
            if (!row['Producto Final'] || row['Producto Final'].trim() === '') {
                rowIssues.push('Genérica: Producto Final requerido');
                isComplete = false;
            }
            
            // Si tiene dedicación, es info (no error)
            if (row['Porcentaje Dedicación'] && row['Porcentaje Dedicación'].trim() !== '') {
                rowIssues.push('Genérica: No requiere Porcentaje Dedicación');
            }
            
            if (isComplete) validationByType['Genérica'].complete++;
            
        } else if (tipo.includes('Específica')) {
            validationByType['Específica'].total++;
            
            // Específicas requieren Producto Final Y Dedicación
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
            
            // Indicadores NO requieren Producto Final ni Dedicación
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

    return {
        issues,
        stats: {
            totalRecords,
            completeRecords,
            qualityScore: totalRecords > 0 ? Math.round((completeRecords / totalRecords) * 100) : 0,
            validationByType
        }
    };
}

// Ejecutar validación
const result = validateData(testData);

console.log('Resultados de validación:');
console.log('Total registros:', result.stats.totalRecords);
console.log('Registros completos:', result.stats.completeRecords);
console.log('Calidad:', result.stats.qualityScore + '%');

console.log('\nEstadísticas por tipo:');
Object.entries(result.stats.validationByType).forEach(([tipo, stats]) => {
    console.log(`${tipo}: ${stats.complete}/${stats.total} completas`);
});

console.log('\nProblemas encontrados:');
result.issues.forEach(issue => {
    console.log(`Fila ${issue.row} (${issue.tipo}): ${issue.issues.join(', ')}`);
});

// Verificar casos específicos
console.log('\n=== VERIFICACIÓN DE CASOS ESPECÍFICOS ===');

// Caso 1: Genérica con dedicación (debería generar info)
const caso1 = result.issues.find(i => i.row === 1 && i.issues.some(issue => issue.includes('Genérica: No requiere')));
console.log('✅ Caso 1 - Genérica con dedicación:', caso1 ? 'CORRECTO (info generado)' : '❌ ERROR');

// Caso 2: Específica sin dedicación (debería generar error)
const caso2 = result.issues.find(i => i.row === 5 && i.issues.some(issue => issue.includes('Específica: Porcentaje Dedicación requerido')));
console.log('✅ Caso 2 - Específica sin dedicación:', caso2 ? 'CORRECTO (error generado)' : '❌ ERROR');

// Caso 3: Indicador con campos (debería generar info)
const caso3 = result.issues.find(i => i.row === 3 && i.issues.some(issue => issue.includes('Indicador: No requiere')));
console.log('✅ Caso 3 - Indicador con campos:', caso3 ? 'CORRECTO (info generado)' : '❌ ERROR');

console.log('\n=== PRUEBA COMPLETADA ===');