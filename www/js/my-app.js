        var pictureSource;   // picture source
        var destinationType; // sets the format of returned value
        var mediaType; 

        // Wait for device API libraries to load
        document.addEventListener("deviceready", onDeviceReady, false);

        // device APIs are available
        function onDeviceReady() {
            pictureSource=navigator.camera.PictureSourceType;
            destinationType=navigator.camera.DestinationType;
            mediaType = navigator.camera.MediaType;
            var userPass = myApp.formGetData('login');
            if(userPass == null){
                myApp.loginScreen();    
            }
        }

    // Called when a photo is successfully retrieved
    function onPhotoURISuccess(imageURI) {
      var largeImage = document.getElementById('smallImage');
      largeImage.src = imageURI;

      if(isVideo(imageURI) == true){
                $$('#smallImage').attr('src', imageURI);
                $$('#smallImage').css('display','none');
                var videoArea = document.getElementById('videoArea');
                videoArea.style.display = 'block';
                var v = "<video style='background:#000;' width='100' height='75' controls='controls'>";
                v += "<source src='" + imageURI + "' type='video/mp4'></video>";
                v += "</video>";
                document.querySelector("#videoArea").innerHTML = v; 

      }else{
              largeImage.style.display = 'block';
      }
        myApp.popup('.popup-media');
    }

    function getPhoto(source) {
            //Retrieve image file location from specified source
            navigator.camera.getPicture(
                onPhotoURISuccess,
                function(message) { 
                  //alert('get picture failed'); 
                },
                {
                    quality         : 50,
                    destinationType : navigator.camera.DestinationType.FILE_URI,
                    sourceType      : navigator.camera.PictureSourceType.PHOTOLIBRARY,
                    mediaType       : navigator.camera.MediaType.ALLMEDIA
                }
            );
    }
    function onFail(message) {
      //alert('Failed because: ' + message);
    }

function uploadPhoto(imageURI, caption, client, project, ftp, psw) {
            var storedData = myApp.formGetData('my-form');

            if(storedData != null){
                var byline = storedData['byline'];
            }
            else{
                byline = '';
            }

            var ftp_password = psw;
            var client = client;
            var project = project;
            var caption = caption;


            var options = new FileUploadOptions();
            options.fileKey="filedata";
            options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
            options.mimeType="image/jpeg";
            options.httpMethod = "POST";
            options.trustAllHosts = "true";
              
            var api_enpoint = 'http://api.shootitlive.com/upload';

            var params = {};
            params.client = client;
            params.project = project;
            params.ftp_password = ftp_password;
            params.byline = byline;
            params.caption = caption;
            options.params = params;

            var ft = new FileTransfer();
            ft.upload(imageURI, encodeURI(api_enpoint), win, fail, options);

        }

        function win(r) {
            // console.log("Code = " + r.responseCode);
            // console.log("Response = " + r.response);
            // console.log("Sent = " + r.bytesSent);
            setTimeout(function(){ 
                  myApp.closeNotification(".notification-item");
                  $$('#smallImage').attr('src','');
                  $$('#videoArea').html('');
                  $$('#caption').val('');
                  myApp.closeModal();
             }, 1000);
        }

        function fail(error) {
            //alert("An error has occurred: Code = " + error.code);
            // alert("upload error source " + error.source);
            // alert("upload error target " + error.target);
            myApp.alert("An error has occurred");
            myApp.closeNotification(".notification-item");
        }


        function capturePhoto() {
          // Take picture using device camera and retrieve image as base64-encoded string
          navigator.camera.getPicture(onPhotoURISuccess, onFail, 
            { 
                quality: 50,
                destinationType: destinationType.FILE_URI,
                saveToPhotoAlbum: true

            });
        }

        function captureVideo() {
          navigator.device.capture.captureVideo(videoSuccess, onFail, 
            {
              limit:2
            });
        }


        // capture callback
        var videoSuccess = function(mediaFiles) {
            var i, path, len;
            for (i = 0, len = mediaFiles.length; i < len; i += 1) {
                path = mediaFiles[i].fullPath;
                // do something interesting with the file               
            }

                $$('#smallImage').attr('src', path);
                $$('#smallImage').css('display','none');
                var videoArea = document.getElementById('videoArea');
                videoArea.style.display = 'block';

                var v = "<video style='background:#000;' width='100' height='75' controls='controls'>";
                v += "<source src='" + path + "' type='video/mp4'>";
                v += "</video>";
                document.querySelector("#videoArea").innerHTML = v; 
                myApp.popup('.popup-media');
        };


var myApp = new Framework7({
 // Hide and show indicator during ajax requests
    onAjaxStart: function (xhr) {
        myApp.showIndicator();
    },
    onAjaxComplete: function (xhr) {
        myApp.hideIndicator();
    }

}); 
//And now we initialize app
myApp.init();

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true,
    domCache: true //enable inline pages
});

// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('about', function (page) {
    // run createContentPage func after link was clicked
    $$('.create-page').on('click', function () {
        createContentPage();
    });
});

// In page events:
$$(document).on('pageInit', function (e) {
    // Page Data contains all required information about loaded and initialized page 
    var page = e.detail.page;
    client = page.query.client;

    if (page.name === 'yolo') {
        title = page.query.title;
        project = page.query.project;
        ftp = page.query.ftp;
        psw = page.query.psw;
        $$('#createPicker').html('<a href="#" onclick="createPicker(client,project)">View in Media Player</a>');
        //$$('#upload-title').text(title);
    }
});

