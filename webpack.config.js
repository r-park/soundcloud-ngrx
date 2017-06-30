const path = require('path');
const pkg = require('./package.json');

const BannerPlugin = require('webpack/lib/BannerPlugin');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NgcWebpackPlugin = require('ngc-webpack').NgcWebpackPlugin;
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const WebpackMd5Hash = require('webpack-md5-hash');


//=========================================================
//  VARS
//---------------------------------------------------------
const NODE_ENV = process.env.NODE_ENV;

const ENV_DEVELOPMENT = NODE_ENV === 'development';
const ENV_PRODUCTION = NODE_ENV === 'production';
const ENV_TEST = NODE_ENV === 'test';

const PACKAGE_NAME = pkg.name;
const PACKAGE_VERSION = pkg.version;

const SERVER_HOST = '0.0.0.0';
const SERVER_PORT = 3000;


//=========================================================
//  LOADERS
//---------------------------------------------------------
const rules = {
  scss: {
    test: /\.scss$/,
    use: [
      'raw-loader',
      'postcss-loader',
      {
        loader: 'sass-loader',
        options: {
          includePaths: ['src'],
          outputStyle: 'compressed',
          precision: 10,
          sourceComments: false
        }
      }
    ]
  },
  typescript: {
    test: /\.ts$/,
    use: [
      {
        loader: 'awesome-typescript-loader',
        options: {
          configFileName: ENV_PRODUCTION ? 'tsconfig.aot.json' : 'tsconfig.json'
        }
      },
      'angular2-template-loader'
    ]
  }
};


//=========================================================
//  CONFIG
//---------------------------------------------------------
const config = module.exports = {};

config.resolve = {
  extensions: ['.ts', '.js'],
  modules: [
    path.resolve('./src'),
    path.resolve('./node_modules')
  ]
};

config.module = {
  rules: [
    rules.typescript,
    rules.scss
  ]
};

config.plugins = [
  new CheckerPlugin(),
  new DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
    'process.env.SOUNDCLOUD_CLIENT_ID': JSON.stringify(process.env.SOUNDCLOUD_CLIENT_ID)
  }),
  new ContextReplacementPlugin(
    /angular([\\/])core([\\/])@angular/,
    path.resolve('./src')
  )
];


//=====================================
//  DEVELOPMENT or PRODUCTION
//-------------------------------------
if (ENV_DEVELOPMENT || ENV_PRODUCTION) {
  config.entry = {
    polyfills: './src/polyfills.ts'
  };

  config.output = {
    path: path.resolve('./dist'),
    publicPath: '/'
  };

  config.plugins.push(
    new CommonsChunkPlugin({
      name: 'polyfills',
      chunks: ['polyfills']
    }),
    new CommonsChunkPlugin({
      name: 'vendor',
      chunks: ['main'],
      minChunks: module => /node_modules/.test(module.resource)
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      hash: false,
      inject: false,
      template: './src/index.html'
    })
  );
}


//=====================================
//  DEVELOPMENT
//-------------------------------------
if (ENV_DEVELOPMENT) {
  config.devtool = 'cheap-module-source-map';

  config.entry.main = './src/main.jit.ts';

  config.output.filename = '[name].js';

  config.plugins.push(new ProgressPlugin());

  config.devServer = {
    contentBase: './src',
    historyApiFallback: true,
    host: SERVER_HOST,
    port: SERVER_PORT,
    stats: {
      cached: true,
      cachedAssets: true,
      chunks: true,
      chunkModules: false,
      colors: true,
      hash: false,
      reasons: true,
      timings: true,
      version: false
    },
    watchOptions: {
      ignored: /node_modules/
    }
  };
}


//=====================================
//  PRODUCTION
//-------------------------------------
if (ENV_PRODUCTION) {
  config.devtool = 'hidden-source-map';

  config.entry.main = './src/main.aot.ts';

  config.output.filename = '[name].[chunkhash].js';

  config.plugins.push(
    new NgcWebpackPlugin({
      disabled: false,
      tsConfig: path.resolve('tsconfig.aot.json')
    }),
    new UglifyJsPlugin({
      comments: false,
      compress: {
        comparisons: true,
        conditionals: true,
        dead_code: true, // eslint-disable-line camelcase
        evaluate: true,
        if_return: true, // eslint-disable-line camelcase
        join_vars: true, // eslint-disable-line camelcase
        negate_iife: false, // eslint-disable-line camelcase
        screw_ie8: true, // eslint-disable-line camelcase
        sequences: true,
        unused: true,
        warnings: false
      },
      mangle: {
        screw_ie8: true // eslint-disable-line camelcase
      },
      sourceMaps: false
    }),
    new BannerPlugin({
      banner: `${PACKAGE_NAME} v${PACKAGE_VERSION} -- ${new Date().toString()}`
    }),
    new WebpackMd5Hash()
  );
}


//=====================================
//  TEST
//-------------------------------------
if (ENV_TEST) {
  config.devtool = 'inline-source-map';
}
