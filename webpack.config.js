const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
    const isDevelopment = argv.mode === 'development';

    return {
        target: 'web',
        entry: path.resolve(__dirname, 'src/main.ts'),
        devtool: isDevelopment ? 'inline-source-map' : false,
        output: {
            filename: 'service-worker.js',
            path: path.resolve(__dirname, 'dist'),
            clean: true
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                }
            ]
        },
        resolve: {
            extensions: ['.ts', '.js'],
            alias: {
                '@': path.resolve(__dirname, 'src')
            }
        },
        plugins: [
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: 'assets'
                    }
                ]
            })
        ],
        watch: isDevelopment,
        watchOptions: {
            ignored: /node_modules/
        }
    }
}
