import React, { useMemo } from 'react';
import { retweetTweet, unretweetTweet } from './api';
import { Tweet } from './DataTypes';

const TweetActions: React.FC<{
  tweetId: number;
  likes: number[];
  retweets: number;
  replies: number;
  isLiked: number | null;
  isRetweeted: boolean;
  token: string;
  editTweetState: (tweetState: Partial<Tweet>) => void;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
}> = ({
  tweetId,
  likes,
  retweets,
  replies,
  isLiked,
  isRetweeted,
  token,
  editTweetState,
}) => {
  const likeButtons = useMemo(
    () =>
      likes.map((like, i) => (
        // 評価は5段階固定
        // eslint-disable-next-line react/no-array-index-key
        <div className="flex" key={i}>
          {i + 1}
          {i + 1 === isLiked ? (
            <i className="fas fa-star text-yellow-400 m-auto" />
          ) : (
            <i className="far fa-star m-auto" />
          )}
          : {like}
        </div>
      )),
    [likes, isLiked],
  );

  const retweetButton = useMemo(
    () =>
      isRetweeted ? (
        <button
          className="flex select-none"
          onClick={async () => {
            try {
              editTweetState({ is_retweeted: false });
              await unretweetTweet(tweetId, token);
            } catch (error) {
              editTweetState({ is_retweeted: true });
            }
          }}
          type="button"
        >
          <i className="fas fa-retweet text-green-500 m-auto" />: {retweets}
        </button>
      ) : (
        <button
          className="flex select-none"
          onClick={async () => {
            try {
              editTweetState({ is_retweeted: true });
              await retweetTweet(tweetId, token);
            } catch (error) {
              editTweetState({ is_retweeted: false });
            }
          }}
          type="button"
        >
          <i className="fas fa-retweet m-auto" />: {retweets}
        </button>
      ),
    [editTweetState, isRetweeted, retweets, token, tweetId],
  );

  // reply は未実装
  return (
    <div className="flex justify-between">
      <div className="flex">
        <i className="fas fa-reply m-auto" />: {replies}
      </div>
      {retweetButton}
      {likeButtons}
    </div>
  );
};

export default TweetActions;
