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
    
    // 1. Corregir Gestión Operativa De Sucursales
    const gestionSucursales = findUnit(tree, "Gestión Operativa De Sucursales");
    if (gestionSucursales) {
        console.log('📋 Corrigiendo Gestión Operativa De Sucursales...');
        const originalCount = gestionSucursales.funciones ? gestionSucursales.funciones.length : 0;
        removeDuplicateFunctions(gestionSucursales);
        const newCount = gestionSucursales.funciones ? gestionSucursales.funciones.length : 0;
        console.log(`   - Funciones: ${originalCount} → ${newCount} (eliminadas ${originalCount - newCount})`);
        corrections++;
    }
    
    // 2. Corregir Regionales
    const regionales = findUnit(tree, "Regionales");
    if (regionales) {
        console.log('📋 Corrigiendo Regionales...');
        const originalCount = regionales.funciones ? regionales.funciones.length : 0;
        removeDuplicateFunctions(regionales);
        const newCount = regionales.funciones ? regionales.funciones.length : 0;
        console.log(`   - Funciones: ${originalCount} → ${newCount} (eliminadas ${originalCount - newCount})`);
        corrections++;
    }
    
    // 3. Corregir CAC
    const cac = findUnit(tree, "CAC");
    if (cac) {
        console.log('📋 Corrigiendo CAC...');
        const originalCount = cac.funciones ? cac.funciones.length : 0;
        removeDuplicateFunctions(cac);
        const newCount = cac.funciones ? cac.funciones.length : 0;
        console.log(`   - Funciones: ${originalCount} → ${newCount} (eliminadas ${originalCount - newCount})`);
        corrections++;
    }
    
    // 4. Corregir CAC – Atención Telefónica
    const cacTelefonica = findUnit(tree, "CAC – Atención Telefónica");
    if (cacTelefonica) {
        console.log('📋 Corrigiendo CAC – Atención Telefónica...');
        const originalCount = cacTelefonica.funciones ? cacTelefonica.funciones.length : 0;
        removeDuplicateFunctions(cacTelefonica);
        const newCount = cacTelefonica.funciones ? cacTelefonica.funciones.length : 0;
        console.log(`   - Funciones: ${originalCount} → ${newCount} (eliminadas ${originalCount - newCount})`);
        corrections++;
    }
    
    // 5. Corregir Banca Digital
    const bancaDigital = findUnit(tree, "Banca Digital");
    if (bancaDigital) {
        console.log('📋 Corrigiendo Banca Digital...');
        const originalCount = bancaDigital.funciones ? bancaDigital.funciones.length : 0;
        removeDuplicateFunctions(bancaDigital);
        const newCount = bancaDigital.funciones ? bancaDigital.funciones.length : 0;
        console.log(`   - Funciones: ${originalCount} → ${newCount} (eliminadas ${originalCount - newCount})`);
        corrections++;
    }
    
    // 6. Corregir Experiencia Del Cliente Y Modelo De Atención
    const experienciaCliente = findUnit(tree, "Experiencia Del Cliente Y Modelo De Atención");
    if (experienciaCliente) {
        console.log('📋 Corrigiendo Experiencia Del Cliente Y Modelo De Atención...');
        const originalCount = experienciaCliente.funciones ? experienciaCliente.funciones.length : 0;
        removeDuplicateFunctions(experienciaCliente);
        const newCount = experienciaCliente.funciones ? experienciaCliente.funciones.length : 0;
        console.log(`   - Funciones: ${originalCount} → ${newCount} (eliminadas ${originalCount - newCount})`);
        corrections++;
    }
    
    // 7. Corregir Gestión Comercial
    const gestionComercial = findUnit(tree, "Gestión Comercial");
    if (gestionComercial) {
        console.log('📋 Corrigiendo Gestión Comercial...');
        const originalCount = gestionComercial.funciones ? gestionComercial.funciones.length : 0;
        removeDuplicateFunctions(gestionComercial);
        const newCount = gestionComercial.funciones ? gestionComercial.funciones.length : 0;
        console.log(`   - Funciones: ${originalCount} → ${newCount} (eliminadas ${originalCount - newCount})`);
        corrections++;
    }
    
    console.log(`✅ Correcciones aplicadas: ${corrections} unidades`);
    return corrections;
}

// Función principal para corregir duplicaciones
function correctCanalesDuplications(data) {
    console.log('🔧 Iniciando corrección de duplicaciones en Canales...');
    
    // Corregir duplicaciones específicas
    const corrections = correctSpecificDuplications(data);
    
    if (corrections > 0) {
        // Actualizar metadata
        data.metadata.lastUpdate = new Date().toISOString();
        data.metadata.lastModified = new Date().toISOString();
        data.metadata.notes += "\n- Eliminadas duplicaciones en unidades de Canales\n- Funciones reordenadas y optimizadas\n- Mejorada consistencia en el contenido";
        
        console.log('✅ Corrección de duplicaciones en Canales completada');
        return data;
    } else {
        console.log('❌ No se aplicaron correcciones');
        return null;
    }
}

// Función principal
function main() {
    const inputFile = path.join(__dirname, '..', 'organigrama_bna_2025-07-30_final.json');
    const outputFile = path.join(__dirname, '..', 'organigrama_bna_2025-07-30_sin_duplicaciones.json');
    
    console.log('📁 Cargando archivo JSON final...');
    const data = loadJSON(inputFile);
    
    if (!data) {
        console.error('❌ No se pudo cargar el archivo JSON');
        return;
    }
    
    console.log('✅ Archivo JSON cargado exitosamente');
    
    // Corregir duplicaciones en Canales
    const updatedData = correctCanalesDuplications(data);
    
    if (updatedData) {
        // Guardar el archivo actualizado
        if (saveJSON(updatedData, outputFile)) {
            console.log('🎉 Proceso completado exitosamente');
            console.log(`📄 Archivo sin duplicaciones guardado como: ${outputFile}`);
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
    correctCanalesDuplications,
    removeDuplicateFunctions,
    loadJSON,
    saveJSON
}; 