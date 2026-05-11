/* ============================================
   Calibrate — Recetas Extra (ampliación 2026 #2)
   +40 recetas adicionales enfocadas en cerrar gaps de proteínas:
   - Carne de res (cortes variados): +12
   - Cerdo (totalmente ausente antes): +10
   - Pescado blanco (merluza/reineta/congrio/corvina): +8
   - Mariscos (camarón/choro/calamar): +5
   - Pollo (cortes nuevos: muslo/contramuslo/alas): +5
   ============================================ */

(function agregarRecetasExtra2() {
  if (typeof RECETAS_DB === 'undefined') {
    console.warn('[Recipes Extra 2] RECETAS_DB no disponible');
    return;
  }

  // Helpers para mantener el archivo compacto
  const ing = (nombre, normalizado, display, cantidad, unidad, unidad_compra, factor, descripcion) => ({
    nombre, nombre_normalizado: normalizado, nombre_display: display,
    cantidad_base: cantidad, unidad, unidad_compra, factor_conversion: factor, descripcion_compra: descripcion
  });

  // Ingredientes recurrentes
  const IG = {
    aceite_oliva: (c=15) => ing("aceite de oliva", "aceite_oliva", "Aceite de oliva", c, "ml", "botellas", 500, "botella de 500ml"),
    aceite_vegetal: (c=15) => ing("aceite vegetal", "aceite_vegetal", "Aceite vegetal", c, "ml", "botellas", 1000, "botella de 1L"),
    sal: (c=3) => ing("sal", "sal", "Sal", c, "g", "paquetes", 1000, "paquete de 1kg"),
    pimienta: (c=1) => ing("pimienta negra", "pimienta", "Pimienta negra", c, "g", "frascos", 50, "frasco de 50g"),
    ajo: (c=2) => ing("ajo", "ajo", "Ajo", c, "dientes", "cabezas", 10, "cabeza (~10 dientes)"),
    cebolla: (c=1) => ing("cebolla", "cebolla", "Cebolla", c, "unidad", "kg", 5, "~5 unidades por kg"),
    cebolla_morada: (c=0.5) => ing("cebolla morada", "cebolla_morada", "Cebolla morada", c, "unidad", "kg", 5, "~5 unidades por kg"),
    tomate: (c=2) => ing("tomate", "tomate", "Tomate", c, "unidades", "kg", 5, "~5 unidades por kg"),
    zanahoria: (c=1) => ing("zanahoria", "zanahoria", "Zanahoria", c, "unidad", "kg", 7, "~7 unidades por kg"),
    pimiento_rojo: (c=0.5) => ing("pimiento rojo", "pimiento_rojo", "Pimiento rojo", c, "unidad", "kg", 5, "~5 unidades por kg"),
    pimiento_verde: (c=0.5) => ing("pimiento verde", "pimiento_verde", "Pimiento verde", c, "unidad", "kg", 5, "~5 unidades por kg"),
    papa: (c=200) => ing("papa", "papa", "Papa", c, "g", "kg", 1000, "kg"),
    arroz: (c=70) => ing("arroz blanco", "arroz", "Arroz blanco", c, "g", "paquetes", 1000, "paquete de 1kg"),
    arroz_integral: (c=70) => ing("arroz integral", "arroz_integral", "Arroz integral", c, "g", "paquetes", 1000, "paquete de 1kg"),
    perejil: (c=5) => ing("perejil fresco", "perejil", "Perejil", c, "g", "manojos", 30, "manojo ~30g"),
    cilantro: (c=5) => ing("cilantro fresco", "cilantro", "Cilantro", c, "g", "manojos", 30, "manojo ~30g"),
    limon: (c=1) => ing("limón", "limon", "Limón", c, "unidad", "kg", 8, "~8 unidades por kg"),
    comino: (c=2) => ing("comino molido", "comino", "Comino", c, "g", "frascos", 50, "frasco de 50g"),
    paprika: (c=3) => ing("paprika ahumada", "paprika", "Paprika ahumada", c, "g", "frascos", 50, "frasco de 50g"),
    vino_blanco: (c=80) => ing("vino blanco seco", "vino_blanco", "Vino blanco", c, "ml", "botellas", 750, "botella de 750ml"),
    vino_tinto: (c=80) => ing("vino tinto seco", "vino_tinto", "Vino tinto", c, "ml", "botellas", 750, "botella de 750ml"),
    caldo_carne: (c=300) => ing("caldo de carne", "caldo_carne", "Caldo de carne", c, "ml", "cajas", 1000, "caja de 1L"),
    caldo_pollo: (c=300) => ing("caldo de pollo", "caldo_pollo", "Caldo de pollo", c, "ml", "cajas", 1000, "caja de 1L"),
    caldo_verduras: (c=300) => ing("caldo de verduras", "caldo_verduras", "Caldo de verduras", c, "ml", "cajas", 1000, "caja de 1L"),
    salsa_soya: (c=15) => ing("salsa de soya", "salsa_soya", "Salsa de soya", c, "ml", "botellas", 500, "botella de 500ml"),
    jengibre: (c=5) => ing("jengibre fresco", "jengibre", "Jengibre", c, "g", "unidades", 100, "raíz ~100g"),
    cilantro_seco: (c=2) => ing("cilantro seco", "cilantro_seco", "Cilantro seco", c, "g", "frascos", 50, "frasco de 50g"),
    oregano: (c=2) => ing("orégano seco", "oregano", "Orégano", c, "g", "frascos", 50, "frasco de 50g"),
    mantequilla: (c=15) => ing("mantequilla", "mantequilla", "Mantequilla", c, "g", "barras", 250, "barra de 250g"),
    harina: (c=20) => ing("harina de trigo", "harina", "Harina", c, "g", "paquetes", 1000, "paquete de 1kg"),
    azucar: (c=10) => ing("azúcar rubia", "azucar", "Azúcar", c, "g", "paquetes", 1000, "paquete de 1kg"),
    miel: (c=15) => ing("miel de abeja", "miel", "Miel", c, "ml", "frascos", 500, "frasco de 500ml"),
    mostaza_dijon: (c=15) => ing("mostaza dijon", "mostaza_dijon", "Mostaza dijon", c, "g", "frascos", 200, "frasco de 200g"),
    apio: (c=2) => ing("apio", "apio", "Apio", c, "tallos", "manojos", 10, "manojo de ~10 tallos"),
    laurel: (c=2) => ing("hoja de laurel", "laurel", "Laurel", c, "unidades", "frascos", 30, "frasco ~30 hojas"),
    palta: (c=0.5) => ing("palta", "palta", "Palta", c, "unidad", "unidades", 1, "unidad"),
    porotos_verdes: (c=120) => ing("porotos verdes", "porotos_verdes", "Porotos verdes", c, "g", "bolsas", 500, "bolsa de 500g"),
    brocoli: (c=150) => ing("brócoli", "brocoli", "Brócoli", c, "g", "unidades", 400, "unidad de ~400g"),
    coliflor: (c=150) => ing("coliflor", "coliflor", "Coliflor", c, "g", "unidades", 600, "unidad de ~600g"),
    espinaca: (c=80) => ing("espinaca fresca", "espinaca", "Espinaca", c, "g", "bolsas", 200, "bolsa de 200g"),
    palmitos: (c=80) => ing("palmitos en conserva", "palmitos", "Palmitos", c, "g", "frascos", 400, "frasco de 400g"),
    calabacin: (c=150) => ing("zapallo italiano (calabacín)", "calabacin", "Calabacín", c, "g", "unidades", 300, "unidad ~300g"),
    berenjena: (c=200) => ing("berenjena", "berenjena", "Berenjena", c, "g", "unidades", 300, "unidad ~300g"),
    tortillas_maiz: (c=3) => ing("tortillas de maíz", "tortillas_maiz", "Tortillas de maíz", c, "unidades", "paquetes", 12, "paquete de 12"),
    pan_marraqueta: (c=1) => ing("pan marraqueta", "pan_marraqueta", "Pan marraqueta", c, "unidad", "unidades", 1, "unidad ~80g"),
  };

  const NUEVAS_ALMUERZOS = [
    // ============= CARNE DE RES (cortes variados) =============
    {
      id: "a33",
      nombre: "Lomo liso al horno con papas rústicas",
      tipo_comida: "almuerzo",
      calorias_base: 680, proteinas_g: 48, carbohidratos_g: 52, grasas_g: 28,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        ing("lomo liso de res", "lomo_liso", "Lomo liso", 180, "g", "bandejas", 500, "bandeja de 500g"),
        IG.papa(300),
        IG.ajo(3),
        IG.aceite_oliva(20),
        ing("romero fresco", "romero", "Romero", 3, "g", "manojos", 20, "manojo ~20g"),
        IG.paprika(3),
        IG.sal(4), IG.pimienta(2),
        IG.mostaza_dijon(10)
      ],
      instrucciones: [
        "Precalentar el horno a 200°C. Sacar los 180 g de lomo liso del refrigerador 30 min antes para que tome temperatura ambiente.",
        "Lavar los 300 g de papa y cortarla en cubos irregulares de 3 cm (con cáscara). Disponer en bandeja para horno.",
        "Mezclar las papas con 10 ml de aceite de oliva, 2 g de paprika, 2 g de sal, romero picado y 1 ajo machacado. Hornear 25 minutos.",
        "Mientras, secar bien el lomo con papel absorbente. Sazonar generosamente con sal, pimienta y 1 g de paprika por ambos lados.",
        "Calentar 10 ml de aceite en sartén pesada a fuego alto hasta que humee. Sellar el lomo 2 minutos por cada cara (4 caras) hasta dorar.",
        "Untar la parte superior del lomo con 10 g de mostaza dijon y los 2 ajos restantes picados muy finos.",
        "Pasar el lomo a la bandeja con las papas (que ya llevan 25 min) y hornear todo junto 12-15 minutos más para término medio (62°C internos).",
        "Sacar y dejar reposar el lomo 5 minutos cubierto con papel aluminio antes de cortar en medallones de 1.5 cm.",
        "Emplatar el lomo en abanico con las papas rústicas al costado."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "a34",
      nombre: "Asado de tira braseado al vino tinto",
      tipo_comida: "almuerzo",
      calorias_base: 720, proteinas_g: 46, carbohidratos_g: 38, grasas_g: 38,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        ing("asado de tira", "asado_tira", "Asado de tira", 200, "g", "bandejas", 800, "bandeja de 800g"),
        IG.zanahoria(2),
        IG.cebolla(1),
        IG.apio(2),
        IG.ajo(4),
        IG.vino_tinto(150),
        IG.caldo_carne(400),
        IG.laurel(2),
        ing("tomillo seco", "tomillo", "Tomillo seco", 2, "g", "frascos", 50, "frasco de 50g"),
        IG.aceite_vegetal(15),
        IG.harina(15),
        IG.papa(200),
        IG.sal(4), IG.pimienta(2)
      ],
      instrucciones: [
        "Secar los 200 g de asado de tira con papel absorbente. Sazonar con sal, pimienta y enharinar ligeramente con 15 g de harina.",
        "Calentar 15 ml de aceite en olla pesada (fondo grueso) a fuego alto. Sellar el asado 4 minutos por lado hasta dorar bien. Retirar.",
        "En la misma olla, bajar a fuego medio y sofreír la cebolla, zanahoria y apio cortados en mirepoix (cubos 1 cm) por 8 minutos.",
        "Añadir los 4 ajos picados, cocinar 1 minuto sin quemar.",
        "Subir el fuego, verter 150 ml de vino tinto y desglasar raspando el fondo con cuchara de madera. Reducir 4 minutos hasta que casi se evapore.",
        "Devolver el asado de tira a la olla. Añadir los 400 ml de caldo caliente, las 2 hojas de laurel y 2 g de tomillo. El líquido debe cubrir 3/4 de la carne.",
        "Llevar a hervor suave, tapar y bajar a fuego mínimo (o pasar al horno a 160°C). Brasear 1 hora 45 minutos hasta que la carne se desprenda del hueso.",
        "Los últimos 30 minutos añadir los 200 g de papa cortada en cuartos.",
        "Retirar la carne y las papas. Colar la salsa y reducir 5 minutos a fuego alto hasta que napee la cuchara.",
        "Emplatar el asado de tira con papas, napar con la salsa reducida."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "a35",
      nombre: "Bife a lo pobre",
      tipo_comida: "almuerzo",
      calorias_base: 780, proteinas_g: 52, carbohidratos_g: 56, grasas_g: 36,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        ing("bife de res (lomo vetado)", "lomo_vetado", "Lomo vetado", 180, "g", "bandejas", 500, "bandeja de 500g"),
        ing("huevos", "huevo", "Huevos", 2, "unidades", "docenas", 12, "docena"),
        IG.papa(250),
        IG.cebolla(1),
        IG.aceite_vegetal(30),
        IG.sal(4), IG.pimienta(2)
      ],
      instrucciones: [
        "Cortar los 250 g de papa en bastones de 1 cm. Sumergir en agua fría 10 minutos para retirar exceso de almidón. Secar muy bien.",
        "Calentar 20 ml de aceite en sartén honda a fuego medio-alto. Freír las papas en tandas 6-7 minutos hasta dorar. Escurrir sobre papel absorbente y salar.",
        "Cortar la cebolla en juliana fina. En sartén con 5 ml de aceite cocinar a fuego medio 8 minutos hasta caramelizar. Reservar tapada.",
        "Sazonar el bife con sal y pimienta. Calentar plancha o sartén pesada a fuego alto hasta humear.",
        "Sellar el bife 2-3 minutos por lado para término medio. Retirar y dejar reposar 3 minutos en plato caliente.",
        "En la misma sartén con 5 ml de aceite freír los 2 huevos manteniendo la yema líquida (2 minutos).",
        "Emplatar: bife al centro, papas fritas a un lado, cebolla caramelizada encima del bife, los huevos fritos coronando el bife."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "a36",
      nombre: "Posta negra con puré de zapallo",
      tipo_comida: "almuerzo",
      calorias_base: 650, proteinas_g: 50, carbohidratos_g: 48, grasas_g: 24,
      es_sin_gluten: true, es_sin_lactosa: false, es_vegetariana: false,
      ingredientes: [
        ing("posta negra de res", "posta_negra", "Posta negra", 200, "g", "bandejas", 800, "bandeja de 800g"),
        ing("zapallo butternut", "zapallo", "Zapallo", 300, "g", "unidades", 1200, "unidad ~1.2kg"),
        IG.cebolla(1),
        IG.ajo(3),
        IG.vino_tinto(100),
        IG.caldo_carne(400),
        ing("salsa de tomate", "salsa_tomate", "Salsa de tomate", 80, "ml", "tarros", 400, "tarro de 400ml"),
        IG.aceite_vegetal(15),
        IG.mantequilla(10),
        IG.sal(4), IG.pimienta(2),
        IG.laurel(1)
      ],
      instrucciones: [
        "Atar la posta negra con hilo de cocina para que mantenga forma. Sazonar con sal y pimienta.",
        "Calentar 15 ml de aceite en olla profunda a fuego alto. Sellar la posta 3 min por cada lado (4 lados) hasta caramelizar uniformemente. Retirar.",
        "Bajar fuego a medio. Sofreír la cebolla picada fina 5 minutos. Añadir los 3 ajos machacados 1 minuto.",
        "Verter el vino tinto, desglasar 3 minutos. Añadir la salsa de tomate y el caldo de carne caliente. Agregar laurel.",
        "Volver a poner la posta, debe estar casi cubierta. Llevar a hervor, tapar y bajar al mínimo. Brasear 2 horas dándole vuelta cada 30 minutos.",
        "Mientras, pelar el zapallo, cortar en cubos de 3 cm y hervir en agua con sal 20 minutos hasta que esté muy tierno.",
        "Escurrir y aplastar con tenedor o mixer con 10 g de mantequilla, sal y pimienta hasta puré suave.",
        "Retirar la posta, desatar y cortar en rodajas gruesas (1.5 cm) en contra de la fibra.",
        "Colar la salsa y reducir a fuego alto 5 minutos hasta espesar.",
        "Emplatar el puré, encima las rodajas de posta y napar con la salsa."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "a37",
      nombre: "Sobrecostilla a la cacerola",
      tipo_comida: "almuerzo",
      calorias_base: 690, proteinas_g: 46, carbohidratos_g: 44, grasas_g: 32,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        ing("sobrecostilla de res", "sobrecostilla", "Sobrecostilla", 200, "g", "bandejas", 700, "bandeja de 700g"),
        IG.cebolla(1),
        IG.ajo(3),
        IG.zanahoria(2),
        IG.pimiento_rojo(0.5),
        IG.tomate(2),
        IG.papa(250),
        IG.caldo_carne(400),
        IG.aceite_vegetal(15),
        IG.comino(2),
        IG.oregano(2),
        IG.sal(4), IG.pimienta(2)
      ],
      instrucciones: [
        "Cortar los 200 g de sobrecostilla en trozos de 3 cm. Sazonar con sal, pimienta, 1 g comino y 1 g orégano.",
        "Calentar 15 ml de aceite en olla a presión o cacerola pesada a fuego alto. Sellar los trozos 4 minutos hasta dorar todos los lados. Retirar.",
        "Bajar a fuego medio. Sofreír cebolla picada, pimiento rojo en cubos y zanahoria en rodajas por 8 minutos.",
        "Añadir los 3 ajos picados y los 2 tomates rallados (sin piel). Cocinar 5 minutos hasta deshacer.",
        "Devolver la carne. Añadir 400 ml de caldo y 1 g comino. Llevar a hervor.",
        "Si usás olla a presión: tapar y cocinar 35 minutos desde que pita. Si es cacerola: tapar y cocinar a fuego bajo 1h 30 min.",
        "Los últimos 20 min añadir los 250 g de papa cortada en cuartos.",
        "Rectificar sal. Servir directo de la cacerola con la papa y abundante salsa."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "a38",
      nombre: "Plateada al horno con verduras asadas",
      tipo_comida: "almuerzo",
      calorias_base: 700, proteinas_g: 48, carbohidratos_g: 40, grasas_g: 34,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        ing("plateada de res", "plateada", "Plateada", 200, "g", "bandejas", 800, "bandeja de 800g"),
        IG.papa(250),
        IG.zanahoria(2),
        IG.cebolla(1),
        IG.ajo(4),
        ing("cerveza negra", "cerveza", "Cerveza negra", 200, "ml", "botellas", 330, "botella de 330ml"),
        IG.caldo_carne(300),
        IG.mostaza_dijon(15),
        IG.aceite_oliva(15),
        IG.oregano(2),
        ing("hoja de laurel", "laurel", "Laurel", 2, "unidades", "frascos", 30, "frasco ~30 hojas"),
        IG.sal(4), IG.pimienta(2)
      ],
      instrucciones: [
        "Precalentar horno a 160°C. Secar la plateada con papel y sazonar generosamente con sal, pimienta y 1 g de orégano.",
        "Calentar 15 ml de aceite en fuente para horno (que vaya al fuego) a fuego alto. Sellar la plateada 4 min por lado hasta dorar (3 lados grasos).",
        "Retirar la carne. En la misma fuente sofreír cebolla en juliana, 4 ajos enteros aplastados, zanahoria en rodajas por 5 minutos.",
        "Verter los 200 ml de cerveza negra, raspar el fondo. Reducir 3 minutos hasta que casi se evapore.",
        "Añadir 300 ml de caldo, 15 g de mostaza dijon, laurel y 1 g de orégano. Mezclar.",
        "Devolver la plateada con el lado graso hacia arriba. Tapar con papel aluminio y hornear 2 horas 30 minutos.",
        "Mientras tanto cortar las papas en cuartos. A los 90 min de horno, agregar las papas a la fuente.",
        "Los últimos 30 min destapar para dorar la parte superior.",
        "Sacar la plateada, dejar reposar 10 min y cortar en lonjas finas en contra de la fibra.",
        "Servir con las papas y verduras de cocción, regado con los jugos de la fuente."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "a39",
      nombre: "Punta de paleta al jugo con arroz",
      tipo_comida: "almuerzo",
      calorias_base: 660, proteinas_g: 50, carbohidratos_g: 56, grasas_g: 22,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        ing("punta de paleta de res", "punta_paleta", "Punta de paleta", 200, "g", "bandejas", 700, "bandeja de 700g"),
        IG.arroz(70),
        IG.cebolla(1),
        IG.ajo(3),
        IG.tomate(2),
        IG.pimiento_rojo(0.5),
        IG.caldo_carne(400),
        IG.aceite_vegetal(15),
        IG.comino(2),
        IG.cilantro(8),
        IG.sal(4), IG.pimienta(2)
      ],
      instrucciones: [
        "Cortar los 200 g de punta de paleta en cubos de 3 cm. Sazonar con sal, pimienta y 1 g comino.",
        "Calentar 15 ml de aceite en olla a fuego alto. Sellar los cubos 5 minutos hasta dorar bien todos los lados. Retirar.",
        "Bajar a fuego medio. Sofreír cebolla picada, pimiento rojo en cubos por 7 minutos.",
        "Añadir 3 ajos picados, 2 tomates rallados sin piel y 1 g comino. Cocinar 5 minutos hasta formar sofrito espeso.",
        "Devolver la carne con sus jugos. Cubrir con 400 ml de caldo caliente.",
        "Llevar a hervor, tapar y cocinar a fuego bajo 1 hora 30 minutos hasta que la carne se deshaga al pincharla.",
        "Mientras, lavar 70 g de arroz, sofreírlo en olla con 5 ml de aceite y un ajo picado. Añadir 140 ml de agua hirviendo con sal. Tapar y cocinar 18 minutos a fuego mínimo.",
        "Reducir la salsa de la carne 5 minutos sin tapa si está muy líquida.",
        "Picar cilantro fresco. Servir el arroz con la punta de paleta al jugo encima y cilantro espolvoreado."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "a40",
      nombre: "Carne mechada con puré",
      tipo_comida: "almuerzo",
      calorias_base: 640, proteinas_g: 48, carbohidratos_g: 52, grasas_g: 22,
      es_sin_gluten: true, es_sin_lactosa: false, es_vegetariana: false,
      ingredientes: [
        ing("carne de res para mechar (huachalomo)", "huachalomo", "Huachalomo", 200, "g", "bandejas", 700, "bandeja de 700g"),
        IG.papa(300),
        ing("leche descremada", "leche_descremada", "Leche descremada", 80, "ml", "cajas", 1000, "caja de 1L"),
        IG.cebolla(1),
        IG.ajo(3),
        IG.zanahoria(2),
        IG.tomate(2),
        IG.caldo_carne(500),
        IG.aceite_vegetal(15),
        IG.mantequilla(10),
        IG.paprika(3),
        IG.sal(4), IG.pimienta(2)
      ],
      instrucciones: [
        "Sazonar el huachalomo con sal, pimienta y 1 g paprika. Calentar 15 ml de aceite en olla a presión a fuego alto y sellar la carne 4 min por lado.",
        "Retirar la carne. Sofreír cebolla, zanahoria en rodajas y 3 ajos picados por 6 minutos.",
        "Añadir tomate rallado y 1 g paprika. Cocinar 4 minutos hasta deshacer.",
        "Devolver la carne. Cubrir con 500 ml de caldo. Tapar olla a presión y cocinar 50 minutos desde que pita (en cacerola común: 2h 30min).",
        "Mientras, pelar las papas y hervir en agua con sal 20 minutos hasta tiernas. Escurrir.",
        "Aplastar las papas con prensapuré junto con 80 ml de leche caliente, 10 g de mantequilla y sal. Mantener tibio.",
        "Sacar la carne tibia. Con dos tenedores, deshilachar (mechar) en hebras grandes.",
        "Colar el caldo de cocción, reducir 5 min hasta espesar y devolver la carne mechada a la salsa.",
        "Emplatar el puré como cama y encima la carne mechada con su salsa."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "a41",
      nombre: "Salpicón de carne chileno",
      tipo_comida: "almuerzo",
      calorias_base: 580, proteinas_g: 45, carbohidratos_g: 42, grasas_g: 22,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        ing("posta paleta o carne magra", "carne_res", "Carne de res magra", 180, "g", "bandejas", 500, "bandeja de 500g"),
        ing("papas medianas", "papa", "Papa", 250, "g", "kg", 1000, "kg"),
        IG.cebolla_morada(1),
        IG.tomate(2),
        IG.cilantro(10),
        IG.limon(2),
        IG.aceite_oliva(15),
        ing("ají verde", "aji_verde", "Ají verde", 0.5, "unidad", "unidades", 1, "unidad"),
        IG.sal(4), IG.pimienta(2),
        IG.laurel(2)
      ],
      instrucciones: [
        "Poner los 180 g de carne en olla con agua que la cubra, sal, laurel y media cebolla. Hervir suave 1 hora hasta que pinche fácil.",
        "Retirar la carne, enfriar y deshilachar en hebras finas con las manos o dos tenedores.",
        "Hervir las papas con cáscara en agua con sal 20 min. Enfriar, pelar y cortar en cubos de 2 cm.",
        "Cortar cebolla morada en pluma fina y dejar en agua con limón 10 minutos para desflemar. Escurrir.",
        "Cortar tomates en cubos, picar cilantro y ají sin pepas finamente.",
        "En bowl grande mezclar la carne deshilachada, papas, cebolla, tomate, ají y cilantro.",
        "Aliñar con 30 ml de jugo de limón, 15 ml de aceite de oliva, sal y pimienta. Mezclar bien.",
        "Refrigerar mínimo 30 minutos antes de servir. Probar y rectificar sal/limón."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "a42",
      nombre: "Anticuchos de res al pisco",
      tipo_comida: "almuerzo",
      calorias_base: 620, proteinas_g: 48, carbohidratos_g: 44, grasas_g: 24,
      es_sin_gluten: false, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        ing("punta picana o lomo vetado", "lomo_vetado", "Lomo vetado", 180, "g", "bandejas", 500, "bandeja de 500g"),
        IG.aceite_oliva(15),
        ing("ají panca pasta", "aji_panca", "Ají panca pasta", 20, "g", "frascos", 200, "frasco de 200g"),
        ing("pisco", "pisco", "Pisco", 30, "ml", "botellas", 750, "botella de 750ml"),
        IG.ajo(4),
        IG.comino(3),
        ing("vinagre tinto", "vinagre", "Vinagre tinto", 15, "ml", "botellas", 500, "botella de 500ml"),
        IG.papa(200),
        ing("choclo (maíz)", "choclo", "Choclo", 100, "g", "unidades", 200, "unidad ~200g"),
        IG.sal(4), IG.pimienta(2),
        IG.oregano(2)
      ],
      instrucciones: [
        "Cortar los 180 g de lomo vetado en cubos de 3 cm.",
        "Preparar marinada: 20 g de ají panca, 4 ajos machacados, 3 g comino, 30 ml pisco, 15 ml vinagre, 15 ml aceite de oliva, 2 g orégano, sal y pimienta. Mezclar.",
        "Marinar la carne en la mezcla 30 minutos a 2 horas en refrigerador.",
        "Ensartar los cubos en palitos para anticucho (3-4 cubos por palito).",
        "Hervir las papas con cáscara 20 minutos hasta tiernas. Cortar en mitades.",
        "Hervir el choclo desgranado 5 minutos en agua con sal hasta tierno.",
        "Calentar plancha o sartén grill a fuego alto. Asar los anticuchos 2-3 minutos por cada uno de los 4 lados hasta dorar y término medio dentro.",
        "Pincelar los últimos 30 segundos con la marinada sobrante.",
        "Servir los anticuchos con las papas hervidas y el choclo. Acompañar con ají amarillo opcional."
      ],
      instrucciones_thermomix: []
    },
    // ============= CERDO (todos nuevos) =============
    {
      id: "a43",
      nombre: "Pulpa de cerdo al horno con manzana",
      tipo_comida: "almuerzo",
      calorias_base: 660, proteinas_g: 46, carbohidratos_g: 52, grasas_g: 28,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        ing("pulpa de cerdo", "pulpa_cerdo", "Pulpa de cerdo", 200, "g", "bandejas", 800, "bandeja de 800g"),
        ing("manzana verde", "manzana", "Manzana", 1, "unidad", "kg", 5, "~5 unidades por kg"),
        IG.papa(250),
        IG.cebolla(1),
        IG.ajo(3),
        IG.aceite_oliva(15),
        IG.mostaza_dijon(15),
        IG.miel(15),
        ing("tomillo seco", "tomillo", "Tomillo", 2, "g", "frascos", 50, "frasco de 50g"),
        ing("vino blanco seco", "vino_blanco", "Vino blanco", 100, "ml", "botellas", 750, "botella de 750ml"),
        IG.sal(4), IG.pimienta(2)
      ],
      instrucciones: [
        "Precalentar horno a 190°C. Secar la pulpa de cerdo. Sazonar con sal, pimienta y 1 g tomillo.",
        "Mezclar 15 g mostaza dijon con 15 ml miel y untar la pulpa por toda la superficie.",
        "Calentar 10 ml aceite en sartén pesada a fuego alto. Sellar el cerdo 3 minutos por cada lado (3-4 lados) hasta caramelizar.",
        "Pasar a fuente para horno. Alrededor disponer la papa en cuartos, cebolla en gajos, manzana sin corazón en cuartos, 3 ajos enteros aplastados.",
        "Rociar las verduras y manzana con 5 ml de aceite, sal, pimienta y 1 g tomillo. Verter 100 ml de vino blanco al fondo de la fuente.",
        "Hornear 35 minutos. A media cocción rociar con los jugos del fondo.",
        "Verificar cocción: temperatura interna 65°C. Reposar 5 min antes de cortar.",
        "Cortar en lonjas y servir con la guarnición de papa, manzana asada y los jugos."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "a44",
      nombre: "Lomo de cerdo glaseado con piña",
      tipo_comida: "almuerzo",
      calorias_base: 640, proteinas_g: 44, carbohidratos_g: 58, grasas_g: 22,
      es_sin_gluten: false, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        ing("lomo de cerdo", "lomo_cerdo", "Lomo de cerdo", 180, "g", "bandejas", 600, "bandeja de 600g"),
        ing("piña fresca", "pina", "Piña", 150, "g", "unidades", 1500, "unidad ~1.5kg"),
        IG.arroz(70),
        IG.salsa_soya(20),
        IG.miel(20),
        IG.jengibre(5),
        IG.ajo(3),
        IG.aceite_vegetal(15),
        ing("vinagre de arroz", "vinagre_arroz", "Vinagre de arroz", 15, "ml", "botellas", 500, "botella de 500ml"),
        IG.cilantro(5),
        IG.sal(2), IG.pimienta(1)
      ],
      instrucciones: [
        "Cortar el lomo de cerdo en cubos de 3 cm. Sazonar con sal y pimienta.",
        "Preparar glaseado: mezclar 20 ml salsa soya, 20 ml miel, 5 g jengibre rallado, 3 ajos picados y 15 ml vinagre de arroz.",
        "Cortar la piña en cubos de 2 cm.",
        "Lavar el arroz, cocinar en 140 ml de agua con sal 18 min a fuego mínimo, tapado.",
        "Calentar 15 ml aceite en sartén o wok a fuego alto. Saltear el cerdo 4 minutos hasta dorar todos los lados.",
        "Añadir la piña, saltear 2 minutos.",
        "Verter el glaseado, reducir fuego a medio y cocinar 4 minutos hasta que la salsa espese y caramelice el cerdo.",
        "Servir sobre cama de arroz con cilantro picado por encima."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "a45",
      nombre: "Costillar de cerdo a la cerveza con choclo",
      tipo_comida: "almuerzo",
      calorias_base: 720, proteinas_g: 42, carbohidratos_g: 50, grasas_g: 36,
      es_sin_gluten: false, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        ing("costillar de cerdo", "costilla_cerdo", "Costillar de cerdo", 250, "g", "bandejas", 1200, "bandeja de 1.2kg"),
        ing("cerveza rubia", "cerveza", "Cerveza", 250, "ml", "botellas", 330, "botella de 330ml"),
        ing("choclo (maíz)", "choclo", "Choclo", 150, "g", "unidades", 200, "unidad ~200g"),
        IG.papa(150),
        ing("salsa BBQ", "salsa_bbq", "Salsa BBQ", 30, "g", "frascos", 350, "frasco de 350g"),
        IG.miel(15),
        IG.ajo(3),
        IG.paprika(3),
        IG.comino(2),
        IG.sal(4), IG.pimienta(2),
        IG.aceite_vegetal(10)
      ],
      instrucciones: [
        "Precalentar horno a 160°C. Frotar el costillar con mezcla seca: 2 g paprika, 2 g comino, 3 ajos pulverizados, sal y pimienta.",
        "Colocar el costillar en fuente. Verter los 250 ml de cerveza al fondo. Tapar herméticamente con papel aluminio.",
        "Hornear 1 hora 45 minutos hasta que la carne ceda al pincharla.",
        "Mientras, preparar glaseado: mezclar 30 g salsa BBQ, 15 ml miel y 1 g paprika.",
        "Hervir las papas con cáscara y los choclos en agua con sal 20 minutos.",
        "Retirar el aluminio del costillar, pincelar generosamente con el glaseado.",
        "Subir horno a 220°C y hornear 15 minutos hasta que el glaseado caramelice. Pincelar otra vez a los 8 min.",
        "Cortar el costillar entre los huesos. Servir con papas en cuartos y choclo cortado en rodajas."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "a46",
      nombre: "Chuletas de cerdo con puré de manzana",
      tipo_comida: "almuerzo",
      calorias_base: 620, proteinas_g: 42, carbohidratos_g: 48, grasas_g: 26,
      es_sin_gluten: true, es_sin_lactosa: false, es_vegetariana: false,
      ingredientes: [
        ing("chuleta de cerdo (con hueso)", "chuleta_cerdo", "Chuleta de cerdo", 200, "g", "unidades", 250, "unidad ~250g c/u"),
        ing("manzana", "manzana", "Manzana", 2, "unidades", "kg", 5, "~5 unidades por kg"),
        IG.papa(200),
        ing("canela en rama", "canela", "Canela", 1, "g", "frascos", 50, "frasco de 50g"),
        IG.mantequilla(10),
        IG.aceite_oliva(15),
        ing("salvia seca", "salvia", "Salvia", 2, "g", "frascos", 30, "frasco de 30g"),
        IG.ajo(2),
        IG.azucar(10),
        IG.sal(4), IG.pimienta(2)
      ],
      instrucciones: [
        "Pelar y cortar las 2 manzanas en cubos de 2 cm. En cacerola pequeña, cocinar con 10 g de azúcar, 1 g canela y 30 ml agua a fuego bajo 15 minutos hasta deshacer.",
        "Triturar con tenedor para puré rústico. Mantener tibio.",
        "Pelar las papas, cortar en cubos y hervir 18 minutos en agua con sal. Escurrir y aplastar con 10 g mantequilla y sal.",
        "Secar las chuletas con papel. Sazonar con sal, pimienta, 1 g salvia.",
        "Calentar 15 ml aceite en sartén pesada a fuego alto. Cuando humee, agregar las chuletas y 2 ajos enteros aplastados.",
        "Cocinar 4 minutos por lado hasta dorar y temperatura interna 63°C. Bañar con los jugos durante la cocción.",
        "Retirar y reposar 3 minutos en plato caliente.",
        "Emplatar la chuleta junto al puré de papa y una porción del puré de manzana al costado."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "a47",
      nombre: "Pulpa de cerdo al ajillo con porotos verdes",
      tipo_comida: "almuerzo",
      calorias_base: 580, proteinas_g: 44, carbohidratos_g: 32, grasas_g: 28,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        ing("pulpa de cerdo en cubos", "pulpa_cerdo", "Pulpa de cerdo", 200, "g", "bandejas", 800, "bandeja de 800g"),
        IG.porotos_verdes(200),
        IG.ajo(6),
        IG.aceite_oliva(25),
        IG.vino_blanco(80),
        ing("guindilla seca (ají cacho de cabra)", "aji_seco", "Ají seco", 1, "unidad", "paquetes", 30, "paquete ~30 unidades"),
        IG.papa(200),
        IG.perejil(8),
        IG.sal(4), IG.pimienta(2),
        IG.limon(0.5)
      ],
      instrucciones: [
        "Cortar la pulpa de cerdo en cubos de 2.5 cm. Sazonar con sal y pimienta.",
        "Cortar las puntas de los porotos verdes y hervir en agua con sal 5 minutos. Escurrir y reservar en agua fría.",
        "Hervir las papas con cáscara 20 minutos. Cortar en rodajas de 1 cm.",
        "Calentar 15 ml aceite en sartén grande a fuego alto. Saltear el cerdo 6 minutos hasta dorar todos los lados.",
        "Bajar a fuego medio. Añadir 5 ajos en láminas y el ají seco quebrado. Sofreír 1 minuto sin quemar.",
        "Verter 80 ml de vino blanco, raspar el fondo. Reducir 3 minutos.",
        "Añadir los porotos verdes y las papas en rodajas. Saltear 3 minutos para integrar sabores.",
        "Espolvorear con perejil picado, rociar con 10 ml de aceite de oliva crudo y un toque de limón. Servir caliente."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "a48",
      nombre: "Cerdo agridulce con vegetales y arroz",
      tipo_comida: "almuerzo",
      calorias_base: 690, proteinas_g: 38, carbohidratos_g: 78, grasas_g: 22,
      es_sin_gluten: false, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        ing("pulpa de cerdo magra", "pulpa_cerdo", "Pulpa de cerdo", 180, "g", "bandejas", 800, "bandeja de 800g"),
        IG.arroz(80),
        IG.pimiento_rojo(0.5),
        IG.pimiento_verde(0.5),
        ing("piña en conserva", "pina", "Piña en conserva", 80, "g", "tarros", 400, "tarro de 400g"),
        IG.cebolla(0.5),
        ing("salsa de tomate ketchup", "ketchup", "Ketchup", 30, "ml", "botellas", 500, "botella de 500ml"),
        IG.salsa_soya(15),
        ing("vinagre de arroz", "vinagre_arroz", "Vinagre", 20, "ml", "botellas", 500, "botella de 500ml"),
        IG.azucar(15),
        ing("maicena", "maicena", "Maicena", 10, "g", "paquetes", 250, "paquete de 250g"),
        IG.aceite_vegetal(20),
        IG.ajo(2), IG.jengibre(5)
      ],
      instrucciones: [
        "Cortar el cerdo en cubos de 2 cm. Sazonar con sal y rebozar con 5 g de maicena.",
        "Cocinar 80 g de arroz en 160 ml de agua con sal 18 min a fuego mínimo, tapado.",
        "Cortar los pimientos rojo y verde en cubos de 2 cm, la cebolla en pétalos, la piña en cubos.",
        "Preparar salsa: mezclar 30 ml ketchup, 15 ml salsa soya, 20 ml vinagre, 15 g azúcar, 80 ml agua y 5 g maicena disuelta. Reservar.",
        "Calentar 15 ml aceite en wok a fuego alto. Freír el cerdo 5 minutos hasta dorar y cocinar bien. Retirar.",
        "En el mismo wok con 5 ml de aceite saltear ajo y jengibre picados 30 segundos.",
        "Añadir cebolla y pimientos. Saltear 2 minutos a fuego alto manteniendo crocantes.",
        "Devolver el cerdo, agregar la piña y verter la salsa. Cocinar 2 minutos hasta que la salsa espese y brille.",
        "Servir sobre cama de arroz."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "a49",
      nombre: "Cazuela de cerdo con zapallo",
      tipo_comida: "almuerzo",
      calorias_base: 580, proteinas_g: 42, carbohidratos_g: 56, grasas_g: 18,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        ing("pulpa de cerdo magra", "pulpa_cerdo", "Pulpa de cerdo", 180, "g", "bandejas", 800, "bandeja de 800g"),
        ing("zapallo butternut", "zapallo", "Zapallo", 200, "g", "unidades", 1200, "unidad ~1.2kg"),
        IG.papa(150),
        ing("choclo (maíz)", "choclo", "Choclo", 100, "g", "unidades", 200, "unidad ~200g"),
        ing("porotos verdes", "porotos_verdes", "Porotos verdes", 80, "g", "bolsas", 500, "bolsa de 500g"),
        IG.cebolla(0.5),
        IG.zanahoria(1),
        IG.arroz(30),
        IG.ajo(2),
        IG.aceite_vegetal(15),
        IG.comino(2),
        IG.cilantro(8),
        IG.sal(4)
      ],
      instrucciones: [
        "Cortar la pulpa de cerdo en cubos de 3 cm. Sazonar con sal y 1 g comino.",
        "En olla grande, calentar 15 ml de aceite y sellar el cerdo 5 minutos hasta dorar.",
        "Añadir cebolla picada y 2 ajos picados. Sofreír 5 minutos.",
        "Cubrir con 1.2 L de agua caliente y sal. Llevar a hervor.",
        "Añadir zapallo en cubos grandes (4 cm), papa en cuartos, zanahoria en rodajas gruesas, el choclo cortado en 2-3 rodajas.",
        "Cocinar a fuego medio-bajo 35 minutos hasta que el cerdo esté tierno.",
        "Añadir los porotos verdes cortados en trozos y los 30 g de arroz. Cocinar 15 minutos más.",
        "Rectificar sal. Servir en plato hondo con cilantro picado encima."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "a50",
      nombre: "Albóndigas de cerdo en salsa de tomate",
      tipo_comida: "almuerzo",
      calorias_base: 640, proteinas_g: 40, carbohidratos_g: 56, grasas_g: 26,
      es_sin_gluten: false, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        ing("carne molida de cerdo", "cerdo_molido", "Cerdo molido", 180, "g", "bandejas", 500, "bandeja de 500g"),
        ing("pan rallado", "pan_rallado", "Pan rallado", 30, "g", "paquetes", 300, "paquete de 300g"),
        ing("huevo", "huevo", "Huevo", 1, "unidad", "docenas", 12, "docena"),
        IG.cebolla(0.5),
        IG.ajo(3),
        ing("salsa de tomate", "salsa_tomate", "Salsa de tomate", 250, "ml", "tarros", 400, "tarro de 400ml"),
        ing("pasta corta", "pasta", "Pasta corta", 80, "g", "paquetes", 500, "paquete de 500g"),
        IG.aceite_oliva(15),
        IG.oregano(2),
        ing("albahaca fresca", "albahaca", "Albahaca", 5, "g", "plantas", 30, "planta ~30g"),
        IG.sal(4), IG.pimienta(2)
      ],
      instrucciones: [
        "En bowl mezclar 180 g de cerdo molido, 30 g pan rallado, 1 huevo, cebolla muy picada, 1 ajo machacado, sal, pimienta y 1 g orégano. No amasar de más.",
        "Formar 8-10 albóndigas del tamaño de una nuez. Refrigerar 10 minutos para que tomen forma.",
        "Calentar 15 ml aceite en sartén honda a fuego medio. Dorar las albóndigas 5 minutos rotándolas. Retirar.",
        "En la misma sartén, sofreír 2 ajos picados 30 segundos.",
        "Añadir 250 ml salsa de tomate, 1 g orégano, sal, pimienta y 100 ml agua. Hervir suave.",
        "Devolver las albóndigas. Tapar y cocinar a fuego bajo 18 minutos.",
        "Mientras, cocinar 80 g de pasta en agua hirviendo con sal según paquete. Escurrir.",
        "Servir la pasta con las albóndigas y abundante salsa. Espolvorear albahaca picada."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "a51",
      nombre: "Cerdo asado con chimichurri",
      tipo_comida: "almuerzo",
      calorias_base: 660, proteinas_g: 48, carbohidratos_g: 40, grasas_g: 32,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        ing("lomo de cerdo", "lomo_cerdo", "Lomo de cerdo", 200, "g", "bandejas", 600, "bandeja de 600g"),
        IG.papa(250),
        IG.perejil(20),
        IG.ajo(4),
        ing("ají molido", "aji_molido", "Ají molido", 2, "g", "frascos", 50, "frasco de 50g"),
        IG.aceite_oliva(40),
        ing("vinagre de vino tinto", "vinagre", "Vinagre tinto", 15, "ml", "botellas", 500, "botella de 500ml"),
        IG.oregano(2),
        IG.sal(4), IG.pimienta(2)
      ],
      instrucciones: [
        "Precalentar horno a 200°C. Sazonar el lomo de cerdo con sal, pimienta y 1 g orégano.",
        "Calentar 10 ml de aceite en sartén pesada a fuego alto. Sellar el lomo 3 minutos por lado (4 lados) hasta dorar.",
        "Pasar a fuente para horno. Alrededor disponer las papas en cuartos rociadas con 5 ml de aceite, sal y pimienta.",
        "Hornear 30 minutos hasta que la temperatura interna del cerdo llegue a 65°C.",
        "Mientras preparar chimichurri: picar muy fino 20 g de perejil y 4 ajos. Mezclar en bowl con 30 ml aceite oliva, 15 ml vinagre, 2 g ají molido, 1 g orégano, sal y pimienta.",
        "Dejar reposar el chimichurri 10 minutos para que se integren los sabores.",
        "Retirar el lomo del horno, dejar reposar 5 min y cortar en lonjas de 1.5 cm.",
        "Servir el cerdo con las papas asadas y abundante chimichurri encima."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "a52",
      nombre: "Wrap de cerdo desmechado",
      tipo_comida: "almuerzo",
      calorias_base: 580, proteinas_g: 38, carbohidratos_g: 56, grasas_g: 18,
      es_sin_gluten: false, es_sin_lactosa: false, es_vegetariana: false,
      ingredientes: [
        ing("pulpa de cerdo desmechada (cocida)", "pulpa_cerdo", "Pulpa de cerdo", 150, "g", "bandejas", 800, "bandeja de 800g"),
        ing("tortillas de trigo grandes", "tortillas_trigo", "Tortillas de trigo", 2, "unidades", "paquetes", 8, "paquete de 8"),
        ing("repollo morado", "repollo", "Repollo morado", 60, "g", "unidades", 800, "unidad ~800g"),
        IG.zanahoria(1),
        ing("queso cheddar rallado", "queso_cheddar", "Queso cheddar", 30, "g", "paquetes", 200, "paquete de 200g"),
        ing("yogurt griego natural", "yogurt", "Yogurt griego", 40, "g", "potes", 150, "pote de 150g"),
        ing("salsa BBQ", "salsa_bbq", "Salsa BBQ", 25, "g", "frascos", 350, "frasco de 350g"),
        IG.limon(0.5),
        IG.cilantro(5),
        IG.sal(2), IG.pimienta(1)
      ],
      instrucciones: [
        "Calentar la pulpa de cerdo desmechada en sartén con 25 g salsa BBQ a fuego medio 5 minutos hasta integrar y caramelizar.",
        "Rallar zanahoria, cortar repollo morado en juliana muy fina.",
        "Mezclar repollo y zanahoria con yogurt griego, jugo de medio limón, sal y pimienta para coleslaw rápido.",
        "Calentar las tortillas 20 segundos por lado en sartén seca.",
        "Armar wraps: en cada tortilla colocar la mitad de la pulpa BBQ, encima coleslaw, queso cheddar y cilantro picado.",
        "Enrollar apretado doblando los lados primero. Cortar en diagonal y servir."
      ],
      instrucciones_thermomix: []
    },
    // ============= PESCADO BLANCO =============
    {
      id: "a53",
      nombre: "Merluza al horno con tomate y aceitunas",
      tipo_comida: "almuerzo",
      calorias_base: 540, proteinas_g: 42, carbohidratos_g: 48, grasas_g: 18,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        ing("filete de merluza", "merluza", "Merluza", 200, "g", "bandejas", 400, "bandeja de 400g"),
        IG.papa(250),
        IG.tomate(2),
        ing("aceitunas negras", "aceitunas", "Aceitunas negras", 30, "g", "frascos", 200, "frasco de 200g"),
        IG.cebolla(0.5),
        IG.ajo(3),
        IG.aceite_oliva(20),
        IG.vino_blanco(60),
        IG.perejil(8),
        IG.limon(0.5),
        IG.oregano(2),
        IG.sal(3), IG.pimienta(1)
      ],
      instrucciones: [
        "Precalentar horno a 190°C. Pelar y cortar las papas en rodajas finas (3 mm).",
        "En fuente para horno aceitada, disponer las papas como cama. Sazonar con sal, pimienta y 5 ml aceite oliva.",
        "Hornear las papas solas 20 minutos hasta que comiencen a dorar.",
        "Mientras, cortar los tomates en rodajas, la cebolla en pluma fina. Picar 3 ajos y deshuesar las aceitunas.",
        "Sazonar la merluza con sal, pimienta y 1 g orégano.",
        "Sobre las papas pre-cocidas disponer: cebolla, rodajas de tomate, la merluza encima. Rociar con 60 ml vino blanco, aceitunas, ajo picado, 1 g orégano, 15 ml aceite oliva.",
        "Hornear 18-20 minutos hasta que la merluza esté opaca y se desmenuce.",
        "Espolvorear perejil picado y exprimir medio limón antes de servir."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "a54",
      nombre: "Reineta a la mantequilla con espárragos",
      tipo_comida: "almuerzo",
      calorias_base: 520, proteinas_g: 40, carbohidratos_g: 38, grasas_g: 22,
      es_sin_gluten: true, es_sin_lactosa: false, es_vegetariana: false,
      ingredientes: [
        ing("filete de reineta", "reineta", "Reineta", 200, "g", "bandejas", 400, "bandeja de 400g"),
        ing("espárragos verdes", "esparragos", "Espárragos", 150, "g", "manojos", 250, "manojo de 250g"),
        ing("arroz basmati", "arroz", "Arroz basmati", 70, "g", "paquetes", 1000, "paquete de 1kg"),
        IG.mantequilla(20),
        IG.ajo(2),
        IG.limon(1),
        ing("alcaparras", "alcaparras", "Alcaparras", 10, "g", "frascos", 100, "frasco de 100g"),
        IG.perejil(8),
        IG.harina(15),
        IG.sal(3), IG.pimienta(1)
      ],
      instrucciones: [
        "Lavar 70 g de arroz basmati, cocinar en 140 ml de agua con sal 15 minutos a fuego mínimo tapado.",
        "Cortar las puntas duras de los espárragos. Hervir 4 minutos en agua con sal, escurrir y reservar.",
        "Sazonar la reineta con sal y pimienta. Pasar por harina sacudiendo el exceso.",
        "Calentar 10 g mantequilla en sartén grande a fuego medio. Cuando burbujee colocar la reineta con la piel hacia abajo (si tiene).",
        "Cocinar 3 minutos sin mover. Voltear cuidadosamente y cocinar 2 minutos más. Retirar a plato caliente.",
        "En la misma sartén derretir los 10 g restantes de mantequilla con 2 ajos picados, 30 segundos sin quemar.",
        "Añadir el jugo de 1 limón, 10 g alcaparras y los espárragos. Saltear 1 minuto.",
        "Devolver la reineta a la sartén, bañar con la salsa.",
        "Servir sobre el arroz basmati, decorar con perejil picado."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "a55",
      nombre: "Congrio frito con ensalada chilena",
      tipo_comida: "almuerzo",
      calorias_base: 580, proteinas_g: 38, carbohidratos_g: 42, grasas_g: 26,
      es_sin_gluten: false, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        ing("filete de congrio", "congrio", "Congrio", 200, "g", "bandejas", 400, "bandeja de 400g"),
        IG.harina(30),
        ing("huevo", "huevo", "Huevo", 1, "unidad", "docenas", 12, "docena"),
        IG.papa(200),
        IG.tomate(2),
        IG.cebolla(0.5),
        IG.cilantro(8),
        IG.aceite_vegetal(40),
        IG.aceite_oliva(10),
        IG.limon(1),
        IG.sal(4), IG.pimienta(2)
      ],
      instrucciones: [
        "Cortar el congrio en porciones. Sazonar con sal, pimienta y un poco de jugo de limón. Dejar 10 min.",
        "Hervir las papas con cáscara 20 minutos. Pelar y cortar en cubos o rodajas. Mantener tibias.",
        "Picar cebolla en pluma fina y dejar en agua fría con sal 5 minutos. Escurrir.",
        "Cortar los tomates en cuadritos. Mezclar con la cebolla escurrida, sal, 10 ml aceite oliva, cilantro picado y unas gotas de limón. Es la ensalada chilena.",
        "Pasar los trozos de congrio por harina, luego huevo batido (apanado simple).",
        "Calentar 40 ml de aceite en sartén honda a fuego medio-alto. Freír el congrio 3 minutos por lado hasta dorado y cocido. Escurrir sobre papel.",
        "Servir el congrio frito con papas, ensalada chilena al costado y rodajas de limón."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "a56",
      nombre: "Corvina al vapor con verduras",
      tipo_comida: "almuerzo",
      calorias_base: 460, proteinas_g: 40, carbohidratos_g: 38, grasas_g: 12,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        ing("filete de corvina", "corvina", "Corvina", 200, "g", "bandejas", 400, "bandeja de 400g"),
        ing("arroz integral", "arroz_integral", "Arroz integral", 70, "g", "paquetes", 1000, "paquete de 1kg"),
        ing("zanahoria", "zanahoria", "Zanahoria", 1, "unidad", "kg", 7, "~7 unidades por kg"),
        IG.brocoli(120),
        IG.jengibre(8),
        IG.salsa_soya(15),
        IG.aceite_oliva(10),
        IG.limon(0.5),
        IG.cilantro(5),
        IG.ajo(2),
        IG.sal(3), IG.pimienta(1)
      ],
      instrucciones: [
        "Lavar 70 g de arroz integral, cocinar en 180 ml de agua con sal 30 minutos tapado a fuego mínimo.",
        "Cortar brócoli en florcitas pequeñas, zanahoria en bastones finos.",
        "Sazonar la corvina con sal, pimienta y rodajas de jengibre fresco encima.",
        "Preparar la vaporera o usar olla con rejilla y agua hirviendo abajo. Colocar primero zanahoria y brócoli 3 minutos.",
        "Añadir la corvina sobre las verduras. Tapar y cocinar al vapor 7-8 minutos hasta que el pescado esté opaco.",
        "Mientras, mezclar 15 ml salsa soya, 10 ml aceite oliva, jugo de medio limón y 2 ajos picados.",
        "Emplatar la corvina sobre cama de arroz integral con las verduras al costado. Rociar con la salsa de soya-limón.",
        "Espolvorear cilantro picado."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "a57",
      nombre: "Tacos de pescado blanco con repollo",
      tipo_comida: "almuerzo",
      calorias_base: 580, proteinas_g: 36, carbohidratos_g: 56, grasas_g: 20,
      es_sin_gluten: false, es_sin_lactosa: false, es_vegetariana: false,
      ingredientes: [
        ing("filete de merluza o reineta", "merluza", "Merluza", 200, "g", "bandejas", 400, "bandeja de 400g"),
        IG.tortillas_maiz(3),
        ing("repollo morado", "repollo", "Repollo morado", 80, "g", "unidades", 800, "unidad ~800g"),
        IG.cebolla_morada(0.25),
        IG.cilantro(8),
        IG.limon(1.5),
        IG.palta(0.5),
        ing("yogurt griego natural", "yogurt", "Yogurt griego", 40, "g", "potes", 150, "pote de 150g"),
        IG.paprika(2),
        IG.comino(2),
        IG.harina(15),
        IG.aceite_vegetal(15),
        IG.sal(3), IG.pimienta(1)
      ],
      instrucciones: [
        "Cortar el pescado en tiras de 2 cm de grosor. Sazonar con sal, pimienta, 1 g paprika, 1 g comino.",
        "Pasar por harina sacudiendo el exceso.",
        "Cortar repollo en juliana muy fina, cebolla morada en pluma. Mezclar con jugo de medio limón y una pizca de sal.",
        "Aplastar la palta con tenedor, sazonar con jugo de medio limón, sal y pimienta.",
        "Mezclar yogurt griego con 1 g paprika, 1 g comino y un toque de limón.",
        "Calentar 15 ml aceite en sartén a fuego medio-alto. Freír el pescado 2 min por lado hasta dorado y cocido. Escurrir.",
        "Calentar las tortillas en sartén seca 20 segundos por lado.",
        "Armar tacos: tortilla, palta, pescado, repollo aliñado, salsa de yogurt, cilantro picado y un toque más de limón."
      ],
      instrucciones_thermomix: []
    },
    // ============= MARISCOS =============
    {
      id: "a58",
      nombre: "Camarones al ajillo con arroz blanco",
      tipo_comida: "almuerzo",
      calorias_base: 560, proteinas_g: 38, carbohidratos_g: 58, grasas_g: 18,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        ing("camarones pelados", "camaron", "Camarones", 180, "g", "bandejas", 500, "bandeja de 500g"),
        IG.arroz(80),
        IG.ajo(6),
        IG.aceite_oliva(30),
        ing("guindilla seca", "aji_seco", "Ají seco", 1, "unidad", "paquetes", 30, "paquete ~30 unidades"),
        IG.perejil(10),
        IG.limon(0.5),
        IG.vino_blanco(50),
        IG.sal(3), IG.pimienta(1)
      ],
      instrucciones: [
        "Lavar 80 g de arroz, cocinar en 160 ml de agua con sal 18 minutos a fuego mínimo tapado.",
        "Secar bien los camarones con papel absorbente. Sazonar con sal y pimienta.",
        "Calentar 30 ml de aceite de oliva en sartén grande a fuego medio. Añadir 6 ajos cortados en láminas finas.",
        "Cuando los ajos empiecen a dorar (no quemar) añadir el ají seco quebrado en trozos.",
        "Subir el fuego a alto y añadir los camarones. Saltear 2 minutos hasta que se vuelvan rosados.",
        "Verter 50 ml de vino blanco, dejar evaporar 1 minuto.",
        "Apagar el fuego, añadir perejil picado y jugo de medio limón.",
        "Servir sobre cama de arroz blanco, rociando con todo el aceite aromático de la sartén."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "a59",
      nombre: "Choros a la marinera",
      tipo_comida: "almuerzo",
      calorias_base: 480, proteinas_g: 32, carbohidratos_g: 42, grasas_g: 16,
      es_sin_gluten: false, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        ing("choros frescos", "choros", "Choros", 500, "g", "kg", 1000, "kg"),
        IG.cebolla(1),
        IG.ajo(4),
        IG.tomate(1),
        IG.vino_blanco(150),
        IG.aceite_oliva(20),
        IG.perejil(15),
        ing("pan marraqueta", "pan_marraqueta", "Pan marraqueta", 1, "unidad", "unidades", 1, "unidad ~80g"),
        IG.paprika(2),
        IG.sal(3), IG.pimienta(1),
        IG.limon(0.5)
      ],
      instrucciones: [
        "Limpiar los 500 g de choros: raspar la cáscara y quitar las barbas tirando hacia abajo. Descartar los que estén abiertos y no se cierren al golpear.",
        "Picar cebolla muy fina, 4 ajos picados y rallar 1 tomate sin piel.",
        "Calentar 20 ml de aceite en olla grande con tapa a fuego medio. Sofreír cebolla 5 min hasta transparente.",
        "Añadir ajo 1 min, luego tomate rallado y 1 g paprika. Cocinar 3 min hasta deshacer.",
        "Verter los 150 ml de vino blanco, llevar a hervor.",
        "Añadir los choros, tapar inmediatamente. Cocinar 5-6 minutos sacudiendo la olla un par de veces.",
        "Cuando todos los choros estén abiertos están listos. Descartar los que no se abran.",
        "Espolvorear perejil picado y jugo de medio limón.",
        "Servir en plato hondo con el caldo de la cocción y el pan marraqueta tostado para sopear."
      ],
      instrucciones_thermomix: []
    }
  ];

  const NUEVAS_CENAS = [
    // ============= POLLO (cortes nuevos: muslo, contramuslo, alas) =============
    {
      id: "c33",
      nombre: "Muslos de pollo al horno con limón y romero",
      tipo_comida: "cena",
      calorias_base: 540, proteinas_g: 42, carbohidratos_g: 38, grasas_g: 22,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        ing("muslos de pollo deshuesados", "muslo_pollo", "Muslos de pollo", 200, "g", "bandejas", 800, "bandeja de 800g"),
        IG.papa(200),
        IG.limon(1),
        IG.ajo(4),
        ing("romero fresco", "romero", "Romero", 4, "g", "manojos", 20, "manojo ~20g"),
        IG.aceite_oliva(20),
        IG.paprika(3),
        IG.sal(3), IG.pimienta(1),
        IG.mostaza_dijon(10)
      ],
      instrucciones: [
        "Precalentar horno a 200°C. Secar los 200 g de muslos con papel absorbente.",
        "En bowl mezclar 15 ml aceite oliva, 4 ajos picados, ralladura y jugo de 1 limón, romero picado, 2 g paprika, 10 g mostaza dijon, sal y pimienta.",
        "Untar los muslos con la mezcla y dejar marinar 15 minutos.",
        "Cortar las papas en cubos de 3 cm. Mezclar con 5 ml de aceite, sal, 1 g paprika.",
        "Disponer las papas en bandeja para horno. Colocar los muslos encima con la piel hacia arriba.",
        "Hornear 35-40 minutos hasta que el pollo esté dorado y las papas tiernas. A media cocción rociar con los jugos.",
        "Subir el grill los últimos 3 minutos para crocantizar la piel.",
        "Servir con rodajas de limón fresco."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "c34",
      nombre: "Contramuslos de pollo al curry con coliflor",
      tipo_comida: "cena",
      calorias_base: 560, proteinas_g: 42, carbohidratos_g: 36, grasas_g: 26,
      es_sin_gluten: true, es_sin_lactosa: false, es_vegetariana: false,
      ingredientes: [
        ing("contramuslos de pollo deshuesados", "contramuslo_pollo", "Contramuslos de pollo", 200, "g", "bandejas", 800, "bandeja de 800g"),
        IG.coliflor(200),
        ing("leche de coco", "leche_coco", "Leche de coco", 150, "ml", "tarros", 400, "tarro de 400ml"),
        IG.cebolla(0.5),
        IG.ajo(3),
        IG.jengibre(10),
        ing("curry en polvo", "curry", "Curry en polvo", 8, "g", "frascos", 50, "frasco de 50g"),
        ing("tomate", "tomate", "Tomate", 1, "unidad", "kg", 5, "~5 unidades por kg"),
        IG.cilantro(8),
        IG.arroz(60),
        IG.aceite_vegetal(15),
        IG.sal(3), IG.pimienta(1)
      ],
      instrucciones: [
        "Cocinar 60 g de arroz en 120 ml de agua con sal 18 min a fuego mínimo, tapado.",
        "Cortar los contramuslos en cubos de 3 cm. Sazonar con sal y pimienta.",
        "Cortar la coliflor en florcitas pequeñas. Picar cebolla, 3 ajos y 10 g jengibre.",
        "Calentar 15 ml aceite en sartén honda a fuego medio-alto. Dorar el pollo 5 minutos por todos lados.",
        "Bajar a fuego medio. Añadir cebolla, ajo y jengibre. Sofreír 3 minutos.",
        "Añadir 8 g curry, tostar 1 minuto sin quemar. Agregar tomate rallado, 3 minutos.",
        "Verter 150 ml leche de coco. Añadir la coliflor. Tapar y cocinar 15 minutos a fuego medio-bajo.",
        "Rectificar sal. Espolvorear cilantro picado.",
        "Servir sobre el arroz."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "c35",
      nombre: "Alitas de pollo BBQ al horno",
      tipo_comida: "cena",
      calorias_base: 580, proteinas_g: 38, carbohidratos_g: 44, grasas_g: 26,
      es_sin_gluten: false, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        ing("alitas de pollo", "alas_pollo", "Alitas de pollo", 250, "g", "bandejas", 1000, "bandeja de 1kg"),
        IG.papa(200),
        ing("salsa BBQ", "salsa_bbq", "Salsa BBQ", 50, "g", "frascos", 350, "frasco de 350g"),
        IG.miel(15),
        IG.salsa_soya(15),
        IG.ajo(3),
        IG.paprika(3),
        ing("sésamo blanco", "sesamo", "Sésamo", 5, "g", "frascos", 100, "frasco de 100g"),
        IG.aceite_vegetal(10),
        IG.sal(3), IG.pimienta(1)
      ],
      instrucciones: [
        "Precalentar horno a 200°C. Cortar las alitas separando las dos articulaciones (drumette y wingette). Descartar la punta.",
        "Secar muy bien con papel. Mezclar con 5 ml aceite, sal, pimienta y 2 g paprika.",
        "Colocar en rejilla sobre bandeja para que escurran. Hornear 25 minutos.",
        "Mientras, mezclar 50 g salsa BBQ, 15 ml miel, 15 ml salsa soya, 3 ajos picados, 1 g paprika.",
        "Cortar las papas en bastones, mezclar con 5 ml aceite y sal. Disponer en otra bandeja, hornear los mismos 25 minutos.",
        "Sacar las alitas y pincelar generosamente con la salsa BBQ.",
        "Hornear 10 minutos más, pincelar de nuevo a los 5 min hasta que caramelicen y broncen.",
        "Espolvorear sésamo. Servir con las papas al horno."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "c36",
      nombre: "Pollo asado entero con vegetales",
      tipo_comida: "cena",
      calorias_base: 620, proteinas_g: 48, carbohidratos_g: 40, grasas_g: 26,
      es_sin_gluten: true, es_sin_lactosa: false, es_vegetariana: false,
      ingredientes: [
        ing("pollo entero", "pollo_entero", "Pollo entero", 350, "g", "unidades", 1500, "pollo ~1.5kg (rinde 4 porciones)"),
        IG.papa(200),
        IG.zanahoria(2),
        IG.cebolla(1),
        IG.ajo(4),
        IG.limon(1),
        ing("romero fresco", "romero", "Romero", 4, "g", "manojos", 20, "manojo ~20g"),
        IG.mantequilla(15),
        IG.aceite_oliva(15),
        IG.sal(5), IG.pimienta(2)
      ],
      instrucciones: [
        "Precalentar horno a 200°C. Sacar el pollo del refrigerador 30 min antes.",
        "Mezclar 15 g mantequilla blanda con 2 ajos machacados, ralladura de limón, romero picado, sal y pimienta.",
        "Despegar la piel del pecho del pollo con los dedos y untar la mantequilla aromatizada debajo. Sazonar exterior con sal y pimienta.",
        "Rellenar la cavidad con el limón cortado en cuartos y 2 ajos enteros.",
        "Atar las patas con hilo. Pincelar el exterior con aceite oliva.",
        "Cortar papas en cuartos, zanahoria en trozos grandes, cebolla en gajos. Disponer en fuente, mezclar con sal, pimienta y 5 ml aceite.",
        "Colocar el pollo encima de las verduras (la grasa cae sobre ellas).",
        "Hornear 1 hora 15 min hasta que la temperatura interna del muslo llegue a 75°C. Cada 25 min bañar con los jugos.",
        "Reposar 10 minutos antes de trinchar. Servir un cuarto del pollo (porción individual) con las verduras."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "c37",
      nombre: "Brochetas de pollo teriyaki",
      tipo_comida: "cena",
      calorias_base: 560, proteinas_g: 42, carbohidratos_g: 54, grasas_g: 14,
      es_sin_gluten: false, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        ing("muslos de pollo deshuesados", "muslo_pollo", "Muslos de pollo", 200, "g", "bandejas", 800, "bandeja de 800g"),
        IG.pimiento_rojo(0.5),
        ing("piña fresca", "pina", "Piña", 100, "g", "unidades", 1500, "unidad ~1.5kg"),
        IG.cebolla(0.5),
        IG.arroz(60),
        IG.salsa_soya(30),
        IG.miel(20),
        IG.jengibre(8),
        IG.ajo(2),
        ing("sésamo blanco", "sesamo", "Sésamo", 5, "g", "frascos", 100, "frasco de 100g"),
        IG.aceite_vegetal(10),
        IG.cilantro(5)
      ],
      instrucciones: [
        "Lavar 60 g de arroz, cocinar en 120 ml de agua con sal 18 min a fuego mínimo.",
        "Cortar el pollo en cubos de 3 cm, pimiento en cuadrados de 3 cm, piña en cubos, cebolla en pétalos.",
        "Preparar salsa teriyaki: 30 ml salsa soya, 20 ml miel, 8 g jengibre rallado, 2 ajos picados y 20 ml agua. Reservar 1/3 para pincelar al final.",
        "Marinar el pollo en los 2/3 de la salsa 15 minutos.",
        "Ensartar en palitos alternando pollo, pimiento, piña, cebolla.",
        "Calentar plancha o sartén grill a fuego medio-alto con 10 ml aceite.",
        "Cocinar las brochetas 4 minutos por lado (8 min total) volteándolas para dorar todos los lados.",
        "Pincelar con la salsa reservada los últimos 2 min para glasear.",
        "Servir sobre el arroz, espolvorear sésamo y cilantro."
      ],
      instrucciones_thermomix: []
    },
    // ============= CARNE DE RES (cenas más livianas) =============
    {
      id: "c38",
      nombre: "Carpaccio de res con rúcula",
      tipo_comida: "cena",
      calorias_base: 420, proteinas_g: 34, carbohidratos_g: 18, grasas_g: 24,
      es_sin_gluten: false, es_sin_lactosa: false, es_vegetariana: false,
      ingredientes: [
        ing("filete de res fresco", "filete_res", "Filete de res", 150, "g", "bandejas", 300, "bandeja de 300g"),
        ing("rúcula fresca", "rucula", "Rúcula", 80, "g", "bolsas", 200, "bolsa de 200g"),
        ing("queso parmesano en lascas", "queso_parmesano", "Parmesano", 30, "g", "paquetes", 200, "paquete de 200g"),
        IG.aceite_oliva(20),
        IG.limon(0.5),
        ing("pan ciabatta", "pan_ciabatta", "Pan ciabatta", 50, "g", "unidades", 250, "unidad de 250g"),
        ing("alcaparras", "alcaparras", "Alcaparras", 10, "g", "frascos", 100, "frasco de 100g"),
        IG.sal(2), IG.pimienta(2)
      ],
      instrucciones: [
        "Envolver el filete de res en film y congelar 1 hora 30 min hasta que esté firme pero no totalmente congelado (facilita el corte).",
        "Con cuchillo muy filoso cortar el filete en láminas lo más finas posibles (1-2 mm).",
        "Disponer las láminas en plato grande extendido, sin superponerlas demasiado.",
        "Sazonar con sal en escamas y pimienta recién molida.",
        "Rociar con 15 ml de aceite de oliva y el jugo de medio limón. Dejar reposar 5 minutos para que se 'cocine' levemente con el ácido.",
        "Distribuir 80 g de rúcula encima, lascas de parmesano y alcaparras.",
        "Tostar el pan ciabatta cortado en rebanadas finas.",
        "Rociar con 5 ml más de aceite de oliva justo antes de servir. Acompañar con el pan tostado."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "c39",
      nombre: "Hamburguesa casera de res con palta",
      tipo_comida: "cena",
      calorias_base: 600, proteinas_g: 38, carbohidratos_g: 42, grasas_g: 30,
      es_sin_gluten: false, es_sin_lactosa: false, es_vegetariana: false,
      ingredientes: [
        ing("carne de res molida", "carne_molida", "Carne de res molida", 180, "g", "bandejas", 500, "bandeja de 500g"),
        ing("pan de hamburguesa integral", "pan_hamburguesa", "Pan de hamburguesa", 1, "unidad", "paquetes", 6, "paquete de 6"),
        IG.palta(0.5),
        ing("tomate", "tomate", "Tomate", 0.5, "unidad", "kg", 5, "~5 unidades por kg"),
        ing("lechuga", "lechuga", "Lechuga", 30, "g", "unidades", 300, "unidad ~300g"),
        ing("cebolla morada", "cebolla_morada", "Cebolla morada", 0.25, "unidad", "kg", 5, "~5 unidades por kg"),
        ing("queso cheddar en láminas", "queso_cheddar", "Queso cheddar", 25, "g", "paquetes", 200, "paquete de 200g"),
        IG.mostaza_dijon(10),
        ing("ketchup", "ketchup", "Ketchup", 15, "ml", "botellas", 500, "botella de 500ml"),
        IG.aceite_vegetal(10),
        IG.sal(3), IG.pimienta(1)
      ],
      instrucciones: [
        "Sazonar la carne molida con sal y pimienta. Mezclar suavemente sin amasar.",
        "Formar una hamburguesa de 1.5 cm de grosor (un poco más grande que el pan). Hacer una hendidura en el centro con el pulgar.",
        "Calentar 10 ml aceite en plancha o sartén pesada a fuego alto.",
        "Cocinar la hamburguesa 3 minutos sin tocar. Voltear, colocar la lámina de queso encima y cocinar 3 minutos más.",
        "Mientras, cortar pan por la mitad y tostar brevemente en la misma sartén con los jugos.",
        "Cortar la palta en láminas, tomate en rodajas, cebolla morada en aros finos.",
        "Untar la base del pan con mostaza y la tapa con ketchup.",
        "Armar: base, lechuga, hamburguesa con queso, palta en láminas, rodajas de tomate, aros de cebolla. Tapar.",
        "Servir inmediatamente, opcionalmente partir por la mitad."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "c40",
      nombre: "Brochetas de res al chimichurri",
      tipo_comida: "cena",
      calorias_base: 540, proteinas_g: 44, carbohidratos_g: 28, grasas_g: 28,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        ing("lomo vetado en cubos", "lomo_vetado", "Lomo vetado", 200, "g", "bandejas", 500, "bandeja de 500g"),
        IG.pimiento_rojo(0.5),
        IG.pimiento_verde(0.5),
        IG.cebolla(0.5),
        ing("champiñones", "champinon", "Champiñones", 80, "g", "bandejas", 200, "bandeja de 200g"),
        IG.papa(150),
        IG.perejil(20),
        IG.ajo(4),
        IG.aceite_oliva(35),
        ing("vinagre de vino tinto", "vinagre", "Vinagre tinto", 15, "ml", "botellas", 500, "botella de 500ml"),
        ing("ají molido", "aji_molido", "Ají molido", 2, "g", "frascos", 50, "frasco de 50g"),
        IG.oregano(2),
        IG.sal(3), IG.pimienta(1)
      ],
      instrucciones: [
        "Hervir las papas con cáscara cortadas en cubos de 3 cm en agua con sal 12 minutos. Escurrir.",
        "Cortar el lomo vetado en cubos de 3 cm. Sazonar con sal y pimienta.",
        "Cortar pimientos en cuadros de 3 cm, cebolla en pétalos, champiñones limpios enteros.",
        "Ensartar alternando: papa, carne, pimiento rojo, cebolla, champiñón, pimiento verde, carne, papa.",
        "Preparar chimichurri: 20 g perejil picado fino, 4 ajos pulverizados, 30 ml aceite oliva, 15 ml vinagre, 2 g ají molido, 1 g orégano, sal y pimienta. Reposar 10 min.",
        "Calentar plancha o sartén grill a fuego medio-alto con 5 ml aceite.",
        "Asar las brochetas 3-4 minutos por cada uno de los 4 lados (12-16 min total) según punto deseado.",
        "Pincelar con chimichurri en los últimos 30 segundos.",
        "Servir las brochetas con el chimichurri restante al lado."
      ],
      instrucciones_thermomix: []
    },
    // ============= CERDO (cenas) =============
    {
      id: "c41",
      nombre: "Solomillo de cerdo con salsa de mostaza",
      tipo_comida: "cena",
      calorias_base: 540, proteinas_g: 44, carbohidratos_g: 32, grasas_g: 24,
      es_sin_gluten: true, es_sin_lactosa: false, es_vegetariana: false,
      ingredientes: [
        ing("solomillo de cerdo (filete)", "filete_cerdo", "Filete de cerdo", 180, "g", "bandejas", 500, "bandeja de 500g"),
        IG.papa(200),
        IG.brocoli(120),
        IG.mostaza_dijon(20),
        ing("crema de leche", "crema", "Crema de leche", 50, "ml", "cajas", 200, "caja de 200ml"),
        IG.caldo_pollo(100),
        IG.aceite_oliva(15),
        IG.mantequilla(10),
        IG.ajo(2),
        ing("eneldo fresco", "eneldo", "Eneldo", 3, "g", "manojos", 20, "manojo ~20g"),
        IG.sal(3), IG.pimienta(1)
      ],
      instrucciones: [
        "Hervir las papas con cáscara cortadas en cubos en agua con sal 18 min. Mantener tibias.",
        "Hervir el brócoli en florcitas 4 min, escurrir y reservar.",
        "Cortar el solomillo en medallones de 2 cm. Sazonar con sal y pimienta.",
        "Calentar 15 ml aceite y 5 g mantequilla en sartén pesada a fuego alto. Sellar los medallones 3 min por lado hasta dorar.",
        "Retirar a plato caliente. Reservar.",
        "En la misma sartén, bajar fuego a medio. Añadir 5 g mantequilla y 2 ajos picados, 30 segundos.",
        "Añadir 100 ml caldo, desglasar. Incorporar 20 g mostaza dijon y 50 ml crema. Reducir 3 minutos hasta espesar.",
        "Devolver el cerdo con sus jugos a la sartén, calentar 1 minuto en la salsa.",
        "Servir con papas, brócoli y la salsa de mostaza. Espolvorear eneldo picado."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "c42",
      nombre: "Cerdo salteado con verduras estilo asiático",
      tipo_comida: "cena",
      calorias_base: 480, proteinas_g: 38, carbohidratos_g: 32, grasas_g: 22,
      es_sin_gluten: false, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        ing("pulpa de cerdo magra", "pulpa_cerdo", "Pulpa de cerdo", 180, "g", "bandejas", 800, "bandeja de 800g"),
        IG.brocoli(120),
        IG.pimiento_rojo(0.5),
        IG.zanahoria(1),
        ing("champiñones", "champinon", "Champiñones", 80, "g", "bandejas", 200, "bandeja de 200g"),
        IG.salsa_soya(20),
        ing("aceite de sésamo", "aceite_sesamo", "Aceite de sésamo", 8, "ml", "botellas", 250, "botella de 250ml"),
        IG.aceite_vegetal(15),
        IG.ajo(3),
        IG.jengibre(8),
        ing("maicena", "maicena", "Maicena", 5, "g", "paquetes", 250, "paquete de 250g"),
        ing("cebollín", "cebollin", "Cebollín", 10, "g", "manojos", 50, "manojo ~50g"),
        ing("sésamo blanco", "sesamo", "Sésamo", 3, "g", "frascos", 100, "frasco de 100g")
      ],
      instrucciones: [
        "Cortar el cerdo en tiras finas de 0.5 cm. Mezclar con 10 ml salsa soya y 5 g maicena. Reposar 5 min.",
        "Cortar el brócoli en florcitas, pimiento en tiras, zanahoria en bastones diagonales, champiñones en cuartos.",
        "Calentar 15 ml aceite vegetal en wok a fuego alto. Saltear el cerdo 3 min hasta dorar. Retirar.",
        "En el mismo wok añadir 3 ajos picados y 8 g jengibre rallado, 30 segundos.",
        "Añadir zanahoria 1 min, luego brócoli y pimiento 2 min, finalmente champiñones 1 min.",
        "Devolver el cerdo. Verter 10 ml salsa soya restante y 8 ml aceite sésamo. Saltear 1 min.",
        "Espolvorear cebollín picado y sésamo.",
        "Servir inmediatamente, opcionalmente sobre fideos o arroz."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "c43",
      nombre: "Pancetas de cerdo crocantes con coliflor",
      tipo_comida: "cena",
      calorias_base: 520, proteinas_g: 32, carbohidratos_g: 28, grasas_g: 30,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        ing("panceta de cerdo (sin curar)", "panceta", "Panceta", 150, "g", "bandejas", 500, "bandeja de 500g"),
        IG.coliflor(250),
        IG.papa(150),
        IG.ajo(3),
        IG.aceite_oliva(15),
        ing("vinagre balsámico", "vinagre", "Vinagre balsámico", 10, "ml", "botellas", 500, "botella de 500ml"),
        ing("tomillo seco", "tomillo", "Tomillo", 2, "g", "frascos", 50, "frasco de 50g"),
        IG.paprika(2),
        IG.sal(3), IG.pimienta(1)
      ],
      instrucciones: [
        "Precalentar horno a 200°C. Cortar la coliflor en florcitas, papa en cubos de 2 cm.",
        "En bandeja para horno mezclar coliflor y papa con 10 ml aceite, 3 ajos picados, sal, pimienta y 1 g tomillo.",
        "Hornear las verduras 25 minutos volteando a mitad.",
        "Mientras, cortar la panceta en lonjas de 0.5 cm. Sazonar con sal, pimienta, paprika y 1 g tomillo.",
        "Calentar sartén seca a fuego medio-alto. Cocinar la panceta 5 minutos por lado en su propia grasa hasta crocante y dorada.",
        "Retirar la panceta a papel absorbente.",
        "Verter el vinagre balsámico sobre la panceta para glasear.",
        "Servir las verduras al horno con la panceta crocante por encima."
      ],
      instrucciones_thermomix: []
    },
    // ============= PESCADOS Y MARISCOS (cenas) =============
    {
      id: "c44",
      nombre: "Merluza apanada en harina de almendra",
      tipo_comida: "cena",
      calorias_base: 480, proteinas_g: 38, carbohidratos_g: 28, grasas_g: 22,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        ing("filete de merluza", "merluza", "Merluza", 200, "g", "bandejas", 400, "bandeja de 400g"),
        ing("harina de almendras", "harina_almendra", "Harina de almendras", 40, "g", "paquetes", 200, "paquete de 200g"),
        ing("huevo", "huevo", "Huevo", 1, "unidad", "docenas", 12, "docena"),
        ing("ensalada mixta", "ensalada", "Ensalada mixta", 100, "g", "bolsas", 200, "bolsa de 200g"),
        IG.limon(1),
        IG.aceite_oliva(20),
        IG.ajo(1),
        IG.paprika(2),
        IG.perejil(5),
        IG.sal(3), IG.pimienta(1)
      ],
      instrucciones: [
        "Cortar la merluza en porciones. Sazonar con sal, pimienta y 1 g paprika.",
        "Mezclar 40 g harina de almendras con 1 g paprika, ajo pulverizado y perejil picado fino.",
        "Batir el huevo en plato hondo.",
        "Pasar cada porción de merluza por huevo, luego cubrir bien con la mezcla de harina de almendras presionando.",
        "Calentar 20 ml aceite oliva en sartén a fuego medio.",
        "Cocinar la merluza 3 minutos por lado hasta dorar y cocido el pescado.",
        "Servir con ensalada mixta aliñada simple (sal, oliva, limón) y rodajas de limón."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "c45",
      nombre: "Reineta a la plancha con quinoa",
      tipo_comida: "cena",
      calorias_base: 520, proteinas_g: 40, carbohidratos_g: 48, grasas_g: 14,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        ing("filete de reineta", "reineta", "Reineta", 200, "g", "bandejas", 400, "bandeja de 400g"),
        ing("quinoa", "quinoa", "Quinoa", 60, "g", "paquetes", 500, "paquete de 500g"),
        IG.tomate(1),
        IG.palta(0.5),
        ing("pepino", "pepino", "Pepino", 0.5, "unidad", "unidades", 1, "unidad"),
        IG.cilantro(8),
        IG.limon(1),
        IG.aceite_oliva(15),
        IG.ajo(1),
        IG.sal(3), IG.pimienta(1)
      ],
      instrucciones: [
        "Enjuagar la quinoa, cocinar en 150 ml de agua con sal 15 min a fuego mínimo. Reposar tapada 5 min.",
        "Cortar tomate, pepino y palta en cubos pequeños. Mezclar con cilantro picado, jugo de medio limón, 5 ml aceite oliva y sal.",
        "Sazonar la reineta con sal, pimienta y ajo pulverizado.",
        "Calentar plancha o sartén a fuego medio-alto con 10 ml aceite oliva.",
        "Cocinar la reineta 3 minutos por lado (empezar por el lado de la piel si tiene) hasta que esté opaca y se desmenuce.",
        "Servir el pescado sobre cama de quinoa, acompañado del salpicón de tomate-palta-pepino.",
        "Rociar con jugo de medio limón."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "c46",
      nombre: "Calamares grillados con limón",
      tipo_comida: "cena",
      calorias_base: 420, proteinas_g: 38, carbohidratos_g: 32, grasas_g: 14,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        ing("calamares limpios (tubos)", "calamar", "Calamares", 250, "g", "bandejas", 500, "bandeja de 500g"),
        ing("rúcula", "rucula", "Rúcula", 60, "g", "bolsas", 200, "bolsa de 200g"),
        IG.papa(200),
        IG.ajo(3),
        IG.aceite_oliva(25),
        IG.limon(1),
        IG.perejil(10),
        ing("ají molido", "aji_molido", "Ají molido", 1, "g", "frascos", 50, "frasco de 50g"),
        IG.sal(3), IG.pimienta(1)
      ],
      instrucciones: [
        "Hervir las papas con cáscara en agua con sal 20 minutos. Cortar en rodajas de 1 cm. Mantener tibias.",
        "Cortar los tubos de calamar abriéndolos en una sola pieza. Hacer cortes diagonales en la superficie interior sin atravesar (cuadriculado).",
        "Sazonar con sal y pimienta. Marinar 10 minutos con 10 ml aceite, ajo picado, ralladura de limón, 1 g ají molido y perejil picado.",
        "Calentar plancha a fuego alto hasta humear.",
        "Asar los calamares 1 minuto por lado (no más, se ponen duros). Se enrollan al cocinarse.",
        "Servir los calamares sobre las papas y la rúcula. Rociar con 15 ml aceite oliva crudo y jugo de medio limón.",
        "Decorar con más perejil picado."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "c47",
      nombre: "Sopa de mariscos con pan",
      tipo_comida: "cena",
      calorias_base: 480, proteinas_g: 34, carbohidratos_g: 48, grasas_g: 14,
      es_sin_gluten: false, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        ing("mix de mariscos (camarones, choros, almejas, calamar)", "mariscos", "Mix de mariscos", 250, "g", "bandejas", 500, "bandeja de 500g"),
        IG.tomate(2),
        IG.cebolla(0.5),
        IG.ajo(4),
        IG.vino_blanco(100),
        IG.caldo_verduras(500),
        IG.papa(100),
        IG.pimiento_rojo(0.5),
        IG.aceite_oliva(20),
        IG.paprika(3),
        IG.perejil(10),
        ing("pan baguette", "pan_baguette", "Pan baguette", 50, "g", "unidades", 300, "unidad de 300g"),
        IG.sal(3), IG.pimienta(1)
      ],
      instrucciones: [
        "Picar cebolla, pimiento rojo y 4 ajos finamente. Cortar papa en cubos de 1.5 cm. Rallar los 2 tomates sin piel.",
        "Calentar 20 ml aceite en olla a fuego medio. Sofreír cebolla y pimiento 5 min. Añadir ajo 1 min.",
        "Agregar tomate rallado y 2 g paprika. Cocinar 4 min hasta deshacer.",
        "Verter 100 ml de vino blanco, dejar evaporar 2 min.",
        "Añadir 500 ml caldo y la papa en cubos. Hervir 10 min hasta que la papa esté casi tierna.",
        "Incorporar los mariscos descongelados y escurridos. Cocinar 4-5 minutos hasta que estén cocidos (camarones rosados, choros abiertos).",
        "Espolvorear 1 g paprika y perejil picado. Rectificar sal y pimienta.",
        "Tostar el pan baguette en rebanadas. Servir la sopa caliente con el pan al lado."
      ],
      instrucciones_thermomix: []
    }
  ];

  // Push todas las recetas al DB
  for (const r of NUEVAS_ALMUERZOS) RECETAS_DB.push(r);
  for (const r of NUEVAS_CENAS) RECETAS_DB.push(r);

  console.log(`[Recipes Extra 2] +${NUEVAS_ALMUERZOS.length} almuerzos, +${NUEVAS_CENAS.length} cenas = +${NUEVAS_ALMUERZOS.length + NUEVAS_CENAS.length} recetas (foco: carne_res, cerdo, pescado blanco, mariscos, cortes nuevos de pollo)`);
})();
