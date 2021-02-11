const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const MinifyPlugin = require("babel-minify-webpack-plugin");

module.exports = merge(common, {
    mode: 'production',
    optimization: {
        //sideEffects: true,
        //usedExports: true,
        /*splitChunks: {
            chunks: 'all',
        },*/
        //moduleIds: "size",
        //chunkIds: "size",
    },
    plugins: [
        new MinifyPlugin({}, {
            //"comments": false
        })
    ]
});

