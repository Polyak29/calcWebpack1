class Display {
    constructor() {
        this._display = document.querySelector('.calculator__display-input--size');
        this.archiveValue = document.querySelector('.calculator__display-input--shadow');
        this._memory = document.querySelector('.calculator__display-input--memory');
    }
    setDisplayValue(newValue) {
        this._display.value = newValue;
    }
    getDisplayValue() {
        return this._display.value;
    }

    setMemoryValue(newValue) {
        this._memory.value = newValue;
    }

    getMemoryValue() {
        return this._memory.value;
    }

}

export default Display;
