var path = require('path');
var webpack = require('webpack');

module.exports = {
    devServer: true,
    debug: true,
    devtool: '#sourcemap',
    entry: [
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/only-dev-server',
        './app/app.js'
    ],
    output: {
        path: path.join(__dirname, 'public', 'js'),
        filename: 'app.js',
        publicPath: 'http://localhost:8080/js/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [{
              test: /\.(js|jsx)$/,
              loaders: ['react-hot', 'babel'],
              include: path.join(__dirname, 'app')
        }]
    }
};
