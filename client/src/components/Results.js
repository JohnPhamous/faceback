import React from 'react'
import { Pie as PieChart } from 'react-chartjs'

export default React.createClass({
	propTypes: {
		url: React.PropTypes.string.isRequired,
		data: React.PropTypes.array.isRequired
	},
	render() {
		return (
			<div className='col-sm-12'>
				<div className='row'>
					<div className='col-sm-12'>
						<h2>
							Data for { this.props.url.split("/")[3] }
						</h2>
					</div>
				</div>
				
				<div className='row'>
					<div className='col-sm-6'>
						<PieChart
							data={ this.props.data }
							width='400'
							height='400'/>
					</div>

					<div className='col-sm-6'>
						<canvas
							id='wordcloud'
							width='400'
							height='400'/>
					</div>
				</div>
			</div>
		)
	}
})
