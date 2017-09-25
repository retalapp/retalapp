const url            = require('url');
const qs             = require('querystring');

class Paging {

  constructor() {
    this.perPage = 10;
    this.req = true;
    this.res = true;
  }

  api(paging) {
    paging.first = this.firstUrl(this.req, paging);
    paging.preview = this.previewUrl(this.req, paging);
    paging.next = this.nextUrl(this.req, paging);
    paging.last = this.lastUrl(this.req, paging);
    return paging;
  }

  show(paging) {
    if(paging.total <= paging.perPage) return '';

    let params = qs.parse(url.parse(this.req.url).query) || {};
    let str = '';
    let wrapper = '';

    wrapper += '<div class="box-footer clearfix text-center">';
    wrapper += '<ul class="pagination no-margin">';

    params.page = 1;
    let clas = paging.page == 1 ? "active" : "no";

    str += '<li class="'+clas+'"><a href="?'+qs.stringify(params)+'">«</a></li>';
    for (var p = 1; p <= paging.pages; p++) {
      params.page = p;
      clas = paging.page == p ? "active" : "no";
      str += '<li class="'+clas+'"><a href="?'+qs.stringify(params)+'">'+ p +'</a></li>';
    }
    params.page = --p;
    clas = paging.page == params.page ? "active" : "no";
    str += '<li class="'+clas+'"><a href="?'+qs.stringify(params)+'">»</a></li>';

    wrapper += str;
    wrapper +='</ul>';
    wrapper +='</div>';

    return wrapper;
  }

  previewUrl(paging) {
    if (paging.page <= 1) return null;
    
    let params = qs.parse(url.parse(this.req.url).query);
    let page = paging.page;

    params.page = --page ;
    return this.req.protocol + '://' + this.req.get('host') + this.req.baseUrl + this.req.path + '?' + qs.stringify(params);
  }

  nextUrl(paging) {
    if(paging.page >= paging.pages) return null;

    let page = paging.page;
    let params = qs.parse(url.parse(this.req.url).query);

    params.page = ++page;
    return this.req.protocol + '://' + this.req.get('host') + this.req.baseUrl + this.req.path + '?' + qs.stringify(params);
  }
  
  firstUrl(paging) {
    let params = qs.parse(url.parse(this.req.url).query);
    params.page = 1;
    return this.req.protocol + '://' + this.req.get('host') + this.req.baseUrl + this.req.path + '?' + qs.stringify(params);
  }

  lastUrl(paging) {
    let params = qs.parse(url.parse(this.req.url).query);
    params.page = paging.pages;
    return this.req.protocol + '://' + this.req.get('host') + this.req.baseUrl + this.req.path + '?' + qs.stringify(params);
  }
}
Paging.__configurable = true;
module.exports = Paging;