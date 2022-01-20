import React, { useContext, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { TwitterButtonWithForwardRef } from './components/atoms/button';
import { FlexibleTextarea } from './components/atoms/textarea';
import { UserIcon } from './components/atoms/icon';
import { UserInfoContext } from './contexts/userInfoContext';

const DoTweetBox: React.VFC<{ submitTweet: (tweet: string) => void }> = ({
  submitTweet,
}) => {
  const userInfo = useContext(UserInfoContext);
  const [tweet, setTweet] = useState('');
  const tweetButtonRef = useRef<HTMLButtonElement>(null);

  const textareaOnChange = (text: string) => {
    setTweet(text);
    if (
      text.replaceAll('\n', '').trim() === '' &&
      tweetButtonRef.current !== null
    ) {
      tweetButtonRef.current.style.opacity = '0.5';
      tweetButtonRef.current.disabled = true;
    } else if (tweetButtonRef.current !== null) {
      tweetButtonRef.current.style.opacity = '1';
      tweetButtonRef.current.disabled = false;
    }
  };

  const tweetButtonOnClick = () => {
    if (tweetButtonRef.current !== null && !tweetButtonRef.current.disabled) {
      submitTweet(tweet);
      setTweet('');
      tweetButtonRef.current.disabled = true;
      tweetButtonRef.current.style.opacity = '0.5';
    }
  };

  return (
    <div className="flex p-2.5 outline-none items-stretch border-b-10">
      <Link to={`/users/${userInfo?.username}`} className="mx-2.5 shrink-0">
        <UserIcon
          src={
            userInfo?.icon ?? `${process.env.PUBLIC_URL}/default-user-image.png`
          }
          additionalClassName="w-12"
        />
      </Link>
      <div className="w-full">
        <div className="my-2.5">
          <FlexibleTextarea
            value={tweet}
            additionalClassName="resize-none w-full outline-none box-border text-xl"
            onChange={textareaOnChange}
            placeholder="いまどうしてる？"
          />
        </div>
        <div className="flex w-full justify-end pr-2">
          <TwitterButtonWithForwardRef
            onClick={tweetButtonOnClick}
            ref={tweetButtonRef}
            disabled={tweet === ''}
            additionalClassName="opacity-50"
          >
            <span className="font-bold text-white">ツイートする</span>
          </TwitterButtonWithForwardRef>
        </div>
      </div>
    </div>
  );
};

export default DoTweetBox;
