/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Base Colors
        background: "var(--background)",
        foreground: "var(--foreground)",
        
        // Brand & Accents
        primary: {
          DEFAULT: "#2563eb", // blue-600
          foreground: "#ffffff",
          glow: "rgba(37, 99, 235, 0.5)", // blue glow
        },
        secondary: {
          DEFAULT: "#f59e0b", // amber-500
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "#ef4444", // red-500
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        
        // Custom Cinematic Colors
        'cinema-black': '#000000', // Pure black
        'cinema-dark': '#09090b', // zinc-950
        'cinema-gray': '#18181b', // zinc-900
        'glass-black': 'rgba(0, 0, 0, 0.7)',
        'glass-white': 'rgba(255, 255, 255, 0.1)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.8) 50%, #000000 100%)',
        'glass-gradient': 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(37, 99, 235, 0.5)',
        'glow-sm': '0 0 10px rgba(37, 99, 235, 0.3)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
