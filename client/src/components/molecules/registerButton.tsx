import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faApple, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { TwitterButton } from '../atoms/button';

export const RegisterWithGoogleButton: React.VFC = () => (
  <TwitterButton
    additionalClassName="bg-white hover:bg-[#f8faff] w-[300px] max-w-[400px]"
    onClick={() => {}}
  >
    <div className="py-1">
      <FontAwesomeIcon icon={faGoogle} className="text-gray-500 mr-1" />
      <span className="text-[14px] text-black font-medium">Google で登録</span>
    </div>
  </TwitterButton>
);

export const RegisterWithAppleButton: React.VFC = () => (
  <TwitterButton
    additionalClassName="bg-white hover:bg-[#f8faff] w-[300px] max-w-[400px]"
    onClick={() => {}}
  >
    <div className="py-1">
      <FontAwesomeIcon icon={faApple} className="text-black mr-1" />
      <span className="text-sm text-black font-bold">
        Appleのアカウントで登録
      </span>
    </div>
  </TwitterButton>
);
