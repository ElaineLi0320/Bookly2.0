const { override, addWebpackAlias } = require("customize-cra");
const webpack = require("webpack");

module.exports = override(
  addWebpackAlias({
    stream: "stream-browserify",
    http: "stream-http",
    https: "https-browserify",
    url: "url",
    querystring: "querystring-es3",
    net: "net-browserify",
    tls: "tls-browserify",
    assert: "assert",
    crypto: "crypto-browserify",
    fs: false,
    child_process: false,
  }),
  (config) => {
    config.resolve.fallback = {
      buffer: require.resolve("buffer/"),
      util: require.resolve("util/"),
      timers: require.resolve("timers-browserify"),
      os: require.resolve("os-browserify/browser"),
      path: require.resolve("path-browserify"),
      crypto: require.resolve("crypto-browserify"),
      assert: require.resolve("assert/"),
      tls: require.resolve("tls-browserify"),
      fs: false,
      child_process: false,
      process: require.resolve("process/browser.js"),
    };

    config.module.rules = config.module.rules.map((rule) => {
      if (rule.use) {
        const use = Array.isArray(rule.use) ? rule.use : [rule.use];
        rule.use = use.filter(
          (u) => !(u.loader && u.loader.includes("source-map-loader"))
        );
      }
      return rule;
    });

    config.plugins = (config.plugins || []).concat([
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
        process: "process/browser.js",
      }),
    ]);

    config.module.rules.forEach((rule) => {
      if (
        rule.use &&
        rule.use.some((u) => u.loader && u.loader.includes("source-map-loader"))
      ) {
        rule.use = rule.use.filter(
          (u) => !u.loader.includes("source-map-loader")
        );
      }
    });

    return config;
  }
);
