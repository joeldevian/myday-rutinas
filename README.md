# MyDay - Gestión de Rutinas Diarias 📅

<div align="center">

![MyDay Banner](https://img.shields.io/badge/MyDay-Productivity-10b981?style=for-the-badge&logo=react)

**Aplicación web moderna para gestionar rutinas diarias con seguimiento de progreso y estadísticas**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?logo=firebase)](https://firebase.google.com/)
[![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[Demo en Vivo](#) · [Reportar Bug](#) · [Solicitar Feature](#)

</div>

---

## ✨ Características

### 🎯 Gestión de Rutinas
- ✅ Crear, editar y eliminar rutinas personalizadas
- 🕐 Configura horarios específicos para cada rutina
- 🎨 Elige entre múltiples iconos para personalizar
- ✔️ Marca rutinas como completadas con un clic
- 🔄 Reseteo automático diario a medianoche

### 📊 Estadísticas y Progreso
- 📈 Gráficos de progreso semanal
- 💯 Porcentaje de completitud diario
- 📉 Historial de los últimos 7 días
- 🎯 Promedio semanal de cumplimiento
- 💾 Guardado automático a las 23:59

### 📅 Calendario Integrado
- 🗓️ Vista mensual interactiva
- ➕ Agregar eventos personalizados
- 🎨 Visualización clara de eventos por día
- ✏️ Edición y eliminación de eventos

### ⏱️ Temporizador
- ⏲️ Cronómetro para cada rutina
- ▶️ Pausar y reanudar sesiones
- 📊 Tracking de tiempo dedicado

### 🔐 Autenticación Segura
- 🔑 Login con Email/Password
- 🌐 Sign-In con Google
- 🔒 Protección con Firebase Auth
- 👤 Datos aislados por usuario

### ⚙️ Configuración
- 👤 Perfiles de usuario personalizables
- 📤 Exportar datos (JSON)
- 📥 Importar respaldos
- 🗑️ Limpiar datos selectivamente

---

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js v18+ ([Descargar](https://nodejs.org/))
- npm o yarn
- Cuenta de Firebase ([Consola Firebase](https://console.firebase.google.com/))

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/myday.git
   cd myday
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar Firebase**
   - Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
   - Copia las credenciales de configuración
   - Crea un archivo `.env` en la raíz:

   ```env
   VITE_FIREBASE_API_KEY=tu_api_key
   VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
   VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
   ```

4. **Habilitar Authentication en Firebase**
   - Ve a Authentication → Sign-in method
   - Habilita **Email/Password**
   - Habilita **Google**

5. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

6. **Abrir en navegador**
   ```
   http://localhost:5173
   ```

---

## 📦 Build para Producción

```bash
# Crear build optimizado
npm run build

# Preview local del build
npm run preview
```

---

## 🌐 Deployment

### Vercel (Recomendado)

```bash
npm i -g vercel
vercel
```

### Netlify

```bash
npm i -g netlify-cli
netlify deploy --prod
```

### Firebase Hosting

```bash
npm i -g firebase-tools
firebase init hosting
firebase deploy
```

> **Importante:** Configura las variables de entorno en tu plataforma de hosting

---

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|------------|-----|
| **React 18** | Framework UI |
| **Vite** | Build tool |
| **Firebase Auth** | Autenticación |
| **Lucide React** | Iconos |
| **CSS Modules** | Estilos |
| **localStorage** | Persistencia de datos |

---

## 📁 Estructura del Proyecto

```
myday/
├── src/
│   ├── components/        # Componentes React
│   │   ├── Dashboard.jsx  # Panel principal
│   │   ├── LoginPage.jsx  # Página de login
│   │   ├── Calendar.jsx   # Vista calendario
│   │   ├── Statistics.jsx # Estadísticas
│   │   └── ...
│   ├── contexts/          # Context API
│   │   └── AuthContext.jsx
│   ├── hooks/             # Custom hooks
│   │   ├── useRoutines.js
│   │   ├── useCalendar.js
│   │   └── useStats.js
│   ├── services/          # Servicios
│   │   └── firebase.js
│   ├── styles/            # Estilos CSS
│   ├── utils/             # Utilidades
│   └── App.jsx            # Componente raíz
├── public/                # Assets estáticos
├── .env.example           # Ejemplo de variables
├── .gitignore
├── package.json
└── vite.config.js
```

---

## 🔐 Seguridad

- ✅ Contraseñas hasheadas con bcrypt (Firebase)
- ✅ Comunicación HTTPS/TLS
- ✅ Tokens JWT para sesiones
- ✅ Variables de entorno protegidas
- ✅ Sin logs de datos sensibles en producción

Ver [SECURITY.md](./SECURITY.md) para más detalles

---

## 🤝 Contribuir

Las contribuciones son bienvenidas! Para contribuir:

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: nueva característica'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Roadmap

- [ ] Migración a Firestore para multi-dispositivo
- [ ] PWA (Progressive Web App)
- [ ] Notificaciones push
- [ ] Temas personalizables
- [ ] Exportar a PDF
- [ ] API pública

---

## 📄 Licencia

Distribuido bajo la licencia MIT. Ver `LICENSE` para más información.

---

## 👤 Autor

**Joel D. Ircañaupa Yaurimo**

- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- LinkedIn: [Tu LinkedIn](#)

---

## 🙏 Agradecimientos

- [React](https://reactjs.org/) - Framework
- [Firebase](https://firebase.google.com/) - Backend as a Service
- [Lucide](https://lucide.dev/) - Iconos
- [Vite](https://vitejs.dev/) - Build tool

---

<div align="center">

⭐ Si te gustó este proyecto, dale una estrella!

Made with  ❤️ by Joel D. Ircañaupa Yaurimo

</div>
