const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const sass = require('sass');

const stylePattern = /\.(s[ac]ss|css)$/i;

module.exports = ({ cwd, entry }) => {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    mode: isProduction ? 'production' : 'development',
    context: cwd,
    entry,
    devtool: 'source-map',
    output: {
      path: path.resolve(cwd, 'dist/css'),
      filename: 'js/[name].js', // for the default index output (will be deleted)
      publicPath: '/dist/css/',
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'index.[contenthash:8].css',
        chunkFilename: '[name].[contenthash:8].css',
      }),
      new CleanWebpackPlugin(),
      new WebpackManifestPlugin({
        publicPath: '',
      }),
    ],
    optimization: {
      minimize: isProduction,
      minimizer: [new CssMinimizerPlugin({
        test: stylePattern,
        minimizerOptions: {
          preset: require.resolve('cssnano-preset-default'),
        },
      })],
    },
    module: {
      rules: [
        {
          test: stylePattern,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 2,
              },
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                postcssOptions: {
                  plugins: [
                    [
                      require.resolve('autoprefixer'),
                      {
                        overrideBrowserslist: [
                          '>= 1%',
                          'not dead',
                          'last 1 major version',
                          'Chrome >= 45',
                          'Firefox >= 38',
                          'Edge >= 12',
                          'Explorer >= 11',
                          'iOS >= 9',
                          'Safari >= 9',
                          'Android >= 4.4',
                          'Opera >= 30',
                        ],
                      },
                    ],
                  ],
                },
              },
            },
            {
              loader: require.resolve('sass-loader'),
              options: {
                implementation: sass,
                sassOptions: {
                  quietDeps: true,
                },
              },
            },
          ],
        },
      ],
    },
  };
};
