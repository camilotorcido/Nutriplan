/* ============================================
   NutriPlan - Cloud Storage (v20260425bq)

   Estrategia multi-usuario:
   ┌─────────────────────────────────────────────┐
   │  Proxy transparente sobre localStorage       │
   │  "nutriplan_xxx" → "nutriplan_xxx__userId"   │
   │                                              │
   │  Escritura:  localStorage (sync) +           │
   │              Firestore    (async debounced)  │
   │  Lectura:    localStorage (siempre)          │
   │  Al login:   hidrata localStorage desde      │
   │              Firestore (si hay conexión)     │
   │  Offline:    lee del caché localStorage      │
   └─────────────────────────────────────────────┘

   Expone: window.NP_CloudStorage
   ============================================ */

(function () {
  'use strict';

  /* ── Constantes ── */
  const PREFIX      = 'nutriplan_';
  const SYNC_DELAY  = 3000;   // ms de debounce antes de escribir a Firestore
  const DARK_MODE_KEY = 'nutriplan_dark_mode'; // NO se excluye del scope — es preferencia de usuario

  /* ── Estado interno ── */
  let _userId        = null;
  let _proxyActive   = false;
  let _orig          = null;   // métodos originales de Storage.prototype
  const _pending     = {};     // { key: timeoutId } para debounce

  /* ────────────────────────────────────────────
     Scoping: transforma la clave para aislar
     datos por usuario
  ──────────────────────────────────────────── */
  function _scope(key) {
    if (!_userId || !key || !key.startsWith(PREFIX)) return key;
    return `${key}__${_userId}`;
  }

  /* ────────────────────────────────────────────
     Proxy sobre Storage.prototype
     Intercepta TODAS las llamadas a localStorage
     y las redirige a las claves con sufijo userId
  ──────────────────────────────────────────── */
  function _installProxy(userId) {
    if (_proxyActive) return;
    _userId = userId;

    _orig = {
      get:    Storage.prototype.getItem,
      set:    Storage.prototype.setItem,
      remove: Storage.prototype.removeItem,
      clear:  Storage.prototype.clear,
    };

    Storage.prototype.getItem = function (key) {
      return _orig.get.call(this, _scope(key));
    };

    Storage.prototype.setItem = function (key, value) {
      _orig.set.call(this, _scope(key), value);
      // Sync async a Firestore solo para claves de NutriPlan
      if (key && key.startsWith(PREFIX)) {
        _queueSync(key, value);
      }
    };

    Storage.prototype.removeItem = function (key) {
      _orig.remove.call(this, _scope(key));
    };

    // clear() limpia SOLO las claves del usuario actual, no las de otros usuarios
    Storage.prototype.clear = function () {
      const suffix  = `__${userId}`;
      const toRemove = [];
      for (let i = 0; i < this.length; i++) {
        const k = this.key(i);
        if (k && k.endsWith(suffix)) toRemove.push(k);
      }
      toRemove.forEach(k => _orig.remove.call(this, k));
    };

    _proxyActive = true;
    console.log('[CloudStorage] Proxy instalado uid=' + userId.slice(0, 8) + '…');
  }

  function _uninstallProxy() {
    if (!_proxyActive || !_orig) return;
    Storage.prototype.getItem    = _orig.get;
    Storage.prototype.setItem    = _orig.set;
    Storage.prototype.removeItem = _orig.remove;
    Storage.prototype.clear      = _orig.clear;
    _orig        = null;
    _proxyActive = false;
    _userId      = null;
    console.log('[CloudStorage] Proxy desinstalado');
  }

  /* ────────────────────────────────────────────
     Sync a Firestore (debounced)
  ──────────────────────────────────────────── */
  function _queueSync(key, value) {
    if (typeof firebase === 'undefined' || !_userId) return;
    if (_pending[key]) clearTimeout(_pending[key]);
    _pending[key] = setTimeout(function () {
      delete _pending[key];
      _doSync(_userId, key, value);
    }, SYNC_DELAY);
  }

  function _doSync(userId, key, value) {
    if (!userId || typeof firebase === 'undefined') return;
    try {
      firebase.firestore()
        .collection('users').doc(userId)
        .collection('data').doc(key)
        .set({ v: value, t: firebase.firestore.FieldValue.serverTimestamp() })
        .catch(function (e) {
          console.warn('[CloudStorage] Sync falló:', key, e.message);
        });
    } catch (e) {
      console.warn('[CloudStorage] Sync error:', e);
    }
  }

  /* ────────────────────────────────────────────
     Hidratación desde Firestore al hacer login
     Si está offline, el catch es silencioso y
     el app usa el caché de localStorage.
  ──────────────────────────────────────────── */
  async function _hydrateFromCloud(userId) {
    if (typeof firebase === 'undefined') return;
    try {
      const snap = await firebase.firestore()
        .collection('users').doc(userId)
        .collection('data').get();

      let count = 0;
      snap.forEach(function (doc) {
        const val = doc.data().v;
        if (val !== undefined && val !== null) {
          // Escribir directo en localStorage con la clave ya scoped
          // (evitar re-proceso por el proxy que ya está instalado)
          _orig.set.call(localStorage, doc.id + '__' + userId, val);
          count++;
        }
      });
      console.log('[CloudStorage] Hidratados ' + count + ' keys desde Firestore');
    } catch (e) {
      console.warn('[CloudStorage] Hidratación offline — usando caché local:', e.message);
    }
  }

  /* ────────────────────────────────────────────
     Borrar todos los datos del usuario en
     Firestore (usado al "Reiniciar NutriPlan")
  ──────────────────────────────────────────── */
  async function _deleteCloudData(userId) {
    if (typeof firebase === 'undefined' || !userId) return;
    try {
      const snap = await firebase.firestore()
        .collection('users').doc(userId)
        .collection('data').get();
      const batch = firebase.firestore().batch();
      snap.forEach(function (doc) { batch.delete(doc.ref); });
      await batch.commit();
      console.log('[CloudStorage] Datos de Firestore eliminados para uid=' + userId.slice(0, 8));
    } catch (e) {
      console.warn('[CloudStorage] No se pudo limpiar Firestore:', e.message);
    }
  }

  /* ────────────────────────────────────────────
     API pública
  ──────────────────────────────────────────── */
  window.NP_CloudStorage = {

    /** Llamar cuando el usuario inicia sesión. */
    async onLogin(userId) {
      _installProxy(userId);
      await _hydrateFromCloud(userId);
    },

    /** Llamar cuando el usuario cierra sesión. */
    onLogout() {
      // Cancelar syncs pendientes
      Object.keys(_pending).forEach(function (k) {
        clearTimeout(_pending[k]);
        delete _pending[k];
      });
      _uninstallProxy();
    },

    /** Borrar todos los datos del usuario (localStorage + Firestore). */
    async deleteAllData() {
      if (!_userId) return;
      const uid = _userId;
      // Limpiar localStorage (via proxy: solo borra claves del usuario)
      localStorage.clear();
      // Limpiar Firestore
      await _deleteCloudData(uid);
    },

    /** Forzar sync inmediato de una clave sin esperar el debounce. */
    syncNow(key) {
      if (!_userId || !_orig) return;
      if (_pending[key]) { clearTimeout(_pending[key]); delete _pending[key]; }
      const stored = _orig.get.call(localStorage, key + '__' + _userId);
      if (stored !== null) _doSync(_userId, key, stored);
    },

    get userId() { return _userId; },
    get active()  { return _proxyActive; },
  };

  console.log('[CloudStorage] Módulo listo');
})();
