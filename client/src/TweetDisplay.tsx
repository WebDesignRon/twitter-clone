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
    // created_at: createdAt,
    created_at_formated: createdAtFormated,
  } = tweet;

  return (
    <div className="flex items-stretch border-b py-2.5 px-4 outline-none">
      <div className="mr-2.5 shrink-0">
        <img
          className="rounded-full w-[46px]"
          src={user.icon || `${process.env.PUBLIC_URL}/default-user-image.png`}
          alt=""
        />
      </div>
      <div className="grow">
        <div className="flex shrink">
          <div className="flex shrink max-w-full">
            <div className="text-[14px] text-black font-bold max-w-full">
              {user.display_name}
            </div>
            <div className="text-[14px] text-gray-500"> @{user.username}</div>
          </div>
          <div className="text-[14px] text-gray-500 mx-1">·</div>
          <div className="text-[14px] text-gray-500 truncate">
            {createdAtFormated}
          </div>
        </div>
        <div className="">
          <span className="text-black text-[14px] whitespace-pre-wrap break-all">
            {message}
          </span>
        </div>
        <div className="mt-2">
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
    </div>
  );
};

export default TweetDisplay;
