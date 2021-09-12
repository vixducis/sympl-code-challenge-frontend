module.exports = {
    prefix: '',
    purge: {
        enabled: true,
        content: [
            './src/**/*.{html,ts}',
        ],
        options: {
            safelist: [
              /^bg-.*-100$/,
              /^text-.*-800$/
            ]
        }
    },
    darkMode: 'media', // or 'media' or 'class'
    theme: {
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [],
};