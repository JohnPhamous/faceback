import React from 'react'

export default React.createClass({
	render() {
		var img_style = {
			display: 'block',
			margin: '0 auto',
		}

		return (
			<div className='container'>
				<div className="row">
					<div className="col-sm-12">
						<a href='/'>
							<img
								style={img_style}
								src='logo.png'/>
						</a>
					</div>
				</div>

				{ this.props.children }
			</div>
		)
	}
})