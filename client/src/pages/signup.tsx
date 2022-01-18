import React from 'react';
import StartTwitter from '../components/organisms/startTwitter';

const Signup: React.VFC = () => (
  <div className="flex flex-col w-full h-full bg-blackTheme text-[#d9d9d9]">
    <div className="flex flex-col lg:flex-row-reverse lg:grow lg:shrink lg:basis-auto">
      <StartTwitter />
      <div className="min-h-[45vh]">
        <div className="flex relative inset-0 justify-center h-full w-full">
          <div className="flex justify-center items-strech inset-0">
            <div className="relative">
              <img
                className="object-cover w-full h-full"
                src="https://abs.twimg.com/sticky/illustrations/lohp_1302x955.png"
                alt=""
              />
            </div>
            <svg
              viewBox="0 0 24 24"
              className="absolute max-w-full p-8 h-fit max-h-full lg:max-h-[380px] text-white fill-white self-center"
            >
              <g>
                <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
    <footer className="flex flex-wrap justify-center px-4 py-3 bg-blackTheme">
      {[
        'Twitterについて',
        'ヘルプセンター',
        '利用規約',
        'プライバシーポリシー',
        'Cookieのポリシー',
        'アクセシビリティ',
        '広告情報',
        'ブログ',
        'ステータス',
        '採用情報',
        'ブランドリソース',
        '広告',
        'マーケティング',
        'Twitterのビジネス活用',
        '開発者',
        'プロフィール一覧',
        '設定',
        '© 2022 Twitter, Inc.',
      ].map((text, _) => (
        <div
          key={text}
          className="text-gray-400 text-[13px] pr-4 mt-1 hover:underline cursor-pointer"
        >
          {text}
        </div>
      ))}
    </footer>
  </div>
);

export default Signup;
