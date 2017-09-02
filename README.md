# Retalapp

A NodeJS CMS riented to developers

## Getting Started

To get your Retalapp project is hightly recommended initialize a new npm project to save your project dependencies

### Prerequisites

NodeJS >= 4.4

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

```
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
