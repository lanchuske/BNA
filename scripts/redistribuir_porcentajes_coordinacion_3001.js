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

// Función para redistribuir porcentajes
function redistribuirPorcentajes() {
    console.log('=== REDISTRIBUCIÓN DE PORCENTAJES EN COORDINACIÓN DEL NEGOCIO Y DATOS ===\n');
    
    const filePath = 'organigrama_bna_2025-07-30_marketing_limpio.json';
    const data = loadJSON(filePath);
    
    if (!data) {
        console.error('No se pudo cargar el archivo JSON');
        return;
    }
    
    // Función recursiva para encontrar la unidad
    function findAndUpdateUnit(units) {
        for (const unit of units) {
            if (unit.nombre === "Coordinación Del Negocio Y Datos") {
                console.log(`✅ Encontrada unidad: ${unit.nombre}`);
                
                // Contar funciones específicas
                const funcionesEspecificas = unit.funciones.filter(f => f.tipo === "Específica");
                console.log(`📊 Total de funciones específicas: ${funcionesEspecificas.length}`);
                
                // Calcular suma actual
                const sumaActual = funcionesEspecificas.reduce((sum, f) => sum + parseInt(f.porcentajeDedicacion), 0);
                console.log(`📊 Suma actual: ${sumaActual}%`);
                
                // Redistribuir porcentajes
                const totalFunciones = funcionesEspecificas.length;
                const porcentajeBase = Math.floor(100 / totalFunciones);
                const resto = 100 % totalFunciones;
                
                console.log(`📊 Porcentaje base por función: ${porcentajeBase}%`);
                console.log(`📊 Resto a distribuir: ${resto}%`);
                
                let contador = 0;
                for (const funcion of unit.funciones) {
                    if (funcion.tipo === "Específica") {
                        let nuevoPorcentaje = porcentajeBase;
                        if (contador < resto) {
                            nuevoPorcentaje += 1;
                        }
                        
                        const porcentajeAnterior = funcion.porcentajeDedicacion;
                        funcion.porcentajeDedicacion = nuevoPorcentaje.toString();
                        
                        console.log(`✅ Función orden ${funcion.orden}: ${porcentajeAnterior}% → ${nuevoPorcentaje}%`);
                        contador++;
                    }
                }
                
                // Verificar suma final
                const sumaFinal = funcionesEspecificas.reduce((sum, f) => sum + parseInt(f.porcentajeDedicacion), 0);
                console.log(`📊 Suma final: ${sumaFinal}%`);
                
                if (sumaFinal === 100) {
                    console.log('✅ Redistribución exitosa - suma exactamente 100%');
                } else {
                    console.log('❌ Error en la redistribución');
                }
                
                return true;
            }
            
            if (unit.children && Array.isArray(unit.children)) {
                if (findAndUpdateUnit(unit.children)) {
                    return true;
                }
            }
        }
        return false;
    }
    
    // Procesar todas las unidades
    if (data.hierarchy && data.hierarchy.tree) {
        const encontrado = findAndUpdateUnit(data.hierarchy.tree);
        
        if (encontrado) {
            saveJSON(filePath, data);
            console.log('\n✅ Archivo actualizado correctamente');
        } else {
            console.log('❌ No se encontró la unidad Coordinación Del Negocio Y Datos');
        }
    }
}

// Ejecutar redistribución
redistribuirPorcentajes(); 