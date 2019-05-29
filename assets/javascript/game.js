// define constants

const XOFFSET = 20;
const YOFFSET = 10;

const GAMESTATE = {
    NONE: 0,
    CHAR_SELECTED: 1,
    ENEMY_SELECTED: 2,
    READY: 3
};

// define game object
var game = {
    state: -1,

    numEnemies: -1,
    charPicked: -1,
    enemyPicked: -1,

    charPower: -1, // current attack power

    reset: function() {
        this.state  = GAMESTATE.NONE;
        charPicked  = -1;
        enemyPicked = -1;
    }

};
// game object definition ends here.

// functions are defines here.
var charPosX, enemyPosX, enemyBackX;
var charPosY;

function initializeScreenOffset() {
    charPosX = XOFFSET;
    charPosY = $("header").outerHeight() + $("h3").outerHeight() + YOFFSET;

    var boxWidth    = $(".box1").outerWidth();
    var boxHeight   = $(".box1").outerHeight();

    enemyPosX   = charPosX + (boxWidth * 3) - 20;
    enemyBackX  = charPosX + (boxWidth * 4);

    $("#lb-char").css("left", charPosX);
    $("#lb-defender").css("left", enemyPosX);
    $("#lb-enemies").css("left", enemyBackX);
}

function screenReset() {
    var posX = charPosX;
    var posY = charPosY;
    var boxWidth = $(".box1").outerWidth() + XOFFSET;
    for(var i=0; i<characters.length; i++) {
        boxElem = $(".box"+(i+1));
        boxElem.css("background-color","white");
        boxElem.css("border-color","green");
        boxElem.css({top: posY, left: posX}); 
        boxElem.attr("value",i);
        boxElem.show();
        posX += boxWidth;
        $("#img"+ (i+1)).attr("src", gImgPath+characters[i].imgfile); 
        $("#img"+ (i+1)).css("opacity", "1");
        characters[i].hp = characters[i].maxhp;
        $("#hp"+ (i+1)).text(characters[i].hp); 
    }
    game.reset();

    $("h3").hide();

    messageBoxReset();
}

function messageBoxReset() {
    var posY     = charPosY + $(".box1").outerHeight() + 30;
    var restartX = charPosX + $("#btn-attack").outerWidth() + 10;

    $("#btn-attack").css({top: posY, left: charPosX}); 
    $("#btn-restart").css({top: posY, left: restartX});

    posY += ($("#btn-attack").outerHeight() + 15);

    $("#message-box").css({top: posY, left: charPosX}); 

    $("#btn-attack").attr("disabled", true);
    $("#btn-restart").attr("disabled", true);

    $("#message1").text("Choose your character.");
    $("#message2").text("");
}

function screenSplitSide() {
    var boxHeight = $(".box1").outerHeight();
    var enemyY  = charPosY;

    var charId;

    game.numEnemies = 0;
    for (var i=1; i<=4; i++) {
        boxElem = $(".box" + i);
        charId = boxElem.attr("value");

        if (game.charPicked == charId) {
            boxElem.animate({ top: charPosY+"px", left: charPosX+"px" }, "normal");
        } else {
            boxElem.animate({ top: enemyY+"px", left: enemyBackX+"px" }, "normal");
            boxElem.css("background-color","darkred");
            boxElem.css("border-color","black");
            enemyY += (boxHeight + 10);
            game.numEnemies++;
        }
    }

    $("h3").show();

}

function screenEnemyReady() {
    var boxHeight = $(".box1").outerHeight();
    var enemyY  = charPosY;
    var charId;

    for (var i=1; i<=4; i++) {
        boxElem = $(".box" + i);
        charId = boxElem.attr("value");
        if (charId != game.charPicked) {
            if (charId == game.enemyPicked) {
                boxElem.animate({ top: charPosY, left: enemyPosX+"px" }, "normal");
                boxElem.css("background-color","red");
                boxElem.css("border-color","green");
            } else {
                if ( $(boxElem).is(":visible") ) {
                    boxElem.animate({ top: enemyY+"px", left: enemyBackX+"px" }, "normal");
                    enemyY += (boxHeight + 10);
                }
            }
        }
    }
}

