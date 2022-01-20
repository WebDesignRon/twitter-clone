import React from 'react';

export interface IProfileNavbarProps {
  onClick: (type: string) => void;
}

export const ProfileNavbar: React.VFC<IProfileNavbarProps> = ({ onClick }) => (
  <div className="flex items-center justify-around h-[50px] border-b">
    <button
      type="button"
      onClick={() => onClick('tweets')}
      className="grow hover:bg-[#e7e7e8] h-full duration-150 text-gray-700"
    >
      <div>ツイート</div>
    </button>
    <button
      type="button"
      onClick={() => onClick('tweets')}
      className="grow hover:bg-[#e7e7e8] h-full duration-150 text-gray-700"
    >
      <div>ツイートと返信</div>
    </button>
    <button
      type="button"
      onClick={() => onClick('medias')}
      className="grow hover:bg-[#e7e7e8] h-full duration-150 text-gray-700"
    >
      <div>メディア</div>
    </button>
    <button
      type="button"
      onClick={() => onClick('likes')}
      className="grow hover:bg-[#e7e7e8] h-full duration-150 text-gray-700"
    >
      <div>いいね</div>
    </button>
  </div>
);
