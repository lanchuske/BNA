// ===== DIAGNÓSTICO SAFARI - RENDERIZADO DEL ÁRBOL =====
// Script para identificar problemas específicos de Safari en el renderizado del árbol

console.log('🔍 Iniciando diagnóstico Safari - Renderizado del Árbol');

// Función para detectar Safari
function detectSafari() {
    const userAgent = navigator.userAgent;
    const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
    const isWebKit = /WebKit/.test(userAgent);
    const isMac = /Mac/.test(userAgent);
    
    console.log('🌐 Información del navegador:', {
        userAgent: userAgent,
        isSafari: isSafari,
        isWebKit: isWebKit,
        isMac: isMac,
        platform: navigator.platform,
        vendor: navigator.vendor
    });
    
    return { isSafari, isWebKit, isMac };
}

// Función para verificar compatibilidad de DOM
function checkDOMCompatibility() {
    console.log('🔧 Verificando compatibilidad DOM...');
    
    const checks = {
        // Verificar métodos básicos de DOM
        createElement: typeof document.createElement === 'function',
        getElementById: typeof document.getElementById === 'function',
        querySelector: typeof document.querySelector === 'function',
        querySelectorAll: typeof document.querySelectorAll === 'function',
        
        // Verificar propiedades de elementos
        innerHTML: typeof document.createElement('div').innerHTML !== 'undefined',
        textContent: typeof document.createElement('div').textContent !== 'undefined',
        className: typeof document.createElement('div').className !== 'undefined',
        
        // Verificar event listeners
        addEventListener: typeof document.addEventListener === 'function',
        removeEventListener: typeof document.removeEventListener === 'function',
        
        // Verificar localStorage
        localStorage: typeof localStorage !== 'undefined',
        localStorageSet: (() => {
            try {
                localStorage.setItem('test', 'test');
                localStorage.removeItem('test');
                return true;
            } catch (e) {
                return false;
            }
        })(),
        
        // Verificar JSON
        JSONParse: typeof JSON.parse === 'function',
        JSONStringify: typeof JSON.stringify === 'function'
    };
    
    console.log('✅ Compatibilidad DOM:', checks);
    
    const failedChecks = Object.entries(checks).filter(([key, value]) => !value);
    if (failedChecks.length > 0) {
        console.error('❌ Fallos en compatibilidad DOM:', failedChecks);
        return false;
    }
    
    return true;
}

// Función para verificar el contenedor del árbol
function checkTreeContainer() {
    console.log('🌳 Verificando contenedor del árbol...');
    
    const treeContainer = document.getElementById('tree-container');
    if (!treeContainer) {
        console.error('❌ No se encontró el contenedor tree-container');
        return false;
    }
    
    console.log('✅ Contenedor del árbol encontrado:', {
        id: treeContainer.id,
        tagName: treeContainer.tagName,
        className: treeContainer.className,
        innerHTML: treeContainer.innerHTML.length,
        children: treeContainer.children.length
    });
    
    return true;
}

// Función para simular datos de prueba
function createTestData() {
    console.log('📊 Creando datos de prueba...');
    
    const testData = [
        {
            'Unidad Organizativa': 'Gerencia General',
            'Reporta A': '',
            'Misión': 'Dirigir la organización',
            'Tipo de Función': 'Genérica',
            'Descripción': 'Función de dirección general',
            'Producto Final': 'Plan estratégico',
            'Porcentaje Dedicación': '100'
        },
        {
            'Unidad Organizativa': 'Gerencia Financiera',
            'Reporta A': 'Gerencia General',
            'Misión': 'Gestionar finanzas',
            'Tipo de Función': 'Específica',
            'Descripción': 'Control financiero',
            'Producto Final': 'Reporte financiero',
            'Porcentaje Dedicación': '80'
        },
        {
            'Unidad Organizativa': 'Gerencia Operativa',
            'Reporta A': 'Gerencia General',
            'Misión': 'Gestionar operaciones',
            'Tipo de Función': 'Específica',
            'Descripción': 'Control operativo',
            'Producto Final': 'Reporte operativo',
            'Porcentaje Dedicación': '75'
        }
    ];
    
    console.log('✅ Datos de prueba creados:', testData.length, 'registros');
    return testData;
}

