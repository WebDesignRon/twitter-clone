export type UUID = string;
export type Datetime = string;

export interface User {
  id: UUID;
  username: string;
  display_name: string;
  bio: string;
  location: string;
  website: string;
  birth_date: string;
  icon: string;
  header: string;
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
  user: string;
  comment: string;
  likes: number[];
  retweets: number;
  replies: number;
  is_liked: boolean;
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
  user: User;
  tweet: Tweet;
  like_type: typeof LikeType[keyof typeof LikeType];
}

export interface QuoteTweet {
  user: User;
  tweet: Tweet;
  comment: string;
  created_at: Datetime;
}

export interface ReTweet {
  user: User;
  tweet: Tweet;
}
