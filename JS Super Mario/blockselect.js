"use strict";
var blcktyp = "BDN";

function setBlock(type) {
    switch (type) {
        case "BDN":
            blcktyp = "BDN";
            break;
        case "PPE":
            blcktyp = "PPE";
            break;
        case "NRML":
            blcktyp = "NRML";
            break;
        case "QSTN":
            blcktyp = "QSTN";
            break;
        case "ENEMY":
            blcktyp = "ENEMY";
            break;
    }
}


function edit() {
    if (document.getElementById("EDIT").innerHTML === "EDIT") {
        clearInterval(playerMovement);
        clearInterval(enemyMovement);
        clearInterval(bossFire);

    }
    else {
        enemyMovement = setInterval(function () { moveEnemys() }, 40);
        playerMovement = setInterval(function () { movePlayer() }, 10);
    }
    document.getElementById("EDIT").innerHTML = document.getElementById("EDIT").innerHTML === "EDIT" ? "RESUME" : "EDIT";

}


