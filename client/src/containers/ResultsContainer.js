import React from 'react'
import Results from '../components/Results'

export default React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
	getInitialState() {
		return {
			pieData: [
			    {
			        value: 100,
			        color:"#F7464A",
			        highlight: "#FF5A5E",
			        label: "Like"
			    },
			    {
			        value: 30,
			        color: "#46BFBD",
			        highlight: "#5AD3D1",
			        label: "Love"
			    },
			    {
			        value: 70,
			        color: "#FDB45C",
			        highlight: "#FFC870",
			        label: "Haha"
			    },			    {
			        value: 10,
			        color:"#F7464A",
			        highlight: "#FF5A5E",
			        label: "Wow"
			    },
			    {
			        value: 3,
			        color: "#46BFBD",
			        highlight: "#5AD3D1",
			        label: "Sad"
			    },
			    {
			        value: 6,
			        color: "#FDB45C",
			        highlight: "#FFC870",
			        label: "Angry"
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
