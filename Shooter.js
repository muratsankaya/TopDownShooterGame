
//Game controller will notify the selected weapon as string
//String will get materalized as a weapon here
function selectWeapon(weapon, graphics, sound){
  //Weapon's constructor
  //Graphics, sound, buffer, ammoSize,
  if(weapon == 'Handgun'){
    return new Handgun(graphics.handgun, sound.handgun, 30, 12);
  }
  if(weapon == 'Shotgun'){
    return new Shotgun(graphics.shotgun, sound.handgun, 60, 25);
  }
  if(weapon == 'AssaultRifle'){
    return new AssaultRifle(graphics.assaultRifle, sound.handgun, 10, 24);
  }
}

//Player controlled obstacle
class Shooter{
  //widht 30
  //length 25

  constructor(x, y, speed, health, graphics,  sound, primaryWeapon='AssaultRifle', secondaryWeapon='Handgun'){
    this.graphics = graphics;
    this.sound = sound;

    this.primaryWeapon = selectWeapon(primaryWeapon, graphics, sound);
    this.secondaryWeapon = selectWeapon(secondaryWeapon, graphics, sound);
    this.selectedWeapon = this.primaryWeapon; //by default

    this.xPos = x;
    this.yPos = y;

    this.speed = speed;

    this.aimAngle = 0;

    this.healthC = health; //The health constant
    this.health = this.healthC;

    //this is for the animation logic
    this.preXPos = x;
    this.preYPos = y;

    this.score = 0;

  }

  getXPos() {
    return this.xPos;
  }

  getYPos() {
    return this.yPos;
  }

  getHealth(){
    return this.health;
  }

  getScore(){
    return this.score;
  }

  getSpeed(){
    return this.speed;
  }

  isAlive(){
    return this.health > 0;
  }

  setGunType(gunType){
    this.primaryWeapon = selectWeapon(gunType, this.graphics, this.sound);
    this.selectedWeapon = this.primaryWeapon;
  }

  update(){
    this.selectedWeapon.update();
  }

  updateScore(){
    ++this.score;
  }

  display(mapX, mapY){
    this.selectedWeapon.display(this.xPos - mapX, this.yPos - mapY, this.preXPos - mapX, this.preYPos - mapY, this.aimAngle);
  }

  //clockwise
  cwAim(){
    this.aimAngle += 3;
    this.aimAngle %= 360;
  }

  //counter clockwise
  ccwAim(){
    this.aimAngle -= 3;
    this.aimAngle %= 360;
  }

  moveLeft(){
    this.preXPos = this.xPos;
    this.xPos -= this.speed;
  }

  moveRight(){
    this.preXPos = this.xPos;
    this.xPos += this.speed;
  }

  //y is reversed
  moveUp(){
    this.preYPos = this.yPos;
    this.yPos -= this.speed;
  }

  moveDown(){
    this.preYPos = this.yPos;
    this.yPos += this.speed;
  }

  shoot(bullet, mapX, mapY, isBot=false, owner=null){

    return this.selectedWeapon.fire(this.xPos, this.yPos, mapX, mapY, this.aimAngle, bullet, isBot, owner);

  }

  gotHit(){
    --this.health;
  }

  giveLifeAndResetPosition(l, mapX, mapY){
    this.xPos = l[0] - mapX;
    this.yPos = l[1] - mapY;
    this.health = this.healthC;
  }

}

class Bot extends Shooter{
  constructor(x, y, s, health, graphics,  sound, primaryWeapon='AssaultRifle', secondaryWeapon='Handgun'){
    super(x, y, s, health, graphics, sound, primaryWeapon, secondaryWeapon);
    this.xNoiseOffSet = random(-4000, 4000);
    this.yNoiseOffSet = random(-4000, 4000);
  }

  getTargetLocation(){
    return this.targetLocation;
  }

  setTargetLocation(target){
    this.targetLocation = target; //[x, y]
  }

  setAim(targetX, targetY, d){ //d for distance

    let xCoef = (targetX - this.xPos)/d;
    let yCoef = (targetY - this.yPos)/d;

    if( targetX >= this.xPos && targetY >= this.yPos){
      this.aimAngle = atan(yCoef / xCoef);
    }

    else if( targetX <= this.xPos && targetY >= this.yPos){
      this.aimAngle = atan(xCoef*-1 / yCoef)+90;
    }

    else if(targetX <= this.xPos && targetY <= this.yPos){
      this.aimAngle = atan(yCoef*-1 / xCoef*-1)+180;
    }

    else{
      this.aimAngle = atan(xCoef / yCoef*-1)+270;
    }

  }

  move(targetX, targetY){

    this.xPos += (targetX - this.xPos)*this.speed;
    this.yPos += (targetY - this.yPos)*this.speed;

  }

  shuffle(gridMap, w, h, unitVertex){ //w = mapWidth, h = mapHeight
    let deltaX, deltaY;

    deltaX = map(noise(this.xNoiseOffSet), 0, 1, -2, 2);

    deltaY = map(noise(this.yNoiseOffSet), 0, 1, -2, 2);

    //deltaX could be positive or negative
    if((deltaX >= 0 ?
       (this.xPos + deltaX + this.selectedWeapon.displayWidth/2 < w &&
        gridMap[floor((this.yPos)/unitVertex)][floor((this.xPos + deltaX + this.selectedWeapon.displayWidth/2)/unitVertex)] != 0 ) :
       (this.xPos + deltaX - this.selectedWeapon.displayWidth/2 > 0 &&
        gridMap[floor((this.yPos)/unitVertex)][floor((this.xPos + deltaX - this.selectedWeapon.displayWidth/2)/unitVertex)] != 0 ) ) ) {

      //console.log(this.xPos + deltaX - this.selectedWeapon.displayWidth/2);
      this.xPos += deltaX;


    }

    //deltaY could be positive or negative
    if((deltaY >= 0 ?
       (this.yPos + deltaY + this.selectedWeapon.displayHeight/2 < h &&
       gridMap[floor((this.yPos + deltaY + this.selectedWeapon.displayHeight/2)/unitVertex)][floor(this.xPos/unitVertex)] != 0)  :
       (this.yPos + deltaY - this.selectedWeapon.displayHeight/2 > 0 &&
       gridMap[floor((this.yPos + deltaY - this.selectedWeapon.displayHeight/2)/unitVertex)][floor(this.xPos/unitVertex)] != 0 ) ) ) {

      this.yPos += deltaY;

    }

    this.xNoiseOffSet += .01;
    this.yNoiseOffSet += .01;

  }

  giveLifeAndResetPosition(l){
    this.missionAssigned = false;
    this.xPos = l[0];
    this.yPos = l[1];
    this.health = this.healthC;
  }

}

function setup(){
  noiseDetail(25);
}
