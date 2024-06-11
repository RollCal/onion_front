import React, {useState} from 'react';
import {
    Alert, AlertIcon,
    Box,
    Button, ButtonGroup,
    Card,
    CardBody,
    CardHeader,
    Grid, GridItem,
    Heading, Input,
    InputGroup,
    InputLeftAddon,
} from "@chakra-ui/react";
import Layout from "../Layout";
import axios from "axios";
import {useNavigate} from "react-router";

function CreateVersus(props) {
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const VersusCreateButtonHandler = () => {
        setError();
        // 로컬스토리지에서 토큰 가져오기
        const token = localStorage.getItem("token");
        // 헤더에 넣기
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        // input title 에서 가져오기
        const versus_title = document.getElementById("versus_title").value;
        // input orange_title에서 가져오기
        const orange_title = document.getElementById("orange_title").value;
        // input purple_title에서 가져오기
        const purple_title = document.getElementById("purple_title").value;

        if (!versus_title) {
            setError("Versus Title을 입력해주세요.");
            return;
        }

        if (!orange_title) {
            setError("Orange Title을 입력해주세요.");
            return;
        }

        if (!purple_title) {
            setError("Purple Title을 입력해주세요.");
            return;
        }

        axios.post("/api/onions/onionlist/", {
            title: versus_title,
            orange_title,
            purple_title,
        }, config)
            .then(function (response) {
                alert("정상적으로 등록되었습니다!");
                navigate("/");
            })
            .catch(function (error) {
                alert("로그인이 필요합니다!");
            })
    }


    return (
        <Layout>
            <Box style={{display: 'flex', justifyContent: 'center'}} gap={3}>
                <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                    <GridItem colSpan={2}>
                        {error && (
                            <Alert status="error" mb={4}>
                                <AlertIcon/>
                                {error}
                            </Alert>
                        )}
                    </GridItem>
                    {/* 첫 번째 카드에 colSpan={2} 속성 적용 */}
                    <GridItem colSpan={2}>
                        <Card border='2px' borderColor='red.300'>
                            <CardBody>
                                <InputGroup>
                                    <InputLeftAddon>Onion Versus Title</InputLeftAddon>
                                    <Input type='text' id="versus_title" placeholder='Versus Title' maxLength={30}/>
                                </InputGroup>
                            </CardBody>
                        </Card>
                    </GridItem>
                    <GridItem>
                        <Card border='2px' borderColor='red.300'>
                            <CardHeader align='center'>
                                <Heading size='md'>Orange</Heading>
                            </CardHeader>
                            <CardBody>
                                <InputGroup>
                                    <InputLeftAddon>Orange Title</InputLeftAddon>
                                    <Input type='text' id="orange_title" placeholder='Orange Title' maxLength={30}/>
                                </InputGroup>
                            </CardBody>
                        </Card>
                    </GridItem>
                    <GridItem>
                        <Card border='2px' borderColor='purple.500'>
                            <CardHeader align='center'>
                                <Heading size='md'>Purple</Heading>
                            </CardHeader>
                            <CardBody>
                                <InputGroup>
                                    <InputLeftAddon>Purple Title</InputLeftAddon>
                                    <Input type='text' id="purple_title" placeholder='Purple Title' maxLength={30}/>
                                </InputGroup>
                            </CardBody>
                        </Card>
                    </GridItem>
                    <GridItem colSpan={2} align='right'>
                        <ButtonGroup gap='2'>
                            <Button border='2px' onClick={VersusCreateButtonHandler}>
                                등록
                            </Button>
                            <Button border='2px' onClick={() => {
                                navigate("/");
                            }}>
                                취소
                            </Button>
                        </ButtonGroup>
                    </GridItem>
                </Grid>
            </Box>
        </Layout>
    );
}

export default CreateVersus;