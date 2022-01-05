import React, { useState } from 'react';
import { Tweet } from './DataTypes';
import TweetDisplay from './TweetDisplay';
import DoTweetBox from './DoTweetBox';
import sampleTweetData from './sampleTweetData';

const TweetScroller: React.FC = () => {
  // const [bearToken, setBearToken] = useState('');
  const [tweets, SetTweets] = useState<Tweet[]>([
    sampleTweetData,
    sampleTweetData,
    sampleTweetData,
    sampleTweetData,
    sampleTweetData,
  ]);
  // const [isLoaded, setIsLoaded] = useState(true);
  // const [error, setError] = useState(null);

  const submitTweet = (tweetText: string) => {
    // ツイート内容のみ反映したダミーデータ
    const tweet: Tweet = {
      ...sampleTweetData,
      comment: tweetText,
      createdAt: Date.now().toString(),
    } as const;

    SetTweets([tweet, ...tweets]);
  };

  // FIXME: keyをちゃんと指定する
  const timeline = tweets.map((tweet, i) => (
    <TweetDisplay
      key={tweet.user.id + tweet.createdAt + i.toString()}
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
