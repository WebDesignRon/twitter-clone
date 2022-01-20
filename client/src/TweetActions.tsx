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
            className="flex items-center select-none text-gray-500 text-[12px]"
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            onClick={() => unlikeTweetAction(i)}
            type="button"
          >
            <span className="">{i + 1}</span>
            <i className="fas fa-star text-yellow-400 -ml-3.5 text-xl" />
            <span className="px-1">{like > 0 ? like : '  '}</span>
          </button>
        ) : (
          // eslint-disable-next-line react/no-array-index-key
          <button
            className="flex items-center select-none text-gray-500 text-[12px]"
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            onClick={() => likeTweetAction(i)}
            type="button"
          >
            <span className="">{i + 1}</span>
            <i className="far fa-star -ml-3.5 text-xl text-gray-500" />
            <span className="px-1">{like > 0 ? like : '  '}</span>
          </button>
        ),
      ),
    [likes, isLiked, unlikeTweetAction, likeTweetAction],
  );

  const unretweetAction = useCallback(async () => {
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
  }, [editTweetState, retweets, tweetId, token]);
  const retweetAction = useCallback(async () => {
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
  }, [editTweetState, retweets, tweetId, token]);
  const retweetButton = useMemo(
    () =>
      isRetweeted ? (
        <button
          className="flex items-center select-none text-gray-500 text-[12px]"
          onClick={unretweetAction}
          type="button"
        >
          <i className="fas fa-retweet text-lg text-green-500 mr-1" />
          <span>{retweets > 0 ? retweets : '  '}</span>
        </button>
      ) : (
        <button
          className="flex items-center select-none text-gray-500 text-[12px]"
          onClick={retweetAction}
          type="button"
        >
          <i className="fas fa-retweet text-lg text-gray-500 mr-1" />
          <span>{retweets > 0 ? retweets : '  '}</span>
        </button>
      ),
    [isRetweeted, retweetAction, retweets, unretweetAction],
  );

  // reply は未実装
  return (
    <div className="flex justify-around">
      <div className="flex">
        <i className="fas fa-reply mr-1 text-lg text-gray-500" />
        <span>{replies > 0 ? replies : '  '}</span>
      </div>
      {retweetButton}
      {likeButtons}
    </div>
  );
};

export default TweetActions;
