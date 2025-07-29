// Script para analizar diferencias entre MD y JSON
const fs = require('fs');

function analizarDiferencias() {
    try {
        // Leer archivos
        const mdContent = fs.readFileSync('MD/organigrama.md', 'utf8');
        const jsonContent = fs.readFileSync('estructura_organizativa_completa.json', 'utf8');
        const json = JSON.parse(jsonContent);
        
        console.log('=== ANÁLISIS MD vs JSON ===\n');
        
        // Extraer información del MD
        const mdUnidades = extraerUnidadesDelMD(mdContent);
        const jsonUnidades = extraerUnidadesDelJSON(json);
        
        console.log('📊 COMPARACIÓN DE ESTRUCTURA:');
        console.log(`Unidades en MD: ${mdUnidades.length}`);
        console.log(`Unidades en JSON: ${jsonUnidades.length}`);
        
        // Comparar unidades
        console.log('\n🔍 UNIDADES EN MD PERO NO EN JSON:');
        const unidadesFaltantes = mdUnidades.filter(u => !jsonUnidades.includes(u));
        if (unidadesFaltantes.length > 0) {
            unidadesFaltantes.forEach(u => console.log(`❌ ${u}`));
        } else {
            console.log('✅ Todas las unidades del MD están en el JSON');
        }
        
        console.log('\n🔍 UNIDADES EN JSON PERO NO EN MD:');
        const unidadesExtra = jsonUnidades.filter(u => !mdUnidades.includes(u));
        if (unidadesExtra.length > 0) {
            unidadesExtra.forEach(u => console.log(`➕ ${u}`));
        } else {
            console.log('✅ Todas las unidades del JSON están en el MD');
        }
        
        // Analizar funciones específicas
        console.log('\n📋 ANÁLISIS DE FUNCIONES ESPECÍFICAS:');
        analizarFuncionesEspecificas(mdContent, json);
        
        // Analizar indicadores
        console.log('\n📊 ANÁLISIS DE INDICADORES:');
        analizarIndicadores(mdContent, json);
        
        // Verificar misiones
        console.log('\n🎯 ANÁLISIS DE MISIONES:');
        verificarMisiones(mdContent, json);
        
    } catch (error) {
        console.error('❌ Error en el análisis:', error.message);
    }
}

function extraerUnidadesDelMD(content) {
    const unidades = [];
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Buscar unidades principales (##)
        if (line.startsWith('## ') && !line.includes('Información') && !line.includes('Resumen')) {
            const unidad = line.replace('## ', '').replace('🏢 ', '').replace('👥 ', '').replace('🏦 ', '').replace('💳 ', '').trim();
            if (unidad && !unidades.includes(unidad)) {
                unidades.push(unidad);
            }
        }
        
        // Buscar subunidades (#####)
        if (line.startsWith('##### ')) {
            const subunidad = line.replace('##### ', '').replace(/^\d+\.\s*/, '').trim();
            if (subunidad && !unidades.includes(subunidad)) {
                unidades.push(subunidad);
            }
        }
    }
    
    return unidades;
}

function extraerUnidadesDelJSON(json) {
    const unidades = [];
    
    function recorrerArbol(nodos) {
        nodos.forEach(nodo => {
            if (nodo.nombre && !unidades.includes(nodo.nombre)) {
                unidades.push(nodo.nombre);
            }
            if (nodo.children && nodo.children.length > 0) {
                recorrerArbol(nodo.children);
            }
        });
    }
    
    if (json.hierarchy && json.hierarchy.tree) {
        recorrerArbol(json.hierarchy.tree);
    }
    
    return unidades;
}

