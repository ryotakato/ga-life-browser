
describe("test of test.life.js", function(){
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
