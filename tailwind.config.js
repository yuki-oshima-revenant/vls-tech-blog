module.exports = {
    purge: ['./pages/**/*.{js,ts,jsx,tsx}', './lib/**/*.{js,ts,jsx,tsx}'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {},
        fontFamily: {
            'sans': ['Inter', 'Hiragino Sans', 'Noto Sans JP', 'system-ui', 'sans-serif'],
        }
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
