define([
    'app',
    'backbone',

    'collections/commits',

    'models/commit'

], function(app, Backbone, CommitsCollection, CommitModel) {

    var commitsPerView = Backbone.View.extend({

        template: 'commits_per',

        initialize: function () {
        },

        events: {
            'click .launch-instance': function () {
                Backbone.history.navigate('#workflows/instance', true);
            }
        },

        serialize: function () {
            return {
            };
        }

    });

    return commitsPerView;
});

