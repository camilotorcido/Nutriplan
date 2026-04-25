/* ============================================
   NutriPlan - Firebase Configuration
   ============================================

   INSTRUCCIONES (ver SETUP-AUTH.md para detalles):

   1. Ir a https://console.firebase.google.com
   2. Crear proyecto "nutriplan-beta" (o el nombre que quieras)
   3. Ir a Configuración del proyecto → pestaña General
   4. Desplazarse a "Tus apps" → clic en ícono web (</>)
   5. Registrar la app → copiar el objeto firebaseConfig abajo
   6. En Authentication → Sign-in method:
        · Activar "Email/contraseña"
        · Activar "Google" (configurar nombre del proyecto y email de soporte)
   7. En Authentication → Authorized domains:
        · Agregar "camilotorcido.github.io"
   8. En Firestore Database → Crear base de datos (modo producción)
   9. En Firestore → Reglas → copiar contenido de firestore.rules

   NOTA: El apiKey es un identificador público, NO es una contraseña.
   La seguridad la imponen las reglas de Firestore, no el config.
   ============================================ */

const firebaseConfig = {
  apiKey:            "REEMPLAZAR_CON_TU_API_KEY",
  authDomain:        "REEMPLAZAR.firebaseapp.com",
  projectId:         "REEMPLAZAR_CON_TU_PROJECT_ID",
  storageBucket:     "REEMPLAZAR.appspot.com",
  messagingSenderId: "REEMPLAZAR_CON_MESSAGING_ID",
  appId:             "REEMPLAZAR_CON_APP_ID"
};

// ─── Inicializar Firebase ───
if (typeof firebase !== 'undefined') {
  try {
    firebase.initializeApp(firebaseConfig);
    console.log('[Firebase] Inicializado correctamente');
  } catch (e) {
    // Si ya está inicializado (ej: hot reload), no hace nada
    if (e.code !== 'app/duplicate-app') {
      console.error('[Firebase] Error al inicializar:', e);
    }
  }
} else {
  console.error('[Firebase] SDK no cargado — verificar conexión a internet');
}
