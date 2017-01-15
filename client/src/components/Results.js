
import React from 'react'
import { Pie as PieChart } from 'react-chartjs'

export default React.createClass({
	propTypes: {
		url: React.PropTypes.string.isRequired,
		data: React.PropTypes.array.isRequired,
		sentiment: React.PropTypes.number.isRequired,
		interactivity: React.PropTypes.number.isRequired,
		options: React.PropTypes.object,
	},
	render() {
		return (
			<div className='col-sm-12'>
				<div className='row'>
					<div className='col-sm-12'>
						<h2>
							Data for { this.props.url.split("/")[3] }:
							
							<small>
								{ Math.round(this.props.sentiment) }% Happy,
								{ Math.round(this.props.interactivity) }% Interactive,
							</small>
						</h2>
					</div>
				</div>

				<div className='row'>
					<div className='col-sm-6'>
						<PieChart
							data={ this.props.data }
							options={ this.props.options }
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
