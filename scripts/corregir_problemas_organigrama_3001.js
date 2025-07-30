const fs = require('fs');
const path = require('path');

// Función para cargar el archivo JSON
function loadJSON(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al cargar el archivo JSON:', error);
        return null;
    }
}

// Función para guardar el archivo JSON
function saveJSON(data, filePath) {
    try {
        const jsonString = JSON.stringify(data, null, 2);
        fs.writeFileSync(filePath, jsonString, 'utf8');
        console.log(`✅ Archivo guardado exitosamente: ${filePath}`);
        return true;
    } catch (error) {
        console.error('Error al guardar el archivo JSON:', error);
        return false;
    }
}

// Función para encontrar una unidad en el árbol
function findUnit(tree, unitName) {
    for (let unit of tree) {
        if (unit.nombre === unitName) {
            return unit;
        }
        if (unit.children) {
            const found = findUnit(unit.children, unitName);
            if (found) return found;
        }
    }
    return null;
}

// Función para encontrar y remover una unidad del árbol
function findAndRemoveUnit(tree, unitName) {
    for (let i = 0; i < tree.length; i++) {
        if (tree[i].nombre === unitName) {
            const removed = tree.splice(i, 1)[0];
            return removed;
        }
        if (tree[i].children) {
            const found = findAndRemoveUnit(tree[i].children, unitName);
            if (found) return found;
        }
    }
    return null;
}

// Función para agregar una unidad a un padre específico
function addUnitToParent(tree, parentName, unit) {
    for (let item of tree) {
        if (item.nombre === parentName) {
            if (!item.children) item.children = [];
            item.children.push(unit);
            return true;
        }
        if (item.children) {
            if (addUnitToParent(item.children, parentName, unit)) {
                return true;
            }
        }
    }
    return false;
}

// Función para eliminar duplicados de funciones
function removeDuplicateFunctions(unit) {
    if (!unit.funciones) return;
    
    const seen = new Set();
    const uniqueFunctions = [];
    
    for (let func of unit.funciones) {
        const key = `${func.descripcion}|${func.productoFinal}`;
        if (!seen.has(key)) {
            seen.add(key);
            uniqueFunctions.push(func);
        }
    }
    
    unit.funciones = uniqueFunctions;
}

// Función para corregir indicadores de SGP Clientes
function correctSGPClientesIndicators(unit) {
    if (unit.nombre === "SGP Clientes") {
        const correctIndicators = [
            {
                "orden": 1,
                "tipo": "Indicador",
                "descripcion": "Clientes activos únicos (últimos 90 días)",
                "porcentajeDedicacion": "",
                "productoFinal": ""
            },
            {
                "orden": 2,
                "tipo": "Indicador",
                "descripcion": "Productos promedio por cliente (x-sell)",
                "porcentajeDedicacion": "",
                "productoFinal": ""
            },
            {
                "orden": 3,
                "tipo": "Indicador",
                "descripcion": "% de operaciones totales realizadas por canales digitales",
                "porcentajeDedicacion": "",
                "productoFinal": ""
            },
            {
                "orden": 4,
                "tipo": "Indicador",
                "descripcion": "NPS general (Net Promoter Score)",
                "porcentajeDedicacion": "",
                "productoFinal": ""
            },
            {
                "orden": 5,
                "tipo": "Indicador",
                "descripcion": "Rentabilidad promedio por cliente (RCP)",
                "porcentajeDedicacion": "",
                "productoFinal": ""
            },
            {
                "orden": 6,
                "tipo": "Indicador",
                "descripcion": "% de cumplimiento de objetivos comerciales trimestrales",
                "porcentajeDedicacion": "",
                "productoFinal": ""
            },
            {
                "orden": 7,
                "tipo": "Indicador",
                "descripcion": "% de clientes con más de un producto contratado",
                "porcentajeDedicacion": "",
                "productoFinal": ""
            },
            {
                "orden": 8,
                "tipo": "Indicador",
                "descripcion": "Tasa de adopción digital en nuevos productos o procesos",
                "porcentajeDedicacion": "",
                "productoFinal": ""
            },
            {
                "orden": 9,
                "tipo": "Indicador",
                "descripcion": "% de reclamos resueltos en primer contacto (First Call Resolution)",
                "porcentajeDedicacion": "",
                "productoFinal": ""
            },
            {
                "orden": 10,
                "tipo": "Indicador",
                "descripcion": "CPA (costo adquisición de Clientes)",
                "porcentajeDedicacion": "",
                "productoFinal": ""
            },
            {
                "orden": 11,
                "tipo": "Indicador",
                "descripcion": "CLTV (valor de vida del cliente)",
                "porcentajeDedicacion": "",
                "productoFinal": ""
            }
        ];
        
        // Filtrar solo indicadores existentes y agregar los nuevos
        const existingIndicators = unit.funciones.filter(f => f.tipo === "Indicador");
        const otherFunctions = unit.funciones.filter(f => f.tipo !== "Indicador");
        
        unit.funciones = [...otherFunctions, ...correctIndicators];
        
        // Reordenar todas las funciones
        unit.funciones.forEach((func, index) => {
            func.orden = index + 1;
        });
    }
}

