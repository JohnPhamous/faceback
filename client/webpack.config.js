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
	},
	module: {
		loaders: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel-loader',
		}]
	},
	plugins: [
	 	HtmlWebpackPluginConfig,
	 ],
}