'use strict'
/*
  performance
  expect( ... ).performance( options )
  options: {
    method: function
    time: number
    margin: number (method*margin)
  }
  options = function (defualt margin 1.05)
  options = number (time in ms)
*/
var isNode = typeof window === 'undefined'

module.exports = exports = function (chai, _) {
  var performance = require('./performance')
  var Assertion = chai.Assertion
  var log = require('./log')

  Assertion.addMethod('performance', function (params, done) {
    var fn = this._obj
    var assertion = this
    var compare
    new Assertion(fn).to.be.a.function
    if (typeof params === 'function') {
      let condition = { method: params }
      compare = condition
    } else if (typeof params !== 'object') {
      params = { time: params }
    } else if (params.method) {
      let condition = {
        method: params.method,
        loop: params.loop
      }
      compare = condition
    }

    function complete (single, avtime) {
      perfAssert(
        typeof single === 'object'
          ? single[0] * 1000
          : single * 1000,
        'time',
        assertion,
        params,
        done
      )
    }

    if (compare) {
      performance(compare, function (single) {
        var isObj = typeof fn !== 'function'
        params = {
          loop: params.loop || fn.loop,
          margin: params.margin || 1.05
        }
        params.complete = void 0
        params.method = isObj ? fn.method : fn
        params.time = 1000 * (
          typeof single === 'object'
            ? single[0]
            : single
        )
        performance(params, complete)
      })
    } else {
      if (typeof fn !== 'function') {
        params.method = fn.method
        params.loop = fn.loop
      } else {
        params.method = fn
      }
      return performance(params, complete)
    }
  })

  if (isNode) {
    exports.log = true
  }

  function perfAssert (measure, field, assertion, params, done, msg, unit, round) {
    var margin = params.margin || 1
    field = params[field]

    if (field) {
      // handle this for node!
      round = Math.pow(10, (round || 2))
      measure = measure
      measure = Math.round(measure * round) / round
      unit = unit || 'ms'

      if (measure > field * margin) {
        let unittime = Math.round((measure - field) * round) / round
        let sign
        let direction
        if (unittime > 0) {
          sign = '+'
          direction = 1
        } else {
          sign = '-'
          direction = -1
        }

        assertion.assert(
          measure < field * margin,
          (msg ? msg(params) : 'execution time') +
          ' [ ' + sign + (unittime * direction) + ' ' + unit + ' ]' +
          '[ ' + sign + (Math.round((measure / (field)) * round - 100) * direction) + '% ]' +
          '\n' + (isNode ? '     ' : '') + log.info(params, field, margin, round, unit, measure)
        )
      }
      if (done) {
        done()
      }

      if (exports.log || params.log) {
        log(measure, field, assertion, params, done, msg, unit, round, margin)
      }
    }
  }
}
