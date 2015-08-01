function Field(settings) {
  this.target = ''; //Target ID of DOM Element
	this.gameTetriminos = {}; //Active Tetriminos in Generated in Game
  this.width = 10; //Number of Columns Default 10
  this.height = 10; //Number of Rows Default 22
  this.fields = []; //Fields Map
  this.preview = false;
  this.currentTetriminoID = 0; //Active Tetrimino Index to keep track of Object
  this.init = function(settings)
  {
    if(!settings.preview)
    {
      //Initialize Gamefield -> Mainly for Control Interaction
      $(document).on('keydown',function(event)
      {
          //Keydown for Movement Control and Rotation
          var gamefield = game.gamefield;
          var tetrimino = gamefield.gameTetriminos[gamefield.currentTetriminoID];

          switch(event.keyCode)
          {
            case 37:
            //Move Tetrimino LEFT
            var checkTetrimino = tetrimino.move('LEFT',1);
            console.debug('LEFT');
            if(!gamefield.checkCollision(checkTetrimino))
            {
                //No Collision so Update;
                gamefield.gameTetriminos[checkTetrimino.id] = checkTetrimino;
            }
            break;
            case 38:
            event.preventDefault();

            //Rotate Tetrimino
            var checkTetrimino = tetrimino.rotate();
            if(!gamefield.checkCollision(checkTetrimino))
            {
                //No Collision so Update;
                gamefield.gameTetriminos[checkTetrimino.id] = checkTetrimino;
            }
            break;
            case 39:
            //Move Tetrimino RIGHT
            var checkTetrimino = tetrimino.move('RIGHT',1);
            if(!gamefield.checkCollision(checkTetrimino))
            {
                //No Collision so Update;
                gamefield.gameTetriminos[checkTetrimino.id] = checkTetrimino;
            }
            break;
            case 40:
            event.preventDefault();

            //Move Tetrimino Down Faster
            var checkTetrimino = tetrimino.move('DOWN',1);
            if(!gamefield.checkCollision(checkTetrimino))
            {
                //No Collision so Update;
                gamefield.gameTetriminos[checkTetrimino.id] = checkTetrimino;
            }
            break;
          }
      });
    }

    return $.extend({},this,settings);
  }
  return this.init(settings);
}
Field.prototype.checkCollision = function(checkTetrimino)
  {
    //Check for Collision with Wall LEFT, RIGHT, BOTTOM
    if((checkTetrimino.y) > this.height) return true;
    if((checkTetrimino.x + checkTetrimino.getXOffset()+checkTetrimino.getWidth()) > this.width) return true;
    if((checkTetrimino.x+checkTetrimino.getXOffset()) < 0) return true;

    //Check for Collision with other Tetriminos for the potential new Tetrimino
    for(var i =0; i < checkTetrimino.fields.length;i++)
     {
       for(var j  = 0; j < checkTetrimino.fields[i].length;j++)
       {
         var value = checkTetrimino.fields[i][j];
         try {
         var gameField = this.fields[j+checkTetrimino.x][i+checkTetrimino.y];
         } catch (e) {
         }
         if(value != 0) //Tetrimino has filled Field there
         {
           if(gameField != 0 && gameField != checkTetrimino.id) //Field is not Free
           {
              return true;
           }
         }
       }
     }

    return false;
  };
Field.prototype.checkCombo = function()
  {
    //If Row is full with Blocks its a combo -> overwrite field block and move everything 1 down
    var rows = [];
    for(var i =0; i < this.height;i++)
    {
      //1 Row
      var filled = 0;
      for(var  j =0; j < this.width;j++)
      {
        if(this.fields[j][i] != 0)
        {
          filled++;
        }
      }
      if(filled == this.width)
      {
        rows.push(i);
      }
    }
    for(var index in rows)
    {
      var row = rows[index];
      for(var id in this.gameTetriminos)
      {
         var tetrimino = this.gameTetriminos[id];
         if(tetrimino.y == row || tetrimino.y < row && tetrimino.y + tetrimino.getHeight() == row || tetrimino.y < row && tetrimino.y + tetrimino.getHeight() > row)
         {
           for(var i = 0; i < tetrimino.fields.length;i++)
           {
             tetrimino.fields[row-tetrimino.y][i] = 0;
           }
           //tetrimino.y += 1;
         }
         tetrimino.y += 1;
      }
    }
  };
Field.prototype.printField = function()
  {
    //JUST FOR DEBUGGING
    var print = '';
    for(var i = 0;i < this.height;i++)
    {
      print += '';
      for(var j = 0;j < this.width;j++)
      {
        var id = this.fields[j][i];
        if(id == 0) print += '[0]'; //Field is empty
        else
        {
          //Tetrimino Object with ID
          var tetrimino = this.gameTetriminos[id];
          print += '['+tetrimino.id+']';
        }
      }
      print += '\n';
      console.log(print);
    }
  };
Field.prototype.drawField = function(){
    //Draw Field function appends generated HTML to target Object -> Translates fields into HTML
    var field = $('#'+this.target);
    var html = '';
    for(var i = 0;i < this.height;i++)
    {
      html += '<div class="field-row clearfix row">';
      for(var j = 0;j < this.width;j++)
      {
        var id = this.fields[j][i];
        if(id == 0) html += '<div class="field"></div>'; //Field is empty
        else
        {
          //Tetrimino Object with ID
          var tetrimino = this.gameTetriminos[id];
          html += '<div id="'+tetrimino.id+'" class="field tetrimino" style="background:'+tetrimino.color+'"></div>';
        }
      }
      html += '</div>';
    }
    field.empty();
    field.append(html);
  };
Field.prototype.resetField = function(){
    //Reset Field and fill fields with '0'
    this.fields = [];
    //Prepare Game Field
    for(var i = 0;i < this.width;i++)
    {
      var array = [];
      for(var j =0;j < this.height;j++) array.push(0);
      this.fields.push(array);
    }
  };
Field.prototype.update = function()
  {
    this.resetField();
    for(var index in this.gameTetriminos)
    {
      var tetrimino = this.gameTetriminos[index];
      for(var i =0; i < tetrimino.fields.length;i++)
   		 {
   			 for(var j  =0; j <  tetrimino.fields[i].length;j++)
   			 {
           if(tetrimino.fields[i][j] != 0) this.fields[j+tetrimino.x][i+tetrimino.y] = tetrimino.id;
   			 }
   		 }
    }
    //this.printField(); --> JUST FOR DEBUGGING
    this.drawField();

  };
Field.prototype.addTetrimino = function(tetrimino){
     //Add Tetrimino values into fields
     console.log('Adding Tetrimino : '+tetrimino+' to Field');

     //Set Tetrimino X Value to Center the field and Calculate the Offsets to Position on Field
     tetrimino.x = Math.floor((this.width/2)-tetrimino.getWidth()/2-tetrimino.getXOffset());
     if(!this.preview) tetrimino.y = tetrimino.y - tetrimino.getYOffset();
     tetrimino.id = this.currentTetriminoID+1; //Increase so it doesnt start from 0 -> ID

     //Push tetrimino into gameTetriminos
     this.gameTetriminos[tetrimino.id] = tetrimino;
     this.currentTetriminoID = tetrimino.id;
     return this.gameTetriminos[this.currentTetriminoID];
   }
