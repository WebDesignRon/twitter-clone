import axios from 'axios';
import { Retweet, Like, TweetWithFlags } from './DataTypes';

const twitterBaseAPI = axios.create({
  baseURL: 'http://localhost:8080/',
});

export const getBearerToken = async (
  username: string,
  password: string,
): Promise<{ access: string; refresh: string }> => {
  const response = await twitterBaseAPI.post(
    'token',
    {
      username,
      password,
    },
    {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    },
  );

  return response.data;
};

export const getTimeLine = async (
  username: string,
  token: string,
  page: number,
  perPage: number,
): Promise<{
  count: number;
  next: string;
  previous: string;
  results: TweetWithFlags[];
}> => {
  const response = await twitterBaseAPI.get(`users/${username}/home-timeline`, {
    params: { page, per_page: perPage },
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getTweet = async (
  tweetId: number,
  token: string,
): Promise<TweetWithFlags> => {
  const response = await twitterBaseAPI.get(`tweets/${tweetId}`, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const retweetTweet = async (
  tweetId: number,
  token: string,
): Promise<Retweet> => {
  const response = await twitterBaseAPI.post(
    `tweets/${tweetId}/retweet`,
    {},
    {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const unretweetTweet = async (
  tweetId: number,
  token: string,
): Promise<Record<string, never>> => {
  const response = await twitterBaseAPI.delete(`tweets/${tweetId}/unretweet`, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data; // No Content
};

export const likeTweet = async (
  tweetId: number,
  likeType: number,
  token: string,
): Promise<Like> => {
  const response = await twitterBaseAPI.post(
    `tweets/${tweetId}/like`,
    {
      like_type: likeType,
    },
    {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const unlikeTweet = async (
  tweetId: number,
  token: string,
): Promise<Record<string, never>> => {
  const response = await twitterBaseAPI.delete(`tweets/${tweetId}/unlike`, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data; // No Content
};

export const createTweet = async (
  message: string,
  token: string,
): Promise<TweetWithFlags> => {
  const response = await twitterBaseAPI.post(
    `tweets`,
    {
      message,
    },
    {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
