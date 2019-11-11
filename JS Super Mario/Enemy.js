var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

class enemy
{
    constructor(blck)
    {
        var posx = (blck % 50) * 16;
        var posy = Math.floor(blck / 50) * 16;
        this.positionx = posx;
        this.positiony = posy-1;
        this.falling = false;
        this.walkingDirection = "LEFT";
        this.type = "enemy";
        this.id = blck;
    }

    move(movetox, movetoy)
    {
        ctx.clearRect(this.positionx,this.positiony,16,16);
        this.positionx = movetox;
        this.positiony = movetoy;
        this.draw();
    }

    draw()
    {
        ctx.drawImage(this.GetImage(),this.positionx,this.positiony);
    }

    GetImage()
    {
        var img = new Image()
        
        switch (this.walkingDirection) {
            case "LEFT":
                    img.src = 'Img/ELFT.png';
                break;
            case "RIGHT":
                    img.src = 'Img/ERGT.png';
                break;
        }

        return img;
    }
    
    die()
    {
        ctx.clearRect(this.positionx,this.positiony,16,16);
    }

    moveEnemy()
    { 
    
        var movex = this.positionx;
        var movey = this.positiony;

        if(this.walkingDirection === "LEFT" && IsFreeSpace(this.positionx - 1, this.positiony, this) === 1 &&  this.positionx > 0 && this.falling === false)
        {
            movex = this.positionx - 1;
        }
        else if (this.walkingDirection === "RIGHT" && IsFreeSpace(this.positionx + 1, this.positiony, this) === 1 && this.positionx < 784 && this.falling === false)
        {
            movex = this.positionx + 1;
        }
        else
        {
            movex = this.positionx;

            if(this.falling === false)
            {
            this.walkingDirection = this.walkingDirection === "LEFT" ? "RIGHT" : "LEFT";
            }
        }

        if(IsFreeSpace(this.positionx, this.positiony +2, this) === 1)
        {
        movey = this.positiony + 2;
        this.falling = true;
        }
        else if(IsFreeSpace(this.positionx, this.positiony +1, this) === 1)
        {
        movey = this.positiony + 1;
        this.falling = true;
        }
        else
        {
            this.falling = false;
            movey = this.positiony;
        }

        if(mario.GetPosition(-8) === this.GetPosition(0) && mario.falling === false)
        {
            mario.AddLive(false);
            if(mario.live === 0)
            {
                mario.AddLive(true);
                kex.Left = false;
                kex.Up = false;
                kex.Right = false;
                alert("You died!");
                clearInterval(playerMovement);
                clearInterval(enemyMovement);
                //loadGame(leveldesign[level],false);
                let randomvisual = setInterval(function(){generateRandomMap();},32);
                setTimeout(function(){clearInterval(randomvisual);},500);
            }
            else
            {
                for (var index = 0; index < enemys.length; index++) {
                    if(enemys[index].id === this.id)
                    {
                        enemys.splice(index,1)
                        this.die();
                        break;
                    }
                }
            }
        }
        else
        {
            if(mario.HasBuff() != "FREEZE"){this.move(movex,movey);}
        }
    }

    GetPosition(margin)
    {
        var poscentery = this.positiony;
        var poscenterx = this.positionx;

        if(margin != undefined)
        {
            poscentery += margin;
            poscenterx += 8;
        }
        return Math.floor((poscentery + 0)/16) * 50 + Math.floor((poscenterx + 0) / 16);
    }
}




