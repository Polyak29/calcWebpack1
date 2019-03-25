import Memory from './Memory';

let display = document.querySelector('.calculator__display-input--size');
let archive = document.querySelector('.calculator__display-input--shadow');
let hidden = document.querySelector('.calculator__display-input--hidden');
let hidden2 = document.querySelector('.calculator__display-input--hidden2');
let CurrentNumber = 0;
let newNumber = false;
let pendingOperation = '';
let memory = document.getElementsByClassName('calculator__display-input--memory')[0];


class Calculator {
    constructor() {
        [...document.getElementsByClassName('calculator__keyboard-button--number')].forEach(el =>{
            el.addEventListener('click', this.insert);
        });
        
        [...document.getElementsByClassName('operationButton')].forEach(el =>{
            el.addEventListener('click', this.calculation);
            });
       
        [...document.getElementsByClassName('cleanButton')].forEach(el =>{
            el.addEventListener('click', this.clean);
        });

        document.getElementById('sqrt').addEventListener('click', this.sqrt);
        document.getElementById('fraction').addEventListener('click', this.fraction);
        document.getElementById('change').addEventListener('click', this.change);
        document.getElementById('percent').addEventListener('click', this.percent);
        document.getElementById('comma').addEventListener('click', this.comma);
        
    };

    
    insert(event) {
        let number = event.target.textContent;
        if (newNumber) {
            display.value = number;
            newNumber = false;
        } else {
            if (display.value === '0'){
                display.value = number;
            } else {
                display.value += number;
            }
        }
       
    }


    calculation(op) {
        let operation = op.target.textContent;
        let localOperation = +display.value;
        let localHidden = +hidden.value;
        let localSign = hidden2.value;
        let localArchive = archive.value.split(/[\+\*\-\/]/);
        let round = 0;
        localArchive[0] = localArchive[0].trim();
        
        
        if(newNumber && pendingOperation === '=') {
            if(localSign.search(/[\+\*\/\-]/) !== '-1' && operation !== '=') {
                localSign = operation;
                hidden2.value = localSign;
            } else {
            CurrentNumber = eval(CurrentNumber + localSign + localHidden);
            }
        } else if (newNumber && pendingOperation !== '=') {
            display.value = CurrentNumber;
            hidden.value = CurrentNumber;
        }
        else {
            newNumber = true;
            switch(pendingOperation) {
                case '+':
                    CurrentNumber = CurrentNumber + +localOperation;
                    hidden2.value = pendingOperation;
                    hidden.value = localOperation;
                break;
                case '×':
                    CurrentNumber = CurrentNumber * +localOperation;
                    hidden2.value = '*';
                    hidden.value = localOperation;
                    break;
                case '÷':
                    CurrentNumber = CurrentNumber / +localOperation;
                    hidden2.value = '/';
                    hidden.value = localOperation;
                    break;
                case '-':
                    CurrentNumber = CurrentNumber - +localOperation;
                    hidden2.value = pendingOperation;
                    hidden.value = localOperation;
                    break;
                case 'x n':
                    CurrentNumber = Math.pow(CurrentNumber, localOperation)
                    break;
                case '':
                    CurrentNumber = localOperation;
            }
        }
     
            pendingOperation =  operation;
            round = +CurrentNumber;
            display.value = +round.toFixed(2); 
            if (pendingOperation !== '='){
                if (localArchive[0] === display.value || localArchive[localArchive.length - 2] === display.value) {
                    archive.value = archive.value;
                } else
                archive.value += localOperation + pendingOperation;
            } else archive.value = '';
    }

    clean(del) {
        if(del.target.textContent === 'C') {
            display.value = '0';
            archive.value = '';
            hidden.value = '';
            CurrentNumber = 0;
            pendingOperation = '';
        } else if(del.target.textContent === 'CE') {
            display.value = '0';
        } else {
            if(display.value.slice(0, -1) === '') {
                display.value = '0';
            } else
            display.value = display.value.slice(0, -1);
        }
    }

    change() {
        if(display.value > '0') {
            display.value = -display.value;
            hidden.value = display.value;
        } else {
            display.value = -display.value;
            hidden.value = display.value;
        }
    }

    fraction() {
        let round = 0;
    
        archive.value = '1' + '/' + '(' + display.value + ')'; 
    
        display.value = 1 / display.value;
    
        round = +display.value;
        
        display.value = +round.toFixed(3);
    }

    sqrt() {
        let round = 0;
        archive.value = 'SQRT' + '(' + display.value + ')';
    
        display.value = Math.sqrt(display.value);
    
        round = +display.value;
    
        display.value = +round.toFixed(2);
    }

    percent = function() {
        z = archive.value.split(/[\+\×\-\÷]/);
    
        g = archive.value.match(/[\+\×\-\÷]/);
        
        display.value = z[0] * display.value / 100;
    
        archive.value = z[0] + g[0] + display.value;
        hidden.value = display.value;
    }

    comma() {
        let localComma = display.value;
     
        if (newNumber) {
            localComma = '0.'
            newNumber = false;
        } else {
            if ( localComma.indexOf('.') === -1 ) {
                localComma += '.'
            };
        };
        display.value = localComma;
    }
   
}
new Calculator();
new Memory();
export {Calculator, Memory};


