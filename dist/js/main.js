import {Game} from "./game.js";

const requestAnimationFrame = window.requestAnimationFrame;
const game = new Game();

function loop(now) {
  game.drawMessage();
  game.updateScore();
  
  if (!game.over && !game.paused) {
    game.resetCanvas();
    
    if (game.resuming) {
      game.drawCount(now);
      game.snake.resetPosition();
    } else {
      game.snake.move();
    }
    
    game.food.draw();
    game.snake.draw();
  }
  
  requestAnimationFrame(loop);
}

window.onload = function () {
  game.init();
  loop();
};

$(function () {
  // After help modal is closed, focus remains on its caller button
  // and pressing spacebar reopens modal and starts the game
  // following code is to fix that condition
  $('#helpBtn')
    .on('focus', function (e) {
      e.target.blur();
    });
  
  $('#highScore')
    .on('shown.bs.modal', function () {
      $('#name')
        .focus();
    });
  
  $("#name")
    .keyup(function (e) {
      if (e.keyCode == 13) {
        $("#saveHigh")
          .click();
      }
    });
  
  $('#saveHigh')
    .on('click', function () {
      let name = $('#name');
      let user = name.val()
                     .trim();
      
      let score = $('#newScore')
        .text();
      
      if (user.match("^[a-zA-Z0-9]*$") && user !== '') {
        localStorage.setItem(user, score);
        $('#highScore')
          .modal('hide');
      } else {
        name.val('');
        name.prop('required', true);
        name.attr('placeholder', 'Enter valid name');
        name.focus();
      }
    });
  
  $('#bestBtn')
    .on('click', function () {
      let key, val;
      let arr = [];
      let list = $('#scoreList');
      list.text('');
      for (let i = 0; i < localStorage.length; i++) {
        key = localStorage.key(i);
        val = parseInt(localStorage.getItem(localStorage.key(i)));
        arr.push([key, val]);
      }
      
      arr.sort(function (a, b) {
        return b[1] - a[1];
      });
      
      for (let i = 0; i < arr.length; i++) {
        list.append('<p>' + arr[i][0] + ' - ' + arr[i][1] + '</p>');
      }
      
      $('#scoreModal')
        .modal('show');
      
    })
});

