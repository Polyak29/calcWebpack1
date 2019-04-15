export const operations = {
  PLUS: '+',
  MINUS: '-',
  MULTIPLY: '*',
  DIVIDE: '/',
  POW: '^',
  FRAC: 'fraction',
  RESULT: '=',
  SQRT: 'sqrt',
  PERCENT: 'percent',
  CHANGE: 'change',
  COMMA: '.'
};

export const cleaningButtons = {
  CLEAN_ELEMENT: 'CE',
  CLEAN: 'C',
  REMOVE_LAST_SYMBOL: '⇐'
};

export const memoryButtons = {
  MEMORY_SAVE: 'MS',
  MEMORY_CLEAR: 'MC',
  MEMORY_PLUS: 'M+',
  MEMORY_SUBSTRUCT: 'M-',
  MEMORY_READ: 'MR',
  MEMORY_LIST: 'M'
};

export const displayVisibility = {
  FLEX: 'flex',
  NONE: 'none'
};

export const minimize = {
  KEYBOARD: document.querySelector('.calculator__keyboard'),
  TYPES: document.querySelector('.types'),
  INPUT: document.querySelector('.calculator__display-input'),
  MEMORY: document.querySelector('.calculator__display-memory')
};

export const resizeCalc = {
  CALC: document.querySelector('.calculator'),
  OPEN: document.querySelector('.openCalc'),
  CLOSE: document.querySelector('.hat__buttons-close'),
  EXPAND: document.querySelector('.hat__buttons-expand'),
  ROLLUP: document.querySelector('.hat__buttons-rollUp')
};
