define([ 'jquery' ], function($) {
	$.fn.extend({
		serializeHash: function() {
			var attrs = {};

			$.each($(this).serializeArray(), function(i, field) {
				attrs[field.name] = field.value;
			});

			return attrs;
		},

		elementsHash: function() {
			var attrs = {};

			this.each(function(i, form) {
				$.each(form.elements, function(i, element) {
					attrs[element.name] = element;
				});
			});

			return attrs;
		}

	});
});
