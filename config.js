module.exports = (retalapp) => {

  retalapp.conf('basePath', process.cwd());
  retalapp.conf('corePath', __dirname);
  retalapp.conf('port', process.env.PORT || 2222);
  retalapp.conf('adminTheme', __dirname + '/themes/admin');
  retalapp.conf('frontTheme', __dirname + '/themes/front');
  retalapp.conf('defaultFrontApp', 'home');
  retalapp.conf('defaultAdminApp', 'admin');
  retalapp.conf('defaultApi', null);
  retalapp.conf('defaultLayout', 'layout');
  retalapp.conf('rootAdminUrl', 'admin');
  retalapp.conf('rootApiUrl', 'api');
  retalapp.conf('defaultViewFrontDir', 'front');
  retalapp.conf('defaultViewAdminDir', 'admin');
  retalapp.conf('defaultRootPublicDir', 'public');
  retalapp.conf('aliases', {
    '#retalapp': __dirname,
    '#core': __dirname,
    '#modules': process.cwd() + '/modules',
    '#apps': './apps',
    '#themes': __dirname + '/themes',
  });

  /**
   * Modules are mini apps that can set hooks
   * and in some cases have url availables
   * to show data in Front, Admin and/or API
   * visuals interfaces
  */

  /**
   * Lang
  */
  retalapp.module('lang', '#core/modules/lang', {
    language: 'en_US',
  });

  /**
   * Database
  */
  retalapp.module('db', '#core/modules/db', {
    connect: 'mongodb://localhost/challenge'
  });

  /**
   * Href
  */
  retalapp.module('href', '#core/modules/href');

  /**
   * Href
  */
  retalapp.module('pag', '#core/modules/pag');

  /**
   * Assets
  */
  retalapp.module('assets', '#core/modules/assets');

  /**
   * Logs
  */
  retalapp.module('log', '#core/modules/log');

  /**
   * Home front default route
  */
  retalapp.module('home', '#core/modules/home');

  /**
   * Admin dashboard default route
  */
  retalapp.module('admin', '#core/modules/admin', {
    connection: 'db'
  });

  return retalapp;
}