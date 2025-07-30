const fs = require('fs');
const path = require('path');

// Leer el archivo JSON
const jsonPath = 'organigrama_bna_2025-07-30-8.json';
const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Función para encontrar y actualizar la unidad CAC
function actualizarCAC() {
    // Buscar la unidad CAC en la jerarquía
    function buscarYActualizarCAC(nodos) {
        for (let nodo of nodos) {
            if (nodo.key === "CAC|Canales") {
                console.log('✅ Encontrada unidad CAC, actualizando...');
                
                // Actualizar funciones basándose en el MD
                nodo.funciones = [
                    // FUNCIONES GENÉRICAS (5)
                    {
                        "orden": 1,
                        "tipo": "Genérica",
                        "descripcion": "Administrar la operación diaria del centro de atención y evolucionar sus capacidades. Supervisar la gestión de llamadas entrantes y salientes, tiempos de respuesta, derivaciones, calidad de atención y resolución efectiva. Generar capacidades comerciales y ejecutar el plan comercial para el Canal. Liderar el desarrollo de capacidades automatizadas de procesamiento de transacciones y requerimientos de los Clientes.",
                        "productoFinal": "Operación diaria del CAC optimizada."
                    },
                    {
                        "orden": 2,
                        "tipo": "Genérica",
                        "descripcion": "Definir y actualizar protocolos de atención y scripts. Asegurar que los agentes cuenten con información precisa, lenguaje claro y procedimientos homogéneos para cada tipo de interacción.",
                        "productoFinal": "Protocolos de atención actualizados."
                    },
                    {
                        "orden": 3,
                        "tipo": "Genérica",
                        "descripcion": "Monitorear performance operativa y calidad de atención. Analizar KPI's como TMO (tiempo medio de operación), tasa de abandono, nivel de servicio, tasa de resolución en primer contacto y satisfacción post-llamada.",
                        "productoFinal": "Dashboard de performance operativa."
                    },
                    {
                        "orden": 4,
                        "tipo": "Genérica",
                        "descripcion": "Desarrollar al equipo de agentes y supervisores. Implementar programas de capacitación, coaching y evaluación continua para asegurar desempeño profesional y excelencia en la atención.",
                        "productoFinal": "Equipo capacitado y evaluado."
                    },
                    {
                        "orden": 5,
                        "tipo": "Genérica",
                        "descripcion": "Colaborar en la mejora de procesos y digitalización. Identificar oportunidades de autoservicio, migración de llamadas a canales digitales y mejora de procesos que disminuyan el volumen innecesario.",
                        "productoFinal": "Iniciativas de mejora y digitalización."
                    },
                    
                    // FUNCIONES ESPECÍFICAS (5) con porcentajes correctos
                    {
                        "orden": 1,
                        "tipo": "Específica",
                        "descripcion": "Gestión comercial y operativa del CAC. Ejecutar el plan comercial del Canal. Planificación de turnos, monitoreo en tiempo real, asignación de recursos. Seguimiento de SLA, congestión, gestión de picos de demanda.",
                        "productoFinal": "Operación CAC funcionando.",
                        "porcentajeDedicacion": 35
                    },
                    {
                        "orden": 2,
                        "tipo": "Específica",
                        "descripcion": "Diseño de protocolos y herramientas de atención. Scripts, bases de conocimiento, manuales rápidos y workflows de resolución. Integración con CRM y sistemas transaccionales para trazabilidad.",
                        "productoFinal": "Manual de atención.",
                        "porcentajeDedicacion": 20
                    },
                    {
                        "orden": 3,
                        "tipo": "Específica",
                        "descripcion": "Análisis de la voz del cliente y mejora continua. Análisis de llamadas, motivos de contacto, reclamos frecuentes. Elevación de hallazgos a Canales, Productos, Tecnología y Atención.",
                        "productoFinal": "Reporte de insights.",
                        "porcentajeDedicacion": 15
                    },
                    {
                        "orden": 4,
                        "tipo": "Específica",
                        "descripcion": "Supervisión de calidad de atención. Escucha de llamadas, scoring de interacciones, evaluaciones periódicas. Implementación de encuestas post-atención y NPS del canal.",
                        "productoFinal": "Dashboard CAC.",
                        "porcentajeDedicacion": 15
                    },
                    {
                        "orden": 5,
                        "tipo": "Específica",
                        "descripcion": "Interacción con otras áreas operativas y comerciales. Resolución de casos complejos, derivación a canales especializados, retroalimentación de procesos.",
                        "productoFinal": "Contactos Atendidos y Derivados.",
                        "porcentajeDedicacion": 15
                    },
                    
                    // INDICADORES (4) basados en el MD
                    {
                        "orden": 1,
                        "tipo": "Indicador",
                        "descripcion": "TMO (Tiempo Medio de Operación)."
                    },
                    {
                        "orden": 2,
                        "tipo": "Indicador",
                        "descripcion": "Tasa de abandono."
                    },
                    {
                        "orden": 3,
                        "tipo": "Indicador",
                        "descripcion": "Nivel de servicio (NS): % llamadas atendidas en tiempo objetivo."
                    },
                    {
                        "orden": 4,
                        "tipo": "Indicador",
                        "descripcion": "Satisfacción post-llamada."
                    }
                ];
                
                console.log('✅ CAC actualizado con éxito');
                return true;
            }
            
            if (nodo.children && nodo.children.length > 0) {
                if (buscarYActualizarCAC(nodo.children)) {
                    return true;
                }
            }
        }
        return false;
    }
    
    return buscarYActualizarCAC(jsonData.hierarchy.tree);
}

// Ejecutar la actualización
console.log('🔄 Iniciando actualización de CAC desde MD...');

if (actualizarCAC()) {
    // Actualizar metadata
    jsonData.metadata.lastUpdate = new Date().toISOString();
    jsonData.metadata.lastModified = new Date().toISOString();
    jsonData.metadata.notes += "\n- Actualizada unidad CAC con funciones completas del MD\n- Corregidos porcentajes de dedicación (100% en específicas)\n- Agregadas 5 funciones genéricas y 5 específicas\n- Incluidos 4 indicadores basados en MD";
    
    // Guardar el archivo actualizado
    const outputPath = 'organigrama_bna_2025-07-30-9.json';
    fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2));
    
    console.log('✅ Archivo guardado como:', outputPath);
    console.log('📊 Resumen de cambios:');
    console.log('   - 5 funciones genéricas (antes 4)');
    console.log('   - 5 funciones específicas (antes 3)');
    console.log('   - 4 indicadores (antes 3)');
    console.log('   - Porcentajes corregidos: 35%, 20%, 15%, 15%, 15%');
} else {
    console.log('❌ No se encontró la unidad CAC');
} 