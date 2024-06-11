import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import LogoutNotificationModal from './LogoutNotification';

export const GlobalContext = createContext({});

export const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [showLogoutNotification, setShowLogoutNotification] = useState(false);
  function Login () {
    setIsLoggedIn(true)
  }
  function Logout () {
    localStorage.removeItem('loginTime');
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    localStorage.removeItem('username');
    setIsLoggedIn(false)
  }

  return (
    <GlobalContext.Provider value={{ isLoggedIn, Login, Logout }}>
      {children}
      {/*{showLogoutNotification && <LogoutNotificationModal onClose={() => setShowLogoutNotification(false)} />}*/}
    </GlobalContext.Provider>
  );
};


