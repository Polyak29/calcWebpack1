import Memory from './memory';
import Display from './display';
import LocalStor from './localStorage';
import { operations, cleaningButtons, displayVisibility, minimize, resizeCalc } from './const';
import TempStorage from './tempStorage';


class Calculator {
  constructor() {
    this.memory = new Memory();
    this.display = new Display();
    this.tempStorage = new TempStorage();
    this.resultOperation = 0;
    this.isSecondOperand = false;
    this.pastOperation = '';
    this.currentOperation = '';
    this.myStorage = localStorage;
    this.motion();

    this.listenClass('js_insertSymbol', this.insert);
    this.listenClass('js_operationButton', this.operation);
    this.listenClass('js_cleanButton', this.clean);
    this.listenClass('js_resultButton', this.calculateResult);
    this.listenClass('hat__buttons-rollUp', this.rollUp);
    this.listenClass('hat__buttons-expand', this.expand);
    this.listenClass('hat__buttons-close', this.closeCalc);
    this.listenClass('openCalc', this.openCalc);
  }

  listenClass = (classSelector, nameMethod) => {
    [...document.getElementsByClassName(classSelector)].forEach(el => {
      el.addEventListener('click', nameMethod);
    });
  };


  calculateResult = ({ target }) => {

    let resultOperation = 0;

    const firstOperand = this.tempStorage.getTempStoreForFirstOperand();
    const tempSecondOperand = this.tempStorage.getTempStoreForSecondOperand();
    const secondOperand = tempSecondOperand
      ? tempSecondOperand
      : +this.display.getDisplayValue();

    if (target.value === operations.PERCENT) {
      this.display.setDisplayValue(this.percent(firstOperand, secondOperand));
      return;
    }

    switch (this.pastOperation) {
      case operations.PLUS:
        resultOperation = this.sum(firstOperand, secondOperand);
        break;
      case operations.MINUS:
        resultOperation = this.subtract(firstOperand, secondOperand);
        break;
      case operations.MULTIPLY:
        resultOperation = this.multyply(firstOperand, secondOperand);
        break;
      case operations.DIVIDE:
        resultOperation = this.divide(firstOperand, secondOperand);
        break;
      case operations.POW:
        resultOperation = this.pow(firstOperand, secondOperand);
        break;

    }

    this.display.setDisplayValue(resultOperation);
    this.tempStorage.setTempStoreForFirstOperand(resultOperation);
    this.tempStorage.setTempStoreForSecondOperand(secondOperand);
  };

  insert = ({ target }) => {
    let localVariabel = this.display.getDisplayValue();

    if (target.value === operations.COMMA) {
      if (localVariabel.indexOf(operations.COMMA) === -1) {
        this.display.setDisplayValue(localVariabel + operations.COMMA);
      }
      return;
    }

    const number = parseFloat(target.value);

    if (isNaN(number)) {
      return;
    }

    if (this.display.getDisplayValue() === '0') {
      this.display.setDisplayValue(number);
      return;
    }

    if (this.currentOperation !== '') {
      this.display.setDisplayValue('');
      this.currentOperation = '';
    }

    const concatResult = this.display.getDisplayValue() + number;
    this.display.setDisplayValue(concatResult);
  };

  operation = ({ target }) => {

    switch (target.value) {
      case operations.FRAC:
        this.fraction(this.display.getDisplayValue());
        break;
      case operations.SQRT:
        this.display.setDisplayValue(this.sqrt());
        break;
      case operations.CHANGE:
        if (this.pastOperation === '') {
          this.pastOperation = target.value;
          this.change(this.display.getDisplayValue());
          return;
        } else if (this.tempStorage.getTempStoreForSecondOperand() !== '') {
          return this.change(this.display.getDisplayValue());
        }
        return this.change(this.tempStorage.getTempStoreForFirstOperand());
    }

    this.currentOperation = target.value;
    this.pastOperation = this.currentOperation;
    this.tempStorage.setTempStoreForFirstOperand(this.display.getDisplayValue());
    this.tempStorage.setTempStoreForSecondOperand('');

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
    return Math.pow(first, second);
  }

  change(first) {
    this.display.setDisplayValue(first * -1);
    this.tempStorage.setTempStoreForFirstOperand(first * -1);
  }

  fraction(first) {
    return this.display.setDisplayValue(1 / first);
  }

  sqrt() {
    return Math.sqrt(this.display.getDisplayValue());
  }

  percent(first, second) {

    return (first / 100) * second;


  }

  clean = ({ target }) => {
    const { value } = target;

    this.currentOperation = '';
    this.pastOperation = '';
    this.tempStorage.setTempStoreForFirstOperand('');
    this.tempStorage.setTempStoreForSecondOperand('');
    const displayText = this.display.getDisplayValue();

    if (displayText === '0') {
      return;
    }

    if (value === cleaningButtons.REMOVE_LAST_SYMBOL) {
      const resultText = displayText.length > 1 ? displayText.slice(0, -1) : 0;

      this.display.setDisplayValue(resultText);
      return;
    }

    if (value === cleaningButtons.CLEAN) {
      this.display.getDisplayValue(0);
      this.tempStorage.getTempStoreForFirstOperand('');
      this.tempStorage.getTempStoreForSecondOperand('');
    }
    this.display.setDisplayValue(0);
  };

