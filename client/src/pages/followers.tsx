/* eslint-disable no-nested-ternary */
import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { User } from '../DataTypes';
import { AuthContext } from '../contexts/authContext';
import { UserInfoContext } from '../contexts/userInfoContext';
import { UserIcon } from '../components/atoms/icon';
import { TwitterButton } from '../components/atoms/button';
import SideNavbar from '../SideNavbar';

const FollowButton: React.VFC<{ user: User }> = ({ user }) => {
  const auth = useContext(AuthContext);
  const userInfo = useContext(UserInfoContext);
  const [isFollowing, setIsFollowing] = useState<boolean>(user.is_following);

  const handleFollow = () => {
    if (auth.authorizationKey === null || auth.authorizationKey === '') return;
    fetch(`http://localhost:8080/users/${user.username}/follow`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth.authorizationKey}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status >= 400) throw new Error('Bad response from server');
        return response.json();
      })
      .then(() => {
        setIsFollowing(true);
      });
  };

  const handleUnfollow = () => {
    if (auth.authorizationKey === null || auth.authorizationKey === '') return;
    fetch(`http://localhost:8080/users/${user.username}/unfollow`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${auth.authorizationKey}`,
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      if (response.status >= 400) throw new Error('Bad response from server');
      setIsFollowing(false);
    });
  };

  return isFollowing ? (
    <TwitterButton
      additionalClassName="min-w-[102px] text-[14px] mb-3 border bg-transparent hover:bg-[#fee8ea] text-gray-700 hover:text-[#f4212e]"
      onClick={() => handleUnfollow()}
    >
      <div className="py-px">フォロー中</div>
    </TwitterButton>
  ) : userInfo.id !== user.id ? (
    <TwitterButton
      additionalClassName="min-w-[102px] text-[14px] mb-3 bg-[#0f1419] hover:bg-[#272c30]"
      onClick={() => handleFollow()}
    >
      <div className="py-px">フォロー</div>
    </TwitterButton>
  ) : (
    <div />
  );
};

const Follows: React.VFC = () => {
  const { username } = useParams();
  const navigater = useNavigate();
  const auth = useContext(AuthContext);
  const [user, setUser] = useState<User>();
  const [users, setUsers] = useState<User[]>([]);
  const [state, setState] = useState<'following' | 'followers'>('followers');

  useEffect(() => {
    if (auth.authorizationKey === null || auth.authorizationKey === '') return;
    fetch(`http://localhost:8080/users/${username}/${state}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.authorizationKey}`,
      },
    })
      .then((response) => {
        if (response.status >= 400) throw new Error('Bad response from server');
        return response.json();
      })
      .then((response) => {
        setUsers(response.results);
      });
  }, [username, auth.authorizationKey, state]);

  useEffect(() => {
    fetch(`http://localhost:8080/users/${username}`)
      .then((response) => {
        if (response.status >= 400) throw new Error('Bad response from server');
        return response.json();
      })
      .then(setUser);
  }, [username]);

  return (
    <div className=" flex flex justify-center h-[200%]">
      <SideNavbar />
      <div className="flex flex-col max-w-[600px] border-x">
        <div className="sticky top-0 bg-white">
          <div className="flex px-4 h-[50px] items-center justify-center w-full mx-auto">
            <button
              onClick={() => navigater(-1)}
              type="button"
              className="flex flex-col min-w-[53px] min-h-8 items-self-stretch items-start"
            >
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="rounded-full min-w-8 min-h-8 text-sm"
              />
            </button>
            <div className="whitespace-nowrap overflow-hidden font-extrabold text-[19px] leading-[23px] w-full">
              {user?.display_name}
            </div>
            <div className="flex flex-col min-w-[53px] min-h-8 items-self-stretch items-start" />
          </div>
        </div>
        <div className="flex items-center justify-around h-[50px] border-b">
          <button
            type="button"
            onClick={() => setState('followers')}
            className="grow hover:bg-[#e7e7e8] h-full duration-150 text-gray-700"
          >
            <div>フォロワー</div>
          </button>
          <button
            type="button"
            onClick={() => setState('following')}
            className="grow hover:bg-[#e7e7e8] h-full duration-150 text-gray-700"
          >
            <div>フォロー中</div>
          </button>
        </div>
        {users.map((u) => (
          <div key={u.id}>
            <div className="flex py-2 px-4 hover:bg-[#f7f7f7] duration-150">
              <div className="mr-3 min-w-[46px]">
                <UserIcon
                  src={
                    u.icon ?? `${process.env.PUBLIC_URL}/default-user-image.png`
                  }
                  additionalClassName="h-[46px] w-[46px] hover:opacity-75 duration-150"
                />
              </div>
              <div className="flex flex-col w-full">
                <div className="flex w-full justify-between leading-[19px]">
                  <Link to={`/users/${u.username}`}>
                    <div className="font-bold text-[16px] hover:underline">
                      {u.display_name}
                    </div>
                    <div className="text-[14px] text-gray-700">
                      @{u.username}
                    </div>
                  </Link>
                  <div>
                    <FollowButton user={u} />
                  </div>
                </div>
                <div className="pt-1">
                  <div className="text-[14px] leading-[19px] text-gray-700">
                    {u.bio}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Follows;
