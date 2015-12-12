# chai-performance

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![npm version](https://badge.fury.io/js/chai-performance.svg)](https://badge.fury.io/js/chai-performance)

Performance test plugin for the [chai assertion libary](http://chaijs.com/), for the browser and node

```javascript
var chai = require('chai')
var perf = require('chai-performance')
chai.use(perf)

// use this to enable or disable logs on success (enabled by default in node)
perf.log = true

describe('chai-performance', function () {
  it('division should be as fast as multiplication', function (done) {
    this.timeout(50e3)
    var amount = 1e6
    expect(function () {
      for (var i = 0, j; i < amount; i++) {
        j = i * 10
      }
    }).performance({
      margin: 1,
      loop:10,
      method: function () {
        for (var i = 0, j; i < amount; i++) {
          j = i / 10
        }
      }
    }, done)
  })
})
```
