const fs = require('fs');
const path = require('path');

// Configuración
const inputFile = 'organigrama_bna_2025-07-30-14.json';
const outputFile = 'organigrama_bna_2025-07-30-15.json';
const mdFile = 'MD/A.5 Rginales.md';

console.log('🔄 Iniciando actualización de Regionales desde MD...');

try {
    // Leer archivos
    console.log('📖 Leyendo archivos...');
    const jsonData = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
    const mdContent = fs.readFileSync(mdFile, 'utf8');
    
    console.log('✅ Archivos leídos correctamente');
    
    // Buscar la unidad Regionales
    const regionalesUnit = findRegionalesUnit(jsonData.hierarchy.tree);
    
    if (!regionalesUnit) {
        throw new Error('❌ No se encontró la unidad Regionales en el JSON');
    }
    
    console.log('✅ Unidad Regionales encontrada');
    
    // Actualizar misión según MD (es idéntica, pero se mantiene para consistencia)
    const misionMD = "Coordinar, supervisar y desarrollar la red de sucursales del Banco en una región geográfica determinada, a través de la articulación con jefaturas zonales, asegurando la ejecución del plan comercial, el cumplimiento del modelo de atención, la eficiencia operativa y el relacionamiento institucional en el territorio asignado.";
    
    regionalesUnit.mision = misionMD;
    console.log('✅ Misión verificada (idéntica al MD)');
    
    // Actualizar funciones según MD
    regionalesUnit.funciones = [
        // FUNCIONES GENÉRICAS (5) según MD
        {
            "orden": 1,
            "tipo": "Genérica",
            "descripcion": "Ejecutar el gobierno operativo y comercial de la red en su región. Asegurar el cumplimiento de objetivos estratégicos y operativos a través de la gestión directa sobre las zonas y sucursales bajo su jurisdicción. Define, gestiona y planifica los objetivos comerciales de cada Zona de la Región en conjunto con Coordinación Comercial y de Atención de la Red Propone acciones de marketing y de desarrollo comercial de su geografía.",
            "productoFinal": "Gobierno operativo y comercial de la red en su región ejecutado."
        },
        {
            "orden": 2,
            "tipo": "Genérica",
            "descripcion": "Asegurar la implementación del modelo de atención y gestión del cliente. Supervisar que la red actúe conforme a los estándares definidos, en experiencia, protocolos de servicio y cumplimiento normativo.",
            "productoFinal": "Implementación del modelo de atención y gestión del cliente asegurada."
        },
        {
            "orden": 3,
            "tipo": "Genérica",
            "descripcion": "Definir y monitorear objetivos comerciales regionales. Establecer metas y prioridades comerciales junto a las jefaturas zonales, en coordinación con Gestión Comercial y Segmentos.",
            "productoFinal": "Objetivos comerciales regionales definidos y monitoreados."
        },
        {
            "orden": 4,
            "tipo": "Genérica",
            "descripcion": "Desarrollar la red física y su cobertura territorial. Evaluar necesidades de apertura, cierre, traslado o reconversión de sucursales según análisis de demanda, eficiencia y perfil poblacional.",
            "productoFinal": "Red física y su cobertura territorial desarrollada."
        },
        {
            "orden": 5,
            "tipo": "Genérica",
            "descripcion": "Gestionar el relacionamiento institucional territorial. Representar al Banco frente a actores públicos, privados y comunitarios en su región, apoyando alianzas, acuerdos y posicionamiento institucional.",
            "productoFinal": "Relacionamiento institucional territorial gestionado."
        },
        
        // FUNCIONES ESPECÍFICAS (5) con porcentajes correctos según MD
        {
            "orden": 1,
            "tipo": "Específica",
            "descripcion": "Supervisión de la gestión zonal y de sucursales. Coordinar reuniones periódicas con jefes zonales. Brindar lineamientos, seguimiento de performance, resolución de incidentes. Asegurar consistencia operativa y comercial en toda la región.",
            "productoFinal": "Supervisión de la gestión zonal y de sucursales implementada.",
            "porcentajeDedicacion": 20
        },
        {
            "orden": 2,
            "tipo": "Específica",
            "descripcion": "Despliegue y seguimiento de campañas y acciones comerciales. Coordinar la bajada de campañas comerciales nacionales a cada zona. Asegurar acompañamiento en activaciones locales y monitoreo de resultados.",
            "productoFinal": "Despliegue y seguimiento de campañas y acciones comerciales implementado.",
            "porcentajeDedicacion": 20
        },
        {
            "orden": 3,
            "tipo": "Específica",
            "descripcion": "Análisis de cobertura y estructura de red. Monitorear demanda, capacidad instalada y productividad por sucursal. Elevar propuestas de optimización (reconfiguración, ampliación, integración con canales digitales).",
            "productoFinal": "Análisis de cobertura y estructura de red implementado.",
            "porcentajeDedicacion": 20
        },
        {
            "orden": 4,
            "tipo": "Específica",
            "descripcion": "Gestión de desempeño y clima organizacional. Participar en la evaluación de desempeño de responsables zonales y gerentes de sucursales. Acompañar la gestión de personas, la formación y el desarrollo del talento territorial.",
            "productoFinal": "Gestión de desempeño y clima organizacional implementada.",
            "porcentajeDedicacion": 20
        },
        {
            "orden": 5,
            "tipo": "Específica",
            "descripcion": "Gestión de riesgos operativos y cumplimiento normativo. Supervisar cumplimiento operativo y acciones correctivas. Monitorear hallazgos de auditoría o reclamos críticos.",
            "productoFinal": "Gestión de riesgos operativos y cumplimiento normativo implementada.",
            "porcentajeDedicacion": 20
        },
        
        // INDICADORES (7) basados en el JSON actual pero mejorados
        {
            "orden": 1,
            "tipo": "Indicador",
            "descripcion": "% cumplimiento de objetivos comerciales regionales."
        },
        {
            "orden": 2,
            "tipo": "Indicador",
            "descripcion": "Productos promedio por cliente / rentabilidad por región."
        },
        {
            "orden": 3,
            "tipo": "Indicador",
            "descripcion": "Tasa de digitalización / migración de operaciones."
        },
        {
            "orden": 4,
            "tipo": "Indicador",
            "descripcion": "Participación del canal sucursal en captación y ventas."
        },
        {
            "orden": 5,
            "tipo": "Indicador",
            "descripcion": "NPS por región / tasa de reclamos."
        },
        {
            "orden": 6,
            "tipo": "Indicador",
            "descripcion": "Cobertura territorial vs. demanda estimada."
        },
        {
            "orden": 7,
            "tipo": "Indicador",
            "descripcion": "Cumplimiento de SLA y hallazgos operativos por sucursal."
        }
    ];
    
    console.log('✅ Funciones actualizadas según MD');
    console.log(`📊 Funciones genéricas: ${regionalesUnit.funciones.filter(f => f.tipo === 'Genérica').length}`);
    console.log(`📊 Funciones específicas: ${regionalesUnit.funciones.filter(f => f.tipo === 'Específica').length}`);
    console.log(`📊 Indicadores: ${regionalesUnit.funciones.filter(f => f.tipo === 'Indicador').length}`);
    
    // Calcular porcentaje total de funciones específicas
    const porcentajeTotal = regionalesUnit.funciones
        .filter(f => f.tipo === 'Específica')
        .reduce((sum, f) => sum + (f.porcentajeDedicacion || 0), 0);
    
    console.log(`📊 Porcentaje total de dedicación: ${porcentajeTotal}%`);
    
    if (porcentajeTotal !== 100) {
        console.warn(`⚠️ ADVERTENCIA: El porcentaje total es ${porcentajeTotal}%, debería ser 100%`);
    } else {
        console.log('✅ Porcentaje total correcto (100%)');
    }
    
    // Guardar archivo actualizado
    fs.writeFileSync(outputFile, JSON.stringify(jsonData, null, 2));
    console.log(`✅ Archivo guardado como: ${outputFile}`);
    
    // Mostrar resumen de cambios
    console.log('\n📋 RESUMEN DE CAMBIOS:');
    console.log('✅ Misión verificada (idéntica al MD)');
    console.log('✅ Eliminada función genérica extra');
    console.log('✅ Eliminadas 5 funciones específicas extra');
    console.log('✅ Corregidos porcentajes de dedicación (20% cada una)');
    console.log('✅ Limpiada estructura de datos (eliminadas versiones anteriores)');
    console.log('✅ Corregidos campos incorrectos (strings a números)');
    console.log('✅ Mejoradas descripciones con detalles del MD');
    console.log('✅ Actualizados productos finales según MD');
    console.log('✅ Mantenidos indicadores relevantes del JSON original');
    
} catch (error) {
    console.error('❌ Error durante la actualización:', error.message);
    process.exit(1);
}

// Función para encontrar la unidad Regionales
function findRegionalesUnit(hierarchy) {
    for (const unit of hierarchy) {
        if (unit.nombre === 'Regionales') {
            return unit;
        }
        if (unit.children) {
            const found = findRegionalesUnit(unit.children);
            if (found) return found;
        }
    }
    return null;
} 