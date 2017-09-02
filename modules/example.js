class Example {

	constructor() {
		this.param1 = 'param1 default';
		this.param2 = 'param2 default';
		this.param3 = '';
	}

	init(settings) {
		this.param3 = this.param1+this.param2;
	}
};

Example.__configurable = true;
module.exports = Example;
