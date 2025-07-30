const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');
const flash = require('connect-flash');
const { body, validationResult } = require('express-validator');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de sesiones
app.use(session({
  secret: process.env.SESSION_SECRET || 'magna-partners-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

app.use(flash());

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para variables globales
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

// Configuración de multer para uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/json') {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos JSON'), false);
    }
  }
});

// Base de datos simulada de usuarios (en producción usar una DB real)
const users = [
  {
    id: 1,
    username: 'consultor1',
    email: 'consultor1@magnapartners.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    name: 'Consultor Principal',
    role: 'consultor'
  },
  {
    id: 2,
    username: 'admin',
    email: 'admin@magnapartners.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    name: 'Administrador',
    role: 'admin'
  }
];

// Middleware de autenticación
const requireAuth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    req.flash('error_msg', 'Debes iniciar sesión para acceder a esta página');
    res.redirect('/login');
  }
};

// Rutas
app.get('/', (req, res) => {
  res.render('landing', {
    title: 'Magna Partners - Consultoría Estratégica',
    user: req.session.user
  });
});

app.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.render('login', { title: 'Iniciar Sesión' });
});

app.post('/login', [
  body('username').notEmpty().withMessage('El usuario es requerido'),
  body('password').notEmpty().withMessage('La contraseña es requerida')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error_msg', 'Por favor completa todos los campos');
    return res.redirect('/login');
  }

  const { username, password } = req.body;
  
  try {
    const user = users.find(u => u.username === username);
    
    if (!user) {
      req.flash('error_msg', 'Usuario o contraseña incorrectos');
      return res.redirect('/login');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      req.flash('error_msg', 'Usuario o contraseña incorrectos');
      return res.redirect('/login');
    }

    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role
    };

    req.flash('success_msg', `¡Bienvenido, ${user.name}!`);
    res.redirect('/dashboard');
    
  } catch (error) {
    console.error('Error en login:', error);
    req.flash('error_msg', 'Error al iniciar sesión');
    res.redirect('/login');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
    }
    res.redirect('/');
  });
});

app.get('/dashboard', requireAuth, (req, res) => {
  res.render('dashboard', {
    title: 'Dashboard - Magna Partners',
    user: req.session.user
  });
});

app.get('/organigrama', requireAuth, (req, res) => {
  res.render('organigrama', {
    title: 'Herramienta Organigrama - Magna Partners',
    user: req.session.user
  });
});

app.post('/organigrama/upload', requireAuth, upload.single('jsonfile'), (req, res) => {
  try {
    if (!req.file) {
      req.flash('error_msg', 'Por favor selecciona un archivo JSON');
      return res.redirect('/organigrama');
    }

    const filePath = req.file.path;
    const raw = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(raw);
    
    // Guardar datos en sesión temporalmente
    req.session.organigramaData = jsonData;
    
    // Limpiar archivo subido
    fs.unlinkSync(filePath);
    
    req.flash('success_msg', 'Archivo cargado exitosamente');
    res.redirect('/organigrama');
    
  } catch (error) {
    console.error('Error al procesar archivo:', error);
    req.flash('error_msg', 'Error al procesar el archivo. Verifica que sea un JSON válido');
    res.redirect('/organigrama');
  }
});

app.get('/organigrama/export-pdf', requireAuth, async (req, res) => {
  try {
    if (!req.session.organigramaData) {
      req.flash('error_msg', 'No hay datos de organigrama cargados');
      return res.redirect('/organigrama');
    }

    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    // Crear HTML temporal con los datos
    const htmlContent = generateOrganigramaHTML(req.session.organigramaData);
    await page.setContent(htmlContent);
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '5mm', bottom: '5mm', left: '5mm', right: '5mm' }
    });
    
    await browser.close();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=organigrama-magna-partners.pdf');
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error('Error al exportar PDF:', error);
    req.flash('error_msg', 'Error al generar el PDF');
    res.redirect('/organigrama');
  }
});

