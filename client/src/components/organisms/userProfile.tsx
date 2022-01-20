/* eslint-disable no-nested-ternary */
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faLink } from '@fortawesome/free-solid-svg-icons';
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons';
import { User } from '../../DataTypes';
import { ThemeContext } from '../../contexts/themeContext';
import { UserInfoContext } from '../../contexts/userInfoContext';
import { AuthContext } from '../../contexts/authContext';
import { TwitterButton } from '../atoms/button';
import { ProfileNavbar } from '../molecules/navbar';
import { UserIcon } from '../atoms/icon';

export const hoge = 1;
export const UserProfile: React.VFC<{
  user: User;
  onNavClick: (key: string) => void;
}> = ({ user, onNavClick }) => {
  const navigater = useNavigate();
  const theme = useContext(ThemeContext);
  const userInfo = useContext(UserInfoContext);
  const auth = useContext(AuthContext);
  const [isFollowing, setIsFollowing] = useState<boolean>(user.is_following);
  const [followers, setFollowers] = useState<number>(user.followers);

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
      .then((response: { followers_count: number }) => {
        setFollowers(response.followers_count);
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
      setFollowers((prev) => prev - 1);
      setIsFollowing(false);
    });
  };

  return (
    <div className="flex flex-col max-w-[600px]">
      <div className={`sticky top-0 bg-${theme.theme}`}>
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
            {user.display_name}
          </div>
          <div className="flex flex-col min-w-[53px] min-h-8 items-self-stretch items-start" />
        </div>
      </div>
      <div>
        <div>
          <img
            src={user.header || `${process.env.PUBLIC_URL}/default-header.png`}
            alt=""
          />
        </div>
        <div className="flex flex-col mb-4 pt-3 px-4">
          <div className="flex justify-between items-start">
            <div className="w-1/4 min-w-[46px] mt-[-15%] h-auto mb-[11px]">
              <UserIcon
                additionalClassName="w-[142px] border-4 border-white"
                src={
                  user.icon ||
                  `${process.env.PUBLIC_URL}/default-user-image.png`
                }
              />
            </div>
            <div className="flex max-w-full items-end flex-wrap">
              {isFollowing ? (
                <TwitterButton
                  additionalClassName="min-w-[102px] text-[14px] mb-3 border bg-transparent hover:bg-[#fee8ea] text-gray-700 hover:text-[#f4212e]"
                  onClick={handleUnfollow}
                >
                  <div className="py-px">フォロー中</div>
                </TwitterButton>
              ) : userInfo.id !== user.id ? (
                <TwitterButton
                  additionalClassName="min-w-[102px] text-[14px] mb-3 bg-[#0f1419] hover:bg-[#272c30]"
                  onClick={handleFollow}
                >
                  <div className="py-px">フォロー</div>
                </TwitterButton>
              ) : (
                <TwitterButton
                  additionalClassName="min-w-[102px] text-[14px] mb-3"
                  onClick={() => {}}
                >
                  <div className="py-px">プロフィール編集</div>
                </TwitterButton>
              )}
            </div>
          </div>
          <div className="flex flex-col mb-3">
            <div className="font-extrabold text-[19px] leading-[23px]">
              {user.display_name}
            </div>
            <div className="text-[14px] text-gray-700 leading-[19px]">
              @{user.username}
            </div>
          </div>
          <div className="mb-3 leading-[19px]">
            <span className="text-[14px] text-gray-700 leading-[19px]">
              {user.bio}
            </span>
          </div>
          <div className="flex text-[14px] text-gray-700 mb-3">
            {user.website ? (
              <div className="mr-3">
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon
                    icon={faLink}
                    className="text-gray-700 mr-1"
                  />
                  <span className={`text-${theme.color} font-medium`}>
                    {user.website.split('//')[1]}
                  </span>
                </a>
              </div>
            ) : null}
            <div className="mr-3">
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="text-gray-700 mr-1"
              />
              <span>{user.date_joined}からTwitterを利用しています</span>
            </div>
          </div>
          <div className="flex text-[14px] text-gray-700 leading-[19px]">
            <Link
              to={`/users/${user.username}/following`}
              className="mr-5 hover:underline cursor-pointer"
            >
              <span className="font-bold">{user.follows}</span>フォロー中
            </Link>
            <Link
              to={`/users/${user.username}/followers`}
              className="hover:underline cursor-pointer"
            >
              <span className="font-bold">{followers}</span>フォロワー
            </Link>
          </div>
        </div>
      </div>
      <ProfileNavbar onClick={onNavClick} />
    </div>
  );
};
