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
  apiKey:            "AIzaSyBILIccQWWurCynxxHiM7VAH2NFEp_pCbc",
  authDomain:        "nutriplan-6b3d4.firebaseapp.com",
  projectId:         "nutriplan-6b3d4",
  storageBucket:     "nutriplan-6b3d4.firebasestorage.app",
  messagingSenderId: "562790715660",
  appId:             "1:562790715660:web:dd092bdaf4d5e3e5383929",
  measurementId:     "G-V03NEHRCTS"
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
