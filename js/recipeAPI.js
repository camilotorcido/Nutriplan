/* ============================================
   NutriPlan - Servicio de Recetas Online
   Fuente: TheMealDB (free, no auth, CORS OK)
   Genera nombres e instrucciones 100% en español.
   Prioriza recetas americanas/europeas.
   ============================================ */

const MEALDB_BASE = "https://www.themealdb.com/api/json/v1/1";

// ─── Cache ───
const STORAGE_KEY_ONLINE = "nutriplan_recetas_online_v8";
// Limpiar cachés viejas (v7 y anteriores usaban instrucciones Thermomix simplificadas)
try { localStorage.removeItem("nutriplan_recetas_online"); } catch(e) {}
try { localStorage.removeItem("nutriplan_recetas_online_v2"); } catch(e) {}
try { localStorage.removeItem("nutriplan_recetas_online_v3"); } catch(e) {}
try { localStorage.removeItem("nutriplan_recetas_online_v4"); } catch(e) {}
try { localStorage.removeItem("nutriplan_recetas_online_v5"); } catch(e) {}
try { localStorage.removeItem("nutriplan_recetas_online_v6"); } catch(e) {}
try { localStorage.removeItem("nutriplan_recetas_online_v7"); } catch(e) {}

function _cargarCacheOnline() {
  try {
    const d = localStorage.getItem(STORAGE_KEY_ONLINE);
    return d ? JSON.parse(d) : [];
  } catch { return []; }
}

function _guardarCacheOnline(recetas) {
  try {
    localStorage.setItem(STORAGE_KEY_ONLINE, JSON.stringify(recetas));
  } catch (e) { console.warn("Cache online lleno:", e); }
}

// ═══════════════════════════════════════════════
// TRADUCCIÓN DE INGREDIENTES EN→ES
// ═══════════════════════════════════════════════
const _TRAD_ING = {
  chicken: "pollo", "chicken breast": "pechuga de pollo", "chicken thigh": "muslo de pollo",
  "chicken thighs": "muslos de pollo", "chicken legs": "piernas de pollo",
  "chicken wings": "alitas de pollo", "chicken stock": "caldo de pollo",
  beef: "carne de res", "minced beef": "carne molida", "ground beef": "carne molida",
  "beef stock": "caldo de carne", "stewing beef": "carne para guiso",
  "beef brisket": "pecho de res", "beef fillet": "filete de res",
  pork: "cerdo", "pork chops": "chuletas de cerdo", "pork loin": "lomo de cerdo",
  bacon: "tocino", ham: "jamón", sausage: "salchicha", sausages: "salchichas",
  lamb: "cordero", "lamb chops": "chuletas de cordero", "lamb mince": "cordero molido",
  turkey: "pavo", "turkey mince": "pavo molido", duck: "pato", veal: "ternera",
  salmon: "salmón", tuna: "atún", shrimp: "camarones", prawns: "camarones",
  cod: "bacalao", "white fish": "pescado blanco", "fish sauce": "salsa de pescado",
  "white fish fillets": "filetes de pescado blanco", "fish fillets": "filetes de pescado",
  egg: "huevo", eggs: "huevo",
  butter: "mantequilla", milk: "leche", "whole milk": "leche entera",
  cream: "crema", "double cream": "crema", "single cream": "crema",
  "heavy cream": "crema", "whipping cream": "crema",
  "soured cream": "crema agria", "sour cream": "crema agria",
  cheese: "queso", "cheddar cheese": "queso cheddar", "parmesan cheese": "queso parmesano",
  "parmesan": "parmesano", "mozzarella": "queso mozzarella", "feta": "queso feta",
  "cream cheese": "queso crema", "goat cheese": "queso de cabra",
  yogurt: "yogur", "greek yogurt": "yogur griego", "plain yogurt": "yogur natural",
  rice: "arroz", "brown rice": "arroz integral", "white rice": "arroz blanco",
  "basmati rice": "arroz basmati", "long grain rice": "arroz de grano largo",
  pasta: "pasta", "penne": "penne", "spaghetti": "espagueti", "macaroni": "macarrones",
  "fusilli": "fusilli", "lasagne sheets": "láminas de lasaña",
  noodles: "fideos", "egg noodles": "fideos de huevo", "rice noodles": "fideos de arroz",
  flour: "harina", "plain flour": "harina", "self-raising flour": "harina leudante",
  "all-purpose flour": "harina todo uso", "bread flour": "harina de fuerza",
  "corn flour": "maicena", "cornstarch": "maicena",
  bread: "pan", "bread crumbs": "pan rallado", "breadcrumbs": "pan rallado",
  potato: "papa", potatoes: "papa", "sweet potato": "camote", "sweet potatoes": "camote",
  onion: "cebolla", onions: "cebolla", "red onion": "cebolla morada", "red onions": "cebolla morada",
  "white onion": "cebolla blanca", "shallots": "chalote", "shallot": "chalote",
  garlic: "ajo", "garlic clove": "ajo", "garlic cloves": "ajo",
  "garlic minced": "ajo", "garlic powder": "ajo en polvo",
  tomato: "tomate", tomatoes: "tomate", "tomato paste": "pasta de tomate",
  "tomato puree": "salsa de tomate", "tomato sauce": "salsa de tomate",
  "chopped tomatoes": "tomate picado", "cherry tomatoes": "tomate cherry",
  "canned tomatoes": "tomate enlatado", "sun-dried tomatoes": "tomate seco",
  carrot: "zanahoria", carrots: "zanahoria",
  pepper: "pimentón", "red pepper": "pimentón rojo", "green pepper": "pimentón verde",
  "yellow pepper": "pimentón amarillo", "bell pepper": "pimentón",
  "chilli": "chile", "chili": "chile", "chilli powder": "chile en polvo",
  "chili powder": "chile en polvo", "chilli flakes": "hojuelas de chile",
  "red chilli": "chile rojo", "green chilli": "chile verde",
  "jalapeno": "jalapeño", "cayenne pepper": "pimienta de cayena",
  celery: "apio", "celery stalk": "tallo de apio", cucumber: "pepino",
  lettuce: "lechuga", spinach: "espinaca", "baby spinach": "espinaca baby",
  broccoli: "brócoli", "cauliflower": "coliflor",
  corn: "maíz", "sweetcorn": "maíz dulce", "corn on the cob": "mazorca de maíz",
  peas: "arveja", "frozen peas": "arveja congelada", "green peas": "arveja",
  "snap peas": "arveja china", "snow peas": "arveja china",
  beans: "poroto", "black beans": "poroto negro",
  "kidney beans": "poroto rojo", "cannellini beans": "poroto blanco",
  "baked beans": "poroto cocido", "green beans": "poroto verde",
  "runner beans": "poroto verde", "french beans": "poroto verde",
  "broad beans": "haba", "butter beans": "poroto blanco",
  lentils: "lenteja", "red lentils": "lenteja roja", "green lentils": "lenteja verde",
  chickpeas: "garbanzo",
  avocado: "palta", banana: "plátano", lemon: "limón", "lemon juice": "jugo de limón",
  "lemon zest": "ralladura de limón", lime: "lima", "lime juice": "jugo de lima",
  orange: "naranja", "orange juice": "jugo de naranja", "orange zest": "ralladura de naranja",
  apple: "manzana", mango: "mango", "pineapple": "piña", "strawberries": "frutilla", "strawberry": "frutilla",
  "blueberries": "arándano", "raspberries": "frambuesa", "grapes": "uva",
  "dried fruit": "fruta seca", "raisins": "pasa", "sultanas": "pasa rubia",
  "dates": "dátil", "cranberries": "arándano seco",
  coconut: "coco", "coconut milk": "leche de coco", "coconut cream": "crema de coco",
  "desiccated coconut": "coco rallado", "coconut oil": "aceite de coco",
  "olive oil": "aceite de oliva", "vegetable oil": "aceite vegetal",
  "sunflower oil": "aceite de girasol", "sesame oil": "aceite de sésamo",
  oil: "aceite", "cooking oil": "aceite de cocina",
  salt: "sal", "sea salt": "sal marina", "kosher salt": "sal gruesa",
  "black pepper": "pimienta negra", "white pepper": "pimienta blanca",
  "pepper": "pimienta", sugar: "azúcar", "brown sugar": "azúcar morena",
  "caster sugar": "azúcar fina", "icing sugar": "azúcar glass",
  "powdered sugar": "azúcar glass", "granulated sugar": "azúcar granulada",
  honey: "miel", "maple syrup": "miel de maple",
  "soy sauce": "salsa de soya", "worcestershire sauce": "salsa inglesa",
  "hot sauce": "salsa picante", "oyster sauce": "salsa de ostras",
  "hoisin sauce": "salsa hoisin", vinegar: "vinagre",
  "balsamic vinegar": "vinagre balsámico", "red wine vinegar": "vinagre de vino tinto",
  "white wine vinegar": "vinagre de vino blanco", "apple cider vinegar": "vinagre de manzana",
  mustard: "mostaza", "dijon mustard": "mostaza Dijon",
  "wholegrain mustard": "mostaza de grano entero",
  mayonnaise: "mayonesa", ketchup: "ketchup",
  cumin: "comino", "ground cumin": "comino molido",
  paprika: "pimentón", "smoked paprika": "pimentón ahumado",
  oregano: "orégano", cinnamon: "canela", "ground cinnamon": "canela molida",
  ginger: "jengibre", "fresh ginger": "jengibre fresco", "ground ginger": "jengibre molido",
  turmeric: "cúrcuma", "ground turmeric": "cúrcuma molida",
  nutmeg: "nuez moscada", "bay leaf": "hoja de laurel", "bay leaves": "hoja de laurel",
  thyme: "tomillo", "fresh thyme": "tomillo fresco", rosemary: "romero",
  parsley: "perejil", "fresh parsley": "perejil fresco", "flat leaf parsley": "perejil liso",
  cilantro: "cilantro", coriander: "cilantro", "fresh coriander": "cilantro fresco",
  "ground coriander": "cilantro molido",
  basil: "albahaca", "fresh basil": "albahaca fresca",
  mint: "menta", "fresh mint": "menta fresca", dill: "eneldo",
  chives: "ciboulette", "spring onion": "cebollín", "spring onions": "cebollín",
  "green onion": "cebollín", "green onions": "cebollín", scallions: "cebollín",
  water: "agua", "boiling water": "agua hirviendo", "warm water": "agua tibia",
  stock: "caldo", "vegetable stock": "caldo de verduras", "beef stock": "caldo de carne",
  "fish stock": "caldo de pescado",
  mushroom: "champiñón", mushrooms: "champiñón",
  "button mushrooms": "champiñón", "portobello mushrooms": "portobello",
  zucchini: "zapallo italiano", courgette: "zapallo italiano", courgettes: "zapallo italiano",
  aubergine: "berenjena", eggplant: "berenjena",
  squash: "zapallo", "butternut squash": "zapallo butternut", pumpkin: "zapallo",
  "vanilla extract": "extracto de vainilla", "vanilla": "vainilla",
  "baking powder": "polvo para hornear", "baking soda": "bicarbonato",
  "bicarbonate of soda": "bicarbonato",
  chocolate: "chocolate", "dark chocolate": "chocolate amargo",
  "milk chocolate": "chocolate con leche", "cocoa powder": "cacao en polvo",
  almond: "almendra", almonds: "almendra", "ground almonds": "almendra molida",
  "flaked almonds": "almendra laminada",
  walnut: "nuez", walnuts: "nuez", "pine nuts": "piñón",
  peanut: "maní", peanuts: "maní", "peanut butter": "mantequilla de maní",
  "cashew nuts": "nuez de la india", "cashews": "nuez de la india",
  pecans: "pecana", pecan: "pecana",
  "sesame seeds": "semilla de sésamo", "poppy seeds": "semilla de amapola",
  "pumpkin seeds": "semilla de zapallo",
  tortilla: "tortilla", tortillas: "tortilla", "wrap": "tortilla", wraps: "tortilla",
  "pita bread": "pan pita", "naan": "pan naan", "naan bread": "pan naan",
  "white wine": "vino blanco", "red wine": "vino tinto",
  "cooking wine": "vino de cocina", beer: "cerveza",
  "plain flour": "harina", "self raising flour": "harina leudante",
  "creme fraiche": "crema fresca", "mascarpone": "mascarpone",
  "ricotta": "queso ricotta", "gouda": "gouda", "gruyere": "queso gruyère",
  "prosciutto": "jamón serrano", "pancetta": "panceta",
  "chorizo": "chorizo", "salami": "salami",
  "capers": "alcaparra", "olives": "aceituna",
  "black olives": "aceituna negra", "green olives": "aceituna verde",
  "artichoke": "alcachofa", "asparagus": "espárrago",
  "rocket": "rúcula", "arugula": "rúcula",
  cabbage: "repollo", "red cabbage": "repollo morado", "white cabbage": "repollo",
  "savoy cabbage": "repollo", haddock: "merluza", "smoked haddock": "merluza ahumada",
  trout: "trucha", mackerel: "caballa", sardines: "sardina",
  "kale": "kale", "leek": "puerro", "leeks": "puerro",
  "turnip": "nabo", "parsnip": "chirivía", "radish": "rábano",
  "beetroot": "remolacha", "beet": "remolacha",
  "fennel": "hinojo", "pak choi": "bok choy", "bok choy": "bok choy",
  "water chestnuts": "castaña de agua", "bamboo shoots": "brote de bambú",
  "bean sprouts": "brote de soya", "tofu": "tofu",
  "lemongrass": "hierba limón", "galangal": "galanga",
  "tamarind": "tamarindo", "miso paste": "pasta de miso",
  "rice wine": "vino de arroz", "sake": "sake",
  "tahini": "tahini", "harissa": "harissa",
  "ras el hanout": "ras el hanout", "garam masala": "garam masala",
  "curry powder": "curry en polvo", "curry paste": "pasta de curry",
  "red curry paste": "pasta de curry rojo", "green curry paste": "pasta de curry verde",
  "five spice": "cinco especias", "allspice": "pimienta de Jamaica",
  "cardamom": "cardamomo", "cloves": "clavo de olor",
  "star anise": "anís estrellado", "saffron": "azafrán",
  "dried oregano": "orégano seco", "dried thyme": "tomillo seco",
  "dried basil": "albahaca seca", "mixed herbs": "hierbas mixtas",
  "italian seasoning": "condimento italiano", "herbes de provence": "hierbas provenzales",
  "chili flakes": "hojuelas de chile", "red pepper flakes": "hojuelas de chile",
  // Ingredientes exóticos → equivalentes chilenos disponibles
  yam: "camote", "white yam": "camote", "sweet yam": "camote",
  cassava: "yuca", plantain: "plátano", plantains: "plátano",
  "plantain flour": "harina de plátano",
  casabe: "pan pita", "cassava bread": "pan pita",
  "suet": "grasa de vacuno", "lard": "manteca de cerdo",
  "jaggery": "azúcar morena", "palm sugar": "azúcar morena",
  "scotch bonnet": "chile habanero", "habanero": "chile habanero",
  "ghee": "mantequilla clarificada",
  "double cream": "crema", "clotted cream": "crema espesa",
  "gruyère": "queso gruyère", "stilton": "queso azul",
  "brie": "queso brie", "camembert": "queso camembert",
  chorizo: "chorizo", "chouriço": "chorizo"
};

function _traducirIngrediente(en) {
  if (!en) return "";
  const lower = en.toLowerCase().trim();
  if (_TRAD_ING[lower]) return _TRAD_ING[lower];
  // Buscar match más largo
  let best = null, bestLen = 0;
  for (const [k, v] of Object.entries(_TRAD_ING)) {
    if (lower.includes(k) && k.length > bestLen) { best = v; bestLen = k.length; }
  }
  if (best) return best;
  return en.charAt(0).toUpperCase() + en.slice(1).toLowerCase();
}

