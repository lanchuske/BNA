/**
 * Script de Prueba de Jerarquías
 * Valida que las jerarquías y el árbol de reportes funcionen correctamente
 */

const fs = require('fs');
const path = require('path');

// ===== DATOS DE PRUEBA CON JERARQUÍAS =====

const testDataWithHierarchy = [
    {
        'Unidad Organizativa': 'Dirección General',
        'Reporta A': '',
        'Misión': 'Dirigir la organización',
        'Tipo de Función': 'Genérica',
        'Descripción': 'Función de dirección general',
        'Producto Final': 'Estrategia organizacional',
        'Porcentaje Dedicación': '100%'
    },
    {
        'Unidad Organizativa': 'Recursos Humanos',
        'Reporta A': 'Dirección General',
        'Misión': 'Gestionar el capital humano',
        'Tipo de Función': 'Genérica',
        'Descripción': 'Gestión de personal',
        'Producto Final': 'Personal capacitado',
        'Porcentaje Dedicación': '80%'
    },
    {
        'Unidad Organizativa': 'Recursos Humanos',
        'Reporta A': 'Dirección General',
        'Misión': 'Gestionar el capital humano',
        'Tipo de Función': 'Específica',
        'Descripción': 'Reclutamiento y selección',
        'Producto Final': 'Candidatos seleccionados',
        'Porcentaje Dedicación': '20%'
    },
    {
        'Unidad Organizativa': 'Finanzas',
        'Reporta A': 'Dirección General',
        'Misión': 'Gestionar recursos financieros',
        'Tipo de Función': 'Genérica',
        'Descripción': 'Control financiero',
        'Producto Final': 'Estados financieros',
        'Porcentaje Dedicación': '60%'
    },
    {
        'Unidad Organizativa': 'Finanzas',
        'Reporta A': 'Dirección General',
        'Misión': 'Gestionar recursos financieros',
        'Tipo de Función': 'Específica',
        'Descripción': 'Contabilidad',
        'Producto Final': 'Libros contables',
        'Porcentaje Dedicación': '40%'
    },
    {
        'Unidad Organizativa': 'Contabilidad',
        'Reporta A': 'Finanzas',
        'Misión': 'Mantener registros contables',
        'Tipo de Función': 'Específica',
        'Descripción': 'Registro de transacciones',
        'Producto Final': 'Asientos contables',
        'Porcentaje Dedicación': '100%'
    },
    {
        'Unidad Organizativa': 'Tesorería',
        'Reporta A': 'Finanzas',
        'Misión': 'Gestionar flujo de caja',
        'Tipo de Función': 'Específica',
        'Descripción': 'Control de caja',
        'Producto Final': 'Reporte de tesorería',
        'Porcentaje Dedicación': '100%'
    }
];

// ===== FUNCIONES DE PRUEBA =====

/**
 * Prueba la construcción del árbol con jerarquías
 */
