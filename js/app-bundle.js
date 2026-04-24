/* ============================================
   NutriPlan - App Bundle (todos los componentes React)
   Este archivo se procesa con Babel standalone
   MEJORAS: Dark mode, día actual, swap individual,
   unidades de compra, historial 14 días
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

// =============================================
// COMPONENTE: ProfileSetup
// =============================================
function ProfileSetup({ onComplete, perfilInicial, darkMode, onToggleDark, onBack, tienePlan }) {
  const [perfil, setPerfil] = React.useState(perfilInicial || {
    edad: "",
    genero: "masculino",
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
    // Fase 4 extra: modo "recetas rápidas" <= 25 min totales
    soloRapidas: false,
    maxTiempoMin: 25,
    // Fase 4 - Punto 16: modo sobras (cena día N → almuerzo día N+1)
    modoSobras: false
  });

  const [tdeeInfo, setTdeeInfo] = React.useState(null);
  const [errores, setErrores] = React.useState({});
  const [macroError, setMacroError] = React.useState("");
  const [usarCaloriasManual, setUsarCaloriasManual] = React.useState(
    perfilInicial && perfilInicial.caloriasManual ? true : false
  );

  React.useEffect(() => {
    const { peso, altura, edad, genero, nivelActividad, objetivo } = perfil;
    if (peso > 0 && altura > 0 && edad > 0) {
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

  const handleObjetivoChange = (objetivo) => {
    const macrosCustom = cargarMacrosCustom();
    const macros = (macrosCustom && macrosCustom[objetivo])
      ? macrosCustom[objetivo]
      : { ...MACROS_PREDETERMINADOS[objetivo] };
    setPerfil(prev => ({ ...prev, objetivo, macros }));
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
    if (!usarCaloriasManual) {
      if (!perfil.edad || perfil.edad < 15 || perfil.edad > 100) err.edad = "Edad debe ser entre 15 y 100 años";
      if (!perfil.peso || perfil.peso < 30 || perfil.peso > 300) err.peso = "Peso debe ser entre 30 y 300 kg";
      if (!perfil.altura || perfil.altura < 100 || perfil.altura > 250) err.altura = "Altura debe ser entre 100 y 250 cm";
    } else {
      if (!perfil.caloriasManual || perfil.caloriasManual < 800 || perfil.caloriasManual > 6000) err.caloriasManual = "Calorías debe ser entre 800 y 6000 kcal";
    }
    const sumaMacros = perfil.macros.proteinas + perfil.macros.carbohidratos + perfil.macros.grasas;
    if (sumaMacros !== 100) err.macros = "Los macros deben sumar exactamente 100%";
    setErrores(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;
    const excluidos = perfil.ingredientesExcluidosTexto
      .split(",").map(i => i.trim()).filter(i => i.length > 0);
    const perfilFinal = {
      ...perfil,
      edad: perfil.edad ? parseFloat(perfil.edad) : 0,
      peso: perfil.peso ? parseFloat(perfil.peso) : 0,
      altura: perfil.altura ? parseFloat(perfil.altura) : 0,
      ingredientesExcluidos: excluidos,
      tdee: tdeeInfo.tdee,
      caloriasObjetivo: tdeeInfo.caloriasObjetivo,
      caloriasManual: usarCaloriasManual ? parseFloat(perfil.caloriasManual) : "",
      numSemanas: perfil.numSemanas || 1
    };
    guardarPerfil(perfilFinal);
    guardarMacrosCustom({ [perfil.objetivo]: perfil.macros });
    onComplete(perfilFinal);
  };

  return (
    <div className={`min-h-screen py-8 px-4 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-green-50 via-white to-emerald-50'}`}>
      <div className="max-w-2xl mx-auto animate-fadeIn">
        <div className="text-center mb-8">
          <div className="flex justify-between mb-4">
            {tienePlan && onBack ? (
              <button onClick={onBack} className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2 ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                <i className="fas fa-arrow-left"></i>Volver al plan
              </button>
            ) : <div></div>}
            <button onClick={onToggleDark} className={`p-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} title="Alternar modo oscuro">
              <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>
          </div>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg">
            <i className="fas fa-seedling text-white text-2xl"></i>
          </div>
          <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>NutriPlan</h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{tienePlan ? 'Editá tu perfil nutricional' : 'Configurá tu perfil nutricional para comenzar'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          {/* Objetivo */}
          <div className={`rounded-2xl shadow-sm border p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              <i className="fas fa-bullseye text-green-500"></i>
              Objetivo
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Object.entries(AJUSTES_OBJETIVO).map(([key, info]) => (
                <button key={key} type="button" onClick={() => handleObjetivoChange(key)}
                  className={`p-4 rounded-xl text-center transition-all ${
                    perfil.objetivo === key
                      ? 'bg-green-500 text-white shadow-lg shadow-green-200'
                      : darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}>
                  <div className="text-2xl mb-1">{key === 'perdida' ? '📉' : key === 'mantenimiento' ? '⚖️' : '📈'}</div>
                  <div className="font-medium text-sm">{info.label}</div>
                  <div className={`text-xs mt-1 ${perfil.objetivo === key ? 'text-green-100' : 'text-gray-400'}`}>
                    {info.valor > 0 ? '+' : ''}{info.valor} kcal
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Calorías Objetivo Manual */}
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
                  <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    <i className="fas fa-info-circle mr-1"></i>
                    Ingresá directamente tu objetivo calórico sin depender del cálculo TDEE. Rango: 800–6000 kcal.
                  </p>
                </div>
              )}
              {!usarCaloriasManual && (
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  <i className="fas fa-info-circle mr-1"></i>
                  Las calorías se calculan según tus datos personales, nivel de actividad y objetivo.
                </p>
              )}
            </div>
          </div>

          {/* Macros Editables */}
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
            <div className="mt-4 h-4 rounded-full overflow-hidden flex bg-gray-200">
              <div className="bg-blue-500 transition-all" style={{ width: `${perfil.macros.proteinas}%` }}></div>
              <div className="bg-amber-500 transition-all" style={{ width: `${perfil.macros.carbohidratos}%` }}></div>
              <div className="bg-rose-500 transition-all" style={{ width: `${perfil.macros.grasas}%` }}></div>
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
                <span className="text-xl">⚡</span>
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
                <span className="text-xl">♻️</span>
                <div className="flex-1">
                  <div className="text-sm font-medium">Modo sobras (cocinar 1 vez, comer 2)</div>
                  <div className="text-xs opacity-75">La cena del día N pasa como almuerzo del día N+1. Ahorra 6 cocciones por semana.</div>
                </div>
                {perfil.modoSobras && <i className="fas fa-check text-indigo-700"></i>}
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

          {/* Panel TDEE */}
          {tdeeInfo && (
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
                    <div className="text-3xl font-extrabold">{tdeeInfo.caloriasObjetivo}</div>
                    <div className="text-xs opacity-80">kcal/día</div>
                  </div>
                </div>
              ) : (
                <div className="bg-white/30 rounded-xl p-4 text-center backdrop-blur-sm">
                  <div className="text-xs opacity-80">Calorías Objetivo (manual)</div>
                  <div className="text-4xl font-extrabold mt-1">{tdeeInfo.caloriasObjetivo}</div>
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

          <button type="submit" disabled={!tdeeInfo || macroError}
            className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
              tdeeInfo && !macroError
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 active:scale-[0.98]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}>
            <i className="fas fa-calendar-alt mr-2"></i>
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
      <div className={`p-8 text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
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
            <div className="text-[10px] text-gray-500">bases en lote</div>
          </div>
          <div className={`rounded-lg p-2 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-xl font-bold text-amber-600">{resultado.tiempo_batch_min} min</div>
            <div className="text-[10px] text-gray-500">domingo en cocina</div>
          </div>
          <div className={`rounded-lg p-2 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-xl font-bold text-emerald-600">-{resultado.ahorro_porcentaje}%</div>
            <div className="text-[10px] text-gray-500">ahorro semanal</div>
          </div>
        </div>
      </div>

      {resultado.total_bases === 0 && (
        <div className={`text-center py-12 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
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
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${color.bg} ${color.text}`}>
                          <i className={`fas ${color.icon} mr-1`}></i>{base.categoria}
                        </span>
                        <span className="text-[10px] text-gray-400">{base.num_usos} usos · {base.tiempo_batch_min} min</span>
                      </div>
                      <h4 className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {base.nombre_display}
                      </h4>
                      <div className="text-xs text-gray-500 mt-0.5">
                        Total a cocinar: <strong>{Math.round(base.cantidad_total)}{base.unidad}</strong>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`text-[10px] mt-2 mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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
                            <span className={`absolute left-0 top-0 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center ${color.bg} ${color.text}`}>
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
          <div className={`text-[10px] uppercase font-semibold my-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Presets rápidos</div>
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
                <div className="text-[9px] text-gray-400">{p.f}</div>
              </button>
            ))}
          </div>

          <div className={`text-[10px] uppercase font-semibold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Comensales</div>
          <div className="space-y-1 mb-2">
            {estado.comensales.map(c => (
              <div key={c.id} className={`flex items-center gap-2 p-2 rounded-lg ${darkMode ? 'bg-gray-700/40' : 'bg-gray-50'} ${c.activo === false ? 'opacity-50' : ''}`}>
                <button onClick={() => toggleActivo(c.id)}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${c.activo !== false ? 'bg-emerald-500 border-emerald-500' : darkMode ? 'border-gray-500' : 'border-gray-300'}`}>
                  {c.activo !== false && <i className="fas fa-check text-white text-[9px]"></i>}
                </button>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{c.nombre}</div>
                  <div className="text-[10px] text-gray-400">{c.tipo === 'nino' ? 'Niño/a' : 'Adulto'} · ×{c.factor}</div>
                </div>
                {c.id !== 'camilo' && (
                  <button onClick={() => quitar(c.id)} className="text-gray-400 hover:text-red-500 text-xs">
                    <i className="fas fa-times"></i>
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
          <div className={`grid grid-cols-3 gap-2 my-3 text-center text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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
                        <div className="text-[10px] text-gray-400">
                          {Math.round(base.cantidad_total)} {base.unidad} · {base.num_usos} usos · {labelCategoria(base.categoria)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-orange-500 font-semibold">{base.tiempo_batch_min}′</span>
                      <i className={`fas fa-chevron-${estaExpandido ? 'up' : 'down'} text-gray-400 text-xs`}></i>
                    </div>
                  </button>

                  {estaExpandido && (
                    <div className={`px-3 pb-3 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                      <div className={`text-[10px] uppercase font-semibold mt-2 mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Preparación en lote:
                      </div>
                      <ol className={`space-y-1 text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'} list-decimal list-inside`}>
                        {base.instrucciones_batch.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                      <div className={`mt-3 text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <i className="fas fa-utensils mr-1"></i>Se usa en:
                        <div className="flex flex-wrap gap-1 mt-1">
                          {base.apariciones.map((ap, i) => (
                            <span key={i} className={`px-2 py-0.5 rounded text-[10px] ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600 border border-gray-200'}`}>
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
      <div className={`p-8 text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
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
      alert(`"${receta.nombre}" guardada. Estará disponible en tu próximo plan.`);
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
        <div className={`text-center py-12 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
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
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-purple-100 text-purple-700">
                        <i className="fas fa-wand-magic-sparkles mr-1"></i>{cocina?.display}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">
                        {tecnica?.display}
                      </span>
                    </div>
                    <h4 className={`font-semibold text-sm ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{r.nombre}</h4>
                    <div className="flex flex-wrap gap-2 mt-1.5 text-[10px]">
                      <span className="text-gray-500"><i className="fas fa-fire text-orange-400 mr-1"></i>{r.calorias_base} kcal</span>
                      <span className="text-blue-500">P: {r.proteinas_g}g</span>
                      <span className="text-amber-600">C: {r.carbohidratos_g}g</span>
                      <span className="text-rose-500">G: {r.grasas_g}g</span>
                      <span className="text-indigo-500"><i className="fas fa-clock mr-1"></i>{r.tiempo_total_min}′</span>
                      {r.costo_clp > 0 && (
                        <span className="text-emerald-600"><i className="fas fa-coins mr-1"></i>${r.costo_clp.toLocaleString('es-CL')}</span>
                      )}
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); guardarReceta(r); }}
                    className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${darkMode ? 'text-gray-400 hover:text-green-400 hover:bg-gray-700' : 'text-gray-400 hover:text-green-600 hover:bg-green-50'}`}
                    title="Guardar en mi catálogo">
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
    <div className={`mt-6 rounded-2xl p-4 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`text-xs font-semibold uppercase tracking-wide ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <i className="fas fa-clipboard-check mr-1"></i>Adherencia 7 días
        </div>
        <div className={`text-2xl font-bold text-${color}-500`}>{stats.porcentaje}%</div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
        <div className={`px-2 py-1.5 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="font-bold text-emerald-500">{stats.cumplidos}</div>
          <div className="text-[10px] text-gray-400">cumplidas</div>
        </div>
        <div className={`px-2 py-1.5 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className={`font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{stats.kcal_cumplidas.toLocaleString('es-CL')}</div>
          <div className="text-[10px] text-gray-400">kcal ✓</div>
        </div>
        <div className={`px-2 py-1.5 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="font-bold text-rose-500">{stats.kcal_perdidas.toLocaleString('es-CL')}</div>
          <div className="text-[10px] text-gray-400">kcal perdidas</div>
        </div>
      </div>
      {/* Mini gráfico 7 días */}
      <div className="flex items-end justify-between gap-1 h-14">
        {historial.map((d, idx) => {
          const altura = d.porcentaje != null ? Math.max(4, d.porcentaje * 0.5) : 0;
          const colorBar = d.porcentaje == null ? 'bg-gray-300' : d.porcentaje >= 80 ? 'bg-emerald-500' : d.porcentaje >= 50 ? 'bg-amber-500' : 'bg-rose-400';
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex items-end h-10">
                <div className={`w-full rounded-t ${colorBar} ${darkMode && d.porcentaje == null ? 'bg-gray-600' : ''}`}
                  style={{height: `${altura}px`, minHeight: d.porcentaje != null ? '4px' : '2px'}}
                  title={d.porcentaje != null ? `${d.porcentaje}% (${d.cumplidos}/${d.total})` : 'Sin registro'}></div>
              </div>
              <div className="text-[9px] text-gray-400">{d.dia_semana}</div>
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
function ReverseSearch({ darkMode, onRecipeClick }) {
  const [ingredientesSeleccionados, setIngredientesSeleccionados] = React.useState([]);
  const [inputQuery, setInputQuery] = React.useState('');
  const [sugerencias, setSugerencias] = React.useState([]);
  const [minMatch, setMinMatch] = React.useState(0.4);

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
                <button onClick={() => quitarIngrediente(ing.normalizado)} className="hover:text-red-500">
                  <i className="fas fa-times"></i>
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
        <div className={`text-center py-12 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          <i className="fas fa-utensils text-4xl mb-3"></i>
          <p className="text-sm">Agrega ingredientes para ver recetas</p>
        </div>
      )}

      {ingredientesSeleccionados.length > 0 && resultados.length === 0 && (
        <div className={`text-center py-12 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
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
              return (
                <div key={idx} onClick={() => onRecipeClick(recetaConEscala)}
                  className={`cursor-pointer rounded-xl p-3 border transition-all hover:shadow-md ${darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-100 hover:bg-gray-50'}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium bg-${color}-100 text-${color}-700`}>
                          {NOMBRES_COMIDAS[r.receta.tipo_comida]}
                        </span>
                        <span className={`text-[10px] font-bold text-${color}-500`}>{r.porcentaje}% match</span>
                      </div>
                      <h4 className={`font-semibold text-sm ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{r.receta.nombre}</h4>
                      <div className="flex flex-wrap gap-2 mt-1.5 text-[10px]">
                        <span className="text-gray-500"><i className="fas fa-fire text-orange-400 mr-1"></i>{r.receta.calorias_base} kcal</span>
                        {r.receta.tiempo_total_min > 0 && (
                          <span className="text-indigo-500"><i className="fas fa-clock mr-1"></i>{r.receta.tiempo_total_min}′</span>
                        )}
                        {r.receta.costo_clp > 0 && (
                          <span className="text-emerald-600"><i className="fas fa-coins mr-1"></i>${r.receta.costo_clp.toLocaleString('es-CL')}</span>
                        )}
                      </div>
                      {r.faltantes.length > 0 && (
                        <div className={`text-[10px] mt-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          <span className="font-medium">Te falta:</span> {r.faltantes.slice(0, 4).join(', ')}
                          {r.faltantes.length > 4 && ` +${r.faltantes.length - 4} más`}
                        </div>
                      )}
                    </div>
                    <i className="fas fa-chevron-right text-gray-300 text-sm mt-1"></i>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// =============================================
// COMPONENTE: WeeklyPlan (MEJORAS 2 y 3)
// =============================================
function WeeklyPlan({ plan, perfil, onRecipeClick, onRegenerate, onSwapRecipe, darkMode, swapping }) {
  // Multi-semana: normalizar plan
  const planNorm = typeof _normalizarPlanMulti === 'function' ? _normalizarPlanMulti(plan) : plan;
  const numSemanas = planNorm._numSemanas || 1;
  const [semanaActiva, setSemanaActiva] = React.useState(1);
  const [forceUpdate, setForceUpdate] = React.useState(0);
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
  const macrosObj = calcularMacrosEnGramos(caloriasObj, perfil.macros);

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

  return (
    <div className="animate-fadeIn">
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
                    <span className={`inline-block px-1.5 py-0.5 text-[10px] font-bold rounded-full leading-none ${
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
          <h3 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>{diaSeleccionado}</h3>
          <div className="text-right">
            <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{resumen.calorias}</div>
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
              <div className="text-[10px] text-gray-400">
                Prep {resumen.tiempo_prep_min}′ + Cocción {resumen.tiempo_coccion_min}′
              </div>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
            <i className="fas fa-coins text-amber-500"></i>
            <div className="flex-1">
              <div className={`text-sm font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                ${resumen.costo_clp.toLocaleString('es-CL')} CLP
              </div>
              <div className="text-[10px] text-gray-400">Costo estimado del día</div>
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
          return (
            <div key={tipo} className={`meal-card rounded-xl p-4 border relative ${
              yaComido ? (darkMode ? 'bg-emerald-900/30 border-emerald-700' : 'bg-emerald-50 border-emerald-300')
              : yaMarcadoNo ? (darkMode ? 'bg-gray-800/50 border-gray-600 opacity-60' : 'bg-gray-100 border-gray-300 opacity-70')
              : (darkMode ? colores.bgDark + ' ' + colores.borderDark : colores.bg + ' ' + colores.border)
            }`}>
              {/* Checkbox de adherencia */}
              <div className="absolute top-2 right-2 flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (typeof window.adherencia !== 'undefined') {
                      window.adherencia.marcar(diaSeleccionado, tipo, !yaComido, {
                        kcal_plan: comida.calorias_escaladas,
                        proteinas_plan: comida.proteinas_escaladas,
                        nombre: comida.nombre
                      }, semanaActiva);
                      setForceUpdate(x => x + 1);
                    }
                  }}
                  className={`w-6 h-6 flex items-center justify-center rounded-full text-xs transition-all ${
                    yaComido
                      ? 'bg-emerald-500 text-white'
                      : darkMode ? 'bg-gray-700 text-gray-400 hover:text-emerald-400' : 'bg-white/70 text-gray-400 hover:text-emerald-600'
                  }`}
                  title={yaComido ? 'Marcado como comido' : 'Marcar como comido'}>
                  <i className="fas fa-check text-[10px]"></i>
                </button>
              </div>
              <div className="flex items-start justify-between">
                <div className="flex-1" onClick={() => onRecipeClick(comida)}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`${colores.badge} px-2 py-0.5 rounded-lg text-xs font-medium`}>
                      <i className={`fas ${iconosComida[tipo]} mr-1`}></i>{NOMBRES_COMIDAS[tipo]}
                    </span>
                    {comida._fuente === 'online' && (
                      <span className="online-badge"><i className="fas fa-globe mr-1"></i>Internet</span>
                    )}
                    {(tipo === 'almuerzo' || tipo === 'cena') && comida.instrucciones_thermomix && comida.instrucciones_thermomix.length > 0 && (
                      <span className="thermomix-badge">TM6</span>
                    )}
                    {comida.es_sobra && (
                      <span className="px-2 py-0.5 rounded-lg text-xs font-medium bg-indigo-100 text-indigo-700 border border-indigo-300" title={`De la cena del ${comida.sobra_origen?.dia || 'día anterior'}`}>
                        ♻️ Sobra
                      </span>
                    )}
                    {comida.genera_sobra && (
                      <span className="px-2 py-0.5 rounded-lg text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-300" title="Cocina doble porción: una para hoy y otra para mañana">
                        ×2 porciones
                      </span>
                    )}
                  </div>
                  <h4 className={`font-semibold text-sm mt-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{comida.nombre}</h4>
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
                          <i className="fas fa-coins mr-1"></i>${Math.round((comida.costo_clp || 0) * (comida.factor_escala || 1) * factorComensales).toLocaleString('es-CL')}
                          {factorComensales !== 1 && <span className="text-[9px] text-teal-500 ml-1">×{factorComensales.toFixed(2)}</span>}
                        </span>
                      )}
                      {/* % del objetivo calórico diario */}
                      <span className="text-xs text-gray-400">
                        {Math.round((comida.calorias_escaladas / caloriasObj) * 100)}% del día
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 ml-2">
                  {/* MEJORA 3: Swap button con loading */}
                  <button onClick={(e) => handleSwap(e, diaSeleccionado, tipo)}
                    disabled={swapping && swapping.dia === diaSeleccionado && swapping.tipoComida === tipo}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
                      swapping && swapping.dia === diaSeleccionado && swapping.tipoComida === tipo
                        ? 'text-green-500 cursor-wait'
                        : darkMode ? 'text-gray-400 hover:text-green-400 hover:bg-gray-700' : 'text-gray-400 hover:text-green-600 hover:bg-white'
                    }`} title="Cambiar receta">
                    <i className={`fas ${swapping && swapping.dia === diaSeleccionado && swapping.tipoComida === tipo ? 'fa-spinner fa-spin' : 'fa-shuffle'} text-sm`}></i>
                  </button>
                  <div className="text-gray-300 cursor-pointer" onClick={() => onRecipeClick(comida)}>
                    <i className="fas fa-chevron-right text-sm"></i>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Batch cooking */}
      {typeof window.batchCooking !== 'undefined' && (
        <BatchCookingPanel planSemanal={plan} semanaActiva={semanaActiva} darkMode={darkMode} factorComensales={factorComensales} />
      )}

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
              <div className="text-[10px] text-gray-400">
                Prep {totalesSemana.tiempo_prep_min}′ + Cocción {totalesSemana.tiempo_coccion_min}′
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <i className="fas fa-coins text-amber-500 text-lg"></i>
            <div>
              <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                ${Math.round(totalesSemana.costo_clp * factorComensales).toLocaleString('es-CL')}
              </div>
              <div className="text-[10px] text-gray-400">
                ~${Math.round(totalesSemana.costo_clp * factorComensales / 7).toLocaleString('es-CL')}/día
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

          {/* Fase 5.4: Export PDF */}
          {typeof window.exports !== 'undefined' && window.exports.planPDF && (
            <button
              onClick={async (e) => {
                const btn = e.currentTarget;
                btn.disabled = true;
                const original = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando...';
                try {
                  const fComensales = (window.perfilesManager && window.perfilesManager.factorTotal && window.perfilesManager.factorTotal()) || 1;
                  const r = await window.exports.planPDF(plan, { ...perfil, caloriasObjetivo: perfil?.caloriasObjetivo || 2000 }, { factorComensales: fComensales });
                  console.log('[Export PDF]', r);
                } catch (err) {
                  alert('Error al generar PDF: ' + err.message);
                } finally {
                  btn.disabled = false;
                  btn.innerHTML = original;
                }
              }}
              className={`inline-flex items-center gap-2 px-6 py-3 border rounded-xl transition-all text-sm font-medium ${
                darkMode ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}>
              <i className="fas fa-file-pdf text-rose-500"></i>Exportar PDF
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
                <i className="fas fa-chevron-down text-[10px]"></i>
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
        </div>
        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          <i className="fas fa-info-circle mr-1"></i>El calendario exporta desde el próximo lunes. Abre el .ics con Google Calendar, Apple Calendar u Outlook.
        </p>
      </div>
    </div>
  );
}


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
// COMPONENTE: RecipeModal
// =============================================
function RecipeModal({ receta, onClose, darkMode, factorComensales }) {
  if (!receta) return null;
  const factor = factorComensales || 1;
  const tieneThermomix = receta.instrucciones_thermomix && receta.instrucciones_thermomix.length > 0;
  const [tabActiva, setTabActiva] = React.useState("normal");
  const [sustitucionAbierta, setSustitucionAbierta] = React.useState(null); // nombre_normalizado del ing abierto
  const [sustitucionAplicada, setSustitucionAplicada] = React.useState(null); // preview

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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 modal-overlay" onClick={onClose}>
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
              <h2 className="text-lg font-bold leading-tight">{receta.nombre}</h2>
            </div>
            <button onClick={onClose}
              className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-full hover:bg-white/30 transition-colors flex-shrink-0">
              <i className="fas fa-times text-sm"></i>
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-4">
            <div className="bg-white/15 rounded-xl p-2 text-center backdrop-blur-sm">
              <div className="text-lg font-bold">{receta.calorias_escaladas}</div>
              <div className="text-xs opacity-80">kcal</div>
            </div>
            <div className="bg-blue-400/30 rounded-xl p-2 text-center backdrop-blur-sm">
              <div className="text-lg font-bold">{receta.proteinas_escaladas}</div>
              <div className="text-xs opacity-80">Prot. (g)</div>
            </div>
            <div className="bg-amber-400/30 rounded-xl p-2 text-center backdrop-blur-sm">
              <div className="text-lg font-bold">{receta.carbohidratos_escalados}</div>
              <div className="text-xs opacity-80">Carb. (g)</div>
            </div>
            <div className="bg-rose-400/30 rounded-xl p-2 text-center backdrop-blur-sm">
              <div className="text-lg font-bold">{receta.grasas_escaladas}</div>
              <div className="text-xs opacity-80">Grasas (g)</div>
            </div>
          </div>
          <div className="text-xs opacity-70 mt-2 text-center">
            Factor de escala: ×{receta.factor_escala} (base: {receta.calorias_base} kcal)
          </div>
          {/* Tiempo + costo en el header del modal */}
          {(receta.tiempo_total_min || receta.costo_clp) && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              {receta.tiempo_prep_min != null && (
                <div className="bg-white/15 rounded-lg p-2 text-center backdrop-blur-sm">
                  <div className="text-sm font-bold"><i className="fas fa-knife-kitchen mr-1 text-xs"></i>{receta.tiempo_prep_min}′</div>
                  <div className="text-[10px] opacity-80">Preparación</div>
                </div>
              )}
              {receta.tiempo_coccion_min != null && (
                <div className="bg-white/15 rounded-lg p-2 text-center backdrop-blur-sm">
                  <div className="text-sm font-bold"><i className="fas fa-fire mr-1 text-xs"></i>{receta.tiempo_coccion_min}′</div>
                  <div className="text-[10px] opacity-80">Cocción</div>
                </div>
              )}
              {receta.costo_clp > 0 && (
                <div className="bg-white/15 rounded-lg p-2 text-center backdrop-blur-sm">
                  <div className="text-sm font-bold">${Math.round((receta.costo_clp || 0) * (receta.factor_escala || 1) * factor).toLocaleString('es-CL')}</div>
                  <div className="text-[10px] opacity-80">CLP{factor !== 1 ? ` · ×${factor.toFixed(2)}` : ''}</div>
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
        </div>

        <div className="flex-1 overflow-y-auto">
          {receta._imagen && (
            <div className="relative h-40 overflow-hidden">
              <img src={receta._imagen} alt={receta.nombre} className="w-full h-full object-cover" 
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
                        <span className={`text-sm capitalize truncate ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{ing.nombre_display || ing.nombre}</span>
                        {tieneSustitutos && (
                          <button
                            onClick={() => setSustitucionAbierta(estaAbierto ? null : ing.nombre_normalizado)}
                            className={`text-xs px-1.5 py-0.5 rounded transition-colors ${
                              estaAbierto
                                ? 'bg-indigo-500 text-white'
                                : darkMode ? 'text-indigo-400 hover:bg-indigo-900/40' : 'text-indigo-600 hover:bg-indigo-50'
                            }`}
                            title="Ver sustitutos">
                            <i className="fas fa-right-left text-[10px]"></i> {sustitutos.length}
                          </button>
                        )}
                      </div>
                      <span className={`text-sm font-medium px-2 py-0.5 rounded-lg whitespace-nowrap ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-900'}`}>
                        {formatearCantidad((ing.cantidad_escalada || 0) * factor, typeof traducirUnidad === 'function' ? traducirUnidad(ing.unidad) : ing.unidad, ing.nombre_normalizado)}
                      </span>
                    </div>
                    {estaAbierto && tieneSustitutos && (
                      <div className={`ml-3 mt-1 mb-2 p-3 rounded-lg border-l-2 border-indigo-400 ${darkMode ? 'bg-indigo-950/30' : 'bg-indigo-50/70'}`}>
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
                                    <div className={`font-semibold capitalize ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                      {s.id.replace(/_/g, ' ')}
                                    </div>
                                    <div className={`text-[10px] mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{s.nota}</div>
                                  </div>
                                  {calc && (
                                    <div className="text-right whitespace-nowrap">
                                      <div className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {calc.cantidad_nueva}{ing.unidad}
                                      </div>
                                      <div className={`text-[10px] font-medium ${calc.delta_kcal > 0 ? 'text-rose-500' : calc.delta_kcal < 0 ? 'text-emerald-500' : 'text-gray-400'}`}>
                                        {calc.delta_kcal > 0 ? '+' : ''}{calc.delta_kcal} kcal
                                      </div>
                                    </div>
                                  )}
                                </div>
                                {calc && (
                                  <div className="flex gap-2 mt-1.5 text-[10px]">
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
                              </div>
                            );
                          })}
                        </div>
                        <div className={`text-[10px] mt-2 italic ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
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
              <div>
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
              <div>
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
                const texto = `*${receta.nombre}*\n\n${receta.calorias_escaladas || Math.round(receta.calorias_base * factorEscala)} kcal | P: ${receta.proteinas_escaladas || Math.round(receta.proteinas_g * factorEscala)}g | C: ${receta.carbohidratos_escalados || Math.round(receta.carbohidratos_g * factorEscala)}g | G: ${receta.grasas_escaladas || Math.round(receta.grasas_g * factorEscala)}g\n\n*Ingredientes:*\n${ingredientesTexto}\n\n*Preparacion${tieneThermomix && tabActiva === 'thermomix' ? ' (Thermomix TM6)' : ''}:*\n${instrTexto}\n\n_NutriPlan_`;
                const encoded = encodeURIComponent(texto);
                window.location.href = 'https://api.whatsapp.com/send?text=' + encoded;
              } catch(err) {
                console.error('Error compartiendo:', err);
                alert('No se pudo abrir WhatsApp. Copia el texto manualmente.');
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
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer ${despensa[ing.id] ? 'bg-green-500 border-green-500' : darkMode ? 'border-gray-500' : 'border-gray-300'}`}
                    onClick={() => toggleDespensa(ing.id)}>
                    {despensa[ing.id] && <i className="fas fa-check text-white" style={{fontSize:'0.6rem'}}></i>}
                  </div>
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
              <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => toggleDespensa(ing.id)}>
                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                  despensa[ing.id] ? 'bg-green-500 border-green-500' : darkMode ? 'border-gray-500' : 'border-gray-300'}`}>
                  {despensa[ing.id] && <i className="fas fa-check text-white text-xs"></i>}
                </div>
                <div className="flex-1">
                  <span className={`text-sm ${despensa[ing.id] ? 'text-gray-500' : darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{ing.nombre}</span>
                </div>
              </div>
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
  const [expandido, setExpandido] = React.useState(false);

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
  const limpiarComprados = () => { setComprados({}); };
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
    let texto = "🛒 LISTA DE COMPRAS - NutriPlan\n";
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
          <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>¡Tenés todo!</h3>
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
            {categorias.map(([cat, items]) => (
              <div key={cat}>
                <div className={`px-4 py-3 font-semibold text-sm sticky top-0 ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-50 text-gray-700'}`}>{cat}</div>
                <div className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-50'}`}>
                  {items.map(ing => (
                    <div key={ing.id} className={`flex items-center justify-between px-4 py-3 transition-all ${
                      comprados[ing.id] ? (darkMode ? 'bg-green-900/20 opacity-60' : 'bg-green-50/50 opacity-60') : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50')
                    }`}>
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <button onClick={(e) => toggleComprado(e, ing.id)}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            comprados[ing.id] ? 'bg-green-500 border-green-500' : darkMode ? 'border-gray-500 hover:border-green-400' : 'border-gray-300 hover:border-green-400'
                          }`}>
                          {comprados[ing.id] && <i className="fas fa-check text-white" style={{fontSize:'0.55rem'}}></i>}
                        </button>
                        <span className={`text-sm truncate ${comprados[ing.id] ? 'line-through text-gray-400' : darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{ing.nombre}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
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
            ))}
          </div>
        ) : (
          <div className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-50'}`}>
            {ingredientesFaltantes.map(ing => (
              <div key={ing.id} className={`flex items-center justify-between px-4 py-3 transition-all ${
                comprados[ing.id] ? (darkMode ? 'bg-green-900/20 opacity-60' : 'bg-green-50/50 opacity-60') : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50')
              }`}>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <button onClick={(e) => toggleComprado(e, ing.id)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      comprados[ing.id] ? 'bg-green-500 border-green-500' : darkMode ? 'border-gray-500 hover:border-green-400' : 'border-gray-300 hover:border-green-400'
                    }`}>
                    {comprados[ing.id] && <i className="fas fa-check text-white" style={{fontSize:'0.55rem'}}></i>}
                  </button>
                  <span className={`text-sm truncate ${comprados[ing.id] ? 'line-through text-gray-400' : darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{ing.nombre}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
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

      {/* Fase 4.1: Exports adicionales */}
      {typeof window.exports !== 'undefined' && ingredientesFaltantes.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-2">
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
            className={`py-3 rounded-xl font-medium text-sm transition-all active:scale-[0.98] ${
              darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}>
            <i className="fas fa-file-csv text-emerald-500 mr-2"></i>Descargar CSV
          </button>
          <button onClick={async () => {
              let texto = window.exports.textoSupermercado(ingredientesFaltantes);
              const ess = esencialesActivos();
              if (ess.length > 0) texto += "\n" + ess.map(e => e.nombre).join("\n");
              try {
                await navigator.clipboard.writeText(texto);
                alert('✓ Lista copiada. Pégala en el buscador de Jumbo/Líder (uno por línea).');
              } catch {
                const ta = document.createElement('textarea');
                ta.value = texto;
                document.body.appendChild(ta); ta.select(); document.execCommand('copy');
                document.body.removeChild(ta);
                alert('✓ Lista copiada');
              }
            }}
            className={`py-3 rounded-xl font-medium text-sm transition-all active:scale-[0.98] ${
              darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}>
            <i className="fas fa-cart-shopping text-blue-500 mr-2"></i>Formato Jumbo/Líder
          </button>
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

  // Apply dark mode class to html element
  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    document.body.className = darkMode ? 'bg-gray-900 font-sans antialiased' : 'bg-gray-50 font-sans antialiased';
  }, [darkMode]);

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

  React.useEffect(() => {
    const perfilGuardado = cargarPerfil();
    const planGuardado = cargarPlanSemanal();
    if (perfilGuardado && planGuardado) {
      setPerfil(perfilGuardado);
      setPlanSemanal(_sanitizarPlan(planGuardado, perfilGuardado));
      setPantalla("plan");
      // Fase 6.2: pre-cargar recipes-extra en idle para que swap/regenerar sean instantáneos
      if (window.lazyRecipes && !window.lazyRecipes.estaCargado()) {
        var dispatch = window.requestIdleCallback || function(cb) { setTimeout(cb, 2000); };
        dispatch(function() { window.lazyRecipes.cargar().catch(function(){}); });
      }
    } else if (perfilGuardado) {
      setPerfil(perfilGuardado);
      setPantalla("perfil");
    } else {
      setPantalla("perfil");
    }
  }, []);

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
        mostrarToast("¡Plan semanal generado exitosamente!");
      }
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

  const handleRegenerar = async () => {
    if (perfil) {
      setCargando(true);
      setMensajeCarga("Regenerando plan con recetas frescas...");
      try {
        // Fase 6.2: asegurar recipes-extra cargado (por si el usuario recargó la app)
        if (window.lazyRecipes && !window.lazyRecipes.estaCargado()) {
          await window.lazyRecipes.cargar();
        }
        const nuevoPlan = await generarPlanSemanalAsync(perfil, perfil.caloriasObjetivo, (msg) => setMensajeCarga(msg));
        setPlanSemanal(nuevoPlan);
        guardarPlanSemanal(nuevoPlan);
        if (nuevoPlan._buscoOnline && nuevoPlan._recetasOnlineUsadas > 0) {
          mostrarToast(`¡Plan regenerado con ${nuevoPlan._recetasOnlineUsadas} recetas de internet!`);
        } else {
          mostrarToast("¡Plan regenerado con nuevas recetas!");
        }
      } catch (e) {
        console.error("Error regenerando plan:", e);
        const nuevoPlan = generarPlanSemanal(perfil, perfil.caloriasObjetivo);
        setPlanSemanal(nuevoPlan);
        guardarPlanSemanal(nuevoPlan);
        mostrarToast("Plan regenerado (modo offline)", "info");
      } finally {
        setCargando(false);
        window.scrollTo(0, 0);
      }
    }
  };

  // MEJORA 3: Swap individual (async con fallback online)
  const handleSwapRecipe = async (dia, tipoComida, numSemana) => {
    numSemana = numSemana || 1;
    if (perfil && planSemanal) {
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
          mostrarToast(`${tipoNombre} del ${dia} cambiado (receta de internet)`);
        } else {
          mostrarToast(`${tipoNombre} del ${dia} cambiado`);
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

  const handleEditarPerfil = () => { setPantalla("perfil"); window.scrollTo(0, 0); };
  const handleVolverAlPlan = () => { setPantalla("plan"); window.scrollTo(0, 0); };
  const handleReiniciar = () => {
    limpiarTodo();
    setPerfil(null); setPlanSemanal(null); setPantalla("perfil");
    mostrarToast("Datos reiniciados correctamente", "info");
    window.scrollTo(0, 0);
  };
  const navegarA = (destino) => { setPantalla(destino); window.scrollTo(0, 0); };

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

  if (pantalla === "loading") {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-green-50 via-white to-emerald-50'}`}>
        <div className="text-center" style={{animation: 'pulse-soft 1.5s infinite'}}>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg">
            <i className="fas fa-seedling text-white text-2xl"></i>
          </div>
          <p className="text-gray-500">Cargando NutriPlan...</p>
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
          tienePlan={!!planSemanal} />
        {globalOverlays}
      </React.Fragment>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <header className={`sticky top-0 z-40 shadow-sm border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-seedling text-white text-sm"></i>
            </div>
            <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>NutriPlan</span>
            {perfil && <span className="text-xs text-gray-400 hidden sm:inline">{perfil.caloriasObjetivo} kcal/día{perfil.numSemanas > 1 ? ` · ${perfil.numSemanas} sem` : ''}</span>}
          </div>
          <div className="flex items-center gap-1">
            {/* MEJORA 5: Dark mode toggle */}
            <button onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors ${darkMode ? 'text-yellow-400 hover:bg-gray-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`} title="Modo oscuro">
              <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'} text-sm`}></i>
            </button>
            <button onClick={handleEditarPerfil}
              className={`p-2 rounded-lg transition-colors ${darkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`} title="Editar Perfil">
              <i className="fas fa-user-pen text-sm"></i>
            </button>
            <button onClick={handleReiniciar}
              className={`p-2 rounded-lg transition-colors ${darkMode ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`} title="Reiniciar Todo">
              <i className="fas fa-trash-alt text-sm"></i>
            </button>
          </div>
        </div>
      </header>

      <nav className={`border-b no-print ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex gap-1 py-2">
            {[
              { id: "plan", label: "Plan", icon: "fa-calendar-days" },
              { id: "cocinar", label: "¿Qué cocino?", icon: "fa-magnifying-glass" },
              { id: "generador", label: "Crear receta", icon: "fa-wand-magic-sparkles" },
              { id: "despensa", label: "Despensa", icon: "fa-warehouse" },
              { id: "compras", label: "Compras", icon: "fa-cart-shopping" }
            ].map(tab => (
              <button key={tab.id} onClick={() => navegarA(tab.id)}
                className={`nav-pill flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium ${
                  pantalla === tab.id ? 'active' : darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-50'
                }`}>
                <i className={`fas ${tab.icon} text-xs`}></i>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden text-xs">{tab.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {pantalla === "plan" && planSemanal && (
          <WeeklyPlan plan={planSemanal} perfil={perfil}
            onRecipeClick={(receta) => setRecetaSeleccionada(receta)}
            onRegenerate={handleRegenerar}
            onSwapRecipe={handleSwapRecipe}
            darkMode={darkMode}
            swapping={swapping} />
        )}
        {pantalla === "cocinar" && (
          <ReverseSearch darkMode={darkMode} onRecipeClick={(r) => setRecetaSeleccionada(r)} />
        )}
        {pantalla === "generador" && (
          <RecipeGenerator darkMode={darkMode} onRecipeClick={(r) => setRecetaSeleccionada(r)} />
        )}
        {pantalla === "despensa" && planSemanal && (
          <Pantry plan={planSemanal} onNavigateToShopping={() => navegarA("compras")} darkMode={darkMode} />
        )}
        {pantalla === "compras" && planSemanal && (
          <ShoppingList plan={planSemanal} darkMode={darkMode} />
        )}
      </main>

      <footer className={`text-center py-6 text-xs no-print ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        <p>NutriPlan · Planificador Nutricional Semanal</p>
        <p className="mt-1">Recetas en español + búsqueda en vivo · Thermomix TM6</p>
      </footer>

      {recetaSeleccionada && <RecipeModal receta={recetaSeleccionada} onClose={() => setRecetaSeleccionada(null)} darkMode={darkMode} factorComensales={factorComensales} />}

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
        React.createElement('h1', { style: { color: '#ef4444', marginBottom: '12px' } }, '⚠️ Error al cargar NutriPlan'),
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
