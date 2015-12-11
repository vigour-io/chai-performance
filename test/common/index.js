'use strict'
describe('chai-performance', function () {
  it('division should be as fast a multiplication', function (done) {
    this.timeout(50e3)
    var amount = 1e6
    expect(function () {
      for (var i = 0; i < amount; i++) {
        i = i * 10
      }
    }).performance({
      margin: 1,
      loop:10,
      method: function () {
        for (var i = 0; i < amount; i++) {
          i = i / 10
        }
      }
    }, done)
  })
})
