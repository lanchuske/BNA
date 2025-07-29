// Análisis detallado de mejoras necesarias
const fs = require('fs');

function analisisDetallado() {
    try {
        const mdContent = fs.readFileSync('MD/organigrama.md', 'utf8');
        const jsonContent = fs.readFileSync('estructura_organizativa_completa.json', 'utf8');
        const json = JSON.parse(jsonContent);
        
        console.log('=== ANÁLISIS DETALLADO DE MEJORAS ===\n');
        
        // 1. Verificar estructura de unidades principales
        console.log('🏢 1. ESTRUCTURA DE UNIDADES PRINCIPALES:');
        verificarUnidadesPrincipales(mdContent, json);
        
        // 2. Verificar subunidades faltantes
        console.log('\n📋 2. SUBUNIDADES FALTANTES:');
        verificarSubunidadesFaltantes(mdContent, json);
        
        // 3. Verificar funciones específicas detalladas
        console.log('\n🔧 3. FUNCIONES ESPECÍFICAS DETALLADAS:');
        verificarFuncionesEspecificasDetalladas(mdContent, json);
        
        // 4. Verificar indicadores clave
        console.log('\n📊 4. INDICADORES CLAVE:');
        verificarIndicadoresClave(mdContent, json);
        
        // 5. Verificar misiones completas
        console.log('\n🎯 5. MISIONES COMPLETAS:');
        verificarMisionesCompletas(mdContent, json);
        
        // 6. Generar recomendaciones
        console.log('\n💡 6. RECOMENDACIONES DE MEJORA:');
        generarRecomendaciones(mdContent, json);
        
    } catch (error) {
        console.error('❌ Error en análisis detallado:', error.message);
    }
}

function verificarUnidadesPrincipales(mdContent, json) {
    const unidadesMD = [
        'SGP Clientes',
        'Segmento Personas', 
        'Segmento Empresas',
        'Gerencia de Productos Financieros',
        'Gerencia de Medios de Pago',
        'Gerencia de Clientes'
    ];
    
    const unidadesJSON = [];
    function extraerUnidades(nodos) {
        nodos.forEach(nodo => {
            if (nodo.nombre && !unidadesJSON.includes(nodo.nombre)) {
                unidadesJSON.push(nodo.nombre);
            }
            if (nodo.children) {
                extraerUnidades(nodo.children);
            }
        });
    }
    
    if (json.hierarchy && json.hierarchy.tree) {
        extraerUnidades(json.hierarchy.tree);
    }
    
    console.log('Unidades principales en MD:', unidadesMD);
    console.log('Unidades principales en JSON:', unidadesJSON.filter(u => unidadesMD.includes(u)));
    
    const faltantes = unidadesMD.filter(u => !unidadesJSON.includes(u));
    if (faltantes.length > 0) {
        console.log('❌ Unidades faltantes en JSON:', faltantes);
    } else {
        console.log('✅ Todas las unidades principales están presentes');
    }
}

function verificarSubunidadesFaltantes(mdContent, json) {
    const subunidadesMD = [
        'Estrategia Comercial Y Propuesta De Valor',
        'Inteligencia Comercial',
        'Comunicaciones Y Eventos',
        'Head De Segmentos',
        'Head De Segmentos (Haberes, Profesionales e Independientes, Renta Alta, Joven, Jubilados y Renta Masiva)',
        'Estrategia Comercial Y Propuesta De Valor Empresas',
        'Inteligencia Comercial Empresas',
        'Comunicaciones Y Eventos Empresas',
        'Head De Segmentos Empresas (MiPymes, Grandes Empresas, Sector Público, Agro y Energía)',
        'Head De Segmentos Empresas',
        'Activos',
        'Banca Digital',
        'Pasivos',
        'Regionales',
        'Inversiones',
        'Seguros',
        'Mantenimiento y Features de Medios de Pago',
        'Desarrollo de Medios de Pago',
        'Adquirencia',
        'Recaudaciones',
        'Coordinación del Negocio',
        'Negocio y Datos',
        'Alianzas y Patrocinios',
        'Branding y Comunicaciones',
        'Marketing y Banca Digital',
        'CAC Atención Telefónica',
        'Canales',
        'Customer Insight',
        'Digital Marketing',
        'Experiencia al Cliente',
        'Gestión Operativa Sucursales',
        'Gestión Comercial',
        'Regionales'
    ];
    
    const subunidadesJSON = [];
    function extraerSubunidades(nodos) {
        nodos.forEach(nodo => {
            if (nodo.nombre && !subunidadesJSON.includes(nodo.nombre)) {
                subunidadesJSON.push(nodo.nombre);
            }
            if (nodo.children) {
                extraerSubunidades(nodo.children);
            }
        });
    }
    
    if (json.hierarchy && json.hierarchy.tree) {
        extraerSubunidades(json.hierarchy.tree);
    }
    
    const faltantes = subunidadesMD.filter(u => !subunidadesJSON.includes(u));
    if (faltantes.length > 0) {
        console.log('❌ Subunidades faltantes en JSON:');
        faltantes.forEach(u => console.log(`   - ${u}`));
    } else {
        console.log('✅ Todas las subunidades están presentes');
    }
}

