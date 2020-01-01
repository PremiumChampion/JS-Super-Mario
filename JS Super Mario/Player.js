"use strict";
window.RGT = new Image();
window.LFT = new Image();
window.FR = new Image();
window.STR = new Image();
window.SPD = new Image();
window.FRZZ = new Image();
RGT.src = 'Img/RGT.png';
LFT.src = 'Img/LFT.png';
FR.src = 'Img/FR.png';
STR.src = 'Img/STR.png';
SPD.src = 'Img/SPD.png';
FRZZ.src = 'Img/FRZZ.png';
var itemTimeout;

class player {
    constructor(posx, posy, playerDirection_) {
        this.type = "player";
        this.positionx = posx;
        this.positony = posy;
        this.playerDirecition = playerDirection_;
        this.falling = false;
        this.itm;
        this.live = 1;
    }

    move(movetox, movetoy) {
        ctx.clearRect(this.positionx, this.positiony, 16, 16);
        this.positionx = movetox;
        this.positiony = movetoy;
        ctx.drawImage(this.GetImage(), this.positionx, this.positiony);
    }

    GetImage() {
        return this.playerDirection === "RGT" ? RGT : LFT;
    }

    GetPosition(margin) {
        var poscentery = this.positiony;
        var poscenterx = this.positionx;

        if (margin != undefined) {
            poscentery += margin;
            poscenterx += 8;
        }

        return Math.floor((poscentery + 0) / 16) * 100 + Math.floor((poscenterx) / 16);
    }

    SetBuff(item) {

        if (item != "LIVE") {
            var itmTimeoutTime = 1000;
            var img;
            switch (item) {
                case "FIRE":
                    img = FR;
                    itmTimeoutTime *= 10;
                    break;
                case "STAR":
                    img = STR;
                    itmTimeoutTime *= 5;
                    break;
                case "SPEED":
                    img = SPD;
                    itmTimeoutTime *= 3;
                    break;
                case "FREEZE":
                    img = FRZZ;
                    itmTimeoutTime *= 5;
                    break;
            }

            mario.itm = item;
            clearTimeout(itemTimeout);
            ctx.clearRect(0, 0, 16, 16);
            ctx.drawImage(img, 0, 0);
            itemTimeout = setTimeout(function () {
                mario.itm = "";
                ctx.clearRect(0, 0, 16, 16);
            }, itmTimeoutTime);

        } else {
            mario.AddLive(true);
        }

        if (mario.itm === "ENEMY") {
            enemys.push(new enemy(this.GetPosition(8) - 100));
        }
    }

    AddLive(Add) {
        var temptext = "" + this.live;
        ctx.font = "16px Arial";
        var w = ctx.measureText("" + this.live).width + 5;
        ctx.clearRect(16, 0, w, 20);

        if (Add) {
            this.live++;
        } else {
            this.live--;
        }

        temptext = "" + this.live;
        ctx.fillText(temptext, 16, 16);
    }

    DrawLive() {
        ctx.font = "16px Georgia"
        var temptext = "" + this.live;
        var w = ctx.measureText("" + this.live).width;
        ctx.clearRect(itemPosition[1][0], itemPosition[1][1], w, 16);
        ctx.fillText(temptext, 16, 16);
    }


    HasBuff() {
        return this.itm;
    }


}