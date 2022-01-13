import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'tailwindcss/tailwind.css';
import { AuthProvider } from './contexts/authContext';
import { UserInfoProvider } from './contexts/userInfoContext';
import { ThemeProvider } from './contexts/themeContext';

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <UserInfoProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </UserInfoProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
