(function(angular) {
	angular
		.module("myApp")
		.factory('chatStore', service);
		
	function service() {
		var service = {};
		var chats = [];

		service.set = set;
		service.get = get;

		function set(msg) {
			if(msg.msg) {
				var obj = {sender: msg.sender, msg: msg.msg};
				chats.push(obj);
			} else {
				console.log("rejecting empty msg");
			}
		}

		function get() {
			return chats;
		}
		
		return service;
	}
})(angular)