/**
 * Mejoras para Exportación e Importación del Organigrama Interactivo
 * Basado en las lecciones aprendidas del JSON validado
 */

// ===== MEJORAS PARA EXPORTACIÓN =====

/**
 * Función mejorada de exportación JSON con validación previa
 * @param {Object} unidadesMap - Mapa de unidades organizativas
 * @param {Array} csvHeaders - Headers del CSV original
 * @param {string} originalCSV - CSV original
 * @returns {Object} JSON estructurado con metadata completa
 */
function exportJSONMejorado(unidadesMap, csvHeaders, originalCSV) {
  try {
    console.log('🔍 Iniciando exportación JSON mejorada...');
    
    // 1. VALIDACIÓN PREVIA DE DATOS
    const allData = [].concat(...Object.values(unidadesMap));
    const issues = validateDataIntegrity(allData);
    
    // 2. GENERAR ESTADÍSTICAS DETALLADAS
    const stats = generarEstadisticasDetalladas(unidadesMap, allData);
    
    // 3. CREAR ESTRUCTURA JSON MEJORADA
    const jsonData = {
      metadata: {
        exportDate: new Date().toISOString(),
        version: "1.1", // Versión mejorada
        totalUnits: stats.totalUnits,
        totalRecords: stats.totalRecords,
        totalFunctions: stats.totalFunctions,
        csvHeaders: csvHeaders,
        csvFileName: originalCSV ? originalCSV.split('/').pop() : 'unknown.csv',
        lastExportInfo: JSON.stringify({
          fileName: `unidades_organizativas_completo_${new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-')}.json`,
          timestamp: new Date().toISOString()
        }),
        hasIssues: issues.length > 0,
        issues: issues,
        statistics: stats,
        datosModificados: window.datosModificados || false,
        expandedNodes: window.expandedNodes || {},
        lastSelected: window.lastSelected || "",
        validationInfo: {
          validated: issues.length === 0,
          validationDate: new Date().toISOString(),
          criticalIssues: issues.filter(i => i.type === 'error').length,
          warnings: issues.filter(i => i.type === 'warning').length
        }
      },
      data: {
        unidades: convertirUnidadesAFormatoEstandar(unidadesMap)
      }
    };
    
    // 4. VALIDACIÓN POST-EXPORTACIÓN
    const validationResult = validarJSONExportado(jsonData);
    if (!validationResult.isValid) {
      console.warn('⚠️ Advertencias en JSON exportado:', validationResult.warnings);
    }
    
    console.log('✅ Exportación JSON mejorada completada');
    return jsonData;
    
  } catch (error) {
    console.error('❌ Error en exportación JSON mejorada:', error);
    throw error;
  }
}

/**
 * Genera estadísticas detalladas del contenido
 * @param {Object} unidadesMap - Mapa de unidades
 * @param {Array} allData - Todos los datos
 * @returns {Object} Estadísticas detalladas
 */
function generarEstadisticasDetalladas(unidadesMap, allData) {
  const stats = {
    totalUnits: Object.keys(unidadesMap).length,
    totalRecords: allData.length,
    totalFunctions: 0,
    functionTypes: {},
    hierarchyLevels: {},
    dataQuality: {
      completeDescriptions: 0,
      incompleteDescriptions: 0,
      completePercentages: 0,
      incompletePercentages: 0
    }
  };
  
  // Contar funciones por tipo y calidad
  allData.forEach(record => {
    const functionType = record['Tipo de Función'] || 'Genérica';
    stats.functionTypes[functionType] = (stats.functionTypes[functionType] || 0) + 1;
    stats.totalFunctions++;
    
    // Calidad de descripciones
    const hasDescription = record['Descripción'] && record['Descripción'].trim() !== '';
    if (hasDescription) {
      stats.dataQuality.completeDescriptions++;
    } else {
      stats.dataQuality.incompleteDescriptions++;
    }
    
    // Calidad de porcentajes
    const hasPercentage = record['Porcentaje Dedicación'] && record['Porcentaje Dedicación'].trim() !== '';
    if (hasPercentage) {
      stats.dataQuality.completePercentages++;
    } else {
      stats.dataQuality.incompletePercentages++;
    }
    
    // Niveles jerárquicos
    const level = record['Nivel Jerárquico Calculado'] || 'N/A';
    stats.hierarchyLevels[level] = (stats.hierarchyLevels[level] || 0) + 1;
  });
  
  return stats;
}

