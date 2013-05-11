require([
    'lodash',

    'models/commit',

    'collections/commits',

    'views/last_five',
    'views/top_five',
    'views/commits_per'

], function (_,
    CommitModel, CommitsCollection,
    LastFiveView, TopFiveView, CommitsPerView
) {

    this.displayResults = function(collection, response, options) {

        lastFiveView.render( collection );
        topFiveView.render( collection );
        commitsPerView.render( collection );
    };

    this.handleErrors = function(collection, response, options) {
        console.log("error");
    };

    var commits = new CommitsCollection();

    // setup the three views
    var lastFiveView = new LastFiveView({collection: commits, el: $('.col1')});

    var topFiveView = new TopFiveView({collection: commits, el: $('.col2')});

    var commitsPerView = new CommitsPerView({collection: commits, el: $('.col3')});


    commits.fetch({ 
            success: displayResults,
            error: handleErrors
        });

});