// Función para completar Head De Segmentos Empresas
function completeHeadSegmentosEmpresas(unit) {
    if (unit.nombre === "Head De Segmentos Empresas (MiPymes, Grandes Empresas, Sector Público, Agro y Energía)") {
        const additionalFunctions = [
            {
                "orden": 5,
                "tipo": "Genérica",
                "descripcion": "Desarrollar propuestas de valor específicas para cada subsegmento empresarial (MiPymes, Grandes Empresas, Sector Público, Agro y Energía).",
                "productoFinal": "Propuestas de valor diferenciadas por subsegmento",
                "porcentajeDedicacion": ""
            },
            {
                "orden": 6,
                "tipo": "Genérica",
                "descripcion": "Coordinar con áreas de productos, canales y marketing para implementar estrategias específicas por subsegmento.",
                "productoFinal": "Estrategias implementadas por subsegmento",
                "porcentajeDedicacion": ""
            },
            {
                "orden": 7,
                "tipo": "Específica",
                "descripcion": "Diseñar y ejecutar programas específicos para MiPymes con foco en financiamiento, digitalización y crecimiento.",
                "productoFinal": "Programa MiPymes implementado",
                "porcentajeDedicacion": "25"
            },
            {
                "orden": 8,
                "tipo": "Específica",
                "descripcion": "Desarrollar estrategias para Grandes Empresas con productos corporativos, treasury y servicios especializados.",
                "productoFinal": "Estrategia Grandes Empresas",
                "porcentajeDedicacion": "25"
            },
            {
                "orden": 9,
                "tipo": "Específica",
                "descripcion": "Coordinar programas para Sector Público con enfoque en transparencia, cumplimiento y servicios gubernamentales.",
                "productoFinal": "Programa Sector Público",
                "porcentajeDedicacion": "25"
            },
            {
                "orden": 10,
                "tipo": "Específica",
                "descripcion": "Implementar estrategias para Agro y Energía con productos sectoriales, financiamiento estacional y servicios especializados.",
                "productoFinal": "Estrategia Agro y Energía",
                "porcentajeDedicacion": "25"
            }
        ];
        
        unit.funciones.push(...additionalFunctions);
        
        // Reordenar todas las funciones
        unit.funciones.forEach((func, index) => {
            func.orden = index + 1;
        });
    }
}

