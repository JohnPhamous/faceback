import axios from 'axios'

export default {
	getPageData(url) {
		return axios
			.get(`localhost:8000/api/page/${ encodeURIComponent(url) }`)
	},
}
