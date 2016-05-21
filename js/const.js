var model = {};
var modelCollision = {};
var refToModel = [];
var auxColl = [];
var edit = false;
var refUser = 'Anonymous';
var refModel = '';
var colores = {
  colorActual: "#FFFFFF"
};
var ref = new Firebase('https://dmode3l.firebaseio.com/');
var newRef = ref.child(refUser + '/' + refModel);
