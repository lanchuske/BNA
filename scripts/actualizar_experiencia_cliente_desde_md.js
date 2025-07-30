const fs = require('fs');
const path = require('path');

// Configuración
const inputFile = 'organigrama_bna_2025-07-30-11.json';
const outputFile = 'organigrama_bna_2025-07-30-12.json';
const mdFile = 'MD/A.2 Experiencia del Cliente y Modelo de Atención.md';

console.log('🔄 Iniciando actualización de Experiencia del Cliente desde MD...');

try {
    // Leer archivos
    console.log('📖 Leyendo archivos...');
    const jsonData = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
    const mdContent = fs.readFileSync(mdFile, 'utf8');
    
    console.log('✅ Archivos leídos correctamente');
    
    // Buscar la unidad Experiencia del Cliente
    const experienciaClienteUnit = findExperienciaClienteUnit(jsonData.hierarchy.tree);
    
    if (!experienciaClienteUnit) {
        throw new Error('❌ No se encontró la unidad Experiencia del Cliente en el JSON');
    }
    
    console.log('✅ Unidad Experiencia del Cliente encontrada');
    
    // Actualizar misión según MD
    const misionMD = "Diseñar, implementar y monitorear el modelo integral de atención al cliente en todos los canales del Banco, asegurando una experiencia homogénea, empática, eficiente y centrada en el usuario. Promover la mejora continua de los procesos de contacto, el desarrollo de journeys multicanal y la implementación de estándares de calidad y experiencia cliente.";
    
    experienciaClienteUnit.mision = misionMD;
    console.log('✅ Misión actualizada según MD');
    
    // Actualizar funciones según MD
    experienciaClienteUnit.funciones = [
        // FUNCIONES GENÉRICAS (5) según MD
        {
            "orden": 1,
            "tipo": "Genérica",
            "descripcion": "Diseñar y actualizar el Modelo de Atención del Banco. Definir principios, protocolos, estándares y arquetipos de atención para todos los canales (sucursales, canales digitales, atención remota, contact center), segmentando por tipo de cliente y operación.",
            "productoFinal": "Modelo integral de atención del cliente."
        },
        {
            "orden": 2,
            "tipo": "Genérica",
            "descripcion": "Desarrollar y monitorear journeys críticos multicanal. Mapear, diseñar y mejorar procesos claves desde la perspectiva del cliente (onboarding, reclamos, activación de productos, recuperación de claves, cancelación, etc.), asegurando fluidez y consistencia.",
            "productoFinal": "Journeys críticos multicanal desarrollados y monitoreados."
        },
        {
            "orden": 3,
            "tipo": "Genérica",
            "descripcion": "Promover estándares de experiencia cliente en toda la red. Establecer políticas de servicio, indicadores de calidad, tiempos máximos de atención/resolución y criterios de seguimiento en todos los canales.",
            "productoFinal": "Estándares de experiencia cliente promovidos en toda la red."
        },
        {
            "orden": 4,
            "tipo": "Genérica",
            "descripcion": "Escuchar activamente la voz del cliente y coordinar su sistematización. Analizar NPS, encuestas de satisfacción, reclamos, comentarios en redes y otros mecanismos de feedback, para identificar oportunidades de mejora y coordinar respuestas y revisión y soluciones de las causas raíz.",
            "productoFinal": "Voz del cliente escuchada y sistematizada."
        },
        {
            "orden": 5,
            "tipo": "Genérica",
            "descripcion": "Capacitar y acompañar a los equipos de atención. Desarrollar materiales, talleres y procesos de entrenamiento sobre experiencia cliente, lenguaje claro, atención inclusiva y herramientas de relacionamiento.",
            "productoFinal": "Equipos de atención capacitados y acompañados."
        },
        
        // FUNCIONES ESPECÍFICAS (5) con porcentajes correctos según MD
        {
            "orden": 1,
            "tipo": "Específica",
            "descripcion": "Diseño del Modelo de Atención integral. Establecer protocolos unificados de atención por canal, nivel de cliente, tipo de requerimiento. Definir niveles de servicio, criterios de derivación, modalidad presencial vs. remota. Establecer procesos de atención híbrida y multicanal coordinada.",
            "productoFinal": "Diseño del Modelo de Atención integral implementado.",
            "porcentajeDedicacion": 20
        },
        {
            "orden": 2,
            "tipo": "Específica",
            "descripcion": "Diseño y mejora de journeys prioritarios. Mapeo y rediseño de los procesos críticos desde el punto de vista del cliente. Identificación de puntos de fricción, rediseño con enfoque UX/CX, validación por segmento. Monitoreo permanente del journey y actualización continua.",
            "productoFinal": "Diseño y mejora de journeys prioritarios implementado.",
            "porcentajeDedicacion": 20
        },
        {
            "orden": 3,
            "tipo": "Específica",
            "descripcion": "Seguimiento y mejora de indicadores de experiencia. NPS (Net Promoter Score), TMO (tiempo medio de operación), tasa de resolución en primer contacto, tasa de reclamos, encuestas post interacción. Desarrollo de tableros y alertas operativas por canal.",
            "productoFinal": "Seguimiento y mejora de indicadores de experiencia implementado.",
            "porcentajeDedicacion": 20
        },
        {
            "orden": 4,
            "tipo": "Específica",
            "descripcion": "Estrategia de gestión de la voz del cliente (VoC). Consolidación de insights desde múltiples fuentes: encuestas, redes sociales, CRM, reclamos, comentarios. Integración de resultados en la toma de decisiones operativas y estratégicas.",
            "productoFinal": "Estrategia de gestión de la voz del cliente implementada.",
            "porcentajeDedicacion": 20
        },
        {
            "orden": 5,
            "tipo": "Específica",
            "descripcion": "Capacitación y acompañamiento a la red. Creación de manuales y capacitaciones sobre el Modelo de Atención. Programas de formación en experiencia cliente, empatía, diversidad y trato diferencial por segmento. Supervisión de la correcta implementación en toda la red.",
            "productoFinal": "Capacitación y acompañamiento a la red implementado.",
            "porcentajeDedicacion": 20
        },
        
        // INDICADORES (6) basados en el JSON actual pero mejorados
        {
            "orden": 1,
            "tipo": "Indicador",
            "descripcion": "Tasa de satisfacción del cliente por canal."
        },
        {
            "orden": 2,
            "tipo": "Indicador",
            "descripcion": "NPS (Net Promoter Score) general del banco."
        },
        {
            "orden": 3,
            "tipo": "Indicador",
            "descripcion": "Tiempo promedio de resolución de consultas por canal."
        },
        {
            "orden": 4,
            "tipo": "Indicador",
            "descripcion": "Porcentaje de casos resueltos en primera interacción."
        },
        {
            "orden": 5,
            "tipo": "Indicador",
            "descripcion": "Tasa de abandono en procesos de atención."
        },
        {
            "orden": 6,
            "tipo": "Indicador",
            "descripcion": "Número de quejas y reclamos por mes."
        }
    ];
    
    console.log('✅ Funciones actualizadas según MD');
    console.log(`📊 Funciones genéricas: ${experienciaClienteUnit.funciones.filter(f => f.tipo === 'Genérica').length}`);
    console.log(`📊 Funciones específicas: ${experienciaClienteUnit.funciones.filter(f => f.tipo === 'Específica').length}`);
    console.log(`📊 Indicadores: ${experienciaClienteUnit.funciones.filter(f => f.tipo === 'Indicador').length}`);
    
    // Calcular porcentaje total de funciones específicas
    const porcentajeTotal = experienciaClienteUnit.funciones
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
    console.log('✅ Eliminada función genérica extra "Establecer lineamientos"');
    console.log('✅ Eliminada función específica extra "Identificar fricciones"');
    console.log('✅ Corregidos porcentajes de dedicación (20% cada una)');
    console.log('✅ Removido porcentaje de función genérica');
    console.log('✅ Removido producto final de indicador');
    console.log('✅ Mejoradas descripciones con detalles del MD');
    console.log('✅ Mantenidos indicadores relevantes del JSON original');
    
} catch (error) {
    console.error('❌ Error durante la actualización:', error.message);
    process.exit(1);
}

// Función para encontrar la unidad Experiencia del Cliente
function findExperienciaClienteUnit(hierarchy) {
    for (const unit of hierarchy) {
        if (unit.nombre === 'Experiencia Del Cliente Y Modelo De Atención') {
            return unit;
        }
        if (unit.children) {
            const found = findExperienciaClienteUnit(unit.children);
            if (found) return found;
        }
    }
    return null;
} 