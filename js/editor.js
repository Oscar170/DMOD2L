var dmod2l = {
  canvas: null,
  canvasCollision: null,
  ctx: null,
  ctxCollision: null,
  pixSize: 10,
  mode: 'draw',

  boot: function() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext('2d');
    ctx.canvas.width = canvas.offsetWidth;
    ctx.canvas.height = document.getElementById("content").offsetHeight;
    canvasCollision = document.getElementById("collision");
    ctxCollision = canvasCollision.getContext('2d');
    ctxCollision.canvas.width = canvasCollision.offsetWidth;
    ctxCollision.canvas.height = document.getElementById("content").offsetHeight;
    ctxCollision.strokeStyle = 'rgba(85, 85, 85, 0.74)';
    ctxCollision.fillStyle = 'rgba(85, 85, 85, 0.74)';
  },

  drawGrid: function() {
    var canvasGrid = document.getElementById("grid");
    var ctxGrid = canvasGrid.getContext('2d');
    ctxGrid.canvas.width = canvas.offsetWidth;
    ctxGrid.canvas.height = document.getElementById("content").offsetHeight;
    ctxGrid.strokeStyle = '#808080';
    ctxGrid.lineWidth = 1;
    ctxGrid.beginPath();
    for (x = 0; x <= ctxGrid.canvas.width; x += dmod2l.pixSize) {
      for (y = 0; y <= ctxGrid.canvas.height; y += dmod2l.pixSize) {
        ctxGrid.moveTo(x, 0);
        ctxGrid.lineTo(x, ctxGrid.canvas.height);
        ctxGrid.moveTo(0, y);
        ctxGrid.lineTo(ctxGrid.canvas.width, y);
      }
    }
    ctxGrid.closePath();
    ctxGrid.stroke();
  },

  editPixel: function(x, y) {
    if (this.mode == 'draw') this.drawPixel(x, y);
    else if (this.mode == 'clear') this.clearPixel(x, y);
    else this.createCollision(x, y);
  },

  drawPixel: function(x, y) {
    if (model[refToModel[0]] == undefined) model[refToModel[0]] = {};
    if (model[refToModel[0]][refToModel[1]] == undefined) model[refToModel[0]][refToModel[1]] = {};
    model[refToModel[0]][refToModel[1]][x + "," + y] = colores.colorActual;
    ctx.strokeStyle = colores.colorActual;
    ctx.fillStyle = colores.colorActual;
    ctx.beginPath();
    x = x * dmod2l.pixSize;
    y = y * dmod2l.pixSize;
    ctx.fillRect(x, y, dmod2l.pixSize, dmod2l.pixSize);
    ctx.closePath();
    ctx.stroke();
  },

  clearPixel: function(x, y) {
    if (model[refToModel[0]] == undefined) model[refToModel[0]] = {};
    if (model[refToModel[0]][refToModel[1]] == undefined) model[refToModel[0]][refToModel[1]] = {};
    delete model[refToModel[0]][refToModel[1]][x + "," + y];
    ctx.beginPath();
    ctx.clearRect(x * dmod2l.pixSize, y * dmod2l.pixSize, this.pixSize, this.pixSize);
    ctx.closePath();
    ctx.stroke();
  },

  createCollision: function(init, finsh) {
    if (modelCollision[refToModel[0]] == undefined) modelCollision[refToModel[0]] = {};
    if (modelCollision[refToModel[0]][refToModel[1]] == undefined) modelCollision[refToModel[0]][refToModel[1]] = {};
    modelCollision[refToModel[0]][refToModel[1]][init[0] + "," + init[1]] = finsh[0] + "," + finsh[1];
    ctxCollision.beginPath();
    ctxCollision.fillRect(init[0] * dmod2l.pixSize,
      init[1] * dmod2l.pixSize,
      (finsh[0] - init[0] + 1) * dmod2l.pixSize,
      (finsh[1] - init[1] + 1) * dmod2l.pixSize);
    ctxCollision.closePath();
    ctxCollision.stroke();
  },

  loadModel: function(modelFire) {
    console.log(modelFire);
    if (modelFire == undefined) modelFire = [model, modelCollision];
    if (modelFire[0][refToModel[0]] == undefined) modelFire[0][refToModel[0]] = {};
    if (modelFire[0][refToModel[0]][refToModel[1]] == undefined) modelFire[0][refToModel[0]][refToModel[1]] = {};
    if (modelFire[1][refToModel[0]] == undefined) modelFire[1][refToModel[0]] = {};
    if (modelFire[1][refToModel[0]][refToModel[1]] == undefined) modelFire[1][refToModel[0]][refToModel[1]] = {};
    var colorAux = colores.colorActual;
    var splitAux;
    dmod2l.mode = 'draw';
    $.each(modelFire[0][refToModel[0]][refToModel[1]], function(k, v) {
      console.log(k + "," + v);
      colores.colorActual = v;
      splitAux = k.split(",");
      dmod2l.editPixel(splitAux[0], splitAux[1]);
    });
    dmod2l.mode = 'coll';
    $.each(modelFire[1][refToModel[0]][refToModel[1]], function(k, v) {
      splitAux[0] = k.split(",");
      splitAux[1] = v.split(",")
      dmod2l.editPixel(splitAux[0], splitAux[1]);
    });
    dmod2l.mode = 'draw';
    colores.colorActual = colorAux;
  },

  clearAll: function() {
    ctx.beginPath();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.closePath();
    ctx.stroke();
    ctxCollision.beginPath();
    ctxCollision.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctxCollision.closePath();
    ctxCollision.stroke();
  }
}

$(document).ready(function() {
  var mouseMove = false;
  dmod2l.boot();
  dmod2l.drawGrid();
  $('#collision,#canvas').mousedown(function(e) {
    if (edit && (dmod2l.mode == 'draw' || dmod2l.mode == 'clear')) mouseMove = true;
    var rect = this.getBoundingClientRect();
    if (dmod2l.mode == 'coll') auxColl = [Math.floor((e.clientX - rect.left) / dmod2l.pixSize), Math.floor((e.clientY - rect.top) / dmod2l.pixSize)];
    if (edit && (dmod2l.mode == 'draw' || dmod2l.mode == 'clear')) dmod2l.editPixel(Math.floor((e.clientX - rect.left) / dmod2l.pixSize), Math.floor((e.clientY - rect.top) / dmod2l.pixSize));
  });

  $('#collision,#canvas').mousemove(function(e) {
    var rect = this.getBoundingClientRect();
    if (mouseMove) dmod2l.editPixel(Math.floor((e.clientX - rect.left) / dmod2l.pixSize), Math.floor((e.clientY - rect.top) / dmod2l.pixSize));
  });

  $('#collision,#canvas').click(function(e) {
    mouseMove = false;
    var rect = this.getBoundingClientRect();
    if (dmod2l.mode == 'coll') dmod2l.editPixel(auxColl, [Math.floor((e.clientX - rect.left) / dmod2l.pixSize), Math.floor((e.clientY - rect.top) / dmod2l.pixSize)]);
    if (edit && (dmod2l.mode == 'draw' || dmod2l.mode == 'clear')) dmod2l.editPixel(Math.floor((e.clientX - rect.left) / dmod2l.pixSize), Math.floor((e.clientY - rect.top) / dmod2l.pixSize));
  });
});
