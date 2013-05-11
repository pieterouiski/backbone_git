define([ 'jquery' ], function($) {

    var Wizard = function(element, options) {
        var wizard = this;

        this.$element = $(element);
        this.options= $.extend({}, $.fn.jwizard.defaults, options);

        this.fnCallBack = $.isFunction(this.options.fnCallBack) ? this.options.fnCallBack : function () { return true; };

        this.currentStep = this.options.currentStep - 1;
        this.totalSteps = 0;
        this.stepStates = [];
        this.previousPanel = null;
        this.currentPanel = null;

        this.$steplist = this.$element.children("ul:eq(0)").addClass("navSteps");
        this.$panellist = this.$element.children("ul:eq(1)").addClass("navContent").height(this.options.height);

        if(!this.options.dynamicSteps && this.$steplist.children('li').length !== this.$panellist.children('li').length) {
            throw new Error("The number of steps needs to be equal to the number of content items");
        }

        this.start();
    };

    Wizard.prototype = {

        start: function() {
            this.renderButtons();
            this.setPanelClasses();
            this.buildSteps();
            this.bindEvents();
        },

        renderButtons: function() {
            // render navigation buttons (Next and Previous)
            var buttons = '<div class="buttons">' +
                                '<button type="button" class="previous">' +
                                    this.options.prev +
                                '</button>' +
                                '<button type="button" class="next">' +
                                    this.options.next +
                                '</button>' +
                              '</div>';
            this.$panellist.after(buttons);
            if(!this.options.useButtons) {
                $('div.buttons', this.$element).hide();
            }
        },

        setPanelClasses: function() {
            var wizard = this;
            // build up content panels
            this.$panellist.children('li').each(function(index, elem) {
                $(elem).addClass('navPanel navPanel-' + index).hide();//.height(wizard.$panellist.height());
            });
        },

        buildSteps: function() {
            var wizard = this;
            // detach steps container to add it in specific position later, build up individual steps
            //this.$steplist.detach().children('li').each(function (index, step) {
            //    var $step = $(step);
            //    var text = $step.html();
            //    $step.html('<a title="' + text + '"><span>' + text + '</span></a>');
            //});

            // add steps container back in desired position
            if (this.options.position === 'top') {
                this.$element.prepend(this.$steplist);
            } else {
                this.$element.append(this.$steplist);
            }

            // build step states, by adding only steps that have not been explicitly disabled
            this.$steps = $('li', this.$steplist);
            this.stepStates = [];
            this.$steps.each(function (index, elem) {
                if ($.inArray(index, wizard.options.disabled) === -1) {
                    wizard.stepStates.push(index);
                } else {
                    $(elem).hide();
                }
            });

            this.totalSteps = this.stepStates.length;

            // add relevant classes
            var iLastChild = this.stepStates[this.totalSteps - 1] + 1;
            $('.navSteps li:first', this.$element).addClass('first');
            $('.navSteps li:nth-child(' + iLastChild + ')', this.$element).addClass('last');

            // set widths, last item is remaining width
            /*
            var iItemWidth = Math.floor(this.$steplist.width() / this.totalSteps),
                iLastItemWidth = this.$steplist.width() - (iItemWidth * (this.totalSteps - 1));
            */
            this.$steps.each(function(index, elem) {
                $(elem).data('i', index);

                /*
                var iCurrentItemWidth = (wizard.stepStates[wizard.totalSteps - 1] === index) ? iLastItemWidth : iItemWidth;
                $(elem).width(iCurrentItemWidth).css('cursor', wizard.options.clickThrough ? 'pointer' : 'default');

                var oCurrentItemLink = $('a', $(elem));
                var iCurrentDividerWidth = (wizard.stepStates[wizard.totalSteps - 1] === index) ? 6 : 14;
                $(oCurrentItemLink).width(iCurrentItemWidth - iCurrentDividerWidth);
                */
            });
        },

        renderNavigation: function(currentStep) {
            var wizard = this;

            //console.log("[jWizard] Rendering navigation: ", currentStep);
            if (wizard.fnCallBack) {
                wizard.fnCallBack(currentStep);
            }

            // initialize buttons and panels
            var oPreviousButton = $('.previous', this.$element),
                oNextButton = $('.next', this.$element);

            // calculate current step
            if (currentStep < 0) {
                currentStep = 0;
            } else if (currentStep >= this.totalSteps) {
                currentStep = this.totalSteps - 1;
            }

            if (this.currentStep === 0) {
                $('.navSteps').addClass('firstSelected');
            } else {
                $('.navSteps').removeClass('firstSelected');
            }

            // hide/show or disable/enable previous/next buttons
            if (this.options.useButtons) {
                if (this.options.hideDisabledButtons) {
                    if (currentStep === 0) {
                        oPreviousButton.hide();
                    } else {
                        oPreviousButton.show();
                    }

                    if (currentStep === wizard.totalSteps-1) {
                        oNextButton.hide();
                    } else {
                        oNextButton.show();
                    }
                } else {
                    oPreviousButton.attr('disabled', (currentStep === 0));
                    oNextButton.attr('disabled', (currentStep === wizard.totalSteps - 1));
                }
            }

            // switch panel
            this.currentPanel = $('.navPanel-' + this.stepStates[currentStep], this.$element);
            if (this.previousPanel === null) {
                this.currentPanel.show();
            } else if (!this.previousPanel.is('.navPanel-' + this.stepStates[currentStep])) {
                this.previousPanel.hide(0, function() {
                    wizard.currentPanel.fadeIn(wizard.options.duration);
                });
            }
            this.previousPanel = this.currentPanel;
            // redraw navigation
            this.$steps.each(function(index, elem) {
                $(elem).removeClass('current done lastDone');
                if (index === wizard.stepStates[currentStep]) {
                    $(elem).addClass('current');
                } else if (index === wizard.stepStates[currentStep - 1]) {
                    $(elem).addClass('lastDone');
                } else if (index < wizard.stepStates[currentStep]) {
                    $(elem).addClass('done');
                }
            });
        },

        renderNext: function () {
            //console.log("[jWizard] Rendering next.");
            this.renderNavigation(++this.currentStep);
        },

        renderPrevious: function () {
            //console.log("[jWizard] Rendering previous.");
            this.renderNavigation(--this.currentStep);
        },

        renderStep: function (stepIndex) {
            //console.log("[jWizard] Rendering directly to step.");
            this.renderNavigation(stepIndex);
        },

        bindEvents: function() {
            var wizard = this;

            var oPreviousButton = $('.previous', this.$element),
                oNextButton = $('.next', this.$element);

            // bind handlers to buttons
            // note the lack of checking if settings.useButtons is enabled, we hide the default buttons when useButtons is disabled and
            // bind the handlers for .previous and .next regardless, so people can have their own implementations still trigger the navigation
            $(oPreviousButton).bind('click', function() {
                wizard.renderNavigation(--wizard.currentStep);
            });

            $(oNextButton, this.$element).bind('click', function() {
                wizard.renderNavigation(++wizard.currentStep);
            });

            // bind handlers to navigation steps
            if (wizard.options.clickThrough) {
                wizard.$steps.bind('click', function() {
                    var step = $(this),
                        stepData = step.data('i');
                    if (stepData === wizard.stepStates[wizard.currentStep + 1]) {
                        wizard.renderNavigation(++wizard.currentStep);
                    } else if (step.attr('class') && (step.attr('class').search(/done/i) !== -1) || (wizard.options.jump)) {
                        wizard.currentStep = stepData;
                        wizard.renderNavigation(wizard.currentStep);
                    }
                });
            }

            // render navigation with initially selected navigation step
            this.renderNavigation(wizard.currentStep);
        }
    };

    $.fn.jwizard = function(option, stepIndex) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('jwizard');
            var options = typeof option == 'object' && option;
            if(!data) {
                $this.data('jwizard', (data = new Wizard(this, options)));
            } else if (typeof option == 'string') {
                data[option](stepIndex);
            }
        });
    };

    $.fn.jwizard.defaults = {
        duration: 'medium',          // speed fading animation when switching panels
        height: '100%',                 // height wizard component
        disabled: [],                // array of step numbers to disable in a view
        useButtons: false,           // hide or show buttons
        hideDisabledButtons: true,   // hide or show previous/next buttons on first and last panel
        next: 'Next',                // label for previous button
        prev: 'Back',                // label for back button
        clickThrough: true,          // allow user to click on steps in wizard
        jump: true,                  // allows fast forwarding in the navigation process
        currentStep: 1,              // start position of wizard, starts at position 1
        position: 'top',          // position of wizard {top|bottom}
        dynamicSteps: false          // steps are loaded in dynamically instead of coded in the initial html
    };

});
