//does requestAnimationFrame if the browzer allows it othrwise it uses setInterval
(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();
var canvas = document.getElementById("canvas"),
ctx = canvas.getContext("2d"),
//create width and height of canvas
width = 640,
height = 640,
//give starting player properties
keys = [],
friction = 0.8,
gravity = 0.3;
//set width and height of canvas
canvas.width = width;
canvas.height = height;

var data=[
    [1,2,0,0,1,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,0,0,1,0,0,1,0,0,0,0,0,1,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],
    [1,0,0,0,0,1,1,1,1,0,0,1,1,1,1,1],
    [1,0,0,0,0,1,1,1,0,0,1,1,1,1,1,1],
    [1,0,0,0,0,1,1,0,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,1,0,0,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];

// works for rectangles
var collide=function(obj1,obj2){
    if( obj1.x<obj2.x+obj2.w&&obj1.x+obj1.w>obj2.x&&
        obj1.y<obj2.y+obj2.h&&obj1.y+obj1.h>obj2.y)
    {
        return true;   
    }    
};
// Player Object
var Player=function(x,y,w,h,keyInputs,color){
    this.x=x;
    this.y=y;
    this.w=w;
    this.h=h;
    
    this.velx=0;
    this.vely=0;
    
    this.moveSpeed=0.25;
    this.maxSpeed=2.5;
    
    this.falling=false;
    this.gravity=0.4;
    this.color="red";
};

Player.prototype.update=function(blocks){
    // key inputs and there responses
    if(keys[38] || keys[32]){
      if(!this.jumping && !this.falling){
        this.vely=-8;
        this.falling=true;
      }
    }
    if(keys[39]){
        this.velx+=this.moveSpeed/2;
        this.frame+=this.frameSpeed;
        this.direction="right";
    }
    
    if(keys[37]){
      
        this.velx-=this.moveSpeed/2;
        this.frame+=this.frameSpeed;
        this.direction="left";
        
    }
    
    // if the right input key and the left input key are not pressed, decrease the velocity until it comes to a complete stop
    if(!keys[37]&&
        !keys[39])
    {
        if(this.velx>0){
            this.velx-=this.moveSpeed/2;
        }
        if(this.velx<0){
            this.velx+=this.moveSpeed/2;
        }
    }

    // limit the player's speed
    if(this.velx>this.maxSpeed){
        this.velx=this.maxSpeed;
    }
    if(this.velx<-this.maxSpeed){
        this.velx=-this.maxSpeed;
    }
    if(this.vely>12){
        this.vely=12;
    }
    
    // update the x and y positions
    this.x+=this.velx;
    this.applyCollision(blocks,this.velx,0);
    
    this.falling=true;
    this.y+=this.vely;
    this.applyCollision(blocks,0,this.vely);
    this.vely+=this.gravity;
};

Player.prototype.applyCollision=function(obj,velx,vely){
    for(var i=0; i<obj.length; i++){
        if(collide(this,obj[i]))
        {
            if(vely>0){
                this.vely=0;
                this.falling=false;
                this.y=obj[i].y-this.h;
            }
            if(vely<0){
                this.vely=0;
                this.falling=true;
                this.y=obj[i].y+obj[i].h;
            }
            if(velx<0){
                this.velx=0;
                this.x=obj[i].x+obj[i].w;
            }
            if(velx>0){
                this.velx=0;
                this.x=obj[i].x-this.w;
            }
        }
    }
};

Player.prototype.draw= function() {
    // draw the player
    ctx.fillStyle=this.color;
    ctx.fill();
    ctx.fillRect(this.x,this.y,this.w,this.h,10);
};

// store 'Player' objects into an array
var players=[];
players.add=function(x,y,w,h,keyInputs,color){
    players.push(new Player(x,y,w,h,keyInputs,color));
};
players.apply=function(blocks){
    for(var i=0; i<players.length; i++){
        players[i].draw();
        players[i].update(blocks);
    }
};

// Block Object
var Block=function(x,y,w,h,color){
    this.x=x;
    this.y=y;
    this.w=w;
    this.h=h;
    this.color=color;
};

Block.prototype.draw= function() {
    ctx.fillStyle=this.color;
    ctx.fill();
    ctx.fillRect(this.x,this.y,this.w,this.h);
};

var blocks=[];
blocks.add=function(x,y,w,h,color){
    blocks.push(new Block(x,y,w,h,color));
};
blocks.apply=function(players){
    for(var i=0; i<blocks.length; i++){
        blocks[i].draw();
    }
};

function update(){
	ctx.clearRect(0, 0, width, height);
  players.apply(blocks);
  blocks.apply(players);
  ctx.fillStyle="black";
    // run through the loop again
    requestAnimationFrame(update);
}

function map() {
    // this is the code that reads the data:
    // for loop for y axis
    for(var col=0; col<data.length; col++){
    // for loop for x axis
    for(var row=0; row<data[col].length; row++){
        if(data[col][row]===0){
            // leave blank
            ctx.fillStyle="white";
            ctx.fill();
            ctx.fillRect(row*25,col*25,25,25);
        }
        if(data[col][row]===1){
            // create block
            blocks.add(row*40,col*40,40,40,"black");
        }
        if(data[col][row]===2){
            // create player
            players.add(row*40,col*40,40,40);
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
