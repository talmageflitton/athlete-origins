import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      colors: {
        apple: {
          blue: '#007AFF',
          'blue-dark': '#0A84FF',
          green: '#34C759',
          'green-dark': '#30D158',
          orange: '#FF9500',
          'orange-dark': '#FF9F0A',
          red: '#FF3B30',
          'red-dark': '#FF453A',
          yellow: '#FFCC00',
          'yellow-dark': '#FFD60A',
          purple: '#AF52DE',
          'purple-dark': '#BF5AF2',
          pink: '#FF2D55',
          'pink-dark': '#FF375F',
          teal: '#5AC8FA',
          indigo: '#5856D6',
          // Neutral
          bg: '#F2F2F7',
          'bg-dark': '#000000',
          card: '#FFFFFF',
          'card-dark': '#1C1C1E',
          'card2': '#F2F2F7',
          'card2-dark': '#2C2C2E',
          'card3': '#E5E5EA',
          'card3-dark': '#3A3A3C',
          label: '#000000',
          'label-dark': '#FFFFFF',
          'label2': '#3C3C43',
          'label2-dark': '#EBEBF5',
          secondary: '#8E8E93',
          'secondary-dark': '#636366',
          tertiary: '#C7C7CC',
          'tertiary-dark': '#48484A',
          separator: 'rgba(60,60,67,0.18)',
          'separator-dark': 'rgba(84,84,88,0.36)',
        },
      },
      borderRadius: {
        apple: '12px',
        'apple-lg': '16px',
        'apple-xl': '20px',
        'apple-2xl': '28px',
      },
      boxShadow: {
        apple: '0 2px 12px rgba(0,0,0,0.08)',
        'apple-md': '0 4px 24px rgba(0,0,0,0.12)',
        'apple-lg': '0 8px 40px rgba(0,0,0,0.16)',
        'apple-blue': '0 4px 16px rgba(0,122,255,0.3)',
        'apple-green': '0 4px 16px rgba(52,199,89,0.3)',
      },
      animation: {
        'slide-up': 'slideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'slide-down': 'slideDown 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'scale-out': 'scaleOut 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'shake': 'shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) forwards',
        'bounce-in': 'bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'fade-in': 'fadeIn 0.3s ease forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'number-up': 'numberUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'confetti-fall': 'confettiFall 1s ease-in forwards',
        'streak-fire': 'streakFire 1s ease-in-out infinite alternate',
        'card-flip': 'cardFlip 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.85)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        scaleOut: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.85)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '15%': { transform: 'translateX(-6px)' },
          '30%': { transform: 'translateX(6px)' },
          '45%': { transform: 'translateX(-4px)' },
          '60%': { transform: 'translateX(4px)' },
          '75%': { transform: 'translateX(-2px)' },
          '90%': { transform: 'translateX(2px)' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0,122,255,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0,122,255,0.6)' },
        },
        numberUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        confettiFall: {
          '0%': { transform: 'translateY(-20px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(200px) rotate(720deg)', opacity: '0' },
        },
        streakFire: {
          '0%': { transform: 'scale(1) rotate(-3deg)' },
          '100%': { transform: 'scale(1.1) rotate(3deg)' },
        },
        cardFlip: {
          '0%': { transform: 'rotateY(-90deg)', opacity: '0' },
          '100%': { transform: 'rotateY(0deg)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
