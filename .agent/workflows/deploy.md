---
description: Desplegar la aplicación en Vercel
---

# Workflow de Despliegue en Vercel

Este workflow te guiará paso a paso para desplegar MyDay en Vercel.

## Opción 1: Despliegue desde el Dashboard de Vercel (Recomendado para la primera vez)

### Paso 1: Crear cuenta en Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en "Sign Up"
3. Usa tu cuenta de GitHub para registrarte

### Paso 2: Importar el proyecto desde GitHub
1. En el Dashboard de Vercel, haz clic en **"Add New..."** → **"Project"**
2. Autoriza a Vercel para acceder a tus repositorios de GitHub
3. Busca y selecciona el repositorio `myday` (o `joeldevian/myday-rutinas`)
4. Haz clic en **"Import"**

### Paso 3: Configurar el proyecto
Vercel detectará automáticamente que es un proyecto Vite. Verifica la configuración:
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Paso 4: Configurar Variables de Entorno
⚠️ **MUY IMPORTANTE:** Debes agregar todas las variables de Firebase

1. Haz clic en **"Environment Variables"**
2. Agrega las siguientes variables (usa los valores de tu archivo `.env`):

```
VITE_FIREBASE_API_KEY=tu_api_key_real
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

3. Asegúrate de que cada variable esté configurada para **Production**, **Preview** y **Development**

### Paso 5: Deploy
1. Haz clic en **"Deploy"**
2. Espera 1-2 minutos mientras Vercel construye y despliega tu aplicación
3. ¡Listo! Tu app estará disponible en una URL como `myday-xxxx.vercel.app`

### Paso 6: Configurar dominio personalizado (Opcional)
1. En el Dashboard del proyecto, ve a **"Settings"** → **"Domains"**
2. Agrega tu dominio personalizado si lo tienes

---

## Opción 2: Despliegue desde la CLI (Para actualizaciones futuras)

### Instalación de Vercel CLI
```bash
npm i -g vercel
```

### Login
```bash
vercel login
```

### Primer Despliegue
```bash
vercel
```
Sigue las instrucciones en pantalla y configura las variables de entorno cuando se te solicite.

### Despliegues Subsecuentes
```bash
# Despliegue a preview
vercel

# Despliegue a producción
vercel --prod
```

---

## Configuración Automática de Despliegues

Una vez configurado, Vercel desplegará automáticamente:
- **Cada push a `main`** → Despliegue a producción
- **Cada push a otras branches** → Despliegue de preview
- **Cada Pull Request** → Preview deployment con URL única

---

## Verificación Post-Despliegue

Después del despliegue, verifica que:
1. ✅ La aplicación carga correctamente
2. ✅ El login con email/password funciona
3. ✅ El login con Google funciona
4. ✅ Las rutinas se pueden crear y editar
5. ✅ El calendario funciona
6. ✅ Las estadísticas se muestran correctamente

---

## Troubleshooting

### Error: "Environment variables are missing"
- Verifica que todas las variables de Firebase estén configuradas en Vercel
- Ve a Settings → Environment Variables en el dashboard del proyecto

### Error: "Build failed"
- Verifica que el proyecto compile localmente con `npm run build`
- Revisa los logs de build en Vercel para ver el error específico

### Error: "Firebase Auth not working"
- Agrega el dominio de Vercel a la lista de dominios autorizados en Firebase Console
- Firebase Console → Authentication → Settings → Authorized domains
- Agrega: `tu-proyecto.vercel.app`

### La app muestra una página en blanco
- Verifica que el archivo `vercel.json` tenga las rewrites correctas
- Revisa la consola del navegador para ver errores específicos

---

## Recursos Adicionales

- [Documentación de Vercel](https://vercel.com/docs)
- [Guía de Variables de Entorno en Vercel](https://vercel.com/docs/environment-variables)
- [Configurar dominios en Firebase](https://firebase.google.com/docs/auth/web/redirect-best-practices)
