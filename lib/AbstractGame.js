'use strict';

const Config = require('./Config');
const Timer = require('./Timer');
const Utils = require('./Utils');
const Cell = require('./Cell');

class AbstractGame {
  constructor() {
    this.players = new Map();
    this.timer = new Timer(Config.timerFrequency);
    this.eventsFired = [];
    this.cells = [];
    this.time = 0;
  }

  update(delta) {
    this.time += (delta / 1000);

    for (const player of this.players.values()) {
        player.update(delta);
    }
  }

  getPlayerById(playerId) {
    return this.players.get(playerId);
  }

  getPlayers() {
    return this.players.values();
  }

  getTime() {
    return this.time;
  }

  setTime(value) {
    this.time.setTime(value);
  }

  addPlayer (player) {
    this.players.set(player.getId(), player);

    console.log('Players #' + this.players.size);
    for (const player of this.players.values()) {
      console.log(player.getName());
    }
  }

  removePlayer (playerId) {
    const player = this.players.get(playerId);

    this.players.delete(playerId);

    console.log('Players #' + this.players.size);
    for (const player of this.players.values()) {
      console.log(player.getName());
    }
  }

  clearPlayers () {
    this.players.clear();
  }

  getStateForPlayer(player) {
    return {
      serverTime: this.getTime(),
      ownPlayer: player.toJSON(),
      players: Array.from(this.players.values()).filter(otherPlayer => {
          return otherPlayer !== player;
      }).map(player => player.toJSON()),
      events: this.eventsFired.filter((event) => {
          return event.getFiredBy() !== player;
      }).map((event) => event.toJSON())
    };
  }

  clearEvents() {
    this.eventsFired = [];
  }

  generateFood(number) {
    if (typeof number === 'undefined') {
      number = 1;
    }

    for (let i = 0; i < number; i++) {
      const randomPosition = Utils.generateRandomPosition();
      const cell = new Cell(randomPosition.x, randomPosition.y);

      this.cells.push(cell);
    }
  }

  checkFoodCollision() {
    for (let i = 0; i < this.cells.length; i++) {
      if (this.player.x === this.cells[i].x && this.player.y === this.cells[i].y) {
        this.cells.splice(i, 1);

        return true;
      }
    }

    return false;
  }

}

module.exports = AbstractGame;