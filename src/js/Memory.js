let display = document.querySelector('.calculator__display-input--size');
let archive = document.querySelector('.calculator__display-input--shadow');
let hidden = document.querySelector('.calculator__display-input--hidden');
let hidden2 = document.querySelector('.calculator__display-input--hidden2');
let CurrentNumber = 0;
let newNumber = false;
let pendingOperation = '';
let memory = document.getElementsByClassName('calculator__display-input--memory')[0];
let memory = document.getElementsByClassName('calculator__display-input--memory')[0];
class Memory {
    constructor () {
        [...document.getElementsByClassName('memory-calculator__operations--size')].forEach(el =>{
            el.addEventListener('click', this.memory);
        });
    }

    memory(event) {
        switch(event.target.textContent) {
            case 'MC':
            memory.value = '';
            break;

            case 'MR':
            if (memory.value == '') {
                display.value = '0';
            } else {
                display.value = memory.value;
            }
            break;

            case 'M+':
            if (display.value == '0' || '') {
                memory.value = memory.value;
            } else {
                memory.value = +display.value + +memory.value
            }
            break;

            case 'M-':
            if (display.value == '0' || '') {
                memory.value = memory.value;
            } else {
                memory.value = +memory.value  -  +display.value
            }
            break;

            case 'MS':
            if (display.value == '0' || '') {
                memory.value = memory.value;
            } else {
                memory.value = display.value;
            }
            break;

            case 'M':
            break;
        }
    } 
}

export default Memory;