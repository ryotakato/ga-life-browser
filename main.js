var main = (function() {

  
  // screen config
  var stage = new PIXI.Stage(0x000000);

  var renderer = PIXI.autoDetectRenderer(WORLD.width, WORLD.height);



  var stoped = false;

  var draw = function(e) {
    e.graphics.clear();
    e.graphics.beginFill(e.color);
    e.graphics.drawShape(e.shape);
    e.graphics.endFill();
    stage.addChild(e.graphics);
  }

  var drawRain = function() {
    _.each(WORLD.rain.fields, function(e) {
      var rain = new PIXI.Graphics();
      rain.beginFill(0x0000FF, 0.5);
      rain.drawRect(e.x, e.y, e.w, e.h);
      rain.endFill();
      stage.addChild(rain);
    });
  }


  WORLD.atmosphere.init();

  var generation = function() {

    WORLD.age++;
    //console.time(WORLD.age);

    // rain turn
    WORLD.rain.turn();
    
    // sweep
    WORLD.sweep();

    // status
    WORLD.status();

    // add plant
    _.times(1, function() {
      if (_.random(0, 100) < 5) {
        WORLD.born(new Animal({x: ranUtil.random(WORLD.width), y: ranUtil.random(WORLD.height), hierarchy: 5, eye: 30, zone:10, energy: 100}));
      } else {
        _.times(Math.ceil(WORLD.energy / 10000), function() {

          var bornSiteIdx = Math.round(ranUtil.random(WORLD.rain.fields.length + 1));
          if (WORLD.rain.fields.length <= bornSiteIdx) {
            WORLD.born(new Plant({x: ranUtil.random(WORLD.width), y: ranUtil.random(WORLD.height)}));
          } else {
            var rainSite = WORLD.rain.fields[bornSiteIdx];
            WORLD.born(new Plant({x: rainSite.x + ranUtil.random(rainSite.w), y: rainSite.y + ranUtil.random(rainSite.h)}));
          }
        });
      }
    });

    // breathe
    _.each(WORLD.elements, function(e) {
      if (e.life.breathe) { e.life.breathe(WORLD.sun.brightness); }
    });
    // search
    _.each(WORLD.elements, function(e) {
      if (e.life.search) { e.life.search(); }
    });
    // settle
    _.each(WORLD.elements, function(e) {
      if (e.life.settle) { e.life.settle(); }
    });
    // walk
    _.each(WORLD.elements, function(e) {
      if (e.life.walk) { e.life.walk(); }
    });
    // eat
    _.each(WORLD.elements, function(e) {
      if (e.life.eat) { e.life.eat(); }
    });
    // starve
    _.each(WORLD.elements, function(e) {
      if (e.life.starve) { e.life.starve(); }
    });
    // couple
    _.each(WORLD.elements, function(e) {
      if (e.life.couple) { e.life.couple(); }
    });
    // mate
    _.each(WORLD.elements, function(e) {
      if (e.life.mate) { e.life.mate(); }
    });


    // draw rain
    drawRain();

    // draw life
    _.each(WORLD.elements, function(e) {
      e.shape.x = e.life.x;
      e.shape.y = e.life.y;

      draw(e);
    });

    //console.timeEnd(WORLD.age);

  }

  var animate = function() {
    if (!stoped) {
      requestAnimFrame(animate);
    }
    
    stage.removeChildren();
    
    generation();
  
    renderer.render(stage);
  }


  return {
    init: function() {
      // init life
      _.times(220, function() {
        WORLD.born(new Plant({x: ranUtil.random(WORLD.width), y: ranUtil.random(WORLD.height)}));
      });
      
      _.times(30, function() {
        WORLD.born(new Animal({x: ranUtil.random(WORLD.width), y: ranUtil.random(WORLD.height), hierarchy: 15, eye: 30, zone:10, energy: 100}));
      });
    
    },

    start: function () {

      var pixiView = document.getElementById("pixiview");
      pixiView.appendChild(renderer.view);

      pixiView.addEventListener('click', function() {
        if (stoped) {
          stoped = false;
          requestAnimFrame(animate);
        } else {
          stoped = true;
        }
      });

      requestAnimFrame(animate);
    
    }
  }

})();






