class tasten
{
	constructor(){
		this.Left = false;
		this.Right = false;
		this.Up = false;
		this.Bullet = false;
	}
}

document.onkeypress = function(e){kexpressed(e);};
document.onkeyup = function(e){kexreleased(e);};

function kexpressed(e){
	if(e.code === "KeyW"){kex.Up = true;}
	if(e.code === "KeyA"){kex.Left = true;}
	if(e.code === "KeyD"){kex.Right = true;}
	if(e.code === "Space"){kex.Bullet = true;}
}

function kexreleased(e){
	if(e.code === "KeyW"){kex.Up = false;}
	if(e.code === "KeyA"){kex.Left = false;}
	if(e.code === "KeyD"){kex.Right = false;}
	if(e.code === "Space"){kex.Bullet = false;}
}