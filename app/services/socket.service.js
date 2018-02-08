(function(angular, io) {
	angular
		.module("myApp")
		.factory('socketService', service);
		
	function service() {
		var service = io.connect();
		service.user = null;
		
		return service;
	}
})(angular, io)