// Función para crear la unidad Comunicaciones Y Eventos
function createComunicacionesYEventos() {
    return {
        "key": "Comunicaciones Y Eventos|Segmento Personas",
        "nombre": "Comunicaciones Y Eventos",
        "reportaA": "Segmento Personas",
        "mision": "Diseñar, planificar y ejecutar campañas de comunicación y eventos institucionales para el Segmento Personas, fortaleciendo el vínculo con los públicos objetivos y promoviendo la propuesta de valor del banco.",
        "funciones": [
            {
                "orden": 1,
                "tipo": "Genérica",
                "descripcion": "Diseñar estrategias de comunicación dirigidas a los diferentes subsegmentos de personas físicas.",
                "productoFinal": "Estrategias de comunicación segmentadas",
                "porcentajeDedicacion": ""
            },
            {
                "orden": 2,
                "tipo": "Genérica",
                "descripcion": "Planificar y ejecutar eventos institucionales y comerciales para el segmento personas.",
                "productoFinal": "Eventos ejecutados exitosamente",
                "porcentajeDedicacion": ""
            },
            {
                "orden": 3,
                "tipo": "Genérica",
                "descripcion": "Coordinar con áreas de marketing, productos y canales para asegurar consistencia en los mensajes.",
                "productoFinal": "Comunicación coordinada y consistente",
                "porcentajeDedicacion": ""
            },
            {
                "orden": 4,
                "tipo": "Genérica",
                "descripcion": "Medir el impacto de las campañas y eventos para optimizar futuras acciones.",
                "productoFinal": "Reportes de impacto y efectividad",
                "porcentajeDedicacion": ""
            },
            {
                "orden": 5,
                "tipo": "Específica",
                "descripcion": "Desarrollar contenidos específicos para cada subsegmento (jóvenes, jubilados, profesionales, etc.).",
                "productoFinal": "Contenidos segmentados",
                "porcentajeDedicacion": "25"
            },
            {
                "orden": 6,
                "tipo": "Específica",
                "descripcion": "Organizar eventos de educación financiera y vinculación con clientes.",
                "productoFinal": "Eventos de educación financiera",
                "porcentajeDedicacion": "25"
            },
            {
                "orden": 7,
                "tipo": "Específica",
                "descripcion": "Coordinar campañas de lanzamiento de productos y servicios para personas.",
                "productoFinal": "Campañas de lanzamiento",
                "porcentajeDedicacion": "25"
            },
            {
                "orden": 8,
                "tipo": "Específica",
                "descripcion": "Gestionar la comunicación en crisis y situaciones especiales del segmento.",
                "productoFinal": "Comunicación de crisis gestionada",
                "porcentajeDedicacion": "25"
            },
            {
                "orden": 9,
                "tipo": "Indicador",
                "descripcion": "Alcance de las campañas de comunicación",
                "productoFinal": "",
                "porcentajeDedicacion": ""
            },
            {
                "orden": 10,
                "tipo": "Indicador",
                "descripcion": "Participación en eventos institucionales",
                "productoFinal": "",
                "porcentajeDedicacion": ""
            },
            {
                "orden": 11,
                "tipo": "Indicador",
                "descripcion": "Satisfacción del cliente con las comunicaciones",
                "productoFinal": "",
                "porcentajeDedicacion": ""
            },
            {
                "orden": 12,
                "tipo": "Indicador",
                "descripcion": "ROI de las campañas de comunicación",
                "productoFinal": "",
                "porcentajeDedicacion": ""
            }
        ],
        "jerarquia": "SG",
        "nivelReporte": 4
    };
}

