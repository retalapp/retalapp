const _ = require('lodash');

class Admin {
	
	constructor() {
		this.menu = [];
		this.connection = 'db';
		this.messagesType = ['danger', 'warning', 'success', 'info'];
	}

	init() {
		this.adapter = require(this.connection).adapter;
		this.Schemas = require(__dirname + '/models/Schemas')(this);
	}

	willAdmin(app) {
		
		app.get('/', (req, res) => {
			return res.render('index', {
				title: 'Dashboard'
			});
		});
		
		app.get('/pages', (req, res) => {
			return res.render('pages', {
				title: 'Pages'
			});
		});

		app.get('/data', (req, res) => {
			return res.render('data', {
				title: 'Data'
			});
		});

		app.get('/schemas', (req, res) => {
			const { q, page, by, sort } = req.query

	    this.Schemas
	      .search({ q, page, by, sort })
	      .then(({model, paging}) => {

  				return res.render('schemas', {
						title: 'Schemas',
						q, model, paging
					});
	      })
	      .catch((err) => {
					err.status = 500;
					return next(err);
	      });
		});

		app.get('/schemas/add', (req, res) => {
			return res.render('schemas-add', {
				title: 'Add Schemas...',
				model: {},
        errors: {}
			});
		});

		app.post('/schemas/add', (req, res) => {
			const model = req.body;

			this.Schemas
			.create(model)
			.then((model) => {
			  this.message('success', 'Record was save successfully.')
        return res.redirect(model._id + '/fields');
			})
			.catch((err) => {

			  this.message('danger', 'Validation errors.');
        return res.status(502)
          .render('schemas-add', {
            model: model,
            errors: err.errors,
						title: 'Add Schemas'
          })
			})
		});

		app.get('/schemas/:id/edit', (req, res) => {
			const id = req.params.id

			this.Schemas
				.findOne({_id: id})
				.then((model) => {
					return res.render('schemas-edit', {
						title: `<em>${model.name}</em> Edit`,
						model: model,
						errors: {}
					});
				})
				.catch((err) => {
					throw new Error(err);
				});
		});

		app.get('/schemas/:id/fields/add-field', (req, res) => {
			const id = req.params.id

			this.Schemas
				.findOne({_id: id})
				.then((model) => {
					return res.render('schemas-fields-add-field', {
						title: `<em>${model.name}</em> Add field`,
						field: {},
						model: model,
						errors: {}
					});
				})
				.catch((err) => {
					throw new Error(err)
				});
		});

		app.post('/schemas/:id/fields/add-field', (req, res) => {
			const id = req.params.id;
			const field = req.body;
			let model = null;

			this.Schemas
				.findOne({_id: id})
				.then((data) => {
					model = data;
					model.fields.push(field);
					return model.save();
				})
				.then((model) => {
				  this.message('success', 'Record was save successfully.')
      	  return res.redirect(model._id + '/fields');
				})
				.catch((err) => {
					console.log({
							title: `<em>${model.name}</em> Add field`,
							field: field,
							model: model,
							errors: err.errors
						});
					this.message('danger', 'Validation errors.');
					return res.status(502)
						.render('schemas-fields-add-field', {
							title: `<em>${model.name}</em> Add field`,
							field: field,
							model: model,
							errors: err.errors
						});
				});
		});

		app.get('/schemas/:id/fields', (req, res) => {
			const id = req.params.id

			this.Schemas
				.findOne({_id: id})
				.then((model) => {
					return res.render('schemas-fields', {
						title: `<em>${model.name}</em> Fields`,
						model: model,
						errors: {}
					});
				})
				.catch((err) => {
					throw new Error(err)
				});
		});

		app.get('/schemas/:id/versions', (req, res) => {
			const id = req.params.id

			this.Schemas
				.findOne({_id: id})
				.then((model) => {
					return res.render('schemas-versions', {
						title: `<em>${model.name}</em> Versions`,
						model: model,
						errors: {}
					});
				})
				.catch((err) => {
					throw new Error(err)
				});
		});

		return app;
	}

