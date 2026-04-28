/* ============================================
   Calibrate — App Bundle (todos los componentes React)
   Este archivo se procesa con Babel standalone
   MEJORAS: Dark mode, día actual, swap individual,
   unidades de compra, historial 14 días
   v20260428ai: Bilingual ES/EN support
   ============================================ */

// ─── Safety net: garantizar que storage.js haya expuesto funciones ───
// Si storage.js no se ejecutó (SW sirvió versión corrupta o falló la red),
// creamos stubs en window para que el bundle no explote con "X is not defined".
(function restaurarAPI() {
  var fns = [
    'cargarPerfil','guardarPerfil','cargarPlanSemanal','guardarPlanSemanal',
    'cargarDespensa','guardarDespensa','cargarMacrosCustom','guardarMacrosCustom',
    'cargarHistorialRecetas','guardarHistorialRecetas','agregarAlHistorial',
    'obtenerRecetasUsadas14Dias','cargarDarkMode','guardarDarkMode','limpiarTodo'
  ];
  fns.forEach(function(fn) {
    if (typeof window[fn] !== 'function') {
      window[fn] = function() {
        console.warn('[Storage Fallback] ' + fn + ' no disponible, usando stub');
        if (fn === 'cargarDespensa') return {};
        if (fn === 'cargarHistorialRecetas') return [];
        if (fn === 'cargarDarkMode') return false;
        if (fn === 'obtenerRecetasUsadas14Dias') return new Set();
        if (fn.indexOf('cargar') === 0 || fn.indexOf('obtener') === 0) return null;
        return false;
      };
    }
    // Copiar al scope global como var (el bundle compilado lo buscará ahí)
    // Esto se hace porque Babel transforma `const cargarPerfil` → `var cargarPerfil`
    // y si la declaración nunca se ejecuta (storage.js falló), queda undefined.
  });
})();

// Hoisting manual: declarar vars globales que apunten a window.X.
// Si storage.js las definió, estas NO sobrescriben (storage.js se cargó antes).
// Si storage.js falló, estas toman los stubs de window.
var cargarPerfil = window.cargarPerfil;
var guardarPerfil = window.guardarPerfil;
var cargarPlanSemanal = window.cargarPlanSemanal;
var guardarPlanSemanal = window.guardarPlanSemanal;
var cargarDespensa = window.cargarDespensa;
var guardarDespensa = window.guardarDespensa;
var cargarMacrosCustom = window.cargarMacrosCustom;
var guardarMacrosCustom = window.guardarMacrosCustom;
var cargarHistorialRecetas = window.cargarHistorialRecetas;
var guardarHistorialRecetas = window.guardarHistorialRecetas;
var agregarAlHistorial = window.agregarAlHistorial;
var obtenerRecetasUsadas14Dias = window.obtenerRecetasUsadas14Dias;
var cargarDarkMode = window.cargarDarkMode;
var guardarDarkMode = window.guardarDarkMode;
var limpiarTodo = window.limpiarTodo;

// ─── v20260428ai: Bilingual helpers ────────────────────────────────────────
/**
 * Translate helper: returns `en` when app language is English, `es` otherwise.
 * Reads window._NP_lang which is set by the App component on every render.
 */
function t(es, en) {
  return (window._NP_lang || 'es') === 'en' && en !== undefined ? en : es;
}

// English labels for FACTORES_ACTIVIDAD (defined in nutritionEngine.js)
var FACTORES_ACTIVIDAD_EN = {
  sedentario: 'Sedentary (little or no exercise)',
  ligera:     'Lightly active (1–3 days/week)',
  moderada:   'Moderately active (3–5 days/week)',
  muy_activo: 'Very active (6–7 days/week)',
  extremo:    'Extremely active (athlete/physical work)'
};

// English labels for AJUSTES_OBJETIVO
var AJUSTES_OBJETIVO_EN = {
  perdida:      'Weight loss',
  mantenimiento:'Maintenance',
  volumen:      'Bulking / Muscle gain'
};

// ─────────────────────────────────────────────────────────────────────────────

// ─── Helpers: Comidas Externas ─────────────────────────────────────────────
var _EXT_KEY = 'nutriplan_comidas_externas';
function _repararNombreUtf8(str) {
  if (typeof str !== 'string' || !/[\x80-\xFF]/.test(str)) return str;
  try {
    var bytes = new Uint8Array(str.length);
    for (var i = 0; i < str.length; i++) {
      var c = str.charCodeAt(i);
      if (c > 255) return str;
      bytes[i] = c;
    }
    var decoded = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
    return decoded.includes('�') ? str : decoded;
  } catch(e) { return str; }
}
function _comidasExtFecha(fecha) {
  try {
    var a = JSON.parse(localStorage.getItem(_EXT_KEY) || '{}');
    var lista = a[fecha] || [];
    // Reparar nombres con encoding Latin-1 roto (proteÃna → proteína)
    return lista.map(function(c) {
      return c && c.nombre ? Object.assign({}, c, { nombre: _repararNombreUtf8(c.nombre) }) : c;
    });
  } catch(e) { return []; }
}
function _guardarComidasExt(fecha, lista) {
  try {
    var a = JSON.parse(localStorage.getItem(_EXT_KEY) || '{}');
    a[fecha] = lista;
    localStorage.setItem(_EXT_KEY, JSON.stringify(a));
  } catch(e) {}
}
function _agregarAdherenciaExt(diaActual, comida) {
  if (typeof window.adherencia === 'undefined') return;
  window.adherencia.marcar(diaActual, 'ext_' + comida.id, true, {
    kcal_plan: comida.kcal, proteinas_plan: comida.proteinas_g, nombre: comida.nombre
  }, 1);
}
function _eliminarAdherenciaExt(diaActual, comidaId) {
  try {
    var raw = localStorage.getItem('nutriplan_adherencia');
    var data = raw ? JSON.parse(raw) : {};
    var fecha = new Date().toISOString().split('T')[0];
    if (data[fecha]) {
      delete data[fecha][diaActual + ':ext_' + comidaId];
      localStorage.setItem('nutriplan_adherencia', JSON.stringify(data));
    }
  } catch(e) {}
}

// =============================================
// COMPONENTE: LoginScreen
// =============================================
function LoginScreen({ darkMode, onToggleDark }) {
  const [mode, setMode]               = React.useState('login'); // 'login' | 'signup' | 'reset'
  const [email, setEmail]             = React.useState('');
  const [password, setPassword]       = React.useState('');
  const [loading, setLoading]         = React.useState(false);
  const [googleLoading, setGoogleLoad]= React.useState(false);
  const [error, setError]             = React.useState('');
  const [successMsg, setSuccessMsg]   = React.useState('');
  const [showPass, setShowPass]       = React.useState(false);

  const clearMessages = () => { setError(''); setSuccessMsg(''); };

  const handleSubmit = async () => {
    clearMessages();
    if (!email.trim()) { setError('Ingresa tu email.'); return; }
    if (mode !== 'reset' && password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return; }
    setLoading(true);
    try {
      if (mode === 'login') {
        await window.NP_Auth.signInWithEmail(email, password);
      } else if (mode === 'signup') {
        await window.NP_Auth.signUpWithEmail(email, password);
      } else {
        await window.NP_Auth.resetPassword(email);
        setSuccessMsg('Te enviamos un email para restablecer tu contraseña.');
        setMode('login');
      }
    } catch (e) {
      if (e.message) setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    clearMessages();
    setGoogleLoad(true);
    try {
      await window.NP_Auth.signInWithGoogle();
    } catch (e) {
      if (e.message) setError(e.message);
    } finally {
      setGoogleLoad(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSubmit(); };

  const titles = { login: 'Inicia sesión', signup: 'Crear cuenta', reset: 'Recuperar contraseña' };
  const subtitles = { login: 'Tu plan nutricional te espera', signup: 'Empieza a planificar tu semana', reset: 'Te enviamos un link por email' };
  const btnLabels = { login: 'Iniciar sesión', signup: 'Crear cuenta', reset: 'Enviar email' };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-4 py-8 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50'}`}>

      {/* Dark mode toggle */}
      <button onClick={onToggleDark} aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        className={`absolute top-4 right-4 p-2 rounded-lg transition-colors ${darkMode ? 'text-yellow-400 hover:bg-gray-800' : 'text-gray-400 hover:bg-white/70'}`}>
        <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'} text-sm`}></i>
      </button>

      {/* Card */}
      <div className={`w-full max-w-sm rounded-2xl shadow-xl p-8 animate-scaleIn ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 brand-icon-bg rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-bullseye text-white text-2xl"></i>
          </div>
          <h1 className={`text-2xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-800'}`}>Calibrate</h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{subtitles[mode]}</p>
        </div>

        {/* Title */}
        <h2 className={`text-base font-semibold mb-5 ${darkMode ? 'text-white' : 'text-gray-700'}`}>{titles[mode]}</h2>

        {/* Error / Success */}
        {error && (
          <div className="animate-slideDown mb-4">
            <div className={`flex items-start gap-2 px-4 py-3 rounded-xl text-sm ${darkMode ? 'bg-red-900/40 text-red-300 border border-red-800' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              <i className="fas fa-circle-exclamation mt-0.5 flex-shrink-0"></i>
              <span>{error}</span>
            </div>
          </div>
        )}
        {successMsg && (
          <div className="animate-slideDown mb-4">
            <div className={`flex items-start gap-2 px-4 py-3 rounded-xl text-sm ${darkMode ? 'bg-green-900/40 text-green-300 border border-green-800' : 'bg-green-50 text-green-700 border border-green-200'}`}>
              <i className="fas fa-circle-check mt-0.5 flex-shrink-0"></i>
              <span>{successMsg}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="space-y-3">
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Email</label>
            <input type="email" value={email} onChange={e => { setEmail(e.target.value); clearMessages(); }}
              onKeyDown={handleKeyDown}
              placeholder="tu@email.com" autoComplete="email"
              className={`w-full px-4 py-3 rounded-xl border text-sm transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'} focus:border-green-500`} />
          </div>

          {mode !== 'reset' && (
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Contraseña</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password}
                  onChange={e => { setPassword(e.target.value); clearMessages(); }}
                  onKeyDown={handleKeyDown}
                  placeholder={mode === 'signup' ? 'Mínimo 6 caracteres' : '••••••••'} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  className={`w-full px-4 py-3 pr-12 rounded-xl border text-sm transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'} focus:border-green-500`} />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded cursor-pointer ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
                  aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                  <i className={`fas ${showPass ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
                </button>
              </div>
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-sm text-white transition-all ${loading ? 'bg-green-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 active:scale-[0.98] shadow-md shadow-green-200'}`}>
            {loading
              ? <span className="flex items-center justify-center gap-2"><i className="fas fa-circle-notch fa-spin"></i>Procesando…</span>
              : btnLabels[mode]
            }
          </button>
        </div>

        {/* Divider + Google */}
        {mode !== 'reset' && (
          <>
            <div className="my-5 flex items-center gap-3">
              <div className={`flex-1 h-px ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              <span className={`text-xs font-medium ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>o</span>
              <div className={`flex-1 h-px ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            </div>

            <button onClick={handleGoogle} disabled={googleLoading}
              className={`w-full py-3 rounded-xl border font-medium text-sm flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${googleLoading ? 'opacity-60 cursor-not-allowed' : ''} ${darkMode ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm'}`}>
              {googleLoading
                ? <i className="fas fa-circle-notch fa-spin text-gray-400"></i>
                : (
                  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                    <path fill="none" d="M0 0h48v48H0z"/>
                  </svg>
                )
              }
              Continuar con Google
            </button>
          </>
        )}

        {/* Navigation links */}
        <div className={`mt-6 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {mode === 'login' && (
            <div className="flex flex-col gap-2">
              <span>
                ¿No tienes cuenta?{' '}
                <button onClick={() => { setMode('signup'); clearMessages(); }}
                  className="font-semibold text-green-500 hover:text-green-400 transition-colors cursor-pointer">
                  Crear cuenta
                </button>
              </span>
              <button onClick={() => { setMode('reset'); clearMessages(); }}
                className="text-xs text-gray-400 hover:text-gray-500 transition-colors cursor-pointer underline underline-offset-2">
                Olvidé mi contraseña
              </button>
            </div>
          )}
          {mode === 'signup' && (
            <span>
              ¿Ya tienes cuenta?{' '}
              <button onClick={() => { setMode('login'); clearMessages(); }}
                className="font-semibold text-green-500 hover:text-green-400 transition-colors cursor-pointer">
                Iniciar sesión
              </button>
            </span>
          )}
          {mode === 'reset' && (
            <button onClick={() => { setMode('login'); clearMessages(); }}
              className="font-semibold text-green-500 hover:text-green-400 transition-colors cursor-pointer flex items-center gap-1.5 mx-auto">
              <i className="fas fa-arrow-left text-xs"></i>
              Volver al login
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <p className={`mt-6 text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
        Solo para amigos · Beta privada
      </p>
    </div>
  );
}

// ─── Helper: derivar macros en gramos desde un calculados de roadmap ───────────
// Soporta roadmaps viejos (sin macrosGramos) usando proteinaTarget + split objetivo.
function _resolverMacros(calc, obj) {
  if (!calc) return null;
  if (calc.macrosGramos && calc.macrosGramos.proteina) return calc.macrosGramos;
  if (!calc.proteinaTarget) return null;
  const kcal = calc.caloriasCorte || calc.caloriasObjetivo || 0;
  if (!kcal) return null;
  const remKcal = Math.max(0, kcal - calc.proteinaTarget * 4);
  const carbPct  = obj === 'volumen' ? 0.60 : obj === 'mantenimiento' ? 0.45 : 0.572;
  return {
    proteina:      calc.proteinaTarget,
    carbohidratos: Math.round(remKcal * carbPct / 4),
    grasas:        Math.round(remKcal * (1 - carbPct) / 9)
  };
}

// =============================================
// COMPONENTE: EmptyState — reutilizable en toda la app
// =============================================
// Uso: <EmptyState icon="fa-utensils" title="Sin recetas" desc="..." cta="..." onCta={fn} darkMode={dm} />
function EmptyState({ icon, title, desc, cta, onCta, darkMode }) {
  return (
    <div className="cal-empty-state">
      <div className="cal-empty-state__icon">
        <i className={`fas ${icon || 'fa-inbox'}`}></i>
      </div>
      <p className="cal-empty-state__title" style={{ color: darkMode ? '#f9fafb' : undefined }}>{title}</p>
      {desc && <p className="cal-empty-state__desc">{desc}</p>}
      {cta && onCta && (
        <button onClick={onCta}
          className="mt-3 px-5 py-2.5 rounded-xl text-sm font-semibold bg-green-500 text-white hover:bg-green-600 transition-colors flex items-center gap-2">
          {cta}
        </button>
      )}
    </div>
  );
}

// =============================================
// COMPONENTE: ProfileSetup
// =============================================
function ProfileSetup({ onComplete, perfilInicial, darkMode, onToggleDark, onBack, tienePlan, lang, onLangChange }) {
  const [perfil, setPerfil] = React.useState(() => {
    // v20260418x: sincronizar fatLossMode con objetivo='perdida' si venía de una versión anterior
    if (perfilInicial) {
      const fatLossInferido = perfilInicial.fatLossMode !== undefined
        ? perfilInicial.fatLossMode
        : perfilInicial.objetivo === 'perdida';
      // Usar macros ya almacenados (calculados por activarFatLossMode/Mantenimiento/Volumen)
      // No forzar valores hardcodeados — el roadmap guarda los porcentajes reales
      return { ...perfilInicial, fatLossMode: fatLossInferido };
    }
    return {
      edad: "",
      genero: "",
      peso: "",
      altura: "",
      nivelActividad: "moderada",
      objetivo: "mantenimiento",
      sinGluten: false,
      sinLactosa: false,
      vegetariano: false,
      ingredientesExcluidos: [],
      ingredientesExcluidosTexto: "",
      macros: { ...MACROS_PREDETERMINADOS.mantenimiento },
      caloriasManual: "",
      numSemanas: 1,
      fatLossMode: false,
      soloRapidas: false,
      maxTiempoMin: 25,
      modoSobras: false,
      usaThermomix: false
    };
  });

  const [tdeeInfo, setTdeeInfo] = React.useState(null);
  const [errores, setErrores] = React.useState({});
  const [macroError, setMacroError] = React.useState("");
  const [usarCaloriasManual, setUsarCaloriasManual] = React.useState(
    perfilInicial && perfilInicial.caloriasManual ? true : false
  );
  // v20260418x: Fat Loss Mode preview
  const [roadmapPreview, setRoadmapPreview] = React.useState(null);
  // v20260428ai: Wizard onboarding — null = modo edición (form completo), 0 = lang picker, 1-6 = paso activo
  const [pasoWizard, setPasoWizard] = React.useState(!perfilInicial ? 0 : null);
  const [equiposWizard, setEquiposWizard] = React.useState(leerEquipos);
  // Previews para mantenimiento y volumen (paso 4)
  const [roadmapMantPreview, setRoadmapMantPreview] = React.useState(null);
  const [roadmapVolPreview, setRoadmapVolPreview] = React.useState(null);
  // Pantalla de explicación post-wizard
  const [showExplicacion, setShowExplicacion] = React.useState(false);
  const [nivelExplicacion, setNivelExplicacion] = React.useState('a');
  const [perfilParaExplicar, setPerfilParaExplicar] = React.useState(null);
  // Modal metodología en modo edición
  const [verMetodologia, setVerMetodologia] = React.useState(false);

  React.useEffect(() => {
    const { peso, altura, edad, genero, nivelActividad, objetivo } = perfil;
    // v20260418y: guard defensivo — nivelActividad inválida crashea FACTORES_ACTIVIDAD lookup
    const nivelValido = nivelActividad && FACTORES_ACTIVIDAD[nivelActividad];
    if (peso > 0 && altura > 0 && edad > 0 && nivelValido) {
      const bmr = calcularBMR(parseFloat(peso), parseFloat(altura), parseFloat(edad), genero);
      const tdee = calcularTDEE(parseFloat(peso), parseFloat(altura), parseFloat(edad), genero, nivelActividad);
      const caloriasCalculadas = calcularCaloriasObjetivo(tdee, objetivo);
      // Si hay calorías manuales activas, usarlas; sino usar las calculadas
      const caloriasObj = usarCaloriasManual && perfil.caloriasManual > 0
        ? Math.max(800, Math.round(parseFloat(perfil.caloriasManual)))
        : caloriasCalculadas;
      const macrosG = calcularMacrosEnGramos(caloriasObj, perfil.macros);
      setTdeeInfo({ bmr: Math.round(bmr), tdee, caloriasObjetivo: caloriasObj, caloriasCalculadas, macrosG });
    } else if (usarCaloriasManual && perfil.caloriasManual > 0) {
      // Permitir solo calorías manuales sin datos corporales completos
      const caloriasObj = Math.max(800, Math.round(parseFloat(perfil.caloriasManual)));
      const macrosG = calcularMacrosEnGramos(caloriasObj, perfil.macros);
      setTdeeInfo({ bmr: null, tdee: null, caloriasObjetivo: caloriasObj, caloriasCalculadas: null, macrosG });
    } else {
      setTdeeInfo(null);
    }
  }, [perfil, usarCaloriasManual]);

  React.useEffect(() => {
    const suma = perfil.macros.proteinas + perfil.macros.carbohidratos + perfil.macros.grasas;
    if (suma !== 100) {
      setMacroError(`Los macros suman ${suma}%. Deben sumar exactamente 100%.`);
    } else {
      setMacroError("");
    }
  }, [perfil.macros]);

  // v20260418x: Preview del roadmap de Fat Loss en vivo mientras el usuario ajusta inputs
  React.useEffect(() => {
    if (perfil.objetivo !== 'perdida' || !window.NP_Roadmap) { setRoadmapPreview(null); return; }
    if (!perfil.peso || !perfil.altura || !perfil.edad) { setRoadmapPreview(null); return; }
    const tieneNavy = perfil.cintura && perfil.cuello;
    const tieneBF = perfil.bfOverride && parseFloat(perfil.bfOverride) > 0;
    if (!tieneNavy && !tieneBF) { setRoadmapPreview(null); return; }
    if (!perfil.pesoTarget && !perfil.bfTarget) { setRoadmapPreview(null); return; }
    try {
      const factorInfo = FACTORES_ACTIVIDAD[perfil.nivelActividad];
      const factorNum = factorInfo ? factorInfo.valor : 1.45;
      const preview = window.NP_Roadmap.generar({
        peso: parseFloat(perfil.peso),
        altura: parseFloat(perfil.altura),
        edad: parseFloat(perfil.edad),
        genero: perfil.genero === 'femenino' ? 'F' : 'M',
        cintura: perfil.cintura ? parseFloat(perfil.cintura) : null,
        cuello: perfil.cuello ? parseFloat(perfil.cuello) : null,
        cadera: perfil.cadera ? parseFloat(perfil.cadera) : null,
        bfOverride: perfil.bfOverride || null,
        factorActividad: factorNum,
        pesoTarget: perfil.pesoTarget ? parseFloat(perfil.pesoTarget) : null,
        bfTarget: perfil.bfTarget ? parseFloat(perfil.bfTarget) : null,
        tasaPerdida: perfil.tasaPerdida || 'moderada',
        timelineMesesDeseado: perfil.timelineMesesDeseado ? parseFloat(perfil.timelineMesesDeseado) : null
      });
      setRoadmapPreview(preview);
    } catch (e) {
      console.warn('[FatLoss] preview error:', e.message);
      setRoadmapPreview(null);
    }
  }, [perfil.fatLossMode, perfil.peso, perfil.altura, perfil.edad, perfil.genero, perfil.cintura, perfil.cuello, perfil.cadera, perfil.bfOverride, perfil.nivelActividad, perfil.pesoTarget, perfil.bfTarget, perfil.tasaPerdida, perfil.timelineMesesDeseado]);

  // Preview Mantenimiento — se actualiza en vivo para step 4
  React.useEffect(() => {
    if (perfil.objetivo !== 'mantenimiento' || !window.NP_Roadmap || !window.NP_Roadmap.generarMantenimiento) { setRoadmapMantPreview(null); return; }
    if (!perfil.peso || !perfil.altura || !perfil.edad) { setRoadmapMantPreview(null); return; }
    try {
      const factorNum = (FACTORES_ACTIVIDAD[perfil.nivelActividad] || {}).valor || 1.45;
      const preview = window.NP_Roadmap.generarMantenimiento({
        peso: parseFloat(perfil.peso), altura: parseFloat(perfil.altura), edad: parseFloat(perfil.edad),
        genero: perfil.genero === 'femenino' ? 'F' : 'M',
        cintura: perfil.cintura ? parseFloat(perfil.cintura) : null,
        cuello: perfil.cuello ? parseFloat(perfil.cuello) : null,
        cadera: perfil.cadera ? parseFloat(perfil.cadera) : null,
        bfOverride: perfil.bfOverride || null, factorActividad: factorNum
      });
      setRoadmapMantPreview(preview);
    } catch(e) { console.warn('[Mant] preview error:', e.message); setRoadmapMantPreview(null); }
  }, [perfil.objetivo, perfil.peso, perfil.altura, perfil.edad, perfil.genero, perfil.cintura, perfil.cuello, perfil.cadera, perfil.bfOverride, perfil.nivelActividad]);

  // Preview Volumen — se actualiza en vivo para step 4
  React.useEffect(() => {
    if (perfil.objetivo !== 'volumen' || !window.NP_Roadmap || !window.NP_Roadmap.generarVolumen) { setRoadmapVolPreview(null); return; }
    if (!perfil.peso || !perfil.altura || !perfil.edad) { setRoadmapVolPreview(null); return; }
    try {
      const factorNum = (FACTORES_ACTIVIDAD[perfil.nivelActividad] || {}).valor || 1.45;
      const preview = window.NP_Roadmap.generarVolumen({
        peso: parseFloat(perfil.peso), altura: parseFloat(perfil.altura), edad: parseFloat(perfil.edad),
        genero: perfil.genero === 'femenino' ? 'F' : 'M',
        cintura: perfil.cintura ? parseFloat(perfil.cintura) : null,
        cuello: perfil.cuello ? parseFloat(perfil.cuello) : null,
        cadera: perfil.cadera ? parseFloat(perfil.cadera) : null,
        bfOverride: perfil.bfOverride || null, factorActividad: factorNum,
        tasaGanancia: perfil.tasaGanancia || 'moderada',
        pesoObjetivo: perfil.pesoObjetivoVol ? parseFloat(perfil.pesoObjetivoVol) : null
      });
      setRoadmapVolPreview(preview);
    } catch(e) { console.warn('[Vol] preview error:', e.message); setRoadmapVolPreview(null); }
  }, [perfil.objetivo, perfil.peso, perfil.altura, perfil.edad, perfil.genero, perfil.cintura, perfil.cuello, perfil.cadera, perfil.bfOverride, perfil.nivelActividad, perfil.tasaGanancia, perfil.pesoObjetivoVol]);

  const handleObjetivoChange = (objetivo) => {
    // Pérdida de peso siempre usa el motor científico (Fat Loss / Precision Nutrition)
    // Mantenimiento y Volumen también usan metodología LBM-based (se activan en handleSubmit)
    const macrosDefault = objetivo === 'perdida'
      ? { proteinas: 33, carbohidratos: 38, grasas: 29 }
      : objetivo === 'mantenimiento'
      ? { proteinas: 30, carbohidratos: 42, grasas: 28 }
      : { proteinas: 30, carbohidratos: 50, grasas: 20 };
    setPerfil(prev => ({ ...prev, objetivo, macros: macrosDefault, fatLossMode: objetivo === 'perdida' }));
  };

  const handleMacroChange = (macro, valor) => {
    const num = parseInt(valor) || 0;
    setPerfil(prev => ({
      ...prev,
      macros: { ...prev.macros, [macro]: Math.max(0, Math.min(100, num)) }
    }));
  };

  const handleChange = (campo, valor) => {
    setPerfil(prev => ({ ...prev, [campo]: valor }));
    if (errores[campo]) setErrores(prev => ({ ...prev, [campo]: "" }));
  };

  const validar = () => {
    const err = {};
    // Todos los objetivos científicos requieren datos corporales completos (para BMR)
    const esObjetivoBase = perfil.objetivo === 'perdida' || perfil.objetivo === 'mantenimiento' || perfil.objetivo === 'volumen';
    if (esObjetivoBase || !usarCaloriasManual) {
      if (!perfil.edad || perfil.edad < 15 || perfil.edad > 100) err.edad = "Edad debe ser entre 15 y 100 años";
      if (!perfil.peso || perfil.peso < 30 || perfil.peso > 300) err.peso = "Peso debe ser entre 30 y 300 kg";
      if (!perfil.altura || perfil.altura < 100 || perfil.altura > 250) err.altura = "Altura debe ser entre 100 y 250 cm";
    } else if (usarCaloriasManual) {
      if (!perfil.caloriasManual || perfil.caloriasManual < 800 || perfil.caloriasManual > 6000) err.caloriasManual = "Calorías debe ser entre 800 y 6000 kcal";
    }
    // Macros se validan solo en objetivos sin metodología científica (FL/Mant/Vol los fijan automáticamente)
    if (!perfil.fatLossMode && perfil.objetivo !== 'mantenimiento' && perfil.objetivo !== 'volumen') {
      const sumaMacros = perfil.macros.proteinas + perfil.macros.carbohidratos + perfil.macros.grasas;
      if (sumaMacros !== 100) err.macros = "Los macros deben sumar exactamente 100%";
    }
    setErrores(err);
    return Object.keys(err).length === 0;
  };

  const _mostrarExplicacion = (perfilFinal) => {
    setPerfilParaExplicar(perfilFinal);
    setShowExplicacion(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;
    const excluidos = perfil.ingredientesExcluidosTexto
      .split(",").map(i => i.trim()).filter(i => i.length > 0);
    const factorNum = (FACTORES_ACTIVIDAD[perfil.nivelActividad] || {}).valor || 1.45;
    const inputsBase = {
      peso: parseFloat(perfil.peso), altura: parseFloat(perfil.altura), edad: parseFloat(perfil.edad),
      genero: perfil.genero === 'femenino' ? 'F' : 'M',
      cintura: perfil.cintura ? parseFloat(perfil.cintura) : null,
      cuello: perfil.cuello ? parseFloat(perfil.cuello) : null,
      cadera: perfil.cadera ? parseFloat(perfil.cadera) : null,
      bfOverride: perfil.bfOverride || null,
      factorActividad: factorNum
    };

    // ── Pérdida de peso: Precision Nutrition / Fat Loss ──
    if (perfil.objetivo === 'perdida' && window.NP_FatLoss && roadmapPreview) {
      try {
        const perfilPrevio = { ...perfil, edad: parseFloat(perfil.edad), peso: parseFloat(perfil.peso), altura: parseFloat(perfil.altura), ingredientesExcluidos: excluidos, numSemanas: perfil.numSemanas || 1 };
        guardarPerfil(perfilPrevio);
        guardarMacrosCustom({ [perfil.objetivo]: perfil.macros });
        window.NP_FatLoss.activar({
          ...inputsBase,
          pesoTarget: perfil.pesoTarget ? parseFloat(perfil.pesoTarget) : null,
          bfTarget: perfil.bfTarget ? parseFloat(perfil.bfTarget) : null,
          tasaPerdida: perfil.tasaPerdida || 'moderada',
          timelineMesesDeseado: perfil.timelineMesesDeseado ? parseFloat(perfil.timelineMesesDeseado) : null,
          complementoPreferido: perfil.complementoPreferido || 'whey'
        });
        const nuevoPerfil = cargarPerfil();
        nuevoPerfil.caloriasObjetivo = window.NP_FatLoss.caloriasEfectivas() || nuevoPerfil.caloriasManual;
        nuevoPerfil.tdee = nuevoPerfil.roadmap ? nuevoPerfil.roadmap.calculados.tdee : (tdeeInfo && tdeeInfo.tdee);
        nuevoPerfil.ingredientesExcluidos = excluidos;
        nuevoPerfil.numSemanas = perfil.numSemanas || 1;
        guardarPerfil(nuevoPerfil);
        _mostrarExplicacion(nuevoPerfil);
        return;
      } catch (err) {
        console.error('[FatLoss] Error al activar:', err);
        alert('Error al activar Fat Loss Mode: ' + err.message);
      }
    }

    // ── Mantenimiento: LBM-based ──
    if (perfil.objetivo === 'mantenimiento' && window.NP_FatLoss && window.NP_FatLoss.activarMantenimiento) {
      try {
        const perfilPrevio = { ...perfil, edad: parseFloat(perfil.edad), peso: parseFloat(perfil.peso), altura: parseFloat(perfil.altura), ingredientesExcluidos: excluidos, numSemanas: perfil.numSemanas || 1 };
        guardarPerfil(perfilPrevio);
        const nuevoPerfil = window.NP_FatLoss.activarMantenimiento(inputsBase);
        nuevoPerfil.ingredientesExcluidos = excluidos;
        nuevoPerfil.numSemanas = perfil.numSemanas || 1;
        nuevoPerfil.sinGluten = perfil.sinGluten; nuevoPerfil.sinLactosa = perfil.sinLactosa;
        nuevoPerfil.vegetariano = perfil.vegetariano; nuevoPerfil.modoSobras = perfil.modoSobras;
        nuevoPerfil.usaThermomix = perfil.usaThermomix; nuevoPerfil.soloRapidas = perfil.soloRapidas;
        guardarPerfil(nuevoPerfil);
        _mostrarExplicacion(nuevoPerfil);
        return;
      } catch (err) {
        console.error('[Mant] Error al activar:', err);
        alert('Error al activar Mantenimiento: ' + err.message);
      }
    }

    // ── Volumen / Ganancia muscular: LBM-based ──
    if (perfil.objetivo === 'volumen' && window.NP_FatLoss && window.NP_FatLoss.activarVolumen) {
      try {
        const perfilPrevio = { ...perfil, edad: parseFloat(perfil.edad), peso: parseFloat(perfil.peso), altura: parseFloat(perfil.altura), ingredientesExcluidos: excluidos, numSemanas: perfil.numSemanas || 1 };
        guardarPerfil(perfilPrevio);
        const nuevoPerfil = window.NP_FatLoss.activarVolumen({
          ...inputsBase,
          tasaGanancia: perfil.tasaGanancia || 'moderada',
          pesoObjetivo: perfil.pesoObjetivoVol ? parseFloat(perfil.pesoObjetivoVol) : null
        });
        nuevoPerfil.ingredientesExcluidos = excluidos;
        nuevoPerfil.numSemanas = perfil.numSemanas || 1;
        nuevoPerfil.sinGluten = perfil.sinGluten; nuevoPerfil.sinLactosa = perfil.sinLactosa;
        nuevoPerfil.vegetariano = perfil.vegetariano; nuevoPerfil.modoSobras = perfil.modoSobras;
        nuevoPerfil.usaThermomix = perfil.usaThermomix; nuevoPerfil.soloRapidas = perfil.soloRapidas;
        guardarPerfil(nuevoPerfil);
        _mostrarExplicacion(nuevoPerfil);
        return;
      } catch (err) {
        console.error('[Vol] Error al activar:', err);
        alert('Error al activar Volumen: ' + err.message);
      }
    }

    // ── Fallback: flujo legado (sin datos corporales completos) ──
    const perfilFinal = {
      ...perfil,
      edad: perfil.edad ? parseFloat(perfil.edad) : 0,
      peso: perfil.peso ? parseFloat(perfil.peso) : 0,
      altura: perfil.altura ? parseFloat(perfil.altura) : 0,
      ingredientesExcluidos: excluidos,
      tdee: tdeeInfo ? tdeeInfo.tdee : 0,
      caloriasObjetivo: tdeeInfo ? tdeeInfo.caloriasObjetivo : 0,
      caloriasManual: usarCaloriasManual ? parseFloat(perfil.caloriasManual) : "",
      numSemanas: perfil.numSemanas || 1
    };
    guardarPerfil(perfilFinal);
    guardarMacrosCustom({ [perfil.objetivo]: perfil.macros });
    _mostrarExplicacion(perfilFinal);
  };

  // ── v20260428ai: Wizard onboarding ──────────────────────────────────────
  if (pasoWizard !== null) {

    // ── Paso 0: Selector de idioma (pantalla completa, antes del wizard) ───
    if (pasoWizard === 0) {
      const _pickLang = (code) => {
        if (onLangChange) onLangChange(code);
        setPasoWizard(1);
      };
      return (
        <div className={`min-h-screen flex flex-col items-center justify-center px-4 py-8 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50'}`}>
          <button onClick={onToggleDark} aria-label={darkMode ? 'Light mode' : 'Dark mode'}
            className={`absolute top-4 right-4 p-2 rounded-lg transition-colors ${darkMode ? 'text-yellow-400 hover:bg-gray-800' : 'text-gray-400 hover:bg-white/70'}`}>
            <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'} text-sm`}></i>
          </button>
          <div className={`w-full max-w-sm rounded-2xl shadow-xl p-8 animate-scaleIn ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
            <div className="text-center mb-8">
              <div className="w-16 h-16 brand-icon-bg rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-bullseye text-white text-2xl"></i>
              </div>
              <h1 className={`text-2xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-800'}`}>Calibrate</h1>
            </div>
            <div className="text-center mb-6">
              <p className={`text-base font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Choose your language</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Elige tu idioma</p>
            </div>
            <div className="space-y-3">
              <button onClick={() => _pickLang('es')}
                className={`w-full py-4 rounded-2xl font-semibold text-base transition-all flex items-center justify-center gap-3 cursor-pointer active:scale-[0.98] ${
                  (lang || 'es') === 'es'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-200'
                    : darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}>
                <span className="text-2xl" role="img" aria-label="España">🇪🇸</span>
                <span>Español</span>
                {(lang || 'es') === 'es' && <i className="fas fa-check text-sm ml-auto"></i>}
              </button>
              <button onClick={() => _pickLang('en')}
                className={`w-full py-4 rounded-2xl font-semibold text-base transition-all flex items-center justify-center gap-3 cursor-pointer active:scale-[0.98] ${
                  lang === 'en'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-200'
                    : darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}>
                <span className="text-2xl" role="img" aria-label="United States">🇺🇸</span>
                <span>English</span>
                {lang === 'en' && <i className="fas fa-check text-sm ml-auto"></i>}
              </button>
            </div>
          </div>
          <p className={`mt-6 text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
            Solo para amigos · Beta privada
          </p>
        </div>
      );
    }

    const TOTAL_PASOS = 6;
    const PASOS_META = [
      { titulo: t('Tus datos básicos','Your basic data'),
        subtitulo: t('Para calcular tus calorías con precisión','To calculate your calories accurately'),
        icono: 'fa-user-circle' },
      { titulo: t('Nivel de actividad','Activity level'),
        subtitulo: t('Elige el que mejor describe tu semana típica','Choose the one that best describes your typical week'),
        icono: 'fa-person-running' },
      { titulo: t('¿Qué quieres lograr?','What is your goal?'),
        subtitulo: t('Esto define tu plan calórico','This sets your calorie plan'),
        icono: 'fa-bullseye' },
      { titulo: perfil.objetivo === 'perdida'
          ? t('Medidas corporales','Body measurements')
          : perfil.objetivo === 'volumen'
          ? t('Plan de crecimiento','Growth plan')
          : t('Composición corporal','Body composition'),
        subtitulo: perfil.objetivo === 'perdida'
          ? t('Diseña tu roadmap de pérdida de grasa por fases','Design your phased fat loss roadmap')
          : perfil.objetivo === 'volumen'
          ? t('Define tu objetivo y tasa de ganancia muscular','Define your muscle gain goal and rate')
          : t('Optimiza tus macros con base en tu composición corporal real','Optimize macros based on your real body composition'),
        icono: perfil.objetivo === 'perdida' ? 'fa-ruler' : perfil.objetivo === 'volumen' ? 'fa-dumbbell' : 'fa-scale-balanced' },
      { titulo: t('Equipamiento','Equipment'),
        subtitulo: t('Marca lo que tienes disponible para entrenar en casa','Mark what you have available for home training'),
        icono: 'fa-dumbbell' },
      { titulo: t('Preferencias','Preferences'),
        subtitulo: t('Personaliza tus recetas y la duración del plan','Customize your recipes and plan duration'),
        icono: 'fa-sliders' },
    ];
    const meta = PASOS_META[pasoWizard - 1];

    const avanzar = () => {
      const err = {};
      if (pasoWizard === 1) {
        if (!perfil.edad || perfil.edad < 15 || perfil.edad > 100)       err.edad   = t('Ingresa una edad válida (15–100)','Enter a valid age (15–100)');
        if (!perfil.genero)                                               err.genero = t('Selecciona un género','Select a gender');
        if (!perfil.peso || perfil.peso < 30 || perfil.peso > 300)       err.peso   = t('Ingresa un peso válido (30–300 kg)','Enter a valid weight (30–300 kg)');
        if (!perfil.altura || perfil.altura < 100 || perfil.altura > 250) err.altura = t('Ingresa una altura válida (100–250 cm)','Enter a valid height (100–250 cm)');
      }
      // Paso 4: validaciones por objetivo (mantenimiento y volumen son siempre válidos, BF% es opcional)
      if (pasoWizard === 4 && perfil.objetivo === 'perdida' && !roadmapPreview) {
        err.roadmap = t('Completa las medidas o el BF% para generar el roadmap','Complete measurements or BF% to generate roadmap');
      }
      if (Object.keys(err).length > 0) { setErrores(err); return; }
      setErrores({});
      if (pasoWizard === TOTAL_PASOS) {
        handleSubmit({ preventDefault: () => {} });
      } else {
        setPasoWizard(p => p + 1);
      }
    };

    const retroceder = () => { if (pasoWizard > 1) setPasoWizard(p => p - 1); };

    const btnFinalDisabled = false; // validaciones en avanzar()

    const handleWizardKey = (e) => {
      if (e.key === 'Enter' && e.target.tagName === 'INPUT') { e.preventDefault(); avanzar(); }
    };

    // ── Pantalla de explicación post-wizard ────────────────────────────────
    if (showExplicacion && perfilParaExplicar) {
      const pfl = perfilParaExplicar;
      const obj = pfl.objetivo || 'perdida';
      const rm = pfl.roadmap || pfl.roadmapMantenimiento || pfl.roadmapVolumen;
      const calc = rm ? rm.calculados : null;

      // Colores por objetivo
      const objColor = obj === 'perdida' ? { from: 'from-orange-500', to: 'to-red-500', badge: 'bg-orange-100 text-orange-700', accent: 'text-orange-600' }
        : obj === 'mantenimiento' ? { from: 'from-green-500', to: 'to-emerald-600', badge: 'bg-green-100 text-green-700', accent: 'text-green-600' }
        : { from: 'from-blue-500', to: 'to-indigo-600', badge: 'bg-blue-100 text-blue-700', accent: 'text-blue-600' };

      const objLabel = obj === 'perdida' ? 'Pérdida de peso' : obj === 'mantenimiento' ? 'Mantenimiento' : 'Volumen muscular';
      const objMeta = obj === 'perdida' ? 'Precision Nutrition'
        : obj === 'mantenimiento' ? 'Recomposición corporal'
        : 'Lean bulk científico';

      // Nivel A: explicación en lenguaje llano
      const nivelA = () => {
        if (!calc) return null;
        if (obj === 'perdida') return (
          <div className="space-y-3">
            <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-orange-50'}`}>
              <p className={`text-sm font-semibold mb-1 ${darkMode ? 'text-orange-300' : 'text-orange-700'}`}>Tu plan de pérdida de peso</p>
              <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Calculamos cuántas calorías quema tu cuerpo en reposo y con tu actividad diaria. Luego creamos un déficit moderado para quemar grasa sin perder músculo. Cada ~10 semanas hay una pausa de dieta (diet break) para que tu metabolismo se recupere.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { l: 'Calorías diarias', v: calc.caloriasCorte + ' kcal', icon: 'fa-fire', c: 'text-orange-500' },
                { l: 'Proteína diaria', v: calc.proteinaTarget + ' g', icon: 'fa-egg', c: 'text-blue-500' },
                { l: 'BF% actual estimado', v: calc.bfActual != null ? calc.bfActual + '%' : 'Sin medidas', icon: 'fa-person', c: 'text-purple-500' },
                { l: 'Duración estimada', v: calc.mesesTotales ? calc.mesesTotales + ' meses' : '—', icon: 'fa-calendar', c: 'text-green-500' },
              ].map(x => (
                <div key={x.l} className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white border border-gray-100'}`}>
                  <i className={`fas ${x.icon} ${x.c} text-sm mb-1.5`}></i>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{x.l}</div>
                  <div className={`text-base font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{x.v}</div>
                </div>
              ))}
            </div>
            {_resolverMacros(calc, obj) && (() => { const _mg = _resolverMacros(calc, obj); return (
              <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white border border-gray-100'}`}>
                <p className={`text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Distribución de macros diarios</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { l: 'Proteínas', v: _mg.proteina + 'g', c: 'bg-blue-500' },
                    { l: 'Carbohidratos', v: _mg.carbohidratos + 'g', c: 'bg-amber-500' },
                    { l: 'Grasas', v: _mg.grasas + 'g', c: 'bg-rose-500' },
                  ].map(m => (
                    <div key={m.l} className="text-center">
                      <div className={`inline-block px-3 py-1.5 rounded-lg text-white text-sm font-bold ${m.c}`}>{m.v}</div>
                      <div className={`text-[11px] mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{m.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            ); })()}
          </div>
        );
        if (obj === 'mantenimiento') return (
          <div className="space-y-3">
            <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
              <p className={`text-sm font-semibold mb-1 ${darkMode ? 'text-green-300' : 'text-green-700'}`}>Tu plan de mantenimiento</p>
              <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Calculamos exactamente cuántas calorías necesitas para mantener tu peso. Con proteína alta basada en tu masa muscular real, favorecemos la recomposición: mantener (o ganar) músculo mientras el porcentaje de grasa baja gradualmente.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { l: 'Calorías diarias (TDEE)', v: calc.caloriasObjetivo + ' kcal', icon: 'fa-fire', c: 'text-green-500' },
                { l: 'Proteína diaria', v: calc.proteinaTarget + ' g', icon: 'fa-egg', c: 'text-blue-500' },
                { l: 'TDEE calculado', v: calc.tdee + ' kcal', icon: 'fa-calculator', c: 'text-purple-500' },
                { l: 'BF% estimado', v: calc.bfActual != null ? calc.bfActual + '%' : 'Sin medidas', icon: 'fa-person', c: 'text-amber-500' },
              ].map(x => (
                <div key={x.l} className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white border border-gray-100'}`}>
                  <i className={`fas ${x.icon} ${x.c} text-sm mb-1.5`}></i>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{x.l}</div>
                  <div className={`text-base font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{x.v}</div>
                </div>
              ))}
            </div>
            {_resolverMacros(calc, obj) && (() => { const _mg = _resolverMacros(calc, obj); return (
              <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white border border-gray-100'}`}>
                <p className={`text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Macros diarios</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { l: 'Proteínas', v: _mg.proteina + 'g', c: 'bg-blue-500' },
                    { l: 'Carbohidratos', v: _mg.carbohidratos + 'g', c: 'bg-amber-500' },
                    { l: 'Grasas', v: _mg.grasas + 'g', c: 'bg-rose-500' },
                  ].map(m => (
                    <div key={m.l} className="text-center">
                      <div className={`inline-block px-3 py-1.5 rounded-lg text-white text-sm font-bold ${m.c}`}>{m.v}</div>
                      <div className={`text-[11px] mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{m.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            ); })()}
          </div>
        );
        // volumen
        return (
          <div className="space-y-3">
            <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
              <p className={`text-sm font-semibold mb-1 ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>Tu plan de volumen muscular</p>
              <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Calculamos tu gasto energético total y le sumamos un superávit controlado para que tu cuerpo tenga los recursos para construir músculo. Con proteína muy alta basada en masa muscular real, minimizamos la grasa ganada durante el proceso.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { l: 'Calorías diarias', v: calc.caloriasObjetivo + ' kcal', icon: 'fa-fire', c: 'text-blue-500' },
                { l: 'Proteína diaria', v: calc.proteinaTarget + ' g', icon: 'fa-egg', c: 'text-blue-500' },
                { l: 'Superávit', v: '+' + (calc.caloriasObjetivo - calc.tdee) + ' kcal/día', icon: 'fa-arrow-trend-up', c: 'text-green-500' },
                { l: 'Duración est.', v: calc.mesesEstimados ? calc.mesesEstimados + ' meses' : '—', icon: 'fa-calendar', c: 'text-purple-500' },
              ].map(x => (
                <div key={x.l} className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white border border-gray-100'}`}>
                  <i className={`fas ${x.icon} ${x.c} text-sm mb-1.5`}></i>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{x.l}</div>
                  <div className={`text-base font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{x.v}</div>
                </div>
              ))}
            </div>
            {_resolverMacros(calc, obj) && (() => { const _mg = _resolverMacros(calc, obj); return (
              <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white border border-gray-100'}`}>
                <p className={`text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Macros diarios</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { l: 'Proteínas', v: _mg.proteina + 'g', c: 'bg-blue-500' },
                    { l: 'Carbohidratos', v: _mg.carbohidratos + 'g', c: 'bg-amber-500' },
                    { l: 'Grasas', v: _mg.grasas + 'g', c: 'bg-rose-500' },
                  ].map(m => (
                    <div key={m.l} className="text-center">
                      <div className={`inline-block px-3 py-1.5 rounded-lg text-white text-sm font-bold ${m.c}`}>{m.v}</div>
                      <div className={`text-[11px] mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{m.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            ); })()}
          </div>
        );
      };

      // Nivel B: fórmulas paso a paso
      const nivelB = () => {
        if (!calc) return null;
        const bmr = calc.bmr || pfl.bmr;
        const tdee = calc.tdee || pfl.tdee;
        const lbm = calc.lbmActual;
        const bf = calc.bfActual;
        return (
          <div className="space-y-3">
            {/* 01 BMR */}
            <div className={`rounded-2xl overflow-hidden border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
              <div className={`px-4 py-2.5 flex items-center gap-2.5 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <span className="font-display text-[11px] font-bold tracking-widest" style={{color:'var(--color-accent)'}}>01</span>
                <span className={`text-xs font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>BMR — Mifflin-St Jeor</span>
              </div>
              <div className="px-4 py-3">
                <p className={`font-mono text-[11px] leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {pfl.genero === 'femenino'
                    ? `(10×${pfl.peso}) + (6.25×${pfl.altura}) − (5×${pfl.edad}) − 161`
                    : `(10×${pfl.peso}) + (6.25×${pfl.altura}) − (5×${pfl.edad}) + 5`}
                </p>
                {bmr && (
                  <div className={`mt-2.5 pt-2.5 border-t flex items-baseline gap-2 ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <span className={`text-[10px] uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>resultado</span>
                    <span className="font-display text-xl font-bold" style={{color:'var(--color-accent)'}}>{bmr} kcal/día</span>
                  </div>
                )}
              </div>
            </div>
            {/* 02 TDEE */}
            <div className={`rounded-2xl overflow-hidden border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
              <div className={`px-4 py-2.5 flex items-center gap-2.5 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <span className="font-display text-[11px] font-bold tracking-widest" style={{color:'var(--color-accent)'}}>02</span>
                <span className={`text-xs font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>TDEE — Gasto total diario</span>
              </div>
              <div className="px-4 py-3">
                <p className={`font-mono text-[11px] leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>BMR × factor actividad ({pfl.nivelActividad || 'moderada'})</p>
                {tdee && (
                  <div className={`mt-2.5 pt-2.5 border-t flex items-baseline gap-2 ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <span className={`text-[10px] uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>resultado</span>
                    <span className="font-display text-xl font-bold" style={{color:'var(--color-accent)'}}>{tdee} kcal/día</span>
                  </div>
                )}
              </div>
            </div>
            {/* 03 LBM (condicional) */}
            {lbm && (
              <div className={`rounded-2xl overflow-hidden border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
                <div className={`px-4 py-2.5 flex items-center gap-2.5 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <span className="font-display text-[11px] font-bold tracking-widest" style={{color:'var(--color-accent)'}}>03</span>
                  <span className={`text-xs font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Masa magra (LBM)</span>
                </div>
                <div className="px-4 py-3">
                  {bf && <p className={`font-mono text-[11px] leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>BF% Navy = {bf}%  →  {pfl.peso} × (1 − {bf}/100)</p>}
                  <div className={`mt-2.5 pt-2.5 border-t flex items-baseline gap-2 ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <span className={`text-[10px] uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>resultado</span>
                    <span className="font-display text-xl font-bold" style={{color:'var(--color-accent)'}}>{lbm} kg LBM</span>
                  </div>
                </div>
              </div>
            )}
            {/* 04 Proteína */}
            <div className={`rounded-2xl overflow-hidden border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
              <div className={`px-4 py-2.5 flex items-center gap-2.5 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <span className="font-display text-[11px] font-bold tracking-widest" style={{color:'var(--color-accent)'}}>04</span>
                <span className={`text-xs font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Proteína target</span>
              </div>
              <div className="px-4 py-3">
                <p className={`font-mono text-[11px] leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {obj === 'perdida' ? 'LBM × 2.63 g/kg  (mín: peso × 1.6)' : obj === 'mantenimiento' ? 'LBM × 2.0 g/kg  (mín: peso × 1.6)' : 'LBM × 2.4 g/kg  (mín: peso × 1.8)'}
                </p>
                {calc.proteinaTarget && (
                  <div className={`mt-2.5 pt-2.5 border-t flex items-baseline gap-2 ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <span className={`text-[10px] uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>resultado</span>
                    <span className="font-display text-xl font-bold" style={{color:'var(--color-accent)'}}>{calc.proteinaTarget} g/día</span>
                  </div>
                )}
              </div>
            </div>
            {/* 05 Calorías objetivo */}
            <div className={`rounded-2xl overflow-hidden border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
              <div className={`px-4 py-2.5 flex items-center gap-2.5 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <span className="font-display text-[11px] font-bold tracking-widest" style={{color:'var(--color-accent)'}}>05</span>
                <span className={`text-xs font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Calorías objetivo</span>
              </div>
              <div className="px-4 py-3">
                <p className={`font-mono text-[11px] leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {obj === 'perdida' ? 'TDEE − déficit por tasa de pérdida seleccionada' : obj === 'mantenimiento' ? 'TDEE exacto (sin déficit ni superávit)' : 'TDEE + superávit lean bulk'}
                </p>
                {(calc.caloriasCorte || calc.caloriasObjetivo) && (
                  <div className={`mt-2.5 pt-2.5 border-t flex items-baseline gap-2 ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <span className={`text-[10px] uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>resultado</span>
                    <span className="font-display text-xl font-bold" style={{color:'var(--color-accent)'}}>{calc.caloriasCorte || calc.caloriasObjetivo} kcal/día</span>
                  </div>
                )}
              </div>
            </div>
            {/* 06 Split macros */}
            {calc.macrosGramos && (
              <div className={`rounded-2xl overflow-hidden border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
                <div className={`px-4 py-2.5 flex items-center gap-2.5 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <span className="font-display text-[11px] font-bold tracking-widest" style={{color:'var(--color-accent)'}}>06</span>
                  <span className={`text-xs font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Split de macros</span>
                </div>
                <div className="px-4 py-3">
                  <p className={`font-mono text-[11px] leading-relaxed mb-2.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {obj === 'perdida' ? 'Remanente ÷ 57% carbohidratos + 43% grasa' : obj === 'mantenimiento' ? 'Remanente ÷ 45% carbohidratos + 55% grasa' : 'Remanente ÷ 60% carbohidratos + 40% grasa'}
                  </p>
                  <div className={`pt-2.5 border-t flex items-center gap-4 ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></span>
                      <span className="font-display text-base font-bold text-blue-400">{calc.macrosGramos.proteina}g</span>
                      <span className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>prot</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0"></span>
                      <span className="font-display text-base font-bold text-amber-400">{calc.macrosGramos.carbohidratos}g</span>
                      <span className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>carb</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0"></span>
                      <span className="font-display text-base font-bold text-rose-400">{calc.macrosGramos.grasas}g</span>
                      <span className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>grasa</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      };

      // Nivel C: evidencia científica
      const nivelC = () => (
        <div className="space-y-3">
          <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white border border-gray-100'}`}>
            <p className={`text-xs font-bold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Ecuación BMR: Mifflin-St Jeor (1990)</p>
            <p className={`text-[11px] leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Considerada la fórmula más precisa para población general moderna. Error típico ±10% vs calorimetría indirecta. Superior a Harris-Benedict en individuos con sobrepeso.
            </p>
            <p className={`text-[10px] mt-1.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Mifflin MD et al. Am J Clin Nutr. 1990;51(2):241-7.</p>
          </div>
          <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white border border-gray-100'}`}>
            <p className={`text-xs font-bold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Proteína alta en déficit: Helms et al. (2014)</p>
            <p className={`text-[11px] leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              En contexto de déficit calórico, 2.3–3.1 g/kg de LBM minimiza pérdida de masa magra. El punto de 2.63 g/kg representa el centro del rango recomendado para atletas naturales.
            </p>
            <p className={`text-[10px] mt-1.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Helms ER et al. Int J Sport Nutr Exerc Metab. 2014;24(2):127-38.</p>
          </div>
          {obj === 'perdida' && (
            <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white border border-gray-100'}`}>
              <p className={`text-xs font-bold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Diet breaks: Peos et al. (2019)</p>
              <p className={`text-[11px] leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Pausas de 2 semanas a TDEE cada 10 semanas de déficit restauran leptina, cortisol y T3. El grupo con diet breaks perdió igual grasa que el continuo pero preservó más masa magra y tuvo mejor adherencia a 6 meses.
              </p>
              <p className={`text-[10px] mt-1.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Peos JJ et al. Int J Obes. 2019;43(10):2017-2026.</p>
            </div>
          )}
          <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white border border-gray-100'}`}>
            <p className={`text-xs font-bold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>BF% método Navy (Hodgdon & Beckett, 1984)</p>
            <p className={`text-[11px] leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Correlación r=0.89 con DEXA en hombres, r=0.84 en mujeres. Equivalente a bioimpedancia de consumo en precisión. El error típico es ±3–4% de BF absoluto.
            </p>
            <p className={`text-[10px] mt-1.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Hodgdon JA, Beckett MB. Naval Health Research Center. 1984.</p>
          </div>
          {obj === 'volumen' && (
            <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white border border-gray-100'}`}>
              <p className={`text-xs font-bold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Lean bulk — límite de ganancia muscular (Lyle McDonald)</p>
              <p className={`text-[11px] leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Un hombre principiante puede ganar ~0.9 kg/mes de músculo real; un intermedio ~0.45 kg. Superávits &gt;500 kcal aumentan grasa sin acelerar la síntesis proteica. El rango 200–400 kcal optimiza la ratio músculo/grasa.
              </p>
              <p className={`text-[10px] mt-1.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>McDonald L. The Muscle Gain Truth. 2005. / Barbalho et al. J Strength Cond Res. 2020.</p>
            </div>
          )}
        </div>
      );

      return (
        <div className={`min-h-screen py-6 px-4 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-green-50 via-white to-emerald-50'}`}>
          <div className="max-w-3xl mx-auto">
            {/* Header gradient */}
            <div className={`bg-gradient-to-br ${objColor.from} ${objColor.to} rounded-2xl p-5 text-white mb-5 shadow-lg`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold tracking-widest opacity-80 uppercase">Tu plan está listo</span>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-medium">{objMeta}</span>
              </div>
              <h2 className="text-2xl font-extrabold font-display mb-1">{objLabel}</h2>
              <p className="text-sm opacity-80">Basado en tu fisiología real, no en promedios genéricos.</p>
            </div>

            {/* Selector de nivel */}
            <div className={`flex rounded-xl p-1 mb-5 gap-1 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              {[
                { k: 'a', l: 'Resultados' },
                { k: 'b', l: 'Fórmulas' },
                { k: 'c', l: 'Evidencia' },
              ].map(nv => (
                <button key={nv.k} type="button" onClick={() => setNivelExplicacion(nv.k)}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    nivelExplicacion === nv.k
                      ? `${darkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-800 shadow-sm'}`
                      : `${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`
                  }`}>
                  {nv.l}
                </button>
              ))}
            </div>

            {/* Contenido según nivel */}
            <div className="mb-5">
              {nivelExplicacion === 'a' && nivelA()}
              {nivelExplicacion === 'b' && nivelB()}
              {nivelExplicacion === 'c' && nivelC()}
            </div>

            {/* CTA */}
            <button type="button" onClick={() => onComplete(perfilParaExplicar)}
              className={`w-full py-4 rounded-2xl text-white font-bold text-base transition-all active:scale-[0.98] shadow-lg cursor-pointer bg-gradient-to-r ${objColor.from} ${objColor.to}`}>
              <i className="fas fa-check mr-2"></i>Comenzar mi plan
            </button>
            <p className={`text-[11px] text-center mt-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Puedes revisar esta metodología en cualquier momento desde tu perfil.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className={`min-h-screen py-6 px-4 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-green-50 via-white to-emerald-50'}`} onKeyDown={handleWizardKey}>
        <div className="max-w-3xl mx-auto">

          {/* ── Header ── */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 brand-icon-bg rounded-xl flex items-center justify-center">
                <i className="fas fa-bullseye text-white text-base"></i>
              </div>
              <div>
                <div className={`font-bold text-base ${darkMode ? 'text-white' : 'text-gray-800'}`}>Calibrate</div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('Configuración inicial','Initial setup')}</div>
              </div>
            </div>
            <button onClick={onToggleDark} aria-label={darkMode ? 'Modo claro' : 'Modo oscuro'}
              className={`p-2 rounded-xl transition-colors ${darkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-white text-gray-500 hover:bg-gray-100 shadow-sm border border-gray-100'}`}>
              <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'} text-sm`}></i>
            </button>
          </div>

          {/* ── Progress ── */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t(`Paso ${pasoWizard} de ${TOTAL_PASOS}`,`Step ${pasoWizard} of ${TOTAL_PASOS}`)}</span>
              <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{Math.round((pasoWizard / TOTAL_PASOS) * 100)}%</span>
            </div>
            <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${(pasoWizard / TOTAL_PASOS) * 100}%` }}></div>
            </div>
            <div className="flex justify-between mt-2 px-0.5">
              {PASOS_META.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i + 1 < pasoWizard  ? 'bg-green-500' :
                  i + 1 === pasoWizard ? 'bg-green-500 ring-2 ring-green-200 ring-offset-1' :
                  darkMode ? 'bg-gray-600' : 'bg-gray-300'
                }`}></div>
              ))}
            </div>
          </div>

          {/* ── Step card ── */}
          <div className={`rounded-2xl shadow-sm border p-6 mb-4 animate-fadeIn ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${darkMode ? 'bg-green-900/50' : 'bg-green-100'}`}>
                <i className={`fas ${meta.icono} ${darkMode ? 'text-green-400' : 'text-green-600'}`}></i>
              </div>
              <div>
                <h2 className={`text-lg font-semibold leading-tight ${darkMode ? 'text-white' : 'text-gray-800'}`}>{meta.titulo}</h2>
                <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{meta.subtitulo}</p>
              </div>
            </div>

            {/* ── Paso 1: Datos básicos ── */}
            {pasoWizard === 1 && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t('Edad (años)','Age (years)')}</label>
                  <input type="number" value={perfil.edad} onChange={(e) => handleChange('edad', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200'} ${errores.edad ? 'border-red-400 bg-red-50' : ''} focus:border-green-500`}
                    placeholder="25" min="15" max="100" autoFocus />
                  {errores.edad && <p className="text-red-500 text-xs mt-1">{errores.edad}</p>}
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t('Género','Gender')}</label>
                  <select value={perfil.genero} onChange={(e) => handleChange('genero', e.target.value)}
                    style={{
                      appearance: 'none', WebkitAppearance: 'none',
                      backgroundImage: darkMode
                        ? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%239CA3AF' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E\")"
                        : "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E\")",
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.75rem center',
                      backgroundSize: '1.25rem 1.25rem',
                      paddingRight: '2.5rem'
                    }}
                    className={`w-full px-4 py-3 rounded-xl border transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200 bg-white'} ${errores.genero ? 'border-red-400' : ''} focus:border-green-500`}>
                    <option value="" disabled>{t('Selecciona...','Select...')}</option>
                    <option value="masculino">{t('Masculino','Male')}</option>
                    <option value="femenino">{t('Femenino','Female')}</option>
                  </select>
                  {errores.genero && <p className="text-red-500 text-xs mt-1">{errores.genero}</p>}
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t('Peso (kg)','Weight (kg)')}</label>
                  <input type="number" step="0.1" value={perfil.peso} onChange={(e) => handleChange('peso', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200'} ${errores.peso ? 'border-red-400 bg-red-50' : ''} focus:border-green-500`}
                    placeholder="70" min="30" max="300" />
                  {errores.peso && <p className="text-red-500 text-xs mt-1">{errores.peso}</p>}
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t('Altura (cm)','Height (cm)')}</label>
                  <input type="number" value={perfil.altura} onChange={(e) => handleChange('altura', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200'} ${errores.altura ? 'border-red-400 bg-red-50' : ''} focus:border-green-500`}
                    placeholder="170" min="100" max="250" />
                  {errores.altura && <p className="text-red-500 text-xs mt-1">{errores.altura}</p>}
                </div>
              </div>
            )}

            {/* ── Paso 2: Nivel de actividad ── */}
            {pasoWizard === 2 && (
              <div className="space-y-2">
                {Object.entries(FACTORES_ACTIVIDAD).map(([key, info]) => (
                  <label key={key} className={`flex items-center p-3 rounded-xl cursor-pointer transition-all ${
                    perfil.nivelActividad === key
                      ? 'bg-green-50 border-2 border-green-400'
                      : darkMode ? 'bg-gray-700 border-2 border-transparent hover:bg-gray-600' : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                  }`}>
                    <input type="radio" name="actividad" value={key} checked={perfil.nivelActividad === key}
                      onChange={(e) => handleChange('nivelActividad', e.target.value)} className="sr-only" />
                    <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center flex-shrink-0 ${
                      perfil.nivelActividad === key ? 'border-green-500' : 'border-gray-300'
                    }`}>
                      {perfil.nivelActividad === key && <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>}
                    </div>
                    <div>
                      <span className={`text-sm font-medium ${darkMode && perfil.nivelActividad !== key ? 'text-gray-200' : 'text-gray-700'}`}>{t(info.label, FACTORES_ACTIVIDAD_EN[key] || info.label)}</span>
                      <span className="text-xs text-gray-400 ml-2">(×{info.valor})</span>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {/* ── Paso 3: Objetivo ── */}
            {pasoWizard === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'perdida',       icono: 'fa-arrow-trend-down', label: t('Pérdida de peso','Weight loss'),      tag: 'Precision Nutrition', color: 'orange' },
                    { key: 'mantenimiento', icono: 'fa-scale-balanced',   label: t('Mantenimiento','Maintenance'),         tag: t('Recomposición','Recomposition'), color: 'green' },
                    { key: 'volumen',       icono: 'fa-arrow-trend-up',   label: t('Volumen muscular','Muscle gain'),      tag: t('Lean bulk','Lean bulk'), color: 'blue' }
                  ].map(({ key, icono, label, tag, color }) => {
                    const activo = perfil.objetivo === key;
                    const colorMap = { orange: activo ? 'bg-orange-500 text-white shadow-lg' : '', green: activo ? 'bg-green-500 text-white shadow-lg shadow-green-200' : '', blue: activo ? 'bg-blue-500 text-white shadow-lg' : '' };
                    return (
                      <button key={key} type="button" onClick={() => handleObjetivoChange(key)}
                        className={`py-4 px-2 rounded-xl text-center transition-all cursor-pointer ${
                          activo ? colorMap[color] : darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }`}>
                        <i className={`fas ${icono} text-xl mb-2 block`}></i>
                        <div className="font-semibold text-xs leading-tight">{label}</div>
                        <div className={`text-[10px] mt-1 ${activo ? 'opacity-80' : 'text-gray-400'}`}>{tag}</div>
                      </button>
                    );
                  })}
                </div>
                {/* Descripción del objetivo seleccionado */}
                <div className={`text-xs p-3 rounded-xl ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
                  {perfil.objetivo === 'perdida' && (
                    <span><i className="fas fa-fire-flame-curved text-orange-500 mr-1.5"></i>{t('Roadmap por fases con diet breaks, basado en tu masa magra real. Metodología Precision Nutrition + evidencia meta-analítica.','Phased roadmap with diet breaks, based on your actual lean mass. Precision Nutrition methodology + meta-analytic evidence.')}</span>
                  )}
                  {perfil.objetivo === 'mantenimiento' && (
                    <span><i className="fas fa-scale-balanced text-green-500 mr-1.5"></i>{t('Calorías exactas a tu TDEE. Proteína calculada sobre masa magra para optimizar composición corporal sin subir ni bajar de peso.','Exact TDEE calories. Protein calculated on lean mass to optimize body composition without weight change.')}</span>
                  )}
                  {perfil.objetivo === 'volumen' && (
                    <span><i className="fas fa-dumbbell text-blue-500 mr-1.5"></i>{t('Superávit calórico controlado para maximizar ganancia muscular con mínima grasa acumulada (lean bulk). Proteína elevada sobre masa magra.','Controlled caloric surplus to maximize muscle gain with minimal fat (lean bulk). Elevated protein based on lean mass.')}</span>
                  )}
                </div>
              </div>
            )}

            {/* ── Paso 4a: Pérdida de peso — medidas corporales ── */}
            {pasoWizard === 4 && perfil.objetivo === 'perdida' && (
              <div className="space-y-4">
                <div>
                  <div className={`text-xs font-semibold mb-2 uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Medidas corporales</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Cintura (cm)</label>
                      <input type="number" step="0.5" value={perfil.cintura || ''} onChange={(e) => handleChange('cintura', e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`} placeholder="85" />
                    </div>
                    <div>
                      <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Cuello (cm)</label>
                      <input type="number" step="0.5" value={perfil.cuello || ''} onChange={(e) => handleChange('cuello', e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`} placeholder="40" />
                    </div>
                    {perfil.genero === 'femenino' && (
                      <div>
                        <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Cadera (cm)</label>
                        <input type="number" step="0.5" value={perfil.cadera || ''} onChange={(e) => handleChange('cadera', e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`} placeholder="95" />
                      </div>
                    )}
                    <div>
                      <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>BF% manual (opcional)</label>
                      <input type="number" step="0.1" value={perfil.bfOverride || ''} onChange={(e) => handleChange('bfOverride', e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200'}`} placeholder="Sino: Navy auto" />
                    </div>
                  </div>
                  <p className={`text-[11px] mt-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <i className="fas fa-info-circle mr-1"></i>
                    Navy calcula BF% con cintura + cuello{perfil.genero === 'femenino' ? ' + cadera' : ''}. Si tienes bioimpedancia o caliper, completa "BF% manual".
                  </p>
                </div>
                <div>
                  <div className={`text-xs font-semibold mb-2 uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Objetivos</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Peso target (kg)</label>
                      <input type="number" step="0.1" value={perfil.pesoTarget || ''} onChange={(e) => handleChange('pesoTarget', e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200'}`} placeholder="72" />
                    </div>
                    <div>
                      <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>BF% target</label>
                      <input type="number" step="0.1" value={perfil.bfTarget || ''} onChange={(e) => handleChange('bfTarget', e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200'}`} placeholder="10" />
                    </div>
                  </div>
                  <p className={`text-[11px] mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Basta con uno de los dos. El otro se calcula asumiendo que preservás masa magra.</p>
                </div>
                <div>
                  <div className={`text-xs font-semibold mb-2 uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Tasa de pérdida</div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      {k: 'conservadora', l: 'Conservadora', s: '0.4 kg/sem · −300 kcal'},
                      {k: 'moderada',     l: 'Moderada',     s: '0.6 kg/sem · −450 kcal'},
                      {k: 'agresiva',     l: 'Agresiva',     s: '0.8 kg/sem · −600 kcal'},
                    ].map(t => {
                      const activo = (perfil.tasaPerdida || 'moderada') === t.k;
                      return (
                        <button key={t.k} type="button" onClick={() => handleChange('tasaPerdida', t.k)}
                          className={`px-2 py-2 rounded-lg text-xs border transition-colors ${
                            activo
                              ? 'bg-orange-500 text-white border-orange-500'
                              : darkMode ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                          }`}>
                          <div className="font-semibold">{t.l}</div>
                          <div className={`text-[11px] mt-0.5 ${activo ? 'text-orange-100' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t.s}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                {/* Roadmap preview compacto */}
                {roadmapPreview ? (
                  <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-4 text-white animate-fadeIn">
                    <div className="text-xs font-bold tracking-wider opacity-90 mb-2">ROADMAP PREVIEW</div>
                    <div className="grid grid-cols-4 gap-2 mb-2">
                      {[
                        {l: 'BF actual', v: roadmapPreview.calculados.bfActual+'%'},
                        {l: 'BF target', v: roadmapPreview.calculados.bfTarget+'%'},
                        {l: 'Corte', v: roadmapPreview.calculados.caloriasCorte+' kcal'},
                        {l: '~Duración', v: roadmapPreview.calculados.mesesTotales+' meses'},
                      ].map(x => (
                        <div key={x.l} className="bg-white/20 rounded-lg p-2 text-center">
                          <div className="text-[10px] opacity-80 leading-tight">{x.l}</div>
                          <div className="text-xs font-bold mt-0.5">{x.v}</div>
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] opacity-80">{roadmapPreview.fases.length} fases · {roadmapPreview.calculados.cantDietBreaks} diet break{roadmapPreview.calculados.cantDietBreaks !== 1 ? 's' : ''} · proteína {roadmapPreview.calculados.proteinaTarget}g</p>
                  </div>
                ) : (
                  <div className={`text-xs p-3 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-orange-50 text-orange-700 border border-orange-100'}`}>
                    <i className="fas fa-info-circle mr-1"></i>
                    Completa cintura + cuello{perfil.genero === 'femenino' ? ' + cadera' : ''} y al menos un target para ver el roadmap.
                  </div>
                )}
              </div>
            )}

            {/* ── Paso 4b: Mantenimiento — BF% opcional + preview ── */}
            {pasoWizard === 4 && perfil.objetivo === 'mantenimiento' && (
              <div className="space-y-4">
                <div className={`p-3 rounded-xl border ${darkMode ? 'bg-green-900/20 border-green-800/40' : 'bg-green-50 border-green-100'}`}>
                  <p className={`text-xs font-medium ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                    <i className="fas fa-flask mr-1.5"></i>
                    Metodología científica: TDEE exacto + proteína basada en masa magra (LBM × 2.0 g/kg). Distribución de macros optimizada para recomposición.
                  </p>
                </div>
                {/* BF% opcional */}
                <div>
                  <div className={`text-xs font-semibold mb-2 uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Composición corporal <span className={`normal-case font-normal ml-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>(opcional, mejora la precisión)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Cintura (cm)</label>
                      <input type="number" step="0.5" value={perfil.cintura || ''} onChange={(e) => handleChange('cintura', e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`} placeholder="85" />
                    </div>
                    <div>
                      <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Cuello (cm)</label>
                      <input type="number" step="0.5" value={perfil.cuello || ''} onChange={(e) => handleChange('cuello', e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`} placeholder="40" />
                    </div>
                    {perfil.genero === 'femenino' && (
                      <div>
                        <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Cadera (cm)</label>
                        <input type="number" step="0.5" value={perfil.cadera || ''} onChange={(e) => handleChange('cadera', e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`} placeholder="95" />
                      </div>
                    )}
                    <div>
                      <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>BF% manual (opcional)</label>
                      <input type="number" step="0.1" value={perfil.bfOverride || ''} onChange={(e) => handleChange('bfOverride', e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200'}`} placeholder="Sino: Navy auto" />
                    </div>
                  </div>
                  <p className={`text-[11px] mt-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <i className="fas fa-info-circle mr-1"></i>
                    Con cintura + cuello calculamos BF% por método Navy. Más preciso que solo peso.
                  </p>
                </div>
                {/* Preview */}
                {roadmapMantPreview ? (
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white animate-fadeIn">
                    <div className="text-xs font-bold tracking-wider opacity-90 mb-2">PLAN DE MANTENIMIENTO</div>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {[
                        { l: 'TDEE', v: roadmapMantPreview.calculados.tdee + ' kcal' },
                        { l: 'Calorías/día', v: roadmapMantPreview.calculados.caloriasObjetivo + ' kcal' },
                        { l: 'Proteína', v: roadmapMantPreview.calculados.proteinaTarget + ' g/día' },
                        { l: 'BF estimado', v: roadmapMantPreview.calculados.bfActual != null ? roadmapMantPreview.calculados.bfActual + '%' : '—' },
                      ].map(x => (
                        <div key={x.l} className="bg-white/20 rounded-lg p-2 text-center">
                          <div className="text-[10px] opacity-80 leading-tight">{x.l}</div>
                          <div className="text-sm font-bold mt-0.5">{x.v}</div>
                        </div>
                      ))}
                    </div>
                    {roadmapMantPreview.calculados.macrosGramos && (
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-blue-500/30 rounded-lg p-2 text-center">
                          <div className="text-[10px] opacity-80">Proteínas</div>
                          <div className="text-sm font-bold">{roadmapMantPreview.calculados.macrosGramos.proteina}g</div>
                        </div>
                        <div className="bg-amber-500/30 rounded-lg p-2 text-center">
                          <div className="text-[10px] opacity-80">Carbos</div>
                          <div className="text-sm font-bold">{roadmapMantPreview.calculados.macrosGramos.carbohidratos}g</div>
                        </div>
                        <div className="bg-rose-500/30 rounded-lg p-2 text-center">
                          <div className="text-[10px] opacity-80">Grasas</div>
                          <div className="text-sm font-bold">{roadmapMantPreview.calculados.macrosGramos.grasas}g</div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={`text-xs p-3 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                    <i className="fas fa-info-circle mr-1"></i>
                    Completa los datos corporales del paso anterior para ver el preview de tu plan.
                  </div>
                )}
              </div>
            )}

            {/* ── Paso 4c: Volumen — BF% + tasa de ganancia + preview ── */}
            {pasoWizard === 4 && perfil.objetivo === 'volumen' && (
              <div className="space-y-4">
                <div className={`p-3 rounded-xl border ${darkMode ? 'bg-blue-900/20 border-blue-800/40' : 'bg-blue-50 border-blue-100'}`}>
                  <p className={`text-xs font-medium ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                    <i className="fas fa-flask mr-1.5"></i>
                    Lean bulk científico: superávit controlado (200–400 kcal) + proteína LBM × 2.4 g/kg. Minimiza grasa ganada mientras maximiza masa muscular.
                  </p>
                </div>
                {/* BF% opcional */}
                <div>
                  <div className={`text-xs font-semibold mb-2 uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Composición corporal <span className={`normal-case font-normal ml-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>(opcional)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Cintura (cm)</label>
                      <input type="number" step="0.5" value={perfil.cintura || ''} onChange={(e) => handleChange('cintura', e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`} placeholder="85" />
                    </div>
                    <div>
                      <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Cuello (cm)</label>
                      <input type="number" step="0.5" value={perfil.cuello || ''} onChange={(e) => handleChange('cuello', e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`} placeholder="40" />
                    </div>
                    {perfil.genero === 'femenino' && (
                      <div>
                        <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Cadera (cm)</label>
                        <input type="number" step="0.5" value={perfil.cadera || ''} onChange={(e) => handleChange('cadera', e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`} placeholder="95" />
                      </div>
                    )}
                    <div>
                      <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>BF% manual (opcional)</label>
                      <input type="number" step="0.1" value={perfil.bfOverride || ''} onChange={(e) => handleChange('bfOverride', e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200'}`} placeholder="Sino: Navy auto" />
                    </div>
                  </div>
                </div>
                {/* Tasa de ganancia */}
                <div>
                  <div className={`text-xs font-semibold mb-2 uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Tasa de ganancia muscular</div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { k: 'conservadora', l: 'Conservadora', s: '+200 kcal · ~0.2 kg/mes' },
                      { k: 'moderada',     l: 'Moderada',     s: '+300 kcal · ~0.3 kg/mes' },
                      { k: 'agresiva',     l: 'Agresiva',     s: '+400 kcal · ~0.5 kg/mes' },
                    ].map(tr => {
                      const activo = (perfil.tasaGanancia || 'moderada') === tr.k;
                      return (
                        <button key={tr.k} type="button" onClick={() => handleChange('tasaGanancia', tr.k)}
                          className={`px-2 py-2 rounded-lg text-xs border transition-colors cursor-pointer ${
                            activo
                              ? 'bg-blue-500 text-white border-blue-500'
                              : darkMode ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                          }`}>
                          <div className="font-semibold">{tr.l}</div>
                          <div className={`text-[11px] mt-0.5 ${activo ? 'text-blue-100' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{tr.s}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                {/* Peso objetivo opcional */}
                <div>
                  <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Peso objetivo (kg) <span className="font-normal opacity-70">— opcional</span></label>
                  <input type="number" step="0.5" value={perfil.pesoObjetivoVol || ''} onChange={(e) => handleChange('pesoObjetivoVol', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200'}`}
                    placeholder={`Ej: ${perfil.peso ? Math.round(Number(perfil.peso) + 5) : 80}`} />
                  <p className={`text-[11px] mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Se calcula el tiempo estimado para alcanzarlo con tu tasa seleccionada.</p>
                </div>
                {/* Preview */}
                {roadmapVolPreview ? (
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white animate-fadeIn">
                    <div className="text-xs font-bold tracking-wider opacity-90 mb-2">PLAN DE VOLUMEN</div>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {[
                        { l: 'TDEE', v: roadmapVolPreview.calculados.tdee + ' kcal' },
                        { l: 'Objetivo/día', v: roadmapVolPreview.calculados.caloriasObjetivo + ' kcal' },
                        { l: 'Proteína', v: roadmapVolPreview.calculados.proteinaTarget + ' g/día' },
                        { l: 'Duración est.', v: roadmapVolPreview.calculados.mesesEstimados ? roadmapVolPreview.calculados.mesesEstimados + ' meses' : '—' },
                      ].map(x => (
                        <div key={x.l} className="bg-white/20 rounded-lg p-2 text-center">
                          <div className="text-[10px] opacity-80 leading-tight">{x.l}</div>
                          <div className="text-sm font-bold mt-0.5">{x.v}</div>
                        </div>
                      ))}
                    </div>
                    {roadmapVolPreview.calculados.macrosGramos && (
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-blue-400/30 rounded-lg p-2 text-center">
                          <div className="text-[10px] opacity-80">Proteínas</div>
                          <div className="text-sm font-bold">{roadmapVolPreview.calculados.macrosGramos.proteina}g</div>
                        </div>
                        <div className="bg-amber-500/30 rounded-lg p-2 text-center">
                          <div className="text-[10px] opacity-80">Carbos</div>
                          <div className="text-sm font-bold">{roadmapVolPreview.calculados.macrosGramos.carbohidratos}g</div>
                        </div>
                        <div className="bg-rose-500/30 rounded-lg p-2 text-center">
                          <div className="text-[10px] opacity-80">Grasas</div>
                          <div className="text-sm font-bold">{roadmapVolPreview.calculados.macrosGramos.grasas}g</div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={`text-xs p-3 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
                    <i className="fas fa-info-circle mr-1"></i>
                    Completa los datos del paso anterior para ver el preview de tu plan de volumen.
                  </div>
                )}
              </div>
            )}

            {/* ── Paso 5: Equipamiento ── */}
            {pasoWizard === 5 && (() => {
              const todosEquipos = (window.NP_RoadmapData && window.NP_RoadmapData.EQUIPOS_DISPONIBLES) || [];
              const categorias = [
                { id: 'base',       label: 'Siempre disponible', icono: 'fa-person' },
                { id: 'cardio',     label: 'Cardio',             icono: 'fa-heart-pulse' },
                { id: 'pesos',      label: 'Pesos libres',       icono: 'fa-dumbbell' },
                { id: 'maquinas',   label: 'Máquinas y cables',  icono: 'fa-gear' },
                { id: 'accesorios', label: 'Accesorios',         icono: 'fa-wrench' },
              ];
              const toggleEq = (id) => {
                const eq = todosEquipos.find(e => e.id === id);
                if (eq && eq.siempre) return;
                const nueva = equiposWizard.includes(id)
                  ? equiposWizard.filter(x => x !== id)
                  : [...equiposWizard, id];
                setEquiposWizard(nueva);
                localStorage.setItem('nutriplan_equipos', JSON.stringify(nueva));
              };
              return (
                <div className="space-y-4">
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <i className="fas fa-info-circle mr-1"></i>
                    Los ejercicios se adaptan automáticamente a lo que marcas. Peso corporal siempre incluido.
                  </p>
                  {categorias.map(cat => {
                    const items = todosEquipos.filter(e => e.cat === cat.id);
                    if (!items.length) return null;
                    return (
                      <div key={cat.id}>
                        <div className={`text-xs font-semibold mb-2 uppercase tracking-wide flex items-center gap-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          <i className={`fas ${cat.icono} text-xs`}></i>{cat.label}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {items.map(eq => {
                            const activo = equiposWizard.includes(eq.id);
                            return (
                              <button key={eq.id} type="button" onClick={() => toggleEq(eq.id)}
                                disabled={!!eq.siempre}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium border transition-all ${
                                  activo
                                    ? eq.siempre
                                      ? `${darkMode ? 'bg-green-900/40 border-green-700 text-green-400' : 'bg-green-100 border-green-400 text-green-700'} cursor-default`
                                      : `${darkMode ? 'bg-green-900/40 border-green-600 text-green-400' : 'bg-green-100 border-green-400 text-green-700'}`
                                    : darkMode
                                      ? 'bg-transparent border-gray-600 text-gray-400 hover:border-gray-400 hover:text-gray-200'
                                      : 'bg-transparent border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700'
                                }`}>
                                <i className={`fas ${eq.icono} text-xs`}></i>
                                {eq.nombre}
                                {activo && !eq.siempre && <i className="fas fa-check text-[10px] ml-0.5"></i>}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {/* ── Paso 6: Preferencias ── */}
            {pasoWizard === 6 && (
              <div className="space-y-5">
                {/* Restricciones */}
                <div>
                  <div className={`text-xs font-semibold mb-2 uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Restricciones alimentarias</div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {[
                      {key: 'sinGluten',   label: 'Sin gluten',    icon: '🌾'},
                      {key: 'sinLactosa',  label: 'Sin lactosa',   icon: '🥛'},
                      {key: 'vegetariano', label: 'Vegetariano',   icon: '🥬'},
                    ].map(({key, label, icon}) => (
                      <label key={key} className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all ${
                        perfil[key] ? 'bg-green-100 border-2 border-green-400 text-green-800'
                          : darkMode ? 'bg-gray-700 border-2 border-transparent text-gray-300 hover:bg-gray-600' : 'bg-gray-50 border-2 border-transparent text-gray-600 hover:bg-gray-100'
                      }`}>
                        <input type="checkbox" checked={perfil[key]} onChange={(e) => handleChange(key, e.target.checked)} className="sr-only" />
                        <span>{icon}</span>
                        <span className="text-sm font-medium">{label}</span>
                        {perfil[key] && <i className="fas fa-check text-green-600 text-xs"></i>}
                      </label>
                    ))}
                  </div>
                  <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Ingredientes a excluir (opcional, separados por comas)</label>
                  <textarea value={perfil.ingredientesExcluidosTexto}
                    onChange={(e) => handleChange('ingredientesExcluidosTexto', e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border transition-colors resize-none text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200'} focus:border-green-500`}
                    rows="2" placeholder="Ej: maní, camarones, apio..." />
                </div>
                {/* Ritmo de cocina */}
                <div>
                  <div className={`text-xs font-semibold mb-2 uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Ritmo de cocina</div>
                  <div className="space-y-2">
                    <label className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
                      perfil.soloRapidas ? 'bg-amber-100 border-2 border-amber-400 text-amber-900'
                        : darkMode ? 'bg-gray-700 border-2 border-transparent text-gray-300 hover:bg-gray-600' : 'bg-gray-50 border-2 border-transparent text-gray-600 hover:bg-gray-100'
                    }`}>
                      <input type="checkbox" checked={!!perfil.soloRapidas} onChange={(e) => handleChange('soloRapidas', e.target.checked)} className="sr-only" />
                      <i className="fas fa-bolt text-amber-500 text-lg flex-shrink-0"></i>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Solo recetas rápidas</div>
                        <div className="text-xs opacity-70">Almuerzo y cena bajo tiempo máximo</div>
                      </div>
                      {perfil.soloRapidas && <i className="fas fa-check text-amber-700"></i>}
                    </label>
                    {perfil.soloRapidas && (
                      <div className="flex items-center gap-2 pl-2">
                        <span className={`text-xs flex-shrink-0 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Máx:</span>
                        {[15, 20, 25, 30, 40].map(min => (
                          <button key={min} type="button" onClick={() => handleChange('maxTiempoMin', min)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                              (perfil.maxTiempoMin || 25) === min
                                ? 'bg-amber-500 text-white shadow-sm'
                                : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}>{min}min</button>
                        ))}
                      </div>
                    )}
                    <label className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
                      perfil.modoSobras ? 'bg-indigo-100 border-2 border-indigo-400 text-indigo-900'
                        : darkMode ? 'bg-gray-700 border-2 border-transparent text-gray-300 hover:bg-gray-600' : 'bg-gray-50 border-2 border-transparent text-gray-600 hover:bg-gray-100'
                    }`}>
                      <input type="checkbox" checked={!!perfil.modoSobras} onChange={(e) => handleChange('modoSobras', e.target.checked)} className="sr-only" />
                      <i className="fas fa-recycle text-indigo-500 text-lg flex-shrink-0"></i>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Modo sobras</div>
                        <div className="text-xs opacity-70">Cocinar 1 vez, comer 2 · ahorra 6 cocciones/semana</div>
                      </div>
                      {perfil.modoSobras && <i className="fas fa-check text-indigo-700"></i>}
                    </label>
                    <label className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
                      perfil.usaThermomix ? 'bg-indigo-50 border-2 border-indigo-300 text-indigo-900'
                        : darkMode ? 'bg-gray-700 border-2 border-transparent text-gray-300 hover:bg-gray-600' : 'bg-gray-50 border-2 border-transparent text-gray-600 hover:bg-gray-100'
                    }`}>
                      <input type="checkbox" checked={!!perfil.usaThermomix} onChange={(e) => handleChange('usaThermomix', e.target.checked)} className="sr-only" />
                      <i className="fas fa-blender text-indigo-500 text-lg flex-shrink-0"></i>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Tengo Thermomix TM6</div>
                        <div className="text-xs opacity-70">Instrucciones y tiempos adaptados para Thermomix</div>
                      </div>
                      {perfil.usaThermomix && <i className="fas fa-check text-indigo-700"></i>}
                    </label>
                  </div>
                </div>
                {/* Duración */}
                <div>
                  <div className={`text-xs font-semibold mb-2 uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Duración del plan</div>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map(n => (
                      <button key={n} type="button" onClick={() => handleChange('numSemanas', n)}
                        className={`py-3 rounded-xl font-medium text-sm transition-all ${
                          perfil.numSemanas === n
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                            : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}>
                        {n} {n === 1 ? 'sem.' : 'sems.'}
                      </button>
                    ))}
                  </div>
                  <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <i className="fas fa-info-circle mr-1"></i>
                    {perfil.numSemanas > 1 ? `Se generarán ${perfil.numSemanas} semanas con recetas distintas.` : 'Plan estándar de 7 días.'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── Navegación ── */}
          <div className="flex gap-3">
            {pasoWizard > 1 && (
              <button type="button" onClick={retroceder}
                className={`flex-1 py-3.5 rounded-2xl font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 shadow-sm'}`}>
                <i className="fas fa-arrow-left text-sm"></i>{t('Atrás','Back')}
              </button>
            )}
            <button type="button" onClick={avanzar} disabled={!!btnFinalDisabled}
              style={pasoWizard > 1 ? { flex: 2 } : {}}
              className={`${pasoWizard > 1 ? '' : 'w-full'} py-3.5 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                btnFinalDisabled
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : pasoWizard === TOTAL_PASOS
                    ? perfil.fatLossMode
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-200 hover:shadow-xl active:scale-[0.98]'
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-200 hover:shadow-xl active:scale-[0.98]'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-200 hover:shadow-xl active:scale-[0.98]'
              }`}>
              {pasoWizard === TOTAL_PASOS ? (
                <><i className={`fas ${perfil.objetivo === 'perdida' ? 'fa-fire' : perfil.objetivo === 'volumen' ? 'fa-arrow-trend-up' : 'fa-scale-balanced'} text-sm`}></i>
                  {' '}{t('Generar mi plan','Generate my plan')}</>
              ) : (
                <>{t('Continuar','Continue')} <i className="fas fa-arrow-right text-sm"></i></>
              )}
            </button>
          </div>

        </div>
      </div>
    );
  }
  // ── fin wizard ────────────────────────────────────────────────────────────

  // ── Modal: ver metodología desde modo edición ─────────────────────────────
  if (verMetodologia && perfilInicial) {
    const pfl = perfilInicial;
    const obj = pfl.objetivo || (pfl.fatLossMode ? 'perdida' : null);
    const rm = pfl.roadmap || pfl.roadmapMantenimiento || pfl.roadmapVolumen;
    const calc = rm ? rm.calculados : null;
    const objColor = !obj || obj === 'perdida' ? { from: 'from-orange-500', to: 'to-red-500' }
      : obj === 'mantenimiento' ? { from: 'from-green-500', to: 'to-emerald-600' }
      : { from: 'from-blue-500', to: 'to-indigo-600' };
    const objLabel = !obj || obj === 'perdida' ? 'Pérdida de peso'
      : obj === 'mantenimiento' ? 'Mantenimiento' : 'Volumen muscular';
    const objMeta = !obj || obj === 'perdida' ? 'Precision Nutrition'
      : obj === 'mantenimiento' ? 'Recomposición corporal' : 'Lean bulk científico';

    // Nivel A simple cards
    const _nivelAEdit = () => {
      if (!calc) return (
        <div className={`p-4 rounded-xl text-sm ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
          Reconfigura tu perfil para ver los cálculos actualizados.
        </div>
      );
      const rows = obj === 'perdida'
        ? [{ l: 'Calorías diarias', v: (calc.caloriasCorte || calc.caloriasObjetivo || '—') + ' kcal', i: 'fa-fire', c: 'text-orange-500' },
           { l: 'Proteína diaria', v: (calc.proteinaTarget || '—') + ' g', i: 'fa-egg', c: 'text-blue-500' },
           { l: 'BF% estimado', v: calc.bfActual != null ? calc.bfActual + '%' : 'Sin medidas', i: 'fa-person', c: 'text-purple-500' },
           { l: 'Duración est.', v: calc.mesesTotales ? calc.mesesTotales + ' meses' : '—', i: 'fa-calendar', c: 'text-green-500' }]
        : obj === 'mantenimiento'
        ? [{ l: 'Calorías (TDEE)', v: (calc.caloriasObjetivo || '—') + ' kcal', i: 'fa-fire', c: 'text-green-500' },
           { l: 'Proteína diaria', v: (calc.proteinaTarget || '—') + ' g', i: 'fa-egg', c: 'text-blue-500' },
           { l: 'TDEE calculado', v: (calc.tdee || '—') + ' kcal', i: 'fa-calculator', c: 'text-purple-500' },
           { l: 'BF% estimado', v: calc.bfActual != null ? calc.bfActual + '%' : 'Sin medidas', i: 'fa-person', c: 'text-amber-500' }]
        : [{ l: 'Calorías diarias', v: (calc.caloriasObjetivo || '—') + ' kcal', i: 'fa-fire', c: 'text-blue-500' },
           { l: 'Proteína diaria', v: (calc.proteinaTarget || '—') + ' g', i: 'fa-egg', c: 'text-blue-500' },
           { l: 'Superávit', v: calc.tdee ? '+' + (calc.caloriasObjetivo - calc.tdee) + ' kcal' : '—', i: 'fa-arrow-trend-up', c: 'text-green-500' },
           { l: 'BF% estimado', v: calc.bfActual != null ? calc.bfActual + '%' : 'Sin medidas', i: 'fa-person', c: 'text-purple-500' }];
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {rows.map(x => (
              <div key={x.l} className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white border border-gray-100'}`}>
                <i className={`fas ${x.i} ${x.c} text-sm mb-1.5`}></i>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{x.l}</div>
                <div className={`text-base font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{x.v}</div>
              </div>
            ))}
          </div>
          {_resolverMacros(calc, obj) && (() => { const _mg = _resolverMacros(calc, obj); return (
            <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white border border-gray-100'}`}>
              <p className={`text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Macros diarios</p>
              <div className="grid grid-cols-3 gap-2">
                {[{ l: 'Proteínas', v: _mg.proteina + 'g', c: 'bg-blue-500' },
                  { l: 'Carbohidratos', v: _mg.carbohidratos + 'g', c: 'bg-amber-500' },
                  { l: 'Grasas', v: _mg.grasas + 'g', c: 'bg-rose-500' }].map(m => (
                  <div key={m.l} className="text-center">
                    <div className={`inline-block px-3 py-1.5 rounded-lg text-white text-sm font-bold ${m.c}`}>{m.v}</div>
                    <div className={`text-[11px] mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{m.l}</div>
                  </div>
                ))}
              </div>
            </div>
          ); })()}
        </div>
      );
    };

    return (
      <div className={`min-h-screen py-6 px-4 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-green-50 via-white to-emerald-50'}`}>
        <div className="max-w-3xl mx-auto">
          <button onClick={() => setVerMetodologia(false)}
            className={`mb-4 flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>
            <i className="fas fa-arrow-left text-xs"></i>Volver al perfil
          </button>
          <div className={`bg-gradient-to-br ${objColor.from} ${objColor.to} rounded-2xl p-5 text-white mb-5 shadow-lg`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold tracking-widest opacity-80 uppercase">Mi metodología</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-medium">{objMeta}</span>
            </div>
            <h2 className="text-xl font-extrabold font-display">{objLabel}</h2>
          </div>
          <div className={`flex rounded-xl p-1 mb-5 gap-1 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            {[{ k: 'a', l: 'Resultados' }, { k: 'b', l: 'Fórmulas' }, { k: 'c', l: 'Evidencia' }].map(nv => (
              <button key={nv.k} type="button" onClick={() => setNivelExplicacion(nv.k)}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${nivelExplicacion === nv.k ? darkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-800 shadow-sm' : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
                {nv.l}
              </button>
            ))}
          </div>
          <div>
            {nivelExplicacion === 'a' && _nivelAEdit()}
            {nivelExplicacion === 'b' && (
              <div className="space-y-3">
                {[
                  { step: '01', t: 'BMR — Mifflin-St Jeor', b: pfl.genero === 'femenino' ? `(10×${pfl.peso}) + (6.25×${pfl.altura}) − (5×${pfl.edad}) − 161` : `(10×${pfl.peso}) + (6.25×${pfl.altura}) − (5×${pfl.edad}) + 5`, r: calc && calc.bmr ? calc.bmr + ' kcal/día' : null },
                  { step: '02', t: 'TDEE — Gasto total', b: `BMR × factor actividad (${pfl.nivelActividad || 'moderada'})`, r: calc && calc.tdee ? calc.tdee + ' kcal/día' : null },
                  { step: '03', t: 'Proteína target', b: obj === 'volumen' ? 'LBM × 2.4 g/kg  (mín: peso × 1.8)' : obj === 'mantenimiento' ? 'LBM × 2.0 g/kg  (mín: peso × 1.6)' : 'LBM × 2.63 g/kg  (mín: peso × 1.6)', r: calc && calc.proteinaTarget ? calc.proteinaTarget + ' g/día' : null },
                  { step: '04', t: 'Calorías objetivo', b: obj === 'perdida' ? 'TDEE − déficit por tasa de pérdida' : obj === 'mantenimiento' ? 'TDEE exacto (sin déficit)' : 'TDEE + superávit lean bulk', r: calc ? ((calc.caloriasCorte || calc.caloriasObjetivo) ? (calc.caloriasCorte || calc.caloriasObjetivo) + ' kcal/día' : null) : null },
                  { step: '05', t: 'Split de macros', b: obj === 'perdida' ? 'Remanente ÷ 57% carbohidratos + 43% grasa' : obj === 'mantenimiento' ? 'Remanente ÷ 45% carbohidratos + 55% grasa' : 'Remanente ÷ 60% carbohidratos + 40% grasa', r: null, isMacros: true },
                ].map(row => (
                  <div key={row.t} className={`rounded-2xl overflow-hidden border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
                    <div className={`px-4 py-2.5 flex items-center gap-2.5 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <span className="font-display text-[11px] font-bold tracking-widest" style={{color:'var(--color-accent)'}}>{row.step}</span>
                      <span className={`text-xs font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{row.t}</span>
                    </div>
                    <div className="px-4 py-3">
                      <p className={`font-mono text-[11px] leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{row.b}</p>
                      {row.r && (
                        <div className={`mt-2.5 pt-2.5 border-t flex items-baseline gap-2 ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                          <span className={`text-[10px] uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>resultado</span>
                          <span className="font-display text-xl font-bold" style={{color:'var(--color-accent)'}}>{row.r}</span>
                        </div>
                      )}
                      {row.isMacros && calc && calc.macrosGramos && (
                        <div className={`mt-2.5 pt-2.5 border-t flex items-center gap-4 ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></span>
                            <span className="font-display text-base font-bold text-blue-400">{calc.macrosGramos.proteina}g</span>
                            <span className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>prot</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0"></span>
                            <span className="font-display text-base font-bold text-amber-400">{calc.macrosGramos.carbohidratos}g</span>
                            <span className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>carb</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0"></span>
                            <span className="font-display text-base font-bold text-rose-400">{calc.macrosGramos.grasas}g</span>
                            <span className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>grasa</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {nivelExplicacion === 'c' && (
              <div className="space-y-3">
                {[
                  { t: 'Mifflin-St Jeor (1990)', b: 'Fórmula BMR más precisa para población moderna. Error ±10% vs calorimetría indirecta. Superior a Harris-Benedict en personas con sobrepeso.', ref: 'Mifflin MD et al. Am J Clin Nutr. 1990;51(2):241-7.' },
                  { t: 'Helms et al. (2014) — Proteína en déficit', b: 'En déficit calórico, 2.3–3.1 g/kg LBM minimiza pérdida de masa magra. El punto 2.63 g/kg es el centro del rango recomendado para atletas naturales.', ref: 'Helms ER et al. Int J Sport Nutr Exerc Metab. 2014;24(2):127-38.' },
                  ...(obj === 'perdida' ? [{ t: 'Peos et al. (2019) — Diet breaks', b: 'Pausas de 2 semanas a TDEE cada 10 semanas restauran leptina, cortisol y T3. Igual pérdida de grasa, más masa magra preservada y mejor adherencia a 6 meses.', ref: 'Peos JJ et al. Int J Obes. 2019;43(10):2017-2026.' }] : []),
                  { t: 'Hodgdon & Beckett (1984) — Navy BF%', b: 'Correlación r=0.89 con DEXA en hombres. Error típico ±3–4% de BF absoluto. Equivalente a bioimpedancia de consumo.', ref: 'Hodgdon JA, Beckett MB. Naval Health Research Center. 1984.' },
                ].map(row => (
                  <div key={row.t} className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white border border-gray-100'}`}>
                    <p className={`text-xs font-bold mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{row.t}</p>
                    <p className={`text-[11px] leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{row.b}</p>
                    <p className={`text-[10px] mt-1.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{row.ref}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 px-4 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-green-50 via-white to-emerald-50'}`}>
      <div className="max-w-3xl mx-auto animate-fadeIn">
        <div className="text-center mb-8">
          <div className="flex justify-between mb-4">
            {tienePlan && onBack ? (
              <button onClick={onBack} className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2 ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                <i className="fas fa-arrow-left"></i>Volver al plan
              </button>
            ) : <div></div>}
            {/* A6: aria-label en botón dark mode de ProfileSetup */}
            <button onClick={onToggleDark} aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className={`p-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>
          </div>
          <div className="inline-flex items-center justify-center w-16 h-16 brand-icon-bg rounded-2xl mb-4">
            <i className="fas fa-bullseye text-white text-2xl"></i>
          </div>
          <h1 className={`text-3xl font-bold tracking-tight mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Calibrate</h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{tienePlan ? 'Edita tu perfil' : 'Para calcular tu plan necesito tus datos.'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ── Mi metodología (visible si hay roadmap/plan científico) ── */}
          {perfilInicial && (perfilInicial.roadmap || perfilInicial.roadmapMantenimiento || perfilInicial.roadmapVolumen || perfilInicial.fatLossMode) && (
            <button type="button" onClick={() => { setVerMetodologia(true); setNivelExplicacion('a'); }}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border transition-all cursor-pointer ${
                darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-100 hover:bg-gray-50 shadow-sm'
              }`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  (perfilInicial.objetivo === 'mantenimiento') ? 'bg-green-100' : (perfilInicial.objetivo === 'volumen') ? 'bg-blue-100' : 'bg-orange-100'
                }`}>
                  <i className={`fas fa-flask text-sm ${
                    (perfilInicial.objetivo === 'mantenimiento') ? 'text-green-600' : (perfilInicial.objetivo === 'volumen') ? 'text-blue-600' : 'text-orange-600'
                  }`}></i>
                </div>
                <div className="text-left">
                  <div className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Mi metodología</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {perfilInicial.objetivo === 'mantenimiento' ? 'Recomposición · TDEE exacto'
                      : perfilInicial.objetivo === 'volumen' ? 'Lean bulk · LBM × 2.4 g/kg proteína'
                      : 'Precision Nutrition · LBM × 2.63 g/kg proteína'}
                  </div>
                </div>
              </div>
              <i className={`fas fa-chevron-right text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}></i>
            </button>
          )}

          {/* Datos Personales */}
          <div className={`rounded-2xl shadow-sm border p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              <i className="fas fa-user-circle text-green-500"></i>
              Datos Personales
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Edad (años)</label>
                <input type="number" value={perfil.edad} onChange={(e) => handleChange("edad", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200'} ${errores.edad ? 'border-red-400 bg-red-50' : ''} focus:border-green-500`}
                  placeholder="25" min="15" max="100" />
                {errores.edad && <p className="text-red-500 text-xs mt-1">{errores.edad}</p>}
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Género</label>
                <select value={perfil.genero} onChange={(e) => handleChange("genero", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200 bg-white'} focus:border-green-500`}>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Peso (kg)</label>
                <input type="number" step="0.1" value={perfil.peso} onChange={(e) => handleChange("peso", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200'} ${errores.peso ? 'border-red-400 bg-red-50' : ''} focus:border-green-500`}
                  placeholder="70" min="30" max="300" />
                {errores.peso && <p className="text-red-500 text-xs mt-1">{errores.peso}</p>}
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Altura (cm)</label>
                <input type="number" value={perfil.altura} onChange={(e) => handleChange("altura", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200'} ${errores.altura ? 'border-red-400 bg-red-50' : ''} focus:border-green-500`}
                  placeholder="170" min="100" max="250" />
                {errores.altura && <p className="text-red-500 text-xs mt-1">{errores.altura}</p>}
              </div>
            </div>
          </div>

          {/* Nivel de Actividad */}
          <div className={`rounded-2xl shadow-sm border p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              <i className="fas fa-running text-green-500"></i>
              Nivel de Actividad
            </h2>
            <div className="space-y-2">
              {Object.entries(FACTORES_ACTIVIDAD).map(([key, info]) => (
                <label key={key} className={`flex items-center p-3 rounded-xl cursor-pointer transition-all ${
                  perfil.nivelActividad === key
                    ? 'bg-green-50 border-2 border-green-400'
                    : darkMode ? 'bg-gray-700 border-2 border-transparent hover:bg-gray-600' : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                }`}>
                  <input type="radio" name="actividad" value={key} checked={perfil.nivelActividad === key}
                    onChange={(e) => handleChange("nivelActividad", e.target.value)} className="sr-only" />
                  <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center flex-shrink-0 ${
                    perfil.nivelActividad === key ? 'border-green-500' : 'border-gray-300'
                  }`}>
                    {perfil.nivelActividad === key && <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>}
                  </div>
                  <div>
                    <span className={`text-sm font-medium ${darkMode && perfil.nivelActividad !== key ? 'text-gray-200' : 'text-gray-700'}`}>{info.label}</span>
                    <span className="text-xs text-gray-400 ml-2">(×{info.valor})</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Objetivo — v20260428ai: goal cards unificados, sin kcal subtitles */}
          <div className={`rounded-2xl shadow-sm border p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              <i className="fas fa-bullseye text-green-500"></i>
              Objetivo
            </h2>
            <div className="grid grid-cols-3 gap-3 mb-3">
              {[
                { key: 'perdida',       icono: 'fa-arrow-trend-down', label: 'Pérdida de peso',  tag: 'Precision Nutrition', activeClasses: 'bg-orange-500 text-white shadow-lg shadow-orange-200 border-orange-500' },
                { key: 'mantenimiento', icono: 'fa-scale-balanced',   label: 'Mantenimiento',     tag: 'Recomposición',        activeClasses: 'bg-green-500 text-white shadow-lg shadow-green-200 border-green-500' },
                { key: 'volumen',       icono: 'fa-arrow-trend-up',   label: 'Volumen muscular',  tag: 'Lean bulk',            activeClasses: 'bg-blue-500 text-white shadow-lg shadow-blue-200 border-blue-500' },
              ].map(({ key, icono, label, tag, activeClasses }) => {
                const activo = perfil.objetivo === key;
                return (
                  <button key={key} type="button" onClick={() => handleObjetivoChange(key)}
                    className={`p-3 rounded-xl text-center transition-all border cursor-pointer ${
                      activo ? activeClasses
                      : darkMode ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}>
                    <i className={`fas ${icono} text-lg mb-1`}></i>
                    <div className="font-semibold text-xs leading-tight">{label}</div>
                    <div className={`text-[10px] mt-1 font-medium ${activo ? 'opacity-80' : darkMode ? 'text-gray-400' : 'text-gray-400'}`}>{tag}</div>
                  </button>
                );
              })}
            </div>
            <div className={`text-xs p-2.5 rounded-xl ${darkMode ? 'bg-gray-700/60 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
              {perfil.objetivo === 'perdida' && 'Roadmap por fases con diet breaks. Proteína basada en masa magra (LBM × 2.63 g/kg). Metodología Precision Nutrition.'}
              {perfil.objetivo === 'mantenimiento' && 'Calorías exactas a tu TDEE. Proteína basada en masa magra (LBM × 2.0 g/kg). Favorece recomposición corporal gradual.'}
              {perfil.objetivo === 'volumen' && 'Superávit calórico controlado (200–400 kcal). Proteína alta para maximizar síntesis muscular (LBM × 2.4 g/kg).'}
              {!perfil.objetivo && 'Selecciona un objetivo para ver la metodología.'}
            </div>
          </div>

          {/* ── Configuración: Pérdida de peso ── */}
          {perfil.objetivo === 'perdida' && (
          <div className={`rounded-2xl shadow-sm border p-6 animate-fadeIn ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <h2 className={`text-base font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              <i className="fas fa-fire text-orange-500"></i>
              Configuración de pérdida de peso
            </h2>
            <div className="space-y-4">
              {/* Medidas corporales */}
              <div>
                <div className={`text-xs font-semibold mb-2 uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Composición corporal (para cálculo LBM)</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Cintura (cm)</label>
                    <input type="number" step="0.5" value={perfil.cintura || ''} onChange={(e) => handleChange("cintura", e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`} placeholder="85" />
                  </div>
                  <div>
                    <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Cuello (cm)</label>
                    <input type="number" step="0.5" value={perfil.cuello || ''} onChange={(e) => handleChange("cuello", e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`} placeholder="40" />
                  </div>
                  {perfil.genero === 'femenino' && (
                    <div>
                      <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Cadera (cm)</label>
                      <input type="number" step="0.5" value={perfil.cadera || ''} onChange={(e) => handleChange("cadera", e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`} placeholder="95" />
                    </div>
                  )}
                  <div>
                    <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>BF% manual (opcional)</label>
                    <input type="number" step="0.1" value={perfil.bfOverride || ''} onChange={(e) => handleChange("bfOverride", e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200'}`} placeholder="Sino: Navy auto" />
                  </div>
                </div>
                <p className={`text-[11px] mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <i className="fas fa-info-circle mr-1"></i>
                  Navy calcula BF% con cintura + cuello{perfil.genero === 'femenino' ? ' + cadera' : ''}. Si tienes bioimpedancia o caliper, usa "BF% manual".
                </p>
              </div>
              {/* Targets */}
              <div>
                <div className={`text-xs font-semibold mb-2 uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Objetivos de composición</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Peso target (kg)</label>
                    <input type="number" step="0.1" value={perfil.pesoTarget || ''} onChange={(e) => handleChange("pesoTarget", e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200'}`} placeholder="72" />
                  </div>
                  <div>
                    <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>BF% target</label>
                    <input type="number" step="0.1" value={perfil.bfTarget || ''} onChange={(e) => handleChange("bfTarget", e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200'}`} placeholder="10" />
                  </div>
                </div>
                <p className={`text-[11px] mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Basta con uno de los dos. El otro se calcula asumiendo que preservás masa magra.</p>
              </div>
              {/* Tasa de pérdida */}
              <div>
                <div className={`text-xs font-semibold mb-2 uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Tasa de pérdida</div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { k: 'conservadora', l: 'Conservadora', s: '0.4 kg/sem · −300 kcal' },
                    { k: 'moderada',     l: 'Moderada',     s: '0.6 kg/sem · −450 kcal' },
                    { k: 'agresiva',     l: 'Agresiva',     s: '0.8 kg/sem · −600 kcal' }
                  ].map(tp => {
                    const activo = (perfil.tasaPerdida || 'moderada') === tp.k;
                    return (
                      <button key={tp.k} type="button" onClick={() => handleChange("tasaPerdida", tp.k)}
                        className={`px-2 py-2 rounded-lg text-xs border transition-colors cursor-pointer ${
                          activo ? 'bg-orange-500 text-white border-orange-500'
                          : darkMode ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}>
                        <div className="font-semibold">{tp.l}</div>
                        <div className={`text-[11px] mt-0.5 ${activo ? 'text-orange-100' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{tp.s}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* Timeline */}
              <div>
                <label className={`block text-xs font-semibold mb-1 uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Timeline deseado (meses, opcional)</label>
                <input type="number" min="2" max="24" step="1" value={perfil.timelineMesesDeseado || ''} onChange={(e) => handleChange("timelineMesesDeseado", e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200'}`} placeholder="Ej: 10. Vacío = cálculo automático." />
                <p className={`text-[11px] mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>El motor ajusta el déficit para cumplirlo dentro de rangos seguros (200–800 kcal/día).</p>
              </div>
              {/* Fuente proteica de rescate */}
              <div>
                <div className={`text-xs font-semibold mb-2 uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Fuente proteica de rescate</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { k: 'whey', l: 'Whey', s: '1 scoop · 25g P' },
                    { k: 'yogur_griego', l: 'Yogur griego', s: '200g · 20g P' },
                    { k: 'cottage', l: 'Cottage light', s: '150g · 18g P' },
                    { k: 'claras', l: 'Claras (6)', s: '180g · 22g P' }
                  ].map(f => {
                    const activo = (perfil.complementoPreferido || 'whey') === f.k;
                    return (
                      <button key={f.k} type="button" onClick={() => handleChange("complementoPreferido", f.k)}
                        className={`px-2 py-2 rounded-lg text-xs border transition-colors cursor-pointer ${
                          activo ? 'bg-blue-500 text-white border-blue-500'
                          : darkMode ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}>
                        <div className="font-semibold">{f.l}</div>
                        <div className={`text-[11px] mt-0.5 ${activo ? 'text-blue-100' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{f.s}</div>
                      </button>
                    );
                  })}
                </div>
                <p className={`text-[11px] mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Si algún día quedan pocos gramos de proteína, la app sugiere esta fuente para completar el target.</p>
              </div>
              {/* Roadmap preview */}
              {roadmapPreview ? (
                <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-5 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs font-bold tracking-wider opacity-90">ROADMAP PREVIEW</div>
                    <div className="text-[11px] opacity-75">{roadmapPreview.calculados.semanasActivas}w activas · {roadmapPreview.calculados.cantDietBreaks} diet breaks</div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                    <div className="bg-white/20 rounded-lg p-2 text-center">
                      <div className="text-[11px] opacity-80">BMR</div>
                      <div className="text-lg font-bold">{roadmapPreview.calculados.bmr}</div>
                      <div className="text-[11px] opacity-70">kcal</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-2 text-center">
                      <div className="text-[11px] opacity-80">TDEE</div>
                      <div className="text-lg font-bold">{roadmapPreview.calculados.tdee}</div>
                      <div className="text-[11px] opacity-70">kcal</div>
                    </div>
                    <div className="bg-white/30 rounded-lg p-2 text-center">
                      <div className="text-[11px] opacity-80">CORTE</div>
                      <div className="text-lg font-bold">{roadmapPreview.calculados.caloriasCorte}</div>
                      <div className="text-[11px] opacity-70">−{roadmapPreview.calculados.deficitDiario} kcal</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-2 text-center">
                      <div className="text-[11px] opacity-80">PROTEÍNA</div>
                      <div className="text-lg font-bold">{roadmapPreview.calculados.proteinaTarget}g</div>
                      <div className="text-[11px] opacity-70">LBM × 2.63</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
                    <div className="bg-white/10 rounded p-2">
                      <span className="opacity-75">BF actual:</span> <b>{roadmapPreview.calculados.bfActual}%</b>
                    </div>
                    <div className="bg-white/10 rounded p-2">
                      <span className="opacity-75">BF target:</span> <b>{roadmapPreview.calculados.bfTarget}%</b>
                    </div>
                    <div className="bg-white/10 rounded p-2">
                      <span className="opacity-75">Grasa a perder:</span> <b>{roadmapPreview.calculados.grasaAPerder} kg</b>
                    </div>
                    <div className="bg-white/10 rounded p-2">
                      <span className="opacity-75">Duración:</span> <b>~{roadmapPreview.calculados.mesesTotales} meses</b>
                    </div>
                  </div>
                  <div className="text-[11px] font-bold tracking-wider opacity-80 mb-2">FASES</div>
                  <div className="space-y-1">
                    {roadmapPreview.fases.map((f, idx) => (
                      <div key={idx} className={`flex items-center justify-between rounded px-2 py-1.5 text-[11px] ${f.tipo === 'dietBreak' ? 'bg-white/30' : 'bg-white/10'}`}>
                        <div className="flex items-center gap-2">
                          <span className="font-bold opacity-90">M{f.mesInicio}{f.mesFin !== f.mesInicio ? '–'+f.mesFin : ''}</span>
                          <span className={f.tipo === 'dietBreak' ? 'font-semibold' : ''}>{f.nombre}</span>
                          {f.tipo === 'dietBreak' && <i className="fas fa-pause-circle text-[11px]"></i>}
                        </div>
                        <span className="opacity-90">{f.calorias} kcal · {f.targetPasos.toLocaleString()} pasos</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={`text-xs p-3 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-orange-50 text-orange-700 border border-orange-100'}`}>
                  <i className="fas fa-info-circle mr-1"></i>
                  Completa cintura + cuello{perfil.genero === 'femenino' ? ' + cadera' : ''} (o BF% manual) y al menos un target de peso o BF% para ver el roadmap.
                </div>
              )}
            </div>
          </div>
          )}

          {/* ── Configuración: Mantenimiento ── */}
          {perfil.objetivo === 'mantenimiento' && (
          <div className={`rounded-2xl shadow-sm border p-6 animate-fadeIn ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <h2 className={`text-base font-semibold mb-3 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              <i className="fas fa-scale-balanced text-green-500"></i>
              Configuración de mantenimiento
            </h2>
            <div className={`p-3 rounded-xl mb-4 ${darkMode ? 'bg-green-900/20 border border-green-800/40' : 'bg-green-50 border border-green-100'}`}>
              <p className={`text-xs ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                <i className="fas fa-flask mr-1.5"></i>TDEE exacto + proteína LBM × 2.0 g/kg. Composición corporal opcional, mejora la precisión.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <div className={`text-xs font-semibold mb-2 uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Composición corporal <span className="font-normal normal-case opacity-60">(opcional)</span></div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Cintura (cm)</label>
                    <input type="number" step="0.5" value={perfil.cintura || ''} onChange={(e) => handleChange("cintura", e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`} placeholder="85" />
                  </div>
                  <div>
                    <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Cuello (cm)</label>
                    <input type="number" step="0.5" value={perfil.cuello || ''} onChange={(e) => handleChange("cuello", e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`} placeholder="40" />
                  </div>
                  {perfil.genero === 'femenino' && (
                    <div>
                      <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Cadera (cm)</label>
                      <input type="number" step="0.5" value={perfil.cadera || ''} onChange={(e) => handleChange("cadera", e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`} placeholder="95" />
                    </div>
                  )}
                  <div>
                    <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>BF% manual (opcional)</label>
                    <input type="number" step="0.1" value={perfil.bfOverride || ''} onChange={(e) => handleChange("bfOverride", e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200'}`} placeholder="Sino: Navy auto" />
                  </div>
                </div>
              </div>
              {/* Preview mantenimiento */}
              {roadmapMantPreview ? (
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white">
                  <div className="text-xs font-bold tracking-wider opacity-90 mb-2">PLAN DE MANTENIMIENTO</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                    {[
                      { l: 'TDEE', v: roadmapMantPreview.calculados.tdee + ' kcal' },
                      { l: 'Calorías/día', v: roadmapMantPreview.calculados.caloriasObjetivo + ' kcal' },
                      { l: 'Proteína', v: roadmapMantPreview.calculados.proteinaTarget + ' g/día' },
                      { l: 'BF estimado', v: roadmapMantPreview.calculados.bfActual != null ? roadmapMantPreview.calculados.bfActual + '%' : '—' },
                    ].map(x => (
                      <div key={x.l} className="bg-white/20 rounded-lg p-2 text-center">
                        <div className="text-[10px] opacity-80">{x.l}</div>
                        <div className="text-sm font-bold mt-0.5">{x.v}</div>
                      </div>
                    ))}
                  </div>
                  {roadmapMantPreview.calculados.macrosGramos && (
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-blue-500/30 rounded-lg p-2 text-center">
                        <div className="text-[10px] opacity-80">Proteínas</div>
                        <div className="text-sm font-bold">{roadmapMantPreview.calculados.macrosGramos.proteina}g</div>
                      </div>
                      <div className="bg-amber-500/30 rounded-lg p-2 text-center">
                        <div className="text-[10px] opacity-80">Carbos</div>
                        <div className="text-sm font-bold">{roadmapMantPreview.calculados.macrosGramos.carbohidratos}g</div>
                      </div>
                      <div className="bg-rose-500/30 rounded-lg p-2 text-center">
                        <div className="text-[10px] opacity-80">Grasas</div>
                        <div className="text-sm font-bold">{roadmapMantPreview.calculados.macrosGramos.grasas}g</div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className={`text-xs p-3 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                  <i className="fas fa-info-circle mr-1"></i>Completa tus datos corporales arriba para ver el plan calculado.
                </div>
              )}
            </div>
          </div>
          )}

          {/* ── Configuración: Volumen ── */}
          {perfil.objetivo === 'volumen' && (
          <div className={`rounded-2xl shadow-sm border p-6 animate-fadeIn ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <h2 className={`text-base font-semibold mb-3 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              <i className="fas fa-arrow-trend-up text-blue-500"></i>
              Configuración de volumen muscular
            </h2>
            <div className={`p-3 rounded-xl mb-4 ${darkMode ? 'bg-blue-900/20 border border-blue-800/40' : 'bg-blue-50 border border-blue-100'}`}>
              <p className={`text-xs ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                <i className="fas fa-flask mr-1.5"></i>Lean bulk científico: superávit 200–400 kcal + proteína LBM × 2.4 g/kg. Minimiza grasa ganada.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <div className={`text-xs font-semibold mb-2 uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Composición corporal <span className="font-normal normal-case opacity-60">(opcional)</span></div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Cintura (cm)</label>
                    <input type="number" step="0.5" value={perfil.cintura || ''} onChange={(e) => handleChange("cintura", e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`} placeholder="85" />
                  </div>
                  <div>
                    <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Cuello (cm)</label>
                    <input type="number" step="0.5" value={perfil.cuello || ''} onChange={(e) => handleChange("cuello", e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`} placeholder="40" />
                  </div>
                  {perfil.genero === 'femenino' && (
                    <div>
                      <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Cadera (cm)</label>
                      <input type="number" step="0.5" value={perfil.cadera || ''} onChange={(e) => handleChange("cadera", e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`} placeholder="95" />
                    </div>
                  )}
                  <div>
                    <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>BF% manual (opcional)</label>
                    <input type="number" step="0.1" value={perfil.bfOverride || ''} onChange={(e) => handleChange("bfOverride", e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200'}`} placeholder="Sino: Navy auto" />
                  </div>
                </div>
              </div>
              <div>
                <div className={`text-xs font-semibold mb-2 uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Tasa de ganancia muscular</div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { k: 'conservadora', l: 'Conservadora', s: '+200 kcal · ~0.2 kg/mes' },
                    { k: 'moderada',     l: 'Moderada',     s: '+300 kcal · ~0.3 kg/mes' },
                    { k: 'agresiva',     l: 'Agresiva',     s: '+400 kcal · ~0.5 kg/mes' },
                  ].map(tg => {
                    const activo = (perfil.tasaGanancia || 'moderada') === tg.k;
                    return (
                      <button key={tg.k} type="button" onClick={() => handleChange('tasaGanancia', tg.k)}
                        className={`px-2 py-2 rounded-lg text-xs border transition-colors cursor-pointer ${
                          activo ? 'bg-blue-500 text-white border-blue-500'
                          : darkMode ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}>
                        <div className="font-semibold">{tg.l}</div>
                        <div className={`text-[11px] mt-0.5 ${activo ? 'text-blue-100' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{tg.s}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Peso objetivo (kg) <span className="font-normal opacity-60">— opcional</span></label>
                <input type="number" step="0.5" value={perfil.pesoObjetivoVol || ''} onChange={(e) => handleChange('pesoObjetivoVol', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200'}`}
                  placeholder={`Ej: ${perfil.peso ? Math.round(Number(perfil.peso) + 5) : 80}`} />
                <p className={`text-[11px] mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Se estima el tiempo para alcanzarlo con tu tasa seleccionada.</p>
              </div>
              {/* Preview volumen */}
              {roadmapVolPreview ? (
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white">
                  <div className="text-xs font-bold tracking-wider opacity-90 mb-2">PLAN DE VOLUMEN</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                    {[
                      { l: 'TDEE', v: roadmapVolPreview.calculados.tdee + ' kcal' },
                      { l: 'Objetivo/día', v: roadmapVolPreview.calculados.caloriasObjetivo + ' kcal' },
                      { l: 'Proteína', v: roadmapVolPreview.calculados.proteinaTarget + ' g/día' },
                      { l: 'Duración est.', v: roadmapVolPreview.calculados.mesesEstimados ? roadmapVolPreview.calculados.mesesEstimados + ' meses' : '—' },
                    ].map(x => (
                      <div key={x.l} className="bg-white/20 rounded-lg p-2 text-center">
                        <div className="text-[10px] opacity-80">{x.l}</div>
                        <div className="text-sm font-bold mt-0.5">{x.v}</div>
                      </div>
                    ))}
                  </div>
                  {roadmapVolPreview.calculados.macrosGramos && (
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-blue-400/30 rounded-lg p-2 text-center">
                        <div className="text-[10px] opacity-80">Proteínas</div>
                        <div className="text-sm font-bold">{roadmapVolPreview.calculados.macrosGramos.proteina}g</div>
                      </div>
                      <div className="bg-amber-500/30 rounded-lg p-2 text-center">
                        <div className="text-[10px] opacity-80">Carbos</div>
                        <div className="text-sm font-bold">{roadmapVolPreview.calculados.macrosGramos.carbohidratos}g</div>
                      </div>
                      <div className="bg-rose-500/30 rounded-lg p-2 text-center">
                        <div className="text-[10px] opacity-80">Grasas</div>
                        <div className="text-sm font-bold">{roadmapVolPreview.calculados.macrosGramos.grasas}g</div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className={`text-xs p-3 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
                  <i className="fas fa-info-circle mr-1"></i>Completa tus datos corporales arriba para ver el plan calculado.
                </div>
              )}
            </div>
          </div>
          )}

          {/* Calorías Objetivo Manual - oculto cuando objetivo científico (lo define el roadmap) */}
          {!perfil.fatLossMode && perfil.objetivo !== 'mantenimiento' && perfil.objetivo !== 'volumen' && (
          <div className={`rounded-2xl shadow-sm border p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              <i className="fas fa-fire-flame-curved text-green-500"></i>
              Calorías Objetivo
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <button type="button" onClick={() => setUsarCaloriasManual(false)}
                  className={`flex-1 p-3 rounded-xl text-center text-sm font-medium transition-all ${
                    !usarCaloriasManual
                      ? 'bg-green-500 text-white shadow-lg shadow-green-200'
                      : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}>
                  <i className="fas fa-calculator mr-1.5"></i>Calcular automáticamente
                </button>
                <button type="button" onClick={() => setUsarCaloriasManual(true)}
                  className={`flex-1 p-3 rounded-xl text-center text-sm font-medium transition-all ${
                    usarCaloriasManual
                      ? 'bg-green-500 text-white shadow-lg shadow-green-200'
                      : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}>
                  <i className="fas fa-pen mr-1.5"></i>Ingresar manualmente
                </button>
              </div>
              {usarCaloriasManual && (
                <div className="animate-fadeIn">
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Calorías diarias objetivo (kcal)
                  </label>
                  <input type="number" value={perfil.caloriasManual}
                    onChange={(e) => handleChange("caloriasManual", e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border transition-colors text-lg font-semibold ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200'} ${errores.caloriasManual ? 'border-red-400 bg-red-50' : ''} focus:border-green-500`}
                    placeholder="Ej: 2000" min="800" max="6000" />
                  {errores.caloriasManual && <p className="text-red-500 text-xs mt-1">{errores.caloriasManual}</p>}
                  <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <i className="fas fa-info-circle mr-1"></i>
                    Ingresa directamente tu objetivo calórico sin depender del cálculo TDEE. Rango: 800–6000 kcal.
                  </p>
                </div>
              )}
              {!usarCaloriasManual && (
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <i className="fas fa-info-circle mr-1"></i>
                  Las calorías se calculan según tus datos personales, nivel de actividad y objetivo.
                </p>
              )}
            </div>
          </div>
          )}

          {/* Macros Editables - oculto cuando objetivo científico, los fija automáticamente */}
          {!perfil.fatLossMode && perfil.objetivo !== 'mantenimiento' && perfil.objetivo !== 'volumen' && (
          <div className={`rounded-2xl shadow-sm border p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              <i className="fas fa-chart-pie text-green-500"></i>
              Distribución de Macros
              <span className="text-xs font-normal text-gray-400">(deben sumar 100%)</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-1"></span>Proteínas (%)
                </label>
                <input type="number" value={perfil.macros.proteinas} onChange={(e) => handleMacroChange("proteinas", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'} focus:border-blue-500`} min="10" max="60" />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span className="inline-block w-3 h-3 bg-amber-500 rounded-full mr-1"></span>Carbohidratos (%)
                </label>
                <input type="number" value={perfil.macros.carbohidratos} onChange={(e) => handleMacroChange("carbohidratos", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'} focus:border-amber-500`} min="10" max="70" />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span className="inline-block w-3 h-3 bg-rose-500 rounded-full mr-1"></span>Grasas (%)
                </label>
                <input type="number" value={perfil.macros.grasas} onChange={(e) => handleMacroChange("grasas", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'} focus:border-rose-500`} min="10" max="50" />
              </div>
            </div>
            {/* A12: role+aria-label — no usar solo color para identificar macros */}
            <div className="mt-4 h-4 rounded-full overflow-hidden flex bg-gray-200"
              role="img" aria-label={`Distribución: Proteínas ${perfil.macros.proteinas}%, Carbohidratos ${perfil.macros.carbohidratos}%, Grasas ${perfil.macros.grasas}%`}>
              <div className="bg-blue-500 transition-all" aria-hidden="true" style={{ width: `${perfil.macros.proteinas}%` }}></div>
              <div className="bg-amber-500 transition-all" aria-hidden="true" style={{ width: `${perfil.macros.carbohidratos}%` }}></div>
              <div className="bg-rose-500 transition-all" aria-hidden="true" style={{ width: `${perfil.macros.grasas}%` }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Prot. {perfil.macros.proteinas}%</span>
              <span>Carb. {perfil.macros.carbohidratos}%</span>
              <span>Grasas {perfil.macros.grasas}%</span>
            </div>
            {macroError && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
                <i className="fas fa-exclamation-circle"></i>{macroError}
              </div>
            )}
          </div>
          )}

          {/* Restricciones */}
          <div className={`rounded-2xl shadow-sm border p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              <i className="fas fa-shield-alt text-green-500"></i>
              Restricciones Alimentarias
            </h2>
            <div className="flex flex-wrap gap-3 mb-4">
              {[
                { key: "sinGluten", label: "Sin gluten", icon: "🌾" },
                { key: "sinLactosa", label: "Sin lactosa", icon: "🥛" },
                { key: "vegetariano", label: "Vegetariano", icon: "🥬" }
              ].map(({ key, label, icon }) => (
                <label key={key} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer transition-all ${
                  perfil[key] ? 'bg-green-100 border-2 border-green-400 text-green-800'
                    : darkMode ? 'bg-gray-700 border-2 border-transparent text-gray-300 hover:bg-gray-600' : 'bg-gray-50 border-2 border-transparent text-gray-600 hover:bg-gray-100'
                }`}>
                  <input type="checkbox" checked={perfil[key]} onChange={(e) => handleChange(key, e.target.checked)} className="sr-only" />
                  <span>{icon}</span>
                  <span className="text-sm font-medium">{label}</span>
                  {perfil[key] && <i className="fas fa-check text-green-600 text-xs"></i>}
                </label>
              ))}
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Ingredientes a excluir (separados por comas)
              </label>
              <textarea value={perfil.ingredientesExcluidosTexto}
                onChange={(e) => handleChange("ingredientesExcluidosTexto", e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border transition-colors resize-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200'} focus:border-green-500`}
                rows="2" placeholder="Ej: maní, camarones, apio..." />
            </div>

            {/* Fase 4 - Punto 14: filtro solo rápidas */}
            <div className="mt-4 pt-4 border-t border-dashed border-gray-300 dark:border-gray-600">
              <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                <i className="fas fa-bolt text-amber-500"></i>
                Ritmo de Cocina
              </h3>
              <label className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
                perfil.soloRapidas ? 'bg-amber-100 border-2 border-amber-400 text-amber-900'
                  : darkMode ? 'bg-gray-700 border-2 border-transparent text-gray-300 hover:bg-gray-600' : 'bg-gray-50 border-2 border-transparent text-gray-600 hover:bg-gray-100'
              }`}>
                <input type="checkbox" checked={!!perfil.soloRapidas} onChange={(e) => handleChange("soloRapidas", e.target.checked)} className="sr-only" />
                {/* ST3: FA icon en lugar de emoji */}
                <i className="fas fa-bolt text-amber-500 text-lg flex-shrink-0"></i>
                <div className="flex-1">
                  <div className="text-sm font-medium">Solo recetas rápidas (almuerzo y cena)</div>
                  <div className="text-xs opacity-75">Descarta recetas con tiempo total superior al máximo</div>
                </div>
                {perfil.soloRapidas && <i className="fas fa-check text-amber-700"></i>}
              </label>
              {perfil.soloRapidas && (
                <div className="mt-3 flex items-center gap-3">
                  <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Tiempo máximo:
                  </label>
                  <div className="flex gap-2">
                    {[15, 20, 25, 30, 40].map(min => (
                      <button key={min} type="button" onClick={() => handleChange("maxTiempoMin", min)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          (perfil.maxTiempoMin || 25) === min
                            ? 'bg-amber-500 text-white shadow-md'
                            : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}>
                        {min} min
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Fase 4 - Punto 16: modo sobras */}
              <label className={`mt-3 flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
                perfil.modoSobras ? 'bg-indigo-100 border-2 border-indigo-400 text-indigo-900'
                  : darkMode ? 'bg-gray-700 border-2 border-transparent text-gray-300 hover:bg-gray-600' : 'bg-gray-50 border-2 border-transparent text-gray-600 hover:bg-gray-100'
              }`}>
                <input type="checkbox" checked={!!perfil.modoSobras} onChange={(e) => handleChange("modoSobras", e.target.checked)} className="sr-only" />
                {/* ST3: FA icon en lugar de emoji */}
                <i className="fas fa-recycle text-indigo-500 text-lg flex-shrink-0"></i>
                <div className="flex-1">
                  <div className="text-sm font-medium">Modo sobras (cocinar 1 vez, comer 2)</div>
                  <div className="text-xs opacity-75">La cena del día N pasa como almuerzo del día N+1. Ahorra 6 cocciones por semana.</div>
                </div>
                {perfil.modoSobras && <i className="fas fa-check text-indigo-700"></i>}
              </label>

              {/* Toggle Thermomix */}
              <label className={`mt-3 flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
                perfil.usaThermomix ? 'bg-indigo-50 border-2 border-indigo-300 text-indigo-900'
                  : darkMode ? 'bg-gray-700 border-2 border-transparent text-gray-300 hover:bg-gray-600' : 'bg-gray-50 border-2 border-transparent text-gray-600 hover:bg-gray-100'
              }`}>
                <input type="checkbox" checked={!!perfil.usaThermomix} onChange={(e) => handleChange("usaThermomix", e.target.checked)} className="sr-only" />
                <i className="fas fa-blender text-xl text-indigo-500"></i>
                <div className="flex-1">
                  <div className="text-sm font-medium">Tengo Thermomix TM6</div>
                  <div className="text-xs opacity-75">Muestra instrucciones y tiempos adaptados para Thermomix en cada receta</div>
                </div>
                {perfil.usaThermomix && <i className="fas fa-check text-indigo-700"></i>}
              </label>
            </div>
          </div>

          {/* Selector de semanas */}
          <div className={`rounded-2xl shadow-sm border p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              <i className="fas fa-calendar-week text-green-500"></i>
              Duración del Plan
            </h2>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map(n => (
                <button key={n} type="button" onClick={() => handleChange("numSemanas", n)}
                  className={`flex-1 py-3 rounded-xl font-medium text-sm transition-all ${
                    perfil.numSemanas === n
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                      : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}>
                  {n} {n === 1 ? 'semana' : 'semanas'}
                </button>
              ))}
            </div>
            <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <i className="fas fa-info-circle mr-1"></i>
              {perfil.numSemanas > 1 ? `Se generarán ${perfil.numSemanas} semanas con recetas distintas. La lista de compras incluirá ingredientes de todas las semanas.` : 'Plan estándar de 7 días.'}
            </p>
          </div>

          {/* Panel TDEE - oculto cuando objetivo científico, cada modo tiene su propio preview */}
          {tdeeInfo && !perfil.fatLossMode && perfil.objetivo !== 'mantenimiento' && perfil.objetivo !== 'volumen' && (
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg animate-scaleIn">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <i className="fas fa-calculator"></i>
                {usarCaloriasManual ? 'Tu Objetivo Nutricional' : 'Tu Cálculo Nutricional'}
              </h2>
              {!usarCaloriasManual && tdeeInfo.bmr != null ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white/20 rounded-xl p-3 text-center backdrop-blur-sm">
                    <div className="text-xs opacity-80">BMR</div>
                    <div className="text-xl font-bold">{tdeeInfo.bmr}</div>
                    <div className="text-xs opacity-80">kcal</div>
                  </div>
                  <div className="bg-white/20 rounded-xl p-3 text-center backdrop-blur-sm">
                    <div className="text-xs opacity-80">TDEE</div>
                    <div className="text-xl font-bold">{tdeeInfo.tdee}</div>
                    <div className="text-xs opacity-80">kcal</div>
                  </div>
                  <div className="bg-white/30 rounded-xl p-3 text-center backdrop-blur-sm col-span-2 sm:col-span-2">
                    <div className="text-xs opacity-80">Calorías Objetivo</div>
                    <div className="text-3xl font-extrabold font-display">{tdeeInfo.caloriasObjetivo}</div>
                    <div className="text-xs opacity-80">kcal/día</div>
                  </div>
                </div>
              ) : (
                <div className="bg-white/30 rounded-xl p-4 text-center backdrop-blur-sm">
                  <div className="text-xs opacity-80">Calorías Objetivo (manual)</div>
                  <div className="text-4xl font-extrabold font-display mt-1">{tdeeInfo.caloriasObjetivo}</div>
                  <div className="text-xs opacity-80 mt-1">kcal/día</div>
                </div>
              )}
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="bg-blue-500/30 rounded-xl p-3 text-center">
                  <div className="text-xs opacity-80">Proteínas</div>
                  <div className="text-lg font-bold">{tdeeInfo.macrosG.proteinas_g}g</div>
                </div>
                <div className="bg-amber-500/30 rounded-xl p-3 text-center">
                  <div className="text-xs opacity-80">Carbohidratos</div>
                  <div className="text-lg font-bold">{tdeeInfo.macrosG.carbohidratos_g}g</div>
                </div>
                <div className="bg-rose-500/30 rounded-xl p-3 text-center">
                  <div className="text-xs opacity-80">Grasas</div>
                  <div className="text-lg font-bold">{tdeeInfo.macrosG.grasas_g}g</div>
                </div>
              </div>
              <div className="mt-4 text-xs opacity-70 text-center">
                Distribución diaria: Desayuno 25% · Snack AM 10% · Almuerzo 35% · Snack PM 10% · Cena 20%
              </div>
            </div>
          )}

          <button type="submit" disabled={
            perfil.objetivo === 'perdida' ? !roadmapPreview
            : perfil.objetivo === 'mantenimiento' ? !roadmapMantPreview
            : perfil.objetivo === 'volumen' ? !roadmapVolPreview
            : (!tdeeInfo || macroError)
          }
            className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
              (perfil.objetivo === 'perdida' ? !!roadmapPreview
                : perfil.objetivo === 'mantenimiento' ? !!roadmapMantPreview
                : perfil.objetivo === 'volumen' ? !!roadmapVolPreview
                : (tdeeInfo && !macroError))
                ? perfil.objetivo === 'perdida'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 active:scale-[0.98]'
                    : perfil.objetivo === 'volumen'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-200 hover:shadow-xl active:scale-[0.98]'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 active:scale-[0.98]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}>
            <i className={`fas ${perfil.objetivo === 'perdida' ? 'fa-fire' : perfil.objetivo === 'volumen' ? 'fa-arrow-trend-up' : 'fa-scale-balanced'} mr-2`}></i>
            {tienePlan ? 'Guardar y Regenerar Plan' : 'Generar Plan Semanal'}
          </button>
        </form>
      </div>
    </div>
  );
}


// =============================================
// COMPONENTE: BatchCookingView (Fase 3 - cocción en lote)
// =============================================
function BatchCookingView({ plan, darkMode }) {
  const [semanaActiva, setSemanaActiva] = React.useState(1);

  if (!plan || typeof window.batchCooking === 'undefined') {
    return (
      <div className={`p-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        <i className="fas fa-triangle-exclamation text-3xl mb-3"></i>
        <p className="text-sm">Genera un plan semanal primero</p>
      </div>
    );
  }

  const planNorm = typeof _normalizarPlanMulti === 'function' ? _normalizarPlanMulti(plan) : plan;
  const numSemanas = planNorm._numSemanas || 1;
  const semanaData = planNorm['semana_' + semanaActiva] || {};
  const resultado = React.useMemo(() => window.batchCooking.generarPlan(semanaData), [semanaData]);

  const coloresCat = {
    proteina:     { bg: 'bg-rose-100', text: 'text-rose-700', icon: 'fa-drumstick-bite' },
    legumbre:     { bg: 'bg-amber-100', text: 'text-amber-700', icon: 'fa-bowl-food' },
    carbohidrato: { bg: 'bg-blue-100', text: 'text-blue-700', icon: 'fa-wheat-awn' },
    vegetal:      { bg: 'bg-green-100', text: 'text-green-700', icon: 'fa-leaf' }
  };

  return (
    <div className="animate-fadeIn">
      <div className={`rounded-2xl p-5 border mb-4 ${darkMode ? 'bg-gradient-to-br from-amber-900/20 to-orange-900/20 border-amber-800' : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'}`}>
        <h3 className={`font-semibold text-lg mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          <i className="fas fa-kitchen-set text-amber-600 mr-2"></i>Cocina una vez, come toda la semana
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          Analiza tu plan e identifica ingredientes que puedes cocinar en lote el domingo.
        </p>
        
        {numSemanas > 1 && (
          <div className="flex gap-2 mb-3">
            {Array.from({length: numSemanas}, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setSemanaActiva(n)}
                className={`flex-1 py-2 rounded-xl font-medium text-xs ${
                  semanaActiva === n ? 'bg-amber-500 text-white' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-600'
                }`}>
                Semana {n}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-3 gap-2">
          <div className={`rounded-lg p-2 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{resultado.total_bases}</div>
            <div className="text-[11px] text-gray-500">bases en lote</div>
          </div>
          <div className={`rounded-lg p-2 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-xl font-bold text-amber-600">{resultado.tiempo_batch_min} min</div>
            <div className="text-[11px] text-gray-500">domingo en cocina</div>
          </div>
          <div className={`rounded-lg p-2 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-xl font-bold text-emerald-600">-{resultado.ahorro_porcentaje}%</div>
            <div className="text-[11px] text-gray-500">ahorro semanal</div>
          </div>
        </div>
      </div>

      {resultado.total_bases === 0 && (
        <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <i className="fas fa-circle-info text-3xl mb-2"></i>
          <p className="text-sm">No hay ingredientes repetidos ≥2 veces esta semana</p>
          <p className="text-xs mt-2">Regenera el plan para aumentar repeticiones</p>
        </div>
      )}

      {resultado.total_bases > 0 && (
        <>
          <div className={`text-xs font-semibold mb-2 uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <i className="fas fa-list-check mr-1"></i>Plan de domingo
          </div>
          <div className="space-y-3">
            {resultado.bases.map((base, idx) => {
              const color = coloresCat[base.categoria] || { bg: 'bg-gray-100', text: 'text-gray-700', icon: 'fa-circle' };
              return (
                <div key={idx} className={`rounded-xl border p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${color.bg} ${color.text}`}>
                          <i className={`fas ${color.icon} mr-1`}></i>{base.categoria}
                        </span>
                        <span className="text-[11px] text-gray-400">{base.num_usos} usos · {base.tiempo_batch_min} min</span>
                      </div>
                      <h4 className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {base.nombre_display}
                      </h4>
                      <div className="text-xs text-gray-500 mt-0.5">
                        Total a cocinar: <strong>{Math.round(base.cantidad_total)}{base.unidad}</strong>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`text-[11px] mt-2 mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Se usa en: {base.apariciones.map(a => `${a.dia.slice(0,3)} ${a.tipo.slice(0,3)}`).join(', ')}
                  </div>

                  {base.instrucciones_batch && base.instrucciones_batch.length > 0 && (
                    <details className={`mt-2 rounded-lg p-2 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                      <summary className={`text-xs font-medium cursor-pointer ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <i className="fas fa-book-open mr-1"></i>Pasos para batch
                      </summary>
                      <ol className="mt-2 space-y-1.5">
                        {base.instrucciones_batch.map((paso, i) => (
                          <li key={i} className={`text-xs pl-6 relative ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <span className={`absolute left-0 top-0 w-4 h-4 rounded-full text-[11px] font-bold flex items-center justify-center ${color.bg} ${color.text}`}>
                              {i + 1}
                            </span>
                            {paso}
                          </li>
                        ))}
                      </ol>
                    </details>
                  )}
                </div>
              );
            })}
          </div>

          <div className={`mt-5 rounded-xl p-4 border-2 border-dashed ${darkMode ? 'border-amber-700 bg-amber-900/10' : 'border-amber-300 bg-amber-50/50'}`}>
            <div className={`text-xs font-semibold mb-2 ${darkMode ? 'text-amber-300' : 'text-amber-800'}`}>
              <i className="fas fa-lightbulb mr-1"></i>Tip del chef
            </div>
            <p className={`text-xs leading-relaxed ${darkMode ? 'text-amber-200' : 'text-amber-900'}`}>
              Programa 2-3 horas el domingo en la tarde. Empieza por las legumbres (tardan más), mientras se cocinan asa los vegetales al horno. En paralelo cocina el arroz. La proteína al final. Enfría todo rápido y refrigera en porciones individuales.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

// =============================================
// COMPONENTE: ComensalesPanel (Fase 3.3 - perfiles múltiples)
// =============================================
function ComensalesPanel({ darkMode, onChange }) {
  const [estado, setEstado] = React.useState(() =>
    window.perfilesMulti ? window.perfilesMulti.cargar() : { comensales: [], modo: 'individual' }
  );
  const [expandido, setExpandido] = React.useState(false);

  if (!window.perfilesMulti) return null;

  const pm = window.perfilesMulti;
  const factor = pm.factorCoccion(estado);
  const nAct = pm.numComensalesActivos(estado);

  const refresh = (nuevoEstado) => {
    setEstado({ ...nuevoEstado, comensales: [...nuevoEstado.comensales] });
    if (onChange) onChange(nuevoEstado);
  };

  const aplicarPresetLocal = (key) => {
    refresh(pm.aplicarPreset(key));
  };

  const toggleActivo = (id) => {
    const c = estado.comensales.find(x => x.id === id);
    if (!c) return;
    refresh(pm.actualizarComensal(estado, id, { activo: c.activo === false }));
  };

  const quitar = (id) => {
    refresh(pm.quitarComensal(estado, id));
  };

  const agregarAdulto = () => refresh(pm.agregarComensal(estado, { nombre: 'Adulto', tipo: 'adulto', factor: 0.85 }));
  const agregarNino = () => refresh(pm.agregarComensal(estado, { nombre: 'Niño/a', tipo: 'nino', factor: 0.5 }));

  return (
    <div className={`mb-4 rounded-2xl border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <button onClick={() => setExpandido(!expandido)}
        className={`w-full p-3 flex items-center justify-between text-left ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-teal-400 to-cyan-500 text-white">
            <i className="fas fa-users"></i>
          </div>
          <div>
            <div className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Cocino para {nAct} {nAct === 1 ? 'persona' : 'personas'}
            </div>
            <div className="text-[11px] text-gray-400">
              Factor ×{factor.toFixed(2)} sobre ingredientes y compras
            </div>
          </div>
        </div>
        <i className={`fas fa-chevron-${expandido ? 'up' : 'down'} text-gray-400`}></i>
      </button>

      {expandido && (
        <div className={`px-3 pb-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <div className={`text-[11px] uppercase font-semibold my-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Presets rápidos</div>
          <div className="grid grid-cols-4 gap-1 mb-3">
            {[
              { k: 'solo', l: 'Solo', f: '×1.0' },
              { k: 'pareja', l: 'Pareja', f: '×1.85' },
              { k: 'familia_2_1', l: '2A+1N', f: '×2.35' },
              { k: 'familia_2_2', l: '2A+2N', f: '×2.85' }
            ].map(p => (
              <button key={p.k} onClick={() => aplicarPresetLocal(p.k)}
                className={`py-1.5 rounded-lg text-[11px] font-medium transition-colors ${darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                <div>{p.l}</div>
                <div className="text-[11px] text-gray-400">{p.f}</div>
              </button>
            ))}
          </div>

          <div className={`text-[11px] uppercase font-semibold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Comensales</div>
          <div className="space-y-1 mb-2">
            {estado.comensales.map(c => (
              <div key={c.id} className={`flex items-center gap-2 p-2 rounded-lg ${darkMode ? 'bg-gray-700/40' : 'bg-gray-50'} ${c.activo === false ? 'opacity-50' : ''}`}>
                {/* T1: mínimo 32×32px touch target (era 20×20px) */}
                <button onClick={() => toggleActivo(c.id)}
                  aria-label={`${c.activo !== false ? 'Desactivar' : 'Activar'} comensal ${c.nombre}`}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${c.activo !== false ? 'bg-emerald-500 border-emerald-500' : darkMode ? 'border-gray-500 hover:border-gray-400' : 'border-gray-300 hover:border-gray-400'}`}>
                  {c.activo !== false && <i className="fas fa-check text-white text-[11px]"></i>}
                </button>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{c.nombre}</div>
                  <div className="text-[11px] text-gray-400">{c.tipo === 'nino' ? 'Niño/a' : 'Adulto'} · ×{c.factor}</div>
                </div>
                {c.id !== 'camilo' && (
                  /* T3: padding + cursor-pointer + aria-label en botón eliminar */
                  <button onClick={() => quitar(c.id)} aria-label={`Eliminar comensal ${c.nombre}`}
                    className="p-2 -mr-1 cursor-pointer text-gray-400 hover:text-red-500 transition-colors rounded">
                    <i className="fas fa-times text-xs"></i>
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button onClick={agregarAdulto}
              className={`flex-1 py-2 rounded-lg text-xs font-medium ${darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-teal-50 text-teal-700 hover:bg-teal-100'}`}>
              <i className="fas fa-plus mr-1"></i>Adulto
            </button>
            <button onClick={agregarNino}
              className={`flex-1 py-2 rounded-lg text-xs font-medium ${darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100'}`}>
              <i className="fas fa-plus mr-1"></i>Niño/a
            </button>
          </div>

          <div className={`mt-3 p-2 rounded-lg text-[11px] ${darkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-50 text-amber-700'}`}>
            <i className="fas fa-circle-info mr-1"></i>
            Calorías y macros siguen siendo para ti. El factor sólo escala ingredientes y costo de lista de compras.
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================
// COMPONENTE: BatchCookingPanel (Fase 3.2 - cocina en lote)
// =============================================
function BatchCookingPanel({ planSemanal, semanaActiva, darkMode, factorComensales }) {
  const [expandido, setExpandido] = React.useState(false);
  const [baseExpandida, setBaseExpandida] = React.useState(null);
  const factor = factorComensales || 1;

  const plan = React.useMemo(() => {
    if (!planSemanal || !window.batchCooking) return null;
    const semanaObj = Array.isArray(planSemanal.semanas) 
      ? planSemanal.semanas[semanaActiva - 1]?.dias 
      : planSemanal;
    if (!semanaObj) return null;
    try {
      const raw = window.batchCooking.generarPlan(semanaObj);
      if (!raw || factor === 1) return raw;
      // Escalar cantidades de las bases por factor de comensales
      return {
        ...raw,
        bases: raw.bases.map(b => ({
          ...b,
          cantidad_total: b.cantidad_total * factor,
          apariciones: b.apariciones.map(a => ({ ...a, cantidad: a.cantidad * factor })),
          instrucciones_batch: window.batchCooking.regenerarInstrucciones
            ? window.batchCooking.regenerarInstrucciones(b.nombre_normalizado, b.cantidad_total * factor, b.categoria)
            : b.instrucciones_batch
        }))
      };
    } catch (e) {
      console.error('[Batch] Error generando plan:', e);
      return null;
    }
  }, [planSemanal, semanaActiva, factor]);

  if (!plan || plan.total_bases === 0) {
    return (
      <div className={`mt-4 rounded-2xl p-4 border-2 border-dashed text-center ${darkMode ? 'border-gray-700 text-gray-500' : 'border-gray-300 text-gray-400'}`}>
        <i className="fas fa-pot-food text-2xl mb-2"></i>
        <p className="text-xs">Esta semana no tiene ingredientes que se repitan al menos 2 veces. No aplica batch cooking.</p>
      </div>
    );
  }

  const iconoCategoria = (cat) => ({
    proteina: 'fa-drumstick-bite text-rose-500',
    legumbre: 'fa-seedling text-amber-700',
    carbohidrato: 'fa-wheat-awn text-amber-500',
    vegetal: 'fa-carrot text-orange-500'
  }[cat] || 'fa-circle text-gray-400');

  const labelCategoria = (cat) => ({
    proteina: 'Proteína', legumbre: 'Legumbre', carbohidrato: 'Carbohidrato', vegetal: 'Vegetal'
  }[cat] || cat);

  return (
    <div className={`mt-4 rounded-2xl border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <button onClick={() => setExpandido(!expandido)}
        className={`w-full p-4 flex items-center justify-between text-left transition-colors ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-orange-400 to-rose-500 text-white`}>
            <i className="fas fa-pot-food"></i>
          </div>
          <div>
            <div className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Batch Cooking Domingo
            </div>
            <div className="text-[11px] text-gray-400">
              {plan.total_bases} base{plan.total_bases !== 1 ? 's' : ''} · ~{plan.tiempo_batch_min} min prep · ahorra ~{plan.ahorro_min} min/semana ({plan.ahorro_porcentaje}%)
            </div>
          </div>
        </div>
        <i className={`fas fa-chevron-${expandido ? 'up' : 'down'} text-gray-400`}></i>
      </button>

      {expandido && (
        <div className={`px-4 pb-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <div className={`grid grid-cols-3 gap-2 my-3 text-center text-[11px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <div className={`rounded-lg p-2 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <div className="font-bold text-base text-orange-500">{plan.tiempo_batch_min}′</div>
              <div>Prep domingo</div>
            </div>
            <div className={`rounded-lg p-2 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <div className="font-bold text-base text-gray-500 line-through">{plan.tiempo_sin_batch_min}′</div>
              <div>Sin batch</div>
            </div>
            <div className={`rounded-lg p-2 ${darkMode ? 'bg-emerald-900/40' : 'bg-emerald-50'}`}>
              <div className="font-bold text-base text-emerald-600">−{plan.ahorro_min}′</div>
              <div>Ahorro</div>
            </div>
          </div>

          <div className="space-y-2">
            {plan.bases.map((base, idx) => {
              const estaExpandido = baseExpandida === idx;
              return (
                <div key={idx} className={`rounded-lg border ${darkMode ? 'bg-gray-700/40 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <button onClick={() => setBaseExpandida(estaExpandido ? null : idx)}
                    className="w-full p-3 flex items-center justify-between text-left">
                    <div className="flex items-center gap-3 min-w-0">
                      <i className={`fas ${iconoCategoria(base.categoria)}`}></i>
                      <div className="min-w-0">
                        <div className={`font-medium text-sm truncate ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                          {base.nombre_display}
                        </div>
                        <div className="text-[11px] text-gray-400">
                          {Math.round(base.cantidad_total)} {base.unidad} · {base.num_usos} usos · {labelCategoria(base.categoria)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-orange-500 font-semibold">{base.tiempo_batch_min}′</span>
                      <i className={`fas fa-chevron-${estaExpandido ? 'up' : 'down'} text-gray-400 text-xs`}></i>
                    </div>
                  </button>

                  {estaExpandido && (
                    <div className={`px-3 pb-3 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                      <div className={`text-[11px] uppercase font-semibold mt-2 mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Preparación en lote:
                      </div>
                      <ol className={`space-y-1 text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'} list-decimal list-inside`}>
                        {base.instrucciones_batch.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                      <div className={`mt-3 text-[11px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <i className="fas fa-utensils mr-1"></i>Se usa en:
                        <div className="flex flex-wrap gap-1 mt-1">
                          {base.apariciones.map((ap, i) => (
                            <span key={i} className={`px-2 py-0.5 rounded text-[11px] ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600 border border-gray-200'}`}>
                              {ap.dia.slice(0,3)} · {ap.tipo} · {Math.round(ap.cantidad)}{base.unidad}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className={`mt-3 p-3 rounded-lg text-[11px] ${darkMode ? 'bg-indigo-900/30 text-indigo-200' : 'bg-indigo-50 text-indigo-700'}`}>
            <i className="fas fa-lightbulb mr-1"></i>
            <strong>Tip:</strong> Dedica ~{Math.round(plan.tiempo_batch_min / 60 * 10) / 10}h el domingo. Entre semana solo calientas + combinas con vegetales frescos. Fideos y pescado del día prefiéralos al momento.
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================
// COMPONENTE: RecipeGenerator (Fase 3 - generador paramétrico)
// =============================================
function RecipeGenerator({ darkMode, onRecipeClick }) {
  const gen = window.generadorRecetas;
  const [filtros, setFiltros] = React.useState({
    cocina: '', tecnica: '', proteina: '', tipo_comida: 'almuerzo'
  });
  const [recetasGeneradas, setRecetasGeneradas] = React.useState([]);
  const [cantidad, setCantidad] = React.useState(6);

  if (!gen) {
    return (
      <div className={`p-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        <i className="fas fa-triangle-exclamation text-3xl mb-3"></i>
        <p className="text-sm">Generador no cargado</p>
      </div>
    );
  }

  const totalCombos = gen.contarCombinaciones();

  const generar = () => {
    const opts = {};
    if (filtros.cocina) opts.cocina = filtros.cocina;
    if (filtros.tecnica) opts.tecnica = filtros.tecnica;
    if (filtros.proteina) opts.proteina = filtros.proteina;
    if (filtros.tipo_comida) opts.tipo_comida = filtros.tipo_comida;
    
    const recetas = gen.batch(cantidad, opts);
    setRecetasGeneradas(recetas);
  };

  const guardarReceta = (receta) => {
    try {
      const existing = JSON.parse(localStorage.getItem('nutriplan_recetas_generadas') || '[]');
      existing.push(receta);
      localStorage.setItem('nutriplan_recetas_generadas', JSON.stringify(existing));
      // También añadir a RECETAS_DB en runtime para que aparezca en plan
      if (typeof RECETAS_DB !== 'undefined') {
        RECETAS_DB.push(receta);
      }
      if (window._NP_toast) window._NP_toast(`"${receta.nombre}" guardada — disponible en tu próximo plan`);
      else alert(`"${receta.nombre}" guardada. Estará disponible en tu próximo plan.`);
    } catch (e) {
      console.error('Error guardando receta:', e);
    }
  };

  const selectClass = `text-sm px-3 py-2 rounded-lg border w-full ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-200 text-gray-700'}`;

  return (
    <div className="animate-fadeIn">
      <div className={`rounded-2xl p-5 border mb-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <h3 className={`font-semibold text-lg mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          <i className="fas fa-wand-magic-sparkles text-purple-500 mr-2"></i>Generador de recetas
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          {totalCombos.toLocaleString('es-CL')} combinaciones posibles · proteína × carbo × vegetal × técnica × cocina
        </p>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">Tipo de comida</label>
            <select value={filtros.tipo_comida} onChange={(e) => setFiltros({...filtros, tipo_comida: e.target.value})} className={selectClass}>
              <option value="almuerzo">Almuerzo</option>
              <option value="cena">Cena</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">Cocina</label>
            <select value={filtros.cocina} onChange={(e) => setFiltros({...filtros, cocina: e.target.value})} className={selectClass}>
              <option value="">Cualquiera</option>
              {Object.entries(gen.catalogos.cocinas).map(([k, v]) => (
                <option key={k} value={k}>{v.display}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">Técnica</label>
            <select value={filtros.tecnica} onChange={(e) => setFiltros({...filtros, tecnica: e.target.value})} className={selectClass}>
              <option value="">Cualquiera</option>
              {Object.entries(gen.catalogos.tecnicas).map(([k, v]) => (
                <option key={k} value={k}>{v.display}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">Proteína</label>
            <select value={filtros.proteina} onChange={(e) => setFiltros({...filtros, proteina: e.target.value})} className={selectClass}>
              <option value="">Cualquiera</option>
              {Object.entries(gen.catalogos.proteinas).map(([k, v]) => (
                <option key={k} value={k}>{v.display}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <label className="text-xs text-gray-400">Cantidad:</label>
          <input type="number" min="1" max="20" value={cantidad} 
            onChange={(e) => setCantidad(parseInt(e.target.value) || 6)}
            className={`w-20 px-2 py-1 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-200'}`} />
        </div>

        <button onClick={generar}
          className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg transition-all">
          <i className="fas fa-wand-magic-sparkles mr-2"></i>Generar {cantidad} receta{cantidad !== 1 ? 's' : ''}
        </button>
      </div>

      {recetasGeneradas.length === 0 && (
        <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <i className="fas fa-seedling text-4xl mb-3"></i>
          <p className="text-sm">Ajusta filtros (o déjalos libres) y genera recetas únicas</p>
        </div>
      )}

      {recetasGeneradas.length > 0 && (
        <div className="space-y-2">
          <div className={`text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {recetasGeneradas.length} receta{recetasGeneradas.length !== 1 ? 's' : ''} generada{recetasGeneradas.length !== 1 ? 's' : ''}
          </div>
          {recetasGeneradas.map((r, idx) => {
            const recetaConEscala = {
              ...r,
              calorias_escaladas: r.calorias_base,
              proteinas_escaladas: r.proteinas_g,
              carbohidratos_escalados: r.carbohidratos_g,
              grasas_escaladas: r.grasas_g,
              factor_escala: 1,
              ingredientes_escalados: r.ingredientes.map(i => ({...i, cantidad_escalada: i.cantidad_base}))
            };
            const cocina = gen.catalogos.cocinas[r._metadata.cocina];
            const tecnica = gen.catalogos.tecnicas[r._metadata.tecnica];
            return (
              <div key={idx} className={`rounded-xl p-3 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onRecipeClick(recetaConEscala)}>
                    <div className="flex flex-wrap items-center gap-1 mb-1">
                      <span className="text-[11px] px-1.5 py-0.5 rounded font-medium bg-purple-100 text-purple-700">
                        <i className="fas fa-wand-magic-sparkles mr-1"></i>{cocina?.display}
                      </span>
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">
                        {tecnica?.display}
                      </span>
                    </div>
                    <h4 className={`font-semibold text-sm ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{getNombreReceta(r)}</h4>
                    <div className="flex flex-wrap gap-2 mt-1.5 text-[11px]">
                      <span className="text-gray-500"><i className="fas fa-fire text-orange-400 mr-1"></i>{r.calorias_base} kcal</span>
                      <span className="text-blue-500">P: {r.proteinas_g}g</span>
                      <span className="text-amber-600">C: {r.carbohidratos_g}g</span>
                      <span className="text-rose-500">G: {r.grasas_g}g</span>
                      <span className="text-indigo-500"><i className="fas fa-clock mr-1"></i>{r.tiempo_total_min}′</span>
                      {r.costo_clp > 0 && (
                        <span className="text-emerald-600"><i className="fas fa-coins mr-1"></i>${(Math.ceil(r.costo_clp / 100) * 100).toLocaleString('es-CL')}</span>
                      )}
                    </div>
                  </div>
                  {/* A5: aria-label en botón guardar catálogo */}
                  <button onClick={(e) => { e.stopPropagation(); guardarReceta(r); }}
                    aria-label={`Guardar ${r.nombre} en mi catálogo`}
                    className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${darkMode ? 'text-gray-400 hover:text-green-400 hover:bg-gray-700' : 'text-gray-400 hover:text-green-600 hover:bg-green-50'}`}>
                    <i className="fas fa-bookmark text-sm"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// =============================================
// COMPONENTE: AdherenceWidget (Fase 2)
// =============================================
function AdherenceWidget({ darkMode, forceUpdate }) {
  const stats = React.useMemo(() => window.adherencia.semanal(1), [forceUpdate]);
  const historial = React.useMemo(() => window.adherencia.historial(7), [forceUpdate]);

  if (stats.registros_total === 0) {
    return (
      <div className={`mt-6 rounded-2xl p-4 border-2 border-dashed text-center ${darkMode ? 'border-gray-700 text-gray-500' : 'border-gray-300 text-gray-400'}`}>
        <i className="fas fa-clipboard-check text-2xl mb-2"></i>
        <p className="text-xs">Marca las comidas que efectivamente comiste para medir tu adherencia</p>
      </div>
    );
  }

  const color = stats.porcentaje >= 80 ? 'emerald' : stats.porcentaje >= 50 ? 'amber' : 'rose';

  return (
    <div className={`mt-6 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
      style={{ padding: '20px 20px 24px' }}>
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
        <div className={`text-xs font-semibold uppercase tracking-wide ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <i className="fas fa-clipboard-check mr-1.5"></i>Adherencia 7 días
        </div>
        <div className={`text-2xl font-bold font-display text-${color}-500`}>{stats.porcentaje}%</div>
      </div>
      {/* Stats grid */}
      <div className="grid grid-cols-3" style={{ gap: '10px', marginBottom: '20px' }}>
        <div className={`rounded-xl text-center ${darkMode ? 'bg-gray-700/60' : 'bg-gray-50'}`}
          style={{ padding: '12px 8px' }}>
          <div className="font-bold text-emerald-500" style={{ fontSize: '18px', lineHeight: 1.2 }}>{stats.cumplidos}</div>
          <div style={{ fontSize: '11px', marginTop: '4px' }} className="text-gray-400">cumplidas</div>
        </div>
        <div className={`rounded-xl text-center ${darkMode ? 'bg-gray-700/60' : 'bg-gray-50'}`}
          style={{ padding: '12px 8px' }}>
          <div className={`font-bold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`} style={{ fontSize: '18px', lineHeight: 1.2 }}>{stats.kcal_cumplidas.toLocaleString('es-CL')}</div>
          <div style={{ fontSize: '11px', marginTop: '4px' }} className="text-gray-400">kcal ✓</div>
        </div>
        <div className={`rounded-xl text-center ${darkMode ? 'bg-gray-700/60' : 'bg-gray-50'}`}
          style={{ padding: '12px 8px' }}>
          <div className="font-bold text-rose-500" style={{ fontSize: '18px', lineHeight: 1.2 }}>{stats.kcal_perdidas.toLocaleString('es-CL')}</div>
          <div style={{ fontSize: '11px', marginTop: '4px' }} className="text-gray-400">kcal perdidas</div>
        </div>
      </div>
      {/* Bar chart */}
      <div className="flex items-end justify-between" style={{ gap: '6px', height: '72px' }}
        role="img" aria-label={`Gráfico de adherencia 7 días: ${stats.porcentaje}% promedio`}>
        {historial.map((d, idx) => {
          const altura = d.porcentaje != null ? Math.max(4, d.porcentaje * 0.56) : 0;
          const bgBar = d.porcentaje == null
            ? (darkMode ? '#374151' : '#e5e7eb')
            : d.porcentaje >= 80 ? '#10b981' : d.porcentaje >= 50 ? '#f59e0b' : '#f87171';
          return (
            <div key={idx} className="flex-1 flex flex-col items-center" style={{ gap: '6px' }} aria-hidden="true">
              <div className="w-full flex items-end" style={{ height: '52px' }}>
                <div className="w-full rounded-t"
                  style={{ height: `${altura}px`, minHeight: d.porcentaje != null ? '4px' : '2px', background: bgBar, transition: 'height 0.3s ease' }}
                  title={d.porcentaje != null ? `${d.porcentaje}% (${d.cumplidos}/${d.total})` : 'Sin registro'}></div>
              </div>
              <div style={{ fontSize: '11px' }} className="text-gray-500">{d.dia_semana}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =============================================
// COMPONENTE: ReverseSearch (Fase 2 - búsqueda inversa)
// =============================================
function ReverseSearch({ darkMode, onRecipeClick, plan }) {
  const [ingredientesSeleccionados, setIngredientesSeleccionados] = React.useState([]);
  const [inputQuery, setInputQuery] = React.useState('');
  const [sugerencias, setSugerencias] = React.useState([]);
  const [minMatch, setMinMatch] = React.useState(0.4);
  // Slot picker state: which card idx is expanded
  const [expandedIdx, setExpandedIdx] = React.useState(null);

  // Slots disponibles hoy (semana 1, día actual)
  const diaActual = React.useMemo(() => obtenerDiaActual(), []);
  const slotsHoy = React.useMemo(() => {
    if (!plan) return [];
    const semKeys = Object.keys(plan).filter(k => k.startsWith('semana_')).sort();
    const semKey = semKeys[0] || 'semana_1';
    const diaData = (plan[semKey] || {})[diaActual] || {};
    const ORDEN_SLOTS = ['desayuno', 'snack_am', 'almuerzo', 'snack_pm', 'cena'];
    return ORDEN_SLOTS
      .filter(tipo => diaData[tipo])
      .map(tipo => ({ tipo, nombre: getNombreReceta(diaData[tipo]) }));
  }, [plan, diaActual]);

  // Reemplazar un slot del plan hoy con la receta seleccionada
  const usarEnPlan = (receta, tipo) => {
    const planActual = window.cargarPlanSemanal ? window.cargarPlanSemanal() : null;
    if (!planActual) {
      if (window._NP_toast) window._NP_toast('No hay plan generado', 'error');
      return;
    }
    const semKeys = Object.keys(planActual).filter(k => k.startsWith('semana_')).sort();
    const semKey = semKeys[0] || 'semana_1';
    if (!planActual[semKey] || !planActual[semKey][diaActual]) {
      if (window._NP_toast) window._NP_toast('No hay plan para hoy', 'error');
      return;
    }
    // Deep clone, reemplazar slot
    const planMod = JSON.parse(JSON.stringify(planActual));
    planMod[semKey][diaActual][tipo] = receta;
    window.guardarPlanSemanal(planMod);
    if (window._NP_setPlan) window._NP_setPlan(planMod);
    const tipoLabel = NOMBRES_COMIDAS[tipo] || tipo;
    if (window._NP_toast) window._NP_toast(`"${getNombreReceta(receta)}" reemplazó tu ${tipoLabel} de hoy ✓`);
    setExpandedIdx(null);
  };

  React.useEffect(() => {
    if (inputQuery.length >= 2 && typeof window.sugerirIngredientes === 'function') {
      setSugerencias(window.sugerirIngredientes(inputQuery));
    } else {
      setSugerencias([]);
    }
  }, [inputQuery]);

  const agregarIngrediente = (ing) => {
    if (!ingredientesSeleccionados.find(i => i.normalizado === ing.normalizado)) {
      setIngredientesSeleccionados([...ingredientesSeleccionados, ing]);
    }
    setInputQuery('');
    setSugerencias([]);
  };

  const quitarIngrediente = (normalizado) => {
    setIngredientesSeleccionados(ingredientesSeleccionados.filter(i => i.normalizado !== normalizado));
  };

  const resultados = React.useMemo(() => {
    if (ingredientesSeleccionados.length === 0 || typeof window.buscarRecetasPorIngredientes !== 'function') return [];
    return window.buscarRecetasPorIngredientes(
      ingredientesSeleccionados.map(i => i.normalizado),
      { minimoMatch: minMatch, maxResultados: 30 }
    );
  }, [ingredientesSeleccionados, minMatch]);

  return (
    <div className="animate-fadeIn">
      <div className={`rounded-2xl p-5 border mb-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <h3 className={`font-semibold text-lg mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          <i className="fas fa-magnifying-glass text-green-500 mr-2"></i>¿Qué cocino con lo que tengo?
        </h3>
        <p className="text-xs text-gray-400 mb-4">Agrega los ingredientes disponibles en tu cocina</p>
        
        <div className="relative">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ej: pollo, arroz, tomate..."
            className={`w-full px-4 py-2.5 rounded-xl text-sm border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-200 placeholder-gray-400'} focus:outline-none focus:ring-2 focus:ring-green-400`}
          />
          {sugerencias.length > 0 && (
            <div className={`absolute left-0 right-0 top-full mt-1 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto ${darkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'}`}>
              {sugerencias.map(s => (
                <button key={s.normalizado} onClick={() => agregarIngrediente(s)}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${darkMode ? 'hover:bg-gray-600 text-gray-200' : 'hover:bg-green-50 text-gray-700'}`}>
                  <i className="fas fa-plus text-green-500 text-xs mr-2"></i>{s.display}
                </button>
              ))}
            </div>
          )}
        </div>

        {ingredientesSeleccionados.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {ingredientesSeleccionados.map(ing => (
              <span key={ing.normalizado} className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-green-900/40 text-green-300' : 'bg-green-100 text-green-700'}`}>
                {ing.display}
                {/* T6: padding + cursor-pointer + aria-label */}
                <button onClick={() => quitarIngrediente(ing.normalizado)}
                  aria-label={`Quitar ${ing.display}`}
                  className="p-1 cursor-pointer hover:text-red-500 transition-colors rounded">
                  <i className="fas fa-times text-xs"></i>
                </button>
              </span>
            ))}
            <button onClick={() => setIngredientesSeleccionados([])}
              className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'}`}>
              <i className="fas fa-trash-can mr-1"></i>Limpiar
            </button>
          </div>
        )}

        <div className="mt-4 flex items-center gap-2">
          <label className="text-xs text-gray-400">Match mínimo:</label>
          <select value={minMatch} onChange={(e) => setMinMatch(parseFloat(e.target.value))}
            className={`text-xs px-2 py-1 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-200 text-gray-700'}`}>
            <option value="0.2">20% (más resultados)</option>
            <option value="0.4">40% (recomendado)</option>
            <option value="0.6">60%</option>
            <option value="0.8">80% (más estricto)</option>
          </select>
        </div>
      </div>

      {ingredientesSeleccionados.length === 0 && (
        <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <i className="fas fa-utensils text-4xl mb-3"></i>
          <p className="text-sm">Agrega ingredientes para ver recetas</p>
        </div>
      )}

      {ingredientesSeleccionados.length > 0 && resultados.length === 0 && (
        <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <i className="fas fa-face-frown text-4xl mb-3"></i>
          <p className="text-sm">Ninguna receta coincide con los filtros</p>
          <p className="text-xs mt-2">Prueba bajar el "Match mínimo" o agregar más ingredientes</p>
        </div>
      )}

      {resultados.length > 0 && (
        <>
          <div className={`text-xs mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {resultados.length} receta{resultados.length !== 1 ? 's' : ''} encontrada{resultados.length !== 1 ? 's' : ''}
          </div>
          <div className="space-y-2">
            {resultados.map((r, idx) => {
              // Escalar ficticiamente para que el modal funcione (usa 100% de la receta base)
              const recetaConEscala = {
                ...r.receta,
                calorias_escaladas: r.receta.calorias_base,
                proteinas_escaladas: r.receta.proteinas_g,
                carbohidratos_escalados: r.receta.carbohidratos_g,
                grasas_escaladas: r.receta.grasas_g,
                factor_escala: 1,
                ingredientes_escalados: (r.receta.ingredientes || []).map(i => ({...i, cantidad_escalada: i.cantidad_base}))
              };
              const color = r.porcentaje >= 90 ? 'emerald' : r.porcentaje >= 70 ? 'green' : r.porcentaje >= 50 ? 'amber' : 'gray';
              const slotPickerOpen = expandedIdx === idx;
              return (
                <div key={idx}
                  className={`rounded-xl border transition-all overflow-hidden ${slotPickerOpen ? 'shadow-md' : 'hover:shadow-md'} ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                  {/* Fila principal — clic abre modal de receta */}
                  <div onClick={() => onRecipeClick(recetaConEscala)}
                    className={`cursor-pointer p-3 ${slotPickerOpen ? '' : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50')}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[11px] px-1.5 py-0.5 rounded font-medium bg-${color}-100 text-${color}-700`}>
                            {NOMBRES_COMIDAS[r.receta.tipo_comida]}
                          </span>
                          <span className={`text-[11px] font-bold text-${color}-500`}>{r.porcentaje}% match</span>
                        </div>
                        <h4 className={`font-semibold text-sm ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{getNombreReceta(r.receta)}</h4>
                        <div className="flex flex-wrap gap-2 mt-1.5 text-[11px]">
                          <span className="text-gray-500"><i className="fas fa-fire text-orange-400 mr-1"></i>{r.receta.calorias_base} kcal</span>
                          {r.receta.tiempo_total_min > 0 && (
                            <span className="text-indigo-500"><i className="fas fa-clock mr-1"></i>{r.receta.tiempo_total_min}′</span>
                          )}
                          {r.receta.costo_clp > 0 && (
                            <span className="text-emerald-600"><i className="fas fa-coins mr-1"></i>${(Math.ceil(r.receta.costo_clp / 100) * 100).toLocaleString('es-CL')}</span>
                          )}
                        </div>
                        {r.faltantes.length > 0 && (
                          <div className={`text-[11px] mt-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <span className="font-medium">Te falta:</span> {r.faltantes.slice(0, 4).join(', ')}
                            {r.faltantes.length > 4 && ` +${r.faltantes.length - 4} más`}
                          </div>
                        )}
                      </div>
                      <i className="fas fa-chevron-right text-gray-300 text-sm mt-1 flex-shrink-0"></i>
                    </div>
                  </div>

                  {/* Botón "Usar en mi plan" — solo si hay slots hoy */}
                  {slotsHoy.length > 0 && (
                    <div className={`px-3 pb-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      {!slotPickerOpen ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); setExpandedIdx(idx); }}
                          className={`mt-2 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${darkMode ? 'text-amber-400 hover:text-amber-300' : 'text-amber-600 hover:text-amber-700'}`}>
                          <i className="fas fa-calendar-plus text-xs"></i>
                          Usar en mi plan de hoy
                        </button>
                      ) : (
                        <div className="mt-2">
                          <p className={`text-[11px] mb-2 font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            ¿Qué comida reemplazar hoy ({diaActual})?
                          </p>
                          <div className="flex flex-wrap gap-1.5 items-center">
                            {slotsHoy.map(slot => (
                              <button key={slot.tipo}
                                onClick={(e) => { e.stopPropagation(); usarEnPlan(recetaConEscala, slot.tipo); }}
                                className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all cursor-pointer ${
                                  darkMode
                                    ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-amber-900/40 hover:border-amber-600 hover:text-amber-300'
                                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-amber-50 hover:border-amber-400 hover:text-amber-700'
                                }`}>
                                {NOMBRES_COMIDAS[slot.tipo] || slot.tipo}
                                <span className={`ml-1 font-normal text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>
                                  · {slot.nombre.split(' ').slice(0, 2).join(' ')}
                                </span>
                              </button>
                            ))}
                            <button
                              onClick={(e) => { e.stopPropagation(); setExpandedIdx(null); }}
                              className={`text-[11px] px-2 py-1 cursor-pointer transition-colors ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>
                              Cancelar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ─── SlotAcciones: botones de acción por slot de comida ───
// Extraído del IIFE para evitar violación de Hooks (useState en .map/IIFE)
// FIX: ReactDOM.createPortal → dropdown renderizado en document.body, FUERA del
// árbol DOM del card. Elimina definitivamente:
//   - Efecto vidrio/glass: el portal no hereda bg-color/30 ni transforms del card padre
//   - Flickering de imagen: apertura/cierre del dropdown NO modifica el DOM del card
//   - Posición errónea: position:fixed en document.body no tiene stacking context que lo intercepte
function SlotAcciones({
  comida, tipo, diaSeleccionado, semanaActiva, plan,
  historialSlots, darkMode, swapping, yaComido,
  onMarcarComido, onRestoreRecipe, onVetoRecipe, onRecipeClick, onSwap
}) {
  const [showHist, setShowHist] = React.useState(false);
  const [showSobras, setShowSobras] = React.useState(false);
  const [dropdownPos, setDropdownPos] = React.useState({ top: 0, left: 0 });
  const containerRef = React.useRef(null);
  const histDropRef = React.useRef(null);
  const sobrasDropRef = React.useRef(null);

  React.useEffect(() => {
    if (!showHist && !showSobras) return;
    // Click-outside: revisar containerRef Y los refs de los portals (están en document.body)
    function handleOutside(e) {
      const inContainer = containerRef.current && containerRef.current.contains(e.target);
      const inHist = histDropRef.current && histDropRef.current.contains(e.target);
      const inSobras = sobrasDropRef.current && sobrasDropRef.current.contains(e.target);
      if (!inContainer && !inHist && !inSobras) {
        setShowHist(false);
        setShowSobras(false);
      }
    }
    // Scroll: cerrar para que el dropdown fixed no quede flotando desalineado
    function handleScroll() { setShowHist(false); setShowSobras(false); }
    document.addEventListener('mousedown', handleOutside);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [showHist, showSobras]);

  const slotKey = diaSeleccionado + '_' + tipo + '_' + semanaActiva;
  const slotHist = (historialSlots && historialSlots[slotKey]) || [];
  const isSwappingThis = swapping && swapping.dia === diaSeleccionado && swapping.tipoComida === tipo;
  const sobras = obtenerSobrasDisponibles(plan, diaSeleccionado, semanaActiva);

  // Estilo base del portal dropdown: position:fixed a nivel de body
  // getBoundingClientRect() devuelve coordenadas de viewport → coinciden exactamente con fixed
  const portalDropStyle = {
    position: 'fixed', top: dropdownPos.top, left: dropdownPos.left, zIndex: 9999,
    borderRadius: '12px', overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    backgroundColor: darkMode ? '#1f2937' : '#ffffff',
    border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`
  };

  // Calcular posición desde el botón trigger (e.currentTarget ya en viewport coords)
  function calcPos(e, W) {
    const r = e.currentTarget.getBoundingClientRect();
    const left = Math.max(8, Math.min(r.right - W, window.innerWidth - W - 8));
    return { top: r.bottom + 4, left };
  }

  const itemSolid = darkMode ? '#1f2937' : '#ffffff';
  const itemHover = darkMode ? '#374151' : '#f9fafb';
  const itemDivider = darkMode ? '#374151' : '#f3f4f6';

  return (
    <div ref={containerRef} className="flex items-center gap-1 ml-2 flex-shrink-0">
      {/* Check de adherencia */}
      {typeof window.adherencia !== 'undefined' && (
        <button
          onClick={(e) => { e.stopPropagation(); onMarcarComido(!yaComido); }}
          title={yaComido ? 'Marcado como comido' : 'Marcar como comido'}
          style={{ width: 32, height: 32, minWidth: 32 }}
          className={`flex items-center justify-center rounded-lg transition-all ${
            yaComido
              ? 'bg-emerald-500/20 text-emerald-500'
              : darkMode ? 'text-gray-600 hover:text-emerald-400 hover:bg-gray-700' : 'text-gray-300 hover:text-emerald-500 hover:bg-emerald-50'
          }`}>
          <i className={`fas fa-check text-sm ${yaComido ? '' : 'opacity-60'}`}></i>
        </button>
      )}

      {/* ─── Historial de alternativas (Portal) ─── */}
      {slotHist.length > 0 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!showHist) setDropdownPos(calcPos(e, 260));
              setShowHist(h => !h); setShowSobras(false);
            }}
            aria-label="Ver alternativas anteriores"
            style={{ width: 32, height: 32, minWidth: 32 }}
            className={`flex items-center justify-center rounded-lg transition-all cursor-pointer ${
              showHist
                ? (darkMode ? 'bg-indigo-900/40 text-indigo-400' : 'bg-indigo-50 text-indigo-600')
                : (darkMode ? 'text-gray-500 hover:text-indigo-400 hover:bg-gray-700' : 'text-gray-400 hover:text-indigo-500 hover:bg-indigo-50')
            }`}>
            <i className="fas fa-clock-rotate-left text-xs"></i>
          </button>
          {showHist && ReactDOM.createPortal(
            <div ref={histDropRef} onClick={(e) => e.stopPropagation()}
              style={{ ...portalDropStyle, minWidth: '200px', maxWidth: '260px' }}>
              <div style={{ padding: '8px 12px 4px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: darkMode ? '#6b7280' : '#9ca3af' }}>
                Alternativas anteriores
              </div>
              {slotHist.map((r, idx) => (
                <button key={r.id || idx}
                  onClick={() => { onRestoreRecipe(r); setShowHist(false); }}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '8px 12px', border: 'none', backgroundColor: itemSolid,
                    cursor: 'pointer', transition: 'background-color 0.12s',
                    borderTop: idx > 0 ? `1px solid ${itemDivider}` : 'none'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = itemHover}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = itemSolid}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: darkMode ? '#e5e7eb' : '#111827', lineHeight: 1.3, marginBottom: '2px' }}>{getNombreReceta(r)}</div>
                  <div style={{ fontSize: '11px', color: darkMode ? '#6b7280' : '#9ca3af' }}>{r.calorias_escaladas || r.calorias_base} kcal · P {r.proteinas_escaladas || r.proteinas_g}g</div>
                </button>
              ))}
            </div>,
            document.body
          )}
        </>
      )}

      {/* ─── Sobras (Portal) ─── */}
      {sobras.length > 0 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!showSobras) setDropdownPos(calcPos(e, 290));
              setShowSobras(s => !s); setShowHist(false);
            }}
            aria-label="Usar sobra de días anteriores"
            style={{ width: 32, height: 32, minWidth: 32 }}
            className={`flex items-center justify-center rounded-lg transition-all cursor-pointer ${
              showSobras
                ? (darkMode ? 'bg-amber-900/40 text-amber-400' : 'bg-amber-50 text-amber-600')
                : (darkMode ? 'text-gray-500 hover:text-amber-400 hover:bg-gray-700' : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50')
            }`}>
            <i className="fas fa-recycle text-xs"></i>
          </button>
          {showSobras && ReactDOM.createPortal(
            <div ref={sobrasDropRef} onClick={(e) => e.stopPropagation()}
              style={{ ...portalDropStyle, minWidth: '220px', maxWidth: '290px' }}>
              <div style={{ padding: '8px 12px 4px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: darkMode ? '#6b7280' : '#9ca3af' }}>
                Sobras disponibles
              </div>
              {sobras.map((s, idx) => (
                <button key={s.dia + '_' + s.tipoComida}
                  onClick={() => { onRestoreRecipe(s.receta); setShowSobras(false); }}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '8px 12px', border: 'none', backgroundColor: itemSolid,
                    cursor: 'pointer', transition: 'background-color 0.12s',
                    borderTop: `1px solid ${itemDivider}`
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = itemHover}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = itemSolid}>
                  <div style={{ fontSize: '10px', color: darkMode ? '#6b7280' : '#9ca3af', marginBottom: '2px' }}>
                    {s.daysAgo === 1 ? 'Ayer' : 'Anteayer'} · {NOMBRES_COMIDAS[s.tipoComida] || s.tipoComida}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: darkMode ? '#e5e7eb' : '#111827', lineHeight: 1.3, marginBottom: '2px' }}>
                    {getNombreReceta(s.receta)}
                  </div>
                  <div style={{ fontSize: '11px', color: darkMode ? '#6b7280' : '#9ca3af' }}>
                    {s.receta.calorias_escaladas || s.receta.calorias_base} kcal · P {Math.round(s.receta.proteinas_escaladas || s.receta.proteinas_g || 0)}g
                  </div>
                </button>
              ))}
            </div>,
            document.body
          )}
        </>
      )}

      {/* Swap button */}
      <button onClick={(e) => { setShowHist(false); setShowSobras(false); onSwap(e); }}
        disabled={!!isSwappingThis}
        aria-label={`Cambiar receta de ${NOMBRES_COMIDAS[tipo] || tipo}`}
        style={{ width: 32, height: 32, minWidth: 32 }}
        className={`flex items-center justify-center rounded-lg transition-all ${
          isSwappingThis
            ? 'text-green-500 cursor-wait'
            : darkMode ? 'text-gray-400 hover:text-green-400 hover:bg-gray-700' : 'text-gray-400 hover:text-green-600 hover:bg-white'
        }`}>
        <i className={`fas ${isSwappingThis ? 'fa-spinner fa-spin' : 'fa-shuffle'} text-sm`}></i>
      </button>
      {/* Veto button */}
      <button
        onClick={(e) => { e.stopPropagation(); if (window.confirm(`¿Vetar "${getNombreReceta(comida)}"? No volverá a aparecer en tu plan.`)) { onVetoRecipe(); } }}
        aria-label={`Vetar receta ${getNombreReceta(comida)}`}
        style={{ width: 32, height: 32, minWidth: 32 }}
        className={`flex items-center justify-center rounded-lg transition-all cursor-pointer ${
          darkMode ? 'text-gray-600 hover:text-red-400 hover:bg-gray-700' : 'text-gray-300 hover:text-red-500 hover:bg-red-50'
        }`}>
        <i className="fas fa-ban text-xs"></i>
      </button>
      {/* Ver receta */}
      <button onClick={() => onRecipeClick()} aria-label={`${t('Ver receta de','View recipe for')} ${getNombreReceta(comida) || NOMBRES_COMIDAS[tipo]}`}
        className="p-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer rounded">
        <i className="fas fa-chevron-right text-sm"></i>
      </button>
    </div>
  );
}

// ─── Helper: sobras de los últimos 1-2 días del plan ───
// Devuelve [{ dia, daysAgo, tipoComida, receta }] priorizando almuerzo/cena
function obtenerSobrasDisponibles(planMulti, diaHoy, semanaActiva) {
  try {
    var pn = typeof _normalizarPlanMulti === 'function' ? _normalizarPlanMulti(planMulti) : planMulti;
    var semana = pn['semana_' + (semanaActiva || 1)] || {};
    var DIAS = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
    var idxHoy = DIAS.indexOf(diaHoy);
    if (idxHoy < 0) return [];
    var PRIO = ['almuerzo','cena','desayuno','snack_am','snack_pm'];
    var result = [];
    for (var back = 1; back <= 2; back++) {
      var idxPrev = idxHoy - back;
      if (idxPrev < 0) break; // no saltar a semana anterior
      var diaPrev = DIAS[idxPrev];
      var comidasDia = semana[diaPrev] || {};
      PRIO.forEach(function(tipo) {
        var comida = comidasDia[tipo];
        if (comida && comida.id) {
          result.push({ dia: diaPrev, daysAgo: back, tipoComida: tipo, receta: comida });
        }
      });
    }
    return result;
  } catch(e) { return []; }
}

// =============================================
// COMPONENTE: WeeklyPlan (MEJORAS 2 y 3)
// =============================================
function WeeklyPlan({ plan, perfil, onRecipeClick, onRegenerate, onSwapRecipe, onRestoreRecipe, onVetoRecipe, onRegenDay, onCompartir, historialSlots, darkMode, swapping }) {
  // Multi-semana: normalizar plan
  const planNorm = typeof _normalizarPlanMulti === 'function' ? _normalizarPlanMulti(plan) : plan;
  const numSemanas = planNorm._numSemanas || 1;
  const [semanaActiva, setSemanaActiva] = React.useState(1);
  const [forceUpdate, setForceUpdate] = React.useState(0);
  // T9: estado React para el spinner del PDF (evita mutación directa del DOM)
  const [exportandoPDF, setExportandoPDF] = React.useState(false);
  // Fase 3.3: factor de comensales
  const [factorComensales, setFactorComensales] = React.useState(() =>
    window.perfilesMulti ? window.perfilesMulti.factorCoccion(window.perfilesMulti.cargar()) : 1
  );
  React.useEffect(() => {
    const handler = (e) => {
      if (window.perfilesMulti) setFactorComensales(window.perfilesMulti.factorCoccion(e.detail));
    };
    window.addEventListener('perfiles-change', handler);
    return () => window.removeEventListener('perfiles-change', handler);
  }, []);
  const semanaData = planNorm['semana_' + semanaActiva] || {};
  
  const diaActual = obtenerDiaActual();
  const [diaSeleccionado, setDiaSeleccionado] = React.useState(() => {
    return DIAS_SEMANA.includes(diaActual) ? diaActual : DIAS_SEMANA[0];
  });
  // Comidas externas de hoy (para mostrar reemplazos en el día actual)
  const fechaHoyIsoWP = new Date().toISOString().split('T')[0];
  const semanaHoyIdx = React.useMemo(() => {
    const keys = Object.keys(planNorm).filter(k => k.startsWith('semana_')).sort();
    if (keys.length <= 1 || !planNorm._fechaCreacion) return 1;
    const creadoMs = new Date(planNorm._fechaCreacion + 'T00:00:00').getTime();
    const hoyMs = new Date().setHours(0, 0, 0, 0);
    const diasTranscurridos = Math.max(0, Math.floor((hoyMs - creadoMs) / 86400000));
    return Math.min(keys.length, Math.floor(diasTranscurridos / 7) + 1);
  }, [planNorm]);
  const comidasExtHoy = React.useMemo(() => {
    if (typeof _comidasExtFecha !== 'function') return [];
    return _comidasExtFecha(fechaHoyIsoWP);
  }, [fechaHoyIsoWP, forceUpdate]);
  const comidasDia = semanaData[diaSeleccionado] || {};
  const resumen = calcularResumenDiario(comidasDia);
  const tiposComidaOrden = ["desayuno", "snack_am", "almuerzo", "snack_pm", "cena"];
  const iconosComida = { desayuno: "fa-sun", snack_am: "fa-apple-whole", almuerzo: "fa-utensils", snack_pm: "fa-cookie-bite", cena: "fa-moon" };
  const coloresComida = {
    desayuno: { bg: "bg-amber-50", border: "border-amber-200", icon: "text-amber-500", badge: "bg-amber-100 text-amber-700", bgDark: "bg-amber-900/30", borderDark: "border-amber-800" },
    snack_am: { bg: "bg-green-50", border: "border-green-200", icon: "text-green-500", badge: "bg-green-100 text-green-700", bgDark: "bg-green-900/30", borderDark: "border-green-800" },
    almuerzo: { bg: "bg-blue-50", border: "border-blue-200", icon: "text-blue-500", badge: "bg-blue-100 text-blue-700", bgDark: "bg-blue-900/30", borderDark: "border-blue-800" },
    snack_pm: { bg: "bg-purple-50", border: "border-purple-200", icon: "text-purple-500", badge: "bg-purple-100 text-purple-700", bgDark: "bg-purple-900/30", borderDark: "border-purple-800" },
    cena: { bg: "bg-indigo-50", border: "border-indigo-200", icon: "text-indigo-500", badge: "bg-indigo-100 text-indigo-700", bgDark: "bg-indigo-900/30", borderDark: "border-indigo-800" }
  };
  const caloriasObj = perfil.caloriasObjetivo;
  // Macro targets: prefer scientific LBM-based grams from roadmap (same source as HoyView + metodología)
  const _rmPlan = perfil && (perfil.roadmap || perfil.roadmapMantenimiento || perfil.roadmapVolumen);
  const _calcPlan = _rmPlan && _rmPlan.calculados;
  const _mgrPlan = _calcPlan && _calcPlan.macrosGramos;
  const macrosObj = (_mgrPlan && _mgrPlan.proteina)
    ? { proteinas_g: Math.round(_mgrPlan.proteina), carbohidratos_g: Math.round(_mgrPlan.carbohidratos), grasas_g: Math.round(_mgrPlan.grasas) }
    : calcularMacrosEnGramos(caloriasObj, perfil.macros);

  // Totales de la semana activa (tiempo + costo)
  const totalesSemana = React.useMemo(() => {
    let tPrep = 0, tCoccion = 0, costo = 0;
    DIAS_SEMANA.forEach(d => {
      const r = calcularResumenDiario(semanaData[d] || {});
      tPrep += r.tiempo_prep_min || 0;
      tCoccion += r.tiempo_coccion_min || 0;
      costo += r.costo_clp || 0;
    });
    return { tiempo_prep_min: tPrep, tiempo_coccion_min: tCoccion, tiempo_total_min: tPrep + tCoccion, costo_clp: costo };
  }, [semanaData]);

  // MEJORA 3: handler para swap individual (con semana)
  const handleSwap = (e, dia, tipoComida) => {
    e.stopPropagation();
    onSwapRecipe(dia, tipoComida, semanaActiva);
  };

  // v20260418x: Banner de fase de Fat Loss Mode
  const faseInfo = (window.NP_FatLoss && perfil && perfil.fatLossMode)
    ? window.NP_FatLoss.banner()
    : null;
  const desincronizacion = (window.NP_FatLoss && perfil && perfil.fatLossMode)
    ? window.NP_FatLoss.desincronizado()
    : null;

  return (
    <div className="animate-fadeIn">
      {/* Banner Fat Loss Mode */}
      {faseInfo && (
        <div className={`mb-4 rounded-2xl overflow-hidden border min-w-0 w-full ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          {/* Barra de acento superior */}
          <div className={`h-2 ${faseInfo.tipoFase === 'dietBreak' ? 'bg-gradient-to-r from-violet-500 to-purple-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'}`} />

          <div className="px-6 min-w-0" style={{ paddingTop: '24px', paddingBottom: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* ── Header: etiqueta + nombre de fase ── */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <i className={`fas ${faseInfo.tipoFase === 'dietBreak' ? 'fa-pause-circle text-violet-500' : 'fa-fire text-amber-500'} text-sm`}></i>
                <span className={`text-[10px] font-bold tracking-widest uppercase ${faseInfo.tipoFase === 'dietBreak' ? (darkMode ? 'text-violet-400' : 'text-violet-600') : (darkMode ? 'text-amber-400' : 'text-amber-600')}`}>
                  {faseInfo.tipoFase === 'dietBreak' ? 'Diet Break' : 'Fat Loss Mode'}
                </span>
                {faseInfo.completado && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${darkMode ? 'bg-green-900/60 text-green-400' : 'bg-green-100 text-green-700'}`}>COMPLETADO</span>
                )}
                {faseInfo.porEmpezar && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>PROGRAMADO</span>
                )}
              </div>
              <h3 className={`text-2xl font-bold leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {faseInfo.nombreFase}
              </h3>
              <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Día {faseInfo.diaDentroDeFase} de fase · Mes {faseInfo.mesInicio}{faseInfo.mesFin !== faseInfo.mesInicio ? '–' + faseInfo.mesFin : ''}
                {faseInfo.diasRestantesEnFase > 0 && ` · ${faseInfo.diasRestantesEnFase}d restantes`}
              </p>
            </div>

            {/* ── Métricas: calorías · pasos · días restantes ── */}
            <div className={`grid grid-cols-3 rounded-xl overflow-hidden ${darkMode ? 'bg-gray-700/60' : 'bg-amber-50'}`}>
              <div className="text-center px-3" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                <div className={`text-[10px] font-bold uppercase tracking-wide mb-2 ${darkMode ? 'text-amber-400/80' : 'text-amber-600'}`}>Objetivo</div>
                <div className={`text-3xl font-extrabold leading-none ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {faseInfo.calorias}
                </div>
                <div className={`text-[10px] mt-2 ${darkMode ? 'text-gray-500' : 'text-amber-700/60'}`}>kcal/día</div>
              </div>
              <div className={`text-center px-3 border-x ${darkMode ? 'border-gray-600' : 'border-amber-200/60'}`} style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                <div className={`text-[10px] font-bold uppercase tracking-wide mb-2 ${darkMode ? 'text-amber-400/80' : 'text-amber-600'}`}>Pasos</div>
                <div className={`text-3xl font-extrabold leading-none ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {Math.round(faseInfo.targetPasos / 1000)}k
                </div>
                <div className={`text-[10px] mt-2 ${darkMode ? 'text-gray-500' : 'text-amber-700/60'}`}>diarios</div>
              </div>
              <div className="text-center px-3" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                <div className={`text-[10px] font-bold uppercase tracking-wide mb-2 ${darkMode ? 'text-amber-400/80' : 'text-amber-600'}`}>Restantes</div>
                <div className={`text-3xl font-extrabold leading-none ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {faseInfo.diasRestantesEnFase}
                </div>
                <div className={`text-[10px] mt-2 ${darkMode ? 'text-gray-500' : 'text-amber-700/60'}`}>días</div>
              </div>
            </div>

            {/* ── Foco de la fase ── */}
            {faseInfo.foco && (
              <div className="flex items-start gap-3 min-w-0">
                <i className="fas fa-bullseye text-amber-500 mt-1 flex-shrink-0"></i>
                <p className={`text-sm leading-relaxed min-w-0 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{faseInfo.foco}</p>
              </div>
            )}

            {/* ── Próximo hito ── */}
            {faseInfo.proximoHito && (
              <div className={`flex items-center justify-between gap-3 text-sm rounded-xl px-4 py-3 ${darkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-50 text-gray-500'}`}>
                <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
                  <i className={`fas fa-forward-fast flex-shrink-0 ${faseInfo.tipoFase === 'dietBreak' ? 'text-violet-400' : 'text-amber-500'}`}></i>
                  <span className="flex-shrink-0">Próximo:</span>
                  <span className={`font-semibold truncate ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{faseInfo.proximoHito.nombre}</span>
                </div>
                <span className="flex-shrink-0 text-xs opacity-70">en {faseInfo.proximoHito.enDias}d</span>
              </div>
            )}

            {/* ── Desincronización ── */}
            {desincronizacion && desincronizacion.desincronizado && (
              <div className={`rounded-xl px-4 py-3 flex items-center justify-between gap-3 text-sm ${darkMode ? 'bg-yellow-900/30 border border-yellow-800/50' : 'bg-yellow-50 border border-yellow-200'}`}>
                <div className={`flex-1 text-xs leading-snug ${darkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
                  <i className="fas fa-triangle-exclamation mr-1.5"></i>
                  <b>Plan desincronizado.</b> La fase pide {desincronizacion.caloriasNuevaFase} kcal, el plan tiene {desincronizacion.caloriasActuales}.
                </div>
                <button onClick={() => {
                  if (window.NP_FatLoss) {
                    window.NP_FatLoss.sincronizar();
                    if (typeof onRegenerate === 'function') onRegenerate();
                  }
                }} className={`px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap cursor-pointer transition-colors flex-shrink-0 ${darkMode ? 'bg-yellow-600 text-yellow-100 hover:bg-yellow-500' : 'bg-yellow-600 text-white hover:bg-yellow-700'}`}>
                  Regenerar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fase 3.3: Panel de comensales */}
      {window.perfilesMulti && (
        <ComensalesPanel darkMode={darkMode}
          onChange={(estado) => setFactorComensales(window.perfilesMulti.factorCoccion(estado))} />
      )}

      {/* Advertencia de recetas insuficientes */}
      {planNorm._advertencia && (
        <div className={`mb-4 p-3 rounded-xl text-sm flex items-center gap-2 ${darkMode ? 'bg-amber-900/40 border border-amber-700 text-amber-300' : 'bg-amber-50 border border-amber-200 text-amber-700'}`}>
          <i className="fas fa-exclamation-triangle"></i>{planNorm._advertencia}
        </div>
      )}

      {/* Selector de semanas (solo si hay más de 1) */}
      {numSemanas > 1 && (
        <div className="mb-4">
          <div className="flex gap-2">
            {Array.from({length: numSemanas}, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setSemanaActiva(n)}
                className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  semanaActiva === n
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                    : darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}>
                <i className="fas fa-calendar-week mr-1.5 text-xs"></i>Semana {n}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* MEJORA 2: Day tabs with "Hoy" badge */}
      <div className="mb-6 overflow-x-auto pb-2">
        <div className="flex gap-2 min-w-max">
          {DIAS_SEMANA.map((dia) => {
            const esHoy = dia === diaActual && semanaActiva === 1;
            const resumenDia = calcularResumenDiario(semanaData[dia] || {});
            return (
              <button key={dia} onClick={() => setDiaSeleccionado(dia)}
                className={`day-tab flex-shrink-0 px-4 py-3 rounded-xl font-medium text-sm transition-all relative ${
                  diaSeleccionado === dia
                    ? 'active'
                    : esHoy
                      ? darkMode ? 'bg-green-900/40 text-green-300 border-2 border-green-600' : 'bg-green-50 text-green-700 border-2 border-green-300'
                      : darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}>
                <div className="font-semibold flex items-center gap-1.5">
                  {dia.slice(0, 3)}
                  {esHoy && (
                    <span className={`inline-block px-1.5 py-0.5 text-[11px] font-bold rounded-full leading-none ${
                      diaSeleccionado === dia ? 'bg-white/30 text-white' : 'bg-green-500 text-white'
                    }`}>HOY</span>
                  )}
                </div>
                <div className={`text-xs mt-0.5 ${diaSeleccionado === dia ? 'text-green-100' : 'text-gray-400'}`}>
                  {resumenDia.calorias} kcal
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Resumen diario */}
      <div className={`rounded-2xl shadow-sm border p-5 mb-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>{diaSeleccionado}</h3>
            {onRegenDay && (
              <button onClick={() => onRegenDay(diaSeleccionado, semanaActiva)} title="Regenerar 5 comidas de este día"
                className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all cursor-pointer ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600'}`}>
                <i className="fas fa-arrows-rotate text-xs"></i>
              </button>
            )}
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold font-display ${darkMode ? 'text-white' : 'text-gray-800'}`}>{resumen.calorias}</div>
            <div className="text-xs text-gray-400">de {caloriasObj} kcal objetivo</div>
          </div>
        </div>
        {/* Tiempo y costo del día */}
        <div className={`grid grid-cols-2 gap-3 mb-4 pb-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
            <i className="fas fa-clock text-indigo-400"></i>
            <div className="flex-1">
              <div className={`text-sm font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                {resumen.tiempo_total_min} min
              </div>
              <div className="text-[11px] text-gray-400">
                Prep {resumen.tiempo_prep_min}′ + Cocción {resumen.tiempo_coccion_min}′
              </div>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
            <i className="fas fa-coins text-amber-500"></i>
            <div className="flex-1">
              <div className={`text-sm font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                ${(Math.ceil(resumen.costo_clp / 100) * 100).toLocaleString('es-CL')} CLP
              </div>
              <div className="text-[11px] text-gray-400">Costo estimado del día</div>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { label: "Proteínas", color: "blue", actual: resumen.proteinas, objetivo: macrosObj.proteinas_g },
            { label: "Carbohidratos", color: "amber", actual: resumen.carbohidratos, objetivo: macrosObj.carbohidratos_g },
            { label: "Grasas", color: "rose", actual: resumen.grasas, objetivo: macrosObj.grasas_g }
          ].map(macro => (
            <div key={macro.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className={`text-${macro.color}-600 font-medium`}>{macro.label}</span>
                <span className="text-gray-500">{macro.actual}g / {macro.objetivo}g</span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className={`macro-bar h-full bg-${macro.color}-500 rounded-full`}
                  style={{ width: `${Math.min(100, (macro.actual / macro.objetivo) * 100)}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Meal cards with MEJORA 3: swap button */}
      <div className="space-y-3">
        {tiposComidaOrden.map(tipo => {
          const comida = comidasDia[tipo];
          const colores = coloresComida[tipo];
          if (!comida) {
            return (
              <div key={tipo} className={`rounded-xl p-4 border border-dashed text-center ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-300'}`}>
                <span className="text-gray-400 text-sm">No hay receta disponible para {NOMBRES_COMIDAS[tipo]}</span>
              </div>
            );
          }
          const estadoAdherencia = (typeof window.adherencia !== 'undefined')
            ? window.adherencia.estado(diaSeleccionado, tipo, semanaActiva) : null;
          const yaComido = estadoAdherencia?.comido === true;
          const yaMarcadoNo = estadoAdherencia?.comido === false;
          // Mostrar comida externa si reemplaza este slot en el día de hoy
          const esViendoHoy = diaSeleccionado === diaActual && semanaActiva === semanaHoyIdx;
          const extReemplazo = esViendoHoy ? comidasExtHoy.find(function(c) { return c.reemplaza === tipo; }) : null;
          if (extReemplazo) {
            return (
              <div key={tipo} className={`meal-card rounded-xl p-4 border relative ${darkMode ? 'bg-emerald-900/30 border-emerald-700' : 'bg-emerald-50 border-emerald-300'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`${colores.badge} px-2 py-0.5 rounded-lg text-xs font-medium`}>
                        <i className={`fas ${iconosComida[tipo]} mr-1`}></i>{NOMBRES_COMIDAS[tipo]}
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: 6, background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
                        comido
                      </span>
                    </div>
                    <h4 className={`font-semibold text-sm mt-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{extReemplazo.nombre}</h4>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <span className="text-xs text-gray-500"><i className="fas fa-fire text-orange-400 mr-1"></i>{extReemplazo.kcal} kcal</span>
                      <span className="text-xs text-blue-500">P: {extReemplazo.proteinas_g}g</span>
                      <span className="text-xs text-amber-600">C: {extReemplazo.carbohidratos_g}g</span>
                      <span className="text-xs text-rose-500">G: {extReemplazo.grasas_g}g</span>
                    </div>
                  </div>
                  <button
                    onClick={function(e) {
                      e.stopPropagation();
                      var nuevas = comidasExtHoy.filter(function(x) { return x.id !== extReemplazo.id; });
                      if (typeof _guardarComidasExt === 'function') _guardarComidasExt(fechaHoyIsoWP, nuevas);
                      if (typeof _eliminarAdherenciaExt === 'function') _eliminarAdherenciaExt(diaActual, extReemplazo.id);
                      setForceUpdate(function(x) { return x + 1; });
                    }}
                    title="Deshacer reemplazo"
                    aria-label="Deshacer reemplazo"
                    style={{ width: 32, height: 32, minWidth: 32, background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: darkMode ? '#4b5563' : '#9ca3af' }}>
                    <i className="fas fa-rotate-left text-sm"></i>
                  </button>
                </div>
              </div>
            );
          }
          return (
            <div key={tipo} className={`meal-card rounded-xl p-4 border relative ${
              yaComido ? (darkMode ? 'bg-emerald-900/30 border-emerald-700' : 'bg-emerald-50 border-emerald-300')
              : yaMarcadoNo ? (darkMode ? 'bg-gray-800/50 border-gray-600 opacity-60' : 'bg-gray-100 border-gray-300 opacity-70')
              : (darkMode ? colores.bgDark + ' ' + colores.borderDark : colores.bg + ' ' + colores.border)
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1" onClick={() => onRecipeClick(comida)}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`${colores.badge} px-2 py-0.5 rounded-lg text-xs font-medium`}>
                      <i className={`fas ${iconosComida[tipo]} mr-1`}></i>{NOMBRES_COMIDAS[tipo]}
                    </span>
                    {comida._fuente === 'online' && (
                      <span className="online-badge"><i className="fas fa-globe mr-1"></i>Internet</span>
                    )}
                    {perfil.usaThermomix !== false && (tipo === 'almuerzo' || tipo === 'cena') && comida.instrucciones_thermomix && comida.instrucciones_thermomix.length > 0 && (
                      <span className="thermomix-badge">TM6</span>
                    )}
                    {comida.es_sobra && (
                      <span className="px-2 py-0.5 rounded-lg text-xs font-medium bg-indigo-100 text-indigo-700 border border-indigo-300" title={`De la cena del ${comida.sobra_origen?.dia || 'día anterior'}`}>
                        <i className="fas fa-recycle mr-1 text-xs"></i>Sobra
                      </span>
                    )}
                    {comida.genera_sobra && (
                      <span className="px-2 py-0.5 rounded-lg text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-300" title="Cocina doble porción: una para hoy y otra para mañana">
                        ×2 porciones
                      </span>
                    )}
                  </div>
                  <h4 className={`font-semibold text-sm mt-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{getNombreReceta(comida)}</h4>
                  <div className="flex flex-wrap gap-3 mt-2">
                    <span className="text-xs text-gray-500"><i className="fas fa-fire text-orange-400 mr-1"></i>{comida.calorias_escaladas} kcal</span>
                    <span className="text-xs text-blue-500">P: {comida.proteinas_escaladas}g</span>
                    <span className="text-xs text-amber-600">C: {comida.carbohidratos_escalados}g</span>
                    <span className="text-xs text-rose-500">G: {comida.grasas_escaladas}g</span>
                  </div>
                  {/* Tiempo + costo por comida */}
                  {(comida.tiempo_total_min || comida.costo_clp) && (
                    <div className="flex flex-wrap gap-3 mt-1.5">
                      {comida.tiempo_total_min > 0 && (
                        <span className="text-xs text-indigo-500">
                          <i className="fas fa-clock mr-1"></i>{comida.tiempo_total_min} min
                        </span>
                      )}
                      {comida.costo_clp > 0 && (
                        <span className="text-xs text-emerald-600">
                          <i className="fas fa-coins mr-1"></i>${(Math.ceil((comida.costo_clp || 0) * (comida.factor_escala || 1) * factorComensales / 100) * 100).toLocaleString('es-CL')}
                          {factorComensales !== 1 && <span className="text-[11px] text-teal-500 ml-1">×{factorComensales.toFixed(2)}</span>}
                        </span>
                      )}
                      {/* % del objetivo calórico diario */}
                      <span className="text-xs text-gray-400">
                        {Math.round((comida.calorias_escaladas / caloriasObj) * 100)}% del día
                      </span>
                    </div>
                  )}
                </div>
                <SlotAcciones
                  comida={comida}
                  tipo={tipo}
                  diaSeleccionado={diaSeleccionado}
                  semanaActiva={semanaActiva}
                  plan={plan}
                  historialSlots={historialSlots}
                  darkMode={darkMode}
                  swapping={swapping}
                  yaComido={yaComido}
                  onMarcarComido={(comido) => {
                    window.adherencia.marcar(diaSeleccionado, tipo, comido, {
                      kcal_plan: comida.calorias_escaladas,
                      proteinas_plan: comida.proteinas_escaladas,
                      nombre: comida.nombre
                    }, semanaActiva);
                    setForceUpdate(x => x + 1);
                  }}
                  onRestoreRecipe={(r) => onRestoreRecipe && onRestoreRecipe(diaSeleccionado, tipo, semanaActiva, r)}
                  onVetoRecipe={() => onVetoRecipe && onVetoRecipe(diaSeleccionado, tipo, semanaActiva, comida.id)}
                  onRecipeClick={() => onRecipeClick(comida)}
                  onSwap={(e) => handleSwap(e, diaSeleccionado, tipo)}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* N13: BatchCookingPanel removido de aquí — aparece únicamente en CocinarTab > Preparar para evitar estado duplicado */}

      {/* Adherencia semanal */}
      {typeof window.adherencia !== 'undefined' && (
        <AdherenceWidget darkMode={darkMode} forceUpdate={forceUpdate} />
      )}

      {/* Totales de la semana */}
      <div className={`mt-6 rounded-2xl p-4 border ${darkMode ? 'bg-gradient-to-br from-indigo-900/30 to-emerald-900/20 border-gray-700' : 'bg-gradient-to-br from-indigo-50 to-emerald-50 border-gray-200'}`}>
        <div className={`text-xs font-semibold mb-2 uppercase tracking-wide ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <i className="fas fa-calendar-week mr-1"></i>Total Semana {semanaActiva}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <i className="fas fa-clock text-indigo-500 text-lg"></i>
            <div>
              <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {Math.floor(totalesSemana.tiempo_total_min / 60)}h {totalesSemana.tiempo_total_min % 60}min
              </div>
              <div className="text-[11px] text-gray-400">
                Prep {totalesSemana.tiempo_prep_min}′ + Cocción {totalesSemana.tiempo_coccion_min}′
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <i className="fas fa-coins text-amber-500 text-lg"></i>
            <div>
              <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                ${(Math.ceil(totalesSemana.costo_clp * factorComensales / 100) * 100).toLocaleString('es-CL')}
              </div>
              <div className="text-[11px] text-gray-400">
                ~${(Math.ceil(totalesSemana.costo_clp * factorComensales / 7 / 100) * 100).toLocaleString('es-CL')}/día
                {factorComensales !== 1 && <span className="ml-1 text-teal-500">(×{factorComensales.toFixed(2)})</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center space-y-3">
        <div className="flex flex-wrap justify-center gap-2">
          <button onClick={onRegenerate}
            className={`inline-flex items-center gap-2 px-6 py-3 border rounded-xl transition-all text-sm font-medium ${
              darkMode ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}>
            <i className="fas fa-shuffle"></i>Regenerar Plan
          </button>
          {onCompartir && (
            <button onClick={onCompartir}
              className={`inline-flex items-center gap-2 px-6 py-3 border rounded-xl transition-all text-sm font-medium ${
                darkMode ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}>
              <i className="fas fa-share-nodes" style={{ color: '#22C55E' }}></i>Compartir
            </button>
          )}

          {/* Fase 5.4: Export PDF — T9: React state en vez de mutación DOM */}
          {typeof window.exports !== 'undefined' && window.exports.planPDF && (
            <button
              disabled={exportandoPDF}
              onClick={async () => {
                setExportandoPDF(true);
                try {
                  const fComensales = (window.perfilesManager && window.perfilesManager.factorTotal && window.perfilesManager.factorTotal()) || 1;
                  const r = await window.exports.planPDF(plan, { ...perfil, caloriasObjetivo: perfil?.caloriasObjetivo || 2000 }, { factorComensales: fComensales });
                  console.log('[Export PDF]', r);
                } catch (err) {
                  if (window._NP_toast) window._NP_toast('Error al generar PDF: ' + err.message, 'error');
                  else alert('Error al generar PDF: ' + err.message);
                } finally {
                  setExportandoPDF(false);
                }
              }}
              className={`inline-flex items-center gap-2 px-6 py-3 border rounded-xl transition-all text-sm font-medium ${
                exportandoPDF ? 'opacity-60 cursor-not-allowed' : ''
              } ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {exportandoPDF
                ? <><i className="fas fa-spinner fa-spin"></i>Generando...</>
                : <><i className="fas fa-file-pdf text-rose-500"></i>Exportar PDF</>}
            </button>
          )}

          {/* Fase 4.2: Export .ics */}
          {typeof window.exports !== 'undefined' && (
            <div className="relative inline-block group">
              <button
                onClick={(e) => {
                  const menu = e.currentTarget.nextElementSibling;
                  menu.classList.toggle('hidden');
                }}
                className={`inline-flex items-center gap-2 px-6 py-3 border rounded-xl transition-all text-sm font-medium ${
                  darkMode ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}>
                <i className="fas fa-calendar-plus text-indigo-500"></i>Exportar a Calendar
                <i className="fas fa-chevron-down text-[11px]"></i>
              </button>
              <div className={`hidden absolute top-full mt-2 left-1/2 -translate-x-1/2 w-64 rounded-xl shadow-xl z-20 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                <button onClick={(e) => {
                    e.currentTarget.parentElement.classList.add('hidden');
                    const result = window.exports.icsCompacto(plan);
                    console.log('[Export ICS compacto]', result);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm border-b transition-colors ${darkMode ? 'border-gray-700 hover:bg-gray-700 text-gray-200' : 'border-gray-100 hover:bg-indigo-50 text-gray-700'}`}>
                  <div className="font-semibold"><i className="fas fa-compress mr-1 text-indigo-500"></i>Compacto</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">1 evento/día con las 5 comidas adentro</div>
                </button>
                <button onClick={(e) => {
                    e.currentTarget.parentElement.classList.add('hidden');
                    window.exports.icsDetallado(plan);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-indigo-50 text-gray-700'}`}>
                  <div className="font-semibold"><i className="fas fa-list mr-1 text-indigo-500"></i>Detallado</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">5 eventos/día en horarios de comida</div>
                </button>
              </div>
            </div>
          )}

          {/* Log de comidas → CSV (hasta 30 días) */}
          {typeof window.exports !== 'undefined' && window.exports.logCSV && (
            <div className="relative inline-block">
              <button
                onClick={(e) => { e.currentTarget.nextElementSibling.classList.toggle('hidden'); }}
                className={`inline-flex items-center gap-2 px-6 py-3 border rounded-xl transition-all text-sm font-medium cursor-pointer ${
                  darkMode ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}>
                <i className="fas fa-table-list" style={{color:'var(--color-accent)'}}></i>Log de comidas
                <i className="fas fa-chevron-down text-[11px]"></i>
              </button>
              <div className={`hidden absolute top-full mt-2 right-0 w-60 rounded-xl shadow-xl z-20 overflow-hidden ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                {[
                  { d: 7,  label: 'Últimos 7 días',  sub: 'Esta semana aprox.' },
                  { d: 14, label: 'Últimas 2 semanas', sub: 'Visión quincenal' },
                  { d: 30, label: 'Último mes',       sub: 'Máximo disponible' },
                ].map(({ d, label, sub }, idx, arr) => (
                  <button key={d}
                    onClick={(e) => {
                      e.currentTarget.parentElement.classList.add('hidden');
                      window.exports.logCSV(d);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${idx < arr.length - 1 ? 'border-b' : ''} ${darkMode ? 'border-gray-700 hover:bg-gray-700 text-gray-200' : 'border-gray-100 hover:bg-amber-50 text-gray-700'}`}>
                    <div className="font-semibold"><i className="fas fa-file-csv mr-1.5" style={{color:'var(--color-accent)'}}></i>{label}</div>
                    <div className={`text-[11px] mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>{sub} · CSV para Excel / Sheets</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <i className="fas fa-info-circle mr-1"></i>El calendario exporta desde el próximo lunes. Abre el .ics con Google Calendar, Apple Calendar u Outlook.
        </p>
      </div>
    </div>
  );
}


// =============================================
// CALIBRATE — Design tokens (JS side)
// =============================================

// Colores de macros: consistentes en todo el bundle
const MACRO_COLORS = {
  proteinas: { solid: '#3B82F6', light: '#DBEAFE', label: 'Proteína' },
  carbohidratos: { solid: '#F59E0B', light: '#FEF3C7', label: 'Carbos' },
  grasas: { solid: '#F43F5E', light: '#FFE4E6', label: 'Grasa' },
};

// Gradientes de header según objetivo del usuario
const OBJETIVO_GRADIENTS = {
  'perdida':       'linear-gradient(135deg, #C0523A 0%, #8B3A2A 100%)',
  'volumen':       'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
  'mantenimiento': 'linear-gradient(135deg, #C8943A 0%, #A67830 100%)',
  'default':       'linear-gradient(135deg, #C8943A 0%, #A67830 100%)',
};

// =============================================
// UTILIDAD: Reescalar cantidades dentro del texto de instrucciones
// Fase 3.3 (ampliada): cubre dígitos, palabras, fracciones Unicode y ASCII
// =============================================

// Números en palabras → valor numérico
const PALABRAS_NUMERO = {
  'un': 1, 'una': 1, 'uno': 1,
  'dos': 2, 'tres': 3, 'cuatro': 4, 'cinco': 5, 'seis': 6,
  'siete': 7, 'ocho': 8, 'nueve': 9, 'diez': 10,
  'once': 11, 'doce': 12, 'trece': 13, 'catorce': 14, 'quince': 15,
  'dieciseis': 16, 'dieciséis': 16, 'diecisiete': 17, 'dieciocho': 18, 'diecinueve': 19,
  'veinte': 20, 'veinticinco': 25, 'treinta': 30,
  'medio': 0.5, 'media': 0.5,
  'cuarto': 0.25, 'cuarta': 0.25,
  'tercio': 0.333, 'tercia': 0.333
};

// Fracciones Unicode → valor
const FRACCIONES_UNICODE = {
  '½': 0.5, '⅓': 0.333, '⅔': 0.667,
  '¼': 0.25, '¾': 0.75,
  '⅕': 0.2, '⅖': 0.4, '⅗': 0.6, '⅘': 0.8,
  '⅙': 0.167, '⅚': 0.833,
  '⅛': 0.125, '⅜': 0.375, '⅝': 0.625, '⅞': 0.875
};

// Convierte un número a palabra si es práctico (para mantener naturalidad del texto)
function numeroAPalabraSiAplica(n) {
  const mapa = { 1: 'una', 2: 'dos', 3: 'tres', 4: 'cuatro', 5: 'cinco', 6: 'seis', 7: 'siete', 8: 'ocho', 9: 'nueve', 10: 'diez' };
  if (mapa[n]) return mapa[n];
  return null;
}

// Redondea según tipo de unidad de forma natural
function redondearPorUnidad(valor, unidad) {
  const u = unidad.toLowerCase();
  if (valor <= 0) return 0;
  // Peso/volumen masivo
  if (/^(g|gr|gramos?|ml)\b/.test(u)) {
    return valor >= 100 ? Math.round(valor / 5) * 5 : Math.round(valor);
  }
  if (/^(kg|kilogramos?|l|litros?)\b/.test(u)) {
    return Math.round(valor * 10) / 10;
  }
  // Piezas discretas: mínimo 1 y entero
  if (/^(dientes?|unidad|huevos?|rodajas?|hojas?|rebanadas?|filetes?|pechugas?|muslos?|piezas?|porciones?|cubos?|ramas?|ramitas?|tallos?|vainas?|pimient|cebolla|tomate|zanahoria|papa|camote|limon|limón|manzana|naranja|platano|plátano|palta|aguacate)/.test(u)) {
    return Math.max(1, Math.round(valor));
  }
  // Medidas de cuchara/taza: medio en medio
  if (/^(cdas?|cucharadas?|cdtas?|cucharaditas?|tazas?|pizcas?|chorros?|gotas?|pu[ñn]ados?)/.test(u)) {
    return Math.round(valor * 2) / 2;
  }
  return Math.round(valor * 10) / 10;
}

// Formatea cantidad numérica a string elegante: 0.5 → "½", 1.5 → "1 ½", 2 → "2"
function formatearCantidadNatural(valor, unidad) {
  if (valor === 0) return '0';
  const entero = Math.floor(valor);
  const fraccion = valor - entero;
  const FRACC_TO_TXT = { 0.25: '¼', 0.333: '⅓', 0.5: '½', 0.667: '⅔', 0.75: '¾' };
  // Busca la fracción más cercana
  let mejorFrac = null, mejorDif = 0.05;
  for (const [key, sym] of Object.entries(FRACC_TO_TXT)) {
    const dif = Math.abs(fraccion - parseFloat(key));
    if (dif < mejorDif) { mejorDif = dif; mejorFrac = sym; }
  }
  if (entero === 0 && mejorFrac) return mejorFrac;
  if (entero > 0 && mejorFrac) return `${entero} ${mejorFrac}`;
  // Sin fracción limpia
  if (Math.abs(fraccion) < 0.05) return `${entero}`;
  return `${Math.round(valor * 10) / 10}`.replace('.', ',');
}

// Pluraliza/singulariza según cantidad
function ajustarPluralUnidad(unidad, cantidad) {
  const u = unidad.toLowerCase();
  const esSingular = cantidad === 1 || Math.abs(cantidad - 0.5) < 0.05 || Math.abs(cantidad - 0.25) < 0.05;

  // Unidades invariables
  const INVARIABLES = /^(g|gr|ml|kg|l)$/;
  if (INVARIABLES.test(u)) return unidad;

  // Plural irregular
  const IRREGULARES = {
    'limon': 'limones', 'limón': 'limones', 'limones': 'limones',
    'unidad': 'unidades', 'unidades': 'unidades'
  };
  if (IRREGULARES[u]) return esSingular ? u.replace(/es$/, '') : IRREGULARES[u];

  // Regla simple: termina en s → plural, si no → singular
  const terminaS = /s$/.test(u);
  if (esSingular && terminaS) {
    // Quitar s final (taza <- tazas, dientes <- diente? no, dientes queda)
    // Pero dientes singular es diente. Palabras que terminan en consonante + "es" → quitar "es"
    if (/[^aeiou]es$/.test(u)) return unidad.slice(0, -2);
    return unidad.slice(0, -1);
  }
  if (!esSingular && !terminaS) {
    // Pluralizar
    if (/[aeiou]$/.test(u)) return unidad + 's';
    return unidad + 'es';
  }
  return unidad;
}

function reescalarInstruccionesPorFactor(instrucciones, factor) {
  if (!instrucciones || !Array.isArray(instrucciones) || factor === 1) return instrucciones;

  // Unidades reconocidas (grupo capturado)
  const UNIDADES = '(g|gr|gramos?|kg|kilogramos?|ml|l|litros?|tazas?|cdas?|cucharadas?|cdtas?|cucharaditas?|pizcas?|chorros?|gotas?|pu[ñn]ados?|dientes?|unidades?|rodajas?|hojas?|porciones?|piezas?|cubos?|rebanadas?|filetes?|pechugas?|muslos?|huevos?|ramas?|ramitas?|tallos?|vainas?|pimentones?|cebollas?|tomates?|zanahorias?|papas?|camotes?|limones?|limon|limón|manzanas?|naranjas?|pl[áa]tanos?|paltas?|aguacates?)';

  const PALABRAS_KEYS = Object.keys(PALABRAS_NUMERO).join('|');
  const FRAC_UNI_CHARS = '½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞';

  // Una sola regex alternadora que captura CUALQUIER tipo de cantidad + unidad
  // Grupos: 1=mixta_entero 2=mixta_num 3=mixta_den | 4=ascii_num 5=ascii_den | 6=decimal 7=frac_uni_opt | 8=frac_uni_sola | 9=palabra | [después] de? + unidad
  const RX_TODO = new RegExp(
    `(?:` +
      // A: mixta "1 1/2"
      `(\\d+)\\s+(\\d+)\\/(\\d+)` +
      `|` +
      // B: ascii "1/2"
      `(\\d+)\\/(\\d+)` +
      `|` +
      // C: decimal con fracción unicode opcional "1 ½" o "180"
      `(\\d+(?:[\\.,]\\d+)?)\\s*([${FRAC_UNI_CHARS}])?` +
      `|` +
      // D: fracción unicode sola "½"
      `([${FRAC_UNI_CHARS}])` +
      `|` +
      // E: palabra "media", "un", "dos"...
      `\\b(${PALABRAS_KEYS})` +
    `)` +
    `\\s*(de\\s+)?` +
    UNIDADES +
    `\\b`,
    'gi'
  );

  const ES_TIEMPO_O_TEMP = /\b\d+\s*(min|minuto|segundo|hora|°c|°f|grados)/i;
  const ES_COMANDO_TM = /(velocidad|vel\.|varoma|sonda|giro|rpm)/i;

  function esContextoProtegido(offset, match, fullStr) {
    const inicio = Math.max(0, offset - 8);
    const fin = Math.min(fullStr.length, offset + match.length + 12);
    const ctx = fullStr.slice(inicio, fin);
    return ES_TIEMPO_O_TEMP.test(ctx) || ES_COMANDO_TM.test(ctx);
  }

  return instrucciones.map(paso => {
    if (typeof paso !== 'string') return paso;
    return paso.replace(RX_TODO, function(match, mixtEntero, mixtNum, mixtDen, ascNum, ascDen, dec, fracOpt, fracSola, palabra, deStr, unidad, offset, fullStr) {
      if (esContextoProtegido(offset, match, fullStr)) return match;

      let valor = null;
      let esEnteroOriginal = false;
      let palabraOriginal = null;
      let huboMayuscula = false;

      if (mixtEntero !== undefined) {
        valor = parseInt(mixtEntero, 10) + parseInt(mixtNum, 10) / parseInt(mixtDen, 10);
      } else if (ascNum !== undefined) {
        valor = parseInt(ascNum, 10) / parseInt(ascDen, 10);
      } else if (dec !== undefined) {
        valor = parseFloat(dec.replace(',', '.'));
        if (fracOpt && FRACCIONES_UNICODE[fracOpt]) valor += FRACCIONES_UNICODE[fracOpt];
        esEnteroOriginal = !fracOpt && !/[\.,]/.test(dec);
      } else if (fracSola !== undefined) {
        valor = FRACCIONES_UNICODE[fracSola];
      } else if (palabra !== undefined) {
        valor = PALABRAS_NUMERO[palabra.toLowerCase()];
        palabraOriginal = palabra;
        huboMayuscula = palabra[0] === palabra[0].toUpperCase();
      }

      if (valor == null || isNaN(valor) || valor === 0) return match;

      const nuevo = redondearPorUnidad(valor * factor, unidad);
      if (nuevo === 0) return match;

      const unidadAjustada = ajustarPluralUnidad(unidad, nuevo);

      // Si el original era palabra y el resultado es entero pequeño, mantener formato palabra
      if (palabraOriginal && nuevo === Math.floor(nuevo) && nuevo <= 10) {
        const palabraNueva = numeroAPalabraSiAplica(nuevo);
        if (palabraNueva) {
          const p = huboMayuscula ? palabraNueva[0].toUpperCase() + palabraNueva.slice(1) : palabraNueva;
          return `${p} ${deStr || ''}${unidadAjustada}`;
        }
      }

      return `${formatearCantidadNatural(nuevo, unidad)} ${deStr || ''}${unidadAjustada}`;
    });
  });
}

// =============================================
// UTILIDAD: Streak de adherencia consecutiva
// =============================================
function calcularStreakAdherencia() {
  try {
    var data = JSON.parse(localStorage.getItem('nutriplan_adherencia') || '{}');
    var streak = 0;
    var d = new Date();
    d.setDate(d.getDate() - 1); // empezar desde ayer
    for (var i = 0; i < 90; i++) {
      var key = d.toISOString().split('T')[0];
      var dia = data[key] || {};
      var total = 0, cumplidos = 0;
      Object.values(dia).forEach(function(e) { total++; if (e.comido) cumplidos++; });
      if (total === 0 || cumplidos / total < 0.8) break;
      streak++;
      d.setDate(d.getDate() - 1);
    }
    return streak;
  } catch(e) { return 0; }
}

// =============================================
// COMPONENTE: MacroDonut (SVG ring chart)
// =============================================
function MacroDonut({ consumed, metas, darkMode }) {
  var prot = metas.proteinas > 0 ? Math.min(1, (consumed.proteinas || 0) / metas.proteinas) : 0;
  var carb = metas.carbohidratos > 0 ? Math.min(1, (consumed.carbohidratos || 0) / metas.carbohidratos) : 0;
  var gras = metas.grasas > 0 ? Math.min(1, (consumed.grasas || 0) / metas.grasas) : 0;
  var kcalPct = metas.calorias > 0 ? Math.min(100, Math.round((consumed.calorias || 0) / metas.calorias * 100)) : 0;
  var R = 44, CX = 56, CY = 56, gapDeg = 6;
  var trackColor = darkMode ? '#374151' : '#E5E7EB';
  function arcD(startDeg, fillFrac) {
    var deg = (120 - gapDeg) * Math.max(0, Math.min(1, fillFrac));
    var s = (startDeg - 90) * Math.PI / 180;
    var e = s + deg * Math.PI / 180;
    var x1 = CX + R * Math.cos(s), y1 = CY + R * Math.sin(s);
    var x2 = CX + R * Math.cos(e), y2 = CY + R * Math.sin(e);
    return deg < 0.5 ? null : `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${R} ${R} 0 ${deg > 180 ? 1 : 0} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
  }
  function trackD(startDeg) {
    var deg = 120 - gapDeg;
    var s = (startDeg - 90) * Math.PI / 180;
    var e = s + deg * Math.PI / 180;
    var x1 = CX + R * Math.cos(s), y1 = CY + R * Math.sin(s);
    var x2 = CX + R * Math.cos(e), y2 = CY + R * Math.sin(e);
    return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${R} ${R} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
  }
  var macros = [
    { label: 'Prot',   val: consumed.proteinas || 0,      meta: metas.proteinas,      pct: Math.round(prot*100), color: '#3B82F6', start: 3   },
    { label: 'Carb',   val: consumed.carbohidratos || 0,  meta: metas.carbohidratos,  pct: Math.round(carb*100), color: '#F59E0B', start: 123 },
    { label: 'Grasas', val: consumed.grasas || 0,         meta: metas.grasas,         pct: Math.round(gras*100), color: '#EF4444', start: 243 },
  ];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingTop: '8px', borderTop: `1px solid ${darkMode ? '#374151' : '#F9FAFB'}` }}>
      <svg width="100" height="100" viewBox="0 0 112 112" style={{ flexShrink: 0 }}>
        {macros.map(m => (
          <path key={m.label + 't'} d={trackD(m.start)} fill="none" stroke={trackColor} strokeWidth="10" strokeLinecap="round"/>
        ))}
        {macros.map(m => {
          var d = arcD(m.start, m.pct / 100);
          return d ? <path key={m.label + 'f'} d={d} fill="none" stroke={m.color} strokeWidth="10" strokeLinecap="round"/> : null;
        })}
        <text x={CX} y={CY - 4} textAnchor="middle" fill={darkMode ? 'white' : '#111827'} fontSize="17" fontWeight="bold">{kcalPct}%</text>
        <text x={CX} y={CY + 11} textAnchor="middle" fill={darkMode ? '#9CA3AF' : '#6B7280'} fontSize="9">kcal</text>
      </svg>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {macros.map(function(m) {
          return (
            <div key={m.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: darkMode ? '#9CA3AF' : '#6B7280' }}>{m.label}</span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: darkMode ? '#E5E7EB' : '#1F2937' }}>{m.val}/{m.meta}g</span>
              </div>
              <div style={{ width: '100%', height: '5px', borderRadius: '999px', overflow: 'hidden', backgroundColor: darkMode ? '#374151' : '#E5E7EB' }}>
                <div style={{ width: Math.min(100, m.pct) + '%', height: '100%', borderRadius: '999px', backgroundColor: m.color, transition: 'width 0.5s' }}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =============================================
// COMPONENTE: ModalPreferenciasGeneracion
// =============================================
function ModalPreferenciasGeneracion({ onConfirm, onCancel, darkMode }) {
  const [cocina, setCocina] = React.useState('cualquiera');
  const [altaProteina, setAltaProteina] = React.useState(false);
  const [rapido, setRapido] = React.useState(false);
  const cocinas = [
    { v: 'cualquiera', l: 'Cualquiera' }, { v: 'mediterranea', l: 'Mediterránea' },
    { v: 'asiatica', l: 'Asiática' }, { v: 'latinoamerica', l: 'Latinoam.' }, { v: 'nordica', l: 'Nórdica' },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.55)' }}
      onClick={onCancel}>
      <div className={`w-full max-w-xs rounded-2xl p-6 shadow-2xl animate-slideUp ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
        onClick={e => e.stopPropagation()}>
        <h3 className={`text-base font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          <i className="fas fa-sliders mr-2 text-green-500"></i>Preferencias del plan
        </h3>
        <p className={`text-xs mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Personaliza antes de regenerar</p>
        <div className="mb-4">
          <div className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Tipo de cocina</div>
          <div className="flex flex-wrap gap-1.5">
            {cocinas.map(c => (
              <button key={c.v} onClick={() => setCocina(c.v)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  cocina === c.v ? 'bg-green-500 text-white' : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>{c.l}</button>
            ))}
          </div>
        </div>
        <div className="space-y-3 mb-5">
          {[
            { key: 'prot', val: altaProteina, set: setAltaProteina, icon: 'fa-dumbbell', iconColor: '#3B82F6', label: 'Priorizar alta proteína' },
            { key: 'rap',  val: rapido,       set: setRapido,       icon: 'fa-bolt',     iconColor: '#F59E0B', label: 'Preparación rápida (<20 min)' },
          ].map(function(item) {
            return (
              <div key={item.key} className="flex items-center justify-between">
                <span className={`text-sm flex items-center gap-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  <i className={`fas ${item.icon}`} style={{ color: item.iconColor }}></i>{item.label}
                </span>
                <button onClick={() => item.set(p => !p)} aria-label={item.label}
                  className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 cursor-pointer ${item.val ? 'bg-green-500' : darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${item.val ? 'translate-x-5' : 'translate-x-0.5'}`}></span>
                </button>
              </div>
            );
          })}
        </div>
        <div className="flex gap-2">
          <button onClick={onCancel}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            Cancelar
          </button>
          <button onClick={() => onConfirm({ cocina, altaProteina, rapido })}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold cursor-pointer bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all">
            <i className="fas fa-shuffle mr-1.5"></i>Regenerar
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================================
// COMPONENTE: RecipeModal
// =============================================
function RecipeModal({ receta, onClose, darkMode, factorComensales, usaThermomix = true }) {
  if (!receta) return null;
  const factor = factorComensales || 1;
  const tieneThermomix = usaThermomix && receta.instrucciones_thermomix && receta.instrucciones_thermomix.length > 0;
  const [tabActiva, setTabActiva] = React.useState("normal");
  const [sustitucionAbierta, setSustitucionAbierta] = React.useState(null); // nombre_normalizado del ing abierto
  const [sustitucionAplicada, setSustitucionAplicada] = React.useState(null); // preview
  // N18: accumulated macro deltas from applied substitutions
  const [macroAjustes, setMacroAjustes] = React.useState({ kcal: 0, proteinas: 0, carbohidratos: 0, grasas: 0 });
  const [ingsAjustados, setIngsAjustados] = React.useState({}); // { nombre_normalizado: sustId }
  const [ratingActual, setRatingActual] = React.useState(() => {
    var ratings = typeof cargarRatings === 'function' ? cargarRatings() : {};
    return ratings[receta.id] || 0;
  });
  const handleSetRating = (stars) => {
    var next = ratingActual === stars ? 0 : stars; // toggle para borrar
    setRatingActual(next);
    if (typeof guardarRating === 'function') guardarRating(receta.id, next);
  };

  const factorEscala = receta.factor_escala || 1;
  const ingredientesEscalados = receta.ingredientes_escalados || [];

  // Asegurar instrucciones en español + convertir a medidas caseras + escalar por comensales
  const instruccionesTraducidas = React.useMemo(() => {
    let instr = receta.instrucciones;
    if (typeof asegurarInstruccionesEspanol === 'function') {
      instr = asegurarInstruccionesEspanol(instr, receta);
    }
    if (typeof convertirInstruccionesAMedidasCaseras === 'function') {
      instr = convertirInstruccionesAMedidasCaseras(instr);
    }
    if (factor !== 1) {
      instr = reescalarInstruccionesPorFactor(instr, factor);
    }
    return instr;
  }, [receta, factor]);

  const instruccionesThermomixEscaladas = React.useMemo(() => {
    if (!tieneThermomix) return null;
    if (factor === 1) return receta.instrucciones_thermomix;
    return reescalarInstruccionesPorFactor(receta.instrucciones_thermomix, factor);
  }, [receta, factor, tieneThermomix]);

  React.useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 modal-overlay animate-overlayFadeIn" onClick={onClose}>
      <div className={`w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[92vh] overflow-hidden flex flex-col animate-slideUp shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
        onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-5 text-white flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="bg-white/20 px-2 py-0.5 rounded-lg text-xs font-medium backdrop-blur-sm">
                  {NOMBRES_COMIDAS[receta.tipo_comida]}
                </span>
                {receta._fuente === 'online' && (
                  <span className="bg-blue-400/40 px-2 py-0.5 rounded-lg text-xs font-medium backdrop-blur-sm">
                    <i className="fas fa-globe mr-1"></i>Receta de Internet
                  </span>
                )}
                {tieneThermomix && <span className="thermomix-badge"><i className="fas fa-blender mr-1"></i>TM6</span>}
              </div>
              <h2 className="text-lg font-bold leading-tight">{getNombreReceta(receta)}</h2>
            </div>
            {/* A4: aria-label en botón cerrar */}
            <button onClick={onClose} aria-label="Cerrar receta"
              className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-full hover:bg-white/30 transition-colors flex-shrink-0">
              <i className="fas fa-times text-sm"></i>
            </button>
          </div>
          {/* N18 + A9: macro totals adjusted; aria-live anuncia cambios por sustitución */}
          <div className="grid grid-cols-4 gap-2 mt-4" aria-live="polite" aria-atomic="true">
            <div className="bg-white/15 rounded-xl p-2 text-center backdrop-blur-sm">
              <div className="text-lg font-bold">{Math.round(receta.calorias_escaladas + macroAjustes.kcal)}</div>
              <div className="text-xs opacity-80">kcal{macroAjustes.kcal !== 0 && <span className="text-white/70"> *</span>}</div>
            </div>
            <div className="bg-blue-400/30 rounded-xl p-2 text-center backdrop-blur-sm">
              <div className="text-lg font-bold">{Math.round(receta.proteinas_escaladas + macroAjustes.proteinas)}</div>
              <div className="text-xs opacity-80">Prot. (g){macroAjustes.proteinas !== 0 && <span className="text-white/70"> *</span>}</div>
            </div>
            <div className="bg-amber-400/30 rounded-xl p-2 text-center backdrop-blur-sm">
              <div className="text-lg font-bold">{Math.round(receta.carbohidratos_escalados + macroAjustes.carbohidratos)}</div>
              <div className="text-xs opacity-80">Carb. (g){macroAjustes.carbohidratos !== 0 && <span className="text-white/70"> *</span>}</div>
            </div>
            <div className="bg-rose-400/30 rounded-xl p-2 text-center backdrop-blur-sm">
              <div className="text-lg font-bold">{Math.round(receta.grasas_escaladas + macroAjustes.grasas)}</div>
              <div className="text-xs opacity-80">Grasas (g){macroAjustes.grasas !== 0 && <span className="text-white/70"> *</span>}</div>
            </div>
          </div>
          {Object.keys(ingsAjustados).length > 0 && (
            <div className="text-[11px] opacity-70 mt-1 text-center">
              * ajustado por {Object.keys(ingsAjustados).length} sustitución{Object.keys(ingsAjustados).length > 1 ? 'es' : ''} aplicada{Object.keys(ingsAjustados).length > 1 ? 's' : ''}
            </div>
          )}
          {receta.factor_escala && receta.factor_escala !== 1 && (
            <div className="text-xs opacity-70 mt-2 text-center">
              ×{Math.round(receta.factor_escala * 10) / 10} escala · base {receta.calorias_base} kcal
            </div>
          )}
          {/* Tiempo + costo en el header del modal */}
          {(receta.tiempo_total_min || receta.costo_clp) && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              {receta.tiempo_prep_min != null && (
                <div className="bg-white/15 rounded-lg p-2 text-center backdrop-blur-sm">
                  <div className="text-sm font-bold"><i className="fas fa-knife-kitchen mr-1 text-xs"></i>{receta.tiempo_prep_min}′</div>
                  <div className="text-[11px] opacity-80">Preparación</div>
                </div>
              )}
              {receta.tiempo_coccion_min != null && (
                <div className="bg-white/15 rounded-lg p-2 text-center backdrop-blur-sm">
                  <div className="text-sm font-bold"><i className="fas fa-fire mr-1 text-xs"></i>{receta.tiempo_coccion_min}′</div>
                  <div className="text-[11px] opacity-80">Cocción</div>
                </div>
              )}
              {receta.costo_clp > 0 && (
                <div className="bg-white/15 rounded-lg p-2 text-center backdrop-blur-sm">
                  <div className="text-sm font-bold">${(Math.ceil((receta.costo_clp || 0) * (receta.factor_escala || 1) * factor / 100) * 100).toLocaleString('es-CL')}</div>
                  <div className="text-[11px] opacity-80">CLP{factor !== 1 ? ` · ×${factor.toFixed(2)}` : ''}</div>
                </div>
              )}
            </div>
          )}
          {factor !== 1 && (
            <div className="mt-2 p-2 bg-white/15 rounded-lg text-center text-[11px] backdrop-blur-sm">
              <i className="fas fa-users mr-1"></i>
              Cantidades e ingredientes escalados para <strong>{factor.toFixed(2)} porciones</strong> · kcal/macros siguen siendo tu porción individual
            </div>
          )}
          {/* ⭐ Rating de receta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.75)', marginRight: '4px' }}>Valorar:</span>
            {[1,2,3,4,5].map(s => (
              <button key={s} onClick={() => handleSetRating(s)} aria-label={`${s} estrellas`}
                style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'none', border: 'none', padding: 0, transition: 'transform 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.25)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                <i className="fas fa-star" style={{ fontSize: '17px', color: s <= ratingActual ? '#FDE047' : 'rgba(255,255,255,0.25)' }}></i>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {receta._imagen && (
            <div className="relative h-40 overflow-hidden">
              {/* P1: loading lazy — imagen del modal nunca es above-the-fold */}
              <img src={receta._imagen} alt={receta.nombre} loading="lazy" className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
          )}
          <div className={`p-5 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <h3 className={`font-semibold mb-3 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              <i className="fas fa-list-check text-green-500"></i>Ingredientes
              <span className="text-xs font-normal text-gray-400">
                {factor === 1 ? '(cantidades escaladas)' : `(×${factor.toFixed(2)} para ${factor.toFixed(2)} porciones)`}
              </span>
            </h3>
            <div className="space-y-2">
              {receta.ingredientes_escalados.map((ing, idx) => {
                const sustitutos = (typeof window.buscarSustitutosIngrediente === 'function')
                  ? window.buscarSustitutosIngrediente(ing.nombre_normalizado) : [];
                const tieneSustitutos = sustitutos.length > 0;
                const estaAbierto = sustitucionAbierta === ing.nombre_normalizado;
                return (
                  <div key={idx}>
                    <div className={`flex items-center justify-between py-1.5 px-3 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className={`text-sm capitalize break-words leading-snug ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{ing.nombre_display || ing.nombre}</span>
                        {tieneSustitutos && (
                          <button
                            onClick={() => setSustitucionAbierta(estaAbierto ? null : ing.nombre_normalizado)}
                            className={`text-xs px-1.5 py-0.5 rounded transition-colors ${
                              estaAbierto
                                ? 'bg-indigo-500 text-white'
                                : darkMode ? 'text-indigo-400 hover:bg-indigo-900/40' : 'text-indigo-600 hover:bg-indigo-50'
                            }`}
                            title="Ver sustitutos">
                            <i className="fas fa-right-left text-[11px]"></i> {sustitutos.length}
                          </button>
                        )}
                      </div>
                      <span className={`text-sm font-medium px-2 py-0.5 rounded-lg whitespace-nowrap ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-900'}`}>
                        {formatearCantidad((ing.cantidad_escalada || 0) * factor, typeof traducirUnidad === 'function' ? traducirUnidad(ing.unidad) : ing.unidad, ing.nombre_normalizado)}
                      </span>
                    </div>
                    {estaAbierto && tieneSustitutos && (
                      <div className={`ml-3 mt-1 mb-2 p-3 rounded-lg border-l-2 border-indigo-400 min-w-0 ${darkMode ? 'bg-indigo-950/30' : 'bg-indigo-50/70'}`}>
                        <div className="text-[11px] uppercase tracking-wide font-semibold text-indigo-500 mb-2">
                          Sustituir por ({sustitutos[0]?.categoria || 'similar'})
                        </div>
                        <div className="space-y-1.5">
                          {sustitutos.map(s => {
                            const calc = window.calcularMacrosTrasSustitucion
                              ? window.calcularMacrosTrasSustitucion(receta, ing.nombre_normalizado, s.id) : null;
                            return (
                              <div key={s.id} className={`p-2 rounded-md text-xs ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    {/* L2: truncate para evitar overflow en pantallas angostas */}
                                    <div className={`font-semibold capitalize truncate ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                      {s.id.replace(/_/g, ' ')}
                                    </div>
                                    <div className={`text-[11px] mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{s.nota}</div>
                                  </div>
                                  {calc && (
                                    <div className="text-right whitespace-nowrap">
                                      <div className={`text-[11px] ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {calc.cantidad_nueva}{ing.unidad}
                                      </div>
                                      <div className={`text-[11px] font-medium ${calc.delta_kcal > 0 ? 'text-rose-500' : calc.delta_kcal < 0 ? 'text-emerald-500' : 'text-gray-400'}`}>
                                        {calc.delta_kcal > 0 ? '+' : ''}{calc.delta_kcal} kcal
                                      </div>
                                    </div>
                                  )}
                                </div>
                                {calc && (
                                  <div className="flex gap-2 mt-1.5 text-[11px]">
                                    <span className={calc.delta_proteinas > 0 ? 'text-blue-500' : calc.delta_proteinas < 0 ? 'text-gray-400' : 'text-gray-400'}>
                                      P: {calc.delta_proteinas > 0 ? '+' : ''}{calc.delta_proteinas}g
                                    </span>
                                    <span className={calc.delta_carbohidratos > 0 ? 'text-amber-600' : 'text-gray-400'}>
                                      C: {calc.delta_carbohidratos > 0 ? '+' : ''}{calc.delta_carbohidratos}g
                                    </span>
                                    <span className={calc.delta_grasas > 0 ? 'text-rose-500' : 'text-gray-400'}>
                                      G: {calc.delta_grasas > 0 ? '+' : ''}{calc.delta_grasas}g
                                    </span>
                                    {s.precio && (
                                      <span className={`ml-auto ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                        ~${Math.round(calc.cantidad_nueva * s.precio.clp_por_unidad_base).toLocaleString('es-CL')}
                                      </span>
                                    )}
                                  </div>
                                )}
                                {/* N18: apply button to update macro totals */}
                                {calc && (() => {
                                  const yaAplicado = ingsAjustados[ing.nombre_normalizado] === s.id;
                                  return (
                                    <button
                                      onClick={() => {
                                        if (yaAplicado) {
                                          setMacroAjustes(prev => ({
                                            kcal: prev.kcal - calc.delta_kcal,
                                            proteinas: prev.proteinas - calc.delta_proteinas,
                                            carbohidratos: prev.carbohidratos - calc.delta_carbohidratos,
                                            grasas: prev.grasas - calc.delta_grasas
                                          }));
                                          setIngsAjustados(prev => { const n = {...prev}; delete n[ing.nombre_normalizado]; return n; });
                                        } else {
                                          const prevSustId = ingsAjustados[ing.nombre_normalizado];
                                          const prevCalc = prevSustId && window.calcularMacrosTrasSustitucion
                                            ? window.calcularMacrosTrasSustitucion(receta, ing.nombre_normalizado, prevSustId) : null;
                                          setMacroAjustes(prev => ({
                                            kcal: (prev.kcal - (prevCalc ? prevCalc.delta_kcal : 0)) + calc.delta_kcal,
                                            proteinas: (prev.proteinas - (prevCalc ? prevCalc.delta_proteinas : 0)) + calc.delta_proteinas,
                                            carbohidratos: (prev.carbohidratos - (prevCalc ? prevCalc.delta_carbohidratos : 0)) + calc.delta_carbohidratos,
                                            grasas: (prev.grasas - (prevCalc ? prevCalc.delta_grasas : 0)) + calc.delta_grasas
                                          }));
                                          setIngsAjustados(prev => ({...prev, [ing.nombre_normalizado]: s.id}));
                                        }
                                      }}
                                      className={`mt-1.5 w-full text-[11px] py-1 rounded font-semibold transition-colors ${yaAplicado ? 'bg-indigo-500 text-white' : darkMode ? 'bg-gray-700 text-indigo-400 hover:bg-indigo-900/40' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}>
                                      {yaAplicado ? '✓ Aplicado — quitar' : 'Aplicar al total'}
                                    </button>
                                  );
                                })()}
                              </div>
                            );
                          })}
                        </div>
                        <div className={`text-[11px] mt-2 italic ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          <i className="fas fa-info-circle mr-1"></i>Solo referencia nutricional. El sabor puede cambiar.
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {tieneThermomix && (
            <div className="px-5 pt-4 flex gap-2">
              <button onClick={() => setTabActiva("normal")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  tabActiva === "normal" ? 'bg-green-500 text-white shadow-md' : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                <i className="fas fa-fire-burner mr-1"></i>Cocina Normal
              </button>
              <button onClick={() => setTabActiva("thermomix")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  tabActiva === "thermomix" ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md' : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                <i className="fas fa-blender mr-1"></i>Thermomix TM6
              </button>
            </div>
          )}

          <div className="p-5">
            {(tabActiva === "normal" || !tieneThermomix) && (
              <div key="normal" className="animate-fadeIn">
                {!tieneThermomix && (
                  <h3 className={`font-semibold mb-3 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    <i className="fas fa-fire-burner text-green-500"></i>Instrucciones
                  </h3>
                )}
                <ol className="space-y-3">
                  {instruccionesTraducidas.map((paso, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="flex-shrink-0 w-7 h-7 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                      <p className={`text-sm leading-relaxed pt-0.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{paso}</p>
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {tabActiva === "thermomix" && tieneThermomix && (
              <div key="thermomix" className="animate-fadeIn">
                <div className={`rounded-xl p-3 mb-4 text-xs flex items-start gap-2 ${darkMode ? 'bg-indigo-900/40 border border-indigo-700 text-indigo-300' : 'bg-indigo-50 border border-indigo-200 text-indigo-700'}`}>
                  <i className="fas fa-blender mt-0.5"></i>
                  <span><strong>Receta profesional para Thermomix TM6.</strong> Incluye mise en place, técnica detallada, comandos completos (tiempo / temperatura / velocidad / giro), uso de accesorios y controles de cocción. Vaso 2.2 L: respetar cantidades máximas.</span>
                </div>
                <ol className="space-y-4">
                  {instruccionesThermomixEscaladas.map((paso, idx) => {
                    // Separar "Paso N:" del contenido y parsear **negritas**
                    const match = paso.match(/^Paso\s+\d+:\s*([\s\S]+)$/);
                    const contenido = match ? match[1] : paso;
                    const partes = contenido.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
                    return (
                      <li key={idx} className="flex gap-3">
                        <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">{idx + 1}</span>
                        <p className={`text-sm leading-relaxed pt-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                          {partes.map((parte, i) => {
                            if (parte.startsWith('**') && parte.endsWith('**')) {
                              const texto = parte.slice(2, -2);
                              return <strong key={i} className={darkMode ? 'text-indigo-300 font-semibold' : 'text-indigo-700 font-semibold'}>{texto}</strong>;
                            }
                            return <React.Fragment key={i}>{parte}</React.Fragment>;
                          })}
                        </p>
                      </li>
                    );
                  })}
                </ol>
                <div className={`mt-5 rounded-xl p-3 text-xs flex items-start gap-2 ${darkMode ? 'bg-gray-700/50 border border-gray-600 text-gray-300' : 'bg-amber-50 border border-amber-200 text-amber-800'}`}>
                  <i className="fas fa-lightbulb mt-0.5"></i>
                  <span><strong>Tips del chef:</strong> preparar siempre el mise en place antes de encender la máquina; usar solo la espátula TM para bajar restos del vaso; el giro inverso protege ingredientes delicados; nunca abrir el Varoma sin retirarlo primero del vaso (el condensado cae en la preparación).</span>
                </div>
              </div>
            )}
          </div>

          <div className="px-5 pb-5">
            <div className="flex flex-wrap gap-2 mb-3">
              {receta.es_sin_gluten && <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-lg text-xs font-medium">🌾 Sin gluten</span>}
              {receta.es_sin_lactosa && <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-medium">🥛 Sin lactosa</span>}
              {receta.es_vegetariana && <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-lg text-xs font-medium">🥬 Vegetariana</span>}
            </div>
            <a href="#" onClick={(e) => {
              e.preventDefault();
              try {
                const ingredientesTexto = ingredientesEscalados.map(ing => {
                  const cantEscalada = (ing.cantidad_escalada || 0) * factor;
                  const cant = typeof formatearCantidad === 'function' ? formatearCantidad(cantEscalada, typeof traducirUnidad === 'function' ? traducirUnidad(ing.unidad) : ing.unidad, ing.nombre_normalizado) : (cantEscalada + ' ' + ing.unidad);
                  return `- ${cant} de ${ing.nombre}`;
                }).join('\n');
                const instrArr = tieneThermomix && tabActiva === 'thermomix' ? instruccionesThermomixEscaladas : instruccionesTraducidas;
                // Limpiar "Paso N:" (ya numeramos) y convertir **negrita** -> *negrita* (formato WhatsApp)
                const instrTexto = instrArr.map((p, i) => {
                  const limpio = p.replace(/^Paso\s+\d+:\s*/,'').replace(/\*\*([^*]+)\*\*/g, '*$1*');
                  return `${i+1}. ${limpio}`;
                }).join('\n\n');
                const texto = `*${receta.nombre}*\n\n${receta.calorias_escaladas || Math.round(receta.calorias_base * factorEscala)} kcal | P: ${receta.proteinas_escaladas || Math.round(receta.proteinas_g * factorEscala)}g | C: ${receta.carbohidratos_escalados || Math.round(receta.carbohidratos_g * factorEscala)}g | G: ${receta.grasas_escaladas || Math.round(receta.grasas_g * factorEscala)}g\n\n*Ingredientes:*\n${ingredientesTexto}\n\n*Preparacion${tieneThermomix && tabActiva === 'thermomix' ? ' (Thermomix TM6)' : ''}:*\n${instrTexto}\n\n_Calibrate_`;
                const encoded = encodeURIComponent(texto);
                window.open('https://api.whatsapp.com/send?text=' + encoded, '_blank', 'noopener');
              } catch(err) {
                console.error('Error compartiendo:', err);
                if (window._NP_toast) window._NP_toast('No se pudo abrir WhatsApp', 'error');
                else alert('No se pudo abrir WhatsApp. Copia el texto manualmente.');
              }
            }}
              className={`block w-full py-3 rounded-xl font-medium text-sm text-center no-underline transition-all ${darkMode ? 'bg-green-700 hover:bg-green-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}>
              <i className="fab fa-whatsapp text-lg mr-2"></i>Compartir por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}


// =============================================
// COMPONENTE: Pantry (MEJORA 1: unidades de compra)
// =============================================
function Pantry({ plan, onNavigateToShopping, darkMode }) {
  const [soloRestantes, setSoloRestantes] = React.useState(false);
  const ingredientesConsolidados = React.useMemo(() => consolidarIngredientesFiltrado(plan, soloRestantes), [plan, soloRestantes]);
  const [despensa, setDespensa] = React.useState(() => cargarDespensa());
  const [busqueda, setBusqueda] = React.useState("");
  const [ingredientesManual, setIngredientesManual] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('nutriplan_despensa_manual') || '[]'); } catch { return []; }
  });
  const [nuevoIngrediente, setNuevoIngrediente] = React.useState("");
  const [mostrarAgregar, setMostrarAgregar] = React.useState(false);
  const diasRestantes = React.useMemo(() => obtenerDiasRestantes(), []);
  const diaActual = React.useMemo(() => obtenerDiaActual(), []);

  React.useEffect(() => { guardarDespensa(despensa); }, [despensa]);
  React.useEffect(() => { localStorage.setItem('nutriplan_despensa_manual', JSON.stringify(ingredientesManual)); }, [ingredientesManual]);

  const agregarIngredienteManual = () => {
    const nombre = nuevoIngrediente.trim();
    if (!nombre) return;
    const id = 'manual_' + nombre.toLowerCase().replace(/\s+/g, '_');
    if (ingredientesManual.some(i => i.id === id)) return;
    setIngredientesManual(prev => [...prev, { id, nombre, nombre_display: nombre, unidad_interna: 'unidad', cantidad_total: 1, unidad_compra: 'unidades', factor_conversion: 1, descripcion_compra: '', unidades_compra: 1, esManual: true }]);
    setDespensa(prev => ({ ...prev, [id]: true }));
    setNuevoIngrediente("");
  };
  const eliminarIngredienteManual = (id) => {
    setIngredientesManual(prev => prev.filter(i => i.id !== id));
    setDespensa(prev => { const n = { ...prev }; delete n[id]; return n; });
  };

  // Fase 7.2: fechas de caducidad eliminadas — no aportaban valor al flujo real.
  const toggleDespensa = (id) => {
    setDespensa(prev => ({ ...prev, [id]: !prev[id] }));
  };
  const marcarTodos = () => {
    const n = { ...despensa };
    ingredientesConsolidados.forEach(ing => { n[ing.id] = true; });
    setDespensa(n);
  };
  const desmarcarTodos = () => {
    if (!window.confirm('¿Desmarcar todos los ingredientes de la despensa?')) return;
    const n = { ...despensa };
    ingredientesConsolidados.forEach(ing => { n[ing.id] = false; });
    setDespensa(n);
  };

  const ingredientesFiltrados = ingredientesConsolidados.filter(ing =>
    ing.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );
  const totalIngredientes = ingredientesConsolidados.length;
  const enDespensa = ingredientesConsolidados.filter(ing => despensa[ing.id]).length;
  const faltantes = totalIngredientes - enDespensa;

  return (
    <div className="animate-fadeIn">
      <div className={`rounded-2xl shadow-sm border p-5 mb-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-semibold text-lg flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            <i className="fas fa-warehouse text-green-500"></i>Tu Despensa
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className={`rounded-xl p-3 text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{totalIngredientes}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
          <div className={`rounded-xl p-3 text-center ${darkMode ? 'bg-green-900/40' : 'bg-green-50'}`}>
            <div className="text-xl font-bold text-green-600">{enDespensa}</div>
            <div className="text-xs text-green-600">Ya tengo</div>
          </div>
          <div className={`rounded-xl p-3 text-center ${darkMode ? 'bg-amber-900/40' : 'bg-amber-50'}`}>
            <div className="text-xl font-bold text-amber-600">{faltantes}</div>
            <div className="text-xs text-amber-600">Me faltan</div>
          </div>
        </div>
        <div className={`h-2.5 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${totalIngredientes > 0 ? (enDespensa / totalIngredientes) * 100 : 0}%` }}></div>
        </div>
        <div className="text-xs text-gray-400 mt-1 text-right">
          {totalIngredientes > 0 ? Math.round((enDespensa / totalIngredientes) * 100) : 0}% completo
        </div>
      </div>

      {diasRestantes.length > 0 && (
        <div className={`rounded-2xl shadow-sm border p-4 mb-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <i className={`fas fa-calendar-alt text-sm ${soloRestantes ? 'text-blue-500' : 'text-gray-400'}`}></i>
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Solo desde mañana
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${soloRestantes ? 'bg-blue-100 text-blue-600' : darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                {soloRestantes ? `${diasRestantes.length} días` : `${diasRestantes.length + 1} días`}
              </span>
            </div>
            <button onClick={() => setSoloRestantes(!soloRestantes)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                soloRestantes ? 'bg-blue-500' : darkMode ? 'bg-gray-600' : 'bg-gray-300'
              }`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-sm ${
                soloRestantes ? 'translate-x-6' : 'translate-x-1'
              }`}></span>
            </button>
          </div>
          {soloRestantes && (
            <div className={`mt-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <i className="fas fa-info-circle mr-1"></i>
              Hoy es {diaActual}. Mostrando ingredientes para: {diasRestantes.join(', ')}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 relative">
          <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border transition-colors text-sm ${
              darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'border-gray-200'
            } focus:border-green-500`}
            placeholder="Buscar ingrediente..." />
        </div>
        <div className="flex gap-2">
          <button onClick={marcarTodos}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
              darkMode ? 'bg-green-900/40 text-green-400 hover:bg-green-900/60' : 'bg-green-50 text-green-700 hover:bg-green-100'
            }`}>
            <i className="fas fa-check-double mr-1"></i>Marcar todos
          </button>
          <button onClick={desmarcarTodos}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
              darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}>
            <i className="fas fa-times mr-1"></i>Limpiar
          </button>
        </div>
      </div>

      {/* Agregar ingrediente manual */}
      <div className={`rounded-2xl shadow-sm border p-4 mb-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <button onClick={() => setMostrarAgregar(!mostrarAgregar)}
          className={`flex items-center gap-2 text-sm font-medium w-full ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <i className={`fas ${mostrarAgregar ? 'fa-chevron-down' : 'fa-plus-circle'} text-green-500`}></i>
          Agregar ingrediente manual
        </button>
        {mostrarAgregar && (
          <div className="flex gap-2 mt-3">
            <input type="text" value={nuevoIngrediente} onChange={(e) => setNuevoIngrediente(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && agregarIngredienteManual()}
              className={`flex-1 px-3 py-2 rounded-xl border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200'} focus:border-green-500`}
              placeholder="Ej: Pan, Mantequilla, etc." />
            <button onClick={agregarIngredienteManual}
              className="px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors">
              <i className="fas fa-plus"></i>
            </button>
          </div>
        )}
        {ingredientesManual.length > 0 && (
          <div className={`mt-3 pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <div className={`text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Mis ingredientes ({ingredientesManual.length})</div>
            {ingredientesManual.map(ing => (
              <div key={ing.id} className={`flex items-center justify-between py-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <div className="flex items-center gap-2">
                  {/* T2/A8: div→button, 32×32px touch target */}
                  <button onClick={() => toggleDespensa(ing.id)}
                    aria-label={`${despensa[ing.id] ? 'Quitar de despensa' : 'Marcar como disponible en despensa'}: ${ing.nombre}`}
                    className={`w-8 h-8 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${despensa[ing.id] ? 'bg-green-500 border-green-500' : darkMode ? 'border-gray-500 hover:border-green-400' : 'border-gray-300 hover:border-green-400'}`}>
                    {despensa[ing.id] && <i className="fas fa-check text-white text-xs"></i>}
                  </button>
                  <span className={`text-sm ${despensa[ing.id] ? 'line-through text-gray-400' : ''}`}>{ing.nombre}</span>
                </div>
                <button onClick={() => eliminarIngredienteManual(ing.id)}
                  className="text-red-400 hover:text-red-500 text-xs p-1"><i className="fas fa-trash-alt"></i></button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={`rounded-2xl shadow-sm border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <div className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-50'}`}>
          {ingredientesFiltrados.map(ing => (
            <div key={ing.id}
              className={`flex items-center justify-between p-4 transition-all ${
                despensa[ing.id]
                  ? (darkMode ? 'bg-green-900/20' : 'bg-green-50/50')
                  : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              }`}>
              {/* T2/A8: div→button con 32×32px mínimo y aria-label */}
              <button onClick={() => toggleDespensa(ing.id)}
                aria-label={`${despensa[ing.id] ? 'Quitar de despensa' : 'Tengo en despensa'}: ${ing.nombre}`}
                className="flex items-center gap-3 flex-1 cursor-pointer text-left">
                <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                  despensa[ing.id] ? 'bg-green-500 border-green-500' : darkMode ? 'border-gray-500 hover:border-green-400' : 'border-gray-300 hover:border-green-400'}`}>
                  {despensa[ing.id] && <i className="fas fa-check text-white text-xs"></i>}
                </div>
                <div className="flex-1">
                  <span className={`text-sm ${despensa[ing.id] ? 'text-gray-500' : darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{ing.nombre}</span>
                </div>
              </button>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-lg whitespace-nowrap ml-2 ${
                despensa[ing.id]
                  ? 'bg-green-100 text-green-600'
                  : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
              }`}>
                {formatearCompraCorto(ing)}
              </span>
            </div>
          ))}
        </div>
        {ingredientesFiltrados.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            <i className="fas fa-search text-2xl mb-2"></i>
            <p className="text-sm">No se encontraron ingredientes</p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <button onClick={onNavigateToShopping}
          className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-semibold text-lg shadow-lg shadow-amber-200 hover:shadow-xl transition-all active:scale-[0.98]">
          <i className="fas fa-shopping-cart mr-2"></i>Ver Lista de Compras ({faltantes} items)
        </button>
      </div>
    </div>
  );
}


// =============================================
// COMPONENTE: EsencialesRecurrentes
// Items que el usuario siempre trae a la casa (independiente del plan semanal).
// Persistido en localStorage['nutriplan_esenciales'].
// =============================================
const ESENCIALES_SEED = [
  { nombre: "Papel higiénico", activo: false },
  { nombre: "Detergente ropa", activo: false },
  { nombre: "Lavaloza", activo: false },
  { nombre: "Jabón de manos", activo: false },
  { nombre: "Shampoo", activo: false },
  { nombre: "Pasta de dientes", activo: false },
  { nombre: "Café", activo: false },
  { nombre: "Azúcar", activo: false },
  { nombre: "Sal", activo: false },
  { nombre: "Aceite de oliva", activo: false },
  { nombre: "Huevos", activo: false },
  { nombre: "Pan", activo: false },
  { nombre: "Leche", activo: false },
  { nombre: "Papel aluminio", activo: false },
  { nombre: "Bolsas de basura", activo: false }
];

function cargarEsenciales() {
  try {
    const raw = localStorage.getItem('nutriplan_esenciales');
    if (!raw) return ESENCIALES_SEED.map((e, i) => ({ id: `es_${i}`, ...e }));
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return ESENCIALES_SEED.map((e, i) => ({ id: `es_${i}`, ...e }));
    return parsed;
  } catch {
    return ESENCIALES_SEED.map((e, i) => ({ id: `es_${i}`, ...e }));
  }
}
function guardarEsenciales(lista) {
  try { localStorage.setItem('nutriplan_esenciales', JSON.stringify(lista)); } catch {}
}

function EsencialesRecurrentes({ darkMode }) {
  const [items, setItems] = React.useState(() => cargarEsenciales());
  const [nuevoNombre, setNuevoNombre] = React.useState("");
  const [expandido, setExpandido] = React.useState(true);

  React.useEffect(() => { guardarEsenciales(items); }, [items]);

  const activos = items.filter(i => i.activo).length;

  const toggle = (id) => setItems(prev => prev.map(i => i.id === id ? { ...i, activo: !i.activo } : i));
  const eliminar = (id) => setItems(prev => prev.filter(i => i.id !== id));
  const agregar = () => {
    const nombre = nuevoNombre.trim();
    if (!nombre) return;
    if (items.some(i => i.nombre.toLowerCase() === nombre.toLowerCase())) { setNuevoNombre(""); return; }
    setItems(prev => [...prev, { id: `es_${Date.now()}`, nombre, activo: true }]);
    setNuevoNombre("");
  };
  const desmarcarTodos = () => setItems(prev => prev.map(i => ({ ...i, activo: false })));

  return (
    <div className={`rounded-2xl shadow-sm border overflow-hidden mb-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
      <button
        onClick={() => setExpandido(!expandido)}
        className={`w-full px-4 py-3 flex items-center justify-between ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'}`}>
        <div className="flex items-center gap-2">
          <i className="fas fa-home text-indigo-500"></i>
          <span className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>Esenciales recurrentes</span>
          {activos > 0 && (
            <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-medium">{activos} activos</span>
          )}
        </div>
        <i className={`fas fa-chevron-${expandido ? 'up' : 'down'} text-gray-400 text-sm`}></i>
      </button>

      {expandido && (
        <div className={`px-4 py-3 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <p className={`text-xs mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Items que siempre compras. Marca los que necesites esta semana y se sumarán al texto de la lista.
          </p>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') agregar(); }}
              placeholder="Agregar item (ej: servilletas)"
              className={`flex-1 px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-200 text-gray-800'}`}
            />
            <button onClick={agregar}
              className="px-3 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium">
              <i className="fas fa-plus"></i>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            {items.map(item => (
              <div key={item.id}
                className={`flex items-center justify-between px-3 py-2 rounded-lg border text-sm ${
                  item.activo
                    ? (darkMode ? 'bg-indigo-900/30 border-indigo-700' : 'bg-indigo-50 border-indigo-200')
                    : (darkMode ? 'bg-gray-700/40 border-gray-700' : 'bg-gray-50 border-gray-100')
                }`}>
                <label className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer">
                  <input type="checkbox" checked={item.activo} onChange={() => toggle(item.id)}
                    className="w-4 h-4 accent-indigo-500 flex-shrink-0" />
                  <span className={`truncate ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{item.nombre}</span>
                </label>
                <button onClick={() => eliminar(item.id)} title="Eliminar"
                  className="text-gray-400 hover:text-red-500 text-xs ml-2">
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
          </div>
          {activos > 0 && (
            <button onClick={desmarcarTodos}
              className={`text-xs mt-2 ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
              <i className="fas fa-eraser mr-1"></i>Desmarcar todos
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Lee esenciales activos desde localStorage (para incluirlos en el texto exportado)
function esencialesActivos() {
  try {
    const raw = localStorage.getItem('nutriplan_esenciales');
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list.filter(i => i.activo) : [];
  } catch { return []; }
}

// =============================================
// COMPONENTE: ShoppingList (MEJORA 1: unidades compra)
// =============================================
function ShoppingList({ plan, darkMode }) {
  const [copiado, setCopiado] = React.useState(false);
  const [agrupado, setAgrupado] = React.useState(true);
  const [soloRestantes, setSoloRestantes] = React.useState(false);
  const [despensa, setDespensa] = React.useState(() => cargarDespensa());
  const [comprados, setComprados] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('nutriplan_comprados') || '{}'); } catch { return {}; }
  });
  // Fase 3.3: factor de comensales aplicado a cantidades y compras (con listener de cambios)
  const [factorComensales, setFactorComensales] = React.useState(() =>
    window.perfilesMulti ? window.perfilesMulti.factorCoccion(window.perfilesMulti.cargar()) : 1);
  React.useEffect(() => {
    const handler = (e) => {
      if (window.perfilesMulti) setFactorComensales(window.perfilesMulti.factorCoccion(e.detail));
    };
    window.addEventListener('perfiles-change', handler);
    return () => window.removeEventListener('perfiles-change', handler);
  }, []);
  const ingredientesRaw = React.useMemo(() => consolidarIngredientesFiltrado(plan, soloRestantes), [plan, soloRestantes]);
  const ingredientesConsolidados = React.useMemo(() => {
    if (factorComensales === 1) return ingredientesRaw;
    return ingredientesRaw.map(ing => ({
      ...ing,
      cantidad: (ing.cantidad || 0) * factorComensales,
      cantidad_comensales: true
    }));
  }, [ingredientesRaw, factorComensales]);
  const ingredientesFaltantes = ingredientesConsolidados.filter(ing => !despensa[ing.id]);

  React.useEffect(() => { localStorage.setItem('nutriplan_comprados', JSON.stringify(comprados)); }, [comprados]);

  const toggleComprado = (e, id) => {
    e.stopPropagation();
    setComprados(prev => ({ ...prev, [id]: !prev[id] }));
  };
  const marcarEnDespensa = (e, id) => {
    e.stopPropagation();
    const nuevaDespensa = { ...despensa, [id]: true };
    setDespensa(nuevaDespensa);
    guardarDespensa(nuevaDespensa);
    // También quitar de comprados
    setComprados(prev => { const n = { ...prev }; delete n[id]; return n; });
  };
  const limpiarComprados = () => {
    if (!window.confirm('¿Limpiar todos los ítems marcados como comprados?')) return;
    setComprados({});
  };
  const diasRestantes = React.useMemo(() => obtenerDiasRestantes(), []);
  const diaActual = React.useMemo(() => obtenerDiaActual(), []);

  const categorias = React.useMemo(() => {
    const cats = {
      "🥩 Proteínas": [], "🥬 Frutas y Verduras": [],
      "🥛 Lácteos": [], "🥤 Líquidos y Bebidas": [], "🥜 Frutos Secos y Semillas": [],
      "🏪 Despensa": [], "📦 Otros": []
    };
    const clasificar = (nombre) => {
      const n = nombre.toLowerCase();
      // ── Excepciones tempranas (ingredientes ambiguos) ──
      if (n.includes("nuez moscada")) return "🏪 Despensa";
      if ((n.includes("arandano") || n.includes("arándano")) && (n.includes("deshid") || n.includes("seco"))) return "🥜 Frutos Secos y Semillas";
      if (n.includes("salsa de tomate") || n.includes("puré de tomate") || n.includes("pasta de tomate") || n.includes("tomate enlatado")) return "🏪 Despensa";
      if (n.includes("poroto verde") || n.includes("porotos verdes")) return "🥬 Frutas y Verduras";
      // Ingredientes que el usuario pidió mover explícitamente a Despensa:
      if (n.includes("coco rallado") || n.includes("dátil") || n.includes("datil") || n.includes("mantequilla de almendra") || n.includes("alcapar") || n.includes("crackers") || n.includes("gelatina") || n.includes("café instantáneo") || n.includes("cafe instantaneo") || n.includes("café instant") || n.includes("muffin inglés") || n.includes("muffin ingles") || n.includes("muffin") || n.includes("masa para empanada") || n.includes("masa de empanada") || n.includes("masa empanada") || n.includes("frijoles") || n.includes("frijol negro") || n.includes("frijol rojo") || n.includes("frejol") || n.includes("habichuela") || n.includes("lata de ") || n.includes("enlatado") || n.includes("ají ") || n === "ají" || n.startsWith("aji ") || n === "aji" || n.includes("chile en polvo") || n.includes("chile seco") || n.includes("chile_polvo") || n.includes("hojuelas de chile") || n.includes("jalape")) return "🏪 Despensa";
      if (n.includes("quesillo") || n.includes("queso gruy") || n.includes("gruyère") || n.includes("mozzarella") || n.includes("mozarella") || n.includes("cottage") || n.includes("queso cottage") || n.includes("queso blanco untable") || n.includes("ricota") || n.includes("ricotta") || n.includes("queso ricotta")) return "🥛 Lácteos";
      // ── Líquidos y Bebidas (leches vegetales, caldos, jugos, agua, infusiones, alcohol) ──
      if (n === "agua" || n.startsWith("agua ") || n.includes("bebida de ") || n.includes("bebida vegetal") || (n.includes("leche") && (n.includes("coco") || n.includes("almendra") || n.includes("avena") || n.includes("soja") || n.includes("soya") || n.includes("arroz"))) || n.includes("caldo") || n.includes("agua mineral") || n.includes("agua con gas") || n.includes("jugo") || n.includes("zumo") || n.includes("gaseosa") || n.includes("refresco") || n.includes("bebida") || n.includes("té ") || n === "té" || n.startsWith("te ") || n.includes("infusión") || n.includes("infusion") || n.includes("café") || n.includes("cafe") || n.includes("mate") || n.includes("vino") || n.includes("cerveza") || n.includes("pisco") || n.includes("ron") || n.includes("whisky") || n.includes("vodka")) return "🥤 Líquidos y Bebidas";
      // ── Frutas y Verduras (antes de Proteínas para evitar "repollo" → "pollo") ──
      if (n.includes("lechuga") || n.includes("tomate") || n.includes("cebolla") || n.includes("cebollín") || n.includes("cebollin") || n.includes("pimentón") || n.includes("pimenton") || n.includes("pimiento") || n.includes("zapallo") || n.includes("zanahoria") || n.includes("papa") || n.includes("camote") || n.includes("pepino") || n.includes("espinaca") || n.includes("apio") || n.includes("espárrago") || n.includes("esparrago") || n.includes("champiñón") || n.includes("champiñon") || n.includes("plátano") || n.includes("platano") || n.includes("mango") || n.includes("frutilla") || n.includes("arándano") || n.includes("arandano") || n.includes("manzana") || n.includes("palta") || n.includes("aguacate") || n.includes("limón") || n.includes("limon") || n.includes("chile") || n.includes("cilantro") || n.includes("perejil") || n.includes("romero") || n.includes("tomillo") || n.includes("eneldo") || n.includes("albahaca") || n.includes("menta") || n.includes("cherry") || n.includes("choclo") || n.includes("brócoli") || n.includes("brocoli") || n.includes("coliflor") || n.includes("repollo") || n.includes("arveja") || n.includes("aceituna") || n.includes("piña") || n.includes("pina") || n.includes("naranja") || n.includes("uva") || n.includes("kale") || n.includes("puerro") || n.includes("berenjena") || n.includes("calabacín") || n.includes("calabacin") || n.includes("durazno") || n.includes("higo") || n.includes("jengibre") || n.includes("kiwi") || n.includes("pera") || n.includes("sandía") || n.includes("sandia") || n.includes("melón") || n.includes("melon") || n.includes("frutilla") || n.includes("fresa") || n.includes("bok choy") || n.includes("pak choi") || n.includes("açaí") || n.includes("acai") || n.includes("shiitake") || n.includes("portobello") || n.includes("ostra") && n.includes("hongo") || (n.includes("ajo") && !n.includes("polvo") && !n.includes("ajo_polvo"))) return "🥬 Frutas y Verduras";
      // ── Proteínas (incluye chorizo, salchichas, tocino, sardinas) ──
      if (n.includes("pollo") || n.includes("carne") || n.includes("salmón") || n.includes("salmon") || n.includes("atún") || n.includes("atun") || n.includes("huevo") || n.includes("proteína") || n.includes("pavo") || n.includes("cerdo") || n.includes("pescado") || n.includes("merluza") || n.includes("camar") || n.includes("tofu") || n.includes("jamón") || n.includes("jamon") || n.includes("chorizo") || n.includes("salchicha") || n.includes("tocino") || n.includes("panceta") || n.includes("sardina") || n.includes("caballa") || n.includes("trucha") || n.includes("anchoa")) return "🥩 Proteínas";
      // ── Lácteos (solo vaca: leche, yogur, queso, crema, mantequilla) ──
      if (n.includes("leche") || n.includes("yogur") || n.includes("queso") || n.includes("crema") || (n.includes("mantequilla") && !n.includes("maní") && !n.includes("almendra"))) return "🥛 Lácteos";
      // ── Frutos Secos y Semillas ──
      if (n.includes("almendra") || n.includes("nuez") || n.includes("nueces") || n.includes("maní") || n.includes("mani") || n.includes("semilla") || n.includes("chía") || n.includes("chia") || n.includes("pasa") || n.includes("deshidratado") || n.includes("piñón") || n.includes("piñones") || n.includes("pinon") || n.includes("pinones")) return "🥜 Frutos Secos y Semillas";
      // ── Despensa (granos, cereales, legumbres, aceites, miel, condimentos, salsas, especias, pan, masas, fideos, hummus) ──
      if (n.includes("arroz") || n.includes("avena") || n.includes("quinoa") || n.includes("lenteja") || n.includes("poroto") || n.includes("garbanzo") || n.includes("granola") || n.includes("maíz") || n.includes("maiz") || n.includes("edamame") || n.includes("aceite") || (n === "sal" || n.startsWith("sal ")) || n.includes("pimienta") || n.includes("comino") || n.includes("orégano") || n.includes("oregano") || n.includes("ajo en polvo") || n.includes("ajo_polvo") || n.includes("laurel") || n.includes("canela") || n.includes("curry") || n.includes("salsa") || n.includes("miel") || n.includes("vinagre") || n.includes("maple") || n.includes("tahini") || n.includes("sésamo") || n.includes("sesamo") || n.includes("cacao") || n.includes("polvo para") || n.includes("hojuela") || n.includes("chocolate") || n.includes("azúcar") || n.includes("azucar") || n.includes("mostaza") || n.includes("ketchup") || n.includes("mayonesa") || (n.includes("coco") && !n.includes("leche")) || n.includes("pan ") || n.includes("pan pita") || n.includes("pan integral") || n.includes("pan rallado") || n.includes("tortilla") || n.includes("harina") || n.includes("fideo") || n.includes("pasta") || n.includes("espagueti") || n.includes("macarron") || n.includes("lasaña") || n.includes("hummus")) return "🏪 Despensa";
      return "📦 Otros";
    };
    ingredientesFaltantes.forEach(ing => { cats[clasificar(ing.nombre)].push(ing); });
    return Object.entries(cats).filter(([_, items]) => items.length > 0);
  }, [ingredientesFaltantes]);

  const generarTextoLista = () => {
    let texto = "LISTA DE COMPRAS - Calibrate\n";
    texto += "═══════════════════════════\n";
    if (soloRestantes && diasRestantes.length > 0) {
      texto += `📅 Solo para: ${diasRestantes.join(', ')}\n`;
    }
    texto += "\n";
    if (agrupado) {
      categorias.forEach(([cat, items]) => {
        texto += `${cat}\n───────────────────\n`;
        items.forEach(ing => {
          texto += `☐ ${ing.nombre} — ${formatearCompra(ing)}\n`;
        });
        texto += "\n";
      });
    } else {
      ingredientesFaltantes.forEach(ing => {
        texto += `☐ ${ing.nombre} — ${formatearCompra(ing)}\n`;
      });
    }
    const esenciales = esencialesActivos();
    if (esenciales.length > 0) {
      texto += `🏠 Esenciales recurrentes\n───────────────────\n`;
      esenciales.forEach(e => { texto += `☐ ${e.nombre}\n`; });
      texto += "\n";
    }
    texto += `\nTotal: ${ingredientesFaltantes.length} items del plan + ${esenciales.length} esenciales`;
    return texto;
  };

  const copiarAlPortapapeles = async () => {
    try {
      await navigator.clipboard.writeText(generarTextoLista());
      setCopiado(true); setTimeout(() => setCopiado(false), 2500);
    } catch (err) {
      const ta = document.createElement('textarea');
      ta.value = generarTextoLista();
      document.body.appendChild(ta); ta.select(); document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiado(true); setTimeout(() => setCopiado(false), 2500);
    }
  };

  if (ingredientesFaltantes.length === 0) {
    return (
      <div className="animate-fadeIn">
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <i className="fas fa-check-circle text-green-500 text-4xl"></i>
          </div>
          <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>¡Tienes todo!</h3>
          <p className="text-gray-500 mb-6">Tu despensa está completa para la semana.</p>
        </div>
        <EsencialesRecurrentes darkMode={darkMode} />
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className={`rounded-2xl shadow-sm border p-5 mb-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className={`font-semibold text-lg flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            <i className="fas fa-shopping-cart text-amber-500"></i>Lista de Compras
          </h3>
          <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">{ingredientesFaltantes.length} items</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setAgrupado(true)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${agrupado ? 'bg-green-500 text-white' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
            <i className="fas fa-layer-group mr-1"></i>Agrupado
          </button>
          <button onClick={() => setAgrupado(false)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${!agrupado ? 'bg-green-500 text-white' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
            <i className="fas fa-list mr-1"></i>Lista simple
          </button>
        </div>
        {diasRestantes.length > 0 && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100" style={{borderColor: darkMode ? '#374151' : undefined}}>
            <div className="flex items-center gap-2">
              <i className={`fas fa-calendar-alt text-sm ${soloRestantes ? 'text-blue-500' : 'text-gray-400'}`}></i>
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Solo desde mañana
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${soloRestantes ? 'bg-blue-100 text-blue-600' : darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                {soloRestantes ? `${diasRestantes.length} días` : `${diasRestantes.length + 1} días`}
              </span>
            </div>
            <button onClick={() => setSoloRestantes(!soloRestantes)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                soloRestantes ? 'bg-blue-500' : darkMode ? 'bg-gray-600' : 'bg-gray-300'
              }`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-sm ${
                soloRestantes ? 'translate-x-6' : 'translate-x-1'
              }`}></span>
            </button>
          </div>
        )}
        {soloRestantes && diasRestantes.length > 0 && (
          <div className={`mt-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <i className="fas fa-info-circle mr-1"></i>
            Hoy es {diaActual}. Comprando para: {diasRestantes.join(', ')}
          </div>
        )}
      </div>

      {Object.values(comprados).some(v => v) && (
        <div className={`flex items-center justify-between rounded-xl p-3 mb-3 ${darkMode ? 'bg-green-900/30 border border-green-800' : 'bg-green-50 border border-green-100'}`}>
          <span className="text-sm text-green-600 font-medium">
            <i className="fas fa-check-circle mr-1"></i>
            {Object.values(comprados).filter(v => v).length} marcado(s) como comprado
          </span>
          <button onClick={limpiarComprados} className="text-xs text-green-600 hover:text-green-700 font-medium">Limpiar</button>
        </div>
      )}

      <div className={`rounded-2xl shadow-sm border overflow-hidden mb-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        {agrupado ? (
          <div className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
            {/* ST1: FA icons en lugar de emojis para cabeceras de categoría */}
            {/* L3: sticky top-[52px] descuenta la altura del header fijo de la app */}
            {categorias.map(([cat, items]) => {
              const catIconMap = {
                '🥩': 'fa-drumstick-bite', '🥬': 'fa-leaf', '🥛': 'fa-cow',
                '🥤': 'fa-glass-water', '🥜': 'fa-seedling', '🏪': 'fa-store', '📦': 'fa-box'
              };
              const emoji = cat.split(' ')[0];
              const faIcon = catIconMap[emoji] || 'fa-tag';
              const catLabel = cat.replace(/^[^\s]+\s/, '');
              return (
              <div key={cat}>
                <div className={`px-4 py-3 font-semibold text-sm sticky top-[52px] flex items-center gap-2 ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-50 text-gray-700'}`}>
                  <i className={`fas ${faIcon} text-xs opacity-70`}></i>{catLabel}
                </div>
                <div className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-50'}`}>
                  {items.map(ing => (
                    <div key={ing.id} className={`flex items-center justify-between px-4 py-3 transition-all ${
                      comprados[ing.id] ? (darkMode ? 'bg-green-900/20 opacity-60' : 'bg-green-50/50 opacity-60') : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50')
                    }`}>
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {/* T2: mínimo 32×32px touch target (era 20×20px) */}
                        <button onClick={(e) => toggleComprado(e, ing.id)}
                          aria-label={`${comprados[ing.id] ? 'Desmarcar' : 'Marcar como comprado'}: ${ing.nombre}`}
                          className={`w-8 h-8 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${
                            comprados[ing.id] ? 'bg-green-500 border-green-500' : darkMode ? 'border-gray-500 hover:border-green-400' : 'border-gray-300 hover:border-green-400'
                          }`}>
                          {comprados[ing.id] && <i className="fas fa-check text-white text-xs"></i>}
                        </button>
                        <span className={`text-sm break-words leading-snug ${comprados[ing.id] ? 'line-through text-gray-400' : darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{ing.nombre}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-lg whitespace-nowrap ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-900'}`}>
                          {formatearCompraCorto(ing)}
                        </span>
                        <button onClick={(e) => marcarEnDespensa(e, ing.id)} title="Ya lo tengo"
                          className={`text-xs p-1.5 rounded-lg transition-colors ${darkMode ? 'text-green-400 hover:bg-green-900/40' : 'text-green-600 hover:bg-green-50'}`}>
                          <i className="fas fa-warehouse"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              );
            })}
          </div>
        ) : (
          <div className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-50'}`}>
            {ingredientesFaltantes.map(ing => (
              <div key={ing.id} className={`flex items-center justify-between px-4 py-3 transition-all ${
                comprados[ing.id] ? (darkMode ? 'bg-green-900/20 opacity-60' : 'bg-green-50/50 opacity-60') : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50')
              }`}>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {/* T2: mínimo 32×32px también en vista sin agrupar */}
                  <button onClick={(e) => toggleComprado(e, ing.id)}
                    aria-label={`${comprados[ing.id] ? 'Desmarcar' : 'Marcar como comprado'}: ${ing.nombre}`}
                    className={`w-8 h-8 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${
                      comprados[ing.id] ? 'bg-green-500 border-green-500' : darkMode ? 'border-gray-500 hover:border-green-400' : 'border-gray-300 hover:border-green-400'
                    }`}>
                    {comprados[ing.id] && <i className="fas fa-check text-white text-xs"></i>}
                  </button>
                  <span className={`text-sm break-words leading-snug ${comprados[ing.id] ? 'line-through text-gray-400' : darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{ing.nombre}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-lg whitespace-nowrap ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-900'}`}>
                    {formatearCompraCorto(ing)}
                  </span>
                  <button onClick={(e) => marcarEnDespensa(e, ing.id)} title="Ya lo tengo"
                    className={`text-xs p-1.5 rounded-lg transition-colors ${darkMode ? 'text-green-400 hover:bg-green-900/40' : 'text-green-600 hover:bg-green-50'}`}>
                    <i className="fas fa-warehouse"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <EsencialesRecurrentes darkMode={darkMode} />

      <button onClick={copiarAlPortapapeles}
        className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all active:scale-[0.98] ${
          copiado ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-200 hover:shadow-xl'
        }`}>
        {copiado
          ? <span><i className="fas fa-check mr-2"></i>¡Copiado al Portapapeles!</span>
          : <span><i className="fas fa-copy mr-2"></i>Copiar Lista al Portapapeles</span>}
      </button>

      {/* Exports adicionales */}
      {typeof window.exports !== 'undefined' && ingredientesFaltantes.length > 0 && (
        <div className="mt-3">
          <div className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <i className="fas fa-download mr-1"></i>Exportar lista
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => {
                const result = window.exports.listaCSV(ingredientesFaltantes.map(ing => ({
                  nombre: ing.nombre,
                  cantidad: ing.cantidad,
                  unidad: ing.unidad,
                  precio_clp: ing.precio_clp,
                  descripcion_compra: ing.descripcion_compra,
                  categoria: ing.categoria_supermercado
                })));
                console.log('[Export CSV]', result);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-all active:scale-[0.98] ${
                darkMode ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}>
              <i className="fas fa-file-csv text-emerald-500"></i>Descargar CSV
            </button>
            <button onClick={async () => {
                let texto = window.exports.textoSupermercado(ingredientesFaltantes);
                const ess = esencialesActivos();
                if (ess.length > 0) texto += "\n" + ess.map(e => e.nombre).join("\n");
                try {
                  await navigator.clipboard.writeText(texto);
                  if (window._NP_toast) window._NP_toast('Lista copiada — pegala en el buscador de Jumbo/Líder');
                  else alert('✓ Lista copiada. Pégala en el buscador de Jumbo/Líder (uno por línea).');
                } catch {
                  const ta = document.createElement('textarea');
                  ta.value = texto;
                  document.body.appendChild(ta); ta.select(); document.execCommand('copy');
                  document.body.removeChild(ta);
                  alert('✓ Lista copiada');
                }
              }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-all active:scale-[0.98] ${
                darkMode ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}>
              <i className="fas fa-cart-shopping text-blue-500"></i>Formato Jumbo/Líder
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


// FatLossTab eliminado — reemplazado por FitnessTab (N12)

// =============================================
// COMPONENTE: BarcodeScannerModal
// Escanea código de barras → busca en Open Food Facts primero,
// luego en UPCitemdb como fallback (identificación + macros manuales)
// =============================================
function BarcodeScannerModal({ darkMode, onAdd, onClose }) {
  var videoRef = React.useRef(null);
  var streamRef = React.useRef(null);
  var scanningRef = React.useRef(true);
  var detectorRef = React.useRef(null);

  // 'scanning'|'fetching'|'found'|'identificado'|'not_found'|'manual'
  var [fase, setFase] = React.useState('scanning');
  var [fetchMsg, setFetchMsg] = React.useState('Buscando producto…');
  var [producto, setProducto] = React.useState(null);
  var [gramos, setGramos] = React.useState(100);
  // Macros manuales para fase 'identificado' (UPCitemdb encontró nombre pero sin nutrición)
  var [macrosManual, setMacrosManual] = React.useState({ kcal: '', prot: '', carb: '', fat: '' });
  var [errorMsg, setErrorMsg] = React.useState('');
  var [manualCode, setManualCode] = React.useState('');
  var [soportado] = React.useState(typeof window.BarcodeDetector !== 'undefined');

  function detenerCamara() {
    scanningRef.current = false;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(function(t) { t.stop(); });
      streamRef.current = null;
    }
  }

  function escanearLoop() {
    if (!scanningRef.current || !videoRef.current) return;
    if (!detectorRef.current) {
      try { detectorRef.current = new window.BarcodeDetector({ formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e'] }); }
      catch(e) { setFase('manual'); return; }
    }
    detectorRef.current.detect(videoRef.current).then(function(codes) {
      if (!scanningRef.current) return;
      if (codes && codes.length > 0) {
        var code = codes[0].rawValue;
        detenerCamara();
        buscarProducto(code);
      } else {
        if (scanningRef.current) requestAnimationFrame(escanearLoop);
      }
    }).catch(function() {
      if (scanningRef.current) requestAnimationFrame(escanearLoop);
    });
  }

  function iniciarCamara() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setFase('manual'); return;
    }
    navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
    }).then(function(stream) {
      streamRef.current = stream;
      if (!videoRef.current) return;
      videoRef.current.srcObject = stream;
      videoRef.current.play().then(function() {
        scanningRef.current = true;
        escanearLoop();
      }).catch(function() { setFase('manual'); });
    }).catch(function() { setFase('manual'); });
  }

  React.useEffect(function() {
    if (!soportado) { setFase('manual'); return; }
    iniciarCamara();
    return function() { detenerCamara(); };
  }, []);

  function buscarProducto(codigo) {
    setFase('fetching');
    setFetchMsg('Consultando Open Food Facts…');

    // ── Fuente 1: Open Food Facts ─────────────────────────────────────────────
    fetch('https://world.openfoodfacts.org/api/v0/product/' + codigo + '.json')
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data.status === 1 && data.product) {
          var p = data.product;
          var nut = p.nutriments || {};
          var kcal100 = Math.round(nut['energy-kcal_100g'] || (nut['energy_100g'] ? nut['energy_100g'] / 4.184 : 0));
          var prot100 = parseFloat((nut['proteins_100g'] || 0).toFixed(1));
          var carb100 = parseFloat((nut['carbohydrates_100g'] || 0).toFixed(1));
          var fat100  = parseFloat((nut['fat_100g'] || 0).toFixed(1));
          var ps = parseInt(p.serving_size);
          var porcion = (!isNaN(ps) && ps > 0 && ps <= 1000) ? ps : 100;
          setProducto({
            nombre: p.product_name_es || p.product_name || 'Producto escaneado',
            marca: p.brands || '',
            imagen: p.image_front_small_url || null,
            barcode: codigo,
            fuente: 'off',
            kcal100: kcal100, prot100: prot100, carb100: carb100, fat100: fat100
          });
          setGramos(porcion);
          setFase('found');
          return;
        }

        // ── Fuente 2: UPCitemdb (fallback — identifica producto, sin nutrición) ──
        setFetchMsg('No encontrado en OFF · Consultando UPCitemdb…');
        fetch('https://api.upcitemdb.com/prod/trial/lookup?upc=' + codigo)
          .then(function(res) { return res.json(); })
          .then(function(upc) {
            if (upc.code === 'OK' && upc.items && upc.items.length > 0) {
              var item = upc.items[0];
              setProducto({
                nombre: item.title || 'Producto escaneado',
                marca: item.brand || '',
                imagen: (item.images && item.images.length > 0) ? item.images[0] : null,
                barcode: codigo,
                fuente: 'upcitemdb'
              });
              setMacrosManual({ kcal: '', prot: '', carb: '', fat: '' });
              setGramos(100);
              setFase('identificado');
            } else {
              setErrorMsg('Código ' + codigo + ' no encontrado en ninguna base de datos');
              setFase('not_found');
            }
          })
          .catch(function() {
            // UPCitemdb falló (sin red o rate limit) — mostrar not_found igualmente
            setErrorMsg('Código ' + codigo + ' no encontrado en Open Food Facts');
            setFase('not_found');
          });
      })
      .catch(function() {
        setErrorMsg('Error de red al consultar el código');
        setFase('not_found');
      });
  }

  function confirmarAgregar() {
    if (!producto) return;
    var g = Math.max(1, parseInt(gramos) || 100);
    onAdd({
      id: 'scan_' + Date.now(),
      nombre: producto.nombre + (g !== 100 ? ' (' + g + 'g)' : ''),
      kcal: Math.round(producto.kcal100 * g / 100),
      proteinas_g: parseFloat((producto.prot100 * g / 100).toFixed(1)),
      carbohidratos_g: parseFloat((producto.carb100 * g / 100).toFixed(1)),
      grasas_g: parseFloat((producto.fat100 * g / 100).toFixed(1)),
      timestamp: Date.now()
    });
    onClose();
  }

  // Para fase 'identificado': agregar usando macros que el usuario leyó del rótulo
  function confirmarAgregarManual() {
    if (!producto) return;
    var g = Math.max(1, parseInt(gramos) || 100);
    var kcal100 = parseFloat(macrosManual.kcal) || 0;
    var prot100 = parseFloat(macrosManual.prot) || 0;
    var carb100 = parseFloat(macrosManual.carb) || 0;
    var fat100  = parseFloat(macrosManual.fat)  || 0;
    onAdd({
      id: 'scan_' + Date.now(),
      nombre: producto.nombre + (g !== 100 ? ' (' + g + 'g)' : ''),
      kcal: Math.round(kcal100 * g / 100),
      proteinas_g: parseFloat((prot100 * g / 100).toFixed(1)),
      carbohidratos_g: parseFloat((carb100 * g / 100).toFixed(1)),
      grasas_g: parseFloat((fat100 * g / 100).toFixed(1)),
      timestamp: Date.now()
    });
    onClose();
  }

  function reiniciarEscaner() {
    setProducto(null);
    setErrorMsg('');
    setManualCode('');
    setMacrosManual({ kcal: '', prot: '', carb: '', fat: '' });
    setFetchMsg('Buscando producto…');
    scanningRef.current = true;
    setFase('scanning');
    iniciarCamara();
  }

  var g = Math.max(1, parseInt(gramos) || 100);
  var kcalFinal = producto ? Math.round(producto.kcal100 * g / 100) : 0;
  var protFinal = producto ? parseFloat((producto.prot100 * g / 100).toFixed(1)) : 0;
  var carbFinal = producto ? parseFloat((producto.carb100 * g / 100).toFixed(1)) : 0;
  var fatFinal  = producto ? parseFloat((producto.fat100 * g / 100).toFixed(1)) : 0;

  var cardBase = darkMode ? 'bg-gray-900 border-t border-gray-700' : 'bg-white';
  var inputStyle = { background: darkMode ? '#1f2937' : '#fff', color: darkMode ? '#f9fafb' : '#111827', border: '1px solid ' + (darkMode ? '#4b5563' : '#e5e7eb') };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={function(e) { if (e.target === e.currentTarget) { detenerCamara(); onClose(); } }}>
      <div className={'w-full max-w-md rounded-t-2xl shadow-2xl ' + cardBase}
        style={{ maxHeight: '92vh', display: 'flex', flexDirection: 'column', paddingBottom: 'env(safe-area-inset-bottom,16px)' }}>

        {/* Header */}
        <div className={'flex-shrink-0 flex items-center justify-between px-5 py-4 border-b ' + (darkMode ? 'border-gray-700' : 'border-gray-100')}>
          <h3 className={'text-base font-bold ' + (darkMode ? 'text-white' : 'text-gray-900')}>
            <i className="fas fa-barcode text-amber-500 mr-2"></i>Escanear producto
          </h3>
          <button onClick={function() { detenerCamara(); onClose(); }} aria-label="Cerrar"
            className={'w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors ' + (darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-400 hover:bg-gray-100')}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1 }} className="px-5 py-4 space-y-4">

          {/* ── FASE: scanning ── */}
          {fase === 'scanning' && (
            <div className="space-y-3">
              <p className={'text-xs text-center ' + (darkMode ? 'text-gray-400' : 'text-gray-500')}>
                Apunta la cámara al código de barras del producto
              </p>
              <div className="relative rounded-2xl overflow-hidden bg-black" style={{ aspectRatio: '4/3' }}>
                <video ref={videoRef} muted playsInline autoPlay
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {/* Viewfinder overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative" style={{ width: '65%', height: '38%' }}>
                    <div className="absolute top-0 left-0 w-7 h-7 border-t-[3px] border-l-[3px] border-amber-400 rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-7 h-7 border-t-[3px] border-r-[3px] border-amber-400 rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-7 h-7 border-b-[3px] border-l-[3px] border-amber-400 rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-7 h-7 border-b-[3px] border-r-[3px] border-amber-400 rounded-br-lg" />
                    <div className="absolute inset-x-2 top-1/2 h-px bg-amber-400/80" style={{ boxShadow: '0 0 6px 2px rgba(200,148,58,0.5)' }} />
                  </div>
                </div>
                <div className="absolute bottom-3 inset-x-0 text-center">
                  <span className="text-white text-xs bg-black/50 px-3 py-1 rounded-full">
                    <i className="fas fa-circle text-red-400 text-[8px] mr-1.5" style={{ animation: 'pulse-soft 1.2s infinite' }}></i>Escaneando…
                  </span>
                </div>
              </div>
              <button onClick={function() { detenerCamara(); setFase('manual'); }}
                className={'w-full text-xs py-2 text-center cursor-pointer transition-colors ' + (darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600')}>
                <i className="fas fa-keyboard mr-1.5"></i>Ingresar código manualmente
              </button>
            </div>
          )}

          {/* ── FASE: fetching ── */}
          {fase === 'fetching' && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-amber-100 border-t-amber-500" style={{ animation: 'spin 0.8s linear infinite' }} />
              <p className={'text-sm text-center ' + (darkMode ? 'text-gray-300' : 'text-gray-600')}>{fetchMsg}</p>
            </div>
          )}

          {/* ── FASE: not_found ── */}
          {fase === 'not_found' && (
            <div className="space-y-4">
              <div className={'rounded-xl p-4 text-center ' + (darkMode ? 'bg-red-900/30 border border-red-800' : 'bg-red-50 border border-red-200')}>
                <i className="fas fa-triangle-exclamation text-red-500 text-2xl mb-2 block"></i>
                <p className={'text-sm font-semibold ' + (darkMode ? 'text-red-300' : 'text-red-700')}>{errorMsg}</p>
                <p className={'text-xs mt-1 ' + (darkMode ? 'text-gray-400' : 'text-gray-500')}>
                  El producto puede no estar en Open Food Facts aún
                </p>
              </div>
              <div className="flex gap-2">
                {soportado && (
                  <button onClick={reiniciarEscaner}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-amber-500 text-white hover:bg-amber-600 transition-colors cursor-pointer">
                    <i className="fas fa-redo mr-2"></i>Reintentar
                  </button>
                )}
                <button onClick={function() { setFase('manual'); }}
                  className={'flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors cursor-pointer ' + (darkMode ? 'border-gray-600 text-gray-200 hover:bg-gray-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50')}>
                  <i className="fas fa-keyboard mr-2"></i>Ingresar manual
                </button>
              </div>
            </div>
          )}

          {/* ── FASE: manual ── */}
          {fase === 'manual' && (
            <div className="space-y-4">
              {!soportado && (
                <div className={'rounded-xl p-3 text-xs ' + (darkMode ? 'bg-blue-900/30 border border-blue-800 text-blue-300' : 'bg-blue-50 border border-blue-200 text-blue-700')}>
                  <i className="fas fa-info-circle mr-1.5"></i>
                  Tu navegador no soporta el escáner de cámara. Ingresa el número del código de barras.
                </div>
              )}
              <div>
                <label className={'block text-xs font-semibold mb-2 ' + (darkMode ? 'text-gray-300' : 'text-gray-600')}>
                  Número del código de barras
                </label>
                <div className="flex gap-2">
                  <input type="tel" inputMode="numeric" value={manualCode}
                    onChange={function(e) { setManualCode(e.target.value.replace(/\D/g,'').slice(0,14)); }}
                    onKeyDown={function(e) { if (e.key === 'Enter' && manualCode.length >= 8) buscarProducto(manualCode); }}
                    placeholder="ej: 7802800081234"
                    style={Object.assign({}, inputStyle, { flex: 1, padding: '10px 12px', borderRadius: 12, fontSize: 14, outline: 'none' })} />
                  <button onClick={function() { if (manualCode.length >= 8) buscarProducto(manualCode); }}
                    disabled={manualCode.length < 8}
                    className="px-4 rounded-xl bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </div>
              {soportado && (
                <button onClick={reiniciarEscaner}
                  className={'w-full text-xs py-2 text-center cursor-pointer transition-colors ' + (darkMode ? 'text-amber-400 hover:text-amber-300' : 'text-amber-600 hover:text-amber-700')}>
                  <i className="fas fa-camera mr-1.5"></i>Volver a la cámara
                </button>
              )}
            </div>
          )}

          {/* ── FASE: identificado — UPCitemdb encontró el producto pero sin nutrición ── */}
          {fase === 'identificado' && producto && (
            <div className="space-y-4 animate-fadeIn">
              {/* Product card */}
              <div className={'rounded-2xl p-4 ' + (darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200')}>
                <div className="flex items-start gap-3">
                  {producto.imagen && (
                    <img src={producto.imagen} alt={producto.nombre}
                      className="w-14 h-14 rounded-xl object-contain bg-white border border-gray-200 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <h4 className={'font-bold text-sm leading-tight ' + (darkMode ? 'text-white' : 'text-gray-900')}>{producto.nombre}</h4>
                      <span className={'text-[10px] px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0 ' + (darkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-700')}>
                        UPCitemdb
                      </span>
                    </div>
                    {producto.marca && <p className={'text-xs ' + (darkMode ? 'text-gray-400' : 'text-gray-500')}>{producto.marca}</p>}
                  </div>
                </div>
              </div>

              {/* Aviso */}
              <div className={'rounded-xl p-3 text-xs flex gap-2 ' + (darkMode ? 'bg-amber-900/20 border border-amber-800/40 text-amber-300' : 'bg-amber-50 border border-amber-200 text-amber-800')}>
                <i className="fas fa-circle-info flex-shrink-0 mt-0.5"></i>
                <span>Producto identificado pero sin datos nutricionales en línea. Ingresa los macros que aparecen en el rótulo del envase (valores <strong>por 100 g</strong>).</span>
              </div>

              {/* Inputs macros por 100g */}
              <div className={'rounded-xl p-4 space-y-3 ' + (darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200')}>
                <p className={'text-xs font-semibold uppercase tracking-wide ' + (darkMode ? 'text-gray-400' : 'text-gray-500')}>Por 100 g</p>
                {[
                  { key: 'kcal', label: 'Calorías', unit: 'kcal', color: 'text-orange-500' },
                  { key: 'prot', label: 'Proteínas', unit: 'g', color: 'text-blue-400' },
                  { key: 'carb', label: 'Carbohidratos', unit: 'g', color: 'text-amber-400' },
                  { key: 'fat',  label: 'Grasas',        unit: 'g', color: 'text-rose-400' }
                ].map(function(m) {
                  return (
                    <div key={m.key} className="flex items-center gap-3">
                      <label className={'text-xs font-medium w-28 flex-shrink-0 ' + m.color}>{m.label}</label>
                      <div className="relative flex-1">
                        <input type="number" inputMode="decimal" min="0"
                          value={macrosManual[m.key]}
                          onChange={function(e) {
                            var val = e.target.value;
                            setMacrosManual(function(prev) {
                              var next = {}; Object.keys(prev).forEach(function(k) { next[k] = prev[k]; });
                              next[m.key] = val; return next;
                            });
                          }}
                          placeholder="0"
                          style={{ background: darkMode ? '#1f2937' : '#fff', color: darkMode ? '#f9fafb' : '#111827',
                            border: '1px solid ' + (darkMode ? '#4b5563' : '#e5e7eb'),
                            width: '100%', padding: '7px 32px 7px 10px', borderRadius: 10, fontSize: 14, outline: 'none' }} />
                        <span className={'absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] ' + (darkMode ? 'text-gray-500' : 'text-gray-400')}>{m.unit}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Gram picker (igual que 'found') */}
              <div>
                <label className={'block text-xs font-semibold mb-2 ' + (darkMode ? 'text-gray-300' : 'text-gray-600')}>
                  ¿Cuántos gramos consumiste?
                </label>
                <div className="flex items-center gap-2">
                  <button onClick={function() { setGramos(function(p) { return Math.max(5, parseInt(p)-10); }); }}
                    className={'w-10 h-10 rounded-xl font-bold text-lg flex items-center justify-center cursor-pointer transition-colors flex-shrink-0 ' + (darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')}>−</button>
                  <div className="relative flex-1">
                    <input type="number" value={gramos}
                      onChange={function(e) { var v = parseInt(e.target.value) || 1; setGramos(Math.max(1, Math.min(2000, v))); }}
                      style={{ background: darkMode ? '#1f2937' : '#fff', color: darkMode ? '#f9fafb' : '#111827',
                        border: '1px solid ' + (darkMode ? '#4b5563' : '#e5e7eb'),
                        width: '100%', padding: '8px 36px 8px 12px', borderRadius: 12, fontSize: 16, fontWeight: 700, textAlign: 'center', outline: 'none' }} />
                    <span className={'absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium ' + (darkMode ? 'text-gray-400' : 'text-gray-500')}>g</span>
                  </div>
                  <button onClick={function() { setGramos(function(p) { return Math.min(2000, parseInt(p)+10); }); }}
                    className={'w-10 h-10 rounded-xl font-bold text-lg flex items-center justify-center cursor-pointer transition-colors flex-shrink-0 ' + (darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')}>+</button>
                </div>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {[50, 100, 150, 200, 300].map(function(gv) {
                    var isActive = parseInt(gramos) === gv;
                    return (
                      <button key={gv} onClick={function() { setGramos(gv); }}
                        className={'text-xs px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ' + (isActive
                          ? 'bg-amber-500 border-amber-500 text-white'
                          : (darkMode ? 'border-gray-600 text-gray-300 hover:border-amber-600 hover:text-amber-300' : 'border-gray-200 text-gray-600 hover:border-amber-400 hover:text-amber-700'))}>
                        {gv}g
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button onClick={reiniciarEscaner}
                  className={'py-2.5 px-4 rounded-xl text-sm font-medium border transition-colors cursor-pointer flex-shrink-0 ' + (darkMode ? 'border-gray-600 text-gray-200 hover:bg-gray-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50')}>
                  <i className="fas fa-redo text-xs mr-1.5"></i>Otro
                </button>
                <button onClick={confirmarAgregarManual}
                  disabled={!macrosManual.kcal || parseFloat(macrosManual.kcal) <= 0}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition-all cursor-pointer shadow-md disabled:opacity-40 disabled:cursor-not-allowed">
                  <i className="fas fa-plus mr-2"></i>Agregar {gramos}g
                </button>
              </div>
            </div>
          )}

          {/* ── FASE: found ── */}
          {fase === 'found' && producto && (
            <div className="space-y-4 animate-fadeIn">
              {/* Product card */}
              <div className={'rounded-2xl p-4 ' + (darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200')}>
                <div className="flex items-start gap-3">
                  {producto.imagen && (
                    <img src={producto.imagen} alt={producto.nombre}
                      className="w-14 h-14 rounded-xl object-contain bg-white border border-gray-200 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <h4 className={'font-bold text-sm leading-tight ' + (darkMode ? 'text-white' : 'text-gray-900')}>{producto.nombre}</h4>
                      <span className={'text-[10px] px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0 ' + (darkMode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-700')}>
                        OFF
                      </span>
                    </div>
                    {producto.marca && <p className={'text-xs ' + (darkMode ? 'text-gray-400' : 'text-gray-500')}>{producto.marca}</p>}
                    <p className={'text-[10px] mt-1.5 font-medium ' + (darkMode ? 'text-gray-500' : 'text-gray-400')}>Por 100 g:</p>
                    <div className="flex flex-wrap gap-2 mt-0.5 text-[11px]">
                      <span className="text-orange-500 font-bold">{producto.kcal100} kcal</span>
                      <span className="text-blue-400">P {producto.prot100}g</span>
                      <span className="text-amber-400">C {producto.carb100}g</span>
                      <span className="text-rose-400">G {producto.fat100}g</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gram picker */}
              <div>
                <label className={'block text-xs font-semibold mb-2 ' + (darkMode ? 'text-gray-300' : 'text-gray-600')}>
                  ¿Cuántos gramos consumiste?
                </label>
                <div className="flex items-center gap-2">
                  <button onClick={function() { setGramos(function(prev) { return Math.max(5, parseInt(prev)-10); }); }}
                    className={'w-10 h-10 rounded-xl font-bold text-lg flex items-center justify-center cursor-pointer transition-colors flex-shrink-0 ' + (darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')}>−</button>
                  <div className="relative flex-1">
                    <input type="number" value={gramos}
                      onChange={function(e) { var v = parseInt(e.target.value) || 1; setGramos(Math.max(1, Math.min(2000, v))); }}
                      style={Object.assign({}, inputStyle, { width: '100%', padding: '8px 36px 8px 12px', borderRadius: 12, fontSize: 16, fontWeight: 700, textAlign: 'center', outline: 'none' })} />
                    <span className={'absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium ' + (darkMode ? 'text-gray-400' : 'text-gray-500')}>g</span>
                  </div>
                  <button onClick={function() { setGramos(function(prev) { return Math.min(2000, parseInt(prev)+10); }); }}
                    className={'w-10 h-10 rounded-xl font-bold text-lg flex items-center justify-center cursor-pointer transition-colors flex-shrink-0 ' + (darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')}>+</button>
                </div>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {[50, 100, 150, 200, 300].map(function(gv) {
                    var isActive = parseInt(gramos) === gv;
                    return (
                      <button key={gv} onClick={function() { setGramos(gv); }}
                        className={'text-xs px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ' + (isActive
                          ? 'bg-amber-500 border-amber-500 text-white'
                          : (darkMode ? 'border-gray-600 text-gray-300 hover:border-amber-600 hover:text-amber-300' : 'border-gray-200 text-gray-600 hover:border-amber-400 hover:text-amber-700'))}>
                        {gv}g
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Macro summary */}
              <div className={'rounded-xl p-3 text-center ' + (darkMode ? 'bg-amber-900/20 border border-amber-800/40' : 'bg-amber-50 border border-amber-200')}>
                <div>
                  <span className={'text-3xl font-black ' + (darkMode ? 'text-amber-300' : 'text-amber-700')}>{kcalFinal}</span>
                  <span className={'text-sm ml-1.5 ' + (darkMode ? 'text-amber-400' : 'text-amber-600')}>kcal</span>
                </div>
                <div className="flex justify-center gap-4 mt-1.5 text-xs">
                  <span className="text-blue-400 font-semibold">P {protFinal}g</span>
                  <span className="text-amber-400 font-semibold">C {carbFinal}g</span>
                  <span className="text-rose-400 font-semibold">G {fatFinal}g</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button onClick={reiniciarEscaner}
                  className={'py-2.5 px-4 rounded-xl text-sm font-medium border transition-colors cursor-pointer flex-shrink-0 ' + (darkMode ? 'border-gray-600 text-gray-200 hover:bg-gray-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50')}>
                  <i className="fas fa-redo text-xs mr-1.5"></i>Otro
                </button>
                <button onClick={confirmarAgregar}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition-all cursor-pointer shadow-md">
                  <i className="fas fa-plus mr-2"></i>Agregar {gramos}g
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// =============================================
// COMPONENTE: ModalComidaExterna (v20260428ai)
// Meal builder estilo MyFitnessPal:
//   - Tray de ingredientes con qty ajustable (½x, 1x, 2x…)
//   - Búsqueda en FOODS_DB + RECETAS_DB
//   - Puede reemplazar una comida planificada del día
// =============================================
function ModalComidaExterna({ darkMode, diaActual, comidasHoy, nombresComida, onAdd, onClose }) {
  const [busqueda, setBusqueda]           = React.useState('');
  const [sugerencias, setSugerencias]     = React.useState([]);
  const [ingredientes, setIngredientes]   = React.useState([]); // [{nombre,kcal,proteinas,carbohidratos,grasas,qty}]
  const [nombre, setNombre]               = React.useState('');
  const [nombreManual, setNombreManual]   = React.useState(false);
  const [reemplaza, setReemplaza]         = React.useState('');
  const [manualKcal, setManualKcal]       = React.useState('');
  const [manualProt, setManualProt]       = React.useState('');
  const [manualCarb, setManualCarb]       = React.useState('');
  const [manualGras, setManualGras]       = React.useState('');
  const [error, setError]                 = React.useState('');
  const [recurrentes, setRecurrentes]     = React.useState(function() {
    try { return JSON.parse(localStorage.getItem('nutriplan_comidas_frecuentes') || '[]'); }
    catch(e) { return []; }
  });

  // Colores inline para inputs — más robusto que clases Tailwind en dark mode
  var inputColor   = darkMode ? '#f9fafb' : '#111827';
  var inputBg      = darkMode ? '#1f2937' : '#ffffff';
  var inputBorder  = darkMode ? '#4b5563' : '#e5e7eb';
  var searchBg     = darkMode ? '#374151' : '#f9fafb';

  // ── Totales calculados de la bandeja ────────────────────────────────────────
  var totalesIngr = ingredientes.reduce(function(acc, ing) {
    var q = parseFloat(ing.qty) || 1;
    return {
      kcal:          acc.kcal          + Math.round((ing.kcal          || 0) * q),
      proteinas:     acc.proteinas     + Math.round((ing.proteinas     || 0) * q),
      carbohidratos: acc.carbohidratos + Math.round((ing.carbohidratos || 0) * q),
      grasas:        acc.grasas        + Math.round((ing.grasas        || 0) * q)
    };
  }, { kcal: 0, proteinas: 0, carbohidratos: 0, grasas: 0 });

  var tieneIngredientes = ingredientes.length > 0;
  var finalKcal = tieneIngredientes ? totalesIngr.kcal          : (parseFloat(manualKcal) || 0);
  var finalProt = tieneIngredientes ? totalesIngr.proteinas     : (parseFloat(manualProt) || 0);
  var finalCarb = tieneIngredientes ? totalesIngr.carbohidratos : (parseFloat(manualCarb) || 0);
  var finalGras = tieneIngredientes ? totalesIngr.grasas        : (parseFloat(manualGras) || 0);

  // ── Auto-nombre desde ingredientes ─────────────────────────────────────────
  React.useEffect(function() {
    if (nombreManual) return;
    if (ingredientes.length === 0) { setNombre(''); return; }
    var parts = ingredientes.map(function(ing) {
      var q = parseFloat(ing.qty) || 1;
      return (q !== 1 ? q + 'x ' : '') + ing.nombre;
    });
    setNombre(parts.join(' + '));
  }, [ingredientes, nombreManual]);

  // ── Búsqueda unificada FOODS_DB + RECETAS_DB ────────────────────────────────
  React.useEffect(function() {
    var q = busqueda.trim().toLowerCase();
    if (q.length < 2) { setSugerencias([]); return; }
    var res = [];
    var lang = window._NP_lang || 'es';
    if (typeof window.FOODS_DB !== 'undefined') {
      window.FOODS_DB.forEach(function(f) {
        var n = (lang === 'en' && f.nombre_en) ? f.nombre_en : f.nombre;
        if (n.toLowerCase().includes(q))
          res.push({ _tipo:'alimento', nombre:n, porcion:f.porcion, kcal:f.kcal, proteinas:f.proteinas, carbohidratos:f.carbohidratos, grasas:f.grasas });
      });
    }
    if (typeof RECETAS_DB !== 'undefined') {
      RECETAS_DB.forEach(function(r) {
        var n = (typeof getNombreReceta === 'function') ? getNombreReceta(r) : (r.nombre || '');
        if (n.toLowerCase().includes(q))
          res.push({ _tipo:'receta', nombre:n, porcion:null,
            kcal:r.calorias||r.calorias_base||0, proteinas:r.proteinas||r.proteinas_base||0,
            carbohidratos:r.carbohidratos||r.carbohidratos_base||0, grasas:r.grasas||r.grasas_base||0 });
      });
    }
    setSugerencias(res.slice(0, 8));
  }, [busqueda]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  function agregarItem(item) {
    setIngredientes(function(prev) {
      var idx = prev.findIndex(function(x) { return x.nombre === item.nombre; });
      if (idx >= 0) {
        return prev.map(function(x, i) {
          return i === idx ? Object.assign({}, x, { qty: (parseFloat(x.qty) || 1) + 1 }) : x;
        });
      }
      return prev.concat([Object.assign({}, item, { qty: 1 })]);
    });
    setBusqueda('');
    setSugerencias([]);
  }

  function cambiarQty(idx, delta) {
    setIngredientes(function(prev) {
      return prev.map(function(x, i) {
        if (i !== idx) return x;
        var next = Math.max(0.5, ((parseFloat(x.qty) || 1) + delta));
        next = Math.round(next * 2) / 2; // snap to 0.5
        return Object.assign({}, x, { qty: next });
      });
    });
  }

  function quitarIngrediente(idx) {
    setIngredientes(function(prev) { return prev.filter(function(_, i) { return i !== idx; }); });
  }

  function handleSubmit() {
    var nombreFinal = nombre.trim();
    if (!nombreFinal) { setError(t('El nombre es obligatorio','Name is required')); return; }
    if (finalKcal <= 0) { setError(t('Agrega alimentos o ingresa las calorías','Add foods or enter calories')); return; }
    setError('');
    // ── Guardar en comidas frecuentes ──────────────────────────────────────
    try {
      var nuevasFrec = recurrentes.slice();
      var idxFrec = nuevasFrec.findIndex(function(x) { return x.nombre === nombreFinal; });
      var hoyFrec = new Date().toISOString().split('T')[0];
      if (idxFrec >= 0) {
        nuevasFrec[idxFrec] = Object.assign({}, nuevasFrec[idxFrec], {
          veces: (nuevasFrec[idxFrec].veces || 1) + 1, ultimaVez: hoyFrec,
          kcal: Math.round(finalKcal), proteinas_g: Math.round(finalProt),
          carbohidratos_g: Math.round(finalCarb), grasas_g: Math.round(finalGras)
        });
      } else {
        nuevasFrec.push({ nombre: nombreFinal, kcal: Math.round(finalKcal),
          proteinas_g: Math.round(finalProt), carbohidratos_g: Math.round(finalCarb),
          grasas_g: Math.round(finalGras), veces: 1, ultimaVez: hoyFrec });
      }
      nuevasFrec.sort(function(a, b) {
        if (b.veces !== a.veces) return b.veces - a.veces;
        return (b.ultimaVez || '') > (a.ultimaVez || '') ? 1 : -1;
      });
      nuevasFrec = nuevasFrec.slice(0, 20);
      localStorage.setItem('nutriplan_comidas_frecuentes', JSON.stringify(nuevasFrec));
      setRecurrentes(nuevasFrec);
    } catch(e) {}
    onAdd({
      id: 'ext_' + Date.now(),
      nombre: nombreFinal,
      kcal: Math.round(finalKcal),
      proteinas_g: Math.round(finalProt),
      carbohidratos_g: Math.round(finalCarb),
      grasas_g: Math.round(finalGras),
      reemplaza: reemplaza || null,
      timestamp: Date.now()
    });
    onClose();
  }

  // Comidas del plan disponibles para reemplazar
  var tiposOrdenM = ['desayuno','snack_am','almuerzo','snack_pm','cena'];
  var comidasPlan = tiposOrdenM.filter(function(tipo) { return comidasHoy && comidasHoy[tipo]; });

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={function(e) { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`w-full max-w-md rounded-t-2xl shadow-2xl ${darkMode ? 'bg-gray-900 border-t border-gray-700' : 'bg-white'}`}
        style={{ maxHeight:'90vh', display:'flex', flexDirection:'column', paddingBottom:'env(safe-area-inset-bottom, 16px)' }}>

        {/* Header */}
        <div className={`flex-shrink-0 flex items-center justify-between px-5 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <h3 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <i className="fas fa-circle-plus text-green-500 mr-2"></i>
            {t('Armar comida','Build a meal')}
          </h3>
          <button onClick={onClose} aria-label={t('Cerrar','Close')}
            className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors ${darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-400 hover:bg-gray-100'}`}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ overflowY:'auto', flex:1 }} className="px-5 py-4 space-y-3">

          {/* ── Comidas recientes ────────────────────────────────────────── */}
          {recurrentes.length > 0 && (
            <div>
              <p style={{ fontSize:11, fontWeight:'700', color:'#9ca3af', marginBottom:6, display:'flex', alignItems:'center', gap:4 }}>
                <i className="fas fa-clock-rotate-left"></i>{t('Recientes','Recent')}
              </p>
              <div style={{ display:'flex', gap:6, overflowX:'auto', paddingBottom:2, scrollbarWidth:'none', msOverflowStyle:'none' }}>
                {recurrentes.slice(0, 12).map(function(r, ri) {
                  return (
                    <button key={ri} onClick={function() {
                      setNombre(r.nombre); setNombreManual(true);
                      setManualKcal(String(r.kcal));
                      setManualProt(String(r.proteinas_g));
                      setManualCarb(String(r.carbohidratos_g));
                      setManualGras(String(r.grasas_g));
                      setIngredientes([]);
                    }}
                      style={{ flexShrink:0, padding:'5px 10px', borderRadius:20, cursor:'pointer',
                        border:'1px solid ' + (darkMode ? '#4b5563' : '#d1d5db'),
                        backgroundColor: darkMode ? '#1f2937' : '#f9fafb',
                        color: darkMode ? '#d1d5db' : '#374151',
                        fontSize:12, fontWeight:'500', whiteSpace:'nowrap', lineHeight:'1.4' }}>
                      {r.nombre.length > 20 ? r.nombre.slice(0, 20) + '…' : r.nombre}
                      <span style={{ color:'#10b981', marginLeft:5, fontWeight:'700' }}>{r.kcal}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Buscador ─────────────────────────────────────────────────── */}
          <div className="relative">
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border"
              style={{ backgroundColor:searchBg, borderColor:inputBorder }}>
              <i className={`fas fa-magnifying-glass text-sm flex-shrink-0 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}></i>
              <input type="text" value={busqueda} autoFocus
                onChange={function(e) { setBusqueda(e.target.value); }}
                placeholder={t('Buscar alimento o ingrediente...','Search food or ingredient...')}
                style={{ background:'transparent', color:inputColor, caretColor:'#10b981',
                  flex:1, fontSize:'14px', outline:'none', border:'none' }} />
              {busqueda && (
                <button onClick={function() { setBusqueda(''); setSugerencias([]); }}
                  style={{ color:'#6b7280', cursor:'pointer', padding:0, background:'none', border:'none' }}>
                  <i className="fas fa-times text-xs"></i>
                </button>
              )}
            </div>
            {sugerencias.length > 0 && (
              <div className={`absolute top-full left-0 right-0 mt-1 rounded-xl border shadow-xl z-20 overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}`}>
                {sugerencias.map(function(item, idx) {
                  return (
                    <button key={idx} onClick={function() { agregarItem(item); }}
                      className={`w-full text-left px-4 py-2 flex items-center gap-3 transition-colors cursor-pointer border-b last:border-0 ${darkMode ? 'hover:bg-gray-700 border-gray-700' : 'hover:bg-green-50 border-gray-100'}`}>
                      <i className={`fas ${item._tipo === 'alimento' ? 'fa-apple-whole' : 'fa-bowl-food'} text-xs flex-shrink-0 ${item._tipo === 'alimento' ? 'text-green-500' : 'text-amber-500'}`}></i>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold truncate" style={{ color:inputColor }}>{item.nombre}</div>
                        {item.porcion && <div className="text-xs" style={{ color:'#9ca3af' }}>{item.porcion}</div>}
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="text-xs font-bold" style={{ color:'#6b7280' }}>{item.kcal} kcal</span>
                        <i className="fas fa-plus text-xs text-green-500"></i>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Bandeja de ingredientes ───────────────────────────────────── */}
          {tieneIngredientes && (
            <div className={`rounded-xl border overflow-hidden ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              {ingredientes.map(function(ing, idx) {
                var q = parseFloat(ing.qty) || 1;
                var subKcal = Math.round((ing.kcal || 0) * q);
                var qLabel = (q % 1 === 0) ? q + 'x' : q + 'x';
                return (
                  <div key={idx} className={`flex items-center gap-2 px-3 py-2 border-b last:border-0 ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-gray-50'}`}>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate" style={{ color:inputColor }}>{ing.nombre}</div>
                    </div>
                    {/* Qty stepper */}
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      <button onClick={function() { cambiarQty(idx, -0.5); }}
                        style={{ width:22, height:22, borderRadius:6, cursor:'pointer', fontSize:14, fontWeight:'bold', border:'none',
                          backgroundColor: darkMode ? '#374151' : '#e5e7eb', color: darkMode ? '#d1d5db' : '#374151' }}>−</button>
                      <span style={{ minWidth:28, textAlign:'center', fontSize:12, fontWeight:'bold', color:inputColor }}>{qLabel}</span>
                      <button onClick={function() { cambiarQty(idx, +0.5); }}
                        style={{ width:22, height:22, borderRadius:6, cursor:'pointer', fontSize:14, fontWeight:'bold', border:'none',
                          backgroundColor: darkMode ? '#374151' : '#e5e7eb', color: darkMode ? '#d1d5db' : '#374151' }}>+</button>
                    </div>
                    <span style={{ fontSize:11, fontWeight:'bold', color:'#6b7280', minWidth:52, textAlign:'right', flexShrink:0 }}>{subKcal} kcal</span>
                    <button onClick={function() { quitarIngrediente(idx); }}
                      style={{ color: darkMode ? '#4b5563' : '#d1d5db', cursor:'pointer', border:'none', background:'none', padding:0, flexShrink:0 }}
                      className="hover:text-red-500">
                      <i className="fas fa-times text-xs"></i>
                    </button>
                  </div>
                );
              })}
              {/* Fila total */}
              <div className={`flex items-center justify-between px-3 py-2 ${darkMode ? 'bg-gray-700/40' : 'bg-white'}`}>
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color:'#6b7280' }}>Total</span>
                <div className="flex gap-2 text-xs font-bold">
                  <span className="text-green-500">{totalesIngr.kcal} kcal</span>
                  <span className="text-blue-400">{totalesIngr.proteinas}P</span>
                  <span className="text-amber-400">{totalesIngr.carbohidratos}C</span>
                  <span className="text-purple-400">{totalesIngr.grasas}G</span>
                </div>
              </div>
            </div>
          )}

          {/* ── Entrada manual (solo si bandeja vacía) ───────────────────── */}
          {!tieneIngredientes && (
            <div className={`rounded-xl p-3 border ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
              <p className="text-xs mb-2.5" style={{ color:'#9ca3af' }}>
                {t('O ingresa los macros manualmente:','Or enter macros manually:')}
              </p>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { label:'kcal *', color:inputColor, val:manualKcal, set:setManualKcal },
                  { label:t('Prot g','Prot g'), color:'#3b82f6', val:manualProt, set:setManualProt },
                  { label:t('Carbs g','Carbs g'), color:'#f59e0b', val:manualCarb, set:setManualCarb },
                  { label:t('Grasas g','Fat g'), color:'#a855f7', val:manualGras, set:setManualGras }
                ].map(function(f, fi) {
                  return (
                    <div key={fi}>
                      <label className="text-xs font-bold mb-1 block" style={{ color:f.color }}>{f.label}</label>
                      <input type="number" value={f.val} onChange={function(e) { f.set(e.target.value); }}
                        placeholder="0" min="0" step="1"
                        style={{ display:'block', width:'100%', padding:'6px 8px', borderRadius:8, border:'1px solid '+inputBorder,
                          backgroundColor:inputBg, color:inputColor, fontSize:13, outline:'none', boxSizing:'border-box' }} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Nombre de la comida ───────────────────────────────────────── */}
          <div>
            <label className="text-xs font-bold mb-1 block" style={{ color:'#6b7280' }}>
              {t('Nombre de la comida','Meal name')} <span style={{ color:'#f87171' }}>*</span>
            </label>
            <input type="text" value={nombre}
              onChange={function(e) { setNombre(e.target.value); setNombreManual(true); }}
              placeholder={t('Ej: 2 huevos con tomate','E.g. 2 eggs with tomato')}
              style={{ display:'block', width:'100%', padding:'10px 12px', borderRadius:12, border:'1px solid '+inputBorder,
                backgroundColor:inputBg, color:inputColor, fontSize:14, outline:'none', boxSizing:'border-box' }} />
          </div>

          {/* ── ¿Reemplaza comida del plan? ───────────────────────────────── */}
          {comidasPlan.length > 0 && (
            <div>
              <label className="text-xs font-bold mb-1 flex items-center gap-1.5" style={{ color:'#6b7280' }}>
                <i className="fas fa-arrows-rotate text-amber-500"></i>
                {t('¿Reemplaza una comida del plan?','Replaces a planned meal?')}
              </label>
              <select value={reemplaza} onChange={function(e) { setReemplaza(e.target.value); }}
                style={{ display:'block', width:'100%', padding:'10px 12px', borderRadius:12, border:'1px solid '+inputBorder,
                  backgroundColor:inputBg, color:inputColor, fontSize:14, outline:'none', boxSizing:'border-box', cursor:'pointer' }}>
                <option value="">{t('No reemplaza ninguna','Does not replace any')}</option>
                {comidasPlan.map(function(tipo) {
                  return <option key={tipo} value={tipo}>{nombresComida[tipo] || tipo}</option>;
                })}
              </select>
              {reemplaza && (
                <p className="text-xs mt-1" style={{ color:'#f59e0b' }}>
                  <i className="fas fa-info-circle mr-1"></i>
                  {t('Los macros de esa comida del plan serán reemplazados por estos.','This will replace that meal\'s macros in your daily totals.')}
                </p>
              )}
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-xs" style={{ color:'#f87171' }}>
              <i className="fas fa-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          )}

          {/* ── Botones ───────────────────────────────────────────────────── */}
          <div className="flex gap-2 pt-1">
            <button onClick={onClose}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {t('Cancelar','Cancel')}
            </button>
            <button onClick={handleSubmit}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-green-500 text-white hover:bg-green-600 transition-colors cursor-pointer shadow-sm">
              <i className="fas fa-plus mr-1.5"></i>{t('Agregar','Add')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================
// COMPONENTE: HoyView — Dashboard diario (v20260428ai)
// =============================================
function HoyView({ perfil, darkMode, planSemanal, onNavigate, onSwapRecipe, swapping }) {
  const hoy = new Date();
  const diasJS    = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
  const diasEN    = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const mesesES   = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  const mesesEN   = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const diaActual = diasJS[hoy.getDay()]; // always ES for plan lookup
  const fechaStr  = t(
    diaActual + ' ' + hoy.getDate() + ' de ' + mesesES[hoy.getMonth()],
    diasEN[hoy.getDay()] + ', ' + mesesEN[hoy.getMonth()] + ' ' + hoy.getDate()
  );
  const hora = hoy.getHours();
  const saludo = hora < 12 ? t('Buenos días','Good morning') : hora < 19 ? t('Buenas tardes','Good afternoon') : t('Buenas noches','Good evening');
  const nombreCorto = perfil && perfil.nombre ? perfil.nombre.split(' ')[0] : '';

  // N24: detectar la semana actual según fecha de creación del plan
  const semanaData = React.useMemo(() => {
    if (!planSemanal) return null;
    const keys = Object.keys(planSemanal).filter(k => k.startsWith('semana_')).sort();
    if (keys.length === 0) return null;
    if (keys.length === 1 || !planSemanal._fechaCreacion) return planSemanal[keys[0]];
    const creadoMs = new Date(planSemanal._fechaCreacion + 'T00:00:00').getTime();
    const hoyMs = new Date().setHours(0, 0, 0, 0);
    const diasTranscurridos = Math.max(0, Math.floor((hoyMs - creadoMs) / 86400000));
    const semanaIdx = Math.min(keys.length - 1, Math.floor(diasTranscurridos / 7));
    return planSemanal[keys[semanaIdx]];
  }, [planSemanal]);

  const numSemanaActual = React.useMemo(() => {
    if (!planSemanal) return 1;
    const keys = Object.keys(planSemanal).filter(k => k.startsWith('semana_')).sort();
    if (keys.length <= 1 || !planSemanal._fechaCreacion) return 1;
    const creadoMs = new Date(planSemanal._fechaCreacion + 'T00:00:00').getTime();
    const hoyMs = new Date().setHours(0, 0, 0, 0);
    const diasTranscurridos = Math.max(0, Math.floor((hoyMs - creadoMs) / 86400000));
    return Math.min(keys.length, Math.floor(diasTranscurridos / 7) + 1);
  }, [planSemanal]);

  const comidasHoy = semanaData ? (semanaData[diaActual] || {}) : {};
  const fechaHoyIso = new Date().toISOString().split('T')[0];
  const resumenHoy = calcularResumenDiario(comidasHoy);
  const tiposOrden = ["desayuno", "snack_am", "almuerzo", "snack_pm", "cena"];
  const iconosComida = { desayuno: "fa-sun", snack_am: "fa-apple-whole", almuerzo: "fa-utensils", snack_pm: "fa-cookie-bite", cena: "fa-moon" };
  const nombresComida = {
    desayuno: t("Desayuno","Breakfast"),
    snack_am: "Snack AM",
    almuerzo: t("Almuerzo","Lunch"),
    snack_pm: "Snack PM",
    cena:     t("Cena","Dinner")
  };

  const [refresh, setRefresh] = React.useState(0);
  const tieneEntrenamiento = !!(perfil && (perfil.roadmap || perfil.roadmapMantenimiento || perfil.roadmapVolumen) && window.NP_Training);

  const entrenoHoy = React.useMemo(() => {
    if (!tieneEntrenamiento) return null;
    const hoyStr = new Date().toISOString().split('T')[0];
    const diasSemana = parseInt(localStorage.getItem('nutriplan_dias_semana') || '4');
    const planActual = window.NP_RoadmapData && window.NP_RoadmapData.SCHEDULES_POR_DIAS
      ? (window.NP_RoadmapData.SCHEDULES_POR_DIAS[diasSemana] || window.NP_RoadmapData.SCHEDULES_POR_DIAS[4])
      : null;
    const hoyDow = new Date(hoyStr + 'T12:00:00').getDay();
    const tipo = planActual ? (planActual.schedule[hoyDow] || 'descanso') : 'descanso';
    const sesion = window.NP_Training.obtener(hoyStr, tipo);
    if (!sesion) return { tipo, tipoInfo: null, completados: 0, total: 0, esDescanso: tipo === 'descanso', foco: null, duracionMin: null };
    const completados = sesion.ejercicios.filter(e => e.done).length;
    const total = sesion.ejercicios.length;
    const tipoInfo = planActual && planActual.tipos ? planActual.tipos.find(t => t.k === tipo) : null;
    const semanaNum = window.NP_RoadmapData ? window.NP_RoadmapData.semanaActual(hoyStr) : 0;
    const equiposDisp = leerEquipos();
    const protocolo = (window.NP_RoadmapData && window.NP_RoadmapData.generarProtocoloDia && tipo !== 'descanso')
      ? window.NP_RoadmapData.generarProtocoloDia(tipo, semanaNum, equiposDisp)
      : null;
    const foco = protocolo ? protocolo.foco : null;
    const duracionMin = protocolo ? protocolo.duracionMin : null;
    return { tipo, tipoInfo, completados, total, esDescanso: tipo === 'descanso', foco, duracionMin };
  }, [tieneEntrenamiento, refresh]);

  const pasosHoy = React.useMemo(() => {
    if (!tieneEntrenamiento || !window.NP_Steps || !window.NP_Steps.hoy) return null;
    return window.NP_Steps.hoy();
  }, [tieneEntrenamiento, refresh]);

  const [pesoInput, setPesoInput] = React.useState('');
  const [pesoGuardado, setPesoGuardado] = React.useState(false);
  const [pesoError, setPesoError] = React.useState(''); // N23
  const [comidasExt, setComidasExt] = React.useState(function() { return _comidasExtFecha(fechaHoyIso); });
  const [showModalExt, setShowModalExt] = React.useState(false);
  const [showScanner, setShowScanner] = React.useState(false);

  const necesitaPeso = React.useMemo(() => {
    if (!tieneEntrenamiento || !window.NP_BodyComp || !window.NP_BodyComp.cargar) return false;
    const entries = window.NP_BodyComp.cargar();
    if (!entries || entries.length === 0) return true;
    const hace7 = new Date(); hace7.setDate(hace7.getDate() - 7);
    const hace7Str = hace7.toISOString().split('T')[0];
    return !entries.some(e => e.fecha >= hace7Str && e.peso != null);
  }, [tieneEntrenamiento, refresh]);

  // Suma de macros de comidas externas
  const resumenExt = comidasExt.reduce(function(acc, c) {
    return {
      calorias:      acc.calorias      + (c.kcal            || 0),
      proteinas:     acc.proteinas     + (c.proteinas_g      || 0),
      carbohidratos: acc.carbohidratos + (c.carbohidratos_g  || 0),
      grasas:        acc.grasas        + (c.grasas_g         || 0)
    };
  }, { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 });
  // Comidas del plan reemplazadas por una externa → se descuentan del resumen
  const tiposReemplazados = comidasExt.filter(function(c) { return c.reemplaza; }).map(function(c) { return c.reemplaza; });
  const comidasExtAdicional = comidasExt.filter(function(c) { return !c.reemplaza; });
  var resumenBase = resumenHoy;
  if (tiposReemplazados.length > 0) {
    var comidasHoyEfectivas = {};
    Object.keys(comidasHoy).forEach(function(tipo) {
      if (tiposReemplazados.indexOf(tipo) === -1) comidasHoyEfectivas[tipo] = comidasHoy[tipo];
    });
    resumenBase = calcularResumenDiario(comidasHoyEfectivas);
  }
  const resumenTotal = {
    calorias:      resumenBase.calorias      + resumenExt.calorias,
    proteinas:     resumenBase.proteinas     + Math.round(resumenExt.proteinas),
    carbohidratos: resumenBase.carbohidratos + Math.round(resumenExt.carbohidratos),
    grasas:        resumenBase.grasas        + Math.round(resumenExt.grasas),
    costo_clp:     resumenHoy.costo_clp
  };

  const guardarPeso = () => {
    const val = parseFloat(pesoInput.replace(',', '.'));
    // N23: range validation with feedback
    if (isNaN(val)) { setPesoError(t('Ingresa un número válido','Enter a valid number')); return; }
    if (val < 20 || val > 300) { setPesoError(t('El peso debe estar entre 20 y 300 kg','Weight must be between 20 and 300 kg')); return; }
    setPesoError('');
    if (window.NP_BodyComp) {
      const hoyStr = new Date().toISOString().split('T')[0];
      window.NP_BodyComp.registrar({
        fecha: hoyStr, peso: val,
        _genero: perfil && perfil.genero === 'femenino' ? 'F' : 'M',
        _altura: perfil ? perfil.altura : null
      });
      setPesoGuardado(true);
      setRefresh(r => r + 1);
    }
  };

  // ── Progreso diario: kcal y macros consumidos hasta ahora ──────────────────
  var consumidoHoy = { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 };
  tiposOrden.forEach(function(tipo) {
    if (tiposReemplazados.indexOf(tipo) >= 0) return; // reemplazado por externa → cuenta en comidasExt
    var comida = comidasHoy[tipo];
    if (!comida) return;
    var estadoAdh = (typeof window.adherencia !== 'undefined' && window.adherencia.estado)
      ? window.adherencia.estado(diaActual, tipo, 1) : null;
    if (!estadoAdh || !estadoAdh.comido) return;
    consumidoHoy.calorias      += comida.calorias_escaladas      || comida.calorias      || 0;
    consumidoHoy.proteinas     += comida.proteinas_escaladas     || comida.proteinas     || 0;
    consumidoHoy.carbohidratos += comida.carbohidratos_escalados || comida.carbohidratos || 0;
    consumidoHoy.grasas        += comida.grasas_escaladas        || comida.grasas        || 0;
  });
  comidasExt.forEach(function(c) {
    consumidoHoy.calorias      += c.kcal            || 0;
    consumidoHoy.proteinas     += c.proteinas_g      || 0;
    consumidoHoy.carbohidratos += c.carbohidratos_g  || 0;
    consumidoHoy.grasas        += c.grasas_g         || 0;
  });
  consumidoHoy = {
    calorias:      Math.round(consumidoHoy.calorias),
    proteinas:     Math.round(consumidoHoy.proteinas),
    carbohidratos: Math.round(consumidoHoy.carbohidratos),
    grasas:        Math.round(consumidoHoy.grasas)
  };
  var metaKcalDia = (perfil && perfil.caloriasObjetivo) || resumenHoy.calorias || 0;
  // Leer metas de macros desde el roadmap científico (LBM × factor), no desde el output del plan
  var _rm   = perfil && (perfil.roadmap || perfil.roadmapMantenimiento || perfil.roadmapVolumen);
  var _calc = _rm && _rm.calculados;
  var _mgr  = _calc && _calc.macrosGramos;   // presente en roadmaps nuevos (LBM-based)
  // Proteína: macrosGramos > proteinaTarget (siempre en roadmap) > proteinaFloor del perfil > plan output
  var metaProtDia = _mgr && _mgr.proteina
    ? Math.round(_mgr.proteina)
    : _calc && _calc.proteinaTarget
    ? Math.round(_calc.proteinaTarget)
    : (perfil && perfil.proteinaFloor)
    ? Math.round(perfil.proteinaFloor)
    : (resumenHoy.proteinas || 0);
  // Carbos y grasas: macrosGramos > derivar desde proteinaTarget + split objetivo > plan output
  var metaCarbDia, metaGrasDia;
  if (_mgr && _mgr.carbohidratos) {
    metaCarbDia = Math.round(_mgr.carbohidratos);
    metaGrasDia = Math.round(_mgr.grasas);
  } else if (metaProtDia > 0 && metaKcalDia > 0) {
    // Derivar desde kcal restantes con split según objetivo
    var _obj    = perfil && perfil.objetivo;
    var _remKcal = Math.max(0, metaKcalDia - metaProtDia * 4);
    var _carbPct = _obj === 'volumen' ? 0.60 : _obj === 'mantenimiento' ? 0.45 : 0.572;
    metaCarbDia = Math.round(_remKcal * _carbPct / 4);
    metaGrasDia = Math.round(_remKcal * (1 - _carbPct) / 9);
  } else {
    metaCarbDia = resumenHoy.carbohidratos || 0;
    metaGrasDia = resumenHoy.grasas        || 0;
  }

  const pctKcal = perfil && perfil.caloriasObjetivo && resumenTotal.calorias > 0
    ? Math.min(100, Math.round((resumenTotal.calorias / perfil.caloriasObjetivo) * 100)) : 0;

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Saludo */}
      {(() => {
        const obj = perfil && perfil.objetivo ? perfil.objetivo.toLowerCase() : 'default';
        const headerGradient = OBJETIVO_GRADIENTS[obj] || OBJETIVO_GRADIENTS['default'];
        const objetivoLabel = { perdida: 'Pérdida de grasa', volumen: 'Ganancia muscular', mantenimiento: 'Mantenimiento' }[obj] || '';
        return (
          <div className="rounded-2xl px-5 py-4 text-white shadow-md" style={{ background: headerGradient }}>
            <p className="text-sm font-medium opacity-90">{fechaStr}{objetivoLabel ? ' · ' + objetivoLabel : ''}</p>
            <h2 className="text-xl font-extrabold font-display mt-0.5">{saludo}{nombreCorto ? ', ' + nombreCorto : ''} 👋</h2>
            {perfil && (
              <p className="text-sm opacity-80 mt-1">{perfil.caloriasObjetivo} kcal · {perfil.numSemanas > 1 ? perfil.numSemanas + t(' semanas',' weeks') : t('1 semana','1 week')}</p>
            )}
            {/* Streak + training/rest day badges */}
            {(() => {
              var streak = calcularStreakAdherencia();
              var sch = window.NP_RoadmapData && window.NP_RoadmapData.ENTRENO_PROTOCOLO
                ? window.NP_RoadmapData.ENTRENO_PROTOCOLO.scheduleDefault : null;
              var dow = new Date().getDay();
              var esEntreno = sch && sch[dow] && sch[dow] !== 'descanso';
              if (streak < 2 && !sch) return null;
              return (
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {streak >= 2 && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)' }}>
                      🔥 {streak} {t('días','days')}
                    </span>
                  )}
                  {sch && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)' }}>
                      {esEntreno
                        ? <><i className="fas fa-dumbbell" style={{ marginRight: '3px' }}></i>{t('Entreno','Training')}</>
                        : <><i className="fas fa-bed" style={{ marginRight: '3px' }}></i>{t('Descanso','Rest')}</>}
                    </span>
                  )}
                </div>
              );
            })()}
          </div>
        );
      })()}

      {/* ── Semana actual Lun→Dom (adherencia) ──────────────────────────── */}
      {typeof window.adherencia !== 'undefined' && (() => {
        // Calcular lunes de la semana actual
        const hoy = new Date();
        const hoyFecha = hoy.toISOString().split('T')[0];
        const dow = hoy.getDay(); // 0=Dom,1=Lun..6=Sáb
        const diffLunes = dow === 0 ? -6 : 1 - dow;
        const lunes = new Date(hoy);
        lunes.setDate(hoy.getDate() + diffLunes);

        // L M X J V S D  (X=Miércoles para no duplicar M)
        const LABELS = ['L','M','X','J','V','S','D'];

        // Leer adherencia directo — evita depender de historial() que usa días corridos
        let adherData = {};
        try { adherData = JSON.parse(localStorage.getItem('nutriplan_adherencia') || '{}'); } catch(e) {}

        const semana = LABELS.map((label, i) => {
          const d = new Date(lunes);
          d.setDate(lunes.getDate() + i);
          const fecha = d.toISOString().split('T')[0];
          const esFuturo = fecha > hoyFecha;
          const isHoy = fecha === hoyFecha;
          const diaData = adherData[fecha] || {};
          let total = 0, cumplidos = 0;
          Object.values(diaData).forEach(e => { total++; if (e.comido) cumplidos++; });
          return { label, fecha, esFuturo, isHoy, total, cumplidos };
        });

        const hayDatos = semana.some(d => !d.esFuturo && d.total > 0);
        if (!hayDatos) return null;

        return (
          <div className={`rounded-2xl px-5 py-3 flex items-center justify-between ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100 shadow-sm'}`}>
            <span className={`text-xs font-semibold uppercase tracking-wider flex-shrink-0 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <i className="fas fa-calendar-check mr-1.5"></i>Esta semana
            </span>
            <div className="flex items-center gap-2">
              {semana.map(d => {
                let dotClass = 'adh-dot adh-dot--empty';
                if (d.esFuturo) {
                  dotClass = 'adh-dot adh-dot--empty';
                } else if (d.total > 0) {
                  const pct = d.cumplidos / d.total;
                  dotClass = pct >= 0.8 ? 'adh-dot adh-dot--ok' : pct >= 0.4 ? 'adh-dot adh-dot--partial' : 'adh-dot adh-dot--miss';
                }
                return (
                  <div key={d.fecha} className="flex flex-col items-center gap-1"
                    title={d.esFuturo ? d.label : `${d.label}: ${d.cumplidos}/${d.total}`}>
                    <span className={dotClass}
                      style={d.isHoy ? { boxShadow: '0 0 0 2px var(--color-accent)', opacity: 1 } : d.esFuturo ? { opacity: 0.25 } : {}}></span>
                    <span className={`text-[9px] ${d.isHoy ? 'font-bold' : ''} ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
                      style={d.esFuturo ? { opacity: 0.4 } : {}}>
                      {d.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* ── Progreso del día ─────────────────────────────────────────────── */}
      {metaKcalDia > 0 && (
        <div className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100 shadow-sm'}`}>
          <div className={`px-5 py-3 flex items-center justify-between border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <i className="fas fa-chart-line mr-2"></i>{t('Progreso del día','Daily progress')}
            </h3>
            {consumidoHoy.calorias > 0 && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                consumidoHoy.calorias >= metaKcalDia
                  ? 'bg-green-500/20 text-green-600'
                  : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}>
                {Math.min(100, Math.round((consumidoHoy.calorias / metaKcalDia) * 100))}%
              </span>
            )}
          </div>
          <div className="px-5 py-4 space-y-4">
            {/* Kcal principal */}
            <div>
              <div className="flex items-end justify-between mb-2">
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl font-extrabold font-display leading-none ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {consumidoHoy.calorias}
                  </span>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>
                    / {metaKcalDia} kcal
                  </span>
                </div>
                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {metaKcalDia - consumidoHoy.calorias > 0
                    ? (metaKcalDia - consumidoHoy.calorias) + t(' kcal restantes',' kcal left')
                    : t('¡Meta alcanzada! 🎯','Goal reached! 🎯')}
                </span>
              </div>
              <div className={`w-full h-3 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div
                  className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-green-500 to-emerald-400"
                  style={{ width: Math.min(100, consumidoHoy.calorias > 0 ? Math.round((consumidoHoy.calorias / metaKcalDia) * 100) : 0) + '%' }}>
                </div>
              </div>
            </div>
            {/* Macros donut */}
            <MacroDonut
              consumed={consumidoHoy}
              metas={{ proteinas: metaProtDia, carbohidratos: metaCarbDia, grasas: metaGrasDia, calorias: metaKcalDia }}
              darkMode={darkMode}
            />
          </div>
        </div>
      )}

      {/* Comidas del día */}
      {planSemanal ? (
        <div className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100 shadow-sm'}`}>
          <div className={`px-5 py-3 flex items-center justify-between border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <i className="fas fa-utensils mr-2"></i>{t('Comidas de hoy','Today\'s meals')}
            </h3>
            <button onClick={() => onNavigate('plan')}
              className="text-xs text-green-500 font-semibold hover:text-green-600">
              {t('Ver plan →','View plan →')}
            </button>
          </div>
          {resumenTotal.calorias > 0 && (
            <div className={`px-5 py-2.5 border-b ${darkMode ? 'border-gray-700' : 'border-gray-50 bg-gray-50'}`}>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{resumenTotal.calorias} kcal</span>
                <div className="flex gap-3 text-gray-400">
                  <span><span className="text-blue-500 font-semibold">{resumenTotal.proteinas}g</span> {t('prot','prot')}</span>
                  <span><span className="text-amber-500 font-semibold">{resumenTotal.carbohidratos}g</span> {t('carb','carb')}</span>
                  <span><span className="text-rose-500 font-semibold">{resumenTotal.grasas}g</span> {t('grasas','fat')}</span>
                </div>
              </div>
              {pctKcal > 0 && (
                <div className={`w-full h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div className="h-full bg-green-500 transition-all" style={{ width: pctKcal + '%' }}></div>
                </div>
              )}
            </div>
          )}
          <div className={`divide-y stagger-children ${darkMode ? 'divide-gray-700' : 'divide-gray-50'}`}>
            {tiposOrden.map(tipo => {
              const comida = comidasHoy[tipo];
              if (!comida) return null;
              // Comida reemplazada por entrada externa
              const extReemplazo = comidasExt.find(function(c) { return c.reemplaza === tipo; });
              // N11: estado de adherencia para el día de hoy
              const semanaActualIdx = semanaData ? 1 : 1;
              const estadoAdh = (typeof window.adherencia !== 'undefined' && window.adherencia.estado)
                ? window.adherencia.estado(diaActual, tipo, semanaActualIdx) : null;
              const yaComido = estadoAdh?.comido === true;
              const toggleAdh = () => {
                if (typeof window.adherencia !== 'undefined' && window.adherencia.marcar) {
                  window.adherencia.marcar(diaActual, tipo, !yaComido, {
                    kcal_plan: comida.calorias_escaladas || comida.calorias,
                    proteinas_plan: comida.proteinas_escaladas || comida.proteinas
                  });
                  setRefresh(r => r + 1);
                }
              };
              // Slot reemplazado por comida externa → mostrar la comida externa en el slot
              if (extReemplazo) {
                return (
                  <div key={tipo} className="px-5 py-2.5 flex items-center gap-3 animate-fadeUp">
                    <i className={`fas ${iconosComida[tipo]} text-sm w-4 text-center text-green-500`}></i>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <div className={`text-[11px] font-bold uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{nombresComida[tipo]}</div>
                        <span style={{ fontSize: '10px', fontWeight: 600, padding: '1px 6px', borderRadius: 4, background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
                          {t('comido','eaten')}
                        </span>
                      </div>
                      <div className={`text-sm font-medium truncate ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{extReemplazo.nombre}</div>
                      <div className="text-xs mt-0.5">
                        <span className="text-blue-400 font-semibold">{extReemplazo.proteinas_g}g</span>{' '}{t('prot','prot')}
                        {' · '}<span className="text-amber-400 font-semibold">{extReemplazo.carbohidratos_g}g</span>{' '}{t('carb','carb')}
                        {' · '}<span className="text-rose-400 font-semibold">{extReemplazo.grasas_g}g</span>{' '}{t('grasas','fat')}
                      </div>
                    </div>
                    <span className={`text-xs font-bold flex-shrink-0 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{extReemplazo.kcal} kcal</span>
                    <button
                      onClick={function() {
                        var nuevas = comidasExt.filter(function(x) { return x.id !== extReemplazo.id; });
                        setComidasExt(nuevas);
                        _guardarComidasExt(fechaHoyIso, nuevas);
                        _eliminarAdherenciaExt(diaActual, extReemplazo.id);
                        setRefresh(function(r) { return r + 1; });
                      }}
                      aria-label={t('Deshacer reemplazo','Undo replacement')}
                      title={t('Deshacer reemplazo','Undo replacement')}
                      style={{
                        flexShrink: 0, width: '2rem', height: '2rem',
                        borderRadius: '0.5rem', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'transparent', transition: 'color 0.15s',
                        color: darkMode ? '#4b5563' : '#9ca3af'
                      }}>
                      <i className="fas fa-rotate-left text-xs"></i>
                    </button>
                  </div>
                );
              }
              // Slot del plan normal
              return (
                <div key={tipo} className="px-5 py-2.5 flex items-center gap-3 animate-fadeUp">
                  <i className={`fas ${iconosComida[tipo]} text-sm w-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}></i>
                  <div className="flex-1 min-w-0">
                    <div className={`text-[11px] font-bold uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{nombresComida[tipo]}</div>
                    <div className={`text-sm font-medium truncate ${yaComido ? 'line-through opacity-60' : ''} ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{getNombreReceta(comida)}</div>
                  </div>
                  <span className={`text-xs font-bold flex-shrink-0 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{comida.calorias_escaladas || comida.calorias} kcal</span>
                  {onSwapRecipe && (
                    <button
                      onClick={(ev) => { ev.stopPropagation(); onSwapRecipe(diaActual, tipo, numSemanaActual); }}
                      disabled={!!(swapping && swapping.dia === diaActual && swapping.tipoComida === tipo)}
                      aria-label={t(`Cambiar ${nombresComida[tipo]}`, `Swap ${nombresComida[tipo]}`)}
                      style={{
                        flexShrink: 0, width: '2rem', height: '2rem',
                        borderRadius: '0.5rem', border: 'none',
                        cursor: (swapping && swapping.dia === diaActual && swapping.tipoComida === tipo) ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'color 0.15s', background: 'transparent',
                        color: (swapping && swapping.dia === diaActual && swapping.tipoComida === tipo)
                          ? '#f97316' : (darkMode ? '#4b5563' : '#9ca3af')
                      }}>
                      <i className={`fas ${(swapping && swapping.dia === diaActual && swapping.tipoComida === tipo) ? 'fa-spinner fa-spin' : 'fa-shuffle'} text-xs`}></i>
                    </button>
                  )}
                  {typeof window.adherencia !== 'undefined' && (
                    <button onClick={toggleAdh}
                      aria-label={yaComido ? t(`Marcar ${nombresComida[tipo]} como no comido`,`Mark ${nombresComida[tipo]} as not eaten`) : t(`Marcar ${nombresComida[tipo]} como comido`,`Mark ${nombresComida[tipo]} as eaten`)}
                      className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        yaComido ? 'bg-green-500 text-white' : darkMode ? 'bg-gray-700 text-gray-500 hover:bg-gray-600' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}>
                      <i className={`fas ${yaComido ? 'fa-check' : 'fa-circle'} text-xs`}></i>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className={`rounded-2xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
          <EmptyState
            icon="fa-calendar-plus"
            title={t('Sin plan semanal','No weekly plan yet')}
            desc={t('Genera tu plan para ver las comidas de hoy y registrar tu progreso.','Generate your plan to see today\'s meals and track your progress.')}
            cta={<><i className="fas fa-plus mr-1.5"></i>{t('Crear mi plan','Create my plan')}</>}
            onCta={() => onNavigate('plan')}
            darkMode={darkMode}
          />
        </div>
      )}

      {/* Comidas externas */}
      <div className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100 shadow-sm'}`}>
        <div className={`px-5 py-3 flex items-center justify-between border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <h3 className={`text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <i className="fas fa-circle-plus mr-2"></i>{t('Comidas externas','Extra meals')}
          </h3>
          <div className="flex items-center gap-2">
            <button onClick={function() { setShowScanner(true); }}
              className={'text-xs font-semibold cursor-pointer transition-colors ' + (darkMode ? 'text-amber-400 hover:text-amber-300' : 'text-amber-600 hover:text-amber-700')}
              title="Escanear código de barras">
              <i className="fas fa-barcode mr-1"></i>{t('Escanear','Scan')}
            </button>
            <span className={darkMode ? 'text-gray-600' : 'text-gray-300'}>|</span>
            <button onClick={function() { setShowModalExt(true); }}
              className="text-xs text-green-500 font-semibold hover:text-green-600 cursor-pointer transition-colors">
              <i className="fas fa-plus mr-1"></i>{t('Agregar','Add')}
            </button>
          </div>
        </div>
        {comidasExtAdicional.length === 0 ? (
          <button onClick={function() { setShowModalExt(true); }}
            className={`w-full px-5 py-4 text-center text-xs transition-colors cursor-pointer ${darkMode ? 'text-gray-500 hover:bg-gray-700/50' : 'text-gray-400 hover:bg-gray-50'}`}>
            <i className="fas fa-plus-circle mr-1.5"></i>{t('Registrar comida no planificada','Log an unplanned meal')}
          </button>
        ) : (
          <div className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-50'}`}>
            {comidasExtAdicional.map(function(c) {
              return (
                <div key={c.id} className="px-5 py-2.5 flex items-center gap-3">
                  <i className={`fas fa-utensils text-sm w-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}></i>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium truncate ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{c.nombre}</div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      <span className="text-blue-400 font-semibold">{c.proteinas_g}g</span>{' '}{t('prot','prot')}
                      {' · '}
                      <span className="text-amber-400 font-semibold">{c.carbohidratos_g}g</span>{' '}{t('carb','carb')}
                      {' · '}
                      <span className="text-purple-400 font-semibold">{c.grasas_g}g</span>{' '}{t('grasas','fat')}
                    </div>
                  </div>
                  <span className={`text-xs font-bold flex-shrink-0 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{c.kcal} kcal</span>
                  <button
                    onClick={function() {
                      var nuevas = comidasExt.filter(function(x) { return x.id !== c.id; });
                      setComidasExt(nuevas);
                      _guardarComidasExt(fechaHoyIso, nuevas);
                      _eliminarAdherenciaExt(diaActual, c.id);
                      setRefresh(function(r) { return r + 1; });
                    }}
                    aria-label={t('Eliminar comida externa','Remove extra meal')}
                    className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${darkMode ? 'text-gray-600 hover:text-red-400 hover:bg-gray-700' : 'text-gray-300 hover:text-red-500 hover:bg-red-50'}`}>
                    <i className="fas fa-trash text-xs"></i>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bloque Fitness (solo fatLossMode) */}
      {tieneEntrenamiento && (
        <div className="space-y-3">
          {entrenoHoy && (
            <div className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100 shadow-sm'}`}>
              <div className={`px-5 py-3 flex items-center justify-between border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <h3 className={`text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <i className="fas fa-dumbbell mr-2"></i>{t('Entreno de hoy',"Today's workout")}
                </h3>
                <button onClick={() => onNavigate('fitness')}
                  className="text-xs text-orange-500 font-semibold hover:text-orange-600">{t('Abrir →','Open →')}</button>
              </div>
              <div className="px-5 py-3">
                {entrenoHoy.esDescanso ? (
                  <div className="flex items-center gap-3">
                    <i className="fas fa-couch text-2xl text-gray-400"></i>
                    <div>
                      <div className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{t('Día de descanso','Rest day')}</div>
                      <div className="text-xs text-gray-400">{t('Recuperación activa','Active recovery')}</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-extrabold text-lg">{entrenoHoy.tipo}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{entrenoHoy.tipoInfo ? entrenoHoy.tipoInfo.corto : 'Tipo ' + entrenoHoy.tipo}</div>
                      {entrenoHoy.foco && (
                        <div className={`text-xs mt-0.5 font-medium ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>{entrenoHoy.foco}</div>
                      )}
                      {entrenoHoy.duracionMin && !entrenoHoy.foco && (
                        <div className="text-xs text-gray-400 mt-0.5"><i className="fas fa-clock mr-1"></i>{entrenoHoy.duracionMin} min</div>
                      )}
                      {entrenoHoy.total > 0 && (
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            <div className={`h-full ${entrenoHoy.completados === entrenoHoy.total ? 'bg-green-500' : 'bg-orange-500'}`}
                              style={{ width: Math.round((entrenoHoy.completados / entrenoHoy.total) * 100) + '%' }}></div>
                          </div>
                          <span className="text-xs text-gray-400">{entrenoHoy.completados}/{entrenoHoy.total}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {pasosHoy != null && (
            <div className={`rounded-2xl px-5 py-3 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100 shadow-sm'}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className={`text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <i className="fas fa-person-walking mr-2"></i>{t('Pasos hoy','Steps today')}
                </h3>
                <span className={`text-sm font-extrabold ${(pasosHoy.pasos || 0) >= (pasosHoy.target || 8000) ? 'text-green-500' : darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {(pasosHoy.pasos || 0).toLocaleString()} / {(pasosHoy.target || 8000).toLocaleString()}
                </span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className={`h-full rounded-full ${(pasosHoy.pasos || 0) >= (pasosHoy.target || 8000) ? 'bg-green-500' : 'bg-orange-500'}`}
                  style={{ width: Math.min(100, Math.round(((pasosHoy.pasos || 0) / (pasosHoy.target || 8000)) * 100)) + '%' }}></div>
              </div>
            </div>
          )}

          {necesitaPeso && !pesoGuardado && (
            <div className={`rounded-2xl px-5 py-4 ${darkMode ? 'bg-gray-800 border border-yellow-800/40' : 'bg-yellow-50 border border-yellow-200'}`}>
              <h3 className={`text-sm font-bold mb-2 ${darkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
                <i className="fas fa-weight-scale mr-2"></i>{t('¿Cuánto pesas hoy?','How much do you weigh today?')}
              </h3>
              <div className="flex gap-2">
                <input type="number" value={pesoInput} onChange={e => { setPesoInput(e.target.value); if (pesoError) setPesoError(''); }}
                  onKeyDown={e => { if (e.key === 'Enter') guardarPeso(); }}
                  placeholder={t('ej: 78.5','e.g. 78.5')} min="20" max="300" step="0.1"
                  className={`flex-1 px-3 py-2 rounded-xl border text-sm ${pesoError ? 'border-red-400' : ''} ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-yellow-300 text-gray-800 placeholder-gray-400'}`} />
                <button onClick={guardarPeso}
                  className="px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors">
                  {t('Guardar','Save')}
                </button>
              </div>
              {/* N23: range validation feedback — animate-slideDown para entrada suave */}
              {pesoError && (
                <div className="animate-slideDown">
                  <p className="text-red-500 text-xs mt-1">{pesoError}</p>
                </div>
              )}
            </div>
          )}
          {pesoGuardado && (
            <div className={`rounded-2xl px-5 py-3 flex items-center gap-3 animate-fadeIn ${darkMode ? 'bg-green-900/30 border border-green-800' : 'bg-green-50 border border-green-200'}`}>
              <i className="fas fa-check-circle text-green-500"></i>
              <span className={`text-sm font-medium ${darkMode ? 'text-green-300' : 'text-green-700'}`}>{t('Peso registrado correctamente','Weight recorded successfully')}</span>
            </div>
          )}
        </div>
      )}

      {/* Modal escáner de código de barras */}
      {showScanner && (
        <BarcodeScannerModal
          darkMode={darkMode}
          onAdd={function(comida) {
            var nuevas = comidasExt.concat([comida]);
            setComidasExt(nuevas);
            _guardarComidasExt(fechaHoyIso, nuevas);
            _agregarAdherenciaExt(diaActual, comida);
            setRefresh(function(r) { return r + 1; });
          }}
          onClose={function() { setShowScanner(false); }}
        />
      )}

      {/* Modal comida externa */}
      {showModalExt && (
        <ModalComidaExterna
          darkMode={darkMode}
          diaActual={diaActual}
          comidasHoy={comidasHoy}
          nombresComida={nombresComida}
          onAdd={function(comida) {
            var nuevas = comidasExt.concat([comida]);
            setComidasExt(nuevas);
            _guardarComidasExt(fechaHoyIso, nuevas);
            _agregarAdherenciaExt(diaActual, comida);
            // Si reemplaza una comida planificada → marcarla como comida
            if (comida.reemplaza && typeof window.adherencia !== 'undefined') {
              var planReemplazada = comidasHoy[comida.reemplaza];
              window.adherencia.marcar(diaActual, comida.reemplaza, true, {
                kcal_plan: planReemplazada ? (planReemplazada.calorias_escaladas || planReemplazada.calorias || 0) : 0,
                proteinas_plan: planReemplazada ? (planReemplazada.proteinas_escaladas || planReemplazada.proteinas || 0) : 0
              }, 1);
            }
            setRefresh(function(r) { return r + 1; });
          }}
          onClose={function() { setShowModalExt(false); }}
        />
      )}
    </div>
  );
}

// =============================================
// COMPONENTE: NutricionLogView — historial nutricional con donut de macros
// =============================================
function NutricionLogView({ perfil, darkMode }) {
  const [dias, setDias] = React.useState(14);

  const datos = React.useMemo(() => {
    const adher = (() => { try { return JSON.parse(localStorage.getItem('nutriplan_adherencia') || '{}'); } catch(e) { return {}; } })();
    const ext   = (() => { try { return JSON.parse(localStorage.getItem('nutriplan_comidas_externas') || '{}'); } catch(e) { return {}; } })();

    const rm = perfil && (perfil.roadmap || perfil.roadmapMantenimiento || perfil.roadmapVolumen);
    const mg         = rm?.calculados?.macrosGramos;
    const kcalTarget = rm?.calculados?.caloriasCorte || rm?.calculados?.caloriasObjetivo || null;
    const protTarget = mg?.proteina     || null;
    const carbTarget = mg?.carbohidratos || null;
    const fatTarget  = mg?.grasas       || null;

    // Ratio carb/fat para estimación (kcal remanente tras proteína)
    const carbKcalPlan = mg ? mg.carbohidratos * 4 : 0;
    const fatKcalPlan  = mg ? mg.grasas * 9 : 0;
    const remTotal  = carbKcalPlan + fatKcalPlan;
    const carbRatio = remTotal > 0 ? carbKcalPlan / remTotal : 0.6;

    const ORDEN     = ['desayuno', 'snack_am', 'almuerzo', 'snack_pm', 'cena'];
    const DIA_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const hoy = new Date();
    const diasData = [];

    for (let i = dias - 1; i >= 0; i--) {
      const d = new Date(hoy);
      d.setDate(hoy.getDate() - i);
      const fecha   = d.toISOString().split('T')[0];
      const diaData = adher[fecha] || {};
      const extData = ext[fecha]   || [];

      // Tipos del plan reemplazados por comidas externas → no contar del plan
      const tiposReemplazados = extData.filter(c => c.reemplaza).map(c => c.reemplaza);

      let kcalPlan = 0, protPlan = 0, total = 0, consumidas = 0;

      ORDEN.forEach(tipo => {
        if (tiposReemplazados.includes(tipo)) return; // reemplazado → se suma vía extData
        const key = Object.keys(diaData).find(k => k.split(':')[1] === tipo);
        if (!key) return;
        const m = diaData[key];
        total++;
        if (m.comido) { consumidas++; kcalPlan += m.kcal_plan || 0; protPlan += m.proteinas_plan || 0; }
      });

      // Comidas externas: siempre consumidas, usar sus macros reales
      let kcalExt = 0, protExt = 0, carbExt = 0, fatExt = 0;
      extData.forEach(c => {
        total++;
        consumidas++;
        kcalExt += c.kcal            || 0;
        protExt += c.proteinas_g     || 0;
        carbExt += c.carbohidratos_g || 0;
        fatExt  += c.grasas_g        || 0;
      });

      const kcal = kcalPlan + kcalExt;
      const prot = protPlan + protExt;

      // Carb/fat: exactos en externos + estimación para comidas del plan
      const remPlan = Math.max(0, kcalPlan - protPlan * 4);
      const carb = Math.round(remPlan * carbRatio / 4)     + carbExt;
      const fat  = Math.round(remPlan * (1 - carbRatio) / 9) + fatExt;

      diasData.push({
        fecha, label: DIA_SHORT[d.getDay()], dia: d.getDate(),
        tieneRegistro: total > 0,
        kcal: Math.round(kcal), prot: Math.round(prot),
        carb, fat,
        adherencia: total > 0 ? Math.round(consumidas / total * 100) : null,
        total, consumidas
      });
    }

    const conReg = diasData.filter(d => d.tieneRegistro && d.kcal > 0);
    const n = conReg.length || 1;
    const avg = key => Math.round(conReg.reduce((s, d) => s + d[key], 0) / n);
    const avgKcal = avg('kcal'), avgProt = avg('prot'), avgCarb = avg('carb'), avgFat = avg('fat');
    const avgAdher = Math.round(
      diasData.filter(d => d.adherencia !== null).reduce((s, d) => s + d.adherencia, 0) /
      Math.max(1, diasData.filter(d => d.adherencia !== null).length)
    );

    const pKcal = avgProt * 4, cKcal = avgCarb * 4, fKcal = avgFat * 9;
    const totMKcal = (pKcal + cKcal + fKcal) || 1;
    const protPct = Math.round(pKcal / totMKcal * 100);
    const carbPct = Math.round(cKcal / totMKcal * 100);
    const fatPct  = 100 - protPct - carbPct;

    return {
      diasData, nConRegistro: conReg.length,
      avgKcal, avgProt, avgCarb, avgFat, avgAdher,
      protPct, carbPct, fatPct,
      kcalTarget, protTarget, carbTarget, fatTarget, tieneMg: !!mg
    };
  }, [dias, perfil]);

  // ── SVG donut de 3 segmentos (rotate transform para posicionamiento preciso) ──
  const DonutChart = ({ p, c, f }) => {
    const r = 38, C = 2 * Math.PI * r;
    const pArc = C * p / 100, cArc = C * c / 100, fArc = C * f / 100;
    return (
      <svg viewBox="0 0 100 100" className="w-36 h-36">
        <circle cx="50" cy="50" r={r} fill="none" stroke={darkMode ? '#374151' : '#e5e7eb'} strokeWidth="15" />
        {p > 0 && <circle cx="50" cy="50" r={r} fill="none" stroke="#60a5fa" strokeWidth="15"
          strokeDasharray={`${pArc} ${C - pArc}`} transform="rotate(-90, 50, 50)" />}
        {c > 0 && <circle cx="50" cy="50" r={r} fill="none" stroke="#fbbf24" strokeWidth="15"
          strokeDasharray={`${cArc} ${C - cArc}`} transform={`rotate(${-90 + 360 * p / 100}, 50, 50)`} />}
        {f > 0 && <circle cx="50" cy="50" r={r} fill="none" stroke="#f87171" strokeWidth="15"
          strokeDasharray={`${fArc} ${C - fArc}`} transform={`rotate(${-90 + 360 * (p + c) / 100}, 50, 50)`} />}
        <text x="50" y="47" textAnchor="middle" fontSize="12" fontWeight="bold"
          fill={darkMode ? '#f9fafb' : '#111827'}>{datos.avgKcal > 0 ? datos.avgKcal.toLocaleString('es-CL') : '—'}</text>
        <text x="50" y="58" textAnchor="middle" fontSize="7"
          fill={darkMode ? '#9ca3af' : '#6b7280'}>kcal/día</text>
      </svg>
    );
  };

  if (datos.nConRegistro === 0) return (
    <div className={`rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-100'}`}>
      <EmptyState
        icon="fa-chart-pie"
        title="Sin datos para el período"
        desc="Marca tus comidas como consumidas en la vista «Hoy» para ver el historial nutricional aquí."
        darkMode={darkMode}
      />
    </div>
  );

  const card = `rounded-2xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-100 shadow-sm'}`;

  return (
    <div className="space-y-4 animate-fadeIn">

      {/* ── Selector de período + Export ── */}
      <div className="flex gap-2">
        <div className={`flex flex-1 rounded-xl p-1 gap-1 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          {[{d:7,l:'7 días'},{d:14,l:'2 semanas'},{d:30,l:'30 días'}].map(opt => (
            <button key={opt.d} onClick={() => setDias(opt.d)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                dias === opt.d
                  ? darkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-800 shadow-sm'
                  : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
              }`}>
              {opt.l}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            if (typeof window.exports !== 'undefined' && window.exports.logCSV) {
              window.exports.logCSV(dias);
            } else {
              alert('Módulo de exportación no disponible');
            }
          }}
          title="Exportar log como CSV"
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all flex-shrink-0 ${darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
          <i className="fas fa-download text-xs"></i>
          CSV
        </button>
      </div>

      {/* ── Promedios diarios + adherencia ── */}
      <div className={card}>
        <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          Promedio diario · {datos.nConRegistro} día{datos.nConRegistro !== 1 ? 's' : ''} con registro
        </p>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {[
            { label: 'Calorías',      val: datos.avgKcal, unit: 'kcal', tgt: datos.kcalTarget, color: 'var(--color-accent)', est: false },
            { label: 'Proteína',      val: datos.avgProt, unit: 'g',    tgt: datos.protTarget, color: '#60a5fa',             est: false },
            { label: 'Carbohidratos', val: datos.avgCarb, unit: 'g',    tgt: datos.carbTarget, color: '#fbbf24',             est: true  },
            { label: 'Grasa',         val: datos.avgFat,  unit: 'g',    tgt: datos.fatTarget,  color: '#f87171',             est: true  },
          ].map(item => (
            <div key={item.label} className={`rounded-xl p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className={`text-[10px] mb-0.5 flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {item.label}{item.est && <span className="opacity-50 text-[9px]">*</span>}
              </div>
              <div className="font-display text-xl font-bold leading-tight" style={{color: item.color}}>
                {item.val.toLocaleString('es-CL')}<span className="text-xs font-normal ml-0.5 opacity-70">{item.unit}</span>
              </div>
              {item.tgt && (
                <div className={`text-[10px] mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  obj {item.tgt}{item.unit} · <span style={{color: Math.abs(item.val/item.tgt - 1) < 0.1 ? 'var(--color-success)' : item.val < item.tgt ? '#fbbf24' : '#f87171'}}>
                    {item.val >= item.tgt ? '+' : ''}{Math.round((item.val/item.tgt - 1)*100)}%
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className={`flex items-center gap-2 pt-2.5 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <span className={`text-[11px] flex-shrink-0 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Adherencia período</span>
          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{background: darkMode ? '#374151' : '#e5e7eb'}}>
            <div className="h-full rounded-full transition-all duration-700" style={{width: datos.avgAdher + '%', backgroundColor: 'var(--color-accent)'}}></div>
          </div>
          <span className="font-display text-sm font-bold flex-shrink-0" style={{color: 'var(--color-accent)'}}>{datos.avgAdher}%</span>
        </div>
      </div>

      {/* ── Composición de macros — donut SVG + leyenda vertical ── */}
      <div className={card}>
        <p className={`text-[10px] font-bold uppercase tracking-widest mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          Composición de macros{datos.tieneMg && <span className={`ml-1 font-normal text-[9px] ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}> · C y G estimados*</span>}
        </p>
        {/* Donut centrado */}
        <div className="flex justify-center mb-4">
          <DonutChart p={datos.protPct} c={datos.carbPct} f={datos.fatPct} />
        </div>
        {/* Leyenda en 3 columnas — nunca overflows */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Proteína', pct: datos.protPct, g: datos.avgProt, color: '#60a5fa', bg: darkMode ? 'rgba(59,130,246,0.15)' : '#eff6ff' },
            { label: 'Carbos',   pct: datos.carbPct, g: datos.avgCarb, color: '#fbbf24', bg: darkMode ? 'rgba(245,158,11,0.15)' : '#fffbeb' },
            { label: 'Grasa',    pct: datos.fatPct,  g: datos.avgFat,  color: '#f87171', bg: darkMode ? 'rgba(248,113,113,0.15)' : '#fff1f2' },
          ].map(item => (
            <div key={item.label} className="rounded-xl p-3 text-center" style={{ background: item.bg }}>
              {/* Porcentaje grande */}
              <div className="font-display text-xl font-bold leading-none" style={{ color: item.color }}>
                {item.pct}%
              </div>
              {/* Label */}
              <div className={`text-[10px] font-semibold mt-1 mb-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {item.label}
              </div>
              {/* Gramos */}
              <div className="font-display text-xs font-medium" style={{ color: item.color }}>
                {item.g}g
              </div>
              {/* Mini barra */}
              <div className="w-full h-1 rounded-full overflow-hidden mt-2" style={{ background: darkMode ? '#374151' : '#e5e7eb' }}>
                <div className="h-full rounded-full" style={{ width: item.pct + '%', backgroundColor: item.color }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Kcal por día (barras horizontales) ── */}
      <div className={card}>
        <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Kcal por día</p>
        <div className="space-y-1.5">
          {datos.diasData.map(d => {
            if (!d.tieneRegistro) return null;
            const maxRef = datos.kcalTarget || datos.avgKcal || 1;
            const pct    = Math.min(115, Math.round(d.kcal / maxRef * 100));
            const barColor = datos.kcalTarget
              ? (d.kcal < datos.kcalTarget * 0.8 ? '#fbbf24' : d.kcal > datos.kcalTarget * 1.1 ? '#f87171' : 'var(--color-accent)')
              : 'var(--color-accent)';
            return (
              <div key={d.fecha} className="flex items-center gap-2">
                <span className={`text-[11px] w-12 flex-shrink-0 tabular-nums ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{d.label} {d.dia}</span>
                <div className="flex-1 h-4 rounded-full overflow-hidden" style={{background: darkMode ? '#374151' : '#f3f4f6'}}>
                  <div className="h-full rounded-full transition-all duration-500" style={{width: pct + '%', backgroundColor: barColor}}></div>
                </div>
                <span className={`font-display text-[11px] font-semibold w-20 text-right flex-shrink-0 tabular-nums ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {d.kcal.toLocaleString('es-CL')} kcal
                </span>
              </div>
            );
          })}
        </div>
        {datos.kcalTarget > 0 && (
          <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 pt-2.5 border-t text-[10px] ${darkMode ? 'border-gray-700 text-gray-500' : 'border-gray-100 text-gray-400'}`}>
            <span><span className="inline-block w-2 h-2 rounded-sm mr-1 align-middle" style={{backgroundColor: 'var(--color-accent)'}}></span>Objetivo · {datos.kcalTarget.toLocaleString('es-CL')} kcal</span>
            <span><span className="inline-block w-2 h-2 rounded-sm mr-1 align-middle bg-amber-400"></span>{'< 80%'}</span>
            <span><span className="inline-block w-2 h-2 rounded-sm mr-1 align-middle bg-rose-400"></span>{'> 110%'}</span>
          </div>
        )}
      </div>

      {datos.tieneMg && (
        <p className={`text-[10px] ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
          * Carbohidratos y grasa estimados según la proporción del plan. Solo proteína y kcal totales son valores exactos del registro.
        </p>
      )}
    </div>
  );
}

// =============================================
// COMPONENTE: FitnessTab (Entreno + Pasos + Roadmap + Registros + Nutrición)
// =============================================
function FitnessTab({ perfil, darkMode }) {
  const subs = [
    { k: 'entreno',   l: t('Entreno','Workout'),  icon: 'fa-dumbbell' },
    { k: 'pasos',     l: t('Pasos','Steps'),      icon: 'fa-person-walking' },
    { k: 'roadmap',   l: 'Roadmap',               icon: 'fa-route' },
    { k: 'metricas',  l: t('Registros','Logs'),   icon: 'fa-clipboard-list' },
    { k: 'nutricion', l: t('Nutrición','Nutrition'), icon: 'fa-chart-pie' }
  ];
  // N5: persistir sub-tab activa para no perder posición al navegar
  const [subVista, setSubVista] = React.useState(() => {
    const saved = localStorage.getItem('nutriplan_fitness_subtab');
    return saved && subs.some(s => s.k === saved) ? saved : 'entreno';
  });
  const cambiarSub = (k) => { setSubVista(k); localStorage.setItem('nutriplan_fitness_subtab', k); };
  const [refresh, setRefresh] = React.useState(0);

  const tieneRoadmapActivo = perfil && (perfil.roadmap || perfil.roadmapMantenimiento || perfil.roadmapVolumen);
  if (!tieneRoadmapActivo) {
    return (
      <div className={`rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-100'}`}>
        <EmptyState
          icon="fa-flask"
          title={t('Plan científico no configurado','Scientific plan not set up')}
          desc={t('Ve a tu perfil y configura tu objetivo (pérdida, mantenimiento o volumen) para ver tu roadmap y progreso.','Set your goal in your profile to see your roadmap and progress.')}
          darkMode={darkMode}
        />
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      {/* Sub-tab bar — horizontal scroll on mobile, no cramped grid */}
      <div className={`flex gap-1.5 mb-4 p-1 rounded-xl overflow-x-auto ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        {subs.map(s => (
          <button key={s.k} onClick={() => cambiarSub(s.k)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              subVista === s.k
                ? 'nav-pill-active'
                : darkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-white'
            }`}>
            <i className={`fas ${s.icon}`}></i>
            <span>{s.l}</span>
          </button>
        ))}
      </div>
      {subVista === 'entreno'   && <FLEntrenoView  perfil={perfil} darkMode={darkMode} refresh={refresh} onRefresh={() => setRefresh(r => r + 1)} />}
      {subVista === 'pasos'     && <FLPasosView    perfil={perfil} darkMode={darkMode} refresh={refresh} onRefresh={() => setRefresh(r => r + 1)} />}
      {subVista === 'roadmap'   && <FLRoadmapView  perfil={perfil} darkMode={darkMode} refresh={refresh} onGoToRegistros={() => cambiarSub('metricas')} />}
      {subVista === 'metricas'  && <FLMetricasView perfil={perfil} darkMode={darkMode} refresh={refresh} onRefresh={() => setRefresh(r => r + 1)} />}
      {subVista === 'nutricion' && <NutricionLogView perfil={perfil} darkMode={darkMode} />}
    </div>
  );
}

// =============================================
// COMPONENTE: CocinarTab (¿Qué cocino? + Crear receta + Preparar)
// =============================================
function CocinarTab({ darkMode, onRecipeClick, plan, factorComensales }) {
  const [subVista, setSubVista] = React.useState('buscar');
  const tienePlan = plan && typeof plan === 'object' && Object.keys(plan).some(k => k.startsWith('semana_'));
  const subs = [
    { k: 'buscar', l: '¿Qué cocino?', icon: 'fa-magnifying-glass' },
    { k: 'crear',  l: 'Crear receta', icon: 'fa-wand-magic-sparkles' },
    ...(tienePlan ? [{ k: 'preparar', l: 'Preparar', icon: 'fa-pot-food' }] : [])
  ];
  const cols = subs.length === 3 ? 'grid-cols-3' : 'grid-cols-2';
  return (
    <div className="animate-fadeIn">
      <div className={`grid ${cols} gap-2 mb-4`}>
        {subs.map(s => (
          <button key={s.k} onClick={() => setSubVista(s.k)}
            className={`py-2.5 px-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${
              subVista === s.k
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                : darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}>
            <i className={`fas ${s.icon}`}></i>{s.l}
          </button>
        ))}
      </div>
      {subVista === 'buscar'   && <ReverseSearch darkMode={darkMode} onRecipeClick={onRecipeClick} plan={plan} />}
      {subVista === 'crear'    && <RecipeGenerator darkMode={darkMode} onRecipeClick={onRecipeClick} />}
      {subVista === 'preparar' && <PrepararView darkMode={darkMode} plan={plan} factorComensales={factorComensales} />}
    </div>
  );
}

// ─── Sub-vista: Preparar (Batch Cooking + Comensales) ───
function PrepararView({ darkMode, plan, factorComensales }) {
  // Detectar semana activa (primera semana disponible del plan)
  const semanaActiva = React.useMemo(() => {
    if (!plan) return 1;
    const keys = Object.keys(plan).filter(k => k.startsWith('semana_')).map(k => parseInt(k.replace('semana_', ''))).sort((a,b) => a-b);
    return keys.length > 0 ? keys[0] : 1;
  }, [plan]);

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Comensales */}
      {typeof window.perfilesMulti !== 'undefined' && (
        <ComensalesPanel darkMode={darkMode} onChange={() => {}} />
      )}

      {/* Batch Cooking */}
      {typeof window.batchCooking !== 'undefined' && plan ? (
        <BatchCookingPanel planSemanal={plan} semanaActiva={semanaActiva} darkMode={darkMode} factorComensales={factorComensales || 1} />
      ) : (
        <div className={`rounded-xl p-5 text-center text-sm ${darkMode ? 'bg-gray-800 border border-gray-700 text-gray-400' : 'bg-gray-50 border border-gray-200 text-gray-500'}`}>
          <i className="fas fa-pot-food text-3xl text-amber-400 mb-3 block"></i>
          <div className={`font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Preparación en lote</div>
          <p>Genera un plan semanal primero para ver qué podés preparar en batch.</p>
        </div>
      )}
    </div>
  );
}

// ─── Sub-vista: Roadmap dinámico — conecta BodyComp + Training + Plateau + Alcohol ───
function FLRoadmapView({ perfil, darkMode, refresh, onGoToRegistros }) {
  const roadmap = perfil.roadmap;
  const faseInfo = (window.NP_FatLoss && window.NP_FatLoss.banner) ? window.NP_FatLoss.banner() : null;
  const progreso = (window.NP_BodyComp && window.NP_BodyComp.progreso) ? window.NP_BodyComp.progreso() : null;

  const [semana, setSemana] = React.useState(null);
  const [plateau, setPlateau] = React.useState(null);
  const [alcohol, setAlcohol] = React.useState(null);

  React.useEffect(() => {
    if (window.NP_Training && window.NP_Training.resumen7) setSemana(window.NP_Training.resumen7());
    if (window.NP_Plateau && window.NP_Plateau.detectar) setPlateau(window.NP_Plateau.detectar());
    if (window.NP_Alcohol && window.NP_Alcohol.impactoSemanal) setAlcohol(window.NP_Alcohol.impactoSemanal());
  }, [refresh]);

  const colorAlcohol = (nivel) => {
    if (nivel === 'critico') return 'bg-red-500 text-white';
    if (nivel === 'alto') return 'bg-orange-500 text-white';
    if (nivel === 'moderado') return 'bg-yellow-400 text-yellow-900';
    return 'bg-green-500 text-white';
  };

  return (
    <div className="space-y-4">

      {/* Dashboard semanal */}
      <div className={`rounded-2xl p-5 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100 shadow-sm'}`}>
        <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Esta semana</h3>
        <div className="grid grid-cols-3 gap-3">
          {/* Entrenamiento */}
          <div>
            <div className={`text-[11px] uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Entrenos</div>
            {semana && semana.entrenos > 0 ? (
              <>
                <div className={`text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {semana.completados}<span className={`text-sm font-normal ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>/{semana.entrenos}</span>
                </div>
                <div className={`text-xs ${semana.cumplimiento >= 75 ? 'text-green-500' : semana.cumplimiento >= 50 ? 'text-yellow-500' : 'text-red-400'}`}>
                  {semana.cumplimiento}% completados
                </div>
              </>
            ) : (
              <div className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sin registros</div>
            )}
          </div>

          {/* Tendencia peso */}
          <div>
            <div className={`text-[11px] uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Peso/sem</div>
            {progreso && progreso.tendencia && progreso.tendencia.deltaSemanal != null ? (
              <>
                <div className={`text-2xl font-extrabold ${
                  progreso.tendencia.deltaSemanal < 0 ? 'text-green-500'
                  : progreso.tendencia.deltaSemanal > 0 ? 'text-red-500'
                  : darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {progreso.tendencia.deltaSemanal > 0 ? '+' : ''}{progreso.tendencia.deltaSemanal}
                </div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  target: -{roadmap.calculados.tasaSemanal} kg
                </div>
              </>
            ) : (
              <div className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sin datos</div>
            )}
          </div>

          {/* Alcohol */}
          <div>
            <div className={`text-[11px] uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Alcohol</div>
            {alcohol ? (
              <>
                <div className={`text-xs font-bold px-2 py-0.5 rounded inline-block mt-1 ${colorAlcohol(alcohol.nivel)}`}>
                  {alcohol.nivel}
                </div>
                <div className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {alcohol._resumen.kcal} kcal · {alcohol._resumen.dias}d
                </div>
              </>
            ) : (
              <div className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sin registros</div>
            )}
          </div>
        </div>

        {/* Plateau badge — clickeable → lleva a Registros */}
        {plateau && plateau.plateau && (
          <button onClick={onGoToRegistros}
            className={`w-full mt-3 px-3 py-2 rounded-lg text-xs flex items-center gap-2 text-left transition-colors ${
              darkMode ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-800 hover:bg-yellow-900/50' : 'bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100'
            }`}>
            <i className="fas fa-triangle-exclamation flex-shrink-0"></i>
            <span>Meseta detectada · {plateau.diasVentana}d · {plateau.deltaSemanal} kg/sem</span>
            <span className="ml-auto flex-shrink-0 font-semibold underline">Ver protocolo →</span>
          </button>
        )}
      </div>

      {/* Progreso global */}
      {progreso && (
        <div className={`rounded-2xl p-5 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100 shadow-sm'}`}>
          <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Progreso global</h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div>
              <div className={`text-[11px] uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Inicial</div>
              <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{progreso.pesoInicial} kg</div>
              {progreso.bfInicial != null && <div className="text-xs text-gray-400">{progreso.bfInicial}% BF</div>}
            </div>
            <div>
              <div className="text-[11px] text-orange-500 uppercase font-bold tracking-wide">Actual{!progreso.pesoActualEsReal && ' (estim.)'}</div>
              <div className={`text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{progreso.pesoActual} kg</div>
              {progreso.bfActual != null && <div className="text-xs text-orange-500">{progreso.bfActual}% BF</div>}
            </div>
            <div>
              <div className={`text-[11px] uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Target</div>
              <div className={`text-xl font-bold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{progreso.pesoTarget} kg</div>
              {progreso.bfTarget != null && <div className="text-xs text-gray-400">{progreso.bfTarget}% BF</div>}
            </div>
          </div>
          <div className={`w-full h-3 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className="h-full transition-all"
              style={{ width: progreso.pctPeso + '%', backgroundImage: 'linear-gradient(to right, #f97316, #ef4444)' }}></div>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{progreso.kgPerdidos} kg perdidos</span>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{progreso.pctPeso}% del camino</span>
            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{progreso.kgRestantes} kg para target</span>
          </div>
        </div>
      )}
      {!progreso && (
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-amber-50 border border-amber-200'}`}>
          <div className={`text-sm font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-amber-800'}`}>
            <i className="fas fa-weight-scale mr-2 opacity-70"></i>Sin registros de peso aún
          </div>
          <p className={`text-xs mb-3 ${darkMode ? 'text-gray-400' : 'text-amber-700'}`}>
            Registra tu primer peso para ver tu avance real contra el plan.
          </p>
          <button onClick={onGoToRegistros}
            className="w-full py-2 rounded-lg text-xs font-semibold bg-orange-500 text-white hover:bg-orange-600 active:scale-[0.98] transition-all">
            <i className="fas fa-plus mr-1.5"></i>Registrar peso ahora
          </button>
        </div>
      )}

      {/* Fases del plan */}
      <div className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100 shadow-sm'}`}>
        <div className={`px-5 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <h3 className={`text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Fases del plan</h3>
          <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{roadmap.calculados.semanasTotales} semanas totales · {roadmap.calculados.cantDietBreaks} diet breaks · ~{roadmap.calculados.mesesTotales} meses</p>
        </div>
        <div className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
          {roadmap.fases.map((f, idx) => {
            const esActiva = faseInfo && faseInfo.numeroFase === f.numero;
            const esCompletada = faseInfo && f.numero < faseInfo.numeroFase;
            const esDietBreak = f.tipo === 'dietBreak';
            return (
              <div key={idx} className={`px-5 py-3 transition-colors ${
                esActiva
                  ? darkMode ? 'bg-orange-900/30 border-l-4 border-orange-500' : 'bg-orange-50 border-l-4 border-orange-500'
                  : esCompletada
                    ? darkMode ? 'opacity-50' : 'opacity-40'
                    : esDietBreak
                      ? darkMode ? 'bg-purple-900/10' : 'bg-purple-50/50'
                      : ''
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        esDietBreak
                          ? 'bg-purple-500 text-white'
                          : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}>Mes {f.mesInicio}{f.mesFin !== f.mesInicio ? '-'+f.mesFin : ''}</span>
                      <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{f.nombre}</span>
                      {esActiva && <span className="px-2 py-0.5 bg-orange-500 text-white text-[11px] font-bold rounded animate-pulse">ACTUAL</span>}
                      {esCompletada && <span className="px-1.5 py-0.5 bg-green-500 text-white text-[11px] font-bold rounded">✓</span>}
                      {esDietBreak && <i className="fas fa-pause-circle text-purple-500 text-xs"></i>}
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{f.foco}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-lg font-extrabold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{f.calorias}</div>
                    <div className={`text-[11px] uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>kcal · {f.targetPasos.toLocaleString()} pasos</div>
                    <div className={`text-[11px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{f.pesoInicio}→{f.pesoFin} kg</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Próximo hito */}
      {faseInfo && faseInfo.proximoHito && (
        <div className={`rounded-xl p-3 text-sm flex items-center gap-3 ${
          faseInfo.proximoHito.tipo === 'dietBreak'
            ? darkMode ? 'bg-purple-900/40 text-purple-200 border border-purple-700' : 'bg-purple-50 text-purple-700 border border-purple-200'
            : darkMode ? 'bg-blue-900/40 text-blue-200 border border-blue-700' : 'bg-blue-50 text-blue-700 border border-blue-200'
        }`}>
          <i className="fas fa-forward text-lg"></i>
          <div>
            <div className="font-semibold">Próximo: {faseInfo.proximoHito.nombre}</div>
            <div className="text-xs opacity-80">En {faseInfo.proximoHito.enDias} días</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Componente: WeightChart (SVG tendencia peso vs objetivo planificado) ───
function WeightChart({ perfil, entries, darkMode }) {
  const conPeso = entries.filter(e => e.peso != null).slice(-90);
  if (conPeso.length < 2 || !perfil || !perfil.roadmap) return null;

  const rm = perfil.roadmap;
  const pesoInicial = rm.inputs.peso;
  const pesoTarget = rm.calculados.pesoTarget;
  const tasaSemanal = rm.calculados.tasaSemanal || 0.5;
  const hoyIso = new Date().toISOString().split('T')[0];

  // X
  const t0 = new Date(conPeso[0].fecha + 'T12:00:00').getTime();
  const t1 = new Date(hoyIso + 'T12:00:00').getTime();
  const tRange = Math.max(t1 - t0, 86400000 * 14);

  // Y: incluye peso inicial + target para contexto completo
  const allP = conPeso.map(e => e.peso);
  const rawMax = Math.max(pesoInicial, ...allP);
  const rawMin = Math.min(pesoTarget, ...allP);
  const pad = Math.max((rawMax - rawMin) * 0.08, 0.4);
  const yTop = rawMax + pad;
  const yBot = rawMin - pad;
  const yRange = yTop - yBot;

  const W = 340, H = 130;
  const pL = 34, pR = 14, pT = 6, pB = 20;
  const cW = W - pL - pR, cH = H - pT - pB;

  const xOf = d => pL + Math.min(1, Math.max(0, (new Date(d + 'T12:00:00') - t0) / tRange)) * cW;
  const yOf = p => pT + ((yTop - p) / yRange) * cH;

  const pts = conPeso.map(e => [xOf(e.fecha), yOf(e.peso)]);
  const pathD = pts.map((p, i) => (i ? `L${p[0].toFixed(1)},${p[1].toFixed(1)}` : `M${p[0].toFixed(1)},${p[1].toFixed(1)}`)).join('');

  // Trayectoria planificada: desde peso inicial hasta hoy a -tasaSemanal/7 por día
  const diasHoy = Math.max(0, Math.round((new Date(hoyIso) - new Date(conPeso[0].fecha + 'T00:00:00')) / 86400000));
  const pesoPlaneadoHoy = Math.max(pesoTarget, pesoInicial - (tasaSemanal / 7) * diasHoy);
  const tx0 = xOf(conPeso[0].fecha), ty0 = yOf(Math.min(yTop - 0.01, pesoInicial));
  const tx1 = xOf(hoyIso), ty1 = yOf(Math.max(yBot + 0.01, pesoPlaneadoHoy));

  const step = yRange > 8 ? 2 : 1;
  const gridStart = Math.ceil((yBot + 0.01) / step) * step;
  const gridLevels = [];
  for (let v = gridStart; v <= yTop - 0.01; v += step) gridLevels.push(Math.round(v * 10) / 10);

  const gridC = darkMode ? '#374151' : '#e5e7eb';
  // TY4: #6b7280 (gray-500, contraste ≥4:1) en lugar de #9ca3af (gray-400, insuficiente)
  const labelC = darkMode ? '#6b7280' : '#6b7280';
  const targetC = darkMode ? '#22c55e' : '#16a34a';
  const planC = darkMode ? '#4b5563' : '#d1d5db';

  // A10/CH1: SVG accesible — title + role="img"
  const chartId = React.useId ? React.useId() : 'weight-chart';
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 'auto', display: 'block' }}
      role="img" aria-labelledby={`${chartId}-title`}>
      <title id={`${chartId}-title`}>Tendencia de peso: {conPeso[0].fecha} a {conPeso[conPeso.length - 1].fecha}</title>
      {gridLevels.map(v => {
        const y = yOf(v);
        if (y < pT - 2 || y > pT + cH + 2) return null;
        return (
          <g key={v}>
            <line x1={pL} y1={y} x2={W - pR} y2={y} stroke={gridC} strokeWidth="1" />
            <text x={pL - 3} y={y + 3.5} textAnchor="end" fontSize="8.5" fill={labelC}>{v}</text>
          </g>
        );
      })}

      {/* Target final (línea horizontal verde) */}
      <line x1={pL} y1={yOf(pesoTarget)} x2={W - pR} y2={yOf(pesoTarget)}
        stroke={targetC} strokeWidth="1.5" strokeDasharray="4 3" />

      {/* Trayectoria planificada (gris) */}
      <line x1={tx0} y1={ty0} x2={tx1} y2={ty1}
        stroke={planC} strokeWidth="1.5" strokeDasharray="5 3" />

      {/* Área bajo curva real */}
      <path
        d={`${pathD}L${pts[pts.length-1][0].toFixed(1)},${(pT+cH).toFixed(1)}L${pts[0][0].toFixed(1)},${(pT+cH).toFixed(1)}Z`}
        fill={darkMode ? 'rgba(249,115,22,0.07)' : 'rgba(249,115,22,0.05)'} />

      {/* Línea real */}
      <path d={pathD} fill="none" stroke="#f97316" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

      {/* Puntos */}
      {pts.map((p, i) => (
        <circle key={i} cx={p[0].toFixed(1)} cy={p[1].toFixed(1)} r="2.5"
          fill="#f97316" stroke={darkMode ? '#1f2937' : 'white'} strokeWidth="1.5" />
      ))}

      {/* Etiquetas X */}
      <text x={pts[0][0]} y={H - 3} textAnchor="middle" fontSize="8.5" fill={labelC}>{conPeso[0].fecha.slice(5)}</text>
      {pts.length > 1 && (
        <text x={pts[pts.length-1][0]} y={H - 3} textAnchor="middle" fontSize="8.5" fill={labelC}>{conPeso[conPeso.length-1].fecha.slice(5)}</text>
      )}
    </svg>
  );
}

// ─── Sub-vista: Métricas (log peso + medidas) ───
function FLMetricasView({ perfil, darkMode, refresh, onRefresh }) {
  const [pesoInput, setPesoInput] = React.useState('');
  const [medidas, setMedidas] = React.useState({ cintura: '', cuello: '', cadera: '', muslo: '' });
  const [mostrarMedidas, setMostrarMedidas] = React.useState(false);
  const [bfManualInput, setBfManualInput] = React.useState('');

  const entries = (window.NP_BodyComp && window.NP_BodyComp.cargar) ? window.NP_BodyComp.cargar() : [];
  const ultima = (window.NP_BodyComp && window.NP_BodyComp.ultima) ? window.NP_BodyComp.ultima(entries) : null;
  const tendencia = (window.NP_BodyComp && window.NP_BodyComp.tendencia) ? window.NP_BodyComp.tendencia(entries, 'peso') : null;
  const promedio7 = (window.NP_BodyComp && window.NP_BodyComp.promedio) ? window.NP_BodyComp.promedio(entries, 'peso', 7) : null;

  const hoy = new Date().toISOString().split('T')[0];
  const entradaHoy = entries.find(e => e.fecha === hoy);

  const registrarPeso = () => {
    if (!pesoInput || isNaN(parseFloat(pesoInput))) return;
    window.NP_BodyComp.registrar({
      fecha: hoy,
      peso: parseFloat(pesoInput),
      _genero: perfil.genero === 'femenino' ? 'F' : 'M',
      _altura: perfil.altura
    });
    setPesoInput('');
    onRefresh();
  };

  const registrarMedidas = () => {
    const body = { fecha: hoy, _genero: perfil.genero === 'femenino' ? 'F' : 'M', _altura: perfil.altura };
    if (medidas.cintura) body.cintura = parseFloat(medidas.cintura);
    if (medidas.cuello) body.cuello = parseFloat(medidas.cuello);
    if (medidas.cadera) body.cadera = parseFloat(medidas.cadera);
    if (medidas.muslo) body.muslo = parseFloat(medidas.muslo);
    if (bfManualInput) body.bf = parseFloat(bfManualInput);
    window.NP_BodyComp.registrar(body);
    setMedidas({ cintura: '', cuello: '', cadera: '', muslo: '' });
    setBfManualInput('');
    setMostrarMedidas(false);
    onRefresh();
  };

  const ultimas14 = entries.slice(-14).reverse();

  return (
    <div className="space-y-4">
      {/* Detector de meseta (v20260418af) */}
      <PlateauCard darkMode={darkMode} refresh={refresh} onRefresh={onRefresh} />

      {/* Registro rápido de peso */}
      <div className={`rounded-2xl p-5 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100 shadow-sm'}`}>
        <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Peso de hoy</h3>
        {entradaHoy && entradaHoy.peso != null ? (
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{entradaHoy.peso} kg</div>
              <div className="text-xs text-gray-400">Registrado hoy</div>
            </div>
            <button onClick={() => { window.NP_BodyComp.eliminar(hoy); onRefresh(); }}
              className={`text-xs px-3 py-1.5 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              <i className="fas fa-pen mr-1"></i>Cambiar
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input type="number" step="0.1" value={pesoInput} onChange={e => setPesoInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') registrarPeso(); }}
              className={`flex-1 px-4 py-3 rounded-xl border text-lg font-semibold ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200'}`}
              placeholder="Ej: 82.3" />
            <button onClick={registrarPeso} disabled={!pesoInput}
              className={`px-5 py-3 rounded-xl font-semibold ${pesoInput ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
              <i className="fas fa-check"></i>
            </button>
          </div>
        )}
      </div>

      {/* Promedio + tendencia */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100 shadow-sm'}`}>
          <div className="text-[11px] text-gray-400 uppercase font-bold">Promedio 7 días</div>
          <div className={`text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{promedio7 != null ? promedio7 + ' kg' : '—'}</div>
        </div>
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100 shadow-sm'}`}>
          <div className="text-[11px] text-gray-400 uppercase font-bold">Tendencia 14d</div>
          <div className={`text-2xl font-extrabold ${tendencia && tendencia.deltaSemanal != null ? (tendencia.deltaSemanal < 0 ? 'text-green-500' : tendencia.deltaSemanal > 0 ? 'text-red-500' : 'text-gray-400') : 'text-gray-400'}`}>
            {tendencia && tendencia.deltaSemanal != null ? (tendencia.deltaSemanal > 0 ? '+' : '') + tendencia.deltaSemanal + ' kg/sem' : '—'}
          </div>
        </div>
      </div>

      {/* Gráfico tendencia peso */}
      {entries.filter(e => e.peso != null).length >= 2 && (
        <div className={`rounded-2xl p-4 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100 shadow-sm'}`}>
          <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Tendencia de peso</h3>
          <WeightChart perfil={perfil} entries={entries} darkMode={darkMode} />
          {/* TY4: #6b7280 (gray-500) en lugar de #9ca3af (gray-400, contraste insuficiente), 11px mínimo */}
          <div className="flex items-center gap-5 mt-2" style={{ color: '#6b7280', fontSize: '11px' }}>
            <span className="flex items-center gap-1.5">
              <svg width="16" height="4"><line x1="0" y1="2" x2="16" y2="2" stroke="#f97316" strokeWidth="2"/></svg>Real
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="16" height="4"><line x1="0" y1="2" x2="16" y2="2" stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="4 2"/></svg>Plan
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="16" height="4"><line x1="0" y1="2" x2="16" y2="2" stroke="#16a34a" strokeWidth="1.5" strokeDasharray="4 2"/></svg>Target
            </span>
          </div>
        </div>
      )}

      {/* Medidas + BF */}
      <div className={`rounded-2xl p-5 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100 shadow-sm'}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Medidas (semanal)</h3>
          <button onClick={() => setMostrarMedidas(!mostrarMedidas)}
            className={`text-xs px-3 py-1.5 rounded-lg ${mostrarMedidas ? 'bg-orange-500 text-white' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
            {mostrarMedidas ? 'Cancelar' : '+ Registrar'}
          </button>
        </div>
        {mostrarMedidas ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Cintura (cm)</label>
                <input type="number" step="0.5" value={medidas.cintura} onChange={e => setMedidas({...medidas, cintura: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border text-sm mt-1 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`} placeholder={perfil.cintura || '85'} />
              </div>
              <div>
                <label className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Cuello (cm)</label>
                <input type="number" step="0.5" value={medidas.cuello} onChange={e => setMedidas({...medidas, cuello: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border text-sm mt-1 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`} placeholder={perfil.cuello || '40'} />
              </div>
              {perfil.genero === 'femenino' && (
                <div>
                  <label className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Cadera (cm)</label>
                  <input type="number" step="0.5" value={medidas.cadera} onChange={e => setMedidas({...medidas, cadera: e.target.value})}
                    className={`w-full px-3 py-2 rounded-lg border text-sm mt-1 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`} placeholder="95" />
                </div>
              )}
              <div>
                <label className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Muslo (cm)</label>
                <input type="number" step="0.5" value={medidas.muslo} onChange={e => setMedidas({...medidas, muslo: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border text-sm mt-1 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`} placeholder="55" />
              </div>
              <div className="col-span-2">
                <label className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>BF% manual (opcional — sino se calcula Navy)</label>
                <input type="number" step="0.1" value={bfManualInput} onChange={e => setBfManualInput(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border text-sm mt-1 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`} placeholder="Ej: 18.5" />
              </div>
            </div>
            <button onClick={registrarMedidas}
              className="w-full py-2.5 rounded-xl font-semibold bg-gradient-to-r from-orange-500 to-red-500 text-white">
              <i className="fas fa-check mr-2"></i>Guardar medidas
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 text-sm">
            {['cintura', 'cuello', 'cadera', 'muslo'].map(campo => {
              const last = window.NP_BodyComp.ultima(entries, campo);
              if (perfil.genero !== 'femenino' && campo === 'cadera') return null;
              return (
                <div key={campo} className={`rounded-lg p-2 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <div className="text-[11px] text-gray-400 uppercase">{campo}</div>
                  <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{last && last[campo] != null ? last[campo] + ' cm' : '—'}</div>
                </div>
              );
            })}
            {(() => {
              const lastBF = window.NP_BodyComp.ultima(entries, 'bf');
              return (
                <div className={`col-span-2 rounded-lg p-2 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <div className="text-[11px] text-gray-400 uppercase">BF%</div>
                  <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {lastBF && lastBF.bf != null ? lastBF.bf + '%' : '—'}
                    {lastBF && lastBF.bfCalculado != null && lastBF.bf !== lastBF.bfCalculado && (
                      <span className="text-[11px] text-gray-400 ml-2">(Navy: {lastBF.bfCalculado}%)</span>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Alcohol card (v20260418ag) */}
      <AlcoholCard darkMode={darkMode} refresh={refresh} onRefresh={onRefresh} />

      {/* Historial */}
      {ultimas14.length > 0 && (
        <div className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100 shadow-sm'}`}>
          <div className={`px-5 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Últimas 14 entradas</h3>
          </div>
          <div className={`divide-y text-sm ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
            {ultimas14.map((e, i) => (
              <div key={i} className={`px-5 py-2 flex items-center justify-between ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <span className="text-xs text-gray-400">{e.fecha}</span>
                <div className="flex items-center gap-3">
                  {e.peso != null && <span><b>{e.peso}</b> kg</span>}
                  {e.bf != null && <span className="text-xs text-gray-400">{e.bf}% BF</span>}
                  {e.cintura != null && <span className="text-xs text-gray-400">C:{e.cintura}</span>}
                  <button onClick={() => { if (window.confirm('¿Borrar el registro del ' + e.fecha + '?')) { window.NP_BodyComp.eliminar(e.fecha); onRefresh(); } }}
                    className="text-xs text-red-400 hover:text-red-600">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Componente: PlateauCard (detector + protocolo 6 pasos) ───
// Mapa de acción contextual por paso: destino de navegación + label
const _PLATEAU_ACCIONES = {
  1: { label: 'Ver mi plan semanal',         icon: 'fa-calendar-days',   destino: 'plan' },
  2: { label: 'Ver mis pasos de hoy',        icon: 'fa-person-walking',  destino: 'fitness' },
  3: { label: 'Buscar recetas bajas en carbos', icon: 'fa-magnifying-glass', destino: 'cocinar' },
  4: { label: 'Ver plan de esta semana',     icon: 'fa-calendar-days',   destino: 'plan' },
  5: { label: 'Ajustar calorías en perfil',  icon: 'fa-sliders',         destino: 'perfil' },
  6: { label: 'Ver entreno de hoy',          icon: 'fa-dumbbell',        destino: 'fitness' },
};

function PlateauCard({ darkMode, refresh, onRefresh }) {
  const [verProtocolo, setVerProtocolo] = React.useState(false);

  if (!window.NP_Plateau) return null;
  const est = window.NP_Plateau.estado();
  const protocolo = window.NP_Plateau.protocolo();

  if (!est.deteccion.datosSuficientes && est.pasoActual === 0) {
    return (
      <div className={`rounded-xl p-4 text-sm ${darkMode ? 'bg-gray-800 text-gray-500 border border-gray-700' : 'bg-gray-50 text-gray-500 border border-gray-200'}`}>
        <i className="fas fa-radar mr-2"></i>
        Detector de meseta: necesita ≥14 días de peso registrado para activarse.
      </div>
    );
  }

  const hayPlateau = est.deteccion.plateau;
  const hayPasoActivo = est.pasoActual > 0;
  const delta = est.deteccion.deltaSemanal;
  const esSugerencia = est.sugerenciaInicio;

  const aplicarPaso1 = () => {
    window.NP_Plateau.aplicarPaso(1);
    onRefresh();
  };
  const avanzar = () => {
    window.NP_Plateau.avanzarPaso();
    onRefresh();
  };
  const resolver = () => {
    if (window.confirm('¿Este paso rompió la meseta? Se archivará como "funcionó" y saldrás del protocolo.')) {
      window.NP_Plateau.marcarResuelto();
      onRefresh();
    }
  };
  const cancelar = () => {
    if (window.confirm('¿Cancelar seguimiento del protocolo sin marcarlo como resuelto?')) {
      window.NP_Plateau.cancelar();
      onRefresh();
    }
  };

  // Color del banner según estado
  let bannerCls, iconCls, ribbon;
  if (hayPasoActivo) {
    bannerCls = darkMode ? 'bg-amber-900/30 border-amber-700' : 'bg-amber-50 border-amber-300';
    iconCls = 'text-amber-500';
    ribbon = 'PROTOCOLO ACTIVO';
  } else if (hayPlateau) {
    bannerCls = darkMode ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-300';
    iconCls = 'text-red-500';
    ribbon = 'MESETA DETECTADA';
  } else {
    bannerCls = darkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200';
    iconCls = 'text-green-500';
    ribbon = 'PROGRESO NORMAL';
  }

  return (
    <div className={`rounded-2xl p-5 border ${bannerCls}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <i className={`fas fa-radar ${iconCls}`}></i>
          <span className={`text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Detector de meseta</span>
        </div>
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${iconCls} ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>{ribbon}</span>
      </div>

      {/* Stats de detección */}
      {est.deteccion.datosSuficientes && (
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div>
            <div className="text-[11px] text-gray-400 uppercase font-bold">Δ semanal</div>
            <div className={`text-2xl font-extrabold ${delta == null ? 'text-gray-400' : delta < -0.25 ? 'text-green-500' : delta > 0.25 ? 'text-red-500' : 'text-amber-500'}`}>
              {delta == null ? '—' : (delta > 0 ? '+' : '') + delta}
              {delta != null && <span className="text-sm font-semibold opacity-70 ml-0.5">kg</span>}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-gray-400 uppercase font-bold">Ventana</div>
            <div className={`text-2xl font-extrabold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{est.deteccion.diasVentana}<span className="text-sm font-semibold opacity-70 ml-0.5">d</span></div>
          </div>
          <div>
            <div className="text-[11px] text-gray-400 uppercase font-bold">Umbral</div>
            <div className={`text-sm font-bold mt-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>±0.25 kg/sem</div>
          </div>
        </div>
      )}

      {/* Paso activo */}
      {hayPasoActivo && est.pasoDef && (
        <div className={`rounded-lg p-4 mb-3 ${darkMode ? 'bg-gray-900/40' : 'bg-white/70'}`}>
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500 text-white`}>PASO {est.pasoActual}/6</span>
                <span className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{est.pasoDef.accion}</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Día {est.diasEnPaso} · Duración sugerida: {est.pasoDef.duracion}
              </div>
            </div>
          </div>
          <div className={`text-sm mt-2 leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{est.pasoDef.detalle}</div>

          {/* Acción contextual por paso */}
          {_PLATEAU_ACCIONES[est.pasoActual] && window._NP_nav && (
            <button
              onClick={() => window._NP_nav(_PLATEAU_ACCIONES[est.pasoActual].destino)}
              className={`w-full mt-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 ${
                darkMode ? 'bg-gray-700 text-orange-300 hover:bg-gray-600 border border-gray-600' : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200'
              }`}>
              <i className={`fas ${_PLATEAU_ACCIONES[est.pasoActual].icon}`}></i>
              {_PLATEAU_ACCIONES[est.pasoActual].label}
              <i className="fas fa-arrow-right ml-auto text-xs opacity-50"></i>
            </button>
          )}

          <div className="flex gap-2 mt-2">
            <button onClick={resolver}
              className="flex-1 py-2 rounded-lg text-sm font-semibold bg-green-500 text-white hover:bg-green-600">
              <i className="fas fa-check mr-1"></i>Funcionó
            </button>
            {est.pasoActual < 6 && (
              <button onClick={avanzar}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold ${darkMode ? 'bg-amber-600 text-white hover:bg-amber-700' : 'bg-amber-500 text-white hover:bg-amber-600'}`}>
                <i className="fas fa-forward mr-1"></i>Paso {est.pasoActual + 1}
              </button>
            )}
            <button onClick={cancelar}
              className={`px-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      )}

      {/* Sugerencia de iniciar protocolo */}
      {esSugerencia && !hayPasoActivo && (
        <div className={`rounded-lg p-4 mb-3 ${darkMode ? 'bg-red-900/40' : 'bg-white/70'}`}>
          <div className={`text-sm mb-3 leading-relaxed ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Tu peso lleva ≥14 días dentro del umbral de meseta. Aplica el primer paso del protocolo antes de tocar calorías: <b>auditar tracking</b>.
          </div>
          <button onClick={aplicarPaso1}
            className="w-full py-2 rounded-lg text-sm font-semibold bg-red-500 text-white hover:bg-red-600">
            <i className="fas fa-play mr-2"></i>Iniciar protocolo — Paso 1
          </button>
        </div>
      )}

      {/* Estado normal */}
      {!hayPasoActivo && !esSugerencia && est.deteccion.datosSuficientes && (
        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Sin meseta. El peso se mueve a {delta > 0 ? '+' : ''}{delta} kg/sem — fuera del rango de estancamiento.
        </div>
      )}

      {/* Toggle protocolo completo */}
      <button onClick={() => setVerProtocolo(!verProtocolo)}
        className={`w-full mt-3 text-xs py-2 rounded ${darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-white'}`}>
        <i className={`fas fa-chevron-${verProtocolo ? 'up' : 'down'} mr-1`}></i>
        {verProtocolo ? 'Ocultar' : 'Ver'} protocolo completo (6 pasos)
      </button>

      {verProtocolo && (
        <div className="mt-2 space-y-2">
          {protocolo.map(p => {
            const esActivo = p.paso === est.pasoActual;
            const esHistorico = (est.historial || []).some(h => h.paso === p.paso);
            return (
              <div key={p.paso} className={`rounded-lg p-3 ${
                esActivo
                  ? darkMode ? 'bg-amber-900/40 border border-amber-700' : 'bg-amber-100 border border-amber-300'
                  : esHistorico
                    ? darkMode ? 'bg-gray-900/60 opacity-60' : 'bg-gray-100 opacity-70'
                    : darkMode ? 'bg-gray-900/40' : 'bg-white/60'
              }`}>
                <div className="flex items-center justify-between mb-1.5 gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      esActivo ? 'bg-amber-500 text-white' : darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'
                    }`}>PASO {p.paso}</span>
                    <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{p.accion}</span>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">{p.duracion}</span>
                </div>
                <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm leading-relaxed`}>{p.detalle}</div>
                {!esActivo && !esHistorico && hayPasoActivo && p.paso > est.pasoActual && (
                  <button onClick={() => {
                    const omitidos = p.paso - est.pasoActual - 1;
                    const msg = omitidos > 0
                      ? `¿Saltar al paso ${p.paso}? Se omitirán ${omitidos} paso${omitidos > 1 ? 's' : ''} del protocolo (${est.pasoActual + 1}${omitidos > 1 ? `–${p.paso - 1}` : ''}).`
                      : `¿Saltar al paso ${p.paso}?`;
                    if (window.confirm(msg)) { window.NP_Plateau.aplicarPaso(p.paso); onRefresh(); }
                  }}
                    className={`mt-2 text-xs px-3 py-1.5 rounded ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                    Saltar a este paso →
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Componente: AlcoholCard (log bebidas + impacto semanal) ───
function AlcoholCard({ darkMode, refresh, onRefresh }) {
  const [expandido, setExpandido] = React.useState(false);
  const [modoCustom, setModoCustom] = React.useState(false);
  const [mostrarMas, setMostrarMas] = React.useState(false);
  const [customMl, setCustomMl] = React.useState('');
  const [customPct, setCustomPct] = React.useState('');
  const [customNombre, setCustomNombre] = React.useState('');
  // N16: date selector — defaults to today
  const [fechaBebida, setFechaBebida] = React.useState(() => new Date().toISOString().split('T')[0]);

  if (!window.NP_Alcohol) return null;
  const resumen = window.NP_Alcohol.resumen7();
  const impacto = window.NP_Alcohol.impactoSemanal();
  const pausaH = window.NP_Alcohol.pausaOxidacionRestante();
  const presets = window.NP_Alcohol.presets();

  const debeExpandir = expandido || resumen.tragos > 0;

  const agregar = (preset) => {
    // N16: pass selected date
    window.NP_Alcohol.registrar({ bebida: preset.nombre, ml: preset.ml, kcal: preset.kcal, alcohol_pct: preset.alcohol_pct, fecha: fechaBebida });
    onRefresh();
  };

  const agregarCustom = () => {
    const ml = parseFloat(customMl);
    const pct = parseFloat(customPct);
    if (!ml || !pct) return;
    const kcal = window.NP_Alcohol.calcularKcalAlcohol(ml, pct);
    // N16: pass selected date
    window.NP_Alcohol.registrar({ bebida: customNombre || 'Personalizada', ml, alcohol_pct: pct, kcal, fecha: fechaBebida });
    setCustomMl(''); setCustomPct(''); setCustomNombre(''); setModoCustom(false);
    onRefresh();
  };

  const kcalCustomPreview = (customMl && customPct)
    ? window.NP_Alcohol.calcularKcalAlcohol(parseFloat(customMl), parseFloat(customPct))
    : null;

  const badgeNivel = impacto ? ({
    minimo:   'bg-green-500 text-white',
    moderado: 'bg-yellow-400 text-yellow-900',
    alto:     'bg-orange-500 text-white',
    critico:  'bg-red-500 text-white'
  }[impacto.nivel]) : '';

  if (!debeExpandir) {
    return (
      <button onClick={() => setExpandido(true)}
        className={`w-full rounded-2xl p-5 flex items-center justify-between border transition-colors ${darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-100 shadow-sm hover:bg-gray-50'}`}>
        <div className="flex items-center gap-2">
          <i className={`fas fa-wine-glass ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}></i>
          <span className={`text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Alcohol · últimos 7 días</span>
        </div>
        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>+ Registrar <i className="fas fa-chevron-down ml-1"></i></span>
      </button>
    );
  }

  // AN1: animate-fadeIn en el panel expandido para evitar el salto brusco
  return (
    <div className={`rounded-2xl overflow-hidden animate-fadeIn ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100 shadow-sm'}`}>

      {/* Header */}
      <div className={`px-5 py-3 border-b flex items-center justify-between ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
        <div className="flex items-center gap-2">
          <i className={`fas fa-wine-glass ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}></i>
          <h3 className={`text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Alcohol · últimos 7 días</h3>
        </div>
        {impacto && (
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase ${badgeNivel}`}>{impacto.nivel}</span>
        )}
      </div>

      <div className="p-5 space-y-4">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <div className={`text-[11px] uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Tragos</div>
            <div className={`text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{resumen.tragos}</div>
          </div>
          <div>
            <div className={`text-[11px] uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Kcal</div>
            <div className={`text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{resumen.kcal}</div>
          </div>
          <div>
            <div className={`text-[11px] uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Días activos</div>
            <div className={`text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {resumen.dias}<span className={`text-sm font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>/7</span>
            </div>
          </div>
        </div>

        {/* Impacto fisiológico */}
        {impacto && (
          <div className={`rounded-xl p-4 space-y-3 ${darkMode ? 'bg-gray-700/40' : 'bg-gray-50'}`}>
            <div className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{impacto.escenario}</div>
            <div className="grid grid-cols-2 gap-2">
              <div className={`rounded-lg p-3 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100 shadow-sm'}`}>
                <div className={`text-[11px] uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Oxidación grasa</div>
                <div className={`text-base font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>pausada {impacto.horasPausaOxidacion}h</div>
                {pausaH > 0 && <div className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{pausaH}h restantes</div>}
              </div>
              <div className={`rounded-lg p-3 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100 shadow-sm'}`}>
                <div className={`text-[11px] uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Síntesis proteica</div>
                <div className={`text-base font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{impacto.impactoSintesisProteica}</div>
              </div>
            </div>
            <div className={`text-sm border-l-2 pl-3 ${darkMode ? 'text-gray-300 border-gray-600' : 'text-gray-600 border-gray-300'}`}>
              {impacto.estrategia}
            </div>
          </div>
        )}

        {/* Registrar bebida */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className={`text-xs uppercase font-bold tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Registrar bebida</div>
            {/* N16: date selector */}
            <input type="date" value={fechaBebida} onChange={e => setFechaBebida(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className={`text-xs px-2 py-1 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-white border-gray-200 text-gray-600'}`} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {presets.slice(0, 6).map((p, i) => (
              <button key={i} onClick={() => agregar(p)}
                className={`text-left px-3 py-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-700/50 hover:bg-gray-700 text-gray-200' : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'}`}>
                <div className="text-sm font-semibold truncate">{p.nombre}</div>
                <div className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{p.ml} ml · {p.kcal} kcal</div>
              </button>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <button onClick={() => setModoCustom(!modoCustom)}
              className={`flex-1 text-sm py-2 rounded-lg font-semibold ${modoCustom ? 'bg-orange-500 text-white' : darkMode ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-700' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
              {modoCustom ? 'Cancelar' : '+ Custom (ml + %)'}
            </button>
            {presets.length > 6 && (
              <button onClick={() => setMostrarMas(!mostrarMas)}
                className={`flex-1 text-sm py-2 rounded-lg font-semibold ${darkMode ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-700' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
                {mostrarMas ? 'Menos' : `Más (${presets.length - 6})`} <i className={`fas fa-chevron-${mostrarMas ? 'up' : 'down'} text-xs ml-1`}></i>
              </button>
            )}
          </div>
        </div>

        {/* Más bebidas (expandido inline) */}
        {mostrarMas && presets.length > 6 && (
          <div className="grid grid-cols-2 gap-2">
            {presets.slice(6).map((p, i) => (
              <button key={i} onClick={() => { agregar(p); setMostrarMas(false); }}
                className={`text-left px-3 py-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-700/50 hover:bg-gray-700 text-gray-200' : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'}`}>
                <div className="text-sm font-semibold truncate">{p.nombre}</div>
                <div className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{p.ml} ml · {p.kcal} kcal</div>
              </button>
            ))}
          </div>
        )}

        {/* Custom form */}
        {modoCustom && (
          <div className={`rounded-xl p-3 ${darkMode ? 'bg-gray-700/40 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
            <input type="text" value={customNombre} onChange={e => setCustomNombre(e.target.value)}
              placeholder="Nombre (opcional)"
              className={`w-full px-3 py-2 rounded-lg border text-sm mb-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-200'}`} />
            <div className="grid grid-cols-2 gap-2">
              <input type="text" inputMode="decimal" value={customMl}
                onChange={e => setCustomMl(e.target.value.replace(',', '.'))}
                placeholder="ml"
                className={`px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-200'}`} />
              <input type="text" inputMode="decimal" value={customPct}
                onChange={e => setCustomPct(e.target.value.replace(',', '.'))}
                placeholder="% alcohol"
                className={`px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-200'}`} />
            </div>
            {kcalCustomPreview != null && (
              <div className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                ≈ <b>{kcalCustomPreview} kcal</b> (solo alcohol puro, sin mezcladores)
              </div>
            )}
            <button onClick={agregarCustom} disabled={!customMl || !customPct}
              className={`w-full mt-2 py-2 rounded-lg text-sm font-semibold ${customMl && customPct ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
              Registrar
            </button>
          </div>
        )}

        {/* Log 7d */}
        {resumen.entries.length > 0 && (
          <div className={`rounded-xl overflow-hidden border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <div className={`px-4 py-2 border-b text-xs uppercase font-bold tracking-wider ${darkMode ? 'bg-gray-700/30 border-gray-700 text-gray-400' : 'bg-gray-50 border-gray-100 text-gray-500'}`}>
              Log 7d
            </div>
            <div className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
              {resumen.entries.slice().reverse().map(e => (
                <div key={e.id} className={`px-4 py-2.5 flex items-center justify-between ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <div className="flex-1 min-w-0">
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{e.fecha}</span>
                    <span className="ml-2 text-sm font-semibold">{e.bebida}</span>
                    <span className={`ml-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>({e.ml} ml)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{e.kcal} kcal</span>
                    <button onClick={() => { if (window.confirm('¿Borrar este registro de ' + e.bebida + '?')) { window.NP_Alcohol.eliminar(e.id); onRefresh(); } }}
                      className="text-red-400 hover:text-red-600 text-sm">
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* T7: py-3 (era py-2.5, ~34px efectivo — ahora ~40px) */}
      <button onClick={() => setExpandido(false)}
        className={`w-full py-3 text-xs border-t transition-colors ${darkMode ? 'border-gray-700 text-gray-500 hover:text-gray-300' : 'border-gray-100 text-gray-400 hover:text-gray-600'}`}>
        <i className="fas fa-chevron-up mr-1"></i>Colapsar
      </button>
    </div>
  );
}

// ─── Sub-vista: Pasos ───
function FLPasosView({ perfil, darkMode, refresh, onRefresh }) {
  const [pasosInput, setPasosInput] = React.useState('');

  const hoy = (window.NP_Steps && window.NP_Steps.hoy) ? window.NP_Steps.hoy() : { pasos: 0, target: null };
  const target = (window.NP_Steps && window.NP_Steps.targetHoy) ? window.NP_Steps.targetHoy() : null;
  const prom7 = (window.NP_Steps && window.NP_Steps.promedio7) ? window.NP_Steps.promedio7() : 0;
  const racha = (window.NP_Steps && window.NP_Steps.racha) ? window.NP_Steps.racha() : 0;
  const ultimos = (window.NP_Steps && window.NP_Steps.ultimos) ? window.NP_Steps.ultimos(14) : [];

  const setPasos = (n) => {
    window.NP_Steps.registrar(null, n, target);
    setPasosInput('');
    onRefresh();
  };
  const sumar = (n) => {
    window.NP_Steps.sumar(n, target);
    onRefresh();
  };

  const pct = target ? Math.min(100, (hoy.pasos / target) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Hoy */}
      <div className={`rounded-2xl p-5 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100 shadow-sm'}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Hoy</h3>
          <span className="text-xs text-gray-400">Target: <b className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{target ? target.toLocaleString() : '—'}</b></span>
        </div>
        <div className={`text-5xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-800'} text-center mb-3`}>
          {hoy.pasos.toLocaleString()}
        </div>
        {target > 0 && (
          <>
            <div className={`w-full h-3 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="h-full transition-all"
                style={{
                  width: pct + '%',
                  backgroundImage: pct >= 100
                    ? 'linear-gradient(to right, #22c55e, #10b981)'
                    : 'linear-gradient(to right, #f97316, #ef4444)'
                }}></div>
            </div>
            <div className="text-center text-xs mt-1 text-gray-400">{Math.round(pct)}% del target{pct >= 100 ? ' ✓' : ''}</div>
          </>
        )}
        <div className="flex gap-2 mt-4">
          {[1000, 2000, 5000].map(n => (
            <button key={n} onClick={() => sumar(n)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              +{n.toLocaleString()}
            </button>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <input type="number" value={pasosInput} onChange={e => setPasosInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && pasosInput) setPasos(parseInt(pasosInput)); }}
            className={`flex-1 px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200'}`}
            placeholder="Set exacto (ej: 8450)" />
          <button onClick={() => pasosInput && setPasos(parseInt(pasosInput))} disabled={!pasosInput}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${pasosInput ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
            Set
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100 shadow-sm'}`}>
          <div className="text-[11px] text-gray-400 uppercase font-bold">Promedio 7 días</div>
          <div className={`text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{prom7.toLocaleString()}</div>
        </div>
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100 shadow-sm'}`}>
          <div className="text-[11px] text-gray-400 uppercase font-bold">Racha actual</div>
          <div className={`text-2xl font-extrabold ${racha > 0 ? 'text-orange-500' : darkMode ? 'text-white' : 'text-gray-800'}`}>
            {racha} {racha === 1 ? 'día' : 'días'}{racha >= 3 ? <i className="fas fa-fire text-orange-400 ml-1 text-lg"></i> : null}
          </div>
        </div>
      </div>

      {/* Historial 14d */}
      {ultimos.length === 0 && (
        <div className={`rounded-xl p-5 text-center text-sm ${darkMode ? 'bg-gray-800 border border-gray-700 text-gray-400' : 'bg-gray-50 border border-gray-200 text-gray-500'}`}>
          <i className="fas fa-person-walking text-2xl mb-2 block opacity-40"></i>
          Aún no registraste pasos. Usa los botones de arriba para empezar.
        </div>
      )}
      {ultimos.length > 0 && (
        <div className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100 shadow-sm'}`}>
          <div className={`px-5 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Últimos 14 días</h3>
          </div>
          <div className={`divide-y text-sm ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
            {ultimos.slice().reverse().map((e, i) => {
              const tgt = e.target || 8000;
              const pctDia = Math.min(100, (e.pasos / tgt) * 100);
              const cumplido = e.pasos >= tgt;
              return (
                <div key={i} className="px-5 py-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">{e.fecha}</span>
                    <span className={`text-sm font-bold ${cumplido ? 'text-green-500' : darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {e.pasos.toLocaleString()} {cumplido && '✓'}
                    </span>
                  </div>
                  <div className={`w-full h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <div className={`h-full ${cumplido ? 'bg-green-500' : 'bg-orange-500'}`} style={{ width: pctDia + '%' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Helper: mapear campo equipo → id de equipamiento ───
function getEquipoId(equipo) {
  if (!equipo) return 'peso_corporal';
  const e = equipo.toLowerCase();
  if (e.includes('speediance') || e.includes('cable machine') || e.includes('cable')) return 'speediance';
  if (e.includes('treadmill') || e.includes('cinta')) return 'treadmill_plano';
  if (e.includes('remadora') || e.includes('remo') || e.includes('rowing')) return 'remadora';
  if (e.includes('bicicleta') || e.includes('bike')) return 'bicicleta';
  if (e.includes('eliptica') || e.includes('elíptica')) return 'eliptica';
  if (e.includes('mancuerna') || e.includes('dumbbell')) return 'mancuernas';
  if (e.includes('kettlebell') || e.includes('pesa rusa')) return 'kettlebell';
  if (e.includes('barra olímpica') || e.includes('barbell')) return 'barra_olimpica';
  if (e.includes('barra ez')) return 'barra_ez';
  if (e.includes('trx') || e.includes('suspensión') || e.includes('suspension')) return 'trx';
  if (e.includes('banda') || e.includes('band')) return 'bandas';
  if (e.includes('multiestacion') || e.includes('multifuncion')) return 'multiestacion';
  if (e.includes('banco')) return 'banco';
  if (e.includes('rueda')) return 'rueda_abdominal';
  if (e === 'barra' || e.includes('dominadas') || e.includes('pull-up')) return 'barra';
  return 'peso_corporal';
}

function leerEquipos() {
  try {
    const g = JSON.parse(localStorage.getItem('nutriplan_equipos'));
    return Array.isArray(g) ? g : ['peso_corporal'];
  } catch (err) { return ['peso_corporal']; }
}

// ─── Componente: selector de equipamiento disponible ───
function EquipamientoCard({ darkMode, onEquiposChange, onRefresh }) {
  const equipos = (window.NP_RoadmapData && window.NP_RoadmapData.EQUIPOS_DISPONIBLES) || [];
  const [seleccion, setSeleccion] = React.useState(leerEquipos);
  const [abierto, setAbierto] = React.useState(false);

  const toggle = (id) => {
    const fijo = equipos.find(eq => eq.id === id);
    if (fijo && fijo.siempre) return;
    const nueva = seleccion.includes(id)
      ? seleccion.filter(x => x !== id)
      : [...seleccion, id];
    setSeleccion(nueva);
    localStorage.setItem('nutriplan_equipos', JSON.stringify(nueva));
    // Notificar al padre directamente (re-render inmediato sin pasar por el abuelo)
    if (onEquiposChange) onEquiposChange(nueva);
    if (onRefresh) onRefresh();
  };

  return (
    <div className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100 shadow-sm'}`}>
      <button
        onClick={() => setAbierto(!abierto)}
        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        <span><i className="fas fa-dumbbell mr-2"></i>Mi equipamiento</span>
        <i className={`fas fa-chevron-${abierto ? 'up' : 'down'} text-xs`}></i>
      </button>
      {abierto && (
        <div className={`px-4 pb-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <p className={`text-xs mt-2 mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Marca lo que tienes. Los ejercicios muestran aviso si falta equipo.</p>
          <div className="flex flex-wrap gap-2">
            {equipos.map(eq => {
              const activo = seleccion.includes(eq.id);
              return (
                <button
                  key={eq.id}
                  onClick={() => toggle(eq.id)}
                  disabled={eq.siempre}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all border ${
                    activo
                      ? eq.siempre
                        ? 'bg-green-500 text-white border-green-500 opacity-70 cursor-default'
                        : 'bg-green-500 text-white border-green-500'
                      : darkMode
                        ? 'bg-transparent text-gray-500 border-gray-600 hover:border-gray-400 hover:text-gray-300'
                        : 'bg-transparent text-gray-400 border-gray-300 hover:border-gray-500 hover:text-gray-600'
                  }`}>
                  <i className={`fas ${eq.icono} mr-1.5`}></i>
                  {eq.nombre.charAt(0).toUpperCase() + eq.nombre.slice(1)}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── EjercicioCard: tarjeta individual de ejercicio ───
function EjercicioCard({ e, i, darkMode, protEj, previo, equiposDisp, mejoró, bajó, onToggle, onSetPeso, onSetReps }) {
  const eqId = getEquipoId(e.equipo);
  const esPesoCorporal = eqId === 'peso_corporal';
  const eqNoDisp = !esPesoCorporal && !equiposDisp.includes(eqId);

  // Estado local para el input de texto del peso (permite escribir "12.5" sin interrupciones)
  const pesoInicial = e.peso != null ? e.peso : (previo ? previo.peso : 0);
  const [pesoStr, setPesoStr] = React.useState(() => String(pesoInicial));
  // Sincronizar cuando el padre cambia e.peso (ej: botones +/-)
  React.useEffect(() => {
    const v = e.peso != null ? e.peso : 0;
    setPesoStr(String(v));
  }, [e.peso]);
  const eqInfo = eqNoDisp && window.NP_RoadmapData && window.NP_RoadmapData.EQUIPOS_DISPONIBLES
    ? window.NP_RoadmapData.EQUIPOS_DISPONIBLES.find(eq => eq.id === eqId)
    : null;

  return (
    <div className={`rounded-xl p-4 transition-colors ${
      e.done
        ? darkMode ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200'
        : darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100 shadow-sm'
    }`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className={`font-semibold text-base ${darkMode ? 'text-white' : 'text-gray-800'}`}>{e.nombre}</div>
          <div className="flex items-center gap-2 flex-wrap mt-1">
            <span className="text-xs text-gray-400"><b>{e.setsEsperado} × {e.repsEsperado}</b> · {e.equipo}</span>
            {protEj && protEj.youtube && (
              <a href={protEj.youtube} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-500 font-medium">
                <i className="fab fa-youtube"></i>
                <span>ver video</span>
              </a>
            )}
          </div>
          {protEj && protEj.descripcion && (
            <div className={`text-xs mt-1 leading-snug ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{protEj.descripcion}</div>
          )}
          {e.nota && <div className="text-xs text-gray-400 italic mt-0.5">{e.nota}</div>}
          {eqNoDisp && (
            <div className="text-xs mt-1 font-medium text-amber-500">
              <i className="fas fa-exclamation-triangle mr-1"></i>
              {eqInfo ? `Requiere ${eqInfo.nombre} — no marcado como disponible` : 'Equipo no disponible'}
            </div>
          )}
        </div>
        <button onClick={() => onToggle(i)}
          className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all ${
            e.done
              ? 'bg-green-500 text-white shadow-md'
              : darkMode ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
          }`}>
          <i className={`fas ${e.done ? 'fa-check' : 'fa-circle'} text-sm`}></i>
        </button>
      </div>

      <div className="flex gap-2 mt-3">
        {/* Stepper de peso — oculto en ejercicios de peso corporal */}
        {!esPesoCorporal && (
          <div className={`flex items-center flex-shrink-0 rounded-lg border overflow-hidden ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
            <button onClick={() => {
              const cur = parseFloat(pesoStr) || 0;
              const next = Math.max(0, Math.round((cur - 2.5) * 10) / 10);
              onSetPeso(i, next);
              setPesoStr(String(next));
            }} className={`w-9 h-9 flex items-center justify-center text-base font-bold transition-colors cursor-pointer ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>−</button>

            <div className={`flex items-center justify-center gap-1 px-2 h-9 border-x ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
              <input
                type="text"
                inputMode="decimal"
                value={pesoStr}
                onChange={ev => setPesoStr(ev.target.value)}
                onBlur={() => {
                  const val = Math.max(0, parseFloat(pesoStr) || 0);
                  onSetPeso(i, val);
                  setPesoStr(String(val));
                }}
                style={{
                  width: '2.8rem',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  textAlign: 'center',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  fontVariantNumeric: 'tabular-nums',
                  color: darkMode ? '#f9fafb' : '#1f2937'
                }}
              />
              <span className={`text-xs font-medium flex-shrink-0 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>kg</span>
            </div>

            <button onClick={() => {
              const cur = parseFloat(pesoStr) || 0;
              const next = Math.round((cur + 2.5) * 10) / 10;
              onSetPeso(i, next);
              setPesoStr(String(next));
            }} className={`w-9 h-9 flex items-center justify-center text-base font-bold transition-colors cursor-pointer ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>+</button>
          </div>
        )}

        <input type="text" value={e.repsReales || ''}
          onChange={ev => onSetReps(i, ev.target.value)}
          className={`flex-1 px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'border-gray-200'}`}
          placeholder={'Reps reales (' + e.repsEsperado + ')'} />
      </div>

      {previo && (
        <div className="flex items-center justify-between mt-2 text-xs">
          <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
            Último: <b className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{previo.peso} kg</b> × {previo.reps} <span className="opacity-60">({previo.fecha})</span>
          </span>
          {(mejoró || bajó) && (
            <span className={`font-bold text-sm ${mejoró ? 'text-green-500' : 'text-red-400'}`}>
              <i className={`fas ${mejoró ? 'fa-arrow-up' : 'fa-arrow-down'} mr-1`}></i>
              {mejoró ? '+' : ''}{(Number(e.peso) - previo.peso).toFixed(1)} kg
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Sub-vista: Entreno (log de cargas por día A/B/C/D) ───
function FLEntrenoView({ perfil, darkMode, refresh, onRefresh }) {
  const hoy = new Date().toISOString().split('T')[0];

  // ── Días/semana: persiste en localStorage, modifica todo el plan ──
  const [diasSemana, setDiasSemana] = React.useState(() =>
    parseInt(localStorage.getItem('nutriplan_dias_semana') || '4')
  );
  const planActual = (window.NP_RoadmapData && window.NP_RoadmapData.SCHEDULES_POR_DIAS)
    ? (window.NP_RoadmapData.SCHEDULES_POR_DIAS[diasSemana] || window.NP_RoadmapData.SCHEDULES_POR_DIAS[4])
    : null;

  const hoyDow = new Date(hoy + 'T12:00:00').getDay();
  const sugerido = planActual
    ? (planActual.schedule[hoyDow] || 'descanso')
    : (window.NP_Training && window.NP_Training.tipoDiaSugerido ? window.NP_Training.tipoDiaSugerido(hoy) : 'descanso');
  const tipos = planActual ? planActual.tipos
    : [{ k:'A', short:'A', corto:'Empuje' }, { k:'B', short:'B', corto:'Piernas' },
       { k:'C', short:'C', corto:'Jalar'  }, { k:'D', short:'D', corto:'Circuito' }];

  const tipoInicial = (sugerido === 'descanso') ? (tipos[0] ? tipos[0].k : 'A') : sugerido;
  const [tipoDia, setTipoDia] = React.useState(tipoInicial);

  // Cuando cambia diasSemana, resetear al sugerido si el tipo actual ya no existe en el plan
  React.useEffect(() => {
    if (!tipos.some(t => t.k === tipoDia)) setTipoDia(tipoInicial);
  }, [diasSemana]);

  if (!window.NP_Training) {
    return <div className={`rounded-xl p-6 text-sm ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-amber-50 text-amber-700'}`}>Módulo de entreno no disponible.</div>;
  }

  // ── Protocolo dinámico: ejercicios rotan semana a semana ──
  const semanaNum = window.NP_RoadmapData ? window.NP_RoadmapData.semanaActual(hoy) : 0;
  // equiposDisp como estado: permite re-render inmediato al cambiar equipamiento
  const [equiposDisp, setEquiposDisp] = React.useState(leerEquipos);
  const protocolo = (window.NP_RoadmapData && window.NP_RoadmapData.generarProtocoloDia)
    ? window.NP_RoadmapData.generarProtocoloDia(tipoDia, semanaNum, equiposDisp)
    : (window.NP_Training ? window.NP_Training.protocoloDia(tipoDia) : null);

  // ── Sesión del día: siempre refleja el protocolo dinámico actual ──
  // Los datos ya logueados se preservan por nombre de ejercicio.
  // Así, al cambiar equipamiento los ejercicios se actualizan de inmediato
  // sin borrar el progreso de los ejercicios que permanezcan en el plan.
  let sesion = window.NP_Training.obtener(hoy, tipoDia);
  if (protocolo) {
    // Mapa nombre → datos logueados de la sesión guardada
    const logMap = {};
    sesion.ejercicios.forEach(e => {
      logMap[e.nombre] = { done: e.done, peso: e.peso, repsReales: e.repsReales };
    });
    sesion = Object.assign({}, sesion, {
      ejercicios: protocolo.ejercicios.map(ej => {
        const log = logMap[ej.nombre] || {};
        return {
          nombre:       ej.nombre,
          setsEsperado: ej.sets,
          repsEsperado: ej.reps,
          equipo:       ej.equipo,
          nota:         ej.nota || '',
          done:         log.done  || false,
          peso:         log.peso  != null ? log.peso  : null,
          repsReales:   log.repsReales || null
        };
      })
    });
  }

  const resumen = window.NP_Training.resumen7();
  const ultimas = window.NP_Training.ultimas(8);
  const esDescanso = sugerido === 'descanso';

  const patch = (idx, parches) => {
    const nueva = Object.assign({}, sesion, {
      ejercicios: sesion.ejercicios.map((e, i) => i === idx ? Object.assign({}, e, parches) : e)
    });
    window.NP_Training.guardar(nueva);
    onRefresh();
  };

  const toggleDone = (idx) => patch(idx, { done: !sesion.ejercicios[idx].done });
  const setPeso = (idx, v) => {
    // Permitir string parcial ("1.", "1,5") sin bloquear; parseo final solo si es número válido
    if (v === '' || v == null) return patch(idx, { peso: null });
    const limpio = String(v).replace(',', '.');
    if (!/^-?\d*\.?\d*$/.test(limpio)) return; // ignorar caracteres inválidos
    const num = parseFloat(limpio);
    patch(idx, { peso: isNaN(num) ? limpio : num });
  };
  const setReps = (idx, v) => patch(idx, { repsReales: v || null });

  const marcarTodos = () => {
    const nueva = Object.assign({}, sesion, {
      ejercicios: sesion.ejercicios.map(e => Object.assign({}, e, { done: true }))
    });
    window.NP_Training.guardar(nueva);
    onRefresh();
  };

  const limpiarSesion = () => {
    if (window.confirm('¿Borrar el registro de este entreno?')) {
      window.NP_Training.eliminar(hoy, tipoDia);
      onRefresh();
    }
  };

  const completados = sesion.ejercicios.filter(e => e.done).length;
  const total = sesion.ejercicios.length;
  const pct = total > 0 ? Math.round((completados / total) * 100) : 0;

  // tipos ya está definido arriba desde planActual
  const gridCols = tipos.length <= 4 ? tipos.length : 3; // 5-6 días → 2 filas de 3
  const diaSemana = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'][new Date(hoy + 'T12:00:00').getDay()];

  return (
    <div className="space-y-4">
      {/* Resumen semana */}
      <div className="grid grid-cols-3 gap-2">
        <div className={`rounded-xl p-3 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100 shadow-sm'}`}>
          <div className="text-[11px] text-gray-400 uppercase font-bold">Entrenos 7d</div>
          <div className={`text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{resumen.entrenos}</div>
        </div>
        <div className={`rounded-xl p-3 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100 shadow-sm'}`}>
          <div className="text-[11px] text-gray-400 uppercase font-bold">Completados</div>
          <div className={`text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{resumen.completados}<span className="text-sm text-gray-400">/{resumen.entrenos || 0}</span></div>
        </div>
        <div className={`rounded-xl p-3 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100 shadow-sm'}`}>
          <div className="text-[11px] text-gray-400 uppercase font-bold">Cumplimiento</div>
          <div className={`text-2xl font-extrabold ${resumen.cumplimiento >= 80 ? 'text-green-500' : resumen.cumplimiento >= 50 ? 'text-orange-500' : darkMode ? 'text-white' : 'text-gray-800'}`}>{resumen.cumplimiento}%</div>
        </div>
      </div>

      {/* Selector de día */}
      <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100 shadow-sm'}`}>
        <div className="flex items-center justify-between mb-2">
          <div className={`text-xs uppercase font-bold tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Día a registrar · hoy ({diaSemana})
          </div>
          {esDescanso
            ? <span className={`text-xs px-2 py-0.5 rounded ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>Descanso según plan</span>
            : <span className="text-xs px-2 py-0.5 rounded bg-orange-500/20 text-orange-500 font-bold">
                Sugerido: Día {(tipos.find(t => t.k === sugerido) || {}).short || sugerido}
              </span>
          }
        </div>

        {/* Selector días/semana */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-medium whitespace-nowrap ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Días/sem:</span>
          <div className="flex gap-1">
            {[2,3,4,5,6].map(n => (
              <button key={n}
                onClick={() => { localStorage.setItem('nutriplan_dias_semana', String(n)); setDiasSemana(n); }}
                className="w-10 h-10 rounded text-xs font-bold cursor-pointer"
                style={diasSemana === n
                  ? { background: '#f97316', color: '#ffffff', border: '1px solid #f97316' }
                  : darkMode
                    ? { background: 'transparent', color: '#6b7280', border: '1px solid #4b5563' }
                    : { background: 'transparent', color: '#4b5563', border: '1px solid #d1d5db' }
                }>
                {n}
              </button>
            ))}
          </div>
          {planActual && <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{planActual.label}</span>}
        </div>

        {/* Botones de tipo de día */}
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}>
          {tipos.map(t => {
            const activo = tipoDia === t.k;
            const esSugerido = !esDescanso && sugerido === t.k;
            return (
              <button key={t.k} onClick={() => setTipoDia(t.k)}
                className="rounded-lg font-semibold flex flex-col items-center cursor-pointer"
                style={{
                  padding: '10px 0',
                  gap: '2px',
                  ...(activo
                    ? { background: 'linear-gradient(to right, #f97316, #ef4444)', color: '#ffffff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.15)' }
                    : esSugerido
                      ? darkMode
                        ? { background: 'rgba(234,88,12,0.15)', color: '#fb923c', border: '1px solid rgba(194,65,12,0.4)' }
                        : { background: '#fff7ed', color: '#ea580c', border: '1px solid #fed7aa' }
                      : darkMode
                        ? { background: '#374151', color: '#d1d5db' }
                        : { background: '#f9fafb', color: '#4b5563', border: '1px solid #e5e7eb' }
                  )
                }}>
                <span className="text-sm">Día {t.short || t.k}</span>
                <span style={{ fontSize: '11px', opacity: 0.8 }}>{t.corto}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Equipamiento disponible — entre selector de día y el card de entrenamiento */}
      <EquipamientoCard darkMode={darkMode} onEquiposChange={setEquiposDisp} onRefresh={onRefresh} />

      {/* Card del día seleccionado */}
      {protocolo && (
        <div className={`rounded-2xl p-5 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100 shadow-sm'}`}>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <div className={`text-sm uppercase tracking-wider font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>{protocolo.nombre}</div>
                <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${darkMode ? 'bg-orange-900/40 text-orange-300' : 'bg-orange-50 text-orange-600'}`}>
                  Semana {semanaNum}{protocolo.variante ? ' · V' + protocolo.variante : ''}
                </span>
              </div>
              <div className={`text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'} mt-1`}>{protocolo.foco}</div>
              <div className="text-xs text-gray-400 mt-1">
                <i className="fas fa-clock mr-1"></i>{protocolo.duracionMin} min · {protocolo.equipamiento}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className={`text-2xl font-extrabold ${pct === 100 ? 'text-green-500' : darkMode ? 'text-white' : 'text-gray-800'}`}>{pct}%</div>
              <div className="text-xs text-gray-400">{completados}/{total}</div>
            </div>
          </div>
          <div className={`w-full h-2 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className="h-full transition-all"
              style={{
                width: pct + '%',
                backgroundImage: pct === 100
                  ? 'linear-gradient(to right, #22c55e, #10b981)'
                  : 'linear-gradient(to right, #f97316, #ef4444)'
              }}></div>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={marcarTodos} disabled={pct === 100}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold ${pct === 100 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              <i className="fas fa-check-double mr-1"></i>Marcar todos
            </button>
            {completados > 0 && (
              <button onClick={() => {
                const nueva = Object.assign({}, sesion, { ejercicios: sesion.ejercicios.map(e => Object.assign({}, e, { done: false })) });
                window.NP_Training.guardar(nueva); onRefresh();
              }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold ${darkMode ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
              <i className="fas fa-xmark mr-1"></i>Desmarcar
            </button>
            )}
            <button onClick={limpiarSesion}
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${darkMode ? 'bg-gray-700 text-red-400 hover:bg-gray-600' : 'bg-gray-100 text-red-500 hover:bg-gray-200'}`}>
              <i className="fas fa-rotate-left mr-1"></i>Reset
            </button>
          </div>
        </div>
      )}

      {/* Lista de ejercicios */}
      <div className="space-y-2">
        {sesion.ejercicios.map((e, i) => {
          const previo = window.NP_Training.ultimoPeso(e.nombre, hoy);
          const mejoró = previo && e.peso != null && Number(e.peso) > previo.peso;
          const bajó = previo && e.peso != null && Number(e.peso) < previo.peso;
          // Lookup en el pool global (cubre protocolo base + extras de rotación)
          const protEj = (window.NP_RoadmapData && window.NP_RoadmapData.buscarEjercicio)
            ? window.NP_RoadmapData.buscarEjercicio(e.nombre)
            : (protocolo ? protocolo.ejercicios.find(p => p.nombre === e.nombre) : null);
          return (
            <EjercicioCard key={i} e={e} i={i} darkMode={darkMode} protEj={protEj}
              previo={previo} equiposDisp={equiposDisp} mejoró={mejoró} bajó={bajó}
              onToggle={toggleDone} onSetPeso={setPeso} onSetReps={setReps} />
          );
        })}
      </div>

      {/* Principios */}
      {window.NP_RoadmapData && window.NP_RoadmapData.ENTRENO_PROTOCOLO && window.NP_RoadmapData.ENTRENO_PROTOCOLO.principios && (
        <details className={`rounded-xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100 shadow-sm'}`}>
          <summary className={`px-5 py-3 cursor-pointer text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <i className="fas fa-lightbulb mr-2"></i>Principios del método
          </summary>
          <div className={`px-5 pb-4 space-y-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {window.NP_RoadmapData.ENTRENO_PROTOCOLO.principios.map((p, i) => (
              <div key={i} className={`rounded-lg p-3 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <div className={`font-semibold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>{p.titulo}</div>
                <div className="mt-1 leading-relaxed">{p.texto}</div>
              </div>
            ))}
          </div>
        </details>
      )}

      {/* Historial últimas sesiones */}
      {ultimas.length > 0 && (
        <div className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100 shadow-sm'}`}>
          <div className={`px-5 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Últimas sesiones</h3>
          </div>
          <div className={`divide-y text-sm ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
            {ultimas.map((s, i) => {
              const hechos = s.ejercicios.filter(e => e.done).length;
              const tot = s.ejercicios.length;
              const pctS = tot > 0 ? Math.round((hechos / tot) * 100) : 0;
              return (
                <div key={i} className="px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">{s.fecha}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>Día {s.dia_tipo}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-semibold ${s.completado ? 'text-green-500' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {hechos}/{tot} {s.completado && '✓'}
                    </span>
                    <div className={`w-16 h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <div className={`h-full ${s.completado ? 'bg-green-500' : 'bg-orange-500'}`} style={{ width: pctS + '%' }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================
// COMPONENTE PRINCIPAL: App (MEJORA 5: dark mode)
// =============================================
// =============================================
// COMPONENTE: LoadingOverlay (búsqueda en vivo)
// =============================================
function LoadingOverlay({ mensaje, darkMode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay">
      <div className={`rounded-2xl p-8 shadow-2xl max-w-sm mx-4 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg">
          <i className="fas fa-globe text-white text-2xl loading-spin"></i>
        </div>
        <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Buscando recetas</h3>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{mensaje || 'Conectando con base de datos en línea...'}</p>
        <div className="mt-4 flex justify-center gap-1">
          <span className="loading-dot w-2 h-2 rounded-full bg-green-500" style={{animationDelay: '0s'}}></span>
          <span className="loading-dot w-2 h-2 rounded-full bg-green-500" style={{animationDelay: '0.2s'}}></span>
          <span className="loading-dot w-2 h-2 rounded-full bg-green-500" style={{animationDelay: '0.4s'}}></span>
        </div>
      </div>
    </div>
  );
}

// =============================================
// COMPONENTE: CuentaModal
// =============================================
function CuentaModal({ authUser, darkMode, onClose, lang, onLangChange }) {
  const isGoogle = (authUser.providerData?.[0]?.providerId === 'google.com');
  const [view, setView]          = React.useState('main');
  const [newPass, setNewPass]    = React.useState('');
  const [confirmPass, setConfirm]= React.useState('');
  const [showP1, setShowP1]      = React.useState(false);
  const [showP2, setShowP2]      = React.useState(false);
  const [loading, setLoading]    = React.useState(false);
  const [error, setError]        = React.useState('');
  const [success, setSuccess]    = React.useState('');

  const cardCls  = darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800';
  const mutedCls = darkMode ? 'text-gray-400' : 'text-gray-500';
  const inputCls = `w-full px-4 py-3 rounded-xl border text-sm transition-colors focus:outline-none focus:border-green-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'}`;

  const handleChangePassword = async () => {
    setError('');
    if (newPass.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return; }
    if (newPass !== confirmPass) { setError('Las contraseñas no coinciden.'); return; }
    setLoading(true);
    try {
      await firebase.auth().currentUser.updatePassword(newPass);
      setSuccess('Contraseña actualizada correctamente.');
      setNewPass(''); setConfirm('');
      setView('main');
    } catch (e) {
      setError(e.code === 'auth/requires-recent-login'
        ? 'Por seguridad, cierra sesión, vuelve a ingresar y repite la acción.'
        : 'Error al cambiar la contraseña. Intenta de nuevo.');
    } finally { setLoading(false); }
  };

  const handleDeleteAccount = async () => {
    setLoading(true); setError('');
    try {
      if (window.NP_CloudStorage) await window.NP_CloudStorage.deleteAllData();
      await firebase.auth().currentUser.delete();
      onClose();
    } catch (e) {
      setError(e.code === 'auth/requires-recent-login'
        ? 'Por seguridad, cierra sesión, vuelve a ingresar y repite la acción.'
        : 'Error al eliminar la cuenta. Intenta de nuevo.');
      setLoading(false);
    }
  };

  return (
    <>
    <div className="fixed inset-0 z-40" onClick={onClose}></div>
    <div className={`absolute top-full right-0 mt-2 z-50 w-80 rounded-2xl border shadow-xl p-5 animate-scaleIn ${cardCls}`}
      onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-base">{t('Mi cuenta','My account')}</h3>
          <button onClick={onClose} aria-label={t('Cerrar','Close')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-400 hover:bg-gray-100'}`}>
            <i className="fas fa-xmark text-sm"></i>
          </button>
        </div>

        {view === 'main' && (
          <div>
            <div className={`flex items-center gap-3 p-3 rounded-xl mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              {authUser.photoURL
                ? <img src={authUser.photoURL} alt="" className="w-10 h-10 rounded-full border-2 border-green-200 object-cover flex-shrink-0" referrerPolicy="no-referrer" />
                : <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${darkMode ? 'bg-green-700 text-green-100' : 'bg-green-100 text-green-700'}`}>
                    {(authUser.displayName || authUser.email || '?')[0].toUpperCase()}
                  </div>
              }
              <div className="min-w-0">
                {authUser.displayName && (
                  <p className="text-sm font-medium truncate">{authUser.displayName}</p>
                )}
                <p className={`text-xs truncate ${mutedCls}`}>{authUser.email}</p>
                <p className={`text-xs mt-0.5 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  <i className={`${isGoogle ? 'fab fa-google' : 'fas fa-envelope'} mr-1`}></i>
                  {isGoogle ? t('Cuenta Google','Google account') : t('Email / contraseña','Email / password')}
                </p>
              </div>
            </div>

            {success && (
              <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm mb-3 ${darkMode ? 'bg-green-900/40 text-green-300 border border-green-800' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                <i className="fas fa-circle-check flex-shrink-0"></i>
                <span>{success}</span>
              </div>
            )}

            <div className="space-y-1">
              {!isGoogle && (
                <button onClick={() => { setView('changePass'); setError(''); setSuccess(''); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                  <i className={`fas fa-lock w-4 text-center ${mutedCls}`}></i>
                  <span>{t('Cambiar contraseña','Change password')}</span>
                  <i className={`fas fa-chevron-right ml-auto text-xs ${mutedCls}`}></i>
                </button>
              )}
              {isGoogle && (
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  <i className="fas fa-lock w-4 text-center"></i>
                  <span>{t('Contraseña gestionada por Google','Password managed by Google')}</span>
                </div>
              )}
              <button onClick={async () => { onClose(); await window.NP_Auth.signOut(); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-colors cursor-pointer ${darkMode ? 'text-orange-400 hover:bg-gray-700' : 'text-orange-500 hover:bg-orange-50'}`}>
                <i className="fas fa-arrow-right-from-bracket w-4 text-center"></i>
                <span>{t('Cerrar sesión','Sign out')}</span>
              </button>
            </div>

            {/* ── Language selector ── */}
            {onLangChange && (
              <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${mutedCls}`}>{t('Idioma','Language')}</p>
                <div className="flex gap-2">
                  {[
                    { code: 'es', flag: '🇪🇸', label: 'Español' },
                    { code: 'en', flag: '🇺🇸', label: 'English' }
                  ].map(({ code, flag, label }) => (
                    <button key={code} onClick={() => { if (onLangChange) onLangChange(code); }}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                        (lang || 'es') === code
                          ? 'bg-green-500 text-white shadow-sm'
                          : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                      }`}>
                      <span>{flag}</span>{label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <button onClick={() => { setView('deleteConfirm'); setError(''); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-colors cursor-pointer ${darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-500 hover:bg-red-50'}`}>
                <i className="fas fa-user-xmark w-4 text-center"></i>
                <span>{t('Eliminar mi cuenta','Delete my account')}</span>
              </button>
            </div>
          </div>
        )}

        {view === 'changePass' && (
          <div>
            <button onClick={() => setView('main')}
              className={`flex items-center gap-1.5 text-sm mb-4 cursor-pointer transition-colors ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
              <i className="fas fa-arrow-left text-xs"></i> {t('Volver','Back')}
            </button>
            <h4 className="font-medium text-sm mb-4">{t('Cambiar contraseña','Change password')}</h4>
            {error && (
              <div className={`flex items-start gap-2 px-3 py-2.5 rounded-xl text-sm mb-3 ${darkMode ? 'bg-red-900/40 text-red-300 border border-red-800' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                <i className="fas fa-circle-exclamation mt-0.5 flex-shrink-0"></i>
                <span>{error}</span>
              </div>
            )}
            <div className="space-y-3">
              <div>
                <label className={`block text-xs font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t('Nueva contraseña','New password')}</label>
                <div className="relative">
                  <input type={showP1 ? 'text' : 'password'} value={newPass}
                    onChange={e => { setNewPass(e.target.value); setError(''); }}
                    placeholder={t('Mínimo 6 caracteres','At least 6 characters')}
                    className={`${inputCls} pr-10`} />
                  <button type="button" onClick={() => setShowP1(p => !p)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded cursor-pointer ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}>
                    <i className={`fas ${showP1 ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
                  </button>
                </div>
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t('Confirmar contraseña','Confirm password')}</label>
                <div className="relative">
                  <input type={showP2 ? 'text' : 'password'} value={confirmPass}
                    onChange={e => { setConfirm(e.target.value); setError(''); }}
                    placeholder={t('Repite la contraseña','Repeat your password')}
                    className={`${inputCls} pr-10`} />
                  <button type="button" onClick={() => setShowP2(p => !p)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded cursor-pointer ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}>
                    <i className={`fas ${showP2 ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
                  </button>
                </div>
              </div>
              <button onClick={handleChangePassword} disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold text-sm text-white transition-all ${loading ? 'bg-green-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 active:scale-[0.98]'}`}>
                {loading
                  ? <span className="flex items-center justify-center gap-2"><i className="fas fa-circle-notch fa-spin"></i>{t('Guardando…','Saving…')}</span>
                  : t('Guardar contraseña','Save password')}
              </button>
            </div>
          </div>
        )}

        {view === 'deleteConfirm' && (
          <div>
            <button onClick={() => setView('main')}
              className={`flex items-center gap-1.5 text-sm mb-4 cursor-pointer transition-colors ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
              <i className="fas fa-arrow-left text-xs"></i> {t('Volver','Back')}
            </button>
            <div className={`p-4 rounded-xl mb-4 border ${darkMode ? 'bg-gray-900 border-red-800' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-start gap-3">
                <i className={`fas fa-triangle-exclamation mt-0.5 ${darkMode ? 'text-red-400' : 'text-red-500'}`}></i>
                <div>
                  <p className={`text-sm font-semibold mb-1 ${darkMode ? 'text-red-300' : 'text-red-700'}`}>{t('¿Eliminar tu cuenta?','Delete your account?')}</p>
                  <p className={`text-xs ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{t('Esta acción es irreversible. Se borrarán todos tus datos y no podrás recuperarlos.','This action is irreversible. All your data will be deleted and cannot be recovered.')}</p>
                </div>
              </div>
            </div>
            {error && (
              <div className={`flex items-start gap-2 px-3 py-2.5 rounded-xl text-sm mb-3 ${darkMode ? 'bg-red-900/40 text-red-300 border border-red-800' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                <i className="fas fa-circle-exclamation mt-0.5 flex-shrink-0"></i>
                <span>{error}</span>
              </div>
            )}
            <button onClick={handleDeleteAccount} disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-sm text-white transition-all active:scale-[0.98] ${loading ? 'bg-red-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}`}>
              {loading
                ? <span className="flex items-center justify-center gap-2"><i className="fas fa-circle-notch fa-spin"></i>{t('Eliminando…','Deleting…')}</span>
                : t('Sí, eliminar mi cuenta','Yes, delete my account')}
            </button>
          </div>
        )}

      </div>
    </>
  );
}

function App() {
  const [pantalla, setPantalla] = React.useState("loading");
  const [perfil, setPerfil] = React.useState(null);
  const [planSemanal, setPlanSemanal] = React.useState(null);
  const [recetaSeleccionada, setRecetaSeleccionada] = React.useState(null);
  const [toast, setToast] = React.useState(null);
  const [darkMode, setDarkMode] = React.useState(() => cargarDarkMode());
  const [cargando, setCargando] = React.useState(false);
  const [mensajeCarga, setMensajeCarga] = React.useState("");
  const [swapping, setSwapping] = React.useState(null); // {dia, tipoComida} mientras busca
  const [historialSlots, setHistorialSlots] = React.useState(() =>
    typeof cargarHistorialSlots === 'function' ? cargarHistorialSlots() : {}
  );
  const [vetadas, setVetadas] = React.useState(() =>
    typeof cargarRecetasVetadas === 'function' ? cargarRecetasVetadas() : new Set()
  );

  // ─── Preferencias de generación + modal ───
  const [showPrefModal, setShowPrefModal] = React.useState(false);
  const [preferenciasGen, setPreferenciasGen] = React.useState({ cocina: 'cualquiera', altaProteina: false, rapido: false });

  // ─── v20260428ai: Language state ───
  const [lang, setLang] = React.useState(() => localStorage.getItem('nutriplan_lang') || 'es');
  // Sync to global so t() works inside any component during render
  window._NP_lang = lang;
  const changeLang = (newLang) => {
    localStorage.setItem('nutriplan_lang', newLang);
    window._NP_lang = newLang;
    setLang(newLang);
  };

  // ─── Auth state ───
  // undefined = todavía cargando, null = no logueado, object = usuario logueado
  const [authUser, setAuthUser] = React.useState(undefined);
  const authUserRef = React.useRef(null); // ref para detectar cambio dentro del closure
  const [showCuenta, setShowCuenta] = React.useState(false);
  // Fase 3.3: factor de comensales global
  const [factorComensales, setFactorComensales] = React.useState(() =>
    window.perfilesMulti ? window.perfilesMulti.factorCoccion(window.perfilesMulti.cargar()) : 1
  );

  // Listener global para cambios de comensales
  React.useEffect(() => {
    const handler = (e) => {
      if (window.perfilesMulti) {
        setFactorComensales(window.perfilesMulti.factorCoccion(e.detail));
      }
    };
    window.addEventListener('perfiles-change', handler);
    return () => window.removeEventListener('perfiles-change', handler);
  }, []);

  // ─── Suscripción al estado de auth (Firebase) ───
  React.useEffect(() => {
    if (!window.NP_Auth) {
      // Firebase no configurado → modo local sin auth (sin login screen)
      setAuthUser(null);
      return;
    }
    const unsubscribe = window.NP_Auth.onAuthStateChanged(async function(user) {
      if (user) {
        // Instalar proxy de localStorage + hidratar desde Firestore
        if (window.NP_CloudStorage) {
          await window.NP_CloudStorage.onLogin(user.uid);
        }
        authUserRef.current = user;
        setAuthUser(user);
      } else {
        // Logout: limpiar proxy y resetear app state
        if (authUserRef.current && window.NP_CloudStorage) {
          window.NP_CloudStorage.onLogout();
        }
        authUserRef.current = null;
        setAuthUser(null);
        setPerfil(null);
        setPlanSemanal(null);
        setPantalla('loading');
      }
    });
    return unsubscribe;
  }, []);

  // Apply dark mode class to html element
  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    document.body.className = darkMode ? 'bg-gray-900 font-sans antialiased' : 'bg-gray-50 font-sans antialiased';
  }, [darkMode]);

  // Comprimir historial de adherencia (feature #14) — one-shot on mount
  React.useEffect(() => {
    if (typeof trimirHistorialAdherencia === 'function') trimirHistorialAdherencia();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      guardarDarkMode(next);
      return next;
    });
  };

  // Migración: sanitizar instrucciones en inglés + reemplazar desayunos/snacks pesados por locales
  // Soporta formato multi-semana (_numSemanas + semana_N) y formato legacy
  const _sanitizarPlan = (planInput, perfilParam) => {
    if (!planInput) return planInput;
    // Normalizar a formato multi-semana
    const plan = typeof _normalizarPlanMulti === 'function' ? _normalizarPlanMulti(planInput) : planInput;
    let modificado = false;
    const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    const TIPOS = ["desayuno", "snack_am", "almuerzo", "snack_pm", "cena"];
    const TIPOS_SOLO_LOCAL = ["desayuno", "snack_am", "snack_pm"];
    
    const _esRecetaOnline = (comida) => {
      if (!comida) return false;
      if (comida._fuente === "online") return true;
      if (comida.id && comida.id.startsWith("online_")) return true;
      return false;
    };
    
    const _obtenerRecetaLocal = (tipo, idsUsados) => {
      try {
        const recetasDB = typeof RECETAS_DB !== 'undefined' ? RECETAS_DB : [];
        const disponibles = recetasDB.filter(r => r.tipo_comida === tipo && !idsUsados.has(r.id));
        if (disponibles.length === 0) {
          const todos = recetasDB.filter(r => r.tipo_comida === tipo);
          if (todos.length > 0) return todos[Math.floor(Math.random() * todos.length)];
          return null;
        }
        return disponibles[Math.floor(Math.random() * disponibles.length)];
      } catch(e) { return null; }
    };
    
    const DIST = { desayuno: 0.25, snack_am: 0.10, almuerzo: 0.35, snack_pm: 0.10, cena: 0.20 };
    const numSemanas = plan._numSemanas || 1;
    
    for (let s = 1; s <= numSemanas; s++) {
      const semana = plan['semana_' + s];
      if (!semana) continue;
      
      const idsUsadosPorTipo = {};
      TIPOS_SOLO_LOCAL.forEach(tipo => { idsUsadosPorTipo[tipo] = new Set(); });
      DIAS.forEach(dia => {
        if (!semana[dia]) return;
        TIPOS_SOLO_LOCAL.forEach(tipo => {
          const comida = semana[dia][tipo];
          if (comida && comida.id && !_esRecetaOnline(comida)) {
            idsUsadosPorTipo[tipo].add(comida.id);
          }
        });
      });
      
      DIAS.forEach(dia => {
        if (!semana[dia]) return;
        TIPOS.forEach(tipo => {
          const comida = semana[dia][tipo];
          if (!comida) return;
          
          if (TIPOS_SOLO_LOCAL.includes(tipo) && _esRecetaOnline(comida)) {
            const reemplazo = _obtenerRecetaLocal(tipo, idsUsadosPorTipo[tipo]);
            if (reemplazo) {
              const calObj = comida.calorias_escaladas || Math.round((perfilParam?.caloriasObjetivo || perfil?.caloriasObjetivo || 2000) * DIST[tipo]);
              const escalada = typeof escalarReceta === 'function' ? escalarReceta(reemplazo, calObj) : reemplazo;
              semana[dia][tipo] = escalada;
              idsUsadosPorTipo[tipo].add(reemplazo.id);
              modificado = true;
            }
          }
          
          if (semana[dia][tipo] && semana[dia][tipo].instrucciones) {
            const actual = semana[dia][tipo];
            const instr = actual.instrucciones;
            const esComidaFuerte = (tipo === 'almuerzo' || tipo === 'cena');
            const numIngredientes = (actual.ingredientes_escalados || actual.ingredientes || []).length;
            const instrCortas = instr.length <= 3 && numIngredientes >= 4 && esComidaFuerte;
            const instrSinDetalle = esComidaFuerte && instr.length > 0 && instr.every(p => p.length < 60);
            const instrGenericas = esComidaFuerte && instr.some(p => 
              p.includes("Cocinar los ingredientes principales") || 
              p.includes("Sazonar al gusto") && p.length < 50 ||
              p === "¡Buen provecho!"
            );
            
            if ((instrCortas || instrSinDetalle || instrGenericas) && typeof asegurarInstruccionesEspanol === 'function') {
              const regenerada = asegurarInstruccionesEspanol([], actual);
              if (regenerada && regenerada.length > instr.length) {
                actual.instrucciones = regenerada;
                modificado = true;
              }
            }
          }
          
          if (semana[dia][tipo] && semana[dia][tipo].instrucciones && typeof asegurarInstruccionesEspanol === 'function') {
            const actual = semana[dia][tipo];
            const limpio = asegurarInstruccionesEspanol(actual.instrucciones, actual);
            if (limpio !== actual.instrucciones) {
              actual.instrucciones = limpio;
              modificado = true;
            }
          }
        });
      });
    }
    
    if (modificado) {
      try { guardarPlanSemanal(plan); } catch(e) {}
    }
    return plan;
  };

  // Carga de datos: re-ejecutar cuando cambia el usuario autenticado
  React.useEffect(() => {
    // Esperar a que auth termine de inicializar
    if (authUser === undefined) return;
    // Sin usuario → LoginScreen (no cargar datos)
    if (authUser === null) return;

    // Migrar roadmaps viejos (sin macrosGramos) a la nueva fórmula LBM-based
    if (window.NP_FatLoss && window.NP_FatLoss.migrar) {
      try { window.NP_FatLoss.migrar(); } catch (_) {}
    }

    const perfilGuardado = cargarPerfil();
    const planGuardado = cargarPlanSemanal();
    if (perfilGuardado && planGuardado) {
      setPerfil(perfilGuardado);
      setPlanSemanal(_sanitizarPlan(planGuardado, perfilGuardado));
      setPantalla("hoy");
      // Fase 6.2: pre-cargar recipes-extra en idle para que swap/regenerar sean instantáneos
      if (window.lazyRecipes && !window.lazyRecipes.estaCargado()) {
        var dispatch = window.requestIdleCallback || function(cb) { setTimeout(cb, 2000); };
        dispatch(function() { window.lazyRecipes.cargar().catch(function(e){ console.warn('[lazyRecipes]', e); mostrarToast('Modo offline — swap de recetas limitado', 'info'); }); });
      }
    } else if (perfilGuardado) {
      setPerfil(perfilGuardado);
      setPantalla("perfil");
    } else {
      setPantalla("perfil");
    }
  }, [authUser?.uid]);

  const mostrarToast = (mensaje, tipo = "success") => {
    setToast({ mensaje, tipo });
    setTimeout(() => setToast(null), 3000);
  };

  const handlePerfilComplete = async (perfilData) => {
    setPerfil(perfilData);
    setCargando(true);
    setMensajeCarga("Cargando recetario completo...");
    try {
      // Fase 6.2: cargar recipes-extra + upgrades lazy
      if (window.lazyRecipes && !window.lazyRecipes.estaCargado()) {
        await window.lazyRecipes.cargar();
      }
      setMensajeCarga("Generando plan semanal...");
      const plan = await generarPlanSemanalAsync(perfilData, perfilData.caloriasObjetivo, (msg) => setMensajeCarga(msg));
      setPlanSemanal(plan);
      guardarPlanSemanal(plan);
      if (plan._buscoOnline && plan._recetasOnlineUsadas > 0) {
        mostrarToast(`¡Plan generado con ${plan._recetasOnlineUsadas} recetas de internet!`);
      } else {
        mostrarToast("¡Tu plan semanal está listo! 🎉");
      }
      // Navegar al Plan para que el usuario vea lo que se generó
      setPantalla("plan");
    } catch (e) {
      console.error("Error generando plan:", e);
      // Fallback síncrono
      const plan = generarPlanSemanal(perfilData, perfilData.caloriasObjetivo);
      setPlanSemanal(plan);
      guardarPlanSemanal(plan);
      mostrarToast("Plan generado (modo offline)", "info");
      setPantalla("plan");
    } finally {
      setCargando(false);
      window.scrollTo(0, 0);
    }
  };

  const handleRegenerar = () => {
    setShowPrefModal(true); // abre modal de preferencias antes de regenerar
  };

  const handleRegenerarConPreferencias = async (prefs) => {
    setShowPrefModal(false);
    setPreferenciasGen(prefs);
    if (!perfil) return;
    setCargando(true);
    setMensajeCarga("Regenerando plan con recetas frescas...");
    try {
      // Fase 6.2: asegurar recipes-extra cargado
      if (window.lazyRecipes && !window.lazyRecipes.estaCargado()) {
        await window.lazyRecipes.cargar();
      }
      const nuevoPlan = await generarPlanSemanalAsync(perfil, perfil.caloriasObjetivo, (msg) => setMensajeCarga(msg), prefs);
      setPlanSemanal(nuevoPlan);
      guardarPlanSemanal(nuevoPlan);
      if (nuevoPlan._buscoOnline && nuevoPlan._recetasOnlineUsadas > 0) {
        mostrarToast(`¡Plan regenerado con ${nuevoPlan._recetasOnlineUsadas} recetas de internet!`);
      } else {
        mostrarToast("¡Plan regenerado con nuevas recetas!");
      }
    } catch (e) {
      console.error("Error regenerando plan:", e);
      const nuevoPlan = generarPlanSemanal(perfil, perfil.caloriasObjetivo, prefs);
      setPlanSemanal(nuevoPlan);
      guardarPlanSemanal(nuevoPlan);
      mostrarToast("Plan regenerado (modo offline)", "info");
    } finally {
      setCargando(false);
      window.scrollTo(0, 0);
    }
  };

  const handleRegenDay = async (dia, numSemana) => {
    numSemana = numSemana || 1;
    if (!perfil || !planSemanal) return;
    const tipos = ['desayuno', 'snack_am', 'almuerzo', 'snack_pm', 'cena'];
    setCargando(true);
    setMensajeCarga(`Regenerando ${dia}...`);
    try {
      let nuevoPlan = typeof _normalizarPlanMulti === 'function' ? _normalizarPlanMulti(planSemanal) : { ...planSemanal };
      for (const tipo of tipos) {
        nuevoPlan = await cambiarRecetaIndividualAsync(nuevoPlan, dia, tipo, perfil, perfil.caloriasObjetivo, null, numSemana);
      }
      setPlanSemanal(nuevoPlan);
      guardarPlanSemanal(nuevoPlan);
      mostrarToast(`${dia} regenerado con 5 recetas nuevas 🔄`);
    } catch(e) {
      console.error("Error regenerando día:", e);
      mostrarToast('Error al regenerar el día', 'error');
    } finally {
      setCargando(false);
    }
  };

  const handleCompartirPlan = async () => {
    if (!planSemanal || !perfil) return;
    const plan = typeof _normalizarPlanMulti === 'function' ? _normalizarPlanMulti(planSemanal) : planSemanal;
    const sem = plan.semana_1 || {};
    const DIAS = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
    const TIPOS_ICO = { desayuno: '🌅', snack_am: '🍎', almuerzo: '🍽️', snack_pm: '🍪', cena: '🌙' };
    const lineas = ['📋 Mi plan semanal - Calibrate', ''];
    DIAS.forEach(dia => {
      if (!sem[dia]) return;
      lineas.push(`📅 ${dia}`);
      Object.entries(TIPOS_ICO).forEach(([tipo, icon]) => {
        const r = sem[dia][tipo];
        if (r) lineas.push(`  ${icon} ${r.nombre || r.id}`);
      });
      lineas.push('');
    });
    lineas.push(`Generado con Calibrate · ${perfil.caloriasObjetivo} kcal/día`);
    const texto = lineas.join('\n');
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Mi plan semanal - Calibrate', text: texto });
      } else {
        await navigator.clipboard.writeText(texto);
        mostrarToast('Plan copiado al portapapeles 📋');
      }
    } catch(e) {
      if (e && e.name !== 'AbortError') {
        try { await navigator.clipboard.writeText(texto); mostrarToast('Plan copiado al portapapeles 📋'); }
        catch(e2) { mostrarToast('No se pudo compartir el plan', 'error'); }
      }
    }
  };

  // MEJORA 3: Swap individual (async con fallback online)
  const handleSwapRecipe = async (dia, tipoComida, numSemana) => {
    numSemana = numSemana || 1;
    if (perfil && planSemanal) {
      // Guardar receta actual en historial del slot ANTES del swap
      const semKeyPrev = 'semana_' + numSemana;
      const recetaAnterior = planSemanal[semKeyPrev]?.[dia]?.[tipoComida];
      if (recetaAnterior && recetaAnterior.id && typeof pushHistorialSlot === 'function') {
        pushHistorialSlot(dia, tipoComida, numSemana, recetaAnterior);
        setHistorialSlots(typeof cargarHistorialSlots === 'function' ? cargarHistorialSlots() : {});
      }

      setSwapping({ dia, tipoComida });
      try {
        const nuevoPlan = await cambiarRecetaIndividualAsync(
          planSemanal, dia, tipoComida, perfil, perfil.caloriasObjetivo,
          (msg) => setMensajeCarga(msg), numSemana
        );
        setPlanSemanal(nuevoPlan);
        guardarPlanSemanal(nuevoPlan);
        const tipoNombre = NOMBRES_COMIDAS[tipoComida] || tipoComida;
        const semKey = 'semana_' + numSemana;
        const recetaNueva = nuevoPlan[semKey]?.[dia]?.[tipoComida];
        if (recetaNueva && recetaNueva._fuente === 'online') {
          mostrarToast(`${tipoNombre} del ${dia} cambiado (internet) · revisa tus compras 🛒`);
        } else {
          mostrarToast(`${tipoNombre} del ${dia} cambiado · revisa tus compras 🛒`);
        }
      } catch (e) {
        console.error("Error cambiando receta:", e);
        const nuevoPlan = cambiarRecetaIndividual(planSemanal, dia, tipoComida, perfil, perfil.caloriasObjetivo, numSemana);
        setPlanSemanal(nuevoPlan);
        guardarPlanSemanal(nuevoPlan);
        mostrarToast(`Receta cambiada (modo offline)`, "info");
      } finally {
        setSwapping(null);
      }
    }
  };

  // Restaurar una receta anterior desde el historial del slot
  const handleRestoreRecipe = (dia, tipoComida, numSemana, receta) => {
    numSemana = numSemana || 1;
    if (!planSemanal || !receta) return;
    const semKey = 'semana_' + numSemana;
    const planNorm = typeof _normalizarPlanMulti === 'function' ? _normalizarPlanMulti(planSemanal) : planSemanal;
    const semana = planNorm[semKey];
    if (!semana) return;
    // Guardar la receta actual en historial antes de restaurar
    const actual = semana[dia]?.[tipoComida];
    if (actual && actual.id && typeof pushHistorialSlot === 'function') {
      pushHistorialSlot(dia, tipoComida, numSemana, actual);
    }
    const nuevoPlan = { ...planNorm };
    nuevoPlan[semKey] = { ...semana, [dia]: { ...semana[dia], [tipoComida]: receta } };
    setPlanSemanal(nuevoPlan);
    guardarPlanSemanal(nuevoPlan);
    setHistorialSlots(typeof cargarHistorialSlots === 'function' ? cargarHistorialSlots() : {});
    mostrarToast('Receta restaurada', 'success');
  };

  // Vetar receta actual y hacer swap automático
  const handleVetoRecipe = async (dia, tipoComida, numSemana, recetaId) => {
    numSemana = numSemana || 1;
    if (typeof vetoReceta === 'function') vetoReceta(recetaId);
    setVetadas(typeof cargarRecetasVetadas === 'function' ? cargarRecetasVetadas() : new Set());
    mostrarToast('Receta vetada — no volverá a aparecer', 'info');
    await handleSwapRecipe(dia, tipoComida, numSemana);
  };

  const handleEditarPerfil = () => { setPantalla("perfil"); window.scrollTo(0, 0); };
  const handleVolverAlPlan = () => { setPantalla("plan"); window.scrollTo(0, 0); };
  const handleReiniciar = async () => {
    if (!window.confirm('¿Reiniciar Calibrate? Se borrarán tu perfil, plan semanal y todos los registros. Esta acción no se puede deshacer.')) return;
    limpiarTodo(); // Limpia localStorage (con proxy: solo borra claves del usuario actual)
    // También borrar datos en Firestore
    if (window.NP_CloudStorage && window.NP_CloudStorage.active) {
      window.NP_CloudStorage.deleteAllData().catch(function(e) {
        console.warn('[Reiniciar] No se pudo limpiar Firestore:', e);
      });
    }
    setPerfil(null); setPlanSemanal(null); setPantalla("perfil");
    mostrarToast("Datos reiniciados correctamente", "info");
    window.scrollTo(0, 0);
  };
  const navegarA = (destino) => {
    // "tienda" es el nav label — internamente enruta a "despensa" por defecto
    const dest = destino === 'tienda' ? 'despensa' : destino;
    setPantalla(dest);
    window.scrollTo(0, 0);
  };
  // Exponer navegación y toast global para componentes profundos
  window._NP_nav = navegarA;
  window._NP_toast = mostrarToast;
  window._NP_setPlan = setPlanSemanal;

  // ─── Elementos globales (loading overlay + toast) ───
  const globalOverlays = (
    <React.Fragment>
      {cargando && <LoadingOverlay mensaje={mensajeCarga} darkMode={darkMode} />}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 toast px-6 py-3 rounded-xl shadow-lg text-white text-sm font-medium flex items-center gap-2 ${
          toast.tipo === "success" ? "bg-green-500" : toast.tipo === "info" ? "bg-blue-500" : "bg-red-500"
        }`}>
          <i className={`fas ${toast.tipo === "success" ? "fa-check-circle" : toast.tipo === "info" ? "fa-info-circle" : "fa-exclamation-circle"}`}></i>
          {toast.mensaje}
        </div>
      )}
    </React.Fragment>
  );

  // ─── Pantalla de carga mientras Firebase inicializa auth ───
  if (authUser === undefined) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-green-50 via-white to-emerald-50'}`}>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg" style={{animation: 'pulse-soft 1.5s infinite'}}>
            <i className="fas fa-seedling text-white text-2xl"></i>
          </div>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Verificando sesión…</p>
        </div>
      </div>
    );
  }

  // ─── Login screen si no hay usuario autenticado ───
  if (authUser === null && window.NP_Auth) {
    return <LoginScreen darkMode={darkMode} onToggleDark={toggleDarkMode} />;
  }

  if (pantalla === "loading") {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-green-50 via-white to-emerald-50'}`}>
        <div className="text-center" style={{animation: 'pulse-soft 1.5s infinite'}}>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg">
            <i className="fas fa-seedling text-white text-2xl"></i>
          </div>
          <p className="text-gray-500">Cargando Calibrate...</p>
        </div>
        {globalOverlays}
      </div>
    );
  }

  if (pantalla === "perfil") {
    return (
      <React.Fragment>
        <ProfileSetup
          onComplete={handlePerfilComplete}
          perfilInicial={perfil}
          darkMode={darkMode}
          onToggleDark={toggleDarkMode}
          onBack={planSemanal ? handleVolverAlPlan : null}
          tienePlan={!!planSemanal}
          lang={lang}
          onLangChange={changeLang} />
        {globalOverlays}
      </React.Fragment>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <header className={`sticky top-0 z-40 shadow-sm border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 brand-icon-bg rounded-lg flex items-center justify-center">
              <i className="fas fa-bullseye text-white text-sm"></i>
            </div>
            <span className={`font-bold text-lg tracking-tight ${darkMode ? 'text-white' : 'text-gray-800'}`}>Calibrate</span>
            {perfil && <span className="text-xs text-gray-400 hidden sm:inline">{perfil.caloriasObjetivo} kcal/día{perfil.numSemanas > 1 ? ` · ${perfil.numSemanas} sem` : ''}</span>}
          </div>
          <div className="flex items-center gap-1">
            {/* A1: aria-label en los 3 botones icono-only del header */}
            <button onClick={toggleDarkMode} aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className={`p-2 rounded-lg transition-colors ${darkMode ? 'text-yellow-400 hover:bg-gray-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}>
              <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'} text-sm`}></i>
            </button>
            <button onClick={handleEditarPerfil} aria-label="Editar perfil"
              className={`p-2 rounded-lg transition-colors ${darkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}>
              <i className="fas fa-user-pen text-sm"></i>
            </button>
            <button onClick={handleReiniciar} aria-label="Reiniciar Calibrate"
              className={`p-2 rounded-lg transition-colors ${darkMode ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}>
              <i className="fas fa-trash-alt text-sm"></i>
            </button>
            {/* Avatar de usuario → abre panel de cuenta */}
            {authUser && window.NP_Auth && (
              <div className="relative ml-1 pl-1 border-l border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowCuenta(v => !v)}
                  aria-label="Mi cuenta"
                  title={authUser.email}
                  className={`flex items-center gap-1.5 p-1 rounded-lg transition-colors cursor-pointer ${showCuenta ? (darkMode ? 'bg-gray-700' : 'bg-gray-100') : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}>
                  {authUser.photoURL
                    ? <img src={authUser.photoURL} alt={authUser.displayName || authUser.email}
                        className="w-7 h-7 rounded-full border-2 border-green-200 object-cover flex-shrink-0"
                        referrerPolicy="no-referrer" />
                    : <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${darkMode ? 'bg-green-700 text-green-100' : 'bg-green-100 text-green-700'}`}>
                        {(authUser.displayName || authUser.email || '?')[0].toUpperCase()}
                      </div>
                  }
                  <i className={`fas fa-chevron-down text-xs transition-transform ${showCuenta ? 'rotate-180' : ''} ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}></i>
                </button>
                {showCuenta && <CuentaModal authUser={authUser} darkMode={darkMode} onClose={() => setShowCuenta(false)} lang={lang} onLangChange={changeLang} />}
              </div>
            )}
          </div>
        </div>
      </header>

      <nav className={`border-b no-print ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <div className="max-w-3xl mx-auto px-4 overflow-x-auto">
          <div className="flex gap-1 py-2 min-w-max sm:min-w-0">
            {[
              { id: "hoy",      label: t("Hoy","Today"),           short: t("Hoy","Today"),    icon: "fa-house" },
              { id: "plan",     label: t("Plan","Plan"),           short: t("Plan","Plan"),    icon: "fa-calendar-days" },
              ...((perfil && (perfil.roadmap || perfil.roadmapMantenimiento || perfil.roadmapVolumen)) ? [
                { id: "fitness", label: "Fitness",                  short: "Fitness",           icon: "fa-dumbbell" }
              ] : []),
              { id: "cocinar",  label: t("Recetas","Recipes"),       short: t("Recetas","Recipes"), icon: "fa-utensils" },
              { id: "tienda",   label: t("Tienda","Store"),          short: t("Tienda","Store"),  icon: "fa-bag-shopping" }
            ].map(tab => (
              <button key={tab.id} onClick={() => navegarA(tab.id)}
                className={`nav-pill flex-shrink-0 sm:flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  pantalla === tab.id || (tab.id === 'tienda' && (pantalla === 'despensa' || pantalla === 'compras'))
                    ? 'nav-pill-active'
                    : darkMode
                      ? 'text-gray-500 hover:bg-gray-700 hover:text-gray-300'
                      : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                }`}>
                <i className={`fas ${tab.icon} text-xs`}></i>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden text-xs">{tab.short}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main key={pantalla} className="max-w-3xl mx-auto px-4 py-6 animate-fadeIn">
        {pantalla === "hoy" && (
          <HoyView perfil={perfil} darkMode={darkMode} planSemanal={planSemanal} onNavigate={navegarA} onSwapRecipe={handleSwapRecipe} swapping={swapping} onVetoRecipe={handleVetoRecipe} />
        )}
        {pantalla === "plan" && (planSemanal ? (
          <WeeklyPlan plan={planSemanal} perfil={perfil}
            onRecipeClick={(receta) => setRecetaSeleccionada(receta)}
            onRegenerate={handleRegenerar}
            onSwapRecipe={handleSwapRecipe}
            onRestoreRecipe={handleRestoreRecipe}
            onVetoRecipe={handleVetoRecipe}
            onRegenDay={handleRegenDay}
            onCompartir={handleCompartirPlan}
            historialSlots={historialSlots}
            darkMode={darkMode}
            swapping={swapping} />
        ) : (
          <div className={`rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-100'}`}>
            <EmptyState
              icon="fa-calendar-days"
              title="No tienes un plan todavía"
              desc="Completa tu perfil para que Calibrate genere tu plan semanal personalizado."
              cta={<><i className="fas fa-user-cog mr-1.5"></i>Ir al perfil</>}
              onCta={() => navegarA('perfil')}
              darkMode={darkMode}
            />
          </div>
        ))}
        {pantalla === "fitness" && (
          <FitnessTab perfil={perfil} darkMode={darkMode} />
        )}
        {pantalla === "cocinar" && (
          <CocinarTab darkMode={darkMode} onRecipeClick={(r) => setRecetaSeleccionada(r)} plan={planSemanal} factorComensales={factorComensales} />
        )}
        {(pantalla === "tienda" || pantalla === "despensa" || pantalla === "compras") && (() => {
          const tiendaSub = pantalla === "compras" ? "compras" : "despensa";
          const noHayPlan = !planSemanal;
          return (
            <div className="animate-fadeIn">
              {/* Sub-tab switcher */}
              <div className={`flex gap-2 mb-4 p-1 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <button
                  onClick={() => navegarA('despensa')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    tiendaSub === 'despensa'
                      ? 'nav-pill-active'
                      : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                  }`}>
                  <i className="fas fa-warehouse text-sm"></i>
                  {t('Despensa','Pantry')}
                </button>
                <button
                  onClick={() => navegarA('compras')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    tiendaSub === 'compras'
                      ? 'nav-pill-active'
                      : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                  }`}>
                  <i className="fas fa-cart-shopping text-sm"></i>
                  {t('Compras','Shopping')}
                </button>
              </div>

              {noHayPlan ? (
                <div className="cal-empty-state">
                  <div className="cal-empty-state__icon">
                    <i className={`fas ${tiendaSub === 'compras' ? 'fa-cart-shopping' : 'fa-warehouse'}`}></i>
                  </div>
                  <p className="cal-empty-state__title">Primero genera tu plan</p>
                  <p className="cal-empty-state__desc">
                    {tiendaSub === 'compras'
                      ? 'Tu lista de compras aparece aquí una vez que tengas un plan semanal activo.'
                      : 'Tu despensa aparece aquí una vez que tengas un plan semanal activo.'}
                  </p>
                  <button onClick={() => navegarA('plan')}
                    className="mt-3 px-5 py-2.5 rounded-xl text-sm font-semibold bg-green-500 text-white hover:bg-green-600 transition-colors flex items-center gap-2">
                    <i className="fas fa-calendar-days"></i>Ir al Plan
                  </button>
                </div>
              ) : tiendaSub === 'compras'
                ? <ShoppingList plan={planSemanal} darkMode={darkMode} />
                : <Pantry plan={planSemanal} onNavigateToShopping={() => navegarA("compras")} darkMode={darkMode} />
              }
            </div>
          );
        })()}
      </main>

      <footer className={`text-center py-6 text-xs no-print ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        <p>Calibrate · El método, no la motivación.</p>
        <p className="mt-1">calibrate.cl</p>
      </footer>

      {showPrefModal && (
        <ModalPreferenciasGeneracion
          darkMode={darkMode}
          onConfirm={handleRegenerarConPreferencias}
          onCancel={() => setShowPrefModal(false)}
        />
      )}

      {recetaSeleccionada && <RecipeModal receta={recetaSeleccionada} onClose={() => setRecetaSeleccionada(null)} darkMode={darkMode} factorComensales={factorComensales} usaThermomix={perfil?.usaThermomix !== false} />}

      {globalOverlays}
    </div>
  );
}

// ─── Error Boundary para no dejar la pantalla en blanco ───
class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('[App Error]', error, info);
  }
  render() {
    if (this.state.hasError) {
      return React.createElement('div', {
        style: { padding: '24px', fontFamily: 'Inter, system-ui, sans-serif', maxWidth: '600px', margin: '40px auto' }
      },
        React.createElement('h1', { style: { color: '#C0523A', marginBottom: '12px' } }, 'Error al cargar Calibrate'),
        React.createElement('p', { style: { color: '#374151', marginBottom: '8px' } }, 'Mensaje: ' + (this.state.error && this.state.error.message || 'desconocido')),
        React.createElement('pre', { style: { background: '#f3f4f6', padding: '12px', borderRadius: '8px', fontSize: '12px', overflow: 'auto', maxHeight: '200px' } }, this.state.error && this.state.error.stack || ''),
        React.createElement('button', {
          onClick: function() {
            try {
              localStorage.clear();
              if ('caches' in window) caches.keys().then(function(ks) { ks.forEach(function(k) { caches.delete(k); }); });
              indexedDB.deleteDatabase('nutriplan_bundle_cache');
              if (navigator.serviceWorker && navigator.serviceWorker.getRegistrations) {
                navigator.serviceWorker.getRegistrations().then(function(regs) {
                  regs.forEach(function(r) { r.unregister(); });
                  setTimeout(function() { window.location.reload(true); }, 500);
                });
              } else {
                window.location.reload(true);
              }
            } catch (e) { window.location.reload(true); }
          },
          style: { marginTop: '16px', padding: '10px 24px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }
        }, '🔄 Limpiar caché y reintentar')
      );
    }
    return this.props.children;
  }
}

// ─── Mount React App ───
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(AppErrorBoundary, null, React.createElement(App)));
