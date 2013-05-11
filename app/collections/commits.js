define([
    'backbone',
    'models/commit'
], function (Backbone, Commit) {

    var collection = Backbone.Collection.extend({
        url: 'https://api.github.com/repos/documentcloud/backbone/commits',
        model: Commit,

        // last five commits
        lastFive: function () {
            return this.models.slice(0,5);
        },

        // return array of committers, with commit count for each
        commitCount: function () {

            // create array of committers, with a count of commits for each
            var counts = _.countBy(this.models, function(commit) { 
                    return commit.get('author').login; 
                });

            var counts_array = [];
            _.each(counts, function (count,author) {
                    counts_array.push({count: count, author: author});
                });

            counts_array.sort( function (a,b) {
                return b.count - a.count;
            });

            return counts_array;
        }
    });

    return collection;
});
