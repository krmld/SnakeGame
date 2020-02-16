import {Snake} from "./snake.js";
import {Food} from "./food.js";
import {getControlKey, inverseDirection} from "./keys.js";
import {colors} from "./colors.js";

export class Game {
  
  constructor() {
    this.snake = new Snake(this);
    this.food = new Food(this);
    
    this.score = 0;               // Score of the play
    this.level = 0;               // Level of the play
    this.fps = 60;                // TODO = current version works with fixed Frames Per Second; modify it to be actual FPS
    this.over = true;             // Game over flag
    this.paused = false;          // Pause flag
    this.countDown = 0;           // CountDown timer for gentle beggining of the game
    this.resuming = false;        // Flag set when snake lost life and beggining with new life
    this.message = 'START THE GAME'; // Message to print on canvas
  }
  
  init() {
    this.canvas = document.getElementById("gameWindow");
    this.context = this.canvas.getContext("2d");
    this.context.canvas.width = Math.floor(window.innerWidth) - 30;
    this.context.canvas.height = Math.floor(window.innerHeight * 0.9) - 30;
    
    addEventListener("keydown", (e) => {
      const lastKey = getControlKey(e.keyCode);
      const snake = this.snake;
      if (['up', 'down', 'left', 'right'].indexOf(lastKey) >= 0
        && lastKey !== inverseDirection[snake.direction]) {
        snake.direction = lastKey;
      } else if ('start_stop' === lastKey && this.over) {
        this.start();
      } else if ('start_stop' === lastKey && this.paused) {
        this.paused = false;
        this.message = null;
      } else if ('start_stop' === lastKey && !(this.paused || this.over)) {
        this.pause();
      }
    }, false);
  }
  
  start() {
    this.over = false;
    this.paused = false;
    this.level = 1;
    this.countDown = 0;
    this.resuming = true;
    this.message = null;
    this.score = 0;
    this.snake.init(3, null);
    this.food.set();
  }
  
  stop() {
    this.over = true;
    this.message = 'GAME OVER';
    this.checkScore();
  }
  
  pause() {
    this.message = 'PAUSED';
    this.paused = true;
  }
  
  drawCell(x, y, size, color) {
    this.context.fillStyle = color;
    this.context.beginPath();
    this.context.arc(x, y, (size / 2), 0, 6.28); // 6.28 = 2 * Math.PI
    this.context.closePath();
    this.context.fill();
  }
  
  updateScore() {
    $('#score')
      .text(this.score);
    
    $('#level')
      .text(this.level);
  }
  
  drawCount(now) {
    if (this.countDown === 0) {
      this.countDown = now + 3000;
    } else {
      this.context.fillStyle = colors.counter;
      this.context.font = (this.canvas.height) + 'px Arial, sans-serif';
      this.context.textAlign = 'center';
      this.context.fillText(Math.ceil((this.countDown - now) / 1000)
                                .toString(),
        this.canvas.width / 2,
        this.canvas.height * 0.9);
      if (this.countDown - now < 100) {
        this.countDown = 0;
        this.resuming = false;
      }
    }
  }
  
  drawMessage() {
    if (this.message !== null) {
      this.context.fillStyle = colors.text;
      this.context.font = (this.canvas.height / 10) + 'px Arial, sans-serif';
      this.context.textAlign = 'center';
      this.context.fillText(this.message, this.canvas.width / 2, this.canvas.height / 2);
    }
  }
  
  resetCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  checkScore() {
    let max = 0;
    let val = 0;
    for (let i = 0; i < localStorage.length; i++) {
      val = parseInt(localStorage.getItem(localStorage.key(i)));
      if (max < val) max = val;
    }
    
    if (this.score > max) {
      const hs = $('#highScore');
      
      hs.find('#newScore')
        .text(this.score);
      hs.modal('show');
    }
  }
}

