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
  return randomGaussian(0, variation);
}
