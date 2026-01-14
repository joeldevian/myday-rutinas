# Configuración de Firebase para MyDay

## Pasos para configurar Google Sign-In

### 1. Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Click en "Agregar proyecto" o "Add project"
3. Nombre del proyecto: `myday` (o el que prefieras)
4. Deshabilita Google Analytics (opcional)
5. Click en "Crear proyecto"

### 2. Habilitar Google Authentication

1. En el menú lateral, ve a **Build > Authentication**
2. Click en "Get started" o "Comenzar"
3. En la pestaña "Sign-in method", click en **Google**
4. Habilita el toggle de "Enable"
5. Selecciona un email de soporte del proyecto
6. Click en "Save"

### 3. Obtener Credenciales del Proyecto

1. Click en el ícono de ⚙️ (Settings) junto a "Project Overview"
2. Selecciona "Project settings"
3. En la sección "Your apps", click en el ícono </> (Web)
4. Registra tu app:
   - **App nickname**: `MyDay Web`
   - **No** marques "Firebase Hosting"
   - Click en "Register app"

5. Copia la configuración que aparece (similar a):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "myday-xxxxx.firebaseapp.com",
  projectId: "myday-xxxxx",
  storageBucket: "myday-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### 4. Configurar Variables de Entorno

1. En la raíz del proyecto, crea un archivo `.env`:

```bash
# En la terminal
cd c:\nebula\myday
copy .env.example .env
```

2. Abre `.env` y reemplaza los valores con tu configuración de Firebase:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=myday-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=myday-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=myday-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

3. **IMPORTANTE**: Asegúrate de que `.env` esté en `.gitignore` (ya debería estar)

### 5. Autorizar Dominios

1. En Firebase Console > Authentication > Settings > Authorized domains
2. Agrega tus dominios autorizados:
   - `localhost` (ya viene por defecto)
   - Tu dominio de producción si lo tienes

### 6. Reiniciar el Servidor

```bash
# Detén el servidor actual (Ctrl+C)
# Reinicia para cargar las variables de entorno
npm run dev
```

## Verificación

1. Abre la aplicación en `http://localhost:5173`
2. Deberías ver el botón "Continuar con Google"
3. Click en el botón
4. Selecciona tu cuenta de Google
5. Si todo está configurado correctamente, deberías iniciar sesión

## Solución de Problemas

### Error: "Firebase: Error (auth/configuration-not-found)"
- Verifica que las variables de entorno estén correctamente configuradas en `.env`
- Reinicia el servidor después de modificar `.env`

### Error: "Firebase: Error (auth/unauthorized-domain)"
- Asegúrate de que `localhost` esté en Authorized domains en Firebase Console

### El botón no hace nada
- Abre la consola del navegador (F12) para ver errores
- Verifica que Firebase esté instalado: `npm list firebase`

## Notas

- Firebase es **GRATIS** hasta 50,000 autenticaciones al mes
- Los datos del usuario se guardan automáticamente
- La sesión persiste en el navegador
- Puedes cerrar sesión desde el botón en el sidebar
