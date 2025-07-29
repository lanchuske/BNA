const fs = require('fs');

// Función para actualizar unidades faltantes con coincidencias claras
function actualizarUnidadesFaltantes() {
    try {
        // Leer el JSON actual
        const jsonData = JSON.parse(fs.readFileSync('ia_complete_hierarchy.json', 'utf8'));
        
        // Mapeo de unidades faltantes con sus coincidencias
        const mapeoUnidades = {
            'Coordinacion del Negocio': 'Coordinación Del Negocio Y Datos',
            'Customer ingigth': 'Customer Insights & Analytics',
            'Experiencia al cliente': 'Experiencia Del Cliente Y Modelo De Atención',
            'Gestin operativa sucursales': 'Gestión Operativa De Sucursales',
            'Gestion Comercial': 'Gestión Comercial',
            'REginales': 'Regionales'
        };
        
        console.log('=== ACTUALIZACIÓN DE UNIDADES FALTANTES ===\n');
        
        let actualizacionesRealizadas = 0;
        const unidadesActualizadas = [];
        
        // Procesar cada mapeo
        Object.entries(mapeoUnidades).forEach(([unidadFaltante, unidadCoincidente]) => {
            console.log(`Procesando: ${unidadFaltante} → ${unidadCoincidente}`);
            
            // Buscar la unidad coincidente en el JSON
            const unidadEncontrada = buscarUnidadEnJSON(unidadCoincidente, jsonData);
            
            if (unidadEncontrada) {
                console.log(`  ✓ Encontrada unidad: ${unidadEncontrada.nombre}`);
                
                // Leer el archivo MD correspondiente
                const archivoMD = encontrarArchivoMD(unidadFaltante);
                
                if (archivoMD) {
                    const datosMD = leerArchivoMD(archivoMD);
                    
                    if (datosMD) {
                        // Actualizar la unidad
                        const actualizaciones = actualizarUnidadConMD(unidadEncontrada, datosMD);
                        
                        if (actualizaciones.length > 0) {
                            unidadesActualizadas.push({
                                unidadOriginal: unidadFaltante,
                                unidadActualizada: unidadCoincidente,
                                actualizaciones: actualizaciones
                            });
                            actualizacionesRealizadas += actualizaciones.length;
                            
                            actualizaciones.forEach(act => {
                                console.log(`    - ${act}`);
                            });
                        } else {
                            console.log(`    - Sin actualizaciones necesarias`);
                        }
                    }
                } else {
                    console.log(`    ⚠ Archivo MD no encontrado para: ${unidadFaltante}`);
                }
            } else {
                console.log(`    ⚠ Unidad no encontrada: ${unidadCoincidente}`);
            }
            
            console.log('');
        });
        
        // Actualizar metadata
        jsonData.metadata.actualizado = new Date().toISOString();
        jsonData.metadata.version = "2.3-unidades-faltantes";
        
        // Guardar JSON actualizado
        fs.writeFileSync('ia_complete_hierarchy.json', JSON.stringify(jsonData, null, 2));
        
        // Generar reporte
        const reporte = {
            fecha: new Date().toISOString(),
            totalUnidadesProcesadas: Object.keys(mapeoUnidades).length,
            totalActualizaciones: actualizacionesRealizadas,
            unidadesActualizadas: unidadesActualizadas,
            resumen: `Se procesaron ${Object.keys(mapeoUnidades).length} unidades faltantes y se realizaron ${actualizacionesRealizadas} actualizaciones`
        };
        
        fs.writeFileSync('contexto/reporte_unidades_faltantes.json', JSON.stringify(reporte, null, 2));
        
        console.log('=== RESUMEN ===');
        console.log(`Total de unidades procesadas: ${Object.keys(mapeoUnidades).length}`);
        console.log(`Total de actualizaciones realizadas: ${actualizacionesRealizadas}`);
        console.log(`Unidades actualizadas: ${unidadesActualizadas.length}`);
        
        console.log('\nUnidades actualizadas:');
        unidadesActualizadas.forEach(u => {
            console.log(`- ${u.unidadOriginal} → ${u.unidadActualizada}: ${u.actualizaciones.length} actualizaciones`);
        });
        
        console.log('\n✓ JSON actualizado exitosamente');
        console.log('✓ Reporte guardado en contexto/reporte_unidades_faltantes.json');
        
    } catch (error) {
        console.error('Error en la actualización:', error);
    }
}

