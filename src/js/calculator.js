import Memory from './Memory';


let archive = document.querySelector('.calculator__display-input--shadow');
let hidden = document.querySelector('.calculator__display-input--hidden');
let hidden2 = document.querySelector('.calculator__display-input--hidden2');
let CurrentNumber = 0;
let newNumber = false;
let pendingOperation = '';
let memory = document.getElementsByClassName('calculator__display-input--memory')[0];


class Calculator {
    constructor() {
        // this.insert = this.insert.bind(this)   
        this.display = document.querySelector('.calculator__display-input--size');
        this.archive = document.querySelector('.calculator__display-input--shadow');
        this.hidden = document.querySelector('.calculator__display-input--hidden');
        this.hidden2 = document.querySelector('.calculator__display-input--hidden2');
        this.CurrentNumber = 0;
        this.newNumber = false;
        this.pendingOperation = '';
        this.memory = document.getElementsByClassName('calculator__display-input--memory')[0];

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
            this.display.value = number;
            this.newNumber = false;
        } else {
            if (this.display.value === '0'){
                this.display.value = number;
            } else {
                this.display.value += number;
            }
        }
       
    }


    calculation = (event) => {
        let operation = event.target.textContent;
        let localOperation = +this.display.value;
        let localHidden = +this.hidden.value;
        let localSign = this.hidden2.value;
        let localArchive = this.archive.value.split(/[\+\*\-\/]/);
        let round = 0;
        localArchive[0] = localArchive[0].trim();
        
        
        if(this.newNumber && this.pendingOperation === '=') {
            if(localSign.search(/[\+\*\/\-]/) !== '-1' && operation !== '=') {
                localSign = operation;
                this.hidden2.value = localSign;
            } else {
            this.CurrentNumber = eval(this.CurrentNumber + localSign + localHidden);
            }
        } else if (newNumber && pendingOperation !== '=') {
            this.display.value = this.CurrentNumber;
            this.hidden.value = this.CurrentNumber;
        }
        else {
            this.newNumber = true;
            switch(this.pendingOperation) {
                case '+':
                    this.CurrentNumber = this.CurrentNumber + +localOperation;
                    this.hidden2.value = pendingOperation;
                    this.hidden.value = localOperation;
                break;
                case '×':
                    this.CurrentNumber = this.CurrentNumber * +localOperation;
                    this.hidden2.value = '*';
                    this.hidden.value = localOperation;
                    break;
                case '÷':
                    this.CurrentNumber = this.CurrentNumber / +localOperation;
                    this.hidden2.value = '/';
                    this.hidden.value = localOperation;
                    break;
                case '-':
                    this.CurrentNumber = this.CurrentNumber - +localOperation;
                    this.hidden2.value = pendingOperation;
                    this.hidden.value = localOperation;
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
            this.display.value = +round.toFixed(2); 
            if (this.pendingOperation !== '='){
                if (localArchive[0] === this.display.value || localArchive[localArchive.length - 2] === this.display.value) {
                    this.archive.value = this.archive.value;
                } else
                this.archive.value += localOperation + this.pendingOperation;
            } else this.archive.value = '';
    }

    clean = (event) => {
        if(event.target.textContent === 'C') {
            this.display.value = '0';
            this.archive.value = '';
            this.hidden.value = '';
            this.CurrentNumber = 0;
            this.pendingOperation = '';
        } else if(event.target.textContent === 'CE') {
            this.display.value = '0';
        } else {
            if(this.display.value.slice(0, -1) === '') {
                this.display.value = '0';
            } else
            this.display.value = this.display.value.slice(0, -1);
        }
    }

    change = () => {
        if(this.display.value > '0') {
            this.display.value = -this.display.value;
            this.hidden.value = this.display.value;
        } else {
            this.display.value = -this.display.value;
            this.hidden.value = display.value;
        }
    }

    fraction = () => {
        let round = 0;
    
        this.archive.value = '1' + '/' + '(' + this.display.value + ')'; 
    
        this.display.value = 1 / this.display.value;
    
        round = +this.display.value;
        
        this.display.value = +round.toFixed(3);
    }

    sqrt = () => {
        let round = 0;
        this.archive.value = 'SQRT' + '(' + this.display.value + ')';
    
        this.display.value = Math.sqrt(this.display.value);
    
        round = +this.display.value;
    
        this.display.value = +round.toFixed(2);
    }

    percent = () => {
        z = this.archive.value.split(/[\+\×\-\÷]/);
    
        g = this.archive.value.match(/[\+\×\-\÷]/);
        
        this.display.value = z[0] * this.display.value / 100;
    
        this.archive.value = z[0] + g[0] + this.display.value;
        this.hidden.value = this.display.value;
    }

    comma = () => {
        let localComma = this.display.value;
     
        if (this.newNumber) {
            localComma = '0.'
            this.newNumber = false;
        } else {
            if ( localComma.indexOf('.') === -1 ) {
                localComma += '.'
            };
        };
        this.display.value = localComma;
    }
   
}

export {Calculator, Memory};


