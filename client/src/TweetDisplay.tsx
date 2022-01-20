import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRetweet } from '@fortawesome/free-solid-svg-icons';
import { Tweet, TweetWithFlags } from './DataTypes';
import TweetActions from './TweetActions';

// FIXME: token をリレーしているので context に移行する
const TweetDisplay: React.FC<{
  tweet: TweetWithFlags;
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
    isRetweet,
    retweetUser,
    is_liked: isLiked,
    is_retweeted: isRetweeted,
    // created_at: createdAt,
    created_at_formated: createdAtFormated,
  } = tweet;

  return (
    <div>
      {isRetweet && (
        <div className="text-[14px] flex items-center mt-1.5 ml-4">
          <div className="basis-[46px] flex items-center justify-center">
            <FontAwesomeIcon
              icon={faRetweet}
              className="text-gray-500 basis-[46px]"
            />
          </div>
          <Link to={`/users/${retweetUser?.username}`}>
            <div className="hover:underline">
              {retweetUser?.display_name}さんがリツイート
            </div>
          </Link>
        </div>
      )}
      <div className="flex items-stretch border-b py-2.5 px-4 outline-none">
        <div className="mr-2.5 shrink-0">
          <Link to={`/users/${user.username}`}>
            <img
              className="rounded-full w-[46px] hover:opacity-75 duration-150"
              src={
                user.icon || `${process.env.PUBLIC_URL}/default-user-image.png`
              }
              alt=""
            />
          </Link>
        </div>
        <div className="grow">
          <div className="flex shrink">
            <div className="flex shrink max-w-full group">
              <div className="text-[14px] text-black font-bold max-w-full group-hover:underline">
                <Link to={`/users/${user.username}`}>{user.display_name}</Link>
              </div>
              <div className="text-[14px] text-gray-500">
                <Link to={`/users/${user.username}`}>@{user.username}</Link>
              </div>
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
    </div>
  );
};

export default TweetDisplay;
