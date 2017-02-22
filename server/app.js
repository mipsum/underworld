var http = require('http');
var fs = require('fs')


var str = fs.existsSync('/server/init-docker.sh')
  ? fs.readFileSync('/server/init-docker.sh', 'utf8')
  : ''

// console.log(str)

var handleRequest = function(request, response) {
  console.log('Received request for URL: ' + request.url);
  response.writeHead(200);
  response.end('Hello World! v2\n' + str);
};
var www = http.createServer(handleRequest);
www.listen(8060);
