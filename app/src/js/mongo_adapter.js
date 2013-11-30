var bus       = require('vertx/event_bus');
var container = require('vertx/container');
var timer     = require('vertx/timer');
var config    = container.config.mongo;

bus.registerHandler('mongo.status', function( message ) {
  if (message.status === 'ready') { listen(); }
});

var listen = function() {
  // initialize update listeners
  bus.send( config.address, findAllMessage, function( msg ) {
    if ( msg.status === 'ok' ) {
      msg.results.map( addListener );
    }
  });

  // initialize a finder that returns all
  bus.registerHandler( config.finder_address, function( msg, replier ) {
    bus.send( config.address, findAllMessage, function( response ) {
      if ( response.status === 'ok' ) {
        replier( response );
      }
    });
  });
};

// listen for update messages and persist to mongo
var addListener = function( record ) {
  var recordAddress = '/' + config.collection + '/' + record._id;
  bus.registerHandler(recordAddress, function(msg) {
    bus.publish(config.address, updateMessage( record._id, msg ));
  });
  return record;
};

// creates and returns a mongodb update message
var updateMessage = function( id, changes ) {
  return {
    action: 'update',
    collection: config.collection,
    criteria: {
      _id: id
    },
    objNew: {
      $set: changes
    }
  };
};

// finds all records in the collection
var findAllMessage = {
  action:     'find',
  collection: config.collection,
  sort:       {name: 1},
  matcher:    {}
};