function analizarFuncionesEspecificas(mdContent, json) {
    // Buscar funciones específicas en MD
    const mdFunciones = [];
    const lines = mdContent.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.includes('**Funciones Específicas:**')) {
            let j = i + 1;
            while (j < lines.length && !lines[j].includes('**Indicadores:**') && !lines[j].startsWith('##') && !lines[j].startsWith('#####')) {
                const funcLine = lines[j].trim();
                if (funcLine.startsWith('-') && funcLine.includes('%')) {
                    mdFunciones.push(funcLine);
                }
                j++;
            }
        }
    }
    
    console.log(`Funciones específicas en MD: ${mdFunciones.length}`);
    
    // Contar funciones específicas en JSON
    let jsonFuncionesEspecificas = 0;
    function contarFunciones(nodos) {
        nodos.forEach(nodo => {
            if (nodo.funciones) {
                nodo.funciones.forEach(func => {
                    if (func.tipo === 'Específica') {
                        jsonFuncionesEspecificas++;
                    }
                });
            }
            if (nodo.children) {
                contarFunciones(nodo.children);
            }
        });
    }
    
    if (json.hierarchy && json.hierarchy.tree) {
        contarFunciones(json.hierarchy.tree);
    }
    
    console.log(`Funciones específicas en JSON: ${jsonFuncionesEspecificas}`);
    
    if (mdFunciones.length !== jsonFuncionesEspecificas) {
        console.log(`⚠️ Diferencia: ${Math.abs(mdFunciones.length - jsonFuncionesEspecificas)} funciones`);
    }
}

function analizarIndicadores(mdContent, json) {
    // Buscar indicadores en MD
    const mdIndicadores = [];
    const lines = mdContent.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.includes('**Indicadores:**')) {
            let j = i + 1;
            while (j < lines.length && !lines[j].includes('**Funciones') && !lines[j].startsWith('##') && !lines[j].startsWith('#####')) {
                const indLine = lines[j].trim();
                if (indLine.startsWith('-')) {
                    mdIndicadores.push(indLine);
                }
                j++;
            }
        }
    }
    
    console.log(`Indicadores en MD: ${mdIndicadores.length}`);
    
    // Contar indicadores en JSON
    let jsonIndicadores = 0;
    function contarIndicadores(nodos) {
        nodos.forEach(nodo => {
            if (nodo.funciones) {
                nodo.funciones.forEach(func => {
                    if (func.tipo === 'Indicador') {
                        jsonIndicadores++;
                    }
                });
            }
            if (nodo.children) {
                contarIndicadores(nodo.children);
            }
        });
    }
    
    if (json.hierarchy && json.hierarchy.tree) {
        contarIndicadores(json.hierarchy.tree);
    }
    
    console.log(`Indicadores en JSON: ${jsonIndicadores}`);
    
    if (mdIndicadores.length !== jsonIndicadores) {
        console.log(`⚠️ Diferencia: ${Math.abs(mdIndicadores.length - jsonIndicadores)} indicadores`);
    }
}

function verificarMisiones(mdContent, json) {
    // Extraer misiones del MD
    const mdMisiones = [];
    const lines = mdContent.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.includes('**Misión:**')) {
            let j = i + 1;
            let mision = '';
            while (j < lines.length && !lines[j].includes('**Funciones') && !lines[j].startsWith('##') && !lines[j].startsWith('#####')) {
                const misionLine = lines[j].trim();
                if (misionLine && !misionLine.startsWith('**')) {
                    mision += misionLine + ' ';
                }
                j++;
            }
            if (mision.trim()) {
                mdMisiones.push(mision.trim());
            }
        }
    }
    
    console.log(`Misiones en MD: ${mdMisiones.length}`);
    
    // Contar misiones en JSON
    let jsonMisiones = 0;
    function contarMisiones(nodos) {
        nodos.forEach(nodo => {
            if (nodo.mision && nodo.mision.trim()) {
                jsonMisiones++;
            }
            if (nodo.children) {
                contarMisiones(nodo.children);
            }
        });
    }
    
    if (json.hierarchy && json.hierarchy.tree) {
        contarMisiones(json.hierarchy.tree);
    }
    
    console.log(`Misiones en JSON: ${jsonMisiones}`);
    
    if (mdMisiones.length !== jsonMisiones) {
        console.log(`⚠️ Diferencia: ${Math.abs(mdMisiones.length - jsonMisiones)} misiones`);
    }
}

// Ejecutar análisis
analizarDiferencias(); 