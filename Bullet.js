
class Bullet{
  constructor(x, y){
    this.xPos = x;
    this.yPos = y;
    this.xCoef = 0;
    this.yCoef = 0;
    this.owner = null;

  }

  display(mapX, mapY){
    fill(255,0,0);
    noStroke();
    ellipse(this.xPos - mapX, this.yPos - mapY, 2.3);
  }

  update(){
     //for now I'm keeping the speed of the bullets constant, but in the future it can be a memeber field of the bullets
     //to detailty specifiy the speed of each bullet maybe based on the gun type
      this.xPos += 5*this.xCoef;
      this.yPos += 5*this.yCoef;
  }

  setPos(xPos, yPos, xCoef = 0, yCoef = 0){
    this.xPos = xPos;
    this.yPos = yPos;
    this.xCoef = xCoef;
    this.yCoef = yCoef;
  }

  setOwner(o){
    this.owner = o;
  }

  getOwner(){
    return this.owner;
  }

  getXPos(){
    return this.xPos;
  }

  getYPos(){
    return this.yPos;
  }

}
