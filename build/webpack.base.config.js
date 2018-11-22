const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const pkg = require('../package.json');
const { resolve } = require('./utils');

module.exports = {
    entry: {
        main: '@/main',
        lib: ['@/vendors/vendors.base.js', '@/vendors/vendors.exten.js']
    },
    resolve: {
        extensions: ['.js', '.vue', '.less'],
        alias: {
            'vue': 'vue/dist/vue.esm.js',
            'views': resolve('../src/views'),
            'router': resolve('../src/router'),
            'store': resolve('../src/store'),
            'libs': resolve('../src/libs'),
            '@fetch': resolve('../src/api/fetch'),
            '@': resolve('../src')
        }
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                lib: {
                    chunks: 'initial',
                    test: 'lib',
                    name: 'lib',
                    enforce: true
                }
            }
        }
    },
    output: {
        path: resolve('../dist'),
        publicPath: '/',
        filename: 'assets/[name]_[hash:6].min.js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    compilerOptions: {
                        preserveWhitespace: false
                    }
                }
            },
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
                use: 'url-loader?limit=1024&name=assets/[hash:6].[ext]'
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: `"${process.env.NODE_ENV ? process.env.NODE_ENV : 'development'}"`,
                devUrl: `"${process.env.devUrl? process.env.devUrl : ''}"`,
                uaaHost: `"${process.env.uaaHost ? process.env.uaaHost : 'http://uaa.yeseer.cn'}"`,
                clientId: `"${process.env.clientId ? process.env.clientId : ''}"`
            }
        }),
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            title: pkg.description,
            inject: true,
            favicon: resolve('../favicon.ico'),
            filename: 'index.html',
            template: resolve('../src/template/index.html')
        })
    ]
};