function readyToAttack() {
    $("#message1").text("Ready to attack!");
    $("#message2").text("");
    $("#btn-attack").attr("disabled", false);
} 

function getBoxId(id) {
    for( var i=1; i<=4; i++) {
        if ( id == $(".box" + i).attr("value") ) {
            return i;
        }
    }
    return -1;
}

function updateHP(id) {
    var boxId = getBoxId(id);
    if (boxId<0) {
        return;
    }

    $("#hp"+ boxId).text(characters[id].hp);
}

function grayOutImage(id) {
    var boxId = getBoxId(id);
    if (boxId<0) {
        return;
    }
    $("#img"+ boxId).css("opacity", "0.3");
    $(".box"+ boxId).css("background-color","gray");
}

function gameFinished(youwin) {
    if (youwin) {
        $("#message1").text("You won! CONGRATULATION!!!");
    } else {
        $("#message1").text("You have been defeated! GAME OVER!!!");
    }
    $("#message2").text("press RESTART to play again!");
    $("#btn-attack").attr("disabled", true);
    $("#btn-restart").attr("disabled", false);
}

function enemyDefeated() {

    $("#message1").text("You have defeated " + characters[game.enemyPicked].name + "!");
    $("#message2").text("Please choose another enemy!");

    var boxId = getBoxId(game.enemyPicked);
    if (boxId<0) {
        return;
    }
    $(".box"+ boxId).hide();

    game.numEnemies--;
    if (game.numEnemies <=0) {
        gameFinished(true);
        return;
    }

    game.enemyPicked = -1;
    game.state = GAMESTATE.CHAR_SELECTED;
}

//***************  BUTTON CLICK functions  ********************/
$(".char-box").on("click", function() {
    var charId = parseInt($(this).attr("value"));
    console.log(characters[charId]);

    switch (game.state) {
        case GAMESTATE.NONE:
            game.charPicked = charId;
            game.charPower  = characters[charId].attack;
            game.state      = GAMESTATE.CHAR_SELECTED;
            screenSplitSide();
            $("#message1").text("Choose your enemy!");
            $("#message2").text("");
            break;
        case GAMESTATE.CHAR_SELECTED:
            if (game.charPicked == charId) {
                console.log("cant pick hero!");
                break;
            }
            game.enemyPicked    = charId;
            game.state          = GAMESTATE.READY;
            screenEnemyReady();
            readyToAttack();
            break;
        default:
            break;
    }
});


$("#btn-attack").on("click", function() {

    if (game.enemyPicked < 0) {
        $("#message1").text("No enemy here!");
        $("#message2").text("Please choose another enemy!");
        return;
    }

    var yourchar = characters[game.charPicked];
    var enemy = characters[game.enemyPicked];
    // enemy.hp -= yourchar.attack;
    enemy.hp -= game.charPower;
    if (enemy.hp <=0) {
        enemyDefeated();
        return;
    }
    yourchar.hp -= enemy.counter;
    // $("#message1").text("You attack " + enemy.name + " for " + yourchar.attack + " damage.");
    $("#message1").text("You attack " + enemy.name + " for " + game.charPower + " damage.");
    $("#message2").text(enemy.name + " attack you back for " + enemy.counter + " damage.");
    updateHP(game.charPicked);
    updateHP(game.enemyPicked);
    game.charPower += yourchar.attack;
    if (yourchar.hp <= 0) {
        grayOutImage(game.charPicked);
        gameFinished(false);
    }
});

$("#btn-restart").on("click", function() {
    screenReset();
});

// start calling functions here.
    initializeScreenOffset();
    screenReset();