	willApi(app) {
		app.get('/', (req, res) => {
			res.json({'admin': 'Here will be reports...'})
		});
		return app;
	}

	willMenu(menu) {
		menu.push({
			url: '/admin/pages',
			label: 'Pages',
			// icon: 'fa-dashboard',
			active: true,
			weight: -100
		});
		menu.push({
			url: '/admin/data',
			label: 'Data',
			// icon: 'fa-dashboard',
			weight: -100
		});
		menu.push({
			url: '/admin/schemas',
			label: 'Schemas',
			// icon: 'fa-dashboard',
			weight: -100
		});
		menu.push({
			url: '/admin',
			label: 'Files',
			// icon: 'fa-dashboard',
			weight: -100
		});
		menu.push({
			url: '/admin',
			label: 'Comments',
			// icon: 'fa-file',
			weight: -100
		});
		menu.push({
			url: '/admin',
			label: 'Appearance',
			// icon: 'fa-file',
			weight: -100
		});
		menu.push({
			url: '/admin',
			label: 'Plugin',
			// icon: 'fa-file',
			weight: -100
		});
		menu.push({
			url: '/admin',
			label: 'Settings',
			// icon: 'fa-file',
			weight: -100
		});
		menu.push({
			url: '/admin',
			label: 'Users',
			// icon: 'fa-file',
			weight: -100
		});
		
		return menu;
	}

	addWillMenu(menu) {
		this.menu = menu;
	}

	showWillMenu() {
		let menuHtml = '';
		let menu = [];

		menu = _.sortBy(this.menu, data => data.weight);
		menu.forEach((menu, index) => {
		let activeClass = menu.active?' active':'';

			menuHtml += `<li class="nav-item${activeClass}">
					<a class="nav-link" href="${menu.url}">
						<i class="fa ${menu.icon}"></i> 
						${menu.label}
					</a>`
			if(menu.items && menu.items.length) { 
				menuHtml += `<ul class="treeview-menu">`
				menu.items.forEach((subMenu, index) => { 
					menuHtml +=`<li><a href="${subMenu.url}"><i class="fa ${subMenu.icon}"></i> ${subMenu.label}</a></li>`
				})
				menuHtml +=`</ul>`
			}
			menuHtml +=`</li>`
		})
		return menuHtml;
	}

	message(type, message) {
		if(!type || this.messagesType.indexOf(type) === -1) {
			throw Error('Type of message not found');
		}
		if(!this.req.session[type]) {
			this.req.session[type] = [];
		}
		this.req.session[type].push(message);
	}

	clearMessages() {
		this.messagesType.forEach((errType) => {
			this.req.session[errType] = [];
		});
	}

	showWillMessages() {
		let html = '';

		if(this.req.session.danger.length) {
    	html+=`<div class="alert alert-danger">`;
      	this.req.session.danger.forEach((message) => {
          html+=`<span>${message}</span>`;
        });
      	html+=`</div>`;
    }
    if(this.req.session.success.length) {
    	html+=`<div class="alert alert-success">`;
      	this.req.session.success.forEach((message) => {
          html+=`<span>${message}</span>`;
        });
      	html+=`</div>`;
    }
    if(this.req.session.warning.length) {
    	html+=`<div class="alert alert-warning">`;
      	this.req.session.warning.forEach((message) => {
          html+=`<span>${message}</span>`;
        });
      	html+=`</div>`;
    }
    if(this.req.session.info.length) {
    	html+=`<div class="alert alert-info">`;
      	this.req.session.info.forEach((message) => {
          html+=`<span>${message}</span>`;
        });
      	html+=`</div>`;
    }
    this.clearMessages();
		return html;
	}
}

Admin.__configurable = true;
module.exports = Admin;