import React from 'react'
import { Pie } from 'react-chartjs'

export default React.createClass({
	propTypes: {
		url: React.PropTypes.string.isRequired,
	},
	render() {
		var pie_data = {
			labels: [
			        "Red",
			        "Blue",
			        "Yellow"
		    ],
		    datasets: [{
	            data: [300, 50, 100],
	            backgroundColor: [
	                "#FF6384",
	                "#36A2EB",
	                "#FFCE56"
	            ],
	            hoverBackgroundColor: [
	                "#FF6384",
	                "#36A2EB",
	                "#FFCE56"
	            ]
	        }]
		}

		return (
			<div className='col-sm-12'>
				Data for { this.props.url }

				<Pie
					data={ pie_data }
					width='400'
					height='400'/>
			</div>
		)
	}
})
