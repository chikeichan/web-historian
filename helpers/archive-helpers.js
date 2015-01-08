var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var fetch = require('workers/htmlfetcher.js').fetch;

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(cb){
  var path = this.paths.list;
  fs.readFile(path,'utf-8',function(err,data){
    cb(data.split('\n'));
  })
};

exports.isUrlInList = function(url,cb,error){
  var path = this.paths.list;
  this.readListOfUrls(function(urls){
    var found = false;
    urls.forEach(function(data){
      if(data === url){
        cb(data);
        found = true;
      }
    })
    if(!found){
      error(url);
    }
  })
};

exports.addUrlToList = function(url){
  var path = this.paths.list;
  var error = function(){
    fs.readFile(path,'utf-8',function(err,data){
      fs.writeFile(path,data+url+'\n');
    })
  };

  this.isUrlInList(url, function(d){
  }, error);
};

exports.isURLArchived = function(url,cb,error){
  var path = this.paths.archivedSites;
  fs.readdir(path,function(err,files){
    var found = false;
    files.forEach(function(file){
      if(file === url){
        cb(file);
        found = true;
      }
    })
    if(!found){
      error(url);
    }
  })
};

exports.downloadUrls = function(){
  var context = this;
  var success = function(url){
    console.log('URL already downloaded');
  }
  var error = function(url){
    if( url !== '' ){
      fetch(url);
    }
  };
  this.readListOfUrls(function(urls){
    urls.forEach(function(url){
      context.isURLArchived(url, success, error);
    });
  });
};
