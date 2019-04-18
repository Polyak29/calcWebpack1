import Memory from './memory';
import Display from './display';
import LocalStor from './localStorage';
import { operations, cleaningButtons, displayVisibility, minimize, resizeCalc, controlButton, calculatorModes } from './const';
import TempStorage from './tempStorage';
import {default as packageInfo} from './../../package.json';


class Calculator extends TempStorage {
  constructor() {
    super();
  
    this.memory = new Memory();
    this.display = new Display();
    this.localStorage = new LocalStor(packageInfo.name, packageInfo.version);
    this.init();
    this.isPressingResult = false;
    this.pastOperation = '';
    this.currentOperation = '';
    this.resultOperation = 0;
    this.motion();
    this.listenClass('js_insertSymbol', this.insert);
    this.listenClass('js_operationButton', this.operation);
    this.listenClass('js_cleanButton', this.clean);
    this.listenClass('js_resultButton', this.calculateResult);
    this.listenClass('js_controlButton', this.control);
    resizeCalc.CALC.style.display = displayVisibility.FLEX;
    }

  listenClass = (classSelector, nameMethod) => {
    [...document.getElementsByClassName(classSelector)].forEach(el => {
      el.addEventListener('click', nameMethod);
    });
  };


  calculateResult = ({ target }) => {
    const firstOperand = this.firstOperand;
    const tempSecondOperand = this.secondOperand;
    const secondOperand = tempSecondOperand
      ? tempSecondOperand
      : +this.display.value;

    if (target.value === operations.PERCENT) {
      this.display.value = this.percent(firstOperand, secondOperand);
      return;
    }

    if (target.value === operations.FRAC) {
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
  };

  insert = ({ target }) => {
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

    this.currentOperation = target.value;
    this.pastOperation = this.currentOperation;
    this.firstOperand = this.display.value;
    this.secondOperand = '';


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
    const { value } = target;
    let resultText = '';
    const displayText = this.display.value;

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

  control({target}) {
    switch(target.title) {
      case controlButton.OPEN:
      resizeCalc.CALC.style.display = displayVisibility.FLEX;
      resizeCalc.OPEN.style.display = displayVisibility.NONE;
        break;
      case controlButton.CLOSE:
        resizeCalc.CALC.style.position = 'absolute';
        resizeCalc.CALC.style.top = '4.5rem';
        resizeCalc.CALC.style.right = '1rem';
        resizeCalc.CALC.style.left = 'auto';
        resizeCalc.CALC.style.display = displayVisibility.NONE;
        resizeCalc.OPEN.style.display = displayVisibility.FLEX;
        break;
      case controlButton.EXPAND:
        Object.entries(minimize).forEach(([, value]) => {
          value.style.display = displayVisibility.FLEX;
        });
        resizeCalc.EXPAND.classList.toggle('disabled');
        resizeCalc.ROLLUP.classList.toggle('disabled');
        break;
      case controlButton.ROLLUP:
        Object.entries(minimize).forEach(([, value]) => {
          value.style.display = displayVisibility.NONE;
        });
        resizeCalc.EXPAND.classList.toggle('disabled');
        resizeCalc.ROLLUP.classList.toggle('disabled');
        break;
    }
  }
  
  init(selector) {
    this.loadState();
	}
 
  saveState() {
     this.coords = {
      MODE: calculatorModes.DEFAULT,
      X: document.querySelector('.calculator').style.top,
      Y: document.querySelector('.calculator').style.left
    };
    this.localStorage.coordinatesStore = this.coords;
  }
  loadState() {
    let store = this.localStorage.coordinatesStore;
    document.querySelector('.calculator').style.top = store.X;
    document.querySelector('.calculator').style.left = store.Y;
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
}

export default Calculator;
