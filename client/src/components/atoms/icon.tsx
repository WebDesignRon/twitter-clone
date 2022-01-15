import React from 'react';

export interface UserIconProps {
  src?: string;
  userId?: number;
  alt?: string;
  additionalClassName?: string;
  onClick?: () => void;
}

export const UserIcon: React.VFC<UserIconProps> = ({
  additionalClassName,
  alt,
  src = 'https://pbs.twimg.com/profile_images/1111729635610382336/_65QFl7B_normal.png',
  onClick,
}) => (
  <button onClick={onClick} type="button">
    <img
      src={src}
      className={`rounded-full object-fill ${additionalClassName}`}
      alt={alt}
    />
  </button>
);
