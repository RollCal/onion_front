import React, {useState, useEffect, useContext} from 'react';
import {Button, Flex, Box, Image} from '@chakra-ui/react';
import LoginModal from './components/LoginModal';
import SignUpModal from "./components/SignUpModal";
import {GlobalProvider, GlobalContext} from './components/GlobalState';

function Header() {
    const {isLoggedIn, Login, Logout} = useContext(GlobalContext)

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            Login(true);
        }
    }, []);

    useEffect(() => {
        console.log("effect")

        const checkLoginStatus = () => {
            const loginTime = parseInt(localStorage.getItem('loginTime'), 10);
            const currentTime = new Date().getTime();
            console.log(currentTime, loginTime)
            if (isLoggedIn && (!loginTime || currentTime - loginTime > 10000)) { // 3분 경과
                localStorage.removeItem('loginTime');
                localStorage.removeItem('token');
                localStorage.removeItem('refresh');
                Logout();
            }
        };

        const intervalId = setInterval(checkLoginStatus, 3000); // 3초마다 상태 체크
        return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 정지
    }, [isLoggedIn]);


    const handleLogout = () => {
        localStorage.removeItem('token');
        Logout();
    };


    return (
        <Flex as="header" p={4} bg="teal.500" backgroundColor={"white"} justifyContent="space-between">
            <Box><Image src="/images/logo.png"/></Box>
            <Box>
                {isLoggedIn ? (
                    <Button variant="ghost" onClick={handleLogout}>
                        Log out
                    </Button>
                ) : (
                    <>
                        <SignUpModal/>
                        <LoginModal/>
                    </>
                )}
            </Box>
        </Flex>
    );
}

export default Header;
