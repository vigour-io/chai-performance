'use strict'

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

    function complete (time, mem) {
      perfAssert(
        time,
        params.time,
        assertion,
        params,
        done
      )
    }

    if (compare) {
      performance(compare, function (time, mem) {
        var isObj = typeof fn !== 'function'
        params = {
          loop: params.loop || fn.loop,
          margin: params.margin || 1.05,
          prep: params.before
        }
        params.complete = void 0
        params.method = isObj ? fn.method : fn // passoptions
        params.time = time
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

  function perfAssert (measure, time, assertion, params, done, unit, round) {
    var margin = params.margin || 1
    var totalmeasure = 0
    var totaltime = 0
    round = Math.pow(10, (round || 2))
    unit = unit || 'ms'
    measure = measure

    if (measure instanceof Array) {
      var length = measure.length
      for (let i = 1; i < length; i++) {
        totalmeasure += measure[i]
      }
      measure = totalmeasure / (length - 1)
    }

    if (time instanceof Array) {
      for (let i = 1; i < length; i++) {
        totaltime += time[i]
      }
      time = totaltime / (length - 1)
    }

    if (measure > time * margin) {
      let unittime = Math.round((measure - time) * round) / round
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
        measure < time * margin,
        'execution time' +
        ' [ ' + sign + (unittime * direction) + ' ' + unit + ' ]' +
        '[ ' + sign + (Math.round((measure / (time)) * round - 100) * direction) + '% ]' +
        '\n' + (isNode ? '     ' : '') + log.info(params, time, margin, round, unit, measure, totalmeasure, totaltime)
      )
    }
    if (done) {
      done()
    }

    if (exports.log || params.log) {
      log(measure, time, assertion, params, unit, round, margin, totalmeasure, totaltime)
    }
  }
}
