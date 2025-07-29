const fs = require('fs');

// Función para analizar unidades faltantes
function analizarUnidadesFaltantes() {
    try {
        // Leer el JSON actual
        const jsonData = JSON.parse(fs.readFileSync('ia_complete_hierarchy.json', 'utf8'));
        
        // Unidades que no se encontraron en el proceso anterior
        const unidadesFaltantes = [
            'Coordinacion del Negocio',
            'Customer ingigth',
            'Experiencia al cliente',
            'Gestin operativa sucursales',
            'Gestion Comercial',
            'REginales'
        ];
        
        console.log('=== ANÁLISIS DE UNIDADES FALTANTES ===\n');
        
        // Buscar unidades similares en el JSON
        unidadesFaltantes.forEach(unidadFaltante => {
            console.log(`Analizando: ${unidadFaltante}`);
            
            const unidadesSimilares = buscarUnidadesSimilares(unidadFaltante, jsonData);
            
            if (unidadesSimilares.length > 0) {
                console.log('  Posibles coincidencias encontradas:');
                unidadesSimilares.forEach(unidad => {
                    console.log(`    - ${unidad.nombre} (similitud: ${unidad.similitud}%)`);
                });
            } else {
                console.log('  ⚠ No se encontraron unidades similares');
            }
            
            console.log('');
        });
        
        // Generar recomendaciones
        console.log('=== RECOMENDACIONES ===\n');
        
        const recomendaciones = generarRecomendaciones(unidadesFaltantes, jsonData);
        
        recomendaciones.forEach((rec, index) => {
            console.log(`${index + 1}. ${rec.unidadFaltante}:`);
            console.log(`   - Recomendación: ${rec.recomendacion}`);
            console.log(`   - Unidad sugerida: ${rec.unidadSugerida || 'N/A'}`);
            console.log(`   - Acción: ${rec.accion}`);
            console.log('');
        });
        
        // Guardar análisis
        const analisis = {
            fecha: new Date().toISOString(),
            unidadesFaltantes: unidadesFaltantes,
            recomendaciones: recomendaciones,
            resumen: `Se analizaron ${unidadesFaltantes.length} unidades faltantes y se generaron ${recomendaciones.length} recomendaciones`
        };
        
        fs.writeFileSync('contexto/analisis_unidades_faltantes.json', JSON.stringify(analisis, null, 2));
        
        console.log('✓ Análisis guardado en contexto/analisis_unidades_faltantes.json');
        
    } catch (error) {
        console.error('Error en el análisis:', error);
    }
}

// Función para buscar unidades similares
function buscarUnidadesSimilares(nombreUnidad, jsonData) {
    const nombreNormalizado = nombreUnidad.toLowerCase()
        .replace(/[^a-z0-9]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    
    const palabrasClave = nombreNormalizado.split(' ');
    const unidadesSimilares = [];
    
    function buscarEnNodo(nodo) {
        const nombreJSON = nodo.nombre.toLowerCase()
            .replace(/[^a-z0-9]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        
        // Calcular similitud
        let coincidencias = 0;
        palabrasClave.forEach(palabra => {
            if (nombreJSON.includes(palabra) && palabra.length > 2) {
                coincidencias++;
            }
        });
        
        const similitud = (coincidencias / palabrasClave.length) * 100;
        
        if (similitud > 30) {
            unidadesSimilares.push({
                nombre: nodo.nombre,
                similitud: Math.round(similitud),
                palabrasCoincidentes: coincidencias
            });
        }
        
        // Buscar en hijos
        if (nodo.children) {
            for (const hijo of nodo.children) {
                buscarEnNodo(hijo);
            }
        }
    }
    
    buscarEnNodo(jsonData.hierarchy.tree[0]);
    
    return unidadesSimilares.sort((a, b) => b.similitud - a.similitud);
}

// Función para generar recomendaciones
function generarRecomendaciones(unidadesFaltantes, jsonData) {
    const recomendaciones = [];
    
    const mapeoRecomendaciones = {
        'Coordinacion del Negocio': {
            recomendacion: 'Posible duplicado o variación de "Coordinación Del Negocio Y Datos"',
            unidadSugerida: 'Coordinación Del Negocio Y Datos',
            accion: 'Verificar si es la misma unidad con nombre ligeramente diferente'
        },
        'Customer ingigth': {
            recomendacion: 'Posible variación de "Customer Insights & Analytics"',
            unidadSugerida: 'Customer Insights & Analytics',
            accion: 'Verificar si es la misma unidad con nombre corregido'
        },
        'Experiencia al cliente': {
            recomendacion: 'Posible nueva unidad o variación de funciones existentes',
            unidadSugerida: null,
            accion: 'Evaluar si debe agregarse como nueva unidad o integrarse en funciones existentes'
        },
        'Gestin operativa sucursales': {
            recomendacion: 'Posible variación de funciones operativas existentes',
            unidadSugerida: null,
            accion: 'Evaluar si debe agregarse como nueva unidad o integrarse en funciones de Canales'
        },
        'Gestion Comercial': {
            recomendacion: 'Posible variación de funciones comerciales existentes',
            unidadSugerida: null,
            accion: 'Evaluar si debe agregarse como nueva unidad o integrarse en funciones de Segmentos'
        },
        'REginales': {
            recomendacion: 'Posible variación de "Regionales"',
            unidadSugerida: 'Regionales',
            accion: 'Verificar si es la misma unidad con nombre ligeramente diferente'
        }
    };
    
    unidadesFaltantes.forEach(unidadFaltante => {
        const mapeo = mapeoRecomendaciones[unidadFaltante];
        if (mapeo) {
            recomendaciones.push({
                unidadFaltante: unidadFaltante,
                recomendacion: mapeo.recomendacion,
                unidadSugerida: mapeo.unidadSugerida,
                accion: mapeo.accion
            });
        } else {
            recomendaciones.push({
                unidadFaltante: unidadFaltante,
                recomendacion: 'Unidad no identificada en el mapeo',
                unidadSugerida: null,
                accion: 'Revisar manualmente y determinar si debe agregarse'
            });
        }
    });
    
    return recomendaciones;
}

// Ejecutar análisis
analizarUnidadesFaltantes();