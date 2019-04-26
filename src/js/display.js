class Display {
    constructor()
    {
        this._value = 0;
    }

    init($selector = null) {
        if ($selector === null) {
            return;
        }
        this._display = $selector.querySelector('.calculator__display-input--size');
        this._archive = $selector.querySelector('.calculator__display-input--shadow');
        this._memory = $selector.querySelector('.memory-list');
    }

    set memory(value) {
        this._memory.value= value;
    }

    get memory() {
        return +this._memory.value;
    }

    set archive(value) {
        this._archive.value = value;
    }

    get archive() {
       return this._archive.value;
    }

    set value(value) {
        this._display.value = this.numberParsing(value);
        this._value = value;
    }

    get value() {
        return this._value;
    }



    numberParsing = (variabel) =>{
        let number = Number(variabel);
        let formater = new Intl.NumberFormat('ru');
        return formater.format(number); 
    };

    get template() {
        return  `
            <div class="calculator__display">
                <div class="calculator__display-types types">
                <div class="types__btn">≡ </div>
                <div class="types__name"> Standard </div>
                </div>
                <div class="calculator__display-input" data-value="">
                <input class="calculator__display-input--shadow" type="text" value="" pattern="^[ 0-9]+$" disabled="disabled" />
                <input class="calculator__display-input--size" type="text" value="0" pattern="^[ 0-9]+$" disabled="disabled" />
                <input class="calculator__display-input--hidden" type="hidden" pattern="^[ 0-9]+$" disabled="disabled" />
                <input class="calculator__display-input--hidden2" type="hidden" pattern="^[ 0-9]+$" disabled="disabled" />
                <input class="calculator__display-input--memory" type="text" value="" pattern="^[ 0-9]+$" disabled="disabled" />
                </div>
            </div>
        `;
    }
}

export default Display;
