class Display {
    constructor() {
        this._display = document.querySelector('.calculator__display-input--size');
        this.archiveValue = document.querySelector('.calculator__display-input--shadow');
        this.memory = document.querySelector('.calculator__display-input--memory');
    }
    setDisplayValue(newValue){
        this._display.value = newValue;
    }
    getDisplayValue() {
        return this._display.value;
    }

}

export default Display;
