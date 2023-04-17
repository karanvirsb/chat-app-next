/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  darkMode: "media",
  purge: ["./public/**/*.html", "./src/**/*.{js,jsx,ts,tsx,vue}"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xl: { max: "2000px" },
      lg: { max: "1176px" },
      md: { max: "768px" },
      sm: { max: "480px" },
      xs: { max: "250px" },
      "m-xl": { min: "2000px" },
      "m-lg": { min: "1176px" },
      "m-md": { min: "768px" },
      "m-sm": { min: "480px" },
      "m-xs": { min: "250px" },
    },
    extend: {
      colors: {
        "groupBar-bg": "#242933",
        "groupInfo-bg": "hsl(220, 18%, 15%)",
        "chat-bg": "hsl(220, 18%, 25%)",
        "btn-mutations": "hsla(360, 62%, 59%, 100%)",
        "btn-mutations-text": "hsla(218, 18%, 12%, 100%)",
        "btn-mutations-hover": "hsla(360, 62%, 55%, 100%)",
        "btn-primary": "hsla(219, 18%, 50%, 100%)",
        "btn-primary-hover": "hsla(219, 18%, 35%, 100%)",
        "btn-cta": "hsla(219, 18%, 45%, 100%)",
        "btn-cta-hover": "hsla(219, 18%, 40%, 100%)",
        "accent-color": "hsla(56, 100%, 65%, 100%)",
        "accent-hover": "hsla(56, 90%, 57%, 100%)",
      },
    },
  },
  plugins: [require("daisyui")],
};
