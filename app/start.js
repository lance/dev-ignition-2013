var container = require('vertx/container');
var config    = container.config;

container.deployVerticle('src/js/mongo_adapter.js', config, function() {
  container.deployVerticle('src/js/mongo_setup.js', config);
  container.deployVerticle('src/ruby/stats.rb', config);
  container.deployVerticle('src/js/web.js', config);
});

