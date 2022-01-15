import React from 'react';
import { Tweet } from './DataTypes';

const TweetActions: React.FC<{
  likes: number[];
  retweets: number;
  replies: number;
  isLiked: number | null;
  isRetweeted: boolean;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
}> = ({ likes, retweets, replies, isLiked, isRetweeted }) => {
  const likeButtons = likes.map((like, i) => (
    // 評価は5段階固定
    // eslint-disable-next-line react/no-array-index-key
    <div className="flex" key={i}>
      {i + 1}
      {i + 1 === isLiked ? (
        // 低い評価は暗くなる
        <i className={`fas fa-star text-yellow-${9 - i}00 m-auto`} />
      ) : (
        <i className="far fa-star m-auto" />
      )}
      : {like}
    </div>
  ));

  return (
    <div className="flex justify-between">
      <div className="flex">
        <i className="fas fa-reply m-auto" />: {replies}
      </div>
      <div className="flex">
        {isRetweeted ? (
          <i className="fas fa-retweet text-green-500 m-auto" />
        ) : (
          <i className="fas fa-retweet m-auto" />
        )}
        : {retweets}
      </div>
      {likeButtons}
    </div>
  );
};

const TweetDisplay: React.FC<{ tweet: Tweet }> = ({ tweet }) => {
  const {
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
          likes={likes}
          retweets={retweets}
          replies={replies}
          isLiked={isLiked}
          isRetweeted={isRetweeted}
        />
      </div>
    </div>
  );
};

export default TweetDisplay;
