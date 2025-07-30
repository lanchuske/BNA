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

// Función para actualizar Head De Segmentos Empresas con información detallada
function updateHeadSegmentosEmpresas(data) {
    console.log('🔧 Actualizando Head De Segmentos Empresas con información detallada...');
    
    const tree = data.hierarchy.tree;
    
    // Buscar la unidad Head De Segmentos Empresas (MiPymes, Grandes Empresas, Sector Público, Agro y Energía)
    const headUnit = findUnit(tree, "Head De Segmentos Empresas (MiPymes, Grandes Empresas, Sector Público, Agro y Energía)");
    
    if (!headUnit) {
        console.log('❌ No se encontró la unidad Head De Segmentos Empresas');
        return false;
    }
    
    // Actualizar con la información detallada del archivo de Alejandro
    headUnit.mision = "Liderar la estrategia y gestión del subsegmento [NOMBRE], desarrollando su propuesta de valor, impulsando la captación, profundización y retención de clientes, y articulando con productos, canales, marketing y fuerza comercial para posicionar al Banco como socio estratégico del sector.";
    
    // Actualizar funciones con la información detallada
    headUnit.funciones = [
        {
            "orden": 1,
            "tipo": "Genérica",
            "descripcion": "Definir objetivos, prioridades, planes y foco comercial del Banco para el subgrupo de empresas, en función de su tamaño, sector, perfil de uso y potencial de desarrollo.",
            "productoFinal": "Diseñar la estrategia integral para el subsegmento asignado",
            "porcentajeDedicacion": ""
        },
        {
            "orden": 2,
            "tipo": "Genérica",
            "descripcion": "Participar en el diseño e implementación de campañas, jornadas, promociones y actividades comerciales específicas, en articulación con Marketing, Canales y la red.",
            "productoFinal": "Coordinar campañas, programas y acciones dirigidas al segmento",
            "porcentajeDedicacion": ""
        },
        {
            "orden": 3,
            "tipo": "Genérica",
            "descripcion": "Analizar periódicamente indicadores del subgrupo, detectar oportunidades de mejora y proponer ajustes a la estrategia.",
            "productoFinal": "Monitorear performance, comportamiento y evolución de la cartera",
            "porcentajeDedicacion": ""
        },
        {
            "orden": 4,
            "tipo": "Genérica",
            "descripcion": "Representar las necesidades del segmento en comités, iniciativas de producto o decisiones institucionales. Canalizar feedback del cliente hacia adentro.",
            "productoFinal": "Actuar como referente institucional y experto interno en el subsegmento",
            "porcentajeDedicacion": ""
        },
        {
            "orden": 5,
            "tipo": "Genérica",
            "descripcion": "Proponer productos, condiciones, bundles, beneficios y esquemas de atención ajustados a las características del subsegmento.",
            "productoFinal": "Desarrollar y evolucionar la propuesta de valor del segmento",
            "porcentajeDedicacion": ""
        },
        {
            "orden": 6,
            "tipo": "Específica",
            "descripcion": "Establecer criterios de inclusión y monitorear su correcta aplicación (por facturación, actividad, riesgo, localización, forma jurídica, etc.). Construir y actualizar arquetipos de clientes del subgrupo.",
            "productoFinal": "Definición del perfil estratégico del subsegmento",
            "porcentajeDedicacion": "20"
        },
        {
            "orden": 7,
            "tipo": "Específica",
            "descripcion": "Coordinar paquetes integrados de productos financieros y no financieros (cuenta, financiación, cobranzas, seguros, adquirencia, comercio exterior). Ajustar condiciones y beneficios según perfil (ej: Agro = campaña estacional, Sector Público = convenio marco).",
            "productoFinal": "Diseño de paquetes de productos y servicios y soluciones adaptadas",
            "porcentajeDedicacion": "20"
        },
        {
            "orden": 8,
            "tipo": "Específica",
            "descripcion": "Proponer y ejecutar planes de inclusión financiera empresarial, sostenibilidad, exportación o transformación digital según sector. Participar en planes federales, sectoriales o regionales relevantes.",
            "productoFinal": "Liderazgo de programas o acciones diferenciales",
            "porcentajeDedicacion": "20"
        },
        {
            "orden": 9,
            "tipo": "Específica",
            "descripcion": "Articular con oficiales de empresas, gerencias zonales y canales remotos para asegurar foco y alineación táctica. Brindar soporte y acompañamiento en oportunidades estratégicas.",
            "productoFinal": "Interacción con la red comercial y áreas clave",
            "porcentajeDedicacion": "20"
        },
        {
            "orden": 10,
            "tipo": "Específica",
            "descripcion": "Analizar evolución de captación, profundidad, CLV, rentabilidad, riesgos y churn. Proponer ajustes al modelo de atención, a los productos o a las condiciones del subgrupo.",
            "productoFinal": "Evaluación de la performance y propuesta de mejoras",
            "porcentajeDedicacion": "20"
        },
        {
            "orden": 11,
            "tipo": "Indicador",
            "descripcion": "Porcentaje de cumplimiento de objetivos comerciales por subsegmento empresarial",
            "productoFinal": "",
            "porcentajeDedicacion": ""
        },
        {
            "orden": 12,
            "tipo": "Indicador",
            "descripcion": "Tasa de crecimiento de ventas por subsegmento empresarial",
            "productoFinal": "",
            "porcentajeDedicacion": ""
        },
        {
            "orden": 13,
            "tipo": "Indicador",
            "descripcion": "Número de acciones comerciales coordinadas exitosamente",
            "productoFinal": "",
            "porcentajeDedicacion": ""
        },
        {
            "orden": 14,
            "tipo": "Indicador",
            "descripcion": "Tiempo promedio de respuesta a desvíos comerciales",
            "productoFinal": "",
            "porcentajeDedicacion": ""
        },
        {
            "orden": 15,
            "tipo": "Indicador",
            "descripcion": "Satisfacción del cliente empresarial por subsegmento",
            "productoFinal": "",
            "porcentajeDedicacion": ""
        },
        {
            "orden": 16,
            "tipo": "Indicador",
            "descripcion": "ROI de las acciones comerciales por subsegmento",
            "productoFinal": "",
            "porcentajeDedicacion": ""
        },
        {
            "orden": 17,
            "tipo": "Indicador",
            "descripcion": "Número de tácticas correctivas implementadas",
            "productoFinal": "",
            "porcentajeDedicacion": ""
        },
        {
            "orden": 18,
            "tipo": "Indicador",
            "descripcion": "Porcentaje de alineación táctica entre subsegmentos empresariales",
            "productoFinal": "",
            "porcentajeDedicacion": ""
        }
    ];
    
    console.log(`✅ Head De Segmentos Empresas actualizada con ${headUnit.funciones.length} funciones`);
    console.log(`   - Funciones genéricas: ${headUnit.funciones.filter(f => f.tipo === "Genérica").length}`);
    console.log(`   - Funciones específicas: ${headUnit.funciones.filter(f => f.tipo === "Específica").length}`);
    console.log(`   - Indicadores: ${headUnit.funciones.filter(f => f.tipo === "Indicador").length}`);
    
    return true;
}

