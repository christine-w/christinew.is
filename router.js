var 
path = require('path'),
fs = require('fs'),

mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif'
},

folders = {
  '.html': 'html/',
  '.css': 'styles/',
  '.js': 'scripts/',
  '.jpg': 'images/',
  '.png': 'images/',
  '.gif': 'images/'
};

function route(handle, pathname, response, request) {
  console.log('About to route a request for ' + pathname);
  if (typeof handle[pathname] === 'function') {
    handle[pathname](response, request);
  } else {
    getFile(pathname, response);
/*
    console.log('No request handler found for ' + pathname);
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.write('404 Not Found');
    response.end();
*/
  }
}

function getFile(fileName, response) {
  var
  ext = path.extname(fileName),
  filePath = folders[ext] + fileName,
  mimeType = mimeTypes[ext];

  fs.exists(filePath, function(exists) {
    if ( exists ) {
      fs.readFile(filePath, function(err, contents) {
        if ( !err ) {
          response.writeHead(200, {
            "Content-Type": mimeType,
            "Content-Length": contents.length
          });
          response.end(contents);
        } else {
          console.dir(err);
        }
      });
    } else {
      response.writeHead(404);
      response.write("Sorry, file not found!");
    }
  });
}

exports.route = route;
