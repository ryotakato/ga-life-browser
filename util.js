Function.prototype.extend = function(protoProps, staticProps) {

    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && _.has(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    _.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
};

// Point
var Point = function(pace, direction) {
  this.pace = pace;
  this.direction = direction;
}

Point.prototype.amount = function() {
  return this.pace * this.direction;
}

Point.prototype.reverse = function(cond) {
  if (cond) {
    this.direction = this.direction * -1;
  }
}

// mutation
function mutationOdds(odds, variation) {
  var ran = _.random(0, odds);
  return ran < 1 ? (-1 * variation) : (ran > (odds - 1) ? variation : 0);
}

function mutationGaus(variation) {
  return ranUtil.randomGaussian(0, variation);
}


var colorUtil = (function() {

  var componentToHex = function(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  return {
    rgbToHex: function(r, g, b) {
      return "0x" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }
  }
})();

var ranUtil = (function() {

  var seeded = false;
  var lcg = function () {
      var m = 4294967296, a = 1664525, c = 1013904223, seed, z;
      return {
        setSeed: function (val) {
          z = seed = (val == null ? Math.random() * m : val) >>> 0;
        },
        getSeed: function () {
          return seed;
        },
        rand: function () {
          z = (a * z + c) % m;
          return z / m;
        }
      };
    }();

  var y2;
  var previous = false;

  return {
    randomSeed : function (seed) {
      lcg.setSeed(seed);
      seeded = true;
    },
    random : function (min, max) {
      var rand;
      if (seeded) {
        rand = lcg.rand();
      } else {
        rand = Math.random();
      }
      if (arguments.length === 0) {
        return rand;
      } else if (arguments.length === 1) {
        return rand * min;
      } else {
        if (min > max) {
          var tmp = min;
          min = max;
          max = tmp;
        }
        return rand * (max - min) + min;
      }
    },
    randomGaussian : function (mean, sd) {
      var y1, x1, x2, w;
      if (previous) {
        y1 = y2;
        previous = false;
      } else {
        do {
          x1 = this.random(2) - 1;
          x2 = this.random(2) - 1;
          w = x1 * x1 + x2 * x2;
        } while (w >= 1);
        w = Math.sqrt(-2 * Math.log(w) / w);
        y1 = x1 * w;
        y2 = x2 * w;
        previous = true;
      }
      var m = mean || 0;
      var s = sd || 1;
      return y1 * s + m;
    }
  }

})();

