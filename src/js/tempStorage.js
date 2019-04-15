class TempStorage {
  constructor() {
    this._tempStoreForFirstOperand = '';
    this._tempStoreForSecondOperand = '';
  }

  setTempStoreForFirstOperand(value) {
    this._tempStoreForFirstOperand = +value;
  }

  getTempStoreForFirstOperand() {
    return +this._tempStoreForFirstOperand;
  }

  setTempStoreForSecondOperand(value) {
    this._tempStoreForSecondOperand = +value;
  }

  getTempStoreForSecondOperand() {
    return +this._tempStoreForSecondOperand;
  }
}

export default TempStorage;
