let path = require('path');
let ExtractTextPlugin = require("extract-text-webpack-plugin");
let OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
let CleanWebpackPlugin = require('clean-webpack-plugin');
let conf = {
	entry: [
	'./src/js/index.js',
	'./src/scss/style.scss'
	],
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: 'main.js',
		publicPath: 'dist/'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
			},
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						'css-loader', 
						'sass-loader'
					]
				})
			}
		]
	},
	plugins: [  
		new ExtractTextPlugin({
			filename: "style.css"
		}),
		new OptimizeCssAssetsPlugin(),
		
		new CleanWebpackPlugin() 
	]
}

module.exports = (env, options) => {
	let production = options.mode === 'production';
	conf.devtool = production ? false : 'eval-sourcemap';

	return conf;
}



