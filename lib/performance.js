'use strict'

var isNode = (typeof window === 'undefined')
var os // eslint-disable-line

if (isNode) {
  os = require('os')
} else {
  console.log('\nif you want to check memory usage start chrome using: \n\n open -a Google\ Chrome --args --enable-precise-memory-info --enable-memory-info --js-flags="--expose-gc"\n')
}

module.exports = exports = function performance (params, done) {
  if (typeof params === 'function') {
    params = {
      method: params,
      complete: done
    }
    perf(params)
  } else {
    params.complete = done
    perf(params)
  }
}

exports.now = function () {
  return isNode
    ? process.hrtime()[0] * 1000 + process.hrtime()[1] * 0.000001
    : (window.performance && window.performance.now
      ? window.performance.now()
      : Date.now())
}

exports.memory = function () {
  return isNode
    ? process.memoryUsage().heapUsed * 0.000976562
    : (window && window.performance && window.performance.memory
      ? window.performance.memory.usedJSHeapSize * 0.000976562
      : 0)
}

function _test (method, complete, call, args, nolog, logger) {
  var start = exports.now()
  var memorystart = exports.memory()
  var memoryend = 0
  var time
  var end
  var sub
  if (call) {
    sub = method.apply(call, args)
  } else {
    sub = method.apply(this, args)
  }
  end = exports.now()
  memoryend = exports.memory()
  time = end - start - (sub || 0)
  if (complete) {
    setTimeout(complete(time, (memoryend - memorystart)))
  }
  return time
}

function _done (params, time, mem) {
  if (params.complete) {
    params.complete(time, mem, params)
  }
}

function perf (params) {
  if (params instanceof Object) {
    if (params.loop) {
      let callback = function (_time, memory) {
        time.push(_time)
        if (memory) {
          mem.push(memory)
        }
      }
      let memstart = exports.memory()
      // testing memory in loop is hard since the gc almost never makes it before next iteration;
      let time = []
      let mem = []
      let cnt = 0
      let interval = setInterval(function () {
        cnt++
        if (cnt === params.loop - 1) {
          clearInterval(interval)
          _done(params, time, mem, memstart)
        } else {
          _test(params.method, callback, params.call, params.args, params.nolog, params.log)
        }
      }, params.interval || 0)
    } else {
      return _test(
        params.method,
        params.complete,
        params.call,
        params.args,
        params.nolog,
        params.log
      )
    }
  } else {
    throw new Error('performance test - parameters not an object')
  }
}
