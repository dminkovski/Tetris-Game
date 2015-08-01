function Tetrimino(type)
{
  this.id = 0;
  this.x = 0; //Starting X Coordinate || Column Offset
  this.y = 0; //Starting Y Coordinate || Row Offset
  this.type = ''; //Type of Tetrimino
  this.color = ''; //Color of Tetrimino
  this.rotation = 'TOP';
  this.fields = []; //Field Mapping of Tetrimino Object
  this.tetriminos = [{'type':'I','color':'#2c3e50','fields':[[0,'I',0,0],[0,'I',0,0],[0,'I',0,0],[0,'I',0,0]]},  //Tetrimino Default Setup
  	             {'type':'J','color':'#3498db','fields':[[0,'J',0],[0,'J',0],['J','J',0]]},
              	 {'type':'L','color':'#e67e22','fields':[[0,'L',0],[0,'L',0],[0,'L','L']]},
              	 {'type':'O','color':'#f2ca27','fields':[[0,'O','O',0],[0,'O','O',0]]},
              	 {'type':'S','color':'#1abc9c','fields':[[0,0,0,0],[0,'S','S',0],['S','S',0,0]]},
              	 {'type':'T','color':'#8e44ad','fields':[[0,0,'T',0],[0,'T','T','T'],[0,0,0,0]]},
              	 {'type':'Z','color':'#c0392b','fields':[[0,0,0,0],[0,'Z','Z',0],[0,0,'Z','Z']]}];
  this.init = function(type)
  {
    //Constructor for Tetrimino Generation
    var nextIndex = Math.floor(Math.random() * this.tetriminos.length);
    if(type != undefined && type != null) for(var index in this.tetriminos) if(this.tetriminos[index].type == type) nextIndex = index;
    return $.extend( this, this.tetriminos[nextIndex] );
  }
  return this.init(type);
}
Tetrimino.prototype.move = function(direction,amount)
{
  //Change X | Y Coordinates of the Tetrimino
  var newTetrimino = jQuery.extend({}, this);
 switch(direction)
 {
   case 'RIGHT':
   newTetrimino.x += amount;
   break;
   case 'LEFT':
   newTetrimino.x -= amount;
   break;
   case 'DOWN':
   newTetrimino.y += amount;
   break;
 }
 return newTetrimino;
}
Tetrimino.prototype.rotate = function()
{
  //Rotate the Tetrimino

	var rotatedTetrimino = new Tetrimino(this.type);
  rotatedTetrimino.x = this.x;
  rotatedTetrimino.y = this.y;
  rotatedTetrimino.id = this.id;

  var center = {'x':1,'y':1};
  var newFields = [];
  for(var i = 0;i < this.fields[0].length;i++)
  {
    //new row
    var row = [];
    for(var j = 0; j < this.fields.length;j++)
    {
      row.push(0);
    }
    newFields.push(row);
  }
  rotatedTetrimino.fields = newFields;

  for(var i = 0;i < this.fields.length;i++)
  {
    //new row
    for(var j = 0; j < this.fields[i].length;j++)
    {
      rotatedTetrimino.fields[j][this.fields.length-1-i] = this.fields[i][j];
    }
  }

  return rotatedTetrimino;
}
Tetrimino.prototype.resetFields = function()
{
  //Reset all Fields
  for(var i = 0;i < this.fields.length;i++)
  {
    for(var j = 0; j < this.fields[i].length;j++)
    {
      this.fields[i][j] = 0;
    }
  }
  return this;
}
Tetrimino.prototype.getWidth = function()
 {
   //Calculate Width of Block
   var indexes = [];
   for(var i = 0;i < this.fields.length;i++)
   {
     for(var j = 0; j < this.fields[i].length;j++)
     {
       if(this.fields[i][j] != 0)
       {
         if(indexes.indexOf(j) < 0) indexes.push(j);
       }
     }
   }
   return indexes.length;
 }
 Tetrimino.prototype.getHeight = function()
  {
    //Calculate Height of Block
    var indexes = [];
    for(var i = 0;i < this.fields.length;i++)
    {
      for(var j = 0; j < this.fields[i].length;j++)
      {
        if(this.fields[i][j] != 0)
        {
          if(indexes.indexOf(i) < 0) indexes.push(i);
        }
      }
    }
    return indexes.length;
  }
 Tetrimino.prototype.getXOffset = function()
 {
   //[0,0,0,0],[0,0,'J',0],[0,0,'J',0],[0,'J','J',0]
   var columns = 0;
   var count = true;
   for(var i = 0;i < this.fields[0].length;i++)
   {
     var empty = 0;
     for(var j = 0; j < this.fields.length;j++)
     {
       if(this.fields[j][i] == 0)
       {
         empty +=1;
       }
       else count = false;
     }
     if(empty == this.fields.length && count) columns++;
   }
   return columns;
 }
Tetrimino.prototype.getYOffset = function()
{
  var rows = 0;
  for(var i = 0;i < this.fields.length;i++)
  {
    var empty = 0;
    for(var j = 0; j < this.fields[i].length;j++)
    {
      if(this.fields[i][j] == 0)
      {
        empty +=1;
      }
    }
    if(empty == this.fields[i].length) rows++;
  }
  return rows;
}
