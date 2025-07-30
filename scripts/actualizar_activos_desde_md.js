const fs = require('fs');
const path = require('path');

// Configuración
const inputFile = 'organigrama_bna_2025-07-30-15.json';
const outputFile = 'organigrama_bna_2025-07-30-16.json';
const mdFile = 'MD/B.1 Activos.md';

console.log('🔄 Iniciando actualización de Activos desde MD...');

try {
    // Leer archivos
    console.log('📖 Leyendo archivos...');
    const jsonData = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
    const mdContent = fs.readFileSync(mdFile, 'utf8');
    
    console.log('✅ Archivos leídos correctamente');
    
    // Buscar la unidad Activos
    const activosUnit = findActivosUnit(jsonData.hierarchy.tree);
    
    if (!activosUnit) {
        throw new Error('❌ No se encontró la unidad Activos en el JSON');
    }
    
    console.log('✅ Unidad Activos encontrada');
    
    // Actualizar misión según MD (completar la parte faltante)
    const misionMD = "Diseñar, desarrollar, gestionar y evolucionar el portafolio de productos crediticios del Banco, asegurando su alineación con las necesidades de los distintos segmentos de clientes, la sostenibilidad financiera, el cumplimiento normativo y la eficiencia operativa. Promover productos activos accesibles, competitivos, digitalizados y con impacto productivo y social.";
    
    activosUnit.mision = misionMD;
    console.log('✅ Misión completada según MD');
    
    // Actualizar funciones según MD
    activosUnit.funciones = [
        // FUNCIONES GENÉRICAS (5) según MD
        {
            "orden": 1,
            "tipo": "Genérica",
            "descripcion": "Diseñar y actualizar productos crediticios del Banco. Crear y gestionar líneas de préstamos personales, hipotecarios, prendarios, consumo, productivos, con garantía o sin ella, adaptadas a los distintos perfiles de clientes (personas y empresas).",
            "productoFinal": "Portafolio de productos crediticios actualizado."
        },
        {
            "orden": 2,
            "tipo": "Genérica",
            "descripcion": "Monitorear la rentabilidad, riesgos y desempeño del portafolio. Analizar márgenes, tasas, condiciones, plazos, riesgos crediticios y comportamiento de la cartera para tomar decisiones informadas sobre ajustes y rediseños.",
            "productoFinal": "Análisis de rentabilidad y riesgos del portafolio."
        },
        {
            "orden": 3,
            "tipo": "Genérica",
            "descripcion": "Coordinar la implementación funcional de los productos. Trabajar transversalmente con Riesgos, Tecnología, Operaciones, Comercial, Jurídico y Compliance para garantizar la correcta instrumentación y operación de los productos.",
            "productoFinal": "Implementación funcional de productos coordinada."
        },
        {
            "orden": 4,
            "tipo": "Genérica",
            "descripcion": "Impulsar la digitalización y simplificación de procesos crediticios. Promover soluciones ágiles, precalificadas, 100% digitales o con onboarding simplificado para aumentar la eficiencia y accesibilidad de las líneas activas.",
            "productoFinal": "Procesos crediticios digitalizados y simplificados."
        },
        {
            "orden": 5,
            "tipo": "Genérica",
            "descripcion": "Acompañar el desarrollo comercial y la formación técnica de la red. Brindar especificaciones funcionales, simuladores, documentación y capacitaciones a la red para asegurar una gestión homogénea, segura y efectiva de los productos activos.",
            "productoFinal": "Red capacitada en productos activos."
        },
        
        // FUNCIONES ESPECÍFICAS (5) con porcentajes correctos según MD
        {
            "orden": 1,
            "tipo": "Específica",
            "descripcion": "Diseño y gestión del portafolio de préstamos. Préstamos personales, de consumo, hipotecarios, prendarios, para profesionales, programas sociales, estudios, mejoras del hogar, etc. Créditos con afectación de haberes, con garantía, tasa fija/variable, o líneas subsidiadas.",
            "productoFinal": "Portafolio de préstamos diseñado y gestionado.",
            "porcentajeDedicacion": 20
        },
        {
            "orden": 2,
            "tipo": "Específica",
            "descripcion": "Relación con políticas públicas y programas especiales. Diseño y adecuación de líneas bajo convenios con organismos públicos, subsidios de tasa, créditos productivos, acceso a vivienda, inclusión financiera. Coordinación con Segmentos y Banca Internacional en casos de programas combinados.",
            "productoFinal": "Programas especiales y políticas públicas implementados.",
            "porcentajeDedicacion": 20
        },
        {
            "orden": 3,
            "tipo": "Específica",
            "descripcion": "Gestión integral del ciclo de vida del producto. Definición de pricing, plazos, condiciones, documentación, canales de solicitud, modelo operativo. Evaluación periódica y ajuste funcional del producto.",
            "productoFinal": "Ciclo de vida del producto gestionado integralmente.",
            "porcentajeDedicacion": 20
        },
        {
            "orden": 4,
            "tipo": "Específica",
            "descripcion": "Automatización y transformación digital del crédito. Requerimientos para preevaluación automatizada, scoring, simuladores, onboarding digital, firma electrónica. Mejora de tiempos y experiencia en aprobación y desembolso.",
            "productoFinal": "Procesos digitalizados de crédito implementados.",
            "porcentajeDedicacion": 20
        },
        {
            "orden": 5,
            "tipo": "Específica",
            "descripcion": "Seguimiento de KPI's y desempeño del producto. Volumen, número de operaciones, ticket promedio, tasa de mora, margen, tasa de rechazo, canal de originación, NPS asociado.",
            "productoFinal": "Reporte de KPI's y desempeño del producto.",
            "porcentajeDedicacion": 20
        },
        
        // INDICADORES (7) basados en el JSON actual pero mejorados
        {
            "orden": 1,
            "tipo": "Indicador",
            "descripcion": "Penetración y uso por producto y segmento."
        },
        {
            "orden": 2,
            "tipo": "Indicador",
            "descripcion": "Rentabilidad (margen bruto / neto) por producto."
        },
        {
            "orden": 3,
            "tipo": "Indicador",
            "descripcion": "Tasa de activación / deserción por producto."
        },
        {
            "orden": 4,
            "tipo": "Indicador",
            "descripcion": "% digitalización y autoservicio del producto."
        },
        {
            "orden": 5,
            "tipo": "Indicador",
            "descripcion": "Reclamos asociados / NPS de producto."
        },
        {
            "orden": 6,
            "tipo": "Indicador",
            "descripcion": "Tiempos de onboarding y operación."
        },
        {
            "orden": 7,
            "tipo": "Indicador",
            "descripcion": "Aportes al ROE o ROA institucional."
        }
    ];
    
    console.log('✅ Funciones actualizadas según MD');
    console.log(`📊 Funciones genéricas: ${activosUnit.funciones.filter(f => f.tipo === 'Genérica').length}`);
    console.log(`📊 Funciones específicas: ${activosUnit.funciones.filter(f => f.tipo === 'Específica').length}`);
    console.log(`📊 Indicadores: ${activosUnit.funciones.filter(f => f.tipo === 'Indicador').length}`);
    
    // Calcular porcentaje total de funciones específicas
    const porcentajeTotal = activosUnit.funciones
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
    console.log('✅ Misión completada según MD');
    console.log('✅ Limpiada estructura de datos (eliminadas versiones anteriores)');
    console.log('✅ Corregidos productos finales (específicos y completos)');
    console.log('✅ Corregidos campos incorrectos (strings a números)');
    console.log('✅ Mejoradas descripciones con detalles del MD');
    console.log('✅ Mantenidos indicadores relevantes del JSON original');
    console.log('✅ Porcentajes verificados (20% cada función específica)');
    
} catch (error) {
    console.error('❌ Error durante la actualización:', error.message);
    process.exit(1);
}

// Función para encontrar la unidad Activos
function findActivosUnit(hierarchy) {
    for (const unit of hierarchy) {
        if (unit.nombre === 'Activos') {
            return unit;
        }
        if (unit.children) {
            const found = findActivosUnit(unit.children);
            if (found) return found;
        }
    }
    return null;
} 