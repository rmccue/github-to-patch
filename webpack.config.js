const webpack = require('webpack');

if ( ! process.env.NODE_ENV ) {
	process.env.NODE_ENV = 'production';
}

module.exports = {
	entry: [
		'./index'
	],
	output: {
		path: __dirname,
		filename: 'build.js',
	},
	plugins: [
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.DefinePlugin({
			'__DEBUG__': ( process.env.NODE_ENV === 'development' ),
		}),
		new webpack.optimize.UglifyJsPlugin({
			compressor: {
				warnings: false
			}
		})
	],
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	module: {
		loaders: [
			{ test: /\.jsx?$/, exclude: /node_modules/, loader: "babel-loader"}
		]
	}
};

if ( process.env.NODE_ENV === 'development' ) {
	module.exports.devtool = '#cheap-module-eval-source-map';
	module.exports.entry.unshift(
		'webpack-dev-server/client?http://localhost:8080/'
	);
	module.exports.plugins.push( new webpack.HotModuleReplacementPlugin() );
	module.exports.plugins.push( new webpack.NoErrorsPlugin() );
	module.exports.output.publicPath = 'http://localhost:8080/';
	module.exports.devServer = {
		proxy: {
			'/': 'http://localhost:8000/',
		}
	};
}