// ═══════════════════════════════════════════════
// NORMALIZACIÓN DE INGREDIENTES
// Produce claves canónicas: singular, sin modificadores, sin acentos
// Para que "huevos" → "huevo", "plátano congelado" → "platano"
// ═══════════════════════════════════════════════
function _normalizarIngrediente(nombreES) {
  let n = nombreES.toLowerCase().trim()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // quitar acentos
  
  // Quitar modificadores descriptivos comunes
  n = n.replace(/\s+(en\s+)?(polvo|fresco|fresca|seco|seca|cocido|cocida|congelado|congelada|maduro|madura|natural|integral|grande|pequeño|mediano|tostado|tostada|deshidratado|deshidratada|precocida|baby|molido|molida|laminado|laminada|picado|picada|rallado|rallada|fino|fina|grueso|gruesa|entero|entera|enlatado|enlatada|cherry|rojo|roja|verde|negro|negra|blanco|blanca|amarillo|amarilla|morado|morada)/gi, '');
  
  // Despluralizar: orden importa
  // -ces → -z (nueces → nuez)
  n = n.replace(/ces$/, 'z');
  // -es final solo si queda al menos 3 chars (tomates → tomate, no "sal" → "s")
  if (n.endsWith('es') && n.length > 4) {
    n = n.replace(/es$/, '');
    // Si cortamos de más, intentar con solo 's'
    if (n.length < 3) n = nombreES.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/s$/, '');
  } else if (n.endsWith('s') && n.length > 3) {
    n = n.replace(/s$/, '');
  }
  
  return n.trim().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
}

// ═══════════════════════════════════════════════
// NOMBRE DEL PLATO 100% ESPAÑOL
// ═══════════════════════════════════════════════
function _generarNombreEspanol(meal, ingredientesES, categoria, tipoComidaForzado) {
  const cat = (categoria || "").toLowerCase();
  const esSnack = tipoComidaForzado === 'snack_am' || tipoComidaForzado === 'snack_pm';
  
  // Identificar proteína principal
  const proteinas = {
    pollo: ["pollo", "pechuga", "muslo", "alita"],
    "carne de res": ["carne de res", "carne molida", "filete de res", "res", "pecho de res"],
    cerdo: ["cerdo", "chuleta de cerdo", "lomo de cerdo", "tocino", "panceta"],
    cordero: ["cordero"],
    pavo: ["pavo"],
    salmón: ["salmón"],
    atún: ["atún"],
    pescado: ["pescado", "bacalao", "filete de pescado"],
    camarones: ["camarones", "camarón"],
    huevo: ["huevo"]
  };
  
  let proteinaPrincipal = null;
  for (const [nombre, keywords] of Object.entries(proteinas)) {
    if (ingredientesES.some(ing => keywords.some(k => ing.toLowerCase().includes(k)))) {
      proteinaPrincipal = nombre;
      break;
    }
  }
  
  // Identificar acompañamiento
  const acomps = {
    arroz: ["arroz"], pasta: ["pasta", "espagueti", "penne", "fusilli", "macarrones", "fideos"],
    papas: ["papa", "camote"], ensalada: ["lechuga", "rúcula", "espinaca"],
    verduras: ["zanahoria", "pimiento", "brócoli", "zapallo", "coliflor", "berenjena"]
  };
  
  let acompPrincipal = null;
  for (const [nombre, keywords] of Object.entries(acomps)) {
    if (ingredientesES.some(ing => keywords.some(k => ing.toLowerCase().includes(k)))) {
      acompPrincipal = nombre;
      break;
    }
  }
  
  // Si es snack, generar nombre liviano
  if (esSnack) {
    return _generarNombreSnack(ingredientesES, cat);
  }

  // Variaciones de método de cocción por categoría
  const metodosVariantes = {
    chicken: ["al horno", "a la parrilla", "salteado", "al ajillo", "en salsa"],
    beef: ["guisada", "a la plancha", "al horno", "estofada", "en salsa"],
    pork: ["al horno", "a la parrilla", "en salsa", "salteado", "estofado"],
    lamb: ["al horno", "asado", "estofado", "a las brasas"],
    seafood: ["a la plancha", "al horno", "a la parrilla", "salteado", "al ajillo"],
    pasta: ["con salsa", "a la boloñesa", "gratinada", "salteada"],
    vegetarian: ["salteadas", "al horno", "gratinadas", "en guiso"],
    vegan: ["al horno", "salteado", "en guiso", "al vapor"],
    breakfast: ["", "casero", "nutritivo"],
    starter: ["", "casera"],
    side: ["", "caseras"],
    dessert: ["", "casero"]
  };
  const variantes = metodosVariantes[cat] || [""];
  const metodo = variantes[Math.floor(Math.random() * variantes.length)];

  // Construir nombre
  if (proteinaPrincipal && acompPrincipal) {
    const m = metodo ? ` ${metodo}` : "";
    return `${_capitalizar(proteinaPrincipal)}${m} con ${acompPrincipal}`;
  }
  if (proteinaPrincipal) {
    const m = metodo ? ` ${metodo}` : " a la sartén";
    return `${_capitalizar(proteinaPrincipal)}${m}`;
  }
  if (acompPrincipal) {
    if (cat === "dessert" || cat === "starter") {
      return `${_capitalizar(acompPrincipal)} especial`;
    }
    return `${_capitalizar(acompPrincipal)} ${metodo || "salteadas"}`.trim();
  }
  
  // Fallback por categoría
  const catNombres = {
    chicken: "Pollo al horno", beef: "Carne guisada", pork: "Cerdo al horno",
    lamb: "Cordero asado", seafood: "Mariscos a la plancha",
    pasta: "Pasta con salsa", vegetarian: "Plato vegetariano",
    vegan: "Plato vegano", breakfast: "Desayuno especial",
    starter: "Entrada variada", side: "Acompañamiento",
    dessert: "Postre casero", miscellaneous: "Plato del día",
    goat: "Guiso de carne"
  };
  return catNombres[cat] || "Receta del día";
}

// ─── Nombre snack: liviano y descriptivo ───
function _generarNombreSnack(ingredientesES, categoria) {
  const todos = ingredientesES.map(i => i.toLowerCase());
  
  // Detectar tipo de snack por ingredientes
  const tieneFruta = todos.some(i => ["plátano","manzana","mango","piña","fresa","arándano","naranja","uva","pera","fruta"].some(f => i.includes(f)));
  const tieneYogur = todos.some(i => i.includes("yogur"));
  const tieneQueso = todos.some(i => i.includes("queso") || i.includes("quesillo"));
  const tieneNueces = todos.some(i => ["almendra","nuez","maní","castaña","piñón","semilla"].some(n => i.includes(n)));
  const tieneChocolate = todos.some(i => i.includes("chocolate") || i.includes("cacao"));
  const tieneAvena = todos.some(i => i.includes("avena") || i.includes("granola"));
  const tieneHuevo = todos.some(i => i.includes("huevo"));
  const tieneVerdura = todos.some(i => ["zanahoria","pepino","apio","tomate","pimiento"].some(v => i.includes(v)));
  const tienePan = todos.some(i => ["pan","tostada","galleta","tortilla"].some(p => i.includes(p)));
  const tieneLeche = todos.some(i => i.includes("leche"));
  const tieneMiel = todos.some(i => i.includes("miel"));
  
  // Generar nombre descriptivo de snack
  if (tieneYogur && tieneFruta) return "Yogur con fruta fresca";
  if (tieneYogur && tieneAvena) return "Yogur con granola";
  if (tieneYogur && tieneNueces) return "Yogur con frutos secos";
  if (tieneChocolate && tieneLeche) return "Batido de chocolate";
  if (tieneChocolate && tieneAvena) return "Bolitas de avena y chocolate";
  if (tieneFruta && tieneNueces) return "Fruta con frutos secos";
  if (tieneFruta && tieneMiel) return "Fruta fresca con miel";
  if (tieneFruta && tieneLeche) return "Batido de frutas";
  if (tieneAvena && tieneNueces) return "Barritas de avena y frutos secos";
  if (tieneAvena && tieneMiel) return "Avena con miel";
  if (tieneQueso && tieneVerdura) return "Picoteo de queso con vegetales";
  if (tieneQueso && tienePan) return "Tostaditas con queso";
  if (tieneQueso) return "Snack de queso";
  if (tieneHuevo) return "Huevo cocido como snack";
  if (tieneVerdura && tieneNueces) return "Bastones de verdura con frutos secos";
  if (tieneVerdura) return "Bastones de verduras frescas";
  if (tieneNueces) return "Mix de frutos secos";
  if (tieneFruta) return "Fruta fresca picada";
  if (tieneAvena) return "Snack de avena";
  if (tienePan) return "Tostadita saludable";
  
  // Fallback por categoría original
  if (categoria === "dessert") return "Postre ligero";
  if (categoria === "starter") return "Picoteo variado";
  if (categoria === "side") return "Acompañamiento liviano";
  return "Snack saludable";
}

// ─── Instrucciones de snack: cortas y simples ───
function _generarInstruccionesSnack(ingredientesES, ingredientesObj) {
  const todos = ingredientesES.map(i => i.toLowerCase());
  const pasos = [];
  
  // Helper: obtener nombre con cantidad (medidas caseras)
  function _sc(nombre) {
    if (!ingredientesObj || ingredientesObj.length === 0) return nombre;
    const ing = ingredientesObj.find(i => i.nombre.toLowerCase() === nombre.toLowerCase());
    if (ing && ing.cantidad_base) {
      if (typeof convertirAMedidaCasera === 'function' && (ing.unidad === 'g' || ing.unidad === 'ml')) {
        const conv = convertirAMedidaCasera(ing.cantidad_base, ing.unidad, ing.nombre_normalizado || null);
        if (conv.texto) return `${conv.texto} de ${ing.nombre}`;
      }
      return `${ing.cantidad_base} ${ing.unidad} de ${ing.nombre}`;
    }
    return nombre;
  }
  
  // Encontrar ingredientes específicos
  const frutaIngs = ingredientesES.filter(i => ["plátano","manzana","mango","piña","fresa","arándano","naranja","uva","fruta","kiwi","durazno","pera","melón"].some(f => i.toLowerCase().includes(f)));
  const lecheIng = ingredientesES.find(i => i.toLowerCase().includes("leche"));
  const yogurIng = ingredientesES.find(i => i.toLowerCase().includes("yogur"));
  const avenaIng = ingredientesES.find(i => i.toLowerCase().includes("avena") || i.toLowerCase().includes("granola"));
  const nuecesIngs = ingredientesES.filter(i => ["almendra","nuez","maní","castaña","semilla","pistach"].some(n => i.toLowerCase().includes(n)));
  const verduraIngs = ingredientesES.filter(i => ["zanahoria","pepino","apio","tomate"].some(v => i.toLowerCase().includes(v)));
  const huevoIng = ingredientesES.find(i => i.toLowerCase().includes("huevo"));
  const quesoIng = ingredientesES.find(i => i.toLowerCase().includes("queso") || i.toLowerCase().includes("quesillo"));
  const panIng = ingredientesES.find(i => ["pan","tostada","galleta","tortilla"].some(p => i.toLowerCase().includes(p)));
  const chocolateIng = ingredientesES.find(i => i.toLowerCase().includes("chocolate") || i.toLowerCase().includes("cacao"));
  const mielIng = ingredientesES.find(i => i.toLowerCase().includes("miel"));
  
  // Batido/smoothie
  if (frutaIngs.length > 0 && lecheIng) {
    pasos.push(`Pelar y trocear ${frutaIngs.map(f => _sc(f)).join(" y ")} en pedazos pequeños.`);
    pasos.push(`Colocar la fruta en la licuadora junto con ${_sc(lecheIng)}.`);
    const extras = ingredientesES.filter(i => !frutaIngs.includes(i) && i !== lecheIng);
    if (extras.length > 0) pasos.push(`Agregar ${extras.map(e => _sc(e)).join(", ")} a la licuadora.`);
    pasos.push("Licuar a máxima velocidad durante 30-45 segundos hasta obtener una mezcla homogénea y sin grumos.");
    pasos.push("Probar la dulzura. Servir frío inmediatamente en un vaso grande.");
    return pasos;
  }
  
  // Yogur bowl
  if (yogurIng) {
    pasos.push(`Colocar ${_sc(yogurIng)} en un bowl o vaso.`);
    if (frutaIngs.length > 0) pasos.push(`Lavar y cortar ${frutaIngs.map(f => _sc(f)).join(" y ")} en trozos pequeños. Distribuir sobre el yogur.`);
    if (avenaIng) pasos.push(`Espolvorear ${_sc(avenaIng)} formando una capa crujiente.`);
    if (nuecesIngs.length > 0) pasos.push(`Agregar ${nuecesIngs.map(n => _sc(n)).join(" y ")} picados por encima.`);
    if (mielIng) pasos.push(`Rociar ${_sc(mielIng)} en zigzag para dar dulzura.`);
    pasos.push("Consumir inmediatamente para que los ingredientes secos se mantengan crujientes.");
    return pasos;
  }
  
  // Bolitas/barritas energéticas
  if (avenaIng && (nuecesIngs.length > 0 || chocolateIng)) {
    pasos.push(`En un bowl grande, mezclar ${_sc(avenaIng)} con ${nuecesIngs.length > 0 ? nuecesIngs.map(n => _sc(n)).join(", ") : ""} ${chocolateIng ? (nuecesIngs.length > 0 ? " y " : "") + _sc(chocolateIng) : ""}.`);
    const humedos = ingredientesES.filter(i => ["miel","mantequilla","mermelada","aceite"].some(h => i.toLowerCase().includes(h)));
    if (humedos.length > 0) pasos.push(`Agregar ${humedos.map(h => _sc(h)).join(" y ")}. Mezclar hasta obtener una masa pegajosa que se mantenga unida al presionar.`);
    pasos.push("Refrigerar la mezcla 15 minutos. Luego, con las manos ligeramente húmedas, formar bolitas del tamaño de una nuez o presionar en un molde para barritas.");
    const cobertura = ingredientesES.find(i => i.toLowerCase().includes("coco") || i.toLowerCase().includes("cacao"));
    if (cobertura) pasos.push(`Rebozar las bolitas en ${_sc(cobertura)}.`);
    pasos.push("Refrigerar al menos 30 minutos antes de consumir. Se conservan hasta 5 días en la nevera.");
    return pasos;
  }
  
  // Palitos de verdura
  if (verduraIngs.length > 0) {
    pasos.push(`Lavar ${verduraIngs.map(v => _sc(v)).join(" y ")}. Pelar si es necesario.`);
    pasos.push("Cortar en bastones de 8 cm de largo o en rodajas gruesas.");
    if (quesoIng) pasos.push(`Acompañar con ${_sc(quesoIng)} como dip cremoso.`);
    else if (nuecesIngs.length > 0) pasos.push(`Servir junto con ${nuecesIngs.map(n => _sc(n)).join(" y ")}.`);
    else pasos.push("Servir con un dip al gusto (hummus, queso crema, guacamole).");
    const extras = ingredientesES.filter(i => !verduraIngs.includes(i) && i !== quesoIng && !nuecesIngs.includes(i));
    if (extras.length > 0) pasos.push(`Agregar ${extras.map(e => _sc(e)).join(", ")} al plato.`);
    pasos.push("Consumir como snack refrescante de media mañana o tarde.");
    return pasos;
  }
  
  // Huevos
  if (huevoIng) {
    pasos.push(`Colocar ${_sc(huevoIng)} con cuidado en una olla pequeña. Cubrir con agua fría.`);
    pasos.push("Llevar a ebullición a fuego alto. Una vez que hierva, cocinar exactamente 10 minutos para yema firme.");
    pasos.push("Transferir a un bowl con agua fría durante 5 minutos. Pelar y cortar por la mitad.");
    const condimentos = ingredientesES.filter(i => i !== huevoIng);
    if (condimentos.length > 0) pasos.push(`Sazonar con ${condimentos.map(c => _sc(c)).join(" y ")}.`);
    else pasos.push("Sazonar con sal y pimienta al gusto.");
    return pasos;
  }
  
  // Tostada/galleta con topping
  if (panIng) {
    pasos.push(`Preparar ${_sc(panIng)} en un plato. Si es pan, tostar hasta que esté dorado y crujiente.`);
    const toppings = ingredientesES.filter(i => i !== panIng);
    if (toppings.length > 0) {
      const primerTopping = toppings[0];
      pasos.push(`Untar o colocar ${_sc(primerTopping)} sobre ${panIng.toLowerCase()}, distribuyendo uniformemente.`);
      if (toppings.length > 1) pasos.push(`Agregar ${toppings.slice(1).map(t => _sc(t)).join(" y ")} por encima.`);
    }
    pasos.push("Consumir inmediatamente para mantener la textura crujiente.");
    return pasos;
  }
  
  // Fruta sola
  if (frutaIngs.length > 0) {
    pasos.push(`Lavar ${frutaIngs.map(f => _sc(f)).join(" y ")}. Pelar si es necesario.`);
    pasos.push("Cortar en trozos del tamaño de un bocado o en rodajas.");
    const extras = ingredientesES.filter(i => !frutaIngs.includes(i));
    if (extras.length > 0) pasos.push(`Agregar ${extras.map(e => _sc(e)).join(" y ")} por encima.`);
    pasos.push("Servir fresca en un bowl. Consumir como snack entre comidas.");
    return pasos;
  }
  
  // Frutos secos
  if (nuecesIngs.length > 0) {
    pasos.push(`Medir las porciones: ${nuecesIngs.map(n => _sc(n)).join(", ")}.`);
    pasos.push("Se pueden tostar ligeramente en sartén seca a fuego medio durante 2-3 minutos para intensificar el sabor.");
    const extras = ingredientesES.filter(i => !nuecesIngs.includes(i));
    if (extras.length > 0) pasos.push(`Combinar con ${extras.map(e => _sc(e)).join(" y ")}.`);
    pasos.push("Porcionar en un contenedor pequeño para llevar. Consumir como snack entre comidas.");
    return pasos;
  }
  
  // Genérico detallado
  const todosStr = ingredientesES.map(i => _sc(i)).join(", ");
  pasos.push(`Preparar los ingredientes: ${todosStr}. Lavar, pelar o picar según corresponda.`);
  pasos.push("Combinar todos los ingredientes en un bowl o plato pequeño.");
  pasos.push("Mezclar suavemente y sazonar al gusto si es necesario.");
  pasos.push("Consumir como snack entre comidas. ¡Buen provecho!");
  return pasos;
}

