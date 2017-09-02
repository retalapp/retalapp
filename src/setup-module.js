const hasOwnProperty = require('./has-own-property.js');
const extend = require('lodash').extend;
const path = require('path');

module.exports = (module, moduleSettings, globalSettings, log, filename) => {
	let obj;
	let objLook;

	if (module && module.constructor === Function && module.__configurable) {
		objLook = new module;
		setObject(objLook, moduleSettings, globalSettings, log, filename);
		obj = objLook;
	} else if (module && module.constructor === Object && module.__configurable) {
		obj = extend({}, module);
		setObject(obj, moduleSettings, globalSettings, log, filename);
	} else {
		return module;
	}
	return obj;
};

const setObject = (obj, moduleSettings, globalSettings, log, filename) => {

	for (var data in moduleSettings) {
		if (hasOwnProperty(obj, data)) {
			obj[data] = moduleSettings[data];
		} else {
			if (log && data !== 'app' && data !== 'module') log.warn('You are setting a wrong property:`' + data + ' of `'+ module + '` module', 'system.settingModule');
		}
	}

	obj.basePath = path.dirname(filename);

	if (obj && obj.init) {
		obj.init(globalSettings);
	}
}