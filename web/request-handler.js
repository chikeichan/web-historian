var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
// require more modules/folders here!

var sendResponse = function(res,data,statusCode, header){
  statusCode = statusCode;
  res.writeHead(statusCode, header);
  res.end(JSON.stringify(data));
}

var actions = {
  'GET': function(req,res){
    var url = archive.paths.archivedSites+req.url;
    if(req.url === '/'){
      url = __dirname + '/public/index.html';
    }
    fs.readFile(url,'utf-8', function(err, data){
      if(err){
        sendResponse(res,'404',404,{});
      } else {
        sendResponse(res, data ,200, {'context-type': 'text/html'});
      }
    });
  },
  'POST':function(req,res){
    archive.addUrlToList(req._postData.url);
    sendResponse(res,undefined,302,{'context-type': 'text/html'});
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
