var WORLD = { 
  width: 1000,
  height: 500,
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
        x:ranUtil.random(WORLD.width - 100),
        y:ranUtil.random(WORLD.height - 100),
        w:100,
        h:100,
        until:until
      });
    }
  }
};
