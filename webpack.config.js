const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
	mode: 'development',
	entry: {
		index: './src/index.js'
	},
	devtool: 'inline-source-map',
	devServer: {
		contentBase: './dist',
		port: 8081
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html',
		}),

		new WorkboxPlugin.GenerateSW({
			clientsClaim: true,
			skipWaiting: true,
		}),

		new CopyWebpackPlugin({
			patterns: [
				{ from: 'pwa.webmanifest', to: '' },
				{ from: 'assets/favicon.ico', to: '' },
				{ from: 'assets/**', to: '' }
			]
		})

		//,new BundleAnalyzerPlugin()
	],
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
		clean: true,
	},
	module: {
		rules: [
			{
				test: /\.(jpg|png|svg|woff|woff2|ttf)$/,
				use: {
					loader: 'url-loader',
				},
			},
			{
				test: /\.(mp3|flv|wav)$/,
				loader: 'file-loader',
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				]
			},
		]
	}
};
