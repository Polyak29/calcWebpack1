class LocalStor {
  constructor(name, version) {
    this.key = `${name}_${version}`;
  }

  set coordinatesStore(obj) {
    localStorage.setItem(this.key, JSON.stringify(obj));
  }

  get coordinatesStore() {
    return JSON.parse(localStorage.getItem(this.key));
  }
}
export default LocalStor;
