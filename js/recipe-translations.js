/* ============================================
   NutriPlan - Recipe name translations (ES → EN)
   Maps recipe ID → colloquial English name.
   Used by getNombreReceta() in app-bundle.js.
   ============================================ */

/* global window */

var RECIPE_NAMES_EN = {
  // ── Desayunos (recipes.js d1-d16) ──────────────────────────────
  d1:  'Oatmeal with banana and peanut butter',
  d2:  'Scrambled eggs with avocado and arepa',
  d3:  'Tropical mango chia smoothie',
  d4:  'Sweet potato toast with poached egg',
  d5:  'Blueberry oatmeal pancakes',
  d6:  'French toast with fresh fruit',
  d7:  'Yogurt bowl with granola and fruit',
  d8:  'Cheese and bean stuffed arepa',
  d9:  'Spanish potato omelette',
  d10: 'Whole wheat banana waffles with honey',
  d11: 'Green chilaquiles with egg',
  d12: 'Coconut mango overnight oats',
  d13: 'Baked cheese empanadas',
  d14: 'Oat and banana protein shake',
  d15: 'Egg tacos with salsa',
  d16: 'Oatmeal chocolate chip cookies',

  // ── Snacks AM (recipes.js sa1-sa16) ────────────────────────────
  sa1:  'Trail mix with nuts and dried fruit',
  sa2:  'Greek yogurt with granola and strawberries',
  sa3:  'Hummus with carrot and cucumber sticks',
  sa4:  'Banana with peanut butter',
  sa5:  'Rice cake with avocado and tomato',
  sa6:  'Green spinach and apple smoothie',
  sa7:  'Hard-boiled egg with salt and pepper',
  sa8:  'Fresh cheese with honey and walnuts',
  sa9:  'Whole grain avocado toast with seeds',
  sa10: 'Mango pineapple smoothie',
  sa11: 'Plain yogurt with blueberries and chia',
  sa12: 'Turkey ham and cheese roll-ups',
  sa13: 'Coconut milk chia pudding',
  sa14: 'Cucumber slices with lime and tajín',
  sa15: 'Cinnamon apple compote',
  sa16: 'Carrot sticks with hummus',

  // ── Almuerzos (recipes.js a1-a16) ──────────────────────────────
  a1:  'Baked chicken with brown rice and fresh salad',
  a2:  'Black beans with rice, sweet plantain and ground beef',
  a3:  'Pan-seared salmon with quinoa and roasted veggies',
  a4:  'Braised lentils with rice and salad',
  a5:  'Chicken tacos with guacamole and pico de gallo',
  a6:  'Quinoa bowl with black beans and corn',
  a7:  'Pasta with homemade bolognese sauce',
  a8:  'Arroz con pollo with sautéed veggies',
  a9:  'Beef stew with potatoes and veggies',
  a10: 'Homemade burger with salad',
  a11: 'Chicken curry with basmati rice',
  a12: 'Caesar salad with grilled chicken',
  a13: 'Chili con carne with rice',
  a14: 'Spinach and cheese stuffed chicken breast',
  a15: 'Garlic shrimp rice bowl',
  a16: 'Vegetarian burrito bowl with beans and rice',

  // ── Snacks PM (recipes.js sp1-sp16) ────────────────────────────
  sp1:  'Celery sticks with almond butter',
  sp2:  'Chocolate banana protein shake',
  sp3:  'Coconut oat energy balls',
  sp4:  'Apple slices with cinnamon yogurt',
  sp5:  'Rice cakes with cream cheese and cucumber',
  sp6:  'Fruit salad with lime and chili',
  sp7:  'Edamame with sea salt',
  sp8:  'Homemade granola bars',
  sp9:  'Peanut butter stuffed dates',
  sp10: 'Sugar-free fruit jello',
  sp11: 'Homemade popcorn',
  sp12: 'Baked plantain chips',
  sp13: 'Oat and banana pudding',
  sp14: 'Cheese bites with grapes',
  sp15: 'Strawberry banana smoothie',
  sp16: 'Mini cucumber cream cheese sandwich',

  // ── Cenas (recipes.js c1-c16) ───────────────────────────────────
  c1:  'Pumpkin soup with pumpkin seeds',
  c2:  'Warm tuna salad with potato and egg',
  c3:  'Whole wheat chicken wrap with sautéed veggies',
  c4:  'Chicken noodle soup with veggies',
  c5:  'Spanish potato and onion omelette',
  c6:  'Herb chicken breast with sweet potato mash',
  c7:  'Baked salmon with broccoli and rice',
  c8:  'Mushroom and cheese omelette with green salad',
  c9:  'Pasta with basil pesto and cherry tomatoes',
  c10: 'Fish tacos with slaw and salsa',
  c11: 'Mushroom risotto',
  c12: 'Warm chickpea and roasted veggie salad',
  c13: 'Lentil and veggie soup',
  c14: 'Turkey breast with mashed potatoes and green beans',
  c15: 'Tofu and veggie stir-fry with rice',
  c16: 'Chicken quesadillas with guacamole',

  // ── Desayunos extra (recipes-extra.js d17-d32) ─────────────────
  d17: 'Cinnamon banana French toast',
  d18: 'Açaí bowl with banana and granola',
  d19: 'Light Spanish omelette with spinach',
  d20: 'Apple walnut quinoa porridge',
  d21: 'Scrambled egg and spinach wrap',
  d22: 'English muffin with avocado and poached egg',
  d23: 'Mixed berry protein shake',
  d24: 'Egg and cheese stuffed arepa',
  d25: 'Yogurt with homemade apple compote',
  d26: 'Bean breakfast burrito',
  d27: 'Ricotta toast with figs and honey',
  d28: 'Whole wheat crêpes with banana and chocolate',
  d29: 'Single-serve shakshuka with pita',
  d30: 'Homemade granola with yogurt and peaches',
  d31: 'Broken eggs with ham and toast',
  d32: 'Tropical fruit chia pudding',

  // ── Snacks AM extra (recipes-extra.js sa17-sa32) ───────────────
  sa17: 'Steamed edamame with sea salt',
  sa18: 'Apple slices with almond butter',
  sa19: 'Cottage cheese with pineapple',
  sa20: 'Homemade oat and date bar',
  sa21: 'Cucumber stuffed with hummus',
  sa22: 'Green detox smoothie',
  sa23: 'Rice cakes with cream cheese and smoked salmon',
  sa24: 'Hard-boiled eggs with avocado',
  sa25: 'Banana spinach smoothie',
  sa26: 'Sugar-free jello with yogurt',
  sa27: 'Whole grain crackers with tuna',
  sa28: 'Fruit bowl with yogurt and chia',
  sa29: 'Celery sticks with cream cheese',
  sa30: 'Turkey and cheese mini sandwich',
  sa31: 'Mango with chili and lime',
  sa32: 'Coffee cacao protein yogurt',

  // ── Almuerzos extra (recipes-extra.js a17-a32) ─────────────────
  a17: 'Chicken teriyaki with jasmine rice',
  a18: 'Garlic hake with smashed potatoes',
  a19: 'Grilled chicken with quinoa and veggies',
  a20: 'Vegetable and ricotta lasagna',
  a21: 'Mediterranean chicken and falafel bowl',
  a22: 'Beef and veggie stew',
  a23: 'Chicken pasta primavera',
  a24: 'Stuffed peppers with beef and rice',
  a25: 'Chickpea curry with basmati rice',
  a26: 'Beef and veggie noodle wok',
  a27: 'Warm quinoa and shrimp salad',
  a28: 'Rosemary turkey with sweet potato mash',
  a29: 'Eggplant and beef moussaka',
  a30: 'Salmon poke bowl',
  a31: 'Lemon chicken with veggie rice',
  a32: 'Beef fajitas with corn tortillas',

  // ── Snacks PM extra (recipes-extra.js sp17-sp32) ───────────────
  sp17: 'Hard-boiled eggs with celery salt',
  sp18: 'Yogurt dip with cucumber and veggie sticks',
  sp19: 'Dark chocolate with almonds',
  sp20: 'Watermelon with mint and lime',
  sp21: 'Cottage cheese with tomato and basil',
  sp22: 'Chocolate chia pudding',
  sp23: 'Sardine spread toast',
  sp24: 'Fruit salad with yogurt',
  sp25: 'Whole wheat mini pizzas',
  sp26: 'Spiced crispy chickpeas',
  sp27: 'Mixed berry smoothie',
  sp28: 'Turkey and cheese roll-ups',
  sp29: 'Homemade spiced popcorn',
  sp30: 'Tuna lettuce wraps',
  sp31: 'Baked pear with walnuts and cinnamon',
  sp32: 'Egg white and spinach omelette',

  // ── Cenas extra (recipes-extra.js c17-c32) ─────────────────────
  c17: 'Ginger butternut squash soup',
  c18: 'Baked salmon with asparagus',
  c19: 'Cream of mushroom soup with toast',
  c20: 'Warm chicken and avocado salad',
  c21: 'Steamed fish with Asian veggies',
  c22: 'Veggie and cheese frittata',
  c23: 'Thai shrimp curry',
  c24: 'Coconut curry chicken with cauliflower',
  c25: 'Baked eggplant gratin with tomato',
  c26: 'Lentil burgers with salad',
  c27: 'Wild mushroom risotto with parmesan',
  c28: 'Herb-roasted chicken with sweet potatoes',
  c29: 'Fish ceviche with sweet potato',
  c30: 'Potato omelette with green salad',
  c31: 'Turkey and veggie wrap',
  c32: 'Minestrone soup with bread',
};

/**
 * Returns the display name for a recipe object, respecting the current UI language.
 * Falls back to the Spanish nombre if no English translation is available.
 * Handles "Sobras: ..." prefix → "Leftovers: ..."
 * Safe to call with null/undefined.
 *
 * @param {object|null} receta
 * @returns {string}
 */
function getNombreReceta(receta) {
  if (!receta) return '';
  var nombre = receta.nombre || '';
  var lang = window._NP_lang || 'es';
  if (lang !== 'en') return nombre;

  // Handle "Sobras: <nombre original>" — translate prefix + base name
  if (nombre.startsWith('Sobras: ')) {
    var baseEn = (receta.id && RECIPE_NAMES_EN[receta.id])
      ? RECIPE_NAMES_EN[receta.id]
      : nombre.replace(/^Sobras: /, '');
    return 'Leftovers: ' + baseEn;
  }

  return (receta.id && RECIPE_NAMES_EN[receta.id]) ? RECIPE_NAMES_EN[receta.id] : nombre;
}
