
//The dimensions of the image being used as a map is 1280 x 1280.
//Dimensions of the canvas is 640 x 640
//Canvas is located at the middle of the map. Any map position to the left and up of the canvas is negative.
//All the zombies appear at a random point 96 px = 3 Unit Vertex away from the boundaries of the map

//There are two separate positioning logic. One is to display the object on the Canvas.
//The other is for the positions on the map. Where the Game is actually being played.

//Don't forget to adjust the nagative postions each time you use the grid

//for graphics
let GRAPHICS;

//To control the GAME
let GAME;

class GameControllerZ{
  constructor(graphics, sound){
    this.mapWidth = 1280;
    this.mapHeight = 1280;

    //Map X and Map Y gets calculated from the top left corner
    this.mapX = 320;
    this.mapY = 320;

    this.state;
    this.graphics = graphics;
    this.sound = sound;
    this.shooter = new Shooter(width/2, height/2, 2, 100, this.graphics, sound.shooter);
    this.bullets = [];
    this.zombies = [];
    this.zCursor = 0;
    this.dif = 1; //1 easy, 2 medium, 3 hard

    this.addZombies = function(howMany){ //graphicsMove, sound(as a string)
      for(let i = 0; i < howMany; ++i){
          this.zombies.push(new Zombie(this.graphics.zombieMove, ( random(10) < 3 ? this.sound.zombie[int(random(24))] : null ) ) );
      }
    }

    for(let i = 0; i < 50; ++i){
      this.bullets.push(new Bullet(this.mapWidth*-1, this.mapHeight*-1));
    }

    this.bCursor = 0; //bullet cursor

    this.nextLevelZCount = 5;

    this.highScore = window.localStorage.getItem('highScoreE');

    //Level logic
    this.currentLevel = 1;
    this.levelBuffer = 400;
    this.deadZombies = 0; //This is a counter

    //Rate of which zombies appear
    //Each time zombieBuffer hits 0, a zombie appears and buffer resets to 0
    this.zombieBuffer = 0;
    this.zombieCountDown = 1;

    //Health range of the Zombies
    //Default values are for the easy game mode
    this.zHealthH = 3;
    this.zHealthL = 1;

    //Speed range of the Zombies
    //Default values are for the easy game mode
    this.zSpeedH = .02;
    this.zSpeedL = .01;

    this.shortestPath = [];

    this.mapGrid = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,0,0,0,0,1,0,0,0,0,1,1,1,0,0,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,0,1,1,0,0,0,0,1,0,0,1,0,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,0,0,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1],
                    [1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];

    this.gridUnitVertex = 32;

    this.graph = new Graph(this.mapGrid, {diagonal: true});

