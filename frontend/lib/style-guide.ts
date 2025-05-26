// PhishGuard Style Guide
export const styleGuide = {
  // Color Palette
  colors: {
    // Primary accent - Electric teal
    primary: "#4FD1C5",
    primaryHover: "#38B2AC",
    primaryDark: "#2C7A7B",

    // Background gradients
    cardGradient: "linear-gradient(135deg, #1F2937 0%, #111827 100%)",
    heroGradient: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)",

    // Status colors
    success: "#10B981",
    successLight: "#34D399",
    danger: "#EF4444",
    dangerLight: "#F87171",
    warning: "#F59E0B",

    // Neutral colors
    background: "#0F172A",
    surface: "#1E293B",
    surfaceLight: "#334155",
    border: "#475569",
    text: "#F8FAFC",
    textMuted: "#94A3B8",
    textLight: "#CBD5E1",
  },

  // Typography
  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
    scale: 1.125,
    sizes: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
    },
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  // Spacing (8px grid)
  spacing: {
    xs: "0.5rem", // 8px
    sm: "1rem", // 16px
    md: "1.5rem", // 24px
    lg: "2rem", // 32px
    xl: "3rem", // 48px
    "2xl": "4rem", // 64px
  },

  // Shadows
  shadows: {
    card: "0 4px 12px rgba(0, 0, 0, 0.2)",
    cardHover: "0 8px 24px rgba(0, 0, 0, 0.3)",
    button: "0 2px 8px rgba(79, 209, 197, 0.2)",
    buttonHover: "0 4px 16px rgba(79, 209, 197, 0.3)",
  },

  // Border radius
  radius: {
    sm: "0.375rem", // 6px
    md: "0.75rem", // 12px
    lg: "1rem", // 16px
    xl: "1.5rem", // 24px
  },

  // Transitions
  transitions: {
    fast: "150ms ease-in-out",
    normal: "250ms ease-in-out",
    slow: "350ms ease-in-out",
  },
}