/**
 * Convierte unidades a formato estándar
 * @param {Object} unidadesMap - Mapa de unidades
 * @returns {Array} Array de unidades en formato estándar
 */
function convertirUnidadesAFormatoEstandar(unidadesMap) {
  const unidades = [];
  const unitNames = Object.keys(unidadesMap);
  
  unitNames.forEach(unitName => {
    const unitData = unidadesMap[unitName];
    const funciones = [];
    
    unitData.forEach((func, index) => {
      funciones.push({
        orden: index,
        tipo: func['Tipo de Función'] || 'Genérica',
        descripcion: func['Descripción'] || func['Descripción de la Función'] || '',
        productoFinal: func['Producto Final'] || '',
        porcentajeDedicacion: func['Porcentaje Dedicación'] || '',
        nivelJerarquico: func['Nivel Jerárquico Calculado'] || '',
        jerarquia: func['Jerarquía'] || '',
        reportaA: func['Reporta A'] || '',
        lineaReporte: func['Línea de Reporte'] || '',
        unidadesQueReportan: func['Unidades que Reportan Directamente'] || '',
        responsableGestion: func['Responsable de Gestión de Otras'] || '',
        nivelFuncional: func['Nivel Funcional Esperado'] || '',
        mision: func['Misión'] || '',
        nivelReporte: func['Nivel de Reporte'] || '',
        reportaA2: func['Reporta a'] || '',
        unidadSuperior: func['Unidad Superior'] || '',
        fechaAprobacion: func['Fecha de Aprobación'] || '',
        porcentajeDedicacion2: func['% Dedicación'] || ''
      });
    });
    
    // Obtener la misión de la primera función (si existe)
    const mision = unitData.length > 0 ? (unitData[0]['Misión'] || '') : '';
    
    unidades.push({
      nombre: unitName,
      mision: mision,
      funciones: funciones
    });
  });
  
  return unidades;
}

/**
 * Valida el JSON exportado
 * @param {Object} jsonData - JSON a validar
 * @returns {Object} Resultado de validación
 */
function validarJSONExportado(jsonData) {
  const result = {
    isValid: true,
    warnings: [],
    errors: []
  };
  
  // Validar estructura básica
  if (!jsonData.metadata || !jsonData.data) {
    result.isValid = false;
    result.errors.push('Estructura JSON inválida: faltan secciones metadata o data');
  }
  
  // Validar metadata
  const requiredMetadataFields = [
    'exportDate', 'version', 'totalUnits', 'totalRecords', 
    'csvHeaders', 'hasIssues', 'issues'
  ];
  
  requiredMetadataFields.forEach(field => {
    if (!jsonData.metadata[field]) {
      result.warnings.push(`Campo metadata.${field} está ausente`);
    }
  });
  
  // Validar data
  if (!jsonData.data.unidades || !Array.isArray(jsonData.data.unidades)) {
    result.isValid = false;
    result.errors.push('Sección data.unidades inválida');
  }
  
  // Validar unidades
  if (jsonData.data.unidades) {
    jsonData.data.unidades.forEach((unidad, index) => {
      if (!unidad.nombre || !unidad.funciones) {
        result.warnings.push(`Unidad ${index}: faltan campos obligatorios`);
      }
      
      if (!Array.isArray(unidad.funciones)) {
        result.errors.push(`Unidad ${index}: funciones debe ser un array`);
      }
    });
  }
  
  return result;
}

// ===== MEJORAS PARA IMPORTACIÓN =====

/**
 * Función mejorada para procesar JSON con validación completa
 * @param {string} jsonText - Texto JSON
 * @param {string} fileName - Nombre del archivo
 * @param {string} source - Fuente de datos
 * @returns {Promise<Object>} Resultado del procesamiento
 */
