import axios from 'axios'
import UNKNOWN from '../config/Unknown'

export default {
	getPageData(url) {
		return axios
			.get(`${ UNKNOWN.baseUrl }/page/${ encodeURIComponent(url) }`)
	},
}
