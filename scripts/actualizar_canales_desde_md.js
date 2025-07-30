const fs = require('fs');
const path = require('path');

// Leer el archivo JSON
const jsonPath = 'organigrama_bna_2025-07-30-9.json';
const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Función para encontrar y actualizar la unidad Canales
function actualizarCanales() {
    // Buscar la unidad Canales en la jerarquía
    function buscarYActualizarCanales(nodos) {
        for (let nodo of nodos) {
            if (nodo.key === "Canales|SGP Clientes") {
                console.log('✅ Encontrada unidad Canales, actualizando...');
                
                // Actualizar funciones basándose en el MD
                nodo.funciones = [
                    // FUNCIONES GENÉRICAS (6) según MD
                    {
                        "orden": 1,
                        "tipo": "Genérica",
                        "descripcion": "Ejecutar la estrategia comercial del Banco. Establecer lineamientos y estrategias para maximizar los resultados comerciales y productividades de los canales físicos y digitales (sucursales, ATM's, banca digital, contact center, atención remota), garantizando altos niveles de servicio al Cliente.",
                        "productoFinal": "Ejecución de la estrategia comercial del Banco."
                    },
                    {
                        "orden": 2,
                        "tipo": "Genérica",
                        "descripcion": "Diseñar y ejecutar la estrategia multicanal del Banco. Establecer lineamientos estratégicos para la evolución de los canales físicos y digitales (sucursales, ATM's, banca digital, contact center, atención remota), garantizando su coherencia y complementariedad.",
                        "productoFinal": "Estrategia multicanal del Banco diseñada y ejecutada."
                    },
                    {
                        "orden": 3,
                        "tipo": "Genérica",
                        "descripcion": "Monitorear el uso, la cobertura y la eficiencia de los canales. Supervisar el desempeño operativo, la utilización por segmento, el costo unitario y la productividad de cada canal, proponiendo ajustes de red, mejoras tecnológicas y acciones de optimización.",
                        "productoFinal": "Uso, cobertura y eficiencia de los canales monitoreados."
                    },
                    {
                        "orden": 4,
                        "tipo": "Genérica",
                        "descripcion": "Impulsar la transformación digital de la relación cliente-canal. Promover la migración hacia canales digitales, el autoservicio y la automatización de procesos clave, mejorando la experiencia cliente sin perder inclusión ni cobertura territorial.",
                        "productoFinal": "Transformación digital de la relación cliente-canal impulsada."
                    },
                    {
                        "orden": 5,
                        "tipo": "Genérica",
                        "descripcion": "Asegurar una experiencia cliente homogénea y centrada en el usuario. Diseñar e implementar journeys multicanal integrados, asegurar consistencia de atención, tiempos de respuesta, tono de comunicación y resolución efectiva en cada punto de contacto.",
                        "productoFinal": "Experiencia cliente homogénea y centrada en el usuario."
                    },
                    {
                        "orden": 6,
                        "tipo": "Genérica",
                        "descripcion": "Coordinar el relacionamiento operativo con proveedores de canales y plataformas. Supervisar contratos, SLA, seguridad, mantenimiento y evolución tecnológica de plataformas asociadas a la operación de canales (home banking, app, ATM's, centrales telefónicas, etc.).",
                        "productoFinal": "Relacionamiento operativo con proveedores coordinado."
                    },
                    
                    // FUNCIONES ESPECÍFICAS (7) con porcentajes corregidos según MD
                    {
                        "orden": 1,
                        "tipo": "Específica",
                        "descripcion": "Ejecución del plan comercial. Liderar la ejecución del plan comercial maximizando la performance y productividades de los recursos apalancándose en una estrategia multicanal coordinada, con foco en la experiencia uniforme del Cliente.",
                        "productoFinal": "Ejecución del plan comercial implementada.",
                        "porcentajeDedicacion": 20
                    },
                    {
                        "orden": 2,
                        "tipo": "Específica",
                        "descripcion": "Planificación y evolución de la red de sucursales. Definir criterios de apertura, cierre, relocalización o reconversión de sucursales, en función de la demanda, la rentabilidad y la estrategia de cobertura. Supervisar layout, recursos humanos, flujos operativos y niveles de servicio por canal físico.",
                        "productoFinal": "Planificación y evolución de la red de sucursales implementada.",
                        "porcentajeDedicacion": 20
                    },
                    {
                        "orden": 3,
                        "tipo": "Específica",
                        "descripcion": "Gestión de banca digital y autoservicio. Coordinar la evolución funcional del home banking, la app móvil, la banca empresas y los canales digitales de gestión no presencial. Priorizar funcionalidades, experiencias y soporte técnico al cliente. Aumentar la penetración digital y promover el uso activo de canales.",
                        "productoFinal": "Gestión de banca digital y autoservicio implementada.",
                        "porcentajeDedicacion": 20
                    },
                    {
                        "orden": 4,
                        "tipo": "Específica",
                        "descripcion": "Gestión del contact center y atención remota. Supervisar la atención telefónica, chatbots, asistencia digital, redes sociales y atención remota humana. Establecer protocolos, tiempos de respuesta, resolución en primer contacto y métricas de satisfacción.",
                        "productoFinal": "Gestión del contact center y atención remota implementada.",
                        "porcentajeDedicacion": 20
                    },
                    {
                        "orden": 5,
                        "tipo": "Específica",
                        "descripcion": "Diseño y mejora de journeys multicanal. Colaborar en el diseño de recorridos (onboarding, solicitud de productos, reclamos, recupero de claves, etc.) asegurando fluidez, facilidad y consistencia. Identificar puntos de fricción y liderar mejoras en coordinación con Tecnología, Productos y Segmentos.",
                        "productoFinal": "Diseño y mejora de journeys multicanal.",
                        "porcentajeDedicacion": 15
                    },
                    {
                        "orden": 6,
                        "tipo": "Específica",
                        "descripcion": "Análisis de cobertura y eficiencia operativa. Monitorear distribución geográfica, disponibilidad de canales, relación costo/uso, tiempos de atención y satisfacción por canal. Implementar planes de mejora o migración de operaciones presenciales hacia canales más eficientes.",
                        "productoFinal": "Análisis de cobertura y eficiencia operativa.",
                        "porcentajeDedicacion": 5
                    },
                    {
                        "orden": 7,
                        "tipo": "Específica",
                        "descripcion": "Seguridad, accesibilidad y cumplimiento normativo. Garantizar que todos los canales cumplan con las regulaciones del BCRA, normas de accesibilidad digital y física, y estándares de ciberseguridad y privacidad.",
                        "productoFinal": "Seguridad, accesibilidad y cumplimiento normativo.",
                        "porcentajeDedicacion": 5
                    },
                    
                    // INDICADORES (8) basados en el JSON actual
                    {
                        "orden": 1,
                        "tipo": "Indicador",
                        "descripcion": "Porcentaje de cumplimiento de objetivos por canal."
                    },
                    {
                        "orden": 2,
                        "tipo": "Indicador",
                        "descripcion": "Tasa de adopción de nuevos canales."
                    },
                    {
                        "orden": 3,
                        "tipo": "Indicador",
                        "descripcion": "ROI de los canales por tipo."
                    },
                    {
                        "orden": 4,
                        "tipo": "Indicador",
                        "descripcion": "Satisfacción del cliente con los canales."
                    },
                    {
                        "orden": 5,
                        "tipo": "Indicador",
                        "descripcion": "Tiempo promedio de implementación de nuevos canales."
                    },
                    {
                        "orden": 6,
                        "tipo": "Indicador",
                        "descripcion": "Número de canales operativos vs. planificados."
                    },
                    {
                        "orden": 7,
                        "tipo": "Indicador",
                        "descripcion": "Tasa de retención de clientes por canal."
                    },
                    {
                        "orden": 8,
                        "tipo": "Indicador",
                        "descripcion": "Impacto de los canales en el negocio."
                    }
                ];
                
                console.log('✅ Canales actualizado con éxito');
                return true;
            }
            
            if (nodo.children && nodo.children.length > 0) {
                if (buscarYActualizarCanales(nodo.children)) {
                    return true;
                }
            }
        }
        return false;
    }
    
    return buscarYActualizarCanales(jsonData.hierarchy.tree);
}

