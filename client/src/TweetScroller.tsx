import React, { useState, useEffect } from 'react';
import { Tweet } from './DataTypes';
import TweetDisplay from './TweetDisplay';
import DoTweetBox from './DoTweetBox';
import { sampleTweetData, sampleUserCredentials } from './sampleTweetData';
import { getBearerToken, getTimeLine } from './api';

const TweetScroller: React.FC = () => {
  const [bearerToken, setBearerToken] = useState('');
  const [tweets, SetTweets] = useState<Tweet[]>([]);

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
      const timelineTweets = await getTimeLine(username, bearerToken, 1, 20);
      console.log('timelineTweets', timelineTweets);
      SetTweets(timelineTweets.results);
    })();
  }, [bearerToken]);

  const submitTweet = (tweetText: string) => {
    // ツイート内容のみ反映したダミーデータ
    const tweet: Tweet = {
      ...sampleTweetData,
      message: tweetText,
      created_at: Date.now().toString(),
    } as const;

    SetTweets([tweet, ...tweets]);
  };

  const timeline = tweets.map((tweet) => (
    <TweetDisplay key={tweet.id} tweet={tweet} />
  ));

  return (
    <div>
      <DoTweetBox submitTweet={submitTweet} />
      {timeline}
    </div>
  );
};

export default TweetScroller;
