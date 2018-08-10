const path = require('path');

module.exports = {
    devtool: 'source-map',
    entry: {
        'app': [
            './src/main.js'
        ]
    },
    output: {
        path: path.resolve(__dirname, './'),
        filename: '[name].js'
    },
    module: {
        rules: []
    }
}
