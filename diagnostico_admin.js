// Script de diagnóstico para el botón Admin
console.log('=== DIAGNÓSTICO BOTÓN ADMIN ===');

// Verificar si el DOM está cargado
console.log('DOM Ready State:', document.readyState);

// Verificar si el botón Admin existe
const adminBtn = document.getElementById('adminBtn');
console.log('Admin Button Found:', !!adminBtn);

if (adminBtn) {
    console.log('Admin Button Properties:');
    console.log('- ID:', adminBtn.id);
    console.log('- Text:', adminBtn.textContent);
    console.log('- Style:', adminBtn.style.cssText);
    console.log('- Classes:', adminBtn.className);
    console.log('- Visible:', adminBtn.offsetWidth > 0 && adminBtn.offsetHeight > 0);
    console.log('- Clickable:', adminBtn.style.pointerEvents !== 'none');
    
    // Verificar si tiene event listeners
    console.log('- Has Click Event:', adminBtn.onclick !== null);
    
    // Agregar un event listener de prueba
    adminBtn.addEventListener('click', function(e) {
        console.log('Admin button clicked!');
        alert('Admin button works!');
    });
    
    console.log('✓ Test event listener added to admin button');
} else {
    console.error('✗ Admin button not found!');
}

// Verificar si el menú Admin existe
const adminMenu = document.getElementById('adminMenu');
console.log('Admin Menu Found:', !!adminMenu);

if (adminMenu) {
    console.log('Admin Menu Properties:');
    console.log('- ID:', adminMenu.id);
    console.log('- Display:', adminMenu.style.display);
    console.log('- Visible:', adminMenu.offsetWidth > 0 && adminMenu.offsetHeight > 0);
} else {
    console.error('✗ Admin menu not found!');
}

// Verificar funciones importantes
console.log('Functions Available:');
console.log('- mostrarAlerta:', typeof mostrarAlerta);
console.log('- marcarAdminCambios:', typeof marcarAdminCambios);
console.log('- exportCSV:', typeof exportCSV);
console.log('- exportToJSON:', typeof exportToJSON);
console.log('- exportToPDF:', typeof exportToPDF);

// Verificar variables globales
console.log('Global Variables:');
console.log('- datosModificados:', typeof datosModificados, datosModificados);
console.log('- unidadesMap:', typeof unidadesMap, !!unidadesMap);

console.log('=== FIN DIAGNÓSTICO ===');