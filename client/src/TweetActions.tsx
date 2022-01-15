import React, { useCallback, useMemo } from 'react';
import { likeTweet, retweetTweet, unlikeTweet, unretweetTweet } from './api';
import { Tweet } from './DataTypes';

const TweetActions: React.FC<{
  tweetId: number;
  likes: number[];
  retweets: number;
  replies: number;
  isLiked: number;
  isRetweeted: boolean;
  token: string;
  editTweetState: (tweetState: Partial<Tweet>) => void;
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
  const unlikeTweetAction = useCallback(
    async (i: number) => {
      const preIsLiked = isLiked;
      const preLikeCounts = likes;
      const newLikeCounts = [...likes];
      newLikeCounts[i] -= 1;
      try {
        editTweetState({
          is_liked: 0,
          likes: newLikeCounts,
        });
        await unlikeTweet(tweetId, token);
      } catch (error) {
        editTweetState({
          is_liked: preIsLiked,
          likes: preLikeCounts,
        });
      }
    },
    [editTweetState, isLiked, likes, tweetId, token],
  );
  const likeTweetAction = useCallback(
    async (i: number) => {
      const preIsLiked = isLiked;
      const preLikeCounts = likes;
      const newLikeCounts = [...likes];
      newLikeCounts[i] += 1;
      // 評価はラジオボタン的動作をする
      if (preIsLiked !== 0) {
        // 前回の評価があれば、前回の評価を消す
        newLikeCounts[preIsLiked - 1] -= 1;
      }

      try {
        editTweetState({
          is_liked: i + 1,
          likes: newLikeCounts,
        });
        await likeTweet(tweetId, i + 1, token);
      } catch (error) {
        editTweetState({
          is_liked: preIsLiked,
          likes: preLikeCounts,
        });
      }
    },
    [editTweetState, isLiked, likes, tweetId, token],
  );
  const likeButtons = useMemo(
    () =>
      likes.map((like, i) =>
        // 評価は5段階固定のためkeyにindexを指定
        i + 1 === isLiked ? (
          <button
            className="flex select-none"
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            onClick={() => unlikeTweetAction(i)}
            type="button"
          >
            {i + 1}
            <i className="fas fa-star text-yellow-400 m-auto" />: {like}
          </button>
        ) : (
          // eslint-disable-next-line react/no-array-index-key
          <button
            className="flex select-none"
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            onClick={() => likeTweetAction(i)}
            type="button"
          >
            {i + 1}
            <i className="far fa-star m-auto" />: {like}
          </button>
        ),
      ),
    [likes, isLiked, unlikeTweetAction, likeTweetAction],
  );

  const retweetButton = useMemo(
    () =>
      isRetweeted ? (
        <button
          className="flex select-none"
          onClick={async () => {
            const preRetweetsCount = retweets;
            try {
              editTweetState({
                is_retweeted: false,
                retweets: preRetweetsCount - 1,
              });
              await unretweetTweet(tweetId, token);
            } catch (error) {
              editTweetState({
                is_retweeted: true,
                retweets: preRetweetsCount,
              });
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
            const preRetweetsCount = retweets;
            try {
              editTweetState({
                is_retweeted: true,
                retweets: preRetweetsCount + 1,
              });
              await retweetTweet(tweetId, token);
            } catch (error) {
              editTweetState({
                is_retweeted: false,
                retweets: preRetweetsCount,
              });
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
