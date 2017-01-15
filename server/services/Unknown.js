var
	request = require('superagent'),
	UNKNOWN = require('../config/Unknown')

module.exports = {
	getPageData(url) {
		return request
			.get(`${ UNKNOWN.baseUrl }/req?${ encodeURIComponent(url) }`)
			.then(pageData => {
				return JSON.parse(pageData.text);
			})
	}
}
