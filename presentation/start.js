var container = require('vertx/container');

container.deployModule('io.vertx~mod-web-server~2.0.0-final', 
    { 'web_root': '.', 'port': 8000 });

