import defaultTheme from "tailwindcss/defaultTheme";
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    // "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      container: {
        center: true,
        screens: {
          lg: "1124px",
          xl: "1124px",
          "2xl": "1124px",
        },
        colors: {
          primary: defaultTheme.colors.green
        }
      },
    },
  },
  corePlugins: {
    textOpacity: false,
    backgroundOpacity: false,
    borderOpacity: false,
    divideOpacity: false,
    placeholderOpacity: false,
    ringOpacity: false,
  },
  plugins: [],
};
