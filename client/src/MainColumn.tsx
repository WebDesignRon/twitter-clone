import React from 'react';
import TweetScroller from './TweetScroller';

const MainColumn: React.FC = () => (
  <div className="m-0 h-full min-h-screen w-150 border-x">
    <div className="sticky top-0 px-2.5 py-3 border-b bg-white">
      <span className="text-black font-bold text-xl">ホーム</span>
    </div>
    <TweetScroller />
  </div>
);

export default MainColumn;
