# SYNOPSIS
Get the complete body from a stream and parse it automatically.

# MOTIVATION
A minimal wrapper around [raw-body](https://github.com/stream-utils/raw-body)
that provides you with the correct parser.

# BUILD STATUS
[![Build Status](https://travis-ci.org/0x00A/stream-body.svg?branch=master)](https://travis-ci.org/0x00A/stream-body)

# USAGE
This module detects the content type of the stream and parses it appropriately.
So for instance, if you request a resource with a `content-type` header which
has the value of `application/json`, the response body will be parsed as `JSON`.

```js
const http = require('http')
const body = require('stream-body')

const url = 'http://nodejs.org/dist/index.json'

http.get(url, res => body.parse(res, (err, data) => {

  // ...`data` will be a json object.
}))
```

# EXTENDING
This module exports an object that exposes all parsers. For instance, the `JSON`
parser implemintation is defined on the `parsers` member...

```js
const body = require('stream-body')

body.parsers['application/json'] = function (data, opts, cb) {

  // `data` is the raw data object
  // `opts` is any options passed in to the parse function
  // `cb` is called after the stream has ended
}
```

