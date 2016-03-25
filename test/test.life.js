
describe("animal and prant relation", function(){
  var plant;
  var animal;

  beforeEach(function() {
    plant = new Plant({x: WORLD.width, y: WORLD.height});
    animal = new Animal({x: WORLD.width - 5, y: WORLD.height - 5, hierarchy: 15, eye: 30, zone:10, energy: 100, defaultPace: 10});
    WORLD.born(plant);
    WORLD.born(animal);
  });
  afterEach(function() {
    plant.die();
    animal.die();
    WORLD.sweep();
  });

  it("animal search prey", function() {

    animal.search();

    assert.isNotNull(animal.prey);
    assert.deepEqual(plant, animal.prey);
  });
  it("animal that has prey, settle", function() {
    assert.equal(10, animal.xp.pace);
    assert.equal(-1, animal.xp.direction);
    assert.equal(10, animal.yp.pace);
    assert.equal(-1, animal.yp.direction);

    animal.search();
    assert.deepEqual(plant, animal.prey);
    animal.settle();

    assert.deepEqual(plant, animal.prey);
    assert.equal(5, animal.xp.pace);
    assert.equal(1, animal.xp.direction);
    assert.equal(5, animal.yp.pace);
    assert.equal(1, animal.yp.direction);
  });
  it("animal that has prey, walk", function() {

    animal.search();
    animal.settle();
    animal.walk();

    assert.deepEqual(plant, animal.prey);
    assert.equal(WORLD.width, animal.x);
    assert.equal(WORLD.height, animal.y);
  });
  it("animal that has prey, eat", function() {

    animal.search();
    animal.settle();
    animal.walk();

    var beforeEnergy = animal.energy;
    assert.equal(plant, animal.prey);

    animal.eat();

    assert.equal(false, plant.alive);
    assert.equal(null, animal.prey);
    assert.equal(beforeEnergy + 10, animal.energy);
  });

});


describe("animal gain", function() {
  var animal;

  beforeEach(function() {
    animal = new Animal({x: 100, y: 100, hierarchy: 15, eye: 30, zone:10, energy: 100, defaultPace: 10});
    WORLD.born(animal);
  });
  afterEach(function() {
    animal.die();
    WORLD.sweep();
  });

  it("gain plus energy", function() {
    var worldBeforeEnergy = WORLD.energy;
    var animalBeforeEnergy = animal.energy;

    animal.gain(5);

    assert.equal(animalBeforeEnergy + 5, animal.energy);
    assert.equal(worldBeforeEnergy, WORLD.energy);
  
  });

  it("gain minus energy", function() {
    var worldBeforeEnergy = WORLD.energy;
    var animalBeforeEnergy = animal.energy;

    animal.gain(-5);

    assert.equal(animalBeforeEnergy - 5, animal.energy);
    assert.equal(worldBeforeEnergy, WORLD.energy);
  
  });

})
