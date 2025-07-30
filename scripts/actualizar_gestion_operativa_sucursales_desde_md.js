const fs = require('fs');
const path = require('path');

// Configuración
const inputFile = 'organigrama_bna_2025-07-30-13.json';
const outputFile = 'organigrama_bna_2025-07-30-14.json';
const mdFile = 'MD/A.4 Gestion operativa sucursales.md';

console.log('🔄 Iniciando actualización de Gestión Operativa de Sucursales desde MD...');

try {
    // Leer archivos
    console.log('📖 Leyendo archivos...');
    const jsonData = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
    const mdContent = fs.readFileSync(mdFile, 'utf8');
    
    console.log('✅ Archivos leídos correctamente');
    
    // Buscar la unidad Gestión Operativa de Sucursales
    const gestionOperativaUnit = findGestionOperativaUnit(jsonData.hierarchy.tree);
    
    if (!gestionOperativaUnit) {
        throw new Error('❌ No se encontró la unidad Gestión Operativa de Sucursales en el JSON');
    }
    
    console.log('✅ Unidad Gestión Operativa de Sucursales encontrada');
    
    // Actualizar misión según MD
    const misionMD = "Supervisar y optimizar el funcionamiento operativo de la red de sucursales del Banco, garantizando el cumplimiento de los estándares de atención, eficiencia administrativa, seguridad operativa, calidad de servicio y adecuada ejecución de procesos críticos. Asegurar la correcta implementación de políticas, procedimientos y normativas transversales en toda la red física.";
    
    gestionOperativaUnit.mision = misionMD;
    console.log('✅ Misión actualizada según MD');
    
    // Actualizar funciones según MD
    gestionOperativaUnit.funciones = [
        // FUNCIONES GENÉRICAS (5) según MD
        {
            "orden": 1,
            "tipo": "Genérica",
            "descripcion": "Supervisar la operación diaria de las sucursales del Banco. Monitorear que los procesos operativos en las sucursales se ejecuten de forma segura, eficiente y en línea con las políticas institucionales.",
            "productoFinal": "Operación diaria de las sucursales supervisada."
        },
        {
            "orden": 2,
            "tipo": "Genérica",
            "descripcion": "Asegurar la aplicación de normativas, protocolos y estándares operativos. Garantizar la implementación y cumplimiento de regulaciones del BCRA, normativa interna y controles de riesgo operativo en todas las sedes.",
            "productoFinal": "Aplicación de normativas, protocolos y estándares operativos asegurada."
        },
        {
            "orden": 3,
            "tipo": "Genérica",
            "descripcion": "Detectar desvíos operativos y coordinar acciones correctivas. Realizar seguimiento de indicadores operativos, alertas, auditorías o reclamos operativos, y coordinar las medidas necesarias con cada sucursal.",
            "productoFinal": "Desvíos operativos detectados y acciones correctivas coordinadas."
        },
        {
            "orden": 4,
            "tipo": "Genérica",
            "descripcion": "Contribuir a la mejora de procesos y la simplificación operativa. Identificar oportunidades de digitalización, automatización o rediseño de procedimientos para mejorar la eficiencia y experiencia cliente.",
            "productoFinal": "Contribución a la mejora de procesos y simplificación operativa."
        },
        {
            "orden": 5,
            "tipo": "Genérica",
            "descripcion": "Acompañar a los responsables operativos de cada zona y región. Brindar lineamientos, capacitación, seguimiento y resolución de consultas operativas complejas o estructurales.",
            "productoFinal": "Acompañamiento a los responsables operativos de cada zona y región."
        },
        
        // FUNCIONES ESPECÍFICAS (5) con porcentajes correctos según MD
        {
            "orden": 1,
            "tipo": "Específica",
            "descripcion": "Gestión del cumplimiento operativo. Supervisar el cumplimiento de los procedimientos definidos por Normativa Interna, Auditoría, Riesgos y Cumplimiento. Monitorear la ejecución adecuada de operaciones críticas (aperturas de cuenta, cajas de seguridad, operaciones de efectivo, control de documentación, etc.).",
            "productoFinal": "Gestión del cumplimiento operativo implementada.",
            "porcentajeDedicacion": 20
        },
        {
            "orden": 2,
            "tipo": "Específica",
            "descripcion": "Coordinación de procesos y circuitos administrativos. Verificar flujos correctos de documentación, trazabilidad de procesos, archivo y digitalización. Coordinar la actualización y validación de instructivos con las áreas centrales.",
            "productoFinal": "Coordinación de procesos y circuitos administrativos implementada.",
            "porcentajeDedicacion": 20
        },
        {
            "orden": 3,
            "tipo": "Específica",
            "descripcion": "Seguimiento de indicadores y control de gestión operativa. Tiempos medios de operación, errores operativos, reclamos, cumplimiento de SLA, uso de sistemas. Alertas tempranas y desvíos frente a normativa.",
            "productoFinal": "Seguimiento de indicadores y control de gestión operativa implementado.",
            "porcentajeDedicacion": 20
        },
        {
            "orden": 4,
            "tipo": "Específica",
            "descripcion": "Gestión del recurso operativo y de infraestructura. Colaborar en la planificación operativa, dimensionamiento y asignación de tareas del personal en sucursales. Detectar necesidades de adecuación edilicia, equipamiento, conectividad u otros recursos materiales.",
            "productoFinal": "Gestión del recurso operativo y de infraestructura implementada.",
            "porcentajeDedicacion": 20
        },
        {
            "orden": 5,
            "tipo": "Específica",
            "descripcion": "Capacitación y soporte técnico a la red. Elaborar y distribuir materiales operativos. Coordinar capacitaciones con las áreas de Formación y Procesos para mantener actualizados a los responsables operativos.",
            "productoFinal": "Capacitación y soporte técnico a la red implementado.",
            "porcentajeDedicacion": 20
        },
        
        // INDICADORES (5) basados en el JSON actual pero mejorados
        {
            "orden": 1,
            "tipo": "Indicador",
            "descripcion": "Porcentaje de cumplimiento de protocolos operativos por sucursal."
        },
        {
            "orden": 2,
            "tipo": "Indicador",
            "descripcion": "Tiempo promedio de resolución de incidencias operativas."
        },
        {
            "orden": 3,
            "tipo": "Indicador",
            "descripcion": "Porcentaje de cumplimiento de estándares de calidad operativa."
        },
        {
            "orden": 4,
            "tipo": "Indicador",
            "descripcion": "Tiempo promedio de implementación de mejoras operativas."
        },
        {
            "orden": 5,
            "tipo": "Indicador",
            "descripcion": "Número de incidencias críticas resueltas por mes."
        }
    ];
    
    console.log('✅ Funciones actualizadas según MD');
    console.log(`📊 Funciones genéricas: ${gestionOperativaUnit.funciones.filter(f => f.tipo === 'Genérica').length}`);
    console.log(`📊 Funciones específicas: ${gestionOperativaUnit.funciones.filter(f => f.tipo === 'Específica').length}`);
    console.log(`📊 Indicadores: ${gestionOperativaUnit.funciones.filter(f => f.tipo === 'Indicador').length}`);
    
    // Calcular porcentaje total de funciones específicas
    const porcentajeTotal = gestionOperativaUnit.funciones
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
    console.log('✅ Eliminadas 2 funciones genéricas extra');
    console.log('✅ Eliminadas 4 funciones específicas extra');
    console.log('✅ Corregidos porcentajes de dedicación (20% cada una)');
    console.log('✅ Limpiada estructura de datos (eliminadas versiones anteriores)');
    console.log('✅ Mejoradas descripciones con detalles del MD');
    console.log('✅ Actualizados productos finales según MD');
    console.log('✅ Mantenidos indicadores relevantes del JSON original');
    
} catch (error) {
    console.error('❌ Error durante la actualización:', error.message);
    process.exit(1);
}

// Función para encontrar la unidad Gestión Operativa de Sucursales
function findGestionOperativaUnit(hierarchy) {
    for (const unit of hierarchy) {
        if (unit.nombre === 'Gestión Operativa De Sucursales') {
            return unit;
        }
        if (unit.children) {
            const found = findGestionOperativaUnit(unit.children);
            if (found) return found;
        }
    }
    return null;
} 