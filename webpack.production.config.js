const path = require('path');
              const WebpackWatchedGlobEntries = require('webpack-watched-glob-entries-plugin');
              const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
              const ESLintPlugin = require('eslint-webpack-plugin');
              const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
              const StyleLintPlugin = require('stylelint-webpack-plugin');
              const TerserPlugin = require('terser-webpack-plugin');
              const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
              
              module.exports = {
                entry: WebpackWatchedGlobEntries.getEntries([
                  path.resolve('./shop/src/dev/js/*.js'),
                  path.resolve('./shop/src/dev/styles/typography/*.css'),
                  path.resolve('./shop/src/dev/styles/base/*.css'),
                  path.resolve('./shop/src/dev/styles/components/*.css'),
                  path.resolve('./shop/src/dev/styles/sections/*.css'),
                  path.resolve('./shop/src/dev/styles/templates/*.css')
                ]),
                mode: 'production',
                optimization: {
                  usedExports: true,
                },
                watch: false,
                module: {
                  rules: [
                    {
                      test: /\.js$/,
                      exclude: [
                        /node_modules/,
                        path.resolve('./shop/src/dev/static'),
                      ],
                      use: ['babel-loader']
                    },
                    {
                      include: [
                        path.resolve('./shop/src/dev/styles/base'),
                        path.resolve('./shop/src/dev/styles/components'),
                        path.resolve('./shop/src/dev/styles/mixins'),
                        path.resolve('./shop/src/dev/styles/sections'),
                        path.resolve('./shop/src/dev/styles/templates'),
                        path.resolve('./shop/src/dev/styles/typography'),
                        path.resolve('./shop/src/dev/styles/variables'),
                      ],
                      exclude: path.resolve('./shop/src/dev/styles/raw'),
                      use: [
                        {
                          loader: ExtractCssChunks.loader,
                          options: {
                            publicPath: path.resolve('./shop/dist/assets/'),
                          },
                        },
                        {
                          loader: 'css-loader',
                          options: {
                            importLoaders: 1,
                          },
                        },
                        {
                          loader: 'postcss-loader',
                          options: {
                            postcssOptions: {
                              config: path.resolve(__dirname, 'postcss.config.js')
                            },
                          },
                        },
                      ],
                    }
                  ]
                },
                optimization: {
                  minimize: true,
                  minimizer: [new CssMinimizerPlugin(), new TerserPlugin({
                    test: /\.js(\?.*)?$/i,
                    parallel: true,
                    extractComments: false,
                  })],
                  splitChunks: {
                    cacheGroups: {
                      styles: {
                        name: 'styles',
                        type: 'css/mini-extract',
                        test: /\.css$/,
                        chunks: 'all',
                        enforce: true,
                      },
                    },
                  },
                },
                output: {
                  path: path.resolve('./shop/dist/assets'),
                  filename: '[name].min.js',
                },
                plugins: [
                  new ESLintPlugin({
                    context: 'shop/src',
                    files: ['**/*.js'],
                    failOnError: false,
                  }),
                  new WebpackWatchedGlobEntries(),
                  new ExtractCssChunks({
                    filename: '[name].min.css',
                  }),
                  new RemoveEmptyScriptsPlugin(),
                ],
                resolve: {
                  modules: [path.resolve(__dirname, 'node_modules'), 'node_modules']
                }
              };
              