// Función para probar el renderizado básico
function testBasicRendering() {
    console.log('🎨 Probando renderizado básico...');
    
    const treeContainer = document.getElementById('tree-container');
    if (!treeContainer) {
        console.error('❌ No se puede probar renderizado - contenedor no encontrado');
        return false;
    }
    
    try {
        // Crear un nodo simple
        const testNode = document.createElement('div');
        testNode.className = 'tree-node test-node';
        testNode.innerHTML = `
            <span class="node-icon">📁</span>
            <span class="node-name">Nodo de Prueba</span>
        `;
        
        treeContainer.appendChild(testNode);
        
        console.log('✅ Nodo de prueba agregado exitosamente');
        
        // Verificar que se renderizó correctamente
        const renderedNode = treeContainer.querySelector('.test-node');
        if (renderedNode) {
            console.log('✅ Nodo renderizado correctamente:', {
                visible: renderedNode.offsetParent !== null,
                width: renderedNode.offsetWidth,
                height: renderedNode.offsetHeight,
                innerHTML: renderedNode.innerHTML
            });
            
            // Limpiar nodo de prueba
            treeContainer.removeChild(testNode);
            return true;
        } else {
            console.error('❌ Nodo no se renderizó correctamente');
            return false;
        }
        
    } catch (error) {
        console.error('❌ Error en renderizado básico:', error);
        return false;
    }
}

// Función para probar el renderizado del árbol completo
function testTreeRendering() {
    console.log('🌳 Probando renderizado del árbol completo...');
    
    try {
        // Crear datos de prueba
        const testData = createTestData();
        
        // Simular el procesamiento de datos
        const groupedData = {};
        testData.forEach(row => {
            const unidad = row['Unidad Organizativa'];
            if (!groupedData[unidad]) groupedData[unidad] = [];
            groupedData[unidad].push(row);
        });
        
        // Construir árbol simple
        const treeRoots = [];
        testData.forEach(item => {
            const nombre = item['Unidad Organizativa'];
            const parent = item['Reporta A'] || '';
            
            if (!parent) {
                // Es una raíz
                treeRoots.push({
                    key: nombre + '|' + parent,
                    nombre: nombre,
                    parent: parent,
                    children: [],
                    funciones: [item]
                });
            }
        });
        
        // Agregar hijos
        testData.forEach(item => {
            const nombre = item['Unidad Organizativa'];
            const parent = item['Reporta A'] || '';
            
            if (parent) {
                const parentNode = treeRoots.find(root => root.nombre === parent);
                if (parentNode) {
                    parentNode.children.push({
                        key: nombre + '|' + parent,
                        nombre: nombre,
                        parent: parent,
                        children: [],
                        funciones: [item]
                    });
                }
            }
        });
        
        console.log('✅ Árbol construido:', treeRoots);
        
        // Intentar renderizar
        const treeContainer = document.getElementById('tree-container');
        if (treeContainer) {
            treeContainer.innerHTML = '';
            
            const ul = document.createElement('ul');
            ul.className = 'tree-list';
            
            treeRoots.forEach(node => {
                const li = document.createElement('li');
                li.className = 'tree-node';
                li.setAttribute('data-key', node.key);
                
                const hasChildren = node.children && node.children.length > 0;
                const icon = hasChildren ? '📁' : '📄';
                
                li.innerHTML = `
                    <span class="node-icon">${icon}</span>
                    <span class="node-name">${node.nombre}</span>
                    <span style="color: #666; font-size: 12px;">(${node.funciones.length} funciones)</span>
                `;
                
                ul.appendChild(li);
            });
            
            treeContainer.appendChild(ul);
            
            console.log('✅ Árbol renderizado exitosamente');
            console.log('📊 Elementos renderizados:', treeContainer.querySelectorAll('.tree-node').length);
            
            return true;
        } else {
            console.error('❌ No se pudo renderizar - contenedor no disponible');
            return false;
        }
        
    } catch (error) {
        console.error('❌ Error en renderizado del árbol:', error);
        return false;
    }
}

