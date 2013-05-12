define([
    'backbone'

], function(Backbone) {

    var slackersView = Backbone.View.extend({

        initialize: function (options) {

            _.extend(this, options || {});
            render = _.bind(this.render, this);

            // when both the Commits and Collaborators collections have been
            // fetched, render the view
            $.when(this.commits.deferred, this.collaborators.deferred).done(render);
        },

        template: Handlebars.compile( $('#slackers_template').html() ),

        serialize: function () {
            // 
            var names = this.collaborators.pluck('login');
            var slackers = [];

            var that = this;
            _.forEach(names, function (name) {

                    var non_slacker = that.commits.find( function(commit) {
                            return commit.get('author').login === name;
                        });

                    if (non_slacker === undefined) {
                        slackers.push( name );
                    }
                });

            return { slackers: slackers };
        },

        render: function() {
            this.$el.html(this.template( this.serialize()));
            return this;
        }

    });

    return slackersView;

});

