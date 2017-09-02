const express = require('express');
class Assets {
  constructor() {
    this.__keys = {};
    this.static = express();
    this.port = 2223;
    this.host = 'http://localhost';
    this.baseUrl = this.host;
  }

  init() {
    if(this.port) {
      this.baseUrl = this.host + ':' + this.port;
    } else {
      this.baseUrl = this.host;
    }

    this.static.use(function(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'X-Requested-With');
      next();
    });
  }

  publish(key, urlTarget, pathToPublish) {
    this.__keys[key] = {
      urlTarget: urlTarget,
      pathToPublish: pathToPublish
    };

    if(!urlTarget) {
      return this.static.use(express.static(pathToPublish));
    }
    return this.static.use(urlTarget, express.static(pathToPublish));
  }

  // Get assets urls
  get(key) {
    if(this.__keys[key]) {
      if(this.__keys[key].urlTarget)
        return this.baseUrl + this.__keys[key].urlTarget;
    }
    return this.baseUrl;
  }

  // Get assets urls
  theme(key) {
    return this.get(key);
  }

  // Publish the assets to final host
  run() {
    this.static.set('port', this.port);

    const server = this.static.listen(this.port, () => {
      console.log(require('lang').t('Static server listening on port') + ' ' + server.address().port);
    });
  }
}
Assets.__configurable = true
module.exports = Assets