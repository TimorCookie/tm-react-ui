const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const autoprefixer = require('autoprefixer');

module.exports = {
    entry: path.join(__dirname, '/src/index.js'), // 入口文件
    output: {
        filename: '[name].bundle.js',//打包后输出文件的文件名
        path: path.join(__dirname, '/dist'),//打包后的文件存放的地方
        chunkFilename: '[name].bundle.js',
    },
   
    devtool: 'source-map', // 会生成对于调试的完整的.map文件，但同时也会减慢打包速度
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [            
                    {loader: 'style-loader'}, // 这里采用的是对象配置loader的写法
                    {loader: 'css-loader'},
                    {loader: 'postcss-loader'} // 使用postcss-loader
                ] 
            },
            {
                test: /\.(scss|.sass)$/,
                use: ['style-loader', 'css-loader', 'sass-loader']// 需要用的loader，一定是这个顺序，因为调用loader是从右往左编译的
            },
            {
                test: /(\.jsx|\.js)$/,   
                use: {                    // 注意use选择如果有多项配置，可写成这种对象形式
                    loader: 'babel-loader',
                },
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1000  // 限制只有小于1kb的图片才转为base64，例子图片为1.47kb,所以不会被转化
                        }
                    }
                ]
                
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin('timor出品，必属精品!'),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '/src/index.template.html')
        }),
        // new CleanWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin() // 热更新插件 
    ]

}