

class Zombie{
  //width 29px
  //height 32px

  constructor(graphicsMove, sound){

    this.xPos;
    this.yPos;

    this.targetX;
    this.targetY;

    this.speed;

    //this.shortestPath;

    this.graphicsMove = graphicsMove;
    this.gCursor = 0;

    this.displayWidth = 29;
    this.displayHeight = 32;

    //zombies always get created with 0 health
    //health being 0 represents a death zombie, which is important for the games execution logic
    this.health = 0;

    this.sound = sound;

  }

  getXPos(){
    return this.xPos;
  }

  getYPos(){
    return this.yPos;
  }

  getHealth(){
    return this.health;
  }

  giveLife(health){

    //once zombies are given life they scream
    if(this.sound != null){
     document.getElementById(this.sound).currentTime = 0;
     document.getElementById(this.sound).play();

   }

    this.health = health;

  }

  setSpeed(s){
    this.speed = s;
  }

  //position the zombies somewhere out of the map
  setPos(whereToAppear, w, h, unitVertex) { //map width, map height
    if(whereToAppear < 1){ //Top of the map
      this.xPos = random(w);
      this.yPos =  -unitVertex*3; // 3 grid postions above the map
    }
    else if(whereToAppear < 2) { //Right-side of the map
      this.xPos = w + unitVertex*3; //3 grid postions to the left of the map
      this.yPos = random(h);
    }
    else if(whereToAppear < 3) { //Bottom of the map
      this.xPos = random(w);
      this.yPos = h + unitVertex*3; //3 grid postions below the map
    }
    else{ //Left-side of the map
      this.xPos = -unitVertex*3;
      this.yPos = random(h);
    }
    this.targetX = this.xPos;
    this.targetY = this.yPos;
  }

  setTargetPos(x, y){ // , shortestPath -- for debugging purposes
    //this.shortestPath = shortestPath; -- for debugging purposes
    this.targetX = x;
    this.targetY = y;
  }

  isAlive(){
    return this.health > 0;
  }

  update(){ //update gets called each frame

    //As longer the zombies stay the more angry they get
    this.speed += .000001;

    //If they get too angry they scream again
    if(this.speed % .1 == 0 && this.sound != null){
      document.getElementById(this.sound).currentTime = 0;
      document.getElementById(this.sound).play();
     }

    this.xPos += this.speed*(this.targetX - this.xPos);
    this.yPos += this.speed*(this.targetY - this.yPos);

  }

  display(mapX, mapY){ // , unitVertex -- for debuggin purposses

    let d = dist(this.targetX, this.targetY, this.xPos, this.yPos);
    let xCoef = (this.targetX - this.xPos) / d;
    let yCoef = (this.targetY - this.yPos) / d;

    push();
    translate(this.xPos - mapX , this.yPos - mapY);

    let alpha;

    //recall that xCoef is cosine and yCoef is sine
    //hence, tan = sine/cosine by definition

    if(this.targetX >= this.xPos && this.targetY >= this.yPos){
      alpha = atan(yCoef / xCoef);
    }

    else if(this.targetX <= this.xPos && this.targetY >= this.yPos){
      alpha = atan(xCoef*-1 / yCoef)+90;
    }

    else if(this.targetX <= this.xPos && this.targetY <= this.yPos){
      alpha = atan(yCoef*-1 / xCoef*-1)+180;
    }

    else{
      alpha = atan(xCoef / yCoef*-1)+270;
    }

    rotate(alpha);

    image(this.graphicsMove[int(this.gCursor)], 0, 0, this.displayWidth, this.displayHeight);
    this.gCursor += .5;
    this.gCursor %= this.graphicsMove.length;

    pop();


    fill(0); // for debuggin purposses
    // for(let i = 0; i < this.shortestPath.length; ++i){
    //   // console.log('X', (this.shortestPath[i].y+.5)*this.gridUnitVertex - 3*this.gridUnitVertex);
    //   // console.log('Y', (this.shortestPath[i].x+.5)*this.gridUnitVertex - 3*this.gridUnitVertex);
    //   ellipse((this.shortestPath[i].y+.5)*unitVertex - 3*unitVertex - mapX,
    //           (this.shortestPath[i].x+.5)*unitVertex - 3*unitVertex - mapY, 3);
    // }

  }

  gotShot(){
    --this.health;
  }

}
