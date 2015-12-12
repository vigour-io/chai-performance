'use strict'
var lib = require('../../lib')
lib.log = true
chai.use(lib)
// base erin :) so nice
describe('chai-performance', function () {
  it('division should be as fast as multiplication', function (done) {
    this.timeout(50e3)
    var amount = 1e3
    expect(function () {
      for (var i = 0, j; i < amount; i++) { //eslint-disable-line
        j = i * 10
      }
    }).performance({
      margin: 1,
      loop: 100,
      method () {
        for (var i = 0, j; i < amount; i++) { //eslint-disable-line
          j = i / 10
        }
      }
    }, done)
  })
})
