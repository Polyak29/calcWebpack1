class LocalStor {
  constructor() {
    this.position();
  }
  position() {
    let returnObj = JSON.parse(localStorage.getItem('pos'));
    console.log(returnObj);
    this.coords = {
      width: document.querySelector('.calculator').style.top,
      height: document.querySelector('.calculator').style.left
    };
    console.log(this.coords);
  }
}
export default LocalStor;
