const NAME = 'performance'
var isNode = (typeof window === 'undefined')
var os // eslint-disable-line

if (isNode) {
  os = require('os')
} else {
  console.log('gaston: \n\nif you want to check memory usage start chrome using: \n\n open -a Google\ Chrome --args --enable-precise-memory-info --enable-memory-info --js-flags="--expose-gc"\n')
}

function _test (method, name, complete, call, args, nolog, logger) {
  var start = exports.now()
  var memorystart = exports.memory()
  var memoryend
  var mem
  var time
  var end
  var sub

  if (!name) {
    name = NAME
  }

  if (call) {
    sub = method.apply(call, args)
  } else {
    sub = method.apply(this, args)
  }
  end = exports.now()
  memoryend = exports.memory()
  mem = (memoryend - memorystart)
  time = end - start - (sub || 0)
  if (complete) {
    complete(((time) / 1000), (memoryend - memorystart))
  } else if (!nolog) {
    var output = '\nparse time: ' +
      ((end - start) / 1000) +
      ' sec' + (mem ? '\nmemory used (approximate): ' +
      mem / 1024 + ' mb' : '')

    if (logger) {
      logger(name, output)
    } else {
      console.log(name, output)
    }
  }
  return time
}

function _done (params, time, mem, memstart) {
  var name = params.name || NAME
  if (params.complete) {
    params.complete(time, mem, params, exports.average(time)[0], exports.average(time)[1])
  } else {
    var output = ' n=' +
      params.loop +
      '\nparse time:' +
      (params.extensive
        ? (' \n\n' + time.join(' sec\n') + ' sec\n\n')
        : '') +
      'average: ' + exports.average(time)[1] +
      ' sec\ntotal: ' +
      exports.average(time)[0] + ' sec\n'

    let logger = params.log
    if (logger) {
      logger(name, output)
    } else {
      console.log(name, output)
    }
  }
}

function perf (params, fn) {
  if (fn && typeof params === 'string') {
    return _test(fn, params)
  } else if (typeof params === 'function') {
    return _test(params)
  } else if (params instanceof Object) {
    if (!params.name) {
      params.name = NAME
    }
    if (params.loop) {
      let memstart = exports.memory()
      // testing memory in loop is hard since the gc almost never makes it before next iteration;
      let time = []
      let mem = []
      var callback = function callback (_time, memory) {
        time.push(_time)
        if (memory) {
          mem.push(memory)
        }
      }
      if (params.interval) {
        var cnt = 0
        var interval = setInterval(function () {
          cnt++
          if (cnt === params.loop - 1) {
            clearInterval(interval)
            _done(params, time, mem, memstart)
          } else {
            _test(params.method, false, callback)
          }
        }, params.interval)
      } else {
        for (var i = params.loop; i > 0; i--) {
          _test(params.method, false, callback)
        }
        _done(params, time, mem, memstart)
      }
      return exports.average(time)
    } else {
      return _test(
        params.method
        , params.name
        , params.complete
        , params.call
        , params.args
        , params.nolog
        , params.log
        )
    }
  }
}

module.exports = exports = function performance (params, done) {
  if (typeof params === 'function') {
    console.log(done)
    params = {
      method: params,
      complete: done
    }
    perf(params)
  } else {
    console.log(done)
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

exports.average = function (array) {
  var number = 0
  for (var i = array.length - 1; i >= 0; i--) {
    number += array[i]
  }
  return [number, number / array.length]
}
