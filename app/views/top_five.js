// a view of the Top 5 contributors in the current collection of Commits
// with a count of commits for each
//
define([
    'backbone'

], function( Backbone ) {

    var topFiveView = Backbone.View.extend({

        // when the Commits collection is finished fetching, call the render
        // function to display the results
        //
        initialize: function (options) {

            _.extend(this, options || {});
            var render = _.bind(this.render, this);

            this.commits.deferred.done( render );
            this.commits.on('reset', render);
        },

        // create a template function
        template: Handlebars.compile( $('#top_five_template').html() ),

        // return just the first 5 committers, obtained by asking the
        // Commits collection for a list of commiters with a count for each
        //
        serialize: function () {
            // return an object containing the first 5 commits (just the
            // author and commit count)
            return { committers: this.commits.commitCount().slice(0,5) };
        },

        render: function() {
            this.$el.html(this.template( this.serialize()));
            return this;
        }

    });

    return topFiveView;

});

