const _              = require('lodash');
const express        = require('express');
const engine         = require('express-ejs-layouts');
const favicon        = require('serve-favicon');
const cookieParser   = require('cookie-parser');
const cookieSession  = require('cookie-session');
const bodyParser     = require('body-parser');
const methodOverride = require('method-override');
const logger         = require('morgan');
const errorHandler   = require('errorhandler');
const session        = require('express-session');
const path           = require('path');
const fs             = require('fs');

class Retalapp {

  /**
   * Represents the bootstraping retalapp class.
   * In this method we read and set all seteables modules in the app.
   * Redefine require node.js function to proxy all configurable modules, that means
   * all modules that return a class with a __configurable attribute as true
   *
   * @constructor
   * @return {object}       [the bootstraping object]
   */
  constructor() {
    const setupModule = require('./setup-module.js');
    const resolveAliases = require('./resolve-aliases.js');
    const lodash = require('lodash');
    const extend = lodash.extend;
    const merge = lodash.merge;
    const Module = require('module');
    const retalapp = this;
    const log = console;
    
    this._conf = {};
    this._conf.modules = {};
    this._conf.aliases = {};
    Module._cacheSettings = {};

    Module.prototype.require = function (request) {
      let settings = retalapp.getSettings();
      let params = {};
      let returnModule;
      let cachedModule;
      let fileCacheId;
      let filename;
      let runSettings;
      let moduleSettings;

      if(Object.prototype.toString.call(request) === '[object Array]') {
        params = request[1];
        request = request[0];
      }
      
      moduleSettings = settings.modules && settings.modules[request]? extend({}, settings.modules[request]): {};
      runSettings = extend(moduleSettings, params || {});
      request = runSettings.module || request;

      if(request[0] === '#') {
        request = resolveAliases(request, settings.aliases || {}, log);
      }

      filename = Module._resolveFilename(request, this, false);
      fileCacheId = filename + '-' + JSON.stringify(runSettings);
      
      cachedModule = Module._cacheSettings[fileCacheId];
      if (cachedModule) {
        return cachedModule;
      }
      
      returnModule = Module._load(request, this);
      returnModule = setupModule(returnModule, runSettings, settings, log, filename);
      Module._cacheSettings[fileCacheId] = returnModule;

      return returnModule;
    };

    return this;
  }
  

  /**
   * conf a function to set the retalapp config variables
   *
   * @param  {strong}        param      [parameter valid system name]
   * @param  {string|object} value      [value to set the parameter]
   * @return {object}                   [all the configuration settings updated]
  */
  conf(param, value) {
    if(this._conf[param] && !value) {
      return this._conf[param];
    }
    this._conf[param] = value;
    return this._conf;
  }


  /**
   * alias in this function the user will be able to set
   * a kind of shortcut to use after in the module settings 
   * as source of some the module
   *
   * @param  {string} alias             [alias to set eg:. #modules, will point to the path seted as 
   *  second parameter of this method]
   * @param  {string} path              [the pat to point the module alias seted in tha previewsly parameter]
   * @return {void}
  */
  alias(alias, path) {
    this._conf.aliases[alias] = path;
  }


  /**
   * module the user will be able to set some modules with parameter, 
   * these modules are going to be seteables in the runtime and the 
   * user will be able to use them from the require function as any 
   * other npm package, but the behavior of tthese modules could be 
   * change depends of the settings you send in the 2th and 3th parameters
   *
   * @param  {string} name           [module name]
   * @param  {string} alias|path     [an string with the name of the module or a valid path]
   * @param  {object} settings       [and object which keys match witn some class module attributes]
   * @param  {string} isApp          [a flag to say if an app (with urls to attend web requests or just a module callable fom a node generic call)]
   * @return {void}
  */
  module() {

    var args = Array.prototype.slice.call(arguments);
    var name = args.shift() || '';
    var path = args.shift() || '';
    var settings = args.shift() || {};
    var isApp = args.shift() || false;

    if(path.constructor === Object) {
      settings = path;
      path = name;
    }

    if(!this._conf.modules) {
      this._conf.modules = {};
    }

    this._conf.modules[name] = settings;
    this._conf.modules[name].module = path;
    this._conf.modules[name].app = isApp;
  }

