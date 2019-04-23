import Memory from './memory';
import Display from './display';
import LocalStor from './localStorage';
import { operations, cleaningButtons, controlButton, calculatorModes } from './const';
import TempStorage from './tempStorage';
import {default as packageInfo} from './../../package.json';


class Calculator extends TempStorage {
  constructor() {
    super();
    this.localStorage = new LocalStor(packageInfo.name, packageInfo.version);
    this.memory = new Memory(
      {
        getDisplayValue: () => {
          return this.display.value;
        },
        setValue: (key = 'value',  value) => {
          this.display[key] = value;
        }
      });
    this.display = new Display();
    this.pastOperation = '';
    this.currentOperation = '';
    this.resultOperation = 0;
    this.isPressingResult = false;
    this.isConcatArchive = false;
    this.isPressOperation = false;
    this.isPressNumber = false;
    this.motion();
    }

  init(selector) {
    this.$selector = document.querySelector(selector);
    this.$selector.innerHTML = this.template;
    this.display.init(this.$selector);
    this.memory.init(this.$selector);
    this.addListenClass('js-insertSymbol', this.insert);
    this.addListenClass('js-operationButton', this.operation);
    this.addListenClass('js-cleanButton', this.clean);
    this.addListenClass('js-resultButton', this.calculateResult);
    this.addListenClass('js-controlButton', this.control);
    this.loadStateFromLocalStorage();
  }

  addListenClass = (classSelector, callback) => {
    [...this.$selector.getElementsByClassName(classSelector)].forEach(el => {
      el.addEventListener('click', callback.bind(this));
    });
  };

  calculateResult = ({ target }) => {
    if (this.display.archive.length > 4) {
      this.secondOperand = 0;
    }
    this.isPressOperation = false;
    const firstOperand = this.firstOperand;
    const tempSecondOperand = this.secondOperand;
    const secondOperand = tempSecondOperand ? tempSecondOperand : this.display.value;

    if (target.value === operations.PERCENT) {
      this.display.value = this.percent(firstOperand, secondOperand);
      return;
    }

    if (target.value === operations.FRAC) {
      this.display.archive = `1/(${secondOperand})`;
      this.display.value = this.fraction(secondOperand);
      return;
    }

    switch (this.pastOperation) {
      case operations.PLUS:
        this.resultOperation = this.sum(firstOperand, secondOperand);
        break;
      case operations.MINUS:
        this.resultOperation = this.subtract(firstOperand, secondOperand);
        break;
      case operations.MULTIPLY:
        this.resultOperation = this.multyply(firstOperand, secondOperand);
        break;
      case operations.DIVIDE:
        this.resultOperation = this.divide(firstOperand, secondOperand);
        break;
      case operations.POW:
        this.resultOperation = this.pow(firstOperand, secondOperand);
        break;

    }

    if (firstOperand === 0 && secondOperand === 0) {
      return;
    }

    this.display.value = this.resultOperation;
    this.firstOperand = this.resultOperation;
    this.secondOperand = secondOperand;
    this.isPressingResult = true;
    this.isConcatArchive = false;
    this.display.archive = '';
  };

  result = () => {
    this.isPressOperation = false;

    if (this.secondOperand !== 0) {
      this.secondOperand = 0;
    }

    const firstOperand = this.firstOperand;

    const tempSecondOperand = this.secondOperand;

    const secondOperand = tempSecondOperand ? tempSecondOperand : this.display.value;

    if (this.pastOperation === this.pressOperation) {
      this.pastOperation = this.pressOperation; 
    }

    switch (this.pastOperation) {
      case operations.PLUS:
        this.resultOperation = this.sum(firstOperand, secondOperand);
        break;
      case operations.MINUS:
        this.resultOperation = this.subtract(firstOperand, secondOperand);
        break;
      case operations.MULTIPLY:
        this.resultOperation = this.multyply(firstOperand, secondOperand);
        break;
      case operations.DIVIDE:
        this.resultOperation = this.divide(firstOperand, secondOperand);
        break;
      case operations.POW:
        this.resultOperation = this.pow(firstOperand, secondOperand);
        break;

    }

    if (firstOperand === 0 && secondOperand === 0) {
      return;
    }

    this.display.value = this.resultOperation;
    this.firstOperand = this.resultOperation;
    this.secondOperand = secondOperand;
    this.isPressingResult = true;
  }

