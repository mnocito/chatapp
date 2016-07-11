var app = angular.module('skype', ['ngMaterial', 'ngRoute', 'ngFlash', 'btford.socket-io', 'luegg.directives']);
app.config(function($routeProvider, $locationProvider) {
	$locationProvider.html5Mode(true);
	$routeProvider
		.when('/', {
			templateUrl: "/partials/index.html",
			controller: "mainCtrl"
		})
		.when('/room/:name', {
			templateUrl: "/partials/room.html",
			controller: "roomCtrl"
		})
		.otherwise({
			redirectTo: '/'
		})
});
