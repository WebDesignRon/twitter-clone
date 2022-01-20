import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserIcon } from './components/atoms/icon';
import NavButton from './NavButton';
import { UserInfoContext } from './contexts/userInfoContext';

const SideNavbar: React.FC = () => {
  const userInfo = useContext(UserInfoContext);

  return (
    <div className="flex flex-col justify-between h-[100vh] py-4 sticky top-0">
      <div className="m-0 w-20">
        <Link to="/home" className="flex flex-col items-center mt-0.5 mb-1">
          <NavButton path="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z" />
        </Link>
      </div>
      <div className="m-0 w-20">
        <Link
          to={`/users/${userInfo.username}`}
          className="flex justify-center items-center mt-0.5 mb-1"
        >
          <UserIcon
            additionalClassName="w-[38px] h-[38px]"
            src={
              userInfo.icon ??
              `${process.env.PUBLIC_URL}/default-user-image.png`
            }
          />
        </Link>
      </div>
    </div>
  );
};

export default SideNavbar;
