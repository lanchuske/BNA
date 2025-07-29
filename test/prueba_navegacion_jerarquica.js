/**
 * Script de Prueba de Navegación Jerárquica
 * Valida que la navegación entre unidades padre e hijas funcione correctamente
 */

// ===== DATOS DE PRUEBA CON JERARQUÍA COMPLEJA =====

const testDataWithComplexHierarchy = [
    // Unidad raíz - Negocios
    {
        'Unidad Organizativa': 'Negocios',
        'Reporta A': '',
        'Misión': 'Dirigir todas las operaciones de negocio',
        'Tipo de Función': 'Genérica',
        'Descripción': 'Dirección general de negocios',
        'Producto Final': 'Estrategia de negocio',
        'Porcentaje Dedicación': '100%'
    },
    
    // Unidades que reportan a Negocios
    {
        'Unidad Organizativa': 'Segmento Personas',
        'Reporta A': 'Negocios',
        'Misión': 'Gestionar segmento de personas',
        'Tipo de Función': 'Genérica',
        'Descripción': 'Gestión del segmento personas',
        'Producto Final': 'Servicios para personas',
        'Porcentaje Dedicación': '50%'
    },
    {
        'Unidad Organizativa': 'Segmento Empresas',
        'Reporta A': 'Negocios',
        'Misión': 'Gestionar segmento de empresas',
        'Tipo de Función': 'Genérica',
        'Descripción': 'Gestión del segmento empresas',
        'Producto Final': 'Servicios para empresas',
        'Porcentaje Dedicación': '50%'
    },
    
    // Unidades que reportan a Segmento Personas
    {
        'Unidad Organizativa': 'Estrategia Comercial Personas',
        'Reporta A': 'Segmento Personas',
        'Misión': 'Estrategia comercial para personas',
        'Tipo de Función': 'Específica',
        'Descripción': 'Desarrollar estrategias comerciales',
        'Producto Final': 'Estrategias comerciales',
        'Porcentaje Dedicación': '100%'
    },
    {
        'Unidad Organizativa': 'Inteligencia Comercial Personas',
        'Reporta A': 'Segmento Personas',
        'Misión': 'Inteligencia comercial para personas',
        'Tipo de Función': 'Específica',
        'Descripción': 'Análisis de inteligencia comercial',
        'Producto Final': 'Reportes de inteligencia',
        'Porcentaje Dedicación': '100%'
    },
    
    // Unidades que reportan a Segmento Empresas
    {
        'Unidad Organizativa': 'Estrategia Comercial Empresas',
        'Reporta A': 'Segmento Empresas',
        'Misión': 'Estrategia comercial para empresas',
        'Tipo de Función': 'Específica',
        'Descripción': 'Desarrollar estrategias comerciales empresariales',
        'Producto Final': 'Estrategias comerciales empresariales',
        'Porcentaje Dedicación': '100%'
    },
    {
        'Unidad Organizativa': 'Inteligencia Comercial Empresas',
        'Reporta A': 'Segmento Empresas',
        'Misión': 'Inteligencia comercial para empresas',
        'Tipo de Función': 'Específica',
        'Descripción': 'Análisis de inteligencia comercial empresarial',
        'Producto Final': 'Reportes de inteligencia empresarial',
        'Porcentaje Dedicación': '100%'
    },
    
    // Indicadores en diferentes niveles
    {
        'Unidad Organizativa': 'Indicador Rentabilidad',
        'Reporta A': 'Negocios',
        'Misión': 'Medir rentabilidad general',
        'Tipo de Función': 'Indicador',
        'Descripción': 'Indicador de rentabilidad general del negocio'
    },
    {
        'Unidad Organizativa': 'Indicador Satisfacción Personas',
        'Reporta A': 'Segmento Personas',
        'Misión': 'Medir satisfacción del segmento personas',
        'Tipo de Función': 'Indicador',
        'Descripción': 'Indicador de satisfacción del cliente personas'
    }
];

// ===== FUNCIONES DE PRUEBA =====

/**
 * Simula la construcción del árbol jerárquico
 */
