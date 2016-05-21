var CustomMenu = {
  workingData: null,
  itemId: null,

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
      CustomMenu.newModel(true);
    });
  },

  optionsModels: function() {
    $('.item').click(function() {
      CustomMenu.itemId = this.id;
      CustomMenu.newModel(false, this.id);
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
      $('#menu').append('<div id="Nombre" class="button">NOMBRE</div>');
      if (item != null) $('#menu').append('<input type="text" id="toolNombre" value="' + item + '" class="oculto"/>');
      else $('#menu').append('<input type="text" id="toolNombre" value="Some Name" class="oculto"/>');
      $('#Nombre').click(function() {
        if ($('#toolNombre').hasClass('oculto')) $('#toolNombre').fadeIn("fast", function() {
          $('#toolNombre').removeClass('oculto')
        });
        else $('#toolNombre').fadeOut("fast", function() {
          $('#toolNombre').addClass('oculto')
        });
      });
    }
    $('#menu').append('<div id="button" class="button"><input type="color" id="custom-color"/>PICK COLOR</div>');
    input = document.getElementById("custom-color");
    button = document.getElementById("button");
    input.onchange = function() {
      button.style.backgroundColor = this.value;
      colores.colorActual = this.value;
    }
    $('#menu').append('<div id="clear" class="button">LIMPIAR PIXEL</div>');
    $('#menu').append('<div id="mode" class="button">CAMBIAR MODO</div>');
    $('#menu').append('<div id="animacion" class="button">ANIMACIONES</div>');

    if (item != null) {
      for (var n = 0; n < CustomMenu.workingData[item][0].length; n++) {
        $('#menu').append('<div id="' + n + '" class="button ocultoAnimacion animation">Animacion ' + n + '</div>');
        for (var l = 0; l < CustomMenu.workingData[item][0][n].length; l++) {
          $('#menu').append('<div id="A' + n + 'S' + l +
            '" class="button ocultoAnimacion bind sprites' +
            n + ' ocultoSprite' + n + '">Sprite ' + l + '</div>');

          $('.bind').unbind();
          $('.bind').click(function() {
            var aux = $(this).attr('id').split('');
            refToModel = [aux[1], aux[3]];
            dmod2l.clearAll();
            dmod2l.loadModel(CustomMenu.workingData[CustomMenu.itemId]);
            edit = true;
          });
        }
        $('#menu').append('<div id="s' + n + '" class="button ocultoAnimacion addSprite ocultoSprite' + n + '">NUEVO SPRITE</div>');

        $('.addSprite').unbind();
        $('.addSprite').click(function() {
          $(this).before('<div id="A' + ($(this).attr('id').split('')[1]) + 'S' +
            $('.sprite' + $(this).attr('id')).size() +
            '" class="button ocultoAnimacion bind sprite' +
            $(this).attr('id') +
            ' ocultoSprite' +
            ($(this).attr('id').split('')[1]) + '">Sprite ' + $('.sprite' + $(this).attr('id')).size() + '</div>');
          $('.bind').unbind();
          $('.bind').click(function() {
            var aux = $(this).attr('id').split('');
            refToModel = [aux[1], aux[3]];
            dmod2l.clearAll();
            dmod2l.loadModel(CustomMenu.workingData[CustomMenu.itemId]);
            edit = true;
          });
        });
      }
    }
    $('#menu').append('<div id="nuevaAnimacion" class="button ocultoAnimacion">NUEVA ANIMACION</div>');

    $('#menu').append('<div id="guardar" class="button">GUARDAR</div>');
    $('.oculto').fadeOut('fast');
    $('.ocultoAnimacion').fadeOut('fast');
    $('.oculto').prop('data-estado', true);

    this.toggleTools();
    $('.animation').unbind();
    $('.animation').click(function() {
      if ($('.ocultoSprite' + $(this).attr('id')).is(':visible')) $('.ocultoSprite' + $(this).attr('id')).fadeOut("fast");
      else $('.ocultoSprite' + $(this).attr('id')).fadeIn("fast");
    });


    $('#back').click(function() {
      CustomMenu.itemId = null;
      refToModel = [];
      edit = false;
      model = {};
      modelCollision = {};
      dmod2l.clearAll();
      CustomMenu.genMenuModels();
      dmod2l.mode = 'draw';
    });

    $('#animacion').click(function() {
      if ($('.ocultoAnimacion').is(':visible')) $('.ocultoAnimacion').fadeOut("fast");
      else $('.ocultoAnimacion').fadeIn("fast");
    });

    $('#nuevaAnimacion').click(function() {
      $(this).before('<div id="' + $('.animation').size() + '" class="button ocultoAnimacion animation">Animacion ' + $('.animation').size() + '</div>');
      $('#' + ($('.animation').size() - 1)).after('<div id="s' + ($('.animation').size() - 1) + '" class="button ocultoAnimacion addSprite ocultoSprite' + ($('.animation').size() - 1) + '">NUEVO SPRITE</div>');
      $('.ocultoSprite' + ($('.animation').size() - 1)).fadeOut('fast');
      $('#animacion').unbind();
      $('#animacion').click(function() {
        if ($('.ocultoAnimacion').is(':visible')) $('.ocultoAnimacion').fadeOut("fast");
        else $('.ocultoAnimacion').fadeIn("fast");
      });
      $('.animation').unbind();
      $('.animation').click(function() {
        if ($('.ocultoSprite' + $(this).attr('id')).is(':visible')) $('.ocultoSprite' + $(this).attr('id')).fadeOut("fast");
        else $('.ocultoSprite' + $(this).attr('id')).fadeIn("fast");
      });
      $('.addSprite').unbind();
      $('.addSprite').click(function() {
        $(this).before('<div id="A' + ($(this).attr('id').split('')[1]) + 'S' +
          $('.sprite' + $(this).attr('id')).size() +
          '" class="button ocultoAnimacion bind sprite' +
          $(this).attr('id') +
          ' ocultoSprite' +
          ($(this).attr('id').split('')[1]) + '">Sprite ' + $('.sprite' + $(this).attr('id')).size() + '</div>');

        $('.bind').unbind();
        $('.bind').click(function() {
          var aux = $(this).attr('id').split('');
          refToModel = [aux[1], aux[3]];
          dmod2l.clearAll();
          dmod2l.loadModel(CustomMenu.workingData[CustomMenu.itemId]);
          edit = true;
        });
      });
    });

    $('#clear').click(function() {
      if (dmod2l.mode == 'draw') dmod2l.mode = 'clear';
      else if (dmod2l.mode == 'coll') $('#collision').fadeOut('fast', function() {
        dmod2l.mode = 'clear'
      });
      else if (dmod2l.mode == 'clear') dmod2l.mode = 'draw';
    });

    $('#mode').click(function() {
      if (dmod2l.mode == 'draw') $('#collision').fadeIn('fast', function() {
        dmod2l.mode = 'coll';
      });
      else if (dmod2l.mode == 'clear') $('#collision').fadeIn('fast', function() {
        dmod2l.mode = 'coll';
      });
      else if (dmod2l.mode == 'coll') $('#collision').fadeOut('fast', function() {
        dmod2l.mode = 'draw';
      });
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
