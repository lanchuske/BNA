# Magna Partners - Plataforma de Consultoría

Plataforma web profesional para consultores con herramientas de organigrama y análisis organizacional.

## 🚀 Características

- **Landing Page Profesional**: Diseño moderno y responsive
- **Sistema de Autenticación**: Login seguro para consultores
- **Dashboard Interactivo**: Panel de control con herramientas
- **Herramienta Organigrama**: Carga de archivos JSON y exportación a PDF
- **Exportación Profesional**: PDFs con formato profesional y paginación automática
- **Diseño Responsive**: Compatible con dispositivos móviles y desktop

## 🛠️ Tecnologías Utilizadas

- **Backend**: Node.js, Express.js
- **Frontend**: EJS, HTML5, CSS3, JavaScript
- **Autenticación**: Express Session, bcryptjs
- **PDF Generation**: Playwright
- **File Upload**: Multer
- **Security**: Helmet, CORS
- **Containerization**: Docker, Docker Compose

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Docker (opcional, para containerización)

## 🚀 Instalación Local

### Opción 1: Instalación Directa

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd magna-partners
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env con tus configuraciones
   ```

4. **Ejecutar la aplicación**
   ```bash
   npm start
   # Para desarrollo: npm run dev
   ```

5. **Acceder a la aplicación**
   - Landing Page: http://localhost:3000
   - Login: http://localhost:3000/login
   - Dashboard: http://localhost:3000/dashboard

### Opción 2: Con Docker

1. **Construir y ejecutar con Docker Compose**
   ```bash
   docker-compose up --build
   ```

2. **O ejecutar solo con Docker**
   ```bash
   docker build -t magna-partners .
   docker run -p 3000:3000 magna-partners
   ```

## 🔐 Credenciales de Acceso

### Usuarios de Demostración

- **Consultor Principal**
  - Usuario: `consultor1`
  - Contraseña: `password`

- **Administrador**
  - Usuario: `admin`
  - Contraseña: `password`

## 📁 Estructura del Proyecto

```
magna-partners/
├── public/
│   ├── css/
│   │   └── landing.css
│   └── js/
│       └── landing.js
├── views/
│   ├── landing.ejs
│   ├── login.ejs
│   ├── dashboard.ejs
│   ├── organigrama.ejs
│   └── error.ejs
├── uploads/
├── server.js
├── package.json
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## 🎯 Funcionalidades

### Landing Page
- Diseño moderno y profesional
- Secciones de servicios y herramientas
- Formulario de contacto
- Navegación suave y animaciones

### Sistema de Autenticación
- Login seguro con bcrypt
- Sesiones persistentes
- Middleware de autenticación
- Protección de rutas

### Dashboard
- Panel de control intuitivo
- Acceso rápido a herramientas
- Estadísticas de actividad
- Navegación entre módulos

### Herramienta Organigrama
- Carga de archivos JSON
- Validación de formato
- Exportación a PDF profesional
- Configuración de exportación
- Instrucciones de uso

## 📊 Formato de Archivo JSON

El archivo JSON debe tener la siguiente estructura:

```json
{
  "hierarchy": {
    "tree": [
      {
        "nombre": "Nombre de la Unidad",
        "jerarquia": "Jerarquía organizacional",
        "nivelReporte": "Nivel de reporte",
        "mision": "Misión de la unidad",
        "funciones": [
          {
            "tipo": "Genérica|Específica|Indicador",
            "descripcion": "Descripción de la función",
            "productoFinal": "Producto final",
            "porcentajeDedicacion": "10"
          }
        ],
        "children": []
      }
    ]
  }
}
```

## 🚀 Despliegue en Railway

### 1. Preparar el Proyecto

1. **Crear cuenta en Railway**
   - Visita [railway.app](https://railway.app)
   - Conecta tu cuenta de GitHub

2. **Configurar variables de entorno**
   ```bash
   NODE_ENV=production
   PORT=3000
   SESSION_SECRET=tu-session-secret-aqui
   ```

### 2. Desplegar en Railway

1. **Conectar repositorio**
   - En Railway, selecciona "Deploy from GitHub repo"
   - Selecciona tu repositorio de Magna Partners

2. **Configurar build**
   - Railway detectará automáticamente el Dockerfile
   - O puedes usar el comando: `npm start`

3. **Configurar dominio**
   - Railway asignará un dominio automáticamente
   - Puedes configurar un dominio personalizado

### 3. Variables de Entorno en Railway

Configura estas variables en el dashboard de Railway:

```env
NODE_ENV=production
PORT=3000
SESSION_SECRET=tu-session-secret-muy-seguro
```

## 🔧 Configuración de Desarrollo

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
NODE_ENV=development
PORT=3000
SESSION_SECRET=dev-secret-key
```

### Scripts Disponibles

```bash
npm start          # Iniciar en producción
npm run dev        # Iniciar en desarrollo con nodemon
npm test           # Ejecutar tests (cuando se implementen)
```

## 🛡️ Seguridad

- **Helmet**: Headers de seguridad
- **CORS**: Configuración de origen cruzado
- **bcryptjs**: Hash seguro de contraseñas
- **Express Session**: Gestión segura de sesiones
- **Validación**: Validación de entrada con express-validator

## 📱 Responsive Design

La aplicación está optimizada para:
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: 320px - 767px

## 🐛 Troubleshooting

### Problemas Comunes

1. **Error de Playwright**
   ```bash
   # En desarrollo local
   npx playwright install chromium
   ```

2. **Error de puerto ocupado**
   ```bash
   # Cambiar puerto en .env
   PORT=3001
   ```

3. **Error de permisos en Docker**
   ```bash
   # En Linux/Mac
   sudo docker-compose up
   ```

### Logs

```bash
# Ver logs de la aplicación
npm start

# Ver logs de Docker
docker-compose logs -f
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o consultas:
- Email: info@magnapartners.com
- Teléfono: +54 11 1234-5678

## 🚀 Roadmap

- [ ] Integración con base de datos
- [ ] Sistema de usuarios avanzado
- [ ] Más herramientas de análisis
- [ ] API REST
- [ ] Integración con servicios en la nube
- [ ] Sistema de notificaciones
- [ ] Dashboard con métricas en tiempo real

---

**Magna Partners** - Transformando organizaciones a través de herramientas innovadoras. 