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

// Función para corregir estructura completa
function corregirEstructuraCompleta() {
    console.log('=== CORRECCIÓN ESTRUCTURAL Y SEMÁNTICA COMPLETA ===\n');
    
    const filePath = 'organigrama_bna_2025-07-30_marketing_limpio copy.json';
    const data = loadJSON(filePath);
    
    if (!data) {
        console.error('No se pudo cargar el archivo JSON');
        return;
    }
    
    let estadisticas = {
        unidadesCorregidas: 0,
        funcionesGenericasCorregidas: 0,
        funcionesEspecificasCorregidas: 0,
        indicadoresCorregidos: 0,
        duplicacionesEliminadas: 0,
        porcentajesRedistribuidos: 0,
        camposEliminados: 0
    };
    
    // Función recursiva para procesar todas las unidades
    function processUnit(unit) {
        let unidadCorregida = false;
        
        // 1. Validación estructural de la unidad
        if (!unit.mision || unit.mision.trim() === '') {
            console.log(`⚠️  Unidad "${unit.nombre}" sin misión`);
            unit.mision = "Misión pendiente de definir";
            unidadCorregida = true;
        }
        
        if (!unit.jerarquia) {
            console.log(`⚠️  Unidad "${unit.nombre}" sin jerarquía`);
            unit.jerarquia = "SG";
            unidadCorregida = true;
        }
        
        if (!unit.nivelReporte) {
            console.log(`⚠️  Unidad "${unit.nombre}" sin nivelReporte`);
            unit.nivelReporte = 4;
            unidadCorregida = true;
        }
        
        // 2. Procesar funciones
        if (unit.funciones && Array.isArray(unit.funciones)) {
            const funcionesGenericas = unit.funciones.filter(f => f.tipo === "Genérica");
            const funcionesEspecificas = unit.funciones.filter(f => f.tipo === "Específica");
            const indicadores = unit.funciones.filter(f => f.tipo === "Indicador");
            
            // Verificar que tenga al menos una función de cada tipo
            if (funcionesGenericas.length === 0) {
                console.log(`⚠️  Unidad "${unit.nombre}" sin funciones genéricas`);
            }
            if (funcionesEspecificas.length === 0) {
                console.log(`⚠️  Unidad "${unit.nombre}" sin funciones específicas`);
            }
            if (indicadores.length === 0) {
                console.log(`⚠️  Unidad "${unit.nombre}" sin indicadores`);
            }
            
            // Corregir funciones genéricas
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
            
            // Corregir indicadores
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
                    
                    // Mantener la función con mejor descripción y producto final
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
                        
                        estadisticas.porcentajesRedistribuidos++;
                        unidadCorregida = true;
                    }
                }
            }
            
            // Reordenar funciones por tipo
            const funcionesReordenadas = [
                ...unit.funciones.filter(f => f.tipo === "Genérica"),
                ...unit.funciones.filter(f => f.tipo === "Específica"),
                ...unit.funciones.filter(f => f.tipo === "Indicador")
            ];
            
            // Renumerar orden
            let ordenActual = 1;
            funcionesReordenadas.forEach(funcion => {
                funcion.orden = ordenActual++;
            });
            
            unit.funciones = funcionesReordenadas;
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
    
    // Agregar resumen de correcciones
    data.resumenCorrecciones = {
        fecha: new Date().toISOString(),
        unidadesCorregidas: estadisticas.unidadesCorregidas,
        funcionesGenericasCorregidas: estadisticas.funcionesGenericasCorregidas,
        funcionesEspecificasCorregidas: estadisticas.funcionesEspecificasCorregidas,
        indicadoresCorregidos: estadisticas.indicadoresCorregidos,
        duplicacionesEliminadas: estadisticas.duplicacionesEliminadas,
        porcentajesRedistribuidos: estadisticas.porcentajesRedistribuidos,
        camposEliminados: estadisticas.camposEliminados,
        descripcion: "Correcciones estructurales y semánticas aplicadas según especificaciones"
    };
    
    console.log('\n=== RESUMEN DE CORRECCIONES ===');
    console.log(`✅ Unidades corregidas: ${estadisticas.unidadesCorregidas}`);
    console.log(`✅ Funciones genéricas corregidas: ${estadisticas.funcionesGenericasCorregidas}`);
    console.log(`✅ Funciones específicas corregidas: ${estadisticas.funcionesEspecificasCorregidas}`);
    console.log(`✅ Indicadores corregidos: ${estadisticas.indicadoresCorregidos}`);
    console.log(`✅ Duplicaciones eliminadas: ${estadisticas.duplicacionesEliminadas}`);
    console.log(`✅ Porcentajes redistribuidos: ${estadisticas.porcentajesRedistribuidos}`);
    console.log(`✅ Campos eliminados: ${estadisticas.camposEliminados}`);
    
    saveJSON(filePath, data);
    console.log('\n✅ Archivo corregido y guardado correctamente');
}

// Ejecutar corrección
corregirEstructuraCompleta(); 