import React from 'react'
import { Pie as PieChart } from 'react-chartjs'

export default React.createClass({
	propTypes: {
		url: React.PropTypes.string.isRequired,
		pieData: React.PropTypes.object.isRequired
	},
	render() {
		console.log(this.props.pieData);

		return (
			<div className='col-sm-12'>
				Data for { this.props.url }

				<PieChart
					data={ this.props.pieData }
					width='200'
					height='200'/>
			</div>
		)
	}
})
