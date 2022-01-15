export type UUID = string;
export type Datetime = string;

export interface User {
  id: UUID;
  username: string;
  display_name: string;
  bio: string;
  location: string;
  website: string;
  birth_date?: string;
  icon?: string;
  header?: string;
  follows: number;
  followers: number;
  is_following: boolean;
  date_joined: Datetime;
}

export interface Friend {
  followee: User;
  follower: User;
  followed_at: Datetime;
}

export interface Tweet {
  id: number;
  user: User;
  message?: string;
  quoted_tweet_id: number | null;
  likes: number[];
  retweets: number;
  replies: number;
  is_liked: number;
  is_retweeted: boolean;
  created_at: Datetime;
}

export interface Media {
  url: string;
  createdAt: Datetime;
}

export const LikeType = {
  hoshi1: 1,
  hoshi2: 2,
  hoshi3: 3,
  hoshi4: 4,
  hoshi5: 5,
} as const;

export interface Like {
  id: number;
  like_type: typeof LikeType[keyof typeof LikeType];
  created_at: Datetime;
}

export interface Retweet {
  id: number;
  quoted_tweet_id: number;
  created_at: Datetime;
}
