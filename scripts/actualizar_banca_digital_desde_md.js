const fs = require('fs');
const path = require('path');

// Configuración
const inputFile = 'organigrama_bna_2025-07-30-10.json';
const outputFile = 'organigrama_bna_2025-07-30-11.json';
const mdFile = 'MD/A.1 Banca Digital.md';

console.log('🔄 Iniciando actualización de Banca Digital desde MD...');

try {
    // Leer archivos
    console.log('📖 Leyendo archivos...');
    const jsonData = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
    const mdContent = fs.readFileSync(mdFile, 'utf8');
    
    console.log('✅ Archivos leídos correctamente');
    
    // Buscar la unidad Banca Digital
    const bancaDigitalUnit = findBancaDigitalUnit(jsonData.hierarchy.tree);
    
    if (!bancaDigitalUnit) {
        throw new Error('❌ No se encontró la unidad Banca Digital en el JSON');
    }
    
    console.log('✅ Unidad Banca Digital encontrada');
    
    // Actualizar misión según MD
    const misionMD = "Desarrollar, administrar y optimizar los canales digitales del Banco (Home Banking, App Móvil, Banca Empresas, Banca Web, canales de atención digital), asegurando su disponibilidad, seguridad, evolución funcional y alineación con la experiencia deseada del cliente. Impulsar la digitalización de operaciones, la adopción por parte de los usuarios y la integración plena con el resto del ecosistema de atención.";
    
    bancaDigitalUnit.mision = misionMD;
    console.log('✅ Misión actualizada según MD');
    
    // Actualizar funciones según MD
    bancaDigitalUnit.funciones = [
        // FUNCIONES GENÉRICAS (5) según MD
        {
            "orden": 1,
            "tipo": "Genérica",
            "descripcion": "Gestionar y evolucionar la infraestructura de canales digitales. Supervisar el funcionamiento, mantenimiento y desarrollo funcional de los canales digitales disponibles para clientes personas y empresas.",
            "productoFinal": "Infraestructura de canales digitales optimizada."
        },
        {
            "orden": 2,
            "tipo": "Genérica",
            "descripcion": "Impulsar la adopción y uso de canales digitales. Diseñar e implementar estrategias para aumentar la cantidad y frecuencia de uso de Home Banking, App, Banca Web y servicios de autogestión, reduciendo la dependencia de canales presenciales.",
            "productoFinal": "Estrategias de adopción digital implementadas."
        },
        {
            "orden": 3,
            "tipo": "Genérica",
            "descripcion": "Coordinar con Tecnología, Seguridad y UX para la mejora continua. Priorizar funcionalidades, diseñar journeys digitales y coordinar releases de nuevas versiones, con foco en estabilidad, usabilidad y eficiencia.",
            "productoFinal": "Coordinación técnica y UX optimizada."
        },
        {
            "orden": 4,
            "tipo": "Genérica",
            "descripcion": "Monitorear la operación de los canales digitales y sus indicadores clave. Analizar el desempeño técnico, funcional y comercial de cada canal digital, detectando oportunidades de mejora, puntos de fricción o problemas de servicio.",
            "productoFinal": "Monitoreo y análisis de performance digital."
        },
        {
            "orden": 5,
            "tipo": "Genérica",
            "descripcion": "Asegurar la coherencia entre la experiencia digital y el modelo de atención integral del Banco. Integrar los canales digitales al modelo multicanal, promoviendo una experiencia homogénea, accesible y centrada en el cliente.",
            "productoFinal": "Experiencia digital coherente e integrada."
        },
        
        // FUNCIONES ESPECÍFICAS (5) con porcentajes correctos según MD
        {
            "orden": 1,
            "tipo": "Específica",
            "descripcion": "Gestión funcional de canales digitales y performance comercial y de servicio al Cliente. Definir roadmap de mejoras, evolución funcional, integración con productos, UX/UI y seguridad. Coordinar backlog con Tecnología y priorizar iniciativas. Administrar catálogos, documentación técnica y mejoras. Ejecutar acciones comerciales y disponibilizar las capacidades necesarias para maximizar la productividad del Canal en ventas y servicio al Cliente.",
            "productoFinal": "Gestión funcional y comercial optimizada.",
            "porcentajeDedicacion": 30
        },
        {
            "orden": 2,
            "tipo": "Específica",
            "descripcion": "Seguimiento y optimización de performance digital. Monitorear tiempos de respuesta, disponibilidad, errores, flujos incompletos, tasa de éxito por operación. Coordinar con Tecnología la resolución de incidentes.",
            "productoFinal": "Performance digital optimizada.",
            "porcentajeDedicacion": 20
        },
        {
            "orden": 3,
            "tipo": "Específica",
            "descripcion": "Desarrollo de funcionalidades y journeys digitales. Diseñar flujos digitales para productos y operaciones: apertura de cuentas, préstamos, seguros, transferencias, pagos, cambios de datos, etc. Asegurar la lógica de self-service completa.",
            "productoFinal": "Funcionalidades y journeys digitales desarrollados.",
            "porcentajeDedicacion": 20
        },
        {
            "orden": 4,
            "tipo": "Específica",
            "descripcion": "Fomento de adopción y capacitación en canales digitales. Coordinar campañas de difusión, activación y retención. Desarrollar tutoriales, micrositios, instructivos y materiales para usuarios y fuerza comercial. Participar en planes de educación financiera digital.",
            "productoFinal": "Adopción y capacitación digital fomentada.",
            "porcentajeDedicacion": 20
        },
        {
            "orden": 5,
            "tipo": "Específica",
            "descripcion": "Integración con la estrategia multicanal del Banco. Asegurar que los canales digitales estén alineados con los protocolos, estándares y modelos de atención definidos para el resto del ecosistema. Proveer métricas e insights para la estrategia comercial y de producto.",
            "productoFinal": "Integración multicanal implementada.",
            "porcentajeDedicacion": 10
        },
        
        // INDICADORES (4) basados en el JSON actual pero mejorados
        {
            "orden": 1,
            "tipo": "Indicador",
            "descripcion": "Usuarios activos mensuales por canal (personas / empresas)."
        },
        {
            "orden": 2,
            "tipo": "Indicador",
            "descripcion": "% operaciones digitales vs. presenciales (digitalización)."
        },
        {
            "orden": 3,
            "tipo": "Indicador",
            "descripcion": "Tasa de éxito de operaciones por journey."
        },
        {
            "orden": 4,
            "tipo": "Indicador",
            "descripcion": "Tasa de abandono y errores funcionales / técnicos."
        }
    ];
    
    console.log('✅ Funciones actualizadas según MD');
    console.log(`📊 Funciones genéricas: ${bancaDigitalUnit.funciones.filter(f => f.tipo === 'Genérica').length}`);
    console.log(`📊 Funciones específicas: ${bancaDigitalUnit.funciones.filter(f => f.tipo === 'Específica').length}`);
    console.log(`📊 Indicadores: ${bancaDigitalUnit.funciones.filter(f => f.tipo === 'Indicador').length}`);
    
    // Calcular porcentaje total de funciones específicas
    const porcentajeTotal = bancaDigitalUnit.funciones
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
    console.log('✅ Eliminada función extra "Definir requerimientos"');
    console.log('✅ Corregidos porcentajes de dedicación (30%, 20%, 20%, 20%, 10%)');
    console.log('✅ Mejoradas descripciones con detalles del MD');
    console.log('✅ Actualizados productos finales según MD');
    console.log('✅ Mantenidos indicadores relevantes del JSON original');
    
} catch (error) {
    console.error('❌ Error durante la actualización:', error.message);
    process.exit(1);
}

// Función para encontrar la unidad Banca Digital
function findBancaDigitalUnit(hierarchy) {
    for (const unit of hierarchy) {
        if (unit.nombre === 'Banca Digital') {
            return unit;
        }
        if (unit.children) {
            const found = findBancaDigitalUnit(unit.children);
            if (found) return found;
        }
    }
    return null;
} 