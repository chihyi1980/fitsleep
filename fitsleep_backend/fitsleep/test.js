
var jwtUtil = require('./util/jwtUtil.js');
var http = require('http');
var APP_ID = 'ed7fd9fcf4ad47eaa4e4a35df61cadd4';

http.createServer(function (req, res)
{

        var body = [];
        var signature = '';
        req.on('error', function (err) {
                console.error(err);
        }).on('data', function (chunk) {
                body.push(chunk);
        }).on('end', function () {
            var reqBody = Buffer.concat(body).toString();

            console.log(reqBody);

            signature = jwtUtil.genFtiSleepSign(reqBody);

            var resHeader =
                {
                    'Content-Type': 'text/plain',
                    'appid': APP_ID,
                    'signMethod': 'aksk',
                    'signature': signature,
                    'signTimestamp': new Date().format('yyyyMMddHHmmss'),
                    'authorization': signature
                };

            var resBody =
                {
                    'returnCode': 0
                };

            res.writeHead(200, resHeader);
            res.write(JSON.stringify(resBody));
            res.end();

        });


}).listen(3010);
