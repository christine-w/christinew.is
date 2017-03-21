var http = require('http');
var url = require('url');

function start(route, handle) {
  function onRequest(request, response) {
    //var postData = '';
    var pathname = url.parse(request.url).pathname;
    console.log('Request for ' + pathname + ' received');
    route(handle, pathname, response, request);    
/*
    request.setEncoding('utf8');

    request.addListener('data', function(postDataChunk) {
      postData += postDataChunk;
      console.log('Received POST data chunk "' + postDataChunk + '".');
    });

    request.addListener('end', function() {
      route(handle, pathname, response, postData);
    });
*/
  }
/*
  response.writeHead(200, {'Content-Type': 'text/plain'});
    response.write('Hi there');
    response.end();
  }).listen(8080);
*/
  http.createServer(onRequest).listen(8081);
  console.log('Test Server has started.');
}

exports.start = start;

