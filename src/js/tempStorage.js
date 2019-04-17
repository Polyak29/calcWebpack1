class TempStorage {
  constructor() {
    this._tempStoreForFirstOperand = '';
    this._tempStoreForSecondOperand = '';
  }

  set setFirstOperand(value) {
    this._tempStoreForFirstOperand = +value;
  }

  get firstOperand() {
    return +this._tempStoreForFirstOperand;
  }

  set setSecondOperand(value) {
    this._tempStoreForSecondOperand = +value;
  }

  get secondOperand() {
    return +this._tempStoreForSecondOperand;
  }
}

export default TempStorage;
