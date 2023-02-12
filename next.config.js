module.exports = {
    reactStrictMode: true,
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
    },
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    future: {
        webpack5: true,
    },
    webpack: (config) => {
        // load worker files as a urls with `file-loader`
        config.module.rules.unshift({
            test: /pdf\.worker\.(min\.)?js/,
            use: [
                {
                    loader: "file-loader",
                    options: {
                        name: "[contenthash].[ext]",
                        publicPath: "_next/static/worker",
                        outputPath: "static/worker",
                    },
                },
            ],
        });

        return config;
    },
};
