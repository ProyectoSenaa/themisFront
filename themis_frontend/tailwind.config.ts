import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
  // global muted tokens that map to CSS variables defined in globals.css
  muted: 'var(--muted)',
  'muted-foreground': 'var(--muted-foreground)',
  foreground: 'var(--foreground)',
        hovergray: "#262d38",
        darkBlue: "#00304D",
        hoverBlue: "#004366",
        darkGreen: "#39A900",
        hoverGreen: "#319100",
        bgPurple: "#71277A",
        ligthGreen: "#348B00",
        tittleNav: "#FBFBE2",
        letters: "#ffffff",
        secondaryColor: "rgba(217, 217, 217, 0.6)",
        sendNov: "#6BCEDC",
        inProgress: "#F3AF00",
        rejectedNov: "#FF0000",
        acceptedNov: "#3CB200",
        greenModal: "rgba(60, 239, 60, 0.5)",
        grayBack: "#D9D9D9",
        loadingBlue: "#3498db",
      },
      fontFamily: {
        KiwiMaru: ["Kiwi Maru", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        gowunDodum: ["Gowun Dodum", "sans-serif"],
      },
      spacing: {
        titlePWidth: "392px",
        titlePHeight: "58px",
        cardMarginLeft: "80px",
        cardMarginTop: "50px",
        titleNovelWidth: "281px",
        titleNovelHeight: "36px",
        subTitleNovelWidth: "351px",
        subTitleNovelHeight: "59px",
        searchWidth: "150%",
        searchMargin: "20px",
        searchPadding: "10px",
        buttonWidth: "200px",
        buttonHeight: "20px",
      },
      borderRadius: {
        searchBox: "10px",
        buttonRounded: "10rem",
      },
      boxShadow: {
        searchBox: "0 0 10px rgba(0, 0, 0, 0.1)",
      },
      width: {
        inputSearch: "860%",
        btnSearch: "20%",
      },
      height: {
        inputSearch: "40px",
        btnSearch: "40px",
      },
      transitionProperty: {
        width: "width 0.3s ease",
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fadeIn': 'fadeIn 0.5s ease-in-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-out-left': 'slideOutLeft 0.3s ease-in',
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-out': 'fadeOut 0.3s ease-in',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOutLeft: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      zIndex: {
        '-1': '-1',
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        '.text-shadow-none': {
          textShadow: 'none',
        },
        '.text-shadow-sm': {
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.15)',
        },
        '.text-shadow': {
          textShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
        },
        '.text-shadow-md': {
          textShadow: '0 2px 3px rgba(0, 0, 0, 0.2)',
        },
        '.text-shadow-lg': {
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
        },
        '.text-shadow-xl': {
          textShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
        },
        '.text-shadow-2xl': {
          textShadow: '0 8px 10px rgba(0, 0, 0, 0.4)',
        },
        '.text-shadow-dark': {
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
        },
        '.text-shadow-white': {
          textShadow: '0 2px 4px rgba(255, 255, 255, 0.5)',
        },
        '.text-shadow-glow': {
          textShadow: '0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(255, 255, 255, 0.6)',
        },
        '.text-shadow-primary': {
          textShadow: '0 2px 4px rgba(0, 48, 77, 0.3)', // Usando tu color darkBlue
        },
        '.scrollbar-thin': {
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
        },
        '.scrollbar-thumb-emerald-600': {
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#059669',
            borderRadius: '9999px',
          },
        },
        '.scrollbar-track-transparent': {
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
        },
      };
      addUtilities(newUtilities);
    }),
  ],
};

export default config;