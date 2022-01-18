import React from 'react';
import {
  RegisterWithAppleButton,
  RegisterWithGoogleButton,
} from '../molecules/registerButton';
import UserInfoInputForm from './signupForm';

const StartTwitter: React.VFC = () => (
  <div className="lg:p-4 lg:min-w-[45vw] flex items-center items-start justify-center lg:justify-start">
    <div className="p-5 flex flex-col max-w-[600px] lg:max-w-[760px]">
      <svg
        viewBox="0 0 24 24"
        className="fill-[#d9d9d9] h-16 pb-3 max-w-full self-start"
      >
        <g>
          <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
        </g>
      </svg>
      <div className="text-inherit my-10">
        <span className="text-[40px] sm:text-[64px] font-bold">
          すべての話題が、ここに。
        </span>
      </div>
      <div className="mb-7">
        <span className="text-3xl font-bold">Twitterをはじめよう</span>
      </div>
      <RegisterWithGoogleButton />
      <div className="my-1" />
      <RegisterWithAppleButton />
      <div className="flex my-1 w-[300px] max-w-[380px]">
        <div className="flex flex-row my-1 -mx-1 w-full">
          <div className="flex grow items-center mx-1">
            <div className="h-px bg-[#2f3336] w-full" />
          </div>
          <div>
            <span>または</span>
          </div>
          <div className="flex grow items-center mx-1">
            <div className="h-px bg-[#2f3336] w-full" />
          </div>
        </div>
      </div>
      <UserInfoInputForm />
    </div>
  </div>
);

export default StartTwitter;
