var
	request = require('superagent'),
	UNKNOWN = require('../config/Unknown')

module.exports = {
	getPageData(_url, _kind) {
		return request
			.get(`${ UNKNOWN.baseUrl }/req`)
			.query({ url: _url })
			.query({ kind: _kind })
			.then(pageData => {
				return JSON.parse(pageData.text);
			})
	}
}
