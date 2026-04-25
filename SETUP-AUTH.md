# NutriPlan — Configuración de Autenticación

## Pasos (15-20 minutos)

### 1. Crear el proyecto en Firebase

1. Ir a https://console.firebase.google.com
2. Clic en **"Agregar proyecto"**
3. Nombre: `nutriplan-beta` (o el que quieras)
4. Deshabilitar Google Analytics (no es necesario)
5. Clic en **"Crear proyecto"**

---

### 2. Registrar la app web

1. En la pantalla principal del proyecto, clic en el ícono **</>** (web)
2. Nombre de la app: `NutriPlan`
3. Clic en **"Registrar app"**
4. Verás un objeto `firebaseConfig` — **copiar los valores** en `js/firebase-config.js`
5. Clic en **"Continuar con la consola"**

---

### 3. Activar métodos de autenticación

1. Menú izquierdo → **Authentication** → pestaña **Sign-in method**
2. Activar **"Correo electrónico/contraseña"** → Guardar
3. Activar **"Google"** → configurar:
   - Nombre del proyecto: `NutriPlan`
   - Email de soporte: tu email
   - Guardar

---

### 4. Autorizar el dominio de GitHub Pages

1. En Authentication → pestaña **Authorized domains**
2. Clic en **"Agregar dominio"**
3. Agregar: `camilotorcido.github.io`
4. Guardar

---

### 5. Crear la base de datos Firestore

1. Menú izquierdo → **Firestore Database**
2. Clic en **"Crear base de datos"**
3. Seleccionar **"Iniciar en modo de producción"** → Siguiente
4. Elegir región: `us-central1` (o la más cercana)
5. Clic en **"Listo"**

---

### 6. Aplicar las reglas de seguridad

1. En Firestore → pestaña **Reglas**
2. Reemplazar el contenido con el del archivo `firestore.rules`
3. Clic en **"Publicar"**

Las reglas garantizan que cada usuario solo acceda a sus propios datos.

---

### 7. Actualizar la configuración en el código

Abrir `js/firebase-config.js` y reemplazar los valores:

```js
const firebaseConfig = {
  apiKey:            "AIzaSy...",          // ← tu valor
  authDomain:        "mi-proyecto.firebaseapp.com",
  projectId:         "mi-proyecto",
  storageBucket:     "mi-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123456789:web:abc123"
};
```

---

### 8. Deploy

```bash
# El deploy ya está configurado en el workflow de GitHub Pages
# Solo hacer commit y push:
git add js/firebase-config.js
git commit -m "chore: configurar Firebase para producción"
git push
```

---

## Notas de seguridad

- El `apiKey` de Firebase **no es secreto** — es un identificador público, no una contraseña
- La seguridad real está en las **reglas de Firestore** (paso 6)
- Sin las reglas correctas, cualquier usuario autenticado podría ver datos de otros
- Con las reglas del paso 6, cada usuario solo ve y escribe su propia data

## Plan gratuito (Spark)

Suficiente para uso entre amigos y beta testing:
- 50.000 lecturas/día
- 20.000 escrituras/día
- 1 GB de almacenamiento
- Usuarios ilimitados en Authentication
