const webpack = require('webpack');

module.exports = {
    lintOnSave: false,
    configureWebpack: (config) => {
        config.module.rules = config.module.rules.map((rule) => {
            if (rule.oneOf instanceof Array) {
                return {
                    ...rule,
                    oneOf: [{ test: /\.wasm$/, type: 'webassembly/async' }, ...rule.oneOf],
                };
            }
            return rule;
        });
        const fallback = config.resolve.fallback || {};
        Object.assign(fallback, {
            fs: false,
            buffer: require.resolve('buffer'),
            path: require.resolve('path-browserify'),
            stream: require.resolve('stream-browserify'),
        });
        config.resolve.fallback = fallback;
        config.plugins = (config.plugins || []).concat([
            new webpack.ProvidePlugin({
                Buffer: ['buffer', 'Buffer'],
            }),
        ]);
        config.experiments = {
            asyncWebAssembly: true,
        };
    },
};