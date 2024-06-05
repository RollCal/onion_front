import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import LogoutNotificationModal from './LogoutNotification';

export const GlobalContext = createContext({});

export const GlobalProvider = ({ children }) => {
  console.log("render")
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [showLogoutNotification, setShowLogoutNotification] = useState(false);
  function Login () {
    setIsLoggedIn(true)
  }
  function Logout () {
    setIsLoggedIn(false)
  }

  return (
    <GlobalContext.Provider value={{ isLoggedIn, Login, Logout }}>
      {children}
      {/*{showLogoutNotification && <LogoutNotificationModal onClose={() => setShowLogoutNotification(false)} />}*/}
    </GlobalContext.Provider>
  );
};


