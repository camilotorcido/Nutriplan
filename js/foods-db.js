/* ============================================
   NutriPlan - Base de datos de alimentos comunes (v20260426oo)
   Usada por el modal "Comidas Externas" (estilo MyFitnessPal).
   Valores nutricionales por porción estándar indicada.
   ============================================ */
(function() {
  window.FOODS_DB = [

    // ── HUEVOS ──────────────────────────────────────────────────────────────
    { id:'f_huevo',         nombre:'Huevo entero',         nombre_en:'Whole egg',             porcion:'1 unidad (60g)',    kcal:80,  proteinas:6,  carbohidratos:0,  grasas:5  },
    { id:'f_huevo_2',       nombre:'2 huevos enteros',     nombre_en:'2 whole eggs',          porcion:'2 unidades (120g)', kcal:160, proteinas:12, carbohidratos:0,  grasas:11 },
    { id:'f_huevos_rev',    nombre:'Huevos revueltos',     nombre_en:'Scrambled eggs',        porcion:'2 huevos cocidos',  kcal:182, proteinas:13, carbohidratos:1,  grasas:14 },
    { id:'f_huevo_frito',   nombre:'Huevo frito',          nombre_en:'Fried egg',             porcion:'1 unidad',          kcal:90,  proteinas:6,  carbohidratos:0,  grasas:7  },
    { id:'f_claras',        nombre:'Claras de huevo',      nombre_en:'Egg whites',            porcion:'3 claras (90g)',    kcal:50,  proteinas:11, carbohidratos:1,  grasas:0  },

    // ── LÁCTEOS ─────────────────────────────────────────────────────────────
    { id:'f_leche_entera',  nombre:'Leche entera',         nombre_en:'Whole milk',            porcion:'1 taza (240ml)',    kcal:150, proteinas:8,  carbohidratos:12, grasas:8  },
    { id:'f_leche_desc',    nombre:'Leche descremada',     nombre_en:'Skim milk',             porcion:'1 taza (240ml)',    kcal:90,  proteinas:9,  carbohidratos:13, grasas:0  },
    { id:'f_leche_semid',   nombre:'Leche semidescremada', nombre_en:'Semi-skimmed milk',     porcion:'1 taza (240ml)',    kcal:120, proteinas:8,  carbohidratos:12, grasas:5  },
    { id:'f_yogurt_gr',     nombre:'Yogurt griego natural',nombre_en:'Plain Greek yogurt',    porcion:'170g',              kcal:100, proteinas:17, carbohidratos:6,  grasas:0  },
    { id:'f_yogurt_frut',   nombre:'Yogurt con fruta',     nombre_en:'Fruit yogurt',          porcion:'170g',              kcal:150, proteinas:5,  carbohidratos:25, grasas:2  },
    { id:'f_queso_fresco',  nombre:'Queso fresco',         nombre_en:'Fresh white cheese',    porcion:'50g',               kcal:75,  proteinas:6,  carbohidratos:1,  grasas:5  },
    { id:'f_quesillo',      nombre:'Quesillo',             nombre_en:'Cottage-style cheese',  porcion:'50g',               kcal:70,  proteinas:7,  carbohidratos:1,  grasas:4  },
    { id:'f_mantequilla',   nombre:'Mantequilla',          nombre_en:'Butter',                porcion:'10g (1 cda)',        kcal:72,  proteinas:0,  carbohidratos:0,  grasas:8  },
    { id:'f_requesón',      nombre:'Requesón / ricotta',   nombre_en:'Ricotta',               porcion:'100g',              kcal:174, proteinas:11, carbohidratos:3,  grasas:13 },
    { id:'f_crema_agria',   nombre:'Crema agria',          nombre_en:'Sour cream',            porcion:'30g (2 cdas)',       kcal:60,  proteinas:1,  carbohidratos:1,  grasas:6  },

    // ── PROTEÍNAS ANIMALES ───────────────────────────────────────────────────
    { id:'f_pechuga',       nombre:'Pechuga de pollo',     nombre_en:'Chicken breast',        porcion:'100g cocida',       kcal:165, proteinas:31, carbohidratos:0,  grasas:4  },
    { id:'f_muslo',         nombre:'Muslo de pollo',       nombre_en:'Chicken thigh',         porcion:'100g cocido',       kcal:185, proteinas:27, carbohidratos:0,  grasas:8  },
    { id:'f_carne_mol',     nombre:'Carne molida magra',   nombre_en:'Lean ground beef',      porcion:'100g cocida',       kcal:200, proteinas:26, carbohidratos:0,  grasas:10 },
    { id:'f_filete',        nombre:'Filete de res',        nombre_en:'Beef tenderloin',       porcion:'100g',              kcal:250, proteinas:26, carbohidratos:0,  grasas:15 },
    { id:'f_salmon',        nombre:'Salmón',               nombre_en:'Salmon',                porcion:'100g',              kcal:206, proteinas:22, carbohidratos:0,  grasas:13 },
    { id:'f_atun',          nombre:'Atún en agua',         nombre_en:'Canned tuna',           porcion:'1 lata (150g)',     kcal:160, proteinas:36, carbohidratos:0,  grasas:1  },
    { id:'f_camarones',     nombre:'Camarones',            nombre_en:'Shrimp',                porcion:'100g',              kcal:99,  proteinas:24, carbohidratos:0,  grasas:1  },
    { id:'f_cerdo',         nombre:'Lomo de cerdo',        nombre_en:'Pork loin',             porcion:'100g',              kcal:215, proteinas:24, carbohidratos:0,  grasas:13 },
    { id:'f_pavo',          nombre:'Pechuga de pavo',      nombre_en:'Turkey breast',         porcion:'100g',              kcal:135, proteinas:29, carbohidratos:0,  grasas:2  },
    { id:'f_jamon',         nombre:'Jamón cocido',         nombre_en:'Cooked ham',            porcion:'50g (2 láminas)',   kcal:75,  proteinas:10, carbohidratos:1,  grasas:3  },

    // ── PROTEÍNAS VEGETALES ──────────────────────────────────────────────────
    { id:'f_tofu',          nombre:'Tofu',                 nombre_en:'Tofu',                  porcion:'100g',              kcal:80,  proteinas:9,  carbohidratos:2,  grasas:5  },
    { id:'f_lentejas',      nombre:'Lentejas cocidas',     nombre_en:'Cooked lentils',        porcion:'100g',              kcal:116, proteinas:9,  carbohidratos:20, grasas:0  },
    { id:'f_porotos',       nombre:'Porotos cocidos',      nombre_en:'Cooked beans',          porcion:'100g',              kcal:127, proteinas:9,  carbohidratos:23, grasas:1  },
    { id:'f_garbanzos',     nombre:'Garbanzos cocidos',    nombre_en:'Cooked chickpeas',      porcion:'100g',              kcal:164, proteinas:9,  carbohidratos:27, grasas:3  },
    { id:'f_edamame',       nombre:'Edamame',              nombre_en:'Edamame',               porcion:'100g',              kcal:121, proteinas:11, carbohidratos:9,  grasas:5  },
    { id:'f_proteina',      nombre:'Batido de proteína',   nombre_en:'Protein shake',         porcion:'1 scoop (30g)',     kcal:120, proteinas:25, carbohidratos:5,  grasas:1  },

    // ── CARBOHIDRATOS ────────────────────────────────────────────────────────
    { id:'f_arroz_bl',      nombre:'Arroz blanco cocido',  nombre_en:'Cooked white rice',     porcion:'150g (3/4 taza)',   kcal:195, proteinas:4,  carbohidratos:43, grasas:0  },
    { id:'f_arroz_int',     nombre:'Arroz integral cocido',nombre_en:'Cooked brown rice',     porcion:'150g',              kcal:165, proteinas:4,  carbohidratos:34, grasas:1  },
    { id:'f_pasta',         nombre:'Pasta cocida',         nombre_en:'Cooked pasta',          porcion:'150g',              kcal:220, proteinas:8,  carbohidratos:43, grasas:1  },
    { id:'f_papa',          nombre:'Papa cocida',          nombre_en:'Boiled potato',         porcion:'1 mediana (150g)',  kcal:130, proteinas:3,  carbohidratos:30, grasas:0  },
    { id:'f_papa_fritas',   nombre:'Papas fritas',         nombre_en:'French fries',          porcion:'100g',              kcal:312, proteinas:3,  carbohidratos:41, grasas:15 },
    { id:'f_camote',        nombre:'Camote cocido',        nombre_en:'Sweet potato',          porcion:'150g',              kcal:130, proteinas:2,  carbohidratos:30, grasas:0  },
    { id:'f_quinoa',        nombre:'Quinoa cocida',        nombre_en:'Cooked quinoa',         porcion:'150g',              kcal:165, proteinas:6,  carbohidratos:30, grasas:3  },
    { id:'f_avena',         nombre:'Avena',                nombre_en:'Oats',                  porcion:'50g (cruda)',        kcal:190, proteinas:7,  carbohidratos:32, grasas:3  },
    { id:'f_pan_blanco',    nombre:'Pan blanco',           nombre_en:'White bread',           porcion:'1 rebanada (25g)',  kcal:67,  proteinas:2,  carbohidratos:13, grasas:1  },
    { id:'f_pan_int',       nombre:'Pan integral',         nombre_en:'Whole wheat bread',     porcion:'1 rebanada (30g)', kcal:80,  proteinas:3,  carbohidratos:14, grasas:1  },
    { id:'f_marraqueta',    nombre:'Marraqueta',           nombre_en:'Marraqueta roll',       porcion:'1 unidad (80g)',    kcal:210, proteinas:7,  carbohidratos:42, grasas:2  },
    { id:'f_hallulla',      nombre:'Hallulla',             nombre_en:'Hallulla roll',         porcion:'1 unidad (60g)',    kcal:160, proteinas:5,  carbohidratos:32, grasas:2  },
    { id:'f_tortilla',      nombre:'Tortilla de maíz',     nombre_en:'Corn tortilla',         porcion:'1 unidad (30g)',    kcal:63,  proteinas:2,  carbohidratos:13, grasas:1  },

    // ── VERDURAS ─────────────────────────────────────────────────────────────
    { id:'f_tomate',        nombre:'Tomate',               nombre_en:'Tomato',                porcion:'1 mediano (120g)',  kcal:22,  proteinas:1,  carbohidratos:5,  grasas:0  },
    { id:'f_lechuga',       nombre:'Lechuga',              nombre_en:'Lettuce',               porcion:'50g',               kcal:8,   proteinas:1,  carbohidratos:1,  grasas:0  },
    { id:'f_brocoli',       nombre:'Brócoli',              nombre_en:'Broccoli',              porcion:'100g',              kcal:34,  proteinas:3,  carbohidratos:7,  grasas:0  },
    { id:'f_espinaca',      nombre:'Espinaca',             nombre_en:'Spinach',               porcion:'100g',              kcal:23,  proteinas:3,  carbohidratos:4,  grasas:0  },
    { id:'f_zanahoria',     nombre:'Zanahoria',            nombre_en:'Carrot',                porcion:'100g',              kcal:41,  proteinas:1,  carbohidratos:10, grasas:0  },
    { id:'f_pepino',        nombre:'Pepino',               nombre_en:'Cucumber',              porcion:'100g',              kcal:16,  proteinas:1,  carbohidratos:4,  grasas:0  },
    { id:'f_pimentón',      nombre:'Pimentón',             nombre_en:'Bell pepper',           porcion:'100g',              kcal:31,  proteinas:1,  carbohidratos:6,  grasas:0  },
    { id:'f_cebolla',       nombre:'Cebolla',              nombre_en:'Onion',                 porcion:'100g',              kcal:40,  proteinas:1,  carbohidratos:9,  grasas:0  },
    { id:'f_ajo',           nombre:'Ajo',                  nombre_en:'Garlic',                porcion:'10g (2 dientes)',   kcal:15,  proteinas:1,  carbohidratos:3,  grasas:0  },
    { id:'f_champinones',   nombre:'Champiñones',          nombre_en:'Mushrooms',             porcion:'100g',              kcal:22,  proteinas:3,  carbohidratos:3,  grasas:0  },
    { id:'f_zucchini',      nombre:'Zucchini',             nombre_en:'Zucchini',              porcion:'100g',              kcal:17,  proteinas:1,  carbohidratos:3,  grasas:0  },
    { id:'f_palta',         nombre:'Palta',                nombre_en:'Avocado',               porcion:'100g',              kcal:160, proteinas:2,  carbohidratos:9,  grasas:15 },
    { id:'f_choclo',        nombre:'Choclo',               nombre_en:'Corn',                  porcion:'1 mazorca (100g)', kcal:86,  proteinas:3,  carbohidratos:19, grasas:1  },
    { id:'f_betarraga',     nombre:'Betarraga',            nombre_en:'Beet',                  porcion:'100g',              kcal:43,  proteinas:2,  carbohidratos:10, grasas:0  },
    { id:'f_kale',          nombre:'Kale',                 nombre_en:'Kale',                  porcion:'50g',               kcal:33,  proteinas:2,  carbohidratos:7,  grasas:0  },
    { id:'f_apio',          nombre:'Apio',                 nombre_en:'Celery',                porcion:'100g',              kcal:16,  proteinas:1,  carbohidratos:3,  grasas:0  },

    // ── FRUTAS ───────────────────────────────────────────────────────────────
    { id:'f_manzana',       nombre:'Manzana',              nombre_en:'Apple',                 porcion:'1 mediana (180g)', kcal:95,  proteinas:0,  carbohidratos:25, grasas:0  },
    { id:'f_platano',       nombre:'Plátano',              nombre_en:'Banana',                porcion:'1 mediano (120g)', kcal:105, proteinas:1,  carbohidratos:27, grasas:0  },
    { id:'f_naranja',       nombre:'Naranja',              nombre_en:'Orange',                porcion:'1 mediana (180g)', kcal:86,  proteinas:2,  carbohidratos:22, grasas:0  },
    { id:'f_frutilla',      nombre:'Frutillas',            nombre_en:'Strawberries',          porcion:'100g',              kcal:32,  proteinas:1,  carbohidratos:8,  grasas:0  },
    { id:'f_uvas',          nombre:'Uvas',                 nombre_en:'Grapes',                porcion:'100g',              kcal:69,  proteinas:1,  carbohidratos:18, grasas:0  },
    { id:'f_mango',         nombre:'Mango',                nombre_en:'Mango',                 porcion:'100g',              kcal:60,  proteinas:1,  carbohidratos:15, grasas:0  },
    { id:'f_sandia',        nombre:'Sandía',               nombre_en:'Watermelon',            porcion:'200g',              kcal:60,  proteinas:1,  carbohidratos:15, grasas:0  },
    { id:'f_arandanos',     nombre:'Arándanos',            nombre_en:'Blueberries',           porcion:'100g',              kcal:57,  proteinas:1,  carbohidratos:14, grasas:0  },
    { id:'f_kiwi',          nombre:'Kiwi',                 nombre_en:'Kiwi',                  porcion:'1 unidad (80g)',    kcal:50,  proteinas:1,  carbohidratos:12, grasas:0  },
    { id:'f_durazno',       nombre:'Durazno',              nombre_en:'Peach',                 porcion:'1 mediano (150g)', kcal:58,  proteinas:1,  carbohidratos:14, grasas:0  },
    { id:'f_pera',          nombre:'Pera',                 nombre_en:'Pear',                  porcion:'1 mediana (178g)', kcal:101, proteinas:1,  carbohidratos:27, grasas:0  },
    { id:'f_melon',         nombre:'Melón',                nombre_en:'Melon',                 porcion:'200g',              kcal:68,  proteinas:2,  carbohidratos:16, grasas:0  },

    // ── GRASAS SALUDABLES ────────────────────────────────────────────────────
    { id:'f_almendras',     nombre:'Almendras',            nombre_en:'Almonds',               porcion:'30g (un puñado)',  kcal:175, proteinas:6,  carbohidratos:6,  grasas:15 },
    { id:'f_nueces',        nombre:'Nueces',               nombre_en:'Walnuts',               porcion:'30g',               kcal:196, proteinas:5,  carbohidratos:4,  grasas:19 },
    { id:'f_mani',          nombre:'Maní',                 nombre_en:'Peanuts',               porcion:'30g',               kcal:170, proteinas:7,  carbohidratos:6,  grasas:15 },
    { id:'f_mantmani',      nombre:'Mantequilla de maní',  nombre_en:'Peanut butter',         porcion:'30g (2 cdas)',      kcal:190, proteinas:8,  carbohidratos:7,  grasas:16 },
    { id:'f_aceite_oliva',  nombre:'Aceite de oliva',      nombre_en:'Olive oil',             porcion:'10ml (1 cda)',      kcal:88,  proteinas:0,  carbohidratos:0,  grasas:10 },
    { id:'f_chia',          nombre:'Semillas de chía',     nombre_en:'Chia seeds',            porcion:'15g (1 cda)',       kcal:73,  proteinas:2,  carbohidratos:6,  grasas:5  },
    { id:'f_linaza',        nombre:'Linaza molida',        nombre_en:'Ground flaxseed',       porcion:'15g (1 cda)',       kcal:75,  proteinas:3,  carbohidratos:4,  grasas:6  },

    // ── COMIDAS PREPARADAS (contexto chileno) ────────────────────────────────
    { id:'f_empanada',      nombre:'Empanada de pino',     nombre_en:'Beef empanada',         porcion:'1 unidad (150g)',   kcal:380, proteinas:15, carbohidratos:42, grasas:16 },
    { id:'f_completo',      nombre:'Completo italiano',    nombre_en:'Chilean hot dog',       porcion:'1 unidad',          kcal:480, proteinas:18, carbohidratos:55, grasas:22 },
    { id:'f_cazuela',       nombre:'Cazuela',              nombre_en:'Chilean cazuela stew',  porcion:'1 porción (400g)', kcal:320, proteinas:25, carbohidratos:28, grasas:8  },
    { id:'f_sopaipilla',    nombre:'Sopaipilla',           nombre_en:'Fried sopaipilla',      porcion:'1 unidad (50g)',    kcal:165, proteinas:3,  carbohidratos:22, grasas:8  },
    { id:'f_churrasco',     nombre:'Churrasco italiano',   nombre_en:'Churrasco sandwich',    porcion:'1 unidad',          kcal:520, proteinas:35, carbohidratos:42, grasas:22 },
    { id:'f_pizza',         nombre:'Pizza',                nombre_en:'Pizza',                 porcion:'2 porciones (200g)',kcal:500, proteinas:20, carbohidratos:60, grasas:20 },
    { id:'f_hamburguesa',   nombre:'Hamburguesa',          nombre_en:'Burger',                porcion:'1 unidad',          kcal:560, proteinas:28, carbohidratos:48, grasas:28 },
    { id:'f_sushi',         nombre:'Sushi (roll)',         nombre_en:'Sushi roll',            porcion:'8 piezas',          kcal:300, proteinas:12, carbohidratos:52, grasas:6  },
    { id:'f_hummus',        nombre:'Hummus',               nombre_en:'Hummus',                porcion:'50g (3 cdas)',      kcal:118, proteinas:4,  carbohidratos:10, grasas:7  },
    { id:'f_ensalada_ces',  nombre:'Ensalada César',       nombre_en:'Caesar salad',          porcion:'1 porción (200g)', kcal:280, proteinas:8,  carbohidratos:12, grasas:22 },
    { id:'f_tacos',         nombre:'Tacos (2 unidades)',   nombre_en:'Tacos',                 porcion:'2 unidades',        kcal:360, proteinas:18, carbohidratos:38, grasas:14 },
    { id:'f_wrap',          nombre:'Wrap/Burrito',         nombre_en:'Wrap/Burrito',          porcion:'1 unidad',          kcal:400, proteinas:20, carbohidratos:45, grasas:14 },

    // ── BEBIDAS ──────────────────────────────────────────────────────────────
    { id:'f_agua',          nombre:'Agua',                 nombre_en:'Water',                 porcion:'500ml',             kcal:0,   proteinas:0,  carbohidratos:0,  grasas:0  },
    { id:'f_jugo_naranja',  nombre:'Jugo de naranja',      nombre_en:'Orange juice',          porcion:'200ml',             kcal:88,  proteinas:1,  carbohidratos:21, grasas:0  },
    { id:'f_leche_choco',   nombre:'Leche con chocolate',  nombre_en:'Chocolate milk',        porcion:'250ml',             kcal:220, proteinas:8,  carbohidratos:32, grasas:7  },
    { id:'f_bebida',        nombre:'Bebida / refresco',    nombre_en:'Soda / soft drink',     porcion:'355ml (1 lata)',    kcal:140, proteinas:0,  carbohidratos:38, grasas:0  },
    { id:'f_cerveza',       nombre:'Cerveza',              nombre_en:'Beer',                  porcion:'330ml (1 lata)',    kcal:145, proteinas:1,  carbohidratos:13, grasas:0  },
    { id:'f_vino_tinto',    nombre:'Vino tinto',           nombre_en:'Red wine',              porcion:'150ml (1 copa)',    kcal:125, proteinas:0,  carbohidratos:4,  grasas:0  },

    // ── SNACKS / EXTRAS ──────────────────────────────────────────────────────
    { id:'f_choco_negro',   nombre:'Chocolate negro 70%',  nombre_en:'Dark chocolate 70%',    porcion:'30g (1/4 barra)',   kcal:163, proteinas:3,  carbohidratos:13, grasas:12 },
    { id:'f_galletas_av',   nombre:'Galletas de avena',    nombre_en:'Oat cookies',           porcion:'3 unidades (30g)', kcal:130, proteinas:2,  carbohidratos:20, grasas:5  },
    { id:'f_granola',       nombre:'Granola',              nombre_en:'Granola',               porcion:'50g',               kcal:245, proteinas:6,  carbohidratos:37, grasas:9  },
    { id:'f_barrita',       nombre:'Barrita de cereal',    nombre_en:'Cereal bar',            porcion:'1 unidad (35g)',    kcal:140, proteinas:2,  carbohidratos:27, grasas:3  },
    { id:'f_mayonesa',      nombre:'Mayonesa',             nombre_en:'Mayonnaise',            porcion:'15ml (1 cda)',      kcal:100, proteinas:0,  carbohidratos:0,  grasas:11 },
    { id:'f_ketchup',       nombre:'Ketchup',              nombre_en:'Ketchup',               porcion:'15ml (1 cda)',      kcal:20,  proteinas:0,  carbohidratos:5,  grasas:0  },

  ];

  console.log('[Foods DB] Cargada: ' + window.FOODS_DB.length + ' alimentos');
})();
