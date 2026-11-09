/* ============================================
   Calibrate — Recetas de despensa chilena (2026-11-09)
   Platos de casa, una olla o sartén, 15 a 35 minutos.
   Se agregan a RECETAS_DB cuando el loader diferido las mezcla,
   antes de generar el plan. Desayuno y snacks también viven aquí
   porque el generador ya lee el pool completo para esas comidas.

   Macros por 1 persona, redondeados, con calorías = 4*p + 4*c + 9*g.
   Gramos de nutriente desde MACROS_100 (equivalencias) y foods-db:
   - Arroz, fideos y lentejas van en peso seco (lo que se compra).
     El nutriente usa el valor cocido por el rendimiento: arroz x3,
     fideos x2.2, lentejas x2.5.
   - Pollo y carne molida van en peso crudo. El nutriente usa el
     valor cocido de foods-db por 0.75 (merma al cocinar).
   - Porotos, garbanzos, choclo, arvejas y atún van en peso escurrido.
   - El zapallo no está en foods-db. Se usó zapallo cocido: 1 g de
     proteína, 5 g de carbohidrato y 0.1 g de grasa por 100 g
     (USDA pumpkin, cooked). El ingrediente ya existía en precios y recetas.
   ============================================ */

(function agregarRecetasDespensa() {
  if (typeof RECETAS_DB === 'undefined') {
    console.warn('[Recipes Despensa] RECETAS_DB no disponible');
    return;
  }

  const RECETAS_DESPENSA = [
  {
    id: "chd1",
    nombre: "Avena con leche",
    tipo_comida: "desayuno",
    calorias_base: 345, proteinas_g: 20, carbohidratos_g: 55, grasas_g: 5,
    es_sin_gluten: false, es_sin_lactosa: false, es_vegetariana: true,
    tiempo_prep_min: 3, tiempo_coccion_min: 8, tiempo_total_min: 11,
    ingredientes: [
      { nombre: "avena en hojuelas", nombre_normalizado: "avena", nombre_display: "Avena en hojuelas", cantidad_base: 60, unidad: "g", unidad_compra: "paquetes", factor_conversion: 500, descripcion_compra: "paquete de 500g" },
      { nombre: "leche descremada", nombre_normalizado: "leche_descremada", nombre_display: "Leche descremada", cantidad_base: 300, unidad: "ml", unidad_compra: "cajas", factor_conversion: 1000, descripcion_compra: "caja de 1L" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 1, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Pon los 300 ml de leche descremada en una olla pequeña. Caliéntala a fuego medio hasta que humee, sin dejarla hervir.",
      "Agrega los 60 g de avena y 1 g de sal. Revuelve para que no se pegue en el fondo.",
      "Cocina 6 minutos a fuego medio-bajo, revolviendo seguido, hasta que la avena espese y la leche se absorba.",
      "Retira la olla del fuego, tapa y deja reposar 2 minutos.",
      "Sirve de inmediato. Si la quieres más suelta, agrega un chorrito de leche fría al servir."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "chd2",
    nombre: "Huevos revueltos con tomate",
    tipo_comida: "desayuno",
    calorias_base: 335, proteinas_g: 21, carbohidratos_g: 11, grasas_g: 23,
    es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: true,
    tiempo_prep_min: 6, tiempo_coccion_min: 8, tiempo_total_min: 14,
    ingredientes: [
      { nombre: "huevos", nombre_normalizado: "huevo", nombre_display: "Huevos", cantidad_base: 3, unidad: "unidades", unidad_compra: "docenas", factor_conversion: 12, descripcion_compra: "docena" },
      { nombre: "tomate", nombre_normalizado: "tomate", nombre_display: "Tomate", cantidad_base: 150, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "cebolla", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 40, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "aceite vegetal", nombre_normalizado: "aceite_vegetal", nombre_display: "Aceite vegetal", cantidad_base: 8, unidad: "ml", unidad_compra: "botellas", factor_conversion: 1000, descripcion_compra: "botella de 1L" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 2, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Pica la cebolla en cubos chicos y el tomate en cubos de 1 cm. Bate los 3 huevos con 1 g de sal.",
      "Calienta los 8 ml de aceite en una sartén a fuego medio. Sofríe la cebolla 3 minutos, hasta que esté transparente.",
      "Agrega el tomate y cocina 3 minutos más, hasta que suelte jugo y se ablande.",
      "Baja el fuego. Vierte los huevos y revuelve con una espátula durante 2 minutos, hasta que cuajen y sigan húmedos.",
      "Prueba la sal y sirve al momento, directo de la sartén."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "chd3",
    nombre: "Pan con huevo y queso",
    tipo_comida: "desayuno",
    calorias_base: 416, proteinas_g: 27, carbohidratos_g: 32, grasas_g: 20,
    es_sin_gluten: false, es_sin_lactosa: false, es_vegetariana: true,
    tiempo_prep_min: 5, tiempo_coccion_min: 8, tiempo_total_min: 13,
    ingredientes: [
      { nombre: "pan integral", nombre_normalizado: "pan_integral", nombre_display: "Pan integral", cantidad_base: 2, unidad: "unidad", unidad_compra: "paquetes", factor_conversion: 12, descripcion_compra: "paquete de ~12 rebanadas" },
      { nombre: "huevos", nombre_normalizado: "huevo", nombre_display: "Huevos", cantidad_base: 2, unidad: "unidades", unidad_compra: "docenas", factor_conversion: 12, descripcion_compra: "docena" },
      { nombre: "quesillo", nombre_normalizado: "queso_fresco", nombre_display: "Quesillo", cantidad_base: 40, unidad: "g", unidad_compra: "paquetes", factor_conversion: 250, descripcion_compra: "paquete de 250g" },
      { nombre: "tomate", nombre_normalizado: "tomate", nombre_display: "Tomate", cantidad_base: 60, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "aceite vegetal", nombre_normalizado: "aceite_vegetal", nombre_display: "Aceite vegetal", cantidad_base: 5, unidad: "ml", unidad_compra: "botellas", factor_conversion: 1000, descripcion_compra: "botella de 1L" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 1, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Corta el tomate en rodajas. Parte el quesillo en láminas. Bate los 2 huevos con 1 g de sal.",
      "Calienta los 5 ml de aceite en una sartén antiadherente a fuego medio-bajo.",
      "Vierte los huevos y cocínalos 2 minutos, revolviendo, hasta que queden cremosos. Retíralos.",
      "Tuesta las 2 rebanadas de pan integral en la misma sartén, 1 minuto por lado.",
      "Arma cada rebanada con quesillo, tomate y huevo revuelto. Sirve de inmediato."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "chd4",
    nombre: "Yogurt natural con avena y huevo",
    tipo_comida: "desayuno",
    calorias_base: 350, proteinas_g: 20, carbohidratos_g: 36, grasas_g: 14,
    es_sin_gluten: false, es_sin_lactosa: false, es_vegetariana: true,
    tiempo_prep_min: 3, tiempo_coccion_min: 10, tiempo_total_min: 13,
    ingredientes: [
      { nombre: "yogurt natural", nombre_normalizado: "yogurt_natural", nombre_display: "Yogurt natural", cantidad_base: 200, unidad: "g", unidad_compra: "potes", factor_conversion: 1000, descripcion_compra: "pote de 1kg" },
      { nombre: "avena en hojuelas", nombre_normalizado: "avena", nombre_display: "Avena en hojuelas", cantidad_base: 40, unidad: "g", unidad_compra: "paquetes", factor_conversion: 500, descripcion_compra: "paquete de 500g" },
      { nombre: "huevos", nombre_normalizado: "huevo", nombre_display: "Huevos", cantidad_base: 1, unidad: "unidades", unidad_compra: "docenas", factor_conversion: 12, descripcion_compra: "docena" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 1, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Pon el huevo en una olla con agua que lo cubra. Cuando hierva, cocina 9 minutos.",
      "Pasa el huevo por agua fría, pélalo y córtalo por la mitad. Agrega una pizca de sal.",
      "Mezcla en un bowl los 200 g de yogurt natural con los 40 g de avena.",
      "Deja reposar 3 minutos para que la avena se humedezca.",
      "Sirve el yogurt con el huevo duro al lado."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "chd5",
    nombre: "Tortilla de zapallo italiano",
    tipo_comida: "desayuno",
    calorias_base: 353, proteinas_g: 21, carbohidratos_g: 11, grasas_g: 25,
    es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: true,
    tiempo_prep_min: 8, tiempo_coccion_min: 12, tiempo_total_min: 20,
    ingredientes: [
      { nombre: "huevos", nombre_normalizado: "huevo", nombre_display: "Huevos", cantidad_base: 3, unidad: "unidades", unidad_compra: "docenas", factor_conversion: 12, descripcion_compra: "docena" },
      { nombre: "zapallo italiano", nombre_normalizado: "zapallo_italiano", nombre_display: "Zapallo italiano", cantidad_base: 200, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "cebolla", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 40, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "aceite vegetal", nombre_normalizado: "aceite_vegetal", nombre_display: "Aceite vegetal", cantidad_base: 10, unidad: "ml", unidad_compra: "botellas", factor_conversion: 1000, descripcion_compra: "botella de 1L" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 2, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Lava el zapallo italiano y córtalo en medias lunas finas. Pica la cebolla. Bate los 3 huevos con 2 g de sal.",
      "Calienta los 10 ml de aceite en una sartén a fuego medio. Sofríe la cebolla 3 minutos.",
      "Agrega el zapallo italiano y cocina 5 minutos, revolviendo, hasta que esté tierno y haya soltado agua.",
      "Sube el fuego un momento para evaporar el líquido. Vierte los huevos y reparte el zapallo.",
      "Cocina 3 minutos por un lado. Da vuelta la tortilla con un plato y cocina 2 minutos más, hasta que el centro cuaje.",
      "Deslízala a un plato y sírvela tibia o a temperatura ambiente."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "chd6",
    nombre: "Huevo a la copa con pan",
    tipo_comida: "desayuno",
    calorias_base: 308, proteinas_g: 21, carbohidratos_g: 29, grasas_g: 12,
    es_sin_gluten: false, es_sin_lactosa: true, es_vegetariana: true,
    tiempo_prep_min: 3, tiempo_coccion_min: 6, tiempo_total_min: 9,
    ingredientes: [
      { nombre: "huevos", nombre_normalizado: "huevo", nombre_display: "Huevos", cantidad_base: 2, unidad: "unidades", unidad_compra: "docenas", factor_conversion: 12, descripcion_compra: "docena" },
      { nombre: "pan integral", nombre_normalizado: "pan_integral", nombre_display: "Pan integral", cantidad_base: 2, unidad: "unidad", unidad_compra: "paquetes", factor_conversion: 12, descripcion_compra: "paquete de ~12 rebanadas" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 1, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Hierve agua en una olla pequeña. Cuando rompa el hervor, baja a fuego medio.",
      "Baja los 2 huevos con una cuchara, con cuidado de no romper la cáscara. Cocina 5 minutos para yema blanda.",
      "Mientras tanto, tuesta las 2 rebanadas de pan integral.",
      "Saca los huevos con una espumadera y pásalos un segundo por agua fría para poder pelar la punta.",
      "Corta la tapa de cada huevo, agrega una pizca de sal y sírvelos con el pan tostado para mojar."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "chsa1",
    nombre: "Pan con atún",
    tipo_comida: "snack_am",
    calorias_base: 178, proteinas_g: 24, carbohidratos_g: 16, grasas_g: 2,
    es_sin_gluten: false, es_sin_lactosa: true, es_vegetariana: false,
    tiempo_prep_min: 6, tiempo_coccion_min: 0, tiempo_total_min: 6,
    ingredientes: [
      { nombre: "pan integral", nombre_normalizado: "pan_integral", nombre_display: "Pan integral", cantidad_base: 1, unidad: "unidad", unidad_compra: "paquetes", factor_conversion: 12, descripcion_compra: "paquete de ~12 rebanadas" },
      { nombre: "atún en lata al agua", nombre_normalizado: "atun_lata", nombre_display: "Atún en lata", cantidad_base: 80, unidad: "g", unidad_compra: "latas", factor_conversion: 120, descripcion_compra: "lata escurrida ~120g" },
      { nombre: "tomate", nombre_normalizado: "tomate", nombre_display: "Tomate", cantidad_base: 50, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 1, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Escurre el atún y desmenúzalo con un tenedor. Agrega 1 g de sal si la lata viene sin sal.",
      "Corta el tomate en cubos chicos y mézclalo con el atún.",
      "Tuesta la rebanada de pan integral.",
      "Reparte el atún sobre el pan y sirve al momento."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "chsa2",
    nombre: "Quesillo con tomate y pan",
    tipo_comida: "snack_am",
    calorias_base: 165, proteinas_g: 12, carbohidratos_g: 18, grasas_g: 5,
    es_sin_gluten: false, es_sin_lactosa: false, es_vegetariana: true,
    tiempo_prep_min: 6, tiempo_coccion_min: 0, tiempo_total_min: 6,
    ingredientes: [
      { nombre: "quesillo", nombre_normalizado: "queso_fresco", nombre_display: "Quesillo", cantidad_base: 50, unidad: "g", unidad_compra: "paquetes", factor_conversion: 250, descripcion_compra: "paquete de 250g" },
      { nombre: "tomate", nombre_normalizado: "tomate", nombre_display: "Tomate", cantidad_base: 80, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "pan integral", nombre_normalizado: "pan_integral", nombre_display: "Pan integral", cantidad_base: 1, unidad: "unidad", unidad_compra: "paquetes", factor_conversion: 12, descripcion_compra: "paquete de ~12 rebanadas" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 1, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Corta el tomate en rodajas y el quesillo en láminas.",
      "Tuesta la rebanada de pan integral.",
      "Pon el quesillo y el tomate sobre el pan. Agrega una pizca de sal al tomate.",
      "Sirve de inmediato, antes de que el pan se ablande."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "chsa3",
    nombre: "Huevo duro con pan",
    tipo_comida: "snack_am",
    calorias_base: 227, proteinas_g: 17, carbohidratos_g: 15, grasas_g: 11,
    es_sin_gluten: false, es_sin_lactosa: true, es_vegetariana: true,
    tiempo_prep_min: 2, tiempo_coccion_min: 10, tiempo_total_min: 12,
    ingredientes: [
      { nombre: "huevos", nombre_normalizado: "huevo", nombre_display: "Huevos", cantidad_base: 2, unidad: "unidades", unidad_compra: "docenas", factor_conversion: 12, descripcion_compra: "docena" },
      { nombre: "pan integral", nombre_normalizado: "pan_integral", nombre_display: "Pan integral", cantidad_base: 1, unidad: "unidad", unidad_compra: "paquetes", factor_conversion: 12, descripcion_compra: "paquete de ~12 rebanadas" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 1, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Cubre los 2 huevos con agua fría en una olla. Lleva a hervor.",
      "Cuando hierva, cocina 9 minutos. Pásalos por agua fría y pélalos.",
      "Corta cada huevo por la mitad y agrega una pizca de sal.",
      "Tuesta la rebanada de pan integral y sírvela junto a los huevos."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "chsa4",
    nombre: "Atún con huevo duro",
    tipo_comida: "snack_am",
    calorias_base: 153, proteinas_g: 24, carbohidratos_g: 3, grasas_g: 5,
    es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: false,
    tiempo_prep_min: 2, tiempo_coccion_min: 10, tiempo_total_min: 12,
    ingredientes: [
      { nombre: "atún en lata al agua", nombre_normalizado: "atun_lata", nombre_display: "Atún en lata", cantidad_base: 70, unidad: "g", unidad_compra: "latas", factor_conversion: 120, descripcion_compra: "lata escurrida ~120g" },
      { nombre: "huevos", nombre_normalizado: "huevo", nombre_display: "Huevos", cantidad_base: 1, unidad: "unidades", unidad_compra: "docenas", factor_conversion: 12, descripcion_compra: "docena" },
      { nombre: "tomate", nombre_normalizado: "tomate", nombre_display: "Tomate", cantidad_base: 60, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 1, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Hierve el huevo 9 minutos desde que el agua rompe el hervor. Enfríalo y pélalo.",
      "Escurre el atún y córtalo con un tenedor. Corta el tomate y el huevo en cubos.",
      "Mezcla atún, huevo y tomate. Agrega 1 g de sal.",
      "Sirve en un bowl, frío o a temperatura ambiente."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "cha1",
    nombre: "Charquicán",
    tipo_comida: "almuerzo",
    calorias_base: 560, proteinas_g: 37, carbohidratos_g: 49, grasas_g: 24,
    es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: false,
    tiempo_prep_min: 10, tiempo_coccion_min: 22, tiempo_total_min: 32,
    ingredientes: [
      { nombre: "carne molida magra", nombre_normalizado: "carne_molida", nombre_display: "Carne molida", cantidad_base: 120, unidad: "g", unidad_compra: "bandejas", factor_conversion: 500, descripcion_compra: "bandeja de 500g" },
      { nombre: "papa", nombre_normalizado: "papa", nombre_display: "Papa", cantidad_base: 200, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "zapallo", nombre_normalizado: "zapallo", nombre_display: "Zapallo", cantidad_base: 150, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "cebolla", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 50, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 2, unidad: "dientes", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
      { nombre: "aceite vegetal", nombre_normalizado: "aceite_vegetal", nombre_display: "Aceite vegetal", cantidad_base: 10, unidad: "ml", unidad_compra: "botellas", factor_conversion: 1000, descripcion_compra: "botella de 1L" },
      { nombre: "comino molido", nombre_normalizado: "comino", nombre_display: "Comino", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
      { nombre: "orégano seco", nombre_normalizado: "oregano", nombre_display: "Orégano", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 30, descripcion_compra: "frasco de 30g" },
      { nombre: "huevos", nombre_normalizado: "huevo", nombre_display: "Huevos", cantidad_base: 1, unidad: "unidades", unidad_compra: "docenas", factor_conversion: 12, descripcion_compra: "docena" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 3, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Pela la papa y el zapallo y córtalos en cubos de 2 cm. Pica la cebolla y los 2 dientes de ajo.",
      "Calienta los 10 ml de aceite en una olla a fuego medio. Sofríe la cebolla 4 minutos. Agrega el ajo y cocina 1 minuto.",
      "Suma los 120 g de carne molida. Desármala con una cuchara y cocina 6 minutos, hasta que pierda el color rosado.",
      "Agrega la papa, el zapallo, 1 g de comino, 1 g de orégano, 2 g de sal y 200 ml de agua. Tapa.",
      "Cocina 16 minutos a fuego medio, hasta que la papa esté blanda. Aplasta una parte contra la olla para espesar.",
      "Haz un hueco en el centro, casca el huevo ahí, tapa y cocina 3 minutos hasta que la clara cuaje. Sirve el charquicán con el huevo encima."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "cha2",
    nombre: "Cazuela de pollo",
    tipo_comida: "almuerzo",
    calorias_base: 595, proteinas_g: 43, carbohidratos_g: 81, grasas_g: 11,
    es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: false,
    tiempo_prep_min: 12, tiempo_coccion_min: 22, tiempo_total_min: 34,
    ingredientes: [
      { nombre: "pechuga de pollo", nombre_normalizado: "pechuga_pollo", nombre_display: "Pechuga de pollo", cantidad_base: 140, unidad: "g", unidad_compra: "bandejas", factor_conversion: 700, descripcion_compra: "bandeja de ~700g" },
      { nombre: "papa", nombre_normalizado: "papa", nombre_display: "Papa", cantidad_base: 150, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "zapallo", nombre_normalizado: "zapallo", nombre_display: "Zapallo", cantidad_base: 80, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "zanahoria", nombre_normalizado: "zanahoria", nombre_display: "Zanahoria", cantidad_base: 70, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "choclo en lata", nombre_normalizado: "choclo", nombre_display: "Choclo", cantidad_base: 60, unidad: "g", unidad_compra: "latas", factor_conversion: 400, descripcion_compra: "lata de 400g" },
      { nombre: "arroz blanco", nombre_normalizado: "arroz", nombre_display: "Arroz blanco", cantidad_base: 30, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
      { nombre: "cebolla", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 40, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 2, unidad: "dientes", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
      { nombre: "aceite vegetal", nombre_normalizado: "aceite_vegetal", nombre_display: "Aceite vegetal", cantidad_base: 5, unidad: "ml", unidad_compra: "botellas", factor_conversion: 1000, descripcion_compra: "botella de 1L" },
      { nombre: "orégano seco", nombre_normalizado: "oregano", nombre_display: "Orégano", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 30, descripcion_compra: "frasco de 30g" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 3, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Corta la pechuga en trozos de 3 cm. Pela y corta la papa, la zanahoria y el zapallo en cubos. Pica la cebolla y el ajo.",
      "Calienta los 5 ml de aceite en una olla. Sofríe la cebolla 3 minutos, agrega el ajo y luego el pollo. Sella 4 minutos.",
      "Cubre con 700 ml de agua. Agrega 2 g de sal y 1 g de orégano. Hierve y baja el fuego.",
      "Agrega papa, zanahoria, zapallo y los 30 g de arroz. Tapa y cocina 15 minutos.",
      "Suma el choclo escurrido y cocina 4 minutos más, hasta que el arroz y la papa estén blandos.",
      "Prueba la sal y sirve la cazuela con caldo, en un plato hondo."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "cha3",
    nombre: "Porotos granados",
    tipo_comida: "almuerzo",
    calorias_base: 470, proteinas_g: 22, carbohidratos_g: 73, grasas_g: 10,
    es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: true,
    tiempo_prep_min: 10, tiempo_coccion_min: 20, tiempo_total_min: 30,
    ingredientes: [
      { nombre: "porotos cocidos", nombre_normalizado: "porotos", nombre_display: "Porotos cocidos", cantidad_base: 180, unidad: "g", unidad_compra: "latas", factor_conversion: 400, descripcion_compra: "lata de 400g" },
      { nombre: "zapallo", nombre_normalizado: "zapallo", nombre_display: "Zapallo", cantidad_base: 150, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "choclo en lata", nombre_normalizado: "choclo", nombre_display: "Choclo", cantidad_base: 80, unidad: "g", unidad_compra: "latas", factor_conversion: 400, descripcion_compra: "lata de 400g" },
      { nombre: "cebolla", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 50, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 2, unidad: "dientes", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
      { nombre: "aceite vegetal", nombre_normalizado: "aceite_vegetal", nombre_display: "Aceite vegetal", cantidad_base: 8, unidad: "ml", unidad_compra: "botellas", factor_conversion: 1000, descripcion_compra: "botella de 1L" },
      { nombre: "orégano seco", nombre_normalizado: "oregano", nombre_display: "Orégano", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 30, descripcion_compra: "frasco de 30g" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 3, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Pica la cebolla y el ajo. Pela el zapallo y córtalo en cubos de 2 cm. Escurre los porotos y el choclo.",
      "Calienta los 8 ml de aceite en una olla. Sofríe la cebolla 4 minutos. Agrega el ajo y cocina 1 minuto.",
      "Suma el zapallo, 150 ml de agua, 2 g de sal y 1 g de orégano. Tapa y cocina 10 minutos, hasta que el zapallo ceda.",
      "Agrega los 180 g de porotos cocidos y el choclo. Cocina 8 minutos más, sin tapa, revolviendo.",
      "Aplasta algunos cubos de zapallo para formar una salsa espesa. Prueba la sal.",
      "Sirve caliente. Si queda seco, agrega un poco de agua al final."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "cha4",
    nombre: "Carne molida con papas",
    tipo_comida: "almuerzo",
    calorias_base: 508, proteinas_g: 32, carbohidratos_g: 50, grasas_g: 20,
    es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: false,
    tiempo_prep_min: 10, tiempo_coccion_min: 20, tiempo_total_min: 30,
    ingredientes: [
      { nombre: "carne molida magra", nombre_normalizado: "carne_molida", nombre_display: "Carne molida", cantidad_base: 130, unidad: "g", unidad_compra: "bandejas", factor_conversion: 500, descripcion_compra: "bandeja de 500g" },
      { nombre: "papa", nombre_normalizado: "papa", nombre_display: "Papa", cantidad_base: 220, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "cebolla", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 60, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "tomate", nombre_normalizado: "tomate", nombre_display: "Tomate", cantidad_base: 100, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 2, unidad: "dientes", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
      { nombre: "aceite vegetal", nombre_normalizado: "aceite_vegetal", nombre_display: "Aceite vegetal", cantidad_base: 10, unidad: "ml", unidad_compra: "botellas", factor_conversion: 1000, descripcion_compra: "botella de 1L" },
      { nombre: "comino molido", nombre_normalizado: "comino", nombre_display: "Comino", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 3, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Pela las papas y córtalas en cubos de 2 cm. Pica la cebolla, el ajo y el tomate.",
      "Calienta los 10 ml de aceite en una olla. Sofríe la cebolla 4 minutos y luego el ajo 1 minuto.",
      "Agrega los 130 g de carne molida y 1 g de comino. Cocina 6 minutos, desarmándola, hasta que dore.",
      "Suma el tomate y cocina 3 minutos. Agrega la papa, 150 ml de agua y 2 g de sal.",
      "Tapa y cocina 15 minutos a fuego medio, hasta que la papa esté blanda y quede poco líquido.",
      "Prueba la sal y sirve en un plato hondo."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "cha5",
    nombre: "Arroz con huevo y tomate",
    tipo_comida: "almuerzo",
    calorias_base: 574, proteinas_g: 25, carbohidratos_g: 60, grasas_g: 26,
    es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: true,
    tiempo_prep_min: 5, tiempo_coccion_min: 18, tiempo_total_min: 23,
    ingredientes: [
      { nombre: "arroz blanco", nombre_normalizado: "arroz", nombre_display: "Arroz blanco", cantidad_base: 60, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
      { nombre: "huevos", nombre_normalizado: "huevo", nombre_display: "Huevos", cantidad_base: 3, unidad: "unidades", unidad_compra: "docenas", factor_conversion: 12, descripcion_compra: "docena" },
      { nombre: "tomate", nombre_normalizado: "tomate", nombre_display: "Tomate", cantidad_base: 120, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "cebolla", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 40, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "aceite vegetal", nombre_normalizado: "aceite_vegetal", nombre_display: "Aceite vegetal", cantidad_base: 10, unidad: "ml", unidad_compra: "botellas", factor_conversion: 1000, descripcion_compra: "botella de 1L" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 2, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Lava los 60 g de arroz. Cuécelos en 150 ml de agua con 1 g de sal, tapados, 14 minutos a fuego bajo. Apaga y reposa 3 minutos.",
      "Mientras el arroz cocina, pica la cebolla y el tomate. Bate los 3 huevos con el resto de la sal.",
      "Calienta 5 ml de aceite en una sartén. Sofríe la cebolla 3 minutos y el tomate 3 minutos más.",
      "Agrega el arroz cocido a la sartén y mezcla 1 minuto.",
      "Corre el arroz a un lado. Agrega los 5 ml de aceite restantes y vierte los huevos. Revuelve 2 minutos hasta que cuajen.",
      "Mezcla todo y sirve caliente."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "cha6",
    nombre: "Fideos con atún y arvejas",
    tipo_comida: "almuerzo",
    calorias_base: 466, proteinas_g: 37, carbohidratos_g: 57, grasas_g: 10,
    es_sin_gluten: false, es_sin_lactosa: true, es_vegetariana: false,
    tiempo_prep_min: 8, tiempo_coccion_min: 12, tiempo_total_min: 20,
    ingredientes: [
      { nombre: "fideos", nombre_normalizado: "fideos", nombre_display: "Fideos", cantidad_base: 70, unidad: "g", unidad_compra: "paquetes", factor_conversion: 500, descripcion_compra: "paquete de 500g" },
      { nombre: "atún en lata al agua", nombre_normalizado: "atun_lata", nombre_display: "Atún en lata", cantidad_base: 100, unidad: "g", unidad_compra: "latas", factor_conversion: 120, descripcion_compra: "lata escurrida ~120g" },
      { nombre: "arvejas en lata", nombre_normalizado: "arvejas", nombre_display: "Arvejas", cantidad_base: 80, unidad: "g", unidad_compra: "latas", factor_conversion: 400, descripcion_compra: "lata de 400g" },
      { nombre: "tomate", nombre_normalizado: "tomate", nombre_display: "Tomate", cantidad_base: 80, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "cebolla", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 30, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 1, unidad: "dientes", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
      { nombre: "aceite vegetal", nombre_normalizado: "aceite_vegetal", nombre_display: "Aceite vegetal", cantidad_base: 8, unidad: "ml", unidad_compra: "botellas", factor_conversion: 1000, descripcion_compra: "botella de 1L" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 2, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Hierve agua con sal. Cocina los 70 g de fideos el tiempo del paquete, unos 9 minutos. Escúrrelos y reserva un poco del agua.",
      "Pica la cebolla, el ajo y el tomate. Escurre el atún y las arvejas.",
      "Calienta los 8 ml de aceite en una sartén. Sofríe la cebolla 3 minutos, el ajo 1 minuto y el tomate 3 minutos.",
      "Agrega el atún desmenuzado y las arvejas. Calienta 2 minutos.",
      "Suma los fideos y 2 cucharadas del agua de cocción. Mezcla 1 minuto y rectifica la sal.",
      "Sirve de inmediato."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "cha7",
    nombre: "Lentejas con huevo",
    tipo_comida: "almuerzo",
    calorias_base: 507, proteinas_g: 31, carbohidratos_g: 53, grasas_g: 19,
    es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: true,
    tiempo_prep_min: 8, tiempo_coccion_min: 25, tiempo_total_min: 33,
    ingredientes: [
      { nombre: "lentejas secas", nombre_normalizado: "lentejas", nombre_display: "Lentejas", cantidad_base: 70, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
      { nombre: "huevos", nombre_normalizado: "huevo", nombre_display: "Huevos", cantidad_base: 2, unidad: "unidades", unidad_compra: "docenas", factor_conversion: 12, descripcion_compra: "docena" },
      { nombre: "cebolla", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 50, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "zanahoria", nombre_normalizado: "zanahoria", nombre_display: "Zanahoria", cantidad_base: 60, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "tomate", nombre_normalizado: "tomate", nombre_display: "Tomate", cantidad_base: 80, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 2, unidad: "dientes", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
      { nombre: "aceite vegetal", nombre_normalizado: "aceite_vegetal", nombre_display: "Aceite vegetal", cantidad_base: 8, unidad: "ml", unidad_compra: "botellas", factor_conversion: 1000, descripcion_compra: "botella de 1L" },
      { nombre: "orégano seco", nombre_normalizado: "oregano", nombre_display: "Orégano", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 30, descripcion_compra: "frasco de 30g" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 3, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Enjuaga las lentejas. Pica la cebolla, el ajo y el tomate. Pela la zanahoria y córtala en rodajas finas.",
      "Calienta los 8 ml de aceite en una olla. Sofríe la cebolla 3 minutos. Agrega ajo, zanahoria y tomate. Cocina 3 minutos.",
      "Suma los 70 g de lentejas, 400 ml de agua, 2 g de sal y 1 g de orégano. Hierve y baja el fuego.",
      "Tapa y cocina 22 minutos, hasta que las lentejas estén blandas y quede un caldo corto. Agrega agua si se secan.",
      "Mientras tanto, fríe o hierve los 2 huevos. Si los fríes, usa una sartén con unas gotas de aceite, 3 minutos.",
      "Sirve las lentejas en un plato hondo con los huevos encima."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "cha8",
    nombre: "Garbanzos con atún",
    tipo_comida: "almuerzo",
    calorias_base: 469, proteinas_g: 37, carbohidratos_g: 51, grasas_g: 13,
    es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: false,
    tiempo_prep_min: 8, tiempo_coccion_min: 8, tiempo_total_min: 16,
    ingredientes: [
      { nombre: "garbanzos cocidos", nombre_normalizado: "garbanzos", nombre_display: "Garbanzos cocidos", cantidad_base: 160, unidad: "g", unidad_compra: "latas", factor_conversion: 400, descripcion_compra: "lata de 400g" },
      { nombre: "atún en lata al agua", nombre_normalizado: "atun_lata", nombre_display: "Atún en lata", cantidad_base: 90, unidad: "g", unidad_compra: "latas", factor_conversion: 120, descripcion_compra: "lata escurrida ~120g" },
      { nombre: "tomate", nombre_normalizado: "tomate", nombre_display: "Tomate", cantidad_base: 100, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "cebolla", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 40, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "aceite vegetal", nombre_normalizado: "aceite_vegetal", nombre_display: "Aceite vegetal", cantidad_base: 8, unidad: "ml", unidad_compra: "botellas", factor_conversion: 1000, descripcion_compra: "botella de 1L" },
      { nombre: "orégano seco", nombre_normalizado: "oregano", nombre_display: "Orégano", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 30, descripcion_compra: "frasco de 30g" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 2, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Escurre los garbanzos y el atún. Pica la cebolla y el tomate en cubos chicos.",
      "Calienta los 8 ml de aceite en una sartén. Sofríe la cebolla 3 minutos.",
      "Agrega el tomate y 1 g de orégano. Cocina 3 minutos, hasta que el tomate se ablande.",
      "Suma los garbanzos y el atún desmenuzado. Calienta 3 minutos, revolviendo. Agrega 2 g de sal.",
      "Sirve tibio. También se puede comer frío si apagas el fuego al incorporar el atún."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "cha9",
    nombre: "Pollo a la cacerola con papas",
    tipo_comida: "almuerzo",
    calorias_base: 469, proteinas_g: 41, carbohidratos_g: 47, grasas_g: 13,
    es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: false,
    tiempo_prep_min: 10, tiempo_coccion_min: 22, tiempo_total_min: 32,
    ingredientes: [
      { nombre: "pechuga de pollo", nombre_normalizado: "pechuga_pollo", nombre_display: "Pechuga de pollo", cantidad_base: 150, unidad: "g", unidad_compra: "bandejas", factor_conversion: 700, descripcion_compra: "bandeja de ~700g" },
      { nombre: "papa", nombre_normalizado: "papa", nombre_display: "Papa", cantidad_base: 180, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "zanahoria", nombre_normalizado: "zanahoria", nombre_display: "Zanahoria", cantidad_base: 60, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "cebolla", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 50, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 2, unidad: "dientes", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
      { nombre: "tomate", nombre_normalizado: "tomate", nombre_display: "Tomate", cantidad_base: 80, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "aceite vegetal", nombre_normalizado: "aceite_vegetal", nombre_display: "Aceite vegetal", cantidad_base: 8, unidad: "ml", unidad_compra: "botellas", factor_conversion: 1000, descripcion_compra: "botella de 1L" },
      { nombre: "orégano seco", nombre_normalizado: "oregano", nombre_display: "Orégano", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 30, descripcion_compra: "frasco de 30g" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 3, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Corta la pechuga en cubos de 3 cm. Pela la papa y la zanahoria y córtalas en cubos. Pica cebolla, ajo y tomate.",
      "Calienta los 8 ml de aceite en una olla. Sella el pollo 4 minutos, hasta que dore por fuera. Retíralo.",
      "En la misma olla, sofríe la cebolla 3 minutos. Agrega ajo y tomate y cocina 3 minutos.",
      "Devuelve el pollo. Agrega papa, zanahoria, 200 ml de agua, 2 g de sal y 1 g de orégano.",
      "Tapa y cocina 16 minutos a fuego medio, hasta que la papa esté blanda y el pollo cocido por dentro.",
      "Si queda mucho líquido, cocina 2 minutos sin tapa. Sirve caliente."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "cha10",
    nombre: "Arroz con atún y choclo",
    tipo_comida: "almuerzo",
    calorias_base: 494, proteinas_g: 32, carbohidratos_g: 69, grasas_g: 10,
    es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: false,
    tiempo_prep_min: 5, tiempo_coccion_min: 18, tiempo_total_min: 23,
    ingredientes: [
      { nombre: "arroz blanco", nombre_normalizado: "arroz", nombre_display: "Arroz blanco", cantidad_base: 55, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
      { nombre: "atún en lata al agua", nombre_normalizado: "atun_lata", nombre_display: "Atún en lata", cantidad_base: 100, unidad: "g", unidad_compra: "latas", factor_conversion: 120, descripcion_compra: "lata escurrida ~120g" },
      { nombre: "choclo en lata", nombre_normalizado: "choclo", nombre_display: "Choclo", cantidad_base: 80, unidad: "g", unidad_compra: "latas", factor_conversion: 400, descripcion_compra: "lata de 400g" },
      { nombre: "tomate", nombre_normalizado: "tomate", nombre_display: "Tomate", cantidad_base: 70, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "cebolla", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 30, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "aceite vegetal", nombre_normalizado: "aceite_vegetal", nombre_display: "Aceite vegetal", cantidad_base: 8, unidad: "ml", unidad_compra: "botellas", factor_conversion: 1000, descripcion_compra: "botella de 1L" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 2, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Cocina los 55 g de arroz en 140 ml de agua con 1 g de sal, tapado, 14 minutos a fuego bajo. Reposa 3 minutos fuera del fuego.",
      "Escurre el atún y el choclo. Pica la cebolla y el tomate.",
      "Calienta los 8 ml de aceite en una sartén. Sofríe la cebolla 3 minutos y el tomate 2 minutos.",
      "Agrega el choclo y el atún desmenuzado. Calienta 2 minutos.",
      "Suma el arroz y mezcla 1 minuto. Rectifica la sal.",
      "Sirve caliente."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "cha11",
    nombre: "Porotos con arroz",
    tipo_comida: "almuerzo",
    calorias_base: 517, proteinas_g: 21, carbohidratos_g: 88, grasas_g: 9,
    es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: true,
    tiempo_prep_min: 8, tiempo_coccion_min: 18, tiempo_total_min: 26,
    ingredientes: [
      { nombre: "porotos cocidos", nombre_normalizado: "porotos", nombre_display: "Porotos cocidos", cantidad_base: 160, unidad: "g", unidad_compra: "latas", factor_conversion: 400, descripcion_compra: "lata de 400g" },
      { nombre: "arroz blanco", nombre_normalizado: "arroz", nombre_display: "Arroz blanco", cantidad_base: 50, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
      { nombre: "cebolla", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 40, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 2, unidad: "dientes", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
      { nombre: "zapallo italiano", nombre_normalizado: "zapallo_italiano", nombre_display: "Zapallo italiano", cantidad_base: 80, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "aceite vegetal", nombre_normalizado: "aceite_vegetal", nombre_display: "Aceite vegetal", cantidad_base: 8, unidad: "ml", unidad_compra: "botellas", factor_conversion: 1000, descripcion_compra: "botella de 1L" },
      { nombre: "orégano seco", nombre_normalizado: "oregano", nombre_display: "Orégano", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 30, descripcion_compra: "frasco de 30g" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 2, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Cocina los 50 g de arroz en 130 ml de agua con 1 g de sal, tapado, 14 minutos. Reposa 3 minutos.",
      "Pica la cebolla y el ajo. Corta el zapallo italiano en cubos chicos. Escurre los porotos.",
      "Calienta los 8 ml de aceite en una olla. Sofríe la cebolla 3 minutos, el ajo 1 minuto y el zapallo italiano 4 minutos.",
      "Agrega los 160 g de porotos cocidos, 1 g de orégano y el resto de la sal. Calienta 4 minutos. Si está seco, suma 3 cucharadas de agua.",
      "Sirve los porotos junto al arroz, en el mismo plato."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "cha12",
    nombre: "Fideos con huevo y tomate",
    tipo_comida: "almuerzo",
    calorias_base: 482, proteinas_g: 22, carbohidratos_g: 49, grasas_g: 22,
    es_sin_gluten: false, es_sin_lactosa: true, es_vegetariana: true,
    tiempo_prep_min: 8, tiempo_coccion_min: 12, tiempo_total_min: 20,
    ingredientes: [
      { nombre: "fideos", nombre_normalizado: "fideos", nombre_display: "Fideos", cantidad_base: 70, unidad: "g", unidad_compra: "paquetes", factor_conversion: 500, descripcion_compra: "paquete de 500g" },
      { nombre: "huevos", nombre_normalizado: "huevo", nombre_display: "Huevos", cantidad_base: 2, unidad: "unidades", unidad_compra: "docenas", factor_conversion: 12, descripcion_compra: "docena" },
      { nombre: "tomate", nombre_normalizado: "tomate", nombre_display: "Tomate", cantidad_base: 120, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "cebolla", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 30, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 1, unidad: "dientes", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
      { nombre: "aceite vegetal", nombre_normalizado: "aceite_vegetal", nombre_display: "Aceite vegetal", cantidad_base: 10, unidad: "ml", unidad_compra: "botellas", factor_conversion: 1000, descripcion_compra: "botella de 1L" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 2, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Hierve los 70 g de fideos en agua con sal unos 9 minutos. Escurre y reserva.",
      "Pica la cebolla, el ajo y el tomate. Bate los 2 huevos con 1 g de sal.",
      "Calienta 6 ml de aceite en una sartén. Sofríe la cebolla 3 minutos, el ajo 1 minuto y el tomate 4 minutos.",
      "Agrega los fideos y mezcla 1 minuto. Corre todo a un lado de la sartén.",
      "Agrega los 4 ml de aceite restantes y vierte los huevos. Cuaja 2 minutos y mezcla con los fideos.",
      "Prueba la sal y sirve de inmediato."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "chsp1",
    nombre: "Pan con queso fresco",
    tipo_comida: "snack_pm",
    calorias_base: 221, proteinas_g: 14, carbohidratos_g: 30, grasas_g: 5,
    es_sin_gluten: false, es_sin_lactosa: false, es_vegetariana: true,
    tiempo_prep_min: 5, tiempo_coccion_min: 2, tiempo_total_min: 7,
    ingredientes: [
      { nombre: "pan integral", nombre_normalizado: "pan_integral", nombre_display: "Pan integral", cantidad_base: 2, unidad: "unidad", unidad_compra: "paquetes", factor_conversion: 12, descripcion_compra: "paquete de ~12 rebanadas" },
      { nombre: "quesillo", nombre_normalizado: "queso_fresco", nombre_display: "Quesillo", cantidad_base: 40, unidad: "g", unidad_compra: "paquetes", factor_conversion: 250, descripcion_compra: "paquete de 250g" },
      { nombre: "tomate", nombre_normalizado: "tomate", nombre_display: "Tomate", cantidad_base: 40, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" }
    ],
    instrucciones: [
      "Corta el quesillo en láminas y el tomate en rodajas.",
      "Tuesta las 2 rebanadas de pan integral, 1 minuto por lado.",
      "Pon el quesillo y el tomate sobre el pan.",
      "Sirve de inmediato."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "chsp2",
    nombre: "Atún con choclo",
    tipo_comida: "snack_pm",
    calorias_base: 178, proteinas_g: 22, carbohidratos_g: 18, grasas_g: 2,
    es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: false,
    tiempo_prep_min: 5, tiempo_coccion_min: 2, tiempo_total_min: 7,
    ingredientes: [
      { nombre: "atún en lata al agua", nombre_normalizado: "atun_lata", nombre_display: "Atún en lata", cantidad_base: 80, unidad: "g", unidad_compra: "latas", factor_conversion: 120, descripcion_compra: "lata escurrida ~120g" },
      { nombre: "choclo en lata", nombre_normalizado: "choclo", nombre_display: "Choclo", cantidad_base: 80, unidad: "g", unidad_compra: "latas", factor_conversion: 400, descripcion_compra: "lata de 400g" },
      { nombre: "tomate", nombre_normalizado: "tomate", nombre_display: "Tomate", cantidad_base: 40, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 1, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Escurre el atún y el choclo. Corta el tomate en cubos chicos.",
      "Mezcla el atún desmenuzado con el choclo y el tomate.",
      "Agrega 1 g de sal y calienta 2 minutos en una sartén si lo quieres tibio. Si no, sírvelo frío.",
      "Sirve en un bowl."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "chsp3",
    nombre: "Huevo duro con tomate",
    tipo_comida: "snack_pm",
    calorias_base: 162, proteinas_g: 13, carbohidratos_g: 5, grasas_g: 10,
    es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: true,
    tiempo_prep_min: 2, tiempo_coccion_min: 10, tiempo_total_min: 12,
    ingredientes: [
      { nombre: "huevos", nombre_normalizado: "huevo", nombre_display: "Huevos", cantidad_base: 2, unidad: "unidades", unidad_compra: "docenas", factor_conversion: 12, descripcion_compra: "docena" },
      { nombre: "tomate", nombre_normalizado: "tomate", nombre_display: "Tomate", cantidad_base: 100, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 1, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Cubre los 2 huevos con agua, hierve y cocina 9 minutos. Enfríalos y pélalos.",
      "Corta los huevos en cuartos y el tomate en rodajas.",
      "Agrega 1 g de sal al tomate.",
      "Sirve los huevos junto al tomate."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "chsp4",
    nombre: "Manzana con quesillo",
    tipo_comida: "snack_pm",
    calorias_base: 155, proteinas_g: 6, carbohidratos_g: 26, grasas_g: 3,
    es_sin_gluten: true, es_sin_lactosa: false, es_vegetariana: true,
    tiempo_prep_min: 5, tiempo_coccion_min: 0, tiempo_total_min: 5,
    ingredientes: [
      { nombre: "manzana", nombre_normalizado: "manzana", nombre_display: "Manzana", cantidad_base: 1, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
      { nombre: "quesillo", nombre_normalizado: "queso_fresco", nombre_display: "Quesillo", cantidad_base: 40, unidad: "g", unidad_compra: "paquetes", factor_conversion: 250, descripcion_compra: "paquete de 250g" }
    ],
    instrucciones: [
      "Lava la manzana y sécala.",
      "Córtala en gajos y retira el corazón y las semillas.",
      "Corta los 40 g de quesillo en láminas.",
      "Sirve la manzana con el quesillo al lado. No hace falta cocinar nada."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "chc1",
    nombre: "Tortilla de atún",
    tipo_comida: "cena",
    calorias_base: 384, proteinas_g: 38, carbohidratos_g: 4, grasas_g: 24,
    es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: false,
    tiempo_prep_min: 6, tiempo_coccion_min: 10, tiempo_total_min: 16,
    ingredientes: [
      { nombre: "huevos", nombre_normalizado: "huevo", nombre_display: "Huevos", cantidad_base: 3, unidad: "unidades", unidad_compra: "docenas", factor_conversion: 12, descripcion_compra: "docena" },
      { nombre: "atún en lata al agua", nombre_normalizado: "atun_lata", nombre_display: "Atún en lata", cantidad_base: 80, unidad: "g", unidad_compra: "latas", factor_conversion: 120, descripcion_compra: "lata escurrida ~120g" },
      { nombre: "cebolla", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 30, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "aceite vegetal", nombre_normalizado: "aceite_vegetal", nombre_display: "Aceite vegetal", cantidad_base: 8, unidad: "ml", unidad_compra: "botellas", factor_conversion: 1000, descripcion_compra: "botella de 1L" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 2, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Escurre el atún y desmenúzalo. Pica la cebolla. Bate los 3 huevos con el atún y 2 g de sal.",
      "Calienta los 8 ml de aceite en una sartén antiadherente a fuego medio. Sofríe la cebolla 3 minutos.",
      "Vierte la mezcla de huevo y atún. Reparte parejo.",
      "Cocina 4 minutos, hasta que los bordes cuajen. Da vuelta con un plato.",
      "Cocina 3 minutos más, hasta que el centro esté firme.",
      "Sirve tibia, en cuñas."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "chc2",
    nombre: "Pechuga salteada con zapallo italiano",
    tipo_comida: "cena",
    calorias_base: 477, proteinas_g: 40, carbohidratos_g: 50, grasas_g: 13,
    es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: false,
    tiempo_prep_min: 10, tiempo_coccion_min: 16, tiempo_total_min: 26,
    ingredientes: [
      { nombre: "pechuga de pollo", nombre_normalizado: "pechuga_pollo", nombre_display: "Pechuga de pollo", cantidad_base: 140, unidad: "g", unidad_compra: "bandejas", factor_conversion: 700, descripcion_compra: "bandeja de ~700g" },
      { nombre: "zapallo italiano", nombre_normalizado: "zapallo_italiano", nombre_display: "Zapallo italiano", cantidad_base: 200, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "tomate", nombre_normalizado: "tomate", nombre_display: "Tomate", cantidad_base: 80, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "cebolla", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 40, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 2, unidad: "dientes", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
      { nombre: "arroz blanco", nombre_normalizado: "arroz", nombre_display: "Arroz blanco", cantidad_base: 40, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
      { nombre: "aceite vegetal", nombre_normalizado: "aceite_vegetal", nombre_display: "Aceite vegetal", cantidad_base: 8, unidad: "ml", unidad_compra: "botellas", factor_conversion: 1000, descripcion_compra: "botella de 1L" },
      { nombre: "orégano seco", nombre_normalizado: "oregano", nombre_display: "Orégano", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 30, descripcion_compra: "frasco de 30g" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 3, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Cocina los 40 g de arroz en 100 ml de agua con 1 g de sal, tapado, 14 minutos. Reposa fuera del fuego.",
      "Corta la pechuga en tiras. Corta el zapallo italiano en medias lunas. Pica cebolla, ajo y tomate.",
      "Calienta los 8 ml de aceite en una sartén a fuego medio-alto. Sella el pollo 5 minutos, hasta que dore. Retíralo.",
      "En la misma sartén, sofríe la cebolla 2 minutos, el ajo 1 minuto y el zapallo italiano 4 minutos.",
      "Agrega el tomate, el pollo, 1 g de orégano y el resto de la sal. Cocina 3 minutos, hasta que el pollo esté cocido por dentro.",
      "Sirve el salteado sobre el arroz."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "chc3",
    nombre: "Garbanzos con fideos",
    tipo_comida: "cena",
    calorias_base: 501, proteinas_g: 20, carbohidratos_g: 76, grasas_g: 13,
    es_sin_gluten: false, es_sin_lactosa: true, es_vegetariana: true,
    tiempo_prep_min: 8, tiempo_coccion_min: 14, tiempo_total_min: 22,
    ingredientes: [
      { nombre: "garbanzos cocidos", nombre_normalizado: "garbanzos", nombre_display: "Garbanzos cocidos", cantidad_base: 140, unidad: "g", unidad_compra: "latas", factor_conversion: 400, descripcion_compra: "lata de 400g" },
      { nombre: "fideos", nombre_normalizado: "fideos", nombre_display: "Fideos", cantidad_base: 50, unidad: "g", unidad_compra: "paquetes", factor_conversion: 500, descripcion_compra: "paquete de 500g" },
      { nombre: "tomate", nombre_normalizado: "tomate", nombre_display: "Tomate", cantidad_base: 100, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "cebolla", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 40, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 2, unidad: "dientes", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
      { nombre: "aceite vegetal", nombre_normalizado: "aceite_vegetal", nombre_display: "Aceite vegetal", cantidad_base: 8, unidad: "ml", unidad_compra: "botellas", factor_conversion: 1000, descripcion_compra: "botella de 1L" },
      { nombre: "orégano seco", nombre_normalizado: "oregano", nombre_display: "Orégano", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 30, descripcion_compra: "frasco de 30g" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 2, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Hierve los 50 g de fideos en agua con sal unos 9 minutos. Escurre.",
      "Pica la cebolla, el ajo y el tomate. Escurre los garbanzos.",
      "Calienta los 8 ml de aceite en una olla. Sofríe la cebolla 3 minutos y el ajo 1 minuto.",
      "Agrega el tomate y 1 g de orégano. Cocina 4 minutos.",
      "Suma los garbanzos, los fideos y 2 g de sal. Mezcla 2 minutos a fuego bajo. Si está seco, agrega 3 cucharadas de agua.",
      "Sirve caliente."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "chc4",
    nombre: "Papas salteadas con huevo",
    tipo_comida: "cena",
    calorias_base: 418, proteinas_g: 17, carbohidratos_g: 38, grasas_g: 22,
    es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: true,
    tiempo_prep_min: 8, tiempo_coccion_min: 18, tiempo_total_min: 26,
    ingredientes: [
      { nombre: "papa", nombre_normalizado: "papa", nombre_display: "Papa", cantidad_base: 200, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "huevos", nombre_normalizado: "huevo", nombre_display: "Huevos", cantidad_base: 2, unidad: "unidades", unidad_compra: "docenas", factor_conversion: 12, descripcion_compra: "docena" },
      { nombre: "cebolla", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 40, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "aceite vegetal", nombre_normalizado: "aceite_vegetal", nombre_display: "Aceite vegetal", cantidad_base: 12, unidad: "ml", unidad_compra: "botellas", factor_conversion: 1000, descripcion_compra: "botella de 1L" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 2, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Pela las papas y córtalas en cubos de 1.5 cm. Pica la cebolla. Bate los 2 huevos con 1 g de sal.",
      "Calienta los 12 ml de aceite en una sartén a fuego medio. Sofríe la cebolla 3 minutos.",
      "Agrega la papa y 1 g de sal. Cocina 14 minutos, revolviendo cada tanto, hasta que esté dorada y blanda. Agrega una cucharada de agua y tapa 4 minutos si aún está dura.",
      "Baja el fuego. Vierte los huevos y revuelve 2 minutos, hasta que cuajen y cubran la papa.",
      "Sirve de inmediato, directo de la sartén."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "chc5",
    nombre: "Arroz con carne molida",
    tipo_comida: "cena",
    calorias_base: 505, proteinas_g: 28, carbohidratos_g: 60, grasas_g: 17,
    es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: false,
    tiempo_prep_min: 8, tiempo_coccion_min: 20, tiempo_total_min: 28,
    ingredientes: [
      { nombre: "carne molida magra", nombre_normalizado: "carne_molida", nombre_display: "Carne molida", cantidad_base: 110, unidad: "g", unidad_compra: "bandejas", factor_conversion: 500, descripcion_compra: "bandeja de 500g" },
      { nombre: "arroz blanco", nombre_normalizado: "arroz", nombre_display: "Arroz blanco", cantidad_base: 55, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
      { nombre: "zanahoria", nombre_normalizado: "zanahoria", nombre_display: "Zanahoria", cantidad_base: 50, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "cebolla", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 40, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "tomate", nombre_normalizado: "tomate", nombre_display: "Tomate", cantidad_base: 80, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 1, unidad: "dientes", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
      { nombre: "aceite vegetal", nombre_normalizado: "aceite_vegetal", nombre_display: "Aceite vegetal", cantidad_base: 8, unidad: "ml", unidad_compra: "botellas", factor_conversion: 1000, descripcion_compra: "botella de 1L" },
      { nombre: "comino molido", nombre_normalizado: "comino", nombre_display: "Comino", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 2, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Cocina los 55 g de arroz en 140 ml de agua con 1 g de sal, tapado, 14 minutos. Reposa 3 minutos.",
      "Pica la cebolla, el ajo y el tomate. Pela la zanahoria y córtala en cubos chicos.",
      "Calienta los 8 ml de aceite en una sartén. Sofríe la cebolla y la zanahoria 4 minutos. Agrega el ajo 1 minuto.",
      "Suma los 110 g de carne molida y 1 g de comino. Cocina 6 minutos, desarmándola, hasta que dore.",
      "Agrega el tomate y cocina 3 minutos. Mezcla el arroz y el resto de la sal. Calienta 1 minuto.",
      "Sirve caliente."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "chc6",
    nombre: "Fideos con pollo",
    tipo_comida: "cena",
    calorias_base: 445, proteinas_g: 39, carbohidratos_g: 43, grasas_g: 13,
    es_sin_gluten: false, es_sin_lactosa: true, es_vegetariana: false,
    tiempo_prep_min: 10, tiempo_coccion_min: 14, tiempo_total_min: 24,
    ingredientes: [
      { nombre: "pechuga de pollo", nombre_normalizado: "pechuga_pollo", nombre_display: "Pechuga de pollo", cantidad_base: 130, unidad: "g", unidad_compra: "bandejas", factor_conversion: 700, descripcion_compra: "bandeja de ~700g" },
      { nombre: "fideos", nombre_normalizado: "fideos", nombre_display: "Fideos", cantidad_base: 60, unidad: "g", unidad_compra: "paquetes", factor_conversion: 500, descripcion_compra: "paquete de 500g" },
      { nombre: "tomate", nombre_normalizado: "tomate", nombre_display: "Tomate", cantidad_base: 100, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "cebolla", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 30, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 2, unidad: "dientes", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
      { nombre: "aceite vegetal", nombre_normalizado: "aceite_vegetal", nombre_display: "Aceite vegetal", cantidad_base: 8, unidad: "ml", unidad_compra: "botellas", factor_conversion: 1000, descripcion_compra: "botella de 1L" },
      { nombre: "orégano seco", nombre_normalizado: "oregano", nombre_display: "Orégano", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 30, descripcion_compra: "frasco de 30g" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 2, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Hierve los 60 g de fideos en agua con sal unos 9 minutos. Escurre.",
      "Corta la pechuga en tiras. Pica cebolla, ajo y tomate.",
      "Calienta los 8 ml de aceite en una sartén. Sella el pollo 5 minutos, hasta que dore por fuera.",
      "Agrega la cebolla 2 minutos, el ajo 1 minuto y el tomate 3 minutos.",
      "Suma los fideos, 1 g de orégano y 2 g de sal. Mezcla 2 minutos. Agrega un poco de agua de la pasta si se pega.",
      "Sirve caliente. El pollo debe verse blanco por dentro, sin rosado."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "chc7",
    nombre: "Ensalada de porotos con huevo",
    tipo_comida: "cena",
    calorias_base: 459, proteinas_g: 28, carbohidratos_g: 44, grasas_g: 19,
    es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: true,
    tiempo_prep_min: 8, tiempo_coccion_min: 10, tiempo_total_min: 18,
    ingredientes: [
      { nombre: "porotos cocidos", nombre_normalizado: "porotos", nombre_display: "Porotos cocidos", cantidad_base: 160, unidad: "g", unidad_compra: "latas", factor_conversion: 400, descripcion_compra: "lata de 400g" },
      { nombre: "huevos", nombre_normalizado: "huevo", nombre_display: "Huevos", cantidad_base: 2, unidad: "unidades", unidad_compra: "docenas", factor_conversion: 12, descripcion_compra: "docena" },
      { nombre: "tomate", nombre_normalizado: "tomate", nombre_display: "Tomate", cantidad_base: 100, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "cebolla", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 30, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "aceite vegetal", nombre_normalizado: "aceite_vegetal", nombre_display: "Aceite vegetal", cantidad_base: 8, unidad: "ml", unidad_compra: "botellas", factor_conversion: 1000, descripcion_compra: "botella de 1L" },
      { nombre: "orégano seco", nombre_normalizado: "oregano", nombre_display: "Orégano", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 30, descripcion_compra: "frasco de 30g" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 2, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Hierve los 2 huevos 9 minutos. Enfríalos, pélalos y córtalos en cuartos.",
      "Escurre los porotos. Pica el tomate y la cebolla en cubos chicos.",
      "Mezcla porotos, tomate, cebolla, 8 ml de aceite, 1 g de orégano y 2 g de sal.",
      "Reparte en un plato y coloca los huevos encima.",
      "Sirve a temperatura ambiente. Si los porotos vienen de la lata fríos, puedes templarlos 2 minutos en una sartén antes de mezclar."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "chc8",
    nombre: "Sopa de fideos con huevo",
    tipo_comida: "cena",
    calorias_base: 384, proteinas_g: 20, carbohidratos_g: 40, grasas_g: 16,
    es_sin_gluten: false, es_sin_lactosa: true, es_vegetariana: true,
    tiempo_prep_min: 8, tiempo_coccion_min: 14, tiempo_total_min: 22,
    ingredientes: [
      { nombre: "fideos", nombre_normalizado: "fideos", nombre_display: "Fideos", cantidad_base: 50, unidad: "g", unidad_compra: "paquetes", factor_conversion: 500, descripcion_compra: "paquete de 500g" },
      { nombre: "huevos", nombre_normalizado: "huevo", nombre_display: "Huevos", cantidad_base: 2, unidad: "unidades", unidad_compra: "docenas", factor_conversion: 12, descripcion_compra: "docena" },
      { nombre: "zanahoria", nombre_normalizado: "zanahoria", nombre_display: "Zanahoria", cantidad_base: 50, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "zapallo italiano", nombre_normalizado: "zapallo_italiano", nombre_display: "Zapallo italiano", cantidad_base: 80, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "cebolla", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 30, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
      { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 1, unidad: "dientes", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
      { nombre: "aceite vegetal", nombre_normalizado: "aceite_vegetal", nombre_display: "Aceite vegetal", cantidad_base: 5, unidad: "ml", unidad_compra: "botellas", factor_conversion: 1000, descripcion_compra: "botella de 1L" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 3, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Pica la cebolla y el ajo. Pela la zanahoria y córtala en rodajas finas. Corta el zapallo italiano en cubos.",
      "Calienta los 5 ml de aceite en una olla. Sofríe la cebolla 3 minutos y el ajo 1 minuto.",
      "Agrega la zanahoria, el zapallo italiano y 700 ml de agua. Sala con 2 g de sal. Hierve 6 minutos.",
      "Suma los 50 g de fideos y cocina 8 minutos, hasta que estén blandos.",
      "Bate los 2 huevos. Baja el fuego y viértelos en hilo mientras revuelves, para que formen hebras.",
      "Cocina 1 minuto más, prueba la sal y sirve caliente."
    ],
    instrucciones_thermomix: []
  }
  ];

  const ids = new Set(RECETAS_DB.map(function(r) { return r.id; }));
  let nuevas = 0;
  RECETAS_DESPENSA.forEach(function(r) {
    if (ids.has(r.id)) return;
    RECETAS_DB.push(r);
    ids.add(r.id);
    nuevas++;
  });
  console.log('[Recipes Despensa] +' + nuevas + ' recetas de despensa chilena');
})();
