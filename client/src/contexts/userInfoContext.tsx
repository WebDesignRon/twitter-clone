import React, { useCallback, useMemo } from 'react';
import { User } from '../DataTypes';

export interface IUserInfoContext extends User {
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
  setUserInfo: () => {},
  deleteUserInfo: () => {},
});

export const UserInfoProvider: React.FC = ({ children }) => {
  const [userInfo, setUserInfo] = React.useState<User>({
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

  const userInfoContextValue: IUserInfoContext = useMemo(
    () => ({
      ...userInfo,
      setUserInfo,
      deleteUserInfo,
    }),
    [userInfo, setUserInfo, deleteUserInfo],
  );

  return (
    <UserInfoContext.Provider value={userInfoContextValue}>
      {children}
    </UserInfoContext.Provider>
  );
};
