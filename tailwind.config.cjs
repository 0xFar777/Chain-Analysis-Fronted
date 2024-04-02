/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#000000",
        secondary: "#ffff00",
        tertiary: "#151030",
        quaternary: "#aaa6c3",
        finally: "#ffffff",
        "black-100": "#100d25",
        "black-200": "#090325",
        "white-100": "#f3f3f3",
      },
      boxShadow: {
        card: "0px 35px 120px -15px #211e35",
      },
      screens: {
        xs: "450px",
      },
      backgroundImage: {
        "bg-home": "url('/src/assets/bg.png')",
        "bg-about": "url('/src/assets/bgabout.png')",
        "bg-roadmap": "url('/src/assets/bgroadmap.png')",
        "bg-volunteer": "url('/src/assets/bgvolunteer.png')",
        "bg-partner": "url('/src/assets/bgpartner.png')",
        world: "url('src/assets/world.png')",
      },
    },
  },
  plugins: [],
};
