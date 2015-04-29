
var WORLD = { 
  energy:45000,
  elements: [],
  enemies: function(hierarchy) {
    return _.filter(this.elements, function(e) { return hierarchy + 10 < e.life.hierarchy;});
  },
  feeds: function(hierarchy) {
    return _.filter(this.elements, function(e) { return hierarchy - 50 < e.life.hierarchy && e.life.hierarchy < Math.max(hierarchy - 10, 1);});
  },
  born: function(l) {
    // define color
    var g = 255;
    var r = 128;
    var b = 0;
    r = r + l.hierarchy * 2;
    if (255 < r) {
      g = g - (r - 255);
    }
    var c = colorUtil.rgbToHex(r, g, b);

    this.elements.push({
      life: l,
      graphics: new PIXI.Graphics(),
      shape: new PIXI.Ellipse(l.x, l.y, l.w, l.h),
      color: c
    });
  },

  sweep: function() {
    // remove dead life 
    this.elements = _.filter(this.elements, function(e) { return e.life.alive; });
  },

  status: function(age) {
    document.getElementById("age").innerHTML = age;
    document.getElementById("WORLD_energy").innerHTML = WORLD.energy;
    var count = 0;
    var hierarchy = 0;
    var eye = 0;
    var zone = 0;
    var pace = 0;
    var energy = 0;
    var hierarchyMap = {
      h50:0,
      h40:0,
      h30:0,
      h20:0,
      h10:0,
      h00:0,
      count:function(hierarchy) {
        if (50 <= hierarchy) {
          this.h50++;
        } else if (40 <= hierarchy) {
          this.h40++;
        } else if (30 <= hierarchy) {
          this.h30++;
        } else if (20 <= hierarchy) {
          this.h20++;
        } else if (10 <= hierarchy) {
          this.h10++;
        } else if (0 <= hierarchy) {
          this.h00++;
        }
      }
    };

    // check life
    _.each(this.elements, function(e) {
      if (e.life instanceof Animal) {
        count++;
        energy = Math.max(energy, e.life.energy);
      }
      hierarchy = Math.max(hierarchy, e.life.hierarchy || 0);
      eye = Math.max(eye, e.life.eye || 0);
      zone = Math.max(zone, e.life.zone || 0);
      pace = Math.max(pace, e.life.defaultPace || 0);
      hierarchyMap.count(e.life.hierarchy);
    });
    document.getElementById("count").innerHTML = count;
    document.getElementById("hierarchy").innerHTML = hierarchy;
    document.getElementById("eye").innerHTML = eye;
    document.getElementById("zone").innerHTML = zone;
    document.getElementById("pace").innerHTML = pace;
    document.getElementById("energy").innerHTML = energy;

    document.getElementById("h50").innerHTML = hierarchyMap.h50;
    document.getElementById("h40").innerHTML = hierarchyMap.h40;
    document.getElementById("h30").innerHTML = hierarchyMap.h30;
    document.getElementById("h20").innerHTML = hierarchyMap.h20;
    document.getElementById("h10").innerHTML = hierarchyMap.h10;
    document.getElementById("h00").innerHTML = hierarchyMap.h00;
  },

  width: 1000,
  height: 500,
  rain: {
    fields:[],
    turn:function() {

      _.each(this.fields, function(e) {
        e.until--;
      });

      this.fields = _.filter(this.fields, function(e) { return 0 < e.until;});

      if (ranUtil.random(100) < 1) {
        this.create();
      }
    },
    create:function() {
      var until = ranUtil.random(200, 500);
      this.fields.push({
        x:ranUtil.random(WORLD.width),
        y:ranUtil.random(WORLD.height),
        w:100,
        h:100,
        until:until
      });
    }
  }
};

  // screen config
var stage = new PIXI.Stage(0x000000);

var renderer = PIXI.autoDetectRenderer(WORLD.width, WORLD.height);


var pixiView = document.getElementById("pixiview");
pixiView.appendChild(renderer.view);


// init life
_.times(220, function() {
  WORLD.born(new Plant({x: ranUtil.random(WORLD.width), y: ranUtil.random(WORLD.height)}));
});

_.times(30, function() {
  WORLD.born(new Animal({x: ranUtil.random(WORLD.width), y: ranUtil.random(WORLD.height), hierarchy: 15, eye: 30, zone:10, energy: 100}));
});

var age = 0;
function animate() {
  if (!stoped) {
    requestAnimFrame(animate);
  }
  //graphics.clear();
  stage.removeChildren();
  age++;
  //console.time(age);

  // rain turn
  WORLD.rain.turn();
  
  // sweep
  WORLD.sweep();

  // status
  WORLD.status(age);

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

  //console.timeEnd(age);
  renderer.render(stage);
}

requestAnimFrame(animate);


var stoped = false;
function mouseClicked() {
  if (stoped) {
    stoped = false;
    requestAnimFrame(animate);
  } else {
    stoped = true;
  }
}

pixiView.addEventListener('click', mouseClicked);

function draw(e) {
  e.graphics.clear();
  e.graphics.beginFill(e.color);
  e.graphics.drawShape(e.shape);
  e.graphics.endFill();
  stage.addChild(e.graphics);
}


function drawRain() {

  _.each(WORLD.rain.fields, function(e) {
    var rain = new PIXI.Graphics();
    rain.beginFill(0x0000FF, 0.5);
    rain.drawRect(e.x, e.y, e.w, e.h);
    rain.endFill();
    stage.addChild(rain);
  });

}

