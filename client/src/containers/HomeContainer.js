import React from 'react'
import Home from '../components/Home'

export default React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
	getInitialState() {
		return {
			url: '',
		}
	},
	updateUrl(event) {
		this.setState({
			url: event.target.value,
		})
	},
	submitUrl(event) {
		event.preventDefault()

		var url = this.state.url
		this.setState({
			url: ''
		})

		this.context.router.push(`/results/${ encodeURIComponent(this.state.url) }`)
	},
	render() {
		return (
			<Home
				submitUrl={ this.submitUrl }
				updateUrl={ this.updateUrl }
				url={ this.state.url }/>
		)
	}
})