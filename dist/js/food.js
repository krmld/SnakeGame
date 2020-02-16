import {colors} from "./colors.js";

export class Food {
  
  constructor(game) {
    this.game = game;
  }
  
  set() {
    const canvas = this.game.canvas;
    this.size = this.game.snake.size;
    this.x = (Math.ceil(Math.random() * (canvas.width - this.size))) + this.size / 2;
    this.y = (Math.ceil(Math.random() * (canvas.height - this.size))) + this.size / 2;
  }
  
  draw() {
    this.game.drawCell(this.x, this.y, this.size, colors.food);
  }
}
