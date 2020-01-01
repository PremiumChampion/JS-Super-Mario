"use strict";
var heighestblck = 10000;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var kex = new tasten();
var mario;
var jump;
var fire;
var fireBoss = true;
var msgShown = false;
var useLVL = false;
var secondtime = true;
var itemPosition = [
    [0, 0, 16, 16],
    [16, 0, 16, 16],
    [32, 0, 16, 16],
    [48, 0, 16, 16],
    [64, 0, 16, 16]
];

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {

}

//Mapdesign
var mapdesign = [];
var mapdesignPPE = [];
var mapdesignNRML = [];
var mapdesignQSTN = [];
var enemydesign = [];
var enemys = [];
var jumpheight = 0;

// Intervall
var playerMovement;
var enemyMovement;
var ppeIntervalls = [];
var bossFire;

function startGame() {

    GetBlock();
    mario = new player(0, 0, "RGT");

    if (useLVL) {
        loadGame(leveldesign[level], false);
    } else {
        generateRandomMap();
        generateRandomMap();
    }

}




function moveEnemys() {

    // BUFF STAR
    if (mario.HasBuff() === "STAR") {
        var ClearArea = [0, 1, -1, -100, -101, -99, 100, 99, 101];

        for (var e = 0; e < enemys.length; e++) {

            for (let index = 0; index < ClearArea.length; index++) {

                if (mario.GetPosition(8) + ClearArea[index] === enemys[e].GetPosition()) {
                    enemys[e].die();
                    enemys.splice(e, 1);
                    break;
                }
            }
        }
    }

    // Normal Killing
    var killrange = mario.direction === "LFT" ? -1 : 0;
    for (var index = 0; index < enemys.length; index++) {
        enemys[index].moveEnemy();
        try {
            var bosstest = mario.GetPosition(0) - enemys[index].GetPosition(0) + 300;
            var enemytest = mario.GetPosition(0) - enemys[index].GetPosition(0);
        } catch{ }

        try {
            if ((enemytest >= -100 + killrange && enemytest <= -99 + killrange) && (jumpheight > 0 || mario.falling) ||
                ((bosstest >= -201 && bosstest <= -199) && (jumpheight > 0 || mario.falling) && enemys[index].type === "boss") || enemys[index].turncount >= 50) {
                enemys[index].die();
                enemys.splice(index, 1);
                break;
            }
        } catch{ }
    }

}

function movePlayer() {

    var movex = mario.positionx;
    var movey = mario.positiony;
    var speed = 1;

    //Action Questionblock
    if (secondtime) {
        secondtime = false;
        for (var index = 0; index < mapdesignQSTN.length; index++) {

            if (mario.GetPosition(-5) === mapdesignQSTN[index]) {

                var randomitem = Math.floor((Math.random() * 7) + 1);
                switch (randomitem) {
                    case 7:
                    case 1:
                        mario.SetBuff("ENEMY");
                        break;
                    case 2:
                        mario.SetBuff("FIRE");
                        break;
                    case 3:
                        mario.SetBuff("LIVE");
                        break;
                    case 4:
                        mario.SetBuff("STAR");
                        break;
                    case 5:
                        mario.SetBuff("SPEED");
                        break;
                    case 6:
                        mario.SetBuff("FREEZE");
                        break;
                    default:
                        mario.SetBuff("SPEED");
                        break;
                }

                var randomitem = Math.floor((Math.random() * 7) + 1);

                filledSpaces.splice(filledSpaces.indexOf(mapdesignQSTN[index]), 1);
                mapdesignQSTN.splice(index, 1);
                let blockposition = mario.GetPosition(8) - 100;
                let tmpx = (blockposition % 100) * 16;

                let tmpy = Math.floor(blockposition / 100) * 16;
                ctx.clearRect(tmpx, tmpy, 16, 26);
                mario.falling = true;

                break;
            }
        }
    } else {
        secondtime = true;
    }
    if (mario.itm === "SPEED") { speed = 2; }

    if (mario.itm === "FIRE" && fire && kex.Bullet) {
        fire = false;

        var tmpbullet = new bullet(mario.positionx, mario.positiony - 1, mario.playerDirection, "player");
        tmpbullet.Intervall = setInterval(function () { tmpbullet.move() }, 3);
    }

    if (!kex.Bullet) {
        fire = true;
    }

    if (kex.Left === true && kex.Right === false && IsFreeSpace(mario.positionx - speed, mario.positiony, mario) === 1 && mario.positionx > 0) {
        movex = mario.positionx - speed;
        mario.playerDirection = "LFT";

    } else if (kex.Left === false && kex.Right === true && IsFreeSpace(mario.positionx + speed, mario.positiony, mario) === 1 && mario.positionx < 1584) {
        movex = mario.positionx + speed;
        mario.playerDirection = "RGT";

    } else {
        movex = mario.positionx;
    }

    if (kex.Up === true && mario.falling === false) {
        if (IsFreeSpace(mario.positionx, mario.positiony - speed, mario) === 1) {
            movey = mario.positiony - speed;
        } else {
            movey = mario.positiony;
            mario.falling = true;
            kex.Up = false;
        }

        let maxjump = mario.itm === "SPEED" ? 44 : 66;
        if (jumpheight < maxjump) {
            jumpheight++;
        } else {
            movey = mario.positiony;
            jumpheight = 0;
            mario.falling = true;
            kex.Up = false;
        }
    }

    if (kex.Up === false || mario.falling === true) {
        if (IsFreeSpace(mario.positionx, mario.positiony + (1 * 2), mario) === 1) {
            movey = mario.positiony + (1 * 2);
        } else {
            mario.falling = false;
            jumpheight = 0;
            movey = mario.positiony;
        }
    }
    if ((
        IsFreeSpace(mario.positionx - speed, mario.positiony, mario) === 2 ||
        IsFreeSpace(mario.positionx + speed, mario.positiony, mario) === 2 ||
        IsFreeSpace(mario.positionx, mario.positiony + speed, mario) === 2 ||
        IsFreeSpace(mario.positionx, mario.positiony - speed, mario) === 2) === false) {
        mario.move(movex, movey);

    } else if (!BossAlive()) {
        clearInterval(playerMovement);
        clearInterval(enemyMovement);
        kex.Left = false;
        kex.Up = false;
        kex.Right = false;
        clearInterval(bossFire);

        if (level + 1 < leveldesign.length) {
            level++;
        }

        if (useLVL) {
            loadGame(leveldesign[level], false);
        } else {
            level--;
            generateRandomMap();
            generateRandomMap();
        }
    } else {
        if (!msgShown) {
            alert("Please kill Bowser first!");
            msgShown = true;
        } else { }

    }
}