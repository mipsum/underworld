var autoprefixer = require('autoprefixer');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
var InterpolateHtmlPlugin = require('inferno-dev-utils/InterpolateHtmlPlugin');
var WatchMissingNodeModulesPlugin = require('inferno-dev-utils/WatchMissingNodeModulesPlugin');
var getClientEnvironment = require('./env');
var paths = require('./paths');

var ExtractTextPlugin = require('extract-text-webpack-plugin');

var path = require('path')

var BASE_PATH = path.resolve(__dirname, '..')

// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
var publicPath = '/';
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
var publicUrl = '';
// Get environment variables to inject into our app.
var env = getClientEnvironment(publicUrl);

// This is the development configuration.
// It is focused on developer experience and fast rebuilds.
// The production configuration is different and lives in a separate file.
module.exports = {
  // You may want 'eval' instead if you prefer to see the compiled output in DevTools.
  // See the discussion in https://github.com/facebookincubator/create-react-app/issues/343.
  devtool: 'cheap-module-source-map',
  // These are the "entry points" to our application.
  // This means they will be the "root" imports that are included in JS bundle.
  // The first two entry points enable "hot" CSS and auto-refreshes for JS.
  entry: [],
  output: {
    // Next line is not used in dev but WebpackDevServer crashes without it:
    path: paths.appBuild,
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: true,
    // This is the URL that app is served from. We use "/" in development.
    publicPath: publicPath
  },
  resolve: {
    // This allows you to set a fallback for where Webpack should look for modules.
    // We read `NODE_PATH` environment variable in `paths.js` and pass paths here.
    // We use `fallback` instead of `root` because we want `node_modules` to "win"
    // if there any conflicts. This matches Node resolution mechanism.
    // https://github.com/facebookincubator/create-react-app/issues/253
    modules: paths.nodePaths,
    // These are the reasonable defaults supported by the Node ecosystem.
    // We also include JSX as a common component filename extension to support
    // some tools, although we do not recommend using it, see:
    // https://github.com/facebookincubator/create-react-app/issues/290
    extensions: ['.js', '.json', '.jsx'],

    alias: {
      fw: path.resolve(BASE_PATH, './src/framework'),
    },
  },

  module: {
    rules: setupRules(),
  },

  plugins: setupPlugins(),
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    process: false,
    // buffer: 'empty',
    // Buffer: 'empty',
    // 'buffer-shims': 'empty'

  }
};


function setupRules () {
  return [
    // First, run the linter.
    // It's important to do this before Babel processes the JS.
    {
       enforce: 'pre',
       test: /\.(js|jsx)$/,
       loader: 'eslint-loader',
       include: paths.appSrc,
     },
    // Default loader: load all assets that are not handled
    // by other loaders with the url loader.
    // Note: This list needs to be updated with every change of extensions
    // the other loaders match.
    // E.g., when adding a loader for a new supported file extension,
    // we need to add the supported extension to this loader too.
    // Add one new line in `exclude` for each loader.
    //
    // "file" loader makes sure those assets get served by WebpackDevServer.
    // When you `import` an asset, you get its (virtual) filename.
    // In production, they would get copied to the `build` folder.
    // "url" loader works like "file" loader except that it embeds assets
    // smaller than specified limit in bytes as data URLs to avoid requests.
    // A missing `test` is equivalent to a match.
    {
      exclude: [
        /\.html$/,
        /\.(js|jsx)$/,
        /\.(css|scss|sass)$/,
        /\.json$/,
        /\.svg$/
      ],
      loader: 'url-loader',
      query: {
        limit: 10000,
        name: 'static/media/[name].[hash:8].[ext]'
      }
    },
    // Process JS with Babel.
    {
      test: /\.(js|jsx)$/,
      include: paths.appSrc,
      loader: 'babel-loader',
      query: {

        // This is a feature of `babel-loader` for webpack (not Babel itself).
        // It enables caching results in ./node_modules/.cache/babel-loader/
        // directory for faster rebuilds.
        cacheDirectory: true
      }
    },
    // "postcss" loader applies autoprefixer to our CSS.
    // "css" loader resolves paths in CSS and adds assets as dependencies.
    // "style" loader turns CSS into JS modules that inject <style> tags.
    // In production, we use a plugin to extract that CSS to a file, but
    // in development "style" loader enables hot editing of CSS.
    // {
    //   test: /\.css$/,
    //   // loader: 'style!css?importLoaders=1!postcss'
    // },

    // {
    //   test: /\.(css|scss|sass)$/,
    //   loader: ExtractTextPlugin.extract({
    //     fallbackLoader: "style-loader",
    //     loader: ["css-loader", 'sass-loader', 'postcss-loader']
    //   }),
    //
    //   // loaders: [
    //   //   'style-loader',
    //   //   'css-loader',
    //   //   'postcss-loader',
    //   //   'sass-loader'
    //   // ]
    // },

    // {
    //   loader: 'postcss-loader',
    //   options: {
    //     plugins: () => [
    //       autoprefixer({
    //         browsers: [
    //           '>1%',
    //           'last 4 versions',
    //           'Firefox ESR',
    //           'not ie < 9', // Inferno doesn't support IE8 anyway
    //         ]
    //       }),
    //     ]
    //   }
    // },

    // JSON is not enabled by default in Webpack but both Node and Browserify
    // allow it implicitly so we also enable it.
    {
      test: /\.json$/,
      loader: 'json-loader'
    },
    // "file" loader for svg
    {
      test: /\.svg$/,
      loader: 'file-loader',
      query: {
        name: 'static/media/[name].[hash:8].[ext]'
      }
    }
  ]
}


function setupPlugins () {
  return [
    // Note: this won't work without ExtractTextPlugin.extract(..) in `loaders`.
    // new ExtractTextPlugin('static/css/[name].[contenthash:8].css'),

    // We use PostCSS for autoprefixing only.
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          autoprefixer({
            browsers: [
              '>1%',
              'last 4 versions',
              'Firefox ESR',
              'not ie < 9', // Inferno doesn't support IE8 anyway
            ]
          }),
        ]
      }
    }),

    // collect all vendors into a separate bundle
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      minChunks (m) {

        // this assumes your vendor imports exist in the node_ms directory
        return m.context && m.context.indexOf('node_modules') !== -1;
       }
    }),

    // Makes the public URL available as %PUBLIC_URL% in index.html, e.g.:
    // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    // In production, it will be an empty string unless you specify "homepage"
    // in `package.json`, in which case it will be the pathname of that URL.
    new InterpolateHtmlPlugin({
      PUBLIC_URL: publicUrl
    }),

    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'development') { ... }. See `./env.js`.
    new webpack.DefinePlugin(env),
  ]
}
