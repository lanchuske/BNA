const fs = require('fs');
const path = require('path');

// Función para cargar el archivo JSON
function loadJSON(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al cargar el archivo JSON:', error);
        return null;
    }
}

// Función para guardar el archivo JSON
function saveJSON(data, filePath) {
    try {
        const jsonString = JSON.stringify(data, null, 2);
        fs.writeFileSync(filePath, jsonString, 'utf8');
        console.log(`✅ Archivo guardado exitosamente: ${filePath}`);
        return true;
    } catch (error) {
        console.error('Error al guardar el archivo JSON:', error);
        return false;
    }
}

// Función para encontrar una unidad en el árbol
function findUnit(tree, unitName) {
    for (let unit of tree) {
        if (unit.nombre === unitName) {
            return unit;
        }
        if (unit.children) {
            const found = findUnit(unit.children, unitName);
            if (found) return found;
        }
    }
    return null;
}

// Función para eliminar funciones duplicadas
function removeDuplicateFunctions(unit) {
    if (!unit.funciones || !Array.isArray(unit.funciones)) {
        return unit;
    }
    
    const uniqueFunctions = [];
    const seenDescriptions = new Set();
    
    unit.funciones.forEach(func => {
        const normalizedDesc = func.descripcion.toLowerCase().replace(/\s+/g, ' ').trim();
        
        if (!seenDescriptions.has(normalizedDesc) || normalizedDesc.length < 10) {
            uniqueFunctions.push(func);
            seenDescriptions.add(normalizedDesc);
        } else {
            console.log(`   - Eliminada función duplicada: "${func.descripcion.substring(0, 60)}..."`);
        }
    });
    
    // Reordenar las funciones
    uniqueFunctions.forEach((func, index) => {
        func.orden = index + 1;
    });
    
    unit.funciones = uniqueFunctions;
    return unit;
}

// Función para corregir duplicaciones específicas identificadas
function correctSpecificDuplications(data) {
    console.log('🔧 Corrigiendo duplicaciones específicas...');
    
    const tree = data.hierarchy.tree;
    let corrections = 0;
    
    // 1. Corregir Alianzas y Patrocinios
    const alianzasPatrocinios = findUnit(tree, "Alianzas y Patrocinios");
    if (alianzasPatrocinios) {
        console.log('📋 Corrigiendo Alianzas y Patrocinios...');
        const originalCount = alianzasPatrocinios.funciones ? alianzasPatrocinios.funciones.length : 0;
        removeDuplicateFunctions(alianzasPatrocinios);
        const newCount = alianzasPatrocinios.funciones ? alianzasPatrocinios.funciones.length : 0;
        console.log(`   - Funciones: ${originalCount} → ${newCount} (eliminadas ${originalCount - newCount})`);
        corrections++;
    }
    
    // 2. Corregir Branding y Comunicaciones
    const brandingComunicaciones = findUnit(tree, "Branding y Comunicaciones");
    if (brandingComunicaciones) {
        console.log('📋 Corrigiendo Branding y Comunicaciones...');
        const originalCount = brandingComunicaciones.funciones ? brandingComunicaciones.funciones.length : 0;
        removeDuplicateFunctions(brandingComunicaciones);
        const newCount = brandingComunicaciones.funciones ? brandingComunicaciones.funciones.length : 0;
        console.log(`   - Funciones: ${originalCount} → ${newCount} (eliminadas ${originalCount - newCount})`);
        corrections++;
    }
    
    // 3. Corregir Digital Marketing & Performance
    const digitalMarketing = findUnit(tree, "Digital Marketing & Performance");
    if (digitalMarketing) {
        console.log('📋 Corrigiendo Digital Marketing & Performance...');
        const originalCount = digitalMarketing.funciones ? digitalMarketing.funciones.length : 0;
        removeDuplicateFunctions(digitalMarketing);
        const newCount = digitalMarketing.funciones ? digitalMarketing.funciones.length : 0;
        console.log(`   - Funciones: ${originalCount} → ${newCount} (eliminadas ${originalCount - newCount})`);
        corrections++;
    }
    
    // 4. Corregir Customer Insights & Analytics
    const customerInsights = findUnit(tree, "Customer Insights & Analytics");
    if (customerInsights) {
        console.log('📋 Corrigiendo Customer Insights & Analytics...');
        const originalCount = customerInsights.funciones ? customerInsights.funciones.length : 0;
        removeDuplicateFunctions(customerInsights);
        const newCount = customerInsights.funciones ? customerInsights.funciones.length : 0;
        console.log(`   - Funciones: ${originalCount} → ${newCount} (eliminadas ${originalCount - newCount})`);
        corrections++;
    }
    
    // 5. Corregir Customer Insights & Analitics (con error de ortografía)
    const customerAnalitics = findUnit(tree, "Customer Insights & Analitics");
    if (customerAnalitics) {
        console.log('📋 Corrigiendo Customer Insights & Analitics...');
        const originalCount = customerAnalitics.funciones ? customerAnalitics.funciones.length : 0;
        removeDuplicateFunctions(customerAnalitics);
        const newCount = customerAnalitics.funciones ? customerAnalitics.funciones.length : 0;
        console.log(`   - Funciones: ${originalCount} → ${newCount} (eliminadas ${originalCount - newCount})`);
        corrections++;
    }
    
    console.log(`✅ Correcciones aplicadas: ${corrections} unidades`);
    return corrections;
}

// Función principal para corregir duplicaciones
function correctMarketingDuplications(data) {
    console.log('🔧 Iniciando corrección de duplicaciones en Marketing...');
    
    // Corregir duplicaciones específicas
    const corrections = correctSpecificDuplications(data);
    
    if (corrections > 0) {
        // Actualizar metadata
        data.metadata.lastUpdate = new Date().toISOString();
        data.metadata.lastModified = new Date().toISOString();
        data.metadata.notes += "\n- Eliminadas duplicaciones en unidades de Marketing\n- Funciones reordenadas y optimizadas\n- Mejorada consistencia en el contenido de Marketing";
        
        console.log('✅ Corrección de duplicaciones en Marketing completada');
        return data;
    } else {
        console.log('❌ No se aplicaron correcciones');
        return null;
    }
}

// Función principal
function main() {
    const inputFile = path.join(__dirname, '..', 'organigrama_bna_2025-07-30_sin_duplicaciones.json');
    const outputFile = path.join(__dirname, '..', 'organigrama_bna_2025-07-30_marketing_limpio.json');
    
    console.log('📁 Cargando archivo JSON sin duplicaciones...');
    const data = loadJSON(inputFile);
    
    if (!data) {
        console.error('❌ No se pudo cargar el archivo JSON');
        return;
    }
    
    console.log('✅ Archivo JSON cargado exitosamente');
    
    // Corregir duplicaciones en Marketing
    const updatedData = correctMarketingDuplications(data);
    
    if (updatedData) {
        // Guardar el archivo actualizado
        if (saveJSON(updatedData, outputFile)) {
            console.log('🎉 Proceso completado exitosamente');
            console.log(`📄 Archivo Marketing limpio guardado como: ${outputFile}`);
        } else {
            console.error('❌ Error al guardar el archivo actualizado');
        }
    } else {
        console.error('❌ Error en la corrección de duplicaciones');
    }
}

// Ejecutar el script
if (require.main === module) {
    main();
}

module.exports = {
    correctMarketingDuplications,
    removeDuplicateFunctions,
    loadJSON,
    saveJSON
}; 