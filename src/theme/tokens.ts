/**
 * CAISSA design tokens.
 * Keep visual decisions centralized here; components should consume semantic roles.
 */
export const colors = {
  dark: {
    background: "#101318",
    surface: "#171C23",
    elevated: "#202731",
    text: "#F4F1E9",
    textSecondary: "#AAB3BD",
    accent: "#C5A46D",
    accentPressed: "#D5B982",
    divider: "#303945",
    success: "#72B58A",
    danger: "#D97979",
    boardLight: "#D8D0BE",
    boardDark: "#78866F",
    boardSelected: "#C5A46D",
    boardLegalMove: "#AABF91",
  },
  light: {
    background: "#F5F4F0",
    surface: "#FFFFFF",
    elevated: "#EAE9E4",
    text: "#171B20",
    textSecondary: "#59636E",
    accent: "#765522",
    accentPressed: "#62451B",
    divider: "#D9D8D2",
    success: "#287448",
    danger: "#B33D3D",
    boardLight: "#EEE7D8",
    boardDark: "#829078",
    boardSelected: "#B58A42",
    boardLegalMove: "#526E48",
  },
} as const;

export const spacing = {
  xxs: 2, xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48,
} as const;

export const radii = {
  small: 8, medium: 12, large: 18, pill: 999,
} as const;

export const typography = {
  caption: 12, footnote: 13, body: 17, title: 22, largeTitle: 32,
} as const;

export const layout = {
  minimumTouchTarget: 44,
  contentMaxWidth: 1200,
  phoneHorizontalInset: 20,
  tabletHorizontalInset: 32,
  desktopHorizontalInset: 40,
} as const;

export type ColorSchemeTokens = typeof colors.dark;
