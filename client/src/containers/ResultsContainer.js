import React from 'react'
import Results from '../components/Results'
import Unknown from '../services/Unknown'

export default React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
	getInitialState() {
		Unknown
			.getPageData(this.props.routeParams.url)
			.then(pageData => {
				console.log(pageData);
			})

		return {
			pieData: [
			    {
			        value: 300,
			        color:"#F7464A",
			        highlight: "#FF5A5E",
			        label: "Red"
			    },
			    {
			        value: 50,
			        color: "#46BFBD",
			        highlight: "#5AD3D1",
			        label: "Green"
			    },
			    {
			        value: 100,
			        color: "#FDB45C",
			        highlight: "#FFC870",
			        label: "Yellow"
			    }
			]
		}
	},
	render() {
		return (
			<Results
				url={ this.props.routeParams.url }
				pieData={ this.state.pieData }/>
		)
	}
})
