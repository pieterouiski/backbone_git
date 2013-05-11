define([
    'backbone',

    'collections/commits',

    'models/commit'

], function(Backbone, CommitsCollection, CommitModel) {

    var topFiveView = Backbone.View.extend({

        template: Handlebars.compile( $('#top_five_template').html() ),

        pickCommitter: function (com) {
            return { 
                author: com,
                count:  com
            };
        },

        serialize: function ( coll ) {
            // 
            return { committers: coll.commitCount().slice(0,5) };
        },

        render: function( coll ) {
            this.$el.html(this.template( this.serialize( coll )));
            return this;
        }

    });

    return topFiveView;

});

