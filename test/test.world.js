
describe("atmosphere", function() {
  it("init", function() {
    WORLD.atmosphere.init();
    

    assert.equal(78100, WORLD.atmosphere.air[0][0].n2);
    assert.equal(20950, WORLD.atmosphere.air[0][0].o2);
    assert.equal(900, WORLD.atmosphere.air[0][0].ar);
    assert.equal(50, WORLD.atmosphere.air[0][0].co2);
    assert.equal(78100, WORLD.atmosphere.air[WORLD.height - 1][WORLD.width - 1].n2);
    assert.equal(20950, WORLD.atmosphere.air[WORLD.height - 1][WORLD.width - 1].o2);
    assert.equal(900, WORLD.atmosphere.air[WORLD.height - 1][WORLD.width - 1].ar);
    assert.equal(50, WORLD.atmosphere.air[WORLD.height - 1][WORLD.width - 1].co2);
  });


});
