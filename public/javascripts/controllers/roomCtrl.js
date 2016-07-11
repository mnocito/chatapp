app.controller('roomCtrl', ['chatSocket', '$scope', '$http', '$location', 'Flash', '$window', '$routeParams', '$mdDialog', '$anchorScroll', function(chatSocket, $scope, $http, $location, Flash, $window, $routeParams, $mdDialog, $anchorScroll) {
	//init vars
	var audio = new Audio('/sounds/notification.mp3');
	$scope.messages = [];
	$scope.users = [];
	$scope.curChannel = "main";
	$scope.roomName = $routeParams.name;
	$http.get('/chat/' + $routeParams.name + "/" + "main").success(function(res) {
			$scope.messages = res.messages;
		})
		// change channels + add messages/channels

	$scope.addChannel = function() {
		chatSocket.emit('addChannel', {
			room: $scope.room.name,
			channel: $scope.newChannel
		})
		$scope.newChannel = "";
		$mdDialog.hide();
	}
	$scope.addmsg = function() {
		$scope.curmsg = {
			createdby: $scope.username,
			body: $scope.message,
			room: $scope.roomName,
			channel: $scope.curChannel
		}
		chatSocket.emit('newMessage', $scope.curmsg)
		$scope.message = "";
	}
	$scope.toChannel = function(channel) {
		$http.get('/chat/' + $routeParams.name + "/" + channel).success(function(res) {
			$scope.messages = res.messages;
			chatSocket.emit('joined', {
				createdby: $scope.username,
				body: "has joined the chat",
				room: $routeParams.name,
				channel: channel,
				prevChannel: $scope.curChannel
			})
			$scope.curChannel = channel;
		})
	}

	// chatsocket stuff

	chatSocket.on('connect', function() {

		// emit current room

		chatSocket.emit('room', $scope.roomName);

		// add messages

		chatSocket.on('message', function(msg) {
			//audio.play();
			if ($scope.curChannel == msg.channel) {
				$scope.messages.push(msg)
			}

		});

		// set room (unnecessary?)

		chatSocket.on('room', function(room) {
			$scope.room = room.room;
		})

		// client algorithm n stuff

		chatSocket.on('clients', function(clientlist) {
			var tempclients = [];
			for (var k in clientlist.clients) {
				console.log(clientlist.clients[k])
				if (clientlist.clients[k].room == $routeParams.name) {
					tempclients.push(clientlist.clients[k].nickname)
					console.log(tempclients)
				}
			}
			var discuser = difference($scope.users, tempclients);
			if (discuser) {
				$scope.messages.push({
					createdby: discuser,
					body: "has left the server"
				})
			}
			$scope.users = tempclients;
		})

		// get poke stuff

		chatSocket.on('pokemsg', function(poke) {
			$scope.receivedpoke = poke;
			$mdDialog.show({
				clickOutsideToClose: true,
				scope: $scope,
				preserveScope: true,
				templateUrl: "/partials/dialogs/showpokedialog.html",
				hasBackdrop: true,
				controller: function DialogController($scope, $mdDialog) {
					$scope.closeDialog = function() {
						$mdDialog.hide();
					}
				}
			})
		})

	});

	// dialog handlers
	$scope.pokeDialog = function(ev, user) {
		$scope.pokeuser = user;
		$mdDialog.show({
			clickOutsideToClose: true,
			scope: $scope,
			preserveScope: true,
			templateUrl: "/partials/dialogs/pokedialog.html",
			targetEvent: ev,
			hasBackdrop: true,
			controller: function DialogController($scope, $mdDialog) {
				$scope.closeDialog = function() {
					$mdDialog.hide();
				}
			}
		});
	}
	$scope.sendPoke = function() {
		$mdDialog.hide();
		var poke = {
			createdby: $scope.username,
			to: $scope.pokeuser,
			body: $scope.pokemessage
		}
		chatSocket.emit('poke', poke);
	}
	$scope.newRoomDialog = function(ev) {
		$mdDialog.show({
			clickOutsideToClose: true,
			scope: $scope,
			preserveScope: true,
			templateUrl: "/partials/dialogs/newroomdialog.html",
			targetEvent: ev,
			hasBackdrop: true,
			controller: function DialogController($scope, $mdDialog) {
				$scope.closeDialog = function() {
					$mdDialog.hide();
				}
			}
		});
	}
	$scope.showDialog = function(ev) {
		$scope.username = "";
		$mdDialog.show({
			scope: $scope,
			preserveScope: true,
			templateUrl: "/partials/dialogs/namedialog.html",
			targetEvent: ev,
			hasBackdrop: true,
			controller: function DialogController($scope, $mdDialog) {
				$scope.closeDialog = function() {
					$mdDialog.hide();
				}
			}
		});

	}
	$scope.getName = function() {
		$mdDialog.hide();
		console.log($scope.username)
		$scope.show = true;
		chatSocket.emit('joined', {
			createdby: $scope.username,
			body: "has joined the server",
			room: $routeParams.name,
			channel: $scope.room.channels[0]
		})
	};
	$scope.showRoomDialog = function(ev) {
		$mdDialog.show({
			scope: $scope,
			preserveScope: true,
			templateUrl: "/partials/dialogs/roomdialog.html",
			targetEvent: ev,
			hasBackdrop: true,
			controller: function DialogController($scope, $mdDialog) {
				$scope.closeDialog = function() {
					$mdDialog.hide();
				}
			}
		});
	}
	$scope.gotoRoom = function() {
		$location.path("/room/" + $scope.room)
	}
}]);

// internal functions
function difference(a1, a2) {
	var result;
	for (var i = 0; i < a1.length; i++) {
		if (a2.indexOf(a1[i]) === -1) {
			console.log(a1[i])
			result = a1[i];
		}
	}
	return result;
}