/**
 * Script de Prueba de Jerarquía Completa
 * Valida que el organigrama optimizado muestre todas las líneas de reporte y unidades
 */

// ===== DATOS DE PRUEBA CON JERARQUÍA COMPLETA =====

const testDataWithCompleteHierarchy = [
    // Nivel 1 - Unidad Raíz
    {
        'Unidad Organizativa': 'SGP Clientes',
        'Reporta A': '',
        'Misión': 'Dirección general de SGP Clientes',
        'Tipo de Función': 'Genérica',
        'Descripción': 'Dirección general de SGP Clientes',
        'Producto Final': 'Estrategia SGP Clientes',
        'Porcentaje Dedicación': '100%'
    },
    
    // Nivel 2 - Subunidades principales
    {
        'Unidad Organizativa': 'Segmento Personas',
        'Reporta A': 'SGP Clientes',
        'Misión': 'Gestión del segmento personas',
        'Tipo de Función': 'Genérica',
        'Descripción': 'Gestión del segmento personas',
        'Producto Final': 'Servicios para personas',
        'Porcentaje Dedicación': '50%'
    },
    {
        'Unidad Organizativa': 'Segmento Empresas',
        'Reporta A': 'SGP Clientes',
        'Misión': 'Gestión del segmento empresas',
        'Tipo de Función': 'Genérica',
        'Descripción': 'Gestión del segmento empresas',
        'Producto Final': 'Servicios para empresas',
        'Porcentaje Dedicación': '50%'
    },
    
    // Nivel 3 - Subunidades de Segmento Personas
    {
        'Unidad Organizativa': 'Estrategia Comercial Y Propuesta De Valor',
        'Reporta A': 'Segmento Personas',
        'Misión': 'Estrategia comercial para personas',
        'Tipo de Función': 'Específica',
        'Descripción': 'Desarrollar estrategias comerciales',
        'Producto Final': 'Estrategias comerciales',
        'Porcentaje Dedicación': '100%'
    },
    {
        'Unidad Organizativa': 'Head De Segmentos',
        'Reporta A': 'Segmento Personas',
        'Misión': 'Head de segmentos personas',
        'Tipo de Función': 'Específica',
        'Descripción': 'Gestión de segmentos',
        'Producto Final': 'Gestión de segmentos',
        'Porcentaje Dedicación': '100%'
    },
    {
        'Unidad Organizativa': 'Inteligencia Comercial',
        'Reporta A': 'Segmento Personas',
        'Misión': 'Inteligencia comercial para personas',
        'Tipo de Función': 'Específica',
        'Descripción': 'Análisis de inteligencia comercial',
        'Producto Final': 'Reportes de inteligencia',
        'Porcentaje Dedicación': '100%'
    },
    {
        'Unidad Organizativa': 'Comunicaciones Y Eventos',
        'Reporta A': 'Segmento Personas',
        'Misión': 'Comunicaciones y eventos para personas',
        'Tipo de Función': 'Específica',
        'Descripción': 'Gestión de comunicaciones y eventos',
        'Producto Final': 'Eventos y comunicaciones',
        'Porcentaje Dedicación': '100%'
    },
    
    // Nivel 3 - Subunidades de Segmento Empresas
    {
        'Unidad Organizativa': 'Estrategia Comercial Y Propuesta De Valor Empresas',
        'Reporta A': 'Segmento Empresas',
        'Misión': 'Estrategia comercial para empresas',
        'Tipo de Función': 'Específica',
        'Descripción': 'Desarrollar estrategias comerciales empresariales',
        'Producto Final': 'Estrategias comerciales empresariales',
        'Porcentaje Dedicación': '100%'
    },
    {
        'Unidad Organizativa': 'Head De Segmentos Empresas',
        'Reporta A': 'Segmento Empresas',
        'Misión': 'Head de segmentos empresas',
        'Tipo de Función': 'Específica',
        'Descripción': 'Gestión de segmentos empresariales',
        'Producto Final': 'Gestión de segmentos empresariales',
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
    {
        'Unidad Organizativa': 'Comunicaciones Y Eventos Empresas',
        'Reporta A': 'Segmento Empresas',
        'Misión': 'Comunicaciones y eventos para empresas',
        'Tipo de Función': 'Específica',
        'Descripción': 'Gestión de comunicaciones y eventos empresariales',
        'Producto Final': 'Eventos y comunicaciones empresariales',
        'Porcentaje Dedicación': '100%'
    },
    
    // Nivel 2 - Otras subunidades principales
    {
        'Unidad Organizativa': 'Productos',
        'Reporta A': 'SGP Clientes',
        'Misión': 'Gestión de productos',
        'Tipo de Función': 'Genérica',
        'Descripción': 'Gestión de productos bancarios',
        'Producto Final': 'Productos bancarios',
        'Porcentaje Dedicación': '50%'
    },
    {
        'Unidad Organizativa': 'Medios De Pago',
        'Reporta A': 'SGP Clientes',
        'Misión': 'Gestión de medios de pago',
        'Tipo de Función': 'Genérica',
        'Descripción': 'Gestión de medios de pago',
        'Producto Final': 'Medios de pago',
        'Porcentaje Dedicación': '50%'
    },
    {
        'Unidad Organizativa': 'Canales',
        'Reporta A': 'SGP Clientes',
        'Misión': 'Gestión de canales',
        'Tipo de Función': 'Genérica',
        'Descripción': 'Gestión de canales bancarios',
        'Producto Final': 'Canales bancarios',
        'Porcentaje Dedicación': '50%'
    },
    {
        'Unidad Organizativa': 'Banca Internacional',
        'Reporta A': 'SGP Clientes',
        'Misión': 'Gestión de banca internacional',
        'Tipo de Función': 'Genérica',
        'Descripción': 'Gestión de banca internacional',
        'Producto Final': 'Servicios internacionales',
        'Porcentaje Dedicación': '50%'
    },
    {
        'Unidad Organizativa': 'Marketing',
        'Reporta A': 'SGP Clientes',
        'Misión': 'Gestión de marketing',
        'Tipo de Función': 'Genérica',
        'Descripción': 'Gestión de marketing bancario',
        'Producto Final': 'Estrategias de marketing',
        'Porcentaje Dedicación': '50%'
    },
    {
        'Unidad Organizativa': 'Coordinación Del Negocio Y Datos',
        'Reporta A': 'SGP Clientes',
        'Misión': 'Coordinación del negocio y datos',
        'Tipo de Función': 'Genérica',
        'Descripción': 'Coordinación del negocio y gestión de datos',
        'Producto Final': 'Coordinación y datos',
        'Porcentaje Dedicación': '50%'
    },
    {
        'Unidad Organizativa': 'Operaciones',
        'Reporta A': 'SGP Clientes',
        'Misión': 'Gestión de operaciones',
        'Tipo de Función': 'Genérica',
        'Descripción': 'Gestión de operaciones bancarias',
        'Producto Final': 'Operaciones bancarias',
        'Porcentaje Dedicación': '50%'
    }
];

// ===== FUNCIONES DE PRUEBA =====

/**
 * Simula la construcción del árbol con jerarquía completa
 */
function simularConstruccionArbolCompleto(data) {
    console.log('🌳 Simulando construcción de árbol con jerarquía completa...');
    
    const nodeMap = {};
    
    // Crear nodos para cada unidad organizativa única
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
    
    // Relacionar hijos con padres - incluir TODOS los niveles
    Object.values(nodeMap).forEach(node => {
        if (node.parent) {
            // Buscar el nodo padre exacto
            const parentKey = Object.keys(nodeMap).find(k => {
                const [parentName, parentParent] = k.split('|');
                return parentName === node.parent;
            });
            
            if (parentKey && nodeMap[parentKey]) {
                nodeMap[parentKey].children.push(node);
            }
        }
    });
    
    // Encontrar raíces (nodos sin padre o con padre que no existe)
    const roots = Object.values(nodeMap).filter(node => {
        if (!node.parent) return true;
        
        const parentExists = Object.keys(nodeMap).some(k => {
            const [parentName] = k.split('|');
            return parentName === node.parent;
        });
        
        return !parentExists;
    });
    
    return { roots, nodeMap };
}

/**
 * Analiza la jerarquía completa
 */
function analizarJerarquiaCompleta(roots, nodeMap) {
    console.log('📊 Analizando jerarquía completa...');
    
    const analisis = {
        totalNodos: Object.keys(nodeMap).length,
        raices: roots.length,
        niveles: {},
        lineasReporte: [],
        unidadesPorNivel: {}
    };
    
    // Función recursiva para analizar nodos
    function analizarNodo(nodo, nivel = 0) {
        if (!analisis.unidadesPorNivel[nivel]) {
            analisis.unidadesPorNivel[nivel] = [];
        }
        analisis.unidadesPorNivel[nivel].push(nodo.name);
        
        if (nodo.parent) {
            analisis.lineasReporte.push({
                hijo: nodo.name,
                padre: nodo.parent,
                nivel: nivel
            });
        }
        
        if (nodo.children && nodo.children.length > 0) {
            nodo.children.forEach(hijo => {
                analizarNodo(hijo, nivel + 1);
            });
        }
    }
    
    // Analizar todas las raíces
    roots.forEach(raiz => {
        analizarNodo(raiz);
    });
    
    return analisis;
}

/**
 * Valida que todas las líneas de reporte estén presentes
 */
function validarLineasReporte(analisis) {
    console.log('✅ Validando líneas de reporte...');
    
    const lineasEsperadas = [
        // Nivel 1 -> Nivel 2
        { hijo: 'Segmento Personas', padre: 'SGP Clientes' },
        { hijo: 'Segmento Empresas', padre: 'SGP Clientes' },
        { hijo: 'Productos', padre: 'SGP Clientes' },
        { hijo: 'Medios De Pago', padre: 'SGP Clientes' },
        { hijo: 'Canales', padre: 'SGP Clientes' },
        { hijo: 'Banca Internacional', padre: 'SGP Clientes' },
        { hijo: 'Marketing', padre: 'SGP Clientes' },
        { hijo: 'Coordinación Del Negocio Y Datos', padre: 'SGP Clientes' },
        { hijo: 'Operaciones', padre: 'SGP Clientes' },
        
        // Nivel 2 -> Nivel 3 (Segmento Personas)
        { hijo: 'Estrategia Comercial Y Propuesta De Valor', padre: 'Segmento Personas' },
        { hijo: 'Head De Segmentos', padre: 'Segmento Personas' },
        { hijo: 'Inteligencia Comercial', padre: 'Segmento Personas' },
        { hijo: 'Comunicaciones Y Eventos', padre: 'Segmento Personas' },
        
        // Nivel 2 -> Nivel 3 (Segmento Empresas)
        { hijo: 'Estrategia Comercial Y Propuesta De Valor Empresas', padre: 'Segmento Empresas' },
        { hijo: 'Head De Segmentos Empresas', padre: 'Segmento Empresas' },
        { hijo: 'Inteligencia Comercial Empresas', padre: 'Segmento Empresas' },
        { hijo: 'Comunicaciones Y Eventos Empresas', padre: 'Segmento Empresas' }
    ];
    
    const validacion = {
        totalEsperadas: lineasEsperadas.length,
        totalEncontradas: analisis.lineasReporte.length,
        coincidencias: 0,
        faltantes: [],
        extras: []
    };
    
    // Verificar coincidencias
    lineasEsperadas.forEach(esperada => {
        const encontrada = analisis.lineasReporte.find(real => 
            real.hijo === esperada.hijo && real.padre === esperada.padre
        );
        
        if (encontrada) {
            validacion.coincidencias++;
        } else {
            validacion.faltantes.push(esperada);
        }
    });
    
    // Verificar extras
    analisis.lineasReporte.forEach(real => {
        const esperada = lineasEsperadas.find(esp => 
            esp.hijo === real.hijo && esp.padre === real.padre
        );
        
        if (!esperada) {
            validacion.extras.push(real);
        }
    });
    
    return validacion;
}

/**
 * Ejecuta todas las pruebas de jerarquía completa
 */
function ejecutarPruebasJerarquiaCompleta() {
    console.log('🚀 Iniciando pruebas de jerarquía completa...');
    console.log('=' .repeat(60));
    
    // Paso 1: Construir árbol completo
    const { roots, nodeMap } = simularConstruccionArbolCompleto(testDataWithCompleteHierarchy);
    
    console.log('✅ Árbol completo construido:', {
        totalNodos: Object.keys(nodeMap).length,
        raices: roots.length,
        estructura: roots.map(root => ({
            unidad: root.name,
            hijos: root.children.length,
            funciones: root.funciones.length
        }))
    });
    
    // Paso 2: Analizar jerarquía
    const analisis = analizarJerarquiaCompleta(roots, nodeMap);
    
    console.log('✅ Jerarquía analizada:', {
        totalNodos: analisis.totalNodos,
        raices: analisis.raices,
        lineasReporte: analisis.lineasReporte.length,
        niveles: Object.keys(analisis.unidadesPorNivel).length
    });
    
    // Paso 3: Validar líneas de reporte
    const validacion = validarLineasReporte(analisis);
    
    console.log('✅ Validación completada:', {
        esperadas: validacion.totalEsperadas,
        encontradas: validacion.totalEncontradas,
        coincidencias: validacion.coincidencias,
        faltantes: validacion.faltantes.length,
        extras: validacion.extras.length
    });
    
    // ===== MOSTRAR RESULTADOS DETALLADOS =====
    
    console.log('\n📊 RESULTADOS DE JERARQUÍA COMPLETA:');
    console.log('=' .repeat(60));
    
    // Estructura por niveles
    console.log('\n🏗️ ESTRUCTURA POR NIVELES:');
    Object.entries(analisis.unidadesPorNivel).forEach(([nivel, unidades]) => {
        console.log(`  Nivel ${nivel}: ${unidades.length} unidades`);
        unidades.forEach(unidad => {
            console.log(`    • ${unidad}`);
        });
    });
    
    // Líneas de reporte
    console.log('\n📊 LÍNEAS DE REPORTE:');
    console.log(`  Total encontradas: ${analisis.lineasReporte.length}`);
    analisis.lineasReporte.forEach(linea => {
        console.log(`    ${linea.hijo} → ${linea.padre} (Nivel ${linea.nivel})`);
    });
    
    // Validación
    console.log('\n✅ VALIDACIÓN DE LÍNEAS DE REPORTE:');
    console.log(`  Esperadas: ${validacion.totalEsperadas}`);
    console.log(`  Encontradas: ${validacion.totalEncontradas}`);
    console.log(`  Coincidencias: ${validacion.coincidencias}`);
    
    if (validacion.faltantes.length > 0) {
        console.log(`  ⚠️ Faltantes: ${validacion.faltantes.length}`);
        validacion.faltantes.forEach(faltante => {
            console.log(`    • ${faltante.hijo} → ${faltante.padre}`);
        });
    }
    
    if (validacion.extras.length > 0) {
        console.log(`  ⚠️ Extras: ${validacion.extras.length}`);
        validacion.extras.forEach(extra => {
            console.log(`    • ${extra.hijo} → ${extra.padre}`);
        });
    }
    
    // ===== RESUMEN FINAL =====
    
    console.log('\n' + '=' .repeat(60));
    console.log('📋 RESUMEN DE JERARQUÍA COMPLETA:');
    
    const exitoso = validacion.coincidencias === validacion.totalEsperadas && 
                   validacion.faltantes.length === 0 && 
                   validacion.extras.length === 0;
    
    if (exitoso) {
        console.log('🎉 ¡Todas las líneas de reporte están presentes y correctas!');
        console.log('✅ La jerarquía completa se muestra correctamente.');
        console.log('✅ Todas las unidades están incluidas.');
    } else {
        console.log('⚠️ Se detectaron diferencias en las líneas de reporte.');
        console.log('📊 Completitud:', `${validacion.coincidencias}/${validacion.totalEsperadas} líneas correctas`);
    }
    
    return {
        analisis,
        validacion,
        exitoso,
        roots,
        nodeMap
    };
}

// ===== EJECUTAR PRUEBAS =====

if (require.main === module) {
    ejecutarPruebasJerarquiaCompleta();
}

module.exports = {
    ejecutarPruebasJerarquiaCompleta,
    simularConstruccionArbolCompleto,
    analizarJerarquiaCompleta,
    validarLineasReporte,
    testDataWithCompleteHierarchy
};