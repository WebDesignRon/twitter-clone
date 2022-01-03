import React from 'react';
import MainColumn from './MainColumn';
import SideNavbar from './SideNavbar';

const App: React.FC = () => (
  <div className="flex h-full">
    <SideNavbar />
    <MainColumn />
  </div>
);

export default App;
