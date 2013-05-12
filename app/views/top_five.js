define([
    'backbone',

    'collections/commits',

    'models/commit'

], function(Backbone, CommitsCollection, CommitModel) {

    var topFiveView = Backbone.View.extend({

       initialize: function (options) {

            _.extend(this, options || {});
            render = _.bind(this.render, this);

            this.commits.deferred.done( render );
        },

        template: Handlebars.compile( $('#top_five_template').html() ),

        serialize: function () {
            // return an object containing the last 5 commits (just the
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

