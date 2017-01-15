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
				this.updatePageData(pageData.data);
			})

		return {
			data: []
		}
	},
	updatePageData(pageData) {
		var reactions = pageData.reduce((acc, elem) => {
			return {
				num_angrys: acc.num_angrys + parseInt(elem.num_angrys),
				num_hahas: acc.num_hahas + parseInt(elem.num_hahas),
				num_likes: acc.num_likes + parseInt(elem.num_likes),
				num_loves: acc.num_loves + parseInt(elem.num_loves),
				num_sads: acc.num_sads + parseInt(elem.num_sads),
				num_wows: acc.num_wows + parseInt(elem.num_wows),
			}
		}, {
			num_angrys: 0,
			num_hahas: 0,
			num_likes: 0,
			num_loves: 0,
			num_sads: 0,
			num_wows: 0,
		})

		this.setState({
			data: [
			    {
			        value: reactions.num_likes,
			        color:"#F7464A",
			        highlight: "#FF5A5E",
			        label: "Likes"
			    },
			    {
			        value:  reactions.num_loves,
			        color: "#46BFBD",
			        highlight: "#5AD3D1",
			        label: "Loves"
			    },
			    {
			        value:  reactions.num_hahas,
			        color: "#FDB45C",
			        highlight: "#FFC870",
			        label: "Hahas"
			    },			    {
			        value:  reactions.num_wows,
			        color:"#F7464A",
			        highlight: "#FF5A5E",
			        label: "Wows"
			    },
			    {
			        value: reactions.num_sads,
			        color: "#46BFBD",
			        highlight: "#5AD3D1",
			        label: "Sads"
			    },
			    {
			        value: reactions.num_angrys,
			        color: "#FDB45C",
			        highlight: "#FFC870",
			        label: "Angrys"
			    }
			]
		})
	},
	render() {
		return (
			<Results
				url={ this.props.routeParams.url }
				data={ this.state.data }/>
		)
	}
})
