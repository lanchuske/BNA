const fs = require('fs');

// Función para cargar el archivo JSON
function loadJSON(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error al cargar el archivo: ${error.message}`);
        return null;
    }
}

// Función para guardar el archivo JSON
function saveJSON(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log('Archivo guardado correctamente');
    } catch (error) {
        console.error(`Error al guardar el archivo: ${error.message}`);
    }
}

// Función para reemplazar productos finales genéricos
function replaceGenericProductosFinales() {
    console.log('=== CORRECCIÓN DE PRODUCTOS FINALES GENÉRICOS ===\n');
    
    const filePath = 'organigrama_bna_2025-07-30_marketing_limpio.json';
    const data = loadJSON(filePath);
    
    if (!data) {
        console.error('No se pudo cargar el archivo JSON');
        return;
    }
    
    let replacements = 0;
    
    // Función recursiva para procesar todas las unidades
    function processUnit(unit) {
        if (unit.funciones && Array.isArray(unit.funciones)) {
            unit.funciones.forEach(funcion => {
                if (funcion.productoFinal === "Producto específico del área") {
                    // Crear un producto final específico basado en la descripción
                    const descripcion = funcion.descripcion.toLowerCase();
                    
                    let nuevoProductoFinal = "";
                    
                    if (descripcion.includes("monitoreo") || descripcion.includes("kpi") || descripcion.includes("performance")) {
                        nuevoProductoFinal = "Reporte de Monitoreo y Performance";
                    } else if (descripcion.includes("soporte") || descripcion.includes("regiones") || descripcion.includes("sucursales")) {
                        nuevoProductoFinal = "Soporte a Regiones y Sucursales";
                    } else if (descripcion.includes("seguimiento") || descripcion.includes("campañas") || descripcion.includes("cierre")) {
                        nuevoProductoFinal = "Reporte de Seguimiento de Campañas";
                    } else if (descripcion.includes("capacidades") || descripcion.includes("herramientas") || descripcion.includes("kits")) {
                        nuevoProductoFinal = "Kits y Herramientas Comerciales";
                    } else if (descripcion.includes("gestión") || descripcion.includes("administración")) {
                        nuevoProductoFinal = "Gestión Administrativa";
                    } else if (descripcion.includes("coordinación") || descripcion.includes("articulación")) {
                        nuevoProductoFinal = "Coordinación Interáreas";
                    } else if (descripcion.includes("análisis") || descripcion.includes("estudios")) {
                        nuevoProductoFinal = "Análisis y Estudios Especializados";
                    } else if (descripcion.includes("implementación") || descripcion.includes("ejecución")) {
                        nuevoProductoFinal = "Implementación de Proyectos";
                    } else if (descripcion.includes("supervisión") || descripcion.includes("control")) {
                        nuevoProductoFinal = "Supervisión y Control de Procesos";
                    } else if (descripcion.includes("desarrollo") || descripcion.includes("evolución")) {
                        nuevoProductoFinal = "Desarrollo y Evolución de Servicios";
                    } else {
                        nuevoProductoFinal = "Producto Especializado del Área";
                    }
                    
                    funcion.productoFinal = nuevoProductoFinal;
                    replacements++;
                    
                    console.log(`✅ Reemplazado: "${funcion.descripcion.substring(0, 50)}..." → "${nuevoProductoFinal}"`);
                }
            });
        }
        
        // Procesar unidades hijas
        if (unit.children && Array.isArray(unit.children)) {
            unit.children.forEach(child => processUnit(child));
        }
    }
    
    // Procesar todas las unidades
    if (data.hierarchy && data.hierarchy.tree) {
        data.hierarchy.tree.forEach(unit => processUnit(unit));
    }
    
    console.log(`\n=== RESUMEN ===`);
    console.log(`✅ Total de reemplazos realizados: ${replacements}`);
    
    if (replacements > 0) {
        saveJSON(filePath, data);
        console.log('✅ Archivo actualizado correctamente');
    } else {
        console.log('ℹ️  No se encontraron productos finales genéricos para reemplazar');
    }
}

// Ejecutar corrección
replaceGenericProductosFinales(); 