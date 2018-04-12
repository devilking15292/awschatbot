(function(angular) {
	angular
		.module("myApp")
		.controller('chatController', controller);
		
	function controller($scope, $state, $mdToast, $mdDialog, socketService, chatStore) {
		$scope.data = "";
		$scope.send = send;
		$scope.chatStore = chatStore.get();

		socketService.socket = socketService.connect();

		socketService.socket.on('chat message', function(resp){
			addToView(resp);
		});

		socketService.socket.on('ARN_Alert', function(resp){
			var confirm = $mdDialog.prompt()
			.title('Kindly enter your ARN')
			.placeholder('AWS RESOURCE NAME')
			.ariaLabel('ARN')
			.required(true)
			.ok('Okay!')
			.cancel('I dont have one!');
	  
		  $mdDialog.show(confirm).then(function(result) {
			socketService.socket.emit('ARN_VALUE', {'ARN': result,'id_token':localStorage.getItem('id_token')});
		  }, function() {
			$scope.status = 'open the tutorial to get AWS ARN';
		  });
		});
		
		socketService.socket.on('loggedIn', function(resp){
			$scope.user = socketService.user = resp.msg;
			$scope.userList = resp.users;
			$scope.loggedIn = true;
			$scope.$apply();
			if(socketService.isMobile)
				$state.go('chatMobile');
			else
				$state.go('chat');
		});
		
		socketService.socket.on('loggedOut', function() {
			location.reload();
		})
		
		socketService.socket.on('fakeLog', function() {
			socketService.user = null;
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
		
		function toggleFaces() {
			$scope.showFaces = !$scope.showFaces;
		}
		
		function send(){
			var chat = document.getElementById("chat").value;
			if(chat != "") {
				socketService.emit('chat message', chat);
				document.getElementById("chat").value="";
			} else {
				$mdToast.show(
						$mdToast
							.simple()
							.textContent("what the fuck are you trying to send ? type something..!")
							.position("top left")
							.hideDelay(3000)
					);
			}
		}
	}
})(angular)