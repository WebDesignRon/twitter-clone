import React, { useState, useEffect } from 'react';
import { Tweet } from './DataTypes';
import TweetDisplay from './TweetDisplay';
import DoTweetBox from './DoTweetBox';
import {
  sampleUserData,
  sampleTweetData,
  sampleUserCredentials,
} from './sampleTweetData';
import { getBearerToken } from './api';

const TweetScroller: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [bearerToken, setBearerToken] = useState('');
  const [tweets, SetTweets] = useState<Tweet[]>([
    sampleTweetData,
    sampleTweetData,
    sampleTweetData,
    sampleTweetData,
    sampleTweetData,
  ]);
  // const [isLoaded, setIsLoaded] = useState(true);
  // const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      const { username, password } = sampleUserCredentials;
      const token = await getBearerToken(username, password);
      console.log('token', token);
      setBearerToken(token.access);
    })();
  }, []);

  const submitTweet = (tweetText: string) => {
    // ツイート内容のみ反映したダミーデータ
    const tweet: Tweet = {
      ...sampleTweetData,
      comment: tweetText,
      created_at: Date.now().toString(),
    } as const;

    SetTweets([tweet, ...tweets]);
  };

  // FIXME: keyをちゃんと指定する
  const timeline = tweets.map((tweet, i) => (
    <TweetDisplay
      key={sampleUserData.username + tweet.created_at + i.toString()}
      tweet={tweet}
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