  /**
   * app a shortcut for the module property
   *
   * @param  {string} name           [module name]
   * @param  {string} alias|path     [an string with the name of the module or a valid path]
   * @param  {object} settings       [and object which keys match witn some class module attributes]
   * @return {void}
  */
  app(name, path, settings) {
    this.module(name, path, settings, true);
  }

  /**
   * getSettings a getter method to get the system settings
   *
   * @return {object}                [setting system object]
  */
  getSettings() {
    return this._conf;
  }

  /**
   * getSettings a setter method to set the system settings
   *
   * @param  {object} settings       [an object settings to change the core behaviors]
   * @return {object}                [setting system object]
  */
  setSettings(settings) {
    return this._conf = settings;
  }

  /**
   * end a method to call in the end of the systems request or excetation
   * this is to finish pending proccess, and give the modules developers the chance
   * to do something before the app gone
   *
   * @return {void}
  */
  end() {
    _.each(this._conf.modules, (conf, name) => {
      const appObject = require(name);
      if(appObject.end) {
        appObject.end();
      }
    })
    return ;
  }

  /**
   * run this is an optional method in the case the user want run an express server
   * is an optional because the user could only run the modules in a terminal environment
   *
   * @param  {function} done       [a function to call once the web server is runing]
   * @return {void}
  */
  run(done) {
    this.__appsReq = [];
    this.__appsRes = [];
    this.__appsWillApp = [];
    this.__appsWillAdmin = [];
    this.__appsWillApi = [];
    this.__appsWillMenu = [];
    this.__appsWillPublishAssets = [];
    this.assets = require('assets');
    this.settings = this.getSettings();
    this.app = express();
    this.admin = express();
    this.api = express();
    this.doc = express();

    this.initApps();
    
    /**
     * Extracting did and will methods
     * and extract stuff from components
    */
    this.willApp();
    this.willAdmin();
    this.willApi();
    this.willMenu();
    this.willError();
    if(done) return done(this.app);
  }

  /**
   * initApp internal method whitch group all the modules app
   *
   * @return {void}
  */
  initApps () {
    /**
     * Init all modules to have
     * and instance cached 
    */
    _.each(this.settings.modules, (conf, name) => {

      let appObject = require(name)
      let viewPath = appObject.basePath 
          ? appObject.basePath + '/views/' + this.settings.defaultViewFrontDir 
          : null;
      let viewPathAdmin = appObject.basePath 
          ? appObject.basePath + '/views/' + this.settings.defaultViewAdminDir
          : null;
      let appData = { name, appObject, viewPath, viewPathAdmin } 
      
      if(appObject.moduleID)
        appObject.moduleID = name
      
      // if(appObject.req)
        this.__appsReq.push(appObject)
      
      // if(appObject.res)
        this.__appsRes.push(appObject)
      
      if(appObject && appObject.willApp && viewPath)
        this.__appsWillApp.push(appData)
      
      if(appObject && appObject.willAdmin && viewPathAdmin)
        this.__appsWillAdmin.push(appData)
      
      if(appObject && appObject.willApi)
        this.__appsWillApi.push(appData)

      if(appObject && appObject.willMenu)
        this.__appsWillMenu.push(appData)

      if(appObject.basePath) {
        try {
          fs.accessSync(appObject.basePath + '/public', fs.F_OK);
          this.__appsWillPublishAssets.push(appData)
        } catch (e) {}
      }
    })
  }

