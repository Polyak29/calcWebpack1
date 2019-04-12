import Memory from './Memory';
import Display from './display';
import OnOff from './startCalc';
import LocalStor from './localStorage';

// new Memory();
new OnOff();
class Calculator {
  constructor() {
    this.display = document.querySelector('.calculator__display-input--size');
    this.archive = document.querySelector('.calculator__display-input--shadow');
    this.memory = document.querySelector('.calculator__display-input--memory');
    this.hidden = document.querySelector('.calculator__display-input--hidden');
    this.hidden2 = document.querySelector(
      '.calculator__display-input--hidden2'
    );
    this.disp = new Display();
    this.CurrentNumber = 0;
    this.newNumber = false;
    this.pendingOperation = '';
    this.myStorage = localStorage;
    this.motion();

    this.listenClass('calculator__keyboard-button--number', this.insert);
    this.listenClass('operationButton', this.calculation);
    this.listenClass('cleanButton', this.clean);

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

  insert = event => {
    this.number = event.target.textContent;
    if (!this.newNumber) {
      return () => {
        this.newNumber = true;
        this.display.value = this.number;
      };
    }
    if (!this.display.value === '0') {
      return () => {
        this.display.value = this.number;
      };
    }
  };

  calculation = event => {
    let operation = event.target.textContent;
    let localOperation = +this.disp.display.value;
    let localHidden = +this.hid.hidden.value;
    let localSign = this.hid2.hidden2.value;
    let localArchive = this.arh.archive.value.split(/[\+\*\-\/]/);
    let round = 0;

    if (this.newNumber && this.pendingOperation === '=') {
      if (localSign.search(/[\+\*\/\-]/) !== '-1' && operation !== '=') {
        localSign = operation;
        this.hid2.hidden2.value = localSign;
      } else {
        this.CurrentNumber = eval(this.CurrentNumber + localSign + localHidden);
      }
    } else if (
      this.newNumber &&
      this.pendingOperation !== '=' &&
      operation === '='
    ) {
      this.disp.display.value += localOperation;
    } else if (this.newNumber && this.pendingOperation !== '=') {
      this.disp.display.value = this.CurrentNumber;
      this.hid.hidden.value = this.CurrentNumber;
    } else {
      this.newNumber = true;
      switch (this.pendingOperation) {
        case '+':
          this.CurrentNumber = this.CurrentNumber + +localOperation;
          this.hid2.hidden2.value = this.pendingOperation;
          this.hid.hidden.value = localOperation;
          break;
        case '×':
          this.CurrentNumber = this.CurrentNumber * +localOperation;
          this.hid2.hidden2.value = '*';
          this.hid.hidden.value = localOperation;
          break;
        case '÷':
          this.CurrentNumber = this.CurrentNumber / +localOperation;
          this.hid2.hidden2.value = '/';
          this.hid.hidden.value = localOperation;
          break;
        case '-':
          this.CurrentNumber = this.CurrentNumber - +localOperation;
          this.hid2.hidden2.value = this.pendingOperation;
          this.hid.hidden.value = localOperation;
          break;
        case 'x n':
          this.CurrentNumber = Math.pow(this.CurrentNumber, localOperation);
          break;
        case '':
          this.CurrentNumber = localOperation;
      }
    }

    this.pendingOperation = operation;
    round = +this.CurrentNumber;
    this.disp.display.value = +round.toFixed(2);
    if (this.pendingOperation !== '=') {
      if (
        localArchive[0] === this.disp.display.value ||
        localArchive[localArchive.length - 2] === this.disp.display.value
      ) {
        this.arh.archive.value = this.arh.archive.value;
      } else this.arh.archive.value += localOperation + this.pendingOperation;
    } else {
      this.arh.archive.value = '';
      this.disp.display.value += localOperation;
    }
  };

  clean = event => {
    if (event.target.textContent === 'C') {
      this.disp.display.value = '0';
      this.arh.archive.value = '';
      this.hid.hidden.value = '';
      this.CurrentNumber = 0;
      this.pendingOperation = '';
    } else if (event.target.textContent === 'CE') {
      this.disp.display.value = '0';
    } else {
      if (this.disp.display.value.slice(0, -1) === '') {
        this.disp.display.value = '0';
      } else this.disp.display.value = this.disp.display.value.slice(0, -1);
    }
  };

  change = () => {
    if (this.disp.display.value > '0') {
      this.disp.display.value = -this.disp.display.value;
      this.hid.hidden.value = this.disp.display.value;
    } else {
      this.disp.display.value = -this.disp.display.value;
      this.hid.hidden.value = this.disp.display.value;
    }
  };

  fraction = () => {
    let round = 0;

    this.arh.archive.value = '1' + '/' + '(' + this.disp.display.value + ')';

    this.disp.display.value = 1 / this.disp.display.value;

    round = +this.disp.display.value;

    this.disp.display.value = +round.toFixed(3);
  };

  sqrt = () => {
    let round = 0;
    this.arh.archive.value = 'SQRT' + '(' + this.disp.display.value + ')';

    this.disp.display.value = Math.sqrt(this.disp.display.value);

    round = +this.disp.display.value;

    this.disp.display.value = +round.toFixed(2);
  };

  percent = () => {
    let z = this.arh.archive.value.split(/[\+\×\-\÷]/);

    let g = this.arh.archive.value.match(/[\+\×\-\÷]/);

    this.disp.display.value = (z[0] * this.disp.display.value) / 100;

    this.arh.archive.value = z[0] + g[0] + this.disp.display.value;
    this.hid.hidden.value = this.disp.display.value;
  };

  comma = () => {
    let localComma = this.disp.display.value;

    if (this.newNumber) {
      localComma = '0.';
      this.newNumber = false;
    } else {
      if (localComma.indexOf('.') === -1) {
        localComma += '.';
      }
    }
    this.disp.display.value = localComma;
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
