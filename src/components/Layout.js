import React, {useEffect, useState} from 'react';
import {Box, Button, ButtonGroup, Flex, Grid, GridItem, Image, Spacer} from '@chakra-ui/react'
import {Link} from "react-router-dom";
import SignUpModal from "./SignUpModal";
import LoginModal from "./LoginModal";

function Layout(props) {

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
                                <Button variant="ghost" onClick={handleLogout}>
                                    Log out
                                </Button>
                            ) : (
                                <>
                                    <ButtonGroup gap='2'>
                                    <SignUpModal/>
                                    <LoginModal onLogin={handleLogin}/>
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