import { memoryButtons } from './const';

class Memory {
  constructor( events = {
    getDisplayValue: ()  => {},
    setValue: () => {}
  }) {
    this.localTempDisplay = 0;
    this.events = events;
    this.valuesMemory = [];
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
        
          [...this.selector.getElementsByClassName('js-memory__disabled')].forEach(el => {
            el.classList.add('disabled');
          });
        break;

      case memoryButtons.READ:
        this.events.setValue('value', this.localTempDisplay);
        break;

      case memoryButtons.PLUS:
        this.events.setValue('memory', this.localTempDisplay + display);
        [...this.selector.getElementsByClassName('js-memory__disabled')].forEach(el => {
          el.classList.remove('disabled');
        });
        break;

      case memoryButtons.SUBSTRUCT:
        this.events.setValue('memory', this.localTempDisplay - display);
        [...this.selector.getElementsByClassName('js-memory__disabled')].forEach(el => {
          el.classList.remove('disabled');
        });
        break;

      case memoryButtons.SAVE:
        this.saveMemoryInList();
        this.localTempDisplay = this.events.getDisplayValue();
        this.events.setValue('memory', this.localTempDisplay);
        [...this.selector.getElementsByClassName('js-memory__disabled')].forEach(el => {
          el.classList.remove('disabled');
        });
        break;

      case memoryButtons.LIST:
        [...this.selector.getElementsByClassName('js-nonList')].forEach(el => {
          el.classList.toggle('disabled');
        });
        this.selector.querySelector('.memoryList').classList.toggle('none');
    }
  }

  saveMemoryInList = () => {
    this.valuesMemory.push(this.events.getDisplayValue());
    let wrapper = {
      cell: document.createElement('div'),
      btnClear: document.createElement('div'),
      btnPlus: document.createElement('div'),
      btnMinus: document.createElement('div')
    };
    wrapper.cell.className = 'memoryList__block';
    wrapper.btnClear.className = 'memoryList__block-btnClear';
    wrapper.btnPlus.className = 'memoryList__block-btnPlus';
    wrapper.btnMinus.className = 'memoryList__block-btnMinus';
    this.selector.querySelector('.memoryList').appendChild(wrapper.cell).innerHTML = this.valuesMemory[0];
    wrapper.cell.appendChild(wrapper.btnClear);
    wrapper.cell.appendChild(wrapper.btnPlus);
    wrapper.cell.appendChild(wrapper.btnMinus);
  }

  clearMemoryList
  

  get template() {
    return {
      buttons: `
        <div class="calculator__memory memory-calculator">
          <div class="memory-calculator__operations">
            <button class="memory-calculator__operations--size disabled js-nonList js-memory__disabled" value="MC">MC</button>
          </div>
          <div class="memory-calculator__operations">
            <button class="memory-calculator__operations--size disabled js-nonList js-memory__disabled" value="MR">MR</button>
          </div>
          <div class="memory-calculator__operations">
            <button class="memory-calculator__operations--size js-nonList js-memory__enebled" value="M+">M+</button>
          </div>
          <div class="memory-calculator__operations">
            <button class="memory-calculator__operations--size js-nonList js-memory__enebled" value="M-">M-</button>
          </div>
          <div class="memory-calculator__operations">
            <button class="memory-calculator__operations--size js-nonList js-memory__enebled" value="MS">MS</button>
          </div>
          <div class="memory-calculator__operations">
            <button class="memory-calculator__operations--size disabled js-memory__disabled" value="M">M</button>
          </div>
        </div>
      `,
      listMemory: '<div class="memoryList none">'  
    };
  }
}

export default Memory;