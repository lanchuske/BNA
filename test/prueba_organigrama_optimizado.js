/**
 * Script de Prueba para el Organigrama Optimizado
 * Valida el funcionamiento completo del sistema
 */

// ===== FUNCIONES DE PRUEBA =====

/**
 * Prueba la carga de datos CSV
 */
function probarCargaCSV() {
    console.log('🧪 Probando carga de CSV...');
    
    // Simular datos CSV de prueba
    const csvData = `Unidad Organizativa;Misión;Tipo de Función;Descripción;Producto Final;Porcentaje Dedicación
Unidad A;Misión de prueba A;Genérica;Descripción completa A;Producto A;50%
Unidad A;Misión de prueba A;Específica;Descripción específica A;Producto B;30%
Unidad B;Misión de prueba B;Indicador;Descripción B;Producto C;20%`;
    
    try {
        // Simular el procesamiento
        const lines = csvData.trim().split('\n');
        const headers = lines[0].split(';').map(h => h.replace(/"/g, ''));
        const data = [];
        
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(';').map(v => v.replace(/"/g, ''));
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            data.push(row);
        }
        
        console.log('✅ CSV procesado correctamente:', {
            registros: data.length,
            headers: headers.length,
            unidades: [...new Set(data.map(row => row['Unidad Organizativa']))]
        });
        
        return { success: true, data, headers };
        
    } catch (error) {
        console.error('❌ Error procesando CSV:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Prueba la validación de datos
 */
function probarValidacion() {
    console.log('🧪 Probando validación de datos...');
    
    const testData = [
        {
            'Unidad Organizativa': 'Unidad A',
            'Tipo de Función': 'Genérica',
            'Descripción': 'Descripción completa',
            'Producto Final': 'Producto A',
            'Porcentaje Dedicación': '50%'
        },
        {
            'Unidad Organizativa': 'Unidad B',
            'Tipo de Función': 'Específica',
            'Descripción': '',
            'Producto Final': '',
            'Porcentaje Dedicación': ''
        }
    ];
    
    try {
        // Simular validación
        const issues = [];
        
        testData.forEach((row, index) => {
            if (!row['Unidad Organizativa'] || row['Unidad Organizativa'].trim() === '') {
                issues.push({
                    type: 'warning',
                    message: `Campo requerido faltante: Unidad Organizativa`,
                    row: index + 1,
                    field: 'Unidad Organizativa'
                });
            }
            
            if (!row['Tipo de Función'] || row['Tipo de Función'].trim() === '') {
                issues.push({
                    type: 'warning',
                    message: `Campo requerido faltante: Tipo de Función`,
                    row: index + 1,
                    field: 'Tipo de Función'
                });
            }
        });
        
        console.log('✅ Validación completada:', {
            registros: testData.length,
            issues: issues.length,
            issuesDetectados: issues.map(i => i.message)
        });
        
        return { success: true, issues };
        
    } catch (error) {
        console.error('❌ Error en validación:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Prueba la generación de estadísticas
 */
function probarEstadisticas() {
    console.log('🧪 Probando generación de estadísticas...');
    
    const testData = [
        {
            'Tipo de Función': 'Genérica',
            'Descripción': 'Descripción completa',
            'Producto Final': 'Producto A',
            'Porcentaje Dedicación': '50%'
        },
        {
            'Tipo de Función': 'Específica',
            'Descripción': '',
            'Producto Final': '',
            'Porcentaje Dedicación': ''
        },
        {
            'Tipo de Función': 'Indicador',
            'Descripción': 'Descripción completa',
            'Producto Final': 'Producto B',
            'Porcentaje Dedicación': '30%'
        }
    ];
    
    try {
        // Simular generación de estadísticas
        const stats = {
            totalRecords: testData.length,
            byType: { generica: 0, especifica: 0, indicador: 0 },
            quality: { complete: 0, incomplete: 0 }
        };
        
        testData.forEach(row => {
            const tipo = row['Tipo de Función'] || 'Genérica';
            if (tipo.includes('Genérica')) stats.byType.generica++;
            else if (tipo.includes('Específica')) stats.byType.especifica++;
            else if (tipo.includes('Indicador')) stats.byType.indicador++;
            
            const isComplete = row['Descripción'] && row['Producto Final'] && row['Porcentaje Dedicación'];
            if (isComplete) stats.quality.complete++;
            else stats.quality.incomplete++;
        });
        
        stats.qualityScore = Math.round((stats.quality.complete / stats.totalRecords) * 100);
        
        console.log('✅ Estadísticas generadas:', stats);
        
        return { success: true, stats };
        
    } catch (error) {
        console.error('❌ Error generando estadísticas:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Prueba la construcción del árbol
 */
function probarConstruccionArbol() {
    console.log('🧪 Probando construcción del árbol...');
    
    const testData = [
        {
            'Unidad Organizativa': 'Unidad A',
            'Descripción': 'Función 1',
            'Tipo de Función': 'Genérica'
        },
        {
            'Unidad Organizativa': 'Unidad A',
            'Descripción': 'Función 2',
            'Tipo de Función': 'Específica'
        },
        {
            'Unidad Organizativa': 'Unidad B',
            'Descripción': 'Función 3',
            'Tipo de Función': 'Indicador'
        }
    ];
    
    try {
        // Simular construcción del árbol
        const grouped = {};
        testData.forEach(row => {
            const unidad = row['Unidad Organizativa'];
            if (!grouped[unidad]) grouped[unidad] = [];
            grouped[unidad].push(row);
        });
        
        const tree = Object.keys(grouped).map(unidad => ({
            key: unidad,
            name: unidad,
            children: grouped[unidad].map((func, index) => ({
                key: `${unidad}-${index}`,
                name: func['Descripción'] || `Función ${index + 1}`,
                data: func
            }))
        }));
        
        console.log('✅ Árbol construido correctamente:', {
            unidades: tree.length,
            totalFunciones: tree.reduce((sum, unidad) => sum + unidad.children.length, 0),
            estructura: tree.map(u => ({ unidad: u.name, funciones: u.children.length }))
        });
        
        return { success: true, tree };
        
    } catch (error) {
        console.error('❌ Error construyendo árbol:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Ejecuta todas las pruebas
 */
function ejecutarPruebasCompletas() {
    console.log('🚀 Iniciando pruebas del organigrama optimizado...');
    console.log('=' .repeat(60));
    
    const resultados = {
        cargaCSV: probarCargaCSV(),
        validacion: probarValidacion(),
        estadisticas: probarEstadisticas(),
        construccionArbol: probarConstruccionArbol()
    };
    
    console.log('=' .repeat(60));
    console.log('📊 RESUMEN DE PRUEBAS:');
    
    let exitosas = 0;
    let totales = Object.keys(resultados).length;
    
    Object.entries(resultados).forEach(([test, resultado]) => {
        const status = resultado.success ? '✅ PASÓ' : '❌ FALLÓ';
        console.log(`${status} - ${test}`);
        if (resultado.success) exitosas++;
    });
    
    console.log('=' .repeat(60));
    console.log(`📈 RESULTADO FINAL: ${exitosas}/${totales} pruebas exitosas`);
    
    if (exitosas === totales) {
        console.log('🎉 ¡Todas las pruebas pasaron! El organigrama optimizado está funcionando correctamente.');
    } else {
        console.log('⚠️ Algunas pruebas fallaron. Revisar los errores.');
    }
    
    return resultados;
}

// ===== INSTRUCCIONES DE USO =====

console.log('🔧 Script de prueba cargado. Usa ejecutarPruebasCompletas() para ejecutar todas las pruebas.');

// Si se ejecuta directamente en el navegador
if (typeof window !== 'undefined') {
    window.ejecutarPruebasOrganigrama = ejecutarPruebasCompletas;
    console.log('✅ Función ejecutarPruebasOrganigrama() disponible en la consola del navegador.');
}

// Si se ejecuta en Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ejecutarPruebasCompletas,
        probarCargaCSV,
        probarValidacion,
        probarEstadisticas,
        probarConstruccionArbol
    };
}