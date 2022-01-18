import React from 'react';
import TweetScroller from './TweetScroller';
import { UserInfoInput } from './components/molecules/input';

const MainColumn: React.FC = () => (
  <div className="m-0 h-full min-h-screen w-150 border-x">
    <div className="sticky top-0 px-2.5 py-3 border-b bg-white">
      <span className="text-black font-bold text-xl">ホーム</span>
    </div>
    <UserInfoInput name="username" maxLength={30} labelName="名前" />
    <TweetScroller />
  </div>
);

export default MainColumn;
