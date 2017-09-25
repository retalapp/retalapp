const url = require('url');
const qs = require('querystring');

class Href {

  constructor() {
    this.req = true;
  }
  
  go(urlPath, params, absolute) {
    
    let query = '';
    let baseUrl = '';

    if (absolute)
      baseUrl = this.req.protocol + '://' + this.req.get('host');
    if (params)
      query = '?' + qs.stringify(params);
    if (!urlPath)
      return baseUrl + url.parse(this.req.baseUrl + this.req.path).pathname + query;
    if (urlPath[0] === '/')
      return baseUrl + urlPath + query;
    return baseUrl + url.parse(this.req.baseUrl + this.req.path).pathname + '/' + urlPath + query;
  }

  goFull(url, params) {
    return this.go(this.req, url, params, true);
  }

  sort(by) {
    let params = qs.parse(url.parse(this.req.url).query);

    if (params.sort) {
      params.sort = params.sort === 'desc' ? 'asc' : 'desc';
    } else {
      params.sort = 'desc';
    }
    params.by = by;
    return '?'+qs.stringify(params);
  }
  
}
Href.__configurable = true;
module.exports = Href;