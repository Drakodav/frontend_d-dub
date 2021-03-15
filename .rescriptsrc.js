module.exports = [
    {
        jest: config => {
            config.setupFiles = ['jest-canvas-mock'];
            config.transformIgnorePatterns = ['/node_modules/(?!(ol|mapbox-to-ol-style|ol-mapbox-style)/).*/']
            return config;
        },
    },
];