    //This also checks for the obstacles in the map
    //This is currently only being used for the bullets
    this.checkMapBoundary = function(x, y){

      //Here checking if it is greater than or equal to is necessary because at the moment the bullets is on the mapWidth it will
      //give an index error on the grid
      if(x <= 0 || x >= this.mapWidth || y <= 0 || y >= this.mapHeight
          || this.mapGrid[floor((y+3*this.gridUnitVertex)/this.gridUnitVertex)]
          [floor((x+3*this.gridUnitVertex)/this.gridUnitVertex)] == 0){

            return false; //remove the bullet

          }

      return true;

    }

  }

  setDificulity(dif){
    this.dif = dif;

    if(dif == 2){ //Medium

      //instead of decreasing the zombie buffer
      //increase the rate of change of the buffer
      this.zombieCountDown = 2;

      this.zHealthH = 4;
      this.zHealthL = 1;
      this.zSpeedH = .025;
      this.zSpeedL = .015;
      this.highScore = window.localStorage.getItem('highScoreM');

    }

    else{ //Hard

      //instead of decreasing the zombie buffer
      //increase the rate of change of the buffer
      this.zombieCountDown = 3;

      this.zHealthH = 5;
      this.zHealthL = 1;
      this.zSpeedH = .03;
      this.zSpeedL = .02;
      this.highScore = window.localStorage.getItem('highScoreH');

    }

  }

  update(){

    if(keyIsDown(65) && //A -- moving left
       this.shooter.getXPos() + this.mapX - this.shooter.selectedWeapon.displayWidth/2 - this.shooter.getSpeed() > 0 &&  //check map boundary
       this.mapGrid[floor((this.shooter.getYPos() + this.mapY + 3*this.gridUnitVertex)/this.gridUnitVertex)]
       [floor((this.shooter.getXPos() + this.mapX + 3*this.gridUnitVertex -
       this.shooter.selectedWeapon.displayWidth/2 - this.shooter.getSpeed())/this.gridUnitVertex)] != 0){ //check for obstacles

      if(this.mapX > 0 && this.shooter.getXPos() == 320) this.mapX -= 2;
      else this.shooter.moveLeft();

    }

    else if(keyIsDown(68) && //D -- moving right
            this.shooter.getXPos() + this.mapX + this.shooter.selectedWeapon.displayWidth/2 + this.shooter.getSpeed() < this.mapWidth && //check map boundary
            this.mapGrid[floor((this.shooter.getYPos() + this.mapY + 3*this.gridUnitVertex)/this.gridUnitVertex)]
            [floor((this.shooter.getXPos() + this.mapX + 3*this.gridUnitVertex + this.shooter.selectedWeapon.displayWidth/2 +
            this.shooter.getSpeed())/this.gridUnitVertex)] != 0){ //check for obstacles

      if(this.mapX + width < this.mapWidth && this.shooter.getXPos() == 320) this.mapX += 2;
      else this.shooter.moveRight();

    }

    //there should be seperate checks to whether move up/down
    //or to move right/left, because player should be able to
    //move dioginally
    if(keyIsDown(87) && //W -- moving up
       this.shooter.getYPos() + this.mapY - this.shooter.selectedWeapon.displayHeight/2 - this.shooter.getSpeed() > 0 && //check map boundary
       this.mapGrid[floor((this.shooter.getYPos() + this.mapY + 3*this.gridUnitVertex -
       this.shooter.selectedWeapon.displayHeight/2 - this.shooter.getSpeed())/this.gridUnitVertex)] //check for obstacles
      [floor((this.shooter.getXPos() + this.mapX + 3*this.gridUnitVertex)/this.gridUnitVertex)] != 0){

      if(this.mapY > 0 && this.shooter.getYPos() == 320) this.mapY -= 2;
      else this.shooter.moveUp();

    }

    else if(keyIsDown(83) && //S -- moving down
            this.shooter.getYPos() + this.mapY + this.shooter.selectedWeapon.displayHeight/2 + this.shooter.getSpeed() < this.mapHeight && //check map boundary
            this.mapGrid[floor((this.shooter.getYPos() + this.mapY + 3*this.gridUnitVertex +
            this.shooter.selectedWeapon.displayHeight/2 + this.shooter.getSpeed())/this.gridUnitVertex)] //check for obstacles
            [floor((this.shooter.getXPos() + this.mapX + 3*this.gridUnitVertex)/this.gridUnitVertex)] != 0) {

      if(this.mapY < this.mapHeight - height && this.shooter.getYPos() == 320) this.mapY += 2;
      else this.shooter.moveDown();

    }

    //the logic of aim rotation
    if(keyIsDown(76)){ //L
      this.shooter.cwAim();
    }
    else if(keyIsDown(75)){ //K
      this.shooter.ccwAim();
    }

    //Shooting logic

    this.shooter.update();

    if(keyIsDown(32)){ //space
      const howMany = this.shooter.shoot(this.bullets[this.bCursor], this.mapX, this.mapY); //shooter will return how many bullets were fired
      this.bCursor = (this.bCursor + howMany) % this.bullets.length;
    }

    for(let i = 0; i < this.bullets.length; ++i) {
      if(this.checkMapBoundary(this.bullets[i].getXPos(), this.bullets[i].getYPos())) {
        this.bullets[i].update();
      }
      else {
        this.bullets[i].setPos(this.mapWidth*-1 , this.mapHeight*-1); //its just a general number to remove the bullets away from the map
      }
    }

    //Zombie logic

    if(this.levelBuffer <= 0){ //Once there is level buffer there are no zombies
      if(this.zombieBuffer <= 0 && this.zCursor < this.zombies.length){

        //Reset it
        this.zombieBuffer = 300;

        //so at this point the zombies are located out of the map
        //when they are given life they will join the GAME
        this.zombies[this.zCursor].giveLife(round(random(this.zHealthL, this.zHealthH)));
        this.zombies[this.zCursor].setSpeed(random(this.zSpeedL, this.zSpeedH));
        this.zombies[this.zCursor].setPos(random(4), this.mapWidth, this.mapHeight, this.gridUnitVertex);

        //Range check is a condition for this logic gate
        //And the cursor gets reset at the beginning of each level
        ++this.zCursor;

      }

      else if(this.zCursor != this.zombies.length){

        //Count down
        this.zombieBuffer -= this.zombieCountDown;

        //constrain zombie zombieCountDown to 50
        if(this.zombieCountDown < 50) this.zombieCountDown += .0001;

      }

      //For each zombie, check if it got hit by a bullet
      //Or is it close enough
      for(let i = 0; i < this.zombies.length; ++i){

        if(this.zombies[i].isAlive()){

          for(let j = 0; j < this.bullets.length; ++j){

            //the distance between a bullet and a zombie
            //Since the x and y positions of the zombies and the bullets
            //Are based on the map there is no need to make adjustments
            if(dist(this.zombies[i].getXPos(), this.zombies[i].getYPos(), this.bullets[j].getXPos(), this.bullets[j].getYPos()) < 15){

              this.zombies[i].gotShot();
              if(!this.zombies[i].isAlive()) ++this.deadZombies;

              //instead of removing the bullets away from the array
              //just remove them outside of the map
              this.bullets[j].setPos(this.mapWidth*-1, this.mapHeight*-1);

            }

          }

          //There are three units outerspace around the map where the zombies appear
          //Top and left side of the map is negative
          //Therefore for the grid the negative postions should get adjusted

          let zombieGridX = floor((this.zombies[i].getXPos() + 3*this.gridUnitVertex)/this.gridUnitVertex),
              zombieGridY = floor((this.zombies[i].getYPos() + 3*this.gridUnitVertex)/this.gridUnitVertex);

          //Shooter's position is based on the canvas

          let shooterGridX = floor((this.shooter.getXPos() + this.mapX + 3*this.gridUnitVertex)/this.gridUnitVertex),
              shooterGridY = floor((this.shooter.getYPos() + this.mapY + 3*this.gridUnitVertex)/this.gridUnitVertex);

          //The shortest path between the player and the zombie
          //The only reason that I keep this as a member variable is to debug the path

          this.shortestPath = astar.search(this.graph, this.graph.grid[zombieGridY][zombieGridX],
                                           this.graph.grid[shooterGridY][shooterGridX], {closest: true}); //Map as a graph, start positions, target positions, options


          if(this.shortestPath.length > 0){

            let targetX = (this.shortestPath[0].y+.5)*this.gridUnitVertex - 3*this.gridUnitVertex;

            let targetY = (this.shortestPath[0].x+.5)*this.gridUnitVertex - 3*this.gridUnitVertex;

            this.zombies[i].setTargetPos(targetX, targetY); //this.shortestPath -- for debuggin purposses

          }


          this.zombies[i].update();

          //distance gets calculated based on the map
          if(dist(this.shooter.getXPos() + this.mapX, this.shooter.getYPos() + this.mapY,
                this.zombies[i].getXPos(), this.zombies[i].getYPos()) < 25 ){
            this.shooter.gotHit();
          }

          if(this.shooter.getHealth() <= 0) {
            this.state = 0; //GAME Over

            //Update local Storage
            if(this.currentLevel > this.highScore) {
              if(this.dif == 1) window.localStorage.setItem('highScoreE', this.currentLevel);
              else if(this.dif == 2) window.localStorage.setItem('highScoreM', this.currentLevel);
              else window.localStorage.setItem('highScoreH', this.currentLevel);
            }

          }

        }

      }

    }

    //level logic
    else{
      --this.levelBuffer;
    }

    if(this.deadZombies == this.zombies.length){ //once all the zombies are dead

      this.levelBuffer = 400; //set a level buffer
      this.deadZombies = 0; //reset dead zombies
      this.zCursor = 0; //reset the zombie cursor

      //FOR NOW I WANT THE HEALTH RANGE TO BE CONSTANT

      //Empower the zombies
      if(this.dif == 1) { //if the GAME mode is easy
        this.zSpeedL += .001;
        this.zSpeedH += .001;
        this.nextLevelZCount += 1;
      }

      else if(this.dif == 2){ //Medium
        this.zSpeedL += .001;
        this.zSpeedH += .002;
        this.nextLevelZCount += 2;
      }

      else{ //Hard
        this.zSpeedL += .002;
        this.zSpeedH += .003;
        this.nextLevelZCount += 3;
      }

      if(this.zSpeedH > 2.4) this.zSpeedH = 2.4;

      ++this.currentLevel; //level up

      this.addZombies(this.nextLevelZCount);

    }

  }

  display(){
    clear();
    image(this.graphics.backgroundImage, width/2, height/2, width, height, this.mapX, this.mapY, width, height);

    textSize(12);
    fill(0);

    text("Current Level: " + this.currentLevel + ", Your High Score: " + this.highScore, 530, 15); //LATER IF I HAVE TIME I CAN CHANGE THIS ROMAN LITERALS

    //display the shooter
    //Shooter's position is based on the canvas
    //No conversion is needed
    this.shooter.display(0, 0); //this is a shared method with the bot class, therefore the function requires mapX and mapY

    //display the bullets
    for(let i = 0; i < this.bullets.length; ++i) {
      this.bullets[i].display(this.mapX, this.mapY);
    }

    //display the zombies
    for(let i = 0; i < this.zombies.length; ++i) {
      if(this.zombies[i].isAlive()){
        this.zombies[i].display(this.mapX, this.mapY, this.gridUnitVertex);
      }
    }

    // fill(0,0,255); -- for debugging purposes
    // for(let i = 0; i < this.shortestPath.length; ++i){
    //   text(i, (this.shortestPath[i].y+.5)*this.gridUnitVertex - 3*this.gridUnitVertex - this.mapX,
    //        (this.shortestPath[i].x+.5)*this.gridUnitVertex - 3*this.gridUnitVertex - this.mapY);
    // }

  }

}

