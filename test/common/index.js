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

  it('can use a before method', function (done) {
    this.timeout(50e3)
    var amount = 1e3
    expect(function () {
      for (var i = 0, j; i < amount; i++) { //eslint-disable-line
        j = i * 10
      }
    }).performance({
      margin: 1,
      loop: 10,
      time: 5,
      before () {
        var x = 0
        for(var i = 0 ; i< 1e5; i++) {
          x += Math.random()*9999999
        }
      }
    }, done)
  })
})
