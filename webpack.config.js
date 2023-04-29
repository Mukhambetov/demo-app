const path = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: slsw.lib.entries,
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  target: 'node',
  externals: [
    nodeExternals(),
    {
      // Possible drivers for knex - we'll ignore them
      sqlite3: 'sqlite3',
      mariasql: 'mariasql',
      mssql: 'mssql',
      mysql: 'mysql',
      mysql2: 'mysql2',
      oracle: 'oracle',
      'strong-oracle': 'strong-oracle',
      oracledb: 'oracledb',
      'pg-query-stream': 'pg-query-stream',
      'pg-native': 'pg-native',
    },
  ],
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.tsx?$/, loader: 'ts-loader', options: { transpileOnly: true } },
    ],
  },
};