// Función principal para corregir el organigrama
function correctOrganigrama(data) {
    console.log('🔧 Iniciando corrección del organigrama...');
    
    const tree = data.hierarchy.tree;
    
    // 1. Corregir indicadores de SGP Clientes
    console.log('📊 Corrigiendo indicadores de SGP Clientes...');
    correctSGPClientesIndicators(tree[0]);
    
    // 2. Mover CAC de Segmento Personas a Canales
    console.log('📞 Moviendo CAC de Segmento Personas a Canales...');
    const cacUnit = findAndRemoveUnit(tree[0].children[0].children, "CAC – Atención Telefónica");
    if (cacUnit) {
        // Cambiar el reportaA
        cacUnit.reportaA = "Canales";
        cacUnit.key = "CAC – Atención Telefónica|Canales";
        
        // Encontrar Canales y agregar CAC
        const canalesUnit = findUnit(tree, "Canales");
        if (canalesUnit) {
            if (!canalesUnit.children) canalesUnit.children = [];
            canalesUnit.children.push(cacUnit);
        }
    }
    
    // 3. Agregar Comunicaciones Y Eventos a Segmento Personas
    console.log('📢 Agregando Comunicaciones Y Eventos a Segmento Personas...');
    const comunicacionesUnit = createComunicacionesYEventos();
    addUnitToParent(tree, "Segmento Personas", comunicacionesUnit);
    
    // 4. Completar Head De Segmentos Empresas
    console.log('🏢 Completando Head De Segmentos Empresas...');
    const headSegmentosEmpresas = findUnit(tree, "Head De Segmentos Empresas (MiPymes, Grandes Empresas, Sector Público, Agro y Energía)");
    if (headSegmentosEmpresas) {
        completeHeadSegmentosEmpresas(headSegmentosEmpresas);
    }
    
    // 5. Eliminar duplicaciones en Canales
    console.log('🔄 Eliminando duplicaciones en Canales...');
    const canalesUnit = findUnit(tree, "Canales");
    if (canalesUnit) {
        removeDuplicateFunctions(canalesUnit);
    }
    
    // 6. Eliminar duplicaciones en Marketing
    console.log('📈 Eliminando duplicaciones en Marketing...');
    const marketingUnit = findUnit(tree, "Marketing");
    if (marketingUnit) {
        removeDuplicateFunctions(marketingUnit);
    }
    
    // 7. Eliminar duplicaciones en Coordinación Del Negocio Y Datos
    console.log('📋 Eliminando duplicaciones en Coordinación Del Negocio Y Datos...');
    const coordinacionUnit = findUnit(tree, "Coordinación Del Negocio Y Datos");
    if (coordinacionUnit) {
        removeDuplicateFunctions(coordinacionUnit);
    }
    
    // 8. Actualizar metadata
    data.metadata.lastUpdate = new Date().toISOString();
    data.metadata.lastModified = new Date().toISOString();
    data.metadata.notes += "\n- Corregidos problemas identificados por Alejandro Cid y Dario\n- Movida unidad CAC de Segmento Personas a Canales\n- Agregada unidad Comunicaciones Y Eventos a Segmento Personas\n- Corregidos indicadores de SGP Clientes\n- Completada unidad Head De Segmentos Empresas\n- Eliminadas duplicaciones en Canales, Marketing y Coordinación Del Negocio Y Datos";
    
    console.log('✅ Corrección del organigrama completada');
    return data;
}

// Función principal
function main() {
    const inputFile = path.join(__dirname, '..', 'organigrama_bna_2025-07-30.json');
    const outputFile = path.join(__dirname, '..', 'organigrama_bna_2025-07-30_corregido.json');
    
    console.log('📁 Cargando archivo JSON...');
    const data = loadJSON(inputFile);
    
    if (!data) {
        console.error('❌ No se pudo cargar el archivo JSON');
        return;
    }
    
    console.log('✅ Archivo JSON cargado exitosamente');
    
    // Corregir el organigrama
    const correctedData = correctOrganigrama(data);
    
    // Guardar el archivo corregido
    if (saveJSON(correctedData, outputFile)) {
        console.log('🎉 Proceso completado exitosamente');
        console.log(`📄 Archivo corregido guardado como: ${outputFile}`);
    } else {
        console.error('❌ Error al guardar el archivo corregido');
    }
}

// Ejecutar el script
if (require.main === module) {
    main();
}

module.exports = {
    correctOrganigrama,
    loadJSON,
    saveJSON
}; 