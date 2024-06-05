import React, {useContext, useEffect, useState} from 'react';
import {Box, Button, ButtonGroup, Divider, Flex, Grid, GridItem, Image, Spacer, Tooltip} from '@chakra-ui/react'
import {Link} from "react-router-dom";
import SignUpModal from "./SignUpModal";
import LoginModal from "./LoginModal";
import {AddIcon} from '@chakra-ui/icons'
import {useNavigate} from "react-router";
import {GlobalContext} from "./GlobalState";

function Layout(props) {

    const navigate = useNavigate();


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
            if (isLoggedIn && (!loginTime || currentTime - loginTime > 3 * 60 * 60 * 1000)) { // 3시간 경과
                localStorage.removeItem('loginTime');
                localStorage.removeItem('token');
                localStorage.removeItem('refresh');
                Logout();
            }
        };

        const intervalId = setInterval(checkLoginStatus, 60 * 1000); // 3초마다 상태 체크
        return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 정지
    }, [isLoggedIn]);


    const handleLogout = () => {
        localStorage.removeItem('token');
        Logout();
    };


    return (
        <Grid
            templateAreas={`
            "header header" 
            "main main" 
            "footer footer"
            `}
            gridTemplateRows={'100px 1fr 30px'}
            gridTemplateColumns={'200px 1fr'}
            h='200px'
            gap='1'
            color='blackAlpha.700'
            fontWeight='bold'
        >
            <GridItem pl='2' bg='white' area={'header'}
                      alignItems="center" p={2}>
                <Flex minWidth='max-content' alignItems='center' gap='2'>
                    <Box p='2'>

                        <Link to="/">
                            <Image src="/images/logo.png"/>
                        </Link>
                    </Box>
                    <Spacer/>
                    <Box>
                        {isLoggedIn ? (
                            <ButtonGroup gap='2'>
                                <Tooltip label='Create Onion Versus'>
                                    <Button color="#F24822" border='2px' borderColor='#F24822'
                                            bgColor="white" onClick={() => {
                                        navigate("/versus/create");
                                    }}>
                                        <AddIcon/>
                                    </Button>
                                </Tooltip>
                                <Button color="purple" border='2px' borderColor='purple' onClick={handleLogout}>
                                    Log out
                                </Button>
                            </ButtonGroup>
                        ) : (
                            <>
                                <ButtonGroup gap='2'>
                                    <SignUpModal/>
                                    <LoginModal/>
                                </ButtonGroup>
                            </>
                        )}
                    </Box>
                </Flex>
            </GridItem>
            <GridItem pl='2' bg='white' area={'main'} display="flex" alignItems="center"
                      justifyContent="space-evenly">
                <Flex alignItems='center'>
                    {props.children}
                </Flex>
            </GridItem>
            <GridItem pl='2' bg='white' area={'footer'}>
                Footer
            </GridItem>
        </Grid>
    );
}

export default Layout;
