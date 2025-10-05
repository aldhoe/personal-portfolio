/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // DEFINISIKAN KEYFRAMES ANDA DI SINI
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      // DEFINISIKAN ANIMASI DENGAN KEYFRAMES YANG SUDAH DIBUAT
      animation: {
        'fade-in': 'fade-in 1s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.7s ease-out forwards',
        // Tambahan: Denyut untuk Open to Work kita sudah pakai animate-ping bawaan Tailwind
      },
    },
  },
  plugins: [],
}