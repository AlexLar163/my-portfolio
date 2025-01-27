/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  safelist: [
    'font-onest-variant',
    'font-sora-variant',
  ],
  theme: {
    extend: {
      backgroundColor: {
        black: {
          primary: "#151419",
        },
      },
      backgroundImage: {
        "radial-dots":
          "radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)", 
      },
      backgroundSize: {
        "size-30": "30px 30px",
      },
      fontFamily: {
        'onest-variant': ['"Onest Variable"', 'sans-serif'],
        'sora-variant': ['"Sora Variable"', 'sans-serif'],
      },
      keyframes: {
        typing: {
          "0%": {
            width: "0%",
            visibility: "hidden",
          },
          "100%": {
            width: "100%",
          },
        },
        blink: {
          "50%": {
            borderColor: "transparent",
          },
          "100%": {
            borderColor: "white",
          },
        },
        'ping-large': {
          '75%, 100%': {
            transform: 'scale(2.5)',
            opacity: '0',
          },
        },
      },
      animation: {
        typing: "typing 2s steps(20) alternate, blink .7s infinite",
        'ping': 'ping-large 2s cubic-bezier(0, 0, 0.1, 1) infinite',
      },
    },
  },
  plugins: [],
};
