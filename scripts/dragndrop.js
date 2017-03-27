// www.htmlgoodies.com/html5/javascript/drag-files-into-the-browser-from-the-desktop-HTML5.html
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

function advancedUploadSupported() {
  var span = document.createElement('span');
  var isDragAndDropSupported = ('draggable' in span) || ('ondragstart' in span && 'ondrop' in span);
  return isDragAndDropSupported && !(/Mobi/.test(navigator.userAgent)) && 'FormData' in window && 'FileReader' in window;
}

if (advancedUploadSupported()) {
  var form = document.getElementsByClassName('box')[0];
  form.classList.add('has-advanced-upload');

  addEventHandler(window, 'load', function() {
    //var drop = document.getElementById('drop');
    //var list = document.getElementById('list');

    //status.innerHTML = 'Drag a file and drop it here...';

    function cancel(e) {
      if (e.preventDefault) { e.preventDefault(); }
      return false;
    }

    // Tells the browser the we *can* drop on this target
    addEventHandler(form, 'dragover', cancel);
    addEventHandler(form, 'dragenter', cancel);

    addEventHandler(form, 'drop', function(e) {
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
          form.appendChild(display);
        } 
        //list.innerHTML = 'Loaded: ' + file.name + ' size ' + file.size + ' B';
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

        var formData = new FormData();
        formData.append('file', file, file.name);

        var xhr = new XMLHttpRequest();
        xhr.open("POST", '/upload', true);
        xhr.send(formData);
        //list.innerHTML = 'Uploaded: ' + file.name + ' size ' + file.size + ' B';

        //list.appendChild(img);
      }.bindToEventHandler(file));
      reader.readAsDataURL(file);

      return false;
    });
  });
} else {
  document.getElementById('status').innerHTML = 'Your browser does not support the HTML5 FileReader.';
}

var fileInput = document.getElementById('file');
fileInput.addEventListener('change', uploadFile, false);

function uploadFile() {
  var file = this.files[0];
  var reader = new FileReader();

  addEventHandler(reader, 'loadend', function(e, file) {
    var bin = this.result;
    var display = document.getElementById('display'); 
    if ( !display ) {
      display = document.createElement('div');
      display.setAttribute('id', 'display');
      form.appendChild(display);
    }
    var img = document.getElementById('displayImg');
    if ( !img ) {
      var img = document.createElement('img');
      img.setAttribute('id', 'displayImg');
      display.appendChild(img);
    }
    img.file = file;
    img.src = bin;

    var formData = new FormData();
    formData.append('file', file);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/upload', true);
    xhr.send(formData);
  }.bindToEventHandler(file));
  reader.readAsDataURL(file);
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
