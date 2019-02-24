var game = {};
var blocksNum = 6;
game.map = {};

game.players = {};
game.players.active = 1;

game.generateMap = function() {
  var board = $("#board");
  board.html("");
  //Generate The Board
  for (var i = 1; i <= 10; i++) {
    var box = $('<div class="row"></div>');
    board.append(box);
    for (var y = 1; y <= 10; y++) {
      var square = $(
        `<div class="square" data-x=${y} data-y=${i} type="" weapon=""></div>`
      );
      box.append(square);
    }
  }

  //Generate The Blocks
  for (var i = 0; i < blocksNum; i++) {
    var x = Math.ceil(Math.random() * 10);
    var y = Math.ceil(Math.random() * 10);

    var block = $(`.square[data-x=${x}][data-y= ${y}]`);

    if (block.attr("type") === "") {
      block.attr("type", "block");
      block.addClass("block");
    } else {
      i--;
    }
  }
};

// Weapons
game.weapons = {
  weapon0: {
    name: "white",
    damage: 10,
    itemClass: "white"
  },
  weapon1: {
    name: "Blue",
    damage: 20,
    itemClass: "blue"
  },
  weapon2: {
    name: "Choco",
    damage: 25,
    itemClass: "choco"
  },
  weapon3: {
    name: "Pink",
    damage: 35,
    itemClass: "pink"
  },
  weapon4: {
    name: "Orange",
    damage: 45,
    itemClass: "orange"
  }
};

game.weapons.generateWeapons = function() {
  for (var i = 1; i < 5; i++) {
    var x = Math.ceil(Math.random() * 10);
    var y = Math.ceil(Math.random() * 10);
    var weapon = $(`.square[data-x=${x}][data-y= ${y}]`);
    if (weapon.attr("type") === "") {
      weapon.attr({
        type: "weapon",
        weapon: "weapon" + i
      });
      weapon.addClass(game.weapons["weapon" + i].itemClass);
    } else {
      i--;
    }
  }
};

// Calc Move
game.calcMove = function() {
  var player = game.players.active;
  var x = parseInt(game.players[player].coordX);
  var y = parseInt(game.players[player].coordY);

  CalcMoveFun("plusX");
  CalcMoveFun("minusX");
  CalcMoveFun("plusY");
  CalcMoveFun("minusY");

  function CalcMoveFun(op) {
    for (var i = 1; i < 4; i++) {
      if (op === "plusX") {
        var el = $(`.square[data-x=${x + i}][data-y=${y}]`);
      } else if (op === "minusX") {
        var el = $(`.square[data-x=${x - i}][data-y=${y}]`);
      } else if (op === "plusY") {
        var el = $(`.square[data-x=${x}][data-y=${y + i}]`);
      } else if (op === "minusY") {
        var el = $(`.square[data-x=${x}][data-y=${y - i}]`);
      }

      if (el) {
        if (el.attr("type") === "block" || el.attr("type") === "player") {
          break;
        } else if (el.attr("type") === "" || el.attr("type") === "weapon") {
          if (el.attr("type") === "") {
            el.attr("type", "move");
          } else if (el.attr("type") === "weapon") {
            el.attr("type", "move+weapon");
          }
          el.addClass("move" + player);
          el.on("click", game.clickMove);
        }
      }
    }
  }

  //check if the other player next
  var el1 = $(`.square[data-x=${x}][data-y=${y - 1}]`);
  var el2 = $(`.square[data-x=${x}][data-y=${y + 1}]`);
  var el3 = $(`.square[data-x=${x - 1}][data-y=${y}]`);
  var el4 = $(`.square[data-x=${x + 1}][data-y=${y}]`);

  checkOtherNext(el1);
  checkOtherNext(el2);
  checkOtherNext(el3);
  checkOtherNext(el4);

  function checkOtherNext(el) {
    if (el) {
      if (el.attr("type") === "player") {
        game.players.fight = true;
      }
    }
  }

  //Attack and Defind Buttons
  var buttontAttack = document.getElementById("attack");
  var buttontDefend = document.getElementById("defend");

  if (game.players.fight === true) {
    buttontAttack.disabled = false;
    buttontAttack.style.opacity = 1;
    buttontDefend.disabled = false;
    buttontDefend.style.opacity = 1;
  } else {
    buttontAttack.disabled = true;
    buttontAttack.style.opacity = 0.4;
    buttontDefend.disabled = true;
    buttontDefend.style.opacity = 0.4;
  }
};

