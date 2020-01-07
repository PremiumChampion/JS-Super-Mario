"use strict";
class NRML {
    constructor(area_, hillstartx_, hillstarty_, hillsizex_, hillsizey_, hilldegredation_, noenemy_) {
        this.area = area_;
        this.noenemy = noenemy_;
        this.hillstartx = hillstartx_;
        this.hillstarty = hillstarty_;
        this.hillsizex = hillsizex_;
        this.hillsizey = hillsizey_;
        this.hilldegredation = hilldegredation_;
        this.actioncount = Math.floor(Math.random() * 3) + 1;
    }

    decode() {
        var hill_ = [];
        var ppe_ = [];
        var enemy_ = [];
        var qstn_ = [];
        var originhillsize = this.hillsizex;
        for (var y = 0; y < this.hillsizey; y++) {

            for (var x = 0; x < this.hillsizex; x++) {
                var county = (30 - y) * 100;
                var countx = this.area + x;
                hill_.push(county + countx);
                if (this.hillsizey === 4 && y === 0 && x === 0) {
                    hill_.push(county + countx - 2);
                    hill_.push(county + countx - 1);
                    hill_.push(county - 101 + countx);
                }
            }
            this.hillsizex *= this.hilldegredation;

            if (y === this.hillsizey - 1) {
                for (var action = 0; action < this.actioncount; action++) {
                    var type = Math.floor(Math.random() * 3) + 1;
                    var countx = this.area + Math.floor(Math.random() * this.hillsizex - 2) + 1;
                    var couty = 0;
                    if (countx > 1) {
                        switch (type) {
                            case 1: // PPE
                                if (Math.round(Math.random() * 2) + 1 > 1) {
                                    couty = (29 - y) * 100;
                                    countx++;
                                    ppe_.push(couty + countx);
                                }
                                break;
                            case 2: // ENEMY
                                couty = (30 - y - 1) * 100;
                                if (this.noenemy != true) { enemy_.push(couty + countx); }
                                break;
                            case 3: // QSTN
                                if (Math.round(Math.random() * 2) + 1 > 1) {
                                    couty = (30 - y - 5) * 100;
                                    countx = this.area + Math.floor(Math.random() * originhillsize) + 1;
                                    if (!qstn_.includes(couty + countx - 1)) { qstn_.push(couty + countx); }
                                }
                                break;
                        }
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

function generateRandomHills() {
    var hillcords = [];
    var hillenemys = [];
    var hilppes = [];
    var hillqstens = [];
    var hillcount = Math.floor(Math.random() * 10) + 10;
    var area = 2;

    for (var j = 0; j < hillcount; j++) {

        var hillstartx = Math.floor(Math.random() * (96 / hillcount)) + 1;
        var hillstarty = Math.floor(Math.random() * 3);
        var hillsizex = Math.floor(Math.random() * 10) + 5;
        var hillsizey = Math.floor(Math.random() * 4) + 1;
        var hilldegredation = (Math.random() / 3) + (2 / 3);
        area += hillstartx + 2;

        var tmphill = new NRML(area, hillstartx, hillstarty, hillsizex, hillsizey, hilldegredation);
        var hillobj = tmphill.decode();

        for (var index = 0; index < hillobj.hill.length; index++) {
            const cord = hillobj.hill[index];
            hillcords.push(cord);
        }

        for (var index = 0; index < hillobj.ppe.length; index++) {
            const cord = hillobj.ppe[index];
            hilppes.push(cord);
        }

        for (var index = 0; index < hillobj.enemy.length; index++) {
            const cord = hillobj.enemy[index];
            hillenemys.push(cord);
        }

        for (var index = 0; index < hillobj.qstn.length; index++) {
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



function generateRandomMap() {
    var Save = "";
    var hilldesign = generateRandomHills();
    for (var index = 0; index < 3100; index++) {
        if (index < 3150 && index % 100 != 99 && index % 100 != 98 &&
            index % 100 != 0 && index % 100 != 1 && index % 100 != 2 && index % 100 != 97
        ) {
            if (hilldesign.hillkords.includes(index)) {
                Save += "H";
            } else if (hilldesign.hillenemy.includes(index)) {
                Save += "E";
            } else if (hilldesign.hillqstn.includes(index)) {
                Save += "W";
            } else if (hilldesign.hillppe.includes(index)) {
                Save += "F";
            } else {
                Save += "#";
            }
        } else {
            Save += "#";
        }
    }

    for (var z = 0; z < 100; z++) {
        Save += "#";

    }
    loadGame(Save, false);
}