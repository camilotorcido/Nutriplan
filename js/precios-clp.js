/* ============================================
   NutriPlan - Precios referenciales CLP
   Santiago de Chile, promedio Jumbo/Líder 2026 (rev 2)

   Estructura: nombre_normalizado → {
     clp_por_unidad_base: CLP por g/ml/unidad
     unidad_base: "g" | "ml" | "unidad"
     descripcion: texto libre para UI
   }

   Los precios se pueden editar desde la pestaña "Precios" en la app.
   Los cambios del usuario se guardan en localStorage["nutriplan_precios_override"].
   ============================================ */

(function cargarPreciosCLP() {
  // Bump this when prices change so stored plans get recomputed automatically
  var PRECIOS_VERSION = 'v2';

  const PRECIOS_BASE = {
    // ═════════ PROTEÍNAS ═════════
    pechuga_pollo:     { clp_por_unidad_base: 14.0, unidad_base: "g", descripcion: "Pechuga de pollo (~14.000/kg)" },
    pollo_entero:      { clp_por_unidad_base: 8.0,  unidad_base: "g", descripcion: "Pollo entero (~8.000/kg)" },
    carne_molida:      { clp_por_unidad_base: 17.0, unidad_base: "g", descripcion: "Carne molida (~17.000/kg)" },
    posta_rosada:      { clp_por_unidad_base: 20.0, unidad_base: "g", descripcion: "Posta rosada (~20.000/kg)" },
    lomo_vetado:       { clp_por_unidad_base: 32.0, unidad_base: "g", descripcion: "Lomo vetado (~32.000/kg)" },
    cerdo:             { clp_por_unidad_base: 13.0, unidad_base: "g", descripcion: "Cerdo (~13.000/kg)" },
    salmon:            { clp_por_unidad_base: 34.0, unidad_base: "g", descripcion: "Salmón (~34.000/kg)" },
    merluza:           { clp_por_unidad_base: 13.0, unidad_base: "g", descripcion: "Merluza (~13.000/kg)" },
    atun_lata:         { clp_por_unidad_base: 20.0, unidad_base: "g", descripcion: "Atún en lata (~3.400/170g)" },
    camarones:         { clp_por_unidad_base: 45.0, unidad_base: "g", descripcion: "Camarones pelados (~45.000/kg)" },
    huevo:             { clp_por_unidad_base: 490,  unidad_base: "unidad", descripcion: "Huevo (~5.900/docena)" },
    tofu:              { clp_por_unidad_base: 12.0, unidad_base: "g", descripcion: "Tofu (~6.000/500g)" },
    sardina:           { clp_por_unidad_base: 18.0, unidad_base: "g", descripcion: "Sardinas lata (~3.100/170g)" },

    // ═════════ LÁCTEOS ═════════
    leche_descremada:  { clp_por_unidad_base: 2.0,  unidad_base: "ml", descripcion: "Leche descremada (~2.000/L)" },
    leche_entera:      { clp_por_unidad_base: 2.0,  unidad_base: "ml", descripcion: "Leche entera (~2.000/L)" },
    leche_coco:        { clp_por_unidad_base: 7.0,  unidad_base: "ml", descripcion: "Leche de coco (~2.800/400ml lata)" },
    leche_almendra:    { clp_por_unidad_base: 5.0,  unidad_base: "ml", descripcion: "Leche de almendra (~5.000/L)" },
    yogurt_natural:    { clp_por_unidad_base: 5.0,  unidad_base: "g", descripcion: "Yogurt natural (~5.000/kg)" },
    yogurt_griego:     { clp_por_unidad_base: 14.0, unidad_base: "g", descripcion: "Yogurt griego (~2.800/200g)" },
    queso_mozzarella:  { clp_por_unidad_base: 20.0, unidad_base: "g", descripcion: "Mozzarella (~10.000/500g)" },
    queso_fresco:      { clp_por_unidad_base: 16.0, unidad_base: "g", descripcion: "Quesillo (~8.000/500g)" },
    queso_parmesano:   { clp_por_unidad_base: 45.0, unidad_base: "g", descripcion: "Queso parmesano (~9.000/200g)" },
    queso_cottage:     { clp_por_unidad_base: 14.0, unidad_base: "g", descripcion: "Queso cottage (~5.600/400g)" },
    queso_ricotta:     { clp_por_unidad_base: 18.0, unidad_base: "g", descripcion: "Queso ricotta (~4.500/250g)" },
    mantequilla:       { clp_por_unidad_base: 18.0, unidad_base: "g", descripcion: "Mantequilla (~4.500/250g)" },
    crema_leche:       { clp_por_unidad_base: 7.0,  unidad_base: "ml", descripcion: "Crema (~1.400/200ml)" },

    // ═════════ CARBOHIDRATOS ═════════
    arroz:             { clp_por_unidad_base: 2.8,  unidad_base: "g", descripcion: "Arroz (~2.800/kg)" },
    arroz_integral:    { clp_por_unidad_base: 5.0,  unidad_base: "g", descripcion: "Arroz integral (~5.000/kg)" },
    quinoa:            { clp_por_unidad_base: 20.0, unidad_base: "g", descripcion: "Quinoa (~10.000/500g)" },
    fideos:            { clp_por_unidad_base: 3.2,  unidad_base: "g", descripcion: "Pasta (~1.600/500g)" },
    pan_integral:      { clp_por_unidad_base: 380,  unidad_base: "unidad", descripcion: "Pan integral (~4.600/12u)" },
    pan_pita:          { clp_por_unidad_base: 400,  unidad_base: "unidad", descripcion: "Pan pita (~2.400/6u)" },
    muffin_ingles:     { clp_por_unidad_base: 750,  unidad_base: "unidad", descripcion: "Muffin inglés (~4.500/6u)" },
    tortilla_maiz:     { clp_por_unidad_base: 230,  unidad_base: "unidad", descripcion: "Tortilla de maíz (~3.450/15u)" },
    avena:             { clp_por_unidad_base: 3.8,  unidad_base: "g", descripcion: "Avena (~1.900/500g)" },
    harina_maiz:       { clp_por_unidad_base: 3.5,  unidad_base: "g", descripcion: "Harina de maíz (~3.500/1kg)" },
    papa:              { clp_por_unidad_base: 2.0,  unidad_base: "g", descripcion: "Papa (~2.000/kg)" },
    camote:            { clp_por_unidad_base: 4.0,  unidad_base: "g", descripcion: "Camote (~4.000/kg)" },
    choclo:            { clp_por_unidad_base: 6.0,  unidad_base: "g", descripcion: "Choclo (~3.000/500g congelado)" },

    // ═════════ LEGUMBRES ═════════
    lentejas:          { clp_por_unidad_base: 5.5,  unidad_base: "g", descripcion: "Lentejas (~5.500/kg)" },
    garbanzos:         { clp_por_unidad_base: 7.5,  unidad_base: "g", descripcion: "Garbanzos (~7.500/kg)" },
    porotos:           { clp_por_unidad_base: 6.0,  unidad_base: "g", descripcion: "Porotos (~6.000/kg)" },
    porotos_negros:    { clp_por_unidad_base: 7.0,  unidad_base: "g", descripcion: "Porotos negros (~7.000/kg)" },
    frijoles_negros:   { clp_por_unidad_base: 8.0,  unidad_base: "g", descripcion: "Frijoles negros lata (~3.200/400g)" },

    // ═════════ VEGETALES ═════════
    cebolla:           { clp_por_unidad_base: 3.0,  unidad_base: "g", descripcion: "Cebolla (~3.000/kg)" },
    ajo:               { clp_por_unidad_base: 400,  unidad_base: "unidad", descripcion: "Ajo (~1.200/cabeza 3 dientes)" },
    tomate:            { clp_por_unidad_base: 4.0,  unidad_base: "g", descripcion: "Tomate (~4.000/kg)" },
    tomate_cherry:     { clp_por_unidad_base: 12.0, unidad_base: "g", descripcion: "Tomate cherry (~3.000/250g)" },
    zanahoria:         { clp_por_unidad_base: 2.5,  unidad_base: "g", descripcion: "Zanahoria (~2.500/kg)" },
    apio:              { clp_por_unidad_base: 5.0,  unidad_base: "g", descripcion: "Apio (~1.500/manojo 300g)" },
    pimenton:          { clp_por_unidad_base: 7.0,  unidad_base: "g", descripcion: "Pimentón (~7.000/kg)" },
    zapallo_italiano:  { clp_por_unidad_base: 4.5,  unidad_base: "g", descripcion: "Zapallo italiano (~4.500/kg)" },
    zapallo:           { clp_por_unidad_base: 3.5,  unidad_base: "g", descripcion: "Zapallo (~3.500/kg)" },
    brocoli:           { clp_por_unidad_base: 6.0,  unidad_base: "g", descripcion: "Brócoli (~3.000/unidad 500g)" },
    coliflor:          { clp_por_unidad_base: 5.0,  unidad_base: "g", descripcion: "Coliflor (~3.000/unidad 600g)" },
    espinaca:          { clp_por_unidad_base: 9.0,  unidad_base: "g", descripcion: "Espinaca (~2.700/bolsa 300g)" },
    lechuga:           { clp_por_unidad_base: 6.5,  unidad_base: "g", descripcion: "Lechuga (~1.950/unidad 300g)" },
    pepino:            { clp_por_unidad_base: 3.5,  unidad_base: "g", descripcion: "Pepino (~3.500/kg)" },
    palta:             { clp_por_unidad_base: 2500, unidad_base: "unidad", descripcion: "Palta (~2.500/unidad)" },
    champinones:       { clp_por_unidad_base: 14.0, unidad_base: "g", descripcion: "Champiñones (~3.500/250g)" },
    betarraga:         { clp_por_unidad_base: 3.5,  unidad_base: "g", descripcion: "Betarraga (~3.500/kg)" },
    repollo:           { clp_por_unidad_base: 2.8,  unidad_base: "g", descripcion: "Repollo (~2.800/kg)" },
    porotos_verdes:    { clp_por_unidad_base: 6.5,  unidad_base: "g", descripcion: "Porotos verdes (~6.500/kg)" },
    berenjena:         { clp_por_unidad_base: 5.0,  unidad_base: "g", descripcion: "Berenjena (~5.000/kg)" },
    kale:              { clp_por_unidad_base: 16.0, unidad_base: "g", descripcion: "Kale (~3.200/bolsa 200g)" },
    puerro:            { clp_por_unidad_base: 5.5,  unidad_base: "g", descripcion: "Puerro (~5.500/kg)" },
    jengibre:          { clp_por_unidad_base: 16.0, unidad_base: "g", descripcion: "Jengibre (~8.000/500g)" },
    bok_choy:          { clp_por_unidad_base: 12.0, unidad_base: "g", descripcion: "Bok choy (~2.400/unidad 200g)" },
    shiitake:          { clp_por_unidad_base: 35.0, unidad_base: "g", descripcion: "Shiitake (~7.000/200g)" },

    // ═════════ FRUTAS ═════════
    platano:           { clp_por_unidad_base: 700,  unidad_base: "unidad", descripcion: "Plátano (~2.800/kg ~4u)" },
    manzana:           { clp_por_unidad_base: 900,  unidad_base: "unidad", descripcion: "Manzana (~4.500/kg)" },
    naranja:           { clp_por_unidad_base: 650,  unidad_base: "unidad", descripcion: "Naranja (~3.250/kg)" },
    limon:             { clp_por_unidad_base: 350,  unidad_base: "unidad", descripcion: "Limón (~3.500/kg ~10u)" },
    frutilla:          { clp_por_unidad_base: 16.0, unidad_base: "g", descripcion: "Frutillas (~8.000/500g)" },
    arandanos:         { clp_por_unidad_base: 40.0, unidad_base: "g", descripcion: "Arándanos (~8.000/200g)" },
    mango:             { clp_por_unidad_base: 3500, unidad_base: "unidad", descripcion: "Mango (~3.500/unidad)" },
    pina:              { clp_por_unidad_base: 5000, unidad_base: "unidad", descripcion: "Piña (~5.000/unidad)" },
    uva:               { clp_por_unidad_base: 7.0,  unidad_base: "g", descripcion: "Uva (~7.000/kg)" },
    pera:              { clp_por_unidad_base: 900,  unidad_base: "unidad", descripcion: "Pera (~4.500/kg)" },
    kiwi:              { clp_por_unidad_base: 650,  unidad_base: "unidad", descripcion: "Kiwi (~6.500/kg ~10u)" },
    durazno:           { clp_por_unidad_base: 800,  unidad_base: "unidad", descripcion: "Durazno (~4.000/kg ~5u)" },
    higo:              { clp_por_unidad_base: 1200, unidad_base: "unidad", descripcion: "Higos (~9.600/bandeja 8u)" },
    sandia:            { clp_por_unidad_base: 1.8,  unidad_base: "g", descripcion: "Sandía (~1.800/kg)" },
    melon:             { clp_por_unidad_base: 2.5,  unidad_base: "g", descripcion: "Melón (~2.500/kg)" },

    // ═════════ FRUTOS SECOS Y SEMILLAS ═════════
    almendras:         { clp_por_unidad_base: 60.0, unidad_base: "g", descripcion: "Almendras (~12.000/200g)" },
    nueces:            { clp_por_unidad_base: 60.0, unidad_base: "g", descripcion: "Nueces (~12.000/200g)" },
    mani:              { clp_por_unidad_base: 16.0, unidad_base: "g", descripcion: "Maní (~4.000/250g)" },
    pistachos:         { clp_por_unidad_base: 75.0, unidad_base: "g", descripcion: "Pistachos (~15.000/200g)" },
    pinones:           { clp_por_unidad_base: 150,  unidad_base: "g", descripcion: "Piñones (~15.000/100g)" },
    chia:              { clp_por_unidad_base: 32.0, unidad_base: "g", descripcion: "Chía (~6.400/200g)" },
    linaza:            { clp_por_unidad_base: 10.0, unidad_base: "g", descripcion: "Linaza (~5.000/500g)" },
    mantequilla_mani:  { clp_por_unidad_base: 24.0, unidad_base: "g", descripcion: "Mantequilla maní (~8.400/350g)" },
    mantequilla_almendra: { clp_por_unidad_base: 60.0, unidad_base: "g", descripcion: "Mantequilla almendra (~15.000/250g)" },
    pasas:             { clp_por_unidad_base: 18.0, unidad_base: "g", descripcion: "Pasas (~4.500/250g)" },
    arandanos_secos:   { clp_por_unidad_base: 40.0, unidad_base: "g", descripcion: "Arándanos secos (~6.000/150g)" },
    coco_rallado:      { clp_por_unidad_base: 28.0, unidad_base: "g", descripcion: "Coco rallado (~5.600/200g)" },
    datil:             { clp_por_unidad_base: 35.0, unidad_base: "g", descripcion: "Dátiles (~7.000/200g)" },

    // ═════════ ACEITES Y CONDIMENTOS ═════════
    aceite_oliva:      { clp_por_unidad_base: 20.0, unidad_base: "ml", descripcion: "Aceite oliva (~10.000/500ml)" },
    aceite_vegetal:    { clp_por_unidad_base: 4.5,  unidad_base: "ml", descripcion: "Aceite vegetal (~4.500/L)" },
    aceite_sesamo:     { clp_por_unidad_base: 35.0, unidad_base: "ml", descripcion: "Aceite sésamo (~7.000/200ml)" },
    sal:               { clp_por_unidad_base: 1.2,  unidad_base: "g", descripcion: "Sal (~1.200/1kg)" },
    pimienta:          { clp_por_unidad_base: 80.0, unidad_base: "g", descripcion: "Pimienta (~4.000/50g)" },
    comino:            { clp_por_unidad_base: 55.0, unidad_base: "g", descripcion: "Comino (~2.750/50g)" },
    oregano:           { clp_por_unidad_base: 60.0, unidad_base: "g", descripcion: "Orégano (~1.800/30g)" },
    paprika:           { clp_por_unidad_base: 70.0, unidad_base: "g", descripcion: "Paprika (~3.500/50g)" },
    canela:            { clp_por_unidad_base: 70.0, unidad_base: "g", descripcion: "Canela (~3.500/50g)" },
    curry:             { clp_por_unidad_base: 70.0, unidad_base: "g", descripcion: "Curry (~3.500/50g)" },
    miel:              { clp_por_unidad_base: 22.0, unidad_base: "ml", descripcion: "Miel (~11.000/500ml)" },
    azucar:            { clp_por_unidad_base: 2.5,  unidad_base: "g", descripcion: "Azúcar (~2.500/kg)" },
    vinagre:           { clp_por_unidad_base: 4.5,  unidad_base: "ml", descripcion: "Vinagre (~2.250/500ml)" },
    salsa_soya:        { clp_por_unidad_base: 8.0,  unidad_base: "ml", descripcion: "Salsa soya (~4.000/500ml)" },
    mostaza:           { clp_por_unidad_base: 12.0, unidad_base: "g", descripcion: "Mostaza (~3.000/250g)" },
    mayonesa:          { clp_por_unidad_base: 7.0,  unidad_base: "g", descripcion: "Mayonesa (~3.500/500g)" },
    alcaparras:        { clp_por_unidad_base: 55.0, unidad_base: "g", descripcion: "Alcaparras (~5.500/100g)" },
    cafe_instantaneo:  { clp_por_unidad_base: 70.0, unidad_base: "g", descripcion: "Café instantáneo (~14.000/200g)" },

    // ═════════ HIERBAS FRESCAS ═════════
    cilantro:          { clp_por_unidad_base: 45.0, unidad_base: "g", descripcion: "Cilantro (~1.350/manojo 30g)" },
    perejil:           { clp_por_unidad_base: 45.0, unidad_base: "g", descripcion: "Perejil (~1.350/manojo 30g)" },
    albahaca:          { clp_por_unidad_base: 90.0, unidad_base: "g", descripcion: "Albahaca (~2.700/planta 30g)" },
    menta:             { clp_por_unidad_base: 65.0, unidad_base: "g", descripcion: "Menta (~1.950/manojo 30g)" },

    // ═════════ OTROS ═════════
    caldo_verduras:    { clp_por_unidad_base: 2.0,  unidad_base: "ml", descripcion: "Caldo verduras (~2.000/L)" },
    caldo_pollo:       { clp_por_unidad_base: 2.0,  unidad_base: "ml", descripcion: "Caldo pollo (~2.000/L)" },
    salsa_tomate:      { clp_por_unidad_base: 6.5,  unidad_base: "g", descripcion: "Salsa tomate (~1.625/250g)" },
    tahini:            { clp_por_unidad_base: 40.0, unidad_base: "g", descripcion: "Tahini (~10.000/250g)" },
    granola:           { clp_por_unidad_base: 20.0, unidad_base: "g", descripcion: "Granola (~7.000/350g)" },
    galletas_arroz:    { clp_por_unidad_base: 280,  unidad_base: "unidad", descripcion: "Galletas arroz (~5.600/20u)" },
    crackers:          { clp_por_unidad_base: 200,  unidad_base: "unidad", descripcion: "Crackers integrales (~6.000/30u)" },
    gelatina_light:    { clp_por_unidad_base: 1200, unidad_base: "unidad", descripcion: "Gelatina light sobre (~1.200/sobre 8g)" },
    vino_blanco:       { clp_por_unidad_base: 10.0, unidad_base: "ml", descripcion: "Vino blanco (~7.500/750ml)" },
    edamame:           { clp_por_unidad_base: 14.0, unidad_base: "g", descripcion: "Edamame (~7.000/500g)" },
    masa_empanada:     { clp_por_unidad_base: 400,  unidad_base: "unidad", descripcion: "Masa empanada (~4.800/12 discos)" },
    acai:              { clp_por_unidad_base: 35.0, unidad_base: "g", descripcion: "Pulpa açaí (~14.000/400g)" }
  };

  // Cargar overrides del usuario desde localStorage
  let overrides = {};
  try {
    const stored = localStorage.getItem('nutriplan_precios_override');
    if (stored) overrides = JSON.parse(stored);
  } catch (e) {
    console.warn('[Precios CLP] Error cargando overrides:', e);
  }

  // Merge: overrides tienen prioridad
  window.PRECIOS_CLP = { ...PRECIOS_BASE, ...overrides };
  window.PRECIOS_CLP_BASE = PRECIOS_BASE;
  window.PRECIOS_CLP_VERSION = PRECIOS_VERSION;

  // Helper para guardar override
  window.guardarPrecioCLP = function(nombre_normalizado, precio) {
    try {
      const current = JSON.parse(localStorage.getItem('nutriplan_precios_override') || '{}');
      current[nombre_normalizado] = precio;
      localStorage.setItem('nutriplan_precios_override', JSON.stringify(current));
      window.PRECIOS_CLP[nombre_normalizado] = precio;
      return true;
    } catch (e) {
      console.error('[Precios CLP] Error guardando:', e);
      return false;
    }
  };

  window.resetearPreciosCLP = function() {
    localStorage.removeItem('nutriplan_precios_override');
    window.PRECIOS_CLP = { ...PRECIOS_BASE };
  };

  console.log(`[Precios CLP] ${Object.keys(window.PRECIOS_CLP).length} ingredientes cargados (${PRECIOS_VERSION})`);
})();