//move click
game.clickMove = function(e) {
  if (game.players.fight === true) {
    game.deleteMove();
    alert("You cant escape");
  } else {
    game.deleteMove();
    game.players.playersMove(e);
  }
};

// Delete move
game.deleteMove = function() {
  var player = game.players.active;
  var x = parseInt(game.players[player].coordX);
  var y = parseInt(game.players[player].coordY);

  deleteFun("plusX");
  deleteFun("minusX");
  deleteFun("plusY");
  deleteFun("minusY");

  function deleteFun(op) {
    for (var i = 1; i < 4; i++) {
      if (op === "plusX") {
        var el = $(`.square[data-x=${x + i}][data-y=${y}]`);
      } else if (op === "minusX") {
        var el = $(`.square[data-x=${x - i}][data-y=${y}]`);
      } else if (op === "plusY") {
        var el = $(`.square[data-x=${x}][data-y=${y + i}]`);
      } else if (op === "minusY") {
        var el = $(`.square[data-x=${x}][data-y=${y - i}]`);
      }

      if (el) {
        if (el.attr("type") === "move") {
          el.attr("type", "");
          el.removeClass("move" + player);
          el.off("click", game.clickMove);
        } else if (el.attr("type") === "move+weapon") {
          el.attr("type", "weapon");
          el.removeClass("move" + player);
          el.off("click", game.clickMove);
        }
      }
    }
  }
};

// Players
game.players.generatePlayers = function() {
  game.players[1] = {
    name: "Player1",
    life: 100,
    coordX: 0,
    coordY: 0,
    weapon: "weapon0",
    action: "",
    itemClass: "player1"
  };

  game.players[2] = {
    name: "Player2",
    life: 100,
    coordX: 0,
    coordY: 0,
    weapon: "weapon0",
    action: "",
    itemClass: "player2"
  };

  for (var i = 1; i < 3; i++) {
    var x = parseInt(Math.ceil(Math.random() * 10));
    var y = parseInt(Math.ceil(Math.random() * 10));
    game.players[i].coordX = x;
    game.players[i].coordY = y;

    var el1 = $(`.square[data-x=${x}][data-y=${y}]`);
    var isNew = false;

    for (var j = -1; j < 2; j++) {
      for (var k = -1; k < 2; k++) {
        var el2 = $(`.square[data-x=${x - j}][data-y= ${y - k}]`);
        if (el2) {
          if (el2.attr("type") === "player") {
            isNew = true;
          }
        }
      }
    }

    if (el1.attr("type") !== "" || el1.attr("type") === "weapon") {
      i--;
    } else if (isNew) {
      i--;
    } else {
      el1.attr("type", "player");
      el1.addClass(game.players[i].itemClass);
    }
  }

  var infos1Weapon = document.getElementById("weapon1");
  var infos1Life = document.getElementById("life1");

  var infos2Weapon = document.getElementById("weapon2");
  var infos2Life = document.getElementById("life2");

  infos1Weapon.innerHTML =
    "Weapon : " +
    game.weapons[game.players[1].weapon].name +
    " (+" +
    game.weapons[game.players[1].weapon].damage +
    ")";
  infos1Life.innerHTML = "Health : " + game.players[1].life;

  infos2Weapon.innerHTML =
    "Weapon : " +
    game.weapons[game.players[2].weapon].name +
    " (+" +
    game.weapons[game.players[2].weapon].damage +
    ")";
  infos2Life.innerHTML = "Health : " + game.players[2].life;
};