  motion() {
    let dragObject = {};

    let self = this;

    document.onmousedown = e => {
      if (e.which !== 1) return;

      let elem = e.target.closest('.calculator');
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
      let coords = new LocalStor(this.coords);
      let serialObj = JSON.stringify(coords);
      if (dragObject.avatar) {
        finishDrag(e);
        localStorage.setItem('pos', serialObj);
      }

      dragObject = {};
    };

    let finishDrag = e => {
      let dropElem = findDroppable(e);

      if (!dropElem) {
        self.onDragCancel(dragObject);
      } else {
        self.onDragEnd(dragObject, dropElem);
      }
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


  openCalc() {
    resizeCalc.CALC.style.display = displayVisibility.FLEX;
    resizeCalc.OPEN.style.display = displayVisibility.NONE;
  }

  closeCalc() {
    resizeCalc.CALC.style.position = 'absolute';
    resizeCalc.CALC.style.top = '4.5rem';
    resizeCalc.CALC.style.right = '1rem';
    resizeCalc.CALC.style.left = 'auto';
    resizeCalc.CALC.style.display = displayVisibility.NONE;
    resizeCalc.OPEN.style.display = displayVisibility.FLEX;
  }


  expand() {
    Object.entries(minimize).forEach(([key, value]) => {
      value.style.display = displayVisibility.FLEX;
    });
    resizeCalc.EXPAND.classList.toggle('disabled');
    resizeCalc.ROLLUP.classList.toggle('disabled');
  }

  rollUp() {
    Object.entries(minimize).forEach(([key, value]) => {
      value.style.display = displayVisibility.NONE;
    });
    resizeCalc.EXPAND.classList.toggle('disabled');
    resizeCalc.ROLLUP.classList.toggle('disabled');
  }

  // get template() {
  //   return `
  //     <div class="calculator">
  //       ${this.display.template}
  //       <div class="calculator__keyboard">
  //         <div class="calculator__keyboard-container">
  //           <div class="calculator__keyboard-button">
  //             <button class="calculator__keyboard-button--operation js_resultButton" value="percent">%</button>
  //           </div>
  //           <div class="calculator__keyboard-button">
  //             <button class="calculator__keyboard-button--operation js_operationButton" value="sqrt">√</button>
  //           </div>
  //           <div class="calculator__keyboard-button">
  //             <button class="calculator__keyboard-button--operation js_operationButton" value="^">x <sup>n</sup></button>
  //           </div>
  //           <div class="calculator__keyboard-button">
  //             <button class="calculator__keyboard-button--operation js_operationButton"
  //               value="fraction"><sup>1</sup>/x</button>
  //           </div>
  //         </div>
  //         <div class="calculator__keyboard-container">
  //           <div class="calculator__keyboard-button">
  //             <button class="calculator__keyboard-button--operation js_cleanButton" value="CE">CE</button>
  //           </div>
  //           <div class="calculator__keyboard-button">
  //             <button class="calculator__keyboard-button--operation js_cleanButton" value="C">C</button>
  //           </div>
  //           <div class="calculator__keyboard-button">
  //             <button class="calculator__keyboard-button--operation js_cleanButton" value="removeLastNumber">⇐</button>
  //           </div>
  //           <div class="calculator__keyboard-button">
  //             <button class="calculator__keyboard-button--operation js_operationButton" value="/">÷</button>
  //           </div>
  //         </div>
  //         <div class="calculator__keyboard-container">
  //           <div class="calculator__keyboard-button">
  //             <button class="calculator__keyboard-button--number js_insertSymbol" value="7">7</button>
  //           </div>
  //           <div class="calculator__keyboard-button">
  //             <button class="calculator__keyboard-button--number js_insertSymbol" value="8">8</button>
  //           </div>
  //           <div class="calculator__keyboard-button">
  //             <button class="calculator__keyboard-button--number js_insertSymbol" value="9">9</button>
  //           </div>
  //           <div class="calculator__keyboard-button">
  //             <button class="calculator__keyboard-button--operation js_operationButton" value="*">×</button>
  //           </div>
  //         </div>
  //         <div class="calculator__keyboard-container">
  //           <div class="calculator__keyboard-button">
  //             <button class="calculator__keyboard-button--number js_insertSymbol" value="4">4</button>
  //           </div>
  //           <div class="calculator__keyboard-button">
  //             <button class="calculator__keyboard-button--number js_insertSymbol" value="5">5</button>
  //           </div>
  //           <div class="calculator__keyboard-button">
  //             <button class="calculator__keyboard-button--number js_insertSymbol" value="6">6</button>
  //           </div>
  //           <div class="calculator__keyboard-button">
  //             <button class="calculator__keyboard-button--operation js_operationButton" value="-">-</button>
  //           </div>
  //         </div>
  //         <div class="calculator__keyboard-container">
  //           <div class="calculator__keyboard-button">
  //             <button class="calculator__keyboard-button--number js_insertSymbol" value="1">1</button>
  //           </div>
  //           <div class="calculator__keyboard-button">
  //             <button class="calculator__keyboard-button--number js_insertSymbol" value="2">2</button>
  //           </div>
  //           <div class="calculator__keyboard-button">
  //             <button class="calculator__keyboard-button--number js_insertSymbol" value="3">3</button>
  //           </div>
  //           <div class="calculator__keyboard-button">
  //             <button class="calculator__keyboard-button--operation js_operationButton" value="+">+</button>
  //           </div>
  //         </div>
  //         <div class="calculator__keyboard-container">
  //           <div class="calculator__keyboard-button">
  //             <button class="calculator__keyboard-button--operation js_operationButton" value="change">±</button>
  //           </div>
  //           <div class="calculator__keyboard-button">
  //             <button class="calculator__keyboard-button--number js_insertSymbol" value="0">0</button>
  //           </div>
  //           <div class="calculator__keyboard-button">
  //             <button class="calculator__keyboard-button--operation js_insertSymbol" value=".">,</button>
  //           </div>
  //           <div class="calculator__keyboard-button">
  //             <button class="calculator__keyboard-button--operation js_resultButton" value="=">=</button>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  // 	`;
  // }

  // init(props) {
  //   props.innerHTML = this.template;
  // }

}

export default Calculator;
