var express = require('express'),
    // server = express.createServer();
    server = express();

server.use('/cocos2d', express.static(__dirname + '/cocos2d') );
server.use('/CocosDenshion', express.static(__dirname + '/CocosDenshion') );
server.use('/extensions', express.static(__dirname + '/extensions') );
server.use('/box2d', express.static(__dirname + '/box2d') );
server.use('/src', express.static(__dirname + '/src') );
server.use('/res', express.static(__dirname + '/res') );
server.use('/', express.static(__dirname + '/') );

server.get('/', function(req,res){
        res.sendfile('index.html');
            console.log('Sent index.html');
});

// server.get('/api/hello', function(req,res){
       // res.send('Hello Cruel World');
// });
server.listen(process.env.PORT || 3000);