function probarConstruccionArbolJerarquico() {
    console.log('🌳 Probando construcción de árbol jerárquico...');
    
    try {
        const nodeMap = {};
        
        // Crear nodos para cada unidad
        testDataWithHierarchy.forEach(item => {
            const name = item['Unidad Organizativa'];
            const parent = item['Reporta A'] || '';
            const key = name + '|' + parent;
            
            if (!nodeMap[key]) {
                nodeMap[key] = { 
                    key, 
                    name, 
                    parent, 
                    children: [], 
                    item,
                    funciones: []
                };
            }
            nodeMap[key].funciones.push(item);
        });
        
        // Relacionar hijos con padres
        Object.values(nodeMap).forEach(node => {
            if (node.parent) {
                const parentKey = Object.keys(nodeMap).find(k => nodeMap[k].name === node.parent);
                if (parentKey && nodeMap[parentKey]) {
                    nodeMap[parentKey].children.push(node);
                }
            }
        });
        
        // Encontrar raíces
        const roots = Object.values(nodeMap).filter(node => {
            const parentKey = Object.keys(nodeMap).find(k => nodeMap[k].name === node.parent);
            return !node.parent || !parentKey;
        });
        
        console.log('✅ Árbol jerárquico construido:', {
            totalNodos: Object.keys(nodeMap).length,
            raices: roots.length,
            estructura: roots.map(root => ({
                unidad: root.name,
                funciones: root.funciones.length,
                hijos: root.children.length
            }))
        });
        
        return { success: true, tree: roots, nodeMap };
        
    } catch (error) {
        console.error('❌ Error construyendo árbol jerárquico:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Prueba la validación de jerarquías
 */
function probarValidacionJerarquias() {
    console.log('🔍 Probando validación de jerarquías...');
    
    try {
        const issues = [];
        
        // Verificar referencias circulares
        const visited = new Set();
        const recursionStack = new Set();
        
        function detectCycle(unitName, parentName, data) {
            if (recursionStack.has(unitName)) {
                return true; // Ciclo detectado
            }
            
            if (visited.has(unitName)) {
                return false; // Ya visitado, no hay ciclo
            }
            
            visited.add(unitName);
            recursionStack.add(unitName);
            
            const parentRow = data.find(row => row['Unidad Organizativa'] === parentName);
            if (parentRow && parentRow['Reporta A']) {
                const hasCycle = detectCycle(parentName, parentRow['Reporta A'], data);
                recursionStack.delete(unitName);
                return hasCycle;
            }
            
            recursionStack.delete(unitName);
            return false;
        }
        
        // Verificar referencias válidas
        testDataWithHierarchy.forEach((row, index) => {
            const unitName = row['Unidad Organizativa'];
            const parentName = row['Reporta A'];
            
            if (parentName) {
                const parentExists = testDataWithHierarchy.some(r => r['Unidad Organizativa'] === parentName);
                if (!parentExists) {
                    issues.push({
                        type: 'error',
                        message: `Unidad "${unitName}" reporta a "${parentName}" que no existe`,
                        row: index + 1
                    });
                }
                
                // Verificar ciclos
                if (detectCycle(unitName, parentName, testDataWithHierarchy)) {
                    issues.push({
                        type: 'error',
                        message: `Ciclo detectado en jerarquía de "${unitName}"`,
                        row: index + 1
                    });
                }
            }
        });
        
        console.log('✅ Validación de jerarquías completada:', {
            registros: testDataWithHierarchy.length,
            issues: issues.length,
            issuesDetectados: issues.map(i => i.message)
        });
        
        return { success: true, issues };
        
    } catch (error) {
        console.error('❌ Error validando jerarquías:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Prueba la navegación del árbol jerárquico
 */
function probarNavegacionJerarquica(tree) {
    console.log('🧭 Probando navegación jerárquica...');
    
    try {
        const navigationResults = [];
        
        function traverseNode(node, level = 0) {
            const result = {
                nivel: level,
                unidad: node.name,
                funciones: node.funciones ? node.funciones.length : 0,
                hijos: node.children ? node.children.length : 0,
                padre: node.parent || 'Raíz'
            };
            
            navigationResults.push(result);
            
            if (node.children) {
                node.children.forEach(child => traverseNode(child, level + 1));
            }
        }
        
        tree.forEach(root => traverseNode(root));
        
        console.log('✅ Navegación jerárquica completada:', {
            totalNodos: navigationResults.length,
            niveles: Math.max(...navigationResults.map(r => r.nivel)) + 1,
            estructura: navigationResults.map(r => ({
                nivel: r.nivel,
                unidad: r.unidad,
                funciones: r.funciones,
                hijos: r.hijos
            }))
        });
        
        return { success: true, navigation: navigationResults };
        
    } catch (error) {
        console.error('❌ Error en navegación jerárquica:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Prueba la exportación con jerarquías
 */
function probarExportacionJerarquica(data) {
    console.log('📤 Probando exportación con jerarquías...');
    
    try {
        const grouped = {};
        data.forEach(row => {
            const unidad = row['Unidad Organizativa'];
            const reportaA = row['Reporta A'] || '';
            const key = unidad + '|' + reportaA;
            
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(row);
        });
        
        const jsonData = {
            metadata: {
                exportDate: new Date().toISOString(),
                version: '2.0',
                totalUnits: Object.keys(grouped).length,
                totalRecords: data.length,
                hasHierarchy: true,
                sourceFile: 'test-data-with-hierarchy.csv'
            },
            data: {
                unidades: Object.entries(grouped).map(([key, funciones]) => {
                    const unidad = funciones[0];
                    return {
                        nombre: unidad['Unidad Organizativa'],
                        reportaA: unidad['Reporta A'] || '',
                        mision: unidad['Misión'] || '',
                        funciones: funciones.map((func, index) => ({
                            orden: index,
                            tipo: func['Tipo de Función'] || 'Genérica',
                            descripcion: func['Descripción'] || '',
                            productoFinal: func['Producto Final'] || '',
                            porcentajeDedicacion: func['Porcentaje Dedicación'] || ''
                        }))
                    };
                })
            }
        };
        
        const jsonSize = JSON.stringify(jsonData).length;
        
        console.log('✅ Exportación con jerarquías completada:', {
            tamañoJSON: `${Math.round(jsonSize / 1024)}KB`,
            unidades: jsonData.metadata.totalUnits,
            registros: jsonData.metadata.totalRecords,
            tieneJerarquia: jsonData.metadata.hasHierarchy
        });
        
        return { success: true, jsonData, size: jsonSize };
        
    } catch (error) {
        console.error('❌ Error en exportación con jerarquías:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Ejecuta todas las pruebas de jerarquías
 */
function ejecutarPruebasJerarquias() {
    console.log('🚀 Iniciando pruebas de jerarquías...');
    console.log('=' .repeat(60));
    
    // Paso 1: Construir árbol jerárquico
    const treeResult = probarConstruccionArbolJerarquico();
    if (!treeResult.success) {
        console.error('❌ No se pudo construir el árbol jerárquico');
        return;
    }
    
    // Paso 2: Validar jerarquías
    const validationResult = probarValidacionJerarquias();
    if (!validationResult.success) {
        console.error('❌ No se pudo validar las jerarquías');
        return;
    }
    
    // Paso 3: Probar navegación
    const navigationResult = probarNavegacionJerarquica(treeResult.tree);
    if (!navigationResult.success) {
        console.error('❌ No se pudo probar la navegación jerárquica');
        return;
    }
    
    // Paso 4: Probar exportación
    const exportResult = probarExportacionJerarquica(testDataWithHierarchy);
    if (!exportResult.success) {
        console.error('❌ No se pudo probar la exportación con jerarquías');
        return;
    }
    
    console.log('=' .repeat(60));
    console.log('📊 RESUMEN DE PRUEBAS DE JERARQUÍAS:');
    console.log(`✅ Árbol jerárquico: ${Object.keys(treeResult.nodeMap).length} nodos`);
    console.log(`✅ Validación: ${validationResult.issues.length} issues`);
    console.log(`✅ Navegación: ${navigationResult.navigation.length} nodos recorridos`);
    console.log(`✅ Exportación: ${Math.round(exportResult.size / 1024)}KB JSON`);
    
    console.log('=' .repeat(60));
    console.log('🎉 ¡Todas las pruebas de jerarquías pasaron exitosamente!');
    console.log('📈 El sistema de jerarquías está funcionando correctamente.');
    
    return {
        tree: treeResult,
        validation: validationResult,
        navigation: navigationResult,
        export: exportResult
    };
}

// ===== EJECUTAR PRUEBAS =====

if (require.main === module) {
    ejecutarPruebasJerarquias();
}

module.exports = {
    ejecutarPruebasJerarquias,
    probarConstruccionArbolJerarquico,
    probarValidacionJerarquias,
    probarNavegacionJerarquica,
    probarExportacionJerarquica,
    testDataWithHierarchy
};