import React, { useMemo, useState } from 'react';

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

const useTheme = <T extends string>(name: T): [T, (themeName: T) => void] => {
  const [theme, setTheme] = useState<T>(name);

  const toggleTheme = (themeName: T) => {
    // 将来的にデータベースにも保存するようにする
    setTheme(themeName);
  };

  return [theme, toggleTheme];
};

export const ThemeContext = React.createContext<IThemeContext>({
  theme: 'lightTheme',
  color: 'twitterBlue',
  fontSize: 'fontSmall',
  setTheme: () => {},
  setColor: () => {},
  setFontSize: () => {},
});

export const ThemeProvider: React.FC = ({ children }) => {
  const [theme, setTheme] = useTheme<IThemeContext['theme']>('lightTheme');
  const [color, setColor] = useTheme<IThemeContext['color']>('twitterBlue');
  const [fontSize, setFontSize] =
    useTheme<IThemeContext['fontSize']>('fontSmall');

  const themeContextValue: IThemeContext = useMemo(
    () => ({
      theme,
      color,
      fontSize,
      setTheme,
      setColor,
      setFontSize,
    }),
    [theme, color, fontSize, setTheme, setColor, setFontSize],
  );

  return (
    <ThemeContext.Provider value={themeContextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