// Ejecutar la actualización
console.log('🔄 Iniciando actualización de Canales desde MD...');

if (actualizarCanales()) {
    // Actualizar metadata
    jsonData.metadata.lastUpdate = new Date().toISOString();
    jsonData.metadata.lastModified = new Date().toISOString();
    jsonData.metadata.notes += "\n- Actualizada unidad Canales con funciones completas del MD\n- Corregidos porcentajes de dedicación (100% en específicas)\n- Eliminadas 5 funciones extra que no estaban en MD\n- Agregada función 'Asegurar experiencia homogénea'\n- Incluidos 8 indicadores relevantes";
    
    // Guardar el archivo actualizado
    const outputPath = 'organigrama_bna_2025-07-30-10.json';
    fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2));
    
    console.log('✅ Archivo guardado como:', outputPath);
    console.log('📊 Resumen de cambios:');
    console.log('   - 6 funciones genéricas (sin cambios)');
    console.log('   - 7 funciones específicas (antes 12)');
    console.log('   - 8 indicadores (sin cambios)');
    console.log('   - Porcentajes corregidos: 20%, 20%, 20%, 20%, 15%, 5%, 5%');
    console.log('   - Eliminadas 5 funciones extra del JSON');
} else {
    console.log('❌ No se encontró la unidad Canales');
} 