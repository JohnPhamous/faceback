var
	request = require('superagent'),
	UNKNOWN = require('../config/Unknown')

module.exports = {
	getPageData(_url) {
		return request
			.get(`${ UNKNOWN.baseUrl }/req`)
			.query({ url: _url })
			.query({ kind: "s" })
			.then(pageData => {
				return JSON.parse(pageData.text);
			})
	}
}
