//The dimensions of the image being used as a map is 1280 x 1280.
//Dimensions of the canvas is 640 x 640
//Canvas is located at the middle of the map. Any map position to the left and up of the canvas is negative.
//All the zombies appear at a random point 128 px away from the boundaries of the map

//There are two separate positioning logic. One is to display the object on the Canvas.
//The other is for the positions on the map. Where the game is actually being played.

//To position the objects on the grid: int((Object's map position + 448(to handle negative positions))/this.gridUnitVertex) +1(int always rounds down)
//To translate map position to canvas 320 - mapX or mapY (use this to display the objects correctly)
//To translate canvas position to map mapX or mapY -320 (this is useful for the shooter)

//All the zombies and bullets created are being reused each level with minor changes on their attributes(for zombies)

//All the images and shapes are calculated from the center
//Only the map's posItion to display on the canvas is calculated from the top left corner

//for sound
let SOUND;

//for graphics
let GRAPHICS;

//To control the game
let GAME;

function getLine(x1, y1, x2, y2, w, h){ //p1, p2, width, height

  let x = x1, y = y1, line = [], unit;

  if(x1 == x2){
    unit = map(abs(y1-y2), 0, h, .01, 25);
    if(y1 < y2){
      while(y <= y2){
        line.push([x, y]);
        y += unit;
      }
    }
    else{
      while(y >= y2){
        line.push([x, y]);
        y -= unit;
      }
    }
  }

  else{
    let m = (y2 - y1) / (x2 - x1);
    let b =  y1 - m*x1;
    unit = map(abs(x1-x2), 0, w, .01, 25);
    if(x1 < x2){
      while(x <= x2){
        line.push([x, y]);
        x += unit;
        y = m*x + b;
      }
    }
    else{
      while(x >= x2){
        line.push([x, y]);
        x -= unit;
        y = m*x + b;
      }
    }
  }

  return line;

}

function straightLineTest(colorMap, line){
  for(let i = 0; i < line.length; ++i){
    if( red(colorMap.get(line[i][0], line[i][1])) == 255 ) return false;
  }
  return true;
}

