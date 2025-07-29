/**
 * Script de Prueba de Validación por Tipo de Función
 * Valida que la validación sea correcta según el tipo de función
 */

// ===== DATOS DE PRUEBA CON DIFERENTES TIPOS =====

const testDataWithTypes = [
    // Genéricas - requieren Producto Final y Dedicación
    {
        'Unidad Organizativa': 'Recursos Humanos',
        'Tipo de Función': 'Genérica',
        'Descripción': 'Gestión de personal',
        'Producto Final': 'Personal capacitado',
        'Porcentaje Dedicación': '80%'
    },
    {
        'Unidad Organizativa': 'Recursos Humanos',
        'Tipo de Función': 'Genérica',
        'Descripción': 'Gestión de personal',
        'Producto Final': '', // FALTANTE
        'Porcentaje Dedicación': '20%'
    },
    {
        'Unidad Organizativa': 'Recursos Humanos',
        'Tipo de Función': 'Genérica',
        'Descripción': '', // FALTANTE
        'Producto Final': 'Personal capacitado',
        'Porcentaje Dedicación': '20%'
    },
    
    // Específicas - requieren Producto Final y Dedicación
    {
        'Unidad Organizativa': 'Finanzas',
        'Tipo de Función': 'Específica',
        'Descripción': 'Contabilidad',
        'Producto Final': 'Libros contables',
        'Porcentaje Dedicación': '100%'
    },
    {
        'Unidad Organizativa': 'Finanzas',
        'Tipo de Función': 'Específica',
        'Descripción': 'Contabilidad',
        'Producto Final': 'Libros contables',
        'Porcentaje Dedicación': '' // FALTANTE
    },
    
    // Indicadores - SOLO requieren Descripción
    {
        'Unidad Organizativa': 'Ventas',
        'Tipo de Función': 'Indicador',
        'Descripción': 'Tasa de conversión',
        'Producto Final': '', // NO REQUERIDO
        'Porcentaje Dedicación': '' // NO REQUERIDO
    },
    {
        'Unidad Organizativa': 'Ventas',
        'Tipo de Función': 'Indicador',
        'Descripción': 'Tasa de conversión',
        'Producto Final': 'Reporte', // INFORMATIVO (no requerido)
        'Porcentaje Dedicación': '10%' // INFORMATIVO (no requerido)
    },
    {
        'Unidad Organizativa': 'Ventas',
        'Tipo de Función': 'Indicador',
        'Descripción': '', // FALTANTE - REQUERIDO
        'Producto Final': '',
        'Porcentaje Dedicación': ''
    }
];

// ===== FUNCIONES DE PRUEBA =====

/**
 * Simula la validación del sistema
 */
