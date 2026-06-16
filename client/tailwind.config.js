/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },

      colors: {
        /* =========================
           BRAND CORE (Refined for LMS)
        ========================= */
        brand: {
          navy: '#1D4ED8',     // Deep, trustworthy blue (replacing dark navy)
          teal: '#0D9488',     // Calm, focused teal (refined for readability)
          aqua: '#22D3EE',     // Energetic, engaging cyan
        },

        /* =========================
           LIGHT THEME (Classroom-inspired)
        ========================= */
        light: {
          background: '#F8FAFC',        // Clean paper-like background
          surface: '#FFFFFF',           // Whiteboard/card surface
          surfaceMuted: '#F1F5F9',      // Subtle gray for depth

          textPrimary: '#1E293B',       // High contrast for readability
          textSecondary: '#64748B',     // Softer for supporting text
          textMuted: '#94A3B8',         // For placeholder/disabled

          primary: '#0D9488',           // Main action color (calming teal)
          primaryHover: '#0F766E',      // Slightly darker on hover

          accent: '#1D4ED8',            // For links and important elements
          accentSoft: '#DBEAFE',        // Light blue background for highlights

          border: '#E2E8F0',            // Clean, subtle borders

          success: '#10B981',           // Confirmation green
          warning: '#F59E0B',           // Attention yellow
          error: '#EF4444',             // Alert red
        },

        /* =========================
           DARK THEME (Night study mode)
        ========================= */
        dark: {
          background: '#0F172A',        // Deep blue-black for reduced eye strain
          surface: '#1E293B',           // Card surfaces
          surfaceMuted: '#334155',      // Differentiated panels

          textPrimary: '#F1F5F9',       // High contrast for night reading
          textSecondary: '#CBD5E1',     // Softer but still readable
          textMuted: '#94A3B8',         // For less important info

          primary: '#14B8A6',           // Brighter teal for dark mode
          primaryHover: '#0D9488',      // Slightly toned down on hover

          accent: '#60A5FA',            // Softer blue for dark mode links
          accentSoft: '#1E3A8A',        // Deep blue for highlights

          border: '#334155',            // Distinct but subtle borders

          success: '#34D399',           // Brighter success for dark mode
          warning: '#FBBF24',           // Warmer warning
          error: '#F87171',             // Softer red for dark mode
        },
      },

      // Adding some custom gradients for modern UI elements
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, var(--tw-gradient-stops))',
        'gradient-accent': 'linear-gradient(135deg, #1D4ED8 0%, #0D9488 100%)',
        'gradient-subtle': 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)',
      },

      // Custom shadows for depth
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'elevated': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },

      // Animation for interactive elements
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}