
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
                this.display.value = '0';
            } else {
                this.display.value = memory.value;
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
            if (this.display.value == '0' || '') {
                memory.value = memory.value;
            } else {
                memory.value = this.display.value;
            }
            break;

            case 'M':
            break;
        }
    } 
}

export default Memory;