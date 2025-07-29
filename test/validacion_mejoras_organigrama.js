/**
 * Script de Validación para las Mejoras del Organigrama Interactivo
 * Valida que las funciones de exportación e importación mejoradas funcionen correctamente
 */

// ===== FUNCIONES DE VALIDACIÓN =====

/**
 * Valida que las funciones de exportación mejorada estén disponibles
 */
function validarFuncionesExportacion() {
  console.log('🔍 Validando funciones de exportación mejorada...');
  
  const funcionesRequeridas = [
    'exportJSON',
    'generateDetailedStats',
    'validateFunctionData',
    'calculateUnitStats',
    'calculateExportQuality',
    'generateExportSuccessMessage'
  ];
  
  const funcionesDisponibles = {};
  const funcionesFaltantes = [];
  
  funcionesRequeridas.forEach(funcName => {
    if (typeof window[funcName] === 'function') {
      funcionesDisponibles[funcName] = true;
      console.log(`✅ ${funcName} disponible`);
    } else {
      funcionesFaltantes.push(funcName);
      console.log(`❌ ${funcName} NO disponible`);
    }
  });
  
  if (funcionesFaltantes.length > 0) {
    console.error('❌ Funciones de exportación faltantes:', funcionesFaltantes);
    return false;
  }
  
  console.log('✅ Todas las funciones de exportación están disponibles');
  return true;
}

/**
 * Valida que las funciones de importación mejorada estén disponibles
 */
function validarFuncionesImportacion() {
  console.log('🔍 Validando funciones de importación mejorada...');
  
  const funcionesRequeridas = [
    'procesarJSON',
    'validateJSONStructure',
    'validateMetadata',
    'limpiarDatosAnteriores',
    'convertirJSONaCSVMejorado',
    'generateCSVHeaders',
    'extractValueFromNestedStructure',
    'restaurarEstado',
    'renderizarInterfaz',
    'mostrarResumenImportacion'
  ];
  
  const funcionesDisponibles = {};
  const funcionesFaltantes = [];
  
  funcionesRequeridas.forEach(funcName => {
    if (typeof window[funcName] === 'function') {
      funcionesDisponibles[funcName] = true;
      console.log(`✅ ${funcName} disponible`);
    } else {
      funcionesFaltantes.push(funcName);
      console.log(`❌ ${funcName} NO disponible`);
    }
  });
  
  if (funcionesFaltantes.length > 0) {
    console.error('❌ Funciones de importación faltantes:', funcionesFaltantes);
    return false;
  }
  
  console.log('✅ Todas las funciones de importación están disponibles');
  return true;
}

/**
 * Valida la estructura de datos de prueba
 */
function crearDatosPrueba() {
  console.log('🔍 Creando datos de prueba...');
  
  // Simular unidadesMap para pruebas
  const unidadesMap = {
    'Unidad A': [
      {
        'Unidad Organizativa': 'Unidad A',
        'Misión': 'Misión de prueba A',
        'Tipo de Función': 'Genérica',
        'Descripción de la Función': 'Descripción completa',
        'Producto Final': 'Producto A',
        'Porcentaje Dedicación': '50%'
      },
      {
        'Unidad Organizativa': 'Unidad A',
        'Misión': 'Misión de prueba A',
        'Tipo de Función': 'Específica',
        'Descripción de la Función': 'Descripción específica',
        'Producto Final': 'Producto B',
        'Porcentaje Dedicación': '30%'
      }
    ],
    'Unidad B': [
      {
        'Unidad Organizativa': 'Unidad B',
        'Misión': 'Misión de prueba B',
        'Tipo de Función': 'Indicador',
        'Descripción de la Función': '',
        'Producto Final': '',
        'Porcentaje Dedicación': ''
      }
    ]
  };
  
  return unidadesMap;
}

/**
 * Prueba la función generateDetailedStats
 */
function probarGenerateDetailedStats() {
  console.log('🧪 Probando generateDetailedStats...');
  
  try {
    const unidadesMap = crearDatosPrueba();
    const allData = [].concat(...Object.values(unidadesMap));
    
    if (typeof window.generateDetailedStats === 'function') {
      const stats = window.generateDetailedStats(allData);
      
      console.log('📊 Estadísticas generadas:', stats);
      
      // Validar estructura de estadísticas
      const camposRequeridos = [
        'totalFunctions',
        'byType',
        'quality',
        'qualityScore'
      ];
      
      const camposFaltantes = camposRequeridos.filter(campo => !(campo in stats));
      
      if (camposFaltantes.length > 0) {
        console.error('❌ Campos faltantes en estadísticas:', camposFaltantes);
        return false;
      }
      
      console.log('✅ generateDetailedStats funciona correctamente');
      return true;
    } else {
      console.error('❌ generateDetailedStats no está disponible');
      return false;
    }
  } catch (error) {
    console.error('❌ Error en generateDetailedStats:', error);
    return false;
  }
}

