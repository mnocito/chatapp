app.controller('mainCtrl', ['chatSocket', '$scope', '$http', '$location', 'Flash', '$window', '$mdDialog', function (chatSocket, $scope, $http, $location, Flash, $window, $mdDialog) {
	console.log($location.path())
	if($location.path().substring(0, 6) == "/room/") {
		$location.path(window.location.pathname);
	}
	$scope.showDialog = function(ev) {
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
		$window.location.href = $window.location.origin + "/room/" + $scope.room
	}
}]);
