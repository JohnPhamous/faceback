import React from 'react'
import { Pie as PieChart } from 'react-chartjs'
import Reaction from './Reaction'

export default React.createClass({
	propTypes: {
		url: React.PropTypes.string.isRequired,
		data: React.PropTypes.array.isRequired,
		reactionData: React.PropTypes.object.isRequired,
	},
	render() {
		// <PieChart
		// 	data={ this.props.data }
		// 	width='400'
		// 	height='400'/>
		return (
			<div className='col-sm-12'>
				<div className='row'>
					<div className='col-sm-12'>
						<h2>
							Data for { this.props.url.split('/')[3] }:
							
							<small> { Math.round(this.props.sentiment) }% Happy</small>
						</h2>
					</div>
				</div>

				<div className='row'>
					<div className='col-sm-6'>
						<div className='row'>
							<div className='col-sm-6'>
								<div className='row'>
									<div className='col-sm-12'>
										<Reaction emoji='like'/>
									</div>
								</div>

								<div className='row'>
									<div className='col-sm-12'>
										<Reaction emoji='love'/>
									</div>
								</div>
								
								<div className='row'>
									<div className='col-sm-12'>
										<Reaction emoji='haha'/>
									</div>
								</div>
								
								<div className='row'>
									<div className='col-sm-12'>
										<Reaction emoji='wow'/>
									</div>
								</div>
								
								<div className='row'>
									<div className='col-sm-12'>
										<Reaction emoji='sad'/>
									</div>
								</div>
								
								<div className='row'>
									<div className='col-sm-12'>
										<Reaction emoji='angry'/>
									</div>
								</div>
							</div>

							<div className='col-sm-6'>
								<div className='row'>
									<div className='col-sm-12'>
										{
											Math.round(
												this.props.reactionData.reactions.num_likes /
												this.props.reactionData.total_reactions * 100)
										}%
									</div>
								</div>

								<div className='row'>
									<div className='col-sm-12'>
										{
											Math.round(
												this.props.reactionData.reactions.num_loves /
												this.props.reactionData.total_reactions * 100)
										}%
									</div>
								</div>
								
								<div className='row'>
									<div className='col-sm-12'>
										{
											Math.round(
												this.props.reactionData.reactions.num_hahas /
												this.props.reactionData.total_reactions * 100)
										}%
									</div>
								</div>
								
								<div className='row'>
									<div className='col-sm-12'>
										{
											Math.round(
												this.props.reactionData.reactions.num_wows /
												this.props.reactionData.total_reactions * 100)
										}%
									</div>
								</div>
								
								<div className='row'>
									<div className='col-sm-12'>
										{
											Math.round(
												this.props.reactionData.reactions.num_sads /
												this.props.reactionData.total_reactions * 100)
										}%
									</div>
								</div>
								
								<div className='row'>
									<div className='col-sm-12'>
										{
											Math.round(
												this.props.reactionData.reactions.num_angrys /
												this.props.reactionData.total_reactions * 100)
										}%
									</div>
								</div>
							</div>
						</div>
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
