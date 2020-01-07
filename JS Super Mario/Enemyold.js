var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

class enemy {

    constructor(blck, type = "enemy") {
        var posx = (blck % 100) * 16;
        var posy = Math.floor(blck / 100) * 16;
        this.positionx = posx;
        this.positiony = posy - 1;
        this.falling = false;
        this.walkingDirection = "LEFT";
        this.type = type;
        this.id = blck;
        this.turncount = 0;
        this.live = type === "enemy" ? 1 : 10;
        this.shoot = type === "enemy" ? null : setInterval(function () { this.fireShot(this); }, 1000);
    }

    move(movetox, movetoy) {
        this.die();
        this.positionx = movetox;
        this.positiony = movetoy;
        this.draw();
    }

    draw() {
        if (this.type === "boss") {
            ctx.drawImage(this.GetImage(), this.positionx - 18, this.positiony - 25);
        }
        else {
            ctx.drawImage(this.GetImage(), this.positionx, this.positiony);
        }
    }

    GetImage() {
        var img = new Image();
        switch (this.type) {
            case "enemy":
                switch (this.walkingDirection) {
                    case "LEFT":
                        img.src = 'Img/ELFT.png';
                        break;
                    case "RIGHT":
                        img.src = 'Img/ERGT.png';
                        break;
                }
                break;
            case "boss":
                switch (this.walkingDirection) {
                    case "LEFT":
                        img.src = 'Img/BWSRL.png';
                        break;
                    case "RIGHT":
                        img.src = 'Img/BWSRR.png';
                        break;
                }
                break;
            default:
                break;
        }
        return img;
    }

    die() {
        if (this.type === "boss") {
            ctx.clearRect(this.positionx - 18, this.positiony - 25, 34, 41);
            clearInterval(this.shoot);
        }
        else {
            ctx.clearRect(this.positionx, this.positiony, 16, 16);
        }

    }

    moveEnemy() {

        var movex = this.positionx;
        var movey = this.positiony;
        let tolerancey = 2;
        let tolerancex = 1;

        if (this.type === "boss") {
            tolerancex = this.walkingDirection === "LEFT" ? 18 : 1;
            tolerancey = this.walkingDirection === "LEFT" ? 18 : 1;
        }

        if (this.walkingDirection === "LEFT" && IsFreeSpace(this.positionx - tolerancex, this.positiony, this) === 1 && this.positionx > 0 && this.falling === false) {
            movex = this.positionx - 1;
        } 
        else if (this.walkingDirection === "RIGHT" && IsFreeSpace(this.positionx + tolerancex, this.positiony, this) === 1 && this.positionx < 1600 && this.falling === false) {
            movex = this.positionx + 1;
        } 
        else {
            movex = this.positionx;

            if (this.falling === false) {
               
                if (this.type === "enemy") {
                    this.walkingDirection = this.walkingDirection === "LEFT" ? "RIGHT" : "LEFT";
                }
                else {
                    this.walkingDirection = this.positionx > mario.positionx ? "LEFT" : "RIGHT";
                }
                if (this.type === "enemy") { this.turncount++; }
            }
        }


        if (IsFreeSpace(this.positionx, this.positiony + 2, this) === 1) {
            movey = this.positiony + 2;
            this.falling = true;
        } else if (IsFreeSpace(this.positionx, this.positiony + 1, this) === 1) {
            movey = this.positiony + 1;
            this.falling = true;
        } else {
            this.falling = false;
            movey = this.positiony;
        }


        if (mario.GetPosition(-8) === this.GetPosition(0) && mario.falling === false) {
            mario.AddLive(false);
            if (mario.live === 0) {
                mario.AddLive(true);
                kex.Left = false;
                kex.Up = false;
                kex.Right = false;
                alert("You died!");
                clearInterval(playerMovement);
                clearInterval(enemyMovement);

                var mapdesign = [];
                var mapdesignPPE = [];
                var mapdesignNRML = [];
                var mapdesignQSTN = [];
                var enemydesign = [];
                var enemys = [];

                loadGame("############################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################H#H##H##############################################################################################################################################################################################",false);
                // let randomvisual = setInterval(function () { generateRandomMap(); }, 32);
                // setTimeout(function () { clearInterval(randomvisual); }, 500);
            } else {

                for (var index = 0; index < enemys.length; index++) {
                    this.live--;

                    if (enemys[index].id === this.id && this.live === 0) {
                        this.die();
                        enemys.splice(index, 1)
                        break;
                    }
                }
            }
        } else {
            if (mario.HasBuff() != "FREEZE") { this.move(movex, movey); }
        }
    }

    GetPosition(margin) {
        var poscentery = this.positiony;
        var poscenterx = this.positionx;

        if (margin != undefined) {
            poscentery += margin;
            poscenterx += 8;
        }

        if (this.type === "boss") {
            poscentery = this.positiony + 8;
            poscenterx = this.positionx;
        }
        return Math.floor((poscentery + 0) / 16) * 100 + Math.floor((poscenterx + 0) / 16);
    }
}

function fireShot(boss) {
    let direction = boss.positionx > mario.positionx ? "LFT" : "RGT";
    let tmpbullet = new bullet(boss.positionx, boss.positiony, direction);
    tmpbullet.Intervall = setInterval(function () { tmpbullet.move(); }, 2);
}