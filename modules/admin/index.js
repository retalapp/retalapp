const _ = require('lodash');

class Admin {
	
	constructor() {
		this.menu = [];
		this.connection = 'db';
		this.messagesType = ['danger', 'warning', 'success', 'info'];
	}

	init() {
		this.adapter = require(this.connection).adapter;
		this.Visitors = require(__dirname + '/models/Visitors')(this);
	}

	willAdmin(app) {
		
		app.get('/', (req, res) => {
			this.message('warning', 'This is a warning session message');
			// this.message('info', 'This is a info session message');
			// this.message('danger', 'This is a danger session message');
			// this.message('success', 'This is a success session message');
			this.Visitors.create({
				ip: req.ip || '0.0.0.0'
			})
			.then((data) => {
				console.log(data);

				return res.render('index', {
						title: 'Hello'
					});
			})
			.catch((err) => {
				this.message('danger', err.message);
				return res.render('index', {
						title: 'Hello'
					});
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
			url: '/admin',
			label: 'Dashboard',
			icon: 'fa-dashboard',
			weight: -100
		});

		menu.push({
			url: '/admin',
			label: 'Content',
			icon: 'fa-file',
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
			menuHtml += `<li>
					<a href="${menu.url}">
						<i class="fa ${menu.icon}"></i> 
						<span>${menu.label}</span>
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
      	html+=`<h4>Danger</h4>`;
      	html+=`<ul>`;
        this.req.session.danger.forEach((message) => {
          html+=`<li>${message}</li>`;
        });
      	html+=`</ul>`;
    	html+=`</div>`;
    }
    if(this.req.session.success.length) {
    	html+=`<div class="alert alert-success">`;
      	html+=`<h4>Success</h4>`;
      	html+=`<ul>`;
        this.req.session.success.forEach((message) => {
          html+=`<li>${message}</li>`;
        });
      	html+=`</ul>`;
    	html+=`</div>`;
    }
    if(this.req.session.warning.length) {
    	html+=`<div class="alert alert-warning">`;
      	html+=`<h4>Warning</h4>`;
      	html+=`<ul>`;
        this.req.session.warning.forEach((message) => {
          html+=`<li>${message}</li>`;
        });
      	html+=`</ul>`;
    	html+=`</div>`;
    }
    if(this.req.session.info.length) {
    	html+=`<div class="alert alert-info">`;
      	html+=`<h4>Info</h4>`;
      	html+=`<ul>`;
        this.req.session.info.forEach((message) => {
          html+=`<li>${message}</li>`;
        });
      	html+=`</ul>`;
    	html+=`</div>`;
    }
    this.clearMessages();
		return html;
	}
}

Admin.__configurable = true;
module.exports = Admin;