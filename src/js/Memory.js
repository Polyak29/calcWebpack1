import { memoryButtons } from './const';

class Memory {
  constructor( events = {
    getDisplayValue: ()  => {},
    setValue: () => {},
    setLocalStorage: () => {}
  }) {
    this.localTempDisplay = 0;
    this.events = events;
  }

  init(selector, data = []) {
    this.selector = selector;
    this.data = data;
    if (this.data.length <= 1 && this.data[0] === 0) {
      this.events.setValue('memory', '');

      [...this.selector.getElementsByClassName('js-memory__disabled')].forEach(el => {
        el.classList.add('disabled');
      });
    }

    if (this.data.length > 1) {
        this.data.forEach(el => {
            this.createItem(el);
        } );

        this.localTempDisplay = this.events.getDisplayValue();
        this.events.setValue('memory', this.localTempDisplay);
        [...this.selector.getElementsByClassName('js-memory__disabled')].forEach(el => {
            el.classList.remove('disabled');
        });
    }
    [
      ...selector.getElementsByClassName('memory-calculator__operations--size')
    ].forEach(el => {
      el.addEventListener('click', this.workMemory);
    });
    this.selector.querySelector('.calculator__display').addEventListener('click', this.closeMemoryList);

  }

  closeMemoryList = () => {
     if (this.selector.querySelector('.memory-list__item') === null) {
      this.selector.querySelector('.memory-list').classList.add('none');
      [...this.selector.getElementsByClassName('js-memory__set')].forEach(el => {
        el.classList.remove('disabled');
      });
      return;
     }
     this.selector.querySelector('.memory-list').classList.add('none');
     [...this.selector.getElementsByClassName('js-nonList')].forEach(el => {
      el.classList.remove('disabled');
    });  }

  workMemory = ({ target }) => {
    switch (target.value) {
      case memoryButtons.CLEAR:
          this.data = [0];
          this.events.setLocalStorage(this.data);
          this.events.setValue('memory', '');
          [...this.selector.getElementsByClassName('js-memory__disabled')].forEach(el => {
            el.classList.add('disabled');
          });

        break;

      case memoryButtons.READ:
        this.events.setValue('value', this.localTempDisplay);
        break;

        case memoryButtons.PLUS:
        this.data[0] = this.data[0] + this.events.getDisplayValue();
        this.selector.querySelector('.memory-list__item-value').innerHTML = this.data[0];
        this.events.setValue('memory', this.localTempDisplay);
        this.events.setLocalStorage(this.data);
        [...this.selector.getElementsByClassName('js-memory__disabled')].forEach(el => {
          el.classList.remove('disabled');
        });
        break;

      case memoryButtons.SUBSTRUCT:
      if (this.data.length !== 0 ) {
        this.data[0] = this.data[0] - this.events.getDisplayValue();
        this.selector.querySelector('.memory-list__item-value').innerHTML = this.data[0];
        this.events.setValue('memory', this.localTempDisplay);
        this.events.setLocalStorage(this.data);
        [...this.selector.getElementsByClassName('js-memory__disabled')].forEach(el => {
          el.classList.remove('disabled');
        });
        return;
      }
      this.saveMemoryInList();
        [...this.selector.getElementsByClassName('js-memory__disabled')].forEach(el => {
          el.classList.remove('disabled');
        });
        break;

      case memoryButtons.SAVE:
          [...this.selector.getElementsByClassName('js-memory__disabled')].forEach(el => {
              el.classList.remove('disabled');
          });

        if (this.data[0] === 0) {
            this.data  = [];
            this.saveMemoryInList();
            this.events.setValue('memory', this.localTempDisplay);
            return;
        }

        this.saveMemoryInList();
        this.events.setValue('memory', this.localTempDisplay);
        break;

      case memoryButtons.LIST:
        [...this.selector.getElementsByClassName('js-nonList')].forEach(el => {
          el.classList.toggle('disabled');
        });
        this.selector.querySelector('.memory-list').classList.toggle('none');
        this.addListenerItemMemoryList();
    }
  }

  saveMemoryInList = () => {
    this.data.unshift(this.events.getDisplayValue());
    this.events.setLocalStorage(this.data);
    const memoryList =  this.selector.querySelector('.memory-list');
    let wrapper = {
      cell: document.createElement('div'),
      value: document.createElement('div'),
      clear: document.createElement('div'),
      plus: document.createElement('div'),
      minus: document.createElement('div')
    };
    wrapper.cell.className = 'memory-list__item';

    wrapper.value.className = 'memory-list__item-value';

    wrapper.clear.className = 'memory-list__item-clear js-memory';
    wrapper.clear.setAttribute('data-key', memoryButtons.CLEAR);
    wrapper.clear.innerHTML = memoryButtons.CLEAR;

    wrapper.plus.className = 'memory-list__item-plus js-memory';
    wrapper.plus.setAttribute('data-key', memoryButtons.PLUS);
    wrapper.plus.innerHTML = memoryButtons.PLUS;

    wrapper.minus.className = 'memory-list__item-minus js-memory';
    wrapper.minus.setAttribute('data-key', memoryButtons.SUBSTRUCT);
    wrapper.minus.innerHTML = memoryButtons.SUBSTRUCT;

    memoryList.insertBefore(wrapper.cell, memoryList.firstChild);

    wrapper.cell.appendChild(wrapper.value).innerHTML = this.data[0];
    wrapper.cell.appendChild(wrapper.value).setAttribute('data-value', this.data[0]);

    wrapper.cell.appendChild(wrapper.clear);
    wrapper.cell.appendChild(wrapper.plus);
    wrapper.cell.appendChild(wrapper.minus);
  }

