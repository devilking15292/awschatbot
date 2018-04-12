(function(angular, io) {
	angular
		.module("myApp")
		.factory('socketService', service);
		
	function service() {
		var service = io;
		service.user = null;
		
		return service;
	}
})(angular, io)