function _capitalizar(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ═══════════════════════════════════════════════
// INSTRUCCIONES 100% ESPAÑOL (generadas, no traducidas)
// ═══════════════════════════════════════════════
function _generarInstruccionesEspanol(ingredientesES, categoria, tipoComidaForzado, ingredientesObj) {
  const pasos = [];
  const cat = (categoria || "").toLowerCase();
  const esSnack = tipoComidaForzado === 'snack_am' || tipoComidaForzado === 'snack_pm';
  
  // Si es snack, generar instrucciones livianas
  if (esSnack) {
    return _generarInstruccionesSnack(ingredientesES, ingredientesObj);
  }
  
  // Tracking: marcar cada ingrediente como "usado" en las instrucciones
  const ingredientesUsados = new Set();
  
  // Helper: obtener nombre con cantidad y marcar como usado
  function _ingConCantidad(nombre) {
    if (!ingredientesObj || ingredientesObj.length === 0) {
      ingredientesUsados.add(nombre.toLowerCase());
      return nombre;
    }
    const ing = ingredientesObj.find(i => i.nombre.toLowerCase() === nombre.toLowerCase());
    if (ing) {
      ingredientesUsados.add(nombre.toLowerCase());
      if (ing.cantidad_base) {
        // Intentar convertir a medida casera si la función está disponible
        if (typeof convertirAMedidaCasera === 'function' && (ing.unidad === 'g' || ing.unidad === 'ml')) {
          const conv = convertirAMedidaCasera(ing.cantidad_base, ing.unidad, ing.nombre_normalizado || null);
          if (conv.texto) return `${conv.texto} de ${ing.nombre}`;
        }
        return `${ing.cantidad_base} ${ing.unidad} de ${ing.nombre}`;
      }
      return ing.nombre;
    }
    ingredientesUsados.add(nombre.toLowerCase());
    return nombre;
  }
  
  // Helper: marcar ingrediente como mencionado por keyword match
  function _marcarUsado(nombre) {
    ingredientesUsados.add(nombre.toLowerCase());
  }
  
  // Clasificar ingredientes por nombre
  const proteinaKeywords = ["pollo","pechuga","carne","cerdo","cordero","salmón","salmon","atún","atun","pescado","camarones","camarón","pavo","res","ternera","chorizo","tocino","bacon","jamón","jamon"];
  const carbKeywords = ["arroz","quinoa","quinua","pasta","espagueti","spaghetti","penne","fusilli","fideos","macarrones","lasaña","cuscús","couscous","tallarín","tallarin","linguini","fettuccine"];
  const papaKeywords = ["papa","camote","batata","patata","ñame"];
  const baseKeywords = ["cebolla","ajo","chalote","echalote","puerro"];
  const tomateKeywords = ["tomate","salsa de tomate","passata","ketchup"];
  const verduraKeywords = ["zanahoria","pimiento","pimentón","brócoli","brocoli","zapallo","berenjena","espinaca","coliflor","apio","champiñón","champiñones","ejote","arveja","arvejas","calabacín","zucchini","judía","habichuela","choclo","maíz","espárrago","espárragos","nabo","rábano","repollo","col","lechuga","rúcula","kale","acelga","alcachofa","pepino"];
  const quesoKeywords = ["queso","parmesano","mozzarella","cheddar","gruyère","gruyere","ricota","ricotta","feta"];
  const cremaKeywords = ["crema","nata"];
  const lecheKeywords = ["leche"];
  const aceiteKeywords = ["aceite"];
  const condimentoKeywords = ["sal","pimienta","comino","orégano","oregano","tomillo","romero","cilantro","perejil","laurel","pimentón en polvo","curry","cúrcuma","curcuma","canela","nuez moscada","paprika","albahaca","eneldo","menta","hierbabuena","chile","ají","aji","cayena","jengibre","azafrán","azafran","caldo"];
  const vinagreKeywords = ["vinagre","vino","limón","limon","lima"];
  const dulceKeywords = ["miel","azúcar","azucar","panela","melaza","jarabe","mermelada"];
  const frutaKeywords = ["mango","piña","pina","fresa","fresas","plátano","platano","banana","manzana","naranja","durazno","melocotón","uva","kiwi","papaya","arándano","arandano","cereza","mora","frambuesa","coco"];
  const legumbreKeywords = ["frijol","frijoles","poroto","porotos","garbanzo","garbanzos","lenteja","lentejas","habas","judía","alubias"];
  const frutoSecoKeywords = ["almendra","almendras","nuez","nueces","maní","mani","avellana","pistacho","semilla","semillas","ajonjolí","ajonjoli","sésamo","sesamo","linaza","chía","chia","girasol","calabaza"];
  const panKeywords = ["pan","tortilla","arepa","tostada","galleta"];
  const salsa_keywords = ["salsa","mostaza","mayonesa","soya","soja","tahini","pesto","aderezo","hummus"];
  const mantequillaKeywords = ["mantequilla","manteca","margarina"];
  const huevoKeyword = "huevo";
  const harinaKeywords = ["harina","maicena","fécula","fecula"];

  // Encontrar ingredientes específicos por categoría
  const proteinaIng = ingredientesES.find(i => proteinaKeywords.some(p => i.toLowerCase().includes(p)));
  const cebollaIng = ingredientesES.find(i => i.toLowerCase().includes("cebolla") || i.toLowerCase().includes("puerro") || i.toLowerCase().includes("chalote"));
  const ajoIng = ingredientesES.find(i => i.toLowerCase().includes("ajo") && !i.toLowerCase().includes("espárrago"));
  const arrozIng = ingredientesES.find(i => i.toLowerCase().includes("arroz"));
  const pastaIng = ingredientesES.find(i => carbKeywords.slice(2).some(p => i.toLowerCase().includes(p)));
  const quinoaIng = ingredientesES.find(i => i.toLowerCase().includes("quinoa") || i.toLowerCase().includes("quinua"));
  const papaIng = ingredientesES.find(i => papaKeywords.some(p => i.toLowerCase().includes(p)));
  const tomateIng = ingredientesES.find(i => tomateKeywords.some(p => i.toLowerCase().includes(p)));
  const verdurasIngs = ingredientesES.filter(i => verduraKeywords.some(v => i.toLowerCase().includes(v)));
  const quesoIng = ingredientesES.find(i => quesoKeywords.some(q => i.toLowerCase().includes(q)));
  const cremaIng = ingredientesES.find(i => cremaKeywords.some(c => i.toLowerCase().includes(c)));
  const lecheIng = ingredientesES.find(i => lecheKeywords.some(c => i.toLowerCase().includes(c)) && !cremaKeywords.some(c => i.toLowerCase().includes(c)));
  const huevoIng = ingredientesES.find(i => i.toLowerCase().includes(huevoKeyword));
  const harinaIng = ingredientesES.find(i => harinaKeywords.some(h => i.toLowerCase().includes(h)));
  const mantequillaIng = ingredientesES.find(i => mantequillaKeywords.some(m => i.toLowerCase().includes(m)));
  const aceiteIng = ingredientesES.find(i => aceiteKeywords.some(a => i.toLowerCase().includes(a)));
  const vinagreIngs = ingredientesES.filter(i => vinagreKeywords.some(v => i.toLowerCase().includes(v)));
  const legumbreIng = ingredientesES.find(i => legumbreKeywords.some(l => i.toLowerCase().includes(l)));
  const frutaIngs = ingredientesES.filter(i => frutaKeywords.some(f => i.toLowerCase().includes(f)));
  const frutoSecoIngs = ingredientesES.filter(i => frutoSecoKeywords.some(f => i.toLowerCase().includes(f)));
  const panIng = ingredientesES.find(i => panKeywords.some(p => i.toLowerCase().includes(p)));
  const salsaIngs = ingredientesES.filter(i => salsa_keywords.some(s => i.toLowerCase().includes(s)));
  const dulceIngs = ingredientesES.filter(i => dulceKeywords.some(d => i.toLowerCase().includes(d)));
  
  // Condimentos y especias
  const condimentos = ingredientesES.filter(i => {
    const l = i.toLowerCase();
    return condimentoKeywords.some(c => l.includes(c));
  });
  
  const tieneBase = cebollaIng || ajoIng;
  const tieneProteina = !!proteinaIng;
  const tieneArroz = !!arrozIng;
  const tienePasta = !!pastaIng;
  const tieneQuinoa = !!quinoaIng;
  const tienePapas = !!papaIng;
  const tieneTomate = !!tomateIng;
  const tieneQueso = !!quesoIng;
  const tieneCrema = !!cremaIng;
  const tieneHuevos = !!huevoIng;
  const tieneHarina = !!harinaIng;
  const tieneLegumbres = !!legumbreIng;

  // ═══ POSTRES ═══
  if (cat === "dessert") {
    const ingSecos = ingredientesES.filter(i => ["harina","azúcar","azucar","polvo","cacao","avena","maicena"].some(s => i.toLowerCase().includes(s)));
    const ingHumedos = ingredientesES.filter(i => ["huevo","mantequilla","aceite","leche","crema","vainilla","miel","yogur"].some(s => i.toLowerCase().includes(s)));
    const ingDeco = ingredientesES.filter(i => !ingSecos.includes(i) && !ingHumedos.includes(i) && !["sal","pimienta"].some(s => i.toLowerCase().includes(s)));
    
    if (tieneHarina) {
      pasos.push(`Precalentar el horno a 180°C. Preparar un molde engrasando con mantequilla y espolvoreando harina. En un bowl grande, tamizar y mezclar los ingredientes secos: ${ingSecos.length > 0 ? ingSecos.map(i => _ingConCantidad(i)).join(", ") : "la harina con el azúcar y el polvo para hornear"}. Agregar una pizca de sal si se tiene.`);
      pasos.push(`En otro bowl, ${huevoIng ? "batir vigorosamente " + _ingConCantidad(huevoIng) + " durante 1 minuto hasta que estén espumosos" : "batir los huevos"}. ${ingHumedos.filter(i => !i.toLowerCase().includes("huevo")).length > 0 ? "Incorporar uno a uno: " + ingHumedos.filter(i => !i.toLowerCase().includes("huevo")).map(i => _ingConCantidad(i)).join(", ") + ". Mezclar bien después de cada adición hasta obtener una mezcla homogénea." : ""}`);
      pasos.push("Hacer un hueco en el centro de los ingredientes secos. Verter la mezcla húmeda y combinar con movimientos envolventes suaves, girando el bowl, hasta que apenas se integren. No sobre-mezclar: algunos grumos pequeños son normales y garantizan una textura esponjosa.");
      if (ingDeco.length > 0) {
        ingDeco.forEach(i => _marcarUsado(i));
        pasos.push(`Incorporar suavemente ${ingDeco.map(i => _ingConCantidad(i)).join(", ")} a la masa con una espátula, distribuyendo de manera uniforme.`);
      }
      pasos.push("Verter la masa en el molde preparado, alisando la superficie con una espátula. Hornear en la rejilla central durante 25-35 minutos. La preparación está lista cuando al insertar un palillo en el centro, este sale limpio o con migajas secas.");
      pasos.push("Retirar del horno. Dejar enfriar dentro del molde sobre una rejilla durante 10 minutos. Desmoldar con cuidado pasando un cuchillo por los bordes. Dejar enfriar completamente antes de decorar y servir.");
    } else {
      pasos.push(`Preparar los ingredientes: ${ingredientesES.slice(0, 3).map(i => _ingConCantidad(i)).join(", ").replace(/,([^,]*)$/, " y$1")}. Colocar en un bowl grande.`);
      pasos.push("Mezclar con un batidor de mano o espátula durante 2-3 minutos hasta obtener una consistencia suave, cremosa y sin grumos.");
      if (ingredientesES.length > 3) {
        pasos.push(`Incorporar ${ingredientesES.slice(3).map(i => _ingConCantidad(i)).join(", ")}. Mezclar suavemente con movimientos envolventes para integrar sin perder la textura aireada.`);
      }
      pasos.push("Distribuir la mezcla en moldes individuales o en un recipiente grande. Cubrir con film plástico tocando la superficie para evitar que se forme una capa. Refrigerar al menos 3-4 horas (idealmente toda la noche) hasta que cuaje completamente. Servir frío, decorando al gusto.");
    }
    ingredientesES.forEach(i => _marcarUsado(i));
    return pasos;
  }

  // ═══ PASO 1: Preparación previa (mise en place) ═══
  const prepItems = [];
  if (cebollaIng) prepItems.push(`pelar y picar finamente ${_ingConCantidad(cebollaIng)} en cubos de medio centímetro`);
  if (ajoIng) prepItems.push(`pelar y picar finamente ${_ingConCantidad(ajoIng)} (o machacar con el lado plano del cuchillo)`);
  if (proteinaIng) {
    const prot = proteinaIng.toLowerCase();
    if (prot.includes("molida") || prot.includes("carne molida")) {
      prepItems.push(`sacar ${_ingConCantidad(proteinaIng)} del refrigerador 10 minutos antes para que esté a temperatura ambiente`);
    } else if (prot.includes("salmón") || prot.includes("atún") || prot.includes("pescado")) {
      prepItems.push(`secar ${_ingConCantidad(proteinaIng)} con papel absorbente por ambos lados`);
    } else {
      prepItems.push(`cortar ${_ingConCantidad(proteinaIng)} en trozos uniformes de 2-3 cm y sazonar con sal y pimienta por ambos lados`);
    }
  }
  if (verdurasIngs.length > 0) {
    const vPrep = verdurasIngs.map(v => {
      const vl = v.toLowerCase();
      if (vl.includes("zanahoria")) return `pelar ${_ingConCantidad(v)} y cortar en rodajas de medio centímetro o en bastones`;
      if (vl.includes("pimiento") || vl.includes("pimentón")) return `lavar ${_ingConCantidad(v)}, retirar las semillas y cortar en tiras o cubos`;
      if (vl.includes("brócoli") || vl.includes("coliflor")) return `lavar ${_ingConCantidad(v)} y separar en ramilletes pequeños`;
      if (vl.includes("champiñón")) return `limpiar ${_ingConCantidad(v)} con un paño húmedo (no sumergir en agua) y cortar en láminas`;
      if (vl.includes("espinaca") || vl.includes("lechuga") || vl.includes("rúcula") || vl.includes("kale") || vl.includes("acelga")) return `lavar ${_ingConCantidad(v)} en abundante agua y escurrir bien`;
      if (vl.includes("berenjena")) return `lavar ${_ingConCantidad(v)} y cortar en cubos de 2 cm (opcionalmente salar y dejar 10 min para eliminar amargor)`;
      if (vl.includes("zapallo") || vl.includes("calabacín") || vl.includes("zucchini")) return `lavar ${_ingConCantidad(v)} y cortar en medias lunas de 1 cm`;
      if (vl.includes("espárrago")) return `lavar ${_ingConCantidad(v)} y cortar las bases leñosas (los últimos 2 cm)`;
      if (vl.includes("pepino")) return `lavar ${_ingConCantidad(v)} y cortar en rodajas finas`;
      return `lavar y cortar ${_ingConCantidad(v)} en trozos medianos`;
    });
    prepItems.push(...vPrep);
  }
  if (papaIng) {
    const pl = papaIng.toLowerCase();
    if (pl.includes("camote") || pl.includes("batata")) {
      prepItems.push(`pelar ${_ingConCantidad(papaIng)} y cortar en cubos de 2-3 cm`);
    } else {
      prepItems.push(`pelar ${_ingConCantidad(papaIng)} y cortar en cubos de 2 cm`);
    }
  }
  if (legumbreIng) {
    prepItems.push(`escurrir y enjuagar ${_ingConCantidad(legumbreIng)}`);
  }
  if (panIng) {
    _marcarUsado(panIng);
  }
  
  if (prepItems.length > 0) {
    pasos.push(`Preparar todos los ingredientes (mise en place): ${prepItems.join(". ")}. Organizar cada ingrediente en recipientes separados antes de empezar a cocinar.`);
  }

  // ═══ PASO 2: Sazonar proteína ═══
  if (proteinaIng) {
    const condimentosProteina = condimentos.filter(c => {
      const cl = c.toLowerCase();
      return cl.includes("comino") || cl.includes("paprika") || cl.includes("pimentón en polvo") || cl.includes("curry") || cl.includes("orégano") || cl.includes("cúrcuma");
    });
    if (condimentosProteina.length > 0) {
      condimentosProteina.forEach(c => _marcarUsado(c));
      pasos.push(`Sazonar ${proteinaIng.toLowerCase()} con ${condimentosProteina.map(c => _ingConCantidad(c)).join(", ")}, sal y pimienta. Frotar bien las especias por todos los lados y dejar marinar mientras se prepara el resto (mínimo 10 minutos).`);
    }
  }

  // ═══ PASO 3: Aceite y base aromática ═══
  if (tieneBase) {
    const aceiteStr = aceiteIng ? `los ${_ingConCantidad(aceiteIng)}` : (mantequillaIng ? `${_ingConCantidad(mantequillaIng)}` : "un chorrito de aceite");
    if (aceiteIng) _marcarUsado(aceiteIng);
    if (mantequillaIng) _marcarUsado(mantequillaIng);
    const baseStr = [cebollaIng, ajoIng].filter(Boolean).map(i => i.toLowerCase()).join(" y ");
    pasos.push(`Calentar ${aceiteStr} en una sartén grande u olla a fuego medio. Cuando esté caliente, agregar ${baseStr}. Cocinar revolviendo con una cuchara de madera durante 3-4 minutos hasta que ${cebollaIng ? "la cebolla esté transparente y suave" : "el ajo libere su aroma"}. No dejar que se queme el ajo.`);
  } else if (aceiteIng || mantequillaIng) {
    const aceiteStr = aceiteIng ? `los ${_ingConCantidad(aceiteIng)}` : `${_ingConCantidad(mantequillaIng)}`;
    if (aceiteIng) _marcarUsado(aceiteIng);
    if (mantequillaIng) _marcarUsado(mantequillaIng);
    pasos.push(`Calentar ${aceiteStr} en una sartén grande a fuego medio.`);
  }

  // ═══ PASO 4: Cocinar proteína ═══
  if (proteinaIng) {
    const prot = proteinaIng.toLowerCase();
    const protCant = _ingConCantidad(proteinaIng);
    if (prot.includes("pollo") || prot.includes("pechuga") || prot.includes("pavo")) {
      pasos.push(`Subir el fuego a medio-alto. Agregar ${protCant} a la sartén sin amontonar las piezas. Dorar sin mover durante 4 minutos hasta que el lado inferior esté dorado. Voltear y cocinar 4-5 minutos más por el otro lado hasta que estén completamente cocidos (sin rosado al centro). El jugo que suelte debe ser transparente. Retirar a un plato y cubrir con papel aluminio para mantener caliente.`);
    } else if (prot.includes("molida")) {
      pasos.push(`Subir el fuego a medio-alto. Agregar ${protCant}. Distribuir en una capa uniforme y dejar dorar sin mover por 2 minutos. Luego desmenuzar con una cuchara de madera y cocinar durante 5-6 minutos más, rompiendo los trozos grandes, hasta que esté completamente dorada y sin zonas rosadas. Escurrir el exceso de grasa si es necesario.`);
    } else if (prot.includes("cerdo")) {
      pasos.push(`Agregar ${protCant} a la sartén caliente. Dorar a fuego medio-alto durante 3 minutos por cada lado hasta obtener una costra dorada. Reducir el fuego a medio-bajo, tapar y cocinar 8-10 minutos más hasta que esté completamente cocido. Dejar reposar 5 minutos antes de cortar.`);
    } else if (prot.includes("salmón") || prot.includes("atún") || prot.includes("pescado")) {
      const limonStr = vinagreIngs.find(v => v.toLowerCase().includes("limón") || v.toLowerCase().includes("limon"));
      if (limonStr) _marcarUsado(limonStr);
      pasos.push(`Sazonar ${protCant} con sal, pimienta${limonStr ? " y unas gotas de jugo de " + limonStr.toLowerCase() : ""}. Colocar en la sartén bien caliente con la piel hacia arriba (si tiene piel). Cocinar sin mover 4 minutos hasta obtener una costra dorada y crujiente. Voltear con cuidado usando una espátula ancha y cocinar 3-4 minutos más. El centro puede quedar ligeramente rosado (punto medio) o completamente cocido según preferencia.`);
    } else if (prot.includes("camarón") || prot.includes("camarones")) {
      pasos.push(`Asegurar que la sartén esté bien caliente. Agregar ${protCant} en una sola capa sin amontonar. Cocinar 2 minutos por un lado sin mover hasta que se tornen rosados en la base. Voltear y cocinar 1-2 minutos más hasta que estén completamente rosados, firmes y en forma de C. Retirar inmediatamente para evitar que se sobre-cocinen.`);
    } else if (prot.includes("cordero")) {
      pasos.push(`Agregar ${protCant} a la sartén bien caliente. Dorar a fuego alto durante 2-3 minutos por cada lado. Reducir a fuego medio y cocinar hasta el punto deseado: 5 min adicionales para término medio, 8 min para bien cocido. Retirar y dejar reposar 5 minutos cubierto con papel aluminio.`);
    } else {
      pasos.push(`Cocinar ${protCant} en la sartén a fuego medio-alto. Sazonar con sal y pimienta. Dorar bien por ambos lados durante 3-4 minutos por lado hasta que esté completamente cocido. Retirar y reservar.`);
    }
  }

  // ═══ PASO 5: Huevos (si no hay otra proteína) ═══
  if (tieneHuevos && !tieneProteina) {
    pasos.push(`Cascar ${_ingConCantidad(huevoIng)} en un bowl. Batir vigorosamente con un tenedor o batidor durante 30 segundos. Agregar una pizca de sal y pimienta. Cocinar en sartén con un poco de aceite o mantequilla a fuego medio-bajo, revolviendo con una espátula de silicona con movimientos amplios y suaves. Retirar del fuego cuando aún estén ligeramente húmedos (se terminan de cocinar con el calor residual).`);
  }

  // ═══ PASO 6: Tomate / salsa ═══
  if (tieneTomate) {
    const condStr = condimentos.filter(c => !ingredientesUsados.has(c.toLowerCase())).slice(0, 3);
    condStr.forEach(c => _marcarUsado(c));
    pasos.push(`Agregar ${_ingConCantidad(tomateIng)} a la preparación. Cocinar a fuego medio durante 8-10 minutos, revolviendo cada 2-3 minutos con una cuchara de madera y raspando el fondo de la sartén para incorporar los sabores caramelizados. La salsa estará lista cuando oscurezca, espese y el aceite comience a separarse en los bordes. ${condStr.length > 0 ? "Sazonar con " + condStr.map(c => _ingConCantidad(c)).join(", ") + "." : "Sazonar al gusto con sal y pimienta."}`);
  }
  
  // ═══ PASO 6.5: Salsas preparadas ═══
  if (salsaIngs.length > 0) {
    const salsasNoUsadas = salsaIngs.filter(s => !ingredientesUsados.has(s.toLowerCase()));
    if (salsasNoUsadas.length > 0) {
      salsasNoUsadas.forEach(s => _marcarUsado(s));
      pasos.push(`Incorporar ${salsasNoUsadas.map(s => _ingConCantidad(s)).join(" y ")}. Mezclar bien para integrar con la preparación. Cocinar 2-3 minutos a fuego medio para que los sabores se fusionen.`);
    }
  }

  // ═══ PASO 7: Verduras ═══
  if (verdurasIngs.length > 0) {
    // Separar verduras duras (más tiempo) y blandas (menos tiempo)
    const duras = verdurasIngs.filter(v => ["zanahoria","brócoli","coliflor","nabo","repollo","col"].some(d => v.toLowerCase().includes(d)));
    const blandas = verdurasIngs.filter(v => !duras.includes(v));
    
    if (duras.length > 0 && blandas.length > 0) {
      pasos.push(`Incorporar primero las verduras más firmes: ${duras.map(v => _ingConCantidad(v)).join(", ")}. Cocinar a fuego medio durante 4-5 minutos revolviendo de vez en cuando. Luego agregar las verduras más tiernas: ${blandas.map(v => _ingConCantidad(v)).join(", ")}. Cocinar 3-4 minutos más hasta que todas estén tiernas pero aún con algo de firmeza (al dente).`);
    } else {
      const vStr = verdurasIngs.map(v => _ingConCantidad(v)).join(", ");
      pasos.push(`Incorporar ${vStr}. Cocinar a fuego medio durante 5-8 minutos, revolviendo cada 1-2 minutos, hasta que estén tiernas pero aún con algo de firmeza. No sobre-cocinar para mantener el color y los nutrientes.`);
    }
  }

  // ═══ PASO 7.5: Legumbres ═══
  if (tieneLegumbres) {
    const condNoUsados = condimentos.filter(c => !ingredientesUsados.has(c.toLowerCase()));
    const condLegumbre = condNoUsados.find(c => c.toLowerCase().includes("comino") || c.toLowerCase().includes("laurel"));
    if (condLegumbre) _marcarUsado(condLegumbre);
    pasos.push(`Escurrir y enjuagar ${_ingConCantidad(legumbreIng)}. Incorporar a la preparación${condLegumbre ? " junto con " + _ingConCantidad(condLegumbre) : ""}. Cocinar a fuego medio-bajo durante 5-8 minutos, revolviendo suavemente para no deshacer las legumbres, hasta que absorban los sabores de la base.`);
  }

  // ═══ PASO 8: Carbohidrato (preparar aparte) ═══
  if (tieneArroz) {
    pasos.push(`Aparte (se puede hacer al inicio para sincronizar tiempos), enjuagar ${_ingConCantidad(arrozIng)} bajo el chorro de agua fría durante 30 segundos para eliminar el exceso de almidón. Colocar en una olla con el doble de agua (en volumen) y una pizca de sal. Llevar a ebullición fuerte, revolver una vez, luego tapar y reducir a fuego mínimo. Cocinar sin destapar: 12-15 minutos para arroz blanco, 25-30 minutos para integral. Retirar del fuego y dejar reposar tapado 5 minutos. Esponjar con un tenedor.`);
  }
  if (tienePasta) {
    pasos.push(`Aparte, hervir abundante agua (al menos 1 litro por cada 100 g de pasta) con una cucharada generosa de sal. Cuando hierva a borbotones, agregar ${_ingConCantidad(pastaIng)}. Cocinar revolviendo durante el primer minuto para evitar que se pegue. Seguir las indicaciones del paquete para el tiempo exacto (restar 1 minuto para al dente). Antes de escurrir, reservar media taza del agua de cocción (tiene almidón que ayuda a espesar salsas). Escurrir y mezclar con la salsa inmediatamente.`);
  }
  if (tieneQuinoa) {
    pasos.push(`Aparte, enjuagar ${_ingConCantidad(quinoaIng)} en un colador fino bajo el chorro de agua fría durante 30 segundos (esto elimina la saponina que da sabor amargo). Colocar en una olla con el doble de agua y una pizca de sal. Llevar a ebullición, tapar, reducir a fuego bajo y cocinar 15 minutos hasta que se absorba el agua y se vean las espirales blancas del germen. Retirar del fuego y dejar reposar tapada 5 minutos. Esponjar con un tenedor.`);
  }
  if (tienePapas && !tieneBase) {
    pasos.push(`Cocinar ${_ingConCantidad(papaIng)}: colocar los cubos en una olla con agua fría que los cubra y una pizca de sal. Llevar a ebullición y cocinar a fuego medio 15-18 minutos hasta que al insertar un cuchillo entre fácilmente. Escurrir bien.`);
  }

  // ═══ PASO 9: Crema / queso / leche ═══
  if (tieneCrema) {
    pasos.push(`Reducir el fuego a bajo. Agregar ${_ingConCantidad(cremaIng)} a la preparación. Mezclar bien con movimientos circulares y cocinar por 3-5 minutos sin dejar que hierva (hervir la crema puede cortarla). La salsa debe quedar sedosa y con cuerpo.`);
  }
  if (lecheIng && !cremaIng) {
    _marcarUsado(lecheIng);
    pasos.push(`Agregar ${_ingConCantidad(lecheIng)}. Mezclar bien y cocinar a fuego medio-bajo durante 3-4 minutos para integrar.`);
  }
  if (tieneQueso) {
    pasos.push(`Agregar ${_ingConCantidad(quesoIng)}: si es para gratinar, distribuir por encima y llevar al horno precalentado a 200°C durante 5-8 minutos hasta que esté dorado y burbujeante. Si es para mezclar, incorporar con el fuego apagado y revolver hasta que se derrita con el calor residual.`);
  }

  // ═══ PASO 10: Dulces / miel ═══
  if (dulceIngs.length > 0) {
    const dulcesNoUsados = dulceIngs.filter(d => !ingredientesUsados.has(d.toLowerCase()));
    if (dulcesNoUsados.length > 0) {
      dulcesNoUsados.forEach(d => _marcarUsado(d));
      pasos.push(`Incorporar ${dulcesNoUsados.map(d => _ingConCantidad(d)).join(" y ")} y mezclar para balancear los sabores.`);
    }
  }

  // ═══ DESAYUNOS (fallback si se generaron pocos pasos) ═══
  if (cat === "breakfast" && pasos.length < 3) {
    const nombresIngredientes = ingredientesES.map(i => _ingConCantidad(i)).join(", ");
    pasos.length = 0; // Resetear y generar instrucciones de desayuno completas
    pasos.push(`Preparar todos los ingredientes: ${nombresIngredientes}. Lavar, pelar y picar lo que corresponda.`);
    if (tieneHuevos) {
      pasos.push(`Batir ${_ingConCantidad(huevoIng)} en un bowl con una pizca de sal y pimienta.`);
    }
    if (aceiteIng || mantequillaIng) {
      pasos.push(`Calentar ${aceiteIng ? _ingConCantidad(aceiteIng) : _ingConCantidad(mantequillaIng)} en una sartén a fuego medio.`);
    }
    pasos.push("Cocinar los ingredientes principales: agregar primero los que necesiten más tiempo de cocción, luego los más delicados. Revolver con suavidad para distribuir el calor de manera uniforme.");
    if (condimentos.length > 0) {
      condimentos.forEach(c => _marcarUsado(c));
      pasos.push(`Sazonar con ${condimentos.map(c => _ingConCantidad(c)).join(", ")}. Ajustar la sazón al gusto.`);
    }
    pasos.push("Servir caliente en un plato. Acompañar con una bebida caliente si se desea. ¡Buen provecho!");
  }

  // ═══ PASO FINAL: Reintegrar proteína y emplatar ═══
  if (pasos.length > 0) {
    // Si la proteína se retiró antes, reincorporar
    if (proteinaIng && (proteinaIng.toLowerCase().includes("pollo") || proteinaIng.toLowerCase().includes("pechuga"))) {
      const tieneAcompañamiento = tieneArroz || tienePasta || tieneQuinoa || tienePapas;
      if (verdurasIngs.length > 0 || tieneTomate) {
        pasos.push(`Regresar el ${proteinaIng.toLowerCase()} reservado a la sartén. Mezclar con la preparación y cocinar 2-3 minutos más para integrar los sabores.`);
      }
    }
    
    // Condimentos no usados aún
    const condNoUsados = condimentos.filter(c => !ingredientesUsados.has(c.toLowerCase()));
    if (condNoUsados.length > 0) {
      condNoUsados.forEach(c => _marcarUsado(c));
      pasos.push(`Ajustar la sazón: agregar ${condNoUsados.map(c => _ingConCantidad(c)).join(", ")}. Probar y rectificar sal y pimienta si es necesario.`);
    }
    
    // Emplatado detallado
    let emplatado = "Emplatar y servir: ";
    const elementos = [];
    if (tieneArroz) elementos.push(`servir una cama de ${arrozIng.toLowerCase()} en el centro del plato`);
    if (tienePasta) elementos.push(`colocar ${pastaIng.toLowerCase()} como base`);
    if (tieneQuinoa) elementos.push(`distribuir la ${quinoaIng.toLowerCase()} como base`);
    if (tienePapas) elementos.push(`acompañar con ${papaIng.toLowerCase()}`);
    if (proteinaIng) elementos.push(`disponer ${proteinaIng.toLowerCase()} encima o al costado`);
    if (verdurasIngs.length > 0) elementos.push(`decorar con ${verdurasIngs.slice(0, 2).map(v => v.toLowerCase()).join(" y ")}`);
    if (tieneLegumbres) elementos.push(`servir las ${legumbreIng.toLowerCase()} junto a la preparación`);
    
    emplatado += elementos.length > 0 ? elementos.join(", ") + ". " : "colocar la preparación en un plato hondo. ";
    
    // Hierbas frescas para decorar
    const hierbas = condimentos.filter(c => c.toLowerCase().includes("cilantro") || c.toLowerCase().includes("perejil") || c.toLowerCase().includes("albahaca") || c.toLowerCase().includes("eneldo") || c.toLowerCase().includes("menta"));
    if (hierbas.length > 0) {
      emplatado += `Picar finamente ${hierbas[0].toLowerCase()} fresco y esparcir generosamente por encima. `;
    }
    
    // Vinagre/limón para terminar
    const vinagreNoUsado = vinagreIngs.filter(v => !ingredientesUsados.has(v.toLowerCase()));
    if (vinagreNoUsado.length > 0) {
      vinagreNoUsado.forEach(v => _marcarUsado(v));
      emplatado += `Agregar un toque de ${vinagreNoUsado.map(v => v.toLowerCase()).join(" y ")} por encima para realzar los sabores. `;
    }
    
    // Frutos secos para terminar
    if (frutoSecoIngs.length > 0) {
      const fsNoUsados = frutoSecoIngs.filter(f => !ingredientesUsados.has(f.toLowerCase()));
      if (fsNoUsados.length > 0) {
        fsNoUsados.forEach(f => _marcarUsado(f));
        emplatado += `Espolvorear ${fsNoUsados.map(f => _ingConCantidad(f)).join(" y ")} por encima para dar textura. `;
      }
    }
    
    emplatado += "Servir inmediatamente y ¡buen provecho!";
    pasos.push(emplatado);
  }

  // ═══ VERIFICACIÓN: Ingredientes no mencionados ═══
  const noUsados = ingredientesES.filter(i => !ingredientesUsados.has(i.toLowerCase()));
  if (noUsados.length > 0) {
    // Filtrar sal/pimienta/agua que son implícitos
    const noUsadosImportantes = noUsados.filter(n => {
      const nl = n.toLowerCase();
      return !nl.match(/^(sal|pimienta|agua|hielo)$/);
    });
    if (noUsadosImportantes.length > 0) {
      // Insertar antes del último paso (emplatado)
      const ultimoPaso = pasos.pop();
      pasos.push(`Nota: no olvidar incorporar ${noUsadosImportantes.map(n => _ingConCantidad(n)).join(", ")} durante la cocción o al momento de servir según preferencia personal.`);
      pasos.push(ultimoPaso);
    }
  }

  // ═══ Si no generamos nada (edge case extremo) ═══
  if (pasos.length === 0) {
    const todosIngStr = ingredientesES.map(i => _ingConCantidad(i)).join(", ");
    pasos.push(`Preparar todos los ingredientes: ${todosIngStr}. Lavar, pelar y picar según corresponda.`);
    pasos.push("Calentar aceite en una sartén grande u olla a fuego medio. Agregar los aromáticos (cebolla, ajo) si los hay y sofreír 3-4 minutos.");
    pasos.push("Agregar los ingredientes que requieran más cocción primero (carnes, tubérculos). Cocinar revolviendo a fuego medio durante 8-10 minutos.");
    pasos.push("Incorporar los vegetales y condimentos. Cocinar 5-7 minutos más hasta que todo esté bien cocido y los sabores integrados.");
    pasos.push("Probar y ajustar la sazón con sal y pimienta. Servir caliente en platos. ¡Buen provecho!");
  }

  return pasos;
}

// ═══════════════════════════════════════════════
// CLASIFICACIÓN, FLAGS, MACROS
// ═══════════════════════════════════════════════
const _CATEGORIA_MAP = {
  breakfast: "desayuno", starter: "snack_am", side: "snack_pm",
  dessert: "snack_pm", snack: "snack_pm",
  beef: "almuerzo", chicken: "almuerzo", lamb: "almuerzo",
  pork: "almuerzo", seafood: "cena", pasta: "cena",
  vegetarian: "almuerzo", vegan: "cena", goat: "almuerzo",
  miscellaneous: "cena"
};

function _clasificarTipoComida(category, tags) {
  const cat = (category || "").toLowerCase();
  if (_CATEGORIA_MAP[cat]) return _CATEGORIA_MAP[cat];
  if (tags) {
    const t = tags.toLowerCase();
    if (t.includes("breakfast")) return "desayuno";
    if (t.includes("snack") || t.includes("side")) return "snack_pm";
    if (t.includes("lunch")) return "almuerzo";
    if (t.includes("dinner") || t.includes("supper")) return "cena";
  }
  return Math.random() > 0.5 ? "almuerzo" : "cena";
}

const _GLUTEN_INGREDIENTS = ["flour", "bread", "pasta", "noodle", "wheat", "spaghetti", "penne", "tortilla", "wrap", "couscous", "cracker", "oat", "lasagne"];
const _LACTOSE_INGREDIENTS = ["milk", "cream", "cheese", "butter", "yogurt", "yoghurt", "curd", "mascarpone", "ricotta"];
const _MEAT_INGREDIENTS = ["chicken", "beef", "pork", "lamb", "bacon", "sausage", "ham", "mince", "prawn", "shrimp", "fish", "salmon", "tuna", "anchov", "goat", "duck", "turkey", "veal", "chorizo", "prosciutto", "pancetta"];

function _detectarFlags(ingredientesEN) {
  const todos = ingredientesEN.map(i => i.toLowerCase()).join(" ");
  return {
    es_sin_gluten: !_GLUTEN_INGREDIENTS.some(g => todos.includes(g)),
    es_sin_lactosa: !_LACTOSE_INGREDIENTS.some(l => todos.includes(l)),
    es_vegetariana: !_MEAT_INGREDIENTS.some(m => todos.includes(m))
  };
}

function _estimarMacros(ingredientes, categoria, tipoComidaForzado) {
  const cat = (categoria || "").toLowerCase();
  const esSnack = tipoComidaForzado === 'snack_am' || tipoComidaForzado === 'snack_pm';
  
  // Si es snack, usar perfil liviano
  if (esSnack) {
    const v = () => 0.9 + Math.random() * 0.2;
    return {
      calorias_base: Math.round(200 * v()),
      proteinas_g: Math.round(7 * v()),
      carbohidratos_g: Math.round(25 * v()),
      grasas_g: Math.round(9 * v())
    };
  }
  
  const perfiles = {
    chicken:   { cal: 480, p: 38, c: 35, g: 18 },
    beef:      { cal: 550, p: 35, c: 40, g: 25 },
    pork:      { cal: 520, p: 30, c: 38, g: 28 },
    lamb:      { cal: 560, p: 32, c: 35, g: 30 },
    seafood:   { cal: 420, p: 35, c: 30, g: 16 },
    pasta:     { cal: 500, p: 18, c: 65, g: 16 },
    vegetarian:{ cal: 400, p: 18, c: 55, g: 14 },
    vegan:     { cal: 380, p: 15, c: 58, g: 12 },
    breakfast: { cal: 380, p: 15, c: 50, g: 14 },
    starter:   { cal: 220, p: 8, c: 25, g: 10 },
    side:      { cal: 200, p: 6, c: 28, g: 8 },
    dessert:   { cal: 280, p: 5, c: 42, g: 12 },
    goat:      { cal: 500, p: 30, c: 35, g: 24 },
    miscellaneous: { cal: 450, p: 22, c: 45, g: 18 }
  };
  const base = perfiles[cat] || { cal: 450, p: 22, c: 45, g: 18 };
  const v = () => 0.9 + Math.random() * 0.2;
  return {
    calorias_base: Math.round(base.cal * v()),
    proteinas_g: Math.round(base.p * v()),
    carbohidratos_g: Math.round(base.c * v()),
    grasas_g: Math.round(base.g * v())
  };
}

// ═══════════════════════════════════════════════
// PARSEO DE MEDIDAS
// ═══════════════════════════════════════════════
function _parsearMedida(measure) {
  if (!measure || !measure.trim()) return { cantidad: 1, unidad: "unidad" };
  const m = measure.trim();
  
  const numMatch = m.match(/^([\d/.]+)\s*(.*)/);
  if (numMatch) {
    let cant = numMatch[1];
    if (cant.includes('/')) {
      const parts = cant.split('/');
      cant = parseFloat(parts[0]) / parseFloat(parts[1]);
    } else {
      cant = parseFloat(cant);
    }
    if (isNaN(cant)) cant = 1;
    
    let unidad = (numMatch[2] || "").trim().toLowerCase();
    
    // Mapa de unidades
    const uMap = {
      g: "g", gram: "g", grams: "g", kg: "kg",
      ml: "ml", l: "L", litre: "L", liter: "L", litres: "L", liters: "L",
      cup: "taza", cups: "tazas", tbsp: "cda", tbs: "cda",
      tablespoon: "cda", tablespoons: "cdas",
      tsp: "cdta", teaspoon: "cdta", teaspoons: "cdtas",
      oz: "oz", ounce: "oz", ounces: "oz",
      lb: "lb", pound: "lb", pounds: "lbs",
      clove: "diente", cloves: "dientes",
      slice: "rebanada", slices: "rebanadas",
      piece: "pieza", pieces: "piezas",
      bunch: "manojo", handful: "puñado", pinch: "pizca",
      can: "lata", tin: "lata", bottle: "botella", packet: "paquete",
      leaves: "hojas", leaf: "hoja", sprigs: "ramitas", sprig: "ramita",
      stalks: "tallos", stalk: "tallo", strips: "tiras"
    };

    // Descripciones de preparación que vienen como "unidad"
    const prepMap = {
      "finely chopped": "picado fino", "roughly chopped": "picado grueso",
      "chopped": "picado", "diced": "en cubitos",
      "sliced": "rebanado", "thinly sliced": "en rodajas finas",
      "minced": "picado fino", "crushed": "triturado",
      "grated": "rallado", "peeled": "pelado",
      "halved": "mitad", "quartered": "cuarto",
      "whole": "entero", "beaten": "batido",
      "large": "grande", "medium": "mediano",
      "small": "pequeño", "freshly ground": "recién molido",
      "to serve": "para servir", "to garnish": "para decorar",
      "softened": "ablandado", "melted": "derretido",
      "shredded": "desmenuzado", "juiced": "exprimido",
      "zested": "rallado"
    };
    
    // Buscar unidad exacta primero
    let encontrada = false;
    // Intentar match exacto palabra por palabra
    const primeraPalabra = unidad.split(/\s+/)[0];
    if (uMap[unidad]) {
      unidad = uMap[unidad]; encontrada = true;
    } else if (uMap[primeraPalabra]) {
      // "cups chopped" → tazas
      unidad = uMap[primeraPalabra]; encontrada = true;
    }
    
    if (!encontrada && unidad) {
      // Buscar preparación (más larga primero)
      const prepOrdenado = Object.entries(prepMap).sort((a,b) => b[0].length - a[0].length);
      for (const [en, es] of prepOrdenado) {
        if (unidad.includes(en)) {
          unidad = es; encontrada = true; break;
        }
      }
    }
    
    if (!encontrada) unidad = unidad ? "porción" : "unidad";
    
    return { cantidad: Math.round(cant * 100) / 100, unidad };
  }
  
  // Sin número
  const textoMap = {
    "to taste": "al gusto", "handful": "puñado", "pinch": "pizca",
    "some": "un poco", "as needed": "a necesidad", "a drizzle": "un chorrito",
    "garnish": "para decorar", "topping": "para decorar",
    "for frying": "para freír", "for greasing": "para engrasar"
  };
  const lower = m.toLowerCase();
  for (const [en, es] of Object.entries(textoMap)) {
    if (lower.includes(en)) return { cantidad: 1, unidad: es };
  }
  return { cantidad: 1, unidad: "porción" };
}

// ═══════════════════════════════════════════════
// CONVERTIR MealDB → Schema NutriPlan
// ═══════════════════════════════════════════════
function _convertirMealDB(meal, tipoComidaForzado) {
  const ingredientesEN = [];
  const ingredientesNombresES = [];
  const ingredientes = [];
  
  for (let i = 1; i <= 20; i++) {
    const name = (meal[`strIngredient${i}`] || "").trim();
    const measure = (meal[`strMeasure${i}`] || "").trim();
    if (!name) continue;
    ingredientesEN.push(name);
    
    const { cantidad, unidad } = _parsearMedida(measure);
    const nombreES = _traducirIngrediente(name);
    ingredientesNombresES.push(nombreES);
    
    // Normalización robusta: singular, sin modificadores, sin acentos
    const norm = _normalizarIngrediente(nombreES);
    
    ingredientes.push({
      nombre: nombreES,
      nombre_normalizado: norm,
      nombre_display: nombreES.charAt(0).toUpperCase() + nombreES.slice(1),
      cantidad_base: cantidad,
      unidad: unidad,
      unidad_compra: unidad === "g" ? "paquetes" : unidad === "ml" ? "botellas" : "unidades",
      factor_conversion: unidad === "g" ? 500 : unidad === "ml" ? 1000 : 1,
      descripcion_compra: unidad === "g" ? "paquete de 500g" : unidad === "ml" ? "botella de 1L" : "unidad"
    });
  }
  
  const flags = _detectarFlags(ingredientesEN);
  const tipo = tipoComidaForzado || _clasificarTipoComida(meal.strCategory, meal.strTags);
  const macros = _estimarMacros(ingredientes, meal.strCategory, tipo);
  
  // Nombre 100% español (con contexto de snack si aplica)
  const nombre = _generarNombreEspanol(meal, ingredientesNombresES, meal.strCategory, tipo);
  
  // Instrucciones 100% español (con contexto de snack si aplica)
  const instrucciones = _generarInstruccionesEspanol(ingredientesNombresES, meal.strCategory, tipo, ingredientes);
  
  // Instrucciones Thermomix solo para almuerzo y cena
  let instrucciones_thermomix = [];
  if (tipo === "almuerzo" || tipo === "cena") {
    instrucciones_thermomix = _generarThermomixDesdeInstrucciones(ingredientes, tipo);
  }
  
  // Guardar área para priorización
  const area = (meal.strArea || "").trim();
  
  return {
    id: "online_" + meal.idMeal,
    nombre,
    tipo_comida: tipo,
    ...macros,
    ...flags,
    ingredientes,
    instrucciones,
    instrucciones_thermomix,
    _fuente: "online",
    _imagen: meal.strMealThumb || null,
    _nombreOriginal: meal.strMeal,
    _area: area
  };
}

// ─── Instrucciones Thermomix TM6 ───
// Nivel profesional: mise en place, técnica, señales sensoriales,
// comandos completos (tiempo / temperatura / velocidad / giro),
// uso correcto de accesorios (mariposa, Varoma, cestillo, espátula),
// verificaciones de cocción y emplatado.
function _generarThermomixDesdeInstrucciones(ingredientes, tipo) {
  const pasos = [];
  let paso = 1;
  const addPaso = (texto) => { pasos.push(`Paso ${paso}: ${texto}`); paso++; };

  // ── Clasificar ingredientes ──
  const cebolla = ingredientes.find(i => i.nombre_normalizado.includes("cebolla"));
  const ajo = ingredientes.find(i => i.nombre_normalizado === "ajo" || (i.nombre_normalizado.includes("ajo") && !i.nombre_normalizado.includes("polvo")));
  const aceite = ingredientes.find(i => i.nombre_normalizado.includes("aceite"));
  const proteina = ingredientes.find(i =>
    ["pollo","pechuga_pollo","carne","carne_molida","carne_res","cerdo","pavo","pechuga_pavo","salmon","atun","pescado","pescado_blanco","merluza","camaron","camarones","tofu","jamon_pavo"].some(p => i.nombre_normalizado === p || i.nombre_normalizado.includes(p))
  );
  const carb = ingredientes.find(i =>
    ["arroz","arroz_integral","arroz_blanco","arroz_basmati","arroz_arborio","quinoa","pasta","fideo","espagueti","pasta_penne"].some(c => i.nombre_normalizado === c)
  );
  const legumbre = ingredientes.find(i =>
    ["lenteja","frijol","garbanzo","poroto","edamame","arveja"].some(c => i.nombre_normalizado.includes(c))
  );
  const vegetales = ingredientes.filter(i =>
    ["zanahoria","pimiento","zapallo","tomate","espinaca","brocoli","champiñon","champinones","repollo","calabacin","berenjena","poroto_verde","papa","camote","esparrago","coliflor","kale","apio","choclo"].some(v => i.nombre_normalizado.includes(v))
  );
  const especias = ingredientes.filter(i =>
    ["sal","pimienta","comino","oregano","canela","curry","paprika","pimenton","chile","nuez_moscada","ajo_polvo","jengibre","romero","tomillo","eneldo","albahaca","cilantro","perejil","chile_polvo","pimenton_polvo"].some(e => i.nombre_normalizado === e || i.nombre_normalizado.includes(e))
  );
  const liquido = ingredientes.find(i =>
    ["caldo","caldo_pollo","caldo_verduras","caldo_carne","leche","leche_coco","agua","salsa_tomate","crema","salsa_verde"].some(l => i.nombre_normalizado === l || i.nombre_normalizado.includes(l))
  );
  const salsaFinal = ingredientes.find(i =>
    i.nombre_normalizado.includes("salsa_tomate") || i.nombre_normalizado.includes("crema") || i.nombre_normalizado.includes("leche_coco") || i.nombre_normalizado.includes("crema_agria") || i.nombre_normalizado.includes("salsa_verde")
  );
  const hierbas = ingredientes.filter(i =>
    ["cilantro","perejil","albahaca","eneldo","romero","tomillo","cebollin"].some(h => i.nombre_normalizado === h || i.nombre_normalizado.includes(h))
  );
  const queso = ingredientes.find(i => i.nombre_normalizado.includes("queso"));

  const nombresEspecias = especias.map(e => e.nombre).join(", ");
  const nombresVegetales = vegetales.slice(0, 4).map(v => v.nombre).join(", ");
  const nombresHierbas = hierbas.map(h => h.nombre).join(", ");

  const esDelicado = proteina && ["salmon","pescado","pescado_blanco","merluza","camaron","camarones","tofu"].some(p => proteina.nombre_normalizado.includes(p));
  const esMolida = proteina && (proteina.nombre_normalizado.includes("carne_molida") || proteina.nombre_normalizado.includes("molida"));
  const esPollo = proteina && (proteina.nombre_normalizado.includes("pollo") || proteina.nombre_normalizado.includes("pavo"));
  const esRes = proteina && (proteina.nombre_normalizado.includes("carne_res") || (proteina.nombre_normalizado.includes("carne") && !esMolida) || proteina.nombre_normalizado.includes("cerdo"));

  // ════════════════════════════════════════════════════════
  // PASO 0: MISE EN PLACE (preparación previa)
  // ════════════════════════════════════════════════════════
  const prepList = [];
  if (cebolla) prepList.push(`pelar ${cebolla.nombre} y cortarla en cuartos`);
  if (ajo) prepList.push(`pelar los dientes de ajo y retirar el germen central (evita amargor)`);
  if (vegetales.length > 0) {
    const cortes = vegetales.slice(0, 4).map(v => {
      const n = v.nombre_normalizado;
      if (n.includes("zanahoria")) return `pelar ${v.nombre} y cortarla en rodajas de 0.5 cm`;
      if (n.includes("papa") || n.includes("camote")) return `pelar ${v.nombre} y cortarla en cubos de 2 cm (tamaño uniforme para cocción pareja)`;
      if (n.includes("pimiento")) return `retirar semillas de ${v.nombre} y cortar en tiras de 1 cm`;
      if (n.includes("brocoli") || n.includes("coliflor")) return `separar ${v.nombre} en floretes de tamaño similar (~3 cm)`;
      if (n.includes("calabacin") || n.includes("berenjena")) return `cortar ${v.nombre} en medias lunas de 1 cm`;
      if (n.includes("zapallo")) return `pelar ${v.nombre} y cortar en cubos de 2.5 cm`;
      if (n.includes("espinaca") || n.includes("kale")) return `lavar ${v.nombre} y retirar tallos duros`;
      if (n.includes("champi")) return `limpiar ${v.nombre} con papel húmedo (no sumergir) y cortar en cuartos`;
      if (n.includes("tomate")) return `escaldar ${v.nombre} 30 seg, pelar y cortar en cubos`;
      return `lavar y cortar ${v.nombre} en trozos uniformes`;
    });
    prepList.push(...cortes);
  }
  if (proteina && !esMolida) {
    if (esDelicado) {
      if (proteina.nombre_normalizado.includes("camar")) {
        prepList.push(`pelar y desvenar ${proteina.nombre}, secar con papel absorbente`);
      } else {
        prepList.push(`revisar ${proteina.nombre} y retirar espinas con pinza, secar bien con papel absorbente (la humedad impide buen resultado al vapor)`);
      }
    } else if (esPollo) {
      prepList.push(`cortar ${proteina.nombre} en piezas de ~150 g, salpimentar por ambos lados y dejar atemperar 10 minutos fuera del refrigerador`);
    } else if (esRes) {
      prepList.push(`cortar ${proteina.nombre} contra la fibra en trozos de ~150 g, salpimentar generosamente y dejar atemperar 15 minutos`);
    }
  }
  if (hierbas.length > 0) prepList.push(`lavar y picar ${nombresHierbas} por separado; reservar para el final`);

  if (prepList.length > 0) {
    addPaso(`**Mise en place.** Antes de encender el TM6, preparar toda la estación de trabajo: ${prepList.join("; ")}. Pesar el resto de ingredientes en cuencos separados. Tener a mano espátula TM, Varoma con bandeja y cestillo. Esta preparación evita pausas durante la cocción y asegura resultados consistentes.`);
  }

  // ════════════════════════════════════════════════════════
  // BASE AROMÁTICA: picar finamente cebolla y ajo, luego pochar
  // ════════════════════════════════════════════════════════
  const baseAromatica = [];
  if (cebolla) baseAromatica.push(cebolla.nombre);
  if (ajo) baseAromatica.push("ajo");

  if (baseAromatica.length > 0) {
    addPaso(`**Picar la base aromática.** Colocar ${baseAromatica.join(" y ")} en el vaso limpio y seco. Programar **5 seg / Vel 5**. Retirar la tapa y bajar los restos hacia el fondo con la espátula TM (nunca con otro utensilio, puede dañar las cuchillas). El picado debe quedar fino y homogéneo; si quedaran trozos grandes, repetir 3 seg / Vel 5.`);

    const aceiteNombre = aceite ? aceite.nombre : "aceite de oliva virgen extra";
    addPaso(`**Pochar la base.** Añadir **30 g de ${aceiteNombre}** (aprox. 2 cucharadas soperas). Programar **5 min / 120°C / Vel 1** sin cubilete (así evapora el agua de la cebolla y concentra sabores). Al terminar, la mezcla debe estar translúcida, brillante y con aroma dulce, nunca marrón. Si se dora demasiado rápido, bajar a 100°C los últimos 2 min.`);
  } else if (aceite) {
    addPaso(`**Calentar el aceite.** Verter **20-30 g de ${aceite.nombre}** en el vaso. Programar **2 min / 120°C / Vel 1**. El aceite debe brillar sin humear; si humea, es señal de sobrecalentamiento: abrir la tapa 30 seg antes de continuar.`);
  }

  // ════════════════════════════════════════════════════════
  // CARNE MOLIDA: sellar y sofreír con giro inverso
  // ════════════════════════════════════════════════════════
  if (esMolida) {
    addPaso(`**Sellar la carne molida.** Incorporar **${proteina.nombre}** al vaso desmenuzada con los dedos (evita grumos grandes). Programar **7 min / 120°C / Vel ⟲ Giro inverso / Vel Cuchara**, sin cubilete. El giro inverso preserva la textura; nunca usar velocidad alta con carne cocida, se convierte en puré. Al finalizar, la carne debe haber soltado sus jugos y estar dorada por fuera.`);

    if (vegetales.length > 0) {
      addPaso(`**Integrar las verduras al sofrito.** Añadir **${nombresVegetales}** ya troceadas en cubos pequeños (1 cm máximo). Programar **8 min / 100°C / Vel ⟲ Giro inverso / Vel Cuchara**, sin cubilete. El objetivo es que las verduras suelten agua y se integren con la carne; si queda muy líquido, extender 3 min más sin tapa para reducir.`);
    }
  }

  // ════════════════════════════════════════════════════════
  // VEGETALES SOLOS (sin proteína ni carbohidrato)
  // ════════════════════════════════════════════════════════
  if (vegetales.length > 0 && !proteina && !carb) {
    addPaso(`**Cocinar las verduras.** Agregar **${nombresVegetales}** troceadas en cubos de 2 cm al vaso. Añadir una pizca de sal (libera agua y acelera cocción). Programar **12 min / 100°C / Vel ⟲ Giro inverso / Vel 1**. A mitad de cocción (minuto 6), retirar el cubilete para favorecer reducción y concentración de sabores. Las verduras deben quedar tiernas pero con ligera resistencia al pinchazo ("al dente").`);
  }

  // ════════════════════════════════════════════════════════
  // SALSA (para carne molida o vegetariano)
  // ════════════════════════════════════════════════════════
  if (salsaFinal && (esMolida || !proteina)) {
    const tipoSalsa = salsaFinal.nombre_normalizado;
    let detalleSalsa = "";
    if (tipoSalsa.includes("tomate")) {
      detalleSalsa = " Si la salsa queda muy ácida, añadir una pizca de azúcar o media zanahoria rallada para equilibrar.";
    } else if (tipoSalsa.includes("crema") || tipoSalsa.includes("leche_coco")) {
      detalleSalsa = " Importante no superar los 90°C con lácteos/coco para evitar que se corten.";
    }
    const tempSalsa = (tipoSalsa.includes("crema") || tipoSalsa.includes("leche_coco")) ? "90°C" : "100°C";
    addPaso(`**Construir la salsa.** Incorporar **${salsaFinal.nombre}**. Programar **8 min / ${tempSalsa} / Vel ⟲ Giro inverso / Vel 1**, sin cubilete (permite reducción).${detalleSalsa} La salsa está lista cuando napa el dorso de la espátula y se ve brillante.`);
  }

  // ════════════════════════════════════════════════════════
  // LEGUMBRES (cocción controlada en el vaso)
  // ════════════════════════════════════════════════════════
  if (legumbre) {
    const liqNombre = liquido ? liquido.nombre : "agua filtrada";
    const esLenteja = legumbre.nombre_normalizado.includes("lenteja");
    const tiempoLeg = esLenteja ? "22" : "28";
    const nota = esLenteja
      ? " No requieren remojo previo. Revisar que no queden piedras pequeñas antes de añadir."
      : " Si son secas, remojar 12 h antes en agua fría con 1 cucharadita de bicarbonato, luego enjuagar. Si son de frasco, escurrir y enjuagar bajo agua fría.";
    addPaso(`**Cocinar las legumbres.** Añadir **${legumbre.nombre}** escurridas, ${liqNombre} (cubrir 2 cm por encima, aproximadamente **500-600 ml**), 1 hoja de laurel y **NO añadir sal todavía** (la sal endurece la piel durante la cocción). Programar **${tiempoLeg} min / 100°C / Vel ⟲ Giro inverso / Vel Cuchara**.${nota} A mitad de cocción comprobar nivel de líquido: si se seca, añadir agua caliente a través del bocal.`);
    addPaso(`**Rectificar las legumbres.** Al terminar el tiempo, probar una legumbre: debe estar tierna sin deshacerse. Si aún resisten, programar **5 min adicionales / 100°C / Vel ⟲ / Vel Cuchara**. Ahora sí salar al gusto y retirar la hoja de laurel.`);
  }

  // ════════════════════════════════════════════════════════
  // COCCIÓN SIMULTÁNEA CON VAROMA (proteína entera)
  // ════════════════════════════════════════════════════════
  if (proteina && !esMolida) {
    const tiempoVaroma = esDelicado ? "15" : (esPollo ? "25" : "28");

    // Base líquida en el vaso
    if (carb) {
      const esArroz = carb.nombre_normalizado.includes("arroz");
      const esQuinoa = carb.nombre_normalizado.includes("quinoa");
      const esPasta = carb.nombre_normalizado.includes("pasta") || carb.nombre_normalizado.includes("fideo") || carb.nombre_normalizado.includes("espague");

      if (esArroz) {
        addPaso(`**Preparar el arroz como base de cocción.** Lavar **${carb.nombre}** bajo agua fría hasta que el agua salga clara (retira almidón superficial y evita que se pegue). Escurrir bien. Colocar en el cestillo del vaso junto a **el doble de volumen de agua** (o mejor aún, caldo caliente), una pizca de sal gruesa y **10 g de aceite de oliva**. El cestillo DEBE encajar bien en el vaso, con el agua cubriendo apenas el arroz dentro.`);
      } else if (esQuinoa) {
        addPaso(`**Preparar la quinoa como base.** Enjuagar **${carb.nombre}** bajo agua fría frotándola con los dedos durante 1 min (retira la saponina amarga de la superficie). Escurrir. Colocar en el cestillo con **el doble de volumen de agua** y una pizca de sal.`);
      } else if (esPasta) {
        addPaso(`**Preparar agua para la pasta.** Verter **1000 ml de agua hirviendo** (se adelanta en hervidor), **10 g de sal gruesa** (la pasta debe cocerse en agua con sabor a mar) y **5 g de aceite de oliva** en el vaso. Insertar mariposa NO: la pasta se coloca directamente y el movimiento del líquido hace el resto.`);
      } else {
        addPaso(`**Preparar la base de cocción.** Colocar ${carb.nombre} en el cestillo con agua según indicaciones del paquete y una pizca de sal.`);
      }
    } else if (liquido) {
      addPaso(`**Preparar el líquido aromático.** Verter **${liquido.nombre}** en el vaso hasta alcanzar **mínimo 500 ml** (imprescindible para generar vapor suficiente). Añadir, si se desea, media cebolla en cuartos, 2 ramas de tomillo y 5 granos de pimienta para aromatizar el vapor que cocinará la proteína.`);
    } else {
      addPaso(`**Preparar el agua de cocción.** Verter **700 ml de agua** en el vaso con **5 g de sal gruesa**. Opcional pero recomendado: añadir el agua de remojo de setas secas, una rama de apio y laurel para aromatizar el vapor.`);
    }

    // Preparación de la proteína
    if (esDelicado) {
      if (proteina.nombre_normalizado.includes("camar")) {
        addPaso(`**Sazonar los camarones.** Colocar **${proteina.nombre}** ya pelados y desvenados en un cuenco. Sazonar con sal fina, pimienta blanca, 1 diente de ajo rallado y ralladura de medio limón. Mezclar con suavidad y dejar marinar 10 minutos. Distribuir sobre la bandeja del Varoma forrada con papel de hornear perforado (evita que se peguen y permite paso del vapor).`);
      } else {
        addPaso(`**Sazonar el pescado.** Secar **${proteina.nombre}** con papel absorbente (clave para buena textura). Salpimentar por ambos lados, rociar con **unas gotas de aceite de oliva** y **zumo de medio limón**. Colocar sobre la bandeja del Varoma forrada con papel de hornear ligeramente aceitado o con una hoja de puerro/acelga debajo (evita que se rompa al retirar). Añadir encima 2 rodajas finas de limón y una rama de eneldo fresco si se tiene.`);
      }
    } else if (esPollo) {
      addPaso(`**Sazonar el pollo.** Trocear **${proteina.nombre}** en piezas de ~150 g. Salpimentar generosamente por todos los lados, añadir 1 cucharadita de pimentón dulce, media cucharadita de ajo en polvo y el zumo de medio limón. Masajear 30 seg y dejar marinar mientras se prepara lo demás (mínimo 10 min, ideal 30 min). Colocar separados en la bandeja del Varoma.`);
    } else if (esRes) {
      addPaso(`**Sazonar la carne.** Cortar **${proteina.nombre}** en trozos de ~150 g contra la fibra. Salpimentar con generosidad, frotar con 1 cucharadita de pimentón ahumado y 2 dientes de ajo rallado. Dejar atemperar 15 min fuera del frío (carne fría = cocción desigual). Colocar en la bandeja del Varoma sin superponer las piezas.`);
    }

    // Distribución de vegetales en Varoma
    if (vegetales.length > 0) {
      addPaso(`**Distribuir las verduras en el Varoma.** Colocar **${nombresVegetales}** ya troceadas en el recipiente inferior del Varoma (el más grande), dejando espacios entre piezas para que circule el vapor. Las más densas (zanahoria, papa, coliflor) abajo; las más delicadas (espárragos, brócoli, espinaca) arriba junto a la proteína. Salpimentar ligeramente.`);
    }

    // Cocción al vapor
    const notaTiempo = esDelicado
      ? "El pescado pasa de perfecto a seco en 2 minutos: cronometrar con rigor."
      : (esPollo ? "Nunca reducir este tiempo con pollo: debe alcanzar 74°C en el centro por seguridad alimentaria." : "La carne queda en término medio; ajustar ±3 min según grosor de los trozos.");
    addPaso(`**Cocción simultánea al vapor.** Encajar el Varoma sobre el vaso asegurándose de que queda bien sellado (sin huecos laterales). Programar **${tiempoVaroma} min / Varoma / Vel ⟲ Giro inverso / Vel 1** (el giro inverso protege lo que esté en el vaso, como arroz o pasta). ${notaTiempo} Durante la cocción, revisar por el visor que salga vapor constante; si no, hay poco líquido en el vaso.`);

    // Verificación crítica
    if (esDelicado) {
      if (proteina.nombre_normalizado.includes("camar")) {
        addPaso(`**Verificar punto del marisco.** Los camarones deben estar rosados, firmes y formando una "C" cerrada (si forman "O" están pasados). Si aún traslúcidos en el centro, tapar y programar **2 min adicionales / Varoma / Vel 1**. Retirar inmediatamente del Varoma para detener la cocción residual.`);
      } else {
        addPaso(`**Verificar punto del pescado.** Pinchar con un tenedor en la parte más gruesa: debe desprenderse en lascas fácilmente y estar opaco en el centro. Si aún traslúcido, tapar y programar **3 min adicionales / Varoma / Vel 1**. Retirar del Varoma inmediatamente.`);
      }
    } else if (esPollo) {
      addPaso(`**Verificar cocción del pollo (seguridad alimentaria).** Insertar termómetro en la parte más gruesa: debe marcar **≥74°C**. Si no llega, programar **5 min adicionales / Varoma / Vel 1**. Sin termómetro: cortar la pieza más gruesa, el jugo debe salir transparente (nunca rosado) y la carne blanca opaca sin zonas gelatinosas.`);
    } else {
      addPaso(`**Verificar punto de la carne.** Medir con termómetro: **63°C para término medio, 68°C para tres cuartos, 71°C para bien cocida**. Si falta, programar **4-6 min adicionales / Varoma / Vel 1**. Retirar y dejar reposar 3 min tapada con papel aluminio antes de cortar (redistribuye jugos).`);
    }
  } else if (carb && !esMolida) {
    // Solo carbohidrato sin proteína
    const esArroz = carb.nombre_normalizado.includes("arroz");
    const esQuinoa = carb.nombre_normalizado.includes("quinoa");
    if (esArroz) {
      addPaso(`**Cocinar el arroz.** Lavar **${carb.nombre}** bajo agua fría hasta que salga clara. Escurrir bien. Verter **el doble de volumen de agua** con sal y un chorrito de aceite en el vaso. Colocar el arroz en el cestillo dentro del vaso. Programar **16 min / 100°C / Vel 4**. Al terminar, dejar reposar 5 min con la tapa cerrada sin programar (termina de absorber humedad).`);
    } else if (esQuinoa) {
      addPaso(`**Cocinar la quinoa.** Enjuagar **${carb.nombre}** durante 1 min bajo agua fría. Colocar en el vaso con el doble de volumen de agua y sal. Programar **15 min / Varoma / Vel ⟲ Giro inverso / Vel 1**. Está lista cuando se ve el "anillo" del germen desprendido; si no, 2 min más.`);
    } else {
      addPaso(`**Cocinar el carbohidrato.** Lavar ${carb.nombre} y colocarlo en el vaso con agua según paquete, sal y un chorrito de aceite. Programar **15 min / 100°C / Vel ⟲ Giro inverso / Vel 1**.`);
    }
    if (vegetales.length > 0) {
      addPaso(`**Cocer las verduras al vapor simultáneamente.** Colocar **${nombresVegetales}** troceadas en la bandeja del Varoma, separadas. Encajar sobre el vaso. Programar **12 min / Varoma / Vel ⟲ Giro inverso / Vel 1**. Las verduras deben quedar "al dente": tiernas pero con resistencia al pinchazo.`);
    }
  }

  // ════════════════════════════════════════════════════════
  // SAZÓN FINAL (integrar especias)
  // ════════════════════════════════════════════════════════
  if (nombresEspecias && especias.length > 0 && pasos.length > 0) {
    addPaso(`**Afinar la sazón.** Retirar el Varoma (si se usó) y reservar su contenido tapado. Añadir al vaso **${nombresEspecias}** al gusto (empezar con cantidades conservadoras: se puede añadir más, no quitar). Programar **30 seg / Vel 2 / Giro inverso**. Probar y rectificar: si falta sabor, una pizca de sal; si está plano, unas gotas de limón o vinagre levantan el perfil.`);
  }

  // ════════════════════════════════════════════════════════
  // SALSA FINAL (si no se añadió antes y hay proteína entera)
  // ════════════════════════════════════════════════════════
  if (salsaFinal && !esMolida && proteina) {
    const tipoSalsa = salsaFinal.nombre_normalizado;
    const tempSalsa = (tipoSalsa.includes("crema") || tipoSalsa.includes("leche_coco")) ? "85°C" : "95°C";
    addPaso(`**Preparar la salsa de acompañamiento.** Usando los jugos de cocción del vaso (son oro puro, no descartarlos), incorporar **${salsaFinal.nombre}**. Programar **6 min / ${tempSalsa} / Vel ⟲ Giro inverso / Vel 2**, sin cubilete para que reduzca. La salsa debe napar la espátula: al pasar el dedo por el dorso, debe dejar un camino limpio que no se cierre inmediatamente.`);
  }

  // ════════════════════════════════════════════════════════
  // QUESO (si aplica)
  // ════════════════════════════════════════════════════════
  if (queso) {
    addPaso(`**Incorporar el queso.** Bajar la temperatura al mínimo antes de añadir **${queso.nombre}** rallado o en cubos pequeños. Programar **1 min / 70°C / Vel ⟲ Giro inverso / Vel 2**. El queso nunca debe hervir directamente, se corta. Si se busca costra gratinada, reservar el queso y espolvorear sobre el plato ya emplatado, pasándolo 2 min bajo grill del horno.`);
  }

  // ════════════════════════════════════════════════════════
  // REPOSO Y HIERBAS FRESCAS
  // ════════════════════════════════════════════════════════
  if (proteina && !esMolida) {
    addPaso(`**Reposo de la proteína.** Retirar la proteína del Varoma y dejarla reposar 3-5 minutos tapada con papel aluminio. Este paso redistribuye los jugos internamente: si se corta inmediatamente, los jugos se pierden en la tabla y la carne/pescado queda seca.`);
  }

  if (nombresHierbas && hierbas.length > 0) {
    addPaso(`**Terminar con hierbas frescas.** Picar **${nombresHierbas}** justo antes de servir (nunca antes, oxidan y pierden aroma). Reservar en un cuenco pequeño para añadir por encima al emplatar. El contraste de hierba fresca sobre preparación caliente libera aceites esenciales y aporta color.`);
  }

  // ════════════════════════════════════════════════════════
  // EMPLATADO FINAL
  // ════════════════════════════════════════════════════════
  let emplatado = "**Emplatar como un profesional.** ";
  if (carb && proteina) {
    emplatado += `Usar platos previamente entibiados (pasarlos 30 seg por el microondas o bajo agua caliente y secar). Formar una base de ${carb.nombre} en el centro con ayuda de un aro o cuchara. Colocar encima ${proteina.nombre} cortada en bisel (30°) para exponer el interior. Disponer ${vegetales.length > 0 ? nombresVegetales : "las verduras"} alrededor. ${salsaFinal ? `Salsear con un hilo fino por encima y dejar un pequeño charco lateral.` : ""} ${nombresHierbas ? `Espolvorear ${nombresHierbas} picadas por encima.` : ""} Un toque final de aceite de oliva crudo y pimienta recién molida.`;
  } else if (proteina) {
    emplatado += `Platos entibiados. Colocar ${proteina.nombre} en el centro. ${vegetales.length > 0 ? `Disponer ${nombresVegetales} alrededor en abanico.` : ""} ${salsaFinal ? `Napar con salsa sin ahogar la proteína.` : ""} ${nombresHierbas ? `Rematar con ${nombresHierbas} frescas.` : ""}`;
  } else if (legumbre) {
    emplatado += `Servir en cuenco hondo entibiado. Añadir un chorro de aceite de oliva virgen extra en crudo al plato (emulsiona con el caldo y eleva el sabor). ${nombresHierbas ? `Coronar con ${nombresHierbas} picadas.` : "Coronar con pimienta recién molida."} Acompañar con pan tostado rozado con ajo.`;
  } else {
    emplatado += `Servir inmediatamente en platos entibiados. ${nombresHierbas ? `Espolvorear ${nombresHierbas} frescas por encima.` : ""} Un hilo de aceite de oliva crudo y pimienta recién molida al final.`;
  }
  emplatado += ` Servir en los 3 minutos siguientes: todo plato pierde calidad rápidamente sobre la barra.`;
  addPaso(emplatado);

  // ════════════════════════════════════════════════════════
  // LIMPIEZA EXPRESS DEL TM6 (bonus profesional)
  // ════════════════════════════════════════════════════════
  addPaso(`**Autolimpieza del vaso.** Llenar el vaso con **1 L de agua tibia y 2 gotas de detergente**. Programar **3 min / 70°C / Vel 5**. Enjuagar. Así evitas que los restos se endurezcan mientras comes y la limpieza final toma 30 segundos.`);

  return pasos;
}

// ═══════════════════════════════════════════════
// PRIORIZACIÓN GEOGRÁFICA
// Americana > Europea > Otras > Medio Oriente
// ═══════════════════════════════════════════════
const _AREAS_AMERICANAS = ["american", "canadian", "mexican"];
const _AREAS_EUROPEAS = ["british", "french", "italian", "spanish", "irish", "dutch", "greek", "croatian", "polish", "portuguese", "russian", "norwegian"];
const _AREAS_MEDIO_ORIENTE = ["moroccan", "egyptian", "tunisian", "turkish", "lebanese", "palestinian"];

function _puntuacionArea(area) {
  if (!area) return 50;
  const a = area.toLowerCase();
  if (_AREAS_AMERICANAS.includes(a)) return 100;
  if (_AREAS_EUROPEAS.includes(a)) return 80;
  if (_AREAS_MEDIO_ORIENTE.includes(a)) return 10;
  return 50; // Otras (Chinese, Japanese, Thai, Indian, etc.)
}

// ═══════════════════════════════════════════════
// API PÚBLICA
// ═══════════════════════════════════════════════

// Categorías priorizadas por tipo de comida
function _obtenerCategoriasMealDB(tipo) {
  // NOTA: snacks NO deben buscarse online - se usan solo recetas locales
  // (la protección está en nutritionEngine.js)
  switch (tipo) {
    case "desayuno": return []; // No buscar online para desayunos (MealDB devuelve platos pesados anglosajones)
    case "snack_am": return []; // No buscar online para snacks
    case "almuerzo": return ["Chicken", "Beef", "Pork", "Vegetarian", "Pasta"];
    case "snack_pm": return []; // No buscar online para snacks
    case "cena": return ["Seafood", "Pasta", "Chicken", "Pork", "Vegetarian"];
    default: return ["Chicken", "Beef", "Pasta"];
  }
}

// Áreas priorizadas para búsqueda por región
const _AREAS_BUSQUEDA_PRIORIDAD = ["American", "Canadian", "British", "French", "Italian", "Spanish", "Irish"];

async function buscarRecetasOnline(tipoComidaNeeded, perfil, cantidad) {
  const cache = _cargarCacheOnline();
  
  const filtradas = filtrarRecetas(cache, perfil)
    .filter(r => r.tipo_comida === tipoComidaNeeded);
  
  if (filtradas.length >= cantidad) {
    // Ordenar por prioridad geográfica
    filtradas.sort((a, b) => _puntuacionArea(b._area) - _puntuacionArea(a._area));
    return filtradas;
  }
  
  const categoriasParaBuscar = _obtenerCategoriasMealDB(tipoComidaNeeded);
  const nuevasRecetas = [];
  
  // Estrategia 1: Buscar por categoría
  for (const cat of categoriasParaBuscar) {
    try {
      const resp = await fetch(`${MEALDB_BASE}/filter.php?c=${cat}`);
      if (!resp.ok) continue;
      const data = await resp.json();
      if (!data.meals) continue;
      
      const seleccion = data.meals
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(8, data.meals.length));
      
      for (const m of seleccion) {
        try {
          const detResp = await fetch(`${MEALDB_BASE}/lookup.php?i=${m.idMeal}`);
          if (!detResp.ok) continue;
          const detData = await detResp.json();
          if (!detData.meals || !detData.meals[0]) continue;
          
          const receta = _convertirMealDB(detData.meals[0], tipoComidaNeeded);
          
          if (_pasaFiltros(receta, perfil)) {
            nuevasRecetas.push(receta);
          }
        } catch { /* individual meal fetch failed */ }
      }
    } catch { /* category fetch failed */ }
  }
  
  // Estrategia 2: Buscar por áreas priorizadas (americanas/europeas)
  for (const area of _AREAS_BUSQUEDA_PRIORIDAD) {
    if (nuevasRecetas.length >= cantidad * 3) break; // Ya tenemos suficientes
    try {
      const resp = await fetch(`${MEALDB_BASE}/filter.php?a=${area}`);
      if (!resp.ok) continue;
      const data = await resp.json();
      if (!data.meals) continue;
      
      const seleccion = data.meals
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(4, data.meals.length));
      
      for (const m of seleccion) {
        // Evitar duplicados
        if (nuevasRecetas.some(r => r.id === "online_" + m.idMeal)) continue;
        try {
          const detResp = await fetch(`${MEALDB_BASE}/lookup.php?i=${m.idMeal}`);
          if (!detResp.ok) continue;
          const detData = await detResp.json();
          if (!detData.meals || !detData.meals[0]) continue;
          
          const receta = _convertirMealDB(detData.meals[0], tipoComidaNeeded);
          
          if (_pasaFiltros(receta, perfil)) {
            nuevasRecetas.push(receta);
          }
        } catch { /* individual meal fetch failed */ }
      }
    } catch { /* area fetch failed */ }
  }
  
  // Estrategia 3: Recetas aleatorias como relleno
  for (let i = 0; i < 3; i++) {
    try {
      const resp = await fetch(`${MEALDB_BASE}/random.php`);
      if (!resp.ok) continue;
      const data = await resp.json();
      if (!data.meals || !data.meals[0]) continue;
      const receta = _convertirMealDB(data.meals[0], tipoComidaNeeded);
      if (_pasaFiltros(receta, perfil)) {
        nuevasRecetas.push(receta);
      }
    } catch { /* random failed */ }
  }
  
  // Ordenar nuevas recetas por prioridad geográfica
  nuevasRecetas.sort((a, b) => _puntuacionArea(b._area) - _puntuacionArea(a._area));
  
  // Cachear
  const idsExistentes = new Set(cache.map(r => r.id));
  const sinDuplicar = nuevasRecetas.filter(r => !idsExistentes.has(r.id));
  if (sinDuplicar.length > 0) {
    const nuevoCache = [...cache, ...sinDuplicar].slice(-200);
    _guardarCacheOnline(nuevoCache);
  }
  
  return [...filtradas, ...sinDuplicar];
}

