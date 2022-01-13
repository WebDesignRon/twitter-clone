import axios from 'axios';

const twitterBaseAPI = axios.create({
  baseURL: 'http://localhost:8080/',
});

// eslint-disable-next-line import/prefer-default-export
export const getBearerToken = async (username: string, password: string) => {
  const bearerTokenResponse = await twitterBaseAPI.post(
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

  return bearerTokenResponse.data;
};
