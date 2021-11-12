module.exports = {
    module: {
        rules: [
            {
                test: /\.svg$/,
                use: ['vue-loader', '@svgv/webpack'],
            },
        ],
    },
};
