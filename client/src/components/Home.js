import React from 'react'

export default React.createClass({
	propTypes: {
		submitUrl: React.PropTypes.func.isRequired,
		updateUrl: React.PropTypes.func.isRequired,
		url: React.PropTypes.string.isRequired,
	},
	render() {
		return (
			<div className='jumbotron col-sm-12 text-center'>
				<form onSubmit={ this.props.submitUrl }>
					<input
						type='text'
						className='form-control'
						placeholder='Facebook Page URL'
						onChange={ this.props.updateUrl }
						value={ this.props.url }/>
				
					<button className='btn btn-lg btn-success'>
						Analyze
					</button>
				</form>
			</div>
		)
	}
})
