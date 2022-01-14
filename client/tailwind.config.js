module.exports = {
  purge: {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    safelist: [
      'bg-twitterBlue',
      'hover:bg-twitterBlueHover',
      'bg-twitterYellow',
      'hover:bg-twitterYellowHover',
      'bg-twitterPink',
      'hover:bg-twitterPinkHover',
      'bg-twitterPurple',
      'hover:bg-twitterPurpleHover',
      'bg-twitterOrange',
      'hover:bg-twitterOrangeHover',
      'bg-twitterGreen',
      'hover:bg-twitterGreenHover',
    ],
  },
  theme: {
    extend: {
      width: {
        150: '37.5rem',
      },
      borderWidth: {
        10: '10px',
      },
      colors: {
        twitterBlue: '#1d9bf0',
        twitterBlueHover: '#1a8cd8',
        twitterYellow: '#ffd400',
        twitterYellowHover: '#e6bf00',
        twitterPink: '#f91880',
        twitterPinkHover: '#e01673',
        twitterPurple: '#7856ff',
        twitterPurpleHover: '#6c4de6',
        twitterOrange: '#ff7a00',
        twitterOrangeHover: '#e66e00',
        twitterGreen: '#00ba7c',
        twitterGreenHover: '#00a770',
      },
    },
  },
  plugins: [],
};
