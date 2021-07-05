/* global __dirname */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const config = [
  {
    title: "index",
    template: "./src/html/index.html",
    chunks: ["index"],
  },
  {
    title: "visualize",
    template: "./src/html/visualize.html",
    chunks: ["visualize"],
  },
];

module.exports = {
  entry: { index: "./src/js/index.js", visualize: "./src/js/visualize.js" },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.scss$/i,
        include: path.resolve(__dirname, "src", "css"),
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: function () {
                  return [require("autoprefixer")];
                },
              },
            },
          },
          "sass-loader",
        ],
      },
    ],
  },
  plugins: config.map(
    (entry) =>
      new HtmlWebpackPlugin({
        title: entry.title,
        template: entry.template,
        chunks: entry.chunks,
        filename: entry.title + ".html",
      })
  ),
  devServer: {
    contentBase: "./dist",
  },
};
