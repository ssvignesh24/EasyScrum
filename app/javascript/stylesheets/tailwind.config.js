module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      zIndex: {
        '18': 18,
        '22': 22,
        '24': 24,
        '26': 26,
        '28': 28,
        '32': 32,
        '34': 34,
        '36': 36,
        '38': 38,
        '50': 50,
        '60': 60,
        '70': 70,
      }
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      cursor: ['disabled'],
      backgroundColor: ['disabled'],
    },
  },
  plugins: [],
}
