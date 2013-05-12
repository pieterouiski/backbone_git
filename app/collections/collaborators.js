// collection of the people who collaborated (committed) to a given GitHub repository
//
define([
    'backbone',
    'models/collaborator'

], function (Backbone, Collaborator) {

    var collection = Backbone.Collection.extend({

        url: 'https://api.github.com/repos/documentcloud/backbone/collaborators',
        model: Collaborator,

        // initial fetch, store the deferred
        initialize: function() {
            this.deferred = this.fetch();
        }

    });

    return collection;
});
