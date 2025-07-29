// Script para comparar dos archivos JSON
const fs = require('fs');

function compareJSONFiles() {
    try {
        // Leer ambos archivos
        const file1 = fs.readFileSync('estructura_organizativa_completa.json', 'utf8');
        const file2 = fs.readFileSync('ia_complete_hierarchy_final_corregido.json', 'utf8');
        
        const json1 = JSON.parse(file1);
        const json2 = JSON.parse(file2);
        
        console.log('=== COMPARACIÓN DE ARCHIVOS JSON ===\n');
        
        // Comparar metadata
        console.log('📊 METADATA:');
        console.log(`Archivo 1: ${json1.metadata.version}`);
        console.log(`Archivo 2: ${json2.metadata.version}`);
        console.log(`¿Versiones iguales? ${json1.metadata.version === json2.metadata.version ? '✅ Sí' : '❌ No'}`);
        console.log(`¿ExportDate igual? ${json1.metadata.exportDate === json2.metadata.exportDate ? '✅ Sí' : '❌ No'}`);
        console.log(`¿TotalRecords igual? ${json1.metadata.totalRecords === json2.metadata.totalRecords ? '✅ Sí' : '❌ No'}`);
        console.log(`¿TotalUnits igual? ${json1.metadata.totalUnits === json2.metadata.totalUnits ? '✅ Sí' : '❌ No'}`);
        
        // Comparar estructura hierarchy
        console.log('\n🌳 HIERARCHY:');
        const tree1 = json1.hierarchy.tree;
        const tree2 = json2.hierarchy.tree;
        
        console.log(`¿Tienen la misma cantidad de unidades raíz? ${tree1.length === tree2.length ? '✅ Sí' : '❌ No'}`);
        console.log(`Archivo 1: ${tree1.length} unidades raíz`);
        console.log(`Archivo 2: ${tree2.length} unidades raíz`);
        
        // Comparar nombres de unidades raíz
        const nombres1 = tree1.map(u => u.nombre);
        const nombres2 = tree2.map(u => u.nombre);
        
        console.log('\n📋 UNIDADES RAÍZ:');
        console.log('Archivo 1:', nombres1);
        console.log('Archivo 2:', nombres2);
        
        // Verificar si son idénticos
        const sonIdenticos = JSON.stringify(json1) === JSON.stringify(json2);
        console.log(`\n🔍 ¿Los archivos son idénticos? ${sonIdenticos ? '✅ Sí' : '❌ No'}`);
        
        if (!sonIdenticos) {
            console.log('\n⚠️ Los archivos tienen diferencias. Revisando detalles...');
            
            // Comparar tamaño de archivos
            const size1 = file1.length;
            const size2 = file2.length;
            console.log(`\n📏 TAMAÑO DE ARCHIVOS:`);
            console.log(`Archivo 1: ${size1} caracteres`);
            console.log(`Archivo 2: ${size2} caracteres`);
            console.log(`Diferencia: ${Math.abs(size1 - size2)} caracteres`);
            
            // Buscar diferencias en funciones específicas
            console.log('\n🔍 COMPARANDO FUNCIONES ESPECÍFICAS...');
            
            // Comparar primera unidad
            if (tree1.length > 0 && tree2.length > 0) {
                const unidad1 = tree1[0];
                const unidad2 = tree2[0];
                
                console.log(`\n📋 Primera unidad - ${unidad1.nombre}:`);
                console.log(`¿Misma misión? ${unidad1.mision === unidad2.mision ? '✅ Sí' : '❌ No'}`);
                console.log(`¿Misma cantidad de funciones? ${(unidad1.funciones || []).length === (unidad2.funciones || []).length ? '✅ Sí' : '❌ No'}`);
                
                if (unidad1.funciones && unidad2.funciones) {
                    console.log(`Archivo 1: ${unidad1.funciones.length} funciones`);
                    console.log(`Archivo 2: ${unidad2.funciones.length} funciones`);
                }
            }
        }
        
    } catch (error) {
        console.error('❌ Error al comparar archivos:', error.message);
    }
}

// Ejecutar comparación
compareJSONFiles(); 