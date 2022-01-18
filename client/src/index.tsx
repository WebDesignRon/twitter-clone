import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Signup from './pages/signup';
import 'tailwindcss/tailwind.css';
import { AuthProvider } from './contexts/authContext';
import { UserInfoProvider } from './contexts/userInfoContext';
import { ThemeProvider } from './contexts/themeContext';

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <UserInfoProvider>
        <ThemeProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Signup />} />
              <Route path="/home" element={<App />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </UserInfoProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