async function buscarUnaRecetaOnline(tipoComida, perfil, idsExcluir) {
  const cache = _cargarCacheOnline();
  const excluir = new Set(idsExcluir || []);
  
  const enCache = filtrarRecetas(cache, perfil)
    .filter(r => r.tipo_comida === tipoComida && !excluir.has(r.id));
  
  if (enCache.length > 0) {
    // Priorizar americanas/europeas
    enCache.sort((a, b) => _puntuacionArea(b._area) - _puntuacionArea(a._area));
    // Tomar de las mejores con algo de variedad
    const mejores = enCache.slice(0, Math.min(5, enCache.length));
    return mejores[Math.floor(Math.random() * mejores.length)];
  }
  
  try {
    const recetas = await buscarRecetasOnline(tipoComida, perfil, 5);
    const candidatas = recetas.filter(r => !excluir.has(r.id));
    if (candidatas.length > 0) {
      return candidatas[0]; // Ya están ordenadas por prioridad
    }
    if (recetas.length > 0) {
      return recetas[0];
    }
  } catch (e) {
    console.warn("Error buscando receta online:", e);
  }
  
  return null;
}

function _pasaFiltros(receta, perfil) {
  if (perfil.sinGluten && !receta.es_sin_gluten) return false;
  if (perfil.sinLactosa && !receta.es_sin_lactosa) return false;
  if (perfil.vegetariano && !receta.es_vegetariana) return false;
  if (perfil.ingredientesExcluidos && perfil.ingredientesExcluidos.length > 0) {
    const excluidos = perfil.ingredientesExcluidos.map(e => e.toLowerCase().trim());
    const tiene = receta.ingredientes.some(ing =>
      excluidos.some(exc => ing.nombre.toLowerCase().includes(exc))
    );
    if (tiene) return false;
  }
  return true;
}

