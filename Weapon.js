
class Weapon{
  //Graphics, sound, buffer, ammoSize,
  constructor(g, s, b, as){
    this.graphics = g;
    this.sound = s;
    this.displayWidth = 30;
    this.displayHeight = 25;

    this.bufferConstant = b;
    this.buffer = this.bufferConstant; //this decleras the rapidity of shots

    this.ammoSize = as;
    this.ammo = this.ammoSize;

    //For realoading animation
    this.shotTaken = 0;

    //Grpahics Cursors
    this.idleC = 0;
    this.moveC = 0;
    this.shotC = 0;
    this.reloadCursor = 0;

    //Pistol's angle
    //This is a constant
    this.angleP = atan(7/8);

    //radius: line lenght from the origin of the image to pistol's position
    //This is a constant
    this.radiusP = sqrt(49+64);

  }

  update(){
    if(this.buffer > 0) --this.buffer;
  }

  display(x, y, preX, preY, alpha){
    push();

    //translates the origin as the shooter's location on the map
    //temprorily between the push() and the pop()
    translate(x, y);

    rotate(alpha);

    if(this.ammo <= 0){

      image(this.graphics.reload[int(this.reloadCursor)], 0, 0, this.displayWidth, this.displayHeight);

      this.reloadCursor += .25;

      if(this.reloadCursor == this.graphics.reload.length) { //reload is complete
        this.reloadCursor = 0;
        this.ammo = this.ammoSize;
      }

    }

    else if(this.shotTaken > 0){

      image(this.graphics.shoot[int(this.shotC)], 0, 0, this.displayWidth, this.displayHeight);
      this.shotTaken -= .10;
      this.shotC += .10;
      this.shotC %= this.graphics.shoot.length;

    }

    else if(x == preX && y == preY){

      image(this.graphics.idle[int(this.idleC)], 0, 0, this.displayWidth, this.displayHeight);
      this.idleC += .5;
      this.idleC %= this.graphics.idle.length;
      this.moveC = 0; //reset the move cursor

    }

    else{

      image(this.graphics.move[int(this.moveC)], 0, 0, this.displayWidth, this.displayHeight);
      this.moveC += .5;
      this.moveC %= this.graphics.move.length;
      this.idleC = 0; //reset the idle cursor

    }

    pop();

  }

  fire(x, y, mapX, mapY, alpha, bullet, isBot, owner){

    //The aim angle determines the bullet's motion
    //Pistol's angle is to locate the bullet's execution point
    if(this.ammo > 0 && this.buffer <= 0){

      if(!isBot){ //Only when the shooter fires sound should play
        this.sound.shoot.currentTime = 0;
        this.sound.shoot.play();
      }

      //Pistol's distance from the survivor's center point
      let deltaXP = this.radiusP*cos(alpha+this.angleP), deltaYP = this.radiusP*sin(alpha+this.angleP); //I actually don't think that this is always needed

      let xPosP = mapX + x + deltaXP, yPosP = mapY + y + deltaYP;

      bullet.setPos(xPosP, yPosP, cos(alpha), sin(alpha));

      this.shotTaken = 3; //For each waepon shot taken graphics consists of 3 images
      --this.ammo;
      this.buffer = this.bufferConstant;

      if(this.ammo <= 0 && !isBot) this.sound.reload.play(); //If it is a bot don't play the sound

      if(owner != null) bullet.setOwner(owner); //In the zombie game mode, all the bullets are owned by the player

      return 1; //bullets were succesfully fired

    }

    return 0; //no bullets were fired

  }

}

class Handgun extends Weapon{}

class AssaultRifle extends  Weapon{}

class Shotgun extends Weapon{
  fire(x, y, mapX, mapY, alpha, bullets, isBot, owner){ //Overriding the fire method

    //The aim angle determines the bullet's motion
    //Pistol's angle is to locate the bullet's execution point
    if(this.ammo > 0 && this.buffer <= 0){
      if(!isBot){
        this.sound.shoot.currentTime = 0;
        this.sound.shoot.play();
      }

      //Pistol's distance from the survivor's center point
      let deltaXP = this.radiusP*cos(alpha+this.angleP), deltaYP = this.radiusP*sin(alpha+this.angleP); //I actually don't think that this is always needed

      let xPosP = mapX + x + deltaXP, yPosP = mapY + y + deltaYP;

      let r = -10; //start setting the coef of the bullet from the leftmost one
      for(let i = 0; i < bullets.length; ++i){
        bullets[i].setOwner(owner);
        bullets[i].setPos(xPosP, yPosP, cos(alpha + r), sin(alpha + r));
        r += 5;
      }

      this.shotTaken = 3; //For each waepon shot taken graphics consists of 3 images
      this.ammo = this.ammo - 5; //5 bullets are fired each time
      this.buffer = this.bufferConstant;

      if(this.ammo <= 0 && !isBot) this.sound.reload.play();

      return 5; //bullets were succesfully fired
    }

    return 0; //no bullets were fired

  }
}
