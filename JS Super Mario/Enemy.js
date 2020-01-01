"use strict";

window.ELFT = new Image();
window.ERGT = new Image();
window.BWSRL = new Image();
window.BWSRR = new Image();
ELFT.src = 'Img/ELFT.png';
ERGT.src = 'Img/ERGT.png';
BWSRL.src = 'Img/BWSRL.png';
BWSRR.src = 'Img/BWSRR.png';


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
        this.live = type === "boss" ? 2 : 1;
        this.jumping = false;
        this.jumpheight = 0;
        this.test = false;
    }

    fire(direction) {

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
                        return ELFT;
                    case "RIGHT":
                        return ERGT;
                }
                break;
            case "boss":
                switch (this.walkingDirection) {
                    case "LEFT":
                        return BWSRL;
                    case "RIGHT":
                        return BWSRR;
                }
                break;
        }
        return ELFT;
    }

    die() {

        if (this.type === "boss") {
            ctx.clearRect(this.positionx - 18, this.positiony - 25, 34, 41);
        }
        else {
            ctx.clearRect(this.positionx, this.positiony, 16, 16);
        }

    }

    moveEnemy() {

        var movex = this.positionx;
        var movey = this.positiony;
        let tolerancex = 1;

        if (this.type === "boss") {
            this.walkingDirection = this.positionx > mario.positionx ? "LEFT" : "RIGHT";
            tolerancex = this.walkingDirection === "LEFT" ? 18 : 1;
        }

        if (this.type === "boss") {
            if ((this.walkingDirection === "LEFT" && IsFreeSpace(this.positionx - tolerancex, this.positiony, this) != 1) && this.jumpheight < 66 ||
                (this.walkingDirection === "RIGHT" && IsFreeSpace(this.positionx + tolerancex, this.positiony, this) != 1) && this.jumpheight < 66) {

                if (IsFreeSpace(this.positionx, this.positiony - 2, this) === 1 && this.jumpheight < 66) {
                    movey--;
                    this.jumping = true;
                    this.jumpheight++;
                }

            } else if (IsFreeSpace(this.positionx, this.positiony + 2, this) === 0) {
                this.jumpheight = 0;
                this.jumping = false;

            } else if (this.jumpheight === 66) {
                this.jumping = false;

            }
        }

        if (this.walkingDirection === "LEFT" && IsFreeSpace(this.positionx - tolerancex, this.positiony, this) === 1 && this.positionx > 0 && this.falling === false) {
            movex -= 1;
        } else if (this.walkingDirection === "RIGHT" && IsFreeSpace(this.positionx + tolerancex, this.positiony, this) === 1 && this.positionx < 1600 && this.falling === false) {
            movex += 1;
        } else {

            if (this.falling === false) {

                if (this.type === "enemy") {
                    this.walkingDirection = this.walkingDirection === "LEFT" ? "RIGHT" : "LEFT";
                    this.turncount++;
                }
            }
        }

        if (IsFreeSpace(this.positionx, this.positiony + 2, this) === 1 && this.jumping === false) {
            movey += 2;
            this.falling = true;
        } else if (IsFreeSpace(this.positionx, this.positiony + 1, this) === 1 && this.jumping === false) {
            movey++;
            this.falling = true;
        } else if (this.jumping === false) {
            this.falling = false;
            movey = this.positiony;
        }

        var killtest = mario.GetPosition(8) - this.GetPosition(0);
        // var killtest2 = mario.GetPosition(8) - this.GetPosition(15);


        if (((killtest === 0) && mario.falling === false && this.type != "boss") ||
            (this.type === "boss" && (killtest <= -199 && killtest >= -200 || killtest <= -99 && killtest >= -100))) {

            mario.AddLive(false);

            if (mario.live === 0) {

                kex.Left = false;
                kex.Up = false;
                kex.Right = false;
                mario.AddLive(true);

                alert("You died!");

                clearInterval(playerMovement);
                clearInterval(enemyMovement);
                clearInterval(bossFire);

                if (useLVL) {
                    loadGame(leveldesign[level], false);
                } else {
                    generateRandomMap();
                    generateRandomMap();
                }

            } else {

                for (var index = 0; index < enemys.length; index++) {

                    this.live--;

                    if (enemys[index].id === this.id && this.live === 0) {

                        if (enemys[index].type === "boss") {
                            clearInterval(bossFire);
                        }

                        enemys.splice(index, 1)
                        this.die();

                        break;
                    }
                }
            }
        }
        else {

            if (mario.HasBuff() != "FREEZE") {

                if (bossFire === null) {

                    bossFire = setInterval(function () {

                        for (let inde = 0; inde < enemys.length; inde++) {

                            if (enemys[inde].type === "boss") {
                                var testbul = enemys[inde].positionx - mario.positionx;

                                if (testbul < 400 && testbul > -400) {
                                    // var tmpbullet3 = new bullet(enemys[inde].positionx, enemys[inde].positiony, enemys[inde].walkingDirection === "LEFT" ? "LFT" : "RGT", "enemy");
                                    // tmpbullet3.Interval = setInterval(function () { tmpbullet3.move() }, 3);
                                    var abc = enemys[inde].walkingDirection === "LEFT" ? 32 : 0;
                                    var tmpbullet2 = new bullet((enemys[inde].positionx - abc), enemys[inde].positiony - 16, enemys[inde].walkingDirection === "LEFT" ? "LFT" : "RGT", "enemy");
                                    tmpbullet2.Intervall = setInterval(function () { tmpbullet2.move() }, 20);
                                }
                            }
                        }
                    }, 3000);
                }

                if (this.type === "boss") {
                    if (this.test && this.positionx === movex && this.positiony === movey && IsFreeSpace(this.positionx + 1, this.positiony + 16, this)) {
                        console.log(this.positionx + " " + movex + " " + this.positiony + " " + movey)
                        mapdesignNRML.push(this.GetPosition());
                        var tmpbck1 = new block(this.positionx + 1, this.positiony + 16, "NRML");
                        tmpbck1.draw();
                        this.test = false;
                    } else {
                        this.test = true;
                    }
                }

                this.move(movex, movey);
            } else {
                clearInterval(bossFire);
                bossFire = null;
            }
        }
    }

    GetPosition(margin) {

        if (this != undefined) {

            var poscentery = this.positiony;
            var poscenterx = this.positionx;

            if (margin != undefined) {
                poscentery += 8;
                poscenterx += margin;
            }

            if (this.type === "boss") {
                poscentery = this.positiony + 16;
                poscenterx = this.positionx;
            }

            return Math.floor((poscentery + 0) / 16) * 100 + Math.floor((poscenterx + 0) / 16);
        }
        return -1;
    }
}