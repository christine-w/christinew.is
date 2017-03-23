// www.htmlgoodies.com/html5/javascript/drag-files-into-the-browser-from-the-desktop-HTML5.html
console.log( 'Hi!' );
function addEventHandler(obj, evt, handler) {
  if ( obj.addEventListener ) {
    // W3C method
    obj.addEventListener(evt, handler, false);
  } else if ( obj.attachEvent ) {
    // IE method
    obj.attachEvent('on'+evt, handler);
  } else {
    // Old school method
    obj['on'+evt] = handler;
  }
}

if (window.FileReader) {
  addEventHandler(window, 'load', function() {
    //var status = document.getElementById('status');
    var drop = document.getElementById('drop');
    var list = document.getElementById('list');

    status.innerHTML = 'Drag a file and drop it here...';

    function cancel(e) {
      if (e.preventDefault) { e.preventDefault(); }
      return false;
    }

    // Tells the browser the we *can* drop on this target
    addEventHandler(drop, 'dragover', cancel);
    addEventHandler(drop, 'dragenter', cancel);

    addEventHandler(drop, 'drop', function(e) {
      e = e || window.event;  // get window.event if e argument missing (in IE)
      if (e.preventDefault) { e.preventDefault(); } // stops the browser from redirecting off to the image

      var dt = e.dataTransfer;
      var files = dt.files;
      // for loop t iterate through files
      var file = files[0];
      var reader = new FileReader();

      addEventHandler(reader, 'loadend', function(e, file) {
        var bin = this.result;
        var display = document.getElementById('display'); 
        if ( !display ) {
          display = document.createElement('div');
          display.setAttribute('id', 'display');
          drop.appendChild(display);
        } 
        list.innerHTML = 'Loaded: ' + file.name + ' size ' + file.size + ' B';
        //list.appendChild(display);
        // var fileNumber = list.getElementsByTagName('div').length;
        //status.innerHTML = 'Done loading'; // fileNumber < files.length ? 'Loaded 100% of file ' + fileNumber...
    
        var img = document.getElementById('displayImg');
        if ( !img ) {
          var img = document.createElement('img');
          img.setAttribute('id', 'displayImg');
          display.appendChild(img);
        }
        img.file = file;
        img.src = bin;
        //list.appendChild(img);
      }.bindToEventHandler(file));
      reader.readAsDataURL(file);

      return false;
    });
  });
} else {
  document.getElementById('status').innerHTML = 'Your browser does not support the HTML5 FileReader.';
}

Function.prototype.bindToEventHandler = function bindToEventHandler() {
  var handler = this;
  var boundParameters = Array.prototype.slice.call(arguments);
  // create closure
  return function(e) {
    e = e || window.event; //get window.event if e argument missing (in IE)
    boundParameters.unshift(e);
    handler.apply(this, boundParameters);
  }
};
