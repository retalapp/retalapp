class Home {

	constructor() {}

	willApp(app) {
		
		app.get('/', (req, res) => {
			res.render('index', {'title': 'hello front'});
		})

		return app
	}

	willAdmin(app) {
		
		app.get('/', (req, res) => {
			res.render('index', {'title': 'hello admin'});
		})

		return app
	}

	willApi(app) {

		app.get('/', (req, res) => {
			res.render('index', {'title': 'hello api'});
		})

		return app;
	}
}

Home.__configurable = true;
module.exports = Home;