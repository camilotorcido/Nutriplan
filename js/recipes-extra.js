/* ============================================
   NutriPlan - Recetas Extra (ampliación 2026)
   80 recetas adicionales para duplicar la base local:
   - 16 desayunos (d17-d32)
   - 16 snacks AM (sa17-sa32)
   - 16 almuerzos (a17-a32)
   - 16 snacks PM (sp17-sp32)
   - 16 cenas (c17-c32)
   
   Las instrucciones Thermomix de almuerzo/cena se generan
   automáticamente en recipes-thermomix-upgrade.js
   ============================================ */

(function agregarRecetasExtra() {
  if (typeof RECETAS_DB === 'undefined') {
    console.warn('[Recipes Extra] RECETAS_DB no disponible');
    return;
  }

  const RECETAS_EXTRA = [
    // ═══════════════════════════════════════════
    // DESAYUNOS (d17-d32)
    // ═══════════════════════════════════════════
    {
      id: "d17",
      nombre: "Tostón francés de plátano con canela",
      tipo_comida: "desayuno",
      calorias_base: 440, proteinas_g: 18, carbohidratos_g: 58, grasas_g: 14,
      es_sin_gluten: false, es_sin_lactosa: false, es_vegetariana: true,
      ingredientes: [
        { nombre: "pan integral", nombre_normalizado: "pan_integral", nombre_display: "Pan integral", cantidad_base: 2, unidad: "rebanadas", unidad_compra: "paquetes", factor_conversion: 12, descripcion_compra: "paquete de ~12 rebanadas" },
        { nombre: "huevos", nombre_normalizado: "huevo", nombre_display: "Huevos", cantidad_base: 2, unidad: "unidades", unidad_compra: "docenas", factor_conversion: 12, descripcion_compra: "docena" },
        { nombre: "leche descremada", nombre_normalizado: "leche_descremada", nombre_display: "Leche descremada", cantidad_base: 60, unidad: "ml", unidad_compra: "cajas", factor_conversion: 1000, descripcion_compra: "caja de 1L" },
        { nombre: "plátano maduro", nombre_normalizado: "platano", nombre_display: "Plátano", cantidad_base: 1, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
        { nombre: "canela en polvo", nombre_normalizado: "canela", nombre_display: "Canela en polvo", cantidad_base: 2, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
        { nombre: "miel de abeja", nombre_normalizado: "miel", nombre_display: "Miel de abeja", cantidad_base: 15, unidad: "ml", unidad_compra: "frascos", factor_conversion: 500, descripcion_compra: "frasco de 500ml" },
        { nombre: "mantequilla", nombre_normalizado: "mantequilla", nombre_display: "Mantequilla", cantidad_base: 5, unidad: "g", unidad_compra: "barras", factor_conversion: 250, descripcion_compra: "barra de 250g" }
      ],
      instrucciones: [
        "En un plato hondo, batir los 2 huevos con los 60 ml de leche descremada y 1 g de canela hasta obtener una mezcla homogénea.",
        "Sumergir las 2 rebanadas de pan integral en la mezcla por 15 segundos por cada lado hasta que absorban el líquido sin desarmarse.",
        "Calentar una sartén antiadherente a fuego medio y derretir los 5 g de mantequilla.",
        "Cocinar las rebanadas empapadas 2-3 minutos por lado hasta que estén doradas y crujientes por fuera.",
        "Mientras tanto, pelar el plátano y cortarlo en rodajas diagonales de 0.5 cm.",
        "Emplatar las tostadas francesas, cubrir con las rodajas de plátano, espolvorear el 1 g de canela restante y rociar los 15 ml de miel en zigzag."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "d18",
      nombre: "Bowl de açaí con plátano y granola",
      tipo_comida: "desayuno",
      calorias_base: 420, proteinas_g: 10, carbohidratos_g: 68, grasas_g: 12,
      es_sin_gluten: false, es_sin_lactosa: true, es_vegetariana: true,
      ingredientes: [
        { nombre: "pulpa de açaí congelada", nombre_normalizado: "acai", nombre_display: "Pulpa de açaí", cantidad_base: 100, unidad: "g", unidad_compra: "paquetes", factor_conversion: 400, descripcion_compra: "paquete de 400g" },
        { nombre: "plátano congelado", nombre_normalizado: "platano", nombre_display: "Plátano congelado", cantidad_base: 100, unidad: "g", unidad_compra: "unidades", factor_conversion: 120, descripcion_compra: "unidad (~120g)" },
        { nombre: "leche de almendras", nombre_normalizado: "leche_almendras", nombre_display: "Leche de almendras", cantidad_base: 80, unidad: "ml", unidad_compra: "cajas", factor_conversion: 1000, descripcion_compra: "caja de 1L" },
        { nombre: "granola", nombre_normalizado: "granola", nombre_display: "Granola", cantidad_base: 30, unidad: "g", unidad_compra: "paquetes", factor_conversion: 350, descripcion_compra: "paquete de 350g" },
        { nombre: "frutillas frescas", nombre_normalizado: "frutilla", nombre_display: "Frutillas", cantidad_base: 60, unidad: "g", unidad_compra: "bandejas", factor_conversion: 400, descripcion_compra: "bandeja de 400g" },
        { nombre: "coco rallado", nombre_normalizado: "coco_rallado", nombre_display: "Coco rallado", cantidad_base: 10, unidad: "g", unidad_compra: "paquetes", factor_conversion: 200, descripcion_compra: "paquete de 200g" },
        { nombre: "miel de abeja", nombre_normalizado: "miel", nombre_display: "Miel de abeja", cantidad_base: 10, unidad: "ml", unidad_compra: "frascos", factor_conversion: 500, descripcion_compra: "frasco de 500ml" }
      ],
      instrucciones: [
        "Colocar en una licuadora potente: 100 g de pulpa de açaí congelada, 100 g de plátano congelado y 80 ml de leche de almendras.",
        "Licuar a velocidad alta durante 30-45 segundos. La textura final debe ser espesa, como un sorbet (si queda líquida, añadir más fruta congelada).",
        "Verter en un bowl frío (idealmente refrigerado 10 minutos antes).",
        "Lavar las frutillas, retirar el cáliz y cortar en láminas finas.",
        "Disponer la granola en un lado del bowl formando media luna; las láminas de frutilla en el otro lado.",
        "Espolvorear el coco rallado por el centro y rociar la miel en espiral. Consumir inmediatamente con cuchara."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "d19",
      nombre: "Tortilla española ligera con espinaca",
      tipo_comida: "desayuno",
      calorias_base: 410, proteinas_g: 26, carbohidratos_g: 30, grasas_g: 20,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: true,
      ingredientes: [
        { nombre: "huevos", nombre_normalizado: "huevo", nombre_display: "Huevos", cantidad_base: 3, unidad: "unidades", unidad_compra: "docenas", factor_conversion: 12, descripcion_compra: "docena" },
        { nombre: "papa", nombre_normalizado: "papa", nombre_display: "Papa", cantidad_base: 150, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
        { nombre: "cebolla", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
        { nombre: "espinaca fresca", nombre_normalizado: "espinaca", nombre_display: "Espinaca fresca", cantidad_base: 60, unidad: "g", unidad_compra: "bolsas", factor_conversion: 200, descripcion_compra: "bolsa de 200g" },
        { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 15, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
        { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 3, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
        { nombre: "pimienta negra", nombre_normalizado: "pimienta", nombre_display: "Pimienta", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" }
      ],
      instrucciones: [
        "Pelar los 150 g de papa y cortarla en rodajas muy finas (2 mm). Picar la media cebolla en juliana fina.",
        "Calentar los 15 ml de aceite de oliva en una sartén antiadherente de 20 cm a fuego medio-bajo. Añadir papa y cebolla con una pizca de sal.",
        "Confitar a fuego bajo durante 15 minutos removiendo cada 3 minutos. Las papas deben quedar tiernas pero no doradas.",
        "Lavar los 60 g de espinaca. Añadirla a la sartén los últimos 2 minutos hasta que se marchite.",
        "Batir los 3 huevos en un bowl con sal y pimienta. Incorporar la mezcla de papa y cebolla escurrida del exceso de aceite y mezclar.",
        "Volver a calentar la sartén con una cucharadita del aceite sobrante. Verter la mezcla y cocinar a fuego medio-bajo 4 minutos.",
        "Colocar un plato del tamaño de la sartén encima, voltear con cuidado y deslizar la tortilla de vuelta para cocinar 3 minutos más por el otro lado.",
        "Servir tibia o a temperatura ambiente, cortada en cuñas."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "d20",
      nombre: "Porridge de quinoa con manzana y nueces",
      tipo_comida: "desayuno",
      calorias_base: 400, proteinas_g: 13, carbohidratos_g: 58, grasas_g: 13,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: true,
      ingredientes: [
        { nombre: "quinoa", nombre_normalizado: "quinoa", nombre_display: "Quinoa", cantidad_base: 60, unidad: "g", unidad_compra: "paquetes", factor_conversion: 500, descripcion_compra: "paquete de 500g" },
        { nombre: "leche de almendras", nombre_normalizado: "leche_almendras", nombre_display: "Leche de almendras", cantidad_base: 250, unidad: "ml", unidad_compra: "cajas", factor_conversion: 1000, descripcion_compra: "caja de 1L" },
        { nombre: "manzana", nombre_normalizado: "manzana", nombre_display: "Manzana", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
        { nombre: "nueces", nombre_normalizado: "nueces", nombre_display: "Nueces", cantidad_base: 15, unidad: "g", unidad_compra: "paquetes", factor_conversion: 200, descripcion_compra: "paquete de 200g" },
        { nombre: "canela en polvo", nombre_normalizado: "canela", nombre_display: "Canela", cantidad_base: 2, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
        { nombre: "miel de abeja", nombre_normalizado: "miel", nombre_display: "Miel de abeja", cantidad_base: 10, unidad: "ml", unidad_compra: "frascos", factor_conversion: 500, descripcion_compra: "frasco de 500ml" }
      ],
      instrucciones: [
        "Enjuagar los 60 g de quinoa bajo agua fría durante 30 segundos frotándola con los dedos (retira la saponina amarga).",
        "En una olla, combinar la quinoa con los 250 ml de leche de almendras y 1 g de canela. Llevar a hervor suave.",
        "Reducir a fuego bajo, tapar y cocinar 15 minutos hasta que la quinoa absorba el líquido y se vea el 'anillo' del germen.",
        "Pelar la manzana y cortarla en cubos pequeños (1 cm). Picar las 15 g de nueces en trozos gruesos.",
        "Retirar la quinoa del fuego, dejar reposar 3 minutos tapada. Debe quedar cremosa, como un risotto dulce.",
        "Servir en un bowl. Coronar con los cubos de manzana, las nueces picadas, el 1 g restante de canela y un hilo de los 10 ml de miel."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "d21",
      nombre: "Wrap de huevo revuelto con espinaca",
      tipo_comida: "desayuno",
      calorias_base: 450, proteinas_g: 24, carbohidratos_g: 40, grasas_g: 20,
      es_sin_gluten: false, es_sin_lactosa: false, es_vegetariana: true,
      ingredientes: [
        { nombre: "tortilla de trigo integral", nombre_normalizado: "tortilla_trigo", nombre_display: "Tortilla de trigo", cantidad_base: 1, unidad: "unidad", unidad_compra: "paquetes", factor_conversion: 8, descripcion_compra: "paquete de 8 unid." },
        { nombre: "huevos", nombre_normalizado: "huevo", nombre_display: "Huevos", cantidad_base: 2, unidad: "unidades", unidad_compra: "docenas", factor_conversion: 12, descripcion_compra: "docena" },
        { nombre: "espinaca fresca", nombre_normalizado: "espinaca", nombre_display: "Espinaca", cantidad_base: 40, unidad: "g", unidad_compra: "bolsas", factor_conversion: 200, descripcion_compra: "bolsa de 200g" },
        { nombre: "queso fresco", nombre_normalizado: "queso_fresco", nombre_display: "Queso fresco", cantidad_base: 30, unidad: "g", unidad_compra: "paquetes", factor_conversion: 250, descripcion_compra: "paquete de 250g" },
        { nombre: "tomate", nombre_normalizado: "tomate", nombre_display: "Tomate", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
        { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 5, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" }
      ],
      instrucciones: [
        "Batir los 2 huevos en un bowl con una pizca de sal y pimienta.",
        "Calentar los 5 ml de aceite de oliva en una sartén antiadherente a fuego medio-bajo.",
        "Verter los huevos y revolver constantemente con una espátula de goma durante 2 minutos hasta que cuajen pero queden cremosos. Retirar.",
        "En la misma sartén, saltear los 40 g de espinaca con las hojas apenas marchitas (1 minuto).",
        "Calentar la tortilla de trigo integral 15 segundos por lado en sartén seca o 20 segundos en microondas.",
        "Rellenar la tortilla con el huevo revuelto, la espinaca, los 30 g de queso fresco desmenuzado y el medio tomate en cubos.",
        "Enrollar firmemente, doblando los extremos hacia adentro. Cortar por la mitad en diagonal y servir."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "d22",
      nombre: "Muffin inglés con palta y huevo pochado",
      tipo_comida: "desayuno",
      calorias_base: 460, proteinas_g: 22, carbohidratos_g: 38, grasas_g: 24,
      es_sin_gluten: false, es_sin_lactosa: true, es_vegetariana: true,
      ingredientes: [
        { nombre: "muffin inglés integral", nombre_normalizado: "muffin_ingles", nombre_display: "Muffin inglés", cantidad_base: 1, unidad: "unidad", unidad_compra: "paquetes", factor_conversion: 6, descripcion_compra: "paquete de 6 unid." },
        { nombre: "huevos", nombre_normalizado: "huevo", nombre_display: "Huevos", cantidad_base: 2, unidad: "unidades", unidad_compra: "docenas", factor_conversion: 12, descripcion_compra: "docena" },
        { nombre: "palta (aguacate)", nombre_normalizado: "palta", nombre_display: "Palta", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
        { nombre: "vinagre blanco", nombre_normalizado: "vinagre", nombre_display: "Vinagre blanco", cantidad_base: 10, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
        { nombre: "limón (jugo)", nombre_normalizado: "limon", nombre_display: "Limón", cantidad_base: 5, unidad: "ml", unidad_compra: "unidades", factor_conversion: 30, descripcion_compra: "unidad (~30ml jugo)" },
        { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 2, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
        { nombre: "pimienta negra", nombre_normalizado: "pimienta", nombre_display: "Pimienta", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" }
      ],
      instrucciones: [
        "Llevar una olla con 1.5 L de agua a hervor suave. Añadir los 10 ml de vinagre (ayuda a que la clara cuaje).",
        "Cascar cada huevo en un recipiente individual. Crear un remolino suave en el agua con una cuchara.",
        "Deslizar un huevo al centro del remolino. Cocinar 3 minutos exactos (clara cuajada, yema líquida). Retirar con espumadera sobre papel absorbente. Repetir con el segundo huevo.",
        "Mientras tanto, abrir el muffin inglés por la mitad y tostarlo en tostadora o sartén seca hasta que esté dorado y crujiente.",
        "Retirar la pulpa de la media palta con cuchara y machacar con un tenedor junto a los 5 ml de jugo de limón, sal y pimienta.",
        "Untar la pasta de palta sobre las dos mitades del muffin.",
        "Colocar cuidadosamente un huevo pochado sobre cada mitad. Terminar con sal en escamas y pimienta recién molida."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "d23",
      nombre: "Batido de proteína con frutos rojos",
      tipo_comida: "desayuno",
      calorias_base: 380, proteinas_g: 32, carbohidratos_g: 42, grasas_g: 8,
      es_sin_gluten: true, es_sin_lactosa: false, es_vegetariana: true,
      ingredientes: [
        { nombre: "proteína en polvo (whey)", nombre_normalizado: "proteina_whey", nombre_display: "Proteína en polvo", cantidad_base: 30, unidad: "g", unidad_compra: "potes", factor_conversion: 900, descripcion_compra: "pote de 900g" },
        { nombre: "leche descremada", nombre_normalizado: "leche_descremada", nombre_display: "Leche descremada", cantidad_base: 300, unidad: "ml", unidad_compra: "cajas", factor_conversion: 1000, descripcion_compra: "caja de 1L" },
        { nombre: "frutillas congeladas", nombre_normalizado: "frutilla", nombre_display: "Frutillas congeladas", cantidad_base: 80, unidad: "g", unidad_compra: "bolsas", factor_conversion: 500, descripcion_compra: "bolsa de 500g" },
        { nombre: "arándanos congelados", nombre_normalizado: "arandanos", nombre_display: "Arándanos congelados", cantidad_base: 60, unidad: "g", unidad_compra: "bolsas", factor_conversion: 500, descripcion_compra: "bolsa de 500g" },
        { nombre: "avena en hojuelas", nombre_normalizado: "avena", nombre_display: "Avena", cantidad_base: 30, unidad: "g", unidad_compra: "paquetes", factor_conversion: 500, descripcion_compra: "paquete de 500g" },
        { nombre: "plátano", nombre_normalizado: "platano", nombre_display: "Plátano", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" }
      ],
      instrucciones: [
        "Colocar en una licuadora: 300 ml de leche descremada, 30 g de proteína en polvo sabor vainilla o neutro, 30 g de avena en hojuelas.",
        "Añadir las 80 g de frutillas congeladas, los 60 g de arándanos congeladas y el medio plátano.",
        "Licuar a velocidad alta durante 45-60 segundos hasta obtener textura cremosa y homogénea.",
        "Si queda demasiado espeso, añadir 30 ml de agua fría y licuar 10 segundos más.",
        "Servir inmediatamente en un vaso frío. Consumir en los siguientes 15 minutos para no perder textura."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "d24",
      nombre: "Arepa rellena con huevo y queso",
      tipo_comida: "desayuno",
      calorias_base: 490, proteinas_g: 24, carbohidratos_g: 52, grasas_g: 20,
      es_sin_gluten: true, es_sin_lactosa: false, es_vegetariana: true,
      ingredientes: [
        { nombre: "harina de maíz precocida", nombre_normalizado: "harina_maiz", nombre_display: "Harina de maíz", cantidad_base: 80, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
        { nombre: "huevos", nombre_normalizado: "huevo", nombre_display: "Huevos", cantidad_base: 2, unidad: "unidades", unidad_compra: "docenas", factor_conversion: 12, descripcion_compra: "docena" },
        { nombre: "queso fresco", nombre_normalizado: "queso_fresco", nombre_display: "Queso fresco", cantidad_base: 40, unidad: "g", unidad_compra: "paquetes", factor_conversion: 250, descripcion_compra: "paquete de 250g" },
        { nombre: "aceite vegetal", nombre_normalizado: "aceite_vegetal", nombre_display: "Aceite vegetal", cantidad_base: 10, unidad: "ml", unidad_compra: "botellas", factor_conversion: 1000, descripcion_compra: "botella de 1L" },
        { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 3, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
      ],
      instrucciones: [
        "En un bowl, mezclar los 80 g de harina de maíz precocida con 120 ml de agua tibia y 1 g de sal.",
        "Amasar con las manos durante 2 minutos hasta obtener una masa suave, sin grietas. Reposar 5 minutos tapada.",
        "Dividir la masa en 2 bolas. Aplanar cada una formando arepas de 1.5 cm de grosor y 10 cm de diámetro.",
        "Calentar una sartén antiadherente a fuego medio. Cocinar las arepas 5 minutos por lado hasta formar costra dorada.",
        "Abrir cada arepa por la mitad con cuchillo sin separar completamente (como pan pita).",
        "En otra sartén con los 10 ml de aceite vegetal, revolver los 2 huevos batidos con sal hasta cuajar cremosos.",
        "Rellenar las arepas con el huevo y los 40 g de queso fresco desmenuzado. Servir de inmediato mientras el queso se derrite con el calor del huevo."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "d25",
      nombre: "Yogur con compota de manzana casera",
      tipo_comida: "desayuno",
      calorias_base: 360, proteinas_g: 16, carbohidratos_g: 50, grasas_g: 10,
      es_sin_gluten: true, es_sin_lactosa: false, es_vegetariana: true,
      ingredientes: [
        { nombre: "yogur griego natural", nombre_normalizado: "yogur_griego", nombre_display: "Yogur griego", cantidad_base: 200, unidad: "g", unidad_compra: "potes", factor_conversion: 500, descripcion_compra: "pote de 500g" },
        { nombre: "manzana", nombre_normalizado: "manzana", nombre_display: "Manzana", cantidad_base: 1.5, unidad: "unidades", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
        { nombre: "canela en polvo", nombre_normalizado: "canela", nombre_display: "Canela", cantidad_base: 2, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
        { nombre: "avena en hojuelas", nombre_normalizado: "avena", nombre_display: "Avena", cantidad_base: 20, unidad: "g", unidad_compra: "paquetes", factor_conversion: 500, descripcion_compra: "paquete de 500g" },
        { nombre: "miel de abeja", nombre_normalizado: "miel", nombre_display: "Miel", cantidad_base: 10, unidad: "ml", unidad_compra: "frascos", factor_conversion: 500, descripcion_compra: "frasco de 500ml" },
        { nombre: "limón (jugo)", nombre_normalizado: "limon", nombre_display: "Limón", cantidad_base: 5, unidad: "ml", unidad_compra: "unidades", factor_conversion: 30, descripcion_compra: "unidad (~30ml jugo)" }
      ],
      instrucciones: [
        "Pelar y descorazonar las 1.5 manzanas. Cortar en cubos de 1 cm.",
        "Colocar los cubos en una olla pequeña con 30 ml de agua, 1 g de canela y los 5 ml de jugo de limón (evita oxidación).",
        "Cocinar a fuego medio-bajo durante 10 minutos removiendo de vez en cuando, hasta que la manzana se deshaga parcialmente.",
        "Añadir los 10 ml de miel y cocinar 2 minutos más. Retirar y dejar templar.",
        "Tostar los 20 g de avena en sartén seca a fuego medio durante 3 minutos hasta que se dore ligeramente y huela a nuez.",
        "Servir los 200 g de yogur griego en un bowl. Añadir la compota tibia, espolvorear la avena tostada y 1 g más de canela.",
        "La compota restante (si sobra) se guarda en frasco hermético hasta 5 días en refrigerador."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "d26",
      nombre: "Burrito de desayuno con frijoles",
      tipo_comida: "desayuno",
      calorias_base: 510, proteinas_g: 24, carbohidratos_g: 58, grasas_g: 20,
      es_sin_gluten: false, es_sin_lactosa: false, es_vegetariana: true,
      ingredientes: [
        { nombre: "tortilla de trigo grande", nombre_normalizado: "tortilla_trigo", nombre_display: "Tortilla de trigo", cantidad_base: 1, unidad: "unidad", unidad_compra: "paquetes", factor_conversion: 8, descripcion_compra: "paquete de 8 unid." },
        { nombre: "huevos", nombre_normalizado: "huevo", nombre_display: "Huevos", cantidad_base: 2, unidad: "unidades", unidad_compra: "docenas", factor_conversion: 12, descripcion_compra: "docena" },
        { nombre: "frijoles negros cocidos", nombre_normalizado: "frijoles_negros", nombre_display: "Frijoles negros", cantidad_base: 80, unidad: "g", unidad_compra: "latas", factor_conversion: 400, descripcion_compra: "lata de 400g" },
        { nombre: "palta (aguacate)", nombre_normalizado: "palta", nombre_display: "Palta", cantidad_base: 0.25, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
        { nombre: "queso cheddar rallado", nombre_normalizado: "queso_cheddar", nombre_display: "Queso cheddar", cantidad_base: 20, unidad: "g", unidad_compra: "paquetes", factor_conversion: 250, descripcion_compra: "paquete de 250g" },
        { nombre: "salsa picante", nombre_normalizado: "salsa_picante", nombre_display: "Salsa picante", cantidad_base: 10, unidad: "g", unidad_compra: "frascos", factor_conversion: 150, descripcion_compra: "frasco de 150g" },
        { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 5, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" }
      ],
      instrucciones: [
        "Escurrir los 80 g de frijoles negros cocidos. Calentarlos en una sartén pequeña con 30 ml de agua y sal durante 4 minutos, machacando parcialmente con tenedor hasta formar una pasta rústica.",
        "Batir los 2 huevos con sal y pimienta. Cocinar en sartén con los 5 ml de aceite a fuego medio-bajo, revolviendo hasta cuajar cremosos (2 minutos).",
        "Machacar el cuarto de palta con tenedor y una pizca de sal.",
        "Calentar la tortilla de trigo grande 15 segundos por lado en sartén seca.",
        "Rellenar el centro con la pasta de frijoles, el huevo revuelto, la palta machacada, los 20 g de queso cheddar rallado y los 10 g de salsa picante.",
        "Doblar los extremos hacia el centro y luego enrollar firmemente desde un lado.",
        "Opcional: dorar el burrito 1 minuto por lado en sartén seca para sellar. Cortar en diagonal y servir."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "d27",
      nombre: "Tostadas con queso ricotta, higos y miel",
      tipo_comida: "desayuno",
      calorias_base: 420, proteinas_g: 18, carbohidratos_g: 56, grasas_g: 14,
      es_sin_gluten: false, es_sin_lactosa: false, es_vegetariana: true,
      ingredientes: [
        { nombre: "pan integral", nombre_normalizado: "pan_integral", nombre_display: "Pan integral", cantidad_base: 2, unidad: "rebanadas", unidad_compra: "paquetes", factor_conversion: 12, descripcion_compra: "paquete de ~12 rebanadas" },
        { nombre: "queso ricotta", nombre_normalizado: "queso_ricotta", nombre_display: "Queso ricotta", cantidad_base: 80, unidad: "g", unidad_compra: "potes", factor_conversion: 250, descripcion_compra: "pote de 250g" },
        { nombre: "higos frescos", nombre_normalizado: "higo", nombre_display: "Higos frescos", cantidad_base: 2, unidad: "unidades", unidad_compra: "bandejas", factor_conversion: 8, descripcion_compra: "bandeja de ~8 unid." },
        { nombre: "miel de abeja", nombre_normalizado: "miel", nombre_display: "Miel", cantidad_base: 15, unidad: "ml", unidad_compra: "frascos", factor_conversion: 500, descripcion_compra: "frasco de 500ml" },
        { nombre: "nueces", nombre_normalizado: "nueces", nombre_display: "Nueces", cantidad_base: 15, unidad: "g", unidad_compra: "paquetes", factor_conversion: 200, descripcion_compra: "paquete de 200g" },
        { nombre: "tomillo fresco", nombre_normalizado: "tomillo", nombre_display: "Tomillo fresco", cantidad_base: 1, unidad: "g", unidad_compra: "paquetes", factor_conversion: 15, descripcion_compra: "paquete de 15g" }
      ],
      instrucciones: [
        "Tostar las 2 rebanadas de pan integral en tostadora hasta que estén doradas y crujientes.",
        "Cortar los 2 higos frescos en cuartos, dejando la piel (aporta color y textura).",
        "Picar las 15 g de nueces en trozos gruesos.",
        "Untar los 80 g de queso ricotta sobre las tostadas formando una capa generosa (1 cm). Dejar espacio en los bordes.",
        "Distribuir los cuartos de higo con la parte cortada hacia arriba sobre el queso ricotta.",
        "Espolvorear las nueces picadas y las hojas del 1 g de tomillo fresco.",
        "Rociar los 15 ml de miel en hilo fino por encima. Terminar con pimienta recién molida. Consumir inmediatamente."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "d28",
      nombre: "Crepes integrales con plátano y chocolate",
      tipo_comida: "desayuno",
      calorias_base: 480, proteinas_g: 16, carbohidratos_g: 64, grasas_g: 18,
      es_sin_gluten: false, es_sin_lactosa: false, es_vegetariana: true,
      ingredientes: [
        { nombre: "harina integral", nombre_normalizado: "harina_integral", nombre_display: "Harina integral", cantidad_base: 50, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
        { nombre: "huevos", nombre_normalizado: "huevo", nombre_display: "Huevos", cantidad_base: 1, unidad: "unidad", unidad_compra: "docenas", factor_conversion: 12, descripcion_compra: "docena" },
        { nombre: "leche descremada", nombre_normalizado: "leche_descremada", nombre_display: "Leche descremada", cantidad_base: 120, unidad: "ml", unidad_compra: "cajas", factor_conversion: 1000, descripcion_compra: "caja de 1L" },
        { nombre: "plátano", nombre_normalizado: "platano", nombre_display: "Plátano", cantidad_base: 1, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
        { nombre: "chocolate amargo 70%", nombre_normalizado: "chocolate_amargo", nombre_display: "Chocolate 70%", cantidad_base: 20, unidad: "g", unidad_compra: "tabletas", factor_conversion: 100, descripcion_compra: "tableta de 100g" },
        { nombre: "mantequilla", nombre_normalizado: "mantequilla", nombre_display: "Mantequilla", cantidad_base: 5, unidad: "g", unidad_compra: "barras", factor_conversion: 250, descripcion_compra: "barra de 250g" }
      ],
      instrucciones: [
        "En un bowl, batir el huevo. Añadir los 120 ml de leche descremada y mezclar.",
        "Incorporar los 50 g de harina integral tamizada y una pizca de sal. Batir con varillas hasta obtener una masa lisa sin grumos. Reposar 10 minutos.",
        "Calentar una sartén antiadherente de 20 cm a fuego medio. Pincelar con un poco de los 5 g de mantequilla derretida.",
        "Verter un cucharón de masa en el centro y distribuir rápidamente girando la sartén. Cocinar 1 minuto hasta que los bordes se despeguen.",
        "Voltear con espátula y cocinar 30 segundos más. Repetir con el resto de la masa (rinde 3 crepes).",
        "Pelar el plátano y cortarlo en rodajas. Trocear los 20 g de chocolate amargo en trozos pequeños.",
        "Rellenar cada crepe con rodajas de plátano y chocolate. Doblar en cuartos o enrollar. Servir inmediatamente: el calor residual derrite el chocolate."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "d29",
      nombre: "Shakshuka individual con pan pita",
      tipo_comida: "desayuno",
      calorias_base: 470, proteinas_g: 22, carbohidratos_g: 44, grasas_g: 22,
      es_sin_gluten: false, es_sin_lactosa: true, es_vegetariana: true,
      ingredientes: [
        { nombre: "huevos", nombre_normalizado: "huevo", nombre_display: "Huevos", cantidad_base: 2, unidad: "unidades", unidad_compra: "docenas", factor_conversion: 12, descripcion_compra: "docena" },
        { nombre: "tomate", nombre_normalizado: "tomate", nombre_display: "Tomate", cantidad_base: 2, unidad: "unidades", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
        { nombre: "pimentón rojo", nombre_normalizado: "pimenton", nombre_display: "Pimentón rojo", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
        { nombre: "cebolla", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
        { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 2, unidad: "dientes", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
        { nombre: "pan pita", nombre_normalizado: "pan_pita", nombre_display: "Pan pita", cantidad_base: 1, unidad: "unidad", unidad_compra: "paquetes", factor_conversion: 6, descripcion_compra: "paquete de 6 unid." },
        { nombre: "pimentón ahumado", nombre_normalizado: "pimenton", nombre_display: "Pimentón ahumado", cantidad_base: 2, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
        { nombre: "comino", nombre_normalizado: "comino", nombre_display: "Comino", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
        { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 10, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
        { nombre: "cilantro fresco", nombre_normalizado: "cilantro", nombre_display: "Cilantro", cantidad_base: 5, unidad: "g", unidad_compra: "manojos", factor_conversion: 50, descripcion_compra: "manojo" }
      ],
      instrucciones: [
        "Picar la media cebolla y el medio pimentón en cubos pequeños. Laminar los 2 dientes de ajo.",
        "Escaldar los 2 tomates 30 segundos en agua hirviendo, pelar y cortar en cubos gruesos.",
        "Calentar los 10 ml de aceite de oliva en una sartén pequeña a fuego medio. Sofreír cebolla 4 minutos hasta translúcida.",
        "Añadir pimentón y ajo, cocinar 3 minutos más. Incorporar los 2 g de pimentón ahumado y 1 g de comino, tostar 30 segundos.",
        "Agregar los tomates picados, sal y pimienta. Reducir a fuego medio-bajo y cocinar 12 minutos hasta formar una salsa espesa.",
        "Hacer 2 huecos en la salsa con una cuchara. Cascar cada huevo directamente en su hueco.",
        "Tapar la sartén y cocinar 5-7 minutos: clara cuajada, yema líquida (ajustar según preferencia).",
        "Mientras, tostar el pan pita en sartén seca 1 minuto por lado.",
        "Espolvorear cilantro picado sobre la shakshuka. Servir en la misma sartén con el pan pita para mojar."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "d30",
      nombre: "Granola casera con yogur y duraznos",
      tipo_comida: "desayuno",
      calorias_base: 430, proteinas_g: 14, carbohidratos_g: 60, grasas_g: 14,
      es_sin_gluten: false, es_sin_lactosa: false, es_vegetariana: true,
      ingredientes: [
        { nombre: "avena en hojuelas", nombre_normalizado: "avena", nombre_display: "Avena", cantidad_base: 50, unidad: "g", unidad_compra: "paquetes", factor_conversion: 500, descripcion_compra: "paquete de 500g" },
        { nombre: "yogur natural", nombre_normalizado: "yogur", nombre_display: "Yogur natural", cantidad_base: 150, unidad: "g", unidad_compra: "potes", factor_conversion: 500, descripcion_compra: "pote de 500g" },
        { nombre: "durazno", nombre_normalizado: "durazno", nombre_display: "Durazno", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
        { nombre: "almendras", nombre_normalizado: "almendras", nombre_display: "Almendras", cantidad_base: 15, unidad: "g", unidad_compra: "paquetes", factor_conversion: 200, descripcion_compra: "paquete de 200g" },
        { nombre: "miel de abeja", nombre_normalizado: "miel", nombre_display: "Miel", cantidad_base: 15, unidad: "ml", unidad_compra: "frascos", factor_conversion: 500, descripcion_compra: "frasco de 500ml" },
        { nombre: "aceite de coco", nombre_normalizado: "aceite_coco", nombre_display: "Aceite de coco", cantidad_base: 5, unidad: "g", unidad_compra: "frascos", factor_conversion: 400, descripcion_compra: "frasco de 400g" },
        { nombre: "canela en polvo", nombre_normalizado: "canela", nombre_display: "Canela", cantidad_base: 2, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" }
      ],
      instrucciones: [
        "Precalentar el horno a 160°C. Forrar bandeja con papel de hornear.",
        "En un bowl, mezclar los 50 g de avena, las 15 g de almendras picadas groseramente y los 2 g de canela.",
        "Derretir los 5 g de aceite de coco y 5 ml de la miel en microondas (15 segundos). Verter sobre la avena y revolver hasta cubrir todos los copos.",
        "Extender en la bandeja formando una capa fina. Hornear 15 minutos removiendo a los 8 minutos. Debe quedar dorada y crujiente.",
        "Dejar enfriar completamente (se endurecerá al enfriar).",
        "Lavar el durazno y cortarlo en rodajas finas sin pelar.",
        "Servir los 150 g de yogur en un bowl, coronar con ~60 g de la granola casera (el resto se guarda en frasco hermético hasta 2 semanas), las rodajas de durazno y los 10 ml restantes de miel."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "d31",
      nombre: "Huevos rotos con jamón y pan",
      tipo_comida: "desayuno",
      calorias_base: 490, proteinas_g: 28, carbohidratos_g: 32, grasas_g: 26,
      es_sin_gluten: false, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        { nombre: "huevos", nombre_normalizado: "huevo", nombre_display: "Huevos", cantidad_base: 2, unidad: "unidades", unidad_compra: "docenas", factor_conversion: 12, descripcion_compra: "docena" },
        { nombre: "jamón serrano", nombre_normalizado: "jamon", nombre_display: "Jamón serrano", cantidad_base: 40, unidad: "g", unidad_compra: "paquetes", factor_conversion: 100, descripcion_compra: "paquete de 100g" },
        { nombre: "pan integral", nombre_normalizado: "pan_integral", nombre_display: "Pan integral", cantidad_base: 2, unidad: "rebanadas", unidad_compra: "paquetes", factor_conversion: 12, descripcion_compra: "paquete de ~12 rebanadas" },
        { nombre: "papa", nombre_normalizado: "papa", nombre_display: "Papa", cantidad_base: 120, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
        { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 15, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
        { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 1, unidad: "diente", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
        { nombre: "pimentón", nombre_normalizado: "pimenton", nombre_display: "Pimentón", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" }
      ],
      instrucciones: [
        "Pelar los 120 g de papa y cortarla en bastones finos (tipo papas fritas, 0.5 cm de grosor).",
        "Calentar los 15 ml de aceite de oliva en una sartén a fuego medio-alto. Freír las papas 8 minutos removiendo cada 2 minutos hasta doradas y crujientes.",
        "Retirar las papas sobre papel absorbente. Salar inmediatamente.",
        "En el mismo aceite (reservar 5 ml), freír el diente de ajo laminado 20 segundos hasta dorado. Retirar.",
        "Freír los 2 huevos con aceite caliente rociando la clara con una cuchara para que se formen ondas crujientes en los bordes. La yema debe quedar líquida (2 minutos).",
        "Tostar las 2 rebanadas de pan integral. Cortar los 40 g de jamón serrano en lonchas finas.",
        "Emplatar: base de papas, huevos encima con yema semi-líquida. 'Romperlos' con cuchillo al servir, el huevo se mezcla con las papas. Acompañar con jamón y pan tostado. Espolvorear pimentón al final."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "d32",
      nombre: "Pudín de chía con frutas tropicales",
      tipo_comida: "desayuno",
      calorias_base: 390, proteinas_g: 12, carbohidratos_g: 50, grasas_g: 14,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: true,
      ingredientes: [
        { nombre: "semillas de chía", nombre_normalizado: "chia", nombre_display: "Semillas de chía", cantidad_base: 30, unidad: "g", unidad_compra: "paquetes", factor_conversion: 200, descripcion_compra: "paquete de 200g" },
        { nombre: "leche de coco", nombre_normalizado: "leche_coco", nombre_display: "Leche de coco", cantidad_base: 200, unidad: "ml", unidad_compra: "latas", factor_conversion: 400, descripcion_compra: "lata de 400ml" },
        { nombre: "mango", nombre_normalizado: "mango", nombre_display: "Mango", cantidad_base: 100, unidad: "g", unidad_compra: "unidades", factor_conversion: 300, descripcion_compra: "unidad (~300g)" },
        { nombre: "piña", nombre_normalizado: "pina", nombre_display: "Piña", cantidad_base: 80, unidad: "g", unidad_compra: "unidades", factor_conversion: 1000, descripcion_compra: "unidad entera ~1kg" },
        { nombre: "miel de abeja", nombre_normalizado: "miel", nombre_display: "Miel", cantidad_base: 10, unidad: "ml", unidad_compra: "frascos", factor_conversion: 500, descripcion_compra: "frasco de 500ml" },
        { nombre: "coco rallado", nombre_normalizado: "coco_rallado", nombre_display: "Coco rallado", cantidad_base: 10, unidad: "g", unidad_compra: "paquetes", factor_conversion: 200, descripcion_compra: "paquete de 200g" }
      ],
      instrucciones: [
        "La noche anterior: mezclar los 30 g de semillas de chía con los 200 ml de leche de coco y los 10 ml de miel en un frasco.",
        "Remover vigorosamente con un tenedor durante 30 segundos para evitar grumos de chía.",
        "Tapar y refrigerar mínimo 4 horas (idealmente toda la noche). Las semillas se hidratan formando textura tipo tapioca.",
        "A la mañana: remover el pudín con tenedor para soltar. Si queda muy espeso, añadir 20 ml más de leche de coco.",
        "Pelar y cortar los 100 g de mango y los 80 g de piña en cubos pequeños.",
        "Servir el pudín en un bowl o copa. Coronar con las frutas tropicales formando capas.",
        "Espolvorear los 10 g de coco rallado por encima. Consumir frío."
      ],
      instrucciones_thermomix: []
    }
  ];

  for (const r of RECETAS_EXTRA) RECETAS_DB.push(r);

  // ═══════════════════════════════════════════
  // SNACKS AM (sa17-sa32)
  // ═══════════════════════════════════════════
  const SNACKS_AM_EXTRA = [
    {
      id: "sa17",
      nombre: "Edamame al vapor con sal marina",
      tipo_comida: "snack_am",
      calorias_base: 180, proteinas_g: 16, carbohidratos_g: 14, grasas_g: 8,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: true,
      ingredientes: [
        { nombre: "edamame con vaina", nombre_normalizado: "edamame", nombre_display: "Edamame", cantidad_base: 150, unidad: "g", unidad_compra: "bolsas", factor_conversion: 500, descripcion_compra: "bolsa congelada de 500g" },
        { nombre: "sal marina", nombre_normalizado: "sal", nombre_display: "Sal marina", cantidad_base: 2, unidad: "g", unidad_compra: "paquetes", factor_conversion: 500, descripcion_compra: "paquete de 500g" }
      ],
      instrucciones: [
        "Hervir 1 L de agua con una cucharada de sal.",
        "Añadir los 150 g de edamame congelado. Cocinar 5 minutos (la vaina debe verse brillante y las semillas tiernas).",
        "Escurrir y enjuagar con agua fría brevemente para detener cocción.",
        "Espolvorear los 2 g de sal marina por encima mientras aún está tibio.",
        "Servir para comer con las manos: presionar la vaina para sacar las semillas directamente a la boca."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "sa18",
      nombre: "Manzana con mantequilla de almendras",
      tipo_comida: "snack_am",
      calorias_base: 220, proteinas_g: 5, carbohidratos_g: 32, grasas_g: 10,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: true,
      ingredientes: [
        { nombre: "manzana", nombre_normalizado: "manzana", nombre_display: "Manzana", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
        { nombre: "mantequilla de almendras", nombre_normalizado: "mantequilla_almendras", nombre_display: "Mantequilla de almendras", cantidad_base: 15, unidad: "g", unidad_compra: "frascos", factor_conversion: 350, descripcion_compra: "frasco de 350g" },
        { nombre: "canela en polvo", nombre_normalizado: "canela", nombre_display: "Canela", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" }
      ],
      instrucciones: [
        "Lavar la manzana. Cortarla en 8 gajos retirando el corazón.",
        "Colocar los gajos en un plato con la parte cortada hacia arriba.",
        "Servir los 15 g de mantequilla de almendras en un cuenco pequeño al centro.",
        "Espolvorear el 1 g de canela sobre los gajos para aroma adicional.",
        "Consumir mojando cada gajo en la mantequilla. Si la mantequilla está muy dura, calentarla 10 segundos en microondas."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "sa19",
      nombre: "Cottage cheese con piña",
      tipo_comida: "snack_am",
      calorias_base: 190, proteinas_g: 18, carbohidratos_g: 20, grasas_g: 4,
      es_sin_gluten: true, es_sin_lactosa: false, es_vegetariana: true,
      ingredientes: [
        { nombre: "queso cottage", nombre_normalizado: "queso_cottage", nombre_display: "Queso cottage", cantidad_base: 150, unidad: "g", unidad_compra: "potes", factor_conversion: 400, descripcion_compra: "pote de 400g" },
        { nombre: "piña", nombre_normalizado: "pina", nombre_display: "Piña", cantidad_base: 100, unidad: "g", unidad_compra: "unidades", factor_conversion: 1000, descripcion_compra: "unidad entera ~1kg" },
        { nombre: "menta fresca", nombre_normalizado: "menta", nombre_display: "Menta fresca", cantidad_base: 2, unidad: "g", unidad_compra: "manojos", factor_conversion: 30, descripcion_compra: "manojo" }
      ],
      instrucciones: [
        "Pelar los 100 g de piña y cortarla en cubos de 1 cm.",
        "Servir los 150 g de queso cottage en un bowl.",
        "Añadir los cubos de piña por encima sin mezclar (conserva la estructura).",
        "Picar finamente las hojas de menta fresca (2 g) y espolvorear encima. La menta contrasta con la dulzura de la piña y refresca."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "sa20",
      nombre: "Barrita casera de avena y dátiles",
      tipo_comida: "snack_am",
      calorias_base: 220, proteinas_g: 6, carbohidratos_g: 34, grasas_g: 8,
      es_sin_gluten: false, es_sin_lactosa: true, es_vegetariana: true,
      ingredientes: [
        { nombre: "avena en hojuelas", nombre_normalizado: "avena", nombre_display: "Avena", cantidad_base: 30, unidad: "g", unidad_compra: "paquetes", factor_conversion: 500, descripcion_compra: "paquete de 500g" },
        { nombre: "dátiles", nombre_normalizado: "datiles", nombre_display: "Dátiles", cantidad_base: 25, unidad: "g", unidad_compra: "paquetes", factor_conversion: 250, descripcion_compra: "paquete de 250g" },
        { nombre: "almendras", nombre_normalizado: "almendras", nombre_display: "Almendras", cantidad_base: 15, unidad: "g", unidad_compra: "paquetes", factor_conversion: 200, descripcion_compra: "paquete de 200g" },
        { nombre: "semillas de chía", nombre_normalizado: "chia", nombre_display: "Chía", cantidad_base: 5, unidad: "g", unidad_compra: "paquetes", factor_conversion: 200, descripcion_compra: "paquete de 200g" }
      ],
      instrucciones: [
        "Deshuesar los 25 g de dátiles. Remojar 5 minutos en agua caliente si están duros.",
        "Picar los dátiles y las 15 g de almendras en trozos pequeños.",
        "En un bowl, combinar los 30 g de avena, los dátiles picados, las almendras y los 5 g de chía.",
        "Mezclar con las manos apretando fuerte para que los dátiles actúen como pegamento natural.",
        "Formar una barra rectangular de 10×3 cm comprimiendo bien. Refrigerar 20 minutos para que tome firmeza.",
        "Envolver en film transparente. Consumir durante la mañana."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "sa21",
      nombre: "Pepino relleno de hummus",
      tipo_comida: "snack_am",
      calorias_base: 150, proteinas_g: 6, carbohidratos_g: 16, grasas_g: 7,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: true,
      ingredientes: [
        { nombre: "pepino", nombre_normalizado: "pepino", nombre_display: "Pepino", cantidad_base: 1, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
        { nombre: "hummus", nombre_normalizado: "hummus", nombre_display: "Hummus", cantidad_base: 50, unidad: "g", unidad_compra: "potes", factor_conversion: 200, descripcion_compra: "pote de 200g" },
        { nombre: "pimentón", nombre_normalizado: "pimenton", nombre_display: "Pimentón", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
        { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 3, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" }
      ],
      instrucciones: [
        "Lavar el pepino. Cortarlo en rodajas gruesas de 2 cm (salen ~8 rodajas).",
        "Con una cucharita pequeña, ahuecar el centro de cada rodaja dejando 0.5 cm de pared (como copitas).",
        "Rellenar cada hueco con los 50 g de hummus usando una manga pastelera o cuchara pequeña.",
        "Espolvorear el 1 g de pimentón sobre los rellenos y rociar hilo fino de los 3 ml de aceite de oliva.",
        "Servir inmediatamente para que el pepino mantenga su textura crujiente."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "sa22",
      nombre: "Batido verde detox",
      tipo_comida: "snack_am",
      calorias_base: 180, proteinas_g: 6, carbohidratos_g: 28, grasas_g: 4,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: true,
      ingredientes: [
        { nombre: "espinaca fresca", nombre_normalizado: "espinaca", nombre_display: "Espinaca", cantidad_base: 50, unidad: "g", unidad_compra: "bolsas", factor_conversion: 200, descripcion_compra: "bolsa de 200g" },
        { nombre: "manzana verde", nombre_normalizado: "manzana", nombre_display: "Manzana verde", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
        { nombre: "pepino", nombre_normalizado: "pepino", nombre_display: "Pepino", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
        { nombre: "jengibre fresco", nombre_normalizado: "jengibre", nombre_display: "Jengibre", cantidad_base: 3, unidad: "g", unidad_compra: "unidades", factor_conversion: 100, descripcion_compra: "raíz ~100g" },
        { nombre: "limón (jugo)", nombre_normalizado: "limon", nombre_display: "Limón", cantidad_base: 10, unidad: "ml", unidad_compra: "unidades", factor_conversion: 30, descripcion_compra: "unidad (~30ml jugo)" },
        { nombre: "agua", nombre_normalizado: "agua", nombre_display: "Agua", cantidad_base: 200, unidad: "ml", unidad_compra: "litros", factor_conversion: 1000, descripcion_compra: "litro" }
      ],
      instrucciones: [
        "Lavar bien los 50 g de espinaca. Descartar tallos muy gruesos.",
        "Pelar y descorazonar la manzana verde. Cortar en trozos.",
        "Pelar el medio pepino solo si no es orgánico (la piel tiene fibra y clorofila).",
        "Pelar y cortar los 3 g de jengibre fresco en láminas.",
        "Colocar todo en licuadora con los 10 ml de jugo de limón y 200 ml de agua fría.",
        "Licuar 60 segundos hasta textura homogénea. Colar si se prefiere sin pulpa.",
        "Servir inmediatamente en vaso alto con hielo. Consumir en los próximos 15 minutos para no perder vitaminas."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "sa23",
      nombre: "Tostadas de arroz con queso crema y salmón",
      tipo_comida: "snack_am",
      calorias_base: 210, proteinas_g: 12, carbohidratos_g: 22, grasas_g: 8,
      es_sin_gluten: true, es_sin_lactosa: false, es_vegetariana: false,
      ingredientes: [
        { nombre: "galletas de arroz", nombre_normalizado: "galleta_arroz", nombre_display: "Galletas de arroz", cantidad_base: 3, unidad: "unidades", unidad_compra: "paquetes", factor_conversion: 20, descripcion_compra: "paquete de ~20 unid." },
        { nombre: "queso crema light", nombre_normalizado: "queso_crema", nombre_display: "Queso crema light", cantidad_base: 30, unidad: "g", unidad_compra: "potes", factor_conversion: 200, descripcion_compra: "pote de 200g" },
        { nombre: "salmón ahumado", nombre_normalizado: "salmon", nombre_display: "Salmón ahumado", cantidad_base: 40, unidad: "g", unidad_compra: "paquetes", factor_conversion: 100, descripcion_compra: "paquete de 100g" },
        { nombre: "eneldo fresco", nombre_normalizado: "eneldo", nombre_display: "Eneldo", cantidad_base: 1, unidad: "g", unidad_compra: "manojos", factor_conversion: 30, descripcion_compra: "manojo" },
        { nombre: "alcaparras", nombre_normalizado: "alcaparras", nombre_display: "Alcaparras", cantidad_base: 5, unidad: "g", unidad_compra: "frascos", factor_conversion: 100, descripcion_compra: "frasco de 100g" }
      ],
      instrucciones: [
        "Untar los 30 g de queso crema light sobre las 3 galletas de arroz formando una capa de 3 mm.",
        "Cortar los 40 g de salmón ahumado en tiras de 1 cm y distribuir sobre el queso.",
        "Escurrir los 5 g de alcaparras y colocar unas pocas sobre cada tostada.",
        "Picar finamente el 1 g de eneldo fresco y espolvorear por encima.",
        "Terminar con pimienta negra recién molida. Servir inmediatamente para que las galletas mantengan crujientes."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "sa24",
      nombre: "Huevos duros con aguacate",
      tipo_comida: "snack_am",
      calorias_base: 230, proteinas_g: 14, carbohidratos_g: 8, grasas_g: 16,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: true,
      ingredientes: [
        { nombre: "huevos", nombre_normalizado: "huevo", nombre_display: "Huevos", cantidad_base: 2, unidad: "unidades", unidad_compra: "docenas", factor_conversion: 12, descripcion_compra: "docena" },
        { nombre: "palta (aguacate)", nombre_normalizado: "palta", nombre_display: "Palta", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
        { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 2, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
        { nombre: "pimienta negra", nombre_normalizado: "pimienta", nombre_display: "Pimienta", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
        { nombre: "limón (jugo)", nombre_normalizado: "limon", nombre_display: "Limón", cantidad_base: 5, unidad: "ml", unidad_compra: "unidades", factor_conversion: 30, descripcion_compra: "unidad (~30ml jugo)" }
      ],
      instrucciones: [
        "Colocar los 2 huevos en una olla con agua fría que los cubra. Añadir una pizca de sal.",
        "Llevar a hervor a fuego alto. Desde que hierve, cocinar exactamente 9 minutos (huevo duro con yema totalmente cocida pero sin el borde verde).",
        "Escurrir y transferir inmediatamente a agua helada durante 3 minutos (frena cocción y facilita pelar).",
        "Pelar los huevos bajo agua corriente y cortar en mitades longitudinales.",
        "Extraer la pulpa de la media palta con cuchara, machacar con tenedor y añadir los 5 ml de jugo de limón, sal y pimienta.",
        "Servir los huevos con una cucharada de palta machacada encima o al lado. Terminar con pimienta recién molida."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "sa25",
      nombre: "Smoothie de banana y espinaca",
      tipo_comida: "snack_am",
      calorias_base: 240, proteinas_g: 14, carbohidratos_g: 36, grasas_g: 5,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: true,
      ingredientes: [
        { nombre: "plátano", nombre_normalizado: "platano", nombre_display: "Plátano", cantidad_base: 1, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
        { nombre: "espinaca fresca", nombre_normalizado: "espinaca", nombre_display: "Espinaca", cantidad_base: 40, unidad: "g", unidad_compra: "bolsas", factor_conversion: 200, descripcion_compra: "bolsa de 200g" },
        { nombre: "leche de almendras", nombre_normalizado: "leche_almendras", nombre_display: "Leche de almendras", cantidad_base: 250, unidad: "ml", unidad_compra: "cajas", factor_conversion: 1000, descripcion_compra: "caja de 1L" },
        { nombre: "proteína en polvo (whey)", nombre_normalizado: "proteina_whey", nombre_display: "Proteína en polvo", cantidad_base: 20, unidad: "g", unidad_compra: "potes", factor_conversion: 900, descripcion_compra: "pote de 900g" },
        { nombre: "mantequilla de maní natural", nombre_normalizado: "mantequilla_mani", nombre_display: "Mantequilla de maní", cantidad_base: 10, unidad: "g", unidad_compra: "frascos", factor_conversion: 350, descripcion_compra: "frasco de 350g" }
      ],
      instrucciones: [
        "Pelar el plátano y trocearlo. Idealmente usarlo congelado para textura cremosa.",
        "Lavar los 40 g de espinaca y escurrir.",
        "Combinar en licuadora: plátano, espinaca, 250 ml de leche de almendras, 20 g de proteína en polvo y 10 g de mantequilla de maní.",
        "Licuar a velocidad máxima durante 45 segundos hasta que no queden trozos verdes visibles.",
        "Servir inmediatamente en vaso alto. El color verde apagado es normal por la combinación con plátano."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "sa26",
      nombre: "Gelatina light con yogur",
      tipo_comida: "snack_am",
      calorias_base: 140, proteinas_g: 10, carbohidratos_g: 18, grasas_g: 2,
      es_sin_gluten: true, es_sin_lactosa: false, es_vegetariana: true,
      ingredientes: [
        { nombre: "gelatina light", nombre_normalizado: "gelatina", nombre_display: "Gelatina light", cantidad_base: 150, unidad: "g", unidad_compra: "sobres", factor_conversion: 30, descripcion_compra: "sobre de 30g rinde 500g" },
        { nombre: "yogur natural descremado", nombre_normalizado: "yogur", nombre_display: "Yogur natural", cantidad_base: 100, unidad: "g", unidad_compra: "potes", factor_conversion: 500, descripcion_compra: "pote de 500g" },
        { nombre: "frutillas frescas", nombre_normalizado: "frutilla", nombre_display: "Frutillas", cantidad_base: 50, unidad: "g", unidad_compra: "bandejas", factor_conversion: 400, descripcion_compra: "bandeja de 400g" }
      ],
      instrucciones: [
        "Preparar la gelatina light el día anterior según instrucciones del sobre (generalmente: disolver en agua caliente, añadir agua fría y refrigerar 4 horas).",
        "Cortar los 150 g de gelatina cuajada en cubos de 2 cm.",
        "Lavar y cortar las 50 g de frutillas en láminas finas.",
        "En una copa, alternar capas: gelatina, 100 g de yogur natural descremado, frutillas.",
        "Repetir hasta terminar los ingredientes. Servir frío con cuchara larga."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "sa27",
      nombre: "Crackers integrales con atún",
      tipo_comida: "snack_am",
      calorias_base: 230, proteinas_g: 18, carbohidratos_g: 22, grasas_g: 8,
      es_sin_gluten: false, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        { nombre: "crackers integrales", nombre_normalizado: "cracker", nombre_display: "Crackers integrales", cantidad_base: 5, unidad: "unidades", unidad_compra: "paquetes", factor_conversion: 24, descripcion_compra: "paquete de ~24 unid." },
        { nombre: "atún en agua", nombre_normalizado: "atun", nombre_display: "Atún en agua", cantidad_base: 80, unidad: "g", unidad_compra: "latas", factor_conversion: 170, descripcion_compra: "lata de 170g" },
        { nombre: "mayonesa light", nombre_normalizado: "mayonesa", nombre_display: "Mayonesa light", cantidad_base: 10, unidad: "g", unidad_compra: "frascos", factor_conversion: 500, descripcion_compra: "frasco de 500g" },
        { nombre: "limón (jugo)", nombre_normalizado: "limon", nombre_display: "Limón", cantidad_base: 5, unidad: "ml", unidad_compra: "unidades", factor_conversion: 30, descripcion_compra: "unidad (~30ml jugo)" },
        { nombre: "cebollín", nombre_normalizado: "cebollin", nombre_display: "Cebollín", cantidad_base: 3, unidad: "g", unidad_compra: "manojos", factor_conversion: 30, descripcion_compra: "manojo" }
      ],
      instrucciones: [
        "Escurrir bien los 80 g de atún en agua presionando con un tenedor para eliminar exceso de líquido.",
        "En un bowl pequeño, mezclar el atún con los 10 g de mayonesa light, los 5 ml de jugo de limón y sal al gusto.",
        "Picar los 3 g de cebollín finamente e incorporar.",
        "Servir las 5 crackers integrales en un plato.",
        "Colocar una cucharada de la mezcla de atún sobre cada cracker justo antes de consumir (si se añade con anticipación, se ablandan)."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "sa28",
      nombre: "Bowl de frutas con yogur y chía",
      tipo_comida: "snack_am",
      calorias_base: 210, proteinas_g: 12, carbohidratos_g: 30, grasas_g: 6,
      es_sin_gluten: true, es_sin_lactosa: false, es_vegetariana: true,
      ingredientes: [
        { nombre: "yogur griego natural", nombre_normalizado: "yogur_griego", nombre_display: "Yogur griego", cantidad_base: 120, unidad: "g", unidad_compra: "potes", factor_conversion: 500, descripcion_compra: "pote de 500g" },
        { nombre: "kiwi", nombre_normalizado: "kiwi", nombre_display: "Kiwi", cantidad_base: 1, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
        { nombre: "frutillas frescas", nombre_normalizado: "frutilla", nombre_display: "Frutillas", cantidad_base: 50, unidad: "g", unidad_compra: "bandejas", factor_conversion: 400, descripcion_compra: "bandeja de 400g" },
        { nombre: "semillas de chía", nombre_normalizado: "chia", nombre_display: "Chía", cantidad_base: 5, unidad: "g", unidad_compra: "paquetes", factor_conversion: 200, descripcion_compra: "paquete de 200g" },
        { nombre: "miel de abeja", nombre_normalizado: "miel", nombre_display: "Miel", cantidad_base: 5, unidad: "ml", unidad_compra: "frascos", factor_conversion: 500, descripcion_compra: "frasco de 500ml" }
      ],
      instrucciones: [
        "Pelar el kiwi y cortarlo en rodajas de 0.5 cm.",
        "Lavar las 50 g de frutillas y cortarlas en cuartos.",
        "Servir los 120 g de yogur griego en un bowl.",
        "Disponer el kiwi y las frutillas sobre el yogur formando sectores de color.",
        "Espolvorear los 5 g de semillas de chía por encima.",
        "Rociar los 5 ml de miel en hilo fino. Consumir en los próximos 10 minutos."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "sa29",
      nombre: "Palitos de apio con queso crema",
      tipo_comida: "snack_am",
      calorias_base: 160, proteinas_g: 5, carbohidratos_g: 10, grasas_g: 10,
      es_sin_gluten: true, es_sin_lactosa: false, es_vegetariana: true,
      ingredientes: [
        { nombre: "apio", nombre_normalizado: "apio", nombre_display: "Apio", cantidad_base: 3, unidad: "tallos", unidad_compra: "manojos", factor_conversion: 10, descripcion_compra: "manojo de ~10 tallos" },
        { nombre: "queso crema light", nombre_normalizado: "queso_crema", nombre_display: "Queso crema light", cantidad_base: 40, unidad: "g", unidad_compra: "potes", factor_conversion: 200, descripcion_compra: "pote de 200g" },
        { nombre: "nueces", nombre_normalizado: "nueces", nombre_display: "Nueces", cantidad_base: 10, unidad: "g", unidad_compra: "paquetes", factor_conversion: 200, descripcion_compra: "paquete de 200g" },
        { nombre: "cebollín", nombre_normalizado: "cebollin", nombre_display: "Cebollín", cantidad_base: 2, unidad: "g", unidad_compra: "manojos", factor_conversion: 30, descripcion_compra: "manojo" }
      ],
      instrucciones: [
        "Lavar los 3 tallos de apio. Retirar las hebras externas con un pelador si están duras.",
        "Cortar los tallos en segmentos de 8 cm.",
        "Picar las 10 g de nueces en trozos pequeños. Picar los 2 g de cebollín.",
        "En un bowl pequeño, mezclar los 40 g de queso crema light con las nueces y cebollín. Sazonar con sal y pimienta.",
        "Rellenar el canal natural del apio con la mezcla usando cuchara o manga pastelera.",
        "Servir inmediatamente o refrigerar hasta 2 horas."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "sa30",
      nombre: "Mini sándwich de pavo y queso",
      tipo_comida: "snack_am",
      calorias_base: 240, proteinas_g: 18, carbohidratos_g: 22, grasas_g: 10,
      es_sin_gluten: false, es_sin_lactosa: false, es_vegetariana: false,
      ingredientes: [
        { nombre: "pan integral", nombre_normalizado: "pan_integral", nombre_display: "Pan integral", cantidad_base: 2, unidad: "rebanadas", unidad_compra: "paquetes", factor_conversion: 12, descripcion_compra: "paquete de ~12 rebanadas" },
        { nombre: "jamón de pavo", nombre_normalizado: "jamon_pavo", nombre_display: "Jamón de pavo", cantidad_base: 40, unidad: "g", unidad_compra: "paquetes", factor_conversion: 150, descripcion_compra: "paquete de 150g" },
        { nombre: "queso gouda", nombre_normalizado: "queso_gouda", nombre_display: "Queso gouda", cantidad_base: 20, unidad: "g", unidad_compra: "paquetes", factor_conversion: 250, descripcion_compra: "paquete de 250g" },
        { nombre: "lechuga", nombre_normalizado: "lechuga", nombre_display: "Lechuga", cantidad_base: 15, unidad: "g", unidad_compra: "unidades", factor_conversion: 400, descripcion_compra: "unidad (~400g)" },
        { nombre: "mostaza dijon", nombre_normalizado: "mostaza", nombre_display: "Mostaza dijon", cantidad_base: 5, unidad: "g", unidad_compra: "frascos", factor_conversion: 200, descripcion_compra: "frasco de 200g" }
      ],
      instrucciones: [
        "Untar los 5 g de mostaza dijon en una de las rebanadas de pan integral.",
        "Colocar los 40 g de jamón de pavo en capas sobre la mostaza.",
        "Añadir los 20 g de queso gouda en lonchas finas sobre el jamón.",
        "Lavar y secar los 15 g de lechuga. Colocar las hojas sobre el queso.",
        "Cerrar con la segunda rebanada. Presionar ligeramente y cortar en 4 triángulos pequeños para servir como finger food."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "sa31",
      nombre: "Mango con chile y limón",
      tipo_comida: "snack_am",
      calorias_base: 140, proteinas_g: 2, carbohidratos_g: 34, grasas_g: 1,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: true,
      ingredientes: [
        { nombre: "mango", nombre_normalizado: "mango", nombre_display: "Mango", cantidad_base: 200, unidad: "g", unidad_compra: "unidades", factor_conversion: 300, descripcion_compra: "unidad (~300g)" },
        { nombre: "limón (jugo)", nombre_normalizado: "limon", nombre_display: "Limón", cantidad_base: 10, unidad: "ml", unidad_compra: "unidades", factor_conversion: 30, descripcion_compra: "unidad (~30ml jugo)" },
        { nombre: "chile en polvo", nombre_normalizado: "chile_polvo", nombre_display: "Chile en polvo", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
        { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 1, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
      ],
      instrucciones: [
        "Pelar los 200 g de mango. Cortar en cubos de 2 cm (preferir mango firme pero maduro).",
        "Colocar los cubos en un bowl.",
        "Rociar con los 10 ml de jugo de limón y mezclar suavemente para cubrir todos los cubos.",
        "Espolvorear el 1 g de chile en polvo y el 1 g de sal por encima.",
        "Servir inmediatamente. Es la versión mexicana del snack callejero clásico."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "sa32",
      nombre: "Yogur proteico con café y cacao",
      tipo_comida: "snack_am",
      calorias_base: 180, proteinas_g: 20, carbohidratos_g: 18, grasas_g: 4,
      es_sin_gluten: true, es_sin_lactosa: false, es_vegetariana: true,
      ingredientes: [
        { nombre: "yogur griego natural", nombre_normalizado: "yogur_griego", nombre_display: "Yogur griego", cantidad_base: 150, unidad: "g", unidad_compra: "potes", factor_conversion: 500, descripcion_compra: "pote de 500g" },
        { nombre: "café instantáneo", nombre_normalizado: "cafe", nombre_display: "Café instantáneo", cantidad_base: 2, unidad: "g", unidad_compra: "frascos", factor_conversion: 200, descripcion_compra: "frasco de 200g" },
        { nombre: "cacao en polvo sin azúcar", nombre_normalizado: "cacao", nombre_display: "Cacao en polvo", cantidad_base: 5, unidad: "g", unidad_compra: "paquetes", factor_conversion: 200, descripcion_compra: "paquete de 200g" },
        { nombre: "miel de abeja", nombre_normalizado: "miel", nombre_display: "Miel", cantidad_base: 10, unidad: "ml", unidad_compra: "frascos", factor_conversion: 500, descripcion_compra: "frasco de 500ml" },
        { nombre: "chocolate amargo 70%", nombre_normalizado: "chocolate_amargo", nombre_display: "Chocolate 70%", cantidad_base: 5, unidad: "g", unidad_compra: "tabletas", factor_conversion: 100, descripcion_compra: "tableta de 100g" }
      ],
      instrucciones: [
        "Disolver los 2 g de café instantáneo en 10 ml de agua caliente.",
        "En un bowl, mezclar los 150 g de yogur griego con el café disuelto y los 5 g de cacao en polvo. Batir con varillas hasta integrar.",
        "Añadir los 10 ml de miel y mezclar.",
        "Rallar los 5 g de chocolate amargo con un microplane o rallador fino sobre la superficie.",
        "Servir en copa o vaso pequeño. Es un snack con perfil tipo tiramisú saludable, alto en proteína."
      ],
      instrucciones_thermomix: []
    }
  ];

  for (const r of SNACKS_AM_EXTRA) RECETAS_DB.push(r);

  // ═══════════════════════════════════════════
  // ALMUERZOS (a17-a32)
  // Instrucciones Thermomix generadas automáticamente
  // por recipes-thermomix-upgrade.js
  // ═══════════════════════════════════════════
  const ALMUERZOS_EXTRA = [
    {
      id: "a17",
      nombre: "Pollo teriyaki con arroz jazmín",
      tipo_comida: "almuerzo",
      calorias_base: 620, proteinas_g: 42, carbohidratos_g: 68, grasas_g: 16,
      es_sin_gluten: false, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        { nombre: "pechuga de pollo", nombre_normalizado: "pechuga_pollo", nombre_display: "Pechuga de pollo", cantidad_base: 180, unidad: "g", unidad_compra: "bandejas", factor_conversion: 500, descripcion_compra: "bandeja de 500g" },
        { nombre: "arroz jazmín", nombre_normalizado: "arroz_blanco", nombre_display: "Arroz jazmín", cantidad_base: 80, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
        { nombre: "salsa de soya", nombre_normalizado: "salsa_soya", nombre_display: "Salsa de soya", cantidad_base: 30, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
        { nombre: "miel de abeja", nombre_normalizado: "miel", nombre_display: "Miel", cantidad_base: 15, unidad: "ml", unidad_compra: "frascos", factor_conversion: 500, descripcion_compra: "frasco de 500ml" },
        { nombre: "jengibre fresco", nombre_normalizado: "jengibre", nombre_display: "Jengibre", cantidad_base: 5, unidad: "g", unidad_compra: "unidades", factor_conversion: 100, descripcion_compra: "raíz ~100g" },
        { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 2, unidad: "dientes", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
        { nombre: "brócoli", nombre_normalizado: "brocoli", nombre_display: "Brócoli", cantidad_base: 150, unidad: "g", unidad_compra: "unidades", factor_conversion: 500, descripcion_compra: "unidad (~500g)" },
        { nombre: "zanahoria", nombre_normalizado: "zanahoria", nombre_display: "Zanahoria", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 7, descripcion_compra: "~7 unidades por kg" },
        { nombre: "aceite de sésamo", nombre_normalizado: "aceite_sesamo", nombre_display: "Aceite de sésamo", cantidad_base: 5, unidad: "ml", unidad_compra: "botellas", factor_conversion: 250, descripcion_compra: "botella de 250ml" },
        { nombre: "sésamo tostado", nombre_normalizado: "sesamo", nombre_display: "Sésamo tostado", cantidad_base: 5, unidad: "g", unidad_compra: "frascos", factor_conversion: 100, descripcion_compra: "frasco de 100g" }
      ],
      instrucciones: [
        "Enjuagar los 80 g de arroz jazmín hasta que el agua salga clara. Cocinar con 160 ml de agua y sal: hervor + tapa + fuego bajo 15 min. Reposar tapado 5 min.",
        "Cortar la pechuga de pollo en cubos de 2.5 cm.",
        "Preparar la salsa teriyaki: mezclar los 30 ml de salsa de soya, los 15 ml de miel, el jengibre rallado y los 2 dientes de ajo picados finamente.",
        "Calentar los 5 ml de aceite de sésamo en sartén grande a fuego alto. Añadir los cubos de pollo y sellar 3 minutos removiendo hasta dorar.",
        "Separar el brócoli en ramilletes y cortar la zanahoria en rodajas finas diagonales.",
        "Añadir las verduras a la sartén con el pollo. Saltear 4 minutos.",
        "Verter la salsa teriyaki y reducir a fuego medio-alto durante 3 minutos hasta que espese y glasee todo.",
        "Servir el pollo y verduras sobre el arroz jazmín. Espolvorear los 5 g de sésamo tostado."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "a18",
      nombre: "Merluza al ajillo con papas aplastadas",
      tipo_comida: "almuerzo",
      calorias_base: 540, proteinas_g: 38, carbohidratos_g: 48, grasas_g: 18,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        { nombre: "merluza fresca", nombre_normalizado: "merluza", nombre_display: "Merluza", cantidad_base: 200, unidad: "g", unidad_compra: "bandejas", factor_conversion: 500, descripcion_compra: "bandeja de 500g" },
        { nombre: "papa", nombre_normalizado: "papa", nombre_display: "Papa", cantidad_base: 250, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
        { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 4, unidad: "dientes", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
        { nombre: "perejil fresco", nombre_normalizado: "perejil", nombre_display: "Perejil", cantidad_base: 10, unidad: "g", unidad_compra: "manojos", factor_conversion: 50, descripcion_compra: "manojo" },
        { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 25, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
        { nombre: "limón (jugo)", nombre_normalizado: "limon", nombre_display: "Limón", cantidad_base: 15, unidad: "ml", unidad_compra: "unidades", factor_conversion: 30, descripcion_compra: "unidad (~30ml jugo)" },
        { nombre: "pimentón", nombre_normalizado: "pimenton", nombre_display: "Pimentón", cantidad_base: 2, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
        { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 5, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
      ],
      instrucciones: [
        "Lavar los 250 g de papa sin pelar. Cocinar enteras en olla con agua con sal durante 20 min hasta que un cuchillo entre fácil.",
        "Escurrir las papas y aplastarlas con un tenedor directo en el plato (rústicas, con piel) o con un mortero.",
        "Revisar la merluza con pinza retirando espinas. Secar con papel absorbente. Salar por ambos lados.",
        "Laminar los 4 dientes de ajo muy finos. Picar el perejil.",
        "Calentar los 25 ml de aceite de oliva en una sartén grande a fuego medio. Dorar los ajos hasta dorados (1 min, no quemar).",
        "Añadir la merluza con la piel hacia abajo. Cocinar 4 min sin mover. Voltear con espátula y cocinar 2 min más (la carne debe desprenderse en lascas).",
        "Retirar la merluza. Espolvorear los 2 g de pimentón sobre el aceite (fuego bajo, no se quema). Añadir los 15 ml de jugo de limón.",
        "Verter la salsa sobre la merluza. Espolvorear perejil fresco. Servir sobre las papas aplastadas."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "a19",
      nombre: "Pollo a la plancha con quinoa y vegetales",
      tipo_comida: "almuerzo",
      calorias_base: 580, proteinas_g: 42, carbohidratos_g: 54, grasas_g: 18,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        { nombre: "pechuga de pollo", nombre_normalizado: "pechuga_pollo", nombre_display: "Pechuga de pollo", cantidad_base: 180, unidad: "g", unidad_compra: "bandejas", factor_conversion: 500, descripcion_compra: "bandeja de 500g" },
        { nombre: "quinoa", nombre_normalizado: "quinoa", nombre_display: "Quinoa", cantidad_base: 80, unidad: "g", unidad_compra: "paquetes", factor_conversion: 500, descripcion_compra: "paquete de 500g" },
        { nombre: "zapallo italiano (calabacín)", nombre_normalizado: "calabacin", nombre_display: "Calabacín", cantidad_base: 150, unidad: "g", unidad_compra: "unidades", factor_conversion: 300, descripcion_compra: "unidad (~300g)" },
        { nombre: "pimiento rojo", nombre_normalizado: "pimiento", nombre_display: "Pimiento rojo", cantidad_base: 100, unidad: "g", unidad_compra: "unidades", factor_conversion: 200, descripcion_compra: "unidad (~200g)" },
        { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 15, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
        { nombre: "orégano", nombre_normalizado: "oregano", nombre_display: "Orégano", cantidad_base: 2, unidad: "g", unidad_compra: "frascos", factor_conversion: 30, descripcion_compra: "frasco de 30g" },
        { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 1, unidad: "diente", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
        { nombre: "limón (jugo)", nombre_normalizado: "limon", nombre_display: "Limón", cantidad_base: 10, unidad: "ml", unidad_compra: "unidades", factor_conversion: 30, descripcion_compra: "unidad (~30ml jugo)" },
        { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 3, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
      ],
      instrucciones: [
        "Enjuagar los 80 g de quinoa bajo agua fría durante 1 min. Cocinar con 160 ml de agua y sal: hervor + tapa + fuego bajo 15 min. Reposar 3 min.",
        "Cortar la pechuga en 2 filetes del mismo grosor (1.5 cm). Salpimentar, rociar jugo de limón y orégano. Marinar 15 min.",
        "Cortar el calabacín en medias lunas de 1 cm. Cortar el pimiento en tiras de 1 cm.",
        "Calentar una plancha o sartén a fuego alto hasta que humee ligeramente. Pincelar con 5 ml de aceite de oliva.",
        "Cocinar los filetes 4 min por lado sin moverlos (marcado profesional). Reposar 3 min tapados con papel aluminio.",
        "En otra sartén con los 10 ml restantes de aceite, saltear el ajo picado 20 segundos. Añadir pimiento, saltear 3 min.",
        "Añadir el calabacín, saltear 3 min más. Las verduras deben quedar crujientes-al dente.",
        "Emplatar: base de quinoa, filete laminado al bisel, verduras al costado. Terminar con un hilo de aceite de oliva crudo."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "a20",
      nombre: "Lasaña de verduras y queso ricotta",
      tipo_comida: "almuerzo",
      calorias_base: 590, proteinas_g: 24, carbohidratos_g: 62, grasas_g: 26,
      es_sin_gluten: false, es_sin_lactosa: false, es_vegetariana: true,
      ingredientes: [
        { nombre: "láminas de lasaña", nombre_normalizado: "pasta", nombre_display: "Láminas de lasaña", cantidad_base: 80, unidad: "g", unidad_compra: "paquetes", factor_conversion: 500, descripcion_compra: "paquete de 500g" },
        { nombre: "queso ricotta", nombre_normalizado: "queso_ricotta", nombre_display: "Queso ricotta", cantidad_base: 150, unidad: "g", unidad_compra: "potes", factor_conversion: 250, descripcion_compra: "pote de 250g" },
        { nombre: "espinaca fresca", nombre_normalizado: "espinaca", nombre_display: "Espinaca", cantidad_base: 150, unidad: "g", unidad_compra: "bolsas", factor_conversion: 200, descripcion_compra: "bolsa de 200g" },
        { nombre: "zapallo italiano (calabacín)", nombre_normalizado: "calabacin", nombre_display: "Calabacín", cantidad_base: 100, unidad: "g", unidad_compra: "unidades", factor_conversion: 300, descripcion_compra: "unidad (~300g)" },
        { nombre: "salsa de tomate", nombre_normalizado: "salsa_tomate", nombre_display: "Salsa de tomate", cantidad_base: 200, unidad: "ml", unidad_compra: "frascos", factor_conversion: 500, descripcion_compra: "frasco de 500ml" },
        { nombre: "queso mozzarella rallado", nombre_normalizado: "queso_mozzarella", nombre_display: "Mozzarella", cantidad_base: 60, unidad: "g", unidad_compra: "paquetes", factor_conversion: 250, descripcion_compra: "paquete de 250g" },
        { nombre: "cebolla", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
        { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 2, unidad: "dientes", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
        { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 15, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
        { nombre: "nuez moscada", nombre_normalizado: "nuez_moscada", nombre_display: "Nuez moscada", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 30, descripcion_compra: "frasco de 30g" }
      ],
      instrucciones: [
        "Precalentar horno a 180°C.",
        "Picar la media cebolla y los 2 ajos finamente. Sofreír en los 15 ml de aceite de oliva a fuego medio 5 min.",
        "Añadir la espinaca lavada, saltear hasta marchitar (2 min). Escurrir el exceso de líquido y picar grueso.",
        "Cortar el calabacín en rodajas finas (0.3 cm).",
        "En un bowl, mezclar el queso ricotta con la espinaca sofrita, sal, pimienta y 1 g de nuez moscada rallada.",
        "Hervir las láminas de lasaña en agua con sal según paquete (generalmente 8 min, 2 min menos que al dente pues seguirán cocinándose en el horno).",
        "Montar en fuente: capa de salsa de tomate, láminas de lasaña, mezcla ricotta-espinaca, rodajas de calabacín, más salsa. Repetir hasta terminar.",
        "Cubrir con los 60 g de mozzarella rallada. Hornear 25 min hasta gratinar.",
        "Reposar 10 min antes de cortar (permite que las capas se estabilicen)."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "a21",
      nombre: "Bowl mediterráneo con pollo y falafel",
      tipo_comida: "almuerzo",
      calorias_base: 640, proteinas_g: 38, carbohidratos_g: 68, grasas_g: 22,
      es_sin_gluten: true, es_sin_lactosa: false, es_vegetariana: false,
      ingredientes: [
        { nombre: "pechuga de pollo", nombre_normalizado: "pechuga_pollo", nombre_display: "Pechuga de pollo", cantidad_base: 150, unidad: "g", unidad_compra: "bandejas", factor_conversion: 500, descripcion_compra: "bandeja de 500g" },
        { nombre: "garbanzos cocidos", nombre_normalizado: "garbanzos", nombre_display: "Garbanzos", cantidad_base: 80, unidad: "g", unidad_compra: "latas", factor_conversion: 400, descripcion_compra: "lata de 400g" },
        { nombre: "quinoa", nombre_normalizado: "quinoa", nombre_display: "Quinoa", cantidad_base: 60, unidad: "g", unidad_compra: "paquetes", factor_conversion: 500, descripcion_compra: "paquete de 500g" },
        { nombre: "pepino", nombre_normalizado: "pepino", nombre_display: "Pepino", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
        { nombre: "tomate cherry", nombre_normalizado: "tomate_cherry", nombre_display: "Tomate cherry", cantidad_base: 80, unidad: "g", unidad_compra: "bandejas", factor_conversion: 250, descripcion_compra: "bandeja de 250g" },
        { nombre: "queso feta", nombre_normalizado: "queso", nombre_display: "Queso feta", cantidad_base: 40, unidad: "g", unidad_compra: "paquetes", factor_conversion: 200, descripcion_compra: "paquete de 200g" },
        { nombre: "aceitunas negras", nombre_normalizado: "aceitunas", nombre_display: "Aceitunas negras", cantidad_base: 20, unidad: "g", unidad_compra: "frascos", factor_conversion: 200, descripcion_compra: "frasco de 200g" },
        { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 15, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
        { nombre: "comino", nombre_normalizado: "comino", nombre_display: "Comino", cantidad_base: 2, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
        { nombre: "limón (jugo)", nombre_normalizado: "limon", nombre_display: "Limón", cantidad_base: 15, unidad: "ml", unidad_compra: "unidades", factor_conversion: 30, descripcion_compra: "unidad (~30ml jugo)" },
        { nombre: "perejil fresco", nombre_normalizado: "perejil", nombre_display: "Perejil", cantidad_base: 5, unidad: "g", unidad_compra: "manojos", factor_conversion: 50, descripcion_compra: "manojo" }
      ],
      instrucciones: [
        "Enjuagar los 60 g de quinoa 1 min. Cocer con 120 ml de agua y sal: hervor + tapa + fuego bajo 15 min. Reposar 3 min.",
        "Cortar el pollo en cubos de 2 cm. Sazonar con comino, sal y pimienta.",
        "Escurrir y enjuagar los 80 g de garbanzos. Secar bien con papel.",
        "Calentar 10 ml de aceite de oliva en sartén a fuego alto. Sellar el pollo 4 min removiendo hasta dorado. Retirar.",
        "En la misma sartén, saltear los garbanzos 3 min hasta crujientes por fuera.",
        "Cortar el pepino en medias lunas. Partir los tomates cherry por la mitad.",
        "Desmenuzar los 40 g de queso feta. Escurrir las aceitunas negras y cortarlas en rodajas.",
        "Montar el bowl: base de quinoa, sectores de pollo, garbanzos, pepino, tomates, feta y aceitunas.",
        "Aliñar con los 5 ml de aceite restante y los 15 ml de jugo de limón. Espolvorear perejil picado."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "a22",
      nombre: "Guiso de carne con verduras",
      tipo_comida: "almuerzo",
      calorias_base: 620, proteinas_g: 38, carbohidratos_g: 52, grasas_g: 24,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        { nombre: "carne de res para guisar", nombre_normalizado: "carne_res", nombre_display: "Carne de res", cantidad_base: 180, unidad: "g", unidad_compra: "bandejas", factor_conversion: 500, descripcion_compra: "bandeja de 500g" },
        { nombre: "papa", nombre_normalizado: "papa", nombre_display: "Papa", cantidad_base: 200, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
        { nombre: "zanahoria", nombre_normalizado: "zanahoria", nombre_display: "Zanahoria", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 7, descripcion_compra: "~7 unidades por kg" },
        { nombre: "cebolla", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
        { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 3, unidad: "dientes", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
        { nombre: "pimiento rojo", nombre_normalizado: "pimiento", nombre_display: "Pimiento rojo", cantidad_base: 100, unidad: "g", unidad_compra: "unidades", factor_conversion: 200, descripcion_compra: "unidad (~200g)" },
        { nombre: "salsa de tomate", nombre_normalizado: "salsa_tomate", nombre_display: "Salsa de tomate", cantidad_base: 150, unidad: "ml", unidad_compra: "frascos", factor_conversion: 500, descripcion_compra: "frasco de 500ml" },
        { nombre: "caldo de carne", nombre_normalizado: "caldo_carne", nombre_display: "Caldo de carne", cantidad_base: 300, unidad: "ml", unidad_compra: "cajas", factor_conversion: 1000, descripcion_compra: "caja de 1L" },
        { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 20, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
        { nombre: "pimentón", nombre_normalizado: "pimenton", nombre_display: "Pimentón", cantidad_base: 3, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
        { nombre: "laurel", nombre_normalizado: "laurel", nombre_display: "Laurel", cantidad_base: 1, unidad: "hoja", unidad_compra: "frascos", factor_conversion: 20, descripcion_compra: "frasco de ~20 hojas" }
      ],
      instrucciones: [
        "Cortar los 180 g de carne en cubos de 3 cm. Salpimentar y enharinar ligeramente (ayuda a dorar y espesar).",
        "Calentar los 20 ml de aceite en olla grande a fuego alto. Sellar la carne en 2 tandas (3 min por tanda). Reservar.",
        "Picar la cebolla finamente, los ajos, el pimiento en cubos de 1 cm y la zanahoria en rodajas gruesas.",
        "En la misma olla, bajar a fuego medio. Sofreír cebolla y ajo 5 min hasta translúcida.",
        "Añadir pimiento y zanahoria, cocinar 4 min más. Incorporar los 3 g de pimentón, tostar 30 segundos (no quemar, amarga).",
        "Devolver la carne con sus jugos. Añadir los 150 ml de salsa de tomate, los 300 ml de caldo y la hoja de laurel.",
        "Llevar a hervor, reducir a fuego bajo y tapar. Cocinar 45 min removiendo cada 15 min.",
        "Pelar las papas y cortar en cubos de 3 cm. Añadir a la olla y cocinar 25 min más hasta que estén tiernas y la carne se deshaga.",
        "Retirar el laurel. Rectificar sal y pimienta. Reposar 10 min tapado antes de servir para intensificar sabores."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "a23",
      nombre: "Pasta primavera con pollo",
      tipo_comida: "almuerzo",
      calorias_base: 610, proteinas_g: 36, carbohidratos_g: 72, grasas_g: 16,
      es_sin_gluten: false, es_sin_lactosa: false, es_vegetariana: false,
      ingredientes: [
        { nombre: "pasta penne", nombre_normalizado: "pasta_penne", nombre_display: "Pasta penne", cantidad_base: 90, unidad: "g", unidad_compra: "paquetes", factor_conversion: 500, descripcion_compra: "paquete de 500g" },
        { nombre: "pechuga de pollo", nombre_normalizado: "pechuga_pollo", nombre_display: "Pechuga de pollo", cantidad_base: 150, unidad: "g", unidad_compra: "bandejas", factor_conversion: 500, descripcion_compra: "bandeja de 500g" },
        { nombre: "brócoli", nombre_normalizado: "brocoli", nombre_display: "Brócoli", cantidad_base: 100, unidad: "g", unidad_compra: "unidades", factor_conversion: 500, descripcion_compra: "unidad (~500g)" },
        { nombre: "zapallo italiano (calabacín)", nombre_normalizado: "calabacin", nombre_display: "Calabacín", cantidad_base: 100, unidad: "g", unidad_compra: "unidades", factor_conversion: 300, descripcion_compra: "unidad (~300g)" },
        { nombre: "tomate cherry", nombre_normalizado: "tomate_cherry", nombre_display: "Tomate cherry", cantidad_base: 100, unidad: "g", unidad_compra: "bandejas", factor_conversion: 250, descripcion_compra: "bandeja de 250g" },
        { nombre: "crema de leche", nombre_normalizado: "crema", nombre_display: "Crema de leche", cantidad_base: 60, unidad: "ml", unidad_compra: "potes", factor_conversion: 250, descripcion_compra: "pote de 250ml" },
        { nombre: "queso parmesano", nombre_normalizado: "queso_parmesano", nombre_display: "Queso parmesano", cantidad_base: 20, unidad: "g", unidad_compra: "paquetes", factor_conversion: 200, descripcion_compra: "paquete de 200g" },
        { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 2, unidad: "dientes", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
        { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 15, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
        { nombre: "albahaca fresca", nombre_normalizado: "albahaca", nombre_display: "Albahaca", cantidad_base: 5, unidad: "g", unidad_compra: "plantas", factor_conversion: 30, descripcion_compra: "planta ~30g" }
      ],
      instrucciones: [
        "Hervir abundante agua con sal (10 g por litro). Cocinar los 90 g de pasta penne según paquete (generalmente 11 min para al dente).",
        "Reservar 100 ml del agua de cocción antes de escurrir (líquido de cocción para la salsa).",
        "Cortar el pollo en tiras. Separar el brócoli en ramilletes pequeños. Cortar el calabacín en medias lunas. Partir los tomates cherry.",
        "Calentar 10 ml de aceite en sartén grande a fuego alto. Saltear el pollo 4 min hasta dorado. Retirar.",
        "Añadir 5 ml más de aceite y los 2 ajos picados. Saltear 20 seg.",
        "Agregar brócoli y calabacín, saltear 4 min. Incorporar los tomates cherry 1 min más (deben reventar ligeramente).",
        "Devolver el pollo. Verter la crema y 50 ml del agua de cocción. Reducir 2 min a fuego medio.",
        "Añadir la pasta escurrida. Mezclar todo y cocinar 1 min para que la pasta absorba la salsa.",
        "Fuera del fuego, añadir los 20 g de parmesano rallado y la albahaca picada. Servir inmediatamente."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "a24",
      nombre: "Pimientos rellenos con carne y arroz",
      tipo_comida: "almuerzo",
      calorias_base: 560, proteinas_g: 32, carbohidratos_g: 48, grasas_g: 22,
      es_sin_gluten: true, es_sin_lactosa: false, es_vegetariana: false,
      ingredientes: [
        { nombre: "pimiento rojo grande", nombre_normalizado: "pimiento", nombre_display: "Pimiento rojo", cantidad_base: 2, unidad: "unidades", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad (~200g)" },
        { nombre: "carne molida de res", nombre_normalizado: "carne_molida", nombre_display: "Carne molida", cantidad_base: 150, unidad: "g", unidad_compra: "bandejas", factor_conversion: 500, descripcion_compra: "bandeja de 500g" },
        { nombre: "arroz blanco", nombre_normalizado: "arroz_blanco", nombre_display: "Arroz blanco", cantidad_base: 50, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
        { nombre: "cebolla", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
        { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 2, unidad: "dientes", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
        { nombre: "tomate", nombre_normalizado: "tomate", nombre_display: "Tomate", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
        { nombre: "queso mozzarella rallado", nombre_normalizado: "queso_mozzarella", nombre_display: "Mozzarella", cantidad_base: 50, unidad: "g", unidad_compra: "paquetes", factor_conversion: 250, descripcion_compra: "paquete de 250g" },
        { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 15, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
        { nombre: "pimentón", nombre_normalizado: "pimenton", nombre_display: "Pimentón", cantidad_base: 2, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
        { nombre: "perejil fresco", nombre_normalizado: "perejil", nombre_display: "Perejil", cantidad_base: 5, unidad: "g", unidad_compra: "manojos", factor_conversion: 50, descripcion_compra: "manojo" }
      ],
      instrucciones: [
        "Precalentar horno a 180°C.",
        "Cortar la parte superior de los 2 pimientos (reservar como 'tapa') y retirar semillas. Hervir 3 min en agua con sal para ablandar.",
        "Cocinar los 50 g de arroz: enjuagar, hervir con 100 ml de agua con sal, tapa, fuego bajo 15 min. Reposar tapado 5 min.",
        "Picar la media cebolla y 2 ajos finamente. Picar el tomate en cubos pequeños.",
        "Calentar los 15 ml de aceite en sartén a fuego medio. Sofreír cebolla y ajo 4 min.",
        "Añadir los 150 g de carne molida desmenuzada. Cocinar 6 min hasta dorar, rompiendo con espátula.",
        "Incorporar los 2 g de pimentón, el tomate picado, sal y pimienta. Cocinar 5 min hasta reducir.",
        "Mezclar con el arroz cocido y la mitad del perejil picado.",
        "Rellenar los pimientos con la mezcla. Espolvorear los 50 g de mozzarella. Tapar con las tapas reservadas.",
        "Hornear 20 min en fuente con un dedo de agua (evita que se sequen). Gratinar los últimos 3 min sin tapa.",
        "Espolvorear perejil fresco al servir."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "a25",
      nombre: "Curry de garbanzos con arroz basmati",
      tipo_comida: "almuerzo",
      calorias_base: 580, proteinas_g: 20, carbohidratos_g: 90, grasas_g: 16,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: true,
      ingredientes: [
        { nombre: "garbanzos cocidos", nombre_normalizado: "garbanzos", nombre_display: "Garbanzos", cantidad_base: 200, unidad: "g", unidad_compra: "latas", factor_conversion: 400, descripcion_compra: "lata de 400g" },
        { nombre: "arroz basmati", nombre_normalizado: "arroz_basmati", nombre_display: "Arroz basmati", cantidad_base: 80, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
        { nombre: "leche de coco", nombre_normalizado: "leche_coco", nombre_display: "Leche de coco", cantidad_base: 200, unidad: "ml", unidad_compra: "latas", factor_conversion: 400, descripcion_compra: "lata de 400ml" },
        { nombre: "tomate", nombre_normalizado: "tomate", nombre_display: "Tomate", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
        { nombre: "cebolla", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
        { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 3, unidad: "dientes", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
        { nombre: "jengibre fresco", nombre_normalizado: "jengibre", nombre_display: "Jengibre", cantidad_base: 10, unidad: "g", unidad_compra: "unidades", factor_conversion: 100, descripcion_compra: "raíz ~100g" },
        { nombre: "curry en polvo", nombre_normalizado: "curry", nombre_display: "Curry en polvo", cantidad_base: 5, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
        { nombre: "comino", nombre_normalizado: "comino", nombre_display: "Comino", cantidad_base: 2, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
        { nombre: "aceite vegetal", nombre_normalizado: "aceite_vegetal", nombre_display: "Aceite vegetal", cantidad_base: 15, unidad: "ml", unidad_compra: "botellas", factor_conversion: 1000, descripcion_compra: "botella de 1L" },
        { nombre: "cilantro fresco", nombre_normalizado: "cilantro", nombre_display: "Cilantro", cantidad_base: 10, unidad: "g", unidad_compra: "manojos", factor_conversion: 50, descripcion_compra: "manojo" }
      ],
      instrucciones: [
        "Enjuagar los 80 g de arroz basmati hasta que el agua salga clara (5 enjuagues). Cocinar con 160 ml de agua y sal: hervor + tapa + fuego bajo 12 min. Reposar 5 min.",
        "Picar la cebolla, los 3 ajos y el jengibre muy finos (pasta aromática).",
        "Escaldar el tomate 30 seg, pelar y picar. Escurrir los 200 g de garbanzos.",
        "Calentar los 15 ml de aceite vegetal en olla mediana a fuego medio. Sofreír la cebolla 5 min hasta translúcida.",
        "Añadir ajo, jengibre, 5 g de curry y 2 g de comino. Tostar removiendo 1 min (las especias liberan aroma).",
        "Incorporar el tomate picado y cocinar 4 min hasta deshacer.",
        "Agregar los garbanzos y los 200 ml de leche de coco. Salar.",
        "Llevar a hervor suave, reducir a fuego bajo y cocinar 15 min tapado, removiendo cada 5 min. La salsa debe espesar y los garbanzos ablandarse más.",
        "Rectificar sal. Servir sobre el arroz basmati. Espolvorear cilantro fresco picado al final."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "a26",
      nombre: "Wok de carne con fideos y vegetales",
      tipo_comida: "almuerzo",
      calorias_base: 640, proteinas_g: 36, carbohidratos_g: 72, grasas_g: 22,
      es_sin_gluten: false, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        { nombre: "carne de res (bife)", nombre_normalizado: "carne_res", nombre_display: "Carne de res", cantidad_base: 160, unidad: "g", unidad_compra: "bandejas", factor_conversion: 500, descripcion_compra: "bandeja de 500g" },
        { nombre: "fideos udon o lo mein", nombre_normalizado: "fideo", nombre_display: "Fideos udon", cantidad_base: 100, unidad: "g", unidad_compra: "paquetes", factor_conversion: 400, descripcion_compra: "paquete de 400g" },
        { nombre: "pimiento rojo", nombre_normalizado: "pimiento", nombre_display: "Pimiento rojo", cantidad_base: 100, unidad: "g", unidad_compra: "unidades", factor_conversion: 200, descripcion_compra: "unidad (~200g)" },
        { nombre: "repollo", nombre_normalizado: "repollo", nombre_display: "Repollo", cantidad_base: 100, unidad: "g", unidad_compra: "unidades", factor_conversion: 1500, descripcion_compra: "unidad entera ~1.5kg" },
        { nombre: "zanahoria", nombre_normalizado: "zanahoria", nombre_display: "Zanahoria", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 7, descripcion_compra: "~7 unidades por kg" },
        { nombre: "cebollín", nombre_normalizado: "cebollin", nombre_display: "Cebollín", cantidad_base: 20, unidad: "g", unidad_compra: "manojos", factor_conversion: 30, descripcion_compra: "manojo" },
        { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 3, unidad: "dientes", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
        { nombre: "jengibre fresco", nombre_normalizado: "jengibre", nombre_display: "Jengibre", cantidad_base: 5, unidad: "g", unidad_compra: "unidades", factor_conversion: 100, descripcion_compra: "raíz ~100g" },
        { nombre: "salsa de soya", nombre_normalizado: "salsa_soya", nombre_display: "Salsa de soya", cantidad_base: 30, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
        { nombre: "aceite de sésamo", nombre_normalizado: "aceite_sesamo", nombre_display: "Aceite de sésamo", cantidad_base: 5, unidad: "ml", unidad_compra: "botellas", factor_conversion: 250, descripcion_compra: "botella de 250ml" },
        { nombre: "aceite vegetal", nombre_normalizado: "aceite_vegetal", nombre_display: "Aceite vegetal", cantidad_base: 15, unidad: "ml", unidad_compra: "botellas", factor_conversion: 1000, descripcion_compra: "botella de 1L" }
      ],
      instrucciones: [
        "Cortar la carne en tiras muy finas contra la fibra (más fácil si está semi-congelada 15 min).",
        "Marinar la carne con 15 ml de salsa de soya, 1 ajo rallado y el jengibre rallado 10 min.",
        "Cocinar los 100 g de fideos según paquete (generalmente 4 min). Escurrir y rociar con los 5 ml de aceite de sésamo para que no se peguen.",
        "Cortar el pimiento en tiras, el repollo en juliana, la zanahoria en palitos finos y los 2 ajos restantes laminados.",
        "Calentar wok o sartén grande a fuego máximo hasta humear. Añadir 10 ml de aceite vegetal.",
        "Saltear la carne 2 min removiendo constantemente (no sobrecargar, hacer en 2 tandas si es necesario). Reservar.",
        "En el mismo wok con 5 ml más de aceite, saltear ajo laminado 20 seg.",
        "Añadir zanahoria (2 min), pimiento (2 min), repollo (1 min). Las verduras deben quedar crujientes.",
        "Devolver la carne. Añadir los fideos cocidos y los 15 ml restantes de salsa de soya. Saltear todo 2 min.",
        "Espolvorear cebollín picado. Servir inmediatamente en bowls hondos."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "a27",
      nombre: "Ensalada tibia de quinoa y camarones",
      tipo_comida: "almuerzo",
      calorias_base: 520, proteinas_g: 36, carbohidratos_g: 54, grasas_g: 14,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        { nombre: "camarones pelados", nombre_normalizado: "camarones", nombre_display: "Camarones", cantidad_base: 150, unidad: "g", unidad_compra: "bolsas", factor_conversion: 500, descripcion_compra: "bolsa congelada de 500g" },
        { nombre: "quinoa", nombre_normalizado: "quinoa", nombre_display: "Quinoa", cantidad_base: 80, unidad: "g", unidad_compra: "paquetes", factor_conversion: 500, descripcion_compra: "paquete de 500g" },
        { nombre: "espinaca fresca", nombre_normalizado: "espinaca", nombre_display: "Espinaca", cantidad_base: 60, unidad: "g", unidad_compra: "bolsas", factor_conversion: 200, descripcion_compra: "bolsa de 200g" },
        { nombre: "palta (aguacate)", nombre_normalizado: "palta", nombre_display: "Palta", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
        { nombre: "tomate cherry", nombre_normalizado: "tomate_cherry", nombre_display: "Tomate cherry", cantidad_base: 80, unidad: "g", unidad_compra: "bandejas", factor_conversion: 250, descripcion_compra: "bandeja de 250g" },
        { nombre: "limón (jugo)", nombre_normalizado: "limon", nombre_display: "Limón", cantidad_base: 15, unidad: "ml", unidad_compra: "unidades", factor_conversion: 30, descripcion_compra: "unidad (~30ml jugo)" },
        { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 15, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
        { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 2, unidad: "dientes", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
        { nombre: "cilantro fresco", nombre_normalizado: "cilantro", nombre_display: "Cilantro", cantidad_base: 5, unidad: "g", unidad_compra: "manojos", factor_conversion: 50, descripcion_compra: "manojo" },
        { nombre: "chile en polvo", nombre_normalizado: "chile_polvo", nombre_display: "Chile en polvo", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" }
      ],
      instrucciones: [
        "Enjuagar los 80 g de quinoa 1 min. Cocinar con 160 ml de agua con sal: hervor + tapa + fuego bajo 15 min. Reposar 3 min.",
        "Descongelar los 150 g de camarones si aplica. Secar bien con papel absorbente (clave para dorar).",
        "Sazonar con sal, pimienta, chile en polvo y el jugo de medio limón (7 ml).",
        "Picar los 2 ajos finamente.",
        "Calentar 10 ml de aceite de oliva en sartén grande a fuego alto. Añadir el ajo, saltear 15 seg.",
        "Añadir los camarones sin superponer. Cocinar 2 min por lado. Los camarones están listos cuando forman 'C' y están rosados (no 'O', significaría sobrecocción).",
        "Lavar los 60 g de espinaca. Cortar los tomates cherry por la mitad. Cortar la palta en cubos.",
        "En un bowl grande: quinoa tibia, espinaca (se marchitará ligeramente con el calor), tomates cherry, palta y camarones.",
        "Aliñar con los 5 ml de aceite restante, los 8 ml de jugo de limón, sal y cilantro picado. Mezclar suavemente. Servir tibio."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "a28",
      nombre: "Pavo al romero con puré de camote",
      tipo_comida: "almuerzo",
      calorias_base: 550, proteinas_g: 40, carbohidratos_g: 52, grasas_g: 16,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        { nombre: "pechuga de pavo", nombre_normalizado: "pechuga_pavo", nombre_display: "Pechuga de pavo", cantidad_base: 180, unidad: "g", unidad_compra: "bandejas", factor_conversion: 500, descripcion_compra: "bandeja de 500g" },
        { nombre: "camote (batata)", nombre_normalizado: "camote", nombre_display: "Camote", cantidad_base: 300, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
        { nombre: "romero fresco", nombre_normalizado: "romero", nombre_display: "Romero", cantidad_base: 3, unidad: "g", unidad_compra: "manojos", factor_conversion: 30, descripcion_compra: "manojo" },
        { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 2, unidad: "dientes", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
        { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 15, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
        { nombre: "mantequilla", nombre_normalizado: "mantequilla", nombre_display: "Mantequilla", cantidad_base: 10, unidad: "g", unidad_compra: "barras", factor_conversion: 250, descripcion_compra: "barra de 250g" },
        { nombre: "caldo de pollo", nombre_normalizado: "caldo_pollo", nombre_display: "Caldo de pollo", cantidad_base: 100, unidad: "ml", unidad_compra: "cajas", factor_conversion: 1000, descripcion_compra: "caja de 1L" },
        { nombre: "limón (jugo)", nombre_normalizado: "limon", nombre_display: "Limón", cantidad_base: 10, unidad: "ml", unidad_compra: "unidades", factor_conversion: 30, descripcion_compra: "unidad (~30ml jugo)" },
        { nombre: "canela en polvo", nombre_normalizado: "canela", nombre_display: "Canela", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" }
      ],
      instrucciones: [
        "Pelar los 300 g de camote y cortar en cubos de 3 cm. Hervir en agua con sal 15 min hasta muy tierno.",
        "Escurrir y machacar con los 10 g de mantequilla, 1 g de canela, sal y pimienta. Reservar caliente.",
        "Cortar la pechuga de pavo en 2 filetes iguales de 1.5 cm de grosor.",
        "Picar el romero finamente (solo las hojas) y los 2 ajos. Mezclar con 10 ml de aceite de oliva, jugo de limón, sal y pimienta.",
        "Untar los filetes con la marinada y dejar 15 min a temperatura ambiente.",
        "Calentar sartén pesada a fuego alto con 5 ml de aceite. Sellar los filetes 3 min por lado sin mover.",
        "Bajar fuego a medio. Añadir los 100 ml de caldo de pollo y tapar. Cocinar 5 min más (termómetro interno debe marcar 74°C).",
        "Retirar el pavo y reposar 5 min tapado con papel aluminio (redistribuye jugos).",
        "Reducir el caldo restante 2 min a fuego alto hasta salsa.",
        "Cortar el pavo en bisel. Servir sobre el puré de camote, napar con la salsa reducida."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "a29",
      nombre: "Moussaka de berenjena y carne",
      tipo_comida: "almuerzo",
      calorias_base: 620, proteinas_g: 32, carbohidratos_g: 40, grasas_g: 36,
      es_sin_gluten: true, es_sin_lactosa: false, es_vegetariana: false,
      ingredientes: [
        { nombre: "berenjena", nombre_normalizado: "berenjena", nombre_display: "Berenjena", cantidad_base: 300, unidad: "g", unidad_compra: "unidades", factor_conversion: 300, descripcion_compra: "unidad (~300g)" },
        { nombre: "carne molida de cordero o res", nombre_normalizado: "carne_molida", nombre_display: "Carne molida", cantidad_base: 150, unidad: "g", unidad_compra: "bandejas", factor_conversion: 500, descripcion_compra: "bandeja de 500g" },
        { nombre: "tomate", nombre_normalizado: "tomate", nombre_display: "Tomate", cantidad_base: 2, unidad: "unidades", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
        { nombre: "cebolla", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
        { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 2, unidad: "dientes", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
        { nombre: "leche descremada", nombre_normalizado: "leche_descremada", nombre_display: "Leche descremada", cantidad_base: 200, unidad: "ml", unidad_compra: "cajas", factor_conversion: 1000, descripcion_compra: "caja de 1L" },
        { nombre: "harina integral", nombre_normalizado: "harina_integral", nombre_display: "Harina", cantidad_base: 15, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
        { nombre: "queso parmesano", nombre_normalizado: "queso_parmesano", nombre_display: "Queso parmesano", cantidad_base: 30, unidad: "g", unidad_compra: "paquetes", factor_conversion: 200, descripcion_compra: "paquete de 200g" },
        { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 25, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
        { nombre: "canela en polvo", nombre_normalizado: "canela", nombre_display: "Canela", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
        { nombre: "nuez moscada", nombre_normalizado: "nuez_moscada", nombre_display: "Nuez moscada", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 30, descripcion_compra: "frasco de 30g" }
      ],
      instrucciones: [
        "Precalentar horno a 180°C.",
        "Cortar la berenjena en rodajas de 1 cm. Salar y dejar 20 min (libera amargor). Secar con papel.",
        "Pincelar las rodajas con 15 ml de aceite de oliva y hornear 15 min por lado hasta doradas.",
        "Picar la media cebolla y los 2 ajos finos. Escaldar y pelar los 2 tomates, picar en cubos.",
        "En sartén, 10 ml de aceite a fuego medio. Sofreír cebolla y ajo 4 min. Añadir carne molida, cocinar 6 min rompiendo.",
        "Incorporar tomate, 1 g de canela, sal y pimienta. Cocinar 10 min hasta reducir a salsa espesa.",
        "Bechamel: derretir nada de mantequilla (aquí sustituimos por harina tostada), mezclar los 15 g de harina con 200 ml de leche fría. Calentar a fuego medio removiendo 5 min hasta espesar. Añadir 1 g de nuez moscada y sal.",
        "Montar en fuente: capa de berenjena, capa de carne, capa de berenjena, capa de carne, capa final de berenjena. Cubrir con bechamel.",
        "Espolvorear los 30 g de parmesano rallado. Hornear 30 min hasta dorar.",
        "Reposar 15 min antes de cortar (clave para porciones limpias)."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "a30",
      nombre: "Bowl de poke con salmón y arroz",
      tipo_comida: "almuerzo",
      calorias_base: 600, proteinas_g: 36, carbohidratos_g: 66, grasas_g: 18,
      es_sin_gluten: false, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        { nombre: "salmón fresco grado sashimi", nombre_normalizado: "salmon", nombre_display: "Salmón sashimi", cantidad_base: 150, unidad: "g", unidad_compra: "bandejas", factor_conversion: 500, descripcion_compra: "bandeja de 500g" },
        { nombre: "arroz basmati", nombre_normalizado: "arroz_basmati", nombre_display: "Arroz basmati", cantidad_base: 80, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
        { nombre: "palta (aguacate)", nombre_normalizado: "palta", nombre_display: "Palta", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
        { nombre: "pepino", nombre_normalizado: "pepino", nombre_display: "Pepino", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
        { nombre: "edamame", nombre_normalizado: "edamame", nombre_display: "Edamame", cantidad_base: 60, unidad: "g", unidad_compra: "bolsas", factor_conversion: 500, descripcion_compra: "bolsa congelada de 500g" },
        { nombre: "zanahoria", nombre_normalizado: "zanahoria", nombre_display: "Zanahoria", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 7, descripcion_compra: "~7 unidades por kg" },
        { nombre: "salsa de soya", nombre_normalizado: "salsa_soya", nombre_display: "Salsa de soya", cantidad_base: 20, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
        { nombre: "aceite de sésamo", nombre_normalizado: "aceite_sesamo", nombre_display: "Aceite de sésamo", cantidad_base: 5, unidad: "ml", unidad_compra: "botellas", factor_conversion: 250, descripcion_compra: "botella de 250ml" },
        { nombre: "jengibre fresco", nombre_normalizado: "jengibre", nombre_display: "Jengibre", cantidad_base: 3, unidad: "g", unidad_compra: "unidades", factor_conversion: 100, descripcion_compra: "raíz ~100g" },
        { nombre: "sésamo tostado", nombre_normalizado: "sesamo", nombre_display: "Sésamo tostado", cantidad_base: 5, unidad: "g", unidad_compra: "frascos", factor_conversion: 100, descripcion_compra: "frasco de 100g" }
      ],
      instrucciones: [
        "Cocinar los 80 g de arroz basmati: enjuagar, hervir con 160 ml de agua + sal, tapa, fuego bajo 12 min. Reposar 5 min. Dejar templar.",
        "Asegurar que el salmón sea grado sashimi (seguro para consumo crudo) y esté bien frío.",
        "Cortar el salmón en cubos de 1.5 cm con cuchillo muy afilado.",
        "En un bowl, mezclar el salmón con 20 ml de salsa de soya, 5 ml de aceite de sésamo y el jengibre rallado. Macerar 10 min en refrigerador.",
        "Hervir los 60 g de edamame 4 min en agua con sal. Escurrir y desvainar (opcional).",
        "Cortar la palta en cubos, el pepino en medias lunas finas, la zanahoria en palitos finos.",
        "Montar el bowl: arroz templado como base, sectores de salmón marinado, palta, pepino, zanahoria y edamame alrededor.",
        "Rociar con el aliño sobrante de la maceración del salmón. Espolvorear los 5 g de sésamo tostado. Servir inmediatamente."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "a31",
      nombre: "Pollo al limón con arroz con verduras",
      tipo_comida: "almuerzo",
      calorias_base: 580, proteinas_g: 42, carbohidratos_g: 60, grasas_g: 14,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        { nombre: "pechuga de pollo", nombre_normalizado: "pechuga_pollo", nombre_display: "Pechuga de pollo", cantidad_base: 180, unidad: "g", unidad_compra: "bandejas", factor_conversion: 500, descripcion_compra: "bandeja de 500g" },
        { nombre: "arroz blanco", nombre_normalizado: "arroz_blanco", nombre_display: "Arroz blanco", cantidad_base: 80, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
        { nombre: "zanahoria", nombre_normalizado: "zanahoria", nombre_display: "Zanahoria", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 7, descripcion_compra: "~7 unidades por kg" },
        { nombre: "arvejas", nombre_normalizado: "arveja", nombre_display: "Arvejas", cantidad_base: 60, unidad: "g", unidad_compra: "bolsas", factor_conversion: 500, descripcion_compra: "bolsa congelada de 500g" },
        { nombre: "choclo", nombre_normalizado: "choclo", nombre_display: "Choclo", cantidad_base: 60, unidad: "g", unidad_compra: "bolsas", factor_conversion: 500, descripcion_compra: "bolsa congelada de 500g" },
        { nombre: "limón (jugo)", nombre_normalizado: "limon", nombre_display: "Limón", cantidad_base: 30, unidad: "ml", unidad_compra: "unidades", factor_conversion: 30, descripcion_compra: "unidad (~30ml jugo)" },
        { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 2, unidad: "dientes", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
        { nombre: "cebolla", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
        { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 15, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
        { nombre: "caldo de pollo", nombre_normalizado: "caldo_pollo", nombre_display: "Caldo de pollo", cantidad_base: 200, unidad: "ml", unidad_compra: "cajas", factor_conversion: 1000, descripcion_compra: "caja de 1L" },
        { nombre: "tomillo fresco", nombre_normalizado: "tomillo", nombre_display: "Tomillo", cantidad_base: 2, unidad: "g", unidad_compra: "manojos", factor_conversion: 15, descripcion_compra: "paquete de 15g" }
      ],
      instrucciones: [
        "Cortar la pechuga en 2 filetes de 1.5 cm. Marinar con 20 ml de jugo de limón, los 2 ajos machacados, las hojas de tomillo, sal y pimienta durante 20 min.",
        "Picar la media cebolla finamente. Cortar la zanahoria en cubos pequeños.",
        "Calentar 10 ml de aceite en olla mediana a fuego medio. Sofreír cebolla 3 min, añadir zanahoria 3 min más.",
        "Añadir los 80 g de arroz (enjuagado) y saltear 1 min con las verduras (técnica pilaf).",
        "Incorporar los 200 ml de caldo de pollo hirviendo, los 60 g de arvejas y los 60 g de choclo. Salar.",
        "Llevar a hervor, tapar y cocer a fuego bajo 17 min. Reposar 5 min tapado.",
        "Mientras, calentar 5 ml de aceite en sartén a fuego alto. Sellar los filetes de pollo 4 min por lado sin mover.",
        "Añadir 10 ml de jugo de limón restante a la sartén, glasear el pollo 1 min. Reposar 3 min.",
        "Servir el arroz con verduras como base, el pollo cortado al bisel encima, napar con los jugos de la sartén."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "a32",
      nombre: "Fajitas de res con tortillas de maíz",
      tipo_comida: "almuerzo",
      calorias_base: 620, proteinas_g: 38, carbohidratos_g: 58, grasas_g: 22,
      es_sin_gluten: true, es_sin_lactosa: false, es_vegetariana: false,
      ingredientes: [
        { nombre: "carne de res (bife o flank)", nombre_normalizado: "carne_res", nombre_display: "Carne de res", cantidad_base: 160, unidad: "g", unidad_compra: "bandejas", factor_conversion: 500, descripcion_compra: "bandeja de 500g" },
        { nombre: "tortillas de maíz", nombre_normalizado: "tortilla_maiz", nombre_display: "Tortillas de maíz", cantidad_base: 3, unidad: "unidades", unidad_compra: "paquetes", factor_conversion: 12, descripcion_compra: "paquete de 12 unid." },
        { nombre: "pimiento rojo", nombre_normalizado: "pimiento", nombre_display: "Pimiento rojo", cantidad_base: 100, unidad: "g", unidad_compra: "unidades", factor_conversion: 200, descripcion_compra: "unidad (~200g)" },
        { nombre: "pimiento verde", nombre_normalizado: "pimiento", nombre_display: "Pimiento verde", cantidad_base: 100, unidad: "g", unidad_compra: "unidades", factor_conversion: 200, descripcion_compra: "unidad (~200g)" },
        { nombre: "cebolla", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
        { nombre: "palta (aguacate)", nombre_normalizado: "palta", nombre_display: "Palta", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
        { nombre: "crema agria", nombre_normalizado: "crema_agria", nombre_display: "Crema agria", cantidad_base: 30, unidad: "g", unidad_compra: "potes", factor_conversion: 200, descripcion_compra: "pote de 200g" },
        { nombre: "limón (jugo)", nombre_normalizado: "limon", nombre_display: "Limón", cantidad_base: 20, unidad: "ml", unidad_compra: "unidades", factor_conversion: 30, descripcion_compra: "unidad (~30ml jugo)" },
        { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 2, unidad: "dientes", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
        { nombre: "comino", nombre_normalizado: "comino", nombre_display: "Comino", cantidad_base: 2, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
        { nombre: "pimentón ahumado", nombre_normalizado: "pimenton", nombre_display: "Pimentón ahumado", cantidad_base: 2, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
        { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 15, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
        { nombre: "cilantro fresco", nombre_normalizado: "cilantro", nombre_display: "Cilantro", cantidad_base: 10, unidad: "g", unidad_compra: "manojos", factor_conversion: 50, descripcion_compra: "manojo" }
      ],
      instrucciones: [
        "Cortar la carne en tiras de 1 cm contra la fibra.",
        "Marinar la carne con 10 ml de jugo de limón, 2 ajos rallados, 2 g de comino, 2 g de pimentón ahumado, sal y pimienta. Dejar 30 min.",
        "Cortar los pimientos y la cebolla en tiras de 1 cm de ancho (corte fajita clásico).",
        "Preparar el guacamole: machacar la media palta con 10 ml de jugo de limón, sal, pimienta. Reservar.",
        "Calentar sartén de hierro o wok a fuego máximo hasta humear. Añadir 10 ml de aceite.",
        "Saltear la carne 2 min sin mover (sellado). Remover y saltear 1 min más. Retirar.",
        "En el mismo sartén, añadir 5 ml más de aceite. Saltear la cebolla 3 min, añadir pimientos, saltear 4 min manteniendo crujientes.",
        "Devolver la carne, mezclar 1 min todo junto. Espolvorear cilantro.",
        "Calentar las 3 tortillas en sartén seca 15 seg por lado o en comal caliente.",
        "Servir en tabla: sartén con fajitas humeantes, tortillas envueltas en paño, bowls con guacamole y crema agria. Armar en la mesa."
      ],
      instrucciones_thermomix: []
    }
  ];

  for (const r of ALMUERZOS_EXTRA) RECETAS_DB.push(r);

  // ═══════════════════════════════════════════
  // SNACKS PM (sp17-sp32)
  // ═══════════════════════════════════════════
  const SNACKS_PM_EXTRA = [
    {
      id: "sp17",
      nombre: "Huevos duros con sal de apio",
      tipo_comida: "snack_pm",
      calorias_base: 160, proteinas_g: 13, carbohidratos_g: 2, grasas_g: 11,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: true,
      ingredientes: [
        { nombre: "huevos", nombre_normalizado: "huevo", nombre_display: "Huevos", cantidad_base: 2, unidad: "unidades", unidad_compra: "docenas", factor_conversion: 12, descripcion_compra: "docena" },
        { nombre: "sal de apio", nombre_normalizado: "sal", nombre_display: "Sal de apio", cantidad_base: 2, unidad: "g", unidad_compra: "frascos", factor_conversion: 100, descripcion_compra: "frasco de 100g" },
        { nombre: "pimienta negra", nombre_normalizado: "pimienta", nombre_display: "Pimienta", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" }
      ],
      instrucciones: [
        "Colocar los 2 huevos en olla pequeña con agua fría. Añadir pizca de sal.",
        "Llevar a hervor a fuego alto. Desde que hierve, cocinar 9 min.",
        "Transferir a agua helada 3 min. Pelar.",
        "Cortar a la mitad longitudinalmente.",
        "Espolvorear la sal de apio y pimienta recién molida. Servir a temperatura ambiente."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "sp18",
      nombre: "Dip de yogur con pepino y palitos",
      tipo_comida: "snack_pm",
      calorias_base: 180, proteinas_g: 10, carbohidratos_g: 18, grasas_g: 7,
      es_sin_gluten: true, es_sin_lactosa: false, es_vegetariana: true,
      ingredientes: [
        { nombre: "yogur griego natural", nombre_normalizado: "yogur_griego", nombre_display: "Yogur griego", cantidad_base: 100, unidad: "g", unidad_compra: "potes", factor_conversion: 500, descripcion_compra: "pote de 500g" },
        { nombre: "pepino", nombre_normalizado: "pepino", nombre_display: "Pepino", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
        { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 0.5, unidad: "diente", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
        { nombre: "eneldo fresco", nombre_normalizado: "eneldo", nombre_display: "Eneldo", cantidad_base: 2, unidad: "g", unidad_compra: "manojos", factor_conversion: 30, descripcion_compra: "manojo" },
        { nombre: "zanahoria", nombre_normalizado: "zanahoria", nombre_display: "Zanahoria", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 7, descripcion_compra: "~7 unidades por kg" },
        { nombre: "apio", nombre_normalizado: "apio", nombre_display: "Apio", cantidad_base: 1, unidad: "tallo", unidad_compra: "manojos", factor_conversion: 10, descripcion_compra: "manojo de ~10 tallos" },
        { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 5, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" }
      ],
      instrucciones: [
        "Rallar el medio pepino. Escurrir en colador con sal 10 min y apretar para eliminar líquido.",
        "Picar el medio diente de ajo muy finamente y los 2 g de eneldo.",
        "Mezclar los 100 g de yogur griego con el pepino escurrido, ajo, eneldo, 5 ml de aceite de oliva, sal y pimienta.",
        "Cortar la zanahoria y el apio en bastones de 8 cm.",
        "Servir el dip en un bowl pequeño con los bastones alrededor."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "sp19",
      nombre: "Chocolate amargo con almendras",
      tipo_comida: "snack_pm",
      calorias_base: 210, proteinas_g: 5, carbohidratos_g: 16, grasas_g: 14,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: true,
      ingredientes: [
        { nombre: "chocolate amargo 70%", nombre_normalizado: "chocolate_amargo", nombre_display: "Chocolate 70%", cantidad_base: 25, unidad: "g", unidad_compra: "tabletas", factor_conversion: 100, descripcion_compra: "tableta de 100g" },
        { nombre: "almendras", nombre_normalizado: "almendras", nombre_display: "Almendras", cantidad_base: 20, unidad: "g", unidad_compra: "paquetes", factor_conversion: 200, descripcion_compra: "paquete de 200g" }
      ],
      instrucciones: [
        "Porcionar los 25 g de chocolate amargo (aproximadamente 3 cuadraditos).",
        "Contar 20 g de almendras (~15 unidades).",
        "Servir en un plato pequeño.",
        "Consumir lentamente para saciar el antojo dulce sin exceso de azúcar."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "sp20",
      nombre: "Sandía con menta y limón",
      tipo_comida: "snack_pm",
      calorias_base: 120, proteinas_g: 2, carbohidratos_g: 28, grasas_g: 0,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: true,
      ingredientes: [
        { nombre: "sandía", nombre_normalizado: "sandia", nombre_display: "Sandía", cantidad_base: 300, unidad: "g", unidad_compra: "unidades", factor_conversion: 4000, descripcion_compra: "unidad ~4kg" },
        { nombre: "menta fresca", nombre_normalizado: "menta", nombre_display: "Menta", cantidad_base: 3, unidad: "g", unidad_compra: "manojos", factor_conversion: 30, descripcion_compra: "manojo" },
        { nombre: "limón (jugo)", nombre_normalizado: "limon", nombre_display: "Limón", cantidad_base: 10, unidad: "ml", unidad_compra: "unidades", factor_conversion: 30, descripcion_compra: "unidad (~30ml jugo)" },
        { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 1, unidad: "g", unidad_compra: "paquetes", factor_conversion: 500, descripcion_compra: "paquete de 500g" }
      ],
      instrucciones: [
        "Cortar los 300 g de sandía en cubos de 3 cm, retirando semillas visibles.",
        "Picar las hojas de 3 g de menta fresca.",
        "En un bowl, mezclar los cubos con los 10 ml de jugo de limón y la menta picada.",
        "Espolvorear el 1 g de sal (realza la dulzura de la sandía, clásico chileno).",
        "Servir inmediatamente en copa alta o bowl refrigerado."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "sp21",
      nombre: "Queso cottage con tomate y albahaca",
      tipo_comida: "snack_pm",
      calorias_base: 170, proteinas_g: 16, carbohidratos_g: 10, grasas_g: 6,
      es_sin_gluten: true, es_sin_lactosa: false, es_vegetariana: true,
      ingredientes: [
        { nombre: "queso cottage", nombre_normalizado: "queso_cottage", nombre_display: "Queso cottage", cantidad_base: 150, unidad: "g", unidad_compra: "potes", factor_conversion: 400, descripcion_compra: "pote de 400g" },
        { nombre: "tomate cherry", nombre_normalizado: "tomate_cherry", nombre_display: "Tomate cherry", cantidad_base: 80, unidad: "g", unidad_compra: "bandejas", factor_conversion: 250, descripcion_compra: "bandeja de 250g" },
        { nombre: "albahaca fresca", nombre_normalizado: "albahaca", nombre_display: "Albahaca", cantidad_base: 3, unidad: "g", unidad_compra: "plantas", factor_conversion: 30, descripcion_compra: "planta ~30g" },
        { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 5, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
        { nombre: "pimienta negra", nombre_normalizado: "pimienta", nombre_display: "Pimienta", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" }
      ],
      instrucciones: [
        "Servir los 150 g de queso cottage en un bowl.",
        "Partir los 80 g de tomates cherry por la mitad.",
        "Colocar los tomates sobre el queso cottage.",
        "Picar groseramente las hojas de albahaca y espolvorear.",
        "Rociar con los 5 ml de aceite de oliva y pimienta recién molida. Una pizca de sal en escamas al final."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "sp22",
      nombre: "Pudín de chocolate y chía",
      tipo_comida: "snack_pm",
      calorias_base: 210, proteinas_g: 7, carbohidratos_g: 26, grasas_g: 10,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: true,
      ingredientes: [
        { nombre: "semillas de chía", nombre_normalizado: "chia", nombre_display: "Chía", cantidad_base: 20, unidad: "g", unidad_compra: "paquetes", factor_conversion: 200, descripcion_compra: "paquete de 200g" },
        { nombre: "leche de almendras", nombre_normalizado: "leche_almendras", nombre_display: "Leche de almendras", cantidad_base: 150, unidad: "ml", unidad_compra: "cajas", factor_conversion: 1000, descripcion_compra: "caja de 1L" },
        { nombre: "cacao en polvo sin azúcar", nombre_normalizado: "cacao", nombre_display: "Cacao", cantidad_base: 8, unidad: "g", unidad_compra: "paquetes", factor_conversion: 200, descripcion_compra: "paquete de 200g" },
        { nombre: "miel de abeja", nombre_normalizado: "miel", nombre_display: "Miel", cantidad_base: 10, unidad: "ml", unidad_compra: "frascos", factor_conversion: 500, descripcion_compra: "frasco de 500ml" },
        { nombre: "frutillas frescas", nombre_normalizado: "frutilla", nombre_display: "Frutillas", cantidad_base: 40, unidad: "g", unidad_compra: "bandejas", factor_conversion: 400, descripcion_compra: "bandeja de 400g" }
      ],
      instrucciones: [
        "En un frasco, mezclar los 20 g de chía con los 150 ml de leche de almendras, los 8 g de cacao en polvo y los 10 ml de miel.",
        "Remover vigorosamente con tenedor 30 segundos (evita grumos).",
        "Volver a mezclar a los 10 min. Tapar y refrigerar mínimo 4 horas (ideal: toda la noche).",
        "La chía absorbe el líquido y forma textura tipo pudín.",
        "Servir coronado con las 40 g de frutillas frescas en láminas."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "sp23",
      nombre: "Tostada con pasta de sardinas",
      tipo_comida: "snack_pm",
      calorias_base: 220, proteinas_g: 16, carbohidratos_g: 18, grasas_g: 10,
      es_sin_gluten: false, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        { nombre: "pan integral", nombre_normalizado: "pan_integral", nombre_display: "Pan integral", cantidad_base: 1, unidad: "rebanada", unidad_compra: "paquetes", factor_conversion: 12, descripcion_compra: "paquete de ~12 rebanadas" },
        { nombre: "sardinas en aceite", nombre_normalizado: "sardinas", nombre_display: "Sardinas", cantidad_base: 60, unidad: "g", unidad_compra: "latas", factor_conversion: 120, descripcion_compra: "lata de 120g" },
        { nombre: "limón (jugo)", nombre_normalizado: "limon", nombre_display: "Limón", cantidad_base: 5, unidad: "ml", unidad_compra: "unidades", factor_conversion: 30, descripcion_compra: "unidad (~30ml jugo)" },
        { nombre: "perejil fresco", nombre_normalizado: "perejil", nombre_display: "Perejil", cantidad_base: 2, unidad: "g", unidad_compra: "manojos", factor_conversion: 50, descripcion_compra: "manojo" },
        { nombre: "pimienta negra", nombre_normalizado: "pimienta", nombre_display: "Pimienta", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" }
      ],
      instrucciones: [
        "Escurrir los 60 g de sardinas (reservar una cucharadita del aceite para sabor).",
        "Machacar las sardinas con tenedor incluyendo espinas (son blandas y nutritivas). Agregar 5 ml de jugo de limón y el perejil picado.",
        "Tostar la rebanada de pan integral en tostadora hasta dorada.",
        "Untar la pasta de sardinas sobre la tostada formando capa generosa.",
        "Terminar con pimienta recién molida."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "sp24",
      nombre: "Fruta picada con yogur",
      tipo_comida: "snack_pm",
      calorias_base: 180, proteinas_g: 10, carbohidratos_g: 32, grasas_g: 2,
      es_sin_gluten: true, es_sin_lactosa: false, es_vegetariana: true,
      ingredientes: [
        { nombre: "manzana", nombre_normalizado: "manzana", nombre_display: "Manzana", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
        { nombre: "pera", nombre_normalizado: "pera", nombre_display: "Pera", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
        { nombre: "uvas", nombre_normalizado: "uva", nombre_display: "Uvas", cantidad_base: 60, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
        { nombre: "yogur natural descremado", nombre_normalizado: "yogur", nombre_display: "Yogur natural", cantidad_base: 100, unidad: "g", unidad_compra: "potes", factor_conversion: 500, descripcion_compra: "pote de 500g" },
        { nombre: "canela en polvo", nombre_normalizado: "canela", nombre_display: "Canela", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" }
      ],
      instrucciones: [
        "Lavar toda la fruta. Descorazonar y cortar la media manzana y media pera en cubos de 1 cm.",
        "Cortar las 60 g de uvas por la mitad.",
        "En un bowl, combinar las frutas.",
        "Servir los 100 g de yogur natural encima formando una nube blanca.",
        "Espolvorear el 1 g de canela. Consumir inmediatamente."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "sp25",
      nombre: "Mini pizzas de pan integral",
      tipo_comida: "snack_pm",
      calorias_base: 240, proteinas_g: 12, carbohidratos_g: 26, grasas_g: 10,
      es_sin_gluten: false, es_sin_lactosa: false, es_vegetariana: true,
      ingredientes: [
        { nombre: "pan integral", nombre_normalizado: "pan_integral", nombre_display: "Pan integral", cantidad_base: 2, unidad: "rebanadas", unidad_compra: "paquetes", factor_conversion: 12, descripcion_compra: "paquete de ~12 rebanadas" },
        { nombre: "salsa de tomate", nombre_normalizado: "salsa_tomate", nombre_display: "Salsa de tomate", cantidad_base: 30, unidad: "ml", unidad_compra: "frascos", factor_conversion: 500, descripcion_compra: "frasco de 500ml" },
        { nombre: "queso mozzarella rallado", nombre_normalizado: "queso_mozzarella", nombre_display: "Mozzarella", cantidad_base: 40, unidad: "g", unidad_compra: "paquetes", factor_conversion: 250, descripcion_compra: "paquete de 250g" },
        { nombre: "tomate", nombre_normalizado: "tomate", nombre_display: "Tomate", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
        { nombre: "orégano", nombre_normalizado: "oregano", nombre_display: "Orégano", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 30, descripcion_compra: "frasco de 30g" }
      ],
      instrucciones: [
        "Precalentar horno a 200°C o grill.",
        "Untar 15 ml de salsa de tomate sobre cada rebanada de pan integral.",
        "Espolvorear 20 g de mozzarella sobre cada una.",
        "Colocar rodajas finas del medio tomate encima.",
        "Espolvorear orégano. Hornear 5-7 min hasta que el queso burbujee y se dore.",
        "Cortar cada rebanada en 4 triángulos para servir como finger food."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "sp26",
      nombre: "Garbanzos crocantes especiados",
      tipo_comida: "snack_pm",
      calorias_base: 200, proteinas_g: 10, carbohidratos_g: 28, grasas_g: 6,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: true,
      ingredientes: [
        { nombre: "garbanzos cocidos", nombre_normalizado: "garbanzos", nombre_display: "Garbanzos", cantidad_base: 120, unidad: "g", unidad_compra: "latas", factor_conversion: 400, descripcion_compra: "lata de 400g" },
        { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 10, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
        { nombre: "pimentón ahumado", nombre_normalizado: "pimenton", nombre_display: "Pimentón ahumado", cantidad_base: 2, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
        { nombre: "comino", nombre_normalizado: "comino", nombre_display: "Comino", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
        { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 2, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
      ],
      instrucciones: [
        "Precalentar horno a 200°C.",
        "Escurrir bien los 120 g de garbanzos. Secarlos con paño de cocina frotando (es CLAVE: garbanzos secos = crocantes).",
        "En bowl, mezclar con 10 ml de aceite, 2 g de pimentón ahumado, 1 g de comino y 2 g de sal.",
        "Extender en bandeja con papel de hornear, sin superponer.",
        "Hornear 25-30 min removiendo a los 15 min. Deben quedar crujientes por fuera.",
        "Dejar enfriar 5 min (siguen endureciéndose). Consumir el mismo día para máxima textura."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "sp27",
      nombre: "Smoothie de frutos rojos",
      tipo_comida: "snack_pm",
      calorias_base: 170, proteinas_g: 8, carbohidratos_g: 28, grasas_g: 3,
      es_sin_gluten: true, es_sin_lactosa: false, es_vegetariana: true,
      ingredientes: [
        { nombre: "frutillas congeladas", nombre_normalizado: "frutilla", nombre_display: "Frutillas", cantidad_base: 100, unidad: "g", unidad_compra: "bolsas", factor_conversion: 500, descripcion_compra: "bolsa de 500g" },
        { nombre: "arándanos congelados", nombre_normalizado: "arandanos", nombre_display: "Arándanos", cantidad_base: 50, unidad: "g", unidad_compra: "bolsas", factor_conversion: 500, descripcion_compra: "bolsa de 500g" },
        { nombre: "yogur griego natural", nombre_normalizado: "yogur_griego", nombre_display: "Yogur griego", cantidad_base: 100, unidad: "g", unidad_compra: "potes", factor_conversion: 500, descripcion_compra: "pote de 500g" },
        { nombre: "leche descremada", nombre_normalizado: "leche_descremada", nombre_display: "Leche descremada", cantidad_base: 150, unidad: "ml", unidad_compra: "cajas", factor_conversion: 1000, descripcion_compra: "caja de 1L" },
        { nombre: "miel de abeja", nombre_normalizado: "miel", nombre_display: "Miel", cantidad_base: 5, unidad: "ml", unidad_compra: "frascos", factor_conversion: 500, descripcion_compra: "frasco de 500ml" }
      ],
      instrucciones: [
        "Colocar en licuadora: 100 g de frutillas y 50 g de arándanos congelados.",
        "Añadir 100 g de yogur griego, 150 ml de leche descremada y 5 ml de miel.",
        "Licuar 45 segundos a velocidad alta hasta cremoso.",
        "Servir en vaso alto inmediatamente."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "sp28",
      nombre: "Rollitos de pavo con queso",
      tipo_comida: "snack_pm",
      calorias_base: 180, proteinas_g: 22, carbohidratos_g: 4, grasas_g: 8,
      es_sin_gluten: true, es_sin_lactosa: false, es_vegetariana: false,
      ingredientes: [
        { nombre: "jamón de pavo", nombre_normalizado: "jamon_pavo", nombre_display: "Jamón de pavo", cantidad_base: 80, unidad: "g", unidad_compra: "paquetes", factor_conversion: 150, descripcion_compra: "paquete de 150g" },
        { nombre: "queso crema light", nombre_normalizado: "queso_crema", nombre_display: "Queso crema light", cantidad_base: 30, unidad: "g", unidad_compra: "potes", factor_conversion: 200, descripcion_compra: "pote de 200g" },
        { nombre: "pepino", nombre_normalizado: "pepino", nombre_display: "Pepino", cantidad_base: 0.25, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
        { nombre: "cebollín", nombre_normalizado: "cebollin", nombre_display: "Cebollín", cantidad_base: 3, unidad: "g", unidad_compra: "manojos", factor_conversion: 30, descripcion_compra: "manojo" }
      ],
      instrucciones: [
        "Extender las lonjas de 80 g de jamón de pavo sobre tabla.",
        "Untar una capa fina de los 30 g de queso crema light sobre cada lonja.",
        "Cortar el cuarto de pepino en bastones finos.",
        "Colocar 1-2 bastones de pepino en un extremo de cada lonja.",
        "Enrollar firmemente desde el extremo con pepino.",
        "Cortar cada rollo en 3 piezas. Espolvorear cebollín picado."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "sp29",
      nombre: "Palomitas caseras con especias",
      tipo_comida: "snack_pm",
      calorias_base: 170, proteinas_g: 4, carbohidratos_g: 28, grasas_g: 5,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: true,
      ingredientes: [
        { nombre: "maíz para palomitas", nombre_normalizado: "maiz_palomitas", nombre_display: "Maíz palomitas", cantidad_base: 30, unidad: "g", unidad_compra: "paquetes", factor_conversion: 500, descripcion_compra: "paquete de 500g" },
        { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 10, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
        { nombre: "pimentón ahumado", nombre_normalizado: "pimenton", nombre_display: "Pimentón", cantidad_base: 2, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
        { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 2, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
      ],
      instrucciones: [
        "Calentar una olla con tapa a fuego medio-alto. Añadir 10 ml de aceite de oliva.",
        "Cuando el aceite esté caliente, colocar 3 granos de maíz. Cuando revienten, añadir los 30 g restantes y tapar.",
        "Mover la olla sacudiéndola con el mango cada 15 seg hasta que dejen de reventar (2-3 min).",
        "Retirar del fuego inmediatamente para evitar quemado.",
        "Transferir a un bowl grande. Espolvorear 2 g de pimentón ahumado y 2 g de sal mientras están calientes.",
        "Mezclar bien agitando el bowl. Consumir inmediatamente mientras están crujientes."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "sp30",
      nombre: "Rollitos de lechuga con atún",
      tipo_comida: "snack_pm",
      calorias_base: 180, proteinas_g: 22, carbohidratos_g: 6, grasas_g: 8,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        { nombre: "lechuga mantecosa", nombre_normalizado: "lechuga", nombre_display: "Lechuga", cantidad_base: 4, unidad: "hojas", unidad_compra: "unidades", factor_conversion: 400, descripcion_compra: "unidad ~400g" },
        { nombre: "atún en agua", nombre_normalizado: "atun", nombre_display: "Atún", cantidad_base: 80, unidad: "g", unidad_compra: "latas", factor_conversion: 170, descripcion_compra: "lata de 170g" },
        { nombre: "palta (aguacate)", nombre_normalizado: "palta", nombre_display: "Palta", cantidad_base: 0.25, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
        { nombre: "zanahoria", nombre_normalizado: "zanahoria", nombre_display: "Zanahoria", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "kg", factor_conversion: 7, descripcion_compra: "~7 unidades por kg" },
        { nombre: "limón (jugo)", nombre_normalizado: "limon", nombre_display: "Limón", cantidad_base: 5, unidad: "ml", unidad_compra: "unidades", factor_conversion: 30, descripcion_compra: "unidad (~30ml jugo)" },
        { nombre: "mayonesa light", nombre_normalizado: "mayonesa", nombre_display: "Mayonesa light", cantidad_base: 5, unidad: "g", unidad_compra: "frascos", factor_conversion: 500, descripcion_compra: "frasco de 500g" }
      ],
      instrucciones: [
        "Lavar y secar 4 hojas enteras de lechuga mantecosa (deben quedar firmes pero flexibles).",
        "Escurrir 80 g de atún. Mezclar con los 5 g de mayonesa light y 5 ml de jugo de limón.",
        "Machacar el cuarto de palta.",
        "Rallar la media zanahoria.",
        "Sobre cada hoja de lechuga colocar: 1 cucharada de atún, un poco de palta machacada y zanahoria rallada.",
        "Enrollar como si fuera un burrito, doblando los extremos. Consumir inmediatamente."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "sp31",
      nombre: "Pera asada con nueces y canela",
      tipo_comida: "snack_pm",
      calorias_base: 180, proteinas_g: 3, carbohidratos_g: 30, grasas_g: 7,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: true,
      ingredientes: [
        { nombre: "pera", nombre_normalizado: "pera", nombre_display: "Pera", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
        { nombre: "nueces", nombre_normalizado: "nueces", nombre_display: "Nueces", cantidad_base: 10, unidad: "g", unidad_compra: "paquetes", factor_conversion: 200, descripcion_compra: "paquete de 200g" },
        { nombre: "canela en polvo", nombre_normalizado: "canela", nombre_display: "Canela", cantidad_base: 2, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
        { nombre: "miel de abeja", nombre_normalizado: "miel", nombre_display: "Miel", cantidad_base: 10, unidad: "ml", unidad_compra: "frascos", factor_conversion: 500, descripcion_compra: "frasco de 500ml" }
      ],
      instrucciones: [
        "Precalentar horno a 180°C.",
        "Lavar la pera. Cortarla por la mitad longitudinalmente y retirar el corazón con cucharita (formando un cuenco natural).",
        "Colocar en fuente. Espolvorear 2 g de canela sobre la fruta.",
        "Rociar 10 ml de miel en cada mitad.",
        "Picar las 10 g de nueces y distribuir dentro del hueco.",
        "Hornear 20 min hasta que la pera esté tierna y las nueces tostadas.",
        "Servir tibia o fría."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "sp32",
      nombre: "Tortilla de claras con espinaca",
      tipo_comida: "snack_pm",
      calorias_base: 170, proteinas_g: 22, carbohidratos_g: 8, grasas_g: 6,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: true,
      ingredientes: [
        { nombre: "huevos", nombre_normalizado: "huevo", nombre_display: "Huevos", cantidad_base: 4, unidad: "unidades", unidad_compra: "docenas", factor_conversion: 12, descripcion_compra: "docena" },
        { nombre: "huevos", nombre_normalizado: "huevo", nombre_display: "Huevos", cantidad_base: 1, unidad: "unidad", unidad_compra: "docenas", factor_conversion: 12, descripcion_compra: "docena" },
        { nombre: "espinaca fresca", nombre_normalizado: "espinaca", nombre_display: "Espinaca", cantidad_base: 50, unidad: "g", unidad_compra: "bolsas", factor_conversion: 200, descripcion_compra: "bolsa de 200g" },
        { nombre: "queso fresco", nombre_normalizado: "queso_fresco", nombre_display: "Queso fresco", cantidad_base: 20, unidad: "g", unidad_compra: "paquetes", factor_conversion: 250, descripcion_compra: "paquete de 250g" },
        { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 5, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
        { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 2, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
      ],
      instrucciones: [
        "Batir los 5 huevos (4 separando solo las claras + 1 entero) con sal y pimienta. Consejo: usar 4 claras en lugar de huevos enteros reduce 250 kcal sin perder proteína.",
        "Lavar y trocear las 50 g de espinaca.",
        "Calentar los 5 ml de aceite de oliva en sartén antiadherente de 20 cm a fuego medio.",
        "Saltear la espinaca 1 min hasta marchitar. Distribuir por la sartén.",
        "Verter la mezcla de huevos sobre la espinaca. Cocinar 3 min sin mover.",
        "Desmenuzar los 20 g de queso fresco encima. Cuando los bordes estén cuajados, doblar en media luna.",
        "Cocinar 1 min más. Servir inmediatamente."
      ],
      instrucciones_thermomix: []
    }
  ];

  for (const r of SNACKS_PM_EXTRA) RECETAS_DB.push(r);

  // ═══════════════════════════════════════════
  // CENAS (c17-c32)
  // Instrucciones Thermomix generadas automáticamente
  // ═══════════════════════════════════════════
  const CENAS_EXTRA = [
    {
      id: "c17",
      nombre: "Sopa de zapallo con jengibre",
      tipo_comida: "cena",
      calorias_base: 380, proteinas_g: 10, carbohidratos_g: 44, grasas_g: 16,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: true,
      ingredientes: [
        { nombre: "zapallo", nombre_normalizado: "zapallo", nombre_display: "Zapallo", cantidad_base: 400, unidad: "g", unidad_compra: "unidades", factor_conversion: 2000, descripcion_compra: "unidad ~2kg" },
        { nombre: "cebolla", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
        { nombre: "jengibre fresco", nombre_normalizado: "jengibre", nombre_display: "Jengibre", cantidad_base: 10, unidad: "g", unidad_compra: "unidades", factor_conversion: 100, descripcion_compra: "raíz ~100g" },
        { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 2, unidad: "dientes", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
        { nombre: "leche de coco", nombre_normalizado: "leche_coco", nombre_display: "Leche de coco", cantidad_base: 100, unidad: "ml", unidad_compra: "latas", factor_conversion: 400, descripcion_compra: "lata de 400ml" },
        { nombre: "caldo de verduras", nombre_normalizado: "caldo_verduras", nombre_display: "Caldo de verduras", cantidad_base: 400, unidad: "ml", unidad_compra: "cajas", factor_conversion: 1000, descripcion_compra: "caja de 1L" },
        { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 15, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
        { nombre: "cilantro fresco", nombre_normalizado: "cilantro", nombre_display: "Cilantro", cantidad_base: 5, unidad: "g", unidad_compra: "manojos", factor_conversion: 50, descripcion_compra: "manojo" },
        { nombre: "semillas de calabaza", nombre_normalizado: "semillas_calabaza", nombre_display: "Semillas calabaza", cantidad_base: 10, unidad: "g", unidad_compra: "paquetes", factor_conversion: 200, descripcion_compra: "paquete de 200g" }
      ],
      instrucciones: [
        "Pelar los 400 g de zapallo y cortar en cubos de 3 cm. Picar la cebolla, los 2 ajos y el jengibre finos.",
        "Calentar 15 ml de aceite de oliva en olla grande. Sofreír cebolla 4 min, añadir ajo y jengibre 1 min.",
        "Incorporar el zapallo y saltear 3 min.",
        "Verter 400 ml de caldo de verduras hirviendo. Tapar y cocinar 20 min hasta que el zapallo esté muy tierno.",
        "Retirar del fuego. Añadir 100 ml de leche de coco. Licuar con licuadora de inmersión hasta cremoso.",
        "Rectificar sal y pimienta. Recalentar suavemente si enfrió (no hervir la leche de coco, se puede cortar).",
        "Tostar las 10 g de semillas de calabaza en sartén seca 2 min removiendo.",
        "Servir en bowls hondos. Coronar con semillas tostadas, cilantro picado y un hilo de aceite de oliva crudo."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "c18",
      nombre: "Salmón al horno con espárragos",
      tipo_comida: "cena",
      calorias_base: 460, proteinas_g: 38, carbohidratos_g: 18, grasas_g: 26,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        { nombre: "salmón fresco", nombre_normalizado: "salmon", nombre_display: "Salmón", cantidad_base: 180, unidad: "g", unidad_compra: "bandejas", factor_conversion: 500, descripcion_compra: "bandeja de 500g" },
        { nombre: "espárragos verdes", nombre_normalizado: "esparrago", nombre_display: "Espárragos", cantidad_base: 200, unidad: "g", unidad_compra: "manojos", factor_conversion: 500, descripcion_compra: "manojo de 500g" },
        { nombre: "limón (jugo)", nombre_normalizado: "limon", nombre_display: "Limón", cantidad_base: 15, unidad: "ml", unidad_compra: "unidades", factor_conversion: 30, descripcion_compra: "unidad (~30ml jugo)" },
        { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 2, unidad: "dientes", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
        { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 15, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
        { nombre: "eneldo fresco", nombre_normalizado: "eneldo", nombre_display: "Eneldo", cantidad_base: 3, unidad: "g", unidad_compra: "manojos", factor_conversion: 30, descripcion_compra: "manojo" },
        { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 3, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
      ],
      instrucciones: [
        "Precalentar horno a 200°C.",
        "Secar los 180 g de salmón con papel absorbente. Salpimentar ambos lados.",
        "Cortar el extremo leñoso de los espárragos (2 cm). Pelar la base si son gruesos.",
        "Laminar los 2 ajos.",
        "En fuente grande, colocar espárragos. Rociar con 10 ml de aceite, sal y ajo laminado. Mezclar.",
        "Hacer espacio al centro y colocar el salmón con piel hacia abajo.",
        "Rociar el salmón con 5 ml de aceite, 15 ml de jugo de limón y el eneldo picado.",
        "Hornear 12-15 min (depende del grosor del salmón). La carne debe desprenderse en lascas.",
        "Servir inmediatamente con los jugos de la fuente por encima."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "c19",
      nombre: "Crema de champiñones con tostadas",
      tipo_comida: "cena",
      calorias_base: 380, proteinas_g: 12, carbohidratos_g: 42, grasas_g: 18,
      es_sin_gluten: false, es_sin_lactosa: false, es_vegetariana: true,
      ingredientes: [
        { nombre: "champiñones", nombre_normalizado: "champinones", nombre_display: "Champiñones", cantidad_base: 300, unidad: "g", unidad_compra: "bandejas", factor_conversion: 250, descripcion_compra: "bandeja de 250g" },
        { nombre: "cebolla", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
        { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 2, unidad: "dientes", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
        { nombre: "caldo de verduras", nombre_normalizado: "caldo_verduras", nombre_display: "Caldo de verduras", cantidad_base: 400, unidad: "ml", unidad_compra: "cajas", factor_conversion: 1000, descripcion_compra: "caja de 1L" },
        { nombre: "crema de leche", nombre_normalizado: "crema", nombre_display: "Crema de leche", cantidad_base: 60, unidad: "ml", unidad_compra: "potes", factor_conversion: 250, descripcion_compra: "pote de 250ml" },
        { nombre: "pan integral", nombre_normalizado: "pan_integral", nombre_display: "Pan integral", cantidad_base: 2, unidad: "rebanadas", unidad_compra: "paquetes", factor_conversion: 12, descripcion_compra: "paquete de ~12 rebanadas" },
        { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 15, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
        { nombre: "tomillo fresco", nombre_normalizado: "tomillo", nombre_display: "Tomillo", cantidad_base: 2, unidad: "g", unidad_compra: "manojos", factor_conversion: 15, descripcion_compra: "paquete de 15g" },
        { nombre: "perejil fresco", nombre_normalizado: "perejil", nombre_display: "Perejil", cantidad_base: 5, unidad: "g", unidad_compra: "manojos", factor_conversion: 50, descripcion_compra: "manojo" }
      ],
      instrucciones: [
        "Limpiar los 300 g de champiñones con papel húmedo (nunca sumergir). Cortar 200 g en láminas y 100 g en cuartos.",
        "Picar la cebolla y 2 ajos finos.",
        "Calentar 10 ml de aceite en olla. Sofreír cebolla 5 min, añadir ajo 1 min.",
        "Incorporar los champiñones en láminas y el tomillo. Saltear 8 min hasta que suelten agua y se evapore.",
        "Verter 400 ml de caldo. Cocinar 10 min a fuego medio.",
        "Licuar con licuadora de inmersión hasta cremoso. Añadir 60 ml de crema. Rectificar sal y pimienta.",
        "En sartén con 5 ml de aceite, saltear los champiñones en cuartos 4 min hasta dorados (guarnición crujiente).",
        "Tostar las 2 rebanadas de pan integral, frotar con ajo crudo.",
        "Servir la crema en bowls. Coronar con champiñones salteados y perejil. Acompañar con las tostadas."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "c20",
      nombre: "Ensalada tibia de pollo y palta",
      tipo_comida: "cena",
      calorias_base: 480, proteinas_g: 36, carbohidratos_g: 18, grasas_g: 30,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        { nombre: "pechuga de pollo", nombre_normalizado: "pechuga_pollo", nombre_display: "Pechuga de pollo", cantidad_base: 150, unidad: "g", unidad_compra: "bandejas", factor_conversion: 500, descripcion_compra: "bandeja de 500g" },
        { nombre: "mix de lechugas", nombre_normalizado: "lechuga", nombre_display: "Mix de lechugas", cantidad_base: 80, unidad: "g", unidad_compra: "bolsas", factor_conversion: 200, descripcion_compra: "bolsa de 200g" },
        { nombre: "palta (aguacate)", nombre_normalizado: "palta", nombre_display: "Palta", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
        { nombre: "tomate cherry", nombre_normalizado: "tomate_cherry", nombre_display: "Tomate cherry", cantidad_base: 100, unidad: "g", unidad_compra: "bandejas", factor_conversion: 250, descripcion_compra: "bandeja de 250g" },
        { nombre: "queso de cabra", nombre_normalizado: "queso", nombre_display: "Queso de cabra", cantidad_base: 30, unidad: "g", unidad_compra: "paquetes", factor_conversion: 150, descripcion_compra: "paquete de 150g" },
        { nombre: "nueces", nombre_normalizado: "nueces", nombre_display: "Nueces", cantidad_base: 15, unidad: "g", unidad_compra: "paquetes", factor_conversion: 200, descripcion_compra: "paquete de 200g" },
        { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 15, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
        { nombre: "limón (jugo)", nombre_normalizado: "limon", nombre_display: "Limón", cantidad_base: 15, unidad: "ml", unidad_compra: "unidades", factor_conversion: 30, descripcion_compra: "unidad (~30ml jugo)" },
        { nombre: "mostaza dijon", nombre_normalizado: "mostaza", nombre_display: "Mostaza dijon", cantidad_base: 5, unidad: "g", unidad_compra: "frascos", factor_conversion: 200, descripcion_compra: "frasco de 200g" },
        { nombre: "miel de abeja", nombre_normalizado: "miel", nombre_display: "Miel", cantidad_base: 5, unidad: "ml", unidad_compra: "frascos", factor_conversion: 500, descripcion_compra: "frasco de 500ml" }
      ],
      instrucciones: [
        "Cortar la pechuga en 2 filetes de 1.5 cm. Salpimentar y rociar 5 ml de aceite de oliva.",
        "Calentar sartén o plancha a fuego alto. Sellar los filetes 4 min por lado. Reposar 3 min tapados.",
        "Mientras, lavar y centrifugar los 80 g de lechugas. Partir los 100 g de tomates cherry por la mitad.",
        "Cortar la media palta en láminas finas.",
        "Preparar la vinagreta: mezclar 10 ml de aceite, 15 ml de jugo de limón, 5 g de mostaza dijon, 5 ml de miel, sal y pimienta.",
        "Cortar el pollo en tiras.",
        "Montar: lechugas en la base, tomates, palta, pollo tibio, queso de cabra desmenuzado y nueces picadas.",
        "Aliñar con la vinagreta justo antes de servir."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "c21",
      nombre: "Pescado al vapor con verduras asiáticas",
      tipo_comida: "cena",
      calorias_base: 400, proteinas_g: 34, carbohidratos_g: 22, grasas_g: 16,
      es_sin_gluten: false, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        { nombre: "pescado blanco (merluza o reineta)", nombre_normalizado: "pescado_blanco", nombre_display: "Pescado blanco", cantidad_base: 180, unidad: "g", unidad_compra: "bandejas", factor_conversion: 500, descripcion_compra: "bandeja de 500g" },
        { nombre: "bok choy", nombre_normalizado: "bok_choy", nombre_display: "Bok choy", cantidad_base: 120, unidad: "g", unidad_compra: "unidades", factor_conversion: 200, descripcion_compra: "unidad (~200g)" },
        { nombre: "champiñones shiitake", nombre_normalizado: "champinones", nombre_display: "Shiitake", cantidad_base: 80, unidad: "g", unidad_compra: "bandejas", factor_conversion: 200, descripcion_compra: "bandeja de 200g" },
        { nombre: "jengibre fresco", nombre_normalizado: "jengibre", nombre_display: "Jengibre", cantidad_base: 10, unidad: "g", unidad_compra: "unidades", factor_conversion: 100, descripcion_compra: "raíz ~100g" },
        { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 2, unidad: "dientes", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
        { nombre: "salsa de soya", nombre_normalizado: "salsa_soya", nombre_display: "Salsa de soya", cantidad_base: 20, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
        { nombre: "aceite de sésamo", nombre_normalizado: "aceite_sesamo", nombre_display: "Aceite de sésamo", cantidad_base: 10, unidad: "ml", unidad_compra: "botellas", factor_conversion: 250, descripcion_compra: "botella de 250ml" },
        { nombre: "cebollín", nombre_normalizado: "cebollin", nombre_display: "Cebollín", cantidad_base: 10, unidad: "g", unidad_compra: "manojos", factor_conversion: 30, descripcion_compra: "manojo" },
        { nombre: "arroz basmati", nombre_normalizado: "arroz_basmati", nombre_display: "Arroz basmati", cantidad_base: 60, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
      ],
      instrucciones: [
        "Enjuagar el arroz basmati hasta que el agua salga clara. Cocinar con 120 ml de agua + sal: hervor + tapa + fuego bajo 12 min. Reposar 5 min.",
        "Cortar el bok choy por la mitad longitudinalmente. Laminar los shiitake.",
        "Rallar los 10 g de jengibre y los 2 ajos.",
        "Preparar salsa: mezclar 20 ml de salsa de soya, 5 ml de aceite de sésamo, jengibre y ajo rallados.",
        "Colocar el pescado en plato apto para vapor. Rociar la mitad de la salsa.",
        "Distribuir el bok choy y los shiitake alrededor.",
        "Llevar a hervor agua en olla con vaporera. Colocar el plato en la vaporera, tapar.",
        "Cocinar al vapor 10-12 min hasta que el pescado se desprenda en lascas.",
        "Rociar el resto de la salsa y 5 ml de aceite de sésamo. Espolvorear cebollín picado.",
        "Servir sobre el arroz basmati con todos los jugos."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "c22",
      nombre: "Frittata de vegetales y queso",
      tipo_comida: "cena",
      calorias_base: 440, proteinas_g: 28, carbohidratos_g: 18, grasas_g: 28,
      es_sin_gluten: true, es_sin_lactosa: false, es_vegetariana: true,
      ingredientes: [
        { nombre: "huevos", nombre_normalizado: "huevo", nombre_display: "Huevos", cantidad_base: 4, unidad: "unidades", unidad_compra: "docenas", factor_conversion: 12, descripcion_compra: "docena" },
        { nombre: "zapallo italiano (calabacín)", nombre_normalizado: "calabacin", nombre_display: "Calabacín", cantidad_base: 100, unidad: "g", unidad_compra: "unidades", factor_conversion: 300, descripcion_compra: "unidad (~300g)" },
        { nombre: "pimiento rojo", nombre_normalizado: "pimiento", nombre_display: "Pimiento rojo", cantidad_base: 100, unidad: "g", unidad_compra: "unidades", factor_conversion: 200, descripcion_compra: "unidad (~200g)" },
        { nombre: "cebolla", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
        { nombre: "espinaca fresca", nombre_normalizado: "espinaca", nombre_display: "Espinaca", cantidad_base: 60, unidad: "g", unidad_compra: "bolsas", factor_conversion: 200, descripcion_compra: "bolsa de 200g" },
        { nombre: "queso parmesano", nombre_normalizado: "queso_parmesano", nombre_display: "Queso parmesano", cantidad_base: 30, unidad: "g", unidad_compra: "paquetes", factor_conversion: 200, descripcion_compra: "paquete de 200g" },
        { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 15, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
        { nombre: "albahaca fresca", nombre_normalizado: "albahaca", nombre_display: "Albahaca", cantidad_base: 5, unidad: "g", unidad_compra: "plantas", factor_conversion: 30, descripcion_compra: "planta ~30g" }
      ],
      instrucciones: [
        "Precalentar horno a 180°C.",
        "Cortar el calabacín en rodajas, el pimiento en tiras y la media cebolla en pluma.",
        "Calentar los 15 ml de aceite en sartén apta para horno (mango de metal) a fuego medio.",
        "Sofreír cebolla 3 min, añadir pimiento 3 min más, luego calabacín 3 min.",
        "Incorporar la espinaca, saltear hasta marchitar (1 min). Salpimentar.",
        "Batir los 4 huevos con sal, pimienta y la mitad del parmesano rallado.",
        "Verter los huevos sobre las verduras en la sartén. Cocinar sin mover 3 min a fuego medio-bajo hasta que los bordes cuajen.",
        "Espolvorear el resto del parmesano. Transferir al horno 10 min hasta que el centro esté firme.",
        "Sacar y reposar 3 min. Espolvorear albahaca fresca picada. Cortar en cuñas para servir."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "c23",
      nombre: "Curry tailandés de camarones",
      tipo_comida: "cena",
      calorias_base: 460, proteinas_g: 28, carbohidratos_g: 42, grasas_g: 20,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        { nombre: "camarones pelados", nombre_normalizado: "camarones", nombre_display: "Camarones", cantidad_base: 150, unidad: "g", unidad_compra: "bolsas", factor_conversion: 500, descripcion_compra: "bolsa congelada de 500g" },
        { nombre: "leche de coco", nombre_normalizado: "leche_coco", nombre_display: "Leche de coco", cantidad_base: 200, unidad: "ml", unidad_compra: "latas", factor_conversion: 400, descripcion_compra: "lata de 400ml" },
        { nombre: "arroz jazmín", nombre_normalizado: "arroz_blanco", nombre_display: "Arroz jazmín", cantidad_base: 60, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" },
        { nombre: "pasta de curry rojo tailandés", nombre_normalizado: "pasta_curry", nombre_display: "Pasta curry rojo", cantidad_base: 20, unidad: "g", unidad_compra: "frascos", factor_conversion: 200, descripcion_compra: "frasco de 200g" },
        { nombre: "pimiento rojo", nombre_normalizado: "pimiento", nombre_display: "Pimiento rojo", cantidad_base: 80, unidad: "g", unidad_compra: "unidades", factor_conversion: 200, descripcion_compra: "unidad (~200g)" },
        { nombre: "arvejas", nombre_normalizado: "arveja", nombre_display: "Arvejas", cantidad_base: 60, unidad: "g", unidad_compra: "bolsas", factor_conversion: 500, descripcion_compra: "bolsa congelada de 500g" },
        { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 2, unidad: "dientes", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
        { nombre: "jengibre fresco", nombre_normalizado: "jengibre", nombre_display: "Jengibre", cantidad_base: 5, unidad: "g", unidad_compra: "unidades", factor_conversion: 100, descripcion_compra: "raíz ~100g" },
        { nombre: "aceite vegetal", nombre_normalizado: "aceite_vegetal", nombre_display: "Aceite vegetal", cantidad_base: 10, unidad: "ml", unidad_compra: "botellas", factor_conversion: 1000, descripcion_compra: "botella de 1L" },
        { nombre: "limón (jugo)", nombre_normalizado: "limon", nombre_display: "Limón", cantidad_base: 10, unidad: "ml", unidad_compra: "unidades", factor_conversion: 30, descripcion_compra: "unidad (~30ml jugo)" },
        { nombre: "cilantro fresco", nombre_normalizado: "cilantro", nombre_display: "Cilantro", cantidad_base: 5, unidad: "g", unidad_compra: "manojos", factor_conversion: 50, descripcion_compra: "manojo" }
      ],
      instrucciones: [
        "Cocinar el arroz jazmín: enjuagar, hervir con 120 ml de agua + sal, tapa, fuego bajo 12 min. Reposar 5 min.",
        "Secar los 150 g de camarones. Sazonar con sal y pimienta.",
        "Cortar el pimiento en tiras finas. Picar 2 ajos y rallar el jengibre.",
        "Calentar 10 ml de aceite vegetal en sartén grande o wok a fuego medio. Tostar 20 g de pasta de curry rojo 1 min (libera aromas).",
        "Añadir ajo y jengibre, saltear 30 seg.",
        "Verter 200 ml de leche de coco. Llevar a hervor suave. Cocinar 3 min.",
        "Añadir pimiento y arvejas, cocinar 4 min.",
        "Incorporar los camarones. Cocinar 3-4 min (los camarones están listos al formar 'C' y ponerse rosados).",
        "Fuera del fuego, añadir 10 ml de jugo de limón.",
        "Servir sobre el arroz jazmín. Coronar con cilantro fresco picado."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "c24",
      nombre: "Pollo al curry de coco con coliflor",
      tipo_comida: "cena",
      calorias_base: 490, proteinas_g: 36, carbohidratos_g: 26, grasas_g: 24,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        { nombre: "pechuga de pollo", nombre_normalizado: "pechuga_pollo", nombre_display: "Pechuga de pollo", cantidad_base: 160, unidad: "g", unidad_compra: "bandejas", factor_conversion: 500, descripcion_compra: "bandeja de 500g" },
        { nombre: "coliflor", nombre_normalizado: "coliflor", nombre_display: "Coliflor", cantidad_base: 200, unidad: "g", unidad_compra: "unidades", factor_conversion: 800, descripcion_compra: "unidad ~800g" },
        { nombre: "leche de coco", nombre_normalizado: "leche_coco", nombre_display: "Leche de coco", cantidad_base: 200, unidad: "ml", unidad_compra: "latas", factor_conversion: 400, descripcion_compra: "lata de 400ml" },
        { nombre: "cebolla", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
        { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 3, unidad: "dientes", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
        { nombre: "jengibre fresco", nombre_normalizado: "jengibre", nombre_display: "Jengibre", cantidad_base: 10, unidad: "g", unidad_compra: "unidades", factor_conversion: 100, descripcion_compra: "raíz ~100g" },
        { nombre: "curry en polvo", nombre_normalizado: "curry", nombre_display: "Curry", cantidad_base: 5, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
        { nombre: "aceite de coco", nombre_normalizado: "aceite_coco", nombre_display: "Aceite de coco", cantidad_base: 15, unidad: "g", unidad_compra: "frascos", factor_conversion: 400, descripcion_compra: "frasco de 400g" },
        { nombre: "tomate", nombre_normalizado: "tomate", nombre_display: "Tomate", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
        { nombre: "cilantro fresco", nombre_normalizado: "cilantro", nombre_display: "Cilantro", cantidad_base: 10, unidad: "g", unidad_compra: "manojos", factor_conversion: 50, descripcion_compra: "manojo" }
      ],
      instrucciones: [
        "Cortar el pollo en cubos de 2.5 cm. Salpimentar.",
        "Separar los 200 g de coliflor en ramilletes pequeños.",
        "Picar la cebolla, 3 ajos y el jengibre finos. Picar el tomate.",
        "Derretir 15 g de aceite de coco en sartén grande a fuego medio. Sofreír cebolla 5 min.",
        "Añadir ajo, jengibre y 5 g de curry. Tostar 1 min.",
        "Incorporar el pollo y sellar 4 min hasta dorado.",
        "Agregar tomate, cocinar 3 min. Verter 200 ml de leche de coco y llevar a hervor suave.",
        "Añadir la coliflor. Tapar y cocinar 15 min a fuego bajo hasta que la coliflor esté tierna y el pollo cocido (74°C interno).",
        "Rectificar sal. Espolvorear cilantro fresco al servir.",
        "Acompañar con arroz si se desea (no incluido en los macros base)."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "c25",
      nombre: "Berenjenas gratinadas con tomate",
      tipo_comida: "cena",
      calorias_base: 380, proteinas_g: 18, carbohidratos_g: 28, grasas_g: 22,
      es_sin_gluten: true, es_sin_lactosa: false, es_vegetariana: true,
      ingredientes: [
        { nombre: "berenjena", nombre_normalizado: "berenjena", nombre_display: "Berenjena", cantidad_base: 350, unidad: "g", unidad_compra: "unidades", factor_conversion: 300, descripcion_compra: "unidad (~300g)" },
        { nombre: "salsa de tomate", nombre_normalizado: "salsa_tomate", nombre_display: "Salsa de tomate", cantidad_base: 200, unidad: "ml", unidad_compra: "frascos", factor_conversion: 500, descripcion_compra: "frasco de 500ml" },
        { nombre: "queso mozzarella rallado", nombre_normalizado: "queso_mozzarella", nombre_display: "Mozzarella", cantidad_base: 60, unidad: "g", unidad_compra: "paquetes", factor_conversion: 250, descripcion_compra: "paquete de 250g" },
        { nombre: "queso parmesano", nombre_normalizado: "queso_parmesano", nombre_display: "Queso parmesano", cantidad_base: 20, unidad: "g", unidad_compra: "paquetes", factor_conversion: 200, descripcion_compra: "paquete de 200g" },
        { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 2, unidad: "dientes", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
        { nombre: "albahaca fresca", nombre_normalizado: "albahaca", nombre_display: "Albahaca", cantidad_base: 5, unidad: "g", unidad_compra: "plantas", factor_conversion: 30, descripcion_compra: "planta ~30g" },
        { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 20, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
        { nombre: "orégano", nombre_normalizado: "oregano", nombre_display: "Orégano", cantidad_base: 2, unidad: "g", unidad_compra: "frascos", factor_conversion: 30, descripcion_compra: "frasco de 30g" }
      ],
      instrucciones: [
        "Precalentar horno a 200°C.",
        "Cortar los 350 g de berenjena en rodajas de 1 cm. Salar y dejar 20 min (libera amargor). Secar.",
        "Pincelar las rodajas con 15 ml de aceite de oliva. Hornear 15 min por lado hasta doradas.",
        "Picar los 2 ajos. Calentar 5 ml de aceite en sartén, saltear ajo 20 seg.",
        "Añadir 200 ml de salsa de tomate, 2 g de orégano, sal y pimienta. Cocinar 5 min.",
        "En fuente para horno, alternar capas: salsa, berenjena, albahaca picada, mozzarella. Repetir hasta terminar.",
        "Coronar con el parmesano rallado.",
        "Hornear 20 min hasta que burbujee y dore la superficie.",
        "Reposar 5 min antes de servir. Espolvorear albahaca fresca."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "c26",
      nombre: "Hamburguesas de lentejas con ensalada",
      tipo_comida: "cena",
      calorias_base: 440, proteinas_g: 20, carbohidratos_g: 52, grasas_g: 16,
      es_sin_gluten: false, es_sin_lactosa: true, es_vegetariana: true,
      ingredientes: [
        { nombre: "lentejas cocidas", nombre_normalizado: "lenteja", nombre_display: "Lentejas", cantidad_base: 150, unidad: "g", unidad_compra: "latas", factor_conversion: 400, descripcion_compra: "lata de 400g" },
        { nombre: "avena en hojuelas", nombre_normalizado: "avena", nombre_display: "Avena", cantidad_base: 30, unidad: "g", unidad_compra: "paquetes", factor_conversion: 500, descripcion_compra: "paquete de 500g" },
        { nombre: "cebolla", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
        { nombre: "zanahoria", nombre_normalizado: "zanahoria", nombre_display: "Zanahoria", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 7, descripcion_compra: "~7 unidades por kg" },
        { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 2, unidad: "dientes", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
        { nombre: "huevos", nombre_normalizado: "huevo", nombre_display: "Huevo", cantidad_base: 1, unidad: "unidad", unidad_compra: "docenas", factor_conversion: 12, descripcion_compra: "docena" },
        { nombre: "comino", nombre_normalizado: "comino", nombre_display: "Comino", cantidad_base: 2, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" },
        { nombre: "mix de lechugas", nombre_normalizado: "lechuga", nombre_display: "Mix de lechugas", cantidad_base: 80, unidad: "g", unidad_compra: "bolsas", factor_conversion: 200, descripcion_compra: "bolsa de 200g" },
        { nombre: "tomate", nombre_normalizado: "tomate", nombre_display: "Tomate", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
        { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 15, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
        { nombre: "limón (jugo)", nombre_normalizado: "limon", nombre_display: "Limón", cantidad_base: 10, unidad: "ml", unidad_compra: "unidades", factor_conversion: 30, descripcion_compra: "unidad (~30ml jugo)" }
      ],
      instrucciones: [
        "Escurrir 150 g de lentejas y machacar con tenedor hasta pasta rústica (con algunos trozos enteros para textura).",
        "Rallar la zanahoria y picar la media cebolla fina. Picar los 2 ajos.",
        "Calentar 5 ml de aceite en sartén. Sofreír cebolla 3 min, ajo 1 min, zanahoria 2 min. Enfriar.",
        "En bowl, combinar lentejas machacadas, verduras sofritas, 30 g de avena, huevo batido, 2 g de comino, sal y pimienta.",
        "Mezclar con las manos. Reposar 10 min (la avena absorbe humedad y da firmeza).",
        "Formar 2 hamburguesas de 2 cm de grosor.",
        "Calentar 10 ml de aceite en sartén a fuego medio. Cocinar las hamburguesas 5 min por lado sin mover (se desmoronan si se tocan antes).",
        "Preparar ensalada: mezclar 80 g de lechugas con tomate en cubos, 10 ml de jugo de limón, 5 ml de aceite, sal y pimienta.",
        "Servir las hamburguesas con la ensalada al lado."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "c27",
      nombre: "Risotto de hongos con parmesano",
      tipo_comida: "cena",
      calorias_base: 500, proteinas_g: 14, carbohidratos_g: 72, grasas_g: 16,
      es_sin_gluten: true, es_sin_lactosa: false, es_vegetariana: true,
      ingredientes: [
        { nombre: "arroz arborio", nombre_normalizado: "arroz_arborio", nombre_display: "Arroz arborio", cantidad_base: 90, unidad: "g", unidad_compra: "paquetes", factor_conversion: 500, descripcion_compra: "paquete de 500g" },
        { nombre: "champiñones mixtos", nombre_normalizado: "champinones", nombre_display: "Champiñones", cantidad_base: 150, unidad: "g", unidad_compra: "bandejas", factor_conversion: 250, descripcion_compra: "bandeja de 250g" },
        { nombre: "cebolla", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
        { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 2, unidad: "dientes", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
        { nombre: "caldo de verduras", nombre_normalizado: "caldo_verduras", nombre_display: "Caldo de verduras", cantidad_base: 500, unidad: "ml", unidad_compra: "cajas", factor_conversion: 1000, descripcion_compra: "caja de 1L" },
        { nombre: "vino blanco", nombre_normalizado: "vino_blanco", nombre_display: "Vino blanco", cantidad_base: 50, unidad: "ml", unidad_compra: "botellas", factor_conversion: 750, descripcion_compra: "botella de 750ml" },
        { nombre: "queso parmesano", nombre_normalizado: "queso_parmesano", nombre_display: "Queso parmesano", cantidad_base: 30, unidad: "g", unidad_compra: "paquetes", factor_conversion: 200, descripcion_compra: "paquete de 200g" },
        { nombre: "mantequilla", nombre_normalizado: "mantequilla", nombre_display: "Mantequilla", cantidad_base: 15, unidad: "g", unidad_compra: "barras", factor_conversion: 250, descripcion_compra: "barra de 250g" },
        { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 10, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
        { nombre: "perejil fresco", nombre_normalizado: "perejil", nombre_display: "Perejil", cantidad_base: 5, unidad: "g", unidad_compra: "manojos", factor_conversion: 50, descripcion_compra: "manojo" }
      ],
      instrucciones: [
        "Limpiar 150 g de champiñones con papel y cortar en cuartos. Picar la media cebolla y los 2 ajos finos.",
        "Calentar 500 ml de caldo en olla pequeña y mantener caliente a fuego muy bajo.",
        "En olla ancha, derretir 7 g de mantequilla con 10 ml de aceite. Saltear champiñones a fuego alto 5 min hasta dorados. Retirar.",
        "En la misma olla, sofreír cebolla 4 min a fuego medio. Añadir ajo 1 min.",
        "Incorporar 90 g de arroz arborio. Tostar 2 min removiendo (los granos deben volverse translúcidos en los bordes).",
        "Verter 50 ml de vino blanco. Remover hasta que evapore (1 min).",
        "Añadir el caldo de a un cucharón, removiendo constantemente. Esperar a que absorba antes del siguiente cucharón. Repetir 18 min hasta arroz al dente.",
        "Fuera del fuego, añadir los 8 g restantes de mantequilla y 30 g de parmesano rallado. Mezclar enérgicamente (mantecatura: da cremosidad).",
        "Incorporar los champiñones. Rectificar sal.",
        "Servir inmediatamente en platos entibiados. Espolvorear perejil y más parmesano al gusto."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "c28",
      nombre: "Pollo asado con hierbas y batatas",
      tipo_comida: "cena",
      calorias_base: 520, proteinas_g: 38, carbohidratos_g: 42, grasas_g: 20,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        { nombre: "muslos de pollo", nombre_normalizado: "pollo", nombre_display: "Muslos de pollo", cantidad_base: 200, unidad: "g", unidad_compra: "bandejas", factor_conversion: 800, descripcion_compra: "bandeja de 800g" },
        { nombre: "camote (batata)", nombre_normalizado: "camote", nombre_display: "Camote", cantidad_base: 250, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
        { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 4, unidad: "dientes", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
        { nombre: "romero fresco", nombre_normalizado: "romero", nombre_display: "Romero", cantidad_base: 3, unidad: "g", unidad_compra: "manojos", factor_conversion: 30, descripcion_compra: "manojo" },
        { nombre: "tomillo fresco", nombre_normalizado: "tomillo", nombre_display: "Tomillo", cantidad_base: 2, unidad: "g", unidad_compra: "manojos", factor_conversion: 15, descripcion_compra: "paquete de 15g" },
        { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 20, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
        { nombre: "limón (jugo)", nombre_normalizado: "limon", nombre_display: "Limón", cantidad_base: 15, unidad: "ml", unidad_compra: "unidades", factor_conversion: 30, descripcion_compra: "unidad (~30ml jugo)" },
        { nombre: "pimentón ahumado", nombre_normalizado: "pimenton", nombre_display: "Pimentón ahumado", cantidad_base: 3, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco de 50g" }
      ],
      instrucciones: [
        "Precalentar horno a 200°C.",
        "Pelar 250 g de camote, cortar en cubos de 3 cm.",
        "En bowl grande, mezclar el camote con 10 ml de aceite, 2 ajos machacados, las hojas de tomillo, sal y pimienta.",
        "Colocar en fuente. Hornear 10 min mientras se prepara el pollo.",
        "Secar los muslos de pollo con papel. Frotar con 10 ml de aceite, 3 g de pimentón, 15 ml de jugo de limón, sal y pimienta.",
        "Colocar las ramas de romero y los 2 ajos restantes (machacados con piel) en la fuente con el camote.",
        "Acomodar el pollo con la piel hacia arriba sobre el camote.",
        "Hornear 35-40 min hasta que la piel esté crujiente y la temperatura interna del pollo alcance 74°C.",
        "Reposar 5 min tapado con papel aluminio antes de servir.",
        "Servir el pollo sobre el camote, con los jugos de cocción vertidos por encima."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "c29",
      nombre: "Ceviche de pescado con camote",
      tipo_comida: "cena",
      calorias_base: 380, proteinas_g: 32, carbohidratos_g: 40, grasas_g: 8,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: false,
      ingredientes: [
        { nombre: "pescado blanco muy fresco (corvina o reineta)", nombre_normalizado: "pescado_blanco", nombre_display: "Pescado blanco", cantidad_base: 180, unidad: "g", unidad_compra: "bandejas", factor_conversion: 500, descripcion_compra: "bandeja de 500g" },
        { nombre: "limón (jugo)", nombre_normalizado: "limon", nombre_display: "Limón", cantidad_base: 100, unidad: "ml", unidad_compra: "unidades", factor_conversion: 30, descripcion_compra: "unidad (~30ml jugo)" },
        { nombre: "camote (batata)", nombre_normalizado: "camote", nombre_display: "Camote", cantidad_base: 200, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
        { nombre: "cebolla morada", nombre_normalizado: "cebolla", nombre_display: "Cebolla morada", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
        { nombre: "ají amarillo", nombre_normalizado: "chile", nombre_display: "Ají amarillo", cantidad_base: 10, unidad: "g", unidad_compra: "unidades", factor_conversion: 30, descripcion_compra: "unidad" },
        { nombre: "cilantro fresco", nombre_normalizado: "cilantro", nombre_display: "Cilantro", cantidad_base: 10, unidad: "g", unidad_compra: "manojos", factor_conversion: 50, descripcion_compra: "manojo" },
        { nombre: "choclo", nombre_normalizado: "choclo", nombre_display: "Choclo", cantidad_base: 80, unidad: "g", unidad_compra: "bolsas", factor_conversion: 500, descripcion_compra: "bolsa congelada de 500g" },
        { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 1, unidad: "diente", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
        { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 3, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
      ],
      instrucciones: [
        "Verificar que el pescado sea fresco (olor a mar, sin amoníaco, carne firme). Congelar 48h previas si se tiene duda (elimina parásitos).",
        "Cortar el pescado en cubos de 1.5 cm. Refrigerar.",
        "Pelar los 200 g de camote, cortar en rodajas. Hervir 15 min hasta tiernas. Dejar templar.",
        "Hervir 80 g de choclo 5 min. Escurrir.",
        "Cortar la media cebolla morada en pluma fina. Enjuagar bajo agua fría 1 min (retira picor agresivo). Escurrir.",
        "Picar el cilantro (reservar hojas enteras para decorar). Picar el ají sin semillas muy fino. Rallar el ajo.",
        "En bowl frío, combinar el pescado con 100 ml de jugo de limón, ajo rallado, 3 g de sal y ají. Refrigerar 8 min (el ácido 'cocina' el pescado).",
        "Añadir la cebolla morada y cilantro picado. Mezclar suavemente.",
        "Servir en plato hondo frío: ceviche al centro, rodajas de camote y choclo alrededor. Decorar con hojas de cilantro entero."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "c30",
      nombre: "Tortilla de papa con ensalada verde",
      tipo_comida: "cena",
      calorias_base: 480, proteinas_g: 22, carbohidratos_g: 46, grasas_g: 22,
      es_sin_gluten: true, es_sin_lactosa: true, es_vegetariana: true,
      ingredientes: [
        { nombre: "huevos", nombre_normalizado: "huevo", nombre_display: "Huevos", cantidad_base: 4, unidad: "unidades", unidad_compra: "docenas", factor_conversion: 12, descripcion_compra: "docena" },
        { nombre: "papa", nombre_normalizado: "papa", nombre_display: "Papa", cantidad_base: 250, unidad: "g", unidad_compra: "kg", factor_conversion: 1000, descripcion_compra: "kg" },
        { nombre: "cebolla", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
        { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 30, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
        { nombre: "mix de lechugas", nombre_normalizado: "lechuga", nombre_display: "Mix de lechugas", cantidad_base: 80, unidad: "g", unidad_compra: "bolsas", factor_conversion: 200, descripcion_compra: "bolsa de 200g" },
        { nombre: "tomate cherry", nombre_normalizado: "tomate_cherry", nombre_display: "Tomate cherry", cantidad_base: 100, unidad: "g", unidad_compra: "bandejas", factor_conversion: 250, descripcion_compra: "bandeja de 250g" },
        { nombre: "vinagre de vino", nombre_normalizado: "vinagre", nombre_display: "Vinagre", cantidad_base: 10, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
        { nombre: "sal", nombre_normalizado: "sal", nombre_display: "Sal", cantidad_base: 3, unidad: "g", unidad_compra: "paquetes", factor_conversion: 1000, descripcion_compra: "paquete de 1kg" }
      ],
      instrucciones: [
        "Pelar 250 g de papas. Cortar en rodajas finas de 2 mm (mandolina es ideal).",
        "Cortar la media cebolla en juliana fina.",
        "Calentar 25 ml de aceite en sartén antiadherente de 20 cm a fuego medio-bajo.",
        "Añadir papas y cebolla con pizca de sal. Confitar 20 min removiendo suavemente cada 5 min (las papas no deben dorarse, solo ablandarse).",
        "Escurrir el exceso de aceite (reservar para otra preparación).",
        "Batir los 4 huevos con sal. Añadir las papas y cebolla escurridas. Reposar 5 min.",
        "Calentar 5 ml de aceite en la misma sartén a fuego medio. Verter la mezcla.",
        "Cocinar 5 min sin mover hasta que los bordes cuajen.",
        "Colocar plato del tamaño de la sartén encima, voltear y deslizar la tortilla de vuelta. Cocinar 4 min más.",
        "Mezclar 80 g de lechugas, tomates cherry partidos, 10 ml de vinagre y sal. Servir la tortilla con la ensalada al lado."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "c31",
      nombre: "Wrap de pavo con verduras",
      tipo_comida: "cena",
      calorias_base: 450, proteinas_g: 32, carbohidratos_g: 40, grasas_g: 18,
      es_sin_gluten: false, es_sin_lactosa: false, es_vegetariana: false,
      ingredientes: [
        { nombre: "tortilla de trigo integral", nombre_normalizado: "tortilla_trigo", nombre_display: "Tortilla de trigo", cantidad_base: 1, unidad: "unidad", unidad_compra: "paquetes", factor_conversion: 8, descripcion_compra: "paquete de 8 unid." },
        { nombre: "pechuga de pavo", nombre_normalizado: "pechuga_pavo", nombre_display: "Pechuga de pavo", cantidad_base: 150, unidad: "g", unidad_compra: "bandejas", factor_conversion: 500, descripcion_compra: "bandeja de 500g" },
        { nombre: "lechuga", nombre_normalizado: "lechuga", nombre_display: "Lechuga", cantidad_base: 30, unidad: "g", unidad_compra: "unidades", factor_conversion: 400, descripcion_compra: "unidad (~400g)" },
        { nombre: "tomate", nombre_normalizado: "tomate", nombre_display: "Tomate", cantidad_base: 0.5, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
        { nombre: "palta (aguacate)", nombre_normalizado: "palta", nombre_display: "Palta", cantidad_base: 0.25, unidad: "unidad", unidad_compra: "unidades", factor_conversion: 1, descripcion_compra: "unidad" },
        { nombre: "queso cheddar", nombre_normalizado: "queso_cheddar", nombre_display: "Queso cheddar", cantidad_base: 20, unidad: "g", unidad_compra: "paquetes", factor_conversion: 250, descripcion_compra: "paquete de 250g" },
        { nombre: "yogur natural", nombre_normalizado: "yogur", nombre_display: "Yogur natural", cantidad_base: 30, unidad: "g", unidad_compra: "potes", factor_conversion: 500, descripcion_compra: "pote de 500g" },
        { nombre: "mostaza dijon", nombre_normalizado: "mostaza", nombre_display: "Mostaza dijon", cantidad_base: 5, unidad: "g", unidad_compra: "frascos", factor_conversion: 200, descripcion_compra: "frasco de 200g" },
        { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 5, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" }
      ],
      instrucciones: [
        "Cortar la pechuga de pavo en filetes delgados (1 cm). Salpimentar.",
        "Calentar 5 ml de aceite en sartén a fuego alto. Sellar el pavo 3 min por lado. Reposar y cortar en tiras.",
        "Mezclar 30 g de yogur con 5 g de mostaza dijon (salsa cremosa).",
        "Calentar la tortilla de trigo integral en sartén seca 20 seg por lado.",
        "Lavar la lechuga y cortar en juliana gruesa. Cortar el tomate en rodajas finas. Laminar el cuarto de palta.",
        "Extender la tortilla. Untar la salsa de yogur y mostaza en el centro.",
        "Disponer lechuga, rodajas de tomate, tiras de pavo, láminas de palta y 20 g de queso cheddar en tiras.",
        "Doblar los extremos hacia adentro y enrollar firmemente desde un lado.",
        "Cortar en diagonal. Opcional: dorar en sartén seca 1 min por lado para sellar."
      ],
      instrucciones_thermomix: []
    },
    {
      id: "c32",
      nombre: "Sopa minestrone con pan",
      tipo_comida: "cena",
      calorias_base: 430, proteinas_g: 18, carbohidratos_g: 62, grasas_g: 12,
      es_sin_gluten: false, es_sin_lactosa: false, es_vegetariana: true,
      ingredientes: [
        { nombre: "porotos blancos cocidos", nombre_normalizado: "poroto", nombre_display: "Porotos blancos", cantidad_base: 100, unidad: "g", unidad_compra: "latas", factor_conversion: 400, descripcion_compra: "lata de 400g" },
        { nombre: "pasta corta (ditalini o coditos)", nombre_normalizado: "pasta", nombre_display: "Pasta corta", cantidad_base: 40, unidad: "g", unidad_compra: "paquetes", factor_conversion: 500, descripcion_compra: "paquete de 500g" },
        { nombre: "zanahoria", nombre_normalizado: "zanahoria", nombre_display: "Zanahoria", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 7, descripcion_compra: "~7 unidades por kg" },
        { nombre: "apio", nombre_normalizado: "apio", nombre_display: "Apio", cantidad_base: 2, unidad: "tallos", unidad_compra: "manojos", factor_conversion: 10, descripcion_compra: "manojo de ~10 tallos" },
        { nombre: "cebolla", nombre_normalizado: "cebolla", nombre_display: "Cebolla", cantidad_base: 1, unidad: "unidad", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
        { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 2, unidad: "dientes", unidad_compra: "cabezas", factor_conversion: 10, descripcion_compra: "cabeza (~10 dientes)" },
        { nombre: "tomate", nombre_normalizado: "tomate", nombre_display: "Tomate", cantidad_base: 2, unidad: "unidades", unidad_compra: "kg", factor_conversion: 5, descripcion_compra: "~5 unidades por kg" },
        { nombre: "espinaca fresca", nombre_normalizado: "espinaca", nombre_display: "Espinaca", cantidad_base: 80, unidad: "g", unidad_compra: "bolsas", factor_conversion: 200, descripcion_compra: "bolsa de 200g" },
        { nombre: "zapallo italiano (calabacín)", nombre_normalizado: "calabacin", nombre_display: "Calabacín", cantidad_base: 100, unidad: "g", unidad_compra: "unidades", factor_conversion: 300, descripcion_compra: "unidad (~300g)" },
        { nombre: "caldo de verduras", nombre_normalizado: "caldo_verduras", nombre_display: "Caldo de verduras", cantidad_base: 800, unidad: "ml", unidad_compra: "cajas", factor_conversion: 1000, descripcion_compra: "caja de 1L" },
        { nombre: "queso parmesano", nombre_normalizado: "queso_parmesano", nombre_display: "Queso parmesano", cantidad_base: 15, unidad: "g", unidad_compra: "paquetes", factor_conversion: 200, descripcion_compra: "paquete de 200g" },
        { nombre: "aceite de oliva", nombre_normalizado: "aceite_oliva", nombre_display: "Aceite de oliva", cantidad_base: 20, unidad: "ml", unidad_compra: "botellas", factor_conversion: 500, descripcion_compra: "botella de 500ml" },
        { nombre: "pan integral", nombre_normalizado: "pan_integral", nombre_display: "Pan integral", cantidad_base: 1, unidad: "rebanada", unidad_compra: "paquetes", factor_conversion: 12, descripcion_compra: "paquete de ~12 rebanadas" },
        { nombre: "albahaca fresca", nombre_normalizado: "albahaca", nombre_display: "Albahaca", cantidad_base: 3, unidad: "g", unidad_compra: "plantas", factor_conversion: 30, descripcion_compra: "planta ~30g" }
      ],
      instrucciones: [
        "Picar la cebolla, 2 ajos, 2 tallos de apio y la zanahoria en cubos de 0.5 cm (brunoise).",
        "Cortar el calabacín en cubos de 1 cm. Escaldar los 2 tomates 30 seg, pelar y picar.",
        "Calentar 15 ml de aceite en olla grande a fuego medio. Sofreír cebolla, apio y zanahoria 7 min.",
        "Añadir ajo 1 min, luego tomate picado 3 min hasta deshacer.",
        "Incorporar 800 ml de caldo de verduras hirviendo. Llevar a hervor.",
        "Añadir 100 g de porotos blancos escurridos y el calabacín. Cocinar 10 min.",
        "Añadir los 40 g de pasta corta y cocinar según tiempo del paquete (generalmente 8 min).",
        "Los últimos 2 min incorporar la espinaca. Rectificar sal y pimienta.",
        "Tostar la rebanada de pan integral y frotar con ajo crudo. Rociar con 5 ml de aceite.",
        "Servir la sopa en bowls hondos. Espolvorear 15 g de parmesano y albahaca picada. Acompañar con el pan tostado."
      ],
      instrucciones_thermomix: []
    }
  ];

  for (const r of CENAS_EXTRA) RECETAS_DB.push(r);

  console.log(`[Recipes Extra] +${RECETAS_EXTRA.length} desayunos, +${SNACKS_AM_EXTRA.length} snacks AM, +${ALMUERZOS_EXTRA.length} almuerzos, +${SNACKS_PM_EXTRA.length} snacks PM, +${CENAS_EXTRA.length} cenas = +${RECETAS_EXTRA.length + SNACKS_AM_EXTRA.length + ALMUERZOS_EXTRA.length + SNACKS_PM_EXTRA.length + CENAS_EXTRA.length} recetas añadidas`);
})();