function obtenerTodasLasRecetas() {
  const locales = typeof RECETAS_DB !== 'undefined' ? [...RECETAS_DB] : [];
  const online = _cargarCacheOnline();
  return [...locales, ...online];
}

// ─── Exponer generador Thermomix profesional para uso en recetas locales ───
// Permite regenerar `instrucciones_thermomix` de cualquier receta con el mismo
// motor profesional que usan las recetas online.
if (typeof window !== 'undefined') {
  window.generarThermomixProfesional = _generarThermomixDesdeInstrucciones;
}

// ─── Safety net: asegurar instrucciones en español para planes guardados viejos ───
// Detección AGRESIVA: cualquier presencia de inglés = reemplazar todo
const _ENGLISH_WORDS = new Set([
  // Verbos de cocina
  "heat","add","place","cook","stir","mix","pour","bake","fry","cut","chop",
  "slice","boil","preheat","remove","season","serve","cover","combine","spread",
  "sprinkle","layer","make","crack","drain","whisk","fold","knead","simmer",
  "sauté","saute","roast","grill","broil","melt","beat","toss","flip","set",
  "aside","arrange","insert","lower","check","return","brush","leave","put",
  "sieve","transfer","reduce","bring","allow","rest","cool","chill","freeze",
  "warm","keep","turn","repeat","continue","finish","top","stuff","roll",
  "shape","form","wrap","squeeze","press","mash","blend","puree","process",
  "shred","grate","peel","trim","score","discard","rinse","wash","pat",
  "dry","soak","marinate","coat","dredge","dip","deep","shallow",
  // Artículos, preposiciones, conjunciones
  "the","a","an","and","or","but","with","without","until","into","onto",
  "over","under","through","about","around","between","from","for","in","on",
  "at","to","of","by","up","down","off","out","if","when","while","then",
  "after","before","once","each","every","all","both","either","neither",
  // Adjetivos / adverbios de cocina
  "well","golden","brown","crispy","tender","soft","smooth","thick","thin",
  "fluffy","light","creamy","done","ready","hot","cold","warm","lukewarm",
  "large","medium","small","fine","coarse","roughly","finely","gently",
  "slowly","quickly","carefully","evenly","thoroughly","completely",
  "approximately","slightly","just","more","less","enough","extra",
  // Sustantivos de cocina
  "oven","pan","pot","bowl","dish","plate","tin","tray","rack","skewer",
  "foil","paper","parchment","cling","film","towel","cloth","surface",
  "side","batch","piece","half","quarter","third","whole","centre","center",
  "edge","middle","bottom","top","layer","level","back","front",
  "minutes","minute","mins","min","hours","hour","hrs","seconds",
  "temperature","degrees","fan","mark","gas",
  // Ingredientes comunes en inglés
  "chicken","beef","pork","lamb","fish","salmon","tuna","shrimp","prawns",
  "egg","eggs","butter","cream","cheese","milk","flour","sugar","salt",
  "pepper","onion","garlic","tomato","potato","rice","pasta","bread",
  "oil","water","stock","broth","wine","vinegar","sauce","juice",
  "almonds","almond","walnuts","walnut","nuts","seeds","fruit","cherries",
  "cake","dough","batter","mixture","filling","topping","glaze","icing",
  // Otros
  "using","should","would","could","will","need","want","like","look",
  "taste","feel","smell","seem","become","get","let","give","take",
  "it","its","it's","this","that","these","those","they","them","their",
  "you","your","we","our","he","she","his","her","not","no","don't",
  "doesn't","isn't","aren't","won't","can't","also","still","yet","so",
  "very","too","quite","really","now","here","there","where","how","what",
  "which","who","whom","whose","why"
]);

