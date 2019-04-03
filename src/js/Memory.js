import Display from "./display";

class Memory {
    constructor () {
        this.disp = new Display(this.display);
        this.mem = new Display(this.memory);
        [...document.getElementsByClassName('memory-calculator__operations--size')].forEach(el =>{
            el.addEventListener('click', this.workMemory);
        });
    }

    workMemory = (event) => {
        switch(event.target.textContent) {
            case 'MC':
            this.mem.memory.value = '';
            break;

            case 'MR':
            if (this.mem.memory.value == '') {
                this.disp.display.value= '0';
            } else {
                this.disp.display.value = this.mem.memory.value;
            }
            break;

            case 'M+':
            if (this.disp.display.value == '0' || '') {
                this.mem.memory.value = this.mem.memory.value;
            } else {
                this.mem.memory.value = +this.disp.display.value + +this.mem.memory.value
            }
            break;

            case 'M-':
            if (this.disp.display.value == '0' || '') {
                this.mem.memory.value = this.mem.memory.value;
            } else {
                this.mem.memory.value = +this.mem.memory.value  -  +this.disp.display.value
            }
            break;

            case 'MS':
            if (this.disp.display.value == '0' || '') {
                this.mem.memory.value = this.mem.memory.value;
            } else {
                this.mem.memory.value = this.disp.display.value;
            }
            break;

            case 'M':
            break;
        }
    } 
}

export default Memory;