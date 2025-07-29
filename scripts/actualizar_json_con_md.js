const fs = require('fs');
const path = require('path');

// Función para leer archivos MD y extraer información
function leerArchivoMD(rutaArchivo) {
    try {
        const contenido = fs.readFileSync(rutaArchivo, 'utf8');
        const nombreUnidad = path.basename(rutaArchivo, '.md').replace(/^\d+\s*/, ''); // Remover números al inicio
        
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
            nombre: nombreUnidad,
            mision: mision,
            funcionesEspecificas: funcionesEspecificas,
            contenidoCompleto: contenido
        };
    } catch (error) {
        console.error(`Error leyendo ${rutaArchivo}:`, error.message);
        return null;
    }
}

// Función para buscar unidad en el JSON por nombre similar
function buscarUnidadEnJSON(nombreMD, jsonData) {
    const nombreNormalizado = nombreMD.toLowerCase()
        .replace(/[^a-z0-9]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    
    function buscarEnNodo(nodo) {
        const nombreJSON = nodo.nombre.toLowerCase()
            .replace(/[^a-z0-9]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        
        // Comparación exacta o muy similar
        if (nombreJSON === nombreNormalizado || 
            nombreJSON.includes(nombreNormalizado) || 
            nombreNormalizado.includes(nombreJSON)) {
            return nodo;
        }
        
        // Buscar en hijos
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

// Función para actualizar unidad en el JSON
function actualizarUnidadEnJSON(unidadJSON, datosMD) {
    let actualizaciones = [];
    
    // Actualizar misión si es diferente y más detallada
    if (datosMD.mision && datosMD.mision !== unidadJSON.mision) {
        if (datosMD.mision.length > unidadJSON.mision.length) {
            unidadJSON.mision = datosMD.mision;
            actualizaciones.push('Misión actualizada con información más detallada');
        }
    }
    
    // Agregar funciones específicas del MD que no estén en el JSON
    if (datosMD.funcionesEspecificas && datosMD.funcionesEspecificas.length > 0) {
        const funcionesExistentes = unidadJSON.funciones ? unidadJSON.funciones.map(f => f.descripcion.toLowerCase()) : [];
        
        datosMD.funcionesEspecificas.forEach((funcionMD, index) => {
            const descripcionNormalizada = funcionMD.descripcion.toLowerCase();
            const existe = funcionesExistentes.some(f => f.includes(descripcionNormalizada) || descripcionNormalizada.includes(f));
            
            if (!existe) {
                // Agregar como función específica
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

// Función principal
function actualizarJSONConMD() {
    try {
        // Leer el JSON actual
        const jsonPath = 'ia_complete_hierarchy.json';
        const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        
        // Lista de archivos MD a procesar
        const archivosMD = [
            'MD/8 CAC.md',
            'MD/9 Banca Digital.md', 
            'MD/10 Coordinacion del Negocio.md',
            'MD/11 NEgocio y Datos.md',
            'MD/12 alianzas.md',
            'MD/13 Branding y Com.md',
            'MD/14 marketing.md',
            'MD/Banca Digital.md',
            'MD/CAC Atecion Telefonica.md',
            'MD/canales.md',
            'MD/Customer ingigth.md',
            'MD/Digital MArketing.md',
            'MD/Experiencia al cliente.md',
            'MD/Gestin operativa sucursales.md',
            'MD/Gestion Comercial.md',
            'MD/REginales.md'
        ];
        
        let totalActualizaciones = 0;
        let unidadesActualizadas = [];
        
        console.log('Iniciando análisis y actualización del JSON con archivos MD...\n');
        
        // Procesar cada archivo MD
        for (const archivoMD of archivosMD) {
            if (fs.existsSync(archivoMD)) {
                const datosMD = leerArchivoMD(archivoMD);
                
                if (datosMD) {
                    console.log(`Procesando: ${datosMD.nombre}`);
                    
                    // Buscar unidad correspondiente en el JSON
                    const unidadJSON = buscarUnidadEnJSON(datosMD.nombre, jsonData);
                    
                    if (unidadJSON) {
                        console.log(`  ✓ Encontrada unidad: ${unidadJSON.nombre}`);
                        
                        // Actualizar unidad
                        const actualizaciones = actualizarUnidadEnJSON(unidadJSON, datosMD);
                        
                        if (actualizaciones.length > 0) {
                            unidadesActualizadas.push({
                                unidad: unidadJSON.nombre,
                                actualizaciones: actualizaciones
                            });
                            totalActualizaciones += actualizaciones.length;
                            
                            actualizaciones.forEach(act => {
                                console.log(`    - ${act}`);
                            });
                        } else {
                            console.log(`    - Sin actualizaciones necesarias`);
                        }
                    } else {
                        console.log(`  ⚠ No se encontró unidad correspondiente para: ${datosMD.nombre}`);
                    }
                }
            } else {
                console.log(`⚠ Archivo no encontrado: ${archivoMD}`);
            }
        }
        
        // Actualizar metadata
        jsonData.metadata.actualizado = new Date().toISOString();
        jsonData.metadata.version = "2.2-md-integration";
        
        // Guardar JSON actualizado
        fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));
        
        // Generar reporte
        const reporte = {
            fecha: new Date().toISOString(),
            totalArchivosMD: archivosMD.length,
            totalActualizaciones: totalActualizaciones,
            unidadesActualizadas: unidadesActualizadas,
            resumen: `Se procesaron ${archivosMD.length} archivos MD y se realizaron ${totalActualizaciones} actualizaciones en ${unidadesActualizadas.length} unidades`
        };
        
        // Guardar reporte
        fs.writeFileSync('contexto/reporte_actualizacion_md.json', JSON.stringify(reporte, null, 2));
        
        console.log('\n=== RESUMEN ===');
        console.log(`Total de archivos MD procesados: ${archivosMD.length}`);
        console.log(`Total de actualizaciones realizadas: ${totalActualizaciones}`);
        console.log(`Unidades actualizadas: ${unidadesActualizadas.length}`);
        console.log('\nUnidades actualizadas:');
        unidadesActualizadas.forEach(u => {
            console.log(`- ${u.unidad}: ${u.actualizaciones.length} actualizaciones`);
        });
        
        console.log('\n✓ JSON actualizado exitosamente');
        console.log('✓ Reporte guardado en contexto/reporte_actualizacion_md.json');
        
    } catch (error) {
        console.error('Error en la actualización:', error);
    }
}

// Ejecutar la función principal
actualizarJSONConMD();