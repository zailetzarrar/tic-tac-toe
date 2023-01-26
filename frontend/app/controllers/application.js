import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import fetch from 'fetch';
export default class ApplicationComponent extends Controller {
  @tracked board = ['', '', '', '', '', '', '', '', ''];
  @tracked player = 'X';
  @tracked isWon = false;
  @tracked spaces = 0;
  @tracked history = this.getHistory();

  getHistory = async () => {
    const response = await fetch('http://localhost:3000/api/getHistory', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    this.history = data;
    return data;
  };

  createHistory = async (player) => {
    const response = await fetch('http://localhost:3000/api/createHistory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ player }),
    });
    await this.getHistory();
  };

  isDraw = () => this.spaces === 9;
  resetBoard = () => {
    this.board = ['', '', '', '', '', '', '', '', ''];
    this.isWon = false;
    this.player = 'X';
    this.spaces = 0;
  };
  changePlayer = () => {
    const whichPlayer = this.player === 'X' ? 'O' : 'X';
    this.player = whichPlayer;
  };
  cellClick = (event) => {
    if (this.isWon) return;
    const { target: cell } = event;
    if (cell.innerHTML) {
      alert('already occupied');
      return;
    }
    const index = cell.getAttribute('data-value');
    this.board.splice(index, 1, this.player);
    this.board = [...this.board];
    this.spaces += 1;
    if (this.spaces > 4 && this.winChecker(index, this.player)) {
      this.isWon = true;
      this.createHistory(this.player);
    } else if (this.isDraw()) {
      alert('Game Draw');
      this.resetBoard();
    } else this.changePlayer();
  };
  winChecker = (index, player) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    const isHorizontal = (row, player) => {
      let count = 0;
      let rowStart = row * 3;
      for (let i = 0; i < 3; i++) {
        count = this.board[rowStart + i] === player ? ++count : 0;
        if (count === 0) break;
      }
      return count === 3 ? true : false;
    };
    const isVertical = (col, player) => {
      let count = 0;
      for (let i = 0, j = 0; i < 3; i++, j += 2) {
        count = this.board[col + i + j] === player ? ++count : 0;
        if (count === 0) break;
      }
      return count === 3 ? true : false;
    };
    const isDiagonal = (col, player) => {
      let count = 0;
      let rowStart = 0;
      for (let i = 0, j = 0; i < 3; i++, j += 3) {
        count = this.board[rowStart + i + j] === player ? ++count : 0;
        if (count === 0) break;
      }
      if (count === 3) return true;
      count = 0;
      rowStart = 2;
      for (let i = 0, j = 0; i < 3; i++, j++) {
        count = this.board[rowStart + i + j] === player ? ++count : 0;
        if (count === 0) break;
      }
      return count === 3 ? true : false;
    };
    if (isHorizontal(row, player)) return true;
    else if (isVertical(col, player)) return true;
    else if (isDiagonal(col, player)) return true;
    else return false;
  };
}
