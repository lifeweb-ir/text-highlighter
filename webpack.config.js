const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    // mode: 'development',
    // entry: "./src/index.js",
    // output: {
    //   filename: "bundle.[hash].js",
    //   path: path.resolve(__dirname, "dist"),
    // },
    mode:'production',
    entry: './src/Highlight.js',
    output: {
        path: path.resolve('lib'),
        filename: 'Highlight.js',
        libraryTarget: 'commonjs2',
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /(node_modules)/,
                use: 'babel-loader',
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html",
      }),
    ],
    resolve: {
        alias: {
            'react': path.resolve(__dirname, './node_modules/react'),
            'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
        }
    },
    externals: {
        // Don't bundle react or react-dom
        react: {
            commonjs: "react",
            commonjs2: "react",
            amd: "React",
            root: "React"
        },
        "react-dom": {
            commonjs: "react-dom",
            commonjs2: "react-dom",
            amd: "ReactDOM",
            root: "ReactDOM"
        }
    }
};