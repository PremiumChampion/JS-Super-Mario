"use strict";
function loadGame(SavedGame, GetSavedgame) {
    for (var j = 0; j < ppeIntervalls.length; j++) {
        clearInterval(ppeIntervalls[j]);
    }
    ppeIntervalls = [];
    var loadingPossible;
    do {
        loadingPossible = true;

        if (GetSavedgame === true) {
            SavedGame = document.getElementById("SavedGame").value;
            document.getElementById("SavedGame").value = "";
        }

        if (SavedGame.length === 3200) {
            mapdesign = [];
            mapdesignPPE = [];
            mapdesignNRML = [];
            mapdesignQSTN = [];
            enemydesign = [];
            enemys = [];
            filledSpaces = [];

            for (var index = 0; index < 3200; index++) {
                switch (SavedGame.charAt(index)) {
                    case "P":
                        mapdesign.push(index);
                        break;
                    case "H":
                        mapdesignNRML.push(index);
                        break;
                    case "W":
                        mapdesignQSTN.push(index);
                        break;
                    case "E":
                        enemydesign.push(index);
                        break;
                    case "F":
                        mapdesignPPE.push(index);
                        break;
                    case "#":
                        break;
                    default:
                        loadingPossible = false;
                        break;
                }
            }

            if (loadingPossible) {
                if (GetSavedgame) {
                    alert("Game loaded!");
                }

                ctx.clearRect(0, 0, 3200, 512);
                clearInterval(playerMovement);
                clearInterval(enemyMovement);
                clearInterval(bossFire);

                generateMap();
                document.getElementById("EDIT").innerHTML = "EDIT";
                break;
            } else {
                alert("The Game could not be loaded!");
            }
        } else {
            loadingPossible = false;
            alert("The Game could not be loaded!");
        }
        if (!loadingPossible) {
            SavedGame = emptyGame;
            GetSavedgame = false;
        }

    } while (!loadingPossible);
}

function saveGame() {
    var Save = "";

    for (var index = 0; index < 3200; index++) {
        Save += GetPlacedBlockTypeAt(index);
    }

    document.getElementById("SaveGame").innerHTML = Save;

    //leveldesign[leveldesign.length - 1] = Save;
    // leveldesign.push(emptyGame);
}

function CopyToClipbard() {
    saveGame();
    var el = document.createElement('textarea');
    el.value = document.getElementById("SaveGame").innerHTML;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    document.getElementById("SaveGame").innerHTML = "";
    alert("Game saved to clipboard.")
}


function GetPlacedBlockTypeAt(position) {
    if (mapdesign.includes(position)) {
        return "P";
    }
    if (mapdesignNRML.includes(position)) {
        return "H";
    }
    if (mapdesignQSTN.includes(position)) {
        return "W";
    }
    if (enemydesign.includes(position)) {
        return "E";
    }
    if (mapdesignPPE.includes(position)) {
        return "F";
    }
    return "#";
}

function developement() {
    let emptygame = "";
    for (let z = 0; z < 3200; z++) {
        emptygame += "#";

    }
    loadGame(emptygame, false);
    // alert('Development-Enviroment loaded!');
    document.getElementById("EDIT").innerHTML = "RESUME";
    clearInterval(playerMovement);
    clearInterval(bossFire);
    clearInterval(enemyMovement);
}

function SwitchLevels() {

    if (useLVL) {
        useLVL = false;
        document.getElementById("switch").innerHTML = "Use Predefined Level = FALSE"
    } else {
        useLVL = true;
        document.getElementById("switch").innerHTML = "Use Predefined Level = TRUE"
    }
}