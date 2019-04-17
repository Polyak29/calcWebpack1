class Display {
    constructor() {
        this._display = document.querySelector('.calculator__display-input--size');
        this.archiveValue = document.querySelector('.calculator__display-input--shadow');
        this._memory = document.querySelector('.calculator__display-input--memory');
    }

    set setMemory(value) {
        this._memory.value = value;
    }

    get memory() {
        return +this._memory.valuye;
    }

    set setValue(value) {
        this._display.value = value;
    }

    get value() {
        return  this._display.value;
    }
    // get template() {
    //     return `
    //     <div class="calculator__display">
    //       <div class="calculator__display-hat hat">
    //         <div class="hat__title">Calculator</div>
    //         <div class="hat__buttons">
    //           <div class="hat__buttons-rollUp"></div>
    //           <div class="hat__buttons-expand disabled"></div>
    //           <div class="hat__buttons-close"></div>
    //         </div>
    //       </div>
    //       <div class="calculator__display-types types">
    //         <div class="types__btn">≡ </div>
    //         <div class="types__name"> Standard </div>
    //       </div>
    //       <div class="calculator__display-input">
    //         <input class="calculator__display-input--shadow" type="text" value="" pattern="^[ 0-9]+$" disabled="disabled" />
    //         <input class="calculator__display-input--size" type="text" value="0" pattern="^[ 0-9]+$" disabled="disabled" />
    //         <input class="calculator__display-input--memory" type="text" value="" pattern="^[ 0-9]+$" disabled="disabled" />
    //       </div>
    //       <div class="calculator__display-memory memory-calculator">
    //       <div class="memory-calculator__operations">
    //         <button class="memory-calculator__operations--size" value="MC">MC</button>
    //       </div>
    //       <div class="memory-calculator__operations">
    //         <button class="memory-calculator__operations--size" value="MR">MR</button>
    //       </div>
    //       <div class="memory-calculator__operations">
    //         <button class="memory-calculator__operations--size" value="M+">M+</button>
    //       </div>
    //       <div class="memory-calculator__operations">
    //         <button class="memory-calculator__operations--size" value="M-">M-</button>
    //       </div>
    //       <div class="memory-calculator__operations">
    //         <button class="memory-calculator__operations--size" value="MS">MS</button>
    //       </div>
    //       <div class="memory-calculator__operations">
    //         <button class="memory-calculator__operations--size" value="M">M</button>
    //       </div>
    //       </div>
    //     </div>
    //     `;
    // }
}

export default Display;
