/* ============================================
   NutriPlan - Generador paramétrico de recetas (Nivel B profesional)
   
   Combina:
   - Proteína (18 opciones con perfil nutricional + cortes)
   - Carbohidrato (12 opciones con método de cocción)
   - Vegetal primario (20 opciones con preparación)
   - Vegetal secundario / guarnición (12 opciones)
   - Técnica culinaria (10 opciones con instrucciones detalladas)
   - Salsa / aderezo (14 opciones con ingredientes)
   - Cocina regional (6 tradiciones: chilena, mediterránea, asiática, mexicana, peruana, italiana)
   
   Total combinaciones posibles: ~2400 recetas únicas
   Cada receta incluye: ingredientes normalizados, instrucciones paso a paso,
   macros calculados, tiempo, costo CLP y metadata para Thermomix.
   ============================================ */

(function cargarGenerador() {

  // ═══════════════════════════════════════════════════════════
  // CATÁLOGOS DE COMPONENTES
  // ═══════════════════════════════════════════════════════════

  const PROTEINAS = {
    pechuga_pollo: {
      display: "Pechuga de pollo", cantidad_g: 150, kcal: 165, p: 31, c: 0, g: 3.6,
      cortes: ["filete", "cubos", "tiritas", "milanesa", "rellena"],
      cocinas_aptas: ["chilena", "mediterranea", "asiatica", "mexicana", "peruana", "italiana"],
      compra: { unidad: "bandejas", factor: 500, desc: "bandeja de 500g" }
    },
    muslos_pollo: {
      display: "Muslos de pollo", cantidad_g: 180, kcal: 215, p: 27, c: 0, g: 11,
      cortes: ["deshuesados", "con hueso", "trozos"],
      cocinas_aptas: ["chilena", "mediterranea", "mexicana", "peruana"],
      compra: { unidad: "bandejas", factor: 1000, desc: "bandeja de 1kg" }
    },
    posta_rosada: {
      display: "Posta rosada", cantidad_g: 150, kcal: 170, p: 28, c: 0, g: 6,
      cortes: ["filete", "cubos", "tiritas"],
      cocinas_aptas: ["chilena", "mediterranea", "mexicana"],
      compra: { unidad: "bandejas", factor: 500, desc: "bandeja de 500g" }
    },
    carne_molida: {
      display: "Carne molida", cantidad_g: 150, kcal: 250, p: 26, c: 0, g: 15,
      cortes: ["molida"],
      cocinas_aptas: ["chilena", "italiana", "mexicana"],
      compra: { unidad: "bandejas", factor: 500, desc: "bandeja de 500g" }
    },
    lomo_vetado: {
      display: "Lomo vetado", cantidad_g: 150, kcal: 280, p: 25, c: 0, g: 20,
      cortes: ["filete", "tiritas", "medallones"],
      cocinas_aptas: ["chilena", "mediterranea", "asiatica"],
      compra: { unidad: "bandejas", factor: 500, desc: "bandeja de 500g" }
    },
    cerdo_magro: {
      display: "Lomo de cerdo", cantidad_g: 150, kcal: 240, p: 25, c: 0, g: 15,
      cortes: ["filete", "medallones", "tiritas"],
      cocinas_aptas: ["chilena", "asiatica", "mexicana"],
      compra: { unidad: "bandejas", factor: 500, desc: "bandeja de 500g" }
    },
    salmon: {
      display: "Salmón", cantidad_g: 150, kcal: 208, p: 20, c: 0, g: 13,
      cortes: ["filete", "lomo", "cubos"],
      cocinas_aptas: ["chilena", "mediterranea", "asiatica", "peruana"],
      compra: { unidad: "filetes", factor: 200, desc: "filete de ~200g" }
    },
    merluza: {
      display: "Merluza", cantidad_g: 150, kcal: 90, p: 18, c: 0, g: 1,
      cortes: ["filete"],
      cocinas_aptas: ["chilena", "mediterranea", "peruana"],
      compra: { unidad: "filetes", factor: 300, desc: "filete ~300g" }
    },
    reineta: {
      display: "Reineta", cantidad_g: 150, kcal: 110, p: 20, c: 0, g: 3,
      cortes: ["filete"],
      cocinas_aptas: ["chilena", "peruana"],
      compra: { unidad: "filetes", factor: 300, desc: "filete ~300g" }
    },
    atun_lata: {
      display: "Atún en lata", cantidad_g: 120, kcal: 130, p: 26, c: 0, g: 3,
      cortes: ["desmenuzado"],
      cocinas_aptas: ["mediterranea", "italiana", "peruana"],
      compra: { unidad: "latas", factor: 160, desc: "lata de 160g" }
    },
    camarones: {
      display: "Camarones", cantidad_g: 150, kcal: 99, p: 24, c: 0.2, g: 0.3,
      cortes: ["enteros", "pelados"],
      cocinas_aptas: ["mediterranea", "asiatica", "peruana", "italiana"],
      compra: { unidad: "bolsas", factor: 500, desc: "bolsa congelada 500g" }
    },
    huevos: {
      display: "Huevos", cantidad_g: 2, kcal: 144, p: 12.6, c: 0.8, g: 10, por_unidad: true,
      cortes: ["revueltos", "poché", "duros", "fritos"],
      cocinas_aptas: ["chilena", "mediterranea", "italiana", "asiatica", "mexicana"],
      compra: { unidad: "docenas", factor: 12, desc: "docena" }
    },
    tofu: {
      display: "Tofu firme", cantidad_g: 180, kcal: 137, p: 14, c: 3.6, g: 9,
      cortes: ["cubos", "tiritas", "filete"],
      cocinas_aptas: ["asiatica", "mediterranea"],
      compra: { unidad: "bloques", factor: 400, desc: "bloque de 400g" }
    },
    lentejas_cocidas: {
      display: "Lentejas cocidas", cantidad_g: 200, kcal: 232, p: 18, c: 40, g: 0.8,
      cortes: ["enteras"],
      cocinas_aptas: ["chilena", "mediterranea", "peruana"],
      compra: { unidad: "paquetes", factor: 500, desc: "paquete secas 500g" }
    },
    garbanzos_cocidos: {
      display: "Garbanzos cocidos", cantidad_g: 200, kcal: 328, p: 18, c: 54, g: 5.2,
      cortes: ["enteros"],
      cocinas_aptas: ["mediterranea", "peruana"],
      compra: { unidad: "paquetes", factor: 500, desc: "paquete secos 500g" }
    },
    porotos_negros: {
      display: "Porotos negros cocidos", cantidad_g: 200, kcal: 264, p: 18, c: 48, g: 1,
      cortes: ["enteros"],
      cocinas_aptas: ["chilena", "mexicana", "peruana"],
      compra: { unidad: "paquetes", factor: 500, desc: "paquete secos 500g" }
    },
    quinoa_cocida: {
      display: "Quinoa cocida", cantidad_g: 180, kcal: 216, p: 8, c: 38, g: 3.4,
      cortes: ["grano"],
      cocinas_aptas: ["chilena", "mediterranea", "peruana"],
      compra: { unidad: "paquetes", factor: 500, desc: "paquete 500g" }
    },
    pavo: {
      display: "Pechuga de pavo", cantidad_g: 150, kcal: 140, p: 30, c: 0, g: 2,
      cortes: ["filete", "cubos", "tiritas"],
      cocinas_aptas: ["chilena", "mediterranea", "italiana"],
      compra: { unidad: "bandejas", factor: 500, desc: "bandeja de 500g" }
    }
  };

  const CARBOHIDRATOS = {
    arroz_blanco: {
      display: "Arroz blanco", cantidad_g: 60, kcal: 222, p: 4.6, c: 49, g: 0.5, // 60g crudo
      metodo: "Hervir en 120 ml de agua con pizca de sal durante 15 min, reposar 5 min tapado",
      metodo_corto: "Arroz hervido (15 min)",
      cocinas_aptas: ["chilena", "asiatica", "mexicana", "peruana", "mediterranea"],
      compra: { unidad: "kg", factor: 1000, desc: "paquete 1kg" }
    },
    arroz_integral: {
      display: "Arroz integral", cantidad_g: 60, kcal: 216, p: 4.5, c: 45, g: 1.7,
      metodo: "Hervir en 150 ml de agua con pizca de sal durante 35 min",
      metodo_corto: "Arroz integral (35 min)",
      cocinas_aptas: ["chilena", "asiatica", "mediterranea"],
      compra: { unidad: "paquetes", factor: 500, desc: "paquete 500g" }
    },
    quinoa: {
      display: "Quinoa", cantidad_g: 60, kcal: 221, p: 8.3, c: 39, g: 3.6,
      metodo: "Lavar bien bajo agua fría, hervir en 120 ml de agua 15 min hasta que absorba el líquido",
      metodo_corto: "Quinoa cocida (15 min)",
      cocinas_aptas: ["peruana", "chilena", "mediterranea"],
      compra: { unidad: "paquetes", factor: 500, desc: "paquete 500g" }
    },
    fideos_integrales: {
      display: "Fideos integrales", cantidad_g: 80, kcal: 280, p: 11, c: 56, g: 2,
      metodo: "Hervir 1 L de agua con sal, cocer pasta 8-10 min al dente, escurrir reservando 50 ml del agua",
      metodo_corto: "Pasta al dente (10 min)",
      cocinas_aptas: ["italiana", "mediterranea"],
      compra: { unidad: "paquetes", factor: 500, desc: "paquete 500g" }
    },
    fideos_arroz: {
      display: "Fideos de arroz", cantidad_g: 80, kcal: 274, p: 5, c: 63, g: 0.6,
      metodo: "Remojar en agua tibia 10 min, enjuagar, saltear 2 min o hervir 3 min",
      metodo_corto: "Fideos de arroz (3-10 min)",
      cocinas_aptas: ["asiatica"],
      compra: { unidad: "paquetes", factor: 400, desc: "paquete 400g" }
    },
    papas: {
      display: "Papas", cantidad_g: 250, kcal: 193, p: 5, c: 43, g: 0.3,
      metodo: "Cortar en cubos de 2 cm, hervir 12 min en agua con sal hasta que pinchen suaves",
      metodo_corto: "Papas hervidas (12 min)",
      cocinas_aptas: ["chilena", "mediterranea", "peruana"],
      compra: { unidad: "kg", factor: 1000, desc: "kg" }
    },
    camote: {
      display: "Camote", cantidad_g: 200, kcal: 172, p: 3.2, c: 40, g: 0.2,
      metodo: "Cortar en cubos de 2 cm, asar al horno a 200°C por 25 min con aceite y sal",
      metodo_corto: "Camote al horno (25 min)",
      cocinas_aptas: ["chilena", "peruana", "mediterranea"],
      compra: { unidad: "kg", factor: 1000, desc: "kg" }
    },
    pan_pita: {
      display: "Pan pita integral", cantidad_g: 1, kcal: 165, p: 5.5, c: 33, g: 1, por_unidad: true,
      metodo: "Calentar 2 min en sartén seca o tostar 1 min",
      metodo_corto: "Pan pita tibio",
      cocinas_aptas: ["mediterranea"],
      compra: { unidad: "paquetes", factor: 6, desc: "paquete 6u" }
    },
    tortillas_maiz: {
      display: "Tortillas de maíz", cantidad_g: 3, kcal: 165, p: 4.2, c: 36, g: 1.8, por_unidad: true,
      metodo: "Calentar en sartén seca 30 seg por lado hasta flexibles",
      metodo_corto: "Tortillas calientes",
      cocinas_aptas: ["mexicana"],
      compra: { unidad: "paquetes", factor: 15, desc: "paquete 15u" }
    },
    cuscus: {
      display: "Cuscús", cantidad_g: 60, kcal: 226, p: 7.6, c: 46, g: 0.4,
      metodo: "Verter sobre 90 ml de agua hirviendo con sal, tapar 5 min, esponjar con tenedor",
      metodo_corto: "Cuscús esponjado (5 min)",
      cocinas_aptas: ["mediterranea"],
      compra: { unidad: "paquetes", factor: 500, desc: "paquete 500g" }
    },
    polenta: {
      display: "Polenta", cantidad_g: 60, kcal: 214, p: 5, c: 46, g: 1,
      metodo: "Verter lluvia sobre 240 ml de caldo hirviendo, batir constante 15 min hasta cremosa",
      metodo_corto: "Polenta cremosa (15 min)",
      cocinas_aptas: ["italiana"],
      compra: { unidad: "paquetes", factor: 500, desc: "paquete 500g" }
    },
    lentejas_carbo: {
      display: "Lentejas como base", cantidad_g: 80, kcal: 276, p: 22, c: 48, g: 0.9,
      metodo: "Hervir 80g de lentejas secas en 400 ml de agua con hoja de laurel 25 min",
      metodo_corto: "Lentejas cocidas (25 min)",
      cocinas_aptas: ["chilena", "mediterranea", "peruana"],
      compra: { unidad: "paquetes", factor: 500, desc: "paquete 500g" }
    }
  };

  const VEGETALES_PRIMARIOS = {
    brocoli: {
      display: "Brócoli", cantidad_g: 150, kcal: 51, p: 4.2, c: 10.5, g: 0.6,
      prep: "Cortar en floretes pequeños, lavar bien",
      coccion: "Hervir 4 min o saltear 5 min al dente",
      compra: { unidad: "unidades", factor: 500, desc: "unidad ~500g" }
    },
    coliflor: {
      display: "Coliflor", cantidad_g: 150, kcal: 38, p: 3, c: 7.5, g: 0.4,
      prep: "Cortar en floretes, lavar",
      coccion: "Hervir 5 min o asar al horno 20 min a 200°C",
      compra: { unidad: "unidades", factor: 600, desc: "unidad ~600g" }
    },
    zapallo_italiano: {
      display: "Zapallo italiano", cantidad_g: 150, kcal: 26, p: 1.8, c: 4.6, g: 0.5,
      prep: "Cortar en medias lunas de 1 cm",
      coccion: "Saltear 6 min a fuego medio-alto",
      compra: { unidad: "unidades", factor: 300, desc: "unidad ~300g" }
    },
    espinaca: {
      display: "Espinaca fresca", cantidad_g: 120, kcal: 28, p: 3.5, c: 4.4, g: 0.5,
      prep: "Lavar y secar bien, cortar los tallos gruesos",
      coccion: "Saltear 2 min o usar cruda",
      compra: { unidad: "bolsas", factor: 300, desc: "bolsa 300g" }
    },
    pimenton_rojo: {
      display: "Pimiento rojo", cantidad_g: 150, kcal: 47, p: 1.5, c: 9, g: 0.5,
      prep: "Retirar semillas y venas, cortar en tiras o cubos",
      coccion: "Saltear 7 min hasta suave",
      compra: { unidad: "unidades", factor: 200, desc: "unidad ~200g" }
    },
    champinones: {
      display: "Champiñones", cantidad_g: 150, kcal: 33, p: 4.7, c: 5, g: 0.5,
      prep: "Limpiar con paño húmedo, cortar en láminas",
      coccion: "Saltear a fuego alto 5 min hasta dorar",
      compra: { unidad: "bandejas", factor: 400, desc: "bandeja 400g" }
    },
    esparragos: {
      display: "Espárragos", cantidad_g: 150, kcal: 30, p: 3.3, c: 5.8, g: 0.2,
      prep: "Quebrar base dura, pelar tallos si son gruesos",
      coccion: "Saltear 5 min o hervir 3 min",
      compra: { unidad: "manojos", factor: 400, desc: "manojo ~400g" }
    },
    berenjena: {
      display: "Berenjena", cantidad_g: 200, kcal: 50, p: 2, c: 12, g: 0.4,
      prep: "Cortar en cubos de 2 cm, salar 15 min, enjuagar",
      coccion: "Asar al horno 20 min o saltear 10 min",
      compra: { unidad: "unidades", factor: 300, desc: "unidad ~300g" }
    },
    porotos_verdes: {
      display: "Porotos verdes", cantidad_g: 150, kcal: 47, p: 2.4, c: 10, g: 0.2,
      prep: "Quitar hebras, cortar en 3 cm",
      coccion: "Hervir 5 min o saltear 7 min",
      compra: { unidad: "bolsas", factor: 500, desc: "bolsa 500g" }
    },
    repollo_chino: {
      display: "Repollo chino (pak choi)", cantidad_g: 150, kcal: 20, p: 2.5, c: 3, g: 0.3,
      prep: "Separar hojas, lavar bien",
      coccion: "Saltear 3 min a fuego alto",
      compra: { unidad: "unidades", factor: 300, desc: "unidad ~300g" }
    },
    choclo: {
      display: "Choclo", cantidad_g: 150, kcal: 144, p: 5.1, c: 31, g: 2,
      prep: "Desgranar si es mazorca, o descongelar si es de bolsa",
      coccion: "Saltear 5 min o hervir 8 min",
      compra: { unidad: "bolsas", factor: 500, desc: "bolsa congelado 500g" }
    },
    kale: {
      display: "Kale", cantidad_g: 100, kcal: 49, p: 4.3, c: 8.8, g: 0.9,
      prep: "Retirar tallos gruesos, cortar en tiras, masajear con limón",
      coccion: "Saltear 3 min o usar crudo en ensalada",
      compra: { unidad: "bolsas", factor: 200, desc: "bolsa 200g" }
    },
    betarraga: {
      display: "Betarraga", cantidad_g: 150, kcal: 65, p: 2.4, c: 15, g: 0.3,
      prep: "Lavar, pelar si es cruda, cortar en cubos",
      coccion: "Asar al horno 40 min a 200°C o usar cruda rallada",
      compra: { unidad: "kg", factor: 1000, desc: "kg" }
    },
    zanahoria: {
      display: "Zanahoria", cantidad_g: 150, kcal: 62, p: 1.4, c: 14, g: 0.4,
      prep: "Pelar y cortar en bastones, cubos o rallar",
      coccion: "Saltear 5 min o asar 20 min al horno",
      compra: { unidad: "kg", factor: 1000, desc: "kg" }
    },
    tomate: {
      display: "Tomate", cantidad_g: 150, kcal: 27, p: 1.3, c: 5.8, g: 0.3,
      prep: "Lavar, cortar en rodajas, cubos o concassé (pelado y sin semillas)",
      coccion: "Saltear 5 min o usar crudo",
      compra: { unidad: "kg", factor: 1000, desc: "kg" }
    },
    rucula: {
      display: "Rúcula", cantidad_g: 60, kcal: 15, p: 1.5, c: 2.2, g: 0.4,
      prep: "Lavar y secar",
      coccion: "Usar cruda, añadir al final si es cocción",
      compra: { unidad: "bolsas", factor: 150, desc: "bolsa 150g" }
    },
    palta: {
      display: "Palta", cantidad_g: 100, kcal: 160, p: 2, c: 8.5, g: 14.7,
      prep: "Pelar y cortar justo antes de servir, rociar con limón",
      coccion: "Usar cruda",
      compra: { unidad: "unidades", factor: 200, desc: "unidad ~200g" }
    },
    cebolla: {
      display: "Cebolla", cantidad_g: 80, kcal: 32, p: 0.9, c: 7.5, g: 0.1,
      prep: "Pelar, cortar en pluma o brunoise",
      coccion: "Sofreír 6 min a fuego medio-bajo hasta translúcida",
      compra: { unidad: "kg", factor: 1000, desc: "kg" }
    },
    cebolla_morada: {
      display: "Cebolla morada", cantidad_g: 80, kcal: 32, p: 0.9, c: 7.5, g: 0.1,
      prep: "Pelar, cortar en pluma fina",
      coccion: "Usar cruda o saltear 3 min",
      compra: { unidad: "kg", factor: 1000, desc: "kg" }
    },
    pepino: {
      display: "Pepino", cantidad_g: 120, kcal: 19, p: 0.8, c: 4.4, g: 0.1,
      prep: "Pelar parcialmente, cortar en cubos o rodajas",
      coccion: "Usar crudo",
      compra: { unidad: "unidades", factor: 200, desc: "unidad ~200g" }
    }
  };

  const GUARNICIONES = {
    limon_rodajas: { display: "Rodajas de limón", cantidad_g: 0.25, unidad: "unidad", kcal: 5, p: 0.1, c: 1.3, g: 0 },
    perejil_picado: { display: "Perejil picado", cantidad_g: 5, kcal: 2, p: 0.2, c: 0.3, g: 0 },
    cilantro_picado: { display: "Cilantro picado", cantidad_g: 5, kcal: 1, p: 0.1, c: 0.2, g: 0 },
    albahaca: { display: "Albahaca fresca", cantidad_g: 5, kcal: 1, p: 0.2, c: 0.1, g: 0 },
    semillas_sesamo: { display: "Semillas de sésamo tostadas", cantidad_g: 5, kcal: 29, p: 0.9, c: 1.2, g: 2.5 },
    pepitas_zapallo: { display: "Pepitas de zapallo", cantidad_g: 10, kcal: 56, p: 3, c: 1.1, g: 4.9 },
    almendras_laminadas: { display: "Almendras laminadas tostadas", cantidad_g: 10, kcal: 58, p: 2.1, c: 2.2, g: 5 },
    queso_parmesano: { display: "Queso parmesano rallado", cantidad_g: 10, kcal: 43, p: 3.8, c: 0.4, g: 2.9 },
    queso_feta: { display: "Queso feta", cantidad_g: 30, kcal: 80, p: 4.3, c: 1.2, g: 6.5 },
    aceitunas_negras: { display: "Aceitunas negras", cantidad_g: 20, kcal: 29, p: 0.2, c: 1.5, g: 2.8 },
    cebollin_picado: { display: "Cebollín picado", cantidad_g: 5, kcal: 2, p: 0.2, c: 0.2, g: 0 },
    menta_fresca: { display: "Menta fresca", cantidad_g: 3, kcal: 1, p: 0.1, c: 0.1, g: 0 }
  };

  const SALSAS = {
    aceite_oliva_limon: {
      display: "Aceite de oliva y limón",
      ingredientes: [
        { id: "aceite_oliva", display: "Aceite de oliva extra virgen", cantidad: 10, unidad: "ml" },
        { id: "limon", display: "Jugo de limón", cantidad: 10, unidad: "ml" }
      ],
      kcal: 88, p: 0, c: 1, g: 10,
      prep: "Mezclar en bowl con sal y pimienta al gusto",
      cocinas_aptas: ["mediterranea", "chilena", "peruana"]
    },
    salsa_tomate_albahaca: {
      display: "Salsa de tomate y albahaca",
      ingredientes: [
        { id: "tomate", display: "Tomate maduro", cantidad: 200, unidad: "g" },
        { id: "ajo", display: "Ajo", cantidad: 0.5, unidad: "unidad" },
        { id: "albahaca", display: "Albahaca fresca", cantidad: 5, unidad: "g" },
        { id: "aceite_oliva", display: "Aceite de oliva", cantidad: 10, unidad: "ml" }
      ],
      kcal: 130, p: 3, c: 13, g: 10,
      prep: "Escaldar tomates, pelar, triturar. Sofreír ajo en aceite 1 min, añadir tomate, cocinar 10 min, añadir albahaca al final",
      cocinas_aptas: ["italiana", "mediterranea"]
    },
    salsa_soya_jengibre: {
      display: "Salsa de soya y jengibre",
      ingredientes: [
        { id: "salsa_soya", display: "Salsa de soya", cantidad: 15, unidad: "ml" },
        { id: "jengibre", display: "Jengibre rallado", cantidad: 5, unidad: "g" },
        { id: "aceite_sesamo", display: "Aceite de sésamo", cantidad: 5, unidad: "ml" },
        { id: "miel", display: "Miel", cantidad: 5, unidad: "ml" }
      ],
      kcal: 95, p: 1, c: 10, g: 5,
      prep: "Mezclar todos los ingredientes en bowl pequeño. Reducir 2 min en sartén si se desea más espesa",
      cocinas_aptas: ["asiatica"]
    },
    chimichurri: {
      display: "Chimichurri",
      ingredientes: [
        { id: "perejil", display: "Perejil picado", cantidad: 15, unidad: "g" },
        { id: "ajo", display: "Ajo", cantidad: 1, unidad: "unidad" },
        { id: "oregano", display: "Orégano", cantidad: 2, unidad: "g" },
        { id: "vinagre", display: "Vinagre de vino", cantidad: 10, unidad: "ml" },
        { id: "aceite_oliva", display: "Aceite de oliva", cantidad: 20, unidad: "ml" }
      ],
      kcal: 180, p: 0.5, c: 2, g: 20,
      prep: "Picar fino perejil y ajo. Mezclar con vinagre, orégano, sal y pimienta. Añadir aceite en hilo batiendo",
      cocinas_aptas: ["chilena"]
    },
    salsa_verde_mexicana: {
      display: "Salsa verde",
      ingredientes: [
        { id: "tomatillo", display: "Tomatillo o tomate verde", cantidad: 150, unidad: "g" },
        { id: "cilantro", display: "Cilantro", cantidad: 10, unidad: "g" },
        { id: "ajo", display: "Ajo", cantidad: 1, unidad: "unidad" },
        { id: "aji_verde", display: "Ají verde", cantidad: 10, unidad: "g" }
      ],
      kcal: 45, p: 1.5, c: 9, g: 0.5,
      prep: "Asar tomatillos y ají 5 min, licuar con ajo y cilantro hasta suave",
      cocinas_aptas: ["mexicana"]
    },
    pesto_albahaca: {
      display: "Pesto de albahaca",
      ingredientes: [
        { id: "albahaca", display: "Albahaca fresca", cantidad: 30, unidad: "g" },
        { id: "pinones", display: "Piñones o nueces", cantidad: 15, unidad: "g" },
        { id: "queso_parmesano", display: "Queso parmesano", cantidad: 20, unidad: "g" },
        { id: "ajo", display: "Ajo", cantidad: 0.5, unidad: "unidad" },
        { id: "aceite_oliva", display: "Aceite de oliva", cantidad: 30, unidad: "ml" }
      ],
      kcal: 390, p: 6, c: 3, g: 40,
      prep: "Triturar albahaca, piñones, ajo y queso. Añadir aceite en hilo hasta emulsionar",
      cocinas_aptas: ["italiana"]
    },
    yogur_pepino: {
      display: "Salsa de yogur y pepino (tzatziki)",
      ingredientes: [
        { id: "yogur_griego", display: "Yogur griego natural", cantidad: 100, unidad: "g" },
        { id: "pepino", display: "Pepino rallado y escurrido", cantidad: 50, unidad: "g" },
        { id: "ajo", display: "Ajo", cantidad: 0.25, unidad: "unidad" },
        { id: "menta", display: "Menta fresca", cantidad: 3, unidad: "g" }
      ],
      kcal: 90, p: 8, c: 6, g: 4,
      prep: "Rallar pepino y escurrir. Mezclar con yogur, ajo machacado y menta picada",
      cocinas_aptas: ["mediterranea"]
    },
    aji_peruano: {
      display: "Ají amarillo licuado",
      ingredientes: [
        { id: "aji_amarillo", display: "Ají amarillo", cantidad: 30, unidad: "g" },
        { id: "aceite_vegetal", display: "Aceite vegetal", cantidad: 10, unidad: "ml" },
        { id: "ajo", display: "Ajo", cantidad: 0.5, unidad: "unidad" }
      ],
      kcal: 105, p: 0.5, c: 4, g: 10,
      prep: "Retirar venas y semillas del ají, licuar con aceite y ajo hasta pasta homogénea",
      cocinas_aptas: ["peruana"]
    },
    mostaza_miel: {
      display: "Mostaza y miel",
      ingredientes: [
        { id: "mostaza_dijon", display: "Mostaza Dijon", cantidad: 10, unidad: "g" },
        { id: "miel", display: "Miel", cantidad: 10, unidad: "ml" },
        { id: "aceite_oliva", display: "Aceite de oliva", cantidad: 5, unidad: "ml" }
      ],
      kcal: 80, p: 0.5, c: 10, g: 5,
      prep: "Batir los tres ingredientes hasta emulsionar",
      cocinas_aptas: ["mediterranea", "chilena"]
    },
    salsa_curry: {
      display: "Salsa de curry y coco",
      ingredientes: [
        { id: "leche_coco", display: "Leche de coco", cantidad: 100, unidad: "ml" },
        { id: "curry_polvo", display: "Curry en polvo", cantidad: 5, unidad: "g" },
        { id: "ajo", display: "Ajo", cantidad: 1, unidad: "unidad" },
        { id: "jengibre", display: "Jengibre", cantidad: 5, unidad: "g" }
      ],
      kcal: 235, p: 2, c: 8, g: 22,
      prep: "Saltear ajo y jengibre 1 min, añadir curry 30 seg, incorporar leche de coco, cocinar 8 min",
      cocinas_aptas: ["asiatica"]
    },
    vinagreta_balsamica: {
      display: "Vinagreta balsámica",
      ingredientes: [
        { id: "vinagre_balsamico", display: "Vinagre balsámico", cantidad: 15, unidad: "ml" },
        { id: "aceite_oliva", display: "Aceite de oliva", cantidad: 30, unidad: "ml" },
        { id: "mostaza_dijon", display: "Mostaza Dijon", cantidad: 5, unidad: "g" }
      ],
      kcal: 285, p: 0.3, c: 3, g: 30,
      prep: "Batir mostaza con vinagre, añadir aceite en hilo emulsionando",
      cocinas_aptas: ["italiana", "mediterranea"]
    }
  };

  // ═══════════════════════════════════════════════════════════
  // TÉCNICAS CULINARIAS
  // ═══════════════════════════════════════════════════════════

  const TECNICAS = {
    salteado_wok: {
      display: "Salteado al wok",
      temp_min: 220, // °C
      tiempo_min: 12,
      cocinas_aptas: ["asiatica"],
      proteinas_aptas: ["pechuga_pollo", "lomo_vetado", "cerdo_magro", "camarones", "tofu"],
      instrucciones: (prot, carbo, veg1, veg2) => [
        `Cortar ${prot.display.toLowerCase()} en tiras finas de 5 mm. Marinar 10 min con 5 ml de salsa de soya y 2 g de maicena.`,
        `Preparar todos los ingredientes antes de cocinar (mise en place): ${veg1.prep.toLowerCase()}; ${veg2 ? veg2.prep.toLowerCase() + ';' : ''} aromáticos picados.`,
        `Calentar wok a fuego máximo hasta que humee. Añadir 10 ml de aceite vegetal.`,
        `Saltear la proteína 3 min moviendo constantemente hasta que selle y dore por fuera. Retirar a plato.`,
        `En el mismo wok añadir 1 diente de ajo picado y 3 g de jengibre rallado. Saltear 20 seg sin quemar.`,
        `Añadir ${veg1.display.toLowerCase()} y saltear 2 min a fuego alto.${veg2 ? ` Incorporar ${veg2.display.toLowerCase()} y cocinar 2 min más.` : ''}`,
        `Regresar la proteína al wok. Añadir la salsa y saltear 1 min hasta que nape todos los ingredientes.`,
        `Servir sobre ${carbo.display.toLowerCase()} cocido. Decorar con guarniciones.`
      ]
    },
    grillado_plancha: {
      display: "A la plancha",
      temp_min: 180,
      tiempo_min: 14,
      cocinas_aptas: ["chilena", "mediterranea", "peruana", "italiana"],
      proteinas_aptas: ["pechuga_pollo", "posta_rosada", "lomo_vetado", "salmon", "merluza", "reineta", "cerdo_magro", "pavo"],
      instrucciones: (prot, carbo, veg1, veg2) => [
        `Sacar ${prot.display.toLowerCase()} de la nevera 20 min antes para temperar. Secar con papel absorbente.`,
        `Sazonar generosamente con sal, pimienta y hierbas aromáticas. Pincelar con 5 ml de aceite de oliva.`,
        `Iniciar ${carbo.display.toLowerCase()}: ${carbo.metodo.toLowerCase()}.`,
        `Preparar vegetales: ${veg1.prep.toLowerCase()}${veg2 ? '; ' + veg2.prep.toLowerCase() : ''}.`,
        `Calentar plancha o sartén grande a fuego alto hasta que humee levemente.`,
        `Sellar la proteína 3-4 min por el primer lado sin moverla hasta marcas doradas. Voltear una sola vez.`,
        `Cocinar 3-4 min del segundo lado. Para carne, temperatura interna 63°C; pollo 74°C; pescado 55-60°C.`,
        `Retirar a plato, cubrir con papel aluminio y reposar 3 min para redistribuir jugos.`,
        `Mientras reposa, saltear ${veg1.display.toLowerCase()} 5 min con sal. ${veg2 ? `Añadir ${veg2.display.toLowerCase()} últimos 3 min.` : ''}`,
        `Emplatar: base de ${carbo.display.toLowerCase()}, vegetales al lado, proteína encima. Napar con la salsa.`
      ]
    },
    horno_asado: {
      display: "Al horno",
      temp_min: 200,
      tiempo_min: 35,
      cocinas_aptas: ["chilena", "mediterranea", "italiana"],
      proteinas_aptas: ["muslos_pollo", "pechuga_pollo", "posta_rosada", "salmon", "lomo_vetado", "cerdo_magro"],
      instrucciones: (prot, carbo, veg1, veg2) => [
        `Precalentar horno a 200°C con rejilla en posición media.`,
        `Sazonar ${prot.display.toLowerCase()} con sal, pimienta, 1 diente de ajo picado y hierbas al gusto. Rociar con 10 ml de aceite.`,
        `Cortar vegetales: ${veg1.prep.toLowerCase()}${veg2 ? '; ' + veg2.prep.toLowerCase() : ''}. Distribuir en bandeja con papel de horno.`,
        `Colocar la proteína sobre los vegetales. Cubrir bandeja con papel aluminio.`,
        `Hornear 20 min tapado para que se cocine al vapor con sus jugos.`,
        `Retirar aluminio, subir temperatura a 220°C y hornear 8-10 min más hasta dorar.`,
        `Mientras tanto, cocinar ${carbo.display.toLowerCase()}: ${carbo.metodo.toLowerCase()}.`,
        `Verificar cocción de la proteína: jugos claros en pollo, interior rosa pálido en cerdo, escamas opacas en pescado.`,
        `Reposar 5 min fuera del horno cubierto. Preparar salsa de acompañamiento.`,
        `Servir con el ${carbo.display.toLowerCase()} y los vegetales de la bandeja. Bañar con sus jugos de cocción.`
      ]
    },
    guiso_estofado: {
      display: "Guiso",
      temp_min: 100,
      tiempo_min: 45,
      cocinas_aptas: ["chilena", "mediterranea", "peruana"],
      proteinas_aptas: ["muslos_pollo", "posta_rosada", "lentejas_cocidas", "porotos_negros", "garbanzos_cocidos"],
      instrucciones: (prot, carbo, veg1, veg2) => [
        `Cortar ${prot.display.toLowerCase()} en trozos de 3 cm. Sazonar con sal y pimienta.`,
        `En olla pesada calentar 15 ml de aceite a fuego medio-alto. Dorar la proteína por todos lados 6 min. Retirar.`,
        `Bajar fuego a medio. Sofreír 1 cebolla picada 6 min hasta translúcida. Añadir 2 dientes de ajo 1 min más.`,
        `Incorporar ${veg1.display.toLowerCase()} cortado (${veg1.prep.toLowerCase()}). Cocinar 5 min.${veg2 ? ` Añadir ${veg2.display.toLowerCase()}.` : ''}`,
        `Añadir 15 g de concentrado de tomate y 5 g de pimentón dulce. Tostar 1 min removiendo.`,
        `Regresar la proteína a la olla. Cubrir con 400 ml de caldo caliente y 1 hoja de laurel.`,
        `Llevar a hervor suave, bajar a fuego lento, tapar y cocinar 30 min.`,
        `Mientras tanto, preparar ${carbo.display.toLowerCase()}: ${carbo.metodo.toLowerCase()}.`,
        `Destapar últimos 10 min para reducir la salsa hasta la consistencia deseada. Rectificar sal.`,
        `Servir sobre el ${carbo.display.toLowerCase()}. Espolvorear perejil picado al emplatar.`
      ]
    },
    sarten_rapido: {
      display: "Salteado clásico",
      temp_min: 180,
      tiempo_min: 20,
      cocinas_aptas: ["italiana", "mediterranea", "chilena"],
      proteinas_aptas: ["pechuga_pollo", "atun_lata", "camarones", "huevos", "tofu", "pavo"],
      instrucciones: (prot, carbo, veg1, veg2) => [
        `Iniciar ${carbo.display.toLowerCase()}: ${carbo.metodo.toLowerCase()}.`,
        `Preparar ${prot.display.toLowerCase()}: ${prot.cortes[0]}. ${prot.por_unidad ? 'Temperar 10 min.' : 'Cortar en cubos de 2 cm y secar con papel.'}`,
        `${veg1.prep}.${veg2 ? ' ' + veg2.prep + '.' : ''}`,
        `En sartén amplia calentar 10 ml de aceite de oliva a fuego medio-alto.`,
        `Saltear ${veg1.display.toLowerCase()} 5 min con una pizca de sal.${veg2 ? ` Añadir ${veg2.display.toLowerCase()} últimos 3 min.` : ''}`,
        `Mover vegetales al borde, añadir la proteína al centro. ${prot.display.includes('Huevos') ? 'Romper huevos y cocinar al gusto (poché, revueltos).' : 'Sellar 3 min por lado hasta dorar.'}`,
        `Integrar todo, añadir 1 diente de ajo picado y hierbas. Saltear 2 min.`,
        `Rectificar sal y pimienta. Apagar fuego.`,
        `Emplatar ${carbo.display.toLowerCase()} en base. Disponer el salteado encima. Terminar con guarniciones.`
      ]
    },
    al_vapor_varoma: {
      display: "Al vapor",
      temp_min: 100,
      tiempo_min: 22,
      cocinas_aptas: ["asiatica", "mediterranea", "chilena"],
      proteinas_aptas: ["salmon", "merluza", "reineta", "pechuga_pollo", "camarones", "tofu"],
      instrucciones: (prot, carbo, veg1, veg2) => [
        `Preparar ${carbo.display.toLowerCase()}: ${carbo.metodo.toLowerCase()}.`,
        `Sazonar ${prot.display.toLowerCase()} con sal, pimienta y 3 g de jengibre rallado. Rociar con 5 ml de aceite.`,
        `Cortar vegetales en tamaño uniforme (1-2 cm): ${veg1.prep.toLowerCase()}${veg2 ? '; ' + veg2.prep.toLowerCase() : ''}.`,
        `Preparar vaporera con agua hasta 2 cm bajo la rejilla. Llevar a hervor.`,
        `Disponer vegetales más duros en la base de la rejilla. Colocar la proteína encima.`,
        `Añadir los vegetales más blandos al final. Tapar y cocinar al vapor sin abrir.`,
        `Tiempos: pescado 10-12 min, pollo 15 min, camarones 6 min, tofu 8 min. Vegetales 5-8 min.`,
        `Verificar cocción: pescado se separa con tenedor; pollo llega a 74°C interno; vegetales al dente.`,
        `Retirar con cuidado. Preparar salsa para acompañar.`,
        `Servir sobre el ${carbo.display.toLowerCase()}. Rociar con salsa y guarniciones frescas.`
      ]
    },
    ensalada_fria: {
      display: "Ensalada tibia",
      temp_min: 0,
      tiempo_min: 20,
      cocinas_aptas: ["mediterranea", "chilena", "italiana", "peruana"],
      proteinas_aptas: ["pechuga_pollo", "atun_lata", "salmon", "huevos", "garbanzos_cocidos", "lentejas_cocidas", "quinoa_cocida", "camarones"],
      instrucciones: (prot, carbo, veg1, veg2) => [
        `Cocinar ${carbo.display.toLowerCase()}: ${carbo.metodo.toLowerCase()}. Enfriar rápidamente bajo agua fría y escurrir.`,
        `Cocinar ${prot.display.toLowerCase()} según método preferido: plancha, vapor u horno 10-15 min.`,
        `${veg1.prep}. Usar crudo en ensaladas.${veg2 ? ' ' + veg2.prep + '.' : ''}`,
        `Preparar la vinagreta: aceite de oliva, vinagre, mostaza Dijon, sal y pimienta. Emulsionar bien.`,
        `En ensaladera grande mezclar ${carbo.display.toLowerCase()}, ${veg1.display.toLowerCase()}${veg2 ? ' y ' + veg2.display.toLowerCase() : ''}.`,
        `Cortar la proteína en láminas o cubos según tipo. Añadir al bowl.`,
        `Rociar con 2/3 de la vinagreta y mezclar con cuidado sin macerar los ingredientes delicados.`,
        `Probar y ajustar sazón. Añadir más vinagreta si es necesario.`,
        `Reposar 5 min para que se integren los sabores. Añadir guarniciones crujientes justo antes de servir.`,
        `Servir a temperatura ambiente en plato hondo.`
      ]
    },
    curry: {
      display: "Curry",
      temp_min: 100,
      tiempo_min: 30,
      cocinas_aptas: ["asiatica"],
      proteinas_aptas: ["pechuga_pollo", "muslos_pollo", "camarones", "tofu", "garbanzos_cocidos"],
      instrucciones: (prot, carbo, veg1, veg2) => [
        `Cortar ${prot.display.toLowerCase()} en cubos de 2 cm. Sazonar con sal y reservar.`,
        `Picar 1 cebolla, 3 dientes de ajo y 10 g de jengibre fresco.`,
        `En olla caliente con 10 ml de aceite, sofreír cebolla 6 min hasta dorar ligeramente.`,
        `Añadir ajo, jengibre y 10 g de pasta de curry (o curry en polvo). Tostar 2 min removiendo para liberar aromas.`,
        `Incorporar la proteína y sellar 4 min por todos lados.`,
        `Añadir ${veg1.display.toLowerCase()} cortado${veg2 ? ' y ' + veg2.display.toLowerCase() : ''}. Mezclar bien.`,
        `Verter 200 ml de leche de coco y 100 ml de caldo. Llevar a hervor suave.`,
        `Bajar fuego, tapar parcialmente y cocinar 15 min hasta que la proteína esté tierna y la salsa espese.`,
        `Mientras tanto preparar ${carbo.display.toLowerCase()}: ${carbo.metodo.toLowerCase()}.`,
        `Rectificar sal. Añadir jugo de 1/2 limón y hojas de cilantro fresco al final. Servir sobre el ${carbo.display.toLowerCase()}.`
      ]
    },
    tacos_fajitas: {
      display: "Tacos o fajitas",
      temp_min: 220,
      tiempo_min: 18,
      cocinas_aptas: ["mexicana"],
      proteinas_aptas: ["pechuga_pollo", "posta_rosada", "carne_molida", "camarones", "porotos_negros"],
      instrucciones: (prot, carbo, veg1, veg2) => [
        `Cortar ${prot.display.toLowerCase()} en tiras finas. Marinar 15 min con 5 g de comino, 5 g de paprika, 1 diente de ajo y jugo de 1/2 limón.`,
        `Cortar vegetales en tiras del mismo tamaño: ${veg1.prep.toLowerCase()}${veg2 ? '; ' + veg2.prep.toLowerCase() : ''}.`,
        `Preparar acompañamientos: palta machacada con limón y sal, cilantro picado, cebolla morada en brunoise.`,
        `Calentar sartén de hierro o plancha a fuego muy alto. Añadir 10 ml de aceite.`,
        `Saltear la proteína 4-5 min hasta dorar con marcas. Retirar a un plato.`,
        `En el mismo sartén saltear vegetales 5 min a fuego alto hasta que caramelicen ligeramente.`,
        `Regresar la proteína al sartén. Integrar 1 min más. Ajustar sal.`,
        `Calentar ${carbo.display.toLowerCase()}: ${carbo.metodo.toLowerCase()}.`,
        `Servir el relleno en fuente. Acompañar con ${carbo.display.toLowerCase()}, palta, cilantro, cebolla y limón.`,
        `Cada comensal arma sus tacos al gusto con la cantidad de cada elemento que prefiera.`
      ]
    },
    sopa_caldo: {
      display: "Sopa",
      temp_min: 100,
      tiempo_min: 35,
      cocinas_aptas: ["chilena", "italiana", "asiatica", "peruana"],
      proteinas_aptas: ["pechuga_pollo", "muslos_pollo", "camarones", "tofu", "huevos", "lentejas_cocidas"],
      instrucciones: (prot, carbo, veg1, veg2) => [
        `Preparar mirepoix: 1 cebolla picada fina, 2 zanahorias en cubos pequeños, 2 tallos de apio en rodajas.`,
        `En olla grande sofreír el mirepoix con 15 ml de aceite a fuego medio 8 min hasta que la cebolla esté translúcida.`,
        `Añadir ${prot.display.toLowerCase()} cortado en trozos pequeños. Sellar 3 min.`,
        `Verter 1.2 L de caldo caliente. Añadir 1 hoja de laurel, sal y pimienta.`,
        `Llevar a hervor, bajar a fuego suave, tapar parcialmente y cocinar 15 min.`,
        `Cortar ${veg1.display.toLowerCase()} (${veg1.prep.toLowerCase()})${veg2 ? ' y ' + veg2.display.toLowerCase() : ''} en tamaño uniforme.`,
        `Añadir los vegetales y el ${carbo.display.toLowerCase()} crudo a la sopa. Cocinar 12 min más hasta que todo esté tierno.`,
        `Rectificar sal y pimienta. Retirar hoja de laurel.`,
        `Si se desea cremosa, triturar parcialmente con mixer dejando algunos trozos.`,
        `Servir en plato hondo. Terminar con perejil fresco, un hilo de aceite de oliva y crotones tostados.`
      ]
    }
  };

  // ═══════════════════════════════════════════════════════════
  // COCINAS REGIONALES (perfiles de especias y contexto)
  // ═══════════════════════════════════════════════════════════

  const COCINAS = {
    chilena: {
      display: "Chilena",
      especias_base: ["oregano", "comino", "pimentón dulce"],
      hierbas: ["cilantro", "perejil"],
      aceite: "aceite vegetal o de oliva"
    },
    mediterranea: {
      display: "Mediterránea",
      especias_base: ["oregano", "romero", "tomillo"],
      hierbas: ["albahaca", "perejil"],
      aceite: "aceite de oliva extra virgen"
    },
    asiatica: {
      display: "Asiática",
      especias_base: ["jengibre", "ajo", "cinco especias"],
      hierbas: ["cilantro", "cebollín"],
      aceite: "aceite de sésamo y vegetal"
    },
    mexicana: {
      display: "Mexicana",
      especias_base: ["comino", "paprika", "chile ancho"],
      hierbas: ["cilantro"],
      aceite: "aceite vegetal"
    },
    peruana: {
      display: "Peruana",
      especias_base: ["ají amarillo", "comino", "ají panca"],
      hierbas: ["cilantro", "huacatay"],
      aceite: "aceite vegetal"
    },
    italiana: {
      display: "Italiana",
      especias_base: ["oregano", "albahaca", "romero"],
      hierbas: ["albahaca", "perejil"],
      aceite: "aceite de oliva extra virgen"
    }
  };

  // ═══════════════════════════════════════════════════════════
  // GENERADOR: ensambla una receta completa
  // ═══════════════════════════════════════════════════════════

  function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function pickRandomKey(obj) { return pickRandom(Object.keys(obj)); }

  function pickCompatible(obj, cocinaId) {
    const keys = Object.keys(obj).filter(k => {
      const item = obj[k];
      if (item.cocinas_aptas) return item.cocinas_aptas.includes(cocinaId);
      return true;
    });
    return keys.length > 0 ? pickRandom(keys) : pickRandomKey(obj);
  }

  function pickProteinaCompatible(tecnicaId, cocinaId) {
    const tecnica = TECNICAS[tecnicaId];
    const candidatos = tecnica.proteinas_aptas.filter(pid => {
      const p = PROTEINAS[pid];
      return p && p.cocinas_aptas.includes(cocinaId);
    });
    if (candidatos.length === 0) return pickRandom(tecnica.proteinas_aptas);
    return pickRandom(candidatos);
  }

  function pickTecnicaCompatible(cocinaId) {
    const candidatos = Object.keys(TECNICAS).filter(tid => TECNICAS[tid].cocinas_aptas.includes(cocinaId));
    if (candidatos.length === 0) return pickRandomKey(TECNICAS);
    return pickRandom(candidatos);
  }

  function generarReceta(opciones) {
    opciones = opciones || {};
    const cocinaId = opciones.cocina || pickRandomKey(COCINAS);
    const cocina = COCINAS[cocinaId];

    const tecnicaId = opciones.tecnica || pickTecnicaCompatible(cocinaId);
    const tecnica = TECNICAS[tecnicaId];

    const proteinaId = opciones.proteina || pickProteinaCompatible(tecnicaId, cocinaId);
    const proteina = PROTEINAS[proteinaId];

    const carboId = opciones.carbohidrato || pickCompatible(CARBOHIDRATOS, cocinaId);
    const carbo = CARBOHIDRATOS[carboId];

    const veg1Id = opciones.vegetal1 || pickRandomKey(VEGETALES_PRIMARIOS);
    const veg1 = VEGETALES_PRIMARIOS[veg1Id];

    // Vegetal secundario opcional (70% de probabilidad)
    const veg2Id = opciones.vegetal2 !== null
      ? (opciones.vegetal2 || (Math.random() < 0.7 ? pickRandomKey(VEGETALES_PRIMARIOS) : null))
      : null;
    const veg2 = veg2Id && veg2Id !== veg1Id ? VEGETALES_PRIMARIOS[veg2Id] : null;

    const salsaId = opciones.salsa || pickCompatible(SALSAS, cocinaId);
    const salsa = SALSAS[salsaId];

    const guarnicionId = opciones.guarnicion || pickRandomKey(GUARNICIONES);
    const guarnicion = GUARNICIONES[guarnicionId];

    // ═══ Construir ingredientes ═══
    const ingredientes = [];
    
    // Proteína
    ingredientes.push({
      nombre: proteina.display,
      nombre_normalizado: proteinaId,
      nombre_display: proteina.display,
      cantidad_base: proteina.cantidad_g,
      unidad: proteina.por_unidad ? "unidades" : "g",
      unidad_compra: proteina.compra.unidad,
      factor_conversion: proteina.compra.factor,
      descripcion_compra: proteina.compra.desc
    });

    // Carbohidrato
    ingredientes.push({
      nombre: carbo.display,
      nombre_normalizado: carboId,
      nombre_display: carbo.display,
      cantidad_base: carbo.cantidad_g,
      unidad: carbo.por_unidad ? "unidades" : "g",
      unidad_compra: carbo.compra.unidad,
      factor_conversion: carbo.compra.factor,
      descripcion_compra: carbo.compra.desc
    });

    // Vegetal 1
    ingredientes.push({
      nombre: veg1.display,
      nombre_normalizado: veg1Id,
      nombre_display: veg1.display,
      cantidad_base: veg1.cantidad_g,
      unidad: "g",
      unidad_compra: veg1.compra.unidad,
      factor_conversion: veg1.compra.factor,
      descripcion_compra: veg1.compra.desc
    });

    // Vegetal 2
    if (veg2) {
      ingredientes.push({
        nombre: veg2.display,
        nombre_normalizado: veg2Id,
        nombre_display: veg2.display,
        cantidad_base: veg2.cantidad_g,
        unidad: "g",
        unidad_compra: veg2.compra.unidad,
        factor_conversion: veg2.compra.factor,
        descripcion_compra: veg2.compra.desc
      });
    }

    // Salsa
    (salsa.ingredientes || []).forEach(ing => {
      ingredientes.push({
        nombre: ing.display,
        nombre_normalizado: ing.id,
        nombre_display: ing.display,
        cantidad_base: ing.cantidad,
        unidad: ing.unidad,
        unidad_compra: "unidades",
        factor_conversion: 1,
        descripcion_compra: "según envase habitual"
      });
    });

    // Guarnición
    ingredientes.push({
      nombre: guarnicion.display,
      nombre_normalizado: guarnicionId,
      nombre_display: guarnicion.display,
      cantidad_base: guarnicion.cantidad_g,
      unidad: guarnicion.unidad || "g",
      unidad_compra: "unidades",
      factor_conversion: 1,
      descripcion_compra: "según envase habitual"
    });

    // Aromáticos comunes (sal, pimienta, ajo)
    ingredientes.push(
      { nombre: "sal marina", nombre_normalizado: "sal", nombre_display: "Sal marina", cantidad_base: 3, unidad: "g", unidad_compra: "paquetes", factor_conversion: 500, descripcion_compra: "paquete 500g" },
      { nombre: "pimienta negra", nombre_normalizado: "pimienta", nombre_display: "Pimienta negra", cantidad_base: 1, unidad: "g", unidad_compra: "frascos", factor_conversion: 50, descripcion_compra: "frasco 50g" },
      { nombre: "ajo", nombre_normalizado: "ajo", nombre_display: "Ajo", cantidad_base: 1, unidad: "unidad", unidad_compra: "cabezas", factor_conversion: 3, descripcion_compra: "cabeza 3u" }
    );

    // ═══ Calcular macros totales ═══
    const calorias = Math.round(proteina.kcal + carbo.kcal + veg1.kcal + (veg2 ? veg2.kcal : 0) + salsa.kcal + guarnicion.kcal);
    const proteinas = Math.round((proteina.p + carbo.p + veg1.p + (veg2 ? veg2.p : 0) + salsa.p + guarnicion.p) * 10) / 10;
    const carbos = Math.round((proteina.c + carbo.c + veg1.c + (veg2 ? veg2.c : 0) + salsa.c + guarnicion.c) * 10) / 10;
    const grasas = Math.round((proteina.g + carbo.g + veg1.g + (veg2 ? veg2.g : 0) + salsa.g + guarnicion.g) * 10) / 10;

    // ═══ Instrucciones ═══
    const instruccionesBase = tecnica.instrucciones(proteina, carbo, veg1, veg2);
    
    // Agregar pasos de salsa y emplatado profesional
    const instruccionesCompletas = [...instruccionesBase];
    instruccionesCompletas.push(`Preparar ${salsa.display.toLowerCase()}: ${salsa.prep}.`);
    instruccionesCompletas.push(`Terminar con ${guarnicion.display.toLowerCase()} espolvoreado encima. Servir inmediatamente en plato previamente tibio.`);

    // ═══ Nombre inteligente ═══
    const titulos = {
      salteado_wok: `${proteina.display} salteado al wok con ${veg1.display.toLowerCase()}`,
      grillado_plancha: `${proteina.display} a la plancha con ${carbo.display.toLowerCase()}`,
      horno_asado: `${proteina.display} al horno con vegetales`,
      guiso_estofado: `Guiso de ${proteina.display.toLowerCase()} con ${veg1.display.toLowerCase()}`,
      sarten_rapido: `${proteina.display} salteado con ${veg1.display.toLowerCase()}`,
      al_vapor_varoma: `${proteina.display} al vapor con ${veg1.display.toLowerCase()}`,
      ensalada_fria: `Ensalada tibia de ${proteina.display.toLowerCase()} y ${carbo.display.toLowerCase()}`,
      curry: `Curry de ${proteina.display.toLowerCase()} con ${veg1.display.toLowerCase()}`,
      tacos_fajitas: `Tacos de ${proteina.display.toLowerCase()} con ${veg1.display.toLowerCase()}`,
      sopa_caldo: `Sopa de ${proteina.display.toLowerCase()} con ${veg1.display.toLowerCase()} y ${carbo.display.toLowerCase()}`
    };
    const nombre = titulos[tecnicaId] || `${proteina.display} con ${carbo.display.toLowerCase()}`;

    // ═══ Tiempo estimado ═══
    const tiempo_prep = 12;
    const tiempo_coccion = tecnica.tiempo_min;
    const tiempo_total = tiempo_prep + tiempo_coccion;

    // ═══ Costo CLP (usando tabla existente) ═══
    let costo = 0;
    if (window.PRECIOS_CLP) {
      ingredientes.forEach(ing => {
        const precio = window.PRECIOS_CLP[ing.nombre_normalizado];
        if (precio) {
          const cant = ing.cantidad_base;
          costo += cant * precio.clp_por_unidad_base;
        }
      });
    }

    // ═══ Determinar restricciones dietéticas ═══
    const ingredientesStr = ingredientes.map(i => i.nombre_normalizado).join(' ');
    const esSinGluten = !ingredientesStr.match(/fideos|pan|cuscus|tortilla.*trigo/);
    const esSinLactosa = !ingredientesStr.match(/leche|yogur|queso|crema|mantequilla/);
    const esVegetariana = !['pechuga_pollo', 'muslos_pollo', 'posta_rosada', 'carne_molida', 'lomo_vetado',
      'cerdo_magro', 'salmon', 'merluza', 'reineta', 'atun_lata', 'camarones', 'pavo'].includes(proteinaId);

    // ═══ Objeto de receta ═══
    const id = `gen_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    
    const receta = {
      id,
      nombre,
      tipo_comida: opciones.tipo_comida || "almuerzo",
      calorias_base: calorias,
      proteinas_g: proteinas,
      carbohidratos_g: carbos,
      grasas_g: grasas,
      es_sin_gluten: esSinGluten,
      es_sin_lactosa: esSinLactosa,
      es_vegetariana: esVegetariana,
      ingredientes,
      instrucciones: instruccionesCompletas,
      instrucciones_thermomix: [],
      tiempo_prep_min: tiempo_prep,
      tiempo_coccion_min: tiempo_coccion,
      tiempo_total_min: tiempo_total,
      costo_clp: Math.round(costo),
      _generada: true,
      _metadata: {
        cocina: cocinaId,
        tecnica: tecnicaId,
        proteina: proteinaId,
        carbohidrato: carboId,
        vegetales: [veg1Id, veg2Id].filter(Boolean),
        salsa: salsaId,
        guarnicion: guarnicionId
      }
    };

    // Generar Thermomix si aplica
    if (typeof window.generarThermomixProfesional === 'function' && (receta.tipo_comida === 'almuerzo' || receta.tipo_comida === 'cena')) {
      try {
        receta.instrucciones_thermomix = window.generarThermomixProfesional(ingredientes, receta.tipo_comida);
      } catch (e) { /* ignore */ }
    }

    return receta;
  }

  // Generar batch de recetas únicas
  function generarBatch(cantidad, filtros) {
    filtros = filtros || {};
    const recetas = [];
    const firmas = new Set();
    let intentos = 0;
    const maxIntentos = cantidad * 5;

    while (recetas.length < cantidad && intentos < maxIntentos) {
      intentos++;
      const r = generarReceta(filtros);
      // Firma única por proteína+carbo+técnica+cocina
      const firma = `${r._metadata.proteina}_${r._metadata.carbohidrato}_${r._metadata.tecnica}_${r._metadata.cocina}`;
      if (!firmas.has(firma)) {
        firmas.add(firma);
        recetas.push(r);
      }
    }
    return recetas;
  }

  // Contar combinaciones posibles
  function contarCombinacionesPosibles() {
    let total = 0;
    Object.keys(COCINAS).forEach(cid => {
      Object.keys(TECNICAS).forEach(tid => {
        const tecnica = TECNICAS[tid];
        if (!tecnica.cocinas_aptas.includes(cid)) return;
        const proteinasValidas = tecnica.proteinas_aptas.filter(pid => PROTEINAS[pid].cocinas_aptas.includes(cid)).length;
        const carbosValidos = Object.keys(CARBOHIDRATOS).filter(k => CARBOHIDRATOS[k].cocinas_aptas.includes(cid)).length;
        total += proteinasValidas * carbosValidos;
      });
    });
    return total * Object.keys(VEGETALES_PRIMARIOS).length;
  }

  // Exponer API
  window.generadorRecetas = {
    generar: generarReceta,
    batch: generarBatch,
    catalogos: {
      proteinas: PROTEINAS,
      carbohidratos: CARBOHIDRATOS,
      vegetales: VEGETALES_PRIMARIOS,
      salsas: SALSAS,
      tecnicas: TECNICAS,
      cocinas: COCINAS,
      guarniciones: GUARNICIONES
    },
    contarCombinaciones: contarCombinacionesPosibles
  };

  const combos = contarCombinacionesPosibles();
  console.log(`[Generador] Catálogo cargado: ${Object.keys(PROTEINAS).length} proteínas, ${Object.keys(CARBOHIDRATOS).length} carbos, ${Object.keys(VEGETALES_PRIMARIOS).length} vegetales, ${Object.keys(TECNICAS).length} técnicas, ${Object.keys(COCINAS).length} cocinas. ~${combos} combinaciones posibles.`);
})();
