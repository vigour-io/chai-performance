'use strict'
module.exports = exports = function (measure, time, assertion, params, unit, round, margin, totalmeasure, totaltime) {
  var colors = require('colors-browserify') //eslint-disable-line
  var isNode = typeof window === 'undefined'
  var line
  var indent = isNode ? '        ' : ''
  var name = ((!isNode ? '\n' : '') + indent + (assertion.__flags.message || assertion._obj.name || params.name || 'result') + ':')
  var percentage = (Math.round(measure * round) / round + ' ' + unit + ' | ') + ((100 - Math.round((measure / (time * margin)) * -round)) - 100) + '%'
  measure = Math.round(measure * round) / round

  var args = [
    (percentage[measure > time * margin ? 'red' : 'green']).bold,
    '\n' + indent + info(params, time, margin, round, unit, measure, totalmeasure, totaltime)
  ]

  args.unshift(name.bold)

  if (!isNode) {
    if (console.line) {
      line = console.line
      console.line = false
    }
  }
  console.log.apply(console, args)
  if (!isNode) {
    if (line) {
      console.line = line
    }
  }
}

exports.info = info

function info (params, time, margin, round, unit, measure, totalmeasure, totaltime) {
  var info = 'info: '
  var amount = (params.loop || 1)
  var limit = margin * Math.round(time * round) / round + ' ' + unit
  return info +
  Math.round((measure) * round) / round + ' ' + unit +
  ' | limit: ' + limit + ' | margin: ' + margin +
  ' | n = ' + amount + ' | total = ' +
  Math.round((totalmeasure || measure) * round) / round + ' ' + unit + ' vs ' +
  Math.round((totaltime || time) * margin * round) / round + ' ' + unit
}
