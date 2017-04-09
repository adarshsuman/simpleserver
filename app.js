const http = require('http');
const path = require('path');
const url = require('url');
const fs = require('fs');

var mimeTypes = {
    "html": "text/html",
	"jpeg": "image/jpeg",
	"jpg": "image/jpg",
	"png": "image/png",
	"js": "text/javascript",
	"css": "text/css"
};

http.createServer(function(req, res){
    var uri = url.parse(req.url).pathname;
    var filename = path.join(process.cwd(),unescape(uri));
    console.log('loading' + uri);
    console.log(filename);
    var stats;
    try{
        stats = fs.lstatSync(filename);
    }catch(e){
        res.writeHead(404, {'Content-type': 'text/html'});
        res.write('404 not found\n');
        res.end();
        return;
    }
    if(stats.isFile){
        var mimetype = mimeTypes[path.extname(filename).split(".").reverse[0]];
        res.writeHead(200, {'Content-type':mimetype});
        fs.createReadStream(filename, 'utf8').pipe(res);
    }
    else if(stats.isDirectory){
        res.writeHead(302, {'location':'index.html'});
        res.end();
    }
    else{
        res.writeHead(500, {'Content-type': 'text/html'});
        res.write('500 Internal Server error\n');
        res.end();
    }
}).listen(1337, '127.0.0.1');