# chai-performance

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![npm version](https://badge.fury.io/js/chai-performance.svg)](https://badge.fury.io/js/chai-performance)

Performance test plugin for the [chai assertion libary](http://chaijs.com/), for the browser and node

```javascript
var chai = require('chai')
chai.use(require('chai-performance'))

describe('chai-performance', function () {
  it('division should be as fast a multiplication', function (done) {
    this.timeout(50e3)
    var amount = 1e6
    expect(function () {
      for (var i = 0; i < amount; i++) {
        i = i * 10
      }
    }).performance({
      margin: 1,
      loop:10,
      method: function () {
        for (var i = 0; i < amount; i++) {
          i = i / 10
        }
      }
    }, done)
  })
})
```
