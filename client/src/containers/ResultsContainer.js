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
			.getPageData(this.props.routeParams.url, 's')
			.then(pageData => {
				this.updatePageData(pageData.data);
			})

		Unknown
			.getPageData(this.props.routeParams.url, 'c')
			.then(pageData => {
				this.updateCommentData(pageData.data);
			})

		return {
			data: [],
			options: {
				animationEasing: 'linear',
				animationSteps: 50,
			},
			sentiment: 0,
			interactivity: 0,
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
			        color: '#3F51B5',
			        highlight: '#5C6BC0',
			        label: 'Likes'
			    },
			    {
			        value:  reactions.num_loves,
			        color:'#E91E63',
			        highlight: '#EC407A',
			        label: 'Loves'
			    },
			    {
			        value:  reactions.num_hahas,
			        color: '#009688',
			        highlight: '#26A69A',
			        label: 'Hahas'
			    },			    {
			        value:  reactions.num_wows,
			        color: '#673AB7',
			        highlight: '#7E57C2',
			        label: 'Wows'
			    },
			    {
			        value: reactions.num_sads,
			        color: '#2196F3',
			        highlight: '#42A5F5',
			        label: 'Sads'
			    },
			    {
			        value: reactions.num_angrys,
			        color: '#F44336',
			        highlight: '#EF5350',
			        label: 'Angrys'
			    }
			],
		})
	},
	updateCommentData(commentData) {
		var
			commentInteractivity = 0,
			commentInteractivitySize = 0

		for (var i = 0; i < commentData.length; i++) {
			commentInteractivity +=
				(parseInt(commentData[i].pos_words)
				- parseInt(commentData[i].neg_words))
				+ parseInt(commentData[i].comment_likes)

			commentInteractivitySize += 
				parseInt(commentData[i].pos_words)
				+ parseInt(commentData[i].neg_words)
				+ parseInt(commentData[i].comment_likes)
		}

		var commentInteractivityRatio = commentInteractivity / commentInteractivitySize;

		this.setState({
			interactivity: commentInteractivityRatio * 100,
		})
	},
	createWordMap(pageData) {
		var wordmap = {}
		for(var i = 0; i < pageData.length; i++) {
			if (pageData[i].reduce_message != "ERROR") {
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

		var colors = ['#14c4ff', '#ffe251', '#015aba', '#e5230d', '#ff3fc5'] //blue, orange, yellow, blue, pink

		wordcloud(wordcloud_element, {
			list: wordcloud_map,
			backgroundColor: '#e8fcff',
			fontFamily: 'serif',
			color: function () {
    				return colors[Math.floor(Math.random() * 5)];
  			},
  			rotateRatio: 0,
			minSize: 16
		})
	},
	aggregateSentiments(pageData) {
		var
			totalSentiment = 0,
			sentimentSize = 0

		for(var i = 0; i < pageData.length; i++) {

			sentimentSize +=
				parseInt(pageData[i]['neg_words'])
				+ parseInt(pageData[i]['pos_words'])

			totalSentiment += parseInt(pageData[i]['pos_words']) - parseInt(pageData[i]['neg_words'])
		}

		var sentimentRatio = totalSentiment / sentimentSize

		this.setState({
			sentiment: Math.max(1 - sentimentRatio, sentimentRatio) * 100,
		})
	},
	render() {
		return (
			<Results
				url={ this.props.routeParams.url }
				data={ this.state.data }
				options={ this.state.options }
				sentiment={ this.state.sentiment }
				interactivity={ this.state.interactivity }/>
		)
	}
})
