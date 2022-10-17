const path = require("path");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: "./src/index.ts",
    devtool: "inline-source-map",
    mode: "development",
    module: {
        rules: [
            {
                test: /\.glsl$/,
                exclude: /node_modules/,
                type: 'asset/source',
            },
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".glsl"],
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "build"),
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                'public/'
            ]
        })
    ]
};
