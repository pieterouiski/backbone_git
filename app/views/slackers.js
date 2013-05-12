// a view that shows a list of Collaborators that have NOT
// made any commits in the current Commits collection
// Makes no assumptions about the size of Commits collection
//
define([
    'backbone'

], function(Backbone) {

    var slackersView = Backbone.View.extend({

        // when both the Commits and Collaborators collection are finished fetching, call the render
        // function to display the results
        //
        initialize: function (options) {

            _.extend(this, options || {});
            var render = _.bind(this.render, this);

            $.when(this.commits.deferred, this.collaborators.deferred).done(render);

            this.commits.on('reset', render);
            this.collaborators.on('reset', render);
        },

        // create a template function
        template: Handlebars.compile( $('#slackers_template').html() ),

        // get a list of collaborators names
        // determine which authors don't appear in the Commits collection
        //
        serialize: function () {

            // get the list of authors
            var names = this.collaborators.pluck('login');
            var slackers = [];

            // search for each collaborator in the list of commits
            //
            var that = this;
            _.forEach(names, function (name) {

                    var non_slacker = that.commits.find( function(commit) {

                            // most commits have an 'author.login'
                            if (commit.has('author')) {
                                return commit.get('author').login === name;
                            }
                            // others only have a 'commit.author.name'
                            return commit.get('commit').author.name === name;
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

