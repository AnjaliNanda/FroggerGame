//Variable declarations
var PLAYER_StrtX = 0,
    PLAYER_StrtY = 497,
    ENEMY_StrtX = -40,
    ENEMY_StrtY = [142, 225, 308, 391],
    ENEMY_Speed = [150, 200, 400, 500, 300,350],
    PLAYER_MoveY = 85,
    PLAYER_MoveX = 101,
    player_life = 3,
    level = 1,
    MILKBottle_X = [0,101,202,303,404,505,606,707,808],
    MILKBottle_Y = [142, 225, 308, 391];

var cryBabySnd1 = new Audio("sounds/cry1.mp3");


//Enemy functions : bugs in this game which player must avoid
//this.y generates random positions bugs on y axis
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.x = ENEMY_StrtX;
    this.y = ENEMY_StrtY[Math.floor(Math.random()*4)];
    this.speed = ENEMY_Speed[Math.floor(Math.random()*6)];
}
// Update the enemy's position
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
        if(this.x > 950)
        {
            this.x = ENEMY_StrtX;
            this.y = ENEMY_StrtY[Math.floor(Math.random()*4)];
            this.speed = ENEMY_Speed[Math.floor(Math.random()*6)];
        }
        this.x = this.x + (this.speed*dt);
}
//Renders the bug sprite on the canvas
Enemy.prototype.render = function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
//Creating a new enemy object 
var enemy = new Enemy();
var allEnemies = [enemy];

//This function checks the level of the game and generates bugs 
//accordingly by calling spawnEnemy function
function chkLevel() {
    if (level === 1)
        spawnEnemy(3);
    else if (level === 2)
        spawnEnemy(5);
}
//This function is called by chkLevel function 
//to create enemy bugs acc. to the game level
function spawnEnemy(n) {
    for (var i = 0; i < n; i++) {
        var createEnemy = new Enemy();
        allEnemies.push(createEnemy);
    }
}
chkLevel();//function invoke to chk the level of the game
//End Enemy functions


//Player Functions
var Player = function(x,y,life) {
    this.sprite = 'images/char-pink-girl.png';
    this.withMb = 'images/char-pink-girlMb.png';
    this.playerLife = 'images/life.png';
    this.sad = 'images/char-pink-girl-sad.png';
    this.x = x;
    this.y = y;
    this.speed = 8;
    this.life = life;
};
// Update the player's position
// Parameter: dt, a time delta between ticks
Player.prototype.update = function(dt) {
    this.x * dt + this.speed;
    this.y * dt + this.speed;
};
//Renders player sprite on the canvas
Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    var positionX = 0
    for (var i = 1; i <= this.life; i++) {
        ctx.drawImage(Resources.get(this.playerLife), 5 + positionX, 50);
        positionX += 30;
    }
};
//This function resets the position of the player 
Player.prototype.resetPosition = function() {
    this.x = PLAYER_StrtX;
    this.y = PLAYER_StrtY;
    this.sprite = 'images/char-pink-girl.png';
};
//This function reduces the life of 
//the player after collision with bug
Player.prototype.lossLife = function() {
    this.life-- ;
};
//This function moves the player around the 
//canvas based on the arrow keys pushed
Player.prototype.handleInput = function(key) {
    switch(key) {
        case 'left':
            if (this.x < -40){
                this.x = 880;
            } else {
                this.x -= this.speed;
            }
            break;  
        case 'right':
            if (this.x > 880){
                this.x = -40;
            } else {
                this.x += this.speed;
            }
             break;
        case 'up':
            if (this.y < 1){
            } else {
                this.y -= this.speed;
            }
            break;
        case 'down':
            if(this.y > 500){
            } else {
                this.y += this.speed;
            }
            break;
        default :
                return;
    }
};

var player = new Player(PLAYER_StrtX, PLAYER_StrtY, player_life);
// end player function


//Baby Functions
//different sprites of babies are declared here such as : hungry,happy,with Milk bottle
var spriteTemplates = {
        boy: {
            "main": "images/babyBoyHpy.png",
            "hungry": "images/babyBoySad.png",
            "withMb": "images/babyBoyMb.png",
            "smile": "images/babyBoyHpy.png"
        },
        girl: {
            "main": "images/babyGirlHpy.png",
            "hungry": "images/babyGirlSad.png",
            "withMb": "images/babyGirlMb.png",
            "smile": "images/babyGirlHpy.png"
        }
};

var Baby = function(spriteSet,x,y) {
    this.sprites = spriteSet;
    this.x = x;
    this.y = y;
};

Baby.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprites.main), this.x, this.y);
};
//This function changes the baby's main sprite to 
//crying sprite and also plays the crying audio
Baby.prototype.cry = function() {
    this.sprites.main = this.sprites.hungry;
    cryBabySnd1.play();
};
//This function changes the baby's main or crying sprite to 
//happy sprite and the crying audio is paused
Baby.prototype.happy = function() {
    this.sprites.main = this.sprites.smile;
    cryBabySnd1.pause();
};
//Creating two new objects of class Baby:- babyGirl, babyBoy
var babyGirl = new Baby(spriteTemplates.girl,810,45);
var babyBoy = new Baby(spriteTemplates.boy,2,45);
//end Baby


//milk bottle
//Player needs to get these to give the hungry baby
var MilkBottle = function() {
    this.sprite = 'images/milkbottle.png';
    this.x = MILKBottle_X[Math.floor(Math.random()*9)];
    this.y = MILKBottle_Y[Math.floor(Math.random()*4)];
};

MilkBottle.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
//This function hides the milk bottle by putting it in negative x and y axis 
//after it is collected by player in engine.js via collectMilkBottle() function
MilkBottle.prototype.hide = function() {
    this.x = -800;
    this.y = -800;
};
//This function resets the position of milk bottle 
//after it is given to baby via giveMb() function in engine.js  
MilkBottle.prototype.resetPosition = function() {
    this.x = MILKBottle_X[Math.floor(Math.random()*9)];
    this.y = MILKBottle_Y[Math.floor(Math.random()*4)];
};
//Creates a new object milkBottle of class MilkBottle
var milkBottle = new MilkBottle();
//end milkbottle


//Event function
//listens for key presses and sends the keys to Player.handleInput() method.
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37  : 'left',
        38  : 'up',
        39  : 'right',
        40  : 'down',
        32  : 'jump'
    };
    if (e.keyCode in allowedKeys){
        e.preventDefault();
    }
    player.handleInput(allowedKeys[e.keyCode]);
});
//end of event function