function _contieneIngles(texto) {
  if (!texto) return false;
  const palabras = texto.toLowerCase().replace(/[^a-záéíóúüñ\s]/g, ' ').split(/\s+/).filter(p => p.length > 1);
  if (palabras.length === 0) return false;
  let matchCount = 0;
  for (const p of palabras) {
    if (_ENGLISH_WORDS.has(p)) {
      matchCount++;
      // Si encontramos incluso 2 palabras en inglés, es sospechoso
      if (matchCount >= 2) return true;
    }
  }
  return false;
}

function asegurarInstruccionesEspanol(instrucciones, receta) {
  // Determinar categoría desde tipo_comida de la receta
  function _inferirCategoria(r) {
    if (!r || !r.tipo_comida) return "miscellaneous";
    const tipo = r.tipo_comida;
    if (tipo === "desayuno") return "breakfast";
    if (tipo === "almuerzo") return "chicken"; // generic main meal
    if (tipo === "cena") return "pasta"; // generic dinner
    if (tipo.includes("snack")) return "side";
    return "miscellaneous";
  }
  
  const cat = _inferirCategoria(receta);
  const tipoComida = receta ? receta.tipo_comida : null;
  
  if (!instrucciones || instrucciones.length === 0) {
    // Sin instrucciones — generar desde ingredientes si es posible
    const ings = receta && (receta.ingredientes_escalados || receta.ingredientes);
    if (ings) {
      const nombresIng = ings.map(i => i.nombre || i.nombre_display || "");
      return _generarInstruccionesEspanol(nombresIng, cat, tipoComida, ings);
    }
    return [
      "Preparar todos los ingredientes: lavar, pelar y picar según corresponda.",
      "Calentar aceite en una sartén u olla a fuego medio.",
      "Cocinar los ingredientes en orden, empezando por los aromáticos. Sazonar con sal y pimienta al gusto.",
      "Servir caliente. ¡Buen provecho!"
    ];
  }
  
  // Verificar CADA paso — si CUALQUIERA tiene inglés, regenerar TODO
  const hayIngles = instrucciones.some(paso => _contieneIngles(paso));
  
  if (hayIngles) {
    // Intentar regenerar con contexto completo
    const ings = receta && (receta.ingredientes_escalados || receta.ingredientes);
    if (ings) {
      const nombresIng = ings.map(i => i.nombre || i.nombre_display || "");
      return _generarInstruccionesEspanol(nombresIng, cat, tipoComida, ings);
    }
    // Fallback genérico
    return [
      "Preparar todos los ingredientes: lavar, pelar y picar según corresponda.",
      "Calentar aceite en una sartén u olla a fuego medio.",
      "Cocinar los ingredientes principales, empezando por los aromáticos (cebolla, ajo).",
      "Agregar el resto de ingredientes en orden. Sazonar con sal y pimienta al gusto.",
      "Cocinar a fuego medio por 15-20 minutos o hasta que todo esté bien cocido.",
      "Servir caliente. ¡Buen provecho!"
    ];
  }
  
  return instrucciones;
}

