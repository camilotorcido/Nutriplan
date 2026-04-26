/* ============================================
   NutriPlan - Módulo de Autenticación (v20260425br)
   Requiere: firebase-config.js cargado antes.
   Expone: window.NP_Auth
   ============================================ */

(function () {
  'use strict';

  if (typeof firebase === 'undefined' || !firebase.apps || !firebase.apps.length) {
    console.warn('[NP_Auth] Firebase no disponible — modo local sin auth');
    window.NP_Auth = null;
    return;
  }

  const auth = firebase.auth();

  // ─── Google provider ───
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });

  // ─── Persistencia LOCAL: sesión sobrevive al cierre del navegador ───
  auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(() => {});

  // ─── Mensajes de error en español ───
  function _errMsg(code) {
    const map = {
      'auth/email-already-in-use':    'Este email ya tiene una cuenta. Iniciá sesión.',
      'auth/invalid-email':           'El email no es válido.',
      'auth/wrong-password':          'Contraseña incorrecta.',
      'auth/invalid-credential':      'Email o contraseña incorrectos.',
      'auth/user-not-found':          'No hay cuenta con este email.',
      'auth/user-disabled':           'Esta cuenta fue desactivada.',
      'auth/weak-password':           'La contraseña debe tener al menos 6 caracteres.',
      'auth/too-many-requests':       'Demasiados intentos. Esperá unos minutos.',
      'auth/network-request-failed':  'Sin conexión. Verificá tu internet.',
      'auth/popup-closed-by-user':    '',   // el usuario cerró el popup — no es un error
      'auth/cancelled-popup-request': '',
      'auth/popup-blocked':           'El navegador bloqueó el popup. Habilitá los popups para este sitio.',
      'auth/requires-recent-login':   'Por seguridad, cerrá sesión, volvé a ingresar y repetí la acción.',
      'auth/operation-not-allowed':   'Este método de login no está habilitado. Activá Email/contraseña en Firebase Console.',
    };
    return map[code] || 'Error de autenticación. Intentá de nuevo.';
  }

  // ─── API pública ───
  window.NP_Auth = {

    get currentUser() { return auth.currentUser; },

    /** Suscribirse a cambios de estado de auth. Retorna función de cleanup. */
    onAuthStateChanged(callback) {
      return auth.onAuthStateChanged(callback);
    },

    /** Login con email + contraseña */
    async signInWithEmail(email, password) {
      try {
        const result = await auth.signInWithEmailAndPassword(email.trim(), password);
        return result.user;
      } catch (e) {
        const msg = _errMsg(e.code);
        if (msg) throw new Error(msg);
        return null;
      }
    },

    /** Registro con email + contraseña */
    async signUpWithEmail(email, password) {
      try {
        const result = await auth.createUserWithEmailAndPassword(email.trim(), password);
        return result.user;
      } catch (e) {
        console.error('[NP_Auth] signUp error code:', e.code, e.message);
        throw new Error(_errMsg(e.code));
      }
    },

    /** Login con Google (popup) */
    async signInWithGoogle() {
      try {
        const result = await auth.signInWithPopup(googleProvider);
        return result.user;
      } catch (e) {
        const msg = _errMsg(e.code);
        if (msg) throw new Error(msg);
        return null; // popup cerrado por el usuario — ignorar silenciosamente
      }
    },

    /** Enviar email de recuperación de contraseña */
    async resetPassword(email) {
      try {
        await auth.sendPasswordResetEmail(email.trim());
      } catch (e) {
        throw new Error(_errMsg(e.code));
      }
    },

    /** Cerrar sesión */
    async signOut() {
      await auth.signOut();
    },
  };

  console.log('[NP_Auth] Módulo listo');
})();
