require([
    'lodash',

    'models/commit',

    'collections/commits',
    'collections/collaborators',

    'views/last_five',
    'views/top_five',
    'views/commits_per',
    'views/slackers'

], function (_,
    CommitModel, CommitsCollection, CollaboratorsCollection,
    LastFiveView, TopFiveView, CommitsPerView, SlackersView
) {

    var commits = new CommitsCollection();
    var collaborators = new CollaboratorsCollection();

    // create the four views
    var lastFiveView = new LastFiveView({commits: commits, el: $('.last_five')});

    var topFiveView = new TopFiveView({commits: commits, el: $('.top_five')});

    var commitsPerView = new CommitsPerView({commits: commits, el: $('.by_date')});

    var slackersView = new SlackersView({commits: commits, collaborators: collaborators, el: $('.slackers')});

});
