import { Tweet, User } from './DataTypes';

export const sampleUserData: User = {
  id: '85346427-f66b-b9d2-6550-0edd4ef8cb9b',
  username: 'hogehoge',
  display_name: 'ほげほげ',
  bio: 'ほげほげです',
  location: '東京都',
  website: 'https://hogehoge.com',
  birth_date: '2000-01-01',
  icon: 'https://pbs.twimg.com/profile_images/1111729635610382336/_65QFl7B_normal.png',
  header: 'https://hogehoge.com/header.png',
  follows: 10,
  followers: 100,
  is_following: true,
  date_joined: '2020-01-01T00:00:00+09:00',
};

export const sampleTweetData: Tweet = {
  id: 1,
  user: sampleUserData.username,
  comment:
    'ほげほげほ\nほげほげほげほ\nほげほげほ\nげほげほげほげ\nほげほげほげほ\n\n寿限無 寿限無 五劫のすりきれ 海砂利水魚の水行末雲来末風来末食う寝るところに住むところやぶら小路のぶら小路',
  likes: [0, 0, 0, 3, 0],
  retweets: 1,
  replies: 0,
  is_liked: false,
  is_retweeted: false,
  created_at: '2020-01-02T00:00:00+09:00',
};