// In page events:
$$(document).on('pageReinit', function (e) {
    // Page Data contains all required information about loaded and initialized page 
    var page = e.detail.page;
    if (page.name === 'yolo') {
        title = page.query.title;
        client = page.query.client;
        project = page.query.project;
        ftp = page.query.ftp;
        psw = page.query.psw;
        $$('#createPicker').html('<a href="#" onclick="createPicker(client,project)">View in Media Player</a>');
        //$$('#upload-title').text(title);
    }
});
 
$$('.capture-media').on('click', function() {
    capturePhoto();
});

$$('.capture-video').on('click', function() {
    captureVideo();    
});

$$('.select-media').on('click', function() {
    getPhoto();    
});

$$('#cancelButton').on('click', function() {
     myApp.closeModal();
    $$('#smallImage').attr('src','');
    $$('#videoArea').html('');
});

$$('#logOut').on('click', function() {
    myApp.formDeleteData('my-form');
    myApp.formDeleteData('login');
    myList.deleteAllItems();
    myApp.loginScreen();  
});


$$('.login-screen').on('closed', function () {
    $$('#login').find("input[type=text], textarea").val('');
    $$('#login').find("input[type=password], textarea").val('');
    userPass = myApp.formGetData('login');
    if(userPass != null){
        testCall(userPass['username'], userPass['password']);
    }
    if(userPass == null){
        myApp.alert(userPass);
    }
});

$$('.picker-modal').on('open', function () {
});


function createPicker(client, project) {
  // Check first, if we already have opened picker
  if ($$('.picker-modal.modal-in').length > 0) {
    myApp.closeModal('.picker-modal.modal-in');
  }
  myApp.pickerModal(
    '<div class="picker-modal picker-1">' + 
      '<div class="toolbar">' +
        '<div class="toolbar-inner">' +
          '<div class="left"></div>' +
          '<div class="right"><a href="#" class="close-picker">Done</a></div>' +
        '</div>' +
      '</div>'+
      '<div class="picker-modal-inner">' +
        '<div class="content-block">' +
            '<iframe src="https://s3-eu-west-1.amazonaws.com/shootitlive/shootitlive.iframe.v1.html?client=' + client + '&project=' + project + '&width=400" scrolling="no" width="380px%" height="214px" frameBorder ="0" allowTransparency="true"></iframe>' +
        '</div>' +
      '</div>' +
    '</div>' 
  )
}    

function testCall(usr, psw){
            var userName = usr;
            var passWord = psw;
            projectArr = [];
      
            $$.ajax({
                    type: "GET",
                    dataType: "json",
                    url: "https://auth.shootitlive.com",
                    headers: {"Content-Type":"application/json; charset=UTF-8"},
                    data: {
                        user: userName,
                        password: passWord,
                    },
                    success: function(data) {
                        if(data.project){
                               for (var i = 0; i < data.project.length; i++) {                    
                                    projectArr.push({ 
                                        "title": data.project[i]['description'], 
                                        "client": data.client,
                                        "project": data.project[i]['project'],
                                        "ftp": data.project[i]['ftp-address'],
                                        "psw": data.project[i]['ftp-pw'],
                                    });
                                }
                                $$('#mainTitle').text(data.client + ' PROJECTS');
                                myList.appendItems(projectArr);
                                mainView.router.back();
                        }
                        if(data.error){
                            myApp.alert(data.error, 'Error', function () {
                                myApp.loginScreen();
                            });

                        }
                    },
                    error: function(data) {
                            myApp.alert('error');
                    }
                });
}

//INIT VIRTUAL LIST
item = [];
var myList = myApp.virtualList('.list-block.virtual-list', {
items: item,
// Template 7 template to render each item
template: '<li><a href="#yolo?title={{title}}&client={{client}}&project={{project}}&ftp={{ftp}}&psw={{psw}}" class="item-link"><div class="item-content">' +
              '<div class="item-inner">' +
                  '<div class="item-title">{{title}}</div>' +
              '</div></div></a>' +
           '</li>'
}); 

// Pull to refresh content
var ptrContent = $$('.pull-to-refresh-content');
 
// Add 'refresh' listener on it
ptrContent.on('refresh', function (e) {
    // Emulate 2s loading
    setTimeout(function () {
        // When loading done, we need to reset it
        myApp.pullToRefreshDone();
    }, 2000);
});

$$('#uploadButton').on('click', function() {
    var imgsrc = $$('#smallImage').attr('src');   
    var captionInput = $$('#caption').val();
    uploadPhoto(imgsrc, captionInput, client, project, ftp, psw);
    myApp.addNotification({
        title: 'Uploading',
        subtitle: '',
        message: '<div class="demo-progressbar-load-hide"><p style="margin:20px 0 20px 0;"></p></div>',
        closeIcon: false
    });

    var container = $$('.demo-progressbar-load-hide p:first-child');

    if (container.children('.progressbar').length) return; //don't run all this if there is a current progressbar loading
    myApp.showProgressbar(container, 0);
    // Simluate Loading Something
    var progress = 0;
    function simulateLoading() {
        setTimeout(function () {
            var progressBefore = progress;
            progress += Math.random() * 20;
            myApp.setProgressbar(container, progress);
            if (progressBefore < 90) {
                simulateLoading(); //keep "loading"
            }
            //else myApp.hideProgressbar(container); //hide
        }, Math.random() * 200 + 200);
    }
    simulateLoading();
});

function getExtension(filename) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
}

function isImage(filename) {
    var ext = getExtension(filename);
    switch (ext.toLowerCase()) {
    case 'jpg':
    case 'gif':
    case 'bmp':
    case 'png':
        //etc
        return true;
    }
    return false;
}

function isVideo(filename) {
    var ext = getExtension(filename);
    switch (ext.toLowerCase()) {
    case 'm4v':
    case 'avi':
    case 'mpg':
    case 'mp4':
    case 'mov':
        // etc
        return true;
    }
    return false;
}