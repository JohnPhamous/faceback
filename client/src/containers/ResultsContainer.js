import React from 'react'
import Results from '../components/Results'
import Unknown from '../services/Unknown'
import wordcloud from 'wordcloud'

export default React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
	getInitialState() {
		Unknown
			.getPageData(this.props.routeParams.url)
			.then(pageData => {
				// console.log(pageData.data);
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

		this.createWordMap(pageData)
		this.aggregateSentiments(pageData)

		this.setState({
			data: [
			    {
			        value: reactions.num_likes,
			        color: '#46BFBD',
			        highlight: '#5AD3D1',
			        label: 'Likes'
			    },
			    {
			        value:  reactions.num_loves,
			        color:'#F7464A',
			        highlight: '#FF5A5E',
			        label: 'Loves'
			    },
			    {
			        value:  reactions.num_hahas,
			        color: '#FDB45C',
			        highlight: '#FFC870',
			        label: 'Hahas'
			    },			    {
			        value:  reactions.num_wows,
			        color: '#FDB45C',
			        highlight: '#FFC870',
			        label: 'Wows'
			    },
			    {
			        value: reactions.num_sads,
			        color: '#46BFBD',
			        highlight: '#5AD3D1',
			        label: 'Sads'
			    },
			    {
			        value: reactions.num_angrys,
			        color: '#FDB45C',
			        highlight: '#FFC870',
			        label: 'Angrys'
			    }
			]
		})
	},
	createWordMap(pageData) {
		var wordmap = {}
		for(var i = 0; i < pageData.length && pageData[i].reduce_message != "ERROR"; i++) {
			pageData[i].reduce_message = JSON.parse(pageData[i].reduce_message.replace(/'/g, '"'))

			for(var j = 0; j < pageData[i].reduce_message.length; j++) {
				var wordAttr = wordmap[pageData[i].reduce_message[j]]

				if (wordAttr) {
					wordmap[pageData[i].reduce_message[j]]++
				} else {
					wordmap[pageData[i].reduce_message[j]] = 1
				}
			}
		}

		var
			wordcloud_map = [],
			wordmap_keys = Object.keys(wordmap)

		for(var i = 0; i < wordmap_keys.length; i++) {
			if (wordmap[wordmap_keys[i]] > 10){
				wordcloud_map.push([wordmap_keys[i], wordmap[wordmap_keys[i]]])
			}
		}

		var wordcloud_element = document.getElementById('wordcloud')

		wordcloud(wordcloud_element, {
			list: wordcloud_map,
			backgroundColor: '#e8fcff',
  			color: '#14c4ff',
  			rotateRatio: 0
		})
	},
	aggregateSentiments(pageData) {
		console.log('aggregateSentiments');
		var totalSentiment = 0;
		var sentimentSize = 0;
		for(var i = 0; i < pageData.length; i++) {

			sentimentSize +=
				parseInt(pageData[i]['neg_words'])
				+ parseInt(pageData[i]['pos_words'])

			totalSentiment += parseInt(pageData[i]['pos_words']) - parseInt(pageData[i]['neg_words'])
		}

		console.log(totalSentiment / sentimentSize);
	},
	render() {
		return (
			<Results
				url={ this.props.routeParams.url }
				data={ this.state.data }/>
		)
	}
})
