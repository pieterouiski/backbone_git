//
// This is the starting point of our Backbone application.
// We are configuring require by setting paths to oft used items
// Also are loading non-amd modules via shims

require.config({
    deps: ['main'],

    paths: {
        // CORE
        'lodash': '../libs/lodash',
        'handlebars': '../libs/handlebars',
        'backbone': '../libs/backbone',

        // JQUERY
        'jquery': '../libs/jquery/jquery',
        'jquery.ui': '../libs/jquery/jquery.ui',
        'jquery.ui.widget': '../libs/jquery/jquery.ui.widget',

        // BOOTSTRAP
        'bootstrap.min': '../libs/bootstrap.min'
    },

    // NOTE: the old 'use' has been replaced in favor of 'shim'.
    // (http://tbranyen.com/post/amdrequirejs-shim-plugin-for-loading-incompatible-javascript)
    //
    // The shim configuration is used for files which do NOT use AMD
    // They are defined with a key which is the name by which it will be imported
    // and the dependencies (deps) and resulting object (exports).
    shim: {
        'backbone': {
            deps: ['lodash', 'jquery'],
            exports: 'Backbone'
        },
        'handlebars': {
            exports: 'Handlebars'
        },
        'jquery.ui': {
            deps: ['jquery']
        }
    }
});

