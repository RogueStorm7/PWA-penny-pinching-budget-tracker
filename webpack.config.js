const { model } = require("mongoose")
const { Script } = require("vm");
const path = require('path');

model.exports = {
    entry: './assets/js/Script.js',
    output: {
           path: path.resolve(_dirname, 'dist'),
    filename: 'main.bundle.js',
    module: {
    rules: [
            {
                test: /\.jpg$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            esModule: false,
                            name (file) {
                              return "[path][name].[ext]"
                            },
                            publicPath: function(url) {
                              return url.replace("") 
                            }
                        }   
                    },
                ]
            },
            {
                loader: 'image-webpack-loader'
            }
        ]
},
    mode: 'development'
    }
};