function verificarFuncionesEspecificasDetalladas(mdContent, json) {
    // Extraer funciones específicas detalladas del MD
    const funcionesMD = extraerFuncionesEspecificasDelMD(mdContent);
    
    console.log(`Funciones específicas detalladas en MD: ${funcionesMD.length}`);
    
    // Contar funciones específicas en JSON
    let funcionesJSON = 0;
    function contarFunciones(nodos) {
        nodos.forEach(nodo => {
            if (nodo.funciones) {
                nodo.funciones.forEach(func => {
                    if (func.tipo === 'Específica') {
                        funcionesJSON++;
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
    
    console.log(`Funciones específicas en JSON: ${funcionesJSON}`);
    
    if (funcionesMD.length < funcionesJSON) {
        console.log(`⚠️ El JSON tiene ${funcionesJSON - funcionesMD.length} funciones específicas más que el MD`);
        console.log('💡 Posibles causas:');
        console.log('   - Funciones duplicadas en JSON');
        console.log('   - Funciones no documentadas en MD');
        console.log('   - Diferentes criterios de clasificación');
    }
}

function extraerFuncionesEspecificasDelMD(content) {
    const funciones = [];
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.includes('**Funciones Específicas:**')) {
            let j = i + 1;
            while (j < lines.length && !lines[j].includes('**Indicadores:**') && !lines[j].startsWith('##') && !lines[j].startsWith('#####')) {
                const funcLine = lines[j].trim();
                if (funcLine.startsWith('-') && funcLine.includes('%')) {
                    funciones.push(funcLine);
                }
                j++;
            }
        }
    }
    
    return funciones;
}

function verificarIndicadoresClave(mdContent, json) {
    // Extraer indicadores clave del MD
    const indicadoresMD = extraerIndicadoresClaveDelMD(mdContent);
    
    console.log(`Indicadores clave en MD: ${indicadoresMD.length}`);
    
    // Contar indicadores en JSON
    let indicadoresJSON = 0;
    function contarIndicadores(nodos) {
        nodos.forEach(nodo => {
            if (nodo.funciones) {
                nodo.funciones.forEach(func => {
                    if (func.tipo === 'Indicador') {
                        indicadoresJSON++;
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
    
    console.log(`Indicadores en JSON: ${indicadoresJSON}`);
    
    if (indicadoresMD.length < indicadoresJSON) {
        console.log(`⚠️ El JSON tiene ${indicadoresJSON - indicadoresMD.length} indicadores más que el MD`);
    }
}

function extraerIndicadoresClaveDelMD(content) {
    const indicadores = [];
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.includes('**Indicadores:**')) {
            let j = i + 1;
            while (j < lines.length && !lines[j].includes('**Funciones') && !lines[j].startsWith('##') && !lines[j].startsWith('#####')) {
                const indLine = lines[j].trim();
                if (indLine.startsWith('-')) {
                    indicadores.push(indLine);
                }
                j++;
            }
        }
    }
    
    return indicadores;
}

function verificarMisionesCompletas(mdContent, json) {
    // Extraer misiones del MD
    const misionesMD = extraerMisionesDelMD(mdContent);
    
    console.log(`Misiones en MD: ${misionesMD.length}`);
    
    // Contar misiones en JSON
    let misionesJSON = 0;
    function contarMisiones(nodos) {
        nodos.forEach(nodo => {
            if (nodo.mision && nodo.mision.trim()) {
                misionesJSON++;
            }
            if (nodo.children) {
                contarMisiones(nodo.children);
            }
        });
    }
    
    if (json.hierarchy && json.hierarchy.tree) {
        contarMisiones(json.hierarchy.tree);
    }
    
    console.log(`Misiones en JSON: ${misionesJSON}`);
    
    if (misionesMD.length < misionesJSON) {
        console.log(`⚠️ El JSON tiene ${misionesJSON - misionesMD.length} misiones más que el MD`);
    }
}

function extraerMisionesDelMD(content) {
    const misiones = [];
    const lines = content.split('\n');
    
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
                misiones.push(mision.trim());
            }
        }
    }
    
    return misiones;
}

function generarRecomendaciones(mdContent, json) {
    console.log('📋 RECOMENDACIONES DE MEJORA:');
    
    console.log('\n1. 🔧 CORRECCIONES ESTRUCTURALES:');
    console.log('   - Verificar que todas las unidades del MD estén en el JSON');
    console.log('   - Asegurar que las subunidades estén correctamente organizadas');
    console.log('   - Validar la jerarquía de reporte entre unidades');
    
    console.log('\n2. 📊 VALIDACIÓN DE DATOS:');
    console.log('   - Revisar funciones duplicadas en el JSON');
    console.log('   - Verificar que los porcentajes de dedicación sumen 100%');
    console.log('   - Validar que los indicadores tengan productos finales definidos');
    
    console.log('\n3. 🎯 CONTENIDO FALTANTE:');
    console.log('   - Agregar misiones faltantes para unidades sin misión');
    console.log('   - Completar funciones específicas detalladas');
    console.log('   - Incluir indicadores clave faltantes');
    
    console.log('\n4. 🔄 SINCRONIZACIÓN:');
    console.log('   - Actualizar el MD con las unidades adicionales del JSON');
    console.log('   - Sincronizar nombres de unidades entre MD y JSON');
    console.log('   - Verificar consistencia en la nomenclatura');
    
    console.log('\n5. 📈 MEJORAS SUGERIDAS:');
    console.log('   - Agregar metadatos de calidad por unidad');
    console.log('   - Incluir información de contacto/responsable');
    console.log('   - Agregar fechas de última actualización');
    console.log('   - Incluir versiones de documentos asociados');
}

// Ejecutar análisis detallado
analisisDetallado(); 