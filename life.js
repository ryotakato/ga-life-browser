
var Life = function() {

  this.x = 0;
  this.y = 0;
  this.w = 5;
  this.h = 5;
  this.hierarchy = 0;
  this.alive = true;
  this.energy = 0;

  this.die = function() {
    this.alive = false;
  }


  this.init.apply(this, arguments);
}

var Plant = Life.extend({
  init: function(args) {
    _.extend(this, args);
    this.energy = 100;
  }
});


var Animal = Life.extend({

  init: function(args) {
    _.extend(this, args);
    if (!this.defaultPace) this.defaultPace = _.random(1, 5);
  
    this.xp = new Point(this.defaultPace, -1);
    this.yp = new Point(this.defaultPace, -1);
  },


  // starve
  starve: function() {
    if (this.energy <= 0) {
      this.die();
      WORLD.born(new Plant({x: this.x, y: this.y}));
    }
  },

  // energy gain
  gain: function(ene) {
    this.energy += ene;
  },

  makeRange: function (limit) {
    var xl = this.x - limit;
    var xu = this.x + limit;
    var yl = this.y - limit;
    var yu = this.y + limit;
    return function(l) { 
      return xl < l.x && l.x < xu && yl < l.y && l.y < yu;
    }
  },

  // walk
  walk: function() {
    var move = function(before, upper, p) {
      var after = before + p.amount();
      if (after < 0) {
        after += upper;
      } else if (upper < after) {
        after -= upper;
      }
      return after;
    }

    this.x = move(this.x, WIDTH, this.xp);
    this.y = move(this.y, HEIGHT, this.yp);
    this.gain(-1 * Math.ceil(this.defaultPace / 5));
  },

  // search
  search: function() {
    var isSeeable = this.makeRange(this.eye);

    var has = function(life) {
      return life && life.alive && isSeeable(life);
    }

    // search prey
    if (!has(this.prey)) {
      var preyElement = _.find(WORLD.feeds(this.hierarchy), function(it) {
        return isSeeable(it.life);
      });
      if (preyElement) {
        this.prey = preyElement.life;
      }
    }

    // search predator
    if (!has(this.predator)) {
      var predatorElement = _.find(WORLD.enemies(this.hierarchy), function(it) {
        return isSeeable(it.life);
      });
      if (predatorElement) {
        this.predator = predatorElement.life;
      }
    }
  },

  // settle
  settle: function() {
  
    this.xp.pace = this.defaultPace;
    this.yp.pace = this.defaultPace;

    if (this.prey == null && this.predator == null) {
      this.xp.reverse(_.random(0, 1000) < 1); // 0.1%
      this.yp.reverse(_.random(0, 1000) < 1); // 0.1%
      return;
    }

    if (this.predator != null) {
      this.runAway(this.predator.x - this.x, this.xp);
      this.runAway(this.predator.y - this.y, this.yp);
      return;
    }

    if (this.prey != null) {
      this.chase(this.prey.x - this.x, this.xp);
      this.chase(this.prey.y - this.y, this.yp);
      return;
    }
  },

  runAway: function(diff, p) {
    // if diff sign equal  p.direction sign, change direction
    p.reverse(0 <= p.direction * diff);
  },

  chase: function(diff, p) {
    // if diff sign is minus or p.direction sign is minus, change direction
    p.reverse(p.direction * diff <= 0);
    // chose min diff abs, p.pace
    //p.pace = Math.min(Math.abs(diff), p.pace);
  },

  eat: function() {
    if (this.prey == null) {
      return;
    }
    var isEatable = this.makeRange(this.zone);
    if (isEatable(this.prey)) {
      this.prey.die();
      this.gain(Math.floor(this.prey.energy / 10));
      this.prey = null;
    }
  },

  // couple
  couple: function() {

    if (this.energy < 100) {
      return;
    }

    var isMarriageable = this.makeRange(this.zone);

    var has = function(life) {
      return life && life.alive;
    }

    // search partner
    if (!has(this.partner)) {
      var self = this;
      var partnerElement = _.find(WORLD.elements, function(e) {
        var it = e.life;
        return it instanceof Animal && it !== self  && self.hierarchy - 10 <= it.hierarchy && it.hierarchy <= self.hierarchy + 10 && isMarriageable(it);
      });
      if (partnerElement) {
        this.partner = partnerElement.life;
        this.partner.partner = this;
      }
    }

  },

  // mate
  mate: function() {
    if (this.partner && this.partner.partner === this) {
      if (100 < this.energy && 100 < this.partner.energy) {

        // born
        var baby = new Animal({
          x: (this.x + this.partner.x) / 2,
          y: (this.y + this.partner.y) / 2,
          hierarchy: Math.floor((this.hierarchy + this.partner.hierarchy) / 2 + mutationGaus(10)),
          eye: Math.round((this.eye + this.partner.eye) / 2 + mutationGaus(5)),
          zone:Math.round((this.zone + this.partner.zone) / 2 + mutationGaus(2)),
          defaultPace: Math.round((this.defaultPace + this.partner.defaultPace) / 2 + mutationGaus(2)),
          energy:Math.round((this.energy + this.partner.energy) / 4)
        });
        WORLD.born(baby);

        // use energy
        var ene = -1 * Math.round(baby.energy / 5);
        this.gain(ene);
        this.partner.gain(ene);
      }

      // reset partner
      this.partner.partner = null;
      this.partner = null;
    }
  }


});