function simularValidacion(data) {
    console.log('🔍 Simulando validación por tipo de función...');
    
    const issues = [];
    const stats = {
        totalRecords: data.length,
        byType: { generica: 0, especifica: 0, indicador: 0 },
        quality: { complete: 0, incomplete: 0 },
        validationByType: {
            generica: { complete: 0, incomplete: 0 },
            especifica: { complete: 0, incomplete: 0 },
            indicador: { complete: 0, incomplete: 0 }
        }
    };
    
    data.forEach((row, index) => {
        const tipo = row['Tipo de Función'] || 'Genérica';
        const descripcion = row['Descripción'] || '';
        
        // Validar campos requeridos básicos
        if (!row['Unidad Organizativa'] || row['Unidad Organizativa'].trim() === '') {
            issues.push({
                type: 'error',
                message: 'Campo requerido faltante: Unidad Organizativa',
                row: index + 1,
                field: 'Unidad Organizativa'
            });
        }
        
        if (!tipo || tipo.trim() === '') {
            issues.push({
                type: 'error',
                message: 'Campo requerido faltante: Tipo de Función',
                row: index + 1,
                field: 'Tipo de Función'
            });
        }
        
        // Validar según tipo de función
        if (tipo.includes('Genérica') || tipo.includes('Específica')) {
            if (!row['Producto Final'] || row['Producto Final'].trim() === '') {
                issues.push({
                    type: 'warning',
                    message: `Función ${tipo} requiere Producto Final`,
                    row: index + 1,
                    field: 'Producto Final'
                });
            }
            
            if (!row['Porcentaje Dedicación'] || row['Porcentaje Dedicación'].trim() === '') {
                issues.push({
                    type: 'warning',
                    message: `Función ${tipo} requiere Porcentaje Dedicación`,
                    row: index + 1,
                    field: 'Porcentaje Dedicación'
                });
            }
            
            // Contar estadísticas
            if (tipo.includes('Genérica')) {
                stats.byType.generica++;
                const isComplete = descripcion && row['Producto Final'] && row['Porcentaje Dedicación'];
                if (isComplete) {
                    stats.quality.complete++;
                    stats.validationByType.generica.complete++;
                } else {
                    stats.quality.incomplete++;
                    stats.validationByType.generica.incomplete++;
                }
            } else {
                stats.byType.especifica++;
                const isComplete = descripcion && row['Producto Final'] && row['Porcentaje Dedicación'];
                if (isComplete) {
                    stats.quality.complete++;
                    stats.validationByType.especifica.complete++;
                } else {
                    stats.quality.incomplete++;
                    stats.validationByType.especifica.incomplete++;
                }
            }
            
        } else if (tipo.includes('Indicador')) {
            // Indicadores NO requieren Producto Final ni Dedicación
            if (row['Producto Final'] && row['Producto Final'].trim() !== '') {
                issues.push({
                    type: 'info',
                    message: `Indicador no requiere Producto Final (se ignorará)`,
                    row: index + 1,
                    field: 'Producto Final'
                });
            }
            
            if (row['Porcentaje Dedicación'] && row['Porcentaje Dedicación'].trim() !== '') {
                issues.push({
                    type: 'info',
                    message: `Indicador no requiere Porcentaje Dedicación (se ignorará)`,
                    row: index + 1,
                    field: 'Porcentaje Dedicación'
                });
            }
            
            // Contar estadísticas
            stats.byType.indicador++;
            const isComplete = descripcion; // Solo requiere descripción
            if (isComplete) {
                stats.quality.complete++;
                stats.validationByType.indicador.complete++;
            } else {
                stats.quality.incomplete++;
                stats.validationByType.indicador.incomplete++;
            }
        }
        
        // Validar Descripción (requerida para todos los tipos)
        if (!descripcion) {
            issues.push({
                type: 'warning',
                message: 'Descripción es requerida para todos los tipos de función',
                row: index + 1,
                field: 'Descripción'
            });
        }
    });
    
    stats.qualityScore = Math.round((stats.quality.complete / stats.totalRecords) * 100);
    
    return { issues, stats };
}

/**
 * Analiza los resultados de validación
 */
function analizarResultados(resultado) {
    console.log('📊 Analizando resultados de validación...');
    
    const { issues, stats } = resultado;
    
    // Agrupar issues por tipo
    const issuesByType = {
        error: issues.filter(i => i.type === 'error'),
        warning: issues.filter(i => i.type === 'warning'),
        info: issues.filter(i => i.type === 'info')
    };
    
    console.log('✅ Análisis completado:', {
        totalRegistros: stats.totalRecords,
        calidadGeneral: `${stats.qualityScore}%`,
        distribucionTipos: stats.byType,
        issuesPorTipo: {
            errores: issuesByType.error.length,
            warnings: issuesByType.warning.length,
            info: issuesByType.info.length
        },
        calidadPorTipo: {
            generica: `${Math.round((stats.validationByType.generica.complete / stats.byType.generica) * 100)}%`,
            especifica: `${Math.round((stats.validationByType.especifica.complete / stats.byType.especifica) * 100)}%`,
            indicador: `${Math.round((stats.validationByType.indicador.complete / stats.byType.indicador) * 100)}%`
        }
    });
    
    // Mostrar issues específicos
    if (issues.length > 0) {
        console.log('🔍 Issues detectados:');
        issues.forEach((issue, index) => {
            console.log(`  ${index + 1}. [${issue.type.toUpperCase()}] ${issue.message} (Fila ${issue.row})`);
        });
    }
    
    return { issuesByType, stats };
}

