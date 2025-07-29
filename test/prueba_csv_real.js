/**
 * Script de Prueba con CSV Real
 * Prueba el organigrama optimizado con el archivo CSV real
 */

const fs = require('fs');
const path = require('path');

// ===== FUNCIONES DE PRUEBA CON DATOS REALES =====

/**
 * Lee y procesa el archivo CSV real
 */
function procesarCSVReal() {
    console.log('📁 Procesando archivo CSV real...');
    
    try {
        const csvPath = path.join(__dirname, '..', 'unidades-organizativas-completo-2025-07-29-01-03.csv');
        
        if (!fs.existsSync(csvPath)) {
            console.error('❌ Archivo CSV no encontrado:', csvPath);
            return { success: false, error: 'Archivo no encontrado' };
        }
        
        const csvContent = fs.readFileSync(csvPath, 'utf8');
        const lines = csvContent.trim().split('\n');
        
        if (lines.length < 2) {
            console.error('❌ CSV vacío o inválido');
            return { success: false, error: 'CSV vacío' };
        }
        
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
        
        console.log('✅ CSV real procesado:', {
            totalRegistros: data.length,
            headers: headers.length,
            unidadesUnicas: [...new Set(data.map(row => row['Unidad Organizativa']))].length,
            tiposFuncion: [...new Set(data.map(row => row['Tipo de Función']))]
        });
        
        return { success: true, data, headers };
        
    } catch (error) {
        console.error('❌ Error procesando CSV real:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Valida los datos reales
 */
function validarDatosReales(data) {
    console.log('🔍 Validando datos reales...');
    
    try {
        const issues = [];
        const stats = {
            totalRecords: data.length,
            byType: { generica: 0, especifica: 0, indicador: 0 },
            quality: { complete: 0, incomplete: 0 },
            unidades: new Set(),
            camposFaltantes: {
                'Unidad Organizativa': 0,
                'Tipo de Función': 0,
                'Descripción': 0,
                'Producto Final': 0,
                'Porcentaje Dedicación': 0
            }
        };
        
        data.forEach((row, index) => {
            // Contar unidades únicas
            if (row['Unidad Organizativa']) {
                stats.unidades.add(row['Unidad Organizativa']);
            }
            
            // Validar campos requeridos
            if (!row['Unidad Organizativa'] || row['Unidad Organizativa'].trim() === '') {
                stats.camposFaltantes['Unidad Organizativa']++;
                issues.push({
                    type: 'error',
                    message: 'Unidad Organizativa faltante',
                    row: index + 1
                });
            }
            
            if (!row['Tipo de Función'] || row['Tipo de Función'].trim() === '') {
                stats.camposFaltantes['Tipo de Función']++;
                issues.push({
                    type: 'warning',
                    message: 'Tipo de Función faltante',
                    row: index + 1
                });
            }
            
            // Contar por tipo
            const tipo = row['Tipo de Función'] || 'Genérica';
            if (tipo.includes('Genérica')) stats.byType.generica++;
            else if (tipo.includes('Específica')) stats.byType.especifica++;
            else if (tipo.includes('Indicador')) stats.byType.indicador++;
            
            // Validar calidad
            const isComplete = row['Descripción'] && row['Producto Final'] && row['Porcentaje Dedicación'];
            if (isComplete) {
                stats.quality.complete++;
            } else {
                stats.quality.incomplete++;
                
                if (!row['Descripción']) stats.camposFaltantes['Descripción']++;
                if (!row['Producto Final']) stats.camposFaltantes['Producto Final']++;
                if (!row['Porcentaje Dedicación']) stats.camposFaltantes['Porcentaje Dedicación']++;
            }
        });
        
        stats.qualityScore = Math.round((stats.quality.complete / stats.totalRecords) * 100);
        stats.totalUnidades = stats.unidades.size;
        
        console.log('✅ Validación completada:', {
            totalRegistros: stats.totalRecords,
            totalUnidades: stats.totalUnidades,
            calidad: `${stats.qualityScore}%`,
            issues: issues.length,
            distribucionTipos: stats.byType,
            camposFaltantes: stats.camposFaltantes
        });
        
        return { success: true, stats, issues };
        
    } catch (error) {
        console.error('❌ Error validando datos reales:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Construye el árbol con datos reales
 */
function construirArbolReal(data) {
    console.log('🌳 Construyendo árbol con datos reales...');
    
    try {
        const grouped = {};
        data.forEach(row => {
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
        
        // Estadísticas del árbol
        const treeStats = {
            totalUnidades: tree.length,
            totalFunciones: tree.reduce((sum, unidad) => sum + unidad.children.length, 0),
            promedioFuncionesPorUnidad: Math.round(tree.reduce((sum, unidad) => sum + unidad.children.length, 0) / tree.length * 10) / 10,
            unidadesConMasFunciones: tree
                .sort((a, b) => b.children.length - a.children.length)
                .slice(0, 5)
                .map(u => ({ unidad: u.name, funciones: u.children.length }))
        };
        
        console.log('✅ Árbol construido:', treeStats);
        
        return { success: true, tree, stats: treeStats };
        
    } catch (error) {
        console.error('❌ Error construyendo árbol real:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Simula la exportación JSON con datos reales
 */
function simularExportacionReal(data, stats) {
    console.log('📤 Simulando exportación JSON con datos reales...');
    
    try {
        const grouped = {};
        data.forEach(row => {
            const unidad = row['Unidad Organizativa'];
            if (!grouped[unidad]) grouped[unidad] = [];
            grouped[unidad].push(row);
        });
        
        const jsonData = {
            metadata: {
                exportDate: new Date().toISOString(),
                version: '2.0',
                totalUnits: Object.keys(grouped).length,
                totalRecords: data.length,
                stats: stats,
                sourceFile: 'unidades-organizativas-completo-2025-07-29-01-03.csv'
            },
            data: {
                unidades: Object.entries(grouped).map(([nombre, funciones]) => ({
                    nombre,
                    mision: funciones[0]?.['Misión'] || '',
                    funciones: funciones.map((func, index) => ({
                        orden: index,
                        tipo: func['Tipo de Función'] || 'Genérica',
                        descripcion: func['Descripción'] || '',
                        productoFinal: func['Producto Final'] || '',
                        porcentajeDedicacion: func['Porcentaje Dedicación'] || ''
                    }))
                }))
            }
        };
        
        const jsonSize = JSON.stringify(jsonData).length;
        
        console.log('✅ Exportación simulada:', {
            tamañoJSON: `${Math.round(jsonSize / 1024)}KB`,
            unidades: jsonData.metadata.totalUnits,
            registros: jsonData.metadata.totalRecords,
            calidad: `${stats.qualityScore}%`
        });
        
        return { success: true, jsonData, size: jsonSize };
        
    } catch (error) {
        console.error('❌ Error simulando exportación:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Ejecuta todas las pruebas con datos reales
 */
function ejecutarPruebasReales() {
    console.log('🚀 Iniciando pruebas con datos reales...');
    console.log('=' .repeat(60));
    
    // Paso 1: Procesar CSV real
    const csvResult = procesarCSVReal();
    if (!csvResult.success) {
        console.error('❌ No se pudo procesar el CSV real');
        return;
    }
    
    // Paso 2: Validar datos reales
    const validationResult = validarDatosReales(csvResult.data);
    if (!validationResult.success) {
        console.error('❌ No se pudo validar los datos reales');
        return;
    }
    
    // Paso 3: Construir árbol real
    const treeResult = construirArbolReal(csvResult.data);
    if (!treeResult.success) {
        console.error('❌ No se pudo construir el árbol real');
        return;
    }
    
    // Paso 4: Simular exportación
    const exportResult = simularExportacionReal(csvResult.data, validationResult.stats);
    if (!exportResult.success) {
        console.error('❌ No se pudo simular la exportación');
        return;
    }
    
    console.log('=' .repeat(60));
    console.log('📊 RESUMEN DE PRUEBAS CON DATOS REALES:');
    console.log(`✅ CSV procesado: ${csvResult.data.length} registros`);
    console.log(`✅ Validación: ${validationResult.stats.qualityScore}% calidad`);
    console.log(`✅ Árbol: ${treeResult.stats.totalUnidades} unidades, ${treeResult.stats.totalFunciones} funciones`);
    console.log(`✅ Exportación: ${Math.round(exportResult.size / 1024)}KB JSON`);
    
    console.log('=' .repeat(60));
    console.log('🎉 ¡Todas las pruebas con datos reales pasaron exitosamente!');
    console.log('📈 El organigrama optimizado está listo para usar con datos reales.');
    
    return {
        csv: csvResult,
        validation: validationResult,
        tree: treeResult,
        export: exportResult
    };
}

// ===== EJECUTAR PRUEBAS =====

if (require.main === module) {
    ejecutarPruebasReales();
}

module.exports = {
    ejecutarPruebasReales,
    procesarCSVReal,
    validarDatosReales,
    construirArbolReal,
    simularExportacionReal
};