  createItem = (el) => {
      const memoryList =  this.selector.querySelector('.memory-list');
      let wrapper = {
          cell: document.createElement('div'),
          value: document.createElement('div'),
          clear: document.createElement('div'),
          plus: document.createElement('div'),
          minus: document.createElement('div')
      };
      wrapper.cell.className = 'memory-list__item';

      wrapper.value.className = 'memory-list__item-value';

      wrapper.clear.className = 'memory-list__item-clear js-memory';
      wrapper.clear.setAttribute('data-key', memoryButtons.CLEAR);
      wrapper.clear.innerHTML = memoryButtons.CLEAR;

      wrapper.plus.className = 'memory-list__item-plus js-memory';
      wrapper.plus.setAttribute('data-key', memoryButtons.PLUS);
      wrapper.plus.innerHTML = memoryButtons.PLUS;

      wrapper.minus.className = 'memory-list__item-minus js-memory';
      wrapper.minus.setAttribute('data-key', memoryButtons.SUBSTRUCT);
      wrapper.minus.innerHTML = memoryButtons.SUBSTRUCT;

      memoryList.insertBefore(wrapper.cell, memoryList.firstChild);

      wrapper.cell.appendChild(wrapper.value).innerHTML = el;
      wrapper.cell.appendChild(wrapper.value).setAttribute('data-value', el);

      wrapper.cell.appendChild(wrapper.clear);
      wrapper.cell.appendChild(wrapper.plus);
      wrapper.cell.appendChild(wrapper.minus);
  }

  addListenerItemMemoryList = () => {
      this.selector.querySelectorAll('.memory-list__item').forEach(item => {
        item.addEventListener('click', this.workWithButtonsInMemoryList);
      });
    }

  workWithButtonsInMemoryList = (event) => {
    switch(event.target.dataset.key) {
      case memoryButtons.PLUS:
        this.numberOfMemory = Number(event.currentTarget.querySelector('.memory-list__item-value').dataset.value);
        this.resultOperationInMemory = this.numberOfMemory + this.events.getDisplayValue();
        this.data[find(this.data, this.numberOfMemory)] = this.resultOperationInMemory;
        this.data.splice(this.data.indexOf(this.numberOfMemory), 1, this.resultOperationInMemory);
        event.currentTarget.querySelector('.memory-list__item-value').setAttribute('data-value', this.resultOperationInMemory);
        event.currentTarget.querySelector('.memory-list__item-value').innerHTML = this.resultOperationInMemory;
        this.events.setLocalStorage(this.data);
        break;
      case memoryButtons.CLEAR:
        this.numberOfMemory = Number(event.currentTarget.querySelector('.memory-list__item-value').dataset.value);
        event.currentTarget.remove();
        this.data.splice(this.data.indexOf(this.numberOfMemory), 1);
        this.events.setLocalStorage(this.data);
        if (this.selector.querySelector('.memory-list__item') === null) {
          [...this.selector.getElementsByClassName('js-memory__disabled')].forEach(el => {
            el.classList.add('disabled');
          });
            this.data = [0];
            this.events.setLocalStorage(this.data);
        }
        break;
      case memoryButtons.SUBSTRUCT:
      this.numberOfMemory = Number(event.currentTarget.querySelector('.memory-list__item-value').dataset.value);
      this.resultOperationInMemory = this.numberOfMemory - this.events.getDisplayValue();
      this.data[find(this.data, this.numberOfMemory)] = this.resultOperationInMemory;
      this.data.splice(this.data.indexOf(this.numberOfMemory), 1, this.resultOperationInMemory);
      event.currentTarget.querySelector('.memory-list__item-value').setAttribute('data-value', this.resultOperationInMemory);
      event.currentTarget.querySelector('.memory-list__item-value').innerHTML = this.resultOperationInMemory;
      this.events.setLocalStorage(this.data);
      break;
    }
  }



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
            <button class="memory-calculator__operations--size js-nonList js-memory__enebled js-memory__set" value="M+">M+</button>
          </div>
          <div class="memory-calculator__operations">
            <button class="memory-calculator__operations--size js-nonList js-memory__enebled js-memory__set" value="M-">M-</button>
          </div>
          <div class="memory-calculator__operations">
            <button class="memory-calculator__operations--size js-nonList js-memory__enebled js-memory__set" value="MS">MS</button>
          </div>
          <div class="memory-calculator__operations">
            <button class="memory-calculator__operations--size disabled js-memory__disabled" value="M">M</button>
          </div>
        </div>
      `,
      listMemory: '<div class="memory-list none">'
    };
  }
}

export default Memory;