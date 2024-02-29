const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env) => (
    {
        entry: './src/main.js',
        output: {
            filename: 'main.[contenthash].js',
            publicPath: ''
        },
        devServer: {
            proxy: {
                '/api': {
                    target: 'http://localhost:3000',
                }
            },
            historyApiFallback: true,
            hot: true,
        },
        plugins: [
            new HTMLWebpackPlugin({
                title: 'Coin',
            }),
            new MiniCSSExtractPlugin({
                filename: 'style.[contenthash].css'
            })
        ],
        module: {
            rules: [
                {
                    test: /\.(png|jpe?g|gif|svg)$/i,
                    type: 'asset/inline'
                },

                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        env.prod ? MiniCSSExtractPlugin.loader : 'style-loader',
                        'css-loader',
                        'postcss-loader',
                        'sass-loader'
                    ]
                },

                {
                    test: /\.css$/i,
                    use: [
                        env.prod ? MiniCSSExtractPlugin.loader : 'style-loader',
                        'css-loader',
                        'postcss-loader'
                    ]
                },
            ]
        }
    }
)