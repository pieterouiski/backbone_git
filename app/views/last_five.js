// a view showing a list of the last 5 commit (commit message, author, and
// commit SHA)) 
// (based on the Commits collection)
//
define([
    'lodash',
    'handlebars',
    'backbone',
    'collections/commits',
    'models/commit'

], function(_, Handlebars, Backbone, CommitsCollection, CommitModel) {

    var lastFiveView = Backbone.View.extend({

        // when the Commits collection is finished fetching, call the render
        // function to display the results
        //
        initialize: function (options) {

            _.extend(this, options || {});
            render = _.bind(this.render, this);

            this.commits.deferred.done( render );
        },

        // create a template function
        template: Handlebars.compile( $('#last_five_template').html() ),

        // pick out the message, author, and SHA from a given commit
        pickCommits: function (com) {
            return { 
                message: com.get('commit').message,
                author: com.get('author').login,
                sha: com.get('sha').substring(0,10)
            };
        },

        // pick out the message, author, and SHA properties from the last 5
        // commits, return in an object
        //
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
