import React, { useCallback, useMemo } from 'react';

export interface IAuthContext {
  setAuthorizationKey: (key: string) => void;
  isAuthenticated: boolean;
  authorizationKey: string | null;
  logout: () => void;
}

export const AuthContext = React.createContext<IAuthContext>({
  setAuthorizationKey: () => {},
  isAuthenticated: false,
  authorizationKey: null,
  logout: () => {},
});

export const AuthProvider: React.FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [authorizationKey, setAuthorizationKey] = React.useState<string | null>(
    null,
  );

  const setAuthKey = useCallback((key: string) => {
    setAuthorizationKey(key);
    setIsAuthenticated(true);
    localStorage.setItem('authorizationKey', key);
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setAuthorizationKey(null);
    localStorage.removeItem('authorizationKey');
  }, []);

  const authContextValue: IAuthContext = useMemo(
    () => ({
      setAuthorizationKey: setAuthKey,
      isAuthenticated,
      authorizationKey,
      logout,
    }),
    [setAuthKey, isAuthenticated, authorizationKey, logout],
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
