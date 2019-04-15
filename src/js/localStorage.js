class LocalStor {
  constructor() {
    this.position();
  }
  position() {
    let returnObj = JSON.parse(localStorage.getItem('pos'));
    this.coords = {
      width: document.querySelector('.calculator').style.top,
      height: document.querySelector('.calculator').style.left
    };
  }
}
export default LocalStor;
