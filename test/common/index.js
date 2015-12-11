'use strict'
chai.use(require('../../lib'))

describe('chai-performance', function () {
  it('division should be as fast as multiplication', function (done) {
    this.timeout(50e3)
    var amount = 1e4
    expect(function () {
      for (var i = 0, j; i < amount; i++) { //eslint-disable-line
        j = i * 10
      }
    }).performance({
      margin: 1,
      loop: 20,
      method () {
        for (var i = 0, j; i < amount; i++) { //eslint-disable-line
          j = i / 10
        }
      }
    }, done)
  })
})
