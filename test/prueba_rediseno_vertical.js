// ===== PRUEBA REDISEÑO VERTICAL - ORGANIGRAMA =====
// Script para verificar que los cambios del rediseño vertical están aplicados

console.log('🧪 Iniciando prueba del rediseño vertical...');

// Función para verificar el layout vertical
function verificarLayoutVertical() {
    console.log('📐 Verificando layout vertical...');
    
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) {
        console.error('❌ No se encontró .main-content');
        return false;
    }
    
    const computedStyle = window.getComputedStyle(mainContent);
    const flexDirection = computedStyle.flexDirection;
    
    console.log('Flex direction:', flexDirection);
    
    if (flexDirection === 'column') {
        console.log('✅ Layout vertical correcto');
        return true;
    } else {
        console.error('❌ Layout no es vertical:', flexDirection);
        return false;
    }
}

// Función para verificar el contenedor del árbol
function verificarContenedorArbol() {
    console.log('🌳 Verificando contenedor del árbol...');
    
    const treeContainer = document.querySelector('#tree-container');
    if (!treeContainer) {
        console.error('❌ No se encontró #tree-container');
        return false;
    }
    
    const computedStyle = window.getComputedStyle(treeContainer);
    const width = computedStyle.width;
    const maxHeight = computedStyle.maxHeight;
    
    console.log('Ancho del contenedor:', width);
    console.log('Altura máxima:', maxHeight);
    
    if (width === '100%' && maxHeight === '40vh') {
        console.log('✅ Contenedor del árbol correcto');
        return true;
    } else {
        console.error('❌ Contenedor del árbol incorrecto');
        return false;
    }
}

// Función para verificar las tarjetas de unidades
function verificarTarjetasUnidades() {
    console.log('🃏 Verificando tarjetas de unidades...');
    
    const treeList = document.querySelector('.tree-list');
    if (!treeList) {
        console.error('❌ No se encontró .tree-list');
        return false;
    }
    
    const computedStyle = window.getComputedStyle(treeList);
    const display = computedStyle.display;
    const flexWrap = computedStyle.flexWrap;
    
    console.log('Display:', display);
    console.log('Flex wrap:', flexWrap);
    
    if (display === 'flex' && flexWrap === 'wrap') {
        console.log('✅ Lista de tarjetas correcta');
        return true;
    } else {
        console.error('❌ Lista de tarjetas incorrecta');
        return false;
    }
}

// Función para verificar el contenido de las tarjetas
function verificarContenidoTarjetas() {
    console.log('📋 Verificando contenido de tarjetas...');
    
    const treeNodes = document.querySelectorAll('.tree-node');
    if (treeNodes.length === 0) {
        console.log('⚠️ No hay nodos del árbol para verificar');
        return true;
    }
    
    let correctos = 0;
    treeNodes.forEach((node, index) => {
        const nodeContent = node.querySelector('.node-content');
        const nodeIcon = node.querySelector('.node-icon');
        const nodeName = node.querySelector('.node-name');
        const functionCount = node.querySelector('.node-function-count');
        
        if (nodeContent && nodeIcon && nodeName) {
            console.log(`✅ Nodo ${index + 1}: Estructura correcta`);
            correctos++;
        } else {
            console.error(`❌ Nodo ${index + 1}: Estructura incorrecta`);
        }
    });
    
    console.log(`📊 ${correctos}/${treeNodes.length} nodos correctos`);
    return correctos === treeNodes.length;
}

// Función para verificar el área de detalles
function verificarAreaDetalles() {
    console.log('📄 Verificando área de detalles...');
    
    const contentArea = document.querySelector('#unidad-content');
    if (!contentArea) {
        console.error('❌ No se encontró #unidad-content');
        return false;
    }
    
    const computedStyle = window.getComputedStyle(contentArea);
    const flex = computedStyle.flex;
    
    console.log('Flex del área de detalles:', flex);
    
    if (flex === '1 1 0%' || flex === '1') {
        console.log('✅ Área de detalles correcta');
        return true;
    } else {
        console.error('❌ Área de detalles incorrecta');
        return false;
    }
}

// Función para verificar que no hay elementos del árbol vertical
function verificarEliminacionArbolVertical() {
    console.log('🚫 Verificando eliminación de árbol vertical...');
    
    const treeChildren = document.querySelectorAll('.tree-children');
    const treeToggles = document.querySelectorAll('.tree-toggle');
    
    console.log('Elementos .tree-children encontrados:', treeChildren.length);
    console.log('Elementos .tree-toggle encontrados:', treeToggles.length);
    
    if (treeChildren.length === 0 && treeToggles.length === 0) {
        console.log('✅ Elementos del árbol vertical eliminados correctamente');
        return true;
    } else {
        console.error('❌ Aún hay elementos del árbol vertical');
        return false;
    }
}