async function procesarJSONMejorado(jsonText, fileName = '', source = 'file') {
  try {
    console.log('🔍 Iniciando procesamiento JSON mejorado...');
    
    // 1. VALIDACIÓN BÁSICA DE SINTAXIS
    let jsonData;
    try {
      jsonData = JSON.parse(jsonText);
    } catch (parseError) {
      throw new Error('El archivo no es un JSON válido: ' + parseError.message);
    }
    
    // 2. VALIDACIÓN DE ESTRUCTURA
    const structureValidation = validarEstructuraJSON(jsonData);
    if (!structureValidation.isValid) {
      throw new Error('Estructura JSON inválida: ' + structureValidation.errors.join(', '));
    }
    
    // 3. VALIDACIÓN DE METADATA
    const metadataValidation = validarMetadataJSON(jsonData.metadata);
    if (metadataValidation.warnings.length > 0) {
      console.warn('⚠️ Advertencias en metadata:', metadataValidation.warnings);
    }
    
    // 4. CONVERSIÓN A FORMATO CSV
    const csvData = convertirJSONaCSVMejorado(jsonData);
    
    // 5. PROCESAMIENTO DE DATOS
    const result = await procesarDatosJSON(jsonData, csvData, fileName, source);
    
    console.log('✅ Procesamiento JSON mejorado completado');
    return result;
    
  } catch (error) {
    console.error('❌ Error en procesamiento JSON mejorado:', error);
    throw error;
  }
}

/**
 * Valida la estructura básica del JSON
 * @param {Object} jsonData - JSON a validar
 * @returns {Object} Resultado de validación
 */
function validarEstructuraJSON(jsonData) {
  const result = {
    isValid: true,
    errors: [],
    warnings: []
  };
  
  // Verificar secciones principales
  if (!jsonData.metadata) {
    result.isValid = false;
    result.errors.push('Falta sección metadata');
  }
  
  if (!jsonData.data) {
    result.isValid = false;
    result.errors.push('Falta sección data');
  }
  
  if (!jsonData.data || !jsonData.data.unidades) {
    result.isValid = false;
    result.errors.push('Falta sección data.unidades');
  }
  
  if (jsonData.data && jsonData.data.unidades && !Array.isArray(jsonData.data.unidades)) {
    result.isValid = false;
    result.errors.push('data.unidades debe ser un array');
  }
  
  return result;
}

/**
 * Valida la metadata del JSON
 * @param {Object} metadata - Metadata a validar
 * @returns {Object} Resultado de validación
 */
function validarMetadataJSON(metadata) {
  const result = {
    isValid: true,
    errors: [],
    warnings: []
  };
  
  // Validar campos obligatorios
  const requiredFields = ['exportDate', 'version', 'totalUnits', 'totalRecords'];
  requiredFields.forEach(field => {
    if (!metadata[field]) {
      result.warnings.push(`Campo metadata.${field} está ausente`);
    }
  });
  
  // Validar fecha de exportación
  if (metadata.exportDate) {
    try {
      new Date(metadata.exportDate);
    } catch (error) {
      result.warnings.push('Formato de fecha de exportación inválido');
    }
  }
  
  // Validar números
  if (metadata.totalUnits && typeof metadata.totalUnits !== 'number') {
    result.warnings.push('totalUnits debe ser un número');
  }
  
  if (metadata.totalRecords && typeof metadata.totalRecords !== 'number') {
    result.warnings.push('totalRecords debe ser un número');
  }
  
  // Validar issues
  if (metadata.issues && !Array.isArray(metadata.issues)) {
    result.warnings.push('issues debe ser un array');
  }
  
  return result;
}

/**
 * Convierte JSON a CSV con mejoras
 * @param {Object} jsonData - JSON a convertir
 * @returns {string} CSV convertido
 */
