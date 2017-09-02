
class Db {
  constructor() {
    this.connect = '';
    this.adapter = require('mongoose');
  }

  init() {
    this.adapter.Promise = global.Promise;
    this.adapter.connect(this.connect);
  }
}
Db.__configurable = true
module.exports = Db
