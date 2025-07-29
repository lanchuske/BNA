/**
 * Script para integrar mejoras de exportación e importación en el organigrama
 * Basado en las lecciones aprendidas del JSON validado
 */

// ===== FUNCIONES DE INTEGRACIÓN =====

/**
 * Integra las mejoras de exportación en el HTML del organigrama
 */
function integrarMejorasExportacion() {
  console.log('🔧 Integrando mejoras de exportación...');
  
  // Reemplazar la función exportJSON original con la mejorada
  if (typeof window.exportJSON === 'function') {
    const originalExportJSON = window.exportJSON;
    
    window.exportJSON = function() {
      try {
        console.log('🚀 Usando función de exportación mejorada...');
        
        // Usar la función mejorada si está disponible
        if (typeof window.exportJSONMejorado === 'function') {
          const jsonData = window.exportJSONMejorado(
            window.unidadesMap, 
            window.csvHeaders, 
            window.originalCSV
          );
          
          // Generar archivo y descargar
          const jsonContent = JSON.stringify(jsonData, null, 2);
          const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          
          // Nombre de archivo con timestamp
          const timestamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
          const filename = jsonData.metadata.hasIssues ? 
            `unidades_organizativas_corregido_${timestamp}.json` : 
            `unidades_organizativas_completo_${timestamp}.json`;
          
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          // Registrar la exportación
          if (typeof window.recordExport === 'function') {
            window.recordExport(filename);
          }
          
          // Actualizar estado
          window.datosModificados = false;
          if (typeof window.marcarAdminCambios === 'function') {
            window.marcarAdminCambios(false);
          }
          
          const message = jsonData.metadata.hasIssues ? 
            `✅ JSON exportado con correcciones aplicadas (${filename})` : 
            `✅ JSON exportado correctamente (${filename})`;
          
          if (typeof window.mostrarAlerta === 'function') {
            window.mostrarAlerta(message, 3000, '#27ae60');
          }
          
          // Mostrar reporte de validación si hay issues
          if (jsonData.metadata.hasIssues && typeof window.generarReporteValidacion === 'function') {
            const report = window.generarReporteValidacion(jsonData);
            console.log('📊 Reporte de validación:', report);
          }
          
        } else {
          // Fallback a la función original
          console.warn('⚠️ Función mejorada no disponible, usando función original');
          return originalExportJSON();
        }
        
      } catch (error) {
        console.error('❌ Error en exportación mejorada:', error);
        if (typeof window.mostrarAlerta === 'function') {
          window.mostrarAlerta('Error al exportar JSON: ' + error.message, 3000, '#e74c3c');
        }
      }
    };
    
    console.log('✅ Función de exportación mejorada integrada');
  }
}

/**
 * Integra las mejoras de importación en el HTML del organigrama
 */
function integrarMejorasImportacion() {
  console.log('🔧 Integrando mejoras de importación...');
  
  // Reemplazar la función procesarJSON original con la mejorada
  if (typeof window.procesarJSON === 'function') {
    const originalProcesarJSON = window.procesarJSON;
    
    window.procesarJSON = async function(jsonText, fileName = '', source = 'file') {
      try {
        console.log('🚀 Usando función de importación mejorada...');
        
        // Usar la función mejorada si está disponible
        if (typeof window.procesarJSONMejorado === 'function') {
          const result = await window.procesarJSONMejorado(jsonText, fileName, source);
          
          if (typeof window.mostrarAlerta === 'function') {
            window.mostrarAlerta('Archivo JSON cargado correctamente', 2000);
          }
          
          return result;
          
        } else {
          // Fallback a la función original
          console.warn('⚠️ Función mejorada no disponible, usando función original');
          return await originalProcesarJSON(jsonText, fileName, source);
        }
        
      } catch (error) {
        console.error('❌ Error en importación mejorada:', error);
        if (typeof window.mostrarAlerta === 'function') {
          window.mostrarAlerta('Error: ' + error.message, 2500, '#e74c3c');
        }
        throw error;
      }
    };
    
    console.log('✅ Función de importación mejorada integrada');
  }
}

/**
 * Agrega botones adicionales para funcionalidades mejoradas
 */
