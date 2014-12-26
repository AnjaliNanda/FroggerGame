var Engine = (function(global) {
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        givenMb = 0,
        ctx = canvas.getContext('2d'),
        lastTime,
        winFlag = 1,
        lostFlag = 1,
        soundEfx = new Audio("sounds/bongo_bckgrnd.mp3"),
        bite = new Audio("sounds/bite.wav"),
        winSnd = new Audio("sounds/win.wav");


    canvas.width = 909;
    canvas.height = 680;
    doc.body.appendChild(canvas);

    function main() {
        var now = Date.now(),
        dt = (now - lastTime) / 1000.0;
        update(dt);
        render();
        lastTime = now;
        win.requestAnimationFrame(main);
    }

    // This function does some initial setup that should only occur once

    function init() {
        reset();
        lastTime = Date.now();
        babyBoy.cry();
        main(); 
    }

    //This function plays background music in a loop until game is over
    function playBckgrndMusic() {
        if(!gameOver()) {
            soundEfx.loop = true;
            soundEfx.play();
        }
    }
    //This is the function call to playBckgrndMusic
    playBckgrndMusic();
    //Updating all entities 
    function update(dt) {
        updateEntities(dt);
        bugCollision();
        gameOver();
        collectMilkBottle();
        chkBabyCry();
        winner();
    }

    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
    }

    //This function checks the collision for bug with the player
    function bugCollision() {
        for (var i = 0; i < allEnemies.length; i++) {
            if(collide(player,allEnemies[i],40)) {
                bite.play();
                player.resetPosition();
                player.lossLife();
                milkBottle.resetPosition();
            }
        }
    }

    //This function lets the player to 'collect' the milk bottle : 
    //uses collision and change of player sprite
    function collectMilkBottle() {
        if (collide(player, milkBottle, 60)) {
            player.sprite = player.withMb;
            milkBottle.hide();
        }
   }

    //This function checks which of the two babies is crying: calls giveMb function 
    //to give milk to respective baby and uses setTimeOut function to switch the baby crying 
    function chkBabyCry() {
        if (player.sprite === player.withMb) {
            if((babyBoy.sprites.main === babyBoy.sprites.hungry) && (collide(player,babyBoy,60))) {
                    giveMb(player,babyBoy);
                    setTimeout(function () {babyGirl.cry();}, 2000);
            } else if((babyGirl.sprites.main === babyGirl.sprites.hungry) && (collide(player,babyGirl,60))) {
                    giveMb(player,babyGirl);
                    setTimeout(function () {babyBoy.cry();}, 3000);
            }
        }
    }
   
    //This function allows player to give Milk to the baby crying and 
    //change it's status from crying to happy
    function giveMb(player,cryBaby) {
        cryBaby.sprites.main = cryBaby.sprites.withMb;
        milkBottle.resetPosition();
        player.resetPosition();
        givenMb++;
   }

    //This function checks for collision during the game between any two entities 
    function collide(player,entity,theta) {
        if((entity.x >= (player.x - theta - 20)) && (entity.x <= (player.x + theta + 30))) {
            if ((entity.y >= (player.y - theta + 20)) && (entity.y <= (player.y + theta - 15))){
                return true;
            }
        }
    }

    //This detects the game over, when there is no more life for player left (3 allowed)
    function gameOver() {
        if(player.life === 0) {
            soundEfx.pause();
            enemy.speed = 0;
            player.speed = 0;
            player.sprite = player.sad;
            player.x = 410;
            player.y = 240;
            allEnemies = [];
            milkBottle.hide();
            ctx.font = "35px Arial";
            ctx.fillStyle = "red";
            ctx.fillText("Game Over", 350, 45);
            if(lostFlag === 1) {
                babyGirl.cry();
                babyBoy.cry();
                lostFlag++;
            }
        }
    }

    //This function announces the winner with a background music and 
    //meme text when the conditions are met: minimum feed set to four bottles 
    function winner() {
        if((givenMb === 4) && (player.life)) {
            soundEfx.pause();
            enemy.speed = 0;
            player.speed = 0;
            player.x = 410;
            player.y = 45;
            allEnemies = [];
            milkBottle.hide();
            babyGirl.happy();
            babyBoy.happy();
            ctx.font = "35px Arial";
            ctx.fillStyle = "Blue";
            ctx.fillText("You Won!", 350, 45);
            if(winFlag === 1) {
                winSnd.play();
                winFlag++;
            }
        }
    }

    function render() {
        var rowImages = [
                'images/grass-block.png',   // Top row is grass
                'images/grass-block.png',   // grass
                'images/stone-block.png',   // Row 1 of 4 of stone
                'images/stone-block.png',   // Row 2 of 4 of stone
                'images/stone-block.png',   // Row 3 of 4 of stone
                'images/stone-block.png',   // Row 4 of 4 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 7,
            numCols = 9,
            row, col;

        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }
        renderEntities();
    }

    function renderEntities() {
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });
        player.render();
        babyBoy.render();
        babyGirl.render();
        milkBottle.render();
    }

    function reset() {
        // noop
    }

    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/babyBoyHpy.png',
        'images/babyBoySad.png',
        'images/babyBoyMb.png',
        'images/babyGirlHpy.png',
        'images/babyGirlSad.png',
        'images/babyGirlMb.png',
        'images/milkbottle.png',
        'images/char-pink-girlMb.png',
        'images/char-pink-girl.png',
        'images/life.png',
        'images/char-pink-girl-sad.png',
        'images/confetti.png'
    ]);
    Resources.onReady(init);

    global.ctx = ctx;
})(this);
