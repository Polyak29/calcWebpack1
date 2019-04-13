import Memory from './Memory';
import Display from './display';
import OnOff from './startCalc';
import LocalStor from './localStorage';
import {operations, cleaningButtons} from './const'
import TempStorage from './tempStorage';

// new Memory();
new OnOff();
class Calculator {
  constructor() {
    this.display = new Display();
    this.tempStorage = new TempStorage();
    this.resultOperation = 0;
    this.isSecondOperand = false;
    this.pastOperation = '';
    this.currentOperation = '';
    this.myStorage = localStorage;
    this.motion();

    this.listenClass('calculator__keyboard-button--number', this.insert);
    this.listenClass('operationButton', this.operation);
    this.listenClass('cleanButton', this.clean);
    this.listenClass('resultButton', this.calculateResult);

    this.listenId('sqrt', this.sqrt);
    this.listenId('fraction', this.fraction);
    this.listenId('change', this.change);
    this.listenId('percent', this.percent);
    this.listenId('comma', this.comma);
  }

  listenClass = (classSelector, nameMethod) => {
    [...document.getElementsByClassName(classSelector)].forEach(el => {
      el.addEventListener('click', nameMethod);
    });
  };

  listenId = (IdSelector, nameMethod) => {
    document.getElementById(IdSelector).addEventListener('click', nameMethod);
  };

  calculateResult = () => {
    let resultOperation = 0;
    
    const firstOperand = this.tempStorage.getTempStoreForFirstOperand();
    const tempSecondOperand = this.tempStorage.getTempStoreForSecondOperand(); 
    const secondOperand = tempSecondOperand ? tempSecondOperand : +this.display.getDisplayValue();

    switch(this.pastOperation){
      case operations.PLUS: 
          resultOperation = this.sum(firstOperand, secondOperand);
          break;
    }

    this.display.setDisplayValue(resultOperation);

    this.tempStorage.setTempStoreForFirstOperand(resultOperation);
    this.tempStorage.setTempStoreForSecondOperand(secondOperand);
  };

  insert = event => {
    const number = Number(event.target.textContent);
    
    if (isNaN(number)){
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

  operation = ({target}) => {
    this.currentOperation = target.textContent;
    this.pastOperation = this.currentOperation;
    this.tempStorage.setTempStoreForFirstOperand(this.display.getDisplayValue());
  };

  sum(first, second){
    return first + second;
  }

  divide(first, second){
    return first / second;
  }

  multyply(first, second){
    return first * second;
  }

  subtract(first, second){
    return first - second;
  }

  pow(first, second){
    return Math.pow(first, second);
  }

  clean = ({target}) => {
    const {textContent} = target;

    this.currentOperation = '';
    this.pastOperation = '';

    const displayText = this.display.getDisplayValue();

    if(displayText === '0'){
      return;
    }

    if(textContent === cleaningButtons.REMOVE_LAST_SYMBOL){
      const resultText = displayText.length > 1 ?  displayText.slice(0, -1) : 0;

      this.display.setDisplayValue(resultText);
      return;
    }
    this.display.setDisplayValue(0);

  };

  change = () => {
    if (this.display.display.value > '0') {
      this.display.display.value = -this.display.display.value;
      this.hid.hidden.value = this.display.display.value;
    } else {
      this.display.display.value = -this.display.display.value;
      this.hid.hidden.value = this.display.display.value;
    }
  };

  fraction = () => {
    let round = 0;

    this.arh.archive.value = '1' + '/' + '(' + this.display.display.value + ')';

    this.display.display.value = 1 / this.display.display.value;

    round = +this.display.display.value;

    this.display.display.value = +round.toFixed(3);
  };

  sqrt = () => {
    let round = 0;
    this.arh.archive.value = 'SQRT' + '(' + this.display.display.value + ')';

    this.display.display.value = Math.sqrt(this.display.display.value);

    round = +this.display.display.value;

    this.display.display.value = +round.toFixed(2);
  };

  percent = () => {
    let z = this.arh.archive.value.split(/[\+\×\-\÷]/);

    let g = this.arh.archive.value.match(/[\+\×\-\÷]/);

    this.display.display.value = (z[0] * this.display.display.value) / 100;

    this.arh.archive.value = z[0] + g[0] + this.display.display.value;
    this.hid.hidden.value = this.display.display.value;
  };

  comma = () => {
    let localComma = this.display.display.value;

    if (this.isSecondOperand) {
      localComma = '0.';
      this.isSecondOperand = false;
    } else {
      if (localComma.indexOf('.') === -1) {
        localComma += '.';
      }
    }
    this.display.display.value = localComma;
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

    this.onDragEnd = function(dragObject, dropElem) {};
    this.onDragCancel = function(dragObject) {};

    let getCoords = elem => {
      let box = elem.getBoundingClientRect();

      return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
      };
    };
  }
}

export default Calculator;
