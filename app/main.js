// application 'main'
// creates two collections:
//      Collaborators (people who commit to a given GitHub repository)
//      Commits (what was committed to a given GitHub repository)
//
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

    // create the two collections.
    // Each one triggers a fetch() in its constructor
    //
    var commits = new CommitsCollection();
    var collaborators = new CollaboratorsCollection();

    // create the four views,
    // each one renders itself in the given DIV when the fetchs above are
    // finished
    //
    var lastFiveView = new LastFiveView({commits: commits, el: $('.last_five')});
    var topFiveView = new TopFiveView({commits: commits, el: $('.top_five')});
    var commitsPerView = new CommitsPerView({commits: commits, el: $('.by_date')});
    var slackersView = new SlackersView({commits: commits, collaborators: collaborators, el: $('.slackers')});

    // when the next/first buttons are clicked,
    // tell the 'commits' collection to move forward/backward one page
    $('.next').bind('click', function () { commits.fetchNext() });
    $('.first').bind('click', function () { commits.fetchFirst() });
});
