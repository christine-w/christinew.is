var 
querystring = require('querystring'),
fs = require('fs'),
formidable = require('formidable');

function start(response, request) {
  console.log('Request handler \'start\' was called.');

  fs.readFile('html/welcome.html', function(err, html) {
    if ( err ) {
      response.writeHead(404);
      response.write("Sorry, file not found...");
    } else {
      response.writeHead(200, {"Content-Type": "text/html"});
      response.write(html);
    }
    response.end();
  });
}

function upload(response, request) {
  console.log('Request handler \'upload\' was called.');

  var form = new formidable.IncomingForm();
  console.log('about to parse');
  form.parse(request, function(error, fields, files) {
    console.log(files);
    console.log('parsing done');

    /* Possible error on Windows systems: tried to rename to an already 
       existing file */
    fs.rename(files.file.path, 'images/jasper3.jpg', function(error) {
      if (error) {
        fs.unlink('images/jasper3.jpg');
        fs.rename(files.file.path, 'images/jasper3.jpg');
      }
    });
    response.writeHead(302, {'Location': '/'});
    //response.write('received image: <br/>');
    //response.write("<img src='/show' />");
    response.end();
  });
}

function show(response) {
  console.log('Request handler "show" was called.');
  response.writeHead(200, {"Content-Type": "image/jpg"});
  fs.createReadStream('images/jasper3.jpg').pipe(response);
}

exports.start = start;
exports.upload = upload;
exports.show = show;
