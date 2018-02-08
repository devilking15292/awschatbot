(function(angular) {
	angular
		.module("myApp")
		.config(router);
		
	function router($stateProvider, $urlRouterProvider) {
		$stateProvider
			/*.state('login', {
				url: '/login',
				controller  : "loginController",
				templateUrl : "./app/login/login.html"
			})
			.state('chat', {
				url: '/chat',
				controller  : "chatController",
				templateUrl : "./app/chat/chat.html"
			})
			.state('loginMobile', {
				url: '/loginMobile',
				controller  : "loginController",
				templateUrl : "./app/login/loginMobile.html"
			})*/
			.state('chatMobile', {
				url: '/chatMobile',
				controller  : "chatController",
				templateUrl : "./app/chat/chatMobile.html"
			})
		$urlRouterProvider.otherwise('/');
	}
})(angular)