class Graphics{
  constructor(){
    //Background Image
    this.backgroundImage;

    //Shooter
    this.handgun = {idle: [], move: [], shoot: [], reload: []};
    this.assaultRifle = {idle: [], move: [], shoot: [], reload: []};
    this.shotgun = {idle: [], move: [], shoot: [], reload: []};

    //Zombie
    this.zombieMove = [];

  }
}

class Sound{ //Exists of html audio elements
  constructor(){

    //Shooter
    this.shooter = {
      handgun: {reload: null, shoot: null},
      shotgun: {reload: null, shoot: null },
      assaultRifle: {reload: null, shoot: null}
    };

    //Zombie
    this.zombie = [];

  }
}

function preload(){
  SOUND = new Sound();

  SOUND.shooter.handgun.shoot = document.getElementById('handgun');
  SOUND.shooter.handgun.reload = document.getElementById('reload');

  GRAPHICS = new Graphics();

  //Graphics

  GRAPHICS.backgroundImage = loadImage("Images/map.png");

  for(let i = 0; i < 20; ++i){
    GRAPHICS.handgun.idle.push(loadImage("Images/Handgun/idle/shooter_idle_handgun_" + i + ".png"));
    GRAPHICS.handgun.move.push(loadImage("Images/Handgun/move/shooter_move_handgun_" + i + ".png"));
    GRAPHICS.assaultRifle.idle.push(loadImage("Images/AssaultRifle/idle/shooter_idle_rifle_" + i + ".png"));
    GRAPHICS.assaultRifle.move.push(loadImage("Images/AssaultRifle/move/shooter_move_rifle_" + i + ".png"));
    GRAPHICS.assaultRifle.reload.push(loadImage("Images/AssaultRifle/reload/shooter_reload_rifle_" + i + ".png"));
    GRAPHICS.shotgun.idle.push(loadImage("Images/Shotgun/idle/shooter_idle_shotgun_" + i + ".png"));
    GRAPHICS.shotgun.move.push(loadImage("Images/Shotgun/move/shooter_move_shotgun_" + i + ".png"));
    GRAPHICS.shotgun.reload.push(loadImage("Images/Shotgun/reload/shooter_reload_shotgun_" + i + ".png"));
  }

  for(let i = 0; i < 3; ++i){
    GRAPHICS.handgun.shoot.push(loadImage("Images/Handgun/shoot/shooter_shoot_handgun_" + i + ".png"));
    GRAPHICS.assaultRifle.shoot.push(loadImage("Images/AssaultRifle/shoot/shooter_shoot_rifle_" + i + ".png"));
    GRAPHICS.shotgun.shoot.push(loadImage("Images/Shotgun/shoot/shooter_shoot_shotgun_" + i + ".png"));
  }

  for(let i = 0; i <  15; ++i){
    GRAPHICS.handgun.reload.push(loadImage("Images/Handgun/reload/shooter_reload_handgun_" + i + ".png"));
  }

  for(let i = 0; i < 17; ++i){
    GRAPHICS.zombieMove.push(loadImage("Images/Skeleton_Move/skeleton_move_" + i + ".png"));
  }

  //Sound

  for(let i = 0; i < 24; ++i){
    SOUND.zombie.push("zombieSound" + i);
  }

  noLoop();

}

