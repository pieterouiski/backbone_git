// - Load in globally needed jquery plugins here,
// - setup ajax settings based on environment and
// - configure layout manager
//
define([
    'jquery',
    'lodash',

    'bootstrap.min',

    'jquery.ui'

], function ($, _, settings) {

    var app = {

        git:  'api.github.com',
        user: 'documentcloud',
        repo: 'backbone',
        settings: {}
    };

    // Configure $.ajax
    $.ajaxSetup(app.settings.ajaxSetup);

    return app;

});
