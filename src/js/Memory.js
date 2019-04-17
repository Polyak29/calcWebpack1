import Display from './display';
import { memoryButtons } from './const';

class Memory {
  constructor() {
    this.display = new Display();
    this.localTempDisplay = 0;
    [
      ...document.getElementsByClassName('memory-calculator__operations--size')
    ].forEach(el => {
      el.addEventListener('click', this.workMemory);
    });
  }

  workMemory = ({ target }) => {
    let display = this.display.value;
    switch (target.value) {
      case memoryButtons.CLEAR:
        this.display.setMemory = '';
        
          [...document.getElementsByClassName('js_memory__disabled')].forEach(el => {
            el.classList.toggle('disabled');
          });
        break;

      case memoryButtons.READ:
        this.display.setValue = this.localTempDisplay;
        break;

      case memoryButtons.PLUS:
      console.log(display);
        this.display.setMemory = this.localTempDisplay + display;
        break;

      case memoryButtons.SUBSTRUCT:
        this.display.setMemory = this.localTempDisplay - display;
        break;

      case memoryButtons.SAVE:
        this.localTempDisplay = this.display.value;
        this.display.setMemory = this.localTempDisplay;
        [...document.getElementsByClassName('js_memory__disabled')].forEach(el => {
          el.classList.toggle('disabled');
        });
        break;
    }
  }
}

export default Memory;
