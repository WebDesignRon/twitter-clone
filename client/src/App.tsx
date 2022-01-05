import React from 'react';
import MainColumn from './MainColumn';
import SideNavbar from './SideNavbar';

const App: React.FC = () => (
  <div className="flex h-full justify-center bg-inherit">
    <SideNavbar />
    <MainColumn />
  </div>
);

export default App;
