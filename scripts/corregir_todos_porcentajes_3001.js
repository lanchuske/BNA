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

// Función para corregir todos los porcentajes
function corregirTodosPorcentajes() {
    console.log('=== CORRECCIÓN DE TODOS LOS PORCENTAJES DE DEDICACIÓN ===\n');
    
    const filePath = 'organigrama_bna_2025-07-30_marketing_limpio.json';
    const data = loadJSON(filePath);
    
    if (!data) {
        console.error('No se pudo cargar el archivo JSON');
        return;
    }
    
    let unidadesCorregidas = 0;
    
    // Función recursiva para procesar todas las unidades
    function processUnit(unit) {
        if (unit.funciones && Array.isArray(unit.funciones)) {
            const funcionesEspecificas = unit.funciones.filter(f => f.tipo === "Específica");
            
            if (funcionesEspecificas.length > 0) {
                const sumaActual = funcionesEspecificas.reduce((sum, f) => {
                    const porcentaje = parseInt(f.porcentajeDedicacion) || 0;
                    return sum + porcentaje;
                }, 0);
                
                if (sumaActual !== 100) {
                    console.log(`🔧 Corrigiendo ${unit.nombre}: ${sumaActual}% → 100% (${funcionesEspecificas.length} funciones específicas)`);
                    
                    // Redistribuir porcentajes
                    const totalFunciones = funcionesEspecificas.length;
                    const porcentajeBase = Math.floor(100 / totalFunciones);
                    const resto = 100 % totalFunciones;
                    
                    let contador = 0;
                    for (const funcion of unit.funciones) {
                        if (funcion.tipo === "Específica") {
                            let nuevoPorcentaje = porcentajeBase;
                            if (contador < resto) {
                                nuevoPorcentaje += 1;
                            }
                            
                            const porcentajeAnterior = funcion.porcentajeDedicacion;
                            funcion.porcentajeDedicacion = nuevoPorcentaje.toString();
                            
                            console.log(`   ✅ Función orden ${funcion.orden}: ${porcentajeAnterior}% → ${nuevoPorcentaje}%`);
                            contador++;
                        }
                    }
                    
                    // Verificar suma final
                    const sumaFinal = funcionesEspecificas.reduce((sum, f) => {
                        const porcentaje = parseInt(f.porcentajeDedicacion) || 0;
                        return sum + porcentaje;
                    }, 0);
                    
                    if (sumaFinal === 100) {
                        console.log(`   ✅ ${unit.nombre}: Redistribución exitosa - suma exactamente 100%`);
                        unidadesCorregidas++;
                    } else {
                        console.log(`   ❌ ${unit.nombre}: Error en la redistribución - suma ${sumaFinal}%`);
                    }
                } else {
                    console.log(`✅ ${unit.nombre}: ${sumaActual}% (correcto)`);
                }
            }
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
    console.log(`✅ Total de unidades corregidas: ${unidadesCorregidas}`);
    
    if (unidadesCorregidas > 0) {
        saveJSON(filePath, data);
        console.log('✅ Archivo actualizado correctamente');
    } else {
        console.log('ℹ️  No se encontraron unidades que requieran corrección');
    }
}

// Ejecutar corrección
corregirTodosPorcentajes(); 