class GameControllerM{
  constructor(graphics, sound){
    this.mapWidth = 1280;
    this.mapHeight = 1280;

    //Map X and Map Y gets calculated from the top left corner
    this.mapX = 320;
    this.mapY = 320;

    this.state;
    this.leaderboard = createGraphics(320, 320);
    this.graphics = graphics;
    this.sound = sound;
    this.shooter = new Shooter(width/2, height/2, 2, 25, this.graphics.shooter, this.sound.shooter);
    this.bots = [];

    //Each bots has number based on their index in the array

    this.bots.push(new Bot(320, 50, .02, 25, this.graphics.shooter, this.sound.shooter, random(2) < 1 ? 'Shotgun' : 'AssaultRifle'));
    this.bots.push(new Bot(1200, 320, .02, 25, this.graphics.shooter, this.sound.shooter, random(2) < 1 ? 'Shotgun' : 'AssaultRifle'));
    this.bots.push(new Bot(50, 320, .02, 25, this.graphics.shooter, this.sound.shooter, random(2) < 1 ? 'Shotgun' : 'AssaultRifle'));
    this.bots.push(new Bot(900, 900, .02, 25, this.graphics.shooter, this.sound.shooter, random(2) < 1 ? 'Shotgun' : 'AssaultRifle'));
    this.bots.push(new Bot(970, 1220, .02, 25, this.graphics.shooter, this.sound.shooter, random(2) < 1 ? 'Shotgun' : 'AssaultRifle'));
    this.bots.push(new Bot(200, 770, .02, 25, this.graphics.shooter, this.sound.shooter, random(2) < 1 ? 'Shotgun' : 'AssaultRifle'));
    this.bots.push(new Bot(1220, 1220, .02, 25, this.graphics.shooter, this.sound.shooter, random(2) < 1 ? 'Shotgun' : 'AssaultRifle'));
    this.bots.push(new Bot(240, 1260, .02, 25, this.graphics.shooter, this.sound.shooter, random(2) < 1 ? 'Shotgun' : 'AssaultRifle'));
    this.bots.push(new Bot(1250, 720, .02, 25, this.graphics.shooter, this.sound.shooter, random(2) < 1 ? 'Shotgun' : 'AssaultRifle'));
    this.bots.push(new Bot(70, 550, .02, 25, this.graphics.shooter, this.sound.shooter, random(2) < 1 ? 'Shotgun' : 'AssaultRifle'));
    this.bots.push(new Bot(1200, 320, .02, 25, this.graphics.shooter, this.sound.shooter, random(2) < 1 ? 'Shotgun' : 'AssaultRifle'));
    this.bots.push(new Bot(700, 70, .02, 25, this.graphics.shooter, this.sound.shooter, random(2) < 1 ? 'Shotgun' : 'AssaultRifle'));
    this.bots.push(new Bot(80, 1100, .02, 25, this.graphics.shooter, this.sound.shooter, random(2) < 1 ? 'Shotgun' : 'AssaultRifle'));
    this.bots.push(new Bot(500, 500, .02, 25, this.graphics.shooter, this.sound.shooter, random(2) < 1 ? 'Shotgun' : 'AssaultRifle'));
    this.bots.push(new Bot(1200, 20, .02, 25, this.graphics.shooter, this.sound.shooter, random(2) < 1 ? 'Shotgun' : 'AssaultRifle'));
    this.bots.push(new Bot(620, 1040, .02, 25, this.graphics.shooter, this.sound.shooter, random(2) < 1 ? 'Shotgun' : 'AssaultRifle'));
    this.bots.push(new Bot(1040, 500, .02, 25, this.graphics.shooter, this.sound.shooter, random(2) < 1 ? 'Shotgun' : 'AssaultRifle'));
    this.bots.push(new Bot(800, 320, .02, 25, this.graphics.shooter, this.sound.shooter, random(2) < 1 ? 'Shotgun' : 'AssaultRifle'));
    this.bots.push(new Bot(1220, 1220, .02, 25, this.graphics.shooter, this.sound.shooter, random(2) < 1 ? 'Shotgun' : 'AssaultRifle'));
    this.bots.push(new Bot(720, 780, .02, 25, this.graphics.shooter, this.sound.shooter, random(2) < 1 ? 'Shotgun' : 'AssaultRifle'));

    this.startingLocations = [[640, 640], [320, 50], [1200, 320], [50, 320], [900, 900], [970, 1220], [200, 770], [1220, 1220],
                              [240, 1260], [1250, 720], [70, 550], [1200, 320], [70, 70], [80, 1100], [500, 500], [1200, 20],
                              [620, 1040], [1040, 500], [800, 320], [1220, 1220], [720, 780]];

    this.bullets = [];
    this.bCursor = 0; //bullet cursor

    for(let i = 0; i < 1000; ++i){
      this.bullets.push(new Bullet(this.mapWidth*-1, this.mapHeight*-1));
    }

    this.mapGrid = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1],
                    [1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1],
                    [1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1],
                    [1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,0,0,0,1,1,1,1,1,0,0,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [0,0,0,0,1,0,0,0,0,1,1,1,0,0,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1],
                    [0,1,1,0,0,0,0,1,0,0,1,0,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,0,0,0,1,1,1],
                    [1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,1,1,1,1],
                    [1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,0,0,0,1,1,1,1],
                    [1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,0,0,1,1,1,1,1],
                    [1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1],
                    [1,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,0,0,0,1,1,1,1,1],
                    [1,1,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,0,0,0,1,1,1,1,1],
                    [1,1,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1],
                    [1,1,0,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1],
                    [1,1,0,0,0,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1],
                    [1,1,0,0,0,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,0,0,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1],
                    [1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1],
                    [1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1],
                    [1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1]];

    this.gridUnitVertex = 32;

    this.graph = new Graph(this.mapGrid, {diagonal: true});

    //This also checks for the obstacles in the map
    //This is currently only being used for the bullets
    this.checkMapBoundary = function(x, y){
      //Here checking if it is greater than or equal to is necessary because at the moment the bullets is on the mapWidth it will
      //give an index error on the grid
      if(x <= 0 || x >= this.mapWidth || y <= 0 || y >= this.mapHeight
          || this.mapGrid[floor(y/this.gridUnitVertex)][floor(x/this.gridUnitVertex)] == 0){
            return false; //remove the bullet
          }
      return true;
    }

