/* ============================================
   Calibrate — Base de datos de alimentos comunes (v20260428bv)
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
    { id:'f_ramen',         nombre:'Ramen',                nombre_en:'Ramen',                 porcion:'1 bowl (450ml)',    kcal:430, proteinas:22, carbohidratos:55, grasas:14 },
    { id:'f_paella',        nombre:'Paella',               nombre_en:'Paella',                porcion:'250g',              kcal:380, proteinas:20, carbohidratos:52, grasas:10 },
    { id:'f_pasta_bol',     nombre:'Pasta a la bolognesa', nombre_en:'Bolognese pasta',       porcion:'250g',              kcal:420, proteinas:22, carbohidratos:52, grasas:14 },
    { id:'f_sandwich_jq',   nombre:'Sandwich jamón y queso',nombre_en:'Ham and cheese sandwich',porcion:'1 unidad',        kcal:350, proteinas:18, carbohidratos:35, grasas:14 },
    { id:'f_omelette',      nombre:'Omelette de queso',    nombre_en:'Cheese omelette',       porcion:'2 huevos',          kcal:220, proteinas:16, carbohidratos:1,  grasas:17 },
    { id:'f_ensalada_verde',nombre:'Ensalada verde',       nombre_en:'Green salad',           porcion:'200g',              kcal:45,  proteinas:2,  carbohidratos:8,  grasas:1  },
    { id:'f_crema_sopa',    nombre:'Crema de verduras',    nombre_en:'Vegetable cream soup',  porcion:'300ml',             kcal:140, proteinas:4,  carbohidratos:18, grasas:6  },
    { id:'f_bowl_arroz',    nombre:'Bowl de arroz con proteína',nombre_en:'Protein rice bowl',porcion:'350g',              kcal:480, proteinas:35, carbohidratos:58, grasas:10 },

    // ── COMIDAS CHILENAS ADICIONALES ─────────────────────────────────────────
    { id:'f_charquican',    nombre:'Charquicán',           nombre_en:'Charquicán stew',       porcion:'300g',              kcal:290, proteinas:18, carbohidratos:35, grasas:8  },
    { id:'f_pastel_choclo', nombre:'Pastel de choclo',     nombre_en:'Chilean corn pie',      porcion:'350g',              kcal:480, proteinas:22, carbohidratos:55, grasas:18 },
    { id:'f_porotos_riendas',nombre:'Porotos con riendas', nombre_en:'Beans with riendas',    porcion:'300g',              kcal:350, proteinas:18, carbohidratos:48, grasas:9  },
    { id:'f_valdiviano',    nombre:'Valdiviano',           nombre_en:'Valdiviano soup',       porcion:'350ml',             kcal:180, proteinas:12, carbohidratos:18, grasas:5  },
    { id:'f_chupe',         nombre:'Chupe de mariscos',    nombre_en:'Shellfish casserole',   porcion:'300g',              kcal:350, proteinas:25, carbohidratos:22, grasas:16 },
    { id:'f_mote_huesillos',nombre:'Mote con huesillos',   nombre_en:'Mote con huesillos',    porcion:'1 vaso (400ml)',    kcal:320, proteinas:5,  carbohidratos:72, grasas:1  },
    { id:'f_milhojas',      nombre:'Milhojas',             nombre_en:'Napoleon cake',         porcion:'1 porción (100g)', kcal:380, proteinas:5,  carbohidratos:45, grasas:20 },
    { id:'f_leche_asada',   nombre:'Leche asada',          nombre_en:'Baked milk pudding',    porcion:'150g',              kcal:200, proteinas:7,  carbohidratos:28, grasas:7  },
    { id:'f_kuchen',        nombre:'Kuchen de frutas',     nombre_en:'Fruit kuchen',          porcion:'1 trozo (100g)',    kcal:320, proteinas:5,  carbohidratos:42, grasas:15 },
    { id:'f_costillar',     nombre:'Costillar de cerdo',   nombre_en:'Pork ribs',             porcion:'200g',              kcal:500, proteinas:36, carbohidratos:0,  grasas:39 },
    { id:'f_plateada',      nombre:'Plateada al horno',    nombre_en:'Braised beef',          porcion:'150g',              kcal:330, proteinas:30, carbohidratos:0,  grasas:22 },
    { id:'f_longaniza',     nombre:'Longaniza',            nombre_en:'Chilean sausage',       porcion:'1 unidad (80g)',    kcal:260, proteinas:12, carbohidratos:2,  grasas:23 },

    // ── PESCADOS CHILENOS ─────────────────────────────────────────────────────
    { id:'f_merluza',       nombre:'Merluza',              nombre_en:'Hake',                  porcion:'150g',              kcal:130, proteinas:27, carbohidratos:0,  grasas:2  },
    { id:'f_reineta',       nombre:'Reineta',              nombre_en:'Pacific pomfret',       porcion:'150g',              kcal:185, proteinas:24, carbohidratos:0,  grasas:10 },
    { id:'f_congrio',       nombre:'Congrio',              nombre_en:'Conger eel',            porcion:'150g',              kcal:195, proteinas:26, carbohidratos:0,  grasas:10 },
    { id:'f_albacora',      nombre:'Albacora / Atún fresco',nombre_en:'Albacore tuna',        porcion:'150g',              kcal:240, proteinas:33, carbohidratos:0,  grasas:12 },
    { id:'f_caballa',       nombre:'Caballa / Jurel',      nombre_en:'Mackerel / Jack',       porcion:'150g',              kcal:225, proteinas:26, carbohidratos:0,  grasas:13 },
    { id:'f_sardinas',      nombre:'Sardinas en conserva',  nombre_en:'Canned sardines',      porcion:'100g',              kcal:200, proteinas:24, carbohidratos:0,  grasas:11 },

    // ── DESAYUNO ─────────────────────────────────────────────────────────────
    { id:'f_cereal',        nombre:'Cereal (corn flakes)', nombre_en:'Corn flakes cereal',    porcion:'40g (1 taza)',      kcal:150, proteinas:3,  carbohidratos:34, grasas:0  },
    { id:'f_avena_leche',   nombre:'Avena con leche',      nombre_en:'Oatmeal with milk',     porcion:'200g',              kcal:260, proteinas:11, carbohidratos:38, grasas:7  },
    { id:'f_pancakes',      nombre:'Pancakes (3 unidades)',nombre_en:'Pancakes',              porcion:'3 unidades',        kcal:350, proteinas:9,  carbohidratos:55, grasas:10 },
    { id:'f_waffles',       nombre:'Waffles',              nombre_en:'Waffles',               porcion:'2 unidades',        kcal:370, proteinas:8,  carbohidratos:55, grasas:13 },
    { id:'f_tostada_man',   nombre:'Tostada con mantequilla',nombre_en:'Buttered toast',      porcion:'1 rebanada',        kcal:130, proteinas:3,  carbohidratos:14, grasas:7  },
    { id:'f_tostada_palta', nombre:'Tostada con palta',    nombre_en:'Avocado toast',         porcion:'1 rebanada + palta',kcal:220, proteinas:5,  carbohidratos:18, grasas:14 },
    { id:'f_smoothie',      nombre:'Smoothie de frutas',   nombre_en:'Fruit smoothie',        porcion:'300ml',             kcal:200, proteinas:4,  carbohidratos:45, grasas:1  },
    { id:'f_overnight_oats',nombre:'Overnight oats',       nombre_en:'Overnight oats',        porcion:'250g',              kcal:340, proteinas:15, carbohidratos:48, grasas:9  },
    { id:'f_bol_yogurt',    nombre:'Bowl de yogurt con frutas',nombre_en:'Yogurt bowl',       porcion:'300g',              kcal:280, proteinas:18, carbohidratos:40, grasas:5  },

    // ── FAST FOOD ─────────────────────────────────────────────────────────────
    { id:'f_big_mac',       nombre:'Big Mac',              nombre_en:'Big Mac',               porcion:'1 unidad',          kcal:550, proteinas:25, carbohidratos:46, grasas:30 },
    { id:'f_mcpollo',       nombre:'McPollo',              nombre_en:'McChicken',             porcion:'1 unidad',          kcal:430, proteinas:21, carbohidratos:42, grasas:20 },
    { id:'f_papas_mcd',     nombre:'Papas fritas McDonald\'s',nombre_en:'McDonald\'s fries',  porcion:'porción mediana',   kcal:340, proteinas:4,  carbohidratos:44, grasas:16 },
    { id:'f_nuggets',       nombre:'Nuggets de pollo (6)',  nombre_en:'Chicken nuggets (6)',  porcion:'6 piezas',          kcal:270, proteinas:14, carbohidratos:17, grasas:16 },
    { id:'f_pizza_hawai',   nombre:'Pizza hawaiana',       nombre_en:'Hawaiian pizza',        porcion:'2 porciones',       kcal:520, proteinas:22, carbohidratos:64, grasas:18 },
    { id:'f_subway',        nombre:'Subway 15cm pollo',    nombre_en:'6-inch chicken sub',    porcion:'1 sandwich',        kcal:330, proteinas:24, carbohidratos:42, grasas:6  },
    { id:'f_shawarma',      nombre:'Shawarma',             nombre_en:'Shawarma',              porcion:'1 unidad',          kcal:450, proteinas:25, carbohidratos:48, grasas:16 },

    // ── VERDURAS ADICIONALES ─────────────────────────────────────────────────
    { id:'f_coliflor',      nombre:'Coliflor',             nombre_en:'Cauliflower',           porcion:'100g',              kcal:25,  proteinas:2,  carbohidratos:5,  grasas:0  },
    { id:'f_berenjera',     nombre:'Berenjena',            nombre_en:'Eggplant',              porcion:'100g',              kcal:25,  proteinas:1,  carbohidratos:6,  grasas:0  },
    { id:'f_puerro',        nombre:'Puerro',               nombre_en:'Leek',                  porcion:'100g',              kcal:61,  proteinas:1,  carbohidratos:14, grasas:0  },
    { id:'f_alcachofa',     nombre:'Alcachofa',            nombre_en:'Artichoke',             porcion:'1 unidad (120g)',   kcal:60,  proteinas:4,  carbohidratos:13, grasas:0  },
    { id:'f_rucula',        nombre:'Rúcula',               nombre_en:'Arugula',               porcion:'50g',               kcal:13,  proteinas:1,  carbohidratos:2,  grasas:0  },
    { id:'f_berros',        nombre:'Berros',               nombre_en:'Watercress',            porcion:'50g',               kcal:11,  proteinas:1,  carbohidratos:1,  grasas:0  },
    { id:'f_nabo',          nombre:'Nabo',                 nombre_en:'Turnip',                porcion:'100g',              kcal:28,  proteinas:1,  carbohidratos:6,  grasas:0  },
    { id:'f_arvejas',       nombre:'Arvejas',              nombre_en:'Peas',                  porcion:'100g',              kcal:81,  proteinas:5,  carbohidratos:14, grasas:0  },
    { id:'f_habas',         nombre:'Habas cocidas',        nombre_en:'Fava beans',            porcion:'100g',              kcal:88,  proteinas:8,  carbohidratos:16, grasas:0  },
    { id:'f_poroto_verde',  nombre:'Porotos verdes',       nombre_en:'Green beans',           porcion:'100g',              kcal:31,  proteinas:2,  carbohidratos:7,  grasas:0  },

    // ── FRUTAS ADICIONALES ───────────────────────────────────────────────────
    { id:'f_frambuesa',     nombre:'Frambuesas',           nombre_en:'Raspberries',           porcion:'100g',              kcal:52,  proteinas:1,  carbohidratos:12, grasas:1  },
    { id:'f_cereza',        nombre:'Cerezas',              nombre_en:'Cherries',              porcion:'100g',              kcal:63,  proteinas:1,  carbohidratos:16, grasas:0  },
    { id:'f_mandarina',     nombre:'Mandarina',            nombre_en:'Mandarin',              porcion:'1 mediana (75g)',   kcal:53,  proteinas:1,  carbohidratos:13, grasas:0  },
    { id:'f_limón',         nombre:'Limón / Lima',         nombre_en:'Lemon / Lime',          porcion:'1 unidad (50g)',    kcal:15,  proteinas:0,  carbohidratos:5,  grasas:0  },
    { id:'f_piña',          nombre:'Piña',                 nombre_en:'Pineapple',             porcion:'150g',              kcal:75,  proteinas:1,  carbohidratos:20, grasas:0  },
    { id:'f_papaya',        nombre:'Papaya',               nombre_en:'Papaya',                porcion:'150g',              kcal:60,  proteinas:1,  carbohidratos:15, grasas:0  },
    { id:'f_coco',          nombre:'Coco rallado',         nombre_en:'Shredded coconut',      porcion:'20g',               kcal:100, proteinas:1,  carbohidratos:4,  grasas:9  },

    // ── FRUTOS SECOS ADICIONALES ─────────────────────────────────────────────
    { id:'f_pistachos',     nombre:'Pistachos',            nombre_en:'Pistachios',            porcion:'30g',               kcal:162, proteinas:6,  carbohidratos:8,  grasas:13 },
    { id:'f_avellanas',     nombre:'Avellanas',            nombre_en:'Hazelnuts',             porcion:'30g',               kcal:188, proteinas:5,  carbohidratos:5,  grasas:18 },
    { id:'f_castanias',     nombre:'Castañas',             nombre_en:'Chestnuts',             porcion:'50g',               kcal:99,  proteinas:2,  carbohidratos:21, grasas:1  },
    { id:'f_semillas_girasol',nombre:'Semillas de girasol',nombre_en:'Sunflower seeds',       porcion:'30g',               kcal:174, proteinas:6,  carbohidratos:6,  grasas:15 },
    { id:'f_semillas_zapallo',nombre:'Semillas de zapallo',nombre_en:'Pumpkin seeds',         porcion:'30g',               kcal:170, proteinas:9,  carbohidratos:4,  grasas:14 },

    // ── LÁCTEOS ADICIONALES ──────────────────────────────────────────────────
    { id:'f_helado',        nombre:'Helado',               nombre_en:'Ice cream',             porcion:'2 bolas (120g)',    kcal:250, proteinas:4,  carbohidratos:32, grasas:12 },
    { id:'f_queso_cheddar', nombre:'Queso cheddar / laminado',nombre_en:'Cheddar cheese',    porcion:'30g (2 láminas)',   kcal:110, proteinas:7,  carbohidratos:0,  grasas:9  },
    { id:'f_crema_leche',   nombre:'Crema de leche',       nombre_en:'Heavy cream',           porcion:'30ml (2 cdas)',     kcal:100, proteinas:1,  carbohidratos:1,  grasas:10 },
    { id:'f_leche_evap',    nombre:'Leche evaporada',      nombre_en:'Evaporated milk',       porcion:'100ml',             kcal:135, proteinas:7,  carbohidratos:10, grasas:8  },

    // ── GRANOS Y HARINAS ─────────────────────────────────────────────────────
    { id:'f_cuscus',        nombre:'Cuscús cocido',        nombre_en:'Cooked couscous',       porcion:'150g',              kcal:175, proteinas:6,  carbohidratos:36, grasas:0  },
    { id:'f_bulgur',        nombre:'Bulgur cocido',        nombre_en:'Cooked bulgur',         porcion:'150g',              kcal:150, proteinas:6,  carbohidratos:33, grasas:0  },
    { id:'f_polenta',       nombre:'Polenta cocida',       nombre_en:'Cooked polenta',        porcion:'150g',              kcal:110, proteinas:2,  carbohidratos:24, grasas:0  },
    { id:'f_harina',        nombre:'Harina de trigo',      nombre_en:'Wheat flour',           porcion:'30g (2 cdas)',      kcal:109, proteinas:3,  carbohidratos:23, grasas:0  },
    { id:'f_harina_avena',  nombre:'Harina de avena',      nombre_en:'Oat flour',             porcion:'30g (2 cdas)',      kcal:114, proteinas:4,  carbohidratos:21, grasas:2  },
    { id:'f_arroz_blanco',  nombre:'Arroz blanco (crudo)', nombre_en:'Raw white rice',        porcion:'50g (crudo)',        kcal:182, proteinas:4,  carbohidratos:40, grasas:0  },

    // ── CONDIMENTOS Y ENDULZANTES ────────────────────────────────────────────
    { id:'f_miel',          nombre:'Miel',                 nombre_en:'Honey',                 porcion:'15ml (1 cda)',      kcal:64,  proteinas:0,  carbohidratos:17, grasas:0  },
    { id:'f_azucar',        nombre:'Azúcar',               nombre_en:'Sugar',                 porcion:'10g (1 cdita)',     kcal:39,  proteinas:0,  carbohidratos:10, grasas:0  },
    { id:'f_mostaza',       nombre:'Mostaza',              nombre_en:'Mustard',               porcion:'10g (1 cdita)',     kcal:10,  proteinas:1,  carbohidratos:1,  grasas:1  },
    { id:'f_salsa_soya',    nombre:'Salsa de soya',        nombre_en:'Soy sauce',             porcion:'15ml (1 cda)',      kcal:10,  proteinas:1,  carbohidratos:1,  grasas:0  },
    { id:'f_salsa_tomate',  nombre:'Salsa de tomate',      nombre_en:'Tomato sauce',          porcion:'60ml (1/4 taza)',   kcal:30,  proteinas:1,  carbohidratos:6,  grasas:0  },
    { id:'f_vinagre',       nombre:'Vinagre',              nombre_en:'Vinegar',               porcion:'15ml (1 cda)',      kcal:3,   proteinas:0,  carbohidratos:0,  grasas:0  },
    { id:'f_crema_coco',    nombre:'Crema de coco',        nombre_en:'Coconut cream',         porcion:'60ml',              kcal:150, proteinas:1,  carbohidratos:3,  grasas:16 },

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

    // ── PANES ADICIONALES ────────────────────────────────────────────────────
    { id:'f_pan_pita',       nombre:'Pan pita blanco',      nombre_en:'White pita bread',      porcion:'1 unidad (60g)',    kcal:165, proteinas:6,  carbohidratos:33, grasas:1  },
    { id:'f_pan_pita_int',   nombre:'Pan pita integral',    nombre_en:'Whole wheat pita',      porcion:'1 unidad (60g)',    kcal:160, proteinas:7,  carbohidratos:31, grasas:2  },
    { id:'f_pan_arabe',      nombre:'Pan árabe / lavash',   nombre_en:'Flatbread / lavash',    porcion:'1 unidad (50g)',    kcal:130, proteinas:4,  carbohidratos:26, grasas:1  },
    { id:'f_bagel',          nombre:'Bagel',                nombre_en:'Bagel',                 porcion:'1 unidad (105g)',   kcal:270, proteinas:10, carbohidratos:53, grasas:1  },
    { id:'f_baguette',       nombre:'Baguette',             nombre_en:'Baguette',              porcion:'1 trozo (60g)',     kcal:165, proteinas:6,  carbohidratos:33, grasas:1  },
    { id:'f_croissant',      nombre:'Croissant',            nombre_en:'Croissant',             porcion:'1 unidad (57g)',    kcal:230, proteinas:5,  carbohidratos:26, grasas:12 },
    { id:'f_pan_centeno',    nombre:'Pan de centeno',       nombre_en:'Rye bread',             porcion:'1 rebanada (32g)', kcal:83,  proteinas:3,  carbohidratos:16, grasas:1  },
    { id:'f_pan_lactal',     nombre:'Pan de molde / lactal',nombre_en:'Sandwich bread',        porcion:'1 rebanada (28g)', kcal:70,  proteinas:2,  carbohidratos:14, grasas:1  },
    { id:'f_naan',           nombre:'Naan',                 nombre_en:'Naan bread',            porcion:'1 unidad (90g)',    kcal:260, proteinas:9,  carbohidratos:45, grasas:5  },
    { id:'f_tort_trigo',     nombre:'Tortilla de trigo',    nombre_en:'Flour tortilla',        porcion:'1 unidad (45g)',    kcal:150, proteinas:4,  carbohidratos:27, grasas:3  },
    { id:'f_wrap_trigo',     nombre:'Wrap de trigo',        nombre_en:'Wheat wrap',            porcion:'1 unidad (60g)',    kcal:185, proteinas:5,  carbohidratos:34, grasas:4  },

    // ── EMBUTIDOS Y FIAMBRES ─────────────────────────────────────────────────
    { id:'f_jamon_pavo',     nombre:'Jamón de pavo',        nombre_en:'Turkey deli ham',       porcion:'2 láminas (50g)',  kcal:55,  proteinas:10, carbohidratos:1,  grasas:1  },
    { id:'f_jamon_serrano',  nombre:'Jamón serrano / prosciutto',nombre_en:'Serrano / prosciutto',porcion:'2 láminas (30g)',kcal:80,  proteinas:8,  carbohidratos:0,  grasas:5  },
    { id:'f_salami',         nombre:'Salami',               nombre_en:'Salami',                porcion:'3 láminas (30g)',  kcal:105, proteinas:5,  carbohidratos:1,  grasas:9  },
    { id:'f_mortadela',      nombre:'Mortadela',            nombre_en:'Mortadella',            porcion:'2 láminas (50g)',  kcal:140, proteinas:7,  carbohidratos:2,  grasas:12 },
    { id:'f_pepperoni',      nombre:'Pepperoni',            nombre_en:'Pepperoni',             porcion:'10 rodajas (28g)', kcal:138, proteinas:6,  carbohidratos:1,  grasas:12 },
    { id:'f_tocino',         nombre:'Tocino / Bacon',       nombre_en:'Bacon',                 porcion:'3 lonchas (30g)',  kcal:130, proteinas:9,  carbohidratos:0,  grasas:10 },
    { id:'f_salchicha',      nombre:'Salchicha / Vienesa',  nombre_en:'Sausage / frankfurter', porcion:'1 unidad (45g)',   kcal:130, proteinas:5,  carbohidratos:1,  grasas:12 },
    { id:'f_chorizo_cocido', nombre:'Chorizo cocido',       nombre_en:'Cooked chorizo',        porcion:'1 unidad (70g)',   kcal:220, proteinas:12, carbohidratos:1,  grasas:19 },

    // ── QUESOS ADICIONALES ───────────────────────────────────────────────────
    { id:'f_queso_crema',    nombre:'Queso crema (Philadelphia)',nombre_en:'Cream cheese',     porcion:'2 cdas (30g)',     kcal:100, proteinas:2,  carbohidratos:1,  grasas:10 },
    { id:'f_mozzarella',     nombre:'Mozzarella',           nombre_en:'Mozzarella',            porcion:'50g',               kcal:140, proteinas:9,  carbohidratos:1,  grasas:11 },
    { id:'f_parmesano',      nombre:'Parmesano rallado',    nombre_en:'Grated parmesan',       porcion:'2 cdas (15g)',     kcal:62,  proteinas:6,  carbohidratos:0,  grasas:4  },
    { id:'f_gouda',          nombre:'Queso gouda',          nombre_en:'Gouda cheese',          porcion:'30g',               kcal:100, proteinas:7,  carbohidratos:0,  grasas:8  },
    { id:'f_queso_cabra',    nombre:'Queso de cabra',       nombre_en:'Goat cheese',           porcion:'30g',               kcal:79,  proteinas:5,  carbohidratos:0,  grasas:6  },
    { id:'f_brie',           nombre:'Brie / Camembert',     nombre_en:'Brie / Camembert',      porcion:'30g',               kcal:95,  proteinas:6,  carbohidratos:0,  grasas:8  },
    { id:'f_queso_azul',     nombre:'Queso azul / Roquefort',nombre_en:'Blue cheese',         porcion:'30g',               kcal:100, proteinas:6,  carbohidratos:1,  grasas:8  },
    { id:'f_cottage',        nombre:'Cottage cheese',       nombre_en:'Cottage cheese',        porcion:'100g',              kcal:98,  proteinas:11, carbohidratos:3,  grasas:4  },

    // ── PROTEÍNAS ANIMALES ADICIONALES ──────────────────────────────────────
    { id:'f_pollo_asado',    nombre:'Pollo asado / rostizado',nombre_en:'Roast chicken',      porcion:'100g',              kcal:190, proteinas:29, carbohidratos:0,  grasas:8  },
    { id:'f_tilapia',        nombre:'Tilapia',              nombre_en:'Tilapia',               porcion:'150g',              kcal:145, proteinas:30, carbohidratos:0,  grasas:3  },
    { id:'f_trucha',         nombre:'Trucha',               nombre_en:'Trout',                 porcion:'150g',              kcal:215, proteinas:28, carbohidratos:0,  grasas:11 },
    { id:'f_salmon_ahumado', nombre:'Salmón ahumado',       nombre_en:'Smoked salmon',        porcion:'50g',               kcal:80,  proteinas:10, carbohidratos:0,  grasas:5  },
    { id:'f_mejillones',     nombre:'Mejillones',           nombre_en:'Mussels',               porcion:'100g',              kcal:86,  proteinas:12, carbohidratos:4,  grasas:2  },
    { id:'f_bife',           nombre:'Bife de vacuno',       nombre_en:'Beef steak',            porcion:'150g',              kcal:310, proteinas:34, carbohidratos:0,  grasas:19 },
    { id:'f_cordero',        nombre:'Cordero',              nombre_en:'Lamb',                  porcion:'150g',              kcal:290, proteinas:28, carbohidratos:0,  grasas:19 },
    { id:'f_pulpo',          nombre:'Pulpo',                nombre_en:'Octopus',               porcion:'100g',              kcal:82,  proteinas:15, carbohidratos:2,  grasas:1  },
    { id:'f_calamar',        nombre:'Calamar / Jibia',      nombre_en:'Squid / Calamari',      porcion:'100g',              kcal:92,  proteinas:16, carbohidratos:3,  grasas:1  },

    // ── PROTEÍNAS VEGETALES ADICIONALES ─────────────────────────────────────
    { id:'f_tempeh',         nombre:'Tempeh',               nombre_en:'Tempeh',                porcion:'100g',              kcal:195, proteinas:19, carbohidratos:9,  grasas:11 },
    { id:'f_seitan',         nombre:'Seitán',               nombre_en:'Seitan',                porcion:'100g',              kcal:120, proteinas:21, carbohidratos:4,  grasas:2  },
    { id:'f_pst',            nombre:'Proteína de soja texturizada (PST)',nombre_en:'Textured soy protein',porcion:'100g cocida',kcal:140,proteinas:17,carbohidratos:10,grasas:1 },
    { id:'f_burg_vegetal',   nombre:'Hamburguesa vegetal',  nombre_en:'Veggie burger',         porcion:'1 unidad (113g)',   kcal:200, proteinas:20, carbohidratos:9,  grasas:8  },
    { id:'f_falafel',        nombre:'Falafel',              nombre_en:'Falafel',               porcion:'3 unidades (90g)', kcal:220, proteinas:8,  carbohidratos:22, grasas:12 },
    { id:'f_lupino',         nombre:'Lupino / Altramuz',    nombre_en:'Lupini beans',          porcion:'100g',              kcal:119, proteinas:16, carbohidratos:9,  grasas:3  },

    // ── BEBIDAS ADICIONALES ──────────────────────────────────────────────────
    { id:'f_leche_almend',   nombre:'Leche de almendras',   nombre_en:'Almond milk',           porcion:'1 taza (240ml)',    kcal:30,  proteinas:1,  carbohidratos:1,  grasas:3  },
    { id:'f_leche_avena',    nombre:'Leche de avena',       nombre_en:'Oat milk',              porcion:'1 taza (240ml)',    kcal:120, proteinas:3,  carbohidratos:16, grasas:5  },
    { id:'f_leche_soya',     nombre:'Leche de soya',        nombre_en:'Soy milk',              porcion:'1 taza (240ml)',    kcal:80,  proteinas:7,  carbohidratos:4,  grasas:4  },
    { id:'f_cafe_amer',      nombre:'Café americano',       nombre_en:'Americano coffee',      porcion:'240ml',             kcal:5,   proteinas:0,  carbohidratos:0,  grasas:0  },
    { id:'f_cafe_latte',     nombre:'Café latte',           nombre_en:'Latte',                 porcion:'350ml',             kcal:150, proteinas:8,  carbohidratos:15, grasas:5  },
    { id:'f_capuchino',      nombre:'Capuchino',            nombre_en:'Cappuccino',            porcion:'240ml',             kcal:120, proteinas:7,  carbohidratos:10, grasas:4  },
    { id:'f_te',             nombre:'Té sin azúcar',        nombre_en:'Unsweetened tea',       porcion:'250ml',             kcal:0,   proteinas:0,  carbohidratos:0,  grasas:0  },
    { id:'f_kombucha',       nombre:'Kombucha',             nombre_en:'Kombucha',              porcion:'240ml',             kcal:30,  proteinas:0,  carbohidratos:7,  grasas:0  },
    { id:'f_jugo_verde',     nombre:'Jugo verde',           nombre_en:'Green juice',           porcion:'300ml',             kcal:90,  proteinas:2,  carbohidratos:20, grasas:0  },
    { id:'f_batido_prot_rtd',nombre:'Batido proteico RTD',  nombre_en:'Ready-to-drink protein shake',porcion:'1 botella (330ml)',kcal:160,proteinas:25,carbohidratos:10,grasas:3 },

    // ── COMIDAS PREPARADAS ADICIONALES ──────────────────────────────────────
    { id:'f_tabule',         nombre:'Tabulé',               nombre_en:'Tabbouleh',             porcion:'100g',              kcal:88,  proteinas:2,  carbohidratos:14, grasas:3  },
    { id:'f_poke_bowl',      nombre:'Poke bowl',            nombre_en:'Poke bowl',             porcion:'1 bowl (400g)',     kcal:580, proteinas:32, carbohidratos:68, grasas:16 },
    { id:'f_acai_bowl',      nombre:'Açaí bowl',            nombre_en:'Açaí bowl',             porcion:'1 bowl (300g)',     kcal:400, proteinas:8,  carbohidratos:62, grasas:14 },
    { id:'f_lasagna',        nombre:'Lasagna',              nombre_en:'Lasagna',               porcion:'1 porción (250g)', kcal:380, proteinas:18, carbohidratos:38, grasas:17 },
    { id:'f_risotto',        nombre:'Risotto',              nombre_en:'Risotto',               porcion:'1 porción (300g)', kcal:420, proteinas:12, carbohidratos:68, grasas:12 },
    { id:'f_sopa_pollo',     nombre:'Sopa de pollo',        nombre_en:'Chicken soup',          porcion:'1 bowl (350ml)',    kcal:180, proteinas:16, carbohidratos:14, grasas:5  },
    { id:'f_ceviche',        nombre:'Ceviche',              nombre_en:'Ceviche',               porcion:'1 porción (200g)', kcal:160, proteinas:22, carbohidratos:10, grasas:3  },

    // ── SALSAS Y CONDIMENTOS EXTRA ───────────────────────────────────────────
    { id:'f_guacamole',      nombre:'Guacamole',            nombre_en:'Guacamole',             porcion:'2 cdas (50g)',     kcal:90,  proteinas:1,  carbohidratos:5,  grasas:8  },
    { id:'f_pesto',          nombre:'Pesto',                nombre_en:'Pesto',                 porcion:'2 cdas (30g)',     kcal:145, proteinas:3,  carbohidratos:1,  grasas:15 },
    { id:'f_tzatziki',       nombre:'Tzatziki',             nombre_en:'Tzatziki',              porcion:'2 cdas (50g)',     kcal:40,  proteinas:2,  carbohidratos:3,  grasas:2  },
    { id:'f_tahini',         nombre:'Tahini',               nombre_en:'Tahini',                porcion:'1 cda (15g)',      kcal:90,  proteinas:3,  carbohidratos:3,  grasas:8  },
    { id:'f_aceitunas',      nombre:'Aceitunas',            nombre_en:'Olives',                porcion:'10 unidades (30g)',kcal:45,  proteinas:0,  carbohidratos:2,  grasas:4  },
    { id:'f_pepinillos',     nombre:'Pepinillos en vinagre',nombre_en:'Pickles',               porcion:'50g',               kcal:8,   proteinas:0,  carbohidratos:2,  grasas:0  },
    { id:'f_sriracha',       nombre:'Sriracha',             nombre_en:'Sriracha',              porcion:'1 cda (15g)',      kcal:15,  proteinas:0,  carbohidratos:3,  grasas:0  },
    { id:'f_ghee',           nombre:'Ghee (mantequilla clarificada)',nombre_en:'Ghee',          porcion:'1 cda (14g)',      kcal:130, proteinas:0,  carbohidratos:0,  grasas:14 },
    { id:'f_aceite_coco',    nombre:'Aceite de coco',       nombre_en:'Coconut oil',           porcion:'1 cda (14g)',      kcal:120, proteinas:0,  carbohidratos:0,  grasas:14 },

    // ── PASTAS ADICIONALES ───────────────────────────────────────────────────
    { id:'f_pasta_int',      nombre:'Pasta integral cocida',nombre_en:'Whole wheat pasta',     porcion:'150g',              kcal:200, proteinas:8,  carbohidratos:40, grasas:2  },
    { id:'f_noquis',         nombre:'Ñoquis cocidos',       nombre_en:'Gnocchi',               porcion:'150g',              kcal:220, proteinas:5,  carbohidratos:48, grasas:1  },
    { id:'f_fideos_arroz',   nombre:'Fideos de arroz',      nombre_en:'Rice noodles',          porcion:'150g cocidos',      kcal:165, proteinas:3,  carbohidratos:37, grasas:0  },
    { id:'f_soba',           nombre:'Fideos soba',          nombre_en:'Soba noodles',          porcion:'150g cocidos',      kcal:160, proteinas:8,  carbohidratos:33, grasas:0  },

    // ── SNACKS ADICIONALES ───────────────────────────────────────────────────
    { id:'f_tostadas_arroz', nombre:'Tostadas de arroz',    nombre_en:'Rice cakes',            porcion:'2 unidades (18g)', kcal:68,  proteinas:1,  carbohidratos:14, grasas:0  },
    { id:'f_chips',          nombre:'Chips de papa',        nombre_en:'Potato chips',          porcion:'30g',               kcal:155, proteinas:2,  carbohidratos:17, grasas:9  },
    { id:'f_palomitas',      nombre:'Palomitas de maíz',    nombre_en:'Popcorn',               porcion:'30g',               kcal:120, proteinas:3,  carbohidratos:20, grasas:4  },
    { id:'f_barra_prot',     nombre:'Barra proteica',       nombre_en:'Protein bar',           porcion:'1 unidad (60g)',    kcal:200, proteinas:20, carbohidratos:22, grasas:5  },

    // ── VERDURAS ADICIONALES ─────────────────────────────────────────────────
    { id:'f_esparragos',     nombre:'Espárragos',           nombre_en:'Asparagus',             porcion:'100g',              kcal:20,  proteinas:2,  carbohidratos:4,  grasas:0  },
    { id:'f_palmito',        nombre:'Palmito',              nombre_en:'Hearts of palm',        porcion:'100g',              kcal:25,  proteinas:3,  carbohidratos:4,  grasas:0  },
    { id:'f_repollo',        nombre:'Repollo',              nombre_en:'Cabbage',               porcion:'100g',              kcal:25,  proteinas:1,  carbohidratos:6,  grasas:0  },
    { id:'f_rabano',         nombre:'Rábano',               nombre_en:'Radish',                porcion:'100g',              kcal:16,  proteinas:1,  carbohidratos:3,  grasas:0  },
    { id:'f_coraz_alcachofa',nombre:'Corazones de alcachofa',nombre_en:'Artichoke hearts',    porcion:'100g',              kcal:50,  proteinas:3,  carbohidratos:10, grasas:0  },
    { id:'f_shiitake',       nombre:'Shiitake',             nombre_en:'Shiitake mushrooms',    porcion:'100g',              kcal:34,  proteinas:2,  carbohidratos:7,  grasas:0  },

    // ── FRUTAS ADICIONALES ───────────────────────────────────────────────────
    { id:'f_ciruela',        nombre:'Ciruela',              nombre_en:'Plum',                  porcion:'1 mediana (70g)',   kcal:30,  proteinas:0,  carbohidratos:8,  grasas:0  },
    { id:'f_higo',           nombre:'Higo',                 nombre_en:'Fig',                   porcion:'2 unidades (80g)', kcal:62,  proteinas:1,  carbohidratos:16, grasas:0  },
    { id:'f_datiles',        nombre:'Dátiles',              nombre_en:'Dates',                 porcion:'3 unidades (30g)', kcal:83,  proteinas:1,  carbohidratos:22, grasas:0  },
    { id:'f_maracuya',       nombre:'Maracuyá',             nombre_en:'Passion fruit',         porcion:'100g',              kcal:97,  proteinas:2,  carbohidratos:23, grasas:1  },

    // ── CEREALES PARA NIÑOS ──────────────────────────────────────────────────
    { id:'f_froot_loops',    nombre:'Froot Loops',          nombre_en:'Froot Loops',           porcion:'1 taza (29g)',      kcal:110, proteinas:1,  carbohidratos:25, grasas:1  },
    { id:'f_choco_krispis',  nombre:'Choco Krispis',        nombre_en:'Cocoa Krispies',        porcion:'1 taza (31g)',      kcal:120, proteinas:2,  carbohidratos:27, grasas:1  },
    { id:'f_zucaritas',      nombre:'Zucaritas (Frosted Flakes)',nombre_en:'Frosted Flakes',   porcion:'1 taza (31g)',      kcal:120, proteinas:1,  carbohidratos:28, grasas:0  },
    { id:'f_lucky_charms',   nombre:'Lucky Charms',         nombre_en:'Lucky Charms',          porcion:'3/4 taza (27g)',   kcal:110, proteinas:2,  carbohidratos:22, grasas:1  },
    { id:'f_honey_stars',    nombre:'Honey Stars / Golden Grams',nombre_en:'Honey Stars',      porcion:'1 taza (30g)',      kcal:115, proteinas:2,  carbohidratos:25, grasas:1  },
    { id:'f_cinnamon_tc',    nombre:'Cinnamon Toast Crunch',nombre_en:'Cinnamon Toast Crunch', porcion:'3/4 taza (31g)',   kcal:130, proteinas:1,  carbohidratos:25, grasas:3  },
    { id:'f_nesquik_cer',    nombre:'Nesquik Cereal',       nombre_en:'Nesquik Cereal',        porcion:'1 taza (30g)',      kcal:118, proteinas:2,  carbohidratos:25, grasas:1  },
    { id:'f_corn_pops',      nombre:'Corn Pops',            nombre_en:'Corn Pops',             porcion:'1 taza (31g)',      kcal:120, proteinas:1,  carbohidratos:27, grasas:0  },
    { id:'f_cocoa_puffs',    nombre:'Cocoa Puffs',          nombre_en:'Cocoa Puffs',           porcion:'3/4 taza (27g)',   kcal:100, proteinas:1,  carbohidratos:22, grasas:1  },
    { id:'f_honey_nut_ch',   nombre:'Honey Nut Cheerios',   nombre_en:'Honey Nut Cheerios',    porcion:'3/4 taza (28g)',   kcal:110, proteinas:3,  carbohidratos:22, grasas:2  },

    // ── AVENA (variedades) ───────────────────────────────────────────────────
    { id:'f_avena_quaker',   nombre:'Avena Quaker tradicional',nombre_en:'Quaker oats',        porcion:'40g (cruda)',       kcal:150, proteinas:5,  carbohidratos:27, grasas:3  },
    { id:'f_avena_inst',     nombre:'Avena instantánea (sobre)',nombre_en:'Instant oatmeal packet',porcion:'1 sobre (35g)', kcal:130, proteinas:4,  carbohidratos:24, grasas:2  },
    { id:'f_avena_leche2',   nombre:'Avena con leche preparada',nombre_en:'Oatmeal with milk ready',porcion:'1 taza (250ml)',kcal:210, proteinas:9,  carbohidratos:33, grasas:6  },
    { id:'f_avena_miel',     nombre:'Avena con miel y plátano',nombre_en:'Oatmeal honey banana',porcion:'1 tazón (300g)',   kcal:290, proteinas:8,  carbohidratos:55, grasas:5  },

    // ── GALLETAS ─────────────────────────────────────────────────────────────
    { id:'f_oreo',           nombre:'Galletas Oreo (3 unidades)',nombre_en:'Oreo cookies',     porcion:'3 galletas (34g)', kcal:160, proteinas:1,  carbohidratos:25, grasas:7  },
    { id:'f_ritz',           nombre:'Galletas Ritz (5 unidades)',nombre_en:'Ritz crackers',    porcion:'5 galletas (16g)', kcal:80,  proteinas:1,  carbohidratos:10, grasas:4  },
    { id:'f_triton',         nombre:'Galletas Tritón (4 unidades)',nombre_en:'Triton cookies', porcion:'4 galletas (28g)', kcal:130, proteinas:1,  carbohidratos:19, grasas:6  },
    { id:'f_soda_gall',      nombre:'Galletas Soda (6 unidades)',nombre_en:'Soda crackers',    porcion:'6 galletas (30g)', kcal:130, proteinas:2,  carbohidratos:22, grasas:4  },
    { id:'f_bromato',        nombre:'Galletas Bromato (5 unidades)',nombre_en:'Bromato crackers',porcion:'5 galletas (25g)',kcal:110, proteinas:2,  carbohidratos:17, grasas:4  },
    { id:'f_vino_galleta',   nombre:'Galletas de vino (4 unidades)',nombre_en:'Wine cookies',  porcion:'4 galletas (32g)', kcal:145, proteinas:2,  carbohidratos:23, grasas:5  },
    { id:'f_coco_galleta',   nombre:'Galletas de coco (3 unidades)',nombre_en:'Coconut cookies',porcion:'3 galletas (24g)',kcal:120, proteinas:1,  carbohidratos:18, grasas:5  },
    { id:'f_cream_cracker',  nombre:'Cream Crackers (5 unidades)',nombre_en:'Cream crackers',  porcion:'5 galletas (25g)', kcal:110, proteinas:2,  carbohidratos:18, grasas:3  },
    { id:'f_digestive',      nombre:'Galletas Digestive (2 unidades)',nombre_en:'Digestive biscuits',porcion:'2 galletas (30g)',kcal:140,proteinas:2,carbohidratos:20,grasas:6 },
    { id:'f_cookie_chips',   nombre:'Cookie con chips de chocolate',nombre_en:'Chocolate chip cookie',porcion:'1 grande (45g)',kcal:210,proteinas:3,carbohidratos:28,grasas:10},
    { id:'f_picaroco',       nombre:'Galletas Picaroco (4 unidades)',nombre_en:'Picaroco crackers',porcion:'4 galletas (28g)',kcal:130,proteinas:2,carbohidratos:20,grasas:5 },
    { id:'f_cartago',        nombre:'Galletas Cartago (4 unidades)',nombre_en:'Cartago cookies', porcion:'4 galletas (32g)', kcal:155, proteinas:2,  carbohidratos:22, grasas:6  },

    // ── PAPAS FRITAS (snacks) ─────────────────────────────────────────────────
    { id:'f_lays_clasicas',  nombre:'Lays clásicas',        nombre_en:'Lays original chips',   porcion:'bolsa pequeña (28g)',kcal:152, proteinas:2,  carbohidratos:15, grasas:10 },
    { id:'f_pringles',       nombre:'Pringles original',    nombre_en:'Pringles original',      porcion:'14 chips (30g)',    kcal:160, proteinas:1,  carbohidratos:17, grasas:10 },
    { id:'f_pehuén',         nombre:'Papas fritas Pehuén',  nombre_en:'Pehuén chips',          porcion:'1 bolsa (30g)',     kcal:158, proteinas:2,  carbohidratos:17, grasas:9  },
    { id:'f_doritos',        nombre:'Doritos',              nombre_en:'Doritos',               porcion:'11 chips (28g)',    kcal:140, proteinas:2,  carbohidratos:18, grasas:7  },
    { id:'f_cheetos',        nombre:'Cheetos',              nombre_en:'Cheetos',               porcion:'1 bolsa (28g)',     kcal:150, proteinas:2,  carbohidratos:15, grasas:10 },
    { id:'f_nachos',         nombre:'Nachos / Tostitos',   nombre_en:'Tortilla chips',        porcion:'1 bolsa (28g)',     kcal:135, proteinas:2,  carbohidratos:19, grasas:6  },
    { id:'f_yupi',           nombre:'Papas fritas Yupi',   nombre_en:'Yupi chips',            porcion:'1 bolsa (28g)',     kcal:145, proteinas:2,  carbohidratos:16, grasas:8  },
    { id:'f_pringles_jq',    nombre:'Pringles queso',       nombre_en:'Pringles cheese',       porcion:'14 chips (30g)',    kcal:160, proteinas:2,  carbohidratos:16, grasas:10 },

    // ── CHOCOLATES Y DULCES CHILENOS ─────────────────────────────────────────
    { id:'f_trencito',       nombre:'Trencito (1 barra)',   nombre_en:'Trencito chocolate bar', porcion:'1 barra (50g)',    kcal:250, proteinas:3,  carbohidratos:34, grasas:12 },
    { id:'f_super8',         nombre:'Super 8 (1 unidad)',   nombre_en:'Super 8 wafer bar',     porcion:'1 unidad (30g)',    kcal:145, proteinas:2,  carbohidratos:20, grasas:6  },
    { id:'f_chasqui',        nombre:'Chasqui (1 unidad)',   nombre_en:'Chasqui chocolate',     porcion:'1 unidad (30g)',    kcal:145, proteinas:1,  carbohidratos:22, grasas:6  },
    { id:'f_sahne_nuss',     nombre:'Chocolate Sahne-Nuss (1 onza)',nombre_en:'Sahne-Nuss chocolate',porcion:'30g',         kcal:175, proteinas:3,  carbohidratos:16, grasas:12 },
    { id:'f_choco_leche',    nombre:'Chocolate con leche',  nombre_en:'Milk chocolate',        porcion:'30g (¼ barra)',    kcal:160, proteinas:2,  carbohidratos:18, grasas:10 },
    { id:'f_alfajor',        nombre:'Alfajor',              nombre_en:'Alfajor cookie',        porcion:'1 unidad (50g)',    kcal:200, proteinas:2,  carbohidratos:33, grasas:7  },
    { id:'f_berlines',       nombre:'Berlín / Berlín',      nombre_en:'Berliner donut',        porcion:'1 unidad (80g)',    kcal:310, proteinas:5,  carbohidratos:45, grasas:12 },
    { id:'f_brownie',        nombre:'Brownie',              nombre_en:'Brownie',               porcion:'1 trozo (50g)',     kcal:220, proteinas:3,  carbohidratos:32, grasas:10 },
    { id:'f_caramelos',      nombre:'Caramelos (puñado)',   nombre_en:'Hard candy',            porcion:'5 unidades (20g)', kcal:80,  proteinas:0,  carbohidratos:20, grasas:0  },
    { id:'f_butter_toffee',  nombre:'Butter Toffee (10 unidades)',nombre_en:'Butter toffee candy',porcion:'10 uds (40g)',   kcal:170, proteinas:1,  carbohidratos:33, grasas:4  },
    { id:'f_chupete',        nombre:'Chupete / Paleta',     nombre_en:'Lollipop',              porcion:'1 unidad (17g)',    kcal:70,  proteinas:0,  carbohidratos:17, grasas:0  },
    { id:'f_gomitas',        nombre:'Gomitas / Jelly beans',nombre_en:'Gummy candy',           porcion:'10 unidades (30g)',kcal:105, proteinas:2,  carbohidratos:24, grasas:0  },

    // ── BEBIDAS ESPECIFICAS ──────────────────────────────────────────────────
    { id:'f_milo_bebida',    nombre:'Milo con leche (1 vaso)',nombre_en:'Milo with milk',      porcion:'200ml leche + 20g', kcal:200, proteinas:9,  carbohidratos:27, grasas:7  },
    { id:'f_nesquik_beb',    nombre:'Nesquik con leche (1 vaso)',nombre_en:'Nesquik with milk',porcion:'200ml leche + 15g', kcal:185, proteinas:8,  carbohidratos:28, grasas:5  },
    { id:'f_cocacola',       nombre:'Coca-Cola (lata)',      nombre_en:'Coca-Cola can',         porcion:'350ml (1 lata)',    kcal:140, proteinas:0,  carbohidratos:39, grasas:0  },
    { id:'f_cocacola_zero',  nombre:'Coca-Cola Zero (lata)', nombre_en:'Coke Zero can',        porcion:'350ml (1 lata)',    kcal:0,   proteinas:0,  carbohidratos:0,  grasas:0  },
    { id:'f_pepsi',          nombre:'Pepsi (lata)',          nombre_en:'Pepsi can',             porcion:'350ml (1 lata)',    kcal:150, proteinas:0,  carbohidratos:41, grasas:0  },
    { id:'f_sprite',         nombre:'Sprite / 7UP (lata)',   nombre_en:'Sprite / 7UP can',     porcion:'350ml (1 lata)',    kcal:140, proteinas:0,  carbohidratos:38, grasas:0  },
    { id:'f_bilz',           nombre:'Bilz (lata)',           nombre_en:'Bilz soda',             porcion:'350ml (1 lata)',    kcal:145, proteinas:0,  carbohidratos:40, grasas:0  },
    { id:'f_gatorade',       nombre:'Gatorade (botella)',    nombre_en:'Gatorade',              porcion:'500ml',             kcal:130, proteinas:0,  carbohidratos:34, grasas:0  },
    { id:'f_powerade',       nombre:'Powerade (botella)',    nombre_en:'Powerade',              porcion:'500ml',             kcal:120, proteinas:0,  carbohidratos:33, grasas:0  },
    { id:'f_jugo_andina',    nombre:'Andina del Valle (botella)',nombre_en:'Andina del Valle juice',porcion:'250ml',         kcal:110, proteinas:0,  carbohidratos:28, grasas:0  },
    { id:'f_jugo_watts',     nombre:"Jugo Watt's",          nombre_en:"Watt's juice",          porcion:'200ml',             kcal:90,  proteinas:0,  carbohidratos:23, grasas:0  },
    { id:'f_néctar',         nombre:'Néctar de fruta (200ml)',nombre_en:'Fruit nectar',        porcion:'200ml (1 cajita)', kcal:95,  proteinas:0,  carbohidratos:24, grasas:0  },

    // ── PANES Y MASAS CHILENAS ────────────────────────────────────────────────
    { id:'f_pan_amasado',    nombre:'Pan amasado',          nombre_en:'Pan amasado (Chilean flatbread)',porcion:'1 unidad (70g)',kcal:220,proteinas:5,carbohidratos:40,grasas:5 },
    { id:'f_dobladita',      nombre:'Dobladitas (2 unidades)',nombre_en:'Dobladitas rolls',    porcion:'2 unidades (60g)', kcal:195, proteinas:4,  carbohidratos:35, grasas:5  },
    { id:'f_rosca',          nombre:'Rosca',                nombre_en:'Rosca bread ring',      porcion:'1 unidad (50g)',    kcal:170, proteinas:4,  carbohidratos:32, grasas:3  },
    { id:'f_churro',         nombre:'Churro (1 unidad)',    nombre_en:'Churro',                porcion:'1 unidad (60g)',    kcal:230, proteinas:3,  carbohidratos:34, grasas:9  },

    // ── COMIDAS RÁPIDAS CHILENAS ─────────────────────────────────────────────
    { id:'f_choripan',       nombre:'Choripán',             nombre_en:'Chorizo sandwich',      porcion:'1 unidad',          kcal:420, proteinas:16, carbohidratos:40, grasas:22 },
    { id:'f_barros_luco',    nombre:'Barros Luco',          nombre_en:'Barros Luco sandwich',  porcion:'1 unidad',          kcal:480, proteinas:32, carbohidratos:38, grasas:22 },
    { id:'f_barros_jarpa',   nombre:'Barros Jarpa',         nombre_en:'Barros Jarpa sandwich', porcion:'1 unidad',          kcal:430, proteinas:26, carbohidratos:38, grasas:18 },
    { id:'f_lomo_pobre',     nombre:'Lomo a lo pobre',      nombre_en:'Lomo a lo pobre',       porcion:'1 porción',         kcal:680, proteinas:40, carbohidratos:55, grasas:28 },
    { id:'f_arrollado',      nombre:'Arrollado de huaso',   nombre_en:'Arrollado de huaso',    porcion:'100g',              kcal:250, proteinas:18, carbohidratos:1,  grasas:20 },
    { id:'f_prieta',         nombre:'Prieta (2 unidades)',  nombre_en:'Blood sausage',         porcion:'2 unidades (100g)', kcal:300, proteinas:14, carbohidratos:6,  grasas:26 },
    { id:'f_anticucho',      nombre:'Anticucho (2 pinchos)',nombre_en:'Anticucho skewers',     porcion:'2 pinchos (120g)', kcal:240, proteinas:22, carbohidratos:6,  grasas:14 },

    // ── POSTRES Y LÁCTEOS DE CONSUMO MASIVO ──────────────────────────────────
    { id:'f_danette',        nombre:'Danette chocolate',    nombre_en:'Danette chocolate pudding',porcion:'1 unidad (110g)',kcal:120, proteinas:4,  carbohidratos:19, grasas:3  },
    { id:'f_flan_soprole',   nombre:'Flan Soprole',         nombre_en:'Soprole flan',          porcion:'1 unidad (115g)',   kcal:130, proteinas:4,  carbohidratos:24, grasas:2  },
    { id:'f_natilla',        nombre:'Natilla',              nombre_en:'Natilla pudding',        porcion:'1 unidad (100g)',   kcal:140, proteinas:4,  carbohidratos:21, grasas:5  },
    { id:'f_yogurt_yogs',    nombre:'Yogurt Yogs (frutado)',nombre_en:'Yogs fruit yogurt',      porcion:'1 unidad (100g)',   kcal:90,  proteinas:3,  carbohidratos:17, grasas:1  },
    { id:'f_helado_palito',  nombre:'Helado de palito',     nombre_en:'Popsicle / ice lolly',  porcion:'1 unidad (70g)',    kcal:80,  proteinas:0,  carbohidratos:20, grasas:0  },
    { id:'f_helado_pote',    nombre:'Helado (pote familiar)',nombre_en:'Ice cream tub',        porcion:'2 bolas (100g)',    kcal:200, proteinas:3,  carbohidratos:27, grasas:10 },
    { id:'f_manjar',         nombre:'Manjar / Dulce de leche',nombre_en:'Dulce de leche',      porcion:'1 cda (20g)',       kcal:65,  proteinas:1,  carbohidratos:13, grasas:1  },
    { id:'f_mermelada',      nombre:'Mermelada',            nombre_en:'Jam / Jelly',           porcion:'1 cda (20g)',       kcal:55,  proteinas:0,  carbohidratos:14, grasas:0  },

  ];

  console.log('[Foods DB] Cargada: ' + window.FOODS_DB.length + ' alimentos');
})();
