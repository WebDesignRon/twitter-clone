import React, { useState } from 'react';

const DoTweetBox: React.FC<{ submitTweet: (tweet: string) => void }> = ({
  submitTweet,
}) => {
  const [tweet, setTweet] = useState('');

  const textareaOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(event.target.value);
  };

  const tweetButtonOnClick = () => {
    submitTweet(tweet);
    setTweet('');
  };

  return (
    <div className="flex p-2.5 outline-none items-stretch border-b-10">
      <div className="mx-2.5 shrink-0">
        <img
          className="rounded-full w-12"
          src="https://pbs.twimg.com/profile_images/1111729635610382336/_65QFl7B_normal.png"
          alt=""
        />
      </div>
      <div className="w-full">
        <div className="my-2.5">
          {/* FIXME:  textareaの縦幅をテキストに合わせる textarea-autosize */}
          <textarea
            className="resize-none w-full outline-none box-border text-xl"
            onChange={textareaOnChange}
            placeholder="いまどうしてる？"
            value={tweet}
          />
        </div>
        <div>
          <button
            className="px-3 py-1 bg-sky-500 hover:bg-sky-600 rounded-full outline-none"
            onClick={tweetButtonOnClick}
            type="submit"
          >
            <span className="font-bold text-white">Tweetする</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoTweetBox;