// Función para verificar estilos CSS
function checkCSSCompatibility() {
    console.log('🎨 Verificando compatibilidad CSS...');
    
    const testElement = document.createElement('div');
    testElement.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        background: #ffffff;
        cursor: pointer;
        transition: all 0.2s ease;
    `;
    
    document.body.appendChild(testElement);
    
    const computedStyle = window.getComputedStyle(testElement);
    const checks = {
        flexbox: computedStyle.display === 'flex',
        alignItems: computedStyle.alignItems === 'center',
        gap: computedStyle.gap !== '',
        borderRadius: computedStyle.borderRadius !== '',
        transition: computedStyle.transition !== '',
        cursor: computedStyle.cursor === 'pointer'
    };
    
    console.log('✅ Compatibilidad CSS:', checks);
    
    document.body.removeChild(testElement);
    
    const failedChecks = Object.entries(checks).filter(([key, value]) => !value);
    if (failedChecks.length > 0) {
        console.warn('⚠️ Fallos en compatibilidad CSS:', failedChecks);
    }
    
    return checks;
}

// Función para verificar event listeners
function checkEventListeners() {
    console.log('🎯 Verificando event listeners...');
    
    const testElement = document.createElement('div');
    let eventFired = false;
    
    testElement.addEventListener('click', () => {
        eventFired = true;
        console.log('✅ Event listener funcionando');
    });
    
    document.body.appendChild(testElement);
    testElement.click();
    document.body.removeChild(testElement);
    
    if (eventFired) {
        console.log('✅ Event listeners funcionando correctamente');
        return true;
    } else {
        console.error('❌ Event listeners no funcionan');
        return false;
    }
}

// Función principal de diagnóstico
function runSafariDiagnostic() {
    console.log('🚀 Iniciando diagnóstico completo para Safari...');
    
    const results = {
        browser: detectSafari(),
        domCompatibility: checkDOMCompatibility(),
        treeContainer: checkTreeContainer(),
        basicRendering: testBasicRendering(),
        treeRendering: testTreeRendering(),
        cssCompatibility: checkCSSCompatibility(),
        eventListeners: checkEventListeners()
    };
    
    console.log('📋 Resumen del diagnóstico:', results);
    
    // Generar reporte
    const report = {
        timestamp: new Date().toISOString(),
        browser: results.browser,
        issues: [],
        recommendations: []
    };
    
    if (!results.domCompatibility) {
        report.issues.push('Problemas de compatibilidad DOM');
        report.recommendations.push('Verificar que el navegador soporte las APIs DOM básicas');
    }
    
    if (!results.treeContainer) {
        report.issues.push('Contenedor del árbol no encontrado');
        report.recommendations.push('Verificar que el HTML incluya el elemento tree-container');
    }
    
    if (!results.basicRendering) {
        report.issues.push('Problemas en renderizado básico');
        report.recommendations.push('Verificar compatibilidad de createElement y appendChild');
    }
    
    if (!results.treeRendering) {
        report.issues.push('Problemas en renderizado del árbol');
        report.recommendations.push('Verificar la lógica de construcción del árbol');
    }
    
    if (!results.eventListeners) {
        report.issues.push('Problemas con event listeners');
        report.recommendations.push('Verificar compatibilidad de addEventListener');
    }
    
    console.log('📊 Reporte final:', report);
    
    // Mostrar resultados en la página
    const diagnosticResults = document.createElement('div');
    diagnosticResults.innerHTML = `
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>🔍 Diagnóstico Safari - Resultados</h3>
            <p><strong>Navegador:</strong> ${results.browser.isSafari ? 'Safari' : 'Otro'} (${results.browser.isMac ? 'macOS' : 'Otro'})</p>
            <p><strong>Problemas detectados:</strong> ${report.issues.length}</p>
            <ul>
                ${report.issues.map(issue => `<li style="color: #dc3545;">❌ ${issue}</li>`).join('')}
            </ul>
            <p><strong>Recomendaciones:</strong></p>
            <ul>
                ${report.recommendations.map(rec => `<li style="color: #28a745;">💡 ${rec}</li>`).join('')}
            </ul>
        </div>
    `;
    
    document.body.appendChild(diagnosticResults);
    
    return report;
}

// Ejecutar diagnóstico cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runSafariDiagnostic);
} else {
    runSafariDiagnostic();
}

// Exportar función para uso manual
window.runSafariDiagnostic = runSafariDiagnostic;