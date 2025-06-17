
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.5rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1600px',
      },
    },
    extend: {
      fontFamily: {
        garamond: ['Garamond', 'serif'],
        sans: ['Garamond', 'serif'],
        serif: ['Garamond', 'serif'],
      },
      letterSpacing: {
        tight: '-0.01em',
        normal: '0.01em',
        wide: '0.025em',
      },
      lineHeight: {
        tight: '1.3',
        normal: '1.6',
      },
      maxHeight: {
        full: '100%',
        screen: '100vh',
        'screen-1/2': '50vh',
        'screen-3/4': '75vh',
        'screen-90': '90vh',
      },
      spacing: {
        '0': '0',
        'px': '1px',
        '0.5': '0.125rem',    // 2px
        '1': '0.25rem',      // 4px
        '1.5': '0.375rem',   // 6px
        '2': '0.5rem',       // 8px
        '2.5': '0.625rem',   // 10px
        '3': '0.75rem',      // 12px
        '3.5': '0.875rem',   // 14px
        '4': '1rem',         // 16px
        '5': '1.25rem',      // 20px
        '6': '1.5rem',       // 24px
        '7': '1.75rem',      // 28px
        '8': '2rem',         // 32px
        '9': '2.25rem',      // 36px
        '10': '2.5rem',      // 40px
        '11': '2.75rem',     // 44px
        '12': '3rem',        // 48px
        '14': '3.5rem',      // 56px
        '16': '4rem',        // 64px
        '20': '5rem',        // 80px
        '24': '6rem',        // 96px
        '28': '7rem',        // 112px
        '32': '8rem',        // 128px
        '36': '9rem',        // 144px
        '40': '10rem',       // 160px
        '44': '11rem',       // 176px
        '48': '12rem',       // 192px
        '52': '13rem',       // 208px
        '56': '14rem',       // 224px
        '60': '15rem',       // 240px
        '64': '16rem',       // 256px
        '72': '18rem',       // 288px
        '80': '20rem',       // 320px
        '96': '24rem',       // 384px
        '128': '32rem',      // 512px
      },
      boxShadow: {
        // Subtle shadows for depth
        xs: '0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        sm: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        DEFAULT: '0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -2px rgba(0, 0, 0, 0.02)',
        md: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.03)',
        lg: '0 20px 25px -5px rgba(0, 0, 0, 0.06), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
        xl: '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
        '2xl': '0 50px 100px -20px rgba(0, 0, 0, 0.1), 0 30px 60px -30px rgba(0, 0, 0, 0.12)',
        // Special shadows
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
        'elevation-1': '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.04)',
        'elevation-2': '0 3px 6px rgba(0,0,0,0.08), 0 3px 6px rgba(0,0,0,0.06)',
        'elevation-3': '0 10px 20px rgba(0,0,0,0.08), 0 6px 6px rgba(0,0,0,0.05)',
        'elevation-4': '0 15px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)',
        'elevation-5': '0 20px 40px rgba(0,0,0,0.12), 0 15px 12px rgba(0,0,0,0.04)',
        // Gold glow
        'gold-sm': '0 0 0 1px rgba(212, 175, 55, 0.3)',
        'gold': '0 0 0 2px rgba(212, 175, 55, 0.4)',
        'gold-lg': '0 0 0 3px rgba(212, 175, 55, 0.5)',
        'gold-glow': '0 0 10px 2px rgba(212, 175, 55, 0.3)',
        'gold-glow-lg': '0 0 20px 5px rgba(212, 175, 55, 0.3)',
        // Inner shadows
        'inner-sm': 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
        'inner-lg': 'inset 0 4px 6px 0 rgba(0, 0, 0, 0.05)',
        'none': 'none',
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        none: '0px',
        sm: '0.125rem',   // 2px
        DEFAULT: '0.25rem', // 4px
        md: '0.375rem',   // 6px
        lg: '0.5rem',     // 8px
        xl: '0.75rem',    // 12px
        '2xl': '1rem',    // 16px
        '3xl': '1.5rem',  // 24px
        full: '9999px',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.8s ease-out 0.2s both",
        "slide-up": "slide-up 0.8s ease-out 0.4s both",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
    function({ addUtilities }: { addUtilities: any }) {
      const newUtilities = {
        '.gradient-text': {
          background: 'linear-gradient(90deg, #D4AF37 0%, #F8E6C3 100%)',
          '-webkit-background-clip': 'text',
          'background-clip': 'text',
          'color': 'transparent',
        },
        '.gradient-border': {
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            padding: '1px',
            borderRadius: 'inherit',
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(248, 230, 195, 0.1))',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            pointerEvents: 'none',
          },
        },
        '.gradient-bg': {
          background: 'linear-gradient(135deg, rgba(248, 246, 240, 0.8) 0%, rgba(255, 255, 255, 0.8) 100%)',
        },
        '.dark .gradient-bg': {
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.8) 0%, rgba(31, 41, 55, 0.8) 100%)',
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
} satisfies Config;
