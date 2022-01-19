import React, { useContext, useState, useEffect } from 'react';
import { Tweet } from './DataTypes';
import TweetDisplay from './TweetDisplay';
import DoTweetBox from './DoTweetBox';
import { getTimeLine, getTweet, createTweet } from './api';
import { AuthContext } from './contexts/authContext';
import { UserInfoContext } from './contexts/userInfoContext';

const TweetScroller: React.FC = () => {
  const auth = useContext(AuthContext);
  const userInfo = useContext(UserInfoContext);
  const [tweets, setTweets] = useState<Tweet[]>([]);

  useEffect(() => {
    (async () => {
      if (auth.authorizationKey === null || !auth.authorizationKey) return;
      const timelineTweets = (
        await getTimeLine(userInfo.username, auth.authorizationKey, 1, 20)
      ).results;

      // FIXME: リツイートは元ツイートをそのまま表示している
      const displayedTweets = await Promise.all(
        timelineTweets.map(async (tweet) => {
          if (auth.authorizationKey === null && !auth.authorizationKey)
            return tweet;
          const { quoted_tweet_id: quotedTweetId } = tweet;
          if (quotedTweetId === null) return tweet;
          const quotedTweet = await getTweet(
            quotedTweetId,
            auth.authorizationKey,
          );
          return { ...quotedTweet, id: tweet.id };
        }),
      );
      setTweets(displayedTweets);
    })();
  }, [auth, userInfo.username]);

  const submitTweet = async (tweetText: string) => {
    if (auth.authorizationKey === null || !auth.authorizationKey) return;
    const tweet = await createTweet(tweetText, auth.authorizationKey);
    setTweets([tweet, ...tweets]);
  };

  const generateEditTweetState: (
    timelineIndex: number,
  ) => (tweet: Partial<Tweet>) => void = (timelineIndex) => {
    const editFunction = (tweet: Partial<Tweet>) => {
      setTweets((prevTweets) => {
        const newTweets = [...prevTweets];
        newTweets[timelineIndex] = { ...newTweets[timelineIndex], ...tweet };
        return newTweets;
      });
    };
    return editFunction;
  };

  const timeline = tweets.map((tweet, i) => (
    <TweetDisplay
      key={tweet.id}
      tweet={tweet}
      token={auth.authorizationKey ?? ''}
      editTweetState={generateEditTweetState(i)}
    />
  ));

  return (
    <div>
      <DoTweetBox submitTweet={submitTweet} />
      {timeline}
    </div>
  );
};

export default TweetScroller;
