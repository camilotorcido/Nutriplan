/* ============================================
   NutriPlan - Base de Datos de Recetas
   30+ recetas en español latino
   MEJORA 1: Cada ingrediente incluye nombre_normalizado,
   nombre_display, unidad_compra, factor_conversion y
   descripcion_compra para consolidación correcta y
   lista de compras en unidades de supermercado.
   ============================================ */

const RECETAS_DB = [
  // ======================== DESAYUNOS ========================
  {
    id: "d1",
    nombre: "Avena con plátano y maní",
    tipo_comida: "desayuno",
    calorias_base: 420,
    proteinas_g: 15,
    carbohidratos_g: 58,
    grasas_g: 14,
    es_sin_gluten: false,
    es_sin_lactosa: true,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "avena en hojuelas", nombre_normalizado: "avena", nombre_display: "Avena en hojuelas", cantidad_base: 80, unidad: "g", unidad_compra: "paquetes", factor_conversion: 500, descripcion_compra: "paquete de 500g" },
      { nombre: "plátano maduro", nombre_normalizado: "platano", nombre_display: "Plátano", cantidad_base: 1, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
      { nombre: "maní tostado", nombre_normalizado: "mani", nombre_display: "Maní tostado", cantidad_base: 20, unidad: "g", unidad_compra: "paquetes", factor_conversion: 250, descripcion_compra: "paquete de 250g" },
      { nombre: "miel de abeja", nombre_normalizado: "miel", nombre_display: "Miel de abeja", cantidad_base: 15, unidad: "ml", unidad_compra: "frascos", factor_conversion: 500, descripcion_compra: "frasco de 500ml" },
      { nombre: "canela en polvo", nombre_normalizado: "canela", nombre_display: "Canela en polvo", cantidad_base: 2, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
      { nombre: "leche de almendras", nombre_normalizado: "leche_almendras", nombre_display: "Leche de almendras", cantidad_base: 250, unidad: "ml", unidad_compra: "cajas", factor_conversion: 1000, descripcion_compra: "caja de 1L" }
    ],
    instrucciones: [
      "Verter los 250 ml de leche de almendras en una olla mediana y calentar a fuego medio hasta que comience a humear.",
      "Agregar los 80 g de avena en hojuelas a la leche caliente. Revolver constantemente con una cuchara de madera durante 5 minutos hasta que la avena espese.",
      "Mientras la avena se cocina, pelar el plátano maduro y cortarlo en rodajas de medio centímetro. Picar el maní tostado en trozos gruesos.",
      "Retirar la avena del fuego. Servir en un bowl. Colocar las rodajas de plátano encima formando un abanico.",
      "Espolvorear los 20 g de maní picado y los 2 g de canela en polvo por encima.",
      "Rociar los 15 ml de miel de abeja en zigzag sobre la preparación. Servir tibio."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "d2",
    nombre: "Huevos revueltos con palta y arepa",
    tipo_comida: "desayuno",
    calorias_base: 480,
    proteinas_g: 22,
    carbohidratos_g: 42,
    grasas_g: 24,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "huevos", nombre_normalizado: "huevo", nombre_display: "Huevos", cantidad_base: 3, unidad: "unidades", unidad_compra: "docenas", factor_conversion: 12, descripcion_compra: "docena" },
      { nombre: "palta (aguacate)", nombre_normalizado: "palta", nombre_display: "Palta (aguacate)", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
      { nombre: "harina de maíz precocida", nombre_normalizado: "harina_maiz", nombre_display: "Harina de maíz precocida", cantidad_base: 80, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
      { nombre: "tomate", nombre_normalizado: "tomate", nombre_display: "Tomate", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
      { nombre: "cebolla morada", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 0.25, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
      { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 10, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 2, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
      { nombre: "pimienta negra", nombre_normalizado: "pimienta", nombre_display: "Pimienta negra", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" }
    ],
    instrucciones: [
      "Mezclar los 80 g de harina de maíz precocida con 120 ml de agua tibia y una pizca de sal. Amasar hasta obtener una masa suave sin grietas. Formar una arepa de 1 cm de grosor.",
      "Cocinar la arepa en una sartén o budare a fuego medio, sin aceite, durante 4 minutos por cada lado hasta que se forme una costra dorada.",
      "Mientras la arepa se cocina, batir los 3 huevos en un bowl con sal y pimienta negra.",
      "Calentar los 10 ml de aceite de oliva en otra sartén a fuego medio-bajo. Verter los huevos y cocinar revolviendo suavemente con una espátula hasta que cuajen pero queden cremosos.",
      "Picar el tomate y el cuarto de cebolla morada en cubos pequeños para hacer una ensalada fresca.",
      "Cortar la media palta en láminas finas.",
      "Servir la arepa abierta o al lado, acompañada de los huevos revueltos, las láminas de palta y la ensalada de tomate y cebolla."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "d3",
    nombre: "Smoothie tropical de mango y chía",
    tipo_comida: "desayuno",
    calorias_base: 350,
    proteinas_g: 12,
    carbohidratos_g: 52,
    grasas_g: 10,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "mango congelado", nombre_normalizado: "mango", nombre_display: "Mango congelado", cantidad_base: 150, unidad: "g", unidad_compra: "bolsas", factor_conversion: 500, descripcion_compra: "bolsa de 500g" },
      { nombre: "plátano", nombre_normalizado: "platano", nombre_display: "Plátano", cantidad_base: 1, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
      { nombre: "semillas de chía", nombre_normalizado: "chia", nombre_display: "Semillas de chía", cantidad_base: 15, unidad: "g", unidad_compra: "paquetes", factor_conversion: 250, descripcion_compra: "paquete de 250g" },
      { nombre: "leche de coco", nombre_normalizado: "leche_coco", nombre_display: "Leche de coco", cantidad_base: 200, unidad: "ml", unidad_compra: "latas", factor_conversion: 400, descripcion_compra: "lata de 400ml" },
      { nombre: "proteína de suero (vainilla)", nombre_normalizado: "proteina_suero", nombre_display: "Proteína de suero", cantidad_base: 20, unidad: "g", unidad_compra: "potes", factor_conversion: 900, descripcion_compra: "pote de 900g" },
      { nombre: "espinaca fresca", nombre_normalizado: "espinaca", nombre_display: "Espinaca fresca", cantidad_base: 30, unidad: "g", unidad_compra: "manojos", factor_conversion: 200, descripcion_compra: "manojo de ~200g" }
    ],
    instrucciones: [
      "Lavar las hojas de espinaca fresca (30 g) y sacudir el exceso de agua.",
      "Colocar en la licuadora los 150 g de mango congelado, el plátano pelado y troceado, las hojas de espinaca y los 200 ml de leche de coco.",
      "Agregar los 20 g de proteína de suero sabor vainilla y los 15 g de semillas de chía.",
      "Licuar a máxima velocidad durante 60 segundos hasta obtener una mezcla homogénea y sin grumos de espinaca.",
      "Probar y ajustar: si queda muy espeso, agregar un poco más de leche de coco; si queda muy líquido, agregar unos cubos de hielo.",
      "Servir inmediatamente en un vaso grande. Decorar con unas semillas de chía adicionales y un trozo de mango por encima."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "d4",
    nombre: "Tostadas de camote con huevo pochado",
    tipo_comida: "desayuno",
    calorias_base: 390,
    proteinas_g: 18,
    carbohidratos_g: 45,
    grasas_g: 15,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "camote (batata)", nombre_normalizado: "camote", nombre_display: "Camote (batata)", cantidad_base: 200, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "por kg" },
      { nombre: "huevos", nombre_normalizado: "huevo", nombre_display: "Huevos", cantidad_base: 2, unidad: "unidades", unidad_compra: "docenas", factor_conversion: 12, descripcion_compra: "docena" },
      { nombre: "palta (aguacate)", nombre_normalizado: "palta", nombre_display: "Palta (aguacate)", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
      { nombre: "tomates cherry", nombre_normalizado: "tomate_cherry", nombre_display: "Tomates cherry", cantidad_base: 80, unidad: "g", unidad_compra: "bandejas", factor_conversion: 250, descripcion_compra: "bandeja de 250g" },
      { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 10, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
      { nombre: "sal de mar", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 2, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
      { nombre: "hojuelas de chile", nombre_normalizado: "chile_hojuelas", nombre_display: "Hojuelas de chile", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 30, descripcion_compra: "frasco de 30g" }
    ],
    instrucciones: [
      "Pelar los 200 g de camote y cortarlo en rodajas de 1 cm de grosor. Rociar con 5 ml de aceite de oliva y una pizca de sal.",
      "Tostar las rodajas de camote en una tostadora gruesa, plancha o sartén a fuego medio durante 4-5 minutos por lado hasta que estén doradas y tiernas por dentro.",
      "Mientras tanto, hervir agua en una olla con un chorrito de vinagre. Crear un remolino suave con una cuchara y deslizar cada huevo con cuidado. Pochar durante 3 minutos para yema líquida.",
      "En un bowl pequeño, machacar la media palta con un tenedor. Agregar una pizca de sal de mar y unas gotas de limón. Mezclar hasta obtener un guacamole rústico.",
      "Cortar los 80 g de tomates cherry por la mitad.",
      "Montar las tostadas: untar la palta machacada sobre cada rodaja de camote, colocar un huevo pochado encima.",
      "Decorar con los tomates cherry, un toque de hojuelas de chile, el aceite de oliva restante y sal de mar en escamas."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "d5",
    nombre: "Panqueques de avena y arándanos",
    tipo_comida: "desayuno",
    calorias_base: 440,
    proteinas_g: 20,
    carbohidratos_g: 55,
    grasas_g: 14,
    es_sin_gluten: false,
    es_sin_lactosa: false,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "avena en hojuelas", nombre_normalizado: "avena", nombre_display: "Avena en hojuelas", cantidad_base: 80, unidad: "g", unidad_compra: "paquetes", factor_conversion: 500, descripcion_compra: "paquete de 500g" },
      { nombre: "huevos", nombre_normalizado: "huevo", nombre_display: "Huevos", cantidad_base: 2, unidad: "unidades", unidad_compra: "docenas", factor_conversion: 12, descripcion_compra: "docena" },
      { nombre: "leche descremada", nombre_normalizado: "leche", nombre_display: "Leche descremada", cantidad_base: 100, unidad: "ml", unidad_compra: "cajas", factor_conversion: 1000, descripcion_compra: "caja de 1L" },
      { nombre: "arándanos frescos", nombre_normalizado: "arandanos", nombre_display: "Arándanos frescos", cantidad_base: 60, unidad: "g", unidad_compra: "bandejas", factor_conversion: 125, descripcion_compra: "bandeja de 125g" },
      { nombre: "polvo para hornear", nombre_normalizado: "polvo_hornear", nombre_display: "Polvo para hornear", cantidad_base: 5, unidad: "g", unidad_compra: "sobres", factor_conversion: 100, descripcion_compra: "sobre de 100g" },
      { nombre: "miel de maple", nombre_normalizado: "miel_maple", nombre_display: "Miel de maple", cantidad_base: 20, unidad: "ml", unidad_compra: "botellas", factor_conversion: 250, descripcion_compra: "botella de 250ml" },
      { nombre: "aceite de coco", nombre_normalizado: "aceite_coco", nombre_display: "Aceite de coco", cantidad_base: 10, unidad: "ml", unidad_compra: "frascos", factor_conversion: 300, descripcion_compra: "frasco de 300ml" }
    ],
    instrucciones: [
      "Colocar los 80 g de avena en hojuelas en la licuadora y pulsar hasta obtener una harina fina. Verter en un bowl y mezclar con los 5 g de polvo para hornear.",
      "En otro bowl, batir los 2 huevos. Agregar los 100 ml de leche descremada y mezclar bien.",
      "Incorporar la mezcla líquida a la harina de avena. Revolver con movimientos envolventes hasta integrar sin sobre-mezclar. Añadir la mitad de los arándanos frescos a la masa.",
      "Calentar una sartén antiadherente a fuego medio. Agregar una cucharadita de aceite de coco. Verter un cucharón de masa y cocinar 2 minutos hasta que aparezcan burbujas en la superficie. Voltear y cocinar 1-2 minutos más.",
      "Repetir con el resto de la masa, agregando aceite de coco según sea necesario.",
      "Servir los panqueques apilados. Cubrir con los arándanos frescos restantes y rociar generosamente con los 20 ml de miel de maple."
    ],
    instrucciones_thermomix: []
  },

  {
    id: "d6",
    nombre: "Tostada francesa con frutas",
    tipo_comida: "desayuno",
    calorias_base: 410,
    proteinas_g: 16,
    carbohidratos_g: 52,
    grasas_g: 15,
    es_sin_gluten: false,
    es_sin_lactosa: false,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "pan de molde integral", nombre_normalizado: "pan_integral", nombre_display: "Pan integral", cantidad_base: 2, unidad: "rebanadas", unidad_compra: "paquetes", factor_conversion: 20, descripcion_compra: "paquete de ~20 rebanadas" },
      { nombre: "huevos", nombre_normalizado: "huevo", nombre_display: "Huevos", cantidad_base: 2, unidad: "unidades", unidad_compra: "docenas", factor_conversion: 12, descripcion_compra: "docena" },
      { nombre: "leche descremada", nombre_normalizado: "leche", nombre_display: "Leche descremada", cantidad_base: 60, unidad: "ml", unidad_compra: "cajas", factor_conversion: 1000, descripcion_compra: "caja de 1L" },
      { nombre: "canela en polvo", nombre_normalizado: "canela", nombre_display: "Canela en polvo", cantidad_base: 2, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
      { nombre: "frutillas frescas", nombre_normalizado: "frutilla", nombre_display: "Frutillas frescas", cantidad_base: 80, unidad: "g", unidad_compra: "bandejas", factor_conversion: 400, descripcion_compra: "bandeja de 400g" },
      { nombre: "miel de abeja", nombre_normalizado: "miel", nombre_display: "Miel de abeja", cantidad_base: 15, unidad: "ml", unidad_compra: "frascos", factor_conversion: 500, descripcion_compra: "frasco de 500ml" }
    ],
    instrucciones: [
      "Batir los 2 huevos en un plato hondo. Agregar los 60 ml de leche descremada y los 2 g de canela en polvo. Mezclar bien hasta integrar.",
      "Lavar y cortar los 80 g de frutillas frescas en láminas. Reservar.",
      "Sumergir cada rebanada de pan integral en la mezcla de huevo, dejándola empapar unos segundos por cada lado.",
      "Calentar una sartén a fuego medio con una fina capa de mantequilla o aceite. Cocinar cada rebanada durante 2 minutos por lado hasta que esté dorada y firme.",
      "Servir las tostadas francesas en un plato. Colocar las láminas de frutilla encima.",
      "Rociar con los 15 ml de miel de abeja. Espolvorear un poco más de canela si se desea."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "d7",
    nombre: "Bowl de yogur con granola y fruta",
    tipo_comida: "desayuno",
    calorias_base: 380,
    proteinas_g: 18,
    carbohidratos_g: 50,
    grasas_g: 12,
    es_sin_gluten: false,
    es_sin_lactosa: false,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "yogur griego natural", nombre_normalizado: "yogur_griego", nombre_display: "Yogur griego natural", cantidad_base: 200, unidad: "g", unidad_compra: "potes", factor_conversion: 500, descripcion_compra: "pote de 500g" },
      { nombre: "granola", nombre_normalizado: "granola", nombre_display: "Granola", cantidad_base: 50, unidad: "g", unidad_compra: "paquetes", factor_conversion: 350, descripcion_compra: "paquete de 350g" },
      { nombre: "plátano", nombre_normalizado: "platano", nombre_display: "Plátano", cantidad_base: 1, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
      { nombre: "arándanos frescos", nombre_normalizado: "arandanos", nombre_display: "Arándanos", cantidad_base: 40, unidad: "g", unidad_compra: "bandejas", factor_conversion: 150, descripcion_compra: "bandeja de 150g" },
      { nombre: "miel de abeja", nombre_normalizado: "miel", nombre_display: "Miel de abeja", cantidad_base: 10, unidad: "ml", unidad_compra: "frascos", factor_conversion: 500, descripcion_compra: "frasco de 500ml" }
    ],
    instrucciones: [
      "Colocar los 200 g de yogur griego natural en un bowl amplio.",
      "Pelar el plátano y cortarlo en rodajas de medio centímetro de grosor.",
      "Lavar los 40 g de arándanos frescos y sacudir el exceso de agua.",
      "Distribuir los 50 g de granola sobre el yogur formando una capa crujiente.",
      "Colocar las rodajas de plátano a un lado y los arándanos al otro, creando secciones de color.",
      "Rociar los 10 ml de miel de abeja por encima en zigzag. Consumir inmediatamente para que la granola se mantenga crujiente."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "d8",
    nombre: "Arepa rellena de queso y porotos",
    tipo_comida: "desayuno",
    calorias_base: 450,
    proteinas_g: 20,
    carbohidratos_g: 55,
    grasas_g: 16,
    es_sin_gluten: true,
    es_sin_lactosa: false,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "harina de maíz precocida", nombre_normalizado: "harina_maiz", nombre_display: "Harina de maíz precocida", cantidad_base: 100, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
      { nombre: "queso blanco rallado", nombre_normalizado: "queso_blanco", nombre_display: "Queso blanco", cantidad_base: 50, unidad: "g", unidad_compra: "paquetes", factor_conversion: 250, descripcion_compra: "paquete de 250g" },
      { nombre: "porotos negros cocidos", nombre_normalizado: "poroto_negro", nombre_display: "Porotos negros", cantidad_base: 80, unidad: "g", unidad_compra: "latas", factor_conversion: 400, descripcion_compra: "lata de 400g" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 2, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Mezclar los 100 g de harina de maíz precocida con 150 ml de agua tibia y una pizca de sal. Amasar durante 2 minutos hasta obtener una masa lisa y sin grietas.",
      "Dividir la masa en 2 porciones iguales. Formar cada una en una bola y luego aplanar hasta obtener arepas de aproximadamente 1 cm de grosor.",
      "Cocinar las arepas en sartén o budare seco a fuego medio durante 4 minutos por cada lado, hasta que se forme una costra dorada.",
      "Mientras las arepas se cocinan, calentar los 80 g de porotos negros cocidos en una olla pequeña a fuego bajo. Agregar una pizca de comino si se desea.",
      "Rallar los 50 g de queso blanco.",
      "Cuando las arepas estén listas, abrirlas por la mitad con un cuchillo. Rellenar con los porotos calientes y el queso rallado, que se derretirá con el calor."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "d9",
    nombre: "Tortilla española de papas",
    tipo_comida: "desayuno",
    calorias_base: 420,
    proteinas_g: 20,
    carbohidratos_g: 35,
    grasas_g: 22,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "papas", nombre_normalizado: "papa", nombre_display: "Papas", cantidad_base: 200, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "por kg" },
      { nombre: "huevos", nombre_normalizado: "huevo", nombre_display: "Huevos", cantidad_base: 3, unidad: "unidades", unidad_compra: "docenas", factor_conversion: 12, descripcion_compra: "docena" },
      { nombre: "cebolla", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
      { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 20, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 2, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Pelar los 200 g de papas y cortarlas en rodajas muy finas (2-3 mm de grosor). Pelar y cortar la media cebolla en juliana fina.",
      "Calentar los 20 ml de aceite de oliva en una sartén mediana a fuego bajo. Agregar las papas y la cebolla. Cocinar lentamente durante 15 minutos, revolviendo de vez en cuando, hasta que estén completamente tiernas pero sin dorar.",
      "Mientras tanto, cascar los 3 huevos en un bowl grande. Batir con una pizca generosa de sal.",
      "Escurrir bien las papas y cebolla del exceso de aceite. Incorporarlas al bowl con los huevos batidos. Mezclar suavemente y dejar reposar 5 minutos.",
      "Calentar una sartén antiadherente con una cucharada de aceite a fuego medio. Verter la mezcla de huevos y papas. Cocinar a fuego bajo durante 5-6 minutos hasta que la base esté cuajada.",
      "Colocar un plato grande sobre la sartén y voltear la tortilla con un movimiento firme. Deslizarla de vuelta a la sartén y cocinar 3-4 minutos más.",
      "Servir tibia, cortada en porciones triangulares. Acompañar con pan si se desea."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "d10",
    nombre: "Waffles integrales con plátano y miel",
    tipo_comida: "desayuno",
    calorias_base: 430,
    proteinas_g: 14,
    carbohidratos_g: 60,
    grasas_g: 16,
    es_sin_gluten: false,
    es_sin_lactosa: false,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "harina integral", nombre_normalizado: "harina_integral", nombre_display: "Harina integral", cantidad_base: 100, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
      { nombre: "huevos", nombre_normalizado: "huevo", nombre_display: "Huevos", cantidad_base: 1, unidad: "unidad", unidad_compra: "docenas", factor_conversion: 12, descripcion_compra: "docena" },
      { nombre: "leche descremada", nombre_normalizado: "leche", nombre_display: "Leche descremada", cantidad_base: 120, unidad: "ml", unidad_compra: "cajas", factor_conversion: 1000, descripcion_compra: "caja de 1L" },
      { nombre: "polvo para hornear", nombre_normalizado: "polvo_hornear", nombre_display: "Polvo para hornear", cantidad_base: 5, unidad: "g", unidad_compra: "sobres", factor_conversion: 100, descripcion_compra: "sobre de 100g" },
      { nombre: "plátano", nombre_normalizado: "platano", nombre_display: "Plátano", cantidad_base: 1, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
      { nombre: "miel de abeja", nombre_normalizado: "miel", nombre_display: "Miel de abeja", cantidad_base: 20, unidad: "ml", unidad_compra: "frascos", factor_conversion: 500, descripcion_compra: "frasco de 500ml" }
    ],
    instrucciones: [
      "En un bowl grande, mezclar los 100 g de harina integral con los 5 g de polvo para hornear.",
      "En otro bowl, batir el huevo. Agregar los 120 ml de leche descremada y mezclar bien.",
      "Verter la mezcla líquida sobre los ingredientes secos. Revolver con un tenedor hasta integrar; está bien si quedan algunos grumos pequeños.",
      "Precalentar la wafflera y engrasarla ligeramente. Verter la masa y cocinar según las indicaciones de la máquina (generalmente 3-4 minutos) hasta que esté dorado.",
      "Pelar el plátano y cortarlo en rodajas de medio centímetro.",
      "Servir los waffles en un plato. Cubrir con las rodajas de plátano y rociar con los 20 ml de miel de abeja por encima."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "d11",
    nombre: "Chilaquiles verdes con huevo",
    tipo_comida: "desayuno",
    calorias_base: 460,
    proteinas_g: 22,
    carbohidratos_g: 42,
    grasas_g: 22,
    es_sin_gluten: true,
    es_sin_lactosa: false,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "tortillas de maíz", nombre_normalizado: "tortilla_maiz", nombre_display: "Tortillas de maíz", cantidad_base: 4, unidad: "unidades", unidad_compra: "paquetes", factor_conversion: 12, descripcion_compra: "paquete de 12 unid." },
      { nombre: "salsa verde", nombre_normalizado: "salsa_verde", nombre_display: "Salsa verde", cantidad_base: 120, unidad: "ml", unidad_compra: "frascos", factor_conversion: 400, descripcion_compra: "frasco de 400ml" },
      { nombre: "huevos", nombre_normalizado: "huevo", nombre_display: "Huevos", cantidad_base: 2, unidad: "unidades", unidad_compra: "docenas", factor_conversion: 12, descripcion_compra: "docena" },
      { nombre: "queso fresco", nombre_normalizado: "queso_fresco", nombre_display: "Queso fresco", cantidad_base: 40, unidad: "g", unidad_compra: "paquetes", factor_conversion: 250, descripcion_compra: "paquete de 250g" },
      { nombre: "crema agria", nombre_normalizado: "crema_agria", nombre_display: "Crema agria", cantidad_base: 30, unidad: "g", unidad_compra: "potes", factor_conversion: 200, descripcion_compra: "pote de 200g" },
      { nombre: "aceite vegetal", nombre_normalizado: "aceite_vegetal", nombre_display: "Aceite vegetal", cantidad_base: 15, unidad: "ml", unidad_compra: "botellas", factor_conversion: 1000, descripcion_compra: "botella de 1L" }
    ],
    instrucciones: [
      "Cortar las 4 tortillas de maíz en triángulos (6-8 por tortilla). Calentar los 15 ml de aceite vegetal en una sartén a fuego medio-alto.",
      "Freír los triángulos de tortilla por tandas durante 2-3 minutos hasta que estén dorados y crujientes. Escurrir sobre papel absorbente.",
      "En la misma sartén, verter los 120 ml de salsa verde y calentar a fuego medio por 2 minutos.",
      "Agregar los totopos a la salsa. Revolver con cuidado para que se bañen uniformemente sin romperse. Cocinar 1 minuto.",
      "En otra sartén con un poco de aceite, freír los 2 huevos al gusto (estrellados o revueltos).",
      "Servir los chilaquiles en un plato. Colocar los huevos encima. Desmenuzar los 40 g de queso fresco por encima.",
      "Agregar una cucharada de los 30 g de crema agria. Servir inmediatamente mientras los totopos están crujientes."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "d12",
    nombre: "Overnight oats de coco y mango",
    tipo_comida: "desayuno",
    calorias_base: 370,
    proteinas_g: 12,
    carbohidratos_g: 55,
    grasas_g: 12,
    es_sin_gluten: false,
    es_sin_lactosa: true,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "avena en hojuelas", nombre_normalizado: "avena", nombre_display: "Avena en hojuelas", cantidad_base: 60, unidad: "g", unidad_compra: "paquetes", factor_conversion: 500, descripcion_compra: "paquete de 500g" },
      { nombre: "leche de coco", nombre_normalizado: "leche_coco", nombre_display: "Leche de coco", cantidad_base: 150, unidad: "ml", unidad_compra: "latas", factor_conversion: 400, descripcion_compra: "lata de 400ml" },
      { nombre: "mango", nombre_normalizado: "mango", nombre_display: "Mango", cantidad_base: 100, unidad: "g", unidad_compra: "unidades", factor_conversion: 300, descripcion_compra: "unidad (~300g)" },
      { nombre: "coco rallado", nombre_normalizado: "coco_rallado", nombre_display: "Coco rallado", cantidad_base: 15, unidad: "g", unidad_compra: "paquetes", factor_conversion: 200, descripcion_compra: "paquete de 200g" },
      { nombre: "semillas de chía", nombre_normalizado: "chia", nombre_display: "Semillas de chía", cantidad_base: 10, unidad: "g", unidad_compra: "paquetes", factor_conversion: 200, descripcion_compra: "paquete de 200g" }
    ],
    instrucciones: [
      "En un frasco de vidrio con tapa (o bowl), colocar los 60 g de avena en hojuelas.",
      "Agregar los 150 ml de leche de coco, los 10 g de semillas de chía y los 15 g de coco rallado.",
      "Revolver bien con una cuchara para que todos los ingredientes se integren y no queden grumos de chía.",
      "Tapar el frasco y refrigerar durante toda la noche (mínimo 6 horas) para que la avena absorba el líquido y las semillas de chía se hidraten.",
      "Al día siguiente, pelar el mango y cortarlo en cubos de 1 cm.",
      "Revolver la mezcla una vez más. Servir en un bowl con los cubos de mango fresco por encima. Se puede agregar un toque extra de coco rallado para decorar."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "d13",
    nombre: "Empanadas de queso al horno",
    tipo_comida: "desayuno",
    calorias_base: 400,
    proteinas_g: 16,
    carbohidratos_g: 45,
    grasas_g: 18,
    es_sin_gluten: false,
    es_sin_lactosa: false,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "masa para empanadas", nombre_normalizado: "masa_empanada", nombre_display: "Masa para empanadas", cantidad_base: 3, unidad: "discos", unidad_compra: "paquetes", factor_conversion: 12, descripcion_compra: "paquete de 12 discos" },
      { nombre: "queso mozzarella", nombre_normalizado: "queso_mozzarella", nombre_display: "Queso mozzarella", cantidad_base: 80, unidad: "g", unidad_compra: "paquetes", factor_conversion: 250, descripcion_compra: "paquete de 250g" },
      { nombre: "orégano", nombre_normalizado: "oregano", nombre_display: "Orégano", cantidad_base: 2, unidad: "g", unidad_compra: "frascos", factor_conversion: 25, descripcion_compra: "frasco de 25g" }
    ],
    instrucciones: [
      "Precalentar el horno a 200°C. Preparar una bandeja para horno con papel manteca o silicona.",
      "Cortar los 80 g de queso mozzarella en bastones o trozos pequeños.",
      "Colocar cada disco de masa sobre la mesada. Distribuir el queso mozzarella en el centro de cada uno. Espolvorear con un poco de orégano.",
      "Cerrar cada empanada doblando la masa por la mitad. Presionar los bordes firmemente con un tenedor para sellar.",
      "Pincelar la superficie de cada empanada con huevo batido para que se doren.",
      "Colocar en la bandeja y hornear durante 15-18 minutos hasta que estén doradas y crujientes.",
      "Retirar del horno y dejar reposar 2 minutos antes de servir. El queso estará muy caliente por dentro."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "d14",
    nombre: "Batido proteico de avena y plátano",
    tipo_comida: "desayuno",
    calorias_base: 400,
    proteinas_g: 30,
    carbohidratos_g: 50,
    grasas_g: 10,
    es_sin_gluten: false,
    es_sin_lactosa: true,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "avena en hojuelas", nombre_normalizado: "avena", nombre_display: "Avena en hojuelas", cantidad_base: 50, unidad: "g", unidad_compra: "paquetes", factor_conversion: 500, descripcion_compra: "paquete de 500g" },
      { nombre: "plátano", nombre_normalizado: "platano", nombre_display: "Plátano", cantidad_base: 1, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
      { nombre: "proteína de suero (vainilla)", nombre_normalizado: "proteina_suero", nombre_display: "Proteína de suero", cantidad_base: 30, unidad: "g", unidad_compra: "potes", factor_conversion: 900, descripcion_compra: "pote de 900g" },
      { nombre: "leche de almendras", nombre_normalizado: "leche_almendras", nombre_display: "Leche de almendras", cantidad_base: 250, unidad: "ml", unidad_compra: "cajas", factor_conversion: 1000, descripcion_compra: "caja de 1L" },
      { nombre: "mantequilla de maní natural", nombre_normalizado: "mantequilla_mani", nombre_display: "Mantequilla de maní", cantidad_base: 15, unidad: "g", unidad_compra: "frascos", factor_conversion: 350, descripcion_compra: "frasco de 350g" }
    ],
    instrucciones: [
      "Pelar el plátano y trocearlo en 3-4 pedazos para facilitar el licuado.",
      "Colocar en la licuadora los 250 ml de leche de almendras, el plátano troceado, los 50 g de avena en hojuelas y los 30 g de proteína de suero.",
      "Agregar los 15 g de mantequilla de maní natural.",
      "Licuar a máxima velocidad durante 45-60 segundos hasta obtener una mezcla cremosa y sin grumos de avena.",
      "Probar y ajustar: si queda muy espeso, agregar un poco más de leche; si se desea más dulce, agregar medio plátano más.",
      "Servir inmediatamente en un vaso grande. Se puede agregar unos copos de avena por encima como decoración."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "d15",
    nombre: "Tacos de huevo con salsa",
    tipo_comida: "desayuno",
    calorias_base: 430,
    proteinas_g: 22,
    carbohidratos_g: 38,
    grasas_g: 20,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "tortillas de maíz", nombre_normalizado: "tortilla_maiz", nombre_display: "Tortillas de maíz", cantidad_base: 3, unidad: "unidades", unidad_compra: "paquetes", factor_conversion: 12, descripcion_compra: "paquete de 12 unid." },
      { nombre: "huevos", nombre_normalizado: "huevo", nombre_display: "Huevos", cantidad_base: 3, unidad: "unidades", unidad_compra: "docenas", factor_conversion: 12, descripcion_compra: "docena" },
      { nombre: "tomate", nombre_normalizado: "tomate", nombre_display: "Tomate", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
      { nombre: "cebolla", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 0.25, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
      { nombre: "cilantro fresco", nombre_normalizado: "cilantro", nombre_display: "Cilantro fresco", cantidad_base: 10, unidad: "g", unidad_compra: "manojos", factor_conversion: 100, descripcion_compra: "manojo de ~100g" },
      { nombre: "salsa picante", nombre_normalizado: "salsa_picante", nombre_display: "Salsa picante", cantidad_base: 15, unidad: "ml", unidad_compra: "botellas", factor_conversion: 150, descripcion_compra: "botella de 150ml" }
    ],
    instrucciones: [
      "Preparar la salsa fresca: picar finamente el tomate en cubos, el cuarto de cebolla en trocitos pequeños y el cilantro fresco. Mezclar todo en un bowl con un toque de salsa picante y una pizca de sal.",
      "Batir los 3 huevos en un bowl con una pizca de sal.",
      "Calentar una sartén con un chorrito de aceite a fuego medio. Verter los huevos y cocinar revolviendo suavemente con una espátula durante 2-3 minutos hasta que cuajen pero queden cremosos.",
      "Calentar las 3 tortillas de maíz en un comal o sartén seca, 30 segundos por cada lado hasta que estén flexibles y con marcas de calor.",
      "Armar los tacos: colocar una porción de huevo revuelto en cada tortilla caliente.",
      "Cubrir con una cucharada generosa de la salsa fresca de tomate, cebolla y cilantro. Agregar salsa picante al gusto."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "d16",
    nombre: "Galletas de avena con chips de chocolate",
    tipo_comida: "desayuno",
    calorias_base: 380,
    proteinas_g: 10,
    carbohidratos_g: 55,
    grasas_g: 14,
    es_sin_gluten: false,
    es_sin_lactosa: true,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "avena en hojuelas", nombre_normalizado: "avena", nombre_display: "Avena en hojuelas", cantidad_base: 100, unidad: "g", unidad_compra: "paquetes", factor_conversion: 500, descripcion_compra: "paquete de 500g" },
      { nombre: "plátano maduro", nombre_normalizado: "platano", nombre_display: "Plátano", cantidad_base: 1, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
      { nombre: "chips de chocolate oscuro", nombre_normalizado: "chips_chocolate", nombre_display: "Chips de chocolate", cantidad_base: 25, unidad: "g", unidad_compra: "paquetes", factor_conversion: 200, descripcion_compra: "paquete de 200g" },
      { nombre: "miel de abeja", nombre_normalizado: "miel", nombre_display: "Miel de abeja", cantidad_base: 15, unidad: "ml", unidad_compra: "frascos", factor_conversion: 500, descripcion_compra: "frasco de 500ml" }
    ],
    instrucciones: [
      "Precalentar el horno a 180°C. Preparar una bandeja con papel para horno.",
      "Pelar el plátano maduro y machacarlo en un bowl grande con un tenedor hasta obtener un puré suave.",
      "Agregar los 100 g de avena en hojuelas al puré de plátano. Incorporar los 15 ml de miel de abeja y mezclar bien.",
      "Añadir los 25 g de chips de chocolate oscuro a la masa y revolver para distribuirlos uniformemente.",
      "Tomar cucharadas de la mezcla y formar galletas aplanadas sobre la bandeja, dejando espacio entre ellas.",
      "Hornear durante 12-15 minutos hasta que los bordes estén dorados.",
      "Retirar del horno y dejar enfriar sobre la bandeja durante 5 minutos (se firmarán al enfriarse). Acompañar con leche o café."
    ],
    instrucciones_thermomix: []
  },

  // ======================== SNACKS AM ========================
  {
    id: "sa1",
    nombre: "Mix de frutos secos y frutas deshidratadas",
    tipo_comida: "snack_am",
    calorias_base: 220,
    proteinas_g: 7,
    carbohidratos_g: 22,
    grasas_g: 13,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "almendras", nombre_normalizado: "almendras", nombre_display: "Almendras", cantidad_base: 15, unidad: "g", unidad_compra: "paquetes", factor_conversion: 200, descripcion_compra: "paquete de 200g" },
      { nombre: "nueces", nombre_normalizado: "nueces", nombre_display: "Nueces", cantidad_base: 10, unidad: "g", unidad_compra: "paquetes", factor_conversion: 200, descripcion_compra: "paquete de 200g" },
      { nombre: "maní tostado", nombre_normalizado: "mani", nombre_display: "Maní tostado", cantidad_base: 10, unidad: "g", unidad_compra: "paquetes", factor_conversion: 250, descripcion_compra: "paquete de 250g" },
      { nombre: "arándanos deshidratados", nombre_normalizado: "arandanos_deshid", nombre_display: "Arándanos deshidratados", cantidad_base: 15, unidad: "g", unidad_compra: "paquetes", factor_conversion: 150, descripcion_compra: "paquete de 150g" },
      { nombre: "pasas", nombre_normalizado: "pasas", nombre_display: "Pasas", cantidad_base: 10, unidad: "g", unidad_compra: "paquetes", factor_conversion: 250, descripcion_compra: "paquete de 250g" }
    ],
    instrucciones: [
      "Medir las porciones: 15 g de almendras, 10 g de nueces, 10 g de maní tostado, 15 g de arándanos deshidratados y 10 g de pasas.",
      "Picar las almendras y nueces en mitades o trozos grandes para variar texturas.",
      "Combinar todos los frutos secos y frutas deshidratadas en un recipiente y mezclar bien.",
      "Porcionar en una bolsita o contenedor pequeño. Se pueden preparar varias porciones el domingo para toda la semana.",
      "Consumir como snack de media mañana. Guardar el resto en un lugar fresco y seco."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "sa2",
    nombre: "Yogur griego con granola y frutillas",
    tipo_comida: "snack_am",
    calorias_base: 250,
    proteinas_g: 15,
    carbohidratos_g: 30,
    grasas_g: 8,
    es_sin_gluten: false,
    es_sin_lactosa: false,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "yogur griego natural", nombre_normalizado: "yogur_griego", nombre_display: "Yogur griego natural", cantidad_base: 150, unidad: "g", unidad_compra: "potes", factor_conversion: 500, descripcion_compra: "pote de 500g" },
      { nombre: "granola", nombre_normalizado: "granola", nombre_display: "Granola", cantidad_base: 30, unidad: "g", unidad_compra: "paquetes", factor_conversion: 350, descripcion_compra: "paquete de 350g" },
      { nombre: "frutillas frescas", nombre_normalizado: "frutilla", nombre_display: "Frutillas frescas", cantidad_base: 80, unidad: "g", unidad_compra: "bandejas", factor_conversion: 400, descripcion_compra: "bandeja de 400g" },
      { nombre: "miel de abeja", nombre_normalizado: "miel", nombre_display: "Miel de abeja", cantidad_base: 10, unidad: "ml", unidad_compra: "frascos", factor_conversion: 500, descripcion_compra: "frasco de 500ml" }
    ],
    instrucciones: [
      "Colocar los 150 g de yogur griego natural en un bowl pequeño.",
      "Lavar los 80 g de frutillas frescas. Retirar las hojas y cortarlas en láminas finas.",
      "Distribuir los 30 g de granola sobre el yogur formando una capa crujiente.",
      "Colocar las láminas de frutilla sobre la granola, cubriendo la superficie.",
      "Rociar con los 10 ml de miel de abeja. Consumir inmediatamente para que la granola se mantenga crujiente."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "sa3",
    nombre: "Hummus con palitos de zanahoria y pepino",
    tipo_comida: "snack_am",
    calorias_base: 200,
    proteinas_g: 8,
    carbohidratos_g: 24,
    grasas_g: 9,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "garbanzos cocidos", nombre_normalizado: "garbanzos", nombre_display: "Garbanzos cocidos", cantidad_base: 80, unidad: "g", unidad_compra: "latas", factor_conversion: 400, descripcion_compra: "lata de 400g" },
      { nombre: "tahini", nombre_normalizado: "tahini", nombre_display: "Tahini", cantidad_base: 15, unidad: "g", unidad_compra: "frascos", factor_conversion: 250, descripcion_compra: "frasco de 250g" },
      { nombre: "limón (jugo)", nombre_normalizado: "limon", nombre_display: "Limón", cantidad_base: 15, unidad: "ml", unidad_compra: "unidades", factor_conversion: 30, descripcion_compra: "unidad (~30ml jugo)" },
      { nombre: "zanahoria", nombre_normalizado: "zanahoria", nombre_display: "Zanahoria", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 7, descripcion_compra: "~7 unidades por kg" },
      { nombre: "pepino", nombre_normalizado: "pepino", nombre_display: "Pepino", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
      { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 5, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
      { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 1, unidad: "diente", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" }
    ],
    instrucciones: [
      "Escurrir y enjuagar los 80 g de garbanzos cocidos.",
      "Colocar los garbanzos en un procesador o licuadora junto con los 15 g de tahini, los 15 ml de jugo de limón, el diente de ajo pelado y los 5 ml de aceite de oliva.",
      "Procesar durante 2-3 minutos hasta obtener una crema suave y homogénea. Si queda muy espeso, agregar una cucharada de agua.",
      "Pelar la zanahoria y cortarla en bastones de 8 cm. Cortar el medio pepino en bastones del mismo tamaño.",
      "Servir el hummus en un bowl pequeño al centro de un plato, con los bastones de zanahoria y pepino alrededor para dippear."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "sa4",
    nombre: "Plátano con mantequilla de maní",
    tipo_comida: "snack_am",
    calorias_base: 230,
    proteinas_g: 8,
    carbohidratos_g: 30,
    grasas_g: 10,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "plátano", nombre_normalizado: "platano", nombre_display: "Plátano", cantidad_base: 1, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
      { nombre: "mantequilla de maní natural", nombre_normalizado: "mantequilla_mani", nombre_display: "Mantequilla de maní", cantidad_base: 20, unidad: "g", unidad_compra: "frascos", factor_conversion: 350, descripcion_compra: "frasco de 350g" }
    ],
    instrucciones: [
      "Pelar el plátano y cortarlo por la mitad a lo largo, formando dos 'canoas'.",
      "Untar los 20 g de mantequilla de maní natural sobre la cara cortada de cada mitad, distribuyendo uniformemente.",
      "Opcionalmente, espolvorear unas semillas de chía o canela por encima para darle un toque extra.",
      "Consumir inmediatamente. También se puede cortar el plátano en rodajas y alternar con cucharaditas de mantequilla de maní."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "sa5",
    nombre: "Tostada de arroz con palta y tomate",
    tipo_comida: "snack_am",
    calorias_base: 180,
    proteinas_g: 4,
    carbohidratos_g: 18,
    grasas_g: 11,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "galletas de arroz", nombre_normalizado: "galleta_arroz", nombre_display: "Galletas de arroz", cantidad_base: 2, unidad: "unidades", unidad_compra: "paquetes", factor_conversion: 20, descripcion_compra: "paquete de ~20 unid." },
      { nombre: "palta (aguacate)", nombre_normalizado: "palta", nombre_display: "Palta (aguacate)", cantidad_base: 0.25, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
      { nombre: "tomate cherry", nombre_normalizado: "tomate_cherry", nombre_display: "Tomate cherry", cantidad_base: 40, unidad: "g", unidad_compra: "bandejas", factor_conversion: 250, descripcion_compra: "bandeja de 250g" },
      { nombre: "sal de mar", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 1, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Sacar un cuarto de palta y colocarla en un bowl pequeño. Machacar con un tenedor hasta obtener una pasta rústica.",
      "Agregar una pizca de sal de mar al puré de palta y mezclar.",
      "Untar la mezcla de palta sobre las 2 galletas de arroz, distribuyendo uniformemente.",
      "Lavar y cortar los 40 g de tomates cherry por la mitad. Colocarlos sobre la palta con la cara cortada hacia arriba.",
      "Terminar con un toque final de sal de mar en escamas si se desea."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "sa6",
    nombre: "Batido verde de espinaca y manzana",
    tipo_comida: "snack_am",
    calorias_base: 160,
    proteinas_g: 5,
    carbohidratos_g: 28,
    grasas_g: 3,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "espinaca fresca", nombre_normalizado: "espinaca", nombre_display: "Espinaca fresca", cantidad_base: 40, unidad: "g", unidad_compra: "manojos", factor_conversion: 200, descripcion_compra: "manojo de ~200g" },
      { nombre: "manzana verde", nombre_normalizado: "manzana", nombre_display: "Manzana verde", cantidad_base: 1, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
      { nombre: "plátano", nombre_normalizado: "platano", nombre_display: "Plátano", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
      { nombre: "agua", nombre_normalizado: "agua", nombre_display: "Agua", cantidad_base: 200, unidad: "ml", unidad_compra: "botellas", factor_conversion: 1500, descripcion_compra: "botella de 1.5L" },
      { nombre: "limón (jugo)", nombre_normalizado: "limon", nombre_display: "Limón", cantidad_base: 10, unidad: "ml", unidad_compra: "unidades", factor_conversion: 30, descripcion_compra: "unidad (~30ml jugo)" }
    ],
    instrucciones: [
      "Lavar bien los 40 g de espinaca fresca bajo el chorro de agua. Sacudir el exceso.",
      "Lavar la manzana verde y cortarla en trozos medianos. No es necesario pelarla ya que la cáscara aporta fibra.",
      "Pelar medio plátano y trocearlo para facilitar el licuado.",
      "Colocar en la licuadora la espinaca, la manzana, el plátano, los 200 ml de agua y los 10 ml de jugo de limón.",
      "Licuar a máxima velocidad durante 45-60 segundos hasta que no queden trozos de espinaca visibles. Servir frío."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "sa7",
    nombre: "Huevo duro con sal y pimienta",
    tipo_comida: "snack_am",
    calorias_base: 155,
    proteinas_g: 13,
    carbohidratos_g: 1,
    grasas_g: 11,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "huevos", nombre_normalizado: "huevo", nombre_display: "Huevos", cantidad_base: 2, unidad: "unidades", unidad_compra: "docenas", factor_conversion: 12, descripcion_compra: "docena" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 1, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
      { nombre: "pimienta negra", nombre_normalizado: "pimienta", nombre_display: "Pimienta negra", cantidad_base: 0.5, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" }
    ],
    instrucciones: [
      "Colocar los 2 huevos con cuidado en una olla pequeña. Cubrir con agua fría hasta que el agua esté 2 cm por encima de los huevos.",
      "Llevar a ebullición a fuego alto. Una vez que hierva, reducir el fuego a medio y cocinar exactamente 10 minutos para yema firme.",
      "Retirar los huevos con una cuchara y pasarlos inmediatamente a un bowl con agua fría y hielo. Dejar reposar 5 minutos.",
      "Pelar los huevos golpeándolos suavemente contra la mesada. Cortarlos por la mitad.",
      "Sazonar con una pizca de sal y la pimienta negra recién molida. Consumir como snack proteico de media mañana."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "sa8",
    nombre: "Quesillo con miel y nueces",
    tipo_comida: "snack_am",
    calorias_base: 210,
    proteinas_g: 12,
    carbohidratos_g: 18,
    grasas_g: 10,
    es_sin_gluten: true,
    es_sin_lactosa: false,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "quesillo fresco", nombre_normalizado: "quesillo", nombre_display: "Quesillo fresco", cantidad_base: 80, unidad: "g", unidad_compra: "paquetes", factor_conversion: 250, descripcion_compra: "paquete de 250g" },
      { nombre: "miel de abeja", nombre_normalizado: "miel", nombre_display: "Miel de abeja", cantidad_base: 15, unidad: "ml", unidad_compra: "frascos", factor_conversion: 500, descripcion_compra: "frasco de 500ml" },
      { nombre: "nueces", nombre_normalizado: "nueces", nombre_display: "Nueces", cantidad_base: 10, unidad: "g", unidad_compra: "paquetes", factor_conversion: 200, descripcion_compra: "paquete de 200g" }
    ],
    instrucciones: [
      "Cortar los 80 g de quesillo fresco en rodajas de 1 cm de grosor o en cubitos.",
      "Disponer el quesillo en un plato pequeño.",
      "Picar los 10 g de nueces en trozos gruesos con un cuchillo.",
      "Rociar los 15 ml de miel de abeja sobre el quesillo, cubriéndolo generosamente.",
      "Esparcir las nueces picadas por encima. La combinación de quesillo salado, miel dulce y nueces crujientes es un snack clásico y equilibrado."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "sa9",
    nombre: "Tostada integral con palta y semillas",
    tipo_comida: "snack_am",
    calorias_base: 210,
    proteinas_g: 5,
    carbohidratos_g: 20,
    grasas_g: 13,
    es_sin_gluten: false,
    es_sin_lactosa: true,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "pan integral", nombre_normalizado: "pan_integral", nombre_display: "Pan integral", cantidad_base: 1, unidad: "rebanada", unidad_compra: "paquetes", factor_conversion: 20, descripcion_compra: "paquete de ~20 rebanadas" },
      { nombre: "palta (aguacate)", nombre_normalizado: "palta", nombre_display: "Palta (aguacate)", cantidad_base: 0.25, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
      { nombre: "semillas de girasol", nombre_normalizado: "semillas_girasol", nombre_display: "Semillas de girasol", cantidad_base: 10, unidad: "g", unidad_compra: "paquetes", factor_conversion: 200, descripcion_compra: "paquete de 200g" },
      { nombre: "sal de mar", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 1, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Tostar la rebanada de pan integral en la tostadora o en sartén seca hasta que esté dorada y crujiente.",
      "Sacar un cuarto de palta y machacarla con un tenedor en un plato pequeño hasta obtener una pasta rústica.",
      "Untar la palta machacada sobre la tostada caliente, distribuyendo uniformemente.",
      "Espolvorear los 10 g de semillas de girasol y una pizca de sal de mar por encima. Consumir de inmediato mientras el pan está crujiente."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "sa10",
    nombre: "Smoothie tropical de mango y piña",
    tipo_comida: "snack_am",
    calorias_base: 170,
    proteinas_g: 3,
    carbohidratos_g: 38,
    grasas_g: 1,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "mango congelado", nombre_normalizado: "mango", nombre_display: "Mango", cantidad_base: 80, unidad: "g", unidad_compra: "bolsas", factor_conversion: 500, descripcion_compra: "bolsa de 500g" },
      { nombre: "piña en trozos", nombre_normalizado: "pina", nombre_display: "Piña", cantidad_base: 80, unidad: "g", unidad_compra: "unidades", factor_conversion: 1000, descripcion_compra: "unidad (~1kg)" },
      { nombre: "jugo de naranja", nombre_normalizado: "jugo_naranja", nombre_display: "Jugo de naranja", cantidad_base: 150, unidad: "ml", unidad_compra: "botellas", factor_conversion: 1000, descripcion_compra: "botella de 1L" }
    ],
    instrucciones: [
      "Si la piña es fresca, pelarla y cortarla en trozos de 2 cm. Si es enlatada o congelada, escurrir o descongelar.",
      "Colocar los 80 g de mango congelado, los 80 g de piña en trozos y los 150 ml de jugo de naranja en la licuadora.",
      "Licuar a máxima velocidad durante 30-45 segundos hasta obtener una mezcla homogénea y sin grumos.",
      "Probar la dulzura; si se necesita, agregar un toque de miel. Servir frío en un vaso grande. Se puede agregar hielo si se desea más frío."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "sa11",
    nombre: "Yogur natural con arándanos y chía",
    tipo_comida: "snack_am",
    calorias_base: 200,
    proteinas_g: 12,
    carbohidratos_g: 24,
    grasas_g: 7,
    es_sin_gluten: true,
    es_sin_lactosa: false,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "yogur natural", nombre_normalizado: "yogur_natural", nombre_display: "Yogur natural", cantidad_base: 150, unidad: "g", unidad_compra: "potes", factor_conversion: 500, descripcion_compra: "pote de 500g" },
      { nombre: "arándanos frescos", nombre_normalizado: "arandanos", nombre_display: "Arándanos", cantidad_base: 60, unidad: "g", unidad_compra: "bandejas", factor_conversion: 150, descripcion_compra: "bandeja de 150g" },
      { nombre: "semillas de chía", nombre_normalizado: "chia", nombre_display: "Semillas de chía", cantidad_base: 10, unidad: "g", unidad_compra: "paquetes", factor_conversion: 200, descripcion_compra: "paquete de 200g" }
    ],
    instrucciones: [
      "Colocar los 150 g de yogur natural en un bowl pequeño.",
      "Lavar los 60 g de arándanos frescos bajo el chorro de agua y sacudir el exceso.",
      "Distribuir los arándanos sobre el yogur.",
      "Espolvorear los 10 g de semillas de chía por encima. Las semillas se hidratarán parcialmente con el yogur, aportando textura y fibra.",
      "Consumir inmediatamente para disfrutar la frescura de los arándanos."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "sa12",
    nombre: "Rollitos de jamón de pavo con queso",
    tipo_comida: "snack_am",
    calorias_base: 150,
    proteinas_g: 16,
    carbohidratos_g: 2,
    grasas_g: 9,
    es_sin_gluten: true,
    es_sin_lactosa: false,
    es_vegetariana: false,
    ingredientes: [
      { nombre: "jamón de pavo", nombre_normalizado: "jamon_pavo", nombre_display: "Jamón de pavo", cantidad_base: 60, unidad: "g", unidad_compra: "paquetes", factor_conversion: 200, descripcion_compra: "paquete de 200g" },
      { nombre: "queso en láminas", nombre_normalizado: "queso_laminas", nombre_display: "Queso en láminas", cantidad_base: 30, unidad: "g", unidad_compra: "paquetes", factor_conversion: 200, descripcion_compra: "paquete de 200g" }
    ],
    instrucciones: [
      "Separar los 60 g de jamón de pavo en rebanadas individuales (aproximadamente 3-4 rebanadas).",
      "Cortar los 30 g de queso en láminas del mismo tamaño que las rebanadas de jamón.",
      "Colocar una lámina de queso sobre cada rebanada de jamón de pavo.",
      "Enrollar cada par formando rollitos apretados. Se pueden asegurar con un palillo si es necesario.",
      "Servir fríos en un plato. Snack proteico ideal para media mañana."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "sa13",
    nombre: "Pudin de chía con leche de coco",
    tipo_comida: "snack_am",
    calorias_base: 220,
    proteinas_g: 5,
    carbohidratos_g: 18,
    grasas_g: 14,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "semillas de chía", nombre_normalizado: "chia", nombre_display: "Semillas de chía", cantidad_base: 25, unidad: "g", unidad_compra: "paquetes", factor_conversion: 200, descripcion_compra: "paquete de 200g" },
      { nombre: "leche de coco", nombre_normalizado: "leche_coco", nombre_display: "Leche de coco", cantidad_base: 150, unidad: "ml", unidad_compra: "latas", factor_conversion: 400, descripcion_compra: "lata de 400ml" },
      { nombre: "miel de abeja", nombre_normalizado: "miel", nombre_display: "Miel de abeja", cantidad_base: 10, unidad: "ml", unidad_compra: "frascos", factor_conversion: 500, descripcion_compra: "frasco de 500ml" }
    ],
    instrucciones: [
      "En un frasco de vidrio con tapa, verter los 150 ml de leche de coco.",
      "Agregar los 25 g de semillas de chía y los 10 ml de miel de abeja.",
      "Revolver vigorosamente con una cuchara durante 1 minuto para evitar que las semillas se agrupen.",
      "Tapar y refrigerar al menos 4 horas (idealmente toda la noche). Las semillas absorberán el líquido y crearán una textura tipo pudín.",
      "Al servir, revolver una vez más. Se puede decorar con fruta fresca picada o coco rallado."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "sa14",
    nombre: "Trozos de pepino con limón y tajín",
    tipo_comida: "snack_am",
    calorias_base: 35,
    proteinas_g: 1,
    carbohidratos_g: 7,
    grasas_g: 0,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "pepino", nombre_normalizado: "pepino", nombre_display: "Pepino", cantidad_base: 1, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
      { nombre: "limón (jugo)", nombre_normalizado: "limon", nombre_display: "Limón", cantidad_base: 15, unidad: "ml", unidad_compra: "unidades", factor_conversion: 30, descripcion_compra: "unidad (~30ml jugo)" },
      { nombre: "chile en polvo", nombre_normalizado: "chile_polvo", nombre_display: "Chile en polvo", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" }
    ],
    instrucciones: [
      "Lavar el pepino. Pelarlo si se desea (dejando la cáscara se obtiene más fibra).",
      "Cortar el pepino en rodajas gruesas de 1 cm o en bastones de 8 cm de largo.",
      "Disponer los trozos de pepino en un plato o recipiente.",
      "Exprimir los 15 ml de jugo de limón fresco por encima, cubriendo todos los trozos.",
      "Espolvorear 1 g de chile en polvo al gusto. Mezclar con las manos o con una cuchara. Snack refrescante y picante ideal para días calurosos."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "sa15",
    nombre: "Compota de manzana con canela",
    tipo_comida: "snack_am",
    calorias_base: 130,
    proteinas_g: 1,
    carbohidratos_g: 32,
    grasas_g: 0,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "manzana roja", nombre_normalizado: "manzana", nombre_display: "Manzana roja", cantidad_base: 1.5, unidad: "unidades", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
      { nombre: "canela en polvo", nombre_normalizado: "canela", nombre_display: "Canela en polvo", cantidad_base: 2, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
      { nombre: "agua", nombre_normalizado: "agua", nombre_display: "Agua", cantidad_base: 50, unidad: "ml", unidad_compra: "botellas", factor_conversion: 1500, descripcion_compra: "botella de 1.5L" }
    ],
    instrucciones: [
      "Pelar las manzanas rojas y cortarlas en cubos pequeños de 1 cm, descartando el corazón y las semillas.",
      "Colocar los cubos de manzana en una olla pequeña junto con los 50 ml de agua y los 2 g de canela en polvo.",
      "Cocinar a fuego bajo durante 10-12 minutos, revolviendo de vez en cuando, hasta que la manzana esté blanda y se deshaga fácilmente.",
      "Retirar del fuego. Triturar con un tenedor hasta obtener la textura deseada (puede ser lisa o con algunos trozos).",
      "Servir tibia o dejar enfriar y refrigerar para consumir fría. Se conserva en la nevera por 3-4 días."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "sa16",
    nombre: "Bastones de zanahoria con hummus",
    tipo_comida: "snack_am",
    calorias_base: 140,
    proteinas_g: 5,
    carbohidratos_g: 18,
    grasas_g: 6,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "zanahoria", nombre_normalizado: "zanahoria", nombre_display: "Zanahoria", cantidad_base: 2, unidad: "unidades", unidad_compra: "kg", factor_conversion: 7, descripcion_compra: "~7 unidades por kg" },
      { nombre: "hummus", nombre_normalizado: "hummus", nombre_display: "Hummus", cantidad_base: 40, unidad: "g", unidad_compra: "potes", factor_conversion: 200, descripcion_compra: "pote de 200g" }
    ],
    instrucciones: [
      "Pelar las 2 zanahorias con un pelador de verduras.",
      "Cortar cada zanahoria en bastones de aproximadamente 8 cm de largo y 1 cm de grosor.",
      "Colocar los 40 g de hummus en un bowl pequeño o en el centro de un plato.",
      "Disponer los bastones de zanahoria alrededor del hummus. Dippear cada bastón en el hummus al consumir.",
      "Tip: se puede guardar preparado en un contenedor hermético con una servilleta húmeda para llevar."
    ],
    instrucciones_thermomix: []
  },

  // ======================== ALMUERZOS ========================
  {
    id: "a1",
    nombre: "Pollo al horno con arroz integral y ensalada fresca",
    tipo_comida: "almuerzo",
    calorias_base: 620,
    proteinas_g: 42,
    carbohidratos_g: 65,
    grasas_g: 18,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: false,
    ingredientes: [
      { nombre: "pechuga de pollo", nombre_normalizado: "pechuga_pollo", nombre_display: "Pechuga de pollo", cantidad_base: 180, unidad: "g", unidad_compra: "bandejas", factor_conversion: 500, descripcion_compra: "bandeja de 500g" },
      { nombre: "arroz integral", nombre_normalizado: "arroz_integral", nombre_display: "Arroz integral", cantidad_base: 100, unidad: "g", unidad_compra: "paquetes", factor_conversion: 500, descripcion_compra: "paquete de 500g" },
      { nombre: "lechuga romana", nombre_normalizado: "lechuga", nombre_display: "Lechuga romana", cantidad_base: 80, unidad: "g", unidad_compra: "unidades", factor_conversion: 300, descripcion_compra: "unidad (~300g)" },
      { nombre: "tomate", nombre_normalizado: "tomate", nombre_display: "Tomate", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
      { nombre: "pepino", nombre_normalizado: "pepino", nombre_display: "Pepino", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
      { nombre: "cebolla morada", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 0.25, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
      { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 15, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
      { nombre: "limón (jugo)", nombre_normalizado: "limon", nombre_display: "Limón", cantidad_base: 15, unidad: "ml", unidad_compra: "unidades", factor_conversion: 30, descripcion_compra: "unidad (~30ml jugo)" },
      { nombre: "orégano seco", nombre_normalizado: "oregano", nombre_display: "Orégano seco", cantidad_base: 3, unidad: "g", unidad_compra: "frascos", factor_conversion: 25, descripcion_compra: "frasco de 25g" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 3, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
      { nombre: "pimienta negra", nombre_normalizado: "pimienta", nombre_display: "Pimienta negra", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
      { nombre: "ajo en polvo", nombre_normalizado: "ajo_polvo", nombre_display: "Ajo en polvo", cantidad_base: 2, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" }
    ],
    instrucciones: [
      "En un bowl, mezclar los 15 ml de aceite de oliva, los 15 ml de jugo de limón, los 3 g de orégano seco, los 2 g de ajo en polvo, 2 g de sal y 1 g de pimienta negra. Colocar los 180 g de pechuga de pollo en la marinada, asegurándose de cubrirla por completo. Dejar reposar en la nevera durante 15-20 minutos.",
      "Mientras tanto, enjuagar los 100 g de arroz integral bajo el chorro de agua fría. Colocarlo en una olla mediana con 200 ml de agua y una pizca de sal. Llevar a ebullición, luego reducir el fuego al mínimo, tapar y cocinar durante 25-30 minutos sin destapar, hasta que el arroz absorba toda el agua. Retirar del fuego y dejar reposar tapado 5 minutos. Esponjar con un tenedor.",
      "Precalentar el horno a 200°C. Colocar la pechuga marinada en una bandeja para horno con papel aluminio. Hornear durante 25 minutos o hasta que el pollo esté dorado por fuera y al cortarlo no presente zonas rosadas. Dejar reposar 5 minutos antes de cortar.",
      "Mientras el pollo se hornea, preparar la ensalada: lavar y trocear los 80 g de lechuga romana en tiras. Cortar el tomate en gajos. Cortar el medio pepino en rodajas finas. Picar el cuarto de cebolla morada en julianas finas.",
      "Mezclar todos los vegetales de la ensalada en un bowl grande. Aliñar con el aceite de oliva restante, unas gotas de limón y la sal restante.",
      "Cortar la pechuga de pollo en láminas de medio centímetro. Servir sobre una cama de arroz integral, con la ensalada fresca al costado. Espolvorear un poco más de orégano si se desea."
    ],
    instrucciones_thermomix: [
      "Paso 1: Agregar cebolla en cuartos / 5 seg / Sin temperatura / Vel 5",
      "Paso 2: Añadir aceite de oliva y ajo / 3 min / 120°C / Vel 1",
      "Paso 3: Colocar arroz integral con 250ml de agua en el cestillo / 25 min / Varoma / Vel 2",
      "Paso 4: Simultáneamente colocar pechuga marinada en bandeja Varoma / 25 min / Varoma / Vel 2",
      "Paso 5: Retirar pollo y arroz. Dejar reposar 5 min.",
      "Paso 6: Preparar ensalada manualmente mientras reposa el pollo."
    ]
  },
  {
    id: "a2",
    nombre: "Porotos negros con arroz, plátano maduro y carne molida",
    tipo_comida: "almuerzo",
    calorias_base: 680,
    proteinas_g: 38,
    carbohidratos_g: 78,
    grasas_g: 22,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: false,
    ingredientes: [
      { nombre: "porotos negros cocidos", nombre_normalizado: "poroto_negro", nombre_display: "Porotos negros", cantidad_base: 150, unidad: "g", unidad_compra: "latas", factor_conversion: 400, descripcion_compra: "lata de 400g" },
      { nombre: "carne molida magra", nombre_normalizado: "carne_molida", nombre_display: "Carne molida magra", cantidad_base: 150, unidad: "g", unidad_compra: "bandejas", factor_conversion: 500, descripcion_compra: "bandeja de 500g" },
      { nombre: "arroz blanco", nombre_normalizado: "arroz_blanco", nombre_display: "Arroz blanco", cantidad_base: 100, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
      { nombre: "plátano maduro", nombre_normalizado: "platano", nombre_display: "Plátano", cantidad_base: 1, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
      { nombre: "cebolla blanca", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
      { nombre: "pimentón rojo", nombre_normalizado: "pimenton", nombre_display: "Pimentón rojo", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
      { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 2, unidad: "diente", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
      { nombre: "comino en polvo", nombre_normalizado: "comino", nombre_display: "Comino en polvo", cantidad_base: 3, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
      { nombre: "aceite vegetal", nombre_normalizado: "aceite_vegetal", nombre_display: "Aceite vegetal", cantidad_base: 15, unidad: "ml", unidad_compra: "botellas", factor_conversion: 1000, descripcion_compra: "botella de 1L" },
      { nombre: "cilantro fresco", nombre_normalizado: "cilantro", nombre_display: "Cilantro fresco", cantidad_base: 10, unidad: "g", unidad_compra: "manojos", factor_conversion: 50, descripcion_compra: "manojo" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 3, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Pelar y picar finamente la media cebolla blanca y los 2 dientes de ajo. Cortar el medio pimentón rojo en cubos pequeños de 1 cm. Picar los 10 g de cilantro fresco y reservar.",
      "Calentar los 15 ml de aceite vegetal en una sartén grande a fuego medio. Sofreír la cebolla picada durante 3 minutos hasta que esté transparente. Agregar el ajo y el pimentón, cocinar 2 minutos más revolviendo constantemente.",
      "Subir el fuego a medio-alto. Agregar los 150 g de carne molida magra, desmenuzándola con una cuchara de madera. Cocinar durante 5-6 minutos sin mover demasiado para que se dore bien.",
      "Añadir los 3 g de comino en polvo y los 3 g de sal. Incorporar los 150 g de porotos negros cocidos (escurridos pero reservando 3 cucharadas de su líquido). Agregar el líquido reservado. Cocinar a fuego medio-bajo por 10 minutos, revolviendo ocasionalmente, hasta que espese.",
      "Mientras se cocinan los porotos, preparar el arroz: enjuagar los 100 g de arroz blanco, colocar en una olla con 200 ml de agua y una pizca de sal. Hervir, tapar, reducir a fuego bajo y cocinar 15 minutos. Dejar reposar 5 minutos tapado.",
      "Pelar el plátano maduro y cortarlo en rodajas diagonales de 1 cm. Freír en una sartén con un poco de aceite a fuego medio-alto, 2 minutos por cada lado hasta que estén doradas y caramelizadas.",
      "Emplatar: servir una porción de arroz blanco en un lado del plato, los porotos con carne al costado, y las tajadas de plátano maduro frito. Decorar con el cilantro fresco picado por encima."
    ],
    instrucciones_thermomix: [
      "Paso 1: Agregar cebolla y ajo / 5 seg / Sin temperatura / Vel 5",
      "Paso 2: Añadir aceite / 3 min / 120°C / Vel 1",
      "Paso 3: Incorporar carne molida y pimentón picado / 8 min / 120°C / Vel Cuchara inversa",
      "Paso 4: Añadir porotos, comino y sal / 10 min / 100°C / Vel 1",
      "Paso 5: Colocar arroz con 200ml agua en cestillo encima / 15 min / Varoma / Vel 2",
      "Paso 6: Freír plátano maduro aparte en sartén hasta dorar.",
      "Paso 7: Emplatar arroz, porotos con carne y plátano. Decorar con cilantro."
    ]
  },
  {
    id: "a3",
    nombre: "Salmón a la plancha con quinoa y vegetales asados",
    tipo_comida: "almuerzo",
    calorias_base: 590,
    proteinas_g: 40,
    carbohidratos_g: 48,
    grasas_g: 24,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: false,
    ingredientes: [
      { nombre: "filete de salmón", nombre_normalizado: "salmon", nombre_display: "Filete de salmón", cantidad_base: 170, unidad: "g", unidad_compra: "filetes", factor_conversion: 200, descripcion_compra: "filete de ~200g" },
      { nombre: "quinoa", nombre_normalizado: "quinoa", nombre_display: "Quinoa", cantidad_base: 80, unidad: "g", unidad_compra: "paquetes", factor_conversion: 500, descripcion_compra: "paquete de 500g" },
      { nombre: "zapallo italiano (zucchini)", nombre_normalizado: "zapallo_italiano", nombre_display: "Zapallo italiano", cantidad_base: 1, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
      { nombre: "pimentón rojo", nombre_normalizado: "pimenton", nombre_display: "Pimentón rojo", cantidad_base: 1, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
      { nombre: "cebolla morada", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
      { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 15, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
      { nombre: "limón", nombre_normalizado: "limon", nombre_display: "Limón", cantidad_base: 1, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 30, descripcion_compra: "unidad (~30ml jugo)" },
      { nombre: "eneldo fresco", nombre_normalizado: "eneldo", nombre_display: "Eneldo fresco", cantidad_base: 5, unidad: "g", unidad_compra: "manojos", factor_conversion: 30, descripcion_compra: "manojo" },
      { nombre: "sal de mar", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 3, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
      { nombre: "pimienta negra", nombre_normalizado: "pimienta", nombre_display: "Pimienta negra", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" }
    ],
    instrucciones: [
      "Enjuagar los 80 g de quinoa bajo el chorro de agua fría en un colador fino durante 30 segundos (esto elimina la saponina amarga). Colocar en una olla con 160 ml de agua y una pizca de sal. Llevar a ebullición, tapar, reducir a fuego bajo y cocinar 15 minutos. Retirar del fuego y dejar reposar tapada 5 minutos. Esponjar con un tenedor.",
      "Precalentar el horno a 200°C. Cortar el zapallo italiano en medias lunas de 1 cm. Cortar el pimentón rojo en tiras anchas. Cortar la media cebolla morada en cuartos. Colocar todas las verduras en una bandeja para horno.",
      "Rociar las verduras con 10 ml de aceite de oliva, 2 g de sal y 1 g de pimienta negra. Mezclar con las manos para cubrir bien. Asar en el horno durante 20-25 minutos, dando vuelta a la mitad, hasta que estén doradas y tiernas en los bordes.",
      "Mientras los vegetales se asan, secar el filete de salmón (170 g) con papel absorbente. Sazonar ambos lados con sal, pimienta y el jugo de medio limón. Calentar una sartén a fuego medio-alto con los 5 ml restantes de aceite de oliva.",
      "Colocar el salmón con la piel hacia arriba. Cocinar 4 minutos sin mover hasta que se forme una costra dorada. Voltear con cuidado y cocinar 3-4 minutos más por el lado de la piel. El centro debe quedar ligeramente rosado.",
      "Emplatar: colocar una base de quinoa en el plato, apoyar el filete de salmón encima. Distribuir los vegetales asados alrededor. Exprimir el limón restante por encima.",
      "Picar finamente los 5 g de eneldo fresco y esparcir sobre el salmón y la quinoa. Servir inmediatamente."
    ],
    instrucciones_thermomix: [
      "Paso 1: Agregar quinoa con 200ml de agua / 15 min / 100°C / Vel 2",
      "Paso 2: Retirar quinoa y reservar.",
      "Paso 3: Colocar vegetales cortados en bandeja Varoma con aceite y especias.",
      "Paso 4: Poner salmón sazonado en cestillo / 18 min / Varoma / Vel 1",
      "Paso 5: Los vegetales se cocinan simultáneamente en Varoma arriba.",
      "Paso 6: Emplatar quinoa, salmón y vegetales. Exprimir limón y decorar con eneldo."
    ]
  },
  {
    id: "a4",
    nombre: "Lentejas guisadas con arroz y ensalada",
    tipo_comida: "almuerzo",
    calorias_base: 550,
    proteinas_g: 28,
    carbohidratos_g: 80,
    grasas_g: 12,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "lentejas secas", nombre_normalizado: "lentejas", nombre_display: "Lentejas secas", cantidad_base: 120, unidad: "g", unidad_compra: "paquetes", factor_conversion: 500, descripcion_compra: "paquete de 500g" },
      { nombre: "arroz blanco", nombre_normalizado: "arroz_blanco", nombre_display: "Arroz blanco", cantidad_base: 80, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
      { nombre: "zanahoria", nombre_normalizado: "zanahoria", nombre_display: "Zanahoria", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 7, descripcion_compra: "~7 unidades por kg" },
      { nombre: "papa", nombre_normalizado: "papa", nombre_display: "Papa", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
      { nombre: "cebolla blanca", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
      { nombre: "tomate", nombre_normalizado: "tomate", nombre_display: "Tomate", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
      { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 2, unidad: "diente", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
      { nombre: "comino en polvo", nombre_normalizado: "comino", nombre_display: "Comino en polvo", cantidad_base: 3, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
      { nombre: "cilantro fresco", nombre_normalizado: "cilantro", nombre_display: "Cilantro fresco", cantidad_base: 10, unidad: "g", unidad_compra: "manojos", factor_conversion: 50, descripcion_compra: "manojo" },
      { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 10, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 3, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
      { nombre: "laurel", nombre_normalizado: "laurel", nombre_display: "Hojas de laurel", cantidad_base: 1, unidad: "hoja", unidad_compra: "frascos", factor_conversion: 20, descripcion_compra: "frasco de ~20 hojas" }
    ],
    instrucciones: [
      "Si se usan lentejas secas, remojarlas en agua por al menos 1 hora antes de cocinar (las lentejas pardinas no necesitan remojo). Escurrir y enjuagar los 120 g de lentejas.",
      "Pelar y picar finamente la media cebolla blanca, los 2 dientes de ajo y la zanahoria en cubos pequeños de medio centímetro. Rallar el tomate por la parte gruesa del rallador, descartando la piel. Pelar la papa y cortarla en cubos de 2 cm.",
      "Calentar los 10 ml de aceite de oliva en una olla mediana a fuego medio. Sofreír la cebolla y el ajo durante 3-4 minutos hasta que estén transparentes. Agregar la zanahoria picada y cocinar 2 minutos más.",
      "Incorporar el tomate rallado, los 3 g de comino en polvo y la hoja de laurel. Cocinar revolviendo por 3 minutos hasta que el tomate reduzca y oscurezca.",
      "Agregar las lentejas escurridas y los cubos de papa. Cubrir con 600 ml de agua (el agua debe sobrepasar las lentejas por 3 cm). Llevar a ebullición, luego reducir a fuego bajo. Cocinar tapado durante 25-30 minutos, revolviendo cada 10 minutos, hasta que las lentejas y la papa estén completamente tiernas.",
      "Mientras se cocinan las lentejas, preparar el arroz: enjuagar los 80 g de arroz blanco, colocar en una olla con 160 ml de agua y sal. Hervir, tapar, reducir a fuego bajo y cocinar 15 minutos.",
      "Ajustar la sal de las lentejas (3 g en total). Retirar la hoja de laurel. Si el guiso quedó muy líquido, cocinar destapado 5 minutos más para espesar.",
      "Servir las lentejas guisadas sobre una cama de arroz blanco. Picar los 10 g de cilantro fresco y espolvorear generosamente por encima. Acompañar con un chorrito de limón si se desea."
    ],
    instrucciones_thermomix: [
      "Paso 1: Agregar cebolla y ajo / 5 seg / Sin temperatura / Vel 5",
      "Paso 2: Añadir aceite de oliva / 3 min / 120°C / Vel 1",
      "Paso 3: Incorporar zanahoria picada, tomate rallado, comino y laurel / 5 min / 100°C / Vel 1",
      "Paso 4: Añadir lentejas remojadas, papa en cubos y 500ml de agua / 25 min / 100°C / Vel 1",
      "Paso 5: Colocar arroz con agua en cestillo encima / durante los últimos 15 min / Varoma / Vel 1",
      "Paso 6: Servir lentejas con arroz y decorar con cilantro."
    ]
  },
  {
    id: "a5",
    nombre: "Tacos de pollo con guacamole y pico de gallo",
    tipo_comida: "almuerzo",
    calorias_base: 560,
    proteinas_g: 35,
    carbohidratos_g: 50,
    grasas_g: 24,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: false,
    ingredientes: [
      { nombre: "pechuga de pollo", nombre_normalizado: "pechuga_pollo", nombre_display: "Pechuga de pollo", cantidad_base: 160, unidad: "g", unidad_compra: "bandejas", factor_conversion: 500, descripcion_compra: "bandeja de 500g" },
      { nombre: "tortillas de maíz", nombre_normalizado: "tortillas_maiz", nombre_display: "Tortillas de maíz", cantidad_base: 3, unidad: "unidades", unidad_compra: "paquetes", factor_conversion: 12, descripcion_compra: "paquete de 12 unid." },
      { nombre: "palta (aguacate)", nombre_normalizado: "palta", nombre_display: "Palta (aguacate)", cantidad_base: 1, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
      { nombre: "tomate", nombre_normalizado: "tomate", nombre_display: "Tomate", cantidad_base: 2, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
      { nombre: "cebolla blanca", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
      { nombre: "chile jalapeño", nombre_normalizado: "chile_jalapeno", nombre_display: "Chile jalapeño", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
      { nombre: "cilantro fresco", nombre_normalizado: "cilantro", nombre_display: "Cilantro fresco", cantidad_base: 15, unidad: "g", unidad_compra: "manojos", factor_conversion: 50, descripcion_compra: "manojo" },
      { nombre: "limón (jugo)", nombre_normalizado: "limon", nombre_display: "Limón", cantidad_base: 30, unidad: "ml", unidad_compra: "unidades", factor_conversion: 30, descripcion_compra: "unidad (~30ml jugo)" },
      { nombre: "comino en polvo", nombre_normalizado: "comino", nombre_display: "Comino en polvo", cantidad_base: 3, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
      { nombre: "pimentón en polvo", nombre_normalizado: "pimenton_polvo", nombre_display: "Pimentón en polvo", cantidad_base: 3, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
      { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 10, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 3, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Cortar los 160 g de pechuga de pollo en tiras de 1 cm de grosor. En un bowl, mezclar las tiras con los 3 g de comino en polvo, los 3 g de pimentón en polvo, 2 g de sal y 15 ml de jugo de limón. Dejar marinar 10-15 minutos.",
      "Mientras tanto, preparar el guacamole: cortar la palta por la mitad, retirar el hueso y extraer la pulpa con una cuchara. Machacarla con un tenedor en un bowl hasta obtener una textura rústica. Agregar 10 ml de jugo de limón, una pizca de sal y 5 g de cilantro fresco picado. Mezclar bien.",
      "Preparar el pico de gallo: picar los 2 tomates en cubos pequeños de medio centímetro. Picar finamente la media cebolla blanca. Cortar el medio chile jalapeño en rodajas muy finas (retirar las semillas si se prefiere menos picante). Picar 10 g de cilantro fresco. Mezclar todo en un bowl con el limón restante (5 ml) y una pizca de sal.",
      "Calentar los 10 ml de aceite de oliva en una sartén a fuego medio-alto. Cocinar las tiras de pollo marinado durante 3-4 minutos por cada lado hasta que estén doradas y bien cocidas. Retirar y dejar reposar 2 minutos. Desmenuzar o cortar en trozos pequeños con dos tenedores.",
      "Calentar las 3 tortillas de maíz en un comal o sartén seca a fuego medio-alto, 30 segundos por cada lado hasta que estén flexibles y con marcas de calor. Envolver en un paño limpio para mantenerlas calientes.",
      "Armar los tacos: colocar una porción de pollo desmenuzado en cada tortilla caliente. Agregar una cucharada generosa de guacamole y otra de pico de gallo. Decorar con hojas de cilantro fresco. Servir inmediatamente."
    ],
    instrucciones_thermomix: [
      "Paso 1: Colocar pechuga sazonada en bandeja Varoma / 20 min / Varoma / Vel 2",
      "Paso 2: Mientras, picar cebolla / 3 seg / Sin temperatura / Vel 4",
      "Paso 3: Agregar tomate, jalapeño y cilantro / 3 seg / Sin temperatura / Vel 3 (pico de gallo)",
      "Paso 4: Retirar pico de gallo. Procesar palta con limón y sal / 10 seg / Sin temperatura / Vel 4",
      "Paso 5: Desmenuzar pollo cocido manualmente.",
      "Paso 6: Calentar tortillas en sartén aparte. Armar tacos."
    ]
  },
  {
    id: "a6",
    nombre: "Bowl de quinoa con porotos negros y choclo",
    tipo_comida: "almuerzo",
    calorias_base: 520,
    proteinas_g: 24,
    carbohidratos_g: 72,
    grasas_g: 16,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "quinoa", nombre_normalizado: "quinoa", nombre_display: "Quinoa", cantidad_base: 90, unidad: "g", unidad_compra: "paquetes", factor_conversion: 500, descripcion_compra: "paquete de 500g" },
      { nombre: "porotos negros cocidos", nombre_normalizado: "poroto_negro", nombre_display: "Porotos negros", cantidad_base: 120, unidad: "g", unidad_compra: "latas", factor_conversion: 400, descripcion_compra: "lata de 400g" },
      { nombre: "choclo (granos)", nombre_normalizado: "choclo", nombre_display: "Choclo (granos)", cantidad_base: 80, unidad: "g", unidad_compra: "latas", factor_conversion: 300, descripcion_compra: "lata de 300g" },
      { nombre: "palta (aguacate)", nombre_normalizado: "palta", nombre_display: "Palta (aguacate)", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
      { nombre: "tomates cherry", nombre_normalizado: "tomate_cherry", nombre_display: "Tomates cherry", cantidad_base: 80, unidad: "g", unidad_compra: "bandejas", factor_conversion: 250, descripcion_compra: "bandeja de 250g" },
      { nombre: "cebolla morada", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 0.25, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
      { nombre: "cilantro fresco", nombre_normalizado: "cilantro", nombre_display: "Cilantro fresco", cantidad_base: 10, unidad: "g", unidad_compra: "manojos", factor_conversion: 50, descripcion_compra: "manojo" },
      { nombre: "limón (jugo)", nombre_normalizado: "limon", nombre_display: "Limón", cantidad_base: 20, unidad: "ml", unidad_compra: "unidades", factor_conversion: 30, descripcion_compra: "unidad (~30ml jugo)" },
      { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 15, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
      { nombre: "comino en polvo", nombre_normalizado: "comino", nombre_display: "Comino en polvo", cantidad_base: 2, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 2, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Enjuagar los 90 g de quinoa en un colador fino bajo el chorro de agua durante 30 segundos. Colocar en una olla con 180 ml de agua y una pizca de sal. Llevar a ebullición, tapar, reducir a fuego bajo y cocinar 15 minutos. Retirar del fuego, dejar reposar tapada 5 minutos y esponjar con un tenedor.",
      "Escurrir y enjuagar los 120 g de porotos negros cocidos. Calentarlos en una olla pequeña a fuego medio con los 2 g de comino en polvo y una pizca de sal durante 3-4 minutos, revolviendo para que el comino se integre.",
      "Escurrir los 80 g de granos de choclo. Si son congelados, calentarlos brevemente en el microondas o en sartén seca.",
      "Lavar y cortar los 80 g de tomates cherry por la mitad. Picar finamente el cuarto de cebolla morada en cubitos. Cortar la media palta en láminas o cubos de 1 cm.",
      "Preparar la vinagreta: en un recipiente pequeño, mezclar los 15 ml de aceite de oliva, los 20 ml de jugo de limón y la sal restante (1 g). Batir con un tenedor hasta emulsionar.",
      "Armar el bowl: distribuir la quinoa como base en un bowl amplio. Colocar los porotos negros, los granos de choclo, los tomates cherry y la cebolla morada en secciones separadas sobre la quinoa. Coronar con las láminas de palta en el centro.",
      "Rociar con la vinagreta. Picar los 10 g de cilantro fresco y esparcir generosamente por encima. Mezclar al momento de comer o disfrutar las capas por separado."
    ],
    instrucciones_thermomix: [
      "Paso 1: Colocar quinoa con 200ml de agua / 15 min / 100°C / Vel 2",
      "Paso 2: Retirar quinoa y reservar.",
      "Paso 3: Agregar porotos con comino / 5 min / 100°C / Vel 1",
      "Paso 4: Armar bowls manualmente con quinoa, porotos calientes, choclo, tomates, cebolla y palta.",
      "Paso 5: Aliñar con aceite, limón y cilantro."
    ]
  },

  {
    id: "a7",
    nombre: "Pasta con salsa boloñesa casera",
    tipo_comida: "almuerzo",
    calorias_base: 650,
    proteinas_g: 35,
    carbohidratos_g: 70,
    grasas_g: 22,
    es_sin_gluten: false,
    es_sin_lactosa: true,
    es_vegetariana: false,
    ingredientes: [
      { nombre: "espagueti", nombre_normalizado: "espagueti", nombre_display: "Espagueti", cantidad_base: 120, unidad: "g", unidad_compra: "paquetes", factor_conversion: 500, descripcion_compra: "paquete de 500g" },
      { nombre: "carne molida magra", nombre_normalizado: "carne_molida", nombre_display: "Carne molida magra", cantidad_base: 150, unidad: "g", unidad_compra: "bandejas", factor_conversion: 500, descripcion_compra: "bandeja de 500g" },
      { nombre: "salsa de tomate", nombre_normalizado: "salsa_tomate", nombre_display: "Salsa de tomate", cantidad_base: 150, unidad: "ml", unidad_compra: "frascos", factor_conversion: 400, descripcion_compra: "frasco de 400ml" },
      { nombre: "cebolla blanca", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
      { nombre: "zanahoria", nombre_normalizado: "zanahoria", nombre_display: "Zanahoria", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 7, descripcion_compra: "~7 unidades por kg" },
      { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 2, unidad: "diente", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
      { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 10, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
      { nombre: "orégano seco", nombre_normalizado: "oregano", nombre_display: "Orégano seco", cantidad_base: 2, unidad: "g", unidad_compra: "frascos", factor_conversion: 25, descripcion_compra: "frasco de 25g" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 3, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
      { nombre: "pimienta negra", nombre_normalizado: "pimienta", nombre_display: "Pimienta negra", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" }
    ],
    instrucciones: [
      "Pelar y picar finamente la media cebolla blanca, los 2 dientes de ajo y pelar la zanahoria. Rallar la zanahoria por el lado fino del rallador (esto le aporta dulzura natural a la salsa y se deshace al cocinar).",
      "Calentar los 10 ml de aceite de oliva en una sartén honda a fuego medio. Sofreír la cebolla 3 minutos hasta que esté transparente. Agregar el ajo y la zanahoria rallada. Cocinar 2 minutos más.",
      "Subir el fuego a medio-alto. Agregar los 150 g de carne molida magra. Distribuir en una capa y dejar dorar 2 minutos sin mover. Luego desmenuzar con cuchara de madera y cocinar 5 minutos hasta que no queden zonas rosadas.",
      "Verter los 150 ml de salsa de tomate. Agregar los 2 g de orégano seco, la sal y la pimienta. Mezclar bien. Reducir el fuego a bajo, tapar parcialmente y cocinar 15-20 minutos revolviendo cada 5 minutos hasta que la salsa espese y oscurezca.",
      "Mientras tanto, hervir abundante agua con sal generosa en una olla grande. Cuando hierva a borbotones, agregar los 120 g de espagueti en abanico. Cocinar según las indicaciones del paquete (generalmente 8-10 minutos) hasta que estén al dente. Reservar media taza del agua de cocción antes de escurrir.",
      "Escurrir la pasta y agregarla directamente a la sartén con la salsa boloñesa. Mezclar a fuego bajo durante 1-2 minutos para que la pasta absorba los sabores. Si queda seca, agregar un poco del agua de cocción reservada.",
      "Servir en platos hondos con la salsa cubriendo bien la pasta. Espolvorear orégano extra si se desea."
    ],
    instrucciones_thermomix: [
      "Paso 1: Agregar cebolla y ajo / 5 seg / Sin temperatura / Vel 5",
      "Paso 2: Añadir aceite / 3 min / 120°C / Vel 1",
      "Paso 3: Incorporar carne molida y zanahoria rallada / 8 min / 120°C / Vel Cuchara inversa",
      "Paso 4: Agregar salsa de tomate, orégano, sal y pimienta / 15 min / 100°C / Vel 1",
      "Paso 5: Cocinar espagueti en olla aparte hasta al dente.",
      "Paso 6: Mezclar pasta con salsa y servir."
    ]
  },
  {
    id: "a8",
    nombre: "Arroz con pollo y vegetales salteados",
    tipo_comida: "almuerzo",
    calorias_base: 580,
    proteinas_g: 38,
    carbohidratos_g: 62,
    grasas_g: 16,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: false,
    ingredientes: [
      { nombre: "pechuga de pollo", nombre_normalizado: "pechuga_pollo", nombre_display: "Pechuga de pollo", cantidad_base: 160, unidad: "g", unidad_compra: "bandejas", factor_conversion: 500, descripcion_compra: "bandeja de 500g" },
      { nombre: "arroz blanco", nombre_normalizado: "arroz_blanco", nombre_display: "Arroz blanco", cantidad_base: 100, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
      { nombre: "pimentón rojo", nombre_normalizado: "pimenton", nombre_display: "Pimentón rojo", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
      { nombre: "zanahoria", nombre_normalizado: "zanahoria", nombre_display: "Zanahoria", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 7, descripcion_compra: "~7 unidades por kg" },
      { nombre: "arvejas congeladas", nombre_normalizado: "arvejas", nombre_display: "Arvejas", cantidad_base: 50, unidad: "g", unidad_compra: "bolsas", factor_conversion: 500, descripcion_compra: "bolsa de 500g" },
      { nombre: "cebolla blanca", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
      { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 2, unidad: "diente", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
      { nombre: "aceite vegetal", nombre_normalizado: "aceite_vegetal", nombre_display: "Aceite vegetal", cantidad_base: 10, unidad: "ml", unidad_compra: "botellas", factor_conversion: 1000, descripcion_compra: "botella de 1L" },
      { nombre: "salsa de soya", nombre_normalizado: "salsa_soya", nombre_display: "Salsa de soya", cantidad_base: 15, unidad: "ml", unidad_compra: "botellas", factor_conversion: 250, descripcion_compra: "botella de 250ml" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 2, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Cocinar primero el arroz: enjuagar los 100 g de arroz blanco, colocar en una olla con 200 ml de agua y sal. Llevar a ebullición, tapar, reducir a fuego mínimo y cocinar 15 minutos sin destapar. Retirar y dejar reposar tapado 5 minutos. Esponjar con tenedor.",
      "Mientras el arroz se cocina, cortar los 160 g de pechuga de pollo en cubos de 2 cm. Sazonar con sal y un chorrito de salsa de soya. Pelar y picar la media cebolla y los 2 dientes de ajo finamente. Pelar la zanahoria y cortarla en cubitos. Cortar el medio pimentón en tiras.",
      "Calentar los 10 ml de aceite vegetal en un wok o sartén grande a fuego alto. Cuando humee ligeramente, agregar los cubos de pollo. Saltear sin mover 2 minutos, voltear y cocinar 3 minutos más hasta dorar. Retirar y reservar.",
      "En la misma sartén, agregar la cebolla y el ajo. Saltear 2 minutos. Añadir la zanahoria en cubitos y cocinar 3 minutos. Incorporar el pimentón rojo y las 50 g de arvejas congeladas. Saltear 2 minutos más.",
      "Devolver el pollo a la sartén. Agregar los 15 ml de salsa de soya restante. Mezclar todo vigorosamente durante 1-2 minutos a fuego alto.",
      "Servir el arroz en un plato con los vegetales y el pollo salteado encima. Acompañar con salsa de soya adicional al costado."
    ],
    instrucciones_thermomix: [
      "Paso 1: Colocar arroz con 200ml agua / 15 min / 100°C / Vel 1. Retirar y reservar.",
      "Paso 2: Picar cebolla y ajo / 5 seg / Vel 5. Añadir aceite / 3 min / 120°C / Vel 1",
      "Paso 3: Agregar pollo en cubos / 5 min / 120°C / Vel Cuchara inversa",
      "Paso 4: Incorporar zanahoria, pimentón, arvejas y salsa de soya / 5 min / 100°C / Vel Cuchara inversa",
      "Paso 5: Servir arroz con pollo y vegetales encima."
    ]
  },
  {
    id: "a9",
    nombre: "Estofado de carne con papas y vegetales",
    tipo_comida: "almuerzo",
    calorias_base: 640,
    proteinas_g: 40,
    carbohidratos_g: 55,
    grasas_g: 26,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: false,
    ingredientes: [
      { nombre: "carne de res para guisar", nombre_normalizado: "carne_res", nombre_display: "Carne de res", cantidad_base: 180, unidad: "g", unidad_compra: "bandejas", factor_conversion: 500, descripcion_compra: "bandeja de 500g" },
      { nombre: "papa", nombre_normalizado: "papa", nombre_display: "Papa", cantidad_base: 2, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
      { nombre: "zanahoria", nombre_normalizado: "zanahoria", nombre_display: "Zanahoria", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 7, descripcion_compra: "~7 unidades por kg" },
      { nombre: "cebolla blanca", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
      { nombre: "tomate", nombre_normalizado: "tomate", nombre_display: "Tomate", cantidad_base: 2, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
      { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 3, unidad: "diente", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
      { nombre: "comino en polvo", nombre_normalizado: "comino", nombre_display: "Comino en polvo", cantidad_base: 3, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
      { nombre: "aceite vegetal", nombre_normalizado: "aceite_vegetal", nombre_display: "Aceite vegetal", cantidad_base: 15, unidad: "ml", unidad_compra: "botellas", factor_conversion: 1000, descripcion_compra: "botella de 1L" },
      { nombre: "caldo de carne", nombre_normalizado: "caldo_carne", nombre_display: "Caldo de carne", cantidad_base: 300, unidad: "ml", unidad_compra: "cajas", factor_conversion: 1000, descripcion_compra: "caja de 1L" },
      { nombre: "cilantro fresco", nombre_normalizado: "cilantro", nombre_display: "Cilantro fresco", cantidad_base: 10, unidad: "g", unidad_compra: "manojos", factor_conversion: 50, descripcion_compra: "manojo" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 3, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Cortar los 180 g de carne de res en cubos de 3 cm. Secar bien con papel absorbente (esto es clave para que se dore bien). Sazonar generosamente con sal y los 3 g de comino en polvo.",
      "Pelar y picar la cebolla entera en cubos medianos. Picar los 3 dientes de ajo. Rallar los 2 tomates por el lado grueso del rallador, descartando la piel. Pelar las 2 papas y la zanahoria y cortarlas en cubos de 3 cm.",
      "Calentar los 15 ml de aceite vegetal en una olla pesada a fuego alto. Cuando el aceite humee, agregar la carne en una sola capa (en tandas si es necesario). Dorar sin mover 3 minutos por cada lado hasta obtener una costra oscura. Retirar y reservar.",
      "En la misma olla, reducir a fuego medio. Agregar la cebolla y el ajo. Sofreír 4 minutos. Incorporar el tomate rallado y cocinar 5 minutos revolviendo hasta que oscurezca y pierda la acidez.",
      "Devolver la carne a la olla. Verter los 300 ml de caldo de carne caliente. El líquido debe cubrir la carne. Llevar a ebullición, luego reducir a fuego bajo. Tapar y cocinar 30 minutos.",
      "Agregar las papas y la zanahoria en cubos. Revolver con cuidado. Tapar nuevamente y cocinar 20-25 minutos más hasta que las papas se deshagan ligeramente y la carne esté tierna.",
      "Ajustar la sal. Si el caldo está muy líquido, cocinar destapado 5 minutos. Picar los 10 g de cilantro fresco. Servir el estofado caliente en platos hondos con el cilantro por encima."
    ],
    instrucciones_thermomix: [
      "Paso 1: Picar cebolla y ajo / 5 seg / Vel 5",
      "Paso 2: Añadir aceite / 3 min / 120°C / Vel 1",
      "Paso 3: Agregar carne en cubos / 5 min / 120°C / Vel Cuchara inversa",
      "Paso 4: Incorporar tomate rallado y comino / 5 min / 100°C / Vel 1",
      "Paso 5: Añadir caldo, papas y zanahoria / 40 min / 100°C / Vel 1",
      "Paso 6: Servir con cilantro fresco picado."
    ]
  },
  {
    id: "a10",
    nombre: "Hamburguesa casera con ensalada",
    tipo_comida: "almuerzo",
    calorias_base: 600,
    proteinas_g: 36,
    carbohidratos_g: 50,
    grasas_g: 28,
    es_sin_gluten: false,
    es_sin_lactosa: false,
    es_vegetariana: false,
    ingredientes: [
      { nombre: "carne molida magra", nombre_normalizado: "carne_molida", nombre_display: "Carne molida magra", cantidad_base: 150, unidad: "g", unidad_compra: "bandejas", factor_conversion: 500, descripcion_compra: "bandeja de 500g" },
      { nombre: "pan de hamburguesa integral", nombre_normalizado: "pan_hamburguesa", nombre_display: "Pan de hamburguesa", cantidad_base: 1, unidad: "unidad", unidad_compra: "paquetes", factor_conversion: 4, descripcion_compra: "paquete de 4 unid." },
      { nombre: "queso cheddar", nombre_normalizado: "queso_cheddar", nombre_display: "Queso cheddar", cantidad_base: 30, unidad: "g", unidad_compra: "paquetes", factor_conversion: 200, descripcion_compra: "paquete de 200g" },
      { nombre: "lechuga", nombre_normalizado: "lechuga", nombre_display: "Lechuga", cantidad_base: 40, unidad: "g", unidad_compra: "unidades", factor_conversion: 300, descripcion_compra: "unidad (~300g)" },
      { nombre: "tomate", nombre_normalizado: "tomate", nombre_display: "Tomate", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
      { nombre: "cebolla morada", nombre_normalizado: "cebolla", nombre_display: "Cebolla morada", cantidad_base: 0.25, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
      { nombre: "pepino", nombre_normalizado: "pepino", nombre_display: "Pepino", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
      { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 5, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 2, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
      { nombre: "pimienta negra", nombre_normalizado: "pimienta", nombre_display: "Pimienta negra", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" }
    ],
    instrucciones: [
      "Colocar los 150 g de carne molida en un bowl. Sazonar con los 2 g de sal y 1 g de pimienta negra. Mezclar brevemente sin amasar demasiado (el exceso de manipulación endurece la carne). Formar una hamburguesa de 1.5 cm de grosor, ligeramente más grande que el pan (se encogerá al cocinar). Hacer una pequeña hendidura en el centro con el pulgar para que no se infle.",
      "Calentar una sartén de hierro o plancha a fuego alto hasta que esté muy caliente. Agregar los 5 ml de aceite de oliva. Colocar la hamburguesa y cocinar 4 minutos sin mover ni presionar (esto asegura una buena costra). Voltear una sola vez y cocinar 3-4 minutos más para término medio, 5 minutos para bien cocida.",
      "En el último minuto de cocción, colocar los 30 g de queso cheddar en lámina sobre la hamburguesa. Tapar la sartén para que el calor derrita el queso.",
      "Cortar el pan de hamburguesa por la mitad y tostar brevemente en la misma sartén con los jugos de la carne (30 segundos por cada lado cortado).",
      "Preparar la ensalada fresca: lavar y trocear los 40 g de lechuga. Cortar el tomate en rodajas gruesas. Cortar el cuarto de cebolla morada en aros finos. Cortar el medio pepino en rodajas. Mezclar todo y aliñar con aceite de oliva y sal.",
      "Armar la hamburguesa: colocar lechuga en la base del pan, luego la hamburguesa con queso, rodajas de tomate y aros de cebolla. Tapar con la otra mitad del pan. Servir junto a la ensalada fresca."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "a11",
    nombre: "Pollo al curry con arroz basmati",
    tipo_comida: "almuerzo",
    calorias_base: 610,
    proteinas_g: 38,
    carbohidratos_g: 65,
    grasas_g: 20,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: false,
    ingredientes: [
      { nombre: "pechuga de pollo", nombre_normalizado: "pechuga_pollo", nombre_display: "Pechuga de pollo", cantidad_base: 170, unidad: "g", unidad_compra: "bandejas", factor_conversion: 500, descripcion_compra: "bandeja de 500g" },
      { nombre: "arroz basmati", nombre_normalizado: "arroz_basmati", nombre_display: "Arroz basmati", cantidad_base: 100, unidad: "g", unidad_compra: "paquetes", factor_conversion: 500, descripcion_compra: "paquete de 500g" },
      { nombre: "leche de coco", nombre_normalizado: "leche_coco", nombre_display: "Leche de coco", cantidad_base: 120, unidad: "ml", unidad_compra: "latas", factor_conversion: 400, descripcion_compra: "lata de 400ml" },
      { nombre: "curry en polvo", nombre_normalizado: "curry", nombre_display: "Curry en polvo", cantidad_base: 8, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
      { nombre: "cebolla blanca", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
      { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 2, unidad: "diente", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
      { nombre: "jengibre fresco", nombre_normalizado: "jengibre", nombre_display: "Jengibre fresco", cantidad_base: 10, unidad: "g", unidad_compra: "trozos", factor_conversion: 50, descripcion_compra: "trozo de ~50g" },
      { nombre: "tomate", nombre_normalizado: "tomate", nombre_display: "Tomate", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
      { nombre: "aceite vegetal", nombre_normalizado: "aceite_vegetal", nombre_display: "Aceite vegetal", cantidad_base: 10, unidad: "ml", unidad_compra: "botellas", factor_conversion: 1000, descripcion_compra: "botella de 1L" },
      { nombre: "cilantro fresco", nombre_normalizado: "cilantro", nombre_display: "Cilantro fresco", cantidad_base: 10, unidad: "g", unidad_compra: "manojos", factor_conversion: 50, descripcion_compra: "manojo" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 3, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Cortar los 170 g de pechuga de pollo en cubos de 2 cm. Sazonar con sal y la mitad del curry en polvo (4 g). Mezclar y dejar marinar 10 minutos.",
      "Pelar y picar finamente la media cebolla, los 2 dientes de ajo y los 10 g de jengibre fresco (rallarlo con un rallador fino). Picar el tomate en cubos pequeños.",
      "Calentar los 10 ml de aceite vegetal en una sartén honda o cacerola a fuego medio-alto. Dorar los cubos de pollo durante 4-5 minutos por todos los lados. Retirar y reservar.",
      "En la misma sartén, sofreír la cebolla 3 minutos. Agregar el ajo y el jengibre rallado, cocinar 1 minuto hasta que suelte su aroma. Incorporar el tomate picado y cocinar 3 minutos hasta que se ablande.",
      "Agregar los 4 g restantes de curry en polvo. Revolver 30 segundos para activar las especias (deben soltar su aroma). Verter los 120 ml de leche de coco y mezclar bien.",
      "Devolver el pollo a la sartén. Reducir el fuego a bajo, tapar y cocinar 12-15 minutos hasta que la salsa espese y el pollo esté completamente cocido.",
      "Mientras tanto, enjuagar los 100 g de arroz basmati en 3 cambios de agua. Cocinar con 180 ml de agua y sal durante 12 minutos a fuego bajo. Dejar reposar tapado 5 minutos.",
      "Servir el arroz basmati en un lado del plato y el pollo al curry en el otro. Picar los 10 g de cilantro fresco y esparcir generosamente por encima."
    ],
    instrucciones_thermomix: [
      "Paso 1: Picar cebolla, ajo y jengibre / 5 seg / Vel 5",
      "Paso 2: Añadir aceite / 3 min / 120°C / Vel 1",
      "Paso 3: Agregar pollo en cubos y curry / 5 min / 120°C / Vel Cuchara inversa",
      "Paso 4: Incorporar tomate y leche de coco / 15 min / 100°C / Vel 1",
      "Paso 5: Colocar arroz con agua en cestillo / durante los últimos 12 min / Varoma / Vel 1",
      "Paso 6: Servir arroz con curry de pollo. Decorar con cilantro."
    ]
  },
  {
    id: "a12",
    nombre: "Ensalada César con pollo a la plancha",
    tipo_comida: "almuerzo",
    calorias_base: 480,
    proteinas_g: 38,
    carbohidratos_g: 28,
    grasas_g: 24,
    es_sin_gluten: false,
    es_sin_lactosa: false,
    es_vegetariana: false,
    ingredientes: [
      { nombre: "pechuga de pollo", nombre_normalizado: "pechuga_pollo", nombre_display: "Pechuga de pollo", cantidad_base: 150, unidad: "g", unidad_compra: "bandejas", factor_conversion: 500, descripcion_compra: "bandeja de 500g" },
      { nombre: "lechuga romana", nombre_normalizado: "lechuga", nombre_display: "Lechuga romana", cantidad_base: 150, unidad: "g", unidad_compra: "unidades", factor_conversion: 300, descripcion_compra: "unidad (~300g)" },
      { nombre: "pan de molde integral", nombre_normalizado: "pan_integral", nombre_display: "Pan integral", cantidad_base: 2, unidad: "rebanadas", unidad_compra: "paquetes", factor_conversion: 20, descripcion_compra: "paquete de ~20 rebanadas" },
      { nombre: "queso parmesano rallado", nombre_normalizado: "queso_parmesano", nombre_display: "Queso parmesano", cantidad_base: 20, unidad: "g", unidad_compra: "paquetes", factor_conversion: 100, descripcion_compra: "paquete de 100g" },
      { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 15, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
      { nombre: "limón (jugo)", nombre_normalizado: "limon", nombre_display: "Limón", cantidad_base: 15, unidad: "ml", unidad_compra: "unidades", factor_conversion: 30, descripcion_compra: "unidad (~30ml jugo)" },
      { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 1, unidad: "diente", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 2, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
      { nombre: "pimienta negra", nombre_normalizado: "pimienta", nombre_display: "Pimienta negra", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" }
    ],
    instrucciones: [
      "Sazonar los 150 g de pechuga de pollo con sal, pimienta y un chorrito de aceite de oliva. Calentar una sartén o plancha a fuego medio-alto. Cocinar la pechuga 5-6 minutos por cada lado hasta que esté dorada y completamente cocida. Dejar reposar 5 minutos y luego cortar en tiras de 1 cm.",
      "Preparar los crutones caseros: cortar las 2 rebanadas de pan integral en cubos de 1 cm. Calentar un poco de aceite de oliva en una sartén con el diente de ajo machacado. Agregar los cubos de pan y tostar a fuego medio durante 4-5 minutos, revolviendo frecuentemente, hasta que estén dorados y crujientes por todos los lados. Retirar el ajo.",
      "Preparar el aderezo César ligero: en un bowl pequeño, mezclar 10 ml de aceite de oliva, los 15 ml de jugo de limón, 10 g del queso parmesano rallado y una pizca de sal. Batir con un tenedor hasta obtener una emulsión.",
      "Lavar los 150 g de lechuga romana, secar bien con un centrifugador de lechuga o papel absorbente (la lechuga húmeda diluye el aderezo). Cortar en trozos grandes.",
      "En un bowl grande, colocar la lechuga. Verter el aderezo y mezclar con las manos o pinzas para cubrir cada hoja.",
      "Servir la ensalada en un plato. Colocar las tiras de pollo a la plancha encima. Esparcir los crutones y los 10 g restantes de queso parmesano rallado por encima. Moler pimienta negra fresca al gusto."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "a13",
    nombre: "Chili con carne y arroz",
    tipo_comida: "almuerzo",
    calorias_base: 620,
    proteinas_g: 36,
    carbohidratos_g: 68,
    grasas_g: 20,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: false,
    ingredientes: [
      { nombre: "carne molida magra", nombre_normalizado: "carne_molida", nombre_display: "Carne molida magra", cantidad_base: 150, unidad: "g", unidad_compra: "bandejas", factor_conversion: 500, descripcion_compra: "bandeja de 500g" },
      { nombre: "porotos rojos cocidos", nombre_normalizado: "porotos_rojos", nombre_display: "Porotos rojos", cantidad_base: 120, unidad: "g", unidad_compra: "latas", factor_conversion: 400, descripcion_compra: "lata de 400g" },
      { nombre: "arroz blanco", nombre_normalizado: "arroz_blanco", nombre_display: "Arroz blanco", cantidad_base: 80, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
      { nombre: "salsa de tomate", nombre_normalizado: "salsa_tomate", nombre_display: "Salsa de tomate", cantidad_base: 150, unidad: "ml", unidad_compra: "frascos", factor_conversion: 400, descripcion_compra: "frasco de 400ml" },
      { nombre: "cebolla blanca", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
      { nombre: "pimentón rojo", nombre_normalizado: "pimenton", nombre_display: "Pimentón rojo", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
      { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 2, unidad: "diente", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
      { nombre: "comino en polvo", nombre_normalizado: "comino", nombre_display: "Comino en polvo", cantidad_base: 4, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
      { nombre: "pimentón en polvo", nombre_normalizado: "pimenton_polvo", nombre_display: "Pimentón en polvo", cantidad_base: 3, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
      { nombre: "aceite vegetal", nombre_normalizado: "aceite_vegetal", nombre_display: "Aceite vegetal", cantidad_base: 10, unidad: "ml", unidad_compra: "botellas", factor_conversion: 1000, descripcion_compra: "botella de 1L" },
      { nombre: "cilantro fresco", nombre_normalizado: "cilantro", nombre_display: "Cilantro fresco", cantidad_base: 10, unidad: "g", unidad_compra: "manojos", factor_conversion: 50, descripcion_compra: "manojo" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 3, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Pelar y picar finamente la media cebolla blanca y los 2 dientes de ajo. Cortar el medio pimentón rojo en cubos pequeños. Picar los 10 g de cilantro fresco y reservar.",
      "Calentar los 10 ml de aceite vegetal en una olla mediana a fuego medio. Sofreír la cebolla 3 minutos. Agregar el ajo y el pimentón picado, cocinar 2 minutos.",
      "Subir el fuego a medio-alto. Agregar los 150 g de carne molida. Desmenuzar con cuchara de madera y dorar 5-6 minutos. Agregar los 4 g de comino, los 3 g de pimentón en polvo y la sal. Revolver 30 segundos.",
      "Verter los 150 ml de salsa de tomate. Escurrir los 120 g de porotos rojos e incorporar. Mezclar bien. Reducir a fuego bajo, tapar parcialmente y cocinar 20 minutos revolviendo cada 5 minutos hasta que espese.",
      "Mientras tanto, cocinar el arroz: enjuagar los 80 g de arroz blanco, colocar en olla con 160 ml de agua y sal. Hervir, tapar, reducir a fuego bajo y cocinar 15 minutos. Dejar reposar tapado.",
      "Probar el chili y ajustar la sazón. Servir el arroz en un lado del plato y el chili al costado. Decorar con el cilantro fresco picado."
    ],
    instrucciones_thermomix: [
      "Paso 1: Picar cebolla y ajo / 5 seg / Vel 5",
      "Paso 2: Añadir aceite / 3 min / 120°C / Vel 1",
      "Paso 3: Agregar carne molida, pimentón y especias / 8 min / 120°C / Vel Cuchara inversa",
      "Paso 4: Incorporar salsa de tomate y porotos / 20 min / 100°C / Vel 1",
      "Paso 5: Colocar arroz con agua en cestillo / durante los últimos 15 min / Varoma / Vel 1",
      "Paso 6: Servir arroz con chili. Decorar con cilantro."
    ]
  },
  {
    id: "a14",
    nombre: "Pechuga de pollo rellena de espinaca y queso",
    tipo_comida: "almuerzo",
    calorias_base: 520,
    proteinas_g: 45,
    carbohidratos_g: 15,
    grasas_g: 32,
    es_sin_gluten: true,
    es_sin_lactosa: false,
    es_vegetariana: false,
    ingredientes: [
      { nombre: "pechuga de pollo", nombre_normalizado: "pechuga_pollo", nombre_display: "Pechuga de pollo", cantidad_base: 200, unidad: "g", unidad_compra: "bandejas", factor_conversion: 500, descripcion_compra: "bandeja de 500g" },
      { nombre: "espinaca fresca", nombre_normalizado: "espinaca", nombre_display: "Espinaca fresca", cantidad_base: 60, unidad: "g", unidad_compra: "manojos", factor_conversion: 200, descripcion_compra: "manojo de ~200g" },
      { nombre: "queso crema", nombre_normalizado: "queso_crema", nombre_display: "Queso crema", cantidad_base: 40, unidad: "g", unidad_compra: "potes", factor_conversion: 200, descripcion_compra: "pote de 200g" },
      { nombre: "queso mozzarella", nombre_normalizado: "queso_mozzarella", nombre_display: "Queso mozzarella", cantidad_base: 40, unidad: "g", unidad_compra: "paquetes", factor_conversion: 250, descripcion_compra: "paquete de 250g" },
      { nombre: "tomates cherry", nombre_normalizado: "tomate_cherry", nombre_display: "Tomates cherry", cantidad_base: 100, unidad: "g", unidad_compra: "bandejas", factor_conversion: 250, descripcion_compra: "bandeja de 250g" },
      { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 10, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
      { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 1, unidad: "diente", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 3, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
      { nombre: "pimienta negra", nombre_normalizado: "pimienta", nombre_display: "Pimienta negra", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" }
    ],
    instrucciones: [
      "Precalentar el horno a 190°C. Lavar los 60 g de espinaca fresca. Calentar una sartén a fuego medio, agregar la espinaca con unas gotas de agua. Cocinar 2 minutos revolviendo hasta que se marchite. Escurrir bien presionando con una cuchara para eliminar toda el agua. Picar la espinaca marchita.",
      "Preparar el relleno: en un bowl, mezclar la espinaca picada con los 40 g de queso crema, 20 g de queso mozzarella rallado, el diente de ajo finamente picado, una pizca de sal y pimienta. Mezclar bien.",
      "Con un cuchillo afilado, hacer un corte horizontal profundo en los 200 g de pechuga de pollo para crear un bolsillo (sin atravesar completamente). Rellenar con la mezcla de espinaca y queso. Cerrar con palillos de madera si es necesario. Sazonar el exterior con sal, pimienta y los 10 ml de aceite de oliva.",
      "Calentar una sartén apta para horno a fuego medio-alto. Sellar la pechuga rellena 3 minutos por cada lado hasta que esté dorada.",
      "Cortar los 100 g de tomates cherry por la mitad y distribuirlos alrededor de la pechuga en la sartén. Colocar los 20 g de mozzarella restante sobre la pechuga.",
      "Transferir la sartén al horno precalentado. Hornear 15-18 minutos hasta que el pollo esté completamente cocido y el queso burbujee y se dore.",
      "Retirar del horno, dejar reposar 5 minutos. Retirar los palillos. Servir la pechuga cortada al medio (para mostrar el relleno) con los tomates asados alrededor."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "a15",
    nombre: "Bowl de arroz con camarones al ajillo",
    tipo_comida: "almuerzo",
    calorias_base: 540,
    proteinas_g: 35,
    carbohidratos_g: 60,
    grasas_g: 16,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: false,
    ingredientes: [
      { nombre: "camarones pelados", nombre_normalizado: "camarones", nombre_display: "Camarones pelados", cantidad_base: 160, unidad: "g", unidad_compra: "bolsas", factor_conversion: 500, descripcion_compra: "bolsa de 500g" },
      { nombre: "arroz blanco", nombre_normalizado: "arroz_blanco", nombre_display: "Arroz blanco", cantidad_base: 100, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
      { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 4, unidad: "diente", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
      { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 20, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
      { nombre: "limón (jugo)", nombre_normalizado: "limon", nombre_display: "Limón", cantidad_base: 20, unidad: "ml", unidad_compra: "unidades", factor_conversion: 30, descripcion_compra: "unidad (~30ml jugo)" },
      { nombre: "perejil fresco", nombre_normalizado: "perejil", nombre_display: "Perejil fresco", cantidad_base: 10, unidad: "g", unidad_compra: "manojos", factor_conversion: 50, descripcion_compra: "manojo" },
      { nombre: "pimentón rojo", nombre_normalizado: "pimenton", nombre_display: "Pimentón rojo", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
      { nombre: "hojuelas de chile", nombre_normalizado: "chile_hojuelas", nombre_display: "Hojuelas de chile", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 30, descripcion_compra: "frasco de 30g" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 3, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Cocinar primero el arroz: enjuagar los 100 g de arroz blanco, colocar en olla con 200 ml de agua y sal. Hervir, tapar, reducir a fuego mínimo y cocinar 15 minutos. Dejar reposar tapado 5 minutos.",
      "Secar los 160 g de camarones pelados con papel absorbente. Sazonar con sal y las hojuelas de chile.",
      "Pelar los 4 dientes de ajo y cortarlos en láminas finas. Cortar el medio pimentón rojo en tiras finas. Picar los 10 g de perejil fresco.",
      "Calentar los 20 ml de aceite de oliva en una sartén grande a fuego medio-bajo. Agregar las láminas de ajo y cocinar lentamente 2-3 minutos, revolviendo, hasta que estén doradas pero NO quemadas (el ajo quemado es amargo). Agregar el pimentón y cocinar 1 minuto.",
      "Subir el fuego a medio-alto. Agregar los camarones en una sola capa. Cocinar 2 minutos por cada lado hasta que estén rosados y firmes. No sobre-cocinar.",
      "Retirar del fuego. Exprimir los 20 ml de jugo de limón sobre los camarones. Agregar la mitad del perejil picado y mezclar.",
      "Servir el arroz como base en un bowl amplio. Colocar los camarones al ajillo encima con todo su aceite aromático. Espolvorear el perejil fresco restante."
    ],
    instrucciones_thermomix: [
      "Paso 1: Colocar arroz con 200ml agua / 15 min / 100°C / Vel 1. Retirar y reservar.",
      "Paso 2: Agregar aceite y ajo en láminas / 3 min / 120°C / Vel 1",
      "Paso 3: Incorporar camarones, pimentón y chile / 4 min / 120°C / Vel Cuchara inversa",
      "Paso 4: Agregar jugo de limón / 1 min / Sin temperatura / Vel 1",
      "Paso 5: Servir sobre arroz. Decorar con perejil."
    ]
  },
  {
    id: "a16",
    nombre: "Burrito bowl vegetariano de porotos y arroz",
    tipo_comida: "almuerzo",
    calorias_base: 530,
    proteinas_g: 20,
    carbohidratos_g: 78,
    grasas_g: 16,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "arroz blanco", nombre_normalizado: "arroz_blanco", nombre_display: "Arroz blanco", cantidad_base: 80, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
      { nombre: "porotos negros cocidos", nombre_normalizado: "poroto_negro", nombre_display: "Porotos negros", cantidad_base: 120, unidad: "g", unidad_compra: "latas", factor_conversion: 400, descripcion_compra: "lata de 400g" },
      { nombre: "choclo (granos)", nombre_normalizado: "choclo", nombre_display: "Choclo (granos)", cantidad_base: 60, unidad: "g", unidad_compra: "latas", factor_conversion: 300, descripcion_compra: "lata de 300g" },
      { nombre: "palta (aguacate)", nombre_normalizado: "palta", nombre_display: "Palta (aguacate)", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
      { nombre: "tomate", nombre_normalizado: "tomate", nombre_display: "Tomate", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
      { nombre: "lechuga", nombre_normalizado: "lechuga", nombre_display: "Lechuga", cantidad_base: 50, unidad: "g", unidad_compra: "unidades", factor_conversion: 300, descripcion_compra: "unidad (~300g)" },
      { nombre: "limón (jugo)", nombre_normalizado: "limon", nombre_display: "Limón", cantidad_base: 15, unidad: "ml", unidad_compra: "unidades", factor_conversion: 30, descripcion_compra: "unidad (~30ml jugo)" },
      { nombre: "comino en polvo", nombre_normalizado: "comino", nombre_display: "Comino en polvo", cantidad_base: 2, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
      { nombre: "cilantro fresco", nombre_normalizado: "cilantro", nombre_display: "Cilantro fresco", cantidad_base: 10, unidad: "g", unidad_compra: "manojos", factor_conversion: 50, descripcion_compra: "manojo" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 2, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Cocinar el arroz: enjuagar los 80 g de arroz blanco, colocar en olla con 160 ml de agua, sal y los 15 ml de jugo de limón. Hervir, tapar, reducir a fuego bajo y cocinar 15 minutos. Al terminar, esponjar con tenedor y mezclar con la mitad del cilantro fresco picado (arroz con cilantro y limón).",
      "Escurrir y enjuagar los 120 g de porotos negros. Calentarlos en una olla pequeña con los 2 g de comino en polvo y una pizca de sal. Machacar ligeramente la mitad de los porotos con un tenedor para obtener una textura cremosa. Cocinar 3-4 minutos.",
      "Escurrir los 60 g de granos de choclo. Calentarlos en sartén seca a fuego alto 2-3 minutos hasta que estén ligeramente chamuscados (esto les da un sabor dulce ahumado).",
      "Picar el tomate en cubos pequeños. Cortar la media palta en cubos o láminas. Lavar y trocear los 50 g de lechuga.",
      "Armar el bowl: distribuir el arroz con cilantro como base. Colocar en secciones separadas los porotos machacados, los granos de choclo tostados, el tomate picado, los cubos de palta y la lechuga.",
      "Esparcir el cilantro fresco restante por encima. Servir inmediatamente."
    ],
    instrucciones_thermomix: []
  },

  // ======================== SNACKS PM ========================
  {
    id: "sp1",
    nombre: "Palitos de apio con mantequilla de almendras",
    tipo_comida: "snack_pm",
    calorias_base: 190,
    proteinas_g: 6,
    carbohidratos_g: 12,
    grasas_g: 14,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "tallos de apio", nombre_normalizado: "apio", nombre_display: "Apio", cantidad_base: 3, unidad: "tallos", unidad_compra: "manojos", factor_conversion: 8, descripcion_compra: "manojo (~8 tallos)" },
      { nombre: "mantequilla de almendras", nombre_normalizado: "mantequilla_almendras", nombre_display: "Mantequilla de almendras", cantidad_base: 25, unidad: "g", unidad_compra: "frascos", factor_conversion: 250, descripcion_compra: "frasco de 250g" },
      { nombre: "pasas", nombre_normalizado: "pasas", nombre_display: "Pasas", cantidad_base: 10, unidad: "g", unidad_compra: "paquetes", factor_conversion: 250, descripcion_compra: "paquete de 250g" }
    ],
    instrucciones: [
      "Lavar los 3 tallos de apio bajo el chorro de agua. Cortar las bases y las puntas con hojas.",
      "Cortar cada tallo en bastones de 8-10 cm de largo.",
      "Con un cuchillo pequeño o cucharita, rellenar la cavidad natural del apio con los 25 g de mantequilla de almendras, distribuyendo uniformemente.",
      "Distribuir los 10 g de pasas sobre la mantequilla de almendras, presionando ligeramente para que se adhieran.",
      "Servir inmediatamente. Este snack clásico combina lo crujiente del apio, lo cremoso de la mantequilla y lo dulce de las pasas."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "sp2",
    nombre: "Batido proteico de cacao y plátano",
    tipo_comida: "snack_pm",
    calorias_base: 240,
    proteinas_g: 20,
    carbohidratos_g: 28,
    grasas_g: 6,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "plátano congelado", nombre_normalizado: "platano", nombre_display: "Plátano", cantidad_base: 1, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
      { nombre: "proteína de suero (chocolate)", nombre_normalizado: "proteina_suero", nombre_display: "Proteína de suero", cantidad_base: 25, unidad: "g", unidad_compra: "potes", factor_conversion: 900, descripcion_compra: "pote de 900g" },
      { nombre: "cacao en polvo sin azúcar", nombre_normalizado: "cacao", nombre_display: "Cacao en polvo", cantidad_base: 10, unidad: "g", unidad_compra: "paquetes", factor_conversion: 200, descripcion_compra: "paquete de 200g" },
      { nombre: "leche de almendras", nombre_normalizado: "leche_almendras", nombre_display: "Leche de almendras", cantidad_base: 250, unidad: "ml", unidad_compra: "cajas", factor_conversion: 1000, descripcion_compra: "caja de 1L" }
    ],
    instrucciones: [
      "Pelar el plátano congelado (si no está precongelado pelado, dejarlo 2 minutos a temperatura ambiente para facilitar el pelado). Trocearlo en 3-4 pedazos.",
      "Colocar en la licuadora los 250 ml de leche de almendras, el plátano congelado, los 25 g de proteína de suero sabor chocolate y los 10 g de cacao en polvo sin azúcar.",
      "Licuar a máxima velocidad durante 45-60 segundos hasta obtener una mezcla cremosa, espesa y sin grumos.",
      "Probar y ajustar: si queda muy espeso, agregar un poco más de leche de almendras.",
      "Servir inmediatamente en un vaso grande. El plátano congelado le da textura de milkshake sin necesidad de hielo."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "sp3",
    nombre: "Bolitas energéticas de avena y coco",
    tipo_comida: "snack_pm",
    calorias_base: 210,
    proteinas_g: 7,
    carbohidratos_g: 25,
    grasas_g: 10,
    es_sin_gluten: false,
    es_sin_lactosa: true,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "avena en hojuelas", nombre_normalizado: "avena", nombre_display: "Avena en hojuelas", cantidad_base: 40, unidad: "g", unidad_compra: "paquetes", factor_conversion: 500, descripcion_compra: "paquete de 500g" },
      { nombre: "mantequilla de maní natural", nombre_normalizado: "mantequilla_mani", nombre_display: "Mantequilla de maní", cantidad_base: 20, unidad: "g", unidad_compra: "frascos", factor_conversion: 350, descripcion_compra: "frasco de 350g" },
      { nombre: "miel de abeja", nombre_normalizado: "miel", nombre_display: "Miel de abeja", cantidad_base: 15, unidad: "ml", unidad_compra: "frascos", factor_conversion: 500, descripcion_compra: "frasco de 500ml" },
      { nombre: "coco rallado", nombre_normalizado: "coco_rallado", nombre_display: "Coco rallado", cantidad_base: 15, unidad: "g", unidad_compra: "paquetes", factor_conversion: 200, descripcion_compra: "paquete de 200g" },
      { nombre: "chips de chocolate oscuro", nombre_normalizado: "chips_chocolate", nombre_display: "Chips de chocolate", cantidad_base: 10, unidad: "g", unidad_compra: "paquetes", factor_conversion: 200, descripcion_compra: "paquete de 200g" }
    ],
    instrucciones: [
      "En un bowl grande, combinar los 40 g de avena en hojuelas, los 20 g de mantequilla de maní y los 15 ml de miel de abeja. Mezclar bien con una cuchara.",
      "Incorporar los 10 g de chips de chocolate oscuro a la mezcla y revolver para distribuirlos.",
      "Refrigerar la mezcla durante 15 minutos para que se firme y sea más fácil de manipular.",
      "Con las manos ligeramente humedecidas, tomar porciones de la mezcla y formar bolitas del tamaño de una nuez (salen aproximadamente 5-6 bolitas).",
      "Colocar los 15 g de coco rallado en un plato. Hacer rodar cada bolita sobre el coco para cubrirla.",
      "Disponer en un recipiente con tapa y refrigerar al menos 30 minutos antes de consumir. Se conservan hasta 5 días en la nevera."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "sp4",
    nombre: "Rodajas de manzana con canela y yogur",
    tipo_comida: "snack_pm",
    calorias_base: 180,
    proteinas_g: 8,
    carbohidratos_g: 28,
    grasas_g: 4,
    es_sin_gluten: true,
    es_sin_lactosa: false,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "manzana verde", nombre_normalizado: "manzana", nombre_display: "Manzana verde", cantidad_base: 1, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
      { nombre: "yogur griego natural", nombre_normalizado: "yogur_griego", nombre_display: "Yogur griego natural", cantidad_base: 80, unidad: "g", unidad_compra: "potes", factor_conversion: 500, descripcion_compra: "pote de 500g" },
      { nombre: "canela en polvo", nombre_normalizado: "canela", nombre_display: "Canela en polvo", cantidad_base: 2, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
      { nombre: "miel de abeja", nombre_normalizado: "miel", nombre_display: "Miel de abeja", cantidad_base: 5, unidad: "ml", unidad_compra: "frascos", factor_conversion: 500, descripcion_compra: "frasco de 500ml" }
    ],
    instrucciones: [
      "Lavar la manzana verde. Cortarla en rodajas finas de 3-4 mm sin pelar (la cáscara aporta fibra y color). Retirar las semillas.",
      "Espolvorear los 2 g de canela en polvo uniformemente sobre las rodajas de manzana.",
      "Colocar los 80 g de yogur griego natural en un bowl pequeño para usar como dip.",
      "Rociar los 5 ml de miel de abeja sobre el yogur.",
      "Servir las rodajas de manzana junto al bowl de yogur. Dippear cada rodaja en el yogur con miel y canela al comer."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "sp5",
    nombre: "Galletas de arroz con queso crema y pepino",
    tipo_comida: "snack_pm",
    calorias_base: 170,
    proteinas_g: 5,
    carbohidratos_g: 20,
    grasas_g: 8,
    es_sin_gluten: true,
    es_sin_lactosa: false,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "galletas de arroz", nombre_normalizado: "galleta_arroz", nombre_display: "Galletas de arroz", cantidad_base: 3, unidad: "unidades", unidad_compra: "paquetes", factor_conversion: 20, descripcion_compra: "paquete de ~20 unid." },
      { nombre: "queso crema", nombre_normalizado: "queso_crema", nombre_display: "Queso crema", cantidad_base: 30, unidad: "g", unidad_compra: "potes", factor_conversion: 200, descripcion_compra: "pote de 200g" },
      { nombre: "pepino", nombre_normalizado: "pepino", nombre_display: "Pepino", cantidad_base: 0.25, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" }
    ],
    instrucciones: [
      "Disponer las 3 galletas de arroz sobre un plato.",
      "Con un cuchillo o cucharita, untar 10 g de queso crema sobre cada galleta, cubriéndola uniformemente.",
      "Lavar el cuarto de pepino y cortarlo en rodajas finas de 2-3 mm.",
      "Colocar las rodajas de pepino sobre el queso crema, superponiéndolas ligeramente.",
      "Sazonar con una pizca de sal y pimienta si se desea. Consumir de inmediato para que las galletas se mantengan crujientes."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "sp6",
    nombre: "Fruta picada con limón y chile en polvo",
    tipo_comida: "snack_pm",
    calorias_base: 120,
    proteinas_g: 2,
    carbohidratos_g: 28,
    grasas_g: 1,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "mango", nombre_normalizado: "mango", nombre_display: "Mango", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
      { nombre: "piña", nombre_normalizado: "pina", nombre_display: "Piña", cantidad_base: 80, unidad: "g", unidad_compra: "unidades", factor_conversion: 1000, descripcion_compra: "unidad (~1kg)" },
      { nombre: "limón (jugo)", nombre_normalizado: "limon", nombre_display: "Limón", cantidad_base: 15, unidad: "ml", unidad_compra: "unidades", factor_conversion: 30, descripcion_compra: "unidad (~30ml jugo)" },
      { nombre: "chile en polvo", nombre_normalizado: "chile_polvo", nombre_display: "Chile en polvo", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" }
    ],
    instrucciones: [
      "Pelar el medio mango con un cuchillo. Cortar la pulpa en cubos de 2 cm, evitando el hueso.",
      "Si la piña es fresca, pelar y cortar los 80 g en cubos del mismo tamaño. Si es enlatada, escurrir bien.",
      "Colocar los cubos de mango y piña en un bowl.",
      "Exprimir los 15 ml de jugo de limón fresco por encima de la fruta.",
      "Espolvorear 1 g de chile en polvo al gusto. Mezclar suavemente con una cuchara. Servir frío para un snack refrescante y picante."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "sp7",
    nombre: "Puñado de edamames con sal de mar",
    tipo_comida: "snack_pm",
    calorias_base: 190,
    proteinas_g: 17,
    carbohidratos_g: 8,
    grasas_g: 9,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "edamame congelado", nombre_normalizado: "edamame", nombre_display: "Edamame", cantidad_base: 120, unidad: "g", unidad_compra: "bolsas", factor_conversion: 400, descripcion_compra: "bolsa de 400g" },
      { nombre: "sal de mar", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 2, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Llenar una olla mediana con agua y llevar a ebullición a fuego alto.",
      "Agregar los 120 g de edamame congelado (con vaina) directamente al agua hirviendo sin descongelar.",
      "Cocinar durante 4-5 minutos a fuego medio-alto hasta que las vainas estén tiernas.",
      "Escurrir en un colador y sacudir para eliminar el exceso de agua.",
      "Transferir a un bowl. Espolvorear los 2 g de sal de mar y mezclar para cubrir uniformemente. Servir tibios, presionando las vainas con los dientes para extraer los granos."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "sp8",
    nombre: "Barritas de granola caseras",
    tipo_comida: "snack_pm",
    calorias_base: 200,
    proteinas_g: 5,
    carbohidratos_g: 30,
    grasas_g: 8,
    es_sin_gluten: false,
    es_sin_lactosa: true,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "avena en hojuelas", nombre_normalizado: "avena", nombre_display: "Avena en hojuelas", cantidad_base: 50, unidad: "g", unidad_compra: "paquetes", factor_conversion: 500, descripcion_compra: "paquete de 500g" },
      { nombre: "miel de abeja", nombre_normalizado: "miel", nombre_display: "Miel de abeja", cantidad_base: 20, unidad: "ml", unidad_compra: "frascos", factor_conversion: 500, descripcion_compra: "frasco de 500ml" },
      { nombre: "almendras", nombre_normalizado: "almendras", nombre_display: "Almendras", cantidad_base: 15, unidad: "g", unidad_compra: "paquetes", factor_conversion: 200, descripcion_compra: "paquete de 200g" },
      { nombre: "pasas", nombre_normalizado: "pasas", nombre_display: "Pasas", cantidad_base: 15, unidad: "g", unidad_compra: "paquetes", factor_conversion: 250, descripcion_compra: "paquete de 250g" },
      { nombre: "aceite de coco", nombre_normalizado: "aceite_coco", nombre_display: "Aceite de coco", cantidad_base: 10, unidad: "ml", unidad_compra: "frascos", factor_conversion: 300, descripcion_compra: "frasco de 300ml" }
    ],
    instrucciones: [
      "Precalentar el horno a 170°C. Forrar un molde rectangular pequeño con papel para horno.",
      "Picar las 15 g de almendras en trozos gruesos con un cuchillo.",
      "Derretir los 10 ml de aceite de coco en el microondas o en una olla pequeña (15 segundos en microondas).",
      "En un bowl grande, mezclar los 50 g de avena, las almendras picadas y los 15 g de pasas.",
      "Agregar los 20 ml de miel de abeja y el aceite de coco derretido. Revolver bien hasta que todos los ingredientes estén húmedos.",
      "Verter la mezcla en el molde y presionar firmemente con el dorso de una cuchara para compactar.",
      "Hornear durante 15-18 minutos hasta que los bordes estén dorados. Dejar enfriar completamente en el molde antes de cortar en barritas (se firmarán al enfriarse)."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "sp9",
    nombre: "Dátiles rellenos de mantequilla de maní",
    tipo_comida: "snack_pm",
    calorias_base: 210,
    proteinas_g: 5,
    carbohidratos_g: 30,
    grasas_g: 9,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "dátiles medjool", nombre_normalizado: "datiles", nombre_display: "Dátiles", cantidad_base: 3, unidad: "unidades", unidad_compra: "paquetes", factor_conversion: 15, descripcion_compra: "paquete de ~15 unid." },
      { nombre: "mantequilla de maní natural", nombre_normalizado: "mantequilla_mani", nombre_display: "Mantequilla de maní", cantidad_base: 15, unidad: "g", unidad_compra: "frascos", factor_conversion: 350, descripcion_compra: "frasco de 350g" }
    ],
    instrucciones: [
      "Tomar los 3 dátiles medjool y hacer un corte longitudinal a lo largo de cada uno con un cuchillo pequeño. Retirar el hueso con cuidado.",
      "Con una cucharita, rellenar la cavidad de cada dátil con aproximadamente 5 g de mantequilla de maní natural (15 g en total repartidos entre los 3).",
      "Presionar suavemente para cerrar el dátil alrededor del relleno, sin cerrarlo completamente para que se vea la mantequilla.",
      "Servir en un plato pequeño. Opcionalmente, espolvorear una pizca de sal de mar en escamas sobre la mantequilla de maní para un contraste dulce-salado. Consumir como snack energético de media tarde."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "sp10",
    nombre: "Gelatina de frutas sin azúcar",
    tipo_comida: "snack_pm",
    calorias_base: 80,
    proteinas_g: 4,
    carbohidratos_g: 15,
    grasas_g: 0,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "gelatina sin azúcar", nombre_normalizado: "gelatina", nombre_display: "Gelatina sin azúcar", cantidad_base: 1, unidad: "sobre", unidad_compra: "cajas", factor_conversion: 4, descripcion_compra: "caja de 4 sobres" },
      { nombre: "frutillas frescas", nombre_normalizado: "frutilla", nombre_display: "Frutillas frescas", cantidad_base: 50, unidad: "g", unidad_compra: "bandejas", factor_conversion: 400, descripcion_compra: "bandeja de 400g" },
      { nombre: "agua", nombre_normalizado: "agua", nombre_display: "Agua", cantidad_base: 250, unidad: "ml", unidad_compra: "botellas", factor_conversion: 1500, descripcion_compra: "botella de 1.5L" }
    ],
    instrucciones: [
      "Hervir 125 ml de los 250 ml de agua en una olla pequeña o en el microondas.",
      "Verter el sobre de gelatina sin azúcar en un bowl resistente al calor. Agregar el agua hirviendo y revolver con un tenedor durante 2 minutos hasta que los gránulos se disuelvan por completo.",
      "Agregar los 125 ml de agua fría restante y mezclar bien.",
      "Lavar los 50 g de frutillas frescas, retirar las hojas y cortarlas en cubitos de 1 cm.",
      "Distribuir los trozos de frutilla en moldes individuales o en un recipiente. Verter la gelatina líquida sobre las frutillas.",
      "Refrigerar durante al menos 3-4 horas (o toda la noche) hasta que esté completamente cuajada. Servir fría directamente del molde."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "sp11",
    nombre: "Palomitas de maíz caseras",
    tipo_comida: "snack_pm",
    calorias_base: 150,
    proteinas_g: 3,
    carbohidratos_g: 22,
    grasas_g: 6,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "maíz para palomitas", nombre_normalizado: "maiz_palomitas", nombre_display: "Maíz para palomitas", cantidad_base: 40, unidad: "g", unidad_compra: "paquetes", factor_conversion: 500, descripcion_compra: "paquete de 500g" },
      { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 5, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
      { nombre: "sal de mar", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 1, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Colocar los 5 ml de aceite de oliva en una olla mediana con tapa. Calentar a fuego medio durante 1 minuto.",
      "Agregar 2-3 granos de maíz de prueba a la olla. Cuando revienten, agregar los 40 g de maíz para palomitas restantes en una sola capa.",
      "Tapar la olla inmediatamente. Agitar suavemente la olla de ida y vuelta sobre el fuego cada 10 segundos para evitar que se quemen.",
      "Cuando el ritmo de reventones se reduzca a 2-3 segundos entre cada uno, retirar la olla del fuego inmediatamente.",
      "Abrir la tapa con cuidado (sale vapor caliente). Espolvorear 1 g de sal de mar y agitar la olla tapada para distribuir la sal uniformemente. Servir en un bowl grande."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "sp12",
    nombre: "Chips de plátano al horno",
    tipo_comida: "snack_pm",
    calorias_base: 160,
    proteinas_g: 1,
    carbohidratos_g: 35,
    grasas_g: 2,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "plátano verde", nombre_normalizado: "platano", nombre_display: "Plátano verde", cantidad_base: 1, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
      { nombre: "aceite de oliva en spray", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 3, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
      { nombre: "sal de mar", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 1, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Precalentar el horno a 180°C. Preparar una bandeja grande con papel para horno.",
      "Pelar el plátano verde (cortar los extremos y hacer una incisión longitudinal en la cáscara para retirarla). Cortar en rodajas lo más finas posible (1-2 mm) usando un cuchillo afilado o mandolina.",
      "Disponer las rodajas en una sola capa sobre la bandeja, sin superponerlas. Rociar con los 3 ml de aceite de oliva en spray.",
      "Espolvorear 1 g de sal de mar uniformemente sobre las rodajas.",
      "Hornear durante 12-15 minutos, vigilando a partir del minuto 10. Las rodajas de los bordes se dorarán primero; retirarlas si es necesario y dejar las del centro un poco más.",
      "Dejar enfriar completamente sobre la bandeja (se pondrán más crujientes al enfriarse). Servir como chips saludables."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "sp13",
    nombre: "Pudín de avena con plátano",
    tipo_comida: "snack_pm",
    calorias_base: 230,
    proteinas_g: 8,
    carbohidratos_g: 38,
    grasas_g: 6,
    es_sin_gluten: false,
    es_sin_lactosa: true,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "avena en hojuelas", nombre_normalizado: "avena", nombre_display: "Avena en hojuelas", cantidad_base: 40, unidad: "g", unidad_compra: "paquetes", factor_conversion: 500, descripcion_compra: "paquete de 500g" },
      { nombre: "leche de almendras", nombre_normalizado: "leche_almendras", nombre_display: "Leche de almendras", cantidad_base: 150, unidad: "ml", unidad_compra: "cajas", factor_conversion: 1000, descripcion_compra: "caja de 1L" },
      { nombre: "plátano", nombre_normalizado: "platano", nombre_display: "Plátano", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
      { nombre: "canela en polvo", nombre_normalizado: "canela", nombre_display: "Canela en polvo", cantidad_base: 2, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" }
    ],
    instrucciones: [
      "En un frasco de vidrio con tapa (o un bowl pequeño), colocar los 40 g de avena en hojuelas.",
      "Agregar los 150 ml de leche de almendras y los 2 g de canela en polvo. Revolver bien con una cuchara hasta que la canela se integre sin formar grumos.",
      "Tapar el frasco y refrigerar durante toda la noche (mínimo 6 horas). La avena absorberá la leche y creará una textura cremosa.",
      "Al día siguiente, revolver la mezcla una vez más. Si quedó muy espesa, agregar un chorrito de leche de almendras.",
      "Pelar el medio plátano y cortarlo en rodajas de medio centímetro. Colocar las rodajas sobre la avena formando un patrón circular. Servir frío como snack de media tarde."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "sp14",
    nombre: "Trocitos de queso con uvas",
    tipo_comida: "snack_pm",
    calorias_base: 180,
    proteinas_g: 10,
    carbohidratos_g: 14,
    grasas_g: 10,
    es_sin_gluten: true,
    es_sin_lactosa: false,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "queso fresco", nombre_normalizado: "queso_fresco", nombre_display: "Queso fresco", cantidad_base: 50, unidad: "g", unidad_compra: "paquetes", factor_conversion: 250, descripcion_compra: "paquete de 250g" },
      { nombre: "uvas verdes", nombre_normalizado: "uvas", nombre_display: "Uvas verdes", cantidad_base: 80, unidad: "g", unidad_compra: "racimos", factor_conversion: 500, descripcion_compra: "racimo de ~500g" }
    ],
    instrucciones: [
      "Cortar los 50 g de queso fresco en cubitos de 1.5 cm aproximadamente, del tamaño de un bocado.",
      "Lavar los 80 g de uvas verdes bajo el chorro de agua. Separar del racimo y secar con papel absorbente.",
      "Disponer los cubitos de queso en un lado de un plato pequeño y las uvas en el otro lado.",
      "Para una presentación más elegante, insertar un palillo en cada cubito de queso con una uva encima, formando mini brochetas.",
      "Consumir alternando un trozo de queso con una uva. La combinación de lo salado del queso fresco con lo dulce de la uva es un snack clásico y equilibrado."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "sp15",
    nombre: "Smoothie de frutilla y plátano",
    tipo_comida: "snack_pm",
    calorias_base: 190,
    proteinas_g: 6,
    carbohidratos_g: 35,
    grasas_g: 3,
    es_sin_gluten: true,
    es_sin_lactosa: false,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "frutillas congeladas", nombre_normalizado: "frutilla", nombre_display: "Frutillas congeladas", cantidad_base: 100, unidad: "g", unidad_compra: "bolsas", factor_conversion: 500, descripcion_compra: "bolsa de 500g" },
      { nombre: "plátano", nombre_normalizado: "platano", nombre_display: "Plátano", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
      { nombre: "yogur natural", nombre_normalizado: "yogur_natural", nombre_display: "Yogur natural", cantidad_base: 100, unidad: "g", unidad_compra: "potes", factor_conversion: 500, descripcion_compra: "pote de 500g" }
    ],
    instrucciones: [
      "Sacar los 100 g de frutillas congeladas del congelador. Si están muy duras, dejarlas 2 minutos a temperatura ambiente.",
      "Pelar el medio plátano y trocearlo en 3-4 pedazos para facilitar el licuado.",
      "Colocar en la licuadora las frutillas congeladas, el plátano troceado y los 100 g de yogur natural.",
      "Licuar a máxima velocidad durante 30-45 segundos hasta obtener una mezcla cremosa, homogénea y de color rosado uniforme. Si queda muy espeso, agregar un chorrito de leche o agua.",
      "Servir inmediatamente en un vaso frío. Las frutillas congeladas le dan la temperatura ideal sin necesidad de hielo."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "sp16",
    nombre: "Mini sándwich de queso crema y pepino",
    tipo_comida: "snack_pm",
    calorias_base: 160,
    proteinas_g: 5,
    carbohidratos_g: 18,
    grasas_g: 7,
    es_sin_gluten: false,
    es_sin_lactosa: false,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "pan de molde integral", nombre_normalizado: "pan_integral", nombre_display: "Pan integral", cantidad_base: 1, unidad: "rebanada", unidad_compra: "paquetes", factor_conversion: 20, descripcion_compra: "paquete de ~20 rebanadas" },
      { nombre: "queso crema", nombre_normalizado: "queso_crema", nombre_display: "Queso crema", cantidad_base: 20, unidad: "g", unidad_compra: "potes", factor_conversion: 200, descripcion_compra: "pote de 200g" },
      { nombre: "pepino", nombre_normalizado: "pepino", nombre_display: "Pepino", cantidad_base: 0.25, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" }
    ],
    instrucciones: [
      "Tostar ligeramente la rebanada de pan de molde integral en la tostadora o sartén seca hasta que esté firme pero no dura.",
      "Con un cuchillo, untar los 20 g de queso crema sobre la tostada, cubriendo toda la superficie uniformemente.",
      "Lavar el cuarto de pepino y cortarlo en rodajas finas de 2-3 mm usando un cuchillo afilado.",
      "Colocar las rodajas de pepino sobre el queso crema, superponiéndolas ligeramente en filas ordenadas.",
      "Cortar la tostada en 4 triángulos con un cuchillo. Servir como snack de la tarde. Se puede agregar una pizca de pimienta o eneldo seco por encima."
    ],
    instrucciones_thermomix: []
  },

  // ======================== CENAS ========================
  {
    id: "c1",
    nombre: "Crema de zapallo con semillas de calabaza",
    tipo_comida: "cena",
    calorias_base: 320,
    proteinas_g: 10,
    carbohidratos_g: 40,
    grasas_g: 14,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "zapallo (calabaza)", nombre_normalizado: "zapallo", nombre_display: "Zapallo (calabaza)", cantidad_base: 300, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "por kg" },
      { nombre: "cebolla blanca", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
      { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 2, unidad: "diente", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
      { nombre: "caldo de verduras", nombre_normalizado: "caldo_verduras", nombre_display: "Caldo de verduras", cantidad_base: 300, unidad: "ml", unidad_compra: "cajas", factor_conversion: 1000, descripcion_compra: "caja de 1L" },
      { nombre: "leche de coco", nombre_normalizado: "leche_coco", nombre_display: "Leche de coco", cantidad_base: 50, unidad: "ml", unidad_compra: "latas", factor_conversion: 400, descripcion_compra: "lata de 400ml" },
      { nombre: "semillas de calabaza", nombre_normalizado: "semillas_calabaza", nombre_display: "Semillas de calabaza", cantidad_base: 15, unidad: "g", unidad_compra: "paquetes", factor_conversion: 200, descripcion_compra: "paquete de 200g" },
      { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 10, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
      { nombre: "nuez moscada", nombre_normalizado: "nuez_moscada", nombre_display: "Nuez moscada", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 30, descripcion_compra: "frasco de 30g" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 2, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
      { nombre: "pimienta negra", nombre_normalizado: "pimienta", nombre_display: "Pimienta negra", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" }
    ],
    instrucciones: [
      "Pelar los 300 g de zapallo con un cuchillo grande (la cáscara es dura, tener cuidado). Retirar las semillas del interior y cortar la pulpa en cubos de 3 cm. Pelar y picar finamente la media cebolla blanca. Pelar y machacar los 2 dientes de ajo.",
      "Calentar los 10 ml de aceite de oliva en una olla mediana a fuego medio. Sofreír la cebolla picada durante 3 minutos hasta que esté transparente. Agregar el ajo machacado y cocinar 1 minuto más hasta que suelte su aroma.",
      "Incorporar los cubos de zapallo a la olla y revolver para que se mezclen con la base aromática. Cocinar 2 minutos.",
      "Verter los 300 ml de caldo de verduras caliente sobre el zapallo. Llevar a ebullición, luego reducir a fuego bajo. Tapar y cocinar durante 20-25 minutos, hasta que los cubos de zapallo se deshagan fácilmente al presionarlos con una cuchara.",
      "Retirar del fuego. Con una licuadora de inmersión (o en licuadora de vaso en tandas), procesar hasta obtener una crema completamente suave y sin grumos.",
      "Agregar los 50 ml de leche de coco, 1 g de nuez moscada, los 2 g de sal y 1 g de pimienta negra. Mezclar bien y calentar a fuego bajo 2-3 minutos.",
      "Mientras tanto, tostar las 15 g de semillas de calabaza en una sartén seca a fuego medio durante 2-3 minutos, agitando frecuentemente, hasta que estén doradas y comiencen a 'saltar'.",
      "Servir la crema caliente en bowls. Decorar con las semillas de calabaza tostadas, un hilo de aceite de oliva y un toque de pimienta recién molida."
    ],
    instrucciones_thermomix: [
      "Paso 1: Agregar cebolla y ajo / 5 seg / Sin temperatura / Vel 5",
      "Paso 2: Añadir aceite de oliva / 3 min / 120°C / Vel 1",
      "Paso 3: Incorporar zapallo en cubos y caldo de verduras / 20 min / 100°C / Vel 1",
      "Paso 4: Agregar leche de coco y nuez moscada / 30 seg / Sin temperatura / Vel 8 (triturar progresivo de Vel 1 a 8)",
      "Paso 5: Ajustar sal y pimienta / 2 min / 90°C / Vel 2",
      "Paso 6: Servir y decorar con semillas de calabaza tostadas."
    ]
  },
  {
    id: "c2",
    nombre: "Ensalada tibia de atún con papa y huevo",
    tipo_comida: "cena",
    calorias_base: 380,
    proteinas_g: 32,
    carbohidratos_g: 30,
    grasas_g: 14,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: false,
    ingredientes: [
      { nombre: "atún en agua (lata)", nombre_normalizado: "atun", nombre_display: "Atún en agua", cantidad_base: 140, unidad: "g", unidad_compra: "latas", factor_conversion: 170, descripcion_compra: "lata de 170g" },
      { nombre: "papa", nombre_normalizado: "papa", nombre_display: "Papa", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
      { nombre: "huevo", nombre_normalizado: "huevo", nombre_display: "Huevos", cantidad_base: 2, unidad: "unidades", unidad_compra: "docenas", factor_conversion: 12, descripcion_compra: "docena" },
      { nombre: "tomate", nombre_normalizado: "tomate", nombre_display: "Tomate", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
      { nombre: "aceitunas negras", nombre_normalizado: "aceitunas", nombre_display: "Aceitunas negras", cantidad_base: 30, unidad: "g", unidad_compra: "frascos", factor_conversion: 200, descripcion_compra: "frasco de 200g" },
      { nombre: "cebolla morada", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 0.25, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
      { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 10, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
      { nombre: "limón (jugo)", nombre_normalizado: "limon", nombre_display: "Limón", cantidad_base: 15, unidad: "ml", unidad_compra: "unidades", factor_conversion: 30, descripcion_compra: "unidad (~30ml jugo)" },
      { nombre: "perejil fresco", nombre_normalizado: "perejil", nombre_display: "Perejil fresco", cantidad_base: 5, unidad: "g", unidad_compra: "manojos", factor_conversion: 50, descripcion_compra: "manojo" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 2, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Lavar la papa sin pelar y colocarla en una olla pequeña. Cubrir con agua fría y agregar una pizca de sal. Llevar a ebullición y cocinar 15-18 minutos a fuego medio hasta que al insertar un cuchillo entre fácilmente. Escurrir, dejar enfriar 5 minutos, pelar y cortar en cubos de 2 cm.",
      "Mientras se cocina la papa, colocar los 2 huevos en otra olla pequeña con agua fría. Llevar a ebullición y cocinar exactamente 10 minutos. Transferir a un bowl con agua fría y hielo. Dejar 5 minutos, pelar y cortar en cuartos.",
      "Abrir la lata de atún (140 g) y escurrir bien todo el líquido presionando con la tapa. Desmenuzar el atún con un tenedor en un bowl.",
      "Cortar el tomate en cubos de 1 cm. Cortar el cuarto de cebolla morada en julianas muy finas. Cortar las 30 g de aceitunas negras en rodajas.",
      "En un bowl grande, combinar los cubos de papa tibia, el atún desmenuzado, los cuartos de huevo, el tomate, la cebolla morada y las aceitunas.",
      "Preparar el aliño: mezclar los 10 ml de aceite de oliva con los 15 ml de jugo de limón y los 2 g de sal. Verter sobre la ensalada y mezclar con suavidad para no deshacer los huevos.",
      "Picar finamente los 5 g de perejil fresco. Espolvorear sobre la ensalada tibia. Servir de inmediato; esta ensalada es más sabrosa cuando la papa aún está tibia."
    ],
    instrucciones_thermomix: [
      "Paso 1: Colocar papas con piel en cestillo con 500ml de agua en vaso / 20 min / Varoma / Vel 1",
      "Paso 2: Agregar huevos al cestillo junto con las papas en los últimos 12 min.",
      "Paso 3: Retirar, pelar papas y huevos. Cortar en cubos y cuartos.",
      "Paso 4: Mezclar manualmente con atún, tomate, cebolla y aceitunas.",
      "Paso 5: Aliñar con aceite, limón y sal. Espolvorear perejil."
    ]
  },
  {
    id: "c3",
    nombre: "Wrap integral de pollo con vegetales salteados",
    tipo_comida: "cena",
    calorias_base: 420,
    proteinas_g: 30,
    carbohidratos_g: 40,
    grasas_g: 16,
    es_sin_gluten: false,
    es_sin_lactosa: true,
    es_vegetariana: false,
    ingredientes: [
      { nombre: "tortilla integral grande", nombre_normalizado: "tortilla_integral", nombre_display: "Tortilla integral", cantidad_base: 1, unidad: "unidad", unidad_compra: "paquetes", factor_conversion: 8, descripcion_compra: "paquete de 8 unid." },
      { nombre: "pechuga de pollo", nombre_normalizado: "pechuga_pollo", nombre_display: "Pechuga de pollo", cantidad_base: 130, unidad: "g", unidad_compra: "bandejas", factor_conversion: 500, descripcion_compra: "bandeja de 500g" },
      { nombre: "pimentón rojo", nombre_normalizado: "pimenton", nombre_display: "Pimentón rojo", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
      { nombre: "zapallo italiano (zucchini)", nombre_normalizado: "zapallo_italiano", nombre_display: "Zapallo italiano", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
      { nombre: "champiñones", nombre_normalizado: "champinones", nombre_display: "Champiñones", cantidad_base: 60, unidad: "g", unidad_compra: "bandejas", factor_conversion: 250, descripcion_compra: "bandeja de 250g" },
      { nombre: "cebolla blanca", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 0.25, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
      { nombre: "salsa de soya", nombre_normalizado: "salsa_soya", nombre_display: "Salsa de soya", cantidad_base: 10, unidad: "ml", unidad_compra: "botellas", factor_conversion: 250, descripcion_compra: "botella de 250ml" },
      { nombre: "aceite de sésamo", nombre_normalizado: "aceite_sesamo", nombre_display: "Aceite de sésamo", cantidad_base: 5, unidad: "ml", unidad_compra: "botellas", factor_conversion: 200, descripcion_compra: "botella de 200ml" },
      { nombre: "lechuga", nombre_normalizado: "lechuga", nombre_display: "Lechuga", cantidad_base: 30, unidad: "g", unidad_compra: "unidades", factor_conversion: 300, descripcion_compra: "unidad (~300g)" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 2, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Cortar los 130 g de pechuga de pollo en tiras finas de medio centímetro de grosor. Colocar en un bowl y sazonar con 1 g de sal y los 10 ml de salsa de soya. Mezclar y dejar marinar 10 minutos.",
      "Mientras el pollo marina, preparar los vegetales: cortar el medio pimentón rojo en juliana fina. Cortar el medio zapallo italiano en medias lunas finas. Cortar los 60 g de champiñones en láminas. Picar el cuarto de cebolla blanca en plumas.",
      "Calentar una sartén grande o wok a fuego alto. Agregar un chorrito de aceite. Cuando humee ligeramente, agregar las tiras de pollo marinado. Saltear durante 4-5 minutos sin mover demasiado para que se doren bien. Retirar y reservar en un plato.",
      "En la misma sartén caliente, agregar la cebolla y saltear 1 minuto. Añadir el pimentón, el zapallo italiano y los champiñones. Saltear 3-4 minutos a fuego alto, moviendo constantemente, hasta que estén tiernos pero aún crujientes.",
      "Rociar los 5 ml de aceite de sésamo sobre los vegetales y mezclar. Regresar el pollo a la sartén y mezclar todo junto 1 minuto más.",
      "Calentar la tortilla integral grande en una sartén seca o microondas por 15 segundos para que esté flexible.",
      "Armar el wrap: extender la tortilla, colocar los 30 g de lechuga lavada como base, agregar la mezcla de pollo y vegetales salteados en el centro. Doblar los extremos hacia adentro y enrollar firmemente. Cortar por la mitad en diagonal para servir."
    ],
    instrucciones_thermomix: [
      "Paso 1: Colocar pechuga en tiras en bandeja Varoma / 15 min / Varoma / Vel 2",
      "Paso 2: Agregar cebolla al vaso / 3 seg / Sin temperatura / Vel 4",
      "Paso 3: Añadir aceite de sésamo y vegetales cortados / 5 min / 120°C / Vel Cuchara inversa",
      "Paso 4: Agregar salsa de soya / 2 min / 100°C / Vel Cuchara inversa",
      "Paso 5: Armar wraps manualmente con tortilla, lechuga, pollo y vegetales."
    ]
  },
  {
    id: "c4",
    nombre: "Sopa de pollo con fideos y verduras",
    tipo_comida: "cena",
    calorias_base: 350,
    proteinas_g: 28,
    carbohidratos_g: 35,
    grasas_g: 10,
    es_sin_gluten: false,
    es_sin_lactosa: true,
    es_vegetariana: false,
    ingredientes: [
      { nombre: "pechuga de pollo", nombre_normalizado: "pechuga_pollo", nombre_display: "Pechuga de pollo", cantidad_base: 140, unidad: "g", unidad_compra: "bandejas", factor_conversion: 500, descripcion_compra: "bandeja de 500g" },
      { nombre: "fideos cabello de ángel", nombre_normalizado: "fideos", nombre_display: "Fideos cabello de ángel", cantidad_base: 50, unidad: "g", unidad_compra: "paquetes", factor_conversion: 500, descripcion_compra: "paquete de 500g" },
      { nombre: "zanahoria", nombre_normalizado: "zanahoria", nombre_display: "Zanahoria", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 7, descripcion_compra: "~7 unidades por kg" },
      { nombre: "papa", nombre_normalizado: "papa", nombre_display: "Papa", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
      { nombre: "apio", nombre_normalizado: "apio", nombre_display: "Apio", cantidad_base: 1, unidad: "tallos", unidad_compra: "manojos", factor_conversion: 8, descripcion_compra: "manojo (~8 tallos)" },
      { nombre: "cebolla blanca", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
      { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 2, unidad: "diente", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
      { nombre: "cilantro fresco", nombre_normalizado: "cilantro", nombre_display: "Cilantro fresco", cantidad_base: 10, unidad: "g", unidad_compra: "manojos", factor_conversion: 50, descripcion_compra: "manojo" },
      { nombre: "caldo de pollo", nombre_normalizado: "caldo_pollo", nombre_display: "Caldo de pollo", cantidad_base: 500, unidad: "ml", unidad_compra: "cajas", factor_conversion: 1000, descripcion_compra: "caja de 1L" },
      { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 5, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 3, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
      { nombre: "pimienta negra", nombre_normalizado: "pimienta", nombre_display: "Pimienta negra", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" }
    ],
    instrucciones: [
      "Verter los 500 ml de caldo de pollo en una olla grande. Llevar a ebullición a fuego medio-alto. Sumergir los 140 g de pechuga de pollo entera en el caldo. Reducir el fuego a medio-bajo y cocinar 15 minutos hasta que el pollo esté completamente cocido. Retirar la pechuga y reservar. Guardar el caldo.",
      "Mientras el pollo se cocina, pelar y picar finamente la media cebolla blanca y los 2 dientes de ajo. Pelar la zanahoria y cortarla en rodajas de medio centímetro. Cortar el tallo de apio en cubitos. Pelar la papa y cortarla en cubos de 2 cm.",
      "Calentar los 5 ml de aceite de oliva en la misma olla (con el caldo). Agregar la cebolla y el ajo picados, sofreír 3 minutos. Incorporar la zanahoria y el apio, cocinar 2 minutos más.",
      "Agregar los cubos de papa al caldo. Cocinar a fuego medio durante 10 minutos hasta que la papa esté casi tierna.",
      "Incorporar los 50 g de fideos cabello de ángel. Cocinar 5 minutos más hasta que los fideos estén al dente y la papa completamente tierna.",
      "Mientras tanto, desmenuzar la pechuga cocida en hebras usando dos tenedores. Regresar el pollo desmenuzado a la sopa.",
      "Sazonar con los 3 g de sal y 1 g de pimienta negra al gusto. Dejar hervir 1 minuto más para integrar sabores.",
      "Picar finamente los 10 g de cilantro fresco. Servir la sopa caliente en bowls hondos. Espolvorear generosamente con el cilantro picado. Acompañar con limón al costado si se desea."
    ],
    instrucciones_thermomix: [
      "Paso 1: Agregar cebolla y ajo / 5 seg / Sin temperatura / Vel 5",
      "Paso 2: Añadir aceite / 3 min / 120°C / Vel 1",
      "Paso 3: Incorporar zanahoria y apio picados / 3 min / 100°C / Vel 1",
      "Paso 4: Agregar caldo, papa en cubos y pechuga entera / 15 min / 100°C / Vel 1",
      "Paso 5: Retirar pechuga, desmenuzar. Agregar fideos al vaso / 5 min / 100°C / Vel 1",
      "Paso 6: Devolver pollo desmenuzado / 1 min / 90°C / Vel 1. Servir con cilantro."
    ]
  },
  {
    id: "c5",
    nombre: "Tortilla española de papa y cebolla",
    tipo_comida: "cena",
    calorias_base: 400,
    proteinas_g: 22,
    carbohidratos_g: 35,
    grasas_g: 20,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "papa", nombre_normalizado: "papa", nombre_display: "Papa", cantidad_base: 2, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
      { nombre: "huevos", nombre_normalizado: "huevo", nombre_display: "Huevos", cantidad_base: 4, unidad: "unidades", unidad_compra: "docenas", factor_conversion: 12, descripcion_compra: "docena" },
      { nombre: "cebolla blanca", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
      { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 20, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 3, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
      { nombre: "pimienta negra", nombre_normalizado: "pimienta", nombre_display: "Pimienta negra", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" }
    ],
    instrucciones: [
      "Pelar las 2 papas y cortarlas en rodajas muy finas de 2-3 mm de grosor (cuanto más finas, mejor quedará la tortilla). Pelar la cebolla blanca entera y cortarla en juliana fina.",
      "Calentar los 20 ml de aceite de oliva en una sartén mediana a fuego bajo. Agregar las rodajas de papa y la juliana de cebolla. Cocinar lentamente durante 15-18 minutos, revolviendo con cuidado cada 3-4 minutos, hasta que las papas estén completamente tiernas pero sin dorarse.",
      "Mientras tanto, cascar los 4 huevos en un bowl grande. Batir con un tenedor. Agregar los 3 g de sal y 1 g de pimienta negra. Mezclar bien.",
      "Con una espumadera, retirar las papas y la cebolla de la sartén, escurriendo bien el exceso de aceite. Incorporarlas al bowl con los huevos batidos. Mezclar suavemente y dejar reposar 5 minutos para que los sabores se integren.",
      "Calentar una sartén antiadherente pequeña (20-22 cm) con una cucharada del aceite usado. Verter la mezcla de huevos y papas. Cocinar a fuego bajo durante 5-6 minutos hasta que la base esté bien cuajada y dorada.",
      "Colocar un plato grande y plano sobre la sartén. Con un movimiento rápido y firme, voltear la tortilla sobre el plato. Deslizar de vuelta a la sartén por el lado crudo. Cocinar 3-4 minutos más a fuego bajo.",
      "Deslizar la tortilla terminada a un plato de servir. Dejar reposar 5 minutos. Cortar en porciones triangulares. Se puede servir tibia, a temperatura ambiente o incluso fría al día siguiente."
    ],
    instrucciones_thermomix: [
      "Paso 1: Agregar cebolla en cuartos / 3 seg / Sin temperatura / Vel 4",
      "Paso 2: Añadir aceite y papas en láminas finas / 15 min / 120°C / Vel Cuchara inversa",
      "Paso 3: Retirar papas y cebolla. Escurrir exceso de aceite.",
      "Paso 4: Batir huevos manualmente con sal y pimienta. Mezclar con papas.",
      "Paso 5: Cocinar en sartén antiadherente 5 min por lado a fuego bajo.",
      "Paso 6: Servir en porciones tibias o a temperatura ambiente."
    ]
  },
  {
    id: "c6",
    nombre: "Pechuga de pollo a las finas hierbas con puré de camote",
    tipo_comida: "cena",
    calorias_base: 440,
    proteinas_g: 36,
    carbohidratos_g: 38,
    grasas_g: 16,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: false,
    ingredientes: [
      { nombre: "pechuga de pollo", nombre_normalizado: "pechuga_pollo", nombre_display: "Pechuga de pollo", cantidad_base: 170, unidad: "g", unidad_compra: "bandejas", factor_conversion: 500, descripcion_compra: "bandeja de 500g" },
      { nombre: "camote (batata)", nombre_normalizado: "camote", nombre_display: "Camote (batata)", cantidad_base: 200, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "por kg" },
      { nombre: "espárragos", nombre_normalizado: "esparragos", nombre_display: "Espárragos", cantidad_base: 100, unidad: "g", unidad_compra: "manojos", factor_conversion: 250, descripcion_compra: "manojo de 250g" },
      { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 15, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
      { nombre: "romero fresco", nombre_normalizado: "romero", nombre_display: "Romero fresco", cantidad_base: 3, unidad: "g", unidad_compra: "manojos", factor_conversion: 30, descripcion_compra: "manojo" },
      { nombre: "tomillo fresco", nombre_normalizado: "tomillo", nombre_display: "Tomillo fresco", cantidad_base: 3, unidad: "g", unidad_compra: "manojos", factor_conversion: 30, descripcion_compra: "manojo" },
      { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 2, unidad: "diente", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
      { nombre: "leche de coco", nombre_normalizado: "leche_coco", nombre_display: "Leche de coco", cantidad_base: 30, unidad: "ml", unidad_compra: "latas", factor_conversion: 400, descripcion_compra: "lata de 400ml" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 3, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
      { nombre: "pimienta negra", nombre_normalizado: "pimienta", nombre_display: "Pimienta negra", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" }
    ],
    instrucciones: [
      "Picar finamente los 3 g de romero fresco y los 3 g de tomillo fresco (retirar las hojas de los tallos). Picar los 2 dientes de ajo en trozos muy pequeños. En un bowl, mezclar las hierbas, el ajo, 10 ml de aceite de oliva, 2 g de sal y 1 g de pimienta negra. Untar los 170 g de pechuga de pollo con esta marinada por ambos lados. Dejar reposar 15 minutos.",
      "Mientras tanto, pelar los 200 g de camote y cortarlo en trozos de 3 cm. Colocar en una olla con agua fría que los cubra y una pizca de sal. Llevar a ebullición y cocinar a fuego medio durante 15 minutos hasta que estén completamente blandos al insertar un tenedor.",
      "Escurrir bien los trozos de camote. Regresar a la olla (fuego apagado). Agregar los 30 ml de leche de coco, 1 g de sal y una pizca de pimienta. Machacar con un tenedor o pisapapas hasta obtener un puré suave y cremoso. Tapar para mantener caliente.",
      "Calentar una sartén a fuego medio-alto con los 5 ml restantes de aceite de oliva. Cuando el aceite esté caliente, colocar la pechuga marinada. Cocinar 5 minutos por el primer lado sin mover, hasta que se forme una costra dorada con las hierbas. Voltear y cocinar 4-5 minutos más. Retirar y dejar reposar 3 minutos cubierta con papel aluminio.",
      "En la misma sartén (sin lavar, con los jugos del pollo), agregar los 100 g de espárragos lavados y con las bases duras cortadas. Saltear a fuego medio-alto durante 3-4 minutos, girando cada minuto, hasta que estén tiernos pero aún crujientes y con marcas de grill. Sazonar con una pizca de sal.",
      "Emplatar: colocar una porción generosa de puré de camote en el centro del plato. Apoyar la pechuga cortada en láminas sobre el puré. Disponer los espárragos salteados al costado. Se puede decorar con una ramita de romero fresco y un hilo de aceite de oliva."
    ],
    instrucciones_thermomix: [
      "Paso 1: Colocar camote en trozos con 300ml agua / 15 min / 100°C / Vel 1",
      "Paso 2: Escurrir. Agregar leche de coco, sal y pimienta / 15 seg / Sin temperatura / Vel 4 (puré)",
      "Paso 3: Retirar puré y reservar.",
      "Paso 4: Colocar agua en vaso. Poner pechuga marinada en bandeja Varoma con espárragos / 20 min / Varoma / Vel 2",
      "Paso 5: Retirar pollo y espárragos.",
      "Paso 6: Emplatar puré de camote, pechuga cortada y espárragos."
    ]
  },
  {
    id: "c7",
    nombre: "Salmón al horno con brócoli y arroz",
    tipo_comida: "cena",
    calorias_base: 480,
    proteinas_g: 38,
    carbohidratos_g: 40,
    grasas_g: 18,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: false,
    ingredientes: [
      { nombre: "filete de salmón", nombre_normalizado: "salmon", nombre_display: "Filete de salmón", cantidad_base: 160, unidad: "g", unidad_compra: "filetes", factor_conversion: 200, descripcion_compra: "filete de ~200g" },
      { nombre: "brócoli", nombre_normalizado: "brocoli", nombre_display: "Brócoli", cantidad_base: 150, unidad: "g", unidad_compra: "unidades", factor_conversion: 400, descripcion_compra: "unidad (~400g)" },
      { nombre: "arroz blanco", nombre_normalizado: "arroz_blanco", nombre_display: "Arroz blanco", cantidad_base: 80, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
      { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 10, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
      { nombre: "limón", nombre_normalizado: "limon", nombre_display: "Limón", cantidad_base: 1, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 30, descripcion_compra: "unidad (~30ml jugo)" },
      { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 2, unidad: "diente", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 2, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
      { nombre: "pimienta negra", nombre_normalizado: "pimienta", nombre_display: "Pimienta negra", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" }
    ],
    instrucciones: [
      "Precalentar el horno a 200°C. Enjuagar los 80 g de arroz blanco, colocar en olla con 160 ml de agua y sal. Hervir, tapar, reducir a fuego bajo y cocinar 15 minutos. Dejar reposar tapado.",
      "Secar los 160 g de filete de salmón con papel absorbente. Sazonar con sal, pimienta, el jugo de medio limón y 5 ml de aceite de oliva. Colocar sobre una bandeja con papel para horno.",
      "Lavar los 150 g de brócoli y separar en ramilletes pequeños. Pelar y picar finamente los 2 dientes de ajo. En un bowl, mezclar el brócoli con 5 ml de aceite de oliva, el ajo picado, sal y pimienta.",
      "Distribuir el brócoli alrededor del salmón en la bandeja. Hornear durante 15-18 minutos hasta que el salmón se deshaga fácilmente con un tenedor y el brócoli tenga los bordes ligeramente chamuscados.",
      "Servir el salmón sobre una cama de arroz con el brócoli asado al costado. Exprimir el medio limón restante por encima. Servir inmediatamente."
    ],
    instrucciones_thermomix: [
      "Paso 1: Colocar arroz con agua / 15 min / 100°C / Vel 1. Retirar.",
      "Paso 2: Colocar agua en vaso. Poner salmón en cestillo con brócoli en Varoma / 15 min / Varoma / Vel 2",
      "Paso 3: Emplatar arroz, salmón y brócoli. Aliñar con limón y aceite."
    ]
  },
  {
    id: "c8",
    nombre: "Omelette de champiñones y queso con ensalada verde",
    tipo_comida: "cena",
    calorias_base: 380,
    proteinas_g: 26,
    carbohidratos_g: 12,
    grasas_g: 26,
    es_sin_gluten: true,
    es_sin_lactosa: false,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "huevos", nombre_normalizado: "huevo", nombre_display: "Huevos", cantidad_base: 3, unidad: "unidades", unidad_compra: "docenas", factor_conversion: 12, descripcion_compra: "docena" },
      { nombre: "champiñones", nombre_normalizado: "champinones", nombre_display: "Champiñones", cantidad_base: 80, unidad: "g", unidad_compra: "bandejas", factor_conversion: 250, descripcion_compra: "bandeja de 250g" },
      { nombre: "queso gruyère rallado", nombre_normalizado: "queso_gruyere", nombre_display: "Queso gruyère", cantidad_base: 30, unidad: "g", unidad_compra: "paquetes", factor_conversion: 150, descripcion_compra: "paquete de 150g" },
      { nombre: "lechuga", nombre_normalizado: "lechuga", nombre_display: "Lechuga", cantidad_base: 60, unidad: "g", unidad_compra: "unidades", factor_conversion: 300, descripcion_compra: "unidad (~300g)" },
      { nombre: "tomates cherry", nombre_normalizado: "tomate_cherry", nombre_display: "Tomates cherry", cantidad_base: 60, unidad: "g", unidad_compra: "bandejas", factor_conversion: 250, descripcion_compra: "bandeja de 250g" },
      { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 10, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 2, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
      { nombre: "pimienta negra", nombre_normalizado: "pimienta", nombre_display: "Pimienta negra", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" }
    ],
    instrucciones: [
      "Limpiar los 80 g de champiñones con un paño húmedo (no sumergir en agua). Cortarlos en láminas finas de 3 mm.",
      "Calentar 5 ml de aceite de oliva en una sartén antiadherente a fuego medio-alto. Saltear los champiñones sin mover durante 2 minutos. Revolver y cocinar 2-3 minutos más hasta que estén dorados y hayan soltado toda su agua. Sazonar con sal y pimienta. Retirar y reservar.",
      "Batir los 3 huevos en un bowl con una pizca de sal y pimienta. No agregar leche (los huevos quedan más cremosos sin ella).",
      "En la misma sartén limpia, calentar los 5 ml restantes de aceite de oliva a fuego medio-bajo. Verter los huevos batidos. Dejar cuajar 1 minuto sin tocar. Luego, con una espátula, empujar suavemente los bordes hacia el centro mientras inclinas la sartén para que el huevo líquido llene los espacios vacíos.",
      "Cuando la base esté cuajada pero la superficie aún ligeramente húmeda, distribuir los champiñones salteados y los 30 g de queso gruyère rallado en una mitad del omelette.",
      "Doblar la otra mitad sobre el relleno con la espátula. Cocinar 30 segundos más y deslizar al plato.",
      "Preparar la ensalada: lavar los 60 g de lechuga y cortar los 60 g de tomates cherry por la mitad. Aliñar con aceite de oliva y sal. Servir junto al omelette."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "c9",
    nombre: "Pasta con pesto de albahaca y tomates cherry",
    tipo_comida: "cena",
    calorias_base: 480,
    proteinas_g: 16,
    carbohidratos_g: 60,
    grasas_g: 20,
    es_sin_gluten: false,
    es_sin_lactosa: false,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "pasta penne", nombre_normalizado: "pasta_penne", nombre_display: "Pasta penne", cantidad_base: 120, unidad: "g", unidad_compra: "paquetes", factor_conversion: 500, descripcion_compra: "paquete de 500g" },
      { nombre: "tomates cherry", nombre_normalizado: "tomate_cherry", nombre_display: "Tomates cherry", cantidad_base: 100, unidad: "g", unidad_compra: "bandejas", factor_conversion: 250, descripcion_compra: "bandeja de 250g" },
      { nombre: "albahaca fresca", nombre_normalizado: "albahaca", nombre_display: "Albahaca fresca", cantidad_base: 15, unidad: "g", unidad_compra: "manojos", factor_conversion: 30, descripcion_compra: "manojo" },
      { nombre: "queso parmesano rallado", nombre_normalizado: "queso_parmesano", nombre_display: "Queso parmesano", cantidad_base: 20, unidad: "g", unidad_compra: "paquetes", factor_conversion: 100, descripcion_compra: "paquete de 100g" },
      { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 20, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
      { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 1, unidad: "diente", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
      { nombre: "piñones (o nueces)", nombre_normalizado: "pinones", nombre_display: "Piñones", cantidad_base: 15, unidad: "g", unidad_compra: "paquetes", factor_conversion: 100, descripcion_compra: "paquete de 100g" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 2, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Preparar el pesto casero: en un procesador o licuadora, colocar los 15 g de albahaca fresca (solo las hojas), los 15 g de piñones (o nueces), el diente de ajo pelado, 10 g de queso parmesano y 15 ml de aceite de oliva. Procesar hasta obtener una pasta verde ligeramente rústica. Agregar una pizca de sal. Si queda muy espeso, añadir 1-2 cucharadas de agua.",
      "Hervir abundante agua con una cucharada generosa de sal en una olla grande. Agregar los 120 g de pasta penne y cocinar según las indicaciones del paquete (generalmente 10-12 minutos) hasta que esté al dente. Reservar media taza del agua de cocción antes de escurrir.",
      "Mientras la pasta se cocina, lavar y cortar los 100 g de tomates cherry por la mitad. Calentar 5 ml de aceite de oliva en una sartén a fuego medio. Agregar los tomates cherry cortados boca abajo. Cocinar 3-4 minutos sin mover para que se caramelicen. Darles vuelta y cocinar 1 minuto más.",
      "Escurrir la pasta y colocarla de vuelta en la olla (fuego apagado). Agregar el pesto y mezclar bien para cubrir cada pieza de pasta. Si queda seco, agregar un poco del agua de cocción reservada.",
      "Incorporar los tomates cherry caramelizados y mezclar con suavidad.",
      "Servir en platos hondos. Espolvorear los 10 g restantes de queso parmesano por encima. Decorar con hojas de albahaca fresca si se desea."
    ],
    instrucciones_thermomix: [
      "Paso 1: Agregar piñones, ajo, albahaca y aceite / 20 seg / Sin temperatura / Vel 7 (pesto)",
      "Paso 2: Añadir parmesano / 10 seg / Vel 5. Retirar pesto.",
      "Paso 3: Cocinar pasta en olla aparte hasta al dente.",
      "Paso 4: Mezclar pasta con pesto y tomates cherry salteados.",
      "Paso 5: Servir con parmesano extra."
    ]
  },
  {
    id: "c10",
    nombre: "Tacos de pescado con repollo y salsa",
    tipo_comida: "cena",
    calorias_base: 420,
    proteinas_g: 30,
    carbohidratos_g: 40,
    grasas_g: 16,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: false,
    ingredientes: [
      { nombre: "filete de pescado blanco", nombre_normalizado: "pescado_blanco", nombre_display: "Pescado blanco", cantidad_base: 160, unidad: "g", unidad_compra: "filetes", factor_conversion: 200, descripcion_compra: "filete de ~200g" },
      { nombre: "tortillas de maíz", nombre_normalizado: "tortilla_maiz", nombre_display: "Tortillas de maíz", cantidad_base: 3, unidad: "unidades", unidad_compra: "paquetes", factor_conversion: 12, descripcion_compra: "paquete de 12 unid." },
      { nombre: "repollo morado", nombre_normalizado: "repollo", nombre_display: "Repollo morado", cantidad_base: 80, unidad: "g", unidad_compra: "unidades", factor_conversion: 800, descripcion_compra: "unidad (~800g)" },
      { nombre: "limón (jugo)", nombre_normalizado: "limon", nombre_display: "Limón", cantidad_base: 30, unidad: "ml", unidad_compra: "unidades", factor_conversion: 30, descripcion_compra: "unidad (~30ml jugo)" },
      { nombre: "cilantro fresco", nombre_normalizado: "cilantro", nombre_display: "Cilantro fresco", cantidad_base: 10, unidad: "g", unidad_compra: "manojos", factor_conversion: 50, descripcion_compra: "manojo" },
      { nombre: "comino en polvo", nombre_normalizado: "comino", nombre_display: "Comino en polvo", cantidad_base: 2, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
      { nombre: "pimentón en polvo", nombre_normalizado: "pimenton_polvo", nombre_display: "Pimentón en polvo", cantidad_base: 2, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
      { nombre: "aceite vegetal", nombre_normalizado: "aceite_vegetal", nombre_display: "Aceite vegetal", cantidad_base: 10, unidad: "ml", unidad_compra: "botellas", factor_conversion: 1000, descripcion_compra: "botella de 1L" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 2, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Secar los 160 g de filete de pescado blanco con papel absorbente. Sazonar con los 2 g de comino en polvo, los 2 g de pimentón en polvo, sal y 10 ml de jugo de limón. Dejar marinar 10 minutos.",
      "Mientras, preparar la ensalada de repollo: cortar los 80 g de repollo morado en juliana muy fina. Mezclar con 10 ml de jugo de limón, una pizca de sal y la mitad del cilantro fresco picado. Masajear con las manos 30 segundos para ablandar. Reservar.",
      "Calentar los 10 ml de aceite vegetal en una sartén a fuego medio-alto. Cocinar el pescado 3-4 minutos por cada lado hasta que se deshaga fácilmente con un tenedor. Desmenuzar en trozos grandes.",
      "Calentar las 3 tortillas de maíz en un comal o sartén seca, 30 segundos por cada lado.",
      "Armar los tacos: colocar pescado desmenuzado en cada tortilla, cubrir con la ensalada de repollo morado. Exprimir los 10 ml de jugo de limón restante por encima. Espolvorear el cilantro fresco restante. Servir inmediatamente."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "c11",
    nombre: "Risotto de champiñones",
    tipo_comida: "cena",
    calorias_base: 450,
    proteinas_g: 14,
    carbohidratos_g: 58,
    grasas_g: 18,
    es_sin_gluten: true,
    es_sin_lactosa: false,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "arroz arborio (o carnaroli)", nombre_normalizado: "arroz_arborio", nombre_display: "Arroz arborio", cantidad_base: 100, unidad: "g", unidad_compra: "paquetes", factor_conversion: 500, descripcion_compra: "paquete de 500g" },
      { nombre: "champiñones", nombre_normalizado: "champinones", nombre_display: "Champiñones", cantidad_base: 120, unidad: "g", unidad_compra: "bandejas", factor_conversion: 250, descripcion_compra: "bandeja de 250g" },
      { nombre: "caldo de verduras", nombre_normalizado: "caldo_verduras", nombre_display: "Caldo de verduras", cantidad_base: 500, unidad: "ml", unidad_compra: "cajas", factor_conversion: 1000, descripcion_compra: "caja de 1L" },
      { nombre: "cebolla blanca", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
      { nombre: "queso parmesano rallado", nombre_normalizado: "queso_parmesano", nombre_display: "Queso parmesano", cantidad_base: 25, unidad: "g", unidad_compra: "paquetes", factor_conversion: 100, descripcion_compra: "paquete de 100g" },
      { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 10, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
      { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 1, unidad: "diente", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
      { nombre: "perejil fresco", nombre_normalizado: "perejil", nombre_display: "Perejil fresco", cantidad_base: 5, unidad: "g", unidad_compra: "manojos", factor_conversion: 50, descripcion_compra: "manojo" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 2, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
      { nombre: "pimienta negra", nombre_normalizado: "pimienta", nombre_display: "Pimienta negra", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" }
    ],
    instrucciones: [
      "Calentar los 500 ml de caldo de verduras en una olla aparte a fuego bajo. Mantener caliente durante toda la preparación (el caldo debe agregarse siempre caliente al risotto).",
      "Limpiar los 120 g de champiñones con un paño húmedo y cortarlos en láminas. Pelar y picar finamente la media cebolla y el diente de ajo.",
      "Calentar 5 ml de aceite de oliva en una sartén a fuego alto. Saltear los champiñones sin mover 3 minutos hasta que se doren. Revolver y cocinar 2 minutos más. Sazonar con sal. Retirar y reservar.",
      "En una olla ancha o cacerola, calentar 5 ml de aceite de oliva a fuego medio. Sofreír la cebolla 3 minutos hasta que esté transparente. Agregar el ajo y cocinar 1 minuto.",
      "Agregar los 100 g de arroz arborio a la olla. Tostar el arroz revolviendo durante 2 minutos hasta que los granos estén translúcidos en los bordes (este paso es esencial para un buen risotto).",
      "Agregar un cucharón de caldo caliente al arroz. Revolver constantemente a fuego medio hasta que el líquido se absorba casi por completo. Repetir este proceso, agregando caldo de a un cucharón, revolviendo y esperando que se absorba. Este proceso toma 18-20 minutos en total.",
      "Cuando el arroz esté cremoso pero aún con algo de firmeza (al dente), retirar del fuego. Incorporar los champiñones salteados y los 25 g de queso parmesano rallado. Mezclar vigorosamente durante 30 segundos (esto crea la cremosidad característica). Ajustar sal y pimienta.",
      "Servir inmediatamente en platos hondos tibios. Espolvorear con los 5 g de perejil fresco picado y un chorrito de aceite de oliva. El risotto no espera: debe servirse al instante."
    ],
    instrucciones_thermomix: [
      "Paso 1: Picar cebolla y ajo / 5 seg / Vel 5",
      "Paso 2: Añadir aceite / 3 min / 120°C / Vel 1",
      "Paso 3: Agregar arroz arborio / 2 min / 120°C / Vel Cuchara inversa",
      "Paso 4: Incorporar caldo caliente / 18 min / 100°C / Vel Cuchara inversa",
      "Paso 5: Agregar champiñones salteados y parmesano / 30 seg / Sin temperatura / Vel 1",
      "Paso 6: Servir inmediatamente con perejil fresco."
    ]
  },
  {
    id: "c12",
    nombre: "Ensalada templada de garbanzos y vegetales asados",
    tipo_comida: "cena",
    calorias_base: 400,
    proteinas_g: 16,
    carbohidratos_g: 50,
    grasas_g: 16,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "garbanzos cocidos", nombre_normalizado: "garbanzos", nombre_display: "Garbanzos cocidos", cantidad_base: 150, unidad: "g", unidad_compra: "latas", factor_conversion: 400, descripcion_compra: "lata de 400g" },
      { nombre: "zapallo italiano (zucchini)", nombre_normalizado: "zapallo_italiano", nombre_display: "Zapallo italiano", cantidad_base: 1, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
      { nombre: "pimentón rojo", nombre_normalizado: "pimenton", nombre_display: "Pimentón rojo", cantidad_base: 1, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
      { nombre: "cebolla morada", nombre_normalizado: "cebolla", nombre_display: "Cebolla morada", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
      { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 15, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
      { nombre: "limón (jugo)", nombre_normalizado: "limon", nombre_display: "Limón", cantidad_base: 15, unidad: "ml", unidad_compra: "unidades", factor_conversion: 30, descripcion_compra: "unidad (~30ml jugo)" },
      { nombre: "comino en polvo", nombre_normalizado: "comino", nombre_display: "Comino en polvo", cantidad_base: 2, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
      { nombre: "perejil fresco", nombre_normalizado: "perejil", nombre_display: "Perejil fresco", cantidad_base: 10, unidad: "g", unidad_compra: "manojos", factor_conversion: 50, descripcion_compra: "manojo" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 2, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Precalentar el horno a 200°C. Cortar el zapallo italiano en medias lunas de 1 cm. Cortar el pimentón rojo en tiras anchas. Cortar la media cebolla morada en gajos.",
      "Colocar los vegetales en una bandeja para horno. Rociar con 10 ml de aceite de oliva, 2 g de comino en polvo y sal. Mezclar con las manos. Asar 20-25 minutos dando vuelta a la mitad, hasta que estén dorados y tiernos.",
      "Escurrir y enjuagar los 150 g de garbanzos cocidos. Secar bien con papel absorbente. En los últimos 10 minutos de cocción de los vegetales, agregar los garbanzos a la bandeja para que se tuesten ligeramente.",
      "Preparar la vinagreta: mezclar los 15 ml de jugo de limón con 5 ml de aceite de oliva y una pizca de sal. Batir con un tenedor hasta emulsionar.",
      "Picar finamente los 10 g de perejil fresco. En un bowl grande, combinar los vegetales asados tibios con los garbanzos tostados. Rociar con la vinagreta y mezclar suavemente.",
      "Servir tibia espolvoreando el perejil fresco por encima. Esta ensalada también es excelente al día siguiente como almuerzo frío."
    ],
    instrucciones_thermomix: []
  },
  {
    id: "c13",
    nombre: "Sopa de lentejas con verduras",
    tipo_comida: "cena",
    calorias_base: 380,
    proteinas_g: 22,
    carbohidratos_g: 55,
    grasas_g: 8,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "lentejas rojas", nombre_normalizado: "lentejas_rojas", nombre_display: "Lentejas rojas", cantidad_base: 100, unidad: "g", unidad_compra: "paquetes", factor_conversion: 500, descripcion_compra: "paquete de 500g" },
      { nombre: "zanahoria", nombre_normalizado: "zanahoria", nombre_display: "Zanahoria", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 7, descripcion_compra: "~7 unidades por kg" },
      { nombre: "papa", nombre_normalizado: "papa", nombre_display: "Papa", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
      { nombre: "cebolla blanca", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
      { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 2, unidad: "diente", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
      { nombre: "caldo de verduras", nombre_normalizado: "caldo_verduras", nombre_display: "Caldo de verduras", cantidad_base: 500, unidad: "ml", unidad_compra: "cajas", factor_conversion: 1000, descripcion_compra: "caja de 1L" },
      { nombre: "comino en polvo", nombre_normalizado: "comino", nombre_display: "Comino en polvo", cantidad_base: 3, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
      { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 10, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
      { nombre: "cilantro fresco", nombre_normalizado: "cilantro", nombre_display: "Cilantro fresco", cantidad_base: 10, unidad: "g", unidad_compra: "manojos", factor_conversion: 50, descripcion_compra: "manojo" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 3, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Enjuagar los 100 g de lentejas rojas bajo el chorro de agua hasta que el agua salga clara (las lentejas rojas no necesitan remojo). Pelar y picar finamente la media cebolla y los 2 dientes de ajo. Pelar la zanahoria y cortarla en cubos pequeños. Pelar la papa y cortarla en cubos de 1.5 cm.",
      "Calentar los 10 ml de aceite de oliva en una olla mediana a fuego medio. Sofreír la cebolla y el ajo 3-4 minutos hasta que estén transparentes.",
      "Agregar la zanahoria en cubos y los 3 g de comino en polvo. Cocinar 2 minutos revolviendo para activar el comino.",
      "Incorporar las lentejas rojas y los cubos de papa. Verter los 500 ml de caldo de verduras caliente. Llevar a ebullición.",
      "Reducir a fuego bajo, tapar y cocinar 20-25 minutos hasta que las lentejas se deshagan (esto es normal, las lentejas rojas se desintegran formando una crema natural) y la papa esté completamente tierna.",
      "Ajustar los 3 g de sal. Si se desea una textura más cremosa, triturar la mitad con una licuadora de inmersión. Si queda muy espesa, agregar un poco más de caldo o agua.",
      "Servir caliente en bowls hondos. Picar los 10 g de cilantro fresco y espolvorear generosamente. Agregar un hilo de aceite de oliva crudo por encima."
    ],
    instrucciones_thermomix: [
      "Paso 1: Picar cebolla y ajo / 5 seg / Vel 5",
      "Paso 2: Añadir aceite / 3 min / 120°C / Vel 1",
      "Paso 3: Incorporar zanahoria, comino / 2 min / 100°C / Vel 1",
      "Paso 4: Agregar lentejas, papa y caldo / 25 min / 100°C / Vel 1",
      "Paso 5: Triturar parcialmente si se desea / 5 seg / Vel 4",
      "Paso 6: Servir con cilantro fresco y aceite de oliva."
    ]
  },
  {
    id: "c14",
    nombre: "Pechuga de pavo con puré de papas y poroto verdes",
    tipo_comida: "cena",
    calorias_base: 430,
    proteinas_g: 38,
    carbohidratos_g: 38,
    grasas_g: 14,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: false,
    ingredientes: [
      { nombre: "pechuga de pavo", nombre_normalizado: "pechuga_pavo", nombre_display: "Pechuga de pavo", cantidad_base: 170, unidad: "g", unidad_compra: "bandejas", factor_conversion: 500, descripcion_compra: "bandeja de 500g" },
      { nombre: "papa", nombre_normalizado: "papa", nombre_display: "Papa", cantidad_base: 2, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
      { nombre: "porotos verdes", nombre_normalizado: "poroto_verde", nombre_display: "Porotos verdes", cantidad_base: 100, unidad: "g", unidad_compra: "bolsas", factor_conversion: 500, descripcion_compra: "bolsa de 500g" },
      { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 10, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
      { nombre: "leche de almendras", nombre_normalizado: "leche_almendras", nombre_display: "Leche de almendras", cantidad_base: 40, unidad: "ml", unidad_compra: "cajas", factor_conversion: 1000, descripcion_compra: "caja de 1L" },
      { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 1, unidad: "diente", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
      { nombre: "romero fresco", nombre_normalizado: "romero", nombre_display: "Romero fresco", cantidad_base: 2, unidad: "g", unidad_compra: "manojos", factor_conversion: 30, descripcion_compra: "manojo" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 3, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
      { nombre: "pimienta negra", nombre_normalizado: "pimienta", nombre_display: "Pimienta negra", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" }
    ],
    instrucciones: [
      "Pelar las 2 papas y cortarlas en cubos de 3 cm. Colocar en una olla con agua fría que las cubra y sal. Llevar a ebullición y cocinar 15-18 minutos hasta que al insertar un tenedor entre fácilmente.",
      "Mientras las papas se cocinan, sazonar los 170 g de pechuga de pavo con sal, pimienta, las hojas de romero fresco picadas y el diente de ajo finamente picado. Frotar bien las especias.",
      "Calentar 5 ml de aceite de oliva en una sartén a fuego medio-alto. Cocinar la pechuga de pavo 5 minutos por cada lado hasta que esté dorada y completamente cocida (sin zonas rosadas). Dejar reposar 5 minutos cubierta con papel aluminio.",
      "Lavar los 100 g de poroto verdes y cortar las puntas. Hervir agua con sal en otra olla. Cocinar los poroto verdes 4-5 minutos hasta que estén tiernos pero crujientes (color verde brillante). Escurrir y pasar por agua fría para detener la cocción. Saltear brevemente en una sartén con 5 ml de aceite de oliva, sal y pimienta.",
      "Escurrir bien las papas. Agregar los 40 ml de leche de almendras y machacar con un tenedor o prensapapas hasta obtener un puré suave. Ajustar sal y pimienta.",
      "Cortar la pechuga de pavo en láminas. Servir con el puré de papas en el centro del plato, las láminas de pavo apoyadas sobre el puré y los poroto verdes al costado."
    ],
    instrucciones_thermomix: [
      "Paso 1: Colocar papas con agua / 18 min / 100°C / Vel 1. Escurrir.",
      "Paso 2: Triturar papas con leche de almendras / 15 seg / Vel 4. Reservar.",
      "Paso 3: Colocar agua en vaso. Pavo en cestillo y poroto verdes en Varoma / 15 min / Varoma / Vel 2",
      "Paso 4: Emplatar puré, pavo cortado y poroto verdes."
    ]
  },
  {
    id: "c15",
    nombre: "Stir-fry de tofu y vegetales con arroz",
    tipo_comida: "cena",
    calorias_base: 420,
    proteinas_g: 20,
    carbohidratos_g: 52,
    grasas_g: 16,
    es_sin_gluten: true,
    es_sin_lactosa: true,
    es_vegetariana: true,
    ingredientes: [
      { nombre: "tofu firme", nombre_normalizado: "tofu", nombre_display: "Tofu firme", cantidad_base: 150, unidad: "g", unidad_compra: "paquetes", factor_conversion: 350, descripcion_compra: "paquete de 350g" },
      { nombre: "arroz blanco", nombre_normalizado: "arroz_blanco", nombre_display: "Arroz blanco", cantidad_base: 80, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
      { nombre: "brócoli", nombre_normalizado: "brocoli", nombre_display: "Brócoli", cantidad_base: 100, unidad: "g", unidad_compra: "unidades", factor_conversion: 400, descripcion_compra: "unidad (~400g)" },
      { nombre: "pimentón rojo", nombre_normalizado: "pimenton", nombre_display: "Pimentón rojo", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
      { nombre: "zanahoria", nombre_normalizado: "zanahoria", nombre_display: "Zanahoria", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 7, descripcion_compra: "~7 unidades por kg" },
      { nombre: "salsa de soya", nombre_normalizado: "salsa_soya", nombre_display: "Salsa de soya", cantidad_base: 15, unidad: "ml", unidad_compra: "botellas", factor_conversion: 250, descripcion_compra: "botella de 250ml" },
      { nombre: "aceite de sésamo", nombre_normalizado: "aceite_sesamo", nombre_display: "Aceite de sésamo", cantidad_base: 5, unidad: "ml", unidad_compra: "botellas", factor_conversion: 200, descripcion_compra: "botella de 200ml" },
      { nombre: "jengibre fresco", nombre_normalizado: "jengibre", nombre_display: "Jengibre fresco", cantidad_base: 5, unidad: "g", unidad_compra: "trozos", factor_conversion: 50, descripcion_compra: "trozo de ~50g" },
      { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 2, unidad: "diente", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 1, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Cocinar el arroz: enjuagar los 80 g de arroz blanco, colocar en olla con 160 ml de agua y sal. Hervir, tapar, reducir a fuego bajo y cocinar 15 minutos. Dejar reposar tapado.",
      "Envolver los 150 g de tofu firme en papel absorbente y presionar suavemente para eliminar el exceso de agua (10 minutos idealmente). Cortar en cubos de 2 cm. Sazonar con 5 ml de salsa de soya.",
      "Pelar y rallar los 5 g de jengibre. Picar finamente los 2 dientes de ajo. Separar los 100 g de brócoli en ramilletes pequeños. Cortar el medio pimentón en tiras. Pelar y cortar la zanahoria en rodajas finas diagonales.",
      "Calentar los 5 ml de aceite de sésamo en un wok o sartén grande a fuego alto. Cuando humee, agregar los cubos de tofu. Cocinar sin mover 2-3 minutos por cada lado hasta que estén dorados y crujientes. Retirar y reservar.",
      "En el mismo wok, agregar un chorrito de aceite si es necesario. Saltear el jengibre y ajo 30 segundos. Agregar la zanahoria y el brócoli, saltear 3 minutos. Incorporar el pimentón y cocinar 2 minutos más.",
      "Devolver el tofu al wok. Agregar los 10 ml restantes de salsa de soya. Mezclar todo vigorosamente durante 1 minuto a fuego alto.",
      "Servir el arroz en bowls y colocar el stir-fry de tofu y vegetales encima."
    ],
    instrucciones_thermomix: [
      "Paso 1: Colocar arroz con agua / 15 min / 100°C / Vel 1. Retirar y reservar.",
      "Paso 2: Cocinar tofu y vegetales en sartén aparte (el Thermomix no logra la textura crujiente del stir-fry).",
      "Paso 3: Servir arroz con stir-fry encima."
    ]
  },
  {
    id: "c16",
    nombre: "Quesadillas de pollo con guacamole",
    tipo_comida: "cena",
    calorias_base: 460,
    proteinas_g: 32,
    carbohidratos_g: 36,
    grasas_g: 22,
    es_sin_gluten: true,
    es_sin_lactosa: false,
    es_vegetariana: false,
    ingredientes: [
      { nombre: "pechuga de pollo cocida", nombre_normalizado: "pechuga_pollo", nombre_display: "Pechuga de pollo", cantidad_base: 120, unidad: "g", unidad_compra: "bandejas", factor_conversion: 500, descripcion_compra: "bandeja de 500g" },
      { nombre: "tortillas de maíz", nombre_normalizado: "tortilla_maiz", nombre_display: "Tortillas de maíz", cantidad_base: 3, unidad: "unidades", unidad_compra: "paquetes", factor_conversion: 12, descripcion_compra: "paquete de 12 unid." },
      { nombre: "queso mozzarella rallado", nombre_normalizado: "queso_mozzarella", nombre_display: "Queso mozzarella", cantidad_base: 50, unidad: "g", unidad_compra: "paquetes", factor_conversion: 250, descripcion_compra: "paquete de 250g" },
      { nombre: "palta (aguacate)", nombre_normalizado: "palta", nombre_display: "Palta (aguacate)", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
      { nombre: "tomate", nombre_normalizado: "tomate", nombre_display: "Tomate", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
      { nombre: "limón (jugo)", nombre_normalizado: "limon", nombre_display: "Limón", cantidad_base: 10, unidad: "ml", unidad_compra: "unidades", factor_conversion: 30, descripcion_compra: "unidad (~30ml jugo)" },
      { nombre: "cilantro fresco", nombre_normalizado: "cilantro", nombre_display: "Cilantro fresco", cantidad_base: 5, unidad: "g", unidad_compra: "manojos", factor_conversion: 50, descripcion_compra: "manojo" },
      { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 2, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
    ],
    instrucciones: [
      "Si la pechuga de pollo está cruda, cocinarla: hervir 120 g de pechuga en agua con sal durante 15 minutos. Dejar enfriar 5 minutos y desmenuzar con dos tenedores. Si ya está cocida, simplemente desmenuzar.",
      "Preparar el guacamole: cortar la media palta por la mitad, retirar el hueso. Extraer la pulpa con una cuchara y machacar con un tenedor hasta obtener una textura rústica. Agregar los 10 ml de jugo de limón, el cilantro fresco picado y una pizca de sal. Mezclar bien.",
      "Picar el tomate en cubos pequeños para tener salsa fresca (pico de gallo simple).",
      "Armar las quesadillas: colocar una tortilla de maíz en una sartén seca a fuego medio. Distribuir una capa de los 50 g de queso mozzarella rallado y una porción de pollo desmenuzado en una mitad de la tortilla.",
      "Cuando el queso comience a derretirse (2-3 minutos), doblar la tortilla por la mitad presionando suavemente con una espátula. Cocinar 1 minuto más por cada lado hasta que esté crujiente y dorada. Repetir con las tortillas restantes.",
      "Servir las quesadillas cortadas en triángulos. Acompañar con el guacamole y los cubos de tomate fresco al costado."
    ],
    instrucciones_thermomix: []
  }
];
