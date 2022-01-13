import React, { useMemo } from 'react';

export interface IThemeContext {
  theme: 'lightTheme' | 'darkTheme' | 'blackTheme';
  color:
    | 'twitterBlue'
    | 'twitterYellow'
    | 'twitterPink'
    | 'twitterPurple'
    | 'twitterOrange'
    | 'twitterGreen';
  fontSize: 'fontSmall' | 'fontMedium' | 'fontLarge';
  setTheme: (theme: IThemeContext['theme']) => void;
  setColor: (color: IThemeContext['color']) => void;
  setFontSize: (fontSize: IThemeContext['fontSize']) => void;
}

export const ThemeContext = React.createContext<IThemeContext>({
  theme: 'lightTheme',
  color: 'twitterBlue',
  fontSize: 'fontSmall',
  setTheme: () => {},
  setColor: () => {},
  setFontSize: () => {},
});

export const ThemeProvider: React.FC = ({ children }) => {
  const [theme, setTheme] =
    React.useState<IThemeContext['theme']>('lightTheme');
  const [color, setColor] =
    React.useState<IThemeContext['color']>('twitterBlue');
  const [fontSize, setFontSize] =
    React.useState<IThemeContext['fontSize']>('fontSmall');

  const themeContextValue: IThemeContext = useMemo(
    () => ({
      theme,
      color,
      fontSize,
      setTheme,
      setColor,
      setFontSize,
    }),
    [theme, color, fontSize],
  );

  return (
    <ThemeContext.Provider value={themeContextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
