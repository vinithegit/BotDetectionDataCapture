var http = require('http');
var fs = require('fs');

http.createServer(function (req, res) {

    console.log('Request Received');
	
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Request-Method', '*');
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	if ( req.method === 'OPTIONS' ) {
		res.writeHead(200);
		res.end();
		return;
	}

    var body = '';

    res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
    });

    req.on('data', function (chunk) {
        body += chunk;
    });

    req.on('end', function() {
		var dir = 'sessions';
		if (!fs.existsSync(dir)){
			fs.mkdirSync(dir);
		}
		var filename = dir + '/' + new Date().getTime();
        fs.writeFile(filename + '.json', body, 'utf8');
        res.end('{"msg": "OK"}');
    })

}).listen(4560, '127.0.0.1'); console.log('Server running at http://127.0.0.1:4560/');
