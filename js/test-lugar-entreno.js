// Prueba del selector Gimnasio / Speediance. Corre con: node js/test-lugar-entreno.js
var fs = require('fs');
var vm = require('vm');
var path = require('path');

var store = {};
var sandbox = {
  console: console,
  Date: Date,
  Math: Math,
  JSON: JSON,
  Object: Object,
  Array: Array,
  String: String,
  Number: Number,
  parseInt: parseInt,
  localStorage: {
    getItem: function(k) { return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null; },
    setItem: function(k, v) { store[k] = String(v); },
    removeItem: function(k) { delete store[k]; }
  },
  window: {}
};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(__dirname, 'roadmap-data.js'), 'utf8'), sandbox, { filename: 'roadmap-data.js' });

var rd = sandbox.window.NP_RoadmapData;
if (!rd || typeof rd.generarProtocoloDia !== 'function') {
  console.error('NP_RoadmapData no quedó expuesto');
  process.exit(1);
}

var permitidos = {};
rd.nombresSpeediance().forEach(function(n) { permitidos[n] = true; });
var prohibido = /prensa|hack|multipower|mancuerna|femoral|polea cruzada|treadmill|burpee|trx|kettlebell|banda/i;
var tipos = ['A', 'B', 'C', 'D', 'A2', 'B2', 'C2'];
var fallos = [];

function check(cond, msg) {
  if (!cond) fallos.push(msg);
}

tipos.forEach(function(tipo) {
  var p = rd.generarProtocoloDia(tipo, 4, ['peso_corporal'], 'speediance');
  check(p && p.ejercicios && p.ejercicios.length > 0, tipo + ' no devolvió ejercicios');
  if (!p) return;
  p.ejercicios.forEach(function(e) {
    if (!permitidos[e.nombre]) fallos.push(tipo + ' fuera de lista: ' + e.nombre);
    if (!e.accesorio) fallos.push(tipo + ' sin accesorio: ' + e.nombre);
    if (prohibido.test(e.nombre) || prohibido.test(e.accesorio || '')) fallos.push(tipo + ' equipo no disponible: ' + e.nombre);
  });
});

var gym = rd.generarProtocoloDia('A', 4, ['peso_corporal', 'speediance', 'treadmill_plano'], 'gimnasio');
var speed = rd.generarProtocoloDia('A', 4, ['peso_corporal', 'speediance', 'treadmill_plano'], 'speediance');
check(gym && gym.ejercicios[0] && gym.ejercicios[0].nombre === 'Press pecho cables (bajo-arriba)', 'Gimnasio no devolvió el empuje anterior');
check(gym && gym.ejercicios.every(function(e) { return !e.accesorio; }), 'Gimnasio no debería traer accesorio Speediance');
check(speed && speed.ejercicios[0] && speed.ejercicios[0].nombre === 'Press de pecho en polea', 'Empuje Speediance no abre con press de pecho');
check(speed && speed.duracionMin === gym.duracionMin && speed.duracionMin === 50, 'La duración de Empuje cambió');
check(speed && speed.nombre.indexOf('EMPUJE') !== -1, 'El nombre del día Empuje cambió');
check(speed && speed.ejercicios.every(function(e) { return e.nombre !== 'Press pecho cables (bajo-arriba)'; }), 'Se coló un ejercicio de gimnasio en Speediance');

store.nutriplan_perfil = JSON.stringify({ lugarEntreno: 'speediance', nombre: 'Prueba' });
var desdePerfil = rd.generarProtocoloDia('A', 4, ['peso_corporal']);
check(desdePerfil && desdePerfil.ejercicios[0] && desdePerfil.ejercicios[0].nombre === 'Press de pecho en polea', 'Sin argumento, el perfil Speediance no se aplicó');
store.nutriplan_perfil = JSON.stringify({ lugarEntreno: 'gimnasio' });
var desdeGym = rd.generarProtocoloDia('A', 4, ['peso_corporal', 'speediance', 'treadmill_plano']);
check(desdeGym && desdeGym.ejercicios[0] && desdeGym.ejercicios[0].nombre === 'Press pecho cables (bajo-arriba)', 'Sin argumento, el perfil Gimnasio no se aplicó');

if (fallos.length) {
  console.error(fallos.join('\n'));
  process.exit(1);
}

console.log('OK ' + tipos.length + ' días Speediance, gimnasio intacto.');
console.log('Empuje Speediance:');
speed.ejercicios.forEach(function(e) {
  console.log('- ' + e.nombre + ' | ' + e.accesorio + ' | ' + e.sets + '×' + e.reps);
});
