// Script para agregar unidades principales faltantes al JSON
const fs = require('fs');

function agregarUnidadesFaltantes() {
    try {
        // Leer el JSON actual
        const jsonContent = fs.readFileSync('estructura_organizativa_completa.json', 'utf8');
        const json = JSON.parse(jsonContent);
        
        console.log('=== AGREGANDO UNIDADES PRINCIPALES FALTANTES ===\n');
        
        // Definir las unidades principales faltantes
        const unidadesFaltantes = [
            {
                key: "Gerencia de Productos Financieros|SGP Clientes",
                nombre: "Gerencia de Productos Financieros",
                reportaA: "SGP Clientes",
                mision: "Diseñar, desarrollar, gestionar y evolucionar el portafolio de productos crediticios del Banco, asegurando su alineación con las necesidades de los distintos segmentos de clientes, la sostenibilidad financiera, el cumplimiento normativo y la eficiencia operativa. Promover productos activos accesibles, competitivos, digitalizados y con impacto productivo y social.",
                children: [
                    {
                        key: "Activos|Gerencia de Productos Financieros",
                        nombre: "Activos",
                        reportaA: "Gerencia de Productos Financieros",
                        mision: "Diseñar, desarrollar, gestionar y evolucionar el portafolio de productos crediticios del Banco, asegurando su alineación con las necesidades de los distintos segmentos de clientes, la sostenibilidad financiera, el cumplimiento normativo y la eficiencia operativa. Promover productos activos accesibles, competitivos, digitalizados y con impacto productivo y social.",
                        funciones: []
                    },
                    {
                        key: "Pasivos|Gerencia de Productos Financieros",
                        nombre: "Pasivos",
                        reportaA: "Gerencia de Productos Financieros",
                        mision: "Diseñar, gestionar y optimizar el portafolio de productos pasivos del Banco, incluyendo cuentas, cajas de ahorro, cuentas sueldo y plazos fijos, asegurando su competitividad, eficiencia operativa, simplicidad funcional, cumplimiento regulatorio y alineación con la estrategia de captación, vinculación y rentabilidad institucional.",
                        funciones: []
                    },
                    {
                        key: "Banca Digital|Gerencia de Productos Financieros",
                        nombre: "Banca Digital",
                        reportaA: "Gerencia de Productos Financieros",
                        mision: "Liderar la transformación digital de los productos financieros, desarrollando soluciones innovadoras y canales digitales que mejoren la experiencia del cliente.",
                        funciones: []
                    },
                    {
                        key: "Regionales|Gerencia de Productos Financieros",
                        nombre: "Regionales",
                        reportaA: "Gerencia de Productos Financieros",
                        mision: "Coordinar la gestión de productos financieros a nivel regional, adaptando la oferta a las necesidades específicas de cada zona.",
                        funciones: []
                    }
                ]
            },
            {
                key: "Gerencia de Medios de Pago|SGP Clientes",
                nombre: "Gerencia de Medios de Pago",
                reportaA: "SGP Clientes",
                mision: "Diseñar, coordinar y desarrollar el portafolio de productos de inversión del Banco para personas y empresas, asegurando una oferta competitiva, segura, diversificada y accesible, en línea con los perfiles de riesgo, los objetivos financieros de los clientes y el marco regulatorio vigente. Promover la educación financiera, la planificación del ahorro y la fidelización a través de soluciones de inversión simples y confiables.",
                children: [
                    {
                        key: "Inversiones|Gerencia de Medios de Pago",
                        nombre: "Inversiones",
                        reportaA: "Gerencia de Medios de Pago",
                        mision: "Diseñar, coordinar y desarrollar el portafolio de productos de inversión del Banco para personas y empresas, asegurando una oferta competitiva, segura, diversificada y accesible, en línea con los perfiles de riesgo, los objetivos financieros de los clientes y el marco regulatorio vigente. Promover la educación financiera, la planificación del ahorro y la fidelización a través de soluciones de inversión simples y confiables.",
                        funciones: []
                    },
                    {
                        key: "Seguros|Gerencia de Medios de Pago",
                        nombre: "Seguros",
                        reportaA: "Gerencia de Medios de Pago",
                        mision: "Diseñar, desarrollar y coordinar la oferta de productos de seguros comercializados a través del Banco, en alianza con aseguradoras, promoviendo soluciones de protección accesibles, simples y alineadas con los perfiles y necesidades de los distintos segmentos de clientes. Maximizar el valor agregado del canal bancario como plataforma de distribución de seguros, impulsando la vinculación, la diversificación de ingresos y la fidelización.",
                        funciones: []
                    },
                    {
                        key: "Mantenimiento y Features de Medios de Pago|Gerencia de Medios de Pago",
                        nombre: "Mantenimiento y Features de Medios de Pago",
                        reportaA: "Gerencia de Medios de Pago",
                        mision: "Administrar, mantener y evolucionar funcionalmente el portafolio vigente de productos de medios de pago del Banco (tarjetas de débito, crédito, prepagas y soluciones de pagos electrónicos), garantizando su disponibilidad operativa, cumplimiento normativo, estabilidad técnica y adecuación a las necesidades de los clientes y a la estrategia comercial.",
                        funciones: []
                    },
                    {
                        key: "Desarrollo de Medios de Pago|Gerencia de Medios de Pago",
                        nombre: "Desarrollo de Medios de Pago",
                        reportaA: "Gerencia de Medios de Pago",
                        mision: "Diseñar, evolucionar y desarrollar nuevos productos, funcionalidades y servicios dentro del ecosistema de medios de pago del Banco, alineados a las tendencias del mercado, los cambios tecnológicos, las regulaciones vigentes y las necesidades de los distintos segmentos de clientes. Promover la innovación, la interoperabilidad y la adopción digital como eje estratégico del desarrollo comercial.",
                        funciones: []
                    },
                    {
                        key: "Adquirencia|Gerencia de Medios de Pago",
                        nombre: "Adquirencia",
                        reportaA: "Gerencia de Medios de Pago",
                        mision: "Diseñar, desarrollar y gestionar el negocio de Adquirencia del Banco, incluyendo la oferta de terminales físicas y virtuales, QR interoperable, soluciones de cobro y relacionamiento con comercios, promoviendo la inclusión digital, la competitividad, la eficiencia operativa y la generación de ingresos por transaccionalidad.",
                        funciones: []
                    },
                    {
                        key: "Recaudaciones|Gerencia de Medios de Pago",
                        nombre: "Recaudaciones",
                        reportaA: "Gerencia de Medios de Pago",
                        mision: "Diseñar, administrar y desarrollar soluciones de recaudación y cobranzas para empresas, sector público y organizaciones, promoviendo la eficiencia operativa, la trazabilidad, la digitalización y la integración multicanal, posicionando al Banco como socio estratégico en la gestión integral de ingresos y pagos masivos.",
                        funciones: []
                    }
                ]
            },
            {
                key: "Gerencia de Clientes|SGP Clientes",
                nombre: "Gerencia de Clientes",
                reportaA: "SGP Clientes",
                mision: "Gestionar integralmente la experiencia del cliente, desarrollando estrategias de atención, canales de servicio, marketing digital y gestión comercial que promuevan la satisfacción, fidelización y desarrollo de los clientes del Banco.",
                children: [
                    {
                        key: "Coordinación del Negocio|Gerencia de Clientes",
                        nombre: "Coordinación del Negocio",
                        reportaA: "Gerencia de Clientes",
                        mision: "Coordinar la estrategia integral del negocio, asegurando alineación entre todas las áreas y optimización de recursos.",
                        funciones: []
                    },
                    {
                        key: "Negocio y Datos|Gerencia de Clientes",
                        nombre: "Negocio y Datos",
                        reportaA: "Gerencia de Clientes",
                        mision: "Gestionar la estrategia de datos del negocio, desarrollando análisis y insights que impulsen la toma de decisiones basada en datos.",
                        funciones: []
                    },
                    {
                        key: "Alianzas y Patrocinios|Gerencia de Clientes",
                        nombre: "Alianzas y Patrocinios",
                        reportaA: "Gerencia de Clientes",
                        mision: "Desarrollar alianzas estratégicas y programas de patrocinio que fortalezcan el posicionamiento del Banco.",
                        funciones: []
                    },
                    {
                        key: "Branding y Comunicaciones|Gerencia de Clientes",
                        nombre: "Branding y Comunicaciones",
                        reportaA: "Gerencia de Clientes",
                        mision: "Gestionar la marca y las comunicaciones institucionales, asegurando coherencia y efectividad en todos los canales.",
                        funciones: []
                    },
                    {
                        key: "Marketing y Banca Digital|Gerencia de Clientes",
                        nombre: "Marketing y Banca Digital",
                        reportaA: "Gerencia de Clientes",
                        mision: "Desarrollar estrategias de marketing digital y gestión de canales digitales, impulsando la transformación digital del Banco.",
                        funciones: []
                    },
                    {
                        key: "CAC Atención Telefónica|Gerencia de Clientes",
                        nombre: "CAC Atención Telefónica",
                        reportaA: "Gerencia de Clientes",
                        mision: "Gestionar el Centro de Atención Telefónica, asegurando calidad de servicio y satisfacción del cliente.",
                        funciones: []
                    },
                    {
                        key: "Canales|Gerencia de Clientes",
                        nombre: "Canales",
                        reportaA: "Gerencia de Clientes",
                        mision: "Gestionar todos los canales de atención al cliente, asegurando una experiencia integrada y de calidad.",
                        funciones: []
                    },
                    {
                        key: "Customer Insight|Gerencia de Clientes",
                        nombre: "Customer Insight",
                        reportaA: "Gerencia de Clientes",
                        mision: "Desarrollar insights sobre el comportamiento del cliente, generando conocimiento que impulse la mejora de productos y servicios.",
                        funciones: []
                    },
                    {
                        key: "Digital Marketing|Gerencia de Clientes",
                        nombre: "Digital Marketing",
                        reportaA: "Gerencia de Clientes",
                        mision: "Desarrollar estrategias de marketing digital, optimizando la presencia online y la captación de clientes digitales.",
                        funciones: []
                    },
                    {
                        key: "Experiencia al Cliente|Gerencia de Clientes",
                        nombre: "Experiencia al Cliente",
                        reportaA: "Gerencia de Clientes",
                        mision: "Diseñar y gestionar la experiencia del cliente en todos los puntos de contacto, asegurando satisfacción y fidelización.",
                        funciones: []
                    },
                    {
                        key: "Gestión Operativa Sucursales|Gerencia de Clientes",
                        nombre: "Gestión Operativa Sucursales",
                        reportaA: "Gerencia de Clientes",
                        mision: "Gestionar la operación de sucursales, asegurando eficiencia y calidad de servicio en la red de atención.",
                        funciones: []
                    },
                    {
                        key: "Gestión Comercial|Gerencia de Clientes",
                        nombre: "Gestión Comercial",
                        reportaA: "Gerencia de Clientes",
                        mision: "Gestionar la fuerza comercial y las estrategias de venta, asegurando el cumplimiento de objetivos comerciales.",
                        funciones: []
                    },
                    {
                        key: "Regionales|Gerencia de Clientes",
                        nombre: "Regionales",
                        reportaA: "Gerencia de Clientes",
                        mision: "Coordinar la gestión regional, adaptando estrategias y productos a las necesidades específicas de cada zona.",
                        funciones: []
                    }
                ]
            }
        ];
        
        // Agregar las unidades faltantes al árbol
        if (json.hierarchy && json.hierarchy.tree && json.hierarchy.tree.length > 0) {
            const sgpClientes = json.hierarchy.tree.find(nodo => nodo.nombre === "SGP Clientes");
            if (sgpClientes) {
                if (!sgpClientes.children) {
                    sgpClientes.children = [];
                }
                
                // Agregar las nuevas unidades
                unidadesFaltantes.forEach(unidad => {
                    const existe = sgpClientes.children.find(child => child.nombre === unidad.nombre);
                    if (!existe) {
                        sgpClientes.children.push(unidad);
                        console.log(`✅ Agregada: ${unidad.nombre}`);
                    } else {
                        console.log(`⚠️ Ya existe: ${unidad.nombre}`);
                    }
                });
            }
        }
        
        // Actualizar metadata
        if (json.metadata) {
            json.metadata.totalUnits = json.metadata.totalUnits + unidadesFaltantes.length;
            json.metadata.version = json.metadata.version + "-unidades-agregadas";
            json.metadata.exportDate = new Date().toISOString();
        }
        
        // Guardar el JSON actualizado
        const jsonActualizado = JSON.stringify(json, null, 2);
        fs.writeFileSync('estructura_organizativa_completa.json', jsonActualizado);
        
        console.log('\n✅ Unidades principales agregadas exitosamente');
        console.log(`📊 Total de unidades actualizado: ${json.metadata.totalUnits}`);
        
    } catch (error) {
        console.error('❌ Error al agregar unidades:', error.message);
    }
}

// Ejecutar el script
agregarUnidadesFaltantes(); 