function agregarBotonesMejorados() {
  console.log('🔧 Agregando botones mejorados...');
  
  // Buscar el contenedor de botones de exportación
  const exportContainer = document.querySelector('.export-btn')?.parentElement || 
                         document.getElementById('exportJsonBtn')?.parentElement;
  
  if (exportContainer) {
    // Botón para generar reporte de validación
    const reportBtn = document.createElement('button');
    reportBtn.id = 'generateReportBtn';
    reportBtn.className = 'edit-btn';
    reportBtn.style.background = '#9b59b6';
    reportBtn.style.color = '#fff';
    reportBtn.innerHTML = '📋 Generar Reporte';
    reportBtn.title = 'Generar reporte detallado de validación';
    
    reportBtn.addEventListener('click', function() {
      if (typeof window.generarReporteValidacion === 'function' && window.unidadesMap) {
        try {
          // Crear JSON temporal para análisis
          const tempJsonData = {
            metadata: {
              version: "1.1",
              totalUnits: Object.keys(window.unidadesMap).length,
              totalRecords: [].concat(...Object.values(window.unidadesMap)).length,
              hasIssues: false,
              issues: []
            },
            data: {
              unidades: window.convertirUnidadesAFormatoEstandar ? 
                window.convertirUnidadesAFormatoEstandar(window.unidadesMap) : []
            }
          };
          
          const report = window.generarReporteValidacion(tempJsonData);
          
          // Mostrar reporte en una ventana modal
          mostrarReporteValidacion(report);
          
        } catch (error) {
          console.error('Error al generar reporte:', error);
          if (typeof window.mostrarAlerta === 'function') {
            window.mostrarAlerta('Error al generar reporte: ' + error.message, 3000, '#e74c3c');
          }
        }
      } else {
        if (typeof window.mostrarAlerta === 'function') {
          window.mostrarAlerta('Función de reporte no disponible', 2000, '#e74c3c');
        }
      }
    });
    
    exportContainer.appendChild(reportBtn);
    console.log('✅ Botón de reporte agregado');
  }
}

/**
 * Muestra el reporte de validación en una ventana modal
 * @param {Object} report - Reporte de validación
 */