  insert = ({ target }) => {
    this.pastOperation = this.pressOperation;
    this.isPressNumber = true;
    this.isPressOperation = false;
    this.localVariabel = String(this.display.value);

    if (target.value === operations.COMMA) {

      if (this.currentOperation !== '') {
        this.setDisplay.value = 0 + operations.COMMA;
        return;
      }

      if (this.localVariabel.indexOf(operations.COMMA) === -1) {
        this.display.value = this.localVariabel + operations.COMMA;
        return;
      }
     
    }

    const number = parseFloat(target.value);

    if (isNaN(number)) {
      return;
    }

    if (this.localVariabel === '0') {
      this.display.value = Number(target.value);
      return;
    }

    if (this.currentOperation !== '') {
      this.localVariabel = '';
      this.currentOperation = '';
      this.isConcatArchive = true;
    }

    if (this.isPressingResult) {
      this.display.value = Number(target.value);
      this.isPressingResult = false;
      return;
    }

    const concatResult = this.localVariabel + target.value;
    this.display.value = Number(concatResult);
    
  };

  operation = ({ target }) => {
    this.isPressOperation = true;
    this.pressOperation = target.value;
    let localStoreArchive ='';
    switch (target.value) {
      case operations.FRAC:
        this.fraction(this.display.value);
        break;
      case operations.SQRT:
        this.display.value = this.sqrt();
        this.currentOperation = '';
        return;
      case operations.CHANGE:
        this.localVariabel = Number(this.display.value);

        if (this.pastOperation === '') {
          this.pastOperation = target.value;
          this.change(this.localVariabel);
          return;
        } 
        
        if (this.secondOperand !== '') {
          return this.change(this.display.value);
        }

        return this.change(this.firstOperand);
    }

    if (this.isConcatArchive) {

      if (!this.isPressNumber) {
        const concatResult = `${this.display.archive.slice(0, -1)}${this.pressOperation}`;
        this.display.archive = concatResult;
        return;
      }

      if (this.isPressOperation) {
        this.isPressNumber = false;
        this.result();
        this.currentOperation = target.value;
        const concatResult = `${this.display.archive} ${this.secondOperand} ${this.pressOperation}`;
        this.display.archive = concatResult;
        return;
      }
    }

    this.isConcatArchive = false;
    this.currentOperation = target.value;
    this.pastOperation = this.currentOperation;

    if (this.isPressingResult) {
      this.secondOperand = 0;
    }
  
    this.firstOperand = this.display.value;
    localStoreArchive = `${this.display.value} ${this.currentOperation}`;
    this.display.archive = localStoreArchive;
  };

  sum(first, second) {
    return first + second;
  }

  divide(first, second) {
    return first / second;
  }

  multyply(first, second) {
    return first * second;
  }

  subtract(first, second) {
    return first - second;
  }

  pow(first, second) {
    return  Math.pow(first, second);
    
  }

  change(first) {
    this.display.value = first * -1;
    this.firstOperand = first * -1;
    return;
  }

  fraction(first) {
    return  1 / first;
  }

  sqrt() {
    return parseFloat(Math.sqrt(this.display.value).toFixed(6), 9);
  }
    
  percent(first, second) {
    return (first / 100) * second;
  }

  clean = ({ target }) => {
    this.isPressOperation = false;
    const { value } = target;
    let resultText = '';
    const displayText = String(this.display.value);

    if (value === cleaningButtons.REMOVE_LAST_SYMBOL) {

        if (this.resultOperation !== 0){
          return;
        }

        resultText = displayText.length > 1 ? displayText.slice(0, -1) : 0;
        this.display.value = resultText;
        return;
      }

        this.currentOperation = '';
        this.pastOperation = '';
        this.firstOperand = '';
        this.secondOperand = '';
        this.resultOperation = 0;
        this.isPressingResult = false;
        this.isConcatArchive = false;
        this.isPressOperation = false;
        this.isPressNumber = false;
        this.display.archive = '';
        
    
        if (displayText === '0') {
          return;
        }

    if (value === cleaningButtons.CLEAN) {
      this.display.value = 0;
      this.firstOperand = '';
      this.secondOperand = '';
    }
    this.display.value = 0;
  };

