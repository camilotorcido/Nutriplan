/* ============================================
   NutriPlan - Equivalencias de ingredientes
   Tabla de sustitución con ajuste de macros
   ============================================ */

(function cargarEquivalencias() {
  // Estructura: cada entrada es grupo de ingredientes intercambiables
  // ratio = cantidad_sustituto / cantidad_original (1.0 = 1:1)
  // Los macros del sustituto se ajustan automáticamente usando PRECIOS_CLP
  // y datos nutricionales de referencia por 100g/100ml.
  
  // Datos nutricionales por 100g (o 100ml para líquidos)
  // Fuente: USDA FoodData Central + INTA Chile
  const MACROS_100 = {
    // PROTEÍNAS
    pechuga_pollo:     { kcal: 165, p: 31, c: 0,   g: 3.6 },
    pollo_entero:      { kcal: 215, p: 27, c: 0,   g: 11  },
    carne_molida:      { kcal: 250, p: 26, c: 0,   g: 15  },
    posta_rosada:      { kcal: 170, p: 28, c: 0,   g: 6   },
    lomo_vetado:       { kcal: 280, p: 25, c: 0,   g: 20  },
    cerdo:             { kcal: 240, p: 25, c: 0,   g: 15  },
    salmon:            { kcal: 208, p: 20, c: 0,   g: 13  },
    merluza:           { kcal: 90,  p: 18, c: 0,   g: 1   },
    atun_lata:         { kcal: 130, p: 26, c: 0,   g: 3   },
    camarones:         { kcal: 99,  p: 24, c: 0.2, g: 0.3 },
    huevo:             { kcal: 72,  p: 6.3, c: 0.4, g: 5, por_unidad: true }, // por huevo mediano
    tofu:              { kcal: 76,  p: 8,  c: 2,   g: 5   },
    // CARBOS
    arroz:             { kcal: 130, p: 2.7, c: 28, g: 0.3 }, // cocido
    arroz_integral:    { kcal: 111, p: 2.6, c: 23, g: 0.9 },
    quinoa:            { kcal: 120, p: 4.4, c: 21, g: 1.9 },
    fideos:            { kcal: 131, p: 5,   c: 25, g: 1.1 },
    pan_integral:      { kcal: 80,  p: 4,   c: 14, g: 1, por_unidad: true }, // por rebanada
    pan_pita:          { kcal: 165, p: 5.5, c: 33, g: 1, por_unidad: true }, // por pita
    tortilla_maiz:     { kcal: 55,  p: 1.4, c: 12, g: 0.6, por_unidad: true },
    avena:             { kcal: 389, p: 17,  c: 66, g: 7   },
    harina_maiz:       { kcal: 361, p: 7,   c: 77, g: 4   },
    papa:              { kcal: 77,  p: 2,   c: 17, g: 0.1 },
    camote:            { kcal: 86,  p: 1.6, c: 20, g: 0.1 },
    choclo:            { kcal: 96,  p: 3.4, c: 21, g: 1.5 },
    // LEGUMBRES (cocidas)
    lentejas:          { kcal: 116, p: 9,   c: 20, g: 0.4 },
    garbanzos:         { kcal: 164, p: 9,   c: 27, g: 2.6 },
    porotos:           { kcal: 127, p: 9,   c: 23, g: 0.5 },
    porotos_negros:    { kcal: 132, p: 9,   c: 24, g: 0.5 },
    // LÁCTEOS
    leche_descremada:  { kcal: 35,  p: 3.4, c: 5,  g: 0.2 },
    leche_entera:      { kcal: 61,  p: 3.2, c: 4.8, g: 3.3 },
    leche_coco:        { kcal: 230, p: 2.3, c: 6,  g: 24  },
    leche_almendra:    { kcal: 17,  p: 0.6, c: 0.3, g: 1.5 },
    yogurt_natural:    { kcal: 61,  p: 3.5, c: 4.7, g: 3.3 },
    yogurt_griego:     { kcal: 97,  p: 9,   c: 3.6, g: 5   },
    queso_mozzarella:  { kcal: 280, p: 28,  c: 3,  g: 17  },
    queso_fresco:      { kcal: 215, p: 18,  c: 3,  g: 14  },
    queso_parmesano:   { kcal: 431, p: 38,  c: 4,  g: 29  }
  };

  // Grupos de equivalencias: dentro del grupo se pueden sustituir
  // Cada item tiene un "ratio" sobre el primer item del grupo (base = 1.0)
  const GRUPOS_EQUIVALENCIAS = [
    {
      categoria: "Proteína magra",
      items: [
        { id: "pechuga_pollo",   ratio: 1.0, nota: "Base" },
        { id: "merluza",         ratio: 1.0, nota: "Menos grasa, más omega-3" },
        { id: "atun_lata",       ratio: 0.8, nota: "Mayor densidad proteica" },
        { id: "tofu",            ratio: 1.3, nota: "Opción vegetariana" },
        { id: "camarones",       ratio: 1.0, nota: "Similar en kcal" }
      ]
    },
    {
      categoria: "Proteína roja",
      items: [
        { id: "carne_molida",    ratio: 1.0, nota: "Base" },
        { id: "posta_rosada",    ratio: 1.0, nota: "Más magra" },
        { id: "cerdo",           ratio: 1.0, nota: "Similar perfil" },
        { id: "pollo_entero",    ratio: 1.1, nota: "Más barato, menos grasa" }
      ]
    },
    {
      categoria: "Pescado graso",
      items: [
        { id: "salmon",          ratio: 1.0, nota: "Base" },
        { id: "atun_lata",       ratio: 0.8, nota: "Más práctico" }
      ]
    },
    {
      categoria: "Cereales",
      items: [
        { id: "arroz",           ratio: 1.0, nota: "Base" },
        { id: "arroz_integral",  ratio: 1.0, nota: "Más fibra, menor IG" },
        { id: "quinoa",          ratio: 1.0, nota: "Proteína completa" },
        { id: "fideos",          ratio: 1.0, nota: "Carbos similares" }
      ]
    },
    {
      categoria: "Tubérculos",
      items: [
        { id: "papa",            ratio: 1.0, nota: "Base" },
        { id: "camote",          ratio: 1.0, nota: "Más fibra y vitamina A" }
      ]
    },
    {
      categoria: "Legumbres",
      items: [
        { id: "lentejas",        ratio: 1.0, nota: "Base" },
        { id: "garbanzos",       ratio: 1.0, nota: "Más grasa saludable" },
        { id: "porotos",         ratio: 1.0, nota: "Similar perfil" },
        { id: "porotos_negros",  ratio: 1.0, nota: "Más antioxidantes" }
      ]
    },
    {
      categoria: "Pan",
      items: [
        { id: "pan_integral",    ratio: 1.0, nota: "Base (rebanada)" },
        { id: "pan_pita",        ratio: 0.5, nota: "1 pita ≈ 2 rebanadas" },
        { id: "tortilla_maiz",   ratio: 1.5, nota: "Sin gluten" }
      ]
    },
    {
      categoria: "Leche",
      items: [
        { id: "leche_descremada", ratio: 1.0, nota: "Base" },
        { id: "leche_entera",     ratio: 1.0, nota: "Más grasa y sabor" },
        { id: "leche_almendra",   ratio: 1.0, nota: "Sin lactosa, menos proteína" },
        { id: "leche_coco",       ratio: 1.0, nota: "Sin lactosa, alta en grasa" }
      ]
    },
    {
      categoria: "Yogurt",
      items: [
        { id: "yogurt_natural",  ratio: 1.0, nota: "Base" },
        { id: "yogurt_griego",   ratio: 1.0, nota: "Más proteína, más calórico" }
      ]
    },
    {
      categoria: "Queso",
      items: [
        { id: "queso_fresco",     ratio: 1.0, nota: "Base (quesillo)" },
        { id: "queso_mozzarella", ratio: 0.8, nota: "Funde mejor" },
        { id: "queso_parmesano",  ratio: 0.5, nota: "Más concentrado" }
      ]
    }
  ];

  // Índice inverso: nombre_normalizado → grupo
  const INDICE_GRUPOS = {};
  GRUPOS_EQUIVALENCIAS.forEach(grupo => {
    grupo.items.forEach(item => {
      INDICE_GRUPOS[item.id] = grupo;
    });
  });

  // ───────────────────────────────────────────────
  // Buscar sustitutos posibles para un ingrediente
  // ───────────────────────────────────────────────
  function buscarSustitutos(nombre_normalizado) {
    const grupo = INDICE_GRUPOS[nombre_normalizado];
    if (!grupo) return [];
    return grupo.items
      .filter(item => item.id !== nombre_normalizado)
      .map(item => ({
        ...item,
        categoria: grupo.categoria,
        macros: MACROS_100[item.id] || null,
        precio: (window.PRECIOS_CLP && window.PRECIOS_CLP[item.id]) || null
      }));
  }

  // ───────────────────────────────────────────────
  // Calcular nuevos macros de receta al sustituir
  // ───────────────────────────────────────────────
  function calcularMacrosTrasSustitucion(receta, ingredienteOriginalId, ingredienteNuevoId) {
    const ingOrig = receta.ingredientes.find(i => i.nombre_normalizado === ingredienteOriginalId);
    if (!ingOrig) return null;

    const grupo = INDICE_GRUPOS[ingredienteOriginalId];
    if (!grupo) return null;

    const itemOrig = grupo.items.find(i => i.id === ingredienteOriginalId);
    const itemNuevo = grupo.items.find(i => i.id === ingredienteNuevoId);
    if (!itemOrig || !itemNuevo) return null;

    const macrosOrig = MACROS_100[ingredienteOriginalId];
    const macrosNuevo = MACROS_100[ingredienteNuevoId];
    if (!macrosOrig || !macrosNuevo) return null;

    // Cantidad original (base)
    const cantOrig = ingOrig.cantidad_base;
    // Cantidad ajustada con ratio relativo
    const ratioRelativo = itemNuevo.ratio / itemOrig.ratio;
    const cantNueva = cantOrig * ratioRelativo;

    // Factor para macros: por_unidad → multiplicar directo; por peso → dividir entre 100
    const factorOrig = macrosOrig.por_unidad ? cantOrig : cantOrig / 100;
    const factorNuevo = macrosNuevo.por_unidad ? cantNueva : cantNueva / 100;

    const deltaKcal = (macrosNuevo.kcal * factorNuevo) - (macrosOrig.kcal * factorOrig);
    const deltaP    = (macrosNuevo.p    * factorNuevo) - (macrosOrig.p    * factorOrig);
    const deltaC    = (macrosNuevo.c    * factorNuevo) - (macrosOrig.c    * factorOrig);
    const deltaG    = (macrosNuevo.g    * factorNuevo) - (macrosOrig.g    * factorOrig);

    return {
      cantidad_nueva: Math.round(cantNueva * 10) / 10,
      cantidad_original: cantOrig,
      unidad: ingOrig.unidad,
      delta_kcal: Math.round(deltaKcal),
      delta_proteinas: Math.round(deltaP * 10) / 10,
      delta_carbohidratos: Math.round(deltaC * 10) / 10,
      delta_grasas: Math.round(deltaG * 10) / 10,
      nueva_receta: {
        calorias_base: Math.round(receta.calorias_base + deltaKcal),
        proteinas_g: Math.round((receta.proteinas_g + deltaP) * 10) / 10,
        carbohidratos_g: Math.round((receta.carbohidratos_g + deltaC) * 10) / 10,
        grasas_g: Math.round((receta.grasas_g + deltaG) * 10) / 10
      }
    };
  }

  // Exponer a window
  window.GRUPOS_EQUIVALENCIAS = GRUPOS_EQUIVALENCIAS;
  window.MACROS_100 = MACROS_100;
  window.buscarSustitutosIngrediente = buscarSustitutos;
  window.calcularMacrosTrasSustitucion = calcularMacrosTrasSustitucion;

  console.log(`[Equivalencias] ${GRUPOS_EQUIVALENCIAS.length} grupos, ${Object.keys(INDICE_GRUPOS).length} ingredientes mapeados`);
})();
