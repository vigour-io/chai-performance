'use strict'
module.exports = exports = function (measure, time, assertion, params, unit, round, margin, totaltime, totalmeasure) {
  var colors = require('colors-browserify') //eslint-disable-line
  var isNode = typeof window === 'undefined'
  var line
  var indent = isNode ? '        ' : ''
  var name = ((!isNode ? '\n' : '') + indent + (assertion.__flags.message || assertion._obj.name || params.name || 'result') + ':')
  var percentage = (Math.round(measure * round) / round + ' ' + unit + ' | ') + ((100 - Math.round((measure / (time)) * -round)) - 100) + '%'
  measure = Math.round(measure * round) / round

  var args = [
    (percentage[measure > time * margin ? 'red' : 'green']).bold,
    '\n' + indent + info(params, time, margin, round, unit, measure, totaltime, totalmeasure)
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
  var limit = (params.margin || 1) * Math.round(time * round) / round + ' ' + unit
  return info +
  Math.round((measure) * round) / round + ' ' + unit +
  ' | limit: ' + limit + (params.margin ? ' | margin: ' + params.margin : '') +
  ' | n = ' + amount + ' | total = ' +
  Math.round((totalmeasure || measure) * round) / round + ' ' + unit + ' vs ' +
  Math.round((totaltime || time) * round) / round + ' ' + unit
}