    //These do not have to be a member variable, but keeping them as a memeber variable is useful for debugging
    //and since the game controller is a single object. It should not be a big deal for memory
    this.linearLine = [];
    this.shortestPath = [];

  }

  update(){
    this.shooter.update();

    if(keyIsDown(65) && //A -- moving left
       this.shooter.getXPos() + this.mapX - this.shooter.selectedWeapon.displayWidth/2 - this.shooter.getSpeed() > 0 &&  //check map boundary
       this.mapGrid[floor((this.shooter.getYPos() + this.mapY )/this.gridUnitVertex)]
       [floor((this.shooter.getXPos() + this.mapX  - this.shooter.selectedWeapon.displayWidth/2 - this.shooter.getSpeed())/this.gridUnitVertex)] != 0){ //check for obstacles

      if(this.mapX > 0 && this.shooter.getXPos() == 320) this.mapX -= 2;
      else this.shooter.moveLeft();

    }

    else if(keyIsDown(68) && //D -- moving right
            this.shooter.getXPos() + this.mapX + this.shooter.selectedWeapon.displayWidth/2 + this.shooter.getSpeed() < this.mapWidth && //check map boundary
            this.mapGrid[floor((this.shooter.getYPos() + this.mapY)/this.gridUnitVertex)]
            [floor((this.shooter.getXPos() + this.mapX + this.shooter.selectedWeapon.displayWidth/2 + this.shooter.getSpeed())/this.gridUnitVertex)] != 0){ //check for obstacles

      if(this.mapX + width < this.mapWidth && this.shooter.getXPos() == 320) this.mapX += 2;
      else this.shooter.moveRight();

    }

    //there should be seperate checks to whether move up/down
    //or to move right/left, because player should be able to
    //move dioginally
    if(keyIsDown(87) && //W -- moving up
       this.shooter.getYPos() + this.mapY - this.shooter.selectedWeapon.displayHeight/2 - this.shooter.getSpeed() > 0 && //check map boundary
       this.mapGrid[floor((this.shooter.getYPos() + this.mapY  - this.shooter.selectedWeapon.displayHeight/2 - this.shooter.getSpeed())/this.gridUnitVertex)] //check for obstacles
      [floor((this.shooter.getXPos() + this.mapX)/this.gridUnitVertex)] != 0){

      if(this.mapY > 0 && this.shooter.getYPos() == 320) this.mapY -= 2;
      else this.shooter.moveUp();

    }

    else if(keyIsDown(83) && //S -- moving down
            this.shooter.getYPos() + this.mapY + this.shooter.selectedWeapon.displayHeight/2 + this.shooter.getSpeed() < this.mapHeight && //check map boundary
            this.mapGrid[floor((this.shooter.getYPos() + this.mapY + this.shooter.selectedWeapon.displayHeight/2 + this.shooter.getSpeed())/this.gridUnitVertex)] //check for obstacles
            [floor((this.shooter.getXPos() + this.mapX)/this.gridUnitVertex)] != 0) {

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

    //Bots' Behavioral Logic
    for(let i = 0; i < this.bots.length; ++i){
      this.bots[i].update();

      let targetBot = this.shooter;
      let minDist = dist(this.shooter.getXPos() + this.mapX, this.shooter.getYPos() + this.mapY, this.bots[i].getXPos(), this.bots[i].getYPos());

      for(let j = 0; j < this.bots.length; ++j){
        if(i != j){
          let d = dist(this.bots[i].getXPos(), this.bots[i].getYPos(), this.bots[j].getXPos(), this.bots[j].getYPos());
          if(minDist > d){
               targetBot = this.bots[j];
               minDist = d;
          }
        }
      }

      //for testing purposes do a straight line test between the bot and the shooter
      let sourceX = this.bots[i].getXPos(), sourceY = this.bots[i].getYPos();
      let targetX = targetBot.getXPos() , targetY = targetBot.getYPos();

      if(targetBot == this.shooter) { //If the target bot is the shooter adjust the map position
        targetX += this.mapX;
        targetY += this.mapY;
      }

      //Theese are grid postions
      let source =  [floor(sourceY/this.gridUnitVertex), floor(sourceX/this.gridUnitVertex)];
      let target =  [floor(targetY/this.gridUnitVertex), floor(targetX/this.gridUnitVertex)];

      this.linearLine = getLine(round(sourceX), round(sourceY), round(targetX), round(targetY), this.mapWidth, this.mapHeight); //linear line is created based on the map position

      this.bots[i].setAim(targetX, targetY, minDist);

      //this is the code for shooting
      if(straightLineTest(this.graphics.colorMap, this.linearLine) && minDist < 300){ //If the test passes and the target is within range the bot will use perlin noise to move

        //SHOOTING FOR THE BOTS HAPPENS HERE
        if(this.bots[i].selectedWeapon.constructor.name === 'Shotgun'){

          let referredBullets = [];
          let temp = this.bCursor;
          for(let i = 0; i < 5; ++i){
            referredBullets.push(this.bullets[temp]);
            ++temp;
            temp %= this.bullets.length;
          }

          //Bots position is already based on the map therefore mapX=0 and mapY=0 has no significance
          if(random(10) < 8 ? true : false){ //Only shoot 80% of the time
            const howMany = this.bots[i].shoot(referredBullets, 0, 0, true, i); //How many bullets were fired //i implies which bot has taken the shot
            if(howMany != 0) this.bCursor = temp;
          }

        }

        else{

            const howMany = this.bots[i].shoot(this.bullets[this.bCursor], 0, 0, true, i); //How many bullets were fired /i implies which bot has taken the shot
            this.bCursor = (this.bCursor + howMany) % this.bullets.length;

          }

        this.bots[i].shuffle(this.mapGrid, this.mapWidth, this.mapHeight, this.gridUnitVertex);

      }

      else{

        this.shortestPath = astar.search(this.graph, this.graph.grid[source[0]][source[1]], this.graph.grid[target[0]][target[1]], { closest: true });
        if(this.shortestPath.length > 0) {
               this.bots[i].move((this.shortestPath[0].y + .5)*this.gridUnitVertex ,
              (this.shortestPath[0].x + .5)*this.gridUnitVertex);
            }

      }
    }

    //Shooting logic
    //if the weapon is not reloading and enough time has passed after the last time it was fired
    //shooter will return how many bullets were fired
    //else shooter will return 0
    if(keyIsDown(32)){ //space
      if(this.shooter.selectedWeapon.constructor.name === 'Shotgun'){
        let referredBullets = [];
        let temp = this.bCursor;
        for(let i = 0; i < 5; ++i){
          referredBullets.push(this.bullets[temp]);
          ++temp;
          temp %= this.bullets.length;
        }
        const howMany = this.shooter.shoot(referredBullets, this.mapX, this.mapY, false, this.bots.length); //How many bullets were fired
        if(howMany != 0) this.bCursor = temp;
      }
      else{
        const howMany = this.shooter.shoot(this.bullets[this.bCursor], this.mapX, this.mapY, false, this.bots.length); //How many bullets were fired
        this.bCursor = (this.bCursor + howMany) % this.bullets.length;
      }
    }

    //Checking if bullets hit somewhere
    for(let i = 0; i < this.bullets.length; ++i) {
      if(this.checkMapBoundary(this.bullets[i].getXPos(), this.bullets[i].getYPos())) {
        this.bullets[i].update();

        //check if bullet hit any of the bots
        for(let j = 0; j < this.bots.length; ++j) {
          if(this.bullets[i].getOwner() != j &&
             dist(this.bullets[i].getXPos(), this.bullets[i].getYPos(), this.bots[j].getXPos(), this.bots[j].getYPos()) < 15) {

            this.bullets[i].setPos(this.mapWidth*-1, this.mapHeight*-1);
            this.bots[j].gotHit();

            if(!this.bots[j].isAlive()){
              this.bots[j].giveLifeAndResetPosition(this.startingLocations[floor(random(this.startingLocations.length))]);

              if(this.bullets[i].getOwner() == this.bots.length){ //the player got the kill
                this.shooter.updateScore();
              }

              else{ //a bot kot the kill
                this.bots[this.bullets[i].getOwner()].updateScore();
              }

            }

          }

        }

        //check if the bullet hit the player
        if(this.bullets[i].getOwner() != this.bots.length &&
           dist(this.bullets[i].getXPos(), this.bullets[i].getYPos(), this.shooter.getXPos() + this.mapX, this.shooter.getYPos() + this.mapY) < 15){

          this.shooter.gotHit();
          this.bullets[i].setPos(this.mapWidth*-1, this.mapHeight*-1);
          if(!this.shooter.isAlive()){

            let l = this.startingLocations[floor(random(this.startingLocations.length))];

            this.mapX = l[0] - width/2;
            this.mapY = l[1] - height/2;

            if(this.mapX < 0) this.mapX = 0;
            else if(this.mapX > this.mapWidth/2) this.mapX = this.mapWidth/2;

            if(this.mapY < 0) this.mapY = 0;
            else if(this.mapY > this.mapHeight/2) this.mapY = this.mapHeight/2;

            this.shooter.giveLifeAndResetPosition(l, this.mapX, this.mapY);
            this.bots[this.bullets[i].getOwner()].updateScore();

          }
        }
      }

      else{
        this.bullets[i].setPos(this.mapWidth*-1 , this.mapHeight*-1); //its just a general number to remove the bullets away from the map
      }

    }
  }

  display(){
    clear();
    image(this.graphics.backgroundImage, width/2, height/2, width, height, this.mapX, this.mapY, width, height);
    //image(this.graphics.colorMap, width/2, height/2, width, height, this.mapX, this.mapY, width, height); //for testing purposes
    //testing the map
    // for(let c = 0; c < this.mapGrid.length; ++c){
    //   for(let r = 0; r < this.mapGrid.length; ++r){
    //     if(this.mapGrid[c][r] == 1){
    //       text('o', r*this.gridUnitVertex - this.mapX + 16, c*this.gridUnitVertex-this.mapY + 16);
    //     }
    //     else{
    //       text('x', r*this.gridUnitVertex - this.mapX + 16, c*this.gridUnitVertex-this.mapY + 16);
    //     }
    //   }
    // }

    // for(let i = 0; i < this.linearLine.length; ++i){
    //   fill(255, 0, 0);
    //   //ellipse(this.linearLine[i][1]*this.gridUnitVertex -this.mapX, this.linearLine[i][0]*this.gridUnitVertex -this.mapY, 3);
    //   ellipse(this.linearLine[i][0] - this.mapX, this.linearLine[i][1] - this.mapY, 1);
    // }

    //Test the straightLineTest if needed
    //console.log(straightLineTest(this.blankGrid, this.linearLine));

    textSize(12);
    fill(0);
    text('Your score: ' + this.shooter.getScore(), width - 50, 20);
    //display the shooter
    //Shooter's position is based on the canvas
    //No conversion is needed
    this.shooter.display(0, 0);

    for(let i = 0; i < this.bullets.length; ++i){

      this.bullets[i].display(this.mapX, this.mapY);

    }

    //Display the boots
    for(let i = 0; i < this.bots.length; ++i){

      this.bots[i].display(this.mapX, this.mapY);

    }

    if(keyIsDown(79) || frameCount > 10000){ //If the frameCount > 10,000 its the game over display
      let leaderboard = [];
      leaderboard.push(['player', this.shooter.getScore()]);
      for(let i = 0; i < this.bots.length; ++i){
        leaderboard.push([str(i+1), this.bots[i].getScore()]);
      }

      leaderboard.sort((a, b) => b[1] - a[1]);

      this.leaderboard.clear();
      this.leaderboard.background(0);
      this.leaderboard.fill(255);
      this.leaderboard.strokeWeight(6);
      this.leaderboard.textSize(12);
      let x = 35, y = 35;
      for(let i = 0; i < leaderboard.length; ++i){
        this.leaderboard.text(str(i+1)+ '.' + (leaderboard[i][0] == 'player' ? 'Player' : 'Bot ' + leaderboard[i][0]) + ' score: ' + leaderboard[i][1], x, y);
        y += 20;
        if(y > this.leaderboard.height - 35) {
           x = 180;
           y = 35;
         }
      }

      image(this.leaderboard, 320, 320);
    }

    if(frameCount < 1000){
      fill(255);
      text("You can press 'o' to see the leaderboard", 340, 600);
    }

    //this.testBot.display(this.mapX, this.mapY);

    //If you want to diagnoise the path finding algo
    //just comment these and set zCursor to zombies array length-1

    // fill(0,0,255);
    // for(let i = 0; i < this.shortestPath.length; ++i){
    //   ellipse((this.shortestPath[i].y + .5)*this.gridUnitVertex - this.mapX,
    //   (this.shortestPath[i].x + .5)*this.gridUnitVertex -this.mapY , 10);
    // }

  }

}

