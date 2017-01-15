var
	HtmlWebpackPlugin = require('html-webpack-plugin'),
	HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
		template: __dirname + '/src/index.html',
		filename: 'index.html',
		inject: 'body',
	});

module.exports = {
	entry: [
		'./src/index.js',
	],
	output: {
		path: __dirname + '/dist',
		filename: 'index_bundle.js',
		publicPath: '/',
	},
	module: {
		loaders: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel-loader',
		}]
	},
	plugins: process.env.NODE_ENV === 'production' ? [
	   	new webpack.optimize.DedupePlugin(),
	   	new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.optimize.UglifyJsPlugin(),
		HtmlWebpackPluginConfig,
	 ] : [
	 	HtmlWebpackPluginConfig,
	 ],
}