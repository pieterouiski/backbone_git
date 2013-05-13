// a view showing a list of committers (authors) and the corresponding number
// of commits for each
// (based on the Commits collection)
//
define([
    'backbone',

    'collections/commits',

    'models/commit'

], function(Backbone, CommitsCollection, CommitModel) {

    var commitsPerDateView = Backbone.View.extend({

        events: {
            'click .update': 'update'
        },

        one_day: 24 * 60 * 60 * 1000,

        unit_map: { Days: 1, Weeks: 7, Months: 30 },

        time_slice: 24 * 60 * 60 * 1000, // default time_slice is one day

        slice_units: 'Days', // default slice is one day
        slice_size: 1, // default, one slice

        // when the Commits collection is finished fetching, call the render
        // function to display the results
        //
        initialize: function (options) {

            _.extend(this, options || {});
            var render = _.bind(this.render, this);

            this.commits.deferred.done( render );
            this.commits.on('reset', render);
        },

        // create template function
        //
        template: Handlebars.compile( $('#commits_per_template').html() ),

        // return an object containing a list of Dates, with the number of
        // commits that occurred on each Date
        //
        serialize: function ( ) {
            return { slice_units: this.slice_units, slice_size: this.slice_size, slices: this.commits.commitsBySlice(this.time_slice).reverse() };
        },

        render: function( ) {
            this.$el.html(this.template( this.serialize() ));

            // set the Slice Units <select> to the current units value
            this.$('option[value="'+this.slice_units+'"]').attr('selected', 'selected');

            return this;
        },

        // update the slice size & units when the user makes a change,
        // then re-render
        update: function() {
            this.slice_size = this.$('.slice_size').val();
            this.slice_units = this.$('.slice_units').val();
            this.time_slice = this.slice_size * this.unit_map[ this.slice_units ] * this.one_day;
            this.render();
        }

    });

    return commitsPerDateView;

});

