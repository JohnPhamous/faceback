import React from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import Main from '../components/Main'
import HomeContainer from '../containers/HomeContainer'
import ResultsContainer from '../containers/ResultsContainer'

export default (
	<Router history={ browserHistory }>
		<Route path='/' component={ Main }>
			<IndexRoute component={ HomeContainer } />

			<Route path='/results/:url' component={ ResultsContainer }/>
		</Route>
	</Router>
)