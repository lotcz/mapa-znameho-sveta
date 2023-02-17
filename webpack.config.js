const path = require('path');
//const WorkboxPlugin = require('workbox-webpack-plugin');
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
		port: 8090
	},
	plugins: [
/*
		new WorkboxPlugin.GenerateSW({
			maximumFileSizeToCacheInBytes: 30 * 1024 * 1014,
			clientsClaim: true,
			skipWaiting: true,
		}),
*/
		new CopyWebpackPlugin({
			patterns: [
				//{ from: 'pwa.webmanifest', to: '' },
				{ from: 'assets/**', to: '' },
				{ from: 'src/index.html', to: '' }
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

	}
};