  /**
   * initApp internal method whitch group all rontend modules apps
   *
   * @return {void}
  */
  willApp() {
    
    this.app.use(engine);
    this.app.set('port', process.env.PORT || this.settings.port);
    this.app.set('views', this.settings.frontTheme + '/');
    this.app.set('view engine', 'ejs');
    this.app.set('layout', this.resolveLayoutFront());
    
    if (this.app.get('env') == 'production') {
      this.app.use(logger('common', { 
        skip: (req, res) => { 
          return res.statusCode < 400 
        },
        stream: __dirname + '/logs/morgan.log' 
      }))
    } else {
      this.app.use(logger('dev'));
    }

    // req.session.user = {}
    this.app.use(cookieSession({
      name: 'session',
      keys: ['keys','r-keys']
    }))

    /**
      * Setting necesaries
    */
    this.app.use(methodOverride('_method'));
    this.app.use(cookieParser('secret'));
    this.app.use(session({secret: 'keyboard cat', cookie: { maxAge: 60000 }, resave: true, saveUninitialized: true }));
    
    this.app.use((req, res, next) => {
      res.locals.require = require
      res.locals._ = _
      res.locals.req = req
      res.locals.res = res

      if(!req.session.danger) {
        req.session.danger = [];
      }
      if(!req.session.success) {
        req.session.success = [];
      }
      if(!req.session.warning) {
        req.session.warning = [];
      }
      if(!req.session.info) {
        req.session.info = [];
      }

      _.each(this.__appsReq, (appRouter) => {
        appRouter.req = req;
      })

      _.each(this.__appsRes, (appRouter) => {
        appRouter.res = res;
      })

      next()
    })

    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended : true }))
    this.assets.publish('frontTheme', null, this.settings.frontTheme + '/' + this.settings.defaultRootPublicDir);
    try {
      fs.accessSync(this.settings.frontTheme + '/' + this.settings.defaultRootPublicDir + '/favicon.ico', fs.F_OK);
      this.app.use(favicon(this.settings.frontTheme + '/' + this.settings.defaultRootPublicDir + '/favicon.ico'));
    } catch (e) {}
    this.assets.publish('adminTheme', `/${path.basename(this.settings.adminTheme)}`, this.settings.adminTheme + '/' + this.settings.defaultRootPublicDir);
    
    _.each(this.__appsWillPublishAssets, (appData) => {
      this.assets.publish(appData.name, `/${appData.name}`, appData.appObject.basePath + '/public');
    })

    /**
      * Error Handler for
      * Development stage
    */
    if ('development' == this.app.get('env')) {
      this.app.use(errorHandler());
    }

    /**
     * Default home this.settings
     * App define by default
     * /home built-in module
    */
    if(!this.settings.defaultFrontApp) {
      this.app.use('/', (req, res) => {
        res.send(require('lang').t('Hello home'))
      })
    }

    /**
     * Loading all hooks for
     * Apps defining at this.settings
     * The Apps are class that define
     * some methos that this script detect
    */
    _.each(this.__appsWillApp, (appAdd) => {
      
      const newApp = express()
      
      newApp.set('views', appAdd.viewPath);
      appAdd.appObject.willApp(newApp)
      
      if(this.settings.defaultFrontApp 
        && appAdd.name === this.settings.defaultFrontApp)
        this.app.use('/', newApp)
      else
        this.app.use('/' + appAdd.name, newApp)
    })

    this.app.use('/' + this.settings.rootAdminUrl, this.admin)
    this.app.use('/' + this.settings.rootApiUrl, this.api);
    this.assets.run();
  }

  /**
   * resolveLayoutFront handle paths related with the front-end theme location
   *
   * @return {string}   [the frontend theme root path]
  */

  resolveLayoutFront() {
    return this.settings.frontTheme + '/' + this.settings.defaultLayout;
  }

  /**
   * resolveLayoutAdmin handle paths related with the admin theme location
   *
   * @return {string}   [the admin theme root path]
  */
  resolveLayoutAdmin() {
    return this.settings.adminTheme + '/' + this.settings.defaultLayout;
  }

  /**
   * willAdmin internal method whitch group all admin modules apps boostraping
   *
   * @return {void}
  */
  willAdmin() {
    
    this.admin.set('views', this.settings.adminTheme + '/')
    this.admin.set('layout', this.resolveLayoutAdmin())
    
    /**
     * Default admin handled
    */
    if(!this.settings.defaultAdminApp) {
      this.admin.get('/', (req, res) => res.send(require('lang').t('Hello admin...')))
    }

    /**
     * Loading all hooks for
     * AdminApp defining at this.settings
     * The Apps are class that define
     * some methos that this script detect
    */
    _.each(this.__appsWillAdmin, (appAdd) => {
      
      const newApp = express()
      newApp.set('views', appAdd.viewPathAdmin);
      appAdd.appObject.willAdmin(newApp)
      
      if(this.settings.defaultAdminApp 
        && appAdd.name === this.settings.defaultAdminApp) {
        this.admin.use('/', newApp)
      }
      else
        this.admin.use('/' + appAdd.name, newApp)
    })
  }

  /**
   * willApi internal method whitch group all api modules apps boostraping
   *
   * @return {void}
  */
  willApi() {

    this.api.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, POST, PUT, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
      next()
    })

    if(!this.settings.defaultApi)
      this.api.get('/', (req, res) => res.json({default: 'API'}))


    /**
     * Loading all hooks for
     * AdminApp defining at this.settings
     * The Apps are class that define
     * some methos that this script detect
    */
    _.each(this.__appsWillApi, (appAdd) => {
      
      const newApp = express()
      appAdd.appObject.willApi(newApp)
      
      if(this.settings.defaultApi 
          && appAdd.name === this.settings.defaultApi)
        this.api.use('/', newApp)
      else
        this.api.use('/' + appAdd.name, newApp)
    })

    /**
     * To implement doc app
     * to put there the 
     * modules documentation
    */
    this.doc.get('/', (req, res) => res.send(require('lang').t('Doc...')))
    this.api.use('/doc', this.doc)

  }

  /**
   * willError internal method whitch group all error modules apps boostraping
   *
   * @return {void}
  */
  willError() {

    this.admin.use((req, res, next) => {
      let err = new Error(require('lang').t('Page not Found'))

      err.status = 404;
      next(err)
    })

    this.admin.use((err, req, res, next) => {
      let status = err.status || 500

      res.status(status)
        .render(this.settings.adminTheme + '/error', {
          status: status,
          title: status,
          message: err.message,
          error: err
        })
    })

    this.api.use((req, res, next) => {
      let err = new Error(require('lang').t('Page not Found'))

      err.status = 404;
      next(err)
    })

    this.api.use((err, req, res, next) => {

      res.status(err.status || 500)
      return res.json({
        status: 'error',
        message: err.message,
        error: err
      })
    })

    /**
     * Error handler
     * For all reauest to app
    */
    this.app.use((req, res, next) => {
      let err = new Error(require('lang').t('Page not Found'))

      err.status = 404;
      next(err)
    })

    this.app.use((err, req, res, next) => {
      let status = err.status || 500

      return res.status(status)
        .render(this.settings.frontTheme + '/error', {
          status: status,
          title: status,
          message: err.message,
          error: err
        })
    })
  }

  /**
   * willMenu read all the mdodules admin menu item registration in order to
   * the admin module will be able to show the menu later on
   *
   * @return {void}
  */
  willMenu() {
    let menu = []

    _.each(this.__appsWillMenu, (appAdd) => {
      if(appAdd.appObject && appAdd.appObject.willMenu) {
        appAdd.appObject.willMenu(menu);
      }
    })
    require('admin').addWillMenu(menu) 
  }
}

module.exports = require('../config')(new Retalapp());
