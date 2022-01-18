import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TwitterButton } from '../atoms/button';
import { UserInfoInput } from '../molecules/input';
import { AuthContext } from '../../contexts/authContext';

const UserInfoInputForm: React.VFC = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const onButtonClick = () => {
    fetch('http://localhost:8080/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: name, password }),
    }).then((response) => {
      if (response.status >= 400) {
        throw new Error('Bad response from server');
      }
      fetch('http://localhost:8080/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: name, password }),
      }).then((res) => {
        if (res.status >= 400) {
          throw new Error('Bad response from server');
        }
        res.json().then((json) => {
          auth.setAuthorizationKey(json.access);
        });
      });
    });
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
