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

  drawPixel: function(x, y) {
    if (this.mode == 'draw') {
      model[x + "," + y] = colores.colorActual;
      ctx.strokeStyle = colores.colorActual;
      ctx.fillStyle = colores.colorActual;
      ctx.beginPath();
      x = x * dmod2l.pixSize;
      y = y * dmod2l.pixSize;
      ctx.fillRect(x, y, dmod2l.pixSize, dmod2l.pixSize);
      ctx.closePath();
      ctx.stroke();
    } else {
      modelCollision[x[0] + "," + x[1]] = y[0] + "," + y[1];
      console.log(modelCollision);
      ctxCollision.beginPath();
      ctxCollision.fillRect(x[0] * dmod2l.pixSize,
        x[1] * dmod2l.pixSize,
        (y[0] - x[0] + 1) * dmod2l.pixSize,
        (y[1] - x[1] + 1) * dmod2l.pixSize);
      ctxCollision.closePath();
      ctxCollision.stroke();
    }
  },

  loadModel: function(modelFire) {
    var colorAux = colores.colorActual;
    var splitAux;
    $.each(modelFire[0], function(k, v) {
      colores.colorActual = v;
      splitAux = k.split(",");
      dmod2l.drawPixel(splitAux[0], splitAux[1]);
    });
    dmod2l.mode = 'coll';
    $.each(modelFire[1], function(k, v) {
      splitAux[0] = k.split(",");
      splitAux[1] = v.split(",")
      dmod2l.drawPixel(splitAux[0], splitAux[1]);
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
    if (edit && dmod2l.mode == 'draw') mouseMove = true;
    var rect = this.getBoundingClientRect();
    if (dmod2l.mode == 'coll') auxColl = [Math.floor((e.clientX - rect.left) / dmod2l.pixSize), Math.floor((e.clientY - rect.top) / dmod2l.pixSize)];
    if (edit && dmod2l.mode == 'draw') dmod2l.drawPixel(Math.floor((e.clientX - rect.left) / dmod2l.pixSize), Math.floor((e.clientY - rect.top) / dmod2l.pixSize));
  });

  $('#collision,#canvas').mousemove(function(e) {
    var rect = this.getBoundingClientRect();
    if (mouseMove) dmod2l.drawPixel(Math.floor((e.clientX - rect.left) / dmod2l.pixSize), Math.floor((e.clientY - rect.top) / dmod2l.pixSize));
  });

  $('#collision,#canvas').click(function(e) {
    mouseMove = false;
    var rect = this.getBoundingClientRect();
    if (dmod2l.mode == 'coll') dmod2l.drawPixel(auxColl, [Math.floor((e.clientX - rect.left) / dmod2l.pixSize), Math.floor((e.clientY - rect.top) / dmod2l.pixSize)]);
    if (edit && dmod2l.mode == 'draw') dmod2l.drawPixel(Math.floor((e.clientX - rect.left) / dmod2l.pixSize), Math.floor((e.clientY - rect.top) / dmod2l.pixSize));
  });
});
