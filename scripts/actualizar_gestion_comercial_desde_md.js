const fs = require('fs');
const path = require('path');

// Configuración
const inputFile = 'organigrama_bna_2025-07-30-12.json';
const outputFile = 'organigrama_bna_2025-07-30-13.json';
const mdFile = 'MD/A.3 Gestion Comercial.md';

console.log('🔄 Iniciando actualización de Gestión Comercial desde MD...');

try {
    // Leer archivos
    console.log('📖 Leyendo archivos...');
    const jsonData = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
    const mdContent = fs.readFileSync(mdFile, 'utf8');
    
    console.log('✅ Archivos leídos correctamente');
    
    // Buscar la unidad Gestión Comercial
    const gestionComercialUnit = findGestionComercialUnit(jsonData.hierarchy.tree);
    
    if (!gestionComercialUnit) {
        throw new Error('❌ No se encontró la unidad Gestión Comercial en el JSON');
    }
    
    console.log('✅ Unidad Gestión Comercial encontrada');
    
    // Actualizar misión según MD
    const misionMD = "Coordinar y supervisar la ejecución comercial en la red de sucursales y canales presenciales y remotos del Banco, asegurando el cumplimiento de objetivos comerciales, la aplicación de lineamientos estratégicos, el desarrollo de capacidades de venta consultiva y la implementación efectiva de campañas y bundles definidos por Segmentos y Productos.";
    
    gestionComercialUnit.mision = misionMD;
    console.log('✅ Misión actualizada según MD');
    
    // Actualizar funciones según MD
    gestionComercialUnit.funciones = [
        // FUNCIONES GENÉRICAS (5) según MD
        {
            "orden": 1,
            "tipo": "Genérica",
            "descripcion": "Asegurar la implementación del plan comercial. Operacionalizar los lineamientos estratégicos definidos por las áreas de Segmentos, Productos y Marketing, garantizando la ejecución uniforme y oportuna en todos los canales y en todas las zonas del país.",
            "productoFinal": "Implementación del plan comercial asegurada."
        },
        {
            "orden": 2,
            "tipo": "Genérica",
            "descripcion": "Monitorear el desempeño comercial por canal, región y equipo. Controlar los indicadores clave de performance (KPI's) vinculados a ventas, captación, vinculación, cross-selling, cumplimiento de metas y evolución de campañas.",
            "productoFinal": "Desempeño comercial por canal, región y equipo monitoreado."
        },
        {
            "orden": 3,
            "tipo": "Genérica",
            "descripcion": "Acompañar a la red en la ejecución táctica y la gestión comercial diaria. Brindar soporte, herramientas y seguimiento a jefes zonales, regionales y responsables de atención comercial, para facilitar el cumplimiento de objetivos.",
            "productoFinal": "Acompañamiento a la red en la ejecución táctica y gestión comercial diaria."
        },
        {
            "orden": 4,
            "tipo": "Genérica",
            "descripcion": "Detectar oportunidades de mejora comercial desde la red. Canalizar oportunidades, demandas y ajustes necesarios a la estrategia, en base a los aprendizajes y feedback operativo desde las sucursales.",
            "productoFinal": "Oportunidades de mejora comercial detectadas desde la red."
        },
        {
            "orden": 5,
            "tipo": "Genérica",
            "descripcion": "Impulsar la profesionalización de la gestión comercial. Promover estándares, metodologías de venta consultiva, gestión por objetivos y formación continua de los equipos de atención y venta.",
            "productoFinal": "Profesionalización de la gestión comercial impulsada."
        },
        
        // FUNCIONES ESPECÍFICAS (5) con porcentajes correctos según MD
        {
            "orden": 1,
            "tipo": "Específica",
            "descripcion": "Implementación operativa del plan comercial. Desplegar objetivos por canal / región / producto / segmento. Coordinar el lanzamiento local de bundles, campañas, promociones y productos nuevos. Verificar la correcta aplicación de condiciones comerciales.",
            "productoFinal": "Implementación operativa del plan comercial implementada.",
            "porcentajeDedicacion": 20
        },
        {
            "orden": 2,
            "tipo": "Específica",
            "descripcion": "Monitoreo de KPI's y performance comercial. Seguimiento de indicadores como: captación, productos por cliente, tickets promedio, uso de productos claves, ingresos comerciales, activaciones. Análisis de brechas, desvíos y oportunidades.",
            "productoFinal": "Monitoreo de KPI's y performance comercial implementado.",
            "porcentajeDedicacion": 20
        },
        {
            "orden": 3,
            "tipo": "Específica",
            "descripcion": "Soporte directo a regiones y sucursales. Canal único de contacto comercial para responsables zonales y regionales. Resolución de desvíos, aclaración de condiciones, acompañamiento en campañas.",
            "productoFinal": "Soporte directo a regiones y sucursales implementado.",
            "porcentajeDedicacion": 20
        },
        {
            "orden": 4,
            "tipo": "Específica",
            "descripcion": "Seguimiento y cierre de campañas. Supervisión del cumplimiento de metas por acción. Consolidación de resultados, comunicación de avances, buenas prácticas y lecciones aprendidas.",
            "productoFinal": "Seguimiento y cierre de campañas implementado.",
            "porcentajeDedicacion": 20
        },
        {
            "orden": 5,
            "tipo": "Específica",
            "descripcion": "Gestión de capacidades y herramientas comerciales. Confección de kits comerciales, materiales de apoyo, simuladores, comparadores y manuales. Articulación con Formación para el desarrollo de talleres y entrenamientos.",
            "productoFinal": "Gestión de capacidades y herramientas comerciales implementada.",
            "porcentajeDedicacion": 20
        },
        
        // INDICADORES (6) basados en el JSON actual pero mejorados
        {
            "orden": 1,
            "tipo": "Indicador",
            "descripcion": "Tasa de conversión de campañas comerciales por canal."
        },
        {
            "orden": 2,
            "tipo": "Indicador",
            "descripcion": "Porcentaje de cumplimiento de objetivos comerciales."
        },
        {
            "orden": 3,
            "tipo": "Indicador",
            "descripcion": "ROI de las acciones comerciales por campaña."
        },
        {
            "orden": 4,
            "tipo": "Indicador",
            "descripcion": "Tasa de adopción de nuevas acciones comerciales."
        },
        {
            "orden": 5,
            "tipo": "Indicador",
            "descripcion": "Satisfacción del equipo comercial con las herramientas."
        },
        {
            "orden": 6,
            "tipo": "Indicador",
            "descripcion": "Porcentaje de canales que cumplen metas comerciales."
        }
    ];
    
    console.log('✅ Funciones actualizadas según MD');
    console.log(`📊 Funciones genéricas: ${gestionComercialUnit.funciones.filter(f => f.tipo === 'Genérica').length}`);
    console.log(`📊 Funciones específicas: ${gestionComercialUnit.funciones.filter(f => f.tipo === 'Específica').length}`);
    console.log(`📊 Indicadores: ${gestionComercialUnit.funciones.filter(f => f.tipo === 'Indicador').length}`);
    
    // Calcular porcentaje total de funciones específicas
    const porcentajeTotal = gestionComercialUnit.funciones
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
    console.log('✅ Misión actualizada según MD');
    console.log('✅ Eliminadas 2 funciones genéricas extra');
    console.log('✅ Eliminada función específica extra "Proponer ajustes"');
    console.log('✅ Corregidos porcentajes de dedicación (20% cada una)');
    console.log('✅ Mejoradas descripciones con detalles del MD');
    console.log('✅ Actualizados productos finales según MD');
    console.log('✅ Mantenidos indicadores relevantes del JSON original');
    
} catch (error) {
    console.error('❌ Error durante la actualización:', error.message);
    process.exit(1);
}

// Función para encontrar la unidad Gestión Comercial
function findGestionComercialUnit(hierarchy) {
    for (const unit of hierarchy) {
        if (unit.nombre === 'Gestión Comercial') {
            return unit;
        }
        if (unit.children) {
            const found = findGestionComercialUnit(unit.children);
            if (found) return found;
        }
    }
    return null;
} 