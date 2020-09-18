module.exports = {
   entry: './src/App.js',
   output: {
      filename: './dist/deepmech_bundle.js',
   },
   devServer: {
      inline: true,
      port: 8001
   },
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
               ]
            }
         }
      ]
   },
}