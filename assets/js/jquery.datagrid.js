(function($){
	$.fn.datagrid = function(options){
		var element = this;
		var defaults = {
			restURL : "http://localhost:3000/tax",
			sorting : true,
			editable : true,
			pageable : true
		};
		var options = $.extend({},defaults,options);
	};
})(window.jQuery);