// Función para buscar unidad en el JSON
function buscarUnidadEnJSON(nombreUnidad, jsonData) {
    function buscarEnNodo(nodo) {
        if (nodo.nombre === nombreUnidad) {
            return nodo;
        }
        
        if (nodo.children) {
            for (const hijo of nodo.children) {
                const resultado = buscarEnNodo(hijo);
                if (resultado) return resultado;
            }
        }
        
        return null;
    }
    
    return buscarEnNodo(jsonData.hierarchy.tree[0]);
}

// Función para encontrar archivo MD
function encontrarArchivoMD(nombreUnidad) {
    const archivosMD = [
        'MD/10 Coordinacion del Negocio.md',
        'MD/Customer ingigth.md',
        'MD/Experiencia al cliente.md',
        'MD/Gestin operativa sucursales.md',
        'MD/Gestion Comercial.md',
        'MD/REginales.md'
    ];
    
    const mapeoArchivos = {
        'Coordinacion del Negocio': 'MD/10 Coordinacion del Negocio.md',
        'Customer ingigth': 'MD/Customer ingigth.md',
        'Experiencia al cliente': 'MD/Experiencia al cliente.md',
        'Gestin operativa sucursales': 'MD/Gestin operativa sucursales.md',
        'Gestion Comercial': 'MD/Gestion Comercial.md',
        'REginales': 'MD/REginales.md'
    };
    
    return mapeoArchivos[nombreUnidad];
}

// Función para leer archivo MD
function leerArchivoMD(rutaArchivo) {
    try {
        if (!fs.existsSync(rutaArchivo)) {
            return null;
        }
        
        const contenido = fs.readFileSync(rutaArchivo, 'utf8');
        
        // Extraer misión
        const misionMatch = contenido.match(/Misión\s*\n(.*?)(?=\n\n|\nFunciones)/s);
        const mision = misionMatch ? misionMatch[1].trim() : '';
        
        // Extraer funciones específicas con porcentajes
        const funcionesEspecificas = [];
        const regexFunciones = /(\d+%\s*\n)(.*?)(?=\d+%\s*\n|$)/gs;
        let match;
        
        while ((match = regexFunciones.exec(contenido)) !== null) {
            const porcentaje = match[1].trim();
            const descripcion = match[2].trim();
            if (descripcion) {
                funcionesEspecificas.push({
                    porcentaje: porcentaje,
                    descripcion: descripcion
                });
            }
        }
        
        return {
            mision: mision,
            funcionesEspecificas: funcionesEspecificas
        };
    } catch (error) {
        console.error(`Error leyendo ${rutaArchivo}:`, error.message);
        return null;
    }
}

// Función para actualizar unidad con datos MD
function actualizarUnidadConMD(unidadJSON, datosMD) {
    let actualizaciones = [];
    
    // Actualizar misión si es más detallada
    if (datosMD.mision && datosMD.mision.length > unidadJSON.mision.length) {
        unidadJSON.mision = datosMD.mision;
        actualizaciones.push('Misión actualizada con información más detallada');
    }
    
    // Agregar funciones específicas que no existan
    if (datosMD.funcionesEspecificas && datosMD.funcionesEspecificas.length > 0) {
        const funcionesExistentes = unidadJSON.funciones ? unidadJSON.funciones.map(f => f.descripcion.toLowerCase()) : [];
        
        datosMD.funcionesEspecificas.forEach((funcionMD, index) => {
            const descripcionNormalizada = funcionMD.descripcion.toLowerCase();
            const existe = funcionesExistentes.some(f => f.includes(descripcionNormalizada) || descripcionNormalizada.includes(f));
            
            if (!existe) {
                const nuevaFuncion = {
                    orden: (unidadJSON.funciones ? unidadJSON.funciones.length : 0) + index + 1,
                    tipo: "Específica",
                    descripcion: funcionMD.descripcion,
                    productoFinal: "Producto específico del área",
                    porcentajeDedicacion: funcionMD.porcentaje.replace('%', '')
                };
                
                if (!unidadJSON.funciones) unidadJSON.funciones = [];
                unidadJSON.funciones.push(nuevaFuncion);
                actualizaciones.push(`Función específica agregada: ${funcionMD.descripcion.substring(0, 50)}...`);
            }
        });
    }
    
    return actualizaciones;
}

// Ejecutar actualización
actualizarUnidadesFaltantes();