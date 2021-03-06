import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TweetWithFlags, User } from '../DataTypes';
import { AuthContext } from '../contexts/authContext';
import { UserProfile } from '../components/organisms/userProfile';
import { getTweet } from '../api';
import TweetDisplay from '../TweetDisplay';
import SideNavbar from '../SideNavbar';
// import { UserInfoContext } from '../contexts/userInfoContext';

const Profile: React.VFC = () => {
  const { username } = useParams();
  const auth = useContext(AuthContext);
  // const userInfo = useContext(UserInfoContext);
  const [user, setUser] = useState<User | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tweets, setTweets] = useState<TweetWithFlags[]>([]);

  const generateEditTweetState: (
    timelineIndex: number,
  ) => (tweet: Partial<TweetWithFlags>) => void = (timelineIndex) => {
    const editFunction = (tweet: Partial<TweetWithFlags>) => {
      setTweets((prevTweets) => {
        const newTweets = [...prevTweets];
        newTweets[timelineIndex] = { ...newTweets[timelineIndex], ...tweet };
        return newTweets;
      });
    };
    return editFunction;
  };

  useEffect(() => {
    if (auth.authorizationKey === null || auth.authorizationKey === '') return;
    setIsLoading(true);
    fetch(`http://localhost:8080/users/${username}`, {
      headers: {
        Authorization: `Bearer ${auth.authorizationKey}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status >= 400) throw new Error('Bad response from server');
        return response.json();
      })
      .then((response: User) => {
        setUser(response);
        setIsLoading(false);
      });
  }, [username, auth.authorizationKey]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      if (auth.authorizationKey === null || !auth.authorizationKey) return;
      const timelineTweets: TweetWithFlags[] = (
        await fetch(`http://localhost:8080/users/${username}/tweets`, {
          headers: {
            Authorization: `Bearer ${auth.authorizationKey}`,
            'Content-Type': 'application/json',
          },
        }).then((response) => {
          if (response.status >= 400)
            throw new Error('Bad response from server');
          return response.json();
        })
      ).results;

      const displayedTweets = await Promise.all(
        timelineTweets.map(async (tweet) => {
          if (auth.authorizationKey === null && !auth.authorizationKey)
            return tweet;
          const { quoted_tweet_id: quotedTweetId } = tweet;
          if (quotedTweetId === null) return tweet;
          const quotedTweet = await getTweet(
            quotedTweetId,
            auth.authorizationKey,
          );
          return {
            ...quotedTweet,
            id: tweet.id,
            isRetweet: true,
            retweetUser: tweet.user,
          };
        }),
      );
      setTweets(displayedTweets);
      setIsLoading(false);
    })();
  }, [auth, username]);

  const onNavClick = (key: string) => {
    if (auth.authorizationKey === null || auth.authorizationKey === '') return;
    fetch(`http://localhost:8080/users/${username}/${key}`, {
      headers: {
        Authorization: `Bearer ${auth.authorizationKey}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status >= 400) throw new Error('Bad response from server');
        return response.json();
      })
      .then((response) => {
        Promise.all(
          response.results.map(async (tweet: TweetWithFlags) => {
            if (auth.authorizationKey === null && !auth.authorizationKey)
              return tweet;
            const { quoted_tweet_id: quotedTweetId } = tweet;
            if (quotedTweetId === null) return tweet;
            const quotedTweet = await getTweet(
              quotedTweetId,
              auth.authorizationKey,
            );
            return {
              ...quotedTweet,
              id: tweet.id,
              isRetweet: true,
              retweetUser: tweet.user,
            };
          }),
        ).then((t: TweetWithFlags[]) => {
          setTweets(t);
        });
      });
  };

  const timeline = tweets.map((tweet, i) => (
    <TweetDisplay
      key={tweet.id}
      tweet={tweet}
      token={auth.authorizationKey ?? ''}
      editTweetState={generateEditTweetState(i)}
    />
  ));

  return (
    <div>
      {!isLoading && user !== undefined && user !== null && (
        <div className=" flex flex justify-center">
          <SideNavbar />
          <div className="m-0 h-[200%] min-h-screen border-x">
            <UserProfile user={user} onNavClick={onNavClick} />
            <div className="max-w-[600px] h-full">{timeline}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
