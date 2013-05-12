define([
    'backbone'
], function (Backbone) {

    var collection = Backbone.Collection.extend({
        url: 'https://api.github.com/repos/documentcloud/backbone/collaborators',

        initialize: function() {
            this.deferred = this.fetch();
        }

    });

    return collection;
});
