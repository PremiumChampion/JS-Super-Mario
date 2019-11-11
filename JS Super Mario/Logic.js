var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var kex = new tasten();
var mario;
var jump;
var fire;
var itemPosition = 
[
    [0,0,16,16],
    [16,0,16,16],
    [32,0,16,16],
    [48,0,16,16],
    [64,0,16,16]
];

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

function startGame()
{
    GetBlock();
    mario = new player(0,0,"RGT");
    //loadGame(leveldesign[level],false);
    let randomvisual = setInterval(function(){generateRandomMap();},32);
    setTimeout(function(){clearInterval(randomvisual);},500);
}

function generateMap()
{
    mario.DrawLive();
    mario.move(0,477);
    //FLOOR
    for (let index = 0; index < 50; index++) {
        var tmp = index * 16;
        var tmpbck = new block(tmp,496,"BDN");
        tmpbck.draw();
    }

    //BDN
    for(var i = 0; i < mapdesign.length; i++)
    {
        var blck = mapdesign[i];
        var tmpx = blck % 50;
        var tmpy = Math.floor(blck / 50);
        var tmpbck = new block(tmpx * 16, tmpy * 16,"BDN");
        tmpbck.draw();
    }

    //PPE
    for(var i = 0; i < mapdesignPPE.length; i++)
    {
        var blck = mapdesignPPE[i];
        var tmpx = blck % 50;
        var tmpy = Math.floor(blck / 50);
        var tmpbck = new block(tmpx * 16, tmpy * 16,"PPE");
        tmpbck.draw();
    }

    //NRML
    for(var i = 0; i < mapdesignNRML.length; i++)
    {
        var blck = mapdesignNRML[i];
        var tmpx = blck % 50;
        var tmpy = Math.floor(blck / 50);
        var tmpbck = new block(tmpx * 16, tmpy * 16,"NRML");
        tmpbck.draw();
    }

    //QSTN
    for(var i = 0; i < mapdesignQSTN.length; i++)
    {
        var blck = mapdesignQSTN[i];
        var tmpx = blck % 50;
        var tmpy = Math.floor(blck / 50);
        var tmpbck = new block(tmpx * 16, tmpy * 16,"QSTN");
        tmpbck.draw();
    }

    //Finish
    var blck = 1549;
    var tmpx = blck % 50;
    var tmpy = Math.floor(blck / 50);
    var tmpbck = new block(tmpx * 16, tmpy * 16,"FNSH");
    tmpbck.draw();

    //ENEMYS
    for (var index = 0; index < enemydesign.length; index++) {
        enemys.push(new enemy(enemydesign[index]));
    }

    //Start Intervalls
    playerMovement = setInterval(function() {movePlayer()}, 10);
    enemyMovement = setInterval(function() {moveEnemys()}, 40);

}


function moveEnemys()
{
    if(mario.HasBuff() === "STAR")
    {
        var ClearArea = [0,1,-1,-50,-51,-49,50,49,51];

        for (var e = 0; e < enemys.length; e++) {

            for (let index = 0; index < ClearArea.length; index++) {
                
                if(mario.GetPosition(8) + ClearArea[index] === enemys[e].GetPosition())
                {   
                    enemys[e].die();
                    enemys.splice(e,1);
                    break;
                }
            }
        }
    }
    
    for (var index = 0; index < enemys.length; index++) 
    {
        enemys[index].moveEnemy();

        if((mario.GetPosition(14) === enemys[index].GetPosition(0)) || (mario.GetPosition()+1 === enemys[index].GetPosition()) 
            && jumpheight === 0 && mario.falling === true)
        {   
            enemys[index].die();
            enemys.splice(index,1);
            break;
        }
    }
    
}

function movePlayer()
{
    var movex = mario.positionx;
    var movey = mario.positiony;

    var speed = 1;

    var randomitem = Math.floor((Math.random()*7)+1);
    //randomitem = 6;

    //Action Questionblock
    for (var index = 0; index < mapdesignQSTN.length; index++) {
        
        if(mario.GetPosition(-5) === mapdesignQSTN[index])
        {   
            switch (randomitem) {
                case 7:
                case 1: mario.SetBuff("ENEMY"); break;
                case 2: mario.SetBuff("FIRE"); break;
                case 3: mario.SetBuff("LIVE"); break;
                case 4: mario.SetBuff("STAR"); break;
                case 5: mario.SetBuff("SPEED"); break;
                case 6: mario.SetBuff("FREEZE"); break;
            } 
            filledSpaces.splice(filledSpaces.indexOf(mapdesignQSTN[index]),1);
            mapdesignQSTN.splice(index,1);
            let blockposition = mario.GetPosition(8)-50;
            let tmpx = (blockposition % 50)*16;
            let tmpy = (blockposition / 50)*16;
            ctx.clearRect(tmpx,tmpy-10,16,26);
            mario.falling = true; 
            break;
        }    
    }

    if(mario.itm === "SPEED"){speed = 2;}
    
    if(mario.itm === "FIRE" && fire && kex.Bullet)
    {
        fire = false;
        var tmpbullet = new bullet(mario.positionx,mario.positiony, mario.playerDirection);
        tmpbullet.Intervall = setInterval(function(){tmpbullet.move()},1);

    }

    if(!kex.Bullet)
    {
        fire = true;
    }

    if(kex.Left === true && kex.Right === false && IsFreeSpace(mario.positionx - speed, mario.positiony, mario) === 1 &&  mario.positionx > 0)
    {
        movex = mario.positionx - speed;
        mario.playerDirection = "LFT";
    }
    else if (kex.Left === false && kex.Right === true && IsFreeSpace(mario.positionx + speed, mario.positiony, mario) === 1 && mario.positionx < 784 )
    {
        movex = mario.positionx + speed;
        mario.playerDirection = "RGT";  
    }else
    {
        movex = mario.positionx;
    }

    if(kex.Up === true && mario.falling === false)
    {
        if(IsFreeSpace(mario.positionx, mario.positiony - speed, mario) === 1){
            movey = mario.positiony - speed;
        }else{
            movey = mario.positiony;
            mario.falling = true;
            kex.Up = false;
        }
        if(jumpheight < 66){
            jumpheight++;
        }else{
            movey = mario.positiony;
            jumpheight = 0;
            mario.falling = true;
            kex.Up = false;
        }
    }

    if(kex.Up === false || mario.falling === true){
        if(IsFreeSpace(mario.positionx, mario.positiony + (1*2), mario) === 1){
            movey = mario.positiony + (1*2);
        }else{
            mario.falling = false;
            jumpheight = 0;
            movey = mario.positiony;
        }
    }
    if((IsFreeSpace(mario.positionx - speed, mario.positiony, mario) === 2 ||
        IsFreeSpace(mario.positionx + speed, mario.positiony, mario) === 2 ||
        IsFreeSpace(mario.positionx, mario.positiony + speed, mario) === 2 ||
        IsFreeSpace(mario.positionx, mario.positiony - speed, mario) === 2) === false)
    {
        mario.move(movex,movey);
    }else
    {
        clearInterval(playerMovement);
        clearInterval(enemyMovement);
        if(level + 1 < leveldesign.length)
        {
        level++;
        }
        //loadGame(leveldesign[level],false);
        //alert("Aim achieved!");
        kex.Left = false;
        kex.Up = false;
        kex.Right = false;
        generateRandomMap();
    }
}