function convertirJSONaCSVMejorado(jsonData) {
  try {
    const unidades = jsonData.data.unidades;
    if (!unidades || !Array.isArray(unidades)) {
      throw new Error('Formato JSON inválido: se requiere array "unidades"');
    }
    
    // Headers completos basados en el JSON validado
    const headers = [
      'Unidad Organizativa',
      'Reporta A',
      'Jerarquía',
      'Línea de Reporte',
      'Nivel Jerárquico Calculado',
      'Unidades que Reportan Directamente',
      'Responsable de Gestión de Otras',
      'Nivel Funcional Esperado',
      'Misión',
      'Tipo de Función',
      'Descripción',
      'Producto Final',
      'Porcentaje Dedicación',
      'Nivel de Reporte',
      'Reporta a',
      'Unidad Superior',
      'Fecha de Aprobación',
      '% Dedicación'
    ];
    
    const csvRows = [headers.join(';')];
    
    unidades.forEach(unidad => {
      if (unidad.funciones && Array.isArray(unidad.funciones)) {
        unidad.funciones.forEach(funcion => {
          const row = headers.map(header => {
            switch (header) {
              case 'Unidad Organizativa':
                return unidad.nombre || '';
              case 'Misión':
                return unidad.mision || '';
              case 'Tipo de Función':
                return funcion.tipo || '';
              case 'Descripción':
                return funcion.descripcion || '';
              case 'Producto Final':
                return funcion.productoFinal || '';
              case 'Porcentaje Dedicación':
                return funcion.porcentajeDedicacion || '';
              case 'Nivel Jerárquico Calculado':
                return funcion.nivelJerarquico || '';
              case 'Jerarquía':
                return funcion.jerarquia || '';
              case 'Reporta A':
                return funcion.reportaA || '';
              case 'Línea de Reporte':
                return funcion.lineaReporte || '';
              case 'Unidades que Reportan Directamente':
                return funcion.unidadesQueReportan || '';
              case 'Responsable de Gestión de Otras':
                return funcion.responsableGestion || '';
              case 'Nivel Funcional Esperado':
                return funcion.nivelFuncional || '';
              case 'Nivel de Reporte':
                return funcion.nivelReporte || '';
              case 'Reporta a':
                return funcion.reportaA2 || '';
              case 'Unidad Superior':
                return funcion.unidadSuperior || '';
              case 'Fecha de Aprobación':
                return funcion.fechaAprobacion || '';
              case '% Dedicación':
                return funcion.porcentajeDedicacion2 || '';
              default:
                return '';
            }
          });
          csvRows.push(row.join(';'));
        });
      }
    });
    
    return csvRows.join('\n');
    
  } catch (error) {
    console.error('Error en conversión JSON a CSV:', error);
    throw error;
  }
}

/**
 * Procesa los datos JSON convertidos
 * @param {Object} jsonData - JSON original
 * @param {string} csvData - CSV convertido
 * @param {string} fileName - Nombre del archivo
 * @param {string} source - Fuente de datos
 * @returns {Promise<Object>} Resultado del procesamiento
 */
