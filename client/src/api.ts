import axios from 'axios';
import { Tweet } from './DataTypes';

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
  results: Tweet[];
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
): Promise<Tweet> => {
  const response = await twitterBaseAPI.get(`tweets/${tweetId}`, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
