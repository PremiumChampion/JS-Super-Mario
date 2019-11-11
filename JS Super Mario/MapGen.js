
class NRML
{
    constructor(area_,hillstartx_,hillstarty_,hillsizex_,hillsizey_,hilldegredation_)
    {
        this.area = area_;
        this.hillstartx = hillstartx_; 
        this.hillstarty = hillstarty_; 
        this.hillsizex = hillsizex_;
        this.hillsizey = hillsizey_;
        this.hilldegredation = hilldegredation_;
        this.actioncount = Math.floor(Math.random()*2)+1;
    }

    decode()
    {
        let hill_ = [];
        let ppe_ = [];
        let enemy_ = [];
        let qstn_ = [];
        let originhillsize = this.hillsizex;
        for (let y = 0; y < this.hillsizey; y++) 
        {
            for(let x = 0; x < this.hillsizex; x++)
            {
                let county = (30-y)*50;
                let countx = (this.area + x);
                hill_.push(county + countx);
            }
            this.hillsizex *= this.hilldegredation;

            if(y === this.hillsizey-1)
            {
                for(let action = 0; action < this.actioncount; action++)
                {
                    let type = Math.floor(Math.random()*4)+1;
                    let countx = this.area + Math.floor(Math.random()*this.hillsizex)+1;
                    var couty = 0;
                    switch (type) {
                        case 1: // PPE
                            if(Math.round(Math.random())===1){
                                couty = (30-y-1)*50;
                                ppe_.push(couty + countx);
                            }
                            break;
                        case 4:
                        case 2: // ENEMY
                            couty = (30-y-1)*50;
                            enemy_.push(couty + countx);
                            break;
                        case 3: // QSTN
                            couty = (30-y-4)*50;
                            countx = this.area + Math.floor(Math.random()*originhillsize)+1;
                            qstn_.push(couty + countx);
                            break;
                    }
                }
            }

        }
        return {
            hill: hill_,
            ppe: ppe_,
            enemy: enemy_,
            qstn: qstn_
        }
    }
}

function generateRandomHills()
{
    let hillcords = [];
    let hillenemys = [];
    let hilppes = [];
    let hillqstens = [];
    let hillcount = Math.floor(Math.random()*8)+4;
    let area = 2;
    
    for (let j = 0; j < hillcount; j++) {
        
        let hillstartx = Math.floor(Math.random()*(46/hillcount))+1;
        let hillstarty = Math.floor(Math.random()*2);
        let hillsizex = Math.floor(Math.random()*6)+2;
        let hillsizey = Math.floor(Math.random()*4)+1;
        let hilldegredation = (Math.random() / 4) +0.75;
        area += hillstartx+1;

        tmphill = new NRML(area,hillstartx,hillstarty,hillsizex,hillsizey,hilldegredation);
        let hillobj = tmphill.decode();

        for (let index = 0; index < hillobj.hill.length; index++) {
            const cord = hillobj.hill[index];
            hillcords.push(cord);
        }

        for (let index = 0; index < hillobj.ppe.length; index++) {
            const cord = hillobj.ppe[index];
            hilppes.push(cord);
        }

        for (let index = 0; index < hillobj.enemy.length; index++) {
            const cord = hillobj.enemy[index];
            hillenemys.push(cord);
        }

        for (let index = 0; index < hillobj.qstn.length; index++) {
            const cord = hillobj.qstn[index];
            hillqstens.push(cord);
        }
    }
    return {
        hillkords: hillcords,
        hillenemy: hillenemys,
        hillppe: hilppes,
        hillqstn: hillqstens
    };
}



function generateRandomMap()
{
    let Save = "";
    let hilldesign = generateRandomHills();
    for(var index = 0; index < 1600; index++) 
    {
        if(index != 1549 && index != 1499 && index != 1548 && index != 1498 &&
            index != 1500 && index != 1501 && index != 1450 && index != 1451
            && index < 1550 && index % 100 != 49 && index % 100 != 99 && index % 100 != 48 && index % 100 != 98
            && index % 100 != 0 && index % 100 != 1
            ){
            if(hilldesign.hillkords.includes(index))
            {
                Save += "H";
            }
            else if(hilldesign.hillenemy.includes(index))
            {
                Save+= "E";
            }
            else if(hilldesign.hillqstn.includes(index))
            {
                Save += "W";
            }
            else if(hilldesign.hillppe.includes(index))
            {
                Save += "F";
            }
            else
            {
                Save += "#";
            }
        }else{
            Save += "#";
        }
    }
    
    loadGame(Save,false);
}