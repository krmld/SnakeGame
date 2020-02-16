import {colors} from "./colors.js";

export class Snake {
  
  constructor(game) {
    this.game = game;
    this.size = null;           // Width of the snake
    this.lives = 3;
    this.velocity = null;
    this.color = colors.snakeEnabled;
    this.direction = 'left';
    this.x = null;
    this.y = null;
    this.sections = [];         // Array of coordinates of circles building the snake
  }
  
  init(lives, velocity) {
    this.canvas = this.game.canvas;
    this.size = Math.floor(this.canvas.width * this.canvas.height / 12000);
    this.lives = lives;
    this.velocity = (velocity != null ? velocity : this.size * 8);
    this.direction = 'left';
    this.x = this.canvas.width / 2;
    this.y = this.canvas.height / 2;
    this.sections = [];
    for (let i = 15; i >= 0; i--) {
      this.sections.push([this.x + Math.floor(this.velocity / this.game.fps) * i, this.y]);
    }
    
    updateLives(this.lives)
  }
  
  move() {
    switch (this.direction) {
      case 'up':
        this.y -= this.velocity / this.game.fps;
        break;
      case 'down':
        this.y += this.velocity / this.game.fps;
        break;
      case 'left':
        this.x -= this.velocity / this.game.fps;
        break;
      case 'right':
        this.x += this.velocity / this.game.fps;
        break;
    }
    this.sections.push([this.x, this.y]);
    this.sections.shift();
    this.checkCollision();
    this.checkGrowth();
  }
  
  draw() {
    for (let i = 0; i < this.sections.length; i++) {
      this.drawSection(this.sections[i]);
    }
  }
  
  drawSection(section) {
    this.game.drawCell(section[0], section[1], this.size, this.color);
  }
  
  resetPosition() {
    if (this.x > this.canvas.width / 2) {
      this.x -= this.velocity / this.game.fps;
    } else if (this.x < (this.canvas.width / 2 - this.velocity / this.game.fps)) {
      this.x += this.velocity / this.game.fps;
    } else if (this.y > this.canvas.height / 2) {
      this.y -= this.velocity / this.game.fps;
    } else if (this.y < (this.canvas.height / 2 - this.velocity / this.game.fps)) {
      this.y += this.velocity / this.game.fps;
    } else {
      this.color = colors.snakeEnabled;
      return 0;
    }
    
    this.sections.push([this.x, this.y]);
    this.sections.shift();
  }
  
  checkCollision() {
    if (this.isCollision(this.x, this.y) === true) {
      this.color = colors.snakeDisabled;
      if (--this.lives) {
        this.game.resuming = true;
      } else {
        this.game.stop();
      }
      updateLives(this.lives);
    }
  }
  
  isCollision(x, y) {
    if (x < this.size / 2 ||
      y < this.size / 2 ||
      x > this.canvas.width - this.size / 2 ||
      y > this.canvas.height - this.size / 2) {
      return true;
    }
  }
  
  checkGrowth() {
    const food = this.game.food;
    if (this.x < food.x + this.size * 3 / 4 &&
      this.x > food.x - this.size * 3 / 4 &&
      this.y > food.y - this.size * 3 / 4 &&
      this.y < food.y + this.size * 3 / 4) {
      this.game.score += 30;
      if (this.game.score % 50 === 0) {
        this.game.level++;
        if (this.game.level < 11) this.velocity *= 1.1;
      }
      food.set();
      this.sections.push([this.x, this.y]);
    }
  }
}

function updateLives(lives) {
  const hearts = $('#lives .glyphicon');
  hearts.each((i, elem) => {
    const el = $(elem);
    if (i < lives) {
      el.removeClass('glyphicon-heart-empty');
      el.addClass('glyphicon-heart');
    } else {
      el.removeClass('glyphicon-heart');
      el.addClass('glyphicon-heart-empty');
    }
  });
}
