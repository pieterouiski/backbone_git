define([
    'lodash',
    'backbone'

], function (_, Backbone) {

    var model = Backbone.Model.extend({
        urlRoot: '/repos/documentcloud/backbone/commit',
        obj_type: 'commit',
        idAttribute: 'sha'
    });

    return model;
});

