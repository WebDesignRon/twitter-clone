import React from 'react';

const NavButton: React.FC<{ path: string }> = ({ path }) => (
  <div className="px-2">
    <button
      className="rounded-full outline-none fill-black m-0 p-0 bg-transparent"
      type="button"
    >
      <svg className="fill-inherit w-6 p-2 box-content" viewBox="0 0 24 24">
        <g>
          <path d={path} />
        </g>
      </svg>
    </button>
  </div>
);

export default NavButton;
