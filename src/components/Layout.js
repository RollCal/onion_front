import React, { useContext, useEffect } from 'react';
import { Box, Button, ButtonGroup, Flex, Grid, GridItem, Image, Spacer, Tooltip, useMediaQuery } from '@chakra-ui/react';
import { Link } from "react-router-dom";
import SignUpModal from "./SignUpModal";
import LoginModal from "./LoginModal";
import { AddIcon } from '@chakra-ui/icons';
import { useNavigate } from "react-router";
import { GlobalContext } from "./GlobalState";

function Layout(props) {
    const navigate = useNavigate();
    const { isLoggedIn, Login, Logout } = useContext(GlobalContext);
    const [isMobileView] = useMediaQuery("(max-width: 1050px)");

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            Login(true);
        }
    }, [Login]);

    useEffect(() => {
        const checkLoginStatus = () => {
            const loginTime = parseInt(localStorage.getItem('loginTime'), 10);
            const currentTime = new Date().getTime();
            if (isLoggedIn && (!loginTime || currentTime - loginTime > 3 * 60 * 60 * 1000)) { // 3시간 경과
                localStorage.removeItem('loginTime');
                localStorage.removeItem('token');
                localStorage.removeItem('refresh');
                localStorage.removeItem('username');
                Logout();
            }
        };

        const intervalId = setInterval(checkLoginStatus, 60 * 1000); // 1분마다 상태 체크
        return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 정지
    }, [isLoggedIn, Logout]);

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
            gap='1'
            color='blackAlpha.700'
            fontWeight='bold'
            container
            width='100%'
        >
            <GridItem area={'header'} display="flex" alignItems="center" justifyContent="space-evenly">
                <Flex
                    width='100%'
                    alignItems='center'
                    gap='2'
                    justifyContent="space-between"
                    display="flex"
                    flexDirection="row"
                    pl='3%'
                    pr='3%'
                    borderBottom='1px solid black'
                >
                    <Box display={isMobileView ? 'none' : 'block'}>
                        <Link to="/">
                            <Image src="/images/logo.png" alt="Logo"/>
                        </Link>
                    </Box>
                    <Spacer/>
                    <Box mt={isMobileView ? '145px' : '0'}>
                        {isLoggedIn ? (
                            <ButtonGroup gap='2'>
                                <Tooltip label='Create Onion Versus'>
                                    <Button
                                        color="#F24822"
                                        border="3px solid"
                                        borderColor="#F24822"
                                        bgColor="white"
                                        onClick={() => navigate("/versus/create")}
                                        position="fixed"
                                        width="60px"
                                        height="60px"
                                        bottom="8%"
                                        right="4%"
                                        _hover={{
                                            bgColor: "#F24822",
                                            color: "white",
                                        }}
                                    >
                                        <AddIcon boxSize={7} strokeWidth={1} />
                                    </Button>
                                </Tooltip>
                                <Button bg="white" color="purple" border='2px' borderColor='purple' onClick={handleLogout}>
                                    로그아웃
                                </Button>
                            </ButtonGroup>
                        ) : (
                            <ButtonGroup gap='2'>
                                <SignUpModal/>
                                <LoginModal/>
                            </ButtonGroup>
                        )}
                    </Box>
                </Flex>
            </GridItem>
            <GridItem area={'main'} display="flex" alignItems="center" justifyContent="space-evenly">
                <Flex width='100%' display="flex" alignItems="center" justifyContent="space-evenly">
                    {props.children}
                </Flex>
            </GridItem>
            {/*<GridItem bg='white' area={'footer'} align='center' position={'relative'} transform={'translate(-100%)'}>*/}
            {/*    <Grid templateColumns="repeat(1, 1fr)" pb="10">*/}
            {/*        <GridItem>*/}
            {/*            <Text as="b" fontSize='lg'>Proudly made in '선동과날조 team'</Text>*/}
            {/*        </GridItem>*/}
            {/*        <GridItem>*/}
            {/*            <Tooltip label="ONION_FRONT">*/}
            {/*                <Button bg="white" onClick={() => window.open("https://github.com/RollCal/onion_front")}>*/}
            {/*                    <FaGithubSquare size="30px"/>*/}
            {/*                </Button>*/}
            {/*            </Tooltip>*/}
            {/*            <Tooltip label="ONION_BACK">*/}
            {/*                <Button bg="white" onClick={() => window.open("https://github.com/RollCal/onion")}>*/}
            {/*                    <FaGithub size="30px"/>*/}
            {/*                </Button>*/}
            {/*            </Tooltip>*/}
            {/*        </GridItem>*/}
            {/*    </Grid>*/}
            {/*</GridItem>*/}
        </Grid>
    );
}

export default Layout;
