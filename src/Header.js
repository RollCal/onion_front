import React, { useState, useEffect } from 'react';
import {Button, Flex, Box, Image} from '@chakra-ui/react';
import LoginModal from './components/LoginModal';
import SignUpModal from "./components/SignUpModal";
import { GlobalProvider } from './components/GlobalState';

function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogin = (token) => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };


    return (
        <Flex as="header" p={4} bg="teal.500" backgroundColor={"white"} justifyContent="space-between">
            <Box><Image src="/images/logo.png" /></Box>
            <Box>
                {isLoggedIn ? (
                    <Button variant="ghost" onClick={handleLogout}>
                        Log out
                    </Button>
                ) : (
                    <>
                        <GlobalProvider>
                            <SignUpModal />
                            <LoginModal onLogin={handleLogin} />
                        </GlobalProvider>
                    </>
                )}
            </Box>
        </Flex>
    );
}

export default Header;
