import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { User } from '../DataTypes';
import { AuthContext } from './authContext';

export interface IUserInfoContext extends User {
  isLoading: boolean;
  setUserInfo: (user: User) => void;
  deleteUserInfo: () => void;
}

export const UserInfoContext = React.createContext<IUserInfoContext>({
  id: '',
  username: '',
  display_name: '',
  bio: '',
  location: '',
  website: '',
  follows: 0,
  followers: 0,
  is_following: false,
  date_joined: '',
  isLoading: false,
  setUserInfo: () => {},
  deleteUserInfo: () => {},
});

export const UserInfoProvider: React.FC = ({ children }) => {
  const auth = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<User>({
    id: '',
    username: '',
    display_name: '',
    bio: '',
    location: '',
    website: '',
    follows: 0,
    followers: 0,
    is_following: false,
    date_joined: '',
  });

  const deleteUserInfo = useCallback(() => {
    setUserInfo({
      id: '',
      username: '',
      display_name: '',
      bio: '',
      location: '',
      website: '',
      follows: 0,
      followers: 0,
      is_following: false,
      date_joined: '',
    });
  }, []);

  useEffect(() => {
    if (auth.authorizationKey === null || auth.authorizationKey === '') return;
    setIsLoading(true);
    fetch('http://localhost:8080/users/me', {
      headers: {
        Authorization: `Bearer ${auth.authorizationKey}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status >= 400) {
          throw new Error('Bad response from server');
        }
        return res.json();
      })
      .then((user: User) => {
        setUserInfo(user);
        setIsLoading(false);
      });
  }, [auth.authorizationKey]);

  const userInfoContextValue: IUserInfoContext = useMemo(
    () => ({
      ...userInfo,
      isLoading,
      setUserInfo,
      deleteUserInfo,
    }),
    [userInfo, isLoading, setUserInfo, deleteUserInfo],
  );

  return (
    <UserInfoContext.Provider value={userInfoContextValue}>
      {!isLoading && children}
    </UserInfoContext.Provider>
  );
};