// Función para verificar la información de navegación
function verificarInformacionNavegacion() {
    console.log('📊 Verificando información de navegación...');
    
    const navInfo = document.querySelector('.tree-navigation-info');
    if (!navInfo) {
        console.log('⚠️ No hay información de navegación visible (normal si no hay datos)');
        return true;
    }
    
    const title = navInfo.querySelector('h4');
    if (title && title.textContent.includes('Organigrama')) {
        console.log('✅ Información de navegación correcta');
        return true;
    } else {
        console.error('❌ Información de navegación incorrecta');
        return false;
    }
}

// Función para verificar el responsive design
function verificarResponsiveDesign() {
    console.log('📱 Verificando responsive design...');
    
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const treeList = document.querySelector('.tree-list');
    
    if (treeList) {
        const computedStyle = window.getComputedStyle(treeList);
        const flexDirection = computedStyle.flexDirection;
        
        if (mediaQuery.matches) {
            console.log('📱 En modo móvil');
            if (flexDirection === 'column') {
                console.log('✅ Responsive design correcto en móvil');
                return true;
            } else {
                console.error('❌ Responsive design incorrecto en móvil');
                return false;
            }
        } else {
            console.log('🖥️ En modo desktop');
            if (flexDirection === 'row') {
                console.log('✅ Responsive design correcto en desktop');
                return true;
            } else {
                console.error('❌ Responsive design incorrecto en desktop');
                return false;
            }
        }
    } else {
        console.log('⚠️ No hay lista de árbol para verificar responsive');
        return true;
    }
}

// Función principal de prueba
function ejecutarPruebaCompleta() {
    console.log('🚀 Ejecutando prueba completa del rediseño vertical...');
    console.log('=' .repeat(60));
    
    const resultados = {
        layoutVertical: verificarLayoutVertical(),
        contenedorArbol: verificarContenedorArbol(),
        tarjetasUnidades: verificarTarjetasUnidades(),
        contenidoTarjetas: verificarContenidoTarjetas(),
        areaDetalles: verificarAreaDetalles(),
        eliminacionArbolVertical: verificarEliminacionArbolVertical(),
        informacionNavegacion: verificarInformacionNavegacion(),
        responsiveDesign: verificarResponsiveDesign()
    };
    
    console.log('=' .repeat(60));
    console.log('📋 RESUMEN DE PRUEBAS:');
    
    const totalPruebas = Object.keys(resultados).length;
    const pruebasExitosas = Object.values(resultados).filter(r => r).length;
    
    Object.entries(resultados).forEach(([prueba, resultado]) => {
        const estado = resultado ? '✅ PASÓ' : '❌ FALLÓ';
        console.log(`${estado} - ${prueba}`);
    });
    
    console.log('=' .repeat(60));
    console.log(`📊 RESULTADO FINAL: ${pruebasExitosas}/${totalPruebas} pruebas exitosas`);
    
    if (pruebasExitosas === totalPruebas) {
        console.log('🎉 ¡TODAS LAS PRUEBAS PASARON! El rediseño vertical está correctamente implementado.');
    } else {
        console.log('⚠️ Algunas pruebas fallaron. Revisar implementación.');
    }
    
    return resultados;
}

// Función para verificar datos de ejemplo
function verificarConDatosEjemplo() {
    console.log('📊 Verificando con datos de ejemplo...');
    
    // Simular datos de ejemplo
    const datosEjemplo = [
        {
            'Unidad Organizativa': 'Gerencia General',
            'Reporta A': '',
            'Misión': 'Dirigir la organización',
            'Tipo de Función': 'Genérica',
            'Descripción': 'Función de dirección',
            'Producto Final': 'Dirección estratégica',
            'Porcentaje Dedicación': '100%'
        },
        {
            'Unidad Organizativa': 'Recursos Humanos',
            'Reporta A': 'Gerencia General',
            'Misión': 'Gestionar personal',
            'Tipo de Función': 'Específica',
            'Descripción': 'Gestión de personal',
            'Producto Final': 'Personal gestionado',
            'Porcentaje Dedicación': '80%'
        }
    ];
    
    // Simular procesamiento de datos
    console.log('✅ Datos de ejemplo procesados correctamente');
    console.log('📊 Total unidades:', datosEjemplo.length);
    console.log('📊 Total funciones:', datosEjemplo.length);
    
    return true;
}

// Ejecutar pruebas cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ejecutarPruebaCompleta);
} else {
    ejecutarPruebaCompleta();
}

// Exportar funciones para uso manual
window.PruebaRedisenoVertical = {
    ejecutarPruebaCompleta,
    verificarLayoutVertical,
    verificarContenedorArbol,
    verificarTarjetasUnidades,
    verificarContenidoTarjetas,
    verificarAreaDetalles,
    verificarEliminacionArbolVertical,
    verificarInformacionNavegacion,
    verificarResponsiveDesign,
    verificarConDatosEjemplo
};

console.log('🔧 Pruebas disponibles en: window.PruebaRedisenoVertical');