class Graphics{
  constructor(){
    //Background Image
    this.backgroundImage;
    this.colorMap;

    //Shooter
    this.shooter = {handgun : {idle: [], move: [], shoot: [], reload: []},
                    assaultRifle : {idle: [], move: [], shoot: [], reload: []},
                    shotgun : {idle: [], move: [], shoot: [], reload: []} };

  }
}

class Sound{ //Exists of html audio elements
  constructor(){
    this.shooter = {
      handgun: {reload: null, shoot: null},
      shotgun: {reload: null, shoot: null},
      assaultRifle: {reload: null, shoot: null}
    };
  }
}

function preload(){

  SOUND = new Sound();

  SOUND.shooter.handgun.shoot = document.getElementById('handgun');
  SOUND.shooter.handgun.reload = document.getElementById('reload');

  GRAPHICS = new Graphics();

  //Graphics

  GRAPHICS.backgroundImage = loadImage("Images/map.png");
  GRAPHICS.colorMap = loadImage("Images/colorMap.png");

  for(let i = 0; i < 20; ++i){
    GRAPHICS.shooter.handgun.idle.push(loadImage("Images/Handgun/idle/shooter_idle_handgun_" + i + ".png"));
    GRAPHICS.shooter.handgun.move.push(loadImage("Images/Handgun/move/shooter_move_handgun_" + i + ".png"));
    GRAPHICS.shooter.assaultRifle.idle.push(loadImage("Images/AssaultRifle/idle/shooter_idle_rifle_" + i + ".png"));
    GRAPHICS.shooter.assaultRifle.move.push(loadImage("Images/AssaultRifle/move/shooter_move_rifle_" + i + ".png"));
    GRAPHICS.shooter.assaultRifle.reload.push(loadImage("Images/AssaultRifle/reload/shooter_reload_rifle_" + i + ".png"));
    GRAPHICS.shooter.shotgun.idle.push(loadImage("Images/Shotgun/idle/shooter_idle_shotgun_" + i + ".png"));
    GRAPHICS.shooter.shotgun.move.push(loadImage("Images/Shotgun/move/shooter_move_shotgun_" + i + ".png"));
    GRAPHICS.shooter.shotgun.reload.push(loadImage("Images/Shotgun/reload/shooter_reload_shotgun_" + i + ".png"));
  }

  for(let i = 0; i < 3; ++i){
    GRAPHICS.shooter.handgun.shoot.push(loadImage("Images/Handgun/shoot/shooter_shoot_handgun_" + i + ".png"));
    GRAPHICS.shooter.assaultRifle.shoot.push(loadImage("Images/AssaultRifle/shoot/shooter_shoot_rifle_" + i + ".png"));
    GRAPHICS.shooter.shotgun.shoot.push(loadImage("Images/Shotgun/shoot/shooter_shoot_shotgun_" + i + ".png"));
  }

  for(let i = 0; i <  15; ++i){
    GRAPHICS.shooter.handgun.reload.push(loadImage("Images/Handgun/reload/shooter_reload_handgun_" + i + ".png"));
  }

  noLoop();

}