/**
 * Prueba la función validateFunctionData
 */
function probarValidateFunctionData() {
  console.log('🧪 Probando validateFunctionData...');
  
  try {
    if (typeof window.validateFunctionData === 'function') {
      // Función completa
      const funcionCompleta = {
        'Descripción de la Función': 'Descripción completa',
        'Producto Final': 'Producto completo',
        'Porcentaje Dedicación': '100%'
      };
      
      const issuesCompleta = window.validateFunctionData(funcionCompleta);
      console.log('✅ Función completa - Issues:', issuesCompleta);
      
      // Función incompleta
      const funcionIncompleta = {
        'Descripción de la Función': '',
        'Producto Final': '',
        'Porcentaje Dedicación': ''
      };
      
      const issuesIncompleta = window.validateFunctionData(funcionIncompleta);
      console.log('⚠️ Función incompleta - Issues:', issuesIncompleta);
      
      if (issuesCompleta.length === 0 && issuesIncompleta.length > 0) {
        console.log('✅ validateFunctionData funciona correctamente');
        return true;
      } else {
        console.error('❌ validateFunctionData no detecta issues correctamente');
        return false;
      }
    } else {
      console.error('❌ validateFunctionData no está disponible');
      return false;
    }
  } catch (error) {
    console.error('❌ Error en validateFunctionData:', error);
    return false;
  }
}

/**
 * Prueba la función validateJSONStructure
 */
function probarValidateJSONStructure() {
  console.log('🧪 Probando validateJSONStructure...');
  
  try {
    if (typeof window.validateJSONStructure === 'function') {
      // JSON válido
      const jsonValido = {
        unidades: [
          {
            nombre: 'Unidad Test',
            funciones: [
              {
                tipo: 'Genérica',
                descripcion: 'Descripción test'
              }
            ]
          }
        ]
      };
      
      const validacionValida = window.validateJSONStructure(jsonValido);
      console.log('✅ JSON válido - Resultado:', validacionValida);
      
      // JSON inválido
      const jsonInvalido = {
        unidades: []
      };
      
      const validacionInvalida = window.validateJSONStructure(jsonInvalido);
      console.log('❌ JSON inválido - Resultado:', validacionInvalida);
      
      if (validacionValida.isValid && !validacionInvalida.isValid) {
        console.log('✅ validateJSONStructure funciona correctamente');
        return true;
      } else {
        console.error('❌ validateJSONStructure no valida correctamente');
        return false;
      }
    } else {
      console.error('❌ validateJSONStructure no está disponible');
      return false;
    }
  } catch (error) {
    console.error('❌ Error en validateJSONStructure:', error);
    return false;
  }
}

/**
 * Ejecuta todas las validaciones
 */
function ejecutarValidacionesCompletas() {
  console.log('🚀 Iniciando validaciones completas de las mejoras...');
  console.log('=' .repeat(60));
  
  const resultados = {
    funcionesExportacion: validarFuncionesExportacion(),
    funcionesImportacion: validarFuncionesImportacion(),
    generateDetailedStats: probarGenerateDetailedStats(),
    validateFunctionData: probarValidateFunctionData(),
    validateJSONStructure: probarValidateJSONStructure()
  };
  
  console.log('=' .repeat(60));
  console.log('📊 RESUMEN DE VALIDACIONES:');
  
  let exitosas = 0;
  let totales = Object.keys(resultados).length;
  
  Object.entries(resultados).forEach(([test, resultado]) => {
    const status = resultado ? '✅ PASÓ' : '❌ FALLÓ';
    console.log(`${status} - ${test}`);
    if (resultado) exitosas++;
  });
  
  console.log('=' .repeat(60));
  console.log(`📈 RESULTADO FINAL: ${exitosas}/${totales} validaciones exitosas`);
  
  if (exitosas === totales) {
    console.log('🎉 ¡Todas las validaciones pasaron! Las mejoras están funcionando correctamente.');
  } else {
    console.log('⚠️ Algunas validaciones fallaron. Revisar las funciones faltantes.');
  }
  
  return resultados;
}

// ===== EXPORTAR FUNCIONES PARA USO EXTERNO =====

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ejecutarValidacionesCompletas,
    validarFuncionesExportacion,
    validarFuncionesImportacion,
    probarGenerateDetailedStats,
    probarValidateFunctionData,
    probarValidateJSONStructure
  };
}

// ===== EJECUTAR SI SE LLAMA DIRECTAMENTE =====

if (typeof window !== 'undefined') {
  // Si se ejecuta en el navegador, agregar al objeto window
  window.validarMejorasOrganigrama = ejecutarValidacionesCompletas;
  
  console.log('🔧 Script de validación cargado. Usa validarMejorasOrganigrama() para ejecutar las pruebas.');
}