async function procesarDatosJSON(jsonData, csvData, fileName, source) {
  // Guardar datos en localStorage
  localStorage.setItem('csvData', csvData);
  if (fileName) {
    localStorage.setItem('csvFileName', fileName);
  }
  
  // Procesar CSV
  const data = parseCSV(csvData);
  
  // Configurar estado global
  window.originalCSV = csvData;
  window.originalDataBeforeValidation = JSON.parse(JSON.stringify(data));
  window.unidadesMap = groupByUnidad(data);
  window.allUnidades = Object.keys(window.unidadesMap).map(k => window.unidadesMap[k][0]['Unidad Organizativa']);
  window.treeRoots = buildTree(data);
  window.lastSelected = '';
  window.expandedNodes = {};
  window.datosModificados = false;
  
  // Restaurar estado si existe en metadata
  if (jsonData.metadata.expandedNodes) {
    window.expandedNodes = jsonData.metadata.expandedNodes;
  }
  
  if (jsonData.metadata.lastSelected) {
    window.lastSelected = jsonData.metadata.lastSelected;
  }
  
  // Renderizar árbol
  const treeDiv = document.getElementById('tree-container');
  if (treeDiv) {
    treeDiv.innerHTML = '';
    renderTree(window.treeRoots, treeDiv, selectUnidad, window.lastSelected);
  }
  
  // Limpiar contenido de unidad
  const unidadContent = document.getElementById('unidad-content');
  if (unidadContent) {
    unidadContent.innerHTML = '';
  }
  
  // Marcar cambios
  marcarAdminCambios(false);
  
  // Registrar importación
  if (fileName && fileName.trim() !== '') {
    recordImport(fileName, source);
  } else {
    loadFileInfoFromStorage();
  }
  
  // Validación automática
  setTimeout(() => {
    const issues = validateDataIntegrity(data);
    
    if (issues.length > 0) {
      console.log(`Encontrados ${issues.length} problemas de integridad`);
      showValidationInterface(issues);
    } else {
      console.log('✅ No se encontraron problemas de integridad');
      localStorage.setItem('csvValidated', 'true');
      localStorage.setItem('csvLastValidated', new Date().toISOString());
      mostrarAlerta('✅ Datos validados: Sin problemas encontrados', 3000, '#28a745');
    }
  }, 500);
  
  return {
    success: true,
    data: data,
    metadata: jsonData.metadata
  };
}

// ===== FUNCIONES DE UTILIDAD =====

/**
 * Genera un reporte de validación detallado
 * @param {Object} jsonData - JSON a analizar
 * @returns {Object} Reporte de validación
 */
function generarReporteValidacion(jsonData) {
  const report = {
    timestamp: new Date().toISOString(),
    metadata: {
      version: jsonData.metadata?.version || 'unknown',
      totalUnits: jsonData.metadata?.totalUnits || 0,
      totalRecords: jsonData.metadata?.totalRecords || 0,
      hasIssues: jsonData.metadata?.hasIssues || false,
      issuesCount: jsonData.metadata?.issues?.length || 0
    },
    dataQuality: {
      unitsWithCompleteData: 0,
      unitsWithIncompleteData: 0,
      functionsWithDescriptions: 0,
      functionsWithoutDescriptions: 0,
      functionsWithPercentages: 0,
      functionsWithoutPercentages: 0
    },
    recommendations: []
  };
  
  // Analizar calidad de datos
  if (jsonData.data && jsonData.data.unidades) {
    jsonData.data.unidades.forEach(unidad => {
      let hasCompleteData = true;
      
      if (unidad.funciones && Array.isArray(unidad.funciones)) {
        unidad.funciones.forEach(funcion => {
          if (!funcion.descripcion || funcion.descripcion.trim() === '') {
            report.dataQuality.functionsWithoutDescriptions++;
            hasCompleteData = false;
          } else {
            report.dataQuality.functionsWithDescriptions++;
          }
          
          if (!funcion.porcentajeDedicacion || funcion.porcentajeDedicacion.trim() === '') {
            report.dataQuality.functionsWithoutPercentages++;
            hasCompleteData = false;
          } else {
            report.dataQuality.functionsWithPercentages++;
          }
        });
      }
      
      if (hasCompleteData) {
        report.dataQuality.unitsWithCompleteData++;
      } else {
        report.dataQuality.unitsWithIncompleteData++;
      }
    });
  }
  
  // Generar recomendaciones
  if (report.dataQuality.functionsWithoutDescriptions > 0) {
    report.recommendations.push('Completar descripciones faltantes en funciones');
  }
  
  if (report.dataQuality.functionsWithoutPercentages > 0) {
    report.recommendations.push('Completar porcentajes de dedicación faltantes');
  }
  
  if (report.metadata.issuesCount > 0) {
    report.recommendations.push('Revisar y corregir issues detectados');
  }
  
  return report;
}

// Exportar funciones para uso global
window.exportJSONMejorado = exportJSONMejorado;
window.procesarJSONMejorado = procesarJSONMejorado;
window.generarReporteValidacion = generarReporteValidacion;
window.validarJSONExportado = validarJSONExportado;

console.log('✅ Módulo de mejoras de exportación/importación cargado');