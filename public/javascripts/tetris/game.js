var game = {
  nickname: '', //Nickname of Player
  enabled : false, //Game running variable
  speed: 500, //Game speed
  timeOut: null,
  gamefield: null,
  previewfield: null,
  start : function(nickname,gamefield)
  {
    //Start Game and set required values
    this.enabled = true;
    this.nickname = nickname;
    this.gamefield = new Field({'target':'tetris-game-field'});
    this.previewfield = new Field({'target':'tetris-preview-field','width':4,'height':4,'preview':true});

    console.log('Game started for: '+nickname);

    //Generate First Tetrimino
    var tetrimino = new Tetrimino(null);
    tetrimino = this.gamefield.addTetrimino(tetrimino);
    var previewTetrimino = new Tetrimino(null);
    previewTetrimino = this.previewfield.addTetrimino(previewTetrimino);
    this.play();
  },
  play : function()
  {
    this.gamefield.update();
    this.previewfield.update();

    var tetrimino = this.gamefield.gameTetriminos[this.gamefield.currentTetriminoID];
    var checkTetrimino = tetrimino.move('DOWN',1);
    if(!this.gamefield.checkCollision(checkTetrimino))
    {
        //No Collision so Update;
        this.gamefield.gameTetriminos[checkTetrimino.id] = checkTetrimino;
    }
    else {
        if(checkTetrimino.y <= 1) //Newly Placed Block can not be placed -> Game Over
        {
          this.enabled = false;
          alert('Game Over!');
        }
        else {
          this.gamefield.checkCombo();

          var tetrimino = this.previewfield.gameTetriminos[this.previewfield.currentTetriminoID];
          tetrimino = this.gamefield.addTetrimino(tetrimino);
          var previewTetrimino = new Tetrimino(null);
          this.previewfield.gameTetriminos = {};
          this.previewfield.addTetrimino(previewTetrimino);
        }
        //New Tetrimino Generate && Test for End Game
    }
    if(this.enabled)
    {
      this.timeOut = window.setTimeout(function()
      {
        game.play();
      }, this.speed);
    }

  }
}
