"use strict";

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
        this.live = type === "boss" ? 1 : 1;
        this.jumping = false;
        this.jumpheight = 0;
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
        }
        else {
            ctx.clearRect(this.positionx, this.positiony, 16, 16);
        }

    }

    moveEnemy() {

        var movex = this.positionx;
        var movey = this.positiony;
        let tolerancex = 1;
        // let tolerancey = 2;

        if (this.type === "boss") {
            this.walkingDirection = this.positionx > mario.positionx ? "LEFT" : "RIGHT";
            tolerancex = this.walkingDirection === "LEFT" ? 18 : 1;
            // tolerancey = this.walkingDirection === "LEFT" ? 18 : 1;
        }

        if (this.type === "boss") {
            if ((this.walkingDirection === "LEFT" && IsFreeSpace(this.positionx - tolerancex, this.positiony, this) != 1) && this.jumpheight < 66||
                (this.walkingDirection === "RIGHT" && IsFreeSpace(this.positionx + tolerancex, this.positiony, this) != 1)&& this.jumpheight < 66) {

                if (IsFreeSpace(this.positionx, this.positiony - 2, this) === 1 && this.jumpheight < 66) {
                    movey = this.positiony - 1;
                    this.jumping = true;
                    this.jumpheight++;
                }

            } else if (IsFreeSpace(this.positionx, this.positiony + 2, this) === 0) {
                this.jumpheight = 0;
                this.jumping = false;

            } else if (this.jumpheight === 66) {
                
                this.jumping = false;

            }
            console.log(this.jumpheight);
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
            movey = this.positiony + 2;
            this.falling = true;
        } else if (IsFreeSpace(this.positionx, this.positiony + 1, this) === 1 && this.jumping === false) {
            movey = this.positiony + 1;
            this.falling = true;
        } else if (this.jumping === false) {
            this.falling = false;
            movey = this.positiony;
        }

        var killtest = mario.GetPosition(8) - this.GetPosition(0);
        var killtest2 = mario.GetPosition(8) - this.GetPosition(15);


        if (((killtest === 0 || killtest2 === 0) && mario.falling === false && this.type != "boss") ||
            (this.type === "boss" && (killtest <= -199 && killtest >= -200 || killtest <= -99 && killtest >= -100 || killtest <= -1 && killtest >= 0))) {

            mario.AddLive(false);

            if (mario.live === 0) {

                kex.Left = false;
                kex.Up = false;
                kex.Right = false;
                mario.AddLive(true);

                alert("You died!");

                clearInterval(playerMovement);
                clearInterval(enemyMovement);

                if (useLVL) {
                    loadGame(leveldesign[level], false);
                } else {
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
                this.move(movex, movey);
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