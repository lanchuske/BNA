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

// Función para corregir porcentajes específicos
function corregirPorcentajesEspecificos() {
    console.log('=== CORRECCIÓN DE PORCENTAJES ESPECÍFICOS ===\n');
    
    const filePath = 'organigrama_bna_2025-07-30_marketing_limpio copy.json';
    const data = loadJSON(filePath);
    
    if (!data) {
        console.error('No se pudo cargar el archivo JSON');
        return;
    }
    
    let estadisticas = {
        porcentajesCorregidos: 0,
        unidadesCorregidas: 0
    };
    
    // Función recursiva para procesar todas las unidades
    function processUnit(unit) {
        let unidadCorregida = false;
        
        if (unit.funciones && Array.isArray(unit.funciones)) {
            const funcionesEspecificas = unit.funciones.filter(f => f.tipo === "Específica");
            
            if (funcionesEspecificas.length > 0) {
                // Verificar porcentajes que no son múltiplos de 5
                let porcentajesIncorrectos = [];
                funcionesEspecificas.forEach(funcion => {
                    const porcentaje = parseInt(funcion.porcentajeDedicacion);
                    if (porcentaje % 5 !== 0) {
                        porcentajesIncorrectos.push({
                            funcion: funcion,
                            porcentaje: porcentaje
                        });
                    }
                });
                
                if (porcentajesIncorrectos.length > 0) {
                    console.log(`🔧 Corrigiendo porcentajes en "${unit.nombre}":`);
                    porcentajesIncorrectos.forEach(item => {
                        console.log(`   - ${item.porcentaje}% → ${Math.round(item.porcentaje / 5) * 5}%`);
                        item.funcion.porcentajeDedicacion = (Math.round(item.porcentaje / 5) * 5).toString();
                        estadisticas.porcentajesCorregidos++;
                    });
                    unidadCorregida = true;
                }
                
                // Recalcular suma después de corregir porcentajes
                const sumaActual = funcionesEspecificas.reduce((sum, f) => {
                    return sum + (parseInt(f.porcentajeDedicacion) || 0);
                }, 0);
                
                if (sumaActual !== 100) {
                    console.log(`🔧 Redistribuyendo porcentajes en "${unit.nombre}": ${sumaActual}% → 100%`);
                    
                    const totalFunciones = funcionesEspecificas.length;
                    const porcentajeBase = Math.floor(100 / totalFunciones);
                    const resto = 100 % totalFunciones;
                    
                    let contador = 0;
                    funcionesEspecificas.forEach(funcion => {
                        let nuevoPorcentaje = porcentajeBase;
                        if (contador < resto) {
                            nuevoPorcentaje += 1;
                        }
                        funcion.porcentajeDedicacion = nuevoPorcentaje.toString();
                        contador++;
                    });
                    
                    estadisticas.porcentajesCorregidos++;
                    unidadCorregida = true;
                }
            }
        }
        
        if (unidadCorregida) {
            estadisticas.unidadesCorregidas++;
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
    
    console.log('\n=== RESUMEN DE CORRECCIONES ===');
    console.log(`✅ Porcentajes corregidos: ${estadisticas.porcentajesCorregidos}`);
    console.log(`✅ Unidades corregidas: ${estadisticas.unidadesCorregidas}`);
    
    if (estadisticas.porcentajesCorregidos > 0) {
        saveJSON(filePath, data);
        console.log('\n✅ Archivo corregido y guardado correctamente');
    } else {
        console.log('\nℹ️  No se encontraron porcentajes que requieran corrección');
    }
}

// Ejecutar corrección
corregirPorcentajesEspecificos(); 