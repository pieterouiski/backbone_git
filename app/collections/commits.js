// collection of the commits to a given GitHub repository
//
define([
    'backbone',
    'models/commit'
], function (Backbone, Commit) {

    var collection = Backbone.Collection.extend({

        url: 'https://api.github.com/repos/documentcloud/backbone/commits',
        model: Commit,

        initialize: function () {
            this.deferred = this.fetch({data: {per_page: 100}});
        },

        // extract the last five commits
        lastFive: function () {
            return this.models.slice(0,5);
        },

        // return array of committers, with a count of how many commits they
        // made for each (in the current models)
        commitCount: function () {

            // create array of committers, with a count of commits for each
            var counts = _.countBy(this.models, function(commit) { 
                    return commit.get('author').login; 
                });

            // convert array of counts into an array of objects with count &
            // author attributes
            var counts_array = [];
            _.each(counts, function (count,author) {
                    counts_array.push({count: count, author: author});
                });

            counts_array.sort( function (a,b) {
                return b.count - a.count;
            });

            return counts_array;
        },

        // return array of commits, 
        // grouped by date, with a commit count for each
        // Sorted by # of commits
        commitsByDate: function () {

            // create array of commits, indexed by date
            var dates = _.countBy(this.models, function(commit) {
                    return commit.get('commit').author.date.slice(0,10);
                });

            // for each date, create an array of objects with count & date
            // attributes
            var dates_array = [];
            _.each(dates, function (count, date) {
                    dates_array.push({count: count, date: date});
                });

            // sort the dates array by the commit-count
            dates_array.sort( function (date_a, date_b) {

                return date_b.count - date_a.count;
            });

            return dates_array;
        }
    });

    return collection;
});
