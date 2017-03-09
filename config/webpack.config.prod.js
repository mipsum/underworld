var autoprefixer = require('autoprefixer');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ManifestPlugin = require('webpack-manifest-plugin');
var InterpolateHtmlPlugin = require('inferno-dev-utils/InterpolateHtmlPlugin');
var url = require('url');
var paths = require('./paths');
var getClientEnvironment = require('./env');

var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var Visualizer = require('webpack-visualizer-plugin');

var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

var path = require('path')

function ensureSlash(path, needsSlash) {
  var hasSlash = path.endsWith('/');
  if (hasSlash && !needsSlash) {
    return path.substr(path, path.length - 1);
  } else if (!hasSlash && needsSlash) {
    return path + '/';
  } else {
    return path;
  }
}

// We use "homepage" field to infer "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
var homepagePath = require(paths.appPackageJson).homepage;
var homepagePathname = homepagePath ? url.parse(homepagePath).pathname : '/';
// Webpack uses `publicPath` to determine where the app is being served from.
// It requires a trailing slash, or the file assets will get an incorrect path.
var publicPath = ensureSlash(homepagePathname, true);
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
var publicUrl = ensureSlash(homepagePathname, false);
// Get environment variables to inject into our app.
var env = getClientEnvironment(publicUrl);


var mergeCfg = require('webpack-merge')

var commonCfg = require('./webpack.config.common')

// Assert this just to be safe.
// Development builds of Inferno are slow and not intended for production.
if (env['process.env'].NODE_ENV !== '"production"') {
  throw new Error('Production builds must have NODE_ENV=production.');
}

// This is the production configuration.
// It compiles slowly and is focused on producing a fast and minimal bundle.
// The development configuration is different and lives in a separate file.
module.exports = mergeCfg(commonCfg, {
  // Don't attempt to continue if there are any errors.
  bail: true,

  profile: true,

  // We generate sourcemaps in production. This is slow but gives good results.
  // You can exclude the *.map files from the build during deployment.
  devtool: 'source-map',

  entry: [
    // In production, we only want to load the polyfills and the app code.
    // require.resolve('./polyfills'),
    // path.resolve(paths.appDirectory, './src/polyfills'),
    paths.appIndexJs
  ],

  output: {

    // Generated JS file names (with nested folders).
    // There will be one main bundle, and one file per asynchronous chunk.
    // We don't currently advertise code splitting but Webpack supports it.
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',

  },

  module: {
    rules: setupRules(),
  },

  plugins: setupPlugins(),

})


function setupRules () {
  return [
    // The notation here is somewhat confusing.
    // "postcss" loader applies autoprefixer to our CSS.
    // "css" loader resolves paths in CSS and adds assets as dependencies.
    // "style" loader normally turns CSS into JS modules injecting <style>,
    // but unlike in development configuration, we do something different.
    // `ExtractTextPlugin` first applies the "postcss" and "css" loaders
    // (second argument), then grabs the result CSS and puts it into a
    // separate file in our build process. This way we actually ship
    // a single CSS file in production instead of JS code injecting <style>
    // tags. If you use code splitting, however, any async bundles will still
    // use the "style" loader inside the async code so CSS from them won't be
    // in the main CSS file.
    {
      test: /\.(css|scss|sass)$/,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      }),
    },
  ]
}


function setupPlugins () {
  return [

    // Note: this won't work without ExtractTextPlugin.extract(..) in `loaders`.
    new ExtractTextPlugin('static/css/[name].[contenthash:8].css'),

    new OptimizeCssAssetsPlugin(),

    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),

    // This helps ensure the builds are consistent if source hasn't changed:
    new webpack.optimize.OccurrenceOrderPlugin(),

    // Try to dedupe duplicated modules, if any:
    new webpack.optimize.DedupePlugin(),
    // // Minify the code.
    new webpack.optimize.UglifyJsPlugin({
      warnings: true,
      compress: {
        screw_ie8: true, // Inferno doesn't support IE8
        warnings: false,
        dead_code: true,
        unused: true,
        warnings: true,
        passes: 2,
        drop_debugger: true,
        collapse_vars: true,
        reduce_vars: true,
        negate_iife: false, // for LazyParseWebpackPlugin
      },
      // mangle: false,
      mangle: {
        screw_ie8: true
      },
      output: {
        comments: false,
        screw_ie8: true
      }
    }),



    // Generate a manifest file which contains a mapping of all asset filenames
    // to their corresponding output file so that tools can pick it up without
    // having to parse `index.html`.
    new ManifestPlugin({
      fileName: 'asset-manifest.json'
    }),

    // to see the `stats.json` go to:
    //    http://webpack.github.io/analyse/#modules
    new BundleAnalyzerPlugin({
      reportFilename: 'bundle-analizer.html',
      analyzerMode: 'static',
      openAnalyzer: false,
      generateStatsFile: true,
      logLevel: 'silent',
      // Name of Webpack Stats JSON file that will be generated if `generateStatsFile` is `true`.
      // Relative to bundles output directory.
      statsFilename: 'stats.json',
    }),
    new Visualizer({
      filename: 'visualizer.html'
    }),
  ]
}
