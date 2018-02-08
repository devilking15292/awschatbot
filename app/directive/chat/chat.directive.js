(function(angular) {
	angular
		.module("myApp")
		.directive('chat', directive);
		
	function directive() {
		return {
			restrict: 'E',
			/*scope: {
				chatData: '=chatData',
			  },*/
			templateUrl: './app/directive/chat/chat.html',
			//controller: controller
		  };
	}
})(angular)