import React, { useState, useEffect } from 'react';
import { Tweet } from './DataTypes';
import TweetDisplay from './TweetDisplay';
import DoTweetBox from './DoTweetBox';
import { sampleTweetData, sampleUserCredentials } from './sampleTweetData';
import { getBearerToken, getTimeLine, getTweet } from './api';

const TweetScroller: React.FC = () => {
  const [bearerToken, setBearerToken] = useState('');
  const [tweets, setTweets] = useState<Tweet[]>([]);

  useEffect(() => {
    (async () => {
      const { username, password } = sampleUserCredentials;
      const token = await getBearerToken(username, password);
      console.log('token', token);
      setBearerToken(token.access);
    })();
  }, []);

  useEffect(() => {
    if (bearerToken === '') return;

    (async () => {
      const { username } = sampleUserCredentials;
      const timelineTweets = (await getTimeLine(username, bearerToken, 1, 20))
        .results;
      console.log('timelineTweets', timelineTweets);

      // FIXME: リツイートは元ツイートをそのまま表示している
      const displayedTweets = await Promise.all(
        timelineTweets.map(async (tweet) => {
          const { quoted_tweet_id: quotedTweetId } = tweet;
          if (quotedTweetId === null) return tweet;
          const quotedTweet = await getTweet(quotedTweetId, bearerToken);
          return { ...quotedTweet, id: tweet.id };
        }),
      );
      setTweets(displayedTweets);
    })();
  }, [bearerToken]);

  const submitTweet = (tweetText: string) => {
    // ツイート内容のみ反映したダミーデータ
    const tweet: Tweet = {
      ...sampleTweetData,
      message: tweetText,
      created_at: new Date().toISOString(),
    } as const;

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
      token={bearerToken}
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
