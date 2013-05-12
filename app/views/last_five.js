define([
    'lodash',
    'handlebars',
    'backbone',
    'collections/commits',
    'models/commit'

], function(_, Handlebars, Backbone, CommitsCollection, CommitModel) {

    var lastFiveView = Backbone.View.extend({

        initialize: function (options) {

            _.extend(this, options || {});
            render = _.bind(this.render, this);

            this.commits.deferred.done( render );
        },

        template: Handlebars.compile( $('#last_five_template').html() ),

        pickCommits: function (com) {
            return { 
                message: com.get('commit').message,
                author: com.get('author').login,
                sha: com.get('sha').substring(0,10)
            };
        },

        serialize: function () {
            var parsed_commits = _.map( this.commits.lastFive(), this.pickCommits );
            return {
                commits:  parsed_commits
            };
        },

        render: function() {
            this.$el.html(this.template( this.serialize() ));
            return this;
        }

    });

    return lastFiveView;
});
