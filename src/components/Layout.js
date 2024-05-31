import React from 'react';
import {Box, Button, ButtonGroup, Flex, Grid, GridItem, Image, Spacer} from '@chakra-ui/react'
import OnionVersus from "./onionversus/OnionVersus";
import {Link} from "react-router-dom";

function Layout(props) {
    return (
        <div style={{display: 'flex', justifyContent: 'center', height: '100vh',}}>
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
                                <Image src="/images/logo.png" />
                            </Link>
                        </Box>
                        <Spacer/>
                        <ButtonGroup gap='2'>
                            <Button colorScheme='teal' bgColor="#F24822">Sign Up</Button>
                            <Button colorScheme='teal' bgColor="#9747FF">Log in</Button>
                        </ButtonGroup>
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
        </div>
    );
}

export default Layout;