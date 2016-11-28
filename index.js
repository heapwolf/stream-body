var rawBody = require('raw-body')
var qsp = require('querystring').parse

var api = module.exports = {}

api.parse = function parse (stream, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }

  // detect the content length.
  opts.contentLength = stream.headers
    ? Number(stream.headers['content-length'])
    : null

  // detect which parser to use.
  var contentType = stream.headers['content-type'].split(';')[0].trim()

  if (!api.parsers[contentType]) {
    return cb(new Error('No parser defined for that content-type!'))
  }

  var params = {
    limit: opts.limit || 1024 * 1024,
    length: opts.contentLength,
    encoding: 'encoding' in opts ? opts.encoding : true
  }

  rawBody(stream, params, function (err, body) {
    if (err) return cb(err)
    api.parsers[contentType](body, opts, cb)
  })
}

api.parsers = {}

api.parsers['application/json'] = function (str, opts, cb) {
  var reviver = opts.reviver || null
  var json

  try {
    json = JSON.parse(str, reviver)
  } catch (err) {
    return cb(err)
  }
  cb(null, json)
}

api.parsers['text/plain'] =
api.parsers['text/html'] = function (str, opts, cb) {
  cb(null, str)
}

api.parsers['application/x-www-form-urlencoded'] = function (obj, opts, cb) {
  var sep = opts.sep || null
  var eq = opts.eq || null
  cb(null, qsp(obj, sep, eq, opts))
}

