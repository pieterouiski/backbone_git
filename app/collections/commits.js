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
        // @slice : # of milliseconds in a slice
        //
        // Assumes collection is sorted by 'timestamp' attribute
        // (in descending order)
        //
        commitsBySlice: function( time_slice ) {

            var that = this;
            var new_end = -1;
            var old_end = -1;

            var intervals = [];
            var interval = null;

            _.each(this.models, function (model, i) {

                // this models timestamp
                var timestamp = model.get('timestamp');

                while ( !interval || (! that.fallsWithin( timestamp, new_end, old_end ))) {

                    // the current model doesn't fall within the current
                    // interval (or there isn't a current interval yet)
                    // create a new one with the next (incremented) 
                    // end-points
                    
                    // First time through, the old-end of the interval is based on the
                    // current models timestamp,
                    // otherwise it's the old-end of the previous interval
                    //
                    // establish endpoints for the starting interval
                    //
                    new_end = interval ? old_end : timestamp;
                    old_end = new_end - time_slice;

                    // create a new interval
                    interval = that.createInterval( new_end, old_end );
                    intervals.push( interval );
                }

                interval.count += 1;
            });

            return intervals;
        },

        // creates a new Interval object, which contains the beginning and
        // ending dates, plus a count of commits
        //
        createInterval: function (new_ts, old_ts) {

            var new_date = new Date( new_ts ).toDateString(); // newest commit
            var old_date = new Date( old_ts ).toDateString(); // oldest commit

            var interval = { new_end: new_ts, old_end: old_ts, new_date: new_date, old_date: old_date, count: 0 };
            return interval;
        },

        // convenience function for checking if a given timestamp falls within
        // the beginning and ending times
        // (from the newest timestamp to just after the oldest timestamp)
        //
        fallsWithin: function (ts, end, start) {
            if (ts <= end && ts > start) {
                return true;
            }
            return false;
        },

        // really should have more here.  Most likely error will be due to the
        // 60-query's per hour limit
        //
        handleErrors: function(collection, response, options) {
            alert('ERROR:  failed to retrieve Commits.  \nStatus:   '+response.status+' \nReason: '+response.statusText);
        },

        // retrieve the 'Link' header value for use in pagination
        // GitHub insists on using their supplied Link value instead of relying
        // on the '?page=' query string
        // Mainly because pages are less relevant than SHA values...
        //
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