// Players Move
game.players.playersMove = function(e) {
  var player = game.players.active;

  // Start
  var startX = parseInt(game.players[player].coordX);
  var startY = parseInt(game.players[player].coordY);
  var startBox = $(`.square[data-x=${startX}][data-y=${startY}]`);

  //End
  var finalX = parseInt($(event.target).attr("data-x"));
  var finalY = parseInt($(event.target).attr("data-y"));
  var finalBox = $(`.square[data-x=${finalX}][data-y=${finalY}]`);

  var moveX = finalX - startX;
  var moveY = finalY - startY;
  var moveXboxes = $(`.square[data-x="${startX}"]`);
  var moveYboxes = $(`.square[data-y="${startY}"]`);

  if (moveX > 0) {
    for (var i = 0; i < moveX; i++) {
      if ($(moveYboxes[finalX - 1 - i]).attr("type") === "weapon") {
        game.players.changeWeapon(moveYboxes, finalX - 1 - i);
      }
    }
  } else if (moveX < 0) {
    for (var i = 0; i < -moveX; i++) {
      if ($(moveYboxes[finalX - 1 + i]).attr("type") === "weapon") {
        game.players.changeWeapon(moveYboxes, finalX - 1 + i);
      }
    }
  } else if (moveY > 0) {
    for (var i = 0; i < moveY; i++) {
      if ($(moveXboxes[finalY - 1 - i]).attr("type") === "weapon") {
        game.players.changeWeapon(moveXboxes, finalY - 1 - i);
      }
    }
  } else if (moveY < 0) {
    for (var i = 0; i < -moveY; i++) {
      if ($(moveXboxes[finalY - 1 + i]).attr("type") === "weapon") {
        game.players.changeWeapon(moveXboxes, finalY - 1 + i);
      }
    }
  }

  if (startBox && finalBox) {
    if (finalBox.attr("type") === "weapon") {
      finalBox.attr("type", "player+weapon");
      finalBox.removeClass(game.weapons[finalBox.attr("weapon")].itemClass);
      finalBox.addClass(game.players[player].itemClass);
    } else {
      finalBox.attr("type", "player");
      finalBox.addClass(game.players[player].itemClass);
    }

    if (startBox.attr("type") === "player+weapon") {
      startBox.attr("type", "weapon");
      startBox.removeClass(game.players[player].itemClass);
      startBox.addClass(game.weapons[startBox.attr("weapon")].itemClass);
    } else {
      startBox.attr("type", "");
      startBox.removeClass(game.players[player].itemClass);
    }

    game.players[player].coordX = finalX;
    game.players[player].coordY = finalY;
  }

  game.nextPlayer();
  game.update();
};

// info
game.players.info = function() {
  if (game.players[1].life <= 0) {
    alert("Player 2 Win");
    game.new();
  }

  if (game.players[2].life <= 0) {
    alert("Player 1 Win");
    game.new();
  }

  var el1 = (document.getElementById("player1").style.opacity = 0.4);
  var el2 = (document.getElementById("player2").style.opacity = 0.4);
  document.getElementById("player" + game.players.active).style.opacity = 1;
};

//Change Wapons
game.players.changeWeapon = function(el, nb) {
  var change = el[nb].getAttribute("weapon");

  el[nb].classList.remove(
    game.weapons[el[nb].getAttribute("weapon")].itemClass
  );
  el[nb].classList.add(
    game.weapons[game.players[game.players.active].weapon].itemClass
  );

  el[nb].setAttribute("weapon", game.players[game.players.active].weapon);
  el[nb].setAttribute("type", "weapon");

  game.players[game.players.active].weapon = change;

  //on met a jour le champ Weapon du joueur
  var infosWeapon = document.getElementById("weapon" + game.players.active);
  infosWeapon.innerHTML =
    "Weapon : " +
    game.weapons[game.players[game.players.active].weapon].name +
    " (+" +
    game.weapons[game.players[game.players.active].weapon].damage +
    ")";
};

//Attack
game.players.attack = function() {
  var active = game.players.active;
  var anotherPlayer = game.players.active === 1 ? 2 : 1;

  game.players[active].action = "attack";

  var damage = game.weapons[game.players[active].weapon].damage;
  var life = game.players[anotherPlayer].life;

  if (game.players[anotherPlayer].action === "defend") {
    damage /= 2;
    life -= damage;
    game.players[anotherPlayer].life = life;
    var elLife = document.getElementById("life" + anotherPlayer);
    elLife.innerHTML = "Health : " + life;
  } else {
    life -= damage;
    game.players[anotherPlayer].life = life;
    var elLife = document.getElementById("life" + anotherPlayer);
    elLife.innerHTML = "Health : " + life;
  }

  game.deleteMove();
  game.nextPlayer();
  game.update();
};

game.nextPlayer = function() {
  game.players.active = game.players.active === 1 ? 2 : 1;
};

game.players.defend = function() {
  game.players[game.players.active].action = "defend";
  game.deleteMove();
  game.nextPlayer();
  game.update();
};

//Game New
game.new = function() {
  game.players.fight = false;
  game.generateMap();
  game.weapons.generateWeapons();
  game.players.generatePlayers();
  game.update();
};

//Update
game.update = function() {
  game.players.info();
  game.calcMove();
};

game.new();