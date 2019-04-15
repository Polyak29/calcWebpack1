import Display from './display';
import { memoryButtons } from './const';

class Memory {
  constructor() {
    this.display = new Display(this.display);
    [
      ...document.getElementsByClassName('memory-calculator__operations--size')
    ].forEach(el => {
      el.addEventListener('click', this.workMemory);
    });
  }

  workMemory = ({ target }) => {
    switch (target.value) {
      case 'MC':
        this.display.setMemoryValue('');
        break;

      case 'MR':
        this.display.setDisplayValue(this.display.getMemoryValue());
        break;

      case 'M+':
        this.display.setMemoryValue(this.display.getMemoryValue() + this.display.getDisplayValue());
        break;

      case 'M-':
        this.display.setMemoryValue(this.display.getMemoryValue() - this.display.getDisplayValue());
        break;

      case memoryButtons.MEMORY_SAVE:
        this.display.setMemoryValue(this.display.getDisplayValue());
        break;

      case 'M':
        break;
    }
  };
}

export default Memory;
