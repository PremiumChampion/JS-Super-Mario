"use strict";
const maxBulletTravel = 200;

class bullet {

    constructor(posx, posy, direction_, shooter_) {
        this.positionx = posx;
        this.positiony = posy;
        this.Intervall;
        this.type = "bullet";
        this.travel = 0;
        this.direction = direction_;
        this.shooter = shooter_;
    }

    move() {

        if (IsFreeSpace(this.positionx + 1, this.positiony, this) === 1 && this.travel < maxBulletTravel && this.direction == "RGT") {
            ctx.clearRect(this.positionx, this.positiony, 16, 16);
            this.positionx++;
            this.travel++;
            this.draw();
        } else if (IsFreeSpace(this.positionx - 1, this.positiony, this) === 1 && this.travel < maxBulletTravel && this.direction == "LFT") {
            ctx.clearRect(this.positionx, this.positiony, 16, 16);
            this.positionx--;
            this.travel++;
            this.draw();
        } else {
            this.die();
        }


        if (this.shooter === "player") {
            for (let i = 0; i < enemys.length; i++) {
                if (enemys[i].type === "enemy") {

                    if (this.GetPosition(1) === enemys[i].GetPosition()) {
                        enemys[i].die();
                        enemys.splice(i, 1);
                        this.die();
                        break;
                    }

                } else {

                    var testBullet = this.GetPosition(2) - enemys[i].GetPosition();

                    if (testBullet === -99 || testBullet === -100 || testBullet === -199 || testBullet === -200) {
                        enemys[i].die();
                        enemys.splice(i, 1);
                        this.die();
                        break;
                    }
                }
            }
        } else {
            var testBullet = this.GetPosition(1) - mario.GetPosition(1);
            if (testBullet === 0) {
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
                    }
                    // developement();

                }
                this.die();
            }
        }
    }

    draw() {

        ctx.drawImage(this.GetImage(), this.positionx, this.positiony);

    }

    die() {
        clearInterval(this.Intervall);
        ctx.clearRect(this.positionx, this.positiony, 16, 16);
    }

    GetImage() {
        var img = new Image();
        img.src = 'Img/FR.png';
        return img;
    }


    GetPosition(margin) {
        var poscentery = this.positiony;
        var poscenterx = this.positionx;

        if (margin != undefined) {
            poscentery += margin;
            poscenterx += 8;
        }
        return Math.floor((poscentery) / 16) * 100 + Math.floor((poscenterx) / 16);
    }
}