const fs = require('fs');

// Función para leer el JSON
function leerJSON() {
    try {
        const contenido = fs.readFileSync('ia_complete_hierarchy.json', 'utf8');
        return JSON.parse(contenido);
    } catch (error) {
        console.error('Error leyendo el archivo JSON:', error);
        return null;
    }
}

// Función para generar diagrama de jerarquía
function generarDiagramaJerarquia(nodos, nivel = 0) {
    let diagrama = '';
    const indent = '  '.repeat(nivel);
    
    nodos.forEach(nodo => {
        const icon = nodo.children && nodo.children.length > 0 ? '🏢' : '📄';
        const funciones = nodo.funciones ? nodo.funciones.length : 0;
        const hijos = nodo.children ? nodo.children.length : 0;
        
        diagrama += `${indent}${icon} ${nodo.nombre} (${funciones} func., ${hijos} hijos)\n`;
        
        if (nodo.children && nodo.children.length > 0) {
            diagrama += generarDiagramaJerarquia(nodo.children, nivel + 1);
        }
    });
    
    return diagrama;
}

// Función para analizar la estructura
function analizarEstructura() {
    console.log('🔍 Analizando estructura jerárquica del JSON...\n');
    
    const jsonData = leerJSON();
    if (!jsonData) {
        console.error('❌ No se pudo leer el JSON');
        return;
    }
    
    const { hierarchy, data } = jsonData;
    
    console.log('📊 Información General:');
    console.log(`   - Total unidades en data: ${data.unidades.length}`);
    console.log(`   - Nodos raíz en hierarchy: ${hierarchy.tree.length}`);
    console.log(`   - Total funciones: ${data.unidades.reduce((sum, u) => sum + (u.funciones?.length || 0), 0)}`);
    
    console.log('\n🌳 Estructura Jerárquica Actual:');
    console.log('=====================================');
    
    const diagrama = generarDiagramaJerarquia(hierarchy.tree);
    console.log(diagrama);
    
    console.log('\n🔍 Análisis de Problemas:');
    console.log('==========================');
    
    // Verificar si todas las unidades están al mismo nivel
    const unidadesEnData = new Set(data.unidades.map(u => u.nombre));
    const unidadesEnHierarchy = new Set();
    
    function extraerUnidades(nodos) {
        nodos.forEach(nodo => {
            unidadesEnHierarchy.add(nodo.nombre);
            if (nodo.children) {
                extraerUnidades(nodo.children);
            }
        });
    }
    
    extraerUnidades(hierarchy.tree);
    
    console.log(`   - Unidades en data.unidades: ${unidadesEnData.size}`);
    console.log(`   - Unidades en hierarchy.tree: ${unidadesEnHierarchy.size}`);
    
    // Verificar unidades que están en data pero no en hierarchy
    const unidadesSoloEnData = [...unidadesEnData].filter(u => !unidadesEnHierarchy.has(u));
    const unidadesSoloEnHierarchy = [...unidadesEnHierarchy].filter(u => !unidadesEnData.has(u));
    
    if (unidadesSoloEnData.length > 0) {
        console.log(`   ⚠️  Unidades solo en data.unidades (${unidadesSoloEnData.length}):`);
        unidadesSoloEnData.forEach(u => console.log(`      - ${u}`));
    }
    
    if (unidadesSoloEnHierarchy.length > 0) {
        console.log(`   ⚠️  Unidades solo en hierarchy.tree (${unidadesSoloEnHierarchy.length}):`);
        unidadesSoloEnHierarchy.forEach(u => console.log(`      - ${u}`));
    }
    
    // Verificar estructura de reportaA
    console.log('\n📋 Análisis de Relaciones reportaA:');
    console.log('=====================================');
    
    const relaciones = {};
    data.unidades.forEach(unidad => {
        if (unidad.reportaA) {
            if (!relaciones[unidad.reportaA]) {
                relaciones[unidad.reportaA] = [];
            }
            relaciones[unidad.reportaA].push(unidad.nombre);
        }
    });
    
    console.log('Relaciones reportaA encontradas:');
    Object.entries(relaciones).forEach(([padre, hijos]) => {
        console.log(`   ${padre} → [${hijos.join(', ')}]`);
    });
    
    // Verificar si hay unidades sin padre
    const unidadesSinPadre = data.unidades.filter(u => !u.reportaA || u.reportaA === '');
    console.log(`\n   - Unidades sin padre (reportaA vacío): ${unidadesSinPadre.length}`);
    unidadesSinPadre.forEach(u => console.log(`      - ${u.nombre}`));
    
    // Verificar si hay referencias a unidades inexistentes
    const nombresUnidades = new Set(data.unidades.map(u => u.nombre));
    const referenciasInexistentes = data.unidades.filter(u => 
        u.reportaA && u.reportaA !== '' && !nombresUnidades.has(u.reportaA)
    );
    
    if (referenciasInexistentes.length > 0) {
        console.log(`\n   ⚠️  Referencias a unidades inexistentes (${referenciasInexistentes.length}):`);
        referenciasInexistentes.forEach(u => {
            console.log(`      - ${u.nombre} reporta a "${u.reportaA}" (no existe)`);
        });
    }
    
    console.log('\n🎯 Recomendaciones:');
    console.log('===================');
    
    if (unidadesSoloEnData.length > 0 || unidadesSoloEnHierarchy.length > 0) {
        console.log('1. ❌ Hay inconsistencias entre data.unidades y hierarchy.tree');
        console.log('2. 🔧 Necesitas sincronizar ambas estructuras');
    } else {
        console.log('1. ✅ Las unidades en data y hierarchy están sincronizadas');
    }
    
    if (unidadesSinPadre.length > 1) {
        console.log('2. ⚠️  Hay múltiples unidades sin padre - esto puede causar que se muestren al mismo nivel');
    }
    
    if (referenciasInexistentes.length > 0) {
        console.log('3. ❌ Hay referencias a unidades que no existen');
    }
    
    console.log('\n💡 Solución Sugerida:');
    console.log('=====================');
    console.log('1. Verificar que todas las unidades en data.unidades estén en hierarchy.tree');
    console.log('2. Asegurar que solo haya una unidad raíz (sin reportaA)');
    console.log('3. Verificar que todas las relaciones reportaA sean válidas');
    console.log('4. Reconstruir la jerarquía basándose en las relaciones reportaA');
}

// Ejecutar análisis
if (require.main === module) {
    analizarEstructura();
}

module.exports = { analizarEstructura, generarDiagramaJerarquia };