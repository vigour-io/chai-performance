'use strict'
module.exports = exports = function (measure, field, assertion, params, done, msg, unit, round, margin) {
  var colors = require('colors-browserify') //eslint-disable-line
  var isNode = typeof window === 'undefined'
  var line
  var indent = isNode ? '        ' : ''
  var name = ((!isNode ? '\n' : '') + indent + (assertion.__flags.message || assertion._obj.name || params.name) + ':')
  var percentage = (measure + ' ' + unit + ' | ') + ((100 - Math.round((measure / (field)) * -round)) - 100) + '%'

  var args = [
    (percentage[measure > field * margin ? 'red' : 'green']).bold,
    '\n' + indent + info(params, field, margin, round, unit, measure)
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

function info (params, field, margin, round, unit, measure) {
  var total = 'total: '
  var amount = (params.loop || 1)
  var limit = Math.round(field * amount * round) / round + ' ' + unit
  return total +
  Math.round((measure * amount) * round) / round + ' ' + unit +
  ' | limit: ' + limit + (params.margin ? ' | margin: ' + params.margin : '') +
  ' | n = ' + amount
}

/*
assertion.__flags.message
? ('"' + assertion.__flags.message + '"')
: assertion._obj,
'\n',
 */
