import React from 'react';
import { Tweet } from './DataTypes';

const TweetDisplay: React.FC<{ tweet: Tweet }> = ({ tweet }) => {
  const { user, comment } = tweet;

  return (
    <div className="flex items-stretch border-b p-2.5 outline-none">
      <div className="mx-2.5 shrink-0">
        <img className="rounded-full w-12" src={user.icon} alt="" />
      </div>
      <div>
        <div>
          <span className="text-black text-l font-bold">
            {user.display_name}
          </span>
          <span className="text-black text-l">@{user.username}</span>
        </div>
        <div className="my-0.5">
          <span className="text-black whitespace-pre-wrap break-all">
            {comment}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TweetDisplay;
