import React, { createContext, useContext, useState, useEffect } from 'react';
import LogoutNotificationModal from './LogoutNotification';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutNotification, setShowLogoutNotification] = useState(false);

  // useEffect(() => {
  //   const checkLoginStatus = () => {
  //     const loginTime = parseInt(localStorage.getItem('loginTime'), 10);
  //     const currentTime = new Date().getTime();
  //     if (isLoggedIn && (!loginTime || currentTime - loginTime > 180000)) { // 3분 경과
  //       setIsLoggedIn(false);
  //       localStorage.removeItem('loginTime');
  //       localStorage.removeItem('token');
  //       localStorage.removeItem('refresh');
  //       setShowLogoutNotification(true);
  //     }
  //   };

  //   const intervalId = setInterval(checkLoginStatus, 3000); // 3초마다 상태 체크
  //   return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 정지
  // }, [isLoggedIn]);

  return (
    <GlobalContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
      {showLogoutNotification && <LogoutNotificationModal onClose={() => setShowLogoutNotification(false)} />}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);
