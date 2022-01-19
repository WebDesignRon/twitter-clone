import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../DataTypes';
import { TwitterButton } from '../atoms/button';
import { UserInfoInput } from '../molecules/input';
import { AuthContext } from '../../contexts/authContext';
import { UserInfoContext } from '../../contexts/userInfoContext';

const UserInfoInputForm: React.VFC = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const auth = useContext(AuthContext);
  const userInfo = useContext(UserInfoContext);
  const navigate = useNavigate();

  const onButtonClick = async () => {
    const register = await fetch('http://localhost:8080/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: name, password }),
    });
    if (register.status >= 400) {
      // throw new Error('Bad response from server');
    }

    const tokenResponse = await fetch('http://localhost:8080/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: name, password }),
    });
    if (tokenResponse.status >= 400) {
      throw new Error('Bad response from server');
    }
    const token: { access: 'string' } = await tokenResponse.json();

    auth.setAuthorizationKey(token.access);
    const userInfoResponse = await fetch('http://localhost:8080/users/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.access}`,
        'Content-Type': 'application/json',
      },
    });
    if (userInfoResponse.status >= 400) {
      throw new Error('Bad response from server');
    }
    const user: User = await userInfoResponse.json();
    userInfo.setUserInfo(user);

    navigate('/home', { replace: true });
  };

  return (
    <div className="flex flex-col items-center max-w-[300px]">
      <div>
        <UserInfoInput
          name="username"
          maxLength={30}
          labelName="名前"
          additionalClassName="py-3 w-[300px]"
          onChange={(value) => setName(value)}
        />
        <UserInfoInput
          name="password"
          type="password"
          maxLength={30}
          labelName="パスワード"
          additionalClassName="py-3 w-full"
          onChange={(value) => setPassword(value)}
        />
      </div>
      <TwitterButton onClick={onButtonClick} additionalClassName="w-48 my-2">
        <div className="py-1">登録</div>
      </TwitterButton>
    </div>
  );
};

export default UserInfoInputForm;
