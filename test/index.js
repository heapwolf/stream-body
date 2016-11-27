const test = require('tape')
const http = require('http')
const body = require('../index')
const QS = require('querystring')

const hostname = '127.0.0.1'
const port = 3000

const get = (p, cb) => http.get('http://localhost:3000' + p, cb)

test('[passing] setup', assert => {
  const server = http.createServer((req, res) => {
    res.statusCode = 200

    if (req.url === '/text') {
      res.setHeader('Content-Type', 'text/plain')
      res.end('Hello World\n')
    }

    if (req.url === '/json') {
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ message: 'OK' }))
    }

    if (req.url === '/bad-json') {
      res.setHeader('Content-Type', 'application/json')
      res.end('{ message: \'OK\'')
    }

    if (req.url === '/form') {
      res.setHeader('Content-Type', 'application/x-www-form-urlencoded')
      res.end(QS.stringify({ message: 'OK' }))
    }
  })

  server.listen(port, hostname, () => {
    assert.end()
  })
})

test('[passing] json is parsed properly', assert => {
  get('/json', res => body.parse(res, (err, data) => {
    if (err) assert.fail(true, err, 'There was an unexpected error')
    assert.equal(data.message, 'OK', 'The text "OK" was expected on the object')
    assert.end()
  }))
})

test('[passing] forms are parsed properly', assert => {
  get('/form', res => body.parse(res, (err, data) => {
    if (err) assert.fail(true, err, 'There was an unpexpected error')
    assert.equal(data.message, 'OK', 'The text "OK" was expected on the object')
    assert.end()
  }))
})

test('[failing] bad json', assert => {
  get('/bad-json', res => body.parse(res, (err, data) => {
    assert.equal(err.name, 'SyntaxError', 'A syntax error was exected')
    assert.equal(data, undefined, 'Data should not be defined')
    assert.end()
  }))
})

test('[passing] teardown', assert => {
  assert.end()
  process.exit(0)
})
