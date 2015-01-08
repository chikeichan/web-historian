var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
// require more modules/folders here!

var header = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  "Content-type": "text/html"
};

var sendResponse = function(res,data,statusCode){
  statusCode = statusCode;
  res.writeHead(statusCode, header);
  res.end(data);
}

var actions = {
  'GET': function(req,res){
    var url = archive.paths.archivedSites+req.url;
    if(req.url === '/'){
      url = __dirname + '/public/index.html';
      //TEST =============================
      archive.downloadUrls();

      //==========================

    }
    fs.readFile(url,'utf-8', function(err, data){
      if(err){
        sendResponse(res,'404',404);
      } else {
        sendResponse(res, data ,200);
      }
    });
  },
  'POST':function(req,res){
    var url;
    req.on('data',function(body){
      url = body.toString().slice(4);
      archive.addUrlToList(url);
    })

    req.on('end',function(){
      var loading = __dirname + '/public/loading.html';
      var path = archive.paths.archivedSites+'/'+url;

      fs.readFile(path,'utf-8', function(err, data){
        if(err){
          fs.readFile(loading,'utf-8', function(err, loadingPage){
            sendResponse(res, loadingPage ,200);
          });
        } else {
          sendResponse(res, data ,200);
        }
      });


    })
  }
}

exports.handleRequest = function (req, res) {
  var action = actions[req.method];
  if(action){
    action(req,res);
  } else {
    //some kind of error handling
  }
};