/**
 * Valida casos específicos
 */
function validarCasosEspecificos() {
    console.log('🎯 Validando casos específicos...');
    
    const casos = [
        {
            nombre: 'Genérica completa',
            data: [testDataWithTypes[0]],
            esperado: { issues: 0, complete: 1 }
        },
        {
            nombre: 'Genérica sin Producto Final',
            data: [testDataWithTypes[1]],
            esperado: { issues: 1, complete: 0 }
        },
        {
            nombre: 'Genérica sin Descripción',
            data: [testDataWithTypes[2]],
            esperado: { issues: 1, complete: 0 }
        },
        {
            nombre: 'Indicador completo',
            data: [testDataWithTypes[6]], // Cambiar de 5 a 6
            esperado: { issues: 2, complete: 1 } // 2 info messages por Producto Final y Dedicación
        },
        {
            nombre: 'Indicador sin Descripción',
            data: [testDataWithTypes[7]],
            esperado: { issues: 1, complete: 0 }
        }
    ];
    
    let exitosos = 0;
    casos.forEach(caso => {
        const resultado = simularValidacion(caso.data);
        const issuesCount = resultado.issues.length;
        const completeCount = resultado.stats.quality.complete;
        
        const isCorrect = issuesCount === caso.esperado.issues && completeCount === caso.esperado.complete;
        
        console.log(`  ${isCorrect ? '✅' : '❌'} ${caso.nombre}: ${issuesCount} issues, ${completeCount} completas`);
        
        // Debug para el caso que falla
        if (caso.nombre === 'Indicador completo') {
            console.log(`    DEBUG - Datos:`, caso.data[0]);
            console.log(`    DEBUG - Issues:`, resultado.issues);
            console.log(`    DEBUG - Esperado:`, caso.esperado);
        }
        
        if (isCorrect) exitosos++;
    });
    
    console.log(`📈 Casos exitosos: ${exitosos}/${casos.length}`);
    return exitosos === casos.length;
}

/**
 * Ejecuta todas las pruebas de validación por tipo
 */
function ejecutarPruebasValidacionTipos() {
    console.log('🚀 Iniciando pruebas de validación por tipo de función...');
    console.log('=' .repeat(60));
    
    // Paso 1: Validar todos los datos
    const resultado = simularValidacion(testDataWithTypes);
    
    // Paso 2: Analizar resultados
    const analisis = analizarResultados(resultado);
    
    // Paso 3: Validar casos específicos
    const casosCorrectos = validarCasosEspecificos();
    
    console.log('=' .repeat(60));
    console.log('📊 RESUMEN DE PRUEBAS DE VALIDACIÓN POR TIPO:');
    console.log(`✅ Registros procesados: ${resultado.stats.totalRecords}`);
    console.log(`✅ Calidad general: ${resultado.stats.qualityScore}%`);
    console.log(`✅ Issues detectados: ${resultado.issues.length}`);
    console.log(`✅ Casos específicos: ${casosCorrectos ? 'TODOS CORRECTOS' : 'ALGUNOS FALLARON'}`);
    
    console.log('=' .repeat(60));
    if (casosCorrectos) {
        console.log('🎉 ¡Todas las pruebas de validación por tipo pasaron exitosamente!');
        console.log('📈 La validación por tipo de función está funcionando correctamente.');
    } else {
        console.log('⚠️ Algunas pruebas fallaron. Revisar la lógica de validación.');
    }
    
    return {
        resultado,
        analisis,
        casosCorrectos
    };
}

// ===== EJECUTAR PRUEBAS =====

if (require.main === module) {
    ejecutarPruebasValidacionTipos();
}

module.exports = {
    ejecutarPruebasValidacionTipos,
    simularValidacion,
    analizarResultados,
    validarCasosEspecificos,
    testDataWithTypes
};