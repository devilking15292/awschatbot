(function(angular) {
	angular
		.module("myApp")
		.controller('mainController', controller);
		
	function controller($scope, $state, $mdMedia, $mdToast, $mdDialog, socketService, chatStore) {
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
			$state.go('login');
		}
		
		socketService.on('chat message', function(resp){
			addToView(resp);
		});

		socketService.on('ARN_Alert', function(resp){
			var confirm = $mdDialog.prompt()
			.title('Kindly enter your ARN')
			//.textContent('Bowser is a common name.')
			.placeholder('AWS ROLL NUMBER')
			.ariaLabel('ARN')
			//.initialValue('12fstyter322734')
			//.targetEvent(ev)
			.required(true)
			.ok('Okay!')
			.cancel('I dont have one!');
	  
		  $mdDialog.show(confirm).then(function(result) {
			socketService.emit('ARN_VALUE', {'ARN': result});
		  }, function() {
			$scope.status = 'open the tutorial to get AWS ARN';
		  });
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