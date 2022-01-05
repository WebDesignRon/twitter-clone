export type UUID = string;
export type Datetime = string;

export interface User {
  id: UUID;
  username: string;
  displayName: string;
  bio: string;
  location: string;
  website: string;
  birthDate: string;
  icon: string;
  header: string;
  dateJoined: Datetime;
  is_staff: boolean;
  is_active: boolean;
}

export interface Friend {
  followee: User;
  follower: User;
  followedAt: Datetime;
}

export interface Tweet {
  user: User;
  comment: string;
  createdAt: Datetime;
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
  likedAt: Datetime;
  likeType: typeof LikeType[keyof typeof LikeType];
}

export interface QuoteTweet {
  user: User;
  tweet: Tweet;
  comment: string;
  createdAt: Datetime;
}

export interface ReTweet {
  user: User;
  tweet: Tweet;
  retweetedAt: Datetime;
}
