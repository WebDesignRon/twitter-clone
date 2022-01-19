import { Tweet, User } from './DataTypes';

// fizzの初期データ
export const sampleUserData: User = {
  id: '9d7c90bb-2488-4705-9219-000000000005',
  username: 'fizz',
  display_name: 'Fizz',
  bio: '',
  location: '',
  website: '',
  icon: '',
  header: '',
  follows: 2,
  followers: 1,
  is_following: false,
  date_joined: '2020-01-01T09:00:00+09:00',
};

export const sampleTweetData: Tweet = {
  id: 999,
  user: sampleUserData,
  message:
    'ほげほげほ\nほげほげほげほ\nほげほげほ\nげほげほげほげ\nほげほげほげほ\n\n寿限無 寿限無 五劫のすりきれ 海砂利水魚の水行末雲来末風来末食う寝るところに住むところやぶら小路のぶら小路',
  likes: [0, 0, 0, 3, 0],
  retweets: 1,
  replies: 0,
  is_liked: 0,
  is_retweeted: false,
  created_at: '2020-01-20T00:00:00+09:00',
  quoted_tweet_id: null,
};

export const sampleUserCredentials = {
  username: 'fizz',
  password: 'pass',
};
