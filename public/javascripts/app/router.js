//Angular Router handling the Routes
var router = angular.module('tetrisApp.router',['ngRoute'])
router.config(function($routeProvider, $locationProvider)
{
	$routeProvider.
	when('/',{
		controller: 'startController',
		templateUrl: 'partials/start.html'
	}).
	when('/game/:nickname',{
		controller: 'gameController',
		templateUrl: 'partials/game.html'
	})
	.otherwise({redirectTo: '/'});
	$locationProvider.html5Mode(true);

});
