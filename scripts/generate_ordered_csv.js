// Script para generar CSV con orden personalizado
// Basado en los datos actuales y el orden del localStorage

const fs = require('fs');
const path = require('path');

// Función para leer el archivo CSV original
function readOriginalCSV() {
    const csvPath = path.join(__dirname, '../CSV/unidades_organizativas_corregido_2025-07-28-19-41.csv');
    const content = fs.readFileSync(csvPath, 'utf8');
    return content;
}

// Función para agregar columna de orden
function addOrderColumn(csvContent) {
    const lines = csvContent.split('\n');
    const header = lines[0];
    
    // Agregar columna de orden al header
    const newHeader = header + ';Orden Personalizado';
    
    // Orden personalizado basado en la estructura actual
    const customOrder = [
        'Gerencia General',
        'SG Riesgo Crediticio',
        'Sgp Clientes',
        'SGP Sistemas, Tecnologías y Servicios de IT',
        'Sgp Negocio',
        'Segmento Personas',
        'Estrategia Comercial Y Propuesta De Valor Personas',
        'Head De Segmentos Personas',
        'Inteligencia Comercial Personas',
        'Comunicaciones Y Eventos Personas',
        'Segmento Empresas',
        'Estrategia Comercial Y Propuesta De Valor',
        'Head De Segmentos',
        'Inteligencia Comercial',
        'Comunicaciones Y Eventos',
        'Productos',
        'Activos',
        'Canales',
        'Banca Digital',
        'Coordinación Del Negocio Y Datos',
        'Coordinación Del Negocio',
        'Data Personas',
        'Data Empresas'
    ];
    
    // Crear mapa de orden
    const orderMap = {};
    customOrder.forEach((unit, index) => {
        orderMap[unit] = index + 1;
    });
    
    // Procesar cada línea
    const newLines = [newHeader];
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim()) {
            const columns = line.split(';');
            const unitName = columns[0]; // Primera columna es la unidad organizativa
            const order = orderMap[unitName] || 999; // 999 para unidades no encontradas
            newLines.push(line + ';' + order);
        }
    }
    
    return newLines.join('\n');
}

// Función principal
function generateOrderedCSV() {
    try {
        console.log('Leyendo archivo CSV original...');
        const originalContent = readOriginalCSV();
        
        console.log('Agregando columna de orden personalizado...');
        const orderedContent = addOrderColumn(originalContent);
        
        // Guardar archivo con orden
        const outputPath = path.join(__dirname, '../CSV/unidades_organizativas_con_orden_2025-01-28.csv');
        fs.writeFileSync(outputPath, orderedContent, 'utf8');
        
        console.log('✅ Archivo CSV con orden generado exitosamente:');
        console.log('📁 Archivo:', outputPath);
        console.log('📊 Líneas procesadas:', orderedContent.split('\n').length - 1);
        
        // Mostrar estadísticas
        const lines = orderedContent.split('\n');
        const header = lines[0];
        const dataLines = lines.slice(1).filter(line => line.trim());
        
        console.log('\n📈 Estadísticas:');
        console.log('- Columnas en header:', header.split(';').length);
        console.log('- Líneas de datos:', dataLines.length);
        
        // Mostrar primeras 5 líneas como ejemplo
        console.log('\n📋 Primeras 5 líneas (ejemplo):');
        console.log(header);
        dataLines.slice(0, 5).forEach(line => {
            console.log(line);
        });
        
    } catch (error) {
        console.error('❌ Error generando CSV con orden:', error.message);
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    generateOrderedCSV();
}

module.exports = { generateOrderedCSV }; 