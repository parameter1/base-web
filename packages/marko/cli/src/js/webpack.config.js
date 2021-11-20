const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

const absoluteRuntime = path.dirname(require.resolve('@babel/runtime/package.json'));
const imagePattern = /\.(png|svg|jpg|gif|webp)$/;

const isProduction = process.env.NODE_ENV === 'production';

const browser = ({ cwd, entry }) => ({
  mode: isProduction ? 'production' : 'development',
  context: cwd,
  entry,
  devtool: isProduction ? 'source-map' : 'eval',
  output: {
    path: path.resolve(cwd, 'dist/js'),
    library: 'CMSBrowserComponents',
    libraryExport: 'default',
    libraryTarget: 'umd',
    filename: 'index.[contenthash:8].js',
    chunkFilename: '[name].[contenthash:8].js',
    publicPath: '/dist/js/',
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.vue$/,
        loader: require.resolve('vue-loader'),
      },
      {
        test: /\.js$/,
        loader: require.resolve('babel-loader'),
        exclude: (f) => (
          /node_modules\/(?!@parameter1\/base-web-marko.*?\/browser)/.test(f)
          && !/\.vue\.js/.test(f)
        ),
        options: {
          presets: [
            [
              require.resolve('@babel/preset-env'),
              {
                targets: {
                  chrome: '49',
                  firefox: '45',
                  safari: '10',
                  edge: '12',
                  ie: '11',
                  ios: '10',
                },
                useBuiltIns: 'usage',
                corejs: '3.19',
                debug: false,
              },
            ],
          ],
          plugins: [
            [
              require.resolve('@babel/plugin-transform-runtime'),
              { absoluteRuntime },
            ],
          ],
        },
      },
      {
        test: /\.css$/,
        use: [
          require.resolve('vue-style-loader'),
          require.resolve('css-loader'),
        ],
      },
      {
        test: imagePattern,
        loader: require.resolve('file-loader'),
        options: {
          name: '[name].[ext]',
          outputPath: '../assets',
        },
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new WebpackManifestPlugin({
      publicPath: '',
      filter: ({ name }) => !imagePattern.test(name),
    }),
  ],
});

module.exports = { browser };
