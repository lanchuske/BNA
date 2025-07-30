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

// Función para calcular similitud semántica
function calcularSimilitud(texto1, texto2) {
    const palabras1 = texto1.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
    const palabras2 = texto2.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
    
    const set1 = new Set(palabras1);
    const set2 = new Set(palabras2);
    
    const interseccion = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return interseccion.size / union.size;
}

// Función para corregir errores pendientes
function corregirErroresPendientes() {
    console.log('=== CORRECCIÓN DE ERRORES PENDIENTES ===\n');
    
    const filePath = 'organigrama_bna_2025-07-30_marketing_limpio copy.json';
    const data = loadJSON(filePath);
    
    if (!data) {
        console.error('No se pudo cargar el archivo JSON');
        return;
    }
    
    let estadisticas = {
        porcentajesCorregidos: 0,
        tiposCorregidos: 0,
        funcionesGenericasCorregidas: 0,
        indicadoresCorregidos: 0,
        ordenesCorregidos: 0,
        duplicacionesEliminadas: 0,
        misionesAgregadas: 0
    };
    
    // Función recursiva para procesar todas las unidades
    function processUnit(unit) {
        let unidadCorregida = false;
        
        // 1. Corregir misión ausente o vacía
        if (!unit.mision || unit.mision.trim() === '') {
            console.log(`🔧 Agregando misión a unidad "${unit.nombre}"`);
            unit.mision = "Misión pendiente de definir";
            estadisticas.misionesAgregadas++;
            unidadCorregida = true;
        }
        
        // 2. Procesar funciones
        if (unit.funciones && Array.isArray(unit.funciones)) {
            const funcionesGenericas = unit.funciones.filter(f => f.tipo === "Genérica");
            const funcionesEspecificas = unit.funciones.filter(f => f.tipo === "Específica");
            const indicadores = unit.funciones.filter(f => f.tipo === "Indicador");
            
            // Corregir funciones genéricas con campos indebidos
            funcionesGenericas.forEach(funcion => {
                if (funcion.porcentajeDedicacion !== undefined && funcion.porcentajeDedicacion !== "") {
                    console.log(`🔧 Eliminando porcentajeDedicacion de función genérica en "${unit.nombre}"`);
                    delete funcion.porcentajeDedicacion;
                    estadisticas.funcionesGenericasCorregidas++;
                    unidadCorregida = true;
                }
                
                if (!funcion.productoFinal || funcion.productoFinal.trim() === "") {
                    console.log(`🔧 Agregando productoFinal a función genérica en "${unit.nombre}"`);
                    funcion.productoFinal = "Producto específico del área";
                    estadisticas.funcionesGenericasCorregidas++;
                    unidadCorregida = true;
                }
            });
            
            // Corregir indicadores con campos indebidos
            indicadores.forEach(funcion => {
                if (funcion.porcentajeDedicacion !== undefined) {
                    console.log(`🔧 Eliminando porcentajeDedicacion de indicador en "${unit.nombre}"`);
                    delete funcion.porcentajeDedicacion;
                    estadisticas.indicadoresCorregidos++;
                    unidadCorregida = true;
                }
                
                if (funcion.productoFinal !== undefined) {
                    console.log(`🔧 Eliminando productoFinal de indicador en "${unit.nombre}"`);
                    delete funcion.productoFinal;
                    estadisticas.indicadoresCorregidos++;
                    unidadCorregida = true;
                }
            });
            
            // Corregir funciones específicas
            if (funcionesEspecificas.length > 0) {
                // Corregir tipos de datos incorrectos
                funcionesEspecificas.forEach(funcion => {
                    if (funcion.porcentajeDedicacion && funcion.porcentajeDedicacion.includes('.')) {
                        console.log(`🔧 Corrigiendo tipo de dato en "${unit.nombre}": "${funcion.porcentajeDedicacion}" → "${parseInt(funcion.porcentajeDedicacion)}"`);
                        funcion.porcentajeDedicacion = parseInt(funcion.porcentajeDedicacion).toString();
                        estadisticas.tiposCorregidos++;
                        unidadCorregida = true;
                    }
                });
                
                // Verificar duplicaciones semánticas
                const duplicaciones = [];
                for (let i = 0; i < funcionesEspecificas.length; i++) {
                    for (let j = i + 1; j < funcionesEspecificas.length; j++) {
                        const similitud = calcularSimilitud(
                            funcionesEspecificas[i].descripcion, 
                            funcionesEspecificas[j].descripcion
                        );
                        
                        if (similitud > 0.7) {
                            duplicaciones.push({
                                index1: i,
                                index2: j,
                                similitud: similitud,
                                funcion1: funcionesEspecificas[i],
                                funcion2: funcionesEspecificas[j]
                            });
                        }
                    }
                }
                
                // Eliminar duplicaciones
                duplicaciones.forEach(dup => {
                    console.log(`🔧 Eliminando duplicación semántica en "${unit.nombre}" (similitud: ${(dup.similitud * 100).toFixed(1)}%)`);
                    console.log(`   - "${dup.funcion1.descripcion.substring(0, 50)}..."`);
                    console.log(`   - "${dup.funcion2.descripcion.substring(0, 50)}..."`);
                    
                    // Mantener la función con mejor descripción
                    const funcionAMantener = dup.funcion1.descripcion.length > dup.funcion2.descripcion.length ? dup.funcion1 : dup.funcion2;
                    const funcionAEliminar = dup.funcion1.descripcion.length > dup.funcion2.descripcion.length ? dup.funcion2 : dup.funcion1;
                    
                    // Redistribuir porcentaje
                    const porcentajeAEliminar = parseInt(funcionAEliminar.porcentajeDedicacion) || 0;
                    funcionAMantener.porcentajeDedicacion = (parseInt(funcionAMantener.porcentajeDedicacion) + porcentajeAEliminar).toString();
                    
                    // Eliminar función duplicada
                    const indexToRemove = unit.funciones.indexOf(funcionAEliminar);
                    if (indexToRemove > -1) {
                        unit.funciones.splice(indexToRemove, 1);
                    }
                    
                    estadisticas.duplicacionesEliminadas++;
                    unidadCorregida = true;
                });
                
                // Recalcular porcentajes después de eliminar duplicaciones
                const nuevasFuncionesEspecificas = unit.funciones.filter(f => f.tipo === "Específica");
                if (nuevasFuncionesEspecificas.length > 0) {
                    const sumaActual = nuevasFuncionesEspecificas.reduce((sum, f) => {
                        return sum + (parseInt(f.porcentajeDedicacion) || 0);
                    }, 0);
                    
                    if (sumaActual !== 100) {
                        console.log(`🔧 Redistribuyendo porcentajes en "${unit.nombre}": ${sumaActual}% → 100%`);
                        
                        const totalFunciones = nuevasFuncionesEspecificas.length;
                        const porcentajeBase = Math.floor(100 / totalFunciones);
                        const resto = 100 % totalFunciones;
                        
                        let contador = 0;
                        nuevasFuncionesEspecificas.forEach(funcion => {
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
            
            // Reordenar funciones por tipo y corregir orden
            const funcionesReordenadas = [
                ...unit.funciones.filter(f => f.tipo === "Genérica"),
                ...unit.funciones.filter(f => f.tipo === "Específica"),
                ...unit.funciones.filter(f => f.tipo === "Indicador")
            ];
            
            // Renumerar orden secuencial
            let ordenActual = 1;
            funcionesReordenadas.forEach(funcion => {
                if (funcion.orden !== ordenActual) {
                    console.log(`🔧 Corrigiendo orden en "${unit.nombre}": ${funcion.orden} → ${ordenActual}`);
                    estadisticas.ordenesCorregidos++;
                    unidadCorregida = true;
                }
                funcion.orden = ordenActual++;
            });
            
            unit.funciones = funcionesReordenadas;
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
    
    // Agregar o actualizar resumen de correcciones
    data.resumenCorrecciones = {
        fecha: new Date().toISOString(),
        porcentajesCorregidos: estadisticas.porcentajesCorregidos,
        tiposCorregidos: estadisticas.tiposCorregidos,
        funcionesGenericasCorregidas: estadisticas.funcionesGenericasCorregidas,
        indicadoresCorregidos: estadisticas.indicadoresCorregidos,
        ordenesCorregidos: estadisticas.ordenesCorregidos,
        duplicacionesEliminadas: estadisticas.duplicacionesEliminadas,
        misionesAgregadas: estadisticas.misionesAgregadas,
        descripcion: "Corrección de errores pendientes: porcentajes, tipos de datos, campos indebidos, duplicaciones y orden"
    };
    
    console.log('\n=== RESUMEN DE CORRECCIONES ===');
    console.log(`✅ Porcentajes corregidos: ${estadisticas.porcentajesCorregidos}`);
    console.log(`✅ Tipos de datos corregidos: ${estadisticas.tiposCorregidos}`);
    console.log(`✅ Funciones genéricas corregidas: ${estadisticas.funcionesGenericasCorregidas}`);
    console.log(`✅ Indicadores corregidos: ${estadisticas.indicadoresCorregidos}`);
    console.log(`✅ Órdenes corregidos: ${estadisticas.ordenesCorregidos}`);
    console.log(`✅ Duplicaciones eliminadas: ${estadisticas.duplicacionesEliminadas}`);
    console.log(`✅ Misiones agregadas: ${estadisticas.misionesAgregadas}`);
    
    saveJSON(filePath, data);
    console.log('\n✅ Archivo corregido y guardado correctamente');
}

// Ejecutar corrección
corregirErroresPendientes(); 