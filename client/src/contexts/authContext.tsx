import React, { useCallback, useEffect, useMemo, useState } from 'react';

export interface IAuthContext {
  setAuthorizationKey: (key: string) => void;
  restoreAuthorizationKey: () => boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  authorizationKey: string | null;
  logout: () => void;
}

export const AuthContext = React.createContext<IAuthContext>({
  setAuthorizationKey: () => {},
  restoreAuthorizationKey: () => false,
  isLoading: false,
  isAuthenticated: false,
  authorizationKey: null,
  logout: () => {},
});

export const AuthProvider: React.FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authorizationKey, setAuthorizationKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const setAuthKey = useCallback((key: string) => {
    setAuthorizationKey(key);
    setIsAuthenticated(true);
    localStorage.setItem('authorizationKey', key);
  }, []);

  const restoreAuthorizationKey = useCallback(() => {
    const key = localStorage.getItem('authorizationKey');
    if (!key) return false;
    fetch('http://localhost:8080/users/me', {
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      if (res.status >= 400) {
        throw new Error('Bad response from server');
      }
      setAuthorizationKey(key);
      setIsAuthenticated(true);
    });
    return true;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setAuthorizationKey(null);
    localStorage.removeItem('authorizationKey');
  }, []);

  useEffect(() => {
    setIsLoading(true);
    restoreAuthorizationKey();
    setIsLoading(false);
  }, [restoreAuthorizationKey]);

  const authContextValue: IAuthContext = useMemo(
    () => ({
      setAuthorizationKey: setAuthKey,
      restoreAuthorizationKey,
      isLoading,
      isAuthenticated,
      authorizationKey,
      logout,
    }),
    [
      setAuthKey,
      isLoading,
      isAuthenticated,
      restoreAuthorizationKey,
      authorizationKey,
      logout,
    ],
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
