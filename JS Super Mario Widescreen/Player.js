"use strict";

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
        var lft = new Image();
        lft.src = 'Img/LFT.png';
        var rgt = new Image();
        rgt.src = 'Img/RGT.png';

        return this.playerDirection === "RGT" ? rgt : lft;
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
            var img = new Image();
            switch (item) {
                case "FIRE":
                    img.src = 'Img/FR.png';
                    itmTimeoutTime *= 10;
                    break;
                case "STAR":
                    img.src = 'Img/STR.png';
                    itmTimeoutTime *= 5;
                    break;
                case "SPEED":
                    img.src = 'Img/SPD.png';
                    itmTimeoutTime *= 3;
                    break;
                case "FREEZE":
                    img.src = 'Img/FRZZ.png';
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