function setup() {
  //set the size of our canvas
  createCanvas(640, 640).parent('#my_center');

  imageMode(CENTER);
  angleMode(DEGREES);
  textAlign(CENTER, CENTER);

  GAME = new GameControllerM(GRAPHICS, SOUND);

}

function myPause(){ //p5 has a function called paused
  GAME.state = 2;
  noLoop();
}

function resume(){
  GAME.state = 1;
  loop();
}

function startGame(){
  var buttons = document.getElementsByClassName('control_btn');
  for(let i = 0; i < buttons.length; ++i){
    buttons[i].disabled = false;
  }
  loop();
  GAME.state = 1;
}

function stopDraw(){
  noLoop();
}

function gameOver(){
  var buttons = document.getElementsByClassName('control_btn');
  for(let i = 0; i < buttons.length; ++i){
    buttons[i].disabled = true;
  }
  var playAgain = document.getElementById('ply_agn_btn');
  playAgain.disabled = false;
  playAgain.style.display = 'inline';
}

function removeStartBox(){
  let startBox = document.getElementById('start_box_multiplayer');
  startBox.style.display = 'none';
  startBox.disabled = true;
}

function shotgun(){
  setup(); //make sure the game setup is complete

  setTimeout( function(){ //give a second for the game to be ready

    GAME.shooter.setGunType('Shotgun');
    removeStartBox();
    startGame();

  }, 1000);

}

function rifle(){ //currently the default gun type is an assualy rifle
  setup();//make sure the game setup is complete

  setTimeout( function(){ //give a second for the game to be ready

    removeStartBox();
    startGame();

  }, 1000);

}

function draw(){
  if(frameCount > 10000){ //Gameover
    GAME.state = 0;
    GAME.display();
    fill(0);
    textSize(64);
    text("GAME OVER", 320, 120);
    stopDraw();
    gameOver();
  }
  else if(GAME.state == 1){ //Play
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
}