function setup() {

  //Setting up local storage
  if(window.localStorage.getItem('highScoreE') == null){ //easy
    window.localStorage.setItem('highScoreE', ' ')
  }
  if(window.localStorage.getItem('highScoreM') == null){ //meidum
    window.localStorage.setItem('highScoreM', ' ')
  }
  if(window.localStorage.getItem('highScoreH') == null){ //hard
    window.localStorage.setItem('highScoreH', ' ')
  }

  //set the size of our canvas
  createCanvas(640, 640).parent('#my_center');

  imageMode(CENTER);
  angleMode(DEGREES);
  textAlign(CENTER, CENTER);

  GAME = new GameControllerZ(GRAPHICS, SOUND);

}

function myPause(){ //p5 has a function called paused
  GAME.state = 2; //
  noLoop();
}

function resume(){
  GAME.state = 1;
  loop();
}

function startGame(){
  document.getElementById('start_box_zombies').style.display = 'none';
  var buttons = document.getElementsByClassName('control_btn');
  for(let i = 0; i < buttons.length; ++i){
    buttons[i].disabled = false;
  }
  GAME.state = 1;
  loop();
}

function easy(){ //default settings are for easy so I just update the GAMEstate
  setup(); //make sure the setup is complete

  setTimeout( function(){

    GAME.addZombies(30); //Easy mode starts with 30 zombies
    startGame();

  }, 1000);

}

function medium(){
  setup(); //make sure the game setup is complete

  setTimeout( function(){

    GAME.addZombies(50); //Medium starts with  50 zombies
    GAME.setDificulity(2)
    startGame();

  }, 1000);

}

function hard(){
  setup(); //make sure the game setup is complete

  setTimeout( function(){

    GAME.addZombies(70); //Hard starts with 70 zombies
    GAME.setDificulity(3)
    startGame();

  }, 1000);

}

function stopDraw(){
  noLoop();
}

function GameOver(){
  var buttons = document.getElementsByClassName('control_btn');
  for(let i = 0; i < buttons.length; ++i){
    buttons[i].disabled = true;
  }
  var playAgain = document.getElementById('ply_agn_btn');
  playAgain.disabled = false;
  playAgain.style.display = 'inline';
}

function draw(){
  if(GAME.state == 1){ //Play
    GAME.update();
    GAME.display();
  }
  else if(GAME.state == 2){ //Pause
    GAME.display();
    fill(0);
    textSize(64);
    text("||", 320, 320);
    stopDraw();
  }
  else if(GAME.state == 0){ //GAMEover
    GAME.display();
    fill(0);
    textSize(64);
    text("GAME OVER", 320, 320);
    stopDraw();
    GameOver();
  }
}
