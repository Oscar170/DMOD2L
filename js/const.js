var model = {};
var modelCollision = {};
var auxColl = [];
var edit = false;
var refUser = 'Anonymous';
var refModel = '';
var colores = {colorActual: "#FFFFFF", pilaColores: []};
var ref = new Firebase('https://dmode3l.firebaseio.com/');
var newRef = ref.child(refUser + '/' + refModel);
