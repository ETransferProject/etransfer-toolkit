import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      textColor: {
        primary: '#1a1a1a',
        secondary: '#808080',
        disable: '#d6d6d6',
        border: '#e0e0e0',
        divider: '#f0f0f0',
        'error-normal': '#f53f3f',
        'brand-normal': '#285eff',
        'brand-hover': '#3b6cff',
        'brand-click': '#1e52f0',
        'brand-disable': '#a9bfff',
      },
    },
  },
  plugins: [],
};
export default config;
