(function(angular) {
	angular
		.module("myApp")
		.controller('chatController', controller);
		
	function controller($scope, $state, $mdToast, socketService) {
		if(!socketService.user) {
			if(socketService.isMobile)
				$state.go('loginMobile');
			else
				$state.go('login');
		}
		$scope.data = "";
		$scope.send = send;

		var delivery = new Delivery(socketService);

		delivery.on('delivery.connect',function(delivery){
			console.log('file delivery connected');
		});

		delivery.on('send.success',function(fileUID){
			console.log("file was successfully sent.");
			$mdToast.show(
				$mdToast
					.simple()
					.textContent("file sent successfully..!")
					.position("top left")
					.hideDelay(3000)
			);
		});
		
		$scope.showFaces = false;
		$scope.toggleFaces = toggleFaces;
		
		function toggleFaces() {
			$scope.showFaces = !$scope.showFaces;
		}
		
		function send(){
			var chat = document.getElementById("chat").value;
			if(chat != "") {
				socketService.emit('chat message', chat);
				document.getElementById("chat").value="";
			} else if (document.getElementById("file").files[0]){
				// file send
				var file = document.getElementById("file").files[0];
				var extraParams = {foo: 'bar'};
				delivery.send(file, extraParams);
				// file send end
				$mdToast.show(
					$mdToast
						.simple()
						.textContent("sending file..!")
						.position("top left")
						.hideDelay(3000)
				);
			} else {
				//alert("what the fuck are you trying to send ? type something..!");
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