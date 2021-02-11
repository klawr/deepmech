module.exports = {
   entry: './src/App.js',
   output: {
      filename: './dist/deepmech_bundle.js',
   },
   devtool: 'source-map',
   module: {
      rules: [
         {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
               "presets": [
                  "@babel/env",
                  "@babel/react"
               ],
               plugins: [
                  '@babel/transform-runtime',
                  '@babel/plugin-proposal-class-properties',
                  '@babel/plugin-syntax-dynamic-import'
               ],
            }
         }
      ]
   },
}
