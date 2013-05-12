// an individual commit (checkin) to a GitHub repository
//
define([
    'lodash',
    'backbone'

], function (_, Backbone) {

    var model = Backbone.Model.extend({
        obj_type: 'commit',
        idAttribute: 'sha'
    });

    return model;
});

