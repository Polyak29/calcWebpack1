import { memoryButtons } from './const';

class Memory {
  constructor( events = {
    getDisplayValue: ()  => {},
    setValue: () => {}
  }) {
    this.localTempDisplay = 0;
    this.events = events;
   
  }

  init(selector) {
    this.selector = selector;
    [
      ...selector.getElementsByClassName('memory-calculator__operations--size')
    ].forEach(el => {
      el.addEventListener('click', this.workMemory);
    });
  }

  workMemory = ({ target }) => {
    let display = this.events.getDisplayValue();
    switch (target.value) {
      case memoryButtons.CLEAR:
        this.events.setValue('memory', '');
        
          [...this.selector.getElementsByClassName('js_memory__disabled')].forEach(el => {
            el.classList.add('disabled');
          });
        break;

      case memoryButtons.READ:
        this.events.setValue('value', this.localTempDisplay);
        break;

      case memoryButtons.PLUS:
        this.events.setValue('memory', this.localTempDisplay + display);
        [...this.selector.getElementsByClassName('js_memory__disabled')].forEach(el => {
          el.classList.remove('disabled');
        });
        break;

      case memoryButtons.SUBSTRUCT:
      this.events.setValue('memory', this.localTempDisplay - display);
      [...this.selector.getElementsByClassName('js_memory__disabled')].forEach(el => {
        el.classList.remove('disabled');
      });
        break;

      case memoryButtons.SAVE:
      this.localTempDisplay = this.events.getDisplayValue();
      this.events.setValue('memory', this.localTempDisplay);
      [...this.selector.getElementsByClassName('js_memory__disabled')].forEach(el => {
        el.classList.remove('disabled');
      });
        break;
    }
  }

  

  get template() {
    return `
    <div class="calculator__memory memory-calculator">
      <div class="memory-calculator__operations">
        <button class="memory-calculator__operations--size disabled disabled js_memory__disabled" value="MC">MC</button>
      </div>
      <div class="memory-calculator__operations">
        <button class="memory-calculator__operations--size disabled js_memory__disabled" value="MR">MR</button>
      </div>
      <div class="memory-calculator__operations">
        <button class="memory-calculator__operations--size js_memory__enebled" value="M+">M+</button>
      </div>
      <div class="memory-calculator__operations">
        <button class="memory-calculator__operations--size js_memory__enebled" value="M-">M-</button>
      </div>
      <div class="memory-calculator__operations">
        <button class="memory-calculator__operations--size js_memory__enebled" value="MS">MS</button>
      </div>
      <div class="memory-calculator__operations">
        <button class="memory-calculator__operations--size disabled js_memory__disabled" value="M">M</button>
      </div>
    </div>
    `;
  }
}

export default Memory;
