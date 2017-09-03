# Retalapp [![Build Status](https://travis-ci.org/retalapp/retalapp.svg?branch=master)](https://travis-ci.org/retalapp/retalapp)

A NodeJS CMS riented to developers

## Getting Started

To get your Retalapp project is hightly recommended initialize a new npm project to save your project dependencies

### Prerequisites

NodeJS >= 6.0.0

Mongodb local server running follow [the installing steps](https://docs.mongodb.com/manual/administration/install-community/)

### Installing

Using Retalapp in your project

First start a new npm project, to do that run to follow command in a new empty folder directory and follow the front instructions

```
npm init
```

Now add Retalapp as dependency

```
npm install --save retalapp
```

Now you need to create the startup script of your server.

Create a new file called server.js and type the same content inside

```javascript
const retalapp = require('retalapp');

retalapp.run((app) => {
  const port = retalapp.conf('port');
  app.listen(port, () => {
    console.log(require('lang').t('Express server listening on port') + ' ' + port);
    retalapp.end();
  });
});

```

So run 
```
npm start
```

Now you can open your localhost to test

Front: [http://localhost:2222](http://localhost:2222)

Admin: [http://localhost:2222/admin](http://localhost:2222/admin)

You can optionally set the current core modules to modify the core behaviors or add your own custom modules:

```javascript
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

/**
 * Your custom module
 * New file path: ./mymodules/mimoduledir/index.js
 class MyModule {
  constructor() {
   this.parameterofmymodule = 'param1 default';
   this.parameterofmymodule1 = 'param2 default';
   this.parameterofmymodule2 = '';
  }

  willApp(app) {
  // this url will be accesible from http://localhost:2222/mymodule
   app.get('/', (req, res) => {
    res.render('index', {'title': this.parameterofmymodule});
   })
   return app;
  }
};
MyModule.__configurable = true;
module.exports = MyModule;
*/
// So you can access to the urls that your module register in the willApp method

// if your module is in te node_modules directory only set the name of the package as source
// retalapp.module('mymodule', 'my-module-in-npm', {
retalapp.module('mymodule', __dirname + '/mymodules/mimoduledir/index.js', {
  parameterofmymodule: 'Good morning!',
  parameterofmymodule1: 'Good morning one!',
  parameterofmymodule2: 'Good morning two!'
});

retalapp.run((app) => {
  const port = retalapp.conf('port');
  app.listen(port, () => {
    console.log(require('lang').t('Express server listening on port') + ' ' + port);
    retalapp.end();
  });
});

```


## Running the tests

Clone the repo and run 


```
npm install
npm test
```

## Contributing

Please read [CONTRIBUTING.md] for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

* **Gustavo Salgado** - *Initial work* - [gsalgadotoledo](https://github.com/gsalgadotoledo)

See also the list of [contributors](https://github.com/retalapp/retalapp/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Motivations

* Create petencial reusable logic and data models.
* Only istalling a package be enable to use a big part of logic eg:. a blog module, users module, wiki, shipping etc...
* Reuse code in different project using the seteable modules.
