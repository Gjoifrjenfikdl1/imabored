//does requestAnimationFrame if the browzer allows it othrwise it uses setInterval
(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();
var canvas = document.getElementById("canvas"),
ctx = canvas.getContext("2d"),
//create width and height of canvas
width = 1350/4,
height = 580/4,
//give starting player properties
player = {
  x : width/2,
  y : height - 25,
  width : 25,
  height : 25,
  speed: 20,
  velX: 0,
  velY: 0,
  jumping : false,
  jumpHeight: 0.3,
  grounded: false
},
keys = [],
friction = 0.8,
gravity = 0.3;
//set width and height of canvas
canvas.width = width;
canvas.height = height;

var data=[
    [1,0,0,0,1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,1,0,0,1,0,0,0,0,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,1,1]
    ];

//holds boxes
var boxes = [];

function update(){
	ctx.clearRect(player.x-50, player.y-50, player.width+100, player.height+100);
	
	// check keys
   if (keys[38] || keys[32]) {
    // up arrow or space
	  if(!player.jumping && player.grounded){
	   player.jumping = true;
	   player.grounded = false; // We're not on the ground anymore!!
	   player.velY = -player.speed*player.jumpHeight;
	  }
	}
   if (keys[39]) {
       // right arrow
       if (player.velX < player.speed) {                         
           player.velX++;                  
       }          
   }          
   if (keys[37]) {                 
        // left arrow                  
       if (player.velX > -player.speed) {
           player.velX--;
       }
   }
   
   //enters friction
   player.velX *= friction;
   //adds gravity
   player.velY += gravity;

	//keeps player on screen
	if (player.x >= width-player.width) {
    player.x = width-player.width;
	} else if (player.x <= 0) {
    player.x = 0;
	}
	//so we can fall off ledges
	player.grounded = false;
	//adds fill for boxes
	ctx.fillStyle = "black";
	//create boxes
	ctx.beginPath();
	for (var i = 0; i < boxes.length; i++) {
		var dir = colCheck(player, boxes[i]);
		if (dir === "l" || dir === "r") {
		  	player.velX = 0;
		    player.jumping = false;
		} else if (dir === "b") {
		    player.grounded = true;
		    player.jumping = false;
		} else if (dir === "t") {
			player.velY *= -1;
		}
      ctx.fillStyle="black";
	    ctx.rect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);
	}
	ctx.fill();
	if(player.grounded){
     player.velY = 0;
    }

    //moves player
    player.x += player.velX;
	player.y += player.velY;
    
    // draw our player
    ctx.fillStyle = "red";
    ctx.fillRect(player.x, player.y, player.width, player.height);
    // run through the loop again
    requestAnimationFrame(update);
}

function colCheck(shapeA, shapeB) {
    // get the vectors to check against
    var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
        vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
        // add the half widths and half heights of the objects
        hWidths = (shapeA.width / 2) + (shapeB.width / 2),
        hHeights = (shapeA.height / 2) + (shapeB.height / 2),
        colDir = null;
 
    // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
   if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {         // figures out on which side we are colliding (top, bottom, left, or right)        
            var oX = hWidths - Math.abs(vX),             
            oY = hHeights - Math.abs(vY);         
            if (oX >= oY) {
            if (vY > 0) {
                colDir = "t";
                shapeA.y += oY;
            } else {
                colDir = "b";
                shapeA.y -= oY;
            }
        } else {
            if (vX > 0) {
                colDir = "l";
                shapeA.x += oX;
            } else {
                colDir = "r";
                shapeA.x -= oX;
            }
        }
    return colDir;
	}
}

function map() {
    // this is the code that reads the data:
    // for loop for y axis
    for(var i=0; i<data.length; i++){
    // for loop for x axis
    for(var j=0; j<data[i].length; j++){
        if(data[i][j]===0){
            // leave blank
            ctx.fillStyle="white";
            ctx.fill();
            ctx.fillRect(j*25,i*25,25,25);
        }
        if(data[i][j]===1){
            // create block
            ctx.fillStyle="black";
            ctx.fill();
            boxes.push({
            x: j*25,
            y: i*25,
            width: 25,
            height: 25
            });
        }
        if(data[i][j]===2){
            // create player
            ctx.fillStyle="red";
            ctx.fill();
        }
        
    }
    }
}
//does update loop when window loads
window.addEventListener("load", function(){
  map();
  update();
});
 

document.body.addEventListener("keydown", function(e) {
    keys[e.keyCode] = true;
});
 
document.body.addEventListener("keyup", function(e) {
    keys[e.keyCode] = false;
});