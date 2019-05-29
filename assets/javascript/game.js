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

    reset: function() {
        this.state  = GAMESTATE.NONE;
        charPicked  = -1;
        enemyPicked = -1;
    }

};
// game object definition ends here.

// functions are defines here.

function screenReset() {
    var defTop = $("header").outerHeight() + YOFFSET;
    var spaceWidth = XOFFSET;
    var boxElem ;
    var boxWidth = $(".box1").outerWidth() + spaceWidth;
    var posX = spaceWidth;
    for(var i=0; i<characters.length; i++) {
        boxElem = $(".box"+(i+1));
        boxElem.css("background-color","white");
        boxElem.css("border-color","green");
        boxElem.css({top: defTop, left: posX}); 
        boxElem.attr("value",i);
        boxElem.show();
        posX += boxWidth;
        $("#img"+ (i+1)).attr("src", gImgPath+characters[i].imgfile); 
        $("#img"+ (i+1)).css("opacity", "1");
        characters[i].hp = characters[i].maxhp;
        $("#hp"+ (i+1)).text(characters[i].hp); 
    }
    game.reset();

    messageBoxReset();
}

function messageBoxReset() {
    var posY = YOFFSET + $("header").outerHeight() + $(".box1").outerHeight() + 30;
    var restartX = XOFFSET + $("#btn-attack").outerWidth() + 10;

    $("#btn-attack").css({top: posY, left: XOFFSET}); 
    $("#btn-restart").css({top: posY, left: restartX});

    posY += ($("#btn-attack").outerHeight() + 15);

    $("#message-box").css({top: posY, left: XOFFSET}); 

    $("#btn-attack").attr("disabled", true);
    $("#btn-restart").attr("disabled", true);

    $("#message1").text("Choose your character.");
    $("#message2").text("");
}

function screenSplitSide() {
    var startY  = $("header").outerHeight() + YOFFSET;
    var charX   = XOFFSET;
    var boxElem = $(".box1");
    var boxWidth = boxElem.outerWidth();
    var boxHeight = boxElem.outerHeight();
    var enemyX  = XOFFSET + (boxWidth * 4);
    var enemyY  = startY;

    var charId;

    game.numEnemies = 0;
    for (var i=1; i<=4; i++) {
        boxElem = $(".box" + i);
        charId = boxElem.attr("value");

        if (game.charPicked == charId) {
            boxElem.animate({ top: startY+"px", left: charX+"px" }, "normal");
        } else {
            boxElem.animate({ top: enemyY+"px", left: enemyX+"px" }, "normal");
            boxElem.css("background-color","darkred");
            boxElem.css("border-color","black");
            enemyY += (boxHeight + YOFFSET);
            game.numEnemies++;
        }
    }
}

function screenEnemyReady() {
    var startY  = $("header").outerHeight() + YOFFSET;
    var boxElem = $(".box1");
    var boxWidth = boxElem.outerWidth();
    var boxHeight = boxElem.outerHeight();
    var enemyFrontX  = XOFFSET + (boxWidth * 3) - 20;
    var enemyX  = XOFFSET + (boxWidth * 4);
    var enemyY  = startY;

    var charId;

    for (var i=1; i<=4; i++) {
        boxElem = $(".box" + i);
        charId = boxElem.attr("value");
        if (charId != game.charPicked) {
            if (charId == game.enemyPicked) {
                boxElem.animate({ top: startY, left: enemyFrontX+"px" }, "normal");
                boxElem.css("background-color","red");
                boxElem.css("border-color","green");
            } else {
                if ( $(boxElem).is(":visible") ) {
                    boxElem.animate({ top: enemyY+"px", left: enemyX+"px" }, "normal");
                    enemyY += (boxHeight + YOFFSET);
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
    enemy.hp -= yourchar.attack;
    if (enemy.hp <=0) {
        enemyDefeated();
        return;
    }
    yourchar.hp -= enemy.counter;
    $("#message1").text("You attack " + enemy.name + " for " + yourchar.attack + " damage.");
    $("#message2").text(enemy.name + " attack you back for " + enemy.counter + " damage.");
    updateHP(game.charPicked);
    updateHP(game.enemyPicked);
    if (yourchar.hp <= 0) {
        grayOutImage(game.charPicked);
        gameFinished(false);
    }
});

$("#btn-restart").on("click", function() {
    screenReset();
});

    // call once!
    screenReset();
