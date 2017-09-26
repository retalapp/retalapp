const path = require('path');

module.exports = (request, pathAliases, log) => {
	let aliasPath;
	let remainPath;
	let aliasPieces;
	let alias;

	if (request[0]!=='#') return request;

	aliasPath = pathAliases || {};
	aliasPieces = request.replace(/\//g, path.sep);
	aliasPieces = request.split('/');
	alias = aliasPath[aliasPieces[0]];

	if (!alias) {
		if (log) log.warn('You have specified a wrong alias.', 'system.settingModule');
		return aliasPieces.join(path.sep);
	}

	aliasPieces.shift();
	remainPath = aliasPieces.join(path.sep)

	if (remainPath)
		return alias + path.sep + aliasPieces.join(path.sep);

	return alias;
}
