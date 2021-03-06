const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const NodeExternals = require('webpack-node-externals');
const path = require('path');

const common = {
    module: {
        rules: [
            {
                test: /\.(js)$/i,
                exclude: [/node_modules/],
                use: [
                    'source-map-loader',
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['es2015', 'react'],
                            plugins: [
                                'transform-runtime',
                                ['transform-class-properties', {spec: true}],
                                ['transform-builtin-extend', {globals: ['Error', 'Array']}]
                            ],
                            cacheDirectory: true
                        }
                    }],
                enforce: 'pre'
            },
            {
                test: /\.(es6|jsx)$/i,
                exclude: [/node_modules/],
                use: [
                    'source-map-loader',
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['es2015', 'react'],
                            plugins: [
                                'transform-runtime',
                                ['transform-class-properties', {spec: true}],
                                ['transform-builtin-extend', {globals: ['Error', 'Array']}]
                            ],
                            cacheDirectory: true
                        }
                    }],
                enforce: 'pre'
            },
            {
                test: /\.css$/i,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'source-map-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                publicPath: ''
                            }
                        }]
                })
            },
            {
                test: /\.html$/i,
                use: [{
                    loader: 'html-loader'
                }]
            },
        ]
    }
};

const backend = {
    cache: false,
    devtool: 'source-map',
    target: 'node',
    entry: [
        './src/backend.js'
    ],
    output: {
        path: path.resolve('./build/'),
        publicPath: '',
        filename: './server.js'
    },
    externals: [
        NodeExternals({whitelist: ['babel-runtime', 'cookie-parser']})
    ],
    resolve: {
        extensions: ['.js', '.es6', '.jsx'],
        modules: ['node_modules']
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            },
            sourceMap: true
        }),
        new CopyWebpackPlugin([
            {from: 'src/config.json'},
            {from: './package.json'},
            // {
            //     from: 'db',
            //     to: path.resolve('./build/db/')
            // },
        ])
    ]
};

const frontend = {
    cache: false,
    devtool: 'source-map',
    entry: [
        './src/frontend.jsx'
    ],
    output: {
        path: path.resolve('./build/public'),
        publicPath: '',
        filename: './application.js'
    },
    resolve: {
        extensions: ['.js', '.es6', '.jsx'],
        modules: ['node_modules'],
        alias: {
            'react': 'preact-compat',
            'react-dom': 'preact-compat',
            'create-react-class': 'preact-compat/lib/create-react-class'
        }
    },
    plugins: [
        new ExtractTextPlugin({
            filename: './application.css',
            allChunks: true
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            },
            sourceMap: true
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.html',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            },
            inject: true,
            hash: true
        }),
        new CopyWebpackPlugin([
            {from: 'src/favicon.ico'},
        ])
    ]
};

module.exports = [
    Object.assign({}, common, frontend),
    Object.assign({}, common, backend)
];
