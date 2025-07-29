// Script para verificar la unificación de Head De Segmentos
const fs = require('fs');

function verificarUnificacion() {
    try {
        // Leer el JSON actual
        const jsonContent = fs.readFileSync('estructura_organizativa_completa.json', 'utf8');
        const json = JSON.parse(jsonContent);
        
        console.log('=== VERIFICANDO UNIFICACIÓN HEAD DE SEGMENTOS ===\n');
        
        let segmentoPersonasEncontrado = false;
        let headCompletoEncontrado = false;
        let headSimpleEncontrado = false;
        let totalFunciones = 0;
        let totalSubunidades = 0;
        
        // Función para procesar nodos recursivamente
        function procesarNodos(nodos) {
            nodos.forEach(nodo => {
                if (nodo.nombre === 'Segmento Personas') {
                    segmentoPersonasEncontrado = true;
                    console.log('📍 Segmento Personas encontrado');
                    
                    if (nodo.children) {
                        console.log(`   📁 Subunidades encontradas: ${nodo.children.length}`);
                        
                        nodo.children.forEach(child => {
                            if (child.nombre === 'Head De Segmentos (Haberes, Profesionales e Independientes, Renta Alta, Joven, Jubilados y Renta Masiva)') {
                                headCompletoEncontrado = true;
                                console.log('   ✅ Head De Segmentos (completo) encontrado');
                                
                                if (child.funciones) {
                                    totalFunciones = child.funciones.length;
                                    console.log(`      📋 Funciones: ${totalFunciones}`);
                                    
                                    // Mostrar tipos de funciones
                                    const tipos = {};
                                    child.funciones.forEach(f => {
                                        tipos[f.tipo] = (tipos[f.tipo] || 0) + 1;
                                    });
                                    
                                    Object.entries(tipos).forEach(([tipo, cantidad]) => {
                                        console.log(`         - ${tipo}: ${cantidad}`);
                                    });
                                }
                                
                                if (child.children) {
                                    totalSubunidades = child.children.length;
                                    console.log(`      📁 Subunidades: ${totalSubunidades}`);
                                    
                                    child.children.forEach(sub => {
                                        console.log(`         - ${sub.nombre}`);
                                    });
                                }
                                
                            } else if (child.nombre === 'Head De Segmentos') {
                                headSimpleEncontrado = true;
                                console.log('   ❌ Head De Segmentos (simple) aún existe - ERROR');
                            }
                        });
                    }
                }
                
                // Procesar hijos recursivamente
                if (nodo.children && nodo.children.length > 0) {
                    procesarNodos(nodo.children);
                }
            });
        }
        
        // Procesar todo el árbol
        if (json.hierarchy && json.hierarchy.tree) {
            procesarNodos(json.hierarchy.tree);
        }
        
        console.log('\n📊 RESULTADO DE LA VERIFICACIÓN:');
        console.log(`   Segmento Personas encontrado: ${segmentoPersonasEncontrado ? '✅' : '❌'}`);
        console.log(`   Head De Segmentos (completo): ${headCompletoEncontrado ? '✅' : '❌'}`);
        console.log(`   Head De Segmentos (simple): ${headSimpleEncontrado ? '❌ ERROR' : '✅ Eliminado'}`);
        console.log(`   Total de funciones unificadas: ${totalFunciones}`);
        console.log(`   Total de subunidades: ${totalSubunidades}`);
        
        if (segmentoPersonasEncontrado && headCompletoEncontrado && !headSimpleEncontrado) {
            console.log('\n✅ VERIFICACIÓN EXITOSA');
            console.log('   - La unificación se realizó correctamente');
            console.log('   - Solo existe Head De Segmentos (completo)');
            console.log('   - Head De Segmentos (simple) fue eliminada');
        } else {
            console.log('\n❌ VERIFICACIÓN FALLIDA');
            if (headSimpleEncontrado) {
                console.log('   - Head De Segmentos (simple) aún existe');
            }
            if (!headCompletoEncontrado) {
                console.log('   - Head De Segmentos (completo) no se encontró');
            }
        }
        
    } catch (error) {
        console.error('❌ Error al verificar unificación:', error.message);
    }
}

// Ejecutar el script
verificarUnificacion(); 