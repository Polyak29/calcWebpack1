class TempStorage {
  constructor() {
    this._tempStoreForFirstOperand = '';
    this._tempStoreForSecondOperand = '';
    this._pressedOperation = '';
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

  set pressOperation(value) {
    this._pressedOperation = value;
  }

  get pressOperation() {
    return this._pressedOperation;
  }
}

export default TempStorage;
