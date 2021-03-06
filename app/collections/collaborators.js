// collection of the people who collaborated (committed) to a given GitHub repository
//
define([
    'backbone',
    'models/collaborator'

], function (Backbone, Collaborator) {

    var collection = Backbone.Collection.extend({

        url: 'https://api.github.com/repos/jashkenas/backbone/collaborators',
        model: Collaborator,

        // initial fetch, store the deferred
        initialize: function() {
            this.deferred = this.fetch({reset: true, error: this.handleErrors});
        },

        handleErrors: function(collection, response, options) {
            alert('ERROR:  failed to retrieve Collaborators.  \nStatus:   '+response.status+'  \nReason: '+response.statusText);
        }

    });

    return collection;
});
