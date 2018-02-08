(function(angular) {
	angular
		.module("myApp")
		.controller('mainController', controller);
		
	function controller($scope, $state, $mdMedia, $mdToast, socketService, chatStore) {
		$scope.logout = logout;
		$scope.loginName = "";
		$scope.loggedIn = false;
		$scope.isMobile = socketService.isMobile = true;
		$scope.chatStore = chatStore.get();
		$scope.user = null;
		
		if(screen.width > 1000) {
			$scope.isMobile = socketService.isMobile = false;
			$state.go('login');
		} else {
			$scope.isMobile = socketService.isMobile = true;
			$state.go('loginMobile');
		}
		
		function logout() {
			socketService.emit('logout');
		}
		
		socketService.on('chat message', function(resp){
			addToView(resp);
		});
		
		socketService.on('botMessage', function(resp){
			addToView(resp);
			$scope.userList = resp.users;
			$scope.$apply();
		});
		
		socketService.on('loggedIn', function(resp){
			$scope.user = socketService.user = resp.msg;
			$scope.userList = resp.users;
			$scope.loggedIn = true;
			$scope.$apply();
			if(socketService.isMobile)
				$state.go('chatMobile');
			else
				$state.go('chat');
		});
		
		socketService.on('loggedOut', function() {
			/*socketService.user = null;
			$scope.userList = {};
			$scope.loggedIn = false;
			if(socketService.isMobile)
				$state.go('loginMobile');
			else
				$state.go('login');*/
			location.reload();
		})
		
		socketService.on('chooseDiffName', function() {
			//alert("someone's thinking like you, they already took that name");
			$mdToast.show(
				$mdToast
					.simple()
					.textContent("someone's thinking like you, they already took that name")
					.position("top left")
					.hideDelay(3000)
			);
		})
		
		socketService.on('fakeLog', function() {
			socketService.user = null;
			//alert("sorry but you have to login");
			/*if(socketService.isMobile)
				$state.go('loginMobile');
			else
				$state.go('login');*/
			$mdToast.show(
				$mdToast
					.simple()
					.textContent("sorry but you have to login")
					.position("top left")
					.hideDelay(3000)
			);
			location.reload();
			
		})
		
		function addToView(resp) {
			chatStore.set(resp);
			$scope.chatStore = chatStore.get();
			$scope.$digest();
			var mesArea = document.getElementById("messages");
			mesArea.scrollTop = mesArea.scrollHeight;
		}
	}
})(angular)