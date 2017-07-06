'use strict';

module.exports = {
    entry: './src/app.ts',
    output: { filename: 'dist/index.js' },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            }
        ]
    },
    resolve: {
        extensions: [ '.ts', '.tsx', '.js' ]
    }
};
