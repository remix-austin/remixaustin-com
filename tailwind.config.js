/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx,jsx,js}",
    "./blog/posts/components/*.tsx",
    "./blog/posts/*.mdx",
  ],
  theme: {
    extend: {
      fontSize: {
        xxs: ["0.625rem", { lineHeight: "1rem" }],
      },
    },
  },
  daisyui: {
    logs: false,
    themes: [
      {
        remixAustinDark: {
          primary: "#818cf8",
          secondary: "#f472b6",
          accent: "#3b82f6",
          neutral: "#312B3B",
          "base-100": "#364453",
          info: "#6BADEB",
          success: "#4EDFB6",
          warning: "#F5CD4D",
          error: "#EF2E68",
        },
      },
    ],
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
