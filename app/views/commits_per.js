define([
    'backbone',

    'collections/commits',

    'models/commit'

], function(Backbone, CommitsCollection, CommitModel) {

    var commitsPerDateView = Backbone.View.extend({

       initialize: function (options) {

            _.extend(this, options || {});
            render = _.bind(this.render, this);

            this.commits.deferred.done( render );
        },

        template: Handlebars.compile( $('#commits_per_template').html() ),

        serialize: function ( ) {
            // return an object containing a list of Dates, with the number of
            // commits that occurred on each Date
            return { dates: this.commits.commitsByDate() };
        },

        render: function( ) {
            this.$el.html(this.template( this.serialize()));
            return this;
        }

    });

    return commitsPerDateView;

});

