// a view showing a list of committers (authors) and the corresponding number
// of commits for each
// (based on the Commits collection)
//
define([
    'backbone',

    'collections/commits',

    'models/commit'

], function(Backbone, CommitsCollection, CommitModel) {

    var commitsPerDateView = Backbone.View.extend({

       // when the Commits collection is finished fetching, call the render
       // function to display the results
       //
       initialize: function (options) {

            _.extend(this, options || {});
            var render = _.bind(this.render, this);

            this.commits.deferred.done( render );
            this.commits.on('reset', render);
        },

        // create template function
        //
        template: Handlebars.compile( $('#commits_per_template').html() ),

        // return an object containing a list of Dates, with the number of
        // commits that occurred on each Date
        //
        serialize: function ( ) {
            return { dates: this.commits.commitsByDate() };
        },

        render: function( ) {
            this.$el.html(this.template( this.serialize()));
            return this;
        }

    });

    return commitsPerDateView;

});

