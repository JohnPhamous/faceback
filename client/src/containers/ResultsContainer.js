import React from 'react'
import Results from '../components/Results'

export default React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
	render() {
		return (
			<Results
				url={ this.props.routeParams.url }/>
		)
	}
})
