define([
    'app',
    'backbone',

    'collections/commits',

    'models/commit'

], function(app, Backbone, CommitsCollection, CommitModel) {

    var commitsPerDateView = Backbone.View.extend({

        template: Handlebars.compile( $('#commits_per_template').html() ),

        serialize: function ( coll ) {
            // 
            return { dates: coll.commitsByDate() };
        },

        render: function( coll ) {
            this.$el.html(this.template( this.serialize( coll )));
            return this;
        }

    });

    return commitsPerDateView;

});

