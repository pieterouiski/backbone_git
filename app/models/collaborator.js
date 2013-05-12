// an individual contributor (committer)
//
define([
    'lodash',
    'backbone'

], function (_, Backbone) {

    var model = Backbone.Model.extend({
        obj_type: 'collaborator',
        idAttribute: 'author'
    });

    return model;
});

