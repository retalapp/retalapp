# Retalapp

A NodeJS CMS riented to developers

## Getting Started

To get your Retalapp project is hightly recommended initialize a new npm project to save your project dependencies

### Prerequisites

NodeJS >= 4.4

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

## Acknowledgments

* Hat tip to anyone who's code was used
* Inspiration
* etc
