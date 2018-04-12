(function(angular) {
	angular
		.module("myApp")
		.controller('mainController', controller);
		
	function controller($scope, $state, $mdMedia, $mdToast, socketService) {
		$scope.logout = logout;
		$scope.loginName = "";
		$scope.loggedIn = false;
		$scope.isMobile = socketService.isMobile = true;
		$scope.user = null;
		
		function logout() {
			socketService.emit('logout');
			$state.go('login');
		}
		

	}
})(angular)