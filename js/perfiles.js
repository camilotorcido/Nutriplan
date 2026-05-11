/* ============================================
   Calibrate — Perfiles múltiples (Fase 3.3)
   Gestiona "para cuántos se cocina" sin duplicar el plan.
   Aplica un multiplicador de porciones a ingredientes y costo.
   Calorías/macros siguen correspondiendo a la porción del dueño (usuario logueado).
   ============================================ */

(function cargarPerfiles() {

  const STORAGE_KEY = 'nutriplan_perfiles_v1';
  const OWNER_ID = 'camilo'; // id histórico; el nombre visible viene del auth

  function getOwnerName() {
    try {
      if (typeof firebase !== 'undefined' && firebase.auth) {
        const u = firebase.auth().currentUser;
        if (u) {
          if (u.displayName) return u.displayName.split(' ')[0];
          if (u.email) return u.email.split('@')[0];
        }
      }
    } catch (_) {}
    return 'Tú';
  }

  function ownerComensal() {
    return { id: OWNER_ID, nombre: getOwnerName(), tipo: 'adulto', factor: 1.0, activo: true };
  }

  function defaultEstado() {
    return { comensales: [ownerComensal()], modo: 'individual' };
  }

  // Si el comensal dueño tiene el nombre genérico legacy "Camilo" pero el usuario
  // logueado es otro, sincronizamos. Si el usuario ya editó su nombre, lo respetamos.
  function sincronizarNombreDueno(estado) {
    if (!estado || !Array.isArray(estado.comensales)) return estado;
    const idx = estado.comensales.findIndex(c => c.id === OWNER_ID);
    if (idx < 0) return estado;
    const actual = estado.comensales[idx].nombre;
    const nuevo = getOwnerName();
    if (actual === 'Camilo' && nuevo !== 'Camilo') {
      estado.comensales[idx] = { ...estado.comensales[idx], nombre: nuevo };
    } else if (!actual) {
      estado.comensales[idx] = { ...estado.comensales[idx], nombre: nuevo };
    }
    return estado;
  }

  function cargar() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultEstado();
      const parsed = JSON.parse(raw);
      if (!parsed.comensales || parsed.comensales.length === 0) {
        parsed.comensales = [ownerComensal()];
      }
      return sincronizarNombreDueno(parsed);
    } catch (e) {
      return defaultEstado();
    }
  }

  function guardar(estado) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
      // Emitir evento global para que App/ShoppingList/Modal reaccionen
      window.dispatchEvent(new CustomEvent('perfiles-change', { detail: estado }));
      return true;
    } catch (e) {
      console.error('[Perfiles] Error guardando:', e);
      return false;
    }
  }

  // Factor total de cocción: suma de factores de todos los comensales activos
  function factorCoccion(estado) {
    if (!estado || !Array.isArray(estado.comensales)) return 1;
    const total = estado.comensales
      .filter(c => c.activo !== false)
      .reduce((sum, c) => sum + (c.factor || 1), 0);
    return Math.max(0.5, total); // mínimo 0.5 para evitar divisiones raras
  }

  function numComensalesActivos(estado) {
    if (!estado || !Array.isArray(estado.comensales)) return 1;
    return estado.comensales.filter(c => c.activo !== false).length;
  }

  // Aplica factor a ingredientes y costo SIN tocar calorías/macros
  // (porque macros están calculadas para el dueño según su TDEE)
  function escalarPorComensales(comida, factor) {
    if (!comida || factor === 1) return comida;
    const ingredientesOrig = comida.ingredientes_escalados || comida.ingredientes || [];
    const ingredientesEsc = ingredientesOrig.map(ing => ({
      ...ing,
      cantidad_escalada: (ing.cantidad_escalada != null ? ing.cantidad_escalada : ing.cantidad_base) * factor,
      cantidad_para_comensales: true
    }));
    return {
      ...comida,
      ingredientes_escalados: ingredientesEsc,
      costo_clp_comensales: Math.ceil((comida.costo_clp || 0) * (comida.factor_escala || 1) * factor),
      _escalado_comensales_factor: factor
    };
  }

  // Preset rápidos para setup. Se construyen dinámicamente para que el dueño
  // tome el nombre del usuario logueado, no un valor hardcoded.
  function buildPresets() {
    const owner = ownerComensal();
    return {
      solo: [owner],
      pareja: [
        owner,
        { id: 'pareja', nombre: 'Pareja', tipo: 'adulto', factor: 0.85, activo: true }
      ],
      familia_2_1: [
        owner,
        { id: 'adulto2', nombre: 'Adulto', tipo: 'adulto', factor: 0.85, activo: true },
        { id: 'nino1', nombre: 'Niño/a', tipo: 'nino', factor: 0.5, activo: true }
      ],
      familia_2_2: [
        owner,
        { id: 'adulto2', nombre: 'Adulto', tipo: 'adulto', factor: 0.85, activo: true },
        { id: 'nino1', nombre: 'Niño/a 1', tipo: 'nino', factor: 0.5, activo: true },
        { id: 'nino2', nombre: 'Niño/a 2', tipo: 'nino', factor: 0.5, activo: true }
      ]
    };
  }

  function aplicarPreset(nombre) {
    const preset = buildPresets()[nombre];
    if (!preset) return null;
    const estado = {
      comensales: preset.map(p => ({ ...p })),
      modo: preset.length > 1 ? 'familia' : 'individual'
    };
    guardar(estado);
    return estado;
  }

  function agregarComensal(estado, comensal) {
    const id = 'c_' + Date.now();
    const nuevo = {
      id,
      nombre: comensal.nombre || 'Comensal',
      tipo: comensal.tipo || 'adulto',
      factor: comensal.factor != null ? comensal.factor : (comensal.tipo === 'nino' ? 0.5 : 0.85),
      activo: true
    };
    estado.comensales.push(nuevo);
    estado.modo = estado.comensales.length > 1 ? 'familia' : 'individual';
    guardar(estado);
    return estado;
  }

  function quitarComensal(estado, id) {
    if (id === OWNER_ID) return estado; // no se puede quitar al dueño
    estado.comensales = estado.comensales.filter(c => c.id !== id);
    estado.modo = estado.comensales.length > 1 ? 'familia' : 'individual';
    guardar(estado);
    return estado;
  }

  function actualizarComensal(estado, id, cambios) {
    estado.comensales = estado.comensales.map(c =>
      c.id === id ? { ...c, ...cambios } : c
    );
    guardar(estado);
    return estado;
  }

  window.perfilesMulti = {
    cargar,
    guardar,
    factorCoccion,
    numComensalesActivos,
    escalarPorComensales,
    aplicarPreset,
    agregarComensal,
    quitarComensal,
    actualizarComensal,
    getOwnerName,
    get PRESETS() { return buildPresets(); }
  };

  console.log('[Perfiles Múltiples] Gestor cargado');
})();
