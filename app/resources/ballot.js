// Backbone models use "id" by default, change this
var Candidate = Backbone.Model.extend({
    idAttribute: "_id"
});

// The collection of candidates
var Ballot = Backbone.Collection.extend({
  name: 'candidates',
  url: '/candidates',
  collection: Candidate
});

// Tell Backbone that we want to sync over the event bus and then fetch all
var init = function(bus) {
  var ballot = new Ballot();

  // As models are added to the collection, display them with the view
  ballot.on('add', function(candidate) {
    $('#candidate-list').append(new CandidateView({model: candidate}).render().el);
  });

  bus.onopen = function() {
    Backbone.sync = eventBusBackbone(bus, ballot);

    // Get all of the models and load them into our collection
    ballot.fetch();

    // Display percentages
    getStats(bus);
  };
};

/**
 * Sync backbone.js models with the vert.x event bus.
 */
var eventBusBackbone = function(bus, collection) {
  /**
   * Synchronizes the model based on the method provided.
   * @param {string} method The synch method (read or update)
   * @param {{}} model The backbone.js model to synchronize.
   *        This may be a collection or individual model.
   */
  return function(method, model) {
    if (method === 'read') {
      bus.send('/' + collection.name, 'all', function( records ) {
        _.each(records.results, function( record ) {
          collection.add( new Candidate(record) );
          registerChangeHandler(bus, collection.last());
        });
      });
    } 
    else if (method === 'update') {
      bus.publish(model.url(), model.changedAttributes());
    }
  };

};

// Listen to the event bus for changes to this model
var registerChangeHandler = function(bus, record) {
  console.log(['Registering handler for', record.url()].join(' '));
  bus.registerHandler(record.url(), function(msg) {
    record.set(msg);
    getStats(bus);
  });
};

var getStats = function(bus) {
  bus.send('election.stats', 'get', function( response ) {
    $('#stats-total').html(response.total);
    $('#candidate-stats').empty();
    _.each(response.candidates, function(record, name) {
      $('#candidate-stats').append( "<li>" + name + ": " + record.percent.toFixed(2) + "%</li>" );
    });
  });
};

// Use the vertx event bus to synchronize our models
init(new vertx.EventBus('http://localhost:8080/eventbus'));


