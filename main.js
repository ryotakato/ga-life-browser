
var WORLD = { 
  lifes: [],
  enemies: function(hierarchy) {
    return _.filter(this.lifes, function(l) { return hierarchy + 10 < l.hierarchy;});
  },
  feeds: function(hierarchy) {
    return _.filter(this.lifes, function(l) { return hierarchy - 50 < l.hierarchy && l.hierarchy < Math.max(hierarchy - 10, 1);});
  }
};
var WIDTH = 1000;
var HEIGHT = 500;

function setup() {
  // screen config
  createCanvas(WIDTH, HEIGHT);
  background(51);

  // init life
  _.times(220, function() {
    WORLD.lifes.push(new Plant({x: random(WIDTH), y: random(HEIGHT)}));
  });

  _.times(60, function() {
    WORLD.lifes.push(new Animal({x: random(WIDTH), y: random(HEIGHT), hierarchy: 15, eye: 30, zone:10, energy: 100}));
  });

}

var age = 0;
function draw() {
  age++;
  background(51);
  
  // remove dead life
  WORLD.lifes = _.filter(WORLD.lifes, function(l) { return l.alive });

  // status
  status(age);

  // add plant
  _.times(1, function() {
    if (_.random(0, 100) < 5) {
      WORLD.lifes.push(new Animal({x: random(WIDTH), y: random(HEIGHT), hierarchy: 5, eye: 30, zone:10, energy: 100}));
    } else {
      WORLD.lifes.push(new Plant({x: random(WIDTH), y: random(HEIGHT)}));
      WORLD.lifes.push(new Plant({x: random(WIDTH), y: random(HEIGHT)}));
    }
  });

  // search
  _.each(WORLD.lifes, function(l) {
    if (l.search) { l.search(); }
  });
  // settle
  _.each(WORLD.lifes, function(l) {
    if (l.settle) { l.settle(); }
  });
  // walk
  _.each(WORLD.lifes, function(l) {
    if (l.walk) { l.walk(); }
  });
  // eat
  _.each(WORLD.lifes, function(l) {
    if (l.eat) { l.eat(); }
  });
  // starve
  _.each(WORLD.lifes, function(l) {
    if (l.starve) { l.starve(); }
  });
  // couple
  _.each(WORLD.lifes, function(l) {
    if (l.couple) { l.couple(); }
  });
  // mate
  _.each(WORLD.lifes, function(l) {
    if (l.mate) { l.mate(); }
  });


  // draw life
  _.each(WORLD.lifes, function(l) {
    drawLife(l);
  });
}


var stoped = false;
function mouseClicked() {
  if (stoped) {
    loop();
    stoped = false;
  } else {
    noLoop();
    stoped = true;
  }

}

function drawLife(l) {
  // Life
  var g = 255;
  var r = 128;
  var b = 0;
  r = r + l.hierarchy * 4;
  if (255 < r) {
    g = g - (r - 255);
  }
  var c = color(r, g, b);
  stroke(c);
  fill(c);
  ellipse(l.x, l.y, l.w, l.h);
}

function status(age) {
  document.getElementById("age").innerHTML = age;
  var count = _.filter(WORLD.lifes, function(l) { return l instanceof Animal;}).length;
  var hierarchy = _.max(WORLD.lifes, function(l) { return l.hierarchy;}).hierarchy;
  var eye = _.max(WORLD.lifes, function(l) { return l.eye;}).eye;
  var zone = _.max(WORLD.lifes, function(l) { return l.zone;}).zone;
  var pace = _.max(WORLD.lifes, function(l) { return l.defaultPace;}).defaultPace;
  var energy = _.max(WORLD.lifes, function(l) { return l.energy;}).energy;
  document.getElementById("count").innerHTML = count;
  document.getElementById("hierarchy").innerHTML = hierarchy;
  document.getElementById("eye").innerHTML = eye;
  document.getElementById("zone").innerHTML = zone;
  document.getElementById("pace").innerHTML = pace;
  document.getElementById("energy").innerHTML = energy;
}