  motion = () => {
    let dragObject = {};

    let self = this;

    document.onmousedown = e => {
      if (e.which !== 1) return;

      let elem = e.target.closest('#root');

      if (!elem) return;

      dragObject.elem = elem;
      dragObject.downX = e.pageX;
      dragObject.downY = e.pageY;

      return false;
    };

    document.onmousemove = e => {
      if (!dragObject.elem) return;

      if (!dragObject.avatar) {
        let moveX = e.pageX - dragObject.downX;

        let moveY = e.pageY - dragObject.downY;

        if (Math.abs(moveX) < 1 && Math.abs(moveY) < 1) {
          return;
        }

        dragObject.avatar = createAvatar(e);
        if (!dragObject.avatar) {
          dragObject = {};
          return;
        }

        let coords = getCoords(dragObject.avatar);
        dragObject.shiftX = dragObject.downX - coords.left;
        dragObject.shiftY = dragObject.downY - coords.top;

        startDrag(e);
      }

      dragObject.avatar.style.left = e.pageX - dragObject.shiftX + 'px';
      dragObject.avatar.style.top = e.pageY - dragObject.shiftY + 'px';
      return false;
    };

    document.onmouseup = e => {
      let elem = e.target.closest('.hat__title');
      if (!elem) 
        return;

      if (dragObject.avatar) {
        finishDrag(e);
        this.saveState();
      }

      dragObject = {};
    };

    let finishDrag = e => {
      let dropElem = findDroppable(e);

      if (!dropElem) {
        self.onDragCancel(dragObject);
      } 

      self.onDragEnd(dragObject, dropElem);
      
    };

    let createAvatar = e => {
      let avatar = dragObject.elem;

      let elem = e.target.closest('.hat__title');

      if (!elem) return;

      let old = {
        parent: avatar.parentNode,
        nextSibling: avatar.nextSibling,
        position: avatar.position || '',
        left: avatar.left || '',
        top: avatar.top || '',
        zIndex: avatar.zIndex || ''
      };

      avatar.rollback = () => {
        old.parent.insertBefore(avatar, old.nextSibling);
        avatar.style.position = old.position;
        avatar.style.left = old.left;
        avatar.style.top = old.top;
        avatar.style.zIndex = old.zIndex;
      };
      return avatar;
    };

    let startDrag = () => {
      let avatar = dragObject.avatar;

      document.body.appendChild(avatar);
      avatar.style.zIndex = 9999;
      avatar.style.position = 'absolute';
    };

    let findDroppable = event => {
      dragObject.avatar.hidden = true;

      let elem = document.elementFromPoint(event.clientX, event.clientY);

      dragObject.avatar.hidden = false;

      if (elem == null) {
        return null;
      }

      return elem.closest('body');
    };

    this.onDragEnd = function (dragObject, dropElem) { };
    this.onDragCancel = function (dragObject) { };

    let getCoords = elem => {
      let box = elem.getBoundingClientRect();

      return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
      };
    };
  }

  control(event) {
    this.resizeCalc = {
      CALC: this.$selector.querySelector('.calculator'),
      OPEN: this.$selector.querySelector('.openCalc'),
      CLOSE: this.$selector.querySelector('.hat__buttons-close'),
      EXPAND: this.$selector.querySelector('.hat__buttons-expand'),
      ROLLUP: this.$selector.querySelector('.hat__buttons-rollUp'),
      BODY: this.$selector.querySelector('.body')
    };

    switch(event.target.dataset.value) {
      case controlButton.OPEN:
        this.resizeCalc.BODY.classList.remove('none');
        this.resizeCalc.CALC.classList.remove('none');
        this.resizeCalc.OPEN.classList.add('none');
        this.currentMode = calculatorModes.STANDARD;
        this.saveState();
        break;
      case controlButton.CLOSE:
        this.resizeCalc.CALC.style.position = 'absolute';
        this.resizeCalc.CALC.style.bottom = 6;
        this.resizeCalc.CALC.style.right = 0;
        this.resizeCalc.CALC.classList.add('none');
        this.resizeCalc.OPEN.classList.remove('none');
        this.currentMode = calculatorModes.CLOSED;
        this.saveState();
        break;
      case controlButton.EXPAND:
        this.resizeCalc.BODY.classList.remove('none');
        this.resizeCalc.EXPAND.classList.toggle('disabled');
        this.resizeCalc.ROLLUP.classList.toggle('disabled');
        this.currentMode = calculatorModes.STANDARD;
        this.saveState();
        break;
      case controlButton.ROLLUP:
        this.resizeCalc.BODY.classList.add('none');
        this.resizeCalc.EXPAND.classList.toggle('disabled');
        this.resizeCalc.ROLLUP.classList.toggle('disabled');
        this.currentMode = calculatorModes.MINIMIZED;
        this.saveState();
        break;
    }
  }
 
  saveState = () => {
     this.saveStateCalc = {
      MODE: this.currentMode,
      X: document.querySelector('#root').style.top,
      Y: document.querySelector('#root').style.left
    };
    this.localStorage.coordinatesStore = this.saveStateCalc;
  }
  loadStateFromLocalStorage = () => {
    let store = this.localStorage.coordinatesStore;
    switch(store.MODE) {
      case calculatorModes.MINIMIZED:
      this.$selector.querySelector('.body').classList.add('none');
        this.$selector.querySelector('.hat__buttons-expand').classList.toggle('disabled');
        this.$selector.querySelector('.hat__buttons-rollUp').classList.toggle('disabled');
        break;
      case calculatorModes.STANDARD:
      document.querySelector('#root').classList.remove('none');
      this.$selector.querySelector('.body').classList.remove('none');
        break;
      case calculatorModes.CLOSED:
      document.querySelector('.calculator').classList.add('none');
      this.$selector.querySelector('.openCalc').classList.toggle('none');
    }
    document.querySelector('#root').style.top = store.X;
    document.querySelector('#root').style.left = store.Y;
  }

  get template() {
    return `
  <div class="calculator">
    <div class="calculator__hat hat">
      <div class="hat__title">Calculator</div>
      <div class="hat__buttons">
        <div class="hat__buttons-rollUp js-controlButton" data-value="rollUp"></div>
        <div class="hat__buttons-expand disabled js-controlButton" data-value="expand"></div>
        <div class="hat__buttons-close js-controlButton" data-value="closeCalc"></div>
      </div>
    </div>
  <div class="body">
    ${this.display.template}
    ${this.memory.template.buttons}
      <div class="calculator__keyboard">
        <div class="calculator__keyboard-container">
          <div class="calculator__keyboard-button">
            <button class="calculator__keyboard-button--operation js-resultButton" value="percent">%</button>
          </div>
          <div class="calculator__keyboard-button">
            <button class="calculator__keyboard-button--operation js-operationButton" value="sqrt">√</button>
          </div>
          <div class="calculator__keyboard-button">
            <button class="calculator__keyboard-button--operation js-operationButton" value="^">x <sup>n</sup></button>
          </div>
          <div class="calculator__keyboard-button">
            <button class="calculator__keyboard-button--operation js-resultButton"
              value="fraction"><sup>1</sup>/x</button>
          </div>
        </div>
        <div class="calculator__keyboard-container">
          <div class="calculator__keyboard-button">
            <button class="calculator__keyboard-button--operation js-cleanButton" value="CE">CE</button>
          </div>
          <div class="calculator__keyboard-button">
            <button class="calculator__keyboard-button--operation js-cleanButton" value="C">C</button>
          </div>
          <div class="calculator__keyboard-button">
            <button class="calculator__keyboard-button--operation js-cleanButton" value="removeLastNumber">⇐</button>
          </div>
          <div class="calculator__keyboard-button">
            <button class="calculator__keyboard-button--operation js-operationButton" value="/">÷</button>
          </div>
        </div>
        <div class="calculator__keyboard-container">
          <div class="calculator__keyboard-button">
            <button class="calculator__keyboard-button--number js-insertSymbol" value="7">7</button>
          </div>
          <div class="calculator__keyboard-button">
            <button class="calculator__keyboard-button--number js-insertSymbol" value="8">8</button>
          </div>
          <div class="calculator__keyboard-button">
            <button class="calculator__keyboard-button--number js-insertSymbol" value="9">9</button>
          </div>
          <div class="calculator__keyboard-button">
            <button class="calculator__keyboard-button--operation js-operationButton" value="*">×</button>
          </div>
        </div>
        <div class="calculator__keyboard-container">
          <div class="calculator__keyboard-button">
            <button class="calculator__keyboard-button--number js-insertSymbol" value="4">4</button>
          </div>
          <div class="calculator__keyboard-button">
            <button class="calculator__keyboard-button--number js-insertSymbol" value="5">5</button>
          </div>
          <div class="calculator__keyboard-button">
            <button class="calculator__keyboard-button--number js-insertSymbol" value="6">6</button>
          </div>
          <div class="calculator__keyboard-button">
            <button class="calculator__keyboard-button--operation js-operationButton" value="-">-</button>
          </div>
        </div>
        <div class="calculator__keyboard-container">
          <div class="calculator__keyboard-button">
            <button class="calculator__keyboard-button--number js-insertSymbol" value="1">1</button>
          </div>
          <div class="calculator__keyboard-button">
            <button class="calculator__keyboard-button--number js-insertSymbol" value="2">2</button>
          </div>
          <div class="calculator__keyboard-button">
            <button class="calculator__keyboard-button--number js-insertSymbol" value="3">3</button>
          </div>
          <div class="calculator__keyboard-button">
            <button class="calculator__keyboard-button--operation js-operationButton" value="+">+</button>
          </div>
        </div>
        <div class="calculator__keyboard-container">
          <div class="calculator__keyboard-button">
            <button class="calculator__keyboard-button--operation js-operationButton" value="change">±</button>
          </div>
          <div class="calculator__keyboard-button">
            <button class="calculator__keyboard-button--number js-insertSymbol" value="0">0</button>
          </div>
          <div class="calculator__keyboard-button">
            <button class="calculator__keyboard-button--operation js-insertSymbol" value=".">,</button>
          </div>
          <div class="calculator__keyboard-button">
            <button class="calculator__keyboard-button--operation js-resultButton" value="=">=</button>
          </div>
        </div>
      </div>
      ${this.memory.template.listMemory}
    </div>
  </div>  
  <div class="openCalc js-controlButton none" data-value="openCalc">
    <p class="openCalc__text" disabled="disabled">OPEN Calculator</p>
  </div>
  	`;
  }
}

export default Calculator;
