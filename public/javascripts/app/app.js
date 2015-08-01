//Socket
var socket = io();
//Angular App
var app = angular.module('tetrisApp',['ngRoute','tetrisApp.router']);

//Start Controller handling a User entering the Game and redirecting to Game Screen.
app.controller('startController',function($scope)
{
	//Button Start Function -> Handle User entrance
	$scope.start = function()
	{
		//Get Nickname from Angular ng-model
		var nickname= $scope.nickname.toLowerCase();
		//Validate nickname
		if(nickname != null)
		{
			//Socket -> User Entered
			socket.emit('user entered',nickname);
			//Load Game
			window.location.href ="/game/"+nickname;
		}
		else
		{
			//Validation failed -> Display Error message
			$('#error-msg').text('I am sorry but you need a nickname to play.').fadeIn('slow').delay(3000).fadeOut('slow');
		}
	}
});


app.controller('gameController',function($scope,$routeParams)
{
	$scope.nickname = $routeParams.nickname;

	 var startGame = function()
	 {
		 //Initialize Game Object and Start Game
		 game.start($scope.nickname);

		 socket.on('tetrimino', function(tetrimino){
				 alert(tetrimino);
			 });
	 }
	 //Generate Tetrimino (Optional Type)
	 $scope.generate = function()
	 {
		 console.debug('generate');
		 socket.emit('tetrimino', 'david');
	 }

	 startGame();


});
