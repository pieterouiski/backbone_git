define([
    'lodash',
    'handlebars',
    'backbone',
    'collections/commits',
    'models/commit'

], function(_, Handlebars, Backbone, CommitsCollection, CommitModel) {

    var lastFiveView = Backbone.View.extend({

        template: Handlebars.compile( $('#last_five_template').html() ),

        pickCommits: function (com) {
            return { 
                message: com.get('commit').message,
                author: com.get('author').login,
                sha: com.get('sha').substring(0,10)
            };
        },

        serialize: function ( coll ) {
            var parsed_commits = _.map( coll.lastFive(), this.pickCommits );
            return {
                commits:  parsed_commits
            };
        },

        render: function( coll ) {
            this.$el.html(this.template( this.serialize( coll ) ));
            return this;
        }

    });

    return lastFiveView;
});
