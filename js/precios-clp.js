/* ============================================
   NutriPlan - Precios referenciales CLP
   Santiago de Chile, promedio Jumbo/Líder 2026
   
   Estructura: nombre_normalizado → {
     clp_por_unidad_base: CLP por g/ml/unidad
     unidad_base: "g" | "ml" | "unidad"
     descripcion: texto libre para UI
   }
   
   Los precios se pueden editar desde la pestaña "Precios" en la app.
   Los cambios del usuario se guardan en localStorage["nutriplan_precios_override"].
   ============================================ */

(function cargarPreciosCLP() {
  const PRECIOS_BASE = {
    // ═════════ PROTEÍNAS ═════════
    pechuga_pollo:     { clp_por_unidad_base: 11.0, unidad_base: "g", descripcion: "Pechuga de pollo (~11.000/kg)" },
    pollo_entero:      { clp_por_unidad_base: 6.5,  unidad_base: "g", descripcion: "Pollo entero (~6.500/kg)" },
    carne_molida:      { clp_por_unidad_base: 13.5, unidad_base: "g", descripcion: "Carne molida (~13.500/kg)" },
    posta_rosada:      { clp_por_unidad_base: 16.0, unidad_base: "g", descripcion: "Posta rosada (~16.000/kg)" },
    lomo_vetado:       { clp_por_unidad_base: 22.0, unidad_base: "g", descripcion: "Lomo vetado (~22.000/kg)" },
    cerdo:             { clp_por_unidad_base: 11.0, unidad_base: "g", descripcion: "Cerdo (~11.000/kg)" },
    salmon:            { clp_por_unidad_base: 26.0, unidad_base: "g", descripcion: "Salmón (~26.000/kg)" },
    merluza:           { clp_por_unidad_base: 10.0, unidad_base: "g", descripcion: "Merluza (~10.000/kg)" },
    atun_lata:         { clp_por_unidad_base: 18.0, unidad_base: "g", descripcion: "Atún en lata (~3.200/170g)" },
    camarones:         { clp_por_unidad_base: 28.0, unidad_base: "g", descripcion: "Camarones (~28.000/kg)" },
    huevo:             { clp_por_unidad_base: 380,  unidad_base: "unidad", descripcion: "Huevo (~4.500/docena)" },
    tofu:              { clp_por_unidad_base: 10.0, unidad_base: "g", descripcion: "Tofu (~5.000/500g)" },
    sardina:           { clp_por_unidad_base: 15.0, unidad_base: "g", descripcion: "Sardinas lata (~2.500/170g)" },

    // ═════════ LÁCTEOS ═════════
    leche_descremada:  { clp_por_unidad_base: 1.6,  unidad_base: "ml", descripcion: "Leche descremada (~1.600/L)" },
    leche_entera:      { clp_por_unidad_base: 1.6,  unidad_base: "ml", descripcion: "Leche entera (~1.600/L)" },
    leche_coco:        { clp_por_unidad_base: 5.5,  unidad_base: "ml", descripcion: "Leche de coco (~2.200/400ml lata)" },
    leche_almendra:    { clp_por_unidad_base: 3.5,  unidad_base: "ml", descripcion: "Leche de almendra (~3.500/L)" },
    yogurt_natural:    { clp_por_unidad_base: 3.5,  unidad_base: "g", descripcion: "Yogurt natural (~3.500/kg)" },
    yogurt_griego:     { clp_por_unidad_base: 8.0,  unidad_base: "g", descripcion: "Yogurt griego (~4.000/500g)" },
    queso_mozzarella:  { clp_por_unidad_base: 14.0, unidad_base: "g", descripcion: "Mozzarella (~7.000/500g)" },
    queso_fresco:      { clp_por_unidad_base: 12.0, unidad_base: "g", descripcion: "Quesillo (~6.000/500g)" },
    queso_parmesano:   { clp_por_unidad_base: 35.0, unidad_base: "g", descripcion: "Queso parmesano (~7.000/200g)" },
    queso_cottage:     { clp_por_unidad_base: 10.0, unidad_base: "g", descripcion: "Queso cottage (~4.000/400g)" },
    queso_ricotta:     { clp_por_unidad_base: 14.0, unidad_base: "g", descripcion: "Queso ricotta (~3.500/250g)" },
    mantequilla:       { clp_por_unidad_base: 13.0, unidad_base: "g", descripcion: "Mantequilla (~3.250/250g)" },
    crema_leche:       { clp_por_unidad_base: 5.0,  unidad_base: "ml", descripcion: "Crema (~1.000/200ml)" },

    // ═════════ CARBOHIDRATOS ═════════
    arroz:             { clp_por_unidad_base: 2.2,  unidad_base: "g", descripcion: "Arroz (~2.200/kg)" },
    arroz_integral:    { clp_por_unidad_base: 3.8,  unidad_base: "g", descripcion: "Arroz integral (~3.800/kg)" },
    quinoa:            { clp_por_unidad_base: 13.0, unidad_base: "g", descripcion: "Quinoa (~6.500/500g)" },
    fideos:            { clp_por_unidad_base: 2.6,  unidad_base: "g", descripcion: "Pasta (~1.300/500g)" },
    pan_integral:      { clp_por_unidad_base: 280,  unidad_base: "unidad", descripcion: "Pan integral (~3.400/12u)" },
    pan_pita:          { clp_por_unidad_base: 330,  unidad_base: "unidad", descripcion: "Pan pita (~2.000/6u)" },
    muffin_ingles:     { clp_por_unidad_base: 650,  unidad_base: "unidad", descripcion: "Muffin inglés (~3.900/6u)" },
    tortilla_maiz:     { clp_por_unidad_base: 180,  unidad_base: "unidad", descripcion: "Tortilla de maíz (~2.700/15u)" },
    avena:             { clp_por_unidad_base: 3.2,  unidad_base: "g", descripcion: "Avena (~1.600/500g)" },
    harina_maiz:       { clp_por_unidad_base: 2.8,  unidad_base: "g", descripcion: "Harina de maíz (~2.800/1kg)" },
    papa:              { clp_por_unidad_base: 1.5,  unidad_base: "g", descripcion: "Papa (~1.500/kg)" },
    camote:            { clp_por_unidad_base: 2.8,  unidad_base: "g", descripcion: "Camote (~2.800/kg)" },
    choclo:            { clp_por_unidad_base: 4.5,  unidad_base: "g", descripcion: "Choclo (~2.250/500g congelado)" },

    // ═════════ LEGUMBRES ═════════
    lentejas:          { clp_por_unidad_base: 4.0,  unidad_base: "g", descripcion: "Lentejas (~4.000/kg)" },
    garbanzos:         { clp_por_unidad_base: 5.5,  unidad_base: "g", descripcion: "Garbanzos (~5.500/kg)" },
    porotos:           { clp_por_unidad_base: 4.5,  unidad_base: "g", descripcion: "Porotos (~4.500/kg)" },
    porotos_negros:    { clp_por_unidad_base: 5.0,  unidad_base: "g", descripcion: "Porotos negros (~5.000/kg)" },
    frijoles_negros:   { clp_por_unidad_base: 6.5,  unidad_base: "g", descripcion: "Frijoles negros lata (~2.600/400g)" },

    // ═════════ VEGETALES ═════════
    cebolla:           { clp_por_unidad_base: 1.8,  unidad_base: "g", descripcion: "Cebolla (~1.800/kg)" },
    ajo:               { clp_por_unidad_base: 300,  unidad_base: "unidad", descripcion: "Ajo (~900/cabeza 3 dientes)" },
    tomate:            { clp_por_unidad_base: 2.8,  unidad_base: "g", descripcion: "Tomate (~2.800/kg)" },
    tomate_cherry:     { clp_por_unidad_base: 6.0,  unidad_base: "g", descripcion: "Tomate cherry (~1.500/250g)" },
    zanahoria:         { clp_por_unidad_base: 1.5,  unidad_base: "g", descripcion: "Zanahoria (~1.500/kg)" },
    apio:              { clp_por_unidad_base: 3.0,  unidad_base: "g", descripcion: "Apio (~900/manojo 300g)" },
    pimenton:          { clp_por_unidad_base: 5.0,  unidad_base: "g", descripcion: "Pimentón (~5.000/kg)" },
    zapallo_italiano:  { clp_por_unidad_base: 3.2,  unidad_base: "g", descripcion: "Zapallo italiano (~3.200/kg)" },
    zapallo:           { clp_por_unidad_base: 2.5,  unidad_base: "g", descripcion: "Zapallo (~2.500/kg)" },
    brocoli:           { clp_por_unidad_base: 4.5,  unidad_base: "g", descripcion: "Brócoli (~2.250/unidad 500g)" },
    coliflor:          { clp_por_unidad_base: 3.8,  unidad_base: "g", descripcion: "Coliflor (~2.280/unidad 600g)" },
    espinaca:          { clp_por_unidad_base: 6.0,  unidad_base: "g", descripcion: "Espinaca (~1.800/bolsa 300g)" },
    lechuga:           { clp_por_unidad_base: 4.5,  unidad_base: "g", descripcion: "Lechuga (~1.350/unidad 300g)" },
    pepino:            { clp_por_unidad_base: 2.5,  unidad_base: "g", descripcion: "Pepino (~2.500/kg)" },
    palta:             { clp_por_unidad_base: 1800, unidad_base: "unidad", descripcion: "Palta (~1.800/unidad)" },
    champinones:       { clp_por_unidad_base: 8.0,  unidad_base: "g", descripcion: "Champiñones (~4.000/500g)" },
    betarraga:         { clp_por_unidad_base: 2.8,  unidad_base: "g", descripcion: "Betarraga (~2.800/kg)" },
    repollo:           { clp_por_unidad_base: 2.0,  unidad_base: "g", descripcion: "Repollo (~2.000/kg)" },
    porotos_verdes:    { clp_por_unidad_base: 5.0,  unidad_base: "g", descripcion: "Porotos verdes (~5.000/kg)" },
    berenjena:         { clp_por_unidad_base: 3.5,  unidad_base: "g", descripcion: "Berenjena (~3.500/kg)" },
    kale:              { clp_por_unidad_base: 12.0, unidad_base: "g", descripcion: "Kale (~2.400/bolsa 200g)" },
    puerro:            { clp_por_unidad_base: 4.0,  unidad_base: "g", descripcion: "Puerro (~4.000/kg)" },
    jengibre:          { clp_por_unidad_base: 12.0, unidad_base: "g", descripcion: "Jengibre (~6.000/500g)" },
    bok_choy:          { clp_por_unidad_base: 8.0,  unidad_base: "g", descripcion: "Bok choy (~1.600/unidad 200g)" },
    shiitake:          { clp_por_unidad_base: 25.0, unidad_base: "g", descripcion: "Shiitake (~5.000/200g)" },

    // ═════════ FRUTAS ═════════
    platano:           { clp_por_unidad_base: 500,  unidad_base: "unidad", descripcion: "Plátano (~2.000/kg ~4u)" },
    manzana:           { clp_por_unidad_base: 650,  unidad_base: "unidad", descripcion: "Manzana (~3.200/kg)" },
    naranja:           { clp_por_unidad_base: 500,  unidad_base: "unidad", descripcion: "Naranja (~2.500/kg)" },
    limon:             { clp_por_unidad_base: 250,  unidad_base: "unidad", descripcion: "Limón (~2.500/kg ~10u)" },
    frutilla:          { clp_por_unidad_base: 10.0, unidad_base: "g", descripcion: "Frutillas (~5.000/500g)" },
    arandanos:         { clp_por_unidad_base: 25.0, unidad_base: "g", descripcion: "Arándanos (~5.000/200g)" },
    mango:             { clp_por_unidad_base: 2500, unidad_base: "unidad", descripcion: "Mango (~2.500/unidad)" },
    pina:              { clp_por_unidad_base: 3800, unidad_base: "unidad", descripcion: "Piña (~3.800/unidad)" },
    uva:               { clp_por_unidad_base: 5.5,  unidad_base: "g", descripcion: "Uva (~5.500/kg)" },
    pera:              { clp_por_unidad_base: 700,  unidad_base: "unidad", descripcion: "Pera (~3.500/kg)" },
    kiwi:              { clp_por_unidad_base: 500,  unidad_base: "unidad", descripcion: "Kiwi (~4.500/kg ~10u)" },
    durazno:           { clp_por_unidad_base: 600,  unidad_base: "unidad", descripcion: "Durazno (~3.000/kg ~5u)" },
    higo:              { clp_por_unidad_base: 800,  unidad_base: "unidad", descripcion: "Higos (~6.400/bandeja 8u)" },
    sandia:            { clp_por_unidad_base: 1.2,  unidad_base: "g", descripcion: "Sandía (~1.200/kg)" },
    melon:             { clp_por_unidad_base: 1.8,  unidad_base: "g", descripcion: "Melón (~1.800/kg)" },

    // ═════════ FRUTOS SECOS Y SEMILLAS ═════════
    almendras:         { clp_por_unidad_base: 40.0, unidad_base: "g", descripcion: "Almendras (~8.000/200g)" },
    nueces:            { clp_por_unidad_base: 45.0, unidad_base: "g", descripcion: "Nueces (~9.000/200g)" },
    mani:              { clp_por_unidad_base: 12.0, unidad_base: "g", descripcion: "Maní (~3.000/250g)" },
    pistachos:         { clp_por_unidad_base: 60.0, unidad_base: "g", descripcion: "Pistachos (~12.000/200g)" },
    pinones:           { clp_por_unidad_base: 120, unidad_base: "g", descripcion: "Piñones (~12.000/100g)" },
    chia:              { clp_por_unidad_base: 22.0, unidad_base: "g", descripcion: "Chía (~4.400/200g)" },
    linaza:            { clp_por_unidad_base: 8.0,  unidad_base: "g", descripcion: "Linaza (~4.000/500g)" },
    mantequilla_mani:  { clp_por_unidad_base: 18.0, unidad_base: "g", descripcion: "Mantequilla maní (~6.300/350g)" },
    mantequilla_almendra: { clp_por_unidad_base: 45.0, unidad_base: "g", descripcion: "Mantequilla almendra (~11.000/250g)" },
    pasas:             { clp_por_unidad_base: 14.0, unidad_base: "g", descripcion: "Pasas (~3.500/250g)" },
    arandanos_secos:   { clp_por_unidad_base: 30.0, unidad_base: "g", descripcion: "Arándanos secos (~4.500/150g)" },
    coco_rallado:      { clp_por_unidad_base: 22.0, unidad_base: "g", descripcion: "Coco rallado (~4.400/200g)" },
    datil:             { clp_por_unidad_base: 25.0, unidad_base: "g", descripcion: "Dátiles (~5.000/200g)" },

    // ═════════ ACEITES Y CONDIMENTOS ═════════
    aceite_oliva:      { clp_por_unidad_base: 12.0, unidad_base: "ml", descripcion: "Aceite oliva (~6.000/500ml)" },
    aceite_vegetal:    { clp_por_unidad_base: 3.5,  unidad_base: "ml", descripcion: "Aceite vegetal (~3.500/L)" },
    aceite_sesamo:     { clp_por_unidad_base: 25.0, unidad_base: "ml", descripcion: "Aceite sésamo (~5.000/200ml)" },
    sal:               { clp_por_unidad_base: 1.2,  unidad_base: "g", descripcion: "Sal (~1.200/1kg)" },
    pimienta:          { clp_por_unidad_base: 60.0, unidad_base: "g", descripcion: "Pimienta (~3.000/50g)" },
    comino:            { clp_por_unidad_base: 40.0, unidad_base: "g", descripcion: "Comino (~2.000/50g)" },
    oregano:           { clp_por_unidad_base: 45.0, unidad_base: "g", descripcion: "Orégano (~1.350/30g)" },
    paprika:           { clp_por_unidad_base: 55.0, unidad_base: "g", descripcion: "Paprika (~2.750/50g)" },
    canela:            { clp_por_unidad_base: 55.0, unidad_base: "g", descripcion: "Canela (~2.750/50g)" },
    curry:             { clp_por_unidad_base: 55.0, unidad_base: "g", descripcion: "Curry (~2.750/50g)" },
    miel:              { clp_por_unidad_base: 16.0, unidad_base: "ml", descripcion: "Miel (~8.000/500ml)" },
    azucar:            { clp_por_unidad_base: 2.0,  unidad_base: "g", descripcion: "Azúcar (~2.000/kg)" },
    vinagre:           { clp_por_unidad_base: 3.5,  unidad_base: "ml", descripcion: "Vinagre (~1.750/500ml)" },
    salsa_soya:        { clp_por_unidad_base: 6.5,  unidad_base: "ml", descripcion: "Salsa soya (~3.250/500ml)" },
    mostaza:           { clp_por_unidad_base: 9.0,  unidad_base: "g", descripcion: "Mostaza (~2.250/250g)" },
    mayonesa:          { clp_por_unidad_base: 5.0,  unidad_base: "g", descripcion: "Mayonesa (~2.500/500g)" },
    alcaparras:        { clp_por_unidad_base: 40.0, unidad_base: "g", descripcion: "Alcaparras (~4.000/100g)" },
    cafe_instantaneo:  { clp_por_unidad_base: 55.0, unidad_base: "g", descripcion: "Café instantáneo (~11.000/200g)" },

    // ═════════ HIERBAS FRESCAS ═════════
    cilantro:          { clp_por_unidad_base: 30.0, unidad_base: "g", descripcion: "Cilantro (~900/manojo 30g)" },
    perejil:           { clp_por_unidad_base: 30.0, unidad_base: "g", descripcion: "Perejil (~900/manojo 30g)" },
    albahaca:          { clp_por_unidad_base: 70.0, unidad_base: "g", descripcion: "Albahaca (~2.100/planta 30g)" },
    menta:             { clp_por_unidad_base: 50.0, unidad_base: "g", descripcion: "Menta (~1.500/manojo 30g)" },

    // ═════════ OTROS ═════════
    caldo_verduras:    { clp_por_unidad_base: 1.5,  unidad_base: "ml", descripcion: "Caldo verduras (~1.500/L)" },
    caldo_pollo:       { clp_por_unidad_base: 1.5,  unidad_base: "ml", descripcion: "Caldo pollo (~1.500/L)" },
    salsa_tomate:      { clp_por_unidad_base: 4.5,  unidad_base: "g", descripcion: "Salsa tomate (~1.125/250g)" },
    tahini:            { clp_por_unidad_base: 28.0, unidad_base: "g", descripcion: "Tahini (~7.000/250g)" },
    granola:           { clp_por_unidad_base: 14.0, unidad_base: "g", descripcion: "Granola (~4.900/350g)" },
    galletas_arroz:    { clp_por_unidad_base: 200,  unidad_base: "unidad", descripcion: "Galletas arroz (~4.000/20u)" },
    crackers:          { clp_por_unidad_base: 150,  unidad_base: "unidad", descripcion: "Crackers integrales (~4.500/30u)" },
    gelatina_light:    { clp_por_unidad_base: 1000, unidad_base: "unidad", descripcion: "Gelatina light sobre (~1.000/sobre 8g)" },
    vino_blanco:       { clp_por_unidad_base: 8.0,  unidad_base: "ml", descripcion: "Vino blanco (~6.000/750ml)" },
    edamame:           { clp_por_unidad_base: 10.0, unidad_base: "g", descripcion: "Edamame (~5.000/500g)" },
    masa_empanada:     { clp_por_unidad_base: 300,  unidad_base: "unidad", descripcion: "Masa empanada (~3.600/12 discos)" },
    acai:              { clp_por_unidad_base: 25.0, unidad_base: "g", descripcion: "Pulpa açaí (~10.000/400g)" }
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

  console.log(`[Precios CLP] ${Object.keys(window.PRECIOS_CLP).length} ingredientes cargados`);
})();