// Función principal para actualizar el organigrama
function updateOrganigrama(data) {
    console.log('🔧 Iniciando actualización del organigrama...');
    
    // Actualizar Head De Segmentos Empresas
    const success = updateHeadSegmentosEmpresas(data);
    
    if (success) {
        // Actualizar metadata
        data.metadata.lastUpdate = new Date().toISOString();
        data.metadata.lastModified = new Date().toISOString();
        data.metadata.notes += "\n- Actualizada unidad Head De Segmentos Empresas con información detallada del archivo de Alejandro\n- Agregadas 18 funciones completas (5 genéricas, 5 específicas, 8 indicadores)\n- Incluidos porcentajes de dedicación correctos (20% cada función específica)\n- Incorporada misión actualizada";
        
        console.log('✅ Actualización del organigrama completada');
        return data;
    } else {
        console.log('❌ Error en la actualización del organigrama');
        return null;
    }
}

// Función principal
function main() {
    const inputFile = path.join(__dirname, '..', 'organigrama_bna_2025-07-30_corregido.json');
    const outputFile = path.join(__dirname, '..', 'organigrama_bna_2025-07-30_final.json');
    
    console.log('📁 Cargando archivo JSON corregido...');
    const data = loadJSON(inputFile);
    
    if (!data) {
        console.error('❌ No se pudo cargar el archivo JSON');
        return;
    }
    
    console.log('✅ Archivo JSON cargado exitosamente');
    
    // Actualizar el organigrama
    const updatedData = updateOrganigrama(data);
    
    if (updatedData) {
        // Guardar el archivo actualizado
        if (saveJSON(updatedData, outputFile)) {
            console.log('🎉 Proceso completado exitosamente');
            console.log(`📄 Archivo final guardado como: ${outputFile}`);
        } else {
            console.error('❌ Error al guardar el archivo actualizado');
        }
    } else {
        console.error('❌ Error en la actualización del organigrama');
    }
}

// Ejecutar el script
if (require.main === module) {
    main();
}

module.exports = {
    updateOrganigrama,
    loadJSON,
    saveJSON
}; 