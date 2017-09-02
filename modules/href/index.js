import url from 'url'
import qs from 'querystring'

class Href {

  constructor() {
    this.req = true
  }
  
  go(url, params, absolute) {
    
    let query = ''
    let baseUrl = ''
    
    if(absolute)
      baseUrl = this.req.protocol + '://' + this.req.get('host')
    if(params)
      query = '?' + qs.stringify(params)
    if(!url)
      return baseUrl + this.req.baseUrl + this.req.path + query
    if(url[0] === '/')
      return baseUrl + url + query
    return baseUrl + this.req.baseUrl + '/' + url + query
  }

  goFull(url, params) {
    return this.go(this.req, url, params, true)
  }

  sort(by) {
    let params = qs.parse(url.parse(this.req.url).query)
    if(params.sort) {
      params.sort = params.sort === 'desc' ? 'asc' : 'desc'
    } else {
      params.sort = 'desc'
    }
    params.by = by
    return '?'+qs.stringify(params)
  }
  
}
Href.__configurable = true
module.exports = Href