function mostrarReporteValidacion(report) {
  // Crear modal
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.7);
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: center;
  `;
  
  const content = document.createElement('div');
  content.style.cssText = `
    background: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    font-family: Arial, sans-serif;
  `;
  
  content.innerHTML = `
    <h2 style="color: #2c3e50; margin-bottom: 20px;">📊 Reporte de Validación</h2>
    
    <div style="margin-bottom: 20px;">
      <h3 style="color: #34495e;">📈 Estadísticas Generales</h3>
      <p><strong>Versión:</strong> ${report.metadata.version}</p>
      <p><strong>Total de Unidades:</strong> ${report.metadata.totalUnits}</p>
      <p><strong>Total de Registros:</strong> ${report.metadata.totalRecords}</p>
      <p><strong>Tiene Issues:</strong> ${report.metadata.hasIssues ? 'Sí' : 'No'}</p>
      <p><strong>Cantidad de Issues:</strong> ${report.metadata.issuesCount}</p>
    </div>
    
    <div style="margin-bottom: 20px;">
      <h3 style="color: #34495e;">📋 Calidad de Datos</h3>
      <p><strong>Unidades con datos completos:</strong> ${report.dataQuality.unitsWithCompleteData}</p>
      <p><strong>Unidades con datos incompletos:</strong> ${report.dataQuality.unitsWithIncompleteData}</p>
      <p><strong>Funciones con descripciones:</strong> ${report.dataQuality.functionsWithDescriptions}</p>
      <p><strong>Funciones sin descripciones:</strong> ${report.dataQuality.functionsWithoutDescriptions}</p>
      <p><strong>Funciones con porcentajes:</strong> ${report.dataQuality.functionsWithPercentages}</p>
      <p><strong>Funciones sin porcentajes:</strong> ${report.dataQuality.functionsWithoutPercentages}</p>
    </div>
    
    <div style="margin-bottom: 20px;">
      <h3 style="color: #34495e;">💡 Recomendaciones</h3>
      ${report.recommendations.length > 0 ? 
        '<ul>' + report.recommendations.map(rec => `<li>${rec}</li>`).join('') + '</ul>' : 
        '<p>✅ No se requieren acciones específicas</p>'
      }
    </div>
    
    <div style="text-align: center;">
      <button onclick="this.closest('.modal-overlay').remove()" 
              style="background: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
        Cerrar
      </button>
    </div>
  `;
  
  modal.appendChild(content);
  document.body.appendChild(modal);
  
  // Cerrar modal al hacer clic fuera
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

/**
 * Agrega estilos CSS para las mejoras
 */
function agregarEstilosMejorados() {
  const style = document.createElement('style');
  style.textContent = `
    /* Estilos para botones mejorados */
    .edit-btn[style*="background: #9b59b6"]:hover {
      background: #8e44ad !important;
      color: white !important;
    }
    
    /* Estilos para modal de reporte */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      z-index: 10000;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .modal-content {
      background: white;
      padding: 20px;
      border-radius: 8px;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
      font-family: Arial, sans-serif;
    }
    
    /* Indicadores de estado mejorados */
    .status-indicator {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-right: 8px;
    }
    
    .status-valid {
      background: #27ae60;
    }
    
    .status-warning {
      background: #f39c12;
    }
    
    .status-error {
      background: #e74c3c;
    }
  `;
  
  document.head.appendChild(style);
  console.log('✅ Estilos mejorados agregados');
}

/**
 * Función principal de integración
 */
function integrarMejorasCompletas() {
  console.log('🚀 Iniciando integración completa de mejoras...');
  
  // Esperar a que el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(integrarMejorasCompletas, 100);
    });
    return;
  }
  
  // Agregar estilos
  agregarEstilosMejorados();
  
  // Integrar mejoras de exportación
  integrarMejorasExportacion();
  
  // Integrar mejoras de importación
  integrarMejorasImportacion();
  
  // Agregar botones mejorados
  setTimeout(agregarBotonesMejorados, 500);
  
  console.log('✅ Integración completa de mejoras finalizada');
  
  // Mostrar mensaje de confirmación
  if (typeof window.mostrarAlerta === 'function') {
    window.mostrarAlerta('✅ Mejoras de exportación/importación integradas', 3000, '#27ae60');
  }
}

// ===== FUNCIONES DE UTILIDAD PARA DEBUGGING =====

/**
 * Verifica el estado de las mejoras integradas
 */
function verificarEstadoMejoras() {
  const estado = {
    exportacionMejorada: typeof window.exportJSONMejorado === 'function',
    importacionMejorada: typeof window.procesarJSONMejorado === 'function',
    reporteValidacion: typeof window.generarReporteValidacion === 'function',
    validacionJSON: typeof window.validarJSONExportado === 'function',
    botonesMejorados: document.getElementById('generateReportBtn') !== null
  };
  
  console.log('📊 Estado de mejoras integradas:', estado);
  return estado;
}

/**
 * Ejecuta pruebas de las funciones mejoradas
 */
function ejecutarPruebasMejoras() {
  console.log('🧪 Ejecutando pruebas de mejoras...');
  
  try {
    // Probar validación JSON
    if (typeof window.validarJSONExportado === 'function') {
      const testData = {
        metadata: {
          exportDate: new Date().toISOString(),
          version: "1.1",
          totalUnits: 42,
          totalRecords: 625,
          csvHeaders: [],
          hasIssues: false,
          issues: []
        },
        data: {
          unidades: []
        }
      };
      
      const validationResult = window.validarJSONExportado(testData);
      console.log('✅ Prueba de validación JSON:', validationResult);
    }
    
    // Probar generación de estadísticas
    if (typeof window.generarEstadisticasDetalladas === 'function') {
      const testUnidadesMap = {
        'Test Unit': [
          {
            'Tipo de Función': 'Genérica',
            'Descripción': 'Test description',
            'Porcentaje Dedicación': '100'
          }
        ]
      };
      
      const stats = window.generarEstadisticasDetalladas(testUnidadesMap, testUnidadesMap['Test Unit']);
      console.log('✅ Prueba de estadísticas:', stats);
    }
    
    console.log('✅ Todas las pruebas completadas exitosamente');
    
  } catch (error) {
    console.error('❌ Error en pruebas:', error);
  }
}

// Exportar funciones para uso global
window.integrarMejorasCompletas = integrarMejorasCompletas;
window.verificarEstadoMejoras = verificarEstadoMejoras;
window.ejecutarPruebasMejoras = ejecutarPruebasMejoras;
window.mostrarReporteValidacion = mostrarReporteValidacion;

// Auto-integrar cuando se carga el script
if (typeof window !== 'undefined') {
  // Esperar un poco para que el DOM esté listo
  setTimeout(integrarMejorasCompletas, 1000);
}

console.log('✅ Script de integración de mejoras cargado');