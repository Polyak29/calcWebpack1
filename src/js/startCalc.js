class OnOff {
  constructor() {
    this.pressing();
  }

  pressing() {
    let rollUp = document.querySelector('.hat__buttons-rollUp'),
      expand = document.querySelector('.hat__buttons-expand'),
      close = document.querySelector('.hat__buttons-close'),
      openCalc = document.querySelector('.openCalc'),
      calc = document.querySelector('.calculator'),
      minimize = {
        keyboard: document.querySelector('.calculator__keyboard'),
        type2: document.querySelector('.types'),
        input: document.querySelector('.calculator__display-input'),
        memory: document.querySelector('.calculator__display-memory')
      };

    openCalc.addEventListener('click', () => {
      calc.style.display = 'flex';
      openCalc.style.display = 'none';
    });

    close.addEventListener('click', () => {
      calc.style.position = 'absolute';
      calc.style.top = '4.5rem';
      calc.style.right = '1rem';
      calc.style.left = 'auto';
      calc.style.display = 'none';
      openCalc.style.display = 'flex';
    });

    rollUp.addEventListener('click', () => {
      Object.entries(minimize).forEach(([key, value]) => {
        value.style.display = 'none';
      });
      expand.classList.toggle('disabled');
      rollUp.classList.toggle('disabled');
    });

    expand.addEventListener('click', () => {
      Object.entries(minimize).forEach(([key, value]) => {
        value.style.display = 'flex';
      });
      expand.classList.toggle('disabled');
      rollUp.classList.toggle('disabled');
    });
  }
}

export default OnOff;
