import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Signup from './pages/signup';
import Profile from './pages/profile';
import 'tailwindcss/tailwind.css';
import { AuthProvider } from './contexts/authContext';
import { UserInfoProvider } from './contexts/userInfoContext';
import { ThemeProvider } from './contexts/themeContext';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UserInfoProvider>
          <ThemeProvider>
            <Routes>
              <Route path="/" element={<Signup />} />
              <Route path="/home" element={<App />} />
              <Route path="/users/:username" element={<Profile />} />
            </Routes>
          </ThemeProvider>
        </UserInfoProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);