// ─── Safety net: traducir unidades en inglés ───
function traducirUnidad(unidad) {
  if (!unidad) return unidad;
  const mapa = {
    "finely chopped": "picado fino", "roughly chopped": "picado grueso",
    "chopped": "picado", "diced": "en cubitos", "sliced": "rebanado",
    "thinly sliced": "en rodajas finas", "minced": "picado fino",
    "crushed": "triturado", "grated": "rallado", "peeled": "pelado",
    "halved": "mitad", "quartered": "cuarto",
    "whole": "entero", "large": "grande", "medium": "mediano",
    "small": "pequeño", "fresh": "fresco", "dried": "seco",
    "ground": "molido", "to taste": "al gusto", "leaves": "hojas",
    "leaf": "hoja", "sprigs": "ramitas", "sprig": "ramita",
    "strips": "tiras", "cubed": "en cubos", "beaten": "batido",
    "softened": "ablandado", "melted": "derretido",
    "tablespoon": "cda", "tablespoons": "cdas",
    "teaspoon": "cdta", "teaspoons": "cdtas",
    "cup": "taza", "cups": "tazas",
    "clove": "diente", "cloves": "dientes",
    "slice": "rebanada", "slices": "rebanadas",
    "piece": "pieza", "pieces": "piezas",
    "bunch": "manojo", "handful": "puñado", "pinch": "pizca",
    "can": "lata", "tin": "lata", "bottle": "botella", "packet": "paquete",
    "freshly ground": "recién molido", "shredded": "desmenuzado",
    "juiced": "exprimido", "zested": "rallado",
    "to serve": "para servir", "to garnish": "para decorar",
    "for frying": "para freír", "for greasing": "para engrasar"
  };
  const lower = unidad.toLowerCase().trim();
  if (mapa[lower]) return mapa[lower];
  const sorted = Object.entries(mapa).sort((a,b) => b[0].length - a[0].length);
  for (const [en, es] of sorted) {
    if (lower.includes(en)) return lower.replace(en, es);
  }
  return unidad;
}
