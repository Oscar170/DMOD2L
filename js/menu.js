var CustomMenu = {
  workingData: null,

  getMenuModels: function() {
    newRef.on('value', function(val) {
      CustomMenu.workingData = val.val();
      CustomMenu.genMenuModels();
    }, function(err) {
      console.log(err.code);
    });
  },

  genMenuModels: function() {
    $('#menu').empty();
    $('#menu').append('<div id="new" class="headList">NUEVO MODELO</div>');
    $.each(this.workingData, function(index, value) {
      if (index != 'registrado')
        $('#menu').append('<div id="' + index + '" class="item">' + index + '</div>');
    });

    this.optionsModels();
    $('#new').click(function() {
      edit = true;
      CustomMenu.newModel(true);
    });
  },

  optionsModels: function() {
    $('.item').click(function() {
      CustomMenu.newModel(false, this.id);
      dmod2l.loadModel(CustomMenu.workingData[this.id]);
      edit = true;
    });
  },

  toggleTools: function() {
    $('.button').click(function() {
      if (this.id.contains('cs')) {
        colores.colorActual = $(this).css('backgroundColor');
        $('#button').css('backgroundColor', colores.colorActual);
      }
    });
  },


  newModel: function(n, item) {
    $('#menu').empty();
    $('#menu').append('<div id="back" class="headList" style="text-align: center;">BACK</div>');
    if (refUser != 'Anonymous') {
      $('#menu').append('<div id="Nombre" class="tool">Nombre</div>');
      if(item != null) $('#menu').append('<input type="text" id="toolNombre" style="color: #000000;" value="'+item+'" class="oculto"/>');
      else $('#menu').append('<input type="text" id="toolNombre" style="color: #000000;" value="Some Name" class="oculto"/>');
      $('#Nombre').click(function() {
        if($('#toolNombre').hasClass('oculto')) $('#toolNombre').fadeIn("fast", function() {$('#toolNombre').removeClass('oculto')});
        else $('#toolNombre').fadeOut("fast", function() {$('#toolNombre').addClass('oculto')});
      });
    }
    $('#menu').append('<div id="button" class="button"><input type="color" id="custom-color"/>Pick a color</div>');
    input = document.getElementById("custom-color");
    button = document.getElementById("button");
    input.onchange = function() {
      button.style.backgroundColor = this.value;
      colores.colorActual = this.value;
      colores.pilaColores[5] = colores.pilaColores[4];
      $('#cs6').css('backgroundColor', colores.pilaColores[5]);
      colores.pilaColores[4] = colores.pilaColores[3];
      $('#cs5').css('backgroundColor', colores.pilaColores[4]);
      colores.pilaColores[3] = colores.pilaColores[2];
      $('#cs4').css('backgroundColor', colores.pilaColores[3]);
      colores.pilaColores[2] = colores.pilaColores[1];
      $('#cs3').css('backgroundColor', colores.pilaColores[2]);
      colores.pilaColores[1] = colores.pilaColores[0];
      $('#cs2').css('backgroundColor', colores.pilaColores[1]);
      colores.pilaColores[0] = colores.colorActual;
      $('#cs1').css('backgroundColor', colores.pilaColores[0]);
    }
    $('#menu').append('<div id="cs1" class="buttonColor">Color 1#</div>');
    $('#menu').append('<div id="cs2" class="buttonColor">Color 2#</div>');
    $('#menu').append('<div id="cs3" class="buttonColor">Color 3#</div>');
    $('#menu').append('<div id="cs4" class="buttonColor">Color 4#</div>');
    $('#menu').append('<div id="cs5" class="buttonColor">Color 5#</div>');
    $('#menu').append('<div id="cs6" class="buttonColor">Color 6#</div>');
    $('#menu').append('<div id="clear" class="button">LIMPIAR</div>');
    $('#menu').append('<div id="mode" class="button">CAMBIAR MODO</div>');
    $('#menu').append('<div id="guardar">GUARDAR</div>');
    $('.oculto').fadeOut('fast');
    $('.oculto').prop('data-estado', true);
    this.toggleTools();
    $('#back').click(function() {
      edit = false;
      model = {};
      modelCollision = {};
      dmod2l.clearAll();
      CustomMenu.genMenuModels();
    });
    $('#mode').click(function(){
      if(dmod2l.mode == 'draw') $('#collision').fadeIn('fast', function(){dmod2l.mode = 'coll'});
      else $('#collision').fadeOut('fast', function(){dmod2l.mode = 'draw'});
    });
    $('#guardar').click(function() {
      edit = false;
      dmod2l.clearAll();
      CustomMenu.saveData(n);
    });
  },

  saveData: function(isNew) {
    var data = [model, modelCollision]
    if (refUser != 'Anonymous') newRef.child($('#toolNombre').val()).set(data);
    else {
      if (isNew) newRef.push(data);
      else newRef.child($('#toolNombre').val()).set(data);
    }
  }
}

$(document).ready(function() {
  menu = Object.create(CustomMenu);
  menu.getMenuModels();
});
