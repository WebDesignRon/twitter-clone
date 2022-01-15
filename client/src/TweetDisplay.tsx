import React from 'react';
import { Tweet } from './DataTypes';
import TweetActions from './TweetActions';

// FIXME: token をリレーしているので context に移行する
const TweetDisplay: React.FC<{
  tweet: Tweet;
  token: string;
  editTweetState: (tweetState: Partial<Tweet>) => void;
}> = ({ tweet, token, editTweetState }) => {
  const {
    id: tweetId,
    user,
    message,
    likes,
    retweets,
    replies,
    is_liked: isLiked,
    is_retweeted: isRetweeted,
  } = tweet;

  return (
    <div className="flex items-stretch border-b p-2.5 outline-none">
      <div className="mx-2.5 shrink-0">
        <img className="rounded-full w-12" src={user.icon} alt="" />
      </div>
      <div className="grow">
        <div>
          <span className="text-black text-l font-bold">
            {user.display_name}
          </span>
          <span className="text-black text-l">@{user.username}</span>
        </div>
        <div className="my-0.5">
          <span className="text-black whitespace-pre-wrap break-all">
            {message}
          </span>
        </div>
        <TweetActions
          tweetId={tweetId}
          likes={likes}
          retweets={retweets}
          replies={replies}
          isLiked={isLiked}
          isRetweeted={isRetweeted}
          token={token}
          editTweetState={editTweetState}
        />
      </div>
    </div>
  );
};

export default TweetDisplay;
