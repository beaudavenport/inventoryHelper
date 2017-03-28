var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    context: path.resolve('src/client'),
    entry: ['./index.js'],
    output: {
        path: path.resolve('lib/public'), //this is where the bundle is built to
        filename: 'bundle.js'
    },

    plugins: [
        new ExtractTextPlugin("styles.css")
    ],

    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node-modules/,
            loader: "babel-loader",
            query: {
                presets: ['stage-0', 'react']
            }
        }, {
            test: /\.css$/,
            exclude: /node-modules/,
            loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' })
        }, {
            test: /\.scss$/,
            exclude: /node-modules/,
            loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader!sass-loader' })
        }]
    },

    resolve: {
        extensions: ['.js', '.es6']
    }
};
