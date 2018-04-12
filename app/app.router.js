(function(angular) {
	angular
		.module("myApp")
		.config(router);
		
	function router($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('login', {
				url: '/',
				//controller  : "loginController",
				//templateUrl : "./login/index.html"
			})
			.state('chatMobile', {
				url: '/chatMobile',
				controller  : "chatController",
				templateUrl : "./app/chat/chatMobile.html"
			})
		$urlRouterProvider.otherwise('/');
	}
})(angular)