#! /usr/local/bin/node

var http = require('http');
var fs = require('fs')

var os = require('os');
var str = JSON.stringify(os.networkInterfaces())

var handleRequest = function(request, response) {
  console.log('Received request for URL: ' + request.url, request.headers);

  response.writeHead(200);
  response.end('Hello World! v3\n' + str);
};

var www = http.createServer(handleRequest);

console.log('listening 8080')


www.listen(8080);
