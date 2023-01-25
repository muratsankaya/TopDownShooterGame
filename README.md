# TopDownShooterGame

### Set of Abstractions
![SetOfAbstractions](https://user-images.githubusercontent.com/104160992/214609104-52066a34-c1ce-4114-b466-a1a8248402dc.png)

- Each box represents an object 
- Each arrow represents direct access 

The schematic above is to visualize the connection between each object in the code structure. 

*Please note that even though any formal methodology for data hiding is not in use. For safety purposes, direct access to data fields is mostly avoided.*

### Positional Logic 

The image used as the map has a width of 1280 px and a height of 1280px. The dimensions of the canvas is 640 x 640 px. 

The part of the image that is being displayed as the background of the canvas is calculated from the top left corner of the canvas. 
The coordinates of this point are being tracked with ``` mapX ```  and ``` mapY  ``` .  Regardless of the values; ``` mapX ``` and  ``` mapY ``` 
always point to the (0,0) coordinate of the canvas. 

The positions of the objects are being tracked by their map positions, except the user controlled shooter.
User controlled shooter’s position is based on the canvas, because it's always on display. 

In order to calculate the map position of the user controlled shooter, ``` mapX ``` and ``` mapY ``` should 
be added to the canvas position (which is the position being tracked for the user controlled shooter). 
This is often useful for the dynamics of the game. An example use case is checking if the bullet hit the player. 

In order to locate objects on the canvas, ``` mapX ``` and ``` mapY ``` should be subtracted from the map position. 
This is useful when displaying the objects on the canvas. 

### Detection Techniques in Use

Two techniques are used to detect obstacles over the map. One is grid base detection, and the other is color based detection. 
Initially the only detection mechanic was grid based detection, however due to some precision weaknesses, a color map was 
created to use color based detection. However, most of the program still uses grid based detection. Color based detection 
is only substituted for the parts where the grid based detection’s weaknesses were significant. 

### Display Settings

Every image, text, and geometric shape are positioned from their center. 

### For those who are not familiar with the p5 framework 

When p5 is loaded the first function called is preload. In preload all the images and audio in use are loaded. 
After the load is complete, the function setup is called. Here the game controller object gets initialized. 
After the setup is complete, p5 starts calling the draw function approximately 60 times a second. 

### An Ideal way to Read the Code 

First see the index.html file and locate which functions does the user’s interaction trigger. 
Then look at the setup function and observe how the game controller objects are being initialized. 
See how the objects are located and which information they hold. 
After the setup is complete, for the execution of the game follow the draw function. 

In a nutshell, each object has predefined behavior, and the game controller is responsible for their interaction. 

### Some Clarification

The reason why .5 is added to the grid index when converting from grid index to map position is that the image mode is centered. 
In other words images are displayed from their center. 

 = gridIndex * gridUnitVertex + gridUnitVertex / 2 →To translate the center of the grid unit to map 

= gridUnitVertex * ( gridIndex + ½ ) 

An example use case:  – GameModeMultiplayer.js[300:303]

``` javascript

if(this.shortestPath.length > 0) {
   this.bots[i].move((this.shortestPath[0].y + .5)*this.gridUnitVertex ,
                     (this.shortestPath[0].x + .5)*this.gridUnitVertex);
 }
```

### How To Work on this Project 

You can download a zip copy of the repository and start working on the project with any IDE that supports javascript and html. 
However you will need a server to run this project. If you don’t have access to any server, one solution for you is to use MAMP. 
MAMP will render a local server environment which you can run this project on.

For windows: https://www.mamp.info/en/windows/

For mac: https://www.mamp.info/en/mamp/mac/ 

*Please note you do ***not*** need to purchase the PRO/paid version of MAMP to work on this project !*

