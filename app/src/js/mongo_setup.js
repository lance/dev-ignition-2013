var container = require('vertx/container');
var bus       = require('vertx/event_bus');
var config    = container.config.mongo;

var setup = function() {
  // clear the demo data
  bus.send(config.address, deleteCommand, function() {
    // once we've deleted, now add back
    demoData.map( saveRecord );
    bus.publish('mongo.status', {status: 'ready'});
  });
};

var demoData = [
  { image: "keaton.gif",  name: "Buster Keaton",   votes: 0, comments: [] },
  { image: "chaplin.jpg", name: "Charlie Chaplin", votes: 0, comments: [] },
  { image: "marceau.jpg", name: "Marcel Marceau",  votes: 0, comments: [] }
];

var saveRecord = function(record) {
  bus.send(config.address, {
    action: "save",
    collection: config.collection,
    document: record
  });
  return record;
};

var deleteCommand = {
  action: "delete",
  collection: config.collection,
  matcher: {}
};

container.deployModule('io.vertx~mod-mongo-persistor~2.0.0-final', config, setup);

