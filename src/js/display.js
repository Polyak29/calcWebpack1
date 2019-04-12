class Display {
  constructor() {
    this.display = document.querySelector('.calculator__display-input--size');
    this.archive = document.querySelector('.calculator__display-input--shadow');
    this.memory = document.querySelector('.calculator__display-input--memory');
    this.hidden = document.querySelector('.calculator__display-input--hidden');
    this.hidden2 = document.querySelector('.calculator__display-input--hidden2');
  }
  pressButtons = () => {
    this.display = this.number;
  };
}

export default Display;
