// collection of the commits to a given GitHub repository
//
define([
    'lodash',
    'backbone',
    'models/commit'
], function (_, Backbone, Commit) {

    var collection = Backbone.Collection.extend({

        url: 'https://api.github.com/repos/documentcloud/backbone/commits',
        model: Commit,

        next_page:  null, // url to the next page of commits
        first_page: null, // url to the first page of commits

        initialize: function () {

            this._getHeaders = _.bind(this.getHeaders, this);

            this.deferred = this.fetch({data: {per_page: 100}, reset: true, success: this._getHeaders, error: this.handleErrors});
        },

        parse: function (response, options) {
            // enhance each model with the timestamp of the commit
            _.each(response, function (model, i) {
                    model.timestamp = new Date( model.commit.author.date ).getTime();
                });
            return response;
        },

        // Using the saved 'next page' URL  (saved in 'getHeaders()' below )
        // fetch the next page of Commits
        //
        fetchNext: function () {
            if (this.next_page) {
                this.deferred = this.fetch({url: this.next_page, data: {per_page: 100}, reset: true, success: this._getHeaders, error: this.handleErrors});
            }
        },

        // Using the saved 'first page' URL  ( saved in 'getHeaders()' below )
        // fetch the first page of Commits
        //
        fetchFirst: function () {
            if (this.first_page) {
                this.deferred = this.fetch({url: this.first_page, data: {per_page: 100}, reset: true, success: this._getHeaders, error: this.handleErrors});
            }
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

                    return commit.get('author') ? commit.get('author').login : commit.get('commit').author.name; 
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

        // make sure commit models are ordered by timestamp
        // DESCENDING 
        // IOW: highest timestamp [newest] to lowest timestamp [oldest]
        //
        comparator: function (modelA, modelB) {
            var tsA = modelA.get('timestamp');
            var tsB = modelB.get('timestamp');
            if (tsA === tsB) return 0;
            if (tsA > tsB) return -1;
            return 1;
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
        },

        // return array of intervals, with a count of commits in that interval
        // sorted by interval
        // @slice : # of milliseconds in the slice
        //
        // Assumes collection is sorted by 'timestamp' attribute
        // (in descending order)
        //
        commitsBySlice: function( time_slice ) {

            var that = this;
            var last = -1;
            var intervals = [];
            var interval = null;

            _.each(this.models, function (model, i) {

                // this models timestamp
                var timestamp = model.get('timestamp');

                if (last === -1 || timestamp < last) { 

                    // first time through, or at the end of the current
                    // interval,
                    // create a new interval
                    //
                    last = timestamp - time_slice;

                    var endDate = new Date( timestamp ).toDateString(); // newest commit
                    var startDate = new Date( last ).toDateString(); // oldest commit

                    interval = { first: timestamp, last: last, startDate: startDate, endDate: endDate, count: 1 };
                    intervals.push( interval );

                } else {
                    // still within the current interval, increment the count
                    interval.count += 1;
                }
            });

            return intervals;
        },

        handleErrors: function(collection, response, options) {
            alert('ERROR:  failed to retrieve Commits.  \nStatus:   '+response.status+' \nReason: '+response.statusText);
        },

        getHeaders: function(collection, response, options) {

            var link = this.deferred.getResponseHeader('Link');
            var reg = /<(.*?)>.*<(.*?)>/;
            var arr = reg.exec(link);
            this.next_page = arr[1];
            this.first_page = arr[2];
        }
    });

    return collection;
});