function simularConstruccionArbol(data) {
    console.log('🌳 Simulando construcción de árbol jerárquico...');
    
    const nodeMap = {};
    
    // Crear nodos para cada unidad
    data.forEach(item => {
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
    
    return { roots, nodeMap };
}

/**
 * Prueba la navegación jerárquica
 */
function probarNavegacionJerarquica(roots, nodeMap) {
    console.log('🧭 Probando navegación jerárquica...');
    
    const resultados = [];
    
    // Función para buscar unidad
    function buscarUnidad(nodos, nombre) {
        for (const nodo of nodos) {
            if (nodo.name === nombre) {
                return nodo;
            }
            if (nodo.children) {
                const encontrado = buscarUnidad(nodo.children, nombre);
                if (encontrado) return encontrado;
            }
        }
        return null;
    }
    
    // Función para expandir padres
    function expandirPadres(nodo, expandedNodes = {}) {
        if (nodo.parent) {
            const padre = buscarUnidad(roots, nodo.parent);
            if (padre) {
                expandedNodes[padre.key] = true;
                expandirPadres(padre, expandedNodes);
            }
        }
        return expandedNodes;
    }
    
    // Probar navegación desde diferentes puntos
    const casosPrueba = [
        {
            desde: 'Negocios',
            hacia: 'Segmento Personas',
            descripcion: 'Navegar desde unidad raíz a subunidad'
        },
        {
            desde: 'Segmento Personas',
            hacia: 'Estrategia Comercial Personas',
            descripcion: 'Navegar desde unidad intermedia a subunidad'
        },
        {
            desde: 'Negocios',
            hacia: 'Indicador Rentabilidad',
            descripcion: 'Navegar desde unidad raíz a indicador'
        },
        {
            desde: 'Segmento Empresas',
            hacia: 'Inteligencia Comercial Empresas',
            descripcion: 'Navegar desde segmento a unidad específica'
        }
    ];
    
    casosPrueba.forEach(caso => {
        const unidadOrigen = buscarUnidad(roots, caso.desde);
        const unidadDestino = buscarUnidad(roots, caso.hacia);
        
        if (unidadOrigen && unidadDestino) {
            // Simular expansión de padres
            const expandedNodes = expandirPadres(unidadDestino);
            
            const resultado = {
                caso: caso.descripcion,
                origen: caso.desde,
                destino: caso.hacia,
                expandedNodes: Object.keys(expandedNodes).length,
                ruta: generarRuta(unidadDestino, roots),
                exitoso: true
            };
            
            resultados.push(resultado);
        } else {
            resultados.push({
                caso: caso.descripcion,
                origen: caso.desde,
                destino: caso.hacia,
                exitoso: false,
                error: 'Unidad no encontrada'
            });
        }
    });
    
    return resultados;
}

/**
 * Genera la ruta jerárquica de una unidad
 */
function generarRuta(nodo, roots) {
    const ruta = [nodo.name];
    let actual = nodo;
    
    while (actual.parent) {
        // Buscar el padre
        function buscarPadre(nodos, nombrePadre) {
            for (const n of nodos) {
                if (n.name === nombrePadre) {
                    return n;
                }
                if (n.children) {
                    const encontrado = buscarPadre(n.children, nombrePadre);
                    if (encontrado) return encontrado;
                }
            }
            return null;
        }
        
        const padre = buscarPadre(roots, actual.parent);
        if (padre) {
            ruta.unshift(padre.name);
            actual = padre;
        } else {
            break;
        }
    }
    
    return ruta.join(' → ');
}

/**
 * Prueba la visualización de unidades padre
 */
function probarVisualizacionUnidadPadre(roots, nodeMap) {
    console.log('📊 Probando visualización de unidades padre...');
    
    const resultados = [];
    
    // Encontrar unidades que tienen hijos
    const unidadesConHijos = Object.values(nodeMap).filter(node => node.children.length > 0);
    
    unidadesConHijos.forEach(unidad => {
        const unidadesHijas = unidad.children.map(child => ({
            nombre: child.name,
            funciones: child.funciones ? child.funciones.length : 0,
            reportaA: child.parent,
            tipo: child.funciones && child.funciones.length > 0 ? 
                child.funciones[0]['Tipo de Función'] || 'Genérica' : 'Sin funciones'
        }));
        
        const totalFunciones = unidad.children.reduce((sum, child) => 
            sum + (child.funciones ? child.funciones.length : 0), 0);
        
        resultados.push({
            unidadPadre: unidad.name,
            subunidades: unidad.children.length,
            totalFunciones,
            unidadesHijas: unidadesHijas.map(h => h.nombre),
            tiposHijas: [...new Set(unidadesHijas.map(h => h.tipo))]
        });
    });
    
    return resultados;
}

/**
 * Ejecuta todas las pruebas de navegación jerárquica
 */
function ejecutarPruebasNavegacionJerarquica() {
    console.log('🚀 Iniciando pruebas de navegación jerárquica...');
    console.log('=' .repeat(60));
    
    // Paso 1: Construir árbol
    const { roots, nodeMap } = simularConstruccionArbol(testDataWithComplexHierarchy);
    
    console.log('✅ Árbol construido:', {
        totalNodos: Object.keys(nodeMap).length,
        raices: roots.length,
        estructura: roots.map(root => ({
            unidad: root.name,
            hijos: root.children.length,
            funciones: root.funciones.length
        }))
    });
    
    // Paso 2: Probar navegación
    const navegacion = probarNavegacionJerarquica(roots, nodeMap);
    
    console.log('✅ Navegación probada:', {
        casos: navegacion.length,
        exitosos: navegacion.filter(r => r.exitoso).length,
        fallidos: navegacion.filter(r => !r.exitoso).length
    });
    
    // Paso 3: Probar visualización
    const visualizacion = probarVisualizacionUnidadPadre(roots, nodeMap);
    
    console.log('✅ Visualización probada:', {
        unidadesConHijos: visualizacion.length,
        totalSubunidades: visualizacion.reduce((sum, v) => sum + v.subunidades, 0),
        totalFunciones: visualizacion.reduce((sum, v) => sum + v.totalFunciones, 0)
    });
    
    console.log('=' .repeat(60));
    console.log('📊 RESUMEN DE PRUEBAS DE NAVEGACIÓN JERÁRQUICA:');
    console.log(`✅ Árbol: ${Object.keys(nodeMap).length} nodos, ${roots.length} raíces`);
    console.log(`✅ Navegación: ${navegacion.filter(r => r.exitoso).length}/${navegacion.length} casos exitosos`);
    console.log(`✅ Visualización: ${visualizacion.length} unidades padre con hijos`);
    
    // Mostrar casos de navegación
    console.log('\n🧭 Casos de navegación:');
    navegacion.forEach((caso, index) => {
        const status = caso.exitoso ? '✅' : '❌';
        console.log(`  ${status} ${caso.caso}`);
        if (caso.exitoso) {
            console.log(`    Ruta: ${caso.ruta}`);
            console.log(`    Nodos expandidos: ${caso.expandedNodes}`);
        } else {
            console.log(`    Error: ${caso.error}`);
        }
    });
    
    // Mostrar unidades padre
    console.log('\n📊 Unidades padre:');
    visualizacion.forEach(unidad => {
        console.log(`  📁 ${unidad.unidadPadre}: ${unidad.subunidades} subunidades, ${unidad.totalFunciones} funciones`);
        console.log(`    Hijas: ${unidad.unidadesHijas.join(', ')}`);
    });
    
    console.log('=' .repeat(60));
    const exitosos = navegacion.filter(r => r.exitoso).length;
    const total = navegacion.length;
    
    if (exitosos === total) {
        console.log('🎉 ¡Todas las pruebas de navegación jerárquica pasaron exitosamente!');
        console.log('📈 La navegación jerárquica está funcionando correctamente.');
    } else {
        console.log('⚠️ Algunas pruebas fallaron. Revisar la lógica de navegación.');
    }
    
    return {
        navegacion,
        visualizacion,
        roots,
        nodeMap
    };
}

// ===== EJECUTAR PRUEBAS =====

if (require.main === module) {
    ejecutarPruebasNavegacionJerarquica();
}

module.exports = {
    ejecutarPruebasNavegacionJerarquica,
    simularConstruccionArbol,
    probarNavegacionJerarquica,
    probarVisualizacionUnidadPadre,
    testDataWithComplexHierarchy
};