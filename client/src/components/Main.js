import React from 'react'

export default React.createClass({
	render() {
		return (
			<div>
				<a href="/">
					<h1>Unknown</h1>
				</a>

				{ this.props.children }
			</div>
		)
	}
})