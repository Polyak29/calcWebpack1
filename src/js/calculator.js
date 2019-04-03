import Memory from './Memory';
import Display from './display';
class Calculator {
    constructor() {
        // this.insert = this.insert.bind(this)   
        this.disp = new Display(this.display);
        this.arh = new Display(this.archive);
        this.hid = new Display(this.hidden);
        this.hid2 = new Display(this.hidden2);
        this.CurrentNumber = 0;
        this.newNumber = false;
        this.pendingOperation = '';
        this.wrap = document.querySelector('.calculator');
        this.myStorage = localStorage;

        function listenClass(classSelector,nameMethod){
            [...document.getElementsByClassName(classSelector)].forEach(el =>{
                el.addEventListener('click', nameMethod);
            })
        };
        listenClass('calculator__keyboard-button--number', this.insert);
        listenClass('operationButton', this.calculation);
        listenClass('cleanButton', this.clean);

        function listenId(IdSelector, nameMethod) {
            document.getElementById(IdSelector).addEventListener('click', nameMethod);
        };
        listenId('sqrt', this.sqrt);
        listenId('fraction', this.fraction);
        listenId('change', this.change);
        listenId('percent', this.percent);
        listenId('comma', this.comma);
        
    };

    insert = (event) => {
        let number = event.target.textContent;
        if (this.newNumber) {
            this.disp.display.value = number;
            this.newNumber = false;
        } else {
            if (this.disp.display.value === '0'){
                this.disp.display.value = number;
            } else {
                this.disp.display.value += number;
            }
        }
    }


    calculation = (event) => {
        let operation = event.target.textContent;
        let localOperation = +this.disp.display.value;
        let localHidden = +this.hid.hidden.value;
        let localSign = this.hid2.hidden2.value;
        let localArchive = this.arh.archive.value.split(/[\+\*\-\/]/);
        let round = 0;
        
        
        if(this.newNumber && this.pendingOperation === '=') {
            if(localSign.search(/[\+\*\/\-]/) !== '-1' && operation !== '=') {
                localSign = operation;
                this.hid2.hidden2.value = localSign;
            } else {
            this.CurrentNumber = eval(this.CurrentNumber + localSign + localHidden);
            }
        } else if (this.newNumber && this.pendingOperation !== '=' && operation === '='){
            this.disp.display.value += localOperation; 

        }  else if (this.newNumber && this.pendingOperation !== '=') {
            this.disp.display.value = this.CurrentNumber;
            this.hid.hidden.value = this.CurrentNumber;

        } else {
            this.newNumber = true;
            switch(this.pendingOperation) {
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
                    this.CurrentNumber = Math.pow(this.CurrentNumber, localOperation)
                    break;
                case '':
                    this.CurrentNumber = localOperation;
            }
        }
     
            this.pendingOperation =  operation;
            round = +this.CurrentNumber;
            this.disp.display.value = +round.toFixed(2); 
            if (this.pendingOperation !== '='){
                if (localArchive[0] === this.disp.display.value || localArchive[localArchive.length - 2] === this.disp.display.value) {
                    this.arh.archive.value = this.arh.archive.value;
                } else
                this.arh.archive.value += localOperation + this.pendingOperation;
            } else {
                this.arh.archive.value = '';
                this.disp.display.value += localOperation; 
            }
        
    }

    clean = (event) => {
        if(event.target.textContent === 'C') {
            this.disp.display.value = '0';
            this.arh.archive.value = '';
            this.hid.hidden.value = '';
            this.CurrentNumber = 0;
            this.pendingOperation = '';
        } else if(event.target.textContent === 'CE') {
            this.disp.display.value = '0';
        } else {
            if(this.disp.display.value.slice(0, -1) === '') {
                this.disp.display.value = '0';
            } else
            this.disp.display.value = this.disp.display.value.slice(0, -1);
        }
    }

    change = () => {
        if(this.disp.display.value > '0') {
            this.disp.display.value = -this.disp.display.value;
            this.hid.hidden.value = this.disp.display.value;
        } else {
            this.disp.display.value = -this.disp.display.value;
            this.hid.hidden.value = display.value;
        }
    }

    fraction = () => {
        let round = 0;
    
        this.arh.archive.value = '1' + '/' + '(' + this.disp.display.value + ')'; 
    
        this.disp.display.value = 1 / this.disp.display.value;
    
        round = +this.disp.display.value;
        
        this.disp.display.value = +round.toFixed(3);
    }

    sqrt = () => {
        let round = 0;
        this.arh.archive.value = 'SQRT' + '(' + this.disp.display.value + ')';
    
        this.disp.display.value = Math.sqrt(this.disp.display.value);
    
        round = +this.disp.display.value;
    
        this.disp.display.value = +round.toFixed(2);
    }

    percent = () => {
        z = this.arh.archive.value.split(/[\+\×\-\÷]/);
    
        g = this.arh.archive.value.match(/[\+\×\-\÷]/);
        
        this.disp.display.value = z[0] * this.disp.display.value / 100;
    
        this.arh.archive.value = z[0] + g[0] + this.disp.display.value;
        this.hid.hidden.value = this.disp.display.value;
    }

    comma = () => {
        let localComma = this.disp.display.value;
     
        if (this.newNumber) {
            localComma = '0.'
            this.newNumber = false;
        } else {
            if ( localComma.indexOf('.') === -1 ) {
                localComma += '.'
            };
        };
        this.disp.display.value = localComma;
    }

    motion = () => {
        this.wrap.onmousedown = function(e) { // 1. отследить нажатие
            console.log(this.wrap);
            // подготовить к перемещению
            // 2. разместить на том же месте, но в абсолютных координатах
            this.wrap.style.position = 'absolute';
            moveAt(e);
            // переместим в body, чтобы мяч был точно не внутри position:relative
            document.body.appendChild(this.wrap);
          
            this.wrap.style.zIndex = 1000; // показывать мяч над другими элементами
          
            // передвинуть мяч под координаты курсора
            // и сдвинуть на половину ширины/высоты для центрирования
            function moveAt(e) {
              this.wrap.style.left = e.pageX - this.wrap.offsetWidth / 2 + 'px';
              this.wrap.style.top = e.pageY - this.wrap.offsetHeight / 2 + 'px';
            }
            this.wrap.ondragstart = function() {
                return false;
              };
          
            // 3, перемещать по экрану
            document.onmousemove = function(e) {
              moveAt(e);
            }
          
            // 4. отследить окончание переноса
            this.wrap.onmouseup = function() {
              document.onmousemove = null;
              this.wrap.onmouseup = null;
            }
          }
    }
   
}

export default Calculator;


