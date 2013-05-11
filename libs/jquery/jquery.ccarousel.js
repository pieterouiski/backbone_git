// Wrap everything in a define for require.js
// Based on Twitter's Bootstrap 2.0 jQuery plugins
define(['jquery'], function($) {

    var CCarousel = function(element, options) {
        // Context variable
        var ccarousel = this;
        
        // Set the element as an attribute on the plugin object for future reference.
        this.$element = $(element);
        
        // Extend the user-defined options with your sensible defaults.
        this.options = $.extend({}, $.fn.ccarousel.defaults, options);
        
        this.items = $(this.options.itemsSelector, this.$element);
        this.leftButton = $(this.options.leftSelector, this.$element);
        this.rightButton = $(this.options.rightSelector, this.$element);
        this.container= $(this.items[0]).parent();
        
        $(this.items).clone().appendTo(this.container);
        
        this.leftButton.bind('click', function() {ccarousel.leftClick();});
        this.rightButton.bind('click', function() {ccarousel.rightClick();});
        
    };
    
    CCarousel.prototype = {
        
        allItems: function () {
            return $(this.options.itemsSelector);
        },
        
        leftClick: function () {
            var last = this.allItems().eq(-1);
            
            last.detach()
                .css({'visibility': 'hidden', 'width': '0px'})
                .prependTo(this.container)
                .animate({width: '250px'}, 200, function () {
                    last.css({'visibility': 'visible'});
            });
        },
        
        rightClick: function () {
            var self = this,
                first = this.allItems().eq(0),
                replacement = first.clone();
            
            first.css({'visibility': 'hidden'})
                 .animate({width: '0px'}, 200, function () {
                    first.remove();
                    replacement.appendTo(self.container);
            });
        }
    
    };
    
    // This is what jQuery will call
    $.fn.ccarousel = function(option) {
        // Always start out with this.each to be able to cover more than one element
        return this.each(function () {
            var $this = $(this),
                // Store per element information using jQuery's data API using the name
                // of the plugin.
                data = $this.data('ccarousel'),
                // Initialization of the plugin should be done with an object
                options = typeof option == 'object' && option;
            
            // First time run initializes a new Plugin object
            if (!data) {
                // Each Plugin object receives the element and the options send when initialized
                // The data for 'myplugin' is set to the MyPlugin object itself.
                $this.data('ccarousel', (data = new CCarousel(this, options)));
                // This is the important part: allow for the calling of methods in the Plugin object
                // after initialization such that one can do $(".selector").plugin('mymethod')
                // thereby exposing an easy to use API.
            } else if (typeof option == 'string') {
                // Call the method
                data[option]();
            }
        });
    };
    
    // Use a separate and easy to understand options dictionary for default 
    // settings. Users can refer to these to understand the plugin.
    $.fn.ccarousel.defaults = {
        width: 500000,
        leftSelector: '.ccarousel-prev',
        rightSelector: '.ccarousel-next',
        itemsSelector: '.ccarousel-list li',
        text: 'Crazy man'
    };

});
