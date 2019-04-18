class TempStorage {
  constructor() {
    this._tempStoreForFirstOperand = '';
    this._tempStoreForSecondOperand = '';
  }

  set firstOperand(value) {
    this._tempStoreForFirstOperand = +value;
  }

  get firstOperand() {
    return +this._tempStoreForFirstOperand;
  }

  set secondOperand(value) {
    this._tempStoreForSecondOperand = +value;
  }

  get secondOperand() {
    return +this._tempStoreForSecondOperand;
  }
}

export default TempStorage;