// Función para generar HTML del organigrama
function generateOrganigramaHTML(data) {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Organigrama - Magna Partners</title>
      <style>
        body {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 9pt;
          margin: 2mm;
          padding: 0;
          background: #fff;
          color: #000;
        }
        .unidad-organizativa {
          page-break-inside: avoid;
          margin: 0 0 8px 0;
          padding: 0 0 6px 0;
          background: #fff;
          width: 100%;
          min-height: 0;
          box-sizing: border-box;
        }
        .page-break {
          display: block;
          page-break-before: always;
          height: 0;
          margin: 0;
          padding: 0;
          border: none;
          background: none;
        }
        .unit-header-compact {
          background: #2c5aa0;
          color: #fff;
          border-radius: 6px;
          padding: 8px 10px 6px 10px;
          margin-bottom: 4px;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: flex-start;
        }
        .unit-name {
          font-size: 1.4em;
          font-weight: 900;
          margin-bottom: 2px;
          text-transform: uppercase;
          letter-spacing: 1px;
          line-height: 1.1;
        }
        .unit-jerarquia {
          font-size: 0.95em;
          font-weight: 400;
          color: #c6d6f2;
          margin-bottom: 3px;
        }
        .unit-mision {
          font-size: 0.95em;
          margin-top: 6px;
          padding-top: 6px;
          color: #e0e8f5;
          line-height: 1.4;
          border-top: 1px solid rgba(255,255,255,0.2);
        }
        .info-section {
          margin-bottom: 15px;
        }
        .info-header {
          background: #2c5aa0;
          color: #fff;
          padding: 6px 12px;
          font-weight: bold;
          border-radius: 4px 4px 0 0;
          font-size: 9pt;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .info-header .left-text { flex: 6; text-align: left; }
        .info-header .right-text { flex: 3; text-align: left; }
        .info-header .center-text { flex: 1; text-align: center; }
        .info-content {
          border: 1.5px solid #2c5aa0;
          border-top: none;
          padding: 12px;
          background-color: #ffffff;
          border-left: 4px solid #2c5aa0;
        }
        .functions-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 12px;
          table-layout: fixed;
        }
        .functions-table th,
        .functions-table td {
          padding: 6px 8px;
          border-bottom: 1px solid #e9ecef;
          font-size: 8pt;
          line-height: 1.3;
          word-wrap: break-word;
          vertical-align: top;
        }
        .functions-table th {
          font-weight: bold;
          color: #2c5aa0;
          border-bottom: 2px solid #2c5aa0;
          background-color: #f8f9fa;
          font-size: 9pt;
        }
        .functions-table th:first-child,
        .functions-table td:first-child {
          width: 60%;
          text-align: left;
        }
        .functions-table th:nth-child(2),
        .functions-table td:nth-child(2) {
          width: 30%;
          text-align: left;
        }
        .functions-table th:nth-child(3),
        .functions-table td:nth-child(3) {
          width: 10%;
          text-align: center;
        }
        .indicadores-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px 12px;
        }
        .indicador-item {
          background: #f8f9fa;
          border-radius: 3px;
          padding: 4px 6px;
          font-size: 8pt;
          border: 1px solid #e9ecef;
          line-height: 1.3;
        }
        .no-functions {
          background-color: #f8f9fa;
          color: #6c757d;
          padding: 12px;
          text-align: center;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          font-style: italic;
          font-size: 9pt;
        }
      </style>
    </head>
    <body>
      <div class="organigrama-container">
        ${generateOrganigramaContent(data)}
      </div>
    </body>
    </html>
  `;
}

function generateOrganigramaContent(data) {
  if (!data.hierarchy || !data.hierarchy.tree) {
    return '<div>No hay datos de organigrama disponibles</div>';
  }

  function getAllUnits(nodes, units = []) {
    nodes.forEach(node => {
      units.push(node);
      if (node.children && node.children.length > 0) {
        getAllUnits(node.children, units);
      }
    });
    return units;
  }

  const units = getAllUnits(data.hierarchy.tree);
  
  return units.map((unit, index) => {
    const funciones = unit.funciones || [];
    const genericas = funciones.filter(f => f.tipo === 'Genérica');
    const especificas = funciones.filter(f => f.tipo === 'Específica');
    const indicadores = funciones.filter(f => f.tipo === 'Indicador');

    return `
      <div class="unidad-organizativa">
        ${index > 0 ? '<div class="page-break"></div>' : ''}
        
        <div class="unit-header-compact">
          <div class="unit-header-left">
            <div class="unit-name">${unit.nombre}</div>
            <div class="unit-jerarquia">${unit.jerarquia || ''}</div>
          </div>
          <div class="unit-header-right">
            <div><span class="unit-meta-label">Nivel de Reporte:</span> <span class="unit-meta-value">${unit.nivelReporte || 'No especificado'}</span></div>
            <div><span class="unit-meta-label">Fecha Aprobación:</span> <span class="unit-meta-value">${new Date().toLocaleDateString('es-ES')}</span></div>
          </div>
          ${unit.mision ? `<div class="unit-mision">${unit.mision}</div>` : ''}
        </div>

        ${genericas.length > 0 ? `
          <div class="info-section">
            <div class="info-header">
              <span class="left-text">Funciones Genéricas</span>
              <span class="right-text">Producto Final</span>
            </div>
            <div class="info-content">
              <table class="functions-table">
                ${genericas.map(func => `
                  <tr>
                    <td>${func.descripcion || ''}</td>
                    <td class="right-align">${func.productoFinal || 'N/A'}</td>
                  </tr>
                `).join('')}
              </table>
            </div>
          </div>
        ` : ''}

        ${especificas.length > 0 ? `
          <div class="info-section">
            <div class="info-header">
              <span class="left-text">Funciones Específicas</span>
              <span class="right-text">Producto Final</span>
              <span class="center-text">% Dedicación</span>
            </div>
            <div class="info-content">
              <table class="functions-table">
                ${especificas.map(func => `
                  <tr>
                    <td>${func.descripcion || ''}</td>
                    <td class="right-align">${func.productoFinal || 'N/A'}</td>
                    <td class="center-align">${func.porcentajeDedicacion || ''}</td>
                  </tr>
                `).join('')}
              </table>
            </div>
          </div>
        ` : ''}

        ${indicadores.length > 0 ? `
          <div class="info-section">
            <div class="info-header">Indicadores</div>
            <div class="info-content">
              <div class="indicadores-grid">
                ${indicadores.map(func => `
                  <div class="indicador-item">${func.descripcion || ''}</div>
                `).join('')}
              </div>
            </div>
          </div>
        ` : ''}

        ${genericas.length === 0 && especificas.length === 0 && indicadores.length === 0 ? `
          <div class="info-section">
            <div class="no-functions">No hay funciones definidas para esta unidad</div>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    title: 'Error - Magna Partners',
    message: 'Ha ocurrido un error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Página no encontrada - Magna Partners',
    message: 'La página que buscas no existe',
    error: {}
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor Magna Partners ejecutándose en http://localhost:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
  console.log(`🔧 Organigrama: http://localhost:${PORT}/organigrama`);
}); 