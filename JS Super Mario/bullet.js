const maxBulletTravel = 200;

class bullet{

    constructor(posx,posy,direction_)
    {
        this.positionx = posx;
        this.positiony = posy;
        this.Intervall;
        this.type = "bullet";
        this.travel = 0;
        this.direction = direction_;
    }

    move()
    {   
        
        if(IsFreeSpace(this.positionx-1, this.positiony, this) === 1 && this.travel < maxBulletTravel && this.direction == "RGT"){
            ctx.clearRect(this.positionx,this.positiony,16,16);
            this.positionx++;
            this.travel++;
            this.draw();
        }
        else if(IsFreeSpace(this.positionx+1, this.positiony, this) === 1 && this.travel < maxBulletTravel && this.direction == "LFT"){
            ctx.clearRect(this.positionx,this.positiony,16,16);
            this.positionx--;
            this.travel--;
            this.draw();
        }else
        {
            this.die();
        }
        
        for (let i = 0; i < enemys.length; i++) {
            if(this.GetPosition() === enemys[i].GetPosition())
            {
                enemys[i].die();
                enemys.splice(i,1);
                this.die();
                break;
            }
        }
    }

    draw()
    {
        ctx.drawImage(this.GetImage(),this.positionx,this.positiony);
    }

    die()
    {
        clearInterval(this.Intervall);
        if(this.travel > 1){ctx.clearRect(this.positionx-16,this.positiony,32,16);}
    }

    GetImage(){
        var img = new Image();
        img.src = 'Img/FR.png';
        return img;
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
        return Math.floor((poscentery)/16) * 50 + Math.floor((poscenterx) / 16);
    }
}