import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    ButtonGroup,
    Flex,
    Grid,
    GridItem,
    Image,
    Spacer, Text,
    Tooltip
} from '@chakra-ui/react'
import {Link} from "react-router-dom";
import SignUpModal from "./SignUpModal";
import LoginModal from "./LoginModal";
import {AddIcon} from '@chakra-ui/icons'
import {useNavigate} from "react-router";
import {FaSquareGithub} from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";

function Layout(props) {

    const navigate = useNavigate();

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
            <GridItem bg='white' area={'footer'} align='center' p={10}>
                <Grid templateColumns="repeat(1, 1fr)" pb="10">
                    <GridItem>
                        <Text as="b" fontSize='lg'>Proudly made in '선동과날조 team'</Text>
                    </GridItem>
                    <GridItem>
                        <Tooltip label="ONION_FRONT">
                            <Button bg="white" onClick={() => {
                                window.open("https://github.com/RollCal/onion_front");
                            }}>
                                <FaSquareGithub size="30px"/>
                            </Button>
                        </Tooltip>
                        <Tooltip label="ONION_BACK">
                            <Button bg="white" onClick={() => {
                                window.open("https://github.com/RollCal/onion");
                            }}>
                                <FaGithub size="30px"/>
                            </Button>
                        </Tooltip>
                    </GridItem>
                </Grid>
            </GridItem>
        </Grid>
    );
}

export default Layout;