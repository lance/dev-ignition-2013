var vertx     = require('vertx');
var container = require('vertx/container');

var server    = vertx.createHttpServer();
var config    = container.config;

server.requestHandler(function(req) { 
    req.response.sendFile('resources/' + (req.path() == '/' ? 'index.html' : req.path()));
});

vertx.createSockJSServer(server).bridge({prefix: '/eventbus'}, 
    config.web.inbound_permitted, [{}]);

server.listen(8080, 'localhost');

