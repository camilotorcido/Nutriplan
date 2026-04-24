/* ============================================
   NutriPlan - Perfiles múltiples (Fase 3.3)
   Gestiona "para cuántos se cocina" sin duplicar el plan.
   Aplica un multiplicador de porciones a ingredientes y costo.
   Calorías/macros siguen correspondiendo a la porción de Camilo.
   ============================================ */

(function cargarPerfiles() {

  const STORAGE_KEY = 'nutriplan_perfiles_v1';

  const DEFAULTS = {
    comensales: [
      { id: 'camilo', nombre: 'Camilo', tipo: 'adulto', factor: 1.0, activo: true }
    ],
    modo: 'individual' // 'individual' | 'familia'
  };

  function cargar() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULTS, comensales: [...DEFAULTS.comensales] };
      const parsed = JSON.parse(raw);
      if (!parsed.comensales || parsed.comensales.length === 0) {
        parsed.comensales = [...DEFAULTS.comensales];
      }
      return parsed;
    } catch (e) {
      return { ...DEFAULTS, comensales: [...DEFAULTS.comensales] };
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
  // (porque macros están calculadas para Camilo según su TDEE)
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
      costo_clp_comensales: Math.round((comida.costo_clp || 0) * (comida.factor_escala || 1) * factor),
      _escalado_comensales_factor: factor
    };
  }

  // Preset rápidos para setup
  const PRESETS = {
    solo: [
      { id: 'camilo', nombre: 'Camilo', tipo: 'adulto', factor: 1.0, activo: true }
    ],
    pareja: [
      { id: 'camilo', nombre: 'Camilo', tipo: 'adulto', factor: 1.0, activo: true },
      { id: 'pareja', nombre: 'Pareja', tipo: 'adulto', factor: 0.85, activo: true }
    ],
    familia_2_1: [
      { id: 'camilo', nombre: 'Camilo', tipo: 'adulto', factor: 1.0, activo: true },
      { id: 'adulto2', nombre: 'Adulto', tipo: 'adulto', factor: 0.85, activo: true },
      { id: 'nino1', nombre: 'Niño/a', tipo: 'nino', factor: 0.5, activo: true }
    ],
    familia_2_2: [
      { id: 'camilo', nombre: 'Camilo', tipo: 'adulto', factor: 1.0, activo: true },
      { id: 'adulto2', nombre: 'Adulto', tipo: 'adulto', factor: 0.85, activo: true },
      { id: 'nino1', nombre: 'Niño/a 1', tipo: 'nino', factor: 0.5, activo: true },
      { id: 'nino2', nombre: 'Niño/a 2', tipo: 'nino', factor: 0.5, activo: true }
    ]
  };

  function aplicarPreset(nombre) {
    const preset = PRESETS[nombre];
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
    if (id === 'camilo') return estado; // no se puede quitar al dueño
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
    PRESETS
  };

  console.log('[Perfiles Múltiples] Gestor cargado');
})();
